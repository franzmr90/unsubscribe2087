/* Nonce’s copy and purse use thirty percent off Brenda’s printed price.
   node tools/thirty-off.js */
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

const pin=await p.evaluate(()=>{
  const g=__g;
  g.G.cpi=1;
  g.G.disc=0;
  g.G.rep.norm=0;
  g.G.scs=700;
  g.G.credits=5000;
  g.shop[0].val=40;
  g.talkTo('brenda');
  const btn=[...document.querySelectorAll('#dBtns button')].find(e=>/Trade/.test(e.textContent));
  btn.click();
  const price=document.querySelector('[data-shop="0"] .pr').textContent;
  g.closeSheet();
  return price;
});
check('Brenda prints ₡100 for a value of 40', pin==='₡100', pin);

const off=await p.evaluate(()=>{
  const g=__g;
  g.G.scs=400;
  g.talkTo('nonce');
  const body=document.getElementById('dP').textContent;
  const buttons=[...document.querySelectorAll('#dBtns button')].map(e=>e.textContent);
  return {body,buttons};
});
check('Nonce names thirty percent off', /thirty percent off her price/.test(off.body)&&!/cost me/.test(off.body), off.body);
check('the button says 30% off', off.buttons.some(t=>t==='Brenda’s goods, 30% off')&&!off.buttons.some(t=>/at cost/.test(t)), off.buttons.join(' | '));

await p.evaluate(()=>{
  const btn=[...document.querySelectorAll('#dBtns button')].find(e=>e.textContent==='Brenda’s goods, 30% off');
  btn.click();
});
const shop=await p.evaluate(()=>{
  const row=document.querySelector('[data-shop="0"] .pr').textContent;
  const head=document.querySelector('#sheetIn h2').textContent;
  const note=[...document.querySelectorAll('#sheetIn p')].map(e=>e.textContent).join(' ');
  return {row,head,note};
});
check('his tag is ₡70', shop.row==='₡70', shop.row);
check('the counter says thirty percent off', /Thirty percent off her price/.test(shop.note)&&/Nonce/.test(shop.head), shop.head+' '+shop.note);

const odd=await p.evaluate(()=>{
  const g=__g;
  g.G.cpi=1.1;
  g.shop[0].val=13;
  g.drawSheet();
  const row=document.querySelector('[data-shop="0"] .pr').textContent;
  const before=g.G.credits;
  document.querySelector('[data-shop="0"]').click();
  document.querySelector('[data-buy="item"]').click();
  return {row,paid:before-g.G.credits};
});
check('a 35.75 price is ₡35 off, then ₡24', odd.row==='₡24'&&odd.paid===24, JSON.stringify(odd));

const hero=await p.evaluate(()=>{
  __g.closeSheet();
  __g.openSheet('char');
  return document.getElementById('sheetIn').innerText;
});
check('the hero sheet says 30% off', /stocks Brenda’s goods at 30% off/.test(hero)&&!/at cost/.test(hero), hero.slice(hero.indexOf('Social credit'), hero.indexOf('Social credit')+500));

await p.evaluate(()=>{
  __g.closeSheet();
  __g.G.cpi=1;
  __g.shop[0]&&(__g.shop[0].val=40);
  __g.talkTo('nonce');
});
await p.screenshot({path:'/opt/cursor/artifacts/screenshot_thirty_off.png'});

check('no page errors', !errs.length, errs.join('; '));
await b.close();
console.log(fail.length?'FAIL\n'+fail.join('\n'):'thirty-off ok');
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
