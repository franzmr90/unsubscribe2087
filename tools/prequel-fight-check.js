/* The prequel's one fight: the Air Gap at the cage (Micah, 2026-11-02: "give the prequel a fight").
   node tools/prequel-fight-check.js
   Plays the cage stop, then checks the fight's own rule (only the cable reaches it), that nothing in
   the prequel can kill you, and that bringing it down moves the week on to Natalya. */
const {chromium}=require('playwright');const path=require('path');
const URL='file://'+path.join(__dirname,'..','dist/Unsubscribe-2087-standalone.html');
async function clearUI(p){for(let i=0;i<60;i++){const st=await p.evaluate(()=>{
 const s=document.getElementById('scene');if(s&&!s.hidden){const b=document.getElementById('scSkip');if(b)b.click();return 'x'}
 const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x){x.click();return 'x'}return 'l'}
 return 'c'});if(st==='c')return;await p.waitForTimeout(st==='l'?300:120)}}
const out=[];let bad=0;const ok=(n,c,d)=>{out.push((c?'  ok   ':'  FAIL ')+n+(d?'   '+d:''));if(!c)bad++};
(async()=>{
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:760,height:760}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(URL);await p.waitForTimeout(700);await p.evaluate(()=>__g.skipDisc());await p.waitForTimeout(250);
await p.click('[data-cls=scrapper]');await p.waitForTimeout(400);
await p.evaluate(()=>{const g=__g;g.G.pre=1;g.G.preS=1;g.G.preSeen=1;g.enter(33)});await p.waitForTimeout(1500);await clearUI(p);
await p.evaluate(()=>{const g=__g;g.P.x=8.5;g.P.y=10;g.talkTo('p1')});await p.waitForTimeout(300);await clearUI(p);await p.waitForTimeout(300);await clearUI(p);
let o=await p.evaluate(()=>{const g=__g,W=g.W,e=W.ents.find(m=>m.k==='gap');return{e:!!e,preS:g.G.preS,mode:g.mode}});
ok('opening the cage raises the Air Gap',o.e&&o.preS===1,JSON.stringify(o));
o=await p.evaluate(()=>{const g=__g,W=g.W,P=g.P,e=W.ents.find(m=>m.k==='gap');g.G.hp=6;let low=1e9,daemons=0,rings=0,x0=e.x,y0=e.y;const seen=new Set();
  for(let i=0;i<60*14;i++){g.update(1/60);low=Math.min(low,g.G.hp);for(const m of W.ents)if(m.minion&&m.k==='daemon'&&!seen.has(m)){seen.add(m);daemons++}for(const q of W.projs)if(q.foe&&!seen.has(q)){seen.add(q);rings++}}
  const cab=W.fx.filter(f=>f.cab).length;P.x=e.cab.x1;P.y=e.cab.y1;const P2={x:(e.x+e.cab.x1)/2,y:(e.y+e.cab.y1)/2};P.x=P2.x;P.y=P2.y;g.update(1/60);const on=e.dm;P.x=e.x-(e.cab.x1-e.x);P.y=e.y-(e.cab.y1-e.y);g.update(1/60);const off=e.dm;
  return{low,daemons,rings,cab,on,off,still:Math.hypot(e.x-x0,e.y-y0)<.05,mode:g.mode}});
const fl=await p.evaluate(()=>{const g=__g;g.G.hp=2;g.W.fx.push({k:'warn',x:g.P.x,y:g.P.y,r:2,t:0,life:.05,boom:999,dty:'impact'});for(let i=0;i<20;i++)g.update(1/60);return{hp:g.G.hp,mode:g.mode}});
ok('nothing in the prequel can kill you',o.low>=1&&fl.hp>=1&&fl.mode==='play','after a 999 blast: '+JSON.stringify(fl));
ok('it fires rings and calls daemons',o.rings>=8&&o.daemons>=2,'shots '+o.rings+', daemons '+o.daemons);
ok('it is a gap, not a guard: it does not move',o.still);
ok('the cable is laid on the floor',o.cab===5,'patches '+o.cab);
ok('on the cable your blows land; off it they barely do',o.on===1&&o.off===.15,'on '+o.on+', off '+o.off);
await p.evaluate(()=>{const g=__g,e=g.W.ents.find(m=>m.k==='gap');e.hp=1;g.P.x=(e.x+e.cab.x1)/2;g.P.y=(e.y+e.cab.y1)/2});
await p.evaluate(()=>{const g=__g,e=g.W.ents.find(m=>m.k==='gap');(g.hit||g.kill)(e,99);if(g.W.ents.includes(e)&&e.hp<=0)g.kill(e);g.update(1/60)});
await p.waitForTimeout(1300);let sc='';for(let i=0;i<10&&!/door/.test(sc);i++){await p.waitForTimeout(400);sc=await p.evaluate(()=>(document.getElementById('scene')||{}).innerText||'')}
ok('bringing it down plays the cage scene',/door/.test(sc),sc.slice(0,60));
await clearUI(p);await p.waitForTimeout(200);
o=await p.evaluate(()=>({preS:__g.G.preS,gap:__g.W.ents.some(m=>m.k==='gap'),q25:__g.G.q.q25}));
ok('and the week moves on to Natalya',o.preS===2&&!o.gap&&o.q25!==3,JSON.stringify(o));
ok('no page errors',!errs.length,errs.slice(0,2).join(' | '));
console.log(out.join('\n'));console.log(bad?bad+' FAIL':'all ok');await b.close();process.exit(bad?1:0)})();
