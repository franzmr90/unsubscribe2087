/* Reach, rate and life checks for reported hits. Not a combat simulator.
   A swing is refused when the attacker is standing outside that skill's reach, or when
   the swings arrive faster than the class can attack or cast once the faster-cast cap
   is on. Life reports are clamped to what the level, class and a full set of gear can
   support. Honest play with about 150 ms of jitter stays inside the slack. */
'use strict';

/* Same towns as live.js. Inlined so this file does not require live.js. */
const TOWNS = new Set([0, 17, 18, 21, 27]);

/* Class base life and the unbuffed swing interval, from the class table. */
const CLS = {
  scrapper: { hp: 130, hpL: 17, ivl: 0.6, melee: 1 },
  hacker: { hp: 85, hpL: 12, ivl: 0.62, melee: 0 },
  courier: { hp: 100, hpL: 14, ivl: 0.4, melee: 0 },
  anon: { hp: 95, hpL: 13, ivl: 0.42, melee: 1 },
  founder: { hp: 90, hpL: 12, ivl: 0.6, melee: 0 },
  homesteader: { hp: 110, hpL: 15, ivl: 0.55, melee: 0 },
  witness: { hp: 80, hpL: 11, ivl: 0.68, melee: 1 },
  maxi: { hp: 104, hpL: 14, ivl: 0.5, melee: 1 }
};

/* Tiles. Basic is a swing or a shot. Skill is an active that is not a leap or a storm.
   Far is a rush, a chain, a placed storm. Slack covers one position report plus 150 ms
   of jitter at a closing speed of about 12 tiles a second, and the machine's radius. */
const REACH = { melee: 3.5, ranged: 10, skillMelee: 8, skillRanged: 12, far: 16 };
const SLACK = 4.5;
const FAR = {
  scrapper: { 4: 1, 7: 1 },
  hacker: { 0: 1, 6: 1, 7: 1, 10: 1 },
  anon: { 8: 1 },
  courier: { 6: 1 },
  founder: { 6: 1, 8: 1 }
};

/* 240% attack speed (fast weapon, affixes, family, doctrine, web, overtime).
   Faster cast is capped at 60% in calc(), and a mastered 0.5 s skill is the fastest
   listed cast: 0.5 * (1 - 0.6) * 0.8 = 0.16 s. */
const ASPD_DIV = 3.4;
const CAST_FLOOR = 0.16;
const SWING_MS = 80;
const SWING_MAX = 24;
const RATE_WINDOW = 1000;
const RATE_SLACK = 2;

/* Life ceiling: every attribute point in vitality, plus a gear ceiling, times the
   stacked life multipliers (iron hide, % life, orders). */
const VIT_GEAR = 80;
const HP_FLAT = 2200;
const HP_PER = 12;
const HP_MULT = 2.8;
const REGEN_FLAT = 50;
const REGEN_PCT = 0.025;
const TOWN_PCT = 0.32;
const LEECH = 0.15;
const SWINGS_PER_S = 8;
const BURST_BARS = 2;
const BURST_REFILL = 0.5;
const PVP_FRAC = 0.08;
const PVP_MIN = 0.15;
const PVP_WINDOW = 2500;

let hitRej = 0, hpFlag = 0;

function classOf(cls) { return CLS[cls] || CLS.scrapper; }

function reachOf(cls, sk) {
  const c = classOf(cls);
  const basic = c.melee ? REACH.melee : REACH.ranged;
  const n = sk == null ? -1 : (sk | 0);
  if (n < 0) return basic;
  if (FAR[cls] && FAR[cls][n]) return REACH.far;
  return c.melee ? REACH.skillMelee : REACH.skillRanged;
}

function minGapMs(cls) {
  const c = classOf(cls);
  const atk = c.ivl / ASPD_DIV;
  return Math.min(atk, CAST_FLOOR) * 1000;
}

function allowBurst(p, cls, mobId, now) {
  now = now || Date.now();
  const id = mobId | 0;
  if (!p.swing) p.swing = { t: 0, n: 0, ids: Object.create(null) };
  const sw = p.swing;
  if (now - sw.t < SWING_MS && !sw.ids[id] && sw.n < SWING_MAX) {
    sw.n++;
    sw.ids[id] = 1;
    return true;
  }
  if (!p.hitWin) p.hitWin = [];
  const win = p.hitWin;
  let i = 0;
  while (i < win.length && now - win[i] >= RATE_WINDOW) i++;
  if (i) win.splice(0, i);
  const cap = Math.ceil(RATE_WINDOW / minGapMs(cls)) + RATE_SLACK;
  if (win.length >= cap) return false;
  win.push(now);
  if (!(now - sw.t < SWING_MS)) {
    p.swing = { t: now, n: 1, ids: Object.create(null) };
    p.swing.ids[id] = 1;
  } else {
    sw.ids[id] = 1;
    sw.n++;
  }
  return true;
}

/* sk -2 is a machine acting on itself (a tick blowing up), and only the host may say so.
   The caller checks the host. This function is the player-swing check. */
function hitOk(p, rec, sk) {
  const n = sk == null ? -1 : (sk | 0);
  if (n === -2) return true;
  const reach = reachOf(p.cls, n) + SLACK;
  const dx = (+p.x || 0) - (+rec.x || 0);
  const dy = (+p.y || 0) - (+rec.y || 0);
  const dist = Math.hypot(dx, dy);
  if (dist > reach) {
    hitRej++;
    console.log('[hit] range ' + (p.name || '?') + ' ' + dist.toFixed(1) + ' > ' + reach.toFixed(1));
    return false;
  }
  if (!allowBurst(p, p.cls, rec.id || 0)) {
    hitRej++;
    console.log('[hit] rate ' + (p.name || '?'));
    return false;
  }
  return true;
}

function lifeCap(cls, lvl) {
  const c = classOf(cls);
  const L = Math.max(1, Math.min(100, +lvl || 1));
  const vit = 5 * (L - 1) + VIT_GEAR;
  const raw = c.hp + (L - 1) * c.hpL + vit * 4 + HP_FLAT + HP_PER * L;
  return Math.round(raw * HP_MULT);
}

function healPerSec(p) {
  const cap = p.hpm || lifeCap(p.cls, p.lvl);
  const town = TOWNS.has(p.zi | 0) ? TOWN_PCT : 0;
  const regen = REGEN_FLAT + cap * (REGEN_PCT + town);
  const leech = LEECH * (40 + 35 * Math.max(1, +p.lvl || 1)) * SWINGS_PER_S;
  return regen + leech;
}

function allowGain(p, gain, dt) {
  const regen = healPerSec(p) * dt;
  const bar = p.hpm || 1;
  if (p.burst == null) p.burst = bar * BURST_BARS;
  p.burst = Math.min(bar * BURST_BARS, p.burst + bar * BURST_REFILL * dt);
  const need = Math.max(0, gain - regen);
  if (need <= p.burst + 1) {
    p.burst -= Math.max(0, need);
    return gain;
  }
  const allowed = regen + p.burst;
  p.burst = 0;
  return allowed;
}

function notePvp(q, landed) {
  if (!q) return;
  const hpm = q.hpm || 1;
  if (!(landed >= hpm * PVP_MIN)) return;
  const chip = Math.max(1, Math.round(landed * PVP_FRAC));
  q.pvpDebt = Math.max(q.pvpDebt || 0, chip);
  q.pvpDebtAt = Date.now();
}

function clampVitals(p, m, now) {
  now = now || Date.now();
  if (m && 'lvl' in m) p.lvl = Math.max(1, Math.min(100, +m.lvl || 1));
  const cap = lifeCap(p.cls, p.lvl);
  const floor = 80 + 12 * Math.max(1, p.lvl || 1);
  let hpm = p.hpm || floor;
  if (m && 'hpm' in m && m.hpm != null && m.hpm !== '') {
    const reported = +m.hpm || 0;
    if (reported > cap) {
      hpFlag++;
      console.log('[hp] hpm ' + (p.name || '?') + ' ' + Math.round(reported) + ' -> ' + cap);
      hpm = cap;
    } else hpm = Math.max(1, reported);
  }
  if (hpm < floor) hpm = floor;
  if (hpm > cap) hpm = cap;
  p.hpm = hpm;
  if (!(m && 'hp' in m)) return;
  let hp = Math.max(0, Math.min(hpm, +m.hp || 0));
  if (p.vitAt) {
    const dt = Math.min(5, Math.max(0, (now - p.vitAt) / 1000));
    /* A stim is about 45% of life and cannot be told from a packet. An unchanged
       bar after a real hit is not a stim. A jump of that size, once a second and
       a half, is. */
    if (p.pvpDebt > 0 && now - (p.pvpDebtAt || 0) < PVP_WINDOW && !(p.safeUntil > now)) {
      const debt = p.pvpDebt;
      p.pvpDebt = 0;
      if (hp >= p.hp - 1) {
        const stim = hp >= p.hp + hpm * 0.3 && now - (p.stimAt || 0) > 1400;
        if (stim) p.stimAt = now;
        else {
          hpFlag++;
          console.log('[hp] pvp ' + (p.name || '?'));
          hp = Math.max(0, p.hp - debt);
        }
      }
    }
    if (hp > p.hp + 1) {
      const allowed = allowGain(p, hp - p.hp, dt);
      if (hp > p.hp + allowed + 1) {
        hpFlag++;
        console.log('[hp] heal ' + (p.name || '?'));
        hp = p.hp + allowed;
      }
    }
  }
  p.hp = Math.max(0, Math.min(hpm, hp));
  p.vitAt = now;
}

function takeHitRej() { const n = hitRej; hitRej = 0; return n; }
function takeHpFlag() { const n = hpFlag; hpFlag = 0; return n; }

module.exports = {
  CLS, REACH, SLACK, CAST_FLOOR, ASPD_DIV, SWING_MS, RATE_SLACK,
  reachOf, minGapMs, allowBurst, hitOk, lifeCap, healPerSec, clampVitals, notePvp,
  takeHitRej, takeHpFlag
};
