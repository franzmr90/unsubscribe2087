/* Acts III-V, measured with a hero that plays rather than one that walks in.
   node tools/balance-play.js        writes notes/balance-play.md

   WHY THIS EXISTS, AND HOW IT DIFFERS FROM tools/balance.js

   balance.js is a controlled fight: a level-matched hero with rolled rare gear
   presses its first skill button and steps into a pack. That isolates the
   monster maths from the player, which is a real thing to want -- but it means
   the death rates it reports are the death rates of a bad pilot, and nobody
   plays like that. Read against a person, it is pessimistic in combat and
   blind to progression entirely: nothing ever levels, loots or re-gears.

   This harness keeps balance.js's starting conditions exactly, so the two are
   comparable, and replaces the pilot:

     - It spends points on level-up through the game's own buildApply(), and
       then grows the passive web, which buildApply seeds once and never adds
       to again -- so a hero that levels during a run keeps gaining web nodes
       the way a person's would.
     - It picks skills by situation rather than by slot order. SKV[cls][i].k
       says what a skill's effect is shaped like, so a 'ring' or 'patch' with a
       radius is area damage, a 'trail' with reach is ranged, an 'arc' is a
       swing, and the rest are buffs. A crowd gets the biggest area skill, a
       distant target gets reach, a body in your face gets the cheapest swing.
     - It fights waves, not one pack, so experience, drops, gear and cooldown
       economy all get a turn. Between waves it picks up what dropped and wears
       anything better, through the game's own equipBest().
     - It stims under a threshold, backs out of telegraphed ground effects, and
       kites if its class profile says to.

   The report carries the realism columns (skills used, levels gained, web
   nodes taken, pieces equipped) ON PURPOSE. They are not decoration: a bot
   that silently stops levelling or only ever casts one skill looks exactly
   like a balanced game, and those columns are how that is caught. If "skills"
   reads 1 across a row, do not believe the rest of the row.

   WHAT THIS PILOT STILL IS NOT

   - The witness is piloted badly and the report says so: it casts about one
     skill per fight. Its kit is gated on a page resource that its basic attack
     refills, and a person plays around that deliberately -- builds page, then
     spends it. This pilot only knows "that was refused, try again later", so
     it never builds on purpose. Any witness row is a floor, not a reading.
     Other classes with their own resource (the homesteader's compost, the
     maxi's aura) should be checked the same way before their rows are trusted.
   - Wearing nothing is usually correct, not a bug. The hero starts in rolled
     rares at the district's level, and four waves of drops rarely beat that.
     Took/Wore shows both numbers so the two cases can be told apart.
   - It does not go to town, buy, repair, respec, or choose where to fight.

   Env: BP_CLASSES, BP_ZONES, BP_DIFFS, BP_WAVES, BP_SECS, BP_OUT.             */
const {chromium} = require('playwright');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'dist/unsubscribe.html'), 'utf8');
const OUT = process.env.BP_OUT || path.join(root, 'notes', 'balance-play.md');

/* the same builds balance.js and progression-play.js pilot */
const BUILD = {scrapper:'crew', hacker:'chain', courier:'rush', anon:'demo',
               founder:'head', homesteader:'bed', witness:'page', maxi:'orange'};
/* kite = keep your distance; back = how low before giving ground; stim = when to drink */
const PROF = {
  scrapper:{kite:0,back:.36,stim:.42}, hacker:{kite:1,near:3.0,far:6.4,stim:.48},
  courier:{kite:1,near:2.7,far:6.2,stim:.45}, anon:{kite:0,back:.40,stim:.45},
  founder:{kite:1,near:3.2,far:6.5,stim:.50}, homesteader:{kite:0,back:.38,stim:.46},
  witness:{kite:0,back:.34,stim:.48}, maxi:{kite:0,back:.36,stim:.42}
};
const CLASSES = (process.env.BP_CLASSES || Object.keys(BUILD).join(',')).split(',').filter(Boolean);
const TRASH = [12,13,14,15,22,23,24,25,28,29,30,31];
const BOSSES = [16,26,32];
const ZONES = (process.env.BP_ZONES || TRASH.concat(BOSSES).join(',')).split(',').map(Number);
const DIFFS = (process.env.BP_DIFFS || '0,1,2').split(',').map(Number);
const WAVES = +(process.env.BP_WAVES || 4);
const SECS = +(process.env.BP_SECS || 70);
const DIFFN = ['Normal','Hard','Brutal'];

async function dismiss(page) {
  for (let i = 0; i < 40; i++) {
    const st = await page.evaluate(() => {
      if (__g.mode === 'intro') { __g.ltEnd(); return 'x'; }
      const s = document.getElementById('scene');
      if (s && !s.hidden) { const b = document.getElementById('scSkip'); if (b) b.click(); return 'x'; }
      const d = document.getElementById('dlg');
      if ((d && !d.hidden) || __g.mode === 'dlg') {
        const en = [...document.querySelectorAll('#dBtns button')].filter(b => !b.disabled);
        if (!en.length) return 'locked';
        en[0].click(); return 'x';
      }
      if (__g.mode === 'sheet') { __g.closeSheet(); return 'x'; }
      return __g.mode;
    });
    if (st === 'play') return 'play';
    await new Promise(r => setTimeout(r, st === 'locked' ? 260 : 50));
  }
  return 'stuck';
}

(async () => {
const b = await chromium.launch({executablePath: process.env.PW_CHROMIUM || undefined});
const page = await b.newPage({viewport: {width: 900, height: 700}});
const errs = []; page.on('pageerror', e => errs.push(String(e.message).slice(0, 200)));
await page.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">' + html + '</body></html>');
await page.waitForTimeout(600);
await page.evaluate(() => __g.skipDisc());
await page.waitForTimeout(200);
await page.click('[data-cls=scrapper]');
await dismiss(page);

const rows = [];
for (const cls of CLASSES) {
  for (const zi of ZONES) {
    for (const di of DIFFS) {
      await page.evaluate(({cls, build, zi, di}) => {
        const g = __g, G = g.G;
        G.god = false; G.lvl = Math.max(2, g.ZONES[zi].lvl | 0);
        G.act2 = G.act3 = true; G.unlocked = 34; G.diff = di; G.tier = 0;
        G.sp = (G.lvl - 1) * 1; G.ap = (G.lvl - 1) * 5;
        G.sk = G.sk.map(() => 0); G.web = {}; G.at = {mgt:0, ref:0, vit:0, bnd:0};
        G.dz = {}; G.adapt = 0;
        for (let i = 1; i <= 25; i++) G.q['q' + i] = 3;
        g.setMode('play');
        if (g.W && g.W.zi !== 0) g.enter(0);
        g.shapeShift(cls, build);
      }, {cls, build: BUILD[cls], zi, di});
      if (await dismiss(page) !== 'play') { rows.push({cls, zi, di, bad: 'setup'}); continue; }

      await page.evaluate(zi => __g.enter(zi), zi);
      if (await dismiss(page) !== 'play') { rows.push({cls, zi, di, bad: 'enter'}); continue; }

      const r = await page.evaluate(({cls, build, zi, prof, waves, secs}) => {
        const g = __g, G = g.G, P = g.P;
        const L = g.ZONES[zi].lvl;
        /* identical starting kit to balance.js, so the two reports compare */
        for (const slot of ['weapon','armor','helm','gloves','boots','belt']) {
          const it = g.makeItem(L, 2, slot); it.id = true; G.eq[slot] = it;
        }
        G.eq.ring = null; G.eq.amulet = null;
        g.calc(); G.hp = g.S.maxHp; G.en = g.S.maxEn; G.stims = 6;

        /* ---- the pilot ------------------------------------------------- */
        const V = (g.SKV && g.SKV[cls]) || {}, SK = g.CLS[cls].sk;
        const kit = [];
        for (let i = 0; i < SK.length; i++) {
          const s = SK[i]; if (!s || !s.a) continue;          /* passives are never cast */
          const v = V[i] || {}, r = v.r || v.reach || 0;
          let role = 'buff';
          if (v.k === 'ring' || v.k === 'patch') role = r >= 2 ? 'aoe' : 'melee';
          else if (v.k === 'trail') role = r >= 4.5 ? 'ranged' : 'melee';
          else if (v.k === 'arc') role = 'melee';
          kit.push({i, role, r: r || 2.2, cost: s.cost || 0, cd: s.cd || 0});
        }
        const BU = (g.BUILDS[cls] || []).find(x => x.k === build) || {};
        const arms = BU.web || [];
        const used = {}; let levels = 0, webN = 0, equips = 0, lastBuff = -9, refused = 0, picked = 0;

        /* A skill can be refused for reasons this pilot does not model. The first
           version assumed a cast it asked for was a cast that happened, and
           reported War Horn firing 1869 times in 70 seconds on a 10 second
           cooldown. The second retired a skill after three refusals, which read
           the witness exactly wrong: its kit is gated on a page resource that
           its basic attack refills, so every big skill is refused early and
           available later, and retiring them left it casting once per fight.

           So a refusal is a wait, not a verdict, and it backs off rather than
           giving up. That covers every class's own resource -- the page, the
           compost, the stance -- without this pilot knowing any of them. */
        const ready = k => G.sk[k.i] && (P.cd[k.i] || 0) <= .05 && G.en >= k.cost
                        && !(P.castWait > 0) && !(P.silence > 0) && (k.until || 0) <= g.W.t;
        const of = role => kit.filter(k => k.role === role && ready(k));

        function levelUp() {
          if (G.sp > 0 || G.ap > 0) {
            const r = g.buildApply(cls, build, G.sp, G.ap);
            G.sp = r.sp; G.ap = r.ap; levels++;
          }
          /* buildApply seeds the web once and never returns to it, so a hero
             that levels mid-run would stop gaining nodes. Walk the plan's own
             two arms outward; rank r is adjacent to r-1, so filling in order
             is always a legal placement. */
          let guard = 60;
          while (g.webPts() > 0 && guard-- > 0) {
            let took = 0;
            for (const a of arms) { const id = g.webNext(a); if (id) { G.web[id] = 1; webN++; took = 1; break; } }
            if (!took) break;
          }
          g.calc();
        }
        /* Between waves: take what dropped, read it, wear it if it is better.
           Identifying on the spot stands in for the trip to a vendor that a
           person makes between fights -- equipBest() scores an unidentified
           item at nothing, so without this the hero would walk past upgrades. */
        function loot() {
          const W = g.W;
          for (let i = (W.drops || []).length - 1; i >= 0; i--) {
            const d = W.drops[i];
            if (Math.hypot(d.x - P.x, d.y - P.y) > 6) continue;
            const it = d.it || d.item;
            if (it && g.bagCan && g.bagCan(it)) { it.id = true; G.bag.push(it); W.drops.splice(i, 1); picked++; }
          }
          const n = g.equipBest ? (g.equipBest() | 0) : 0;
          if (n) { equips += n; g.calc(); }
        }
        /* a telegraphed ground effect you are standing in is worth more than any skill */
        function warnHere() {
          for (const f of (g.W.fx || [])) {
            if (f.k !== 'warn' || !f.boom) continue;
            if (Math.hypot(f.x - P.x, f.y - P.y) < (f.r || 1) + .6) return f;
          }
          return null;
        }
        function step(tx, ty) {
          const d = Math.hypot(tx - P.x, ty - P.y); if (d < .3) return;
          P.dir = {x: (tx - P.x) / d, y: (ty - P.y) / d};
          const sp = (g.S.spd || 3) * (1 / 30);
          const nx = P.x + P.dir.x * sp, ny = P.y + P.dir.y * sp;
          const N = g.W.N, t = g.W.map[(ny | 0) * N + (nx | 0)];
          if (t === 0) { P.x = nx; P.y = ny; }
        }
        function fight() {
          const W = g.W, S = g.S;
          const foes = W.ents.filter(e => e.hp > 0);
          if (!foes.length) return;
          let near = foes[0], nd = 1e9;
          for (const e of foes) { const d = Math.hypot(e.x - P.x, e.y - P.y); if (d < nd) { nd = d; near = e; } }
          /* the cluster: how many are packed around the nearest one */
          let cx = 0, cy = 0, n = 0;
          for (const e of foes) if (Math.hypot(e.x - near.x, e.y - near.y) < 3.2) { cx += e.x; cy += e.y; n++; }
          cx /= n; cy /= n;
          const hp = G.hp / S.maxHp;

          if (hp < prof.stim && G.stims > 0 && G.hp < S.maxHp * .92) g.stim();
          const w = warnHere();
          if (w) { step(P.x - (w.x - P.x), P.y - (w.y - P.y)); return; }
          if (prof.kite && nd < (prof.near || 3)) { step(P.x - (near.x - P.x), P.y - (near.y - P.y)); return; }
          if (!prof.kite && hp < (prof.back || .36) && nd < 2) { step(P.x - (near.x - P.x), P.y - (near.y - P.y)); return; }

          /* choose by situation, biggest-first for a crowd and cheapest otherwise */
          const aim = (k, x, y) => {
            const en0 = G.en, cd0 = P.cd[k.i] || 0;
            P.spot = {x, y}; g.castIndex(k.i); P.spot = null;
            if (G.en < en0 || (P.cd[k.i] || 0) > cd0) { used[k.i] = (used[k.i] || 0) + 1; k.no = 0; return true; }
            k.no = (k.no || 0) + 1; refused++;
            k.until = g.W.t + Math.min(8, 1.2 * k.no);   /* come back to it, further out each time */
            return false;
          };
          const big = a => a.slice().sort((p, q) => q.cd - p.cd)[0];
          const cheap = a => a.slice().sort((p, q) => p.cost - q.cost)[0];
          /* try in order, and fall through when the game declines rather than
             spending the tick on a skill that will not fire */
          if (n >= 3) for (const k of of('aoe').sort((p, q) => q.cd - p.cd)) if (aim(k, cx, cy)) return;
          if (nd > 2.6) for (const k of of('ranged').filter(k => k.r >= nd - .8).sort((p, q) => p.cost - q.cost))
            if (aim(k, near.x, near.y)) return;
          if (g.W.t - lastBuff > 8) for (const k of of('buff').sort((p, q) => q.cd - p.cd))
            if (aim(k, P.x, P.y)) { lastBuff = g.W.t; return; }
          if (nd <= 3.2) for (const k of of('melee').sort((p, q) => p.cost - q.cost))
            if (aim(k, near.x, near.y)) return;
          if (nd > 1.4) step(near.x, near.y);
          else { P.dir = {x: (near.x - P.x) / nd, y: (near.y - P.y) / nd}; g.attack && g.attack(); }
        }

        /* ---- the run ---------------------------------------------------- */
        const z = g.ZONES[zi];
        const bossZone = !!z.boss;
        const kinds = [...new Set((z.mix || []).map(m => m[0]))].filter(k => k !== 'tick');
        const packKind = bossZone ? (z.bossK || 'boss3') : (kinds[0] || 'bot');
        /* spawn() returns null on a tile that is not walkable, so a pack placed
           on a ring of radius 4.5 quietly lands in a wall and the wave is empty.
           balance.js spawns alongside the player, where the floor is known good;
           do the same and spread outward only as far as the floor allows. */
        function spawnWave() {
          g.W.ents.length = 0;
          const nn = bossZone ? 1 : 5;
          for (let i = 0; i < nn; i++) {
            let e = null;
            for (const rad of [2.2, 1.4, 0.7]) {
              const a = i / nn * 6.283;
              e = g.spawn(packKind, P.x + Math.cos(a) * rad, P.y + Math.sin(a) * rad);
              if (e) break;
            }
            if (!e) e = g.spawn(packKind, P.x + 0.7, P.y + (i - 2) * 0.2);
            if (e) { e.aggro = true; e.__wave = 1; }
          }
          return g.W.ents.filter(e => e.hp > 0 && e.__wave).length;
        }
        /* A district keeps its own population, and one wandering shill standing
           off at 7 paces with aggro 0 is enough to make "are they all dead" never
           become true -- which is how a 70s stalemate got reported as a fight.
           The wave is the pack we placed; everything else is weather. */
        const waveLeft = () => g.W.ents.filter(e => e.hp > 0 && e.__wave).length;
        g.W.t = g.W.t || 0;
        g.W.bi = 1;                                   /* no boss entrance cinematic */
        levelUp();                                   /* spend what the level grants before the first fight */
        let t = 0, died = 0, cleared = 0, lost = 0, stimsUsed = 0;
        let hpWas = G.hp, stimWas = G.stims;
        /* An empty wave would read as an instant clear, which is exactly how the
           first version of this harness reported four flawless waves in 0.1s
           having cast nothing. Never let that count as a result. */
        if (!spawnWave()) return {bad: 'nothing spawned (' + packKind + ')'};
        while (t < secs && !died && cleared < waves) {
          fight();
          g.update(1 / 30); t += 1 / 30; g.W.t = t;
          if (G.hp < hpWas) lost += hpWas - G.hp;
          hpWas = G.hp;
          if (G.stims < stimWas) { stimsUsed += stimWas - G.stims; stimWas = G.stims; }
          if (G.hp <= 0) { died = 1; break; }
          if (!waveLeft()) {
            cleared++; loot(); levelUp();
            if (cleared < waves) { G.en = g.S.maxEn; if (!spawnWave()) break; hpWas = G.hp; }
          }
        }
        return {t: +t.toFixed(1), died, cleared, left: waveLeft(), refused,
                dmg: Math.round(lost + stimsUsed * g.S.maxHp * .45), stims: stimsUsed,
                skills: Object.keys(used).length, casts: Object.values(used).reduce((a, x) => a + x, 0),
                levels, webN, equips, picked, lvl: G.lvl, kind: packKind, boss: bossZone ? 1 : 0};
      }, {cls, build: BUILD[cls], zi, prof: PROF[cls], waves: WAVES, secs: SECS});
      rows.push(Object.assign({cls, zi, di}, r));
      process.stdout.write('.');
    }
  }
}
process.stdout.write('\n');
await b.close();

/* ---- report ------------------------------------------------------------- */
const zname = {};
const lines = [];
lines.push('# Acts III-V, played rather than walked into');
lines.push('');
lines.push('`node tools/balance-play.js`. Same starting hero as `tools/balance.js` -- level matched');
lines.push('to the district, one identified rare in each of six slots, six stims, adaptive scaling');
lines.push('reset -- and a pilot that spends points and web nodes on level-up, picks skills by');
lines.push('situation, loots and re-gears between waves, stims, dodges telegraphs and kites if its');
lines.push('class does. ' + WAVES + ' waves of 5 (bosses: 1), ' + SECS + 's cap, one sample each.');
lines.push('');
lines.push('**Read the last four columns first.** Skills is how many distinct skills the hero cast.');
lines.push('If it is 1, the pilot fell back to one button and the rest of the row means nothing.');
lines.push('Levels, web and worn are how much progression actually happened.');
lines.push('');
lines.push('| District | Class | Difficulty | Waves | Seconds | Damage taken | Died | Left | Skills | Casts | Levels | Web | Took/Wore |');
lines.push('|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|');
for (const r of rows) {
  if (r.bad) { lines.push('| zone ' + r.zi + ' | ' + r.cls + ' | ' + DIFFN[r.di] + ' | — | — | — | — | — | — | — | — | — | ' + r.bad + ' |'); continue; }
  lines.push('| zone ' + r.zi + ' | ' + r.cls + ' | ' + DIFFN[r.di] + ' | ' + r.cleared + '/' + WAVES + ' | ' + r.t + ' | ' + r.dmg +
             ' | ' + r.died + ' | ' + r.left + ' | ' + r.skills + ' | ' + r.casts + ' | ' + r.levels + ' | ' + r.webN + ' | ' + r.picked + '/' + r.equips + ' |');
}
const good = rows.filter(r => !r.bad);
const agg = d => {
  const g2 = good.filter(r => r.di === d); if (!g2.length) return null;
  const died = g2.reduce((a, r) => a + r.died, 0);
  const full = g2.filter(r => r.cleared >= WAVES).length;
  const sk = g2.reduce((a, r) => a + r.skills, 0) / g2.length;
  return {n: g2.length, died, full, sk};
};
lines.push('');
lines.push('## Totals');
lines.push('');
lines.push('| Difficulty | Samples | Died | Cleared every wave | Mean distinct skills cast |');
lines.push('|---|---:|---:|---:|---:|');
for (let d = 0; d < 3; d++) { const a = agg(d); if (a) lines.push('| ' + DIFFN[d] + ' | ' + a.n + ' | ' + a.died + ' (' + Math.round(100 * a.died / a.n) + '%) | ' + a.full + ' | ' + a.sk.toFixed(1) + ' |'); }
lines.push('');
lines.push('| Class | Died (all difficulties) | Mean distinct skills |');
lines.push('|---|---:|---:|');
for (const c of CLASSES) {
  const g2 = good.filter(r => r.cls === c); if (!g2.length) continue;
  lines.push('| ' + c + ' | ' + g2.reduce((a, r) => a + r.died, 0) + '/' + g2.length + ' | ' + (g2.reduce((a, r) => a + r.skills, 0) / g2.length).toFixed(1) + ' |');
}
if (errs.length) { lines.push(''); lines.push('Page errors: ' + errs.slice(0, 4).join(' | ')); }
fs.writeFileSync(OUT, lines.join('\n') + '\n');
console.log('wrote ' + OUT + '  (' + good.length + ' samples, ' + rows.filter(r => r.bad).length + ' failed setup)');
for (let d = 0; d < 3; d++) { const a = agg(d); if (a) console.log(DIFFN[d].padEnd(7) + ' n=' + a.n + '  died ' + a.died + '  cleared all waves ' + a.full + '  mean distinct skills ' + a.sk.toFixed(1)); }
if (errs.length) console.log('page errors:', errs.slice(0, 3));
})();
