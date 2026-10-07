/* A credit pile's whole credits are what the purse gains.
   node tools/credit-pile.js */
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

const pile=await p.evaluate(()=>{
  const g=__g,P=g.P;
  g.G.credits=0;g.G.adopt=100;g.S.gold=0;g.W.texts=[];
  g.W.drops=[{cr:10.6,x:P.x,y:P.y,t:1}];
  g.update(0.05);
  return {credits:g.G.credits,left:g.W.drops.length,line:g.W.texts.map(t=>t.txt).find(t=>/₡/.test(t))||''};
});
check('a pile of 10.6 pays 10', pile.credits===10&&pile.left===0&&pile.line==='+₡10', JSON.stringify(pile));

const extra=await p.evaluate(()=>{
  const g=__g,P=g.P;
  g.G.credits=0;g.S.gold=40;g.W.texts=[];
  g.W.drops=[{cr:10.6,x:P.x,y:P.y,t:1}];
  g.update(0.05);
  return {credits:g.G.credits,gold:g.S.gold,line:g.W.texts.map(t=>t.txt).find(t=>/₡/.test(t))||''};
});
check('40% extra credits on 10.6 pays 14', extra.credits===14&&extra.gold===40&&extra.line==='+₡14', JSON.stringify(extra));

const dust=await p.evaluate(()=>{
  const g=__g,P=g.P;
  g.G.credits=20;g.S.gold=0;g.W.texts=[];
  g.W.drops=[{cr:0.4,x:P.x,y:P.y,t:1}];
  g.update(0.05);
  return {credits:g.G.credits,left:g.W.drops.length,lines:g.W.texts.map(t=>t.txt)};
});
check('a pile under 1 pays nothing and does not flash', dust.credits===20&&dust.left===0&&!dust.lines.some(t=>/₡/.test(t)), JSON.stringify(dust));

await p.waitForTimeout(250);
const hud=await p.evaluate(()=>document.getElementById('cr').textContent);
check('the purse on screen is the whole credits', hud==='₡20', hud);

check('no page errors', !errs.length, errs.join('; '));
await b.close();
console.log(fail.length?'FAIL\n'+fail.join('\n'):'credit-pile ok');
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
