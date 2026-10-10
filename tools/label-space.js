/* Names and bubbles do not print on top of each other.
   Crowds NPCs, drops, hirelings, champions and other players into one spot, renders,
   and checks that no two claimed text rectangles overlap.
   node tools/label-space.js */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const fail=[];
const ok=(n,c,d)=>{console.log((c?'  ok   ':'  FAIL ')+n+(d&&!c?'  '+d:''));if(!c)fail.push(n)};

/* Area of the overlap between two rectangles, 0 when they only touch. */
const over=(a,b)=>Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x))
                 *Math.max(0,Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y));
function worst(boxes){
  let n=0,area=0,pair=null;
  for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
    const o=over(boxes[i],boxes[j]);
    if(o>0.5){n++;if(o>area){area=o;pair=[boxes[i],boxes[j]]}}}
  return {n,area:Math.round(area),pair};
}

(async()=>{
const html=fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8');
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
await p.waitForTimeout(400);
await p.evaluate(()=>{__g.skipDisc();__g.OPT.noWalk=1});
await p.evaluate(()=>{document.getElementById('title').hidden=true;__g.newGame('scrapper');__g.G.pre=0;__g.G.walkNew=0});
for(let i=0;i<8;i++){
  await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();
    const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}});
  await p.waitForTimeout(60);
}

/* Stillwater is where the people stand. */
await p.evaluate(()=>{__g.enter(0);const s=document.getElementById('scene');if(s)s.hidden=true;__g.setMode('play')});
await p.waitForTimeout(250);

const town=await p.evaluate(()=>{
  const g=__g,W=g.W,P=g.P;
  /* Stack every townsperson on one tile and make them all talk. */
  for(const n of W.npcs||[]){n.x=P.x+0.6;n.y=P.y+0.6;n.st=3;n.say='A line long enough to need two rows of wrapping.'}
  g.render();
  return {npcs:(W.npcs||[]).length,boxes:g.LBOX.map(r=>({x:r.x,y:r.y,w:r.w,h:r.h}))};
});
ok('the town has people to crowd', town.npcs>1, String(town.npcs));
ok('something was drawn', town.boxes.length>0, String(town.boxes.length));
let w=worst(town.boxes);
ok('no two names or bubbles overlap with the town piled on one tile',
   w.n===0, w.n+' overlapping pairs, worst '+w.area+'px^2 '+JSON.stringify(w.pair));

/* A loot explosion, with the town back to standing apart and quiet, so this measures
   the drops rather than the pile above. */
const drops=await p.evaluate(()=>{
  const g=__g,W=g.W,P=g.P;
  (W.npcs||[]).forEach((n,i)=>{n.st=0;n.say='';n.x=P.x+4+i*1.4;n.y=P.y+4});
  W.drops.length=0;
  for(let i=0;i<14;i++){const it=g.makeItem(12,1);it.id=true;W.drops.push({x:P.x+1+(i%3)*0.12,y:P.y+1+((i/3)|0)*0.12,it,t:9})}
  g.lootPrefs().always=1;  /* name every one of them, not just the nearest few */
  g.render();
  const loot=g.LOOT_BOX.map(r=>({x:r.x,y:r.y,w:r.w,h:r.h}));
  return {n:W.drops.length,named:loot.length,all:g.LBOX.map(r=>({x:r.x,y:r.y,w:r.w,h:r.h})),loot};
});
ok('the drops are on the floor', drops.n===14, String(drops.n));
ok('their names are on screen', drops.named>=8, String(drops.named));
w=worst(drops.loot);
ok('no two ground names overlap each other', w.n===0, w.n+' pairs, worst '+w.area+'px^2');
w=worst(drops.all);
ok('no ground name lands on a person\'s name', w.n===0, w.n+' pairs, worst '+w.area+'px^2');

/* A champion pack, names and modifier lines together. */
const champs=await p.evaluate(()=>{
  const g=__g,W=g.W,P=g.P;
  W.drops.length=0;W.ents.length=0;
  for(let i=0;i<6;i++){const e=g.spawn('tick',P.x+1.2+(i%2)*0.1,P.y+1.2+i*0.08,{champ:1});
    if(e){e.aggro=1;e.hp=e.max*0.6;e.mods={fast:1,hardy:1}}}
  g.render();
  return {n:W.ents.length,boxes:g.LBOX.map(r=>({x:r.x,y:r.y,w:r.w,h:r.h}))};
});
ok('the pack spawned', champs.n>=4, String(champs.n));
w=worst(champs.boxes);
ok('no two champion names or modifier lines overlap',
   w.n===0, w.n+' overlapping pairs, worst '+w.area+'px^2');

/* Everything at once: the whole town on one tile, all talking, drops underneath.
   Names and bubbles must still never collide. A ground name may be forced to sit on
   one when the screen is this full -- it is the thing the pointer clicks, so it is
   drawn either way -- and that is measured separately. */
const stress=await p.evaluate(()=>{
  const g=__g,W=g.W,P=g.P;
  (W.npcs||[]).forEach(n=>{n.x=P.x+0.6;n.y=P.y+0.6;n.st=3;n.say='A line long enough to need two rows of wrapping.'});
  g.lootPrefs().always=1;g.render();
  const loot=g.LOOT_BOX.map(r=>r.x+','+r.y+','+r.w+','+r.h);
  const all=g.LBOX.map(r=>({x:r.x,y:r.y,w:r.w,h:r.h,loot:loot.indexOf(r.x+','+r.y+','+r.w+','+r.h)>=0}));
  return {all,names:all.filter(r=>!r.loot),loot:all.filter(r=>r.loot)};
});
w=worst(stress.names);
ok('with the whole town stacked and talking, no name or bubble overlaps another',
   w.n===0, w.n+' pairs, worst '+w.area+'px^2');
w=worst(stress.loot);
ok('and no two ground names overlap even then', w.n===0, w.n+' pairs, worst '+w.area+'px^2');

/* The list is per frame: it must not grow without end. */
const grow=await p.evaluate(()=>{const g=__g;g.render();const a=g.LBOX.length;g.render();return {a,b:g.LBOX.length}});
ok('the claim list is cleared each frame', grow.a===grow.b, grow.a+' then '+grow.b);

ok('no page errors', errs.length===0, errs.join(' | '));
await b.close();
if(fail.length){console.log('\nFAIL '+fail.length);process.exit(1)}
console.log('\nlabel-space ok');
})();
