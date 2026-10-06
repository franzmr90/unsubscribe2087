/* V2 shapes. node tools/v2-check.js
   Each active of each class is cast once. The effect kind and color must match SKV.
   The old class-colored cast ring is gone. Glyphs paint on the three buttons. */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const shotCast=process.env.V2_CAST||'/opt/cursor/artifacts/v2_scrapper_cast.png';
const shotTree=process.env.V2_TREE||'/opt/cursor/artifacts/v2_scrapper_glyphs.png';

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
if(html.includes('col:CLS[G.cls].col'))fail.push('cast still pushes the class-colored ring');
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
await p.waitForTimeout(400);
await p.evaluate(()=>__g.skipDisc());
await p.waitForTimeout(200);
await p.click('[data-cls=scrapper]');
await p.waitForTimeout(300);
await p.evaluate(()=>{__g.G.pre=2});
await clearUI(p);
await p.evaluate(()=>{
  const G=__g.G;
  G.lvl=60;G.act2=true;G.act3=true;G.act4=true;G.act5=true;G.sats=40;G.god=true;
  for(let i=1;i<=25;i++)G.q['q'+i]=3;
  G.in1=1;__g.ACC.maxi=1;__g.calc();
});
await p.evaluate(()=>__g.enter(1));
await clearUI(p);
await p.evaluate(()=>__g.setMode('play'));

const report=await p.evaluate(()=>{
  const fail=[],classes=['scrapper','hacker','courier','anon','founder','maxi'];
  for(const cls of classes){
    const rows=__g.SKV[cls];
    if(!rows){fail.push(cls+' has no SKV');continue}
    for(let i=0;i<15;i++)if(!rows[i])fail.push(cls+' '+i+' has no shape');
    __g.G.cls=cls;__g.calc();
    const sk=__g.CLS[cls].sk;
    for(let i=0;i<15;i++){
      if(!sk[i].a)continue;
      const v=__g.skvOf(cls,i);
      if(!v){fail.push(cls+' '+i+' skvOf empty');continue}
      __g.G.sk[i]=1;__g.G.slots[0]=i;__g.G.en=99999;
      const P=__g.P;P.cd[i]=0;P.castWait=0;P.silence=0;P.dash=null;
      __g.W.fx.length=0;
      try{__g.cast(0)}catch(e){fail.push(cls+' '+sk[i].n+' threw '+e.message);continue}
      const hit=__g.W.fx.some(f=>f.k===v.k&&f.col===v.col);
      if(!hit)fail.push(cls+' '+sk[i].n+' wanted '+v.k+' '+v.col+' got '+__g.W.fx.map(f=>f.k+':'+f.col).join(','));
      if(__g.W.fx.length>48)fail.push(cls+' '+sk[i].n+' broke the fx cap '+__g.W.fx.length);
    }
  }
  __g.G.cls='scrapper';__g.calc();__g.OPT.fx='normal';
  __g.W.fx.length=0;__g.W.parts.length=0;
  __g.G.sk[0]=5;__g.G.slots[0]=0;__g.G.en=99999;
  for(let n=0;n<40;n++){__g.P.cd[0]=0;__g.P.castWait=0;__g.P.dash=null;__g.G.en=99999;__g.cast(0)}
  if(__g.W.fx.length>48)fail.push('forty casts left '+__g.W.fx.length+' shapes');
  if(__g.W.parts.length>80)fail.push('forty casts left '+__g.W.parts.length+' particles');
  const before=__g.W.parts.length;
  __g.OPT.fx='thin';
  __g.G.sk[3]=5;__g.G.slots[0]=3;
  for(let n=0;n<6;n++){__g.P.cd[3]=0;__g.P.castWait=0;__g.P.dash=null;__g.G.en=99999;__g.cast(0)}
  if(__g.W.parts.length!==before)fail.push('thin cast added particles');
  __g.OPT.fx='normal';
  __g.G.slots=[0,1,4];__g.G.sk[0]=__g.G.sk[1]=__g.G.sk[4]=5;
  __g.setSkillButtons();
  const ink=document.querySelectorAll('.sk canvas.gl');
  if(ink.length<3)fail.push('skill buttons have no glyph canvas');
  ink.forEach((c,i)=>{
    const d=c.getContext('2d').getImageData(0,0,24,24).data;let px=0;
    for(let q=3;q<d.length;q+=4)if(d[q]>12)px++;
    if(px<8)fail.push('button '+i+' glyph is blank');
  });
  __g.W.fx.length=0;__g.P.cd[0]=0;__g.P.dash=null;__g.G.en=99999;__g.G.slots[0]=0;__g.cast(0);__g.render();
  return fail;
});
fail.push(...report);
if(errs.length)fail.push('pageerror: '+errs.slice(0,6).join(' | '));

fs.mkdirSync(path.dirname(shotCast),{recursive:true});
await p.screenshot({path:shotCast});
await p.evaluate(()=>__g.openSheet('skills',{}));
await p.waitForTimeout(200);
await p.screenshot({path:shotTree});
await p.evaluate(()=>__g.closeSheet());

console.log(fail.length?'FAIL\n'+fail.join('\n'):'v2 ok');
console.log('shots',shotCast,shotTree);
await b.close();
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
