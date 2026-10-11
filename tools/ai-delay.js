/* The monster decision delay. node tools/ai-delay.js
   A monster should steer on a heading it committed to a moment ago, not on
   the player's current position. Measured by strafing the player and watching
   how far the monster's heading lags the true bearing -- and by checking it
   still closes the distance and still lands hits, because a monster that
   cannot catch you is not an improvement. */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
async function clearUI(p){for(let i=0;i<30;i++){const st=await p.evaluate(()=>{
 const s=document.getElementById('scene');if(s&&!s.hidden){document.getElementById('scSkip').click();return 'x'}
 const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x){x.click();return 'x'}return 'l'}
 return 'c'});if(st==='c')return;await p.waitForTimeout(st==='l'?350:150)}}
(async()=>{
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:430,height:860}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+
  fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8')+'</body></html>');
await p.waitForTimeout(500);await p.evaluate(()=>__g.skipDisc());await p.waitForTimeout(250);
await p.click('[data-cls=scrapper]');await p.evaluate(()=>{__g.G.pre=2});await clearUI(p);
await p.evaluate(()=>{const G=__g.G;G.lvl=40;G.god=true;__g.calc()});
await p.evaluate(()=>__g.enter(1));await clearUI(p);
await p.evaluate(()=>__g.setMode('play'));
await p.waitForTimeout(1400);
await clearUI(p);

// Drive the sim by hand so the run is deterministic: fixed dt, scripted
// strafe, no rendering in the loop.
const run=await p.evaluate((aidel)=>{
  const out={};
  for(const [mode,juke] of [['off',0],['on',0],['off-juke',1],['on-juke',1]]){
    const G=__g.G,W=__g.W,P=__g.P,ET=__g.ET;
    // spawn() wants a free cell and will not place one to order, so use a
    // monster the zone already has and move it, as the other harnesses do
    const live0=(W.ents||[]).filter(x=>x&&x.hp>0&&!x.mp);
    if(!live0.length){out[mode]={err:'no monster in this zone to use'};continue}
    const e=live0[0], kind=e.k;
    const had=Object.prototype.hasOwnProperty.call(ET[kind],'aidel'), saved=ET[kind].aidel;
    if(mode.indexOf('off')===0)ET[kind].aidel=0; else delete ET[kind].aidel;
    // park everything else far away so only this one is in play
    for(let q=1;q<live0.length;q++){live0[q].x=P.x+900;live0[q].y=P.y+900}
    // find open ground: the monster must have a clear five units to walk and
    // the player a clear strafe band, or the monster just grinds into a wall
    // and the measurement is of nothing
    const clear=(x,y)=>{for(let a=-1;a<=1;a+=.5)for(let bq=-1;bq<=1;bq+=.5)
      if(!__g.walk(x+a,y+bq))return false;return true};
    let px=P.x, py=P.y, found=false;
    for(let r=0;r<22&&!found;r+=1.5)for(let a=0;a<6.283&&!found;a+=.35){
      const cx=P.x+Math.cos(a)*r, cy=P.y+Math.sin(a)*r;
      let ok=clear(cx,cy);
      for(let t2=0;ok&&t2<=5;t2+=1)ok=clear(cx+t2,cy);           // the walk in
      for(let t2=-2.4;ok&&t2<=2.4;t2+=.8)ok=clear(cx,cy+t2);     // the strafe band
      if(ok){px=cx;py=cy;found=true}
    }
    if(!found){out[mode]={err:'no open ground in this zone to measure on'};continue}
    P.x=px;P.y=py;
    e.x=px+5;e.y=py;e.aggro=true;e.hcd=0;e.hx=0;e.hy=0;e.stun=0;e.calm=0;
    P.dir={x:1,y:0};
    let errSum=0,n=0,hits=0,minD=99,maxErr=0;
    const dt=1/60;
    for(let f=0;f<300;f++){
      // strafe the player hard across the monster's approach
      P.x = px; P.y = py + (juke ? (Math.sin(f/7)>0?1.6:-1.6) : Math.sin(f/18)*2.4);
      __g.update(dt);
      const live=(W.ents||[]).indexOf(e)>=0?e:null;
      if(!live||live.hp<=0)break;
      const tx=P.x-live.x, ty=P.y-live.y, td=Math.hypot(tx,ty)||1;
      minD=Math.min(minD,td);
      if(live.hx||live.hy){
        // angle between the committed heading and the true bearing
        const dot=(live.hx*tx+live.hy*ty)/td;
        const a2=Math.acos(Math.max(-1,Math.min(1,dot)));errSum+=a2;if(a2>maxErr)maxErr=a2;n++;
      }
      if(live.wind>0&&live.wind<=dt*1.01)hits++;
    }
    out[mode]={maxErrDeg:+(maxErr*180/Math.PI).toFixed(1),meanErrDeg:n?+(errSum/n*180/Math.PI).toFixed(2):null,
               samples:n, closedTo:+minD.toFixed(2), swings:hits,
               moved:+Math.hypot(e.x-(px+5),e.y-py).toFixed(2), mode:__g.mode};
    if(had)ET[kind].aidel=saved; else delete ET[kind].aidel;
    out[mode].kind=kind;
  }
  return out;
},null);

const fail=[];
console.log('                  mean err   peak err   closed to   swings');
for(const m of ['off','on','off-juke','on-juke']){
  const r=run[m];
  if(r.err){fail.push(m+': '+r.err);continue}
  console.log(`  aidel ${m.padEnd(9)} ${String(r.meanErrDeg).padStart(6)} deg ${String(r.maxErrDeg).padStart(7)} deg   ${String(r.closedTo).padStart(6)}      ${r.swings}`);
}
const off=run.off,on=run.on;
if(!off.err&&!on.err){
  if(!(on.meanErrDeg>off.meanErrDeg+2))
    fail.push(`the delay did not change the heading: ${on.meanErrDeg} deg with it, ${off.meanErrDeg} without`);
  if(!(on.closedTo<2.0))
    fail.push(`a monster with the delay never got close (nearest ${on.closedTo}) -- it cannot catch the player`);
  if(!(on.swings>0))
    fail.push('a monster with the delay never swung');
}
if(errs.length)fail.push('page errors: '+errs.slice(0,3).join(' | '));
console.log('');
if(fail.length){console.log('FAIL');fail.forEach(f=>console.log('  - '+f));process.exitCode=1}
else console.log('PASS  the heading lags, and the monster still closes and still swings');
await b.close();})();
