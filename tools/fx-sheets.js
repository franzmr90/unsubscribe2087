/* Baked effect flipbooks. node tools/fx-sheets.js
   Every shape that has a painter must bake, blit, and leave the frame clean.
   Also reports what the bake costs, since it now happens at boot. */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const outDir=process.env.FX_OUT||path.join(root,'.fx-shots');

async function clearUI(p){
  for(let i=0;i<30;i++){
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
fs.mkdirSync(outDir,{recursive:true});
const html=fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8');
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
await p.waitForTimeout(400);
await p.evaluate(()=>__g.skipDisc());
await p.waitForTimeout(200);
await p.click('[data-cls=scrapper]');
await p.waitForTimeout(300);
await p.evaluate(()=>{__g.G.pre=2});
await clearUI(p);
await p.evaluate(()=>{const G=__g.G;G.lvl=60;G.act2=G.act3=G.act4=G.act5=true;G.sats=40;G.god=true;
  for(let i=1;i<=25;i++)G.q['q'+i]=3;G.in1=1;__g.ACC.maxi=1;__g.calc()});
await p.evaluate(()=>__g.enter(1));
await clearUI(p);
await p.evaluate(()=>__g.setMode('play'));
await p.waitForTimeout(300);

const fail=[];

// every painter bakes, and reports its strip size
const bake=await p.evaluate(()=>{
  const out={};
  for(const k of Object.keys(__g.FXART)){
    const t0=performance.now();
    const sh=__g.fxSheet(k,'#59e0e6');
    const ms=performance.now()-t0;
    out[k]=sh?{w:sh.c.width,h:sh.c.height,loop:sh.loop,ms:+ms.toFixed(2)}:null;
  }
  return out;
});
console.log('--- bake ---');
let total=0;
for(const k in bake){
  const v=bake[k];
  if(!v){fail.push('no sheet baked for '+k);continue}
  total+=v.ms;
  console.log(`  ${k.padEnd(7)} ${String(v.w).padStart(5)}x${v.h}  ${v.loop?'loop':'once'}  ${v.ms}ms`);
}
console.log(`  one colour of every kind: ${total.toFixed(1)}ms`);

// a looping sheet must be seamless: first and last frame differ, but the
// wrap must not jump more than a normal step does
const seam=await p.evaluate(()=>{
  const sh=__g.fxSheet('patch','#f7931a'),n=sh.n,W=sh.w,H=sh.h;
  const c=document.createElement('canvas');c.width=W;c.height=H;
  const g=c.getContext('2d');
  const grab=i=>{g.clearRect(0,0,W,H);g.drawImage(sh.c,i*W,0,W,H,0,0,W,H);return g.getImageData(0,0,W,H).data};
  const diff=(a,b)=>{let d=0;for(let i=3;i<a.length;i+=4)d+=Math.abs(a[i]-b[i]);return d/(a.length/4)};
  const f=[];for(let i=0;i<n;i++)f.push(grab(i));
  let step=0;for(let i=1;i<n;i++)step+=diff(f[i-1],f[i]);
  return {step:step/(n-1), wrap:diff(f[n-1],f[0])};
});
console.log('--- seam ---');
console.log(`  mean frame step ${seam.step.toFixed(2)}   wrap step ${seam.wrap.toFixed(2)}`);
if(seam.wrap>seam.step*1.5)fail.push(`looping patch is not seamless: wrap ${seam.wrap.toFixed(2)} vs mean step ${seam.step.toFixed(2)}`);

// cast one skill of each shape and screenshot it
const shots=[['scrapper',0,'arc'],['scrapper',1,'trail'],['scrapper',4,'trail'],
             ['scrapper',12,'patch'],['hacker',7,'orbit'],['witness',0,'mark']];
console.log('--- cast ---');
for(const [cls,i,want] of shots){
  const r=await p.evaluate(([cls,i])=>{
    const G=__g.G,P=__g.P,W=__g.W;
    G.cls=cls;__g.calc();G.sk[i]=5;G.slots[0]=i;G.en=99999;
    P.cd[i]=0;P.castWait=0;P.silence=0;P.dash=null;P.dir={x:1,y:0};
    W.fx.length=0;__g.cast(0);
    return {kinds:W.fx.map(f=>f.k),n:W.fx.length};
  },[cls,i]);
  const got=r.kinds.includes(want);
  console.log(`  ${cls} ${i} wants ${want.padEnd(6)} -> ${r.kinds.join(',')||'(none)'} ${got?'':'  MISS'}`);
  if(!got)fail.push(`${cls} ${i} produced no ${want}`);
  await p.waitForTimeout(90);
  await p.screenshot({path:path.join(outDir,`${cls}-${i}-${want}.png`)});
}

// frame cost with a screenful of baked shapes
const cost=await p.evaluate(()=>{
  const W=__g.W,P=__g.P;
  W.fx.length=0;
  for(let i=0;i<40;i++)W.fx.push({k:['patch','ring','trail','orbit','mark','bolt','arc'][i%7],
    x:P.x+(i%7)-3,y:P.y+((i/7)|0)-2,x2:P.x+(i%5),y2:P.y+(i%3),t:.1,life:1,
    col:'#59e0e6',r:2,w:1,n:3,dx:1,dy:0});
  const t=[];
  for(let i=0;i<40;i++){const a=performance.now();__g.update(.016);t.push(performance.now()-a)}
  t.sort((a,b)=>a-b);
  return {median:+t[20].toFixed(2),p95:+t[38].toFixed(2),fx:W.fx.length};
});
console.log('--- frame ---');
console.log(`  ${cost.fx} shapes on screen: median ${cost.median}ms, p95 ${cost.p95}ms`);
await p.screenshot({path:path.join(outDir,'crowded.png')});

if(errs.length)fail.push('page errors: '+errs.slice(0,4).join(' | '));
console.log('');
if(fail.length){console.log('FAIL');for(const f of fail)console.log('  - '+f);process.exitCode=1}
else console.log('PASS  shots in '+outDir);
await b.close();
})();
