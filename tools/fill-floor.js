/* A filled order pays the whole credits the line names.
   node tools/fill-floor.js */
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

const sold=await p.evaluate(()=>{
  const g=__g;
  g.G.adopt=100;g.G.rep.btc=0;g.G.sats=2;g.G.credits=0;
  g.mktInit();g.G.mkt.p=100.4;g.G.mkt.r=100.4/g.mktFair();g.G.mkt.ord=[];
  g.openSheet('sats',{only:['sats']});
  document.querySelector('[data-mkq="1"]').click();
  g.G.mkt.p=100.4;g.drawSheet();
  document.querySelector('[data-mko="s3"]').click();
  const o=g.G.mkt.ord[0];
  const px=o&&o.px,pay=Math.floor(px)+Math.floor(px*0.002);
  const fair=g.mktFair();
  g.G.mkt.r=(px+1)/fair;
  g.mktTick(0);
  g.closeSheet();
  return {px,pay,credits:g.G.credits,sats:g.G.sats,orders:g.G.mkt.ord.length,log:document.getElementById('log').textContent};
});
check('the sale pays the ₡103 the fill names', sold.px>103&&sold.px<104&&sold.pay===103&&sold.credits===103&&sold.sats===1&&sold.orders===0&&/at ₡103/.test(sold.log)&&/Maker rebate ₡0/.test(sold.log), JSON.stringify(sold));

await p.waitForTimeout(250);
await p.screenshot({path:'/opt/cursor/artifacts/screenshot_fill_floor.png'});
const hud=await p.evaluate(()=>document.getElementById('cr').textContent);
check('the purse on screen reads ₡103', hud.startsWith('₡103'), hud);

const bought=await p.evaluate(()=>{
  const g=__g;
  g.G.credits=1000;g.G.mkt.cb={n:0,cr:0,st:0};g.G.mkt.ord=[];
  const px=800.6;
  if(!g.mktPost(1,px,'buy'))return {posted:false};
  const held=g.G.credits;
  const fair=g.mktFair();
  g.G.mkt.r=100/fair;
  g.mktTick(0);
  return {posted:true,held,credits:g.G.credits,sats:g.G.sats,basis:g.G.mkt.cb.cr,orders:g.G.mkt.ord.length,log:document.getElementById('log').textContent,rebate:Math.floor(px*0.002)};
});
check('the rebate pays the ₡1 the line names', bought.posted&&bought.held===200&&bought.rebate===1&&bought.credits===201&&bought.basis===799&&bought.orders===0&&/Maker rebate ₡1/.test(bought.log), JSON.stringify(bought));

check('no page errors', !errs.length, errs.join('; '));
await b.close();
console.log(fail.length?'FAIL\n'+fail.join('\n'):'fill-floor ok');
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
