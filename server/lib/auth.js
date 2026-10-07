/* Passwords, sessions and the small number of ways in.
   scrypt from node:crypto — no dependency, memory-hard, and the parameters are stored
   next to each hash so they can be raised later without invalidating old passwords. */
'use strict';
const crypto = require('crypto');
const { Table, docs } = require('./store');

const users = new Table('users');
const sessions = new Table('sessions');
const tokens = new Table('tokens');

const SCRYPT = { N: 16384, r: 8, p: 1, len: 32 };
const SESSION_DAYS = 30;
const TOKEN_MINUTES = 30;

const now = () => Date.now();
const rand = n => crypto.randomBytes(n).toString('base64url');
const sha = s => crypto.createHash('sha256').update(s).digest('hex');

function hashPass(pass, params) {
  const p = params || Object.assign({ salt: rand(18) }, SCRYPT);
  const key = crypto.scryptSync(pass, p.salt, p.len, { N: p.N, r: p.r, p: p.p, maxmem: 64 * 1024 * 1024 });
  return { params: p, hash: key.toString('hex') };
}

function checkPass(pass, rec) {
  if (!rec || !rec.pass) return false;
  const got = hashPass(pass, rec.pass.params).hash;
  const a = Buffer.from(got, 'hex'), b = Buffer.from(rec.pass.hash, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/* What counts as a name and a password. Deliberately permissive on the password —
   length is the thing that matters and composition rules mostly produce Passw0rd!. */
const NAME_RE = /^[a-zA-Z0-9][a-zA-Z0-9_. -]{1,23}$/;
const EMAIL_RE = /^[^@\s]+@[^@\s.]+\.[^@\s]+$/;

function validateName(n) {
  if (typeof n !== 'string' || !NAME_RE.test(n.trim())) return 'Pick a name of 2 to 24 characters: letters, numbers, spaces, dot, dash or underscore.';
  return null;
}
function validatePass(p) {
  if (typeof p !== 'string' || p.length < 8) return 'A password needs at least 8 characters.';
  if (p.length > 200) return 'That password is too long.';
  return null;
}
function validateEmail(e) {
  if (e === undefined || e === null || e === '') return null;
  if (typeof e !== 'string' || !EMAIL_RE.test(e) || e.length > 160) return 'That does not look like an email address.';
  return null;
}

const keyOf = n => n.trim().toLowerCase();

function findByName(name) { return users.get(keyOf(name)) || null; }
function findByEmail(email) {
  if (!email) return null;
  const lc = email.trim().toLowerCase();
  return users.find(u => u.emailLc === lc);
}

function createUser(name, pass, email) {
  const key = keyOf(name);
  if (users.get(key)) return null;
  const h = hashPass(pass);
  const rec = {
    id: 'u' + rand(12), key, name: name.trim(),
    email: email ? email.trim() : '', emailLc: email ? email.trim().toLowerCase() : '',
    verified: false, pass: h, created: now(), seen: now()
  };
  users.set(key, rec);
  return rec;
}

function setPass(rec, pass) {
  rec.pass = hashPass(pass);
  rec.pwAt = now();
  users.flush();
  /* A password change signs every other device out. If the change was a recovery, the
     person who had the old password is the one being removed. */
  killSessions(rec.id);
}

function byId(id) { return users.find(u => u.id === id); }

/* ---- sessions ---- */
function newSession(uid) {
  const tok = rand(24);
  sessions.sweep(now());
  sessions.set(sha(tok), { uid, csrf: rand(18), exp: now() + SESSION_DAYS * 864e5 });
  return tok;
}
function readSession(tok) {
  if (!tok) return null;
  const s = sessions.get(sha(tok));
  if (!s) return null;
  if (s.exp < now()) { sessions.del(sha(tok)); return null; }
  return s;
}
function killSession(tok) { if (tok) sessions.del(sha(tok)); }
function killSessions(uid) {
  const all = sessions.all();
  let hit = false;
  for (const k in all) if (all[k].uid === uid) { delete all[k]; hit = true; }
  if (hit) sessions.flush();
}

/* ---- single-use, time-limited, hashed at rest ----
   The token in the email is never stored; only its hash is, so a stolen data directory
   does not hand over live reset links. */
function newToken(uid, kind) {
  tokens.sweep(now());
  const t = rand(24);
  tokens.set(sha(t), { uid, kind, exp: now() + TOKEN_MINUTES * 60000 });
  return t;
}
function takeToken(t, kind) {
  if (!t) return null;
  const k = sha(t), rec = tokens.get(k);
  if (!rec || rec.kind !== kind || rec.exp < now()) return null;
  tokens.del(k);
  return rec;
}

/* ---- rate limiting ----
   In memory, so it resets when the server does. That is the right trade for a server
   this size: it costs nothing, and the thing it stops is an online guessing run. */
const buckets = new Map();
function rateLimit(key, max, windowMs) {
  const t = now(), b = buckets.get(key);
  if (!b || b.until < t) { buckets.set(key, { n: 1, until: t + windowMs }); return true; }
  if (b.n >= max) return false;
  b.n++;
  return true;
}
function rateClear(key) { buckets.delete(key); }
/* Keep the map from growing without bound on a long-lived process. */
setInterval(() => { const t = now(); for (const [k, b] of buckets) if (b.until < t) buckets.delete(k); }, 60000).unref();

function deleteUser(rec) {
  killSessions(rec.id);
  for (const id of docs.list(rec.id)) docs.del(rec.id, id);
  /* Lazy so this file and social.js can load in either order. Purge is by uid. */
  require('./social').purge(rec.id);
  users.del(rec.key);
}

module.exports = {
  users, sessions, tokens, hashPass, checkPass, validateName, validatePass, validateEmail,
  findByName, findByEmail, createUser, setPass, byId, deleteUser,
  newSession, readSession, killSession, killSessions, newToken, takeToken,
  rateLimit, rateClear, rand, sha, TOKEN_MINUTES, SESSION_DAYS
};
