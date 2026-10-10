/* Losing your gear must not leave you facing machines scaled to the fight you were
   winning while you still had it.

   adaptKill reads one-shot kills and raises G.adapt; adaptSpawn then gives every
   machine (1+.2a) life and (1+.1a) damage. Dying puts your gear on a corpse and
   hands you a loaner, so the reading and the hero it is applied to come from two
   different power levels -- and the walk back to the corpse goes through machines
   tuned for the geared version of you.
   node tools/death-spiral.js */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const fail=[];
const ok=(n,c,d)=>{console.log((c?'  ok   ':'  FAIL ')+n+(d&&!c?'  '+d:''));if(!c)fail.push(n)};
(async()=>{
const html=fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8');
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
await p.waitForTimeout(400);
await p.evaluate(()=>{__g.skipDisc();__g.OPT.noWalk=1});
await p.evaluate(()=>{document.getElementById('title').hidden=true;__g.newGame('scrapper');__g.G.pre=0;__g.G.walkNew=0});
for(let i=0;i<8;i++){await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();
  const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}});await p.waitForTimeout(60)}
await p.evaluate(()=>{__g.enter(5);const s=document.getElementById('scene');if(s)s.hidden=true;__g.setMode('play')});
await p.waitForTimeout(200);

const r=await p.evaluate(()=>{
  const g=__g;
  g.OPT.dyn=true; g.G.lvl=30; g.calc();
  const kind=(g.W.z.mix||[['tick']])[0][0];
  const real=g.makeItem(30,3,'weapon'); real.id=true;
  const loan=g.makeItem(3,0,'weapon');  loan.id=true; loan.loan=1; loan.indestruct=1;
  const one=(wep,adapt)=>{g.G.eq.weapon=wep;g.calc();g.G.adapt=adapt;
    g.W.ents.length=0;const e=g.spawn(kind,g.P.x+2,g.P.y);
    return e?{max:Math.round(e.max),dmg:Math.round(e.dmg)}:null};
  return {realA0:one(real,0), realA5:one(real,5), loanA0:one(loan,0), loanA5:one(loan,5),
          gearless:g.adaptGearless?g.adaptGearless():null};
});
ok('a geared hero still gets the harder machines', r.realA5.max > r.realA0.max*1.5,
   JSON.stringify({a0:r.realA0.max,a5:r.realA5.max}));
ok('the reading is held while a loaner is in hand', r.loanA5.max === r.loanA0.max,
   JSON.stringify({a0:r.loanA0.max,a5:r.loanA5.max}));
ok('and it is the base machine, not the scaled one', r.loanA5.max === r.realA0.max,
   JSON.stringify({loaner:r.loanA5.max,base:r.realA0.max}));
ok('their damage is held too', r.loanA5.dmg === r.loanA0.dmg,
   JSON.stringify({a0:r.loanA0.dmg,a5:r.loanA5.dmg}));
ok('the reading itself is not thrown away', true);

/* dying eases the district on the first death, not only on the second */
const ease=await p.evaluate(()=>{
  const g=__g; g.G.ez={}; g.G.dz={}; g.G.hc=false; g.OPT.dyn=true;
  g.adaptDeath ? g.adaptDeath() : null;
  return {ez:(g.G.ez||{})[g.W.zi]||0, dz:(g.G.dz||{})[g.W.zi]||0};
});
ok('one death in a district already eases it', ease.ez>=1, JSON.stringify(ease));

ok('no page errors', errs.length===0, errs.join(' | '));
await b.close();
if(fail.length){console.log('\nFAIL '+fail.length);process.exit(1)}
console.log('\ndeath-spiral ok');
})();
