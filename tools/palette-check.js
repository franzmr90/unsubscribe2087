/* Can you see the monster against the floor it is standing on?
   node tools/palette-check.js [--rules]
   Diablo II's readability came from palette separation: a cool ground, warm
   actors, and one bright point on each so the eye has something to hold. The art
   spike found this game breaks it -- an orange tick on Act I's sodium ground --
   and that is why a prettier 3D version of the same monster read worse.
   This measures it. Distances are OKLab dE (x100), which is perceptual: equal
   numbers look like equal differences, which hex arithmetic does not. */
const {chromium}=require('playwright');
const path=require('path');
const URL='file://'+path.join(__dirname,'..','dist/Unsubscribe-2087-standalone.html');

/* sRGB -> OKLab. Bjorn Ottosson's matrices. */
function lab(hex){
  const h=hex.replace('#','');
  const f=i=>{let c=parseInt(h.substr(i,2),16)/255;
    return c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4)};
  const r=f(0),g=f(2),b=f(4);
  const l=Math.cbrt(.4122214708*r+.5363325363*g+.0514459929*b);
  const m=Math.cbrt(.2119034982*r+.6806995451*g+.1073969566*b);
  const s=Math.cbrt(.0883024619*r+.2817188376*g+.6299787005*b);
  return [.2104542553*l+.7936177850*m-.0040720468*s,
          1.9779984951*l-2.4285922050*m+.4505937099*s,
          .0259040371*l+.7827717662*m-.8086757660*s];
}
const dE=(a,b)=>{const x=lab(a),y=lab(b);
  return Math.round(Math.hypot(x[0]-y[0],x[1]-y[1],x[2]-y[2])*100*10)/10};
const L=hex=>Math.round(lab(hex)[0]*100);
const C=hex=>{const v=lab(hex);return Math.round(Math.hypot(v[1],v[2])*100*10)/10};

(async()=>{
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:430,height:860}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(URL);await p.waitForTimeout(700);
await p.evaluate(()=>__g.skipDisc());await p.waitForTimeout(250);

const data=await p.evaluate(()=>{
  const out=[];
  const ZONES=__g.ZONES,ET=__g.ET,STY=__g.STY;
  for(let zi=0;zi<ZONES.length;zi++){
    const z=ZONES[zi];if(!z||z.town||z.sim||!z.mix)continue;
    const st=STY[z.style];if(!st)continue;
    const kinds=[...new Set(z.mix.map(m=>m[0]))];
    if(z.su&&z.su.k)kinds.push(z.su.k);
    if(z.boss)kinds.push(z.boss);
    out.push({zi,name:z.n,style:z.style,floor:st.f.slice(),wall:st.w.slice(),glow:st.glow,
      mobs:kinds.filter(k=>ET[k]).map(k=>({k,n:ET[k].n,pal:ET[k].pal.slice()}))});
  }
  return out;
});
if(errs.length)console.log('page errors: '+errs.slice(0,3).join(' | '));
await b.close();

const rows=[];
for(const z of data){
  for(const m of z.mobs){
    const body=m.pal[0],accent=m.pal[1];
    const near=Math.min(...z.floor.map(f=>dE(body,f)));
    const nearW=Math.min(...z.wall.map(f=>dE(body,f)));
    /* the focal point: how far the accent stands off the body, and how bright */
    const focal=dE(body,accent);
    rows.push({zi:z.zi,zone:z.name,style:z.style,k:m.k,n:m.n,body,accent,
      floor:near,wall:nearW,focal,aL:L(accent),aC:C(accent)});
  }
}
const vals=rows.map(r=>r.floor).sort((a,b)=>a-b);
const q=f=>vals[Math.min(vals.length-1,Math.floor(vals.length*f))];
console.log('ground separation, OKLab dE x100, across '+rows.length+' monster/district pairs');
console.log('  worst '+vals[0]+'   10th '+q(.1)+'   median '+q(.5)+'   90th '+q(.9)+'   best '+vals[vals.length-1]);
console.log('\nThe ten that vanish into their own floor:');
console.log('  dE   zone                        monster                 body     floor');
for(const r of rows.sort((a,b)=>a.floor-b.floor).slice(0,10))
  console.log('  '+String(r.floor).padStart(4)+'  '+(r.zone||'').slice(0,26).padEnd(27)+r.n.slice(0,22).padEnd(23)+r.body+'  '+r.style);

/* The rule the renderer enforces. Anything under it gets a lit outline in
   rimOn(), in proportion to how far under it is, so a low score here is not a
   bug on its own -- it is a statement about how much work the rim is doing. */
const TH=18;
const under=rows.filter(r=>r.floor<TH);
const seen={};for(const r of under)seen[r.k]=Math.max(seen[r.k]||0,(TH-r.floor)/TH);
const names={};for(const r of under)names[r.k]=r.n;
console.log('\nRULE  an actor stands dE '+TH+' clear of every floor it spawns on.');
console.log('      '+under.length+' of '+rows.length+' pairs are under it, across '+Object.keys(seen).length+' actors.');
console.log('      Those actors are lit by rimOn() in src/p3.js, hardest where the score is worst:');
for(const k of Object.keys(seen).sort((a,b)=>seen[b]-seen[a]))
  console.log('        '+(Math.round(seen[k]*100)+'%').padStart(5)+'  '+names[k]);

const dim=rows.filter(r=>r.focal<12).sort((a,b)=>a.focal-b.focal);
console.log('\nMonsters with no focal point (accent within dE 12 of the body): '+dim.length);
for(const r of dim.slice(0,10))
  console.log('  '+String(r.focal).padStart(4)+'  '+r.n.slice(0,22).padEnd(23)+r.body+' / '+r.accent+'   accent L='+r.aL+' C='+r.aC);

if(process.argv.includes('--rules')){
  console.log('\n--- per zone ---');
  for(const z of data){
    console.log('\n'+z.name+'  ('+z.style+')  floor '+z.floor.join(' '));
    for(const m of z.mobs){
      const r=rows.find(x=>x.zi===z.zi&&x.k===m.k);
      console.log('   '+String(r.floor).padStart(4)+'  '+m.n.padEnd(24)+m.pal[0]+' / '+m.pal[1]);
    }
  }
}
})();
