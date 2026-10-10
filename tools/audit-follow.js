/* Follow-ups the long pass left ambiguous. */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const SHOT = process.env.AUDIT_SHOTS || '/tmp/audit-shots';
const html = fs.readFileSync(path.join(root, 'dist/unsubscribe.html'), 'utf8');
const CHROME = process.env.PW_CHROMIUM || undefined;
const rows = [];
function row(area, feature, grade, notes) { rows.push({ area, feature, grade, notes }); console.log(grade.padEnd(16), feature, '—', String(notes).slice(0, 180)); }
async function clearUI(page) {
  for (let i = 0; i < 24; i++) {
    const st = await page.evaluate(() => {
      const s = document.getElementById('scene');
      if (s && !s.hidden) { document.getElementById('scSkip').click(); return 'scene'; }
      const d = document.getElementById('dlg');
      if (d && !d.hidden) { const x = d.querySelector('#dBtns button:not([disabled])'); if (x) { x.click(); return 'dlg'; } return 'locked'; }
      return 'clear';
    });
    if (st === 'clear') return;
    await page.waitForTimeout(st === 'locked' ? 450 : 120);
  }
}
(async () => {
  const b = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">' + html + '</body></html>');
  await p.waitForTimeout(300);
  await p.evaluate(() => __g.skipDisc());
  await p.click('[data-cls=scrapper]');
  await p.waitForTimeout(200);
  await p.evaluate(() => { __g.G.pre = 2; __g.G.walkNew = 0; __g.OPT.noWalk = 1; __g.G.god = true; });
  await clearUI(p);
  await p.evaluate(() => { __g.enter(0); __g.setMode('play'); });
  await clearUI(p);

  const move = await p.evaluate(() => {
    const W = __g.W, N = W.N, P = __g.P;
    const walk = (x, y) => x >= 1 && y >= 1 && x < N - 1 && y < N - 1 && W.map[(y | 0) * N + (x | 0)] === 1;
    let spot = null;
    for (let y = 2; y < N - 2 && !spot; y++) for (let x = 2; x < N - 8; x++) {
      let ok = true;
      for (let i = 0; i <= 6; i++) if (!walk(x + i, y)) ok = false;
      if (ok) { spot = { x: x + .5, y: y + .5, tx: x + 6.2, ty: y + .5 }; break; }
    }
    if (!spot) return { spot: 0 };
    P.x = spot.x; P.y = spot.y;
    const ord = __g.mouseClick('left', spot.tx, spot.ty);
    const d0 = Math.hypot(P.x - spot.tx, P.y - spot.ty);
    for (let i = 0; i < 100; i++) __g.update(0.05);
    const d1 = Math.hypot(P.x - spot.tx, P.y - spot.ty);
    return { ord: ord && ord.k, d0: +d0.toFixed(2), d1: +d1.toFixed(2), ok: d1 < 0.8 && d1 < d0 - 2 };
  });
  row('controls', 'Click-to-move order reaches the tile', move.ok ? 'Works' : 'Broken', JSON.stringify(move));

  const atk = await p.evaluate(() => {
    __g.enter(1); __g.setMode('play');
    const P = __g.P;
    const e = __g.spawn('tick', P.x + 3.2, P.y);
    e.stun = 99; e.aggro = false;
    const hp = e.hp, x0 = P.x;
    const ord = __g.mouseClick('left', e.x, e.y);
    for (let i = 0; i < 120; i++) __g.update(0.05);
    return { ord: ord && ord.k, hp, hp2: e.hp, moved: Math.abs(P.x - x0) > 0.4, ok: e.hp < hp };
  });
  row('controls', 'Click-to-attack hurts the machine', atk.ok ? 'Works' : 'Broken', JSON.stringify(atk));

  const cast = await p.evaluate(() => {
    const P = __g.P, e = __g.W.ents.find(x => x.k === 'tick' && x.hp > 0) || __g.spawn('tick', P.x + 1.2, P.y);
    e.stun = 99; e.hp = e.max || 80;
    __g.ensureMouse(); __g.G.mouse.R = 0; __g.G.sk[0] = 5; __g.G.en = 9999; P.cd[0] = 0;
    const hp = e.hp;
    const ord = __g.mouseClick('right', e.x, e.y);
    for (let i = 0; i < 20; i++) __g.update(0.05);
    return { ord: ord && ord.k, hp, hp2: e.hp, ok: e.hp < hp };
  });
  row('controls', 'Right-click cast hurts the machine', cast.ok ? 'Works' : 'Broken', JSON.stringify(cast));

  const xp = await p.evaluate(() => {
    const one = (d) => {
      __g.G.diff = d; __g.G.tier = 0; __g.enter(1); __g.setMode('play');
      const e = __g.spawn('tick', __g.P.x + 2, __g.P.y);
      e.hp = 1; __g.P.streak = 0; __g.P.streakT = 0;
      const ml = __g.W.ml, x0 = __g.G.xp;
      __g.kill(e);
      return { d, ml, xp: __g.G.xp - x0, df: [1, 1.2, 1.45][d] };
    };
    return { a: one(0), b: one(2) };
  });
  const ratio = xp.b.xp / xp.a.xp;
  row('difficulty', 'Brutal kill XP versus the stated multiplier', Math.abs(ratio - 1.45) < 0.08 ? 'Works' : 'Partially works', JSON.stringify(xp) + ' ratio ' + ratio.toFixed(3));

  const isk = await p.evaluate(() => {
    __g.setMode('play'); __g.enter(1); __g.setMode('play');
    const ids = [['call', 101, 'orders'], ['book', 102, 'book'], ['ledger', 103, 'ledger'], ['bear', 104, 'bear'], ['chair', 105, 'allies']];
    const out = {};
    for (const [id, i, key] of ids) {
      __g.tryGear(id);
      __g.setMode('play');
      __g.G.en = 9999; __g.P.cd[i] = 0; __g.P.castWait = 0; __g.P.silence = 0; __g.P.bear = 0; __g.P.dash = null;
      const a0 = __g.W.allies.length;
      __g.castIndex(i);
      if (key === 'allies') out[id] = __g.W.allies.length > a0;
      else out[id] = (__g.P[key] || 0) > 0;
    }
    return out;
  });
  row('items', 'Five item skills besides Teleport', Object.values(isk).every(Boolean) ? 'Works' : 'Partially works', JSON.stringify(isk));

  const mkt = await p.evaluate(() => {
    __g.G.credits = 1e7; __g.G.sats = 0; __g.mktInit();
    const t = __g.mktTrade(5, 'buy');
    return { t, sats: __g.G.sats, credits: __g.G.credits };
  });
  row('economy', 'Buying five sats from the market', mkt.sats >= 5 && mkt.credits < 1e7 ? 'Works' : 'Broken', JSON.stringify(mkt));

  const sell = await p.evaluate(() => {
    __g.enter(0); __g.setMode('play'); __g.G.credits = 1000;
    const it = __g.makeItem(8, 1, 'helm'); it.id = true;
    __g.G.bag = [it];
    const before = __g.G.credits;
    __g.talkTo('brenda');
    const trade = [...document.querySelectorAll('#dBtns button')].find(b => /trade/i.test(b.textContent));
    if (trade) trade.click();
    const sellBtn = [...document.querySelectorAll('button')].find(b => /sell/i.test(b.textContent) && !b.disabled);
    if (sellBtn) sellBtn.click();
    return { before, after: __g.G.credits, bag: __g.G.bag.length, sell: sellBtn && sellBtn.textContent.slice(0, 40) };
  });
  row('economy', 'Selling an item to Brenda', sell.after > sell.before ? 'Works' : 'Partially works', JSON.stringify(sell));

  await p.evaluate(() => { __g.closeSheet(); __g.setMode('play'); __g.G.q.q25 = 3; __g.G.module = 1; __g.finalChoice(); });
  await p.waitForTimeout(1200);
  await p.screenshot({ path: path.join(SHOT, '10-ending.png') });
  const end = await p.evaluate(() => {
    const btn = [...document.querySelectorAll('#dBtns button')].find(b => /seventh/i.test(b.textContent) && !b.disabled);
    if (btn) btn.click();
    return { ending: __g.G.ending, clicked: !!btn };
  });
  await p.waitForTimeout(400);
  const end2 = await p.evaluate(() => ({ ending: __g.G.ending, scene: document.getElementById('scene') && !document.getElementById('scene').hidden, title: (document.getElementById('scTitle') || {}).textContent || '' }));
  row('story', 'Seventh-part ending starts when the button is unlocked', end2.ending === 'doubt' ? 'Works' : 'Partially works', JSON.stringify({ end, end2 }));

  await clearUI(p);
  await p.evaluate(() => { __g.setMode('play'); document.getElementById('bBug').click(); });
  await p.waitForTimeout(900);
  await p.evaluate(() => { const b = document.querySelector('#dBtns button:not([disabled])'); if (b) b.click(); });
  await p.waitForTimeout(300);
  const bugShown = await p.evaluate(() => {
    const w = document.getElementById('bugw');
    return { shown: !!(w && !w.hidden), n: document.querySelectorAll('#bugw textarea').length };
  });
  if (bugShown.shown) {
    const areas = await p.$$('#bugw textarea');
    await areas[0].fill('Opened the report during the audit.');
    await areas[1].fill('Wanted the report copied.');
    await areas[2].fill('Clipboard or a clear failure.');
    await p.screenshot({ path: path.join(SHOT, '11-bug-form.png') });
    const send = p.locator('#bugw button').filter({ hasText: /send|copy|file/i }).first();
    if (await send.count()) await send.click();
    await p.waitForTimeout(400);
  }
  const bugText = await p.evaluate(() => document.body.innerText.includes('clipboard') || document.body.innerText.includes('nowhere'));
  row('meta', 'Offline report form', bugShown.shown && bugShown.n === 3 ? 'Works' : 'Broken', JSON.stringify({ bugShown, bugText }));

  fs.writeFileSync('/tmp/audit-follow.json', JSON.stringify({ rows, errs }, null, 2));
  console.log('errs', errs);
  await b.close();

  const b2 = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const p2 = await b2.newPage({ viewport: { width: 1100, height: 700 } });
  await p2.goto('file://' + path.join(root, 'dist/Unsubscribe-2087-standalone.html'));
  await p2.waitForTimeout(500);
  await p2.evaluate(() => { __g.skipDisc(); localStorage.clear(); });
  await p2.waitForTimeout(150);
  const cls = await p2.evaluate(() => [...document.querySelectorAll('[data-cls]')].map(b => b.getAttribute('data-cls')));
  await p2.click('[data-cls=courier]');
  await p2.waitForTimeout(250);
  await p2.evaluate(() => { __g.G.pre = 2; __g.G.lvl = 17; __g.G.sats = 42; __g.G.walkNew = 0; __g.save(true); });
  await p2.reload();
  await p2.waitForTimeout(500);
  await p2.evaluate(() => __g.skipDisc());
  await p2.screenshot({ path: path.join(SHOT, '12-save-reload.png') });
  const saved = await p2.evaluate(() => { const o = JSON.parse(localStorage.getItem('unsub2087v3') || 'null'); return o && { lvl: o.G.lvl, sats: o.G.sats, cls: o.G.cls }; });
  row('saves', 'Standalone file save survives reload', saved && saved.lvl === 17 && saved.sats === 42 ? 'Works' : 'Broken', JSON.stringify({ cls, saved }));
  fs.writeFileSync('/tmp/audit-follow.json', JSON.stringify({ rows, errs }, null, 2));
  await b2.close();
})().catch(e => { console.error(e); process.exit(1); });
