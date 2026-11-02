/* Each back-half fight does the thing that makes it that fight.
   node tools/boss-fight-check.js
   Spawns each boss beside an untouchable player, runs the game loop, and checks
   for the fight's own tell rather than for "something happened": PROVIDENCE's
   lanes, its covered floor and its Act V summons; the Curator's one safe pad and
   the room after she stops choosing. The mid-fight dialogs are switched off so
   the loop never stops on a locked button. */
const {chromium}=require('playwright');
const path=require('path');
const URL='file://'+path.join(__dirname,'..','dist/Unsubscribe-2087-standalone.html');
async function clearUI(p){for(let i=0;i<50;i++){const st=await p.evaluate(()=>{
 const s=document.getElementById('scene');if(s&&!s.hidden){const b=document.getElementById('scSkip');if(b)b.click();return 'x'}
 const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x){x.click();return 'x'}return 'l'}
 return 'c'});if(st==='c')return;await p.waitForTimeout(st==='l'?300:120)}}
const out=[];let bad=0;
const ok=(n,c,d)=>{out.push((c?'  ok   ':'  FAIL ')+n+(d?'   '+d:''));if(!c)bad++};
/* run one fight at a fixed life fraction for `secs`, walking the player in a
   straight line so a predictor has something to predict */
const FIGHT=(a)=>{const g=window.__g,W=g.W,P=g.P;W.bi=1;W.ents.length=0;W.fx.length=0;W.projs.length=0;
  const e=g.spawn(a.k,P.x+4,P.y,{});e.aggro=true;e.p1=e.p2=e.asked=1;if(a.doubt)e.doubt=1;
  let i=0;const o={lanes:0,pads:0,ring:0,board:0,slowDrain:0,white:0,kinds:{},aims:[],stopped:0,used:0};const seen=new Set();
  for(;i<a.secs*60;i++){e.hp=e.max*a.f;e.stun=0;if(g.mode!=='play')break;
    P.x+=Math.cos(i/90)*.02;g.update(1/60);
    for(const f of W.fx){if(seen.has(f))continue;seen.add(f);
      if(f.k==='warn'&&f.r===.75&&f.dty==='surge')o.lanes++;
      if(f.k==='warn'&&f.r===1.05)o.board++;
      if(f.k==='warn'&&f.r===1.15)o.ring++;
      if(f.k==='patch'&&f.tel&&f.col==='#7be495')o.pads++}
    for(const p of W.projs){if(seen.has(p)||!p.foe)continue;seen.add(p);if(p.slow&&p.drain)o.slowDrain++;if(p.col==='#ffffff')o.white++}
    for(const m of W.ents)if(m.minion)o.kinds[m.k]=1;
    if(e.aim&&i%30===0)o.aims.push([e.aim.x-P.x,e.aim.y-P.y])}
  o.n=i;o.dlg=(document.getElementById('dlg')||{}).innerText;o.stopped=e.stopped||0;o.used=e.used||0;o.mode=g.mode;return o};
(async()=>{
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:760,height:760}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(URL);await p.waitForTimeout(700);
await p.evaluate(()=>__g.skipDisc());await p.waitForTimeout(250);
await p.click('[data-cls=scrapper]');await p.evaluate(()=>{__g.G.pre=2});await clearUI(p);await p.waitForTimeout(1600);await clearUI(p);
await p.evaluate(()=>{const G=__g.G;G.god=true;G.lvl=90;G.unlocked=34;for(let i=1;i<=24;i++)G.q['q'+i]=3});
/* an act's first visit raises its card a beat after entry, so settle each zone once first */
const warm=new Set();
const run=async(z,a)=>{await p.evaluate(z=>__g.enter(z),z);await clearUI(p);if(!warm.has(z)){warm.add(z);await p.waitForTimeout(3000);await clearUI(p)}return p.evaluate(FIGHT,a)};

const a0=14*60;let o=await run(32,{k:'boss5',f:.8,secs:14});
if(o.n<a0)console.log('  (first fight ran '+o.n+' frames, mode '+o.mode+') '+String(o.dlg).slice(0,200));
ok('PROVIDENCE fires lanes at where you are going',o.lanes>=6,'lanes '+o.lanes);
ok('each lane spends one of the forty-one fans',o.used>=2,'used '+o.used);
const kinds=Object.keys(o.kinds);
ok('PROVIDENCE calls Act V machines, not Act III ones',kinds.length>0&&kinds.every(k=>['oracle','custod','valid'].includes(k)),kinds.join(',')||'none');
ok('it shows where it thinks you will be',o.aims.length>5);
const lead=o.aims.reduce((s,a)=>s+Math.hypot(a[0],a[1]),0)/Math.max(1,o.aims.length);
ok('the aim leads a moving player',lead>.3&&lead<3,'mean lead '+lead.toFixed(2));
o=await run(32,{k:'boss5',f:.8,secs:6,doubt:1});
const jit=o.aims.reduce((s,a)=>s+Math.hypot(a[0],a[1]),0)/Math.max(1,o.aims.length);
ok('the seventh part makes its aim noisy',jit>lead+.6,'mean lead '+jit.toFixed(2));
o=await run(32,{k:'boss5',f:.25,secs:8});
ok('last third: the floor is covered but for one tile',o.board>=8&&o.pads>=1,'blasts '+o.board+', safe '+o.pads);
ok('last third: no more lanes',o.lanes===0,'lanes '+o.lanes);

o=await run(26,{k:'boss4',f:.8,secs:16});
ok('the Curator curates: one soft pad, ringed',o.pads>=1&&o.ring>=7,'pads '+o.pads+', ring '+o.ring);
ok('her true things slow and drain',o.slowDrain>=10,'cards '+o.slowDrain);
o=await run(26,{k:'boss4',f:.2,secs:10});
ok('below a quarter she stops choosing',o.stopped===1&&o.pads===0,'pads '+o.pads);
ok('and MANDATE comes in from the edges',o.white>=2,'white '+o.white);

/* TARO-9: off the dock it shrugs most of a blow off; lure a charge across the dock and it saves */
await run(24,{k:'mech',f:1,secs:0});
o=await p.evaluate(async()=>{const g=__g,W=g.W,P=g.P;W.bi=1;W.ents.length=0;W.fx.length=0;
  const e=g.spawn('mech',P.x+4,P.y,{su:g.ZONES[24].su});e.aggro=true;g.update(1/60);
  const r={dm:e.dm,docked:0,lanes:0};e.dock={x:(e.x+P.x)/2,y:(e.y+P.y)/2};
  for(let i=0;i<600&&!r.docked;i++){g.update(1/60);if(W.fx.some(f=>f.k==='warn'&&!f.boom))r.lanes=1;if(e.dm===1&&e.stun>0)r.docked=1}
  return r});
ok('TARO-9 takes a quarter off its dock',o.dm===.25,'dm '+o.dm);
ok('its charge is telegraphed',o.lanes===1);
ok('a charge across the dock docks it',o.docked===1);
/* Reorg: damage done in the last three seconds is undone, and below half the player goes back too */
await run(31,{k:'mech',f:1,secs:0});
o=await p.evaluate(async()=>{const g=__g,W=g.W,P=g.P;W.bi=1;W.ents.length=0;W.fx.length=0;
  const e=g.spawn('mech',P.x+3,P.y,{su:g.ZONES[31].su});e.aggro=true;const r={undo:0,back:0};
  for(let i=0;i<60*8.2;i++){g.update(1/60);if(i===60*7)e.hp-=e.max*.1}
  const before=e.hp;for(let i=0;i<60*2;i++)g.update(1/60);r.undo=e.hp>before+e.max*.05?1:0;
  e.hp=e.max*.4;e.rg=3.2;if(e.hist)e.hist.length=0;const p0={x:P.x,y:P.y};
  for(let i=0;i<60*3.6;i++){if(i===30)P.x=p0.x+1.5;g.update(1/60)}r.back=Math.hypot(P.x-p0.x,P.y-p0.y)<.6?1:0;
  return r});
ok('a reorg undoes the last three seconds of damage',o.undo===1);
ok('a deep reorg takes the player back too',o.back===1);
ok('no page errors',errs.length===0,errs.slice(0,3).join(' | '));
console.log(out.join('\n'));console.log(bad?bad+' FAIL':'all ok');await b.close();process.exit(bad?1:0)})();
