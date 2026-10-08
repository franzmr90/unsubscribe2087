/* Party auras, a trade that cannot be applied twice, and who is paid for a kill.
   `node server/test/coop.js` */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'u2087-coop-'));
process.env.DATA_DIR = tmp;
delete process.env.SMTP_HOST;
delete process.env.INVITE_REQUIRED;
delete process.env.WS_REQUIRE_ORIGIN;

const { server, live } = require('../server');
const auth = require('../lib/auth');
const plaus = require('../lib/plaus');
const formulas = require('../../src/formulas');

let pass = 0, fail = 0; const out = [];
const ok = (n, c, d) => { if (c) { pass++; out.push('  ok   ' + n); } else { fail++; out.push('  FAIL ' + n + (d ? '  <' + d + '>' : '')); } };
const wait = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  await new Promise(r => server.listen(0, r));
  const base = 'http://127.0.0.1:' + server.address().port;

  function reg(n) {
    const u = auth.createUser(n, 'coop-tester-11');
    return 'u2087=' + encodeURIComponent(auth.newSession(u.id));
  }
  function client(cookie) {
    return new Promise((res, rej) => {
      const s = new WebSocket(base.replace('http', 'ws') + '/live', { headers: { Cookie: cookie } });
      const c = { s, seen: [], send: o => s.send(JSON.stringify(o)) };
      s.onmessage = e => { const m = JSON.parse(e.data); c.seen.push(m); if (m.t === 'you') res(c); };
      s.onerror = () => rej(new Error('socket'));
      setTimeout(() => rej(new Error('timed out')), 4000);
    });
  }
  const of = (c, t) => c.seen.filter(m => m.t === t);
  const who = name => { for (const p of live.live.values()) if (p.name === name) return p; return null; };

  const cookieA = reg('Ada'), cookieB = reg('Bea'), cookieC = reg('Cid');
  const A = await client(cookieA);
  const B = await client(cookieB);
  const C = await client(cookieC);
  A.send({ t: 'hello', lvl: 20, cls: 'maxi', zi: 1, hp: 200, hpm: 400, resume: 1 });
  B.send({ t: 'hello', lvl: 20, cls: 'courier', zi: 1, hp: 200, hpm: 400, resume: 1 });
  C.send({ t: 'hello', lvl: 20, cls: 'scrapper', zi: 1, hp: 200, hpm: 400 });
  A.send({ t: 'game.create', name: 'Pit', diff: 'normal' });
  await wait(80);
  const gid = of(A, 'game').find(m => m.game && m.game.id).game.id;
  B.send({ t: 'game.join', id: gid });
  C.send({ t: 'game.join', id: gid });
  await wait(80);
  const bea = who('Bea').uid, ada = who('Ada').uid;
  A.send({ t: 'invite', uid: bea });
  await wait(40);
  B.send({ t: 'accept', uid: ada });
  await wait(40);

  /* Out of the aura: the swing floor is the class floor. */
  A.send({ t: 'move', x: 10, y: 10, zi: 1, tier: 0, hp: 200, hpm: 400, lvl: 20, au: null, aL: 0 });
  B.send({ t: 'move', x: 30, y: 10, zi: 1, tier: 0, hp: 200, hpm: 400, lvl: 20 });
  await wait(40);
  A.send({ t: 'mobs', zi: 1, tier: 0, list: [{ id: 1, k: 'tick', x: 30, y: 11, hp: 5000, max: 5000, ml: 5 }] });
  await wait(40);
  B.seen.length = 0;
  for (let i = 0; i < 15; i++) B.send({ t: 'mhit', zi: 1, tier: 0, id: 1, d: 1, sk: -1 });
  await wait(60);
  const farCap = Math.ceil(1000 / plaus.minGapMs('courier')) + plaus.RATE_SLACK;
  const farLanded = of(B, 'mhp').length;
  ok('outside the aura the swing floor holds', farLanded > 0 && farLanded <= farCap, 'landed ' + farLanded + ' cap ' + farCap);

  await wait(1100);
  A.send({ t: 'move', x: 10, y: 10, zi: 1, tier: 0, hp: 200, hpm: 400, lvl: 20, au: 3, aL: 20 });
  B.send({ t: 'move', x: 10.4, y: 10, zi: 1, tier: 0, hp: 200, hpm: 400, lvl: 20 });
  await wait(40);
  const zone = of(B, 'zone').pop();
  const holder = zone && (zone.players || []).find(p => p.name === 'Ada');
  const radius = formulas.auraRadius(3, holder && holder.aL);
  ok('the aura rank is forwarded', !!(holder && holder.au === 3 && holder.aL === 20), JSON.stringify(holder));
  ok('rank 20 toxic is still the printed radius', radius === formulas.FORMULAS.aura.toxic.r, String(radius));
  A.send({ t: 'mobs', zi: 1, tier: 0, list: [{ id: 2, k: 'tick', x: 11, y: 10, hp: 5000, max: 5000, ml: 5 }] });
  await wait(40);
  B.seen.length = 0;
  for (let i = 0; i < 15; i++) B.send({ t: 'mhit', zi: 1, tier: 0, id: 2, d: 1, sk: -1 });
  await wait(60);
  const nearCap = Math.ceil(1000 / plaus.minGapMs('courier', 20)) + plaus.RATE_SLACK;
  const nearLanded = of(B, 'mhp').length;
  ok('inside the aura the faster swings are allowed', nearLanded === 15 && nearLanded > farCap && nearLanded <= nearCap, 'landed ' + nearLanded + ' farCap ' + farCap);

  /* Standing Call raises the life ceiling only while it covers you. */
  const cap = plaus.lifeCap('courier', 20);
  const bumped = plaus.lifeCap('courier', 20, { call: 1 });
  B.send({ t: 'move', x: 40, y: 10, zi: 1, tier: 0, hp: 200, hpm: Math.round(cap * 1.12), lvl: 20 });
  await wait(40);
  ok('a life bump with nobody near is pulled back', who('Bea').hpm === cap, String(who('Bea').hpm));
  A.send({ t: 'move', x: 40, y: 10, zi: 1, tier: 0, hp: 200, hpm: 400, lvl: 20, bf: { call: 10 } });
  B.send({ t: 'move', x: 41, y: 10, zi: 1, tier: 0, hp: 200, hpm: bumped, lvl: 20 });
  await wait(40);
  ok('standing call near a party member is allowed', who('Bea').hpm === bumped, who('Bea').hpm + ' vs ' + bumped);

  /* Marked to Market's radius grows with rank. Four paces is inside rank 10 and outside rank 1. */
  const r1 = formulas.auraRadius(4, 1), r10 = formulas.auraRadius(4, 10);
  ok('four paces is inside a rank-10 mark and outside a rank-1 mark', 4 > r1 && 4 < r10, r1 + ' / ' + r10);

  /* Shared kill: the party rolls, the stranger does not, the experience is one pool. */
  A.send({ t: 'move', x: 10, y: 10, zi: 1, tier: 0, hp: 200, hpm: 400, lvl: 20 });
  B.send({ t: 'move', x: 11, y: 10, zi: 1, tier: 0, hp: 200, hpm: 400, lvl: 20 });
  C.send({ t: 'move', x: 12, y: 10, zi: 1, tier: 0, hp: 200, hpm: 400, lvl: 20 });
  await wait(40);
  A.send({ t: 'mobs', zi: 1, tier: 0, list: [{ id: 3, k: 'tick', x: 10, y: 12, hp: 30, max: 30, ml: 20 }] });
  await wait(40);
  A.seen.length = 0; B.seen.length = 0; C.seen.length = 0;
  A.send({ t: 'mhit', zi: 1, tier: 0, id: 3, d: 1e9, sk: -1 });
  await wait(50);
  const ka = of(A, 'mkill').find(m => m.id === 3);
  const kb = of(B, 'mkill').find(m => m.id === 3);
  const kc = of(C, 'mkill').find(m => m.id === 3);
  const xa = of(A, 'mxp')[0], xb = of(B, 'mxp')[0];
  ok('party members may roll the drop and a stranger may not', !!(ka && kb && kc && ka.loot === 1 && kb.loot === 1 && kc.loot === 0), JSON.stringify({ ka, kb, kc }));
  ok('the experience is one pool split across the party', !!(xa && xb && xa.amount > 0 && xb.amount > 0 && of(C, 'mxp').length === 0), JSON.stringify({ xa, xb, c: of(C, 'mxp') }));

  /* Aura rank and Running a Node. Rank 1 is not what a skilled aura reports. */
  A.seen.length = 0; B.seen.length = 0;
  A.send({ t: 'move', x: 10, y: 10, zi: 1, tier: 0, hp: 200, hpm: 400, lvl: 20, au: 7, aL: 10, node: 8 });
  await wait(40);
  const nodeRow = (of(B, 'zone').pop().players || []).find(p => p.name === 'Ada');
  ok('aura rank and Running a Node rank are forwarded', !!(nodeRow && nodeRow.au === 7 && nodeRow.aL === 10 && nodeRow.node === 8), JSON.stringify(nodeRow && { au: nodeRow.au, aL: nodeRow.aL, node: nodeRow.node }));

  /* Item skills are not class skills. 102 must pass. 15 must not. */
  A.send({ t: 'move', x: 10, y: 10, zi: 1, tier: 0, hp: 200, hpm: 400, lvl: 20, sk: 102 });
  await wait(30);
  const book = (of(B, 'zone').pop().players || []).find(p => p.name === 'Ada');
  ok('an item skill cast is forwarded', !!(book && book.sk === 102), JSON.stringify(book && book.sk));
  A.send({ t: 'move', x: 10, y: 10, zi: 1, tier: 0, hp: 200, hpm: 400, lvl: 20, sk: 15 });
  await wait(30);
  const dropped = (of(B, 'zone').pop().players || []).find(p => p.name === 'Ada');
  ok('a skill index past the class row is dropped', !!(dropped && dropped.sk == null), JSON.stringify(dropped && dropped.sk));

  /* Testimony and On the Record live on the mob snapshot. */
  A.send({ t: 'mobs', zi: 1, tier: 0, list: [{ id: 9, k: 'tick', x: 10, y: 12, hp: 400, max: 400, ml: 8 }] });
  await wait(30);
  B.send({ t: 'move', x: 11, y: 12, zi: 1, tier: 0, hp: 200, hpm: 400, lvl: 20, nm: 6, tes: { 9: 4 } });
  await wait(40);
  const tesSnap = of(A, 'mobs').slice().reverse().find(m => (m.list || []).some(r => r.id === 9 && r.tes));
  const tesRow = tesSnap && tesSnap.list.find(r => r.id === 9);
  ok('testimony is on the mob snapshot', !!(tesRow && tesRow.tes === 4), JSON.stringify(tesRow && tesRow.tes));
  A.send({ t: 'curse', id: 9, k: 'rec', m: 1.48, sec: 8 });
  await wait(20);
  A.send({ t: 'mobs', zi: 1, tier: 0, list: [{ id: 9, k: 'tick', x: 10, y: 12, hp: 400, max: 400, ml: 8 }] });
  await wait(30);
  const recSnap = of(B, 'mobs').slice().reverse().find(m => (m.list || []).some(r => r.id === 9 && r.curse));
  const recRow = recSnap && recSnap.list.find(r => r.id === 9);
  ok('On the Record stays on the mob snapshot', !!(recRow && recRow.curse && recRow.curse.k === 'rec' && recRow.curse.m > 1), JSON.stringify(recRow && recRow.curse));

  /* Lunch pail: one store. A second draw in the same instant does not spend it again. */
  A.send({ t: 'move', x: 10, y: 10, zi: 1, tier: 0, hp: 200, hpm: 400, lvl: 20, pail: { x: 10, y: 10, L: 1, hp: 100, max: 100 } });
  B.send({ t: 'move', x: 10.4, y: 10, zi: 1, tier: 0, hp: 200, hpm: 400, lvl: 20 });
  await wait(40);
  const placed = (of(B, 'zone').pop().players || []).find(p => p.name === 'Ada');
  ok('the lunch pail relays position, rank, and store', !!(placed && placed.pail && placed.pail.L === 1 && placed.pail.hp === 100 && placed.pail.x === 10), JSON.stringify(placed && placed.pail));
  A.seen.length = 0; B.seen.length = 0;
  A.send({ t: 'pail', draw: [{ k: 'self' }, { k: bea }] });
  await wait(30);
  const once = of(A, 'pail').pop();
  const granted = once && once.grants ? once.grants.reduce((s, g) => s + g.n, 0) : 0;
  const beaHeal = of(B, 'pail').filter(m => m.n > 0).reduce((s, m) => s + m.n, 0);
  ok('one pail heals the party from one store', !!(once && granted >= 2 && granted === (100 - once.hp) && beaHeal >= 1 && beaHeal < granted), JSON.stringify({ granted, beaHeal, hp: once && once.hp }));
  const left = once ? once.hp : 100;
  const replies = of(A, 'pail').length;
  A.send({ t: 'pail', draw: [{ k: 'self' }, { k: bea }] });
  B.send({ t: 'pail', draw: [{ k: 'self' }] });
  await wait(30);
  const storeNow = who('Ada').pailStore || 0;
  ok('a second draw does not spend the pail again', storeNow === left && of(A, 'pail').length === replies, JSON.stringify({ left, storeNow, replies, now: of(A, 'pail').length }));
  A.send({ t: 'move', x: 10, y: 10, zi: 1, tier: 0, hp: 200, hpm: 400, lvl: 20, pail: { x: 10, y: 10, L: 1, hp: 100, max: 100 } });
  await wait(30);
  ok('reporting the pail full again does not refill it', (who('Ada').pailStore || 0) === left, String(who('Ada').pailStore));

  /* Unnamed Source, when the nearest ally is the other player. */
  A.seen.length = 0; B.seen.length = 0;
  A.send({ t: 'lend', uid: bea });
  A.send({ t: 'lend', uid: who('Cid').uid });
  await wait(30);
  ok('Unnamed Source reaches the other player', of(B, 'lend').length === 1 && of(C, 'lend').length === 0, JSON.stringify({ b: of(B, 'lend').length, c: of(C, 'lend').length }));

  /* Proof of Work is an area tick. It does not spend the swing window, and it has its own cap. */
  await wait(1100);
  /* max has to sit near the card or the server replaces it. A tick at ml 5 holds about 24, which dies before the area cap. */
  A.send({ t: 'mobs', zi: 1, tier: 0, list: [{ id: 8, k: 'boss5', x: 10, y: 10, hp: 400000, max: 400000, ml: 20 }] });
  B.send({ t: 'move', x: 10, y: 10, zi: 1, tier: 0, hp: 200, hpm: 400, lvl: 20, au: 7, aL: 1 });
  await wait(40);
  B.seen.length = 0;
  for (let i = 0; i < 20; i++) B.send({ t: 'mhit', zi: 1, tier: 0, id: 8, d: 1, sk: -1 });
  await wait(40);
  const swingLanded = of(B, 'mhp').length;
  const swingCap = Math.ceil(1000 / plaus.minGapMs('courier')) + plaus.RATE_SLACK;
  B.seen.length = 0;
  for (let i = 0; i < 12; i++) B.send({ t: 'mhit', zi: 1, tier: 0, id: 8, d: 1, sk: 7, area: 1 });
  await wait(40);
  const areaLanded = of(B, 'mhp').length;
  B.seen.length = 0;
  for (let i = 0; i < 8; i++) B.send({ t: 'mhit', zi: 1, tier: 0, id: 8, d: 1, sk: -1 });
  await wait(30);
  const stillFull = of(B, 'mhp').length;
  ok('area ticks land after the swing window is full', swingLanded > 0 && swingLanded <= swingCap && areaLanded === 12, JSON.stringify({ swingLanded, swingCap, areaLanded }));
  ok('area ticks do not refill the swing window', stillFull === 0, String(stillFull));
  /* The twelve above are still inside the one-second window. The cap is what is left of it. */
  await wait(1100);
  B.send({ t: 'move', x: 10, y: 10, zi: 1, tier: 0, hp: 200, hpm: 400, lvl: 20, au: 7, aL: 1 });
  await wait(30);
  B.seen.length = 0;
  const burst = plaus.AREA_CAP + 14;
  for (let i = 0; i < burst; i++) B.send({ t: 'mhit', zi: 1, tier: 0, id: 8, d: 1, sk: 7, area: 1 });
  await wait(80);
  const flooded = of(B, 'mhp').length;
  ok('area ticks stop at their own cap', flooded === plaus.AREA_CAP, String(flooded));
  await wait(1100);
  B.send({ t: 'move', x: 40, y: 10, zi: 1, tier: 0, hp: 200, hpm: 400, lvl: 20 });
  await wait(30);
  B.seen.length = 0;
  B.send({ t: 'mhit', zi: 1, tier: 0, id: 8, d: 1, sk: 7, area: 1 });
  B.send({ t: 'mhit', zi: 1, tier: 0, id: 8, d: 1, sk: -1, area: 1 });
  await wait(30);
  ok('an area tick outside the pulse, or with a swing skill, does not land', of(B, 'mhp').length === 0, String(of(B, 'mhp').length));

  /* Trade. Both confirm once. A drop before that cancels. A second confirm does not mint a second trade. */
  function item(tid, name) { return { tid, name, slot: 'helm', il: 4, q: 1, base: 'Cap', aff: [], id: true, val: 8, req: 1 }; }
  A.send({ t: 'move', x: 3, y: 3, zi: 0, tier: 0, hp: 200, hpm: 400, lvl: 20 });
  B.send({ t: 'move', x: 4, y: 3, zi: 0, tier: 0, hp: 200, hpm: 400, lvl: 20 });
  await wait(40);
  A.seen.length = 0; B.seen.length = 0;
  A.send({ t: 'trade.ask', uid: bea });
  await wait(40);
  B.send({ t: 'trade.accept', uid: ada });
  await wait(40);
  ok('the trade window opens', of(A, 'trade').some(m => m.phase === 'open') && of(B, 'trade').some(m => m.phase === 'open'));
  A.send({ t: 'trade.offer', sats: 5, items: [item('helmAda01', 'Ada Helm')] });
  B.send({ t: 'trade.offer', sats: 2, items: [item('ringBea01', 'Bea Ring')] });
  await wait(30);
  A.send({ t: 'trade.confirm' });
  B.s.close();
  await wait(80);
  ok('a drop before both confirm cancels the trade', of(A, 'trade').some(m => m.phase === 'dead'), JSON.stringify(of(A, 'trade').map(m => m.phase)));
  ok('a cancelled trade has no result to apply', !of(A, 'trade').some(m => m.phase === 'done'));

  const B2 = await client(cookieB);
  B2.send({ t: 'hello', lvl: 20, cls: 'courier', zi: 0, hp: 200, hpm: 400, resume: 1 });
  await wait(40);
  const back = of(B2, 'game').find(m => m.game && m.game.id);
  if (!back) B2.send({ t: 'game.join', id: gid });
  await wait(40);
  B2.send({ t: 'move', x: 4, y: 3, zi: 0, tier: 0, hp: 200, hpm: 400, lvl: 20 });
  A.send({ t: 'move', x: 3, y: 3, zi: 0, tier: 0, hp: 200, hpm: 400, lvl: 20 });
  await wait(40);
  const bea2 = who('Bea').uid;
  A.seen.length = 0; B2.seen.length = 0;
  A.send({ t: 'trade.ask', uid: bea2 });
  await wait(30);
  B2.send({ t: 'trade.accept', uid: ada });
  await wait(30);
  A.send({ t: 'trade.offer', sats: 5, items: [item('helmAda01', 'Ada Helm')] });
  B2.send({ t: 'trade.offer', sats: 2, items: [item('ringBea01', 'Bea Ring')] });
  await wait(20);
  A.send({ t: 'trade.confirm' });
  B2.send({ t: 'trade.confirm' });
  await wait(40);
  ok('both confirms lock the table until the purses are checked', of(A, 'trade').some(m => m.phase === 'check') && of(B2, 'trade').some(m => m.phase === 'check'));
  A.send({ t: 'trade.hold', sats: 40, tids: ['helmAda01'] });
  B2.send({ t: 'trade.hold', sats: 20, tids: ['ringBea01'] });
  B2.send({ t: 'trade.confirm' });
  await wait(40);
  const doneA = of(A, 'trade').filter(m => m.phase === 'done');
  const doneB = of(B2, 'trade').filter(m => m.phase === 'done');
  const ids = new Set(doneA.concat(doneB).map(m => m.id));
  ok('both confirms settle one trade, and a second confirm does not mint another', doneA.length >= 1 && doneB.length >= 1 && ids.size === 1, JSON.stringify({ a: doneA.length, b: doneB.length, ids: [...ids] }));
  const idA = doneA[0] && doneA[0].id;
  ok('the two results are the same trade', !!(idA && doneB.every(m => m.id === idA)));
  ok('Ada gives the helm and takes the ring', !!(doneA[0] && doneA[0].give.ids[0] === 'helmAda01' && doneA[0].take.items[0].tid === 'ringBea01' && doneA[0].give.sats === 5 && doneA[0].take.sats === 2));
  A.send({ t: 'trade.ack', id: idA });
  B2.s.close();
  await wait(80);
  const B3 = await client(cookieB);
  B3.send({ t: 'hello', lvl: 20, cls: 'courier', zi: 0, hp: 200, hpm: 400, resume: 1 });
  await wait(50);
  const replay = of(B3, 'trade').filter(m => m.phase === 'done');
  ok('reconnect replays the same trade and does not mint another', replay.length === 1 && replay[0].id === idA, JSON.stringify(replay.map(m => m.id)));
  B3.send({ t: 'trade.ack', id: idA });

  /* Changing an offer clears a confirm, so one side cannot swap the goods after the other has agreed. */
  await wait(40);
  const bea3 = who('Bea').uid;
  A.send({ t: 'move', x: 3, y: 3, zi: 0, tier: 0, hp: 200, hpm: 400, lvl: 20 });
  B3.send({ t: 'move', x: 4, y: 3, zi: 0, tier: 0, hp: 200, hpm: 400, lvl: 20 });
  await wait(30);
  A.seen.length = 0; B3.seen.length = 0;
  A.send({ t: 'trade.ask', uid: bea3 });
  await wait(30);
  B3.send({ t: 'trade.accept', uid: ada });
  await wait(30);
  A.send({ t: 'trade.offer', sats: 1, items: [] });
  B3.send({ t: 'trade.offer', sats: 1, items: [] });
  await wait(20);
  A.send({ t: 'trade.confirm' });
  await wait(20);
  B3.send({ t: 'trade.offer', sats: 9, items: [item('ringBea01', 'Bea Ring')] });
  await wait(20);
  B3.send({ t: 'trade.confirm' });
  await wait(30);
  ok('a changed offer is not a completed trade', !of(A, 'trade').some(m => m.phase === 'done') && !of(B3, 'trade').some(m => m.phase === 'done'));

  /* A confirm freezes the offer. A purse that no longer covers it cancels the swap. */
  A.send({ t: 'trade.cancel' });
  await wait(30);
  const bea4 = who('Bea').uid;
  A.seen.length = 0; B3.seen.length = 0;
  A.send({ t: 'trade.ask', uid: bea4 });
  await wait(30);
  B3.send({ t: 'trade.accept', uid: ada });
  await wait(30);
  A.send({ t: 'trade.offer', sats: 10, items: [item('helmAda01', 'Ada Helm')] });
  B3.send({ t: 'trade.offer', sats: 1, items: [] });
  await wait(20);
  A.send({ t: 'trade.confirm' });
  B3.send({ t: 'trade.confirm' });
  await wait(30);
  A.send({ t: 'trade.hold', sats: 9, tids: ['helmAda01'] });
  B3.send({ t: 'trade.hold', sats: 5, tids: [] });
  await wait(40);
  ok('spending the offered sats after confirm cancels the swap', of(A, 'trade').some(m => m.phase === 'dead' && m.why === 'short'));
  ok('a short purse mints nothing', !of(A, 'trade').some(m => m.phase === 'done') && !of(B3, 'trade').some(m => m.phase === 'done'));

  A.seen.length = 0; B3.seen.length = 0;
  A.send({ t: 'trade.ask', uid: bea4 });
  await wait(30);
  B3.send({ t: 'trade.accept', uid: ada });
  await wait(30);
  A.send({ t: 'trade.offer', sats: 0, items: [item('helmAda01', 'Ada Helm')] });
  B3.send({ t: 'trade.offer', sats: 0, items: [item('ringBea01', 'Bea Ring')] });
  await wait(20);
  A.send({ t: 'trade.confirm' });
  B3.send({ t: 'trade.confirm' });
  await wait(30);
  A.send({ t: 'trade.hold', sats: 10, tids: [] });
  B3.send({ t: 'trade.hold', sats: 10, tids: ['ringBea01'] });
  await wait(40);
  ok('dropping an offered item after confirm cancels the swap', of(A, 'trade').some(m => m.phase === 'dead' && m.why === 'short') && !of(A, 'trade').some(m => m.phase === 'done') && !of(B3, 'trade').some(m => m.phase === 'done'));

  A.seen.length = 0; B3.seen.length = 0;
  A.send({ t: 'trade.ask', uid: bea4 });
  await wait(30);
  B3.send({ t: 'trade.accept', uid: ada });
  await wait(30);
  A.send({ t: 'trade.offer', sats: 4, items: [item('helmAda01', 'Ada Helm')] });
  B3.send({ t: 'trade.offer', sats: 4, items: [item('ringBea01', 'Bea Ring')] });
  await wait(20);
  A.send({ t: 'trade.confirm' });
  B3.send({ t: 'trade.confirm' });
  await wait(30);
  ok('the swap has not moved anything before both purses answer', of(A, 'trade').some(m => m.phase === 'check') && !of(A, 'trade').some(m => m.phase === 'done'));
  A.send({ t: 'trade.hold', sats: 4, tids: ['helmAda01'] });
  B3.s.close();
  await wait(80);
  ok('a disconnect during the swap cancels it', of(A, 'trade').some(m => m.phase === 'dead'));
  ok('a disconnect during the swap leaves nothing to apply twice', !of(A, 'trade').some(m => m.phase === 'done'));

  /* PvP carries the damage type and the crit multiplier. Town first, then the arm, then the lock. */
  const cid = who('Cid').uid;
  A.send({ t: 'move', x: 3, y: 3, zi: 0, tier: 0, hp: 200, hpm: 400, lvl: 20 });
  C.send({ t: 'move', x: 4, y: 3, zi: 0, tier: 0, hp: 200, hpm: 400, lvl: 20 });
  await wait(3200);
  A.send({ t: 'hostile', uid: cid });
  await wait(10200);
  A.send({ t: 'move', x: 12, y: 12, zi: 1, tier: 0, hp: 200, hpm: 400, lvl: 20 });
  C.send({ t: 'move', x: 12.4, y: 12, zi: 1, tier: 0, hp: 200, hpm: 400, lvl: 20 });
  await wait(5300);
  C.seen.length = 0;
  A.send({ t: 'pvp', uid: cid, dmg: 80, kind: 'crit', dty: 'heat', critM: 3.5 });
  A.send({ t: 'pvp', uid: cid, dmg: 80, kind: '', dty: 'nope', critM: 9 });
  await wait(40);
  const hits = of(C, 'pvp');
  ok('a player hit carries the damage type and the crit multiplier', !!(hits[0] && hits[0].dty === 'heat' && hits[0].kind === 'crit' && hits[0].critM === 3.5), JSON.stringify(hits[0]));
  ok('a bad type falls back to impact and a wild crit multiplier does not', !!(hits[1] && hits[1].dty === 'impact' && !hits[1].critM), JSON.stringify(hits[1]));

  A.s.close(); C.s.close();
  await wait(200);
  console.log(out.join('\n'));
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  server.close();
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
