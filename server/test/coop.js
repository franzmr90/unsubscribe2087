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

  A.s.close(); B3.s.close(); C.s.close();
  await wait(200);
  console.log(out.join('\n'));
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  server.close();
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
