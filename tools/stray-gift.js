/* A stranger's gift is the whole credits the line names.
   node tools/stray-gift.js */
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
await p.evaluate(()=>{__g.setMode('play');__g.G.stims=0});

const early=await p.evaluate(()=>{
  __g.G.credits=90;__g.G.stims=0;
  const before=__g.G.credits;
  const o={k:'stray',x:2,y:2};
  __g.W.objs.push(o);
  __g.useObj(o);
  return {before,after:__g.G.credits,line:document.getElementById('dP').textContent,left:__g.W.objs.indexOf(o)};
});
check('ninety credits gives thirteen', early.before-early.after===13&&early.after===77&&/You give up ₡13 and/.test(early.line)&&early.left<0, JSON.stringify(early));
await clearUI(p);

const act2=await p.evaluate(()=>{
  __g.setMode('play');__g.G.credits=333;__g.G.stims=0;
  const before=__g.G.credits;
  const o={k:'stray',x:3,y:3};
  __g.W.objs.push(o);
  __g.useObj(o);
  return {before,after:__g.G.credits,line:document.getElementById('dP').textContent};
});
check('three hundred thirty-three credits gives forty-nine', act2.before-act2.after===49&&/You give up ₡49 and/.test(act2.line), JSON.stringify(act2));
await clearUI(p);

const stim=await p.evaluate(()=>{
  __g.setMode('play');__g.G.credits=100;__g.G.stims=1;
  const before=__g.G.credits;
  const o={k:'stray',x:4,y:4};
  __g.W.objs.push(o);
  __g.useObj(o);
  return {before,after:__g.G.credits,stims:__g.G.stims,line:document.getElementById('dP').textContent};
});
check('a stim is the gift when you have one', stim.before===stim.after&&stim.stims===0&&/a stim/.test(stim.line)&&!/₡/.test(stim.line), JSON.stringify(stim));
check('no page errors', !errs.length, errs.join('; '));

await b.close();
console.log(fail.length?'FAIL\n'+fail.join('\n'):'stray-gift ok');
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
