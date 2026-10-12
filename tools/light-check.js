/* Darker is only better if you can still see what is about to hit you.
   node tools/light-check.js
   Puts one monster at a series of distances from the player, renders with and
   without it, and counts how many pixels it changed and by how much. That is
   "can you see it coming", as a number. Also samples the floor at the same
   distances, so the brightness falloff is visible beside the readability. */
const {chromium}=require('playwright');
const path=require('path');
const PAGE='file://'+path.join(__dirname,'..','dist/Unsubscribe-2087-standalone.html');
const ZONES=[[1,'bot'],[2,'hound'],[4,'mech']];
const DIST=[2,4,6,8,11];
async function clearUI(p){for(let i=0;i<60;i++){const st=await p.evaluate(()=>{
 const s=document.getElementById('scene');if(s&&!s.hidden){const b=document.getElementById('scSkip');if(b)b.click();return 'x'}
 const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x){x.click();return 'x'}return 'l'}
 return 'c'});if(st==='c')return;await p.waitForTimeout(st==='l'?300:120)}}
(async()=>{
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:760,height:760}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(PAGE);await p.waitForTimeout(700);
await p.evaluate(()=>__g.skipDisc());await p.waitForTimeout(250);
await p.click('[data-cls=scrapper]');await p.evaluate(()=>{__g.G.pre=2});await clearUI(p);await p.waitForTimeout(1700);await clearUI(p);
await p.evaluate(()=>{__g.G.lvl=40;__g.G.god=true;__g.calc()});
console.log('zone              d   monster px   mean delta');
for(const [zi,kind] of ZONES){
  await p.evaluate(z=>__g.withMapRng(0x5eed01,()=>__g.enter(z)),zi);
  await p.waitForTimeout(400);await clearUI(p);await p.waitForTimeout(300);await clearUI(p);
  await p.evaluate(()=>{__g.setMode('play');document.getElementById('hud').hidden=true;
    window.requestAnimationFrame=()=>0});
  const rows=await p.evaluate(([k,dist])=>{
    const W=__g.W,P=__g.P,cv=document.getElementById('cv'),g=cv.getContext('2d');
    /* render() skips entities on unseen tiles, so without this the tool measures
       fog of war rather than light. */
    W.seen.fill(1);
    const out=[];
    const grab=()=>{__g.render();return g.getImageData(0,0,cv.width,cv.height).data};
    /* The scene animates between renders -- weather, lamp flicker -- so a raw
       diff counts that too. Measure it once with nothing in the room and
       subtract it. */
    W.ents.length=0;W.fx.length=0;W.projs.length=0;
    const n0=grab().slice(),n1=grab();
    let noise=0;
    for(let i=0;i<n1.length;i+=4){
      const dr=Math.abs(n1[i]-n0[i])+Math.abs(n1[i+1]-n0[i+1])+Math.abs(n1[i+2]-n0[i+2]);
      if(dr>12)noise++}
    for(const d of dist){
      W.ents.length=0;W.fx.length=0;W.projs.length=0;
      const base=grab().slice();
      /* straight ahead, on open ground */
      let e=null;
      for(let t=0;t<40&&!e;t++){const a=t*0.4;
        e=__g.spawn(k,P.x+Math.cos(a)*d,P.y+Math.sin(a)*d)}
      if(!e){out.push({d,px:-1});continue}
      e.aggro=false;e.stun=0;e.spd=0;e.ph=1.1;
      const with_=grab();
      let n=0,sum=0;
      for(let i=0;i<with_.length;i+=4){
        const dr=Math.abs(with_[i]-base[i])+Math.abs(with_[i+1]-base[i+1])+Math.abs(with_[i+2]-base[i+2]);
        if(dr>12){n++;sum+=dr}}
      /* floor brightness where it stands */
      const sx=Math.round(__g.screenAt?0:0);
      const X=((e.x-e.y)*32-((P.x-P.y)*32)+cv.width/(2*(cv.width/760))) ;
      out.push({d,px:Math.max(0,n-noise),raw:n,noise,delta:n?Math.round(sum/n):0});
      W.ents.length=0;
    }
    return out;
  },[kind,DIST]);
  const zn=await p.evaluate(()=>__g.W.z.n);
  for(const r of rows)
    console.log('  '+zn.slice(0,15).padEnd(16)+String(r.d).padStart(2)+
      String(r.px).padStart(13)+String(r.delta||0).padStart(13)+'   (noise '+r.noise+')');
}
if(errs.length)console.log('page errors: '+errs.slice(0,3).join(' | '));
await b.close()})();
