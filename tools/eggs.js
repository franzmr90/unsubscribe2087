/* Wave 1 text eggs. node tools/eggs.js
   Screenshots: /opt/cursor/artifacts/egg-paper.png egg-obit.png egg-pie.png egg-404.png */
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
await p.evaluate(()=>__g.skipDisc());
await p.waitForTimeout(80);
await p.click('[data-cls=scrapper]');
await p.waitForTimeout(120);
await p.evaluate(()=>{__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1;__g.OPT.ui='mouse';__g.uiApply(true)});
await clearUI(p);
await p.evaluate(()=>__g.enter(0));
await clearUI(p);

const props=await p.evaluate(()=>{
  const ids=__g.W.npcs.map(n=>n.id);
  return {ids,pie:__g.W.pie,paper:!!__g.W.npcs.find(n=>n.id==='paper'&&n.act)};
});
check('town has the paper, the board, the flyer, and the frame',['paper','obit','flyer','hello'].every(id=>props.ids.includes(id))&&props.paper,props);

await p.evaluate(()=>__g.talkTo('paper'));
const paper=await p.evaluate(()=>{
  const t=document.getElementById('dT').textContent,body=document.getElementById('dP').textContent;
  return {t,body,memo:__g.G.memos.includes(__g.EGG.paperAt),block:__g.G.st.block0,title:__g.MEMOS?null:t};
});
check('the paper is The Tymes and files Block Zero',/Tymes/.test(paper.t)&&/forty-second bailout/.test(paper.body)&&paper.memo&&paper.block===1&&!/The Times/.test(paper.t+paper.body),paper);
await p.screenshot({path:'/opt/cursor/artifacts/egg-paper.png'});
await clearUI(p);

await p.evaluate(()=>{__g.G.deaths=4;__g.eggOnDeath();__g.talkTo('obit')});
const obit=await p.evaluate(()=>({t:document.getElementById('dT').textContent,body:document.getElementById('dP').textContent}));
check('the board counts deaths and files a pundit',/Declared dead 4 times\. Still here\./.test(obit.body)&&/Glen Voss|Nia Pell|Hal Crowe|Maren Quill|Regional Desk/.test(obit.body),obit);
await p.screenshot({path:'/opt/cursor/artifacts/egg-obit.png'});
await clearUI(p);

await p.evaluate(()=>{
  __g.setDY({by:'Pryce, Regional Vice-President',zi:0,fee:0,pvp:0,st:{x:1,y:1}});
  __g.showDeath();
});
const death=await p.evaluate(()=>document.getElementById('deathNote').textContent);
check('Pryce calls the death',/Called it\. Again\./.test(death),death);
await p.evaluate(()=>{document.getElementById('death').hidden=true;__g.setMode('play')});

const tos=await p.evaluate(()=>{
  const slides=__g.BINTRO.boss3.first('scrapper').map(s=>s.text).join(' | ');
  return slides;
});
check('MANDATE opens with the terms',/SOMEONE SET UP US THE TERMS/.test(tos)&&/ALL YOUR DATA ARE BELONG TO US/.test(tos)&&/YOU HAVE NO CHANCE TO OPT OUT MAKE YOUR TIME/.test(tos),tos);

await p.evaluate(()=>{__g.G.memos.push(__g.EGG.linkAt);__g.setMode('play');__g.openSheet('codex',{})});
await p.evaluate(()=>{const b=[...document.querySelectorAll('[data-mside]')].find(x=>x.dataset.mside==='codex:memos');if(b)b.click()});
await p.waitForTimeout(40);
const link=await p.evaluate(()=>{
  const b=document.querySelector('.eggLink');
  if(!b)return {miss:true};
  const blur=getComputedStyle(b).filter;
  b.click();
  return {blur,text:b.textContent,title:document.getElementById('dT').textContent,body:document.getElementById('dP').textContent};
});
check('the memo link is blurred and Wren warns',link.blur&&link.blur!=='none'&&/g0atse\.cx\/hello\.jpg/.test(link.text)&&/Don’t/.test(link.body),link);
await p.evaluate(()=>{const x=document.querySelector('#dBtns button:not([disabled])');if(x)x.click()});
await p.waitForTimeout(80);
const gone=await p.evaluate(()=>({t:document.getElementById('dT').textContent,body:document.getElementById('dP').textContent,flag:__g.G.st.hello404,item:__g.G.bag.find(it=>it.hello)}));
check('the link is a 404 and the file is requirement-free',gone.t==='404'&&/mercifully deprecated/.test(gone.body)&&gone.flag===1&&gone.item&&gone.item.free&&gone.item.req===1&&!gone.item.slot&&gone.item.reqMgt===0&&gone.item.reqRef===0&&gone.item.reqBnd===0&&gone.item.aff.length===0,gone);
check('Brenda pays one sat and will not look',await p.evaluate(()=>__g.vendBid(__g.G.bag.find(it=>it.hello))===1));
const lines=await p.evaluate(it=>__g.itemLines(it),gone.item);
check('the card says it is not gear',/No level and no stats/.test(lines)&&!/Required Might/.test(lines)&&!/Required Level/.test(lines),lines);
await p.screenshot({path:'/opt/cursor/artifacts/egg-404.png'});
await clearUI(p);

await p.evaluate(()=>{__g.G.cls='scrapper';__g.G.st.laser=0;__g.eggLaser()});
const declined=await p.evaluate(()=>__g.G.st.laser);
check('the visor declines anyone who is not the Maximalist',!declined);
await p.evaluate(()=>{__g.G.cls='maxi';__g.eggLaser()});
const laser=await p.evaluate(()=>({on:__g.G.st.laser,log:document.getElementById('log').textContent}));
check('laser eyes toggle and few understand',laser.on===1&&/Few understand/.test(laser.log),laser);
await p.evaluate(()=>{__g.G.sats=0;__g.G.cls='maxi';__g.W.pie=1;__g.setMode('play');__g.openVend('brenda')});
await p.evaluate(()=>{const b=document.querySelector('[data-vtab="supplies"]');if(b)b.click()});
await p.waitForTimeout(40);
await p.evaluate(()=>{const b=document.querySelector('[data-vpie]');if(b)b.click()});
await p.waitForTimeout(40);
const poor=await p.evaluate(()=>({log:document.getElementById('log').textContent,sats:__g.G.sats,pie:__g.W.pie}));
check('a refused sale tells the Maximalist to stay poor',/Have fun staying poor/.test(poor.log)&&poor.sats===0&&poor.pie===1,poor);

await p.evaluate(()=>{
  __g.G.sats=10000;__g.G.hp=1;__g.W.pie=1;__g.G.bag=[];__g.setMode('play');__g.openVend('brenda');
});
await p.evaluate(()=>{const b=document.querySelector('[data-vtab="supplies"]');if(b)b.click()});
await p.waitForTimeout(40);
const row=await p.evaluate(()=>{
  const b=document.querySelector('[data-vpie]');
  return b?{text:b.textContent,off:!!b.disabled}:null;
});
check('Brenda stocks the pies at exactly 10000 sats',row&&/Two Large Pies \(Cold\)/.test(row.text)&&/10000 sats/.test(row.text)&&!row.off,row);
await p.screenshot({path:'/opt/cursor/artifacts/egg-pie.png'});
await p.evaluate(()=>{const b=document.querySelector('[data-vpie]');if(b)b.click()});
await p.waitForTimeout(40);
const bought=await p.evaluate(()=>{
  const it=__g.G.bag.find(x=>x.pie);
  const before=__g.G.hp;
  const ate=it?__g.equipFromBag(__g.G.bag.indexOf(it)):false;
  return {sats:__g.G.sats,pie:!!it,free:it&&it.free&&it.reqMgt===0&&!it.slot,ate,hp:__g.G.hp,max:__g.S.maxHp,lunch:__g.G.st.lunch,fl:it&&it.fl,stamped:__g.stampReq(Object.assign({},it||{}))};
});
check('the pies cost 10000, heal, and carry no stat requirement',bought.sats===0&&bought.ate&&bought.hp===bought.max&&bought.lunch===1&&bought.free&&bought.stamped.reqMgt===0&&/Florida, 2010/.test(bought.fl)&&/Parcel Moors/.test(bought.fl),bought);

await p.evaluate(()=>__g.talkTo('flyer'));
const flyer=await p.evaluate(()=>({body:document.getElementById('dP').textContent,saw:__g.G.sawFlyer,req:__g.SQ.lemon.req()}));
check('the flyer is a lemon party and opens the errand',/LEMON PARTY/.test(flyer.body)&&flyer.saw===1&&flyer.req,flyer);
await p.evaluate(()=>{const x=document.querySelector('#dBtns button:not([disabled])');if(x)x.click()});
await p.waitForTimeout(40);
const snatch=await p.evaluate(()=>document.getElementById('dP').textContent);
check('Gramps snatches the flyer',/That’s not what you think/.test(snatch),snatch);
await clearUI(p);
const lemon=await p.evaluate(()=>{
  const step=__g.SQ.lemon.steps[1];
  const before=__g.G.sats;
  step.rw();
  const sour=__g.G.bag.find(it=>it.sour);
  return {gain:__g.G.sats-before,sour:!!sour,free:sour&&sour.free&&sour.req===1&&sour.reqMgt===0&&sour.reqRef===0&&sour.reqBnd===0&&!sour.slot,door:step.scene[0].text};
});
check('the party stays behind the door and pays a free sour potion',lemon.gain===21&&lemon.free&&/door is shut/.test(lemon.door)&&/laughter/.test(lemon.door),lemon);

const tips=await p.evaluate(()=>{
  __g.setMode('play');
  document.getElementById('dlg').hidden=true;
  const got=[];
  __g.eggTip();got.push(document.getElementById('log').textContent);
  __g.eggTip();got.push(document.getElementById('log').textContent);
  __g.eggTip();got.push(document.getElementById('log').textContent);
  return {got,list:__g.EGG.tips.slice()};
});
check('the three loading tips are the approved lines',tips.list.join('|')==='What you say!!|Never click a link an Anon pastes in all-caps.|Some search terms should stay unsearched. Even in 2087.'&&tips.got.some(t=>/What you say!!/.test(t)),tips);

const safe=await p.evaluate(()=>{
  const blob=JSON.stringify(__g.EGG)+__g.EGG.helloFrame+document.getElementById('dP').textContent;
  return {empty:/empty/.test(__g.EGG.helloFrame),pose:/anus|rectum|genitals|naked|nude|spread/i.test(blob)};
});
check('nothing graphic is described',safe.empty&&!safe.pose,safe);

const names=await p.evaluate(()=>__g.ACH.map(a=>a[1]));
check('the feats are on the list',['Block Zero','Rumors of My Death','Some Things Can’t Be Unseen (You Didn’t)','Most Expensive Lunch','Until 100K'].every(n=>names.includes(n)),names.filter(n=>/Block|Rumor|Unseen|Lunch|100K/.test(n)));
await p.evaluate(()=>{__g.G.sats=100000;__g.G.ach={};for(let i=0;i<8;i++)__g.achTick(9)});
const feats=await p.evaluate(()=>__g.G.ach);
check('Until 100K and the lunch and the paper can be earned',feats.k100k&&feats.lunch&&feats.block0&&feats.unseenlink,feats);

if(errs.length)fail.push('page errors: '+errs.join(' | '));
await b.close();
if(fail.length){console.log(fail.join('\n'));process.exit(1)}
console.log('eggs ok');
})().catch(e=>{console.error(e);process.exit(1)});
