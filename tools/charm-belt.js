/* Belt charms: migration, the 12–16% power targets, no stacks, PvP caps.
   node tools/charm-belt.js [shot-dir] */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const shots=process.argv[2]||'';
const fail=[];
const check=(n,ok,d)=>{if(!ok)fail.push(n+(d?': '+d:''));console.log((ok?'ok  ':'FAIL')+' '+n+(d&&!ok?' — '+d:''));};

(async()=>{
const html=fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8');
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:1280,height:800}});
const errs=[];p.on('pageerror',e=>errs.push(String(e).split('\n')[0]));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
await p.waitForTimeout(400);
await p.evaluate(()=>{__g.skipDisc();__g.OPT.noWalk=1});
await p.evaluate(()=>{document.getElementById('title').hidden=true;__g.newGame('scrapper');__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1});
for(let i=0;i<12;i++){
  await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}});
  await p.waitForTimeout(50);
}
await p.evaluate(()=>__g.enter(0));
await p.waitForTimeout(120);
await p.evaluate(()=>{const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()};__g.setMode('play')});

const bal=await p.evaluate(()=>{
  const g=__g,G=g.G;
  const quiet=(lvl)=>{
    G.cls='scrapper';G.lvl=lvl;G.sk=Array(15).fill(0);G.web={};G.doc=null;G.para=0;G.tpP=0;G.tpT=0;G.hc=false;G.merc=null;G.form=null;
    G.at={mgt:0,ref:0,vit:0,bnd:0};G.pas=[];G.cslots=[];G.eq={};G.bag=[];
  };
  const belt=(base,cap,csl)=>G.eq.belt={slot:'belt',base,name:base,id:true,req:1,il:G.lvl,q:0,cap,csl,aff:[]};
  const edOf=ed=>{quiet(G.lvl);G.eq.weapon={slot:'weapon',id:true,req:1,il:G.lvl,q:1,dmin:8,dmax:12,aff:[{k:'dmg',v:ed}],name:'Kit',base:'Pipe'};};
  const slips=(n,v)=>{G.cslots=[];for(let i=0;i<n;i++)G.cslots.push(g.mkCharm(G.lvl,{sz:'slip',aff:[{k:'dmg',v}],req:1,name:'ED '+v}));};
  const ratio=(added,kit)=>added/(100+kit);
  G.lvl=30;
  edOf(96);belt('Tool Belt',8,2);g.calc();const cathKit=g.S.dmg;
  slips(2,14);g.calc();const cath=g.S.dmg;
  G.lvl=78;
  edOf(767);belt('Orbit Girdle',12,4);g.calc();const roomKit=g.S.dmg;
  slips(4,31);g.calc();const room=g.S.dmg;
  G.lvl=14;
  edOf(85);belt('Zip-Tie Sash',6,1);g.calc();const sashKit=g.S.dmg;
  slips(1,16);g.calc();const sash=g.S.dmg;
  const lifeAt=(lvl,hpAff,n,each,base,cap,csl)=>{
    quiet(lvl);
    G.eq.armor={slot:'armor',id:true,req:1,il:lvl,q:1,arm:30,aff:[{k:'hp',v:hpAff}],name:'Plate',base:'Vest'};
    belt(base,cap,csl);g.calc();const pre=g.S.maxHp;
    G.cslots=[];for(let i=0;i<n;i++)G.cslots.push(g.mkCharm(lvl,{sz:'slip',aff:[{k:'hp',v:each}],req:1}));
    g.calc();return {pre,hp:g.S.maxHp,ch:g.S.chHp,sheet:g.S.preHp};
  };
  const roomL=lifeAt(78,1507,4,100,'Orbit Girdle',12,4);
  const cathL=lifeAt(14,428,2,50,'Tool Belt',8,2);
  const odds={
    n:g.charmOdds('ord',0),h:g.charmOdds('ord',1),b:g.charmOdds('ord',2),
    cn:g.charmOdds('champ',0),ch:g.charmOdds('champ',1),cb:g.charmOdds('champ',2),
    su:g.charmOdds('su',0),chest:g.charmOdds('chest',2)
  };
  return {cathKit,cath,roomKit,room,sashKit,sash,roomL,cathL,
    cathR:ratio(cath-cathKit,cathKit),roomR:ratio(room-roomKit,roomKit),sashR:ratio(sash-sashKit,sashKit),
    roomLR:roomL.ch/roomL.sheet,cathLR:cathL.ch/cathL.sheet,odds};
});
const band=(r)=>r>=0.12&&r<=0.16;
check('cathedral kit ED is the weapon affix before charms', bal.cathKit===96, JSON.stringify(bal));
check('cathedral two 14% slips are 12–16% of sheet damage', band(bal.cathR)&&bal.cath===bal.cathKit+28, bal.cathR.toFixed(4)+' kit '+bal.cathKit);
check('the room four 31% slips are 12–16% of sheet damage', band(bal.roomR)&&bal.room===bal.roomKit+124, bal.roomR.toFixed(4)+' kit '+bal.roomKit);
check('a sash with one 16% slip is 8–12% of sheet damage', bal.sashR>=0.08&&bal.sashR<=0.12&&bal.sash===bal.sashKit+16, bal.sashR.toFixed(4));
check('four 100 life slips are 12–16% of pre-charm life', band(bal.roomLR), bal.roomLR.toFixed(4)+' pre '+bal.roomL.sheet+' ch '+bal.roomL.ch);
check('cathedral two 50 life slips are 12–16% of pre-charm life', band(bal.cathLR), bal.cathLR.toFixed(4)+' pre '+bal.cathL.sheet);
check('ordinary and champion charm odds match the table',
  bal.odds.n.slip===0.015&&bal.odds.n.notice===0&&bal.odds.n.filing===0&&
  bal.odds.h.slip===0.02&&bal.odds.h.notice===0.003&&bal.odds.h.filing===0&&
  bal.odds.b.slip===0.02&&bal.odds.b.notice===0.006&&bal.odds.b.filing===0.001&&
  bal.odds.cn.slip===0.08&&bal.odds.cn.notice===0.02&&bal.odds.cn.filing===0&&
  bal.odds.cb.slip===0.06&&bal.odds.cb.notice===0.05&&bal.odds.cb.filing===0.03&&
  bal.odds.su.slip===0.1&&bal.odds.su.notice===0.08&&bal.odds.su.filing===0.02&&
  bal.odds.chest.filing===0.03, JSON.stringify(bal.odds));

const pvp=await p.evaluate(()=>{
  const g=__g,G=g.G,W=g.W;
  G.cls='scrapper';G.lvl=60;G.sk=Array(15).fill(0);G.sk[0]=1;G.web={};G.doc=null;G.para=0;G.at={mgt:0,ref:0,vit:0,bnd:0};G.pas=[];G.eq={};
  G.eq.belt={slot:'belt',base:'Orbit Girdle',name:'Orbit Girdle',id:true,req:1,il:40,q:0,cap:12,csl:4,aff:[]};
  const letter=g.mkLetter('scrapper',45),churn=g.mkChurn(60);
  G.cslots=[letter,churn];
  g.calc();
  const pve=g.charmRanks(0);
  const small=g.mkCharm(20,{aff:[{k:'hp',v:1}],req:1});
  const big=g.mkCharm(20,{aff:[{k:'hp',v:4000}],req:1});
  G.cslots=[small];g.calc();const under=g.pvpLifeMul();
  G.cslots=[big];g.calc();const over=g.pvpLifeMul();const ch=g.S.chHp,pre=g.S.preHp;
  W.ents.push({mp:1,hp:20,x:1,y:1});
  G.cslots=[letter,churn];g.calc();
  const capped=g.charmRanks(0);
  W.ents.pop();
  return {pve,capped,under,over,ch,pre,letter:letter.aff.find(a=>a.k==='skills').v,churn:churn.aff.find(a=>a.k==='skills').v};
});
check('PvE charm skills add, and a duel clamps them at +2', pvp.pve===3&&pvp.capped===2, JSON.stringify(pvp));
check('charm life under 20% does not change a player hit, and the excess does', pvp.under===1&&pvp.over>1&&pvp.ch>pvp.pre*0.2, JSON.stringify(pvp));

const mig=await p.evaluate(()=>{
  const g=__g,G0=g.G;
  const ring=()=>({slot:'ring',id:true,req:1,il:1,q:0,name:'Band',base:'Band',aff:[],val:1});
  const slip=(k,v,on)=>({slot:'charm',charm:1,q:1,il:10,id:true,req:1,name:k+'+'+v,aff:[{k,v}],on:on?1:0,val:40});
  g.ACC.stash=[];g.ACC.charmBox=1;g.ACC.sats=0;
  g.applySave({G:{cls:'scrapper',lvl:12,hp:80,credits:5,cpi:1,sats:3,sk:[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],at:{mgt:0,ref:0,vit:0,bnd:0},
    bag:[slip('mf',9,0)],eq:{},q:{q1:3},stims:0,kills:1,deaths:0,zone:0}});
  g.startPlay();
  const bare={charms:(g.G.charms||[]).length,bag:g.G.bag.filter(i=>i&&i.charm).length,slots:(g.G.cslots||[]).length,sats:g.G.sats,roll:g.G.bag.find(i=>i&&i.charm)};
  const pile=[slip('hp',20,1),slip('dmg',10,1),slip('mf',5,1),slip('dmg',30,0)];
  const stacked=slip('hp',7,0);stacked.qty=99;stacked.q=99;stacked.stack=99;pile.push(stacked);
  g.ACC.stash=Array.from({length:36},ring);g.ACC.charmBox=0;
  g.applySave({G:{cls:'scrapper',lvl:20,hp:100,credits:5,cpi:1,sats:10,sk:Array(15).fill(0),at:{mgt:0,ref:0,vit:0,bnd:0},
    charms:pile,bag:Array.from({length:24},ring),
    eq:{belt:{slot:'belt',base:'Tool Belt',name:'Tool Belt',id:true,req:1,il:12,q:0,cap:8,csl:2,aff:[]}},
    q:{q1:3},stims:1,kills:2,deaths:0,zone:0}});
  g.startPlay();
  const G=g.G;
  const worn=(G.cslots||[]).map(it=>it&&it.aff&&it.aff[0]);
  const all=[].concat(G.cslots||[],G.bag||[],g.ACC.stash||[]).filter(it=>it&&it.charm);
  const sats=G.sats;
  g.startPlay();
  return {bare,worn,n:all.length,qty:all.some(it=>it.qty||it.stack),sats,again:G.sats,gone:G.charms,off:G.charmOff,chT:G.chT,flag:G.charmMigrated,box:g.ACC.charmBox};
});
check('with no belt, a migrated charm stays in the pack and the roll is kept', mig.bare.charms===0&&mig.bare.slots===0&&mig.bare.bag===1&&mig.bare.sats===3&&mig.bare.roll&&mig.bare.roll.aff[0].v===9, JSON.stringify(mig.bare));
check('a tool belt keeps the worn life and damage rolls and leaves the rest', mig.worn.length===2&&mig.worn[0].k==='hp'&&mig.worn[0].v===20&&mig.worn[1].k==='dmg'&&mig.worn[1].v===10, JSON.stringify(mig.worn));
check('overflow refunds 2 sats each, a quantity of 99 stays one charm, and a second load does not pay again', mig.n===2&&mig.qty===false&&mig.sats===16&&mig.again===16&&mig.gone===undefined&&mig.off===undefined&&mig.chT===undefined, JSON.stringify({n:mig.n,sats:mig.sats,again:mig.again,qty:mig.qty}));

const stack=await p.evaluate(()=>{
  const g=__g,G=g.G;
  const a=g.mkCharm(12,{aff:[{k:'hp',v:11}],name:'Twin'});
  const b=g.mkCharm(12,{aff:[{k:'hp',v:11}],name:'Twin'});
  b.qty=99;b.stack=4;b.count=4;b.num=4;
  G.bag=[a,b];
  g.charmNormalize(a);g.charmNormalize(b);
  const before=G.bag.length;
  G.bag.push(a);
  return {before,after:G.bag.length,qty:b.qty,stack:b.stack,count:b.count,num:b.num,q:b.q};
});
check('nothing merges two charms, and normalize drops a quantity', stack.before===2&&stack.after===3&&stack.qty===undefined&&stack.stack===undefined&&stack.count===undefined&&stack.num===undefined&&stack.q>=0&&stack.q<=4, JSON.stringify(stack));

const drops=await p.evaluate(()=>{
  const g=__g,G=g.G,W=g.W;
  const town=W.z.town,sim=W.z.sim;
  W.z.town=0;W.z.sim=0;W.zi=1;W.ml=10;G.diff=0;G.bcharm={};
  const n0=W.drops.length;
  g.charmOnKill({k:'boss',x:2,y:2});
  const first=W.drops.slice(n0).map(d=>d.it);
  g.charmOnKill({k:'boss',x:2,y:2});
  const second=W.drops.length-n0-first.length;
  G.diff=1;G.bcharm={};g.ACC.letter=0;W.zi=22;
  const n1=W.drops.length;
  g.charmOnKill({k:'boss4',x:2,y:2});
  const letter=W.drops.slice(n1).map(d=>d.it);
  G.diff=2;G.bcharm={};g.ACC.churn=0;
  const n2=W.drops.length;
  g.charmOnKill({k:'boss5',x:2,y:2});
  const churn=W.drops.slice(n2).map(d=>d.it);
  W.z.town=1;
  const n3=W.drops.length;
  g.charmOnKill({k:'bot',x:2,y:2,champ:1});
  const townDrop=W.drops.length-n3;
  W.z.town=town;W.z.sim=sim;
  return {first:first.map(it=>it&&it.sz),second,letter:letter.map(it=>it&&(it.uid||it.sz)),churn:churn.map(it=>it&&(it.uid||it.sz)),townDrop,letterFlag:g.ACC.letter,churnFlag:g.ACC.churn};
});
check('the first Act I boss kill on Normal drops one slip and the next does not', drops.first.length===1&&drops.first[0]==='slip'&&drops.second===0, JSON.stringify(drops));
check('the first Hard Curator kill also drops a tradable letter', drops.letter.includes('letter')&&drops.letterFlag===1, JSON.stringify(drops.letter));
check('the first Brutal PROVIDENCE kill also drops a tradable churn notice', drops.churn.includes('churn')&&drops.churnFlag===1, JSON.stringify(drops.churn));
check('a town kill drops no charm', drops.townDrop===0, String(drops.townDrop));

if(shots){
  fs.mkdirSync(shots,{recursive:true});
  await p.evaluate(()=>{
    const g=__g,G=g.G;
    const d=document.getElementById('dlg');if(d)d.hidden=true;
    const s=document.getElementById('scene');if(s)s.hidden=true;
    g.setMode('play');
    G.lvl=40;G.cls='scrapper';G.stims=4;
    G.eq=G.eq||{};
    G.eq.belt={slot:'belt',base:'Orbit Girdle',name:'Orbit Girdle',id:true,req:1,il:40,q:0,cap:12,csl:4,aff:[]};
    G.cslots=[
      g.mkCharm(40,{sz:'slip',aff:[{k:'dmg',v:31}],req:1,name:'Sharpened Slip'}),
      g.mkCharm(40,{sz:'notice',aff:[{k:'hp',v:80},{k:'mf',v:12}],req:1,name:'Living Notice'})
    ];
    G.bag=[g.mkCharm(40,{sz:'filing',aff:[{k:'skills',v:1}],req:1,name:'Adept Filing'}),g.makeItem(12,1,'ring')];
    G.bag[1].id=true;
    g.calc();
    g.openSheet('items',{});
  });
  await p.waitForTimeout(200);
  const belt=await p.evaluate(()=>{
    const row=document.querySelector('.beltRow');
    if(row)row.scrollIntoView({block:'start'});
    const note=document.querySelector('.beltNote');
    const head=[...document.querySelectorAll('#sheet h3')].map(e=>e.textContent).find(t=>/charms/.test(t))||'';
    const filing=document.querySelector('#bagGrid .cell.grand, #bagGrid .cell.ch');
    return {head,note:note?note.textContent:'',slots:document.querySelectorAll('.beltRow [data-cs], .beltRow [data-csocket]').length,filing:!!filing,shake:!!document.querySelector('.beltRow')};
  });
  check('the items sheet shows the belt, its empty slot, and a charm in the pack', /3\/4 charms/.test(belt.head)&&/4\/12 stims/.test(belt.head)&&belt.slots===3&&belt.filing&&/do not stack/.test(belt.note), JSON.stringify(belt));
  await p.screenshot({path:path.join(shots,'charm-belt-desktop.png')});
  await p.click('.beltRow [data-cs="0"]');
  await p.waitForTimeout(150);
  const card=await p.evaluate(()=>document.getElementById('pop').innerText);
  check('a worn charm’s card says it applies and names its slots', /On the belt/.test(card)&&/1 belt slot/.test(card)&&/1 pack cell/.test(card)&&/sharpened slip/i.test(card), card.slice(0,280));
  await p.screenshot({path:path.join(shots,'charm-card-desktop.png')});
  await p.setViewportSize({width:390,height:844});
  await p.evaluate(()=>{const d=document.getElementById('pop');if(d)d.hidden=true;__g.sel&&0;const s=document.querySelector('.beltRow');if(s)s.scrollIntoView({block:'start'});});
  await p.waitForTimeout(100);
  await p.screenshot({path:path.join(shots,'charm-belt-mobile.png')});
  await p.click('.beltRow [data-cs="1"]');
  await p.waitForTimeout(150);
  const mobileCard=await p.evaluate(()=>document.getElementById('pop').innerText);
  check('the notice card names two slots and two cells', /2 belt slots/.test(mobileCard)&&/2 pack cells/.test(mobileCard), mobileCard.slice(0,240));
  await p.screenshot({path:path.join(shots,'charm-card-mobile.png')});
}

check('no page errors', !errs.length, errs.join(' | '));
await b.close();
if(fail.length){console.error(fail.join('\n'));process.exit(1);}
console.log('charm-belt ok');
})().catch(e=>{console.error(e);process.exit(1)});
