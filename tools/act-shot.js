/* Plain shots of a run of districts, for before/after comparison.
   node tools/act-shot.js <tag> [zones] */
const {chromium}=require('playwright');
const path=require('path');
const root=path.join(__dirname,'..');
const URL='file://'+path.join(root,'dist/Unsubscribe-2087-standalone.html');
const TAG=process.argv[2]||'now';
const ZS=(process.argv[3]||'1,2,4,5').split(',').map(Number);
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
await p.click('[data-cls=scrapper]');await p.evaluate(()=>{__g.G.pre=2});await clearUI(p);await p.waitForTimeout(1700);await clearUI(p);
await p.evaluate(()=>{const G=__g.G;G.lvl=40;G.god=true;G.unlocked=34;__g.calc()});
for(const zi of ZS){
  await p.evaluate(z=>__g.withMapRng(0x5eed00+z,()=>__g.enter(z)),zi);
  await p.waitForTimeout(450);await clearUI(p);await p.waitForTimeout(350);await clearUI(p);
  const info=await p.evaluate(()=>{__g.setMode('play');
    const W=__g.W;document.getElementById('hud').hidden=true;
    /* keep the monsters: lit actors are half the point */
    /* stand next to a lamp: the light is the thing being judged */
    const P=__g.P,objs=W.objs||[];
    let best=null,bd=1e9;
    for(const o of objs){if(o.k!=='lamp')continue;const d=Math.hypot(o.x-P.x,o.y-P.y);if(d<bd){bd=d;best=o}}
    if(best){P.x=best.x+1.6;P.y=best.y+1.6}
    return {n:W.z.n,st:W.z.style,ents:W.ents.length,lamp:!!best,lampD:+bd.toFixed(1)}});
  for(let i=0;i<5;i++){await p.evaluate(()=>__g.render());await p.waitForTimeout(70)}
  const f=root+'/.fx-shots/act-'+TAG+'-'+zi+'.png';
  await p.screenshot({path:f,clip:{x:60,y:120,width:640,height:500}});
  console.log('zone '+String(zi).padStart(2)+'  '+String(info.st).padEnd(6)+info.n.padEnd(22)+info.ents+' ents  lamp '+(info.lamp?'yes':'NONE'));
}
if(errs.length)console.log('page errors: '+errs.slice(0,3).join(' | '));
await b.close()})();
