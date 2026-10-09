/* Ground names: a short label, a hover or a tap, and no walk-up description.
   node tools/loot-labels.js
   Shots: /opt/cursor/artifacts/loot-labels-desktop.png
           /opt/cursor/artifacts/loot-labels-mobile.png */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const shot=p=>path.join('/opt/cursor/artifacts',p);

async function clearUI(p){
  for(let i=0;i<24;i++){
    const st=await p.evaluate(()=>{
      const s=document.getElementById('scene');
      if(s&&!s.hidden){document.getElementById('scSkip').click();return 'scene'}
      const d=document.getElementById('dlg');
      if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x){x.click();return 'dlg'}return 'locked'}
      const port=document.getElementById('uiPort');
      if(port&&!port.hidden){const x=document.getElementById('uiPortX');if(x)x.click();return 'port'}
      return 'clear'});
    if(st==='clear')return;
    await p.waitForTimeout(st==='locked'?350:120);
  }
  throw new Error('overlays did not clear');
}

(async()=>{
const html=fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8');
const fail=[];
const check=(n,ok,d)=>{if(!ok)fail.push(n+(d?': '+JSON.stringify(d):''));};
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:1280,height:800}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
await p.waitForTimeout(300);
await p.evaluate(()=>__g.skipDisc());
await p.waitForTimeout(120);
await p.click('[data-cls=scrapper]');
await p.waitForTimeout(180);
await p.evaluate(()=>{__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1;__g.OPT.ui='mouse'});
await clearUI(p);
await p.evaluate(()=>__g.enter(0));
await clearUI(p);
await p.evaluate(()=>{__g.setMode('play');__g.uiApply(true)});

const logic=await p.evaluate(()=>{
  const g=__g,G=g.G,P=g.P,L=g.lootPrefs();
  g.OPT.autoLoot=false;
  L.always=0;L.hideJunk=0;L.minQ=0;L.hold=0;g.keys.AltLeft=false;g.keys.AltRight=false;
  const piece=(q,name,extra)=>{const it=g.makeItem(4,Math.min(q,2),'gloves');it.q=q;it.id=true;it.name=name;it.req=1;it.junk=0;it.aff=it.aff||[];if(extra)Object.assign(it,extra);return it};
  const white=piece(0,'White Gloves');
  const grey=piece(1,'Grey Band',{junk:1});
  const rare=piece(2,'Rare Band');
  const unique=piece(4,'Unique Gloves');
  const quest=piece(0,'Shoebox',{quest:1});
  const far=piece(2,'Far Piece');
  G.bag=[];G.sats=0;G.credits=40;
  const tip=()=>{const el=document.getElementById('cmpTip');return !!(el&&!el.hidden)};
  g.W.ents=[];
  g.W.drops=[
    {it:white,x:P.x+0.7,y:P.y,t:1},
    {it:grey,x:P.x-0.5,y:P.y+0.4,t:1},
    {it:rare,x:P.x+0.3,y:P.y-0.6,t:1},
    {it:unique,x:P.x+1.1,y:P.y+0.2,t:1},
    {it:quest,x:P.x-0.2,y:P.y-0.3,t:1},
    {it:far,x:P.x+8,y:P.y,t:1},
    {sat:4,x:P.x,y:P.y,t:1},
    {cr:9,x:P.x,y:P.y,t:1}
  ];
  g.update(0.2);g.hud();g.render();
  const walked={sats:G.sats,credits:G.credits,gear:g.W.drops.filter(d=>d.it).map(d=>d.it.name).sort(),tip:tip(),bag:G.bag.length};
  const near=g.lootLayout().map(r=>r.nm);
  g.keys.AltLeft=true;
  const alt=g.lootLayout().map(r=>r.nm);
  g.keys.AltLeft=false;
  L.always=1;
  const always=g.lootLayout().map(r=>r.nm);
  const pile=g.lootLayout();
  let overlap=0;
  for(let i=0;i<pile.length;i++)for(let j=i+1;j<pile.length;j++){
    const a=pile[i],b=pile[j];
    if(a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y)overlap++;
  }
  L.always=0;L.hideJunk=1;L.minQ=1;
  const hidden={white:g.lootPasses(g.W.drops.find(d=>d.it===white)),grey:g.lootPasses(g.W.drops.find(d=>d.it===grey)),rare:g.lootPasses(g.W.drops.find(d=>d.it===rare)),unique:g.lootPasses(g.W.drops.find(d=>d.it===unique)),quest:g.lootPasses(g.W.drops.find(d=>d.it===quest))};
  const shown=g.lootLayout().map(r=>r.nm);
  g.W.ents=[{hp:1},{hp:1},{hp:1},{hp:1},{hp:1},{hp:1}];
  L.hideJunk=0;L.minQ=0;
  const capped=g.lootLayout().length;
  g.W.ents=[];L.always=1;
  const colors=g.lootLayout().filter(r=>r.d.it).map(r=>({n:r.nm,c:r.col}));
  const long=g.lootName({it:{id:true,name:'A Very Long Unique Name Indeed',q:4},t:1});
  return {walked,near,alt,always,overlap,pile:pile.length,hidden,shown,capped,colors,long};
});
check('walk leaves gear',logic.walked.bag===0&&logic.walked.gear.length===6,logic.walked);
check('walk takes sats',logic.walked.sats===4,logic.walked);
check('walk takes credits',logic.walked.credits===49,logic.walked);
check('walk opens no description',logic.walked.tip===false,logic.walked);
check('nearby names hide the far piece',logic.near.indexOf('Far Piece')<0&&logic.near.indexOf('Rare Band')>=0,logic.near);
check('alt shows the far piece',logic.alt.indexOf('Far Piece')>=0,logic.alt);
check('always shows the far piece',logic.always.indexOf('Far Piece')>=0,logic.always);
check('labels do not overlap',logic.overlap===0&&logic.pile>=5,{overlap:logic.overlap,pile:logic.pile});
check('filter hides junk and whites',logic.hidden.white===false&&logic.hidden.grey===false&&logic.hidden.rare===true&&logic.hidden.unique===true&&logic.hidden.quest===true,logic.hidden);
check('filtered names stay off the ground',logic.shown.indexOf('White Gloves')<0&&logic.shown.indexOf('Grey Band')<0&&logic.shown.indexOf('Rare Band')>=0,logic.shown);
check('a crowded fight keeps few names',logic.capped<=2,logic.capped);
check('names stay short',logic.long.length<=24&&logic.long.indexOf('item level')<0,logic.long);
check('rarity colors',logic.colors.some(c=>c.n==='Rare Band'&&c.c==='#ffe36b')&&logic.colors.some(c=>c.n==='Unique Gloves'&&c.c==='#d0aa62'),logic.colors);

await p.evaluate(()=>{
  const L=__g.lootPrefs();L.always=1;L.hideJunk=0;L.minQ=0;L.hold=0;
  __g.W.ents=[];__g.render();
});
const at=await p.evaluate(()=>{
  __g.render();
  const box=__g.lootLayout().find(r=>r.nm==='Rare Band');
  const r=document.getElementById('cv').getBoundingClientRect();
  const z=Math.max(0.68,Math.min(1.25,Math.min(r.width,r.height)/560));
  return {x:r.left+(box.x+box.w/2)*z,y:r.top+(box.y+box.h/2)*z};
});
await p.mouse.move(at.x,at.y);
await p.waitForTimeout(180);
const hover=await p.evaluate(()=>{
  const el=document.getElementById('cmpTip');
  return {on:!!(el&&!el.hidden&&!el.classList.contains('dock')&&el.querySelector('.cmpBox')),name:!!(el&&el.textContent.indexOf('Rare Band')>=0),kind:__g.HOVER&&__g.HOVER.kind,hn:__g.HOVER&&__g.HOVER.name,text:el&&el.textContent.slice(0,160)};
});
check('hover compares the label',hover.on&&hover.name&&hover.kind==='item',hover);
await p.screenshot({path:shot('loot-labels-desktop.png')});

await p.setViewportSize({width:390,height:844});
await p.evaluate(()=>{__g.OPT.ui='touch';__g.uiApply(true);const port=document.getElementById('uiPort');if(port){port.dataset.gone='1';port.hidden=true}__g.lootPrefs().always=0;__g.lootPrefs().hideJunk=0;__g.lootPrefs().minQ=0;__g.render();__g.hud()});
await p.waitForTimeout(80);
const touch=await p.evaluate(()=>{
  const labs=[...document.querySelectorAll('#lootLabs button')];
  const names=document.getElementById('bNames');
  const r=names?names.getBoundingClientRect():{height:0,width:0};
  const rects=labs.map(b=>b.getBoundingClientRect());
  let overlap=0;
  for(let i=0;i<rects.length;i++)for(let j=i+1;j<rects.length;j++){const a=rects[i],b=rects[j];if(a.left<b.right-1&&a.right>b.left+1&&a.top<b.bottom-1&&a.bottom>b.top+1)overlap++}
  return {n:labs.length,h:rects.map(b=>b.height),names:!names.hidden,nh:r.height,nw:r.width,text:labs.map(b=>b.textContent),overlap};
});
check('touch labels are big',touch.n>=2&&touch.h.every(h=>h>=44),touch);
check('touch labels do not overlap',touch.overlap===0,touch);
check('names button is a big target',touch.names&&touch.nh>=44&&touch.nw>=44,touch);
check('touch labels are only names',touch.text.every(t=>t.indexOf('item level')<0&&t.length<=24),touch.text);
await p.evaluate(()=>{
  const b=[...document.querySelectorAll('#lootLabs button')].find(x=>/Rare Band/.test(x.textContent));
  b.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerType:'touch',clientX:40,clientY:40}));
});
const card=await p.evaluate(()=>{const c=document.getElementById('lootCard');const btns=[...c.querySelectorAll('button')].map(b=>({t:b.textContent,h:b.getBoundingClientRect().height}));return {on:!c.hidden,text:c.textContent,btns}});
check('tap opens pick up and compare',card.on&&/Pick up/.test(card.text)&&/Compare/.test(card.text)&&/Rare Band/.test(card.text)&&card.btns.every(b=>b.h>=44),card);
await p.screenshot({path:shot('loot-labels-mobile.png')});
await p.click('#lootCard [data-lcmp]');
const cmp=await p.evaluate(()=>{const el=document.getElementById('cmpTip');return {on:!!(el&&!el.hidden&&el.querySelector('.cmpBox')),name:!!(el&&el.textContent.indexOf('Rare Band')>=0)}});
check('compare opens from the card',cmp.on&&cmp.name,cmp);
const held=await p.evaluate(()=>{
  const names=document.getElementById('bNames');
  names.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerType:'touch'}));
  __g.render();
  const far=__g.lootLayout().some(r=>r.nm==='Far Piece');
  names.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerType:'touch'}));
  __g.render();
  const back=__g.lootLayout().some(r=>r.nm==='Far Piece');
  return {far,back,hold:__g.lootPrefs().hold};
});
check('holding names shows the far piece',held.far&&!held.back&&held.hold===0,held);
const took=await p.evaluate(()=>{
  __g.lootOpen(__g.W.drops.find(d=>d.it&&d.it.name==='Rare Band'),document.querySelector('#lootLabs button'));
  document.querySelector('#lootCard [data-lpick]').click();
  __g.update(0.3);
  return {bag:__g.G.bag.map(it=>it&&it.name),eq:__g.G.eq&&__g.G.eq.gloves&&__g.G.eq.gloves.name,left:__g.W.drops.some(d=>d.it&&d.it.name==='Rare Band'),card:document.getElementById('lootCard').hidden,log:document.getElementById('log').textContent.slice(0,160)};
});
check('pick up takes the piece',(took.bag.indexOf('Rare Band')>=0||took.eq==='Rare Band')&&!took.left&&took.card,took);

await p.evaluate(()=>{__g.closeSheet();__g.setMode('play');__g.OPT.ui='mouse';__g.uiApply(true);__g.openSheet('opts',{})});
await p.waitForTimeout(60);
await p.evaluate(()=>{
  const j=document.querySelector('[data-loot="junk"]');j.scrollIntoView({block:'center'});
});
const opts=await p.evaluate(()=>{
  document.querySelector('[data-loot="junk"]').click();
  document.querySelector('[data-lootq="2"]').click();
  document.querySelector('[data-opt="labels"]').click();
  const L=__g.lootPrefs();
  const text=document.getElementById('sheet').innerText;
  return {junk:L.hideJunk,minQ:L.minQ,always:L.always,junkT:/hide junk and greys/i.test(text),rareT:/rare and up/i.test(text),alwaysT:/always show item names/i.test(text)};
});
check('the filter is remembered on the device setting',opts.junk===1&&opts.minQ===2&&opts.always===1,opts);
check('options name the thresholds',opts.junkT&&opts.rareT&&opts.alwaysT,opts);

if(errs.length)fail.push(errs[0]);
if(fail.length){console.log(fail.join('\n'));process.exit(1)}
console.log('loot-labels ok');
await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
