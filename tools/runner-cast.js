/* Held Runner skills must fire again once energy or silence clears.
   A plain swing is not on that latch. The same wait is checked on every class.
   node tools/runner-cast.js */
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
await p.waitForTimeout(150);
await p.click('[data-cls=courier]');
await p.waitForTimeout(200);
await p.evaluate(()=>{__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1;__g.OPT.auto=false;__g.G.god=true});
await clearUI(p);
await p.evaluate(()=>{__g.enter(0);__g.setMode('play')});
await clearUI(p);

const fail=[];
const DT=1/60, LIMIT=0.3;

const report=await p.evaluate(({DT,LIMIT})=>{
  const g=__g, fail=[];
  const gaps=[];
  function quiet(){
    const P=g.P;
    P.dash=null;P.volley=null;P.silence=0;P.castWait=0;P.hitStun=0;P.atk=0;P.freeThrow=0;
    if(P.cd)for(let i=0;i<P.cd.length;i++)P.cd[i]=0;
    g.W.ents.length=0;g.W.projs.length=0;g.W.allies.length=0;
    g.mouseClick('left',P.x+3,P.y);
  }
  function arm(cls,i){
    const G=g.G;
    G.cls=cls;G.lvl=24;G.form=null;G.formDt=null;G.god=true;
    G.sk=g.CLS[cls].sk.map(()=>1);
    G.slots=[i,0,1];
    G.pas=[];
    g.calc();
    G.en=g.S.maxEn;
    g.setMode('play');
    quiet();
    g.ensureMouse();
    G.mouse.R=i;G.mouse.L=-1;
  }
  /* Hold the right button with an empty bar, then fill it. The cast has to land inside 300ms of the refill. */
  function holdGap(cls,i){
    arm(cls,i);
    const G=g.G,P=g.P;
    G.en=0;P.cd[i]=0;
    g.mouseClick('right',P.x+1,P.y,{hold:true});
    let early=false;
    for(let n=0;n<12;n++){g.update(DT);if(P.cd[i]>0)early=true}
    if(early)return 'cast with an empty bar';
    G.en=g.S.maxEn;
    let frames=0;
    for(;frames<40;frames++){g.update(DT);if(P.cd[i]>0)break}
    const sec=frames*DT;
    if(!(P.cd[i]>0))return 'never cast after the bar refilled';
    if(sec>LIMIT)return 'late by '+(sec*1000).toFixed(0)+'ms';
    return '';
  }
  const runner=[0,1,3,4,6,7,9,11,12,14];
  for(const i of runner){
    const why=holdGap('courier',i);
    if(why)fail.push('runner '+g.CLS.courier.sk[i].n+' '+why);
    else gaps.push('runner '+g.CLS.courier.sk[i].n+' ok');
  }
  for(const cls of ['scrapper','hacker','anon','founder','homesteader','witness','maxi']){
    const i=g.CLS[cls].sk.findIndex(s=>s.a);
    const why=holdGap(cls,i);
    if(why)fail.push(cls+' '+g.CLS[cls].sk[i].n+' '+why);
    else gaps.push(cls+' '+g.CLS[cls].sk[i].n+' ok');
  }

  arm('courier',0);
  const G=g.G,P=g.P;
  /* A tap that misses does not fire later by itself. */
  G.en=0;P.cd[0]=0;
  g.mouseClick('right',P.x+1,P.y,{hold:false});
  g.update(DT);
  G.en=g.S.maxEn;
  for(let n=0;n<20;n++)g.update(DT);
  if(P.cd[0]>0)fail.push('a released click cast itself once the bar refilled');

  /* Silence blocks the skill and not the plain throw. The hold resumes when it ends. */
  quiet();G.mouse.R=0;G.en=g.S.maxEn;P.cd[0]=0;P.silence=2;P.atk=0;
  g.attack();
  if(!(P.atk>0))fail.push('plain attack did not swing while silenced');
  P.atk=0;
  g.mouseClick('right',P.x+1,P.y,{hold:true});
  let during=false;
  for(let n=0;n<10;n++){g.update(DT);if(P.cd[0]>0)during=true}
  if(during)fail.push('skill cast while silenced');
  P.silence=0;
  let fr=0;
  for(;fr<20;fr++){g.update(DT);if(P.cd[0]>0)break}
  if(!(P.cd[0]>0)||fr*DT>LIMIT)fail.push('held skill did not resume after silence ('+fr+')');

  /* A fresh hit stuns the blink, not a Runner throw. */
  quiet();G.mouse.R=0;G.en=g.S.maxEn;P.hitStun=1.5;P.cd[0]=0;
  g.mouseClick('right',P.x+1,P.y,{hold:true});
  g.update(DT);
  if(!(P.cd[0]>0))fail.push('hit stun blocked a runner skill');

  /* Ninety-six projectiles do not refuse the next throw. */
  quiet();G.mouse.R=0;G.en=g.S.maxEn;P.cd[0]=0;
  for(let n=0;n<96;n++)g.W.projs.push({x:P.x,y:P.y,vx:1,vy:0,life:9,m:.1,pierce:0,done:[],col:'#fff'});
  g.mouseClick('right',P.x+1,P.y,{hold:true});
  g.update(DT);
  if(!(P.cd[0]>0))fail.push('a full projectile list refused the cast');
  if(g.W.projs.length>96)fail.push('projectile list grew past 96 ('+g.W.projs.length+')');

  /* F1 puts the skill on the right button. The hold then casts that skill. */
  quiet();
  g.hotBind(0,1);g.hotUse(0);
  if(G.mouse.R!==1)fail.push('hotkey did not fill the right button');
  G.en=g.S.maxEn;P.cd[1]=0;
  g.mouseClick('right',P.x+1,P.y,{hold:true});
  g.update(DT);
  if(!(P.cd[1]>0))fail.push('hotkey skill did not cast');
  if(P.cd[0]>0)fail.push('hotkey cast the wrong skill');

  /* Kill the target in the middle of a rush. The next skill still arms. */
  quiet();G.mouse.R=6;G.en=g.S.maxEn;P.cd[6]=0;
  const foe=g.spawn('bot',P.x+1.2,P.y);
  if(!foe)fail.push('no bot');
  else{
    foe.stun=30;foe.hp=50;
    g.mouseClick('right',foe.x,foe.y,{hold:true});
    g.update(DT);
    if(!(P.cd[6]>0))fail.push('rush order did not start');
    foe.hp=0;g.kill(foe);
    for(let n=0;n<8;n++)g.update(DT);
    P.cd[0]=0;P.volley=null;P.dash=null;G.mouse.R=0;G.en=g.S.maxEn;
    g.mouseClick('left',P.x+3,P.y);
    g.mouseClick('right',P.x+1,P.y,{hold:true});
    g.update(DT);
    if(!(P.cd[0]>0))fail.push('skill after a kill mid-cast did not fire');
  }

  /* Town, a district, town again. enter() replaces P, so the shot has to read the new one. */
  G.in1=1;G.act2=true;
  g.enter(1);g.setMode('play');
  g.enter(0);g.setMode('play');
  quiet();
  const Q=g.P;
  G.cls='courier';G.sk=g.CLS.courier.sk.map(()=>1);G.mouse.R=0;g.calc();G.en=g.S.maxEn;Q.cd[0]=0;
  g.mouseClick('right',Q.x+1,Q.y,{hold:true});
  g.update(DT);
  if(!(g.P.cd[0]>0))fail.push('skill did not cast after a portal hop');

  return {fail,gaps};
},{DT,LIMIT});

fail.push(...report.fail);
if(errs.length)fail.push('page '+errs.slice(0,3).join(' | '));

const blur=await p.evaluate(()=>{
  const g=__g,G=g.G,P=g.P;
  G.cls='courier';G.sk=g.CLS.courier.sk.map(()=>1);g.calc();G.en=g.S.maxEn;g.setMode('play');
  P.dash=null;P.cd[0]=0;P.silence=0;G.mouse.R=0;
  const cv=document.getElementById('cv'),r=cv.getBoundingClientRect();
  cv.dispatchEvent(new PointerEvent('pointerdown',{button:2,clientX:r.left+r.width/2,clientY:r.top+r.height/2,pointerType:'mouse',bubbles:true,pointerId:9}));
  g.update(1/60);
  const cast=P.cd[0]>0;
  window.dispatchEvent(new Event('blur'));
  P.cd[0]=0;G.en=g.S.maxEn;
  for(let n=0;n<15;n++)g.update(1/60);
  const stuck=P.cd[0]>0;
  g.mouseClick('right',P.x+1,P.y,{hold:true});
  g.update(1/60);
  return {cast,stuck,again:P.cd[0]>0};
});
if(!blur.cast)fail.push('pointer cast did not fire before blur');
if(blur.stuck)fail.push('blur left the button held and the skill fired on its own');
if(!blur.again)fail.push('a click after blur did not cast');

/* Manifest's hit has to follow the cursor, at every zoom, pixel ratio, and map edge.
   The camera does not clamp. A stale frame and a fresh one both have to agree with the pixels. */
async function aimSession(viewport,dpr,tag){
  const ctx=await b.newContext({viewport,deviceScaleFactor:dpr});
  const page=await ctx.newPage();
  const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
  await page.waitForTimeout(250);
  await page.evaluate(()=>__g.skipDisc());
  await page.waitForTimeout(80);
  await page.click('[data-cls=courier]');
  await page.waitForTimeout(120);
  await page.evaluate(()=>{__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1;__g.OPT.auto=false;__g.G.god=true});
  await clearUI(page);
  await page.evaluate(()=>{__g.enter(0);__g.setMode('play')});
  await clearUI(page);
  const why=await page.evaluate(()=>{
    const g=__g,bad=[];
    const G=g.G;G.cls='courier';G.lvl=24;G.god=true;G.sk=g.CLS.courier.sk.map(()=>1);g.calc();g.setMode('play');g.ensureMouse();
    g.hotBind(0,12);g.hotUse(0);
    if(G.mouse.R!==12)bad.push('hotkey did not arm Manifest');
    function ang(a,b){let d=Math.abs(a-b);if(d>Math.PI)d=Math.PI*2-d;return d}
    function shot(px,py){
      const P=g.P;P.dash=null;P.silence=0;P.cd[12]=0;G.en=g.S.maxEn;G.mouse.R=12;g.W.ents.length=0;g.W.projs.length=0;
      g.mouseClick('left',P.x+3,P.y);
      const cv=document.getElementById('cv');
      cv.dispatchEvent(new PointerEvent('pointerdown',{button:2,clientX:px,clientY:py,pointerType:'mouse',bubbles:true,pointerId:4,buttons:2}));
      g.update(1/60);
      window.dispatchEvent(new Event('blur'));
      const pr=g.W.projs.find(q=>q.lance),P2=g.P,w=g.worldAt(px,py);
      const got=pr?Math.atan2(pr.vy,pr.vx):(P2.cd[12]>0?Math.atan2(P2.dir.y,P2.dir.x):null);
      if(got==null)return 'no manifest';
      const d=ang(got,Math.atan2(w.y-P2.y,w.x-P2.x));
      return d>0.07?'aim off '+(d*180/Math.PI).toFixed(1)+'deg':'';
    }
    function frame(){g.render()}
    const cv=document.getElementById('cv'),r=cv.getBoundingClientRect();
    const spots=[[r.left+r.width*0.72,r.top+r.height*0.38],[r.left+r.width*0.22,r.top+r.height*0.62],[r.left+12,r.top+12],[r.left+r.width-12,r.top+r.height-12]];
    g.P.x=g.W.start.x;g.P.y=g.W.start.y;frame();
    for(const[x,y]of spots){const w=shot(x,y);if(w)bad.push('center '+w)}
    const N=g.W.N||24;
    function floorNear(ax,ay){
      let b=null,bd=1e9;const map=g.W.map;
      for(let y=1;y<N-1;y++)for(let x=1;x<N-1;x++){if(!map[y*N+x])continue;const d=(x-ax)*(x-ax)+(y-ay)*(y-ay);if(d<bd){bd=d;b={x:x+.5,y:y+.5}}}
      return b||{x:ax,y:ay}}
    for(const spot of [floorNear(1,1),floorNear(N-2,N-2)]){g.P.x=spot.x;g.P.y=spot.y;frame();const w=shot(r.left+r.width*0.78,r.top+r.height*0.32);if(w)bad.push('edge '+spot.x.toFixed(0)+' '+w)}
    g.P.x=g.W.start.x;g.P.y=g.W.start.y;frame();g.P.x+=1.1;g.P.y+=.4;
    const stale=shot(r.left+r.width*0.66,r.top+r.height*0.5);if(stale)bad.push('stale camera '+stale);
    frame();const fresh=shot(r.left+r.width*0.66,r.top+r.height*0.5);if(fresh)bad.push('moved '+fresh);
    return bad;
  });
  if(why.length)fail.push(tag+' '+why.join('; '));
  if(errs.length)fail.push(tag+' page '+errs[0]);
  await ctx.close();
}
await aimSession({width:1280,height:800},1,'aim 1280');
await aimSession({width:480,height:820},1,'aim narrow');
await aimSession({width:1440,height:900},2,'aim hidpi');

await b.close();
if(fail.length){
  console.error(fail.join('\n'));
  process.exit(1);
}
console.log('runner-cast ok');
console.log(report.gaps.join('\n'));
})().catch(e=>{console.error(e);process.exit(1)});
