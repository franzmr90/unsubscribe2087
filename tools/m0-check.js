/* Milestone 0 checks, one class at a time.
   node tools/m0-check.js scrapper
   Loads dist/unsubscribe.html the same way smoke does. Calls __g.skipDisc() before driving. */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const cls=process.argv[2]||'scrapper';
const root=path.join(__dirname,'..');

async function clearUI(p){
  for(let i=0;i<20;i++){
    const st=await p.evaluate(()=>{
      const s=document.getElementById('scene');
      if(s&&!s.hidden){document.getElementById('scSkip').click();return 'scene'}
      const d=document.getElementById('dlg');
      if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x){x.click();return 'dlg'}return 'locked'}
      return 'clear'});
    if(st==='clear')return;
    await p.waitForTimeout(st==='locked'?350:180);
  }
  throw new Error('overlays did not clear');
}

(async()=>{
if(cls!=='scrapper'){console.error('no milestone 0 checks for '+cls+' yet');process.exit(1)}
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:390,height:800}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8')+'</body></html>');
await p.waitForTimeout(400);
await p.evaluate(()=>__g.skipDisc());
await p.waitForTimeout(200);
const tree=await p.evaluate(()=>{
  const s=__g.CLS.scrapper.sk,h=__g.CLS.hacker.sk,fail=[];
  const names=s.map(x=>x.n);
  for(const n of ['Lunch Pail','Seniority','Hold the Line','Call the Strike','Two-Handed','Last Shift'])if(!names.includes(n))fail.push('missing '+n);
  for(const n of ['Sparks Fly','Second Wind','Intimidation','Backpay','Veteran','Last Stand'])if(names.includes(n))fail.push('boon name still on scrapper: '+n);
  if(s.length!==15)fail.push('scrapper length '+s.length);
  if(s.some(x=>x.boon))fail.push('scrapper still has a boon field');
  if(s.filter(x=>x.a).length<4)fail.push('scrapper rows 4-5 should be mostly actives');
  if(!h[9]||h[9].boon!=='strike'||!h[14]||h[14].boon!=='guardian')fail.push('hacker should still be on the boon loop');
  try{s.forEach(sk=>sk.d(3))}catch(e){fail.push('tooltip threw '+e.message)}
  return fail});
if(tree.length){console.error(tree.join('\n'));await b.close();process.exit(1)}
await p.click('[data-cls=scrapper]');
await p.waitForTimeout(300);
await p.evaluate(()=>{const G=__g.G;G.pre=2});
await clearUI(p);
const play=await p.evaluate(()=>{
  const G=__g.G,fail=[];
  G.lvl=60;G.act2=true;G.act3=true;G.sats=40;G.sp=40;G.god=false;
  for(let i=1;i<=25;i++)G.q['q'+i]=3;
  G.in1=1;__g.calc();G.hp=__g.S.maxHp;G.en=__g.S.maxEn;
  if(__g.mode!=='play')fail.push('not in play after intro, mode '+__g.mode);
  if(!G.boonRefund||!G.boonRefund.scrapper)fail.push('a new scrapper should carry the refund flag');
  if((__g.G.sp||0)<40)fail.push('new game refund touched the point pool');
  return fail});
if(play.length){console.error(play.join('\n'));await b.close();process.exit(1)}
await p.evaluate(()=>__g.enter(1));
await clearUI(p);

const combat=await p.evaluate(()=>{
  const fail=[],G=__g.G,P=__g.P,W=__g.W,S=__g.S;
  const check=(n,ok,extra)=>{if(!ok)fail.push(n+(extra!==undefined?': '+extra:''))};
  function park(){
    const N=W.N;
    for(const rad of [3,2]){
      for(let y=rad+1;y<N-rad-1;y++)for(let x=rad+1;x<N-rad-1;x++){
        let ok=true;
        for(let dy=-rad;dy<=rad&&ok;dy++)for(let dx=-rad;dx<=rad;dx++)if(W.map[(y+dy)*N+(x+dx)]!==1)ok=false;
        if(ok){P.x=x+.5;P.y=y+.5;P.dir={x:1,y:0};return true}}
    }
    return false}
  check('open floor',park());
  W.ents.length=0;W.projs.length=0;W.fx.length=0;W.allies.length=0;
  G.sk=[1,0,0,0,0,0,0,0,0,1,0,0,0,0,0];G.pas=[];G.slots=[9,-1,-1];__g.calc();
  const e=__g.spawn('bot',P.x+3,P.y,{});
  check('spawn for bolt',!!e);
  if(e){e.stun=100;e.aggro=false;const hp=e.hp;
    for(let i=0;i<240;i++)__g.update(1/60);
    check('old bolt did not fire',e.hp===hp&&!W.fx.some(f=>f.k==='bolt'),'hp '+e.hp+'/'+hp);
    check('index 9 is not a passive bolt',!W.allies.some(a=>a.k==='pail'));
    W.ents.splice(0,W.ents.length)}
  /* Seniority: the type on the weapon, and only that type. */
  G.eq.weapon={slot:'weapon',q:0,dmin:2,dmax:4,aff:[],dt:'heat'};
  G.sk[10]=1;G.pas=[10];__g.calc();
  check('seniority heat',S.t_heat===6,'t_heat '+S.t_heat);
  G.eq.weapon.dt='rust';__g.calc();
  check('seniority rust',S.t_rust===6&&!S.t_heat,'t_rust '+S.t_rust+' t_heat '+S.t_heat);
  /* Hold the Line: standing still is armour, applied when hit. */
  G.sk[11]=1;if(!G.pas.includes(11))G.pas.push(11);__g.calc();
  P.inv=0;P.dash=null;P.guard=0;P.shr=null;P.lastShift=0;P.two=null;G.god=false;
  G.hp=S.maxHp;P.lineT=0;__g.hurt(80);const d0=S.maxHp-G.hp;
  G.hp=S.maxHp;P.lineT=6;__g.hurt(80);const d1=S.maxHp-G.hp;
  check('hold the line reduces a hit',d1<d0,'still '+d0+' vs line '+d1);
  function arm(i){G.sk[i]=Math.max(1,G.sk[i]||0);G.slots[0]=i;P.cd[i]=0;P.dash=null;P.silence=0;G.en=S.maxEn;if(!__g.CLS.scrapper.sk[i].a){if(!G.pas.includes(i))G.pas.push(i)}__g.calc()}
  arm(9);W.allies.length=0;__g.cast(0);
  const pail=W.allies.find(a=>a.k==='pail');
  check('lunch pail exists',!!pail);
  if(pail){const pool=pail.hp;G.hp=S.maxHp*.5;for(let i=0;i<60;i++)__g.update(1/60);
    check('lunch pail spends its stores',pail.hp<pool&&G.hp>S.maxHp*.5,'pool '+pool+' -> '+pail.hp+' hp '+G.hp)}
  W.allies.length=0;W.ents.length=0;
  const foe=__g.spawn('bot',P.x+1.6,P.y,{});
  check('strike target',!!foe);
  if(foe){foe.stun=30;const d=Math.hypot(foe.x-P.x,foe.y-P.y);arm(12);__g.cast(0);
    const d2=Math.hypot(foe.x-P.x,foe.y-P.y);
    check('call the strike pushes',d2>d+.8,'from '+d.toFixed(2)+' to '+d2.toFixed(2));
    check('call the strike is noise',foe.lt==='noise',foe.lt);
    W.ents.length=0}
  const elite=__g.spawn('bot',P.x+2,P.y,{champ:1});
  if(elite){elite.stun=30;const d=Math.hypot(elite.x-P.x,elite.y-P.y);arm(12);__g.cast(0);
    const d2=Math.hypot(elite.x-P.x,elite.y-P.y);
    check('call the strike pulls an elite',d2<d-.4,'from '+d.toFixed(2)+' to '+d2.toFixed(2));
    W.ents.length=0}
  const wide=__g.spawn('bot',P.x+2.25,P.y,{});
  if(wide){wide.stun=30;P.atk=0;P.two=null;const hp=wide.hp;__g.attack();
    check('a normal swing misses at that range',wide.hp===hp);
    arm(13);__g.cast(0);check('two-handed stance',P.two&&P.two.n===3);
    P.atk=0;__g.attack();
    check('two-handed reaches farther',wide.hp<hp,'hp '+wide.hp+'/'+hp);
    check('two-handed spends a swing',!P.two||P.two.n===2);
    W.ents.length=0}
  arm(14);__g.cast(0);check('last shift is up',P.lastShift>3,P.lastShift);
  P.inv=0;G.god=false;G.hp=1;P.guard=0;__g.hurt(1e6);
  check('last shift does not save you',__g.mode==='dying'&&G.hp<=0,'mode '+__g.mode+' hp '+G.hp);
  check('guardian toast stayed quiet',!document.getElementById('log').textContent.includes('saves you'));
  __g.setMode('play');G.hp=S.maxHp;G.en=S.maxEn;
  return fail});
if(combat.length){console.error('COMBAT\n'+combat.join('\n'));errs.push(...combat)}

await clearUI(p);
const sheets=await p.evaluate(()=>{
  const fail=[];
  if(__g.mode!=='play')fail.push('mode '+__g.mode+' before sheets');
  __g.openSheet('skills');
  const html=document.getElementById('sheetIn').innerHTML;
  for(const n of ['Lunch Pail','Seniority','Hold the Line','Call the Strike','Two-Handed','Last Shift','Picket Line','Wildcat','Mutual Aid'])if(!html.includes(n))fail.push('skills sheet missing '+n);
  for(const n of ['Sparks Fly','Veteran','Last Stand'])if(html.includes(n))fail.push('skills sheet still shows '+n);
  __g.closeSheet();
  __g.openSheet('shift');
  document.querySelector('[data-shiftp=scrapper]').click();
  const pop=document.getElementById('pop').innerHTML;
  for(const n of ['Wrecking Crew','Immovable Object','Scrap Thrower','Two-Handed','Last Shift','Call the Strike'])if(!pop.includes(n))fail.push('builds missing '+n);
  __g.closeSheet();
  return fail});
if(sheets.length){console.error('SHEETS\n'+sheets.join('\n'));errs.push(...sheets)}

async function shift(arg){
  await p.evaluate(a=>__g.shapeShift(a[0],a[1]),arg);
  await clearUI(p);
}
await shift(['courier',0]);
await shift(['scrapper','crew']);
const built=await p.evaluate(()=>{
  const G=__g.G,fail=[],sk=__g.CLS.scrapper.sk;
  if(G.cls!=='scrapper')fail.push('class '+G.cls);
  if(!(G.sk[13]>0))fail.push('crew did not take Two-Handed');
  if(!G.slots.includes(13))fail.push('crew buttons '+G.slots.join(','));
  if(!G.pas.includes(11)&&!G.pas.includes(10))fail.push('crew passives '+G.pas.join(','));
  if(G.slots.some(i=>i>=0&&!sk[i]))fail.push('button points at a missing skill');
  return fail});
if(built.length){console.error('BUILD\n'+built.join('\n'));errs.push(...built)}
await shift(['courier',0]);
const back=await p.evaluate(()=>__g.G.cls);
if(back!=='courier'){console.error('did not shift back, cls '+back);errs.push('shift back')}

const refund=await p.evaluate(()=>{
  const fail=[],eq={weapon:null,helm:null,armor:null,gloves:null,boots:null,belt:null,ring:null,amulet:null};
  const base=cls=>({v:2,cls,lvl:40,xp:0,sp:4,ap:0,at:{mgt:0,ref:0,vit:0,bnd:0},hp:80,en:20,credits:10,cpi:1,stims:1,bag:[],eq,unlocked:20,q:{},sats:0,slots:[9,12,0],pas:[10,11]});
  const raw=base('scrapper');raw.sk=[1,2,0,0,0,0,0,0,3,2,3,4,1,5,6];
  const low=raw.sk.slice(0,9).join();
  __g.applySave({G:JSON.parse(JSON.stringify(raw))});
  const G=__g.G;
  if(G.sp!==4+21)fail.push('refunded sp '+G.sp);
  if(G.sk.slice(9).some(n=>n!==0))fail.push('indices 9-14 not cleared '+G.sk.slice(9).join(','));
  if(G.sk.slice(0,9).join()!==low)fail.push('rows 1-3 changed');
  if(!G.boonRefund||G.boonRefund.scrapper!==1)fail.push('flag '+JSON.stringify(G.boonRefund));
  if(G.slots[0]!==-1||G.slots[1]!==-1||G.slots[2]!==0)fail.push('slots '+G.slots.join(','));
  if((G.pas||[]).some(i=>i>=9))fail.push('pas '+G.pas);
  if(!document.getElementById('log').textContent.includes('The old boons were withdrawn and the points returned.'))fail.push('no refund toast');
  const sp=G.sp,sk=G.sk.join();
  __g.applySave({G:JSON.parse(JSON.stringify(G))});
  if(__g.G.sp!==sp||__g.G.sk.join()!==sk)fail.push('refunded twice');
  const hk=base('hacker');hk.sk=[1,0,0,0,0,0,0,0,0,4,2,2,2,2,2];
  __g.applySave({G:JSON.parse(JSON.stringify(hk))});
  if(__g.G.sk[9]!==4)fail.push('hacker boon points were taken');
  if(__g.G.boonRefund&&__g.G.boonRefund.hacker)fail.push('hacker was marked refunded');
  return fail});
if(refund.length){console.error('REFUND\n'+refund.join('\n'));errs.push(...refund)}

console.log(errs.length?'ERRORS:\n'+errs.slice(0,20).join('\n'):'scrapper milestone 0 checks passed');
await b.close();
process.exit(errs.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
