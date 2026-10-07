/* Shitcoiner pitch. The bitcoin refusal starts a fight. Walking away does not.
   Usage: node tools/shill-check.js */
const {chromium} = require('playwright');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'dist', 'unsubscribe.html'), 'utf8');
const fails = [];
function ok(cond, msg) {
  if (cond) console.log('ok  ' + msg);
  else { console.log('FAIL ' + msg); fails.push(msg); }
}

async function clear(page, n) {
  for (let i = 0; i < (n || 16); i++) {
    await page.evaluate(() => {
      const s = document.getElementById('scene');
      if (s && !s.hidden) { const b = document.getElementById('scSkip'); if (b) b.click(); }
      const d = document.getElementById('dlg');
      if (d && !d.hidden) {
        const x = d.querySelector('#dBtns button:not([disabled])');
        if (x && !/bitcoin|Walk away|What does it/.test(x.textContent)) x.click();
      }
    });
    await page.waitForTimeout(140);
  }
}

async function clickBtn(page, re, budget) {
  const t0 = Date.now();
  while (Date.now() - t0 < (budget || 6000)) {
    const hit = await page.evaluate(src => {
      const d = document.getElementById('dlg');
      if (!d || d.hidden) return 'closed';
      const b = [...d.querySelectorAll('#dBtns button')].find(el => new RegExp(src).test(el.textContent) && !el.disabled);
      if (!b) return 'locked';
      b.click();
      return 'clicked';
    }, re.source);
    if (hit === 'clicked') return true;
    if (hit === 'closed') return false;
    await page.waitForTimeout(200);
  }
  return false;
}

(async () => {
  const browser = await chromium.launch(process.env.PW_CHROMIUM ? {executablePath: process.env.PW_CHROMIUM} : {});
  const page = await browser.newPage({viewport: {width: 390, height: 844}});
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">' + html + '</body></html>');
  await page.waitForTimeout(400);
  await page.evaluate(() => __g.skipDisc());
  await page.waitForTimeout(200);
  await page.click('[data-cls=scrapper]');
  await page.evaluate(() => { const G = __g.G; if (G) { G.pre = 2; G.seenIntro = false; G.preSeen = 1; } });
  await clear(page, 20);
  await page.evaluate(() => {
    const G = __g.G;
    G.god = true; G.lvl = 3; G.in1 = 1; G.q.q1 = 1;
    __g.OPT.auto = false;
    __g.enter(1);
    __g.setMode('play');
  });
  await clear(page, 8);

  const pitched = await page.evaluate(() => {
    const g = __g;
    g.W.ents = g.W.ents.filter(e => e.k !== 'shill');
    let e = null;
    for (const [dx, dy] of [[.6, 0], [-.6, 0], [0, .6], [.4, .4]]) {
      e = g.spawn('shill', g.P.x + dx, g.P.y + dy);
      if (e) break;
    }
    if (!e) return null;
    e.coin = 'RugPull Inu'; e.name = 'Shill for RugPull Inu'; e.pitch = 1; e.pt = 18; e.aggro = false;
    g.update(.05);
    const d = document.getElementById('dlg');
    return {open: !!(d && !d.hidden), text: d ? d.textContent : ''};
  });
  ok(pitched && pitched.open && /RugPull Inu/.test(pitched.text), 'the pitch dialog opens');
  ok(await clickBtn(page, /There is bitcoin/), 'the bitcoin line could be clicked');
  const fought = await page.evaluate(() => {
    const s = __g.W.ents.filter(e => e.k === 'shill');
    const bags = __g.W.ents.filter(e => e.name === 'Bagholder');
    return {
      n: s.length,
      aggro: s.length === 1 && !!s[0].aggro,
      pitch: s.length === 1 && !s[0].pitch,
      bags: bags.length,
      log: document.getElementById('log').textContent,
      mode: __g.mode
    };
  });
  ok(fought.n === 1 && fought.aggro && !fought.pitch, 'the salesman stays and is hostile (' + JSON.stringify(fought) + ')');
  ok(/Get him/.test(fought.log), 'the fight toast is “Get him!”');
  ok(fought.bags === 0 && fought.mode === 'play', 'below level 8 he comes alone and play resumes');

  await page.evaluate(() => { __g.W.ents = __g.W.ents.filter(e => e.k !== 'shill' && e.name !== 'Bagholder'); });
  const again = await page.evaluate(() => {
    const g = __g;
    let e = null;
    for (const [dx, dy] of [[.6, 0], [-.6, 0], [0, .6]]) {
      e = g.spawn('shill', g.P.x + dx, g.P.y + dy);
      if (e) break;
    }
    if (!e) return false;
    e.coin = 'TrustMeBro'; e.name = 'Shill for TrustMeBro'; e.pitch = 1; e.pt = 18; e.aggro = false;
    g.update(.05);
    return !document.getElementById('dlg').hidden;
  });
  ok(again, 'a second pitch opens');
  ok(await clickBtn(page, /What does it actually do/), 'the utility question could be clicked');
  ok(await clickBtn(page, /Walk away/), 'Walk away could be clicked');
  const left = await page.evaluate(() => ({
    n: __g.W.ents.filter(e => e.k === 'shill').length,
    log: document.getElementById('log').textContent
  }));
  ok(left.n === 0 && /lets you walk/.test(left.log), 'walking away still sends him off');

  const third = await page.evaluate(() => {
    const g = __g;
    g.G.lvl = 8;
    let e = null;
    for (const [dx, dy] of [[.6, 0], [-.6, 0], [0, .6]]) {
      e = g.spawn('shill', g.P.x + dx, g.P.y + dy);
      if (e) break;
    }
    if (!e) return false;
    e.coin = 'YieldBunny'; e.name = 'Shill for YieldBunny'; e.pitch = 1; e.pt = 18; e.aggro = false;
    g.update(.05);
    return !document.getElementById('dlg').hidden;
  });
  ok(third, 'a third pitch opens at level 8');
  ok(await clickBtn(page, /What does it actually do/), 'the utility question opens again');
  ok(await clickBtn(page, /^“No\.”$/), '“No.” could be clicked');
  const pack = await page.evaluate(() => ({
    aggro: __g.W.ents.some(e => e.k === 'shill' && e.aggro),
    bags: __g.W.ents.filter(e => e.name === 'Bagholder' && e.aggro).length,
    log: document.getElementById('log').textContent
  }));
  ok(pack.aggro && pack.bags === 2 && /hate innovation/.test(pack.log), '“No.” starts the fight, and at level 8 two Bagholders join (' + JSON.stringify(pack) + ')');

  ok(!errs.length, errs.length ? 'page errors: ' + errs.slice(0, 3).join(' | ') : 'no page errors');
  await browser.close();
  if (fails.length) {
    console.log(fails.length + ' failed');
    process.exit(1);
  }
  console.log('shitcoiner ok');
})().catch(e => { console.error(e); process.exit(1); });
