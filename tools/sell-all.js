/* Sell all and sell junk at the counter, with a lock and remembered filters.
   node tools/sell-all.js
   Shot: /opt/cursor/artifacts/sell-all.png */
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
  g.mktInit(); const f=g.mktFair()||1; G.mkt.p=1; G.mkt.r=1/f; G.mkt.sent=0; G.mkt.sT=1e9;
  G.cpi=1; G.disc=0; G.rep.norm=0; G.rep.btc=0; G.lean=0; G.lvl=8; G.sats=0; G.credits=90; G.sellF=null;
  const piece=(q,name,extra)=>{const it=g.makeItem(4,q>2?2:q,'gloves'); it.q=q; it.id=true; it.val=40; it.aff=it.aff||[]; it.name=name; it.req=1; it.junk=0; it.lock=0; if(extra)Object.assign(it,extra); return it};
  const white=piece(0,'White Gloves');
  const grey=piece(1,'Grey Band',{junk:1});
  const magic=piece(1,'Magic Gloves');
  const rare=piece(2,'Rare Gloves');
  const set=piece(3,'Set Gloves');
  const unique=piece(4,'Unique Gloves');
  const charm=g.mkCharm(4,{sz:'slip',aff:[{k:'hp',v:8}],name:'Belt Slip',val:40});
  const quest=piece(0,'Shoebox',{quest:1});
  const locked=piece(0,'Kept Gloves',{lock:1});
  const worn=piece(0,'Worn Helm'); worn.slot='helm';
  const belt=g.mkCharm(4,{sz:'slip',aff:[{k:'hp',v:4}],name:'Worn Slip',val:40});
  G.eq.helm=worn; G.cslots=[belt];
  G.bag=[white,grey,magic,rare,set,unique,charm,quest,locked];
  g.setShopVia(0); g.setMode('play'); g.openVend('brenda');
  const plan=g.vendSellPlan('all');
  const junk=g.vendSellPlan('junk');
  const names=plan.rows.map(r=>r.it.name).sort();
  const done=g.vendSellCommit('all');
  const left=G.bag.map(it=>it.name).sort();
  const back=g.BUYBACK.map(r=>r.it.name).sort();
  const kept={eq:G.eq.helm===worn, belt:G.cslots[0]===belt, credits:G.credits, sats:G.sats};
  G.sellF.magic=1;
  const magicPlan=g.vendSellPlan('all');
  const magicDone=g.vendSellCommit('all');
  G.sellF.rare=1;
  const rareDone=g.vendSellCommit('all');
  const still=G.bag.map(it=>it.name).sort();
  const lockedTry=!g.vendSell(G.bag.indexOf(locked)) && G.bag.indexOf(locked)>=0;
  g.setMode('play'); g.openVend('gamble');
  const wren=g.vendSellCommit('all');
  return {names,junkN:junk.n,junkSats:junk.sats,done,left,back,kept,magicPlan:magicPlan.n,magicDone,rareDone,still,lockedTry,wren,bid:g.vendBid(white)};
});
check('sell all starts with whites and greys', math.names.join(',')==='Grey Band,White Gloves' && math.done.n===2 && math.done.sats===32 && math.bid===16, math);
check('sell junk matches that same pile', math.junkN===2 && math.junkSats===32, math);
check('the sale pays sats, keeps credits, and fills buyback', math.kept.sats===32 && math.kept.credits===90 && math.back.join(',')==='Grey Band,White Gloves', math);
check('equipped gear and the belt charm stay put', math.kept.eq && math.kept.belt, math);
check('magic waits for its filter', math.left.indexOf('Magic Gloves')>=0 && math.magicPlan===1 && math.magicDone.n===1 && math.magicDone.sats===16, math);
check('a rare sells only after its filter is on', math.rareDone.n===1 && math.rareDone.sats===16, math);
check('uniques, sets, charms, quest items, and locks stay', math.still.join(',')==='Belt Slip,Kept Gloves,Set Gloves,Shoebox,Unique Gloves' && math.lockedTry, math);
check('Wren does not buy the pack', math.wren.n===0, math);

await p.evaluate(()=>{
  const g=__g, G=g.G;
  g.mktInit(); const f=g.mktFair()||1; G.mkt.p=1; G.mkt.r=1/f; G.mkt.sent=0; G.mkt.sT=1e9;
  G.cpi=1; G.sats=0; G.credits=40; G.sellF={norm:1,magic:0,rare:0}; G.bag=[];
  const it=g.makeItem(3,0,'boots'); it.id=true; it.val=40; it.q=0; it.name='Plain Boots'; it.req=1; it.lock=0;
  const mag=g.makeItem(3,1,'boots'); mag.id=true; mag.val=40; mag.q=1; mag.name='Blue Boots'; mag.req=1;
  G.bag=[it,mag];
  g.setMode('play'); g.openVend('brenda');
});
await p.click('[data-vsellall="1"]');
const dlg=await p.evaluate(()=>{
  const d=document.getElementById('dlg');
  const t=document.getElementById('dP').textContent;
  const filts=[...document.querySelectorAll('#dBtns [data-sfilt]')].map(b=>b.textContent);
  const h=document.querySelector('#dBtns button').getBoundingClientRect().height;
  return {open:d&&!d.hidden, t, filts, h};
});
check('the confirm names the count and the sats', dlg.open && /Sell 1 piece for 16 sats/.test(dlg.t) && /locked pieces stay/.test(dlg.t), dlg);
check('the filters are Whites and greys, Magic, and Rares', dlg.filts.join('|')==='Whites and greys · on|Magic · off|Rares · off', dlg);
await p.screenshot({path:'/opt/cursor/artifacts/sell-all.png'});
await p.click('[data-sfilt="magic"]');
const remembered=await p.evaluate(()=>{
  const on=[...document.querySelectorAll('#dBtns [data-sfilt]')].map(b=>b.textContent);
  const body=document.getElementById('dP').textContent;
  const leave=[...document.querySelectorAll('#dBtns button')].find(b=>b.textContent==='Leave');
  leave.click();
  return {on, body, magic:__g.G.sellF.magic, mode:__g.mode};
});
check('a filter remembers that it was turned on', remembered.magic===1 && /Magic · on/.test(remembered.on.join('|')) && /Sell 2 pieces for 32 sats/.test(remembered.body) && remembered.mode==='sheet', remembered);

await p.evaluate(()=>{__g.G.sellF.magic=0; __g.drawSheet()});
const cell=await p.evaluate(()=>document.querySelector('[data-vbag="0"]'));
await p.click('[data-vbag="0"]',{button:'right'});
const locked=await p.evaluate(()=>{
  const el=document.querySelector('[data-vbag="0"]');
  return {seal:el&&el.classList.contains('seal'), svg:!!(el&&el.querySelector('.lk')), lock:__g.G.bag[0].lock, sats:__g.G.sats, bag:__g.G.bag.length};
});
check('a right-click locks the piece and does not sell it', locked.seal && locked.svg && locked.lock===1 && locked.sats===0 && locked.bag===2, locked);

await p.evaluate(()=>{__g.G.bag[1].lock=0; __g.drawSheet()});
const hold=await p.evaluate(()=>{
  const el=document.querySelector('[data-vbag="1"]');
  const r=el.getBoundingClientRect();
  const fire=(type)=>el.dispatchEvent(new PointerEvent(type,{bubbles:true,clientX:r.x+8,clientY:r.y+8,pointerId:3,pointerType:'touch'}));
  fire('pointerdown');
  return {x:r.x,y:r.y};
});
await p.waitForTimeout(560);
const held=await p.evaluate(()=>({lock:__g.G.bag[1]&&__g.G.bag[1].lock, seal:!!document.querySelector('[data-vbag="1"].seal')}));
check('a long press locks the piece', held.lock===1 && held.seal, held);

await p.setViewportSize({width:390,height:844});
await p.evaluate(()=>{
  __g.OPT.ui='touch'; __g.uiApply(true);
  const port=document.getElementById('uiPortX'); if(port)port.click();
  __g.setMode('play'); __g.openVend('brenda'); __g.VEND.side='you'; __g.drawSheet();
});
const phone=await p.evaluate(()=>{
  const all=document.querySelector('[data-vsellall="1"]');
  const junk=document.querySelector('[data-vselljunk="1"]');
  return {ah:all?all.getBoundingClientRect().height:0, jh:junk?junk.getBoundingClientRect().height:0, at:all&&all.textContent, jt:junk&&junk.textContent};
});
check('the phone targets are at least 44px', phone.ah>=44 && phone.jh>=44 && phone.at==='Sell all' && phone.jt==='Sell junk', phone);

check('no page errors', !errs.length, errs);
await b.close();
console.log(fail.length?'FAIL\n'+fail.join('\n'):'sell-all ok');
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
