/* Cheap bounds. They do not make the server authoritative over combat — each client
   still simulates its own monsters — but they stop a modified client from reporting a
   billion experience, a one-packet player kill, a quest flag that is not a quest, or a
   save that jumps a character somewhere it could not have walked.

   Rejections are logged by the caller. Experience and player damage are clamped; a save
   that fails is refused whole. */
'use strict';

/* Highest experience figure on a monster card (PROVIDENCE). The rest of the ceiling is
   the same multipliers the client already applies: monster level, lieutenant, streak,
   outage, the adaptive xp scale (capped at 5, then 1.3 if the party woke it), shrine,
   hardcore, and the season. Difficulty and the number of people in the game arrive as
   `scale`, which is the server's own gameScale().xp. */
const XP_BASE = 3000;
const XP_LOCAL = 10 * 1.5 * 1.5 * (5 * 1.3) * 1.5 * 1.25 * 1.2;

function xpCap(ml, scale) {
  const m = Math.max(1, Math.min(100, +ml || 1));
  const s = Math.max(1, Math.min(13, +scale || 1));
  const curve = 1 + 0.8 * (m - 1);
  return Math.ceil(XP_BASE * curve * XP_LOCAL * s);
}

/* Landed player damage, after the 0.25 scale, as a fraction of the target's max life.
   It grows with the attacker's level and stops at 85%, so one packet cannot delete
   somebody and a high-level swing still matters. */
function pvpLandedCap(attackerLvl, targetMaxHp) {
  const atk = Math.max(1, Math.min(100, +attackerLvl || 1));
  const hpm = Math.max(1, +targetMaxHp || 1);
  const frac = Math.min(0.85, 0.22 + 0.008 * atk);
  return hpm * frac;
}

const QUEST_RE = /^q([1-9]|1\d|2[0-5])$/;

function questStep(prev, k, v) {
  if (typeof k !== 'string' || !QUEST_RE.test(k)) return null;
  if (typeof v !== 'number' || (v | 0) !== v || v < 1 || v > 3) return null;
  const was = prev && prev[k] ? prev[k] : 0;
  if (v <= was) return null;
  return v;
}

const HERO_ID = /^main[12]?$/;

function parseG(data) {
  if (!data || typeof data !== 'object') return null;
  if (typeof data.s !== 'string') return null;
  try {
    const o = JSON.parse(data.s);
    if (o && o.G && typeof o.G === 'object') return o.G;
    return null;
  } catch (e) { return { bad: true }; }
}

function itemsOf(g) {
  const out = [];
  if (Array.isArray(g.bag)) out.push.apply(out, g.bag);
  if (Array.isArray(g.stash)) out.push.apply(out, g.stash);
  if (g.eq && typeof g.eq === 'object') {
    for (const k in g.eq) if (g.eq[k]) out.push(g.eq[k]);
  }
  return out;
}

function finite(n) { return typeof n === 'number' && Number.isFinite(n); }

/* prev is the document already stored, or null for a first write. A first write may
   already be a high-level local character being uploaded; absolute caps still apply.
   A later write may not leap. */
function checkSave(prev, data, id) {
  if (id === 'acct') return checkAcct(prev, data);
  if (!HERO_ID.test(id)) return { ok: true };
  if (!data || typeof data !== 'object') return { ok: false, reason: 'shape' };
  const g = parseG(data);
  if (!g) return { ok: true };
  if (g.bad) return { ok: false, reason: 'unreadable' };
  const lvl = +g.lvl;
  const sats = g.sats == null ? 0 : +g.sats;
  if (!finite(lvl) || lvl < 1 || lvl > 100) return { ok: false, reason: 'level ' + g.lvl };
  if (!finite(sats) || sats < 0 || sats > 500000) return { ok: false, reason: 'sats ' + g.sats };
  if (Array.isArray(g.bag) && g.bag.length > 24) return { ok: false, reason: 'bag ' + g.bag.length };
  if (Array.isArray(g.stash) && g.stash.length > 40) return { ok: false, reason: 'stash ' + g.stash.length };
  const items = itemsOf(g);
  if (items.length > 80) return { ok: false, reason: 'items ' + items.length };
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (!it || typeof it !== 'object') continue;
    if (it.il != null && (!finite(+it.il) || +it.il < 0 || +it.il > 130)) return { ok: false, reason: 'ilvl' };
    if (it.q != null && (!finite(+it.q) || +it.q < 0 || +it.q > 4 || (+it.q | 0) !== +it.q)) return { ok: false, reason: 'quality' };
  }
  const pg = prev ? parseG(prev) : null;
  if (pg && !pg.bad && pg.lvl) {
    const dl = lvl - (+pg.lvl || 1);
    if (dl > 15) return { ok: false, reason: 'level jump ' + pg.lvl + ' to ' + lvl };
    const ds = sats - (pg.sats == null ? 0 : +pg.sats || 0);
    const dt = (+data.t || 0) - (+prev.t || 0);
    const recent = dt > 0 && dt < 120000;
    if (recent && ds > 800) return { ok: false, reason: 'sats jump +' + ds };
    if (!recent && ds > 8000) return { ok: false, reason: 'sats jump +' + ds };
    const di = items.length - itemsOf(pg).length;
    if (di > 36) return { ok: false, reason: 'item jump +' + di };
  }
  return { ok: true };
}

function checkAcct(prev, data) {
  if (!data || typeof data.s !== 'string') return { ok: true };
  let a;
  try { a = JSON.parse(data.s); } catch (e) { return { ok: false, reason: 'unreadable lockbox' }; }
  if (!a || typeof a !== 'object') return { ok: true };
  const sats = a.sats == null ? 0 : +a.sats;
  if (!finite(sats) || sats < 0 || sats > 500000) return { ok: false, reason: 'lockbox sats ' + a.sats };
  if (Array.isArray(a.stash) && a.stash.length > 36) return { ok: false, reason: 'lockbox ' + a.stash.length };
  if (prev && typeof prev.s === 'string') {
    try {
      const p = JSON.parse(prev.s);
      const ds = sats - (p && p.sats ? +p.sats : 0);
      const dt = (+data.t || 0) - (+prev.t || 0);
      const recent = dt > 0 && dt < 120000;
      if (recent && ds > 800) return { ok: false, reason: 'lockbox sats jump +' + ds };
      if (!recent && ds > 8000) return { ok: false, reason: 'lockbox sats jump +' + ds };
    } catch (e) {}
  }
  return { ok: true };
}

/* After an admin reset, refuse hero and lockbox writes for a minute so a client that
   still has the old character in memory cannot put it straight back. */
const held = new Map();
function holdSaves(uid, ms) {
  if (!uid) return;
  held.set(uid, Date.now() + (ms || 60000));
}
function savesHeld(uid) {
  const t = held.get(uid);
  if (!t) return false;
  if (t < Date.now()) { held.delete(uid); return false; }
  return true;
}

module.exports = { xpCap, pvpLandedCap, questStep, checkSave, holdSaves, savesHeld, XP_BASE };
