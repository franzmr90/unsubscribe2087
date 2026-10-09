/* A price tag's whole credits are what the purse pays.
   node tools/price-tag.js */
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
await p.evaluate(()=>__g.enter(0));
await clearUI(p);
/* Prices climb while the clock runs, and buying strength lowers adoption, so each check pins the index. */
await p.evaluate(()=>{__g.setMode('play');__g.G.cpi=1.073;__g.G.adopt=100;__g.G.lvl=1;__g.G.disc=null;__g.G.stims=0;__g.G.credits=32;__g.mktInit();const f=__g.mktFair()||1;__g.G.mkt.p=1;__g.G.mkt.r=1/f;__g.G.mkt.sent=0;__g.G.mkt.sT=1e9;__g.G.sats=32});
await p.evaluate(()=>{__g.openSheet('shop',{only:['items','shop']});__g.VEND.tab='supplies';__g.drawSheet()});
const stim=await p.evaluate(()=>{
  const btn=document.querySelector('[data-vstim="1"]');
  return {text:btn?btn.textContent:'',off:btn?btn.disabled:true};
});
check('a stim tag of 32 is payable with 32', /32 sats/.test(stim.text)&&!stim.off, JSON.stringify(stim));
await p.click('[data-vstim="1"]');
const stimPay=await p.evaluate(()=>({credits:__g.G.credits,sats:__g.G.sats,stims:__g.G.stims}));
check('the stim takes 32', stimPay.sats===0&&stimPay.credits===32&&stimPay.stims===1, JSON.stringify(stimPay));

const id=await p.evaluate(()=>{
  const it=__g.makeItem(3,1,'helm');it.id=false;it.name='UNNAMED';
  __g.G.bag=[it];__g.G.sats=42;__g.G.credits=42;
  __g.drawSheet();
  const btn=document.querySelector('[data-vid="1"]');
  return {text:btn?btn.textContent:'',off:btn?btn.disabled:true};
});
check('appraisal of 42 is payable with 42', /42 sats/.test(id.text)&&!id.off, JSON.stringify(id));
await p.click('[data-vid="1"]');
const idPay=await p.evaluate(()=>({credits:__g.G.credits,sats:__g.G.sats,named:__g.G.bag[0]&&__g.G.bag[0].id}));
check('appraisal takes 42 and names the piece', idPay.sats===0&&idPay.credits===42&&idPay.named, JSON.stringify(idPay));

await p.evaluate(()=>{__g.closeSheet();__g.setMode('play');__g.G.cpi=1.073;__g.G.adopt=100;__g.G.lvl=1;__g.G.credits=125;__g.G.sats=125;__g.mktInit();const f=__g.mktFair()||1;__g.G.mkt.p=1;__g.G.mkt.r=1/f;__g.G.mkt.sent=0;__g.G.mkt.sT=1e9;__g.G.bag=[];__g.openSheet('gamble',{only:['items','gamble']})});
const box=await p.evaluate(()=>{
  const line=[...document.querySelectorAll('#sheet p, #sheet u')].map(n=>n.textContent).join(' ');
  const btn=document.querySelector('[data-vbox]');
  return {line,off:btn?btn.disabled:true};
});
check('a box tag of 125 is payable with 125', /125 sats/.test(box.line)&&!box.off, JSON.stringify(box));
await p.click('[data-vbox]');
const boxPay=await p.evaluate(()=>({credits:__g.G.credits,sats:__g.G.sats,bag:__g.G.bag.length}));
check('the box takes 125', boxPay.sats===0&&boxPay.credits===125&&boxPay.bag===1, JSON.stringify(boxPay));

await p.evaluate(()=>{__g.closeSheet();__g.setMode('play');__g.G.cpi=1.073;__g.G.adopt=100;__g.G.lvl=1;__g.G.credits=88;__g.G.merc=null;__g.openSheet('merc',{only:['merc']})});
const hire=await p.evaluate(()=>{
  const btn=document.querySelector('[data-hire]');
  return {text:btn?btn.textContent:'',off:btn?btn.disabled:true};
});
check('a hire tag of 88 is payable with 88', /₡88/.test(hire.text)&&!hire.off, JSON.stringify(hire));
await p.click('[data-hire]');
const hirePay=await p.evaluate(()=>({credits:__g.G.credits,merc:!!__g.G.merc}));
check('the hire takes 88', hirePay.credits===0&&hirePay.merc, JSON.stringify(hirePay));

await p.evaluate(()=>{__g.closeSheet();__g.setMode('play');__g.G.cpi=1.073;__g.G.adopt=100;__g.G.lvl=1;__g.G.credits=160;__g.G.lean=0;__g.talkFloat()});
const now=await p.evaluate(()=>{
  const btn=[...document.querySelectorAll('#dBtns button')].find(b=>/Now:/.test(b.textContent));
  return {text:btn?btn.textContent:'',off:btn?btn.disabled:true};
});
check('strength on credit costs 160', /₡160/.test(now.text)&&!now.off, JSON.stringify(now));
await p.click('#dBtns button');
await p.waitForTimeout(80);
const nowPay=await p.evaluate(()=>__g.G.credits);
check('strength on credit takes 160', nowPay===0, String(nowPay));

await clearUI(p);
await p.evaluate(()=>{__g.setMode('play');__g.G.cpi=1.073;__g.G.adopt=100;__g.G.lvl=1;__g.G.credits=160;__g.talkTo('null')});
const sister=await p.evaluate(()=>{
  const btn=[...document.querySelectorAll('#dBtns button')].find(b=>/Unlearn/.test(b.textContent));
  return {text:btn?btn.textContent:'',off:btn?btn.disabled:true};
});
check('unlearning costs 160', /₡160/.test(sister.text)&&!sister.off, JSON.stringify(sister));
const unlearn=await p.evaluate(()=>{
  const btn=[...document.querySelectorAll('#dBtns button')].find(b=>/Unlearn/.test(b.textContent));
  if(!btn||btn.disabled)return {clicked:false};
  btn.click();
  return {clicked:true,credits:__g.G.credits};
});
check('unlearning takes 160', unlearn.clicked&&unlearn.credits===0, JSON.stringify(unlearn));

check('no page errors', !errs.length, errs.join('; '));
await b.close();
console.log(fail.length?'FAIL\n'+fail.join('\n'):'price-tag ok');
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
