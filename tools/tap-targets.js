/* Step 2: phone tap targets must be at least 44x44 CSS px, and must not overlap or be clipped.
   node tools/tap-targets.js          (set TT_SHOTS=dir to also write screenshots, TT_HTML=file to test another build)
   Measures at 844x390 and 390x844 with touch emulation: sheet tab bar (9 buttons), Dodge, Stim,
   pack cells, paper-doll cells, vendor category tabs. Fails on the pre-step-2 build. */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const html=fs.readFileSync(process.env.TT_HTML||path.join(__dirname,'..','dist/unsubscribe.html'),'utf8');
const shots=process.env.TT_SHOTS||'';
const fail=[];const check=(n,ok,d)=>{if(!ok)fail.push(n+(d?': '+d:''))};
const MIN=44;const TOL=3; // overlaps up to 3px are the existing 1-2px touching of round pad buttons

async function open(b,vp){
  const ctx=await b.newContext({viewport:vp,hasTouch:true,isMobile:true});
  const p=await ctx.newPage();p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));
  await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
  await p.waitForTimeout(300);
  await p.evaluate(()=>{__g.skipDisc();__g.OPT.noWalk=1});
  await p.waitForTimeout(150);
  await p.evaluate(()=>{document.getElementById('title').hidden=true;__g.newGame('scrapper');__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1});
  for(let i=0;i<12;i++){await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}});await p.waitForTimeout(60)}
  await p.evaluate(()=>{const s=document.getElementById('scene');if(s)s.hidden=true;const d=document.getElementById('dlg');if(d)d.hidden=true;__g.setMode('play')});
  await p.waitForTimeout(300);
  await p.evaluate(()=>{const b=document.querySelector('#uiPort button');if(b)b.click()});await p.waitForTimeout(100);
  return p;
}
const rects=(p,sel)=>p.evaluate(sel=>[...document.querySelectorAll(sel)].filter(e=>e.offsetParent!==null||getComputedStyle(e).position==='fixed').map(e=>{const r=e.getBoundingClientRect();return{t:(e.textContent||e.id||'').trim().slice(0,12),x:r.left,y:r.top,w:r.width,h:r.height}}),sel);
function sizes(name,list,min=1){
  check(name+': found at least '+min,list.length>=min,'found '+list.length);
  const bad=list.filter(r=>r.w<MIN-0.5||r.h<MIN-0.5);
  check(name+': all >=44x44',bad.length===0,bad.length+' of '+list.length+' too small, e.g. '+bad.slice(0,3).map(r=>r.t+' '+r.w.toFixed(0)+'x'+r.h.toFixed(0)).join(', '));
  return list;
}
function noOverlap(name,list,vp){
  let o=[];
  for(let i=0;i<list.length;i++)for(let j=i+1;j<list.length;j++){const a=list[i],c=list[j];
    if(a.x<c.x+c.w-TOL&&c.x<a.x+a.w-TOL&&a.y<c.y+c.h-TOL&&c.y<a.y+a.h-TOL)o.push(a.t+'/'+c.t)}
  check(name+': no overlap',o.length===0,o.slice(0,3).join(', '));
  const out=list.filter(r=>r.x<-0.5||r.y<-0.5||r.x+r.w>vp.width+0.5||r.y+r.h>vp.height+0.5);
  check(name+': inside screen',out.length===0,out.slice(0,3).map(r=>r.t+' '+r.x.toFixed(0)+','+r.y.toFixed(0)+' '+r.w.toFixed(0)+'x'+r.h.toFixed(0)).join(', '));
}
const shot=async(p,n)=>{if(shots)await p.screenshot({path:path.join(shots,'step2-'+process.env.TT_TAG+'-'+n+'.png')})};

(async()=>{try{
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
for(const [tag,vp] of [['p',{width:390,height:844}],['l',{width:844,height:390}]]){
  const nm=(vp.width>vp.height?'landscape':'portrait')+' '+vp.width+'x'+vp.height;
  process.env.TT_TAG=process.env.TT_TAG0||process.env.TT_TAG||'x';
  const p=await open(b,vp);
  // main HUD: Dodge + Stim must be >=44 and clear of the other pad buttons
  await p.evaluate(()=>{const G=__g.G;G.pot=Math.max(G.pot||0,3)});
  await shot(p,tag+'-hud');
  const dodge=sizes(nm+' HUD Dodge/Stim',await rects(p,'#bDodge,#bPot'),2);
  const pad=await rects(p,'#pad .sk,#bAtk,#bDodge,#bPot');
  noOverlap(nm+' HUD pad',pad,vp);
  // inventory
  await p.evaluate(()=>{const G=__g.G;for(const k of ['lvl'])G[k]=12;__g.calc();__g.openSheet('items')});await p.waitForTimeout(500);
  await shot(p,tag+'-inventory');
  sizes(nm+' sheet tabs (9)',await rects(p,'#sheet .shead .tab'),9);
  const tabs=await rects(p,'#sheet .shead .tab');noOverlap(nm+' sheet tabs',tabs,vp);
  sizes(nm+' paper-doll cells',await rects(p,'#sheet .doll .cell'),8);
  sizes(nm+' pack cells',await rects(p,'#sheet .grid .cell'),6);
  noOverlap(nm+' doll cells',await rects(p,'#sheet .doll .cell'),vp.width>9999?vp:{width:vp.width,height:1e5});
  const sc=await p.evaluate(()=>{const s=document.querySelector('#sheet .sheetBody');return s?{sh:s.scrollHeight,ch:s.clientHeight}:null});
  // skills / tabs
  await p.evaluate(()=>__g.openSheet('skills'));await p.waitForTimeout(400);
  await shot(p,tag+'-skills');
  sizes(nm+' skills tabs',await rects(p,'#sheet .shead .tab'),9);
  // vendor
  await p.evaluate(()=>{__g.closeSheet();__g.G.sats=50;__g.G.cred=500;__g.openVend('brenda')});await p.waitForTimeout(500);
  await shot(p,tag+'-vendor');
  sizes(nm+' vendor category tabs',await rects(p,'.vendTabs button'),3);
  sizes(nm+' vendor Merchant/You toggle',await rects(p,'.vendToggle button'),vp.width<=720?2:0);
  noOverlap(nm+' vendor tabs',await rects(p,'.vendTabs button'),{width:vp.width,height:1e5});
  check(nm+': no page errors',p.errs.length===0,p.errs[0]);
}
await b.close();
}catch(e){fail.push('crash: '+e.message)}
if(fail.length){console.log(fail.length+' failed checks:\n - '+fail.join('\n - '));process.exit(1)}
console.log('tap-targets ok')})();
