/* Two browsers, one server, a party and a fight.
   `node server/test/live.js` — needs Playwright and a build in dist/. */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'u2087-live-'));
process.env.DATA_DIR = tmp;
delete process.env.SMTP_HOST;

const { chromium } = require('playwright');
const { server } = require('../server');

let pass = 0, fail = 0; const out = [];
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

  ok('no page errors', errs.length === 0, errs.join(' | '));

  console.log(out.join('\n'));
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  await browser.close();
  server.close();
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
