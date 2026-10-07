/* Title and Options name Act IV and Act V.
   node tools/act-label.js */
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

const rom=await p.evaluate(()=>{
  const h=__g.heroAct,r=__g.actRoman;
  return {
    none:r(h({})),
    a2:r(h({act2:1})),
    a3:r(h({act2:1,act3:1})),
    a4:r(h({act2:1,act3:1,act4:1})),
    a5:r(h({act2:1,act3:1,act4:1,act5:1}))
  };
});
check('no flag is Act I', rom.none==='I', rom.none);
check('act2 is Act II', rom.a2==='II', rom.a2);
check('act3 is Act III', rom.a3==='III', rom.a3);
check('act4 is not collapsed to III', rom.a4==='IV', rom.a4);
check('act5 is not collapsed to III', rom.a5==='V', rom.a5);

const cloud=await p.evaluate(()=>{
  const C=__g.CLD;
  C[1]={t:Date.now()+1e12,lv:40,cl:'witness',ac:3,s:JSON.stringify({G:{cls:'witness',lvl:40,act2:true,act3:true,act4:true}})};
  C[2]={t:Date.now()+1e12,lv:12,cl:'courier',ac:2};
  const late=__g.slotInfo(1),sum=__g.slotInfo(2);
  __g.drawSlots();
  const title=document.getElementById('slots').textContent;
  return {late:late&&late.act,sum:sum&&sum.act,title};
});
check('a stale cloud summary of 3 yields to Act IV in the save', cloud.late===4, String(cloud.late));
check('a summary with no body still names Act II', cloud.sum===2, String(cloud.sum));
check('the title row says Act IV', /Act IV/.test(cloud.title)&&!/Act III/.test(cloud.title), cloud.title);
check('the title row says Act II', /Act II/.test(cloud.title), cloud.title);

await p.evaluate(()=>__g.skipDisc());
await p.waitForTimeout(200);
await p.click('[data-cls=scrapper]');
await p.waitForTimeout(250);
await p.evaluate(()=>{__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1});
await clearUI(p);
await p.evaluate(()=>__g.enter(0));
await clearUI(p);
await p.evaluate(()=>{__g.setMode('play');__g.G.walkNew=0});

async function sheetAct(flags){
  return p.evaluate(f=>{
    const G=__g.G;
    G.act2=G.act3=G.act4=G.act5=false;
    Object.assign(G,f);
    __g.setMode('play');
    __g.openSheet('opts',{});
    const el=[...document.querySelectorAll('#sheet .li')].find(n=>/playing now/.test(n.textContent));
    const span=el?el.querySelector('span'):null;
    const row=span?span.textContent:'';
    const clip=span?span.scrollHeight>span.clientHeight+2:true;
    return {row,clip};
  }, flags);
}
const v=await sheetAct({act2:true,act3:true,act4:true,act5:true});
check('Options names Act V', /Act V/.test(v.row)&&!/Act III/.test(v.row), v.row);
check('the Act V line fits', !v.clip, v.row);
await p.screenshot({path:'/opt/cursor/artifacts/act-label-options.png'});
const iv=await sheetAct({act2:true,act3:true,act4:true});
check('Options names Act IV', /Act IV/.test(iv.row), iv.row);
const iii=await sheetAct({act2:true,act3:true});
check('Options still names Act III', /Act III/.test(iii.row), iii.row);
const i=await sheetAct({});
check('a new act is Act I', /Act I/.test(i.row)&&!/Act II/.test(i.row), i.row);

check('no page errors', !errs.length, errs.join(' | '));
await b.close();
if(fail.length){console.log('FAIL\n'+fail.join('\n'));process.exit(1)}
console.log('act-label ok');
})().catch(e=>{console.error(e);process.exit(1)});
