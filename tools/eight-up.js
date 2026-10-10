/* Eight people in one room and the screen still reads.
   Names do not collide, Thin drops what belongs to other people and keeps your own,
   and the frame does not fall over.
   node tools/eight-up.js */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const fail=[];
const ok=(n,c,d)=>{console.log((c?'  ok   ':'  FAIL ')+n+(d&&!c?'  '+d:''));if(!c)fail.push(n)};
const over=(a,b)=>Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x))
                 *Math.max(0,Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y));
const pairs=bx=>{let n=0;for(let i=0;i<bx.length;i++)for(let j=i+1;j<bx.length;j++)if(over(bx[i],bx[j])>0.5)n++;return n};

(async()=>{
const html=fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8');
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
await p.waitForTimeout(400);
await p.evaluate(()=>{__g.skipDisc();__g.OPT.noWalk=1});
await p.evaluate(()=>{document.getElementById('title').hidden=true;__g.newGame('scrapper');__g.G.pre=0;__g.G.walkNew=0});
for(let i=0;i<8;i++){await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();
  const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}});await p.waitForTimeout(60)}
/* A fighting district, not the town: the town hides other people's marks. */
await p.evaluate(()=>{__g.enter(1);const s=document.getElementById('scene');if(s)s.hidden=true;__g.setMode('play')});
await p.waitForTimeout(250);

/* Seven other people shoulder to shoulder, which is the worst case for names. */
const seven=await p.evaluate(()=>{
  const g=__g,P=g.P,MP=g.MP;
  if(!MP)return {no:1};
  MP.others.length=0;
  const names=['Wren','Kestrel','Gramps','Sister Null','Mr Float','Nonce','Brenda'];
  for(let i=0;i<7;i++)MP.others.push({uid:'u'+i,name:names[i],lvl:20+i,cls:'scrapper',
    x:P.x+0.5+(i%4)*0.45,y:P.y+0.5+((i/4)|0)*0.45,dir:0,hp:80,hpm:100});
  g.render();
  return {n:MP.others.length,boxes:g.LBOX.map(r=>({x:r.x,y:r.y,w:r.w,h:r.h}))};
});
if(seven.no){console.log('  (multiplayer is not wired into this build)');process.exit(0)}
ok('seven other people are on screen', seven.n===7, String(seven.n));
ok('their names claim room', seven.boxes.length>=7, String(seven.boxes.length));
ok('no two names collide with eight people in one spot', pairs(seven.boxes)===0, pairs(seven.boxes)+' pairs');

/* Thin is the readability lever: it keeps what is yours and drops what is theirs. */
const thin=await p.evaluate(()=>{
  const g=__g;
  g.OPT.fx='full';
  const mine=g.fxShow({k:'orbit'}), theirsFull=g.fxShow({k:'orbit',remote:1});
  g.OPT.fx='thin';
  const mineThin=g.fxShow({k:'orbit'}), theirsThin=g.fxShow({k:'orbit',remote:1});
  const markThin=g.fxShow({k:'mark'});
  g.OPT.fx='full';
  return {mine,theirsFull,mineThin,theirsThin,markThin};
});
ok('on Full you see everybody', thin.mine&&thin.theirsFull, JSON.stringify(thin));
ok('on Thin another player\'s cast is dropped', thin.theirsThin===false, JSON.stringify(thin));
ok('on Thin your own mark is kept', thin.markThin===true, JSON.stringify(thin));

/* Frame cost: one player against eight, same room. */
const prof=await p.evaluate(async()=>{
  const g=__g,MP=g.MP;
  const time=()=>{const t=[];for(let i=0;i<60;i++){const a=performance.now();g.render();t.push(performance.now()-a)}
    t.sort((x,y)=>x-y);return {med:+t[30].toFixed(2),p95:+t[57].toFixed(2)}};
  const saved=MP.others.slice();
  MP.others.length=0;const one=time();
  MP.others.push(...saved);const eight=time();
  return {one,eight};
});
console.log('  frame ms  one: med '+prof.one.med+' p95 '+prof.one.p95+'   eight: med '+prof.eight.med+' p95 '+prof.eight.p95);
ok('a frame with eight people still fits in 33ms (30fps)', prof.eight.med<33, 'median '+prof.eight.med+'ms');
ok('eight people do not cost more than four times one', prof.eight.med<=Math.max(4,prof.one.med*4), prof.one.med+' -> '+prof.eight.med);

ok('no page errors', errs.length===0, errs.join(' | '));
await b.close();
if(fail.length){console.log('\nFAIL '+fail.length);process.exit(1)}
console.log('\neight-up ok');
})();
