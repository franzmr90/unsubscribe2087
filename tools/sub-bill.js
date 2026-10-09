/* The per-minute subscription bill is gone. A charm on the belt is the whole bonus.
   node tools/sub-bill.js */
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

const one=await p.evaluate(()=>{
  const g=__g,G=g.G;
  G.cpi=1.073;G.adopt=100;G.credits=12;G.web={};G.doc=null;G.para=0;G.at={mgt:0,ref:0,vit:0,bnd:0};G.sk=Array(15).fill(0);
  const belt={slot:'belt',base:'Tool Belt',name:'Tool Belt',id:true,req:1,il:8,q:0,cap:8,csl:2,aff:[]};
  G.eq.belt=belt;G.cslots=[];G.bag=[];
  const c=g.mkCharm(8,{aff:[{k:'dmg',v:4}],req:1,name:'Bill Slip'});
  c.qty=99;G.bag=[c];
  g.charmNormalize(c);
  g.charmSocket(0);
  g.calc();
  const worn=g.S.dmg;
  g.openSheet('items');
  const text=document.getElementById('sheet').innerText;
  const cred=G.credits;
  g.closeSheet();g.setMode('play');
  g.update(2);
  g.charmTakeOff(0);g.calc();
  return {worn,off:g.S.dmg,credits:G.credits,cred,text:/billing|a minute|LAPSED/i.test(text),qty:c.qty,belt:/charms/.test(text),n:G.cslots.length+G.bag.filter(i=>i&&i.charm).length};
});
check('the sheet has belt slots and no minute bill', one.belt&&!one.text, JSON.stringify(one));
check('two seconds do not charge the purse', one.credits===one.cred&&one.credits===12, JSON.stringify(one));
check('the charm adds its roll only while worn, and a quantity does not multiply it', one.worn===one.off+4&&one.qty===undefined&&one.n===1, JSON.stringify(one));

check('no page errors', !errs.length, errs.join('; '));
await b.close();
console.log(fail.length?'FAIL\n'+fail.join('\n'):'sub-bill ok');
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
