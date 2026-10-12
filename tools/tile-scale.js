/* The tile pipeline's arithmetic, which is invisible until it is wrong.

   Tiles are built larger than they are drawn, so every draw site has to divide
   by the factor they were built at. If that factor is read from anywhere but
   the texture set itself, the two can disagree -- the effects setting changes,
   the tiles rebuild at 1x, and the wall draw site is still dividing by 2, so
   every wall in the district is drawn at half height and floating. Nothing
   throws; it just looks broken.

   So: a wall is 46 logical units tall and a low wall 12, whatever the tiles
   were built at. That is the invariant, and it is checked under both settings.

   node tools/tile-scale.js                                                  */
const {chromium}=require('playwright');
const path=require('path');
const root=path.join(__dirname,'..');
let fail=0;
const ok=(c,m)=>{console.log((c?'  ok   ':'  FAIL ')+m);if(!c)fail++};
(async()=>{
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:800,height:600}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.join(root,'dist/Unsubscribe-2087-standalone.html'));
await p.waitForTimeout(700);
for(const fx of ['full','thin']){
  const r=await p.evaluate(fx=>{
    const g=window.__g;g.OPT.fx=fx;
    const bad=[],styles=Object.keys(g.STY);
    let ts=null;
    for(const st of styles){
      g.TX.style='';g.buildTextures(st);const TX=g.TX;ts=TX.ts;
      for(const f of TX.floor)
        if(f.width!==66*TX.ts||f.height!==34*TX.ts)bad.push(st+' floor '+f.width+'x'+f.height+' ts'+TX.ts);
      /* the number the draw site divides by, applied the way the draw site
         applies it: this is what puts a wall's feet on the ground */
      for(const w of TX.wall)if(w.height/TX.ts-34!==46)bad.push(st+' wall logical h '+(w.height/TX.ts-34));
      if(TX.low.height/TX.ts-34!==12)bad.push(st+' low logical h '+(TX.low.height/TX.ts-34));
    }
    return {bad:bad.slice(0,5),nbad:bad.length,ts,n:styles.length}},fx);
  console.log('fx='+fx+'  ts='+r.ts+'  '+r.n+' styles');
  ok(r.nbad===0,'every tile is the size its own ts says'+(r.nbad?' ('+r.nbad+' wrong: '+r.bad.join('; ')+')':''));
  ok(r.ts===(fx==='thin'?1:2),'built at '+(fx==='thin'?1:2)+'x under fx='+fx);
}
const mat=await p.evaluate(()=>{const g=window.__g,need=['m','g','w','c','v','s','p','r'],bad=[];
  for(const k in g.MAT)for(const f of need)if(g.MAT[k][f]===undefined)bad.push(k+'.'+f);
  return {bad,keys:Object.keys(g.MAT),unknown:Object.keys(g.MAT).filter(k=>!g.STY[k])}});
ok(mat.bad.length===0,'every MAT row is complete'+(mat.bad.length?' (missing '+mat.bad.join(', ')+')':''));
ok(mat.unknown.length===0,'every MAT row names a real style'+(mat.unknown.length?' ('+mat.unknown.join(', ')+')':''));
console.log('  --   MAT covers: '+mat.keys.join(' '));
if(errs.length){console.log('  FAIL page errors: '+errs.slice(0,2).join(' | '));fail++}
await b.close();
console.log(fail?'\nFAIL  '+fail+' check(s)':'\nPASS  the tile pipeline agrees with itself');
process.exit(fail?1:0)})();
