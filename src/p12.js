/* late additions that need the dialogue tables */
QRW.push(
 ['q16','gramps','“I do not remember the nine years after I clicked.” You gain 1 skill point.',()=>G.sp++,'Gramps'],
 ['q17','null','“Finished. That is the word.” You gain 5 attribute points.',()=>G.ap+=5,'Sister Null'],
 ['q18','nonce','“It has been mining with no hope of a block ever since.” You receive 80 sats.',()=>{G.sats+=80;addRep('btc',20)},'Nonce'],
 ['q19','marrow','“Four thousand two hundred and eleven, and she kept the list herself.” You gain 1 skill point.',()=>G.sp++,'Marrow'],
 ['q21','nonce','“I have run a node for forty years and I would like to keep imagining it.” You receive 100 sats.',()=>{G.sats+=100;addRep('btc',25)},'Nonce'],
 ['q22','marrow','“First seen, first served.” You gain 1 skill point.',()=>G.sp++,'Marrow'],
 ['q23','null','“They took the paper, because it is easier to hold.” You gain 5 attribute points.',()=>G.ap+=5,'Sister Null'],
 ['q24','gramps','“Keep it on you, kid, something up there is going to ask to see it.” You gain 1 skill point, and you carry the seventh part.',()=>{G.sp++;G.module=1},'Gramps']);

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
  if (W && W.allies) for (const a of W.allies) if (inAura(a, h)) out.push(a);
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
/* Toxic Maximalism's attack-speed line is the one printed on the skill:
   15+3*L percent. The owner, a hireling, and anyone standing in the aura all
   take it. toxicSwing reads toxL. The run line is separate: only you run 50%
   faster, which is haste on you. A hireling and a rendered companion already
   matched that step; a summon does not. */
function toxicSwing(body) {
  const L = body && body.toxL;
  if (!(L > 0)) return 1;
  return 1 + (15 + 3 * L) / 100;
}
/* Damage half of the same card: +20% and +5% per rank. pdmg already applies it
   to whoever is swinging through hit(). A hireling's shot is raw, so it multiplies here. */
function toxicDmg(L) {
  if (!(L > 0)) return 1;
  return 1 + .2 + .05 * L;
}
function maxiAura(dt) {
  if (!G || !P) return;
  dt = dt || 0;
  P.toxL = 0; P.mkAura = 0; P.mkP = 0; P.nodeM = 0;
  if (W && W.merc) W.merc.toxL = 0;
  if (W && W.tag) { W.tag.toxL = 0; W.tag.nodeM = 0; }
  if (W && W.allies) for (const a of W.allies) if (a) a.toxL = 0;
  if (W && W.ents) for (const e of W.ents) if (e) e.mkP = 0;
  if (mode !== 'play' || !W) return;
  if (G.cls === 'maxi' && P.aura) P.aura.t -= dt;
  for (const h of auraSpecs()) {
    if (h.i === 3 && !h.hostile) {
      if (h.self) { P.haste = Math.max(P.haste, .3); P.toxL = Math.max(P.toxL, h.L); }
      for (const a of nearbyAllies(h)) {
        if (a === P) { P.haste = Math.max(P.haste, .3); P.toxL = Math.max(P.toxL, h.L); }
        else {
          a.toxL = Math.max(a.toxL || 0, h.L);
          if (a === W.merc || a === W.tag) a.haste = Math.max(a.haste || 0, .3);
        }
      }
    } else if (h.i === 4) {
      /* The card prints max(30, 20+4*L). Orange Pill, Signed For, and Dox already
         print +30% and share the mark timer, so a low rank stays at that 30%
         and a higher rank uses the card once it passes 30%. They do not stack. */
      const bonus = .2 + .04 * h.L;
      for (const e of auraFoes(h)) {
        e.mark = Math.max(e.mark || 0, .4);
        e.mkP = Math.max(e.mkP || 0, bonus);
      }
      if (h.hostile && inAura(P, h)) { P.mkAura = .4; P.mkP = Math.max(P.mkP || 0, bonus); }
    } else if (h.i === 7) {
      /* The holder is the only client that deals the pulse. Everyone else already
         draws the disc from the au field, and a second pulse would hit the same
         machines again. */
      if (!h.self) continue;
      let ready = false;
      if (P.aura.t <= 0) { P.aura.t = .5; ready = true; }
      if (!ready) continue;
      const m = (.3 + .07 * h.L) * syn(7);
      const prevSk = P.hitSk;
      P.hitSk = 7;
      P.areaTick = 1;
      try { for (const e of auraFoes(h)) hit(e, m, true); }
      finally { P.hitSk = prevSk; P.areaTick = 0; }
      W.fx.push({ k: 'ring', x: P.x, y: P.y, r: auraVisR(7, h.L), t: 0, life: .25, col: typeof auraCol === 'function' ? auraCol(7) : '#f7931a' });
    }
  }
  /* Running a Node. The hireling's shot already multiplies nodeMul. A companion
     swing borrows the companion's class, so the same check never sees the Maximalist. */
  if (G.cls === 'maxi' && sl(10) && P.aura && W.tag && W.tag.hp > 0) W.tag.nodeM = nodeMul(false);
  if (typeof mpApplyParty === 'function') mpApplyParty();
}

/* The heads-up display already lists what is running; the aura belongs there. */
function maxiBuff() {
  if (!G || G.cls !== 'maxi' || !P.aura) return null;
  return CLS.maxi.sk[P.aura.i].n;
}

/* Item skills. An index at 100 or above is not a class skill. It exists only
   while the unique that grants it is worn. Test copies are marked test:1 and
   packSave / accSave / sell / scrap leave them out of the economy. */
var itemSkillsReady=false;
const ISK={
  100:{n:'Teleport',ab:'TEL',cd:.85,cost:14,tip:'Blink up to 6.5 paces toward the pointer. Walls, hedges, and sealed tiles stop it. A second blink within a few seconds costs more. A fresh hit will not let you blink.'},
  101:{n:'Standing Call',ab:'CAL',cd:20,cost:22,tip:'You and allies within 6 paces gain 12% life and 8% energy for 10 seconds. Allies hit during it take a little less.'},
  102:{n:'Open Book',ab:'BOK',cd:14,cost:16,tip:'For 8 seconds you, and allies within 6 paces, deal 8% more damage to machines. It does not cut resists, and it does not add that damage against a player.'},
  103:{n:'Quiet Ledger',ab:'LDG',cd:12,cost:6,tip:'For 6 seconds you recover 8 energy a second, and allies within 6 paces mend a little.'},
  104:{n:'Bear Market',ab:'BER',cd:18,cost:18,tip:'For 8 seconds you hit harder and your armor is thicker. Other item skills wait. This is not a homesteader shape.'},
  105:{n:'Spare Chair',ab:'CHR',cd:16,cost:20,tip:'A colleague sits with you for 18 seconds and swings. Only one chair. A blow against a player is still the small share.'}
};
if(!AFK.pdr)AFK.pdr={k:'pdr',t:'Damage reduced by {v}%'};
function itemSkillOn(i){
  if(!itemSkillsReady||!G||!G.eq)return false;
  for(const sl of SLOTS){const it=G.eq[sl];if(!it||!it.uid||!uOk(it))continue;const u=UNIK[it.uid];if(u&&u.isk===i)return true}
  return false}
function gearPerLevel(s){
  let U;try{U=UNIK}catch(e){return}
  if(!U||!G||!G.eq||!s)return;
  const lv=G.lvl||1;
  for(const sl of SLOTS){const it=G.eq[sl];if(!it||!it.uid||!uOk(it))continue;if(typeof gearQuiet==='function'&&gearQuiet(it))continue;const u=U[it.uid];if(!u||!u.per)continue;for(const k in u.per)s[k]=(s[k]||0)+u.per[k]*lv}}
function scrubItemBinds(){
  if(!itemSkillsReady||!G)return;
  ensureMouse();
  if(G.mouse){if(G.mouse.L>=100&&!itemSkillOn(G.mouse.L))G.mouse.L=-1;if(G.mouse.R>=100&&!itemSkillOn(G.mouse.R))G.mouse.R=0}
  if(G.hot)for(let f=0;f<G.hot.length;f++)if(G.hot[f]>=100&&!itemSkillOn(G.hot[f]))G.hot[f]=null;
  if(G.slots)for(let s=0;s<G.slots.length;s++)if(G.slots[s]>=100&&!itemSkillOn(G.slots[s]))G.slots[s]=-1}
function blinkEnd(tx,ty){
  if(!P||!W)return null;
  let dx=tx-P.x,dy=ty-P.y,len=Math.hypot(dx,dy);
  if(!(len>.15)){dx=(P.dir&&P.dir.x)||1;dy=(P.dir&&P.dir.y)||0;len=Math.hypot(dx,dy)||1}
  const max=6.5;if(len>max){dx*=max/len;dy*=max/len;len=max}
  const ux=dx/len,uy=dy/len,N=W.N;let last=null;
  for(let s=.25;s<=len+1e-4;s+=.25){
    const nx=P.x+ux*Math.min(s,len),ny=P.y+uy*Math.min(s,len);
    if(nx<.45||ny<.45||nx>N-.55||ny>N-.55)break;
    if(!walk(nx,ny)||!free(nx,ny,P.r||.32)||hedgeAt(nx,ny,P))break;
    last={x:nx,y:ny}}
  return last?{x:last.x,y:last.y,ux:ux,uy:uy}:null}
function blinkCast(){
  if(!P||!W)return false;
  if(P.hitStun>0){toast('Still taking the hit');sfx('err');return false}
  const aim=P.blinkAt;let tx,ty;
  if(aim&&aim.x!=null){tx=aim.x;ty=aim.y}else{tx=P.x+(P.dir&&P.dir.x||1)*6.5;ty=P.y+(P.dir&&P.dir.y||0)*6.5}
  const end=blinkEnd(tx,ty);
  if(!end||Math.hypot(end.x-P.x,end.y-P.y)<.2){toast('No room to blink');sfx('err');return false}
  const ox=P.x,oy=P.y;P.x=end.x;P.y=end.y;P.blinkChain=2.4;P.dir={x:end.ux,y:end.uy};
  W.fx.push({k:'ring',x:ox,y:oy,r:.8,t:0,life:.25,col:'#9a6cff'},{k:'ring',x:P.x,y:P.y,r:1.1,t:0,life:.3,col:'#c9b6ff'});fxTrail(ox,oy,P.x,P.y,'#c9b6ff',.4);
  return true}
function callCast(){
  P.orders=10;calc();heal(S.maxHp*.12);G.en=Math.min(S.maxEn,G.en+S.maxEn*.08);
  const bump=a=>{if(!a||!(a.hp>0)||dist(a,P)>=6)return;a.orders=10;if(a.max)a.hp=Math.min(a.max,a.hp+(a.max)*.12)};
  if(W&&W.merc)bump(W.merc);if(W&&W.tag)bump(W.tag);if(W)for(const a of W.allies)bump(a);
  float(P.x,P.y,'Standing','#e6e2d6',0);W.fx.push({k:'ring',x:P.x,y:P.y,r:6,t:0,life:.4,col:'#e6e2d6'});return true}
function bookCast(){P.book=8;float(P.x,P.y,'Open','#9a6cff',0);W.fx.push({k:'ring',x:P.x,y:P.y,r:6,t:0,life:.4,col:'#9a6cff'});return true}
function ledgerCast(){P.ledger=6;float(P.x,P.y,'Quiet','#7be495',0);W.fx.push({k:'ring',x:P.x,y:P.y,r:6,t:0,life:.4,col:'#7be495'});return true}
function bearCast(){if(P.bear>0){P.bear=0;calc();float(P.x,P.y,'Up','#c9a868',0);return true}P.bear=8;calc();float(P.x,P.y,'Bear','#c9a868',0);return true}
function chairCast(){summon({kind:'chair',m:.42,ivl:.85,hp:S.maxHp*.55,max:S.maxHp*.55,r:.34,spd:3.4,life:18},1);float(P.x,P.y,'Chair','#e6e2d6',0);return true}
function castItem(i){
  castWhy='no';
  const sk=ISK[i];if(!sk||!itemSkillOn(i)||!P)return;
  if(P.castWait>0){castWhy='wait';toast('Still casting');sfx('err');return}
  if(P.silence>0){castWhy='wait';toast('Silenced');sfx('err');return}
  if(P.dash){castWhy='wait';return}
  if(P.bear>0&&i!==104){castWhy='no';toast('The bear does not cast that');sfx('err');return}
  if((P.cd[i]||0)>0){castWhy='wait';return}
  if(i===100&&P.hitStun>0){castWhy='wait';toast('Still taking the hit');sfx('err');return}
  const pay=sk.cost+(i===100&&P.blinkChain>0?12:0);
  if(G.en<pay){castWhy='wait';toast('Not enough energy');scRelay();sfx('err');return}
  let ok=false;
  if(i===100)ok=blinkCast();else if(i===101)ok=callCast();else if(i===102)ok=bookCast();else if(i===103)ok=ledgerCast();else if(i===104)ok=bearCast();else if(i===105)ok=chairCast();
  if(!ok){castWhy='no';return}
  if(typeof mpNoteCast==='function')mpNoteCast(i);
  G.en-=pay;P.cd[i]=sk.cd*(1-Math.min(.6,S.cdr||0));castWhy='ok';sfx('cast')}
function itemSkillTick(dt){
  if(!P)return;
  if(P.hitStun>0)P.hitStun=Math.max(0,P.hitStun-dt);if(P.remoteCd>0)P.remoteCd=Math.max(0,P.remoteCd-dt);
  if(P.blinkChain>0)P.blinkChain=Math.max(0,P.blinkChain-dt);
  if(P.orders>0){P.orders-=dt;if(P.orders<=0){P.orders=0;if(G)calc()}}
  if(P.book>0)P.book=Math.max(0,P.book-dt);
  if(P.bear>0){P.bear-=dt;if(P.bear<=0){P.bear=0;if(G)calc()}}
  if(P.rLedger>0&&G&&S)heal(3*dt);
  if(P.ledger>0){P.ledger=Math.max(0,P.ledger-dt);if(G&&S)G.en=Math.min(S.maxEn,G.en+8*dt);
    if(W){const mend=a=>{if(a&&a.hp>0&&dist(a,P)<6){if(a.max)a.hp=Math.min(a.max,a.hp+3*dt)}};mend(W.merc);mend(W.tag);for(const a of W.allies)mend(a)}}
  if(P.cd)for(const id of [100,101,102,103,104,105])if(P.cd[id]>0)P.cd[id]=Math.max(0,P.cd[id]-dt);
  if(W){if(W.merc&&W.merc.orders>0)W.merc.orders=Math.max(0,W.merc.orders-dt);if(W.tag&&W.tag.orders>0)W.tag.orders=Math.max(0,W.tag.orders-dt);for(const a of W.allies)if(a.orders>0)a.orders=Math.max(0,a.orders-dt)}}
function tryGear(id){
  if(!G)return null;const u=UNI.find(x=>x.id===id);if(!u)return null;
  const it=mkFixed(u,Math.max(u.il,G.lvl||1),4);it.test=1;it.id=true;it.val=0;
  const old=G.eq[u.slot];G.eq[u.slot]=it;if(old&&!old.test&&bagCan(old))G.bag.push(old);else if(old&&!old.test)addDrop({it:old},P.x,P.y);calc();return it}
function itemTryRow(){
  if(typeof devOn==='function'&&!devOn())return '';
  const rows=[['cipher','The Cipher Mantle'],['call','The Standing Call'],['book','The Open Book'],['ledger','The Quiet Ledger'],['bear','The Bear Market'],['chair','The Spare Chair']];
  return '<h3>Test gear</h3><p class="hint">Puts on a copy marked test. A test copy is left out of saves, the lockbox, sales, and scrap. A real drop of the same name is a normal unique and does save.</p><div class="list">'+rows.map(r=>'<button class="li" data-try="'+r[0]+'"><div><b>'+r[1]+'</b><span>Item skill, not saved.</span></div></button>').join('')+'</div>'}
function itemSkillPane(){
  if(!G||!itemSkillsReady)return '';
  const ids=[100,101,102,103,104,105].filter(itemSkillOn);
  let h='<h3>Item skills</h3>';
  if(!ids.length)return h+'<p class="hint">Some uniques grant a skill while you wear them. Take the item off and the skill leaves the buttons.</p>';
  h+='<div class="list">';
  for(const i of ids){const s=ISK[i];h+='<button class="li'+(sel&&sel.isk===i?' on':'')+'" data-isk="'+i+'"><div><b>'+s.n+'</b><span>+1 to '+s.n+' (item skill)</span><span>'+s.tip+'</span><span>'+s.cost+' energy · '+s.cd+'s</span></div></button>'}
  h+='</div>';
  if(sel&&sel.isk>=100&&itemSkillOn(sel.isk)){const i=sel.isk,s=ISK[i];
    h+='<div class="card"><div class="nm q4">'+s.n+'</div><div class="ln">'+s.tip+'</div><div class="ln off">+1 to '+s.n+' (item skill)</div><div class="row">'+[0,1,2].map(k=>'<button class="ghost" data-iskkey="'+k+'">'+slotKeyLabel(k)+(G.slots[k]===i?' ✓':'')+'</button>').join('')+(uiTouch()?'':'<button class="ghost" data-iskside="L">Left click'+(G.mouse&&G.mouse.L===i?' ✓':'')+'</button><button class="ghost" data-iskside="R">Right click'+(G.mouse&&G.mouse.R===i?' ✓':'')+'</button>')+'</div></div>'}
  return h}
itemSkillsReady=true;

/* Text eggs. The sentences live on EGG, the memos, the feats, and the lemon errand.
   The three consumables are requirement-free: no slot, level 1, and zero Might, Reflex, and Bandwidth. */
let eggTipN=0;
function eggFree(it){it.free=1;it.req=1;it.reqMgt=0;it.reqRef=0;it.reqBnd=0;it.aff=it.aff||[];it.id=true;return it}
function eggHelloItem(){return eggFree({name:EGG.helloName,base:EGG.helloName,q:0,il:1,hello:1,junk:1,val:1,fl:EGG.helloFl})}
function eggPieItem(){return eggFree({name:EGG.pieName,base:EGG.pieName,q:1,il:1,pie:1,val:0,fl:pieFl()})}
function eggSourItem(){return eggFree({name:EGG.sourName,base:EGG.sourName,q:1,il:1,sour:1,val:0,fl:EGG.sourFl})}
function pieFl(){const a=typeof actOf==='function'?actOf(G.zone||0):1;return EGG.pieBase+' '+(EGG.pieWhere[a]||EGG.pieWhere[1])}
function eggPaper(){const i=EGG.paperAt;if(!G.memos.includes(i))G.memos.push(i);G.st.block0=1;sfx('page');dlg(MEMOS[i][0],MEMOS[i][1],[[EGG.paperKeep]])}
function eggOnDeath(){G.obit=G.obit||[];G.obit.push(EGG.pundits[((G.deaths||1)-1)%EGG.pundits.length])}
function eggPryceNote(){if(!DY||!/Pryce/.test(DY.by||''))return;const note=$('deathNote');note.textContent=note.textContent+' '+EGG.pryceLine}
function eggBoard(){const n=G.deaths||0,lines=(G.obit&&G.obit.length)?G.obit.slice(-6).join(' '):EGG.boardNone;dlg(EGG.obitTitle,EGG.board.replace('{n}',n)+' '+lines,[[EGG.leave]])}
function eggFlyer(){G.sawFlyer=1;dlg(EGG.flyerTitle,EGG.flyerBody,[[EGG.leave,()=>dlg(EGG.gramps,EGG.grampsSnatch,[[EGG.leave]])]])}
function eggHelloFrame(){dlg(EGG.helloTitle,EGG.helloFrame,[[EGG.leave]])}
function eggMemoBtn(i){if(i!==EGG.linkAt)return '';return '<button type="button" class="eggLink" data-egg="link">'+esc(EGG.linkFace)+'</button>'}
function eggClick(k){if(k==='link')eggOpenLink()}
function eggOpenLink(){dlg(EGG.wren,EGG.wrenWarn,[[EGG.linkOpen,()=>{G.st.hello404=1;if(!G.st.helloGot){G.st.helloGot=1;giveItem(eggHelloItem())}dlg(EGG.miss,EGG.link404,[[EGG.leave]])}],[EGG.leave]])}
function eggUse(i){const it=G.bag[i];if(!it)return false;if(it.hello){toast(EGG.brendaNo);sfx('err');return false}if(it.pie){heal(S.maxHp);G.st.lunch=1;G.bag.splice(i,1);sfx('stim');sel=null;calc();return true}if(it.sour){heal(Math.max(1,S.maxHp*.3));G.bag.splice(i,1);sfx('stim');sel=null;calc();return true}return false}
function eggBuyPie(){if(!(W&&W.pie)||vendKind()!=='brenda')return false;if(!bagCan(eggPieItem())){toast(EGG.packFull);sfx('err');return false}return vendPay(10000,EGG.pieName,()=>{if(!bagCan(eggPieItem())){toast(EGG.packFull);sfx('err');return}if(!spendSats(10000)){eggPoor();return}W.pie=0;G.bag.push(eggPieItem());sfx('coin');toast(EGG.paid);if(mode==='sheet')drawSheet()})}
function eggPoor(){if(!(G&&G.cls==='maxi'))return;toast(EGG.poor);if(P)float(P.x,P.y,EGG.poor,'#f7931a')}
function eggLaser(){if(P)parts(P.x,P.y,16,['#ff2a2a','#fff'],2,1.2);if(!G||G.cls!=='maxi'){toast(EGG.laserNo);return}G.st.laser=G.st.laser?0:1;toast(G.st.laser?EGG.laserOn:EGG.laserOff);if(G.st.laser){toast(EGG.few);if(P)float(P.x,P.y,EGG.few,'#ff2a2a')}}
function eggTip(){if(typeof mode!=='undefined'&&mode!=='play')return;const d=$('dlg');if(d&&!d.hidden)return;toast(EGG.tips[eggTipN++%EGG.tips.length])}
function eggEyes(X,hy,f){const dx=(f||1)*42;ctx.save();ctx.strokeStyle='#ff2a2a';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(X-3,hy);ctx.lineTo(X-3+dx,hy-8);ctx.moveTo(X+3,hy);ctx.lineTo(X+3+dx,hy-8);ctx.stroke();ctx.restore();glow(X,hy,28,'#ff2a2a',.5);light(X,hy,120,'#ff2a2a')}
let scRelaySaid=0,scStimSaid=0,scSatN=0;
let scBargeSaid=0,scOverSaid=0,scReynDog=0;
function scVisitClear(){scRelaySaid=0;scStimSaid=0;scSatN=0;scBargeSaid=0;scOverSaid=0;scReynDog=0;scOverMez=0}
function scRelay(){if(scRelaySaid)return;scRelaySaid=1;toast(SCE.relay)}
function scBroke(why){if(!scSatN){scSatN=1;toast(SCE.sats);return}if(scSatN===1){scSatN=2;toast(SCE.vapour);return}toast(why||SCE.short)}
function scStimBark(empty){if(scStimSaid)return false;scStimSaid=1;toast(SCE.stim);if(empty)toast(SCE.pack);return true}
function scRoom(){return !!(W&&W.z&&!W.z.boss&&(W.z.town||W.z.sim))}
function scStipend(){G.st=G.st||{};if(G.st.stipend){toast(SCE.seen);return false}G.st.stipend=1;G.sats=(G.sats|0)+1;sfx('coin');toast(SCE.seen);return true}
function scCrawl(){if((P.slow||0)<10)P.slow=10;toast(SCE.early);return true}
function scLine(raw){const s=String(raw||'').trim().toLowerCase().replace(/\s+/g,' ');if(!scRoom())return false;if(s===SCE.stipend)return scStipend();if(s===SCE.note)return scCrawl();return false}
function scSayHTML(){return '<div class="row"><input id="scSay" maxlength="64" autocomplete="off" style="flex:1;min-width:0" placeholder="'+esc(SCE.hint)+'"><button type="button" class="ghost" data-scsay="1">'+esc(SCE.say)+'</button></div>'}
function scTariff(){G.st=G.st||{};const line=(G.lean||0)>15?SCE.helloBtc:SCE.hello,btns=[[SCE.leave]];if(!G.st.tariff)btns.unshift([SCE.wait,()=>{G.st.tariff=1;dlg(SCE.who,SCE.spread,[[SCE.leave]])}]);dlg(SCE.who,'\u201c'+line+'\u201d',btns)}
function eggDrawProp(n,X,Y){ctx.strokeStyle=OL;ctx.lineWidth=1.4;
  if(n.id==='paper'){shadow(X,Y,10);box(X-16,Y-36,32,22,1,'#e6d7a8');ctx.fillStyle='#6a5a40';ctx.fillRect(X-12,Y-32,24,1);ctx.fillRect(X-12,Y-28,18,1);label(X,Y-48,EGG.mast,'#e6d7a8','700 8.5px Cinzel,serif');return}
  if(n.id==='flyer'){shadow(X,Y,8);box(X-14,Y-32,28,20,1,'#f4efe2');ctx.fillStyle='#e6d24a';ctx.beginPath();ctx.arc(X,Y-22,5,0,6.283);ctx.fill();label(X,Y-44,EGG.lemonLbl,'#e6d24a','700 8px Cinzel,serif');return}
  if(n.id==='obit'){shadow(X,Y,12);box(X-18,Y-40,36,26,1,'#2a2630');ctx.fillStyle='#e6e2d6';ctx.font='700 8px Cinzel,serif';ctx.textAlign='center';ctx.fillText(String(G.deaths||0),X,Y-22);label(X,Y-52,EGG.still,'#e6e2d6','700 8px Cinzel,serif');return}
  shadow(X,Y,16);poly([X-22,Y-8,X,Y-2,X,Y+4,X-22,Y-2],'#4a5060');poly([X,Y-2,X+22,Y-8,X+22,Y-2,X,Y+4],'#353a48');poly([X-22,Y-20,X,Y-28,X+22,Y-20,X,Y-12],'#6a7488');label(X,Y-40,EGG.helloTitle,'#ffe36b');glow(X,Y-16,40,'#ffe36b',.35)}
/* Long StarCraft arcs. Side content on G.st. It does not write G.q, does not replace a zone lieutenant, and does not refuse a summon. */
let scOverMez=0;
function arcSt(){G.st=G.st||{};return G.st}
function arcMemo(i){if(i==null||!G)return;if(!G.memos.includes(i))G.memos.push(i);sfx('page')}
function arcSlip(name,fl,aff,uid){const it=finishCharm(1,'slip',aff||[],{q:1,name:name,fl:fl,req:1,uid:uid,val:1});it.free=1;it.req=1;it.reqMgt=0;it.reqRef=0;it.reqBnd=0;it.id=true;return it}
function arcGive(it){if(!it)return;if(bagCan(it))G.bag.push(it);else if(P)addDrop({it:it},P.x,P.y);else G.bag.push(it)}
function arcHave(uid){if((G.cslots||[]).some(c=>c&&c.uid===uid))return true;return (G.bag||[]).some(c=>c&&c.uid===uid)}
function arcHoldWorn(){return (G.cslots||[]).some(c=>c&&c.uid==='hold')}
function arcPace(s){if(s&&(G.cslots||[]).some(c=>c&&c.uid==='minute')&&P&&(P.zoneT||0)<60)s.mspd=(s.mspd||0)+8}
function arcSpot(dx,dy){const s=W.start||{x:10,y:10};let x=s.x+(dx||1.4),y=s.y+(dy||.6);if(typeof nearFree==='function'){const n=nearFree({x:x,y:y},2);if(n)return n}return {x:x,y:y}}
function arcObj(id,dx,dy){if(!W||!W.objs)return null;if(W.objs.some(o=>o&&o.k==='arc'&&o.id===id&&!o.used))return null;const p=arcSpot(dx,dy);const o={k:'arc',id:id,x:p.x,y:p.y,used:0};W.objs.push(o);return o}
function arcNpc(id,x,y,name){if(!W||!W.npcs||W.npcs.some(n=>n.id===id))return;W.npcs.push({id:id,x:x,y:y,name:name,col:'#8a7a62',act:'Talk'})}
function arcLt(k,x,y,name,tag,hp){let e=null;for(let i=0;i<8&&!e;i++)e=spawn(k,x+Math.cos(i)*i*.45,y+Math.sin(i)*i*.45,{minion:1});if(!e)return null;e.arc=tag;e.name=name;e.minion=1;if(hp){e.hp=hp;e.max=hp;const t=ET[k],ml=(W&&W.ml)||1,hp0=t?t.hp*(1+.42*(ml-1)):0;if(hp0>0){e.bornHp=hp/hp0;e.dynHp=e.bornHp}}return e}
function arcSkipMerc(){if(!G||!G.merc||G.merc.k!=='reyn'||!W)return false;if(W.zi===5)return true;if(W.zi===22&&arcSt().reynOut)return true;return false}
function arcMercMay(tg){if(!tg||tg.person)return false;if(tg.arc==='visor'&&P&&dist(P,tg)>6)return false;return true}
function arcOnRug(){if(P&&P.arcNo>0)return false;const o=(W.objs||[]).find(x=>x&&x.k==='arc'&&x.id==='rug'&&!x.used);return !!(o&&dist(o,P)<1.35)}
function arcHurt(src){if(src&&src.arc==='first'&&!arcOnRug()){if(P)float(P.x,P.y,ARC.off,'#e6e2d6',0);return 'miss'}if(P&&P.holdCut&&src&&typeof isBoss==='function'&&isBoss(src.k)){P.holdCut=0;return .85}return 1}
function arcOverWord(){const s=arcSt();if(s.overChoice==='truth')return ARC.overNo;if(s.overChoice==='true')return ARC.overGone;const a=typeof actOf==='function'?actOf(W&&W.zi):1;return a>=4?ARC.over4:a===3?ARC.over3:a===2?ARC.over2:ARC.over}
function arcOverItem(dup){const it=arcSlip(dup?ARC.over:ARC.over,ARC.overFl,[],dup?'overdup':'over');it.over=1;it.parts=1;if(dup)it.dup=1;return it}
function arcOver(){const s=arcSt();if(s.overChoice==='true')return false;s.overUsed=1;if(P){P.over=3;float(P.x,P.y,CLS[G.cls].n,'#e0bd6e',0)}if(!scOverSaid){scOverSaid=1;toast(arcOverWord())}if(W&&(W.zi===11||W.zi===10||W.zi===13))s.overFeat=1;return true}
function arcBlind(){if(!(P&&P.over>0)||arcSt().overChoice==='true')return false;toast(ARC.notYou);sfx('err');return true}
function arcBarge(){if(scBargeSaid)return;scBargeSaid=1;toast(ARC.barge)}
function arcBlankOver(truth){const touch=it=>{if(!it||!it.over)return;if(truth){it.name=ARC.overNo;it.fl=ARC.truthPay}else{it.quiet=1;it.name=ARC.overGone;it.fl=ARC.trueOnce;it.aff=[]}};for(const it of G.bag||[])touch(it);for(const it of G.cslots||[])touch(it)}
function arcLaunch(flag,line){const s=arcSt();if(s[flag])return;s[flag]=1;if(arcHoldWorn()){toast(line);if(P)P.holdCut=1}else setTimeout(()=>{toast(line)},1400)}
function arcNote(zi){const s=arcSt();if(s.qAdj>=(typeof actOf==='function'?actOf(zi):1))return;const a=typeof actOf==='function'?actOf(zi):1;if(a<2)return;s.qAdj=a;if(a===2)toast(ARC.good);else if(a===3)toast(ARC.kind);else if(a===4)toast(ARC.delighted)}
function arcPromo(){if(!G.merc||G.merc.k!=='reyn'||G.merc.dead)return;const a=typeof actOf==='function'?actOf(W.zi):1,s=arcSt(),bit=1<<a;if(s.reynPromo&bit)return;s.reynPromo=(s.reynPromo||0)|bit;toast(a>=5&&s.reynUnemp?ARC.promo5:a===4?ARC.promo4:a===3?ARC.promo3:a===2?ARC.promo2:ARC.promo1)}
function arcEnter(zi){if(!G||!W)return;const s=arcSt();if(P){P.zoneT=0;P.zonePing=0}if(W.z&&W.z.boss&&arcHoldWorn()&&P)P.holdCut=1;
  if(zi===5&&!(G.q&&G.q.q5===3)){arcLaunch('ln5',ARC.lnRoom);arcMemo(ARCM.next)}
  if(zi===5&&G.merc&&G.merc.k==='reyn'&&!G.merc.dead&&!s.reynDoor){s.reynDoor=1;toast(ARC.door)}
  if(zi===11){arcLaunch('ln11',ARC.lnAfternoon);if(s.overUsed&&!scOverMez){scOverMez=1;if(P)float(P.x,P.y,CLS[G.cls].n,'#e0bd6e',0)}}
  if(zi===16&&!(G.q&&G.q.q15===3)&&!s.sold){s.lnTrack=1;s.ln16=1}
  if(zi===22)arcLaunch('ln22',ARC.ln2035);
  if(zi===32){arcLaunch('ln32',ARC.lnYou);arcMemo(ARCM.hold)}
  if((G.q&&G.q.q15===3)||s.sold)s.lnTrack=0;
  if(s.six===1&&zi===1&&s.sixLeft==null){s.sixLeft=60;s.sixWhen=Math.round(G.time||0)}
  if(zi===1&&s.six===1)arcObj('six',1.2,.2);
  if(zi===4){const a=W.start||{x:10,y:10};arcNpc('pell',a.x+1.8,a.y+1.2,ARC.pell);arcNpc('picket',a.x-1.6,a.y+.8,'A picketer');if(!s.reynVisor&&!(W.ents||[]).some(e=>e.arc==='visor')){const p=arcSpot(2.2,1.4);const e=arcLt('bot',p.x,p.y,ARC.visor,'visor',90);if(e)e.aggro=false}}
  if(zi===10&&!s.queenRead)arcObj('queen',1.1,-.4);
  if(zi===11&&!s.queenDraft)arcObj('draft',1.6,.8);
  if(zi===13){if(s.reynMet&&!s.reynPage)arcObj('grief',1.2,1.1);if(!s.invRead)arcObj('inv',-1.2,.6);if(!s.retractRead)arcObj('retract',-1.6,1.4);if(s.overUsed&&!s.voteRead)arcObj('vote',1.8,-.6);if(!s.headRead)arcObj('head',2.1,.4);if(s.queenGo&&!s.queenFile&&!(W.ents||[]).some(e=>e.arc==='first')){const p=arcSpot(2.4,.2);const e=arcLt('hr',p.x,p.y,ARC.first,'first',110);if(e)e.aggro=true;arcObj('rug',2.2,.5)}}
  if(zi===12&&(s.ln5||s.ln11||s.ln16)&&!s.lnHold&&!arcHave('hold')&&!(W.ents||[]).some(e=>e.arc==='hold')){const p=arcSpot(1.8,.4);const e=arcLt('director',p.x,p.y,ARC.hold,'hold',100);if(e)e.aggro=false;s.holdT=20;arcObj('hold',1.5,.2)}
  if(zi===2&&s.bargeQ===1&&s.bargeQ<3){arcObj('cart',.8,.2);arcObj('sign',2.4,-.2);arcObj('dock',3.2,1.2)}
  if(zi===6&&!s.overGot)arcObj('over',1.1,.4);
  if(zi===6&&s.overGot&&!s.belDead&&!(W.ents||[]).some(e=>e.arc==='bel')){const p=arcSpot(-1.4,.8);const e=arcLt('drone',p.x,p.y,ARC.believer,'bel',22);if(e)e.aggro=true}
  if(zi===22){arcObj('sit',1.4,.2);arcObj('sofa',2.2,-.4);const ms=W.start||{x:10,y:10};arcNpc('mile',ms.x+1.2,ms.y-1.1,ARC.where);if(s.queenFile==='one'&&!s.mileOne){s.mileOne=1;toast(ARC.mileOne)}else if(s.queenFile&&s.queenFile!=='one'&&!s.mileSofa){s.mileSofa=1;toast(ARC.mileSofa)}if(s.six>=2&&!s.mileDogs){s.mileDogs=1;toast(ARC.sofaDogs);toast(s.six===2?ARC.labelOn:ARC.labelLate)}}
  if(zi===7&&G.merc&&G.merc.k==='reyn'&&!s.reynLift){s.reynLift=1;toast(ARC.told)}
  if(zi===7&&!s.bargeUp&&((G.stims||0)>=((S&&S.cap)||4)||s.bargeQ)){s.bargeUp=1;toast(ARC.barge)}
  if(W.z&&W.z.town){arcPromo();arcNote(zi);const ts=W.start||{x:12,y:12};if(zi===17)arcNpc('napkin',ts.x+1.4,ts.y+.6,ARC.napkin);if(zi===18){arcNpc('ives',ts.x-1.6,ts.y+.8,ARC.ives);arcNpc('keeper',ts.x+1.8,ts.y-.4,ARC.keeper)}if(zi===27)arcNpc('page',ts.x+.4,ts.y+1.2,ARC.never);if(G.merc&&G.merc.k==='reyn'&&!G.merc.dead&&G.q&&G.q.q5===3&&!s.reynTook){s.reynTook=1;setTimeout(()=>dlg(ARC.reynN,ARC.took,[[ARC.tookN],[ARC.tookY]]),600)}}
}
function arcLabel(o){if(!o||o.used)return '';const id=o.id;if(id==='six')return ARC.sixN;if(id==='draft')return ARC.draft;if(id==='rug'||id==='hold')return ARC.decline;if(id==='cart')return ARC.cart;if(id==='sign')return ARC.sign;if(id==='dock')return ARC.dock;if(id==='over')return ARC.over;if(id==='sofa')return ARC.unsub;if(id==='sit')return ARC.lookFine;return ARC.read}
function arcUse(o){if(!o||o.used)return;const s=arcSt(),id=o.id;
  if(id==='six'){o.used=1;if((s.sixLeft||0)>0){s.six=2;s.sixFeat=1;toast(ARC.sixN);for(let i=0;i<6;i++){const e=arcLt('tick',P.x+.4+i*.35,P.y,ARC.sixN,'six',14);if(e)e.aggro=true}const b=arcLt('bot',P.x+1.2,P.y+.8,ARC.early,'early',26);if(b)b.aggro=true}else{s.six=3;toast(ARC.dressed);toast(ARC.lateBill);G.credits=Math.max(0,(G.credits||0)-Math.floor(20*(G.cpi||1)))}return}
  if(id==='queen'){o.used=1;s.queenRead=1;arcMemo(ARCM.queen);dlg(ARC.queenT,ARC.queenB,[[ARC.read]]);return}
  if(id==='draft'){o.used=1;s.queenDraft=1;toast(ARC.discontinued);return}
  if(id==='grief'){o.used=1;s.reynPage=1;arcMemo(ARCM.grief);if(!s.reynNumber){s.reynNumber=1;arcGive(arcSlip(ARC.number,ARC.numberFl,[{k:'armor',v:8}],'number'))}dlg(ARC.reynN,ARC.griefAsk+' '+ARC.grief,[[ARC.read]]);return}
  if(id==='inv'){o.used=1;s.invRead=1;arcMemo(ARCM.inv);dlg(ARC.inv,ARC.inv+(s.sixWhen!=null?' '+s.sixWhen:''),[[ARC.read]]);return}
  if(id==='retract'){o.used=1;s.retractRead=1;arcMemo(ARCM.retract);dlg(ARC.retract,MEMOS[ARCM.retract][1],[[ARC.read]]);return}
  if(id==='vote'){o.used=1;s.voteRead=1;arcMemo(ARCM.vote);dlg(ARC.vote,ARC.vote,[[ARC.read]]);return}
  if(id==='head'){o.used=1;s.headRead=1;arcMemo(ARCM.head);dlg(ARC.head,MEMOS[ARCM.head][1],[[ARC.read]]);return}
  if(id==='rug'){if(P)P.arcNo=2.5;toast(ARC.off);return}
  if(id==='hold'){o.used=1;s.lnHold=1;s.holdT=0;const e=(W.ents||[]).find(x=>x.arc==='hold'&&x.hp>0);if(e)e.hp=Math.max(8,Math.round(e.max*.12));toast(ARC.filed);return}
  if(id==='sign'){s.bargeSub=(s.bargeSub||0)+1;s.bargeBill=(s.bargeBill||0)+Math.floor(40*(G.cpi||1));G.credits=Math.max(0,(G.credits||0)-Math.floor(40*(G.cpi||1)));toast(ARC.sign);return}
  if(id==='dock'){o.used=1;if(!s.bargeWave){s.bargeWave=1;for(let i=0;i<3;i++){const e=arcLt('tick',P.x+1+i*.4,P.y,ARC.cart,'mall',16);if(e)e.aggro=true}}if(s.bargeSub){const e=arcLt('mech',P.x+1.4,P.y,ARC.tier,'tier',140);if(e)e.aggro=true}else{s.bargeDock=1;const it=arcSlip(ARC.tier,ARC.tierFl,[], 'tierlab');it.parts=2;it.junk=1;arcGive(it);toast(ARC.tierFl)}return}
  if(id==='over'){o.used=1;if(!s.overGot){s.overGot=1;arcGive(arcOverItem(0))}return}
  if(id==='sit'){o.used=1;if(G.merc&&G.merc.k==='reyn'){s.reynOut=1;W.merc=null;toast(ARC.lookFine)}return}
  if(id==='sofa'){dlg(ARC.cart,ARC.carries,[[ARC.unsub,()=>{o.used=1;s.bargeSofa=1;toast(ARC.carries)}],[ARC.leaveSub]]);return}
}
function arcDead(e){const s=arcSt();if(e.arc==='visor'){s.reynVisor=1;if(G.merc&&G.merc.k==='reyn')toast(ARC.stayDown)}else if(e.arc==='early'){}else if(e.arc==='first'&&!s.queenFile){setTimeout(()=>dlg(ARC.ives,ARC.which,[[ARC.fileOne,()=>arcQueen('one')],[ARC.fileNone,()=>arcQueen('none')]]),400)}else if(e.arc==='hold'){s.lnHold=1;if(!arcHave('hold')){arcGive(arcSlip(ARC.holdN,ARC.holdFl,[],'hold'));s.lnCharm=1}}else if(e.arc==='tier'){s.bargeDock=1}else if(e.arc==='bel'){s.belDead=1;toast(ARC.hadIt);if(!s.overDup){s.overDup=1;arcGive(arcOverItem(1))}}}
function arcQueen(which){const s=arcSt();if(s.queenFile)return;s.queenFile=which;if(which==='one'){arcMemo(ARCM.kind);dlg(ARC.draft,ARC.kindAsk,[[ARC.giveIt]])}else{arcMemo(ARCM.blank);dlg(ARC.ives,ARC.stayed,[[ARC.leave]])}if(!s.queenMargin){s.queenMargin=1;arcGive(arcSlip(ARC.margin,ARC.marginFl,[{k:'thorns',v:4}],'margin'))}}
function arcTalk(id){const s=arcSt();
  if(id==='pell'){dlg(ARC.pell,ARC.pellLine,[[ARC.leave]]);return true}
  if(id==='picket'){if(G.merc&&G.merc.k==='reyn')toast(ARC.hands);dlg('A picketer',ARC.hands,[[ARC.leave]]);return true}
  if(id==='ives'){dlg(ARC.ives,ARC.ivesAsk,[[ARC.ivesGo,()=>{s.queenGo=1}],[ARC.ivesStay]]);return true}
  if(id==='keeper'){const b=[[ARC.leave]];if(!arcHave('hold')&&!s.lnCharm)b.unshift([ARC.holdBuyBtn,()=>{if(!spendSats(2)){toast(ARC.satPoor);return}s.lnCharm=1;arcGive(arcSlip(ARC.holdN,ARC.holdFl,[],'hold'));toast(ARC.holdBuy)}]);dlg(ARC.keeper,ARC.keeperLine+' '+ARC.nextOffer,b);return true}
  if(id==='napkin'){const line=ARC.twelve+(G.merc&&G.merc.k==='reyn'?' '+ARC.stray:'');dlg(ARC.napkin,line,[[ARC.leave]]);return true}
  if(id==='mile'){dlg(ARC.where,s.overGot?ARC.where:ARC.mileSofa,[[ARC.simSay,()=>toast(ARC.feeling)],[ARC.leave]]);return true}
  if(id==='page'){const b=[[ARC.read,()=>{arcMemo(ARCM.never);s.never=1;dlg(ARC.never,ARC.page,[[ARC.leave]])}]];if(s.overGot&&!s.overChoice)b.push([ARC.letTrue,()=>arcTrue(1)],[ARC.tellTruth,()=>arcTrue(0)]);if(s.reynMet&&G.merc&&G.merc.k==='reyn'&&!s.reynSat)b.push([ARC.satAsk,()=>arcSat()]);if(!s.rushOn)b.push([ARC.rushGo,()=>arcRush()],[ARC.rushNo]);dlg(ARC.never,ARC.page,b);return true}
  return false}
function arcTrue(yes){const s=arcSt();if(s.overChoice)return;if(yes){if(s.overTrue)return;s.overTrue=1;s.overChoice='true';if(P)P.arcInv=3;arcBlankOver(0);arcMemo(ARCM.overT);toast(ARC.trueOnce)}else{s.overChoice='truth';G.sats=(G.sats||0)+1;arcBlankOver(1);arcMemo(ARCM.overN);toast(ARC.truthPay)}}
function arcSat(){const s=arcSt();if(s.reynSat)return;if(!spendSats(1)){toast(ARC.satPoor);return}s.reynSat=1;s.reynUnemp=1;if(G.merc&&G.merc.k==='reyn')G.merc.name=ARC.unemployed;toast(ARC.satPaid)}
function arcRush(){const s=arcSt();s.rushOn=1;if(W){W.rushT=60;W.rushW=0;W.rushCd=0}toast(ARC.rushAsk)}
function arcGramps(){const s=G.st||{};if((s.six||0)<2)return [];return [[ARC.dog,()=>dlg('Gramps',s.six===2?ARC.sixDog:ARC.dog,[[ARC.leave]])] ]}
function arcBrenda(){const s=G.st||{};const b=[];if(!s.bargeQ)b.push([ARC.cart,()=>{arcSt().bargeQ=1;dlg('Brenda',ARC.brendaCart,[[ARC.leave]])}]);else if(s.bargeDock&&s.bargeQ<3)b.push([ARC.unsub,()=>arcTierAsk()]);return b}
function arcTierAsk(){dlg('Brenda',ARC.nextFl,[[ARC.stimChoice,()=>arcTier('stim')],[ARC.packChoice,()=>arcTier('pack')]])}
function arcTier(which){const s=arcSt();if(s.bargeQ>=3||s.nextTier)return;s.bargeQ=3;s.nextTier=which;if(!s.nextGot){s.nextGot=1;arcGive(arcSlip(ARC.next,ARC.nextFl,[],'next'))}G.credits=(G.credits||0)+40;toast(ARC.creditsJoke);calc()}
function arcWren(){const s=G.st||{};if(s.overGot)return [];return [[ARC.over,()=>{arcSt().overGot=1;arcGive(arcOverItem(0));dlg('Wren',ARC.overFl,[[ARC.leave]])}]]}
function arcClick(k){const s=arcSt();closeSheet();
  if(k==='six'&&!s.six){s.six=1;s.sixLeft=null;dlg(ARC.sixN,ARC.sixCard,[[ARC.leave]]);return}
  if(k==='sixin'&&s.six===2&&!s.sixPaid){s.sixPaid=1;G.sats=(G.sats||0)+4;if(!s.sixCharm){s.sixCharm=1;arcGive(arcSlip(ARC.minute,ARC.minuteFl,[],'minute'))}toast(ARC.sixPay);return}
  if(k==='sixbuy'&&!s.sixCharm){if(!spendSats(8)){toast(ARC.satPoor);return}s.sixCharm=1;arcGive(arcSlip(ARC.minute,ARC.minuteFl,[],'minute'));toast(ARC.sixBuy);return}
  if(k==='sixagain'&&s.six>=2){s.six=1;s.sixLeft=null;toast(ARC.sixCard);return}
}
function arcBoardHTML(){const s=G.st||{};let h='<div class="list arcBoard">';if(!s.six)h+='<button class="li" data-arc="six"><div><b>'+esc(ARC.sixN)+'</b><span>'+esc(ARC.sixCard)+'</span></div></button>';else if(s.six===1)h+='<div class="li"><div><b>'+esc(ARC.sixN)+'</b><span>'+esc(ARC.sixCard)+'</span></div></div>';else if(s.six===2&&!s.sixPaid)h+='<button class="li" data-arc="sixin"><div><b>'+esc(ARC.sixTake)+'</b><span>'+esc(ARC.sixPay)+'</span></div></button>';else if(s.six===3)h+='<div class="li"><div><b>'+esc(ARC.dressed)+'</b><span>'+esc(ARC.sixBuy)+'</span></div></div>'+(!s.sixCharm?'<button class="li" data-arc="sixbuy"><div><b>'+esc(ARC.minute)+'</b><span>'+esc(ARC.sixBuy)+'</span></div></button>':'');if(s.six>=2)h+='<button class="li" data-arc="sixagain"><div><b>'+esc(ARC.rushGo)+'</b><span>'+esc(ARC.sixCard)+'</span></div></button>';return h+'</div>'}
function arcHudKey(){const s=G.st||{};let k='';if(s.lnTrack&&G.q.q15!==3&&!s.sold)k+=ARC.lnTrack;if(s.holdT>0)k+=Math.ceil(s.holdT);return k}
function arcHud(){const s=G.st||{};let h='';if(s.lnTrack&&G.q.q15!==3&&!s.sold)h+='<b class="sd">'+esc(ARC.lnTrack)+'</b>';if(s.holdT>0&&W&&W.zi===12)h+='<b class="sd">'+esc(ARC.hold)+' '+Math.ceil(s.holdT)+'</b>';return h}
function arcSubTick(dt){const s=arcSt();if(W.zi!==2||s.bargeQ!==1)return;const sign=(W.objs||[]).find(o=>o.k==='arc'&&o.id==='sign');if(sign&&dist(sign,P)<1.5){s.signT=(s.signT||0)-dt;if(s.signT<=0){s.signT=1.4;s.bargeSub=(s.bargeSub||0)+1;const bill=Math.floor(25*(G.cpi||1));s.bargeBill=(s.bargeBill||0)+bill;G.credits=Math.max(0,(G.credits||0)-bill)}}const cart=(W.objs||[]).find(o=>o.k==='arc'&&o.id==='cart'&&!o.used);if(cart&&dist(cart,P)<.9&&P.dir){const m=s.bargeSub?0.35:1;const nx=cart.x+P.dir.x*.8*m,ny=cart.y+P.dir.y*.8*m;if(typeof walk==='function'&&walk(nx,ny)){cart.x=nx;cart.y=ny}}}
function arcTick(dt){if(!G||!W||!P||mode!=='play')return;const s=arcSt();P.zoneT=(P.zoneT||0)+dt;if(P.over>0)P.over=Math.max(0,P.over-dt);if(P.arcInv>0)P.arcInv=Math.max(0,P.arcInv-dt);if(P.arcNo>0)P.arcNo=Math.max(0,P.arcNo-dt);if(P.zoneT>=60&&!P.zonePing){P.zonePing=1;calc()}
  if(s.six===1&&W.zi===1&&s.sixLeft>0)s.sixLeft=Math.max(0,s.sixLeft-dt);
  if(W.zi===1&&G.merc&&G.merc.k==='reyn'&&!scReynDog&&(W.ents||[]).some(e=>e.k==='tick'&&e.hp>0)){scReynDog=1;toast(ARC.dog)}
  if(s.holdT>0&&W.zi===12){s.holdT=Math.max(0,s.holdT-dt);if(s.holdT<=0&&!s.holdBored){s.holdBored=1;toast(ARC.bored);const e=(W.ents||[]).find(x=>x.arc==='hold'&&x.hp>0);if(e)e.aggro=true}}
  const vis=(W.ents||[]).find(e=>e.arc==='visor'&&e.hp>0);if(vis&&vis.aggro&&!s.reynFined){s.reynFined=1;toast(ARC.fine);G.credits=Math.max(0,(G.credits||0)-Math.floor(15*(G.cpi||1)))}
  const fv=(W.ents||[]).find(e=>e.arc==='first'&&e.hp>0);if(fv){fv.offT=(fv.offT||3)-dt;if(fv.offT<=0){fv.offT=4;toast([ARC.easyChair,ARC.easyFine,ARC.easyName][(fv.offN=(fv.offN||0)+1)%3])}}
  const bel=(W.ents||[]).find(e=>e.arc==='bel'&&e.hp>0);if(bel){bel.flT=(bel.flT||0)-dt;if(bel.flT<=0){bel.flT=1.6;float(bel.x,bel.y,ARC.over,'#e0bd6e',0)}}
  if(s.rushOn&&W.zi===27){W.rushT=(W.rushT||60)-dt;W.rushCd=Math.max(0,(W.rushCd||0)-dt);const left=(W.ents||[]).filter(e=>e.arc==='rush'&&e.hp>0).length;if(W.rushT<=0){s.rushOn=0;toast(ARC.rushLate)}else if(left===0&&W.rushCd<=0){if((W.rushW||0)>=6){s.rushOn=0;s.witness=1;G.sats=(G.sats||0)+3;arcMemo(ARCM.never);toast(ARC.witnessed)}else{W.rushW=(W.rushW||0)+1;W.rushCd=1.5;for(let i=0;i<3;i++){const e=arcLt('tick',P.x+1+i*.4,P.y,ARC.sixN,'rush',12);if(e)e.aggro=true}}}}
  arcSubTick(dt)}
function arcPlate(X,Y,t,col){ctx.font='700 8.5px Cinzel,serif';ctx.textAlign='center';const w=Math.max(28,ctx.measureText(t).width+14);ctx.fillStyle='rgba(8,6,12,.9)';ctx.fillRect(X-w/2,Y-12,w,16);ctx.fillStyle='#e0bd6e';ctx.fillRect(X-w/2,Y-12,3,16);ctx.fillStyle=col||'#e6e2d6';ctx.fillText(t,X+1,Y)}
function arcDraw(o,X,Y){shadow(X,Y,10);if(o.id==='cart'||o.id==='six'||o.id==='dock'||o.id==='sofa'){poly([X-13,Y-14,X,Y-8,X,Y+2,X-13,Y-4],'#8a6a40');poly([X,Y-8,X+13,Y-14,X+13,Y-4,X,Y+2],'#6a5030');poly([X-13,Y-14,X,Y-20,X+13,Y-14,X,Y-8],'#a8895c');arcPlate(X,Y-32,o.id==='cart'||o.id==='sofa'?ARC.cart:o.id==='dock'?ARC.dock:ARC.sixN,'#e6d7a8');return}poly([X-8,Y-14,X+8,Y-15,X+8,Y+2,X-8,Y+1],'#e6e2d6');arcPlate(X,Y-28,o.id==='draft'?ARC.draft:o.id==='rug'?ARC.decline:ARC.read,'#e6e2d6')}
if(typeof ACH!=='undefined'){ACH.push(['sixmin',ARC.featSix,ARC.featSixD,()=>!!(G.st&&G.st.sixFeat)]);ACH.push(['overw',ARC.featOver,ARC.featOverD,()=>!!(G.st&&G.st.overFeat)])}
if($('sheet')&&!$('sheet')._egg){$('sheet')._egg=1;$('sheet').addEventListener('pointerover',e=>{const b=e.target.closest&&e.target.closest('.eggLink');if(!b||(G.st&&G.st.wrenSaid))return;G.st.wrenSaid=1;toast(EGG.wrenWarn)})}
if(typeof devOn==='function'&&devOn()&&window.__g)Object.assign(window.__g,{EGG,eggPaper,eggBoard,eggFlyer,eggHelloFrame,eggOpenLink,eggBuyPie,eggUse,eggLaser,eggTip,eggOnDeath,eggHelloItem,eggPieItem,eggSourItem,pieFl,achTick,talkTo,showDeath,setDY(v){DY=v},vendBid,openVend,stampReq,itemLines,equipFromBag,BINTRO,ACH,SQ,MEMOS,SCE,scLine,scVisitClear,spendSats,vendBuyStim,ARC,ARCM,arcEnter,arcUse,arcOver,arcBarge,arcClick,arcHurt,arcBlind,arcBoardHTML,arcHud,arcHudKey,objHud,giveStim,summon,bagMeta,bagCan,mercTarget,calc,arcTalk,arcPace,arcDead,arcSkipMerc,arcMercMay,spawnMerc,vendBuy,kill,hurt,mpShareQuest});
