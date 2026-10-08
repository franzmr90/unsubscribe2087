/* Reach, swing rate, life clamps, and the monster-host handoff.
   `node server/test/plaus.js` */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'u2087-plaus-'));
process.env.DATA_DIR = tmp;
delete process.env.SMTP_HOST;
delete process.env.INVITE_REQUIRED;
delete process.env.INVITE_CODES;
delete process.env.ALLOWLIST;
delete process.env.WS_REQUIRE_ORIGIN;

const plaus = require('../lib/plaus');
const { server, live } = require('../server');
const auth = require('../lib/auth');

let pass = 0, fail = 0; const out = [];
const ok = (n, c, d) => { if (c) { pass++; out.push('  ok   ' + n); } else { fail++; out.push('  FAIL ' + n + (d ? '  <' + d + '>' : '')); } };
const wait = ms => new Promise(r => setTimeout(r, ms));

function jitterArrivals(cls, n, span) {
  const gap = plaus.minGapMs(cls);
  const times = [];
  for (let i = 0; i < n; i++) times.push(i * gap + ((i * 97) % (span + 1)));
  times.sort((a, b) => a - b);
  return times;
}
function allHonest(cls) {
  const p = { cls, swing: null, hitWin: null };
  const times = jitterArrivals(cls, 80, 150);
  let t0 = 0;
  for (let i = 0; i < times.length; i++) {
    const now = 100000 + Math.round(times[i]);
    if (now === t0) continue;
    t0 = now;
    if (!plaus.allowBurst(p, cls, 1, now)) return false;
  }
  return true;
}

ok('melee reach is the short one', plaus.reachOf('scrapper', -1) === plaus.REACH.melee);
ok('a rush is the long one', plaus.reachOf('scrapper', 4) === plaus.REACH.far);
ok('courier binds on the attack', plaus.minGapMs('courier') < plaus.CAST_FLOOR * 1000);
ok('a slow class binds on the cast floor', plaus.minGapMs('witness') === plaus.CAST_FLOOR * 1000);

for (const cls of Object.keys(plaus.CLS)) {
  ok(cls + ' still lands with 150 ms of jitter', allHonest(cls));
}

const cheat = { cls: 'courier', swing: null, hitWin: null };
let rejected = 0, accepted = 0;
for (let i = 0; i < 40; i++) {
  if (plaus.allowBurst(cheat, 'courier', 7, 5000 + i * 7)) accepted++;
  else rejected++;
}
const courierCap = Math.ceil(1000 / plaus.minGapMs('courier')) + plaus.RATE_SLACK;
ok('a 40-hit burst inside 300 ms is refused', rejected > 0 && accepted <= courierCap, 'accepted ' + accepted + ' cap ' + courierCap);

const far = { cls: 'scrapper', name: 'Far', x: 80, y: 10 };
const near = { cls: 'scrapper', name: 'Near', x: 12, y: 10 };
const mob = { id: 1, x: 10, y: 10 };
ok('a swing from across the district is refused', plaus.hitOk(far, mob, -1) === false);
ok('a swing in reach is kept', plaus.hitOk(near, mob, -1) === true);

const cap10 = plaus.lifeCap('scrapper', 10);
const fat = { cls: 'scrapper', name: 'Fat', lvl: 10 };
plaus.clampVitals(fat, { lvl: 10, hp: 100, hpm: 999999 }, 1000);
ok('life above the gear cap is clamped', fat.hpm === cap10, String(fat.hpm) + ' vs ' + cap10);

const healed = { cls: 'scrapper', name: 'Heal', lvl: 20 };
plaus.clampVitals(healed, { lvl: 20, hp: 100, hpm: 400 }, 2000);
healed.burst = 0;
plaus.clampVitals(healed, { hp: 400, hpm: 400 }, 2050);
ok('a bar filled faster than regen and leech is clamped', healed.hp > 100 && healed.hp < 250, String(healed.hp));

const ignore = { cls: 'courier', name: 'Iron', lvl: 20, hp: 200, hpm: 400, vitAt: 3000 };
plaus.notePvp(ignore, 160);
const chip = plaus.pvpOwed(ignore, 160);
plaus.clampVitals(ignore, { hp: 200, hpm: 400 }, 3200);
ok('an ignored hit still comes off the bar', ignore.hp === 200 - chip && chip === Math.max(1, Math.round(160 * 0.08)), String(ignore.hp) + ' chip ' + chip);

const stim = { cls: 'scrapper', name: 'Stim', lvl: 20, hp: 100, hpm: 400, vitAt: 4000 };
plaus.notePvp(stim, 160);
plaus.clampVitals(stim, { hp: 280, hpm: 400 }, 4200);
ok('a stim-sized jump is not called an ignored hit', stim.hp >= 250, String(stim.hp));

const { FORMULAS } = require('../../src/formulas');
ok('founder life is the balance pass', FORMULAS.cls.founder.hp === 102 && FORMULAS.cls.founder.hpL === 13);
ok('homesteader life is the balance pass', FORMULAS.cls.homesteader.hp === 120 && FORMULAS.cls.homesteader.hpL === 16);
ok('witness life is the balance pass', FORMULAS.cls.witness.hp === 102 && FORMULAS.cls.witness.hpL === 13);
ok('maximalist life is the balance pass', FORMULAS.cls.maxi.hp === 118 && FORMULAS.cls.maxi.hpL === 15);
const oldFounder = Math.round((90 + 19 * 12 + (5 * 19 + 80) * 4 + 2200 + 12 * 20) * 2.8);
ok('a braced founder is not clamped to the old life', plaus.lifeCap('founder', 20) > oldFounder);

/* A real hit that the brace can swallow (under 1 life on the bar) is not a cheat.
   An ignored hit that should still show is taken off. */
function braceCase(cls, landed, hpm, drop) {
  const quiet = { cls, name: cls, lvl: 40, hp: hpm, hpm, vitAt: 8000 };
  const owed = plaus.pvpOwed(quiet, landed);
  plaus.notePvp(quiet, landed);
  plaus.clampVitals(quiet, { hp: hpm, hpm }, 8200);
  const honest = { cls, name: cls + 'h', lvl: 40, hp: hpm, hpm, vitAt: 9000 };
  plaus.notePvp(honest, landed);
  plaus.clampVitals(honest, { hp: hpm - drop, hpm }, 9200);
  return { owed, quiet: quiet.hp, honest: honest.hp };
}
const big = 400, bar = 800;
const braces = [
  ['scrapper', 'Hold the Line'],
  ['founder', 'Interns'],
  ['homesteader', 'Cold Frame'],
  ['witness', 'the Sentence and Colophon'],
  ['maxi', 'Tick Tock, Few Understand, and Twenty-One Million']
];
for (const [cls, name] of braces) {
  const keep = plaus.braceKeep(cls);
  const raw = Math.max(1, Math.round(big * 0.08));
  const c = braceCase(cls, big, bar, 2);
  ok(name + ' lowers the chip', c.owed > 0 && c.owed < raw && Math.abs(c.owed - Math.floor(raw * keep)) < 0.01, 'owed ' + c.owed + ' raw ' + raw);
  ok(name + ' still docks a bar that does not move', c.quiet === bar - c.owed, String(c.quiet));
  ok(name + ' leaves a bar that did move', c.honest === bar - 2, String(c.honest));
}
const eaten = braceCase('witness', 20, 100, 0);
ok('a witness brace can eat a small hit', eaten.owed === 0 && eaten.quiet === 100, 'owed ' + eaten.owed + ' hp ' + eaten.quiet);
const bare = FORMULAS.brace.hacker;
FORMULAS.brace.hacker = 0.5;
const withBrace = braceCase('hacker', big, bar, 2);
FORMULAS.brace.hacker = bare;
ok('a Technomancer brace is one number', withBrace.owed === Math.floor(Math.max(1, Math.round(big * 0.08)) * 0.5) && withBrace.quiet === bar - withBrace.owed, String(withBrace.owed));
ok('the Technomancer brace is empty until it exists', plaus.braceKeep('hacker') === 1);

(async () => {
  await new Promise(r => server.listen(0, r));
  const base = 'http://127.0.0.1:' + server.address().port;

  function reg(n) {
    const u = auth.createUser(n, 'plaus-tester-11');
    return { u, cookie: 'u2087=' + encodeURIComponent(auth.newSession(u.id)) };
  }
  function client(cookie) {
    return new Promise((res, rej) => {
      const s = new WebSocket(base.replace('http', 'ws') + '/live', { headers: { Cookie: cookie } });
      const c = { s, seen: [], send: o => s.send(JSON.stringify(o)) };
      s.onmessage = e => { const m = JSON.parse(e.data); c.seen.push(m); if (m.t === 'you') res(c); };
      s.onerror = () => rej(new Error('socket'));
      setTimeout(() => rej(new Error('timed out')), 5000);
    });
  }
  async function until(fn, ms) {
    const end = Date.now() + ms;
    while (Date.now() < end) { if (fn()) return true; await wait(20); }
    return !!fn();
  }
  const of = (c, t) => c.seen.filter(m => m.t === t);
  const who = n => [...live.live.values()].find(p => p.name === n);

  const A = reg('Ada'), B = reg('Bea'), C = reg('Cid');
  const a = await client(A.cookie), b = await client(B.cookie), c = await client(C.cookie);
  const ua = (a.seen.find(m => m.t === 'you') || {}).uid;
  const ub = (b.seen.find(m => m.t === 'you') || {}).uid;
  const uc = (c.seen.find(m => m.t === 'you') || {}).uid;
  a.send({ t: 'hello', lvl: 10, cls: 'scrapper', zi: 1, hp: 100, hpm: 200 });
  b.send({ t: 'hello', lvl: 10, cls: 'scrapper', zi: 1, hp: 100, hpm: 200 });
  c.send({ t: 'hello', lvl: 10, cls: 'scrapper', zi: 1, hp: 100, hpm: 200 });
  a.send({ t: 'game.create', name: 'Pit', diff: 'normal' });
  ok('the game exists', await until(() => of(a, 'game').some(m => m.game && m.game.id), 1500));
  const gid = of(a, 'game').find(m => m.game && m.game.id).game.id;
  b.send({ t: 'game.join', id: gid });
  c.send({ t: 'game.join', id: gid });
  await wait(80);
  a.send({ t: 'move', x: 10, y: 10, zi: 1, tier: 0, hp: 100, hpm: 200, lvl: 10 });
  await wait(40);
  b.send({ t: 'move', x: 11, y: 10, zi: 1, tier: 0, hp: 100, hpm: 200, lvl: 10 });
  await wait(40);
  c.send({ t: 'move', x: 13, y: 10, zi: 1, tier: 0, hp: 100, hpm: 200, lvl: 10 });
  await wait(80);
  const named = of(b, 'mhost').concat(of(c, 'mhost')).some(m => m.uid === ua && m.next === ub);
  ok('the next host is named while the current one is still here', named, JSON.stringify(of(b, 'mhost').slice(-2)));

  a.seen.length = 0; b.seen.length = 0; c.seen.length = 0;
  a.send({ t: 'move', x: 10, y: 10, zi: 0, tier: 0, hp: 100, hpm: 200, lvl: 10 });
  ok('the named player is handed the district', await until(() => of(b, 'mhost').some(m => m.uid === ub && m.hand === 1), 800));
  const guest = of(c, 'mobs').filter(m => m.snap != null);
  ok('the handoff does not snap the guests', guest.length >= 1 && guest.every(m => m.snap === 0), JSON.stringify(guest.map(m => m.snap)));
  ok('the guest was not told to take over', !of(c, 'mhost').some(m => m.hand === 1 && m.uid === uc));

  b.send({ t: 'move', x: 11, y: 10, zi: 1, tier: 0, hp: 100, hpm: 200, lvl: 10 });
  await wait(40);
  b.send({ t: 'mobs', zi: 1, tier: 0, list: [{ id: 3, k: 'mech', x: 10, y: 10, hp: 95, max: 95, ml: 1 }] });
  await wait(50);
  c.seen.length = 0; b.seen.length = 0;
  c.send({ t: 'move', x: 80, y: 10, zi: 1, tier: 0, hp: 100, hpm: 200, lvl: 10 });
  await wait(30);
  c.send({ t: 'mhit', zi: 1, tier: 0, id: 3, d: 5, sk: -1 });
  await wait(60);
  ok('the server drops a hit from out of reach', of(b, 'mhp').length === 0 && of(c, 'mhp').length === 0);

  c.send({ t: 'move', x: 12, y: 10, zi: 1, tier: 0, hp: 100, hpm: 200, lvl: 10 });
  await wait(30);
  c.seen.length = 0; b.seen.length = 0;
  c.send({ t: 'mhit', zi: 1, tier: 0, id: 3, d: 5, sk: -1 });
  await wait(60);
  ok('the same hit in reach is applied', of(b, 'mhp').some(m => m.id === 3 && m.hp < 95));

  c.seen.length = 0; b.seen.length = 0;
  for (let i = 0; i < 40; i++) c.send({ t: 'mhit', zi: 1, tier: 0, id: 3, d: 1, sk: -1 });
  await wait(80);
  const landed = of(b, 'mhp').length;
  const rateCap = Math.ceil(1000 / plaus.minGapMs('scrapper')) + plaus.RATE_SLACK;
  ok('hits faster than the class can swing are dropped', landed > 0 && landed <= rateCap, 'landed ' + landed + ' cap ' + rateCap);

  const pa = who('Ada');
  a.send({ t: 'move', x: 1, y: 1, zi: 0, tier: 0, hp: 50, hpm: 999999, lvl: 10 });
  await wait(40);
  ok('a reported max life above the cap is stored at the cap', !!(pa && pa.hpm === cap10), pa && String(pa.hpm));

  const D = reg('Dee'), E = reg('Eve');
  const d = await client(D.cookie), e = await client(E.cookie);
  const ue = (e.seen.find(m => m.t === 'you') || {}).uid;
  d.send({ t: 'hello', lvl: 20, cls: 'scrapper', zi: 4, hp: 200, hpm: 400 });
  e.send({ t: 'hello', lvl: 20, cls: 'scrapper', zi: 4, hp: 200, hpm: 400 });
  d.send({ t: 'game.create', name: 'Duel', diff: 'normal' });
  ok('the duel game exists', await until(() => of(d, 'game').some(m => m.game && m.game.id), 1500));
  const gid2 = of(d, 'game').find(m => m.game && m.game.id).game.id;
  e.send({ t: 'game.join', id: gid2 });
  await wait(60);
  d.send({ t: 'move', x: 4, y: 4, zi: 4, tier: 0, hp: 200, hpm: 400, lvl: 20 });
  e.send({ t: 'move', x: 5, y: 4, zi: 4, tier: 0, hp: 200, hpm: 400, lvl: 20 });
  await wait(40);
  const pd = who('Dee'), pe = who('Eve');
  pd.hostile.add(pe.uid); pe.hostile.add(pd.uid);
  pd.safeUntil = 0; pe.safeUntil = 0;
  d.send({ t: 'pvp', uid: ue, dmg: 1e7 });
  await wait(40);
  const before = pe.hp;
  e.send({ t: 'move', x: 5, y: 4, zi: 4, tier: 0, hp: before, hpm: 400, lvl: 20 });
  await wait(40);
  ok('a bar that ignores a hit is pulled down', pe.hp < before, String(pe.hp) + ' from ' + before);

  console.log(out.join('\n'));
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  server.close();
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
