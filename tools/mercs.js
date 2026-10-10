/* Every Kestrel hireling: strike, cooldown, and each skill, plus the town portal.
   node tools/mercs.js
   Prints one line per merc skill: PASS or FAIL. */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');

async function clearUI(p){
  for(let i=0;i<24;i++){
    const st=await p.evaluate(()=>{
      const s=document.getElementById('scene');
      if(s&&!s.hidden){document.getElementById('scSkip').click();return 'scene'}
      const d=document.getElementById('dlg');
      if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x){x.click();return 'dlg'}return 'locked'}
      return 'clear'});
    if(st==='clear')return;
    await p.waitForTimeout(st==='locked'?350:160);
  }
  throw new Error('overlays did not clear');
}

(async()=>{
const html=fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8');
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined,args:['--font-render-hinting=none']});
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
await p.waitForTimeout(300);
await p.evaluate(()=>__g.skipDisc());
await p.waitForTimeout(150);
await p.click('[data-cls=scrapper]');
await p.waitForTimeout(200);
await p.evaluate(()=>{__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1});
await clearUI(p);
await p.evaluate(()=>{__g.G.credits=1e12;__g.G.lvl=25;__g.G.cpi=1;__g.G.q.q1=1;__g.G['in1']=1;__g.calc()});

const rows=await p.evaluate(()=>{
  const g=__g, rows=[];
  const say=(merc,skill,ok,detail)=>{rows.push({merc,skill,ok:!!ok,detail:detail||''})};
  const hide=()=>{const s=document.getElementById('scene');if(s)s.hidden=true;const d=document.getElementById('dlg');if(d)d.hidden=true};
  function quiet(){
    g.W.ents.length=0;g.W.projs.length=0;g.W.drops.length=0;
    g.G.god=true;g.OPT.auto=false;g.P.atk=99;
    for(const c of ['KeyW','KeyA','KeyS','KeyD'])g.keys[c]=false;
  }
  function field(){
    g.setMode('play');hide();g.enter(1);hide();g.setMode('shot');quiet();
  }
  function hire(k){
    g.setMode('play');
    g.G.credits=1e12;g.G.lvl=25;g.G.cpi=1;g.G.tag=null;g.G.q.q1=1;g.calc();
    if(!g.W.z.town){g.enter(0);hide()}
    g.setMode('play');g.openSheet('merc',{});
    const b=document.querySelector('[data-hire="'+k+'"]');
    if(!b||b.disabled)return false;
    b.click();g.closeSheet();g.setMode('shot');
    return !!(g.G.merc&&g.G.merc.k===k&&g.W.merc);
  }
  function foe(dist){
    const dirs=[[1,0],[-1,0],[0,1],[0,-1],[.7,.7],[-.7,.7],[.7,-.7],[-.7,-.7]];
    for(const d of dirs){
      const e=g.spawn('tick',g.P.x+d[0]*dist,g.P.y+d[1]*dist,{});
      if(e){e.hp=e.max=1e6;e.stun=99;e.mods={};e.aggro=false;return e}
    }
    return null;
  }
  function ticks(n){for(let i=0;i<n;i++)g.update(0.05)}
  function strike(k){
    quiet();
    const ranged=k==='sys'||k==='node';
    const e=foe(ranged?3.6:1.15);
    if(!e){say(k,'strike','','no room to spawn a machine');return}
    const hp0=e.hp,asleep=!e.aggro;
    const times=[];let prev=g.W.merc.cd,projs=0;
    for(let i=0;i<80;i++){
      const cd=g.W.merc.cd;
      g.update(0.05);
      if(g.W.projs.some(pr=>pr.kind==='merc'))projs++;
      if(g.W.merc.cd>cd+0.15)times.push(g.G.time);
      prev=g.W.merc.cd;
    }
    const ivl=g.MERCS?null:null;
    const spec={guard:1,sys:1.2,node:.8,hound:.5}[k];
    const dmg=hp0-e.hp;
    say(k,ranged?'shot':'strike',dmg>1&&times.length>=2,'damage '+dmg.toFixed(1)+' shots '+times.length+(times.length>=2?' gap '+(times[1]-times[0]).toFixed(2)+'s':'')+' asleep-start '+asleep+' woke '+e.aggro);
    say(k,'cooldown',times.length>=2&&times[1]-times[0]>=spec-0.08&&times[1]-times[0]<=spec+0.35,'want ~'+spec+'s got '+(times.length>=2?(times[1]-times[0]).toFixed(2):'none'));
    say(k,ranged?'ranged shot':'melee swing',ranged?projs>0:projs===0,ranged?('projectiles seen '+projs):('no stray projectile, swings '+times.length));
    if(!ranged)say(k,'acquires a sleeper',dmg>1&&e.aggro,'started asleep, damage '+dmg.toFixed(1));
  }
  function taunt(k){
    quiet();
    const e=g.spawn('tick',g.P.x,g.P.y+0.05,{});
    if(!e){say(k,'taunt','','spawn failed');return}
    e.hp=e.max=1e6;e.stun=0;e.aggro=true;e.mods={};e.cd=9;
    g.P.y-=1.2;
    g.W.merc.x=g.P.x+2.6;g.W.merc.y=g.P.y+1.2;g.W.merc.cd=99;
    const x0=e.x,y0=e.y;
    ticks(2);
    const dx=e.x-x0,dy=e.y-y0;
    if(k==='guard')say('guard','taunt',g.W.merc.taunt===1&&dx>0.02,'step dx '+dx.toFixed(2)+' dy '+dy.toFixed(2)+' (east, toward the bodyguard)');
    else say(k,'no taunt',!g.W.merc.taunt&&dy<0.02,'taunt flag '+g.W.merc.taunt+' step dx '+dx.toFixed(2)+' dy '+dy.toFixed(2)+' (north, toward you)');
  }
  function mend(){
    quiet();g.W.ents.length=0;g.G.merc.ab2=null;g.calc();
    g.G.hp=g.S.maxHp;g.G.en=0;g.W.merc.hc=0.02;g.W.merc.x=g.P.x;g.W.merc.y=g.P.y;
    ticks(1);
    const fullHp=g.G.hp>=g.S.maxHp-0.01, enFull=g.G.en>=6;
    say('sys','energy at full life',fullHp&&enFull,'hp '+g.G.hp.toFixed(1)+'/'+g.S.maxHp+' energy '+g.G.en.toFixed(1));
    g.G.hp=g.S.maxHp*0.5;g.G.en=0;g.W.merc.hc=0.02;
    const hp0=g.G.hp;ticks(1);
    say('sys','mend',g.G.hp-hp0>=g.S.maxHp*0.06,'+'+(g.G.hp-hp0).toFixed(1)+' hp (want ~7% of '+g.S.maxHp+')');
    say('sys','energy with the mend',g.G.en>=6,'energy '+g.G.en.toFixed(1));
    const hp1=g.G.hp,en1=g.G.en,hc=g.W.merc.hc;
    ticks(20);
    say('sys','mend cooldown',g.G.hp-hp1<g.S.maxHp*0.04&&g.G.en-en1<10&&g.W.merc.hc>1,'during 1s +'+(g.G.hp-hp1).toFixed(1)+' hp +'+(g.G.en-en1).toFixed(1)+' energy hc '+hc.toFixed(2)+'->'+g.W.merc.hc.toFixed(2));
    g.G.hp=g.S.maxHp*0.5;g.G.en=0;g.W.merc.hc=3;
    ticks(50);
    const mid=g.G.hp;
    ticks(16);
    say('sys','mend fires on its own timer',g.G.hp-mid>=g.S.maxHp*0.05,'after the 3s windup +'+(g.G.hp-mid).toFixed(1)+' hp');
  }
  function sats(){
    quiet();g.G.sats=0;g.G.rep=g.G.rep||{btc:0};g.G.rep.btc=0;
    g.W.drops.push({x:g.P.x+0.2,y:g.P.y,t:1,sat:4});
    ticks(1);
    say('node','satoshis',g.G.sats===6,'picked up '+g.G.sats+' (4 × 1.5)');
  }
  function magnet(k){
    quiet();g.G.credits=1000;
    g.W.drops.push({x:g.P.x+3.4,y:g.P.y,t:1,cr:40});
    ticks(1);
    const got=g.G.credits>1000||!g.W.drops.length;
    if(k==='hound')say('hound','magnet',got&&g.G.credits>=1040,'credits '+g.G.credits+' drops left '+g.W.drops.length);
    else say(k,'magnet stays off',!got,'credits '+g.G.credits+' drops left '+g.W.drops.length);
  }
  function train(k){
    quiet();g.G.merc.ab1=null;g.G.merc.ab2=null;g.calc();ticks(1);
    const baseMax=g.W.merc.max,baseHp=g.W.merc.hp;
    g.setMode('play');g.openSheet('merc',{});
    const bg=document.querySelector('[data-mab="g"]');
    if(!bg||bg.disabled){say(k,'Guard','','training button missing');g.closeSheet();g.setMode('shot');return}
    bg.click();
    say(k,'Guard',g.G.merc.ab1==='guard'&&Math.abs(g.W.merc.max/baseMax-1.4)<0.03&&Math.abs(g.W.merc.hp/baseHp-1.4)<0.04,'max '+baseMax+'->'+g.W.merc.max+' hp '+baseHp.toFixed(0)+'->'+g.W.merc.hp.toFixed(0));
    function hit(){
      quiet();const e=foe(0.7);if(!e)return 0;
      g.W.merc.cd=0;g.W.merc.x=e.x-0.35;g.W.merc.y=e.y;e.aggro=true;
      const hp=e.hp;g.update(0.05);return hp-(e.hp||0);
    }
    g.G.merc.ab1=null;ticks(1);const d0=hit();
    g.setMode('play');g.openSheet('merc',{});
    document.querySelector('[data-mab="f"]').click();
    const d1=hit();
    say(k,'Fury',g.G.merc.ab1==='fury'&&d0>1&&Math.abs(d1/d0-1.3)<0.08,'hit '+d0.toFixed(1)+' -> '+d1.toFixed(1));
    g.setMode('play');g.openSheet('merc',{});
    document.querySelector('[data-mab="m"]').click();g.closeSheet();g.setMode('shot');
    quiet();g.W.merc.x=g.P.x;g.W.merc.y=g.P.y;g.G.merc.ab2=null;g.calc();
    g.G.hp=g.S.maxHp*0.5;const a0=g.G.hp;ticks(20);const plain=g.G.hp-a0;
    g.G.merc.ab2='medic';g.G.hp=g.S.maxHp*0.5;const b0=g.G.hp;ticks(20);const mended=g.G.hp-b0;
    say(k,'Medic',g.G.merc.ab2==='medic'&&mended>plain+g.S.maxHp*0.015,'1s +'+plain.toFixed(1)+' without, +'+mended.toFixed(1)+' with');
    g.G.merc.ab2=null;g.calc();const mf0=g.S.mf,go0=g.S.gold;
    g.setMode('play');g.openSheet('merc',{});
    document.querySelector('[data-mab="c"]').click();g.closeSheet();g.setMode('shot');g.calc();
    say(k,'Collector',g.G.merc.ab2==='coll'&&g.S.mf===mf0+15&&g.S.gold===go0+25,'magic find '+(g.S.mf-mf0)+' credits found '+(g.S.gold-go0));
    quiet();g.G.merc.ab2=null;g.calc();g.G.credits=5000;
    g.W.drops.push({x:g.P.x,y:g.P.y,t:1,cr:80});ticks(1);const gain=g.G.credits-5000;
    g.G.merc.ab2='coll';g.calc();g.G.credits=5000;
    g.W.drops.push({x:g.P.x,y:g.P.y,t:1,cr:80});ticks(1);const gain2=g.G.credits-5000;
    say(k,'Collector payout',gain2>gain,'purse +'+gain+' then +'+gain2);
    g.G.merc.dead=true;g.calc();
    const off=g.S.mf===mf0&&g.S.gold===go0;
    g.G.merc.dead=false;g.G.merc.ab2='coll';g.calc();
    say(k,'Collector turns off when they fall',off,'mf/gold back to '+mf0+'/'+go0);
  }
  function follow(k){
    quiet();const x0=g.P.x;
    g.W.merc.x=g.P.x+9;g.W.merc.y=g.P.y;
    g.update(0.05);
    const back=Math.hypot(g.W.merc.x-g.P.x,g.W.merc.y-g.P.y)<1.6;
    for(let i=0;i<24;i++){g.P.x+=0.12;g.update(0.05)}
    const near=Math.hypot(g.W.merc.x-g.P.x,g.W.merc.y-g.P.y)<3.2;
    say(k,'follows you',back&&near,'recall '+(back?'yes':'no')+' after a walk dist '+Math.hypot(g.W.merc.x-g.P.x,g.W.merc.y-g.P.y).toFixed(2)+' moved '+(g.P.x-x0).toFixed(1));
  }
  function zones(k){
    const key=g.G.merc.k;
    g.setMode('play');g.enter(0);hide();
    const town=!!(g.W.z.town&&g.W.merc&&g.W.merc.hp>0&&g.G.merc.k===key);
    field();
    quiet();const e=foe(1.1);let dmg=0;if(e){const hp=e.hp;ticks(40);dmg=hp-e.hp}
    say(k,'town and back',town&&dmg>1,'town merc '+(town?'up':'missing')+' damage after return '+dmg.toFixed(1));
  }
  function save(k){
    const snap=JSON.parse(JSON.stringify(g.G));
    const key=snap.merc.k;
    g.G.merc=null;g.W.merc=null;
    const ok=g.applySave({G:snap});
    field();
    quiet();const e=foe(1.1);let dmg=0;if(e){const hp=e.hp;ticks(40);dmg=hp-e.hp}
    say(k,'save and load',ok&&g.G.merc&&g.G.merc.k===key&&g.W.merc&&dmg>1,'loaded '+key+' damage '+dmg.toFixed(1));
  }
  g.MERCS=null;
  for(const k of ['guard','sys','node','hound']){
    const hired=hire(k);
    say(k,'hire',hired,hired?g.G.merc.name+' the '+k:'button did not hire');
    if(!hired)continue;
    field();
    if(!g.W.merc){say(k,'shows up in the district','','no body');continue}
    say(k,'shows up in the district',g.W.merc.hp>0,'hp '+Math.round(g.W.merc.hp));
    strike(k);
    if(k==='guard')taunt('guard');
    else taunt(k);
    if(k==='sys')mend();
    if(k==='node')sats();
    if(k==='hound')magnet('hound');
    else if(k==='guard')magnet('guard');
    train(k);
    follow(k);
    zones(k);
    save(k);
  }
  return rows;
});

function line(r){return (r.ok?'PASS':'FAIL')+'  '+r.merc+'  '+r.skill+'  '+(r.detail||'')}
let fail=rows.filter(r=>!r.ok).length;
for(const r of rows)console.log(line(r));

const shot=await p.evaluate(()=>{
  const g=__g;
  g.setMode('play');g.G.credits=1e12;g.G.lvl=25;g.G.tag=null;
  if(!g.W.z.town)g.enter(0);
  g.setMode('play');g.openSheet('merc',{});
  const b=document.querySelector('[data-hire="guard"]');
  if(b&&!b.disabled)b.click();
  g.closeSheet();
  g.G['in1']=1;g.enter(1);
  const s=document.getElementById('scene');if(s)s.hidden=true;
  const d=document.getElementById('dlg');if(d)d.hidden=true;
  g.setMode('shot');g.G.god=true;g.OPT.auto=false;g.P.atk=99;g.OPT.shake=0;
  g.W.ents.length=0;g.W.projs.length=0;g.W.texts.length=0;
  const e=g.spawn('tick',g.P.x+0.9,g.P.y,{});
  if(!e)return {ok:false,why:'no foe'};
  e.hp=e.max=1e6;e.stun=99;e.mods={};e.aggro=false;
  let dmg=0;
  for(let i=0;i<30&&dmg<1;i++){const hp=e.hp;g.update(0.05);dmg=hp-e.hp}
  g.render();
  return {ok:dmg>1,dmg,zi:g.W.zi,merc:g.G.merc&&g.G.merc.k};
});
console.log((shot.ok?'PASS':'FAIL')+'  guard  hit on screen  damage '+(shot.dmg||0));
if(!shot.ok)fail++;
await p.screenshot({path:'/opt/cursor/artifacts/screenshot_merc_hit.png'});

const portal=await p.evaluate(()=>{
  const g=__g, out={};
  g.W.ents.length=0;g.W.projs.length=0;
  g.setMode('play');
  const zi=g.W.zi,x=g.P.x,y=g.P.y;
  const blocker=g.spawn('tick',g.P.x+1,g.P.y,{});
  if(blocker){blocker.hp=500;blocker.aggro=true}
  g.openPortal();
  out.blocked=g.W.zi===zi&&!g.W.portals.some(tp=>tp.cast);
  g.W.ents.length=0;
  g.setMode('play');g.openPortal();
  const tp=g.W.portals.find(q=>q.cast);
  out.stayed=g.W.zi===zi&&Math.hypot(g.P.x-x,g.P.y-y)<0.05;
  out.placed=!!(tp&&Math.hypot(tp.x-x,tp.y-y)<0.05);
  g.setMode('shot');
  for(let i=0;i<10;i++)g.update(0.05);
  out.still=g.W.zi===zi;
  out.x=x;out.y=y;out.zi=zi;
  return out;
});
await p.evaluate(()=>__g.setMode('play'));
await p.waitForTimeout(200);
portal.label=await p.evaluate(()=>{const b=document.getElementById('bAct');return b&&!b.hidden?b.textContent:''});
const aside=await p.evaluate((spot)=>{
  const g=__g,x=spot.x,y=spot.y,N=g.W.N,map=g.W.map;
  g.setMode('shot');
  const tile=(qx,qy)=>{const tx=qx|0,ty=qy|0;return tx>0&&ty>0&&tx<N-1&&ty<N-1&&map[ty*N+tx]!==0};
  let nx=x,ny=y,best=0;
  for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){
    const d=Math.hypot(dx,dy);
    if(d<2.4||d>4.2||!tile(x+dx,y+dy))continue;
    if(d>best){best=d;nx=x+dx;ny=y+dy}
  }
  g.P.x=nx;g.P.y=ny;
  if(g.W.seen){for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const si=((y+dy)|0)*N+((x+dx)|0);if(si>=0&&si<g.W.seen.length)g.W.seen[si]=1}}
  g.render();
  return {dist:Math.hypot(g.P.x-x,g.P.y-y),portals:g.W.portals.filter(tp=>tp.cast).length};
}, {x:portal.x,y:portal.y});
console.log('portal shot  aside '+aside.dist.toFixed(2)+' cast gates '+aside.portals);
await p.screenshot({path:'/opt/cursor/artifacts/screenshot_portal_cast.png'});
const labelOk=/Return to /.test(portal.label);
console.log((portal.blocked?'PASS':'FAIL')+'  portal  refused while machines are close');
console.log((portal.stayed&&portal.placed?'PASS':'FAIL')+'  portal  opens at your feet  zone '+portal.zi);
console.log((portal.still?'PASS':'FAIL')+'  portal  standing on it does not send you to town');
console.log((labelOk?'PASS':'FAIL')+'  portal  the button offers the town  '+(portal.label||'(none)'));
if(!portal.blocked||!portal.stayed||!portal.placed||!portal.still||!labelOk)fail++;

const back=await p.evaluate((spot)=>{
  const g=__g, out={};
  g.setMode('shot');
  g.P.x=spot.x+3;g.P.y=spot.y;
  g.update(0.05);
  out.left=g.W.zi===spot.zi;
  g.P.x=spot.x;g.P.y=spot.y;
  g.update(0.05);
  out.town=!!(g.W.z&&g.W.z.town);
  out.remember=!!(g.G.portal&&g.G.portal.zi===spot.zi&&Math.hypot(g.G.portal.x-spot.x,g.G.portal.y-spot.y)<0.2);
  g.P.x=12.5;g.P.y=11.5;
  g.update(0.05);
  out.backLabel=g.actTarget&&g.actTarget.label||'';
  g.usePortal({kind:'back'});
  out.backZi=g.W.zi;
  out.backDist=Math.hypot(g.P.x-spot.x,g.P.y-spot.y);
  const sim=g.ZONES.findIndex(z=>z.sim);
  g.setMode('play');g.enter(sim);g.setMode('play');
  const s=document.getElementById('scene');if(s)s.hidden=true;
  g.openPortal();
  out.simTown=!!(g.W.z&&g.W.z.town);
  return out;
}, {x:portal.x,y:portal.y,zi:portal.zi});
console.log((back.left?'PASS':'FAIL')+'  portal  stepping off leaves you in the district');
console.log((back.town&&back.remember?'PASS':'FAIL')+'  portal  stepping back in returns you to town');
console.log((back.backZi===portal.zi&&back.backDist<2?'PASS':'FAIL')+'  portal  the square brings you back  dist '+back.backDist.toFixed(2));
console.log((back.simTown?'PASS':'FAIL')+'  portal  the simulator still leaves at once');
if(!back.left||!back.town||!back.remember||back.backZi!==portal.zi||back.backDist>=2||!back.simTown)fail++;

await p.evaluate(()=>{
  const g=__g;
  g.G.hc=false;g.G.god=false;g.G['in1']=1;g.G.hp=g.S.maxHp;
  g.setMode('play');g.enter(1);
  const s=document.getElementById('scene');if(s)s.hidden=true;
  g.setMode('play');g.P.inv=0;g.G.god=false;g.G.hp=g.S.maxHp;
});
await p.evaluate(()=>__g.hurt(1e9,0,{name:'a Tick'}));
await p.waitForTimeout(2800);
const death=await p.evaluate(()=>({
  btn:document.getElementById('bRise').textContent,
  note:document.getElementById('deathNote').textContent,
  hidden:document.getElementById('death').hidden,
  mode:__g.mode
}));
console.log((/Stillwater/.test(death.btn)?'PASS':'FAIL')+'  portal  death still offers the town  '+death.btn);
console.log((/start of that district/.test(death.note)?'PASS':'FAIL')+'  portal  death still promises the square  '+death.note);
if(!/Stillwater/.test(death.btn)||!/start of that district/.test(death.note))fail++;
await p.click('#bRise');
await p.waitForTimeout(400);
const rose=await p.evaluate(()=>({zi:__g.W.zi,town:!!(__g.W.z&&__g.W.z.town),pz:__g.G.portal&&__g.G.portal.zi}));
console.log((rose.town&&rose.pz===1?'PASS':'FAIL')+'  portal  death rises in town with a way back  '+JSON.stringify(rose));
if(!rose.town||rose.pz!==1)fail++;

if(errs.length){console.log('FAIL  page errors  '+errs.join(' | '));fail++}
const skills=rows.filter(r=>!/hire|shows up|follows|town and back|save and load|magnet stays|no taunt/.test(r.skill));
console.log('skills '+rows.filter(r=>r.ok).length+'/'+rows.length+' rows, '+fail+' failed checks');
await b.close();
if(fail)process.exit(1);
console.log('mercs ok');
})().catch(e=>{console.error(e);process.exit(1)});
