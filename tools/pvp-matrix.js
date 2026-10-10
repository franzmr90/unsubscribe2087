/* Eight classes, three levels, named builds, identified rares, resists at the cap.
   Damage is the swing the client would send, then the server's 0.25 scale and
   landed cap, then the defender's own hurt() with the crit flag.
   node tools/pvp-matrix.js
   Writes notes/pvp-matrix.json */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const htmlPath = path.join(root, 'dist', 'unsubscribe.html');
const outPath = path.join(root, 'notes', 'pvp-matrix.json');

const ROWS = [
  ['maxi', 'orange'],
  ['scrapper', 'crew'],
  ['hacker', 'chain'],
  ['courier', 'rush'],
  ['anon', 'demo'],
  ['founder', 'head'],
  ['homesteader', 'bed'],
  ['witness', 'page']
];
const LEVELS = [30, 60, 90];
const SEEDS = 8;
const SWINGS = 24;

function launchOpts() {
  return process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {};
}

async function clearUI(p) {
  for (let i = 0; i < 24; i++) {
    const st = await p.evaluate(() => {
      const s = document.getElementById('scene');
      if (s && !s.hidden) { const k = document.getElementById('scSkip'); if (k) k.click(); return 'scene'; }
      const d = document.getElementById('dlg');
      if (d && !d.hidden) { const x = d.querySelector('#dBtns button:not([disabled])'); if (x) { x.click(); return 'dlg'; } return 'locked'; }
      if (window.__g && __g.mode === 'intro' && __g.ltEnd) { __g.ltEnd(); return 'intro'; }
      return 'clear';
    });
    if (st === 'clear') return;
    await p.waitForTimeout(st === 'locked' ? 350 : 120);
  }
  throw new Error('overlays did not clear');
}

(async () => {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const browser = await chromium.launch(launchOpts());
  const page = await browser.newPage({ viewport: { width: 1100, height: 700 } });
  await page.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">' + html + '</body></html>');
  await page.waitForFunction(() => window.__g && __g.skipDisc);
  await page.evaluate(() => __g.skipDisc());
  await page.waitForTimeout(120);
  await page.click('[data-cls=scrapper]');
  await page.evaluate(() => { const G = __g.G; G.pre = 2; G.seenIntro = false; __g.OPT.sound = false; __g.OPT.music = false; __g.OPT.shake = false; __g.OPT.auto = false; });
  await clearUI(page);
  await page.evaluate(() => { __g.ACC.maxi = 1; __g.enter(1, { fresh: true }); __g.setMode('play'); });

  const report = await page.evaluate(({ ROWS, LEVELS, SEEDS, SWINGS }) => {
    const g = __g, G = g.G, MP = g.MP;
    function mulberry32(a) {
      return function () {
        a |= 0; a = a + 0x6D2B79F5 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      };
    }
    function arm(cls, key, lvl, seed) {
      const P = g.P, W = g.W;
      Math.random = mulberry32(seed);
      G.cls = cls; G.lvl = lvl; G.xp = 0; G.sp = lvl - 1; G.ap = (lvl - 1) * 5;
      G.sk = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      G.at = { mgt: 0, ref: 0, vit: 0, bnd: 0 };
      G.pas = null; G.web = {}; G.fork = {}; G.doc = null; G.schema = null; G.form = null; G.formT = 0;
      G.act2 = lvl >= 15; G.act3 = lvl >= 30; G.act4 = lvl >= 45; G.act5 = lvl >= 60;
      G.diff = 0; G.god = false; G.hc = false; G.merc = null; G.tag = null; G.pp = 0;
      G.eq = { weapon: null, helm: null, armor: null, gloves: null, boots: null, belt: null, ring: null, amulet: null };
      G.bag = []; G.charms = [];
      P.aura = null; P.toxL = 0; P.haste = 0; P.buff = 0; P.book = 0; P.bear = 0; P.orders = 0;
      P.allySwing = 0; P.swingBody = null; P.inv = 0; P.shr = null; P.mech = 0;
      W.merc = null; W.tag = null; W.allies.length = 0; W.ents.length = 0;
      const left = g.buildApply(cls, key, G.sp, G.ap);
      G.sp = left.sp; G.ap = left.ap;
      for (const slot of ['weapon', 'armor', 'helm', 'gloves', 'boots', 'belt', 'ring', 'amulet']) {
        const it = g.makeItem(lvl, 2, slot);
        it.id = true;
        G.eq[slot] = it;
      }
      g.calc();
      for (const ty of g.RTK) {
        let n = 0;
        while (g.resOf(ty) < 75 && n++ < 40) {
          const slot = ['armor', 'helm', 'gloves', 'boots', 'belt', 'ring', 'amulet'][n % 7];
          const it = G.eq[slot];
          it.aff = it.aff || [];
          let a = it.aff.find(x => x.k === 'r_' + ty);
          if (!a) { a = { k: 'r_' + ty, v: 0, grp: 'res' }; it.aff.push(a); }
          a.v += 25;
          g.calc();
        }
      }
      if (cls === 'maxi') {
        const on = [4, 3, 7].find(i => G.sk[i] > 0);
        if (on) { P.aura = null; g.maxiSet(on, G.sk[on] || 1); }
      }
      g.calc();
      G.hp = g.S.maxHp; G.en = g.S.maxEn;
      g.setMode('play');
      P.atk = 0;
      const quiet = W.ents.length;
      W.ents.length = 0;
      g.attack();
      const ivl = P.atk || g.CLS[cls].ivl;
      W.ents.length = quiet;
      return ivl;
    }
    function sample(cls, ivl, n) {
      const P = g.P, W = g.W;
      W.ents.length = 0; W.texts.length = 0; W.fx.length = 0; W.projs.length = 0;
      const e = { mp: 'foe', k: 'player', x: P.x + 0.7, y: P.y, r: 0.45, hp: 1e12, max: 1e12, mods: {}, name: 'Foe', mark: 0, mkP: 0, flash: 0, stun: 0, slow: 0, ward: 0 };
      W.ents.push(e);
      MP.others = [{ uid: 'foe', name: 'Foe', x: e.x, y: e.y, hp: 1e12, hpm: 1e12, cls: 'scrapper', lvl: G.lvl }];
      MP.hostile = { foe: 1 };
      MP.pvpScale = 0.25;
      if (G.cls === 'maxi' && P.aura) g.maxiAura(0.02);
      const mul = g.CLS[cls].mult;
      const out = [];
      for (let i = 0; i < n; i++) {
        W.texts.length = 0;
        const before = e.hp;
        g.hit(e, mul, true);
        const raw = (before - e.hp) / 0.25;
        const txt = W.texts.length ? String(W.texts[W.texts.length - 1].txt) : '';
        out.push({ raw, crit: /!$/.test(txt) ? 1 : 0 });
        e.hp = 1e12;
      }
      return out;
    }
    function snap() {
      return JSON.parse(JSON.stringify({
        G: G,
        aura: g.P.aura ? { i: g.P.aura.i, L: g.P.aura.L, t: 1 } : null
      }));
    }
    function restore(s) {
      const P = g.P, W = g.W;
      for (const k of Object.keys(G)) delete G[k];
      Object.assign(G, JSON.parse(JSON.stringify(s.G)));
      g.calc();
      G.hp = g.S.maxHp; G.en = g.S.maxEn;
      P.aura = s.aura ? { i: s.aura.i, L: s.aura.L, t: 1 } : null;
      P.inv = 0; P.atk = 0; P.shr = null;
      W.merc = null; W.tag = null; W.allies.length = 0; W.ents.length = 0;
      g.setMode('play');
    }
    function trace(samples, ivl, atkLvl) {
      const hpm = g.S.maxHp;
      const cap = hpm * Math.min(0.85, 0.22 + 0.008 * atkLvl);
      G.hp = hpm; g.P.inv = 0; g.setMode('play');
      let t = 0, dealt = 0, hits = 0;
      for (let i = 0; i < samples.length && G.hp > 0 && g.mode !== 'dying'; i++) {
        t += ivl;
        let landed = samples[i].raw * 0.25;
        if (landed > cap) landed = cap;
        landed = Math.round(landed);
        const before = G.hp;
        g.hurt(landed, 0, { name: 'Foe', pvp: 1, crit: samples[i].crit ? 1 : 0 });
        dealt += Math.max(0, before - Math.max(0, G.hp));
        hits++;
        if (G.hp <= 0 || g.mode === 'dying') return { t, dead: 1, hits, dealt, hpm };
      }
      const dps = t > 0 ? dealt / t : 0;
      const extra = dps > 0 ? Math.max(0, G.hp) / dps : 999;
      return { t: t + extra, dead: 0, hits, dealt, hpm, extrapolated: 1 };
    }

    const sheets = [];
    const built = {};
    for (const lvl of LEVELS) {
      for (const [cls, key] of ROWS) {
        const ivl = arm(cls, key, lvl, 1000 + lvl);
        const resists = {};
        for (const ty of g.RTK) resists[ty] = g.resOf(ty);
        const base = snap();
        const seeds = [];
        for (let s = 0; s < SEEDS; s++) {
          restore(base);
          Math.random = mulberry32(lvl * 1000 + s * 17 + cls.length * 13);
          if (G.cls === 'maxi' && g.P.aura) g.maxiAura(0.02);
          seeds.push(sample(cls, ivl, SWINGS));
        }
        restore(base);
        built[cls + '@' + lvl] = { ivl, snap: base, seeds, resists, maxHp: g.S.maxHp, armor: g.S.armor, name: g.BUILDS[cls].find(b => b.k === key).n };
        const avg = seeds[0].reduce((a, x) => a + x.raw, 0) / seeds[0].length;
        sheets.push({ cls, build: key, name: built[cls + '@' + lvl].name, lvl, ivl: +ivl.toFixed(3), maxHp: g.S.maxHp, armor: g.S.armor, avgRaw: Math.round(avg), resists });
      }
    }

    const fights = [];
    const flags = [];
    for (const lvl of LEVELS) {
      for (const [aCls] of ROWS) {
        for (const [bCls] of ROWS) {
          if (aCls === bCls) continue;
          const A = built[aCls + '@' + lvl], B = built[bCls + '@' + lvl];
          let wins = 0, ttkSum = 0, ttkN = 0, fast = 0;
          for (let s = 0; s < SEEDS; s++) {
            restore(B.snap);
            const tb = trace(A.seeds[s], A.ivl, lvl);
            restore(A.snap);
            const ta = trace(B.seeds[s], B.ivl, lvl);
            if (tb.t < ta.t) wins++;
            else if (tb.t === ta.t) wins += 0.5;
            ttkSum += tb.t; ttkN++;
            if (tb.t < 2) fast++;
          }
          const win = wins / SEEDS;
          const ttk = ttkSum / ttkN;
          const row = { lvl, a: aCls, b: bCls, win: +win.toFixed(3), ttk: +ttk.toFixed(2), fast };
          fights.push(row);
          if (win > 0.8 || ttk < 2) flags.push(row);
        }
      }
    }
    Math.random = Math.random;
    return { sheets, fights, flags };
  }, { ROWS, LEVELS, SEEDS, SWINGS });

  await browser.close();
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log('sheets', report.sheets.length, 'fights', report.fights.length, 'flags', report.flags.length);
  for (const s of report.sheets) console.log(s.lvl, s.cls, s.name, 'ivl', s.ivl, 'hp', s.maxHp, 'arm', s.armor, 'raw', s.avgRaw, JSON.stringify(s.resists));
  for (const f of report.flags) console.log('FLAG', f.lvl, f.a, 'vs', f.b, 'win', f.win, 'ttk', f.ttk);
})().catch(e => { console.error(e); process.exit(1); });
