/* Worn gear, and whether the pack agrees with the hand.
   node tools/gear-doll.js  -> .fx-shots/doll-*.png */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..'),out=path.join(root,'.fx-shots');
async function clearUI(p){for(let i=0;i<30;i++){const st=await p.evaluate(()=>{
  const s=document.getElementById('scene');if(s&&!s.hidden){document.getElementById('scSkip').click();return 'x'}
  const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x){x.click();return 'x'}return 'l'}
  return 'c'});if(st==='c')return;await p.waitForTimeout(st==='l'?350:150)}}
(async()=>{
fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:3});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+
  fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8')+'</body></html>');
await p.waitForTimeout(500);await p.evaluate(()=>__g.skipDisc());await p.waitForTimeout(250);
await p.click('[data-cls=scrapper]');await p.evaluate(()=>{__g.G.pre=2});await clearUI(p);
await p.waitForTimeout(1700);await clearUI(p);await clearUI(p);
const fail=[];

// a weapon's archetype must change its picture, or pack and hand disagree
const arch=await p.evaluate(()=>{
  const mk=(spd,base)=>({slot:'weapon',q:1,base,name:base,id:true,spd,il:40});
  const a=__g.itemArtFor(mk(-1,'Same Name')),c=__g.itemArtFor(mk(1,'Same Name')),d=__g.itemArtFor(mk(0,'Same Name'));
  return {heavyVsFast:a!==c,heavyVsPole:a!==d,
    archs:[__g.itemArch(mk(-1,'x')),__g.itemArch(mk(1,'x')),__g.itemArch(mk(0,'x'))]};
});
console.log('archetypes slow/fast/mid ->',arch.archs.join(','));
if(!arch.heavyVsFast)fail.push('a maul and a blade of the same name draw the same picture');
if(!arch.heavyVsPole)fail.push('a maul and a pole of the same name draw the same picture');

// a unique wears one colour in the pack and in the world
const tint=await p.evaluate(()=>{
  const u={slot:'weapon',q:4,base:'Severance',name:'Severance',id:true,spd:-1,il:60};
  const v={slot:'weapon',q:4,base:'Blackout',name:'Blackout',id:true,spd:-1,il:60};
  return {a:__g.itemTint(u),b:__g.itemTint(v),plain:__g.itemTint({slot:'weapon',q:1,base:'z',id:true})};
});
console.log('unique tints:',tint.a,'vs',tint.b,'  common:',tint.plain);
if(tint.a===tint.b)fail.push('two uniques share a tint');

// the figure, wearing three loadouts
const looks=[['bare',null],['kitted',2],['unique',4]];
for(const [name,q] of looks){
  await p.evaluate((q)=>{
    const G=__g.G;G.lvl=60;G.god=true;
    G.eq={};
    if(q!==null){for(const sl of ['weapon','helm','armor','gloves','boots','belt','amulet']){
      let it=null;
      for(let i=0;i<400&&!it;i++){const c=__g.makeItem(60,sl);if(c&&c.slot===sl&&c.q>=q)it=c}
      if(!it)it=__g.makeItem(60,sl);
      if(it){it.id=true;G.eq[sl]=it}}}
    __g.calc();
  },q);
  await p.waitForTimeout(220);
  const at=await p.evaluate(()=>{const s=__g.screenAt(__g.P.x,__g.P.y);
    const r=document.getElementById('cv').getBoundingClientRect();
    return {x:r.left+s.x,y:r.top+s.y}});
  const cw=190,ch=190;
  await p.screenshot({path:path.join(out,'doll-'+name+'.png'),
    clip:{x:Math.max(0,at.x-cw/2),y:Math.max(0,at.y-ch*.62),width:cw,height:ch}});
  const worn=await p.evaluate(()=>Object.keys(__g.G.eq).length);
  console.log('  '+name.padEnd(7)+' pieces worn: '+worn);
}
if(errs.length)fail.push('page errors: '+errs.slice(0,3).join(' | '));
console.log('');
if(fail.length){console.log('FAIL');fail.forEach(f=>console.log('  - '+f));process.exitCode=1}
else console.log('PASS');
await b.close();})();
