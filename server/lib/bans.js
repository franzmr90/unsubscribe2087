/* Bans live in the data directory and are re-read when the file changes, so the admin
   CLI can ban somebody without restarting the game. A ban blocks login and the socket.
   The account and its characters stay on disk until an admin resets them. */
'use strict';
const fs = require('fs');
const { Table, readJSON } = require('./store');

const bans = new Table('bans');
let mtime = -1;

function stamp() {
  try { return fs.statSync(bans.file).mtimeMs; } catch (e) { return 0; }
}
function reload() {
  const m = stamp();
  if (m === mtime) return;
  mtime = m;
  bans.rows = readJSON(bans.file, {});
}
function touch() { mtime = stamp(); }

function ban(user, reason) {
  reload();
  const row = { uid: user.id, name: user.name, key: user.key || String(user.name || '').trim().toLowerCase(), reason: String(reason || '').slice(0, 200), at: Date.now() };
  bans.set(row.uid, row);
  touch();
  return row;
}

function unban(nameOrId) {
  reload();
  const q = String(nameOrId || '').trim().toLowerCase();
  const rows = bans.all();
  let hit = null;
  for (const k in rows) {
    const r = rows[k];
    if (!r) continue;
    if (r.uid === nameOrId || r.key === q || String(r.name || '').toLowerCase() === q) { hit = k; break; }
  }
  if (!hit) return null;
  const row = rows[hit];
  bans.del(hit);
  touch();
  return row;
}

function banned(user) {
  if (!user) return false;
  reload();
  if (user.id && bans.get(user.id)) return bans.get(user.id);
  const q = String(user.key || user.name || '').trim().toLowerCase();
  return bans.find(r => r && (r.key === q || String(r.name || '').toLowerCase() === q)) || null;
}

function list() {
  reload();
  return Object.keys(bans.all()).map(k => bans.get(k));
}

module.exports = { ban, unban, banned, list, reload };
