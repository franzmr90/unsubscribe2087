/* A contact sheet of item art. node tools/item-art.js -> .fx-shots/items.png
   Shows a base type identified and sealed, and a spread of uniques, so the
   three cases Diablo draws differently can be compared side by side. */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..'),out=path.join(root,'.fx-shots');
(async()=>{
fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:980,height:760},deviceScaleFactor:2});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+
  fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8')+'</body></html>');
await p.waitForTimeout(500);
await p.evaluate(()=>__g.skipDisc());await p.waitForTimeout(200);
await p.click('[data-cls=scrapper]');await p.waitForTimeout(400);
const info=await p.evaluate(()=>{
  const slots=Object.keys(__g.ITART);
  const rows=[];
  // every slot, identified, at two rarities, plus its sealed look
  for(const sl of slots)rows.push({t:sl,cells:[
    {slot:sl,base:'b:'+sl+' common',q:0,id:true},
    {slot:sl,base:'b:'+sl+' rare',q:2,id:true},
    {slot:sl,base:'b:'+sl+' set',q:3,id:true},
    {slot:sl,base:'u:'+sl,q:4,id:true},
    {slot:sl,base:'b:'+sl,q:1,id:false}]});
  // distinct uniques must look distinct from one another
  const uni=__g.UNI.slice(0,10).map(u=>({slot:__g.ITART[u.slot]?u.slot:'charm',base:'u:'+u.n,q:4,id:true,n:u.n}));
  rows.push({t:'uniques',cells:uni});
  const html=rows.map(r=>'<div class=r><b>'+r.t+'</b>'+r.cells.map(c=>
    '<span class=c><img src="'+__g.itemArt(c.slot,c.base,c.q,c.id)+'"><i>'+(c.n||(c.id?('q'+c.q):'sealed'))+'</i></span>').join('')+'</div>').join('');
  document.body.innerHTML='<style>body{background:#0d0b0a;color:#9a9party;font:11px Cinzel,Georgia,serif;margin:0;padding:10px}'+
    '.r{display:flex;align-items:center;gap:8px;margin:4px 0}.r>b{width:72px;color:#c8a55a;font-size:10px;letter-spacing:.1em;text-transform:uppercase}'+
    '.c{display:flex;flex-direction:column;align-items:center;width:84px}'+
    '.c img{width:56px;height:56px}.c i{color:#6f6757;font-style:normal;font-size:8.5px;margin-top:2px;text-align:center;line-height:1.2}</style>'+html;
  return {slots:slots.length,uni:__g.UNI.length};
});
await p.waitForTimeout(250);
await p.screenshot({path:path.join(out,'items.png'),fullPage:true});
console.log('slots with art:',info.slots,' uniques in table:',info.uni);
console.log(errs.length?('page errors: '+errs.slice(0,3).join(' | ')):'clean');
await b.close();})();
