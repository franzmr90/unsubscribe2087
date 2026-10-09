/* Natural Normal play from a fresh level-1 character.
   No god mode, no handed-out gear, no level setting.
   node tools/progression-play.js
   Writes /tmp/progression-play.json and shots under PROG_SHOTS.
*/
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const SHOT = process.env.PROG_SHOTS || '/opt/cursor/artifacts/progression';
const OUT = process.env.PROG_OUT || '/tmp/progression-play.json';
fs.mkdirSync(SHOT, { recursive: true });
const CHROME = process.env.PW_CHROMIUM || '/usr/local/bin/google-chrome';
const html = fs.readFileSync(path.join(root, 'dist/unsubscribe.html'), 'utf8');
const PER_CLASS_MS = +(process.env.PROG_MS || 12 * 60 * 1000);
const TOTAL_MS = +(process.env.PROG_TOTAL_MS || 46 * 60 * 1000);
const wait = ms => new Promise(r => setTimeout(r, ms));

const PROFILES = {
  scrapper: { build: 'crew', kite: false, back: 0.36, stim: 0.42, reach: 2.35 },
  hacker: { build: 'chain', kite: true, near: 3.0, far: 6.4, stim: 0.48, reach: 6.6 },
  courier: { build: 'rush', kite: true, near: 2.7, far: 6.2, stim: 0.45, reach: 6.4 },
  anon: { build: 'demo', kite: false, back: 0.4, stim: 0.45, reach: 3.4 },
  founder: { build: 'head', kite: true, near: 3.2, far: 6.5, stim: 0.5, reach: 6.8 },
  homesteader: { build: 'bed', kite: false, back: 0.38, stim: 0.46, reach: 4.2 },
  witness: { build: 'page', kite: false, back: 0.34, stim: 0.48, reach: 2.5, heal: 6, healAt: 0.72 },
  maxi: { build: 'orange', kite: false, back: 0.36, stim: 0.42, reach: 2.5 }
};
const CLASS_LIST = (process.env.PROG_CLASSES || 'scrapper,hacker,courier,anon,founder,homesteader,witness,maxi').split(',').filter(Boolean);
const SEEDS = (process.env.PROG_SEEDS || '12648430').split(',').map(s => parseInt(s, 10));

function boot(page, errs) {
  page.on('pageerror', e => errs.push(String(e.message || e).slice(0, 300)));
  return page.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0">' + html + '</body></html>');
}

async function pumpUI(page, n) {
  const clicked = [];
  for (let i = 0; i < (n || 36); i++) {
    const st = await page.evaluate(() => {
      const mode = __g.mode;
      if (mode === 'intro') { __g.ltEnd(); return { k: 'intro' }; }
      const scene = document.getElementById('scene');
      if (scene && !scene.hidden) {
        const b = document.getElementById('scSkip');
        if (b) b.click();
        return { k: 'scene' };
      }
      if (mode === 'dying') {
        const b = document.getElementById('bRise');
        if (b) b.click();
        return { k: 'dying' };
      }
      const d = document.getElementById('dlg');
      if ((d && !d.hidden) || mode === 'dlg') {
        const title = (document.getElementById('dT') || {}).textContent || '';
        const enabled = [...document.querySelectorAll('#dBtns button')].filter(b => !b.disabled);
        if (!enabled.length) return { k: 'locked', title };
        const text = b => b.textContent.trim();
        const ban = t => /skip to 2087/i.test(t) || /^tell it$/i.test(t) || /tell her she is wrong/i.test(t)
          || (/^i am$/i.test(t) && /curator/i.test(title)) || /start a new|replace/i.test(t) || /talk about money/i.test(t)
          || /^sell everything/i.test(t);
        const prefer = [/^i am not proud of you$/i, /^refuse$/i, /^keep it closed$/i, /^give it the nineteen minutes$/i,
          /^begin$/i, /^not now$/i, /^i will/i, /^take it$/i, /^go on$/i, /^continue$/i, /^thank/i, /^identify /i,
          /^i am$/i, /^surge$/i, /^walk on$/i, /^keep it$/i, /^farewell$/i, /^leave$/i, /^understood$/i, /^good$/i, /^moo$/i];
        let pick = null;
        for (const re of prefer) {
          pick = enabled.find(b => re.test(text(b)) && !ban(text(b)));
          if (pick) break;
        }
        if (!pick) pick = enabled.find(b => !ban(text(b)));
        if (!pick) return { k: 'no-safe', title, buttons: enabled.map(text) };
        const label = text(pick);
        pick.click();
        return { k: 'dlg', label, title };
      }
      if (mode === 'sheet') return { k: 'sheet' };
      return { k: 'play' };
    });
    if (st.k === 'dlg') clicked.push(st.label);
    if (st.k === 'play' || st.k === 'sheet') return { st, clicked };
    if (st.k === 'no-safe') return { st, clicked };
    await wait(st.k === 'locked' ? 280 : 60);
  }
  return { st: { k: 'timeout' }, clicked };
}

async function say(page, id, want) {
  await page.evaluate(id => {
    if (__g.mode === 'sheet') __g.closeSheet();
    if (__g.mode !== 'play') __g.setMode('play');
    __g.talkTo(id);
  }, id);
  if (want) {
    for (let i = 0; i < 20; i++) {
      const hit = await page.evaluate(source => {
        const enabled = [...document.querySelectorAll('#dBtns button')].filter(b => !b.disabled);
        if (!enabled.length) return 'locked';
        const re = new RegExp(source, 'i');
        const b = enabled.find(x => re.test(x.textContent.trim()));
        if (!b) return 'missing:' + enabled.map(x => x.textContent.trim()).join('|');
        b.click();
        return 'ok:' + b.textContent.trim();
      }, want);
      if (hit === 'locked') { await wait(280); continue; }
      return hit;
    }
  }
  return pumpUI(page, 28);
}

async function clearDlg(page) {
  for (let i = 0; i < 8; i++) {
    const mode = await page.evaluate(() => __g.mode);
    if (mode !== 'dlg' && mode !== 'scene' && mode !== 'intro') return mode;
    await pumpUI(page, 10);
  }
  return page.evaluate(() => __g.mode);
}

async function shot(page, name) {
  const file = path.join(SHOT, name + '.png');
  await page.evaluate(() => { try { __g.render(); __g.hud(); } catch (e) {} });
  await page.screenshot({ path: file });
  return file;
}

async function install(page, cls, seed) {
  await page.evaluate(({ cls, seed, prof, party, climb }) => {
    function mulberry32(a) {
      return function () {
        a |= 0; a = a + 0x6D2B79F5 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      };
    }
    window.requestAnimationFrame = function () { return 0; };
    Math.random = mulberry32(seed >>> 0);
    __g.OPT.noWalk = 1;
    __g.OPT.auto = false;
    __g.OPT.autoEq = true;
    __g.OPT.dyn = true;
    __g.OPT.autoStim = false;
    const QN = ['Normal', 'Magic', 'Rare', 'Set', 'Unique'];
    const bossK = k => k === 'boss' || k === 'boss2' || k === 'boss3' || k === 'boss4' || k === 'boss5';
    const prog = window.__prog = {
      cls, seed, prof, order: null, orderZi: null, townDone: false, wantFarm: false, farmed: false,
      giveUp: false, giveReason: '', farmUntil: 0, farmKills: 0, shotN: 0, shots: {},
      climbOn: climb !== false, climbN: 0, corpseSeen: {}, deathSeen: 0, aimTried: false,
      attempt: null, atkT: 0, moveT: 0, dodgeT: 0, lastZi: null, stuckT: 0, stuckX: 0, stuckY: 0,
      log: {
        cls, seed, name: __g.CLS[cls].n, build: prof.build, god: false,
        season: ['stim', 'bull', 'over'][Math.floor(Date.now() / 6048e5) % 3],
        zones: [], acts: {}, fell: {}, ladder: [], corpseWalks: 0,
        spend: { creditsOut: 0, creditsIn: 0, satsOut: 0, satsIn: 0, stimsBought: 0, hires: 0, charmsWorn: 0, bought: [] },
        vendors: [], bag: [], notes: []
      }
    };
    __g.newGame(cls);
    if (party && window.__mp) {
      const MP = window.__mp.MP;
      MP.on = true;
      MP.conn = { readyState: 1, send() {} };
      MP.game = { n: 2, diff: 'normal' };
      MP.scale = { players: 2, diff: 'normal', diffName: 'Normal', hp: 1.25 * 1.5, dmg: 1.3, xp: 1.5 };
      prog.log.party = { hp: MP.scale.hp, xp: MP.scale.xp, dmg: MP.scale.dmg };
      prog.log.notes.push('two-player Normal scale: damage dealt is divided by ' + MP.scale.hp + ', experience ×' + MP.scale.xp);
      prog.log.notes.push('a joined game waits on the server for the district map, and a hit waits on the server to come off the bar');
    }
    function hypot(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
    function gearSnap() {
      const G = __g.G, S = __g.S, eq = {};
      for (const sl of ['weapon', 'helm', 'armor', 'gloves', 'boots', 'belt', 'ring', 'amulet']) {
        const it = G.eq[sl];
        eq[sl] = it ? { name: it.name, base: it.base, q: it.q, qn: QN[it.q] || String(it.q), il: it.il, req: it.req, dmin: it.dmin || 0, dmax: it.dmax || 0, arm: it.arm || 0, id: !!it.id } : null;
      }
      const res = {};
      for (const k of __g.RTK) res[k] = __g.resOf(k);
      const dps = ((S.dmin + S.dmax) / 2 * (1 + S.dmg / 100) + (S.shock || 0)) * (1 + Math.max(-50, S.aspd) / 100) * (1 + Math.min(100, S.crit) / 100 * ((S.critM || 2) - 1));
      return {
        lvl: G.lvl, xp: Math.round(G.xp), credits: Math.round(G.credits), sats: G.sats | 0, stims: G.stims | 0,
        cpi: +G.cpi.toFixed(3), merc: G.merc ? { k: G.merc.k, dead: !!G.merc.dead } : null,
        dmin: S.dmin, dmax: S.dmax, dmg: S.dmg, armor: S.armor, maxHp: S.maxHp, maxEn: S.maxEn,
        crit: S.crit, dodge: S.dodge || 0, res, dps: Math.round(dps),
        ehp: Math.round(S.maxHp * (1 + S.armor / 100) / (1 - Math.min(0.6, (S.dodge || 0) / 100))),
        eq, deaths: G.deaths || 0, god: !!G.god, sk: G.sk.slice(), at: Object.assign({}, G.at), slots: G.slots.slice()
      };
    }
    function actBook(zi) {
      const z = __g.ZONES[zi];
      const id = String(zi);
      if (!prog.log.acts[id]) prog.log.acts[id] = {
        zi, name: z.n, lvl: z.lvl, act: __g.actOf(zi), boss: !!z.boss, attempts: [], arrival: null, scale: null, won: false
      };
      return prog.log.acts[id];
    }
    function nearest(maxD, pred) {
      const P = __g.P, W = __g.W;
      let b = null, bd = maxD;
      for (const e of W.ents) {
        if (!(e.hp > 0) || e.mp) continue;
        if (pred && !pred(e)) continue;
        const d = hypot(e, P);
        if (d < bd) { bd = d; b = e; }
      }
      return b ? { e: b, d: bd } : null;
    }
    function bossEnt() { return (nearest(80, e => bossK(e.k)) || {}).e || null; }
    function bindMouse() {
      const G = __g.G;
      const lefts = __g.LEFTSK[G.cls] || [];
      const slots = (G.slots || []).filter(i => i >= 0 && G.sk[i]);
      const left = slots.find(i => lefts.includes(i));
      const right = slots.find(i => i !== left && i !== prof.heal);
      if (left != null && __g.leftOk(left)) __g.assignMouse('L', left);
      else __g.assignMouse('L', -1);
      if (right != null) __g.assignMouse('R', right);
    }
    function spendPoints() {
      const G = __g.G;
      if (!(G.sp > 0 || G.ap > 0)) return;
      const r = __g.buildApply(G.cls, prof.build, G.sp, G.ap);
      G.sp = r.sp; G.ap = r.ap; __g.calc(); bindMouse();
    }
    function strike(e) {
      const G = __g.G, P = __g.P, d = hypot(e, P);
      const cast = i => {
        if (!G.sk[i] || (P.cd[i] || 0) > 0.05 || G.en < 8) return false;
        __g.castIndex(i);
        return true;
      };
      if (prof.heal != null && G.hp < __g.S.maxHp * prof.healAt) cast(prof.heal);
      const slots = (G.slots || []).filter(i => i >= 0 && G.sk[i]);
      if (G.cls === 'witness' && d <= prof.reach + e.r + 1.5) {
        const tes = e.tes || 0, rec = G.page || 0;
        if (tes < 3 && G.sk[0]) cast(0);
        if (tes < 2 && rec < 30) {
          prog.watchT = (prog.watchT || 0) + 1 / 20;
          if (prog.watchT < 0.9) {
            prog.atkT = 0.3;
            __g.mouseClick('left', P.x, P.y, { hover: null });
            return;
          }
        } else prog.watchT = 0;
        if (tes >= 2 && rec >= 12) cast(4);
        else if (tes >= 1 && G.hp < __g.S.maxHp * 0.62) cast(1);
      } else if (d <= prof.reach + e.r) {
        for (const i of slots) if (i !== prof.heal && cast(i)) break;
      }
      prog.atkT -= 1 / 20;
      const MO = __g.MO;
      if (prog.atkT <= 0 || !MO || MO.k !== 'atk' || MO.e !== e) {
        prog.atkT = 0.4;
        __g.mouseClick('left', e.x, e.y, { hover: { kind: 'foe', o: e, x: e.x, y: e.y, r: (e.r || 0.4) + 1.05 } });
      }
    }
    function retreat(e) {
      if (prog.moveT > 0) { prog.moveT -= 1 / 20; return; }
      const P = __g.P;
      const dx = P.x - e.x, dy = P.y - e.y, L = Math.hypot(dx, dy) || 0.001;
      const tx = P.x + dx / L * 4.5, ty = P.y + dy / L * 4.5;
      prog.moveT = 0.3;
      __g.mouseClick('left', tx, ty, { hover: null });
      if (prog.dodgeT <= 0) { prog.dodgeT = 1.4; __g.dodge(); }
    }
    function toward(x, y) {
      if (prog.moveT > 0) { prog.moveT -= 1 / 20; return; }
      const P = __g.P;
      const L = Math.hypot(x - P.x, y - P.y);
      if (L < 0.85) return;
      prog.moveT = 0.5;
      const path = __g.pathFind(x, y);
      if (path && path.length) {
        const hop = path[Math.min(10, path.length - 1)];
        __g.mouseClick('left', hop.x, hop.y, { hover: null });
        return;
      }
      const ang = Math.atan2(y - P.y, x - P.x);
      for (let k = 0; k < 10; k++) {
        const th = ang + (k === 0 ? 0 : (k % 2 ? 1 : -1) * Math.ceil(k / 2) * 0.4);
        const tx = P.x + Math.cos(th) * 4, ty = P.y + Math.sin(th) * 4;
        const p = __g.pathFind(tx, ty);
        if (p && p.length) { __g.mouseClick('left', tx, ty, { hover: null }); return; }
      }
    }
    function fight(e, allowKite) {
      const P = __g.P, G = __g.G, S = __g.S, d = hypot(e, P);
      const hp = G.hp / S.maxHp;
      if (hp < prof.stim && G.stims > 0 && G.hp < S.maxHp * 0.92) __g.stim();
      if (prof.heal != null && hp < prof.healAt) {
        if (G.sk[prof.heal] && (P.cd[prof.heal] || 0) <= 0.05 && G.en >= 8) __g.castIndex(prof.heal);
      }
      if (allowKite && prof.kite && d < prof.near) { retreat(e); return; }
      if (allowKite && !prof.kite && hp < prof.back && d < prof.reach + 1.2) { retreat(e); return; }
      if (prof.kite && d > prof.far + 0.4) { toward(e.x, e.y); return; }
      strike(e);
    }
    function useNear(pred, kind) {
      const W = __g.W, P = __g.P;
      let best = null, bd = 1.45;
      const list = kind === 'portal' ? W.portals : W.objs;
      for (const o of list) {
        if (kind !== 'portal' && o.used) continue;
        if (!pred(o)) continue;
        const d = hypot(o, P);
        if (d < bd) { bd = d; best = o; }
      }
      if (!best) return false;
      if (kind === 'portal') __g.usePortal(best);
      else {
        const h = __g.pickAt(best.x, best.y);
        if (h && h.fn) h.fn();
        else __g.useObj(best);
      }
      return true;
    }
    function hereJob() {
      const W = __g.W, G = __g.G, z = W.z;
      const k = z.su ? z.su.q : z.bq;
      if (!k || (G.q[k] || 0) >= 2) {
        if (W.objs.some(o => !o.used && (o.k === 'cage' || o.k === 'page' || o.k === 'minute'))) return true;
        return false;
      }
      if (k === 'q13') {
        const got = (G.qt && G.qt.motion) || 0;
        if (got < 4 && W.ents.some(e => e.hp > 0 && e.k === 'director' && !e.su)) return true;
      }
      if (W.ents.some(e => e.hp > 0 && e.su && e.q === k)) return true;
      if (z.boss && bossEnt()) return true;
      if (W.objs.some(o => !o.used && (o.k === 'cage' || o.k === 'page' || o.k === 'minute'))) return true;
      return true;
    }
    function jobPoint() {
      const W = __g.W, G = __g.G;
      if (W.zi === 14 && (G.q.q13 || 0) < 2 && ((G.qt && G.qt.motion) || 0) < 4) {
        const d = nearest(80, e => e.k === 'director' && !e.su);
        if (d) return d.e;
      }
      return __g.goalPt();
    }
    function noteStuck(dt) {
      const P = __g.P;
      if (Math.hypot(P.x - prog.stuckX, P.y - prog.stuckY) > 0.35) {
        prog.stuckX = P.x; prog.stuckY = P.y; prog.stuckT = 0; return false;
      }
      prog.stuckT += dt;
      if (prog.stuckT > 2.2 && prog.stuckT < 2.5) {
        const a = prog.stuckT * 3;
        toward(P.x + Math.cos(a) * 3, P.y + Math.sin(a) * 3);
        prog.moveT = 0;
      }
      return prog.stuckT > 8;
    }
    function beginAttempt(e) {
      const book = actBook(__g.W.zi);
      if (!book.arrival) {
        book.arrival = gearSnap();
        book.scale = {
          zi: __g.W.zi, zone: __g.W.z.n, zoneLvl: __g.W.z.lvl, ml: __g.W.ml, dyn: __g.W.dyn, playerLvl: __g.G.lvl,
          k: e.k, name: e.name || __g.ET[e.k].n, max: Math.round(e.max), dmg: +e.dmg.toFixed(2),
          baseHp: __g.ET[e.k].hp, baseDmg: __g.ET[e.k].dmg,
          trash: __g.W.ents.filter(t => t.hp > 0 && !bossK(t.k)).slice(0, 4).map(t => ({ k: t.k, max: Math.round(t.max), dmg: +t.dmg.toFixed(1), su: !!t.su, champ: !!t.champ }))
        };
      }
      prog.attempt = { startHp: e.hp, max: e.max, startPct: +(e.hp / e.max).toFixed(4), t0: __g.G.time, stims0: __g.G.stims, deaths0: __g.G.deaths || 0, gear: gearSnap() };
      const key = prog.cls + '-z' + __g.W.zi + '-arrive';
      if (!prog.shots[key] && prog.shotN < 14) { prog.shots[key] = 1; prog.shotN++; prog.pendingShot = key; }
    }
    function endAttempt(win, e) {
      if (!prog.attempt) return;
      const a = prog.attempt; prog.attempt = null;
      const hp = e && e.hp > 0 ? e.hp : 0;
      const max = a.max || (e && e.max) || 1;
      const row = {
        startPct: a.startPct, endPct: +(hp / max).toFixed(4),
        removed: +((a.startHp - hp) / max).toFixed(4),
        sec: +(__g.G.time - a.t0).toFixed(1),
        win: !!win, stims: Math.max(0, a.stims0 - __g.G.stims),
        died: (__g.G.deaths || 0) > a.deaths0, gear: a.gear
      };
      const book = actBook(__g.W.zi);
      book.attempts.push(row);
      book.won = book.won || !!win;
      if (win && __g.W && __g.W.z && __g.W.z.boss) { book.clearLvl = __g.G.lvl; book.clearDiff = __g.G.diff | 0; }
      const lost = book.attempts.filter(x => !x.win).length;
      const left = hp / max;
      if (!win && !prog.farmed && lost >= 3 && left > 0.55) prog.wantFarm = true;
      if (!win && (lost >= 6 || (prog.farmed && lost >= 5 && left > 0.45))) {
        prog.giveUp = true;
        prog.giveReason = 'boss ' + __g.W.z.n + ' still at ' + Math.round(left * 100) + '% after ' + lost + ' attempts';
      }
      const key = prog.cls + '-z' + __g.W.zi + (win ? '-win' : '-fail' + lost);
      if (!prog.shots[key] && prog.shotN < 16 && (win || lost === 1 || prog.giveUp)) {
        prog.shots[key] = 1; prog.shotN++; prog.pendingShot = key;
      }
    }
    function watchBoss() {
      const e = bossEnt();
      if (!__g.W.z.boss) return;
      if (e) {
        if (!prog.attempt && hypot(e, __g.P) < 11) beginAttempt(e);
        else if (prog.attempt) prog.attempt.max = e.max;
      } else if (prog.attempt) {
        const k = __g.W.z.bq;
        endAttempt((k && (__g.G.q[k] || 0) >= 2) || !__g.W.z.boss, null);
      }
    }
    prog.gearSnap = gearSnap;
    prog.step = function (n) {
      prog.pendingShot = null;
      let steps = 0;
      for (let i = 0; i < n; i++) {
        const Gd = __g.G, Wd = __g.W;
        if (Gd && Wd && Wd.z && (Gd.deaths | 0) !== (prog.deathSeen | 0)) {
          const add = (Gd.deaths | 0) - (prog.deathSeen | 0);
          prog.deathSeen = Gd.deaths | 0;
          if (add > 0) {
            const zn = Wd.z.n || 'unknown';
            prog.log.fell[zn] = (prog.log.fell[zn] || 0) + add;
          }
        }
        if (__g.mode !== 'play') break;
        const G = __g.G, W = __g.W, P = __g.P;
        if (!W || !P) break;
        const dt = 1 / 20;
        if (prog.lastZi !== W.zi) {
          const left = prog.lastZi;
          prog.lastZi = W.zi;
          prog.stuckT = 0;
          prog.stuckNote = null;
          if (prog.order === 'next' && left === prog.orderZi) prog.order = null;
          if (prog.order === 'exit' || prog.order === 'back') prog.order = null;
          prog.log.zones.push({ zi: W.zi, n: W.z.n, lvl: G.lvl, diff: G.diff | 0, zlvl: W.z.lvl || 0, ml: W.ml, dyn: W.dyn, t: +G.time.toFixed(1), town: !!W.z.town, boss: !!W.z.boss });
        }
        if (!W.z.town) prog.townDone = false;
        if (!prog.aimTried && P) {
          prog.aimTried = true;
          try {
            const spec = __g.aimSpec(0) || { reach: 6 };
            const thumb = __g.aimThumbWorld(80, 520, 150, 430, spec);
            const tap = __g.aimTapPoint(spec);
            prog.log.aim = { thumb: !!(thumb && typeof thumb.x === 'number'), tap: !!(tap && typeof tap.x === 'number'), t: thumb && +(+thumb.t).toFixed(2) };
          } catch (err) { prog.log.aim = { err: String(err && err.message || err).slice(0, 160) }; }
        }
        const charmN = (G.bag || []).filter(it => it && it.charm).length + (G.cslots || []).length;
        if (charmN > (prog.charmPeak || 0)) {
          prog.log.charmsFound = (prog.log.charmsFound || 0) + (charmN - (prog.charmPeak || 0));
          prog.charmPeak = charmN;
        }
        spendPoints();
        prog.dodgeT -= dt;
        if (W.z.pre) {
          const g = __g.goalPt();
          if (g && hypot(g, P) < 1.35) {
            const n = W.npcs.find(npc => hypot(npc, g) < 1.2);
            if (n) __g.talkTo(n.id);
            break;
          }
          if (g) toward(g.x, g.y);
          __g.update(dt); steps++;
          continue;
        }
        if (W.z.town && !prog.order) break;
        if (prog.order === 'farm') {
          const foe = nearest(7.5);
          if (foe) fight(foe.e, true);
          else toward(P.x + 6, P.y + 3);
          __g.update(dt); steps++;
          if (G.time >= prog.farmUntil || G.kills >= prog.farmKills) { prog.order = null; prog.farmed = true; break; }
          continue;
        }
        const bodies = (W.objs || []).filter(o => o.k === 'corpse');
        const diedHere = (prog.log.fell[W.z.n] || 0) >= 3;
        if (bodies.length && prog.corpseZi !== W.zi) { prog.corpseZi = W.zi; prog.corpseT0 = G.time; prog.corpseBail = null; }
        const walkTooLong = bodies.length && prog.corpseT0 != null && G.time - prog.corpseT0 > 25;
        if (walkTooLong && prog.corpseBail !== W.zi) {
          prog.corpseBail = W.zi;
          prog.log.notes.push('stopped walking the body in ' + W.z.n + ' and went on');
        }
        if (bodies.length && !diedHere && prog.corpseBail !== W.zi) {
          bodies.sort((a, b) => hypot(a, P) - hypot(b, P));
          const body = bodies[0];
          if (hypot(body, P) < 1.7) {
            const before = (G.corpses || []).length;
            __g.useObj(body);
            if ((G.corpses || []).length < before) {
              prog.log.corpseWalks = (prog.log.corpseWalks || 0) + 1;
              prog.corpseBail = W.zi;
              prog.log.notes.push('walked body ' + body.id + ' in ' + (W.z && W.z.n));
            }
          } else toward(body.x, body.y);
          if (__g.mode !== 'play') break;
          __g.update(dt); steps++;
          continue;
        }
        if (bodies.length) {
          const body = bodies.slice().sort((a, b) => hypot(a, P) - hypot(b, P))[0];
          if (body && hypot(body, P) < 1.7) __g.useObj(body);
        }
        const foeClose = nearest(prog.order === 'next' ? 4.2 : 6.8);
        if (prog.order === 'exit' || prog.order === 'back') {
          if (foeClose && foeClose.d < 2.2) fight(foeClose.e, true);
          else if (prog.order === 'back') {
            if (hypot({ x: 12.5, y: 11.5 }, P) < 1.4) __g.usePortal({ kind: 'back' });
            else toward(12.5, 11.5);
          } else if (!useNear(p => p.kind === 'exit', 'portal')) {
            const p = W.portals.find(p => p.kind === 'exit');
            if (p) toward(p.x, p.y);
          }
          __g.update(dt); steps++;
          continue;
        }
        if (prog.order === 'next') {
          if (W.portals.some(p => p.cast)) W.portals = W.portals.filter(p => !p.cast);
          const p = W.portals.find(p => p.kind === 'next');
          const block = nearest(1.7);
          const hp = G.hp / __g.S.maxHp;
          if (hp < prof.stim && G.stims > 0) __g.stim();
          if (block && hp > 0.28) fight(block.e, true);
          else if (p && hypot(p, P) < 1.4) __g.usePortal(p);
          else if (p) {
            if (block && hp <= 0.28) retreat(block.e);
            toward(p.x, p.y);
          } else prog.order = null;
          __g.update(dt); steps++;
          continue;
        }
        watchBoss();
        if (W.z.boss && bossEnt()) {
          const b = bossEnt();
          const trash = nearest(3.6, e => !bossK(e.k));
          if (trash && trash.d + 0.4 < hypot(b, P)) fight(trash.e, true);
          else fight(b, true);
        } else if (hereJob()) {
          const gp = jobPoint();
          const age = prog.zoneT0 != null ? G.time - prog.zoneT0 : 0;
          const threat = nearest(age > 40 ? 2.2 : 6.2, e => !(W.zi === 14 && e.su && ((G.qt && G.qt.motion) || 0) < 4));
          if (threat) fight(threat.e, true);
          else if (gp) {
            if (hypot(gp, P) < 1.35) {
              if (!useNear(o => o.k === 'cage' || o.k === 'page' || o.k === 'minute' || o.k === 'qobj', 'obj')) toward(gp.x, gp.y);
            } else toward(gp.x, gp.y);
          }
        } else {
          const s = __g.storyStep();
          const back = /return to|speak to/i.test(s.d || '');
          if (back || !W.portals.some(p => p.kind === 'next')) {
            if (nearest(4.2)) fight(nearest(4.2).e, true);
            else if (!(__g.G && nearest(4))) {
              const home = W.portals.find(p => p.kind === 'home');
              if (!home) __g.openPortal();
              const p = W.portals.find(p => p.kind === 'home');
              if (p) __g.usePortal(p);
            }
          } else if (foeClose && foeClose.d < 4.5) fight(foeClose.e, true);
          else useNear(p => p.kind === 'next', 'portal') || toward((W.portals.find(p => p.kind === 'next') || P).x, (W.portals.find(p => p.kind === 'next') || P).y);
        }
        if (__g.mode !== 'play') break;
        __g.update(dt); steps++;
        if (prog.attempt) {
          const e = bossEnt();
          if (!e) endAttempt(true, null);
        }
        if (__g.mode === 'dying' && prog.attempt) endAttempt(false, bossEnt());
        if (!W.z.town && !W.z.pre) {
          if (prog.zoneZi !== W.zi) { prog.zoneZi = W.zi; prog.zoneT0 = G.time; prog.zoneNoted = false; }
          const suLive = W.ents.some(e => e.hp > 0 && e.su && e.q && (G.q[e.q] || 0) < 2);
          if (!prog.zoneNoted && prog.zoneT0 != null && G.time - prog.zoneT0 > (suLive ? 720 : 420) && !prog.attempt && !nearest(suLive ? 8 : 4.2)) {
            prog.zoneNoted = true;
            prog.log.notes.push('left ' + W.z.n + ' after ' + (suLive ? '12' : '7') + ' minutes without a pull');
            __g.openPortal();
            const p = W.portals.find(p => p.kind === 'home');
            if (p) __g.usePortal(p);
          }
        }
        if (noteStuck(dt) && prog.stuckNote !== W.zi) {
          prog.stuckNote = W.zi;
          prog.log.notes.push('stuck in ' + W.z.n + ' at ' + P.x.toFixed(1) + ',' + P.y.toFixed(1));
          toward(P.x + 5, P.y - 4);
          prog.moveT = 0;
          prog.stuckT = 3;
        }
      }
      const G = __g.G, W = __g.W;
      return {
        mode: __g.mode, steps, zi: W && W.zi, zone: W && W.z && W.z.n, town: !!(W && W.z && W.z.town),
        lvl: G && G.lvl, hp: G && __g.S ? Math.round(100 * G.hp / __g.S.maxHp) : 0,
        order: prog.order, giveUp: prog.giveUp, reason: prog.giveReason, shot: prog.pendingShot,
        q: G && G.q && G.q.q5, deaths: G && G.deaths, kills: G && G.kills, time: G && +G.time.toFixed(1),
        wantFarm: prog.wantFarm, won: G && (G.q.q25 || 0) === 3
      };
    };
    prog.planTown = function () {
      const G = __g.G, W = __g.W, s = __g.storyStep(), blob = (s.n || '') + ' ' + (s.d || '');
      const backId = name => {
        const n = (name || '').toLowerCase();
        if (n.includes('brenda')) return 'brenda';
        if (n.includes('null')) return 'null';
        if (n.includes('marrow')) return 'marrow';
        if (n.includes('nonce')) return 'nonce';
        return 'gramps';
      };
      if (prog.giveUp) return { kind: 'giveup', reason: prog.giveReason, blob };
      if ((G.q.q25 || 0) === 3) return { kind: 'done', blob };
      if (/return to|speak to/i.test(blob)) {
        let who = 'gramps';
        if (/brenda/i.test(blob)) who = 'brenda';
        else if (/sister null|null/i.test(blob)) who = 'null';
        else if (/marrow/i.test(blob)) who = 'marrow';
        else if (/nonce/i.test(blob)) who = 'nonce';
        else if (/gramps/i.test(blob)) who = 'gramps';
        return { kind: 'talk', who, blob };
      }
      if (/transit gate to the landing/i.test(blob)) return { kind: 'travel', zi: 17, blob };
      if (/antechamber/i.test(blob)) return { kind: 'travel', zi: 18, blob };
      if (/cutler/i.test(blob)) return { kind: 'travel', zi: 21, blob };
      if (/transit gate to the garage/i.test(blob) || /go down/i.test(blob)) return { kind: 'travel', zi: 27, blob };
      let target = null, key = null;
      for (const k in __g.QUESTS) {
        const st = G.q[k] || 0;
        if (st === 3) continue;
        if (st === 2) return { kind: 'talk', who: backId(__g.QUESTS[k].back), blob };
        target = __g.QUESTS[k].zi; key = k; break;
      }
      if (target == null) return { kind: 'done', blob };
      const act = __g.actOf(target);
      const FIRST = { 1: 1, 2: 7, 3: 12, 4: 22, 5: 28 };
      const TOWN = { 1: 0, 2: 17, 3: 18, 4: 21, 5: 27 };
      if (__g.actBriefHold(target) || __g.actBriefHold(TOWN[act])) return { kind: 'talk', who: 'gramps', blob };
      if (prog.wantFarm) {
        prog.wantFarm = false;
        const farmZi = target > FIRST[act] ? target - 1 : FIRST[act];
        return { kind: 'farm', zi: farmZi <= G.unlocked ? farmZi : TOWN[act], then: target, blob };
      }
      if (G.portal && G.portal.zi === target) return { kind: 'back', blob };
      if (target <= G.unlocked) return { kind: 'travel', zi: target, blob };
      if (W.zi === TOWN[act] && target === FIRST[act]) return { kind: 'exit', blob };
      const prev = target - 1;
      if (prev >= FIRST[act] && prev <= G.unlocked) return { kind: 'walk-next', zi: prev, blob };
      if (W.zi === TOWN[act]) return { kind: 'exit', blob };
      return { kind: 'travel', zi: TOWN[act], blob };
    };
    prog.shopSnap = function () {
      const row = it => it ? { name: it.name, base: it.base, q: it.q, qn: QN[it.q], il: it.il, slot: it.slot, req: it.req, dmin: it.dmin || 0, dmax: it.dmax || 0, arm: it.arm || 0, val: it.val || 0, delta: __g.itemDelta(it) } : null;
      return {
        lvl: __g.G.lvl, zi: __g.W.zi, credits: (__g.shop || []).map(row),
        sats: (__g.satShop || []).map(o => Object.assign({ price: o.price }, row(o.it)))
      };
    };
    prog.bagSnap = function () {
      const items = __g.G.bag.filter(Boolean);
      const by = {};
      for (const it of items) {
        const k = QN[it.q] || ('q' + it.q);
        if (!by[k]) by[k] = { n: 0, il: [] };
        by[k].n++; if (it.il) by[k].il.push(it.il);
      }
      return { n: items.length, unid: items.filter(i => !i.id).length, by, gear: gearSnap() };
    };
    prog.tryClimb = function () {
      if (!prog.climbOn || prog.climbN >= 2) return false;
      const G = __g.G;
      const names = ['Normal', 'Hard', 'Brutal'];
      prog.log.ladder.push({
        diff: G.diff | 0, name: names[G.diff | 0] || String(G.diff),
        lvl: G.lvl, deaths: G.deaths || 0, repair: G.repairSpent || 0,
        bought: G.corpseBought || 0, walks: prog.log.corpseWalks || 0,
        sats: G.sats | 0, credits: Math.round(G.credits || 0),
        kills: G.kills || 0, time: +((G.time || 0).toFixed(1)),
        corpsesLeft: (G.corpses || []).length,
        charmsFound: prog.log.charmsFound || 0,
        charmsWorn: (G.cslots || []).length,
        fell: Object.assign({}, prog.log.fell)
      });
      prog.climbN++;
      G.diff = prog.climbN;
      G.diffGate = Math.max(G.diffGate || 0, G.diff);
      for (const k in __g.QUESTS) G.q[k] = 0;
      G.q3open = 0; G.q8page = 0; G.q8down = 0; G.q12down = 0; G.qt = {};
      G.unlocked = 0;
      G.portal = null;
      if (__g.resetZones) __g.resetZones();
      prog.order = null; prog.townDone = false; prog.corpseSeen = {};
      prog.giveUp = false; prog.giveReason = '';
      prog.wantFarm = false; prog.farmed = false; prog.attempt = null;
      const note = 'climbed to ' + (names[G.diff] || G.diff) + ' at level ' + G.lvl;
      prog.log.notes.push(note);
      if (__g.mode === 'sheet' && __g.closeSheet) __g.closeSheet();
      __g.setMode('play');
      __g.enter(0);
      __g.setMode('play');
      return names[G.diff] || String(G.diff);
    };
  }, { cls, seed, prof: PROFILES[cls], party: process.env.PROG_PARTY === '1', climb: process.env.PROG_CLIMB !== '0' });
}

async function transit(page, zi) {
  const r = await page.evaluate(zi => {
    if (__g.mode === 'sheet') __g.closeSheet();
    if (__g.mode !== 'play') __g.setMode('play');
    const towns = { 0: 1, 17: 2, 18: 3, 21: 4, 27: 5 };
    let act = towns[zi] || __g.actOf(zi) || 1;
    __g.openSheet('travel', { only: ['travel'], gFresh: 1 });
    const g = document.querySelector('[data-gact="' + act + '"]');
    if (g && !g.disabled) g.click();
    const b = document.querySelector('[data-go="' + zi + '"]');
    if (!b) return { ok: false, why: 'no button', act };
    if (b.disabled) return { ok: false, why: 'locked', text: b.innerText.slice(0, 80) };
    b.click();
    return { ok: true, zi: __g.W && __g.W.zi };
  }, zi);
  await pumpUI(page, 16);
  return r;
}

async function townEconomy(page) {
  const before = await page.evaluate(() => {
    const snap = {
      credits: Math.round(__g.G.credits), sats: __g.G.sats | 0, stims: __g.G.stims | 0,
      merc: __g.G.merc && __g.G.merc.k, marrow: !!__g.G.marrow,
      unid: __g.G.bag.filter(i => i && !i.id).length,
      shop: window.__prog.shopSnap(), bag: window.__prog.bagSnap()
    };
    window.__prog._eco0 = { c: snap.credits, s: snap.sats, st: snap.stims, merc: snap.merc };
    const bodies = (__g.G.corpses || []).slice();
    const seen = window.__prog.corpseSeen || {};
    const buys = [];
    for (const c of bodies) {
      if (!c) continue;
      if (seen[c.id]) {
        const fee = __g.corpseFee(c);
        if ((__g.G.sats | 0) >= fee) {
          const ok = __g.buyCorpse(c.id);
          if (ok) {
            buys.push(c.id);
            window.__prog.log.notes.push('bought body ' + c.id + ' after a failed walk');
          }
        } else window.__prog.log.notes.push('could not buy body ' + c.id + ' for ' + fee + ' sats');
      } else seen[c.id] = 1;
    }
    window.__prog.corpseSeen = seen;
    const deathZi = __g.G.portal && __g.G.portal.zi;
    const deathName = deathZi != null && __g.ZONES[deathZi] && __g.ZONES[deathZi].n;
    const deathsHere = deathName ? (window.__prog.log.fell[deathName] || 0) : 0;
    if (deathsHere >= (window.__prog.fellMark || 0) + 3) {
      window.__prog.wantFarm = true;
      window.__prog.fellMark = deathsHere;
      window.__prog.log.notes.push('farming after ' + deathsHere + ' deaths in ' + deathName);
    }
    snap.buys = buys;
    if (__g.repairAll) { const spent = __g.repairAll(); if (spent) window.__prog.log.notes.push('repaired for ' + spent + ' sats'); }
    const v = window.__prog.log.vendors;
    const last = v[v.length - 1];
    if (!last || last.lvl !== snap.shop.lvl || (v.length < 12)) v.push({ when: 'stock', lvl: snap.shop.lvl, zi: snap.shop.zi, credits: snap.shop.credits, sats: snap.shop.sats });
    if (window.__prog.log.bag.length < 24) window.__prog.log.bag.push(snap.bag);
    return snap;
  });
  if (before.buys && before.buys.length) console.log('bought bodies', before.buys.join(','));
  if (before.unid && before.marrow) await say(page, 'marrow');
  else if (before.unid) {
    const opened = await say(page, 'brenda', '^Trade$');
    if (String(opened).startsWith('ok')) {
      await page.evaluate(() => {
        __g.VEND.tab = 'supplies';
        __g.drawSheet();
        const b = document.querySelector('[data-vid="1"]');
        if (b && !b.disabled) b.click();
      });
    }
  }
  await say(page, 'brenda', '^Trade$');
  await page.evaluate(() => {
    const note = s => window.__prog.log.notes.push(s);
    const click = sel => { const b = document.querySelector(sel); if (b && !b.disabled) { b.click(); return true; } return false; };
    const g = __g;
    if (g.mode === 'sheet') g.closeSheet();
    if (g.mode !== 'play') { note('brenda sheet stayed ' + g.mode); return; }
    g.openSheet('items');
    click('[data-best="1"]');
    click('[data-bestok="1"]');
    g.drawSheet();
    let sock = 0, cguard = 0;
    while (cguard++ < 12) {
      const i = g.G.bag.findIndex(it => it && it.charm && it.id);
      if (i < 0) break;
      if (!g.charmSocket(i)) break;
      sock++;
    }
    if (sock) window.__prog.log.spend.charmsWorn = (window.__prog.log.spend.charmsWorn || 0) + sock;
    click('[data-markjunk="1"]');
    g.closeSheet();
    g.setMode('play');
    g.openVend('brenda');
    for (let i = g.G.bag.length - 1; i >= 0; i--) {
      if (g.G.bag[i] && g.G.bag[i].junk && g.vendSell(i)) window.__prog.log.spend.junkSales = (window.__prog.log.spend.junkSales || 0) + 1;
    }
    g.VEND.tab = 'supplies';
    g.drawSheet();
    if (!g.G.marrow && click('[data-vid="1"]')) window.__prog.log.spend.idBuys = (window.__prog.log.spend.idBuys || 0) + 1;
    let guard = 0, bought = 0;
    while (guard++ < 8 && g.G.stims < Math.min(8, g.S.cap)) {
      if (!click('[data-vstim="1"]')) break;
      bought++;
      g.drawSheet();
    }
    window.__prog.log.spend.stimClicks = (window.__prog.log.spend.stimClicks || 0) + bought;
    const shop = g.shop || [];
    let best = -1, bd = 0.05;
    shop.forEach((it, i) => { const d = g.itemDelta(it); if (d > bd) { bd = d; best = i; } });
    if (best >= 0) {
      g.VEND.tab = g.vendTabOf(shop[best]);
      g.drawSheet();
      if (click('[data-vend="' + best + '"]')) {
        if (click('[data-vbuy="' + best + '"]')) window.__prog.log.spend.vendorBuys = (window.__prog.log.spend.vendorBuys || 0) + 1;
      }
    }
    g.closeSheet();
    g.setMode('play');
    g.openSheet('items');
    click('[data-mbest="1"]');
    g.closeSheet();
  });
  await page.evaluate(() => { if (__g.mode === 'sheet') __g.closeSheet(); if (__g.mode !== 'play') __g.setMode('play'); });
  await clearDlg(page);
  await say(page, 'nonce', 'His goods');
  await clearDlg(page);
  await page.evaluate(() => {
    const click = sel => { const b = document.querySelector(sel); if (b && !b.disabled) { b.click(); return true; } return false; };
    const g = __g;
    if (g.mode !== 'sheet') {
      if (g.mode === 'play') g.openVend('sat');
    }
    if (g.mode !== 'sheet') {
      const n = window.__prog.log.notes;
      if (n.filter(x => String(x).indexOf('sat shop stayed') === 0).length < 3) n.push('sat shop stayed ' + g.mode);
      return;
    }
    g.VEND.tab = 'supplies';
    g.drawSheet();
    let stims = 0;
    while (stims++ < 4 && g.G.sats >= 1 && g.G.stims < Math.min(4, g.S.cap)) {
      if (!click('[data-vstim="1"]')) break;
      g.drawSheet();
    }
    const list = (g.satShop || []).map((o, i) => ({ i, d: g.itemDelta(o.it), price: g.satPrice(o), fam: o.it && o.it.fam }));
    list.sort((a, b) => (b.d || 0) - (a.d || 0));
    const pick = list.find(o => o.d > 0.03 && g.G.sats >= o.price + 2);
    if (pick) {
      g.VEND.tab = g.vendTabOf(g.satShop[pick.i].it);
      g.drawSheet();
      if (click('[data-vend="' + pick.i + '"]')) {
        if (click('[data-vbuy="' + pick.i + '"]')) window.__prog.log.spend.satBuys = (window.__prog.log.spend.satBuys || 0) + 1;
      }
    }
    g.closeSheet();
  });
  await page.evaluate(() => { if (__g.mode === 'sheet') __g.closeSheet(); if (__g.mode !== 'play') __g.setMode('play'); });
  await clearDlg(page);
  await say(page, 'kestrel', 'Hire a companion|Revive|Change your hire');
  await clearDlg(page);
  await page.evaluate(() => {
    const click = sel => { const b = document.querySelector(sel); if (b && !b.disabled) { b.click(); return true; } return false; };
    if (__g.mode !== 'sheet') {
      if (__g.mode === 'play') __g.openSheet('merc', { only: ['merc'] });
    }
    if (__g.mode !== 'sheet') {
      const n = window.__prog.log.notes;
      if (n.filter(x => String(x).indexOf('merc sheet stayed') === 0).length < 3) n.push('merc sheet stayed ' + __g.mode);
      return;
    }
    const hire = document.querySelector('[data-hire="guard"]');
    if (hire && hire.disabled && !__g.G.merc) {
      const n = window.__prog.log.notes;
      if (n.filter(x => String(x).indexOf('hire refused') === 0).length < 4) {
        n.push('hire refused credits ' + Math.round(__g.G.credits) + ' cpi ' + (+__g.G.cpi).toFixed(3) + ' lvl ' + __g.G.lvl + ' ' + hire.innerText.replace(/\s+/g, ' ').slice(0, 90));
      }
    }
    if (click('[data-revive="1"]')) window.__prog.log.spend.revives = (window.__prog.log.spend.revives || 0) + 1;
    click('[data-hire="guard"]');
    click('[data-mab="g"]');
    __g.closeSheet();
  });
  await page.evaluate(() => {
    const a = window.__prog._eco0 || { c: 0, s: 0, st: 0, merc: null };
    const G = __g.G, sp = window.__prog.log.spend;
    const c = Math.round(G.credits), s = G.sats | 0, st = G.stims | 0;
    if (Number.isFinite(c) && Number.isFinite(a.c) && Math.abs(c) < 1e12 && Math.abs(a.c) < 1e12) {
      sp.creditsOut += Math.max(0, a.c - c);
      sp.creditsIn += Math.max(0, c - a.c);
    }
    sp.satsOut += Math.max(0, a.s - s);
    sp.satsIn += Math.max(0, s - a.s);
    sp.stimsBought += Math.max(0, st - a.st);
    if (!a.merc && G.merc) sp.hires++;
    window.__prog.log.bag.push(window.__prog.bagSnap());
  });
}

async function runClass(browser, cls, seed, deadline) {
  const errs = [];
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  page.setDefaultTimeout(180000);
  const t0 = Date.now();
  const until = Math.min(deadline, t0 + PER_CLASS_MS);
  try {
    await boot(page, errs);
    await page.waitForTimeout(200);
    await page.evaluate(() => __g.skipDisc());
    await install(page, cls, seed);
    await pumpUI(page, 20);
    let idleTown = 0, lastSig = '', spins = 0;
    while (Date.now() < until) {
      spins++;
      const mode = await page.evaluate(() => __g.mode);
      if (mode !== 'play') {
        const ui = await pumpUI(page, 24);
        if (ui.st && ui.st.k === 'no-safe') {
          await page.evaluate(buttons => { window.__prog.log.notes.push('dialog with no safe button: ' + buttons.join(' | ')); }, ui.st.buttons || []);
          break;
        }
        continue;
      }
      const where = await page.evaluate(() => {
        const W = __g.W;
        if (!W || !W.z) return 'none';
        if (W.z.pre) return 'pre';
        if (W.z.town && !window.__prog.order) return 'town';
        return 'field';
      });
      if (where === 'town') {
        const plan = await page.evaluate(() => window.__prog.planTown());
        if (plan.kind === 'giveup' || plan.kind === 'done') {
          if (plan.kind === 'done') {
            const climbed = await page.evaluate(() => window.__prog.tryClimb());
            if (climbed) { console.log(cls, 'climbed', climbed); continue; }
          }
          console.log(cls, plan.kind, plan.reason || plan.blob);
          break;
        }
        if (plan.kind === 'talk') {
          console.log(cls, 'talk', plan.who, (plan.blob || '').slice(0, 90));
          await say(page, plan.who);
          idleTown++;
          if (idleTown > 10) {
            await page.evaluate(() => window.__prog.log.notes.push('town talk loop'));
            break;
          }
          continue;
        }
        idleTown = 0;
        const needShop = await page.evaluate(() => {
          if (window.__prog.townDone) return false;
          window.__prog.townDone = true;
          return true;
        });
        if (needShop) {
          console.log(cls, 'town economy');
          await townEconomy(page);
        }
        const plan2 = await page.evaluate(() => window.__prog.planTown());
        console.log(cls, 'nav', plan2.kind, plan2.zi || '', (plan2.blob || '').slice(0, 80));
        if (plan2.kind === 'talk') { await say(page, plan2.who); continue; }
        if (plan2.kind === 'giveup' || plan2.kind === 'done') {
          if (plan2.kind === 'done') {
            const climbed = await page.evaluate(() => window.__prog.tryClimb());
            if (climbed) { console.log(cls, 'climbed', climbed); continue; }
          }
          break;
        }
        if (plan2.kind === 'travel') {
          const tr = await transit(page, plan2.zi);
          if (!tr.ok) await page.evaluate(tr => window.__prog.log.notes.push('transit failed ' + JSON.stringify(tr)), tr);
        } else if (plan2.kind === 'exit') await page.evaluate(() => { window.__prog.order = 'exit'; });
        else if (plan2.kind === 'back') await page.evaluate(() => { window.__prog.order = 'back'; });
        else if (plan2.kind === 'walk-next') {
          const tr = await transit(page, plan2.zi);
          await page.evaluate(zi => { window.__prog.order = 'next'; window.__prog.orderZi = zi; }, plan2.zi);
          if (!tr.ok) await page.evaluate(tr => window.__prog.log.notes.push('walk-next transit ' + JSON.stringify(tr)), tr);
        }
        else if (plan2.kind === 'farm') {
          const tr = await transit(page, plan2.zi);
          await page.evaluate(() => {
            window.__prog.order = 'farm';
            window.__prog.farmUntil = __g.G.time + 50;
            window.__prog.farmKills = __g.G.kills + 12;
            window.__prog.farmed = true;
          });
          if (!tr.ok) await page.evaluate(tr => window.__prog.log.notes.push('farm transit ' + JSON.stringify(tr)), tr);
        }
        continue;
      }
      const st = await page.evaluate(() => window.__prog.step(220));
      const sig = [st.zi, st.lvl, st.order, st.deaths].join(':');
      if (sig !== lastSig) {
        lastSig = sig;
        console.log(cls, st.zone, 'L' + st.lvl, 'hp' + st.hp, 'd' + st.deaths, 't' + st.time, st.order || '', 'steps', st.steps);
      }
      if (process.env.PROG_PARTY === '1' && !st.zi && st.steps === 0 && spins > 2) {
        console.log(cls, 'no district: a joined game waits on the server map');
        await page.evaluate(() => {
          window.__prog.giveUp = true;
          window.__prog.giveReason = 'party stub never entered a district';
          window.__prog.log.notes.push('joined game waited on a server map; no district loaded');
        });
        break;
      }
      if (st.shot) {
        try { await shot(page, st.shot); console.log('shot', st.shot); } catch (e) { console.log('shot fail', e.message); }
      }
      if (st.giveUp || st.won) {
        if (st.won) {
          const climbed = await page.evaluate(() => window.__prog.tryClimb());
          if (climbed) { console.log(cls, 'climbed', climbed); continue; }
        }
        console.log(cls, st.giveUp ? st.reason : 'cleared q25');
        break;
      }
      if (st.steps === 0 && where === 'field') {
        await pumpUI(page, 8);
      }
    }
    if (Date.now() >= until) await page.evaluate(() => window.__prog.log.notes.push('time box'));
    const log = await page.evaluate(() => {
      const L = window.__prog.log;
      L.final = window.__prog.gearSnap();
      L.god = !!__g.G.god;
      L.lvl = __g.G.lvl;
      L.deaths = __g.G.deaths || 0;
      L.kills = __g.G.kills || 0;
      L.time = +__g.G.time.toFixed(1);
      L.q = Object.assign({}, __g.G.q);
      L.repairSpent = __g.G.repairSpent || 0;
      L.corpseBought = __g.G.corpseBought || 0;
      L.corpsesLeft = (__g.G.corpses || []).length;
      L.sats = __g.G.sats | 0;
      L.credits = Math.round(__g.G.credits || 0);
      L.diff = __g.G.diff | 0;
      L.charms = {
        worn: (__g.G.cslots || []).filter(Boolean).map(c => c.name || c.base),
        bag: (__g.G.bag || []).filter(c => c && c.charm).map(c => c.name || c.base)
      };
      L.wallMs = 0;
      return L;
    });
    log.wallMs = Date.now() - t0;
    log.errors = errs.slice(0, 12);
    return log;
  } finally {
    await page.close().catch(() => {});
  }
}

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const all = [];
  const started = Date.now();
  try {
    for (const seed of SEEDS) {
      for (const cls of CLASS_LIST) {
        if (!PROFILES[cls]) continue;
        if (Date.now() - started > TOTAL_MS) {
          all.push({ cls, seed, skipped: true, reason: 'total time box' });
          continue;
        }
        console.log('RUN', cls, 'seed', seed);
        try {
          const log = await runClass(browser, cls, seed, started + TOTAL_MS);
          all.push(log);
        } catch (e) {
          console.log('RUN FAIL', cls, e && e.stack || e);
          all.push({ cls, seed, error: String(e && e.stack || e).slice(0, 800) });
        }
        fs.writeFileSync(OUT, JSON.stringify({ runs: all }, null, 2));
      }
    }
  } finally {
    await browser.close().catch(() => {});
  }
  fs.writeFileSync(OUT, JSON.stringify({ runs: all, wallMs: Date.now() - started }, null, 2));
  console.log('WROTE', OUT, 'runs', all.length);
})();
