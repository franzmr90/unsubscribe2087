/* Four players, one game, Act I together, then a fight between two of them.
   Each player is a real browser running the real page against the account server, with a
   small bot inside it that plays: it fights what is near, follows the leader, walks to the
   quest arrow, opens the cage, and turns quests in. The script around it only says which
   stage the party is on and checks what each of the four sees.

   node tools/party-playtest.js            (PARTY_LOG=/path.json for the full log)
   Needs Playwright and a build in dist/. */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'u2087-party-'));
process.env.DATA_DIR = tmp;
delete process.env.SMTP_HOST;
delete process.env.INVITE_REQUIRED;
delete process.env.WS_REQUIRE_ORIGIN;

const { chromium } = require('playwright');
const { server } = require('../server/server');
const liveMod = require('../server/lib/live');

const OUT = process.env.PARTY_LOG || path.join(os.tmpdir(), 'party-playtest.json');
const ZONE_MS = +(process.env.PARTY_ZONE_MS || 240000);
const wait = ms => new Promise(r => setTimeout(r, ms));
let pass = 0, fail = 0; const out = [], log = { stages: [], findings: [], hpEx: [], deaths: [] };
const ok = (n, c, d) => {
  if (c) { pass++; out.push('  ok   ' + n); } else { fail++; out.push('  FAIL ' + n + (d ? '  <' + d + '>' : '')); }
  console.log((c ? '  ok   ' : '  FAIL ') + n + (!c && d ? '  <' + d + '>' : ''));
};
const note = s => { log.findings.push(s); console.log('  note ' + s); };

async function until(page, fn, arg, ms) {
  const end = Date.now() + (ms || 8000);
  for (;;) {
    const v = await page.evaluate(fn, arg).catch(() => null);
    if (v) return v;
    if (Date.now() > end) return null;
    await wait(150);
  }
}

/* Every message the page receives is counted, so the checks below can say what arrived. */
function netSpy() {
  const Real = window.WebSocket;
  window.__net = { n: {}, out: {}, xp: [], mxp: [], quest: [], kill: [], pvp: [], sys: [] };
  window.WebSocket = function (u, p) {
    const s = p ? new Real(u, p) : new Real(u);
    const send = s.send.bind(s);
    s.send = d => { try { const m = JSON.parse(d); window.__net.out[m.t] = (window.__net.out[m.t] || 0) + 1; } catch (_) {} return send(d); };
    s.addEventListener('message', e => {
      let m; try { m = JSON.parse(e.data); } catch (_) { return; }
      const N = window.__net;
      N.n[m.t] = (N.n[m.t] || 0) + 1;
      if (N[m.t] && Array.isArray(N[m.t])) N[m.t].push(Object.assign({ at: Date.now() }, m));
    });
    return s;
  };
  window.WebSocket.prototype = Real.prototype;
  Object.assign(window.WebSocket, { OPEN: 1, CLOSED: 3, CONNECTING: 0, CLOSING: 2 });
}

/* The bot. Installed in the page; it runs on its own 50ms clock and steps the game itself,
   so four pages in one headless browser keep the same pace. */
function installBot(prof) {
  window.requestAnimationFrame = () => 0;
  const g = window.__g;
  g.OPT.noWalk = 1; g.OPT.auto = false; g.OPT.autoEq = true; g.OPT.autoStim = false;
  const B = window.__bot = { prof, order: { k: 'idle' }, ticks: 0, errs: [], said: [], deaths: 0, rises: 0, stuckT: 0, sx: 0, sy: 0, moveT: 0, atkT: 0 };
  const hyp = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const bossK = k => /^boss[2-5]?$/.test(k);
  function foes(maxD, pred) {
    const P = g.P, W = g.W; let b = null, bd = maxD;
    for (const e of W.ents) {
      if (!(e.hp > 0) || e.mp || e.npc) continue;
      if (pred && !pred(e)) continue;
      const d = hyp(e, P); if (d < bd) { bd = d; b = e; }
    }
    return b;
  }
  function toward(x, y) {
    if (B.moveT > 0) { B.moveT -= .05; return; }
    const P = g.P; if (Math.hypot(x - P.x, y - P.y) < .8) return;
    B.moveT = .45;
    const p = g.pathFind(x, y);
    if (p && p.length) { const h = p[Math.min(10, p.length - 1)]; g.mouseClick('left', h.x, h.y, { hover: null }); return; }
    g.mouseClick('left', x, y, { hover: null });
  }
  function strike(e, plain) {
    const G = g.G, P = g.P, d = hyp(e, P);
    if (d > prof.reach + (e.r || .4)) { toward(e.x, e.y); return; }
    if (!plain) for (const i of (G.slots || [])) {
      if (i < 0 || !G.sk[i] || (P.cd[i] || 0) > .05 || G.en < 8) continue;
      g.castIndex(i); break;
    }
    B.atkT -= .05;
    if (B.atkT <= 0 || !g.MO || g.MO.k !== 'atk' || g.MO.e !== e) {
      B.atkT = .4;
      g.mouseClick('left', e.x, e.y, { hover: { kind: 'foe', o: e, x: e.x, y: e.y, r: (e.r || .4) + 1.05 } });
    }
  }
  function points() {
    const G = g.G;
    if (!(G.sp > 0 || G.ap > 0)) return;
    const r = g.buildApply(G.cls, prof.build, G.sp, G.ap); G.sp = r.sp; G.ap = r.ap; g.calc();
    const lefts = g.LEFTSK[G.cls] || [];
    const slots = (G.slots || []).filter(i => i >= 0 && G.sk[i]);
    const left = slots.find(i => lefts.includes(i));
    if (left != null && g.leftOk(left)) g.assignMouse('L', left);
  }
  const PREFER = [/^later$/i, /^i will/i, /^take it$/i, /^begin$/i, /^go on$/i, /^continue$/i, /^thank/i, /^refuse$/i, /^keep it closed$/i,
    /^understood$/i, /^good$/i, /^walk on$/i, /^leave$/i, /^farewell$/i, /^ok$/i, /^not now$/i];
  const BAN = t => /skip to 2087|start a new|replace|talk about money|sell everything|^tell it$|accept the offer|^stay$|leave the game|save (&|and) exit/i.test(t);
  function pump() {
    const sc = document.getElementById('scene');
    if (sc && !sc.hidden) { const b = document.getElementById('scSkip'); if (b) b.click(); return true; }
    if (g.mode === 'dying') { B.deaths++; const b = document.getElementById('bRise'); if (b) { b.click(); B.rises++; } return true; }
    const d = document.getElementById('dlg');
    if (d && !d.hidden) {
      const title = (document.getElementById('dT') || {}).textContent || '';
      const en = [...document.querySelectorAll('#dBtns button')].filter(b => !b.disabled);
      if (!en.length) return true;
      let pick = null;
      for (const re of PREFER) { pick = en.find(b => re.test(b.textContent.trim()) && !BAN(b.textContent.trim())); if (pick) break; }
      if (!pick) pick = en.find(b => !BAN(b.textContent.trim()));
      if (!pick) pick = en[en.length - 1];
      B.said.push(title.slice(0, 40) + ' -> ' + pick.textContent.trim().slice(0, 40));
      if (B.said.length > 80) B.said.shift();
      pick.click();
      return true;
    }
    if (g.mode === 'sheet' && g.closeSheet) { g.closeSheet(); return true; }
    return g.mode !== 'play';
  }
  function leader() {
    const id = B.order.lead; if (!id || !window.__mp) return null;
    return (window.__mp.MP.others || []).find(o => o.uid === id) || null;
  }
  function think() {
    const G = g.G, W = g.W, P = g.P, S = g.S;
    if (!W || !P || !G) return;
    points();
    if (G.hp < S.maxHp * .45 && G.stims > 0 && !(P.stimT > 0)) g.stim();
    const o = B.order;
    if (o.k === 'idle' || W.z.town) return;
    if (o.k === 'hold') { const f = foes(3); if (f) strike(f); return; }
    if (o.k === 'duel') {
      const t = W.ents.find(e => e.mp === o.uid && e.hp > 0) || W.ents.find(e => e.mp && e.hp > 0);
      if (t) strike(t, !!o.plain); else if (o.x != null) toward(o.x, o.y);
      return;
    }
    const near = foes(o.k === 'lead' ? 6.5 : 7.5);
    const boss = foes(16, e => bossK(e.k) || (e.su && e.q && (G.q[e.q] || 0) < 2));
    if (boss && (!near || hyp(near, P) + .6 > hyp(boss, P) || hyp(near, P) > 2.5)) { strike(boss); return; }
    if (near) { strike(near); return; }
    if (o.k === 'follow') {
      const L = leader();
      if (L && hyp(L, P) > 3) toward(L.x, L.y);
      else if (!L) { const gp = g.goalPt(); if (gp) toward(gp.x, gp.y); }
      return;
    }
    /* lead: the cage, then the arrow, then anything left */
    const cage = G.q3open && (G.q.q3 || 0) < 2 && W.objs.find(x => x.k === 'cage' && !x.used);
    if (cage) {
      if (hyp(cage, P) < 1.8) { const h = g.pickAt(cage.x, cage.y); if (h && h.fn) h.fn(); else g.useObj(cage); }
      else toward(cage.x, cage.y);
      return;
    }
    const gp = g.goalPt();
    if (gp && hyp(gp, P) > 1) { toward(gp.x, gp.y); return; }
    const any = foes(80); if (any) toward(any.x, any.y);
  }
  function stuck() {
    const P = g.P; if (!P) return;
    if (Math.hypot(P.x - B.sx, P.y - B.sy) > .3) { B.sx = P.x; B.sy = P.y; B.stuckT = 0; return; }
    B.stuckT += .05;
    if (B.stuckT > 2.5 && B.order.k !== 'idle' && B.order.k !== 'hold') {
      const a = Math.random() * 6.28; B.moveT = 0; toward(P.x + Math.cos(a) * 3, P.y + Math.sin(a) * 3); B.stuckT = 0;
    }
  }
  B.timer = setInterval(() => {
    try {
      if (B.paused) return;
      if (pump()) { if (g.mode === 'dlg' || g.mode === 'sheet') return; }
      if (g.mode !== 'play') return;
      think(); stuck();
      g.update(1 / 20); B.ticks++;
    } catch (e) { B.errs.push(String(e && e.stack || e).slice(0, 300)); if (B.errs.length > 30) B.errs.shift(); }
  }, 50);
}

const TEAM = [
  { name: 'Ada', cls: 'scrapper', build: 'crew', reach: 1.6 },
  { name: 'Bea', cls: 'witness', build: 'page', reach: 1.6 },
  { name: 'Cid', cls: 'hacker', build: 'chain', reach: 5.5 },
  { name: 'Dot', cls: 'courier', build: 'rush', reach: 5.5 }
];

(async () => {
  await new Promise(r => server.listen(0, r));
  const base = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
  const errs = [];

  async function player(t) {
    const ctx = await browser.newContext({ viewport: { width: 1100, height: 760 } });
    await ctx.addInitScript(netSpy);
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(t.name + ': ' + e.message));
    p.on('console', m => { if (m.type() === 'error' && !/fonts\.g|ERR_|Failed to load resource/i.test(m.text())) errs.push(t.name + ' console: ' + m.text().slice(0, 200)); });
    await p.goto(base + '/');
    await p.waitForTimeout(700);
    const r = await p.evaluate(n => fetch('/api/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: n, pass: 'party-playtest-1' })
    }).then(r => r.status), t.name);
    if (r !== 200) note(t.name + ' register returned ' + r);
    await p.goto(base + '/');
    await p.waitForTimeout(900);
    await p.evaluate(() => __g.skipDisc());
    await p.waitForTimeout(260);
    await p.click('[data-cls=' + t.cls + ']');
    await p.waitForTimeout(900);
    for (let i = 0; i < 16; i++) {
      await p.evaluate(() => {
        const s = document.getElementById('scene'); if (s && !s.hidden) document.getElementById('scSkip').click();
        const d = document.getElementById('dlg'); if (d && !d.hidden) { const bs = [...d.querySelectorAll('#dBtns button:not([disabled])')]; const x = bs.find(b => /skip to 2087/i.test(b.textContent)) || bs[0]; x && x.click(); }
        const a = document.getElementById('acc'); if (a) a.className = 'off';
      });
      await p.waitForTimeout(150);
    }
    const where = await until(p, () => __g.W && __g.W.zi === 0 && __g.mode === 'play' ? 'town' : null, null, 8000);
    if (!where) note(t.name + ' did not reach Stillwater after the class pick: ' + JSON.stringify(await p.evaluate(() => ({ zi: __g.W && __g.W.zi, mode: __g.mode }))));
    t.page = p;
    return p;
  }

  for (const t of TEAM) await player(t);
  const [A, Bp, C, D] = TEAM.map(t => t.page);
  const all = TEAM.map(t => t.page);
  const each = (fn, arg) => Promise.all(all.map(p => p.evaluate(fn, arg)));

  /* ---------- the game, the party ---------- */
  ok('all four reach the lobby', (await Promise.all(all.map(p => until(p, () => __mp.on ? 1 : 0)))).every(Boolean));
  await A.evaluate(() => __mp.send('game.create', { name: 'Act One Run', diff: 'normal' }));
  const gid = await until(A, () => __mp.MP.game ? __mp.MP.game.id : null);
  ok('Ada makes a game', !!gid);
  const listed = await until(Bp, () => (__mp.MP.games || __mp.MP.lobby || []).length || document.body.innerText.includes('Act One Run'));
  if (!listed) note('the new game was not visible to Bea through MP.games/MP.lobby (may be held elsewhere)');
  for (const p of [Bp, C, D]) await p.evaluate(id => __mp.send('game.join', { id }), gid);
  const inGame = await Promise.all(all.map(p => until(p, () => __mp.MP.game && __mp.roster.length >= 4 ? __mp.roster.length : 0)));
  ok('all four are in the game and see a roster of four', inGame.every(n => n === 4), JSON.stringify(inGame));
  const uids = await each(() => __mp.me.uid);
  TEAM.forEach((t, i) => t.uid = uids[i]);
  const scale = await A.evaluate(() => __mp.scale);
  ok('four players make monsters 2.5x tougher', scale && scale.hp === 2.5, JSON.stringify(scale));
  for (const t of TEAM.slice(1)) {
    await A.evaluate(u => __mp.send('invite', { uid: u }), t.uid);
    await until(t.page, () => !!__mp.MP.invite);
    await t.page.evaluate(u => __mp.send('accept', { uid: u }), TEAM[0].uid);
    await wait(200);
  }
  const party = await Promise.all(all.map(p => until(p, () => __mp.MP.party && __mp.MP.party.members.length === 4 ? 4 : 0)));
  ok('the party of four forms on every client', party.every(n => n === 4), JSON.stringify(party));

  /* Characters: fresh level-1 saves, raised to a level that can clear Act I in a few minutes a district. */
  await each(lvl => {
    const G = __g.G; G.god = false; G.lvl = lvl; G.sp = (G.sp || 0) + lvl - 1; G.ap = (G.ap || 0) + 5 * (lvl - 1);
    G.stims = 30; G.credits = (G.credits || 0) + 20000; __g.calc(); G.hp = __g.S.maxHp;
  }, +(process.env.PARTY_LVL || 13));
  for (const t of TEAM) await t.page.evaluate(installBot, { build: t.build, reach: t.reach });

  /* ---------- helpers for a district ---------- */
  async function snap() {
    return each(() => {
      const G = __g.G, W = __g.W, P = __g.P;
      const mobs = (W.ents || []).filter(e => e.mid && !e.mp).map(e => ({ id: e.mid, k: e.k, x: +e.x.toFixed(1), y: +e.y.toFixed(1), hp: Math.round(e.hp), max: Math.round(e.max) }));
      return {
        zi: W.zi, mode: __g.mode, lvl: G.lvl, xp: Math.round(G.xp), hp: Math.round(G.hp), x: +P.x.toFixed(1), y: +P.y.toFixed(1),
        q: Object.assign({}, G.q), q3open: G.q3open, kills: G.kills, deaths: __bot.deaths, ticks: __bot.ticks, errs: __bot.errs.slice(-3),
        host: __mp.mobHost === __mp.me.uid, others: (__mp.MP.others || []).length, mobs, seed: W.seed, rooms: (W.rooms || []).length,
        net: Object.assign({}, __net.n)
      };
    });
  }
  function compareMobs(s, label) {
    const here = s.filter(x => x.zi === s[0].zi);
    const hostI = here.findIndex(x => x.host);
    if (hostI < 0) { note(label + ': nobody in the district is the monster host'); return null; }
    const H = here[hostI];
    const byId = new Map(H.mobs.map(m => [m.id, m]));
    const rows = [];
    for (let i = 0; i < here.length; i++) {
      if (i === hostI) continue;
      const G = here[i];
      let same = 0, kindOff = 0, far = 0, hpOff = 0;
      for (const m of G.mobs) {
        const h = byId.get(m.id); if (!h) continue; same++;
        if (h.k !== m.k) kindOff++;
        if (Math.hypot(h.x - m.x, h.y - m.y) > 2.5) far++;
        if (Math.abs(h.hp - m.hp) > Math.max(5, h.max * .1)) { hpOff++; if (log.hpEx.length < 40) log.hpEx.push({ label, guest: i, id: m.id, k: m.k, host: h.hp + '/' + h.max, seen: m.hp + '/' + m.max }); }
      }
      rows.push({ host: H.mobs.length, guest: G.mobs.length, same, kindOff, far, hpOff });
    }
    return rows;
  }

  const QI = { q1: 1, q2: 2, q3: 3, q4: 4, q5: 5 };
  const GIVER = { q1: 'gramps', q2: 'brenda', q3: 'gramps', q4: 'null', q5: 'gramps' };
  const BACK = { q1: 'gramps', q2: 'brenda', q3: 'gramps', q4: 'null' };

  async function talkAll(id, who) {
    for (const p of who || all) {
      await p.evaluate(id => { __bot.paused = true; if (__g.mode === 'sheet') __g.closeSheet(); if (__g.mode !== 'play') __g.setMode('play'); __g.talkTo(id); __bot.paused = false; }, id);
    }
    await wait(5500);  /* the dialog locks; the bot clicks through on its own clock */
  }

  async function goTown() {
    await each(() => { __bot.order = { k: 'idle' }; });
    await each(() => { __bot.paused = true; __g.setMode('play'); __g.enter(0); __bot.paused = false; });
    await Promise.all(all.map(p => until(p, () => __g.W.zi === 0 && __g.mode === 'play' ? 1 : 0, null, 15000)));
  }

  async function runZone(k) {
    const zi = QI[k];
    const st = { k, zi, t0: Date.now(), samples: [] };
    log.stages.push(st);
    console.log('\n--- ' + k + ' in district ' + zi + ' ---');
    /* Only Ada and Bea take the quest. Cid and Dot have not spoken to the giver. */
    await talkAll(GIVER[k], [A, Bp]);
    const taken = await each(k => __g.G.q[k] || 0, k);
    st.taken = taken;
    if (!(taken[0] >= 1)) note(k + ': Ada did not take the quest from ' + GIVER[k] + ' (state ' + taken[0] + ')');
    const xp0 = await each(() => ({ xp: __g.G.xp, lvl: __g.G.lvl, need: __g.xpNeed ? __g.xpNeed(__g.G.lvl) : 0 }));
    const n0 = await each(() => Object.assign({}, __net.n));
    await A.evaluate(zi => { __bot.paused = true; __g.setMode('play'); __g.enter(zi); __bot.paused = false; }, zi);
    await wait(600);
    await Promise.all([Bp, C, D].map(p => p.evaluate(zi => { __bot.paused = true; __g.setMode('play'); __g.enter(zi); __bot.paused = false; }, zi)));
    const arrived = await Promise.all(all.map(p => until(p, zi => __g.W.zi === zi && __g.mode === 'play' ? 1 : 0, zi, 15000)));
    ok(k + ': all four arrive in district ' + zi, arrived.every(Boolean), JSON.stringify(arrived));
    await wait(2500);
    let s = await snap();
    const seeds = s.map(x => x.seed);
    ok(k + ': one map, one seed for everybody', seeds.every(v => v === seeds[0]) && s.every(x => x.rooms === s[0].rooms), JSON.stringify(seeds) + ' rooms ' + s.map(x => x.rooms));
    ok(k + ': exactly one monster host', s.filter(x => x.host).length === 1, JSON.stringify(s.map(x => x.host)));
    ok(k + ': everybody sees the other three', s.every(x => x.others === 3), JSON.stringify(s.map(x => x.others)));
    const cmp0 = compareMobs(s, k + ' arrival');
    st.arrival = cmp0;
    ok(k + ': guests see the host\'s monsters, same ids and kinds', !!cmp0 && cmp0.every(r => r.same > 0 && r.same >= r.host * .8 && r.kindOff === 0), JSON.stringify(cmp0));

    /* The server has to know every machine the host can see, or the rest cannot be hit. */
    const g = [...liveMod.games.values()][0];
    const zrec = g && g.zones && g.zones[zi + '/0/'];
    const known = zrec ? Object.values(zrec.mobs).filter(r => !r.dead).length : 0;
    const hostN = (s.find(x => x.host) || { mobs: [] }).mobs.length;
    ok(k + ': the server knows every machine in the district', known >= hostN && hostN > 0, 'server ' + known + ' host ' + hostN);

    if (k === 'q1') {
      /* A machine near a guest and far from the host has to go for the guest. */
      await each(() => { __bot.paused = true; });
      const pick = await A.evaluate(() => {
        const P = __g.P; let best = null;
        for (const e of __g.W.ents) if (e.mid && e.hp > 0 && !e.su && Math.hypot(e.x - P.x, e.y - P.y) > 22) { best = e; break; }
        return best && { id: best.mid, x: best.x, y: best.y };
      });
      if (pick) {
        const hits0 = await D.evaluate(() => __net.n.mdmg || 0);
        await D.evaluate(p => { const e = __g.W.ents.find(x => x.mid === p.id); __g.P.x = p.x + 2.5; __g.P.y = p.y; }, pick);
        await wait(1500);
        await A.evaluate(() => { __bot.paused = false; });
        const d0 = await A.evaluate(id => { const e = __g.W.ents.find(x => x.mid === id); const o = __mp.MP.others.find(o => o.name === 'Dot'); return e && o ? Math.hypot(e.x - o.x, e.y - o.y) : null; }, pick.id);
        await wait(3500);
        const res = await A.evaluate(id => { const e = __g.W.ents.find(x => x.mid === id); const o = __mp.MP.others.find(o => o.name === 'Dot'); return e && o ? { d: Math.hypot(e.x - o.x, e.y - o.y), aggro: !!e.aggro, hostD: Math.hypot(e.x - __g.P.x, e.y - __g.P.y) } : null; }, pick.id);
        const hits = (await D.evaluate(() => __net.n.mdmg || 0)) - hits0;
        /* It may already have killed the guest, or been killed, by the time we look again. */
        ok(k + ': a machine beside a guest, far from the host, wakes and goes for the guest', (!!res && res.aggro && res.d <= Math.max(2.2, d0 - .5)) || (!res && hits > 0), JSON.stringify({ d0, res, mdmg: hits }));
      } else note(k + ': no machine far enough from the host for the targeting check');
      await each(() => { __bot.paused = false; });
    }

    await A.evaluate(() => { __bot.order = { k: 'lead' }; });
    await Promise.all([Bp, C, D].map(p => p.evaluate(u => { __bot.order = { k: 'follow', lead: u }; }, TEAM[0].uid)));

    const end = Date.now() + ZONE_MS;
    let done = false, worst = null, midSample = null;
    while (Date.now() < end) {
      await wait(4000);
      s = await snap();
      const c = compareMobs(s, k);
      st.samples.push({ t: Math.round((Date.now() - st.t0) / 1000), zi: s.map(x => x.zi), hp: s.map(x => x.hp), q: s.map(x => x.q[k]), kills: s.map(x => x.kills), deaths: s.map(x => x.deaths), cmp: c, ticks: s.map(x => x.ticks) });
      if (c && !midSample && c.some(r => r.same > 3)) midSample = c;
      if (c) for (const r of c) if (!worst || r.far + r.hpOff > worst.far + worst.hpOff) worst = r;
      for (let i = 0; i < s.length; i++) if (s[i].zi !== zi && s[i].mode === 'play') {
        log.deaths.push({ k, who: TEAM[i].name, t: Math.round((Date.now() - st.t0) / 1000) });
        await all[i].evaluate(zi => { __bot.paused = true; __g.setMode('play'); __g.enter(zi); __bot.paused = false; }, zi);
      }
      const lead = s[0];
      if (lead.errs.length) note(k + ': bot errors in Ada: ' + lead.errs.join(' | ').slice(0, 300));
      if (s.some(x => (x.q[k] || 0) >= 2) && (k !== 'q3' || s.some(x => (x.q.q3 || 0) >= 2))) {
        done = true; await wait(2500); s = await snap(); break;
      }
      process.stdout.write('  ' + Math.round((Date.now() - st.t0) / 1000) + 's q=' + s.map(x => x.q[k]).join('') + ' hp=' + s.map(x => x.hp).join('/') + ' kills=' + s.map(x => x.kills).join('/') + ' mobs=' + s.map(x => x.mobs.length).join('/') + '\r');
    }
    console.log('');
    st.worst = worst; st.mid = midSample;
    ok(k + ': the party finishes the quest in time', done, 'states ' + s.map(x => x.q[k]).join(','));
    const cmps = st.samples.map(x => x.cmp).filter(c => c && c.some(r => r.same > 3));
    if (cmps.length) {
      const farW = Math.max(...cmps.map(c => Math.max(...c.map(r => r.far / Math.max(1, r.same)))));
      const hpW = Math.max(...cmps.map(c => Math.max(...c.map(r => r.hpOff / Math.max(1, r.same)))));
      ok(k + ': through the fight the guests\' monsters sit where the host has them', farW <= .2, 'worst ' + Math.round(farW * 100) + '% of monsters more than 2.5 paces off');
      ok(k + ': through the fight the life bars agree', hpW <= .2, 'worst ' + Math.round(hpW * 100) + '% of monsters with a different life');
    }
    const q = s.map(x => x.q[k] || 0);
    st.after = q;
    ok(k + ': every member gets the quest, including the two who never took it', q.every(v => v >= 2), JSON.stringify(q) + ' (Ada,Bea took it; Cid,Dot did not)');
    const xp1 = await each(() => ({ xp: __g.G.xp, lvl: __g.G.lvl }));
    const n1 = await each(() => Object.assign({}, __net.n));
    const gained = xp1.map((v, i) => v.lvl > xp0[i].lvl ? 'lvl+' + (v.lvl - xp0[i].lvl) : Math.round(v.xp - xp0[i].xp));
    st.xp = gained;
    const shares = n1.map((v, i) => ((v.xp || 0) - (n0[i].xp || 0)) + '/' + ((v.mxp || 0) - (n0[i].mxp || 0)));
    st.shares = shares;
    ok(k + ': everybody in the district earned experience', xp1.every((v, i) => v.lvl > xp0[i].lvl || v.xp > xp0[i].xp), JSON.stringify(gained) + ' xp/mxp msgs ' + JSON.stringify(shares));
    const kills = s.map(x => x.kills);
    st.kills = kills;
    return done;
  }

  async function turnIn(k) {
    const who = BACK[k];
    if (!who) return;
    const before = await each(() => ({ sp: __g.G.sp, ap: __g.G.ap, s: __g.G.q }));
    await talkAll(who);
    const after = await each(k => __g.G.q[k] || 0, k);
    ok(k + ': all four can turn it in to ' + who, after.every(v => v >= 3), JSON.stringify(after));
  }

  /* ---------- Act I ---------- */
  const ACT = process.env.PARTY_PVP_ONLY ? [] : ['q1', 'q2', 'q3', 'q4', 'q5'];
  for (const k of ACT) {
    const done = await runZone(k);
    if (k !== 'q5') { await goTown(); await turnIn(k); }
    if (!done) {
      note(k + ' stalled: the act goes on, but later quests may be unreachable');
    }
  }
  const act1 = await each(() => ({ q5: __g.G.q.q5, unlocked: __g.G.unlocked, zi: __g.W.zi, mode: __g.mode }));
  if (ACT.length) ok('Act I closes for everyone (q5 done, Act II unlocked)', act1.every(v => v.q5 >= 2 && v.unlocked >= 7), JSON.stringify(act1));
  await wait(4000);

  /* ---------- hostility and a real fight ---------- */
  console.log('\n--- PvP ---');
  await goTown();
  await each(() => { const G = __g.G; if (G.lvl < 9) G.lvl = 9; });
  await wait(3500); /* the server wants you stood in town a moment before you declare */
  const hos = await A.evaluate(u => { __mp.send('hostile', { uid: u }); return 1; }, TEAM[3].uid);
  const seenHos = await until(D, u => __mp.mpHostileTo(u) ? 1 : 0, TEAM[0].uid);
  ok('Ada declares against Dot in town and Dot sees it', !!seenHos);
  const leftParty = await until(D, u => !(__mp.MP.party && __mp.MP.party.members.some(m => m.uid === u)) ? 1 : 0, TEAM[0].uid);
  ok('declaring takes Ada out of the party she shared with Dot', !!leftParty);
  const townHit = await A.evaluate(() => (__mp.MP.others || []).length);
  /* In town nothing lands. */
  const dHp0 = await D.evaluate(() => __g.G.hp);
  await A.evaluate(() => { __bot.order = { k: 'duel' }; });
  await wait(4000);
  const dHpTown = await D.evaluate(() => __g.G.hp);
  ok('town is safe: no damage between hostile players in Stillwater', dHpTown >= dHp0, dHp0 + ' -> ' + dHpTown);
  await A.evaluate(() => { __bot.order = { k: 'idle' }; });
  /* Out in the Moors. */
  await each(() => { __bot.order = { k: 'idle' }; __bot.paused = true; __g.setMode('play'); __g.enter(1); __bot.paused = false; });
  await Promise.all(all.map(p => until(p, () => __g.W.zi === 1 && __g.mode === 'play' ? 1 : 0, null, 15000)));
  await wait(6500); /* five seconds of grace on entering */
  const pos = await A.evaluate(() => ({ x: __g.P.x, y: __g.P.y }));
  await D.evaluate(p => { __g.P.x = p.x + 1.2; __g.P.y = p.y; }, pos);
  await wait(800);
  const stand = await until(A, u => __g.W.ents.some(e => e.mp === u) ? 1 : 0, TEAM[3].uid);
  ok('Dot stands in Ada\'s world as something her skills can hit', !!stand);
  const d0 = await D.evaluate(() => ({ hp: __g.G.hp, max: __g.S.maxHp, deaths: __bot.deaths }));
  await A.evaluate(u => { __bot.order = { k: 'duel', uid: u }; }, TEAM[3].uid);
  await D.evaluate(() => { __bot.order = { k: 'hold' }; __g.G.stims = 0; });
  let killed = null;
  const tEnd = Date.now() + 150000;
  while (Date.now() < tEnd) {
    await wait(1500);
    const d = await D.evaluate(() => ({ hp: Math.round(__g.G.hp), deaths: __bot.deaths, mode: __g.mode, pvp: __net.pvp.length }));
    process.stdout.write('  Dot hp ' + d.hp + ' pvp msgs ' + d.pvp + ' mode ' + d.mode + '   \r');
    if (d.deaths > d0.deaths || d.mode === 'dying' || d.hp <= 0) { killed = d; break; }
  }
  console.log('');
  const pv = await D.evaluate(() => __net.pvp.slice(0, 3));
  ok('Ada\'s blows reach Dot as pvp hits', pv.length > 0, JSON.stringify(pv));
  ok('Ada can actually kill Dot outside town', !!killed, JSON.stringify(await D.evaluate(() => ({ hp: __g.G.hp, max: __g.S.maxHp, n: __net.pvp.length }))));
  const ann = await until(Bp, () => (__net.kill || []).length ? __net.kill[__net.kill.length - 1] : null, null, 4000);
  ok('the kill is announced to the game', !!ann, JSON.stringify(ann));
  await each(() => { __bot.order = { k: 'idle' }; });

  /* ---------- the rig: a duel ---------- */
  console.log('\n--- duel in the Simulator ---');
  /* Bea and Cid are still partied. The leader books the rig for a duel, they declare in
     town (which breaks the party, as it should), and go in. */
  await goTown();
  const lead = await Bp.evaluate(() => __mp.MP.party && __mp.MP.party.leader);
  const leadT = TEAM.find(t => t.uid === lead);
  ok('after Ada left, the party has a leader among those still in it', !!leadT && leadT.name !== 'Ada', String(leadT && leadT.name));
  const booker = leadT ? leadT.page : Bp;
  await booker.evaluate(() => __mp.send('sim', { action: 'open', mode: 'duel' }));
  const booked = await Promise.all([Bp, C].map(p => until(p, () => __mp.MP.sim && __mp.MP.sim.mode === 'duel' ? 1 : 0)));
  ok('both duellists see the rig booked for a duel', booked.every(Boolean));
  await wait(3500);
  await Bp.evaluate(u => __mp.send('hostile', { uid: u }), TEAM[2].uid);
  const dueled = await until(C, u => __mp.mpHostileTo(u) ? 1 : 0, TEAM[1].uid);
  ok('Bea declares against Cid for the duel', !!dueled, JSON.stringify(await Bp.evaluate(() => (__net.sys || []).slice(-3).map(m => m.text))));
  const rigZi = await Bp.evaluate(() => __mp.MP.simZone);
  const simAfter = await Bp.evaluate(() => __mp.MP.sim);
  log.simAfterDeclare = simAfter;
  await wait(10500); /* the declaration holds a portal for ten seconds */
  for (const p of [Bp, C]) await p.evaluate(zi => { __bot.paused = true; __g.setMode('play'); __g.enter(zi); __bot.paused = false; }, rigZi);
  const inRig = await Promise.all([Bp, C].map(p => until(p, zi => __g.W.zi === zi && __g.mode === 'play' ? 1 : 0, rigZi, 15000)));
  ok('both reach the rig', inRig.every(Boolean), JSON.stringify(await Promise.all([Bp, C].map(p => p.evaluate(() => ({ zi: __g.W.zi, mode: __g.mode }))))));
  await wait(6500);
  const bpos = await Bp.evaluate(() => ({ x: __g.P.x, y: __g.P.y }));
  await C.evaluate(p => { __g.P.x = p.x + 1.2; __g.P.y = p.y; __bot.order = { k: 'hold' }; __g.G.stims = 0; }, bpos);
  const c0 = await C.evaluate(() => ({ deaths: __bot.deaths, xp: __g.G.xp, lvl: __g.G.lvl, credits: __g.G.credits, corpses: (__g.G.corpses || []).length, gd: __g.G.deaths || 0 }));
  const pick = await Bp.evaluate(u => { const e = __g.W.ents.find(x => x.mp === u); const h = e && __g.pickAt(e.x, e.y); return { stand: !!e, kind: h && h.kind, same: !!(h && h.o === e) }; }, TEAM[2].uid);
  ok('a mouse over a hostile player picks them as a foe', pick.same && pick.kind === 'foe', JSON.stringify(pick));
  await Bp.evaluate(u => { __bot.order = { k: 'duel', uid: u, plain: 1 }; }, TEAM[2].uid);
  let duelEnd = null;
  const dEnd = Date.now() + 300000;
  while (Date.now() < dEnd) {
    await wait(1500);
    const c = await C.evaluate(() => ({ hp: Math.round(__g.G.hp), deaths: __bot.deaths, gd: __g.G.deaths || 0, mode: __g.mode, zi: __g.W.zi, pvp: __net.pvp.length }));
    const bv = await Bp.evaluate(u => { const e = __g.W.ents.find(x => x.mp === u); return { zi: __g.W.zi, mode: __g.mode, stand: !!e, d: e ? +Math.hypot(e.x - __g.P.x, e.y - __g.P.y).toFixed(1) : null, hos: __mp.mpHostileTo(u), others: __mp.MP.others.length, pvpOut: __net.out.pvp || 0, ehp: e && e.hp, emax: e && e.max, mo: __g.MO && __g.MO.k, moE: !!(__g.MO && __g.MO.e === e), en: Math.round(__g.G.en), hp: Math.round(__g.G.hp), atk: __g.P.atkT, sim: __g.W.z && __g.W.z.name }; }, TEAM[2].uid);
    log.duelTrace = log.duelTrace || []; log.duelTrace.push({ c, bv });
    process.stdout.write('  Cid hp ' + c.hp + ' pvp ' + c.pvp + ' zi ' + c.zi + ' Bea ' + JSON.stringify(bv) + '   \n');
    if (c.deaths > c0.deaths || c.gd > c0.gd || c.zi !== rigZi) { duelEnd = c; break; }
  }
  console.log('');
  ok('the duel ends with a fall', !!duelEnd, JSON.stringify(await C.evaluate(() => ({ hp: __g.G.hp, n: __net.pvp.length }))));
  const c1 = await C.evaluate(() => ({ deaths: __bot.deaths, xp: __g.G.xp, lvl: __g.G.lvl, credits: __g.G.credits, corpses: (__g.G.corpses || []).length, gd: __g.G.deaths || 0 }));
  log.duel = { c0, c1, duelEnd };
  ok('losing a duel in the rig costs nothing (experience, credits, no body left)', c1.lvl === c0.lvl && c1.xp >= c0.xp && c1.credits >= c0.credits && c1.corpses === c0.corpses, JSON.stringify({ c0, c1 }));
  const dk = await until(A, () => (__net.kill || []).find(m => m.duel) || null, null, 4000);
  ok('the game hears it was a duel', !!dk, JSON.stringify(await A.evaluate(() => __net.kill)));
  await each(() => { __bot.order = { k: 'idle' }; });

  /* ---------- wrap up ---------- */
  log.bots = await each(() => ({ said: __bot.said.slice(-15), errs: __bot.errs, deaths: __bot.deaths, ticks: __bot.ticks, net: __net.n }));
  ok('no page errors', errs.length === 0, errs.slice(0, 6).join(' | '));
  log.errs = errs;
  fs.writeFileSync(OUT, JSON.stringify(log, null, 1));
  console.log('\n' + out.join('\n') + '\n\n' + pass + ' passed, ' + fail + ' failed   (log: ' + OUT + ')');
  await browser.close();
  server.close();
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
