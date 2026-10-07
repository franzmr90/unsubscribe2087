/* The lobby and the life of a game: make one, somebody joins, difficulty bites, leaving
   puts you back in the lobby, and logging off closes it. `node server/test/games.js` */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'u2087-games-'));
process.env.DATA_DIR = tmp;
const { server, live } = require('../server');
const auth = require('../lib/auth');

let pass = 0, fail = 0; const out = [];
const ok = (n, c, d) => { if (c) { pass++; out.push('  ok   ' + n); } else { fail++; out.push('  FAIL ' + n + (d ? '  <' + d + '>' : '')); } };
const wait = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  await new Promise(r => server.listen(0, r));
  const base = 'http://127.0.0.1:' + server.address().port;

  /* Accounts are minted directly rather than through /api/register, which rate-limits
     new accounts per address — correct there, in the way here. The registration path has
     its own tests in run.js. */
  function reg(n) {
    const u = auth.createUser(n, 'lobby-tester-11');
    return 'u2087=' + encodeURIComponent(auth.newSession(u.id));
  }

  /* A tiny client that records everything it is told, so assertions can look back. */
  function client(cookie) {
    return new Promise((res, rej) => {
      const s = new WebSocket(base.replace('http', 'ws') + '/live', { headers: { Cookie: cookie } });
      const c = {
        s, seen: [], last: {},
        send: o => s.send(JSON.stringify(o)),
        wait: (t, ms) => new Promise(r => {
          const end = Date.now() + (ms || 3000);
          (function look() {
            if (c.last[t]) return r(c.last[t]);
            if (Date.now() > end) return r(null);
            setTimeout(look, 40);
          })();
        }),
        forget: t => { delete c.last[t]; }
      };
      s.onmessage = e => { const m = JSON.parse(e.data); c.seen.push(m); c.last[m.t] = m; if (m.t === 'you') res(c); };
      s.onerror = () => rej(new Error('socket'));
      setTimeout(() => rej(new Error('timed out')), 5000);
    });
  }

  const uidOf = c => c.last.you && c.last.you.uid;
  function place(c, lvl, zi) { c.send({ t: 'hello', lvl, zi, cls: 'scrapper', hp: 100, hpm: 100 }); }
  async function partyUp(leader, rest) {
    for (const c of rest) {
      c.forget('invited');
      leader.send({ t: 'invite', uid: uidOf(c) });
      const inv = await c.wait('invited');
      if (!inv) throw new Error('no invite for ' + (c.last.you && c.last.you.name));
      c.send({ t: 'accept', uid: uidOf(leader) });
      await wait(40);
    }
    await wait(80);
  }
  async function xpReport(clients, amount, ml) {
    for (const c of clients) c.seen.length = 0;
    clients[0].send({ t: 'xp', amount, ml: ml || 0 });
    await wait(250);
    const parts = [];
    for (const c of clients) for (const m of c.seen) if (m.t === 'xp') parts.push(m.amount);
    return parts;
  }

  const A = await client(reg('Ines'));
  const B = await client(reg('Vale'));

  /* ---- the lobby arrives before you are in anything ---- */
  const lob = await A.wait('lobby');
  ok('you land in the lobby', !!lob && Array.isArray(lob.games), JSON.stringify(lob && Object.keys(lob)));
  ok('the lobby names the difficulties', !!(lob && lob.diffs && lob.diffs.hell), JSON.stringify(lob && lob.diffs && Object.keys(lob.diffs)));
  ok('the lobby starts empty', lob.games.length === 0);

  /* ---- anyone can make one, with a name and a difficulty ---- */
  B.forget('lobby');          /* drop the empty one B got on connecting */
  A.send({ t: 'game.create', name: 'The Marrow', diff: 'hell' });
  const g = await A.wait('game');
  ok('making a game puts you in it', !!(g && g.game && g.game.name === 'The Marrow'), JSON.stringify(g && g.game));
  ok('the difficulty is kept', g.game.diff === 'hell' && g.game.diffName === 'Hell');
  ok('a game holds eight', g.game.max === 8);

  /* ---- difficulty and party size both bite ---- */
  ok('hell makes monsters tougher', g.scale.hp === 5 && g.scale.dmg === 2.4, JSON.stringify(g.scale));
  ok('and worth more', g.scale.xp === 2.8, JSON.stringify(g.scale));

  const lob2 = await B.wait('lobby');
  ok('others see the open game', lob2.games.some(x => x.name === 'The Marrow'), JSON.stringify(lob2.games));

  /* ---- joining ---- */
  B.send({ t: 'game.join', id: g.game.id });
  const gb = await B.wait('game');
  ok('joining works', !!(gb && gb.game && gb.game.id === g.game.id));

  A.forget('roster');
  await wait(400);
  const ros = await A.wait('roster');
  ok('the roster is the game', !!ros && ros.players.length === 2, JSON.stringify(ros && ros.players.length));
  ok('a second player makes monsters tougher again', ros.scale.hp === 7.5, JSON.stringify(ros.scale));
  ok('and worth more again', Math.abs(ros.scale.xp - 4.2) < 1e-9, JSON.stringify(ros.scale));

  /* ---- one pool, killer included. A member ten below the monster takes 5% of the
     level-weighted share (23), which was the full 450 before the curve. ---- */
  await partyUp(A, [B]);
  place(A, 10, 2); place(B, 10, 2); await wait(80);
  const two = await xpReport([A, B], 1600);
  ok('two same-level members share 1.35×, killer included', two.length === 2 && two.reduce((a, b) => a + b, 0) === 2160, JSON.stringify(two));
  place(A, 20, 2); place(B, 10, 2); await wait(80);
  const gap = (await xpReport([A, B], 1000, 20)).slice().sort((a, b) => a - b);
  ok('ten levels below takes 5% of the share', gap.join() === '23,900', JSON.stringify(gap));

  /* ---- text reaches the whole game ---- */
  B.send({ t: 'chat', text: 'credits rot' });
  const ch = await A.wait('chat');
  ok('text reaches everybody in the game', !!ch && ch.text === 'credits rot' && ch.scope === 'game');

  /* ---- voice is only signalled, never carried ---- */
  B.send({ t: 'voice', on: true });
  const vo = await A.wait('voice');
  ok('the game is told who has a microphone open', !!vo && vo.on === true && vo.uid === gb.you);
  B.send({ t: 'rtc', uid: ros.players.find(p => p.name === 'Ines').uid, kind: 'offer', data: { sdp: 'x' } });
  const rt = await A.wait('rtc');
  ok('the handshake is relayed to the right person', !!rt && rt.kind === 'offer' && rt.data.sdp === 'x');

  /* ---- a full game refuses ---- */
  const extra = [];
  for (let i = 0; i < 6; i++) { const c = await client(reg('Filler' + i)); c.send({ t: 'game.join', id: g.game.id }); extra.push(c); await wait(60); }
  await wait(400);
  /* Eight same-level used to sum to 5800 (3.625×): the killer kept 1600 and seven others took 600. */
  await partyUp(A, extra);
  const eight = [A, B].concat(extra);
  for (const c of eight) place(c, 10, 4);
  await wait(120);
  const all = await xpReport(eight, 1600);
  ok('eight same-level members still share 1.35×', all.length === 8 && all.reduce((a, b) => a + b, 0) === 2160, JSON.stringify(all));
  const C = await client(reg('Latecomer'));
  C.send({ t: 'game.join', id: g.game.id });
  const jf = await C.wait('joinfail');
  ok('the ninth player is turned away', !!jf && /full/.test(jf.reason), JSON.stringify(jf));

  /* ---- a locked game needs its password ---- */
  C.send({ t: 'game.create', name: 'Quiet Room', diff: 'normal', pass: 'stillwater' });
  await wait(300);
  const D = await client(reg('Knocker'));
  const dl = await D.wait('lobby');
  const locked = dl.games.find(x => x.name === 'Quiet Room');
  ok('a locked game says so without giving the password', !!locked && locked.locked === true && locked.pass === undefined);
  D.send({ t: 'game.join', id: locked.id, pass: 'wrong' });
  const df = await D.wait('joinfail');
  ok('the wrong password is refused', !!df && /password/.test(df.reason));
  D.forget('game');
  D.send({ t: 'game.join', id: locked.id, pass: 'stillwater' });
  const dg = await D.wait('game');
  ok('the right password gets you in', !!(dg && dg.game && dg.game.id === locked.id));

  /* ---- leaving lands you back in the lobby ---- */
  B.forget('game'); B.forget('lobby');
  B.send({ t: 'game.leave' });
  const bg = await B.wait('game');
  ok('leaving a game clears it', !!bg && bg.game === null);
  const bl = await B.wait('lobby');
  ok('and lands you straight back in the lobby', !!bl && Array.isArray(bl.games), JSON.stringify(bl && Object.keys(bl)));
  ok('the game you left is still listed, with one fewer', bl.games.some(x => x.name === 'The Marrow'));

  /* ---- logging off closes a game once the last player is gone ---- */
  const before = live.games.size;
  D.s.close(); C.s.close();
  await wait(500);
  ok('logging off closes the game you were alone in', live.games.size < before, before + ' -> ' + live.games.size);
  ok('and it stops being listed', !lobby().some(x => x.name === 'Quiet Room'));

  function lobby() { return [...live.games.values()].filter(x => x.players.size).map(x => ({ name: x.name })); }

  /* ---- declare in town, level 9, once a minute, and a one-sided stand down ---- */
  A.forget('game');
  A.send({ t: 'game.leave' });
  await wait(200);
  A.forget('game');
  A.send({ t: 'game.create', name: 'Duel Yard', diff: 'normal' });
  const yard = await A.wait('game');
  ok('a yard for the declaration', !!(yard && yard.game && yard.game.name === 'Duel Yard'), JSON.stringify(yard && yard.game));
  B.forget('game');
  B.send({ t: 'game.join', id: yard.game.id });
  await B.wait('game');
  await wait(80);
  const lastSys = c => { const rows = c.seen.filter(m => m.t === 'sys'); return rows.length ? rows[rows.length - 1].text : ''; };
  A.seen.length = 0;
  place(A, 20, 1); place(B, 20, 1); await wait(100);
  A.send({ t: 'hostile', uid: uidOf(B) });
  await wait(150);
  ok('a declaration outside town is refused', /town/.test(lastSys(A)), lastSys(A));

  A.seen.length = 0;
  place(A, 8, 0); place(B, 20, 0); await wait(100);
  A.send({ t: 'hostile', uid: uidOf(B) });
  await wait(150);
  ok('hostility starts at level 9', /level 9/.test(lastSys(A)), lastSys(A));

  place(A, 9, 0); place(B, 9, 0); await wait(100);
  A.seen.length = 0; B.seen.length = 0;
  A.send({ t: 'hostile', uid: uidOf(B) });
  await wait(200);
  ok('a declaration in town is accepted', A.seen.some(m => m.t === 'hostile') && B.seen.some(m => m.t === 'hostile'));
  ok('the declaration says standing down stops only your swings', /Standing down in town stops only your own swings/.test(lastSys(A)), lastSys(A));

  const who = name => [...live.live.values()].find(p => p.name === name);
  const pa = who('Ines'), pb = who('Vale');
  A.send({ t: 'move', x: 1, y: 1, zi: 5, hp: 10, hpm: 10 });
  await wait(80);
  ok('the declarer cannot leave the district yet', pa.zi === 0, 'zi=' + pa.zi);

  A.seen.length = 0;
  A.send({ t: 'stand', uid: uidOf(B) });
  await wait(150);
  ok('standing down clears only your flag', !pa.hostile.has(pb.uid) && pb.hostile.has(pa.uid) && /still hit you/.test(lastSys(A)), lastSys(A));

  A.seen.length = 0;
  A.send({ t: 'hostile', uid: uidOf(B) });
  await wait(150);
  ok('a second declaration inside a minute is refused', /minute/.test(lastSys(A)), lastSys(A));

  pa.portalLock = 0;
  A.send({ t: 'move', x: 3, y: 3, zi: 5, hp: 10, hpm: 10 });
  B.send({ t: 'move', x: 3, y: 3, zi: 5, hp: 10, hpm: 10 });
  await wait(80);
  pa.safeUntil = 0; pb.safeUntil = 0;
  B.seen.length = 0;
  A.send({ t: 'pvp', uid: uidOf(B), dmg: 1000 });
  await wait(150);
  ok('after standing down you cannot damage them', !B.seen.some(m => m.t === 'pvp'));
  A.seen.length = 0;
  B.send({ t: 'pvp', uid: uidOf(A), dmg: 1000 });
  await wait(150);
  ok('after standing down they can still damage you', A.seen.some(m => m.t === 'pvp' && m.dmg > 0 && m.dmg < 1000), JSON.stringify(A.seen.filter(m => m.t === 'pvp')));

  A.s.close(); B.s.close(); for (const c of extra) c.s.close();
  await wait(400);
  ok('with everybody gone, no games remain', live.games.size === 0, String(live.games.size));

  console.log(out.join('\n'));
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  server.close();
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
