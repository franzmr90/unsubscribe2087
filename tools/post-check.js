/* The WebGL finishing pass (src/post.js), stage 1 of the engine plan.
   node tools/post-check.js
   Checks that the pass runs and changes the frame, that a ripple bends the picture, that it
   leaves the frame exactly as the canvas drew it when switched off, and that without WebGL it
   turns itself off instead of breaking the frame. */
const {chromium}=require('playwright');const path=require('path');
const URL='file://'+path.join(__dirname,'..','dist/Unsubscribe-2087-standalone.html');
const out=[];let bad=0;const ok=(n,c,d)=>{out.push((c?'  ok   ':'  FAIL ')+n+(d?'   '+d:''));if(!c)bad++};
async function clearUI(p){for(let i=0;i<50;i++){const st=await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden){document.getElementById('scSkip').click();return 'x'}
  const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x){x.click();return 'x'}return 'l'}return 'c'});if(st==='c')return;await p.waitForTimeout(st==='l'?300:120)}}
async function boot(b,noGL){const p=await b.newPage({viewport:{width:800,height:600}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
  if(noGL)await p.addInitScript(()=>{const g=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(t,o){return /webgl/.test(t)?null:g.call(this,t,o)}});
  await p.goto(URL);await p.waitForTimeout(700);await p.evaluate(()=>__g.skipDisc());await p.waitForTimeout(250);await p.click('[data-cls=hacker]');await p.evaluate(()=>{__g.G.pre=2});
  await clearUI(p);await p.waitForTimeout(1500);await clearUI(p);
  await p.evaluate(()=>{const G=__g.G;G.god=true;G.lvl=60;G.unlocked=34;for(let i=1;i<=24;i++)G.q['q'+i]=3;__g.enter(30)});await p.waitForTimeout(400);await clearUI(p);await p.waitForTimeout(2600);await clearUI(p);
  await p.evaluate(()=>{const W=__g.W,P=__g.P;for(let i=0;i<8;i++)W.projs.push({x:P.x+1+i*.35,y:P.y-1.2,vx:0,vy:0,life:60,foe:true,dmg:0,col:'#ff7a3c'})});return{p,errs}}
/* render the same frame each way and compare, in one go so nothing moves between them. Rain and
   embers are random, so two plain frames differ by a fraction of a per cent: the bar is 1% */
const frames=p=>p.evaluate(()=>{const g=__g,c=document.getElementById('cv'),x=c.getContext('2d'),get=()=>{g.render();return x.getImageData(0,0,c.width,c.height).data};
  g.OPT.post=false;const a=get();g.OPT.post=true;const b=get();g.OPT.post=false;const a2=get();
  const diff=(u,v)=>{let n=0;for(let i=0;i<u.length;i+=4)if(Math.abs(u[i]-v[i])+Math.abs(u[i+1]-v[i+1])+Math.abs(u[i+2]-v[i+2])>12)n++;return n/(u.length/4)};
  return{onOff:diff(a,b),offOff:diff(a,a2),pg:!!g.PG}});
(async()=>{const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  let {p,errs}=await boot(b,false);let o=await frames(p);
  ok('the pass runs where there is WebGL',o.pg,'');
  ok('and it changes the frame (bloom and grade)',o.onOff>.05,(o.onOff*100).toFixed(1)+'% of pixels');
  ok('switched off, the frame is the canvas as drawn',o.offOff<.01,(o.offOff*100).toFixed(2)+'%');
  const w=await p.evaluate(()=>{const g=__g,c=document.getElementById('cv'),x=c.getContext('2d');g.OPT.post=true;g.render();const a=x.getImageData(0,0,c.width,c.height).data;
    g.postWave(g.VW/2||400,g.VH/2||300,1.5);g.PG&&0;const t0=performance.now();while(performance.now()-t0<0);return new Promise(r=>setTimeout(()=>{g.render();const b=x.getImageData(0,0,c.width,c.height).data;let n=0;for(let i=0;i<a.length;i+=4)if(Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2])>12)n++;r(n/(a.length/4))},180))});
  ok('a heavy blow sends a ripple through the picture',w>.03,(w*100).toFixed(2)+'% of pixels moved');
  ok('no page errors with the pass on',!errs.length,errs.slice(0,2).join(' | '));await p.close();
  ({p,errs}=await boot(b,true));o=await frames(p);
  ok('without WebGL the pass stands down',!o.pg&&o.onOff<.01,(o.onOff*100).toFixed(2)+'% changed');
  ok('no page errors without WebGL',!errs.length,errs.slice(0,2).join(' | '));
  console.log(out.join('\n'));console.log(bad?bad+' FAIL':'all ok');await b.close();process.exit(bad?1:0)})();
