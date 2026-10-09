/* Proves the approved fix pass: difficulty XP, right-click chase, Brenda's
   one-click sale, the right-slot key, and the three unique tooltip fixes.
   node tools/audit2-fixes.js
*/
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const CHROME = process.env.PW_CHROMIUM || '/usr/local/bin/google-chrome';
const SHOT = process.env.AUDIT_SHOTS || '/tmp/audit2-shots';
fs.mkdirSync(SHOT, { recursive: true });
const html = fs.readFileSync(path.join(root, 'dist/unsubscribe.html'), 'utf8');
const fail = [];
function ok(name, cond, detail) {
  console.log((cond ? 'ok' : 'FAIL').padEnd(6), name, detail || '');
  if (!cond) fail.push(name + ' ' + (detail || ''));
}
async function clearUI(page) {
  for (let i = 0; i < 40; i++) {
    const st = await page.evaluate(() => {
      const s = document.getElementById('scene');
      if (s && !s.hidden) { const b = document.getElementById('scSkip'); if (b) b.click(); return 'scene'; }
      const d = document.getElementById('dlg');
      if (d && !d.hidden) {
        const x = d.querySelector('#dBtns button:not([disabled])');
        if (x) { x.click(); return 'dlg'; }
        return 'locked';
      }
      return 'clear';
    });
    if (st === 'clear') return;
    await page.waitForTimeout(st === 'locked' ? 500 : 80);
  }
}

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0">' + html + '</body></html>');
  await page.waitForTimeout(300);
  await page.evaluate(() => __g.skipDisc());
  await page.evaluate(() => { __g.noteInput('mouse'); __g.G && 0; });
  await page.click('[data-cls=scrapper]');
  await page.waitForTimeout(200);
  await clearUI(page);
  await page.evaluate(() => {
    const G = __g.G;
    G.pre = 2; G.walkNew = 0; G.god = true;
    G.nodes = G.nodes || {}; G.st = G.st || {}; G.st.wf = G.st.wf || {};
    G.words = G.words || {}; G.rep = G.rep || { btc: 0, anon: 0, norm: 0 };
    __g.OPT.noWalk = 1; __g.OPT.auto = false;
    __g.enter(1); __g.setMode('play');
  });
  await clearUI(page);
  await page.evaluate(() => { __g.G.god = true; __g.OPT.auto = false; __g.mode = 'play'; });

  const xp = await page.evaluate(() => {
    const g = __g;
    const take = (diff) => {
      g.G.diff = diff;
      g.G.xp = 0;
      g.G.lvl = 8;
      g.P.streak = 0;
      g.P.streakT = 0;
      g.W.ents = g.W.ents.filter(e => e.k === 'boss');
      const e = g.spawn('tick', g.P.x + 2, g.P.y, {});
      const xm = e ? e.xpM : null;
      const before = g.G.xp;
      if (e) g.kill(e);
      return { xm, gain: g.G.xp - before, cfg: g.G.diff };
    };
    const n = take(0), h = take(1), b = take(2);
    return { n, h, b, ratioH: h.gain / n.gain, ratioB: b.gain / n.gain };
  });
  ok('brutal xp is 1.45x', xp.n.gain > 0 && Math.abs(xp.ratioB - 1.45) < 0.02, JSON.stringify(xp));
  ok('hard xp is 1.2x', Math.abs(xp.ratioH - 1.2) < 0.02, 'ratio ' + xp.ratioH);
  ok('normal xpM stays near 1', xp.n.xm > 0.9 && xp.n.xm < 1.25, 'xpM ' + xp.n.xm);

  const click = await page.evaluate(() => {
    const g = __g;
    g.G.god = true;
    g.G.en = 500;
    g.G.sk[0] = 5;
    g.G.mouse.R = 0;
    g.P.cd[0] = 0;
    g.calc();
    g.G.en = 500;
    g.W.ents = [];
    const N = g.W.N;
    const walk = (x, y) => x >= 1 && y >= 1 && x < N - 1 && y < N - 1 && g.W.map[(y | 0) * N + (x | 0)] === 1;
    let spot = null;
    for (let y = 2; y < N - 2 && !spot; y++) for (let x = 2; x < N - 8; x++) {
      let good = true;
      for (let i = 0; i <= 7; i++) if (!walk(x + i, y)) good = false;
      if (good) { spot = { x: x + .5, y: y + .5 }; break; }
    }
    if (!spot) return { err: 'no lane' };
    g.P.x = spot.x; g.P.y = spot.y;
    const e = g.spawn('bot', spot.x + 5.5, spot.y, {});
    if (!e) return { err: 'no spawn' };
    const hp0 = e.hp, px = g.P.x;
    g.mouseClick('right', e.x, e.y, { hover: { kind: 'foe', o: e, x: e.x, y: e.y } });
    const order = g.MO && { k: g.MO.k, stand: g.MO.stand };
    let moved = 0, hit = false, frames = 0;
    for (let i = 0; i < 180 && e.hp >= hp0; i++) {
      g.update(1 / 30);
      frames++;
      if (Math.abs(g.P.x - px) > 0.4) moved = 1;
    }
    const far = e.hp;
    g.W.ents = [];
    g.P.x = spot.x; g.P.y = spot.y;
    const e2 = g.spawn('bot', spot.x + 5.5, spot.y, {});
    const hp2 = e2.hp, px2 = g.P.x;
    g.P.cd[0] = 0;
    g.G.en = 500;
    g.mouseClick('right', e2.x, e2.y, { hover: { kind: 'foe', o: e2, x: e2.x, y: e2.y }, shift: true });
    for (let i = 0; i < 20; i++) g.update(1 / 30);
    return { order, moved, frames, dealt: hp0 - far, shiftMoved: Math.abs(g.P.x - px2), shiftDealt: hp2 - e2.hp };
  });
  ok('right-click order chases the foe', click.order && click.order.k === 'cast' && click.order.stand === false, JSON.stringify(click.order));
  ok('right-click walks in and hits', click.moved === 1 && click.dealt > 0, JSON.stringify(click));
  ok('shift right-click stays put', click.shiftMoved < 0.2, 'moved ' + click.shiftMoved + ' dealt ' + click.shiftDealt);

  const held = await page.evaluate(() => {
    const g = __g;
    g.W.ents = [];
    const e = g.spawn('bot', g.P.x + 1.1, g.P.y, {}) || g.spawn('bot', g.P.x, g.P.y + 1.1, {});
    if (!e) return { err: 'no held foe' };
    g.G.en = 0;
    g.P.cd[0] = 0;
    g.mouseClick('right', e.x, e.y, { hover: { kind: 'foe', o: e, x: e.x, y: e.y }, hold: true });
    g.MBTN = g.MBTN;
    for (let i = 0; i < 8; i++) g.update(1 / 30);
    const dry = g.MO && { dry: g.MO.dry, why: g.MO.why, cd: g.P.cd[0] };
    g.G.en = 500;
    let fired = false;
    for (let i = 0; i < 40; i++) {
      g.update(1 / 30);
      if (g.P.cd[0] > 0) { fired = true; break; }
    }
    return { dry, fired };
  });
  ok('held cast retries a wait', held.dry && held.dry.dry === 1 && held.dry.why === 'wait' && held.fired, JSON.stringify(held));

  const drag = await page.evaluate(() => {
    const g = __g;
    g.G.sk[1] = 1;
    const started = g.beginAim(1, null, 'touch');
    const aiming = !!g.AIMING;
    g.aimCancel();
    const mouseDrag = g.wantDrag('mouse');
    const touchDrag = g.wantDrag('touch');
    return { started: !!started, aiming, mouseDrag, touchDrag, after: g.AIMING };
  });
  ok('drag-to-aim still opens on touch', drag.aiming && drag.touchDrag && !drag.mouseDrag && !drag.after, JSON.stringify(drag));

  const sale = await page.evaluate(() => {
    const g = __g;
    g.G.credits = 1000;
    g.G.sats = 0;
    g.mktInit(); const f = g.mktFair() || 1; g.G.mkt.p = 1; g.G.mkt.r = 1 / f; g.G.mkt.sent = 0; g.G.mkt.sT = 1e9;
    g.G.bag = [g.makeItem(4, 1, 'helm')];
    g.G.bag[0].id = true;
    g.setMode('play');
    g.openVend('brenda');
    const bid = g.vendBid(g.G.bag[0]);
    const sold = g.vendSell(0);
    return { sold, bid, credits: g.G.credits, sats: g.G.sats, bag: g.G.bag.length };
  });
  ok('brenda sells on one click', sale.sold && sale.bag === 0 && sale.credits === 1000 && sale.sats === sale.bid && sale.bid > 0, JSON.stringify(sale));
  await page.screenshot({ path: path.join(SHOT, 'brenda-sold.png') });

  const badge = await page.evaluate(() => {
    const g = __g;
    g.closeSheet();
    g.G.sk[4] = 1;
    g.G.mouse.R = 4;
    g.G.hot = [null, null, 4, null, null, null, null, null];
    g.paintMouseSlots ? 0 : 0;
    const hud = document.getElementById('mR');
    const before = hud.querySelector('i').textContent;
    /* paint runs from hud(); force the cache miss by calling the painter through a hot use */
    g.hotUse(2);
    const text = document.getElementById('mR').querySelector('i').textContent;
    const title = document.getElementById('mR').title;
    g.G.hot = [null, null, null, null, null, null, null, null];
    g.hotUse(0);
    g.G.mouse.R = 4;
    /* hotUse(0) sets R to null and paints. Put the skill back unbound. */
    g.G.mouse.R = 4;
    g.G.hot = [null, null, null, null, null, null, null, null];
    const key = (g.G.mouse.L | 0) + ':' + (g.G.mouse.R | 0);
    /* bump the painter cache */
    g.G.mouse.L = g.G.mouse.L === 0 ? -1 : 0;
    g.assignMouse('L', g.G.mouse.L);
    g.assignMouse('R', 4);
    const unbound = document.getElementById('mR').querySelector('i').textContent;
    return { before, text, title, unbound, key };
  });
  ok('right badge shows F3', badge.text === 'F3' && /F3/.test(badge.title), JSON.stringify(badge));
  ok('unbound right badge is R', badge.unbound === 'R', JSON.stringify(badge));
  await page.screenshot({ path: path.join(SHOT, 'badge-f3.png') });

  const uni = await page.evaluate(() => {
    const g = __g;
    g.closeSheet();
    g.mode = 'play';
    g.G.cls = 'courier';
    g.calc();
    g.S.sp.deadletter = 1;
    g.P.dir = { x: 1, y: 0 };
    g.P.atk = 0;
    g.W.projs = [];
    g.W.ents = [];
    g.attack();
    const own = g.W.projs[0] && g.W.projs[0].pierce;
    const foeT = g.spawn('bot', g.P.x + 3, g.P.y, {});
    g.W.allies = [{ k: 'turret', x: g.P.x, y: g.P.y, cd: 0, m: 1, life: 5 }];
    g.MO = null;
    g.W.projs = [];
    g.update(1 / 30);
    const minion = g.W.projs[0] && g.W.projs[0].pierce;
    g.W.projs = [];
    g.S.sp.deadletter = 0;
    if (foeT) foeT.hp = 0;
    g.W.ents = [];
    const foe = g.spawn('bot', g.P.x + 1.2, g.P.y, {});
    const lt = g.spawn('bot', g.P.x + 1.2, g.P.y + 1.2, { su: { n: 'Lieutenant', mods: [], q: null } });
    g.calc();
    g.S.dmin = g.S.dmax = 80;
    g.S.crit = 0;
    g.S.shock = 0;
    g.S.dmg = 0;
    g.S.sp.exit = 1;
    const a = foe.hp, b = lt.hp;
    g.hit(foe, 1);
    g.hit(lt, 1);
    const plain = a - foe.hp, bossy = b - lt.hp;
    const fill = (check) => {
      g.G.cls = 'founder';
      g.G.sk = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      g.calc();
      g.S.sp.check = check ? 1 : 0;
      g.S.dmin = g.S.dmax = 100;
      g.S.crit = 0; g.S.shock = 0; g.S.dmg = 0;
      g.W.allies = [];
      g.G.en = 9999;
      for (let i = 0; i < 8; i++) { g.P.cd[0] = 0; g.G.en = 9999; g.castIndex(0); }
      return g.W.allies.filter(a => a.kind === 'intern');
    };
    const withCheck = fill(1);
    const card = withCheck[0] && withCheck[0].m;
    const bare = fill(0).length;
    const hitOf = (check) => {
      const crew = fill(check);
      const a = crew[0];
      g.W.allies = [a];
      g.W.ents = [];
      const e = g.spawn('bot', g.P.x + 0.9, g.P.y, {});
      a.x = g.P.x + 0.4; a.y = g.P.y; a.cd = 0;
      const hp = e.hp;
      g.MO = null;
      for (let i = 0; i < 30 && e.hp === hp; i++) g.update(1 / 20);
      return hp - e.hp;
    };
    const on = hitOf(1), off = hitOf(0);
    return { own, minion, plain, bossy, ratio: bossy / plain, cap: withCheck.length, bare, card, on, off, workforce: on / off };
  });
  ok('dead letter pierces your throws', uni.own === 99 && uni.minion === 0, JSON.stringify({ own: uni.own, minion: uni.minion }));
  ok('exit interview hits lieutenants harder', uni.ratio > 1.4 && uni.ratio < 1.6, JSON.stringify({ plain: uni.plain, bossy: uni.bossy, ratio: uni.ratio }));
  ok('blank check raises the intern cap by two and the workforce by 1.25', uni.cap === 4 && uni.bare === 2 && uni.card > 0.35 && uni.card < 0.45 && uni.workforce > 1.2 && uni.workforce < 1.35, JSON.stringify(uni));

  ok('no page errors', errs.length === 0, errs.join(' | '));
  await browser.close();
  if (fail.length) {
    console.error(fail.join('\n'));
    process.exit(1);
  }
  console.log('fix pass ok');
})().catch(e => { console.error(e); process.exit(1); });
