/* Sell all on a full phone pack: the confirm must take the tap, sit on top,
   keep charms (the blue 1 pins), notes, uniques and locks, pay sats, fill buyback,
   and still be there after a save reload. From You and from Merchant.
   node tools/sell-debug.js */
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
const p=await b.newPage({viewport:{width:390,height:844},hasTouch:true});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
await p.waitForTimeout(300);
await p.evaluate(()=>{
  window.hitOf=function(sel){
    const el=typeof sel==='string'?document.querySelector(sel):sel;
    if(!el)return {miss:true};
    const r=el.getBoundingClientRect();
    const x=r.x+r.width/2,y=r.y+Math.min(r.height/2,22);
    const top=document.elementFromPoint(x,y);
    const stack=document.elementsFromPoint(x,y).slice(0,5).map(n=>{
      const cls=n.className&&n.className.baseVal!==undefined?n.className.baseVal:n.className;
      const bit=(cls||'').toString().split(' ')[0];
      return n.id?'#'+n.id:(bit?'.'+bit:n.tagName);
    });
    return {in:r.top>=-1&&r.left>=-1&&r.bottom<=innerHeight+1&&r.right<=innerWidth+1,hit:!!(top&&(top===el||el.contains(top))),top:stack[0]||'',stack,t:Math.round(r.top),b:Math.round(r.bottom),h:Math.round(r.height),text:el.textContent,off:!!el.disabled};
  };
});
await p.evaluate(()=>__g.skipDisc());
await p.waitForTimeout(120);
await p.click('[data-cls=scrapper]');
await p.waitForTimeout(180);
await p.evaluate(()=>{__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1});
await clearUI(p);
await p.evaluate(()=>__g.enter(0));
await clearUI(p);
await p.evaluate(()=>__g.setMode('play'));

await p.evaluate(()=>{
  const g=__g,G=g.G;
  g.mktInit();const f=g.mktFair()||1;G.mkt.p=1;G.mkt.r=1/f;G.mkt.sent=0;G.mkt.sT=1e9;
  G.cpi=1;G.disc=0;G.rep.norm=0;G.rep.btc=0;G.lean=0;G.lvl=8;G.sats=0;G.credits=40;G.sellF=null;G.words={HODL:2};
  const gear=(q,name,extra)=>{const it=g.makeItem(4,q>2?2:q,'gloves');it.q=q;it.id=true;it.val=40;it.aff=it.aff||[];it.name=name;it.req=1;it.junk=0;it.lock=0;if(extra)Object.assign(it,extra);return it};
  const white=gear(0,'White Gloves');
  const charms=[];for(let i=0;i<8;i++)charms.push(g.mkCharm(4,{sz:'slip',aff:[{k:'hp',v:4}],name:'Slip '+i,val:40}));
  const magic=gear(1,'Blue Gloves');
  const fillers=[];for(let i=0;i<9;i++)fillers.push(gear(1,'Blue Filler '+i));
  const rare=gear(2,'Yellow Helm');
  const unique=gear(4,'Unique Coat');
  const set=gear(3,'Set Boots');
  const locked=gear(0,'Kept Gloves',{lock:1});
  const quest=gear(0,'Shoebox',{quest:1});
  G.bag=[white,...charms,magic,...fillers,rare,unique,set,locked,quest];
  g.BUYBACK.length=0;
  g.OPT.ui='touch';g.uiApply(true);
  const port=document.getElementById('uiPortX');if(port)port.click();
  g.setShopVia(0);g.setMode('play');g.openVend('brenda');g.VEND.side='you';g.drawSheet();
});

const full=await p.evaluate(()=>{
  const g=__g,head=document.querySelector('.youSide h3');
  const pin=document.querySelector('[data-vbag="1"] small');
  const plan=g.vendSellPlan('all'),junk=g.vendSellPlan('junk');
  const slip=g.G.bag[1];
  return {head:head&&head.textContent,n:g.G.bag.length,cells:g.gridCells(g.G.bag),pin:pin&&pin.textContent,charm:!!(slip&&slip.charm),cost:slip&&g.charmCost?g.charmCost(slip):null,plan:plan.rows.map(r=>r.it.name),junk:junk.rows.map(r=>r.it.name)};
});
check('a full pack reads 24/24 and the blue pins are slips marked 1', full.head==='Pack 24/24' && full.n===24 && full.cells===24 && full.charm && full.pin==='1', full);
check('sell all and sell junk start on the one white', full.plan.join(',')==='White Gloves' && full.junk.join(',')==='White Gloves', full);

await p.click('[data-vbag="0"]');
await p.evaluate(()=>document.querySelector('[data-vsellall="1"]').scrollIntoView({block:'end'}));
await p.waitForTimeout(40);
const covered=await p.evaluate(()=>hitOf('[data-vsellall="1"]'));
check('with a piece open, a tap on Sell all hits the button', covered.hit && covered.in && covered.h>=44, covered);

const allBox=await p.locator('[data-vsellall="1"]').boundingBox();
await p.touchscreen.tap(allBox.x+allBox.width/2, allBox.y+Math.min(allBox.height/2,22));
await p.waitForTimeout(80);
const opened=await p.evaluate(()=>{
  const d=document.getElementById('dlg');
  const btns=[...document.querySelectorAll('#dBtns button')].map(b=>{const h=hitOf(b);return {text:b.textContent,in:h.in,hit:h.hit,top:h.top,t:h.t,b:h.b,off:h.off}});
  const sell=btns.find(b=>b.text==='Sell');
  const z=getComputedStyle(d).zIndex;
  return {open:d&&!d.hidden,body:document.getElementById('dP').textContent,pop:document.getElementById('pop').hidden,z,btns,sell};
});
check('the phone confirm opens on top of the pack', opened.open && opened.pop && +opened.z>=30 && /Sell 1 piece for 16 sats/.test(opened.body) && /charms/.test(opened.body), opened);
check('every confirm button is on the phone screen and Sell takes the tap', opened.btns.length===5 && opened.btns.every(b=>b.in&&b.hit) && opened.sell && !opened.sell.off, opened);
if(opened.open && opened.btns.every(b=>b.in&&b.hit))await p.screenshot({path:'/opt/cursor/artifacts/sell-debug-phone.png'});

await p.evaluate(()=>{document.querySelector('[data-sfilt="magic"]').click();document.querySelector('[data-sfilt="rare"]').click()});
const widened=await p.evaluate(()=>{
  const body=document.getElementById('dP').textContent;
  const names=__g.vendSellPlan('all').rows.map(r=>r.it.name);
  const charms=names.filter(n=>n.indexOf('Slip')===0);
  const kept=['Unique Coat','Set Boots','Kept Gloves','Shoebox'].every(n=>names.indexOf(n)<0);
  return {body,n:names.length,charms:charms.length,kept,hasRare:names.indexOf('Yellow Helm')>=0,hasMagic:names.indexOf('Blue Gloves')>=0,hasWhite:names.indexOf('White Gloves')>=0};
});
check('magic and rare add gear, and the blue pins, uniques, locks and the quest stay out', /Sell 12 pieces for 192 sats/.test(widened.body) && widened.n===12 && widened.charms===0 && widened.kept && widened.hasRare && widened.hasMagic && widened.hasWhite, widened);

const sellAt=await p.evaluate(()=>{const b=[...document.querySelectorAll('#dBtns button')].find(x=>x.textContent==='Sell');const r=b.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}});
await p.touchscreen.tap(sellAt.x,sellAt.y);
await p.waitForTimeout(80);
const sold=await p.evaluate(()=>{
  const g=__g,G=g.G,head=document.querySelector('.youSide h3');
  const left=G.bag.map(it=>it.name).sort();
  const back=g.BUYBACK.map(r=>r.it.name).sort();
  return {head:head&&head.textContent,sats:G.sats,words:G.words.HODL,left,back,dlg:document.getElementById('dlg').hidden,mode:g.mode};
});
check('the sale pays sats, updates the pack, and leaves the pins and the note', sold.head==='Pack 12/24' && sold.sats===192 && sold.words===2 && sold.dlg && sold.mode==='sheet', sold);
check('sold gear is on the counter and the protected pieces stayed', sold.back.length===12 && sold.left.length===12 && sold.left.join(',').indexOf('Slip 0')>=0 && sold.left.join(',').indexOf('Unique Coat')>=0 && sold.left.join(',').indexOf('Kept Gloves')>=0 && sold.left.join(',').indexOf('Shoebox')>=0 && sold.back.join(',').indexOf('White Gloves')>=0 && sold.back.join(',').indexOf('Slip')<0, sold);
await p.screenshot({path:'/opt/cursor/artifacts/sell-debug-sold.png'});

const junkBox=await p.locator('[data-vselljunk="1"]').boundingBox();
await p.touchscreen.tap(junkBox.x+junkBox.width/2, junkBox.y+Math.min(junkBox.height/2,22));
await p.waitForTimeout(40);
const junkDlg=await p.evaluate(()=>{
  const body=document.getElementById('dP').textContent;
  const sell=[...document.querySelectorAll('#dBtns button')].find(b=>b.textContent==='Sell');
  return {open:!document.getElementById('dlg').hidden,body,off:!!(sell&&sell.disabled),title:document.getElementById('dT').textContent};
});
check('sell junk says there is nothing white left', junkDlg.open && junkDlg.title==='Sell junk' && /No whites or greys to sell/.test(junkDlg.body) && junkDlg.off, junkDlg);
await p.evaluate(()=>{const b=[...document.querySelectorAll('#dBtns button')].find(x=>x.textContent==='Leave');b.click()});

const reloaded=await p.evaluate(()=>{
  const g=__g,G=g.G;
  const test=g.makeItem(2,0,'helm');test.test=1;test.name='Test Helm';test.val=40;
  g.BUYBACK.push({it:test,paid:1,ask:2,kind:'brenda'});
  const snap=JSON.parse(JSON.stringify(g.saveObj()));
  const wrote=(snap.buyback||[]).some(r=>r.it&&r.it.test);
  const backNames=(snap.buyback||[]).map(r=>r.it.name).sort();
  const snapBag=(snap.G.bag||[]).map(it=>it.name).sort();
  const snapSats=snap.G.sats;
  G.bag=[];G.sats=0;G.words={};g.BUYBACK.length=0;delete G._buyback;
  const ok=g.applySave(snap);
  g.enter(0);
  const live=g.G;
  return {ok,wrote,snapBack:backNames,snapBag,snapSats,bag:live.bag.map(it=>it.name).sort(),sats:live.sats,back:g.BUYBACK.map(r=>r.it.name).sort(),words:live.words&&live.words.HODL,held:!!live._buyback,inG:Object.prototype.hasOwnProperty.call(snap.G,'_buyback')};
});
check('a reload restores the pack, the sats, the note and the counter', reloaded.ok && !reloaded.wrote && !reloaded.inG && !reloaded.held && reloaded.snapSats===192 && reloaded.sats===192 && reloaded.words===2 && reloaded.snapBag.join(',')===sold.left.join(',') && reloaded.bag.join(',')===sold.left.join(',') && reloaded.back.join(',')===sold.back.join(','), reloaded);

await p.evaluate(()=>{
  const g=__g,G=g.G;
  const grey=g.makeItem(3,1,'boots');grey.id=true;grey.val=40;grey.q=1;grey.junk=1;grey.name='Grey Band';grey.req=1;grey.lock=0;grey.aff=grey.aff||[];
  const blue=g.makeItem(3,1,'boots');blue.id=true;blue.val=40;blue.q=1;blue.junk=0;blue.name='Blue Boots';blue.req=1;blue.lock=0;blue.aff=blue.aff||[];
  G.bag.push(grey,blue);G.sellF={norm:1,magic:0,rare:0};
  g.setMode('play');g.openVend('brenda');g.VEND.side='you';g.drawSheet();
});
const youJunk=await p.locator('[data-vselljunk="1"]').boundingBox();
await p.touchscreen.tap(youJunk.x+youJunk.width/2, youJunk.y+Math.min(youJunk.height/2,22));
const youBody=await p.evaluate(()=>document.getElementById('dP').textContent);
check('from the You tab, sell junk offers the grey only', /Sell 1 piece for 16 sats/.test(youBody), youBody);
const youSell=await p.evaluate(()=>{const b=[...document.querySelectorAll('#dBtns button')].find(x=>x.textContent==='Sell');const r=b.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}});
await p.touchscreen.tap(youSell.x,youSell.y);
await p.waitForTimeout(40);

await p.evaluate(()=>{__g.VEND.side='them';__g.drawSheet()});
const merch=await p.locator('[data-vsellall="1"]').boundingBox();
check('the Merchant tab still shows Sell all', !!merch && merch.height>=44, merch);
await p.touchscreen.tap(merch.x+merch.width/2, merch.y+Math.min(merch.height/2,22));
await p.waitForTimeout(40);
await p.evaluate(()=>{const b=document.querySelector('[data-sfilt="magic"]');if(b)b.click()});
const merchBody=await p.evaluate(()=>document.getElementById('dP').textContent);
check('from the Merchant tab, magic sells the blue boots and not the pins', /Sell 1 piece for 16 sats/.test(merchBody), merchBody);
const merchSell=await p.evaluate(()=>{const b=[...document.querySelectorAll('#dBtns button')].find(x=>x.textContent==='Sell');const r=b.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}});
await p.touchscreen.tap(merchSell.x,merchSell.y);
await p.waitForTimeout(40);
const afterTabs=await p.evaluate(()=>{
  const g=__g,names=g.G.bag.map(it=>it.name);
  return {sats:g.G.sats,grey:names.indexOf('Grey Band'),blue:names.indexOf('Blue Boots'),pins:names.filter(n=>n.indexOf('Slip')===0).length,back:g.BUYBACK.some(r=>r.it.name==='Blue Boots')&&g.BUYBACK.some(r=>r.it.name==='Grey Band')};
});
check('both tabs credited the sats and the counter', afterTabs.sats===224 && afterTabs.grey<0 && afterTabs.blue<0 && afterTabs.pins===8 && afterTabs.back, afterTabs);

const cleared=await p.evaluate(()=>{__g.enter(0);return __g.BUYBACK.length});
check('walking into town still clears the counter', cleared===0, cleared);

await p.setViewportSize({width:390,height:640});
await p.evaluate(()=>{
  const g=__g,G=g.G;
  const it=g.makeItem(3,0,'gloves');it.id=true;it.val=40;it.q=0;it.name='Short White';it.req=1;it.lock=0;it.aff=it.aff||[];
  G.bag=[it];G.sellF={norm:1,magic:0,rare:0};g.BUYBACK.length=0;
  g.setMode('play');g.openVend('brenda');g.VEND.side='you';g.drawSheet();
  document.querySelector('[data-vbag="0"]').click();
  document.querySelector('[data-vsellall="1"]').scrollIntoView({block:'end'});
});
const shortAll=await p.locator('[data-vsellall="1"]').boundingBox();
await p.touchscreen.tap(shortAll.x+shortAll.width/2, shortAll.y+Math.min(shortAll.height/2,22));
const short=await p.evaluate(()=>{
  const btns=[...document.querySelectorAll('#dBtns button')].map(b=>{const h=hitOf(b);return {text:b.textContent,in:h.in,hit:h.hit,b:h.b}});
  return {h:innerHeight,btns};
});
check('on a short phone every confirm button is still on screen', short.btns.length===5 && short.btns.every(b=>b.in&&b.hit), short);
await p.evaluate(()=>{const b=[...document.querySelectorAll('#dBtns button')].find(x=>x.textContent==='Leave');b.click()});

await p.setViewportSize({width:1280,height:800});
await p.evaluate(()=>{
  __g.OPT.ui='mouse';__g.uiApply(true);
  const g=__g,G=g.G;
  const gear=(q,name)=> {const it=g.makeItem(4,q>2?2:q,'gloves');it.q=q;it.id=true;it.val=40;it.aff=it.aff||[];it.name=name;it.req=1;it.lock=0;return it};
  const charms=[];for(let i=0;i<8;i++)charms.push(g.mkCharm(4,{sz:'slip',aff:[{k:'hp',v:4}],name:'Slip '+i,val:40}));
  G.bag=[gear(0,'White Gloves'),...charms,gear(1,'Blue Gloves'),gear(2,'Yellow Helm'),gear(4,'Unique Coat')];
  let guard=0;while(g.gridCells(G.bag)<24&&guard++<30)G.bag.push(gear(1,'Blue Filler '+G.bag.length));
  G.sellF=null;G.sats=0;g.BUYBACK.length=0;
  g.setMode('play');g.openVend('brenda');g.VEND.side='both';g.drawSheet();
  document.querySelector('[data-vbag="0"]').click();
  document.querySelector('[data-vsellall="1"]').scrollIntoView({block:'end'});
});
const deskHit=await p.evaluate(()=>hitOf('[data-vsellall="1"]'));
check('on a desk, Sell all still takes the click while a piece is open', deskHit.hit && deskHit.in, deskHit);
await p.click('[data-vsellall="1"]');
const desk=await p.evaluate(()=>{
  const btns=[...document.querySelectorAll('#dBtns button')].map(b=>{const h=hitOf(b);return {text:b.textContent,in:h.in,hit:h.hit}});
  return {open:!document.getElementById('dlg').hidden,body:document.getElementById('dP').textContent,btns,pop:document.getElementById('pop').hidden};
});
check('the desk confirm is on top and names the white', desk.open && desk.pop && /Sell 1 piece for 16 sats/.test(desk.body) && desk.btns.every(b=>b.in&&b.hit), desk);
if(desk.open)await p.screenshot({path:'/opt/cursor/artifacts/sell-debug-desk.png'});

check('no page errors', !errs.length, errs);
await b.close();
console.log(fail.length?'FAIL\n'+fail.join('\n'):'sell-debug ok');
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
