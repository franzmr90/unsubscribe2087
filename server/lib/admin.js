/* Operations the admin CLI and the /api/admin routes share. File-backed pieces (invites,
   bans, character documents) are visible to a second process because those tables reload
   when the file changes. Kick, broadcast and the online list have to run inside the
   process that holds the sockets. */
'use strict';
const { docs } = require('./store');
const auth = require('./auth');
const invites = require('./invites');
const bans = require('./bans');
const guard = require('./guard');

function liveMod() { return require('./live'); }

function findUser(name) {
  const u = auth.findByName(name);
  if (u) return u;
  const q = String(name || '').trim();
  return auth.byId(q);
}

function online() {
  const live = liveMod();
  const out = [];
  for (const p of live.live.values()) {
    const g = p.game ? live.games.get(p.game) : null;
    out.push({
      name: p.name, uid: p.uid, lvl: p.lvl || 1, cls: p.cls || '',
      game: g ? g.name : '', gameId: p.game || '', zi: p.zi, away: !p.conn
    });
  }
  out.sort((a, b) => a.name.localeCompare(b.name));
  return out;
}

function findLive(name) {
  const live = liveMod();
  const q = String(name || '').trim().toLowerCase();
  for (const p of live.live.values()) if (p.name.toLowerCase() === q || p.uid === name) return p;
  return null;
}

function kick(name) {
  const hit = findLive(name);
  if (!hit) return null;
  liveMod().drop(hit, 'You were removed from the server.');
  return { name: hit.name, uid: hit.uid };
}

function broadcast(text) {
  const live = liveMod();
  const line = String(text || '').trim().slice(0, 400);
  if (!line) return 0;
  let n = 0;
  for (const p of live.live.values()) { live.notice(p, line); n++; }
  return n;
}

function banUser(name, reason) {
  const u = findUser(name);
  if (!u) return null;
  const row = bans.ban(u, reason);
  const live = findLive(u.name);
  if (live) liveMod().drop(live, 'This account is banned.');
  return row;
}

function unbanUser(name) {
  return bans.unban(name);
}

/* Slot 0 is `main` and `z12`. Slot 1 is `main1` and `s1z12`. The lockbox (`acct`) is
   shared by every character on the account and is not wiped with one of them. */
function slotIds(slot) {
  if (slot === 'all') return null;
  const n = +slot;
  if (n === 0) return { main: 'main', zone: /^z\d+$/ };
  if (n === 1 || n === 2) return { main: 'main' + n, zone: new RegExp('^s' + n + 'z\\d+$') };
  return undefined;
}

function resetChar(name, slot) {
  const u = findUser(name);
  if (!u) return null;
  const which = slot == null || slot === '' ? 'all' : slot;
  const spec = slotIds(which);
  if (spec === undefined) return { error: 'Slot is 0, 1, 2 or all.' };
  guard.holdSaves(u.id, 60000);
  const live = findLive(u.name);
  if (live) {
    liveMod().send(live, 'wipe', { slot: String(which) });
    const who = live;
    setTimeout(() => { try { liveMod().drop(who, 'This character was reset.'); } catch (e) {} }, 400);
  }
  const ids = docs.list(u.id);
  const gone = [];
  for (const id of ids) {
    if (id === 'acct') continue;
    const match = spec === null
      ? (/^main[12]?$/.test(id) || /^z\d+$/.test(id) || /^s[12]z\d+$/.test(id))
      : (id === spec.main || spec.zone.test(id));
    if (!match) continue;
    docs.del(u.id, id);
    gone.push(id);
  }
  return { name: u.name, uid: u.id, slot: slot == null || slot === '' ? 'all' : String(slot), deleted: gone };
}

module.exports = {
  online, kick, broadcast, banUser, unbanUser, resetChar,
  invites, bans, findUser
};
