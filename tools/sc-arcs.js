/* Long StarCraft arcs. node tools/sc-arcs.js
   Screenshots: /opt/cursor/artifacts/sc-six.png sc-queen.png sc-launch.png sc-invasion.png */
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
      const sh=document.getElementById('sheet');
      if(sh&&!sh.hidden){const x=sh.querySelector('[data-close]');if(x){x.click();return 'sheet'}return 'sheet'}
      const port=document.getElementById('uiPortX');
      if(port&&port.closest('#uiPort')&&!port.closest('#uiPort').hidden){port.click();return 'port'}
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
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
await p.waitForTimeout(300);
await p.evaluate(()=>__g.skipDisc());
await p.waitForTimeout(80);
await p.click('[data-cls=scrapper]');
await p.waitForTimeout(120);
await p.evaluate(()=>{__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1;__g.OPT.ui='mouse';__g.uiApply(true);__g.G.god=true});
await clearUI(p);

const log=()=>p.evaluate(()=>[...document.querySelectorAll('#log div')].map(d=>d.textContent).join(' | '));
async function clickBtn(label){
  for(let i=0;i<24;i++){
    const hit=await p.evaluate(label=>{
      const b=[...document.querySelectorAll('#dBtns button:not([disabled])')].find(x=>x.textContent.indexOf(label)>=0);
      if(!b)return false;b.click();return true;
    },label);
    if(hit)return;
    await p.waitForTimeout(200);
  }
  throw new Error('no button '+label);
}
const wipe=()=>p.evaluate(()=>{document.getElementById('log').innerHTML=''});
async function go(zi){
  await p.evaluate(zi=>{
    __g.G.act2=__g.G.act3=__g.G.act4=__g.G.act5=true;
    __g.G['in'+zi]=1;__g.G.walkNew=0;__g.G.god=true;
    __g.enter(zi);__g.setMode('play');
  },zi);
  await clearUI(p);
  await p.evaluate(()=>__g.setMode('play'));
}
const body=()=>p.evaluate(()=>({t:document.getElementById('dT').textContent,p:document.getElementById('dP').textContent,btns:[...document.querySelectorAll('#dBtns button')].map(b=>b.textContent)}));

const names=await p.evaluate(()=>({
  pryce:__g.ET?null:__g.ZONES[5].n,
  boss:__g.ZONES[5].intro,
  vale:__g.ZONES[11].intro,
  q1:__g.QUESTS.q1.n,
  q5:__g.QUESTS.q5.d,
  hoa:__g.ZONES[1].su.n,
  reyn:__g.MERCS.reyn.d,
  paper:__g.MEMOS[__g.EGG.paperAt][0],
  link:__g.MEMOS[__g.EGG.linkAt][0],
  never:__g.MEMOS[__g.ARCM.never][0]+' '+__g.MEMOS[__g.ARCM.never][1],
  sq:Object.keys(__g.SQ).join(',')
}));
check('egg clippings stay put',names.paper==='The Tymes, 03/Jan/2087'&&names.link==='A link, blurred',names);
check('the invasion page names the six payoffs',/There was never an invasion/.test(names.never)&&/visors that got out/.test(names.never)&&/terms update/.test(names.never)&&/launch was a meeting/.test(names.never)&&/barge was a fee/.test(names.never)&&/queen was a job/.test(names.never)&&/wanted to be believed/.test(names.never)&&/man who quit/.test(names.never),names.never);
check('main quest names stay',names.q1==='Neighbourhood Watch'&&/Pryce/.test(names.q5)&&/HOA-9/.test(names.hoa)&&/Vale/.test(names.vale)&&/Pryce/.test(names.boss),names);
check('reyn’s hire line is the visor line',/used to be the marine/.test(names.reyn)&&/visor is still employed/.test(names.reyn),names.reyn);
check('arcs are not side-quest slots',!/six|reyn|queen|barge/.test(names.sq),names.sq);

await go(0);
const lines=await p.evaluate(()=>{
  const s=__g.G.sats;
  const a=__g.scLine('overwhelming'),b=__g.scLine('power overwhelming'),c=__g.scLine('show me the money'),d=__g.scLine('operation cwal');
  return {a,b,c,d,sats:__g.G.sats,s};
});
check('the sticker is not a typed cheat',lines.a===false&&lines.b===false&&lines.c===false&&lines.d===false&&lines.sats===lines.s,lines);

await wipe();
await p.evaluate(()=>__g.arcClick('six'));
const sixDlg=await body();
check('the board offers six before the minute',sixDlg.t==='Six before the minute'&&/before you are dressed/.test(sixDlg.p),sixDlg);
await p.screenshot({path:'/opt/cursor/artifacts/sc-six.png'});
const clock=await p.evaluate(()=>({six:__g.G.st.six,left:__g.G.st.sixLeft}));
check('accepting does not start the clock',clock.six===1&&clock.left==null,clock);
await clearUI(p);

await go(1);
const armed=await p.evaluate(()=>{
  const su=(__g.W.ents||[]).find(e=>e.su);
  return {left:__g.G.st.sixLeft,q:__g.G.q.q1,su:su&&su.name,crate:__g.W.objs.some(o=>o.k==='arc'&&o.id==='six'&&!o.used)};
});
check('the moors keep HOA-9 and arm the crate',armed.q===1&&armed.su==='Gatewarden HOA-9'&&armed.crate&&armed.left>50,armed);
const late=await p.evaluate(()=>{
  const s=__g.G.st,cr=__g.G.credits,sat=__g.G.sats;
  s.sixLeft=0;
  const o=__g.W.objs.find(x=>x.k==='arc'&&x.id==='six'&&!x.used);
  __g.arcUse(o);
  const early=(__g.W.ents||[]).filter(e=>e.arc==='early'||e.arc==='six').length;
  return {six:s.six,early,cr0:cr,cr:__g.G.credits,sat0:sat,sat:__g.G.sats};
});
check('a late crate is empty and pays nothing',late.six===3&&late.early===0&&late.cr<late.cr0&&late.sat===late.sat0,late);

await p.evaluate(()=>{__g.G.st.six=1;__g.G.st.sixLeft=null});
await go(1);
const early=await p.evaluate(()=>{
  const o=__g.W.objs.find(x=>x.k==='arc'&&x.id==='six'&&!x.used);
  __g.arcUse(o);
  const six=(__g.W.ents||[]).filter(e=>e.arc==='six');
  const up=(__g.W.ents||[]).find(e=>e.arc==='early');
  __g.W.ents=(__g.W.ents||[]).filter(e=>e.arc!=='six'&&e.arc!=='early');
  return {six:six.length,hp:six.map(e=>e.max),name:up&&up.name,up:!!up,uhp:up&&up.max,state:__g.G.st.six,feat:__g.G.st.sixFeat};
});
check('an early crate is six ticks and the Early Update',early.six===6&&early.up&&early.name==='The Early Update'&&early.uhp<=26&&early.hp.every(h=>h<=16)&&early.state===2&&early.feat===1,early);
const sat0=await p.evaluate(()=>__g.G.sats);
await p.evaluate(()=>__g.arcClick('sixin'));
const paid=await p.evaluate(()=>{
  const it=(__g.G.bag||[]).find(x=>x&&x.uid==='minute');
  return {sats:__g.G.sats,it:it&&{req:it.req,m:it.reqMgt,r:it.reqRef,b:it.reqBnd,free:it.free,cs:it.cs,aff:it.aff,fl:it.fl}};
});
check('the turn-in pays four sats and a free slip',paid.sats===sat0+4&&paid.it&&paid.it.req===1&&paid.it.m===0&&paid.it.r===0&&paid.it.b===0&&paid.it.free===1&&paid.it.cs===1&&!(paid.it.aff&&paid.it.aff.length)&&/kind of dressed/.test(paid.it.fl),paid);
await clearUI(p);
const sat1=await p.evaluate(()=>__g.G.sats);
await p.evaluate(()=>__g.arcClick('sixin'));
const sat2=await p.evaluate(()=>__g.G.sats);
check('the handful of sats is once',sat2===sat1, {sat1,sat2});

const pace=await p.evaluate(()=>{
  const it=__g.G.bag.find(x=>x.uid==='minute');
  __g.G.cslots=[];__g.calc();const off=__g.S.mspd;
  __g.G.cslots=[it];__g.P.zoneT=10;__g.calc();const on=__g.S.mspd;
  __g.P.zoneT=80;__g.calc();const late=__g.S.mspd;
  __g.G.cslots=[];__g.calc();
  return {off,on,late};
});
check('the minute is only the first minute, and only while worn',pace.on===pace.off+8&&pace.late===pace.off&&pace.on<=50,pace);

await wipe();
await p.evaluate(()=>{__g.G.merc={k:'reyn',name:'Sam',hp:10,dead:false};__g.G.st.reynMet=1});
await go(4);
const row=await p.evaluate(()=>{
  const pell=(__g.W.npcs||[]).find(n=>n.id==='pell');
  const vis=(__g.W.ents||[]).find(e=>e.arc==='visor');
  const su=(__g.W.ents||[]).find(e=>e.su);
  const person={hp:10,person:1,mp:0,nc:0,x:__g.P.x,y:__g.P.y,r:.3};
  __g.W.ents.push(person);
  const tg=__g.mercTarget({x:__g.P.x,y:__g.P.y},{range:2});
  const far=__g.arcMercMay(Object.assign({arc:'visor'},{x:__g.P.x+9,y:__g.P.y}));
  const near=__g.arcMercMay(Object.assign({arc:'visor'},{x:__g.P.x+1,y:__g.P.y}));
  __g.W.ents=(__g.W.ents||[]).filter(e=>!e.person&&e.arc!=='visor');
  return {pell:pell&&pell.name,vis:vis&&vis.name,hp:vis&&vis.max,su:su&&su.name,tg:tg&&tg.person,far,near};
});
check('Pell and the visor share the row with the auditor',row.pell==='Pell'&&row.vis==='The Visor Still Employed'&&row.hp<=90&&row.su==='Auditor Prime'&&!row.tg&&row.far===false&&row.near===true,row);

await wipe();
await go(5);
const door=await log();
check('Reyn stops at the cathedral door',/not going in to hear it twice/.test(door),door);
const doorState=await p.evaluate(()=>({merc:__g.W.merc,num:(__g.G.bag||[]).some(i=>i&&i.uid==='number'),q5:__g.G.q.q5}));
check('the player still enters and the door pays nothing',doorState.merc==null&&doorState.num===false&&doorState.q5!==3,doorState);
await p.waitForTimeout(1600);
const launch5=await log();
check('the cathedral notice is a sentence',/Launch notice: the offer is in the room/.test(launch5),launch5);
await p.screenshot({path:'/opt/cursor/artifacts/sc-launch.png'});

await wipe();
await go(11);
await p.waitForTimeout(1600);
const launch11=await log();
const vale=await p.evaluate(()=>{
  const b=(__g.W.ents||[]).find(e=>e.k==='boss2');
  return {name:b&&b.name,bars:(__g.W.ents||[]).filter(e=>e.k==='boss2').length,q:__g.G.q.q10};
});
check('the mezzanine notice does not rename Vale',/cleared her afternoon/.test(launch11)&&vale.bars===1&&/Vale/.test(vale.name)&&vale.q!==3, {launch11,vale});
await go(10);
await p.evaluate(()=>{const o=__g.W.objs.find(x=>x.k==='arc'&&x.id==='queen'&&!x.used);__g.arcUse(o)});
const queen=await body();
check('the margin memo files beside Vale’s profile',queen.t==='The Queen of Margins'&&/better at the job/.test(queen.p),queen);
await p.screenshot({path:'/opt/cursor/artifacts/sc-queen.png'});
await clearUI(p);
await go(11);
await wipe();
await p.evaluate(()=>{const o=__g.W.objs.find(x=>x.k==='arc'&&x.id==='draft'&&!x.used);__g.arcUse(o)});
const draft=await log();
check('Draft One is discontinued',/That version is discontinued/.test(draft),draft);

await go(18);
const ives=await p.evaluate(()=>{
  const n=(__g.W.npcs||[]).filter(x=>x.id==='ives');
  const u=(__g.W.npcs||[]).filter(x=>x.id==='usher');
  __g.talkTo('ives');
  return {n:n.length,name:n[0]&&n[0].name,usher:u.length};
});
check('Ives is a clerk, not the usher',ives.n===1&&ives.name==='Ives'&&ives.usher>=1,ives);
await clickBtn('minutes');
const went=await p.evaluate(()=>__g.G.st.queenGo);
check('Ives can take you to the minutes',went===1,went);
await clearUI(p);

await go(13);
const first=await p.evaluate(()=>{
  const e=(__g.W.ents||[]).find(x=>x.arc==='first');
  const su=(__g.W.ents||[]).find(x=>x.su);
  __g.P.arcNo=3;const miss=__g.arcHurt({arc:'first',k:'hr'});__g.P.arcNo=0;
  if(e){__g.arcDead(e);__g.W.ents=__g.W.ents.filter(x=>x!==e)}
  return {name:e&&e.name,hp:e&&e.max,su:su&&su.name,miss,q:__g.G.q.q12};
});
check('the first version is a lieutenant and a miss off the carpet',first.name==='The First Version'&&first.hp<=110&&first.su==='The Recording Secretary'&&first.miss==='miss'&&first.q!==2,first);
await p.waitForTimeout(500);
const which=await body();
check('Ives asks which draft to file',/Which draft/.test(which.p)&&which.btns.indexOf('File neither')>=0,which);
await clickBtn('File neither');
await p.waitForTimeout(200);
const margin=await p.evaluate(()=>{
  const it=(__g.G.bag||[]).find(x=>x&&x.uid==='margin');
  __g.G.cslots=it?[it]:[];__g.calc();const on=__g.S.thorns;
  __g.G.cslots=[];__g.calc();const off=__g.S.thorns;
  return {file:__g.G.st.queenFile,it:it&&{req:it.req,free:it.free,cs:it.cs,aff:it.aff},on,off,memo:__g.G.memos.indexOf(__g.ARCM.blank)>=0};
});
check('filing neither pays the margin once and leaves it a slip',margin.file==='none'&&margin.memo&&margin.it&&margin.it.req===1&&margin.it.free===1&&margin.it.cs===1&&margin.it.aff[0].k==='thorns'&&margin.on>=4&&margin.off<margin.on,margin);
await clearUI(p);

await go(16);
const track=await p.evaluate(()=>({hud:__g.arcHud(),q:__g.G.q.q15,sold:__g.G.st.sold}));
check('the second offer stays on the tracker until you decline',/You can still say no/.test(track.hud)&&track.q!==3,track);
await p.evaluate(()=>{__g.G.st.lnTrack=0});
const quiet=await p.evaluate(()=>__g.arcHud());
check('a decline clears the tracker',quiet==='',quiet);

const over=await p.evaluate(()=>{
  __g.calc();
  const a={d:__g.S.dmin,ar:__g.S.armor,m:__g.S.mspd,hp:__g.S.maxHp,lv:__g.G.lvl};
  __g.arcOver();
  __g.calc();
  const b={d:__g.S.dmin,ar:__g.S.armor,m:__g.S.mspd,hp:__g.S.maxHp,lv:__g.G.lvl,over:__g.P.over};
  return {a,b,word:document.getElementById('log').textContent};
});
check('overwhelming floats a name and does not change stats',over.b.d===over.a.d&&over.b.ar===over.a.ar&&over.b.m===over.a.m&&over.b.hp===over.a.hp&&over.b.lv===over.a.lv&&over.b.over>0&&/Overwhelming/.test(over.word)&&!/power overwhelming/i.test(over.word),over);

await go(0);
await wipe();
const blind=await p.evaluate(()=>{
  __g.P.over=3;__g.G.st.overUsed=1;__g.G.st.overBrenda=0;__g.G.sats=40;
  const bag=__g.G.bag.length;
  __g.openVend('brenda');
  const buy=__g.vendBuy(0);
  return {buy,sats:__g.G.sats,bag:__g.G.bag.length,bag0:bag,log:document.getElementById('log').textContent,blind:__g.arcBlind()};
});
check('Brenda does not see a customer for those three seconds',blind.buy===false&&blind.sats===40&&blind.bag===blind.bag0&&/did not see a customer/.test(blind.log)&&blind.blind===true,blind);
await clearUI(p);

await wipe();
const barge=await p.evaluate(()=>{
  __g.calc();__g.G.stims=__g.S.cap;
  const belt=__g.giveStim();
  __g.G.stims=0;
  const room=__g.giveStim();
  __g.scVisitClear();
  document.getElementById('log').innerHTML='';
  __g.W.allies=[];
  __g.summon({kind:'intern'},1);
  const mid=document.getElementById('log').textContent;
  __g.summon({kind:'intern'},1);
  return {belt,room,allies:__g.W.allies.length,mid,log:document.getElementById('log').textContent};
});
check('a full belt spills one barge line, and a replaced intern does too',barge.belt==='pack'&&barge.room==='belt'&&!/Spawn more barges/.test(barge.mid)&&/Spawn more barges/.test(barge.log)&&barge.allies===1,barge);

await go(2);
await p.evaluate(()=>{__g.G.q.q2=1;__g.talkTo('brenda')});
const cartBtn=await p.evaluate(()=>[...document.querySelectorAll('#dBtns button')].map(b=>b.textContent));
check('Brenda offers the cart without replacing her shop',cartBtn.indexOf('Trade')>=0&&cartBtn.indexOf('A cart')>=0,cartBtn);
await clickBtn('A cart');
await clearUI(p);
await go(2);
const dock=await p.evaluate(()=>{
  const s=__g.G.st;
  const sign=__g.W.objs.find(o=>o.k==='arc'&&o.id==='sign');
  const quiet=__g.W.objs.find(o=>o.k==='arc'&&o.id==='dock');
  s.bargeSub=0;
  __g.arcUse(quiet);
  const ticks=(__g.W.ents||[]).filter(e=>e.arc==='mall').length;
  const tier=(__g.W.ents||[]).find(e=>e.arc==='tier');
  const label=(__g.G.bag||[]).find(i=>i&&i.uid==='tierlab');
  __g.W.ents=(__g.W.ents||[]).filter(e=>e.arc!=='mall');
  return {q:s.bargeQ,ticks,tier:!!tier,label:label&&label.parts,sign:!!sign,brenda:/cart/.test(__g.ARC.brendaCart)};
});
check('an unsubscribed dock skips Tier Two and still has the walk',dock.q===1&&dock.ticks===3&&dock.tier===false&&dock.label===2&&dock.sign&&dock.brenda,dock);
await p.evaluate(()=>{__g.G.st.bargeDock=1;__g.G.st.bargeQ=1;__g.talkTo('brenda')});
await clickBtn('Unsubscribe it');
await clickBtn('belt');
const tier=await p.evaluate(()=>{
  __g.calc();const up=__g.S.cap;
  const meta=__g.bagMeta();
  __g.G.st.nextTier='pack';const pack=__g.bagMeta();
  __g.calc();const stim=__g.S.cap;
  const it=(__g.G.bag||[]).find(x=>x&&x.uid==='next');
  return {which:__g.G.st.nextTier,up,stim,meta,pack,it:it&&it.cs,cr:__g.G.credits};
});
check('the next tier is one pocket',tier.which==='pack'&&tier.pack.n===25&&tier.pack.c===5&&tier.pack.r===5&&tier.meta.n===24&&tier.stim===tier.up-1&&tier.it===1,tier);
await p.evaluate(()=>{__g.G.st.nextTier='stim';__g.calc()});
const stimCap=await p.evaluate(()=>{const a=__g.S.cap;__g.G.st.nextTier='';__g.calc();return {a,b:__g.S.cap}});
check('one more belt stim is the other pocket',stimCap.a===stimCap.b+1,stimCap);
await clearUI(p);

await p.evaluate(()=>{__g.G.st.reynMet=1;__g.G.st.reynPage=0});
await go(13);
const grief=await p.evaluate(()=>{
  const o=__g.W.objs.find(x=>x.k==='arc'&&x.id==='grief'&&!x.used);
  if(o)__g.arcUse(o);
  const it=(__g.G.bag||[]).find(x=>x&&x.uid==='number');
  __g.G.cslots=[];__g.calc();const off=__g.S.armor;
  if(it)__g.G.cslots=[it];__g.calc();const on=__g.S.armor;
  __g.G.cslots=[];__g.calc();
  return {it:it&&{req:it.req,free:it.free,cs:it.cs,aff:it.aff,fl:it.fl},off,on};
});
check('the number is eight armor, requirement-free, only while worn',grief.it&&grief.it.req===1&&grief.it.free===1&&grief.it.cs===1&&grief.it.aff[0].v===8&&/still employed/.test(grief.it.fl)&&grief.on===grief.off+8,grief);
await clearUI(p);

await go(27);
await p.evaluate(()=>__g.talkTo('page'));
const inv=await body();
check('the garage page is the whole joke',inv.t==='There was never an invasion.'&&/Reyn was a man who quit/.test(inv.p)&&/queen was a job/.test(inv.p),inv);
await p.screenshot({path:'/opt/cursor/artifacts/sc-invasion.png'});
await clearUI(p);

const coop=await p.evaluate(()=>{
  __g.G.sats=5;
  const ok=__g.spendSats(1);
  return {ok,sats:__g.G.sats,fn:typeof __g.mpShareQuest,log:document.getElementById('log').textContent};
});
check('a successful spend stays quiet and quest sharing is still there',coop.ok===true&&coop.sats===4&&coop.fn==='function'&&!/on the table/.test(coop.log),coop);

const hold=await p.evaluate(()=>{
  __g.P.holdCut=1;
  const a=__g.arcHurt({k:'boss'});
  const b=__g.arcHurt({k:'boss'});
  return {a,b,cut:__g.P.holdCut};
});
check('hold lightens the first boss hit once',hold.a===0.85&&hold.b===1&&hold.cut===0,hold);

check('no page errors',!errs.length,errs);
if(fail.length){console.log('FAIL',fail.length);fail.forEach(f=>console.log(' -',f));process.exitCode=1}
else console.log('sc-arcs ok');
await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
