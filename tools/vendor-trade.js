/* Diablo-style merchant: buy, sell, buyback, refresh, whole sats, charm footprints.
   node tools/vendor-trade.js
   Shots: /opt/cursor/artifacts/vendor-desktop.png and vendor-mobile.png */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');

async function clearUI(p){
  for(let i=0;i<24;i++){
    const st=await p.evaluate(()=>{
      const s=document.getElementById('scene');
      if(s&&!s.hidden){document.getElementById('scSkip').click();return 'scene'}
      const d=document.getElementById('dlg');
      if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x){x.click();return 'dlg'}return 'locked'}
      const port=document.getElementById('uiPortX');
      if(port&&!port.closest('#uiPort').hidden){port.click();return 'port'}
      return 'clear'});
    if(st==='clear')return;
    await p.waitForTimeout(st==='locked'?350:120);
  }
  throw new Error('overlays did not clear');
}

(async()=>{
const html=fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8');
const fail=[];
const check=(n,ok,d)=>{if(!ok)fail.push(n+(d?': '+JSON.stringify(d):''));};
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:1280,height:800}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
await p.waitForTimeout(300);
await p.evaluate(()=>__g.skipDisc());
await p.waitForTimeout(120);
await p.click('[data-cls=scrapper]');
await p.waitForTimeout(180);
await p.evaluate(()=>{__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1});
await clearUI(p);
await p.evaluate(()=>__g.enter(0));
await clearUI(p);
await p.evaluate(()=>__g.setMode('play'));

const math=await p.evaluate(()=>{
  const g=__g, G=g.G;
  g.mktInit(); G.mkt.p=1; G.mkt.r=1; G.mkt.sent=0; G.mkt.sT=1e9; G.cpi=1; G.disc=0; G.rep.norm=0; G.rep.btc=0; G.lean=0; G.lvl=1; G.tier=0;
  G.credits=77; G.sats=500; G.stims=0; G.bag=[]; G.marrow=0;
  g.setShopVia(0);
  const gear=g.makeItem(4,1,'weapon');
  gear.id=true; gear.val=40; gear.aff=gear.aff||[]; gear.name='Counter Axe'; gear.req=1;
  const filing=g.mkCharm(4,{sz:'filing',aff:[{k:'hp',v:12}],name:'Counter Filing',val:40});
  g.shop=[gear, filing];
  g.setMode('play');
  g.openVend('brenda');
  g.VEND.tab='charms';
  g.drawSheet();
  const cell=document.querySelector('[data-vend="1"]');
  const style=cell?cell.getAttribute('style'):'';
  const card=g.cmpHTML(filing);
  const span=style.indexOf('span 2')>=0 && (style.match(/span 2/g)||[]).length>=2;
  const belt=card.indexOf('On the belt')>=0;
  const ask=g.vendAsk(filing), bid=g.vendBid(filing);
  const bought=g.vendBuy(1);
  const afterBuy={sats:G.sats, credits:G.credits, cells:g.gridCells(G.bag), bag:G.bag.length, shop:g.shop.length, bought};
  g.vendSell(0);
  const back=g.BUYBACK[0];
  g.VEND.tab='buyback';
  g.drawSheet();
  const backCell=document.querySelector('[data-vback]');
  const backStyle=backCell?backCell.getAttribute('style'):'';
  const sold={sats:G.sats, credits:G.credits, bag:G.bag.length, paid:back&&back.paid, ask:back&&back.ask, span:(backStyle.match(/span 2/g)||[]).length};
  g.vendBuyback(0);
  const rebought={sats:G.sats, credits:G.credits, bag:G.bag.length, left:g.BUYBACK.length, cells:g.gridCells(G.bag)};
  const junk={slot:'weapon',id:true,test:true,val:99,name:'Test',base:'Test',q:1,il:1,aff:[],req:1};
  G.bag=[junk];
  const refused=!g.vendSell(0) && G.bag.length===1 && G.sats===rebought.sats;
  G.bag=[];
  const wAsk=g.vendAsk(gear), wBid=g.vendBid(gear);
  const w0=G.sats;
  g.vendBuy(0);
  const wBuy={sats:G.sats, credits:G.credits, bag:G.bag[0]&&G.bag[0].name};
  g.vendSell(0);
  const wSell={sats:G.sats, back:g.BUYBACK.length};
  g.vendBuyback(0);
  const wBack={sats:G.sats, bag:G.bag.length, left:g.BUYBACK.length};
  g.setMode('play');
  g.openVend('gamble');
  const wren=!g.vendSell(0) && G.bag.length===1;
  g.setMode('play');
  g.shop[0]&&(g.shop[0].marker='keep');
  g.BUYBACK.push({it:gear,paid:1,ask:2,kind:'brenda'});
  g.enter(0);
  const fresh=!g.shop.some(it=>it&&it.marker==='keep') && g.BUYBACK.length===0;
  const arm=g.satShop[0];
  const il=(G.lvl||1)+(G.tier||0)*12+3;
  const guarantee=!!(arm&&arm.it&&arm.it.slot==='weapon'&&arm.it.il===il);
  g.setShopVia(0);
  const sample=g.makeItem(3,1,'helm'); sample.val=40; sample.id=true; sample.aff=[];
  const full=g.satCost(sample);
  g.setShopVia(1);
  const off=g.satCost(sample);
  g.setShopVia(0);
  const ints=[g.vendBid(sample), g.vendAsk(sample), g.satPrice({price:12,it:sample}), g.boxPrice(), full, off].every(n=>Number.isInteger(n)&&n>=0);
  const prices=g.shop.concat(g.satShop.map(o=>o.it)).every(it=>{
    const a=g.vendAsk(it), b=g.vendBid(it);
    return Number.isInteger(a)&&Number.isInteger(b);
  });
  return {span,belt,ask,bid,afterBuy,sold,rebought,refused,wAsk,wBid,w0,wBuy,wSell,wBack,wren,fresh,guarantee,il:arm&&arm.it&&arm.it.il,full,off,ints,prices,errs:0};
});
check('a filing spans two by two on the counter', math.span, math);
check('a charm tooltip names the belt', math.belt, math);
check('buying a filing spends its ask and fills four pack cells', math.afterBuy.bought!==false && math.afterBuy.sats===500-math.ask && math.afterBuy.credits===77 && math.afterBuy.cells===4 && math.afterBuy.bag===1, math.afterBuy);
check('selling it pays the bid and keeps the credits', math.sold.sats===math.afterBuy.sats+math.sold.paid && math.sold.credits===77 && math.sold.bag===0 && math.sold.ask>=math.sold.paid, math.sold);
check('the buyback cell keeps the filing footprint', math.sold.span>=2, math.sold);
check('buying it back charges the higher ask', math.rebought.sats===math.sold.sats-math.sold.ask && math.rebought.credits===77 && math.rebought.bag===1 && math.rebought.left===0 && math.rebought.cells===4, math.rebought);
check('test gear has no price', math.refused, math);
check('a weapon buy, sale and buyback use whole sats', math.wAsk===100 && math.wBid===16 && math.wBuy.sats===math.w0-100 && math.wBuy.credits===77 && math.wSell.sats===math.w0-100+16 && math.wBack.sats===math.w0-100+16-100 && math.wBack.bag===1 && math.wBack.left===0, math);
check('Wren does not buy gear', math.wren, math);
check('leaving town restocks and clears buyback', math.fresh, math);
check('Nonce still stocks a weapon three levels ahead', math.guarantee, math);
check('thirty percent off is not a higher sat price', math.off<=math.full && math.off===70 && math.full===100, math);
check('every quoted price is a whole number', math.ints&&math.prices, math);

await p.evaluate(()=>{
  const g=__g, G=g.G;
  g.mktInit(); G.mkt.p=1; G.mkt.r=1; G.mkt.sent=0; G.mkt.sT=1e9; G.cpi=1; G.disc=0; G.lvl=1; G.rep.norm=0; G.rep.btc=0; G.credits=40; G.sats=80; G.stims=0; G.bag=[];
  g.setShopVia(0); g.setMode('play');
  const it=g.makeItem(2,1,'helm'); it.id=true; it.val=40; it.aff=it.aff||[]; it.name='Shown Helm'; it.req=1;
  g.shop=[it];
  g.openVend('brenda');
  g.VEND.tab='armor';
  g.drawSheet();
});
const sides=await p.evaluate(()=>{
  const a=document.querySelector('.vendSide').getBoundingClientRect();
  const y=document.querySelector('.youSide').getBoundingClientRect();
  const repair=!!document.querySelector('[data-repair]')||/Repair all/.test(document.body.innerText);
  return {aw:a.width, yw:y.width, side:document.querySelector('.vendBody').dataset.side, repair, price:(document.querySelector('[data-vend="0"] .vp')||{}).textContent};
});
check('desktop shows the counter beside the pack', sides.aw>200 && sides.yw>200 && sides.side==='both' && sides.price==='100 sats' && !sides.repair, sides);
await p.screenshot({path:'/opt/cursor/artifacts/vendor-desktop.png'});
await p.click('[data-vend="0"]',{button:'right'});
const short=await p.evaluate(()=>({sats:__g.G.sats, credits:__g.G.credits, bag:__g.G.bag.length, shop:__g.shop.length}));
check('a short purse does not take the piece', short.sats===80 && short.credits===40 && short.bag===0 && short.shop===1, short);
await p.evaluate(()=>{__g.G.sats=180; __g.G.bag=[]; __g.G.rep.norm=0; __g.mktInit(); __g.G.mkt.p=1; __g.G.mkt.r=1; __g.G.mkt.sent=0; __g.G.mkt.sT=1e9; __g.G.cpi=1; const it=__g.makeItem(2,1,'helm'); it.id=true; it.val=40; it.aff=it.aff||[]; it.name='Shown Helm'; it.req=1; __g.shop=[it]; __g.VEND.tab='armor'; __g.drawSheet()});
await p.click('[data-vend="0"]',{button:'right'});
const paid=await p.evaluate(()=>({sats:__g.G.sats, credits:__g.G.credits, bag:__g.G.bag.length}));
check('right-click spends exactly 100 sats', paid.sats===80 && paid.credits===40 && paid.bag===1, paid);

await p.evaluate(()=>{
  const g=__g;
  g.G.sats=200; g.G.bag=[]; g.G.rep.norm=0; g.G.rep.btc=0; g.mktInit(); g.G.mkt.p=1; g.G.mkt.r=1; g.G.mkt.sent=0; g.G.mkt.sT=1e9; g.G.cpi=1;
  const it=g.makeItem(2,1,'boots'); it.id=true; it.val=40; it.aff=it.aff||[]; it.name='Shown Boots'; it.req=1;
  g.shop=[it]; g.VEND.tab='armor'; g.drawSheet();
  document.querySelector('[data-vend="0"]').click();
});
await p.click('[data-vbuy="0"]');
const popBuy=await p.evaluate(()=>({sats:__g.G.sats, bag:__g.G.bag.length}));
check('the Buy button spends 100 sats', popBuy.sats===100 && popBuy.bag===1, popBuy);
await p.evaluate(()=>{__g.VEND.tab='armor'; __g.drawSheet(); document.querySelector('[data-vbag="0"]').click()});
await p.waitForTimeout(80);
await p.click('[data-vsell="0"]');
const popSell=await p.evaluate(()=>({sats:__g.G.sats, bag:__g.G.bag.length, back:__g.BUYBACK.length}));
check('the Sell button pays 16 sats into buyback', popSell.sats===116 && popSell.bag===0 && popSell.back>=1, popSell);

const drag=await p.evaluate(()=>{
  const g=__g, G=g.G;
  const it=g.makeItem(2,1,'gloves'); it.id=true; it.val=40; it.aff=it.aff||[]; it.req=1; it.name='Drag Gloves';
  G.bag=[it]; G.sats=10; g.VEND.tab='weapons'; g.drawSheet();
  const bag=document.querySelector('[data-vbag="0"]');
  const side=document.querySelector('.vendSide');
  if(!bag||!side)return {err:'missing'};
  const br=bag.getBoundingClientRect(), sr=side.getBoundingClientRect();
  const fire=(el,type,x,y)=>el.dispatchEvent(new PointerEvent(type,{bubbles:true,clientX:x,clientY:y,pointerId:7,pointerType:'mouse'}));
  fire(bag,'pointerdown',br.x+6,br.y+6);
  fire(window,'pointermove',sr.x+24,sr.y+24);
  fire(window,'pointerup',sr.x+24,sr.y+24);
  return {sats:G.sats, bag:G.bag.length, back:g.BUYBACK.length};
});
check('dragging onto the counter sells', drag.sats===26 && drag.bag===0, drag);

await p.setViewportSize({width:390,height:844});
await p.evaluate(()=>{
  __g.OPT.ui='touch'; __g.uiApply(true);
  const port=document.getElementById('uiPortX'); if(port)port.click();
  __g.setMode('play');
  const it=__g.makeItem(2,1,'belt'); it.id=true; it.val=40; it.aff=it.aff||[]; it.name='Phone Belt'; it.req=1;
  __g.shop=[it]; __g.G.sats=200; __g.G.credits=15; __g.G.bag=[]; __g.G.rep.norm=0; __g.mktInit(); __g.G.mkt.p=1; __g.G.mkt.r=1; __g.G.mkt.sent=0; __g.G.mkt.sT=1e9; __g.G.cpi=1;
  __g.openVend('brenda');
  __g.VEND.tab='armor'; __g.VEND.side='them'; __g.drawSheet();
});
const phone=await p.evaluate(()=>{
  const body=document.querySelector('.vendBody');
  const you=document.querySelector('.youSide');
  const tab=document.querySelector('.vendTabs button');
  const tog=document.querySelector('.vendToggle button');
  const th=tab?tab.getBoundingClientRect().height:0;
  const gh=tog?tog.getBoundingClientRect().height:0;
  const youHidden=getComputedStyle(you).display==='none';
  document.querySelector('[data-vside="you"]').click();
  const them=document.querySelector('.vendSide');
  const themHidden=getComputedStyle(them).display==='none';
  return {side:body.dataset.side, youHidden, themHidden, th, gh};
});
check('a phone toggles merchant and pack with 44px targets', phone.youHidden && phone.themHidden && phone.th>=44 && phone.gh>=44, phone);
await p.evaluate(()=>{__g.VEND.side='them'; __g.VEND.tab='armor'; __g.drawSheet()});
await p.screenshot({path:'/opt/cursor/artifacts/vendor-mobile.png'});
await p.evaluate(()=>document.querySelector('[data-vend="0"]').click());
await p.click('[data-vbuy="0"]');
const confirm=await p.evaluate(()=>{
  const d=document.getElementById('dlg');
  const t=d&&!d.hidden?document.getElementById('dP').textContent:'';
  const btn=[...document.querySelectorAll('#dBtns button')].find(b=>b.textContent==='Buy');
  if(btn)btn.click();
  return {t, sats:__g.G.sats, bag:__g.G.bag.length, credits:__g.G.credits};
});
check('a dear purchase on a phone asks first', /100 sats/.test(confirm.t) && confirm.sats===100 && confirm.bag===1 && confirm.credits===15, confirm);

check('no page errors', !errs.length, errs);
await b.close();
console.log(fail.length?'FAIL\n'+fail.join('\n'):'vendor-trade ok');
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
