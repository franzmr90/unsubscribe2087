/* Standing 1v1 for Acts I–V. No pathing, no stims, no hire.
   Level-matched scrapper, Wrecking Crew, one identified rare in each armor slot.
   Adaptive difficulty off, unless ARENA_DYN=1. Three seeds unless ARENA_SEEDS is set.
   Usage: node tools/arena.js
   Writes notes/arena-sample.json */
const {chromium} = require('playwright');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const htmlPath = path.join(root, 'dist', 'unsubscribe.html');
const outPath = path.join(root, 'notes', 'arena-sample.json');
const cls = process.env.ARENA_CLS || 'scrapper';
const build = process.env.ARENA_BUILD || 'crew';
const seeds = (process.env.ARENA_SEEDS || '1,2,3').split(',').map(Number);
const withDyn = process.env.ARENA_DYN === '1';

/* Anchors from Acts I–II, then the late districts the zone walk never finished. */
const ROWS = [
  {zi: 1, k: 'drone', name: 'Parcel drone'},
  {zi: 1, k: 'drone', champ: 1, name: 'Parcel champ'},
  {zi: 3, k: 'hr', name: 'Fields enforcer'},
  {zi: 5, k: 'mech', name: 'Cathedral mech'},
  {zi: 5, k: 'boss', boss: 1, name: 'Pryce'},
  {zi: 7, k: 'lancer', name: 'Updraft lancer'},
  {zi: 11, k: 'aegis', name: 'Mezzanine aegis'},
  {zi: 11, k: 'boss2', boss: 1, name: 'Vale'},
  {zi: 12, k: 'proxy', name: 'Vestibule proxy'},
  {zi: 14, k: 'director', name: 'Nine Chairs director'},
  {zi: 16, k: 'censor', name: 'Still Water censor'},
  {zi: 16, k: 'boss3', boss: 1, name: 'MANDATE'},
  {zi: 22, k: 'wisher', name: 'Mile wisher'},
  {zi: 22, k: 'companion', name: 'Mile companion'},
  {zi: 24, k: 'ctkr', name: 'Tomari caretaker'},
  {zi: 26, k: 'boss4', boss: 1, name: 'Curator'},
  {zi: 28, k: 'orphan', name: 'Block orphan'},
  {zi: 28, k: 'valid', name: 'Block validator'},
  {zi: 30, k: 'custod', name: 'Vault custodian'},
  {zi: 31, k: 'sniper', name: 'Blocks sniper'},
  {zi: 32, k: 'oracle', name: 'Room oracle'},
  {zi: 32, k: 'boss5', boss: 1, name: 'PROVIDENCE'}
];

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

async function boot(page) {
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
    G.walkNew = 0;
    __g.OPT.noWalk = true;
    __g.OPT.sound = false;
    __g.OPT.music = false;
    __g.OPT.shake = false;
    __g.OPT.fx = 'thin';
  });
  const mode = await dismiss(page);
  if (mode !== 'play') throw new Error('boot stuck in ' + mode);
}

async function arm(page, zi) {
  await page.evaluate(({cls, build, zi}) => {
    const g = __g, G = g.G, L = g.ZONES[zi].lvl;
    G.god = false;
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
    G.sats = 50;
    G.diff = 0;
    G.pp = 0;
    G.walkNew = 0;
    G.act2 = L >= 15;
    G.act3 = L >= 30;
    G.act4 = L >= 45;
    G.act5 = L >= 60;
    G.unlocked = 40;
    g.OPT.dyn = false;
    g.OPT.noWalk = true;
    g.OPT.autoStim = false;
    for (let i = 1; i <= 25; i++) G.q['q' + i] = 3;
    for (let i = 0; i < 40; i++) G['in' + i] = 1;
    g.shapeShift(cls, build);
  }, {cls, build, zi});
  let mode = await dismiss(page);
  if (mode !== 'play') throw new Error('shift stuck in ' + mode + ' zi ' + zi);
  await page.evaluate(zi => { __g.G.merc = null; __g.G.tag = null; __g.enter(zi, {fresh: true}); }, zi);
  mode = await dismiss(page);
  if (mode !== 'play') throw new Error('enter stuck in ' + mode + ' zi ' + zi);
}

async function duel(page, spec) {
  return page.evaluate(spec => {
    const g = __g, G = g.G, W = g.W, P = g.P, rnd0 = Math.random;
    function mulberry32(a) {
      return function () {
        a |= 0; a = a + 0x6D2B79F5 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      };
    }
    Math.random = mulberry32(spec.seed);
    const L = W.ml;
    for (const slot of ['weapon', 'armor', 'helm', 'gloves', 'boots', 'belt']) {
      const it = g.makeItem(L, 2, slot);
      it.id = true;
      G.eq[slot] = it;
    }
    G.eq.ring = null;
    G.eq.amulet = null;
    g.calc();
    const s = g.S;
    const dps = ((s.dmin + s.dmax) / 2 * (1 + (s.dmg || 0) / 100) + (s.shock || 0)) * (1 + Math.max(-50, s.aspd || 0) / 100) * (1 + Math.min(100, s.crit || 0) / 100 * ((s.critM || 2) - 1));
    const ehp = s.maxHp * (1 + (s.armor || 0) / 100) / (1 - Math.min(0.6, (s.dodge || 0) / 100));
    const f = r => { const x = r < 1 ? 1 : 1 + (r - 1) * 0.8; return x < 1 ? 1 : x > 12 ? 12 : x; };
    const dyn = spec.dyn ? {hp: f(dps * 2.4 / (30 * (1 + 0.42 * (L - 1)))), dmg: f(ehp / 16 / (7 * (1 + 0.22 * (L - 1))))} : {hp: 1, dmg: 1};
    W.dyn = dyn;
    G.hp = s.maxHp;
    G.en = s.maxEn;
    G.stims = 0;
    G.god = false;
    g.setMode('play');
    W.ents.length = 0;
    W.projs.length = 0;
    W.allies.length = 0;
    W.fx.length = 0;
    W.drops.length = 0;
    W.merc = null;
    if (spec.tag) {
      const base = (s.dmin + s.dmax) / 2 * (1 + (s.dmg || 0) / 100);
      G.tag = {slot: 9, cls: G.cls, lvl: G.lvl, name: 'Echo', dmg: base, max: s.maxHp, red: 100 / (100 + (s.armor || 0)), sk: [], eq: {}};
      W.tag = {x: P.x - 0.8, y: P.y + 0.7, r: 0.3, hp: s.maxHp, max: s.maxHp, ph: 0, flash: 0, armM: G.tag.red, fx: 1, swing: 0, sc: [], say: '', sayT: 0, tag: 1, dir: {x: 1, y: 0}, walkPh: 0, moving: false, spin: 0, buff: 0, haste: 0, guard: 0, dash: null, stealth: 0, mech: 0, inv: 0, oc: 0, ambT: 0, ambM: 1, crunch: 0, volley: null, cd: [], silence: 0, fm: null, atk: 0, slow: 0, page: 0};
    } else { G.tag = null; W.tag = null; }
    const N = W.N, map = W.map;
    let parked = false;
    for (let y = 3; y < N - 3 && !parked; y++) for (let x = 3; x < N - 3 && !parked; x++) {
      let ok = true;
      for (let j = -2; j <= 2 && ok; j++) for (let i = -2; i <= 2; i++) if (map[(y + j) * N + x + i] !== 1) ok = false;
      if (ok) { P.x = x + 0.5; P.y = y + 0.5; parked = true; }
    }
    const e = g.spawn(spec.k, P.x + 1.15, P.y, spec.champ ? {champ: 1} : {});
    if (!e) { Math.random = rnd0; return {err: 'spawn', name: spec.name}; }
    e.aggro = true;
    e.o1 = e.o2 = e.asked = e.p1 = e.p2 = e.said = 1;
    W.bi = 1;
    if (!spec.boss) e.spd = 0;
    P.inv = 0;
    P.atk = 0;
    P.shr = null;
    const t0 = G.time, hp0 = G.hp, max = e.max;
    let minHp = G.hp, result = 'live';
    const sec = spec.boss ? 12 : 8;
    const steps = Math.round(sec * 30);
    for (let n = 0; n < steps; n++) {
      if (!e.hp || e.hp <= 0 || W.ents.indexOf(e) < 0) { result = 'kill'; break; }
      if (G.hp <= 0 || g.mode === 'dying') { result = 'dead'; break; }
      const dx = P.x - e.x, dy = P.y - e.y, d = Math.hypot(dx, dy) || 1;
      P.x = e.x + dx / d * 1.15;
      P.y = e.y + dy / d * 1.15;
      P.dir = {x: (e.x - P.x), y: (e.y - P.y)};
      const mag = Math.hypot(P.dir.x, P.dir.y) || 1;
      P.dir.x /= mag; P.dir.y /= mag;
      g.setMode('play');
      for (let slot = 0; slot < 3; slot++) {
        const i = G.slots[slot];
        if (i == null || i < 0) continue;
        const sk = g.CLS[G.cls].sk[i];
        if (!sk || !sk.a || P.castWait > 0 || P.cd[i] > 0 || P.dash || P.silence > 0) continue;
        if (G.en < (sk.cost || 0)) continue;
        g.cast(slot);
        break;
      }
      g.keys.Space = true;
      g.update(1 / 30);
      if (G.hp < minHp) minHp = G.hp;
    }
    g.keys.Space = false;
    Math.random = rnd0;
    if (result === 'live' && (!e.hp || e.hp <= 0 || W.ents.indexOf(e) < 0)) result = 'kill';
    if (G.hp <= 0 || g.mode === 'dying') result = 'dead';
    const sim = G.time - t0;
    const ivl = g.CLS[G.cls].ivl, mult = g.CLS[G.cls].mult;
    return {
      name: spec.name, zi: spec.zi, k: spec.k, ml: L, seed: spec.seed, dyn: spec.dyn ? 1 : 0, boss: spec.boss ? 1 : 0, champ: spec.champ ? 1 : 0, tag: spec.tag ? 1 : 0,
      result, sim: Math.round(sim * 100) / 100,
      life: s.maxHp ? Math.max(0, minHp) / s.maxHp : 0,
      mobLeft: max ? Math.max(0, e.hp || 0) / max : 0,
      mobHp: Math.round(max), mobDmg: Math.round(e.dmg),
      hits: e.hits || 0,
      dps: Math.round(dps), ehp: Math.round(ehp), armor: s.armor || 0, maxHp: s.maxHp,
      est: Math.round(dps * mult / ivl),
      dynHp: Math.round(dyn.hp * 100) / 100, dynDmg: Math.round(dyn.dmg * 100) / 100,
      dt: (G.eq.weapon && G.eq.weapon.dt) || 'impact',
      mods: Object.keys(e.mods || {}).join(',') || '-',
      pp: G.pp || 0
    };
  }, spec);
}

function median(xs) {
  const a = xs.slice().sort((p, q) => p - q);
  return a[Math.floor((a.length - 1) / 2)];
}

function pct(x) { return Math.round(x * 100) + '%'; }

async function uniques(page) {
  return page.evaluate(() => {
    const g = __g, G = g.G;
    const late = g.UNI.filter(u => u.il >= 45);
    const SCALED = {dmg: 1, hp: 1, shock: 1, thorns: 1, armor: 1, en: 1, armorP: 1};
    function mulberry32(a) {
      return function () {
        a |= 0; a = a + 0x6D2B79F5 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      };
    }
    function score() {
      const s = g.S;
      const dps = ((s.dmin + s.dmax) / 2 * (1 + (s.dmg || 0) / 100) + (s.shock || 0)) * (1 + Math.max(-50, s.aspd || 0) / 100) * (1 + Math.min(100, s.crit || 0) / 100 * ((s.critM || 2) - 1));
      const ehp = s.maxHp * (1 + (s.armor || 0) / 100) / (1 - Math.min(0.6, (s.dodge || 0) / 100));
      return {dps: Math.round(dps), ehp: Math.round(ehp), hp: s.maxHp, armor: s.armor || 0, dmg: s.dmg || 0, crit: s.crit || 0, aspd: s.aspd || 0};
    }
    function wearRare(slot, il, seed) {
      Math.random = mulberry32(seed);
      const it = g.makeItem(il, 2, slot);
      it.id = true;
      return it;
    }
    function wearMax(u) {
      const it = g.mkFixed(u, u.il, 4);
      it.aff = [];
      for (const k in u.mods) {
        let v = u.mods[k][1];
        if (SCALED[k]) v = Math.round(v * (1 + (it.il - u.il) * 0.04));
        it.aff.push({k, v});
      }
      it.id = true;
      return it;
    }
    Math.random = mulberry32(7);
    for (const slot of ['weapon', 'armor', 'helm', 'gloves', 'boots', 'belt', 'ring', 'amulet']) {
      const it = g.makeItem(72, 2, slot);
      it.id = true;
      G.eq[slot] = it;
    }
    g.calc();
    const base = score();
    const rows = [];
    for (const u of late) {
      const saved = G.eq[u.slot];
      G.eq[u.slot] = wearRare(u.slot, u.il, 11);
      g.calc();
      const rare = score();
      G.eq[u.slot] = wearMax(u);
      g.calc();
      const uni = score();
      let first = null, second = null, forced = null;
      if (u.id === 'tenmin' || u.id === 'e82') {
        G.tag = null; g.W.tag = null; g.W.ents.length = 0; g.W.dyn = {hp: 1, dmg: 1};
        const e1 = g.spawn('valid', g.P.x + 1.2, g.P.y);
        g.S.crit = 0; g.P.e82 = u.id === 'e82' ? 3 : 0;
        const h1 = e1.hp; g.hit(e1, g.CLS.scrapper.mult); first = Math.round(h1 - e1.hp);
        const h2 = e1.hp; g.hit(e1, g.CLS.scrapper.mult); second = Math.round(h2 - e1.hp);
        if (u.id === 'e82') {
          g.W.ents.length = 0;
          G.eq[u.slot] = wearRare(u.slot, u.il, 11);
          g.calc();
          const e2 = g.spawn('valid', g.P.x + 1.2, g.P.y);
          g.S.crit = 0; g.P.e82 = 0;
          const h3 = e2.hp; g.hit(e2, g.CLS.scrapper.mult); forced = Math.round(h3 - e2.hp);
        }
        G.eq[u.slot] = wearMax(u);
        g.calc();
      }
      rows.push({
        id: u.id, n: u.n, slot: u.slot, il: u.il, sp: u.sp || '',
        rare, uni,
        dps: rare.dps ? Math.round((uni.dps / rare.dps - 1) * 100) : 0,
        ehp: rare.ehp ? Math.round((uni.ehp / rare.ehp - 1) * 100) : 0,
        first, second, forced
      });
      G.eq[u.slot] = saved;
    }
    g.calc();
    return {base, rows};
  });
}

(async () => {
  const browser = await chromium.launch(launchOpts());
  const page = await browser.newPage({viewport: {width: 390, height: 844}});
  const fights = [];
  const pressure = [];
  try {
    await boot(page);
    let armed = -1;
    for (const row of ROWS) {
      if (armed !== row.zi) { await arm(page, row.zi); armed = row.zi; }
      for (const seed of seeds) {
        const spec = Object.assign({seed, dyn: false, tag: false}, row);
        const r = await duel(page, spec);
        fights.push(r);
        console.error([r.name, 's' + seed, r.result, r.sim + 's', 'life ' + pct(r.life || 0), 'left ' + pct(r.mobLeft || 0), 'hp ' + r.mobHp, 'dmg ' + r.mobDmg, r.dt, r.mods].join('  '));
      }
    }
    if (withDyn) {
      for (const row of ROWS.filter(r => r.boss || r.k === 'sniper' || r.k === 'proxy' || r.k === 'drone')) {
        await arm(page, row.zi);
        const r = await duel(page, Object.assign({seed: 1, dyn: true, tag: false}, row));
        fights.push(r);
        console.error(['dyn', r.name, r.result, r.sim + 's', 'life ' + pct(r.life || 0), 'left ' + pct(r.mobLeft || 0), 'dynHp ' + r.dynHp, 'dynDmg ' + r.dynDmg].join('  '));
      }
    }
    for (const row of [{zi: 1, k: 'drone', name: 'pressure drone'}, {zi: 31, k: 'sniper', name: 'pressure sniper'}, {zi: 5, k: 'mech', name: 'pressure mech'}]) {
      await arm(page, row.zi);
      await page.evaluate(() => { __g.G.pp = 0; });
      const ttks = [];
      for (let i = 0; i < 10; i++) {
        const r = await duel(page, Object.assign({seed: 20 + i, dyn: false, tag: true, champ: 0, boss: 0}, row));
        pressure.push(r);
        ttks.push(r.sim);
        console.error(['pp', r.name, i, r.result, r.sim + 's', 'pp ' + r.pp].join('  '));
      }
    }
    await arm(page, 32);
    const uni = await uniques(page);
    const summary = [];
    const names = [];
    for (const r of fights) if (r.dyn === 0 && !names.includes(r.name)) names.push(r.name);
    for (const name of names) {
      const xs = fights.filter(r => r.name === name && r.dyn === 0 && !r.err);
      const kills = xs.filter(r => r.result === 'kill');
      const dead = xs.filter(r => r.result === 'dead');
      summary.push({
        name, ml: xs[0].ml, k: xs[0].k, boss: xs[0].boss, n: xs.length,
        kill: kills.length, dead: dead.length,
        ttk: kills.length ? Math.round(median(kills.map(r => r.sim)) * 100) / 100 : null,
        life: Math.round(median(xs.map(r => r.life)) * 100),
        left: Math.round(median(xs.map(r => r.mobLeft)) * 100),
        mobHp: median(xs.map(r => r.mobHp)),
        mobDmg: median(xs.map(r => r.mobDmg)),
        est: median(xs.map(r => r.est)),
        ehp: median(xs.map(r => r.ehp)),
        armor: median(xs.map(r => r.armor)),
        maxHp: median(xs.map(r => r.maxHp))
      });
    }
    const ppSum = [];
    for (const name of ['pressure drone', 'pressure mech', 'pressure sniper']) {
      const xs = pressure.filter(r => r.name === name && !r.err);
      if (!xs.length) continue;
      ppSum.push({
        name, n: xs.length,
        ttk: Math.round(median(xs.map(r => r.sim)) * 100) / 100,
        dead: xs.filter(r => r.result === 'dead').length,
        pp: xs[xs.length - 1].pp
      });
    }
    const out = {cls, build, seeds, summary, ppSum, uniques: uni, fights, pressure};
    fs.mkdirSync(path.dirname(outPath), {recursive: true});
    fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
    console.log(JSON.stringify({summary, ppSum, uniques: uni.rows.map(r => ({id: r.id, slot: r.slot, dps: r.dps, ehp: r.ehp, first: r.first, second: r.second, forced: r.forced}))}, null, 2));
  } finally {
    await browser.close();
  }
})().catch(e => { console.error(e); process.exit(1); });
