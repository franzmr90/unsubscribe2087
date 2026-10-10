/* Item-bound skills.
   node tools/item-skills.js
   Test gear: on the hero sheet, "Test gear", or __g.tryGear(id) once a wanderer is in the world.
   A test copy is marked test:1. saveObj, the lockbox, sales, and scrap leave it out.
   A real drop of the same unique is not marked and saves as usual.
   Teleport is a short blink (6.5 paces). It stops at walls, hedges, and any tile that is not floor.
   It costs 14 energy, 26 if another blink landed within 2.4s, waits 0.85s, and will not cast during the brief after a hit. */
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
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:1280,height:800}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
await p.waitForTimeout(300);
await p.evaluate(()=>__g.skipDisc());
await p.waitForTimeout(150);
await p.click('[data-cls=scrapper]');
await p.waitForTimeout(200);
await p.evaluate(()=>{__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1});
await clearUI(p);
await p.evaluate(()=>__g.enter(1));
await clearUI(p);
await p.evaluate(()=>__g.setMode('play'));

const report=await p.evaluate(()=>{
  const fail=[],note=[];
  const check=(n,ok,extra)=>{if(!ok)fail.push(n+(extra!==undefined?': '+extra:''));else note.push(n)};
  const g=__g,G=g.G;
  const P=new Proxy({},{get:(_,k)=>g.P[k],set:(_,k,v)=>{g.P[k]=v;return true}});
  const W=new Proxy({},{get:(_,k)=>g.W[k],set:(_,k,v)=>{g.W[k]=v;return true}});
  function quiet(){
    G.god=false;G.lvl=20;G.sk=Array(15).fill(0);G.sk[0]=1;G.pas=[];G.slots=[0,-1,-1];
    G.form=null;P.inv=0;P.barrier=0;P.dash=null;P.hitStun=0;P.blinkChain=0;P.blinkAt=null;P.orders=0;P.book=0;P.bear=0;P.ledger=0;P.silence=0;P.castWait=0;
    for(const sl of ['weapon','helm','armor','gloves','boots','belt','ring','amulet'])G.eq[sl]=null;
    G.bag=[];W.ents.length=0;W.allies.length=0;W.merc=null;W.projs.length=0;
    g.ensureMouse();G.mouse={L:-1,R:0};G.hot=[null,null,null,null,null,null,null,null];
    g.calc();G.hp=g.S.maxHp;G.en=g.S.maxEn;g.setMode('play');
  }
  function openTile(){
    const N=W.N;
    for(let y=4;y<N-4;y++)for(let x=4;x<N-4;x++){
      let ok=true;
      for(let j=-2;j<=2;j++)for(let i=-2;i<=2;i++)if(W.map[(y+j)*N+(x+i)]!==1)ok=false;
      if(ok)return {x:x+.5,y:y+.5};
    }
    return {x:P.x,y:P.y};
  }
  function lane(n){
    const N=W.N,spot=openTile();
    P.x=spot.x;P.y=spot.y;P.dir={x:1,y:0};
    const x0=P.x|0,y0=P.y|0;
    for(let x=x0-1;x<=x0+(n||16);x++)for(let y=y0-1;y<=y0+1;y++)if(x>1&&y>1&&x<N-2&&y<N-2)W.map[y*N+x]=1;
    if(W.allies)W.allies=W.allies.filter(a=>a.k!=='hedge');
    return spot;
  }

  check('six item skills', g.ISK&&Object.keys(g.ISK).length===6);
  const homage=['The Cipher Mantle','The Standing Call','The Open Book','The Quiet Ledger','The Bear Market','The Spare Chair'];const anchors=['Force Majeure','The All-Hands','The Unspent Output','Remote Hands','The Rate Card','The Night Audit','The Indemnity','The Coupon'];check('homage names do not collide with the anchors', !homage.some(n=>anchors.includes(n))&&new Set(g.UNI.map(u=>u.n)).size===g.UNI.length);
  const ids=['cipher','call','book','ledger','bear','chair'];
  check('six homage uniques', ids.every(id=>g.UNI.some(u=>u.id===id)));

  quiet();
  const it=g.tryGear('cipher');
  check('cipher equips', G.eq.armor&&G.eq.armor.uid==='cipher'&&G.eq.armor.test===1);
  check('tooltip names the item skill', g.itemLines(G.eq.armor).indexOf('+1 to Teleport (item skill)')>=0);
  check('damage reduction shows', g.itemLines(G.eq.armor).indexOf('Damage reduced by')>=0);
  check('might per level shows', g.itemLines(G.eq.armor).indexOf('Might per level')>=0);
  check('skill is on while worn', g.itemSkillOn(100)&&g.learnedAct(100)&&g.leftOk(100));
  check('other item skills are not on the left button', !g.leftOk(101));
  G.mouse.L=100;G.hot[0]=100;G.slots[1]=100;
  G.eq.armor=null;g.calc();
  check('unequip clears the skill', !g.itemSkillOn(100)&&!g.learnedAct(100));
  check('unequip clears left, hotkey, and thumb', G.mouse.L===-1&&G.hot[0]===null&&G.slots[1]===-1);

  quiet();
  g.tryGear('cipher');
  lane(16);
  const x0=P.x,en0=G.en;
  g.castIndex(100);
  const moved=P.x-x0;
  check('teleport blinks forward', moved>4&&moved<=6.6, moved.toFixed(2));
  check('teleport spends 14', Math.abs((en0-G.en)-14)<.01, (en0-G.en).toFixed(2));
  check('teleport cooldown', P.cd[100]>0.8&&P.cd[100]<=0.85, P.cd[100]);
  const en1=G.en;g.castIndex(100);
  check('cooldown blocks a second blink', Math.abs(G.en-en1)<.01);
  P.x=x0;P.y=P.y;P.cd[100]=0;P.blinkChain=2;const en2=G.en;P.dir={x:1,y:0};
  g.castIndex(100);
  check('a chained blink costs 26', Math.abs((en2-G.en)-26)<.01, (en2-G.en).toFixed(2));

  quiet();g.tryGear('cipher');
  lane(16);P.hitStun=.4;
  const xs=P.x;g.castIndex(100);
  check('a fresh hit blocks teleport', Math.abs(P.x-xs)<.05);
  P.hitStun=0;P.cd[100]=0;
  const tx=P.x|0,ty=P.y|0;
  W.map[ty*W.N+(tx+3)]=0;
  P.blinkAt={x:P.x+6,y:P.y};g.castIndex(100);P.blinkAt=null;
  check('a wall stops the blink', (P.x|0)<=tx+2, 'landed '+(P.x|0)+' from '+tx);
  check('the blink does not cross the wall', W.map[ty*W.N+(tx+3)]===0&&(P.x|0)<tx+3);

  quiet();g.tryGear('cipher');
  lane(16);P.cd[100]=0;P.hitStun=0;P.blinkChain=0;
  W.allies.push({k:'hedge',life:20,x:P.x+1.2,y:P.y,r:.42});
  P.blinkAt={x:P.x+5,y:P.y};const xh=P.x;g.castIndex(100);
  check('a hedge stops the blink', P.x<xh+1.2, P.x.toFixed(2)+' from '+xh.toFixed(2));

  quiet();g.tryGear('cipher');
  g.enter(3);g.setMode('play');
  const cage=W.objs.find(o=>o.k==='cage'&&!o.used);
  check('the cage is on the map', !!cage);
  if(cage){
    P.x=cage.x-1.2;P.y=cage.y;P.cd[100]=0;P.hitStun=0;P.blinkChain=0;G.en=999;
    if(!W.ents.some(e=>e.su))W.ents.push({su:1,hp:10,k:'mech',x:cage.x,y:cage.y,r:.4});
    P.blinkAt={x:cage.x,y:cage.y};g.castIndex(100);
    const tile=W.map[(cage.y|0)*W.N+(cage.x|0)];
    check('sealed cage tile is not floor', tile!==1, tile);
    check('teleport does not land on the cage', Math.hypot(P.x-cage.x,P.y-cage.y)>0.45, Math.hypot(P.x-cage.x,P.y-cage.y).toFixed(2));
  }

  quiet();
  g.enter(1);g.setMode('play');
  g.tryGear('call');
  const ally={hp:100,max:100,x:P.x+1,y:P.y,r:.3,orders:0};
  W.allies.push(ally);
  const hp0=G.hp=g.S.maxHp;
  g.castIndex(101);
  check('standing call raises life', g.S.maxHp>hp0, g.S.maxHp+' vs '+hp0);
  check('standing call reaches a nearby ally', ally.orders>0);
  const before=ally.hp;g.hurtAlly(ally,50,null);
  check('the shout softens a hit on the ally', ally.hp>before-50, (before-ally.hp).toFixed(1));

  quiet();g.tryGear('book');
  g.S.dmin=g.S.dmax=100;g.S.shock=0;g.S.dmg=0;g.S.crit=0;P.book=0;P.bear=0;
  const foe=g.spawn('tick',P.x+1,P.y,{});foe.hp=foe.max=1e9;foe.stun=99;foe.mods={};
  g.hit(foe,1);const plain=foe.max-foe.hp;foe.hp=foe.max;P.book=8;
  g.hit(foe,1);const buffed=foe.max-foe.hp;
  check('open book adds 8% against a machine', Math.abs(buffed/plain-1.08)<0.02, (buffed/plain).toFixed(3));
  foe.mp=1;foe.hp=foe.max;const pv0=foe.hp;
  g.hit(foe,1);const pvb=pv0-foe.hp;foe.hp=foe.max;P.book=0;g.hit(foe,1);const pvn=foe.max-foe.hp;
  check('open book does not add that against a player', Math.abs(pvb-pvn)<1, pvb+' vs '+pvn);

  quiet();g.tryGear('ledger');
  G.en=10;P.ledger=1;g.itemSkillTick(1);
  check('quiet ledger restores energy', G.en>17&&G.en<20, G.en);

  quiet();g.tryGear('bear');g.tryGear('cipher');
  /* These uniques carry level and Might gates, and gearLive() leaves gear that does
     not meet them out of the pool, so an ungeared level-20 hero reads 0 armour from
     them. Meet the gates for this block, then put the hero back. */
  const atBear=Object.assign({},G.at||{}),lvlBear=G.lvl;
  G.lvl=70;G.at=Object.assign({},G.at,{mgt:90,ref:90,vit:90,bnd:90});
  const arm0=g.S.armor;P.bear=0;g.calc();const armBase=g.S.armor;
  g.castIndex(104);
  check('bear market thickens armor', g.S.armor>armBase, g.S.armor+' vs '+armBase);
  G.en=999;P.cd[100]=0;P.hitStun=0;const xb=P.x;g.castIndex(100);
  check('bear market blocks other item skills', Math.abs(P.x-xb)<.05);
  P.cd[104]=0;g.castIndex(104);
  check('casting the bear again sheds it', !(P.bear>0));
  G.at=atBear;G.lvl=lvlBear;g.calc();

  quiet();g.tryGear('chair');
  const n0=W.allies.length;g.castIndex(105);
  const chair=W.allies.find(a=>a.kind==='chair');
  check('spare chair summons one colleague', !!chair&&W.allies.filter(a=>a.kind==='chair').length===1);
  check('the chair does not stay forever', chair&&chair.life>0&&chair.life<=18, chair&&chair.life);

  quiet();g.tryGear('cipher');
  /* The Cipher Mantle's per:{mgt:.25} is a quarter point of Might for each level,
     applied in itemOwnStats. Might reaches a blow through blowSpec() when the hit
     lands, not through S.dmg, which only sums the dmg affix -- and this coat has
     none. So read the Might the coat grants. */
  const atCip=Object.assign({},G.at||{});
  G.lvl=60;G.at=Object.assign({},G.at,{mgt:90,ref:90,vit:90,bnd:90});
  g.calc();
  const withPer=g.attrSum?g.attrSum('mgt'):((G.at.mgt||0)+(g.S.mgt||0));
  G.eq.armor=null;g.calc();
  const without=g.attrSum?g.attrSum('mgt'):((G.at.mgt||0)+(g.S.mgt||0));
  check('a per-level coat reaches the hero\'s Might', withPer>without, withPer+' vs '+without);
  G.at=atCip;G.lvl=20;g.calc();

  quiet();
  g.S.pdr=50;g.S.armor=0;g.S.dodge=0;g.S.taken=1;g.S.enc=0;P.inv=0;G.god=false;G.hp=500;
  g.hurt(100,false,{name:'hit',hp:1,mods:{}});
  check('damage reduction caps at half', Math.abs((500-G.hp)-50)<1, 500-G.hp);

  quiet();g.tryGear('cipher');
  const snap=g.saveObj();
  check('a test copy is off the save', !snap.G.eq.armor);
  check('the test copy is still worn', G.eq.armor&&G.eq.armor.test===1);
  check('test gear has no sale price', g.sellValue?g.sellValue(G.eq.armor)===0:G.eq.armor.val===0);
  const real=g.mkFixed(g.UNI.find(u=>u.id==='cipher'),66,4);real.id=true;
  G.eq.armor=real;const snap2=g.saveObj();
  check('a real cipher saves', snap2.G.eq.armor&&snap2.G.eq.armor.uid==='cipher'&&!snap2.G.eq.armor.test);

  quiet();g.tryGear('cipher');
  g.openSheet('skills');
  const sheet=document.getElementById('sheetIn').innerHTML;
  check('the skill sheet lists Teleport', sheet.indexOf('Teleport')>=0&&sheet.indexOf('item skill')>=0, 'on='+g.itemSkillOn(100)+' uid='+(G.eq.armor&&G.eq.armor.uid)+' pane='+(sheet.indexOf('Item skills')>=0));
  g.closeSheet();
  g.assignMouse('L',100);g.hotBind(2,100);
  check('left button and F3 take Teleport', G.mouse.L===100&&G.hot[2]===100);
  g.openPick('R');
  const pick=document.getElementById('mPick').innerHTML;
  check('the right list does not offer Teleport', pick.indexOf('Teleport')<0);
  g.openPick('L');
  const pickL=document.getElementById('mPick').innerHTML;
  check('the left list offers Teleport', pickL.indexOf('Teleport')>=0);
  const box=document.getElementById('mPick');if(box)box.hidden=true;

  return {fail,note,errs:[]};
});

const fail=report.fail.concat(errs);
console.log(report.note.length+' checks passed');
if(fail.length){console.log('FAIL');fail.forEach(f=>console.log(' - '+f));await b.close();process.exit(1)}
console.log('PASS');
await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
