/* Everyone has their own account, and the accounts outlive the server.
   `node server/test/accounts.js` — the last part needs Playwright and a build in dist/.

   Three server processes in a row, the way a home game is actually run: one made by an
   older kit that kept its saves next to the launcher, then a newer kit that keeps them in
   a folder of its own and finds the old ones, then a restart of that. */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), net = require('net');
const { spawn } = require('child_process');
const root = path.join(__dirname, '..', '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'u2087-accounts-'));
const OLD = path.join(tmp, 'kit-1', 'saves');
const HOME = path.join(tmp, 'home', 'Unsubscribe 2087 saves');

let pass = 0, fail = 0; const out = [];
const ok = (n, c, d) => { if (c) { pass++; out.push('  ok   ' + n); } else { fail++; out.push('  FAIL ' + n + (d ? '  <' + d + '>' : '')); } };
/* Shaped like the game's own slot document, so the save check reads it as a hero. */
const hero = (who, lvl) => ({ s: JSON.stringify({ G: { cls: 'scrapper', lvl, who } }), lv: lvl, cl: 'scrapper', t: Date.now() });
const whose = r => { try { return JSON.parse(r.body.data.s).G.who; } catch (e) { return null; } };
const wait = ms => new Promise(r => setTimeout(r, ms));

function freePort() {
  return new Promise(r => { const s = net.createServer(); s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => r(p)); }); });
}

async function boot(env) {
  const port = await freePort();
  const e = Object.assign({}, process.env, { LAN: '1', PORT: String(port) }, env);
  for (const k of ['SMTP_HOST', 'GITHUB_TOKEN', 'PUBLIC_ORIGIN', 'INVITE_REQUIRED', 'INVITE_CODES', 'ALLOWLIST']) delete e[k];
  if (!env.DATA_FROM) delete e.DATA_FROM;
  const child = spawn(process.execPath, [path.join(root, 'server', 'server.js')], { env: e, stdio: ['ignore', 'pipe', 'pipe'] });
  let log = '';
  child.stdout.on('data', d => { log += d; });
  child.stderr.on('data', d => { log += d; });
  const end = Date.now() + 8000;
  while (!/Leave this window open[\s\S]*\n\n/.test(log)) {
    if (Date.now() > end) throw new Error('server did not start:\n' + log);
    await wait(50);
  }
  await wait(150);
  return { base: 'http://127.0.0.1:' + port, child, log: () => log, stop: () => new Promise(r => { child.on('exit', r); child.kill(); }) };
}

/* One person's browser: a cookie jar and the CSRF token that goes with it. */
function person(base) {
  let cookie = '', csrf = '';
  return async function call(p, body) {
    const headers = { 'Content-Type': 'application/json' };
    if (cookie) headers.Cookie = cookie;
    if (csrf) headers['X-CSRF'] = csrf;
    const r = await fetch(base + p, { method: body === undefined ? 'GET' : 'POST', headers, body: body === undefined ? undefined : JSON.stringify(body) });
    for (const c of (r.headers.getSetCookie ? r.headers.getSetCookie() : [])) if (/^u2087=/.test(c)) cookie = c.split(';')[0];
    const text = await r.text();
    let j = {}; try { j = JSON.parse(text); } catch (e) { j = { text }; }
    if (j.csrf) csrf = j.csrf;
    return { status: r.status, body: j };
  };
}

(async () => {
  /* ---- the older kit: saves next to the launcher ---- */
  let s = await boot({ DATA_DIR: OLD });
  const ann = person(s.base), bob = person(s.base);
  let r = await ann('/api/me');
  ok('a home game says an account is required', r.body.accountRequired === true, JSON.stringify(r.body));
  r = await ann('/api/doc/set', { id: 'main', data: { s: 'nobody' } });
  ok('no saving without an account', r.status === 401 || r.status === 403, r.status);
  r = await ann('/api/register', { name: 'Ann', pass: 'ann-password-1' });
  ok('Ann makes an account', r.status === 200, JSON.stringify(r.body));
  const annId = r.body.user && r.body.user.id;
  r = await bob('/api/register', { name: 'Bob', pass: 'bob-password-1' });
  ok('Bob makes his own', r.status === 200, JSON.stringify(r.body));
  for (let n = 0; n < 3; n++) {
    await ann('/api/doc/set', { id: 'main' + (n || ''), data: hero('ann-hero-' + n, 10 + n) });
    await bob('/api/doc/set', { id: 'main' + (n || ''), data: hero('bob-hero-' + n, 20 + n) });
  }
  r = await ann('/api/doc/get', { id: 'main1' });
  ok('Ann reads her own slot 2', whose(r) === 'ann-hero-1', JSON.stringify(r.body));
  r = await bob('/api/doc/get', { id: 'main1' });
  ok('Bob reads his own slot 2, not hers', whose(r) === 'bob-hero-1', JSON.stringify(r.body));
  r = await ann('/');
  ok('the page names who is signed in', (r.body.text || '').indexOf('window.__u2087uid=' + JSON.stringify(annId)) > 0);
  r = await person(s.base)('/');
  ok('and names nobody when nobody is', (r.body.text || '').indexOf('__u2087uid') < 0);
  await s.stop();

  const stored = fs.readFileSync(path.join(OLD, 'users.json'), 'utf8');
  ok('passwords are not stored as typed', stored.indexOf('ann-password-1') < 0 && stored.indexOf('bob-password-1') < 0 && /"hash"/.test(stored));

  /* ---- a newer kit: saves in the home folder, and it finds the old ones ---- */
  s = await boot({ DATA_DIR: HOME, DATA_FROM: OLD });
  ok('the new kit copies the old saves across', /Moved the saves from/.test(s.log()), s.log());
  ok('and says how many accounts it loaded', /Saves: .*Unsubscribe 2087 saves \(2 accounts loaded\)/.test(s.log()), s.log());
  ok('the old folder is left as it was', fs.existsSync(path.join(OLD, 'users.json')));
  let a2 = person(s.base);
  r = await a2('/api/login', { name: 'ann', pass: 'ann-password-1' });
  ok('Ann signs in on the new kit', r.status === 200, JSON.stringify(r.body));
  r = await a2('/api/doc/get', { id: 'main2' });
  ok('her third character came along', whose(r) === 'ann-hero-2', JSON.stringify(r.body));
  r = await person(s.base)('/api/login', { name: 'Ann', pass: 'bob-password-1' });
  ok('the wrong password is still wrong', r.status === 401);
  await a2('/api/doc/set', { id: 'main', data: hero('ann-hero-0-later', 11) });
  await s.stop();

  /* ---- a restart: same folder, nothing copied again ---- */
  fs.writeFileSync(path.join(OLD, 'users.json'), '{}');
  s = await boot({ DATA_DIR: HOME, DATA_FROM: OLD });
  ok('a restart does not copy over a folder that has accounts', !/Moved the saves/.test(s.log()) && /\(2 accounts loaded\)/.test(s.log()), s.log());
  a2 = person(s.base);
  await a2('/api/login', { name: 'Ann', pass: 'ann-password-1' });
  r = await a2('/api/doc/get', { id: 'main' });
  ok('what Ann saved last time is there after the restart', whose(r) === 'ann-hero-0-later', JSON.stringify(r.body));

  /* ---- one browser, two people ---- */
  let chromium = null;
  try { chromium = require('playwright').chromium; } catch (e) {}
  if (!chromium || !fs.existsSync(path.join(root, 'dist', 'unsubscribe.html'))) {
    out.push('  skip the browser half: needs Playwright and a build');
  } else {
    const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
    const ctx = await browser.newContext({ viewport: { width: 1000, height: 760 } });
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    await p.goto(s.base + '/');
    await p.waitForTimeout(800);
    const panel = await p.evaluate(() => {
      const a = document.getElementById('acc');
      return { open: !!a && a.className !== 'off', skip: !!document.querySelector('#acc [data-m=skip]') };
    });
    ok('signed out, the sign-in panel is up with no way round it', panel.open && !panel.skip, JSON.stringify(panel));

    const signIn = async (name, pass, reg) => {
      await p.evaluate(a => fetch(a.reg ? '/api/register' : '/api/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: a.name, pass: a.pass })
      }), { name, pass, reg });
      await p.goto(s.base + '/');
      await p.waitForTimeout(800);
    };
    const signOut = async () => {
      await p.evaluate(() => fetch('/api/logout', { method: 'POST' }));
      await p.goto(s.base + '/');
      await p.waitForTimeout(600);
    };

    await signIn('Ann', 'ann-password-1');
    await p.evaluate(() => { localStorage.setItem('unsub2087v3', '{"ann":1}'); localStorage.setItem('unsub2087acct', '{"box":"ann"}'); localStorage.setItem('u2087-ui', 'mouse'); });
    await signOut();
    await signIn('Cat', 'cat-password-1', true);
    const cat = await p.evaluate(() => ({ slot: localStorage.getItem('unsub2087v3'), box: localStorage.getItem('unsub2087acct'), ui: localStorage.getItem('u2087-ui') }));
    ok('the next person on the same browser does not get her slots', cat.slot === null, cat.slot);
    ok('or her lockbox', cat.box === null, cat.box);
    ok('device settings are still shared', cat.ui === 'mouse', cat.ui);
    await signOut();
    await signIn('Ann', 'ann-password-1');
    const back = await p.evaluate(() => localStorage.getItem('unsub2087v3'));
    ok('Ann signs back in and her copy is there', back === '{"ann":1}', back);
    ok('no page errors', !errs.length, errs.join(' | '));
    await browser.close();
  }
  await s.stop();

  console.log(out.join('\n'));
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
