/* Twenty-One Million: the card's +8% armour per rank lands on the sheet.
   node tools/twenty-one.js */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const fail=m=>{console.error(m);process.exitCode=1;throw new Error(m)};
const root=path.join(__dirname,'..');
const shot=path.join('/opt/cursor/artifacts','twenty-one-armour.png');

(async()=>{
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.stack||String(e)));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8')+'</body></html>');
await p.waitForTimeout(400);
await p.evaluate(()=>{__g.skipDisc();__g.OPT.noWalk=1});
await p.evaluate(()=>{document.getElementById('title').hidden=true;__g.newGame('maxi');__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1});
for(let i=0;i<12;i++){
  await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}});
  await p.waitForTimeout(60);
}
await p.evaluate(()=>__g.enter(0));
await p.waitForTimeout(150);
await p.evaluate(()=>{const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()};__g.setMode('play');__g.G.walkNew=0;__g.OPT.noWalk=1});

const r=await p.evaluate(()=>{
  const g=__g,G=g.G,fail=[];
  const card=g.CLS.maxi.sk[8];
  if(card.n!=='Twenty-One Million')fail.push('skill 8 is '+card.n);
  if(!/8% armour/.test(card.d(1)))fail.push('rank 1 card '+card.d(1));
  if(!/80% armour/.test(card.d(10)))fail.push('rank 10 card '+card.d(10));
  G.lvl=60;G.act2=1;G.act3=1;G.sp=0;
  G.eq={weapon:null,helm:null,armor:null,gloves:null,boots:null,belt:null,ring:null,amulet:null};
  G.at={mgt:0,ref:10,vit:0,bnd:0};
  G.sk=[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0];G.pas=[];
  function arm(rank,on){
    G.cls='maxi';G.sk[8]=rank;G.pas=on&&rank?[8]:[];g.calc();return g.S.armor}
  const bare=arm(0,false);
  if(bare!==10)fail.push('bare reflex armour '+bare);
  const want=(rank,on)=>{const eff=on&&rank?rank+(rank>=10?2:0):0;return Math.round(10*(1+.08*eff))};
  for(const [rank,on] of [[1,true],[5,true],[10,true],[10,false]]){
    const got=arm(rank,on),w=want(rank,on);
    if(got!==w)fail.push('rank '+rank+(on?' on':' off')+' armour '+got+' want '+w)}
  G.cls='courier';G.sk=[1,0,0,0,0,0,0,0,10,0,0,0,0,0,0];G.pas=[8];g.calc();
  if(g.S.armor!==10)fail.push('courier skill 8 moved armour to '+g.S.armor);
  G.cls='maxi';G.sk=[1,0,0,0,0,0,0,0,10,0,0,0,0,0,0];G.pas=[8];g.calc();
  g.setMode('play');g.openSheet('items');
  const shown=document.getElementById('sheetIn').innerText;
  return {fail,armor:g.S.armor,shown:shown.includes('Armor')&&/Armor\s*20/.test(shown.replace(/\s+/g,' '))};
});
if(r.fail.length)fail(r.fail.join('\n'));
if(r.armor!==20)fail('sheet armour '+r.armor);
if(!r.shown)fail('items sheet did not show Armor 20');
await p.screenshot({path:shot});
console.log('twenty-one armour ok',r.armor);
if(errs.length)fail('pageerror\n'+errs.join('\n'));
await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
