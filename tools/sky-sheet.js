/* One shot of every district's sky.
   node tools/sky-sheet.js [tag]
   BGK decides which backdrop a style stands under, and anything unlisted falls
   through to the dead city. This stands in each zone and photographs what is
   behind it, so a wrong sky is visible rather than inferred. */
const {chromium}=require('playwright');
const path=require('path');
const root=path.join(__dirname,'..');
const URL='file://'+path.join(root,'dist/Unsubscribe-2087-standalone.html');
const TAG=process.argv[2]||'now';
const ZONES=(process.argv[3]||'21,22,23,25,26,27,30,33').split(',').map(Number);
async function clearUI(p){for(let i=0;i<60;i++){const st=await p.evaluate(()=>{
 const s=document.getElementById('scene');if(s&&!s.hidden){const b=document.getElementById('scSkip');if(b)b.click();return 'x'}
 const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x){x.click();return 'x'}return 'l'}
 return 'c'});if(st==='c')return;await p.waitForTimeout(st==='l'?300:120)}}
(async()=>{
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:760,height:760}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(URL);await p.waitForTimeout(700);
await p.evaluate(()=>__g.skipDisc());await p.waitForTimeout(250);
await p.click('[data-cls=scrapper]');await p.evaluate(()=>{__g.G.pre=2});await clearUI(p);await p.waitForTimeout(1600);await clearUI(p);
await p.evaluate(()=>{const G=__g.G;G.lvl=90;G.god=true;G.unlocked=34;for(let i=1;i<=25;i++)G.q['q'+i]=3;__g.calc()});
for(const zi of ZONES){
  await p.evaluate(z=>__g.enter(z),zi);
  await p.waitForTimeout(500);await clearUI(p);await p.waitForTimeout(400);await clearUI(p);
  await p.evaluate(()=>{__g.setMode('play');
    const W=__g.W;if(W){W.ents.length=0;if(W.objs)W.objs.length=0;if(W.npcs)W.npcs.length=0}
    document.getElementById('hud').hidden=true});
  for(let i=0;i<4;i++){await p.evaluate(()=>__g.render());await p.waitForTimeout(60)}
  const info=await p.evaluate(()=>({z:__g.W&&__g.W.z.n,st:__g.W&&__g.W.z.style}));
  const f=root+'/.fx-shots/sky-'+TAG+'-'+zi+'.png';
  await p.screenshot({path:f,clip:{x:0,y:0,width:760,height:360}});
  console.log('zone '+String(zi).padStart(2)+'  '+String(info.st).padEnd(9)+(info.z||'?'));
}
if(errs.length)console.log('page errors: '+errs.slice(0,3).join(' | '));
await b.close()})();
