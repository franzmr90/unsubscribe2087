/* Town portal returns to the cast tile, then both ends are gone.
   node tools/portal.js
   Opens the standalone so a save in town can reload. */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const {pathToFileURL}=require('url');
const root=path.join(__dirname,'..');
const pagePath=path.join(root,'dist','Unsubscribe-2087-standalone.html');

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
if(!fs.existsSync(pagePath)){console.error('missing standalone');process.exit(1)}
const fail=[];
const say=(n,ok,d)=>{const line=(ok?'PASS':'FAIL')+'  '+n+(d?'  '+d:'');console.log(line);if(!ok)fail.push(line)};
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(pathToFileURL(pagePath).href);
await p.waitForFunction(()=>window.__g&&__g.skipDisc);
await p.evaluate(()=>__g.skipDisc());
await p.waitForTimeout(200);
await p.click('[data-cls=scrapper]');
await p.waitForTimeout(200);
await p.evaluate(()=>{__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1;__g.G.q.q1=1;__g.G.seenIntro=true;__g.G['in1']=1;__g.G['in2']=1});
await clearUI(p);

const cast=await p.evaluate(()=>{
  const g=__g;
  g.setMode('play');g.enter(1);
  const s=document.getElementById('scene');if(s)s.hidden=true;
  const d=document.getElementById('dlg');if(d)d.hidden=true;
  g.setMode('play');g.W.ents.length=0;g.OPT.auto=false;g.P.atk=99;
  g.openPortal();
  const tp=g.W.portals.find(q=>q.cast);
  const o={zi:g.W.zi,x:g.P.x,y:g.P.y};
  return {o,placed:!!(tp&&g.G.portal&&g.G.portal.cast&&g.G.portal.zi===o.zi&&g.G.portal.x===o.x&&g.G.portal.y===o.y)};
});
say('cast stores this character’s zone and tile', cast.placed, JSON.stringify(cast.o));

const town=await p.evaluate((o)=>{
  const g=__g;
  g.setMode('shot');
  g.P.x=o.x+2.4;g.P.y=o.y;
  g.update(0.05);
  const stepped=g.W.zi===o.zi;
  g.P.x=o.x;g.P.y=o.y;
  g.update(0.05);
  return {stepped,town:!!(g.W.z&&g.W.z.town),zi:g.G.portal&&g.G.portal.zi,x:g.G.portal&&g.G.portal.x,y:g.G.portal&&g.G.portal.y,townZi:g.W.zi};
}, cast.o);
say('stepping into the field gate goes to town and keeps the origin', town.stepped&&town.town&&town.zi===cast.o.zi&&town.x===cast.o.x&&town.y===cast.o.y, 'town '+town.townZi);

const wandered=await p.evaluate(()=>{
  const g=__g;
  g.setMode('play');
  g.P.x=5;g.P.y=16;
  g.openSheet('items',{});g.closeSheet();
  const townZi=g.W.zi;
  g.enter(townZi);
  const s=document.getElementById('scene');if(s)s.hidden=true;
  const d=document.getElementById('dlg');if(d)d.hidden=true;
  g.P.x=8;g.P.y=14;
  g.setMode('shot');
  for(let i=0;i<8;i++)g.update(0.05);
  const pr=g.G.portal;
  return {town:!!(g.W.z&&g.W.z.town),zi:pr&&pr.zi,x:pr&&pr.x,y:pr&&pr.y,cast:pr&&pr.cast};
});
say('town menus and a rebuilt town keep the origin', wandered.town&&wandered.cast&&wandered.zi===cast.o.zi&&wandered.x===cast.o.x&&wandered.y===cast.o.y, JSON.stringify(wandered));

const saved=await p.evaluate(()=>{
  const g=__g;
  g.G.q.q1=1;g.G.seenIntro=true;g.G.walkNew=0;g.G.pre=2;
  const ok=g.save(true);
  const raw=localStorage.getItem('unsub2087v3');
  if(!raw)return {ok,missing:true};
  const o=JSON.parse(raw);
  g.G.portal={zi:99,x:1,y:1,cast:1};
  g.applySave(o);
  g.G.walkNew=0;g.OPT.noWalk=1;g.G.pre=2;g.G.q.q1=1;
  g.startPlay();
  const s=document.getElementById('scene');if(s)s.hidden=true;
  const d=document.getElementById('dlg');if(d)d.hidden=true;
  const pr=g.G.portal;
  return {ok,town:!!(g.W.z&&g.W.z.town),zi:pr&&pr.zi,x:pr&&pr.x,y:pr&&pr.y,cast:!!(pr&&pr.cast)};
});
say('a save in town reloads the same origin', saved.ok&&saved.town&&saved.cast&&saved.zi===cast.o.zi&&saved.x===cast.o.x&&saved.y===cast.o.y, JSON.stringify(saved));

await p.evaluate(()=>{__g.setMode('play');__g.P.x=12.5;__g.P.y=11.5;__g.OPT.auto=false});
await p.waitForTimeout(250);
const label=await p.evaluate(()=>{const b=document.getElementById('bAct');return b&&!b.hidden?b.textContent:''});
say('the square offers the way back', /Portal to /.test(label), label||'(none)');
await p.click('#bAct');
const back=await p.evaluate((o)=>{
  const g=__g;
  const now={zi:g.W.zi,x:g.P.x,y:g.P.y,town:!!(g.W.z&&g.W.z.town),portal:g.G.portal,casts:(g.W.portals||[]).filter(q=>q.cast).length};
  g.setMode('shot');
  for(let i=0;i<12;i++)g.update(0.05);
  const later={zi:g.W.zi,x:g.P.x,y:g.P.y,town:!!(g.W.z&&g.W.z.town)};
  const dist=Math.hypot(now.x-o.x,now.y-o.y);
  return {now,later,dist};
}, cast.o);
say('the square lands on the cast zone and tile', !back.now.town&&back.now.zi===cast.o.zi&&back.dist<0.05, 'dist '+back.dist.toFixed(3)+' zi '+back.now.zi);
say('both ends are gone on arrival', !back.now.portal&&back.now.casts===0, JSON.stringify(back.now));
say('standing on the old spot does not send you back to town', !back.later.town&&back.later.zi===cast.o.zi, JSON.stringify(back.later));

const dead=await p.evaluate(()=>{
  const g=__g,zi=g.W.zi;
  g.usePortal({kind:'back'});
  return {same:g.W.zi===zi&&!g.G.portal};
});
say('the return does nothing with no origin stored', dead.same);

const bare=await p.evaluate(()=>{
  const g=__g;
  g.setMode('play');g.enter(0);
  const s=document.getElementById('scene');if(s)s.hidden=true;
  g.P.x=12.5;g.P.y=11.5;
  g.setMode('shot');g.update(0.05);
  const before=g.W.zi;
  g.usePortal({kind:'back'});
  return {town:!!(g.W.z&&g.W.z.town),stayed:g.W.zi===before,portal:g.G.portal};
});
await p.evaluate(()=>__g.setMode('play'));
await p.waitForTimeout(200);
const bareLabel=await p.evaluate(()=>{const b=document.getElementById('bAct');return b&&!b.hidden?b.textContent:''});
say('town shows no return when nothing was cast', bare.town&&bare.stayed&&!bare.portal&&!/Portal to /.test(bareLabel), (bareLabel||'(none)')+' '+JSON.stringify(bare));

const twice=await p.evaluate(()=>{
  const g=__g;
  g.setMode('play');g.G['in1']=1;g.G['in2']=1;g.enter(1);
  const s=document.getElementById('scene');if(s)s.hidden=true;
  g.setMode('play');g.W.ents.length=0;
  g.openPortal();
  const a={zi:g.W.zi,x:g.P.x,y:g.P.y};
  g.P.x=a.x+1.6;g.P.y=a.y;
  g.openPortal();
  const b={zi:g.W.zi,x:g.P.x,y:g.P.y};
  const here=g.W.portals.filter(q=>q.cast);
  g.G['in2']=1;g.enter(2);
  const s2=document.getElementById('scene');if(s2)s2.hidden=true;
  const stillThere=(g.ZS()[1]&&g.ZS()[1].portals||[]).filter(q=>q.cast).length;
  g.setMode('play');g.W.ents.length=0;
  g.openPortal();
  const old=(g.ZS()[1]&&g.ZS()[1].portals||[]).filter(q=>q.cast).length;
  const c={zi:g.W.zi,x:g.P.x,y:g.P.y};
  const field=g.W.portals.filter(q=>q.cast);
  const pr=g.G.portal;
  g.P.x=c.x+2.2;g.setMode('shot');g.update(0.05);g.P.x=c.x;g.update(0.05);
  g.P.x=12.5;g.P.y=11.5;
  g.usePortal({kind:'back'});
  const dist=Math.hypot(g.P.x-c.x,g.P.y-c.y);
  const fromA=Math.hypot(g.P.x-a.x,g.P.y-a.y);
  return {replaced:here.length===1&&here[0].x===b.x&&here[0].y===b.y,stillThere,old,field:field.length,prZi:pr&&pr.zi,landZi:g.W.zi,dist,fromA,gone:!g.G.portal&&!g.W.portals.some(q=>q.cast)};
});
say('a second cast in the district replaces the first', twice.replaced, JSON.stringify(twice));
say('casting in another district forgets the earlier gate', twice.stillThere===1&&twice.old===0&&twice.field===1&&twice.prZi===2, JSON.stringify(twice));
say('the new origin is the one the square uses', twice.landZi===2&&twice.dist<0.05&&twice.gone, 'dist '+twice.dist.toFixed(3)+' from first '+twice.fromA.toFixed(2));

if(errs.length)say('no page errors', false, errs.join(' | '));
else say('no page errors', true);
await b.close();
if(fail.length){console.log('portal failed '+fail.length);process.exit(1)}
console.log('portal ok');
})().catch(e=>{console.error(e);process.exit(1)});
