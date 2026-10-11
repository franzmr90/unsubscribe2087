/* The game is a thing you create and a thing that ends.
   node tools/lifecycle-check.js
   Walks the whole loop: title -> create -> play -> leave -> title, then the
   final boss ending -> credits -> title, and checks that the difficulty is
   bound to the game rather than settable from a menu. Runs over file:// so
   localStorage works; setContent blocks it and every save step reads false. */
const {chromium}=require('playwright');
const path=require('path');
const root=path.join(__dirname,'..');
const URL='file://'+path.join(root,'dist/Unsubscribe-2087-standalone.html');
async function clearUI(p){for(let i=0;i<40;i++){const st=await p.evaluate(()=>{
 const s=document.getElementById('scene');if(s&&!s.hidden){const b=document.getElementById('scSkip');if(b)b.click();return 'x'}
 const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x){x.click();return 'x'}return 'l'}
 return 'c'});if(st==='c')return;await p.waitForTimeout(st==='l'?350:150)}}
const out=[];let bad=0;
function ok(n,c,note){out.push((c?'  ok   ':'  FAIL ')+n+(note?'   '+note:''));if(!c)bad++}
(async()=>{
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:430,height:860}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(URL);await p.waitForTimeout(600);
await p.evaluate(()=>__g.skipDisc());await p.waitForTimeout(250);
await p.click('[data-cls=scrapper]');await p.evaluate(()=>{__g.G.pre=2});await clearUI(p);

/* 1. a character that has been somewhere, saved into slot 1 */
await p.evaluate(()=>{const G=__g.G;G.lvl=44;G.diffGate=1;G.unlocked=20;G.tier=1;
  for(let i=1;i<=20;i++)G.q['q'+i]=3;__g.save(true)});

/* 2. leaving the world lands on the title, with the game ended */
let r=await p.evaluate(()=>{__g.toTitle();return{mode:__g.mode,title:!document.getElementById('title').hidden,
  hud:document.getElementById('hud').hidden,inGame:__g.G.inGame,world:!!__g.W}});
ok('leaving play lands on the title',r.mode==='title'&&r.title&&r.hud,JSON.stringify(r));
ok('the game it left is over',!r.inGame&&!r.world);

/* 3. the create panel is the only way back in */
r=await p.evaluate(()=>{__g.openCreate(0);const el=document.getElementById('mkgame');
  return{open:!el.hidden,slots:document.getElementById('slots').hidden,
   opts:[...el.querySelectorAll('[data-mkdiff]')].map(b=>b.dataset.mkdiff+':'+(b.disabled?'locked':'open'))}});
ok('the create panel opens',r.open&&r.slots,r.opts.join(' '));
ok('a locked difficulty stays locked',r.opts[2]==='2:locked');

/* 4. creating a game on Hard resets the world, keeps the wanderer */
r=await p.evaluate(()=>{const G=__g.G;const lvl=G.lvl;
  const made=__g.createGame(1);
  return{made,lvl:G.lvl===lvl,diff:G.diff,unlocked:G.unlocked,tier:G.tier,q1:G.q.q1,inGame:G.inGame}});
ok('create on Hard is allowed',r.made&&r.diff===1);
ok('the wanderer is kept',r.lvl);
ok('the world goes back to zero',r.unlocked===1&&r.tier===0&&r.q1===0,JSON.stringify(r));
ok('the new game is running',!!r.inGame);

/* 5. nothing in Options can change it */
r=await p.evaluate(()=>{__g.startPlay();__g.openSheet('opts',{});return 1});
await p.waitForTimeout(250);
r=await p.evaluate(()=>{const s=document.getElementById('sheet');
  const f=[...s.querySelectorAll('[data-fight],[data-tab]')].find(b=>/fight/i.test(b.dataset.tab||b.dataset.fight||''));
  if(f)f.click();return 1});
await p.waitForTimeout(250);
r=await p.evaluate(()=>({setters:document.querySelectorAll('#sheet [data-diff]').length,
  live:document.querySelectorAll('#sheet .row button:not([disabled])').length}));
ok('the difficulty setter is gone',r.setters===0,'data-diff buttons: '+r.setters);
await p.evaluate(()=>__g.closeSheet());

/* 6. the ending marks the clear, rolls credits and comes back to the title */
r=await p.evaluate(()=>{__g.G.ending='leave';__g.G.adopt=70;__g.G.kills=1234;__g.G.deaths=5;__g.G.time=4000;
  const sl=__g.creditSlides(true);return{n:sl.length,last:sl[sl.length-1].title,
   ledger:(sl.find(s=>s.title==='THE LEDGER')||{}).text||''}});
ok('the credits have slides',r.n>=5,r.n+' slides');
ok('the credits end on THE END',r.last==='THE END');
ok('the ledger names the run',/level 44/.test(r.ledger)&&/Hard/.test(r.ledger)&&/1234/.test(r.ledger),r.ledger.slice(0,120));

await p.evaluate(()=>__g.gameOver());
r=await p.evaluate(()=>({cleared:__g.hasCleared(1),mode:__g.mode}));
ok('the difficulty is recorded as cleared',r.cleared,'mode '+r.mode);
for(let i=0;i<40&&(await p.evaluate(()=>__g.mode))==='scene';i++){
  await p.evaluate(()=>{const b=document.getElementById('scSkip');if(b)b.click()});await p.waitForTimeout(120)}
r=await p.evaluate(()=>({mode:__g.mode,title:!document.getElementById('title').hidden,inGame:__g.G.inGame}));
ok('the credits land on the title',r.mode==='title'&&r.title,JSON.stringify(r));
ok('and that game is over',!r.inGame);

/* 7. the cleared difficulty reads back in the create panel */
r=await p.evaluate(()=>{__g.openCreate(0);
  return[...document.querySelectorAll('#mkgame [data-mkdiff]')].map(b=>b.textContent.trim().slice(0,40))});
ok('Hard shows as cleared',/cleared/i.test(r[1]),r.join(' | '));
ok('Brutal is now open',!(await p.evaluate(()=>document.querySelector('#mkgame [data-mkdiff="2"]').disabled)));

console.log(out.join('\n'));
if(errs.length)console.log('\npage errors:\n  '+errs.join('\n  '));
console.log(bad?'\n'+bad+' FAILED':'\nall passed');
await b.close();process.exit(bad||errs.length?1:0)})();
