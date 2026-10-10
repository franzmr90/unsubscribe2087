/* A dead hardcore hero begins again. A softcore 0-life save still wakes.
   node tools/hc-load.js */
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
const fail=[];
const check=(n,ok,d)=>{if(!ok)fail.push(n+(d?': '+d:''));};
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
await p.waitForTimeout(400);
await p.evaluate(()=>__g.skipDisc());

const list=await p.evaluate(()=>{
  const C=__g.CLD;
  C[1]={t:Date.now()+1e12,lv:22,cl:'hacker',ac:3,s:JSON.stringify({G:{cls:'hacker',lvl:22,hp:0,hc:true,act2:1,act3:1}})};
  C[2]={t:Date.now()+1e12,lv:9,cl:'courier',ac:2,s:JSON.stringify({G:{cls:'courier',lvl:9,hp:40,hc:true,act2:1}})};
  const dead=__g.slotInfo(1),live=__g.slotInfo(2);
  __g.drawSlots();
  return {dead:!!(dead&&dead.dead),liveDead:!!(live&&live.dead),act:dead&&dead.act,title:document.getElementById('slots').textContent};
});
check('a 0-life hardcore cloud body is fallen', list.dead===true, JSON.stringify(list));
check('a living hardcore cloud body is not fallen', list.liveDead===false, JSON.stringify(list));
check('the fallen row names Act III', list.act===3, String(list.act));
check('the title says fallen, not Continue, for the corpse', /Hardcore · fallen/.test(list.title)&&/begins again/.test(list.title), list.title);
check('the living hardcore row still says Continue', /Continue · level 9 Runner/.test(list.title), list.title);

await p.click('[data-cls=scrapper]');
await p.waitForTimeout(250);
await p.evaluate(()=>{__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1});
await clearUI(p);
await p.evaluate(()=>__g.enter(0));
await clearUI(p);
await p.evaluate(()=>{__g.setMode('play');__g.G.walkNew=0;__g.OPT.noWalk=1});

const soft=await p.evaluate(()=>{
  const g=JSON.parse(JSON.stringify(__g.G));
  g.lvl=18;g.hp=0;g.hc=false;g.credits=7777;g.cls='scrapper';
  const ok=__g.applySave({G:g,zs:{},cur:{zi:3,x:2,y:2},t:1});
  return {ok,lvl:__g.G.lvl,hp:__g.G.hp,hc:!!__g.G.hc,credits:__g.G.credits,cur:__g.G._cur};
});
check('softcore 0 life still loads', soft.ok===true, JSON.stringify(soft));
check('softcore 0 life wakes above 0', soft.hp===9999, JSON.stringify(soft));
check('softcore keeps the level', soft.lvl===18, JSON.stringify(soft));
check('softcore does not become hardcore', soft.hc===false, JSON.stringify(soft));
check('softcore does not resume on the corpse', soft.cur==null, JSON.stringify(soft));

const begun=await p.evaluate(()=>{
  const g=JSON.parse(JSON.stringify(__g.G));
  g.lvl=18;g.hp=-3;g.hc=true;g.credits=7777;g.cls='scrapper';
  g.bag=[{name:'MARKER'}];
  __g.applySave({G:g,zs:{},cur:{zi:3,x:2,y:2},t:1});
  const mid={lvl:__g.G.lvl,hp:__g.G.hp,hc:!!__g.G.hc};
  __g.startPlay();
  return {mid,lvl:__g.G.lvl,hp:__g.G.hp,hc:!!__g.G.hc,credits:__g.G.credits,bag:(__g.G.bag||[]).some(it=>it.name==='MARKER'),mode:__g.mode};
});
check('load leaves the hardcore corpse at 0 life', begun.mid.hp<=0&&begun.mid.lvl===18&&begun.mid.hc===true, JSON.stringify(begun.mid));
check('starting play replaces the corpse', begun.lvl===1&&begun.hc===true&&begun.hp>0, JSON.stringify(begun));
check('the new wanderer does not keep the corpse purse or pack', begun.credits===120&&begun.bag===false, JSON.stringify(begun));
check('begin again opens the new-game scene', begun.mode==='scene', begun.mode);

await clearUI(p);
const after=await p.evaluate(()=>({lvl:__g.G.lvl,hc:!!__g.G.hc,hp:__g.G.hp,mode:__g.mode,pre:__g.G.pre}));
check('after the intro the new hero is still level 1 hardcore', after.lvl===1&&after.hc===true&&after.hp>0, JSON.stringify(after));

const opt=await p.evaluate(()=>{
  __g.setMode('play');
  __g.openSheet('opts',{});
  const fallen=[...document.querySelectorAll('#sheet .li')].find(n=>/fallen/.test(n.textContent));
  const span=fallen?fallen.querySelector('span'):null;
  const clip=!!(span&&span.scrollHeight<=span.clientHeight+2);
  return {txt:fallen?fallen.textContent:'',clip,sh:span&&span.scrollHeight,ch:span&&span.clientHeight};
});
check('Options names the fallen slot', /Hardcore · fallen/.test(opt.txt)&&/begins again/.test(opt.txt), opt.txt);
check('the fallen Options line is not clipped', opt.clip===true, JSON.stringify(opt));
await p.evaluate(()=>__g.closeSheet());

await p.evaluate(()=>{__g.G.walkNew=0;__g.OPT.noWalk=1;__g.setMode('play')});
await p.evaluate(()=>__g.enter(1,{fresh:true}));
await clearUI(p);
const died=await p.evaluate(()=>{
  __g.setMode('play');__g.P.inv=0;__g.G.hc=true;__g.G.god=false;__g.G.lvl=6;
  const before=__g.G.credits;
  __g.hurt(1e9,false,{name:'a test'});
  return {hp:__g.G.hp,hc:!!__g.G.hc,mode:__g.mode,lvl:__g.G.lvl,before,after:__g.G.credits};
});
check('a hardcore death reaches 0 life', died.hp<=0&&died.hc&&died.mode==='dying'&&died.lvl===6, JSON.stringify(died));
check('a hardcore death leaves the purse', died.before===died.after&&died.before>0, JSON.stringify(died));
await p.waitForTimeout(2800);
const rise=await p.evaluate(()=>{
  const b=document.getElementById('bRise');
  return {txt:b?b.textContent:'',hidden:document.getElementById('death').hidden,stats:document.getElementById('deathS').textContent};
});
check('the death button says Begin again', rise.txt==='Begin again'&&rise.hidden===false, JSON.stringify(rise));
check('the death panel names no credit charge', /Credits on the body/.test(rise.stats)&&/none/.test(rise.stats)&&!/₡/.test(rise.stats), rise.stats);
await p.click('#bRise');
await p.waitForTimeout(200);
const again=await p.evaluate(()=>({lvl:__g.G.lvl,hc:!!__g.G.hc,hp:__g.G.hp,credits:__g.G.credits,mode:__g.mode}));
check('Begin again is a new hardcore wanderer', again.lvl===1&&again.hc&&again.hp>0&&again.credits===120&&again.mode==='scene', JSON.stringify(again));

if(errs.length)fail.push('pageerror '+errs.join(' | '));
await b.close();
if(fail.length){console.log('FAIL');fail.forEach(f=>console.log(' - '+f));process.exit(1)}
console.log('hc-load ok');
})().catch(e=>{console.error(e);process.exit(1)});
