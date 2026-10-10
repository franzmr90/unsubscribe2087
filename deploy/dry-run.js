/* Laptop check of the HOSTING.md box, without root, apt, or a real domain.
   It writes the same env, Caddy and systemd files setup.sh would, into a temp
   directory, then starts the server with that env. Run from the repo root:

     node deploy/dry-run.js
*/
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const { spawn, spawnSync } = require('child_process');

const root = path.join(__dirname, '..');
const domain = 'play.example.com';
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'u2087-host-'));
const data = path.join(tmp, 'var/lib/unsubscribe2087');
const envFile = path.join(tmp, 'etc/unsubscribe2087.env');
const unitFile = path.join(tmp, 'etc/systemd/system/unsubscribe2087.service');
const caddyFile = path.join(tmp, 'etc/caddy/Caddyfile');
fs.mkdirSync(path.dirname(envFile), { recursive: true });
fs.mkdirSync(path.dirname(unitFile), { recursive: true });
fs.mkdirSync(path.dirname(caddyFile), { recursive: true });
fs.mkdirSync(data, { recursive: true });

let pass = 0, fail = 0;
const out = [];
const ok = (n, c, d) => { if (c) { pass++; out.push('  ok   ' + n); } else { fail++; out.push('  FAIL ' + n + (d ? '  <' + d + '>' : '')); } };

function parseEnv(text) {
  const env = {};
  for (const line of text.split('\n')) {
    const s = line.trim();
    if (!s || s.startsWith('#')) continue;
    const i = s.indexOf('=');
    if (i < 1) continue;
    env[s.slice(0, i)] = s.slice(i + 1);
  }
  return env;
}

const example = fs.readFileSync(path.join(root, 'deploy/unsubscribe2087.env.example'), 'utf8');
const token = require('crypto').randomBytes(24).toString('hex');
let envText = example.replace(/yourdomain\.com/g, domain);
envText = envText.replace(/^ADMIN_TOKEN=.*/m, 'ADMIN_TOKEN=' + token);
envText = envText.replace(/^DATA_DIR=.*/m, 'DATA_DIR=' + data);
fs.writeFileSync(envFile, envText, { mode: 0o600 });

const nodeBin = process.execPath;
let unit = fs.readFileSync(path.join(root, 'deploy/unsubscribe2087.service'), 'utf8');
unit = unit.replace(/^ExecStart=.*/m, 'ExecStart=' + nodeBin + ' server/server.js');
fs.writeFileSync(unitFile, unit);

let caddy = fs.readFileSync(path.join(root, 'deploy/Caddyfile'), 'utf8');
caddy = caddy.replace(/yourdomain\.com/g, domain);
fs.writeFileSync(caddyFile, caddy);

const env = parseEnv(envText);
ok('the env requires an invite', env.INVITE_REQUIRED === '1');
ok('the env trusts the proxy', env.TRUST_PROXY === '1');
ok('the public origin is https', env.PUBLIC_ORIGIN === 'https://' + domain);
ok('bug intake has no token until one is set', !env.GITHUB_TOKEN);
ok('the unit restarts after a crash', /Restart=always/.test(unit) && /RestartSec=3/.test(unit));
ok('Caddy terminates TLS and proxies to the app',
  caddy.indexOf(domain + ' {') >= 0 && /reverse_proxy 127\.0\.0\.1:8087/.test(caddy) && !/tls off/.test(caddy));
ok('the Caddy file says voice needs TLS', /voice chat does not work without it/.test(caddy));

const port = 18087 + (process.pid % 1000);
env.PORT = String(port);
env.DATA_DIR = data;
const childEnv = Object.assign({}, process.env, env);
delete childEnv.GITHUB_TOKEN;
delete childEnv.BUG_WEBHOOK_URL;
delete childEnv.LAN;
delete childEnv.INVITE_CODES;
delete childEnv.ALLOWLIST;

function start() {
  const logs = [];
  const child = spawn(nodeBin, ['server/server.js'], {
    cwd: root, env: childEnv, stdio: ['ignore', 'pipe', 'pipe']
  });
  const take = b => { logs.push(b.toString()); };
  child.stdout.on('data', take);
  child.stderr.on('data', take);
  return { child, logs };
}

function waitReady(proc) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('server did not start\n' + proc.logs.join(''))), 8000);
    const look = () => {
      if (proc.logs.join('').includes('[bug] no GitHub token')) {
        clearTimeout(t);
        resolve();
      }
    };
    proc.child.stdout.on('data', look);
    proc.child.stderr.on('data', look);
    look();
  });
}

function stop(proc) {
  return new Promise(resolve => {
    if (!proc.child || proc.child.exitCode != null) return resolve();
    proc.child.once('exit', () => resolve());
    proc.child.kill('SIGKILL');
  });
}

function req(method, p, body, headers) {
  return new Promise((resolve, reject) => {
    const r = http.request({
      host: '127.0.0.1', port, method, path: p,
      headers: Object.assign({ 'Content-Type': 'application/json' }, headers || {})
    }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const raw = Buffer.concat(chunks).toString('utf8');
        let json = null;
        try { json = JSON.parse(raw); } catch (e) {}
        resolve({ status: res.statusCode, headers: res.headers, raw, json });
      });
    });
    r.on('error', reject);
    if (body) r.write(JSON.stringify(body));
    r.end();
  });
}

function cookie(res) {
  const raw = res.headers['set-cookie'] || [];
  const hit = raw.map(s => String(s).split(';')[0]).find(s => s.startsWith('u2087='));
  return hit || '';
}

(async () => {
  let proc = start();
  try {
    await waitReady(proc);
    const boot = proc.logs.join('');
    ok('startup says reports are not sent to GitHub', /no GitHub token/.test(boot));
    ok('startup names the real outbox directory', boot.indexOf(path.join(data, 'outbox')) >= 0, boot.slice(0, 500));

    const home = await req('GET', '/');
    ok('the game page answers', home.status === 200 && home.raw.indexOf('Unsubscribe') >= 0);

    const closed = await req('POST', '/api/register', { name: 'Ada', pass: 'longenough1' });
    ok('registration without an invite is refused', closed.status === 403 && /invite/i.test(closed.json && closed.json.error || ''), JSON.stringify(closed.json));

    const minted = spawnSync(nodeBin, ['server/admin.js', 'invite', 'mint', '--uses', '20', '--note', 'dry-run'], {
      cwd: root, env: childEnv, encoding: 'utf8'
    });
    const code = (minted.stdout || '').trim().split(/\s+/)[0];
    ok('setup can mint the bootstrap invite', minted.status === 0 && code.length >= 4, minted.stdout + minted.stderr);

    const opened = await req('POST', '/api/register', { name: 'Ada', pass: 'longenough1', invite: code });
    const ada = cookie(opened);
    ok('the invite lets a tester in', opened.status === 200 && !!ada, JSON.stringify(opened.json));
    ok('https origin marks the cookie Secure', /;\s*Secure/i.test((opened.headers['set-cookie'] || []).join(';')));

    let limited = 0;
    for (let i = 0; i < 6; i++) {
      const one = await req('POST', '/api/register', {
        name: 'Fwd' + i, pass: 'longenough1', invite: code
      }, { 'X-Forwarded-For': '198.51.100.8' });
      if (one.status === 429) limited++;
    }
    const other = await req('POST', '/api/register', {
      name: 'OtherNet', pass: 'longenough1', invite: code
    }, { 'X-Forwarded-For': '198.51.100.9' });
    ok('the proxy address is the rate-limit identity', limited === 1 && other.status === 200, 'limited=' + limited + ' other=' + other.status);

    const filed = await req('POST', '/api/bug', {
      doing: 'Opening the first district',
      happened: 'The screen went black during the dry run',
      expected: 'The district should have kept going'
    }, { Cookie: ada });
    ok('a report files without a GitHub token', filed.status === 200 && filed.json && filed.json.id, JSON.stringify(filed.json));
    const bugFile = path.join(data, 'bugs', filed.json.id + '.json');
    const bug = JSON.parse(fs.readFileSync(bugFile, 'utf8'));
    ok('the report stays on disk and is not marked sent', bug && !bug.issue && !bug.intake, JSON.stringify(bug && bug.intake));

    await stop(proc);
    const restartedAt = Date.now();
    proc = start();
    await waitReady(proc);
    ok('a killed process is back within a few seconds', Date.now() - restartedAt < 5000);
    const again = await req('POST', '/api/login', { name: 'Ada', pass: 'longenough1' });
    ok('the account survives the restart', again.status === 200 && again.json && again.json.user && again.json.user.name === 'Ada', JSON.stringify(again.json));
    const page = await req('GET', '/');
    ok('the page still answers after the restart', page.status === 200);
  } finally {
    await stop(proc);
  }

  console.log(out.join('\n'));
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
