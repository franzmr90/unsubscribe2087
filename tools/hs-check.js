/* Homesteader milestone 1. Usage: node tools/hs-check.js
   Loads dist/unsubscribe.html under setContent. Asserts the class boots, the three
   columns exclude each other, the flock can turn, and the builds assign. */
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push('page: '+e.message));
const root=path.join(__dirname,'..');
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8')+'</body></html>');
await p.waitForTimeout(500);
const fail=m=>errs.push(m);
const clear=async(n=18)=>{for(let i=0;i<n;i++){await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden){const b=document.getElementById('scSkip');b&&b.click()}const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}});await p.waitForTimeout(160)}};
await p.evaluate(()=>__g.skipDisc());await p.waitForTimeout(200);
const title=await p.evaluate(()=>{const b=document.querySelector('[data-cls=homesteader]');const c=__g.CLS.homesteader;return {btn:!!(b&&b.textContent.includes('Homesteader')),hp:c&&c.hp,hpL:c&&c.hpL,melee:c&&c.melee,mult:c&&c.mult,ivl:c&&c.ivl,spd:c&&c.spd,col:c&&c.col,locked:c&&c.locked,boon:c&&c.boon,names:(c&&c.sk||[]).map(s=>s.n),act:(c&&c.sk||[]).map(s=>s.a)}})
if(!title.btn)fail('title button missing');
if(title.hp!==110||title.hpL!==15||title.melee!==false||title.mult!==1||title.ivl!==.55||title.spd!==4.3||title.col!=='#6a8f62')fail('stats '+JSON.stringify(title));
if(title.locked||title.boon)fail('locked or boon set');
const names=['Cold Frame','Wear the Hound','Strays','Compost','Wear the Hull','The Bull','Hedgerow','Shed','Go Feral','Kill Frost','Wear What You Killed','Rootbound','Salt the Earth','Too Big for the Door','Slaughter Weight'];
if(title.names.join('|')!==names.join('|'))fail('skill names '+title.names.join('|'));
if(title.act.join(',')!=='1,1,1,1,1,1,1,1,0,1,1,0,1,0,1')fail('active flags '+title.act.join(','));
const tables=await p.evaluate(()=>{const u=(__g.UNI||[]).filter(x=>x.cls==='homesteader').map(x=>x.id);const B=__g.BUILDS.homesteader||[];const sk=__g.SKF.homesteader||{};const act=[0,1,2,3,4,5,6,7,9,10,12,14];return {u,builds:B.map(b=>b.k+':'+b.doc+':'+b.pr.map(p=>p[0]).join(',')),sk:act.filter(i=>typeof sk[i]!=='function'),sv:(__g.SKV.homesteader&&Object.keys(__g.SKV.homesteader).length)||0}})
if(tables.u.sort().join(',')!=='collar,soaker')fail('uniques '+tables.u.join(','));
if(tables.builds.join(' ; ')!=='bed:fallow:0,3,6,9,12 ; hull:tenant:1,4,7,10,13 ; flock:poacher:2,5,8,11,14,0')fail('builds '+tables.builds.join(' ; '));
if(tables.sk.length)fail('missing SKF '+tables.sk.join(','));
if(tables.sv!==15)fail('SKV '+tables.sv);
await p.evaluate(()=>__g.newGame('homesteader'));
await clear(20);
const boot=await p.evaluate(()=>({cls:__g.G.cls,mode:__g.mode,st:!!(__g.G.st)}));
if(boot.cls!=='homesteader'||boot.mode!=='play'||!boot.st)fail('boot '+JSON.stringify(boot));
await p.evaluate(()=>__g.enter(1));
await clear(16);
const fight=await p.evaluate(async()=>{
  const g=__g,out={};
  const arm=i=>{g.G.sk[i]=Math.max(g.G.sk[i]||0,1);g.G.slots[0]=i;g.G.en=999;g.P.cd[i]=0;g.P.castWait=0;g.P.atk=0;g.calc()};
  const plots=()=>g.W.allies.filter(a=>a.plot&&a.life>0).length;
  const log=()=>document.getElementById('log').textContent;
  g.G.god=true;g.setMode('play');
  g.P.atk=0;const pj=g.W.projs.length;g.attack();out.ranged=g.W.projs.length>pj;
  arm(0);g.cast(0);out.plot=plots();
  arm(1);g.cast(0);out.form=g.G.form;out.plotsInHound=plots();
  g.P.atk=0;const pj2=g.W.projs.length;g.attack();out.melee=g.W.projs.length===pj2;
  arm(0);g.cast(0);out.plotBlocked=plots();out.houndToast=/no hands/.test(log());
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  out.grey=document.querySelector('.sk[data-i="0"]').classList.contains('off');
  g.openSheet('skills');out.sheetLock=document.querySelector('[data-node="0"]').classList.contains('lock');g.closeSheet();
  for(const f of ['hound','hull','worn',null]){g.G.form=f;g.render()}
  g.G.form='hound';
  arm(7);g.cast(0);out.shed=g.G.form;
  for(let i=0;i<10;i++)g.update(.1);
  arm(0);g.cast(0);out.plotBack=plots();
  arm(4);g.cast(0);out.hull=g.G.form;
  const charges=g.P.dg?g.P.dg.n:2;g.dodge();out.noDash=!g.P.dash&&(g.P.dg?g.P.dg.n:2)===charges&&/does not dash/.test(log());
  arm(1);g.cast(0);out.hullBlocksHound=g.G.form==='hull'&&/does not become a hound/.test(log());
  arm(7);g.cast(0);for(let i=0;i<10;i++)g.update(.1);
  g.W.ents.splice(0);g.G.god=false;g.G.hp=g.S.maxHp;g.P.inv=0;
  const hp0=g.G.hp;arm(2);g.cast(0);
  const a=g.W.allies.find(x=>x.flock);if(!a){out.flock=false}else{
    a.x=g.P.x+8;a.y=g.P.y;g.update(.05);
    const d=Math.hypot(a.x-g.P.x,a.y-g.P.y);
    out.hostile=a.foe===1&&d>4.5;
    for(let i=0;i<50;i++)g.update(.1);
    out.bit=(a.bit||0)>0||g.G.hp<hp0;
    out.flock=true}
  g.G.god=true;g.G.hp=g.S.maxHp;if(g.G.form){arm(7);g.cast(0);for(let i=0;i<10;i++)g.update(.1)}
  g.W.ents.splice(0);
  if(!g.W.allies.some(x=>x.flock)){arm(2);g.cast(0)}
  out.hadFlock=g.W.allies.some(x=>x.flock);
  const near=(o,ch)=>{for(const [dx,dy] of [[1.1,0],[-1.1,0],[0,1.1],[.8,.8],[-.8,.8]]){const e=g.spawn('tick',g.P.x+dx,g.P.y+dy,o);if(e&&Math.hypot(e.x-g.P.x,e.y-g.P.y)<3)return e}return null};
  const champ=near({champ:1});out.champ=!!champ;
  const kills=g.G.kills;arm(10);g.cast(0);
  out.refused=!!champ&&g.G.form!=='worn'&&g.W.ents.includes(champ)&&/too much machine/.test(log());
  if(champ){champ.x=g.P.x+40;champ.y=g.P.y+40}
  const tick=near(null);out.tick=!!tick;
  arm(10);g.cast(0);
  out.wore=g.G.form==='worn'&&g.G.formDt==='heat'&&!g.W.allies.some(x=>x.flock)&&tick&&!g.W.ents.includes(tick)&&g.G.kills===kills&&(!champ||g.W.ents.includes(champ));
  g.G.form='hound';g.G.formDt=null;g.enter(2);out.zoned=g.G.form==='hound';
  g.enter(0);out.town=!g.G.form;
  g.enter(1);g.setMode('play');g.G.form='hull';g.G.formT=4;g.P.inv=0;g.G.god=false;g.G.hp=40;
  g.hurt(1e9,false,null);out.died=!g.G.form&&g.mode==='dying';
  g.G.hp=g.S.maxHp;g.G.en=g.S.maxEn;g.setMode('play');const death=document.getElementById('death');if(death)death.hidden=true;
  g.G.god=true;g.G.form=null;g.P.dash=null;g.W.ents.splice(0);g.W.allies.splice(0);g.W.merc=null;g.W.tag=null;
  const px=g.P.x,py=g.P.y;
  g.W.allies.push({k:'hedge',plot:1,x:px+1.6,y:py,life:9,r:.42});
  g.P.dir={x:1,y:0};g.dodge();for(let i=0;i<10;i++)g.update(.05);
  out.hedgeYou=(g.P.x-px)<1.15;
  g.P.x=px;g.P.dash=null;
  const foe=g.spawn('tick',px+3.4,py);if(foe){foe.stun=40;foe.aggro=true;foe.hp=400}
  g.G.merc={k:'hound',hp:100,dead:false,name:'Kit'};
  g.W.merc={x:px+.15,y:py,r:.28,hp:100,max:100,cd:9,ph:0,flash:0,swing:0,fx:1,armM:1};
  for(let i=0;i<40;i++)g.update(.05);
  out.hedgeMerc=g.W.merc.x>px+1.9;
  g.G.tag={cls:'scrapper',lvl:2,name:'Ash',sk:[],eq:{},dmg:4,red:1,max:40,hp:40};
  g.W.tag={x:px+.15,y:py+.35,r:.3,hp:40,max:40,ph:0,flash:0,armM:1,fx:1,swing:0,atk:9,sc:[],dir:{x:1,y:0},moving:false,walkPh:0,buff:0,haste:0,guard:0,dash:null,stealth:0,tag:1};
  for(let i=0;i<30;i++)g.update(.05);
  out.hedgeTag=g.W.tag.x>px+1.9;
  g.W.ents.splice(0);g.P.x=px;
  const pal={k:'minion',flock:1,kind:'stray',x:px+3.1,y:py,r:.28,foe:0,cd:9,m:.2,ivl:9,rng:1.15,spd:6,ph:0,life:99};
  g.W.allies.push(pal);for(let i=0;i<40;i++)g.update(.05);
  out.hedgePal=pal.x<px+1.55;
  const fer={k:'minion',flock:1,kind:'stray',x:px+3.1,y:py+.7,r:.28,foe:1,feral:1,cd:9,m:.2,ivl:9,rng:1.15,spd:6,ph:0,life:99,bite:1};
  g.W.allies.push(fer);for(let i=0;i<40;i++)g.update(.05);
  out.hedgeFeral=fer.x>px+1.9;
  return out});
const want={ranged:true,plot:1,form:'hound',plotsInHound:0,melee:true,plotBlocked:0,houndToast:true,grey:true,sheetLock:true,shed:null,plotBack:1,hull:'hull',noDash:true,hullBlocksHound:true,flock:true,hostile:true,bit:true,hadFlock:true,champ:true,refused:true,tick:true,wore:true,zoned:true,town:true,died:true,hedgeYou:true,hedgeMerc:true,hedgeTag:true,hedgePal:true,hedgeFeral:true};
for(const k in want)if(fight[k]!==want[k])fail(k+' got '+JSON.stringify(fight[k])+' want '+JSON.stringify(want[k]));
await clear(8);
const sheet=await p.evaluate(()=>{__g.openSheet('skills');const h=document.getElementById('sheetIn').innerHTML;__g.closeSheet();__g.openSheet('codex');const c=document.getElementById('sheetIn').innerHTML;__g.closeSheet();return {skills:h,codex:c}});
if(!sheet.skills.includes('Cold Frame')||!sheet.skills.includes('Tenant')||!sheet.skills.includes('Poacher')||!sheet.skills.includes('Fallow'))fail('skills sheet missing class text');
if(!sheet.codex.includes('Graft')||!sheet.codex.includes('Pruner')||!sheet.codex.includes('Irrigation Spike')||!sheet.codex.includes('Fence Post')||!sheet.codex.includes('Combine Blade'))fail('codex missing graft');
await p.evaluate(()=>{const G=__g.G;G.lvl=60;G.act2=G.act3=true;G.sp=90;G.sats=40;G.ap=12;G.god=true});
const apply=async(key)=>{
  await p.evaluate(()=>__g.openSheet('shift',{}));
  await p.waitForTimeout(80);
  if(key==='0')await p.click('[data-shift="homesteader|0"]');
  else{await p.click('[data-shiftp="homesteader"]');await p.waitForTimeout(80);await p.click('[data-shift="homesteader|'+key+'"]')}
  await clear(18)};
await apply('bed');
const bed=await p.evaluate(()=>{const G=__g.G,plot=[0,3,6,9,12],other=[1,2,4,5,7,8,10,11,13,14];return {doc:G.doc,plot:plot.every(i=>G.sk[i]>0),other:other.every(i=>!G.sk[i]),slots:G.slots.slice()}});
if(bed.doc!=='fallow'||!bed.plot||!bed.other)fail('cold bed '+JSON.stringify(bed));
await apply('hull');
const hull=await p.evaluate(()=>{const G=__g.G;return {doc:G.doc,hull:G.sk[4]>0,plots:[0,3,6,9,12].every(i=>!G.sk[i]),flock:[2,5,8,11,14].every(i=>!G.sk[i]),hound:G.sk[1]>0}});
if(hull.doc!=='tenant'||!hull.hull||!hull.plots||!hull.flock||!hull.hound)fail('hull build '+JSON.stringify(hull));
await apply('flock');
const flock=await p.evaluate(()=>{const G=__g.G;return {doc:G.doc,stray:G.sk[2]>0,anchor:G.sk[0]>0,chassis:[1,4,7,10,13].every(i=>!G.sk[i]),deep:[3,6,9,12].every(i=>!G.sk[i])}});
if(flock.doc!=='poacher'||!flock.stray||!flock.anchor||!flock.chassis||!flock.deep)fail('flock build '+JSON.stringify(flock));
await apply('0');
const assign=await p.evaluate(()=>{const G=__g.G;return {s0:G.sk[0],rest:G.sk.slice(1).every(v=>!v),slot:G.slots[0],form:G.form||null}});
if(assign.s0!==1||!assign.rest||assign.slot!==0||assign.form)fail('assign '+JSON.stringify(assign));
const comp=await p.evaluate(()=>{
  const g=__g,P=g.P,n0=g.W.allies.length;P.tag=1;g.SKF.homesteader[1]();
  const formed=P.form==='hound'&&!g.G.form;g.SKF.homesteader[0](1,1);const blocked=g.W.allies.length===n0;
  P.tag=0;P.form=null;P.dir=P.dir||{x:1,y:0};
  g.G.tag={cls:'homesteader',lvl:8,name:'Homesteader',sk:[[4,3]],eq:{}};
  g.W.tag={x:P.x-.8,y:P.y+.7,r:.3,hp:100,max:100,form:'hull',formDt:null,formT:1,dir:{x:1,y:0},flash:0,moving:false,buff:0,haste:0,guard:0,dash:null,stealth:0,tag:1};
  g.render();return {formed,blocked,draw:window.__tagDraw||''}});
if(!comp.formed||!comp.blocked||comp.draw)fail('companion '+JSON.stringify(comp));
console.log(errs.length?'ERRORS:\n'+errs.slice(0,20).join('\n'):'homesteader ok');
await b.close();process.exit(errs.length?1:0)})();
