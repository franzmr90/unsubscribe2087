/* Tap versus hold on a touch skill button, and the short hop for blinks.
   A press under 200ms casts. A splash picks the nearest machine in sight,
   or the ground in front when none qualifies. A blink hops along facing
   or the move stick and will not land on a machine. Holding, or dragging
   off the button, opens the same thumb aim. A mouse drag is unchanged.
   node tools/tap-target.js */
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
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:1280,height:800}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
await p.waitForTimeout(300);
await p.evaluate(()=>__g.skipDisc());
await p.waitForTimeout(120);
await p.click('[data-cls=hacker]');
await p.waitForTimeout(200);
await p.evaluate(()=>{__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1;__g.OPT.auto=false;__g.G.god=true});
await clearUI(p);
await p.evaluate(()=>{__g.enter(1);__g.setMode('play')});
await clearUI(p);
await p.waitForTimeout(150);

const fail=[];
const near=(a,b,t)=>Math.abs(a-b)<(t==null?0.35:t);

const splash=await p.evaluate(()=>{
  const g=__g,W=g.W,P=g.P,N=W.N;
  const bad=[];
  try{
    if(g.AIM_TAP_MS!==200)bad.push('threshold '+g.AIM_TAP_MS);
    if(g.OPT.tapTarget!==true)bad.push('tap target default '+g.OPT.tapTarget);
    let best=null,bn=-1;
    for(let y=4;y<N-4;y++)for(let x=4;x<N-4;x++){
      if(W.map[y*N+x]!==1)continue;
      let n=0;
      for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++)if(W.map[(y+dy)*N+(x+dx)]===1)n++;
      if(n>bn){bn=n;best={x:x+.5,y:y+.5,n}}
    }
    function seat(){P.x=best.x;P.y=best.y;P.dir={x:1,y:0};P.dash=null;P.castWait=0;P.hitStun=0;g.J.x=0;g.J.y=0}
    function see(x,y,rad){
      const r=rad==null?1:rad;
      for(let iy=(y|0)-r;iy<=(y|0)+r;iy++)for(let ix=(x|0)-r;ix<=(x|0)+r;ix++)
        if(ix>=0&&iy>=0&&ix<N&&iy<N)W.seen[iy*N+ix]=1;
    }
    function seeLine(x,y){
      see(P.x,P.y,2);
      for(let i=0;i<=8;i++)see(P.x+(x-P.x)*i/8,P.y+(y-P.y)*i/8,1);
    }
    function foe(dx,dy){
      const e=g.spawn('tick',P.x+dx,P.y+(dy||0));
      if(!e)return null;
      e.stun=99;e.aggro=false;return e;
    }
    function prep(cls,sk){
      seat();W.ents.length=0;W.allies.length=0;W.seen.fill(0);
      g.G.cls=cls;g.G.sk[sk]=1;g.G.slots[0]=sk;g.G.en=900;P.cd[sk]=0;
      g.OPT.aim='auto';g.OPT.tapTarget=true;g.noteInput('touch');g.render();
      if(g.AIMING)g.aimCancel();
    }
    function home(){
      const r=document.querySelector('.sk[data-i="0"]').getBoundingClientRect();
      return {x:r.left+r.width/2,y:r.top+r.height/2,w:r.width};
    }
    function ev(name,x,y,type){
      document.querySelector('.sk[data-i="0"]').dispatchEvent(new PointerEvent(name,{bubbles:true,cancelable:true,pointerType:type||'touch',pointerId:7,button:0,clientX:x,clientY:y}));
    }
    function tap(){const h=home();ev('pointerdown',h.x,h.y);ev('pointerup',h.x,h.y)}
    const h0=home();
    if(!(h0.w>8))bad.push('skill button has no box');

    prep('hacker',6);
    const seenFoe=foe(3,0);seeLine(seenFoe.x,seenFoe.y);
    tap();
    let storm=W.allies.find(a=>a.k==='storm');
    if(!storm||Math.hypot(storm.x-seenFoe.x,storm.y-seenFoe.y)>0.2)bad.push('tap missed the machine '+JSON.stringify(storm&&{x:storm.x,y:storm.y,fx:seenFoe.x}));

    prep('hacker',6);
    tap();
    storm=W.allies.find(a=>a.k==='storm');
    const def=g.aimDefault(g.aimSpec(6));
    if(!storm||Math.hypot(storm.x-def.x,storm.y-def.y)>0.25)bad.push('empty tap was not the ground in front '+JSON.stringify(storm&&{x:storm.x-P.x,y:storm.y-P.y}));

    prep('hacker',6);
    const far=foe(3,0);
    if(far){far.hp=0}
    const live=foe(2.2,.4);const mate=foe(3.2,.4);
    if(live&&mate){seeLine(live.x,live.y);seeLine(mate.x,mate.y)}
    const mid={x:(live.x+mate.x)/2,y:(live.y+mate.y)/2};
    tap();
    storm=W.allies.find(a=>a.k==='storm');
    if(!storm||Math.hypot(storm.x-mid.x,storm.y-mid.y)>0.35)bad.push('cluster '+JSON.stringify(storm&&{x:storm.x,y:storm.y,mid}));

    prep('hacker',6);
    const hid=foe(3,0);
    see(P.x,P.y,1);
    tap();
    storm=W.allies.find(a=>a.k==='storm');
    if(!storm||Math.hypot(storm.x-hid.x,storm.y-hid.y)<0.6||Math.abs((storm.x-P.x)-4)>0.45)bad.push('fog snap '+JSON.stringify(storm&&{dx:storm.x-P.x,foe:hid.x-P.x}));

    prep('hacker',6);
    const wix=(P.x+2)|0,wiy=P.y|0,wat=wiy*N+wix,wprev=W.map[wat];
    W.map[wat]=0;
    const behind=foe(3,0);seeLine(behind.x,behind.y);
    tap();
    storm=W.allies.find(a=>a.k==='storm');
    W.map[wat]=wprev;
    if(!storm||Math.hypot(storm.x-behind.x,storm.y-behind.y)<0.6||Math.abs((storm.x-P.x)-4)>0.45)bad.push('wall snap '+JSON.stringify(storm&&{sx:storm.x,fx:behind&&behind.x}));

    prep('hacker',6);
    const nudge=foe(3,0);seeLine(nudge.x,nudge.y);
    const h=home();
    ev('pointerdown',h.x,h.y);
    const early=document.getElementById('aimStick');
    const earlyOn=early&&!early.hidden;
    ev('pointermove',h.x,h.y-10);
    const tiny=g.AIMING&&g.AIMING.live;
    ev('pointermove',h.x,h.y-40);
    const ring=document.getElementById('aimStick');
    const dragged=!!(g.AIMING&&g.AIMING.live&&g.AIMING.thumb&&ring&&!ring.hidden);
    ev('pointerup',h.x,h.y-40);
    storm=W.allies.find(a=>a.k==='storm');
    const want=g.aimThumbWorld(h.x,h.y,h.x,h.y-40,g.aimSpec(6));
    if(earlyOn||tiny)bad.push('aim opened before the drag');
    if(!dragged)bad.push('drag did not open the aim');
    if(!storm||Math.hypot(storm.x-nudge.x,storm.y-nudge.y)<1)bad.push('drag still snapped '+JSON.stringify(storm&&{x:storm.x,y:storm.y}));
    if(!storm||Math.hypot(storm.x-want.x,storm.y-want.y)>0.45)bad.push('drag spot '+JSON.stringify(storm&&{x:storm.x,y:storm.y,want}));

    prep('courier',4);
    const tack=foe(3,0);seeLine(tack.x,tack.y);
    tap();
    const trops=W.allies.find(a=>a.k==='trops');
    if(!trops||Math.hypot(trops.x-tack.x,trops.y-tack.y)>0.25)bad.push('courier tap '+JSON.stringify(trops&&{x:trops.x,y:trops.y}));

    prep('hacker',6);
    const skip=foe(2.5,0);seeLine(skip.x,skip.y);
    g.OPT.tapTarget=false;
    const offH=home();
    ev('pointerdown',offH.x,offH.y);
    const offRing=document.getElementById('aimStick');
    const offLive=!!(g.AIMING&&g.AIMING.live&&offRing&&!offRing.hidden);
    ev('pointerup',offH.x,offH.y);
    storm=W.allies.find(a=>a.k==='storm');
    g.OPT.tapTarget=true;
    if(!offLive)bad.push('toggle off did not aim at once');
    if(!storm||Math.hypot(storm.x-skip.x,storm.y-skip.y)<1)bad.push('toggle off still snapped');

    prep('scrapper',12);
    const horn=foe(.4,0);
    const hh=horn.hp;
    ev('pointerdown',home().x,home().y);
    if(g.AIMING)bad.push('self skill opened an aim');
    if(!(horn.hp<hh))bad.push('self skill did not cast');

    prep('hacker',6);
    g.OPT.aim='drag';g.noteInput('mouse');g.render();
    const mouseFoe=foe(5,0);seeLine(mouseFoe.x,mouseFoe.y);
    const at=g.screenAt(P.x+2,P.y);
    ev('pointerdown',at.x,at.y,'mouse');
    ev('pointermove',at.x,at.y,'mouse');
    ev('pointerup',at.x,at.y,'mouse');
    storm=W.allies.find(a=>a.k==='storm');
    if(g.AIMING)bad.push('mouse left the reticle up');
    if(!storm||Math.abs(storm.x-(P.x+2))>0.45||Math.hypot(storm.x-mouseFoe.x,storm.y-mouseFoe.y)<1)bad.push('mouse drag '+JSON.stringify(storm&&{dx:storm.x-P.x}));
    g.OPT.aim='auto';g.noteInput('touch');
    g.G.cls='hacker';
    return bad;
  }catch(e){return ['threw '+e.message]}
});
splash.forEach(s=>fail.push(s));

const held=await p.evaluate(()=>{
  const g=__g,W=g.W,P=g.P;
  W.ents.length=0;W.allies.length=0;W.seen.fill(1);
  g.G.cls='hacker';g.G.sk[6]=1;g.G.slots[0]=6;g.G.en=900;P.cd[6]=0;P.castWait=0;P.dir={x:1,y:0};
  g.OPT.aim='auto';g.OPT.tapTarget=true;g.noteInput('touch');g.render();
  if(g.AIMING)g.aimCancel();
  const b=document.querySelector('.sk[data-i="0"]'),r=b.getBoundingClientRect();
  b.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerType:'touch',pointerId:9,button:0,clientX:r.left+r.width/2,clientY:r.top+r.height/2}));
  const ring=document.getElementById('aimStick');
  return {ring:!!(ring&&!ring.hidden),live:!!(g.AIMING&&g.AIMING.live),storms:W.allies.filter(a=>a.k==='storm').length};
});
await p.waitForTimeout(280);
const heldAfter=await p.evaluate(()=>{
  const g=__g,ring=document.getElementById('aimStick'),a=g.AIMING;
  const snap={live:!!(a&&a.live),ring:!!(ring&&!ring.hidden),storms:g.W.allies.filter(x=>x.k==='storm').length};
  if(a)g.aimCancel();
  return snap;
});
if(held.ring||held.live||held.storms)fail.push('reticle showed on the press '+JSON.stringify(held));
if(!heldAfter.live||!heldAfter.ring||heldAfter.storms)fail.push('hold did not open the aim '+JSON.stringify(heldAfter));

const hops=await p.evaluate(()=>{
  const g=__g,W=g.W,P=g.P,N=W.N;
  const bad=[];
  try{
    let best=null,bn=-1;
    for(let y=4;y<N-4;y++)for(let x=4;x<N-4;x++){
      if(W.map[y*N+x]!==1)continue;
      let n=0;
      for(let dy=-5;dy<=5;dy++)for(let dx=-5;dx<=5;dx++)if(x+dx>=0&&y+dy>=0&&x+dx<N&&y+dy<N&&W.map[(y+dy)*N+(x+dx)]===1)n++;
      if(n>bn){bn=n;best={x:x+.5,y:y+.5}}
    }
    function seat(){P.x=best.x;P.y=best.y;P.dir={x:1,y:0};P.dash=null;P.castWait=0;P.hitStun=0;P.blinkChain=0;g.J.x=0;g.J.y=0}
    function foe(dx,dy){const e=g.spawn('tick',P.x+dx,P.y+(dy||0));if(e){e.stun=99;e.aggro=false}return e}
    function prep(cls,sk){
      seat();W.ents.length=0;W.allies.length=0;W.seen.fill(1);
      g.G.cls=cls;if(sk<100){g.G.sk[sk]=1;g.G.slots[0]=sk;P.cd[sk]=0}else g.G.slots[0]=sk;
      g.G.en=900;g.OPT.aim='auto';g.OPT.tapTarget=true;g.noteInput('touch');g.render();
      if(g.AIMING)g.aimCancel();
    }
    function home(){const r=document.querySelector('.sk[data-i="0"]').getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}}
    function ev(name,x,y){document.querySelector('.sk[data-i="0"]').dispatchEvent(new PointerEvent(name,{bubbles:true,cancelable:true,pointerType:'touch',pointerId:11,button:0,clientX:x,clientY:y}))}
    function tap(){const h=home();ev('pointerdown',h.x,h.y);ev('pointerup',h.x,h.y)}
    function run(){for(let i=0;i<12;i++)g.update(0.05)}

    prep('hacker',100);
    if(!g.tryGear('cipher')||!g.itemSkillOn(100))return ['cipher did not equip'];
    P.cd[100]=0;g.G.en=900;
    const ox=P.x,oy=P.y;
    tap();
    const hop=Math.hypot(P.x-ox,P.y-oy);
    if(!(hop>2.2&&hop<4.2)||Math.abs(P.y-oy)>0.4)bad.push('cipher hop '+hop+' dy '+(P.y-oy));

    prep('hacker',100);P.cd[100]=0;g.G.en=900;
    const block=foe(3.2,0);
    const bx=P.x;
    tap();
    if(!block||Math.hypot(P.x-block.x,P.y-block.y)<0.85)bad.push('cipher landed on a machine '+JSON.stringify({dx:P.x-bx,gap:block&&Math.hypot(P.x-block.x,P.y-block.y)}));
    if(block.hp<block.max)bad.push('cipher hop struck');

    prep('hacker',100);P.cd[100]=0;g.G.en=900;
    g.J.x=0;g.J.y=-1;
    const before=g.screenAt(P.x,P.y);
    tap();
    const after=g.screenAt(P.x,P.y);
    g.J.x=0;g.J.y=0;
    if(!(before.y-after.y>8))bad.push('stick hop did not go up the screen '+JSON.stringify({dy:before.y-after.y}));

    prep('hacker',100);P.cd[100]=0;g.G.en=900;
    const h=home();
    const stick=g.aimStickMetrics(h.x,h.y);
    ev('pointerdown',h.x,h.y);
    ev('pointermove',h.x,h.y-Math.min(stick.reach-1,stick.dead+40));
    const aiming=g.AIMING&&{live:g.AIMING.live,thumb:g.AIMING.thumb,reach:g.aimSpec(100).reach};
    const ring=document.getElementById('aimStick');
    const ringOn=!!(ring&&!ring.hidden);
    const landed=g.aimPlace(g.aimSpec(100),g.AIMING.x,g.AIMING.y);
    const sx=P.x,sy=P.y;
    ev('pointerup',h.x,h.y-Math.min(stick.reach-1,stick.dead+40));
    if(!aiming||!aiming.live||!aiming.thumb||!ringOn)bad.push('cipher hold aim '+JSON.stringify(aiming));
    if(Math.hypot(P.x-landed.x,P.y-landed.y)>0.35)bad.push('cipher hold landed '+JSON.stringify({x:P.x-sx,y:P.y-sy,land:landed&&{x:landed.x-sx,y:landed.y-sy}}));
    if(!g.walk(P.x,P.y))bad.push('cipher hold left the floor');
    if(!(g.aimSpec(100).reach>0))bad.push('cipher has no range ring');

    prep('hacker',100);P.cd[100]=0;
    const en=g.G.en,px=P.x,py=P.y;
    const wix=(P.x+2)|0,wiy=P.y|0,wat=wiy*N+wix,prev=W.map[wat];
    W.map[wat]=0;
    g.beginAim(100,0,'touch');
    g.aimSet(P.x+6,P.y);
    const stopped=Math.hypot(g.AIMING.x-P.x,g.AIMING.y-P.y);
    g.aimRelease(null,null);
    const went=Math.hypot(P.x-px,P.y-py);
    W.map[wat]=prev;
    if(!(stopped<2.2)||!(went<2.2))bad.push('cipher crossed a wall '+stopped+' '+went);

    prep('hacker',100);P.cd[100]=0;g.G.en=900;
    const stay=P.x;
    const hh=home();
    ev('pointerdown',hh.x,hh.y);
    ev('pointermove',hh.x,hh.y-50);
    ev('pointerup',hh.x,hh.y);
    if(Math.abs(P.x-stay)>0.05||g.AIMING)bad.push('release on the button still blinked');

    prep('hacker',12);
    const backX=P.x;
    tap();
    const stepped=P.x-backX;
    if(!(stepped<-1.2&&stepped>-3.2))bad.push('step back hop '+stepped);
    prep('hacker',12);
    const wallBack=foe(-2,0);
    const sx2=P.x;
    tap();
    if(!wallBack||Math.hypot(P.x-wallBack.x,P.y-wallBack.y)<0.85)bad.push('step back landed on a machine '+(P.x-sx2));

    prep('courier',1);
    const fleetFoe=foe(2.6,0);
    const fx=P.x;
    tap();
    const plan=P.dash&&P.dash.t*P.dash.spd;
    run();
    const flew=P.x-fx;
    if(!(plan>1.5&&plan<3.4))bad.push('fleet plan '+plan);
    if(!(flew>1.5&&flew<3.6))bad.push('fleet hop '+flew);
    if(fleetFoe&&Math.hypot(P.x-fleetFoe.x,P.y-fleetFoe.y)<0.85)bad.push('fleet landed on a machine');

    prep('maxi',5);
    const pillNear=foe(3.6,0),pillSide=foe(1.2,2.2);
    const mx=P.x,my=P.y;
    tap();
    run();
    if(!pillSide)bad.push('pill side machine did not spawn');
    else if(Math.abs(P.y-my)>1.2)bad.push('pill chased a machine off to the side '+JSON.stringify({dx:P.x-mx,dy:P.y-my}));
    if(pillNear&&Math.hypot(P.x-pillNear.x,P.y-pillNear.y)<0.85)bad.push('pill landed on a machine');
    if(!(P.x>mx+1))bad.push('pill did not hop '+JSON.stringify({dx:P.x-mx,dy:P.y-my}));

    prep('scrapper',7);
    const leapSide=foe(1.2,2.2),leapOn=foe(3.2,0);
    const lx=P.x,ly=P.y;
    tap();
    run();
    if(!leapSide)bad.push('earthbreaker side machine did not spawn');
    else if(Math.abs(P.y-ly)>1.2)bad.push('earthbreaker still leapt at the side machine '+JSON.stringify({dx:P.x-lx,dy:P.y-ly}));
    if(leapOn&&Math.hypot(P.x-leapOn.x,P.y-leapOn.y)<0.85)bad.push('earthbreaker landed on a machine');

    prep('anon',1);
    const proxy=foe(3.2,0);
    const ph=proxy.hp,ax=P.x;
    tap();
    if(proxy.hp<ph)bad.push('proxy hop stabbed');
    if(Math.hypot(P.x-proxy.x,P.y-proxy.y)<0.85)bad.push('proxy landed on a machine');
    if(!(P.x>ax+1))bad.push('proxy did not hop '+(P.x-ax));
    prep('anon',1);
    const stab=foe(3,0);
    if(!stab)bad.push('desk proxy had no machine');
    else{
      const sh=stab.hp,sx3=P.x;
      g.cast(0);
      if(!(stab.hp<sh)||Math.abs(P.x-sx3)<0.4)bad.push('desk proxy lost the leap '+JSON.stringify({dx:P.x-sx3,hp:sh-stab.hp}));
    }

    g.J.x=0;g.J.y=0;g.G.cls='hacker';
    return bad;
  }catch(e){return ['threw '+e.message+' '+String(e.stack).split('\n')[1]]}
});
hops.forEach(s=>fail.push(s));

if(errs.length)fail.push('pageerror '+errs.join(' | '));
await b.close();
if(fail.length){console.error(fail.join('\n'));process.exit(1)}
console.log('tap target ok');
})().catch(e=>{console.error(e);process.exit(1)});
