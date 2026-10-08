/* GitHub intake, with the API and the webhook both stubbed locally.
   `node server/test/intake.js` */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), http = require('http');
const { spawnSync } = require('child_process');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'u2087-intake-'));
process.env.DATA_DIR = tmp;
process.env.BUILD_ID = 'intakebuild';
delete process.env.INVITE_REQUIRED;
delete process.env.INVITE_CODES;
delete process.env.ALLOWLIST;
delete process.env.GITHUB_TOKEN;
delete process.env.BUG_WEBHOOK_URL;
delete process.env.BUG_WEBHOOK_KEY;
delete process.env.BUG_WEBHOOK_KEY_HEADER;
delete process.env.GITHUB_API;
delete process.env.TRUST_PROXY;

const issues = {};
const comments = {};
const gh = [];
const hooks = [];
let issueN = 0;
let hookSeen = 0;

const stub = http.createServer((req, res) => {
  const chunks = [];
  req.on('data', c => chunks.push(c));
  req.on('error', () => {});
  req.on('end', () => {
    const raw = Buffer.concat(chunks).toString('utf8');
    const u = new URL(req.url, 'http://127.0.0.1');
    if (u.pathname === '/hook') {
      hookSeen++;
      hooks.push({ n: hookSeen, headers: req.headers, body: raw });
      if (hookSeen === 1) return; /* the first delivery hangs, so the client must time out and retry */
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('{"ok":true}');
      return;
    }
    gh.push({ method: req.method, path: u.pathname, query: u.search, headers: req.headers, body: raw });
    const send = (code, obj) => {
      res.writeHead(code, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(obj));
    };
    if (req.method === 'POST' && /^\/repos\/[^/]+\/[^/]+\/labels$/.test(u.pathname)) return send(201, { name: 'ok' });
    if (req.method === 'GET' && u.pathname === '/search/issues') {
      const q = u.searchParams.get('q') || '';
      const m = q.match(/\b([a-f0-9]{16})\b/);
      const items = [];
      if (m) for (const iss of Object.values(issues)) {
        if (iss.state === 'open' && String(iss.body).includes(m[1])) items.push(iss);
      }
      return send(200, { items });
    }
    const commentPath = u.pathname.match(/^\/repos\/[^/]+\/[^/]+\/issues\/(\d+)\/comments$/);
    if (commentPath && req.method === 'GET') return send(200, comments[+commentPath[1]] || []);
    if (commentPath && req.method === 'POST') {
      const row = { id: (comments[+commentPath[1]] || []).length + 1, body: JSON.parse(raw).body };
      (comments[+commentPath[1]] = comments[+commentPath[1]] || []).push(row);
      return send(201, row);
    }
    const one = u.pathname.match(/^\/repos\/[^/]+\/[^/]+\/issues\/(\d+)$/);
    if (one && req.method === 'GET') {
      const iss = issues[+one[1]];
      if (!iss) return send(404, {});
      return send(200, iss);
    }
    if (req.method === 'POST' && /^\/repos\/[^/]+\/[^/]+\/issues$/.test(u.pathname)) {
      const parsed = JSON.parse(raw);
      if (/INTAKEFAIL/.test(parsed.title) || /INTAKEFAIL/.test(parsed.body)) return send(500, { message: 'nope' });
      const finish = () => {
      const n = ++issueN;
      const iss = {
        number: n,
        state: 'open',
        title: parsed.title,
        body: parsed.body,
        labels: parsed.labels,
        html_url: 'https://github.com/franzmr90/unsubscribe2087/issues/' + n
      };
      issues[n] = iss;
      return send(201, iss);
      };
      /* The first create is slow on purpose, so the test can see the player was not kept waiting. */
      if (issueN === 0) { setTimeout(finish, 400); return; }
      return finish();
    }
    send(404, { message: 'stub miss ' + req.method + ' ' + u.pathname });
  });
});

const { server } = require('../server');
const bugs = require('../lib/bugs');
const intake = require('../lib/intake');
const auth = require('../lib/auth');
const invites = require('../lib/invites');

let pass = 0, fail = 0; const out = [];
const ok = (n, c, d) => { if (c) { pass++; out.push('  ok   ' + n); } else { fail++; out.push('  FAIL ' + n + (d ? '  <' + d + '>' : '')); } };

function clearBugIp() {
  for (const ip of ['127.0.0.1', '::ffff:127.0.0.1', '::1']) auth.rateClear('bug:' + ip);
}

function sessionCookie(res) {
  const lines = typeof res.headers.getSetCookie === 'function' ? res.headers.getSetCookie() : [res.headers.get('set-cookie') || ''];
  const hit = lines.map(s => String(s).split(';')[0]).find(s => s.startsWith('u2087='));
  if (!hit) throw new Error('no session cookie');
  return hit;
}

function machine(body) {
  const m = String(body).match(/```json\n([\s\S]*?)\n```/);
  if (!m) throw new Error('no json block');
  return JSON.parse(m[1]);
}

const FIELDS = ['act', 'browser', 'build', 'class', 'difficulty', 'district', 'doing', 'errors', 'expected', 'fingerprint', 'from', 'happened', 'level', 'multiplayer', 'partySize', 'zone'];

(async () => {
  await new Promise(r => stub.listen(0, '127.0.0.1', r));
  const stubPort = stub.address().port;
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = 'http://127.0.0.1:' + server.address().port;

  async function postBug(body, cookie, ua, keepIp) {
    if (!keepIp) clearBugIp();
    const headers = { 'Content-Type': 'application/json', 'User-Agent': ua || 'BetaBrowser/1.0' };
    if (cookie) headers.Cookie = cookie;
    const r = await fetch(base + '/api/bug', { method: 'POST', headers, body: JSON.stringify(body) });
    let j = {};
    try { j = await r.json(); } catch (e) {}
    return { status: r.status, body: j };
  }
  async function settled() {
    await Promise.race([
      intake.idle(),
      new Promise((_, rej) => setTimeout(() => rej(new Error('intake did not finish')), 20000))
    ]);
  }
  const happened = (s) => ({
    doing: 'Walking into the second district',
    happened: s,
    expected: 'The district should have kept going',
    state: { zone: 3, zoneName: 'The Vaults', lvl: 12, cls: 'scrapper', act: 1, party: 2, online: true, game: 'beta', diff: 'nightmare' },
    errors: ['TypeError: cannot read hp @ game.js:40:2']
  });

  let r = await postBug(happened('The screen went black and the buttons died'));
  await settled();
  ok('with no token the report still files', r.status === 200 && r.body.id && bugs.list().some(x => x.id === r.body.id), JSON.stringify(r.body));
  const plain = bugs.list().find(x => x.id === r.body.id);
  ok('with no token nothing is marked for intake', plain && !plain.intake && !plain.issue, JSON.stringify(plain && plain.intake));
  ok('with no token GitHub is not called', gh.length === 0 && hooks.length === 0, String(gh.length));

  process.env.GITHUB_TOKEN = 'test-token-value';
  process.env.GITHUB_API = 'http://127.0.0.1:' + stubPort;
  process.env.BUG_REPO = 'franzmr90/unsubscribe2087';
  process.env.BUG_WEBHOOK_URL = 'http://127.0.0.1:' + stubPort + '/hook';
  process.env.BUG_WEBHOOK_KEY = 'test-webhook-secret';
  delete process.env.BUG_WEBHOOK_KEY_HEADER;

  r = await postBug(Object.assign(happened('A signed-out player still saw the buttons die'), { from: 'Walk-in' }));
  await settled();
  ok('an anonymous report stays local', r.status === 200 && issueN === 0 && !bugs.list().find(x => x.id === r.body.id).intake, 'issues=' + issueN);

  clearBugIp();
  let accepted = 0;
  for (let i = 0; i < 10; i++) {
    const one = await postBug(happened('Address cap report ' + i + ' is long enough here'), null, null, true);
    if (one.status === 200) accepted++;
  }
  ok('ten reports from one address are accepted', accepted === 10, String(accepted));
  const flooded = await fetch(base + '/api/bug', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(happened('Address cap report eleven is long enough'))
  });
  ok('the eleventh report from one address is refused', flooded.status === 429, String(flooded.status));
  ok('anonymous traffic still opened no issue', issueN === 0, String(issueN));
  clearBugIp();

  const code = invites.mint({ uses: 1, note: 'scrub' }).code;
  async function register(name) {
    clearBugIp();
    auth.rateClear('reg:127.0.0.1');
    auth.rateClear('reg:::ffff:127.0.0.1');
    auth.rateClear('reg:::1');
    const res = await fetch(base + '/api/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, pass: 'longenough1' })
    });
    const j = await res.json();
    if (res.status !== 200) throw new Error('register ' + name + ' ' + res.status + ' ' + JSON.stringify(j));
    return sessionCookie(res);
  }
  const hunter = await register('BugHunter');
  const secretHappened = 'Screen died ghp_ABCDEFGHIJ12345678 mail ada@example.com at 203.0.113.9 code ' + code;
  const t0 = Date.now();
  r = await postBug({
    doing: 'Walking the vaults ``` with a token=shouldnotleakvalue',
    happened: secretHappened,
    expected: 'It should have stayed up. api_key=supersecretvalue and Bearer gho_abcdefghijklmnop',
    where: 'http://203.0.113.9/play?invite=' + code,
    from: 'Spoofed',
    state: { zone: 3, zoneName: 'The Vaults', lvl: 12, cls: 'scrapper', act: 1, party: 2, online: true, game: 'beta', diff: 'nightmare', sats: 99999 },
    errors: ['TypeError: cannot read hp @ game.js:40:2', 'also saw ' + code + ' and github_pat_11AAAAAAAA']
  }, hunter);
  const waited = Date.now() - t0;
  ok('the player is answered without waiting for GitHub', r.status === 200 && !!r.body.id && waited < 300 && issueN === 0, 'status=' + r.status + ' ms=' + waited + ' issues=' + issueN);
  await settled();
  const opened = issues[1];
  ok('a signed-in report opens one issue', issueN === 1 && opened && opened.labels.join() === 'bug-report,auto-intake', JSON.stringify(opened && opened.labels));
  const disk = bugs.list().find(x => x.id === r.body.id);
  ok('the local file points at the issue', disk && disk.intake === 'new' && disk.issue === 1 && /\/issues\/1$/.test(disk.issueUrl), JSON.stringify(disk && { intake: disk.intake, issue: disk.issue }));
  const blob = opened.body + '\n' + disk.doing + disk.happened + disk.expected + (disk.errors || []).join(' ') + (disk.where || '');
  ok('tokens, email, ip and the invite code are stripped',
    !/ghp_|github_pat_|gho_|shouldnotleakvalue|supersecretvalue|ada@example\.com|203\.0\.113\.9/.test(blob) && blob.indexOf(code) < 0 && /\[redacted\]/.test(opened.body) && /\[redacted-email\]/.test(opened.body),
    opened.title);
  const parsed = machine(opened.body);
  ok('the machine block has the triage fields', Object.keys(parsed).sort().join() === FIELDS.join(), Object.keys(parsed).sort().join());
  ok('the machine block matches the report',
    parsed.build === 'intakebuild' && parsed.class === 'scrapper' && parsed.level === 12 && parsed.act === 1 &&
    parsed.district === 'the vaults' && parsed.zone === 3 && parsed.difficulty === 'nightmare' &&
    parsed.partySize === 2 && parsed.multiplayer === true && parsed.browser === 'BetaBrowser/1.0' &&
    parsed.from === 'BugHunter' && parsed.errors[0].indexOf('TypeError') === 0 && !parsed.sats,
    JSON.stringify(parsed));
  ok('the issue title is the scrubbed happened line', opened.title === disk.happened.replace(/\s+/g, ' ').trim().slice(0, 120), opened.title);
  ok('the first webhook retried after the timeout', hooks.length === 2 && hooks[0].n === 1 && hooks[1].n === 2, 'hooks=' + hooks.length);
  const hook1 = JSON.parse(hooks[1].body);
  ok('the webhook payload is the small notice',
    Object.keys(hook1).sort().join() === 'build,fingerprint,number,occurrence,title,url' &&
    hook1.number === 1 && hook1.occurrence === 'new' && hook1.build === 'intakebuild' &&
    hook1.fingerprint === parsed.fingerprint && hook1.url === opened.html_url && hook1.title === opened.title,
    JSON.stringify(hook1));
  ok('Authorization carries the webhook secret as a Bearer token',
    hooks[1].headers.authorization === 'Bearer test-webhook-secret', hooks[1].headers.authorization);

  const sameFp = intake.fingerprint(disk, 'intakebuild');
  ok('the fingerprint is the error, the district and the build', sameFp === parsed.fingerprint && sameFp.length === 16, sameFp);
  const again = await postBug(Object.assign(happened('It happened again but the buttons stayed dead'), {
    errors: ['TypeError: cannot read hp @ game.js:99:8']
  }), hunter);
  await settled();
  ok('the same failure comments instead of opening a second issue', issueN === 1 && comments[1] && comments[1].length === 1, 'issues=' + issueN + ' comments=' + (comments[1] || []).length);
  ok('the comment carries the occurrence count', /Occurrence 2\./.test(comments[1][0].body), comments[1][0].body.slice(0, 80));
  const hookRepeat = JSON.parse(hooks[hooks.length - 1].body);
  ok('a repeat notifies with occurrence repeat', hookRepeat.occurrence === 'repeat' && hookRepeat.number === 1 && hookRepeat.title === opened.title, JSON.stringify(hookRepeat));

  fs.unlinkSync(path.join(bugs.DIR, 'intake-index.json'));
  const searched = await postBug(happened('Same black screen after the index was wiped'), hunter);
  await settled();
  ok('a wiped local index still finds the open issue', issueN === 1 && comments[1].length === 2 && /Occurrence 3\./.test(comments[1][1].body), 'issues=' + issueN);
  ok('the search looked for the fingerprint', gh.some(h => h.path === '/search/issues' && h.query.indexOf(parsed.fingerprint) >= 0));

  process.env.BUG_WEBHOOK_KEY_HEADER = 'X-Routine-Key';
  const custom = await postBug(happened('Same black screen, different header'), hunter);
  await settled();
  const lastHook = hooks[hooks.length - 1];
  ok('a custom header carries the raw key', lastHook.headers['x-routine-key'] === 'test-webhook-secret' && !lastHook.headers.authorization, JSON.stringify({ key: lastHook.headers['x-routine-key'], auth: lastHook.headers.authorization }));
  ok('that repeat is occurrence 4', /Occurrence 4\./.test(comments[1][2].body));
  void searched; void custom;

  const beforeFail = issueN;
  const hooksBeforeFail = hooks.length;
  const broke = await postBug(Object.assign(happened('INTAKEFAIL the buttons died in a new way entirely'), {
    errors: ['IntakeFailError: forced @ game.js:1:1']
  }), hunter);
  await settled();
  const brokeDisk = bugs.list().find(x => x.id === broke.body.id);
  ok('a GitHub failure still returns the report id', broke.status === 200 && !!broke.body.id, JSON.stringify(broke.body));
  ok('a GitHub failure is recorded and not notified', issueN === beforeFail && brokeDisk.intake === 'failed' && hooks.length === hooksBeforeFail && intake.failures() >= 1, brokeDisk && brokeDisk.intake);

  const rater = await register('Rater');
  let made = 0;
  for (let i = 0; i < 5; i++) {
    const one = await postBug(Object.assign(happened('Rater saw a fresh failure number ' + i + ' today'), {
      errors: ['RaterError ' + i + ' @ r.js:2:2']
    }), rater);
    await settled();
    if (one.status === 200 && bugs.list().find(x => x.id === one.body.id).intake === 'new') made++;
  }
  const queued = await postBug(Object.assign(happened('Rater saw a sixth fresh failure today'), {
    errors: ['RaterError 6 @ r.js:3:3']
  }), rater);
  await settled();
  const queuedDisk = bugs.list().find(x => x.id === queued.body.id);
  ok('five reports an hour reach GitHub', made === 5, String(made));
  ok('the sixth is saved and queued', queued.status === 200 && queuedDisk.intake === 'queued' && !queuedDisk.issue, queuedDisk && queuedDisk.intake);

  const capper = await register('Capper');
  intake.testSetServerHits(50);
  const capped = await postBug(Object.assign(happened('Capper hit the server-wide cap today'), {
    errors: ['CapError @ c.js:4:4']
  }), capper);
  await settled();
  const cappedDisk = bugs.list().find(x => x.id === capped.body.id);
  ok('the server-wide cap queues the report', capped.status === 200 && cappedDisk.intake === 'queued' && !cappedDisk.issue, cappedDisk && cappedDisk.intake);

  const cli = spawnSync(process.execPath, ['server/admin.js', 'bugs', '--n', '40'], {
    cwd: path.join(__dirname, '../..'),
    env: Object.assign({}, process.env, { DATA_DIR: tmp, ADMIN_TOKEN: '0123456789abcdef' }),
    encoding: 'utf8'
  });
  ok('admin bugs lists the issue link', cli.status === 0 && cli.stdout.indexOf('https://github.com/franzmr90/unsubscribe2087/issues/1') >= 0 && /\tqueued\t/.test(cli.stdout), cli.stdout.slice(0, 400));

  console.log(out.join('\n'));
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  server.close();
  stub.close();
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
