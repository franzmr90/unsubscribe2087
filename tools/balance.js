/* Measures Acts III–V. Does not change any combat number.
   One sample of the random gear and the random fight. Adaptive difficulty stays on.
   Usage: node tools/balance.js
   Writes notes/balance-acts-3-5.md */
const {chromium} = require('playwright');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const htmlPath = path.join(root, 'dist', 'unsubscribe.html');
const outPath = path.join(root, 'notes', 'balance-acts-3-5.md');

const TRASH = [12, 13, 14, 15, 22, 23, 24, 25, 28, 29, 30, 31];
const BOSSES = [16, 26, 32];
const RUNS = [{cls: 'scrapper', build: 'crew', zones: TRASH.concat(BOSSES)}];
RUNS.push({cls: 'hacker', build: 'chain', zones: BOSSES.slice()});
if (process.env.BAL_ONLY) {
  RUNS.length = 0;
  RUNS.push({cls: process.env.BAL_CLS || 'scrapper', build: process.env.BAL_BUILD || 'crew', zones: process.env.BAL_ONLY.split(',').map(Number)});
}

function launchOpts() {
  return process.env.PW_CHROMIUM ? {executablePath: process.env.PW_CHROMIUM} : {};
}

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
      if (window.__g && (__g.mode === 'play' || __g.mode === 'dying')) return __g.mode;
      return window.__g ? __g.mode : 'boot';
    });
    if (s === 'play' || s === 'dying') return s;
    await page.waitForTimeout(s === 'locked' ? 250 : 80);
  }
  return 'timeout';
}

async function boot(page, cls) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  await page.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">' + html + '</body></html>');
  await page.waitForFunction(() => window.__g && __g.skipDisc);
  await page.evaluate(() => __g.skipDisc());
  await page.waitForTimeout(200);
  await page.click('[data-cls=' + cls + ']');
  await page.evaluate(() => {
    const G = __g.G;
    G.pre = 2;
    G.seenIntro = false;
    G.preSeen = 1;
  });
  const mode = await dismiss(page);
  if (mode !== 'play') throw new Error('boot stuck in ' + mode);
}

/* Level-matched rare gear, one named build, no uniques, no hire.
   Adaptive difficulty is left at its default (on). */
async function prepare(page, cls, build, zi) {
  await page.evaluate(({cls, build, zi}) => {
    const g = __g, G = g.G, L = g.ZONES[zi].lvl;
    G.god = false;
    G.merc = null;
    G.lvl = L;
    G.xp = 0;
    G.sp = L - 1;
    G.ap = (L - 1) * 5;
    G.sk = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    G.at = {mgt: 0, ref: 0, vit: 0, bnd: 0};
    G.pas = null;
    G.web = {};
    G.fork = {};
    G.sats = 50;
    G.act2 = L >= 15;
    G.act3 = L >= 30;
    G.act4 = L >= 45;
    G.act5 = L >= 60;
    G.unlocked = 40;
    for (let i = 1; i <= 25; i++) G.q['q' + i] = 3;
    for (let i = 0; i < 40; i++) G['in' + i] = 1;
    g.shapeShift(cls, build);
  }, {cls, build, zi});
  const mode = await dismiss(page);
  if (mode !== 'play') return mode;
  await page.evaluate(zi => {
    const g = __g, G = g.G, L = g.ZONES[zi].lvl;
    for (const slot of ['weapon', 'armor', 'helm', 'gloves', 'boots', 'belt']) {
      const it = g.makeItem(L, 2, slot);
      it.id = true;
      G.eq[slot] = it;
    }
    g.calc();
    G.hp = g.S.maxHp;
    G.en = g.S.maxEn;
    G.stims = g.S.cap;
    window.__stims = 0;
    g.enter(zi);
  }, zi);
  return dismiss(page);
}

async function fight(page, boss) {
  const cap = boss ? 75 : 40;
  const wall = 90000;
  const t0 = Date.now();
  const snap0 = await page.evaluate(() => ({
    time: __g.G.time,
    stims: __g.G.stims,
    started: __g.W.ents.filter(e => e.hp > 0).length,
    boss: __g.W.boss ? __g.W.boss.max : 0
  }));
  let mark = null;
  let result = 'timeout';
  let last = snap0;
  while (Date.now() - t0 < wall) {
    last = await page.evaluate(() => {
      const g = __g;
      const clear = () => { for (const c of ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space']) g.keys[c] = false; };
      const foes = () => g.W.ents.filter(e => e.hp > 0 && !e.mp);
      /* Next floor tile toward the nearest machine. A straight line walks into walls. */
      const stepToward = (tx, ty) => {
        const N = g.W.N, map = g.W.map, sx = g.P.x | 0, sy = g.P.y | 0;
        const floor = (x, y) => x > 0 && y > 0 && x < N - 1 && y < N - 1 && map[y * N + x] === 1;
        if (sx === (tx | 0) && sy === (ty | 0)) return {x: tx, y: ty};
        const prev = new Int32Array(N * N);
        prev.fill(-2);
        const q = [sx, sy];
        prev[sy * N + sx] = -1;
        for (let qi = 0; qi < q.length; qi += 2) {
          const x = q[qi], y = q[qi + 1];
          if (Math.abs(x - (tx | 0)) <= 1 && Math.abs(y - (ty | 0)) <= 1) {
            const startKey = sy * N + sx;
            let cur = y * N + x;
            while (prev[cur] !== startKey && prev[cur] !== -1) cur = prev[cur];
            return {x: (cur % N) + .5, y: ((cur / N) | 0) + .5};
          }
          for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const nx = x + dx, ny = y + dy, k = ny * N + nx;
            if (prev[k] !== -2 || !floor(nx, ny)) continue;
            prev[k] = y * N + x;
            q.push(nx, ny);
          }
        }
        return null;
      };
      const steer = () => {
        clear();
        if (g.mode !== 'play' || !g.W || !g.P) return;
        let best = null, bd = 1e9;
        for (const e of foes()) {
          const d = Math.hypot(e.x - g.P.x, e.y - g.P.y);
          if (d < bd) { bd = d; best = e; }
        }
        const melee = g.CLS[g.G.cls].melee;
        const want = melee ? 1.45 : 4;
        if (best) g.P.dir = {x: (best.x - g.P.x) / (bd || 1), y: (best.y - g.P.y) / (bd || 1)};
        if (best && bd > want) {
          const step = stepToward(best.x, best.y) || best;
          const dx = step.x - g.P.x, dy = step.y - g.P.y, d = Math.hypot(dx, dy) || 1;
          const sp = Math.min(d, g.CLS[g.G.cls].spd / 30);
          const nx = g.P.x + dx / d * sp, ny = g.P.y + dy / d * sp;
          const N = g.W.N, map = g.W.map;
          const floor = (x, y) => { const ix = x | 0, iy = y | 0; return ix > 0 && iy > 0 && ix < N - 1 && iy < N - 1 && map[iy * N + ix] === 1; };
          if (floor(nx, g.P.y)) g.P.x = nx;
          if (floor(g.P.x, ny)) g.P.y = ny;
          g.P.moving = true;
        }
        if (best && bd < (melee ? 2.4 : 6.5)) g.keys.Space = true;
        if (g.G.hp < g.S.maxHp * 0.45 && g.G.stims > 0) {
          const before = g.G.stims;
          g.stim();
          if (g.G.stims < before) window.__stims = (window.__stims || 0) + 1;
        }
        g.cast(0);
      };
      for (let i = 0; i < 12; i++) {
        if (g.mode !== 'play') break;
        steer();
        g.update(1 / 30);
      }
      clear();
      const living = g.W.ents.filter(e => e.hp > 0 && !e.mp);
      return {
        mode: g.mode,
        time: g.G.time,
        hp: g.S.maxHp ? g.G.hp / g.S.maxHp : 0,
        x: g.P.x, y: g.P.y,
        kills: g.G.kills,
        left: living.length,
        bossHp: g.W.boss ? Math.max(0, g.W.boss.hp) / g.W.boss.max : null,
        stims: window.__stims || 0
      };
    });
    if (last.mode === 'dying' || last.hp <= 0) { result = 'died'; break; }
    if (last.mode !== 'play') {
      const back = await dismiss(page, 12000);
      if (back === 'dying') { result = 'died'; break; }
      if (back !== 'play') { result = 'stuck'; break; }
      continue;
    }
    if (last.left === 0 || (boss && last.bossHp === 0)) { result = 'cleared'; break; }
    const sim = last.time - snap0.time;
    if (!mark) mark = {t: last.time, x: last.x, y: last.y, k: last.kills};
    else if (Math.hypot(last.x - mark.x, last.y - mark.y) > 0.6 || last.kills > mark.k) mark = {t: last.time, x: last.x, y: last.y, k: last.kills};
    else if (last.time - mark.t > 8) { result = 'stuck'; break; }
    if (sim >= cap) { result = 'timeout'; break; }
  }
  if (Date.now() - t0 >= wall && result === 'timeout') result = 'timeout';
  return {
    result,
    sim: Math.round((last.time - snap0.time) * 10) / 10,
    hp: Math.round(last.hp * 100),
    stims: last.stims,
    left: last.left,
    started: snap0.started,
    boss: last.bossHp == null ? '' : Math.round(last.bossHp * 100) + '%'
  };
}

function row(zname, cls, build, r) {
  return `| ${zname} | ${cls} ${build} | ${r.result} | ${r.sim} | ${r.hp}% | ${r.stims} | ${r.left}/${r.started} | ${r.boss || '—'} |`;
}

(async () => {
  if (!fs.existsSync(htmlPath)) {
    console.error('missing ' + htmlPath + ' — run npm run build first');
    process.exit(1);
  }
  const lines = [];
  const browser = await chromium.launch(launchOpts());
  const page = await browser.newPage({viewport: {width: 390, height: 800}});
  page.on('pageerror', e => console.log('pageerror', e.message));
  let booted = null;
  for (const run of RUNS) {
    if (booted !== run.cls) {
      await boot(page, run.cls);
      booted = run.cls;
    }
    const order = run.zones.slice().sort((a, b) => a - b);
    for (const zi of order) {
      const boss = BOSSES.indexOf(zi) >= 0;
      const mode = await prepare(page, run.cls, run.build, zi);
      const name = await page.evaluate(zi => __g.ZONES[zi].n + ' (lvl ' + __g.ZONES[zi].lvl + ')', zi);
      let r;
      if (mode !== 'play') r = {result: 'stuck', sim: 0, hp: 0, stims: 0, left: '?', started: '?', boss: ''};
      else r = await fight(page, boss);
      const line = row(name, run.cls, run.build, r);
      console.log(line);
      lines.push(line);
      if (await page.evaluate(() => __g.mode) === 'dying') {
        await boot(page, run.cls);
      }
    }
  }
  await browser.close();
  const body = [
    '# Acts III–V measurement',
    '',
    'One sample. The bot rolled one set of rare items per district and fought once. Nothing in `src/` was changed.',
    '',
    'Protocol: level matched to the district, identified rare weapon, armor, helm, gloves, boots and belt, no uniques, no hire. Scrapper on the Wrecking Crew build for every district below. Technomancer on Chain Reaction for the three bosses only. Adaptive difficulty left on (the default). The bot steps along open floor tiles toward the nearest machine, holds attack in range, stims below 45% life, and casts the first skill button when it is ready. Dialog buttons are polled until they enable. Scenes are skipped. Boss and lieutenant title cards are ended through the test hook. Sim time is `G.time`. A fight stops when the district is empty, the hero dies, the hero has not moved and has not had a kill for 8 sim seconds, or the cap is hit (40 sim seconds in a district, 75 on a boss, 90 seconds of wall clock). Stuck with life still high means the bot lost the path, not that the district killed it.',
    '',
    '| District | Build | Result | Sim s | Life left | Stims | Enemies left/at start | Boss life |',
    '|---|---|---|---:|---:|---:|---:|---:|',
    ...lines,
    ''
  ].join('\n');
  fs.mkdirSync(path.dirname(outPath), {recursive: true});
  fs.writeFileSync(outPath, body);
  console.log('wrote ' + outPath);
})().catch(e => { console.error(e); process.exit(1); });
