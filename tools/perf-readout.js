/* The frame readout is off for players and on when asked for.
   node tools/perf-readout.js
   It exists because the only honest frame number comes off a real phone, so the
   thing that must be true is narrow: invisible by default, visible with ?perf=1,
   remembered after that, and reporting numbers that are actually moving. */
const {chromium}=require('playwright');
const path=require('path');
const root=path.join(__dirname,'..');
const F='file://'+path.join(root,'dist/Unsubscribe-2087-standalone.html');
async function clearUI(p){for(let i=0;i<50;i++){const st=await p.evaluate(()=>{
 const s=document.getElementById('scene');if(s&&!s.hidden){const b=document.getElementById('scSkip');if(b)b.click();return 'x'}
 const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x){x.click();return 'x'}return 'l'}
 return 'c'});if(st==='c')return;await p.waitForTimeout(st==='l'?300:120)}}
const out=[];let bad=0;
const ok=(n,c,d)=>{out.push((c?'  ok   ':'  FAIL ')+n+(d?'   '+d:''));if(!c)bad++};
(async()=>{
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:430,height:860}});
const errs=[];

/* 1. a player who did not ask sees nothing */
let p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto(F);await p.waitForTimeout(900);
ok('off by default',await p.evaluate(()=>document.getElementById('perf').hidden));
ok('and costs nothing to be off',await p.evaluate(()=>!__g.PERF));
await p.close();

/* 2. ?perf=1 turns it on and it reports live numbers */
p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto(F+'?perf=1');await p.waitForTimeout(700);
await p.evaluate(()=>__g.skipDisc());await p.waitForTimeout(200);
await p.click('[data-cls=scrapper]');await p.evaluate(()=>{__g.G.pre=2});await clearUI(p);await p.waitForTimeout(1800);await clearUI(p);
await p.evaluate(()=>__g.enter(1));await clearUI(p);await p.waitForTimeout(1200);
let r=await p.evaluate(()=>({shown:!document.getElementById('perf').hidden,
  txt:document.getElementById('perf').textContent,n:__g.PERF?__g.PERF.frames.length:0}));
ok('?perf=1 shows it',r.shown);
ok('it is sampling frames',r.n>20,r.n+' frames held');
ok('it reports fps and a median',/fps/.test(r.txt)&&/ms/.test(r.txt),JSON.stringify(r.txt.slice(0,46)));
const fps=parseFloat(r.txt);
ok('the fps is a real number',fps>0&&fps<1000,'fps '+fps);

/* 3. tapping expands to the report meant to be screenshotted */
await p.click('#perf');await p.waitForTimeout(400);
r=await p.evaluate(()=>document.getElementById('perf').textContent);
for(const k of ['worst','update','render','ents','zone','sheets','screen','heap','build'])
  ok('the report carries "'+k+'"',r.indexOf(k)>=0);
await p.screenshot({path:root+'/.fx-shots/perf-readout.png',clip:{x:0,y:100,width:430,height:290}});

/* 4. it is remembered, so a phone does not retype the URL */
const p2=await ctx.newPage();await p2.goto(F);await p2.waitForTimeout(900);
ok('it stays on for that browser',await p2.evaluate(()=>!document.getElementById('perf').hidden));
await p2.close();
/* 5. and ?perf=0 puts it away again */
const p3=await ctx.newPage();await p3.goto(F+'?perf=0');await p3.waitForTimeout(800);
ok('?perf=0 turns it off',await p3.evaluate(()=>document.getElementById('perf').hidden));
const p4=await ctx.newPage();await p4.goto(F);await p4.waitForTimeout(800);
ok('and it stays off',await p4.evaluate(()=>document.getElementById('perf').hidden));

console.log(out.join('\n'));
if(errs.length)console.log('\npage errors:\n  '+errs.slice(0,4).join('\n  '));
console.log(bad?'\n'+bad+' FAILED':'\nall passed');
await b.close();process.exit(bad||errs.length?1:0)})();
