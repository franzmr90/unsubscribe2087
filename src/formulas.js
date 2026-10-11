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
  /* The monster power curve. One row per level, the way Diablo's MonLvl table
     is one row per level, because that is where the shape comes from. Each row
     is a set of multipliers on the monster's own ET entry:

       [ 0 ] hp          life
       [ 1 ] dmg         damage a monster is actually given
       [ 2 ] xp          experience it pays
       [ 3 ] dmgNoKink   damage without the late-game kink, see below

     Rows 1-99 were generated from the slopes that used to sit inline in nine
     places across four files -- life +42 percent a level, damage +22, xp +80,
     plus a further 0.8 a level of damage past level 25 -- so row n reproduces
     exactly what the old arithmetic did, float artefacts and all. Change a row
     to change how that level feels; none of those nine places need to know.

     Columns 1 and 3 agree up to level 25 and diverge after it. That is not a
     mistake in the table, it is a disagreement already in the game: the kink
     is applied when a monster is spawned, but the two places that work out
     what a monster's damage is expected to be -- the adaptive-difficulty
     target and the bounty scaler -- leave it out. Unifying them would change
     the balance, so the table carries both and names the difference. */
  monLvl: [
    [1,1,1,1],[1.42,1.22,1.8,1.22],[1.8399999999999999,1.44,2.6,1.44],[2.26,1.6600000000000001,3.4000000000000004,1.6600000000000001],[2.6799999999999997,1.88,4.2,1.88],
    [3.1,2.1,5,2.1],[3.52,2.3200000000000003,5.800000000000001,2.3200000000000003],[3.94,2.54,6.6000000000000005,2.54],[4.359999999999999,2.76,7.4,2.76],[4.779999999999999,2.98,8.2,2.98],
    [5.2,3.2,9,3.2],[5.62,3.42,9.8,3.42],[6.04,3.64,10.600000000000001,3.64],[6.46,3.86,11.4,3.86],[6.88,4.08,12.200000000000001,4.08],
    [7.3,4.3,13,4.3],[7.72,4.52,13.8,4.52],[8.14,4.74,14.600000000000001,4.74],[8.559999999999999,4.96,15.4,4.96],[8.98,5.18,16.200000000000003,5.18],
    [9.4,5.4,17,5.4],[9.82,5.62,17.8,5.62],[10.24,5.84,18.6,5.84],[10.66,6.06,19.400000000000002,6.06],[11.08,6.28,20.200000000000003,6.28],
    [11.5,6.552,21,6.5],[11.92,6.82752,21.8,6.72],[12.34,7.106560000000001,22.6,6.94],[12.76,7.38912,23.400000000000002,7.16],[13.18,7.6752,24.200000000000003,7.38],
    [13.6,7.9648,25,7.6],[14.02,8.25792,25.8,7.82],[14.44,8.55456,26.6,8.04],[14.86,8.85472,27.400000000000002,8.26],[15.28,9.1584,28.200000000000003,8.48],
    [15.7,9.4656,29,8.7],[16.119999999999997,9.77632,29.8,8.92],[16.54,10.090560000000002,30.6,9.14],[16.96,10.40832,31.400000000000002,9.36],[17.38,10.729600000000001,32.2,9.58],
    [17.8,11.054400000000001,33,9.8],[18.22,11.38272,33.800000000000004,10.02],[18.64,11.714560000000002,34.6,10.24],[19.06,12.04992,35.4,10.46],[19.48,12.388799999999998,36.2,10.68],
    [19.9,12.7312,37,10.9],[20.32,13.077119999999999,37.800000000000004,11.12],[20.74,13.426559999999998,38.6,11.34],[21.16,13.77952,39.400000000000006,11.56],[21.58,14.136,40.2,11.78],
    [22,14.495999999999999,41,12],[22.419999999999998,14.85952,41.800000000000004,12.22],[22.84,15.22656,42.6,12.44],[23.259999999999998,15.59712,43.400000000000006,12.66],[23.68,15.971200000000001,44.2,12.88],
    [24.099999999999998,16.3488,45,13.1],[24.52,16.72992,45.800000000000004,13.32],[24.939999999999998,17.11456,46.6,13.540000000000001],[25.36,17.50272,47.400000000000006,13.76],[25.779999999999998,17.8944,48.2,13.98],
    [26.2,18.2896,49,14.2],[26.619999999999997,18.68832,49.800000000000004,14.42],[27.04,19.09056,50.6,14.64],[27.459999999999997,19.49632,51.400000000000006,14.86],[27.88,19.9056,52.2,15.08],
    [28.3,20.3184,53,15.3],[28.72,20.73472,53.800000000000004,15.52],[29.14,21.15456,54.6,15.74],[29.56,21.57792,55.400000000000006,15.96],[29.98,22.004799999999996,56.2,16.18],
    [30.4,22.435199999999995,57,16.4],[30.82,22.869119999999995,57.800000000000004,16.619999999999997],[31.24,23.306559999999998,58.6,16.84],[31.66,23.747519999999998,59.400000000000006,17.06],[32.08,24.192,60.2,17.28],
    [32.5,24.639999999999997,61,17.5],[32.92,25.091519999999996,61.800000000000004,17.72],[33.339999999999996,25.54656,62.6,17.94],[33.76,26.005119999999998,63.400000000000006,18.16],[34.18,26.4672,64.2,18.38],
    [34.6,26.9328,65,18.6],[35.019999999999996,27.40192,65.8,18.82],[35.44,27.87456,66.60000000000001,19.04],[35.86,28.350720000000003,67.4,19.26],[36.28,28.8304,68.2,19.48],
    [36.699999999999996,29.313599999999997,69,19.7],[37.12,29.800320000000003,69.8,19.92],[37.54,30.29056,70.60000000000001,20.14],[37.96,30.78432,71.4,20.36],[38.379999999999995,31.281600000000005,72.2,20.580000000000002],
    [38.8,31.782400000000003,73,20.8],[39.22,32.28672,73.8,21.02],[39.64,32.79456,74.60000000000001,21.24],[40.059999999999995,33.30592,75.4,21.46],[40.48,33.8208,76.2,21.68],
    [40.9,34.3392,77,21.9],[41.32,34.86112,77.80000000000001,22.12],[41.74,35.38656,78.60000000000001,22.34],[42.16,35.91552,79.4,22.56]
  ],
  /* What the rows were generated from. Used only past the end of the table:
     brutal plus a few tiers can push a monster level over 99. */
  monLvlTail: { hp: 0.42, dmg: 0.22, xp: 0.8, kinkAt: 25, kinkPer: 0.008 },
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
/* The multipliers for one monster level: the table where it reaches, and the
   slopes it was generated from past the end of it. The row is shared, so read
   it, do not write to it. */
function monLvl(ml) {
  const T = FORMULAS.monLvl;
  const i = Math.max(1, Math.round(+ml || 1));
  if (i <= T.length) return T[i - 1];
  const t = FORMULAS.monLvlTail;
  const d0 = 1 + t.dmg * (i - 1);
  return [1 + t.hp * (i - 1),
          d0 * (i > t.kinkAt ? 1 + t.kinkPer * (i - t.kinkAt) : 1),
          1 + t.xp * (i - 1),
          d0];
}

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

/* All-Hands, the cabinet in the rig. Percents are a share price.
   Knockback grows with the price. Past 100 the same hit is overvalued.
   Coordinates: x right, y down. Angle 0 launches to the facing side,
   and a positive angle lifts (negative vy). */
const OFFSITE = {
  grav: 1680,
  scale: 3.5,
  blast: { l: -80, r: 1040, t: -260, b: 700 },
  floorY: 420
};

function offsiteKnock(o) {
  o = o || {};
  const price0 = Math.max(0, +o.price || 0);
  const print = Math.max(0, +o.print || 0);
  const price = price0 + print;
  const growth = price < 100 ? 1 : 1.8;
  const kBase = o.kBase == null ? 30 : +o.kBase;
  const kGrowth = o.kGrowth == null ? 0.45 : +o.kGrowth;
  const weight = Math.max(1, +o.weight || 100);
  const knockback = (kBase + price * kGrowth * growth) * (100 / weight);
  const di = Math.max(-18, Math.min(18, +o.di || 0));
  const angle = (+o.angle || 0) + di * Math.PI / 180;
  const speed = knockback * (o.scale == null ? OFFSITE.scale : +o.scale);
  const face = o.facing < 0 ? -1 : 1;
  const hitstun = Math.max(0.08, Math.min(0.55, knockback * 0.012));
  return {
    price: price,
    knockback: knockback,
    speed: speed,
    hitstun: hitstun,
    vx: Math.cos(angle) * speed * face,
    vy: -Math.sin(angle) * speed,
    angle: angle,
    growth: growth
  };
}

function offsiteOut(x, y, blast) {
  const b = blast || OFFSITE.blast;
  return x < b.l || x > b.r || y < b.t || y > b.b;
}

/* One body, one step. Platforms are {x, y, w, gone}. Feet sit on y.
   A delisting spends a stock, zeroes the price, and returns from spawn. */
function offsiteStep(b, dt, platforms) {
  dt = Math.max(0, Math.min(0.05, +dt || 0));
  if (!b || (b.stocks | 0) <= 0) {
    if (b) b.alive = 0;
    return { out: false, dead: true };
  }
  if (b.inv > 0) b.inv = Math.max(0, b.inv - dt);
  if (b.hitstun > 0) b.hitstun = Math.max(0, b.hitstun - dt);
  if (b.stun > 0) b.stun = Math.max(0, b.stun - dt);
  /* Air keeps a launch. The floor bleeds it off, so a heavy body can land. */
  b.vx *= Math.exp(-dt * (b.ground ? 7.5 : 0.45));
  b.vy += OFFSITE.grav * dt;
  b.x += b.vx * dt;
  b.y += b.vy * dt;
  b.ground = 0;
  if (b.vy >= 0) {
    for (const p of platforms || []) {
      if (!p || p.gone) continue;
      const prev = b.y - b.vy * dt;
      if (prev <= p.y + 1 && b.y >= p.y && b.x >= p.x && b.x <= p.x + p.w) {
        b.y = p.y;
        b.vy = 0;
        b.ground = 1;
      }
    }
  }
  if (offsiteOut(b.x, b.y, b.blast || OFFSITE.blast)) {
    b.stocks = Math.max(0, (b.stocks | 0) - 1);
    const s = b.spawn || { x: 480, y: 180 };
    b.x = s.x;
    b.y = s.y;
    b.vx = 0;
    b.vy = 0;
    b.price = 0;
    b.inv = 1.5;
    b.hitstun = 0;
    b.ground = 0;
    if (b.stocks <= 0) {
      b.alive = 0;
      b.y = -500;
    }
    return { out: true, dead: b.stocks <= 0 };
  }
  return { out: false, dead: false };
}

if (typeof module !== 'undefined' && module.exports) module.exports = { FORMULAS, monLvl, braceKeep, xpNext, xpPace, campaignLevel, auraRank, auraRadius, toxicSwingMul, pailMax, pailRate, OFFSITE, offsiteKnock, offsiteOut, offsiteStep };
