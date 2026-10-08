/* Desktop controls: click-to-move, click-to-attack, right-click cast,
   F-key bind/swap, shift stand-still, and the skill slots.
   node tools/desktop-controls.js */
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
await p.click('[data-cls=scrapper]');
await p.waitForTimeout(200);
await p.evaluate(()=>{__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1;__g.OPT.auto=false;__g.G.god=true});
await clearUI(p);
await p.evaluate(()=>{__g.enter(0);__g.setMode('play')});
await clearUI(p);
await p.waitForTimeout(200);

const fail=[];
const move=await p.evaluate(()=>{
  const W=__g.W,N=W.N;
  const walk=(x,y)=>x>=1&&y>=1&&x<N-1&&y<N-1&&W.map[(y|0)*N+(x|0)]===1;
  let spot=null;
  for(let y=2;y<N-2&&!spot;y++)for(let x=2;x<N-6;x++){
    let ok=true;
    for(let i=0;i<=4;i++)if(!walk(x+i,y))ok=false;
    if(ok){spot={x:x+.5,y:y+.5,tx:x+4.5,ty:y+.5};break}}
  if(!spot)return {spot:null};
  const P=__g.P;P.x=spot.x;P.y=spot.y;
  const path=__g.pathFind(spot.tx,spot.ty);
  const ord=__g.mouseClick('left',spot.tx,spot.ty);
  const x0=P.x,y0=P.y;
  for(let i=0;i<90;i++)__g.update(0.05);
  return {spot:1,ord:ord&&ord.k,path:path&&path.length,d0:Math.hypot(x0-spot.tx,y0-spot.ty),d1:Math.hypot(P.x-spot.tx,P.y-spot.ty),x:P.x,y:P.y};
});
if(!move.spot)fail.push('no straight walkable row in town');
else{
  if(move.ord!=='move')fail.push('ground click order '+move.ord);
  if(!(move.path>=1))fail.push('pathFind returned nothing');
  if(!(move.d1<0.7&&move.d1<move.d0-2))fail.push('click-to-move ended '+move.d1.toFixed(2)+' from target (was '+move.d0.toFixed(2)+')');
}

const atk=await p.evaluate(()=>{
  const W=__g.W,N=W.N,P=__g.P;
  const walk=(x,y)=>x>=1&&y>=1&&x<N-1&&y<N-1&&W.map[(y|0)*N+(x|0)]===1;
  let spot=null;
  for(let y=2;y<N-2&&!spot;y++)for(let x=2;x<N-6;x++){
    let ok=true;
    for(let i=0;i<=4;i++)if(!walk(x+i,y))ok=false;
    if(ok){spot={x:x+.5,y:y+.5};break}}
  P.x=spot.x;P.y=spot.y;
  const e=__g.spawn('tick',spot.x+3.2,spot.y);
  if(!e)return {spawn:0};
  e.stun=99;e.aggro=false;
  const hp=e.hp,x0=P.x,y0=P.y;
  const ord=__g.mouseClick('left',e.x,e.y);
  for(let i=0;i<100;i++)__g.update(0.05);
  return {spawn:1,ord:ord&&ord.k,hp,hp2:e.hp,moved:Math.hypot(P.x-x0,P.y-y0),dist:Math.hypot(P.x-e.x,P.y-e.y)};
});
if(!atk.spawn)fail.push('could not spawn a tick');
else{
  if(atk.ord!=='atk')fail.push('monster click order '+atk.ord);
  if(!(atk.moved>0.6))fail.push('did not walk toward the tick ('+atk.moved.toFixed(2)+')');
  if(!(atk.hp2<atk.hp))fail.push('left click did not hurt the tick');
}

const cast=await p.evaluate(()=>{
  const P=__g.P,W=__g.W;
  const foe=W.ents.find(e=>e.hp>0&&e.k==='tick')||__g.spawn('tick',P.x+1.15,P.y);
  if(!foe)return {spawn:0};
  foe.stun=99;foe.x=P.x+1.15;foe.y=P.y;foe.hp=foe.max;
  __g.ensureMouse();
  __g.G.mouse.R=0;
  __g.G.en=__g.S.maxEn;
  const hp=foe.hp,x0=P.x,y0=P.y;
  const ord=__g.mouseClick('right',foe.x,foe.y);
  for(let i=0;i<8;i++)__g.update(0.05);
  return {spawn:1,ord:ord&&ord.k,stand:ord&&ord.stand,hp,hp2:foe.hp,moved:Math.hypot(P.x-x0,P.y-y0)};
});
if(!cast.spawn)fail.push('no foe for the right click');
else{
  if(cast.ord!=='cast')fail.push('right click order '+cast.ord);
  if(!cast.stand)fail.push('right click walked instead of casting');
  if(!(cast.hp2<cast.hp))fail.push('right click did not cast');
  if(!(cast.moved<0.35))fail.push('right click moved the hero '+cast.moved.toFixed(2));
}

const keys=await p.evaluate(()=>{
  const G=__g.G;
  G.sk[1]=1;__g.calc();
  __g.hotBind(0,1);
  G.mouse.R=-1;
  __g.hotUse(0);
  const afterApi=G.mouse.R;
  G.mouse.R=0;
  document.dispatchEvent(new KeyboardEvent('keydown',{code:'F1',key:'F1',bubbles:true}));
  const afterKey=G.mouse.R;
  __g.hotBind(1,0);
  G.mouse.R=1;
  document.dispatchEvent(new WheelEvent('wheel',{deltaY:120,bubbles:true,cancelable:true}));
  return {hot:G.hot[0],afterApi,afterKey,afterWheel:G.mouse.R,hot2:G.hot[1]};
});
if(keys.hot!==1)fail.push('F1 did not bind skill 1');
if(keys.afterApi!==1)fail.push('hotUse did not fill the right slot');
if(keys.afterKey!==1)fail.push('F1 key did not swap the right slot ('+keys.afterKey+')');
if(keys.afterWheel!==0)fail.push('wheel did not cycle the right slot to Attack/skill 0 ('+keys.afterWheel+')');

const still=await p.evaluate(()=>{
  const P=__g.P,W=__g.W,N=W.N;
  const walk=(x,y)=>x>=1&&y>=1&&x<N-1&&y<N-1&&W.map[(y|0)*N+(x|0)]===1;
  let spot=null;
  for(let y=2;y<N-2&&!spot;y++)for(let x=2;x<N-8;x++){
    if(walk(x,y)&&walk(x+6,y)){spot={x:x+.5,y:y+.5};break}}
  P.x=spot.x;P.y=spot.y;
  const e=__g.spawn('tick',spot.x+6,spot.y);
  if(!e)return {spawn:0};
  e.stun=99;
  const x0=P.x,y0=P.y;
  const ord=__g.mouseClick('left',e.x,e.y,{shift:true});
  for(let i=0;i<30;i++)__g.update(0.05);
  return {spawn:1,stand:ord&&ord.stand,moved:Math.hypot(P.x-x0,P.y-y0)};
});
if(!still.spawn)fail.push('no foe for shift-stand');
else{
  if(!still.stand)fail.push('shift click was not stand-still');
  if(!(still.moved<0.2))fail.push('shift click walked '+still.moved.toFixed(2));
}

const ui=await p.evaluate(()=>{
  __g.closeSheet();
  __g.setMode('play');
  __g.openSheet('items');
  const sheet=document.getElementById('sheet');
  sheet.dispatchEvent(new PointerEvent('pointerdown',{button:0,clientX:200,clientY:240,pointerType:'mouse',bubbles:true,pointerId:3}));
  const sheetMo=__g.MO;
  __g.closeSheet();
  __g.setMode('play');
  __g.render();
  const cv=document.getElementById('cv'),r=cv.getBoundingClientRect();
  cv.dispatchEvent(new PointerEvent('pointerdown',{button:0,clientX:r.left+r.width*0.82,clientY:r.top+r.height*0.72,pointerType:'mouse',bubbles:true,pointerId:4}));
  cv.dispatchEvent(new PointerEvent('pointerup',{button:0,clientX:r.left+r.width*0.82,clientY:r.top+r.height*0.72,pointerType:'mouse',bubbles:true,pointerId:4}));
  const world=__g.MO;
  const hands=__g.WALK.basics[0].text;
  __g.openSheet('codex');
  const codex=document.getElementById('sheetIn').innerText;
  __g.closeSheet();
  __g.setMode('play');
  return {sheetMo:sheetMo&&sheetMo.k,world:world&&world.k,hands:/left click/i.test(hands),codex:/F1 through F8/.test(codex)};
});
if(ui.sheetMo)fail.push('sheet click ordered '+ui.sheetMo);
if(!ui.world)fail.push('canvas click did not order a move');
if(!ui.hands)fail.push('walkthrough hands slide has no left click');
if(!ui.codex)fail.push('codex controls section missing');

await p.evaluate(()=>{
  const G=__g.G;
  for(let i=0;i<8;i++)G.sk[i]=1;
  __g.calc();
  __g.ensureMouse();
  __g.setMode('play');
  __g.closeSheet();
  const pk=document.getElementById('mPick');if(pk)pk.hidden=true;
});
await p.waitForTimeout(250);
const dir='/opt/cursor/artifacts';
fs.mkdirSync(dir,{recursive:true});
await p.screenshot({path:path.join(dir,'d2-hud-slots.png')});
await p.click('#mR');
await p.waitForTimeout(150);
const right=await p.evaluate(()=>{
  const box=document.getElementById('mPick');
  const ids=[...box.querySelectorAll('[data-msk]')].map(b=>+b.dataset.msk);
  return {hidden:box.hidden,ids,text:box.innerText.slice(0,80)};
});
await p.screenshot({path:path.join(dir,'d2-skill-picker.png')});
await p.click('#mL');
await p.waitForTimeout(150);
const left=await p.evaluate(()=>{
  const box=document.getElementById('mPick');
  return {hidden:box.hidden,ids:[...box.querySelectorAll('[data-msk]')].map(b=>+b.dataset.msk)};
});
await p.screenshot({path:path.join(dir,'d2-left-picker.png')});
if(right.hidden)fail.push('right slot did not open the picker');
if(right.ids.indexOf(5)<0)fail.push('right picker hid War Horn '+JSON.stringify(right.ids));
if(left.hidden)fail.push('left slot did not open the picker');
if(left.ids.indexOf(5)>=0)fail.push('left picker offered War Horn '+JSON.stringify(left.ids));
if(left.ids.indexOf(-1)<0||left.ids.indexOf(0)<0)fail.push('left picker missing Attack or Stop Sign '+JSON.stringify(left.ids));

const slots=await p.evaluate(()=>{
  const L=document.getElementById('mL'),R=document.getElementById('mR');
  const lr=L.getBoundingClientRect(),rr=R.getBoundingClientRect(),hp=document.querySelector('.orb.hp').getBoundingClientRect(),en=document.querySelector('.orb.en').getBoundingClientRect();
  return {l:lr.width,r:rr.width,lLeft:lr.right<=hp.left+2,rRight:rr.left>=en.right-2,lt:L.querySelector('b').textContent,rt:R.querySelector('b').textContent};
});
if(!(slots.l>20&&slots.r>20))fail.push('skill slots have no size');
if(!slots.lLeft)fail.push('left slot is not beside the life orb');
if(!slots.rRight)fail.push('right slot is not beside the energy orb');

if(errs.length)fail.push('pageerror '+errs.join(' | '));
await b.close();
if(fail.length){console.log('FAIL\n'+fail.join('\n'));process.exit(1)}
console.log('PASS',JSON.stringify({move,atk:{ord:atk.ord,moved:+atk.moved.toFixed(2),hurt:atk.hp2<atk.hp},cast:{moved:+cast.moved.toFixed(2)},keys,still:{moved:+still.moved.toFixed(2)},left:left.ids,right:right.ids,slots}));
})().catch(e=>{console.error(e);process.exit(1)});
