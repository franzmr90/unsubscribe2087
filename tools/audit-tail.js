const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const SHOT = '/tmp/audit-shots';
const html = fs.readFileSync(path.join(root, 'dist/unsubscribe.html'), 'utf8');
const CHROME = process.env.PW_CHROMIUM || undefined;
(async () => {
  const b = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">' + html + '</body></html>');
  await p.waitForTimeout(300);
  await p.evaluate(() => __g.skipDisc());
  await p.click('[data-cls=witness]');
  await p.waitForTimeout(200);
  await p.evaluate(() => { __g.G.pre = 2; __g.G.walkNew = 0; __g.OPT.noWalk = 1; __g.G.god = true; __g.G.lvl = 80; __g.G.unlocked = 34; __g.G.act2 = __g.G.act3 = __g.G.act4 = __g.G.act5 = true; });
  for (let i = 0; i < 16; i++) {
    await p.evaluate(() => { const s = document.getElementById('scene'); if (s && !s.hidden) document.getElementById('scSkip').click(); const d = document.getElementById('dlg'); if (d && !d.hidden) { const x = d.querySelector('#dBtns button:not([disabled])'); if (x) x.click(); } });
    await p.waitForTimeout(150);
  }
  const zones = await p.evaluate(() => {
    const bad = [];
    for (let z = 0; z < __g.ZONES.length; z++) {
      __g.enter(z); __g.setMode('play');
      if (!__g.W || __g.W.zi !== z) bad.push(z);
    }
    return { n: __g.ZONES.length, bad };
  });
  console.log('ZONES', JSON.stringify(zones), 'errs', errs.slice(0, 4));
  await p.evaluate(() => { __g.setMode('play'); __g.G.module = 1; __g.G.q.q25 = 3; __g.finalChoice(); });
  await p.waitForTimeout(4500);
  const end = await p.evaluate(() => {
    const btn = [...document.querySelectorAll('#dBtns button')].find(b => /seventh/i.test(b.textContent));
    const dis = btn && btn.disabled;
    if (btn && !btn.disabled) btn.click();
    return { text: btn && btn.textContent, dis, ending: __g.G.ending };
  });
  await p.waitForTimeout(400);
  await p.screenshot({ path: path.join(SHOT, '10-ending.png') });
  const end2 = await p.evaluate(() => ({ ending: __g.G.ending, hidden: document.getElementById('scene').hidden, title: (document.querySelector('#scene h2, #scTitle, #scene .ttl') || {}).textContent || document.getElementById('scene').innerText.slice(0, 80) }));
  console.log('END', JSON.stringify({ end, end2 }));
  for (let i = 0; i < 8; i++) {
    await p.evaluate(() => { const s = document.getElementById('scene'); if (s && !s.hidden) document.getElementById('scSkip').click(); });
    await p.waitForTimeout(100);
  }
  await p.evaluate(() => { __g.setMode('play'); document.getElementById('bBug').click(); });
  await p.waitForTimeout(4500);
  await p.evaluate(() => { const b = [...document.querySelectorAll('#dBtns button')].find(x => /wrong/i.test(x.textContent) && !x.disabled); if (b) b.click(); });
  await p.waitForTimeout(200);
  const bug = await p.evaluate(() => ({ shown: document.getElementById('bugw') && !document.getElementById('bugw').hidden, n: document.querySelectorAll('#bugw textarea').length }));
  if (bug.shown) {
    await p.fill('#bg1', 'Standing in town during the audit.');
    await p.fill('#bg2', 'The report form was the thing under test.');
    await p.fill('#bg3', 'The report should land on the clipboard.');
    await p.screenshot({ path: path.join(SHOT, '11-bug-form.png') });
    await p.click('#bgSend');
    await p.waitForTimeout(400);
  }
  const msg = await p.evaluate(() => (document.getElementById('bgm') || {}).textContent || '');
  console.log('BUG', JSON.stringify({ bug, msg: msg.slice(0, 180) }));
  console.log('errs', errs);
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
