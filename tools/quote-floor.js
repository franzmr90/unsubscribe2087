/* Nonce's quote pays and charges the whole credits on the line.
   node tools/quote-floor.js */
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
  const pin=()=>{const g=__g;g.G.adopt=100;g.G.rep.btc=0;g.mktInit();g.G.mkt.p=100;g.G.mkt.r=100/g.mktFair();};
  const rawQuote=side=>{
    const g=__g,mid=g.mktMid(),sp=g.mktSpread(),n=1,k=Math.min(.55,n/g.mktDepth()),buy=side==='buy';
    const px=mid*(1+(buy?sp/2:-sp/2))*(1+(buy?k*.09:-k*.09));
    return {px,k,raw:buy?px*n*(1+.004):px*n*(1-.004)};
  };
  pin();
  __g.G.sats=5;__g.G.credits=0;
  __g.openSheet('sats',{only:['sats']});
  document.querySelector('[data-mkq="1"]').click();
  pin();__g.drawSheet();
  const buyRaw=rawQuote('buy'),sellRaw=rawQuote('sell');
  const buyLine=[...document.querySelectorAll('.tot')].find(e=>e.textContent.startsWith('Buy')).querySelector('b').textContent;
  const sellLine=[...document.querySelectorAll('.tot')].find(e=>e.textContent.startsWith('Sell')).querySelector('b').textContent;
  const q=__g.mktQuote(1,'buy');
  __g.G.credits=Math.floor(buyRaw.raw)-1;__g.drawSheet();
  const shut=document.querySelector('[data-mkt="b"]').disabled;
  __g.G.credits=Math.floor(buyRaw.raw);__g.drawSheet();
  const open=!document.querySelector('[data-mkt="b"]').disabled;
  document.querySelector('.tot').scrollIntoView({block:'center'});
  return {buyLine,sellLine,shut,open,px:q.px,k:q.k,total:q.total,buyFloor:Math.floor(buyRaw.raw),sellFloor:Math.floor(sellRaw.raw),buyRaw:buyRaw.raw,sellRaw:sellRaw.raw};
});
check('one sat prints ₡100 and the price stays fractional', offer.buyLine==='₡'+offer.buyFloor&&offer.buyFloor===100&&offer.total===100&&offer.px>Math.floor(offer.px)&&offer.k>0&&offer.k<0.02, JSON.stringify(offer));
check('the sell line prints ₡99', offer.sellLine==='₡'+offer.sellFloor&&offer.sellFloor===99&&offer.sellRaw>99&&offer.sellRaw<100, JSON.stringify(offer));
check('one credit under the buy line keeps the button shut', offer.shut&&offer.open, JSON.stringify(offer));

await p.screenshot({path:'/opt/cursor/artifacts/screenshot_quote_floor.png'});

const bought=await p.evaluate(()=>{
  const before=__g.G.credits;
  document.querySelector('[data-mkt="b"]').click();
  return {before,credits:__g.G.credits,sats:__g.G.sats,log:document.getElementById('log').textContent,basis:__g.G.mkt.cb.cr};
});
check('the purse pays the ₡100 on the line', bought.before===100&&bought.credits===0&&bought.sats===6&&bought.basis===100&&/Bought 1 sats for ₡100/.test(bought.log), JSON.stringify(bought));

const sold=await p.evaluate(()=>{
  const g=__g;g.G.adopt=100;g.G.rep.btc=0;g.mktInit();g.G.mkt.p=100;g.G.mkt.r=100/g.mktFair();
  g.G.credits=0;g.drawSheet();
  const line=[...document.querySelectorAll('.tot')].find(e=>e.textContent.startsWith('Sell')).querySelector('b').textContent;
  document.querySelector('[data-mkt="s"]').click();
  return {line,credits:__g.G.credits,sats:__g.G.sats,log:document.getElementById('log').textContent};
});
check('the purse gains the ₡99 on the sell line', sold.line==='₡99'&&sold.credits===99&&sold.sats===5&&/Sold 1 sats for ₡99/.test(sold.log), JSON.stringify(sold));

check('no page errors', !errs.length, errs.join('; '));
await b.close();
console.log(fail.length?'FAIL\n'+fail.join('\n'):'quote-floor ok');
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
