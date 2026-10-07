/* Marked to Market prints the 30% a low rank already deals.
   node tools/mark-floor.js */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');

(async()=>{
const html=fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8');
const fail=[];
const check=(n,ok,d)=>{if(!ok)fail.push(n+(d?': '+d:''));};
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
await p.waitForTimeout(400);
await p.evaluate(()=>{__g.skipDisc();__g.OPT.noWalk=1});
await p.evaluate(()=>{document.getElementById('title').hidden=true;__g.newGame('maxi');__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1});
for(let i=0;i<10;i++){
  await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}});
  await p.waitForTimeout(60);
}
await p.evaluate(()=>__g.enter(0));
await p.waitForTimeout(150);
await p.evaluate(()=>{const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()};const s=document.getElementById('scene');if(s)s.hidden=true;__g.setMode('play')});

const card=await p.evaluate(()=>{
  __g.G.sk[4]=1;__g.calc();
  __g.openSheet('skills',{only:['skills']});
  document.querySelector('[data-node="4"]').click();
  const t=document.getElementById('popIn').innerText;
  document.querySelector('#popIn .nm').scrollIntoView({block:'center'});
  return t;
});
check('rank 1 prints 30 percent', /takes \+30% damage/.test(card)&&/3\.7 paces/.test(card)&&!/\+24%/.test(card), card);

const two=await p.evaluate(()=>{
  __g.G.sk[4]=2;__g.drawSheet();
  document.querySelector('[data-node="4"]').click();
  return document.getElementById('popIn').innerText;
});
check('rank 2 stays at 30 and the next rank is 32', /Now: Aura\.[^\n]*\+30% damage/.test(two)&&/Next point: Aura\.[^\n]*\+32% damage/.test(two), two);

const hit=await p.evaluate(()=>{
  const g=__g;
  g.closeSheet();
  g.setMode('play');
  g.G.sk[4]=1;g.calc();
  g.P.aura={i:4,L:1,t:5};
  const e=g.spawn('tick',g.P.x+1,g.P.y,{});
  e.hp=e.max=1000;e.mods={};e.ward=0;
  g.maxiAura(0);
  const low=e.mkP;
  g.dmgEnemy(e,100,false);
  const dealt=1000-e.hp;
  g.G.sk[4]=3;g.P.aura={i:4,L:3,t:5};
  const e2=g.spawn('tick',g.P.x+1,g.P.y,{});
  e2.hp=e2.max=1000;e2.mods={};e2.ward=0;
  g.maxiAura(0);
  g.dmgEnemy(e2,100,false);
  return {low,dealt,dealt3:1000-e2.hp,mk3:e2.mkP};
});
check('rank 1 deals the 30 percent mark', hit.dealt===130&&hit.low===0.24, JSON.stringify(hit));
check('rank 3 deals the printed 32 percent', hit.dealt3===132&&Math.abs(hit.mk3-0.32)<1e-9, JSON.stringify(hit));

await p.evaluate(()=>{
  __g.G.sk[4]=1;__g.calc();__g.openSheet('skills',{only:['skills']});
  document.querySelector('[data-node="4"]').click();
  document.querySelector('#popIn .nm').scrollIntoView({block:'center'});
});
await p.screenshot({path:'/opt/cursor/artifacts/screenshot_mark_floor.png'});

check('no page errors', !errs.length, errs.join('; '));
await b.close();
console.log(fail.length?'FAIL\n'+fail.join('\n'):'mark-floor ok');
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
