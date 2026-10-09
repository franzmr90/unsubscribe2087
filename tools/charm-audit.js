/* Charm audit. Usage: node tools/charm-audit.js
   Loads dist/unsubscribe.html and prints the live charm rolls, belt stim
   caps, and sheet impact next to a rare kit. The tables in
   docs/design/CHARM_REDESIGN.md cite this output. No gameplay changes. */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CHROME = process.env.PW_CHROMIUM || '/usr/local/bin/google-chrome';
const root = path.join(__dirname, '..');

function pct(sorted, p) {
  if (!sorted.length) return null;
  const i = Math.min(sorted.length - 1, Math.max(0, Math.round((sorted.length - 1) * p)));
  return sorted[i];
}
function sum(a) { let n = 0; for (const x of a) n += x; return n; }

(async () => {
  const b = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const p = await b.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(String(e.message || e)));
  const html = fs.readFileSync(path.join(root, 'dist/unsubscribe.html'), 'utf8');
  await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">' + html + '</body></html>');
  await p.waitForTimeout(400);
  await p.evaluate(() => __g.skipDisc());
  await p.click('[data-cls=scrapper]');
  await p.waitForTimeout(400);

  const report = await p.evaluate(() => {
    const g = window.__g;
    const G = g.G;
    const stages = [
      { name: 'Act I, Humming Fields', lvl: 8, il: 6 },
      { name: 'Act I, Glass Cathedral', lvl: 14, il: 12 },
      { name: 'Act II, Mezzanine', lvl: 30, il: 27 },
      { name: 'Act III, Still Water', lvl: 45, il: 42 },
      { name: 'Act V, The Room', lvl: 78, il: 72 },
      { name: 'Act V, tier-2 replay', lvl: 90, il: 96 }
    ];
    const ils = [1, 6, 12, 18, 27, 36, 42, 57, 72, 84, 96];

    function dist(arr) {
      const s = arr.slice().sort((a, b) => a - b);
      const n = s.length;
      const at = q => s[Math.min(n - 1, Math.max(0, Math.round((n - 1) * q)))];
      return { n, min: s[0], p50: at(0.5), p90: at(0.9), max: s[n - 1], avg: Math.round(s.reduce((a, b) => a + b, 0) / n * 10) / 10 };
    }

    function charmDist(il, n) {
      const by = {};
      for (let i = 0; i < n; i++) {
        const c = g.mkCharm(il);
        const a = c.aff[0];
        if (!by[a.k]) by[a.k] = [];
        by[a.k].push(a.v);
      }
      const out = {};
      for (const k in by) out[k] = dist(by[k]);
      return out;
    }

    function affDist(il, q, slot, n) {
      const by = {};
      let items = 0, affs = 0;
      for (let i = 0; i < n; i++) {
        const it = g.makeItem(il, q, slot);
        items++;
        affs += it.aff.length;
        for (const a of it.aff) {
          if (!by[a.k]) by[a.k] = [];
          by[a.k].push(a.v);
        }
      }
      const out = { items, affPer: Math.round(affs / items * 10) / 10 };
      for (const k of ['dmg', 'hp', 'crit', 'mf', 'en', 'mspd', 'gold', 'skills', 'r_all', 'leech', 'aspd']) {
        if (by[k]) out[k] = Object.assign({ rate: Math.round(by[k].length / items * 1000) / 10 }, dist(by[k]));
      }
      return out;
    }

    function sheet() {
      g.calc();
      const S = g.S;
      const mid = (S.dmin + S.dmax) / 2 * (1 + S.dmg / 100) + (S.shock || 0);
      return {
        dmg: Math.round(mid * 10) / 10,
        ed: Math.round(S.dmg * 10) / 10,
        hp: S.maxHp,
        crit: S.crit,
        mf: S.mf,
        en: S.maxEn,
        mspd: S.mspd,
        cap: S.cap
      };
    }

    function setHero(lvl) {
      G.cls = 'scrapper';
      G.lvl = lvl;
      G.sk = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      G.web = {};
      G.charms = [];
      G.charmOff = 0;
      G.para = 0;
      G.fork = {};
      G.tier = 0;
      G.diff = 0;
      G.cpi = 1;
      G.form = null;
      const ap = (lvl - 1) * 5;
      const mgt = Math.round(ap * 0.4);
      const vit = Math.round(ap * 0.4);
      const ref = Math.round(ap * 0.15);
      G.at = { mgt, ref, vit, bnd: Math.max(0, ap - mgt - vit - ref) };
      G.eq = { weapon: null, helm: null, armor: null, gloves: null, boots: null, belt: null, ring: null, amulet: null };
      g.calc();
    }

    function equipBest(slot, il, n) {
      let best = null, score = -1e9;
      for (let i = 0; i < n; i++) {
        const it = g.makeItem(il, 2, slot);
        it.id = true;
        G.eq[slot] = it;
        const s = sheet();
        const sc = s.dmg + s.hp / 8;
        if (sc > score) { score = sc; best = it; }
      }
      G.eq[slot] = best;
      return best;
    }

    function charmLoad(il, mode) {
      const bag = [];
      const n = mode === 'typical' ? 6 : 200;
      for (let i = 0; i < n; i++) {
        const c = g.mkCharm(il);
        c.on = true;
        bag.push(c);
      }
      if (mode === 'typical') return bag;
      const key = mode === 'dmg' ? 'dmg' : 'hp';
      const picked = bag.filter(c => c.aff[0].k === key).sort((a, b) => b.aff[0].v - a.aff[0].v).slice(0, 6);
      if (picked.length < 6) return [];
      return picked;
    }

    function applyCharms(list) {
      G.charms = list.map(c => Object.assign({}, c, { on: true }));
      G.charmOff = 0;
      return sheet();
    }

    const belts = [1, 8, 16, 24].map(il => {
      const it = g.makeItem(il, 0, 'belt');
      return { il, base: it.base, cap: it.cap, arm: it.arm };
    });
    const repair = g.mkFixed(g.UNI.find(u => u.id === 'repair'), 8, 4);
    G.eq.belt = repair;
    G.charms = [];
    const repairCap = sheet().cap;
    G.eq.belt = null;

    const charmSamples = {};
    for (const il of ils) charmSamples[il] = charmDist(il, 4000);

    const gearSamples = {};
    for (const il of [6, 12, 27, 42, 72]) {
      gearSamples[il] = {
        magicWeapon: affDist(il, 1, 'weapon', 600),
        rareWeapon: affDist(il, 2, 'weapon', 400),
        rareArmor: affDist(il, 2, 'armor', 400),
        rareRing: affDist(il, 2, 'ring', 400),
        rareAmulet: affDist(il, 2, 'amulet', 300)
      };
    }

    const sheets = [];
    for (const st of stages) {
      setHero(st.lvl);
      const naked = sheet();
      for (const slot of ['weapon', 'helm', 'armor', 'gloves', 'boots', 'belt', 'ring', 'amulet']) equipBest(slot, st.il, 24);
      const geared = sheet();
      const belt = G.eq.belt;
      const savedW = G.eq.weapon;
      let up = 0, upName = '';
      for (let i = 0; i < 40; i++) {
        const it = g.makeItem(st.il, 2, 'weapon');
        it.id = true;
        G.eq.weapon = it;
        const d = sheet().dmg;
        if (d > up) { up = d; upName = it.name; }
      }
      G.eq.weapon = savedW;
      const upgrade = up;

      function trial(mode, times) {
        const rows = [];
        for (let t = 0; t < times; t++) {
          const list = charmLoad(st.il, mode);
          if (list.length < 1) { rows.push(null); continue; }
          rows.push(applyCharms(list));
        }
        G.charms = [];
        g.calc();
        const ok = rows.filter(Boolean);
        const dm = ok.map(r => r.dmg).sort((a, b) => a - b);
        const hp = ok.map(r => r.hp).sort((a, b) => a - b);
        const mid = i => ok.length ? (i === 'd' ? dm[Math.floor((dm.length - 1) / 2)] : hp[Math.floor((hp.length - 1) / 2)]) : null;
        return { n: ok.length, dmg: mid('d'), hp: mid('h') };
      }

      const typical = trial('typical', 40);
      const bestDmg = trial('dmg', 25);
      const bestHp = trial('hp', 25);
      sheets.push({
        name: st.name, lvl: st.lvl, il: st.il,
        naked, geared,
        belt: belt && { base: belt.base, cap: belt.cap },
        weaponUpgrade: { from: geared.dmg, to: Math.round(upgrade * 10) / 10, name: upName },
        typical, bestDmg, bestHp
      });
    }

    G.charms = [];
    G.cpi = 1;

    return { belts, repair: { base: repair.base, itemCap: repair.cap, wornCap: repairCap }, charmSamples, gearSamples, sheets };
  });

  const lines = [];
  const say = s => lines.push(s);
  say('# Charm audit');
  say('');
  say('Live numbers from `dist/unsubscribe.html` on this branch. Scrapper, 40% Might / 40% Vitality / 15% Reflex / rest Bandwidth, one point in the first skill, no web, no tenure. A "good rare kit" is the best of 24 rares per slot, scored by sheet damage plus life/8.');
  say('');
  if (errs.length) say('Page errors: ' + errs.join(' | '));

  say('## Belt stim caps today');
  say('');
  say('| Item level | Base | Stim cap on the item |');
  say('|---|---|---|');
  for (const blt of report.belts) say('| ' + blt.il + ' | ' + blt.base + ' | ' + blt.cap + ' |');
  say('');
  say('No belt: stim cap 4 (the default in `calc`). Right to Repair is a ' + report.repair.base + ' with item cap ' + report.repair.itemCap + '; worn, the special adds 4, so the sheet cap is ' + report.repair.wornCap + '.');
  say('');

  say('## Subscription bill');
  say('');
  say('`chBill` in `src/p10.js` is `floor(12 × running × cpi)` credits per minute. The function is not on `window.__g`; the table is that formula.');
  say('');
  say('| Running | Bill at prices ×1 | Bill at prices ×3 |');
  say('|---|---|---|');
  for (const n of [1, 3, 6]) say('| ' + n + ' | ' + Math.floor(12 * n * 1) + ' | ' + Math.floor(12 * n * 3) + ' |');
  say('');

  say('## Charm rolls (4,000 each)');
  say('');
  say('One affix, seven stats, equal chance. Value is `round(uniform(low, high) × (1 + il/40))`, then truncated to an integer, minimum 1.');
  say('');
  const keys = ['dmg', 'hp', 'mf', 'crit', 'en', 'mspd', 'gold'];
  say('| il | ' + keys.map(k => k + ' p50 (min–max)').join(' | ') + ' |');
  say('|---|' + keys.map(() => '---').join('|') + '|');
  for (const il of Object.keys(report.charmSamples)) {
    const row = report.charmSamples[il];
    const cells = keys.map(k => {
      const d = row[k];
      if (!d) return '—';
      return d.p50 + ' (' + d.min + '–' + d.max + ')';
    });
    say('| ' + il + ' | ' + cells.join(' | ') + ' |');
  }
  say('');

  say('## Gear affixes at the same item levels');
  say('');
  say('Rate is the percent of items that rolled that affix. A rare carries several affixes; a charm carries one.');
  say('');
  for (const il of Object.keys(report.gearSamples)) {
    say('### Item level ' + il);
    say('');
    const g = report.gearSamples[il];
    for (const [label, block] of [['Magic weapon', g.magicWeapon], ['Rare weapon', g.rareWeapon], ['Rare armor', g.rareArmor], ['Rare ring', g.rareRing], ['Rare amulet', g.rareAmulet]]) {
      const bits = [];
      for (const k of ['dmg', 'hp', 'crit', 'mf', 'skills', 'r_all']) {
        const d = block[k];
        if (!d) continue;
        bits.push(k + ' ' + d.rate + '% of items, p50 ' + d.p50 + ' (' + d.min + '–' + d.max + ')');
      }
      say('- **' + label + '** (' + block.affPer + ' affixes): ' + (bits.join('; ') || 'none of the tracked stats'));
    }
    say('');
  }

  say('## Sheet: rare kit vs six running charms');
  say('');
  say('Typical is the median of 40 random sets of six. Best damage and best life are the median of 25 chases, each chase keeping the six highest of that stat out of 200 charms. A short chase is discarded.');
  say('');
  say('| Stage | lvl | il | Naked dmg / life | Rare kit dmg / life | Typical six | Best six damage | Best six life | Best of 40 rare weapons |');
  say('|---|---|---|---|---|---|---|---|---|');
  for (const s of report.sheets) {
    const pctD = (v) => v == null ? '—' : (v > s.geared.dmg ? '+' : '') + Math.round((v - s.geared.dmg) / s.geared.dmg * 100) + '% dmg';
    const pctH = (v) => v == null ? '—' : (v > s.geared.hp ? '+' : '') + Math.round((v - s.geared.hp) / s.geared.hp * 100) + '% life';
    const cell = (row) => row && row.dmg != null ? row.dmg + ' / ' + row.hp + ' (' + pctD(row.dmg) + ', ' + pctH(row.hp) + ')' : '—';
    const up = s.weaponUpgrade;
    const upPct = Math.round((up.to - up.from) / up.from * 100);
    say('| ' + s.name + ' | ' + s.lvl + ' | ' + s.il + ' | ' + s.naked.dmg + ' / ' + s.naked.hp + ' | ' + s.geared.dmg + ' / ' + s.geared.hp + ' (ED ' + s.geared.ed + ') | ' + cell(s.typical) + ' | ' + cell(s.bestDmg) + ' | ' + cell(s.bestHp) + ' | ' + up.to + ' (' + (upPct >= 0 ? '+' : '') + upPct + '%) |');
  }
  say('');
  say('Belt worn in the rare kit: ' + report.sheets.map(s => s.name + ' → ' + (s.belt ? s.belt.base + ' (' + s.belt.cap + ' stims)' : 'none')).join('; ') + '.');
  say('');

  const text = lines.join('\n');
  console.log(text);
  await b.close();
  if (errs.length) process.exit(1);
})().catch(e => { console.error(e); process.exit(1); });
