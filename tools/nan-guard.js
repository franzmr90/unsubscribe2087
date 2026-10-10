/* A non-finite number must not be able to brick a hero.
   Injects the exact failure from the live report -- hp goes NaN, which then makes
   every monster it touches unkillable -- and checks the watchdog notices, records
   enough to find the cause, and puts the numbers back.
   node tools/nan-guard.js */
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
await p.evaluate(()=>{__g.skipDisc();__g.OPT.noWalk=1;__g.ACC.maxi=1;__g.drawCls()});
await p.evaluate(()=>{document.getElementById('title').hidden=true;__g.newGame('maxi');__g.G.pre=0;__g.G.walkNew=0});
for(let i=0;i<8;i++){await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();
  const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}});await p.waitForTimeout(60)}
await p.evaluate(()=>{__g.enter(1);const s=document.getElementById('scene');if(s)s.hidden=true;__g.setMode('play')});
await p.waitForTimeout(200);

const clean=await p.evaluate(()=>{for(let i=0;i<30;i++)__g.update(0.05);return {rep:__g.nanReport(),hp:__g.G.hp}});
ok('it stays quiet while the numbers are fine', clean.rep===null, JSON.stringify(clean.rep));

const hurt=await p.evaluate(()=>{
  const g=__g;
  const e=g.spawn('tick',g.P.x+1,g.P.y); if(e)e.aggro=1;
  g.G.hp=NaN;                       /* the live failure */
  g.update(0.05);
  const after={hp:g.G.hp, max:g.S.maxHp, rep:g.nanReport(),
    foeNaN:g.W.ents.filter(x=>!isFinite(x.hp)).length};
  return after;
});
ok('it notices hp going non-finite', !!hurt.rep && hurt.rep.bad==='G.hp', JSON.stringify(hurt.rep&&hurt.rep.bad));
ok('it puts hp back to a real number', isFinite(hurt.hp)&&hurt.hp>0, String(hurt.hp));
ok('the report names the gear, aura and zone',
   !!(hurt.rep&&Array.isArray(hurt.rep.eq)&&hurt.rep.zi!==undefined&&'aura' in hurt.rep),
   JSON.stringify(hurt.rep));

const mob=await p.evaluate(()=>{
  const g=__g; const e=g.spawn('tick',g.P.x+1.2,g.P.y);
  if(!e)return {no:1};
  e.hp=NaN; g.G.hp=NaN;            /* a monster poisoned by NaN damage */
  g.update(0.05);
  return {foeHp:e.hp, finite:isFinite(e.hp), killable:isFinite(e.hp)&&isFinite(e.max)};
});
ok('a monster with non-finite life is made killable again', !!mob.killable, JSON.stringify(mob));

const once=await p.evaluate(()=>{
  const g=__g; const first=JSON.stringify(g.nanReport());
  g.G.hp=NaN; g.update(0.05);
  return {same:JSON.stringify(g.nanReport())===first};
});
ok('it keeps the first report, not the latest', once.same);

ok('no page errors', errs.length===0, errs.join(' | '));
await b.close();
if(fail.length){console.log('\nFAIL '+fail.length);process.exit(1)}
console.log('\nnan-guard ok');
})();
