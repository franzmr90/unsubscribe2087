/* Orange Pill prints the mark timer in tenths, not a rounded second.
   node tools/pill-tenths.js */
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
  __g.G.sk[5]=1;__g.calc();
  __g.openSheet('skills',{only:['skills']});
  document.querySelector('[data-node="5"]').click();
  const t=document.getElementById('popIn').innerText.replace(/\s+/g,' ');
  document.querySelector('#popIn .nm').scrollIntoView({block:'center'});
  return t;
});
check('rank 1 prints 6.3 seconds', /for 6\.3s/.test(card)&&!/for 6s/.test(card)&&!/for 7s/.test(card), card);

const two=await p.evaluate(()=>{
  __g.G.sk[5]=2;__g.drawSheet();
  document.querySelector('[data-node="5"]').click();
  return document.getElementById('popIn').innerText.replace(/\s+/g,' ');
});
check('rank 2 prints 6.6 and the next rank is 6.9', /Now:[\s\S]*for 6\.6s/.test(two)&&/Next point:[\s\S]*for 6\.9s/.test(two)&&!/for 7s/.test(two), two);

const hit=await p.evaluate(()=>{
  const g=__g;
  g.closeSheet();
  g.setMode('play');
  const mark=L=>{
    const e=g.spawn('tick',g.P.x+1,g.P.y,{});
    e.hp=e.max=1000;e.r=e.r||0.4;e.mark=0;
    g.SKF.maxi[5](L,1);
    if(g.P.dash&&g.P.dash.end)g.P.dash.end();
    g.P.dash=null;
    return e.mark;
  };
  return {r1:mark(1),r2:mark(2)};
});
check('rank 1 mark lasts 6.3s', Math.abs(hit.r1-6.3)<1e-9, JSON.stringify(hit));
check('rank 2 mark lasts 6.6s', Math.abs(hit.r2-6.6)<1e-9, JSON.stringify(hit));

await p.evaluate(()=>{
  __g.G.sk[5]=1;__g.calc();__g.openSheet('skills',{only:['skills']});
  document.querySelector('[data-node="5"]').click();
  document.querySelector('#popIn .nm').scrollIntoView({block:'center'});
});
await p.screenshot({path:'/opt/cursor/artifacts/screenshot_pill_tenths.png'});

check('no page errors', !errs.length, errs.join('; '));
await b.close();
console.log(fail.length?'FAIL\n'+fail.join('\n'):'pill-tenths ok');
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
