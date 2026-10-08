/* Games, parties, hostility and the rig, over one WebSocket per player.

   The shape is Diablo II's, including the bit people forget: a **game** is the shared
   world, and it holds eight. A **party** is a smaller agreement inside that game about
   sharing experience. You can be in a game with seven other people and in a party with
   none of them. Monsters get tougher with the number of people in the game, not the party.

   Scoping everything to a game of eight is also what makes the server safe to post
   publicly: every cost below is bounded by the size of a game rather than by the number
   of people on the server.

   The rules: a party is an invitation both sides agree to; experience is one pool, split
   by level among the members in the district; hostility is declared in town rather than
   ambient, it throws you out of the party, and standing down clears only your own flag.
   Town is safe. The arena is not.

   What the server is authoritative over: who exists, which game they are in, who is in
   which party, who is hostile to whom, who is in which district, the layout seed for each
   district of that game, the Simulator's wave number and wave seed, and — inside a game,
   outside town — a monster's hit points and the experience for killing it. One client in
   the district (the host) still moves the machines. The server does not run their AI. */
'use strict';
const crypto = require('crypto');
const ws = require('./ws');
const guard = require('./guard');
const mobMath = require('./mobs');
const { buildId } = require('./buildid');
const intake = require('./intake');
const plaus = require('./plaus');
const { turnCfg } = require('./turn');
const { FORMULAS, auraRadius, auraRank, pailMax, pailRate } = require('../../src/formulas');

const MAX_GAME = 8;                /* Diablo II's number, and the reason this scales */
const MAX_PARTY = 8;
const MAX_GAMES = +(process.env.MAX_GAMES || 200);
const MAX_PLAYERS = +(process.env.MAX_PLAYERS || 400);
/* One pool for the party, then a level-weighted split. Diablo II 1.08 added a flat
   35% when another member was in the district. It did not grow with party size.
   gameScale, which follows the people in the game, is separate and stays. */
const PARTY_POOL = 1.35;
const PVP_SCALE = 0.25;            /* players are much tougher to each other than monsters */
/* Stand in town this long before the first declaration. The minute between
   naming the same person again, and the ten-second portal lock, stay. */
const HOSTILE_ARM = 3000;
const TOWNS = new Set([0, 17, 18, 21, 27]);
const SIM_ZONE = 6;
/* Three difficulties, chosen when the game is made and fixed for its life, the way
   Diablo II's were. Harder monsters, and more experience for beating them. */
const DIFFS = {
  normal:    { n: 'Normal',    hp: 1,   dmg: 1,   xp: 1   },
  nightmare: { n: 'Nightmare', hp: 2.5, dmg: 1.6, xp: 1.8 },
  hell:      { n: 'Hell',      hp: 5,   dmg: 2.4, xp: 2.8 }
};

const live = new Map();            /* uid -> player */
const games = new Map();           /* game id -> game */
const parties = new Map();         /* party id -> party */
/* uid -> { id, game, until } kept after a dropped socket's grace runs out, so the same
   account can be put back in the party if the game is still there. */
const partyMemo = new Map();
const GRACE_MS = +(process.env.RESUME_GRACE_MS || 45000);
let partySeq = 1, gameSeq = 1;
let msgN = 0;

const nowSec = () => Math.floor(Date.now() / 1000);
const clean = (s, n) => String(s === undefined || s === null ? '' : s).slice(0, n);

function send(p, t, d) { if (p && p.conn) p.conn.send(Object.assign({ t }, d)); }
function sys(p, text) { send(p, 'sys', { text }); }
function notice(p, text) { send(p, 'sys', { text, notice: 1 }); }

/* Reported max life is what player-damage is capped against. A tiny report would make
   somebody unkillable; a huge one would let one packet delete them. The floor tracks
   level. The ceiling is far above any honest character. */
function takeVitals(p, m) { plaus.clampVitals(p, m, Date.now(), partyCover(p)); }

/* Loaded inside the call. social.js requires this module at the top, so a
   top-level require here would hand it the exports object before it is filled. */
function socialMod() { return require('./social'); }

/* What a mutual friend is allowed to know. No game id and no document id:
   joining a game that has left the lobby goes through the friend's uid. */
function proj(p, mutual) {
  const o = { uid: p.uid, name: p.name, online: true, cls: p.cls || '', lvl: +p.lvl || 1 };
  if (mutual && p.game) {
    const g = games.get(p.game);
    if (g && g.name) o.gameName = g.name;
  }
  return o;
}
function pushFriends(p) {
  if (!p) return;
  const book = socialMod();
  for (const row of book.links(p.uid)) {
    const q = live.get(row.uid);
    if (!q || q === p) continue;
    if (!book.between(p.uid, q.uid).mutual) continue;
    send(q, 'friend', proj(p, true));
    send(p, 'friend', proj(q, true));
  }
}
function pushOffline(p) {
  if (!p) return;
  const book = socialMod();
  for (const row of book.links(p.uid)) {
    const q = live.get(row.uid);
    if (!q || q === p) continue;
    if (!book.between(p.uid, q.uid).mutual) continue;
    send(q, 'friend', { uid: p.uid, name: p.name, online: false, cls: p.cls || '', lvl: +p.lvl || 1 });
  }
}
function poke(uid, text) {
  const p = live.get(uid);
  if (p && text) sys(p, text);
}

/* A whisper note stays off the game chat. The server does not keep the line. */
function whisperNote(p, text, extra) {
  send(p, 'whispernote', Object.assign({ text: text }, extra || {}));
}
function accountById(uid) {
  const u = require('./auth').byId(uid);
  if (!u || !u.id) return null;
  return { id: u.id, name: u.name };
}
function accountByName(name) {
  const u = require('./auth').findByName(name);
  if (!u || !u.id) return null;
  return { id: u.id, name: u.name };
}

/* ---------- games ---------- */
function gameOf(p) { return p.game ? games.get(p.game) : null; }
function gamePlayers(g) { return g ? [...g.players].map(u => live.get(u)).filter(Boolean) : []; }

function gameInfo(g) {
  return {
    id: g.id, name: g.name, n: g.players.size, max: MAX_GAME, locked: !!g.pass,
    host: g.host, created: g.created, diff: g.diff, diffName: DIFFS[g.diff].n
  };
}
function lobby() {
  return [...games.values()].filter(g => g.players.size > 0).map(gameInfo).sort((a, b) => b.created - a.created).slice(0, 60);
}
/* The lobby changes a lot and matters to everyone not yet in a game, so it is coalesced
   rather than sent per event. */
let lobbyT = null;
function pushLobby() {
  if (lobbyT) return;
  lobbyT = setTimeout(() => {
    lobbyT = null;
    const list = lobby();
    for (const p of live.values()) if (!p.game) send(p, 'lobby', { games: list, max: MAX_GAME, diffs: DIFFS });
  }, 300);
  if (lobbyT.unref) lobbyT.unref();
}

function pub(p) {
  return {
    uid: p.uid, name: p.name, lvl: p.lvl, cls: p.cls, zi: p.zi,
    party: p.party || null, hp: p.hp, hpm: p.hpm, hostile: [...p.hostile]
  };
}
function skillIx(v) {
  if (typeof v !== 'number' || !Number.isFinite(v)) return null;
  const n = v | 0;
  if (n !== v || n < 0) return null;
  if (n <= 14) return n;
  /* Item skills. Standing Call, Open Book, and Quiet Ledger sit at 101–103. */
  if (n >= 100 && n <= 105) return n;
  return null;
}
function auraIx(v) { return v === 3 || v === 4 || v === 7 ? v : null; }
function loc(p) {
  const bf = bfLiveMap(p);
  return {
    uid: p.uid, name: p.name, lvl: p.lvl, cls: p.cls, x: p.x, y: p.y, hp: p.hp, hpm: p.hpm, dir: p.dir,
    sk: p.sk == null ? null : p.sk, au: p.au == null ? null : p.au, aL: p.au ? (p.aL || 1) : 0,
    node: p.au ? (p.node || 0) : 0, nm: p.nm || 0, bf: bf, tes: p.tes || null, sw: p.sw ? 1 : 0,
    pail: pailLoc(p)
  };
}

function cleanBf(v) {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return null;
  const out = {};
  for (const k of ['call', 'book', 'ledger']) {
    const n = +v[k];
    if (n > 0 && n <= 30) out[k] = Math.round(n * 10) / 10;
  }
  return (out.call || out.book || out.ledger) ? out : null;
}
function cleanTes(v) {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return null;
  const out = {};
  let n = 0;
  for (const k of Object.keys(v)) {
    if (n >= 8) break;
    const id = +k;
    if (!Number.isFinite(id) || (id | 0) !== id || id < 1) continue;
    const stacks = v[k] | 0;
    if (stacks < 1) continue;
    out[id] = Math.min(6, stacks);
    n++;
  }
  return n ? out : null;
}
function mobStacks(r) {
  if (!r || !r.tesBy) return 0;
  let n = 0;
  for (const u in r.tesBy) n = Math.max(n, r.tesBy[u] | 0);
  return n;
}
/* The witness's testimony map is stamped onto the machines, so a guest reads it
   from the mob snapshot and not only from the witness's own position packet. */
function stampTes(p) {
  const g = gameOf(p);
  if (!g || TOWNS.has(p.zi | 0)) return 0;
  const sample = mobSample(p);
  const z = g.zones && g.zones[mobKey(sample.zi, sample.tier, sample.inst)];
  if (!z) return 0;
  const map = p.tes || {};
  let changed = 0;
  for (const id in z.mobs) {
    const rec = z.mobs[id];
    if (!rec || !rec.tesBy || !(p.uid in rec.tesBy)) continue;
    if (!map[id]) { delete rec.tesBy[p.uid]; changed = 1; }
  }
  for (const id in map) {
    const rec = z.mobs[id];
    if (!rec || rec.dead) continue;
    rec.tesBy = rec.tesBy || {};
    if (rec.tesBy[p.uid] !== map[id]) { rec.tesBy[p.uid] = map[id]; changed = 1; }
  }
  return changed;
}
function pushMobSnap(g, sample) {
  const z = g.zones && g.zones[mobKey(sample.zi, sample.tier, sample.inst)];
  if (!z) return;
  const list = mobList(z);
  for (const q of mobHere(g, sample)) send(q, 'mobs', { zi: sample.zi | 0, tier: sample.tier | 0, list });
}
function clearPail(p) { p.pail = null; p.pailStore = 0; p.pailAt = null; }
function pailLoc(p) {
  if (!p || !p.pail || !(p.pailStore > 0)) return null;
  return {
    x: p.pail.x, y: p.pail.y, L: p.pail.L,
    hp: Math.round(p.pailStore), max: p.pail.max
  };
}
function cleanPail(p, raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const L = auraRank(raw.L) || 1;
  const x = +raw.x, y = +raw.y;
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  const cap = pailMax(p.hpm || 1, L);
  let max = Math.round(+raw.max || 0);
  let hp = Math.round(+raw.hp || 0);
  if (!(max > 0)) max = cap;
  if (max > cap) max = cap;
  if (hp > max) hp = max;
  if (!(hp > 0)) return null;
  return { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100, L, hp, max };
}
/* A new pail sets the one store. A later report does not refill it: heals leave
   through pail draws, so two clients cannot each spend a full copy. */
function notePail(p, raw) {
  if (raw == null) { if (p.pail) clearPail(p); return; }
  const row = cleanPail(p, raw);
  if (!row) { if (p.pail) clearPail(p); return; }
  const prev = p.pail;
  const moved = !prev || Math.hypot(prev.x - row.x, prev.y - row.y) > 0.8;
  const now = Date.now();
  if (!prev || !(p.pailStore > 0) || (moved && now - (p.pailPlaced || 0) >= 8000)) {
    p.pail = row;
    p.pailStore = row.hp;
    p.pailAt = {};
    p.pailPlaced = now;
    return;
  }
  p.pail.x = prev.x; p.pail.y = prev.y; p.pail.L = prev.L; p.pail.max = prev.max;
  p.pail.hp = p.pailStore;
}
/* A reported buff is a remaining duration, not a permanent flag. */
function noteBf(p, raw) {
  const bf = cleanBf(raw);
  p.bf = bf;
  p.bfUntil = {};
  if (!bf) return;
  const now = Date.now();
  for (const k in bf) p.bfUntil[k] = now + bf[k] * 1000;
}
function bfOn(p, k) {
  return !!(p && p.bfUntil && p.bfUntil[k] > Date.now());
}
function bfLiveMap(p) {
  if (!p || !p.bf) return null;
  const out = {};
  const now = Date.now();
  for (const k in p.bf) {
    if (!(p.bfUntil && p.bfUntil[k] > now)) continue;
    out[k] = Math.max(0.1, Math.round((p.bfUntil[k] - now) / 100) / 10);
  }
  return (out.call || out.book || out.ledger) ? out : null;
}
function sameRoom(a, b) {
  if (!a || !b || !a.game || a.game !== b.game) return false;
  return (a.zi | 0) === (b.zi | 0) && (a.inst || '') === (b.inst || '') && (a.tier | 0) === (b.tier | 0);
}
/* What a party member's aura or Standing Call is doing to this player, right now. */
function partyCover(p) {
  const out = { tox: 0, call: 0 };
  if (!p) return out;
  const consider = q => {
    if (!q) return;
    if (q !== p) {
      if (!p.party || q.party !== p.party || !sameRoom(p, q)) return;
      if ((p.hostile && p.hostile.has(q.uid)) || (q.hostile && q.hostile.has(p.uid))) return;
      const d = Math.hypot((+p.x || 0) - (+q.x || 0), (+p.y || 0) - (+q.y || 0));
      if (q.au === 3 && d < auraRadius(3, q.aL || 1)) out.tox = Math.max(out.tox, q.aL || 1);
      if (bfOn(q, 'call') && d < FORMULAS.aura.call.r) out.call = 1;
      return;
    }
    if (q.au === 3) out.tox = Math.max(out.tox, q.aL || 1);
    if (bfOn(q, 'call')) out.call = 1;
  };
  consider(p);
  if (p.party) {
    const party = parties.get(p.party);
    if (party) for (const uid of party.members) if (uid !== p.uid) consider(live.get(uid));
  }
  return out;
}

function inGame(g, t, d) { for (const q of gamePlayers(g)) send(q, t, d); }

/* The roster is the game, not the server: bounded at eight however busy the server is. */
let rosterT = new Set();
function pushRoster(g) {
  if (!g || rosterT.has(g.id)) return;
  rosterT.add(g.id);
  const h = setTimeout(() => {
    rosterT.delete(g.id);
    if (!games.has(g.id)) return;
    inGame(g, 'roster', { players: gamePlayers(g).map(pub), game: gameInfo(g), scale: gameScale(g) });
  }, 200);
  if (h.unref) h.unref();
}

/* Diablo II scaled a monster's health and its experience by the number of people in the
   game — not the party. Eight players means a monster with 4.5× the health, and worth
   4.5× the experience, so going in together is harder and pays more. */
function gameScale(g) {
  const n = g ? g.players.size : 1;
  const d = DIFFS[(g && g.diff) || 'normal'];
  return {
    players: n, diff: (g && g.diff) || 'normal', diffName: d.n,
    hp: d.hp * (1 + .5 * (n - 1)),
    dmg: d.dmg,
    xp: d.xp * (1 + .5 * (n - 1))
  };
}

/* One seed per district, per tier, per redraw. The client draws from it. A fresh
   ask (a subpoena, the bull field, a tier the table has not seen) mints the next
   roll so the previous layout stays put for anyone still standing in it. */
function mapRows(g) {
  const out = [];
  if (!g || !g.maps) return out;
  for (const k in g.maps) out.push(g.maps[k]);
  return out;
}
function mapRecord(g, zi, tier, fresh, tpl) {
  g.maps = g.maps || {};
  g.mapRoll = g.mapRoll || {};
  const base = zi + '/' + tier;
  if (fresh) g.mapRoll[base] = (g.mapRoll[base] || 0) + 1;
  const roll = g.mapRoll[base] || 0;
  const id = base + '/' + roll;
  let row = g.maps[id];
  if (!row) {
    const seed = crypto.randomBytes(4).readUInt32BE(0) || 1;
    row = { zi, tier, roll, seed, key: 'g:' + g.id + ':' + zi + ':t' + tier + ':r' + roll };
    g.maps[id] = row;
  }
  if (fresh && tpl && typeof tpl === 'object' && !Array.isArray(tpl)) {
    let s = '';
    try { s = JSON.stringify(tpl); } catch (e) { s = ''; }
    if (s && s.length < 700) row.tpl = tpl;
  }
  return row;
}

function joinGame(p, g) {
  if (p.game === g.id) {
    p.awayUntil = 0;
    zoneIndex(p);
    send(p, 'game', { game: gameInfo(g), you: p.uid, scale: gameScale(g), maps: mapRows(g), resumed: 1 });
    const party = partyOf(p);
    if (party) pushParty(party);
    pushRoster(g);
    pushZone(p);
    return null;
  }
  if (g.players.size >= MAX_GAME) return 'That game is full.';
  if (p.game) leaveGame(p);
  g.players.add(p.uid);
  p.game = g.id;
  zoneIndex(p);
  send(p, 'game', { game: gameInfo(g), you: p.uid, scale: gameScale(g), maps: mapRows(g) });
  for (const q of gamePlayers(g)) if (q !== p) sys(q, p.name + ' has entered the game.');
  pushRoster(g);
  pushLobby();
  pushFriends(p);
  restoreParty(p);
  return null;
}

function rememberParty(p) {
  if (!p || !p.party || !p.game) return;
  partyMemo.set(p.uid, { id: p.party, game: p.game, until: Date.now() + 180000 });
}

function restoreParty(p) {
  const m = partyMemo.get(p.uid);
  if (!m || m.until < Date.now() || m.game !== p.game || p.party) return;
  const party = parties.get(m.id);
  if (!party || party.members.size >= MAX_PARTY) return;
  const lead = live.get(party.leader);
  if (!lead || lead.game !== p.game) return;
  party.members.add(p.uid);
  p.party = party.id;
  partyMemo.delete(p.uid);
  for (const m2 of membersOf(party)) sys(m2, p.name + ' rejoined the party.');
  pushParty(party);
  pushRoster(gameOf(p));
}

function leaveGame(p, opt) {
  const g = gameOf(p);
  const left = mobSample(p);
  if (!(opt && opt.holdParty)) partyMemo.delete(p.uid);
  leaveParty(p, true);
  zoneIndex(p, true);
  p.game = null;
  /* Hostility belongs to a game, exactly as it did in Diablo II: leave and it is over. */
  p.hostile.clear();
  p.declaredAt.clear();
  p.portalLock = 0;
  tradeDrop(p, 'left');
  p.invites.clear();
  /* Straight back to the lobby, with the list already in hand rather than a blank panel
     waiting on the next coalesced push. */
  send(p, 'game', { game: null });
  send(p, 'lobby', { games: lobby(), max: MAX_GAME, diffs: DIFFS });
  /* A dropped socket says offline once. Saying "still on, just not in a game"
     first would flash them back online to everyone they know. */
  if (!g) { if (!(opt && opt.silent)) pushFriends(p); return; }
  g.players.delete(p.uid);
  p.mobKey = '';
  if (g.players.size && !TOWNS.has(left.zi | 0)) mobTell(g, left);
  for (const q of gamePlayers(g)) { q.hostile.delete(p.uid); sys(q, p.name + ' has left the game.'); }
  /* A game is its players. When the last one leaves — or logs off, which is the same
     thing from here — it is over, and it stops being listed. */
  if (g.players.size === 0) games.delete(g.id);
  else {
    if (g.host === p.uid) g.host = [...g.players][0];
    pushRoster(g);
  }
  pushLobby();
  if (!(opt && opt.silent)) pushFriends(p);
}

/* ---------- parties, inside a game ---------- */
function partyOf(p) { return p.party ? parties.get(p.party) : null; }
function membersOf(party) { return party ? [...party.members].map(u => live.get(u)).filter(Boolean) : []; }

function pushParty(party) {
  if (!party) return;
  const ms = membersOf(party);
  const payload = { id: party.id, leader: party.leader, sim: party.sim || null, members: ms.map(pub) };
  for (const m of ms) send(m, 'party', payload);
}

function leaveParty(p, quiet) {
  const party = partyOf(p);
  p.party = null;
  send(p, 'party', { id: null, leader: null, sim: null, members: [] });
  if (!party) return;
  party.members.delete(p.uid);
  if (!quiet) for (const m of membersOf(party)) sys(m, p.name + ' left the party.');
  if (party.members.size === 0) { parties.delete(party.id); return; }
  if (party.leader === p.uid) {
    party.leader = [...party.members][0];
    const lead = live.get(party.leader);
    for (const m of membersOf(party)) sys(m, (lead ? lead.name : 'Someone') + ' leads the party now.');
  }
  pushParty(party);
  pushRoster(gameOf(p));
}

/* ---------- hostility and fighting ---------- */
function mutualHostile(a, b) { return !!(a && b && (a.hostile.has(b.uid) || b.hostile.has(a.uid))); }

function canFight(a, b) {
  if (!a || !b || a.uid === b.uid) return false;
  if (!a.game || a.game !== b.game) return false;
  if (a.zi !== b.zi) return false;
  /* Your own flag is what lets you swing. Theirs is what lets them swing back.
     Declaring sets both, and standing down clears only yours. */
  if (!a.hostile.has(b.uid)) return false;
  if (TOWNS.has(a.zi)) return false;                      /* town is safe, always */
  if (a.safeUntil > Date.now() || b.safeUntil > Date.now()) return false;
  return true;
}

/* ---------- districts, indexed so the cost is the room and not the server ---------- */
const byZone = new Map();
const zoneKey = p => (p.game || '-') + '/' + p.zi + '/' + (p.inst || '');
function zoneIndex(p, remove) {
  if (p.zoneKey !== undefined) {
    const s = byZone.get(p.zoneKey);
    if (s) { s.delete(p); if (!s.size) byZone.delete(p.zoneKey); }
  }
  if (remove || !p.game) { p.zoneKey = undefined; return; }
  const k = zoneKey(p);
  p.zoneKey = k;
  let s = byZone.get(k);
  if (!s) { s = new Set(); byZone.set(k, s); }
  s.add(p);
}
function zonePeers(p) {
  const s = byZone.get(zoneKey(p));
  if (!s) return [];
  const out = [];
  for (const q of s) if (q !== p) out.push(q);
  return out;
}
function pushZone(p) { send(p, 'zone', { zi: p.zi, players: zonePeers(p).map(loc) }); }

/* One host client moves the machines. The server keeps their hit points, so a second
   browser cannot kill a private copy, and a reported experience packet is not how a
   shared kill pays. Towns have no machines. */
function mobKey(zi, tier, inst) { return (zi | 0) + '/' + (tier | 0) + '/' + (inst || ''); }
function mobSample(p) { return { zi: p.zi | 0, tier: p.tier | 0, inst: p.inst || '' }; }
function mobZone(g, sample) {
  g.zones = g.zones || {};
  const key = mobKey(sample.zi, sample.tier, sample.inst);
  if (!g.zones[key]) g.zones[key] = { host: '', mobs: {} };
  return g.zones[key];
}
function mobHere(g, sample) {
  return gamePlayers(g).filter(q => q.conn && (q.zi | 0) === (sample.zi | 0) && (q.tier | 0) === (sample.tier | 0) && (q.inst || '') === (sample.inst || '') && !TOWNS.has(q.zi | 0));
}
function mobList(z) {
  const out = [];
  for (const id in z.mobs) {
    const r = z.mobs[id];
    if (!r || r.dead) continue;
    const row = {
      id: +id, k: r.k, x: Math.round(r.x * 100) / 100, y: Math.round(r.y * 100) / 100,
      hp: Math.round(r.hp), max: r.max, ml: r.ml, champ: r.champ, su: r.su, min: r.min
    };
    if (r.curse && r.curse.until > Date.now()) {
      row.curse = { k: r.curse.k, m: r.curse.m, sec: Math.max(0.1, Math.round((r.curse.until - Date.now()) / 100) / 10) };
    }
    const stacks = mobStacks(r);
    if (stacks > 0) row.tes = stacks;
    out.push(row);
  }
  return out;
}
function mobTell(g, sample) {
  const here = mobHere(g, sample);
  const key = mobKey(sample.zi, sample.tier, sample.inst);
  if (!here.length) {
    if (g.zones) delete g.zones[key];
    return;
  }
  const z = mobZone(g, sample);
  /* The host stays until they are actually gone. The next one is named while they
     are still here, and already has the positions, so the handoff is not a resync. */
  const ids = here.map(q => q.uid);
  const had = z.host;
  let handed = 0;
  if (!ids.includes(z.host)) {
    const promote = z.next && ids.includes(z.next) ? z.next : (ids[0] || '');
    handed = had && promote && promote !== had ? 1 : 0;
    z.host = promote;
  }
  const rest = ids.filter(id => id !== z.host);
  if (!rest.includes(z.next)) z.next = rest[0] || '';
  const list = mobList(z);
  for (const q of here) {
    send(q, 'mhost', {
      zi: sample.zi | 0, tier: sample.tier | 0, uid: z.host, next: z.next || '',
      hand: handed && q.uid === z.host ? 1 : 0
    });
    send(q, 'mobs', {
      zi: sample.zi | 0, tier: sample.tier | 0, snap: handed ? 0 : 1,
      you: q.uid === z.host ? 1 : 0, next: z.next || '', list
    });
  }
  if (handed) armHandoff(g, sample, z);
}
/* If the promotion packet is lost, say it again until the new host reports in. */
function armHandoff(g, sample, z) {
  const token = {};
  z.arm = token;
  const key = mobKey(sample.zi, sample.tier, sample.inst);
  const timer = setTimeout(() => {
    if (z.arm !== token || !g.zones || g.zones[key] !== z) return;
    if (z.pushedAt && Date.now() - z.pushedAt < 400) return;
    const here = mobHere(g, sample);
    if (!here.some(q => q.uid === z.host)) return;
    const list = mobList(z);
    for (const q of here) {
      send(q, 'mhost', {
        zi: sample.zi | 0, tier: sample.tier | 0, uid: z.host, next: z.next || '',
        hand: q.uid === z.host ? 1 : 0
      });
      send(q, 'mobs', {
        zi: sample.zi | 0, tier: sample.tier | 0, snap: 0,
        you: q.uid === z.host ? 1 : 0, next: z.next || '', list
      });
    }
  }, 250);
  if (timer.unref) timer.unref();
}
function mobNote(p) {
  const g = gameOf(p);
  if (!g) return;
  const sample = mobSample(p);
  const key = mobKey(sample.zi, sample.tier, sample.inst);
  if (p.mobKey === key) {
    if (TOWNS.has(sample.zi)) return;
    const z = g.zones && g.zones[key];
    if (z && z.host && mobHere(g, sample).some(q => q.uid === z.host)) return;
  }
  const prev = p.mobKey;
  p.mobKey = key;
  if (prev && prev !== key) {
    const old = prev.split('/');
    mobTell(g, { zi: +old[0] || 0, tier: +old[1] || 0, inst: old.slice(2).join('/') });
  }
  if (!TOWNS.has(sample.zi)) mobTell(g, sample);
}
function grantMobXp(p, amount, ml) {
  amount = Math.round(Math.max(0, +amount || 0));
  if (!amount || !p) return;
  const party = partyOf(p);
  const here = party ? membersOf(party).filter(q => sameRoom(q, p)) : [p];
  if (here.length < 2) {
    send(p, 'mxp', { amount, self: 1 });
    return;
  }
  const pool = amount * PARTY_POOL;
  const sum = here.reduce((a, q) => a + Math.max(1, q.lvl), 0);
  for (const q of here) {
    const share = Math.round(pool * (Math.max(1, q.lvl) / sum) * xpCurve(q.lvl, ml));
    if (share > 0) send(q, 'mxp', { amount: share, from: p.name, self: q.uid === p.uid ? 1 : 0 });
  }
}
function mobKill(g, sample, rec, id, killer, silent) {
  if (!rec || rec.dead) return;
  rec.dead = 1;
  const here = mobHere(g, sample);
  if (!silent && killer) {
    const scale = gameScale(g).xp;
    let xp = mobMath.killXp(rec.k, rec.ml, rec, scale, rec.xpm, (sample.zi | 0) === SIM_ZONE);
    const cap = guard.xpCap(rec.ml, scale);
    if (xp > cap) xp = cap;
    grantMobXp(killer, xp, rec.ml);
  }
  const party = killer && partyOf(killer);
  const paid = new Set(party ? party.members : (killer ? [killer.uid] : []));
  for (const q of here) {
    send(q, 'mkill', {
      id: +id, k: rec.k, x: rec.x, y: rec.y, ml: rec.ml,
      champ: rec.champ, su: rec.su,
      loot: !silent && paid.has(q.uid) ? 1 : 0,
      silent: silent ? 1 : 0,
      by: killer ? killer.uid : ''
    });
  }
}
function diffHpOf(g) {
  const n = g && g.players ? g.players.size : 1;
  return gameScale(g).hp / Math.max(1, 1 + 0.5 * (n - 1));
}
/* A cast is one beat long. Push it to the district instead of waiting for their next
   heartbeat, or the other client can sample the beat after it has already been cleared. */
function pushPeers(p) { for (const q of zonePeers(p)) pushZone(q); }

/* ---------- trades ----------
   The server does not keep the purse between sessions. It does keep this trade.
   Once either side confirms, the offer is frozen. The swap runs only after both
   have reported a balance that still covers what they offered. A short report,
   or a disconnect before that, cancels it. A finished trade replays the same id. */
const trades = new Map();
const tradeByPlayer = new Map();
const TRADE_MAX_ITEMS = 8;
const TRADE_MAX_SATS = 1e9;

function tradeItem(it) {
  if (!it || typeof it !== 'object' || Array.isArray(it)) return null;
  let s = '';
  try { s = JSON.stringify(it); } catch (e) { return null; }
  if (!s || s.length > 800) return null;
  const copy = JSON.parse(s);
  const tid = typeof copy.tid === 'string' ? copy.tid : '';
  if (!/^[A-Za-z0-9]{8,40}$/.test(tid)) return null;
  if (copy.test) return null;
  copy.tid = tid;
  return copy;
}
function tradeOffer(m) {
  const sats = Math.max(0, Math.min(TRADE_MAX_SATS, Math.floor(+((m && m.sats) || 0))));
  const raw = m && Array.isArray(m.items) ? m.items.slice(0, TRADE_MAX_ITEMS) : [];
  const items = [];
  const seen = {};
  for (const it of raw) {
    const c = tradeItem(it);
    if (!c || seen[c.tid]) continue;
    seen[c.tid] = 1;
    items.push(c);
  }
  return { sats, items };
}
function tradeHash(o) {
  return o.sats + ':' + o.items.map(i => i.tid).join(',');
}
function tradeOf(p) { return p ? trades.get(tradeByPlayer.get(p.uid)) : null; }
function tradeLive(s) { return !!(s && (s.phase === 'open' || s.phase === 'check')); }
function tradeBetween(a, b) {
  const s = tradeOf(a);
  if (!tradeLive(s) || !b) return null;
  if (s.a !== b.uid && s.b !== b.uid) return null;
  return s;
}
function tradePlace(p, q) {
  if (!p || !q || p.uid === q.uid) return 'Nobody to trade with.';
  if (!p.game || p.game !== q.game) return 'They are not in this game.';
  if ((p.zi | 0) !== (q.zi | 0) || !TOWNS.has(p.zi | 0)) return 'Trade in town.';
  if (mutualHostile(p, q)) return 'Not while you are hostile.';
  if (!q.conn) return 'They are not on.';
  return '';
}
function tradeView(s, uid) {
  const you = s.offer[uid] || { sats: 0, items: [] };
  const themId = s.a === uid ? s.b : s.a;
  const them = s.offer[themId] || { sats: 0, items: [] };
  const o = {
    t: 'trade', phase: s.phase, id: s.id, with: themId,
    locked: (s.phase === 'check' || s.ok[s.a] || s.ok[s.b]) ? 1 : 0,
    you: { sats: you.sats, items: you.items, ok: s.ok[uid] ? 1 : 0 },
    them: { sats: them.sats, items: them.items, ok: s.ok[themId] ? 1 : 0 }
  };
  if (s.phase === 'done') { o.give = s.give[uid]; o.take = s.take[uid]; }
  return o;
}
function tradeHold(m) {
  const sats = Math.max(0, Math.min(TRADE_MAX_SATS, Math.floor(+((m && m.sats) || 0))));
  const raw = m && Array.isArray(m.tids) ? m.tids.slice(0, 24) : [];
  const tids = [];
  const seen = {};
  for (const id of raw) {
    if (typeof id !== 'string' || !/^[A-Za-z0-9]{8,40}$/.test(id) || seen[id]) continue;
    seen[id] = 1;
    tids.push(id);
  }
  return { sats, tids };
}
function tradeCovers(offer, hold) {
  if (!offer || !hold) return false;
  if ((hold.sats | 0) < (offer.sats | 0)) return false;
  const have = {};
  for (const id of hold.tids || []) have[id] = 1;
  for (const it of offer.items || []) if (!it || !have[it.tid]) return false;
  return true;
}
function tradePush(s) {
  for (const uid of [s.a, s.b]) {
    const p = live.get(uid);
    if (p && p.conn) send(p, 'trade', tradeView(s, uid));
  }
}
function tradeForget(s) {
  if (!s) return;
  if (s.timer) { clearTimeout(s.timer); s.timer = null; }
  trades.delete(s.id);
  if (tradeByPlayer.get(s.a) === s.id) tradeByPlayer.delete(s.a);
  if (tradeByPlayer.get(s.b) === s.id) tradeByPlayer.delete(s.b);
}
function tradeDrop(p, why) {
  const s = tradeOf(p);
  if (!tradeLive(s)) return;
  s.phase = 'dead';
  for (const uid of [s.a, s.b]) {
    const q = live.get(uid);
    if (q && q.conn) send(q, 'trade', { phase: 'dead', id: s.id, why: why || 'cancel' });
  }
  tradeForget(s);
}
function tradeSide(s, uid) {
  const o = s.offer[uid] || { sats: 0, items: [] };
  return { sats: o.sats, ids: o.items.map(i => i.tid), items: o.items };
}
function tradeSettle(s) {
  if (!s || s.phase !== 'check') return;
  const ha = tradeHash(s.offer[s.a] || { sats: 0, items: [] });
  const hb = tradeHash(s.offer[s.b] || { sats: 0, items: [] });
  if (s.ok[s.a] !== ha || s.ok[s.b] !== hb) return;
  if (!tradeCovers(s.offer[s.a], s.hold && s.hold[s.a]) || !tradeCovers(s.offer[s.b], s.hold && s.hold[s.b])) return;
  s.phase = 'done';
  s.at = Date.now();
  s.acked = {};
  const A = tradeSide(s, s.a), B = tradeSide(s, s.b);
  s.give = {};
  s.take = {};
  s.give[s.a] = { sats: A.sats, ids: A.ids };
  s.give[s.b] = { sats: B.sats, ids: B.ids };
  s.take[s.a] = { sats: B.sats, items: B.items };
  s.take[s.b] = { sats: A.sats, items: A.items };
  s.timer = setTimeout(() => { if (trades.get(s.id) === s) tradeForget(s); }, 600000);
  if (s.timer.unref) s.timer.unref();
  tradePush(s);
}
function tradeReplay(p) {
  const s = tradeOf(p);
  if (!s) return;
  if (s.phase === 'done' && s.at && Date.now() - s.at > 600000) { tradeForget(s); return; }
  if (s.phase === 'done' && s.acked && s.acked[p.uid]) return;
  if (p.conn) send(p, 'trade', tradeView(s, p.uid));
}
function tradeOpen(a, b) {
  const s = {
    id: 't' + crypto.randomBytes(6).toString('hex'),
    a: a.uid, b: b.uid, phase: 'open',
    offer: {}, ok: {}, hold: {}, at: Date.now()
  };
  s.offer[a.uid] = { sats: 0, items: [] };
  s.offer[b.uid] = { sats: 0, items: [] };
  trades.set(s.id, s);
  tradeByPlayer.set(a.uid, s.id);
  tradeByPlayer.set(b.uid, s.id);
  tradePush(s);
  return s;
}

const HANDLERS = {
  hello(p, m) {
    const prevTown = TOWNS.has(p.zi | 0);
    p.cls = clean(m.cls, 16);
    p.zi = +m.zi || 0;
    if (TOWNS.has(p.zi | 0)) { if (!prevTown || !p.townSince) p.townSince = Date.now(); }
    else p.townSince = 0;
    takeVitals(p, m);
    /* The real client asks to be held in its game across a dropped socket. Test
       clients do not, so a closed socket there still ends the session at once. */
    if (m && m.resume) p.wantsResume = true;
    zoneIndex(p);
    if (p.game) pushRoster(gameOf(p)); else pushLobby();
    pushFriends(p);
  },

  /* ---- the lobby ---- */
  'game.list'(p) { send(p, 'lobby', { games: lobby(), max: MAX_GAME, diffs: DIFFS }); },

  'game.create'(p, m) {
    if (games.size >= MAX_GAMES) return sys(p, 'The server is holding as many games as it can. Join one instead.');
    if (!rate(p, 'mkgame', 5, 60000)) return sys(p, 'One game at a time.');
    const name = clean(m.name, 40).trim() || (p.name + "'s game");
    if ([...games.values()].some(g => g.name.toLowerCase() === name.toLowerCase() && g.players.size)) return sys(p, 'There is already a game by that name.');
    const diff = DIFFS[clean(m.diff, 12)] ? clean(m.diff, 12) : 'normal';
    const g = { id: 'g' + (gameSeq++), name, diff, host: p.uid, pass: clean(m.pass, 40), players: new Set(), created: Date.now(), maps: {}, mapRoll: {}, zones: {} };
    games.set(g.id, g);
    const err = joinGame(p, g);
    if (err) sys(p, err);
  },

  'game.join'(p, m) {
    /* id is a key in the game table. The newest-60 lobby is a catalogue, not
       the set of games that can be joined. A friend's game that has fallen
       off that catalogue is still joined by id, resolved from their uid. */
    let id = clean(m.id, 20);
    if (!id && m.uid) {
      const q = live.get(clean(m.uid, 64));
      const rel = q && socialMod().between(p.uid, q.uid);
      if (!q || !q.game || !rel || !rel.mutual) return sys(p, 'That game is over.');
      id = q.game;
    }
    const g = games.get(id);
    if (!g) return sys(p, 'That game is over.');
    if (g.pass && g.pass !== clean(m.pass, 40)) return send(p, 'joinfail', { id: g.id, reason: 'That password is not right.' });
    if (g.players.size >= MAX_GAME) return send(p, 'joinfail', { id: g.id, reason: 'That game is full — it holds ' + MAX_GAME + '.' });
    const err = joinGame(p, g);
    if (err) send(p, 'joinfail', { id: g.id, reason: err });
  },

  'game.leave'(p) { leaveGame(p); pushLobby(); },

  /* The layout of a district: the seed both clients draw from, and the subpoena
     template if the district was rolled rather than taken from the book. A fresh
     roll forgets the machines that were standing in the previous one. */
  map(p, m) {
    const g = gameOf(p);
    if (!g) return;
    const zi = m.zi | 0;
    if (zi !== m.zi || zi < 0 || zi > 63) return;
    const tier = Math.max(0, Math.min(30, m.tier | 0));
    const fresh = m.fresh ? 1 : 0;
    if (fresh && !rate(p, 'mapfresh', 8, 60000)) return sys(p, 'That district was just redrawn. Give it a moment.');
    if (!rate(p, 'map', 40, 10000)) return;
    const row = mapRecord(g, zi, tier, fresh, m.tpl);
    if (fresh && g.zones) {
      const pre = zi + '/' + tier + '/';
      for (const k of Object.keys(g.zones)) if (k.startsWith(pre)) delete g.zones[k];
      for (const q of gamePlayers(g)) if ((q.zi | 0) === zi && (q.tier | 0) === tier) q.mobKey = '';
    }
    inGame(g, 'map', row);
    if (fresh) for (const q of gamePlayers(g)) if ((q.zi | 0) === zi && (q.tier | 0) === tier) mobNote(q);
  },

  /* ---- being somewhere ---- */
  /* sk, au and sw are stored and forwarded like dir. They are not simulated, and they
     are not a hit. A missing field leaves the stored value alone. */
  move(p, m) {
    p.x = +m.x || 0; p.y = +m.y || 0; p.dir = +m.dir || 0;
    takeVitals(p, m);
    let cosmetic = ('sk' in m) || ('au' in m) || ('sw' in m) || ('bf' in m) || ('aL' in m) || ('nm' in m) || ('tes' in m) || ('node' in m);
    if ('sk' in m) p.sk = m.sk === null ? null : skillIx(m.sk);
    if ('au' in m) {
      p.au = auraIx(m.au);
      if (!p.au) { p.aL = 0; p.node = 0; }
      else p.aL = auraRank(m.aL) || p.aL || 1;
    } else if ('aL' in m && p.au) p.aL = auraRank(m.aL) || 1;
    if ('node' in m) p.node = p.au ? (auraRank(m.node) || 0) : 0;
    if ('nm' in m) p.nm = auraRank(m.nm) || 0;
    if ('tes' in m) p.tes = p.nm ? cleanTes(m.tes) : null;
    if ('pail' in m) {
      const before = pailLoc(p);
      notePail(p, m.pail);
      const after = pailLoc(p);
      if (JSON.stringify(before) !== JSON.stringify(after)) cosmetic = true;
    }
    if ('bf' in m) noteBf(p, m.bf);
    if ('sw' in m) p.sw = m.sw === 1 ? 1 : 0;
    if (!p.game) return;
    const zi = +m.zi, inst = m.inst || null;
    const nextTier = m.tier == null ? (p.tier | 0) : (m.tier | 0);
    if (zi !== p.zi || inst !== p.inst || nextTier !== (p.tier | 0)) {
      /* A declaration holds them in the district the server already recorded, for ten
         seconds. A modified client can ignore the local half and walk anyway. This is
         the server's half: it does not follow them, so they are not a combatant there. */
      if (!(p.portalLock > Date.now())) {
        const prevTown = TOWNS.has(p.zi | 0);
        p.zi = zi; p.inst = inst; p.tier = nextTier;
        if (TOWNS.has(p.zi | 0)) { if (!prevTown) p.townSince = Date.now(); }
        else p.townSince = 0;
        zoneIndex(p);
        pushRoster(gameOf(p));
        /* Walking in buys five seconds, so a hostile cannot camp the doorway. */
        p.safeUntil = Date.now() + 5000;
      }
    }
    if (p.game) mobNote(p);
    if ('tes' in m && p.game && stampTes(p)) pushMobSnap(gameOf(p), mobSample(p));
    pushZone(p);
    if (cosmetic) pushPeers(p);
  },

  chat(p, m) {
    const text = clean(m.text, 400).trim();
    if (!text || !p.game) return;
    if (!rate(p, 'chat', 12, 10000)) return sys(p, 'Slow down.');
    const out = { from: p.name, uid: p.uid, text, scope: m.scope === 'party' ? 'party' : 'game' };
    if (out.scope === 'party') {
      const party = partyOf(p);
      if (!party) return sys(p, 'You are not in a party.');
      for (const q of membersOf(party)) send(q, 'chat', out);
    } else inGame(gameOf(p), 'chat', out);
  },

  invite(p, m) {
    const q = live.get(m.uid);
    if (!q) return sys(p, 'They are not on.');
    const rel = socialMod().between(p.uid, q.uid);
    /* A block is not announced. The invite is dropped and nothing is said. */
    if (rel.blocked) return;
    const same = !!(p.game && q.game === p.game);
    if (!same) {
      /* A friend in some other game, or in none. The invite names this game.
         Accepting joins it. It does not make a party across that boundary. */
      if (!p.game) return sys(p, 'You are not in a game.');
      if (!rel.mutual) return sys(p, 'They are not in this game.');
      const g = games.get(p.game);
      if (!g) return sys(p, 'That game is over.');
      if (g.players.size >= MAX_GAME) return sys(p, 'That game is full — it holds ' + MAX_GAME + '.');
      send(q, 'invited', { from: p.name, uid: p.uid, lvl: p.lvl, cls: p.cls, game: g.name, locked: !!g.pass });
      sys(p, 'Asked ' + q.name + ' to join ' + g.name + '.');
      return;
    }
    if (mutualHostile(p, q)) return sys(p, 'You have declared against each other. That does not come back.');
    const party = partyOf(p);
    if (party && party.leader !== p.uid) return sys(p, 'Only the leader invites.');
    if (party && party.members.size >= MAX_PARTY) return sys(p, 'A party holds eight.');
    if (q.party) return sys(p, q.name + ' is already in a party.');
    q.invites.set(p.uid, Date.now() + 60000);
    send(q, 'invited', { from: p.name, uid: p.uid, lvl: p.lvl, cls: p.cls });
    sys(p, 'Asked ' + q.name + ' to join.');
  },

  /* Online: handed to whoever is connected, and forgotten here. Offline: the
     box. The sender hears one line either way, and never the game chat. */
  whisper(p, m) {
    const book = socialMod();
    const raw = typeof m.text === 'string' ? m.text.trim() : '';
    if (!raw) return whisperNote(p, 'Write something.');
    if (raw.length > book.MAIL_MAX) return whisperNote(p, 'A letter stops at 240 characters.');
    if (!rate(p, 'whisper', 12, 10000)) return whisperNote(p, 'Slow down.');
    const who = m.uid ? accountById(clean(m.uid, 64)) : accountByName(clean(m.name, 40));
    if (!who || who.id === p.uid) return whisperNote(p, book.MISS);
    const rel = book.between(p.uid, who.id);
    if (!rel.mutual || rel.blocked) return whisperNote(p, book.MISS);
    if (book.closed(who.id)) return whisperNote(p, book.QUIET);
    const q = live.get(who.id);
    /* A held place has no socket. Treat that as offline so the letter goes in the box
       instead of vanishing into a connection that is not there. */
    if (q && q.conn) {
      send(q, 'whisper', { from: p.name, uid: p.uid, text: raw });
      whisperNote(p, 'delivered.', { to: who.id, name: who.name, line: raw });
      return;
    }
    if (!require('./auth').rateLimit('ml:' + p.uid, 10, 10 * 60 * 1000)) return whisperNote(p, 'Ten letters in ten minutes is the limit.');
    const r = book.send({ id: p.uid, name: p.name }, who.name, raw);
    if (!r.ok) return whisperNote(p, r.error);
    whisperNote(p, 'They are not on. Left in their box.', { to: who.id, name: who.name, line: raw });
  },

  accept(p, m) {
    const q = live.get(m.uid), until = p.invites.get(m.uid);
    if (!q || !until || until < Date.now() || q.game !== p.game) return sys(p, 'That invitation has lapsed.');
    p.invites.delete(m.uid);
    if (mutualHostile(p, q)) return sys(p, 'Not after that.');
    if (p.party) leaveParty(p);
    let party = partyOf(q);
    if (!party) {
      party = { id: 'p' + (partySeq++), leader: q.uid, members: new Set([q.uid]), sim: null };
      parties.set(party.id, party);
      q.party = party.id;
    }
    if (party.members.size >= MAX_PARTY) return sys(p, 'That party is full.');
    party.members.add(p.uid);
    p.party = party.id;
    for (const m2 of membersOf(party)) sys(m2, p.name + ' joined the party.');
    pushParty(party);
    pushRoster(gameOf(p));
  },

  decline(p, m) { p.invites.delete(m.uid); },
  leave(p) { leaveParty(p); },

  hostile(p, m) {
    const q = live.get(m.uid);
    if (!q || q.game !== p.game || !p.game) return;
    if (!TOWNS.has(p.zi)) return sys(p, 'Declare in town.');
    if ((+p.lvl || 1) < 9 || (+q.lvl || 1) < 9) return sys(p, 'Hostility starts at level 9.');
    if (!(p.townSince > 0) || Date.now() - p.townSince < HOSTILE_ARM) return sys(p, 'Stand in town a moment before you declare.');
    if (p.hostile.has(q.uid)) return sys(p, 'Already declared.');
    const last = p.declaredAt.get(q.uid) || 0;
    if (Date.now() - last < 60000) return sys(p, 'Once a minute, against the same person.');
    p.declaredAt.set(q.uid, Date.now());
    p.hostile.add(q.uid);
    /* Their flag is what lets them hit back after you stand down. Not their party. */
    q.hostile.add(p.uid);
    p.portalLock = Date.now() + 10000;
    const party = partyOf(p);
    if (party && party.members.has(q.uid)) leaveParty(p, true);
    if (tradeBetween(p, q)) tradeDrop(p, 'hostile');
    inGame(gameOf(p), 'hostile', { from: p.name, fromUid: p.uid, to: q.name, toUid: q.uid });
    sys(q, p.name + ' has declared hostility against you.');
    sys(p, 'You have declared against ' + q.name + '. Standing down in town stops only your own swings.');
    pushRoster(gameOf(p));
  },

  stand(p, m) {
    const q = live.get(m.uid);
    if (!q || q.game !== p.game || !p.game) return;
    if (!TOWNS.has(p.zi)) return sys(p, 'Stand down in town.');
    if (!p.hostile.has(q.uid)) return sys(p, 'You have not declared against them.');
    p.hostile.delete(q.uid);
    inGame(gameOf(p), 'stand', { from: p.name, fromUid: p.uid, to: q.name, toUid: q.uid });
    sys(p, 'You stand down. They can still hit you.');
    sys(q, p.name + ' stands down. You can still hit them.');
    pushRoster(gameOf(p));
  },

  xp(p, m) {
    if (!rate(p, 'xp', 25, 10000)) return;
    const scale = gameScale(gameOf(p)).xp;
    const cap = guard.xpCap(m.ml, scale);
    let amount = Math.max(0, +m.amount || 0);
    if (!amount) return;
    const decided = guard.xpAccept(amount, p.lvl, cap, p.bankPaid);
    if (decided.clamped) {
      console.log('[xp] clamped ' + p.name + ' ' + amount + ' to ' + decided.amount + ' ml=' + (+m.ml || 0));
    }
    amount = decided.amount;
    p.bankPaid = decided.paid;
    if (!amount) return;
    const party = partyOf(p);
    if (!party) return;
    const here = membersOf(party).filter(q => sameRoom(q, p));
    /* Alone in the district: the killer's client deferred, so hand the whole report back. */
    if (here.length < 2) {
      send(p, 'xp', { amount: Math.round(amount), from: p.name, self: 1 });
      return;
    }
    const pool = amount * PARTY_POOL;
    const sum = here.reduce((a, q) => a + Math.max(1, q.lvl), 0);
    for (const q of here) {
      const share = Math.round(pool * (Math.max(1, q.lvl) / sum) * xpCurve(q.lvl, m.ml));
      if (share > 0) send(q, 'xp', { amount: share, from: p.name, self: q.uid === p.uid ? 1 : 0 });
    }
  },

  quest(p, m) {
    const party = partyOf(p);
    if (!party) return;
    if (!rate(p, 'quest', 8, 30000)) return;
    const k = clean(m.k, 12);
    p.quest = p.quest || {};
    const step = guard.questStep(p.quest, k, +m.v);
    if (step == null) return;
    p.quest[k] = step;
    for (const q of membersOf(party)) if (q.uid !== p.uid && q.zi === p.zi) send(q, 'quest', { k, v: step, from: p.name });
  },

  /* A curse on a shared machine. On the Record raises the damage everyone deals.
     Garden Leave stops heals. The caster's own client already ticks the damage. */
  curse(p, m) {
    const g = gameOf(p);
    if (!g || TOWNS.has(p.zi | 0)) return;
    if (!rate(p, 'curse', 8, 10000)) return;
    const k = m.k === 'rec' || m.k === 'leave' ? m.k : '';
    if (!k) return;
    const sample = mobSample(p);
    if ((m.zi | 0) && (m.zi | 0) !== sample.zi) return;
    const z = g.zones && g.zones[mobKey(sample.zi, sample.tier, sample.inst)];
    if (!z) return;
    const id = m.id | 0;
    const rec = z.mobs[id];
    if (!rec || rec.dead) return;
    let mul = +m.m || 1;
    if (!(mul >= 1)) mul = 1;
    if (mul > 4) mul = 4;
    let sec = +m.sec || 0;
    if (!(sec >= 0.5)) return;
    if (sec > 20) sec = 20;
    rec.curse = { k, m: Math.round(mul * 100) / 100, until: Date.now() + sec * 1000 };
    const row = { id, k, m: rec.curse.m, sec };
    for (const q of mobHere(g, sample)) send(q, 'mcurse', row);
  },

  /* One lunch pail, one store. The owner asks; the server spends it once. */
  pail(p, m) {
    if (!p.pail || !(p.pailStore > 0) || !p.party) return;
    if (!rate(p, 'pail', 12, 1000)) return;
    const list = Array.isArray(m.draw) ? m.draw.slice(0, 8) : [];
    if (!list.length) return;
    const now = Date.now();
    p.pailAt = p.pailAt || {};
    const grants = [];
    let spent = 0;
    const rateN = pailRate(p.pail.L);
    const reach = FORMULAS.pail.r + 1.5;
    for (let i = 0; i < list.length; i++) {
      const row = list[i];
      if (!row || spent >= p.pailStore) break;
      const raw = row.k === 'self' || row.k === 'merc' || row.k === 'tag' ? row.k : clean(row.k, 64);
      if (!raw) continue;
      let hpm = p.hpm || 1, hp = p.hp || 0, key = raw, who = null;
      if (raw === 'self' || raw === 'merc' || raw === 'tag') {
        const d = Math.hypot((+p.x || 0) - p.pail.x, (+p.y || 0) - p.pail.y);
        if (d > reach) continue;
        key = raw === 'self' ? p.uid : raw;
        if (raw === 'self') hp = p.hp || 0;
        else {
          const want = Math.max(0, Math.round(+row.n || 0));
          hp = want > 0 ? Math.max(0, hpm - want) : 0;
        }
      } else {
        who = live.get(raw);
        if (!who || who.uid === p.uid || who.party !== p.party || !sameRoom(who, p)) continue;
        if ((p.hostile && p.hostile.has(who.uid)) || (who.hostile && who.hostile.has(p.uid))) continue;
        const d = Math.hypot((+who.x || 0) - p.pail.x, (+who.y || 0) - p.pail.y);
        if (d > reach) continue;
        hpm = who.hpm || 1;
        hp = who.hp || 0;
        key = who.uid;
      }
      const last = p.pailAt[key] || 0;
      const dt = last ? Math.min(1.2, (now - last) / 1000) : 0.25;
      if (last && dt < 0.05) continue;
      const room = Math.max(0, hpm - hp);
      let n = Math.min(p.pailStore - spent, room, hpm * rateN * dt);
      n = Math.round(n);
      if (!(n >= 1)) continue;
      p.pailAt[key] = now;
      spent += n;
      grants.push({ k: raw === 'self' ? 'self' : (who ? who.uid : raw), n });
      if (who) {
        who.pailCredit = (who.pailCredit || 0) + n;
        send(who, 'pail', { n, hp: Math.round(p.pailStore - spent), x: p.pail.x, y: p.pail.y, L: p.pail.L, max: p.pail.max });
      } else if (raw === 'self') p.pailCredit = (p.pailCredit || 0) + n;
    }
    if (!spent) return;
    p.pailStore = Math.max(0, p.pailStore - spent);
    if (p.pail) p.pail.hp = Math.round(p.pailStore);
    send(p, 'pail', { hp: Math.round(p.pailStore), x: p.pail.x, y: p.pail.y, L: p.pail.L, max: p.pail && p.pail.max, grants });
    if (!(p.pailStore > 0)) clearPail(p);
    if (p.game) pushPeers(p);
  },

  /* Unnamed Source, when the nearest ally is the other player and not a local body. */
  lend(p, m) {
    if (!rate(p, 'lend', 4, 10000)) return;
    const q = live.get(clean(m.uid, 64));
    if (!q || !p.party || q.party !== p.party || !sameRoom(p, q)) return;
    if ((p.hostile && p.hostile.has(q.uid)) || (q.hostile && q.hostile.has(p.uid))) return;
    const d = Math.hypot((+p.x || 0) - (+q.x || 0), (+p.y || 0) - (+q.y || 0));
    if (d > 14) return;
    send(q, 'lend', { from: p.name, uid: p.uid });
  },

  pvp(p, m) {
    const q = live.get(m.uid);
    if (!canFight(p, q)) return;
    if (!rate(p, 'pvp', 80, 10000)) return;
    const raw = Math.max(0, +m.dmg || 0);
    if (!raw) return;
    const landedCap = guard.pvpLandedCap(p.lvl, q.hpm);
    let landed = raw * PVP_SCALE;
    if (landed > landedCap) {
      console.log('[pvp] clamped ' + p.name + ' ' + Math.round(landed) + ' to ' + Math.round(landedCap) + ' vs ' + q.name);
      landed = landedCap;
    }
    if (!landed) return;
    plaus.notePvp(q, landed);
    const TYPES = { impact: 1, surge: 1, rust: 1, heat: 1, noise: 1, sound: 1 };
    const dty = TYPES[m.dty] ? m.dty : 'impact';
    const kind = clean(m.kind, 12);
    let critM = 0;
    if (kind === 'crit') {
      const n = +m.critM;
      critM = (n >= 1 && n <= 8) ? Math.round(n * 100) / 100 : 2;
    }
    send(q, 'pvp', { from: p.name, fromUid: p.uid, dmg: Math.round(landed), kind, dty, critM });
  },

  /* The host's picture of where the machines are. Hit points in the packet are ignored
     once a machine is known: those belong to the server. */
  mobs(p, m) {
    const g = gameOf(p);
    if (!g || TOWNS.has(p.zi | 0)) return;
    if (!rate(p, 'mobs', 80, 10000)) return;
    const sample = mobSample(p);
    if ((m.zi | 0) !== sample.zi || (m.tier | 0) !== sample.tier) return;
    const z = mobZone(g, sample);
    if (z.host !== p.uid) return;
    z.pushedAt = Date.now();
    const list = Array.isArray(m.list) ? m.list.slice(0, 60) : [];
    const seen = {};
    const diffHp = diffHpOf(g);
    for (let i = 0; i < list.length; i++) {
      const row = list[i];
      if (!row || typeof row !== 'object') continue;
      const rec = mobMath.upsert(z, row, diffHp, clean);
      if (rec) seen[row.id | 0] = 1;
    }
    for (const id in z.mobs) {
      const rec = z.mobs[id];
      if (!rec || rec.dead) continue;
      if (seen[id]) continue;
      rec.miss = (rec.miss || 0) + 1;
      if (rec.miss >= 3) mobKill(g, sample, rec, id, null, true);
    }
    const out = mobList(z);
    for (const q of mobHere(g, sample)) if (q !== p) send(q, 'mobs', { zi: sample.zi, tier: sample.tier, list: out });
  },

  mhit(p, m) {
    const g = gameOf(p);
    if (!g || TOWNS.has(p.zi | 0)) return;
    const area = m.area ? 1 : 0;
    /* A pulse has its own flood cap. It does not spend the swing packet budget. */
    if (area) { if (!rate(p, 'mtick', 120, 1000)) return; }
    else if (!rate(p, 'mhit', 100, 10000)) return;
    const sample = mobSample(p);
    if ((m.zi | 0) !== sample.zi || (m.tier | 0) !== sample.tier) return;
    const z = g.zones && g.zones[mobKey(sample.zi, sample.tier, sample.inst)];
    if (!z) return;
    const id = m.id | 0;
    const rec = z.mobs[id];
    if (!rec || rec.dead) return;
    const sk = m.sk == null ? -1 : (m.sk | 0);
    if (sk === -2) {
      if (z.host !== p.uid) return;
    } else if (area) {
      if (!plaus.areaOk(p, rec, sk)) return;
    } else if (!plaus.hitOk(p, rec, sk, partyCover(p))) return;
    let d = Math.max(0, +m.d || 0);
    if (!(d > 0)) return;
    if (d > rec.max) {
      console.log('[mob] clamped ' + p.name + ' hit ' + Math.round(d) + ' to ' + rec.max);
      d = rec.max;
    }
    rec.hp = Math.max(0, rec.hp - d);
    for (const q of mobHere(g, sample)) send(q, 'mhp', { id, hp: Math.round(rec.hp), max: rec.max });
    if (rec.hp <= 0) mobKill(g, sample, rec, id, p, false);
  },

  /* The host says a machine left without a kill: a drone that got away, a minion
     dismissed with its boss. No experience. */
  mgone(p, m) {
    const g = gameOf(p);
    if (!g || !rate(p, 'mgone', 40, 10000)) return;
    const sample = mobSample(p);
    const z = g.zones && g.zones[mobKey(sample.zi, sample.tier, sample.inst)];
    if (!z || z.host !== p.uid) return;
    const rec = z.mobs[m.id | 0];
    if (!rec || rec.dead) return;
    mobKill(g, sample, rec, m.id | 0, null, true);
  },

  /* A machine's swing, as the host saw it, forwarded to the person who was standing there. */
  mdmg(p, m) {
    const g = gameOf(p);
    if (!g || TOWNS.has(p.zi | 0)) return;
    if (!rate(p, 'mdmg', 120, 10000)) return;
    const z = g.zones && g.zones[mobKey(p.zi, p.tier, p.inst)];
    if (!z || z.host !== p.uid) return;
    const q = live.get(clean(m.uid, 64));
    if (!q || q.game !== p.game || q.zi !== p.zi || (q.tier | 0) !== (p.tier | 0)) return;
    let d = Math.max(0, +m.d || 0);
    if (!(d > 0)) return;
    const cap = Math.max(1, (+q.hpm || 80) * 0.55);
    if (d > cap) {
      console.log('[mob] clamped strike ' + Math.round(d) + ' to ' + Math.round(cap) + ' on ' + q.name);
      d = cap;
    }
    send(q, 'mdmg', { d: Math.round(d), name: clean(m.name, 40) || 'a machine', slow: m.slow ? 1 : 0 });
  },

  /* Soak clients measure this. It is not a game action. */
  ping(p, m) {
    if (!rate(p, 'ping', 30, 10000)) return;
    /* `t` is the frame type. The client's clock rides in `at`, or it would replace the type. */
    send(p, 'pong', { n: m.n, at: m.at });
  },

  /* Reported by the defender, so a win cannot simply be asserted by the winner. */
  died(p, m) {
    const killer = live.get(m.uid);
    if (!killer || killer.game !== p.game) return;
    const duel = p.zi === SIM_ZONE;
    inGame(gameOf(p), 'kill', { killer: killer.name, dead: p.name, duel });
  },

  sim(p, m) {
    const party = partyOf(p);
    if (!party) return sys(p, 'The rig takes a party. You are alone.');
    if (m.action === 'open') {
      if (party.leader !== p.uid) return sys(p, 'The leader books the rig.');
      party.sim = { mode: m.mode === 'duel' ? 'duel' : 'waves', seed: (Math.random() * 1e9) | 0, wave: 0, at: nowSec() };
      for (const q of membersOf(party)) {
        send(q, 'sim', { action: 'open', sim: party.sim, by: p.name });
        sys(q, party.sim.mode === 'duel'
          ? p.name + ' has booked the rig for a duel. Nothing in there is real and nothing in there is kept.'
          : p.name + ' has booked the rig. Waves, together.');
      }
      pushParty(party);
    } else if (m.action === 'wave') {
      if (!party.sim) return;
      const w = +m.wave || 0;
      if (w <= party.sim.wave) return;
      party.sim.wave = w;
      for (const q of membersOf(party)) send(q, 'sim', { action: 'wave', wave: w });
    } else if (m.action === 'close') {
      if (party.leader !== p.uid) return;
      party.sim = null;
      for (const q of membersOf(party)) send(q, 'sim', { action: 'close' });
      pushParty(party);
    }
  },

  /* ---- voice ----
     The server only carries the handshake. Audio goes peer to peer and never touches it,
     which is why voice costs the server nothing and why it is bounded by the mesh rather
     than by bandwidth here. */
  rtc(p, m) {
    const q = live.get(m.uid);
    if (!q || !p.game || q.game !== p.game) return;
    if (!rate(p, 'rtc', 120, 10000)) return;
    const kind = clean(m.kind, 10);
    if (kind !== 'offer' && kind !== 'answer' && kind !== 'ice' && kind !== 'bye') return;
    send(q, 'rtc', { kind, from: p.uid, name: p.name, data: m.data });
  },

  /* Who currently has a microphone open, so the roster can show it. */
  voice(p, m) {
    p.voice = !!m.on;
    if (p.game) inGame(gameOf(p), 'voice', { uid: p.uid, on: p.voice });
  },

  'trade.ask'(p, m) {
    const q = live.get(m.uid);
    const why = tradePlace(p, q);
    if (why) return sys(p, why);
    if (tradeOf(p) || tradeOf(q)) return sys(p, 'Somebody is already at a table.');
    if (!rate(p, 'trade', 8, 10000)) return sys(p, 'Slow down.');
    q.tradeAsk = { uid: p.uid, until: Date.now() + 30000 };
    send(q, 'trade', { phase: 'ask', id: '', with: p.uid, from: p.name });
    sys(p, 'Asked ' + q.name + ' to trade.');
  },

  'trade.accept'(p, m) {
    const q = live.get(m.uid);
    const ask = p.tradeAsk;
    if (!q || !ask || ask.uid !== q.uid || ask.until < Date.now()) return sys(p, 'That offer has lapsed.');
    p.tradeAsk = null;
    const why = tradePlace(p, q);
    if (why) return sys(p, why);
    if (tradeOf(p) || tradeOf(q)) return sys(p, 'Somebody is already at a table.');
    tradeOpen(q, p);
  },

  'trade.offer'(p, m) {
    const s = tradeOf(p);
    if (!tradeLive(s)) return;
    const q = live.get(s.a === p.uid ? s.b : s.a);
    const why = tradePlace(p, q);
    if (why) { tradeDrop(p, 'moved'); return; }
    s.phase = 'open';
    s.offer[p.uid] = tradeOffer(m);
    s.ok = {};
    s.hold = {};
    tradePush(s);
  },

  'trade.confirm'(p, m) {
    const s = tradeOf(p);
    if (!s) return;
    if (s.phase === 'done') { tradeReplay(p); return; }
    if (s.phase !== 'open') return;
    const q = live.get(s.a === p.uid ? s.b : s.a);
    const why = tradePlace(p, q);
    if (why) { tradeDrop(p, 'moved'); return; }
    const mine = s.offer[p.uid] || { sats: 0, items: [] };
    s.ok[p.uid] = tradeHash(mine);
    s.hold = {};
    if (s.ok[s.a] && s.ok[s.b]) s.phase = 'check';
    tradePush(s);
  },

  /* Both confirms only open the check. The swap waits until each side reports
     the sats and the item ids still in hand. A short report cancels both. */
  'trade.hold'(p, m) {
    const s = tradeOf(p);
    if (!s || s.phase !== 'check') return;
    const q = live.get(s.a === p.uid ? s.b : s.a);
    const why = tradePlace(p, q);
    if (why) { tradeDrop(p, 'moved'); return; }
    s.hold = s.hold || {};
    s.hold[p.uid] = tradeHold(m);
    if (!s.hold[s.a] || !s.hold[s.b]) return;
    if (!tradeCovers(s.offer[s.a], s.hold[s.a]) || !tradeCovers(s.offer[s.b], s.hold[s.b])) {
      tradeDrop(p, 'short');
      return;
    }
    tradeSettle(s);
  },

  'trade.cancel'(p) { tradeDrop(p, 'cancel'); },

  'trade.ack'(p, m) {
    const s = tradeOf(p);
    if (!s || s.phase !== 'done' || !m || m.id !== s.id) return;
    s.acked = s.acked || {};
    s.acked[p.uid] = 1;
    if (s.acked[s.a] && s.acked[s.b]) tradeForget(s);
  }
};

const rates = new WeakMap();
/* Within 5 levels the share is whole. It slides from 6 to 9 and floors at 5%
   once the gap is 10. No separate penalty at level 70 or above: the later
   decay table is not this game's. */
function xpCurve(lvl, ml) {
  const monster = +ml || 0;
  if (!(monster > 0)) return 1;
  const d = Math.abs((+lvl || 1) - monster);
  if (d <= 5) return 1;
  if (d >= 10) return 0.05;
  return 1 - (d - 5) * 0.19;
}

function rate(p, key, max, win) {
  let m = rates.get(p);
  if (!m) { m = new Map(); rates.set(p, m); }
  const t = Date.now(), b = m.get(key);
  if (!b || b.until < t) { m.set(key, { n: 1, until: t + win }); return true; }
  if (b.n >= max) return false;
  b.n++; return true;
}

function greet(p, opt) {
  const turn = turnCfg();
  send(p, 'you', {
    uid: p.uid, name: p.name, maxParty: MAX_PARTY, maxGame: MAX_GAME,
    pvpScale: PVP_SCALE, simZone: SIM_ZONE, build: buildId(), grace: GRACE_MS,
    turn: turn || undefined, resumed: opt && opt.resumed ? 1 : 0
  });
  tradeReplay(p);
}

function wire(p, conn) {
  conn.on('message', m => {
    if (live.get(p.uid) !== p || p.conn !== conn) return;
    if (!m || typeof m.t !== 'string') return;
    const fn = HANDLERS[m.t];
    if (!fn) return;
    msgN++;
    if (!rate(p, 'msg', 300, 10000)) return;
    try { fn(p, m); } catch (e) { console.error('[live]', m.t, e.message); }
  });
  conn.on('close', () => {
    if (live.get(p.uid) !== p || p.conn !== conn) return;
    park(p);
  });
}

/* A client that asked to be resumed keeps its game and party for GRACE_MS. Anything
   else — a test socket, an explicit leave, a kick — is gone immediately. */
function park(p) {
  const openTrade = tradeOf(p);
  if (tradeLive(openTrade)) tradeDrop(p, 'dropped');
  if (!p.wantsResume || !p.game) {
    leaveGame(p, { silent: true });
    pushOffline(p);
    live.delete(p.uid);
    pushLobby();
    return;
  }
  p.conn = null;
  p.awayUntil = Date.now() + GRACE_MS;
  zoneIndex(p, true);
  const g = gameOf(p);
  for (const q of gamePlayers(g)) if (q !== p) sys(q, p.name + ' dropped. Holding their place.');
  if (p.awayTimer) clearTimeout(p.awayTimer);
  p.awayTimer = setTimeout(() => {
    if (live.get(p.uid) !== p || p.conn) return;
    rememberParty(p);
    leaveGame(p, { silent: true, holdParty: true });
    pushOffline(p);
    live.delete(p.uid);
    pushLobby();
  }, GRACE_MS);
  if (p.awayTimer.unref) p.awayTimer.unref();
}

function resume(p, conn) {
  if (p.awayTimer) { clearTimeout(p.awayTimer); p.awayTimer = null; }
  p.conn = conn;
  p.awayUntil = 0;
  wire(p, conn);
  greet(p, { resumed: 1 });
  const g = gameOf(p);
  if (g) {
    zoneIndex(p);
    send(p, 'game', { game: gameInfo(g), you: p.uid, scale: gameScale(g), maps: mapRows(g), resumed: 1 });
    const party = partyOf(p);
    if (party) pushParty(party);
    pushRoster(g);
    pushZone(p);
    for (const q of gamePlayers(g)) if (q !== p) sys(q, p.name + ' is back.');
  } else {
    send(p, 'lobby', { games: lobby(), max: MAX_GAME, diffs: DIFFS });
  }
  pushFriends(p);
}

function drop(p, text) {
  if (!p) return;
  p.wantsResume = false;
  if (p.awayTimer) { clearTimeout(p.awayTimer); p.awayTimer = null; }
  if (text) notice(p, text);
  const conn = p.conn;
  p.conn = null;
  if (live.get(p.uid) === p) {
    leaveGame(p, { silent: true });
    pushOffline(p);
    live.delete(p.uid);
    pushLobby();
  }
  if (conn) { try { conn.close(); } catch (e) {} }
}

function attach(server, verify) {
  ws.attach(server, '/live', verify, (conn, ctx) => {
    const old = live.get(ctx.user.id);
    if (old && !old.conn && old.awayUntil > Date.now()) {
      resume(old, conn);
      return;
    }
    if (old) {
      old.wantsResume = false;
      const prev = old.conn;
      old.conn = null;
      if (prev) { try { prev.close(); } catch (e) {} }
      leaveGame(old, { silent: true });
      pushOffline(old);
      if (live.get(old.uid) === old) live.delete(old.uid);
    }

    if (live.size >= MAX_PLAYERS) {
      conn.send({ t: 'full', max: MAX_PLAYERS, text: 'The server is full — ' + MAX_PLAYERS + ' people are on it. Try again in a few minutes.' });
      setTimeout(() => conn.close(), 250);
      return;
    }

    const p = {
      uid: ctx.user.id, name: ctx.user.name, conn,
      lvl: 1, cls: '', zi: 0, inst: null, zoneKey: undefined, x: 0, y: 0, dir: 0, hp: 1, hpm: 1,
      sk: null, au: null, aL: 0, node: 0, nm: 0, bf: null, bfUntil: null, tes: null, sw: 0, pail: null, pailStore: 0,
      game: null, party: null, quest: {}, hostile: new Set(), declaredAt: new Map(), portalLock: 0, invites: new Map(), safeUntil: 0, townSince: 0, voice: false, joined: Date.now(),
      wantsResume: false, awayUntil: 0, awayTimer: null
    };
    live.set(p.uid, p);
    wire(p, conn);
    greet(p);
    send(p, 'lobby', { games: lobby(), max: MAX_GAME, diffs: DIFFS });
    pushFriends(p);
  });

  const beat = setInterval(() => {
    for (const p of live.values()) {
      if (!p.conn) continue;
      if (!p.conn.alive) { p.conn.close(); continue; }
      p.conn.ping();
    }
  }, 25000);
  beat.unref();

  const stats = setInterval(() => {
    const mem = process.memoryUsage();
    console.log('[live] players=' + live.size + ' games=' + games.size + ' parties=' + parties.size +
      ' msgs=' + msgN + ' rss=' + Math.round(mem.rss / 1048576) + 'MB bugFail=' + intake.failures() +
      ' hitRej=' + plaus.takeHitRej() + ' hpFlag=' + plaus.takeHpFlag());
    msgN = 0;
  }, 60000);
  stats.unref();
}

module.exports = {
  attach, live, games, parties, MAX_PARTY, MAX_GAME, MAX_PLAYERS, MAX_GAMES,
  PARTY_POOL, PVP_SCALE, SIM_ZONE, TOWNS, canFight, mutualHostile, gameScale, DIFFS,
  poke, pushFriends, send, notice, drop, GRACE_MS
};
