/* More names the machine level a fresh district actually uses.
   node tools/fresh-level.js */
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

const scaled=await p.evaluate(()=>{
  __g.G.lvl=8;__g.G.unlocked=5;__g.OPT.dyn=true;
  __g.openSheet('travel',{only:['travel'],gFresh:1});
  document.querySelector('[data-gact="6"]').click();
  const more=document.getElementById('sheetIn').innerText;
  document.querySelector('[data-gact="1"]').click();
  const row=n=>[...document.querySelectorAll('[data-go]')].find(e=>e.querySelector('b').textContent===n).innerText;
  const para=[...document.querySelectorAll('#sheetIn p')].find(e=>/fresh district/.test(e.textContent));
  if(para)para.scrollIntoView({block:'center'});
  return {more,moors:row('The Parcel Moors'),cathedral:row('The Glass Cathedral')};
});
check('More says a fresh district is never below your level', /never below your level/.test(scaled.more)&&!/two levels/.test(scaled.more), scaled.more);
check('a level 1 district shows your level', /Machine level 8/.test(scaled.moors), scaled.moors);
check('a higher district keeps its own level', /Machine level 12/.test(scaled.cathedral), scaled.cathedral);

const off=await p.evaluate(()=>{
  __g.OPT.dyn=false;__g.drawSheet();
  document.querySelector('[data-gact="6"]').click();
  const more=document.getElementById('sheetIn').innerText;
  document.querySelector('[data-gact="1"]').click();
  const moors=[...document.querySelectorAll('[data-go]')].find(e=>e.querySelector('b').textContent==='The Parcel Moors').innerText;
  const para=[...document.querySelectorAll('#sheetIn p')].find(e=>/fresh district/.test(e.textContent));
  if(para)para.scrollIntoView({block:'center'});
  return {more,moors};
});
check('scaling off shows the zone level and drops the sentence', /Machine level 1/.test(off.moors)&&!/fresh district/.test(off.more), JSON.stringify(off));

await p.evaluate(()=>{__g.OPT.dyn=true;__g.drawSheet();document.querySelector('[data-gact="6"]').click();const para=[...document.querySelectorAll('#sheetIn p')].find(e=>/fresh district/.test(e.textContent));para.scrollIntoView({block:'center'})});
await p.screenshot({path:'/opt/cursor/artifacts/screenshot_fresh_level.png'});

check('no page errors', !errs.length, errs.join('; '));
await b.close();
console.log(fail.length?'FAIL\n'+fail.join('\n'):'fresh-level ok');
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
