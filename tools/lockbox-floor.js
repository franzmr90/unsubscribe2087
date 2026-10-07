/* The lockbox lines are the whole credits that move.
   node tools/lockbox-floor.js */
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

const half=await p.evaluate(()=>{
  const g=__g;
  g.G.cpi=1.073;g.G.adopt=100;g.G.credits=101;g.ACC.cr=0;
  g.openSheet('stash',{only:['stash']});
  document.querySelector('[data-acc="cihalf"]').click();
  const line=[...document.querySelectorAll('#sheet h3')].map(n=>n.textContent).find(t=>/Credits/.test(t))||'';
  document.querySelector('[data-acc="coall"]').click();
  const after=[...document.querySelectorAll('#sheet h3')].map(n=>n.textContent).find(t=>/Credits/.test(t))||'';
  return {line,credits:g.G.credits,box:g.ACC.cr,after};
});
check('half of 101 leaves 51 and the box shows 45', /₡45 in the box/.test(half.line)&&/₡51 on you/.test(half.line), JSON.stringify(half));
check('take-all pays the 45 on the line', half.credits===96&&half.box===0&&/₡0 in the box/.test(half.after), JSON.stringify(half));

const all=await p.evaluate(()=>{
  const g=__g;
  g.closeSheet();g.setMode('play');
  g.G.cpi=1.073;g.G.adopt=100;g.G.credits=101;g.ACC.cr=0;
  g.openSheet('stash',{only:['stash']});
  document.querySelector('[data-acc="ciall"]').click();
  const line=[...document.querySelectorAll('#sheet h3')].map(n=>n.textContent).find(t=>/Credits/.test(t))||'';
  document.querySelector('[data-acc="coall"]').click();
  return {line,credits:g.G.credits,box:g.ACC.cr};
});
check('all of 101 shows 90 and pays 90', /₡90 in the box/.test(all.line)&&/₡0 on you/.test(all.line)&&all.credits===90&&all.box===0, JSON.stringify(all));

check('no page errors', !errs.length, errs.join('; '));
await b.close();
console.log(fail.length?'FAIL\n'+fail.join('\n'):'lockbox-floor ok');
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
