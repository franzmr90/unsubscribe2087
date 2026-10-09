/* Class life, the damage-reduction braces, and the Act III experience bank.
   The game build concatenates this first. The server requires it. */
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
    /* Cipher Ward pays this much of a hit from energy. Arc Chain's ward
       pays pct more, and the two together stop at cap. What remains is life. */
    cipher: { per: 0.06, cap: 0.60 },
    ward: { sec: 1.7, pct: 0.30, cap: 0.70 }
  },
  /* One level of experience, the same curve the client uses.
     Act I pays `act1` of a kill and still uses the written levels, so Pryce is met a few up.
     Districts written above 12 pay `after`. The ladder folds 12–72 into 12–38 on Normal
     (`ladder`), then Hard and Brutal lift that reading. A full clear is aimed at the low
     40s, the mid-60s, and about 80. Pay falls off once you are more than `ahead` levels
     above the machine. */
  xp: { base: 58, pow: 1.85, ahead: 5, fade: 0.08, floor: 0.2, act1: 1.6, after: 0.41 },
  /* Written 1–12 stay. Written 12–72 is read as 12–38. Hard adds `hard`, Brutal adds `brutal`. */
  ladder: { act1: 12, top: 72, end: 38, hard: 22, brutal: 38 },
  /* Experience past the act cap, paid in one write on entering Act III. */
  bank: { levels: 1 },
  /* Maximalist auras, and the item skills that already name a radius.
     Witness Named Party is not in here: the card says allies, not a circle.
     Founder Interns and Equity stay on the founder's own body and workforce. */
  aura: {
    toxic: { aspd: 15, aspdL: 3, r: 2.2 },
    mark: { base: 3.5, per: 0.15 },
    work: { base: 3.2, per: 0.1 },
    call: { r: 6, life: 0.12, en: 0.08 },
    book: { r: 6 },
    ledger: { r: 6 },
    named: { per: 0.05 }
  },
  /* Lunch Pail. One placed store. life/lifeL are the fraction of max life it holds.
     rate/rateL are the fraction of max life it pays each second, inside r tiles. */
  pail: { life: 0.28, lifeL: 0.06, rate: 0.02, rateL: 0.004, r: 2.6 }
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
  if (cls === 'hacker') return 1 - b.ward.cap;
  return 1;
}

function xpNext(lvl) {
  const l = Math.max(1, +lvl || 1);
  return Math.round(FORMULAS.xp.base * Math.pow(l, FORMULAS.xp.pow));
}

/* The machine level a district is actually built at, before tier.
   Subpoenas and the Simulator do not come through here. */
function campaignLevel(written, diff) {
  const L = FORMULAS.ladder;
  const w = Math.max(1, Math.round(+written || 1));
  const span = (L.end - L.act1) / (L.top - L.act1);
  const base = w <= L.act1 ? w : Math.round(L.act1 + (Math.min(L.top, w) - L.act1) * span);
  const d = diff | 0;
  return base + (d >= 2 ? L.brutal : d === 1 ? L.hard : 0);
}

/* 1 while the character is within `ahead` levels of the machine.
   Past that, each extra level keeps less, down to `floor`.
   Hard and Brutal multiply whatever this leaves. */
function xpPace(lvl, ml) {
  const gap = Math.max(1, +lvl || 1) - Math.max(1, +ml || 1);
  const x = FORMULAS.xp;
  if (gap <= x.ahead) return 1;
  return Math.max(x.floor, 1 - (gap - x.ahead) * x.fade);
}

/* 1..20, or 0 when the packet is not a rank. */
function auraRank(v) {
  const n = +v;
  const i = n | 0;
  if (i !== n || i < 1 || i > 20) return 0;
  return i;
}

/* The same radii the client draws. Rank 1 is not rank 10. */
function auraRadius(i, L) {
  const a = FORMULAS.aura;
  const r = Math.max(1, Math.min(20, +L || 1));
  if (i === 4) return a.mark.base + a.mark.per * r;
  if (i === 7) return a.work.base + a.work.per * r;
  if (i === 3) return a.toxic.r;
  return 0;
}

/* Toxic Maximalism's attack-speed line: 15+3*L percent. */
function toxicSwingMul(L) {
  const n = auraRank(L);
  if (!n) return 1;
  const t = FORMULAS.aura.toxic;
  return 1 + (t.aspd + t.aspdL * n) / 100;
}

/* The printed pool: (28+6*L)% of max life. */
function pailMax(hpm, L) {
  const n = auraRank(L) || 1;
  const f = FORMULAS.pail;
  return Math.max(1, Math.round((+hpm || 1) * (f.life + f.lifeL * n)));
}
/* (2+0.4*L)% of max life each second. */
function pailRate(L) {
  const n = auraRank(L) || 1;
  const f = FORMULAS.pail;
  return f.rate + f.rateL * n;
}

if (typeof module !== 'undefined' && module.exports) module.exports = { FORMULAS, braceKeep, xpNext, xpPace, campaignLevel, auraRank, auraRadius, toxicSwingMul, pailMax, pailRate };
