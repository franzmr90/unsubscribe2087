/* Cabinet wiring: the scripted ring-out, and a win that does not pay.
   node tools/offsite.js */
const {chromium} = require('playwright');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

async function clearUI(p) {
  for (let i = 0; i < 24; i++) {
    const st = await p.evaluate(() => {
      const s = document.getElementById('scene');
      if (s && !s.hidden) { document.getElementById('scSkip').click(); return 'scene'; }
      const d = document.getElementById('dlg');
      if (d && !d.hidden) { const x = d.querySelector('#dBtns button:not([disabled])'); if (x) { x.click(); return 'dlg'; } return 'locked'; }
      const sh = document.getElementById('sheet');
      if (sh && !sh.hidden) { const x = sh.querySelector('[data-close]'); if (x) { x.click(); return 'sheet'; } return 'sheet'; }
      const port = document.getElementById('uiPortX');
      if (port && port.closest('#uiPort') && !port.closest('#uiPort').hidden) { port.click(); return 'port'; }
      return 'clear';
    });
    if (st === 'clear') return;
    await p.waitForTimeout(st === 'locked' ? 350 : 120);
  }
  throw new Error('overlays did not clear');
}

(async () => {
  const html = fs.readFileSync(path.join(root, 'dist/unsubscribe.html'), 'utf8');
  const b = await chromium.launch({executablePath: process.env.PW_CHROMIUM || undefined});
  const p = await b.newPage({viewport: {width: 1100, height: 700}});
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">' + html + '</body></html>');
  await p.waitForTimeout(300);
  await p.evaluate(() => __g.skipDisc());
  await p.waitForTimeout(80);
  await p.click('[data-cls=courier]');
  await p.waitForTimeout(120);
  await p.evaluate(() => { __g.G.pre = 2; __g.G.walkNew = 0; __g.OPT.noWalk = 1; __g.OPT.ui = 'mouse'; __g.uiApply(true); });
  await clearUI(p);
  await p.evaluate(() => __g.enter(0));
  await clearUI(p);
  await p.evaluate(() => __g.setMode('play'));
  const before = await p.evaluate(() => ({sats: __g.G.sats | 0, xp: __g.G.xp || 0, cr: __g.G.credits || 0, eq: JSON.stringify(__g.G.eq)}));
  const ring = await p.evaluate(() => __g.offsiteScript());
  if (!(ring.courier && ring.courier.stocks === 2 && ring.courier.out === 1)) {
    console.log('runner did not ring out', ring, errs);
    process.exit(1);
  }
  if (!(ring.scrapper && ring.scrapper.stocks === 3 && ring.scrapper.out === 0)) {
    console.log('scrapper left the book', ring);
    process.exit(1);
  }
  const won = await p.evaluate(() => __g.offsiteForce(0));
  const after = await p.evaluate(() => ({
    sats: __g.G.sats | 0, xp: __g.G.xp || 0, cr: __g.G.credits || 0, eq: JSON.stringify(__g.G.eq),
    page: __g.G.offsite && __g.G.offsite.page, attended: __g.G.offsite && __g.G.offsite.attended,
    memo: __g.offsiteMemo(), name: __g.offsiteName(), mode: __g.mode
  }));
  if (after.sats !== before.sats || after.xp !== before.xp || after.cr !== before.cr || after.eq !== before.eq) {
    console.log('the cabinet paid', before, after);
    process.exit(1);
  }
  if (after.page !== 1 || after.attended !== 1 || after.memo.indexOf('Minutes of the offsite') < 0 || after.name !== 'Attended') {
    console.log('unlock', after, won);
    process.exit(1);
  }
  fs.mkdirSync('/opt/cursor/artifacts', {recursive: true});
  await p.evaluate(() => __g.offsiteBegin({p1: 'scrapper', p2: 'courier', bot: 1}));
  await p.waitForTimeout(400);
  await p.screenshot({path: '/opt/cursor/artifacts/allhands-fight.png'});
  await p.evaluate(() => __g.offsiteClose());
  if (errs.length) { console.log(errs.join('\n')); process.exit(1); }
  console.log('offsite ok', ring);
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
