/* Twenty headless players in a few games: movement, chat, party, a ping, and a
   thin combat loop (the game host reports eight machines, the others hit them).
   Prints latency, CPU, memory and messages per second for the server process.

   node tools/soak.js [--bots 20] [--seconds 20] [--check]
   --check exits non-zero if anyone fails to connect, the server dies, or p95 ping
   is over half a second. The default run only prints the summary.

   node tools/soak.js --wan [--bots 20] [--seconds 12]
   Injects 100 ms one-way delay, ±30 ms jitter and 1% loss (tc netem on lo when
   this process may shape the interface, otherwise the delay sits on the bot
   sockets). Games hold 8. At the halfway point the monster host walks to town
   and the summary adds handoff time, whether the next host was already named,
   and how far the first positions after the handoff sit from the last ones. */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn, execFileSync } = require('child_process');

const argv = process.argv.slice(2);
function num(name, fallback) {
  const i = argv.indexOf('--' + name);
  if (i < 0 || argv[i + 1] == null || argv[i + 1].startsWith('--')) return fallback;
  const n = +argv[i + 1];
  return Number.isFinite(n) ? n : fallback;
}
const BOTS = Math.max(1, num('bots', 20));
const SECONDS = Math.max(2, num('seconds', 20));
const CHECK = argv.includes('--check');
const WAN = argv.includes('--wan');
const PER = Math.max(1, num('per', WAN ? 8 : 5));
const DELAY = WAN ? Math.max(0, num('delay', 100)) : 0;
const JITTER = WAN ? Math.max(0, num('jitter', 30)) : 0;
const LOSS = WAN ? Math.max(0, Math.min(0.5, num('loss', 0.01))) : 0;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'u2087-soak-'));
const port = 18087 + Math.floor(Math.random() * 1000);
const timers = [];

function later(ms, fn) {
  const t = setTimeout(fn, ms);
  timers.push(t);
  return t;
}
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
function enableNetem() {
  if (!WAN || DELAY <= 0) return false;
  try {
    execFileSync('tc', ['qdisc', 'replace', 'dev', 'lo', 'root', 'netem',
      'delay', DELAY + 'ms', JITTER + 'ms', 'loss', (LOSS * 100) + '%'], { stdio: 'ignore' });
    return true;
  } catch (e) { return false; }
}
function disableNetem() {
  try { execFileSync('tc', ['qdisc', 'del', 'dev', 'lo', 'root'], { stdio: 'ignore' }); } catch (e) {}
}

(async () => {
  let netem = false;
  let child = null;
  let exitCode = 0;
  try {
    netem = enableNetem();
    const appDelay = WAN && !netem;
    function wanWait() {
      if (!appDelay) return 0;
      const j = JITTER ? (Math.random() * 2 - 1) * JITTER : 0;
      return Math.max(0, Math.round(DELAY + j));
    }
    function wanDrop() { return appDelay && LOSS > 0 && Math.random() < LOSS; }

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

    child = spawn(process.execPath, [path.join(__dirname, '..', 'server', 'server.js')], {
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
    const desyncs = [];
    const handoffMs = [];
    const snaps = [];
    let sent = 0, recv = 0, connectFail = 0, mhp = 0, preElect = 0;
    let hostLeftAt = 0;
    const bots = [];

    for (let i = 0; i < BOTS; i++) {
      try {
        const b = await new Promise((res, rej) => {
          const s = new WebSocket(base.replace('http', 'ws') + '/live', { headers: { Cookie: cookies[i] } });
          const bot = {
            s, i, x: 10 + (i % 5), y: 10, n: 0, left: 0,
            hostUid: '', nextUid: '', heir: 0, heard: {},
            pingAt: new Map(),
            send(o) {
              if (bot.live && wanDrop()) { sent++; return; }
              const go = () => {
                if (s.readyState !== 1) return;
                sent++;
                s.send(JSON.stringify(o));
              };
              const d = wanWait();
              if (d) later(d, go); else go();
            }
          };
          s.onmessage = e => {
            const deliver = () => {
              recv++;
              let m; try { m = JSON.parse(e.data); } catch (err) { return; }
              if (m.t === 'pong' && bot.pingAt.has(m.n)) {
                rtts.push(Date.now() - bot.pingAt.get(m.n));
                bot.pingAt.delete(m.n);
              }
              if (m.t === 'mhp' || m.t === 'mkill') mhp++;
              if (m.t === 'you') { bot.uid = m.uid; res(bot); }
              if (m.t === 'game' && m.game) bot.gameId = m.game.id;
              if (m.t === 'mhost') {
                const prev = bot.hostUid;
                bot.hostUid = m.uid || '';
                bot.nextUid = m.next || '';
                if (prev && m.uid && m.uid !== prev && hostLeftAt) {
                  handoffMs.push(Date.now() - hostLeftAt);
                  bot.anchor = Object.assign({}, bot.heard);
                  bot.desyncUntil = Date.now() + 600;
                }
                if (m.hand && m.uid === bot.uid) bot.heir = 1;
              }
              if (m.t === 'mobs' && Array.isArray(m.list)) {
                if (bot.desyncUntil && Date.now() <= bot.desyncUntil && bot.anchor) {
                  if (m.snap != null) snaps.push(m.snap | 0);
                  for (let k = 0; k < m.list.length; k++) {
                    const row = m.list[k];
                    const prev = bot.anchor[row.id];
                    if (!prev) continue;
                    desyncs.push(Math.hypot((+row.x || 0) - prev.x, (+row.y || 0) - prev.y));
                  }
                }
                if (bot.hostUid !== bot.uid) {
                  for (let k = 0; k < m.list.length; k++) {
                    const row = m.list[k];
                    bot.heard[row.id] = { x: +row.x || 0, y: +row.y || 0 };
                  }
                }
              }
            };
            if (bot.live && wanDrop()) return;
            const d = wanWait();
            if (d) later(d, deliver); else deliver();
          };
          s.onerror = () => rej(new Error('socket'));
          setTimeout(() => rej(new Error('timeout')), appDelay ? 8000 : 4000);
        });
        bots.push(b);
      } catch (e) { connectFail++; }
    }

    function hosting(b) {
      if (b.left) return false;
      if (b.hostUid) return b.hostUid === b.uid;
      return b.i % PER === 0;
    }

    const games = Math.ceil(bots.length / PER);
    for (let g = 0; g < games; g++) {
      const group = bots.slice(g * PER, g * PER + PER);
      if (!group.length) break;
      group[0].send({ t: 'game.create', name: 'Soak ' + g, diff: g % 2 ? 'hard' : 'normal' });
    }
    const joinBudget = appDelay ? 5000 : 2000;
    const joinDeadline = Date.now() + joinBudget;
    while (bots.some((b, i) => i % PER === 0 && !b.gameId) && Date.now() < joinDeadline) {
      await new Promise(r => setTimeout(r, 40));
    }
    for (let g = 0; g < games; g++) {
      const group = bots.slice(g * PER, g * PER + PER);
      const id = group[0] && group[0].gameId;
      if (!id) continue;
      for (let i = 1; i < group.length; i++) group[i].send({ t: 'game.join', id });
    }
    await new Promise(r => setTimeout(r, appDelay ? 800 : 250));
    for (let g = 0; g < games; g++) {
      const group = bots.slice(g * PER, g * PER + PER);
      if (group.length >= 2 && group[1].uid) group[0].send({ t: 'invite', uid: group[1].uid });
    }
    await new Promise(r => setTimeout(r, appDelay ? 400 : 150));
    for (let g = 0; g < games; g++) {
      const group = bots.slice(g * PER, g * PER + PER);
      if (group.length >= 2 && group[0].uid) group[1].send({ t: 'accept', uid: group[0].uid });
    }
    for (const b of bots) b.send({ t: 'hello', lvl: 8 + (b.i % 10), cls: 'scrapper', zi: 1, hp: 100, hpm: 120, resume: 1 });
    for (const b of bots) b.live = 1;

    const ticks = SECONDS * (1000 / hz);
    const half = Math.floor(ticks / 2);
    let tick = 0;
    const cpu0 = procSample(child.pid);
    const rss = [cpu0.rssKB];
    const timer = setInterval(() => {
      tick++;
      const t = Date.now();
      if (WAN && !hostLeftAt && tick >= half) {
        hostLeftAt = Date.now();
        if (bots.some(b => b.nextUid)) preElect = 1;
        for (const b of bots) if (hosting(b)) b.left = 1;
      }
      for (const b of bots) {
        if (b.s.readyState !== 1) continue;
        if (!b.left) {
          b.x += Math.sin(tick / 10 + b.i) * 0.2;
          b.y += Math.cos(tick / 10 + b.i) * 0.2;
        }
        b.send({
          t: 'move', x: +b.x.toFixed(2), y: +b.y.toFixed(2), zi: b.left ? 0 : 1,
          hp: 100, hpm: 120, lvl: 8, dir: tick / 10
        });
        if (tick % 10 === b.i % 10) {
          b.n++;
          b.pingAt.set(b.n, t);
          b.send({ t: 'ping', n: b.n, at: t });
        }
        if (tick % 20 === b.i % 20) b.send({ t: 'chat', text: 'soak ' + b.i + ' ' + tick });
        if (b.left) continue;
        const pack = 1 + ((tick / 40) | 0);
        if (tick % 5 === 0 && hosting(b)) {
          const list = [];
          for (let k = 1; k <= 8; k++) {
            const id = pack * 10 + k;
            const heard = b.heir && b.heard[id];
            const x = heard ? heard.x : +b.x.toFixed(2);
            const y = heard ? heard.y : +b.y.toFixed(2);
            list.push({ id, k: 'tick', x, y, hp: 30, max: 30, ml: 5 });
          }
          b.send({ t: 'mobs', zi: 1, tier: 0, list });
        } else if (tick % 5 === 1 && !hosting(b)) {
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
    const drain = appDelay ? (DELAY + JITTER) * 2 + 400 : 200;
    await new Promise(r => setTimeout(r, drain));

    let cpu1 = cpu0;
    try { cpu1 = procSample(child.pid); } catch (e) {}
    const alive = child.exitCode == null;
    child.kill('SIGTERM');
    await new Promise(r => { const t = setTimeout(r, 1500); child.on('exit', () => { clearTimeout(t); r(); }); });

    const clk = 100;
    const cpuSec = ((cpu1.utime - cpu0.utime) + (cpu1.stime - cpu0.stime)) / clk;
    const cpuPct = SECONDS > 0 ? (cpuSec / SECONDS) * 100 : 0;
    const sorted = rtts.slice().sort((a, b) => a - b);
    const dsort = desyncs.slice().sort((a, b) => a - b);
    const hsort = handoffMs.slice().sort((a, b) => a - b);
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
    if (WAN) {
      summary.wan = { delay: DELAY, jitter: JITTER, loss: LOSS, netem: netem ? 1 : 0, per: PER };
      summary.handoffMs = hsort.length ? percentile(hsort, 0.50) : null;
      summary.handoffN = hsort.length;
      summary.preElect = preElect;
      summary.desyncP50 = dsort.length ? +percentile(dsort, 0.50).toFixed(2) : null;
      summary.desyncP95 = dsort.length ? +percentile(dsort, 0.95).toFixed(2) : null;
      summary.snap = snaps.length ? snaps.slice().sort((a, b) => a - b)[0] : null;
    }
    console.log(JSON.stringify(summary, null, 2));
    if (CHECK) {
      const bad = connectFail > 0 || !alive || bots.length < BOTS || sorted.length < bots || summary.p95 > 500 || mhp < 1;
      if (bad) exitCode = 1;
    }
  } finally {
    for (const t of timers) clearTimeout(t);
    if (netem) disableNetem();
    if (child && child.exitCode == null) { try { child.kill('SIGTERM'); } catch (e) {} }
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  process.exit(exitCode);
})().catch(e => { console.error(e); try { disableNetem(); } catch (err) {} process.exit(1); });
