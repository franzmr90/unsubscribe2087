/* V1 effect budget. node tools/v1-check.js
   Loads dist/unsubscribe.html the same way smoke does. Calls __g.skipDisc() first.
   Asserts the skill-11 circle is gone, the caps hold under a pack of casts and
   several casters, a warn survives when rings are dropped, thin skips particles,
   and patch plus trail actually paint. */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const shot=process.env.V1_SHOT||'/opt/cursor/artifacts/v1-patch-trail.png';

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
if(html.includes('3.2*45')||html.includes("rgba(180,140,255,.28)"))fail.push('skill 11 circle is still in the built page');
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
await p.waitForTimeout(400);
await p.evaluate(()=>__g.skipDisc());
await p.waitForTimeout(200);
if(await p.evaluate(()=>__g.OPT.fx)!=='normal')fail.push('OPT.fx should default to normal');
await p.click('[data-cls=scrapper]');
await p.waitForTimeout(300);
await p.evaluate(()=>{__g.G.pre=2});
await clearUI(p);
await p.evaluate(()=>{
  const G=__g.G;
  G.lvl=40;G.act2=true;G.act3=true;G.sats=40;G.sp=20;G.god=true;
  for(let i=1;i<=25;i++)G.q['q'+i]=3;
  G.in1=1;__g.ACC.maxi=1;__g.calc();G.hp=__g.S.maxHp;G.en=__g.S.maxEn;
});
await p.evaluate(()=>__g.enter(1));
await clearUI(p);
await p.evaluate(()=>__g.setMode('play'));

const budget=await p.evaluate(()=>{
  const fail=[],G=__g.G,P=__g.P,W=__g.W;
  const check=(n,ok,extra)=>{if(!ok)fail.push(n+(extra!==undefined?': '+extra:''))};
  G.sk[11]=5;__g.calc();
  __g.render();
  check('fx cap helper',typeof __g.fxTrim==='function');
  W.fx.length=0;W.parts.length=0;
  W.fx.push({k:'warn',x:P.x,y:P.y,r:2.2,t:0,life:9});
  W.fx.push({k:'patch',x:P.x+1,y:P.y,r:1.6,col:'#ff7a3c',t:0,life:9,tel:1});
  for(let i=0;i<70;i++)W.fx.push({k:'ring',x:P.x,y:P.y,r:.9,t:0,life:9,col:'#fff'});
  check('fx stays at 48',W.fx.length<=48,W.fx.length);
  check('warn survived the rings',W.fx.some(f=>f.k==='warn'));
  check('telegraph patch survived the rings',W.fx.some(f=>f.k==='patch'&&f.tel));
  /* eight casters, a dozen rings each, on top of what is already there */
  for(let c=0;c<8;c++)for(let i=0;i<12;i++)W.fx.push({k:'ring',x:P.x+c*.2,y:P.y,r:.9,t:0,life:9,col:'#59e0e6',remote:c?1:0});
  check('eight casters stay inside the fx cap',W.fx.length<=48,W.fx.length);
  check('warn still there after the pack',W.fx.some(f=>f.k==='warn'));
  let spawned=0;
  for(let i=0;i<6;i++)if(__g.spawn('tick',P.x+((i%3)-1)*1.2,P.y+((i/3|0)+1)*1.2))spawned++;
  check('spawned a pack',spawned>=1,spawned);
  G.sk[0]=5;G.slots[0]=0;G.en=99999;P.cd[0]=0;P.castWait=0;P.silence=0;
  for(let i=0;i<40;i++){G.en=99999;P.cd[0]=0;P.castWait=0;__g.cast(0)}
  check('casts stay inside the fx cap',W.fx.length<=48,W.fx.length);
  check('warn survived the casts',W.fx.some(f=>f.k==='warn'));
  __g.parts(P.x,P.y,200,['#fff','#ffb84a','#ff5d4d'],3,1);
  check('particles stay at 80',W.parts.length<=80,W.parts.length);
  check('particles were actually kept',W.parts.length>0,W.parts.length);
  __g.light(12,12,400,null,1,2);
  for(let i=0;i<40;i++)__g.light(20+i,30,40,'#fff',1,0);
  check('lights stay at 16',__g.LIGHTS.length<=16,__g.LIGHTS.length);
  check('own light is kept',__g.LIGHTS.some(L=>L.own>=2));
  __g.render();
  check('render keeps the light cap',__g.LIGHTS.length<=16,__g.LIGHTS.length);
  const before=W.parts.length;
  __g.OPT.fx='thin';
  __g.parts(P.x,P.y,40,['#fff'],2,1);
  W.parts.push({x:P.x,y:P.y,z:10,vx:0,vy:0,vz:0,t:0,life:1,col:'#fff',s:3});
  check('thin parts() adds nothing',W.parts.length===before,W.parts.length+' vs '+before);
  check('thin direct particle push adds nothing',W.parts.length===before);
  check('thin skips a remote cast',__g.fxShow({k:'ring',remote:1})===false);
  check('thin still shows your warn',__g.fxShow({k:'warn'})===true);
  check('thin still shows a mark',__g.fxShow({k:'mark',remote:1})===true);
  check('thin still shows your patch',__g.fxShow({k:'patch',tel:1})===true);
  __g.OPT.fx='normal';
  check('normal shows a remote cast',__g.fxShow({k:'ring',remote:1})===true);
  W.fx.length=0;
  __g.fxPatch(P.x+1.2,P.y,.1,'#ff7a3c',4,1);
  __g.fxTrail(P.x-1.4,P.y,P.x+1.6,P.y+0.2,'#f7931a',4);
  __g.fxMark(P.x,P.y,'#ffe36b',3,4);
  __g.fxOrbit(P.x,P.y,'#59e0e6',4);
  const kinds=W.fx.map(f=>f.k);
  for(const k of ['patch','trail','mark','orbit'])if(!kinds.includes(k))fail.push('missing kind '+k);
  __g.render();
  return fail});
fail.push(...budget);

await p.evaluate(()=>__g.openSheet('opts',{}));
await p.waitForTimeout(150);
const label=await p.evaluate(()=>{const b=document.querySelector('[data-opt=fx]');return b?b.innerText:''});
if(!/Normal/.test(label))fail.push('effects toggle should read Normal, got '+label);
await p.click('[data-opt=fx]');
if(await p.evaluate(()=>__g.OPT.fx)!=='thin')fail.push('first tap should reach thin');
await p.click('[data-opt=fx]');
if(await p.evaluate(()=>__g.OPT.fx)!=='full')fail.push('second tap should reach full');
await p.click('[data-opt=fx]');
if(await p.evaluate(()=>__g.OPT.fx)!=='normal')fail.push('third tap should return to normal');
await p.evaluate(()=>__g.closeSheet());
await p.waitForTimeout(80);

/* paint the two kinds the plan asked to see, with skill 11 learned */
await p.evaluate(()=>{
  const P=__g.P,W=__g.W;
  __g.G.sk[11]=5;__g.OPT.fx='normal';__g.setMode('play');
  W.fx.length=0;
  __g.fxPatch(P.x+0.2,P.y+0.8,1.8,'#ff7a3c',6);
  __g.fxTrail(P.x-1.6,P.y-0.2,P.x+1.8,P.y+0.4,'#f7931a',6);
  __g.render();
});
fs.mkdirSync(path.dirname(shot),{recursive:true});
await p.screenshot({path:shot});

const saved=await p.evaluate(()=>{
  const raw=JSON.parse(JSON.stringify(__g.G));
  const ok=__g.applySave({G:raw,opt:{sound:false}});
  return {ok,fx:__g.OPT.fx,sound:__g.OPT.sound};
});
if(!saved.ok)fail.push('applySave refused a current character');
if(saved.fx!=='normal')fail.push('old save without fx should land on normal, got '+saved.fx);
if(saved.sound!==false)fail.push('applySave dropped an option that was set');

if(errs.length)fail.push('pageerror: '+errs.slice(0,4).join(' | '));
console.log(fail.length?'FAIL\n'+fail.join('\n'):'v1 ok');
console.log('shot',shot);
await b.close();
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
