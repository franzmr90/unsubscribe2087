/* A mastered card prints the two extra ranks and the faster recovery.
   node tools/master-rank.js */
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
await p.evaluate(()=>{document.getElementById('title').hidden=true;__g.newGame('scrapper');__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1});
for(let i=0;i<10;i++){
  await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}});
  await p.waitForTimeout(60);
}
await p.evaluate(()=>__g.enter(0));
await p.waitForTimeout(150);
await p.evaluate(()=>{const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()};__g.setMode('play')});

const life=await p.evaluate(()=>{
  const g=__g;
  g.G.sk[2]=0;g.G.pas=[];g.calc();
  const base=g.S.maxHp;
  g.G.sk[2]=10;g.G.pas=[2];g.calc();
  return {base,hp:g.S.maxHp,want:Math.round(base*1.48)};
});
check('Iron Hide at 10 is twelve ranks of life', life.hp===life.want&&life.hp>life.base, JSON.stringify(life));

const card=await p.evaluate(()=>{
  __g.openSheet('skills',{only:['skills']});
  document.querySelector('[data-node="2"]').click();
  const t=document.getElementById('popIn').innerText;
  const now=document.querySelector('#popIn .ln');
  const lines=[...document.querySelectorAll('#popIn .ln')].map(e=>e.textContent);
  document.querySelector('#popIn .nm').scrollIntoView({block:'center'});
  return {t,lines};
});
check('the card prints twelve ranks of Iron Hide', /Now: \+96% armor and \+48% life/.test(card.t)&&/Mastered\. Two extra ranks\./.test(card.t)&&!/Now: \+80%/.test(card.t), card.t);

const swing=await p.evaluate(()=>{
  __g.G.sk[0]=10;__g.drawSheet();
  document.querySelector('[data-node="0"]').click();
  const t=document.getElementById('popIn').innerText;
  return {t};
});
check('Stop Sign recovery is four fifths of 0.8s', /0\.64s recovery/.test(swing.t)&&/Recovery is 20% faster\./.test(swing.t)&&/Now: .*39% chance to stun/.test(swing.t), swing.t);

const nine=await p.evaluate(()=>{
  __g.G.sk[2]=9;__g.G.pas=[2];__g.calc();__g.drawSheet();
  document.querySelector('[data-node="2"]').click();
  const t=document.getElementById('popIn').innerText;
  return {t,hp:__g.S.maxHp};
});
check('nine ranks show the tenth as mastered', /Now: \+72% armor and \+36% life/.test(nine.t)&&/Next point: \+96% armor and \+48% life/.test(nine.t)&&/The next rank masters it\./.test(nine.t), nine.t);
check('nine ranks are not mastered yet', nine.hp===Math.round(life.base*1.36), JSON.stringify({hp:nine.hp,base:life.base}));

const five=await p.evaluate(()=>{
  __g.G.sk[0]=5;__g.drawSheet();
  document.querySelector('[data-node="0"]').click();
  return document.getElementById('popIn').innerText;
});
check('five ranks keep the printed recovery', /0\.8s recovery/.test(five)&&!/Mastered/.test(five)&&!/20% faster/.test(five), five);

await p.evaluate(()=>{__g.G.sk[2]=10;__g.G.pas=[2];__g.calc();__g.drawSheet();document.querySelector('[data-node="2"]').click()});
await p.screenshot({path:'/opt/cursor/artifacts/screenshot_master_rank.png'});

check('no page errors', !errs.length, errs.join('; '));
await b.close();
console.log(fail.length?'FAIL\n'+fail.join('\n'):'master-rank ok');
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
