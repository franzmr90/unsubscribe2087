/* The checks the broad pass could not trust: costs before the clock runs,
   card percents with no weapon and no loot, preconditions filled in,
   a champion against Acqui-hire, and the town loops.
   node tools/classes-deep.js */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const {pathToFileURL}=require('url');
const root=path.join(__dirname,'..');
const pagePath=path.join(root,'dist','Unsubscribe-2087-standalone.html');

(async()=>{
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(String(e.message||e).split('\n')[0]));
await p.goto(pathToFileURL(pagePath).href);
await p.waitForFunction(()=>window.__g&&__g.skipDisc);
await p.evaluate(()=>__g.skipDisc());
await p.click('[data-cls=scrapper]');
await p.waitForTimeout(200);
await p.evaluate(()=>{__g.G.pre=2;__g.G.q.q1=1;__g.G.seenIntro=true;__g.OPT.noWalk=1;__g.G.walkNew=0;__g.G['in1']=1});
for(let i=0;i<16;i++){
  await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x)x.click()}});
  await p.waitForTimeout(80);
}
await p.evaluate(()=>{__g.enter(1);__g.setMode('shot')});

const r=await p.evaluate(()=>{
  const g=__g, bad=[], note=[];
  const check=(n,ok,d)=>{note.push((ok?'PASS ':'FAIL ')+n+(d?' '+d:''));if(!ok)bad.push(n+(d?' '+d:''))};
  Math.random=()=>0.5;
  function quiet(){
    const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();
    const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x)x.click()}
  }
  function boot(cls){
    const G=g.G;G.cls=cls;G.lvl=12;G.act2=1;G.act3=1;G.sk=Array(15).fill(0);G.pas=[];G.slots=[-1,-1,-1];
    G.eq={weapon:null,helm:null,armor:null,gloves:null,boots:null,belt:null,ring:null,amulet:null};
    G.form=null;G.formDt=null;G.formT=0;G.page=0;G.god=true;G.merc=null;G.fork={};G.schema=cls==='hacker'?'surge':null;
    G.diff=0;G.pp=0;G.at={mgt:0,ref:0,vit:0,bnd:0};
    if(g.W.zi!==1){G['in1']=1;g.enter(1);quiet()}
    g.P.x=g.W.start.x;g.P.y=g.W.start.y;g.P.dir={x:1,y:0};
    g.W.ents.length=0;g.W.projs.length=0;g.W.allies.length=0;g.W.drops.length=0;g.W.merc=null;
    g.P.cd=g.P.cd.map(()=>0);g.P.dash=null;g.P.buff=0;g.P.guard=0;g.P.haste=0;g.P.stealth=0;g.P.ambT=0;g.P.ambM=1;g.P.aura=null;g.P.dip=0;g.P.two=null;g.P.mech=0;g.P.crunch=0;g.P.castWait=0;g.P.shr=null;g.P.fm=null;g.P.corpses=[];g.P.grave=null;
    g.calc();G.hp=g.S.maxHp;G.en=g.S.maxEn;g.setMode('shot');
  }
  function foe(dx,o){
    const P=g.P;let e=null;
    for(const d of [dx,dx+0.4,-dx,1.4]){e=g.spawn('tick',P.x+d,P.y,o||{});if(e)break}
    if(!e)return null;
    e.hp=e.max=100000;e.stun=99;e.aggro=true;e.mods={};return e;
  }
  function cast(i){
    g.G.sk=Array(15).fill(0);g.G.sk[i]=1;g.G.pas=[];g.G.slots=[i,-1,-1];g.G.form=null;g.calc();
    g.G.en=g.S.maxEn;g.P.cd[i]=0;g.P.dash=null;g.P.castWait=0;g.setMode('play');
    const en=g.G.en;g.cast(0);const spent=en-g.G.en,cd=g.P.cd[i];g.setMode('shot');
    return {spent,cd};
  }
  const mid=()=>(g.S.dmin+g.S.dmax)/2;

  /* costs and cooldowns, read before any tick */
  const mayRefuse={witness:{1:1,3:1,4:1,6:1,7:1,9:1,10:1,12:1},homesteader:{7:1},founder:{8:1,9:1,14:1},courier:{11:1},anon:{10:1,14:1},maxi:{11:1}};
  for(const cls of ['scrapper','hacker','courier','anon','founder','homesteader','witness','maxi']){
    boot(cls);
    const sk=g.CLS[cls].sk;
    for(let i=0;i<sk.length;i++){
      if(!sk[i].a||(mayRefuse[cls]&&mayRefuse[cls][i]))continue;
      g.W.ents.length=0;foe(1.1);
      const c=cast(i);
      const cost=sk[i].cost||0;
      if(Math.abs(c.spent-cost)>0.05)check(cls+' '+sk[i].n+' cost',false,c.spent+' vs '+cost);
      else if(c.spent>0&&Math.abs(c.cd-(sk[i].cd||0))>0.05)check(cls+' '+sk[i].n+' cd',false,c.cd+' vs '+sk[i].cd);
    }
  }

  /* damage percents, bare hands, one tick, no follow-up ticks */
  /* Signed For prints 350% at rank 1. The mark is the damage they take afterwards. */
  {
    boot('courier');const e=foe(1.05);const hp=e.hp;cast(7);
    const dmg=hp-e.hp,expect=mid()*3.5;
    const hp2=e.hp;g.P.fm=null;g.hit(e,1);const next=hp2-e.hp;
    check('Signed For hits for the printed 350%',Math.abs(dmg-expect)<0.6 && e.mark>=7.5,'dmg '+dmg.toFixed(2)+' expect '+expect.toFixed(2)+' mark '+e.mark+' sheet '+g.S.dmin+'-'+g.S.dmax+' dmg% '+g.S.dmg+' shock '+g.S.shock+' crit '+g.S.crit);
    check('Signed For mark is +30% on the next hit',Math.abs(next-mid()*1.3)<0.6,'next '+next.toFixed(2));
  }
  {
    boot('anon');const e=foe(1.05);const hp=e.hp;cast(5);
    const dmg=hp-e.hp,expect=mid()*1.2;
    const hp2=e.hp;g.P.fm=null;g.hit(e,1);const next=hp2-e.hp;
    check('Dox hits for the printed 120%',Math.abs(dmg-expect)<0.6 && (e.mark||0)>=8.5,'dmg '+dmg.toFixed(2)+' expect '+expect.toFixed(2)+' mark '+(e.mark||0));
    check('Dox mark is +30% on the next hit',Math.abs(next-mid()*1.3)<0.6,'next '+next.toFixed(2));
  }
  {
    boot('scrapper');const e=foe(0.9);const hp=e.hp;cast(0);
    const dmg=hp-e.hp,expect=mid()*1.45;
    check('Stop Sign hits for the printed 145%',Math.abs(dmg-expect)<0.8,'dmg '+dmg.toFixed(2)+' expect '+expect.toFixed(2));
  }
  {
    boot('maxi');const e=foe(0.9);e.hp=e.max=1000;cast(9);
    const left=e.hp,expect=1000*(1-0.092);
    check('The Halving takes 9.2% of current life at rank 1',Math.abs(left-expect)<2,'left '+left.toFixed(1));
  }
  {
    boot('founder');
    const card=g.CLS.founder.sk[7].d(1);
    check('Acqui-hire card says rank, not level',/rank 5/.test(card)&&!/level 5/.test(card),card);
    g.G.sk[7]=1;g.G.slots=[7,-1,-1];g.calc();g.G.en=g.S.maxEn;
    const champ=foe(1.2);champ.champ=true;champ.hp=champ.max=500;
    g.setMode('play');g.cast(0);g.setMode('shot');
    const stayed=g.W.ents.includes(champ);
    check('a champion refuses Acqui-hire at rank 1',stayed,'ents '+g.W.ents.length);
    g.W.ents.length=0;g.W.allies.length=0;
    g.G.sk[7]=5;g.calc();g.G.en=g.S.maxEn;g.P.cd[7]=0;
    const champ5=foe(1.2);champ5.champ=true;
    g.setMode('play');g.cast(0);g.setMode('shot');
    check('a champion accepts Acqui-hire at rank 5',!g.W.ents.includes(champ5)&&g.W.allies.some(a=>a.kind==='conv'),'allies '+g.W.allies.map(a=>a.kind).join(','));
  }
  /* witness with a full page */
  {
    boot('witness');g.G.page=100;const e=foe(1.1);cast(0);
    check('Look adds Testimony', (e.tes||0)>=1, 'tes '+(e.tes||0));
    boot('witness');g.G.page=100;const t=foe(1.1);t.cd=0;cast(1);
    check('The Sentence delays the machine', t.cd>0.4, 'cd '+t.cd);
    boot('witness');g.G.page=100;g.P.lastLoss=40;g.G.hp=g.S.maxHp-40;cast(6);
    check('Correction restores the last loss once', Math.abs(g.G.hp-(g.S.maxHp))<1.5 && g.G.corrZi===g.W.zi, 'hp '+g.G.hp+'/'+g.S.maxHp);
  }
  /* buffs the broad log did not print */
  {
    boot('scrapper');cast(13);check('Two-Handed arms three swings', g.P.two&&g.P.two.n===3, JSON.stringify(g.P.two));
    boot('scrapper');cast(14);check('Last Shift lasts 4.3s at rank 1', Math.abs(g.P.lastShift-4.3)<0.05, String(g.P.lastShift));
    boot('founder');cast(4);check('Crunch lasts 9s at rank 1', Math.abs(g.P.crunch-9)<0.05, String(g.P.crunch));
    boot('founder');const hp=g.G.hp=g.S.maxHp*0.5;cast(5);
    check('Mech Suit lasts 11s', Math.abs(g.P.mech-11)<0.05, String(g.P.mech));
    note.push('NOTE Mech Suit heals '+Math.round(g.G.hp-hp)+' which the card does not mention');
    boot('maxi');cast(13);const before=g.G.hp;g.P.inv=0;g.G.god=false;g.hurt(80,false,{name:'a test',pvp:1});
    check('The Dip ignores the next hit', g.G.hp===before && !g.P.dip, 'hp '+g.G.hp);
    boot('courier');const e=foe(1.2);cast(14);check('Missed Connection marks the machine', e.mc>4, String(e.mc));
    boot('founder');const e2=foe(1.2);cast(10);check('Non-Compete binds one machine', e2.nc>5, String(e2.nc));
    boot('hacker');g.G.sk[11]=1;g.G.pas=[11];g.G.schema='surge';g.calc();
    check('Schema adds 8% Surge at rank 1', (g.S.t_surge||0)===8, String(g.S.t_surge));
    boot('maxi');
    g.G.sk=Array(15).fill(0);g.G.sk[6]=1;g.G.slots=[6,-1,-1];g.calc();g.G.en=999;g.P.cd[6]=0;
    const e3=foe(1.1);g.W.projs.length=0;g.setMode('play');g.cast(0);g.setMode('shot');
    check('Blessed Hashrate fires projectiles', g.W.projs.length>=5, String(g.W.projs.length)+' dmg pending');
  }
  /* passives that need a worn piece to show */
  {
    boot('scrapper');
    g.G.eq.armor={id:1,name:'Plate',slot:'armor',arm:100,aff:[],req:1,q:0};
    g.G.sk[2]=1;g.G.pas=[2];g.calc();
    check('Iron Hide is +8% armour at rank 1', g.S.armor===108, String(g.S.armor));
    boot('maxi');
    g.G.eq.armor={id:1,name:'Plate',slot:'armor',arm:100,aff:[],req:1,q:0};
    g.G.sk[8]=1;g.G.pas=[8];g.calc();
    check('Twenty-One Million is +8% armour at rank 1', g.S.armor===108, String(g.S.armor));
  }
  /* gear requirement at a real level */
  {
    boot('scrapper');g.P.castWait=0;g.setMode('play');g.G.lvl=5;g.G.bag=[];
    const it=g.makeItem(1,1,'weapon');it.req=20;it.id=1;it.name='Locked';it.dmin=40;it.dmax=50;
    g.G.bag=[it];g.openSheet('items');
    const b=document.querySelector('[data-bag="0"]');
    check('the pack shows the weapon', !!b);
    if(b){b.click();b.click()}
    const toast=(document.getElementById('log')||{}).textContent||'';
    check('level 5 cannot wear a level 20 weapon', !g.G.eq.weapon && /Needs level 20/.test(toast), toast.slice(0,80));
    g.closeSheet();g.G.lvl=20;g.G.bag=[it];it.req=1;g.calc();const bare=g.S.dmax;
    g.openSheet('items');const b2=document.querySelector('[data-bag="0"]');if(b2){b2.click();b2.click()}
    g.closeSheet();g.calc();
    check('a worn weapon changes the sheet', !!g.G.eq.weapon && g.S.dmax!==bare, bare+' -> '+g.S.dmax+' '+((g.G.eq.weapon&&g.G.eq.weapon.name)||''));
  }
  /* hire, in town, for two classes that share the sheet */
  for(const cls of ['anon','witness']){
    boot(cls);g.P.castWait=0;g.G.credits=1e9;g.G.lvl=15;g.enter(0);quiet();g.setMode('play');
    g.openSheet('merc');
    const h=document.querySelector('[data-hire="guard"]');
    check(cls+' can hire a bodyguard', !!h && !h.disabled);
    if(h&&!h.disabled)h.click();
    g.closeSheet();g.enter(1);quiet();g.setMode('shot');g.W.ents.length=0;
    const e=foe(1.15);let hit=false;
    if(e&&g.W.merc){const hp=e.hp;for(let k=0;k<50&&e.hp>=hp;k++)g.update(0.05);hit=e.hp<hp}
    check(cls+' bodyguard lands a hit', !!g.W.merc && hit);
  }
  /* save */
  {
    boot('homesteader');g.G.lvl=19;g.calc();
    check('save() writes', !!g.save(true));
    const raw=localStorage.getItem('unsub2087v3');
    const o=JSON.parse(raw);g.G.lvl=1;g.G.cls='scrapper';
    check('applySave restores the homesteader', g.applySave(o)&&g.G.cls==='homesteader'&&g.G.lvl===19);
    g.G.pre=2;g.G.q.q1=1;g.G.seenIntro=true;
  }
  /* vendor */
  {
    boot('courier');g.enter(0);quiet();g.setMode('play');
    g.talkTo('brenda');
    const open=!document.getElementById('dlg').hidden;
    const btns=[...document.querySelectorAll('#dBtns button')].map(b=>b.textContent);
    check('Brenda offers a trade', open && btns.some(t=>/Trade/.test(t)), btns.join('|'));
  }
  /* learn stays locked in Act I */
  {
    boot('scrapper');g.G.lvl=1;g.G.act2=0;g.G.act3=0;g.G.sp=8;g.G.sk=[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    g.enter(0);quiet();g.setMode('play');g.openSheet('skills');
    const node=document.querySelector('[data-node="9"]');if(node)node.click();
    const learn=document.querySelector('[data-learn="9"]');
    check('Lunch Pail cannot be learned at level 1', !!learn && learn.disabled, learn?String(learn.disabled):'no button');
    if(learn&&!learn.disabled)learn.click();
    check('the point was not spent', g.G.sk[9]===0, String(g.G.sk[9]));
    g.closeSheet();
  }
  /* hostility message does not throw, and a self-declare locks the portal */
  {
    boot('founder');g.enter(1);quiet();g.W.ents.length=0;g.setMode('play');g.openPortal();
    const had=!!(g.G.portal&&g.G.portal.cast);
    g.MP.me={uid:'me'};
    g.mpRecv({t:'hostile',fromUid:'me',toUid:'them'});
    check('a cast portal was up before the declare', had);
    check('declaring hostility clears your own portal', !g.G.portal, JSON.stringify(g.G.portal));
    check('the other player is marked hostile', !!(g.MP.hostile&&g.MP.hostile.them));
  }
  return {bad,note};
});

/* shitcoiner refuse, after buttons unlock */
await p.evaluate(()=>{
  __g.G.cls='scrapper';__g.G.god=true;__g.G.lvl=6;__g.calc();
  __g.enter(1);__g.setMode('play');
  __g.W.ents=__g.W.ents.filter(()=>false);
  const s=__g.spawn('shill',__g.P.x+0.5,__g.P.y,{});
  s.coin='DogeNote';s.name='Shill for DogeNote';s.pitch=1;s.aggro=false;s.pt=40;s.hp=900;s.max=900;s.mods={};
  __g.update(0.02);
  const obj=document.getElementById('obj');if(obj&&!obj.hidden)obj.click();
});
await p.waitForTimeout(3400);
const shill=await p.evaluate(()=>{
  const buttons=[...document.querySelectorAll('#dBtns button')];
  const no=buttons.find(b=>/bitcoin/i.test(b.textContent));
  if(no&&no.disabled)return {wait:true,dis:true};
  if(no)no.click();
  const s=__g.W.ents.find(e=>e.k==='shill');
  return {clicked:!!no,aggro:s?!!s.aggro:null,toast:(document.getElementById('log')||{}).textContent||''};
});

/* death screen */
await p.evaluate(()=>{
  const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x)x.click()}
  __g.setMode('play');__g.G.god=false;__g.G.hc=false;__g.P.inv=0;__g.P.dip=0;
  __g.G.hp=10;__g.hurt(500,false,{name:'a Tick'});
});
await p.waitForTimeout(3200);
const death=await p.evaluate(()=>{
  const el=document.getElementById('death');
  return {hidden:el.hidden,mode:__g.mode,btn:(document.getElementById('bRise')||{}).textContent||'',note:(el.textContent||'').slice(0,180)};
});

console.log(r.note.join('\n'));
console.log('SHILL '+JSON.stringify(shill));
console.log('DEATH '+JSON.stringify(death));
if(errs.length)console.log('ERRS '+[...new Set(errs)].join(' | '));
console.log(r.bad.length?('FAILS '+r.bad.length):'deep ok');
await b.close();
process.exit(r.bad.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
