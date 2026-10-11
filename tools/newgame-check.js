/* Beginning a difficulty must wipe the world and keep the person.
   node tools/newgame-check.js
   This is the load-bearing test for the endgame work: the reset itself is a
   few lines, but something surviving that should not, or a wanderer losing
   something it should keep, is the failure nobody notices until a save is
   already ruined. */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
async function clearUI(p){for(let i=0;i<30;i++){const st=await p.evaluate(()=>{
 const s=document.getElementById('scene');if(s&&!s.hidden){document.getElementById('scSkip').click();return 'x'}
 const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x){x.click();return 'x'}return 'l'}
 return 'c'});if(st==='c')return;await p.waitForTimeout(st==='l'?350:150)}}
(async()=>{
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:430,height:860}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+
  fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8')+'</body></html>');
await p.waitForTimeout(500);await p.evaluate(()=>__g.skipDisc());await p.waitForTimeout(250);
await p.click('[data-cls=scrapper]');await p.evaluate(()=>{__g.G.pre=2});await clearUI(p);

const r=await p.evaluate(()=>{
  const G=__g.G;
  /* a wanderer who has been somewhere */
  G.lvl=47;G.xp=123456;G.sp=5;G.ap=3;G.diffGate=2;G.sats=77;G.credits=4242;
  G.at={mgt:30,ref:20,vit:40,bnd:10};
  G.sk=[5,4,3,2,1,0,0,0,0,0,0,0,0,0,0];
  G.bag=[];for(let i=0;i<7;i++){const it=__g.makeItem(40);if(it)G.bag.push(it)}
  G.stash=[];for(let i=0;i<3;i++){const it=__g.makeItem(40);if(it)G.stash.push(it)}
  for(const sl of ['weapon','armor']){for(let i=0;i<200;i++){const c=__g.makeItem(40,sl);
    if(c&&c.slot===sl){c.id=true;G.eq[sl]=c;break}}}
  G.memos=['a','b'];G.merc={k:'merc',lvl:9};
  /* a world that has been played */
  for(let i=1;i<=25;i++)G.q['q'+i]=3;
  G.sq={one:2,two:3};G.bk={boss4:1,boss5:2};G.ez={3:2,4:1};
  G.unlocked=30;G.tier=2;G.zone=28;G.portal={zi:12,x:1,y:2};
  G.act2=G.act3=G.act4=G.act5=true;G.diff=0;
  const before={lvl:G.lvl,xp:G.xp,sp:G.sp,ap:G.ap,sats:G.sats,credits:G.credits,
    at:JSON.stringify(G.at),sk:JSON.stringify(G.sk),bag:G.bag.length,stash:G.stash.length,
    weapon:G.eq.weapon&&G.eq.weapon.name,armor:G.eq.armor&&G.eq.armor.name,
    memos:G.memos.length,merc:!!G.merc,diffGate:G.diffGate,seenIntro:G.seenIntro};

  const ok=__g.beginDifficulty(1);

  const after={lvl:G.lvl,xp:G.xp,sp:G.sp,ap:G.ap,sats:G.sats,credits:G.credits,
    at:JSON.stringify(G.at),sk:JSON.stringify(G.sk),bag:G.bag.length,stash:G.stash.length,
    weapon:G.eq.weapon&&G.eq.weapon.name,armor:G.eq.armor&&G.eq.armor.name,
    memos:G.memos.length,merc:!!G.merc,diffGate:G.diffGate,seenIntro:G.seenIntro};

  const world={diff:G.diff,questsDone:Object.keys(G.q).filter(k=>G.q[k]>0).length,
    sq:Object.keys(G.sq).length,bk:Object.keys(G.bk).length,ez:Object.keys(G.ez).length,
    unlocked:G.unlocked,tier:G.tier,zone:G.zone,portal:G.portal,
    acts:[G.act2,G.act3,G.act4,G.act5].filter(Boolean).length};

  /* a locked difficulty must be refused */
  G.diffGate=0;
  const refused = __g.beginDifficulty(2)===false && G.diff===1;

  return {ok,before,after,world,refused};
});

const fail=[];
console.log('beginDifficulty returned:',r.ok);
console.log('\nthe wanderer (must be unchanged):');
for(const k of Object.keys(r.before)){
  const same=String(r.before[k])===String(r.after[k]);
  console.log(`  ${k.padEnd(10)} ${String(r.before[k]).slice(0,22).padEnd(24)} ${same?'kept':'LOST -> '+r.after[k]}`);
  if(!same)fail.push(`${k} changed across the reset: ${r.before[k]} -> ${r.after[k]}`);
}
console.log('\nthe world (must be reset):');
const want={diff:1,questsDone:0,sq:0,bk:0,ez:0,unlocked:1,tier:0,zone:0,portal:null,acts:0};
for(const k of Object.keys(want)){
  const got=r.world[k], good=String(got)===String(want[k]);
  console.log(`  ${k.padEnd(11)} ${String(got).padEnd(8)} ${good?'reset':'STILL SET (wanted '+want[k]+')'}`);
  if(!good)fail.push(`${k} survived the reset: ${got}, wanted ${want[k]}`);
}
console.log('\nlocked difficulty refused:',r.refused);
if(!r.ok)fail.push('beginDifficulty(1) returned false with the gate open');
if(!r.refused)fail.push('beginDifficulty(2) was allowed with the gate shut');
if(errs.length)fail.push('page errors: '+errs.slice(0,3).join(' | '));
console.log('');
if(fail.length){console.log('FAIL');fail.forEach(f=>console.log('  - '+f));process.exitCode=1}
else console.log('PASS  the world resets and the wanderer survives');
await b.close();})();
