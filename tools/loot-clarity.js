/* Pickup filters, the lockbox, scrap, and the satoshi card.
   node tools/loot-clarity.js [outdir] */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const OUT=process.argv[2];
const fail=m=>{console.error(m);process.exitCode=1;throw new Error(m)};
const root=path.join(__dirname,'..');

(async()=>{
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.stack||String(e)));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8')+'</body></html>');
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

const filters=await p.evaluate(()=>{
  const g=__g,P=g.P;
  const wear=g.makeItem(2,0,'weapon');wear.id=true;wear.req=1;g.G.eq.weapon=wear;
  const held=()=>g.G.bag.length+(g.G.charms||[]).length;
  const drop=(it,opt)=>{Object.assign(g.OPT,opt);g.W.drops=[{it,x:P.x,y:P.y,t:1}];const before=held();g.update(0.05);const left=g.W.drops.some(d=>d.it===it);return {left,took:held()-before}};
  const rare=g.makeItem(6,2,'weapon');
  const struck=drop(rare,{pk2:false,pkBetter:false});
  const judged=drop(g.makeItem(6,2,'weapon'),{pk2:true,pkBetter:true});
  g.G.eq.helm=null;
  const empty=drop(Object.assign(g.makeItem(2,0,'helm'),{id:true,req:1}),{pk0:false,pkBetter:false});
  const sub=drop({slot:'charm',charm:1,q:1,il:1,id:true,req:1,base:'Lapsed Subscription',name:'Lapsed Test Subscription',aff:[{k:'hp',v:4}],val:10,on:false},{pk1:false,pkBetter:false});
  return {rareId:rare.id,struck,judged,empty,sub,charms:g.G.charms.length};
});
if(filters.rareId)fail('rare came identified');
if(!filters.struck.left)fail('struck rare was picked up '+JSON.stringify(filters.struck));
if(filters.judged.left)fail('better-only left an unidentified rare');
if(filters.empty.left)fail('empty slot left a struck white');
if(filters.sub.left||filters.charms<1)fail('subscription was filtered '+JSON.stringify(filters.sub));

await p.evaluate(()=>__g.openSheet('items',{}));
await p.waitForTimeout(80);
const hint=await p.evaluate(()=>{const el=[...document.querySelectorAll('#sheet p')].find(n=>/Struck-out tiers/.test(n.textContent));el&&el.scrollIntoView({block:'center'});return el?el.textContent:''});
if(!/named or not/.test(hint)||!/Subscriptions are picked up anyway/.test(hint))fail('pickup hint '+hint);
if(/still picked up\./.test(hint))fail('old unidentified sentence');
if(OUT)await p.screenshot({path:path.join(OUT,'loot-pickup.png')});

const box=await p.evaluate(()=>{
  const g=__g;g.closeSheet();
  g.G.credits=1000;g.G.cpi=2;g.ACC.cr=0;g.ACC.sats=0;g.G.sats=7;
  g.openSheet('stash',{only:['stash']});
  return document.querySelector('[data-acc="ciall"]')&&document.querySelector('[data-acc="siall"]');
});
if(!box)fail('lockbox buttons missing');
await p.click('[data-acc="ciall"]');
await p.click('[data-acc="siall"]');
const dep=await p.evaluate(()=>({cr:__g.ACC.cr,sats:__g.ACC.sats,held:__g.G.sats,credits:__g.G.credits}));
if(dep.cr!==450||dep.credits!==0)fail('credit custody '+JSON.stringify(dep));
if(dep.sats!==7||dep.held!==0)fail('sat custody '+JSON.stringify(dep));
await p.click('[data-acc="coall"]');
const back=await p.evaluate(()=>__g.G.credits);
if(back!==900)fail('withdraw '+back);
const moved=await p.evaluate(()=>{
  const it=__g.makeItem(8,1,'boots');it.id=true;it.req=40;it.name='LATE-BOOT';
  __g.G.bag=[it];__g.drawSheet();
  document.querySelector('[data-sb="0"]').click();
  const st=__g.ACC.stash.map(x=>x&&x.name);
  return {lvl:__g.G.lvl,st,bag:__g.G.bag.length};
});
if(moved.lvl>=40||moved.st[0]!=='LATE-BOOT'||moved.bag!==0)fail('level blocked the move '+JSON.stringify(moved));
const line=await p.evaluate(()=>document.getElementById('sheet').innerText);
if(!/Wearing it still needs the level/.test(line))fail('stash line');
if(OUT)await p.screenshot({path:path.join(OUT,'loot-stash.png')});

const scrap=await p.evaluate(()=>{
  __g.closeSheet();
  const g=__g,out={};
  const w=g.makeItem(3,0,'gloves');w.id=true;g.G.bag=[w];g.G.parts=0;g.craft(w,'scrap');out.white=g.G.parts;
  const r=g.makeItem(8,2,'belt');r.id=true;g.G.bag=[r];g.G.parts=0;g.craft(r,'scrap');out.rare=g.G.parts;
  const u=g.UNI.find(x=>x.id==='handshake');
  const glove=g.mkFixed(u,16,4);g.G.bag=[glove];g.G.parts=0;g.craft(glove,'scrap');out.unique=g.G.parts;out.sp=u.sp;
  g.G.charms=[{slot:'charm',charm:1,q:1,il:1,id:true,req:1,name:'Lapsed Test',base:'Lapsed Subscription',aff:[],val:10,on:false}];
  g.G.parts=0;g.openSheet('items',{});
  document.querySelector('[data-ch="0"]').click();
  const btn=[...document.querySelectorAll('[data-chdo="scrap"]')].map(b=>b.textContent);
  document.querySelector('[data-chdo="scrap"]').click();
  out.charm=g.G.parts;out.btn=btn;
  return out;
});
if(scrap.white!==1||scrap.rare!==4||scrap.unique!==15)fail('scrap parts '+JSON.stringify(scrap));
if(scrap.charm!==2||scrap.btn[0]!=='Scrap · 2 parts')fail('charm scrap '+JSON.stringify(scrap));
if(!/Ordinary machines/.test(scrap.sp)||!/13%/.test(scrap.sp))fail('handshake '+scrap.sp);

await p.evaluate(()=>{__g.closeSheet();__g.openSheet('codex',{})});
await p.waitForTimeout(80);
const codex=await p.evaluate(()=>{const el=[...document.querySelectorAll('#sheet p')].find(n=>/Satoshis/.test(n.textContent));el&&el.scrollIntoView({block:'center'});return el?el.textContent:''});
if(!/Vale \(42\)/.test(codex)||!/lockbox you open in a district \(2–5\)/.test(codex))fail('codex '+codex);
if(OUT)await p.screenshot({path:path.join(OUT,'loot-codex.png')});

const toast=await p.evaluate(()=>{
  const it={slot:'charm',charm:1,q:1,il:1,id:true,req:1,name:'Lapsed Toast',base:'Lapsed Subscription',aff:[],val:10};
  __g.closeSheet();
  __g.G.bag=[it];
  __g.openSheet('items',{});
  const cell=document.querySelector('[data-bag="0"]');
  cell.click();cell.click();
  return document.getElementById('log').textContent;
});
if(!/not worn/.test(toast))fail('charm toast '+toast);

const sold=await p.evaluate(()=>{
  __g.closeSheet();__g.setMode('play');
  const belt=__g.makeItem(4,1,'belt');belt.id=true;belt.val=10;belt.name='FRACTION BELT';belt.q=1;
  __g.G.bag=[belt];__g.G.cpi=1.15;__g.G.credits=100;__g.G.charms=[];
  __g.openSheet('items',{only:['items','shop']});
  return true;
});
if(!sold)fail('sell sheet');
await p.click('[data-bag="0"]');
await p.waitForTimeout(400);
const oneBtn=await p.evaluate(()=>{const b=document.querySelector('[data-do="sell"]');return b?b.textContent:''});
await p.click('[data-do="sell"]');
const one=await p.evaluate(()=>({credits:__g.G.credits,bag:__g.G.bag.length}));
if(oneBtn!=='Sell ₡4'||one.credits!==104||one.bag!==0)fail('one sale '+JSON.stringify({oneBtn,one}));

const bulk=await p.evaluate(()=>{
  const a=__g.makeItem(4,1,'belt');a.id=true;a.val=10;a.q=1;
  const b=__g.makeItem(4,1,'gloves');b.id=true;b.val=10;b.q=1;
  __g.G.bag=[a,b];__g.G.cpi=1.15;__g.G.credits=200;
  __g.drawSheet();
  const btn=[...document.querySelectorAll('[data-sellq="-1"]')].map(x=>x.textContent);
  return {btn};
});
if(!/₡8/.test(bulk.btn[0]||''))fail('bulk label '+JSON.stringify(bulk));
await p.click('[data-sellq="-1"]');
await p.click('[data-sellq="-1"]');
const pair=await p.evaluate(()=>({credits:__g.G.credits,bag:__g.G.bag.length,log:document.getElementById('log').textContent}));
if(pair.credits!==208||pair.bag!==0||!/₡8/.test(pair.log))fail('bulk sale '+JSON.stringify(pair));

const charm=await p.evaluate(()=>{
  __g.G.charms=[{slot:'charm',charm:1,q:1,il:1,id:true,req:1,name:'Fraction Sub',base:'Lapsed Subscription',aff:[],val:10,on:false}];
  __g.G.credits=50;__g.G.cpi=1.15;
  __g.drawSheet();
  return true;
});
if(!charm)fail('charm sheet');
await p.click('[data-ch="0"]');
const chBtn=await p.evaluate(()=>{const b=document.querySelector('[data-chdo="sell"]');return b?b.textContent:''});
await p.click('[data-chdo="sell"]');
const ch=await p.evaluate(()=>({credits:__g.G.credits,n:__g.G.charms.length}));
if(chBtn!=='Sell ₡4'||ch.credits!==54||ch.n!==0)fail('charm sale '+JSON.stringify({chBtn,ch}));

if(errs.length)fail(errs[0]);
console.log('loot-clarity ok');
await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
