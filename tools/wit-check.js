/* Witness milestone 2. Usage: node tools/wit-check.js
   Loads dist/unsubscribe.html under setContent. The Record fills only while a
   machine is on screen and the Witness is not attacking or casting. */
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push('page: '+e.message));
const root=path.join(__dirname,'..');
const shot=path.join('/opt/cursor/artifacts');
try{fs.mkdirSync(shot,{recursive:true})}catch(e){}
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8')+'</body></html>');
await p.waitForTimeout(500);
const fail=m=>errs.push(m);
const clear=async(n=18)=>{for(let i=0;i<n;i++){await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden){const b=document.getElementById('scSkip');b&&b.click()}const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}});await p.waitForTimeout(160)}};
await p.evaluate(()=>__g.skipDisc());await p.waitForTimeout(200);
const title=await p.evaluate(()=>{const b=document.querySelector('[data-cls=witness]');if(b)b.scrollIntoView({block:'center'});const c=__g.CLS.witness;return {btn:!!(b&&b.textContent.includes('Witness')),hp:c&&c.hp,hpL:c&&c.hpL,melee:c&&c.melee,mult:c&&c.mult,ivl:c&&c.ivl,spd:c&&c.spd,col:c&&c.col,locked:c&&c.locked,boon:c&&c.boon,aura:(c&&c.sk||[]).some(s=>s.aura),names:(c&&c.sk||[]).map(s=>s.n),act:(c&&c.sk||[]).map(s=>s.a)}})
if(!title.btn)fail('title button missing');
if(title.hp!==80||title.hpL!==11||title.melee!==true||title.mult!==.72||title.ivl!==.68||title.spd!==4.2||title.col!=='#8d9aab')fail('stats '+JSON.stringify(title));
if(title.locked||title.boon||title.aura)fail('locked, boon, or aura');
const names=['Look','The Sentence','Margin','Cross-reference','Pull the Thread','Filed','Correction','Redaction','The Footnote','On the Record','Unnamed Source','Colophon','Publish','Named Party','Retraction'];
if(title.names.join('|')!==names.join('|'))fail('skill names '+title.names.join('|'));
if(title.act.join(',')!=='1,1,0,1,1,0,1,1,0,1,1,0,1,0,0')fail('active flags '+title.act.join(','));
const tables=await p.evaluate(()=>{const u=(__g.UNI||[]).filter(x=>x.cls==='witness').map(x=>x.id);const B=__g.BUILDS.witness||[];const sk=__g.SKF.witness||{};const act=[0,1,3,4,6,7,9,10,12];const pas=[2,5,8,11,13,14];return {u,builds:B.map(b=>b.k+':'+b.doc+':'+b.pa.join(',')),sk:act.filter(i=>typeof sk[i]!=='function'),pas:pas.filter(i=>typeof sk[i]==='function'),sv:(__g.SKV.witness&&Object.keys(__g.SKV.witness).length)||0,skt:!!(__g.SKT&&__g.SKT.witness)}})
if(tables.u.sort().join(',')!=='carbon,press')fail('uniques '+tables.u.join(','));
if(tables.builds.join(' ; ')!=='page:editor:2,8,11 ; party:stringer:13,5,2 ; risk:corrections:14,11,8,2')fail('builds '+tables.builds.join(' ; '));
if(tables.sk.length)fail('missing SKF '+tables.sk.join(','));
if(tables.pas.length)fail('passive has SKF '+tables.pas.join(','));
if(tables.sv!==15)fail('SKV '+tables.sv);
if(tables.skt)fail('SKT.witness should stay unset');
const titleBox=await p.evaluate(()=>{const b=document.querySelector('[data-cls=witness]');const t=document.getElementById('title');if(b&&t){const br=b.getBoundingClientRect(),tr=t.getBoundingClientRect();t.scrollTop+=br.top-tr.top-Math.max(24,(tr.height-br.height)/2)}const r=b.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,text:b.innerText.slice(0,40),scroll:t.scrollTop}});
if(titleBox.top<8||titleBox.bottom>836)fail('witness button off screen '+JSON.stringify(titleBox));
await p.screenshot({path:path.join(shot,'witness_title.png')});
await p.evaluate(()=>__g.newGame('witness'));
await clear(20);
const boot=await p.evaluate(()=>({cls:__g.G.cls,mode:__g.mode,st:!!(__g.G.st)}));
if(boot.cls!=='witness'||boot.mode!=='play'||!boot.st)fail('boot '+JSON.stringify(boot));
await p.evaluate(()=>{__g.enter(1);__g.G.god=true});
await clear(16);
const fight=await p.evaluate(()=>{
  const g=__g,out={};
  const log=()=>document.getElementById('log').textContent;
  const arm=i=>{g.G.sk[i]=Math.max(g.G.sk[i]||0,1);g.G.slots[0]=i;g.G.en=999;g.P.cd[i]=0;g.P.castWait=0;g.P.atk=0;g.P.witHold=0;g.P.witCast=0;g.calc()};
  const near=()=>{for(const [dx,dy] of [[.8,0],[-.8,0],[0,.8],[.6,.6],[1.2,0]]){const e=g.spawn('tick',g.P.x+dx,g.P.y+dy,null);if(e){e.hp=e.max=800;return e}}return null};
  g.G.god=true;g.setMode('play');g.W.ents.splice(0);g.render();
  g.G.page=0;g.update(.5);out.idle=g.G.page;
  const foe=near();out.spawned=!!foe;if(foe)foe.stun=8;g.render();
  const before=g.G.page;g.update(.4);out.rose=g.G.page-before;
  const mid=g.G.page;g.attack();g.update(.05);out.atkDelta=g.G.page-mid;out.ownLt=foe&&foe.lt;
  arm(0);const c0=g.G.page;g.cast(0);g.update(.05);out.castDelta=g.G.page-c0;out.look=foe&&(foe.tes||0)>0;
  if(foe){foe.hp=800;g.G.page=0;arm(4);const hp=foe.hp;g.cast(0);out.blankHp=foe.hp===hp;out.blankCd=g.P.cd[4]===0;out.blankLog=/The page is blank/.test(log())}
  g.W.ents.splice(0);
  const a=near(),c=near();
  if(a&&c){a.tes=6;c.tes=0;a.hp=c.hp=a.max=c.max=5000;arm(9);g.G.page=40;g.cast(0);out.onRec=a.onRecT>0&&a.onRecM>1;
    g.S.crit=0;g.S.dmin=g.S.dmax=20;g.S.shock=0;const ha=a.hp,hc=c.hp;g.hit(a,1);g.hit(c,1);out.markLoss=ha-a.hp;out.plainLoss=hc-c.hp;out.second=out.markLoss>out.plainLoss&&out.plainLoss>0}
  g.G.pas=[13];g.G.sk[13]=1;g.calc();g.S.crit=0;g.S.dmin=g.S.dmax=20;g.S.shock=0;
  if(a&&c){a.onRecT=0;a.onRecM=0;c.onRecT=0;a.tes=5;c.tes=0;a.hp=c.hp=5000;const ha=a.hp,hc=c.hp;g.hit(a,1);g.hit(c,1);out.namedSelf=Math.abs((ha-a.hp)-(hc-c.hp))<0.01}
  g.G.pas=[14];g.G.sk[14]=1;g.G.sk[13]=0;g.calc();g.G.god=false;g.P.inv=0;g.setMode('play');g.G.page=90;g.G.hp=30;g.hurt(1e9,false,null);
  out.saved=g.G.hp===1&&g.G.page===0&&g.mode!=='dying';
  g.G.page=0;g.G.hp=30;g.P.inv=0;g.G.god=false;g.setMode('play');g.hurt(1e9,false,null);out.died=g.mode==='dying';
  g.G.hp=g.S.maxHp;g.G.en=g.S.maxEn;g.G.god=true;g.setMode('play');const death=document.getElementById('death');if(death)death.hidden=true;
  g.W.ents.splice(0);const src=near();
  g.G.merc={k:'hound',hp:100,dead:false,name:'Kit'};
  g.W.merc={x:g.P.x+1,y:g.P.y,r:.28,hp:100,max:100,cd:0,ph:0,flash:0,swing:0,fx:1,armM:1,soundSwing:0};
  arm(10);g.G.page=40;g.cast(0);out.granted=!!(g.W.merc&&g.W.merc.soundSwing===1);
  if(src){src.hp=src.max=800;g.P.atk=0;g.attack();out.ownSound=src.lt==='sound';out.ownType=src.lt||'';
    src.aggro=true;src.hp=800;g.W.merc.x=src.x;g.W.merc.y=src.y;g.W.merc.cd=0;
    g.update(.05);out.allySound=src.lt==='sound';out.spentSwing=g.W.merc.soundSwing===0}
  const keep=g.G.page;g.P.tag=1;g.P.page=50;if(src){src.hp=800;g.SKF.witness[1](1,1)}out.tagSpent=g.P.page<50&&g.G.page===keep;g.P.tag=0;g.P.page=0;
  g.W.ents.splice(0);g.G.page=72;g.render();
  return out});
const want={idle:0,spawned:true,look:true,blankHp:true,blankCd:true,blankLog:true,onRec:true,second:true,namedSelf:true,saved:true,died:true,granted:true,ownSound:false,allySound:true,spentSwing:true,tagSpent:true};
if(!(fight.rose>1))fail('record did not rise '+JSON.stringify(fight));
if(!(fight.atkDelta<0.05))fail('attack did not stop the rise '+JSON.stringify(fight));
if(!(fight.castDelta<0.05))fail('cast did not stop the rise '+JSON.stringify(fight));
for(const k in want)if(fight[k]!==want[k])fail(k+' got '+JSON.stringify(fight[k])+' want '+JSON.stringify(want[k]));
await p.evaluate(()=>{const s=document.getElementById('scene');if(s)s.hidden=true;const d=document.getElementById('dlg');if(d)d.hidden=true;__g.G.god=true;__g.G.page=72;__g.W.ents.splice(0);__g.setMode('play');__g.render()});
await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
const bar=await p.evaluate(()=>{const rec=document.getElementById('rec'),f=document.getElementById('recF');return {hidden:rec.hidden,width:f.style.width,rec:__g.G.page,cls:__g.G.cls}});
if(bar.hidden||bar.cls!=='witness'||bar.width!=='72%')fail('record bar '+JSON.stringify(bar));
await p.screenshot({path:path.join(shot,'witness_record.png')});
await p.evaluate(()=>{const g=__g;g.W.ents.splice(0);const e=g.spawn('tick',g.P.x+.9,g.P.y,null);if(e){e.hp=e.max=400;e.tes=3}g.G.sk[0]=1;g.G.slots[0]=0;g.G.en=99;g.P.cd[0]=0;g.G.page=72;g.cast(0);g.render()});
await p.screenshot({path:path.join(shot,'witness_cast.png')});
await clear(8);
const sheet=await p.evaluate(()=>{__g.openSheet('skills');document.querySelector('[data-node="8"]').click();const h=document.getElementById('sheetIn').innerHTML+document.getElementById('pop').innerHTML;__g.closeSheet();__g.openSheet('codex');const c=document.getElementById('sheetIn').innerHTML;__g.closeSheet();return {skills:h,codex:c}});
if(!sheet.skills.includes('Look')||!sheet.skills.includes('Stringer')||!sheet.skills.includes('Editor')||!sheet.skills.includes('Corrections'))fail('skills sheet missing class text');
if(!/Maximum life is \d+% lower/.test(sheet.skills))fail('footnote life cost missing');
if(!sheet.codex.includes('Notebook')||!sheet.codex.includes('Stub Pencil')||!sheet.codex.includes('Court Pad')||!sheet.codex.includes('Bound Minutes')||!sheet.codex.includes('The Seventh Part'))fail('codex missing notebook');
await p.evaluate(()=>{const G=__g.G;G.lvl=60;G.act2=G.act3=true;G.sp=90;G.sats=40;G.ap=12;G.god=true;G.cls='witness'});
const apply=async(key)=>{
  await p.evaluate(()=>__g.openSheet('shift',{}));
  await p.waitForTimeout(80);
  if(key==='0')await p.click('[data-shift="witness|0"]');
  else{await p.click('[data-shiftp="witness"]');await p.waitForTimeout(80);await p.click('[data-shift="witness|'+key+'"]')}
  await clear(18)};
await apply('page');
const page=await p.evaluate(()=>{const G=__g.G;return {doc:G.doc,sent:G.sk[1]>0,thread:G.sk[4]>0,corr:G.sk[6]>0,pas:(G.pas||[]).slice().sort((a,b)=>a-b).join(',')}});
if(page.doc!=='editor'||!page.sent||!page.thread||!page.corr)fail('page build '+JSON.stringify(page));
await apply('party');
const party=await p.evaluate(()=>{const G=__g.G;return {doc:G.doc,look:G.sk[0]>0,on:G.sk[9]>0,src:G.sk[10]>0,named:(G.pas||[]).includes(13)}});
if(party.doc!=='stringer'||!party.look||!party.on||!party.src||!party.named)fail('party build '+JSON.stringify(party));
await apply('risk');
const risk=await p.evaluate(()=>{const G=__g.G;return {doc:G.doc,red:G.sk[7]>0,corr:G.sk[6]>0,ret:(G.pas||[]).includes(14)&&G.sk[14]>0,n:(G.pas||[]).length}});
if(risk.doc!=='corrections'||!risk.red||!risk.corr||!risk.ret||risk.n>4)fail('risk build '+JSON.stringify(risk));
await apply('0');
const assign=await p.evaluate(()=>{const G=__g.G;return {s0:G.sk[0],rest:G.sk.slice(1).every(v=>!v),slot:G.slots[0],rec:G.page||0}});
if(assign.s0!==1||!assign.rest||assign.slot!==0||assign.rec!==0)fail('assign '+JSON.stringify(assign));
const comp=await p.evaluate(async()=>{
  const g=__g,P=g.P;
  g.G.cls='witness';g.G.page=15;g.W.ents.splice(0);
  g.G.tag={cls:'witness',lvl:4,name:'Witness',sk:[[1,1]],eq:{},page:0};
  g.W.tag={x:P.x-.8,y:P.y+.7,r:.3,hp:80,max:80,page:0,sc:[99],dir:{x:1,y:0},flash:0,moving:false,buff:0,haste:0,guard:0,dash:null,stealth:0,tag:1,swing:0,atk:0,walkPh:0,spin:0};
  let e=null;for(const [dx,dy] of [[2.4,.2],[2.8,0],[-2.4,.3],[0,2.6]]){e=g.spawn('tick',P.x+dx,P.y+dy,null);if(e)break}if(e){e.hp=e.max=400}
  g.render();
  const draw=window.__tagDraw||'';
  g.G.cls='scrapper';
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  const hidden=document.getElementById('rec').hidden;
  if(e)g.update(.3);
  const tagRec=g.W.tag.page||0,playerRec=g.G.page;
  g.G.cls='witness';g.calc();
  return {draw,hidden,tagRec,playerRec}});
if(comp.draw)fail('companion draw '+comp.draw);
if(!comp.hidden)fail('record bar showed for a non-witness');
if(!(comp.tagRec>0)||comp.playerRec!==15)fail('companion record '+JSON.stringify(comp));
console.log(errs.length?'ERRORS:\n'+errs.slice(0,24).join('\n'):'witness ok');
if(errs.length)console.log('fight '+JSON.stringify(fight));
await b.close();process.exit(errs.length?1:0)})();
