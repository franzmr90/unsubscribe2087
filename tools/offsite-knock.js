/* Knockback and ring-outs for the cabinet. node tools/offsite-knock.js */
const {offsiteKnock, offsiteOut, offsiteStep, OFFSITE} = require('../src/formulas.js');
const fail = [];
const check = (n, ok, d) => { if (!ok) fail.push(n + (d ? ': ' + JSON.stringify(d) : '')); };

const jab = offsiteKnock({price: 0, print: 4, kBase: 30, kGrowth: 0.45, weight: 118, angle: 0.2, facing: 1});
const over = offsiteKnock({price: 96, print: 4, kBase: 30, kGrowth: 0.45, weight: 118, angle: 0.2, facing: 1});
check('a hit prints onto the price', jab.price === 4 && over.price === 100, {jab: jab.price, over: over.price});
check('past 100 the same print is overvalued', over.growth === 1.8 && over.knockback > jab.knockback * 1.5, {low: jab.knockback, high: over.knockback, g: over.growth});
const light = offsiteKnock({price: 80, print: 14, kBase: 110, kGrowth: 1.3, weight: 72, angle: 0.35, facing: 1});
const heavy = offsiteKnock({price: 80, print: 14, kBase: 110, kGrowth: 1.3, weight: 118, angle: 0.35, facing: 1});
check('a lighter body takes more knockback', light.knockback > heavy.knockback, {light: light.knockback, heavy: heavy.knockback});
check('a launch lifts', light.vy < 0 && heavy.vy < 0 && Math.abs(light.vy) > Math.abs(heavy.vy));

function smash(weight) {
  const b = {x: 700, y: 400, vx: 0, vy: 0, stocks: 3, price: 80, weight, spawn: {x: 200, y: 160}, alive: 1, inv: 0, hitstun: 0, stun: 0, ground: 0};
  const k = offsiteKnock({price: 80, print: 14, kBase: 110, kGrowth: 1.3, weight, angle: 0.35, facing: 1});
  b.price = k.price; b.vx = k.vx; b.vy = k.vy; b.hitstun = k.hitstun; b.ground = 0;
  const floor = [{x: 40, y: OFFSITE.floorY, w: 960}];
  let saw = 0;
  for (let i = 0; i < 120 && !saw; i++) {
    const r = offsiteStep(b, 1 / 60, floor);
    if (r.out) saw = 1;
  }
  return {stocks: b.stocks, out: saw, price: b.price};
}
const runner = smash(72), scr = smash(118);
check('the Runner rings out', runner.out === 1 && runner.stocks === 2 && runner.price === 0, runner);
check('the Scrapper stays on the book', scr.out === 0 && scr.stocks === 3 && scr.price === 94, scr);
check('a delisting is outside the rect', offsiteOut(-81, 420) && offsiteOut(1041, 420) && !offsiteOut(480, 420));

if (fail.length) {
  console.log(fail.join('\n'));
  process.exit(1);
}
console.log('offsite-knock ok', {runner, scr, low: Math.round(jab.knockback), high: Math.round(over.knockback)});
