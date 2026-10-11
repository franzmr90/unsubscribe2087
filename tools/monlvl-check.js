/* The monster curve table must reproduce the arithmetic it replaced, exactly.
   node tools/monlvl-check.js
   Part one checks the table against the old expressions with ===, because the
   rows were generated in JS from those expressions and should be bit-identical
   rather than merely close. Part two spawns real monsters and compares. */
const path=require('path'),fs=require('fs');
const root=path.join(__dirname,'..');
const {FORMULAS,monLvl}=require(path.join(root,'src/formulas.js'));

// the expressions as they stood before the refactor
const oldHp  = ml => 1+.42*(ml-1);
const oldDmg = ml => (1+.22*(ml-1))*(ml>25?1+.008*(ml-25):1);
const oldXp  = ml => 1+.8*(ml-1);
const oldD0  = ml => 1+.22*(ml-1);

const fail=[];
let checked=0;
for(let ml=1;ml<=150;ml++){
  const r=monLvl(ml);
  const want=[oldHp(ml),oldDmg(ml),oldXp(ml),oldD0(ml)];
  const names=['hp','dmg','xp','dmgNoKink'];
  for(let c=0;c<4;c++){
    checked++;
    if(r[c]!==want[c])
      fail.push(`ml ${ml} ${names[c]}: table ${r[c]} vs old ${want[c]} (delta ${r[c]-want[c]})`);
  }
}
console.log(`table vs old arithmetic: ${checked} values checked across levels 1-150`);
console.log(`  rows in table: ${FORMULAS.monLvl.length}, tail covers the rest`);
if(!fail.length)console.log('  every value identical (===)');

// the kink divergence is deliberate; assert it is where it is supposed to be
const at25=monLvl(25), at26=monLvl(26);
if(at25[1]!==at25[3])fail.push('columns 1 and 3 should still agree at level 25');
if(at26[1]===at26[3])fail.push('columns 1 and 3 should diverge past level 25');
console.log(`  kink: equal at 25 (${at25[1]}), diverged at 26 (${at26[1]} vs ${at26[3]})`);

(async()=>{
// part two: real spawns
const {chromium}=require('playwright');
async function clearUI(p){for(let i=0;i<30;i++){const st=await p.evaluate(()=>{
 const s=document.getElementById('scene');if(s&&!s.hidden){document.getElementById('scSkip').click();return 'x'}
 const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x){x.click();return 'x'}return 'l'}
 return 'c'});if(st==='c')return;await p.waitForTimeout(st==='l'?350:150)}}
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:430,height:860}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+
  fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8')+'</body></html>');
await p.waitForTimeout(500);await p.evaluate(()=>__g.skipDisc());await p.waitForTimeout(250);
await p.click('[data-cls=scrapper]');await p.evaluate(()=>{__g.G.pre=2});await clearUI(p);
await p.evaluate(()=>{const G=__g.G;G.lvl=60;G.god=true;__g.calc()});
await p.evaluate(()=>__g.enter(1));await clearUI(p);
await p.waitForTimeout(1500);

const res=await p.evaluate((levels)=>{
  const W=__g.W,P=__g.P,ET=__g.ET,out=[];
  const kinds=Object.keys(ET).slice(0,6);
  for(const ml of levels){
    W.ml=ml;
    // no adaptive layer, so the comparison is of the curve alone
    W.dyn=null;
    for(const k of kinds){
      const n0=W.ents.length;
      const e=__g.spawn(k,P.x+3,P.y+3);
      if(!e){continue}
      out.push({ml,k,hp:e.max,dmg:e.dmg,base:{hp:ET[k].hp,dmg:ET[k].dmg}});
      W.ents.length=n0;
    }
  }
  return out;
},[1,5,25,26,40,60,99,100,130]);

console.log(`\nspawned monsters: ${res.length} across 9 levels`);
// DF() is in play and unknown out here, so check the RATIO between levels
// instead: hp(ml)/hp(1) must equal the table's ratio for every kind.
const byKind={};
for(const r of res)(byKind[r.k]=byKind[r.k]||[]).push(r);
let ratios=0;
for(const k in byKind){
  const rows=byKind[k], one=rows.find(r=>r.ml===1);
  if(!one)continue;
  for(const r of rows){
    if(r.ml===1)continue;
    ratios++;
    const wantHp=monLvl(r.ml)[0]/monLvl(1)[0], gotHp=r.hp/one.hp;
    const wantDmg=monLvl(r.ml)[1]/monLvl(1)[1], gotDmg=r.dmg/one.dmg;
    if(Math.abs(gotHp-wantHp)>1e-9)
      fail.push(`${k} ml ${r.ml}: hp ratio ${gotHp} vs table ${wantHp}`);
    if(Math.abs(gotDmg-wantDmg)>1e-9)
      fail.push(`${k} ml ${r.ml}: dmg ratio ${gotDmg} vs table ${wantDmg}`);
  }
}
console.log(`  ${ratios} level-to-level ratios compared against the table`);
if(errs.length)fail.push('page errors: '+errs.slice(0,3).join(' | '));
console.log('');
if(fail.length){console.log('FAIL');fail.slice(0,12).forEach(f=>console.log('  - '+f));
  if(fail.length>12)console.log(`  ... and ${fail.length-12} more`);process.exitCode=1}
else console.log('PASS  the table reproduces the arithmetic it replaced');
await b.close();})();
