/* Presence, parties, hostility and the Simulator, over one WebSocket per player.

   The rules are Diablo II's, because they were right: a party is an invitation both sides
   agree to, experience is shared by level among the members who are actually there,
   hostility is declared rather than ambient, declaring it throws you out of the party, and
   it cannot be taken back while the session lasts. Town is safe. The arena is not.

   What the server is authoritative over: who exists, who is in which party, who is hostile
   to whom, who is in which district, and the Simulator's wave number. What it is not
   authoritative over: monsters and damage, which each client simulates for itself. That is
   a real limitation and it is written down in MULTIPLAYER.md rather than hidden here. */
'use strict';
const ws = require('./ws');

const MAX_PARTY = 8;
/* A hard ceiling, so a busy day degrades into a clear refusal rather than into a server
   that gets slower and slower and then stops. See MULTIPLAYER.md on sharding into
   separate games, which is what actually raises this number. */
const MAX_PLAYERS = +(process.env.MAX_PLAYERS || 40);
/* Diablo II's party experience multiplier, by number of members present. */
const PARTY_BONUS = [1, 1, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3];
const PVP_SCALE = 0.25;            /* players are much tougher to each other than monsters are */
const TOWNS = new Set([0, 17, 18, 21, 27]);
const SIM_ZONE = 6;

const live = new Map();            /* uid -> player */
const parties = new Map();         /* party id -> {id, leader, members:Set, sim} */
let partySeq = 1;

const nowSec = () => Math.floor(Date.now() / 1000);

function pub(p) {
  return {
    uid: p.uid, name: p.name, lvl: p.lvl, cls: p.cls, zi: p.zi,
    party: p.party || null, hp: p.hp, hpm: p.hpm,
    hostile: [...p.hostile], sim: p.sim || null
  };
}
function loc(p) { return { uid: p.uid, name: p.name, lvl: p.lvl, cls: p.cls, x: p.x, y: p.y, hp: p.hp, hpm: p.hpm, dir: p.dir, act: p.act }; }

function send(p, t, d) { if (p && p.conn) p.conn.send(Object.assign({ t }, d)); }
function sys(p, text) { send(p, 'sys', { text }); }

function broadcast(t, d, filter) {
  for (const p of live.values()) if (!filter || filter(p)) send(p, t, d);
}

function roster() {
  return [...live.values()].map(pub);
}
let rosterT = null;
function pushRoster() {
  if (rosterT) return;
  rosterT = setTimeout(() => { rosterT = null; broadcast('roster', { players: roster() }); }, 250);
  if (rosterT.unref) rosterT.unref();
}

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
  /* Tell the one who left, too: they are no longer on the party's distribution list, so
     the broadcast below would never reach them. */
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
  pushRoster();
}

/* Hostility is mutual once declared by either side: in Diablo II you do not get to be
   hostile to somebody who cannot fight back. */
function mutualHostile(a, b) { return !!(a && b && (a.hostile.has(b.uid) || b.hostile.has(a.uid))); }

function canFight(a, b) {
  if (!a || !b || a.uid === b.uid) return false;
  if (a.zi !== b.zi) return false;
  if (!mutualHostile(a, b)) return false;
  if (TOWNS.has(a.zi)) return false;            /* town is safe, always */
  if (a.safeUntil && a.safeUntil > Date.now()) return false;
  if (b.safeUntil && b.safeUntil > Date.now()) return false;
  return true;
}

const byZone = new Map();
const zoneKey = p => p.zi + '/' + (p.inst || '');
function zoneIndex(p, remove) {
  const k = p.zoneKey;
  if (k !== undefined) { const s = byZone.get(k); if (s) { s.delete(p); if (!s.size) byZone.delete(k); } }
  if (remove) { p.zoneKey = undefined; return; }
  const nk = zoneKey(p);
  p.zoneKey = nk;
  let s = byZone.get(nk);
  if (!s) { s = new Set(); byZone.set(nk, s); }
  s.add(p);
}
function zonePeers(p) {
  const s = byZone.get(zoneKey(p));
  if (!s) return [];
  const out = [];
  for (const q of s) if (q !== p) out.push(q);
  return out;
}

function pushZone(p) {
  const peers = zonePeers(p);
  send(p, 'zone', { zi: p.zi, players: peers.map(loc) });
}

const HANDLERS = {
  hello(p, m) {
    p.lvl = +m.lvl || 1; p.cls = String(m.cls || '').slice(0, 16);
    p.zi = +m.zi || 0; zoneIndex(p); p.hp = +m.hp || 0; p.hpm = +m.hpm || 1; p.act = +m.act || 1;
    pushRoster();
  },

  move(p, m) {
    p.x = +m.x || 0; p.y = +m.y || 0; p.dir = +m.dir || 0;
    p.hp = +m.hp || 0; p.hpm = +m.hpm || 1;
    const zi = +m.zi;
    if (zi !== p.zi) {
      p.zi = zi;
      p.inst = m.inst || null;
      zoneIndex(p);
      pushRoster();
      /* Entering a district makes you briefly unkillable, so a hostile cannot camp the
         doorway. Diablo II did the same thing with its five seconds. */
      p.safeUntil = Date.now() + 5000;
    }
    pushZone(p);
  },

  chat(p, m) {
    const text = String(m.text || '').slice(0, 400).trim();
    if (!text) return;
    if (!rate(p, 'chat', 12, 10000)) return sys(p, 'Slow down.');
    const out = { from: p.name, uid: p.uid, text, scope: m.scope === 'party' ? 'party' : 'all' };
    if (out.scope === 'party') {
      const party = partyOf(p);
      if (!party) return sys(p, 'You are not in a party.');
      for (const q of membersOf(party)) send(q, 'chat', out);
    } else broadcast('chat', out);
  },

  invite(p, m) {
    const q = live.get(m.uid);
    if (!q) return sys(p, 'They are not here.');
    if (mutualHostile(p, q)) return sys(p, 'You have declared against each other. That does not come back.');
    let party = partyOf(p);
    if (party && party.leader !== p.uid) return sys(p, 'Only the leader invites.');
    if (party && party.members.size >= MAX_PARTY) return sys(p, 'A party holds eight.');
    if (q.party) return sys(p, q.name + ' is already in a party.');
    q.invites.set(p.uid, Date.now() + 60000);
    send(q, 'invited', { from: p.name, uid: p.uid, lvl: p.lvl, cls: p.cls });
    sys(p, 'Asked ' + q.name + ' to join.');
  },

  accept(p, m) {
    const q = live.get(m.uid);
    const until = p.invites.get(m.uid);
    if (!q || !until || until < Date.now()) return sys(p, 'That invitation has lapsed.');
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
    pushRoster();
  },

  decline(p, m) { p.invites.delete(m.uid); },

  leave(p) { leaveParty(p); },

  /* Declared, not ambient; it throws you out of the party; and it does not come back. */
  hostile(p, m) {
    const q = live.get(m.uid);
    if (!q) return;
    if (p.hostile.has(q.uid)) return sys(p, 'Already declared.');
    p.hostile.add(q.uid);
    const party = partyOf(p);
    if (party && party.members.has(q.uid)) leaveParty(p, true);
    broadcast('hostile', { from: p.name, fromUid: p.uid, to: q.name, toUid: q.uid });
    sys(q, p.name + ' has declared hostility against you.');
    sys(p, 'You have declared against ' + q.name + '. That stands until one of you leaves.');
    pushRoster();
  },

  /* Experience from a kill, shared the way Diablo II shared it: only among members in the
     same district, weighted by level, with a bonus for the size of the party. */
  xp(p, m) {
    const amount = Math.max(0, Math.min(1e9, +m.amount || 0));
    if (!amount) return;
    const party = partyOf(p);
    if (!party) return;
    const here = membersOf(party).filter(q => q.zi === p.zi && q.inst === p.inst);
    if (here.length < 2) return;
    const bonus = PARTY_BONUS[Math.min(here.length, 8)];
    const sum = here.reduce((a, q) => a + Math.max(1, q.lvl), 0);
    for (const q of here) {
      if (q.uid === p.uid) continue;
      const share = Math.round(amount * bonus * (Math.max(1, q.lvl) / sum));
      if (share > 0) send(q, 'xp', { amount: share, from: p.name });
    }
  },

  /* Quest progress is shared with the party members who are present, as it was in D2. */
  quest(p, m) {
    const party = partyOf(p);
    if (!party) return;
    const k = String(m.k || '').slice(0, 12), v = +m.v;
    if (!/^q\d{1,2}$/.test(k) || !(v >= 0 && v <= 3)) return;
    for (const q of membersOf(party)) if (q.uid !== p.uid && q.zi === p.zi) send(q, 'quest', { k, v, from: p.name });
  },

  /* The attacker's client says it landed a hit; the server decides whether the two are
     allowed to fight at all, scales it, and tells the defender. */
  pvp(p, m) {
    const q = live.get(m.uid);
    if (!canFight(p, q)) return;
    const dmg = Math.max(0, Math.min(1e7, +m.dmg || 0)) * PVP_SCALE;
    if (!dmg) return;
    send(q, 'pvp', { from: p.name, fromUid: p.uid, dmg: Math.round(dmg), kind: String(m.kind || '').slice(0, 12) });
  },

  /* Reported by the defender, so a win cannot simply be asserted by the winner. */
  died(p, m) {
    const killer = live.get(m.uid);
    if (!killer) return;
    const duel = p.zi === SIM_ZONE;
    broadcast('kill', { killer: killer.name, dead: p.name, duel });
    if (duel) { killer.duelW = (killer.duelW || 0) + 1; p.duelL = (p.duelL || 0) + 1; }
  },

  /* The Simulator: the party's shared arena, for waves together or for duelling.
     The leader opens it, the server holds the wave number and the seed so every client
     generates the same waves, and everyone in it sees everyone else. */
  sim(p, m) {
    const party = partyOf(p);
    if (!party) return sys(p, 'The rig takes a party. You are alone.');
    if (m.action === 'open') {
      if (party.leader !== p.uid) return sys(p, 'The leader books the rig.');
      party.sim = {
        mode: m.mode === 'duel' ? 'duel' : 'waves',
        seed: (Math.random() * 1e9) | 0,
        wave: 0, at: nowSec()
      };
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
      if (w <= party.sim.wave) return;              /* the first client to clear it reports it */
      party.sim.wave = w;
      for (const q of membersOf(party)) send(q, 'sim', { action: 'wave', wave: w });
    } else if (m.action === 'close') {
      if (party.leader !== p.uid) return;
      party.sim = null;
      for (const q of membersOf(party)) send(q, 'sim', { action: 'close' });
      pushParty(party);
    }
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
    /* One session, one presence: a second connection replaces the first rather than
       producing two of the same person in the roster. */
    const old = live.get(ctx.user.id);
    if (old) { try { old.conn.close(); } catch (e) {} live.delete(old.uid); }

    const p = {
      uid: ctx.user.id, name: ctx.user.name, conn,
      lvl: 1, cls: '', zi: 0, inst: null, x: 0, y: 0, dir: 0, hp: 1, hpm: 1, act: 1,
      party: null, hostile: new Set(), invites: new Map(), safeUntil: 0, joined: Date.now()
    };
    if (live.size >= MAX_PLAYERS) {
      conn.send({ t: 'full', max: MAX_PLAYERS, text: 'This world is full — ' + MAX_PLAYERS + ' people are already in it. Try again in a few minutes.' });
      setTimeout(() => conn.close(), 250);
      return;
    }
    live.set(p.uid, p);
    zoneIndex(p);

    send(p, 'you', { uid: p.uid, name: p.name, maxParty: MAX_PARTY, pvpScale: PVP_SCALE, simZone: SIM_ZONE });
    pushRoster();

    conn.on('message', m => {
      if (!m || typeof m.t !== 'string') return;
      const fn = HANDLERS[m.t];
      if (!fn) return;
      if (!rate(p, 'msg', 240, 10000)) return;
      try { fn(p, m); } catch (e) { console.error('[live]', m.t, e.message); }
    });

    conn.on('close', () => {
      leaveParty(p, true);
      zoneIndex(p, true);
      live.delete(p.uid);
      /* Hostility is forgotten when you leave, which is also how Diablo II ended it. */
      for (const q of live.values()) q.hostile.delete(p.uid);
      pushRoster();
    });
  });

  /* Drop connections that have stopped answering, so the roster does not fill with ghosts. */
  const beat = setInterval(() => {
    for (const p of live.values()) {
      if (!p.conn.alive) { p.conn.close(); continue; }
      p.conn.ping();
    }
  }, 25000);
  beat.unref();
}

module.exports = { attach, live, parties, MAX_PARTY, MAX_PLAYERS, PARTY_BONUS, PVP_SCALE, SIM_ZONE, TOWNS, canFight, mutualHostile };
