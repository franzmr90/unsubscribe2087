/* CAREFUL WHAT THIS MEASURES. It calls render() in a tight loop with no yield to
   the browser, so Canvas2D work backs up against the GPU queue and each call
   blocks. The number it reports is throughput under saturation -- good for
   comparing two builds, wrong for "a frame costs this much". Under real rAF
   pacing the same scene is a fraction of it: the in-game readout (?perf=1)
   measured 3.5ms median with 83 entities where this reports 16. Use this to
   compare, and the readout to decide.

   Frame time in a dense district and a boss fight.
   One player, then the same room with three extra companions swinging.
   Usage: node tools/frame-prof.js
   Writes notes/frame-prof.json */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const htmlPath = path.join(root, 'dist', 'unsubscribe.html');
const outPath = path.join(root, 'notes', 'frame-prof.json');

function launchOpts() {
  return process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {};
}

async function dismiss(page) {
  const t0 = Date.now();
  while (Date.now() - t0 < 15000) {
    const s = await page.evaluate(() => {
      const scene = document.getElementById('scene');
      if (scene && !scene.hidden) { const sk = document.getElementById('scSkip'); if (sk) sk.click(); return 'scene'; }
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
  await page.waitForTimeout(150);
  await page.click('[data-cls=scrapper]');
  await page.evaluate(() => { const G = __g.G; G.pre = 2; G.seenIntro = false; G.preSeen = 1; __g.OPT.sound = false; __g.OPT.music = false; __g.OPT.shake = false; });
  const mode = await dismiss(page);
  if (mode !== 'play') throw new Error('boot ' + mode);
}

async function measure(page, spec) {
  return page.evaluate(async (spec) => {
    const g = __g, G = g.G;
    G.god = true; G.merc = null; G.tag = null; G.lvl = 60; G.hp = 99999; G.stims = 0;
    g.OPT.fx = 'full'; g.OPT.dmgOut = true; g.OPT.dyn = false; g.OPT.auto = false;
    g.setMode('play');
    g.enter(spec.zi, { fresh: true });
    const W = g.W, P = g.P;
    W.ents.length = 0; W.projs.length = 0; W.fx.length = 0; W.parts.length = 0; W.texts.length = 0; W.allies.length = 0;
    W.merc = null; W.tag = null; W.boss = null;
    const N = W.N, map = W.map;
    let parked = false;
    for (let y = 3; y < N - 3 && !parked; y++) for (let x = 3; x < N - 3 && !parked; x++) {
      let ok = true;
      for (let j = -2; j <= 2 && ok; j++) for (let i = -2; i <= 2; i++) if (map[(y + j) * N + x + i] !== 1) ok = false;
      if (ok) { P.x = x + 0.5; P.y = y + 0.5; parked = true; }
    }
    const made = [];
    for (let i = 0; i < spec.n; i++) {
      const a = i / spec.n * 6.283;
      let e = null;
      for (let ring = spec.rad; !e && ring < spec.rad + 6; ring += 0.8) {
        e = g.spawn(spec.k, P.x + Math.cos(a) * ring, P.y + Math.sin(a) * ring, spec.champ ? { champ: 1 } : {});
      }
      if (!e) continue;
      e.aggro = true; e.spd = spec.still ? 0 : e.spd; e.hp = e.max = 1e9;
      made.push(e);
    }
    if (spec.boss) {
      const b = g.spawn(spec.boss, P.x + 2.2, P.y, {});
      if (b) { b.aggro = true; b.hp = b.max = 1e9; W.boss = b; made.push(b); }
    }
    for (let i = 0; i < (spec.party || 0); i++) {
      W.allies.push({ k: 'minion', kind: 'extra', x: P.x + 0.4 * (i - 1), y: P.y + 0.6, hp: 500, max: 500, m: 0.4, ivl: 0.35, cd: 0, life: 1e9, r: 0.3, spd: 4, ph: i, fx: 1 });
    }
    const frames = spec.frames || 180;
    for (let i = 0; i < 30; i++) { g.update(1 / 60); g.render(); }
    const samples = [];
    let peak = { ents: 0, projs: 0, parts: 0, fx: 0, texts: 0 };
    for (let i = 0; i < frames; i++) {
      const t0 = performance.now();
      if (P.atk <= 0) g.attack();
      g.update(1 / 60);
      if (g.hud) g.hud();
      const t1 = performance.now();
      g.render();
      const t2 = performance.now();
      samples.push({ u: t1 - t0, r: t2 - t1, f: t2 - t0 });
      peak.ents = Math.max(peak.ents, W.ents.length);
      peak.projs = Math.max(peak.projs, W.projs.length);
      peak.parts = Math.max(peak.parts, W.parts.length);
      peak.fx = Math.max(peak.fx, W.fx.length);
      peak.texts = Math.max(peak.texts, W.texts.length);
    }
    samples.sort((a, b) => a.f - b.f);
    const avg = k => samples.reduce((s, x) => s + x[k], 0) / samples.length;
    const mid = samples[Math.floor(samples.length / 2)];
    const p95 = samples[Math.min(samples.length - 1, Math.floor(samples.length * 0.95))];
    return {
      name: spec.name, n: made.length, party: spec.party || 0,
      update: +avg('u').toFixed(3), render: +avg('r').toFixed(3), frame: +avg('f').toFixed(3),
      median: +mid.f.toFixed(3), p95: +p95.f.toFixed(3), peak
    };
  }, spec);
}

(async () => {
  const browser = await chromium.launch(launchOpts());
  const page = await browser.newPage({ viewport: { width: 1100, height: 700 } });
  await boot(page);
  const rows = [];
  const scenes = [
    { name: 'dense-1', zi: 16, k: 'censor', n: 28, rad: 3.2, still: 0, party: 0 },
    { name: 'dense-4', zi: 16, k: 'censor', n: 28, rad: 3.2, still: 0, party: 3 },
    { name: 'boss-1', zi: 5, k: 'drone', n: 8, rad: 2.4, boss: 'boss', party: 0 },
    { name: 'boss-4', zi: 5, k: 'drone', n: 8, rad: 2.4, boss: 'boss', party: 3 }
  ];
  for (const s of scenes) rows.push(await measure(page, s));
  await browser.close();
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(rows, null, 2));
  for (const r of rows) console.log(r.name, 'n', r.n, 'frame', r.frame, 'med', r.median, 'p95', r.p95, 'upd', r.update, 'ren', r.render, JSON.stringify(r.peak));
})().catch(e => { console.error(e); process.exit(1); });
