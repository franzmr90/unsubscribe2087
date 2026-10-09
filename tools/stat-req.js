/* Stat requirements and per-blow scaling.
   node tools/stat-req.js
   Red-requirement shots: /opt/cursor/artifacts/stat-req-tile.png
   and stat-req-compare.png */
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
      return 'clear'});
    if(st==='clear')return;
    await p.waitForTimeout(st==='locked'?350:160);
  }
  throw new Error('overlays did not clear');
}

(async()=>{
const html=fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8');
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
await p.waitForTimeout(300);
await p.evaluate(()=>__g.skipDisc());
await p.waitForTimeout(150);
await p.click('[data-cls=scrapper]');
await p.waitForTimeout(200);
await p.evaluate(()=>{__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1});
await clearUI(p);
await p.evaluate(()=>__g.enter(1));
await clearUI(p);
await p.evaluate(()=>__g.setMode('play'));

const report=await p.evaluate(()=>{
  const fail=[],note=[];
  const check=(n,ok,extra)=>{if(!ok)fail.push(n+(extra!==undefined?': '+JSON.stringify(extra):''));else note.push(n)};
  const g=__g,G=g.G,P=g.P;
  function wipe(){
    G.cls='scrapper';G.lvl=30;G.sk=Array(15).fill(0);G.sk[0]=1;G.pas=[];G.slots=[0,-1,-1];G.web={};G.doc=null;
    G.at={mgt:0,ref:0,vit:0,bnd:0};G.ap=0;G.cslots=[];G.merc=null;G.diff=0;
    if(G.mouse){G.mouse.L=-1;G.mouse.R=0}
    P.hitSk=-1;P.allySwing=0;P.areaTick=0;P.blowForce=null;P.swingBody=null;P.orders=0;P.bear=0;P.book=0;
    for(const sl of ['weapon','helm','armor','gloves','boots','belt','ring','amulet'])G.eq[sl]=null;
    G.bag=[];g.calc();
  }
  function piece(slot,base,il,extra){
    extra=extra||{};
    const it=Object.assign({slot,base,name:base,il,q:extra.q||0,id:true,aff:[],spd:extra.spd||0,req:Math.max(1,Math.floor(il*.75)),dmin:extra.dmin||12,dmax:extra.dmax||20,arm:slot==='armor'?40:0},extra);
    g.stampReq(it);return it;
  }
  function reqOf(it){return [it.reqMgt||0,it.reqRef||0,it.reqBnd||0]}

  const table=[
    ['Bent Rebar','weapon',3,0,0,[7,0,0]],
    ['Stop Sign','weapon',3,-20,0,[13,0,0]],
    ['Box Cutter','weapon',3,25,0,[0,10,0]],
    ['Signal Baton','weapon',10,0,0,[13,0,0]],
    ['Girder Maul','weapon',10,-20,0,[24,0,0]],
    ['Mono Blade','weapon',10,25,0,[0,20,0]],
    ['Arc Sceptre','weapon',18,0,0,[20,0,0]],
    ['Wrecking Hammer','weapon',18,-20,0,[37,0,0]],
    ['Phase Razor','weapon',18,25,0,[0,30,0]],
    ['Null Sceptre','weapon',40,0,0,[40,0,0]],
    ['Titan Maul','weapon',40,-20,0,[72,0,0]],
    ['Void Razor','weapon',40,25,0,[0,60,0]],
    ['Hi-Vis Vest','armor',3,0,0,[1,0,0]],
    ['Padded Hoodie','armor',6,0,0,[3,0,0]],
    ['Flak Coat','armor',6,0,0,[13,0,0]],
    ['Exo Plate','armor',18,0,0,[27,0,0]],
    ['Cloud Mantle','armor',40,0,0,[18,0,0]],
    ['Seraph Plate','armor',40,0,0,[52,0,0]],
    ['Halo Circuit','helm',40,0,0,[31,0,0]],
    ['Worn Sneakers','boots',3,0,0,[0,1,0]],
    ['Skywalkers','boots',40,0,0,[0,14,0]],
    ['Orbit Girdle','belt',40,0,0,[16,0,0]],
    ['Picket Maul','weapon',40,-15,'sign',[72,0,0]],
    ['Zero-Day Rig','weapon',40,0,'deck',[0,0,40]],
    ['Last-Mile Cannon','weapon',40,15,'sling',[0,60,0]],
    ['Null Edge','weapon',40,8,'shiv',[0,32,0]],
    ['Cap Table','weapon',40,0,'pager',[0,0,40]],
    ['Combine Blade','weapon',40,0,'graft',[40,0,0]],
    ['The Seventh Part','weapon',40,0,'notebook',[20,0,0]],
    ['Copper Band','ring',10,0,0,[0,0,0]]
  ];
  for(const row of table){
    const it=piece(row[1],row[0],row[2],{spd:row[3],fam:row[4]||undefined});
    const got=reqOf(it);
    check(row[0]+' il '+row[2],got[0]===row[5][0]&&got[1]===row[5][1]&&got[2]===row[5][2],{got,want:row[5]});
  }
  const uniq=piece('weapon','Titan Maul',40,{spd:-20,q:4});
  check('unique maul is +10%',reqOf(uniq)[0]===79,{got:reqOf(uniq)});
  const magic=piece('weapon','Titan Maul',40,{spd:-20,q:1});
  check('magic inherits the base',reqOf(magic)[0]===72);
  const indemnity=g.mkFixed(g.UNI.find(u=>u.id==='indemnity'),68,4);
  check('Indemnity wants 92 Might',indemnity.reqMgt===92&&!indemnity.reqRef&&!indemnity.reqBnd,{m:indemnity.reqMgt,r:indemnity.reqRef,b:indemnity.reqBnd,base:indemnity.base});
  const majeure=g.mkFixed(g.UNI.find(u=>u.id==='majeure'),70,4);
  check('Force Majeure wants 111 Reflex',majeure.reqRef===111&&!majeure.reqMgt&&!majeure.reqBnd,{m:majeure.reqMgt,r:majeure.reqRef,b:majeure.reqBnd,base:majeure.base,spd:majeure.spd});

  wipe();
  const old={slot:'weapon',name:'Kept Rebar',base:'Bent Rebar',il:10,q:1,id:true,aff:[{k:'dmg',v:25}],dmin:14,dmax:22,spd:0,req:1};
  G.eq.weapon=old;g.calc();
  check('old save with no req fields still hits',g.S.dmin===14&&!g.gearQuiet(old)&&g.canWear(old),{dmin:g.S.dmin,quiet:g.gearQuiet(old)});

  wipe();
  G.lvl=40;G.at.mgt=80;
  const maul=piece('weapon','Titan Maul',40,{spd:-20,dmin:30,dmax:50});
  G.eq.weapon=maul;g.calc();
  check('met maul grants its damage',g.S.dmin===30&&!g.gearQuiet(maul));
  G.at.mgt=0;g.calc();
  check('unmet maul stays equipped and grants nothing',G.eq.weapon===maul&&g.S.dmin===2&&g.S.dmax===4&&g.gearQuiet(maul),{dmin:g.S.dmin,dmax:g.S.dmax});
  const lines=g.itemLines(maul);
  check('card prints the Might line in red',lines.indexOf('Required Might: 72')>=0&&lines.indexOf('class="ln red"')>=0&&lines.indexOf('need +72')>=0);
  G.bag=[maul];G.eq.weapon=null;g.calc();
  const ev=g.cmpEval(maul);
  check('compare blocks on the stat',ev.blocked==='req'&&ev.why==="Can't equip. Need +72 Might.",{blocked:ev.blocked,why:ev.why});
  const html=g.cmpHTML(maul);
  check('compare note names the shortfall',html.indexOf("Can't equip. Need +72 Might.")>=0&&html.indexOf('Your sheet does not change.')>=0);
  const cell=document.createElement('div');
  // badge text through the real gate
  check('badge names the shortfall',g.cantEquipText(maul).indexOf('Need +72 Might')>=0);

  wipe();
  G.lvl=40;G.at.mgt=0;
  const self=piece('weapon','Titan Maul',40,{spd:-20,aff:[{k:'mgt',v:72}]});
  check('the piece’s own Might counts',g.canWear(self),{short:g.reqShortfall(self)});
  const charm={aff:[{k:'mgt',v:80}],req:1,id:true,charm:1};
  G.cslots=[charm];
  G.eq.belt=piece('belt','Orbit Girdle',10);
  const bare=piece('weapon','Titan Maul',40,{spd:-20});
  check('a belt charm counts toward the maul',g.canWear(bare));
  G.eq.belt.duraMax=20;G.eq.belt.dura=0;
  check('a broken belt contributes no charm',!g.canWear(bare));
  G.eq.belt.dura=20;G.cslots=[];
  const helm=piece('helm','Halo Circuit',10,{aff:[{k:'mgt',v:80}],duraMax:20,dura:0});
  G.eq.helm=helm;
  check('a broken helm does not lend its Might',!g.canWear(bare)&&g.gearQuiet(helm)===false);

  wipe();
  G.cls='scrapper';G.at={mgt:10,ref:0,vit:0,bnd:40};g.calc();
  check('Scrapper swing reads Might',g.S.blow===15,{blow:g.S.blow});
  G.at.mgt=0;g.calc();
  check('Scrapper Bandwidth is not damage',g.S.blow===0,{blow:g.S.blow});
  G.cls='hacker';G.at={mgt:40,ref:0,vit:0,bnd:10};g.calc();
  check('Technomancer swing reads Bandwidth',g.S.blow===15,{blow:g.S.blow});
  G.at.bnd=0;g.calc();
  check('Technomancer Might is not spell damage',g.S.blow===0,{blow:g.S.blow});
  G.cls='courier';G.at={mgt:80,ref:20,vit:0,bnd:0};g.calc();
  check('naked Runner falls back to Reflex',g.S.blow===30,{blow:g.S.blow,spec:g.blowSpec()});
  G.at.ref=80;
  const launcher=piece('weapon','Last-Mile Cannon',40,{spd:15,fam:'sling',dmin:8,dmax:14});
  G.eq.weapon=launcher;g.calc();
  check('a live launcher reads Reflex',g.S.blow===120&&!g.gearQuiet(launcher),{blow:g.S.blow,req:reqOf(launcher)});
  G.eq.weapon=piece('weapon','Titan Maul',40,{spd:-20,dmin:20,dmax:30});G.at.mgt=80;G.at.ref=0;g.calc();
  check('a live maul makes Runner throws read Might',g.S.blow===120&&g.blowSpec().k==='mgt',{blow:g.S.blow,spec:g.blowSpec()});
  G.cls='founder';G.at={mgt:0,ref:0,vit:0,bnd:100};P.allySwing=1;
  check('Founder workforce is 0.7% Bandwidth',Math.abs(g.blowPct()-70)<.001,{pct:g.blowPct(),spec:g.blowSpec()});
  P.allySwing=0;P.hitSk=8;
  check('Layoffs stays on the workforce rate',Math.abs(g.blowPct()-70)<.001,{spec:g.blowSpec()});
  P.hitSk=-1;g.calc();
  check('naked Founder bolt does not become Bandwidth',g.S.blow===0,{blow:g.S.blow,spec:g.blowSpec()});
  G.cls='anon';G.at={mgt:100,ref:20,vit:0,bnd:0};P.blowForce='mgt';
  check('Anon mines read Might',g.blowPct()===150,{spec:g.blowSpec()});
  P.blowForce=null;P.hitSk=-1;
  check('Anon knife reads Reflex',g.blowPct()===30,{spec:g.blowSpec()});
  G.cls='homesteader';G.at={mgt:0,ref:0,vit:50,bnd:0};P.areaTick=1;
  check('plots read 0.4% Vitality',Math.abs(g.blowPct()-20)<.001,{pct:g.blowPct()});
  P.areaTick=0;
  G.cls='witness';G.at={mgt:10,ref:0,vit:100,bnd:0};g.calc();
  check('Witness swing stays on Might',g.S.blow===15,{blow:g.S.blow});

  const e=g.spawn('tick',P.x+1,P.y,{});
  check('a machine exists for Thread',!!(e&&e.hp>0));
  if(e){
    e.hp=1e7;e.max=1e7;G.at.vit=0;g.calc();
    g.witImpact(e,1000);const d0=1e7-e.hp;
    e.hp=1e7;G.at.vit=100;g.calc();
    g.witImpact(e,1000);const d1=1e7-e.hp;
    check('Thread scales at 0.6% Vitality',d0>0&&Math.abs(d1/d0-1.6)<.05,{d0,d1,ratio:d0?d1/d0:0});
    e.hp=0;
  }
  P.hitSk=-1;P.allySwing=0;P.areaTick=0;P.blowForce=null;

  const plans={
    chain:[15,5,30,50],admin:[10,5,40,45],rod:[15,5,30,50],
    rush:[15,50,30,5],pirate:[15,40,35,10],tips:[15,45,35,5],ghost:[20,50,25,5],
    demo:[50,20,20,10],head:[20,0,35,45],bed:[25,15,45,15],page:[20,15,55,10],
    crew:[50,15,35,0],orange:[45,20,25,10]
  };
  const where={chain:'hacker',admin:'hacker',rod:'hacker',rush:'courier',pirate:'courier',tips:'courier',ghost:'anon',demo:'anon',head:'founder',bed:'homesteader',page:'witness',crew:'scrapper',orange:'maxi'};
  for(const k in plans){
    const B=g.BUILDS[where[k]].find(b=>b.k===k);
    check('plan '+k,B&&B.at.join(',')===plans[k].join(','),B&&B.at);
  }
  G.cls='hacker';
  check('hacker tip names spell damage',g.attrTip('bnd').indexOf('1.5% spell')>=0,{tip:g.attrTip('bnd')});
  G.cls='witness';
  check('witness tip names Thread',g.attrTip('vit').indexOf('Thread')>=0);
  check('drive stats',g.driveStat('hacker')==='bnd'&&g.driveStat('founder')==='bnd'&&g.driveStat('courier')==='ref'&&g.driveStat('witness')==='vit'&&g.driveStat('anon')==='mgt'&&g.driveStat('scrapper')==='mgt');
  const walk=g.WALK.basics.map(s=>(s.mouse||'')+(s.touch||'')+(s.text||'')).join('\n');
  check('help keeps the broken-red sentence',walk.indexOf('Red means it is broken and gives nothing.')>=0);
  check('help names the requirement wash',walk.indexOf('A red wash across the tile')>=0);
  check('help still says sats do not fall',walk.indexOf('Sats do not fall.')>=0);

  wipe();
  G.eq.weapon=null;
  const loan=g.loanerWeapon();
  check('loaner requirement is zero',loan&&loan.reqMgt===0&&loan.reqRef===0&&loan.reqBnd===0&&loan.loan===1,{req:loan&&reqOf(loan)});

  wipe();
  G.lvl=40;G.at.mgt=0;G.merc={k:'guard',name:'Kit',hp:10,dead:false,weapon:null,helm:null,armor:null};
  const handed=piece('weapon','Titan Maul',40,{spd:-20});
  const merc=g.cmpEval(handed,{key:'merc'});
  check('merc compare ignores the player’s Might',merc.merc&&merc.ok&&!merc.blocked,{blocked:merc.blocked,ok:merc.ok,merc:merc.merc});

  const bands=[
    {name:'Normal',lvl:42,gifts:15,il:40},
    {name:'Hard',lvl:65,gifts:15,il:55},
    {name:'Brutal',lvl:80,gifts:15,il:70}
  ];
  const classes=[
    ['scrapper','crew','sign',-15,'Seraph Plate','Picket Maul'],
    ['hacker','chain','deck',0,'Cloud Mantle','Zero-Day Rig'],
    ['courier','rush','sling',15,'Cloud Mantle','Last-Mile Cannon'],
    ['anon','demo','shiv',8,'Cloud Mantle','Null Edge'],
    ['founder','head','pager',0,'Cloud Mantle','Cap Table'],
    ['homesteader','bed','graft',0,'Seraph Plate','Combine Blade'],
    ['witness','page','notebook',0,'Cloud Mantle','The Seventh Part'],
    ['maxi','orange',null,-20,'Seraph Plate','Titan Maul']
  ];
  const wear=[];
  for(const band of bands){
    for(const row of classes){
      wipe();
      G.cls=row[0];G.lvl=band.lvl;
      G.at={mgt:0,ref:0,vit:0,bnd:0};
      const ap=5*(band.lvl-1)+band.gifts;
      G.sk=Array(15).fill(0);G.web={};G.pas=[];
      g.buildApply(row[0],row[1],0,ap);
      const w=piece('weapon',row[5],band.il,{spd:row[3],fam:row[2]||undefined,dmin:10,dmax:18});
      const body=piece('armor',row[4],band.il);
      const weaponOk=g.canWear(w),bodyOk=g.canWear(body);
      wear.push({band:band.name,lvl:band.lvl,il:band.il,cls:row[0],plan:row[1],
        at:[G.at.mgt,G.at.ref,G.at.vit,G.at.bnd],
        weapon:row[5],wreq:reqOf(w),weaponOk,
        body:row[4],breq:reqOf(body),bodyOk});
      check(band.name+' '+row[0]+' weapon',weaponOk,{req:reqOf(w),at:G.at});
      check(band.name+' '+row[0]+' body',bodyOk,{req:reqOf(body),at:G.at,body:row[4]});
    }
  }
  return {fail,note:note.length,wear,errs:fail.length};
});

if(errs.length)console.log('PAGE',errs.join('\n'));
console.log('checks',report.note,'fail',report.fail.length);
for(const f of report.fail)console.log('FAIL',f);
console.log('WEAR');
for(const w of report.wear){
  console.log([w.band,w.cls,w.plan,'il'+w.il,'at'+w.at.join('/'),w.weapon,w.wreq.join('/'),w.weaponOk?'FIT':'MISS',w.body,w.breq.join('/'),w.bodyOk?'FIT':'MISS'].join(' '));
}

const shot=await p.evaluate(()=>{
  const g=__g,G=g.G;
  G.cls='scrapper';G.lvl=40;G.at={mgt:0,ref:0,vit:0,bnd:0};G.ap=0;G.cslots=[];G.merc=null;
  for(const sl of ['weapon','helm','armor','gloves','boots','belt','ring','amulet'])G.eq[sl]=null;
  function piece(slot,base,il,extra){
    const it=Object.assign({slot,base,name:base,il,q:extra.q||0,id:true,aff:[],spd:extra.spd||0,req:Math.max(1,Math.floor(il*.75)),dmin:12,dmax:24,arm:slot==='armor'?48:0},extra||{});
    g.stampReq(it);return it;
  }
  const maul=piece('weapon','Titan Maul',40,{spd:-20,q:0});
  const plate=piece('armor','Seraph Plate',40,{q:0});
  G.eq.weapon=maul;G.eq.armor=plate;
  const razor=piece('weapon','Void Razor',40,{spd:25,q:1});
  G.bag=[razor];
  g.calc();
  g.openSheet('items');
  const doll=document.querySelector('[data-eq="weapon"]');
  const pack=document.querySelector('[data-bag="0"]');
  return {
    doll:doll?doll.className:'',
    dollText:doll?doll.innerText:'',
    pack:pack?pack.className:'',
    packText:pack?pack.innerText:'',
    quiet:g.gearQuiet(maul),
    why:g.cantEquipText(razor)
  };
});
console.log('SHOT',JSON.stringify(shot));
if(shot.doll.indexOf('req')<0||shot.dollText.indexOf('need +72 Might')<0){console.log('tile badge missing');process.exit(1)}
if(shot.pack.indexOf('req')<0||shot.packText.indexOf('need +60 Reflex')<0){console.log('pack badge missing');process.exit(1)}
fs.mkdirSync('/opt/cursor/artifacts',{recursive:true});
await p.screenshot({path:'/opt/cursor/artifacts/stat-req-tile.png'});
await p.evaluate(()=>document.querySelector('#bagGrid [data-bag="0"]').click());
await p.waitForSelector('#pop .cmpBox',{timeout:3000});
const pop=await p.evaluate(()=>{
  const el=document.getElementById('pop');
  const btn=document.querySelector('#pop [data-do="equip"]');
  return {text:(el&&el.innerText||'').slice(0,1200),equipDisabled:!!(btn&&btn.disabled)};
});
console.log('POP',JSON.stringify(pop));
if(pop.text.indexOf("Can't equip. Need +60 Reflex.")<0||pop.text.indexOf('Required Reflex: 60')<0||!pop.equipDisabled){console.log('compare missing the lock');process.exit(1)}
await p.screenshot({path:'/opt/cursor/artifacts/stat-req-compare.png'});
await p.evaluate(()=>document.querySelector('#pop [data-popx]').click());
await p.waitForFunction(()=>document.getElementById('pop').hidden);
await p.evaluate(()=>document.querySelector('[data-eq="weapon"]').click());
await p.waitForSelector('#pop .cmpBox',{timeout:3000});
const card=await p.evaluate(()=>{
  const el=document.getElementById('pop');
  return (el&&el.innerText||'').slice(0,1200);
});
console.log('CARD',JSON.stringify(card));
if(card.indexOf('Required Might: 72')<0||card.indexOf('need +72')<0){console.log('worn card missing the red line');process.exit(1)}
await p.screenshot({path:'/opt/cursor/artifacts/stat-req-card.png'});

await b.close();
if(report.fail.length||errs.length)process.exit(1);
})().catch(e=>{console.error(e);process.exit(1)});
