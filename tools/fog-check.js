/* Step 3: Diablo-style fog and light radius. Visual only.
   node tools/fog-check.js     (FOG_HTML=file tests another build, FOG_SHOTS=dir writes screenshots + fog.json)
   For a set of zones at 390x844 (portrait, first) and 844x390 (landscape) it stands the hero on the
   start tile and reads the game canvas (no HUD): share of near-black pixels (luma < 16/255), mean
   brightness, brightness of the disc around the hero, and render() time incl. a 1px readback (forces the GPU/raster flush). Fails on the pre-step-3 build:
   the lighting veil crushed 23-76% of the screen to near-black. */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const html=fs.readFileSync(process.env.FOG_HTML||path.join(__dirname,'..','dist/unsubscribe.html'),'utf8');
const shots=process.env.FOG_SHOTS||'';
const fail=[];const check=(n,ok,d)=>{if(!ok)fail.push(n+(d?': '+d:''))};
const ZONES=[0,1,2,3,4,7,9,12]; // town, Moors, Galleria, Fields, Tribunal, Updraft, Data Lake, Vestibule
const MAX_BLACK=45;   // % of screen, plan 3 R2: overall near-black below 45%
const MIN_LIT=45;     // mean luma (0-255) of the disc around the hero
const MIN_MEAN=30;    // mean luma of the whole canvas
const MAX_PERF=1.35;  // render() may cost at most this much more than the baseline build (only used with FOG_BASE_MS)
async function open(b,vp){
  const c=await b.newContext({viewport:vp,hasTouch:true,isMobile:true});
  const p=await c.newPage();p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));
  await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
  await p.waitForTimeout(300);
  await p.evaluate(()=>{__g.skipDisc();__g.OPT.noWalk=1});
  await p.waitForTimeout(150);
  await p.evaluate(()=>{document.getElementById('title').hidden=true;__g.newGame('scrapper');__g.G.pre=2;__g.G.walkNew=0;__g.G.god=true;__g.G.lvl=90;__g.G.unlocked=34;__g.G.act2=__g.G.act3=__g.G.act4=__g.G.act5=true});
  for(let i=0;i<12;i++){await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}});await p.waitForTimeout(60)}
  return p;
}
const measure=()=>{
  const cv=document.getElementById('cv'),W=cv.width,H=cv.height,s=4,w=Math.ceil(W/s),h=Math.ceil(H/s);
  const o=document.createElement('canvas');o.width=w;o.height=h;const g=o.getContext('2d');g.drawImage(cv,0,0,w,h);
  const d=g.getImageData(0,0,w,h).data,r=cv.getBoundingClientRect();
  const px=w/2,py=h*.44-5*(w/(r.width)),R=1.7*66*(w/r.width)*(Math.min(r.width,r.height)/560>1.25?1.25:Math.max(.68,Math.min(r.width,r.height)/560)); // ~1.7 tiles around the hero
  let nb=0,sum=0,ls=0,ln=0;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4,l=.299*d[i]+.587*d[i+1]+.114*d[i+2];sum+=l;if(l<16)nb++;if((x-px)*(x-px)+(y-py)*(y-py)<R*R){ls+=l;ln++}}
  return{black:100*nb/(w*h),mean:sum/(w*h),lit:ls/Math.max(1,ln)};
};
(async()=>{
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined,args:['--no-sandbox','--disable-dev-shm-usage']});
const out={};
for(const [name,vp] of [['p',{width:390,height:844}],['l',{width:844,height:390}]]){
  const p=await open(b,vp);out[name]={};
  for(const z of ZONES){
    await p.evaluate(z=>{__g.enter(z)},z);
    for(let i=0;i<10;i++){await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}});await p.waitForTimeout(40)}
    await p.evaluate(()=>{const s=document.getElementById('scene');if(s)s.hidden=true;const d=document.getElementById('dlg');if(d)d.hidden=true;__g.setMode('play');__g.G.god=true;for(let i=0;i<30;i++)__g.update(1/60);__g.W.ents.length=0});
    await p.waitForTimeout(250);
    await p.evaluate(()=>{__g.render()});
    const m=await p.evaluate(measure);
    m.ms=await p.evaluate(()=>{const a=[];for(let i=0;i<60;i++){const cv=document.getElementById('cv'),c2=cv.getContext('2d');const t=performance.now();__g.render();c2.getImageData(0,0,1,1);a.push(performance.now()-t)}a.sort((x,y)=>x-y);return a[30]});
    out[name][z]=m;
    if(shots&&[1,2,9].includes(z)){await p.screenshot({path:path.join(shots,'fog-'+name+'-z'+String(z).padStart(2,'0')+'.png')})}
    check(name+' z'+z+' errors',!p.errs.length,p.errs.join('|'));
    check((name==='p'?'portrait':'landscape')+' z'+z+' near-black '+m.black.toFixed(1)+'% (max '+MAX_BLACK+')',m.black<=MAX_BLACK);
    check((name==='p'?'portrait':'landscape')+' z'+z+' hero disc brightness '+m.lit.toFixed(0)+' (min '+MIN_LIT+')',m.lit>=MIN_LIT);
    check((name==='p'?'portrait':'landscape')+' z'+z+' mean brightness '+m.mean.toFixed(0)+' (min '+MIN_MEAN+')',m.mean>=MIN_MEAN);
  }
}
await b.close();
const avg=(o,k)=>Object.values(o).reduce((a,v)=>a+v[k],0)/Object.values(o).length;
const sum={portraitBlack:avg(out.p,'black'),landscapeBlack:avg(out.l,'black'),portraitMs:avg(out.p,'ms'),landscapeMs:avg(out.l,'ms')};
console.log(JSON.stringify(sum));
for(const n of ['p','l'])console.log(n,Object.entries(out[n]).map(([z,m])=>'z'+z+' black '+m.black.toFixed(1)+'% mean '+m.mean.toFixed(0)+' lit '+m.lit.toFixed(0)+' '+m.ms.toFixed(1)+'ms').join(' | '));
if(shots)fs.writeFileSync(path.join(shots,'fog.json'),JSON.stringify({out,sum},null,1));
if(process.env.FOG_BASE_MS){const base=+process.env.FOG_BASE_MS,now=(sum.portraitMs+sum.landscapeMs)/2;check('render time '+now.toFixed(2)+'ms vs baseline '+base.toFixed(2)+'ms',now<=base*MAX_PERF)}
console.log(fail.length?'FAIL ('+fail.length+'):\n'+fail.slice(0,20).join('\n'):'PASS fog-check');
process.exit(fail.length?1:0)})();
