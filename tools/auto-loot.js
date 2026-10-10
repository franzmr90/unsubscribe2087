/* Walk-over auto-loot: silent pickup, options, the loot filter, a full pack, old saves.
   node tools/auto-loot.js */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const fail=m=>{console.error(m);process.exitCode=1;throw new Error(m)};

(async()=>{
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:1280,height:800}});
const errs=[];p.on('pageerror',e=>errs.push(e.message||String(e)));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8')+'</body></html>');
await p.waitForTimeout(400);
await p.evaluate(()=>{__g.skipDisc();__g.OPT.noWalk=1});
await p.evaluate(()=>{document.getElementById('title').hidden=true;__g.newGame('scrapper');__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1;__g.G.god=true});
for(let i=0;i<10;i++){
  await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}});
  await p.waitForTimeout(60);
}
await p.evaluate(()=>__g.enter(0));
await p.waitForTimeout(150);
await p.evaluate(()=>{const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()};__g.setMode('play');__g.G.god=true});

const run=await p.evaluate(()=>{
  const g=__g,G=g.G,P=g.P,O=g.OPT,L=g.lootPrefs();
  const tip=()=>{const el=document.getElementById('cmpTip');return !!(el&&!el.hidden)};
  const log=()=>document.getElementById('log').textContent||'';
  const clear=()=>{document.getElementById('log').innerHTML=''};
  const reset=()=>{
    O.autoLoot=true;O.lootStim=true;O.lootCharm=true;O.lootGear=true;O.lootNote=true;O.lootQ=0;
    O.pk0=true;O.pk1=true;O.pk2=true;O.pk3=true;O.pk4=true;O.pkBetter=false;O.autoEq=false;
    L.always=0;L.hideJunk=0;L.minQ=0;L.hold=0;
    G.bag=[];g.W.drops=[];P.warn=0;clear();
  };
  const ring=(name,q,extra)=>{const it=g.makeItem(2,Math.min(q||0,2),'ring');it.q=q||0;it.id=true;it.req=1;it.name=name;it.junk=0;if(extra)Object.assign(it,extra);return it};
  const held=(it)=>G.bag.indexOf(it)>=0||Object.keys(G.eq).some(k=>G.eq[k]===it);
  const defaults={auto:O.autoLoot,stim:O.lootStim,charm:O.lootCharm,gear:O.lootGear,note:O.lootNote,q:O.lootQ|0};
  reset();
  const gear=ring('Rare Ring',2);
  const charm={slot:'charm',charm:1,sz:'slip',q:1,il:1,id:true,req:1,base:'Slip',name:'Test Slip',aff:[{k:'hp',v:4}],val:10};
  const words0=(G.words&&G.words.ledger)||0;
  const stim0=G.stims||0;
  g.W.drops=[
    {it:gear,x:P.x,y:P.y,t:1},
    {it:charm,x:P.x+0.15,y:P.y,t:1},
    {pot:1,x:P.x,y:P.y,t:1},
    {word:'ledger',x:P.x,y:P.y,t:1}
  ];
  g.update(0.05);
  const walk={
    gear:held(gear),charm:G.bag.indexOf(charm)>=0,stim:(G.stims||0)-stim0,word:((G.words&&G.words.ledger)||0)-words0,
    left:g.W.drops.length,tip:tip(),log:log(),flash:(g.W.texts||[]).map(t=>t.txt).join('|')
  };
  reset();
  const far=ring('Far Ring',2);
  const nearNote={word:'margin',x:P.x+1.5,y:P.y,t:1};
  g.W.drops=[{it:far,x:P.x+2,y:P.y,t:1},nearNote];
  const w0=(G.words&&G.words.margin)||0;
  g.update(0.05);
  const reach={far:g.W.drops.some(d=>d.it===far),note:((G.words&&G.words.margin)||0)-w0};
  reset();
  O.autoLoot=false;
  const offGear=ring('Left Ring',2);
  g.W.drops=[{it:offGear,x:P.x,y:P.y,t:1},{sat:5,x:P.x,y:P.y,t:1}];
  const s0=G.sats||0;
  g.update(0.05);
  const master={left:g.W.drops.some(d=>d.it===offGear),sats:(G.sats||0)-s0,tip:tip()};
  reset();
  const cats={};
  O.lootStim=false;g.W.drops=[{pot:1,x:P.x,y:P.y,t:1}];const st=G.stims||0;g.update(0.05);cats.stim=g.W.drops.length===1&&(G.stims||0)===st;
  O.lootStim=true;O.lootCharm=false;const ch=charm;g.W.drops=[{it:ch,x:P.x,y:P.y,t:1}];g.update(0.05);cats.charm=g.W.drops.some(d=>d.it===ch);
  O.lootCharm=true;O.lootGear=false;const lg=ring('No Gear',1);g.W.drops=[{it:lg,x:P.x,y:P.y,t:1}];g.update(0.05);cats.gear=g.W.drops.some(d=>d.it===lg);
  O.lootGear=true;O.lootNote=false;g.W.drops=[{word:'quiet',x:P.x,y:P.y,t:1}];const n0=(G.words&&G.words.quiet)||0;g.update(0.05);cats.note=((G.words&&G.words.quiet)||0)===n0&&g.W.drops.length===1;
  reset();
  O.lootQ=2;
  const white=ring('White Ring',0),magic=ring('Magic Ring',1),rare=ring('Floor Rare',2);
  const quest=ring('Shoebox',0,{quest:1});
  g.W.drops=[white,magic,rare,quest].map(it=>({it,x:P.x,y:P.y,t:1}));
  g.update(0.05);
  const floor={white:g.W.drops.some(d=>d.it===white),magic:g.W.drops.some(d=>d.it===magic),rare:held(rare),quest:held(quest)};
  reset();
  L.minQ=2;
  const hidden=ring('Hidden Magic',1);
  const hd={it:hidden,x:P.x,y:P.y,t:1};
  g.W.drops=[hd];
  g.update(0.05);
  const filtered={stayed:g.W.drops.some(d=>d.it===hidden),auto:g.lootAuto(hd)};
  hd.force=1;g.update(0.05);
  filtered.forced=held(hidden)&&!g.W.drops.some(d=>d.it===hidden);
  L.minQ=0;L.hideJunk=1;
  const junk=ring('Grey Band',1,{junk:1});
  g.W.drops=[{it:junk,x:P.x,y:P.y,t:1}];
  g.update(0.05);
  filtered.junk=g.W.drops.some(d=>d.it===junk);
  reset();
  O.pkBetter=true;
  const worn=g.makeItem(6,2,'weapon');worn.id=true;worn.req=1;worn.q=2;worn.name='Worn Maul';worn.dmin=30;worn.dmax=40;
  G.eq.weapon=worn;
  const weak=g.makeItem(2,1,'weapon');weak.id=true;weak.req=1;weak.q=1;weak.name='Weak Wand';weak.dmin=1;weak.dmax=2;
  g.W.drops=[{it:weak,x:P.x,y:P.y,t:1}];
  g.update(0.05);
  const better={left:g.W.drops.some(d=>d.it===weak)};
  const unid=g.makeItem(3,1,'helm');unid.req=1;unid.q=1;unid.name='Unidentified Helm';unid.id=false;
  const hold=g.makeItem(4,1,'helm');hold.id=true;hold.req=1;hold.q=1;hold.name='Held Helm';
  G.eq.helm=hold;
  g.W.drops=[{it:unid,x:P.x,y:P.y,t:1}];
  g.update(0.05);
  better.unid=held(unid);
  reset();
  O.pk0=false;
  G.eq.gloves=null;
  const empty=g.makeItem(2,0,'gloves');empty.id=true;empty.req=1;empty.q=0;empty.name='Empty Slot Gloves';
  g.W.drops=[{it:empty,x:P.x,y:P.y,t:1}];
  g.update(0.05);
  const legacy={empty:held(empty)};
  O.pk0=true;O.pk1=false;
  const hat=g.makeItem(3,1,'helm');hat.id=true;hat.req=1;hat.q=1;hat.name='On Head';
  G.eq.helm=hat;
  const other=g.makeItem(3,1,'helm');other.id=true;other.req=1;other.q=1;other.name='Struck Helm';
  g.W.drops=[{it:other,x:P.x,y:P.y,t:1}];
  g.update(0.05);
  legacy.struck=g.W.drops.some(d=>d.it===other);
  reset();
  G.bag=[];
  for(let i=0;i<24;i++){const it=ring('Fill '+i,0);G.bag.push(it)}
  const overflow=ring('Overflow',2);
  g.W.drops=[{it:overflow,x:P.x,y:P.y,t:1}];
  P.warn=0;clear();
  g.update(0.05);
  const full={cue:log(),left:g.W.drops.some(d=>d.it===overflow),warn:P.warn,bag:G.bag.length};
  clear();
  const overflow2=ring('Overflow 2',2);
  g.W.drops.push({it:overflow2,x:P.x,y:P.y,t:1});
  g.update(0.05);
  full.again=log();
  full.warn2=P.warn;
  return {defaults,walk,reach,master,cats,floor,filtered,better,legacy,full,errs:[]};
});
if(errs.length)fail('page '+errs.join('\n'));
const d=run.defaults;
if(!(d.auto&&d.stim&&d.charm&&d.gear&&d.note&&d.q===0))fail('defaults '+JSON.stringify(d));
const w=run.walk;
if(!w.gear||!w.charm||w.stim!==1||w.word!==1||w.left||w.tip)fail('walk '+JSON.stringify(w));
if(/item level|On the belt|Identify it first/i.test(w.log))fail('walk opened a description '+w.log);
if(!/Rare Ring|Test Slip|Stim|ledger/.test(w.log+w.flash))fail('no pickup cue '+JSON.stringify(w));
if(run.reach.far!==true||run.reach.note!==1)fail('reach '+JSON.stringify(run.reach));
if(!run.master.left||run.master.sats!==5||run.master.tip)fail('master off '+JSON.stringify(run.master));
if(!run.cats.stim||!run.cats.charm||!run.cats.gear||!run.cats.note)fail('categories '+JSON.stringify(run.cats));
if(!run.floor.white||!run.floor.magic||!run.floor.rare||!run.floor.quest)fail('floor '+JSON.stringify(run.floor));
if(!run.filtered.stayed||run.filtered.auto!==false||!run.filtered.forced||!run.filtered.junk)fail('filter '+JSON.stringify(run.filtered));
if(!run.better.left||!run.better.unid)fail('pkBetter '+JSON.stringify(run.better));
if(!run.legacy.empty||!run.legacy.struck)fail('old pk flags '+JSON.stringify(run.legacy));
if(run.full.cue.indexOf('Pack full')<0||/Your pack is full/.test(run.full.cue)||!run.full.left||!(run.full.warn>2))fail('pack full '+JSON.stringify(run.full));
if(run.full.again)fail('pack full repeated '+JSON.stringify(run.full));

await p.waitForTimeout(3600);
const later=await p.evaluate(()=>({log:document.getElementById('log').textContent||'',warn:__g.P.warn,left:__g.W.drops.some(d=>d.it&&d.it.name==='Overflow')}));
if(later.log.indexOf('Pack full')<0||!later.left)fail('pack full did not return '+JSON.stringify(later));

await p.evaluate(()=>{__g.closeSheet();__g.setMode('play');__g.OPT.autoLoot=true;__g.OPT.lootCharm=true;__g.OPT.lootQ=0;__g.openSheet('opts',{})});
await p.click('[data-opt="autoLoot"]');
await p.click('[data-opt="lootCharm"]');
await p.click('[data-alootq="2"]');
const ui=await p.evaluate(()=>{
  const t=document.getElementById('sheet').textContent;
  return {auto:__g.OPT.autoLoot,charm:__g.OPT.lootCharm,q:__g.OPT.lootQ|0,text:t};
});
if(ui.auto!==false||ui.charm!==false||ui.q!==2)fail('options '+JSON.stringify({auto:ui.auto,charm:ui.charm,q:ui.q}));
if(!/Pick up as you walk/.test(ui.text)||!/Stims/.test(ui.text)||!/Charms/.test(ui.text)||!/Gear/.test(ui.text)||!/Notes/.test(ui.text)||!/Rare and up/.test(ui.text))fail('option labels missing');

await p.setViewportSize({width:390,height:844});
await p.evaluate(()=>{__g.OPT.ui='touch';__g.uiApply(true);__g.drawSheet()});
await p.waitForTimeout(80);
const touch=await p.evaluate(()=>{
  const nodes=[...document.querySelectorAll('.aloot .tog,.aloot .row button')];
  return nodes.map(n=>({t:n.textContent.slice(0,24),h:n.getBoundingClientRect().height}));
});
if(!touch.length||touch.some(n=>n.h<44))fail('touch targets '+JSON.stringify(touch));

const mig=await p.evaluate(()=>{
  const g=__g;
  const base=JSON.parse(JSON.stringify(g.G));
  const load=opt=>{const o=JSON.parse(JSON.stringify(base));return g.applySave({G:o,zs:{},opt})&&{q:g.OPT.lootQ|0,gear:g.OPT.lootGear!==false,auto:g.OPT.autoLoot!==false,pk0:g.OPT.pk0}};
  const prefix=load({pk0:false,pk1:false,pk2:true,pk3:true,pk4:true,pkBetter:true});
  const none=load({pk0:false,pk1:false,pk2:false,pk3:false,pk4:false});
  const kept=load({lootQ:1,autoLoot:false,pk0:false,pk1:true,pk2:true,pk3:true,pk4:true});
  return {prefix,none,kept};
});
if(!mig.prefix||mig.prefix.q!==2||mig.prefix.gear!==true||mig.prefix.auto!==true||mig.prefix.pk0!==false)fail('prefix save '+JSON.stringify(mig.prefix));
if(!mig.none||mig.none.gear!==false||mig.none.q!==3)fail('all-off save '+JSON.stringify(mig.none));
if(!mig.kept||mig.kept.q!==1||mig.kept.auto!==false)fail('explicit save '+JSON.stringify(mig.kept));

if(errs.length)fail('page '+errs.join('\n'));
console.log('auto-loot ok');
await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
