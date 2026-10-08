/* Shared districts. `node server/test/maps.js`
   Two sockets in one game are handed the same seed. Two browsers that draw from it
   get the same rooms, spawns and waypoints. A character who is not in a game still
   draws their own district, and joining a game does not replace it. */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'u2087-maps-'));
process.env.DATA_DIR = tmp;
delete process.env.SMTP_HOST;
delete process.env.INVITE_REQUIRED;
delete process.env.WS_REQUIRE_ORIGIN;

const { server } = require('../server');
const auth = require('../lib/auth');
const { chromium } = require('playwright');

let pass = 0, fail = 0; const out = [];
const ok = (n, c, d) => { if (c) { pass++; out.push('  ok   ' + n); } else { fail++; out.push('  FAIL ' + n + (d ? '  <' + d + '>' : '')); } };
const wait = ms => new Promise(r => setTimeout(r, ms));
const same = (a, b) => a && b && a.floor === b.floor && a.start === b.start && a.ents === b.ents && a.portals === b.portals && a.seed === b.seed;

(async () => {
  await new Promise(r => server.listen(0, r));
  const base = 'http://127.0.0.1:' + server.address().port;

  function reg(n) {
    const u = auth.createUser(n, 'maps-tester-11');
    return 'u2087=' + encodeURIComponent(auth.newSession(u.id));
  }
  function client(cookie) {
    return new Promise((res, rej) => {
      const s = new WebSocket(base.replace('http', 'ws') + '/live', { headers: { Cookie: cookie } });
      const c = { s, seen: [], send: o => s.send(JSON.stringify(o)) };
      s.onmessage = e => { const m = JSON.parse(e.data); c.seen.push(m); if (m.t === 'you') res(c); };
      s.onerror = () => rej(new Error('socket'));
      setTimeout(() => rej(new Error('timed out')), 4000);
    });
  }
  function latest(c, zi) {
    const rows = c.seen.filter(m => m.t === 'map' && m.zi === zi);
    return rows.length ? rows[rows.length - 1] : null;
  }

  const a = await client(reg('Nia'));
  const b = await client(reg('Vale'));
  a.send({ t: 'game.create', name: 'Maps', diff: 'normal' });
  await wait(80);
  const gid = a.seen.find(m => m.t === 'game' && m.game);
  ok('a game was made', !!(gid && gid.game.id));
  b.send({ t: 'game.join', id: gid.game.id });
  await wait(80);
  a.send({ t: 'map', zi: 1, tier: 0 });
  await wait(80);
  const ma = latest(a, 1), mb = latest(b, 1);
  ok('both players are given the same seed', !!(ma && mb && ma.seed === mb.seed && ma.key === mb.key && ma.seed > 0), JSON.stringify(ma) + ' / ' + JSON.stringify(mb));
  a.send({ t: 'map', zi: 1, tier: 0, fresh: 1 });
  await wait(80);
  const ma2 = latest(a, 1);
  ok('a redraw mints a new roll', !!(ma2 && ma2.roll === ma.roll + 1 && ma2.seed !== ma.seed), JSON.stringify(ma2));
  a.send({ t: 'map', zi: 1, tier: 1 });
  await wait(60);
  const tier = latest(a, 1);
  ok('another tier is its own seed', !!(tier && tier.tier === 1 && tier.seed !== ma2.seed), JSON.stringify(tier));

  /* ---- two browsers draw the district ---- */
  const browser = await chromium.launch();
  const errs = [];
  async function player(name) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } });
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message));
    await p.goto(base + '/');
    await p.waitForTimeout(500);
    await p.evaluate(n => fetch('/api/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: n, pass: 'maps-browser-11' })
    }).then(r => r.json()), name);
    await p.goto(base + '/');
    await p.waitForTimeout(700);
    await p.evaluate(() => __g.skipDisc());
    await p.waitForTimeout(200);
    await p.click('[data-cls=scrapper]');
    await p.waitForTimeout(700);
    for (let i = 0; i < 12; i++) {
      await p.evaluate(() => {
        const s = document.getElementById('scene'); if (s && !s.hidden) document.getElementById('scSkip').click();
        const d = document.getElementById('dlg'); if (d && !d.hidden) { const x = d.querySelector('#dBtns button:not([disabled])'); x && x.click(); }
      });
      await p.waitForTimeout(100);
    }
    return p;
  }
  async function until(page, fn, ms) {
    const end = Date.now() + (ms || 8000);
    for (;;) {
      const v = await page.evaluate(fn).catch(() => null);
      if (v) return v;
      if (Date.now() > end) return null;
      await wait(80);
    }
  }
  async function draw(page, zi) {
    await page.evaluate(z => { window.__wantZi = z; __g.enter(z); }, zi);
    return until(page, () => { const p = __g.mapPrint(); return p && p.zi === window.__wantZi && p.floor > 40 ? p : 0; });
  }

  const S1 = await player('Ada');
  const S2 = await player('Bea');
  const solo1 = await draw(S1, 1);
  ok('a solo district is drawn', !!(solo1 && solo1.zi === 1 && !solo1.shared), JSON.stringify(solo1 && { zi: solo1.zi, shared: solo1.shared, floor: solo1.floor }));
  await S1.evaluate(() => __g.enter(0));
  await until(S1, () => __g.mapPrint() && __g.mapPrint().zi === 0 ? 1 : 0);
  const soloBack = await draw(S1, 1);
  ok('leaving and returning keeps the solo district', same(solo1, soloBack), JSON.stringify({ a: solo1 && solo1.start, b: soloBack && soloBack.start }));
  const solo2 = await draw(S2, 1);
  ok('two solo characters do not share a district', !!(solo2 && solo2.ents !== solo1.ents), solo2 && solo2.start);

  const A = await player('Ines');
  const B = await player('Wren');
  await until(A, () => __mp.on ? 1 : 0);
  await until(B, () => __mp.on ? 1 : 0);
  await A.evaluate(() => __mp.send('game.create', { name: 'Shared', diff: 'nightmare' }));
  const made = await until(A, () => __mp.MP.game && __mp.MP.game.id);
  ok('the browser game exists', !!made);
  await B.evaluate(id => __mp.send('game.join', { id }), made);
  ok('the second browser joined', !!(await until(B, () => __mp.MP.game ? 1 : 0)));

  const g1 = await draw(A, 1);
  const g2 = await draw(B, 1);
  ok('two players in one game draw the same district', same(g1, g2) && g1.shared.indexOf('g:') === 0, JSON.stringify({ a: g1 && g1.start, b: g2 && g2.start, seed: g1 && g1.seed, ents: g1 && g1.ents === (g2 && g2.ents) }));
  ok('the shared district is not the solo one', !!(g1 && solo1 && g1.ents !== solo1.ents));

  await A.evaluate(() => __g.enter(0));
  await B.evaluate(() => __g.enter(0));
  const t1 = await until(A, () => { const p = __g.mapPrint(); return p && p.zi === 0 && p.res ? p : 0; });
  const t2 = await until(B, () => { const p = __g.mapPrint(); return p && p.zi === 0 && p.res ? p : 0; });
  ok('the town residents match', !!(t1 && t2 && t1.res === t2.res && t1.floor === t2.floor), JSON.stringify({ a: t1 && t1.res, b: t2 && t2.res }));

  await A.evaluate(() => { __g.G.tier = 1; __g.enter(2); });
  await B.evaluate(() => { __g.G.tier = 1; __g.enter(2); });
  const u1 = await until(A, () => { const p = __g.mapPrint(); return p && p.zi === 2 && p.seed ? p : 0; });
  const u2 = await until(B, () => { const p = __g.mapPrint(); return p && p.zi === 2 && p.seed ? p : 0; });
  ok('a tier is shared, and it is not the previous district', same(u1, u2) && u1.seed !== g1.seed, JSON.stringify({ a: u1 && u1.seed, b: u2 && u2.seed }));

  const held = await A.evaluate(() => { const z = __g.W.zi; __g.G.q.q5 = 3; __g.G.act2 = false; __g.G.q.q6 = 0; const go = __g.enter(7); return { go, zi: __g.W.zi, was: z }; });
  ok('Gramps still holds the next act', held && held.go === false && held.zi === held.was, JSON.stringify(held));

  await A.evaluate(() => __mp.send('game.leave'));
  ok('leaving the game is allowed', !!(await until(A, () => __mp.MP.game ? 0 : 1)));
  const home = await draw(A, 1);
  ok('a district after the game is that character\'s own', !!(home && !home.shared && home.ents !== g1.ents), home && home.shared);

  ok('no page errors', errs.length === 0, errs.slice(0, 3).join(' | '));

  console.log(out.join('\n'));
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  try { a.s.close(); b.s.close(); } catch (e) {}
  await browser.close();
  server.close();
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
