/* Boot + walk smoke test. Usage: node tools/smoke.js [outdir]
   Loads dist/unsubscribe.html under setContent (so no localStorage), forces the
   player through every act's zones and reports any page error. */
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const OUT=process.argv[2];
(async()=>{
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:390,height:800}});
const errs=[];p.on('pageerror',e=>errs.push(e.message+' @ '+(e.stack||'').split('\n')[1]));
const root=path.join(__dirname,'..');
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8')+'</body></html>');
await p.waitForTimeout(600);
await p.evaluate(()=>__g.skipDisc());await p.waitForTimeout(260);
await p.click('[data-cls=scrapper]');await p.waitForTimeout(800);
const sk=async(n=14)=>{for(let i=0;i<n;i++){await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}});await p.waitForTimeout(130)}};
await sk(12);
await p.evaluate(()=>{const G=__g.G;G.god=true;G.lvl=90;G.unlocked=34;G.act2=G.act3=G.act4=G.act5=true;G.sats=900;for(let i=1;i<=25;i++)G.q['q'+i]=3});
let n=0;
for(let z=0;z<34;z++){
  await p.evaluate(z=>__g.enter(z),z);await sk(5);
  await p.evaluate(()=>{for(let i=0;i<60;i++)if(__g.mode==='play')__g.update(1/60)});
  const ok=await p.evaluate(()=>!!(__g.W&&__g.P));
  if(!ok)errs.push('zone '+z+': no world');else n++;
  if(OUT)await p.screenshot({path:OUT+'/z'+String(z).padStart(2,'0')+'.png'});
}
// every sheet tab renders. Clear any dialog first: openSheet draws nothing behind one,
// which reads as a broken tab.
await sk(8);
for(const t of ['char','items','skills','web','quests','story','codex','opts']){
  await p.evaluate(t=>__g.openSheet(t,{}),t);await p.waitForTimeout(220);
  const len=await p.evaluate(()=>document.getElementById('sheetIn').innerHTML.length);
  if(len<200)errs.push('tab '+t+' rendered '+len+' chars');
  await p.evaluate(()=>__g.closeSheet());await p.waitForTimeout(120);
}
console.log('zones ok:',n+'/34');
console.log(errs.length?'ERRORS:\n'+errs.slice(0,12).join('\n'):'no errors');
await b.close();process.exit(errs.length?1:0)})();
