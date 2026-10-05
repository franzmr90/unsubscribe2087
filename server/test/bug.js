/* The report button, end to end: the hold before you can confirm, the refusal to file an
   empty report, and the report landing on the server. `node server/test/bug.js` */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'u2087-bug-'));
process.env.DATA_DIR = tmp;
const { chromium } = require('playwright');
const { server } = require('../server');
const bugs = require('../lib/bugs');

let pass = 0, fail = 0; const out = [];
const ok = (n, c, d) => { if (c) { pass++; out.push('  ok   ' + n); } else { fail++; out.push('  FAIL ' + n + (d ? '  <' + d + '>' : '')); } };
const wait = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  await new Promise(r => server.listen(0, r));
  const base = 'http://127.0.0.1:' + server.address().port;
  const br = await chromium.launch();
  const p = await br.newPage({ viewport: { width: 390, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));

  await p.goto(base + '/');
  await p.waitForTimeout(800);
  await p.evaluate(() => { const a = document.getElementById('acc'); if (a) a.className = 'off'; });
  await p.click('[data-cls=scrapper]');
  await p.waitForTimeout(800);
  for (let i = 0; i < 14; i++) {
    await p.evaluate(() => {
      const s = document.getElementById('scene'); if (s && !s.hidden) document.getElementById('scSkip').click();
      const d = document.getElementById('dlg'); if (d && !d.hidden) { const x = d.querySelector('#dBtns button:not([disabled])'); x && x.click(); }
    });
    await p.waitForTimeout(140);
  }
  await p.evaluate(() => __g.enter(1));
  /* Entering a district can queue more than one dialog, and they hold their buttons shut
     for a moment each, so clear them until none is left. */
  for (let i = 0; i < 30; i++) {
    const up = await p.evaluate(() => {
      const d = document.getElementById('dlg');
      if (!d || d.hidden) return false;
      const x = d.querySelector('#dBtns button:not([disabled])');
      if (x) x.click();
      return true;
    });
    if (!up) break;
    await p.waitForTimeout(200);
  }
  await p.waitForTimeout(300);

  ok('the report button is on screen', await p.isVisible('#bBug'));

  await p.click('#bBug');
  await p.waitForTimeout(250);
  const asked = await p.evaluate(() => document.getElementById('dT').textContent);
  ok('pressing it asks first instead of filing', /Before you file/.test(asked), asked);

  const lockedNow = await p.evaluate(() => [...document.querySelectorAll('#dBtns button')].every(b => b.disabled));
  ok('the confirm buttons are held shut at first', lockedNow);
  const countdown = await p.evaluate(() => (document.querySelector('#dBtns .ln') || {}).textContent || '');
  ok('the wait is shown as a countdown', /\d/.test(countdown), countdown);

  await p.waitForTimeout(4400);
  const freeNow = await p.evaluate(() => [...document.querySelectorAll('#dBtns button')].some(b => !b.disabled));
  ok('after the wait the decision is yours', freeNow);

  await p.evaluate(() => { for (const b of document.querySelectorAll('#dBtns button')) if (/went wrong/.test(b.textContent)) b.click(); });
  await p.waitForTimeout(300);
  ok('the form opens', await p.isVisible('#bugw'));

  /* An empty report, and one that is only half filled in, are both refused. */
  await p.click('#bgSend');
  await p.waitForTimeout(200);
  ok('an empty report is refused', /All three/.test(await p.textContent('#bgm')));
  ok('nothing was filed', bugs.list().length === 0);

  await p.fill('#bg1', 'walking into the second district');
  await p.fill('#bg2', 'short');
  await p.click('#bgSend');
  await p.waitForTimeout(200);
  ok('a half-filled report is refused', /All three/.test(await p.textContent('#bgm')));

  await p.fill('#bg2', 'the screen went black and the buttons stopped responding');
  await p.fill('#bg3', 'it should have loaded the district and let me move');
  await p.click('#bgSend');
  await p.waitForTimeout(900);

  const filed = bugs.list();
  ok('the report reaches the server', filed.length === 1, 'filed ' + filed.length);
  if (filed.length) {
    const r = filed[0];
    ok('all three answers are kept', /walking into/.test(r.doing) && /went black/.test(r.happened) && /let me move/.test(r.expected));
    ok('it carries where you were', r.state && r.state.zone === 1, JSON.stringify(r.state && r.state.zone));
    ok('it carries your character', r.state && r.state.lvl > 0 && !!r.state.cls);
  }
  ok('the form says it worked', /Filed/.test(await p.textContent('#bgm')));
  ok('no page errors', errs.length === 0, errs.join(' | '));

  console.log(out.join('\n'));
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  await br.close(); server.close();
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
