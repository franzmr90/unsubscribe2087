/* Cloud saves, the shared lockbox, character slots, and the tag-along companion.
   Opens the standalone file so localStorage works (setContent blocks it).
   A Node-side document map stands in for the account database and survives reload.
   Usage: node tools/save-paths.js */
const {chromium} = require('playwright');
const fs = require('fs');
const path = require('path');
const {pathToFileURL} = require('url');

const root = path.join(__dirname, '..');
const pagePath = path.join(root, 'dist', 'Unsubscribe-2087-standalone.html');
const docs = {};
const fails = [];
function ok(cond, msg) {
  if (cond) console.log('ok  ' + msg);
  else { console.log('FAIL ' + msg); fails.push(msg); }
}

const shim = `window.claude = window.claude || { use: async function (what) {
  if (what === 'user') return { id: async function () { return 'save-paths'; } };
  if (what === 'db') return { collection: function () { return { doc: function (id) {
    return {
      get: async function () {
        const data = await window.__docGet(id);
        return { exists: !!(data && !data.gone), data: function () { return data || {}; } };
      },
      set: async function (obj) { await window.__docSet(id, obj); },
      delete: async function () { await window.__docDel(id); }
    };
  } }; } };
} };`;

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
      if (window.__g && __g.mode === 'play') return 'play';
      if (window.__g && __g.mode === 'title') return 'title';
      return window.__g ? __g.mode : 'boot';
    });
    if (s === 'play' || s === 'title' || s === 'dying') return s;
    await page.waitForTimeout(s === 'locked' ? 250 : 80);
  }
  return 'timeout';
}

async function boot(page) {
  await page.goto(pathToFileURL(pagePath).href);
  await page.waitForFunction(() => window.__g && __g.skipDisc);
  await page.evaluate(() => __g.skipDisc());
  await page.waitForTimeout(300);
}

(async () => {
  if (!fs.existsSync(pagePath)) {
    console.error('missing ' + pagePath + ' — run npm run build first');
    process.exit(1);
  }
  const browser = await chromium.launch(process.env.PW_CHROMIUM ? {executablePath: process.env.PW_CHROMIUM} : {});
  const page = await browser.newPage({viewport: {width: 390, height: 800}});
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.exposeFunction('__docGet', async id => docs[id] || null);
  await page.exposeFunction('__docSet', async (id, data) => { docs[id] = data; });
  await page.exposeFunction('__docDel', async id => { delete docs[id]; });
  await page.addInitScript(shim);

  await boot(page);
  ok((await page.evaluate(() => __g.mode)) === 'title', 'title after the disclaimer');
  await page.click('[data-cls=scrapper]');
  await page.evaluate(() => { const G = __g.G; G.pre = 2; G.seenIntro = false; G.preSeen = 1; });
  ok((await dismiss(page)) === 'play', 'a new scrapper reaches play');

  const fam = await page.evaluate(() => {
    let n = 0;
    for (let i = 0; i < 40; i++) {
      const it = __g.makeItem(12, 1, 'weapon');
      if (it && it.fam) n++;
    }
    return n;
  });
  ok(fam > 0, 'weapon family hook marked ' + fam + ' of 40 magic weapons');

  await page.evaluate(() => {
    const it = __g.makeItem(4, 1, 'ring');
    it.id = true;
    it.name = 'LOCKBOX-TEST';
    __g.G.bag.push(it);
    __g.openSheet('stash');
  });
  await page.evaluate(() => document.querySelector('[data-sb="0"]').click());
  await page.waitForTimeout(100);
  const boxed = await page.evaluate(() => ({
    names: (__g.ACC.stash || []).map(it => it && it.name),
    html: document.getElementById('sheetIn').innerHTML,
    bag: __g.G.bag.length
  }));
  ok(boxed.names.indexOf('LOCKBOX-TEST') >= 0, 'lockbox holds LOCKBOX-TEST');
  ok(boxed.html.indexOf('Gear 1/36') >= 0, 'stash sheet shows one item in the lockbox');
  ok(boxed.bag === 0, 'the pack gave the item up');

  await page.evaluate(() => { __g.G.lvl = 19; __g.G.credits = 424242; __g.calc(); __g.save(true); });
  let cloudLv = null;
  for (let i = 0; i < 40 && cloudLv !== 19; i++) {
    await page.waitForTimeout(200);
    cloudLv = docs.main && docs.main.lv;
  }
  ok(cloudLv === 19, 'account document main is level ' + cloudLv);
  let acct = null;
  for (let i = 0; i < 20 && !(acct && acct.s && acct.s.indexOf('LOCKBOX-TEST') >= 0); i++) {
    await page.waitForTimeout(100);
    acct = docs.acct;
  }
  ok(!!(acct && acct.s && acct.s.indexOf('LOCKBOX-TEST') >= 0), 'account document acct holds the lockbox');

  await page.evaluate(() => { __g.G.credits += 5000; __g.closeSheet(); __g.openSheet('merc'); });
  const hireBtn = await page.evaluate(() => {
    const b = document.querySelector('[data-hire=guard]');
    if (!b) return 'missing';
    if (b.disabled) return 'disabled';
    b.click();
    return 'clicked';
  });
  ok(hireBtn === 'clicked', 'hire button was ' + hireBtn);
  await page.waitForTimeout(80);
  const hired = await page.evaluate(() => ({
    merc: !!__g.G.merc && __g.G.merc.k === 'guard' && !__g.G.merc.dead,
    world: !!__g.W.merc && __g.W.merc.hp > 0
  }));
  ok(hired.merc && hired.world, 'a bodyguard is hired and standing in town');

  await page.evaluate(() => { __g.closeSheet(); __g.openSheet('opts'); });
  await page.evaluate(() => document.querySelector('[data-newslot="1"]').click());
  ok((await page.evaluate(() => __g.mode)) === 'title', 'new slot returns to the title');
  await page.click('[data-cls=hacker]');
  await page.evaluate(() => { const G = __g.G; if (G) { G.pre = 2; G.seenIntro = false; } });
  ok((await dismiss(page)) === 'play', 'the second slot reaches play');
  ok(await page.evaluate(() => __g.G.cls === 'hacker'), 'slot 2 is a technomancer');
  const stashAcross = await page.evaluate(() => (__g.ACC.stash || []).some(it => it && it.name === 'LOCKBOX-TEST'));
  ok(stashAcross, 'the lockbox is still there on the new character');

  await page.evaluate(() => { __g.closeSheet(); __g.openSheet('opts'); });
  await page.evaluate(() => document.querySelector('[data-swslot="0"]').click());
  ok((await dismiss(page)) === 'play', 'switching back reaches play');
  ok(await page.evaluate(() => __g.G.cls === 'scrapper' && __g.G.lvl === 19), 'slot 1 is the level 19 scrapper again');
  ok(await page.evaluate(() => (__g.ACC.stash || []).some(it => it && it.name === 'LOCKBOX-TEST')), 'the lockbox survived the switch');

  await page.evaluate(() => { __g.G.sats = 20; __g.tagRender(1); });
  ok((await dismiss(page)) === 'play', 'the render scene closes');
  const tagged = await page.evaluate(() => ({
    tag: !!__g.G.tag && __g.G.tag.slot === 1,
    world: !!__g.W.tag && __g.W.tag.hp > 0,
    merc: __g.W.merc
  }));
  ok(tagged.tag && tagged.world, 'the other character is rendered beside you');
  ok(!tagged.merc, 'the hire steps back while the render is up');

  await page.evaluate(() => { __g.G['in1'] = 1; __g.G.q.q1 = 3; __g.enter(1); });
  ok((await dismiss(page)) === 'play', 'a field district opens');
  ok(await page.evaluate(() => !!__g.W.tag && __g.W.z && !__g.W.z.town && !__g.W.z.sim), 'the render comes with you out of town');

  await page.evaluate(() => __g.tagDismiss());
  const back = await page.evaluate(() => ({tag: __g.G.tag, world: __g.W.tag, merc: !!__g.W.merc}));
  ok(!back.tag && !back.world && back.merc, 'sending the render home brings the hire back');

  await page.evaluate(() => { __g.closeSheet(); __g.openSheet('opts'); });
  await page.evaluate(() => document.querySelector('[data-delslot="1"]').click());
  let wiped = false;
  const t0 = Date.now();
  while (Date.now() - t0 < 8000) {
    wiped = await page.evaluate(() => {
      const d = document.getElementById('dlg');
      if (!d || d.hidden) return false;
      const buttons = [...d.querySelectorAll('#dBtns button')];
      const kill = buttons.find(b => b.textContent === 'Delete for good' && !b.disabled);
      if (!kill) return false;
      kill.click();
      return true;
    });
    if (wiped) break;
    await page.waitForTimeout(200);
  }
  ok(wiped, 'Delete for good was the button that was pressed');
  await page.waitForTimeout(200);
  await dismiss(page, 4000);
  ok(await page.evaluate(() => __g.G.cls === 'scrapper'), 'deleting the other slot leaves this hero');
  ok(await page.evaluate(() => (__g.ACC.stash || []).some(it => it && it.name === 'LOCKBOX-TEST')), 'deleting a character leaves the lockbox');

  await page.evaluate(() => { __g.G.lvl = 19; __g.G.credits = 424242; __g.save(true); });
  let marked = false;
  for (let i = 0; i < 40 && !marked; i++) {
    await page.waitForTimeout(200);
    const main = docs.main;
    marked = !!(main && main.lv === 19 && main.s && main.s.indexOf('"credits":424242') >= 0);
  }
  ok(marked, 'the account copy was rewritten at level 19 with the marker credits');

  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForFunction(() => window.__g && __g.skipDisc);
  await page.evaluate(() => __g.skipDisc());
  let slots = '';
  for (let i = 0; i < 40; i++) {
    slots = await page.evaluate(() => (document.getElementById('slots') || {}).innerText || '');
    if (slots.indexOf('level 19') >= 0) break;
    await page.waitForTimeout(200);
  }
  ok(slots.indexOf('level 19') >= 0, 'the title lists level 19 from the account');
  await page.click('[data-slot="0"]');
  await page.waitForFunction(() => window.__g && __g.G && __g.mode === 'play', {timeout: 8000}).catch(() => {});
  ok(await page.evaluate(() => __g.G && __g.G.lvl === 19 && __g.G.cls === 'scrapper'), 'continuing loads the level 19 scrapper');
  ok(await page.evaluate(() => __g.G && __g.G.credits === 424242), 'credits came back with the cloud save');
  ok(await page.evaluate(() => (__g.ACC.stash || []).some(it => it && it.name === 'LOCKBOX-TEST')), 'the lockbox came back from the account after local storage was cleared');
  ok(!errs.length, errs.length ? 'page errors: ' + errs.slice(0, 3).join(' | ') : 'no page errors');

  await browser.close();
  if (fails.length) {
    console.log(fails.length + ' failed');
    process.exit(1);
  }
  console.log('save paths ok');
})().catch(e => { console.error(e); process.exit(1); });
