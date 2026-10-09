/* Side-by-side item compare. Deltas come from the real sheet with the piece swapped in.
   node tools/item-compare.js
   Desktop and phone shots: /opt/cursor/artifacts/item-compare-desktop.png
   and item-compare-mobile.png */
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
const p=await b.newPage({viewport:{width:1280,height:800}});
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
  const row=(ev,name)=>ev.rows.find(r=>r.name===name);
  const gear=(slot,more)=>({slot,id:true,req:1,name:more&&more.name||slot,base:slot,q:1,il:2,aff:[],...more});
  function wipe(){
    G.cls='scrapper';G.lvl=1;G.sk=Array(15).fill(0);G.pas=[];G.slots=[-1,-1,-1];G.web={};G.doc=null;G.charms=[];
    if(G.mouse){G.mouse.L=-1;G.mouse.R=0}
    P.orders=0;P.bear=0;P.book=0;P.rCall=0;P.rBook=0;P.two=null;
    G.diff=0;G.merc=null;
    for(const sl of ['weapon','helm','armor','gloves','boots','belt','ring','amulet'])G.eq[sl]=null;
    G.bag=[];g.calc();G.hp=g.S.maxHp;G.en=g.S.maxEn;
  }
  function snap(){return {eq:Object.assign({},G.eq),hp:G.hp,en:G.en,L:G.mouse&&G.mouse.L,R:G.mouse&&G.mouse.R,slots:G.slots.slice(),hot:G.hot?G.hot.slice():null,pas:G.pas.slice()}}
  function held(s,label){
    for(const k in s.eq)if(G.eq[k]!==s.eq[k])fail.push(label+' eq '+k);
    if(G.hp!==s.hp)fail.push(label+' hp '+G.hp+'!='+s.hp);
    if(G.mouse&&(G.mouse.L!==s.L||G.mouse.R!==s.R))fail.push(label+' mouse');
    if(G.slots.join(',')!==s.slots.join(','))fail.push(label+' slots '+G.slots+' vs '+s.slots);
  }
  wipe();
  const ring=gear('ring',{name:'Life Band',aff:[{k:'hp',v:40}]});
  let s=snap();
  let ev=g.cmpEval(ring);
  let life=row(ev,'Life');
  check('life +40 with no aura',life&&life.d===40&&life.good,{d:life&&life.d,rows:ev.rows.map(r=>r.name+':'+r.d)});
  held(s,'life');
  P.orders=10;
  ev=g.cmpEval(ring);
  const lifeA=row(ev,'Life');
  check('standing call makes the life delta larger',lifeA&&lifeA.d>40,{d:lifeA&&lifeA.d});
  P.orders=0;held(snap(),'orders');
  const neck=gear('amulet',{name:'Plate Tag',arm:10});
  ev=g.cmpEval(neck);
  const arm0=row(ev,'Armor');
  P.bear=8;
  ev=g.cmpEval(neck);
  const arm1=row(ev,'Armor');
  check('bear market thickens the armor delta',arm0&&arm1&&arm1.d>arm0.d,{off:arm0&&arm0.d,on:arm1&&arm1.d});
  P.bear=0;
  G.diff=1;g.calc();
  ev=g.cmpEval(gear('ring',{name:'Proof',aff:[{k:'r_impact',v:30}]}));
  const rs=row(ev,'Impact resist');
  check('hard difficulty resist delta is the full affix',rs&&rs.d===30,{d:rs&&rs.d,pen:g.resPen()});
  G.eq.ring=gear('ring',{name:'Worn Proof',aff:[{k:'r_impact',v:70}]});g.calc();
  ev=g.cmpEval(gear('ring',{name:'Cap Proof',aff:[{k:'r_impact',v:100}]}));
  const cap=row(ev,'Impact resist');
  check('resist delta stops at the cap',cap&&cap.d===25,{d:cap&&cap.d});
  G.diff=0;G.eq.ring=null;g.calc();
  wipe();
  G.sk=Array(15).fill(0);G.slots=[-1,-1,-1];G.pas=[];
  G.eq.helm=gear('helm',{set:'striker',name:'Placard'});
  G.eq.gloves=gear('gloves',{set:'striker',name:'Hat'});
  g.calc();
  s=snap();
  ev=g.cmpEval(gear('boots',{set:'striker',name:'Striker Boots',aff:[{k:'mspd',v:12}]}));
  check('third striker piece grants all skills',row(ev,'All skills')&&row(ev,'All skills').d===1,ev.rows.map(r=>r.name+':'+r.d));
  check('third piece does not pretend the 2-piece damage is new',!ev.rows.some(r=>r.name==='Damage'&&Math.abs(r.d)===20));
  check('unskilled stop sign does not gain a rank',!ev.rows.some(r=>/stop sign/i.test(r.name)));
  check('vigil is gained',ev.rows.some(r=>r.text==='gained'&&/kills restore 3% life/i.test(r.name)));
  check('run speed from the boots',row(ev,'Run speed')&&row(ev,'Run speed').d===12,{d:row(ev,'Run speed')&&row(ev,'Run speed').d});
  held(s,'set');
  const late=gear('ring',{name:'Late',req:99,aff:[{k:'hp',v:80}]});
  const hp0=G.hp,eq0=G.eq.ring;
  ev=g.cmpEval(late);
  check('under level blocks the compare',ev.blocked==='level'&&ev.rows.length===0&&G.eq.ring===eq0&&G.hp===hp0,{blocked:ev.blocked,n:ev.rows.length});
  const swapped=g.sheetSwap([{slot:'ring',it:late}]);
  check('sheet swap still applies an under-level piece',swapped.maxHp>g.S.maxHp&&G.eq.ring===eq0);
  const unid=gear('ring',{name:'Unknown',id:false,aff:[{k:'hp',v:77}]});
  ev=g.cmpEval(unid);
  const htmlU=g.cmpHTML(unid);
  check('unidentified compare hides the affix',ev.blocked==='unid'&&!htmlU.includes('77')&&ev.rows.length===0);
  wipe();
  G.lvl=20;g.calc();G.hp=g.S.maxHp;
  const cipher={uid:'cipher',slot:'armor',id:true,req:1,name:'The Cipher Mantle',base:'Cloud Mantle',q:4,il:66,aff:[]};
  s=snap();
  ev=g.cmpEval(cipher);
  check('cipher might scales with level',row(ev,'Might')&&row(ev,'Might').d===5,{d:row(ev,'Might')&&row(ev,'Might').d,rows:ev.rows.filter(r=>/might|teleport/i.test(r.name)).map(r=>r.name+':'+r.d+':'+(r.text||''))});
  check('cipher grants teleport',ev.gain.indexOf('Teleport')>=0||ev.rows.some(r=>r.name==='Teleport'&&r.text==='gained'));
  held(s,'cipher');
  G.eq.armor=cipher;g.calc();
  G.slots[0]=100;
  const plain=gear('armor',{name:'Plain Coat',arm:8,aff:[{k:'hp',v:10}]});
  g.cmpEval(plain);
  check('comparing another coat restores the teleport bind and the mantle',G.slots[0]===100&&G.eq.armor===cipher,{slot:G.slots[0]});
  ev=g.cmpEval(cipher,{off:true});
  check('taking the mantle off loses teleport',ev.loss.indexOf('Teleport')>=0||ev.rows.some(r=>r.name==='Teleport'&&r.text==='lost'));
  check('taking it off keeps it equipped until you say so',G.eq.armor===cipher&&G.slots[0]===100);
  wipe();
  const card={uid:'unioncard',slot:'amulet',id:true,req:1,name:'Union Card',base:'Dog Tag',q:4,il:8,aff:[]};
  ev=g.cmpEval(card);
  check('union card grants solidarity to a scrapper',row(ev,'Solidarity')&&row(ev,'Solidarity').d===3,{rows:ev.rows.map(r=>r.name+':'+r.d)});
  G.cls='hacker';g.calc();
  ev=g.cmpEval(card);
  check('union card stays quiet on a technomancer',!ev.rows.some(r=>r.name==='Solidarity'));
  wipe();
  const wpn=gear('weapon',{name:'Sign',dmin:10,dmax:20,spd:0});
  G.eq.weapon=wpn;g.calc();
  let info=g.strikeInfo(g.S);
  check('unbound attack dps uses the class swing',info.kind==='attack'&&info.dps===32.8,{kind:info.kind,dps:info.dps,name:info.name});
  G.sk[0]=1;G.slots[0]=0;
  info=g.strikeInfo(g.S);
  check('stop sign dps is the skill and not the class multiplier on top',info.kind==='skill'&&info.dps===28.5&&info.name.indexOf('Stop Sign')>=0,{kind:info.kind,dps:info.dps,name:info.name});
  ev=g.cmpEval(gear('weapon',{name:'Bigger',dmin:12,dmax:24,spd:0}));
  check('the delta names the bound skill',ev.rows.some(r=>r.name.indexOf('Stop Sign')>=0),ev.rows.map(r=>r.name));
  const helm=gear('helm',{name:'Bowl',arm:20});
  const boots=gear('boots',{name:'Treads',aff:[{k:'mspd',v:10}]});
  const eqH=G.eq.helm,eqB=G.eq.boots,hp=G.hp;
  const both=g.sheetSwap([{slot:'helm',it:helm},{slot:'boots',it:boots}]);
  check('a two-slot swap applies both pieces',both.armor>g.S.armor&&both.mspd>g.S.mspd&&G.eq.helm===eqH&&G.eq.boots===eqB&&G.hp===hp,{arm:both.armor,now:g.S.armor,spd:both.mspd,nowSpd:g.S.mspd});
  G.merc={k:'guard',name:'Nia',hp:10,dead:false,weapon:null,armor:null,helm:null};
  const spare=gear('weapon',{name:'Spare',dmin:8,dmax:12,spd:0});
  const ts=g.cmpTargets(spare);
  check('a weapon can be compared with the companion',ts.length===2&&ts[1].key==='merc',ts.map(t=>t.key+':'+t.label));
  const heroHp=g.S.maxHp,mw=G.merc.weapon;
  ev=g.cmpEval(spare,{key:'merc'});
  check('the companion compare leaves your sheet and their hands alone',ev.merc&&g.S.maxHp===heroHp&&G.merc.weapon===mw&&ev.rows.some(r=>r.name==='Damage'),{hp:g.S.maxHp,rows:ev.rows.map(r=>r.name)});
  check('a ring has one compare target',g.cmpTargets(gear('ring',{name:'Loop'})).length===1);
  const maul=gear('weapon',{name:'Maul',spd:-20,dmin:20,dmax:30});
  check('a slow weapon is two-handed',g.itemHands(maul)===2&&g.cmpTargets(maul)[0].label==='Two-handed'&&g.cmpTargets(maul)[0].hands===2);
  wipe();
  check('life alone is not a strict upgrade',g.strictUp(gear('ring',{aff:[{k:'hp',v:20}]}))===false);
  check('damage, armor and life together are a strict upgrade',g.strictUp(gear('amulet',{name:'All Three',aff:[{k:'dmg',v:10},{k:'hp',v:20},{k:'armor',v:10}]}))===true);
  const shop=g.cmpHTML(gear('helm',{name:'Shop Helm',arm:6,aff:[{k:'hp',v:8}]}));
  check('shop cards are the side-by-side compare',shop.indexOf('cmpBox')>=0&&shop.indexOf('What changes')>=0);
  return {fail,note:note.length,errs:fail.length};
});
if(errs.length){console.log('PAGE',errs);process.exit(1)}
if(report.fail.length){console.log(report.fail.join('\n'));process.exit(1)}
console.log('delta checks',report.note);

await p.evaluate(()=>{
  const g=__g,G=g.G,P=g.P;
  G.god=true;G.cls='scrapper';G.lvl=8;G.merc={k:'guard',name:'Nia',hp:40,dead:false,weapon:null,armor:null,helm:null};
  G.eq.weapon={slot:'weapon',id:true,req:1,name:'Old Sign',base:'Stop Sign',q:1,il:2,dmin:4,dmax:6,spd:0,aff:[{k:'hp',v:5}]};
  G.bag[0]={slot:'weapon',id:true,req:1,name:'New Sign',base:'Maul',q:2,il:8,dmin:14,dmax:22,spd:-20,aff:[{k:'hp',v:40},{k:'en',v:-18}]};
  g.calc();
  const drop={slot:'ring',id:true,req:1,name:'Ground Loop',base:'Band',q:1,il:3,aff:[{k:'hp',v:12},{k:'r_heat',v:-10}]};
  g.W.drops.length=0;
  g.W.drops.push({x:P.x+1.2,y:P.y,it:drop,t:5});
  g.noteInput('mouse');
});
const at=await p.evaluate(()=>__g.screenAt(__g.P.x+1.2,__g.P.y));
await p.mouse.move(at.x,at.y);
await p.waitForTimeout(120);
const hover=await p.evaluate(()=>{
  const el=document.getElementById('cmpTip');
  const h=__g.HOVER;
  return {on:!!(el&&!el.hidden&&!el.classList.contains('dock')&&el.querySelector('.cmpBox')),name:!!(el&&el.textContent.indexOf('Ground Loop')>=0),kind:h&&h.kind,hn:h&&h.name,text:el&&el.textContent.slice(0,180)};
});
if(!hover.on||!hover.name){console.log('ground hover',JSON.stringify(hover));process.exit(1)}
console.log('desktop ground hover');
await p.evaluate(()=>__g.noteInput('touch'));
await p.waitForTimeout(50);
const dock=await p.evaluate(()=>{
  __g.hud();
  const el=document.getElementById('cmpTip');
  return {on:!!(el&&!el.hidden&&el.classList.contains('dock')&&el.querySelector('.cmpBox')&&el.textContent.indexOf('Ground Loop')>=0),ui:document.documentElement.dataset.ui,text:el&&el.textContent.slice(0,120)};
});
if(!dock.on){console.log('dock',JSON.stringify(dock));process.exit(1)}
console.log('touch dock',dock.ui);
await p.evaluate(()=>{
  const el=document.getElementById('cmpTip');
  const b=el.querySelector('[data-cmphide]');if(b)b.click();
});
await p.waitForTimeout(50);
const muted=await p.evaluate(()=>{__g.hud();const el=document.getElementById('cmpTip');return !el||el.hidden});
if(!muted){console.log('hide did not mute the dock');process.exit(1)}

await p.evaluate(()=>{
  const g=__g;
  g.ACC.stash=[{slot:'helm',id:true,req:1,name:'Locked Helm',base:'Hard Hat',q:2,il:4,aff:[{k:'hp',v:15}],arm:6}];
  g.openSheet('stash',{});
});
await p.evaluate(()=>{
  const b=document.querySelector('[data-st="0"]');
  b.dispatchEvent(new MouseEvent('click',{bubbles:true,shiftKey:true}));
});
await p.waitForTimeout(200);
const stash=await p.evaluate(()=>{
  const pop=document.getElementById('pop');
  return {open:pop&&!pop.hidden,box:!!pop.querySelector('.cmpBox'),move:!!pop.querySelector('[data-stmv]'),text:(pop.textContent||'').indexOf('Locked Helm')>=0};
});
if(!stash.open||!stash.box||!stash.move||!stash.text){console.log('stash',stash);process.exit(1)}
console.log('stash shift-click compare');

await p.evaluate(()=>{
  const g=__g,MP=g.MP;
  MP.on=true;MP.conn={readyState:1,send(){}};
  MP.game={name:'Yard',n:1,max:8,diffName:'Normal'};
  MP.me={uid:'me',name:'You'};
  MP.scale={hp:1,xp:1};MP.chat=[];MP.roster=[];MP.party=null;MP.tradePick={};
  const mine={tid:'mine1',slot:'ring',id:true,req:1,name:'My Loop',base:'Band',q:1,il:2,aff:[{k:'hp',v:9}]};
  g.G.bag.push(mine);
  MP.trade={phase:'open',id:'t1',you:{sats:0,items:[],ok:false},them:{sats:0,items:[{slot:'ring',id:true,req:1,name:'Their Loop',base:'Band',q:2,il:5,aff:[{k:'hp',v:20},{k:'en',v:-6}]}]}};
  g.setMode('play');
  g.openSheet('party',{});
});
const trade=await p.evaluate(()=>{
  const see=document.querySelector('[data-tsee="0"]');
  const mine=document.querySelector('[data-mpti]');
  return {see:!!see,mine:!!mine,hint:(document.getElementById('sheetIn').textContent||'').indexOf('beside what you wear')>=0};
});
if(!trade.see||!trade.mine||!trade.hint){console.log('trade panel',trade);const bit=await p.evaluate(()=>(document.getElementById('sheetIn').textContent||'').slice(0,400));console.log(bit);process.exit(1)}
await p.evaluate(()=>document.querySelector('[data-tsee="0"]').click());
await p.waitForTimeout(150);
const theirs=await p.evaluate(()=>{
  const pop=document.getElementById('pop');
  const t=pop?pop.textContent:'';
  return {box:!!(pop&&pop.querySelector('.cmpBox')),them:t.indexOf('Their Loop')>=0,up:!!(pop&&pop.querySelector('.dln.up'))};
});
if(!theirs.box||!theirs.them){console.log('their item',theirs);process.exit(1)}
await p.evaluate(()=>{__g.noteInput('touch');document.querySelector('[data-mpti]').click()});
await p.waitForTimeout(200);
const minePop=await p.evaluate(()=>{
  const pop=document.getElementById('pop');
  return {box:!!(pop&&pop.querySelector('.cmpBox')),go:!!(pop&&pop.querySelector('[data-mptigo]'))};
});
if(!minePop.box||!minePop.go){console.log('my trade item',minePop);process.exit(1)}
await p.evaluate(()=>{const MP=__g.MP;MP.on=false;MP.conn=null;MP.game=null;MP.trade=null});
console.log('trade compare');

await p.evaluate(()=>{
  const g=__g,G=g.G;
  G.god=true;G.cls='scrapper';G.lvl=8;
  G.merc={k:'guard',name:'Nia',hp:40,dead:false,weapon:null,armor:null,helm:null};
  for(const sl of ['weapon','helm','armor','gloves','boots','belt','ring','amulet'])G.eq[sl]=null;
  G.eq.weapon={slot:'weapon',id:true,req:1,name:'Old Sign',base:'Stop Sign',q:1,il:2,dmin:4,dmax:6,spd:0,aff:[{k:'hp',v:5}]};
  G.bag=[{slot:'weapon',id:true,req:1,name:'New Sign',base:'Maul',q:2,il:8,dmin:14,dmax:22,spd:-20,aff:[{k:'hp',v:40},{k:'en',v:-18}]}];
  G.sk=Array(15).fill(0);G.sk[0]=1;G.slots=[0,-1,-1];G.pas=[];
  if(G.mouse)G.mouse.L=-1;
  g.OPT.cmpArrow=false;
  g.calc();
  g.setMode('play');
  g.noteInput('mouse');
  g.openSheet('items',{});
});
const bag=await p.evaluate(()=>document.getElementById('bagGrid').innerHTML);
if(/better|worse|locked/.test(bag)||bag.indexOf('%')>=0){console.log('badge still on',bag.slice(0,240));process.exit(1)}
const glow=await p.evaluate(()=>document.getElementById('sheetIn').textContent);
if(glow.indexOf('Glowing')>=0||glow.indexOf('beside what you wear')<0){console.log('copy',glow.slice(0,400));process.exit(1)}
await p.evaluate(()=>{__g.G.bag[0]={slot:'amulet',id:true,req:1,name:'All Three',base:'Tag',q:2,il:4,aff:[{k:'dmg',v:10},{k:'hp',v:20},{k:'armor',v:10}]};__g.OPT.cmpArrow=true;__g.drawSheet()});
const arrow=await p.evaluate(()=>document.getElementById('bagGrid').innerHTML);
if(arrow.indexOf('arr')<0||arrow.indexOf('↑')<0){console.log('arrow missing',arrow.slice(0,240));process.exit(1)}
await p.evaluate(()=>{
  const G=__g.G;
  G.bag=[{slot:'weapon',id:true,req:1,name:'New Sign',base:'Maul',q:2,il:8,dmin:14,dmax:22,spd:-20,aff:[{k:'hp',v:40},{k:'en',v:-18}]}];
  __g.OPT.cmpArrow=false;
  __g.drawSheet();
  document.querySelector('#bagGrid [data-bag="0"]').click();
});
await p.waitForSelector('#pop .cmpBox',{timeout:3000});
const desk=await p.evaluate(()=>{
  const box=document.querySelector('#pop .cmpBox');
  const st=getComputedStyle(box);
  const pop=document.getElementById('pop');
  return {
    dir:st.flexDirection,
    up:!!pop.querySelector('.dln.up'),
    dn:!!pop.querySelector('.dln.dn'),
    alt:!!pop.querySelector('[data-cmpk]'),
    names:pop.textContent.indexOf('New Sign')>=0&&pop.textContent.indexOf('Old Sign')>=0,
    two:/Two-handed/.test(pop.textContent),
    cut:/difficulty cut/.test(pop.textContent)
  };
});
if(desk.dir!=='row'||!desk.up||!desk.dn||!desk.alt||!desk.names||!desk.two||!desk.cut){console.log('desktop pop',desk);process.exit(1)}
fs.mkdirSync('/opt/cursor/artifacts',{recursive:true});
await p.screenshot({path:'/opt/cursor/artifacts/item-compare-desktop.png'});
console.log('desktop',desk);

await p.setViewportSize({width:390,height:844});
await p.evaluate(()=>__g.noteInput('touch'));
await p.waitForTimeout(200);
await p.evaluate(()=>{const b=document.getElementById('uiPort');if(b&&!b.hidden){const x=document.getElementById('uiPortX');if(x)x.click()}});
const phone=await p.evaluate(()=>{
  const box=document.querySelector('#pop .cmpBox');
  const delta=document.querySelector('#pop .cmpDelta');
  const bst=getComputedStyle(box),dst=delta?getComputedStyle(delta):null;
  const btn=document.querySelector('#pop .cmpActs button, #pop .ghost');
  return {
    dir:bst.flexDirection,
    overflow:dst&&dst.overflowY,
    ui:document.documentElement.dataset.ui,
    h:btn?btn.getBoundingClientRect().height:0,
    up:!!document.querySelector('#pop .dln.up'),
    dn:!!document.querySelector('#pop .dln.dn')
  };
});
if(phone.dir!=='column'||phone.overflow!=='auto'||phone.ui!=='touch'||phone.h<44||!phone.up||!phone.dn){console.log('phone',phone);process.exit(1)}
await p.screenshot({path:'/opt/cursor/artifacts/item-compare-mobile.png'});
console.log('phone',phone);
await b.close();
console.log('item-compare ok');
})().catch(e=>{console.error(e);process.exit(1)});
