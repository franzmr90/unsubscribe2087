/* Offline tests: `node server/test/run.js`. No network, no SMTP, no browser.
   Runs against a throwaway data directory so it never touches a real one. */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'u2087-test-'));
process.env.DATA_DIR = tmp;
process.env.PORT = '0';
delete process.env.SMTP_HOST;

const { server } = require('../server');
const mailDir = path.join(tmp, 'outbox');

let pass = 0, fail = 0;
const results = [];
function ok(name, cond, detail) {
  if (cond) { pass++; results.push('  ok   ' + name); }
  else { fail++; results.push('  FAIL ' + name + (detail ? '  <' + detail + '>' : '')); }
}

let base = '', cookie = '', csrf = '';
async function call(p, body, opt) {
  opt = opt || {};
  const headers = { 'Content-Type': 'application/json' };
  if (cookie && !opt.noCookie) headers.Cookie = cookie;
  if (csrf && !opt.noCsrf) headers['X-CSRF'] = opt.csrf !== undefined ? opt.csrf : csrf;
  const r = await fetch(base + p, {
    method: opt.method || (body === undefined ? 'GET' : 'POST'),
    headers, body: body === undefined ? undefined : JSON.stringify(body)
  });
  const set = r.headers.getSetCookie ? r.headers.getSetCookie() : [];
  for (const c of set) if (/^u2087=/.test(c)) cookie = c.split(';')[0];
  let j = null; try { j = await r.json(); } catch (e) {}
  return { status: r.status, body: j || {} };
}

/* The mailed link never leaves the server in a response, so the tests read it back out
   of the outbox exactly as a person would read it out of their inbox. */
function lastLink() {
  const files = fs.readdirSync(mailDir).sort();
  const txt = fs.readFileSync(path.join(mailDir, files[files.length - 1]), 'utf8');
  const m = txt.match(/https?:\/\/\S+\?t=(\S+)/);
  return m ? m[1] : null;
}

(async () => {
  await new Promise(r => server.listen(0, r));
  base = 'http://127.0.0.1:' + server.address().port;

  /* ---- registration ---- */
  let r = await call('/api/register', { name: 'ab', pass: 'short' });
  ok('short password refused', r.status === 400, r.body.error);

  r = await call('/api/register', { name: '!!', pass: 'longenough1' });
  ok('bad name refused', r.status === 400, r.body.error);

  r = await call('/api/register', { name: 'Gramps', pass: 'stillwater87', email: 'gramps@example.com' });
  ok('register works', r.status === 200 && r.body.user.name === 'Gramps', JSON.stringify(r.body));
  csrf = r.body.csrf;
  ok('register signs you in', !!cookie);
  ok('verification mail sent', fs.existsSync(mailDir) && fs.readdirSync(mailDir).length === 1);

  r = await call('/api/register', { name: 'gramps', pass: 'another-one-1' }, { noCookie: true });
  ok('name taken, case-insensitively', r.status === 409, r.body.error);

  /* ---- the shape the game talks to ---- */
  r = await call('/api/doc/set', { id: 'hero0', data: { s: '{"lvl":4}', lv: 4 } });
  ok('doc set', r.status === 200, r.body.error);
  r = await call('/api/doc/get', { id: 'hero0' });
  ok('doc round-trips', r.body.exists && r.body.data.lv === 4, JSON.stringify(r.body));
  r = await call('/api/doc/get', { id: 'nope' });
  ok('missing doc reports not exists', r.body.exists === false);
  r = await call('/api/doc/set', { id: '../../users', data: { x: 1 } });
  ok('path traversal in doc id refused', r.status === 400, JSON.stringify(r.body));
  r = await call('/api/doc/set', { id: 'hero0', data: { x: 1 } }, { csrf: 'wrong' });
  ok('write without the csrf token refused', r.status === 403, JSON.stringify(r.body));
  r = await call('/api/doc/del', { id: 'hero0' });
  r = await call('/api/doc/get', { id: 'hero0' });
  ok('doc delete', r.body.exists === false);

  /* ---- email backup ---- */
  await call('/api/doc/set', { id: 'hero1', data: { s: '{"lvl":9}' } });
  const before = fs.readdirSync(mailDir).length;
  r = await call('/api/backup', {});
  ok('backup mailed', r.status === 200 && fs.readdirSync(mailDir).length === before + 1, JSON.stringify(r.body));

  r = await call('/api/restore', { docs: { hero2: { s: '{"lvl":11}' } } });
  ok('restore writes documents', r.body.restored === 1, JSON.stringify(r.body));
  r = await call('/api/doc/get', { id: 'hero2' });
  ok('restored document readable', r.body.exists === true);

  /* ---- isolation between accounts ---- */
  const grampsCookie = cookie, grampsCsrf = csrf;
  cookie = ''; csrf = '';
  r = await call('/api/register', { name: 'Vale', pass: 'persuasion2026' });
  csrf = r.body.csrf;
  r = await call('/api/doc/get', { id: 'hero1' });
  ok('another account cannot read your documents', r.body.exists === false, JSON.stringify(r.body));

  /* ---- sessions and csrf ---- */
  cookie = ''; csrf = '';
  r = await call('/api/doc/get', { id: 'hero1' });
  ok('signed out, no document access', r.status === 401);

  r = await call('/api/login', { name: 'Gramps', pass: 'wrong-password' });
  ok('wrong password rejected', r.status === 401);
  r = await call('/api/login', { name: 'Gramps', pass: 'stillwater87' });
  ok('login works', r.status === 200 && r.body.user.name === 'Gramps');
  csrf = r.body.csrf;
  r = await call('/api/me');
  ok('me reports the account', r.body.user && r.body.user.name === 'Gramps');

  /* ---- password change ---- */
  r = await call('/api/password', { old: 'nope', pass: 'newpassword123' });
  ok('password change needs the old one', r.status === 401);
  const staleCookie = cookie;
  r = await call('/api/password', { old: 'stillwater87', pass: 'newpassword123' });
  ok('password change works', r.status === 200, r.body.error);
  csrf = r.body.csrf;

  const keep = cookie; cookie = staleCookie;
  r = await call('/api/me');
  ok('changing the password signs other devices out', !r.body.user, JSON.stringify(r.body));
  cookie = keep;

  r = await call('/api/me');
  ok('the device that changed it stays in', !!(r.body.user), JSON.stringify(r.body));

  /* ---- recovery by email ---- */
  cookie = ''; csrf = '';
  r = await call('/api/forgot', { email: 'nobody@example.com' });
  ok('unknown address gets the same answer', r.status === 200 && r.body.sent === true);
  r = await call('/api/forgot', { email: 'gramps@example.com' });
  ok('forgot accepted', r.status === 200);
  const token = lastLink();
  ok('reset link reached the outbox', !!token);

  r = await call('/api/reset', { token: 'not-a-token', pass: 'recovered-pass-1' });
  ok('bogus reset token refused', r.status === 400);
  r = await call('/api/reset', { token, pass: 'recovered-pass-1' });
  ok('reset works and signs you in', r.status === 200 && r.body.user.name === 'Gramps', r.body.error);
  csrf = r.body.csrf;
  r = await call('/api/reset', { token, pass: 'again-pass-1' }, { noCookie: true });
  ok('reset token is single use', r.status === 400);

  cookie = ''; csrf = '';
  r = await call('/api/login', { name: 'Gramps', pass: 'recovered-pass-1' });
  ok('the recovered password works', r.status === 200);
  csrf = r.body.csrf;
  r = await call('/api/doc/get', { id: 'hero1' });
  ok('characters survived the recovery', r.body.exists === true);

  /* ---- deleting ---- */
  r = await call('/api/delete', { pass: 'wrong' });
  ok('delete needs the password', r.status === 401);
  r = await call('/api/delete', { pass: 'recovered-pass-1' });
  ok('delete works', r.status === 200, r.body.error);
  cookie = ''; csrf = '';
  r = await call('/api/login', { name: 'Gramps', pass: 'recovered-pass-1' });
  ok('the deleted account is gone', r.status === 401);

  /* ---- the page the game is served on ---- */
  const page = await fetch(base + '/');
  const html = await page.text();
  ok('game page serves', page.status === 200 && html.indexOf('cloud-shim.js') > 0 && html.indexOf('<canvas') > 0);
  const shim = await fetch(base + '/cloud-shim.js');
  ok('shim serves as javascript', shim.status === 200 && /javascript/.test(shim.headers.get('content-type')));
  const nope = await fetch(base + '/../server.js');
  ok('static path traversal refused', nope.status === 404 || nope.status === 403, String(nope.status));

  /* ---- rate limiting ---- */
  cookie = ''; csrf = '';
  let limited = false;
  for (let i = 0; i < 14; i++) {
    const rr = await call('/api/login', { name: 'Vale', pass: 'bad' + i });
    if (rr.status === 429) { limited = true; break; }
  }
  ok('repeated guesses get rate limited', limited);

  console.log(results.join('\n'));
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  server.close();
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
