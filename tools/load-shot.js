/* The loading screen, caught while it is up. node tools/load-shot.js
   Walks the real path into the world rather than calling fxLoad by hand, so
   the screen is proved to actually appear when a character enters. */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..'),out=path.join(root,'.fx-shots');
(async()=>{
fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+
  fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8')+'</body></html>');
await p.waitForTimeout(500);
await p.evaluate(()=>__g.skipDisc());
await p.waitForTimeout(250);

// watch for the screen from the moment the class is picked
await p.evaluate(()=>{window.__seen=[];const e=document.getElementById('load');
  new MutationObserver(()=>{if(!e.hidden)window.__seen.push(e.querySelector('.fil').style.width||'0%')})
    .observe(e,{attributes:true,subtree:true,attributeFilter:['hidden','class','style']})});

await p.click('[data-cls=scrapper]');
await p.evaluate(()=>{__g.G.pre=2});
let caught=0;
for(let i=0;i<70;i++){
  const st=await p.evaluate(()=>{
    const s=document.getElementById('scene');
    if(s&&!s.hidden){document.getElementById('scSkip').click();return {ui:'scene'}}
    const d=document.getElementById('dlg');
    if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x)x.click();return {ui:'dlg'}}
    const e=document.getElementById('load');
    if(e&&!e.hidden)return {load:true,w:e.querySelector('.fil').style.width,cap:e.querySelector('.cap').textContent};
    return {};
  });
  if(st.load){
    await p.screenshot({path:path.join(out,'loading-'+caught+'.png')});
    console.log('  caught: bar '+st.w+'  "'+st.cap+'"');
    if(++caught>=2)break;
  }
  await p.waitForTimeout(90);
}
const seen=await p.evaluate(()=>window.__seen);
console.log(caught?('shots: '+caught):'  never appeared');
console.log('  observer saw it '+seen.length+' times');
console.log(errs.length?('page errors: '+errs.slice(0,3).join(' | ')):'clean');
await b.close();})();
