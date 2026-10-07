/* Skill points, respec, the web, and the level-cap lines.
   node tools/skills-level.js [outdir] */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const OUT=process.argv[2];
const fail=m=>{console.error(m);process.exitCode=1;throw new Error(m)};
const root=path.join(__dirname,'..');
const spent=L=>L<=5?L:5+(L-5)*2;

(async()=>{
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.stack||String(e)));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8')+'</body></html>');
await p.waitForTimeout(400);
await p.evaluate(()=>{__g.skipDisc();__g.OPT.noWalk=1});
await p.evaluate(()=>{document.getElementById('title').hidden=true;__g.newGame('scrapper');__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1});
for(let i=0;i<12;i++){
  await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}});
  await p.waitForTimeout(60);
}
await p.evaluate(()=>__g.enter(0));
await p.waitForTimeout(150);
await p.evaluate(()=>{const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()};__g.setMode('play');__g.G.walkNew=0;__g.OPT.noWalk=1});

const cap=await p.evaluate(()=>{
  const g=__g,G=g.G;
  G.lvl=50;G.act2=1;G.act3=G.act4=G.act5=0;G.xp=0;
  g.openSheet('char');
  const mid=document.getElementById('sheetIn').innerText;
  G.act5=1;G.lvl=100;G.act3=1;g.drawSheet();
  const end=document.getElementById('sheetIn').innerText;
  G.act2=G.act3=G.act4=G.act5=0;G.lvl=25;g.drawSheet();
  const act1=document.getElementById('sheetIn').innerText;
  return {mid,end,act1};
});
if(!/It rises when you enter the next act/.test(cap.mid))fail('act II cap '+cap.mid.slice(0,180));
if(/You have reached the level limit/.test(cap.mid))fail('act II said the limit was final');
if(!/You have reached the level limit/.test(cap.end))fail('act V cap '+cap.end.slice(0,180));
if(!/half a level/.test(cap.end)||!/seven percent of that half more than the last/.test(cap.end))fail('tenure '+cap.end);
if(!/It rises when you enter the next act/.test(cap.act1))fail('act I cap');
await p.evaluate(()=>{__g.G.act2=1;__g.G.lvl=50;__g.G.act5=0;__g.drawSheet()});
if(OUT)await p.screenshot({path:path.join(OUT,'skills-level-hero.png')});

const hints=await p.evaluate(()=>{
  __g.closeSheet();
  __g.openSheet('skills');
  const skills=document.getElementById('sheetIn').innerText;
  document.querySelector('[data-tab="web"]').click();
  const web=document.getElementById('sheetIn').innerText;
  __g.closeSheet();
  __g.openSheet('shift',{only:['shift']});
  const shift=document.getElementById('sheetIn').innerText;
  return {skills,web,shift,rw:__g.SQ.carer.rw};
});
if(!/a fifth in Act V/.test(hints.skills))fail('passive slots '+hints.skills.slice(0,400));
if(!/Each level you gain adds one/.test(hints.web)||/One point per level/.test(hints.web))fail('web line');
if(!/two for each rank from 6 to 10/.test(hints.shift))fail('shift line');
if(!/\+3 attribute points/.test(hints.rw))fail('caretaker '+hints.rw);
await p.evaluate(()=>{__g.closeSheet();__g.openSheet('skills')});
if(OUT)await p.screenshot({path:path.join(OUT,'skills-level-skills.png')});
await p.evaluate(()=>document.querySelector('[data-tab="web"]').click());
if(OUT)await p.screenshot({path:path.join(OUT,'skills-level-web.png')});

const syn=await p.evaluate(()=>{
  const g=__g,fail=[],sk=g.CLS[g.G.cls].sk;
  g.closeSheet();g.openSheet('skills');
  let shown=0,hidden=0;
  for(let i=0;i<sk.length;i++){
    if(!Math.floor(i/3)||!sk[i].a)continue;
    document.querySelector('[data-node="'+i+'"]').click();
    const pop=document.getElementById('pop').textContent;
    const fn=g.SKF[g.G.cls][i];
    const uses=!!(fn&&/\*m\b|\bm\*=/.test(fn.toString()));
    const on=/scales with it/.test(pop);
    if(uses!==on)fail.push(sk[i].n+' uses '+uses+' shown '+on);
    if(on)shown++;else hidden++;
  }
  return {fail,shown,hidden};
});
if(syn.fail.length)fail('synergy '+syn.fail.join('; '));
if(!syn.shown||!syn.hidden)fail('synergy sample '+JSON.stringify(syn));

const lvl=await p.evaluate(()=>{
  const g=__g,G=g.G;
  g.closeSheet();g.setMode('play');
  G.lvl=1;G.xp=0;G.sp=0;G.ap=0;G.web={};G.para=0;
  const before=g.webPts();
  g.gainXp(60);
  return {before,after:g.webPts(),lvl:G.lvl,sp:G.sp,ap:G.ap,log:document.getElementById('log').textContent};
});
if(lvl.before!==0||lvl.after!==1||lvl.lvl!==2||lvl.sp!==1||lvl.ap!==5)fail('level '+JSON.stringify(lvl));
if(!/a point for the web/.test(lvl.log))fail('level toast '+lvl.log);

const back=await p.evaluate(()=>{
  const g=__g,G=g.G;
  G.sk=[10,6,1,0,0,0,0,0,0,0,0,0,0,0,0];
  G.sp=2;G.ap=1;G.at={mgt:4,ref:0,vit:1,bnd:0};
  G.credits=1e9;G.lvl=20;G.cpi=1;G.slots=[0,1,-1];G.schema='surge';
  g.setMode('play');
  g.talkTo('null');
  const btn=[...document.querySelectorAll('#dBtns button')].find(b=>/Unlearn skills/.test(b.textContent));
  if(!btn||btn.disabled)return {err:'no unlearn'};
  btn.click();
  const ranks=G.sk.reduce((a,n)=>a+n,0);
  return {sp:G.sp,ap:G.ap,ranks,at:G.at,schema:G.schema,log:document.getElementById('log').textContent};
});
if(back.err)fail(back.err);
if(back.sp!==2+15+7+1||back.ap!==1+4+1||back.ranks!==0||back.schema)fail('unlearn '+JSON.stringify(back));
if(!/Your points are returned/.test(back.log))fail('unlearn toast '+back.log);

const rig=await p.evaluate(()=>{
  const g=__g,G=g.G;
  G.st=G.st||{};G.st.shifts=G.st.shifts||0;
  G.sk=[10,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  G.sp=0;G.ap=0;G.at={mgt:3,ref:1,vit:0,bnd:0};
  G.sats=20;G.lvl=40;G.act2=1;G.act3=1;G.act5=0;
  const pool=15,ap=3+1;
  g.shapeShift('courier',false);
  const manual={sp:G.sp,ap:G.ap,sk0:G.sk[0],rest:G.sk.slice(1).reduce((a,n)=>a+n,0),sats:G.sats};
  G.sats=20;G.sk=[10,0,0,0,0,0,0,0,0,0,0,0,0,0,0];G.sp=0;G.ap=0;G.at={mgt:0,ref:0,vit:0,bnd:0};
  g.shapeShift('courier',true);
  const cost=L=>L<=5?L:5+(L-5)*2;
  const placed=G.sk.reduce((a,n)=>a+cost(n),0);
  const random={placed,left:G.sp,sum:placed+G.sp,max:Math.max(...G.sk)};
  return {manual,random,pool,ap};
});
if(rig.manual.sk0!==1||rig.manual.rest!==0||rig.manual.sp!==14||rig.manual.ap!==4||rig.manual.sats!==15)fail('manual shift '+JSON.stringify(rig.manual));
if(rig.random.sum!==15||rig.random.max>10)fail('random shift '+JSON.stringify(rig.random));

const web=await p.evaluate(()=>{
  const g=__g,G=g.G;
  g.setMode('play');
  G.web={c:1};G.sats=9;
  g.openSheet('web');
  const btn=document.querySelector('[data-webreset="1"]');
  if(!btn||btn.disabled)return {err:'reset locked'};
  btn.click();
  return {sats:G.sats,n:Object.keys(G.web).length};
});
if(web.err||web.sats!==4||web.n!==0)fail('web reset '+JSON.stringify(web));

if(errs.length)fail(errs[0]);
console.log('skills-level ok');
await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
