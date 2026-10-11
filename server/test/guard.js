/* Bounds: experience, player damage, quest flags, and saves.
   `node server/test/guard.js` */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'u2087-guard-'));
process.env.DATA_DIR = tmp;
delete process.env.SMTP_HOST;
delete process.env.INVITE_REQUIRED;
delete process.env.INVITE_CODES;
delete process.env.ALLOWLIST;

const guard = require('../lib/guard');
const { server, live } = require('../server');
const auth = require('../lib/auth');

let pass = 0, fail = 0; const out = [];
const ok = (n, c, d) => { if (c) { pass++; out.push('  ok   ' + n); } else { fail++; out.push('  FAIL ' + n + (d ? '  <' + d + '>' : '')); } };
const wait = ms => new Promise(r => setTimeout(r, ms));

ok('a level-1 kill has a finite cap', guard.xpCap(1, 1) < 2e6 && guard.xpCap(1, 1) > 1000, String(guard.xpCap(1, 1)));
ok('a harder game raises the cap', guard.xpCap(40, 12) > guard.xpCap(40, 1));
ok('monster level is clamped', guard.xpCap(9999, 1) === guard.xpCap(100, 1));
ok('player damage stays under max life', guard.pvpLandedCap(9, 200) < 200 && guard.pvpLandedCap(90, 200) <= 200 * 0.85);
ok('quest flags are the real ones, and only move forward', guard.questStep({}, 'q1', 2) === 2 && guard.questStep({ q1: 2 }, 'q1', 2) === null && guard.questStep({}, 'q26', 1) === null && guard.questStep({}, 'q1', 0) === null && guard.questStep({}, 'nope', 1) === null);

(async () => {
  await new Promise(r => server.listen(0, r));
  const base = 'http://127.0.0.1:' + server.address().port;

  function reg(n) {
    const u = auth.createUser(n, 'guard-tester-11');
    return { u, cookie: 'u2087=' + encodeURIComponent(auth.newSession(u.id)) };
  }
  function client(cookie) {
    return new Promise((res, rej) => {
      const s = new WebSocket(base.replace('http', 'ws') + '/live', { headers: { Cookie: cookie } });
      const c = { s, seen: [], last: {}, send: o => s.send(JSON.stringify(o)) };
      s.onmessage = e => { const m = JSON.parse(e.data); c.seen.push(m); c.last[m.t] = m; if (m.t === 'you') res(c); };
      s.onerror = () => rej(new Error('socket'));
      setTimeout(() => rej(new Error('timed out')), 5000);
    });
  }
  async function call(cookie, p, body, csrf) {
    const r = await fetch(base + p, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookie, 'X-CSRF': csrf || '' },
      body: JSON.stringify(body)
    });
    let j = {}; try { j = await r.json(); } catch (e) {}
    return { status: r.status, body: j };
  }

  async function until(fn, ms) {
    const end = Date.now() + ms;
    while (Date.now() < end) { if (fn()) return true; await wait(20); }
    return !!fn();
  }

  const A = reg('Ada'), B = reg('Bea');
  const sess = auth.readSession(decodeURIComponent(A.cookie.split('=')[1]));
  const a = await client(A.cookie), b = await client(B.cookie);
  a.send({ t: 'game.create', name: 'Cap', diff: 'brutal' });
  ok('the game was created', await until(() => a.last.game && a.last.game.game && a.last.game.game.id, 1500), JSON.stringify(a.last.game));
  b.send({ t: 'game.join', id: a.last.game.game.id });
  ok('the second player joined', await until(() => b.last.game && b.last.game.game && b.last.game.game.id === a.last.game.game.id, 1500));
  a.send({ t: 'hello', lvl: 20, zi: 4, hp: 400, hpm: 400, cls: 'scrapper' });
  b.send({ t: 'hello', lvl: 20, zi: 4, hp: 400, hpm: 400, cls: 'scrapper' });
  a.send({ t: 'invite', uid: b.last.you.uid });
  await wait(60);
  b.send({ t: 'accept', uid: a.last.you.uid });
  await wait(80);

  b.seen.length = 0; a.seen.length = 0;
  a.send({ t: 'xp', amount: 1e9, ml: 1 });
  await wait(150);
  const shares = a.seen.concat(b.seen).filter(m => m.t === 'xp').map(m => m.amount);
  const cap = guard.xpCap(1, live.gameScale([...live.games.values()][0]).xp);
  ok('a billion experience is clamped', shares.length >= 1 && shares.every(n => n <= cap * 2), JSON.stringify(shares) + ' cap ' + cap);

  const pa = [...live.live.values()].find(p => p.name === 'Ada');
  const pb = [...live.live.values()].find(p => p.name === 'Bea');
  pa.hostile.add(pb.uid); pb.hostile.add(pa.uid);
  pa.zi = pb.zi = 4; pa.safeUntil = pb.safeUntil = 0;
  b.seen.length = 0;
  a.send({ t: 'pvp', uid: pb.uid, dmg: 1e7 });
  await wait(120);
  const hit = b.seen.find(m => m.t === 'pvp');
  const landed = guard.pvpLandedCap(pa.lvl, pb.hpm);
  ok('player damage is capped to a fraction of max life', !!hit && hit.dmg > 0 && hit.dmg <= Math.ceil(landed), JSON.stringify(hit) + ' cap ' + landed);

  b.seen.length = 0;
  a.send({ t: 'quest', k: 'q1', v: 2 });
  await wait(80);
  ok('a real quest step is shared', b.seen.some(m => m.t === 'quest' && m.k === 'q1' && m.v === 2));
  b.seen.length = 0;
  a.send({ t: 'quest', k: 'q1', v: 2 });
  a.send({ t: 'quest', k: 'q99', v: 1 });
  a.send({ t: 'quest', k: 'q1', v: 9 });
  await wait(80);
  ok('a repeated or invented quest flag is dropped', !b.seen.some(m => m.t === 'quest'));

  const hero = (lvl, sats, bag) => ({ s: JSON.stringify({ G: { lvl, sats, cls: 'scrapper', bag: bag || [], eq: {}, stash: [] } }), t: Date.now(), lv: lvl, cl: 'scrapper' });
  let r = await call(A.cookie, '/api/doc/set', { id: 'main', data: hero(10, 20) }, sess.csrf);
  ok('an honest save is kept', r.status === 200, JSON.stringify(r.body));
  r = await call(A.cookie, '/api/doc/set', { id: 'main', data: hero(80, 20) }, sess.csrf);
  ok('a level leap is refused', r.status === 400, JSON.stringify(r.body));
  r = await call(A.cookie, '/api/doc/set', { id: 'main', data: hero(12, 9000) }, sess.csrf);
  ok('a satoshi leap is refused', r.status === 400, JSON.stringify(r.body));
  const bag = Array.from({ length: 25 }, () => ({ il: 3, q: 1 }));
  r = await call(A.cookie, '/api/doc/set', { id: 'main', data: hero(12, 20, bag) }, sess.csrf);
  ok('a bag past 24 is refused', r.status === 400, JSON.stringify(r.body));
  r = await call(A.cookie, '/api/doc/get', { id: 'main' });
  const kept = JSON.parse(r.body.data.s).G;
  ok('the refused saves left the honest one', kept.lvl === 10 && kept.sats === 20, JSON.stringify(kept));

  const sheet = (g, t) => ({ s: JSON.stringify({ G: Object.assign({ sats: 0, cls: 'hacker', bag: [], eq: {}, stash: [] }, g) }), t: t || Date.now() });
  const one = guard.xpNext(40);
  const held = sheet({ lvl: 40, act3: false, bankXp: one }, 1000);
  const paid = sheet({ lvl: 41, act3: true, bankXp: 0, xp: 0 }, 2000);
  ok('paying the Act III bank is kept', guard.checkSave(held, paid, 'main').ok === true, JSON.stringify(guard.checkSave(held, paid, 'main')));
  const leap = sheet({ lvl: 40 + guard.LEVEL_LEAP + 1, act3: true, bankXp: 0 }, 3000);
  ok('the bank does not cover a larger leap', guard.checkSave(held, leap, 'main').ok === false);

  const under = guard.xpAccept(one, 40, 50, false);
  ok('one banked level is not clamped', under.amount === one && under.paid === true && under.clamped === false, JSON.stringify(under));
  const second = guard.xpAccept(one, 40, 50, true);
  ok('a second bank-sized packet uses the kill cap', second.amount === 50 && second.clamped === true, JSON.stringify(second));
  const killCap = guard.xpCap(1, 1);
  const huge = guard.xpAccept(1e12, 40, killCap, false);
  ok('a packet past one level is still clamped', huge.amount === killCap && huge.paid === false, JSON.stringify(huge));
  const ordinary = guard.xpAccept(one, 40, killCap, false);
  ok('a level of experience under the kill cap is unchanged', ordinary.amount === one && ordinary.clamped === false && ordinary.paid === false, JSON.stringify(ordinary));

  console.log(out.join('\n'));
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  server.close();
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
