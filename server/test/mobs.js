/* Shared machines. `node server/test/mobs.js`
   The server keeps one hit-point pool per machine in a game. Two browsers that
   stand in that game see the same life, and a kill pays experience from the
   server. A character who is not in a game still fights a private copy. */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'u2087-mobs-'));
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

(async () => {
  await new Promise(r => server.listen(0, r));
  const base = 'http://127.0.0.1:' + server.address().port;

  function reg(n) {
    const u = auth.createUser(n, 'mobs-tester-11');
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
  const of = (c, t) => c.seen.filter(m => m.t === t);

  const A = await client(reg('Nia'));
  const B = await client(reg('Vale'));
  const nia = (A.seen.find(m => m.t === 'you') || {}).uid;
  const vale = (B.seen.find(m => m.t === 'you') || {}).uid;
  A.send({ t: 'hello', lvl: 10, cls: 'scrapper', zi: 1, hp: 100, hpm: 120 });
  B.send({ t: 'hello', lvl: 10, cls: 'scrapper', zi: 1, hp: 100, hpm: 120 });
  A.send({ t: 'game.create', name: 'Pit', diff: 'normal' });
  await wait(80);
  const gid = A.seen.find(m => m.t === 'game' && m.game);
  ok('a game was made', !!(gid && gid.game.id));
  B.send({ t: 'game.join', id: gid.game.id });
  await wait(60);
  A.send({ t: 'move', x: 10, y: 10, zi: 1, tier: 0, hp: 100, hpm: 120, lvl: 10 });
  await wait(40);
  B.send({ t: 'move', x: 12, y: 10, zi: 1, tier: 0, hp: 100, hpm: 120, lvl: 10 });
  await wait(80);
  const hostA = of(A, 'mhost').pop();
  const hostB = of(B, 'mhost').pop();
  ok('the first player in the district hosts the machines', !!(hostA && hostB && hostA.uid === hostB.uid && hostA.uid === nia), JSON.stringify(hostA));

  A.send({ t: 'mobs', zi: 1, tier: 0, list: [{ id: 1, k: 'tick', x: 10, y: 11, hp: 999999, max: 999999, ml: 5 }] });
  await wait(60);
  const snap = of(B, 'mobs').pop();
  const row = snap && (snap.list || []).find(r => r.id === 1);
  ok('a ridiculous max is pulled back to the card', !!(row && row.max > 10 && row.max < 80), JSON.stringify(row));
  const max = row ? row.max : 0;

  B.send({ t: 'mobs', zi: 1, tier: 0, list: [{ id: 99, k: 'boss', x: 1, y: 1, hp: 1, max: 1, ml: 1 }] });
  await wait(40);
  A.send({ t: 'mhit', zi: 1, tier: 0, id: 99, d: 5 });
  await wait(40);
  ok('a guest cannot invent a machine', !of(A, 'mkill').some(m => m.id === 99) && !of(B, 'mobs').some(m => (m.list || []).some(r => r.id === 99)));

  const before = of(A, 'mhp').length;
  B.send({ t: 'mhit', zi: 1, tier: 0, id: 1, d: 1 });
  await wait(40);
  const hit = of(A, 'mhp').slice(before).pop();
  ok('a hit lands on both sides of the socket', !!(hit && hit.id === 1 && hit.hp === max - 1), JSON.stringify(hit));

  B.send({ t: 'mhit', zi: 1, tier: 0, id: 1, d: 1e9 });
  await wait(50);
  const dead = of(A, 'mkill').filter(m => m.id === 1);
  const paid = of(B, 'mxp');
  ok('one killing blow, and the experience is the card', dead.length === 1 && dead[0].loot === 0 && paid.length === 1 && paid[0].amount > 0 && paid[0].amount < 500, JSON.stringify({ dead: dead[0], xp: paid }));
  ok('the guest who struck it is the one paid', paid[0] && paid[0].self === 1 && of(A, 'mxp').length === 0, JSON.stringify(of(A, 'mxp')));
  const kills = of(B, 'mkill').length;
  B.send({ t: 'mhit', zi: 1, tier: 0, id: 1, d: 50 });
  await wait(40);
  ok('a dead machine does not die again', of(B, 'mkill').length === kills);

  /* An Act I district starts near eighty machines. Every one of them has to be known here,
     or the ones past the cut cannot be hit by anyone. */
  await wait(1100);
  const crowd = [];
  for (let i = 0; i < 85; i++) crowd.push({ id: 300 + i, k: 'tick', x: 12 + (i % 5) * .1, y: 10.5, hp: 30, max: 30, ml: 5 });
  A.send({ t: 'mobs', zi: 1, tier: 0, list: crowd });
  await wait(60);
  const crowdSeen = of(B, 'mobs').pop();
  ok('a district of eighty-five machines reaches the guest whole', !!(crowdSeen && crowdSeen.list.filter(r => r.id >= 300).length === 85), crowdSeen && String(crowdSeen.list.length));
  const lastBefore = of(B, 'mhp').length;
  B.send({ t: 'mhit', zi: 1, tier: 0, id: 384, d: 1 });
  await wait(50);
  ok('and the eighty-fifth can be hit', of(B, 'mhp').slice(lastBefore).some(m => m.id === 384));

  A.send({ t: 'mobs', zi: 1, tier: 0, list: [{ id: 2, k: 'tick', x: 8, y: 8, hp: 30, max: 30, ml: 5 }] });
  await wait(40);
  A.send({ t: 'invite', uid: vale });
  await wait(40);
  B.send({ t: 'accept', uid: nia });
  await wait(60);
  A.seen.length = 0; B.seen.length = 0;
  A.send({ t: 'mhit', zi: 1, tier: 0, id: 2, d: 1e9 });
  await wait(50);
  const ax = of(A, 'mxp'), bx = of(B, 'mxp');
  const sum = (ax[0] ? ax[0].amount : 0) + (bx[0] ? bx[0].amount : 0);
  ok('a party splits the server kill', ax.length === 1 && bx.length === 1 && sum === Math.round((ax[0].amount + bx[0].amount)) && sum > ax[0].amount, JSON.stringify({ a: ax[0], b: bx[0] }));

  A.send({ t: 'move', x: 12, y: 12, zi: 0, tier: 0, hp: 100, hpm: 120, lvl: 10 });
  let next = null;
  for (let i = 0; i < 20 && !(next && next.uid === vale); i++) {
    await wait(40);
    next = of(B, 'mhost').pop();
  }
  ok('the host leaving the district hands the machines over', !!(next && next.uid === vale), JSON.stringify({ next, vale, hosts: of(B, 'mhost').map(m => m.uid) }));

  /* ---- two browsers ---- */
  const browser = await chromium.launch();
  const errs = [];
  async function player(name) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } });
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message));
    await p.goto(base + '/');
    await p.waitForTimeout(400);
    await p.evaluate(n => fetch('/api/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: n, pass: 'mobs-browser-11' })
    }).then(r => r.json()), name);
    await p.goto(base + '/');
    await p.waitForTimeout(600);
    await p.evaluate(() => __g.skipDisc());
    await p.waitForTimeout(150);
    await p.click('[data-cls=scrapper]');
    await p.waitForTimeout(500);
    for (let i = 0; i < 12; i++) {
      await p.evaluate(() => {
        const s = document.getElementById('scene'); if (s && !s.hidden) document.getElementById('scSkip').click();
        const d = document.getElementById('dlg'); if (d && !d.hidden) { const x = d.querySelector('#dBtns button:not([disabled])'); x && x.click(); }
      });
      await p.waitForTimeout(80);
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

  const S = await player('Ada');
  const solo = await draw(S, 1);
  const poked = await S.evaluate(() => {
    const e = __g.W.ents.find(x => x.k && !x.mp);
    if (!e) return null;
    const hp = e.hp;
    __g.dmgEnemy(e, 5, false);
    return { hp, now: e.hp, mid: e.mid || 0, shared: __g.W.sharedKey || '' };
  });
  ok('solo damage still lands on that browser alone', !!(solo && !solo.shared && poked && !poked.mid && poked.now < poked.hp), JSON.stringify(poked));

  const P1 = await player('Ines');
  const P2 = await player('Wren');
  await until(P1, () => __mp.on ? 1 : 0);
  await until(P2, () => __mp.on ? 1 : 0);
  await P1.evaluate(() => __mp.send('game.create', { name: 'Shared pit', diff: 'normal' }));
  const made = await until(P1, () => __mp.MP.game && __mp.MP.game.id);
  ok('the browser game exists', !!made);
  await P2.evaluate(id => __mp.send('game.join', { id }), made);
  ok('the second browser joined', !!(await until(P2, () => __mp.MP.game ? 1 : 0)));
  const g1 = await draw(P1, 1);
  const g2 = await draw(P2, 1);
  ok('both browsers numbered the same machines', !!(g1 && g2 && g1.ents === g2.ents && g1.ents.indexOf('#') >= 0), JSON.stringify({ a: g1 && g1.ents.slice(0, 80), b: g2 && g2.ents.slice(0, 80) }));
  const hosted = await until(P1, () => __mp.MP.mobHost || 0, 4000) || await until(P2, () => __mp.MP.mobHost || 0, 2000);
  ok('someone is hosting the district', !!hosted, String(hosted));
  await wait(700);
  const hostPage = (await P1.evaluate(() => __mp.MP.me && __mp.MP.mobHost === __mp.MP.me.uid)) ? P1 : P2;
  const otherPage = hostPage === P1 ? P2 : P1;

  const struck = await hostPage.evaluate(() => {
    const e = __g.W.ents.find(x => x.mid && !x.su && !x.mp && x.k !== 'boss' && x.k !== 'boss2' && x.k !== 'boss3');
    if (!e) return null;
    /* The server refuses a swing from outside reach. Stand on the machine and say so
       before the blow, which is what a real swing does. */
    __g.P.x = e.x; __g.P.y = e.y;
    __mp.send('move', {
      x: +e.x.toFixed(2), y: +e.y.toFixed(2), zi: __g.W.zi, dir: 0,
      hp: Math.round(__g.G.hp), hpm: Math.round(__g.S.maxHp), lvl: __g.G.lvl | 0, tier: __g.G.tier | 0
    });
    const hp = e.hp, id = e.mid;
    __g.dmgEnemy(e, 1e6, false);
    return { id, hp, now: e.hp, xp: __g.G.xp };
  });
  ok('a shared blow waits for the server', !!(struck && struck.now === struck.hp), JSON.stringify(struck));
  await hostPage.evaluate(id => { window.__id = id; }, struck && struck.id);
  await otherPage.evaluate(id => { window.__id = id; }, struck && struck.id);
  const dead1 = await until(hostPage, () => __g.W.ents.some(e => e.mid === window.__id) ? 0 : { xp: __g.G.xp, left: __g.W.ents.filter(e => e.mid).length });
  const dead2 = await until(otherPage, () => __g.W.ents.some(e => e.mid === window.__id) ? 0 : 1);
  ok('both browsers lose the machine together', !!(dead1 && dead2), JSON.stringify({ dead1, dead2, struck }));
  ok('the server paid the killer', !!(dead1 && struck && dead1.xp > struck.xp), JSON.stringify({ before: struck && struck.xp, after: dead1 && dead1.xp }));

  ok('no page errors', errs.length === 0, errs.slice(0, 4).join(' | '));

  console.log(out.join('\n'));
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  try { A.s.close(); B.s.close(); } catch (e) {}
  await browser.close();
  server.close();
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
