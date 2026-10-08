/* Invite codes and an allowlist. Registration stays open when none of these are set,
   which is what the local tests rely on. A beta turns the gate on with INVITE_REQUIRED,
   INVITE_CODES, ALLOWLIST, or by minting a code into the data directory.

   The table is re-read when the file changes, so the admin CLI can mint and revoke
   without restarting the process that is actually serving the game. */
'use strict';
const fs = require('fs');
const crypto = require('crypto');
const { Table, readJSON } = require('./store');

const invites = new Table('invites');
let mtime = -1;

function stamp() {
  try { return fs.statSync(invites.file).mtimeMs; } catch (e) { return 0; }
}
function reload() {
  const m = stamp();
  if (m === mtime) return;
  mtime = m;
  invites.rows = readJSON(invites.file, {});
}
function touch() { mtime = stamp(); }

function seedEnv() {
  const raw = process.env.INVITE_CODES || '';
  let wrote = false;
  for (const code of raw.split(',').map(s => s.trim()).filter(Boolean)) {
    const k = norm(code);
    if (!k || invites.get(k)) continue;
    invites.set(k, rec(code, { note: 'env', uses: 0, env: true }));
    wrote = true;
  }
  if (wrote) touch();
}

function norm(code) { return String(code || '').trim().toLowerCase(); }

function rec(code, opt) {
  const uses = opt.uses == null ? 1 : Math.max(0, +opt.uses || 0);
  return {
    code: norm(code), note: String(opt.note || '').slice(0, 80),
    maxUses: uses, uses: 0, usedBy: [], revoked: false, created: Date.now(), env: !!opt.env
  };
}

function required() {
  if (process.env.INVITE_REQUIRED === '1' || process.env.INVITE_REQUIRED === 'true') return true;
  if ((process.env.INVITE_CODES || '').trim()) return true;
  if ((process.env.ALLOWLIST || '').trim()) return true;
  reload();
  const rows = invites.all();
  for (const k in rows) if (rows[k] && !rows[k].revoked) return true;
  return false;
}

function allowed(name, email) {
  const list = (process.env.ALLOWLIST || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  if (!list.length) return false;
  const n = String(name || '').trim().toLowerCase();
  const e = String(email || '').trim().toLowerCase();
  return list.some(x => x === n || (e && x === e));
}

/* Does not consume. The route consumes only after the account exists, so a taken name
   does not burn a single-use code. */
function check(name, email, code) {
  if (!required()) return { ok: true, open: true };
  if (allowed(name, email)) return { ok: true, via: 'allow' };
  reload();
  const k = norm(code);
  if (!k) return { ok: false, error: 'An invite code is required.' };
  const row = invites.get(k);
  if (!row || row.revoked) return { ok: false, error: 'That invite code is not valid.' };
  if (row.maxUses > 0 && row.uses >= row.maxUses) return { ok: false, error: 'That invite code has been used up.' };
  return { ok: true, via: 'code', code: k };
}

function consume(code, user) {
  const k = norm(code);
  if (!k) return;
  reload();
  const row = invites.get(k);
  if (!row) return;
  row.uses = (row.uses || 0) + 1;
  row.usedBy = (row.usedBy || []).concat({ id: user.id, name: user.name, at: Date.now() }).slice(-20);
  invites.set(k, row);
  touch();
}

function mint(opt) {
  opt = opt || {};
  reload();
  let code = norm(opt.code);
  if (!code) code = crypto.randomBytes(9).toString('base64url').replace(/[^a-z0-9]/gi, '').slice(0, 12).toLowerCase();
  if (invites.get(code) && !invites.get(code).revoked) return null;
  const row = rec(code, opt);
  invites.set(code, row);
  touch();
  return row;
}

function revoke(code) {
  reload();
  const k = norm(code);
  const row = invites.get(k);
  if (!row) return null;
  row.revoked = true;
  invites.set(k, row);
  touch();
  return row;
}

function list() {
  reload();
  return Object.keys(invites.all()).map(k => invites.get(k));
}

seedEnv();

module.exports = { required, allowed, check, consume, mint, revoke, list, reload };
