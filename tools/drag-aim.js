/* Drag-to-aim: reticle radius matches the hit, range clamps, cancel is free,
   touch and mouse both cast at the release point, and a right click stays instant.
   node tools/drag-aim.js */
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
const near=(a,b)=>Math.abs(a-b)<0.08;

const spec=await p.evaluate(()=>{
  const g=__g,W=g.W,N=W.N,P=g.P;
  let best=null,bn=-1;
  for(let y=4;y<N-4;y++)for(let x=4;x<N-4;x++){
    if(W.map[y*N+x]!==1)continue;
    let n=0;
    for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++)if(W.map[(y+dy)*N+(x+dx)]===1)n++;
    if(n>bn){bn=n;best={x:x+.5,y:y+.5,n}}
  }
  P.x=best.x;P.y=best.y;P.dir={x:1,y:0};
  W.ents.length=0;W.allies.length=0;
  g.G.sk[6]=1;g.G.slots[0]=6;g.G.en=500;P.cd[6]=0;P.castWait=0;
  g.render();
  const round=g.worldAt(g.screenAt(P.x+3,P.y).x,g.screenAt(P.x+3,P.y).y);
  const storm=g.aimSpec(6);
  g.OPT.aim='auto';
  return {best,storm,round:{x:round.x,y:round.y},hero:{x:P.x,y:P.y},aim:g.OPT.aim,wantTouch:g.wantDrag('touch'),wantMouse:g.wantDrag('mouse'),wantKey:g.wantDrag('key')};
});
if(!spec.best||spec.best.n<60)fail.push('no open ground ('+(spec.best&&spec.best.n)+')');
if(!spec.storm||spec.storm.r!==3.5||spec.storm.reach!==7)fail.push('black storm spec '+JSON.stringify(spec.storm));
if(!near(spec.round.x,spec.hero.x+3)||!near(spec.round.y,spec.hero.y))fail.push('screen roundtrip '+JSON.stringify(spec.round));
if(spec.aim!=='auto'||!spec.wantTouch||spec.wantMouse||spec.wantKey)fail.push('auto aim defaults '+JSON.stringify(spec));

const radii=await p.evaluate(()=>{
  const g=__g,out={};
  const rows=[
    ['hacker',6,3.5,7],['hacker',10,2.2,8],['hacker',9,.75,4.5],
    ['courier',4,2.6,6],['courier',3,2.6,6],['courier',11,1.8,4.5],
    ['anon',0,2.6,6],['anon',3,2.4,5],['anon',5,3,8],['anon',6,2.2,7],
    ['founder',1,3,7],['scrapper',7,3,7],['scrapper',9,2.6,3],['scrapper',12,4.2,0],
    ['homesteader',0,2.2,4],['homesteader',9,3.4,4],['homesteader',6,.42,4],
    ['maxi',9,4.2,0],['hacker',100,null,6.5]
  ];
  for(const [cls,i,r,reach] of rows){
    g.G.cls=cls;
    const s=i>=100?g.AIM.item[100]:g.aimSpec(i);
    out[cls+'.'+i]={r:s&&s.r,reach:s&&s.reach,wantR:r,wantReach:reach,kind:s&&s.kind};
  }
  g.G.cls='hacker';
  return out;
});
for(const k in radii){
  const row=radii[k];
  if(row.wantR!=null&&row.r!==row.wantR)fail.push(k+' radius '+row.r+' want '+row.wantR);
  if(row.reach!==row.wantReach)fail.push(k+' reach '+row.reach+' want '+row.wantReach);
}

const hit=await p.evaluate(()=>{
  const g=__g,W=g.W,P=g.P;
  g.G.cls='hacker';g.G.sk[6]=1;g.G.slots[0]=6;g.G.en=800;P.cd[6]=0;P.castWait=0;P.dir={x:1,y:0};
  W.ents.length=0;W.allies.length=0;
  g.OPT.aim='drag';
  g.beginAim(6,0,'touch');
  const far=g.aimSet(P.x+40,P.y);
  const clamped=Math.hypot(far.x-P.x,far.y-P.y);
  g.aimSet(P.x+3,P.y+1);
  const ax=g.AIMING.x,ay=g.AIMING.y;
  const inside=g.spawn('tick',ax+3.4,ay);const outside=g.spawn('tick',ax,ay+3.7);
  inside.stun=99;outside.stun=99;inside.aggro=false;outside.aggro=false;
  const hi=inside.hp,ho=outside.hp;
  g.aimRelease(null,null);
  const storm=W.allies.find(a=>a.k==='storm');
  for(let i=0;i<10;i++)g.update(0.05);
  return {clamped,ax,ay,sx:storm&&storm.x,sy:storm&&storm.y,dIn:Math.hypot(inside.x-ax,inside.y-ay),dOut:Math.hypot(outside.x-(storm?storm.x:ax),outside.y-(storm?storm.y:ay)),
    hitIn:inside.hp<hi,hitOut:outside.hp<ho,spot:P.spot,aim:g.AIMING,m:storm&&storm.m};
});
if(!(Math.abs(hit.clamped-7)<0.02))fail.push('range clamp '+hit.clamped);
if(!hit.sx||!near(hit.sx,hit.ax)||!near(hit.sy,hit.ay))fail.push('cast spot '+hit.sx+','+hit.sy+' want '+hit.ax+','+hit.ay);
if(!hit.hitIn||hit.hitOut)fail.push('storm hitbox in '+hit.hitIn+' out '+hit.hitOut+' dIn '+hit.dIn+' dOut '+hit.dOut);
if(hit.spot||hit.aim)fail.push('aim state leaked');
if(!(hit.m>0))fail.push('storm damage missing');

const cancel=await p.evaluate(()=>{
  const g=__g,W=g.W,P=g.P;
  W.allies.length=0;W.ents.length=0;
  g.G.en=400;P.cd[6]=0;P.castWait=0;
  const en=g.G.en;
  g.OPT.aim='drag';
  g.beginAim(6,0,'mouse');
  g.aimSet(P.x+3,P.y);
  const b=document.querySelector('.sk[data-i="0"]');
  const r=b.getBoundingClientRect();
  const fired=g.aimRelease(r.left+r.width/2,r.top+r.height/2);
  return {fired,en:g.G.en,was:en,cd:P.cd[6]||0,n:W.allies.filter(a=>a.k==='storm').length,aim:!!g.AIMING};
});
if(cancel.fired||cancel.n||cancel.cd||cancel.en!==cancel.was)fail.push('cancel spent '+JSON.stringify(cancel));

const paths=await p.evaluate(()=>{
  const g=__g,W=g.W,P=g.P;
  function wipe(){W.allies.length=0;W.ents.length=0;g.G.en=800;P.cd[6]=0;P.castWait=0;P.dir={x:1,y:0}}
  function press(type,down,move,up){
    const b=document.querySelector('.sk[data-i="0"]');
    const ev=(name,x,y)=>b.dispatchEvent(new PointerEvent(name,{bubbles:true,cancelable:true,pointerType:type,pointerId:3,button:0,clientX:x,clientY:y}));
    ev('pointerdown',down.x,down.y);
    const aiming=!!g.AIMING;
    if(move)ev('pointermove',move.x,move.y);
    if(up)ev('pointerup',up.x,up.y);
    const storm=W.allies.find(a=>a.k==='storm');
    return {aiming,storm:storm&&{x:storm.x,y:storm.y},left:g.AIMING};
  }
  const btn=document.querySelector('.sk[data-i="0"]').getBoundingClientRect();
  const home={x:btn.left+12,y:btn.top+12};
  g.render();
  wipe();g.OPT.aim='auto';
  const touch=press('touch',home,g.screenAt(P.x+2.5,P.y),g.screenAt(P.x+2.5,P.y));
  const want=g.worldAt(g.screenAt(P.x+2.5,P.y).x,g.screenAt(P.x+2.5,P.y).y);
  wipe();g.OPT.aim='drag';
  const mouse=press('mouse',home,g.screenAt(P.x+2,P.y+1),g.screenAt(P.x+2,P.y+1));
  const wantM=g.worldAt(g.screenAt(P.x+2,P.y+1).x,g.screenAt(P.x+2,P.y+1).y);
  wipe();g.OPT.aim='auto';
  const quick=press('mouse',home,null,null);
  wipe();g.OPT.aim='quick';
  const noTouch=press('touch',home,null,null);
  g.OPT.aim='auto';
  return {touch,want,mouse,wantM,quick:!!quick.storm&&!quick.aiming,noTouch:!!noTouch.storm&&!noTouch.aiming,quickAim:quick.aiming};
});
if(!paths.touch.aiming||!paths.touch.storm)fail.push('touch drag did not aim '+JSON.stringify(paths.touch));
else if(!near(paths.touch.storm.x,paths.want.x)||!near(paths.touch.storm.y,paths.want.y))fail.push('touch release '+JSON.stringify(paths.touch.storm)+' want '+JSON.stringify(paths.want));
if(!paths.mouse.aiming||!paths.mouse.storm)fail.push('mouse drag did not aim '+JSON.stringify(paths.mouse));
else if(!near(paths.mouse.storm.x,paths.wantM.x)||!near(paths.mouse.storm.y,paths.wantM.y))fail.push('mouse release '+JSON.stringify(paths.mouse.storm)+' want '+JSON.stringify(paths.wantM));
if(!paths.quick)fail.push('desktop quick cast did not fire at once');
if(!paths.noTouch)fail.push('quick-cast option still dragged on touch');

const desk=await p.evaluate(()=>{
  const g=__g,W=g.W,P=g.P;
  W.allies.length=0;W.ents.length=0;g.G.en=800;P.cd[6]=0;P.dir={x:1,y:0};
  g.ensureMouse();g.G.hot[0]=6;g.G.mouse.R=0;g.OPT.aim='auto';
  document.dispatchEvent(new KeyboardEvent('keydown',{code:'F1',key:'F1',bubbles:true}));
  const afterKey=g.G.mouse.R,aimed=!!g.AIMING;
  document.dispatchEvent(new KeyboardEvent('keyup',{code:'F1',key:'F1',bubbles:true}));
  const storms=W.allies.filter(a=>a.k==='storm').length;
  g.OPT.aim='drag';W.allies.length=0;g.G.en=800;P.cd[6]=0;
  document.dispatchEvent(new KeyboardEvent('keydown',{code:'F1',key:'F1',bubbles:true}));
  const hold=g.AIMING&&g.AIMING.i;
  g.aimSet(P.x+3,P.y);
  document.dispatchEvent(new KeyboardEvent('keyup',{code:'F1',key:'F1',bubbles:true}));
  const storm=W.allies.find(a=>a.k==='storm');
  g.OPT.aim='drag';W.allies.length=0;W.ents.length=0;g.G.en=800;P.cd[6]=0;P.dir={x:1,y:0};
  g.G.mouse.R=6;
  g.mouseClick('right',P.x+2,P.y);
  g.update(0.05);
  const right=W.allies.find(a=>a.k==='storm');
  return {afterKey,aimed,storms,hold,fx:storm&&{x:storm.x-P.x,y:storm.y-P.y},right:right&&{dx:right.x-P.x,aim:!!g.AIMING}};
});
if(desk.afterKey!==6||desk.aimed||desk.storms)fail.push('F1 quick path changed '+JSON.stringify(desk));
if(desk.hold!==6||!desk.fx||!near(desk.fx.x,3))fail.push('F1 drag cast '+JSON.stringify(desk.fx));
if(!desk.right||desk.right.aim||!near(desk.right.dx,4))fail.push('right click was not instant at facing*4 '+JSON.stringify(desk.right));

const placed=await p.evaluate(()=>{
  const g=__g,W=g.W,P=g.P,bad=[];
  const N=W.N;
  const floor=(x,y)=>x>=1&&y>=1&&x<N-1&&y<N-1&&W.map[(y|0)*N+(x|0)]===1;
  function prep(cls,i){
    g.G.cls=cls;g.G.form=null;if(P.form)P.form=null;
    g.G.sk[i]=1;g.G.slots[0]=i;g.G.en=900;P.cd[i]=0;P.castWait=0;P.silence=0;P.dash=null;
    W.allies.length=0;W.ents.length=0;P.dir={x:1,y:0};g.OPT.aim='drag';
  }
  function drop(cls,i,dx,kind){
    prep(cls,i);
    g.beginAim(i,0,'touch');
    const s=g.aimSet(P.x+dx,P.y);
    g.aimRelease(null,null);
    const a=W.allies.filter(x=>x.k===kind).pop();
    if(!a){bad.push(cls+' '+i+' no '+kind);return}
    if(Math.abs(a.x-s.x)>0.08||Math.abs(a.y-s.y)>0.08)bad.push(cls+' '+i+' at '+a.x.toFixed(2)+','+a.y.toFixed(2)+' want '+s.x.toFixed(2)+','+s.y.toFixed(2));
  }
  if(floor(P.x+3,P.y))drop('hacker',10,3,'pstorm');
  if(floor(P.x+1,P.y))drop('hacker',4,1,'turret');
  drop('courier',3,2,'decoy');
  drop('courier',4,2,'trops');
  prep('courier',11);P.lastThrow={dx:1,dy:0,m:1,pierce:0,dt:'impact',col:'#fff',life:.4,spd:8,ret:0,split:0,lance:0};
  g.beginAim(11,0,'touch');const sd=g.aimSet(P.x+1.2,P.y);g.aimRelease(null,null);
  const dropA=W.allies.find(a=>a.k==='drop');
  if(!dropA||Math.abs(dropA.x-sd.x)>0.08)bad.push('second drop');
  drop('anon',0,2,'decoy');
  drop('anon',3,1.5,'mine');
  if(floor(P.x+1.2,P.y)){
    prep('homesteader',0);g.beginAim(0,0,'touch');const sc=g.aimSet(P.x+1.2,P.y);g.aimRelease(null,null);
    const plot=W.allies.find(a=>a.k==='plot');
    if(!plot||Math.abs(plot.r-g.aimSpec(0).r)>0.001||Math.abs(plot.x-sc.x)>0.08)bad.push('cold frame '+JSON.stringify(plot&&{x:plot.x,r:plot.r}));
    prep('homesteader',9);g.beginAim(9,0,'touch');const sf=g.aimSet(P.x+1.2,P.y);g.aimRelease(null,null);
    const frost=W.allies.find(a=>a.k==='plot');
    if(!frost||Math.abs(frost.r-3.4)>0.001||Math.abs(frost.x-sf.x)>0.08)bad.push('kill frost');
    prep('homesteader',6);g.beginAim(6,0,'touch');g.aimSet(P.x+3,P.y);const preview=g.hedgePts(3,0);g.aimRelease(null,null);
    const hedges=W.allies.filter(a=>a.k==='hedge');
    if(hedges.length!==5)bad.push('hedge count '+hedges.length);
    else hedges.forEach((h,i)=>{if(Math.abs(h.x-preview[i].x)>0.02||Math.abs(h.y-preview[i].y)>0.02||Math.abs(h.r-.42)>0.001)bad.push('hedge '+i)});
  }else bad.push('plot tile blocked');
  prep('hacker',9);g.beginAim(9,0,'touch');g.aimSet(P.x+4.5,P.y);const pts=g.faultPts(4.5,0,4.5);g.aimRelease(null,null);
  const fault=W.allies.find(a=>a.k==='fault');
  if(!fault||fault.r!==.75||fault.pts.length!==pts.length)bad.push('fault '+(fault&&fault.pts.length));
  else fault.pts.forEach((pt,i)=>{if(Math.abs(pt.x-pts[i].x)>0.02)bad.push('fault pt '+i)});
  prep('founder',1);
  const foe=g.spawn('tick',P.x+3,P.y);foe.stun=0;foe.aggro=false;const foeHp=foe.hp;
  g.beginAim(1,0,'touch');g.aimSet(foe.x,foe.y);g.aimRelease(null,null);
  if(!(foe.stun>1)||!(foe.hp<foeHp))bad.push('cease stun '+foe.stun+' hp '+(foeHp-foe.hp));
  prep('anon',5);
  const dox=g.spawn('tick',P.x+3,P.y);const far=g.spawn('tick',P.x+3,P.y+4);dox.stun=99;far.stun=99;
  g.beginAim(5,0,'touch');g.aimSet(dox.x,dox.y);g.aimRelease(null,null);
  if(!(dox.mark>0)||far.mark>0)bad.push('dox mark '+dox.mark+'/'+far.mark);
  prep('anon',6);
  const zip=g.spawn('tick',P.x+3,P.y);const zfar=g.spawn('tick',P.x+3,P.y+4);zip.stun=99;zfar.stun=99;const zh=zip.hp,zf=zfar.hp;
  g.beginAim(6,0,'touch');g.aimSet(zip.x,zip.y);g.aimRelease(null,null);
  if(!(zip.hp<zh)||zfar.hp<zf)bad.push('zip bomb');
  prep('scrapper',12);
  const horn=g.spawn('tick',P.x+.4,P.y);const hfar=g.spawn('tick',P.x+6,P.y);horn.stun=99;hfar.stun=99;const hh=horn.hp,hf=hfar.hp;
  g.beginAim(12,0,'touch');const stay=g.aimSet(P.x+9,P.y);g.aimRelease(null,null);
  if(Math.hypot(stay.x-P.x,stay.y-P.y)>0.02)bad.push('strike reticle left the hero');
  if(!(horn.hp<hh)||hfar.hp<hf)bad.push('call the strike');
  prep('maxi',9);
  const half=g.spawn('tick',P.x+1,P.y);half.hp=half.max;half.stun=99;
  const farH=g.spawn('tick',P.x+6,P.y);farH.hp=farH.max;farH.stun=99;
  const h0=half.hp,f0=farH.hp;
  g.beginAim(9,0,'touch');g.aimRelease(null,null);
  if(!(half.hp<h0)||farH.hp<f0)bad.push('halving');
  g.G.cls='hacker';
  return bad;
});
placed.forEach(s=>fail.push(s));

const blink=await p.evaluate(()=>{
  const g=__g,P=g.P;
  g.G.cls='hacker';g.G.en=800;P.hitStun=0;P.cd[100]=0;P.castWait=0;P.dash=null;
  const it=g.tryGear('cipher');
  if(!it||!g.itemSkillOn(100))return {gear:0};
  const tx=P.x+4,ty=P.y;
  g.OPT.aim='drag';
  g.beginAim(100,null,'touch');
  g.aimSet(tx,ty);
  const dest=g.blinkEnd(g.AIMING.x,g.AIMING.y);
  const ox=P.x,oy=P.y;
  g.aimRelease(null,null);
  return {gear:1,dx:P.x-ox,dy:P.y-oy,dest,x:P.x,y:P.y,aim:g.AIMING};
});
if(!blink.gear)fail.push('cipher mantle did not equip');
else if(!blink.dest||!near(blink.x,blink.dest.x)||!near(blink.y,blink.dest.y))fail.push('teleport path '+JSON.stringify(blink));

const step=await p.evaluate(()=>{
  const g=__g,P=g.P,W=g.W,N=W.N;
  let best=null,bn=-1;
  for(let y=4;y<N-4;y++)for(let x=4;x<N-4;x++){
    if(W.map[y*N+x]!==1)continue;
    let n=0;
    for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++)if(W.map[(y+dy)*N+(x+dx)]===1)n++;
    if(n>bn){bn=n;best={x:x+.5,y:y+.5}}
  }
  P.x=best.x;P.y=best.y;
  g.G.cls='hacker';g.G.sk[12]=1;g.G.en=800;P.cd[12]=0;P.castWait=0;P.dash=null;P.dir={x:1,y:0};
  W.ents.length=0;
  const ox=P.x,oy=P.y;
  g.OPT.aim='drag';
  g.beginAim(12,0,'touch');
  g.aimSet(P.x-3,P.y);
  g.aimRelease(null,null);
  return {dx:P.x-ox,dy:P.y-oy};
});
if(!(step.dx<-1))fail.push('step back went '+step.dx);

if(errs.length)fail.push('pageerror '+errs.join(' | '));
await b.close();
if(fail.length){console.error(fail.join('\n'));process.exit(1)}
console.log('drag aim ok');
})().catch(e=>{console.error(e);process.exit(1)});
