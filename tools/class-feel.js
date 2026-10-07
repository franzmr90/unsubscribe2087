/* Original six, the outliers from notes/class-feel-six.md.
   node tools/class-feel.js
   Act I Tick for each class, then the three aura lines that were not landing. */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');

async function clearUI(p){
  for(let i=0;i<24;i++){
    const st=await p.evaluate(()=>{
      const s=document.getElementById('scene');
      if(s&&!s.hidden){document.getElementById('scSkip').click();return 'scene'}
      const d=document.getElementById('dlg');
      if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x){x.click();return 'dlg'}return 'locked'}
      return 'clear'});
    if(st==='clear')return;
    await p.waitForTimeout(st==='locked'?350:160);
  }
  throw new Error('overlays did not clear');
}

(async()=>{
const html=fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8');
const fail=[];
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
await p.waitForTimeout(400);
await p.evaluate(()=>__g.skipDisc());
await p.waitForTimeout(200);
await p.click('[data-cls=scrapper]');
await p.waitForTimeout(250);
await p.evaluate(()=>{__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1});
await clearUI(p);
await p.evaluate(()=>__g.enter(1));
await clearUI(p);
await p.evaluate(()=>__g.setMode('play'));

const report=await p.evaluate(()=>{
  const fail=[],g=__g,note=[];
  const check=(n,ok,extra)=>{if(!ok)fail.push(n+(extra!==undefined?': '+extra:''))};
  const rnd0=Math.random;
  Math.random=()=>0.5;
  function boot(cls){
    const G=g.G,P=g.P,W=g.W;
    G.cls=cls;G.lvl=1;G.sk=[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0];G.pas=[];G.slots=[0,-1,-1];
    G.god=false;G.form=null;G.diff=0;G.pp=0;G.walkNew=0;G.tag=null;G.merc=null;
    g.calc();G.hp=g.S.maxHp;G.en=g.S.maxEn;g.setMode('play');g.OPT.noWalk=1;
    W.ents.length=0;W.projs.length=0;W.fx.length=0;W.allies.length=0;W.merc=null;W.tag=null;
    P.aura=null;P.toxL=0;P.mkAura=0;P.mkP=0;P.haste=0;P.atk=0;P.dash=null;P.buff=0;P.allySwing=0;P.nodeM=0;
    P.dir={x:1,y:0};P.inv=0;P.dip=0;
    return {G,P,W};
  }
  function tickNear(P,dx){
    const e=g.spawn('tick',P.x+(dx||0.9),P.y,{});
    if(!e)return null;
    e.stun=99;e.aggro=true;e.mods={};return e;
  }
  const names={scrapper:'Scrapper',hacker:'Technomancer',courier:'Runner',anon:'Anon',founder:'Founder',maxi:'The Maximalist'};
  for(const cls of ['scrapper','hacker','courier','anon','founder','maxi']){
    const {P}=boot(cls);
    if(cls==='maxi')g.ACC.maxi=1;
    const e=tickNear(P);
    check(names[cls]+' spawned a Tick',!!e);
    if(!e)continue;
    let t=0,swings=0;
    while(e.hp>0&&t<1.5){
      if(P.atk<=0){g.attack();swings++}
      g.update(0.05);t+=0.05;
    }
    note.push(names[cls]+' '+swings+' swings '+t.toFixed(2)+'s left '+Math.round(e.hp));
    check(names[cls]+' deletes an Act I Tick', e.hp<=0, 'left '+e.hp+' after '+t.toFixed(2)+'s');
  }

  /* Lunch pail still feeds a hireling who is in the fight, so the out-of-combat regen stays off. */
  {
    const {G,P,W}=boot('scrapper');
    G.sk[9]=1;g.calc();
    G.merc={k:'guard',name:'Kit',hp:80,dead:false};
    W.merc={x:P.x+0.3,y:P.y,r:.28,hp:20,max:80,cd:9,haste:0,ph:0,flash:0,swing:0};
    const foe=tickNear(P,1.2);foe.aggro=true;
    W.allies.push({k:'pail',x:P.x,y:P.y,hp:G.hp,max:g.S.maxHp,rate:0.024,life:99,r:.2});
    const before=W.merc.hp;
    for(let i=0;i<20;i++)g.update(0.05);
    check('lunch pail heals the hireling', W.merc.hp>before+1, before+' -> '+W.merc.hp);
  }

  function mercShot(aura){
    const {G,P,W}=boot('maxi');
    g.ACC.maxi=1;G.cls='maxi';G.sk=[0,0,0,aura?1:0,0,0,0,0,0,0,0,0,0,0,0];G.pas=[];g.calc();
    G.merc={k:'guard',name:'Kit',hp:80,dead:false};
    W.merc={x:P.x+0.25,y:P.y,r:.28,hp:80,max:80,cd:0,haste:0,ph:0,flash:0,swing:0,toxL:0};
    const e=g.spawn('tick',W.merc.x+0.45,W.merc.y,{});
    e.stun=99;e.aggro=true;e.mods={};e.hp=e.max=100000;
    if(aura){P.aura={i:3,L:1,t:1};g.maxiAura(0.02)}
    P.atk=9;
    const swing=g.toxicSwing(W.merc);
    const hp=e.hp;g.update(0.05);
    return {dmg:hp-e.hp,swing,tox:W.merc.toxL||0};
  }
  const off=mercShot(0), on=mercShot(1);
  note.push('hireling toxic '+off.dmg.toFixed(2)+' -> '+on.dmg.toFixed(2)+' swing '+on.swing);
  check('hireling in Toxic hits 25% harder at rank 1', off.dmg>0 && Math.abs(on.dmg/off.dmg-1.25)<0.02, off.dmg+' -> '+on.dmg);
  check('hireling swing uses the 18% speed line', Math.abs(on.swing-1.18)<1e-9, String(on.swing));

  {
    const {G,P}=boot('maxi');
    g.ACC.maxi=1;G.cls='maxi';g.calc();
    g.S.dmin=g.S.dmax=100;g.S.shock=0;g.S.crit=0;g.S.dmg=0;
    P.atk=0;g.attack();const ivl0=P.atk;
    P.aura={i:3,L:1,t:1};g.maxiAura(0.02);
    P.atk=0;g.attack();
    check('your own Toxic swing interval stays put', Math.abs(ivl0-P.atk)<1e-6, ivl0+' vs '+P.atk);
  }

  function tagHit(node){
    const {G,P,W}=boot('maxi');
    g.ACC.maxi=1;G.cls='maxi';
    G.sk=[0,0,0,0,0,0,0,1,0,0,node?1:0,0,0,0,0];
    G.pas=node?[10]:[];
    g.calc();
    g.S.dmin=g.S.dmax=100;g.S.shock=0;g.S.crit=0;g.S.dmg=0;
    G.tag={cls:'scrapper',lvl:1,name:'Scrapper',dmg:20,max:80,red:1,sk:[],hp:80,eq:{}};
    W.tag={x:P.x-0.2,y:P.y,r:.3,hp:80,max:80,atk:0,haste:0,dir:{x:1,y:0},ph:0,flash:0,swing:0,armM:1,tag:1,cd:[],sc:[],nodeM:0,toxL:0};
    const e=g.spawn('tick',W.tag.x+0.7,W.tag.y,{});
    e.stun=99;e.aggro=true;e.mods={};e.hp=e.max=100000;
    if(node){P.aura={i:7,L:1,t:1};g.maxiAura(0.02)}
    P.atk=9;
    const hp=e.hp;g.update(0.05);
    return {dmg:hp-e.hp,nodeM:W.tag.nodeM||0,pow:e.hp<hp&&P.aura&&P.aura.t<=0};
  }
  const tagOff=tagHit(0), tagOn=tagHit(1);
  note.push('companion node '+tagOff.dmg.toFixed(2)+' -> '+tagOn.dmg.toFixed(2)+' nodeM '+tagOn.nodeM);
  check('companion receives the full node bonus', tagOff.dmg>0 && Math.abs(tagOn.dmg/tagOff.dmg-1.08)<0.03, tagOff.dmg+' -> '+tagOn.dmg);
  check('that bonus is the ally figure, not a second copy', Math.abs(tagOn.nodeM-1.08)<1e-9, String(tagOn.nodeM));

  function mercNode(node){
    const {G,P,W}=boot('maxi');
    g.ACC.maxi=1;G.cls='maxi';
    G.sk=[0,0,0,0,0,0,0,1,0,0,node?1:0,0,0,0,0];
    G.pas=node?[10]:[];
    g.calc();
    P.aura={i:7,L:1,t:1};
    G.merc={k:'guard',name:'Kit',hp:80,dead:false};
    W.merc={x:P.x+0.25,y:P.y,r:.28,hp:80,max:80,cd:0,haste:0,ph:0,flash:0,swing:0};
    const e=g.spawn('tick',W.merc.x+0.45,W.merc.y,{});
    e.stun=99;e.aggro=true;e.mods={};e.hp=e.max=100000;
    g.maxiAura(0.02);
    P.atk=9;
    const hp=e.hp;g.update(0.05);
    return hp-e.hp;
  }
  const mn0=mercNode(0), mn1=mercNode(1);
  note.push('hireling node '+mn0.toFixed(2)+' -> '+mn1.toFixed(2));
  check('hireling node bonus stays a single 8%', mn0>0 && Math.abs(mn1/mn0-1.08)<0.03, mn0+' -> '+mn1);

  {
    const {G,P,W}=boot('maxi');
    g.ACC.maxi=1;G.cls='maxi';g.calc();g.S.crit=0;
    function flat(mark,mkP){
      W.ents.length=0;
      const e=g.spawn('tick',P.x+1,P.y,{});e.hp=e.max=100000;e.stun=99;e.mark=mark||0;e.mkP=mkP||0;e.mods={};
      g.dmgEnemy(e,100,false);return 100000-e.hp;
    }
    const plain=flat(0,0), timed=flat(8,0);
    check('a timed mark is still +30%', Math.abs(timed-130)<0.2 && Math.abs(plain-100)<0.2, plain+' / '+timed);
    function aura(L){
      W.ents.length=0;P.aura={i:4,L:L,t:1};P.mkP=0;
      const e=g.spawn('tick',P.x+1,P.y,{});e.hp=e.max=100000;e.stun=99;e.mods={};e.mark=0;e.mkP=0;
      g.maxiAura(0.02);
      const hp=e.hp;g.dmgEnemy(e,100,false);
      return {dmg:hp-e.hp,mkP:e.mkP||0};
    }
    const a1=aura(1), a10=aura(10);
    note.push('marked L1 '+a1.dmg.toFixed(1)+' (mkP '+a1.mkP+') L10 '+a10.dmg.toFixed(1)+' (mkP '+a10.mkP+')');
    check('rank 1 Marked stays at +30%', Math.abs(a1.dmg-130)<0.2, String(a1.dmg));
    check('rank 10 Marked follows the card, +60%', Math.abs(a10.dmg-160)<0.2, String(a10.dmg));
    check('the rank does not stack on the 30%', a10.dmg<130*1.6, String(a10.dmg));
  }

  {
    const {G,P,W}=boot('scrapper');
    g.S.crit=0;
    W.ents.length=0;
    const a=g.spawn('tick',P.x+1,P.y,{});a.hp=a.max=100000;a.stun=99;a.mods={};
    g.dmgEnemy(a,100,false);const solo=100000-a.hp;
    G.tag={cls:'anon',lvl:1,name:'Anon',dmg:8,max:40,red:1,sk:[],hp:40};
    W.tag={hp:40,max:40,x:P.x,y:P.y,r:.3};
    const b=g.spawn('tick',P.x+1.2,P.y,{});b.hp=b.max=100000;b.stun=99;b.mods={};
    g.dmgEnemy(b,100,false);const party=100000-b.hp;
    check('a living companion still taxes damage by 1.35', Math.abs(solo/party-1.35)<0.02, solo+' / '+party);
  }

  Math.random=rnd0;
  return {fail, note};
});
fail.push(...report.fail);
if(errs.length)fail.push('pageerror: '+errs.slice(0,6).join(' | '));
if(report.note)report.note.forEach(s=>console.log('measure  '+s));
console.log(fail.length?'FAIL\n'+fail.join('\n'):'class-feel ok');
await b.close();
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
