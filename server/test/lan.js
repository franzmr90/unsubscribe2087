/* Home-network play. Two browsers join through a private address that is not localhost.
   `node server/test/lan.js` */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), http = require('http');
const { spawn } = require('child_process');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'u2087-lan-'));
const root = path.join(__dirname, '..', '..');

let pass = 0, fail = 0; const out = [];
const ok = (n, c, d) => { if (c) { pass++; out.push('  ok   ' + n); } else { fail++; out.push('  FAIL ' + n + (d ? '  <' + d + '>' : '')); } };

process.env.LAN = '1';
process.env.PORT = '8087';
delete process.env.PUBLIC_ORIGIN;
delete process.env.WS_REQUIRE_ORIGIN;
const lan = require('../lib/lan');
const { originOK } = require('../lib/origin');

ok('a house address counts as private', lan.privateIP('192.168.1.20') && lan.privateIP('::ffff:10.0.0.4') && lan.privateIP('172.30.0.2'));
ok('a public address does not', !lan.privateIP('8.8.8.8') && !lan.privateIP('203.0.113.9'));
ok('a page on the house address is accepted', originOK({ headers: { origin: 'http://192.168.1.20:8087' } }));
ok('a page on a public address is refused', !originOK({ headers: { origin: 'http://8.8.8.8:8087' } }));
ok('the same house address on the wrong port is refused', !originOK({ headers: { origin: 'http://192.168.1.20:9' } }));
delete process.env.LAN;

function post(host, port, local, pathname, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      host, port, localAddress: local, path: pathname, method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        let j = {}; try { j = JSON.parse(Buffer.concat(chunks).toString()); } catch (e) {}
        resolve({ status: res.statusCode, body: j });
      });
    });
    req.on('error', reject);
    req.end(data);
  });
}

function freePort() {
  return new Promise(r => {
    const s = http.createServer();
    s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => r(p)); });
  });
}

function start(port, extra) {
  const env = Object.assign({}, process.env, {
    LAN: '1', PORT: String(port), DATA_DIR: extra && extra.data || tmp,
    SMTP_HOST: '', DEBUG_HOOKS: '1'
  }, extra && extra.env || {});
  for (const k of ['GITHUB_TOKEN', 'TLS_KEY', 'TLS_CERT', 'INVITE_REQUIRED', 'INVITE_CODES', 'ALLOWLIST', 'BUG_WEBHOOK_URL', 'BUG_WEBHOOK_KEY', 'PUBLIC_ORIGIN']) delete env[k];
  if (extra && extra.keep) for (const k of extra.keep) env[k] = extra.env[k];
  const child = spawn(process.execPath, [path.join(root, 'server', 'server.js')], { cwd: root, env, stdio: ['ignore', 'pipe', 'pipe'] });
  let boot = '';
  child.stdout.on('data', d => { boot += d; });
  child.stderr.on('data', d => { boot += d; });
  const ready = new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('server did not start\n' + boot)), 8000);
    const on = () => { if (boot.includes('home network')) { clearTimeout(t); resolve(boot); } };
    child.stdout.on('data', on);
    child.stderr.on('data', on);
    child.on('exit', code => { clearTimeout(t); reject(new Error('server exited ' + code + '\n' + boot)); });
  });
  return { child, ready, log: () => boot };
}

(async () => {
  const port = await freePort();
  const srv = start(port);
  let boot = '';
  try { boot = await srv.ready; } catch (e) { console.error(e); process.exit(1); }
  const urls = boot.split('\n').map(s => s.trim()).filter(s => /^http:\/\/\d+\.\d+\.\d+\.\d+:/.test(s));
  ok('the banner prints a non-localhost address', urls.length > 0 && urls.every(u => !/127\.0\.0\.1|localhost/.test(u)), urls.join(' '));
  ok('the banner says reports are not sent to GitHub', /not sent to GitHub/.test(boot), boot.slice(0, 700));
  ok('plain http, no certificate', !/TLS on/.test(boot));
  const host = (urls[0] || '').replace(/^http:\/\//, '').replace(/:\d+$/, '');
  const base = 'http://' + host + ':' + port;

  const outside = await post(host, port, '203.0.113.9', '/api/register', { name: 'Outsider', pass: 'lan-tester-11' });
  ok('a public address cannot make an account', outside.status === 403, JSON.stringify(outside));
  const inside = await post(host, port, host, '/api/register', { name: 'House', pass: 'lan-tester-11' });
  ok('a private address can make an account with no invite code', inside.status === 200 && inside.body.user && inside.body.user.name === 'House', JSON.stringify(inside.body));

  const bug = await post(host, port, host, '/api/bug', { happened: 'The lantern in the hall went dark while we were walking.' });
  ok('a bug report is accepted without a token', bug.status === 200 && !!bug.body.id, JSON.stringify(bug.body));
  const saved = fs.existsSync(path.join(tmp, 'bugs', bug.body.id + '.json'));
  ok('the report is on disk and was not filed', saved && /no GitHub token/.test(srv.log()) && !/intake github/.test(srv.log()), srv.log().slice(-400));

  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  const errs = [];
  async function player(name) {
    const ctx = await browser.newContext({ viewport: { width: 1100, height: 800 } });
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message));
    await p.goto(base + '/');
    await p.waitForSelector('#accTag', { timeout: 8000 });
    await p.click('#accTag');
    await p.click('#accTabs button[data-m=up]');
    ok(name + ' is not asked for an invite code', await p.locator('#f_invite').count() === 0);
    await p.fill('#f_name', name);
    await p.fill('#f_pass', 'lan-tester-11');
    await p.click('#go');
    await p.waitForFunction(n => {
      const t = document.getElementById('accTag');
      return t && t.textContent === n;
    }, name, { timeout: 8000 });
    const where = await p.evaluate(() => location.hostname);
    ok(name + ' loaded the game from the house address', where === host && where !== 'localhost' && where !== '127.0.0.1', where);
    const end = Date.now() + 15000;
    let playing = false;
    while (Date.now() < end) {
      playing = await p.evaluate(() => {
        const disc = document.getElementById('disc');
        if (disc && !disc.hidden) disc.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
        const title = document.getElementById('title');
        const cls = document.querySelector('[data-cls=scrapper]');
        if (cls && title && !title.hidden) cls.click();
        const scene = document.getElementById('scene');
        if (scene && !scene.hidden) { const b = document.getElementById('scSkip'); if (b) b.click(); }
        const dlg = document.getElementById('dlg');
        if (dlg && !dlg.hidden) { const x = dlg.querySelector('#dBtns button:not([disabled])'); if (x) x.click(); }
        const hud = document.getElementById('hud');
        return !!(hud && !hud.hidden);
      });
      if (playing) break;
      await p.waitForTimeout(200);
    }
    ok(name + ' reached the game', playing);
    return p;
  }

  const ada = await player('Ada');
  const bea = await player('Bea');
  await ada.click('#bMenu');
  await ada.click('button[data-tab=party]');
  await ada.fill('#mpName', 'Kitchen table');
  await ada.click('[data-mpk="1"]');
  await ada.waitForFunction(() => /Just you so far|In the game/.test(document.body.innerText), null, { timeout: 8000 });
  await bea.click('#bMenu');
  await bea.click('button[data-tab=party]');
  await bea.waitForSelector('button[data-mpj]', { timeout: 8000 });
  const listed = await bea.locator('button[data-mpj]').innerText();
  ok('the second player sees the game on the house address', /Kitchen table/.test(listed), listed);
  await bea.click('button[data-mpj]');
  const joined = async (page, who) => {
    const end = Date.now() + 8000;
    let snap = null;
    while (Date.now() < end) {
      snap = await page.evaluate(name => {
        const mp = window.__mp;
        const roster = mp && mp.roster ? mp.roster.map(r => r.name) : [];
        return { game: mp && mp.MP && mp.MP.game && mp.MP.game.name, roster, on: !!(mp && mp.on) };
      }, who);
      if (snap.game === 'Kitchen table' && snap.roster.indexOf(who) >= 0) return snap;
      await page.waitForTimeout(200);
    }
    return snap;
  };
  const beaJoin = await joined(bea, 'Ada');
  const adaJoin = await joined(ada, 'Bea');
  ok('both browsers are in the same game', !!(beaJoin && adaJoin && beaJoin.game === 'Kitchen table' && adaJoin.game === 'Kitchen table' && beaJoin.roster.indexOf('Ada') >= 0 && adaJoin.roster.indexOf('Bea') >= 0), JSON.stringify({ beaJoin, adaJoin }));
  ok('no page errors', errs.length === 0, errs.slice(0, 3).join(' | '));

  const shot = process.env.LAN_SHOT || path.join(tmp, 'lan-join.png');
  await ada.screenshot({ path: shot });
  const shot2 = shot.replace(/\.png$/, '-bea.png');
  await bea.screenshot({ path: shot2 });

  await browser.close();
  srv.child.kill('SIGTERM');

  const inviteDir = fs.mkdtempSync(path.join(os.tmpdir(), 'u2087-lan-code-'));
  const port2 = await freePort();
  const gated = start(port2, { data: inviteDir, env: { LAN_INVITE: '1' }, keep: ['LAN_INVITE'] });
  const boot2 = await gated.ready;
  const code = (boot2.match(/Invite code \(everyone types this when they make an account\): ([a-z0-9]+)/) || [])[1];
  const host2 = (boot2.split('\n').map(s => s.trim()).find(s => /^http:\/\/\d+\.\d+\.\d+\.\d+:/.test(s)) || '').replace(/^http:\/\//, '').replace(/:\d+$/, '');
  ok('a shared code is printed when the gate is asked for', !!code, boot2.slice(0, 500));
  const noCode = await post(host2, port2, host2, '/api/register', { name: 'NoCode', pass: 'lan-tester-11' });
  ok('the shared code is required', noCode.status === 403, JSON.stringify(noCode));
  const withCode = await post(host2, port2, host2, '/api/register', { name: 'WithCode', pass: 'lan-tester-11', invite: code });
  ok('the printed code lets someone in', withCode.status === 200, JSON.stringify(withCode.body));
  gated.child.kill('SIGTERM');

  console.log(out.join('\n'));
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.rmSync(inviteDir, { recursive: true, force: true });
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
