/* The floor and wall tiles themselves, which is the thing a texture pass
   actually changes -- a lit scene mixes the tiles with the lighting and makes
   a regression in one look like a win in the other.

   Writes a sheet at 4x nearest-neighbour, and reports per style:
     L       mean lightness of the tile set (0-100). A material pass must not
             move this much; if it does it is repainting, not modulating.
     var     stddev of lightness within a tile, meaned. This is the number the
             pass exists to raise -- it is how much surface there is to see.
     span    the darkest tile's L to the lightest. Collapsing it means variants
             stopped being different from each other.

   node tools/tile-sheet.js <tag> [styles]                                   */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const root=path.join(__dirname,'..');
const PAGE='file://'+path.join(root,'dist/Unsubscribe-2087-standalone.html');
const TAG=process.argv[2]||'now';
const STYLES=(process.argv[3]||'moor,mall,farm,trib,hq,town').split(',');
(async()=>{
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:900,height:700}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(PAGE);await p.waitForTimeout(700);
const out=await p.evaluate(({STYLES})=>{
  const g=window.__g,Z=4,rows=[];
  const cv=document.createElement('canvas');
  cv.width=66*7*Z;cv.height=92*STYLES.length*Z;
  const c=cv.getContext('2d');c.imageSmoothingEnabled=false;
  c.fillStyle='#101014';c.fillRect(0,0,cv.width,cv.height);
  /* sRGB -> L* of CIELAB, which is the axis the eye reads as "how light" */
  const lin=u=>{u/=255;return u<=.04045?u/12.92:Math.pow((u+.055)/1.055,2.4)};
  const Lof=(r,gg,bb)=>{const y=.2126*lin(r)+.7152*lin(gg)+.0722*lin(bb);
    return 100*(y>.008856?Math.cbrt(y):7.787*y+16/116)-(y>.008856?16:0)+(y>.008856?16:0)};
  STYLES.forEach((st,si)=>{
    g.buildTextures(st);const TX=g.TX;
    const tiles=TX.floor.concat(TX.wall,[TX.low]);
    let sumL=0,sumV=0,n=0,lo=1e9,hi=-1e9;
    tiles.forEach((t,ti)=>{
      c.drawImage(t,ti*66*Z,si*92*Z,t.width/2*Z,t.height/2*Z);
      const tc=document.createElement('canvas');tc.width=t.width;tc.height=t.height;
      const q=tc.getContext('2d');q.drawImage(t,0,0);
      const d=q.getImageData(0,0,t.width,t.height).data;
      const Ls=[];for(let i=0;i<d.length;i+=4){if(d[i+3]<200)continue;Ls.push(Lof(d[i],d[i+1],d[i+2]))}
      if(!Ls.length)return;
      const m=Ls.reduce((a,x)=>a+x,0)/Ls.length;
      const sd=Math.sqrt(Ls.reduce((a,x)=>a+(x-m)*(x-m),0)/Ls.length);
      sumL+=m;sumV+=sd;n++;lo=Math.min(lo,m);hi=Math.max(hi,m)});
    rows.push({st,L:sumL/n,v:sumV/n,span:hi-lo,mat:!!(g.MAT&&g.MAT[st])})});
  return {png:cv.toDataURL('image/png'),rows};
},{STYLES});
fs.writeFileSync(root+'/.fx-shots/tiles-'+TAG+'.png',Buffer.from(out.png.split(',')[1],'base64'));
console.log('style      mat    L    var   span');
for(const r of out.rows)
  console.log(r.st.padEnd(9),(r.mat?'yes':'-').padEnd(4),r.L.toFixed(1).padStart(5),r.v.toFixed(2).padStart(6),r.span.toFixed(1).padStart(6));
if(errs.length)console.log('page errors:',errs.slice(0,3));
console.log('sheet -> .fx-shots/tiles-'+TAG+'.png');
await b.close()})();
