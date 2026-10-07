/* Ines's whole credits are what the purse gains.
   node tools/ines-pay.js */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');

(async()=>{
const html=fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8');
const fail=[];
const check=(n,ok,d)=>{if(!ok)fail.push(n+(d?': '+d:''));};
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
await p.waitForTimeout(400);
await p.evaluate(()=>{__g.skipDisc();__g.OPT.noWalk=1});
await p.evaluate(()=>{document.getElementById('title').hidden=true;__g.newGame('scrapper');__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1});
for(let i=0;i<10;i++){
  await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}});
  await p.waitForTimeout(60);
}
await p.evaluate(()=>__g.enter(0));
await p.waitForTimeout(150);
await p.evaluate(()=>{const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()};__g.setMode('play')});

const paid=await p.evaluate(()=>{
  const g=__g;
  g.G.cpi=1.073;g.G.adopt=100;g.G.credits=0;g.G.sqInes=null;
  const step=g.SQ.carer.steps.find(s=>s.choices);
  step.choices[0][1]();
  return {credits:g.G.credits,flag:g.G.sqInes,log:document.getElementById('log').textContent};
});
check('Ines pays the 429 her line names', paid.credits===429&&paid.flag==='paid'&&/You take ₡429/.test(paid.log), JSON.stringify(paid));

const refused=await p.evaluate(()=>{
  const g=__g;
  g.G.credits=50;g.G.sqInes=null;g.G.unseen=0;
  const step=g.SQ.carer.steps.find(s=>s.choices);
  step.choices[1][1]();
  return {credits:g.G.credits,flag:g.G.sqInes,unseen:g.G.unseen};
});
check('refusing still leaves the purse and marks the gift', refused.credits===50&&refused.flag==='gift'&&refused.unseen===1, JSON.stringify(refused));

check('no page errors', !errs.length, errs.join('; '));
await b.close();
console.log(fail.length?'FAIL\n'+fail.join('\n'):'ines-pay ok');
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
