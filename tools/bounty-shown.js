/* The bounty board prints the payout the claim will give.
   node tools/bounty-shown.js */
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
await p.evaluate(()=>{const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()};const s=document.getElementById('scene');if(s)s.hidden=true;__g.setMode('play')});

const board=async()=>{
  return p.evaluate(()=>{
    __g.openSheet('bounty',{only:['bounty']});
    return document.getElementById('sheetIn').innerText.replace(/\s+/g,' ');
  });
};

const base=await p.evaluate(()=>{
  const G=__g.G;G.rep={btc:0,anon:0,norm:0};G.cpi=1;G.credits=120;G.sats=0;
  G.bounties=[{zi:1,k:'tick',n:8,c:8,sats:4,cr:100},{zi:1,k:'tick',n:8,c:0,sats:4,cr:100},{zi:1,k:'tick',n:8,c:0,sats:4,cr:100}];
});
const plain=await board();
check('unknown to the anons prints the base pay', /3 contracts/.test(plain)&&/4 sats/.test(plain)&&/₡100/.test(plain)&&!/5 sats/.test(plain)&&!/₡125/.test(plain), plain);

await p.evaluate(()=>{__g.G.rep.anon=10;__g.drawSheet()});
const lurk=await p.evaluate(()=>document.getElementById('sheetIn').innerText.replace(/\s+/g,' '));
check('a lurker prints the 25 percent the claim pays', /3 contracts/.test(lurk)&&/5 sats/.test(lurk)&&/₡125/.test(lurk)&&!/4 sats/.test(lurk), lurk);

await p.evaluate(()=>{
  document.querySelector('#sheetIn .pr').scrollIntoView({block:'center'});
});
await p.screenshot({path:'/opt/cursor/artifacts/screenshot_bounty_shown.png'});

const paid=await p.evaluate(()=>{
  document.querySelector('[data-claim="0"]').click();
  return {sats:__g.G.sats,credits:__g.G.credits};
});
check('the claim pays the printed 5 sats and 125 credits', paid.sats===5&&paid.credits===245, JSON.stringify(paid));

const four=await p.evaluate(()=>{
  const G=__g.G;G.rep.anon=30;
  G.bounties=[{zi:1,k:'tick',n:8,c:0,sats:4,cr:100},{zi:1,k:'tick',n:8,c:0,sats:4,cr:100},{zi:1,k:'tick',n:8,c:0,sats:4,cr:100}];
  __g.drawSheet();
  return document.getElementById('sheetIn').innerText.replace(/\s+/g,' ');
});
check('a contributor sees the fourth contract', /4 contracts/.test(four)&&/5 sats/.test(four), four);

check('no page errors', !errs.length, errs.join('; '));
await b.close();
console.log(fail.length?'FAIL\n'+fail.join('\n'):'bounty-shown ok');
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
