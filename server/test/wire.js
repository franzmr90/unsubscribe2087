/* sk, au and sw ride on move and come back on the zone snapshot.
   The snapshot stays a handful of numbers. It is not a list of points, and it is not a hit.
   `node server/test/wire.js` */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'u2087-wire-'));
process.env.DATA_DIR = tmp;
const { server, live } = require('../server');
const auth = require('../lib/auth');

let pass = 0, fail = 0; const out = [];
const ok = (n, c, d) => { if (c) { pass++; out.push('  ok   ' + n); } else { fail++; out.push('  FAIL ' + n + (d ? '  <' + d + '>' : '')); } };
const wait = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  await new Promise(r => server.listen(0, r));
  const base = 'http://127.0.0.1:' + server.address().port;

  function reg(n) {
    const u = auth.createUser(n, 'wire-tester-11');
    return 'u2087=' + encodeURIComponent(auth.newSession(u.id));
  }
  function client(cookie) {
    return new Promise((res, rej) => {
      const s = new WebSocket(base.replace('http', 'ws') + '/live', { headers: { Cookie: cookie } });
      const c = {
        s, seen: [], last: {},
        send: o => s.send(JSON.stringify(o)),
        wait: (t, ms) => new Promise(r => {
          const end = Date.now() + (ms || 3000);
          (function look() {
            if (c.last[t]) return r(c.last[t]);
            if (Date.now() > end) return r(null);
            setTimeout(look, 30);
          })();
        }),
        forget: t => { delete c.last[t]; }
      };
      s.onmessage = e => { const m = JSON.parse(e.data); c.seen.push(m); c.last[m.t] = m; if (m.t === 'you') res(c); };
      s.onerror = () => rej(new Error('socket'));
      setTimeout(() => rej(new Error('timed out')), 5000);
    });
  }

  const A = await client(reg('Ines'));
  const B = await client(reg('Vale'));
  ok('pvp scale is unchanged', A.last.you && A.last.you.pvpScale === 0.25, JSON.stringify(A.last.you && A.last.you.pvpScale));

  A.send({ t: 'hello', lvl: 8, cls: 'scrapper', zi: 1, hp: 40, hpm: 40 });
  B.send({ t: 'hello', lvl: 8, cls: 'scrapper', zi: 1, hp: 40, hpm: 40 });
  A.send({ t: 'game.create', name: 'Wire', diff: 'normal' });
  const g = await A.wait('game');
  ok('game opens', !!(g && g.game));
  B.send({ t: 'game.join', id: g.game.id });
  await B.wait('game');

  /* The zone snapshot is the reply to your own move, so the sender's reply is the
     sign that the server has stored the fields before the other client asks. */
  async function place(from, x, extra) {
    from.forget('zone');
    from.send(Object.assign({ t: 'move', x: x, y: 4, zi: 1, dir: 0.4, hp: 30, hpm: 40 }, extra || {}));
    return from.wait('zone');
  }
  await place(A, 3.5);
  const quiet = await place(B, 5, { dir: 1.2, hp: 28 });
  const who = quiet && quiet.players && quiet.players.find(p => p.name === 'Ines');
  ok('a quiet player is forwarded with empty cosmetics', !!who && who.sk === null && who.au === null && who.sw === 0 && who.dir === 0.4, JSON.stringify(who));

  await place(A, 3.5, { dir: 0.4, sk: 0, au: 4, sw: 1 });
  const cast = await place(B, 5, { dir: 1.2, hp: 28 });
  const raw = JSON.stringify(cast);
  const seen = cast && cast.players && cast.players.find(p => p.name === 'Ines');
  ok('sk, au and sw are forwarded', !!seen && seen.sk === 0 && seen.au === 4 && seen.sw === 1, JSON.stringify(seen));
  ok('the zone packet stays well under a kilobyte', raw.length < 1024, String(raw.length));
  ok('the zone packet is not a list of points', !/\[[\d.\-, ]{8,}\]/.test(raw), raw);
  ok('the three fields are scalars', !!seen && typeof seen.sk === 'number' && typeof seen.au === 'number' && typeof seen.sw === 'number');

  /* Leaving them off the next move must not wipe what the server stored. */
  await place(A, 3.6);
  const kept = await place(B, 5, { dir: 1.2, hp: 28 });
  const held = kept && kept.players && kept.players.find(p => p.name === 'Ines');
  ok('an omitted field keeps the stored value', !!held && held.sk === 0 && held.au === 4 && held.sw === 1, JSON.stringify(held));

  await place(A, 3.6, { sk: null, sw: 0 });
  const cleared = await place(B, 5, { dir: 1.2, hp: 28 });
  const blank = cleared && cleared.players && cleared.players.find(p => p.name === 'Ines');
  ok('an explicit clear drops the cast and the swing, and leaves the aura', !!blank && blank.sk === null && blank.sw === 0 && blank.au === 4, JSON.stringify(blank));

  await place(A, 3.7, { dir: 0.5, sk: [1, 2, 3, 4], au: [4, 4], sw: [1, 0] });
  const junk = await place(B, 5, { dir: 1.2, hp: 28 });
  const junkRaw = JSON.stringify(junk);
  const bad = junk && junk.players && junk.players.find(p => p.name === 'Ines');
  ok('a list is not stored', !!bad && bad.sk === null && bad.au === null && bad.sw === 0, JSON.stringify(bad));
  ok('a junk move still is not a list of points', junkRaw.length < 1024 && !/\[[\d.\-, ]{8,}\]/.test(junkRaw), junkRaw);

  const before = B.seen.filter(m => m.t === 'pvp').length;
  A.send({ t: 'pvp', uid: B.last.you.uid, dmg: 9999, kind: 'crit' });
  A.send({ t: 'move', x: 3.6, y: 4.3, zi: 1, dir: 0.5, hp: 30, hpm: 40, sk: 12 });
  await wait(250);
  ok('a cosmetic cast does not become a hit', B.seen.filter(m => m.t === 'pvp').length === before);

  A.s.close(); B.s.close();
  await wait(200);
  ok('live map drains', live.live.size === 0, String(live.live.size));

  console.log(out.join('\n'));
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  server.close();
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
