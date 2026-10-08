/* A dropped socket keeps the game for a moment, then lets go.
   `node server/test/reconnect.js` */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'u2087-resume-'));
process.env.DATA_DIR = tmp;
process.env.RESUME_GRACE_MS = '700';
process.env.PUBLIC_ORIGIN = 'http://play.test';
delete process.env.SMTP_HOST;
delete process.env.WS_REQUIRE_ORIGIN;

const { server, live } = require('../server');
const auth = require('../lib/auth');
const { originOK } = require('../lib/origin');

let pass = 0, fail = 0; const out = [];
const ok = (n, c, d) => { if (c) { pass++; out.push('  ok   ' + n); } else { fail++; out.push('  FAIL ' + n + (d ? '  <' + d + '>' : '')); } };
const wait = ms => new Promise(r => setTimeout(r, ms));

ok('a browser on the public origin is accepted', originOK({ headers: { origin: 'http://play.test' } }));
ok('a browser on another site is refused', !originOK({ headers: { origin: 'https://evil.test' } }));
ok('a local test page is accepted', originOK({ headers: { origin: 'http://127.0.0.1:9' } }));
ok('a missing origin is allowed until the box requires one', originOK({ headers: {} }));
process.env.WS_REQUIRE_ORIGIN = '1';
ok('a missing origin is refused when the box requires one', !originOK({ headers: {} }));
delete process.env.WS_REQUIRE_ORIGIN;

(async () => {
  await new Promise(r => server.listen(0, r));
  const base = 'http://127.0.0.1:' + server.address().port;

  function reg(n) {
    const u = auth.createUser(n, 'resume-tester-11');
    return 'u2087=' + encodeURIComponent(auth.newSession(u.id));
  }
  function client(cookie, origin) {
    const headers = { Cookie: cookie };
    if (origin) headers.Origin = origin;
    return new Promise((res, rej) => {
      const s = new WebSocket(base.replace('http', 'ws') + '/live', { headers });
      const c = { s, seen: [], last: {}, send: o => s.send(JSON.stringify(o)) };
      s.onmessage = e => { const m = JSON.parse(e.data); c.seen.push(m); c.last[m.t] = m; if (m.t === 'you') res(c); };
      s.onerror = () => rej(new Error('socket'));
      setTimeout(() => rej(new Error('timed out')), 4000);
    });
  }

  const cookie = reg('Nia');
  const a = await client(cookie);
  ok('the connect frame carries a build id', !!a.last.you.build, JSON.stringify(a.last.you));
  a.send({ t: 'hello', resume: 1, lvl: 4, zi: 1, hp: 100, hpm: 100, cls: 'scrapper' });
  a.send({ t: 'game.create', name: 'Held', diff: 'normal' });
  await wait(100);
  const gid = a.last.game && a.last.game.game && a.last.game.game.id;
  ok('the game exists', !!gid);
  a.s.close();
  await wait(150);
  const held = [...live.live.values()][0];
  ok('the game is held after the socket drops', live.games.has(gid) && !!held && !held.conn, 'games=' + live.games.size + ' live=' + live.live.size);

  const b = await client(cookie);
  await wait(120);
  const back = b.seen.find(m => m.t === 'game' && m.game && m.game.id === gid);
  ok('the same account is put back in the game', !!(back && (back.resumed || b.last.you.resumed)), JSON.stringify(back && back.game));
  ok('there is still one game', live.games.size === 1, String(live.games.size));

  b.s.close();
  await wait(1000);
  ok('the hold ends and the empty game is gone', live.games.size === 0, String(live.games.size));

  process.env.WS_REQUIRE_ORIGIN = '1';
  process.env.PUBLIC_ORIGIN = base;
  let refused = false;
  try {
    await client(reg('Eve'));
  } catch (e) { refused = true; }
  ok('a socket with no origin is refused when required', refused);
  const okOrigin = await client(reg('Ada'), base);
  ok('a socket with the public origin is accepted', !!okOrigin.last.you);
  delete process.env.WS_REQUIRE_ORIGIN;

  console.log(out.join('\n'));
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  server.close();
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
