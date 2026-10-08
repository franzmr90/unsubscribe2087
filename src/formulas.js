/* Class life and the damage-reduction braces.
   The game build concatenates this first. The server requires it.
   A future Technomancer brace is FORMULAS.brace.hacker: null until it
   exists, then the fraction of damage still taken (0.8 means 20% off). */
const FORMULAS = {
  cls: {
    scrapper: { hp: 130, hpL: 17, ivl: 0.6, melee: 1 },
    hacker: { hp: 85, hpL: 12, ivl: 0.62, melee: 0 },
    courier: { hp: 100, hpL: 14, ivl: 0.4, melee: 0 },
    anon: { hp: 95, hpL: 13, ivl: 0.42, melee: 1 },
    founder: { hp: 102, hpL: 13, ivl: 0.6, melee: 0 },
    homesteader: { hp: 120, hpL: 16, ivl: 0.55, melee: 0 },
    witness: { hp: 102, hpL: 13, ivl: 0.68, melee: 1 },
    maxi: { hp: 118, hpL: 15, ivl: 0.5, melee: 1 }
  },
  /* Ceilings for a life report. Not a combat simulator. */
  life: {
    vitGear: 80,
    hpFlat: 2200,
    hpPer: 12,
    hpMult: 2.8,
    regenFlat: 50,
    regenPct: 0.025,
    townPct: 0.32,
    leech: 0.15,
    swingsPerS: 8,
    burstBars: 2,
    burstRefill: 0.5,
    stimJump: 0.3
  },
  pvp: { frac: 0.08, min: 0.15, window: 2500 },
  brace: {
    pdrCap: 50,
    hold: { pct: 30 },
    intern: { per: 0.05, cap: 0.20 },
    cold: { base: 0.12, extra: 0.04, cap: 0.28 },
    sentence: 0.52,
    colophon: { pdr: 14, pdrL: 3, hi: 0.45, hiPer: 0.04 },
    tick: 0.78,
    few: { per: 0.06, cap: 0.30 },
    million: { pdr: 8, pdrL: 2 },
    hacker: null
  }
};

/* Fraction of a hit still taken when that class's braces are fully up.
   Physical damage reduction, where the class has it, is the 50% cap. */
function braceKeep(cls) {
  const b = FORMULAS.brace;
  const pdr = 1 - b.pdrCap / 100;
  if (cls === 'scrapper') return 1 - b.hold.pct / 100;
  if (cls === 'founder') return 1 - b.intern.cap;
  if (cls === 'homesteader') return 1 - b.cold.cap;
  if (cls === 'witness') return pdr * (1 - b.colophon.hi) * b.sentence;
  if (cls === 'maxi') return pdr * b.tick * (1 - b.few.cap);
  if (cls === 'hacker') return b.hacker == null ? 1 : b.hacker;
  return 1;
}

if (typeof module !== 'undefined' && module.exports) module.exports = { FORMULAS, braceKeep };
