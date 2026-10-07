/* Death screen names the act town, and a declaration holds the gate.
   node tools/town-return.js */
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
await p.waitForTimeout(200);
await p.click('[data-cls=scrapper]');
await p.waitForTimeout(250);
await p.evaluate(()=>{__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1});
await clearUI(p);
await p.evaluate(()=>__g.enter(1));
await clearUI(p);
await p.evaluate(()=>{__g.setMode('play');__g.P.inv=0;__g.G.god=0});

const start=await p.evaluate(()=>({x:__g.W.start.x,y:__g.W.start.y}));
await p.evaluate(()=>__g.hurt(1e9,0,{name:'a Tick'}));
await p.waitForTimeout(2800);
const act1=await p.evaluate(()=>({
  btn:document.getElementById('bRise').textContent,
  note:document.getElementById('deathNote').textContent,
  line:document.getElementById('deathP').textContent
}));
check('Act I rises in Stillwater Commons', act1.btn==='Rise in Stillwater Commons', act1.btn);
check('the portal is the district entrance', /start of the district/.test(act1.note), act1.note);
check('the slain line names the district', /The Parcel Moors/.test(act1.line), act1.line);
await p.click('#bRise');
await p.waitForTimeout(400);
await clearUI(p);
const back=await p.evaluate(()=>({zi:__g.W.zi,pz:__g.G.portal&&__g.G.portal.zi,x:__g.G.portal&&__g.G.portal.x,y:__g.G.portal&&__g.G.portal.y}));
check('Act I death lands in Stillwater', back.zi===0, JSON.stringify(back));
check('the portal remembers the entrance', back.pz===1&&back.x===start.x&&back.y===start.y, JSON.stringify(back)+' start '+start.x+','+start.y);

await p.evaluate(()=>{__g.G.act2=true;__g.enter(7);__g.setMode('play');__g.P.inv=0;__g.G.hp=__g.S.maxHp});
await clearUI(p);
await p.evaluate(()=>__g.hurt(1e9,0,{name:'a Wisp'}));
await p.waitForTimeout(2800);
const act2=await p.evaluate(()=>document.getElementById('bRise').textContent);
check('Act II rises in The Landing', act2==='Rise in The Landing', act2);
await p.click('#bRise');
await p.waitForTimeout(300);
const land=await p.evaluate(()=>__g.W.zi);
check('Act II death lands in The Landing', land===17, String(land));

await p.evaluate(()=>{__g.G.hc=true;__g.enter(1);__g.setMode('play');__g.P.inv=0;__g.G.hp=__g.S.maxHp;__g.G.god=0});
await clearUI(p);
await p.evaluate(()=>__g.hurt(1e9,0,{name:'a Tick'}));
await p.waitForTimeout(2800);
const hc=await p.evaluate(()=>({btn:document.getElementById('bRise').textContent,note:document.getElementById('deathNote').textContent}));
check('hardcore begins again', hc.btn==='Begin again', hc.btn);
check('hardcore promises no portal', /no portal/i.test(hc.note)&&!/square/.test(hc.note), hc.note);

await p.evaluate(()=>{
  const death=document.getElementById('death');if(death)death.hidden=true;
  __g.G.hc=false;__g.G.hp=__g.S.maxHp;__g.setMode('play');__g.enter(0);
  __g.MP.portalUntil=Date.now()+60000;
  __g.openSheet('travel',{gFresh:1});
});
await p.click('[data-go="1"]');
await p.waitForTimeout(200);
const held=await p.evaluate(()=>({zi:__g.W.zi,log:document.getElementById('log').innerText}));
check('the gate waits out the declaration', held.zi===0&&/holds you here/.test(held.log), JSON.stringify(held));
check('no page errors', !errs.length, errs.join('; '));

await b.close();
console.log(fail.length?'FAIL\n'+fail.join('\n'):'town-return ok');
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
