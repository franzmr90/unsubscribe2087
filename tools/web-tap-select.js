/* Passive web safety: a tap SELECTS a node, only the Place point button spends.
   node tools/web-tap-select.js
   Fails on the old rule (a tap spent a point at once). Phone sizes use real touch taps; the
   desktop case uses the mouse (click selects, double-click places). */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const html=fs.readFileSync(path.join(__dirname,'..','dist/unsubscribe.html'),'utf8');
const fail=[];const check=(n,ok,d)=>{if(!ok)fail.push(n+(d?': '+d:''))};

async function open(b,vp,touch){
  const ctx=await b.newContext({viewport:vp,hasTouch:touch,isMobile:touch});
  const p=await ctx.newPage();p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));
  await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
  await p.waitForTimeout(300);
  await p.evaluate(()=>{__g.skipDisc();__g.OPT.noWalk=1});
  await p.waitForTimeout(150);
  await p.evaluate(()=>{document.getElementById('title').hidden=true;__g.newGame('scrapper');__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1});
  for(let i=0;i<12;i++){await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}});await p.waitForTimeout(60)}
  await p.evaluate(()=>{const s=document.getElementById('scene');if(s)s.hidden=true;const d=document.getElementById('dlg');if(d)d.hidden=true;__g.setMode('play')});
  await p.evaluate(()=>{const G=__g.G;G.lvl=15;G.web={};G.sats=20;__g.calc();__g.openSheet('web')});
  await p.waitForTimeout(1200);
  await p.evaluate(()=>{const b=document.querySelector('#uiPort button');if(b)b.click()});await p.waitForTimeout(100);
  return p;
}
const spent=p=>p.evaluate(()=>Object.keys(__g.G.web).length);
const centre=(p,id)=>p.evaluate(id=>{const c=document.querySelector('#webStage [data-web="'+id+'"]').getBoundingClientRect();return{x:c.left+c.width/2,y:c.top+c.height/2}},id);
const card=p=>p.evaluate(()=>{const t=document.getElementById('webTip'),b=t&&t.querySelector('.webPlace');return{sel:t&&t.dataset.sel,txt:t?t.textContent:'',has:!!b,dis:b?b.disabled:null,h:b?b.getBoundingClientRect().height:0}});

(async()=>{try{
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
for(const [name,vp] of [['portrait 390x844',{width:390,height:844}],['landscape 844x390',{width:844,height:390}]]){
  const p=await open(b,vp,true);
  // 1. at the default (fit) zoom the nodes are only ~5px apart: any tap must still spend nothing
  let c=await centre(p,'0_1');
  await p.touchscreen.tap(c.x,c.y);await p.waitForTimeout(120);
  check(name+': tap at fit zoom spends nothing',(await spent(p))===0,'points placed: '+await spent(p));
  // bigger hit area: 12px outside an isolated keystone still selects it (the old circle was ~4px wide here)
  const key=await centre(p,'2_10');
  await p.touchscreen.tap(key.x+12,key.y);await p.waitForTimeout(120);
  check(name+': 12px outside a node still selects it',(await card(p)).sel==='2_10',(await card(p)).sel);
  check(name+': that tap spent nothing',(await spent(p))===0);
  // zoom in so nodes are a thumb apart, then test precisely
  for(let i=0;i<9;i++)await p.click('[data-webzoom="in"]');
  await p.waitForTimeout(100);
  c=await centre(p,'0_1');
  await p.touchscreen.tap(c.x,c.y);await p.waitForTimeout(120);
  check(name+': tap on a lit node spends nothing',(await spent(p))===0,'points placed: '+await spent(p));
  let k=await card(p);
  check(name+': card is showing 0_1',k.sel==='0_1',JSON.stringify(k.sel));
  check(name+': card has an enabled Place button',k.has&&k.dis===false);
  check(name+': Place button is at least 44px tall',k.h>=44,String(k.h));
  check(name+': card gives a cost',/Cost: 1 point/.test(k.txt)||/Placed/.test(k.txt),k.txt.slice(0,80));
  // 3. a tap between two lit nodes (30% of the way from 0_1 to 7_1) spends nothing and picks the nearer
  const a=await centre(p,'0_1'),z=await centre(p,'7_1');
  await p.touchscreen.tap(a.x+(z.x-a.x)*.3,a.y+(z.y-a.y)*.3);await p.waitForTimeout(120);
  check(name+': tap between two nodes spends nothing',(await spent(p))===0);
  k=await card(p);check(name+': tap between two nodes picks the nearer one',k.sel==='0_1',k.sel);
  // 4. a near miss (14px off the node) still selects it, because the hit area is bigger
  await p.touchscreen.tap(a.x+14,a.y);await p.waitForTimeout(120);
  check(name+': near miss spends nothing',(await spent(p))===0);
  // 5. Place spends exactly one point, on the selected node
  await p.touchscreen.tap(z.x,z.y);await p.waitForTimeout(120);
  k=await card(p);check(name+': selecting 7_1 moves the card',k.sel==='7_1',k.sel);
  const pb=await p.evaluate(()=>{const e=document.querySelector('.webPlace');if(!e)return null;const r=e.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}});
  check(name+': there is a Place point button',!!pb);
  if(pb)await p.touchscreen.tap(pb.x,pb.y);await p.waitForTimeout(150);
  const w=await p.evaluate(()=>Object.keys(__g.G.web));
  check(name+': Place spends exactly the selected node',w.length===1&&w[0]==='7_1',JSON.stringify(w));
  // 6. an unconnected node: Place is disabled and spends nothing
  c=await centre(p,'2_2');await p.evaluate(()=>document.querySelector('#webStage').scrollIntoView?0:0);
  await p.touchscreen.tap(c.x,c.y);await p.waitForTimeout(120);
  k=await card(p);check(name+': unconnected node: Place is disabled',k.sel==='2_2'&&k.dis===true,JSON.stringify(k));
  await p.evaluate(()=>{const e=document.querySelector('.webPlace');if(e)e.click()});await p.waitForTimeout(80);
  check(name+': unconnected node was not placed',(await spent(p))===1);
  check(name+': no page errors',p.errs.length===0,p.errs[0]);
  await p.context().close();
}
// desktop mouse: click selects, double-click places
{
  const p=await open(b,{width:1280,height:800},false);
  const c=await centre(p,'2_1');
  await p.mouse.click(c.x,c.y);await p.waitForTimeout(120);
  check('desktop: one click spends nothing',(await spent(p))===0);
  check('desktop: one click selects',(await card(p)).sel==='2_1');
  const c2=await centre(p,'2_1');
  await p.mouse.dblclick(c2.x,c2.y);await p.waitForTimeout(150);
  const w=await p.evaluate(()=>Object.keys(__g.G.web));
  check('desktop: double-click places the selected node',w.length===1&&w[0]==='2_1',JSON.stringify(w));
  await p.context().close();
}
await b.close();
}catch(e){fail.push('crashed: '+String(e.message).split('\n')[0])}
if(fail.length){console.log('FAIL\n - '+fail.join('\n - '));process.exit(1)}
console.log('web-tap-select ok');
})();
