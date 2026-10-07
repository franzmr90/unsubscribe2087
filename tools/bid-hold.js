/* A resting bid holds the whole credits the line names.
   node tools/bid-hold.js */
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

const short=await p.evaluate(()=>{
  const g=__g;
  g.G.adopt=100;g.G.rep.btc=0;g.G.sats=5;g.G.credits=98;
  g.mktInit();g.G.mkt.p=103;g.G.mkt.r=103/g.mktFair();g.G.mkt.ord=[];
  g.openSheet('sats',{only:['sats']});
  document.querySelector('[data-mkq="1"]').click();
  g.G.mkt.p=103;g.drawSheet();
  document.querySelector('[data-mko="b3"]').click();
  return {credits:g.G.credits,orders:g.G.mkt.ord.length,log:document.getElementById('log').textContent};
});
check('one credit under the held line does not post', short.credits===98&&short.orders===0&&/Not enough credits/.test(short.log), JSON.stringify(short));

const posted=await p.evaluate(()=>{
  const g=__g;
  g.G.credits=99;g.drawSheet();
  document.querySelector('[data-mko="b3"]').click();
  const o=g.G.mkt.ord[0];
  const row=document.querySelector('[data-mkx]');
  if(row)row.scrollIntoView({block:'center'});
  return {credits:g.G.credits,n:o&&o.n,px:o&&o.px,esc:o&&o.esc,row:row?row.textContent:'',log:document.getElementById('log').textContent};
});
check('the purse sets aside the ₡99 the line holds', posted.credits===0&&posted.n===1&&posted.esc===99&&posted.px>99&&posted.px<100&&/₡99 is held/.test(posted.row)&&/at ₡99 each/.test(posted.log), JSON.stringify(posted));

await p.screenshot({path:'/opt/cursor/artifacts/screenshot_bid_hold.png'});

const back=await p.evaluate(()=>{
  document.querySelector('[data-mkx]').click();
  return {credits:__g.G.credits,orders:__g.G.mkt.ord.length,log:document.getElementById('log').textContent};
});
check('withdrawing the bid returns the 99', back.credits===99&&back.orders===0&&/Order withdrawn/.test(back.log), JSON.stringify(back));

check('no page errors', !errs.length, errs.join('; '));
await b.close();
console.log(fail.length?'FAIL\n'+fail.join('\n'):'bid-hold ok');
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
