/* Buy everything spends the printed quote, and stays shut one credit under it.
   node tools/buy-all.js */
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

const pin=()=>p.evaluate(()=>{
  const g=__g;g.G.adopt=100;g.G.rep.btc=0;g.mktInit();g.G.mkt.p=100;g.G.mkt.r=100/g.mktFair();
});

const one=await (async()=>{
  await pin();
  await p.evaluate(()=>{__g.G.sats=5;__g.G.credits=0;__g.openSheet('sats',{only:['sats']});document.querySelector('[data-mkq="1"]').click()});
  await pin();
  return p.evaluate(()=>{
    const q=__g.mktQuote(1,'buy');
    __g.G.credits=q.total;__g.drawSheet();
    const btn=document.querySelector('[data-mkt="ball"]');
    const buy=document.querySelector('[data-mkt="b"]');
    btn.scrollIntoView({block:'center'});
    return {total:q.total,line:[...document.querySelectorAll('.tot')].find(e=>e.textContent.startsWith('Buy')).querySelector('b').textContent,afford:__g.mktAfford(),shut:btn.disabled,buyShut:buy.disabled,ask:__g.mktAsk()};
  });
})();
check('one sat still prints ₡100', one.line==='₡100'&&one.total===100&&one.ask>100&&one.ask<101, JSON.stringify(one));
check('the printed purse buys that one sat', one.afford===1&&!one.shut&&!one.buyShut, JSON.stringify(one));

await p.screenshot({path:'/opt/cursor/artifacts/screenshot_buy_all.png'});

const bought=await p.evaluate(()=>{
  const before=__g.G.credits,sats=__g.G.sats;
  document.querySelector('[data-mkt="ball"]').click();
  return {before,credits:__g.G.credits,sats:__g.G.sats,was:sats,log:document.getElementById('log').textContent};
});
check('the purse pays the ₡100 on the line', bought.before===100&&bought.credits===0&&bought.sats===bought.was+1&&/Bought 1 sats for ₡100/.test(bought.log)&&!/Not enough credits/.test(bought.log), JSON.stringify(bought));

const under=await p.evaluate(()=>{
  const g=__g;g.G.adopt=100;g.G.rep.btc=0;g.mktInit();g.G.mkt.p=100;g.G.mkt.r=100/g.mktFair();
  g.G.credits=__g.mktQuote(1,'buy').total-1;g.G.sats=5;g.drawSheet();
  return {credits:g.G.credits,afford:g.mktAfford(),shut:document.querySelector('[data-mkt="ball"]').disabled};
});
check('one credit under the line keeps Buy everything shut', under.credits===99&&under.afford===0&&under.shut, JSON.stringify(under));

const windowed=await p.evaluate(()=>{
  const g=__g;g.G.adopt=100;g.G.rep.btc=0;g.mktInit();g.G.mkt.p=100;g.G.mkt.r=100/g.mktFair();
  const ask=g.mktAsk(),credits=Math.ceil(ask);
  const old=Math.floor(credits/(ask*(1+.004)*1.08));
  g.G.credits=credits;g.G.sats=2;g.drawSheet();
  const n=g.mktAfford(),q=g.mktQuote(n,'buy');
  const open=!document.querySelector('[data-mkt="ball"]').disabled;
  document.querySelector('[data-mkt="ball"]').click();
  return {ask,credits,old,n,total:q.total,left:g.G.credits,sats:g.G.sats,open,log:document.getElementById('log').textContent};
});
check('a purse past the headline ask used to be refused', windowed.credits>=windowed.ask&&windowed.old===0&&windowed.open&&windowed.n===1&&windowed.total===100&&windowed.left===windowed.credits-100&&windowed.sats===3&&/Bought 1 sats for ₡100/.test(windowed.log), JSON.stringify(windowed));

const lot=await p.evaluate(()=>{
  const g=__g;g.G.adopt=100;g.G.rep.btc=0;g.mktInit();g.G.mkt.p=100;g.G.mkt.r=100/g.mktFair();
  g.G.credits=500;g.G.sats=0;g.drawSheet();
  const n=g.mktAfford(),q=g.mktQuote(n,'buy'),next=g.mktQuote(n+1,'buy');
  document.querySelector('[data-mkt="ball"]').click();
  return {n,total:q.total,next:next.total,credits:g.G.credits,sats:g.G.sats,log:document.getElementById('log').textContent};
});
check('a larger purse buys every sat the quote will fill', lot.n>1&&lot.total<=500&&lot.next>500&&lot.credits===500-lot.total&&lot.sats===lot.n&&new RegExp('Bought '+lot.n+' sats for ₡'+lot.total).test(lot.log), JSON.stringify(lot));

check('no page errors', !errs.length, errs.join('; '));
await b.close();
console.log(fail.length?'FAIL\n'+fail.join('\n'):'buy-all ok');
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
