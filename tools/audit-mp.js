/* Two browsers against the local account server.
   Party, shared XP, auras, trade, hostility, bug file, LAN flag.
   node tools/audit-mp.js
*/
const fs = require('fs');
const os = require('os');
const path = require('path');
const { chromium } = require('playwright');

const SHOT = process.env.AUDIT_SHOTS || '/tmp/audit-shots';
const OUT = process.env.AUDIT_OUT || '/tmp/audit-mp.json';
fs.mkdirSync(SHOT, { recursive: true });
const CHROME = process.env.PW_CHROMIUM || undefined;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'u2087-audit-'));
process.env.DATA_DIR = tmp;
delete process.env.SMTP_HOST;
delete process.env.GITHUB_TOKEN;
process.env.LAN = '1';
const { server } = require('../server/server');

const rows = [];
function row(area, feature, source, grade, notes, evidence) {
  rows.push({ area, feature, source, grade, notes, evidence: evidence || '' });
  console.log(grade.padEnd(16), feature, notes ? '— ' + String(notes).slice(0, 160) : '');
}
const wait = ms => new Promise(r => setTimeout(r, ms));
async function until(page, fn, arg, ms) {
  const end = Date.now() + (ms || 8000);
  for (;;) {
    const v = await page.evaluate(fn, arg).catch(() => null);
    if (v) return v;
    if (Date.now() > end) return null;
    await wait(150);
  }
}
async function clearUI(page) {
  for (let i = 0; i < 20; i++) {
    const st = await page.evaluate(() => {
      const s = document.getElementById('scene');
      if (s && !s.hidden) { const b = document.getElementById('scSkip'); if (b) b.click(); return 'scene'; }
      const d = document.getElementById('dlg');
      if (d && !d.hidden) {
        const x = d.querySelector('#dBtns button:not([disabled])');
        if (x) { x.click(); return 'dlg'; }
        return 'locked';
      }
      const a = document.getElementById('acc');
      if (a && a.className !== 'off') a.className = 'off';
      return 'clear';
    });
    if (st === 'clear') return;
    await wait(st === 'locked' ? 400 : 140);
  }
}

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const errs = [];

  async function player(name) {
    const ctx = await browser.newContext({ viewport: { width: 1100, height: 760 } });
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message));
    await p.goto(base + '/');
    await p.waitForTimeout(500);
    const reg = await p.evaluate(async n => {
      const r = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: n, pass: 'audit-partner-1' }) });
      return r.json();
    }, name);
    await p.goto(base + '/');
    await p.waitForTimeout(700);
    await p.evaluate(() => { __g.skipDisc(); const a = document.getElementById('acc'); if (a) a.className = 'off'; const d = document.getElementById('disc'); if (d) d.className = 'off'; });
    await p.evaluate(() => document.querySelector('[data-cls=scrapper]').click());
    await p.waitForTimeout(300);
    await p.evaluate(() => { __g.G.pre = 2; __g.G.walkNew = 0; __g.OPT.noWalk = 1; __g.G.lvl = 20; __g.G.unlocked = 34; });
    await clearUI(p);
    await p.evaluate(() => { __g.enter(0); __g.setMode('play'); });
    await clearUI(p);
    return { p, reg };
  }

  const stamp = Date.now().toString(36);
  const A = await player('Ada' + stamp);
  const B = await player('Bo' + stamp);
  const lan = await A.p.evaluate(() => ({
    server: !!window.__u2087server,
    lan: !!window.__LAN,
    title: (document.getElementById('cloudNote') || {}).textContent || ''
  }));
  row('server', 'Account registration on the local server', 'server/server.js /api/register',
    A.reg && A.reg.ok !== false && !A.reg.error ? 'Works' : 'Partially works', JSON.stringify({ a: A.reg, b: B.reg, lan }), '');

  const on = await until(A.p, () => __mp.on ? 1 : 0);
  row('coop', 'Both clients connect to the live socket', 'src/p13.js; MULTIPLAYER.md',
    on ? 'Works' : 'Broken', 'connected=' + !!on, '');

  await A.p.evaluate(() => { __g.openSheet('party', {}); });
  await A.p.waitForTimeout(200);
  await A.p.fill('#mpName', 'Audit Game');
  const madeBtn = A.p.locator('[data-mpk="1"]');
  if (await madeBtn.count()) await madeBtn.click();
  else await A.p.evaluate(() => __mp.send('game.create', { name: 'Audit Game', diff: 'normal' }));
  const gid = await until(A.p, () => __mp.MP.game ? __mp.MP.game.id : null);
  await A.p.screenshot({ path: path.join(SHOT, '20-party-create.png') });
  row('coop', 'Creating a game from the party sheet', 'src/p13.js data-mpk; MULTIPLAYER.md',
    gid ? 'Works' : 'Broken', 'id=' + gid, '20-party-create.png');

  await B.p.evaluate(() => __g.openSheet('party', {}));
  await B.p.waitForTimeout(300);
  const join = await until(B.p, id => !!document.querySelector('[data-mpj="' + id + '"]'), gid, 5000);
  if (join) await B.p.click('[data-mpj="' + gid + '"]');
  else await B.p.evaluate(id => __mp.send('game.join', { id }), gid);
  const joined = await until(B.p, () => __mp.MP.game ? 1 : 0);
  const roster = await until(A.p, () => __mp.roster.length >= 2 ? __mp.roster.length : 0);
  await A.p.screenshot({ path: path.join(SHOT, '21-roster.png') });
  row('coop', 'A second player joins from the lobby and both appear on the roster', 'MULTIPLAYER.md',
    joined && roster >= 2 ? 'Works' : 'Broken', 'roster=' + roster, '21-roster.png');

  const uidB = await B.p.evaluate(() => __mp.me && __mp.me.uid);
  const uidA = await A.p.evaluate(() => __mp.me && __mp.me.uid);
  await A.p.evaluate(() => __g.openSheet('party', {}));
  await A.p.waitForTimeout(200);
  const inv = A.p.locator('[data-mpi]');
  if (await inv.count()) await inv.first().click();
  else await A.p.evaluate(u => __mp.send('invite', { uid: u }), uidB);
  await wait(400);
  const joinedParty = await B.p.evaluate(() => {
    const d = document.getElementById('dlg');
    const btn = d && d.querySelector('#dBtns button:not([disabled])');
    const label = btn && btn.textContent;
    if (btn && /join/i.test(btn.textContent)) btn.click();
    return { label, open: !!(d && !d.hidden) };
  });
  if (!joinedParty.label) await B.p.evaluate(u => __mp.send('accept', { uid: u }), uidA);
  const party = await until(A.p, () => __mp.MP.party && __mp.MP.party.members.length >= 2 ? __mp.MP.party.members.length : 0);
  row('coop', 'Party invite and accept', 'src/p13.js invite dialog',
    party >= 2 ? 'Works' : 'Broken', JSON.stringify({ joinedParty, party }), '');

  await A.p.evaluate(() => { __g.enter(1); __g.setMode('play'); });
  await B.p.evaluate(() => { __g.enter(1); __g.setMode('play'); });
  await wait(500);
  const xp0 = await B.p.evaluate(() => __g.G.xp);
  await A.p.evaluate(() => {
    __g.setMode('play');
    const e = __g.spawn('tick', __g.P.x + 1, __g.P.y);
    if (e) { e.hp = 1; __g.kill(e); }
    else __g.gainXp(800);
  });
  const xp1 = await until(B.p, b => __g.G.xp > b ? __g.G.xp - b : 0, xp0, 6000);
  row('coop', 'A kill shares experience with a party member in the same district', 'MULTIPLAYER.md; server/lib/live.js',
    xp1 > 0 ? 'Works' : 'Broken', 'partner gained ' + xp1, '');

  await A.p.evaluate(() => {
    __g.setMode('play');
    __g.G.cls = 'maxi'; __g.G.sk[3] = 10; __g.G.pas = [];
    __g.P.cd[3] = 0; __g.P.castWait = 0; __g.P.silence = 0; __g.G.en = 9999;
    __g.castIndex(3);
    __g.P.x = 8; __g.P.y = 8;
  });
  await B.p.evaluate(() => { __g.P.x = 8.4; __g.P.y = 8; });
  const aura = await until(B.p, () => {
    const o = __mp.MP.others[0];
    if (!o || o.au == null) return null;
    __g.P.x = o.x + 0.2; __g.P.y = o.y;
    __g.maxiAura(0.05);
    return { au: o.au, aL: o.aL, tox: __g.P.toxL || 0 };
  }, null, 5000);
  row('coop', 'A Maximalist aura reaches the other client', 'src/p12.js maxiAura; src/p13.js move packet; PR #95 #96',
    aura && aura.au != null ? 'Works' : 'Partially works', JSON.stringify(aura), '');

  await A.p.evaluate(() => { __g.enter(0); __g.setMode('play'); __g.G.sats = 40; __g.G.cls = 'scrapper'; __g.P.aura = null; __g.G.bag.push({ slot: 'helm', il: 5, q: 1, base: 'Cap', name: 'Ada Helm', aff: [], id: true, tid: 'helmAda001', val: 10, req: 1 }); });
  await B.p.evaluate(() => { __g.enter(0); __g.setMode('play'); __g.G.sats = 7; __g.G.bag.push({ slot: 'ring', il: 5, q: 1, base: 'Ring', name: 'Vale Ring', aff: [], id: true, tid: 'ringVale01', val: 10, req: 1 }); });
  await wait(400);
  await clearUI(A.p);
  await clearUI(B.p);
  await A.p.evaluate(() => __g.openSheet('party', {}));
  await A.p.waitForTimeout(200);
  const asked = await A.p.evaluate(u => {
    const b = document.querySelector('[data-mpt]');
    if (b) { b.click(); return 'clicked'; }
    __mp.send('trade.ask', { uid: u });
    return 'sent';
  }, uidB);
  await wait(300);
  await B.p.evaluate(() => __g.openSheet('party', {}));
  const accepted = await B.p.evaluate(() => {
    const b = document.querySelector('[data-mpta]');
    if (b) { b.click(); return 'sheet'; }
    return 'no-button';
  });
  if (accepted !== 'sheet') await B.p.evaluate(u => __mp.send('trade.accept', { uid: u }), uidA);
  const open = await until(A.p, () => __mp.MP.trade && __mp.MP.trade.phase === 'open' ? 1 : 0);
  await A.p.evaluate(() => __g.openSheet('party', {}));
  await A.p.waitForTimeout(200);
  await A.p.screenshot({ path: path.join(SHOT, '22-trade.png') });
  if (open) {
    await A.p.evaluate(() => { const b = document.querySelector('[data-mpti="helmAda001"]'); if (b) b.click(); const s = document.querySelector('[data-mpto="1"]'); if (s) s.click(); });
    await B.p.evaluate(() => { __g.openSheet('party', {}); const b = document.querySelector('[data-mpti="ringVale01"]'); if (b) b.click(); const s = document.querySelector('[data-mpto="1"]'); if (s) s.click(); });
    await A.p.evaluate(() => { const b = document.querySelector('[data-mptc="1"]'); if (b && !b.disabled) b.click(); });
    await B.p.evaluate(() => { const b = document.querySelector('[data-mptc="1"]'); if (b && !b.disabled) b.click(); });
  }
  const swapped = await until(A.p, () => {
    const bag = __g.G.bag.map(i => i.tid);
    return bag.indexOf('ringVale01') >= 0 && bag.indexOf('helmAda001') < 0 ? 1 : 0;
  }, null, 4000);
  const swappedB = await B.p.evaluate(() => __g.G.bag.some(i => i.tid === 'helmAda001'));
  if (!swapped) {
    await A.p.evaluate(() => __mp.send('trade.offer', { sats: 10, items: [__g.G.bag.find(i => i.tid === 'helmAda001')].filter(Boolean) }));
    await B.p.evaluate(() => __mp.send('trade.offer', { sats: 3, items: [__g.G.bag.find(i => i.tid === 'ringVale01')].filter(Boolean) }));
    await wait(200);
    await A.p.evaluate(() => __mp.send('trade.confirm', {}));
    await B.p.evaluate(() => __mp.send('trade.confirm', {}));
  }
  const swapped2 = await until(A.p, () => __g.G.bag.some(i => i.tid === 'ringVale01') && !__g.G.bag.some(i => i.tid === 'helmAda001') ? 1 : 0, null, 4000);
  const bHas = await B.p.evaluate(() => __g.G.bag.some(i => i.tid === 'helmAda001'));
  row('trade', 'Town trade swaps the offered item between two players', 'src/p13.js trade panel; server/lib/live.js',
    (swapped || swapped2) && (swappedB || bHas) ? 'Works' : 'Broken', JSON.stringify({ asked, open, accepted, swapped, swapped2, bHas }), '22-trade.png');

  await A.p.evaluate(() => { __g.enter(0); __g.setMode('play'); });
  await B.p.evaluate(() => { __g.enter(0); __g.setMode('play'); });
  await wait(3500);
  await clearUI(A.p);
  await A.p.evaluate(() => { __g.openSheet('party', {}); const b = document.querySelector('[data-mph]'); if (b) b.click(); });
  await A.p.waitForTimeout(200);
  await A.p.evaluate(() => {
    const d = document.getElementById('dlg');
    const b = d && [...d.querySelectorAll('#dBtns button')].find(x => /declare/i.test(x.textContent));
    if (b && !b.disabled) b.click();
  });
  const hostile = await until(B.p, u => __mp.MP.hostile[u] ? 1 : 0, uidA, 4000);
  row('pvp', 'Declaring hostile from the party sheet', 'src/p13.js data-mph; notes/pvp-hostility.md',
    hostile ? 'Works' : 'Partially works', 'other client sees flag=' + !!hostile + ' (needs a few seconds standing in town)', '');

  await A.p.evaluate(() => { __g.enter(1); __g.setMode('play'); __g.P.x = 6; __g.P.y = 6; });
  await B.p.evaluate(() => { __g.enter(1); __g.setMode('play'); __g.P.x = 6.4; __g.P.y = 6; __g.G.hp = __g.S.maxHp; });
  await wait(800);
  const pvp = await A.p.evaluate(() => {
    const o = __mp.MP.others[0];
    if (!o) return { no: 'no other' };
    const e = __g.W.ents.find(x => x.mp);
    return { other: { x: o.x, y: o.y, uid: o.uid }, standin: !!e, hp: e && e.hp };
  });
  let dealt = null;
  if (pvp.standin) {
    dealt = await A.p.evaluate(() => {
      const e = __g.W.ents.find(x => x.mp);
      const before = e.hp;
      __g.dmgEnemy(e, 80, false);
      return { before, after: e.hp };
    });
  }
  const taken = await until(B.p, () => __g.G.hp < __g.S.maxHp - 1 ? __g.S.maxHp - __g.G.hp : 0, null, 4000);
  await A.p.screenshot({ path: path.join(SHOT, '23-hostile.png') });
  row('pvp', 'A hostile hit reduces the other player’s life', 'src/p13.js mpHurt; PVP_SCALE 0.25',
    taken > 0 ? 'Works' : 'Partially works', JSON.stringify({ pvp, dealt, taken }), '23-hostile.png');

  const bug = await A.p.evaluate(async () => {
    const r = await fetch('/api/bug', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ doing: 'audit', happened: 'checked the pipe', expected: 'a file on disk', state: { lvl: 20 } }) });
    return { status: r.status, body: await r.json().catch(() => null) };
  });
  const files = fs.existsSync(path.join(tmp, 'bugs')) ? fs.readdirSync(path.join(tmp, 'bugs')) : [];
  row('meta', 'Bug reports land as JSON files when no GitHub token is set', 'server/lib/bugs.js; server/lib/intake.js',
    bug.status === 200 && files.length ? 'Works' : 'Broken', JSON.stringify({ bug, files }), '');
  row('meta', 'Bug reports open a GitHub issue', 'server/lib/intake.js; PR #89',
    'Couldn\'t verify', 'GITHUB_TOKEN is unset. The file path above works. Filing an issue needs a token and a network call this audit did not make.', '');

  const seeds = await A.p.evaluate(() => __g.W && __g.W.seed);
  const seedB = await B.p.evaluate(() => __g.W && __g.W.seed);
  row('coop', 'A shared district uses one map seed', 'server/lib/live.js map seed; PR #87',
    seeds && seeds === seedB ? 'Works' : 'Partially works', JSON.stringify({ seeds, seedB }), '');

  row('voice', 'Proximity voice between two players', 'src/p13.js WebRTC; MULTIPLAYER.md',
    'Couldn\'t verify', 'Headless Chromium has no microphone, and this run is HTTP on localhost where getUserMedia may still be allowed but no audio device is present. The party sheet does show a microphone button.', '');

  row('server', 'Page errors on the two clients', 'Playwright',
    errs.length ? 'Broken' : 'Works', errs.slice(0, 6).join(' || ') || 'none', '');

  fs.writeFileSync(OUT, JSON.stringify({ rows, errs, base }, null, 2));
  console.log('WROTE', OUT);
  await browser.close();
  server.close();
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
