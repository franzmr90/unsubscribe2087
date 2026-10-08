/* ================= forks, dodge, web, charms, crafting, subpoenas, lender, proof of work ================= */
const FORKS={over:{n:'Overclock',d:'+35% damage, costs 50% more energy',dm:1.35,cost:1.5},lean:{n:'Lean',d:'Costs 40% less energy and recovers 25% faster',cost:.6,cd:.75},echo:{n:'Echo',d:'25% chance to fire a second time for free'},siphon:{n:'Siphon',d:'Each use restores 4% of your life'},burn:{n:'Aftermath',d:'Leaves a burning patch where you stand for 4 seconds'}};
const forkOf=i=>FORKS[(G.fork||{})[i]]||{};
function forkAfter(i,L){const f=forkOf(i),k=(G.fork||{})[i];if(k==='siphon')heal(S.maxHp*.04);
  if(k==='burn'){W.pat=W.pat||[];W.pat.push({x:P.x,y:P.y,t:4,c:0})}
  if(k==='echo'&&Math.random()<.25)setTimeout(()=>{if(mode==='play'&&G.hp>0){float(P.x,P.y,'Echo','#59e0e6',1);SKF[G.cls][i](L,syn(i))}},350)}
function dodge(){if(mode!=='play'||P.dash)return;if(typeof hsNoDash==='function'&&hsNoDash()){dash(12,.2,0);return}const g=P.dg=P.dg||{n:2,t:0};if(g.n<1){sfx('err');return}g.n--;unstealth&&0;dash(12,.2,0);sfx('dash');if(S.sp.e82)P.e82=3}
/* the ledger web */
const WARMS=[['Might','dmg',3,10,'Leverage',{dmg:35,hpP:-12}],['Flesh','hp',12,40,'Cold Storage',{hpP:22,dmg:-12}],['Plate','armorP',6,20,'Air Gap',{armorP:50,mspd:-8}],['Nerve','crit',1,3,'Conviction',{crit:10,armorP:-25}],
 ['Current','en',6,20,'Lightning Channel',{cdr:.12,en:-20}],['Stride','mspd',1.5,4,'Velocity',{aspd:18,hpP:-10}],['Fortune','mf',4,14,'Stacker',{mf:40,dmg:-10}],['Thirst','regenH',.5,2,'Full Reserve',{leech:3,en:-15}]];
const WEBT={hpP:'{v}% life',cdr:'{v}% faster skill recovery'};
function webNode(id){if(id==='c')return{id,n:'The Genesis Node',m:{},a:-1,r:0};const[a,r]=id.split('_').map(Number),A=WARMS[a];if(!A||!r||r>10)return null;
  if(r===10)return{id,a,r,n:A[4],m:A[5],key:1};if(r===5)return{id,a,r,n:'Greater '+A[0],m:{[A[1]]:A[3]},big:1};return{id,a,r,n:A[0],m:{[A[1]]:A[2]}}}
function webAdj(id){if(id==='c')return WARMS.map((x,a)=>a+'_1');const[a,r]=id.split('_').map(Number),o=[r===1?'c':a+'_'+(r-1)];if(r<10)o.push(a+'_'+(r+1));if(r%3===0){o.push((a+1)%8+'_'+r,(a+7)%8+'_'+r)}return o}
const webPts=()=>G.lvl-1+(G.para||0)-Object.keys(G.web||{}).length;
function webNext(a){for(let r=1;r<=10;r++)if(!G.web[a+'_'+r])return a+'_'+r;return null}
const webCan=id=>!G.web[id]&&webPts()>0&&webAdj(id).some(n=>n==='c'||G.web[n]);
const modTxt=m=>Object.keys(m).map(k=>{const v=k==='cdr'?Math.round(m[k]*100):m[k];return (v>0?'+':'')+(WEBT[k]||AFK[k].t.replace(/^\+/,'')).replace('{v}',v)}).join(', ');
let webVB=null,webFitVB=null,webArm=-1,webHelpOpen=false,webPanMoved=0,SB=null,SUBP=null;
/* The world box is larger than the outermost node so the arm names sit inside the fit, with room for the word itself. */
const WEB=1160,WEBC=580,WEBR=40;
function webClientToWorld(svg,x,y){if(!svg||!svg.createSVGPoint)return null;const pt=svg.createSVGPoint();pt.x=x;pt.y=y;const m=svg.getScreenCTM();if(!m)return null;const q=pt.matrixTransform(m.inverse());return {x:q.x,y:q.y}}
function webApply(){const svg=document.querySelector('#webStage svg');if(!svg||!webVB)return;svg.setAttribute('viewBox',webVB.x+' '+webVB.y+' '+webVB.w+' '+webVB.h)}
function webClamp(){if(!webVB)return;const m=140;if(webVB.x>WEB-m)webVB.x=WEB-m;if(webVB.y>WEB-m)webVB.y=WEB-m;if(webVB.x+webVB.w<m)webVB.x=m-webVB.w;if(webVB.y+webVB.h<m)webVB.y=m-webVB.h}
function webFit(){const stage=$('webStage');if(!stage)return;const r=stage.getBoundingClientRect();
  if(r.width<20||r.height<20){webVB={x:0,y:0,w:WEB,h:WEB};webFitVB=Object.assign({},webVB);webApply();if(!webFit._t){webFit._t=1;requestAnimationFrame(()=>{webFit._t=0;if($('webStage'))webFit()})}return}
  const a=r.width/r.height;let w,h;if(a>=1){h=WEB;w=WEB*a}else{w=WEB;h=WEB/a}
  webVB={x:(WEB-w)/2,y:(WEB-h)/2,w:w,h:h};webFitVB=Object.assign({},webVB);webApply()}
function webZoomAt(factor,wx,wy){if(!webVB)webFit();if(!webVB)return;const cap=webFitVB?webFitVB.w:WEB,aspect=webVB.h/webVB.w;let nw=webVB.w/factor;if(nw>cap)nw=cap;if(nw<280)nw=280;const nh=nw*aspect;
  if(wx==null){wx=webVB.x+webVB.w/2;wy=webVB.y+webVB.h/2}const rx=(wx-webVB.x)/webVB.w,ry=(wy-webVB.y)/webVB.h;webVB.w=nw;webVB.h=nh;webVB.x=wx-rx*nw;webVB.y=wy-ry*nh;webClamp();webApply()}
function webTipHTML(id){const n=webNode(id);if(!n)return '';const half=n.a>=0&&!n.key&&webWeak(n.a);let mods=n.m;if(half){mods={};for(const k in n.m)mods[k]=n.m[k]/2}const body=n.id==='c'?'Where every path starts.':modTxt(mods);
  const note=half?' Halved: '+WARMS[(n.a+4)%8][0]+', across the web, has more of your points.':'';
  const state=n.id==='c'||G.web[n.id]?'Placed.':webCan(n.id)?'Lit. Tap to place a point.':webPts()>0?'Not connected yet.':'No points left.';
  return '<b>'+n.n+'</b> '+body+note+' <i>'+state+'</i>'}
function webShowTip(id){const tip=$('webTip');if(!tip)return;if(!id){tip.hidden=true;tip.innerHTML='';return}tip.hidden=false;tip.innerHTML=webTipHTML(id)}
function webBind(){if(!webVB)webFit();else webApply();const stage=$('webStage');if(!stage)return;const svg=stage.querySelector('svg');
  if(sel&&sel.web)webShowTip(sel.web);
  const help=$('webHelp');if(help)help.addEventListener('toggle',()=>{webHelpOpen=help.open;webFit()});
  stage.addEventListener('wheel',e=>{e.preventDefault();const p=webClientToWorld(svg,e.clientX,e.clientY);webZoomAt(e.deltaY<0?1.12:1/1.12,p&&p.x,p&&p.y)},{passive:false});
  const pts=new Map();let pan=null,pinch=null;
  stage.addEventListener('pointerdown',e=>{if(e.button>1)return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(pts.size>=2){try{stage.setPointerCapture(e.pointerId)}catch(err){}const a=[...pts.values()];pinch={d:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)||1,w:webVB.w,h:webVB.h,x:webVB.x,y:webVB.y};pan=null;return}
    const r=stage.getBoundingClientRect();pan={id:e.pointerId,x:e.clientX,y:e.clientY,ox:webVB.x,oy:webVB.y,s:(r.width||1)/webVB.w,moved:false}});
  stage.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(pts.size>=2&&pinch){const a=[...pts.values()],d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)||1,factor=d/pinch.d;const cap=webFitVB?webFitVB.w:WEB;let nw=pinch.w/factor;if(nw>cap)nw=cap;if(nw<280)nw=280;const nh=nw*(pinch.h/pinch.w),cx=pinch.x+pinch.w/2,cy=pinch.y+pinch.h/2;webVB={x:cx-nw/2,y:cy-nh/2,w:nw,h:nh};webClamp();webApply();webPanMoved=1;return}
    if(!pan||e.pointerId!==pan.id)return;const dx=e.clientX-pan.x,dy=e.clientY-pan.y;if(Math.hypot(dx,dy)<=6)return;pan.moved=true;stage.classList.add('panning');try{stage.setPointerCapture(e.pointerId)}catch(err){}webVB.x=pan.ox-dx/pan.s;webVB.y=pan.oy-dy/pan.s;webClamp();webApply()});
  const end=e=>{const moved=pan&&pan.id===e.pointerId&&pan.moved;pts.delete(e.pointerId);if(pan&&pan.id===e.pointerId)pan=null;if(pts.size<2)pinch=null;stage.classList.remove('panning');if(moved)webPanMoved=1};
  stage.addEventListener('pointerup',end);stage.addEventListener('pointercancel',end);
  stage.addEventListener('pointerover',e=>{const n=e.target.closest&&e.target.closest('[data-web]');if(n)webShowTip(n.dataset.web)});
  stage.addEventListener('pointerleave',()=>webShowTip(sel&&sel.web));
  stage.addEventListener('contextmenu',e=>{const n=e.target.closest&&e.target.closest('[data-web]');if(!n)return;e.preventDefault();e.stopPropagation();const id=n.dataset.web;sel={web:id};webShowTip(id);
    toast(G.web[id]?'A single node does not come back. Refund all, in the bar, takes every point back for 5 sats.':'Tap a lit node to place a point.')});
  const pane=stage.parentNode;pane.querySelectorAll('[data-webzoom],[data-webfit]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();sfx('ui');
    if(b.dataset.webfit){webFit();return}const r=svg.getBoundingClientRect(),p=webClientToWorld(svg,r.left+r.width/2,r.top+r.height/2);webZoomAt(b.dataset.webzoom==='in'?1.22:1/1.22,p&&p.x,p&&p.y)}))}
function webKey(e){const stage=$('webStage');if(!stage||mode!=='sheet'||tab!=='web')return false;const svg=stage.querySelector('svg');
  const zoom=f=>{const r=svg.getBoundingClientRect(),p=webClientToWorld(svg,r.left+r.width/2,r.top+r.height/2);webZoomAt(f,p&&p.x,p&&p.y)};
  if(e.code==='Equal'||e.code==='NumpadAdd'){zoom(1.22);e.preventDefault();return true}
  if(e.code==='Minus'||e.code==='NumpadSubtract'){zoom(1/1.22);e.preventDefault();return true}
  if(e.code==='Digit0'||e.code==='KeyF'){webFit();e.preventDefault();return true}
  const pan={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.code];
  if(pan&&webVB){webVB.x+=pan[0]*webVB.w*.08;webVB.y+=pan[1]*webVB.h*.08;webClamp();webApply();e.preventDefault();return true}
  return false}
function webSvg(){const C=WEBC,R=WEBR,pos=id=>{if(id==='c')return[C,C];const[a,r]=id.split('_').map(Number),an=a*Math.PI/4-Math.PI/2;return[C+Math.cos(an)*r*R,C+Math.sin(an)*r*R]};
  const armOf=id=>id==='c'?-1:+id.split('_')[0];
  let ln='',nd='';const ids=['c'];for(let a=0;a<8;a++)for(let r=1;r<=10;r++)ids.push(a+'_'+r);
  for(const id of ids){const p=pos(id),n=webNode(id),on=id==='c'||G.web[id],can=id!=='c'&&webCan(id),vr=n.key?16:n.big?13:id==='c'?14:10;
    for(const o of webAdj(id))if(o<id||o==='c'){const q=pos(o),both=on&&(o==='c'||G.web[o]),dim=webArm>=0&&armOf(id)!==webArm&&armOf(o)!==webArm;
      ln+=`<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="${both?'#e0bd6e':'#3a3250'}" stroke-width="${both?3:1.5}" opacity="${dim?0.15:1}" stroke-dasharray="${both?'':'4 6'}"/>`}
    const dimN=webArm>=0&&n.a!==webArm&&id!=='c';
    nd+=`<g opacity="${dimN?0.28:1}"><circle data-web="${id}" cx="${p[0]}" cy="${p[1]}" r="${vr+14}" fill="transparent"/>`;
    nd+=`<circle cx="${p[0]}" cy="${p[1]}" r="${vr}" fill="${on?'#e0bd6e':can?'#1c3c48':'#14111c'}" stroke="${sel&&sel.web===id?'#fff':n.key?'#f7931a':can?'#59e0e6':'#4a4266'}" stroke-width="${sel&&sel.web===id?3:can||n.key?2.5:1}" pointer-events="none"/>`;
    if(can)nd+=`<circle cx="${p[0]}" cy="${p[1]}" r="${vr+5}" fill="none" stroke="#59e0e6" stroke-width="1.5" pointer-events="none"/>`;
    nd+=`</g>`}
  for(let a=0;a<8;a++){const an=a*Math.PI/4-Math.PI/2,dim=webArm>=0&&webArm!==a;nd+=`<text x="${C+Math.cos(an)*11.7*R}" y="${C+Math.sin(an)*11.7*R+4}" fill="#c8bda6" font-size="13" font-family="Cinzel,serif" text-anchor="middle" opacity="${dim?0.28:1}">${WARMS[a][0]}</text>`}
  if(webPts()>0)for(let a=0;a<8;a++){if(!G.web[a+'_1']||!webNext(a))continue;
    const p=pos(a+'_1'),an=a*Math.PI/4-Math.PI/2,px=Math.cos(an+Math.PI/2),py=Math.sin(an+Math.PI/2),x=p[0]+px*22,y=p[1]+py*22,dim=webArm>=0&&webArm!==a;
    nd+=`<g data-webadd="${a}" opacity="${dim?0.28:1}"><circle cx="${x}" cy="${y}" r="11" fill="transparent"/><circle cx="${x}" cy="${y}" r="9" fill="#10313a" stroke="#59e0e6" stroke-width="2" pointer-events="none"/><text x="${x}" y="${y+4.5}" fill="#59e0e6" font-size="14" font-weight="700" font-family="Cinzel,serif" text-anchor="middle" pointer-events="none">+</text></g>`}
  return `<svg viewBox="0 0 ${WEB} ${WEB}" preserveAspectRatio="xMidYMid meet">${ln}${nd}</svg>`}
function webPane(){const n=webPts(),chips=[[-1,'All']].concat(WARMS.map((a,i)=>[i,a[0]]));
  const bar=`<div class="webBar"><b class="pts">${n} point${n===1?'':'s'}</b><div class="webChips">${chips.map(([i,name])=>`<button class="ghost${webArm===i?' on':''}" data-webarm="${i<0?'all':i}">${name}</button>`).join('')}</div><button class="ghost" data-webzoom="out" aria-label="Zoom out">−</button><button class="ghost" data-webfit="1">Fit</button><button class="ghost" data-webzoom="in" aria-label="Zoom in">+</button><button class="ghost" data-webreset="1" ${(G.sats<5||!Object.keys(G.web||{}).length)?'disabled':''}>Refund all · 5 sats</button></div>`;
  const help=`<p class="webRule">Each level you gain adds one, and each Tenure adds one. You start with none.</p><details class="webHelp" id="webHelp"${webHelpOpen?' open':''}><summary>How the ledger works</summary><p>Each level you gain adds one, and each Tenure adds one. You start with none. Start at the centre and work outward along connected nodes; the arms join at rings 3, 6 and 9. Once an arm is started, a <b style="color:#59e0e6">+</b> appears beside its first node — tap that to put the next point straight onto the end of that arm without hunting for it. The orange node at the end of each arm is a keystone: a large gain with a real cost. <strong>Arms across from each other oppose:</strong> of each facing pair (Might and Current, Flesh and Stride, Plate and Fortune, Nerve and Thirst), the arm with fewer points pays out half. Drag the web to move it. The wheel, a pinch, or + and − zoom it, and Fit puts every arm back in view. Tap a lit node to place a point. A single node does not come back; Refund all takes every point back for 5 sats.</p></details>`;
  return `<div class="webPane">${bar}<div id="webStage" class="webStage">${webSvg()}<div id="webTip" class="webTip" hidden></div></div>${help}</div>`}
/* charms: small bonuses that work from the pack, so pack space is their price */
ICON.charm='M12 3a6 6 0 016 6c0 4-6 12-6 12S6 13 6 9a6 6 0 016-6zm0 3.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z';
const CHN=['Streaming','Meal Kit','Cloud Storage','Gym','Newsletter','Loyalty','Extended Warranty','Premium'];
function mkCharm(il){const t=pick([['dmg',3,6],['hp',8,20],['mf',4,8],['crit',1,2],['en',5,10],['mspd',1,3],['gold',8,15]]),m=1+il/40;
  return{slot:'charm',charm:1,q:1,il,id:true,req:1,base:'Lapsed Subscription',name:'Lapsed '+pick(CHN)+' Subscription',aff:[{k:t[0],v:Math.round(ri(t[1],t[2])*m*10)/10|0||1}],val:30+il*4,fl:'Kept in your subscriptions, not your pack. Six can run at once. Each running one bills a fee every minute, and the fee inflates.'}}
/* everything that adds to the hero outside gear and skills; returns extra life as a fraction */
function extra(s){let hp=0;const add=(k,v)=>{if(k==='hpP')hp+=v/100;else if(k==='cdr')s.cdr+=v;else s[k]=(s[k]||0)+v};
  const wc=webCount();for(const id in G.web||{}){const n=webNode(id);if(n){const half=!n.key&&n.a>=0&&wc[n.a]<wc[(n.a+4)%8];for(const k in n.m)add(k,half?n.m[k]/2:n.m[k])}}
  extra2(s,add);
  if(!G.charmOff)for(const it of G.charms||[])if(it.on)for(const a of it.aff)add(a.k,a.v);
  const p=G.para||0;s.dmg+=p;hp+=p/100;if(G.tpP)s.dmg+=G.tpP;if(G.tpT>0)s.dmg+=40;
  if(SB)for(const k in SB)add(k,SB[k]);
  if(G.merc&&!G.merc.dead&&G.merc.ab2==='coll'){s.mf+=15;s.gold+=25}
  if(G.hc)s.mf+=25;return hp}
/* the quarter: one world rule, changing weekly */
const SEAS=[{k:'stim',n:'Stimulus Quarter',d:'Credit drops are doubled and prices rise twice as fast.'},{k:'bull',n:'Bull Run',d:'Machines sometimes drop an extra sat and hit 15% harder.'},{k:'over',n:'Overtime',d:'+20% experience; machines have 15% more life.'}];
const SEA=SEAS[Math.floor(Date.now()/6048e5)%3];
const GOLDM=()=>SEA.k==='stim'?2:1;
const paraNeed=()=>xpNext(G.lvl)*.5*(1+.07*(G.para||0));
function paraXp(v){if((G.para||0)>=100){G.xp=0;return}if(!G.act3){const cap=xpNext(G.lvl);G.bankXp=Math.min(cap,(G.bankXp||0)+Math.max(0,v));G.xp=0;return}G.px=(G.px||0)+v;while(G.px>=paraNeed()&&(G.para||0)<100){G.px-=paraNeed();G.para=(G.para||0)+1;acctPara();calc();sfx('level');toast('Tenure '+G.para+': +1% damage and life, and a point for the web')}G.xp=G.px/paraNeed()*xpNext(G.lvl)}
/* subpoenas: sealed districts with rules of their own */
const SUBM={volatile:'Machines explode when they break',dry:'Stims do not work',bounty:'Machines drop extra sats',swift:'Machines move 30% faster',thick:'Machines have 50% more life'};
ZONES.push({n:'Sealed Proceedings',sub:true,lvl:1,style:'trib',amb:.6,mix:[['bot',3]],su:{k:'hr',n:'The Respondent',mods:['strong','shield'],q:null}});
const SUBZ=ZONES.length-1;
function subStart(l){if(G.sats<3){toast('Serving a subpoena costs 3 sats');sfx('err');return}G.sats-=3;const z=ZONES[SUBZ],src=ZONES[pick([2,4,5,7,9,11,12,13,14,15])],ks=Object.keys(SUBM).sort(()=>Math.random()-.5);
  SUBP={lvl:l,mods:ks.slice(0,l>=5?3:2)};z.n='Subpoena · Level '+l;z.lvl=G.lvl+2*l-G.tier*12;z.style=src.style;z.amb=src.amb;z.mix=src.mix;z.su.k=pick(['hr','mech','seer','lancer']);z.su.mods=['strong','shield','fast','arc','leech'].sort(()=>Math.random()-.5).slice(0,2);
  delete ZS[SUBZ];enter(SUBZ,{fresh:true,after(){W.sub=SUBP;W.portals=W.portals.filter(p=>p.kind!=='next');for(const p of W.portals)if(p.kind==='prev')p.kind='home';
    dlg(z.n,'Sealed proceedings. Find and break The Respondent. Rules in force: '+SUBP.mods.map(m=>SUBM[m]).join('; ')+'.',[['Enter']])}})}
function p7Spawn(e){e.hits=0;if(W.z.sim)return;const cl=G.lvl+(G.para||0)*.5;let h=1+.012*cl,d=1+.008*cl;if(W.pow){h*=1.3;d*=1.25}if(SEA.k==='bull')d*=1.15;if(SEA.k==='over')h*=1.15;
  if(W.z.sub&&SUBP){h*=(1+.15*SUBP.lvl)*(SUBP.mods.includes('thick')?1.5:1);d*=1+.1*SUBP.lvl;if(SUBP.mods.includes('swift'))e.spd*=1.3}
  e.hp*=h;e.max*=h;e.dmg*=d;adaptSpawn(e);
  const t=ET[e.k],ml=W.ml,bh=t.hp*(1+.42*(ml-1))*(e.su?5:e.champ?2.8:1)*(isBoss(e.k)?2.5:1),bd=t.dmg*(1+.22*(ml-1))*(e.champ?1.3:1)*(isBoss(e.k)?1.35:1);e.xpM=clamp(Math.sqrt(e.max/bh*e.dmg/bd)/1.27*(1+.15*Object.keys(e.mods).length),.4,5)}
function p7Kill(e){bullKill(e);if(S.sp.pod)P.haste=Math.max(P.haste,2);if(S.sp.orangepill&&(e.champ||e.su)){addDrop({sat:1},e.x,e.y);addAdopt(.2,'')}adaptKill(e);W.fx.push({k:'ring',x:e.x,y:e.y,r:e.champ||e.su?1.6:.9,t:0,life:.22,col:'#ffffff'});raidKill(e);if(P.fm&&P.fm.t>0&&P.fm.k==='refund')G.en=Math.min(S.maxEn,G.en+6);if(e.k==='shill')shillDie(e);const sb=W.sub;if(Math.random()<(e.champ||e.su?.1:.012))addDrop({it:mkCharm(W.ml)},e.x,e.y);
  if(SEA.k==='bull'&&Math.random()<.06)addDrop({sat:1},e.x,e.y);
  if(sb){if(sb.mods.includes('volatile'))W.fx.push({k:'warn',x:e.x,y:e.y,r:1.9,t:0,life:.8,boom:e.dmg*1.2});if(sb.mods.includes('bounty')&&Math.random()<.12)addDrop({sat:ri(1,2)},e.x,e.y);
    if(e.su&&!sb.done){sb.done=1;const l=sb.lvl,n=5+3*l;G.sats+=n;G.parts=(G.parts||0)+3*l;G.subMax=Math.max(G.subMax||1,l+1);dropFrom('chest',e.x,e.y,W.ml);dropFrom('chest',e.x,e.y,W.ml);W.portals.push({x:e.x,y:e.y,kind:'home'});sfx('quest');
      setTimeout(()=>dlg('Subpoena served','Level '+l+' is closed. '+n+' sats and '+3*l+' parts. Level '+(l+1)+' is now open on More at the Transit Gate.',[['Continue']]),900)}}}
/* proof of work shrine */
function ensurePow(){if(W.z.town||W.z.sim||W.z.sub||W.z.secret||W.objs.some(o=>o.k==='pow'))return;const p=freeSpot(14);W.objs.push({k:'pow',x:p.x,y:p.y})}
function powStart(o){if(W.pow)return;W.pow={o,t:60,w:1};sfx('shrine');toast('Proof of work: hold this ground for 60 seconds. The waves grow, and champions come. It cannot be hurried.')}
function p7Enter(){legCheck();if(W.eased){W.eased=0;setTimeout(()=>toast(pick(DIFFDN)),1200)}W.pow=null;raidCheck();if(W.z.sim){SB={};calc()}else if(SB){SB=null;calc()}if(W.z.sub&&W.sub)SUBP=W.sub;ensurePow()}
function simChoice(n){const all=[['+15% damage',{dmg:15}],['+12% life',{hpP:12}],['+8% attack speed',{aspd:8}],['+4% deadly strike',{crit:4}],['+2% life steal',{leech:2}],['+6% run speed',{mspd:6}],['+15 energy',{en:15}]].sort(()=>Math.random()-.5).slice(0,3);
  dlg('Wave '+(n-1)+' cleared','Take one. It lasts until you unplug.',all.map(c=>[c[0],()=>{for(const k in c[1])SB[k]=(SB[k]||0)+c[1][k];calc();heal(S.maxHp*.25);sfx('buff')}]))}
function p7Tick(dt){mktTick(dt);mktLiqCheck();uniTick(dt);if(OPT.autoStim&&G.hp>0&&G.hp<S.maxHp*.3&&G.stims>0){P.asT=(P.asT||0)-dt;if(P.asT<=0){P.asT=1.5;stim()}}upkeepTick(dt);shillTick(dt);storyTick(dt);
  const g=P.dg=P.dg||{n:2,t:0};if(g.n<2){g.t+=dt;if(g.t>=3.5){g.n++;g.t=0}}
  if(P.e82>0)P.e82-=dt;
  if(P.fm&&P.fm.t>0)P.fm.t-=dt;
  if(G.tpT>0){G.tpT-=dt;if(G.tpT<=0){calc();toast('The loan of strength runs out.')}}
  if(G.debt>0)G.debt*=Math.pow(loanRate(),dt);
  if(W.pat)for(const p of W.pat.slice()){p.t-=dt;p.c-=dt;if(p.c<=0){p.c=.5;W.fx.push({k:'ring',x:p.x,y:p.y,r:2,t:0,life:.45,col:'#ff7a3c'});for(const e of W.ents.slice())if(Math.hypot(e.x-p.x,e.y-p.y)<2+e.r)hit(e,.3,true)}if(p.t<=0)W.pat.splice(W.pat.indexOf(p),1)}
  if(!W.z.town&&!(typeof mpMobWatch==='function'&&mpMobWatch()))for(const e of W.ents)if((e.champ||e.su)&&e.aggro&&e.stun<=0&&!isBoss(e.k)){e.slam=(e.slam===undefined?rnd(3,6):e.slam)-dt;if(e.slam<=0&&dist(e,P)<7){e.slam=e.su?4.5:6.5;const low=e.champ&&!e.su&&!G.act2,soft=defragAct1(e);W.fx.push({k:'warn',x:P.x,y:P.y,r:soft?1.4:(low?1.15:1.9),t:0,life:soft?1.55:(low?1.6:1),boom:e.dmg*(soft?.8:(low?.7:1.6))})}}
  const m=W.merc;if(m&&m.hp>0&&G.merc.ab2==='medic'&&dist(m,P)<6&&G.hp<S.maxHp)heal(S.maxHp*.02*dt);
  const pw=W.pow;if(pw){if(dist(P,pw.o)>9){W.pow=null;toast('You left the shrine. The work is lost.');sfx('err');return}pw.t-=dt;pw.w-=dt;
    if(pw.w<=0&&!(typeof mpMobWatch==='function'&&mpMobWatch())){pw.w=7;pw.n=(pw.n||0)+1;const k=wpick(W.z.mix),cnt=4+pw.n,pool=W.z.mix.filter(m=>m[0]!=='tick');for(let i=0;i<cnt;i++){const a=rnd(0,6.283),e=spawn(k,pw.o.x+Math.cos(a)*7.5,pw.o.y+Math.sin(a)*7.5);if(e)e.aggro=true}
      if(pw.n===4||pw.n===7){const a=rnd(0,6.283),c=spawn(wpick(pool),pw.o.x+Math.cos(a)*7.5,pw.o.y+Math.sin(a)*7.5,{champ:1});if(c){c.aggro=true;toast('A champion comes for the shrine.')}}}
    if(pw.t<=0){W.pow=null;pw.o.used=1;mktNews(.13,'work was proven in '+W.z.n);const n=9+Math.floor(W.ml/3);for(let i=0;i<3;i++)addDrop({sat:Math.ceil(n/3)},pw.o.x,pw.o.y);sfx('quest');parts(pw.o.x,pw.o.y,30,['#f7931a','#fff'],3,1.6);addAdopt(1,'work was proven');campHit('ban');toast('Proof of work accepted. The block reward is on the ground: about '+n+' sats.')}}}
/* Mr. Float: now or later, and borrowing in a currency that melts */
const loanAmt=()=>400*G.lvl*G.cpi,nowCost=()=>payTag(150*G.lvl*G.cpi*((G.lean||0)>50?1.2:1));
function talkFloat(){const d=G.debt||0,real=d?Math.round(d/G.cpi/(G.debt0/G.debtCpi)*100):0;
  dlg('Mr. Float',d?'“You owe me '+fmt(d)+'. I charge interest, naturally.” He does not mention that prices have been rising faster than his interest. In real terms you now owe about '+real+'% of what you borrowed.':'“Everybody wants it now. I sell now. The orange fellow across the square sells later. And if you are short, I lend, at a very reasonable rate.”',[
   ['Now: +40% damage for 5 minutes · '+fmt(nowCost()),()=>{if(G.credits<nowCost()){toast('Not enough credits');sfx('err');return}G.credits-=nowCost();addAdopt(-1,'you chose now');G.tpT=300;calc();sfx('buff');toast('Strength on credit: +40% damage for 5 minutes')}],
   ['Later: +1% damage for good · 15 sats ('+(G.tpP||0)+'/25)',()=>{if(G.sats<15||(G.tpP||0)>=25){toast((G.tpP||0)>=25?'You have saved all you can here':'Not enough sats');sfx('err');return}G.sats-=15;G.tpP=(G.tpP||0)+1;calc();sfx('learn');toast('Saved. +1% damage, permanently.')}],
   d?['Repay '+fmt(d),()=>{/* The line prints whole credits, so the purse pays that floor. */const pay=Math.floor(G.debt);if(G.credits<pay){toast('Not enough credits');sfx('err');return}G.credits-=pay;G.debt=0;sfx('coin');toast('Debt cleared')}]:['Borrow '+fmt(loanAmt())+(scs()<350?' · refused':scs()<500?' · 35% fee':' · 10% fee'),()=>{if(scs()<350){toast('“Not with that score. I have a licence to think of.”');sfx('err');return}/* His line prints whole credits, so the purse gains that floor. */const l=Math.floor(loanAmt());addAdopt(-2,'you borrowed credits');G.credits+=l;G.debt=l*loanFee();G.debt0=l;G.debtCpi=G.cpi;sfx('coin');toast('Borrowed '+fmt(l)+'. You owe '+fmt(l*loanFee())+' and rising.')}],
   ['Leave']])}
function craft(it,k){if(it&&it.test){toast('Test gear stays out of the economy');return false}const P_=G.parts||0;
  if(k==='scrap'){const n=[1,2,4,8,15][it.q]||1;G.parts=P_+n;G.bag.splice(G.bag.indexOf(it),1);sfx('equip');toast('Scrapped for '+n+' part'+(n>1?'s':''));return true}
  if(k==='reroll'){const c=rerollCost(it);if(P_<c)return false;const r=rerollMod(it);if(!r)return false;G.parts=P_-c;sfx('learn');toast(AFK[r[0].k].t.replace('{v}',r[0].v)+' → '+AFK[r[1].k].t.replace('{v}',r[1].v));calc();return false}
  if(k==='addsoc'){if(P_<12)return false;G.parts=P_-12;it.soc=(it.soc||0)+1;it.words=it.words||[];sfx('learn');toast('A socket is cut into '+it.name);return false}}
const rerollCost=it=>5+Math.floor(it.il/4);
const canSoc=it=>['weapon','helm','armor'].includes(it.slot)&&!it.pw&&(it.soc||0)<(it.slot==='helm'?2:3);
