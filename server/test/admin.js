/* Admin token, ban, and character reset. `node server/test/admin.js` */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'u2087-admin-'));
process.env.DATA_DIR = tmp;
process.env.ADMIN_TOKEN = 'test-admin-token-value';
delete process.env.SMTP_HOST;
delete process.env.INVITE_REQUIRED;

const { server } = require('../server');
const auth = require('../lib/auth');
const { docs } = require('../lib/store');

let pass = 0, fail = 0; const out = [];
const ok = (n, c, d) => { if (c) { pass++; out.push('  ok   ' + n); } else { fail++; out.push('  FAIL ' + n + (d ? '  <' + d + '>' : '')); } };
const wait = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  await new Promise(r => server.listen(0, r));
  const base = 'http://127.0.0.1:' + server.address().port;
  async function admin(p, body, token) {
    const r = await fetch(base + '/api/admin/' + p, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (token == null ? process.env.ADMIN_TOKEN : token) },
      body: JSON.stringify(body || {})
    });
    let j = {}; try { j = await r.json(); } catch (e) {}
    return { status: r.status, body: j };
  }

  let r = await admin('online', {}, 'nope');
  ok('a wrong token is refused', r.status === 401, JSON.stringify(r.body));

  const u = auth.createUser('Gramps', 'admin-tester-11');
  docs.set(u.id, 'main', { s: JSON.stringify({ G: { lvl: 12, sats: 40, cls: 'scrapper', bag: [], eq: {} } }), t: 1, lv: 12 });
  docs.set(u.id, 'z3', { s: '{}' });
  docs.set(u.id, 'acct', { s: '{"sats":7}' });
  const cookie = 'u2087=' + encodeURIComponent(auth.newSession(u.id));
  const s = new WebSocket(base.replace('http', 'ws') + '/live', { headers: { Cookie: cookie } });
  await new Promise((res, rej) => { s.onmessage = e => { if (JSON.parse(e.data).t === 'you') res(); }; s.onerror = () => rej(new Error('socket')); setTimeout(() => rej(new Error('timed out')), 4000); });

  r = await admin('online', {});
  ok('online lists the connected account', r.status === 200 && r.body.players.some(p => p.name === 'Gramps'), JSON.stringify(r.body));

  r = await admin('broadcast', { text: 'Server restarting in one minute.' });
  ok('a notice is accepted', r.status === 200 && r.body.n === 1, JSON.stringify(r.body));

  r = await admin('reset', { name: 'Gramps', slot: '0' });
  ok('reset removes the character documents', r.status === 200 && r.body.deleted.indexOf('main') !== -1 && r.body.deleted.indexOf('z3') !== -1, JSON.stringify(r.body));
  ok('the lockbox is not part of a character reset', docs.get(u.id, 'acct') && !docs.get(u.id, 'main'), JSON.stringify(docs.list(u.id)));
  await wait(500);
  const late = await fetch(base + '/api/doc/set', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie, 'X-CSRF': auth.readSession(decodeURIComponent(cookie.split('=')[1])).csrf },
    body: JSON.stringify({ id: 'main', data: { s: JSON.stringify({ G: { lvl: 12, sats: 40, cls: 'scrapper', bag: [], eq: {} } }), t: Date.now() } })
  });
  ok('a save right after a reset is refused', late.status === 409, String(late.status));

  r = await admin('ban', { name: 'Gramps', reason: 'testing' });
  ok('ban records the account', r.status === 200 && r.body.name === 'Gramps', JSON.stringify(r.body));
  const login = await fetch(base + '/api/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Gramps', pass: 'admin-tester-11' })
  });
  ok('a banned account cannot log in', login.status === 403, String(login.status));
  r = await admin('unban', { name: 'Gramps' });
  ok('unban clears it', r.status === 200, JSON.stringify(r.body));
  const login2 = await fetch(base + '/api/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Gramps', pass: 'admin-tester-11' })
  });
  ok('the account can log in again', login2.status === 200, String(login2.status));

  try { s.close(); } catch (e) {}
  console.log(out.join('\n'));
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  server.close();
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
