/* Walks the prequel and Acts IV-V end to end and screenshots the beats.
   Usage: node tools/smoke-acts.js [outdir]   (outdir defaults to a temp folder) */
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
const p=await b.newPage({viewport:{width:390,height:780}});const errs=[];p.on('pageerror',e=>errs.push(e.message+(e.stack||'').split('\n')[1]));
const S=process.argv[2]||require('path').join(require('os').tmpdir(),'smoke-acts');require('fs').mkdirSync(S,{recursive:true});
const GAME=require('path').join(__dirname,'..','dist','unsubscribe.html');
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+require('fs').readFileSync(GAME,'utf8')+'</body></html>');
await p.waitForTimeout(700);await p.evaluate(()=>__g.skipDisc());await p.waitForTimeout(260);await p.click('[data-cls=hacker]');await p.waitForTimeout(900);
const sk=async(n=14)=>{for(let i=0;i<n;i++){await p.evaluate(()=>{if(!document.getElementById('scene').hidden)document.getElementById('scSkip').click();const d=document.getElementById('dlg');if(!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}});await p.waitForTimeout(120)}};
const st=()=>p.evaluate(()=>{const g=__g;return g.mode+' | zone '+(g.W?g.W.zi+' '+g.W.z.n:'-')+' | '+JSON.stringify(g.storyStep())});
console.log('zones',await p.evaluate(()=>__g.ZONES.length+' '+__g.ZONES[21].n+' / '+__g.ZONES[27].n+' / '+__g.ZONES[33].n));
await sk(6);console.log(await st());await p.waitForTimeout(400);await p.screenshot({path:S+'/pre.png'});
for(const id of ['p2','p0','p1','p2','p3','p4','p5']){await p.evaluate(id=>__g.talkTo(id),id);await p.waitForTimeout(200);
  if(id==='p4'){await sk(4);await p.evaluate(()=>{const bs=[...document.querySelectorAll('#dBtns button')];bs[1]&&bs[1].click()});await p.waitForTimeout(200)}
  await sk(8);console.log(id,await st())}
console.log('sp',await p.evaluate(()=>__g.G.sp+' pre '+__g.G.pre+' q1 '+__g.G.q.q1));
// jump to end of act III
await p.evaluate(()=>{const g=__g,G=g.G;G.god=true;G.lvl=75;G.act2=G.act3=true;for(let i=1;i<=15;i++)G.q['q'+i]=3;G.unlocked=22;G.sats=500;g.enter(0)});await sk();
console.log(await st());await p.evaluate(()=>__g.talkTo('gramps'));await sk();console.log(await st());
const runAct=async(town,zs,gramps)=>{await p.evaluate(t=>__g.enter(t),town);await sk();console.log(await st());
 for(const zi of zs){await p.evaluate(zi=>__g.enter(zi),zi);await sk();
  const r=await p.evaluate(()=>{const g=__g,W=g.W;const t=W.ents.find(e=>e.su)||W.boss;if(!t)return 'NO TARGET';g.P.x=t.x+1.5;g.P.y=t.y;for(let i=0;i<30;i++)g.update(1/60);return t.name||t.k});
  await p.waitForTimeout(300);await sk(8);
  if(zi===26||zi===32){await p.evaluate(()=>{const g=__g;for(let i=0;i<60*6;i++){if(g.mode==='play')g.update(1/60)}});await p.screenshot({path:S+'/boss'+zi+'.png'});
    await p.evaluate(()=>{const b=__g.W.boss;b.hp=b.max*.45});await p.evaluate(()=>{for(let i=0;i<20;i++)__g.update(1/60)});await p.waitForTimeout(300);console.log(' mid',await p.evaluate(()=>__g.mode+' '+document.getElementById('dT')?.textContent));await p.waitForTimeout(4300);await sk(4);
    await p.evaluate(()=>{const b=__g.W.boss;if(b)b.hp=b.max*.2});await p.evaluate(()=>{for(let i=0;i<20;i++)if(__g.mode==='play')__g.update(1/60)});await p.waitForTimeout(4300);await sk(4)}
  await p.evaluate(()=>{const g=__g,W=g.W;const t=W.ents.find(e=>e.su)||W.boss;if(t)g.kill(t)});await p.waitForTimeout(1700);
  if(zi===32){await p.waitForTimeout(600);for(let i=0;i<10;i++){await p.evaluate(()=>{if(!document.getElementById('scene').hidden)document.getElementById('scSkip').click()});await p.waitForTimeout(150)}console.log(' final',await p.evaluate(()=>__g.mode+' '+[...document.querySelectorAll('#dBtns button')].map(b=>b.textContent).join(' | ')));await p.screenshot({path:S+'/final.png'});await p.waitForTimeout(4300);await p.evaluate(()=>{const bs=[...document.querySelectorAll('#dBtns button')];bs[bs.length-1].click()});await p.waitForTimeout(300)}
  await sk(12);console.log(zi,r,'|',await st());
  await p.evaluate(()=>{const g=__g;g.enter(g.G.town)});await sk(4);for(const n of ['gramps','null','nonce','marrow'])await p.evaluate(n=>__g.talkTo(n),n).then(()=>sk(3))}
 console.log('after act',await st(),await p.evaluate(()=>'sp '+__g.G.sp+' sats '+__g.G.sats+' module '+__g.G.module+' ending '+__g.G.ending+' unlocked '+__g.G.unlocked));
 await p.evaluate(()=>__g.talkTo('gramps'));await sk();console.log(await st())};
await runAct(21,[22,23,24,25,26]);
await p.evaluate(()=>__g.openSheet('travel',{only:['travel']}));await p.screenshot({path:S+'/gate.png'});await p.evaluate(()=>__g.closeSheet());
await runAct(27,[28,29,30,31,32]);
await p.evaluate(()=>__g.enter(27));await sk();await p.evaluate(()=>__g.talkTo('drive'));await p.waitForTimeout(200);await p.screenshot({path:S+'/garage.png'});
console.log(errs.length?'ERRORS: '+errs.slice(0,6).join(' | '):'no page errors');console.log('shots in '+S);await b.close();process.exit(errs.length?1:0)})();
