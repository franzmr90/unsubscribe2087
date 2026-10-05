/* Unsubscribe 2087 — account server.
   Node standard library only: no package.json, no install, no build. `node server/server.js`.

   It does two jobs. It keeps accounts (register, log in, change password, recover a
   forgotten one by email, email yourself a backup), and it serves the game with a shim
   that makes the game's existing account-save path talk to this server instead of to the
   Artifact host. The game's own source is not modified for any of this. */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const A = require('./lib/auth');
const { docs } = require('./lib/store');
const mail = require('./lib/mail');

const PORT = +(process.env.PORT || 8087);
const ROOT = path.join(__dirname, '..');
const ORIGIN = process.env.PUBLIC_ORIGIN || ('http://localhost:' + PORT);
const SECURE = /^https:/.test(ORIGIN);
const MAX_BODY = 4 * 1024 * 1024;      /* a zone document with its maps is the big one */
const MAX_DOCS_BYTES = 40 * 1024 * 1024;

/* ---------- small http helpers ---------- */
function send(res, code, body, headers) {
  const h = Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'X-Content-Type-Options': 'nosniff' }, headers || {});
  const b = typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body);
  res.writeHead(code, h);
  res.end(b);
}
const ok = (res, o) => send(res, 200, o || { ok: true });
const bad = (res, code, msg) => send(res, code, { error: msg });

function readBody(req) {
  return new Promise((resolve, reject) => {
    let n = 0; const chunks = [];
    req.on('data', c => {
      n += c.length;
      if (n > MAX_BODY) { reject(new Error('too large')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      if (!chunks.length) return resolve({});
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
      catch (e) { reject(new Error('bad json')); }
    });
    req.on('error', reject);
  });
}

function cookies(req) {
  const out = {};
  for (const p of (req.headers.cookie || '').split(';')) {
    const i = p.indexOf('=');
    if (i > 0) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim());
  }
  return out;
}

function setCookie(res, name, value, maxAge) {
  const bits = [name + '=' + encodeURIComponent(value), 'Path=/', 'HttpOnly', 'SameSite=Lax'];
  if (SECURE) bits.push('Secure');
  bits.push('Max-Age=' + (maxAge === 0 ? 0 : maxAge));
  const prev = res.getHeader('Set-Cookie') || [];
  res.setHeader('Set-Cookie', (Array.isArray(prev) ? prev : [prev]).concat(bits.join('; ')));
}

const ipOf = req => (process.env.TRUST_PROXY === '1' && (req.headers['x-forwarded-for'] || '').split(',')[0].trim())
  || req.socket.remoteAddress || '?';

/* ---------- the session behind a request ---------- */
function auth(req) {
  const c = cookies(req);
  const s = A.readSession(c.u2087);
  if (!s) return null;
  const user = A.byId(s.uid);
  if (!user) return null;
  return { sess: s, user, token: c.u2087 };
}

/* A state-changing request must carry the session's CSRF token in a header. The cookie
   is SameSite=Lax, so this is the second lock rather than the only one. */
function csrfOK(req, ctx) {
  const got = req.headers['x-csrf'] || '';
  return !!ctx && got.length > 8 && got === ctx.sess.csrf;
}

function openSession(res, user) {
  const tok = A.newSession(user.id);
  setCookie(res, 'u2087', tok, A.SESSION_DAYS * 86400);
  return A.readSession(tok);
}

const pub = u => ({ name: u.name, id: u.id, email: u.email || '', verified: !!u.verified });

/* ---------- routes ---------- */
const routes = {};
const route = (method, p, fn) => { routes[method + ' ' + p] = fn; };

route('POST', '/api/register', async (req, res) => {
  if (!A.rateLimit('reg:' + ipOf(req), 5, 3600e3)) return bad(res, 429, 'Too many accounts from here. Try again later.');
  const b = await readBody(req);
  const e1 = A.validateName(b.name) || A.validatePass(b.pass) || A.validateEmail(b.email);
  if (e1) return bad(res, 400, e1);
  if (A.findByName(b.name)) return bad(res, 409, 'That name is taken.');
  if (b.email && A.findByEmail(b.email)) return bad(res, 409, 'That email already has an account.');
  const u = A.createUser(b.name, b.pass, b.email);
  if (!u) return bad(res, 409, 'That name is taken.');
  const s = openSession(res, u);
  if (u.email) {
    const t = A.newToken(u.id, 'verify');
    const link = ORIGIN + '/verify?t=' + t;
    await mail.send({
      to: u.email, subject: 'Confirm your Unsubscribe 2087 account', link,
      text: 'Someone made an account called "' + u.name + '" with this address.\n\nConfirm it here:\n' + link +
        '\n\nThe link works once and expires in ' + A.TOKEN_MINUTES + ' minutes. If this was not you, ignore this message and nothing happens.'
    });
  }
  ok(res, { user: pub(u), csrf: s.csrf });
});

route('POST', '/api/login', async (req, res) => {
  const b = await readBody(req);
  const name = typeof b.name === 'string' ? b.name : '';
  /* Limited per address and per account name, so one does not shield the other. */
  if (!A.rateLimit('li:' + ipOf(req), 20, 900e3)) return bad(res, 429, 'Too many attempts. Wait fifteen minutes.');
  if (!A.rateLimit('lu:' + name.toLowerCase(), 10, 900e3)) return bad(res, 429, 'Too many attempts on that account. Wait fifteen minutes.');
  const u = A.findByName(name);
  /* Hash even when the account does not exist, so a miss and a wrong password take the
     same time and the response cannot be used to enumerate names. */
  const good = u ? A.checkPass(b.pass, u) : A.checkPass(b.pass || '', { pass: A.hashPass('x') }) && false;
  if (!u || !good) return bad(res, 401, 'No account by that name, or the wrong password.');
  u.seen = Date.now(); A.users.flush();
  A.rateClear('lu:' + name.toLowerCase());
  const s = openSession(res, u);
  ok(res, { user: pub(u), csrf: s.csrf });
});

route('POST', '/api/logout', async (req, res) => {
  const ctx = auth(req);
  if (ctx) A.killSession(ctx.token);
  setCookie(res, 'u2087', '', 0);
  ok(res);
});

route('GET', '/api/me', async (req, res) => {
  const ctx = auth(req);
  if (!ctx) return send(res, 200, { user: null });
  ok(res, { user: pub(ctx.user), csrf: ctx.sess.csrf, bytes: docs.bytes(ctx.user.id), mail: mail.enabled() });
});

route('POST', '/api/password', async (req, res) => {
  const ctx = auth(req);
  if (!ctx) return bad(res, 401, 'Not signed in.');
  if (!csrfOK(req, ctx)) return bad(res, 403, 'Stale page. Reload and try again.');
  const b = await readBody(req);
  if (!A.checkPass(b.old, ctx.user)) return bad(res, 401, 'That is not your current password.');
  const e1 = A.validatePass(b.pass);
  if (e1) return bad(res, 400, e1);
  A.setPass(ctx.user, b.pass);
  const s = openSession(res, ctx.user);   /* setPass killed every session, including this one */
  if (ctx.user.email) await mail.send({
    to: ctx.user.email, subject: 'Your Unsubscribe 2087 password changed',
    text: 'The password on "' + ctx.user.name + '" was changed just now, and every signed-in device was signed out.\n\nIf that was not you, recover the account from the title screen immediately.'
  });
  ok(res, { csrf: s.csrf });
});

route('POST', '/api/email', async (req, res) => {
  const ctx = auth(req);
  if (!ctx) return bad(res, 401, 'Not signed in.');
  if (!csrfOK(req, ctx)) return bad(res, 403, 'Stale page. Reload and try again.');
  const b = await readBody(req);
  const e1 = A.validateEmail(b.email);
  if (e1) return bad(res, 400, e1);
  if (!A.checkPass(b.pass, ctx.user)) return bad(res, 401, 'Confirm your password to change the address.');
  const other = A.findByEmail(b.email);
  if (other && other.id !== ctx.user.id) return bad(res, 409, 'That email already has an account.');
  ctx.user.email = (b.email || '').trim();
  ctx.user.emailLc = ctx.user.email.toLowerCase();
  ctx.user.verified = false;
  A.users.flush();
  if (ctx.user.email) {
    const t = A.newToken(ctx.user.id, 'verify');
    const link = ORIGIN + '/verify?t=' + t;
    await mail.send({ to: ctx.user.email, subject: 'Confirm your Unsubscribe 2087 address', link, text: 'Confirm this address for "' + ctx.user.name + '":\n' + link + '\n\nExpires in ' + A.TOKEN_MINUTES + ' minutes.' });
  }
  ok(res, { user: pub(ctx.user) });
});

route('POST', '/api/forgot', async (req, res) => {
  const b = await readBody(req);
  /* Always the same answer, whether or not the address is known: a recovery form that
     tells you which addresses have accounts is a user directory. */
  const generic = { ok: true, sent: true };
  if (!A.rateLimit('fg:' + ipOf(req), 5, 3600e3)) return bad(res, 429, 'Too many recovery attempts. Try again later.');
  if (A.validateEmail(b.email) || !b.email) return send(res, 200, generic);
  const u = A.findByEmail(b.email);
  if (u) {
    const t = A.newToken(u.id, 'reset');
    const link = ORIGIN + '/reset?t=' + t;
    await mail.send({
      to: u.email, subject: 'Reset your Unsubscribe 2087 password', link,
      text: 'Someone asked to reset the password on "' + u.name + '".\n\n' + link +
        '\n\nThe link works once and expires in ' + A.TOKEN_MINUTES + ' minutes. If it was not you, ignore this: nothing has changed and the link stays unused.'
    });
  }
  send(res, 200, generic);
});

route('POST', '/api/reset', async (req, res) => {
  const b = await readBody(req);
  if (!A.rateLimit('rs:' + ipOf(req), 10, 3600e3)) return bad(res, 429, 'Too many attempts. Try again later.');
  const e1 = A.validatePass(b.pass);
  if (e1) return bad(res, 400, e1);
  const rec = A.takeToken(b.token, 'reset');
  if (!rec) return bad(res, 400, 'That link has expired or has already been used. Ask for a new one.');
  const u = A.byId(rec.uid);
  if (!u) return bad(res, 400, 'That account is gone.');
  A.setPass(u, b.pass);
  const s = openSession(res, u);
  ok(res, { user: pub(u), csrf: s.csrf });
});

route('POST', '/api/verify', async (req, res) => {
  const b = await readBody(req);
  const rec = A.takeToken(b.token, 'verify');
  if (!rec) return bad(res, 400, 'That link has expired or has already been used.');
  const u = A.byId(rec.uid);
  if (!u) return bad(res, 400, 'That account is gone.');
  u.verified = true; A.users.flush();
  ok(res, { user: pub(u) });
});

/* Email backup: the whole account, as the JSON the game itself writes. */
route('POST', '/api/backup', async (req, res) => {
  const ctx = auth(req);
  if (!ctx) return bad(res, 401, 'Not signed in.');
  if (!csrfOK(req, ctx)) return bad(res, 403, 'Stale page. Reload and try again.');
  if (!ctx.user.email) return bad(res, 400, 'Add an email address first.');
  if (!A.rateLimit('bk:' + ctx.user.id, 3, 3600e3)) return bad(res, 429, 'Three backups an hour is plenty.');
  const dump = JSON.stringify({ v: 1, user: ctx.user.name, at: new Date().toISOString(), docs: docs.dump(ctx.user.id) });
  await mail.send({
    to: ctx.user.email, subject: 'Your Unsubscribe 2087 characters',
    text: 'Attached is everything this server holds for "' + ctx.user.name + '": every character, every district you have walked, and the lockbox.\n\n' +
      'It is the same JSON the game writes, so it can be restored by uploading it on the title screen. Keep it somewhere you will find it again.',
    attach: { name: 'unsubscribe-2087-backup.json', body: dump }
  });
  ok(res, { bytes: dump.length, to: ctx.user.email });
});

route('POST', '/api/restore', async (req, res) => {
  const ctx = auth(req);
  if (!ctx) return bad(res, 401, 'Not signed in.');
  if (!csrfOK(req, ctx)) return bad(res, 403, 'Stale page. Reload and try again.');
  const b = await readBody(req);
  if (!b || !b.docs || typeof b.docs !== 'object') return bad(res, 400, 'That is not a backup file.');
  let n = 0;
  for (const id in b.docs) if (docs.set(ctx.user.id, id, b.docs[id])) n++;
  ok(res, { restored: n });
});

route('POST', '/api/delete', async (req, res) => {
  const ctx = auth(req);
  if (!ctx) return bad(res, 401, 'Not signed in.');
  if (!csrfOK(req, ctx)) return bad(res, 403, 'Stale page. Reload and try again.');
  const b = await readBody(req);
  if (!A.checkPass(b.pass, ctx.user)) return bad(res, 401, 'Confirm your password.');
  A.deleteUser(ctx.user);
  setCookie(res, 'u2087', '', 0);
  ok(res);
});

/* ---------- the document store the game talks to ----------
   Shaped to match the doc interface the game already uses: get, set, delete, scoped to
   one account. The collection path the client passes is ignored for addressing — the
   account comes from the session — so a client cannot read another account by asking. */
route('POST', '/api/doc/get', async (req, res) => {
  const ctx = auth(req);
  if (!ctx) return bad(res, 401, 'Not signed in.');
  const b = await readBody(req);
  const d = docs.get(ctx.user.id, String(b.id || ''));
  ok(res, { exists: d !== null, data: d });
});

route('POST', '/api/doc/set', async (req, res) => {
  const ctx = auth(req);
  if (!ctx) return bad(res, 401, 'Not signed in.');
  if (!csrfOK(req, ctx)) return bad(res, 403, 'Stale page. Reload and try again.');
  const b = await readBody(req);
  if (docs.bytes(ctx.user.id) > MAX_DOCS_BYTES) return bad(res, 413, 'This account is full.');
  if (!docs.set(ctx.user.id, String(b.id || ''), b.data)) return bad(res, 400, 'Bad document id.');
  ok(res);
});

route('POST', '/api/doc/del', async (req, res) => {
  const ctx = auth(req);
  if (!ctx) return bad(res, 401, 'Not signed in.');
  if (!csrfOK(req, ctx)) return bad(res, 403, 'Stale page. Reload and try again.');
  const b = await readBody(req);
  docs.del(ctx.user.id, String(b.id || ''));
  ok(res);
});

/* ---------- serving the game ---------- */
const TYPES = { '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.json': 'application/json; charset=utf-8', '.ico': 'image/x-icon' };

/* The page is assembled per request from the current build, so a rebuild shows up on
   reload without a restart and without build.sh having to know this server exists. */
function gamePage() {
  const frag = fs.readFileSync(path.join(ROOT, 'dist', 'unsubscribe.html'), 'utf8');
  const nl = frag.indexOf('\n');
  const title = frag.slice(0, nl);          /* the fragment's first line is a bare <title> */
  const rest = frag.slice(nl + 1);
  return '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">' +
    '<meta name="theme-color" content="#0b0a12">' + title +
    '</head><body>\n<script src="/cloud-shim.js"></script>\n' + rest + '\n</body></html>';
}

function serveStatic(req, res, url) {
  const file = path.join(__dirname, 'public', url.replace(/^\/+/, ''));
  if (!file.startsWith(path.join(__dirname, 'public'))) return bad(res, 403, 'no');
  fs.readFile(file, (err, buf) => {
    if (err) return bad(res, 404, 'Not found.');
    send(res, 200, buf, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const p = url.pathname;
  try {
    const fn = routes[req.method + ' ' + p];
    if (fn) return await fn(req, res);
    if (req.method === 'GET' && (p === '/' || p === '/index.html')) {
      return send(res, 200, gamePage(), { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    }
    /* The mailed links land here; the shim picks the token out of the query. */
    if (req.method === 'GET' && (p === '/reset' || p === '/verify')) {
      return send(res, 200, gamePage(), { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    }
    if (req.method === 'GET') return serveStatic(req, res, p);
    bad(res, 404, 'Not found.');
  } catch (e) {
    if (/too large|bad json/.test(e.message)) return bad(res, 400, e.message);
    console.error('[err]', p, e.message);
    bad(res, 500, 'Something broke on the server.');
  }
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log('Unsubscribe 2087 server on ' + ORIGIN);
    if (!mail.enabled()) console.log('No SMTP configured: mail goes to server/data/outbox and the console.');
  });
}

module.exports = { server, gamePage };
