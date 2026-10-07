/* Hazard Pay prints the whole credits a throw kill already pays.
   node tools/hazard-pay.js */
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
await p.evaluate(()=>{document.getElementById('title').hidden=true;__g.newGame('courier');__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1});
for(let i=0;i<10;i++){
  await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}});
  await p.waitForTimeout(60);
}
await p.evaluate(()=>__g.enter(0));
await p.waitForTimeout(150);
await p.evaluate(()=>{const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()};__g.setMode('play')});

const pay1=await p.evaluate(()=>{
  const g=__g;
  g.G.adopt=100;
  g.G.cpi=1.5;
  g.G.sk[13]=1;g.G.pas=[13];g.calc();
  const before=g.G.credits;
  const e=g.spawn('tick',g.P.x+1,g.P.y,{});
  e.hp=0;g.P.fromThrow=1;g.kill(e);g.P.fromThrow=0;
  return {delta:g.G.credits-before,sl:g.sl(13),haz:g.P.hazMf};
});
check('inflation 1.5 rank 1 pays 6', pay1.delta===6&&pay1.sl===1&&pay1.haz===0, JSON.stringify(pay1));

const card=await p.evaluate(()=>{
  __g.openSheet('skills',{only:['skills']});
  document.querySelector('[data-node="13"]').click();
  const t=document.getElementById('popIn').innerText;
  document.querySelector('#popIn .nm').scrollIntoView({block:'center'});
  return t;
});
check('the card names 6 credits and +6% find', /pays 6 extra credits/.test(card)&&/\+6% magic find/.test(card)&&!/pays 4 extra/.test(card), card);

const pay2=await p.evaluate(()=>{
  const g=__g;
  g.closeSheet();
  g.G.cpi=1.25;
  g.G.sk[13]=2;g.G.pas=[2,13];g.calc();
  const before=g.G.credits;
  const e=g.spawn('tick',g.P.x+1,g.P.y,{});
  e.hp=0;g.P.fromThrow=1;g.kill(e);g.P.fromThrow=0;
  g.openSheet('skills',{only:['skills']});
  document.querySelector('[data-node="13"]').click();
  const t=document.getElementById('popIn').innerText;
  return {delta:g.G.credits-before,sl:g.sl(13),t};
});
check('a 6.25 payout floors to 6', pay2.delta===6&&pay2.sl===2, JSON.stringify({delta:pay2.delta,sl:pay2.sl}));
check('the card floors the same 6 and prints +12% find', /pays 6 extra credits/.test(pay2.t)&&/\+12% magic find/.test(pay2.t)&&!/pays 5 extra/.test(pay2.t), pay2.t);

const dash=await p.evaluate(()=>{
  const g=__g;
  const before=g.G.credits;
  const e=g.spawn('tick',g.P.x+1,g.P.y,{});
  e.hp=0;g.P.fromThrow=0;g.kill(e);
  return g.G.credits-before;
});
check('a kill that was not a throw pays nothing', dash===0, String(dash));

const sim=await p.evaluate(()=>{
  const g=__g;
  const before=g.G.credits;
  g.W.z.sim=1;
  const e=g.spawn('tick',g.P.x+1,g.P.y,{});
  e.hp=0;g.P.fromThrow=1;g.kill(e);g.P.fromThrow=0;
  const delta=g.G.credits-before;
  g.W.z.sim=0;
  return delta;
});
check('the simulator pays nothing', sim===0, String(sim));

const mast=await p.evaluate(()=>{
  const g=__g;
  g.G.cpi=1.5;
  g.G.sk[13]=10;g.G.pas=[13];g.calc();
  const before=g.G.credits;
  const e=g.spawn('tick',g.P.x+1,g.P.y,{});
  e.hp=0;g.P.fromThrow=1;g.kill(e);g.P.fromThrow=0;
  g.drawSheet();
  document.querySelector('[data-node="13"]').click();
  const t=document.getElementById('popIn').innerText;
  return {delta:g.G.credits-before,sl:g.sl(13),t};
});
check('mastery pays the twelve-rank floor', mast.delta===22&&mast.sl===12, JSON.stringify({delta:mast.delta,sl:mast.sl}));
check('the mastered card names 22 credits', /pays 22 extra credits/.test(mast.t)&&/\+72% magic find/.test(mast.t), mast.t);

await p.evaluate(()=>{
  __g.G.cpi=1.5;__g.G.sk[13]=1;__g.G.pas=[13];__g.calc();__g.drawSheet();
  document.querySelector('[data-node="13"]').click();
  document.querySelector('#popIn .nm').scrollIntoView({block:'center'});
});
await p.screenshot({path:'/opt/cursor/artifacts/screenshot_hazard_pay.png'});

check('no page errors', !errs.length, errs.join('; '));
await b.close();
console.log(fail.length?'FAIL\n'+fail.join('\n'):'hazard-pay ok');
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
