/* Click-check for the Acts I–III quest beats.
   node tools/quest-variety.js
   Loads dist/unsubscribe.html under setContent. */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const fail=m=>{console.error(m);process.exitCode=1;throw new Error(m)};
(async()=>{
const root=path.join(__dirname,'..');
const built=fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8');
if(!built.includes("brief:'null'"))fail('audit is not talk-first');
if(built.includes('ENDING3')&&built.includes('INTRO3')){}else fail('act iii scenes missing');
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.stack||String(e)));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+built+'</body></html>');
await p.waitForTimeout(300);
await p.evaluate(()=>{__g.skipDisc();__g.OPT.noWalk=1});
await p.evaluate(()=>{__g.newGame('scrapper');__g.G.walkNew=0;__g.G.god=true});
const sk=async()=>{await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}})};
for(let i=0;i<20;i++){await sk();await p.waitForTimeout(40)}
await p.evaluate(()=>{__g.G.walkNew=0;__g.G.pre=0;__g.setMode('play');__g.enter(0)});
for(let i=0;i<8;i++){await sk();await p.waitForTimeout(40)}
const boot=await p.evaluate(()=>({mode:__g.mode,zi:__g.W&&__g.W.zi}));
if(boot.mode!=='play'||boot.zi!==0)fail('not in town '+JSON.stringify(boot));
const done=async(upto,qpatch,flags)=>{await p.evaluate(({upto,qpatch,flags})=>{const G=__g.G;for(let i=1;i<=25;i++)G.q['q'+i]=i<upto?3:0;if(qpatch)Object.assign(G.q,qpatch);if(flags)Object.assign(G,flags);G.qt=G.qt||{}},{upto,qpatch,flags})};
const step=()=>p.evaluate(()=>__g.storyStep());
const near=async(k,o)=>{const e=await p.evaluate(({k,o})=>{const P=__g.P;for(let i=0;i<16;i++){const a=i*0.7,e=__g.spawn(k,P.x+Math.cos(a)*(0.8+i*0.15),P.y+Math.sin(a)*(0.8+i*0.15),o||null);if(e)return true}return false},{k,o});if(!e)fail('could not spawn '+k)};
const pop=()=>p.evaluate(()=>{const e=__g.W.ents[__g.W.ents.length-1];__g.kill(e);return {q:e.q,k:e.k}});

await done(3,{q3:1},{q3open:1});
let st=await step();
if(!st.d.includes('Marrow')||!st.d.toLowerCase().includes('cage'))fail('cage objective '+JSON.stringify(st));

await done(4);
st=await step();
if(!st.d.includes('Sister Null'))fail('audit should name Sister Null '+JSON.stringify(st));
await p.evaluate(()=>__g.enter(4,{fresh:1}));
for(let i=0;i<6;i++){await sk();await p.waitForTimeout(30)}
const walked=await p.evaluate(()=>__g.G.q.q4);
if(walked!==0)fail('tribunal started the audit by itself '+walked);
await p.evaluate(()=>{__g.setMode('play');__g.enter(0)});
for(let i=0;i<6;i++){await sk();await p.waitForTimeout(30)}
await p.evaluate(()=>__g.talkTo('null'));
const brief=await p.evaluate(()=>({q:__g.G.q.q4,t:document.getElementById('dP').textContent}));
if(brief.q!==1||!brief.t.includes('Auditor Prime'))fail('brief '+JSON.stringify(brief));
for(let i=0;i<4;i++){await sk();await p.waitForTimeout(30)}
st=await step();
if(!st.d.includes('Auditor Prime'))fail('after brief '+JSON.stringify(st));

await done(8);
await p.evaluate(()=>{__g.G.q.q8=1;__g.G.q8page=0;__g.G.q8down=0;__g.enter(9,{fresh:1})});
for(let i=0;i<6;i++){await sk();await p.waitForTimeout(30)}
let lake=await p.evaluate(()=>({page:__g.W.objs.some(o=>o.k==='page'&&!o.used),d:__g.storyStep().d,goal:__g.goalPt()&&__g.goalPt().k}));
if(!lake.page||lake.goal!=='page'||!lake.d.includes('letter'))fail('letter first '+JSON.stringify(lake));
await p.evaluate(()=>{const z=__g.ZONES[9].su,P=__g.P;let e=null;for(let i=0;i<12&&!e;i++){const a=i*0.8;e=__g.spawn(z.k,P.x+Math.cos(a)*(1+i*0.2),P.y+Math.sin(a)*(1+i*0.2),{su:z})}if(!e)throw new Error('no lethe');__g.kill(e)});
lake=await p.evaluate(()=>({q:__g.G.q.q8,down:__g.G.q8down,d:__g.storyStep().d}));
if(lake.q!==1||!lake.down||!lake.d.includes('Lethe is down'))fail('lethe early '+JSON.stringify(lake));
await p.evaluate(()=>{const o=__g.W.objs.find(o=>o.k==='page'&&!o.used);__g.useObj(o)});
lake=await p.evaluate(()=>__g.G.q.q8);
if(lake!==2)fail('letter did not close the lake '+lake);

await p.evaluate(()=>{__g.G.q.q8=1;__g.G.q8page=0;__g.G.q8down=0;__g.enter(9,{fresh:1})});
for(let i=0;i<4;i++){await sk();await p.waitForTimeout(20)}
await p.evaluate(()=>{const o=__g.W.objs.find(o=>o.k==='page'&&!o.used);__g.useObj(o)});
st=await step();
if(!st.d.includes('Lethe'))fail('after the page '+JSON.stringify(st));
await p.evaluate(()=>{const z=__g.ZONES[9].su,P=__g.P;let e=null;for(let i=0;i<12&&!e;i++){const a=i*0.8;e=__g.spawn(z.k,P.x+Math.cos(a)*(1+i*0.2),P.y+Math.sin(a)*(1+i*0.2),{su:z})}if(!e)throw new Error('no lethe');__g.kill(e)});
if(await p.evaluate(()=>__g.G.q.q8)!==2)fail('lethe after the page did not finish');

await done(12);
await p.evaluate(()=>{__g.G.q.q12=1;__g.G.q12down=0;__g.enter(13,{fresh:1})});
for(let i=0;i<6;i++){await sk();await p.waitForTimeout(30)}
st=await step();
if(!st.d.includes('Recording Secretary')&&!st.d.includes('Destroy'))fail('minutes open '+JSON.stringify(st));
await p.evaluate(()=>{const z=__g.ZONES[13].su,P=__g.P;let e=null;for(let i=0;i<12&&!e;i++){const a=i*0.8;e=__g.spawn(z.k,P.x+Math.cos(a)*(1+i*0.2),P.y+Math.sin(a)*(1+i*0.2),{su:z})}if(!e)throw new Error('no secretary');__g.kill(e)});
let rec=await p.evaluate(()=>({q:__g.G.q.q12,book:__g.W.objs.some(o=>o.k==='minute'&&!o.used),d:__g.storyStep().d,goal:__g.goalPt()&&__g.goalPt().k}));
if(rec.q!==1||!rec.book||rec.goal!=='minute'||!rec.d.includes('Strike'))fail('minutes '+JSON.stringify(rec));
await p.evaluate(()=>{const o=__g.W.objs.find(o=>o.k==='minute'&&!o.used);__g.useObj(o)});
if(await p.evaluate(()=>__g.G.q.q12)!==2)fail('striking the minutes did not finish');

await done(13);
await p.evaluate(()=>{__g.G.q.q13=1;__g.G.qt={};__g.enter(14,{fresh:1})});
for(let i=0;i<6;i++){await sk();await p.waitForTimeout(30)}
st=await step();
if(!st.d.includes('0/4'))fail('motion open '+JSON.stringify(st));
await p.evaluate(()=>{const z=__g.ZONES[14].su,P=__g.P;let e=null;for(let i=0;i<12&&!e;i++){const a=i*0.8;e=__g.spawn(z.k,P.x+Math.cos(a)*(1+i*0.2),P.y+Math.sin(a)*(1+i*0.2),{su:z})}if(!e)throw new Error('no chair');__g.kill(e)});
let mot=await p.evaluate(()=>({q:__g.G.q.q13,d:__g.storyStep().d,down:__g.G.qt&&__g.G.qt.motionDown}));
if(mot.q!==1||!mot.down||!mot.d.includes('Chair is down'))fail('chair early '+JSON.stringify(mot));
for(let n=0;n<4;n++){await near('director');await pop()}
mot=await p.evaluate(()=>({q:__g.G.q.q13,n:__g.G.qt.motion}));
if(mot.q!==2||mot.n<4)fail('motion '+JSON.stringify(mot));

const scenes=await p.evaluate(()=>Object.keys(__g.scenes()));
if(!scenes.includes('INTRO3')||!scenes.includes('ENDING3'))fail('act iii scenes dropped');
if(errs.length)fail(errs[0]);
console.log('quest variety ok');
await b.close()})().catch(e=>{console.error(e);process.exit(1)});
