/* Measures Acts III–V after the balance pass.
   Default: one pack fight per class, per district, on Normal, Hard, and Brutal.
   BAL_WALK=1 keeps the older full-district walker.
   BAL_CLASS, BAL_ZONE, BAL_DIFF filter the sample. BAL_OUT redirects the notes file.
   Usage: node tools/balance.js
   Writes notes/balance-acts-3-5.md */
const {chromium} = require('playwright');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const htmlPath = path.join(root, 'dist', 'unsubscribe.html');
const outPath = process.env.BAL_OUT || path.join(root, 'notes', 'balance-acts-3-5.md');

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

/* One pack per district, every class, Normal / Hard / Brutal.
   Gear is identified rares at the district level, so it sits in the same
   item band a drop from that district would. Caps stay the live ones. */
const PACK_CLASSES = [
  ['scrapper', 'crew'], ['hacker', 'chain'], ['courier', 'rush'], ['anon', 'demo'],
  ['founder', 'head'], ['homesteader', 'bed'], ['witness', 'page'], ['maxi', 'orange']
];
const PACK_ZONES = [12, 13, 14, 15, 16, 22, 23, 24, 25, 26, 28, 29, 30, 31, 32];
const PACK_DIFF = [0, 1, 2];
const BAL_CLASS = process.env.BAL_CLASS ? process.env.BAL_CLASS.split(',') : null;
const BAL_ZONE = process.env.BAL_ZONE ? process.env.BAL_ZONE.split(',').map(Number) : null;
const BAL_DIFF = process.env.BAL_DIFF ? process.env.BAL_DIFF.split(',').map(Number) : null;

async function arm(page, cls, build, zi) {
  await page.evaluate(({cls, build, zi}) => {
    const g = __g, G = g.G, L = g.ZONES[zi].lvl;
    G.god = false;
    G.hc = false;
    G.merc = null;
    G.tag = null;
    G.lvl = L;
    G.xp = 0;
    G.sp = L - 1;
    G.ap = (L - 1) * 5;
    G.sk = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    G.at = {mgt: 0, ref: 0, vit: 0, bnd: 0};
    G.pas = null;
    G.web = {};
    G.fork = {};
    G.doc = null;
    G.sats = 80;
    G.act2 = L >= 15;
    G.act3 = L >= 30;
    G.act4 = L >= 45;
    G.act5 = L >= 60;
    G.unlocked = 40;
    G.tier = 0;
    G.ez = {};
    G.dz = {};
    G.adapt = 0;
    for (let i = 1; i <= 25; i++) G.q['q' + i] = 3;
    g.setMode('play');
    if (g.W && g.W.zi !== 0) g.enter(0);
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
    G.eq.ring = null;
    G.eq.amulet = null;
    g.calc();
    G.hp = g.S.maxHp;
    G.en = g.S.maxEn;
    G.stims = 6;
  }, zi);
  return 'play';
}

async function packFight(page, zi, diff) {
  await page.evaluate(({zi, diff}) => {
    const g = __g, G = g.G;
    G.diff = diff;
    G.ez = {};
    G.dz = {};
    G.adapt = 0;
    G.god = false;
    G.hp = g.S.maxHp;
    g.setMode('play');
    g.enter(zi, {fresh: true});
  }, {zi, diff});
  const mode = await dismiss(page);
  if (mode !== 'play') return {err: mode};
  return page.evaluate(zi => {
    const g = __g, G = g.G, P = g.P, W = g.W;
    const boss = !!(W.z && W.z.boss);
    W.ents = W.ents.filter(e => e.mp);
    W.projs = [];
    W.fx = [];
    P.inv = 0;
    P.barrier = 0;
    G.god = false;
    G.hp = g.S.maxHp;
    G.en = g.S.maxEn;
    G.stims = 6;
    g.setMode('play');
    W.bi = 1;
    const kind = boss ? (W.z.bossK || 'boss') : ((W.z.mix || []).map(m => m[0]).find(k => k !== 'tick') || 'bot');
    const spawned = [];
    const n = boss ? 1 : 5;
    for (let i = 0; i < n; i++) {
      const e = g.spawn(kind, P.x + 0.7, P.y + (i - 2) * 0.2, boss ? {} : {});
      if (e) { e.aggro = true; spawned.push(e); }
    }
    if (g.ltEnd) g.ltEnd();
    g.setMode('play');
    P.inv = 0;
    const hp0 = spawned.reduce((a, e) => a + (e.max || 0), 0);
    const life0 = G.hp, t0 = G.time, stim0 = G.stims;
    const cap = boss ? 25 : 16;
    let died = 0, steps = 0;
    const melee = g.CLS[G.cls].melee || (G.cls === 'homesteader' && G.form);
    for (; steps < cap * 30; steps++) {
      if (G.hp <= 0 || g.mode === 'dying') { died = 1; break; }
      if (g.mode !== 'play') {
        const sc = document.getElementById('scene');
        if (sc && !sc.hidden) { const k = document.getElementById('scSkip'); if (k) k.click(); }
        const dg = document.getElementById('dlg');
        if (dg && !dg.hidden) { const x = dg.querySelector('#dBtns button:not([disabled])'); if (x) x.click(); }
        if (g.mode === 'intro' && g.ltEnd) g.ltEnd();
        if (g.mode !== 'play' && g.mode !== 'dying' && G.hp > 0) g.setMode('play');
      }
      let best = null, bd = 1e9;
      for (const e of W.ents) {
        if (e.hp > 0 && !e.mp) {
          const d = Math.hypot(e.x - P.x, e.y - P.y);
          if (d < bd) { bd = d; best = e; }
        }
      }
      if (!best) break;
      P.dir = {x: (best.x - P.x) / (bd || 1), y: (best.y - P.y) / (bd || 1)};
      const want = melee ? 1.5 : 4.2;
      if (bd > want) {
        const sp = Math.min(bd - want, (g.CLS[G.cls].spd || 4) / 28);
        const nx = P.x + P.dir.x * sp, ny = P.y + P.dir.y * sp;
        const N = W.N, floor = (x, y) => { const ix = x | 0, iy = y | 0; return ix > 0 && iy > 0 && ix < N - 1 && iy < N - 1 && W.map[iy * N + ix] === 1; };
        if (floor(nx, P.y)) P.x = nx;
        if (floor(P.x, ny)) P.y = ny;
      }
      if (bd < (melee ? 2.5 : 6.6)) g.keys.Space = true;
      else g.keys.Space = false;
      if (G.hp < g.S.maxHp * 0.5 && G.stims > 0) g.stim();
      g.cast(0);
      g.update(1 / 30);
      g.keys.Space = false;
    }
    if (G.hp <= 0 || g.mode === 'dying') died = 1;
    const stims = Math.max(0, stim0 - G.stims);
    const taken = Math.max(0, life0 - Math.max(0, G.hp)) + stims * g.S.maxHp * 0.45;
    const left = W.ents.filter(e => e.hp > 0 && !e.mp).length;
    const ml = W.ml;
    let pool = 0;
    try { pool = g.UNI.filter(u => g.uniqEligible(u, ml)).length; } catch (e) {}
    g.setMode('play');
    G.hp = Math.max(1, G.hp);
    return {
      ttk: Math.round((G.time - t0) * 10) / 10,
      taken: Math.round(taken),
      died, left, n: spawned.length,
      packHp: Math.round(hp0),
      ml, kind, boss: boss ? 1 : 0,
      pool, dyn: W.dyn ? Math.round(W.dyn.hp * 100) / 100 : 1,
      pdr: g.S.pdr || 0,
      res: g.resPen ? g.resPen() : 0
    };
  }, zi);
}

async function runWalk() {
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
      if (await page.evaluate(() => __g.mode) === 'dying') await boot(page, run.cls);
    }
  }
  await browser.close();
  const body = [
    '# Acts III–V measurement',
    '',
    'District walker (BAL_WALK=1). One sample. Nothing in `src/` was changed.',
    '',
    '| District | Build | Result | Sim s | Life left | Stims | Enemies left/at start | Boss life |',
    '|---|---|---|---:|---:|---:|---:|---:|',
    ...lines,
    ''
  ].join('\n');
  fs.mkdirSync(path.dirname(outPath), {recursive: true});
  fs.writeFileSync(outPath, body);
  console.log('wrote ' + outPath);
}

async function runPack() {
  const browser = await chromium.launch(launchOpts());
  const page = await browser.newPage({viewport: {width: 390, height: 800}});
  page.on('pageerror', e => console.log('pageerror', e.message));
  await boot(page, 'scrapper');
  const caps = await page.evaluate(() => {
    const g = __g, G = g.G, P = g.P;
    G.diff = 2; G.god = false; P.inv = 0; P.barrier = 0; G.eq = {weapon: null, helm: null, armor: null, gloves: null, boots: null, belt: null, ring: null, amulet: null};
    g.calc();
    g.S.armor = 0; g.S.dodge = 0; g.S.taken = 1; g.S.pdr = 0; g.S.enc = 0;
    for (const k of ['impact', 'surge', 'rust', 'heat', 'noise']) g.S['r_' + k] = 0;
    const hit = pdr => { g.S.pdr = pdr; G.hp = 1000; P.inv = 0; g.setMode('play'); g.hurt(200, false, {dty: 'impact', name: 'measure', pvp: 1, hp: 1, mods: {}}); return Math.round(1000 - G.hp); };
    const out = {pdr0: hit(0), pdr40: hit(40), pdr80: hit(80), res: g.resPen(), cdr: g.S.cdr};
    const bands = {};
    for (const ml of [12, 27, 36, 42, 48, 57, 60, 70]) bands[ml] = g.UNI.filter(u => g.uniqEligible(u, ml)).length;
    out.bands = bands;
    return out;
  });
  console.log('caps', JSON.stringify(caps));
  const lines = [];
  const names = {};
  for (const [cls, build] of PACK_CLASSES) {
    if (BAL_CLASS && !BAL_CLASS.includes(cls)) continue;
    for (const zi of PACK_ZONES) {
      if (BAL_ZONE && !BAL_ZONE.includes(zi)) continue;
      const mode = await arm(page, cls, build, zi);
      if (!names[zi]) names[zi] = await page.evaluate(zi => __g.ZONES[zi].n + ' ' + __g.ZONES[zi].lvl, zi);
      for (const diff of PACK_DIFF) {
        if (BAL_DIFF && !BAL_DIFF.includes(diff)) continue;
        let r;
        if (mode !== 'play') r = {err: mode};
        else r = await packFight(page, zi, diff);
        const dn = ['Normal', 'Hard', 'Brutal'][diff];
        const line = r.err
          ? `| ${names[zi]} | ${cls} | ${dn} | ERR ${r.err} | | | | | |`
          : `| ${names[zi]} | ${cls} | ${dn} | ${r.ttk} | ${r.taken} | ${r.died} | ${r.left}/${r.n} | ${r.packHp} | ${r.kind} | ${r.pool} |`;
        console.log(line);
        lines.push({zi, cls, build, diff, name: names[zi], r, line});
        if (await page.evaluate(() => __g.mode) === 'dying') {
          await page.evaluate(() => { __g.setMode('play'); __g.G.hp = __g.S.maxHp; });
        }
      }
    }
  }
  await browser.close();
  const concern = [];
  const by = (pred) => lines.filter(x => x.r && !x.r.err && pred(x));
  const deadN = by(x => x.diff === 0 && x.r.died);
  if (deadN.length) concern.push('Died to the Normal pack: ' + deadN.map(x => x.cls + ' in ' + x.name + ' (' + x.r.ttk + 's, ' + x.r.taken + ' taken)').join('; ') + '.');
  const deadB = by(x => x.diff === 2 && x.r.died);
  if (deadB.length) concern.push('Died to the Brutal pack: ' + deadB.map(x => x.cls + ' in ' + x.name).join('; ') + '.');
  const slow = by(x => x.diff === 0 && !x.r.boss && x.r.ttk >= 14 && !x.r.died).sort((a, b) => b.r.ttk - a.r.ttk).slice(0, 5);
  if (slow.length) concern.push('Slowest Normal trash clears still up at the cap: ' + slow.map(x => x.cls + ' ' + x.name + ' ' + x.r.ttk + 's, ' + x.r.left + ' left').join('; ') + '.');
  const fast = by(x => x.diff === 2 && x.r.boss && x.r.ttk > 0 && x.r.ttk < 4 && !x.r.died);
  if (fast.length) concern.push('Brutal bosses falling in under 4s: ' + fast.map(x => x.cls + ' ' + x.name + ' ' + x.r.ttk + 's').join('; ') + '.');
  const ratios = [];
  for (const [cls] of PACK_CLASSES) {
    for (const zi of PACK_ZONES) {
      const n = lines.find(x => x.cls === cls && x.zi === zi && x.diff === 0);
      const b = lines.find(x => x.cls === cls && x.zi === zi && x.diff === 2);
      if (!n || !b || n.r.err || b.r.err || !(n.r.ttk > 0)) continue;
      ratios.push({cls, name: n.name, ratio: b.r.ttk / n.r.ttk, bn: n.r.ttk, bb: b.r.ttk, died: b.r.died});
    }
  }
  ratios.sort((a, b) => b.ratio - a.ratio);
  if (ratios.length) concern.push('Largest Brutal/Normal time ratio: ' + ratios.slice(0, 4).map(x => x.cls + ' ' + x.name + ' ' + x.bn + 's → ' + x.bb + 's (×' + x.ratio.toFixed(1) + (x.died ? ', died' : '') + ')').join('; ') + '.');
  const body = [
    '# Acts III–V measurement',
    '',
    'Pack fights. One sample each. This run is after the Act III–V balance pass.',
    '',
    'Protocol: level matched to the district, the class build named below, identified rare weapon, armor, helm, gloves, boots and belt rolled at that level, no uniques, no hire. Adaptive scaling left on, then reset before each fight so an earlier death does not ease the next one. Trash districts spawn 5 ordinary machines of that district\'s first non-tick kind, on top of the hero. Boss districts spawn the act boss alone. The hero stims under half life (6 stims), casts the first skill button, and steps toward the pack. Sim time is `G.time`. Cap 16s on a pack and 25s on a boss. Damage taken is life lost plus 45% of max life per stim. Died is 1 if the hero fell. Unique pool is how many non-boss uniques `uniqEligible` allows at that machine level (the new bands).',
    '',
    'Caps, measured on a naked Brutal hero, armor 0, resists 0, one impact hit of 200 that ignores the player-damage quarter. The Brutal resist cut is ' + caps.res + ', so a 0 resist becomes −50 and the hit lands at 1.5× before physical reduction: pdr 0 removed ' + caps.pdr0 + ', pdr 40 removed ' + caps.pdr40 + ', pdr 80 removed ' + caps.pdr80 + ' (the 50% cap). Unique pool sizes by monster level: ' + Object.keys(caps.bands).map(ml => ml + '→' + caps.bands[ml]).join(', ') + '. Left counts living machines when the clock stops, including anything the pack summoned.',
    '',
    '| District | Class | Difficulty | Seconds | Damage taken | Died | Left | Pack life | Kind | Unique pool |',
    '|---|---|---|---:|---:|---:|---:|---:|---|---:|',
    ...lines.map(x => x.line),
    '',
    '## Concerns a reader should check',
    '',
    ...concern.map(c => '- ' + c),
    ''
  ].join('\n');
  fs.mkdirSync(path.dirname(outPath), {recursive: true});
  fs.writeFileSync(outPath, body);
  console.log('wrote ' + outPath);
  console.log('CONCERNS');
  concern.forEach(c => console.log('- ' + c));
}

(async () => {
  if (!fs.existsSync(htmlPath)) {
    console.error('missing ' + htmlPath + ' — run npm run build first');
    process.exit(1);
  }
  if (process.env.BAL_WALK) await runWalk();
  else await runPack();
})().catch(e => { console.error(e); process.exit(1); });
