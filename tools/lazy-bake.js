/* Nothing may bake while you are standing somewhere that can kill you.
   node tools/lazy-bake.js
   The flipbook bake is meant to happen once, at boot, behind the curtain. A
   sheet that is not pre-baked is baked the first time something draws it --
   which is mid-fight, in the frame where the thing that needed it is already
   swinging. This walks the zones, fights, and reports every sheet that was
   born after the curtain lifted. Those are the ones to add to fxPairs. */
const {chromium}=require('playwright');
const path=require('path');
const URL='file://'+path.join(__dirname,'..','dist/Unsubscribe-2087-standalone.html');
const CLS=process.argv[2]||'scrapper';
async function clearUI(p){for(let i=0;i<50;i++){const st=await p.evaluate(()=>{
 const s=document.getElementById('scene');if(s&&!s.hidden){const b=document.getElementById('scSkip');if(b)b.click();return 'x'}
 const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x){x.click();return 'x'}return 'l'}
 return 'c'});if(st==='c')return;await p.waitForTimeout(st==='l'?300:120)}}
(async()=>{
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:430,height:860}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(URL);await p.waitForTimeout(700);
await p.evaluate(()=>__g.skipDisc());await p.waitForTimeout(250);
/* The Maximalist is not on the title until the story is finished, so start as
   somebody else and become him once there is a character to change. */
const locked=!(await p.$('[data-cls='+CLS+']'));
await p.click('[data-cls='+(locked?'scrapper':CLS)+']');
await p.evaluate(()=>{__g.G.pre=2});await clearUI(p);await p.waitForTimeout(1800);await clearUI(p);
if(locked)await p.evaluate(cls=>{__g.G.cls=cls;__g.calc();__g.setSkillButtons();
  try{__g.fxWarm(null,cls,50)}catch(e){}},CLS);
await p.waitForTimeout(600);

/* the curtain has lifted: everything in the cache now was paid for at boot */
const boot=await p.evaluate(()=>Object.keys(__g.FXC));
await p.evaluate(()=>{window.__boot=Object.keys(__g.FXC).reduce((a,k)=>(a[k]=1,a),{})});

/* play: every zone, every monster the zone can hold, every skill, and the
   boss patterns, which are where the unusual colours live */
const zones=await p.evaluate(async()=>{
  const out=[];
  const G=__g.G,ET=__g.ET;
  G.lvl=90;G.god=true;G.sp=60;G.unlocked=34;
  for(let i=0;i<15;i++)G.sk[i]=5;
  __g.calc();__g.setSkillButtons();
  for(let zi=0;zi<34;zi++){
    try{__g.enter(zi)}catch(e){out.push(zi+' enter threw');continue}
    const W=__g.W;if(!W)continue;
    /* one of every kind this zone can hold, plus the bosses */
    const kinds=new Set((W.z.mix||[]).map(m=>m[0]));
    if(W.z.boss)kinds.add(W.z.boss);
    for(const k in ET)if(/^boss/.test(k)&&W.zi>=21)kinds.add(k);
    for(const k of kinds){try{const e=__g.spawn(k,__g.P.x+2,__g.P.y+2);if(e){e.aggro=true;e.b1=e.b2=e.b3=-1}}catch(e){}}
    /* run the world so AI fires its patterns, and cast everything */
    for(let t=0;t<90;t++){
      try{__g.update(.05)}catch(e){}
      if(t%6===0)for(let s=0;s<15;s++){try{__g.cast(s,__g.P.x+3,__g.P.y)}catch(e){}}
      try{__g.render()}catch(e){}
    }
  }
  return out;
});

const after=await p.evaluate(()=>{
  const all=Object.keys(__g.FXC),late=all.filter(k=>!window.__boot[k]);
  return {total:all.length,late:late};
});
console.log('class: '+CLS);
console.log('baked at boot, behind the curtain: '+boot.length);
console.log('baked later, while the player was standing in a zone: '+after.late.length);
if(after.late.length){
  console.log('\nthese are the hitches. add them to fxPairs:');
  for(const k of after.late)console.log('  '+k);
}
if(zones.length)console.log('\nzone notes: '+zones.join(', '));
if(errs.length)console.log('\npage errors: '+errs.slice(0,4).join(' | '));
console.log(after.late.length?'\nFAIL  art is being baked inside the fight':'\nPASS  nothing bakes after the curtain');
await b.close();process.exit(after.late.length?1:0)})();
