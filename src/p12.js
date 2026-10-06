/* late additions that need the dialogue tables */
QRW.push(
 ['q16','gramps','“So that is what yes looks like. Everybody glad and nobody home. I clicked a thing like that once, when I was young. I do not remember the nine years after it. I am told I enjoyed them.” You gain 1 skill point.',()=>G.sp++,'Gramps'],
 ['q17','null','“Finished. That is the word. Not dead and not asleep. I have sat with the dying and I have sat with the finished, and I will tell you which of them was easier to love.” You gain 5 attribute points.',()=>G.ap+=5,'Sister Null'],
 ['q18','nonce','“Back on its dock? Good. Do you know how she stopped it the first time? Eleven true pages telling it that winning meant stacking sats. It has been mining with no hope of a block ever since. Honestly, same.” You receive 80 sats.',()=>{G.sats+=80;addRep('btc',20)},'Nonce'],
 ['q19','marrow','“Four thousand two hundred and eleven. She kept the list herself. That is what I cannot get past. She knew, and she wrote every name down, and she could not make herself stop.” You gain 1 skill point.',()=>G.sp++,'Marrow'],
 ['q21','nonce','“You were inside it. Actually inside. Was it… no, do not tell me. I have run a node for forty years and I would like to keep imagining it.” You receive 100 sats.',()=>{G.sats+=100;addRep('btc',25)},'Nonce'],
 ['q22','marrow','“First seen, first served. It sounds like fairness. Most capture does.” You gain 1 skill point.',()=>G.sp++,'Marrow'],
 ['q23','null','“They did not take the coin. They took the paper that stood for the coin, out of relief, because paper is easier to hold. I have watched whole faiths go that way.” You gain 5 attribute points.',()=>G.ap+=5,'Sister Null'],
 ['q24','gramps','“Ninety-three pages. Uncertain knowledge and reasoning. Huh. All that power, and what she never had was the part where you say: I might be wrong. Keep it on you, kid. Something up there is going to ask to see it.” You gain 1 skill point, and you carry the seventh part.',()=>{G.sp++;G.module=1},'Gramps']);

/* ================= the sixth wanderer =================
   The Maximalist is not on the title screen until somebody finishes the story. The flag
   lives on the account rather than on the character, so deleting the wanderer who earned
   him does not take him away again. */
function maxiCheck() {
  if (!G || ACC.maxi) return;
  if (G.q.q25 !== 3) return;
  ACC.maxi = 1;
  accSave();
  if (typeof drawCls === 'function') drawCls();
  dlg('Somebody has been waiting',
    '“Took you long enough.”\n\nHe is standing exactly where he has been standing since 2017, and he has not updated his position in any respect. ' +
    'He does not ask what happened at the end, or which way you chose, or what it cost. He asks whether you were running your own node the whole time.\n\n' +
    '“Anyway. I am available now. I do one kind of damage and there is no second best.”\n\n' +
    'The Maximalist is unlocked on every slot.',
    [['Few understand this']]);
}
/* A function declaration, not a const: the title screen asks this while the page is still
   loading, and p12 runs last. Declarations hoist across the bundle's single scope; a const
   would still be in its dead zone and throw. */
function maxiOn() { return !!(typeof ACC !== 'undefined' && ACC && ACC.maxi); }

/* ================= auras =================
   An aura is not a buff you re-cast. It is the one you have chosen, and it is on.
   Casting an aura skill swaps which one, costs nothing, and lasts until you swap again. */
function maxiSet(i, L) {
  if (P.aura && P.aura.i === i) { P.aura = null; sfx('ui'); return; }
  P.aura = { i, L, t: 0 };
  sfx('buff');
  W.fx.push({ k: 'ring', x: P.x, y: P.y, r: 3.2, t: 0, life: .45, col: '#f7931a' });
}

function maxiAura(dt) {
  if (!G || G.cls !== 'maxi' || !P.aura || mode !== 'play') return;
  const a = P.aura, L = a.L || sl(a.i) || 1;
  a.t -= dt;

  if (a.i === 3) {
    /* Toxic Maximalism: you and anybody beside you swing faster. The damage half is in pdmg. */
    P.haste = Math.max(P.haste, .3);
    if (W.merc) W.merc.haste = .3;
  } else if (a.i === 4) {
    /* Marked to Market: inside it, nothing's resistances apply. `mark` is the game's own
       take-more-damage flag, so this reuses the machinery the rest of the game uses. */
    const r = 3.5 + .15 * L;
    for (const e of W.ents) if (!e.mp && dist(e, P) < r + e.r) e.mark = Math.max(e.mark, .4);
  } else if (a.i === 7) {
    /* Proof of Work: the heat of the work, constantly, to everything close enough. */
    if (a.t <= 0) {
      a.t = .5;
      const r = 3.2 + .1 * L, m = (.3 + .07 * L) * syn(7);
      for (const e of W.ents.slice()) if (!e.mp && dist(e, P) < r + e.r) hit(e, m, true);
      W.fx.push({ k: 'ring', x: P.x, y: P.y, r, t: 0, life: .25, col: '#f7931a' });
    }
  }
}

/* The heads-up display already lists what is running; the aura belongs there. */
function maxiBuff() {
  if (!G || G.cls !== 'maxi' || !P.aura) return null;
  return CLS.maxi.sk[P.aura.i].n;
}
