/* Act III, "Strike the minutes": the prop must never share the gate's tile.
   Usage: node tools/minute-gate.js
   Zone 13 is the Hall of Minutes. Its exit portal sits on W.goal, and every pick
   path tests portals before objs with a strict <, so a minute on that tile loses
   every tie and cannot be struck. Checks the tie-break is real, that the re-entry
   path staggers the spawn, and that a minute an old save parked on the gate is
   moved off it. */
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined,args:['--no-sandbox','--disable-dev-shm-usage']});
const p=await b.newPage({viewport:{width:390,height:800}});
const errs=[];p.on('pageerror',e=>errs.push('pageerror: '+e.message));
const bad=m=>errs.push(m);
const root=path.join(__dirname,'..');
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8')+'</body></html>');
await p.waitForTimeout(600);
await p.evaluate(()=>__g.skipDisc());await p.waitForTimeout(260);
await p.click('[data-cls=scrapper]');await p.waitForTimeout(800);
/* Dialogs lock their buttons for up to 4s, and update() bails while one is open --
   which leaves #bAct holding stale text. Keep clicking until mode is play again. */
const sk=async(n=40)=>{for(let i=0;i<n;i++){const m=await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();
    const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}return __g.mode});
  if(m==='play')return;await p.waitForTimeout(250)}
  bad('dialogs never cleared; mode is '+(await p.evaluate(()=>__g.mode)))};
await sk();
await p.evaluate(()=>{const G=__g.G;G.god=true;G.lvl=90;G.unlocked=34;G.act2=G.act3=G.act4=G.act5=true});

/* The hall, Secretary already down, shorthand stopped: the state a player is in
   after a death or a town trip mid-quest. */
const hall=async()=>{await p.evaluate(()=>{const G=__g.G;for(let i=1;i<=25;i++)G.q['q'+i]=3;G.q.q12=1;G.q12down=1});
  await p.evaluate(()=>__g.enter(12));await sk();
  await p.evaluate(()=>__g.enter(13));await sk();
  await p.evaluate(()=>{for(let i=0;i<30;i++)if(__g.mode==='play')__g.update(1/60)})};

/* #bAct is painted by the HUD on the animation frame, not by update(), so stand the
   player on the spot and let real frames run before reading the prompt. */
const label=async(x,y)=>{await p.evaluate(([x,y])=>{__g.P.x=x;__g.P.y=y;__g.P.moving=false},[x,y]);
  await p.waitForTimeout(260);
  return p.evaluate(()=>{const a=document.getElementById('bAct');return a&&!a.hidden?a.textContent.trim():null})};

await hall();
const gate=await p.evaluate(()=>{const g=(__g.W.portals||[]).find(t=>t.kind==='next');return g?{x:g.x,y:g.y}:null});
if(!gate)bad('zone 13 has no next portal');

/* 1. the tie-break itself: a minute on the gate's tile is unreachable */
if(gate){
  await p.evaluate(g=>{__g.W.objs=__g.W.objs.filter(o=>o.k!=='minute');__g.W.objs.push({k:'minute',x:g.x,y:g.y})},gate);
  const l=await label(gate.x,gate.y);
  if(l==='Strike the minutes')bad('overlap repro: expected the gate to win the prompt, got the minutes');
  else if(!l||!/^Go on to /.test(l))bad('overlap repro: expected a "Go on to ..." gate prompt, got '+JSON.stringify(l));
  else console.log('overlap repro: a minute on the gate tile yields '+JSON.stringify(l)+' -- unreachable, as reported');
}

/* 2. the re-entry path (no W.suAt) must stagger the spawn clear of the gate */
await hall();
const spawned=await p.evaluate(()=>{const W=__g.W,m=W.objs.find(o=>o.k==='minute'&&!o.used);
  if(!m)return null;const N=W.N,tx=Math.floor(m.x),ty=Math.floor(m.y);let floor=true;
  for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)if(W.map[(ty+j)*N+tx+i]!==1)floor=false;
  return{x:m.x,y:m.y,floor,suAt:!!W.suAt,d:Math.min(...W.portals.map(t=>Math.hypot(t.x-m.x,t.y-m.y)))}});
if(!spawned)bad('re-entering the hall with q12down spawned no minute');
else{
  if(spawned.suAt)bad('W.suAt was set, so this run did not exercise the W.goal fallback');
  if(spawned.d<2.6)bad('spawned minute is '+spawned.d.toFixed(2)+' tiles from a portal, want >=2.6');
  if(!spawned.floor)bad('spawned minute is not on clear floor');
  const l=await label(spawned.x,spawned.y);
  if(l!=='Strike the minutes')bad('standing on the spawned minute reads '+JSON.stringify(l));
  else console.log('re-entry spawn: '+spawned.d.toFixed(2)+' tiles clear of the gate, prompt reads "Strike the minutes"');
  const done=await p.evaluate(()=>{const a=document.getElementById('bAct');a.click();return __g.G.q.q12});
  if(done!==2)bad('striking the minutes left q12 at '+done+', want 2');
  else console.log('striking it completes the quest (q12=2)');
}

/* 3. a minute an older save already parked on the gate gets moved on re-entry */
await hall();
const repaired=await p.evaluate(()=>{const W=__g.W,g=(W.portals||[]).find(t=>t.kind==='next');
  W.objs=W.objs.filter(o=>o.k!=='minute');W.objs.push({k:'minute',x:g.x,y:g.y});
  __g.enter(13);
  const m=__g.W.objs.find(o=>o.k==='minute'&&!o.used);
  return m?{d:Math.min(...__g.W.portals.map(t=>Math.hypot(t.x-m.x,t.y-m.y)))}:null});
await sk();
if(!repaired)bad('the parked minute vanished on re-entry instead of moving');
else if(repaired.d<2.6)bad('a minute parked on the gate stayed '+repaired.d.toFixed(2)+' tiles away');
else console.log('a save with the minute on the gate is repaired to '+repaired.d.toFixed(2)+' tiles clear');

console.log(errs.length?'ERRORS:\n'+errs.slice(0,12).join('\n'):'no errors');
await b.close();process.exit(errs.length?1:0)})();
