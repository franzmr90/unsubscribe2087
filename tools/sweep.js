/* Player-path checks for the systems that had no harness.
   node tools/sweep.js
   One browser. Fails on crashes, lost state, printed-vs-real mismatches,
   broken unlocks, and sats that appear from nothing. */
const {chromium} = require('playwright');
const path = require('path');
const {pathToFileURL} = require('url');
const root = path.join(__dirname, '..');
const pagePath = path.join(root, 'dist', 'Unsubscribe-2087-standalone.html');

async function clearUI(p) {
  for (let i = 0; i < 30; i++) {
    const st = await p.evaluate(() => {
      const s = document.getElementById('scene');
      if (s && !s.hidden) { const k = document.getElementById('scSkip'); if (k) k.click(); return 'scene'; }
      const d = document.getElementById('dlg');
      if (d && !d.hidden) {
        const x = d.querySelector('#dBtns button:not([disabled])');
        if (x) { x.click(); return 'dlg'; }
        return 'locked';
      }
      if (window.__g && __g.mode === 'intro' && __g.ltEnd) { __g.ltEnd(); return 'intro'; }
      return 'clear';
    });
    if (st === 'clear') return;
    await p.waitForTimeout(st === 'locked' ? 300 : 120);
  }
  throw new Error('overlays did not clear');
}

async function boot(p) {
  await p.goto(pathToFileURL(pagePath).href);
  await p.waitForFunction(() => window.__g && __g.skipDisc);
  await p.evaluate(() => __g.skipDisc());
  await p.waitForTimeout(150);
  await p.click('[data-cls=scrapper]');
  await p.waitForTimeout(150);
  await p.evaluate(() => { __g.G.pre = 2; __g.G.walkNew = 0; __g.OPT.noWalk = 1; });
  await clearUI(p);
  await p.evaluate(() => __g.enter(0));
  await clearUI(p);
  await p.evaluate(() => __g.setMode('play'));
}

async function click(p, sel) {
  return p.evaluate(sel => {
    const b = document.querySelector(sel);
    if (!b) return 'missing';
    if (b.disabled) return 'disabled';
    b.click();
    return 'ok';
  }, sel);
}

(async () => {
  const fail = [], note = [], finding = [];
  const check = (n, ok, extra) => {
    const line = n + (extra !== undefined && extra !== '' ? ': ' + extra : '');
    if (!ok) { fail.push(line); console.log('FAIL ' + line); }
    else { note.push(line); console.log('ok   ' + line); }
  };
  const browser = await chromium.launch({executablePath: process.env.PW_CHROMIUM || undefined});
  const page = await browser.newPage({viewport: {width: 1280, height: 800}});
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await boot(page);

  const cloud = await page.evaluate(() => {
    const n = document.getElementById('cloudNote');
    return {state: window.clState || (document.body.innerText.indexOf('browser only') >= 0 ? 'text' : ''), note: n ? n.textContent : ''};
  });
  check('account saving is off in this view', /browser only|not available/i.test(cloud.note), cloud.note.slice(0, 80));
  finding.push('Cloud slot: this view has no account database, so the server document path was not exercised. The browser slot was.');

  /* ---------- ledger ---------- */
  const web = await page.evaluate(() => {
    const g = __g, G = g.G;
    G.lvl = 12; G.para = 0; G.web = {}; G.sats = 4; g.calc();
    const before = g.webPts();
    g.openSheet('web');
    const pts = document.querySelector('.webPane .pts');
    const tap = el => { if (el) el.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true})); };
    const disconnected = document.querySelector('[data-web="0_2"]');
    tap(disconnected);
    const blocked = !G.web['0_2'];
    const first = document.querySelector('[data-web="0_1"]');
    tap(first);
    const placed = !!G.web['0_1'];
    const ptsAfter = g.webPts();
    const dmg1 = g.S.dmg;
    /* opposite arm takes the rest of the points so Might is the weak one */
    G.web = {'0_1': 1};
    for (let r = 1; r <= 4; r++) G.web['4_' + r] = 1;
    g.calc();
    const weak = g.S.dmg;
    G.web = {};
    g.calc();
    const bare = g.S.dmg;
    G.web = {'0_1': 1, '4_1': 1, '4_2': 1, '4_3': 1, '4_4': 1};
    g.calc();
    g.openSheet('web');
    const node = document.querySelector('[data-web="0_1"]');
    if (node) node.dispatchEvent(new PointerEvent('pointerover', {bubbles: true}));
    const tip = (document.getElementById('webTip') || {}).innerHTML || '';
    const refund = document.querySelector('[data-webreset]');
    const refundLocked = !!(refund && refund.disabled);
    G.sats = 9;
    g.setMode('play');
    g.openSheet('web');
    const live = document.querySelector('[data-webreset]');
    if (live && !live.disabled) live.click();
    return {
      before, printed: pts ? pts.textContent : '', placed, blocked, ptsAfter,
      bare, weak, dmg1, tip, refundLocked, sats: G.sats, left: Object.keys(G.web).length, ptsBack: g.webPts()
    };
  });
  check('ledger starts with level-1 points', web.before === 11, web.before);
  check('the bar prints that count', (web.printed || '').indexOf('11') === 0, web.printed);
  check('a node off the path does not take a point', web.blocked);
  check('a lit node takes one point', web.placed && web.ptsAfter === 10, web.ptsAfter);
  const half = Math.round((web.weak - web.bare) * 100) / 100;
  check('a weak arm pays half', Math.abs(half - 1.5) < 0.01, half);
  const tipNum = (web.tip.match(/([0-9.]+)%/) || [])[1];
  check('the tip prints the half that is paid', tipNum === '1.5', web.tip.replace(/<[^>]+>/g, ' ').slice(0, 140));
  check('refund stays shut under 5 sats', web.refundLocked);
  check('refund costs 5 and gives the points back', web.sats === 4 && web.left === 0 && web.ptsBack === 11, web.sats + ' pts ' + web.ptsBack);

  /* ---------- charms ---------- */
  const charms = await page.evaluate(() => {
    const g = __g, G = g.G, P = g.P;
    g.closeSheet(); g.setMode('play');
    G.adopt = 100; G.cpi = 1; G.charms = []; G.charmOff = 0; G.credits = 5000; G.web = {};
    G.bag = [];
    for (let i = 0; i < 7; i++) {
      const it = g.mkCharm(8); it.aff = [{k: 'dmg', v: 4}];
      g.W.drops.push({x: P.x, y: P.y, it, t: 1});
    }
    g.update(0.5);
    g.calc();
    const on = G.charms.filter(c => c.on).length;
    const rack = G.charms.length;
    const withCharm = g.S.dmg;
    g.openSheet('items');
    const head = [...document.querySelectorAll('h3')].map(e => e.textContent).find(t => /billing/.test(t)) || '';
    const m = head.match(/billing\D*(\d+)/);
    const printed = m ? +m[1] : null;
    G.chT = 0.01;
    const cred0 = G.credits;
    g.closeSheet();
    g.setMode('play');
    g.update(0.05);
    const paid = cred0 - G.credits;
    G.credits = 0; G.chT = 0.01;
    g.update(0.05);
    const lapsed = G.charmOff === 1;
    g.calc();
    const lapsedDmg = g.S.dmg;
    G.credits = 5000; G.chT = 0.01;
    g.update(0.05);
    const back = G.charmOff === 0;
    /* a thirteenth is refused. Pick the rest up one at a time so a full rack stops the loop. */
    let refused = 0;
    let guard = 0;
    while (G.charms.length < 12 && guard < 20) {
      const it = g.mkCharm(4); it.aff = [{k: 'hp', v: 5}];
      g.W.drops.push({x: P.x, y: P.y, it, t: 1});
      g.update(0.5);
      guard++;
    }
    const full = G.charms.length;
    const extra = g.mkCharm(4);
    g.W.drops.push({x: P.x, y: P.y, it: extra, t: 1});
    g.update(0.5);
    if (G.charms.length === full) refused = 1;
    return {on, rack, withCharm, printed, paid, lapsed, lapsedDmg, back, full, refused, dmgBack: g.S.dmg};
  });
  check('seven subscriptions, six running', charms.rack === 7 && charms.on === 6, charms.rack + '/' + charms.on);
  check('the bill on the sheet is what the minute charges', charms.printed === charms.paid && charms.paid === 12 * 6, charms.printed + ' vs ' + charms.paid);
  check('an unpaid minute lapses the bonuses', charms.lapsed && charms.lapsedDmg < charms.withCharm, charms.lapsedDmg + ' < ' + charms.withCharm);
  check('the next paid minute turns them back on', charms.back);
  check('the thirteenth subscription stays on the ground', charms.full === 12 && charms.refused === 1, charms.full);

  /* ---------- crafting and phrases ---------- */
  const craft = await page.evaluate(() => {
    const g = __g, G = g.G;
    G.parts = 0; G.bag = []; G.words = {}; G.st = G.st || {}; G.st.wf = G.st.wf || {}; G.st.phr = 0;
    const magic = g.makeItem(8, 1, 'gloves'); magic.id = true; magic.q = 1;
    G.bag.push(magic);
    g.openSheet('items');
    /* select the bag item and scrap through the same button the sheet draws */
    const cell = document.querySelector('[data-bag="0"]');
    if (cell) cell.click();
    return {armed: G.bag.length};
  });
  await page.waitForTimeout(300);
  await page.evaluate(() => {
    const b = document.querySelector('[data-do="scrap"]');
    if (b) b.click();
  });
  const scrapped = await page.evaluate(() => ({parts: __g.G.parts, bag: __g.G.bag.length}));
  check('scrapping a magic item pays 2 parts', scrapped.parts === 2 && scrapped.bag === 0, JSON.stringify(scrapped));

  const craft2 = await page.evaluate(() => {
    const g = __g, G = g.G;
    const it = g.makeItem(20, 2, 'weapon'); it.id = true; it.q = 2; it.aff = it.aff.length ? it.aff : [{k: 'dmg', v: 10}];
    G.bag = [it]; G.parts = 0;
    const before = JSON.stringify(it.aff);
    const refused = g.craft(it, 'reroll');
    const same = JSON.stringify(it.aff) === before && G.parts === 0;
    G.parts = 12;
    const soc0 = it.soc || 0;
    g.openSheet('items');
    return {refused, same, soc0, cost: 5 + Math.floor(it.il / 4)};
  });
  check('a reroll without parts changes nothing', craft2.refused === false && craft2.same, craft2.cost);

  const phrase = await page.evaluate(() => {
    const g = __g, G = g.G;
    G.web = {}; G.doc = null; G.charms = []; G.charmOff = 0;
    for (const s of ['weapon', 'helm', 'armor', 'gloves', 'boots', 'belt', 'ring', 'amulet']) G.eq[s] = null;
    const it = {slot: 'weapon', il: 10, q: 1, base: 'Box Cutter', name: 'Box Cutter', id: true, req: 1, aff: [], soc: 3, words: [], val: 20};
    G.eq.weapon = it;
    G.words = {kernel: 1, forge: 1, desert: 1, echo: 0};
    g.calc();
    const bare = g.S.dmg;
    g.socketWord(it, 'kernel');
    g.socketWord(it, 'forge');
    const mid = it.name;
    g.socketWord(it, 'desert');
    g.calc();
    const held = G.words.kernel;
    const named = it.name;
    const q = it.q;
    const has = it.aff.some(a => a.k === 'dmg' && a.v === 90) && it.aff.some(a => a.k === 'dmg' && a.v === 12);
    const delta = g.S.dmg - bare;
    /* word dmg 12 plus phrase dmg 90, and dmg is a percent */
    G.st = G.st || {}; G.st.wf = G.st.wf || {};
    g.closeSheet(); g.setMode('play');
    g.openSheet('codex');
    const codex = [...document.querySelectorAll('#sheet span')].map(s => s.textContent).join(' ');
    const second = g.socketWord(it, 'echo');
    return {mid, named, q, has, delta, held, phr: G.st.phr, codex: codex.indexOf('kernel → forge → desert') >= 0, echoLeft: G.words.echo};
  });
  check('words in order become Genesis', phrase.named === 'Genesis' && phrase.q === 4 && phrase.mid !== 'Genesis', phrase.named);
  check('the phrase keeps the word bonus and adds its own', phrase.has && phrase.delta >= 100, phrase.delta);
  check('socketing spends the word', phrase.held === 0 && phrase.phr === 1);
  check('the codex prints the phrase order', phrase.codex);
  check('a word you do not hold is not socketed', phrase.echoLeft === 0);

  /* ---------- doctrines, builds, respec, shift ---------- */
  const doc = await page.evaluate(() => {
    const g = __g, G = g.G, P = g.P;
    g.closeSheet(); g.setMode('play');
    G.cls = 'maxi'; G.doc = null; G.diff = 0; G.sats = 10; G.web = {}; G.charms = [];
    for (const s of ['weapon', 'helm', 'armor', 'gloves', 'boots', 'belt', 'ring', 'amulet']) G.eq[s] = null;
    G.sk = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    g.calc();
    g.openSheet('skills');
    const free = document.querySelector('[data-doc="toxic"]');
    if (free) free.click();
    const satsAfterFirst = G.sats;
    const taken = g.S.taken;
    g.S.armor = 0; g.S.dodge = 0; g.S.pdr = 0; g.S.enc = 0; P.inv = 0; P.barrier = 0; G.god = false; G.hp = 1000;
    g.setMode('play');
    g.hurt(100, false, {dty: 'impact', name: 'measure', pvp: 1, hp: 1, mods: {}});
    const landed = Math.round(1000 - G.hp);
    g.openSheet('skills');
    const line = (document.querySelector('[data-doc="toxic"]') || {}).innerText || '';
    const second = document.querySelector('[data-doc="node"]');
    if (second) second.click();
    const satsAfter = G.sats;
    g.closeSheet();
    /* out of town the next change is refused */
    g.enter(1);
    g.setMode('play');
    const docNow = G.doc;
    g.openSheet('skills');
    const wild = document.querySelector('[data-doc="thinkboi"]');
    if (wild) wild.click();
    return {satsAfterFirst, taken, landed, line: line.replace(/\s+/g, ' '), satsAfter, stayed: G.doc === docNow, doc: G.doc};
  });
  await clearUI(page);
  check('the first doctrine is free', doc.satsAfterFirst === 10, doc.satsAfterFirst);
  check('toxic prints +25% damage taken and deals it', doc.taken === 1.25 && doc.landed === 125 && doc.line.indexOf('25%') >= 0, doc.taken + ' landed ' + doc.landed + ' ' + doc.line.slice(0, 180));
  check('changing doctrine in town costs 3 sats', doc.satsAfter === 7, doc.satsAfter);
  check('a doctrine does not change outside town', doc.stayed && doc.doc === 'node', doc.doc);

  const built = await page.evaluate(() => {
    const g = __g, G = g.G;
    const out = [];
    G.sats = 80; G.act2 = true; G.act3 = true; G.lvl = 40;
    const skSpent = L => L <= 5 ? L : 5 + (L - 5) * 2;
    for (const cls of Object.keys(g.BUILDS)) {
      for (const b of g.BUILDS[cls]) {
        const pool = (40 - 1) + 1; /* level points plus the starting rank, which shapeShift folds in */
        G.sp = 39; G.ap = 39 * 5; G.sk = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        G.at = {mgt: 0, ref: 0, vit: 0, bnd: 0}; G.web = {}; G.cls = 'scrapper';
        G.sats = 80; G.st = G.st || {}; G.st.wf = G.st.wf || {};
        const sats = G.sats;
        g.shapeShift(cls, b.k);
        const spent = G.sk.reduce((a, n) => a + skSpent(n), 0);
        const at = G.at.mgt + G.at.ref + G.at.vit + G.at.bnd;
        const over = G.sk.some((n, i) => n > 10 || n < 0);
        const docOk = G.doc === b.doc;
        out.push({cls, k: b.k, pool: G.sp + spent, at, over, docOk, sats: sats - G.sats, sp: G.sp});
      }
    }
    return out;
  });
  await clearUI(page);
  const badBuild = built.filter(b => b.pool !== 40 || b.at !== 195 || b.over || !b.docOk || b.sats !== 5);
  check('every build spends the points it was given and its doctrine', badBuild.length === 0, badBuild.slice(0, 3).map(b => b.cls + '/' + b.k + ' pool ' + b.pool + ' at ' + b.at + ' doc ' + b.docOk).join('; '));

  const respec = await page.evaluate(() => {
    const g = __g, G = g.G;
    g.enter(0); g.setMode('play');
    G.cls = 'scrapper'; G.lvl = 10; G.cpi = 2; G.credits = 5000; G.sats = 3;
    G.sk = [7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    G.sp = 0; G.at = {mgt: 4, ref: 0, vit: 0, bnd: 0}; G.ap = 1;
    G.q = G.q || {}; G.q.q4 = 3; G.q.q7 = 0;
    g.closeSheet(); g.setMode('play');
    g.talkTo('null');
    const btn = [...document.querySelectorAll('#dBtns button')].find(b => /Unlearn/.test(b.textContent));
    const label = btn ? btn.textContent : '';
    const cost = label.match(/₡([0-9.]+)/);
    return {label, cost: cost ? cost[1] : ''};
  });
  /* dialog from town is not locked; click it */
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('#dBtns button')].find(x => /Unlearn/.test(x.textContent));
    if (b && !b.disabled) b.click();
  });
  const respecd = await page.evaluate(() => {
    const G = __g.G;
    const skSpent = L => L <= 5 ? L : 5 + (L - 5) * 2;
    return {sp: G.sp, ap: G.ap, sk: G.sk[0], credits: G.credits, expect: skSpent(7)};
  });
  check('Sister Null prints the fee she charges', respec.cost === '3.00' || respec.cost === '3000' || respec.label.indexOf('3,000') >= 0 || respec.label.indexOf('3.00K') >= 0 || /₡3/.test(respec.label), respec.label);
  /* payTag(150 * 2 * 10) = 3000. fmt of 3000 is ₡3.00K */
  const feeOk = respecd.credits === 2000;
  check('unlearning charges that fee', feeOk, respecd.credits);
  check('ranks 1-7 come back as 9 points, attributes too', respecd.sp === 9 && respecd.ap === 5 && respecd.sk === 0, JSON.stringify(respecd));
  await clearUI(page);

  const locked = await page.evaluate(() => {
    const g = __g, G = g.G;
    G.rec = 0; G.act3 = false; G.st.shifts = 0; G.q.q8 = 0; G.sats = 20; G.cls = 'scrapper';
    g.talkTo('vr');
    const buttons = [...document.querySelectorAll('#dBtns button')].map(b => b.textContent);
    const hack = buttons.find(t => /Hack the simulation/.test(t));
    return {buttons, hack, ok: g.recOk()};
  });
  check('class change stays locked without the record', locked.ok === false && /locked/i.test(locked.hack || ''), locked.hack);
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('#dBtns button')].find(x => /locked/i.test(x.textContent));
    if (b) b.click();
  });
  const lockedDlg = await page.evaluate(() => document.getElementById('dT') ? document.getElementById('dT').textContent : '');
  check('the rig says why it is locked', /cannot/i.test(lockedDlg), lockedDlg);
  await clearUI(page);
  const shift = await page.evaluate(() => {
    const g = __g, G = g.G;
    G.sats = 4; const cls = G.cls;
    g.shapeShift('hacker', false);
    const blocked = G.cls === cls && G.sats === 4;
    G.sats = 20; G.rec = 1; G.lvl = 8; G.sp = 7; G.sk = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    g.shapeShift('hacker', false);
    return {blocked, cls: G.cls, sats: G.sats, sp: G.sp, sk0: G.sk[0]};
  });
  await clearUI(page);
  check('a shift without 5 sats does nothing', shift.blocked);
  check('a paid shift changes class and keeps the point pool', shift.cls === 'hacker' && shift.sats === 15, shift.cls + ' ' + shift.sats + ' sp ' + shift.sp);

  /* ---------- paragon ---------- */
  const para = await page.evaluate(() => {
    const g = __g, G = g.G;
    G.act2 = true; G.act3 = false; G.act4 = false; G.act5 = false; G.para = 0; G.px = 0; G.bankXp = 0; G.lvl = 25; G.xp = 0;
    /* below the cap, experience is kept */
    g.gainXp(50);
    const kept = G.xp === 50 && (G.para || 0) === 0 && !(G.bankXp > 0);
    G.act2 = true; G.act3 = false; G.lvl = 50; G.xp = 0; G.bankXp = 0; G.para = 0;
    g.gainXp(1000);
    const banked = (G.para || 0) === 0 && G.xp === 0 && G.bankXp === 1000;
    g.gainXp(1e12);
    const full = G.bankXp;
    g.gainXp(1e12);
    const oneBar = Math.round(60 * Math.pow(50, 1.75));
    const capped = full === oneBar && G.bankXp === full && (G.para || 0) === 0;
    G.act3 = true;
    g.flushBank();
    const paid = (G.bankXp || 0) === 0 && G.lvl === 51 && (G.para || 0) === 0;
    G.act3 = true; G.act4 = false; G.act5 = false; G.lvl = 75; G.xp = 0; G.bankXp = 0; G.para = 0; G.px = 0; G.web = {};
    const dmg0 = (g.calc(), g.S.dmg);
    const hp0 = g.S.maxHp;
    g.gainXp(1e9);
    const p = G.para;
    g.calc();
    return {kept, banked, capped, paid, full, oneBar, p, dmg: g.S.dmg - dmg0, hp: g.S.maxHp - hp0, pts: g.webPts(), cap: p};
  });
  check('experience under the level cap is kept', para.kept);
  check('tenure waits for Act III', para.banked && para.capped && para.paid, JSON.stringify(para));
  check('one tenure is +1% damage, +1% life, and a web point', para.p >= 1 && para.dmg === para.p && para.pts === (75 - 1 + para.p), JSON.stringify(para));
  finding.push('Tenure life is +' + para.hp + ' at +' + para.p + ' tenure on a level-75 hero (1% of max life, rounded). Damage is +' + para.dmg + '%.');

  /* ---------- difficulty ---------- */
  const diff = await page.evaluate(() => {
    const g = __g, G = g.G, P = g.P;
    G.lvl = 8;
    g.enter(1, {fresh: true}); g.setMode('play'); P.inv = 0;
    G.diff = 0; G.tier = 0; G.maxTier = 0; G.q.q5 = 0; G.bossKills = 0;
    g.W.ents = [];
    const put = () => {
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [2, 0], [0, 2]]) {
        const e = g.spawn('bot', P.x + dx, P.y + dy, {});
        if (e) return e;
      }
      return null;
    };
    const a = put();
    const hpN = a ? a.max : 0;
    G.diff = 1;
    const b = put();
    const hpH = b ? b.max : 0;
    const oldStill = a ? a.max : 0;
    G.diff = 2;
    const res = g.resPen();
    const row = () => [0, 1, 2].map(i => {
      const el = document.querySelector('[data-diff="' + i + '"]');
      return el ? (el.disabled ? 'off' : 'on') : 'missing';
    });
    G.diff = 0; G.diffGate = 0;
    g.setMode('play');
    g.openSheet('opts');
    const locked = row();
    const hint = (document.getElementById('diffHint') || {}).textContent || '';
    G.diffGate = 2;
    g.drawSheet();
    const open = row();
    g.closeSheet();
    G.diffMigrated = 0; G.diffGate = 0; G.diff = 0; G.bk = {boss5: 1};
    g.migrateDiff();
    const migKill = G.diffGate;
    G.diffMigrated = 0; G.diffGate = 0; G.diff = 2; G.bk = {};
    g.migrateDiff();
    const migBrutal = G.diffGate;
    G.diffMigrated = 0; G.diffGate = 0; G.diff = 1; G.bk = {};
    g.migrateDiff();
    const migHard = G.diffGate;
    G.diffMigrated = 0; G.diffGate = 0; G.diff = 0; G.bk = {};
    g.migrateDiff();
    const migFresh = G.diffGate;
    g.enter(0); g.setMode('play');
    g.talkTo('gate');
    return {
      hpN, hpH, oldStill,
      ratio: hpN ? Math.round(hpH / hpN * 100) / 100 : 0,
      locked, open, hint, migKill, migBrutal, migHard, migFresh, res
    };
  });
  await clearUI(page);
  check('Hard life is 1.8/1.25 of Normal on a new spawn', Math.abs(diff.ratio - 1.8 / 1.25) < 0.02, diff.ratio + ' from ' + diff.hpN + '/' + diff.hpH);
  check('a machine already in the room keeps its old life', diff.oldStill === diff.hpN);
  check('Hard and Brutal stay locked until Act V is cleared', diff.locked.join(',') === 'on,off,off' && /Hard opens after you clear Act V on Normal/.test(diff.hint) && /Brutal opens after you clear Act V on Hard/.test(diff.hint), diff.locked.join(',') + ' ' + diff.hint);
  check('a cleared gate puts every difficulty on the row', diff.open.join(',') === 'on,on,on', diff.open.join(','));
  check('an old PROVIDENCE kill keeps Hard, and a hero already on a difficulty keeps it', diff.migKill === 1 && diff.migBrutal === 2 && diff.migHard === 1 && diff.migFresh === 0, JSON.stringify(diff));
  check('Brutal cuts resists by 50', diff.res === 50, diff.res);
  finding.push('Hard opens after Act V on Normal. Brutal opens after Act V on Hard. An old save that already killed PROVIDENCE keeps Hard, and a hero already standing on Hard or Brutal keeps that choice.');

  const tier = await page.evaluate(() => {
    const g = __g, G = g.G;
    G.q.q5 = 0; G.bossKills = 0; G.maxTier = 0; G.tier = 0; G.lvl = 1;
    g.enter(0); g.setMode('play');
    g.openSheet('travel', {gFresh: 1});
    const more = document.querySelector('[data-gact="6"]');
    if (more && !more.disabled) more.click();
    const hidden = !document.querySelector('[data-tier="1"]');
    G.bossKills = 1; G.q.q5 = 3; G.maxTier = 1;
    g.setMode('play');
    g.openSheet('travel', {gFresh: 1});
    const more2 = document.querySelector('[data-gact="6"]');
    if (more2 && !more2.disabled) more2.click();
    const up = document.querySelector('[data-tier="1"]');
    const zoneLevel = z => { const b = z.lvl + (G.tier || 0) * 12; return g.OPT.dyn ? Math.max(b, G.lvl) : b; };
    const lvl0 = zoneLevel(g.ZONES[3]);
    if (up && !up.disabled) up.click();
    const lvl1 = zoneLevel(g.ZONES[3]);
    return {hidden, showed: !!up, lvl0, lvl1, tier: G.tier};
  });
  check('the tier row is hidden until Act I is done', tier.hidden);
  check('one Pryce kill opens a harder tier and adds 12 levels', tier.showed && tier.tier === 1 && tier.lvl1 === tier.lvl0 + 12, tier.lvl0 + ' → ' + tier.lvl1);

  /* ---------- market ---------- */
  const mkt = await page.evaluate(() => {
    const g = __g, G = g.G;
    G.adopt = 100; G.cpi = 1; G.credits = 100000; G.sats = 30; G.mkt = null;
    g.closeSheet(); g.setMode('play');
    if (!g.W || !g.W.z || !g.W.z.town) g.enter(0);
    g.mktInit();
    g.openSheet('sats');
    const row = [...document.querySelectorAll('.tot')].find(e => /Buy \d+ sats/.test(e.textContent));
    const label = row ? row.textContent.replace(/\s+/g, ' ') : '';
    const n = +((label.match(/Buy (\d+)/) || [])[1] || 0);
    const shown = row && row.querySelector('b') ? row.querySelector('b').textContent : '';
    const q = g.mktQuote(n || 1, 'buy');
    const fmtN = v => { const U = ['', 'K', 'M', 'B', 'T']; let i = 0, x = v; while (x >= 1000 && i < U.length - 1) { x /= 1000; i++; } return '₡' + (i ? x.toFixed(x < 10 ? 2 : x < 100 ? 1 : 0) : Math.floor(x)) + U[i]; };
    const cred0 = G.credits, sat0 = G.sats;
    const btn = document.querySelector('[data-mkt="b"]');
    if (btn && !btn.disabled) btn.click();
    const spent = cred0 - G.credits, got = G.sats - sat0;
    /* cancel restores a posted bid */
    const mid = g.mktMid();
    const posted = g.mktPost(2, mid * 0.5, 'buy');
    const held = G.credits;
    g.mktCancel(0);
    const restored = G.credits - held;
    const afford = g.mktAfford();
    const purse = G.credits;
    const bought = g.mktTrade(afford, 'buy');
    const leftover = G.credits;
    const again = g.mktAfford();
    return {label, shown, expect: fmtN(q.total), n, total: q.total, spent, got, posted, restored, afford, bought: !!bought, leftover, again, neg: G.sats < 0 || G.credits < 0};
  });
  check('the buy line matches the credits the purse loses', mkt.n > 0 && mkt.got === mkt.n && mkt.spent === mkt.total && mkt.shown === mkt.expect, mkt.shown + ' vs ' + mkt.expect + ' spent ' + mkt.spent);
  check('withdrawing a bid returns the credits it held', mkt.posted && mkt.restored > 0, mkt.restored);
  check('buy-with-everything spends a whole number and stops', mkt.bought && mkt.again === 0 && mkt.leftover >= 0 && !mkt.neg, 'afford ' + mkt.afford + ' left ' + mkt.leftover);

  const loan = await page.evaluate(() => {
    const g = __g, G = g.G;
    G.sats = 40; G.credits = 0; G.mkt.pos = null; G.mkt.ord = [];
    g.setMode('play');
    g.openSheet('sats');
    const bits = [...document.querySelectorAll('.tick div')].map(e => e.innerText.replace(/\s+/g, ' '));
    const handBit = bits.find(t => /hands you/.test(t)) || '';
    const hand = (handBit.match(/([0-9]+(?:\.[0-9]+)?)/g) || []).pop();
    const pledge = ((bits.find(t => /Pledge/.test(t)) || '').match(/(\d+)/) || [])[1];
    const beforeS = G.sats, beforeC = G.credits;
    const b = document.querySelector('[data-mkb]');
    if (b && !b.disabled) b.click();
    const lent = G.credits - beforeC, sats = beforeS - G.sats;
    return {hand, handBit, pledge, lent, sats, pos: G.mkt.pos && G.mkt.pos.n};
  });
  await clearUI(page);
  check('the pledge on the sheet is what he takes', loan.pledge && +loan.pledge === loan.sats && loan.pos === loan.sats, loan.pledge + ' took ' + loan.sats);
  finding.push('Mr. Float\'s sheet prints “' + loan.handBit + '” and the purse gained ' + loan.lent + '. The label uses the same abbreviation as every other credit figure.');

  /* ---------- simulator, rush, subpoena ---------- */
  const sim = await page.evaluate(() => {
    const g = __g, G = g.G, P = g.P;
    const deaths = G.deaths || 0, credits = G.credits;
    G.sats = 50;
    g.enter(6, {wave: 1});
    const P2 = g.P;
    g.setMode('play');
    const wave = g.W.sim && g.W.sim.wave;
    /* force the countdown */
    g.W.ents = [];
    g.W.sim.t = 0.01; g.W.sim.wave = 0; g.W.sim.paid = 0;
    g.update(0.05);
    const wave1 = g.W.sim.wave;
    G.diff = 0;
    const simN = g.spawn('bot', P2.x + 1.2, P2.y, {});
    G.diff = 2;
    const simB = g.spawn('bot', P2.x - 1.2, P2.y, {});
    const simRatio = simN && simB && simN.max ? Math.round(simB.max / simN.max * 100) / 100 : 0;
    const best = G.simBest || 0;
    P2.inv = 0; G.god = false; G.hp = 1; G.chuteT = 1; G.stillT = 1; G.keyT = 1; G.retractT = 1;
    g.setMode('play');
    g.hurt(50000, false, {name: 'the floor', dty: 'impact'});
    const died = (G.deaths || 0) !== deaths;
    const fee = G.credits !== credits ? G.credits - credits : 0;
    const box = document.getElementById('dlg');
    const dlg = box && !box.hidden && document.getElementById('dT') ? document.getElementById('dT').textContent : '';
    return {wave, wave1, best, died, fee, dlg, hp: G.hp, mode: g.mode, sim: !!(g.W.z && g.W.z.sim), simRatio};
  });
  check('the simulator starts a wave', sim.wave1 === 1, sim.wave1);
  check('the simulator uses the selected difficulty', Math.abs(sim.simRatio - 2.6 / 1.25) < 0.02, sim.simRatio);
  check('falling there does not count a death or a fee', sim.died === false && sim.fee === 0 && /Simulation ended/.test(sim.dlg), sim.dlg + ' fee ' + sim.fee + ' hp ' + sim.hp + ' mode ' + sim.mode);
  await clearUI(page);

  const rush = await page.evaluate(() => {
    const g = __g, G = g.G;
    G.unlocked = 1; G.bossKills = 0; G.q = {};
    for (let i = 1; i <= 25; i++) G.q['q' + i] = 0;
    G.rushDone = false; G.sats = 11;
    /* every feat already counts as done, so the wait cannot mint a sat */
    G.ach = new Proxy({}, {get: () => 1, set: () => true});
    g.enter(0);
    g.talkTo('vr');
    const label = [...document.querySelectorAll('#dBtns button')].map(b => b.textContent).find(t => /Boss rush/.test(t)) || '';
    const start = document.querySelector('#dBtns button');
    /* close and enter the empty rush directly, the way the button would */
    return {label, sats: G.sats};
  });
  await clearUI(page);
  const rushRun = await page.evaluate(() => {
    const g = __g, G = g.G;
    const before = G.sats;
    G.ach = new Proxy({}, {get: () => 1, set: () => true});
    g.enter(6, {rush: true});
    g.setMode('play');
    const n = g.W.sim && g.W.sim.list ? g.W.sim.list.length : -1;
    g.update(3);
    return {before, after: G.sats, n, done: !!G.rushDone, title: document.getElementById('dT') ? document.getElementById('dT').textContent : ''};
  });
  check('an empty boss rush is offered as empty', /0 in a row|nobody/i.test(rush.label), rush.label);
  check('an empty boss rush does not pay sats', rushRun.n === 0 && rushRun.after === rushRun.before && !rushRun.done, JSON.stringify(rushRun));
  await clearUI(page);

  const sub = await page.evaluate(() => {
    const g = __g, G = g.G, P = g.P;
    G.q.q5 = 3; G.sats = 2; G.parts = 0; G.subMax = 1; G.lvl = 20; G.tier = 0;
    g.enter(0); g.setMode('play');
    const broke = (g.subStart(1), G.sats);
    G.sats = 10;
    g.subStart(1);
    const paid = G.sats;
    const mods = g.W.sub ? g.W.sub.mods.slice() : [];
    const su = (g.W.ents || []).find(e => e.su);
    return {broke, paid, mods, had: !!su, inSub: !!(g.W.z && g.W.z.sub)};
  });
  await clearUI(page);
  check('a subpoena costs 3 sats and refuses when short', sub.broke === 2 && sub.paid === 7, sub.broke + ' then ' + sub.paid);
  const served = await page.evaluate(() => {
    const g = __g, G = g.G;
    const su = g.W.ents.find(e => e.su);
    const before = G.sats, parts = G.parts || 0;
    if (su) g.kill(su);
    return {before, after: G.sats, parts: G.parts, deltaP: (G.parts || 0) - parts, subMax: G.subMax, had: !!su};
  });
  check('serving level 1 pays the 8 sats and 3 parts on the button', served.had && served.after - served.before === 8 && served.deltaP === 3 && served.subMax >= 2, JSON.stringify(served));
  finding.push('Subpoena mods this run: ' + (sub.mods || []).join(', ') + '. The button\'s +15% life is before a Thick rule, which is named in the entry dialog.');

  /* ---------- lockbox ---------- */
  const box = await page.evaluate(() => {
    const g = __g, G = g.G;
    g.enter(0); g.setMode('play');
    G.sats = 25; G.credits = 1000; G.cpi = 1; G.bag = [];
    const it = g.makeItem(5, 2, 'ring'); it.id = true; it.test = 0; G.bag.push(it);
    const test = g.makeItem(5, 2, 'helm'); test.id = true; test.test = 1; G.bag.push(test);
    g.ACC.sats = 0; g.ACC.cr = 0; g.ACC.stash = [];
    g.talkTo('stash');
    const dep = document.querySelector('[data-acc="si10"]');
    if (dep) dep.click();
    const put = document.querySelector('[data-sb="0"]');
    if (put) put.click();
    const testBtn = document.querySelector('[data-sb="0"]');
    if (testBtn) testBtn.click();
    const half = document.querySelector('[data-acc="ciall"]');
    if (half) half.click();
    const shown = document.body.innerText.match(/Credits[\s\S]{0,40}/);
    const mem = {sats: g.ACC.sats, cr: g.ACC.cr, gear: g.ACC.stash.length, playerSats: G.sats, playerCr: G.credits, bag: G.bag.length};
    let raw = null;
    try { raw = JSON.parse(localStorage.getItem('unsub2087acct') || 'null'); } catch (e) { raw = {err: String(e)}; }
    return {mem, raw: raw && {sats: raw.sats, stash: (raw.stash || []).length, cr: raw.cr}, shown: shown ? shown[0].replace(/\s+/g, ' ') : ''};
  });
  check('ten sats go into the lockbox and stay on the save', box.mem.sats === 10 && box.mem.playerSats === 15 && box.raw && box.raw.sats === 10, JSON.stringify(box.mem));
  check('a real ring moves across and a test copy does not', box.mem.gear === 1 && box.mem.bag === 1, JSON.stringify(box.mem));
  check('depositing credits keeps 90% and the sheet agrees', box.mem.playerCr === 0 && Math.abs(box.mem.cr - 900) < 0.01, box.mem.cr + ' ' + box.shown);
  await clearUI(page);

  /* ---------- save / old save / companion ---------- */
  const saved = await page.evaluate(() => {
    const g = __g, G = g.G;
    G.web = {'0_1': 1, '0_2': 1}; G.diff = 2; G.tier = 1; G.para = 3; G.words = {kernel: 2};
    G.charms = [{slot: 'charm', charm: 1, q: 1, il: 4, id: true, name: 'Lapsed Streaming Subscription', aff: [{k: 'hp', v: 8}], on: true, val: 40}];
    G.doc = 'picket'; G.sats = 17;
    const ok = g.save(true);
    const blob = JSON.parse(localStorage.getItem('unsub2087v3'));
    /* reload onto a fresh object */
    const snap = JSON.parse(JSON.stringify(blob));
    g.applySave(snap);
    g.setMode('play');
    const G2 = g.G;
    return {
      ok, web: G2.web && G2.web['0_2'], diff: G2.diff, tier: G2.tier, para: G2.para,
      word: G2.words && G2.words.kernel, charm: (G2.charms || []).length, doc: G2.doc, sats: G2.sats
    };
  });
  check('the browser slot keeps the ledger, charms, words, doctrine, tenure, and tier', saved.ok && saved.web && saved.diff === 2 && saved.tier === 1 && saved.para === 3 && saved.word === 2 && saved.charm === 1 && saved.doc === 'picket' && saved.sats === 17, JSON.stringify(saved));

  const old = await page.evaluate(() => {
    const g = __g;
    const o = {G: {cls: 'scrapper', lvl: 6, xp: 0, sp: 2, ap: 3, sk: [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], slots: [0, 1, -1], at: {mgt: 1, ref: 0, vit: 1, bnd: 0}, hp: 80, en: 40, credits: 20, cpi: 1.2, stims: 1, bag: [{slot: 'charm', charm: 1, name: 'old sub', aff: [{k: 'mf', v: 3}], on: 1, q: 1, id: true, val: 10}], eq: {}, unlocked: 7, kills: 4, deaths: 1, sats: 2, q: {q1: 3, q5: 3}, bossKills: 1, zone: 0}, zs: {}, cur: null, opt: {}, t: 1};
    let threw = '';
    try { g.applySave(o); } catch (e) { threw = e.message; }
    /* startPlay runs ensureG, which is what a real load does */
    try { g.startPlay(); } catch (e) { threw += e.message; }
    const G = g.G;
    return {threw, diff: G.diff || 0, web: G.web && typeof G.web === 'object', charms: (G.charms || []).length, bagCharm: (G.bag || []).some(i => i && i.charm), maxTier: G.maxTier, tier: G.tier, hp: G.hp > 0};
  });
  await clearUI(page);
  check('an old save without the new fields loads', !old.threw && old.web && old.diff === 0 && old.hp, old.threw || JSON.stringify(old));
  check('a charm left in the old pack moves onto the rack', old.charms === 1 && old.bagCharm === false, JSON.stringify(old));
  check('an Act I clear on an old save still unlocks a tier', old.maxTier >= 1, old.maxTier);

  const comp = await page.evaluate(() => {
    const g = __g, G = g.G;
    g.enter(0); g.setMode('play');
    const alt = g.saveObj();
    alt.G = JSON.parse(JSON.stringify(alt.G));
    alt.G.cls = 'hacker'; alt.G.lvl = 15; alt.G.sk = [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; alt.G.slots = [0, 1, -1];
    localStorage.setItem('unsub2087v3_1', JSON.stringify(alt));
    G.sats = 30; G.tag = null; G.merc = null;
    g.talkTo('vr');
    const label = [...document.querySelectorAll('#dBtns button')].map(b => b.textContent).find(t => /Render/.test(t)) || '';
    return {label};
  });
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('#dBtns button')].find(x => /Render/.test(x.textContent));
    if (b && !b.disabled) b.click();
  });
  const compMenu = await page.evaluate(() => {
    const text = document.getElementById('dP') ? document.getElementById('dP').textContent : '';
    const btn = [...document.querySelectorAll('#dBtns button')].map(b => b.textContent).find(t => /Render level/.test(t)) || '';
    return {text: text.slice(0, 80), btn};
  });
  const costMatch = (compMenu.btn.match(/(\d+) sats/) || [])[1];
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('#dBtns button')].find(x => /Render level/.test(x.textContent));
    if (b && !b.disabled) b.click();
  });
  await clearUI(page);
  const compOn = await page.evaluate(() => {
    const g = __g, G = g.G, P = g.P;
    g.setMode('play'); P.inv = 0;
    const cost = 3 + Math.floor(15 / 15);
    const tag = !!(g.W.tag && g.W.tag.hp > 0) || !!G.tag;
    /* pressure: the same blow deals less while they are rendered */
    /* A deadly strike doubles one swing and hides the party divisor. These swings cannot crit. */
    g.S.crit = 0; g.S.critM = 1;
    const swings = () => {
      g.W.ents = [];
      const e = g.spawn('bot', P.x + 0.8, P.y, {});
      if (!e) return 0;
      e.hp = e.max = 100000; e.stun = 99;
      let sum = 0;
      for (let i = 0; i < 8; i++) {
        const hp0 = e.hp;
        g.hit(e, 1, true);
        sum += hp0 - e.hp;
        e.hp = 100000;
      }
      return sum;
    };
    const dealt = swings();
    g.tagDismiss(1);
    g.setMode('play');
    const gone = !G.tag && !(g.W && g.W.tag);
    const dealtAlone = swings();
    g.save(true);
    const blob = JSON.parse(localStorage.getItem('unsub2087v3'));
    return {tag, gone, dealt, dealtAlone, savedTag: !!(blob.G && blob.G.tag), sats: G.sats, cost};
  });
  check('the rig offers the other character at the printed cost', costMatch === '4', compMenu.btn);
  check('rendering them spends that cost and they stand in the room', compOn.tag && compOn.sats === 30 - 4, compOn.sats);
  check('two of you makes the same blow deal less', compOn.dealt > 0 && compOn.dealt < compOn.dealtAlone * 0.8, compOn.dealt + ' vs ' + compOn.dealtAlone);
  check('sending them back clears the save', compOn.gone && compOn.savedTag === false);

  /* caps, since the new items are in this build */
  const caps = await page.evaluate(() => {
    const g = __g, G = g.G, P = g.P;
    G.diff = 2; G.god = false; P.inv = 0; P.barrier = 0; G.web = {}; G.doc = null; G.charms = [];
    for (const s of ['weapon', 'helm', 'armor', 'gloves', 'boots', 'belt', 'ring', 'amulet']) G.eq[s] = null;
    g.calc();
    g.S.armor = 0; g.S.dodge = 0; g.S.taken = 1; g.S.enc = 0;
    for (const k of ['impact', 'surge', 'rust', 'heat', 'noise']) g.S['r_' + k] = 0;
    const hit = pdr => { g.S.pdr = pdr; G.hp = 1000; P.inv = 0; g.setMode('play'); g.hurt(200, false, {dty: 'impact', name: 'cap', pvp: 1, hp: 1, mods: {}}); return Math.round(1000 - G.hp); };
    g.S.r_heat = 90; G.diff = 1;
    return {p0: hit(0), p40: hit(40), p80: hit(80), hard: g.resOf('heat'), pen: g.resPen()};
  });
  check('damage reduction stops at 50 even if the item says 80', caps.p80 === Math.round(caps.p0 * 0.5) && caps.p80 < caps.p40, caps.p0 + '/' + caps.p40 + '/' + caps.p80);
  check('Hard resist cut matches the sheet rule', caps.pen === 20 && caps.hard === 70, caps.hard);

  if (errs.length) check('the page stayed up', false, errs.slice(0, 3).join(' | '));
  else check('the page stayed up', true);

  await browser.close();
  console.log('\n' + note.length + ' passed, ' + fail.length + ' failed');
  if (finding.length) {
    console.log('FINDINGS');
    finding.forEach(f => console.log('- ' + f));
  }
  if (fail.length) process.exit(1);
})().catch(e => { console.error(e); process.exit(1); });
