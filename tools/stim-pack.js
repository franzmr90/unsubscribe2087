/* Belt first, then the pack. Drink stays on the belt counter.
   node tools/stim-pack.js */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const fail=m=>{console.error(m);process.exitCode=1;throw new Error(m)};

(async()=>{
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:1280,height:800}});
const errs=[];p.on('pageerror',e=>errs.push(e.message||String(e)));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8')+'</body></html>');
await p.waitForTimeout(400);
await p.evaluate(()=>{__g.skipDisc();__g.OPT.noWalk=1});
await p.evaluate(()=>{document.getElementById('title').hidden=true;__g.newGame('scrapper');__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1;__g.G.god=true});
for(let i=0;i<10;i++){
  await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}});
  await p.waitForTimeout(60);
}
await p.evaluate(()=>__g.enter(0));
await p.waitForTimeout(150);
await p.evaluate(()=>{const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()};__g.setMode('play');__g.G.god=true;__g.calc()});

const run=await p.evaluate(()=>{
  const g=__g,G=g.G,P=g.P,O=g.OPT;
  const log=()=>document.getElementById('log').textContent||'';
  const clear=()=>{document.getElementById('log').innerHTML=''};
  const stimsIn=()=>G.bag.filter(it=>it&&it.stim);
  const ring=()=>{const it=g.makeItem(2,0,'ring');it.id=true;it.req=1;it.q=0;it.name='Fill';return it};
  g.calc();
  const cap=g.S.cap;
  const out={cap};
  const reset=()=>{O.autoLoot=true;O.lootStim=true;G.bag=[];g.W.drops=[];P.warn=0;clear();G.stims=0;g.calc()};
  reset();
  G.stims=cap-1;
  g.W.drops=[{pot:1,x:P.x,y:P.y,t:1}];
  g.update(0.05);
  out.belt={stims:G.stims,bag:stimsIn().length,left:g.W.drops.length,log:log()};
  reset();
  G.stims=cap;
  g.W.drops=[{pot:1,x:P.x,y:P.y,t:1}];
  g.update(0.05);
  const packed=stimsIn()[0];
  out.pack={stims:G.stims,n:stimsIn().length,left:g.W.drops.length,slot:packed&&packed.slot||'',free:!!(packed&&packed.free),req:packed&&packed.req,m:packed&&packed.reqMgt,lines:packed?g.itemLines(packed):'',wear:packed?g.canWear(packed):true};
  reset();
  G.stims=cap;
  for(let i=0;i<24;i++)G.bag.push(ring());
  g.W.drops=[{pot:1,x:P.x,y:P.y,t:1}];
  P.warn=0;clear();
  g.update(0.05);
  out.both={left:g.W.drops.some(d=>d.pot),log:log(),stims:G.stims,bag:G.bag.length};
  reset();
  O.lootStim=false;
  G.stims=cap-1;
  g.W.drops=[{pot:1,x:P.x,y:P.y,t:1}];
  g.update(0.05);
  out.offBelt={left:g.W.drops.length,stims:G.stims,bag:stimsIn().length};
  G.stims=cap;
  g.W.drops=[{pot:1,x:P.x,y:P.y,t:1}];
  g.update(0.05);
  out.offPack={left:g.W.drops.length,stims:G.stims,bag:stimsIn().length};
  const forced=g.W.drops[0];
  if(forced){forced.force=1;g.update(0.05)}
  out.forced={left:g.W.drops.length,stims:G.stims,bag:stimsIn().length};
  reset();
  O.lootStim=false;
  G.stims=cap;
  const card={pot:1,x:P.x,y:P.y,t:1};
  g.W.drops=[card];
  g.lootPickup(card);
  g.update(0.05);
  out.card={left:g.W.drops.length,bag:stimsIn().length,stims:G.stims};
  reset();
  G.stims=cap-1;
  const spilled=g.stimPackItem();
  g.W.drops=[{it:spilled,x:P.x,y:P.y,t:1,force:1}];
  g.update(0.05);
  out.spill={stims:G.stims,bag:stimsIn().length,left:g.W.drops.length};
  reset();
  G.stims=cap;
  G.bag=[g.stimPackItem()];
  const moved=g.stimToBelt(0);
  out.fullMove={ok:moved,stims:G.stims,bag:G.bag.length,log:log()};
  clear();
  G.stims=cap-1;
  G.bag=[g.stimPackItem()];
  const hp=G.hp;
  g.setMode('play');
  G.hp=1;
  const before=G.stims;
  g.stim();
  out.drink={stims:G.stims,before,bag:stimsIn().length,hp:G.hp,full:hp};
  G.hp=1;
  document.getElementById('bPot').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));
  out.pot={stims:G.stims,bag:stimsIn().length,hp:G.hp};
  return out;
});
if(errs.length)fail('page '+errs.join('\n'));
const cap=run.cap;
if(!(cap>0))fail('cap '+cap);
const belt=run.belt;
if(belt.stims!==cap||belt.bag||belt.left||belt.log.indexOf('Stim')<0)fail('belt '+JSON.stringify(belt));
const pack=run.pack;
if(pack.stims!==cap||pack.n!==1||pack.left||pack.slot||!pack.free||pack.req!==1||pack.m||pack.wear)fail('pack '+JSON.stringify(pack));
if(pack.lines.indexOf('The belt drinks it')<0||/Required Might|Required Level/.test(pack.lines))fail('lines '+pack.lines);
if(!run.both.left||run.both.log.indexOf('Pack full')<0||run.both.stims!==cap)fail('both '+JSON.stringify(run.both));
if(run.offBelt.left!==1||run.offBelt.stims!==cap-1||run.offBelt.bag)fail('off belt '+JSON.stringify(run.offBelt));
if(run.offPack.left!==1||run.offPack.bag||run.offPack.stims!==cap)fail('off pack '+JSON.stringify(run.offPack));
if(run.forced.left||run.forced.bag!==1||run.forced.stims!==cap)fail('forced '+JSON.stringify(run.forced));
if(run.card.left||run.card.bag!==1||run.card.stims!==cap)fail('card '+JSON.stringify(run.card));
if(run.spill.stims!==cap||run.spill.bag||run.spill.left)fail('spill '+JSON.stringify(run.spill));
if(run.fullMove.ok||run.fullMove.bag!==1||run.fullMove.log.indexOf('You cannot carry another')<0)fail('full move '+JSON.stringify(run.fullMove));
if(run.drink.stims!==run.drink.before-1||run.drink.bag!==1||!(run.drink.hp>1))fail('drink '+JSON.stringify(run.drink));
if(run.pot.stims!==run.drink.stims-1||run.pot.bag!==1||!(run.pot.hp>1))fail('button '+JSON.stringify(run.pot));

await p.evaluate(()=>{
  const g=__g,G=g.G;
  g.calc();
  G.stims=g.S.cap-1;
  G.bag=[g.stimPackItem()];
  G.hp=1;
  g.setMode('play');
  document.getElementById('log').innerHTML='';
  document.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyQ',bubbles:true}));
});
const key=await p.evaluate(()=>({stims:__g.G.stims,bag:__g.G.bag.filter(it=>it&&it.stim).length,hp:__g.G.hp,cap:__g.S.cap}));
if(key.stims!==key.cap-2||key.bag!==1||!(key.hp>1))fail('key '+JSON.stringify(key));

await p.evaluate(()=>{__g.G.stims=__g.S.cap-1;__g.G.bag=[__g.stimPackItem()];__g.setMode('play');__g.openSheet('items',{})});
await p.waitForTimeout(80);
await p.evaluate(()=>{const b=document.querySelector('#bagGrid [data-bag]');b.click();b.click()});
await p.waitForTimeout(80);
const dbl=await p.evaluate(()=>({stims:__g.G.stims,bag:__g.G.bag.filter(it=>it&&it.stim).length,log:document.getElementById('log').textContent||''}));
if(dbl.stims!==key.cap||dbl.bag||dbl.log.indexOf('On the belt')<0)fail('double tap '+JSON.stringify(dbl));

await p.evaluate(()=>{__g.closeSheet();__g.setMode('play');__g.G.stims=__g.S.cap-1;__g.G.bag=[__g.stimPackItem()];__g.openSheet('items',{});document.getElementById('log').innerHTML=''});
await p.waitForTimeout(40);
await p.click('#bagGrid [data-bag]');
await p.waitForTimeout(400);
const label=await p.evaluate(()=>{const b=document.querySelector('#pop [data-do="equip"]');return b?b.textContent:''});
if(label.indexOf('Move to belt')<0)fail('move label '+label);
await p.click('#pop [data-do="equip"]');
const moved=await p.evaluate(()=>({stims:__g.G.stims,bag:__g.G.bag.filter(it=>it&&it.stim).length,log:document.getElementById('log').textContent||'',cap:__g.S.cap}));
if(moved.stims!==moved.cap||moved.bag)fail('move '+JSON.stringify(moved));

await p.evaluate(()=>{__g.closeSheet();__g.setMode('play');__g.G.stims=__g.S.cap-1;__g.G.bag=[__g.stimPackItem()];__g.OPT.ui='mouse';__g.uiApply(true);__g.openSheet('items',{});document.getElementById('log').innerHTML=''});
await p.waitForTimeout(40);
const drag=await p.evaluate(()=>{
  const src=document.querySelector('#bagGrid [data-bag]');
  const dst=document.querySelector('[data-bpocket]');
  if(!src||!dst)return {missing:true,src:!!src,dst:!!dst};
  const dt=new DataTransfer();
  src.dispatchEvent(new DragEvent('dragstart',{bubbles:true,cancelable:true,dataTransfer:dt}));
  dst.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer:dt}));
  dst.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:dt}));
  return {stims:__g.G.stims,bag:__g.G.bag.filter(it=>it&&it.stim).length,log:document.getElementById('log').textContent||'',cap:__g.S.cap,drag:src.getAttribute('draggable')};
});
if(drag.missing||drag.stims!==drag.cap||drag.bag||drag.drag!=='true')fail('drag '+JSON.stringify(drag));

await p.evaluate(()=>{
  __g.closeSheet();__g.setMode('play');
  __g.G.stims=__g.S.cap;
  __g.G.bag=[];
  __g.OPT.ui='touch';__g.OPT.autoLoot=false;__g.OPT.lootStim=false;
  __g.W.drops=[{pot:1,x:__g.P.x,y:__g.P.y,t:2}];
  __g.P.x=__g.P.x;
});
await p.setViewportSize({width:390,height:844});
await p.evaluate(()=>__g.uiApply(true));
await p.waitForTimeout(50);
await p.evaluate(()=>{if(typeof drawLootLabels==='function'){} __g.render&&__g.render()});
await p.waitForTimeout(80);
const tap=await p.evaluate(()=>{
  const labs=document.getElementById('lootLabs');
  const btn=labs&&labs.querySelector('button');
  if(btn)btn.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));
  return {open:!document.getElementById('lootCard').hidden,labs:labs?labs.childElementCount:0,touch:__g.uiTouch()};
});
if(!tap.touch||!tap.open)fail('ground tap '+JSON.stringify(tap));
await p.click('#lootCard [data-lpick]');
await p.evaluate(()=>__g.update(0.05));
const got=await p.evaluate(()=>({bag:__g.G.bag.filter(it=>it&&it.stim).length,stims:__g.G.stims,left:__g.W.drops.length,cap:__g.S.cap}));
if(got.bag!==1||got.stims!==got.cap||got.left)fail('tap card '+JSON.stringify(got));

if(errs.length)fail('late '+errs.join('\n'));
console.log('stim-pack ok cap '+cap);
await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
