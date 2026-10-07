/* Each save slot keeps its own place. Switch A→B→A and both are where they left.
   Opens the standalone file so localStorage works (setContent blocks it).
   Usage: node tools/slot-place.js */
const {chromium} = require('playwright');
const fs = require('fs');
const path = require('path');
const {pathToFileURL} = require('url');

const root = path.join(__dirname, '..');
const pagePath = path.join(root, 'dist', 'Unsubscribe-2087-standalone.html');
const fails = [];
function ok(cond, msg) {
  if (cond) console.log('ok  ' + msg);
  else { console.log('FAIL ' + msg); fails.push(msg); }
}
const same = (a, b) => a && b && a.cls === b.cls && a.zi === b.zi && Math.abs(a.x - b.x) < 0.05 && Math.abs(a.y - b.y) < 0.05;

async function dismiss(page, budgetMs) {
  const t0 = Date.now();
  while (Date.now() - t0 < (budgetMs || 15000)) {
    const s = await page.evaluate(() => {
      const scene = document.getElementById('scene');
      if (scene && !scene.hidden) {
        const sk = document.getElementById('scSkip');
        if (sk) sk.click();
        return 'scene';
      }
      if (window.__g && __g.mode === 'intro') { __g.ltEnd(); return 'intro'; }
      const d = document.getElementById('dlg');
      if (d && !d.hidden) {
        const b = d.querySelector('#dBtns button:not([disabled])');
        if (b) { b.click(); return 'clicked'; }
        return 'locked';
      }
      if (window.__g && __g.mode === 'play') return 'play';
      if (window.__g && __g.mode === 'title') return 'title';
      return window.__g ? __g.mode : 'boot';
    });
    if (s === 'play' || s === 'title' || s === 'dying') return s;
    await page.waitForTimeout(s === 'locked' ? 250 : 80);
  }
  return 'timeout';
}

async function boot(page) {
  await page.goto(pathToFileURL(pagePath).href);
  await page.waitForFunction(() => window.__g && __g.skipDisc);
  await page.evaluate(() => { localStorage.clear(); __g.skipDisc(); });
  await page.waitForTimeout(300);
}

async function begin(page, cls) {
  await page.click('[data-cls=' + cls + ']');
  await page.evaluate(() => { const G = __g.G; if (G) { G.pre = 2; G.seenIntro = false; G.preSeen = 1; } });
  return dismiss(page);
}

async function stand(page, x, y) {
  return page.evaluate(({x, y}) => {
    const W = __g.W, N = W.N;
    const walk = (x, y) => x >= 0 && y >= 0 && x < N && y < N && W.map[(y | 0) * N + (x | 0)] === 1;
    const free = (x, y) => walk(x - .3, y - .3) && walk(x + .3, y - .3) && walk(x - .3, y + .3) && walk(x + .3, y + .3);
    if (!free(x, y)) return null;
    __g.P.x = x; __g.P.y = y;
    return {cls: __g.G.cls, zi: W.zi, x: __g.P.x, y: __g.P.y, town: !!W.z.town};
  }, {x, y});
}

async function here(page) {
  return page.evaluate(() => ({cls: __g.G.cls, zi: __g.W.zi, x: __g.P.x, y: __g.P.y, town: !!__g.W.z.town}));
}

async function sw(page, n) {
  await page.evaluate(n => {
    __g.openSheet('opts');
    const b = document.querySelector('[data-swslot="' + n + '"]');
    if (!b) throw new Error('no switch button for slot ' + n);
    b.click();
  }, n);
  return dismiss(page);
}

(async () => {
  if (!fs.existsSync(pagePath)) {
    console.error('missing ' + pagePath + ' — run ./build.sh first');
    process.exit(1);
  }
  const browser = await chromium.launch(process.env.PW_CHROMIUM ? {executablePath: process.env.PW_CHROMIUM} : {});
  const page = await browser.newPage({viewport: {width: 390, height: 844}});
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await boot(page);
  ok((await page.evaluate(() => __g.mode)) === 'title', 'title after the disclaimer');
  ok((await begin(page, 'scrapper')) === 'play', 'slot A reaches play');

  await page.evaluate(() => __g.enter(0));
  ok((await dismiss(page, 4000)) === 'play', 'A is in town');
  const aTown = await stand(page, 18.5, 8.5);
  ok(!!aTown, 'A can stand at 18.5, 8.5 in town');

  await page.evaluate(() => { __g.closeSheet(); __g.openSheet('opts'); });
  await page.evaluate(() => document.querySelector('[data-newslot="1"]').click());
  ok((await page.evaluate(() => __g.mode)) === 'title', 'new slot returns to the title');
  ok((await begin(page, 'hacker')) === 'play', 'slot B reaches play');
  await page.evaluate(() => __g.enter(0));
  ok((await dismiss(page, 4000)) === 'play', 'B is in town');
  const bTown = await stand(page, 7.5, 16.5);
  ok(!!bTown && (Math.abs(bTown.x - aTown.x) > 2 || Math.abs(bTown.y - aTown.y) > 2), 'B stands somewhere else in town');

  ok((await sw(page, 0)) === 'play', 'switch B→A reaches play');
  const backA = await here(page);
  ok(same(backA, aTown), 'A is back in town at ' + (backA && backA.x) + ',' + (backA && backA.y) + ' (left ' + aTown.x + ',' + aTown.y + ')');

  ok((await sw(page, 1)) === 'play', 'switch A→B reaches play');
  const backB = await here(page);
  ok(same(backB, bTown), 'B is back in town at ' + (backB && backB.x) + ',' + (backB && backB.y));

  ok((await sw(page, 0)) === 'play', 'switch B→A again');
  ok(same(await here(page), aTown), 'A is still at the square they left');

  await page.evaluate(() => {
    const zi = 1;
    __g.G['in' + zi] = 1;
    const z = __g.ZONES[zi], q = z.su ? z.su.q : z.bq;
    if (q) __g.G.q[q] = 1;
    __g.enter(zi);
    const W = __g.W, N = W.N;
    let spot = null;
    for (let y = 4; y < N - 4 && !spot; y++) for (let x = 4; x < N - 4; x++) {
      if (W.map[y * N + x] === 1 && Math.hypot(x + .5 - W.start.x, y + .5 - W.start.y) > 6) { spot = {x: x + .5, y: y + .5}; break; }
    }
    __g.P.x = spot.x; __g.P.y = spot.y;
    W.decals.push({x: spot.x, y: spot.y, r: .2, a: 0, mark: 'A'});
    window.__aField = {cls: __g.G.cls, zi: W.zi, x: spot.x, y: spot.y};
  });
  ok((await dismiss(page, 4000)) === 'play', 'A is out in a district');
  const aField = await page.evaluate(() => window.__aField);

  ok((await sw(page, 1)) === 'play', 'leaving A’s district loads B');
  ok(same(await here(page), bTown), 'B is still in town, not in A’s district');

  await page.evaluate(() => {
    const zi = 1;
    __g.G['in' + zi] = 1;
    const z = __g.ZONES[zi], q = z.su ? z.su.q : z.bq;
    if (q) __g.G.q[q] = 1;
    __g.enter(zi);
    const W = __g.W, N = W.N;
    let spot = null;
    for (let y = N - 5; y > 4 && !spot; y--) for (let x = N - 5; x > 4; x--) {
      if (W.map[y * N + x] === 1 && Math.hypot(x + .5 - W.start.x, y + .5 - W.start.y) > 6) { spot = {x: x + .5, y: y + .5}; break; }
    }
    __g.P.x = spot.x; __g.P.y = spot.y;
    W.decals.push({x: spot.x, y: spot.y, r: .2, a: 1, mark: 'B'});
    window.__bField = {cls: __g.G.cls, zi: W.zi, x: spot.x, y: spot.y};
  });
  const bField = await page.evaluate(() => window.__bField);
  ok(bField && aField && (Math.abs(bField.x - aField.x) > 1 || Math.abs(bField.y - aField.y) > 1), 'B’s district spot is not A’s');

  ok((await sw(page, 0)) === 'play', 'switch back to A in the district');
  const aBack = await here(page);
  ok(same(aBack, aField), 'A is back in their district at ' + (aBack && aBack.x) + ',' + (aBack && aBack.y));
  const marksA = await page.evaluate(() => ({
    a: __g.W.decals.some(d => d.mark === 'A'),
    b: __g.W.decals.some(d => d.mark === 'B')
  }));
  ok(marksA.a && !marksA.b, 'A’s district still has A’s mark and not B’s');

  ok((await sw(page, 1)) === 'play', 'switch back to B in the district');
  const bBack = await here(page);
  ok(same(bBack, bField), 'B is back in their district at ' + (bBack && bBack.x) + ',' + (bBack && bBack.y));
  const marksB = await page.evaluate(() => ({
    a: __g.W.decals.some(d => d.mark === 'A'),
    b: __g.W.decals.some(d => d.mark === 'B')
  }));
  ok(marksB.b && !marksB.a, 'B’s district still has B’s mark and not A’s');

  ok(!errs.length, errs.length ? 'page errors: ' + errs.slice(0, 3).join(' | ') : 'no page errors');
  await browser.close();
  if (fails.length) {
    console.log(fails.length + ' failed');
    process.exit(1);
  }
  console.log('slot places ok');
})().catch(e => { console.error(e); process.exit(1); });
