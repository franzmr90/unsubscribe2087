/* Hit points and experience for a shared monster.

   The host client simulates where a machine stands. This module only checks the
   numbers: a reported max life has to sit near the same formula the client uses,
   and a kill is worth the card's experience, not whatever the browser claims.
   Player-count scaling is applied by the client as damage taken, not as more
   life here, or the two would stack. */
'use strict';

const BASE = {
  tick: [9, 5], drone: [15, 6], bot: [30, 10], hound: [24, 11], ad: [22, 11], hr: [28, 14],
  mech: [95, 38], seer: [34, 16], aegis: [40, 16], lancer: [36, 16], splitter: [44, 14],
  boss2: [1100, 1000], director: [120, 44], proxy: [56, 18], censor: [60, 18], boss3: [1900, 1500],
  gob: [70, 30], boss: [700, 900],
  daemon: [8, 5], wdog: [20, 10], fwall: [28, 10], cam: [18, 10], gap: [110, 120],
  wisher: [88, 22], companion: [60, 22], lull: [44, 22], ctkr: [150, 54], fetch: [48, 20],
  boss4: [2400, 2000], orphan: [66, 12], valid: [90, 26], claim: [56, 24], custod: [180, 62],
  sniper: [74, 24], oracle: [104, 26], boss5: [3000, 3000]
};
const BOSSES = { boss: 1, boss2: 1, boss3: 1, boss4: 1, boss5: 1, gap: 1 };

function mlOf(ml) { return Math.max(1, Math.min(100, ml | 0 || 1)); }

function expectMax(k, ml, flags, diffHp) {
  const card = BASE[k];
  if (!card) return 0;
  const m = mlOf(ml);
  let hp = card[0] * (1 + 0.42 * (m - 1));
  if (flags && flags.su) hp *= 5;
  else if (flags && flags.champ) hp *= 2.8;
  if (BOSSES[k]) hp *= 2.5;
  hp *= Math.max(0.25, Math.min(8, +diffHp || 1));
  return hp;
}

/* Known machines have to land near the card. Anything else is trusted only inside
   a wide absolute band, so a new kind does not need a server patch on the same day. */
function clampMax(k, ml, flags, reported, diffHp) {
  const exp = expectMax(k, ml, flags, diffHp);
  const got = +reported;
  if (!(exp > 0)) {
    if (got >= 1 && got <= 5e6) return Math.round(got);
    return 80;
  }
  if (got >= exp * 0.75 && got <= exp * 100) return Math.round(got);
  return Math.round(exp);
}

function clampXpm(v) {
  const n = +v;
  if (!(n > 0)) return 1;
  return Math.max(0.4, Math.min(5, n));
}

function killXp(k, ml, flags, scaleXp, xpm, sim) {
  const card = BASE[k] || [80, 12];
  const m = mlOf(ml);
  let v = card[1] * (1 + 0.8 * (m - 1));
  if (flags && flags.su) v *= 10;
  else if (flags && flags.champ) v *= 4;
  if (sim) v *= 0.6;
  v *= clampXpm(xpm);
  v *= Math.max(1, Math.min(13, +scaleXp || 1));
  return Math.round(v);
}

function upsert(z, row, diffHp, clean) {
  const id = row.id | 0;
  if (id < 1 || id > 100000) return null;
  const prev = z.mobs[id];
  if (prev) {
    if (prev.dead) return null;
    if (row.x != null) prev.x = +row.x || 0;
    if (row.y != null) prev.y = +row.y || 0;
    prev.miss = 0;
    return prev;
  }
  const k = clean(row.k, 16);
  if (!k) return null;
  const flags = { champ: row.champ ? 1 : 0, su: row.su ? 1 : 0 };
  const ml = mlOf(row.ml);
  const max = clampMax(k, ml, flags, row.max, diffHp);
  const rec = {
    k, ml, max, hp: max, x: +row.x || 0, y: +row.y || 0,
    champ: flags.champ, su: flags.su, min: row.min ? 1 : 0,
    xpm: clampXpm(row.xpm), dead: 0, miss: 0
  };
  z.mobs[id] = rec;
  return rec;
}

module.exports = { clampMax, killXp, upsert, expectMax, BASE };
