/* The six StarCraft eggs. node tools/sc-eggs.js
   Screenshots: /opt/cursor/artifacts/sc-nipper.png sc-tariff.png sc-lines.png */
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
const p=await b.newPage({viewport:{width:1100,height:700}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
await p.waitForTimeout(300);
await p.evaluate(()=>__g.skipDisc());
await p.waitForTimeout(80);
await p.click('[data-cls=scrapper]');
await p.waitForTimeout(120);
await p.evaluate(()=>{__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1;__g.OPT.ui='mouse';__g.uiApply(true)});
await clearUI(p);

const intro=await p.evaluate(()=>{
  const slides=__g.scenes().INTRO;
  const i=slides.findIndex(s=>s.art==='nipper');
  const s=slides[i]||{};
  return {i,n:slides.length,last:slides[slides.length-1].art,title:slides[slides.length-1].title,text:s.text||'',art:typeof __g.scenes&&!!(s.art),fn:typeof ART!=='undefined'};
});
const nip=intro.text;
check('nipper slide sits before the Act I title',intro.i===intro.n-2&&intro.last==='title'&&intro.title==='ACT I',intro);
check('gramps calls it a dog',/That was not a drone/.test(nip)&&/“Dog\.”/.test(nip)&&/Dogs do not have that many opinions/.test(nip)&&/terms of service/.test(nip)&&/somebody’s visor/.test(nip),nip);

await p.evaluate(()=>{
  const s=__g.scenes().INTRO.find(x=>x.art==='nipper');
  __g.playScene([s]);
});
await p.waitForTimeout(700);
await p.evaluate(()=>__g.fillSlide());
await p.waitForTimeout(200);
const shot=await p.evaluate(()=>{
  const c=document.getElementById('sc'),t=document.getElementById('scText').textContent;
  return {w:c.width,h:c.height,hidden:document.getElementById('scene').hidden,t};
});
check('nipper slide paints and types the line',shot.w>10&&shot.h>10&&!shot.hidden&&/Dog/.test(shot.t),shot);
await p.screenshot({path:'/opt/cursor/artifacts/sc-nipper.png'});
await clearUI(p);

await p.setViewportSize({width:390,height:844});
await p.evaluate(()=>__g.enter(0));
await clearUI(p);
await p.evaluate(()=>__g.setMode('play'));

const town=await p.evaluate(()=>{
  const n=__g.W.npcs.find(x=>x.id==='tariff');
  return {n:n&&n.name,ids:__g.W.npcs.filter(x=>x.id==='tariff').length};
});
check('stillwater has one coat',town.ids===1&&town.n==='A man in a coat',town);

await p.evaluate(()=>{__g.G.lean=-40;__g.talkTo('tariff')});
const fiat=await p.evaluate(()=>({t:document.getElementById('dT').textContent,body:document.getElementById('dP').textContent,btns:[...document.querySelectorAll('#dBtns button')].map(b=>b.textContent)}));
check('fiat hears en tariff and can wait',fiat.t==='A man in a coat'&&fiat.body==='“En tariff.”'&&fiat.btns[0]==='Wait'&&!/executor/.test(fiat.body),fiat);
await p.screenshot({path:'/opt/cursor/artifacts/sc-tariff.png'});
await p.click('#dBtns button:not([disabled])');
await p.waitForTimeout(80);
const spread=await p.evaluate(()=>document.getElementById('dP').textContent);
check('waiting adds the spread once',spread==='En tariff, and mind the spread.',spread);
await clearUI(p);
await p.evaluate(()=>__g.talkTo('tariff'));
const again=await p.evaluate(()=>({body:document.getElementById('dP').textContent,btns:[...document.querySelectorAll('#dBtns button')].map(b=>b.textContent)}));
check('the spread is not offered twice',again.body==='“En tariff.”'&&again.btns.join('|')==='Leave',again);
await clearUI(p);
await p.evaluate(()=>{__g.G.lean=40;__g.G.st.tariff=0;__g.talkTo('tariff')});
const btc=await p.evaluate(()=>document.getElementById('dP').textContent);
check('a bitcoiner adds executor',btc==='“En tariff, executor.”',btc);
await clearUI(p);

const log=()=>p.evaluate(()=>[...document.querySelectorAll('#log div')].map(d=>d.textContent).join(' | '));
const wipe=()=>p.evaluate(()=>{document.getElementById('log').innerHTML=''});

await p.evaluate(()=>{__g.setMode('play');__g.G.sk[0]=1;__g.G.en=0;__g.castIndex(0)});
const relay=await log();
check('empty energy asks for relays once',/Not enough energy/.test(relay)&&/You must subscribe additional relays/.test(relay)&&/The free tier covers four/.test(relay),relay);
await p.evaluate(()=>{__g.G.en=0;__g.castIndex(0)});
const relay2=await log();
check('relays do not repeat in the same visit',(relay2.match(/subscribe additional relays/g)||[]).length===1,relay2);
await wipe();
await p.waitForTimeout(1600);
await p.evaluate(()=>{__g.enter(0)});
await clearUI(p);
await p.evaluate(()=>{__g.setMode('play');__g.G.sk[0]=1;__g.G.en=0;__g.castIndex(0)});
const relay3=await log();
check('a new town visit may ask again',/subscribe additional relays/.test(relay3),relay3);
await wipe();

await p.evaluate(()=>{__g.setMode('play');__g.G.sats=0});
const broke=[];
broke.push(await p.evaluate(()=>{__g.spendSats(2,'A stim costs 1 sat');return document.getElementById('log').textContent}));
broke.push(await p.evaluate(()=>{__g.spendSats(3);return [...document.querySelectorAll('#log div')].map(d=>d.textContent).join(' | ')}));
check('the first failed spend asks for sats',broke[0]==='Need more sats.',broke);
check('the second failed spend asks for vapour',/Need more sats\./.test(broke[1])&&/Not enough vapour/.test(broke[1]),broke);
await p.locator('#log').screenshot({path:'/opt/cursor/artifacts/sc-lines.png'});
broke.push(await p.evaluate(()=>{__g.spendSats(4,'A stim costs 1 sat');return [...document.querySelectorAll('#log div')].map(d=>d.textContent).join(' | ')}));
check('later failures use the ordinary line',/A stim costs 1 sat/.test(broke[2]),broke);
const paid=await p.evaluate(()=>{document.getElementById('log').innerHTML='';__g.G.sats=5;const ok=__g.spendSats(1);return {ok,sats:__g.G.sats,log:document.getElementById('log').textContent}});
check('a spend that works stays quiet',paid.ok&&paid.sats===4&&paid.log==='',paid);
await wipe();
await p.waitForTimeout(1600);

await p.evaluate(()=>{__g.enter(0)});
await clearUI(p);
await p.evaluate(()=>{__g.setMode('play');__g.G.sats=5000;__g.G.stims=0;__g.G.hp=__g.S.maxHp;__g.vendBuyStim()});
const brenda=await p.evaluate(()=>({stims:__g.G.stims,log:[...document.querySelectorAll('#log div')].map(d=>d.textContent).join(' | ')}));
check('brenda says stimpacks when the belt had room',brenda.stims===1&&/Stimpacks/.test(brenda.log)&&!/Paid /.test(brenda.log),brenda);
await p.evaluate(()=>{__g.G.hp=1;__g.stim()});
const drink=await p.evaluate(()=>({stims:__g.G.stims,log:[...document.querySelectorAll('#log div')].map(d=>d.textContent).join(' | ')}));
check('the drink does not repeat stimpacks that visit',drink.stims===0&&(drink.log.match(/Stimpacks/g)||[]).length===1&&!/That was the pack/.test(drink.log),drink);
await wipe();
await p.waitForTimeout(1600);
await p.evaluate(()=>{__g.enter(0)});
await clearUI(p);
await p.evaluate(()=>{__g.setMode('play');__g.G.stims=1;__g.G.hp=1;__g.stim()});
const empty=await p.evaluate(()=>({stims:__g.G.stims,log:[...document.querySelectorAll('#log div')].map(d=>d.textContent).join(' | ')}));
check('emptying the belt names the pack',empty.stims===0&&/Stimpacks/.test(empty.log)&&/That was the pack/.test(empty.log),empty);
await p.evaluate(()=>{document.getElementById('log').innerHTML='';__g.G.stims=__g.S.cap;const where=__g.giveStim();return {where,stims:__g.G.stims,bag:__g.G.bag.filter(i=>i.stim).length,log:document.getElementById('log').textContent}});
const pack=await p.evaluate(()=>({log:document.getElementById('log').textContent,bag:__g.G.bag.filter(i=>i.stim).length}));
check('a pack stim does not bark',pack.bag>=1&&!/Stimpacks/.test(pack.log),pack);

await wipe();
await p.evaluate(()=>{__g.setMode('play');__g.closeSheet&&__g.closeSheet();__g.openSheet('opts',{})});
await p.waitForTimeout(80);
await p.fill('#scSay','Show me the stipend');
await p.click('[data-scsay]');
const stip=await p.evaluate(()=>({sats:__g.G.sats,flag:__g.G.st.stipend,log:document.getElementById('log').textContent}));
check('the stipend pays one sat once',stip.flag===1&&/The stipend has seen you/.test(stip.log),stip);
const before=stip.sats;
await p.fill('#scSay','show me the stipend');
await p.click('[data-scsay]');
const stip2=await p.evaluate(()=>__g.G.sats);
check('the stipend does not pay twice',stip2===before, {before,stip2});
await p.fill('#scSay','show me the money');
await p.click('[data-scsay]');
await p.fill('#scSay','operation cwal');
await p.click('[data-scsay]');
const rejected=await p.evaluate(()=>({sats:__g.G.sats,slow:__g.P.slow}));
check('the old phrases do nothing',rejected.sats===before&&!(rejected.slow>0),rejected);

await p.evaluate(()=>{__g.setMode('play');document.getElementById('log').innerHTML='';__g.scLine('operation crawl')});
const crawl=await p.evaluate(()=>{const a=__g.P.slow;__g.update(3);const b=__g.P.slow;__g.scLine('Operation crawl');const c=__g.P.slow;return {a,b,c,log:document.getElementById('log').textContent}});
check('crawl slows for a short while and does not stack',crawl.a===10&&crawl.b<10&&crawl.b>6&&crawl.c===10&&/You are early/.test(crawl.log),crawl);

await p.evaluate(()=>__g.enter(1));
await clearUI(p);
const moor=await p.evaluate(()=>{__g.setMode('play');const s=__g.G.sats,sl=__g.P.slow;const ok=__g.scLine('operation crawl');const ok2=__g.scLine('show me the stipend');return {ok,ok2,sats:__g.G.sats,slow:__g.P.slow,s,sl,boss:!!__g.W.z.boss,town:!!__g.W.z.town}});
check('a district does not hear the lines',moor.ok===false&&moor.ok2===false&&moor.sats===moor.s&&moor.slow===moor.sl,moor);

await p.evaluate(()=>__g.enter(5));
await clearUI(p);
const boss=await p.evaluate(()=>{__g.setMode('play');__g.P.slow=0;const s=__g.G.sats;const ok=__g.scLine('show me the stipend');const ok2=__g.scLine('operation crawl');return {ok,ok2,boss:!!__g.W.z.boss,sats:__g.G.sats,slow:__g.P.slow,s}});
check('a boss room does not hear the lines',boss.boss&&boss.ok===false&&boss.ok2===false&&boss.sats===boss.s&&!(boss.slow>0),boss);

await p.evaluate(()=>__g.enter(6));
await clearUI(p);
const sim=await p.evaluate(()=>{__g.setMode('play');__g.P.slow=0;const ok=__g.scLine('operation crawl');return {sim:!!__g.W.z.sim,ok,slow:__g.P.slow}});
check('the simulator hears crawl',sim.sim&&sim.ok===true&&sim.slow===10,sim);

check('no page errors',!errs.length,errs);
if(fail.length){console.log('FAIL',fail.length);fail.forEach(f=>console.log(' -',f));process.exitCode=1}
else console.log('sc-eggs ok');
await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
