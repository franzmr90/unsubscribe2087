/* Two browsers, one server, a party and a fight.
   `node server/test/live.js` — needs Playwright and a build in dist/. */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), net = require('net'), { spawn } = require('child_process');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'u2087-live-'));
process.env.DATA_DIR = tmp;
delete process.env.SMTP_HOST;

const { chromium } = require('playwright');
const { server } = require('../server');

let pass = 0, fail = 0, child = null; const out = [];
const ok = (n, c, d) => { if (c) { pass++; out.push('  ok   ' + n); } else { fail++; out.push('  FAIL ' + n + (d ? '  <' + d + '>' : '')); } };
const wait = ms => new Promise(r => setTimeout(r, ms));

/* Poll until a condition in the page holds, so the tests do not race the network. */
async function until(page, fn, arg, ms) {
  const end = Date.now() + (ms || 6000);
  for (;;) {
    const v = await page.evaluate(fn, arg).catch(() => null);
    if (v) return v;
    if (Date.now() > end) return null;
    await wait(120);
  }
}

(async () => {
  await new Promise(r => server.listen(0, r));
  const base = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch();
  const errs = [];

  async function player(name) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } });
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message));
    await p.goto(base + '/');
    await p.waitForTimeout(700);
    await p.evaluate(n => fetch('/api/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: n, pass: 'duelling-partner-1' })
    }).then(r => r.json()), name);
    await p.goto(base + '/');                 /* reload so the shim picks up the session */
    await p.waitForTimeout(900);
    await p.evaluate(() => __g.skipDisc());
    await p.waitForTimeout(260);
    await p.click('[data-cls=scrapper]');
    await p.waitForTimeout(900);
    for (let i = 0; i < 14; i++) {
      await p.evaluate(() => {
        const s = document.getElementById('scene'); if (s && !s.hidden) document.getElementById('scSkip').click();
        const d = document.getElementById('dlg'); if (d && !d.hidden) { const x = d.querySelector('#dBtns button:not([disabled])'); x && x.click(); }
        const a = document.getElementById('acc'); if (a) a.className = 'off';
      });
      await p.waitForTimeout(140);
    }
    await p.evaluate(() => { __g.G.god = false; __g.G.lvl = 20; __g.G.unlocked = 34; });
    return p;
  }

  const A = await player('Ines');
  const B = await player('Vale');

  /* ---- the lobby, then a game ---- */
  const sawLobby = await until(A, () => __mp.on ? 1 : 0);
  ok('connected and in the lobby', !!sawLobby);

  await A.evaluate(() => __mp.send('game.create', { name: 'Test Game', diff: 'normal' }));
  const made = await until(A, () => __mp.MP.game ? __mp.MP.game.id : null);
  ok('a game can be made', !!made, String(made));

  await B.evaluate(id => __mp.send('game.join', { id }), made);
  const joined = await until(B, () => __mp.MP.game ? 1 : 0);
  ok('and joined', !!joined);

  /* ---- presence, inside that game ---- */
  const connected = await until(A, () => __mp.roster.length >= 2 ? __mp.roster.length : 0);
  ok('both players appear in the roster', connected >= 2, 'roster=' + connected);

  const scaled = await until(A, () => __mp.scale && __mp.scale.players === 2 ? __mp.scale.hp : 0);
  ok('two players make monsters tougher', scaled === 1.5, 'hp x' + scaled);
  const hpMul = await A.evaluate(() => __mp.mpHp());
  ok('the scaling reaches the combat maths', hpMul === 1.5, 'mpHp=' + hpMul);

  const uidB = await B.evaluate(() => __mp.me && __mp.me.uid);
  const uidA = await A.evaluate(() => __mp.me && __mp.me.uid);
  ok('each player knows who it is', !!uidA && !!uidB && uidA !== uidB);

  /* ---- party ---- */
  await A.evaluate(u => __mp.send('invite', { uid: u }), uidB);
  const invited = await until(B, () => !!__mp.MP.invite);
  ok('the invitation arrives', !!invited);

  await B.evaluate(u => __mp.send('accept', { uid: u }), uidA);
  const partied = await until(A, () => __mp.MP.party && __mp.MP.party.members.length === 2 ? 1 : 0);
  ok('the party forms', !!partied);
  const bParty = await until(B, () => __mp.MP.party && __mp.MP.party.members.length === 2 ? 1 : 0);
  ok('both sides see the party', !!bParty);

  /* ---- shared experience, in the same district only ---- */
  await A.evaluate(() => __g.enter(1));
  await B.evaluate(() => __g.enter(1));
  await wait(700);
  await A.evaluate(() => { for (let i = 0; i < 20; i++) __g.update(1 / 60); });
  await B.evaluate(() => { for (let i = 0; i < 20; i++) __g.update(1 / 60); });
  await wait(500);

  const xpBefore = await B.evaluate(() => __g.G.xp);
  await A.evaluate(() => __g.gainXp(1000));
  const xpGot = await until(B, b => __g.G.xp > b ? __g.G.xp - b : 0, xpBefore);
  ok('a kill shares experience with the party', xpGot > 0, 'gained ' + xpGot);

  /* ---- seeing each other ---- */
  const sees = await until(A, () => __mp.MP.others.length);
  ok('party members are visible in the district', sees >= 1, 'others=' + sees);

  /* A cast is a picture on the other client. It is not a hit. */
  const want = await B.evaluate(() => __g.skvOf('scrapper', 0));
  await A.evaluate(() => __mp.send('hello', { lvl: __g.G.lvl, cls: __g.G.cls, zi: __g.W.zi, hp: __g.G.hp, hpm: __g.S.maxHp }));
  await wait(250);
  await A.evaluate(() => {
    /* A district dialog can be sitting open. A cast only leaves the hand in play. */
    __g.setMode('play');
    const G = __g.G, P = __g.P;
    G.sk[0] = 1; G.slots[0] = 0; G.en = 99999;
    P.cd[0] = 0; P.castWait = 0; P.silence = 0; P.dash = null;
    __g.cast(0);
  });
  const far = await until(B, () => __mp.MP.lastCast && __mp.MP.lastCast.n ? __mp.MP.lastCast : null);
  ok('the other client plays one cast', !!far && far.n === 1 && far.k === want.k && far.col === want.col, JSON.stringify(far));

  /* ---- hostility ---- */
  await A.evaluate(u => { __mp.MP.hostile[u] = 1; __mp.send('hostile', { uid: u }); }, uidB);
  const bKnows = await until(B, u => __mp.MP.hostile[u] ? 1 : 0, uidA);
  ok('hostility reaches the other player', !!bKnows);
  const partyGone = await until(A, () => !__mp.MP.party ? 1 : 0);
  ok('declaring throws you out of the party', !!partyGone);

  /* ---- a hostile becomes a target the game can aim at ---- */
  await A.evaluate(() => { const o = __mp.MP.others[0]; if (o) { __g.P.x = o.x + .4; __g.P.y = o.y; } });
  await wait(400);
  const stand = await until(A, () => __g.W.ents.filter(e => e.mp).length);
  ok('a stand-in enters the world so skills can find it', stand >= 1, 'stand-ins=' + stand);

  /* Walking into a district buys five seconds of grace, so a hostile cannot camp the
     doorway. Wait it out before trying to land a hit. */
  await wait(5200);
  const hpBefore = await B.evaluate(() => __g.G.hp);
  await A.evaluate(() => { const e = __g.W.ents.find(x => x.mp); if (e) __g.dmgEnemy(e, 400, false); });
  const hurt = await until(B, h => __g.G.hp < h ? h - __g.G.hp : 0, hpBefore);
  ok('damage crosses between players', hurt > 0, 'took ' + hurt);
  ok('damage between players is scaled down', hurt > 0 && hurt < 400, 'took ' + hurt + ' of 400');

  /* ---- town is safe ---- */
  await B.evaluate(() => __g.enter(0));
  await wait(600);
  const townHp = await B.evaluate(() => __g.G.hp);
  await A.evaluate(() => __mp.send('pvp', { uid: __mp.MP.others.length ? __mp.MP.others[0].uid : 'x', dmg: 9999 }));
  await wait(500);
  const townHp2 = await B.evaluate(() => __g.G.hp);
  ok('nobody can be hit in town', townHp2 >= townHp, townHp + ' -> ' + townHp2);

  /* ---- chat ---- */
  await B.evaluate(() => __mp.send('chat', { text: 'credits rot' }));
  const heard = await until(A, () => __mp.MP.chat.some(c => c.text === 'credits rot') ? 1 : 0);
  ok('chat reaches the other player', !!heard);

  /* ---- hostility does not come back ---- */
  await A.evaluate(u => __mp.send('invite', { uid: u }), uidB);
  await wait(500);
  const reinvited = await B.evaluate(() => !!__mp.MP.invite);
  ok('you cannot party with someone you declared against', !reinvited);

  /* ---- leaving puts you back in the lobby ---- */
  await B.evaluate(() => __mp.send('game.leave', {}));
  const back = await until(B, () => !__mp.MP.game && __mp.MP.lobby ? 1 : 0);
  ok('leaving a game lands you back in the lobby', !!back);
  const gone = await until(A, () => __mp.roster.length === 1 ? 1 : 0);
  ok('the game you left carries on without you', !!gone);
  const solo = await A.evaluate(() => __mp.mpHp());
  ok('and the difficulty drops back', solo === 1, 'mpHp=' + solo);

  /* ---- friends: pending hides the game, mutual friends see class and level ---- */
  await B.evaluate(() => __mp.send('game.create', { name: 'Quiet Table', diff: 'normal' }));
  const quiet = await until(B, () => __mp.MP.game && __mp.MP.game.name === 'Quiet Table' ? 1 : 0);
  ok('a second game can be made', !!quiet);

  async function post(page, path, body) {
    return page.evaluate(async ({ path, body }) => {
      const me = await fetch('/api/me').then(r => r.json());
      const r = await fetch(path, {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'X-CSRF': me.csrf || '' },
        body: JSON.stringify(body || {})
      });
      const text = await r.text();
      let json = null; try { json = JSON.parse(text); } catch (e) {}
      return { status: r.status, text, json };
    }, { path, body });
  }

  const asked = await post(A, '/api/friend/ask', { name: 'Vale' });
  ok('the ask is only an ok', asked.status === 200 && asked.text.indexOf('hero') < 0 && !asked.text.includes('notify'), asked.text);
  const heardAsk = await until(B, () => __mp.MP.chat.some(c => c.text === 'Ines asked to be your friend.') ? 1 : 0);
  ok('a pending request is one line to its subject', !!heardAsk);
  await A.evaluate(() => __mp.loadFriends());
  const aPend = await until(A, u => {
    const row = __mp.MP.friends[u];
    return row && row.state === 'pending' && !row.gameName ? 1 : 0;
  }, uidB);
  ok('the asker sees a pending name and not the game', !!aPend);
  const bIn = await until(B, u => {
    const row = __mp.MP.friends[u];
    return row && row.state === 'in' && !row.gameName ? 1 : 0;
  }, uidA);
  ok('the asked sees the name and not the game', !!bIn);

  await A.evaluate(() => { const d = document.getElementById('dlg'); if (d) d.hidden = true; __g.setMode('play'); __g.openSheet('party'); });
  await B.evaluate(() => { const d = document.getElementById('dlg'); if (d) d.hidden = true; __g.setMode('play'); __g.openSheet('party'); });
  const pendA = await A.evaluate(() => document.getElementById('sheetIn').innerText);
  const pendB = await B.evaluate(() => document.getElementById('sheetIn').innerText);
  ok('the party sheet says the ask is waiting', /Vale/.test(pendA) && /Asked\. Waiting/.test(pendA) && !/Quiet Table/.test(pendA), pendA.slice(0, 240));
  ok('and the other sheet does not name the game', /Ines/.test(pendB) && /Asked to be your friend/.test(pendB) && !/Test Game/.test(pendB), pendB.slice(0, 240));

  const accepted = await post(B, '/api/friend/answer', { name: 'Ines', accept: true });
  ok('the answer is accepted', accepted.status === 200, accepted.text);
  await A.evaluate(() => __mp.send('hello', { lvl: __g.G.lvl, cls: __g.G.cls, zi: __g.W.zi, hp: __g.G.hp, hpm: __g.S.maxHp }));
  await B.evaluate(() => __mp.send('hello', { lvl: __g.G.lvl, cls: __g.G.cls, zi: __g.W.zi, hp: __g.G.hp, hpm: __g.S.maxHp }));
  const aSees = await until(A, u => {
    const row = __mp.MP.friends[u];
    return row && row.state === 'friend' && row.cls === 'scrapper' && row.lvl === 20 && row.gameName === 'Quiet Table' ? 1 : 0;
  }, uidB);
  const bSees = await until(B, u => {
    const row = __mp.MP.friends[u];
    return row && row.state === 'friend' && row.cls === 'scrapper' && row.lvl === 20 && row.gameName === 'Test Game' ? 1 : 0;
  }, uidA);
  ok('each friend sees the other\'s class and level', !!aSees && !!bSees);

  await A.evaluate(() => { const d = document.getElementById('dlg'); if (d) d.hidden = true; __g.setMode('play'); __g.openSheet('party'); });
  await A.waitForTimeout(400);
  const shown = await A.evaluate(() => document.getElementById('sheetIn').innerText);
  ok('the party sheet shows the friend', /Vale/.test(shown) && /Level 20/.test(shown) && /Scrapper/.test(shown) && /Quiet Table/.test(shown), shown.slice(0, 400));
  try {
    const shot = '/opt/cursor/artifacts/friends-party-sheet.png';
    fs.mkdirSync(path.dirname(shot), { recursive: true });
    await A.screenshot({ path: shot });
  } catch (e) { ok('friends sheet screenshot', false, e.message); }

  const face = await A.evaluate(() => JSON.stringify(__mp.MP.lastFriend || {}));
  const faceKeys = await A.evaluate(() => Object.keys(__mp.MP.lastFriend || {}).filter(k => k !== 't').sort().join(','));
  ok('presence carries no document id', faceKeys === 'cls,gameName,lvl,name,online,uid' && !/hero\d/.test(face), faceKeys + ' ' + face);

  const { docs } = require('../lib/store');
  docs.set(uidB, 'hero1', { s: '{"lvl":9}' });
  const listText = (await post(A, '/api/friend/list', {})).text;
  ok('a friend response contains no document id', !/hero\d/.test(listText) && listText.indexOf('"lvl":9') < 0, listText.slice(0, 300));
  let listJson = {}; try { listJson = JSON.parse(listText); } catch (e) {}
  const rowKeys = Object.keys(listJson.to || {}).map(id => Object.keys(listJson.to[id]).sort().join(',')).join('|');
  ok('friend rows are name, at and state', !!rowKeys && rowKeys.split('|').every(k => k === 'at,name,state'), rowKeys);
  const got = await post(A, '/api/doc/get', { id: 'hero1' });
  ok('a document id learned beside a friend still fails', got.json && got.json.exists === false, JSON.stringify(got.json));

  /* ---- a game that has fallen off the newest 60 is still joined by the friend's uid ---- */
  await A.evaluate(() => __mp.send('game.leave', {}));
  ok('leaving before the join', !!(await until(A, () => !__mp.MP.game ? 1 : 0)));
  const liveMod = require('../lib/live');
  for (let i = 0; i < 60; i++) {
    liveMod.games.set('gfake' + i, {
      id: 'gfake' + i, name: 'Phantom ' + i, diff: 'normal', host: 'phantom' + i,
      pass: '', players: new Set(['phantom' + i]), created: Date.now() + 10000 + i
    });
  }
  await A.evaluate(() => __mp.send('game.list', {}));
  const buried = await until(A, () => {
    const names = (__mp.MP.lobby || []).map(g => g.name);
    return names.length >= 60 && names.indexOf('Quiet Table') < 0 ? 1 : 0;
  });
  ok('the friend\'s game can fall off the lobby', !!buried);
  await A.evaluate(u => __mp.send('game.join', { uid: u }), uidB);
  const found = await until(A, () => __mp.MP.game && __mp.MP.game.name === 'Quiet Table' ? 1 : 0);
  ok('joining that friend by id still works', !!found);
  for (let i = 0; i < 60; i++) liveMod.games.delete('gfake' + i);

  /* ---- restart the process: the friendship is on disk, the game is not ----
     The original server stays up until the browsers leave it. Closing it first
     would wait on their sockets. The child is a second process on the same
     data directory and a different port, with an empty game table. */
  const port = await new Promise(resolve => {
    const s = net.createServer();
    s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => resolve(p)); });
  });
  child = spawn(process.execPath, [path.join(__dirname, '..', 'server.js')], {
    cwd: path.join(__dirname, '..', '..'),
    env: Object.assign({}, process.env, { DATA_DIR: tmp, PORT: String(port), SMTP_HOST: '' }),
    stdio: ['ignore', 'pipe', 'pipe']
  });
  let boot = '';
  await new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('child server did not start\n' + boot)), 12000);
    const on = d => { boot += d; if (boot.includes('server on')) { clearTimeout(t); resolve(); } };
    child.stdout.on('data', on);
    child.stderr.on('data', on);
    child.on('exit', code => { clearTimeout(t); reject(new Error('child exited ' + code + '\n' + boot)); });
  });
  const base2 = 'http://127.0.0.1:' + port;
  async function revive(page) {
    await page.goto(base2 + '/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(700);
    await page.evaluate(() => { __g.skipDisc(); const a = document.getElementById('acc'); if (a) a.className = 'off'; __g.newGame('scrapper'); });
    for (let i = 0; i < 24; i++) {
      await page.evaluate(() => {
        const s = document.getElementById('scene'); if (s && !s.hidden) { const b = document.getElementById('scSkip'); b && b.click(); }
        const d = document.getElementById('dlg'); if (d && !d.hidden) { const x = d.querySelector('#dBtns button:not([disabled])'); x && x.click(); }
        const a = document.getElementById('acc'); if (a) a.className = 'off';
      });
      await page.waitForTimeout(120);
    }
    return until(page, () => __mp.on ? 1 : 0, null, 8000);
  }
  ok('both reconnect after the restart', !!(await revive(A)) && !!(await revive(B)));
  ok('the game they were in is gone', !(await A.evaluate(() => __mp.MP.game)) && !(await B.evaluate(() => __mp.MP.game)));
  const stillA = await until(A, u => __mp.MP.friends[u] && __mp.MP.friends[u].state === 'friend' ? 1 : 0, uidB, 8000);
  const stillB = await until(B, u => __mp.MP.friends[u] && __mp.MP.friends[u].state === 'friend' ? 1 : 0, uidA, 8000);
  ok('the friendship is still there', !!stillA && !!stillB);

  await A.evaluate(() => __mp.send('game.create', { name: 'After', diff: 'normal' }));
  const after = await until(A, () => __mp.MP.game && __mp.MP.game.id);
  await B.evaluate(id => __mp.send('game.join', { id }), after);
  ok('they can share a game again', !!(await until(B, () => __mp.roster.length >= 2 ? 1 : 0)));
  const blocked = await post(A, '/api/friend/block', { name: 'Vale' });
  ok('the block is accepted', blocked.status === 200, blocked.text);
  await A.evaluate(() => { __mp.MP.invite = null; });
  await B.evaluate(u => { __mp.MP.invite = null; __mp.send('invite', { uid: u }); }, uidA);
  await wait(700);
  ok('a blocked invite does not arrive', !(await A.evaluate(() => !!__mp.MP.invite)));
  ok('and the block is not mentioned', !(await B.evaluate(() => (__mp.MP.chat || []).some(c => /block/i.test(c.text || '')))));

  ok('no page errors', errs.length === 0, errs.join(' | '));

  console.log(out.join('\n'));
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  if (child) child.kill('SIGTERM');
  await browser.close();
  try { server.close(); } catch (e) {}
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); if (child) child.kill('SIGTERM'); process.exit(1); });
