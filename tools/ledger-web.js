/* Ledger web: fit on open; a click SELECTS a node and the Place point button spends it.
   node tools/ledger-web.js */
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

function measure(){
  const stage=document.getElementById('webStage');
  const body=document.querySelector('.sheetBody');
  const help=document.getElementById('webHelp');
  const bar=document.querySelector('.webBar .pts');
  const sheet=document.getElementById('sheet');
  const svg=stage&&stage.querySelector('svg');
  const sr=stage.getBoundingClientRect();
  const br=bar.getBoundingClientRect();
  const hr=help.getBoundingClientRect();
  const clipped=[...svg.querySelectorAll('text')].filter(t=>{
    const r=t.getBoundingClientRect();
    return r.width>0&&(r.left<sr.left-1||r.right>sr.right+1||r.top<sr.top-1||r.bottom>sr.bottom+1);
  }).map(t=>t.textContent);
  const vb=(svg.getAttribute('viewBox')||'').split(/[\s,]+/).map(Number);
  return {
    overflow:getComputedStyle(body).overflowY,
    stageH:Math.round(sr.height),
    barAbove:br.bottom<=sr.top+2&&br.top>=0,
    helpBelow:!help.open&&hr.top>=sr.bottom-2,
    pts:bar.textContent,
    clipped,
    vb,
    sheetScroll:sheet.scrollTop,
    bodyScroll:body.scrollTop,
    pageScroll:document.scrollingElement.scrollTop
  };
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
await p.evaluate(()=>{__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1});
await clearUI(p);
await p.evaluate(()=>__g.enter(1));
await clearUI(p);

const fail=[];
for(const [w,h] of [[1280,800],[1366,768],[1920,1080]]){
  await p.setViewportSize({width:w,height:h});
  await p.evaluate(()=>{
    __g.closeSheet();
    const G=__g.G;
    G.lvl=15;G.sats=20;G.web={'0_1':1,'0_2':1,'1_1':1};
    __g.calc();
    __g.setMode('play');
    __g.openSheet('web');
  });
  await p.waitForTimeout(120);
  const m=await p.evaluate(measure);
  if(m.overflow!=='hidden')fail.push(w+'x'+h+' sheet scrolls ('+m.overflow+')');
  if(m.stageH<200)fail.push(w+'x'+h+' stage is '+m.stageH+'px');
  if(!m.barAbove)fail.push(w+'x'+h+' points are not above the web');
  if(!m.helpBelow)fail.push(w+'x'+h+' help is not a closed footer');
  if(m.clipped.length)fail.push(w+'x'+h+' clipped '+m.clipped.join(','));
  if(!(m.vb[2]>=1160||m.vb[3]>=1160))fail.push(w+'x'+h+' viewBox '+m.vb.join(' '));
  if(m.sheetScroll||m.bodyScroll||m.pageScroll)fail.push(w+'x'+h+' scrolled');
  if(!/11 points/.test(m.pts))fail.push(w+'x'+h+' points read '+m.pts);
}

await p.setViewportSize({width:1280,height:800});
await p.evaluate(()=>{__g.closeSheet();__g.G.web={'0_1':1,'0_2':1,'1_1':1};__g.G.sats=20;__g.G.lvl=15;__g.calc();__g.setMode('play');__g.openSheet('web')});
await p.waitForTimeout(80);
const before=await p.evaluate(()=>document.querySelector('#webStage svg').getAttribute('viewBox'));
await p.evaluate(()=>{
  const stage=document.getElementById('webStage');
  const r=stage.getBoundingClientRect();
  stage.dispatchEvent(new WheelEvent('wheel',{deltaY:-120,clientX:r.left+r.width/2,clientY:r.top+r.height/2,bubbles:true,cancelable:true}));
});
const zoomed=await p.evaluate(()=>document.querySelector('#webStage svg').getAttribute('viewBox'));
if(zoomed===before)fail.push('wheel did not zoom');
const scroll=await p.evaluate(()=>document.querySelector('.sheetBody').scrollTop+document.scrollingElement.scrollTop);
if(scroll)fail.push('wheel scrolled the page');
await p.click('[data-webfit="1"]');
await p.waitForTimeout(40);
const fitted=await p.evaluate(()=>document.querySelector('#webStage svg').getAttribute('viewBox'));
if(fitted===zoomed)fail.push('fit button did not restore the view');

const pts0=await p.evaluate(()=>__g.webPts());
await p.click('[data-web="2_1"]');
await p.waitForTimeout(40);
const sel1=await p.evaluate(()=>({on:!!__g.G.web['2_1'],pts:__g.webPts()}));
if(sel1.on||sel1.pts!==pts0)fail.push('a click spent a point instead of selecting '+JSON.stringify(sel1));
await p.click('[data-weball="1"]');
await p.waitForTimeout(40);
const placed=await p.evaluate(()=>({on:!!__g.G.web['2_1'],pts:__g.webPts(),bar:document.querySelector('.webBar .pts').textContent}));
if(!placed.on||placed.pts!==pts0-1)fail.push('Place point did not place 2_1 '+JSON.stringify(placed));
if(!/10 points/.test(placed.bar))fail.push('points bar after place '+placed.bar);

await p.click('[data-web="2_1"]',{modifiers:['Shift']});
await p.waitForTimeout(40);
const kept=await p.evaluate(()=>!!__g.G.web['2_1']);
if(!kept)fail.push('shift-click removed a node');

await p.click('[data-web="0_5"]');
await p.waitForTimeout(40);
const far=await p.evaluate(()=>!!__g.G.web['0_5']);
if(far)fail.push('unconnected 0_5 was placed');

await p.click('[data-webadd="0"]');
await p.waitForTimeout(40);
if(await p.evaluate(()=>!!__g.G.web['0_3']))fail.push('+ spent a point instead of selecting 0_3');
await p.click('[data-weball="1"]');
await p.waitForTimeout(40);
const nxt=await p.evaluate(()=>({on:!!__g.G.web['0_3'],pts:__g.webPts()}));
if(!nxt.on||nxt.pts!==pts0-2)fail.push('+ then Place did not place 0_3 '+JSON.stringify(nxt));

await p.keyboard.press('Equal');
await p.waitForTimeout(30);
const keyed=await p.evaluate(()=>document.querySelector('#webStage svg').getAttribute('viewBox'));
if(keyed===fitted)fail.push('keyboard zoom did nothing');
await p.keyboard.press('KeyF');

await p.click('[data-webreset="1"]');
await p.waitForTimeout(40);
const reset=await p.evaluate(()=>({sats:__g.G.sats,n:Object.keys(__g.G.web).length,pts:document.querySelector('.webBar .pts').textContent}));
if(reset.sats!==15||reset.n!==0)fail.push('refund '+JSON.stringify(reset));
if(!/14 points/.test(reset.pts))fail.push('points after refund '+reset.pts);

if(errs.length)fail.push(errs[0]);
if(fail.length){console.log('FAIL\n'+fail.join('\n'));process.exit(1)}
console.log('ledger-web ok');
await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
