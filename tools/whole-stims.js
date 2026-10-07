/* The Stipend counts whole stims at Brenda’s printed price.
   node tools/whole-stims.js */
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

const even=await p.evaluate(()=>{
  const g=__g;
  g.G.lvl=1;g.G.cpi=1;g.G.disc=0;g.G.scs=700;g.G.rep.norm=0;g.G.adopt=20;g.G.ubiT=0;g.G.credits=0;
  g.talkTo('ubi');
  return {body:document.getElementById('dP').textContent,credits:g.G.credits};
});
check('inflation 1 buys 16 stims', /₡500 deposited/.test(even.body)&&/buys 16 stims/.test(even.body)&&!/16\.67/.test(even.body)&&even.credits===500, even.body+' cr '+even.credits);

await p.evaluate(()=>{const b=[...document.querySelectorAll('#dBtns button:not([disabled])')].find(e=>e.textContent==='Thank you, Unity');b&&b.click()});

const odd=await p.evaluate(()=>{
  const g=__g;
  g.G.lvl=1;g.G.cpi=1.07;g.G.disc=0;g.G.ubiT=0;g.G.credits=0;g.G.adopt=20;
  g.talkTo('ubi');
  const body=document.getElementById('dP').textContent;
  const btn=[...document.querySelectorAll('#dBtns button:not([disabled])')].find(e=>e.textContent==='Thank you, Unity');
  btn.click();
  g.talkTo('brenda');
  const trade=[...document.querySelectorAll('#dBtns button:not([disabled])')].find(e=>e.textContent==='Trade');
  trade.click();
  const tab=document.querySelector('[data-tab="shop"]');
  if(tab)tab.click();
  const tag=document.querySelector('[data-buy="stim"] .pr').textContent;
  return {body,credits:g.G.credits,tag};
});
check('a ₡32 tag buys 15 stims', /buys 15 stims/.test(odd.body)&&!/\d+\.\d+ stim/.test(odd.body)&&odd.tag==='₡32'&&odd.credits===500, JSON.stringify(odd));

await p.evaluate(()=>{
  __g.closeSheet();
  __g.G.lvl=1;__g.G.cpi=1;__g.G.disc=0;__g.G.ubiT=0;__g.G.credits=0;__g.G.adopt=20;
  __g.talkTo('ubi');
});
await p.screenshot({path:'/opt/cursor/artifacts/screenshot_whole_stims.png'});

check('no page errors', !errs.length, errs.join('; '));
await b.close();
console.log(fail.length?'FAIL\n'+fail.join('\n'):'whole-stims ok');
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
