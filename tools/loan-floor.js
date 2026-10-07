/* Mr. Float's loan pays and collects the whole credits on the line.
   node tools/loan-floor.js */
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

const offer=await p.evaluate(()=>{
  const g=__g;
  g.G.cpi=1.073;g.G.adopt=100;g.G.lvl=1;g.G.credits=0;g.G.debt=0;g.G.scs=700;
  g.talkFloat();
  const btn=[...document.querySelectorAll('#dBtns button')].find(e=>e.textContent.startsWith('Borrow'));
  return {label:btn?btn.textContent:'',open:!document.getElementById('dlg').hidden};
});
check('the borrow line names ₡429', offer.open&&/₡429/.test(offer.label)&&/10% fee/.test(offer.label), JSON.stringify(offer));

await p.screenshot({path:'/opt/cursor/artifacts/screenshot_loan_floor.png'});

const took=await p.evaluate(()=>{
  const btn=[...document.querySelectorAll('#dBtns button')].find(e=>e.textContent.startsWith('Borrow'));
  btn.click();
  return {credits:__g.G.credits,debt:__g.G.debt,log:document.getElementById('log').textContent};
});
check('the purse gains the 429 the line named', took.credits===429&&/You owe ₡471/.test(took.log)&&/Borrowed ₡429/.test(took.log), JSON.stringify(took));
check('the fee stays on that floor', Math.abs(took.debt-471.9)<1e-6, JSON.stringify(took));

await p.waitForTimeout(250);
const hud=await p.evaluate(()=>document.getElementById('cr').textContent);
check('the purse on screen reads ₡429', hud.startsWith('₡429'), hud);

const short=await p.evaluate(()=>{
  /* Interest keeps compounding in play, so pin the balance the line was written for. */
  __g.G.debt=471.9;__g.G.credits=470;__g.talkFloat();
  const btn=[...document.querySelectorAll('#dBtns button')].find(e=>e.textContent.startsWith('Repay'));
  const label=btn?btn.textContent:'';
  btn.click();
  return {label,credits:__g.G.credits,debt:__g.G.debt,log:document.getElementById('log').textContent};
});
check('one credit under the repay line does not clear it', /₡471/.test(short.label)&&short.credits===470&&Math.abs(short.debt-471.9)<1e-6&&/Not enough credits/.test(short.log), JSON.stringify(short));

const paid=await p.evaluate(()=>{
  __g.G.debt=471.9;__g.G.credits=471;__g.talkFloat();
  const btn=[...document.querySelectorAll('#dBtns button')].find(e=>e.textContent.startsWith('Repay'));
  btn.click();
  return {credits:__g.G.credits,debt:__g.G.debt,log:document.getElementById('log').textContent};
});
check('the printed ₡471 clears the debt', paid.credits===0&&paid.debt===0&&/Debt cleared/.test(paid.log), JSON.stringify(paid));

check('no page errors', !errs.length, errs.join('; '));
await b.close();
console.log(fail.length?'FAIL\n'+fail.join('\n'):'loan-floor ok');
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
