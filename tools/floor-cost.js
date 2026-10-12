/* What the floor raster costs while the camera is moving.

   The floor is cached, but the cache key carries the camera position, so it is
   rebuilt on every frame the player is walking -- which is most of them. Tiles
   built larger than they are drawn turn each of those blits into a downscale,
   so this is the one per-frame cost a resolution change can move.

   Measured under rAF, not in a tight loop: tools/frame-prof.js saturates the
   GPU queue and reports throughput, which is the wrong number for "does a frame
   fit". The camera is nudged every frame so the cache always misses, which is
   the worst case rather than the average one.

   node tools/floor-cost.js [zones]                                          */
const {chromium}=require('playwright');
const path=require('path');
const root=path.join(__dirname,'..');
const ZS=(process.argv[2]||'1,4,5').split(',').map(Number);
async function clearUI(p){for(let i=0;i<60;i++){const st=await p.evaluate(()=>{
 const s=document.getElementById('scene');if(s&&!s.hidden){const b=document.getElementById('scSkip');if(b)b.click();return 'x'}
 const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x){x.click();return 'x'}return 'l'}
 return 'c'});if(st==='c')return;await p.waitForTimeout(st==='l'?300:120)}}
(async()=>{
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:760,height:760}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.join(root,'dist/Unsubscribe-2087-standalone.html'));
await p.waitForTimeout(700);
await p.evaluate(()=>__g.skipDisc());await p.waitForTimeout(250);
await p.click('[data-cls=scrapper]');await p.evaluate(()=>{__g.G.pre=2});await clearUI(p);
await p.waitForTimeout(1700);await clearUI(p);
await p.evaluate(()=>{const G=__g.G;G.lvl=40;G.god=true;G.unlocked=34;__g.calc()});
console.log('zone  style   render ms: med    p95    (camera moving, floor cache missing every frame)');
for(const zi of ZS){
  await p.evaluate(z=>__g.enter(z),zi);await p.waitForTimeout(500);await clearUI(p);
  const r=await p.evaluate(()=>new Promise(res=>{
    const g=window.__g,P=g.P,ts=[];let n=0;
    const step=()=>{ /* nudge the camera so the raster cannot be reused */
      P.x+=0.013;P.y+=0.007;
      const a=performance.now();g.render();const d=performance.now()-a;
      if(n++>8)ts.push(d);
      if(n<90)requestAnimationFrame(step);
      else{ts.sort((x,y)=>x-y);
        res({med:ts[ts.length>>1],p95:ts[Math.floor(ts.length*.95)],
             style:g.W.z.style,n:g.W.ents.length})}};
    requestAnimationFrame(step)}));
  console.log(String(zi).padStart(4),r.style.padEnd(7),
    r.med.toFixed(2).padStart(8),r.p95.toFixed(2).padStart(7),'   '+r.n+' ents')}
if(errs.length)console.log('page errors:',errs.slice(0,2));
await b.close()})();
