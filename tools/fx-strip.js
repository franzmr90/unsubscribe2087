/* Dump the baked strips themselves, on a dark field, so the art can be judged
   without the game on top of it. node tools/fx-strip.js -> .fx-shots/strip-*.png */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const out=path.join(root,'.fx-shots');
(async()=>{
fs.mkdirSync(out,{recursive:true});
const html=fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8');
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1200,height:900}});
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
await p.waitForTimeout(500);
const kinds=await p.evaluate(()=>Object.keys(__g.FXART));
for(const k of kinds){
  const url=await p.evaluate((k)=>{
    const sh=__g.fxSheet(k,'#59e0e6');
    const n=sh.n,fw=sh.w,fh=sh.h;
    // 8 frames per row so wide strips stay legible
    const per=8,rows=Math.ceil(n/per);
    const c=document.createElement('canvas');
    c.width=fw*per;c.height=fh*rows;
    const g=c.getContext('2d');
    g.fillStyle='#14100f';g.fillRect(0,0,c.width,c.height);
    for(let i=0;i<n;i++){const rx=(i%per)*fw,ry=((i/per)|0)*fh;
      g.drawImage(sh.c,i*fw,0,fw,fh,rx,ry,fw,fh);
      g.strokeStyle='rgba(255,255,255,.07)';g.strokeRect(rx+.5,ry+.5,fw-1,fh-1)}
    return c.toDataURL('image/png');
  },k);
  fs.writeFileSync(path.join(out,'strip-'+k+'.png'),Buffer.from(url.split(',')[1],'base64'));
  console.log('strip-'+k+'.png');
}
await b.close();})();
