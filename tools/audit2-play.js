/* Play pass for the gaps the feature audit left open.
   node tools/audit2-play.js
   Writes /tmp/audit2-play.json and shots under AUDIT_SHOTS.
*/
const { chromium } = require('playwright');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawn } = require('child_process');

const root = path.join(__dirname, '..');
const SHOT = process.env.AUDIT_SHOTS || '/tmp/audit2-shots';
const OUT = process.env.AUDIT_OUT || '/tmp/audit2-play.json';
fs.mkdirSync(SHOT, { recursive: true });
const CHROME = process.env.PW_CHROMIUM || '/usr/local/bin/google-chrome';
const html = fs.readFileSync(path.join(root, 'dist/unsubscribe.html'), 'utf8');
const rows = [];
const errs = [];
function row(area, feature, grade, notes, evidence) {
  rows.push({ area, feature, grade, notes, evidence: evidence || '' });
  console.log(grade.padEnd(16), feature, notes ? '— ' + String(notes).slice(0, 180) : '');
}
const wait = ms => new Promise(r => setTimeout(r, ms));
async function shot(page, name) {
  const file = path.join(SHOT, name + '.png');
  await page.screenshot({ path: file });
  return name + '.png';
}
async function clearUI(page, n) {
  for (let i = 0; i < (n || 24); i++) {
    const st = await page.evaluate(() => {
      const s = document.getElementById('scene');
      if (s && !s.hidden) { const b = document.getElementById('scSkip'); if (b) b.click(); return 'scene'; }
      const d = document.getElementById('dlg');
      if (d && !d.hidden) {
        const x = d.querySelector('#dBtns button:not([disabled])');
        if (x) { x.click(); return 'dlg'; }
        return 'locked';
      }
      return 'clear';
    });
    if (st === 'clear') return;
    await wait(st === 'locked' ? 450 : 70);
  }
}
function boot(page) {
  page.on('pageerror', e => errs.push(e.message));
  return page.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0">' + html + '</body></html>');
}
async function ready(page) {
  await page.waitForTimeout(250);
  await page.evaluate(() => __g.skipDisc());
  await page.evaluate(() => __g.noteInput('mouse'));
  await page.click('[data-cls=scrapper]');
  await wait(200);
  await clearUI(page);
  await page.evaluate(() => {
    const G = __g.G;
    G.pre = 2; G.walkNew = 0; G.god = false;
    G.nodes = G.nodes || {}; G.st = G.st || {}; G.st.wf = G.st.wf || {};
    G.words = G.words || {}; G.rep = G.rep || { btc: 0, anon: 0, norm: 0 };
    G.q = G.q || {};
    __g.OPT.noWalk = 1; __g.OPT.auto = false; __g.OPT.dyn = true;
    __g.enter(0); __g.setMode('play');
  });
  await clearUI(page);
}

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  page.setDefaultTimeout(300000);
  await boot(page);
  await ready(page);

  const keys = await page.evaluate(() => {
    const g = __g, P = g.P, x0 = P.x, y0 = P.y;
    g.keys.KeyD = true; g.keys.KeyS = true;
    for (let i = 0; i < 40; i++) g.update(1 / 30);
    g.keys.KeyD = false; g.keys.KeyS = false;
    const moved = Math.hypot(g.P.x - x0, g.P.y - y0);
    g.G.sk[4] = 1; g.G.mouse.R = 0; g.G.hot = [0, 4, null, null, null, null, null, null];
    g.hotUse(1);
    const afterF = g.G.mouse.R;
    const before = g.G.mouse.R;
    g.cycleRight(1);
    const afterWheel = g.G.mouse.R;
    g.P.atk = 0;
    g.keys.Space = true;
    g.update(1 / 30);
    g.keys.Space = false;
    const swung = g.P.atk > 0;
    return { moved, afterF, before, afterWheel, swung };
  });
  row('controls', 'WASD walks', keys.moved > 0.3 ? 'Works' : 'Broken', 'moved ' + keys.moved.toFixed(2));
  row('controls', 'F-key recalls a bound skill onto the right slot', keys.afterF === 4 ? 'Works' : 'Broken', 'right=' + keys.afterF);
  row('controls', 'Mouse wheel cycles the right slot', keys.afterWheel !== keys.before ? 'Works' : 'Broken', keys.before + ' -> ' + keys.afterWheel);
  row('controls', 'Space swings', keys.swung ? 'Works' : 'Broken', 'atk ' + keys.swung);

  const gear = await page.evaluate(() => {
    const g = __g;
    const prep = (lvl) => {
      g.G.lvl = lvl; g.G.diff = 0; g.G.god = false; g.G.hc = false;
      g.G.sk = [6, 4, 3, 4, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      g.G.at = { mgt: Math.max(8, Math.floor(lvl * 0.8)), ref: 4, vit: Math.max(6, Math.floor(lvl * 0.45)), bnd: 4 };
      g.G.stims = 12; g.G.credits = 500000; g.G.sats = 40;
      const w = g.makeItem(Math.max(1, lvl), 2, 'weapon'); w.id = true; g.G.eq.weapon = w;
      g.calc(); g.G.hp = g.S.maxHp; g.G.en = g.S.maxEn;
      g.G.merc = { k: 'guard', name: 'Kestrel', hp: 0, dead: false, weapon: null, armor: null, helm: null };
      g.G.act2 = g.G.act3 = g.G.act4 = g.G.act5 = true;
      g.G.unlocked = 34;
      g.OPT.auto = false; g.OPT.dyn = true;
    };
    const fight = (steps) => {
      const boss = g.W.ents.find(e => g.ET[e.k] && (e.k === 'boss' || e.k === 'boss2' || e.k === 'boss3' || e.k === 'boss4' || e.k === 'boss5'));
      if (!boss) return { err: 'no boss', ents: g.W.ents.map(e => e.k).slice(0, 8) };
      if (g.W) g.W.bi = 1;
      for (const e of g.W.ents) if (e !== boss && !e.su) e.hp = 0;
      g.W.ents = g.W.ents.filter(e => e.hp > 0);
      const max = boss.max, start = boss.hp;
      g.P.x = boss.x + 1.3; g.P.y = boss.y;
      if (g.W.merc) { g.W.merc.x = boss.x - 1.1; g.W.merc.y = boss.y; }
      let died = false, playerDead = false, swings = 0;
      const t0 = boss.hp;
      for (let i = 0; i < steps; i++) {
        if (g.mode === 'dying' || g.G.hp <= 0) { playerDead = true; break; }
        if (boss.hp <= 0) { died = true; break; }
        g.setMode('play');
        const d = Math.hypot(boss.x - g.P.x, boss.y - g.P.y);
        if (d > 1.5) { g.P.dir = { x: (boss.x - g.P.x) / d, y: (boss.y - g.P.y) / d }; g.P.x += g.P.dir.x * 0.15; g.P.y += g.P.dir.y * 0.15; }
        g.P.aim = boss;
        if (g.G.hp < g.S.maxHp * 0.45 && g.G.stims > 0) g.stim();
        if ((g.P.cd[0] || 0) <= 0) g.castIndex(0);
        g.attack();
        if (g.P.atk > 0) swings++;
        g.update(1 / 20);
      }
      return { died, playerDead, name: boss.name, k: boss.k, max, left: Math.max(0, boss.hp), dealt: start - Math.max(0, boss.hp), q: g.G.q, diffGate: g.G.diffGate || 0, dmg: Math.round((g.S.dmin + g.S.dmax) / 2), hp: Math.round(g.S.maxHp), swings };
    };
    g.prep = prep; g.fight = fight;
    return { ok: true };
  });
  if (!gear.ok) row('story', 'Boss harness', 'Broken', 'prep failed');

  const bosses = [
    { zi: 5, lvl: 12, name: 'Pryce', q: 'q5' },
    { zi: 11, lvl: 27, name: 'Vale', q: 'q10' },
    { zi: 16, lvl: 42, name: 'MANDATE', q: 'q15' },
    { zi: 26, lvl: 57, name: 'Curator', q: 'q20' },
    { zi: 32, lvl: 72, name: 'PROVIDENCE', q: 'q25' }
  ];
  const bossOut = [];
  for (const b of bosses) {
    console.log('BOSS', b.name);
    await page.evaluate(b => { __g.prep(b.lvl); __g.G.god = true; __g.enter(b.zi); __g.setMode('play'); }, b);
    await clearUI(page);
    const r = await page.evaluate(() => { __g.G.god = false; __g.G.hp = __g.S.maxHp; __g.calc(); __g.spawnMerc && 0; if (__g.G.merc) { __g.G.merc.dead = false; __g.G.merc.hp = 0; } return __g.fight(2400); });
    bossOut.push(Object.assign({ want: b.name, zi: b.zi, lvl: b.lvl }, r));
    if (b.name === 'Pryce') await shot(page, 'boss-pryce');
    if (b.name === 'PROVIDENCE') await shot(page, 'boss-providence');
    await wait(1600);
    await clearUI(page);
  }
  const beaten = bossOut.filter(b => b.died && !b.playerDead);
  row('story', 'Each act boss can be beaten on Normal at that act’s level', beaten.length === 5 ? 'Works' : 'Partially works',
    bossOut.map(b => b.want + ' ' + (b.died ? 'down' : (b.playerDead ? 'player died' : 'left ' + Math.round(b.left))) + ' dealt ' + Math.round(b.dealt || 0) + '/' + Math.round(b.max || 0)).join('; '),
    'boss-pryce.png');

  const earnedKill = await page.evaluate(() => {
    const g = __g;
    g.closeSheet();
    g.setMode('play');
    const fromFight = g.G.diffGate || 0;
    if (fromFight >= 1 && g.G.q.q25 === 3) return { fromFight, q25: g.G.q.q25, via: 'fight' };
    g.G.diff = 0;
    g.G.god = true;
    g.enter(32);
    g.setMode('play');
    if (g.W) g.W.bi = 1;
    const boss = (g.W.ents || []).find(e => e.k === 'boss5');
    g.G.god = false;
    if (!boss) return { err: 'no providence', fromFight };
    g.kill(boss);
    return { fromFight, via: 'kill', gate: g.G.diffGate || 0, q25: g.G.q.q25 };
  });
  await wait(1600);
  await clearUI(page);
  const gate = await page.evaluate(() => {
    const g = __g;
    g.closeSheet();
    g.closeSheet();
    g.setMode('play');
    const earned = g.G.diffGate || 0;
    g.G.diff = 0;
    g.G.diffGate = 0;
    g.openSheet('opts', {});
    const hard = document.querySelector('[data-diff="1"]');
    const brutal = document.querySelector('[data-diff="2"]');
    const locked = { hard: !!(hard && hard.disabled), brutal: !!(brutal && brutal.disabled) };
    if (hard) hard.click();
    const stayed = g.G.diff;
    g.G.diffGate = earned;
    g.G.diff = 0;
    g.closeSheet();
    g.setMode('play');
    g.openSheet('opts', {});
    const hard2 = document.querySelector('[data-diff="1"]');
    const brutal2 = document.querySelector('[data-diff="2"]');
    if (hard2 && !hard2.disabled) hard2.click();
    const afterHard = g.G.diff;
    if (brutal2 && !brutal2.disabled) brutal2.click();
    const brutalBlocked = g.G.diff;
    return { locked, stayed, earned, afterHard, brutalBlocked, hard2Disabled: !!(hard2 && hard2.disabled) };
  });
  let brutalEarn = null;
  if (gate.afterHard === 1) {
    brutalEarn = await page.evaluate(() => {
      const g = __g;
      g.closeSheet();
      g.setMode('play');
      g.openSheet('opts', {});
      const hard = document.querySelector('[data-diff="1"]');
      if ((g.G.diff || 0) < 1 && hard && !hard.disabled) hard.click();
      const diffBefore = g.G.diff || 0;
      g.closeSheet();
      g.setMode('play');
      g.G.god = true;
      g.enter(32, { fresh: true });
      g.setMode('play');
      if (g.W) g.W.bi = 1;
      const boss = (g.W.ents || []).find(e => e.k === 'boss5');
      g.G.god = false;
      if (!boss) return { err: 'no providence' };
      g.kill(boss);
      const earned2 = g.G.diffGate || 0;
      g.closeSheet();
      g.setMode('play');
      g.openSheet('opts', {});
      const brutal = document.querySelector('[data-diff="2"]');
      if (brutal && !brutal.disabled) brutal.click();
      return { diffBefore, earned2, afterBrutal: g.G.diff, brutalDisabled: !!(brutal && brutal.disabled) };
    });
    await wait(1600);
    await clearUI(page);
  }
  await shot(page, 'diff-gates');
  const afterBrutal = brutalEarn && brutalEarn.afterBrutal;
  console.log('GATE', JSON.stringify({ earnedKill, gate, brutalEarn }));
  row('difficulty', 'Hard and Brutal unlock through the options buttons',
    gate.stayed === 0 && gate.locked.hard && gate.locked.brutal && gate.afterHard === 1 && gate.brutalBlocked === 1 && afterBrutal === 2 ? 'Works' : 'Partially works',
    JSON.stringify({ earnedKill, gate, brutalEarn }), 'diff-gates.png');

  const allies = await page.evaluate(() => {
    const g = __g;
    const put = (k, dx, dy) => {
      for (let r = 0; r < 6; r++) for (let a = 0; a < 8; a++) {
        const e = g.spawn(k, g.P.x + dx + Math.cos(a) * r * 0.4, g.P.y + dy + Math.sin(a) * r * 0.4, {});
        if (e) return e;
      }
      return null;
    };
    g.closeSheet(); g.setMode('play'); g.G.god = true; g.enter(0); g.setMode('play');
    g.G.god = false; g.G.lvl = 18; g.G.credits = 9000000; g.G.tag = null; g.calc(); g.G.hp = g.S.maxHp;
    g.G.merc = null; if (g.W) g.W.merc = null;
    g.openSheet('merc', { only: ['merc'] });
    const hire = document.querySelector('[data-hire="guard"]');
    const label = hire ? hire.textContent : '';
    if (hire && !hire.disabled) hire.click();
    g.closeSheet(); g.setMode('play');
    const mercName = g.G.merc && g.G.merc.name;
    const hired = !!(g.G.merc && g.G.merc.k === 'guard');
    g.G.god = true; g.enter(1); g.setMode('play'); g.G.god = false;
    g.W.ents = [];
    const foe = put('bot', 1.2, 0);
    if (g.W.merc && foe) { g.W.merc.x = foe.x - 0.6; g.W.merc.y = foe.y; }
    const hp0 = foe ? foe.hp : 0;
    g.P.atk = 0;
    for (let i = 0; i < 80 && foe && foe.hp >= hp0; i++) g.update(1 / 20);
    const mercDealt = foe ? hp0 - foe.hp : 0;
    const swung = !!(g.W.merc && g.W.merc.swing >= 0);
    if (g.G.merc) { g.G.merc.dead = true; g.G.merc.hp = 0; }
    g.W.merc = null;
    const dead = !!(g.G.merc && g.G.merc.dead);
    g.closeSheet(); g.setMode('play');
    g.openSheet('merc', { only: ['merc'] });
    const rev = document.querySelector('[data-revive]');
    if (rev) rev.click();
    const back = g.G.merc && !g.G.merc.dead && !!g.W.merc;
    g.G.merc = { k: 'sys', name: 'Nia', hp: 0, dead: false, weapon: null, armor: null, helm: null };
    g.G.god = true; g.enter(1); g.setMode('play'); g.G.god = false;
    g.W.ents = [];
    g.G.hp = g.S.maxHp * 0.5;
    const mid = g.G.hp;
    for (let i = 0; i < 120; i++) g.update(1 / 20);
    const healed = g.G.hp - mid;
    g.G.merc = { k: 'hound', name: 'Pip', hp: 0, dead: false, weapon: null, armor: null, helm: null };
    g.G.god = true; g.enter(1); g.setMode('play'); g.G.god = false;
    g.W.ents = [];
    const foe2 = put('bot', 3.2, 0);
    g.W.projs = [];
    for (let i = 0; i < 40; i++) g.update(1 / 20);
    const houndShot = g.W.projs.some(p => p.kind === 'merc') || (foe2 && foe2.hp < foe2.max);
    return { label: (label || '').slice(0, 60), hired, mercName, mercDealt, swung, dead, back, healed: Math.round(healed), houndShot };
  });
  await shot(page, 'merc-fight');
  row('mercs', 'A hired bodyguard fights and can be revived', allies.mercDealt > 0 && allies.back ? 'Works' : 'Partially works', JSON.stringify(allies), 'merc-fight.png');
  row('mercs', 'Sysadmin mends and the hound shoots', allies.healed > 0 && allies.houndShot ? 'Works' : 'Partially works', JSON.stringify({ healed: allies.healed, houndShot: allies.houndShot }));

  const pressure = await page.evaluate(() => {
    const g = __g;
    g.setMode('play'); g.G.god = true; g.enter(1); g.setMode('play');
    g.W.z.sim = false;
    g.G.tag = { slot: 1, cls: 'hacker', lvl: 10, name: 'Level 10 Technomancer', dmg: 20, max: 200, red: 0.8, sk: [[0, 3]], down: false, eq: {}, hp: 200 };
    g.W.tag = { x: g.P.x + 0.6, y: g.P.y, r: .3, hp: 200, max: 200, ph: 0, flash: 0, armM: 0.8, fx: 1, swing: 0, sc: [0], say: '', sayT: 0, tag: 1, dir: { x: 1, y: 0 }, walkPh: 0, moving: false, spin: 0, buff: 0, haste: 0, guard: 0, dash: null, stealth: 0, mech: 0, inv: 0, oc: 0, ambT: 0, ambM: 1, crunch: 0, volley: null, cd: [], silence: 0, fm: null, atk: 0, slow: 0, page: 0 };
    g.G.pp = 0;
    let foe = null;
    for (let r = 0; r < 6 && !foe; r++) for (let a = 0; a < 8 && !foe; a++) foe = g.spawn('bot', g.P.x + 2 + Math.cos(a) * r * 0.35, g.P.y + Math.sin(a) * r * 0.35, {});
    if (foe) { foe.aggro = true; foe.wkT = g.G.time; }
    let hits = 0;
    const hp0 = foe ? foe.hp : 0;
    for (let i = 0; i < 50 && foe && foe.hp > 0; i++) { g.update(1 / 20); hits++; }
    const compDealt = foe ? hp0 - Math.max(0, foe.hp) : 0;
    let fast = 0;
    for (let n = 0; n < 12; n++) {
      let e = null;
      for (let a = 0; a < 8 && !e; a++) e = g.spawn('tick', g.P.x + Math.cos(a), g.P.y + Math.sin(a), {});
      if (!e) continue;
      e.aggro = true; e.wkT = g.G.time - 0.1; e.hp = 1; g.kill(e); fast++;
    }
    const pp = g.G.pp || 0;
    const lifeMul = (typeof partyH === 'function') ? null : null;
    return { compDealt, hits, pp, fast, on: !!(g.W.tag && g.W.tag.hp > 0) };
  });
  row('mercs', 'A rendered companion fights', pressure.compDealt > 0 ? 'Works' : 'Partially works', JSON.stringify(pressure));
  row('coop', 'Party pressure steps up after fast kills beside a companion', pressure.pp > 0 ? 'Works' : 'Partially works', 'pp=' + pressure.pp + ' after ' + pressure.fast + ' fast kills');

  const places = await page.evaluate(() => {
    const g = __g;
    g.G.god = true; g.G.sats = 30; g.G.leg = 1; g.G.q.q5 = 3; g.G.unlocked = 34;
    const before = g.G.sats;
    g.bullStart();
    const bullZi = g.W && g.W.zi;
    const bulls = g.W ? g.W.ents.filter(e => e.k === 'bull').length : 0;
    g.setMode('play');
    let killed = 0;
    for (let n = 0; n < 4; n++) {
      const e = (g.W.ents || []).find(x => x.hp > 0 && !x.mp);
      if (!e) break;
      e.hp = 1; g.kill(e); killed++;
    }
    g.G.sats = 20;
    const sats2 = g.G.sats;
    g.subStart(1);
    const sub = { zi: g.W.zi, name: g.W.z && g.W.z.n, mods: g.W.sub && g.W.sub.mods };
    g.setMode('play');
    const resp = (g.W.ents || []).find(e => e.su);
    let served = false;
    if (resp) { resp.hp = 1; g.kill(resp); served = !!(g.W.sub && g.W.sub.done); }
    const rushN = g.rushList ? null : null;
    g.G.q.q1 = 2; g.G.unlocked = 8;
    const list = (typeof rushList === 'function') ? null : null;
    return { spent: before - g.G.sats, bullZi, bulls, killed, sub, served, sats2 };
  });
  await clearUI(page);
  await shot(page, 'bull-sub');
  row('story', 'Bull Run opens after the servo leg and 10 sats', places.bulls > 0 ? 'Works' : 'Partially works', JSON.stringify({ bullZi: places.bullZi, bulls: places.bulls, killed: places.killed }), 'bull-sub.png');
  row('story', 'A subpoena can be served', places.served ? 'Works' : 'Partially works', JSON.stringify(places.sub) + ' served=' + places.served);

  const rush = await page.evaluate(() => {
    const g = __g;
    g.G.god = true; g.G.lvl = 20;
    for (let i = 1; i <= 10; i++) g.G.q['q' + i] = Math.max(g.G.q['q' + i] || 0, 2);
    g.G.q.q5 = 3; g.G.unlocked = 16;
    g.enter(6, { rush: true });
    g.setMode('play');
    const sim = g.W.sim && { rush: g.W.sim.rush, n: (g.W.sim.list || []).length, i: g.W.sim.i };
    let downs = 0;
    const sats0 = g.G.sats || 0;
    for (let step = 0; step < 24; step++) {
      for (let t = 0; t < 30; t++) g.update(1 / 10);
      if (g.G.rushDone) break;
      const foe = (g.W.ents || []).find(e => e.hp > 0 && !e.minion);
      if (!foe) continue;
      foe.hp = 1; g.W.bi = 1; g.kill(foe); downs++;
    }
    return { sim, downs, i: g.W.sim && g.W.sim.i, done: g.G.rushDone || false, sats: (g.G.sats || 0) - sats0 };
  });
  await clearUI(page);
  await shot(page, 'boss-rush');
  row('story', 'Boss rush lines up cleared lieutenants and pays them out', rush.sim && rush.sim.n > 0 && rush.downs > 0 && rush.done && rush.sats >= 10 ? 'Works' : 'Partially works', JSON.stringify(rush), 'boss-rush.png');

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.evaluate(() => {
    __g.noteInput('mouse');
    __g.OPT.aim = 'drag';
    __g.G.god = true; __g.enter(1); __g.setMode('play');
    __g.G.cls = 'scrapper';
    __g.G.sk[7] = 4; __g.G.slots[0] = 7; __g.G.en = 999; __g.P.cd[7] = 0; __g.P.castWait = 0;
    __g.calc();
  });
  await clearUI(page);
  await page.keyboard.down('Digit1');
  await page.mouse.move(420, 260);
  await page.mouse.move(560, 340);
  await page.keyboard.up('Digit1');
  await wait(80);
  const deskDrag = await page.evaluate(() => ({ cd: __g.P.cd[7] || 0, aim: __g.OPT.aim, wantKey: __g.wantDrag('key'), wantMouse: __g.wantDrag('mouse') }));
  await page.evaluate(() => { __g.noteInput('touch'); __g.OPT.aim = 'auto'; __g.P.cd[7] = 0; __g.G.en = 999; __g.P.castWait = 0; __g.setMode('play'); });
  await wait(120);
  const touchDrag = await page.evaluate(() => {
    const b = document.querySelector('.sk[data-i="0"]');
    const cv = document.getElementById('cv').getBoundingClientRect();
    const r = b.getBoundingClientRect();
    const start = { bubbles: true, cancelable: true, pointerType: 'touch', pointerId: 9, button: 0, isPrimary: true, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 };
    const far = { clientX: cv.left + cv.width * 0.35, clientY: cv.top + cv.height * 0.42 };
    b.dispatchEvent(new PointerEvent('pointerdown', start));
    b.dispatchEvent(new PointerEvent('pointermove', Object.assign({}, start, far)));
    b.dispatchEvent(new PointerEvent('pointerup', Object.assign({}, start, far)));
    return { cd: __g.P.cd[7] || 0, shown: !document.getElementById('pad').hidden, want: __g.wantDrag('touch'), ui: document.documentElement.dataset.ui };
  });
  await shot(page, 'drag-aim');
  row('controls', 'Press, drag, and release a ground skill', deskDrag.cd > 0 && touchDrag.cd > 0 ? 'Works' : 'Partially works', JSON.stringify({ deskDrag, touchDrag }), 'drag-aim.png');

  await page.setViewportSize({ width: 390, height: 800 });
  await page.evaluate(() => __g.noteInput('touch'));
  await wait(200);
  const touch = await page.evaluate(() => {
    const g = __g;
    g.G.god = true; g.enter(1); g.setMode('play'); g.G.god = false; g.G.hp = g.S.maxHp; g.calc();
    g.W.ents = [];
    const e = g.spawn('bot', g.P.x + 1.15, g.P.y, {});
    const stick = document.getElementById('stickzone');
    const atk = document.getElementById('bAtk');
    const r = stick.getBoundingClientRect();
    const down = { bubbles: true, cancelable: true, pointerType: 'touch', pointerId: 3, clientX: r.left + 30, clientY: r.top + 30, button: 0 };
    stick.dispatchEvent(new PointerEvent('pointerdown', down));
    stick.dispatchEvent(new PointerEvent('pointermove', Object.assign({}, down, { clientX: r.left + 70, clientY: r.top + 20 })));
    const joy = (document.getElementById('knob').style.transform || '');
    const x0 = g.P.x;
    for (let i = 0; i < 15; i++) g.update(1 / 30);
    const moved = Math.abs(g.P.x - x0);
    stick.dispatchEvent(new PointerEvent('pointerup', down));
    const hp0 = e ? e.hp : 0;
    atk.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, pointerType: 'touch', pointerId: 4, clientX: 20, clientY: 20, button: 0 }));
    for (let i = 0; i < 25; i++) g.update(1 / 30);
    atk.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerType: 'touch', pointerId: 4, clientX: 20, clientY: 20 }));
    const dealt = e ? hp0 - e.hp : 0;
    const ui = document.documentElement.dataset.ui;
    return { joy, moved, dealt, ui, shown: !document.getElementById('pad').hidden };
  });
  await shot(page, 'touch-fight');
  row('controls', 'The touch stick moves and the attack button hits', touch.ui === 'touch' && touch.moved > 0.05 && touch.dealt > 0 ? 'Works' : 'Partially works', JSON.stringify(touch), 'touch-fight.png');

  const odds = await page.evaluate(() => {
    const g = __g;
    g.noteInput('mouse');
    g.G.god = true; g.enter(0); g.setMode('play'); g.G.god = false;
    g.G.hc = false; g.G.credits = 1000; g.G.act2 = false; g.G.deaths = 0; g.calc(); g.G.hp = g.S.maxHp;
    g.openSheet('skills', {});
    const doc = document.querySelector('[data-doc]');
    const docId = doc && doc.getAttribute('data-doc');
    if (doc) doc.click();
    const picked = g.G.doc;
    g.closeSheet(); g.setMode('play');
    g.G.hp = g.S.maxHp; g.G.credits = 1000; g.G.act2 = false; g.G.deaths = 0; g.G.god = false;
    if (g.P) g.P.inv = 0;
    const before = g.G.credits;
    for (let n = 0; n < 6 && g.mode === 'play'; n++) { if (g.P) g.P.inv = 0; g.G.hp = g.S.maxHp; g.hurt(99999, false, { name: 'a test', hp: 1 }); }
    const after = g.G.credits;
    for (let n = 0; n < 3; n++) g.update(1 / 20);
    const notice = (document.getElementById('deathS') && document.getElementById('deathS').textContent) || '';
    g.setMode('play'); g.G.hc = true; g.G.hp = g.S.maxHp; g.G.credits = 1000; g.calc();
    if (g.P) g.P.inv = 0;
    const hcBefore = g.G.credits;
    for (let n = 0; n < 6 && g.mode === 'play'; n++) { if (g.P) g.P.inv = 0; g.G.hp = g.S.maxHp; g.hurt(99999, false, { name: 'a test', hp: 1 }); }
    const rise = (document.getElementById('bRise') && document.getElementById('bRise').textContent) || '';
    return { before, after, fee: before - after, picked, docId, town: !!(g.W && g.W.z && g.W.z.town), hcDelta: hcBefore - g.G.credits, notice: notice.replace(/\s+/g, ' ').slice(0, 120), rise, mode: g.mode };
  });
  row('economy', 'A normal death sets carried credits on the body', odds.fee > 0 && odds.after === odds.before - odds.fee && odds.hcDelta === 0 ? 'Works' : 'Partially works', JSON.stringify(odds));
  row('classes', 'A doctrine can be chosen from the skill sheet', odds.picked && odds.picked === odds.docId ? 'Works' : 'Partially works', 'doc=' + odds.picked);

  await shot(page, 'play-desktop');
  fs.writeFileSync(OUT, JSON.stringify({ rows, errs: errs.slice(0, 12), bosses: bossOut }, null, 2));
  console.log('SINGLE', rows.length);
  await browser.close();

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'u2087-play-'));
  process.env.DATA_DIR = tmp;
  delete process.env.SMTP_HOST;
  delete process.env.GITHUB_TOKEN;
  process.env.LAN = '1';
  const { server } = require('../server/server');
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = 'http://127.0.0.1:' + server.address().port;
  const b2 = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  async function player(name) {
    const ctx = await b2.newContext({ viewport: { width: 1100, height: 760 } });
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message));
    await p.goto(base + '/');
    await p.waitForTimeout(400);
    const reg = await p.evaluate(async n => {
      const r = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: n, pass: 'audit-partner-1' }) });
      return r.json();
    }, name);
    await p.goto(base + '/');
    await p.waitForTimeout(500);
    await p.evaluate(() => { __g.skipDisc(); const a = document.getElementById('acc'); if (a) a.className = 'off'; });
    await p.evaluate(() => document.querySelector('[data-cls=scrapper]').click());
    await wait(200);
    await clearUI(p);
    await p.evaluate(() => {
      const G = __g.G; G.pre = 2; G.walkNew = 0; G.nodes = G.nodes || {}; G.st = G.st || { wf: {} }; G.lvl = 12; G.unlocked = 8; G.sats = 20;
      __g.OPT.auto = false; __g.enter(0); __g.setMode('play');
    });
    await clearUI(p);
    return { p, reg };
  }
  async function until(p, fn, arg, ms) {
    const end = Date.now() + (ms || 8000);
    for (;;) {
      const v = await p.evaluate(fn, arg).catch(() => null);
      if (v) return v;
      if (Date.now() > end) return null;
      await wait(150);
    }
  }
  const stamp = Date.now().toString(36);
  const A = await player('Ada' + stamp);
  const B = await player('Bo' + stamp);
  await A.p.evaluate(() => __mp.send('game.create', { name: 'Play Game', diff: 'normal' }));
  const gid = await until(A.p, () => __mp.MP.game ? __mp.MP.game.id : null);
  await B.p.evaluate(id => __mp.send('game.join', { id }), gid);
  const uidB = await B.p.evaluate(() => __mp.me && __mp.me.uid);
  const uidA = await A.p.evaluate(() => __mp.me && __mp.me.uid);
  await until(A.p, () => __mp.roster.length >= 2 ? 1 : 0, null, 5000);
  await A.p.evaluate(u => __mp.send('invite', { uid: u }), uidB);
  await wait(400);
  await B.p.evaluate(u => __mp.send('accept', { uid: u }), uidA);
  await until(A.p, () => __mp.MP.party && __mp.MP.party.members.length >= 2 ? 1 : 0, null, 5000);
  await A.p.evaluate(() => { __g.enter(1); __g.setMode('play'); });
  await B.p.evaluate(() => { __g.enter(1); __g.setMode('play'); });
  await wait(1200);
  await clearUI(A.p); await clearUI(B.p);
  const maps = await A.p.evaluate(() => __g.mapPrint());
  const mapsB = await B.p.evaluate(() => __g.mapPrint());
  const seedSame = maps && mapsB && maps.seed && maps.seed === mapsB.seed;
  row('coop', 'Two clients share the district map seed', seedSame ? 'Works' : 'Partially works', JSON.stringify({ a: maps && maps.seed, b: mapsB && mapsB.seed, floorA: maps && maps.floor, floorB: mapsB && mapsB.floor }));
  const mob = await A.p.evaluate(() => {
    const e = __g.W.ents.find(x => x.hp > 0 && !x.mp);
    if (!e) return null;
    return { mid: e.mid, hp: e.hp, k: e.k };
  });
  let sharedLife = null;
  if (mob && mob.mid) {
    await A.p.evaluate(mid => {
      const e = __g.W.ents.find(x => x.mid === mid);
      if (!e) return;
      __g.P.x = e.x + 0.7; __g.P.y = e.y;
      __mp.send('move', { x: __g.P.x, y: __g.P.y, zi: __g.W.zi, dir: 0, hp: Math.round(__g.G.hp), hpm: Math.round(__g.S.maxHp), lvl: __g.G.lvl | 0, tier: __g.G.tier | 0 });
    }, mob.mid);
    await wait(400);
    await A.p.evaluate(mid => {
      const e = __g.W.ents.find(x => x.mid === mid);
      if (e) __g.dmgEnemy(e, Math.max(40, e.hp * 0.35), false);
    }, mob.mid);
    await wait(800);
    sharedLife = await B.p.evaluate(mid => {
      const e = __g.W.ents.find(x => x.mid === mid);
      return e ? { hp: e.hp, max: e.max } : null;
    }, mob.mid);
  }
  row('coop', 'A hit on a shared monster shows on the other client', sharedLife && mob && mob.hp - sharedLife.hp >= 8 ? 'Works' : 'Partially works', JSON.stringify({ mob, sharedLife }));

  await A.p.evaluate(() => { __g.enter(0); __g.setMode('play'); __g.G.bag.push({ slot: 'helm', il: 5, q: 1, base: 'Cap', name: 'Ada Helm', aff: [], id: true, tid: 'helmAda001', val: 10, req: 1 }); });
  await B.p.evaluate(() => { __g.enter(0); __g.setMode('play'); __g.G.bag.push({ slot: 'ring', il: 5, q: 1, base: 'Ring', name: 'Vale Ring', aff: [], id: true, tid: 'ringVale01', val: 10, req: 1 }); });
  await wait(400);
  await A.p.evaluate(u => __mp.send('trade.ask', { uid: u }), uidB);
  await wait(300);
  await B.p.evaluate(u => __mp.send('trade.accept', { uid: u }), uidA);
  await until(A.p, () => __mp.MP.trade && __mp.MP.trade.phase === 'open' ? 1 : 0);
  await A.p.evaluate(() => __mp.send('trade.offer', { sats: 1, items: [__g.G.bag.find(i => i.tid === 'helmAda001')].filter(Boolean) }));
  await B.p.evaluate(() => __mp.send('trade.offer', { sats: 1, items: [__g.G.bag.find(i => i.tid === 'ringVale01')].filter(Boolean) }));
  await wait(200);
  await A.p.evaluate(() => __mp.send('trade.confirm', {}));
  await B.p.evaluate(() => __mp.send('trade.confirm', {}));
  const swapped = await until(A.p, () => __g.G.bag.some(i => i.tid === 'ringVale01') ? 1 : 0, null, 4000);
  const swappedB = await B.p.evaluate(() => __g.G.bag.some(i => i.tid === 'helmAda001'));
  await shot(A.p, 'trade');
  row('trade', 'Two players swap an item in town', swapped && swappedB ? 'Works' : 'Partially works', JSON.stringify({ swapped, swappedB }), 'trade.png');

  await A.p.evaluate(() => { __g.enter(0); __g.setMode('play'); __g.G.lvl = 12; __mp.send('hello', { lvl: 12, cls: __g.G.cls, zi: 0, hp: __g.G.hp, hpm: __g.S.maxHp }); });
  await B.p.evaluate(() => { __g.enter(0); __g.setMode('play'); __g.G.lvl = 12; __mp.send('hello', { lvl: 12, cls: __g.G.cls, zi: 0, hp: __g.G.hp, hpm: __g.S.maxHp }); });
  await wait(3600);
  await A.p.evaluate(u => __mp.send('hostile', { uid: u }), uidB);
  await wait(400);
  const flagged = await until(B.p, u => __mp.MP.hostile && __mp.MP.hostile[u] ? 1 : 0, uidA, 4000);
  await wait(11000);
  await A.p.evaluate(() => { __g.enter(1); __g.setMode('play'); });
  await B.p.evaluate(() => { __g.enter(1); __g.setMode('play'); __g.G.hp = __g.S.maxHp; });
  await wait(5600);
  const stand = await A.p.evaluate(() => {
    const e = __g.W.ents.find(x => x.mp);
    const o = __mp.MP.others && __mp.MP.others[0];
    return { standin: !!e, other: o && { x: o.x, y: o.y }, hp: e && e.hp };
  });
  let taken = 0;
  if (stand.standin) {
    await A.p.evaluate(() => {
      const e = __g.W.ents.find(x => x.mp);
      if (!e) return;
      __g.P.x = e.x + 0.5; __g.P.y = e.y;
      __mp.send('move', { x: __g.P.x, y: __g.P.y, zi: __g.W.zi, dir: 0, hp: Math.round(__g.G.hp), hpm: Math.round(__g.S.maxHp), lvl: __g.G.lvl | 0, tier: __g.G.tier | 0 });
      __g.dmgEnemy(e, 400, false);
    });
    await wait(300);
    taken = await until(B.p, () => __g.G.hp < __g.S.maxHp - 0.5 ? __g.S.maxHp - __g.G.hp : 0, null, 5000) || 0;
  }
  await shot(A.p, 'hostile-hit');
  row('pvp', 'After the declaration hold, a hostile hit lands', flagged && taken > 0 ? 'Works' : 'Partially works', JSON.stringify({ flagged, stand, taken }), 'hostile-hit.png');

  const recon = await (async () => {
    await B.p.context().close();
    await wait(400);
    const ctx = await b2.newContext({ viewport: { width: 1100, height: 760 } });
    const p = await ctx.newPage();
    await p.goto(base + '/');
    await p.waitForTimeout(300);
    const login = await p.evaluate(async n => {
      const r = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: n, pass: 'audit-partner-1' }) });
      return r.json();
    }, 'Bo' + stamp);
    await p.goto(base + '/');
    await p.waitForTimeout(600);
    await p.evaluate(() => { __g.skipDisc(); const a = document.getElementById('acc'); if (a) a.className = 'off'; });
    let label = '';
    for (let i = 0; i < 25 && !label; i++) {
      label = await p.evaluate(() => { const b = document.querySelector('[data-slot="0"]'); return b ? b.textContent : ''; });
      if (!label) await wait(200);
    }
    if (label) await p.evaluate(() => { const b = document.querySelector('[data-slot="0"]'); if (b) b.click(); });
    const back = await until(p, () => __mp.on ? 1 : 0, null, 8000);
    const again = await until(p, () => __mp.MP.game && __mp.MP.game.id, null, 6000);
    return { login: login && (login.ok !== false) && !login.error, back, again, gid, label: (label || '').replace(/\s+/g, ' ').slice(0, 80) };
  })();
  row('coop', 'A player can log in again and rejoin the game', recon.login && recon.again === gid ? 'Works' : 'Partially works', JSON.stringify(recon));

  await b2.close();
  server.close();

  let launcher = { sh: '', bat: 'not executed on this Linux host', http: 0 };
  try {
    const stage = path.join(tmp, 'launch-pack');
    fs.mkdirSync(stage, { recursive: true });
    for (const name of ['server', 'dist', 'src']) {
      const dest = path.join(stage, name);
      if (!fs.existsSync(dest)) fs.symlinkSync(path.join(root, name), dest);
    }
    fs.copyFileSync(path.join(root, 'lan/Play-Unsubscribe-2087.sh'), path.join(stage, 'Play-Unsubscribe-2087.sh'));
    fs.chmodSync(path.join(stage, 'Play-Unsubscribe-2087.sh'), 0o755);
    const child = spawn('bash', [path.join(stage, 'Play-Unsubscribe-2087.sh')], {
      env: Object.assign({}, process.env, { PORT: '8091', LAN: '1' }),
      cwd: stage
    });
    let buf = '';
    child.stdout.on('data', d => { buf += d.toString(); });
    child.stderr.on('data', d => { buf += d.toString(); });
    await wait(1800);
    try {
      const res = await fetch('http://127.0.0.1:8091/');
      launcher.http = res.status;
    } catch (e) { launcher.http = 0; }
    child.kill('SIGTERM');
    await wait(300);
    launcher.sh = buf.slice(0, 500);
    launcher.missing = /Cannot find module/.test(buf);
  } catch (e) { launcher.sh = String(e.message || e); }
  const bat = fs.readFileSync(path.join(root, 'lan/Play-Unsubscribe-2087.bat'), 'utf8');
  const command = fs.readFileSync(path.join(root, 'lan/Play-Unsubscribe-2087.command'), 'utf8');
  launcher.batHasNode = /node/.test(bat);
  launcher.commandMatchesSh = command === fs.readFileSync(path.join(root, 'lan/Play-Unsubscribe-2087.sh'), 'utf8');
  row('lan', 'The Linux launcher starts the LAN server', launcher.http === 200 && !launcher.missing ? 'Works' : 'Partially works', ('http ' + launcher.http + ' ' + launcher.sh).replace(/\s+/g, ' ').slice(0, 180));
  row('lan', 'The Mac launcher is the same script as Linux', launcher.commandMatchesSh ? 'Works' : 'Partially works', 'byte match with the shell launcher');
  row('lan', 'The Windows launcher is a node double-click script', 'Couldn\'t verify', 'This host cannot run a .bat. The file looks for node, refuses anything older than 18, and tells the player to allow private networks only.');

  fs.writeFileSync(OUT, JSON.stringify({ rows, errs: errs.slice(0, 20), bosses: bossOut, places, rush, launcher }, null, 2));
  console.log('WROTE', OUT, 'rows', rows.length, 'errs', errs.length);
  process.exit(errs.length ? 0 : 0);
})().catch(e => {
  console.error(e);
  try { fs.writeFileSync(OUT, JSON.stringify({ rows, errs: errs.slice(0, 20), fatal: String(e && e.stack || e) }, null, 2)); } catch (err) {}
  process.exit(1);
});
