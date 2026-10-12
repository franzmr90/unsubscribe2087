/* Stage the worst colour collisions and look at them.
   node tools/palette-shot.js <zi> <kind> [tag]
   A low dE says the body and the floor are the same colour. It does not say the
   monster is invisible: every shape is drawn with a dark outline, which carries
   the silhouette on its own. This is how you tell the difference. */
const {chromium}=require('playwright');
const path=require('path');
const root=path.join(__dirname,'..');
const URL='file://'+path.join(root,'dist/Unsubscribe-2087-standalone.html');
const ZI=+process.argv[2],KIND=process.argv[3],TAG=process.argv[4]||'pal';
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
await p.evaluate(z=>__g.enter(z),ZI);
await p.waitForTimeout(500);await clearUI(p);await p.waitForTimeout(400);await clearUI(p);
const info=await p.evaluate(k=>{
  __g.setMode('play');
  const W=__g.W,P=__g.P;
  W.ents.length=0;W.fx.length=0;W.projs.length=0;
  if(W.objs)W.objs.length=0;if(W.npcs)W.npcs.length=0;
  document.getElementById('hud').hidden=true;
  /* a short row of them, at the distance you actually fight at */
  for(let i=-1;i<=1;i++){
    const e=__g.spawn(k,P.x+i*2.2,P.y+2.4);
    if(e){e.aggro=false;e.stun=0;e.spd=0;e.ph=1+i*.7}
  }
  return {zone:W.z.n,style:W.z.style,n:W.ents.length};
},KIND);
for(let i=0;i<4;i++){await p.evaluate(()=>__g.render());await p.waitForTimeout(60)}
const f=root+'/.fx-shots/'+TAG+'-'+ZI+'-'+KIND+'.png';
await p.screenshot({path:f,clip:{x:170,y:230,width:430,height:330}});
console.log(info.zone+' ('+info.style+')  '+info.n+' spawned  -> '+f);
if(errs.length)console.log('page errors: '+errs.slice(0,2).join(' | '));
await b.close()})();
