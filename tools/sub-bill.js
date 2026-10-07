/* A subscription bill's whole credits are what the purse pays.
   node tools/sub-bill.js */
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

const one=await p.evaluate(()=>{
  const g=__g;
  g.G.cpi=1.073;g.G.adopt=100;g.G.credits=12;g.G.charmOff=0;
  const c=g.mkCharm(1);c.on=true;g.G.charms=[c];
  g.openSheet('items');
  const line=[...document.querySelectorAll('#sheet h3')].map(n=>n.textContent).find(t=>/billing/.test(t))||'';
  g.G.chT=0;g.W.drops=[];
  g.update(0.05);
  return {line,credits:g.G.credits,off:!!g.G.charmOff,on:g.G.charms.filter(x=>x.on).length};
});
check('a bill of 12 is covered by 12', /₡12/.test(one.line)&&!/LAPSED/.test(one.line)&&one.credits===0&&!one.off&&one.on===1, JSON.stringify(one));

const short=await p.evaluate(()=>{
  const g=__g;
  g.G.cpi=1.073;g.G.adopt=100;g.G.credits=11;g.G.charmOff=0;g.G.chT=0;g.W.drops=[];
  g.update(0.05);
  return {credits:g.G.credits,off:!!g.G.charmOff,log:document.getElementById('log').textContent};
});
check('11 does not cover a bill of 12', short.credits===11&&short.off&&/cannot cover/.test(short.log), JSON.stringify(short));

const two=await p.evaluate(()=>{
  const g=__g;
  g.closeSheet();g.setMode('play');
  g.G.cpi=1.073;g.G.adopt=100;g.G.credits=25;g.G.charmOff=0;
  const a=g.mkCharm(1),c=g.mkCharm(1);a.on=c.on=true;g.G.charms=[a,c];
  g.openSheet('items');
  const line=[...document.querySelectorAll('#sheet h3')].map(n=>n.textContent).find(t=>/billing/.test(t))||'';
  g.G.chT=0;g.W.drops=[];
  g.update(0.05);
  return {line,credits:g.G.credits,off:!!g.G.charmOff};
});
check('two running bill 25 and 25 covers them', /₡25/.test(two.line)&&two.credits===0&&!two.off, JSON.stringify(two));

check('no page errors', !errs.length, errs.join('; '));
await b.close();
console.log(fail.length?'FAIL\n'+fail.join('\n'):'sub-bill ok');
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
