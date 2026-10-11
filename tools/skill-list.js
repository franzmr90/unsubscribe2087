/* Every skill, with what it says and what it currently draws.
   node tools/skill-list.js  ->  notes/SKILL-LIST.json + a table on stdout */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
(async()=>{
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+
  fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8')+'</body></html>');
await p.waitForTimeout(500);
await p.evaluate(()=>__g.skipDisc());await p.waitForTimeout(200);
await p.click('[data-cls=scrapper]');await p.waitForTimeout(400);

const data=await p.evaluate(()=>{
  const out=[];
  const G=__g.G;
  for(const cls in __g.CLS){
    const C=__g.CLS[cls];
    if(!C||!C.sk)continue;
    G.cls=cls;try{__g.calc()}catch(e){}
    C.sk.forEach((sk,i)=>{
      let desc='';try{desc=typeof sk.d==='function'?sk.d(5):(sk.d||'')}catch(e){desc='(description threw: '+e.message+')'}
      let v=null;try{v=__g.skvOf(cls,i)}catch(e){}
      out.push({cls,i,name:sk.n,ab:(sk.ab||'').replace(/\n/g,' '),
        active:sk.a===1,cost:sk.cost||0,cd:sk.cd||0,
        desc:String(desc).replace(/\s+/g,' ').trim(),
        vfx:v?{k:v.k,col:v.col,r:v.r,n:v.n,life:v.life,at:v.at,tel:v.tel,reach:v.reach}:null});
    });
  }
  return {out,melee:Object.fromEntries(Object.keys(__g.CLS).map(c=>[c,!!__g.CLS[c].melee])),
    weapon:Object.fromEntries(Object.keys(__g.CLS).map(c=>[c,(__g.classWeapon&&__g.classWeapon(c))||null]))};
});
fs.mkdirSync(path.join(root,'notes'),{recursive:true});
fs.writeFileSync(path.join(root,'notes/SKILL-LIST.json'),JSON.stringify(data,null,1));

const rows=data.out;
const byCls={};rows.forEach(r=>{(byCls[r.cls]=byCls[r.cls]||[]).push(r)});
let act=0,pas=0,novfx=0;
for(const cls in byCls){
  console.log('\n== '+cls+'  (melee: '+data.melee[cls]+')');
  for(const r of byCls[cls]){
    r.active?act++:pas++;
    if(r.active&&!r.vfx)novfx++;
    console.log('  '+String(r.i).padStart(2)+' '+(r.active?'A':'p')+' '+r.name.padEnd(22)+
      (r.vfx?(r.vfx.k+' '+r.vfx.col):(r.active?'-- NO VFX --':'(passive)')));
  }
}
console.log('\ntotal '+rows.length+'   active '+act+'   passive '+pas+'   active with no vfx '+novfx);
if(errs.length)console.log('page errors: '+errs.slice(0,3).join(' | '));
console.log('wrote notes/SKILL-LIST.json');
await b.close();})();
