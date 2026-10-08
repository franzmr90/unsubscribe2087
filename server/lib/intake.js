/* Turns a filed bug report into a GitHub issue, after the report is already on disk.
   Nothing here runs unless GITHUB_TOKEN is set, and nothing here is awaited by the
   request that saved the report. A missing token, a rate limit, or a GitHub error
   leaves the local file and returns the player to the game. */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const http = require('http');
const https = require('https');
const bugs = require('./bugs');
const invites = require('./invites');
const { ensure } = require('./store');

const ACCOUNT_PER_HOUR = 5;
const SERVER_PER_HOUR = 50;
const HOUR = 3600e3;
const TITLE_MAX = 120;
const PROSE_MAX = 2000;
const BODY_MAX = 60000;
const GH_TIMEOUT = 12000;
const HOOK_TIMEOUT = 5000;

const acctHits = new Map();
const serverHits = [];
const pending = new Set();
let tail = Promise.resolve();
let failN = 0;
let labelsReady = false;

const env = k => process.env[k] || '';

function failures() { return failN; }

function noteFail(why) {
  failN++;
  console.error('[bug] intake ' + why);
}

function scrub(s) {
  let t = String(s == null ? '' : s);
  t = t.replace(/\b(?:ghp_|gho_|ghu_|ghs_|ghr_|github_pat_|sk-|AKIA)[A-Za-z0-9_-]{8,}/g, '[redacted]');
  t = t.replace(/\bxox[baprs]-[A-Za-z0-9-]{8,}/g, '[redacted]');
  t = t.replace(/\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/g, '[redacted]');
  t = t.replace(/\b(token|secret|password|passwd|api[_-]?key|authorization)\s*[:=]\s*\S+/gi, '$1=[redacted]');
  t = t.replace(/\bBearer\s+\S+/gi, 'Bearer [redacted]');
  t = t.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted-email]');
  t = t.replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '[redacted-ip]');
  t = t.replace(/\b(?:[A-F0-9]{1,4}:){2,7}[A-F0-9]{1,4}\b/gi, '[redacted-ip]');
  try {
    for (const row of invites.list()) {
      const code = row && row.code ? String(row.code) : '';
      if (code.length < 8) continue;
      t = t.replace(new RegExp(code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig'), '[redacted]');
    }
  } catch (e) {}
  return t.replace(/```/g, "'''");
}

function scrubReport(b) {
  const src = b && typeof b === 'object' ? b : {};
  const o = Object.assign({}, src);
  for (const k of ['doing', 'happened', 'expected', 'where', 'from']) o[k] = scrub(o[k]);
  if (Array.isArray(o.errors)) o.errors = o.errors.map(scrub);
  if (o.state && typeof o.state === 'object') {
    const st = {};
    for (const k of Object.keys(o.state)) {
      const v = o.state[k];
      st[k] = typeof v === 'string' ? scrub(v) : v;
    }
    o.state = st;
  }
  return o;
}

function clip(s, n) {
  return scrub(s).slice(0, n);
}

function districtOf(state) {
  const st = state && typeof state === 'object' ? state : {};
  const named = st.zoneName != null && String(st.zoneName).trim() ? st.zoneName : st.zone;
  const t = String(named == null || named === '' ? 'unknown' : named).toLowerCase().replace(/\s+/g, ' ').trim();
  return t.slice(0, 80) || 'unknown';
}

function normError(errors) {
  let t = (Array.isArray(errors) && errors.length ? String(errors[0]) : '').toLowerCase();
  t = t.replace(/\s+/g, ' ').trim().replace(/:\d+:\d+/g, '');
  if (!t) t = '(none)';
  return t.slice(0, 180);
}

function fingerprint(rec, build) {
  const raw = normError(rec && rec.errors) + '|' + districtOf(rec && rec.state) + '|' + String(build || '');
  return crypto.createHash('sha256').update(raw).digest('hex').slice(0, 16);
}

function prune(arr, now) {
  let i = 0;
  while (i < arr.length && now - arr[i] >= HOUR) i++;
  if (i) arr.splice(0, i);
}

function allow(uid) {
  const now = Date.now();
  let mine = acctHits.get(uid);
  if (!mine) { mine = []; acctHits.set(uid, mine); }
  prune(mine, now);
  prune(serverHits, now);
  if (mine.length >= ACCOUNT_PER_HOUR || serverHits.length >= SERVER_PER_HOUR) return false;
  mine.push(now);
  serverHits.push(now);
  return true;
}

function indexFile() { return path.join(bugs.DIR, 'intake-index.json'); }

function readIndex() {
  try { return JSON.parse(fs.readFileSync(indexFile(), 'utf8')); } catch (e) { return {}; }
}

function writeIndex(idx) {
  ensure(bugs.DIR);
  fs.writeFileSync(indexFile(), JSON.stringify(idx));
}

function fieldsOf(rec, build, fp) {
  const st = rec.state && typeof rec.state === 'object' ? rec.state : {};
  const lvl = Number(st.lvl);
  const party = Number(st.party);
  return {
    fingerprint: fp,
    build: String(build || ''),
    class: clip(st.cls, 40),
    level: Number.isFinite(lvl) ? lvl : null,
    act: typeof st.act === 'number' ? st.act : (st.act == null || st.act === '' ? null : clip(st.act, 40)),
    district: districtOf(st),
    zone: typeof st.zone === 'number' ? st.zone : (st.zone == null || st.zone === '' ? null : clip(st.zone, 40)),
    difficulty: st.diff == null || st.diff === '' ? null : clip(st.diff, 40),
    partySize: Number.isFinite(party) ? party : 0,
    multiplayer: !!(st.online || st.game),
    browser: clip(rec.agent, 300),
    from: clip(rec.from, 60) || 'anonymous',
    doing: clip(rec.doing, PROSE_MAX),
    happened: clip(rec.happened, PROSE_MAX),
    expected: clip(rec.expected, PROSE_MAX),
    errors: (Array.isArray(rec.errors) ? rec.errors : []).slice(0, 20).map(e => clip(e, 500))
  };
}

function cell(s) {
  return String(s == null ? '' : s).replace(/\|/g, '/').replace(/\s+/g, ' ').trim();
}

function titleOf(rec) {
  const t = clip(rec.happened, PROSE_MAX).replace(/\s+/g, ' ').trim();
  return (t || 'Bug report').slice(0, TITLE_MAX);
}

function bodyOf(f) {
  const lines = [
    '## Doing',
    f.doing || '(blank)',
    '',
    '## Happened',
    f.happened || '(blank)',
    '',
    '## Expected',
    f.expected || '(blank)',
    '',
    '| | |',
    '|---|---|',
    '| build | `' + cell(f.build) + '` |',
    '| class | ' + cell(f.class) + ' |',
    '| level | ' + cell(f.level == null ? '' : f.level) + ' |',
    '| act | ' + cell(f.act == null ? '' : f.act) + ' |',
    '| district | ' + cell(f.district + (f.zone == null ? '' : ' (' + f.zone + ')')) + ' |',
    '| difficulty | ' + cell(f.difficulty == null ? '' : f.difficulty) + ' |',
    '| party size | ' + cell(f.partySize) + ' |',
    '| multiplayer | ' + (f.multiplayer ? 'yes' : 'no') + ' |',
    '| browser | ' + cell(f.browser) + ' |',
    '| from | ' + cell(f.from) + ' |',
    '| fingerprint | `' + cell(f.fingerprint) + '` |',
    '',
    '## Recent errors',
    '```',
    f.errors.length ? f.errors.join('\n') : '(none)',
    '```',
    '',
    '```json',
    JSON.stringify(f, null, 2),
    '```'
  ];
  return lines.join('\n').slice(0, BODY_MAX);
}

function commentOf(f, count) {
  return [
    'Same failure again. Occurrence ' + count + '.',
    '',
    'From: ' + cell(f.from),
    'Build: ' + cell(f.build),
    'District: ' + cell(f.district),
    'Happened: ' + cell(f.happened),
    '',
    '```json',
    JSON.stringify(f, null, 2),
    '```'
  ].join('\n').slice(0, BODY_MAX);
}

function request(method, urlStr, headers, body, timeoutMs) {
  return new Promise((resolve, reject) => {
    let u;
    try { u = new URL(urlStr); } catch (e) { reject(e); return; }
    const lib = u.protocol === 'https:' ? https : http;
    const data = body == null ? null : Buffer.from(typeof body === 'string' ? body : JSON.stringify(body));
    const h = Object.assign({}, headers || {});
    if (data) {
      if (!h['Content-Type']) h['Content-Type'] = 'application/json';
      h['Content-Length'] = data.length;
    }
    let done = false;
    const finish = (fn, v) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      fn(v);
    };
    const req = lib.request(u, { method, headers: h }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf8');
        let json = null;
        try { json = text ? JSON.parse(text) : null; } catch (e) {}
        finish(resolve, { status: res.statusCode, text, json });
      });
      res.on('error', e => finish(reject, e));
    });
    const timer = setTimeout(() => req.destroy(new Error('timeout')), timeoutMs);
    req.on('error', e => finish(reject, e));
    if (data) req.end(data); else req.end();
  });
}

function repoPath() {
  const r = env('BUG_REPO') || 'franzmr90/unsubscribe2087';
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(r)) throw new Error('bad BUG_REPO');
  return r;
}

function api(p) {
  return (env('GITHUB_API') || 'https://api.github.com').replace(/\/$/, '') + p;
}

function ghHeaders() {
  return {
    Authorization: 'Bearer ' + env('GITHUB_TOKEN'),
    Accept: 'application/vnd.github+json',
    'User-Agent': 'unsubscribe2087',
    'X-GitHub-Api-Version': '2022-11-28'
  };
}

async function ensureLabels() {
  if (labelsReady) return;
  labelsReady = true;
  const base = api('/repos/' + repoPath() + '/labels');
  for (const name of ['bug-report', 'auto-intake']) {
    try {
      await request('POST', base, ghHeaders(), {
        name,
        color: name === 'bug-report' ? 'b60205' : '0052cc',
        description: name === 'bug-report' ? 'Filed from the in-game reporter' : 'Opened by automatic bug intake'
      }, GH_TIMEOUT);
    } catch (e) { /* a missing label surfaces when the issue itself is refused */ }
  }
}

async function searchOpen(fp) {
  const q = 'repo:' + repoPath() + ' is:issue is:open label:auto-intake ' + fp + ' in:body';
  const r = await request('GET', api('/search/issues?q=' + encodeURIComponent(q) + '&per_page=5'), ghHeaders(), null, GH_TIMEOUT);
  if (r.status !== 200 || !r.json || !Array.isArray(r.json.items)) return null;
  for (const it of r.json.items) {
    if (it && it.state === 'open' && it.number) return { number: it.number, url: it.html_url || '', title: it.title || '' };
  }
  return null;
}

async function getIssue(number) {
  const r = await request('GET', api('/repos/' + repoPath() + '/issues/' + number), ghHeaders(), null, GH_TIMEOUT);
  if (r.status !== 200 || !r.json) return null;
  return r.json;
}

async function occurrenceCount(number, cached) {
  if (cached && cached.count) return cached.count + 1;
  let seen = 1;
  try {
    const r = await request('GET', api('/repos/' + repoPath() + '/issues/' + number + '/comments?per_page=100'), ghHeaders(), null, GH_TIMEOUT);
    const rows = r.status === 200 && Array.isArray(r.json) ? r.json : [];
    for (const c of rows) {
      const m = String((c && c.body) || '').match(/Occurrence (\d+)/);
      if (m) seen = Math.max(seen, +m[1]);
    }
  } catch (e) {}
  return seen + 1;
}

async function createIssue(title, body) {
  await ensureLabels();
  const r = await request('POST', api('/repos/' + repoPath() + '/issues'), ghHeaders(), {
    title, body, labels: ['bug-report', 'auto-intake']
  }, GH_TIMEOUT);
  if (r.status !== 201 || !r.json || !r.json.number) throw new Error('github create ' + r.status);
  return { number: r.json.number, url: r.json.html_url || '' };
}

async function commentIssue(number, body) {
  const r = await request('POST', api('/repos/' + repoPath() + '/issues/' + number + '/comments'), ghHeaders(), { body }, GH_TIMEOUT);
  if (r.status !== 201) throw new Error('github comment ' + r.status);
}

function hookHeaders() {
  const key = env('BUG_WEBHOOK_KEY');
  if (!key) return {};
  const name = env('BUG_WEBHOOK_KEY_HEADER') || 'Authorization';
  const value = name.toLowerCase() === 'authorization' ? ('Bearer ' + key) : key;
  return { [name]: value };
}

async function notify(payload) {
  const url = env('BUG_WEBHOOK_URL');
  if (!url) return;
  const headers = Object.assign({ 'User-Agent': 'unsubscribe2087' }, hookHeaders());
  let last = 'webhook failed';
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await request('POST', url, headers, payload, HOOK_TIMEOUT);
      if (r.status >= 200 && r.status < 300) return;
      last = 'webhook ' + r.status;
    } catch (e) {
      last = 'webhook ' + (e && e.message ? e.message : e);
    }
  }
  noteFail(last);
}

async function forward(rec, build) {
  const fp = fingerprint(rec, build);
  const f = fieldsOf(rec, build, fp);
  const title = titleOf(rec);
  const idx = readIndex();
  let hit = idx[fp] || null;
  let shown = title;
  if (hit && hit.number) {
    const issue = await getIssue(hit.number);
    if (!issue || issue.state !== 'open') hit = null;
    else {
      if (!hit.url && issue.html_url) hit.url = issue.html_url;
      if (issue.title) shown = issue.title;
    }
  }
  if (!hit) {
    hit = await searchOpen(fp);
    if (hit && hit.title) shown = hit.title;
  }
  let number, url, occurrence;
  if (hit && hit.number) {
    const count = await occurrenceCount(hit.number, idx[fp] && idx[fp].number === hit.number ? idx[fp] : null);
    await commentIssue(hit.number, commentOf(f, count));
    number = hit.number;
    url = hit.url || '';
    occurrence = 'repeat';
    if (idx[fp] && idx[fp].title) shown = idx[fp].title;
    idx[fp] = { number, url, count, title: shown };
  } else {
    const created = await createIssue(title, bodyOf(f));
    number = created.number;
    url = created.url;
    occurrence = 'new';
    shown = title;
    idx[fp] = { number, url, count: 1, title: shown };
  }
  writeIndex(idx);
  bugs.update(rec.id, { intake: occurrence, issue: number, issueUrl: url, fingerprint: fp });
  await notify({ number, url, title: shown, fingerprint: fp, occurrence, build: String(build || '') });
}

function schedule(rec, opts) {
  if (!env('GITHUB_TOKEN')) return;
  if (!opts || !opts.uid) return;
  const build = String(opts.build || '');
  if (!allow(String(opts.uid))) {
    try { bugs.update(rec.id, { intake: 'queued' }); } catch (e) { noteFail('queue mark'); }
    return;
  }
  const run = tail.catch(() => {}).then(() => forward(rec, build));
  const settled = run.then(() => {}, e => {
    noteFail(e && e.message ? e.message : String(e));
    try { bugs.update(rec.id, { intake: 'failed' }); } catch (err) {}
  });
  tail = settled;
  pending.add(settled);
  settled.finally(() => pending.delete(settled));
}

function idle() {
  return Promise.all([...pending].map(p => p.then(() => {}, () => {})));
}

/* Test-only: pretend the server already forwarded this many reports in the last hour. */
function testSetServerHits(n) {
  serverHits.length = 0;
  const now = Date.now();
  for (let i = 0; i < n; i++) serverHits.push(now);
}

module.exports = {
  schedule, idle, scrub, scrubReport, fingerprint, failures, testSetServerHits
};
