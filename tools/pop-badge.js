/* The corner badge closes a popup stacked on a menu, and an item shows its
   picture beside it. node tools/pop-badge.js */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..'),out=path.join(root,'.fx-shots');
async function clearUI(p){for(let i=0;i<30;i++){const st=await p.evaluate(()=>{
 const s=document.getElementById('scene');if(s&&!s.hidden){document.getElementById('scSkip').click();return 'x'}
 const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x){x.click();return 'x'}return 'l'}
 return 'c'});if(st==='c')return;await p.waitForTimeout(st==='l'?350:150)}}
(async()=>{
fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+
  fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8')+'</body></html>');
await p.waitForTimeout(500);await p.evaluate(()=>__g.skipDisc());await p.waitForTimeout(250);
await p.click('[data-cls=scrapper]');await p.evaluate(()=>{__g.G.pre=2});await clearUI(p);
await p.waitForTimeout(1700);await clearUI(p);await clearUI(p);
const fail=[];

await p.evaluate(()=>{const G=__g.G;G.lvl=60;G.god=true;__g.calc();
  G.bag=[];for(let i=0;i<10;i++){const it=__g.makeItem(45);if(it){it.id=true;G.bag.push(it)}}
  // something worn, so the compare card has two columns to fill
  for(const sl of ['weapon','armor']){for(let i=0;i<200;i++){const c=__g.makeItem(45,sl);
    if(c&&c.slot===sl){c.id=true;G.eq[sl]=c;break}}}
  __g.calc();__g.openSheet('items')});
await p.waitForTimeout(400);

// open the stacked popup by selecting a bag item
await p.evaluate(()=>{const b=document.querySelector('.cell[data-bag]');if(b)b.click()});
await p.waitForTimeout(400);
let st=await p.evaluate(()=>{const e=document.getElementById('pop'),x=document.getElementById('popX');
  return {popOpen:e&&!e.hidden, badge:!!x, badgeVisible:x?getComputedStyle(x).display!=='none':false,
    icons:document.querySelectorAll('#popIn img.cmpIc').length,
    oldClose:[...document.querySelectorAll('#popIn button')].filter(b=>b.textContent.trim()==='Close').length}});
console.log('popup open        :', st.popOpen);
console.log('badge present     :', st.badge, ' visible:', st.badgeVisible);
console.log('item pictures in it:', st.icons);
console.log('old Close buttons :', st.oldClose);
if(!st.popOpen)fail.push('the popup did not open, so nothing below was tested');
if(!st.badgeVisible)fail.push('the corner badge is not visible while a popup is up');
if(st.icons<1)fail.push('no item picture in the popup');
if(st.oldClose>0)fail.push('a Close button is still inside the popup');
if(st.popOpen)await p.screenshot({path:path.join(out,'pop-badge.png')});

// the badge must actually close it
if(st.popOpen){
  await p.click('#popX');
  await p.waitForTimeout(350);
  const after=await p.evaluate(()=>{const e=document.getElementById('pop');return e?e.hidden:null});
  console.log('closed by badge   :', after);
  if(after!==true)fail.push('the badge did not close the popup');
}
// and the badge must not linger once it is closed
const gone=await p.evaluate(()=>{const x=document.getElementById('popX');
  return x?getComputedStyle(x).display==='none':true});
console.log('badge hidden after:', gone);
if(!gone)fail.push('the badge is still on screen with no popup under it');

if(errs.length)fail.push('page errors: '+errs.slice(0,3).join(' | '));
console.log('');
if(fail.length){console.log('FAIL');fail.forEach(f=>console.log('  - '+f));process.exitCode=1}
else console.log('PASS');
await b.close();})();
