/* Games, parties, hostility and the rig, over one WebSocket per player.

   The shape is Diablo II's, including the bit people forget: a **game** is the shared
   world, and it holds eight. A **party** is a smaller agreement inside that game about
   sharing experience. You can be in a game with seven other people and in a party with
   none of them. Monsters get tougher with the number of people in the game, not the party.

   Scoping everything to a game of eight is also what makes the server safe to post
   publicly: every cost below is bounded by the size of a game rather than by the number
   of people on the server.

   The rules: a party is an invitation both sides agree to; experience is shared by level
   among the members who are actually in the district; hostility is declared rather than
   ambient, it throws you out of the party, and it cannot be taken back while the game
   lasts. Town is safe. The arena is not.

   What the server is authoritative over: who exists, which game they are in, who is in
   which party, who is hostile to whom, who is in which district, and the Simulator's wave
   number. What it is not authoritative over: monsters and damage, which each client
   simulates for itself. That is a real limitation and MULTIPLAYER.md says so plainly. */
'use strict';
const ws = require('./ws');

const MAX_GAME = 8;                /* Diablo II's number, and the reason this scales */
const MAX_PARTY = 8;
const MAX_GAMES = +(process.env.MAX_GAMES || 200);
const MAX_PLAYERS = +(process.env.MAX_PLAYERS || 400);
/* Diablo II's party experience multiplier, by number of members present. */
const PARTY_BONUS = [1, 1, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3];
const PVP_SCALE = 0.25;            /* players are much tougher to each other than monsters */
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
let partySeq = 1, gameSeq = 1;

const nowSec = () => Math.floor(Date.now() / 1000);
const clean = (s, n) => String(s === undefined || s === null ? '' : s).slice(0, n);

function send(p, t, d) { if (p && p.conn) p.conn.send(Object.assign({ t }, d)); }
function sys(p, text) { send(p, 'sys', { text }); }

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
  if (n !== v || n < 0 || n > 14) return null;
  return n;
}
function auraIx(v) { return v === 3 || v === 4 || v === 7 ? v : null; }
function loc(p) {
  return {
    uid: p.uid, name: p.name, lvl: p.lvl, cls: p.cls, x: p.x, y: p.y, hp: p.hp, hpm: p.hpm, dir: p.dir,
    sk: p.sk == null ? null : p.sk, au: p.au == null ? null : p.au, sw: p.sw ? 1 : 0
  };
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

function joinGame(p, g) {
  if (g.players.size >= MAX_GAME) return 'That game is full.';
  if (p.game) leaveGame(p);
  g.players.add(p.uid);
  p.game = g.id;
  zoneIndex(p);
  send(p, 'game', { game: gameInfo(g), you: p.uid, scale: gameScale(g) });
  for (const q of gamePlayers(g)) if (q !== p) sys(q, p.name + ' has entered the game.');
  pushRoster(g);
  pushLobby();
  pushFriends(p);
  return null;
}

function leaveGame(p, opt) {
  const g = gameOf(p);
  leaveParty(p, true);
  zoneIndex(p, true);
  p.game = null;
  /* Hostility belongs to a game, exactly as it did in Diablo II: leave and it is over. */
  p.hostile.clear();
  p.invites.clear();
  /* Straight back to the lobby, with the list already in hand rather than a blank panel
     waiting on the next coalesced push. */
  send(p, 'game', { game: null });
  send(p, 'lobby', { games: lobby(), max: MAX_GAME, diffs: DIFFS });
  /* A dropped socket says offline once. Saying "still on, just not in a game"
     first would flash them back online to everyone they know. */
  if (!g) { if (!(opt && opt.silent)) pushFriends(p); return; }
  g.players.delete(p.uid);
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
  if (!mutualHostile(a, b)) return false;
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
/* A cast is one beat long. Push it to the district instead of waiting for their next
   heartbeat, or the other client can sample the beat after it has already been cleared. */
function pushPeers(p) { for (const q of zonePeers(p)) pushZone(q); }

const HANDLERS = {
  hello(p, m) {
    p.lvl = +m.lvl || 1; p.cls = clean(m.cls, 16);
    p.zi = +m.zi || 0; p.hp = +m.hp || 0; p.hpm = +m.hpm || 1;
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
    const g = { id: 'g' + (gameSeq++), name, diff, host: p.uid, pass: clean(m.pass, 40), players: new Set(), created: Date.now() };
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

  /* ---- being somewhere ---- */
  /* sk, au and sw are stored and forwarded like dir. They are not simulated, and they
     are not a hit. A missing field leaves the stored value alone. */
  move(p, m) {
    p.x = +m.x || 0; p.y = +m.y || 0; p.dir = +m.dir || 0;
    p.hp = +m.hp || 0; p.hpm = +m.hpm || 1;
    const cosmetic = ('sk' in m) || ('au' in m) || ('sw' in m);
    if ('sk' in m) p.sk = m.sk === null ? null : skillIx(m.sk);
    if ('au' in m) p.au = auraIx(m.au);
    if ('sw' in m) p.sw = m.sw === 1 ? 1 : 0;
    if (!p.game) return;
    const zi = +m.zi, inst = m.inst || null;
    if (zi !== p.zi || inst !== p.inst) {
      p.zi = zi; p.inst = inst;
      zoneIndex(p);
      pushRoster(gameOf(p));
      /* Walking in buys five seconds, so a hostile cannot camp the doorway. */
      p.safeUntil = Date.now() + 5000;
    }
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
    if (q) {
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
    if (p.hostile.has(q.uid)) return sys(p, 'Already declared.');
    p.hostile.add(q.uid);
    const party = partyOf(p);
    if (party && party.members.has(q.uid)) leaveParty(p, true);
    inGame(gameOf(p), 'hostile', { from: p.name, fromUid: p.uid, to: q.name, toUid: q.uid });
    sys(q, p.name + ' has declared hostility against you.');
    sys(p, 'You have declared against ' + q.name + '. That stands until one of you leaves the game.');
    pushRoster(gameOf(p));
  },

  xp(p, m) {
    const amount = Math.max(0, Math.min(1e9, +m.amount || 0));
    if (!amount) return;
    const party = partyOf(p);
    if (!party) return;
    const here = membersOf(party).filter(q => q.zi === p.zi && q.inst === p.inst && q.game === p.game);
    if (here.length < 2) return;
    const bonus = PARTY_BONUS[Math.min(here.length, 8)];
    const sum = here.reduce((a, q) => a + Math.max(1, q.lvl), 0);
    for (const q of here) {
      if (q.uid === p.uid) continue;
      const share = Math.round(amount * bonus * (Math.max(1, q.lvl) / sum));
      if (share > 0) send(q, 'xp', { amount: share, from: p.name });
    }
  },

  quest(p, m) {
    const party = partyOf(p);
    if (!party) return;
    const k = clean(m.k, 12), v = +m.v;
    if (!/^q\d{1,2}$/.test(k) || !(v >= 0 && v <= 3)) return;
    for (const q of membersOf(party)) if (q.uid !== p.uid && q.zi === p.zi) send(q, 'quest', { k, v, from: p.name });
  },

  pvp(p, m) {
    const q = live.get(m.uid);
    if (!canFight(p, q)) return;
    const dmg = Math.max(0, Math.min(1e7, +m.dmg || 0)) * PVP_SCALE;
    if (!dmg) return;
    send(q, 'pvp', { from: p.name, fromUid: p.uid, dmg: Math.round(dmg), kind: clean(m.kind, 12) });
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
  }
};

const rates = new WeakMap();
function rate(p, key, max, win) {
  let m = rates.get(p);
  if (!m) { m = new Map(); rates.set(p, m); }
  const t = Date.now(), b = m.get(key);
  if (!b || b.until < t) { m.set(key, { n: 1, until: t + win }); return true; }
  if (b.n >= max) return false;
  b.n++; return true;
}

function attach(server, verify) {
  ws.attach(server, '/live', verify, (conn, ctx) => {
    const old = live.get(ctx.user.id);
    if (old) {
      try { old.conn.close(); } catch (e) {}
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
      sk: null, au: null, sw: 0,
      game: null, party: null, hostile: new Set(), invites: new Map(), safeUntil: 0, voice: false, joined: Date.now()
    };
    live.set(p.uid, p);

    send(p, 'you', { uid: p.uid, name: p.name, maxParty: MAX_PARTY, maxGame: MAX_GAME, pvpScale: PVP_SCALE, simZone: SIM_ZONE });
    send(p, 'lobby', { games: lobby(), max: MAX_GAME, diffs: DIFFS });
    pushFriends(p);

    conn.on('message', m => {
      if (!m || typeof m.t !== 'string') return;
      const fn = HANDLERS[m.t];
      if (!fn) return;
      if (!rate(p, 'msg', 300, 10000)) return;
      try { fn(p, m); } catch (e) { console.error('[live]', m.t, e.message); }
    });

    conn.on('close', () => {
      if (live.get(p.uid) !== p) return;
      leaveGame(p, { silent: true });
      pushOffline(p);
      live.delete(p.uid);
      pushLobby();
    });
  });

  const beat = setInterval(() => {
    for (const p of live.values()) {
      if (!p.conn.alive) { p.conn.close(); continue; }
      p.conn.ping();
    }
  }, 25000);
  beat.unref();
}

module.exports = {
  attach, live, games, parties, MAX_PARTY, MAX_GAME, MAX_PLAYERS, MAX_GAMES,
  PARTY_BONUS, PVP_SCALE, SIM_ZONE, TOWNS, canFight, mutualHostile, gameScale, DIFFS,
  poke, pushFriends
};
