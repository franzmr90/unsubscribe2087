/* The card at the front. `node server/test/disclaimer.js`
   It holds the screen on purpose, so the things that matter are that it appears, that it
   cannot be tapped through into starting a game by accident, and that it always goes away
   — both when somebody taps and when nobody does. */
'use strict';
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');

let pass = 0, fail = 0; const out = [];
const ok = (n, c, d) => { if (c) { pass++; out.push('  ok   ' + n); } else { fail++; out.push('  FAIL ' + n + (d ? '  <' + d + '>' : '')); } };

(async () => {
  const b = await chromium.launch();
  const html = '<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">' +
    fs.readFileSync(path.join(__dirname, '..', '..', 'dist', 'unsubscribe.html'), 'utf8') + '</body></html>';
  const errs = [];

  const p = await b.newPage({ viewport: { width: 390, height: 800 } });
  p.on('pageerror', e => errs.push(e.message));
  await p.setContent(html);
  await p.waitForTimeout(1100);

  ok('it is up before anything else', await p.evaluate(() => {
    const d = document.getElementById('disc');
    return !d.hidden && d.classList.contains('in');
  }));

  const text = (await p.textContent('#discIn')).replace(/\s+/g, ' ');
  ok('it says the work is fictional', /fictional/i.test(text) && /coincidental/i.test(text), text.slice(0, 60));
  ok('it covers the resemblance', /resemblance/i.test(text), text.slice(0, 60));
  ok('it tells you what to do if you disagree', /stop playing immediately/i.test(text));

  /* The one thing that would actually be a bug: a tap meant to dismiss it also landing on
     a class button and starting a game nobody asked for. */
  ok('nothing behind it can be hit', !(await p.evaluate(() => {
    const e = document.elementFromPoint(195, 400);
    return !!(e && e.closest && e.closest('[data-cls]'));
  })));

  await p.mouse.click(195, 400);
  await p.waitForTimeout(700);
  ok('a tap clears it', await p.evaluate(() => document.getElementById('disc').hidden));
  ok('and that tap did not start a game', (await p.evaluate(() => __g.mode)) === 'title');
  const after = await p.evaluate(() => {
    const ids = [...document.querySelectorAll('[data-cls]')].map(e => e.dataset.cls);
    return { ids, unlocked: Object.values(__g.CLS).filter(c => !c.locked).length };
  });
  ok('the title is usable afterwards',
    after.ids.length > 0 && after.ids.length === after.unlocked
      && ['scrapper', 'homesteader', 'witness'].every(k => after.ids.includes(k))
      && !after.ids.includes('maxi'),
    JSON.stringify(after));
  await p.close();

  /* Nobody touches it: it must still go away. */
  const q = await b.newPage({ viewport: { width: 390, height: 800 } });
  q.on('pageerror', e => errs.push(e.message));
  await q.setContent(html);
  await q.waitForTimeout(8200);
  ok('it clears itself if nobody taps', await q.evaluate(() => document.getElementById('disc').hidden));
  await q.close();

  /* Short screens are where uppercase letterspaced text overflows. */
  const r = await b.newPage({ viewport: { width: 360, height: 560 } });
  r.on('pageerror', e => errs.push(e.message));
  await r.setContent(html);
  await r.waitForTimeout(1000);
  const fits = await r.evaluate(() => {
    const i = document.getElementById('discIn');
    return i.scrollHeight <= innerHeight && i.scrollWidth <= innerWidth;
  });
  ok('it fits on a short screen without clipping', fits);
  await r.close();

  ok('no page errors', errs.length === 0, errs.join(' | '));

  console.log(out.join('\n'));
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  await b.close();
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
