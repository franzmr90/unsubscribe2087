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

/* One aura per Maximalist. A second Maximalist's different aura is a second holder.
   Allies are a list: you, when the aura is someone else's, the hireling, and the
   tag-along. Party members apply it on their own client from the au field.
   Foes are monsters plus hostile stand-ins. A party member is never in that loop. */
function auraSpecs() {
  const list = [];
  if (G.cls === 'maxi' && P.aura) {
    const a = P.aura, L = a.L || sl(a.i) || 1;
    list.push({ x: P.x, y: P.y, i: a.i, L: L, self: 1, party: 1, hostile: 0, src: a });
  }
  if (typeof MP !== 'undefined' && MP.others) {
    for (const o of MP.others) {
      if (!o || !(o.au === 3 || o.au === 4 || o.au === 7)) continue;
      const party = typeof mpInParty === 'function' && mpInParty(o.uid);
      const hostile = typeof mpHostileTo === 'function' && mpHostileTo(o.uid);
      if (!party && !hostile) continue;
      list.push({ x: o.x, y: o.y, i: o.au, L: o.aL || 1, self: 0, party: party && !hostile ? 1 : 0, hostile: hostile ? 1 : 0, src: o });
    }
  }
  return list;
}
function inAura(body, h) {
  if (!body || (body.hp !== undefined && !(body.hp > 0))) return false;
  return dist(body, h) < auraVisR(h.i, h.L);
}
function nearbyAllies(h) {
  const out = [];
  if (!h || h.hostile || !(h.self || h.party)) return out;
  if (!h.self && inAura(P, h)) out.push(P);
  if (inAura(W && W.merc, h)) out.push(W.merc);
  if (inAura(W && W.tag, h)) out.push(W.tag);
  return out;
}
function auraFoes(h) {
  const out = [];
  if (!h || !W || !W.ents) return out;
  const r = auraVisR(h.i, h.L);
  for (const e of W.ents) {
    if (!e || !(e.hp > 0)) continue;
    if (dist(e, h) >= r + (e.r || 0)) continue;
    if (e.mp) {
      if (typeof mpInParty === 'function' && mpInParty(e.mp)) continue;
      if (!(typeof mpHostileTo === 'function' && mpHostileTo(e.mp))) continue;
    }
    out.push(e);
  }
  return out;
}
/* Toxic Maximalism's attack-speed line is the one already printed on the skill:
   15+3*L percent. The owner's own swing is unchanged. Bodies standing in someone
   else's copy of it, and the hireling in yours, use that percent. */
function toxicSwing(body) {
  const L = body && body.toxL;
  if (!(L > 0)) return 1;
  return 1 + (15 + 3 * L) / 100;
}
function maxiAura(dt) {
  if (!G || !P) return;
  dt = dt || 0;
  P.toxL = 0; P.mkAura = 0;
  if (W && W.merc) W.merc.toxL = 0;
  if (W && W.tag) W.tag.toxL = 0;
  if (mode !== 'play' || !W) return;
  if (G.cls === 'maxi' && P.aura) P.aura.t -= dt;
  for (const h of auraSpecs()) {
    if (h.i === 3 && !h.hostile) {
      if (h.self) P.haste = Math.max(P.haste, .3);
      for (const a of nearbyAllies(h)) {
        if (a === P) { P.haste = Math.max(P.haste, .3); P.toxL = Math.max(P.toxL, h.L); }
        else { a.haste = Math.max(a.haste || 0, .3); a.toxL = Math.max(a.toxL || 0, h.L); }
      }
    } else if (h.i === 4) {
      for (const e of auraFoes(h)) e.mark = Math.max(e.mark || 0, .4);
      if (h.hostile && inAura(P, h)) P.mkAura = .4;
    } else if (h.i === 7) {
      let ready = false;
      if (h.self) { if (P.aura.t <= 0) { P.aura.t = .5; ready = true; } }
      else { h.src.powT = (h.src.powT || 0) - dt; if (h.src.powT <= 0) { h.src.powT = .5; ready = true; } }
      if (!ready) continue;
      const m = (.3 + .07 * h.L) * (h.self ? syn(7) : 1);
      for (const e of auraFoes(h)) hit(e, m, true);
      if (h.self) W.fx.push({ k: 'ring', x: P.x, y: P.y, r: auraVisR(7, h.L), t: 0, life: .25, col: '#f7931a' });
    }
  }
}

/* The heads-up display already lists what is running; the aura belongs there. */
function maxiBuff() {
  if (!G || G.cls !== 'maxi' || !P.aura) return null;
  return CLS.maxi.sk[P.aura.i].n;
}
