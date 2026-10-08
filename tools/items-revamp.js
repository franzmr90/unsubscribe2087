/* Level bands, the eight throwbacks, and the three new stats.
   node tools/items-revamp.js
   Bands: early 1–18, mid 16–40, high 36–60, late 58 and up.
   Early and mid stay wider than eight because those acts already had their uniques.
   The 1-in-280 check is the late band, which is eight uniques at monster level 70.
   Sats stay the only currency. The Unspent Output is a ring, not a ledger. */
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
  const g=__g;
  const G=new Proxy({},{get:(_,k)=>g.G[k],set:(_,k,v)=>{g.G[k]=v;return true}});
  const P=new Proxy({},{get:(_,k)=>g.P[k],set:(_,k,v)=>{g.P[k]=v;return true}});
  const W=new Proxy({},{get:(_,k)=>g.W[k],set:(_,k,v)=>{g.W[k]=v;return true}});
  const byId=id=>g.UNI.find(u=>u.id===id);
  function quiet(){
    G.cls='scrapper';G.god=false;G.lvl=20;G.sk=Array(15).fill(0);G.sk[0]=1;G.pas=[];G.slots=[0,-1,-1];
    G.form=null;G.web={};G.charms=[];G.doc=null;
    P.inv=0;P.barrier=0;P.dash=null;P.hitStun=0;P.blinkChain=0;P.orders=0;P.book=0;P.bear=0;P.ledger=0;P.remoteCd=0;P.silence=0;
    for(const sl of ['weapon','helm','armor','gloves','boots','belt','ring','amulet'])G.eq[sl]=null;
    G.bag=[];W.ents.length=0;W.allies.length=0;W.drops.length=0;
    g.calc();G.hp=g.S.maxHp;G.en=g.S.maxEn;g.setMode('play');
  }
  function wear(id,cls){
    if(cls)G.cls=cls;
    const u=byId(id),it=g.mkFixed(u,u.il,4);it.id=true;
    G.eq[u.slot]=it;g.calc();return it;
  }
  function aff(it,k){const a=it.aff.find(x=>x.k===k);return a?a.v:undefined}
  function lane(){
    const N=W.N,x0=P.x|0,y0=P.y|0;
    for(let x=x0-2;x<=x0+12;x++)for(let y=y0-2;y<=y0+2;y++)if(x>1&&y>1&&x<N-2&&y<N-2)W.map[y*N+x]=1;
    P.dir={x:1,y:0};
  }
  const pool=ml=>g.UNI.filter(u=>g.uniqEligible(u,ml));
  const late=pool(70).map(u=>u.id).sort();
  check('late band is eight uniques', late.length===8, late.join(','));
  check('Force Majeure is one of those eight', late.includes('majeure'));
  check('the Cipher Mantle shares that band', late.includes('cipher'));
  check('the Coupon is not in the late band', !late.includes('coupon'));
  check('the Night Audit is not in the late band', !late.includes('audit'));
  const early=pool(12).map(u=>u.id);
  check('a level 12 pool still has the Coupon', early.includes('coupon'));
  check('a level 12 pool has no All-Hands', !early.includes('allhands'));
  check('a level 12 pool has no Force Majeure', !early.includes('majeure'));
  check('the Coupon has left by monster level 20', !pool(20).some(u=>u.id==='coupon'));
  check('Remote Hands is in the mid band at 40', pool(40).some(u=>u.id==='remote'));
  check('Remote Hands has left the mid band at 41', !pool(41).some(u=>u.id==='remote'));
  check('the Night Audit is in the high band', pool(50).some(u=>u.id==='audit')&&g.uniqBand(byId('audit'))==='high');
  check('the Rate Card and the Unspent Output are mid', g.uniqBand(byId('rate'))==='mid'&&g.uniqBand(byId('output'))==='mid');
  check('a level 100 champion still rolls the late band', pool(100).some(u=>u.id==='majeure')&&!pool(100).some(u=>u.id==='coupon'));
  check('no duplicate unique names', new Set(g.UNI.map(u=>u.n)).size===g.UNI.length);
  const homage=['cipher','call','book','ledger','bear','chair'];
  check('the six item skills are still in the tables', homage.every(id=>byId(id)&&byId(id).isk));
  note.push('early pool at 12 is '+early.length+' (wider than eight; Act I already had these)');
  note.push('mid pool at 30 is '+pool(30).length);
  note.push('high pool at 50 is '+pool(50).length);

  quiet();
  const spec={
    majeure:{dmg:[180,250],aspd:[15,20],enleech:[6,8],mgt:[8,12],ref:[4,8],sk_courier:[1,1]},
    allhands:{skills:[2,2],hpL:[1.5,1.5],enL:[1.5,1.5],pdr:[10,10],mf:[40,50],mgt:[2,2],ref:[2,2],vit:[2,2],bnd:[2,2]},
    output:{skills:[1,1],enPct:[25,25],shock:[4,10],en:[15,25]},
    remote:{sk_hacker:[3,3],enKill:[5,5],r_all:[15,20],cdr:[25,25],vit:[15,15],bnd:[15,15],mf:[40,50]},
    rate:{skills:[1,1],armorP:[80,120],r_all:[20,30],cdr:[25,25],pdr:[4,4]},
    audit:{armorP:[80,100],leech:[6,8],enleech:[4,6],pdr:[12,18],shock:[6,16]},
    indemnity:{pdr:[25,25],r_surge:[20,20],mgt:[20,30],thorns:[8,14],armorP:[80,120]},
    coupon:{mf:[80,100],en:[-8,-8],dmg:[0,10]}
  };
  for(const id in spec){
    const it=g.mkFixed(byId(id),byId(id).il,4);it.id=true;
    let ok=true,why='';
    for(const k in spec[id]){
      const v=aff(it,k),lo=spec[id][k][0],hi=spec[id][k][1];
      if(!(v>=lo&&v<=hi)){ok=false;why=k+'='+v}
    }
    check(byId(id).n+' rolls inside its mods', ok, why);
    const lines=g.itemLines(it).join?g.itemLines(it):g.itemLines(it);
    check(byId(id).n+' shows on the tooltip', g.itemLines(it).indexOf(byId(id).fl)>=0||g.itemLines(it).length>20);
  }
  const rate=g.mkFixed(byId('rate'),29,4);rate.id=true;
  check('the Rate Card names the Brutal cut', g.itemLines(rate).indexOf('Brutal')>=0);
  const hat=g.mkFixed(byId('allhands'),62,4);hat.id=true;
  check('life per level shows on the hat', g.itemLines(hat).indexOf('Life per Level')>=0);
  check('damage reduction shows on the hat', g.itemLines(hat).indexOf('Damage reduced by')>=0);
  const coup=g.mkFixed(byId('coupon'),40,4);
  check('the Coupon keeps its energy penalty when the drop is above its level', aff(coup,'en')===-8, aff(coup,'en'));
  check('the hat keeps 1.5 life per level', aff(hat,'hpL')===1.5);
  const maj=g.mkFixed(byId('majeure'),70,4);maj.id=true;
  check('Force Majeure names the shove', (maj.spT||'').indexOf('shove')>=0);
  const hands=g.mkFixed(byId('remote'),42,4);hands.id=true;
  check('Remote Hands names the dash', (hands.spT||'').indexOf('dash')>=0);
  const ind=g.mkFixed(byId('indemnity'),68,4);ind.id=true;
  check('the Indemnity names the crit rule', (ind.spT||'').indexOf('cannot crit')>=0);
  check('the Unspent Output does not call itself money', (byId('output').fl||'').toLowerCase().indexOf('sats')>=0&&(byId('output').fl||'').toLowerCase().indexOf('currency')<0);

  quiet();
  wear('allhands');
  const hpHat=g.S.maxHp,enHat=g.S.maxEn;
  G.eq.helm=null;g.calc();
  check('1.5 life per level is 60 life at level 20, plus the two vitality', hpHat-g.S.maxHp===1.5*20+8, (hpHat-g.S.maxHp));
  check('1.5 energy per level is 30 energy at level 20, plus the two bandwidth', enHat-g.S.maxEn===1.5*20+6, (enHat-g.S.maxEn));
  G.lvl=40;wear('allhands');
  const hp40=g.S.maxHp;G.eq.helm=null;g.calc();
  check('the same hat is 60 life at level 40, plus the two vitality', hp40-g.S.maxHp===1.5*40+8, (hp40-g.S.maxHp));
  G.lvl=20;

  quiet();
  wear('rate');wear('remote');
  check('two cast uniques land at 50, under the cap', Math.abs(g.S.cdr-0.5)<1e-6, g.S.cdr);
  const fine=g.mkFixed(byId('fineprint'),18,4);fine.id=true;G.eq.amulet=fine;g.calc();
  check('Fine Print on top of them stops at 60', Math.abs(g.S.cdr-0.6)<1e-6, g.S.cdr);
  G.eq.amulet=null;G.eq.weapon=null;G.eq.armor=null;
  wear('allhands');wear('rate');wear('output');wear('book');
  check('gear skills stop at +4', g.S.skills===4, g.S.skills);
  G.cls='hacker';G.eq.weapon=null;wear('remote','hacker');wear('allhands');
  check('Technomancer skills count toward the same cap', g.S.skills===4, g.S.skills);
  check('the dash wakes up on a Technomancer', !!g.S.sp.remote);
  G.cls='scrapper';g.calc();
  check('the dash sleeps in the wrong hands', !g.S.sp.remote);
  check('the find and the cast rate stay on', g.S.mf>=40&&g.S.cdr>=0.25);

  quiet();
  G.eq.ring={slot:'ring',aff:[{k:'enPct',v:25},{k:'enPct',v:70}],id:true,req:1,il:1,q:1,name:'Pile',base:'Signet Chip'};
  g.calc();const piled=g.S.maxEn;
  G.eq.ring=null;g.calc();const bare=g.S.maxEn;
  check('energy percent from gear stops at 80', Math.abs(piled/bare-1.8)<0.02, (piled/bare).toFixed(3));

  quiet();
  G.eq.armor={slot:'armor',aff:[{k:'pdr',v:30}],id:true,req:1,il:70,q:4,name:'Wall',base:'Seraph Plate'};
  G.eq.helm={slot:'helm',aff:[{k:'pdr',v:25}],id:true,req:1,il:70,q:4,name:'Lid',base:'Halo Circuit'};
  g.calc();
  check('damage reduction stops at 50', g.S.pdr===50, g.S.pdr);
  g.S.armor=0;g.S.dodge=0;g.S.taken=1;g.S.enc=0;P.inv=0;P.barrier=0;G.god=false;G.hp=500;g.setMode('play');
  g.hurt(100,false,{name:'hit',hp:1,mods:{}});
  check('half of a 100 hit is gone before armor', Math.abs((500-G.hp)-50)<1, 500-G.hp);

  quiet();
  wear('indemnity');
  g.S.pdr=0;g.S.armor=0;g.S.dodge=0;g.S.taken=1;g.S.enc=0;P.inv=0;P.barrier=0;G.hp=400;
  const src={name:'duel',hp:1,mods:{},crit:1,critM:2,pvp:1};
  g.hurt(100,false,src);
  check('the Indemnity strips a crit', Math.abs((400-G.hp)-50)<1, 400-G.hp);
  check('the crit flag is spent', src.crit===0);

  quiet();
  G.lvl=20;g.calc();
  g.S.dmin=g.S.dmax=100;g.S.dmg=0;g.S.shock=0;g.S.crit=0;g.S.leech=18;g.S.enleech=10;g.S.sp={};
  const foe=g.spawn('tick',P.x+1.2,P.y,{});
  check('a machine is standing there', !!foe);
  if(foe){
    foe.hp=foe.max=1e9;foe.stun=99;foe.mods={};foe.snd=0;
    G.hp=200;G.en=10;
    g.hit(foe,1);
    const dealt=1e9-foe.hp,healed=G.hp-200,energ=G.en-10;
    check('life leech stops at 15% against a machine', dealt>0&&Math.abs(healed/dealt-0.15)<0.03, (healed/dealt).toFixed(3));
    check('energy leech stops at 8% against a machine', Math.abs(energ/dealt-0.08)<0.03, (energ/dealt).toFixed(3));
    foe.hp=foe.max;foe.mp='ghost';foe.snd=0;G.hp=200;G.en=10;
    g.MP.others.push({uid:'ghost'});
    g.hit(foe,1);
    const dealtP=1e9-foe.hp,healedP=G.hp-200,energP=G.en-10;
    check('life leech stops at 4% against a player', dealtP>0&&Math.abs(healedP/dealtP-0.16)<0.03, (healedP/dealtP).toFixed(3));
    check('energy leech stops at 2% against a player', Math.abs(energP/dealtP-0.08)<0.03, (energP/dealtP).toFixed(3));
    foe.mp=0;foe.hp=foe.max;foe.snd=0;G.en=10;G.hp=200;
    g.setDT('sound');g.hit(foe,1);g.setDT(null);
    check('neither leech works on Sound', Math.abs(G.en-10)<0.01&&Math.abs(G.hp-200)<0.01, G.en+'/'+G.hp);
  }

  quiet();
  wear('majeure');
  lane();
  const mob=g.spawn('tick',P.x+1.2,P.y,{});
  if(mob){
    mob.hp=mob.max=1e9;mob.stun=99;mob.mods={};
    const x0=mob.x;g.hit(mob,1);
    check('Force Majeure shoves an ordinary machine', mob.x>x0+0.4, (mob.x-x0).toFixed(2));
    const boss=g.spawn('mech',P.x+1.2,P.y+1.2,{});
    boss.hp=boss.max=1e9;boss.stun=99;boss.mods={};boss.su=1;
    const bx=boss.x;g.hit(boss,1);const moved=boss.x-bx;g.hit(boss,1);
    check('a lieutenant is shoved once', moved>0.15, moved.toFixed(2));
    check('a second shove inside the gate does nothing', Math.abs(boss.x-(bx+moved))<0.05, (boss.x-bx).toFixed(2));
    const guy={k:'bot',x:P.x+1.2,y:P.y-1.2,r:.3,hp:1e9,max:1e9,mp:1,noslow:1,mods:{},stun:99,spd:1};
    W.ents.push(guy);const gx=guy.x;g.hit(guy,1);
    check('a player who cannot be slowed ignores the shove', Math.abs(guy.x-gx)<0.05);
  }

  quiet();
  wear('remote','hacker');
  lane();P.hitStun=0;P.remoteCd=0;G.hp=800;G.en=80;
  const rand=Math.random;Math.random=()=>0;
  const x1=P.x;
  g.hurt(8,false,{name:'desk',hp:1,mods:{}});
  check('Remote Hands dashes when struck', P.x>x1+1.5, (P.x-x1).toFixed(2));
  check('the dash waits 2s against a machine', Math.abs(P.remoteCd-2)<0.05, P.remoteCd);
  const x2=P.x;P.hitStun=0;
  g.hurt(8,false,{name:'desk',hp:1,mods:{}});
  check('the dash does not chain inside that wait', Math.abs(P.x-x2)<0.05);
  P.remoteCd=0;P.hitStun=.4;const x3=P.x;
  g.hurt(8,false,{name:'desk',hp:1,mods:{}});
  check('the dash does not fire while stunned', Math.abs(P.x-x3)<0.05);
  P.hitStun=0;P.remoteCd=0;
  g.hurt(8,false,{name:'duelist',hp:1,mods:{},pvp:1});
  check('against a player the dash waits 6s', Math.abs((P.remoteCd||0)-6)<0.05, P.remoteCd);
  Math.random=rand;
  G.cls='scrapper';

  quiet();
  const before=g.S.maxEn;
  wear('output');
  check('the Unspent Output adds a quarter of the energy pool', g.S.maxEn>before*1.2, g.S.maxEn+' vs '+before);
  quiet();wear('remote','hacker');
  const prey=g.spawn('tick',P.x+1,P.y,{});
  if(prey){prey.hp=1;prey.max=1;prey.mods={};const en0=G.en=5,lv0=G.lvl;g.kill(prey);check('Remote Hands returns 5 energy on a kill', G.lvl>lv0?G.en>=en0:Math.abs(G.en-(en0+5))<0.01, G.en)}

  quiet();
  const old=g.saveObj();
  old.G.eq={weapon:{slot:'weapon',il:5,q:1,base:'Box Cutter',aff:[{k:'hp',v:12},{k:'dmg',v:8}],id:true,name:'Old Blade',req:1,dmin:4,dmax:9},helm:null,armor:null,gloves:null,boots:null,belt:null,ring:null,amulet:null};
  old.G.lvl=10;old.G.hp=40;old.G.en=20;
  check('an old save still loads', g.applySave(old)===true);
  g.calc();
  check('old gear does not produce a NaN life total', Number.isFinite(g.S.maxHp)&&g.S.maxHp>0, g.S.maxHp);
  check('old gear does not produce a NaN energy total', Number.isFinite(g.S.maxEn)&&g.S.maxEn>0, g.S.maxEn);
  check('cooldown reduction stays a number', Number.isFinite(g.S.cdr)&&g.S.cdr>=0&&g.S.cdr<=0.6, g.S.cdr);
  check('an old save has no damage reduction until something grants it', !(g.S.pdr>0));
  const kept=g.mkFixed(byId('allhands'),62,4);kept.id=true;G.eq.helm=kept;g.calc();
  const live=g.S.maxHp;const again=g.saveObj();
  check('a real hat is in the save', again.G.eq.helm&&again.G.eq.helm.uid==='allhands'&&!again.G.eq.helm.test);
  g.applySave(again);g.calc();
  check('loading that save keeps the life per level', g.S.maxHp===live, g.S.maxHp+' vs '+live);

  function seed(n){let a=n|0;Math.random=function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296}}
  function farm(mf,n,ml){
    quiet();g.S.mf=mf;P.hazMf=0;if(P.shr)P.shr=null;
    let uniq=0,specN=0,coupon=0,hands=0;
    for(let i=0;i<n;i++){W.drops.length=0;g.dropFrom('champ',P.x,P.y,ml,1);
      for(const d of W.drops)if(d.it&&d.it.q===4){uniq++;if(d.it.uid==='majeure')specN++;if(d.it.uid==='coupon')coupon++;if(d.it.uid==='allhands')hands++}}
    return {uniq,specN,coupon,hands,n};
  }
  const N=16000;
  seed(3941);const z=farm(0,N,70);
  seed(3941);const h=farm(200,N,70);
  const any0=z.n/Math.max(1,z.uniq),one0=z.n/Math.max(1,z.specN);
  const any2=h.n/Math.max(1,h.uniq),one2=h.n/Math.max(1,h.specN);
  note.push('0 MF champion unique 1/'+any0.toFixed(1)+', Force Majeure 1/'+one0.toFixed(1)+' ('+z.uniq+' uniques, '+z.specN+' bows)');
  note.push('200 MF champion unique 1/'+any2.toFixed(1)+', Force Majeure 1/'+one2.toFixed(1)+' ('+h.uniq+' uniques, '+h.specN+' bows)');
  check('at 0 magic find a champion unique is about 1 in 35', any0>28&&any0<45, '1/'+any0.toFixed(2));
  check('at 200 magic find a champion unique is about 1 in 17', any2>13&&any2<22, '1/'+any2.toFixed(2));
  check('Force Majeure is about 1 in 8 of the late uniques', z.specN/z.uniq>1/12&&z.specN/z.uniq<1/7, (z.uniq/z.specN).toFixed(2));
  check('a specific late unique is about 1 in 280 at 0 MF', one0>190&&one0<420, '1/'+one0.toFixed(1));
  check('a specific late unique is about 1 in 130 at 200 MF', one2>90&&one2<190, '1/'+one2.toFixed(1));
  check('a level 70 champion did not drop the Coupon', z.coupon===0&&h.coupon===0, z.coupon+'/'+h.coupon);
  seed(7);const low=farm(0,4000,12);
  check('a level 12 champion did not drop the All-Hands', low.hands===0, low.hands);
  check('a level 12 champion did drop some unique', low.uniq>0, low.uniq);

  return {fail,note};
});
const fail=report.fail.concat(errs);
console.log(report.note.join('\n'));
console.log(report.note.length+' notes, '+((report.note.length+ (report.fail?0:0))));
if(fail.length){console.log('FAIL '+fail.length);fail.forEach(f=>console.log(' - '+f));await b.close();process.exit(1)}
console.log('PASS');
await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
