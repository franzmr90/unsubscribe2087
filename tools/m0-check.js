/* Milestone 0 checks, one class at a time.
   node tools/m0-check.js scrapper
   node tools/m0-check.js hacker
   node tools/m0-check.js courier
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
if(cls!=='scrapper'&&cls!=='hacker'&&cls!=='courier'){console.error('no milestone 0 checks for '+cls+' yet');process.exit(1)}
if(cls==='hacker'){await runHacker();return}
if(cls==='courier'){await runCourier();return}
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:390,height:800}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8')+'</body></html>');
await p.waitForTimeout(400);
await p.evaluate(()=>__g.skipDisc());
await p.waitForTimeout(200);
const tree=await p.evaluate(()=>{
  const s=__g.CLS.scrapper.sk,c=__g.CLS.anon.sk,fail=[];
  const names=s.map(x=>x.n);
  for(const n of ['Lunch Pail','Seniority','Hold the Line','Call the Strike','Two-Handed','Last Shift'])if(!names.includes(n))fail.push('missing '+n);
  for(const n of ['Sparks Fly','Second Wind','Intimidation','Backpay','Veteran','Last Stand'])if(names.includes(n))fail.push('boon name still on scrapper: '+n);
  if(s.length!==15)fail.push('scrapper length '+s.length);
  if(s.some(x=>x.boon))fail.push('scrapper still has a boon field');
  if(s.filter(x=>x.a).length<4)fail.push('scrapper rows 4-5 should be mostly actives');
  if(!c[9]||c[9].boon!=='strike'||!c[14]||c[14].boon!=='guardian')fail.push('anon should still be on the boon loop');
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
  const fail=[],G=__g.G,P=__g.P,W=__g.W;
  __g.ACC.maxi=1;__g.setMode('play');
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
  check('seniority heat',__g.S.t_heat===6,'t_heat '+__g.S.t_heat+' pas '+G.pas+' sk '+G.sk[10]);
  G.eq.weapon.dt='rust';__g.calc();
  check('seniority rust',__g.S.t_rust===6&&!__g.S.t_heat,'t_rust '+__g.S.t_rust+' t_heat '+__g.S.t_heat);
  /* Hold the Line: standing still is armour, applied when hit. */
  G.sk[11]=1;if(!G.pas.includes(11))G.pas.push(11);__g.calc();
  P.inv=0;P.dash=null;P.guard=0;P.shr=null;P.lastShift=0;P.two=null;G.god=false;__g.setMode('play');
  G.hp=__g.S.maxHp;P.lineT=0;__g.hurt(80);const d0=__g.S.maxHp-G.hp;
  G.hp=__g.S.maxHp;P.lineT=6;__g.hurt(80);const d1=__g.S.maxHp-G.hp;
  check('hold the line reduces a hit',d1<d0,'still '+d0+' vs line '+d1);
  function arm(i){G.sk[i]=Math.max(1,G.sk[i]||0);G.slots[0]=i;P.cd[i]=0;P.dash=null;P.silence=0;__g.setMode('play');G.en=__g.S.maxEn;if(!__g.CLS.scrapper.sk[i].a){if(!G.pas.includes(i))G.pas.push(i)}__g.calc();G.en=__g.S.maxEn}
  arm(9);W.allies.length=0;__g.cast(0);
  const pail=W.allies.find(a=>a.k==='pail');
  check('lunch pail exists',!!pail);
  if(pail){const pool=pail.hp;G.hp=__g.S.maxHp*.5;for(let i=0;i<60;i++)__g.update(1/60);
    check('lunch pail spends its stores',pail.hp<pool&&G.hp>__g.S.maxHp*.5,'pool '+pool+' -> '+pail.hp+' hp '+G.hp)}
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
  P.inv=0;G.god=false;G.hp=1;P.guard=0;__g.setMode('play');__g.hurt(1e6);
  check('last shift does not save you',__g.mode==='dying'&&G.hp<=0,'mode '+__g.mode+' hp '+G.hp);
  check('guardian toast stayed quiet',!document.getElementById('log').textContent.includes('saves you'));
  __g.setMode('play');G.hp=__g.S.maxHp;G.en=__g.S.maxEn;
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
  const cu=base('anon');cu.sk=[1,0,0,0,0,0,0,0,0,4,2,2,2,2,2];
  __g.applySave({G:JSON.parse(JSON.stringify(cu))});
  if(__g.G.sk[9]!==4)fail.push('anon boon points were taken');
  if(__g.G.boonRefund&&__g.G.boonRefund.anon)fail.push('anon was marked refunded');
  return fail});
if(refund.length){console.error('REFUND\n'+refund.join('\n'));errs.push(...refund)}

const failed=errs.length;
console.log(failed?'ERRORS:\n'+errs.slice(0,20).join('\n'):'scrapper milestone 0 checks passed');
await b.close();
if(errs.length>failed)console.error('pageerror during close:\n'+errs.slice(failed).join('\n'));
process.exit(failed?1:0);
})().catch(e=>{console.error(e);process.exit(1)});

async function runHacker(){
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:390,height:800}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8')+'</body></html>');
await p.waitForTimeout(400);
await p.evaluate(()=>__g.skipDisc());
await p.waitForTimeout(200);
const tree=await p.evaluate(()=>{
  const s=__g.CLS.hacker.sk,c=__g.CLS.anon.sk,fail=[];
  const names=s.map(x=>x.n);
  for(const n of ['Ground Fault','Packet Storm','Schema','Step Back','Patched','Kill Dash Nine'])if(!names.includes(n))fail.push('missing '+n);
  for(const n of ['Daemon','Self-Repair','Brownout','Feedback Loop','Root Access','Failsafe'])if(names.includes(n))fail.push('boon name still on hacker: '+n);
  if(s.length!==15)fail.push('hacker length '+s.length);
  if(s.some(x=>x.boon))fail.push('hacker still has a boon field');
  const row=s.slice(9);
  if(row.filter(x=>x.a).length!==4||row.filter(x=>!x.a).length!==2)fail.push('rows 4-5 should be four actives and two passives');
  if(!c[9]||c[9].boon!=='strike'||!c[14]||c[14].boon!=='guardian')fail.push('anon should still be on the boon loop');
  try{s.forEach(sk=>sk.d(3))}catch(e){fail.push('tooltip threw '+e.message)}
  return fail});
if(tree.length){console.error(tree.join('\n'));await b.close();process.exit(1)}
await p.click('[data-cls=hacker]');
await p.waitForTimeout(300);
await p.evaluate(()=>{const G=__g.G;G.pre=2});
await clearUI(p);
const play=await p.evaluate(()=>{
  const G=__g.G,fail=[];
  G.lvl=60;G.act2=true;G.act3=true;G.sats=40;G.sp=40;G.god=false;G.credits=1e9;
  for(let i=1;i<=25;i++)G.q['q'+i]=3;
  G.in1=1;__g.calc();G.hp=__g.S.maxHp;G.en=__g.S.maxEn;
  if(__g.mode!=='play')fail.push('not in play after intro, mode '+__g.mode);
  if(!G.boonRefund||!G.boonRefund.hacker)fail.push('a new technomancer should carry the refund flag');
  if((__g.G.sp||0)<40)fail.push('new game refund touched the point pool');
  return fail});
if(play.length){console.error(play.join('\n'));await b.close();process.exit(1)}
await p.evaluate(()=>__g.enter(1));
await clearUI(p);

const combat=await p.evaluate(()=>{
  const fail=[],G=__g.G,P=__g.P,W=__g.W;
  __g.ACC.maxi=1;__g.setMode('play');
  const check=(n,ok,extra)=>{if(!ok)fail.push(n+(extra!==undefined?': '+extra:''))};
  function park(){
    const N=W.N;
    for(const rad of [6,5,4,3,2]){
      for(let y=rad+1;y<N-rad-1;y++)for(let x=rad+1;x<N-rad-1;x++){
        let ok=true;
        for(let dy=-rad;dy<=rad&&ok;dy++)for(let dx=-rad;dx<=rad;dx++)if(W.map[(y+dy)*N+(x+dx)]!==1)ok=false;
        if(ok){P.x=x+.5;P.y=y+.5;P.dir={x:1,y:0};return rad}}
    }
    return 0}
  const room=park();
  check('open floor',room>0,'rad '+room);
  W.ents.length=0;W.projs.length=0;W.fx.length=0;W.allies.length=0;
  G.sk=[1,0,0,0,0,0,0,0,0,1,0,0,0,0,0];G.pas=[];G.slots=[9,-1,-1];__g.calc();
  const e=__g.spawn('bot',P.x+3,P.y,{});
  check('spawn for bolt',!!e);
  if(e){e.stun=100;e.aggro=false;const hp=e.hp;
    for(let i=0;i<240;i++)__g.update(1/60);
    check('old bolt did not fire',e.hp===hp&&!W.fx.some(f=>f.k==='bolt'),'hp '+e.hp+'/'+hp);
    check('index 9 did not lay a fault by itself',!W.allies.some(a=>a.k==='fault'));
    W.ents.length=0}
  function arm(i){G.sk[i]=Math.max(1,G.sk[i]||0);G.slots[0]=i;P.cd[i]=0;P.dash=null;P.silence=0;P.castWait=0;__g.setMode('play');if(!__g.CLS.hacker.sk[i].a){if(!G.pas.includes(i))G.pas.push(i)}__g.calc();G.en=__g.S.maxEn}
  function flat(){__g.calc();const S=__g.S;S.dmin=S.dmax=40;S.dmg=0;S.shock=0;S.crit=0;S.critM=1;S.leech=0;S.stun=0;P.ambT=0;P.streak=0;P.movedT=0;P.shr=null;P.e82=0;P.fm={m:1,t:1.2,dt:'surge'}}
  W.allies.length=0;W.ents.length=0;P.dir={x:1,y:0};arm(9);const en0=__g.G.en;__g.cast(0);
  const fault=W.allies.find(a=>a.k==='fault');
  check('ground fault exists',!!fault&&fault.pts&&fault.pts.length>0);
  check('ground fault locks the next cast',P.castWait>0,P.castWait);
  const en1=G.en;__g.cast(0);
  check('still casting spends nothing',G.en===en1&&en1<en0,'en '+en0+' -> '+en1+' -> '+G.en);
  W.allies.length=0;P.castWait=0;W.ents.length=0;P.dir={x:1,y:0};arm(10);__g.cast(0);
  const storm=W.allies.find(a=>a.k==='pstorm');
  check('packet storm exists',!!storm&&storm.arm>1);
  if(storm){const sx=storm.x,sy=storm.y;P.x+=2;
    for(let i=0;i<30;i++)__g.update(1/60);
    check('packet storm stays where it was marked',storm.x===sx&&storm.y===sy);
    const bot=__g.spawn('bot',sx,sy,{});
    if(bot){bot.stun=100;bot.aggro=false;const hp=bot.hp;
      for(let i=0;i<40;i++)__g.update(1/60);
      check('packet storm has not arrived yet',bot.hp===hp,'hp '+bot.hp+'/'+hp+' arm '+storm.arm);
      for(let i=0;i<120;i++)__g.update(1/60);
      check('packet storm hits after the delay',bot.hp<hp,'hp '+bot.hp+'/'+hp);
      check('packet storm is noise',bot.lt==='noise',bot.lt)}
    W.ents.length=0;W.allies.length=0}
  /* Schema: one element, and only that element. */
  G.eq.weapon={slot:'weapon',q:0,dmin:2,dmax:4,aff:[],dt:'impact'};
  G.schema='heat';G.sk[11]=1;G.pas=[11];__g.calc();
  check('schema heat',__g.S.t_heat===8,'t_heat '+__g.S.t_heat);
  check('schema ignores the other elements',!__g.S.t_surge&&!__g.S.t_noise,'surge '+__g.S.t_surge+' noise '+__g.S.t_noise);
  const asked=document.getElementById('dT')?document.getElementById('dT').textContent:'';
  __g.schemaAsk();
  const title=document.getElementById('dT').textContent;
  const btns=[...document.querySelectorAll('#dBtns button')].map(b=>b.textContent);
  check('schema ask opens',title==='Schema'&&btns.join('|')==='Surge|Heat|Noise',title+' '+btns.join('|'));
  const pickSurge=document.querySelector('#dBtns button');pickSurge.disabled=false;pickSurge.click();
  check('schema ask can choose surge',G.schema==='surge');
  /* Step Back: along facing, a few paces, not across the district. */
  W.ents.length=0;P.castWait=0;park();P.dir={x:1,y:0};const x0=P.x,y0=P.y;arm(12);__g.cast(0);
  const back=x0-P.x;
  check('step back moves along facing',back>1.2&&back<=4.05&&Math.abs(P.y-y0)<.05,'dx '+back.toFixed(2)+' room '+room);
  /* Patched: surge schema banks a barrier; heat or noise does not. The barrier then eats a hit. */
  W.ents.length=0;G.schema='surge';G.sk[13]=1;if(!G.pas.includes(13))G.pas.push(13);if(!G.pas.includes(11))G.pas.push(11);
  flat();P.barrier=0;
  const vic=__g.spawn('bot',P.x+1.2,P.y,{});
  if(vic){vic.stun=30;__g.hit(vic,1);
    check('patched banks surge damage',P.barrier>0,'barrier '+P.barrier+' lt '+vic.lt);
    G.schema='noise';P.barrier=0;vic.hp=vic.max||vic.hp;__g.hit(vic,1);
    check('patched does nothing for a noise schema',!(P.barrier>0),'barrier '+P.barrier);
    W.ents.length=0}
  P.inv=0;G.god=false;__g.setMode('play');P.barrier=0;G.hp=__g.S.maxHp;__g.hurt(80);const bare=__g.S.maxHp-G.hp;
  G.hp=__g.S.maxHp;P.inv=0;P.barrier=1e6;__g.hurt(80);
  check('patched barrier absorbs the hit',G.hp===__g.S.maxHp&&bare>0,'bare '+bare+' hp '+G.hp);
  /* Kill Dash Nine: one machine, resistance ignored once, immunity of zero stays. */
  W.ents.length=0;P.castWait=0;G.schema='heat';arm(14);P.dir={x:1,y:0};
  const one=__g.spawn('bot',P.x+2,P.y,{});
  if(one){one.stun=30;const hp=one.hp;__g.cast(0);
    check('kill dash nine hits',one.hp<hp,'hp '+one.hp+'/'+hp);
    check('kill dash nine uses the schema element',one.lt==='heat',one.lt);
    check('kill dash nine locks the next cast',P.castWait>0,P.castWait);
    W.ents.length=0}
  flat();
  const seer=__g.spawn('seer',P.x+1.5,P.y,{});
  if(seer){seer.stun=50;const hp=seer.hp;P.k9=null;P.fm={m:1,t:1.2,dt:'surge'};__g.hit(seer,1);const loss1=hp-seer.hp;
    seer.hp=hp;P.k9='surge';P.fm={m:1,t:1.2,dt:'surge'};__g.hit(seer,1);const loss2=hp-seer.hp;
    check('kill dash nine punches through resistance',loss2>loss1*1.4,'resisted '+loss1+' vs pierced '+loss2);
    W.ents.length=0}
  flat();
  const aeg=__g.spawn('aegis',P.x+1.5,P.y,{});
  if(aeg){aeg.stun=50;const hp=aeg.hp;P.k9='surge';P.fm={m:1,t:1.2,dt:'surge'};__g.hit(aeg,1);
    check('a resistance of zero stays a wall',aeg.hp===hp,'hp '+aeg.hp+'/'+hp);
    W.ents.length=0}
  /* Dying does not change the element. Sister Null does. */
  G.schema='heat';P.inv=0;G.god=false;G.hp=1;__g.setMode('play');__g.hurt(1e6);
  check('death leaves the schema',__g.mode==='dying'&&G.schema==='heat','mode '+__g.mode+' schema '+G.schema);
  __g.setMode('play');G.hp=__g.S.maxHp;G.en=__g.S.maxEn;
  return fail});
if(combat.length){console.error('COMBAT\n'+combat.join('\n'));errs.push(...combat)}

await p.evaluate(()=>{
  const G=__g.G;G.schema='heat';G.credits=1e9;G.cpi=1;__g.setMode('play');__g.talkTo('null')});
await p.evaluate(()=>{
  const b=[...document.querySelectorAll('#dBtns button')].find(x=>/Unlearn/.test(x.textContent));
  if(!b)throw new Error('no unlearn button');
  b.disabled=false;b.click()});
const unlearn=await p.evaluate(()=>{
  const G=__g.G,fail=[];
  if(G.schema)fail.push('sister null left schema '+G.schema);
  if(G.sk.some(n=>n!==0))fail.push('unlearn left points');
  return fail});
if(unlearn.length){console.error('UNLEARN\n'+unlearn.join('\n'));errs.push(...unlearn)}
await clearUI(p);

const sheets=await p.evaluate(()=>{
  const fail=[];
  __g.setMode('play');
  __g.openSheet('skills');
  const html=document.getElementById('sheetIn').innerHTML;
  for(const n of ['Ground Fault','Packet Storm','Schema','Step Back','Patched','Kill Dash Nine','Root Kit','Firewall','Throttle'])if(!html.includes(n))fail.push('skills sheet missing '+n);
  for(const n of ['Brownout','Daemon','Failsafe'])if(html.includes(n))fail.push('skills sheet still shows '+n);
  __g.closeSheet();
  __g.openSheet('shift');
  document.querySelector('[data-shiftp=hacker]').click();
  const pop=document.getElementById('pop').innerHTML;
  for(const n of ['Chain Reaction','Sysadmin','Control Rod','Packet Storm'])if(!pop.includes(n))fail.push('builds missing '+n);
  if(pop.includes('Brownout'))fail.push('builds still say Brownout');
  __g.closeSheet();
  return fail});
if(sheets.length){console.error('SHEETS\n'+sheets.join('\n'));errs.push(...sheets)}

async function shift(arg){
  await p.evaluate(a=>__g.shapeShift(a[0],a[1]),arg);
  await clearUI(p);
}
await p.evaluate(()=>{__g.G.sats=40;__g.G.lvl=60;__g.G.act2=true;__g.G.act3=true;__g.setMode('play')});
await shift(['courier',0]);
const cleared=await p.evaluate(()=>__g.G.schema);
if(cleared){console.error('shape shift left schema '+cleared);errs.push('schema survived a class change')}
await shift(['hacker','rod']);
const built=await p.evaluate(()=>{
  const G=__g.G,fail=[];
  if(G.cls!=='hacker')fail.push('class '+G.cls);
  if(G.schema!=='noise')fail.push('rod schema '+G.schema);
  if(!G.slots.includes(10)||!G.slots.includes(12))fail.push('rod buttons '+G.slots.join(','));
  if(!G.pas.includes(11))fail.push('rod passives '+G.pas.join(','));
  if(G.pas.includes(13))fail.push('noise rod should not run Patched');
  return fail});
if(built.length){console.error('BUILD\n'+built.join('\n'));errs.push(...built)}
await shift(['courier',0]);
const back=await p.evaluate(()=>__g.G.cls);
if(back!=='courier'){console.error('did not shift back, cls '+back);errs.push('shift back')}

const refund=await p.evaluate(()=>{
  const fail=[],eq={weapon:null,helm:null,armor:null,gloves:null,boots:null,belt:null,ring:null,amulet:null};
  const base=cls=>({v:2,cls,lvl:40,xp:0,sp:4,ap:0,at:{mgt:0,ref:0,vit:0,bnd:0},hp:80,en:20,credits:10,cpi:1,stims:1,bag:[],eq,unlocked:20,q:{},sats:0,slots:[9,12,0],pas:[10,11]});
  const raw=base('hacker');raw.sk=[1,2,0,0,0,0,0,0,3,2,3,4,1,5,6];
  const low=raw.sk.slice(0,9).join();
  __g.applySave({G:JSON.parse(JSON.stringify(raw))});
  const G=__g.G;
  if(G.sp!==4+21)fail.push('refunded sp '+G.sp);
  if(G.sk.slice(9).some(n=>n!==0))fail.push('indices 9-14 not cleared '+G.sk.slice(9).join(','));
  if(G.sk.slice(0,9).join()!==low)fail.push('rows 1-3 changed');
  if(!G.boonRefund||G.boonRefund.hacker!==1)fail.push('flag '+JSON.stringify(G.boonRefund));
  if(G.slots[0]!==-1||G.slots[1]!==-1||G.slots[2]!==0)fail.push('slots '+G.slots.join(','));
  if((G.pas||[]).some(i=>i>=9))fail.push('pas '+G.pas);
  if(!document.getElementById('log').textContent.includes('The old boons were withdrawn and the points returned.'))fail.push('no refund toast');
  const sp=G.sp,sk=G.sk.join();
  __g.applySave({G:JSON.parse(JSON.stringify(G))});
  if(__g.G.sp!==sp||__g.G.sk.join()!==sk)fail.push('refunded twice');
  const cu=base('anon');cu.sk=[1,0,0,0,0,0,0,0,0,4,2,2,2,2,2];
  __g.applySave({G:JSON.parse(JSON.stringify(cu))});
  if(__g.G.sk[9]!==4)fail.push('anon boon points were taken');
  if(__g.G.boonRefund&&__g.G.boonRefund.anon)fail.push('anon was marked refunded');
  return fail});
if(refund.length){console.error('REFUND\n'+refund.join('\n'));errs.push(...refund)}

const failed=errs.length;
console.log(failed?'ERRORS:\n'+errs.slice(0,30).join('\n'):'hacker milestone 0 checks passed');
await b.close();
if(errs.length>failed)console.error('pageerror during close:\n'+errs.slice(failed).join('\n'));
process.exit(failed?1:0);
}

async function runCourier(){
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:390,height:800}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8')+'</body></html>');
await p.waitForTimeout(400);
await p.evaluate(()=>__g.skipDisc());
await p.waitForTimeout(200);
const tree=await p.evaluate(()=>{
  const s=__g.CLS.courier.sk,c=__g.CLS.anon.sk,fail=[];
  const names=s.map(x=>x.n);
  for(const n of ['Return to Sender','Route Knowledge','Second Drop','Manifest','Hazard Pay','Missed Connection'])if(!names.includes(n))fail.push('missing '+n);
  for(const n of ['Ricochet','Runner’s High','Slipstream','Backdraft','Seasoned','Narrow Escape'])if(names.includes(n))fail.push('boon name still on courier: '+n);
  if(s.length!==15)fail.push('courier length '+s.length);
  if(s.some(x=>x.boon))fail.push('courier still has a boon field');
  const row=s.slice(9);
  if(row.filter(x=>x.a).length!==4||row.filter(x=>!x.a).length!==2)fail.push('rows 4-5 should be four actives and two passives');
  if(!c[9]||c[9].boon!=='strike')fail.push('anon should still be on the boon loop');
  try{s.forEach(sk=>sk.d(3))}catch(e){fail.push('tooltip threw '+e.message)}
  return fail});
if(tree.length){console.error(tree.join('\n'));await b.close();process.exit(1)}
await p.click('[data-cls=courier]');
await p.waitForTimeout(300);
await p.evaluate(()=>{const G=__g.G;G.pre=2});
await clearUI(p);
const play=await p.evaluate(()=>{
  const G=__g.G,fail=[];
  G.lvl=60;G.act2=true;G.act3=true;G.sats=40;G.sp=40;G.god=false;
  for(let i=1;i<=25;i++)G.q['q'+i]=3;
  G.in1=1;__g.calc();G.hp=__g.S.maxHp;G.en=__g.S.maxEn;
  if(__g.mode!=='play')fail.push('not in play after intro, mode '+__g.mode);
  if(!G.boonRefund||!G.boonRefund.courier)fail.push('a new runner should carry the refund flag');
  if((__g.G.sp||0)<40)fail.push('new game refund touched the point pool');
  return fail});
if(play.length){console.error(play.join('\n'));await b.close();process.exit(1)}
await p.evaluate(()=>__g.enter(1));
await clearUI(p);
const combat=await p.evaluate(()=>{
  const fail=[],G=__g.G,P=__g.P,W=__g.W;
  __g.ACC.maxi=1;__g.setMode('play');
  const check=(n,ok,extra)=>{if(!ok)fail.push(n+(extra!==undefined?': '+extra:''))};
  function park(){
    const N=W.N;
    for(const rad of [5,4,3,2]){
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
    check('index 9 did not throw by itself',W.projs.length===0);
    W.ents.length=0}
  function arm(i){G.sk[i]=Math.max(1,G.sk[i]||0);G.slots[0]=i;P.cd[i]=0;P.dash=null;P.silence=0;P.castWait=0;__g.setMode('play');if(!__g.CLS.courier.sk[i].a&&!G.pas.includes(i))G.pas.push(i);__g.calc();G.en=__g.S.maxEn}
  W.projs.length=0;W.ents.length=0;P.dir={x:1,y:0};park();arm(9);__g.cast(0);
  const sent=W.projs.find(pr=>pr.ret);
  check('return to sender is a throw that comes back',!!sent);
  if(sent){let back=false;for(let i=0;i<50&&!back;i++){__g.update(1/60);if(W.projs.some(pr=>pr.ret&&pr.returning))back=true}
    check('return to sender turns around',back)}
  /* Route Knowledge: a dash starts it. Standing still does not. */
  P.route=0;G.sk[10]=1;if(!G.pas.includes(10))G.pas.push(10);__g.calc();
  for(let i=0;i<20;i++)__g.update(1/60);
  check('standing still does not teach the route',!(P.route>0),P.route);
  W.ents.length=0;arm(1);__g.cast(0);
  check('fleet step is a dash',!!P.dash);
  for(let i=0;i<30;i++)__g.update(1/60);
  check('a dash leaves route knowledge up',P.route>1,'route '+P.route);
  /* Second Drop copies the last throw, then pops if you leave. */
  W.allies.length=0;W.projs.length=0;P.lastThrow=null;arm(11);__g.cast(0);
  check('second drop refuses with nothing thrown',!W.allies.some(a=>a.k==='drop'));
  W.ents.length=0;P.dir={x:1,y:0};P.atk=0;__g.attack();
  check('a throw is remembered',!!P.lastThrow);
  arm(11);__g.cast(0);
  const drop=W.allies.find(a=>a.k==='drop');
  check('second drop exists',!!drop);
  if(drop){const n=W.projs.length;check('second drop copied a throw',n>0,n);
    P.x=drop.x+8;for(let i=0;i<8;i++)__g.update(1/60);
    check('second drop pops when you leave',!W.allies.some(a=>a.k==='drop'&&a.life>0))}
  /* Manifest splits after the first machine. */
  W.projs.length=0;W.ents.length=0;park();P.dir={x:1,y:0};
  const pack=__g.spawn('bot',P.x+.8,P.y,{});
  if(pack){pack.stun=30;pack.hp=pack.max=5000;arm(12);__g.cast(0);
    check('manifest is one throw',W.projs.some(pr=>pr.split));
    let split=false;for(let i=0;i<20&&!split;i++){__g.update(1/60);if(W.projs.length>=3)split=true}
    check('manifest splits into two more',split,'projs '+W.projs.length);
    W.ents.length=0}
  /* Hazard Pay: a throw kill pays. A death that was not a throw does not. */
  G.sk[13]=1;if(!G.pas.includes(13))G.pas.push(13);__g.calc();G.credits=100;
  const plain=__g.spawn('bot',P.x+1,P.y,{});
  if(plain){plain.hp=0;P.fromThrow=0;__g.kill(plain);
    check('a dash-style kill does not pay',G.credits===100,'credits '+G.credits)}
  const paid=__g.spawn('bot',P.x+1,P.y,{});
  if(paid){paid.hp=0;P.fromThrow=1;__g.kill(paid);P.fromThrow=0;
    check('a throw kill pays',G.credits>100,'credits '+G.credits)}
  /* Missed Connection: the mark blinks you there and the next throw is free. */
  W.ents.length=0;park();const home=P.x;P.freeThrow=0;
  const marked=__g.spawn('bot',P.x+3,P.y,{});
  if(marked){marked.stun=30;arm(14);__g.cast(0);
    check('missed connection marks',marked.mc>3,marked.mc);
    marked.hp=0;__g.kill(marked);
    check('missed connection blinks to the fall',Math.abs(P.x-(home+3))<1.2,'x '+P.x+' home '+home);
    check('the next throw is owed',P.freeThrow===1);
    arm(0);const en=G.en;__g.cast(0);
    check('the owed throw costs nothing',G.en===en&&!P.freeThrow,'en '+en+' -> '+G.en);
    P.cd[0]=0;const en2=G.en;__g.cast(0);
    check('the throw after that costs energy',G.en<en2,'en '+en2+' -> '+G.en)}
  W.ents.length=0;park();const stay=P.x;P.freeThrow=0;
  const unmarked=__g.spawn('bot',P.x+3,P.y,{});
  if(unmarked){unmarked.hp=0;unmarked.mc=0;__g.kill(unmarked);
    check('an unmarked death does not blink',P.x===stay&&!P.freeThrow,'x '+P.x)}
  return fail});
if(combat.length){console.error('COMBAT\n'+combat.join('\n'));errs.push(...combat)}
await clearUI(p);
const sheets=await p.evaluate(()=>{
  const fail=[];
  __g.setMode('play');Ghp();
  function Ghp(){__g.G.hp=__g.S.maxHp}
  __g.openSheet('skills');
  const html=document.getElementById('sheetIn').innerHTML;
  for(const n of ['Return to Sender','Route Knowledge','Second Drop','Manifest','Hazard Pay','Missed Connection','Express','Insured','Cash on Delivery'])if(!html.includes(n))fail.push('skills sheet missing '+n);
  for(const n of ['Ricochet','Seasoned','Narrow Escape'])if(html.includes(n))fail.push('skills sheet still shows '+n);
  __g.closeSheet();
  __g.openSheet('shift');
  document.querySelector('[data-shiftp=courier]').click();
  const pop=document.getElementById('pop').innerHTML;
  for(const n of ['Rush Hour','Porch Pirate','Tip Jar','Return to Sender','Missed Connection','Hazard Pay'])if(!pop.includes(n))fail.push('builds missing '+n);
  if(pop.includes('Ricochet'))fail.push('builds still say Ricochet');
  __g.closeSheet();
  return fail});
if(sheets.length){console.error('SHEETS\n'+sheets.join('\n'));errs.push(...sheets)}
async function shift(arg){
  await p.evaluate(a=>__g.shapeShift(a[0],a[1]),arg);
  await clearUI(p);
}
await p.evaluate(()=>{__g.G.sats=40;__g.G.lvl=60;__g.G.act2=true;__g.G.act3=true;__g.setMode('play')});
await shift(['scrapper',0]);
await shift(['courier','tips']);
const built=await p.evaluate(()=>{
  const G=__g.G,fail=[];
  if(G.cls!=='courier')fail.push('class '+G.cls);
  if(!G.pas.includes(13))fail.push('tips passives '+G.pas.join(','));
  if(!G.slots.includes(9))fail.push('tips buttons '+G.slots.join(','));
  return fail});
if(built.length){console.error('BUILD\n'+built.join('\n'));errs.push(...built)}
await shift(['scrapper',0]);
const back=await p.evaluate(()=>__g.G.cls);
if(back!=='scrapper'){console.error('did not shift back, cls '+back);errs.push('shift back')}
const refund=await p.evaluate(()=>{
  const fail=[],eq={weapon:null,helm:null,armor:null,gloves:null,boots:null,belt:null,ring:null,amulet:null};
  const base=cls=>({v:2,cls,lvl:40,xp:0,sp:4,ap:0,at:{mgt:0,ref:0,vit:0,bnd:0},hp:80,en:20,credits:10,cpi:1,stims:1,bag:[],eq,unlocked:20,q:{},sats:0,slots:[9,12,0],pas:[10,11]});
  const raw=base('courier');raw.sk=[1,2,0,0,0,0,0,0,3,2,3,4,1,5,6];
  const low=raw.sk.slice(0,9).join();
  __g.applySave({G:JSON.parse(JSON.stringify(raw))});
  const G=__g.G;
  if(G.sp!==4+21)fail.push('refunded sp '+G.sp);
  if(G.sk.slice(9).some(n=>n!==0))fail.push('indices 9-14 not cleared '+G.sk.slice(9).join(','));
  if(G.sk.slice(0,9).join()!==low)fail.push('rows 1-3 changed');
  if(!G.boonRefund||G.boonRefund.courier!==1)fail.push('flag '+JSON.stringify(G.boonRefund));
  if(G.slots[0]!==-1||G.slots[1]!==-1||G.slots[2]!==0)fail.push('slots '+G.slots.join(','));
  if((G.pas||[]).some(i=>i>=9))fail.push('pas '+G.pas);
  if(!document.getElementById('log').textContent.includes('The old boons were withdrawn and the points returned.'))fail.push('no refund toast');
  const sp=G.sp,sk=G.sk.join();
  __g.applySave({G:JSON.parse(JSON.stringify(G))});
  if(__g.G.sp!==sp||__g.G.sk.join()!==sk)fail.push('refunded twice');
  const cu=base('anon');cu.sk=[1,0,0,0,0,0,0,0,0,4,2,2,2,2,2];
  __g.applySave({G:JSON.parse(JSON.stringify(cu))});
  if(__g.G.sk[9]!==4)fail.push('anon boon points were taken');
  if(__g.G.boonRefund&&__g.G.boonRefund.anon)fail.push('anon was marked refunded');
  return fail});
if(refund.length){console.error('REFUND\n'+refund.join('\n'));errs.push(...refund)}
const failedC=errs.length;
console.log(failedC?'ERRORS:\n'+errs.slice(0,30).join('\n'):'courier milestone 0 checks passed');
await b.close();
if(errs.length>failedC)console.error('pageerror during close:\n'+errs.slice(failedC).join('\n'));
process.exit(failedC?1:0);
}
