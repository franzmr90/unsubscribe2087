/* Resist formula, gear, hireling types, and Hedgerow.
   node tools/resists.js
   Prints PASS/FAIL lines and a Hard/Brutal resist picture. */
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
  const check=(n,ok,extra)=>{if(!ok)fail.push(n+(extra!==undefined?': '+extra:''));else note.push(n)};
  const g=__g,G=g.G,P=g.P,W=g.W;
  const RTK=g.RTK;
  function quiet(){
    G.god=false;G.diff=0;G.lvl=1;G.sk=Array(15).fill(0);G.pas=[];G.slots=[0,-1,-1];
    G.form=null;G.formDt=null;G.doc=null;P.inv=0;P.dip=0;P.fm=null;P.shr=null;P.mech=0;P.guard=0;P.holdTy=0;P.slow=0;P.rustD=null;
    W.ents.length=0;W.projs.length=0;W.allies.length=0;W.merc=null;
    g.calc();G.hp=g.S.maxHp;G.en=g.S.maxEn;g.setMode('play');
  }
  function foe(k,dx){
    const e=g.spawn(k,P.x+(dx||0.5),P.y,{});
    if(!e)return null;
    e.hp=e.max=100000;e.stun=99;e.mods={};e.aggro=true;return e;
  }

  check('combat resists are the five', RTK.join()==='impact,surge,rust,heat,noise');
  check('Sound stays a damage type', !!g.DTY.sound);

  quiet();
  G.diff=0;g.S.r_heat=80;check('cap 75 on Normal', g.resOf('heat')===75, g.resOf('heat'));
  G.diff=1;g.S.r_heat=10;check('Hard penalty -20', g.resOf('heat')===-10, g.resOf('heat'));
  G.diff=2;g.S.r_heat=0;check('Brutal penalty -50', g.resOf('heat')===-50, g.resOf('heat'));
  G.diff=2;g.S.r_heat=200;check('cap after the penalty', g.resOf('heat')===75, g.resOf('heat'));
  G.diff=2;g.S.r_heat=-60;check('floor -100', g.resOf('heat')===-100, g.resOf('heat'));
  G.diff=0;g.S.r_sound=40;check('Sound resist is not a combat resist', g.resOf('sound')===0, g.resOf('sound'));

  quiet();
  G.eq.armor={slot:'armor',il:20,q:2,base:'Coat',name:'Coat',id:true,req:1,aff:[{k:'r_heat',v:20},{k:'r_all',v:12}],words:[]};
  g.calc();
  check('Coverage adds to every combat resist', g.S.r_impact===12&&g.S.r_surge===12&&g.S.r_rust===12&&g.S.r_noise===12&&g.S.r_heat===32, JSON.stringify({i:g.S.r_impact,h:g.S.r_heat}));
  G.diff=1;check('Coverage is cut by Hard', g.resOf('impact')===-8&&g.resOf('heat')===12, g.resOf('impact')+'/'+g.resOf('heat'));

  quiet();
  G.diff=2;P.inv=0;G.god=false;g.S.armor=100;g.S.dodge=0;g.S.taken=1;g.S.r_heat=0;g.S.enc=0;P.barrier=0;
  const hp0=G.hp=500;
  g.hurt(100,false,{dty:'rust',name:'corrosion',pvp:1,hp:1,mods:{}});
  const landed=hp0-G.hp,dot=P.rustD&&P.rustD.dps;
  /* resist -50 so 150, then armor 100 halves it to 75. DoT is 25% of that over 3s. */
  check('Brutal rust hit uses the penalty then armor', Math.abs(landed-75)<0.6, 'landed '+landed);
  check('Rust corrosion is taken from the post-armor hit', dot&&Math.abs(dot-75*.25/3)<0.02, 'dps '+(dot&&dot.toFixed(3)));

  quiet();
  G.diff=0;g.S.r_impact=0;g.S.armor=0;g.S.dodge=0;g.S.taken=1;P.inv=0;
  const hp1=G.hp=400;
  g.hurt(80,false,{dty:'impact',name:'tap',pvp:1,hp:1,mods:{}});
  check('zero resist passes the hit through', Math.abs((hp1-G.hp)-80)<0.6, hp1-G.hp);

  const seen={all:0,high:0,sound:0,both:0,bad:0},nRoll=70;
  for(let i=0;i<nRoll;i++){
    const it=g.makeItem(40,2,'armor');
    const keys=it.aff.map(a=>a.k);
    if(keys.includes('r_sound')||keys.includes('r_x'))seen.bad++;
    const all=it.aff.find(a=>a.k==='r_all');
    const one=it.aff.find(a=>/^r_(impact|surge|rust|heat|noise)$/.test(a.k));
    if(all&&one)seen.both++;
    if(all){seen.all++;if(all.v<5||all.v>20)seen.bad++}
    if(one){if(one.v>=31)seen.high++;if(one.v<6||one.v>45)seen.bad++}
  }
  check('of Coverage appears and stays inside 5–20', seen.all>0, 'seen '+seen.all);
  check('fourth of Proofing tier can roll 31–45', seen.high>0, 'seen '+seen.high);
  check('Sound resist is not rolled', seen.bad===0&&seen.both===0, JSON.stringify(seen));

  let soundLine=false,threw=false;
  try{
    const it={slot:'weapon',il:20,q:1,base:'Rig',name:'Tuned Rig',id:true,req:1,aff:[{k:'t_sound',v:18},{k:'nope',v:4}],words:[]};
    const line=g.itemLines(it);
    soundLine=/Sound damage/.test(line)&&/\+4 nope/.test(line);
  }catch(e){threw=e.message}
  check('Sound damage and an unknown affix can be inspected', soundLine&&!threw, threw||'');

  const belt={slot:'belt',il:65,q:4,base:'Orbit Girdle',name:'Not Your Keys',id:true,req:40,aff:[{k:'r_sound',v:48},{k:'r_heat',v:10}],words:[]};
  g.migrateItem(belt);
  const mk=belt.aff.map(a=>a.k);
  check('a saved Sound resist becomes a combat type', !mk.includes('r_sound')&&mk.includes('r_heat')&&mk.some(k=>k!=='r_heat'&&RTK.includes(k.slice(2))), mk.join(','));
  let migThrow=false;
  try{g.itemLines(belt)}catch(e){migThrow=e.message}
  check('migrated Not Your Keys inspects', !migThrow, migThrow||'');

  let rxSound=0;
  for(let i=0;i<50;i++){
    const it={aff:[{k:'r_x',v:12}]};
    g.migrateItem(it);
    if(it.aff.some(a=>a.k==='r_sound'))rxSound++;
  }
  check('of Proofing resolves to a combat type', rxSound===0, rxSound);

  quiet();
  G.cls='homesteader';G.sk[6]=1;G.slots=[6,-1,-1];G.pas=[];g.calc();G.en=999;P.cd[6]=0;P.fm=null;P.dir={x:1,y:0};
  if(!G.eq.weapon)G.eq.weapon={slot:'weapon',dt:null,dmin:2,dmax:4};
  G.eq.weapon.dt='heat';
  g.cast(0);
  const eH=foe('tick',0.8);
  if(eH)g.hit(eH,1);
  check('Hedgerow does not retag the next swing as Rust', !P.fm.dt&&eH&&eH.lt==='heat', 'dt '+P.fm.dt+' lt '+(eH&&eH.lt));

  function mercSwing(k){
    quiet();
    G.lvl=10;G.diff=0;
    G.merc={k:'guard',name:'Kit',hp:500,dead:false,weapon:null,armor:null,helm:null};
    g.spawnMerc();
    const e=foe(k,0.4);if(!e)return 0;
    W.merc.x=P.x;W.merc.y=P.y;W.merc.cd=0;
    const h=e.hp;
    g.update(0.05);
    return h-e.hp;
  }
  const dTick=mercSwing('tick'),dBot=mercSwing('bot');
  check('Bodyguard Impact respects a partial resist', dTick>1&&dBot>1&&Math.abs(dBot/dTick-0.75)<0.08, 'tick '+(dTick&&dTick.toFixed(1))+' bot '+(dBot&&dBot.toFixed(1)));

  function shot(k,raw,dty){
    W.ents.length=0;W.projs.length=0;
    const e=foe(k,0.2);if(!e)return null;
    e.hp=e.max=1000;
    W.projs.push({x:e.x,y:e.y,vx:0,vy:0,life:1,raw:raw,dty:dty,done:[],pierce:0,kind:'merc',party:1,col:'#59e0e6'});
    g.update(0.05);
    return 1000-e.hp;
  }
  quiet();
  const surgeTick=shot('tick',100,'surge'),surgeBot=shot('bot',100,'surge'),surgeAegis=shot('aegis',100,'surge');
  check('a Surge shot is weak against a Tick and full against an Enforcer', Math.abs(surgeTick-150)<1&&Math.abs(surgeBot-100)<1, surgeTick+'/'+surgeBot);
  check('Sysadmin Surge does nothing to an immune Aegis', surgeAegis===0, surgeAegis);

  quiet();
  const victim=foe('aegis',0.4);
  victim.hp=victim.max=500;
  W.allies.push({k:'minion',kind:'conv',per:1,e:{k:'aegis',mods:{}},x:P.x,y:P.y,life:30,raw:80,ivl:9,rng:2,cd:0,hp:100,max:100,r:.3});
  g.update(0.05);
  const hired=W.allies[0];
  check('an acqui-hired Surge machine cannot hurt an immune Aegis', hired&&hired.cd>0&&victim.hp===500, victim.hp+' cd '+(hired&&hired.cd));

  quiet();
  G.merc={k:'guard',name:'Kit',hp:1000,dead:false};
  G.lvl=1;G.diff=2;g.calc();
  g.spawnMerc();
  W.merc.hp=1000;W.merc.max=1000;W.merc.armM=1;
  const before=W.merc.hp;
  g.hurtAlly(W.merc,100,{dty:'impact',name:'tap',mods:{}});
  check('hireling Brutal Impact resist is -43 and applies', Math.abs((before-W.merc.hp)-143)<0.6, before-W.merc.hp+' res '+g.mercResOf('impact'));
  check('Bodyguard is Impact, Sysadmin Surge, Node Runner Impact, Hound Rust',
    g.MERCS.guard.dt==='impact'&&g.MERCS.sys.dt==='surge'&&g.MERCS.node.dt==='impact'&&g.MERCS.hound.dt==='rust');
  g.openSheet('merc');
  const mercSheet=document.getElementById('sheetIn').innerHTML;
  check('Kestrel’s page lists the hireling resists after the cut', /Resistances/.test(mercSheet)&&/Impact<b>-43%/.test(mercSheet));
  g.closeSheet();

  const picture=[];
  const classes=['scrapper','hacker','courier','anon','founder','homesteader','witness','maxi'];
  const kits=[
    {name:'entry',lvl:1,heat:0,all:0},
    {name:'one Proofing',lvl:12,heat:16,all:0},
    {name:'Proofing and Coverage',lvl:24,heat:25,all:12}
  ];
  for(const diff of [1,2]){
    G.diff=diff;
    for(const kit of kits){
      const row={diff:diff===1?'Hard':'Brutal',kit:kit.name,lvl:kit.lvl};
      G.lvl=kit.lvl;G.cls='scrapper';
      G.eq.armor={slot:'armor',il:kit.lvl,q:2,base:'Coat',name:'Coat',id:true,req:1,aff:[],words:[]};
      if(kit.heat)G.eq.armor.aff.push({k:'r_heat',v:kit.heat});
      if(kit.all)G.eq.armor.aff.push({k:'r_all',v:kit.all});
      g.calc();
      row.heat=g.resOf('heat');row.other=g.resOf('impact');
      row.hp={};
      let oneshot=false;
      for(const cls of classes){
        G.cls=cls;if(cls==='maxi')g.ACC.maxi=1;g.calc();
        const max=g.S.maxHp,tick=g.spawn('tick',P.x+1.2,P.y,{});
        if(!tick){row.hp[cls]='nospawn';continue}
        const dmg=tick.dmg;W.ents.splice(W.ents.indexOf(tick),1);
        G.hp=max;P.inv=0;G.god=false;g.S.dodge=0;P.rustD=null;
        g.hurt(dmg,false,{dty:'heat',k:'tick',name:'Tick',pvp:1,hp:1,mods:{}});
        const taken=max-G.hp;
        row.hp[cls]=Math.round(taken)+'/'+max;
        if(taken>=max-0.5)oneshot=cls;
      }
      row.oneshot=oneshot||'';
      picture.push(row);
    }
  }

  g.openSheet('char');
  const sheet=document.getElementById('sheetIn').innerHTML;
  check('Hero tab shows the cut and hides Sound resist', /difficulty cut/.test(sheet)&&!/Sound<b>/.test(sheet));
  g.closeSheet();

  return {fail,note:note.length,picture};
});

const lines=[];
if(report.fail.length)report.fail.forEach(f=>lines.push('FAIL  '+f));
else lines.push('PASS  resists '+report.note+' checks');
if(errs.length)lines.push('FAIL  pageerror '+errs[0]);
console.log(lines.join('\n'));
console.log('PICTURE '+JSON.stringify(report.picture));
await b.close();
if(report.fail.length||errs.length)process.exit(1);
})().catch(e=>{console.error(e);process.exit(1)});
