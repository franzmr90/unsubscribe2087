/* The aura swap ring must state the reach that aura actually has.
   node tools/aura-ring.js
   It used to push one ring at a flat 3.2 in orange for all three, which
   overstates toxic by 45% and understates the other two at every rank. */
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
await p.evaluate(()=>{const G=__g.G;G.lvl=90;G.god=true;__g.ACC.maxi=1;G.cls='maxi';__g.calc()});
await p.evaluate(()=>__g.enter(1));await clearUI(p);
await p.evaluate(()=>__g.setMode('play'));await p.waitForTimeout(1700);await clearUI(p);

const res=await p.evaluate(()=>{
  const W=__g.W,P=__g.P,out=[];
  for(const i of [3,4,7]){
    for(const L of [1,5,20]){
      if(__g.P.aura)__g.maxiSet(__g.P.aura.i,L);   // clear any held aura
      W.fx.length=0;
      __g.maxiSet(i,L);
      const ring=W.fx.filter(f=>f.k==='ring').pop();
      out.push({i,L,drawn:ring?ring.r:null,col:ring?ring.col:null,
                want:__g.auraVisR(i,L),wantCol:__g.AURACOL[i]});
      if(__g.P.aura)__g.maxiSet(i,L);
    }
  }
  return out;
});
const fail=[];
console.log('aura  rank   ring r   true r    ring col    true col');
for(const r of res){
  const ok=r.drawn!=null&&Math.abs(r.drawn-r.want)<0.01&&r.col===r.wantCol;
  console.log(`  ${r.i}    ${String(r.L).padStart(2)}   ${String(r.drawn).padStart(6)}  ${String(r.want).padStart(6)}   ${String(r.col).padEnd(10)} ${r.wantCol}  ${ok?'':'  <-- WRONG'}`);
  if(r.drawn==null)fail.push(`aura ${r.i} rank ${r.L}: no ring drawn`);
  else{
    if(Math.abs(r.drawn-r.want)>=0.01)fail.push(`aura ${r.i} rank ${r.L}: ring states ${r.drawn} for a reach of ${r.want}`);
    if(r.col!==r.wantCol)fail.push(`aura ${r.i} rank ${r.L}: ring is ${r.col}, the field is ${r.wantCol}`);
  }
}
if(errs.length)fail.push('page errors: '+errs.slice(0,3).join(' | '));
console.log('');
if(fail.length){console.log('FAIL');fail.forEach(x=>console.log('  - '+x));process.exitCode=1}
else console.log('PASS  every swap ring states its own aura');
await b.close();})();
