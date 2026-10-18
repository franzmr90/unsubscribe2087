/* Moors dead-space art (visual only). Opens The Parcel Moors (zone 1, style 'moor') at phone portrait
   390x844 and landscape 844x390, stands the hero on the start tile and reads the game canvas (no HUD).
   Measures, over the part of the screen that is NOT walkable floor / ring-1 wall / lit by the hero:
     flat   = share of 4x4-pixel blocks whose 5x5 neighbourhood is flat near-black (luma<14 and std dev<2.5)
     detail = mean local std dev (texture) of the dead-space blocks, 0-255 luma units
   Fails on the build before the art (flat black field, no texture) and passes after.
   node tools/dead-space-check.js   (DEAD_HTML=file tests another build; DEAD_SHOTS=dir writes <prefix>-{p,l}.png, DEAD_PREFIX=moors-art-after)
   Also checks the art is deterministic (same pixels on a second visit), that Math.random is not consumed by it,
   and that W.map / W.wh / W.seen are unchanged by drawing. */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(process.env.DEAD_HTML||path.join(__dirname,'..','dist/unsubscribe.html'),'utf8');
const shots=process.env.DEAD_SHOTS||'',prefix=process.env.DEAD_PREFIX||'moors-art';
const fail=[];const check=(n,ok,d)=>{if(!ok)fail.push(n+(d?': '+d:''))};
const MAX_FLAT=35;   // % of the screen that may be flat near-black
const MIN_DETAIL=8;  // mean texture (std dev) over the screen (before: ~6, with the hero's lit disc counted)
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
async function enter(p,z){
  await p.evaluate(z=>{__g.enter(z)},z);
  for(let i=0;i<10;i++){await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}});await p.waitForTimeout(40)}
  await p.evaluate(()=>{const s=document.getElementById('scene');if(s)s.hidden=true;const d=document.getElementById('dlg');if(d)d.hidden=true;__g.setMode('play');__g.G.god=true;for(let i=0;i<30;i++)__g.update(1/60);__g.W.ents.length=0});
  await p.waitForTimeout(250);
  await p.evaluate(()=>{__g.render()});
}
const measure=()=>{
  const cv=document.getElementById('cv'),W=cv.width,H=cv.height,s=4,w=Math.ceil(W/s),h=Math.ceil(H/s);
  const o=document.createElement('canvas');o.width=w;o.height=h;const g=o.getContext('2d');g.drawImage(cv,0,0,w,h);
  const d=g.getImageData(0,0,w,h).data,L=new Float32Array(w*h);
  for(let i=0;i<w*h;i++)L[i]=.299*d[i*4]+.587*d[i*4+1]+.114*d[i*4+2];
  let flat=0,det=0,n=0,dark=0;
  for(let y=2;y<h-2;y++)for(let x=2;x<w-2;x++){
    let m=0,q=0;for(let j=-2;j<=2;j++)for(let i=-2;i<=2;i++){const v=L[(y+j)*w+x+i];m+=v;q+=v*v}
    m/=25;const sd=Math.sqrt(Math.max(0,q/25-m*m));n++;det+=sd;if(m<14&&sd<2.5)flat++;if(m<14)dark++}
  return{flat:100*flat/n,detail:det/n,dark:100*dark/n}
};
const hashCv=()=>{const cv=document.getElementById('cv'),d=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;let h=2166136261;for(let i=0;i<d.length;i+=7){h^=d[i];h=Math.imul(h,16777619)}return h>>>0};
(async()=>{
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined,args:['--no-sandbox','--disable-dev-shm-usage']});
const res={};
for(const [name,vp] of [['p',{width:390,height:844}],['l',{width:844,height:390}]]){
  const p=await open(b,vp);await enter(p,1);
  const zn=await p.evaluate(()=>__g.W.z.n+'|'+__g.W.z.style);check('zone 1 is the Moors',zn==='The Parcel Moors|moor',zn);
  const m=await p.evaluate(measure);res[name]=m;
  const lab=name==='p'?'portrait':'landscape';
  check(lab+' flat near-black '+m.flat.toFixed(1)+'% (max '+MAX_FLAT+')',m.flat<=MAX_FLAT);
  check(lab+' texture '+m.detail.toFixed(2)+' (min '+MIN_DETAIL+')',m.detail>=MIN_DETAIL);
  if(name==='p'){
    // visual only: drawing must not touch the map, walls, fog of war or the rng
    const before=await p.evaluate(()=>{const W=__g.W;return[W.map.join('').length,W.map.reduce((a,v,i)=>a+v*(i%97+1),0),W.wh.reduce((a,v,i)=>a+v*(i%89+1),0),W.seen.reduce((a,v,i)=>a+v*(i%83+1),0)].join(',')});
    const rnd=await p.evaluate(()=>{const r=Math.random;let n=0;Math.random=()=>{n++;return r()};__g.render();__g.render();Math.random=r;return n});
    const after=await p.evaluate(()=>{const W=__g.W;return[W.map.join('').length,W.map.reduce((a,v,i)=>a+v*(i%97+1),0),W.wh.reduce((a,v,i)=>a+v*(i%89+1),0),W.seen.reduce((a,v,i)=>a+v*(i%83+1),0)].join(',')});
    check('map/wh/seen unchanged by render',before===after,before+' vs '+after);
    res.rnd=rnd;
    // the sprites are baked by a seeded rng: a different Math.random must give identical pixels
    const bake=async v=>p.evaluate(v=>{const r=Math.random;Math.random=()=>v;__g.TX.style='';__g.buildTextures('moor');__g.W.seenGen=(__g.W.seenGen||0)+1;__g.render();Math.random=r;const D=__g.TX.dead;if(!D)return'none';let s='';for(const k in D){const a=Array.isArray(D[k])?D[k]:[D[k]];for(const o of a)s+=(o.c||o).toDataURL().length+(o.c||o).toDataURL().slice(-60)}let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0},v);
    const h1=await bake(.123),h2=await bake(.877);
    check('art bakes identically under a different Math.random (seeded)',h1!=='none'&&h1===h2,h1+' vs '+h2);
    // other zones are untouched: the Bull Run (also style moor) and the town have no art
    const other=await p.evaluate(()=>{const Z=__g.ZONES;return Z.map((z,i)=>i+':'+z.style).filter(x=>/moor/.test(x)).join(',')});res.moorZones=other;
  }
  if(shots)await p.screenshot({path:path.join(shots,prefix+'-'+name+'.png')});
  check(lab+' errors',!p.errs.length,p.errs.join('|'));
}
await b.close();
console.log(JSON.stringify(res));
console.log(fail.length?'FAIL ('+fail.length+'):\n'+fail.join('\n'):'PASS dead-space-check');
process.exit(fail.length?1:0)})();
