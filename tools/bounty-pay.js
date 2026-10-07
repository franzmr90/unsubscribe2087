/* A bounty board's whole credits are what the purse gains.
   node tools/bounty-pay.js */
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

const plain=await p.evaluate(()=>{
  const g=__g;
  g.G.cpi=1.073;g.G.adopt=100;g.G.lvl=1;g.G.credits=0;g.G.sats=0;g.G.rep.anon=0;
  g.G.bounties=[{zi:1,k:'tick',n:12,c:12,sats:4,cr:120}];
  g.openSheet('bounty',{only:['bounty']});
  const btn=document.querySelector('[data-claim="0"]');
  const text=btn?btn.textContent:'';
  const off=btn?btn.disabled:true;
  if(btn&&!btn.disabled)btn.click();
  return {text,off,credits:g.G.credits,sats:g.G.sats,log:document.getElementById('log').textContent};
});
check('a posted 128 is payable as 128', /₡128/.test(plain.text)&&!plain.off&&plain.credits===128&&plain.sats===4&&/₡128/.test(plain.log), JSON.stringify(plain));

const ranked=await p.evaluate(()=>{
  const g=__g;
  g.closeSheet();g.setMode('play');
  g.G.cpi=1.073;g.G.adopt=100;g.G.lvl=1;g.G.credits=0;g.G.sats=0;g.G.rep.anon=10;
  g.G.bounties=[{zi:1,k:'tick',n:12,c:12,sats:4,cr:120}];
  g.openSheet('bounty',{only:['bounty']});
  const btn=document.querySelector('[data-claim="0"]');
  const text=btn?btn.textContent:'';
  if(btn&&!btn.disabled)btn.click();
  return {text,credits:g.G.credits,sats:g.G.sats,log:document.getElementById('log').textContent};
});
check('the board still posts 128 before the standing bonus', /₡128/.test(ranked.text), JSON.stringify(ranked));
check('standing pays the floored 160', ranked.credits===160&&ranked.sats===5&&/₡160/.test(ranked.log), JSON.stringify(ranked));

check('no page errors', !errs.length, errs.join('; '));
await b.close();
console.log(fail.length?'FAIL\n'+fail.join('\n'):'bounty-pay ok');
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
