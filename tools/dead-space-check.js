/* Dead-space art (visual only): Moors (scene mode), the dungeon styles (mass mode, batch 4: DUNGEONS below) and the dark outdoor
   zones farm 3 / garden 8 / still 16 / mempool 29 (scene mode, batch 2: OUTDOOR below).
   Moors: Opens The Parcel Moors (zone 1, style 'moor') at phone portrait
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
// Dungeon (mode:'mass') zones by style group; ids are the ZONES indexes. The Room (32) stays black on purpose.
const DUNGEONS={industrial:[7,24,28,31,9,4,19],interior:[2,5,12,13,14],pale:[11,15,23,26,30]};
const OUTDOOR={3:'farm',8:'garden',16:'still',29:'mempool'};   // batch 2; zone 6 (Simulator) shares style 'farm' but is gated out by id
const ALLD=[].concat(...Object.values(DUNGEONS)),CLOUD=[7,9,11,24],PORTRAIT_ONLY=1;
const MAX_FLAT=35;
const MIN_DETAIL_CLOUD=6;   // Act II zones keep a smooth Cloud sky at the map edge by design
const MIN_DETAIL_PALE=5,MIN_LUM_PALE=70,MAX_DARK_PALE=5;   // % of the screen that may be flat near-black
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
  let flat=0,det=0,n=0,dark=0,lum=0;
  for(let y=2;y<h-2;y++)for(let x=2;x<w-2;x++){
    let m=0,q=0;for(let j=-2;j<=2;j++)for(let i=-2;i<=2;i++){const v=L[(y+j)*w+x+i];m+=v;q+=v*v}
    m/=25;const sd=Math.sqrt(Math.max(0,q/25-m*m));n++;det+=sd;lum+=m;if(m<14&&sd<2.5)flat++;if(m<14)dark++}
  return{flat:100*flat/n,detail:det/n,dark:100*dark/n,lum:lum/n}
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
    // table gate: only styles with a DEAD entry get art, by style and not by zone id (Moors 1 and Bull Run 20 are both 'moor')
    const gate=await p.evaluate(()=>{const Z=__g.ZONES;return Z.map((z,i)=>{const D=__g.DEAD[z.style];return D&&(!D.only||D.only.includes(i))?i:-1}).filter(i=>i>=0).join(',')});
    check('DEAD gate covers the moor, dungeon and outdoor zones, never the Room, the Simulator or the towns',gate===[...new Set(other.split(',').map(x=>+x.split(':')[0]).concat(ALLD,Object.keys(OUTDOOR).map(Number)))].sort((a,b)=>a-b).join(','),gate);
    // cache: module level and capped, never on W, never saved
    const cache=await p.evaluate(()=>{const g=__g,W=g.W;const out={};out.onW=('_dc' in W)||('_dd' in W);
      // walk far across the zone so many pages are touched
      const P=g.P;for(let i=0;i<500;i++){P.x=Math.min(W.N-2,Math.max(1,W.start.x+Math.sin(i/9)*W.N*.45));P.y=Math.min(W.N-2,Math.max(1,W.start.y+Math.cos(i/7)*W.N*.45));W.seenGen=(W.seenGen||0)+1;g.render()}
      out.pages=g.DEADC.m.size;out.canv=0;
      out.saved=JSON.stringify(g.encW(W)).length;const j=JSON.stringify(g.encW(W));out.leak=/"_dc"|"_dd"|"dead"|DEADC/.test(j);
      out.saveKeys=Object.keys(g.encW(W)).join(',');return out});
    res.cache=cache;check('no W._dc/W._dd on the world',!cache.onW);
    check('page cache capped at 9 after a long walk (got '+cache.pages+')',cache.pages<=9);
    check('encW does not serialize the dead-space cache',!cache.leak,cache.saveKeys);
    // leaving the world drops its pages: the cache holds one world at a time, and visited worlds (ZS) hold no canvases
    const keep=await p.evaluate(()=>{const g=__g;const w1=g.W;g.enter(2);g.render();const c2=g.DEADC;const held=Object.keys(g.ZS).filter(k=>g.ZS[k]&&('_dc' in g.ZS[k]||'_dd' in g.ZS[k]));return{sameWorld:c2&&c2.w===w1,held:held.join(',')}});
    check('visited worlds hold no dead-space canvases',keep.held==='',keep.held);
  }
  if(name==='p'){ // Bull Run (zone 20, style moor) uses the same table entry
    await enter(p,20);const bz=await p.evaluate(()=>__g.W.z.n+'|'+__g.W.z.style);check('zone 20 is the Bull Run (moor)',bz==='The Bull Run|moor',bz);
    const bm=await p.evaluate(measure);res.bull=bm;check('bull run flat near-black '+bm.flat.toFixed(1)+'% (max '+MAX_FLAT+')',bm.flat<=MAX_FLAT);
    check('bull run texture '+bm.detail.toFixed(2)+' (min '+MIN_DETAIL+')',bm.detail>=MIN_DETAIL);
    if(shots)await p.screenshot({path:path.join(shots,prefix+'-bull-'+name+'.png')});
    await enter(p,1)}
  if(shots)await p.screenshot({path:path.join(shots,prefix+'-'+name+'.png')});
  check(lab+' errors',!p.errs.length,p.errs.join('|'));
}

// ===== dungeons: solid mass behind the walls (mode:'mass') =====
const gl={};
for(const [name,vp] of [['p',{width:390,height:844}],['l',{width:844,height:390}]]){
  const p=await open(b,vp),lab=name==='p'?'portrait':'landscape';
  for(const [grp,zs] of Object.entries(DUNGEONS)){
    // portrait is the priority: every dungeon zone; landscape: the first two of each group
    for(const z of (name==='p'?zs:zs.slice(0,2))){
      await enter(p,z);const zn=await p.evaluate(()=>__g.W.z.n+'|'+__g.W.z.style+'|'+(__g.DEAD[__g.W.z.style]?__g.DEAD[__g.W.z.style].mode:'none'));
      const m=await p.evaluate(measure);gl[name+z]=m;const MINDET=grp==='pale'?MIN_DETAIL_PALE:CLOUD.includes(z)?MIN_DETAIL_CLOUD:MIN_DETAIL;const t=lab+' z'+z+' '+zn.split('|')[0]+' ('+grp+') ';
      check(t+'has a mass entry',/\|mass$/.test(zn),zn);
      check(t+'flat near-black '+m.flat.toFixed(1)+'% (max '+MAX_FLAT+')',m.flat<=MAX_FLAT);
      check(t+'texture '+m.detail.toFixed(2)+' (min '+MINDET+')',m.detail>=MINDET);
      if(grp==='pale'){check(t+'does not go dark: mean luma '+m.lum.toFixed(0)+' (min '+MIN_LUM_PALE+'), dark share '+m.dark.toFixed(1)+'% (max '+MAX_DARK_PALE+')',m.lum>=MIN_LUM_PALE&&m.dark<=MAX_DARK_PALE)}
      if(shots)await p.screenshot({path:path.join(shots,'dungeon-'+z+'-'+(process.env.DEAD_PREFIX||'after')+'-'+name+'.png')});
      if(name==='p'){
        // Cloud sky (Act II): mass fades out; with the camera well outside the map the sky must be visible, near the map it is covered
        if(CLOUD.includes(z)){
          const sh=await p.evaluate(()=>{const g=__g,W=g.W,P=g.P,cv=document.getElementById('cv'),dat=()=>{g.W.seenGen=(W.seenGen||0)+1;g.render();return cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data};
            const st=W.z.style,D=g.DEAD[st],px=P.x,py=P.y;if(!D)return{gap:'',near:0,far:100};const diff=(a,b)=>{let n=0,t=0;for(let i=0;i<a.length;i+=16){t++;if(Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2])>12)n++}return 100*n/t};
            const o={};let a=dat();g.DEAD[st]=undefined;delete g.DEAD[st];let b0=dat();o.near=diff(a,b0);g.DEAD[st]=D;
            P.x=P.y=-16;a=dat();delete g.DEAD[st];b0=dat();o.far=diff(a,b0);g.DEAD[st]=D;P.x=px;P.y=py;o.gap=D.gap?D.gap.join(','):'';return o});
          check(t+'sky gap: mass covers the screen near the map ('+sh.near.toFixed(0)+'%) and leaves the Cloud sky far from it ('+sh.far.toFixed(1)+'% painted)',sh.gap&&sh.near>=25&&sh.far<=15,JSON.stringify(sh));
        }else{const hg=await p.evaluate(()=>!!(__g.DEAD[__g.W.z.style]||{}).gap);check(t+'no sky gap outside Act II',!hg)}
      }
      check(t+'errors',!p.errs.length,p.errs.join('|'))}}
  if(name==='p'){
    // dungeon art is data-driven, seeded and visual only
    await enter(p,31);
    const sigf=()=>p.evaluate(()=>{const W=__g.W;return[W.map.reduce((a,v,i)=>a+v*(i%97+1),0),W.wh.reduce((a,v,i)=>a+v*(i%89+1),0),W.seen.reduce((a,v,i)=>a+v*(i%83+1),0)].join(',')});
    const sig=await sigf();
    const r2=await p.evaluate(()=>{const rn=Math.random;let n=0;Math.random=()=>{n++;return rn()};__g.W.seenGen++;__g.render();__g.W.seenGen++;__g.render();Math.random=rn;return n});
    check('mass renderer does not consume Math.random',r2===0,String(r2));
    const sig2=await sigf();check('mass render leaves map/wh/seen unchanged',sig===sig2,sig+' vs '+sig2);
    const pg=await p.evaluate(()=>__g.DEADC?__g.DEADC.m.size:0);check('mass page cache capped at 9 after a long walk (got '+pg+')',pg<=9);
    // determinism: two cold bakes under different Math.random give the same sprite and page pixels
    const bake=v=>p.evaluate(v=>{const rn=Math.random;Math.random=()=>v;const g=__g;g.TX.style='';g.buildTextures(g.W.z.style);g.W.seenGen++;g.render();Math.random=rn;const D=g.TX.dead;let s='';for(const k in D)for(const o of D[k]){const c=o.c||o;s+=c.toDataURL().slice(-80)+c.width}const C=g.DEADC;if(C)for(const e of C.m.values())s+=e.c.toDataURL().slice(-60);let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0},v);
    const h1=await bake(.2),h2=await bake(.9);check('mass art bakes identically under a different Math.random',h1===h2,h1+' vs '+h2);
    const room=await p.evaluate(()=>{const Z=__g.ZONES;const i=Z.findIndex(z=>z.style==='room');return{i,has:!!__g.DEAD.room}});check('The Room (zone '+room.i+') keeps the black: no DEAD entry',room.i===32&&!room.has,JSON.stringify(room));
    await enter(p,32);const rm=await p.evaluate(measure);gl.room=rm;check('The Room stays near-black (flat '+rm.flat.toFixed(1)+'%)',rm.flat>=40,JSON.stringify(rm));
    const enc=await p.evaluate(()=>/"_dc"|"_dd"|DEADC|"dead"/.test(JSON.stringify(__g.encW(__g.W))));check('encW does not serialize mass art',!enc);
  }
}
res.dungeons=gl;
// ===== batch 2: dark outdoor zones (mode:'scene'): farm 3, garden 8, still 16, mempool 29 =====
const ol={},means={};
for(const [name,vp] of [['p',{width:390,height:844}],['l',{width:844,height:390}]]){
  const p=await open(b,vp),lab=name==='p'?'portrait':'landscape';
  for(const [zs,st] of Object.entries(OUTDOOR)){const z=+zs,t=lab+' z'+z+' '+st+' ';
    await enter(p,z);const zn=await p.evaluate(()=>{const D=__g.DEAD[__g.W.z.style];return __g.W.z.style+'|'+(D?D.mode:'none')+'|'+(D&&D.only?D.only.join('+'):'')});
    check(t+'has a scene entry',zn.split('|')[0]===st&&zn.split('|')[1]==='scene',zn);
    const m=await p.evaluate(measure);ol[name+z]=m;
    check(t+'flat near-black '+m.flat.toFixed(1)+'% (max '+MAX_FLAT+')',m.flat<=MAX_FLAT);
    check(t+'texture '+m.detail.toFixed(2)+' (min '+(z===8?MIN_DETAIL_CLOUD:MIN_DETAIL)+')',m.detail>=(z===8?MIN_DETAIL_CLOUD:MIN_DETAIL));
    if(name==='p'){const mc=await p.evaluate(()=>{const cv=document.getElementById('cv'),o=document.createElement('canvas');o.width=o.height=1;const g=o.getContext('2d');g.drawImage(cv,0,0,1,1);return[...g.getImageData(0,0,1,1).data].slice(0,3)});means[z]=mc}
    if(shots)await p.screenshot({path:path.join(shots,'outdoor-'+z+'-'+(process.env.DEAD_PREFIX||'after')+'-'+name+'.png')});
    if(name==='p'){
      // visual only: render leaves map/wh/seen alone and never consumes Math.random
      const sigf=()=>p.evaluate(()=>{const W=__g.W;return[W.map.reduce((a,v,i)=>a+v*(i%97+1),0),W.wh.reduce((a,v,i)=>a+v*(i%89+1),0),W.seen.reduce((a,v,i)=>a+v*(i%83+1),0),W.ents.length].join(',')});
      const sg=await sigf();const rn=await p.evaluate(()=>{const r=Math.random;let n=0;Math.random=()=>{n++;return r()};__g.W.seenGen++;__g.render();__g.W.seenGen++;__g.render();Math.random=r;return n});
      check(t+'render does not consume Math.random',rn===0,String(rn));check(t+'render leaves map/wh/seen/ents unchanged',sg===await sigf());
      // seeded: two cold bakes under different Math.random give the same sprites and pages
      const bake=v=>p.evaluate(v=>{const rn=Math.random;Math.random=()=>v;const g=__g;g.TX.style='';g.buildTextures(g.W.z.style);g.W.seenGen++;g.render();Math.random=rn;const D=g.TX.dead;let s='';for(const k in D)for(const o of D[k]){const c=o.c||o;s+=c.toDataURL().slice(-80)+c.width}const C=g.DEADC;if(C)for(const e of C.m.values())s+=e.c.toDataURL().slice(-60);let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0},v);
      const h1=await bake(.2),h2=await bake(.9);check(t+'art bakes identically under a different Math.random',h1===h2,h1+' vs '+h2);
      // capped cache after a long walk, and nothing serialized
      const cc=await p.evaluate(()=>{const g=__g,W=g.W,P=g.P;for(let i=0;i<400;i++){P.x=Math.min(W.N-2,Math.max(1,W.start.x+Math.sin(i/9)*W.N*.45));P.y=Math.min(W.N-2,Math.max(1,W.start.y+Math.cos(i/7)*W.N*.45));W.seenGen++;g.render()}
        return{pages:g.DEADC?g.DEADC.m.size:0,leak:/"_dc"|"_dd"|DEADC|"dead"/.test(JSON.stringify(g.encW(W))),onW:('_dc' in W)||('_dd' in W)}});
      check(t+'page cache capped at 9 (got '+cc.pages+')',cc.pages<=9);check(t+'encW holds no dead-space cache',!cc.leak&&!cc.onW);
      // identity: painters of this zone that no other outdoor zone uses
      const own=await p.evaluate(a=>{const D=__g.DEAD,o={};for(const s of Object.values(a)){o[s]=new Set(Object.values((D[s]||{props:{}}).props).map(q=>q.paint))}const me=o[__g.W.z.style];let n=0;for(const k of me){if(!Object.entries(o).some(([s,v])=>s!==__g.W.z.style&&v.has(k)))n++}return{own:n,all:me.size}},OUTDOOR);
      check(t+'has its own painters ('+own.own+' unique of '+own.all+', min 3)',own.own>=3,JSON.stringify(own));
      // garden sits under the Cloud sky: mass covers the screen near the map and leaves the sky far from it
      if(z===8){const sh=await p.evaluate(()=>{const g=__g,W=g.W,P=g.P,cv=document.getElementById('cv'),dat=()=>{W.seenGen=(W.seenGen||0)+1;g.render();return cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data};
          if(!g.DEAD[W.z.style])return{near:0,far:100,gap:''};
          P.x=W.start.x+.5;P.y=W.start.y+.5;   // the walk above left the hero anywhere
          const st=W.z.style,D=g.DEAD[st],px=P.x,py=P.y,diff=(a,b)=>{let n=0,t=0;for(let i=0;i<a.length;i+=16){t++;if(Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2])>12)n++}return 100*n/t},o={};
          let a=dat();delete g.DEAD[st];let b0=dat();o.near=diff(a,b0);g.DEAD[st]=D;P.x=P.y=-16;a=dat();delete g.DEAD[st];b0=dat();o.far=diff(a,b0);g.DEAD[st]=D;P.x=px;P.y=py;o.gap=D.gap?D.gap.join(','):'';return o});
        check(t+'Cloud sky gap: art covers the screen near the map ('+sh.near.toFixed(0)+'%), leaves sky far from it ('+sh.far.toFixed(1)+'% painted)',sh.gap&&sh.near>=25&&sh.far<=15,JSON.stringify(sh))}
    }
    check(t+'errors',!p.errs.length,p.errs.join('|'))}
  if(name==='p'){
    // the Simulator shares style 'farm' but has no dead space: gated by zone id
    const sim=await p.evaluate(()=>{const Z=__g.ZONES,i=Z.findIndex(z=>z.style==='farm'&&z.sim||z.n==='The Simulator'),D=__g.DEAD.farm;return{i,only:D&&D.only?D.only.join(','):'',gated:i>=0&&D&&D.only&&!D.only.includes(i)}});
    check('Simulator (zone '+sim.i+', style farm) is gated out of the farm art by id',sim.gated,JSON.stringify(sim));
    // each zone looks like itself: the mean colour of the screen differs between the four
    const ks=Object.keys(means);let minD=1e9;for(let i=0;i<ks.length;i++)for(let j=i+1;j<ks.length;j++){const a=means[ks[i]],c=means[ks[j]];minD=Math.min(minD,Math.abs(a[0]-c[0])+Math.abs(a[1]-c[1])+Math.abs(a[2]-c[2]))}
    check('the four outdoor zones have distinct mean colour (min pairwise L1 '+minD.toFixed(0)+', min 12)',minD>=12,JSON.stringify(means));
  }
}
res.outdoor=ol;
await b.close();
console.log(JSON.stringify(res));
console.log(fail.length?'FAIL ('+fail.length+'):\n'+fail.join('\n'):'PASS dead-space-check');
process.exit(fail.length?1:0)})();
