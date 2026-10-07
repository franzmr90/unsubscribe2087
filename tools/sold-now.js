/* The stack line prints what Sell the lot pays.
   node tools/sold-now.js */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const UNITS=['','K','M','B','T','Qa','Qi','Sx','Sp','Oc','No','Dc'];
function fmt(n){let i=0;while(n>=1000&&i<UNITS.length-1){n/=1000;i++}return '₡'+(i?n.toFixed(n<10?2:n<100?1:0):Math.floor(n))+UNITS[i]}

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
await p.evaluate(()=>{const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()};const s=document.getElementById('scene');if(s)s.hidden=true;__g.setMode('play')});

const offer=await p.evaluate(()=>{
  const g=__g,G=g.G;
  G.adopt=0;G.rep={btc:0,anon:0,norm:0};G.nodeUp=0;G.cpi=1;
  g.mktInit();G.mkt.p=100;G.mkt.r=100/g.mktFair();
  G.sats=40;G.credits=0;
  g.openSheet('sats',{only:['sats']});
  const q=g.mktQuote(G.sats,'sell');
  const cell=[...document.querySelectorAll('#sheetIn .tick div')].find(e=>e.textContent.startsWith('Your stack'));
  cell.scrollIntoView({block:'center'});
  return {shown:cell.querySelector('b').textContent,total:q.total,k:q.k,depth:g.mktDepth(),bid:g.mktBid(),bidTimes:G.sats*g.mktBid(),note:document.getElementById('sheetIn').innerText};
});
check('a thin book walks the quote well under the bid', offer.depth===40&&offer.k===0.55&&offer.total===3758&&offer.bidTimes>3900, JSON.stringify(offer));
check('the stack line prints the sell-the-lot quote', offer.shown===fmt(offer.total)&&offer.shown==='₡3.76K', JSON.stringify(offer));
check('the stack line is not his bid times the stack', offer.shown!==fmt(offer.bidTimes)&&fmt(offer.bidTimes)==='₡3.97K', JSON.stringify(offer));
check('the note says the stack line is the lot', /Your stack, if sold now, is what the lot pays/.test(offer.note), offer.note.slice(0,400));

await p.screenshot({path:'/opt/cursor/artifacts/screenshot_sold_now.png'});

const sold=await p.evaluate(()=>{
  document.querySelector('[data-mkt="sall"]').click();
  return {credits:__g.G.credits,sats:__g.G.sats,log:document.getElementById('log').textContent};
});
check('selling the lot pays the printed 3758', sold.credits===3758&&sold.sats===0&&/Sold 40 sats for ₡3\.76K/.test(sold.log), JSON.stringify(sold));

check('no page errors', !errs.length, errs.join('; '));
await b.close();
console.log(fail.length?'FAIL\n'+fail.join('\n'):'sold-now ok');
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
