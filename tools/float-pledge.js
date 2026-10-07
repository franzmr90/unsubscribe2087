/* Mr. Float's pledge, call, and owe line are what the purse does.
   node tools/float-pledge.js */
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

const offer=await p.evaluate(()=>{
  const g=__g;
  g.G.adopt=100;g.G.rep.btc=0;g.G.sats=40;g.G.credits=0;
  g.mktInit();g.G.mkt.p=100;
  g.openSheet('sats',{only:['sats']});
  document.querySelector('[data-mkq="1"]').click();
  const bid=g.mktBid();
  const lent=Math.floor(bid*10*0.5),liq=bid*0.72,wrong=lent/(10*0.72);
  const fmt=n=>{let i=0;const U=['','K','M'];while(n>=1000&&i<U.length-1){n/=1000;i++}return '₡'+(i?n.toFixed(n<10?2:n<100?1:0):Math.floor(n))+U[i]};
  const h3=[...document.querySelectorAll('h3')].find(e=>e.textContent.includes('Mr. Float will lend'));
  h3.scrollIntoView({block:'center'});
  const btn=document.querySelector('[data-mkb]').textContent;
  const below=h3.nextElementSibling.nextElementSibling.querySelector('.dn2').textContent;
  return {bid,lent,liq,wrong,btn,below,hands:fmt(lent),call:fmt(liq),miss:fmt(wrong),qty:document.querySelector('[data-mkq="1"]').className};
});
check('size one still offers a pledge of ten', offer.qty.includes('big')&&/against 10 sats/.test(offer.btn), JSON.stringify(offer));
check('the offer hands over the floored credits', offer.btn.includes(offer.hands), JSON.stringify(offer));
check('the call on the offer is the bid times the ratio', offer.below===offer.call&&offer.call!==offer.miss, JSON.stringify(offer));

await p.screenshot({path:'/opt/cursor/artifacts/screenshot_float_pledge.png'});

const took=await p.evaluate(()=>{
  document.querySelector('[data-mkb]').click();
  const pos=__g.G.mkt.pos,dlg=document.getElementById('dP').textContent;
  return {credits:__g.G.credits,sats:__g.G.sats,n:pos&&pos.n,lent:pos&&pos.lent,liq:pos&&pos.liq,dlg};
});
check('the button pledges the ten the line named', took.sats===30&&took.n===10&&took.credits===offer.lent&&took.lent===offer.lent, JSON.stringify(took));
check('the loan stores the call the offer named', Math.abs(took.liq-offer.liq)<1e-9&&took.dlg.includes(offer.call)&&took.dlg.includes(offer.hands), JSON.stringify(took));

const owe=Math.floor(offer.lent*1.08);
const short=await p.evaluate(owe=>{
  const d=document.getElementById('dlg');
  if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}
  __g.G.credits=owe-1;__g.drawSheet();
  const b=document.querySelector('[data-mkr]');
  const held=[...document.querySelectorAll('h3')].find(e=>e.textContent.includes('Mr. Float holds'));
  const oweLine=held&&held.nextElementSibling.textContent;
  const before=__g.G.credits;
  if(b&&!b.disabled)b.click();
  return {disabled:!b||b.disabled,credits:__g.G.credits,before,sats:__g.G.sats,pos:!!__g.G.mkt.pos,oweLine};
}, owe);
check('one credit under the owe line does not repay', short.disabled&&short.credits===owe-1&&short.sats===30&&short.pos&&short.oweLine.includes('₡'+owe), JSON.stringify(short));

const paid=await p.evaluate(owe=>{
  __g.G.credits=owe;__g.drawSheet();
  const b=document.querySelector('[data-mkr]');
  if(!b||b.disabled)return {enabled:false};
  b.click();
  return {enabled:true,credits:__g.G.credits,sats:__g.G.sats,pos:!!__g.G.mkt.pos,log:document.getElementById('log').textContent};
}, owe);
check('the printed owe clears the pledge', paid.enabled&&paid.credits===0&&paid.sats===40&&!paid.pos&&/₡/.test(paid.log)&&paid.log.includes(String(owe)), JSON.stringify(paid));

check('no page errors', !errs.length, errs.join('; '));
await b.close();
console.log(fail.length?'FAIL\n'+fail.join('\n'):'float-pledge ok');
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
