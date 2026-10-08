/* Party synergy that this pass changed.
   node tools/party-pass.js
   One page. A summon in Toxic Maximalism swings faster and does not run faster.
   Open Book's 8% stops at 6 paces. Marked to Market marks a hostile stand-in.
   A guest's Proof of Work disc does not pulse. */
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
    await p.waitForTimeout(st === 'locked' ? 350 : 140);
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
  await page.waitForTimeout(150);
  await page.click('[data-cls=scrapper]');
  await page.evaluate(() => { const G = __g.G; G.pre = 2; G.seenIntro = false; __g.OPT.sound = false; __g.OPT.music = false; __g.OPT.shake = false; });
  await clearUI(page);
  const report = await page.evaluate(() => {
    const fail = [], note = [];
    const check = (n, ok, extra) => { if (!ok) fail.push(n + (extra !== undefined ? ': ' + extra : '')); };
    const g = __g, G = g.G, P = g.P, W = g.W, MP = g.MP;
    G.god = true; G.lvl = 30; G.act2 = true; G.act3 = true; G.cls = 'maxi';
    G.sk = [1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0];
    G.pas = [10];
    g.calc();
    g.enter(1, { fresh: true });
    g.setMode('play');
    const W2 = g.W, P2 = g.P;
    W2.ents.length = 0; W2.allies.length = 0; W2.projs.length = 0; W2.fx.length = 0; W2.merc = null; W2.tag = null;
    MP.others = []; MP.party = null; MP.hostile = {};
    P2.aura = { i: 3, L: 1, t: 1 };
    const near = { k: 'minion', kind: 'intern', x: P2.x + 0.4, y: P2.y, hp: 40, max: 40, r: 0.3, toxL: 0, haste: 0, cd: 0, ivl: 0.6, m: 1, life: 1e9 };
    const far = { k: 'minion', kind: 'intern', x: P2.x + 14, y: P2.y, hp: 40, max: 40, r: 0.3, toxL: 9, haste: 0, cd: 0, ivl: 0.6, m: 1, life: 1e9 };
    W2.allies.push(near, far);
    g.maxiAura(0.02);
    check('a summon inside Toxic Maximalism takes the 15+3 line', Math.abs(g.toxicSwing(near) - 1.18) < 1e-9, String(near.toxL));
    check('that summon does not take the run line', !(near.haste > 0), String(near.haste));
    check('a summon outside the aura is not toxic', !(far.toxL > 0) && !(g.toxicSwing(far) > 1), String(far.toxL));
    const merc = { x: P2.x + 0.3, y: P2.y, hp: 20, max: 20, r: 0.28, haste: 0, cd: 0, toxL: 0 };
    W2.merc = merc;
    g.maxiAura(0.02);
    check('the hireling still runs with the aura', merc.haste >= 0.3, String(merc.haste));

    /* Open Book: 8% inside 6 paces, not past them, not on a player. */
    G.cls = 'scrapper'; P2.aura = null; P2.toxL = 0; P2.book = 8; P2.allySwing = 0; P2.swingBody = null;
    g.calc();
    W2.ents.length = 0;
    const mob = { k: 'tick', x: P2.x + 1, y: P2.y, r: 0.35, hp: 5000, max: 5000, dmg: 1, spd: 0, mark: 0, aggro: true, mods: {}, flash: 0, stun: 0, slow: 0, ward: 0, name: 'Tick' };
    W2.ents.push(mob);
    const rnd = Math.random;
    Math.random = () => 0.99;
    mob.hits = 1;
    P2.book = 0;
    g.hit(mob, 1, true);
    const baseD = 5000 - mob.hp;
    mob.hp = 5000; mob.hits = 1;
    P2.book = 8;
    g.hit(mob, 1, true);
    const selfD = 5000 - mob.hp;
    mob.hp = 5000; mob.hits = 1;
    const ally = { x: P2.x + 1, y: P2.y, toxL: 0 };
    P2.allySwing = 1; P2.swingBody = ally;
    g.hit(mob, 1, true);
    const nearD = 5000 - mob.hp;
    mob.hp = 5000; mob.hits = 1;
    ally.x = P2.x + 8;
    g.hit(mob, 1, true);
    const farD = 5000 - mob.hp;
    mob.hp = 5000; mob.hits = 1; mob.mp = 'foe';
    MP.others = [{ uid: 'foe', x: mob.x, y: mob.y, hp: 5000, hpm: 5000 }];
    ally.x = P2.x + 1;
    const before = mob.hp;
    g.hit(mob, 1, true);
    const pvpRaw = (before - mob.hp) / 0.25;
    P2.allySwing = 0; P2.swingBody = null; P2.book = 0; mob.mp = 0;
    Math.random = rnd;
    check('Open Book adds 8% on your own swing', selfD > baseD * 1.07 && selfD < baseD * 1.1, baseD + ' -> ' + selfD);
    check('Open Book adds the same 8% for an ally inside 6 paces', Math.abs(nearD - selfD) < 0.05, selfD + ' vs ' + nearD);
    check('Open Book adds nothing past 6 paces', Math.abs(farD - baseD) < 0.05, baseD + ' vs ' + farD);
    check('Open Book does not add that 8% to a player', Math.abs(pvpRaw - baseD) < 0.05, baseD + ' vs ' + pvpRaw);
    note.push('book base ' + baseD.toFixed(2) + ' self ' + selfD.toFixed(2) + ' near ' + nearD.toFixed(2) + ' far ' + farD.toFixed(2));

    /* Marked to Market on a hostile stand-in, before the packet. */
    G.cls = 'maxi'; G.sk[4] = 10; g.calc();
    P2.aura = { i: 4, L: 10, t: 1 }; P2.toxL = 0;
    W2.ents.length = 0; W2.fx.length = 0;
    const stand = { mp: 'foe', k: 'player', x: P2.x + 0.6, y: P2.y, r: 0.45, hp: 1e9, max: 1e9, mods: {}, name: 'Vale', mark: 0, mkP: 0 };
    W2.ents.push(stand);
    MP.others = [{ uid: 'foe', name: 'Vale', x: stand.x, y: stand.y, hp: 1e9, hpm: 1e9 }];
    MP.hostile = { foe: 1 };
    Math.random = () => 0.99;
    g.hit(stand, 1, true);
    const unmarked = 1e9 - stand.hp;
    stand.hp = 1e9; stand.mark = 0; stand.mkP = 0;
    g.maxiAura(0.02);
    check('the stand-in is marked', stand.mark >= 0.4 && stand.mkP > 0.5, String(stand.mkP));
    g.hit(stand, 1, true);
    const marked = 1e9 - stand.hp;
    Math.random = rnd;
    check('Marked to Market raises the hit the packet will scale', marked > unmarked * 1.5, unmarked + ' -> ' + marked);

    /* A guest draws the disc. Only the holder pulses. */
    W2.ents.length = 0;
    const victim = { k: 'tick', x: P2.x + 1, y: P2.y, r: 0.35, hp: 800, max: 800, mods: {}, name: 'Tick', mark: 0, flash: 0, stun: 0, slow: 0, ward: 0 };
    W2.ents.push(victim);
    P2.aura = null;
    MP.party = { members: [{ uid: 'ally' }] };
    MP.others = [{ uid: 'ally', x: P2.x, y: P2.y, au: 7, aL: 5, hp: 10, hpm: 10, cls: 'maxi' }];
    const hp0 = victim.hp;
    g.maxiAura(0.6);
    check('a guest Proof of Work does not pulse', victim.hp === hp0, hp0 + ' -> ' + victim.hp);
    P2.aura = { i: 7, L: 1, t: 0 };
    G.cls = 'maxi'; g.calc();
    g.maxiAura(0.02);
    check('the holder still pulses', victim.hp < hp0, hp0 + ' -> ' + victim.hp);

    /* Indemnity sees a crit that arrived as kind. God mode would swallow the hit. */
    G.cls = 'scrapper';
    G.god = false;
    G.sk = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    g.calc();
    g.S.sp.indemnity = 1;
    G.hp = g.S.maxHp; P2.inv = 0; g.setMode('play');
    const full = G.hp;
    g.mpRecv({ t: 'pvp', from: 'Vale', fromUid: 'foe', dmg: 40, kind: 'crit' });
    const withCrit = full - G.hp;
    G.hp = full; P2.inv = 0; g.setMode('play');
    g.mpRecv({ t: 'pvp', from: 'Vale', fromUid: 'foe', dmg: 40, kind: '' });
    const plain = full - G.hp;
    check('a crit packet is indemnified', withCrit > 0 && withCrit < plain - 0.5, 'crit ' + withCrit.toFixed(2) + ' plain ' + plain.toFixed(2));
    note.push('indemnity crit ' + withCrit.toFixed(2) + ' plain ' + plain.toFixed(2));
    return { fail, note, errs: [] };
  });
  await browser.close();
  const fail = report.fail.concat(errs);
  for (const n of report.note) console.log('note', n);
  if (fail.length) {
    for (const f of fail) console.log('FAIL', f);
    process.exit(1);
  }
  console.log('party-pass ok');
})().catch(e => { console.error(e); process.exit(1); });
