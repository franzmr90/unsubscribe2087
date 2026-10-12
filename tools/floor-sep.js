/* The ground-separation rule, measured against the pixels that actually reach
   the screen instead of the three colours a style declares.

   tools/palette-check.js reads STY[].f, which is the authored palette. That is
   the right input for deciding what to repaint, and it is blind to anything
   that paints *on* a floor -- the material pass mottles a slab by design, so
   palette-check cannot see the change at all and reporting it as "unchanged"
   would mean nothing.

   This builds the real tiles, samples them, and reports the worst realistic
   case: the 5th-percentile dE between a monster's body and the floor pixels of
   its own district. A material pass is allowed to move it a little; what it may
   not do is push a pair that was clear under the dE 18 rule.

   node tools/floor-sep.js [tag]                                             */
const {chromium}=require('playwright');
const path=require('path');
const root=path.join(__dirname,'..');
(async()=>{
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:800,height:600}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.join(root,'dist/Unsubscribe-2087-standalone.html'));
await p.waitForTimeout(700);
const rows=await p.evaluate(()=>{
  const g=window.__g,ZONES=g.ZONES,ET=g.ET,out=[];
  const srgb=u=>{u/=255;return u<=.04045?u/12.92:Math.pow((u+.055)/1.055,2.4)};
  function oklab(r,gg,bb){const R=srgb(r),G=srgb(gg),B=srgb(bb);
    const l=Math.cbrt(.4122214708*R+.5363325363*G+.0514459929*B),
          m=Math.cbrt(.2119034982*R+.6806995451*G+.1073969566*B),
          s=Math.cbrt(.0883024619*R+.2817188376*G+.6299787005*B);
    return [(.2104542553*l+.7936177850*m-.0040720468*s)*100,
            (1.9779984951*l-2.4285922050*m+.4505937099*s)*100,
            (.0259040371*l+.7827717662*m-.8086757660*s)*100]}
  const hx=h=>{h=h.replace('#','');return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]};
  const dE=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
  const seen=new Set();
  for(let zi=0;zi<ZONES.length;zi++){
    const z=ZONES[zi];if(!z||z.town||z.sim||!z.mix)continue;
    g.buildTextures(z.style);const TX=g.TX;
    /* every floor pixel of every variant, as OKLab */
    const px=[];
    for(const t of TX.floor){const c=document.createElement('canvas');
      c.width=t.width;c.height=t.height;const q=c.getContext('2d');q.drawImage(t,0,0);
      const d=q.getImageData(0,0,t.width,t.height).data;
      for(let i=0;i<d.length;i+=4){if(d[i+3]<200)continue;px.push(oklab(d[i],d[i+1],d[i+2]))}}
    const kinds=[...new Set(z.mix.map(m=>m[0]))];
    if(z.su&&z.su.k)kinds.push(z.su.k);if(z.boss)kinds.push(z.boss);
    for(const k of kinds){if(!ET[k])continue;
      const key=z.style+'/'+k;if(seen.has(key))continue;seen.add(key);
      const body=oklab(...hx(ET[k].pal[0]));
      const ds=px.map(q=>dE(body,q)).sort((a,b)=>a-b);
      out.push({style:z.style,k,n:ET[k].n,p5:ds[Math.floor(ds.length*.05)],med:ds[Math.floor(ds.length*.5)]})}}
  return out});
if(errs.length)console.log('page errors:',errs.slice(0,2));
await b.close();
rows.sort((a,b)=>a.p5-b.p5);
const under=rows.filter(r=>r.p5<18);
console.log('rendered-floor separation, OKLab dE x100, '+rows.length+' actor/district pairs');
console.log('RULE  an actor stands dE 18 clear of the floor it spawns on.');
console.log('      '+under.length+' of '+rows.length+' are under it at the 5th percentile of floor pixels.');
console.log('the twelve tightest:');
for(const r of rows.slice(0,12))
  console.log('  p5 '+r.p5.toFixed(1).padStart(5)+'  med '+r.med.toFixed(1).padStart(5)+'  '+r.n.padEnd(22)+r.style);
console.log('TOTALS p5 mean '+(rows.reduce((a,r)=>a+r.p5,0)/rows.length).toFixed(2)+
            '  med mean '+(rows.reduce((a,r)=>a+r.med,0)/rows.length).toFixed(2));
})();
