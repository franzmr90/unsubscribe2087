/* Twenty headless players in a few games: movement, chat, party, a ping, and a
   thin combat loop (the game host reports eight machines, the others hit them).
   Prints latency, CPU, memory and messages per second for the server process.

   node tools/soak.js [--bots 20] [--seconds 20] [--check]
   --check exits non-zero if anyone fails to connect, the server dies, or p95 ping
   is over half a second. The default run only prints the summary. */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const argv = process.argv.slice(2);
function flag(name, fallback) {
  const i = argv.indexOf('--' + name);
  if (i < 0) return fallback;
  return argv[i + 1];
}
const BOTS = Math.max(1, +flag('bots', 20) || 20);
const SECONDS = Math.max(2, +flag('seconds', 20) || 20);
const CHECK = argv.includes('--check');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'u2087-soak-'));
const port = 18087 + Math.floor(Math.random() * 1000);

function procSample(pid) {
  const stat = fs.readFileSync('/proc/' + pid + '/stat', 'utf8');
  const status = fs.readFileSync('/proc/' + pid + '/status', 'utf8');
  const end = stat.lastIndexOf(')');
  const rest = stat.slice(end + 2).trim().split(/\s+/);
  const rss = /VmRSS:\s+(\d+)/.exec(status);
  return { utime: +rest[11], stime: +rest[12], rssKB: rss ? +rss[1] : 0 };
}

function percentile(sorted, p) {
  if (!sorted.length) return 0;
  const i = Math.min(sorted.length - 1, Math.max(0, Math.ceil(p * sorted.length) - 1));
  return sorted[i];
}

(async () => {
  /* Mint the accounts before the server boots, so the per-address registration cap
     (five an hour) does not apply to a load test. The child reads the same directory. */
  process.env.DATA_DIR = tmp;
  const auth = require('../server/lib/auth');
  const cookies = [];
  for (let i = 0; i < BOTS; i++) {
    const u = auth.createUser('Bot' + i, 'soak-password-1');
    if (!u) throw new Error('could not mint Bot' + i);
    cookies.push('u2087=' + encodeURIComponent(auth.newSession(u.id)));
  }

  const child = spawn(process.execPath, [path.join(__dirname, '..', 'server', 'server.js')], {
    cwd: path.join(__dirname, '..'),
    env: Object.assign({}, process.env, {
      DATA_DIR: tmp, PORT: String(port), SMTP_HOST: '',
      PUBLIC_ORIGIN: 'http://127.0.0.1:' + port,
      INVITE_REQUIRED: '', INVITE_CODES: '', ALLOWLIST: ''
    }),
    stdio: ['ignore', 'pipe', 'pipe']
  });
  let boot = '';
  child.stdout.on('data', d => { boot += d; });
  child.stderr.on('data', d => { boot += d; });
  const started = await new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('server did not start\n' + boot)), 8000);
    const on = () => { if (boot.includes('server on')) { clearTimeout(t); resolve(); } };
    child.stdout.on('data', on);
    child.stderr.on('data', on);
    child.on('exit', code => { clearTimeout(t); reject(new Error('server exited ' + code + '\n' + boot)); });
  });
  void started;

  const base = 'http://127.0.0.1:' + port;
  const hz = 100;

  const rtts = [];
  let sent = 0, recv = 0, connectFail = 0, mhp = 0;
  const bots = [];
  for (let i = 0; i < BOTS; i++) {
    try {
      const b = await new Promise((res, rej) => {
        const s = new WebSocket(base.replace('http', 'ws') + '/live', { headers: { Cookie: cookies[i] } });
        const bot = {
          s, i, x: 10 + (i % 5), y: 10, n: 0,
          pingAt: new Map(),
          send(o) { sent++; s.send(JSON.stringify(o)); }
        };
        s.onmessage = e => {
          recv++;
          let m; try { m = JSON.parse(e.data); } catch (err) { return; }
          if (m.t === 'pong' && bot.pingAt.has(m.n)) {
            rtts.push(Date.now() - bot.pingAt.get(m.n));
            bot.pingAt.delete(m.n);
          }
          if (m.t === 'mhp' || m.t === 'mkill') mhp++;
          if (m.t === 'you') { bot.uid = m.uid; res(bot); }
          if (m.t === 'game' && m.game) bot.gameId = m.game.id;
        };
        s.onerror = () => rej(new Error('socket'));
        setTimeout(() => rej(new Error('timeout')), 4000);
      });
      bots.push(b);
    } catch (e) { connectFail++; }
  }

  const games = Math.ceil(bots.length / 5);
  for (let g = 0; g < games; g++) {
    const group = bots.slice(g * 5, g * 5 + 5);
    if (!group.length) break;
    group[0].send({ t: 'game.create', name: 'Soak ' + g, diff: g % 2 ? 'nightmare' : 'normal' });
  }
  const joinDeadline = Date.now() + 2000;
  while (bots.some((b, i) => i % 5 === 0 && !b.gameId) && Date.now() < joinDeadline) {
    await new Promise(r => setTimeout(r, 40));
  }
  for (let g = 0; g < games; g++) {
    const group = bots.slice(g * 5, g * 5 + 5);
    const id = group[0] && group[0].gameId;
    if (!id) continue;
    for (let i = 1; i < group.length; i++) group[i].send({ t: 'game.join', id });
  }
  await new Promise(r => setTimeout(r, 250));
  for (let g = 0; g < games; g++) {
    const group = bots.slice(g * 5, g * 5 + 5);
    if (group.length >= 2 && group[1].uid) group[0].send({ t: 'invite', uid: group[1].uid });
  }
  await new Promise(r => setTimeout(r, 150));
  for (let g = 0; g < games; g++) {
    const group = bots.slice(g * 5, g * 5 + 5);
    if (group.length >= 2 && group[0].uid) group[1].send({ t: 'accept', uid: group[0].uid });
  }
  for (const b of bots) b.send({ t: 'hello', lvl: 8 + (b.i % 10), cls: 'scrapper', zi: 1, hp: 100, hpm: 120, resume: 1 });

  const ticks = SECONDS * (1000 / hz);
  let tick = 0;
  const cpu0 = procSample(child.pid);
  const rss = [cpu0.rssKB];
  const timer = setInterval(() => {
    tick++;
    const t = Date.now();
    for (const b of bots) {
      if (b.s.readyState !== 1) continue;
      b.x += Math.sin(tick / 10 + b.i) * 0.2;
      b.y += Math.cos(tick / 10 + b.i) * 0.2;
      b.send({ t: 'move', x: +b.x.toFixed(2), y: +b.y.toFixed(2), zi: 1, hp: 100, hpm: 120, lvl: 8, dir: tick / 10 });
      if (tick % 10 === b.i % 10) {
        b.n++;
        b.pingAt.set(b.n, t);
        b.send({ t: 'ping', n: b.n, at: t });
      }
      if (tick % 20 === b.i % 20) b.send({ t: 'chat', text: 'soak ' + b.i + ' ' + tick });
      const pack = 1 + ((tick / 40) | 0);
      if (tick % 5 === 0 && b.i % 5 === 0) {
        const list = [];
        for (let k = 1; k <= 8; k++) list.push({ id: pack * 10 + k, k: 'tick', x: +b.x.toFixed(2), y: +b.y.toFixed(2), hp: 30, max: 30, ml: 5 });
        b.send({ t: 'mobs', zi: 1, tier: 0, list });
      } else if (tick % 5 === 1) {
        b.send({ t: 'mhit', zi: 1, tier: 0, id: pack * 10 + 1 + (b.i % 4), d: 12 });
      }
    }
    if (tick % 10 === 0) {
      try { rss.push(procSample(child.pid).rssKB); } catch (e) {}
    }
    if (tick >= ticks) clearInterval(timer);
  }, hz);

  await new Promise(r => {
    const watch = setInterval(() => { if (tick >= ticks || child.exitCode != null) { clearInterval(watch); r(); } }, 100);
  });
  clearInterval(timer);
  await new Promise(r => setTimeout(r, 200));

  let cpu1 = cpu0;
  try { cpu1 = procSample(child.pid); } catch (e) {}
  const alive = child.exitCode == null;
  child.kill('SIGTERM');
  await new Promise(r => { const t = setTimeout(r, 1500); child.on('exit', () => { clearTimeout(t); r(); }); });

  const clk = 100;
  const cpuSec = ((cpu1.utime - cpu0.utime) + (cpu1.stime - cpu0.stime)) / clk;
  const cpuPct = SECONDS > 0 ? (cpuSec / SECONDS) * 100 : 0;
  const sorted = rtts.slice().sort((a, b) => a - b);
  const msgPer = (sent + recv) / SECONDS;
  const summary = {
    bots: bots.length, requested: BOTS, connectFail, seconds: SECONDS, serverAlive: alive,
    sent, recv, perSec: Math.round(msgPer),
    pingN: sorted.length,
    p50: percentile(sorted, 0.50),
    p95: percentile(sorted, 0.95),
    p99: percentile(sorted, 0.99),
    cpuSec: +cpuSec.toFixed(2),
    cpuPct: +cpuPct.toFixed(1),
    combat: mhp,
    rssStartMB: Math.round(cpu0.rssKB / 1024),
    rssEndMB: Math.round(cpu1.rssKB / 1024),
    rssMaxMB: Math.round(Math.max.apply(null, rss) / 1024)
  };
  console.log(JSON.stringify(summary, null, 2));
  fs.rmSync(tmp, { recursive: true, force: true });

  if (CHECK) {
    const bad = connectFail > 0 || !alive || bots.length < BOTS || sorted.length < bots || summary.p95 > 500 || mhp < 1;
    process.exit(bad ? 1 : 0);
  }
})().catch(e => { console.error(e); process.exit(1); });
