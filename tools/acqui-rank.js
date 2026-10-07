/* Acqui-hire prints the skill rank that converts a champion.
   node tools/acqui-rank.js */
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
await p.evaluate(()=>{document.getElementById('title').hidden=true;__g.newGame('founder');__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1});
for(let i=0;i<10;i++){
  await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}});
  await p.waitForTimeout(60);
}
await p.evaluate(()=>__g.enter(1));
await p.waitForTimeout(200);
await p.evaluate(()=>{const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()};const s=document.getElementById('scene');if(s)s.hidden=true;__g.setMode('play')});

const card=async()=>{
  return p.evaluate(()=>{
    __g.openSheet('skills',{only:['skills']});
    document.querySelector('[data-node="7"]').click();
    const now=[...document.querySelectorAll('#popIn .ln')].map(e=>e.textContent).find(t=>t.startsWith('Now:'))||'';
    const row=[...document.querySelectorAll('#popIn .ln')].map(e=>e.textContent).find(t=>t.includes('needs level'))||'';
    return {now,row,lvl:__g.G.lvl,sk:__g.G.sk[7]};
  });
};

await p.evaluate(()=>{__g.G.lvl=20;__g.G.sk[7]=1;__g.calc()});
const low=await card();
check('character level 20 at rank 1 still names rank 5', /Champions resist until rank 5\./.test(low.now)&&!/level 5/.test(low.now)&&/needs level 9/.test(low.row), JSON.stringify(low));

await p.evaluate(()=>{document.querySelector('#popIn .ln').scrollIntoView({block:'center'})});
await p.screenshot({path:'/opt/cursor/artifacts/screenshot_acqui_rank.png'});

await p.evaluate(()=>{__g.G.sk[7]=5;__g.calc();__g.drawSheet()});
const high=await p.evaluate(()=>[...document.querySelectorAll('#popIn .ln')].map(e=>e.textContent).find(t=>t.startsWith('Now:'))||'');
check('rank 5 says champions come over', /Champions too\./.test(high)&&!/resist/.test(high), high);

const cast=await p.evaluate(()=>{
  const g=__g,W=g.W,P=g.P;
  W.ents.length=0;W.allies=W.allies.filter(a=>a.k!=='minion');
  const e=g.spawn('tick',P.x+1,P.y,{champ:1});
  if(!e||!e.champ)return {err:'no champ',e:!!e};
  g.SKF.founder[7](1,1);
  const held=W.ents.includes(e)&&!W.allies.some(a=>a.kind==='conv');
  g.SKF.founder[7](5,1);
  const turned=!W.ents.includes(e)&&W.allies.some(a=>a.kind==='conv'&&a.life===22);
  return {held,turned,life:W.allies.filter(a=>a.kind==='conv').map(a=>a.life)};
});
check('rank 1 leaves the champion; rank 5 hires it for 22s', cast.held&&cast.turned, JSON.stringify(cast));

check('no page errors', !errs.length, errs.join('; '));
await b.close();
console.log(fail.length?'FAIL\n'+fail.join('\n'):'acqui-rank ok');
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
