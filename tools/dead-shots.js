/* Before/after harness for the dead-space table refactor.
   Per viewport (portrait 390x844, landscape 844x390) and zone (1 Moors, 20 Bull Run):
   - frozen-frame canvas PNG (seeded Math.random, rAF stopped, fixed clock, hero on the start tile) for pixel diffs
   - hash of every cached dead-space page canvas and every baked sprite (exact art proof; works on old W._dc and new DEADC)
   - timing: enter, first render() right after enter, warm floor rebuild, still frame, 240-step walk
   DEAD_HTML=file DEAD_OUT=dir DEAD_TAG=name node tools/dead-shots.js */
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const html=fs.readFileSync(process.env.DEAD_HTML||path.join(__dirname,'..','dist/unsubscribe.html'),'utf8');
const out=process.env.DEAD_OUT||'/tmp/art',tag=process.env.DEAD_TAG||'run';fs.mkdirSync(out,{recursive:true});
const skip=()=>{const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}};
const seed=()=>{let a=12345;Math.random=()=>{a=(a+0x6D2B79F5)|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
const fnv=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(16)};
(async()=>{const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined,args:['--no-sandbox','--disable-dev-shm-usage']});const res={};
for(const [name,vp] of [['p',{width:390,height:844}],['l',{width:844,height:390}]])for(const zone of [1,20]){
  const c=await b.newContext({viewport:vp,hasTouch:true,isMobile:true});const p=await c.newPage();p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));
  await p.addInitScript('('+seed.toString()+')()');
  await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');await p.waitForTimeout(300);
  await p.evaluate(()=>{__g.skipDisc();__g.OPT.noWalk=1});await p.waitForTimeout(150);
  await p.evaluate(()=>{document.getElementById('title').hidden=true;__g.newGame('scrapper');__g.G.pre=2;__g.G.walkNew=0;__g.G.god=true;__g.G.lvl=90;__g.G.unlocked=34;__g.G.act2=__g.G.act3=__g.G.act4=__g.G.act5=true});
  for(let i=0;i<12;i++){await p.evaluate(skip);await p.waitForTimeout(60)}
  const t=await p.evaluate(z=>{const t0=performance.now();__g.enter(z);const t1=performance.now();__g.render();const t2=performance.now();return[t1-t0,t2-t1]},zone);
  for(let i=0;i<10;i++){await p.evaluate(skip);await p.waitForTimeout(40)}
  await p.evaluate(()=>{const s=document.getElementById('scene');if(s)s.hidden=true;const d=document.getElementById('dlg');if(d)d.hidden=true;__g.setMode('play');__g.G.god=true;for(let i=0;i<30;i++)__g.update(1/60);__g.W.ents.length=0});
  await p.waitForTimeout(250);
  const warm=await p.evaluate(()=>{const a=[];for(let i=0;i<40;i++){__g.W.seenGen=(__g.W.seenGen||0)+1;const t0=performance.now();__g.render();a.push(performance.now()-t0)}a.sort((x,y)=>x-y);return a[20]});
  const still=await p.evaluate(()=>{const a=[];for(let i=0;i<40;i++){const t0=performance.now();__g.render();a.push(performance.now()-t0)}a.sort((x,y)=>x-y);return a[20]});
  const walk=await p.evaluate(()=>{const P=__g.P,W=__g.W,a=[];let dx=.25,dy=.1;for(let i=0;i<240;i++){const nx=P.x+dx,ny=P.y+dy;if(W.map[(ny|0)*W.N+(nx|0)]){P.x=nx;P.y=ny}else{dx=-dx;dy=-dy}const t0=performance.now();__g.render();a.push(performance.now()-t0)}a.sort((x,y)=>x-y);return{p50:a[120],p95:a[228],max:a[239]}});
  // frozen, comparable frame: a fixed synthetic map (same in every build), seeded Math.random, no loop, HUD-free canvas read
  const art=await p.evaluate(args=>{const f=eval(args[0]),seedF=eval(args[1]);const g=__g,P=g.P,W=g.W,N=W.N;
    W.map.fill(0);W.wh.fill(0);W.seen.fill(1);const c=(N/2)|0;
    for(let y=c-14;y<=c+14;y++)for(let x=c-14;x<=c+14;x++){const h=Math.imul(x*73856093^y*19349663,2654435761)>>>0;const r=Math.hypot(x-c,y-c);if(r<7||(r<14&&h%7>1))W.map[y*N+x]=1}
    W.ents.length=0;W.objs=[];W.npcs=[];W.decals=[];W.drops=[];W.portals=[];W.parts=[];W.fx=[];W.texts=[];
    P.x=c+.5;P.y=c+.5;
    if(W._dc)delete W._dc;if(W._dd)delete W._dd;if(g.DEADC){g.DEADC.m.clear();g.DEADC.dd=null}
    window.requestAnimationFrame=()=>0;seedF();g.TX.style='';g.buildTextures(W.z.style);seedF();
    W.seenGen=(W.seenGen||0)+1;g.render();
    const C=g.DEADC||W._dc,m=C&&C.m?C.m:new Map(),ph={};for(const k of [...m.keys()].sort())ph[k]=f(m.get(k).c.toDataURL());
    let sh='';const D=g.TX.dead;if(D)for(const k in D){const a=Array.isArray(D[k])?D[k]:[D[k]];for(const o of a)sh+=f((o.c||o).toDataURL())+','}
    const cv=document.getElementById('cv');return{pages:ph,spriteHash:f(sh),canvas:cv.toDataURL('image/png'),dist:g.DEADC?g.DEADC.dd.length:(W._dd||[]).length}},['('+fnv.toString()+')','('+seed.toString()+')']);
  fs.writeFileSync(path.join(out,tag+'-z'+zone+'-'+name+'-cv.png'),Buffer.from(art.canvas.split(',')[1],'base64'));delete art.canvas;
  res[name+zone]={enterMs:+t[0].toFixed(1),firstFrame:+t[1].toFixed(1),warmRebuild:+warm.toFixed(2),still:+still.toFixed(2),walk,art,err:p.errs};
  await p.screenshot({path:path.join(out,tag+'-z'+zone+'-'+name+'.png')});
  await c.close()}
await b.close();console.log(JSON.stringify(res,null,1))})();
