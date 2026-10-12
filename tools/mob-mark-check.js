/* Every Act IV and V creature carries a mark, and every mark paints.
   node tools/mob-mark-check.js
   The contact sheet shows whether a mark reads; this checks the cheaper things
   the eye is bad at: that each creature has one, that none of them throws, and
   that each one actually puts pixels on the canvas in a place the borrowed body
   does not. A mark that silently does nothing looks exactly like a mark that
   was never written. */
const {chromium}=require('playwright');
const path=require('path');
const URL='file://'+path.join(__dirname,'..','dist/Unsubscribe-2087-standalone.html');
const PAIRS=[['seer','hr'],['lancer','hound'],['splitter','bot'],['director','mech'],
 ['proxy','bot'],['gob','drone'],['shill','hr'],['bull','hound'],
 ['daemon','tick'],['wdog','hound'],['fwall','bot'],['cam','ad'],['gap','mech'],
 ['wisher','ad'],['companion','bot'],['lull','hr'],['ctkr','mech'],['fetch','hound'],
 ['orphan','tick'],['valid','bot'],['claim','drone'],['custod','mech'],['sniper','hound'],['oracle','ad']];
async function clearUI(p){for(let i=0;i<50;i++){const st=await p.evaluate(()=>{
 const s=document.getElementById('scene');if(s&&!s.hidden){const b=document.getElementById('scSkip');if(b)b.click();return 'x'}
 const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x){x.click();return 'x'}return 'l'}
 return 'c'});if(st==='c')return;await p.waitForTimeout(st==='l'?300:120)}}
const out=[];let bad=0;
const ok=(n,c,d)=>{out.push((c?'  ok   ':'  FAIL ')+n+(d?'   '+d:''));if(!c)bad++};
(async()=>{
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:760,height:760}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(URL);await p.waitForTimeout(700);
await p.evaluate(()=>__g.skipDisc());await p.waitForTimeout(250);
await p.click('[data-cls=scrapper]');await p.evaluate(()=>{__g.G.pre=2});await clearUI(p);await p.waitForTimeout(1600);await clearUI(p);

const have=await p.evaluate(()=>Object.keys(__g.MOBMARK));
for(const [k] of PAIRS)ok('"'+k+'" has a mark',have.indexOf(k)>=0);
ok('and nothing else does',have.length===PAIRS.length,have.length+' marks for '+PAIRS.length+' creatures');

/* The canvas is opaque after a render, so counting ink counts the floor. Render
   each creature twice instead -- once with its painter in the table and once with
   it taken out -- and count the pixels that differ. That is the mark, and nothing
   else. */
const r=await p.evaluate(pairs=>{
  const res={};
  const cv=document.getElementById('cv'),g=cv.getContext('2d');
  const W=__g.W,P=__g.P,M=__g.MOBMARK;
  const shoot=()=>{try{__g.render()}catch(err){}
    return g.getImageData(0,0,cv.width,cv.height).data};
  for(const [k] of pairs){
    W.ents.length=0;W.fx.length=0;W.projs.length=0;
    const e=__g.spawn(k,P.x,P.y+1.5);
    if(!e){res[k]={err:'would not spawn'};continue}
    e.aggro=false;e.stun=0;e.spd=0;e.ph=1.1;
    const fn=M[k];
    delete M[k];const a=shoot().slice();
    M[k]=fn;  const b=shoot();
    let n=0;for(let i=0;i<b.length;i+=4)
      if(a[i]!==b[i]||a[i+1]!==b[i+1]||a[i+2]!==b[i+2])n++;
    res[k]={px:n};
  }
  return res;
},PAIRS);
for(const [k] of PAIRS){
  const v=r[k]||{};
  /* a mark smaller than this is one nobody will see in a fight */
  ok('"'+k+'" puts a mark on the screen',v.px>=120,v.err||(v.px+' px changed'));
}
console.log(out.join('\n'));
if(errs.length)console.log('\npage errors:\n  '+errs.slice(0,4).join('\n  '));
console.log(bad?'\n'+bad+' FAILED':'\nall passed');
await b.close();process.exit(bad||errs.length?1:0)})();
