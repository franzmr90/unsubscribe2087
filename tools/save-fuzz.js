/* Partial and corrupt saves, from a bare hero through a bad district blob.
   node tools/save-fuzz.js
   Loads through applySave and ensure's migrations via startPlay where that stays on the hero. */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const htmlPath = path.join(root, 'dist', 'unsubscribe.html');

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
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">' + html + '</body></html>');
  await page.waitForFunction(() => window.__g && __g.skipDisc);
  await page.evaluate(() => __g.skipDisc());
  await page.waitForTimeout(120);
  await page.click('[data-cls=scrapper]');
  await page.evaluate(() => { const G = __g.G; G.pre = 2; G.seenIntro = false; __g.OPT.sound = false; __g.OPT.music = false; });
  await clearUI(page);

  const report = await page.evaluate(() => {
    const fail = [], note = [];
    const check = (n, ok, extra) => { if (!ok) fail.push(n + (extra !== undefined ? ': ' + extra : '')); };
    const g = __g;
    const ring = (name, aff) => ({ slot: 'ring', name, base: 'Ring', q: 2, il: 8, aff: aff || [{ k: 'hp', v: 10 }], id: true });

    /* Bare hero: no quests, skills, pack, or gear. */
    let ok = g.applySave({ G: { cls: 'hacker', lvl: 12, hp: 40 } });
    check('a bare hero loads', ok === true);
    check('missing skills are padded', Array.isArray(g.G.sk) && g.G.sk.length >= 15 && g.G.sk[0] === 0);
    check('missing quests become an object', g.G.q && typeof g.G.q === 'object');
    check('missing pack and gear are empty', Array.isArray(g.G.bag) && g.G.eq && typeof g.G.eq === 'object');
    check('a short level becomes 1 only when it was missing', g.G.lvl === 12);

    /* Level missing, credits poisoned, skill list short, charm in a holey pack. */
    const charm = { slot: 'charm', charm: 1, name: 'Old Charm', aff: [{ k: 'dmg', v: 3 }] };
    ok = g.applySave({
      G: {
        cls: 'courier', hp: 10, credits: NaN, cpi: 0,
        sk: [1, 2],
        bag: [ring('Kept'), null, charm],
        stash: null,
        eq: null,
        q: null
      }
    });
    check('a partial courier loads', ok === true);
    check('a missing level is 1', g.G.lvl === 1);
    check('poison credits become 0', g.G.credits === 0);
    check('a short skill list is padded, not dropped', g.G.sk[0] === 1 && g.G.sk[1] === 2 && g.G.sk.length >= 15);
    check('the ring in the pack is still there', g.G.bag.some(it => it && it.name === 'Kept'));
    note.push('bag after holes ' + g.G.bag.length);

    /* Corrupt district: the blob will not decode. Ground loot is kept. */
    const ground = ring('Ground Ring', [{ k: 'r_sound', v: 18 }]);
    ok = g.applySave({
      G: { cls: 'scrapper', lvl: 20, hp: 80, credits: 40, sats: 1, stims: 0, bag: [ring('Pocket')], words: { satoshi: 1 } },
      zs: {
        3: { map: '!!!not-base64', wh: '!!!', seen: '!!!', drops: [{ it: ground }, { sat: 4 }, { cr: 12.9 }, { pot: 1 }, { word: 'orange' }] },
        4: null
      }
    });
    check('a corrupt district does not reject the save', ok === true);
    check('the corrupt district is not entered as a world', !g.ZS()[3] && !g.ZS()[4]);
    check('a ring on the ground is in the pack', g.G.bag.some(it => it && it.name === 'Ground Ring'));
    check('the pocket ring is still in the pack', g.G.bag.some(it => it && it.name === 'Pocket'));
    check('sats on the ground are kept', g.G.sats === 5);
    check('credits on the ground floor into the purse', g.G.credits === 52);
    check('a stim on the ground is kept', g.G.stims === 1);
    check('a word on the ground is kept', g.G.words && g.G.words.orange === 1 && g.G.words.satoshi === 1);

    /* Affixes that are not a list, and a pre-resist sound line, go through migration. */
    const sound = ring('Sound Ring', [{ k: 'r_sound', v: 22 }, { k: 'r_impact', v: 10 }]);
    const broken = { slot: 'helm', name: 'Broken Helm', aff: 'nope' };
    ok = g.applySave({ G: { cls: 'anon', lvl: 18, hp: 30, bag: [sound], eq: { helm: broken }, q: {}, sk: [1] } });
    check('a broken affix list still loads', ok === true);
    try { g.migrateItem(broken); check('migrateItem refuses a non-list', true); }
    catch (e) { check('migrateItem refuses a non-list', false, e.message); }
    try { g.migrateItem(g.G.bag.find(it => it && it.name === 'Sound Ring')); check('an old sound resist migrates', true); }
    catch (e) { check('an old sound resist migrates', false, e.message); }
    const migrated = g.G.bag.find(it => it && it.name === 'Sound Ring');
    check('the sound resist is no longer sound', migrated && !migrated.aff.some(a => a.k === 'r_sound'));

    /* Softcore at 0 life loads and is set back to a living hero, off the corpse. */
    ok = g.applySave({ G: { cls: 'witness', lvl: 8, hp: 0, hc: false, bag: [ring('Witness Ring')], q: {}, sk: [1] } });
    check('a dead softcore hero loads', ok === true && g.G.hp === 9999);
    check('their ring is still packed', g.G.bag.some(it => it && it.name === 'Witness Ring'));

    /* Hardcore at 0 life is already gone. applySave keeps the body; the death path is hcBegin. */
    ok = g.applySave({ G: { cls: 'founder', lvl: 15, hp: 0, hc: true, bag: [ring('Founder Ring')], q: {}, sk: [1] } });
    check('a dead hardcore hero still parses', ok === true && g.G.hp === 0 && g.G.hc === true);
    check('the hardcore pack is intact until begin-again', g.G.bag.some(it => it && it.name === 'Founder Ring'));

    /* A full pass through the migrations that startPlay runs, on a living partial save. */
    g.applySave({
      G: {
        cls: 'homesteader', lvl: 22, hp: 50, credits: 10,
        bag: [ring('Home Ring', [{ k: 'r_sound', v: 9 }]), charm],
        q: { q10: 3 },
        diff: 2, bk: { boss5: 1 }
      }
    });
    let threw = '';
    try { g.startPlay(); }
    catch (e) { threw = e.message; }
    check('startPlay migrates a partial save', !threw, threw);
    check('the homesteader ring survived the migration', g.G.bag.some(it => it && it.name === 'Home Ring') || (g.G.charms || []).some(it => it && it.name === 'Home Ring'));
    check('a charm with no belt stays in the pack as a slip', !(g.G.charms || []).length && g.G.bag.some(it => it && it.charm && it.aff && it.aff.some(a => a.k === 'dmg' && a.v === 3)));
    check('an old sound resist on that ring migrated', !(g.G.bag.find(it => it && it.name === 'Home Ring') || { aff: [] }).aff.some(a => a.k === 'r_sound'));
    check('a boss-5 save keeps a difficulty gate', (g.G.diffGate || 0) >= 1, String(g.G.diffGate));
    note.push('diffGate ' + g.G.diffGate + ' charms ' + (g.G.charms || []).length);
    return { fail, note };
  });

  await browser.close();
  for (const n of report.note) console.log('note', n);
  const fail = report.fail.concat(errs);
  if (fail.length) {
    for (const f of fail) console.log('FAIL', f);
    process.exit(1);
  }
  console.log('save-fuzz ok');
})().catch(e => { console.error(e); process.exit(1); });
