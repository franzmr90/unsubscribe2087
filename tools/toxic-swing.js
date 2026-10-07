/* Toxic Maximalism: the card's attack-speed line applies to your own swing.
   node tools/toxic-swing.js */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const fail=m=>{console.error(m);process.exitCode=1;throw new Error(m)};
const root=path.join(__dirname,'..');

(async()=>{
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.stack||String(e)));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8')+'</body></html>');
await p.waitForTimeout(400);
await p.evaluate(()=>{__g.skipDisc();__g.OPT.noWalk=1});
await p.evaluate(()=>{document.getElementById('title').hidden=true;__g.newGame('maxi');__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1});
for(let i=0;i<12;i++){
  await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}});
  await p.waitForTimeout(60);
}
await p.evaluate(()=>__g.enter(0));
await p.waitForTimeout(150);
await p.evaluate(()=>{const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()};__g.setMode('play');__g.G.walkNew=0;__g.OPT.noWalk=1});

const r=await p.evaluate(()=>{
  const g=__g,G=g.G,P=g.P,W=g.W,fail=[];
  const card=g.CLS.maxi.sk[3];
  if(card.n!=='Toxic Maximalism')fail.push('skill 3 is '+card.n);
  const d1=card.d(1),d10=card.d(10);
  if(!/18% faster/.test(d1))fail.push('rank 1 card '+d1);
  if(!/25% harder/.test(d1))fail.push('rank 1 damage line '+d1);
  if(!/45% faster/.test(d10))fail.push('rank 10 card '+d10);
  G.lvl=24;G.act2=1;G.god=true;G.tag=null;G.merc=null;
  G.sk=[1,0,0,1,0,0,0,0,0,0,0,0,0,0,0];G.pas=[];G.slots=[3,-1,-1];
  g.calc();
  W.ents.length=0;W.merc=null;W.tag=null;W.allies.length=0;
  P.dash=null;P.buff=0;P.two=null;P.mech=0;
  function interval(L){
    P.aura=L?{i:3,L:L,t:1}:null;
    g.maxiAura(0.02);
    P.atk=0;g.attack();
    return {atk:P.atk,tox:P.toxL||0,swing:g.toxicSwing(P)};
  }
  const off=interval(0);
  const r1=interval(1);
  const r10=interval(10);
  const back=interval(0);
  if(off.tox!==0||off.swing!==1)fail.push('aura off still hastes '+JSON.stringify(off));
  if(Math.abs(r1.swing-1.18)>1e-9||r1.tox!==1)fail.push('rank 1 swing '+JSON.stringify(r1));
  if(Math.abs(off.atk/r1.atk-1.18)>1e-6)fail.push('rank 1 interval '+off.atk+' -> '+r1.atk);
  if(Math.abs(r10.swing-(1+(15+30)/100))>1e-9||r10.tox!==10)fail.push('rank 10 swing '+JSON.stringify(r10));
  if(Math.abs(off.atk/r10.atk-(1.45))>1e-6)fail.push('rank 10 interval '+off.atk+' -> '+r10.atk);
  if(Math.abs(back.atk-off.atk)>1e-9||back.tox!==0)fail.push('switching the aura off left '+JSON.stringify(back));
  G.cls='scrapper';g.calc();P.aura={i:3,L:10,t:1};g.maxiAura(0.02);
  if((P.toxL||0)!==0)fail.push('scrapper took the aura '+P.toxL);
  G.cls='maxi';G.sk[3]=1;g.calc();
  P.aura=null;P.cd[3]=0;G.en=g.S.maxEn;g.setMode('play');
  g.cast(0);g.maxiAura(0.02);
  if(!P.aura||P.aura.i!==3)fail.push('cast did not raise the aura');
  if(Math.abs(g.toxicSwing(P)-1.18)>1e-9)fail.push('cast rank 1 swing '+g.toxicSwing(P)+' tox '+P.toxL);
  g.S.dmin=g.S.dmax=100;g.S.shock=0;g.S.crit=0;g.S.dmg=0;
  function blow(on){
    W.ents.length=0;
    P.aura=on?{i:3,L:1,t:1}:null;g.maxiAura(0.02);
    const e=g.spawn('tick',P.x+0.8,P.y,{});
    e.stun=99;e.hp=e.max=1e7;e.mods={};
    const hp=e.hp;P.atk=0;P.dash=null;g.attack();
    return hp-e.hp;
  }
  const dOff=blow(false),dOn=blow(true);
  if(!(dOff>0)||Math.abs(dOn/dOff-1.25)>0.02)fail.push('damage '+dOff+' -> '+dOn);
  return {fail,off:off.atk,r1:r1.atk,r10:r10.atk,dOff,dOn};
});
if(r.fail.length)fail(r.fail.join('\n'));
console.log('toxic swing ok',JSON.stringify({off:r.off,r1:r.r1,r10:r.r10,dOff:r.dOff,dOn:r.dOn}));
if(errs.length)fail('pageerror\n'+errs.join('\n'));
await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
