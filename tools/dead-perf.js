/* Dead-space cost per zone: what entering a zone costs and what a moving camera costs.
   node tools/dead-perf.js        (DEAD_HTML=file measures another build, e.g. the build before the art, for the before/after table)
   Phone portrait 390x844 at DPR 3 (the worst realistic case, pages are baked at scale 1.25 and capped at 9).
   enter = ms for __g.enter(z) (textures, sprite bake and the pages around the spawn), first = first render after it,
   move = mean ms of a render that rebuilds the floor raster (the camera moved one step), max = worst of those,
   MB = canvas memory held by the dead-space pages + sprites. No thresholds on the numbers: it prints a table and fails only
   on page errors or an enter over ENTER_MAX ms / a single rebuild over MAX_REBUILD ms (a page bake while walking; headless noise is ~100-140 ms before the art too). */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(process.env.DEAD_HTML||path.join(__dirname,'..','dist/unsubscribe.html'),'utf8');
const ZONES=(process.env.ZONES||'1,7,24,28,31,9,4,19,2,5,12,13,14,11,15,23,26,30,32,0').split(',').map(Number);
const ENTER_MAX=400,MAX_REBUILD=250;
(async()=>{
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined,args:['--no-sandbox','--disable-dev-shm-usage']});
const c=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,hasTouch:true,isMobile:true});
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');await p.waitForTimeout(300);
await p.evaluate(()=>{__g.skipDisc();__g.OPT.noWalk=1});await p.waitForTimeout(150);
await p.evaluate(()=>{document.getElementById('title').hidden=true;__g.newGame('scrapper');__g.G.pre=2;__g.G.walkNew=0;__g.G.god=true;__g.G.lvl=90;__g.G.unlocked=34;__g.G.act2=__g.G.act3=__g.G.act4=__g.G.act5=true});
const skip=()=>p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}});
for(let i=0;i<12;i++){await skip();await p.waitForTimeout(50)}
const rows=[];
for(const z of ZONES){
  const r=await p.evaluate(z=>{const g=__g,t0=performance.now();g.enter(z);const e=performance.now()-t0;return e},z);
  for(let i=0;i<10;i++){await skip();await p.waitForTimeout(40)}
  const m=await p.evaluate(()=>{const s=document.getElementById('scene');if(s)s.hidden=true;const d=document.getElementById('dlg');if(d)d.hidden=true;__g.setMode('play');__g.G.god=true;for(let i=0;i<30;i++)__g.update(1/60);__g.W.ents.length=0;
    const g=__g,t0=performance.now();g.render();const first=performance.now()-t0;let sum=0,mx=0;const P=g.P,x0=P.x,y0=P.y;
    for(let i=0;i<40;i++){P.x=x0+Math.sin(i/5)*3;P.y=y0+Math.cos(i/4)*3;g.W.seenGen=(g.W.seenGen||0)+1;const a=performance.now();g.render();const dt=performance.now()-a;sum+=dt;mx=Math.max(mx,dt)}
    P.x=x0;P.y=y0;const C=g.DEADC;let px=0;if(C)for(const e of C.m.values())px+=e.c.width*e.c.height;const D=g.TX.dead;if(D)for(const k in D)for(const o of D[k]){const cc=o.c||o;px+=cc.width*cc.height}
    return{n:g.W.z.n,st:g.W.z.style,has:!!g.DEAD[g.W.z.style],first,move:sum/40,max:mx,pages:C?C.m.size:0,mb:px*4/1048576}});
  rows.push({z,enter:r,...m})}
console.log('zone style      art  enter ms  first ms  move ms  max ms  pages    MB');
for(const r of rows)console.log(String(r.z).padStart(3)+' '+r.st.padEnd(9)+(r.has?' yes ':' no  ')+[r.enter,r.first,r.move,r.max].map(v=>v.toFixed(1).padStart(9)).join('')+String(r.pages).padStart(7)+r.mb.toFixed(1).padStart(8));
const bad=[];if(errs.length)bad.push('page errors: '+errs.join('|'));
for(const r of rows){if(r.enter>ENTER_MAX)bad.push('zone '+r.z+' enter '+r.enter.toFixed(0)+'ms > '+ENTER_MAX);if(r.max>MAX_REBUILD)bad.push('zone '+r.z+' worst rebuild '+r.max.toFixed(0)+'ms')}
const art=rows.filter(r=>r.has);console.log('art zones: mean enter '+(art.reduce((a,r)=>a+r.enter,0)/Math.max(1,art.length)).toFixed(1)+' ms, mean move '+(art.reduce((a,r)=>a+r.move,0)/Math.max(1,art.length)).toFixed(2)+' ms, max MB '+Math.max(0,...art.map(r=>r.mb)).toFixed(1));
await b.close();console.log(bad.length?'FAIL\n'+bad.join('\n'):'PASS dead-perf');process.exit(bad.length?1:0)})();
