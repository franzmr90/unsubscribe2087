/* What it costs to be ready to play.
   node tools/bake-budget.js
   The ceiling on art here is not bytes, it is the pause a player sees at a zone
   boundary or when somebody joins. This measures that pause: how long the
   flipbook bake takes cold, how many sheets it makes, and how much canvas memory
   they hold, per class. Spend against the headroom it reports, not a guess.

   Each class gets a fresh page. fxSheet caches, so measuring them in one page
   makes every class after the first look free, which it is not. */
const {chromium}=require('playwright');
const path=require('path');
const URL='file://'+path.join(__dirname,'..','dist/Unsubscribe-2087-standalone.html');
const CLS=['scrapper','hacker','courier','anon','founder','homesteader','witness','maxi'];
(async()=>{
const b=await chromium.launch();
const rows=[];const errs=[];
for(const c of CLS){
  const p=await b.newPage({viewport:{width:430,height:860}});
  p.on('pageerror',e=>errs.push(c+': '+e.message));
  await p.goto(URL);await p.waitForTimeout(700);
  await p.evaluate(()=>__g.skipDisc());await p.waitForTimeout(200);
  const r=await p.evaluate(cls=>{
    const pairs=__g.fxPairs(cls);
    const t0=performance.now();
    let px=0;
    for(const [k,col] of pairs){const sh=__g.fxSheet(k,col);if(sh&&sh.c)px+=sh.c.width*sh.c.height}
    return {ms:+(performance.now()-t0).toFixed(1),sheets:pairs.length,mb:+(px*4/1048576).toFixed(2)};
  },c);
  rows.push([c,r]);
  await p.close();
}
console.log('cold bake, one fresh page each\n');
console.log('class           ms   sheets   canvas MB');
for(const [c,r] of rows)console.log(c.padEnd(13)+String(r.ms).padStart(6)+String(r.sheets).padStart(9)+String(r.mb).padStart(12));
const worst=rows.reduce((a,x)=>x[1].ms>a[1].ms?x:a);
const avg=(rows.reduce((a,x)=>a+x[1].ms,0)/rows.length).toFixed(1);
console.log('\nworst '+worst[0]+' '+worst[1].ms+'ms, mean '+avg+'ms');
console.log('loading screen holds 900ms minimum, so anything under that is free at boot.');
console.log('a shared zone boundary already waits on the server for the map seed.');
if(errs.length)console.log('\npage errors:\n  '+errs.join('\n  '));
await b.close();
process.exit(errs.length?1:0)})();
