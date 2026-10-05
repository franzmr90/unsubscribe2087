/* The ceiling: a full world must refuse clearly rather than quietly getting slower.
   `node server/test/capacity.js` — no browser needed. */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'u2087-cap-'));
process.env.DATA_DIR = tmp;
process.env.MAX_PLAYERS = '2';
const { server } = require('../server');

let pass = 0, fail = 0; const out = [];
const ok = (n, c, d) => { if (c) { pass++; out.push('  ok   ' + n); } else { fail++; out.push('  FAIL ' + n + (d ? '  <' + d + '>' : '')); } };

(async () => {
  await new Promise(r => server.listen(0, r));
  const base = 'http://127.0.0.1:' + server.address().port;

  async function reg(n) {
    const r = await fetch(base + '/api/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: n, pass: 'capacity-test-1' })
    });
    const c = (r.headers.getSetCookie ? r.headers.getSetCookie() : []).find(x => /^u2087=/.test(x));
    return c.split(';')[0];
  }

  function open(cookie) {
    return new Promise((res, rej) => {
      const s = new WebSocket(base.replace('http', 'ws') + '/live', { headers: { Cookie: cookie } });
      s.onmessage = e => {
        const m = JSON.parse(e.data);
        if (m.t === 'you') res({ s, ok: true });
        if (m.t === 'full') res({ s, ok: false, text: m.text });
      };
      s.onerror = () => rej(new Error('socket error'));
      setTimeout(() => rej(new Error('timed out')), 5000);
    });
  }

  const a = await reg('One'), b = await reg('Two'), c = await reg('Three');
  const r1 = await open(a), r2 = await open(b);
  ok('players join up to the ceiling', r1.ok && r2.ok);

  const r3 = await open(c);
  ok('one over the ceiling is refused', !r3.ok);
  ok('the refusal says what happened and what to do', /full/.test(r3.text || '') && /again/.test(r3.text || ''), r3.text);

  /* Leaving must make room, or the ceiling becomes permanent. */
  r1.s.close();
  await new Promise(r => setTimeout(r, 400));
  const r4 = await open(c);
  ok('a player leaving makes room', r4.ok);

  /* An unauthenticated socket never gets as far as the ceiling. */
  const anon = await new Promise(res => {
    const s = new WebSocket(base.replace('http', 'ws') + '/live');
    s.onopen = () => res(true);
    s.onerror = () => res(false);
    setTimeout(() => res(false), 3000);
  });
  ok('a socket with no account is refused at the handshake', !anon);

  console.log(out.join('\n'));
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  server.close();
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
