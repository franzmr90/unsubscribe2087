/* A hazard's danger circle must sit on the hazard, not on whoever threw it.
   node tools/skill-aim.js
   The contact sheets cast without aiming, so castSpot returns null and the
   hazard lands at the caster's feet -- which hides exactly this bug. This
   aims first.

   The disc is read back synchronously, the instant cast() returns, and that
   matters. This test used to wait 60ms and then take the last patch or ring in
   W.fx, and it failed about one run in five. The game was right every time: the
   hazard was on the aim point in every failing run too. What moved was which
   effect the test picked up. A tick that closes to within 0.9 of the player
   detonates (src/p2.js, `if(e.k==='tick')`) and pushes its own
   {k:'ring', col:'#ff9a3c'} at wherever it happened to be standing -- and the
   zone this runs in is the Parcel Moors, which is full of ticks, with the
   player on G.god so nothing stops them arriving. Any run where one reached the
   player inside those 60ms ended with the test measuring the tick's ring
   instead of the skill's, from a position that moved run to run.

   Every skill here pushes its disc inside cast(), before the loop gets a turn,
   so reading it before the first await removes that race rather than papering
   over it. The sleep is still needed afterwards for the allies a skill spawns.

   There was a second race underneath it, and it is the more interesting one.
   fxAim() does not create an effect: it walks W.fx backwards, finds the last
   one of that kind, and moves it to the aim point. The effect it moves is the
   one skvPlay() pushed at the caster when the cast began -- so the disc under
   test is the FIRST patch or ring in the array, not the last. Taking the last
   worked only while nothing else pushed one. anon 6 bursts for damage at the
   aim point, and when that burst synchronously killed something standing in
   it, the dead thing's own burst -- two more rings, at its own position -- went
   on the end of the array and got measured instead.

   Taking the first still catches the bug this exists for: if fxAim failed to
   relocate skvPlay's effect, that first entry would still be sitting on the
   caster, four paces from the aim point. */
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
await p.evaluate(()=>{const G=__g.G;G.lvl=90;G.god=true;G.act2=G.act3=true;__g.calc()});
await p.evaluate(()=>__g.enter(1));await clearUI(p);
await p.evaluate(()=>__g.setMode('play'));await p.waitForTimeout(1800);await clearUI(p);

const cases=[['courier',3,'decoy'],['courier',4,'trops'],['courier',11,'drop'],
             ['anon',0,'decoy'],['anon',3,'mine'],
             ['homesteader',9,'plot'],['homesteader',0,'plot'],['homesteader',6,'hedge','dir'],
             ['anon',5,'<none>'],['anon',6,'<none>']];   // the last two already aimed
const res=await p.evaluate(async(cases)=>{
  const G=__g.G,P=__g.P,W=__g.W,out=[];
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const baseP={};for(const k in P)if(typeof P[k]==='number')baseP[k]=P[k];
  const allies0=(W.allies||[]).length;
  for(const [cls,i,kind,mode] of cases){
    G.cls=cls;__g.calc();
    for(const k in baseP)P[k]=baseP[k];
    for(const k in P)if(typeof P[k]==='number'&&!(k in baseP))P[k]=0;
    G.form=null;P.compost=0;
    if(W.allies)W.allies.length=Math.min(W.allies.length,allies0);
    P.x=W.N/2;P.y=W.N/2;P.dir={x:1,y:0};P.cd=P.cd||{};for(const k in P.cd)P.cd[k]=0;
    P.castWait=0;P.silence=0;G.en=99999;
    W.fx.length=0;
    const n0=(W.allies||[]).length;
    // aim four paces east
    P.spot={x:P.x+4,y:P.y};
    G.sk[i]=5;G.slots[0]=i;
    try{__g.cast(0)}catch(e){}
    /* before any await: nothing else has had a chance to push an effect yet */
    const own=W.fx.filter(f=>f.k==='patch'||f.k==='ring');
    await sleep(60);
    const made=(W.allies||[]).slice(n0);
    const late=!own.length;
    const pool=late?W.fx.filter(f=>f.k==='patch'||f.k==='ring'):own;
    const disc=pool[0];
    const tgt=made[0]||null;
    out.push({cls,i,kind,mode:mode||'aim',
      hasDisc:!!disc, placed:made.length>0, late,
      discToAim: disc?Math.hypot(disc.x-(P.x+4),disc.y-P.y):null,
      discAtPlayer: disc?Math.hypot(disc.x-P.x,disc.y-P.y):null,
      hazardAtPlayer: tgt?Math.hypot(tgt.x-P.x,tgt.y-P.y):null});
    P.spot=null;W.fx.length=0;
    if(W.allies)W.allies.length=n0;
  }
  return out;
},cases);

const fail=[];
console.log('skill                  disc->aim    disc->player   hazard->player');
for(const r of res){
  const f=x=>x==null?'   -  ':x.toFixed(2).padStart(6);
  console.log(`  ${r.cls} ${String(r.i).padEnd(3)} ${String(r.kind).padEnd(8)} ${f(r.discToAim)}        ${f(r.discAtPlayer)}        ${f(r.hazardAtPlayer)}`);
  if(!r.placed){console.log(`       (placed nothing this run -- skipped)`);continue}
  if(!r.hasDisc){fail.push(`${r.cls} ${r.i}: no disc drawn at all`);continue}
  if(r.late)console.log(`       (no disc until after the cast returned -- read from a live world, so this one can still race)`);
  if(r.mode==='dir'){
    if(r.discAtPlayer<1)
      fail.push(`${r.cls} ${r.i}: direction-only, but its circle is on the caster (${r.discAtPlayer.toFixed(2)} away)`);
  }else if(r.discToAim>0.35)
    fail.push(`${r.cls} ${r.i}: aimed 4 paces out, circle drawn ${r.discToAim.toFixed(2)} off the aim point (${r.discAtPlayer.toFixed(2)} from the caster)`);
}
if(errs.length)fail.push('page errors: '+errs.slice(0,3).join(' | '));
console.log('');
if(fail.length){console.log('FAIL');fail.forEach(x=>console.log('  - '+x));process.exitCode=1}
else console.log('PASS  every hazard circle sits on its hazard');
await b.close();})();
