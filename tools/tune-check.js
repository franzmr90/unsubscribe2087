/* Checks the Normal tuning and a fair Witness fight against Defrag.
   node tools/tune-check.js
*/
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'dist/unsubscribe.html'), 'utf8');
const CHROME = process.env.PW_CHROMIUM || '/usr/local/bin/google-chrome';

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 300)));
  await page.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0">' + html + '</body></html>');
  const report = await page.evaluate(() => {
    const out = {};
    __g.skipDisc();
    __g.newGame('witness');
    __g.startPlay();
    const G = __g.G;
    G.pre = 0; G.diff = 0; G.lvl = 1; G.adopt = 0; G.fate = null;
    __g.OPT.dyn = true;
    __g.calc();
    __g.enter(0);
    __g.setMode('play');
    const cpi0 = G.cpi;
    for (let i = 0; i < 180; i++) __g.update(60);
    out.cpi180 = +G.cpi.toFixed(4);
    out.cpi0 = cpi0;
    G.lvl = 40;
    __g.calc();
    __g.enter(3, { fresh: 1 });
    out.fieldsMl = __g.W.ml;
    out.fieldsDyn = __g.W.dyn;
    out.fieldsLvl = __g.W.z.lvl;
    const ladder = zi => { __g.enter(zi, { fresh: 1 }); return __g.W.ml; };
    out.normal = { fields: out.fieldsMl, cathedral: ladder(5), mezz: ladder(11), still: ladder(16), kitchen: ladder(26), room: ladder(32) };
    G.diff = 1;
    out.hard = { fields: ladder(3), room: ladder(32), dyn: __g.W.dyn };
    G.diff = 2;
    out.brutalRoom = ladder(32);
    G.diff = 0;
    G.lvl = 8;
    __g.calc();
    __g.enter(0);
    __g.setMode('play');
    __g.openSheet('sats');
    const stimBtn = document.querySelector('[data-satstim="1"]');
    const rows = [...document.querySelectorAll('[data-sat]')].map(b => b.innerText.replace(/\s+/g, ' ').slice(0, 140));
    out.stimLabel = stimBtn ? stimBtn.innerText.replace(/\s+/g, ' ') : null;
    out.satRows = rows;
    const arm = (__g.satShop || []).find(o => o.it && o.it.slot === 'weapon' && o.it.fam === 'notebook');
    out.classArm = arm ? { il: arm.it.il, fam: arm.it.fam, price: arm.price, base: arm.it.base, q: arm.it.q } : null;
    __g.closeSheet();
    __g.setMode('play');
    __g.openSheet('merc');
    const hire = document.querySelector('[data-hire="guard"]');
    out.hireLabel = hire ? hire.innerText.replace(/\s+/g, ' ').slice(0, 160) : null;
    __g.closeSheet();
    /* blank page must not spend the Record */
    G.page = 40; G.en = 80; G.sk[4] = 1;
    __g.enter(3, { fresh: 1 });
    __g.setMode('play');
    const foe = __g.W.ents.find(e => e.hp > 0);
    if (foe) { foe.tes = 0; __g.P.x = foe.x + 1.1; __g.P.y = foe.y; __g.P.cd[4] = 0; __g.castIndex(4); }
    out.pageAfterBlank = G.page;
    out.castWhy = __g.castWhy || null;
    /* bank still holds one level and pays it on Act III */
    G.act2 = true; G.act3 = false; G.act4 = false; G.act5 = false;
    G.lvl = 50; G.xp = 0; G.bankXp = 0; G.para = 0; G.sp = 0;
    __g.gainXp(1000);
    out.banked = G.bankXp;
    const bar = Math.round(58 * Math.pow(50, 1.85));
    __g.gainXp(1e12);
    out.bankCap = G.bankXp;
    out.bar = bar;
    out.bankOk = G.bankXp === bar;
    G.act3 = true;
    __g.flushBank();
    out.flushed = { lvl: G.lvl, bank: G.bankXp || 0 };
    /* pace: a kill report far above the machine pays less than one on pace */
    G.act5 = true; G.lvl = 40; G.xp = 0; G.bankXp = 0;
    __g.gainXp(1000, 0, 40);
    const onPace = G.xp;
    G.xp = 0;
    __g.gainXp(1000, 0, 10);
    out.pace = { onPace, behind: G.xp };
    return out;
  });

  const fight = await page.evaluate(() => {
    __g.newGame('witness');
    __g.startPlay();
    const G = __g.G;
    G.pre = 0; G.diff = 0; G.god = false; G.stims = 6; G.credits = 400;
    while (G.lvl < 8) __g.gainXp(400);
    __g.enter(0);
    const arm = (__g.satShop || []).find(o => o.it && o.it.fam === 'notebook');
    if (arm) G.eq.weapon = arm.it;
    const applied = __g.buildApply('witness', 'page', G.sp, G.ap);
    G.sp = applied.sp; G.ap = applied.ap;
    __g.calc();
    G.hp = __g.S.maxHp; G.en = __g.S.maxEn;
    __g.enter(3, { fresh: 1 });
    __g.setMode('play');
    __g.W.ents = __g.W.ents.filter(e => e.su);
    const e0 = __g.W.ents.find(e => e.su);
    if (!e0) return { err: 'no defrag' };
    const start = { max: Math.round(e0.max), dmg: +e0.dmg.toFixed(1), ml: __g.W.ml, dyn: __g.W.dyn, lvl: G.lvl, hp: Math.round(__g.S.maxHp), sk: G.sk.slice(0, 8), slots: G.slots.slice() };
    let deaths = 0, peakTes = 0, peakPage = 0;
    const place = () => {
      const e = __g.W.ents.find(x => x.su && x.hp > 0);
      if (!e) return null;
      __g.P.x = e.x + 1.35; __g.P.y = e.y; e.aggro = true;
      return e;
    };
    place();
    const probe = { dmin: __g.S.dmin, dmax: __g.S.dmax, dmg: __g.S.dmg };
    for (let i = 0; i < 80; i++) {
      const e = place();
      if (!e) break;
      if ((__g.P.atk || 0) <= 0) __g.attack();
      __g.render();
      __g.update(1 / 20);
    }
    const after = __g.W.ents.find(e => e.su);
    probe.hits = after ? after.hits || 0 : 0;
    probe.left = after ? +(after.hp / after.max).toFixed(3) : 0;
    probe.page = G.page || 0;
    probe.tes = after ? after.tes || 0 : 0;
    G.hp = __g.S.maxHp; G.stims = 6; G.page = 0;
    if (after) { after.hp = after.max; after.hits = 0; after.tes = 0; }
    for (let i = 0; i < 20 * 150; i++) {
      if (__g.mode === 'dying' || __g.mode === 'dlg' || __g.mode === 'scene') {
        deaths++;
        if (deaths > 4) break;
        G.hp = __g.S.maxHp * 0.7; G.en = __g.S.maxEn;
        __g.setMode('play');
        place();
      }
      const e = __g.W.ents.find(x => x.su && x.hp > 0);
      if (!e) return { win: true, sec: +(i / 20).toFixed(1), deaths, peakTes, peakPage, start, left: 0 };
      peakTes = Math.max(peakTes, e.tes || 0);
      peakPage = Math.max(peakPage, G.page || 0);
      const P = __g.P, d = Math.hypot(e.x - P.x, e.y - P.y);
      if (d > 2.4) { P.x = e.x + 1.35; P.y = e.y; }
      const hp = G.hp / __g.S.maxHp;
      if (hp < 0.45 && G.stims > 0) __g.stim();
      const tes = e.tes || 0;
      if (tes < 3 && G.sk[0] && (P.cd[0] || 0) <= 0) __g.castIndex(0);
      if (hp < 0.6 && G.sk[1] && (P.cd[1] || 0) <= 0 && (G.page || 0) >= 8) __g.castIndex(1);
      if (tes >= 2 && (G.page || 0) >= 15 && G.sk[4] && (P.cd[4] || 0) <= 0) __g.castIndex(4);
      else if ((P.atk || 0) <= 0) __g.attack();
      __g.render();
      __g.update(1 / 20);
    }
    const e = __g.W.ents.find(x => x.su);
    return {
      win: !(e && e.hp > 0), sec: 150, deaths, peakTes, peakPage, start,
      left: e ? +(e.hp / e.max).toFixed(3) : 0,
      hp: Math.round(G.hp), stims: G.stims, probe
    };
  });
  console.log(JSON.stringify({ report, fight, errs }, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
