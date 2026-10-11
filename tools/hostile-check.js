/* Hostility has to survive a reconnect.
   node tools/hostile-check.js
   The server keeps the flags and ships them on every roster. The browser used to trust
   only the declarations it watched arrive, so after a reconnect -- or for anyone who
   joined after the fact -- the name went red but no stand-in was ever built, and the
   blow passed straight through. These cases pin both halves to the roster. */
const {chromium}=require('playwright');
const path=require('path');
const URL='file://'+path.join(__dirname,'..','dist/Unsubscribe-2087-standalone.html');
async function clearUI(p){for(let i=0;i<40;i++){const st=await p.evaluate(()=>{
 const s=document.getElementById('scene');if(s&&!s.hidden){const b=document.getElementById('scSkip');if(b)b.click();return 'x'}
 const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x){x.click();return 'x'}return 'l'}
 return 'c'});if(st==='c')return;await p.waitForTimeout(st==='l'?350:150)}}
const out=[];let bad=0;
const ok=(n,c,note)=>{out.push((c?'  ok   ':'  FAIL ')+n+(note?'   '+note:''));if(!c)bad++};
(async()=>{
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:430,height:860}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(URL);await p.waitForTimeout(600);
await p.evaluate(()=>__g.skipDisc());await p.waitForTimeout(250);
await p.click('[data-cls=scrapper]');await p.evaluate(()=>{__g.G.pre=2});await clearUI(p);await p.waitForTimeout(1500);await clearUI(p);

/* a district, not a town: town is safe and builds no stand-in at all */
await p.evaluate(()=>__g.enter(1));await clearUI(p);

const setup=(mine,theirs)=>p.evaluate(([mine,theirs])=>{
  const MP=__mp.MP;
  MP.me={uid:'me',name:'Me'};
  MP.hostile=mine?{them:1}:{};
  MP.roster=[{uid:'me',name:'Me',cls:'scrapper',lvl:20,hostile:theirs==='mine'?['them']:[]},
             {uid:'them',name:'Them',cls:'anon',lvl:20,hostile:theirs==='theirs'?['me']:[]}];
  MP.others=[{uid:'them',name:'Them',cls:'anon',lvl:20,x:__g.P.x+2,y:__g.P.y,hp:100,hpm:100}];
  /* W.ents is rebuilt from the flags each tick */
  __mp.mpSyncEnts();
  return {flag:__mp.mpHostileTo('them'),
          stand:__g.W.ents.filter(e=>e.mp==='them').length};
},[mine,theirs]);

let r=await setup(true,null);
ok('a declaration this browser saw still works',r.flag&&r.stand===1,JSON.stringify(r));

r=await setup(false,'theirs');
ok('they declared and we reconnected: attackable',r.flag&&r.stand===1,JSON.stringify(r));

r=await setup(false,'mine');
ok('we declared and we reconnected: attackable',r.flag&&r.stand===1,JSON.stringify(r));

r=await setup(false,null);
ok('nobody declared: no stand-in',!r.flag&&r.stand===0,JSON.stringify(r));

/* town stays safe whatever the flags say */
await p.evaluate(()=>__g.enter(0));await clearUI(p);
r=await setup(true,'theirs');
ok('town is still safe',r.flag&&r.stand===0,JSON.stringify(r));

console.log(out.join('\n'));
if(errs.length)console.log('\npage errors:\n  '+errs.join('\n  '));
console.log(bad?'\n'+bad+' FAILED':'\nall passed');
await b.close();process.exit(bad||errs.length?1:0)})();
