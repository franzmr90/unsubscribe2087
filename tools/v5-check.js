/* V5 party auras as numbers. node tools/v5-check.js
   One page, fake party and hostile stand-ins. No second browser.
   Prints a single-monster hit count with and without Marked to Market.
   That print is a measurement, not a budget. */
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
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
await p.waitForTimeout(400);
await p.evaluate(()=>__g.skipDisc());
await p.waitForTimeout(200);
await p.click('[data-cls=scrapper]');
await p.waitForTimeout(300);
await p.evaluate(()=>{__g.G.pre=2});
await clearUI(p);
await p.evaluate(()=>{
  const G=__g.G;
  G.lvl=24;G.god=true;G.in1=1;G.act2=true;
  for(let i=1;i<=25;i++)G.q['q'+i]=3;
  __g.ACC.maxi=1;__g.calc();
});
await p.evaluate(()=>__g.enter(1));
await clearUI(p);
await p.evaluate(()=>__g.setMode('play'));

const report=await p.evaluate(()=>{
  const fail=[],G=__g.G,P=__g.P,W=__g.W,MP=__g.MP;
  const check=(n,ok,extra)=>{if(!ok)fail.push(n+(extra!==undefined?': '+extra:''))};
  const note=[];
  const wipe=()=>{
    W.ents.length=0;W.fx.length=0;W.projs.length=0;W.merc=null;W.tag=null;
    MP.others.length=0;MP.party=null;MP.hostile={};
    P.aura=null;P.toxL=0;P.mkAura=0;P.haste=0;P.atk=0;P.dash=null;P.mech=0;P.buff=0;
  };
  const mob=(x,y)=>{const e={k:'tick',x:x,y:y,r:.35,hp:800,max:800,dmg:4,spd:1,mark:0,aggro:false,mods:{},flash:0,stun:0,slow:0,ward:0,name:'Tick',hits:0};W.ents.push(e);return e};
  G.cls='maxi';__g.calc();
  G.sk[3]=1;G.sk[4]=0;G.sk[7]=1;G.pas=[10];G.sk[10]=1;__g.calc();
  wipe();

  /* ---- your toxic aura: you keep your swing, the hireling beside you does not ---- */
  P.aura={i:3,L:1,t:1};
  W.merc={x:P.x+.4,y:P.y,hp:20,max:20,r:.28,haste:0,cd:0};
  W.tag={x:P.x-.4,y:P.y,hp:20,max:20,r:.3,haste:0,atk:0};
  __g.maxiAura(.02);
  check('your own toxic aura does not take the ally swing term', !(__g.toxicSwing(P)>1), String(P.toxL));
  P.atk=0;__g.attack();
  const withOwn=P.atk;
  P.aura=null;__g.maxiAura(.02);
  P.atk=0;__g.attack();
  check('your own swing interval is unchanged', Math.abs(withOwn-P.atk)<1e-6, withOwn+' vs '+P.atk);
  P.aura={i:3,L:1,t:1};
  W.merc={x:P.x+.4,y:P.y,hp:20,max:20,r:.28,haste:0,cd:0};
  W.tag={x:P.x-.4,y:P.y,hp:20,max:20,r:.3,haste:0,atk:0};
  __g.maxiAura(.02);
  check('hireling in the aura is hasted', W.merc.haste>=.3, String(W.merc.haste));
  check('hireling swing uses the 15+3 per rank line', Math.abs(__g.toxicSwing(W.merc)-1.18)<1e-9, String(__g.toxicSwing(W.merc)));
  check('tag-along in the aura swings faster too', Math.abs(__g.toxicSwing(W.tag)-1.18)<1e-9);
  W.merc.haste=0;W.merc.x=P.x+9;
  __g.maxiAura(.02);
  check('a hireling outside the patch is not hasted', !(W.merc.haste>0) && !(__g.toxicSwing(W.merc)>1));

  /* ---- a party member's toxic changes your swing, and does not stack a second copy on top of yours ---- */
  wipe();
  G.cls='scrapper';__g.calc();
  P.atk=0;P.mech=0;__g.attack();
  const base=P.atk;
  MP.party={members:[{uid:'ally'}]};
  MP.others.push({uid:'ally',name:'Vale',x:P.x+.6,y:P.y,hp:10,hpm:10,au:3,aL:1,cls:'maxi'});
  __g.maxiAura(.02);
  P.atk=0;__g.attack();
  check('a party toxic aura shortens your swing', P.atk>0 && P.atk<base, base+' -> '+P.atk);
  check('the shorter swing is 18% at rank 1', Math.abs(base/P.atk-1.18)<1e-6, String(base/P.atk));
  check('you are hasted by their toxic aura', P.haste>=.3);
  const ally=MP.others[0];
  check('the ally is not a foe', __g.auraFoes({x:P.x,y:P.y,i:4,L:1}).every(e=>e!==ally));

  /* ---- Marked to Market: the monster, not the ally ---- */
  wipe();
  G.cls='maxi';__g.calc();
  P.aura={i:4,L:1,t:1};
  MP.party={members:[{uid:'ally'}]};
  const friend={uid:'ally',name:'Vale',x:P.x+.5,y:P.y,hp:10,hpm:10,au:null,mark:0};
  MP.others.push(friend);
  const near=mob(P.x+1,P.y);
  const far=mob(P.x+12,P.y);
  const planted={mp:'ally',k:'player',x:P.x+.5,y:P.y,r:.5,hp:40,max:40,mark:0};
  W.ents.push(planted);
  __g.maxiAura(.02);
  check('a monster inside Marked to Market is marked', near.mark>=.4, String(near.mark));
  check('a monster outside it is not', !(far.mark>0));
  check('a party member is not marked', !friend.mark && !(planted.mark>0));
  __g.stateMarks();
  check('the party patch is still only a picture', !!W.fx.find(f=>f.sid==='aura-p0'));

  /* ---- hostile stand-in: offensive half only ---- */
  wipe();
  P.aura={i:3,L:1,t:1};
  MP.hostile={foe:1};
  const stand={mp:'foe',k:'player',x:P.x+.6,y:P.y,r:.55,hp:200,max:200,mark:0,haste:0,name:'Vale'};
  W.ents.push(stand);
  MP.others.push({uid:'foe',name:'Vale',x:stand.x,y:stand.y,hp:200,hpm:200,au:3,cls:'maxi'});
  __g.maxiAura(.02);
  check('toxic does not haste a hostile', !(stand.haste>0));
  check('a hostile toxic aura does not haste you', !(P.toxL>0));
  P.haste=0;P.aura=null;
  MP.others[0].au=4;MP.others[0].aL=1;
  __g.maxiAura(.02);
  check('their Marked to Market marks you', P.mkAura>=.4, String(P.mkAura));
  check('and still does not haste you', !(P.haste>0) && !(P.toxL>0));
  P.aura={i:4,L:1,t:1};stand.mark=0;stand.haste=0;
  __g.maxiAura(.02);
  check('your Marked to Market marks the hostile stand-in', stand.mark>=.4, String(stand.mark));
  check('the stand-in is still not hasted', !(stand.haste>0));

  /* ---- Proof of Work damages the monster and not the ally ---- */
  wipe();
  G.sk[4]=0;P.aura={i:7,L:1,t:0};
  MP.party={members:[{uid:'ally'}]};
  const buddy={mp:'ally',k:'player',x:P.x+.4,y:P.y,r:.5,hp:90,max:90,mark:0};
  const victim=mob(P.x+1,P.y);
  const hp0=victim.hp, allyHp=buddy.hp;
  W.ents.push(buddy);
  __g.maxiAura(.02);
  check('Proof of Work damages the monster', victim.hp<hp0, hp0+' -> '+victim.hp);
  check('Proof of Work does not damage the ally', buddy.hp===allyHp, String(buddy.hp));
  note.push('pow pulse '+(hp0-victim.hp).toFixed(1)+' on one tick at rank 1');

  /* ---- two Maximalists, two auras ---- */
  wipe();
  P.aura={i:3,L:1,t:1};
  MP.party={members:[{uid:'ally'}]};
  MP.others.push({uid:'ally',x:P.x+6,y:P.y,au:4,aL:2,hp:10,hpm:10,cls:'maxi'});
  const byThem=mob(P.x+6.3,P.y);
  const byYou=mob(P.x+.5,P.y);
  __g.maxiAura(.02);
  check('your toxic aura is still on', P.haste>=.3);
  check('their Marked to Market marks a monster beside them', byThem.mark>=.4, String(byThem.mark));
  check('that mark does not spread to a monster beside you', !(byYou.mark>0));

  /* ---- a stranger's aura is still only a picture ---- */
  wipe();
  P.haste=0;
  MP.others.push({uid:'str',x:P.x,y:P.y,au:3,aL:5,hp:10,hpm:10});
  __g.maxiAura(.02);
  check('a stranger does not give you their aura', !(P.toxL>0) && !(P.haste>0));

  /* ---- Running a Node stays half for you and full for an ally ---- */
  wipe();
  G.cls='maxi';__g.calc();G.pas=[10];G.sk[10]=1;P.aura={i:4,L:1,t:1};
  const full=__g.nodeMul(false), half=__g.nodeMul(true);
  check('Running a Node is still full for an ally', Math.abs(full-1.08)<1e-9, String(full));
  check('and half of that bonus for you', Math.abs(half-1.04)<1e-9, String(half));

  /* ---- one monster, marked and unmarked, same hit ---- */
  wipe();
  G.god=true;__g.S.crit=0;P.aura=null;
  function swings(mark){
    const e=mob(P.x+1,P.y);e.hp=e.max=400;e.mark=mark?.4:0;
    let n=0;while(e.hp>0&&n<40){__g.dmgEnemy(e,50,false);n++}
    return n;
  }
  const plain=swings(0), marked=swings(1);
  note.push('hits to kill one tick, 50 a swing: unmarked '+plain+', marked '+marked);
  check('the mark still makes that monster die sooner', marked<plain, plain+' vs '+marked);
  check('pvp scale is untouched', MP.pvpScale===.25, String(MP.pvpScale));
  return {fail, note};
});
fail.push(...report.fail);
if(errs.length)fail.push('pageerror: '+errs.slice(0,6).join(' | '));
if(report.note)report.note.forEach(s=>console.log('measure  '+s));
console.log(fail.length?'FAIL\n'+fail.join('\n'):'v5 ok');
await b.close();
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
