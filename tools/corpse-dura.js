/* Corpse runs, the credit share on the body, and durability.
   node tools/corpse-dura.js */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const OUT = '/opt/cursor/artifacts';
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const html = fs.readFileSync(path.join(root, 'dist/unsubscribe.html'), 'utf8');
  const fail = [];
  const check = (n, ok, d) => { if (!ok) fail.push(n + (d ? ': ' + d : '')); else console.log('ok', n); };
  const b = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || '/usr/local/bin/google-chrome', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const p = await b.newPage({ viewport: { width: 1100, height: 760 } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">' + html + '</body></html>');
  await p.waitForTimeout(400);
  await p.evaluate(() => { __g.skipDisc(); __g.OPT.noWalk = 1; __g.OPT.minimap = true; });
  await p.evaluate(() => { document.getElementById('title').hidden = true; __g.newGame('scrapper'); __g.G.pre = 2; __g.G.walkNew = 0; __g.OPT.noWalk = 1; });
  for (let i = 0; i < 12; i++) {
    await p.evaluate(() => {
      const s = document.getElementById('scene'); if (s && !s.hidden) document.getElementById('scSkip').click();
      const d = document.getElementById('dlg'); if (d && !d.hidden) { const x = d.querySelector('#dBtns button:not([disabled])'); x && x.click(); }
    });
    await p.waitForTimeout(50);
  }
  await p.evaluate(() => __g.enter(0));
  await p.waitForTimeout(200);
  await p.evaluate(() => {
    const d = document.getElementById('dlg'); if (d && !d.hidden) { const x = d.querySelector('#dBtns button:not([disabled])'); x && x.click(); }
    __g.setMode('play'); __g.G.god = false;
  });

  const rates = await p.evaluate(() => {
    const g = __g.G, lvl = g.lvl, diff = g.diff;
    const read = (L, D) => { g.lvl = L; g.diff = D; return +__g.deathCreditPct().toFixed(4); };
    const out = { l1: read(1, 0), l40: read(40, 0), hard: read(40, 1), brutal: read(40, 2), mid: read(20, 0) };
    g.lvl = lvl; g.diff = diff;
    return out;
  });
  check('level 1 Normal drops four percent', rates.l1 === 0.04, JSON.stringify(rates));
  check('level 40 Normal drops twenty percent', rates.l40 === 0.2, JSON.stringify(rates));
  check('Hard at the cap is thirty-five percent', rates.hard === 0.35, JSON.stringify(rates));
  check('Brutal at the cap is fifty percent', rates.brutal === 0.5, JSON.stringify(rates));
  check('the rate climbs between the floor and the cap', rates.mid > 0.04 && rates.mid < 0.2, JSON.stringify(rates));

  const dura = await p.evaluate(() => {
    const g = __g;
    for (const sl of ['weapon', 'helm', 'armor', 'gloves', 'boots', 'belt', 'ring', 'amulet']) g.G.eq[sl] = null;
    g.G.cslots = []; g.G.bag = [];
    const w = g.makeItem(4, 1, 'weapon'); w.dmin = 14; w.dmax = 22; w.id = true;
    const helm = g.makeItem(4, 1, 'helm'); helm.id = true;
    const gloves = g.makeItem(4, 1, 'gloves'); gloves.id = true;
    g.G.eq.weapon = w; g.G.eq.helm = helm; g.G.eq.gloves = gloves;
    g.calc();
    const armed = g.S.dmin;
    const maxW = w.duraMax, maxH = helm.duraMax;
    const before = w.dura;
    for (let i = 0; i < 8; i++) g.wearWeapon();
    const chipped = before - w.dura;
    helm.dura = helm.duraMax; gloves.dura = gloves.duraMax;
    const arm0 = helm.dura + gloves.dura;
    g.wearArmor(); g.wearArmor();
    const helmLost = arm0 - (helm.dura + gloves.dura);
    w.dura = 1; g.wearSlot('weapon'); g.calc();
    const broken = { dmin: g.S.dmin, dmax: g.S.dmax, dura: w.dura, broken: g.itemBroken(w) };
    const quote = g.repairQuote(w);
    const field = g.repairOne(w);
    const satsField = g.G.sats;
    w.dura = Math.ceil(w.duraMax * 0.2);
    helm.dura = 0;
    g.G.sats = 40;
    return { armed, maxW, maxH, chipped, helmLost, broken, quote, field, satsField, thin: w.dura <= w.duraMax * 0.25, red: helm.dura <= 0, sats: g.G.sats };
  });
  check('a weapon raises damage above a bare hand', dura.armed > 4, JSON.stringify(dura));
  check('weapons and armor are stamped with durability', dura.maxW >= 56 && dura.maxH >= 42, JSON.stringify(dura));
  check('eight connecting swings cost one weapon point', dura.chipped === 1, JSON.stringify(dura));
  check('armor loses a point every other hit', dura.helmLost === 1, JSON.stringify(dura));
  check('a broken weapon gives a bare hand', dura.broken.dmin === 2 && dura.broken.dmax === 4 && dura.broken.broken && dura.broken.dura === 0, JSON.stringify(dura));
  check('repair is a whole number of sats', dura.quote >= 1 && dura.quote === Math.round(dura.quote), JSON.stringify(dura));
  check('a district cannot repair', dura.field === 0, JSON.stringify(dura));

  await p.evaluate(() => { __g.enter(0); __g.setMode('play'); });
  await p.waitForTimeout(150);
  const repaired = await p.evaluate(() => {
    const g = __g;
    const w = g.G.eq.weapon, helm = g.G.eq.helm;
    const q1 = g.repairQuote(w);
    g.G.sats = 40;
    const before = g.G.sats;
    g.openSheet('items');
    return { q1, before, town: !!(g.W.z && g.W.z.town), dura: w.dura, helm: helm.dura };
  });
  check('town is where repair happens', repaired.town, JSON.stringify(repaired));
  await p.click('[data-eq="weapon"]');
  await p.waitForTimeout(80);
  const card = await p.evaluate(() => (document.getElementById('popIn') || document.getElementById('sheetIn')).innerText);
  check('the weapon card names durability', /Durability:/.test(card), card.slice(0, 400));
  const btn = await p.$('[data-repair="one"]');
  check('the worn piece offers Repair', !!btn, card.slice(-200));
  if (btn) await btn.click();
  await p.waitForTimeout(80);
  const afterOne = await p.evaluate(() => ({ sats: __g.G.sats, dura: __g.G.eq.weapon.dura, max: __g.G.eq.weapon.duraMax, dmin: __g.S.dmin }));
  check('Repair refills the weapon and spends that quote', afterOne.dura === afterOne.max && afterOne.sats === repaired.before - repaired.q1 && afterOne.dmin > 4, JSON.stringify({ repaired, afterOne }));

  const counters = {};
  for (const kind of ['brenda', 'sat', 'gamble']) {
    await p.evaluate(k => {
      __g.closeSheet();
      __g.G.eq.helm.dura = Math.max(0, __g.G.eq.helm.duraMax - 13);
      __g.G.eq.gloves.dura = Math.max(0, __g.G.eq.gloves.duraMax - 5);
      __g.setMode('play');
      __g.openVend(k);
    }, kind);
    await p.waitForTimeout(80);
    counters[kind] = await p.evaluate(() => ({
      who: (document.querySelector('.vendHead h2') || {}).textContent || '',
      all: !!document.querySelector('[data-repair="all"]'),
      piece: document.querySelectorAll('[data-vrepair]').length
    }));
  }
  check('Brenda lists Repair all', counters.brenda.all && counters.brenda.piece >= 1 && /Brenda/.test(counters.brenda.who), JSON.stringify(counters.brenda));
  check('Nonce lists Repair all', counters.sat.all && counters.sat.piece >= 1 && /Nonce/.test(counters.sat.who), JSON.stringify(counters.sat));
  check('Wren lists Repair all', counters.gamble.all && counters.gamble.piece >= 1 && /Wren/.test(counters.gamble.who), JSON.stringify(counters.gamble));
  await p.screenshot({ path: path.join(OUT, 'screenshot_repair_all.png') });
  const beforeAll = await p.evaluate(() => __g.G.sats);
  await p.click('[data-repair="all"]');
  await p.waitForTimeout(80);
  const afterAll = await p.evaluate(() => ({
    sats: __g.G.sats,
    helm: __g.G.eq.helm.dura === __g.G.eq.helm.duraMax,
    gloves: __g.G.eq.gloves.dura === __g.G.eq.gloves.duraMax,
    spent: __g.G.repairSpent
  }));
  check('Repair all fills every worn piece for whole sats', afterAll.helm && afterAll.gloves && afterAll.sats < beforeAll && afterAll.spent > 0, JSON.stringify(afterAll));

  await p.evaluate(() => {
    __g.closeSheet();
    const w = __g.G.eq.weapon, h = __g.G.eq.helm;
    w.dura = Math.floor(w.duraMax * 0.25);
    h.dura = 0;
    __g.calc();
    __g.setMode('play');
    __g.openSheet('items');
  });
  await p.waitForTimeout(100);
  await p.screenshot({ path: path.join(OUT, 'screenshot_paper_doll.png') });
  const doll = await p.evaluate(() => {
    const thin = document.querySelector('.cell.thin .dw');
    const brk = document.querySelector('.cell.brk .dw');
    return { thin: thin && thin.textContent, brk: brk && brk.textContent, thinN: document.querySelectorAll('.cell.thin').length, brkN: document.querySelectorAll('.cell.brk').length };
  });
  check('yellow marks a thin piece and red marks a broken one', doll.thin === '·' && doll.brk === '!' && doll.thinN >= 1 && doll.brkN >= 1, JSON.stringify(doll));

  const cmp = await p.evaluate(() => {
    const g = __g;
    const worn = g.G.eq.weapon;
    const saved = worn.dura;
    const fresh = g.makeItem(1, 1, 'weapon');
    fresh.id = true; fresh.dmin = 18; fresh.dmax = 28; fresh.name = 'Spare Fang'; fresh.req = 1;
    fresh.dura = 0; worn.dura = 0; g.calc();
    const ev = g.cmpEval(fresh);
    const html = g.cmpHTML(fresh);
    const names = (ev.rows || []).map(r => r.name + ' ' + (r.text || ''));
    worn.dura = worn.duraMax; fresh.dura = fresh.duraMax;
    const healthy = g.cmpHTML(fresh);
    const evH = g.cmpEval(fresh);
    worn.dura = saved; g.calc();
    return {
      blocked: ev.blocked, ok: ev.ok,
      tip: /Durability:/.test(html),
      rows: names,
      thisBroken: names.some(n => /This piece/.test(n) && /broken/.test(n)),
      wornBroken: names.some(n => /Worn piece/.test(n) && /broken/.test(n)),
      healthyTip: /Durability:/.test(healthy),
      healthyBroken: (evH.rows || []).some(r => r.text === 'broken')
    };
  });
  check('compare names durability and a broken piece', cmp.tip && cmp.thisBroken && cmp.wornBroken && cmp.healthyTip && !cmp.healthyBroken, JSON.stringify(cmp));

  const flags = await p.evaluate(() => {
    const g = __g;
    const para = g.mkFixed(g.UNI.find(u => u.id === 'parachute'), 8, 4);
    const cold = g.mkFixed(g.UNI.find(u => u.id === 'coldwallet'), 16, 4);
    const repair = g.mkFixed(g.UNI.find(u => u.id === 'repair'), 6, 4);
    const old = g.makeItem(3, 1, 'armor');
    delete old.dura; delete old.duraMax;
    g.G.bag.push(old);
    g.migrateDurability();
    const ring = g.makeItem(3, 1, 'ring');
    const amu = g.makeItem(3, 1, 'amulet');
    return {
      para: !!(para.indestruct && !(para.duraMax > 0)),
      cold: !!(cold.indestruct && !(cold.duraMax > 0)),
      patch: !!(repair.aff && repair.aff.some(a => a.k === 'patch') && repair.duraMax > 0),
      migrated: old.dura === old.duraMax && old.duraMax > 0,
      jewels: !(ring.duraMax > 0) && !(amu.duraMax > 0)
    };
  });
  check('the parachute and the cold wallet are indestructible', flags.para && flags.cold, JSON.stringify(flags));
  check('Right to Repair patches itself and can still wear', flags.patch, JSON.stringify(flags));
  check('an old save is stamped to full durability', flags.migrated, JSON.stringify(flags));
  check('rings and amulets do not wear', flags.jewels, JSON.stringify(flags));

  const patched = await p.evaluate(() => {
    const w = __g.G.eq.weapon;
    w.aff = (w.aff || []).concat([{ k: 'patch', v: 1, nm: 'of the Patch' }]);
    w.dura = 0; __g.calc();
    const bare = __g.S.dmin;
    __g.G.patchT = 0;
    __g.update(8);
    __g.calc();
    return { bare, dura: w.dura, dmin: __g.S.dmin };
  });
  check('Self-patching restores a point, and a broken piece works again', patched.bare === 2 && patched.dura === 1 && patched.dmin > 4, JSON.stringify(patched));

  await p.evaluate(() => __g.closeSheet());
  await p.evaluate(() => { __g.enter(1); __g.setMode('play'); __g.P.inv = 0; __g.G.god = false; __g.G.hp = __g.S.maxHp; });
  await p.waitForTimeout(200);
  await p.evaluate(() => {
    const d = document.getElementById('dlg'); if (d && !d.hidden) { const x = d.querySelector('#dBtns button:not([disabled])'); x && x.click(); }
    __g.setMode('play');
  });

  const died = await p.evaluate(() => {
    const g = __g;
    for (const sl of ['weapon', 'helm', 'armor', 'gloves', 'boots', 'belt', 'ring', 'amulet']) g.G.eq[sl] = null;
    g.G.cslots = []; g.G.bag = [];
    const w = g.makeItem(4, 1, 'weapon'); w.id = true; w.dmin = 14; w.dmax = 22; w.name = 'Kept Fang';
    const helm = g.makeItem(4, 1, 'helm'); helm.id = true; helm.name = 'Kept Helm';
    const belt = g.makeItem(4, 1, 'belt'); belt.id = true; belt.base = 'Tool Belt'; belt.name = 'Kept Belt'; belt.aff = []; belt.csl = 2; belt.cap = 8;
    const charm = g.mkCharm(1, { aff: [{ k: 'hp', v: 40 }], sz: 'slip', id: true, q: 1 });
    const ring = g.makeItem(3, 1, 'ring'); ring.id = true; ring.name = 'Pack Ring';
    g.G.eq.weapon = w; g.G.eq.helm = helm; g.G.eq.belt = belt;
    g.G.cslots = [charm];
    g.G.bag = [ring];
    g.G.stims = 3;
    g.G.credits = 1000; g.G.sats = 50; g.G.lvl = 1; g.G.diff = 0; g.G.corpses = [];
    g.ACC.sats = 11; g.ACC.cr = 77;
    g.calc();
    const hp = g.S.maxHp;
    g.P.inv = 0; g.G.god = false; g.G.hp = hp; g.setMode('play');
    g.hurt(50000, 0, { name: 'a Tick' });
    const c = (g.G.corpses || [])[0];
    const bare = ['helm', 'armor', 'gloves', 'boots', 'belt', 'ring', 'amulet'].every(sl => !g.G.eq[sl]);
    const loan = g.G.eq.weapon;
    const obj0 = (g.W.objs || []).find(o => o.k === 'corpse');
    let calm = null;
    if (obj0) {
      let e = null;
      for (let a = 0; a < 8 && !e; a++) e = g.spawn('tick', obj0.x + Math.cos(a) * 0.6, obj0.y + Math.sin(a) * 0.6, null);
      if (!e) e = g.spawn('tick', obj0.x + 2, obj0.y, null);
      g.calmNearCorpse();
      if (e) {
        calm = { calm: e.calm || 0, aggro: !!e.aggro, far: +Math.hypot(e.x - obj0.x, e.y - obj0.y).toFixed(2) };
        e.hp = 0;
      }
    }
    return {
      bare, loan: !!(loan && loan.loan && /loaner/.test(loan.name)), cslots: (g.G.cslots || []).length, bag: g.G.bag.length && g.G.bag[0].name,
      calm,
      credits: g.G.credits, sats: g.G.sats, stims: g.G.stims, accS: g.ACC.sats, accC: g.ACC.cr,
      n: (g.G.corpses || []).length,
      held: c && { w: c.eq.weapon && c.eq.weapon.name, h: c.eq.helm && c.eq.helm.name, b: c.eq.belt && c.eq.belt.name, charms: (c.cslots || []).length, credits: c.credits },
      obj: (g.W.objs || []).some(o => o.k === 'corpse' && c && o.id === c.id),
      packed: g.encW(g.W).objs.some(o => o && o.k === 'corpse'),
      fee: g.G.credits
    };
  });
  check('equipped gear, the belt, and its charms leave the body', died.bare && died.loan && died.cslots === 0 && died.held && died.held.w === 'Kept Fang' && died.held.b === 'Kept Belt' && died.held.charms === 1, JSON.stringify(died));
  check('a machine on the body steps back and goes quiet', died.calm && died.calm.calm > 0 && died.calm.aggro === false && died.calm.far > 6, JSON.stringify(died.calm));
  check('the pack, stims, sats, and the lockbox stay', died.bag === 'Pack Ring' && died.stims === 3 && died.sats === 50 && died.accS === 11 && died.accC === 77, JSON.stringify(died));
  check('four percent of carried credits sits on the body', died.credits === 960 && died.held && died.held.credits === 40, JSON.stringify(died));
  check('the body is in the world and not in the shared zone blob', died.obj && died.packed === false && died.n === 1, JSON.stringify(died));

  await p.waitForTimeout(3200);
  await p.screenshot({ path: path.join(OUT, 'screenshot_death.png') });
  const panel = await p.evaluate(() => ({
    p: document.getElementById('deathP').textContent,
    note: document.getElementById('deathNote').textContent,
    stats: document.getElementById('deathS').textContent
  }));
  check('the notice says the credits are on the body', /Credits on the body/.test(panel.stats) && /₡40/.test(panel.stats), JSON.stringify(panel));
  check('the notice points at the map and at Kestrel', /marked/.test(panel.note) && /Kestrel/.test(panel.note), panel.note);

  await p.evaluate(() => {
    document.getElementById('death').hidden = true;
    __g.G.god = true; __g.W.ents = [];
    __g.setMode('play'); __g.G.hp = __g.S.maxHp; __g.P.inv = 0;
    const c = __g.W.objs.find(o => o.k === 'corpse');
    __g.P.x = c.x + 5; __g.P.y = c.y;
    __g.render();
  });
  await p.waitForTimeout(200);
  await p.screenshot({ path: path.join(OUT, 'screenshot_corpse.png') });

  const back = await p.evaluate(() => {
    const g = __g;
    const id = g.G.corpses[0].id;
    const o = g.W.objs.find(x => x.k === 'corpse' && x.id === id);
    g.P.x = o.x; g.P.y = o.y;
    g.useObj(o);
    const withCharm = g.S.maxHp;
    const worn = (g.G.cslots || []).slice();
    g.G.cslots = []; g.calc();
    const bare = g.S.maxHp;
    g.G.cslots = worn; g.calc();
    return {
      weapon: g.G.eq.weapon && g.G.eq.weapon.name,
      belt: g.G.eq.belt && g.G.eq.belt.name,
      charms: (g.G.cslots || []).length,
      credits: g.G.credits,
      left: (g.G.corpses || []).length,
      withCharm, bare
    };
  });
  check('standing on the body gives that gear and those credits back', back.weapon === 'Kept Fang' && back.belt === 'Kept Belt' && back.charms === 1 && back.credits === 1000 && back.left === 0, JSON.stringify(back));
  check('a charm on the belt is adding life again', back.withCharm >= back.bare + 40, JSON.stringify(back));

  const two = await p.evaluate(() => {
    const g = __g;
    g.G.credits = 500; g.setMode('play'); g.P.inv = 0; g.G.hp = g.S.maxHp; g.G.god = false;
    g.hurt(50000, 0, { name: 'a Tick' });
    g.setMode('play'); g.P.inv = 0; g.G.hp = g.S.maxHp;
    const w2 = g.makeItem(5, 1, 'weapon'); w2.id = true; w2.name = 'Second Fang';
    g.G.eq.weapon = w2; g.calc();
    g.hurt(50000, 0, { name: 'a Wisp' });
    const ids = (g.G.corpses || []).map(c => c.id);
    const first = g.G.corpses[0];
    g.reclaimCorpse(first.id);
    const left = g.G.corpses[0];
    return {
      n: ids.length,
      got: g.G.eq.weapon && g.G.eq.weapon.name,
      charms: (g.G.cslots || []).length,
      leftName: left && left.eq.weapon && left.eq.weapon.name,
      leftN: (g.G.corpses || []).length
    };
  });
  check('dying again leaves a second body', two.n === 2, JSON.stringify(two));
  check('taking one body leaves the other', two.leftN === 1 && two.leftName === 'Second Fang' && (two.got === 'Kept Fang' || two.charms >= 0), JSON.stringify(two));

  await p.evaluate(() => { document.getElementById('death').hidden = true; __g.setMode('play'); });
  const bought = await p.evaluate(() => {
    const g = __g;
    const id = g.G.corpses[0].id;
    const fee = g.corpseFee(g.G.corpses[0]);
    g.G.sats = 20;
    g.enter(0); g.setMode('play');
    g.openSheet('items');
    return { id, fee, txt: document.getElementById('sheetIn').innerText, sats: g.G.sats };
  });
  check('town offers to walk the body back for sats', bought.fee === 1 && /Body in/.test(bought.txt) && /1 sat/.test(bought.txt), bought.txt.slice(0, 600));
  for (let i = 0; i < 8; i++) {
    const open = await p.evaluate(() => {
      const d = document.getElementById('dlg');
      if (!d || d.hidden) return false;
      const x = d.querySelector('#dBtns button:not([disabled])');
      if (x) x.click();
      else d.hidden = true;
      return true;
    });
    if (!open) break;
    await p.waitForTimeout(400);
  }
  await p.evaluate(() => { const d = document.getElementById('dlg'); if (d) d.hidden = true; });
  await p.screenshot({ path: path.join(OUT, 'screenshot_buyback.png') });
  await p.click('[data-corpse]');
  await p.waitForTimeout(80);
  const afterBuy = await p.evaluate(() => ({
    left: (__g.G.corpses || []).length,
    sats: __g.G.sats,
    spent: __g.G.corpseBought,
    names: [__g.G.eq.weapon && __g.G.eq.weapon.name].concat((__g.G.bag || []).map(i => i && i.name))
  }));
  check('the sats fee brings that body back', afterBuy.left === 0 && afterBuy.sats === 19 && afterBuy.spent === 1 && afterBuy.names.indexOf('Second Fang') >= 0, JSON.stringify(afterBuy));

  const sim = await p.evaluate(() => {
    const g = __g;
    const n0 = (g.G.corpses || []).length;
    const credits = g.G.credits;
    const had = !!(g.G.eq.weapon);
    const prev = g.W.z.sim;
    const prevSim = g.W.sim;
    g.W.z.sim = 1;
    g.W.sim = { wave: 3, rush: 0 };
    g.setMode('play'); g.P.inv = 0; g.G.hp = g.S.maxHp; g.G.god = false;
    g.hurt(50000, 0, { name: 'a rival', pvp: 1 });
    const out = { n: (g.G.corpses || []).length - n0, credits: g.G.credits === credits, kept: !!(g.G.eq.weapon) === had, mode: g.mode };
    if (prev) g.W.z.sim = prev; else delete g.W.z.sim;
    if (prevSim) g.W.sim = prevSim; else g.W.sim = null;
    const d = document.getElementById('dlg'); if (d && !d.hidden) { const x = d.querySelector('#dBtns button:not([disabled])'); x && x.click(); }
    g.setMode('play'); g.G.hp = g.S.maxHp;
    return out;
  });
  check('a rig death drops nothing', sim.n === 0 && sim.credits && sim.kept, JSON.stringify(sim));

  await p.evaluate(() => {
    const g = __g;
    document.getElementById('death').hidden = true;
    g.enter(1); g.setMode('play'); g.P.inv = 0; g.G.god = false; g.G.hp = g.S.maxHp;
    g.G.credits = 200;
    const gloves = g.makeItem(3, 1, 'gloves'); gloves.id = true; gloves.name = 'Duel Gloves';
    g.G.eq.gloves = gloves; g.calc();
    g.hurt(50000, 0, { name: 'a rival', pvp: 1, hp: 1 });
  });
  await p.waitForTimeout(3200);
  const pvp = await p.evaluate(() => {
    const c = __g.G.corpses && __g.G.corpses[__g.G.corpses.length - 1];
    return {
      gloves: c && c.eq.gloves && c.eq.gloves.name,
      line: document.getElementById('deathP').textContent
    };
  });
  check('an open-world rival leaves your own body, and no ear', pvp.gloves === 'Duel Gloves' && /Nobody else can pick it up/.test(pvp.line) && /nothing was cut from you as a trophy/.test(pvp.line), JSON.stringify(pvp));

  const cold = await p.evaluate(() => {
    const g = __g;
    document.getElementById('death').hidden = true;
    g.setMode('play'); g.G.hc = false; g.P.inv = 0; g.G.hp = g.S.maxHp;
    for (const sl of ['weapon', 'helm', 'armor', 'gloves', 'boots', 'belt', 'ring', 'amulet']) g.G.eq[sl] = null;
    g.G.cslots = [];
    const belt = g.mkFixed(g.UNI.find(u => u.id === 'coldwallet'), 16, 4);
    g.G.eq.belt = belt; g.G.credits = 800; g.calc();
    const n0 = (g.G.corpses || []).length;
    g.hurt(50000, 0, { name: 'a Tick' });
    const c = g.G.corpses[g.G.corpses.length - 1];
    return { credits: g.G.credits, onBody: c && c.credits, belt: c && c.eq.belt && c.eq.belt.uid, n: (g.G.corpses || []).length - n0 };
  });
  check('a cold wallet keeps the credits and still goes with the body', cold.credits === 800 && cold.onBody === 0 && cold.belt === 'coldwallet' && cold.n === 1, JSON.stringify(cold));

  const hcState = await p.evaluate(() => {
    const g = __g;
    document.getElementById('death').hidden = true;
    g.setMode('play'); g.G.hc = true; g.P.inv = 0; g.G.hp = g.S.maxHp; g.G.god = false;
    const credits = g.G.credits, n0 = (g.G.corpses || []).length;
    g.G.eq.helm = g.makeItem(3, 1, 'helm');
    g.hurt(50000, 0, { name: 'a Tick' });
    return { credits: g.G.credits === credits, n: (g.G.corpses || []).length - n0, helm: !!g.G.eq.helm };
  });
  await p.waitForTimeout(3200);
  const hc = await p.evaluate(() => {
    const stats = document.getElementById('deathS').textContent;
    __g.G.hc = false; document.getElementById('death').hidden = true; __g.setMode('play'); __g.G.hp = __g.S.maxHp;
    return stats;
  });
  const hcOk = hcState.credits && hcState.n === 0 && hcState.helm && /none/.test(hc);
  check('hardcore leaves no body and no credit charge', hcOk, JSON.stringify({ hcState, stats: hc }));

  const help = await p.evaluate(() => document.documentElement.innerHTML);
  check('the guide says the belt and charms are on the body', /belt and the charms on it are on your body/.test(help));
  check('the guide says sats do not fall and the rig drops no ear', /Sats do not fall/.test(help) && /nobody drops an ear/.test(help));
  check('the guide says a loaner stays in your hands', /plain loaner stays in your hands/.test(help));

  check('no page errors', !errs.length, errs.join(' | '));
  await b.close();
  console.log(fail.length ? 'FAIL\n' + fail.join('\n') : 'corpse-dura ok');
  process.exit(fail.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
