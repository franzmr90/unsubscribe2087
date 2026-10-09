/* Pack and Lockbox tabs. On a phone one grid shows at a time.
   Tap a piece, then Move, to send it across. A desk keeps both grids
   and can still drag. node tools/lockbox-tabs.js */
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
      const port=document.getElementById('uiPortX');
      if(port&&!port.closest('#uiPort').hidden){port.click();return 'port'}
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
const p=await b.newPage({viewport:{width:390,height:844},hasTouch:true});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
await p.waitForTimeout(300);
await p.evaluate(()=>{
  window.hitOf=function(sel){
    const el=typeof sel==='string'?document.querySelector(sel):sel;
    if(!el)return {miss:true};
    const r=el.getBoundingClientRect();
    const x=r.x+r.width/2,y=r.y+Math.min(r.height/2,22);
    const top=document.elementFromPoint(x,y);
    return {in:r.top>=-1&&r.left>=-1&&r.bottom<=innerHeight+1&&r.right<=innerWidth+1,hit:!!(top&&(top===el||el.contains(top))),h:Math.round(r.height),text:el.textContent,off:!!el.disabled,show:getComputedStyle(el).display!=='none'};
  };
});
await p.evaluate(()=>__g.skipDisc());
await p.waitForTimeout(120);
await p.click('[data-cls=scrapper]');
await p.waitForTimeout(180);
await p.evaluate(()=>{__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1});
await clearUI(p);
await p.evaluate(()=>__g.enter(0));
await clearUI(p);
await p.evaluate(()=>{
  const g=__g,G=g.G;
  G.lvl=8;G.sats=20;G.credits=40;
  const gear=(name,slot)=>{const it=g.makeItem(4,1,slot||'gloves');it.id=true;it.q=1;it.name=name;it.req=1;it.val=40;it.aff=it.aff||[];it.lock=0;return it};
  G.bag=[gear('Pack Gloves','gloves'),gear('Pack Helm','helm')];
  g.ACC.stash=[gear('Box Boots','boots')];
  g.ACC.sats=0;g.ACC.cr=0;
  g.OPT.ui='touch';g.uiApply(true);
  const port=document.getElementById('uiPortX');if(port)port.click();
  g.STASHV&&(g.STASHV.side='box');
  g.setMode('play');g.openSheet('stash',{only:['stash']});
});
const phoneBox=await p.evaluate(()=>{
  const tog=document.querySelector('.stashToggle');
  const body=document.querySelector('.stashBody');
  const box=document.querySelector('[data-spanel="box"]');
  const pack=document.querySelector('[data-spanel="pack"]');
  const tabs=[...document.querySelectorAll('[data-sside]')].map(b=>({t:b.textContent,h:Math.round(b.getBoundingClientRect().height)}));
  const bs=getComputedStyle(box),ps=getComputedStyle(pack);
  return {tog:tog&&getComputedStyle(tog).display,side:body&&body.dataset.side,box:bs.display,pack:ps.display,tabs,gear:document.querySelector('#stashGrid')&&document.querySelector('#stashGrid').querySelector('[data-st="0"]')&&document.querySelector('#stashGrid [data-st="0"]').textContent};
});
check('a phone shows the Lockbox grid and hides the pack', phoneBox.tog!=='none' && phoneBox.side==='box' && phoneBox.box!=='none' && phoneBox.pack==='none' && phoneBox.tabs.map(t=>t.t).join(',')==='Lockbox,Pack' && phoneBox.tabs.every(t=>t.h>=44), phoneBox);
await p.screenshot({path:'/opt/cursor/artifacts/lockbox-phone-box.png'});

await p.touchscreen.tap(...await p.evaluate(()=>{const b=document.querySelector('[data-sside="pack"]');const r=b.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}));
await p.waitForTimeout(40);
const phonePack=await p.evaluate(()=>{
  const body=document.querySelector('.stashBody');
  const box=getComputedStyle(document.querySelector('[data-spanel="box"]')).display;
  const pack=getComputedStyle(document.querySelector('[data-spanel="pack"]')).display;
  const cell=document.querySelector('#stashPack [data-sb="0"]');
  return {side:body.dataset.side,box,pack,name:cell&&cell.textContent,head:document.querySelector('[data-spanel="pack"] h3').textContent};
});
check('Pack shows one grid and keeps the piece', phonePack.side==='pack' && phonePack.box==='none' && phonePack.pack!=='none' && phonePack.head==='Pack 2/24', phonePack);
await p.screenshot({path:'/opt/cursor/artifacts/lockbox-phone-pack.png'});

const cell=await p.locator('#stashPack [data-sb="0"]').boundingBox();
await p.touchscreen.tap(cell.x+cell.width/2, cell.y+Math.min(cell.height/2,20));
await p.waitForTimeout(80);
const card=await p.evaluate(()=>{
  const pop=document.getElementById('pop');
  const move=pop&&pop.querySelector('[data-sbmv]');
  const cmp=pop&&pop.querySelector('.cmpBox');
  const foot=document.querySelector('[data-smove]');
  const fh=hitOf(foot);
  const mh=move?hitOf(move):{miss:1};
  return {open:pop&&!pop.hidden,cmp:!!cmp,move:move&&move.textContent,foot:foot&&foot.textContent,fh,mh,box:!!(pop&&/Pack Gloves/.test(pop.textContent||''))};
});
check('a tap compares the piece and offers Move to lockbox', card.open && card.cmp && card.move==='Move to lockbox' && card.foot==='Move to lockbox' && card.box && card.fh.hit && card.fh.in && !card.fh.off, card);
if(card.fh.hit)await p.screenshot({path:'/opt/cursor/artifacts/lockbox-phone-move.png'});
const foot=await p.locator('[data-smove]').boundingBox();
await p.touchscreen.tap(foot.x+foot.width/2, foot.y+Math.min(foot.height/2,22));
await p.waitForTimeout(40);
const moved=await p.evaluate(()=>({bag:__g.G.bag.map(it=>it.name),box:(__g.ACC.stash||[]).map(it=>it.name),side:document.querySelector('.stashBody').dataset.side}));
check('Move to lockbox sends it and stays on Pack', moved.side==='pack' && moved.bag.join(',')==='Pack Helm' && moved.box.indexOf('Pack Gloves')>=0, moved);

await p.evaluate(()=>document.querySelector('[data-sside="box"]').click());
const gloveAt=await p.evaluate(()=>{
  const i=(__g.ACC.stash||[]).findIndex(it=>it&&it.name==='Pack Gloves');
  const el=document.querySelector('#stashGrid [data-st="'+i+'"]');
  const r=el.getBoundingClientRect();
  return {i,x:r.x+r.width/2,y:r.y+Math.min(r.height/2,20)};
});
const backCell={x:gloveAt.x,y:gloveAt.y,width:0,height:0};
await p.touchscreen.tap(backCell.x+backCell.width/2, backCell.y+Math.min(backCell.height/2,20));
await p.waitForTimeout(40);
const backCard=await p.evaluate(()=>{
  const pop=document.getElementById('pop');
  return {cmp:!!(pop&&pop.querySelector('.cmpBox')),move:pop&&pop.querySelector('[data-stmv]')&&pop.querySelector('[data-stmv]').textContent,foot:document.querySelector('[data-smove]').textContent};
});
check('the lockbox tab compares and offers Move to pack', backCard.cmp && backCard.move==='Move to pack' && backCard.foot==='Move to pack', backCard);
await p.evaluate(()=>document.querySelector('[data-stmv]').click());
const restored=await p.evaluate(()=>({bag:__g.G.bag.map(it=>it.name).sort(),box:(__g.ACC.stash||[]).map(it=>it&&it.name)}));
check('Move to pack puts it back', restored.bag.indexOf('Pack Gloves')>=0 && restored.box.indexOf('Pack Gloves')<0, restored);

await p.setViewportSize({width:1280,height:800});
await p.evaluate(()=>{
  __g.OPT.ui='mouse';__g.uiApply(true);
  __g.setMode('play');__g.openSheet('stash',{only:['stash']});
});
const desk=await p.evaluate(()=>{
  const tog=getComputedStyle(document.querySelector('.stashToggle')).display;
  const box=getComputedStyle(document.querySelector('[data-spanel="box"]')).display;
  const pack=getComputedStyle(document.querySelector('[data-spanel="pack"]')).display;
  const side=document.querySelector('.stashBody').dataset.side;
  return {tog,box,pack,side};
});
check('a desk shows both grids', desk.side==='both' && desk.tog==='none' && desk.box!=='none' && desk.pack!=='none', desk);
const before=await p.evaluate(()=>__g.G.bag.length);
await p.click('#stashPack [data-sb="0"]');
const clicked=await p.evaluate(()=>({bag:__g.G.bag.length,box:__g.ACC.stash.length,pop:document.getElementById('pop').hidden}));
check('a desk click moves the piece across', clicked.bag===before-1 && clicked.pop && clicked.box>=1, clicked);
await p.evaluate(()=>{
  const b=document.querySelector('#stashGrid [data-st]');
  b.dispatchEvent(new MouseEvent('click',{bubbles:true,shiftKey:true}));
});
await p.waitForTimeout(40);
const shift=await p.evaluate(()=>{
  const pop=document.getElementById('pop');
  return {open:pop&&!pop.hidden,cmp:!!(pop&&pop.querySelector('.cmpBox')),move:!!(pop&&pop.querySelector('[data-stmv]'))};
});
check('shift-click on the desk still compares', shift.open && shift.cmp && shift.move, shift);
await p.evaluate(()=>{document.getElementById('pop').querySelector('[data-popx]').click()});
const drag=await p.evaluate(()=>{
  const src=document.querySelector('#stashPack [data-sb="0"]');
  const pane=document.querySelector('[data-spanel="box"]');
  if(!src||!pane)return {err:'missing'};
  const name=__g.G.bag[+src.dataset.sb].name;
  const dt=new DataTransfer();
  src.dispatchEvent(new DragEvent('dragstart',{bubbles:true,dataTransfer:dt}));
  pane.dispatchEvent(new DragEvent('dragover',{bubbles:true,dataTransfer:dt}));
  pane.dispatchEvent(new DragEvent('drop',{bubbles:true,dataTransfer:dt}));
  return {name,bag:__g.G.bag.map(it=>it&&it.name),box:__g.ACC.stash.map(it=>it&&it.name)};
});
check('a drag onto the lockbox moves the piece', drag.box.indexOf(drag.name)>=0 && drag.bag.indexOf(drag.name)<0, drag);

check('no page errors', !errs.length, errs);
await b.close();
console.log(fail.length?'FAIL\n'+fail.join('\n'):'lockbox-tabs ok');
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
