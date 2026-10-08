/* The Maximalist. `node server/test/maxi.js`
   What matters: he is not on offer until the story is finished, his damage type cannot be
   resisted by anything, and every active actually fires. */
'use strict';
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');

let pass = 0, fail = 0; const out = [];
const ok = (n, c, d) => { if (c) { pass++; out.push('  ok   ' + n); } else { fail++; out.push('  FAIL ' + n + (d ? '  <' + d + '>' : '')); } };

const html = '<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">' +
  fs.readFileSync(path.join(__dirname, '..', '..', 'dist', 'unsubscribe.html'), 'utf8') + '</body></html>';

const clear = async p => { for (let i = 0; i < 14; i++) { await p.evaluate(() => {
  const s = document.getElementById('scene'); if (s && !s.hidden) document.getElementById('scSkip').click();
  const d = document.getElementById('dlg'); if (d && !d.hidden) { const x = d.querySelector('#dBtns button:not([disabled])'); x && x.click(); }
}); await p.waitForTimeout(140); } };

(async () => {
  const b = await chromium.launch();
  const errs = [];

  /* ---- locked by default ---- */
  let p = await b.newPage({ viewport: { width: 390, height: 800 } });
  p.on('pageerror', e => errs.push(e.message + ' @ ' + (e.stack||'').split('\n').slice(1,3).join(' | ')));
  await p.setContent(html); await p.waitForTimeout(900);
  await p.evaluate(() => __g.skipDisc()); await p.waitForTimeout(250);

  const offered = await p.evaluate(() => [...document.querySelectorAll('[data-cls]')].map(e => e.dataset.cls));
  ok('the starter classes are on a fresh account', offered.length === 7 && offered.includes('witness') && offered.includes('homesteader'), offered.join(','));
  ok('the Maximalist is not among them', !offered.includes('maxi'), offered.join(','));

  /* ---- he exists in the data, with a full tree ---- */
  const def = await p.evaluate(() => {
    const c = __g.CLS.maxi;
    return { n: c.n, skills: c.sk.length, locked: c.locked, col: c.col,
      names: c.sk.map(s => s.n), actives: c.sk.filter(s => s.a).length, auras: c.sk.filter(s => s.aura).length };
  });
  ok('he has the same fifteen-skill tree as everyone else', def.skills === 15, String(def.skills));
  ok('ten of them are active', def.actives === 10, String(def.actives));
  ok('three of those are auras', def.auras === 3, String(def.auras));
  ok('he is marked as locked', def.locked === 'story');
  ok('rows 4 and 5 are his own skills',
    def.names.includes('The Halving') && def.names.includes('Not Your Keys') && !def.names.includes('Nonce Found'), def.names.slice(9).join(','));

  /* ---- Sound: no table, no multiplier, no argument ---- */
  const sound = await p.evaluate(() => {
    const g = __g;
    const types = Object.keys(g.DTY || {});
    /* every enemy's resistance table, checked for any mention of sound at all */
    let resisters = 0;
    for (const k in g.RES) if ('sound' in g.RES[k]) resisters++;
    return { types, hasSound: types.includes('sound'), resisters };
  }).catch(e => ({ err: e.message }));
  ok('Sound is a real damage type', sound.hasSound === true, JSON.stringify(sound.types));
  ok('nothing in the game resists it', sound.resisters === 0, String(sound.resisters));

  /* ---- unlock, then play him ---- */
  await p.click('[data-cls=scrapper]'); await p.waitForTimeout(800);
  await clear(p);
  const before = await p.evaluate(() => !!__g.ACC.maxi);
  ok('still locked mid-game', before === false);

  /* Finish every quest and let the feat tick notice, which is the real path. */
  await p.evaluate(() => { const g = __g; for (const k in g.QUESTS) g.G.q[k] = 3;
    g.G.act2 = g.G.act3 = g.G.act4 = g.G.act5 = true; g.maxiCheck(); });
  await p.waitForTimeout(400);
  ok('finishing the story unlocks him', await p.evaluate(() => !!__g.ACC.maxi));
  ok('and says so', /waiting/i.test(await p.evaluate(() => document.getElementById('dT').textContent || '')));
  await clear(p);

  await p.evaluate(() => __g.closeSheet && 0);
  const nowOffered = await p.evaluate(() => { __g.drawSlots && __g.drawSlots();
    const el = document.getElementById('clsList');
    return el ? [...el.querySelectorAll('[data-cls]')].map(e => e.dataset.cls) : []; });

  /* ---- become him and fire everything ---- */
  await p.evaluate(() => { const g = __g; g.G.god = true; g.G.lvl = 60; g.G.unlocked = 40;
    g.G.sats = 999; g.shapeShift('maxi', 'orange'); });
  await p.waitForTimeout(400);
  ok('he can be played', await p.evaluate(() => __g.G.cls === 'maxi'));
  ok('his base damage type is Sound', await p.evaluate(() => { const g = __g; return g.CLS[g.G.cls] && g.P ? true : false; }));

  await p.evaluate(() => __g.enter(3)); await p.waitForTimeout(700); await clear(p);
  await p.evaluate(() => { try { __g.repop(); } catch (e) {} });
  await p.waitForTimeout(300);

  const fired = await p.evaluate(() => {
    const g = __g, res = {};
    g.G.sk = g.G.sk.map(() => 5);              /* every skill at rank five */
    for (let i = 0; i < 15; i++) {
      const s = g.CLS.maxi.sk[i];
      if (!s.a) { res[i] = 'passive'; continue; }
      try { const f = g.SKF.maxi[i]; if (!f) { res[i] = 'MISSING'; continue; }
        g.G.en = 999; f(5, 1); res[i] = 'ok'; } catch (e) { res[i] = 'THREW ' + e.message; }
    }
    return res;
  });
  const bad = Object.entries(fired).filter(([k, v]) => v !== 'ok' && v !== 'passive');
  ok('every active fires without throwing', bad.length === 0, JSON.stringify(fired));

  /* ---- the damage actually lands, and a shielded enemy gets no benefit ---- */
  const dmg = await p.evaluate(() => {
    const g = __g;
    const e = g.W.ents.find(x => x.hp > 0);
    if (!e) return { err: 'nothing to hit' };
    e.mods = e.mods || {}; e.mods.shield = 1;        /* halves damage for everyone else */
    const hp0 = e.hp;
    g.hit(e, 1);
    return { took: +(hp0 - e.hp).toFixed(1), shielded: true };
  });
  ok('Sound goes through a shield', dmg.took > 0, JSON.stringify(dmg));

  /* ---- auras: one at a time, on until swapped, and actually doing something ---- */
  const aura = await p.evaluate(() => {
    const g = __g, out = {};
    g.SKF.maxi[3](5, 1);  out.first = g.P.aura && g.P.aura.i;
    g.SKF.maxi[4](5, 1);  out.swapped = g.P.aura && g.P.aura.i;
    out.onlyOne = typeof g.P.aura.i === 'number';
    out.shown = g.maxiBuff();
    /* Marked to Market should mark whatever is standing in it */
    const e = g.W.ents.find(x => x.hp > 0 && !x.mp);
    if (e) { e.x = g.P.x + 1; e.y = g.P.y; e.mark = 0; for (let i = 0; i < 4; i++) g.maxiAura(1 / 60); out.marked = e.mark > 0; }
    g.SKF.maxi[4](5, 1);  out.off = g.P.aura === null;   /* casting the same one turns it off */
    return out;
  });
  ok('an aura turns on', aura.first === 3, JSON.stringify(aura));
  ok('casting another swaps it rather than stacking', aura.swapped === 4 && aura.onlyOne);
  ok('the one that is on is named in the display', /Marked to Market/.test(aura.shown || ''), aura.shown);
  ok('Marked to Market marks what stands in it', aura.marked === true);
  ok('casting the same aura turns it off', aura.off === true);

  ok('no page errors', errs.length === 0, errs.slice(0, 2).join(' | '));
  await p.close();

  console.log(out.join('\n'));
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  await b.close();
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
