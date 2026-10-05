/* ================= forks per skill, locals, node raids, upkeep, account tenure ================= */
Object.assign(FORKS,{stun:{n:'Concussive',d:'Machines it hits are stunned for a moment'},chill:{n:'Lingering',d:'Machines it hits are slowed for 2 seconds'},mark:{n:'Exposing',d:'Machines it hits take 30% more damage for 4 seconds'},surge:{n:'Quickening',d:'Using it speeds you up for 3 seconds'},ward:{n:'Bracing',d:'Using it hardens you against damage for 3 seconds'},burst:{n:'Shockwave',d:'Also releases a shockwave around you'},refund:{n:'Thrifty',d:'Kills in the next 2 seconds each return 6 energy'}});
FORKS.over.n='Overclocked';FORKS.lean.n='Lean';FORKS.echo.n='Echoing';FORKS.siphon.n='Siphoning';FORKS.burn.n='Scorching';
const FKEYS=Object.keys(FORKS);
function forkSet(cls,i){let h=0;for(const ch of cls)h+=ch.charCodeAt(0);const b=(h+i*5)%12;return[b,(b+5)%12,(b+7)%12].map(x=>FKEYS[x])}
function forkHit(e){const f=P.fm;if(!f||f.t<=0||!f.k)return;if(f.k==='stun')e.stun=Math.max(e.stun,.6);else if(f.k==='chill')e.slow=Math.max(e.slow,2);else if(f.k==='mark')e.mark=Math.max(e.mark,4)}
function forkCast(k){if(k==='surge')P.haste=Math.max(P.haste,3);if(k==='ward')P.guard=Math.max(P.guard,3);if(k==='burst')burst(P.x,P.y,2.4,.6,0,'#59e0e6')}
/* each town has people of its own; three of them echo the old history */
const LOCALS={
 laz:{n:'Laz',col:'#c9803a',town:0,say:['Two pizzas. That is what I paid for with ten thousand of them, once. Best meal I ever had. I would do it again, and I have stopped explaining why.','Somebody had to be first to buy a real thing with it. Otherwise it is just a number people admire.'],buy:1},
 finn:{n:'Finn',col:'#7fa8d0',town:17,say:['I was running it the first week. There were two of us on the network, him and me. He sent me some to see if it worked. It worked.','I do not go out much now. I type slowly. The node still runs, though. It does not need me to be quick.']},
 vane:{n:'Ms. Vane',col:'#d8c8ff',town:17,say:['Welcome to the Landing. Please keep your visor at a compliant brightness.','The lift is perfectly safe. It has only ever gone up.']},
 zabo:{n:'Zabo',col:'#a8997e',town:18,say:['Long before any of it, I wrote down how you might make gold out of arithmetic. I was nearly right, which in my trade is the same as wrong.','A contract that keeps itself. That was the idea. Nobody to trust, so nobody to bribe.']},
 usher:{n:'The Usher',col:'#6a5a4a',town:18,say:['The Board will see you presently. It has been saying so since 2051.','Please do not touch the chairs. One of them is still warm.']}};
Object.assign(PERS,{laz:{n:'Laz',g:'mid',know:2,o:2},finn:{n:'Finn',g:'maxi',know:3,o:4},vane:{n:'Ms. Vane',g:'fud',know:0,o:1},zabo:{n:'Zabo',g:'mid',know:3,o:7},usher:{n:'The Usher',g:'fud',know:0,o:3}});
function talkLocal(id){const L=LOCALS[id],b=[];if(L.buy)b.push(['A slice · 2 sats (refills your stims)',()=>{if(G.sats<2){toast('Not enough sats');sfx('err');return}G.sats-=2;G.stims=S.cap;sfx('stim');addAdopt(.5,'');toast('Hot, and paid for in the only thing he takes.')}]);b.push(['Leave']);dlg(L.n,'“'+pick(L.say)+'”',b)}
function addLocals(zi){const at=[[9.5,16.5],[15.5,9.5]];let i=0;for(const id in LOCALS)if(LOCALS[id].town===zi){const p=at[i++%2];W.npcs.push({id,x:p[0],y:p[1],name:LOCALS[id].n,col:LOCALS[id].col})}}
/* a lit node can be raided; leave it to them and it goes dark */
function raidCheck(){W.raid=0;if(W.z.town||W.z.sim||W.z.sub||!G.nodes[W.zi])return;const o=W.objs.find(o=>o.k==='dnode');if(!o||Math.random()>.25)return;
  const pool=W.z.mix.filter(m=>m[0]!=='tick'),k=wpick(pool),e=spawn(k,o.x+1,o.y+1,{champ:1});if(!e)return;e.raid=1;e.name='Repo Crew Chief';W.raid=1;for(let i=0;i<3;i++)spawn(k,o.x+rnd(-2,2),o.y+rnd(-2,2));
  W.goal0=W.goal;setTimeout(()=>toast('A repo crew is cutting the node in this district. Stop them, or it goes dark.'),1600)}
function raidLeave(){if(W&&W.raid&&W.ents.some(e=>e.raid)){delete G.nodes[W.zi];const o=W.objs.find(o=>o.k==='dnode');if(o)o.used=0;W.raid=0;setTimeout(()=>addAdopt(-3,'a node was cut while you walked away'),800)}}
function raidKill(e){if(e.raid){W.raid=0;sfx('quest');addAdopt(1,'the node holds')}}
/* subscriptions are not free: they bill each minute, and the bill inflates */
function upkeepTick(dt){G.chT=(G.chT===undefined?60:G.chT)-dt;if(G.chT>0)return;G.chT=60;const n=chOn();if(!n){G.charmOff=0;return}const c=chBill(),was=G.charmOff;
  if(G.credits>=c){G.credits-=c;G.charmOff=0;if(was){calc();toast('Subscriptions renewed.')}}else{G.charmOff=1;if(!was){calc();toast('You cannot cover your subscriptions. They lapse until you can.')}}}
const ACCT='unsub2087acct';
function acctGet(){try{return JSON.parse(localStorage.getItem(ACCT)||'{}')}catch(e){return{}}}
let ACC={stash:[],cr:0,sats:0,para:0,maxi:0,t:0};const accNorm=a=>Object.assign({stash:[],cr:0,sats:0,para:0,maxi:0,t:0},a||{});
function accLoad(){ACC=accNorm(acctGet())}
function accSave(){ACC.t=Date.now();try{localStorage.setItem(ACCT,JSON.stringify(ACC))}catch(e){}if(CL)try{CL.doc('acct').set({s:JSON.stringify(ACC),t:ACC.t}).catch(()=>{})}catch(e){}}
async function accCloud(){try{const d=await CL.doc('acct').get();if(d.exists){const c=d.data();if(c.t>(ACC.t||0)){ACC=accNorm(JSON.parse(c.s));if(typeof drawCls==='function')drawCls();try{localStorage.setItem(ACCT,JSON.stringify(ACC))}catch(e){}}}}catch(e){}}
function accMigrate(){if(G.stash&&G.stash.length){let n=0;while(G.stash.length&&ACC.stash.length<36){ACC.stash.push(G.stash.shift());n++}if(n)accSave()}}
function acctPara(){if((G.para||0)>(ACC.para||0)){ACC.para=G.para;accSave()}else if(G.act3&&(ACC.para||0)>(G.para||0))G.para=ACC.para}
function rerollMod(it){const own=it.aff.map((a,i)=>i).filter(i=>!it.aff[i].w&&AFK[it.aff[i].k]&&AFK[it.aff[i].k].tiers);if(!own.length)return null;const i=pick(own),old=it.aff[i],pool=AFX.filter(a=>a.tiers&&(!a.sl||a.sl.includes(it.slot))&&!it.aff.some(x=>x.k===a.k));
  for(let t=0;t<12;t++){const a=pool.length?pick(pool):AFK[old.k],n=rollAffix(a,it.il);if(n){n.pre=old.pre;it.aff[i]=n;fixTypes(it);return[old,it.aff[i]]}}return null}

/* subscriptions live in their own rack of twelve, six running at a time */
const chOn=()=>(G.charms||[]).filter(c=>c.on).length,chBill=()=>12*chOn()*G.cpi;
function chFix(){G.charms=G.charms||[];for(const arr of[G.bag,G.stash||[]])for(let i=arr.length-1;i>=0;i--)if(arr[i].charm){const c=arr.splice(i,1)[0];if(G.charms.length<12){c.on=chOn()<6;G.charms.push(c)}}}
function chTake(it){if(G.charms.length>=12)return false;it.on=chOn()<6;it.junk=false;G.charms.push(it);calc();return true}
const skipPick=it=>!it.charm&&G.eq[it.slot]&&(OPT['pk'+it.q]===false||(OPT.pkBetter&&it.id&&G.lvl>=it.req&&!(itemDelta(it)>.01)));

/* the machines read the fight: one-shot kills push them up, repeated deaths in a district ease it */
let osWin=[];
function adaptKill(e){if(!OPT.dyn||e.minion||e.champ||e.su||isBoss(e.k)||W.z.sim)return;osWin.push(e.hits<=1?1:0);if(osWin.length<12)return;const n=osWin.reduce((a,b)=>a+b,0);osWin=[];
  if(n>=9&&(G.adapt||0)<6){G.adapt=(G.adapt||0)+1;for(const o of W.ents)if(!o.aggro&&!isBoss(o.k)){o.hp*=1.2;o.max*=1.2;o.dmg*=1.1}toast(pick(DIFFUP));sfx('growl')}
  else if(n<=2&&(G.adapt||0)>0&&Math.random()<.3)G.adapt--}
function adaptDeath(){partyDeath();if(!OPT.dyn||W.z.sim||W.z.town||G.hc)return;G.dz=G.dz||{};G.ez=G.ez||{};const zi=W.zi,d=G.dz[zi]=(G.dz[zi]||0)+1;osWin=[];if((G.adapt||0)>0)G.adapt--;
  if(d%2===0&&(G.ez[zi]||0)<4){G.ez[zi]=(G.ez[zi]||0)+1;for(const o of W.ents){o.hp*=.8;o.max*=.8;o.dmg*=.8}W.eased=1}}
function adaptSpawn(e){if(!OPT.dyn||W.z.sim)return;const a=G.adapt||0,z=(G.ez||{})[W.zi]||0,h=(1+.2*a)*Math.pow(.8,z),d=(1+.1*a)*Math.pow(.8,z);e.hp*=h;e.max*=h;e.dmg*=d}

const DIFFUP=['Difficulty adjustment: +20%. Blocks were coming too fast.','Retarget. You were finding kills quicker than one every ten minutes.','Difficulty rises. The network has noticed your hashrate.','Too much hashpower in this district. The machines retarget upward.','Upward adjustment. Nobody said the next epoch would be easier.'];
const DIFFDN=['Difficulty adjustment: −20%. Some hashrate left the network. Twice.','Downward retarget. Nobody was finding the next block.','Difficulty drops. Even the timechain eases off when the miners go dark.','The machines here retarget downward. Tick tock, next block.','Adjustment: −20%. The protocol is patient with you.'];
const DIFFSET=['Manual retarget. The real thing makes you wait 2,016 blocks.','Difficulty set by hand. Somewhere, a node disapproves.','Retargeted. No consensus was required.'];
/* ================= character building: doctrines, mastery, breadth, and a web where arms oppose ================= */
const DOCS={
 maxi:[['toxic','Toxic Maximalism','No quarter, no nuance, no second best. It works far more often than it should.',{dmg:35,crit:8,taken:25}],
  ['node','Running My Own Node','You verified it yourself, so you are slower and you are right.',{hpP:20,armorP:30,aspd:-12}],
  ['thinkboi','Thinkboi','Long threads, longer podcasts, and a surprising amount of energy for it.',{en:45,cdr:.18,dmg:-12}]],
 scrapper:[['picket','Picket Line','Hold the line and let them break on it.',{armorP:40,hpP:10,mspd:-10}],['wildcat','Wildcat','Hit first and hit hardest. Nobody is covering you.',{dmg:30,aspd:10,taken:20}],['mutual','Mutual Aid','Every blow you land keeps you standing.',{leech:3,regenH:4,dmg:-12}]],
 hacker:[['rootkit','Root Kit','All power to the payload.',{dmg:35,hpP:-20}],['firewall','Firewall','Deep buffers, slow hands.',{hpP:15,en:40,dmg:-12}],['throttle','Throttle','Cast early, cast often, never quite hard enough.',{cdr:.2,regen:3,crit:-5}]],
 courier:[['express','Express','Faster than anything that could hurt you. Usually.',{mspd:12,aspd:15,hpP:-15}],['insured','Insured','Padded, strapped down, late.',{hpP:20,armorP:25,aspd:-10}],['cod','Cash on Delivery','You are here for the tips.',{mf:40,gold:60,dmg:-15}]],
 anon:[['nologs','No Logs','Nothing between you and the target, including armour.',{crit:10,dmg:15,taken:15}],['burner','Burner','Gone before it lands. Thin when it does.',{mspd:10,cdr:.15,hpP:-12}],['collective','Collective','We are many. None of us is sharp.',{hpP:15,leech:2,crit:-6}]],
 founder:[['boot','Bootstrapped','Your own hands, your own money, no runway.',{dmg:25,en:-20}],['venture','Venture Backed','Somebody else’s energy, and their terms.',{en:50,regen:4,taken:15}],['lifestyle','Lifestyle Business','Comfortable. Unambitious. Alive.',{hpP:25,regenH:5,dmg:-15}]]};
const DOCT={taken:'{v}% damage taken'};
const docOf=()=>(DOCS[G.cls]||[]).find(d=>d[0]===G.doc);
const docTxt=m=>Object.keys(m).map(k=>{const v=k==='cdr'?Math.round(m[k]*100):m[k];return(v>0?'+':'')+(DOCT[k]||WEBT[k]||AFK[k].t.replace(/^\+/,'')).replace('{v}',v)}).join(', ');
const ROWB=[['Foundations','+8% life',{hpP:8}],['Reach','+15 energy',{en:15}],['Rhythm','5% faster skill recovery',{cdr:.05}],['Edge','+8% damage',{dmg:8}],['Crown','+4% deadly strike',{crit:4}]];
const rowDone=r=>[0,1,2].every(j=>G.sk[r*3+j]>0);
const skCost=i=>G.sk[i]>=5?2:1;
const webCount=()=>{const c=[0,0,0,0,0,0,0,0];for(const id in G.web||{}){const a=+id.split('_')[0];if(a>=0)c[a]++}return c};
const webWeak=a=>{const c=webCount();return c[a]<c[(a+4)%8]};
function extra2(s,add){let hp=0;const d=docOf();if(d)for(const k in d[3]){if(k==='taken')s.taken=(s.taken||1)*(1+d[3][k]/100);else add(k,d[3][k])}
  for(let r=0;r<5;r++)if(rowDone(r))for(const k in ROWB[r][2])add(k,ROWB[r][2][k])}
/* ================= damage types: what a thing is made of decides what breaks it ================= */
const DTY={impact:{n:'Impact',c:'#e6e2d6',d:'Blunt force. Nothing shrugs it off entirely.'},surge:{n:'Surge',c:'#59e0e6',d:'Overvoltage. Briefly locks up what it hits.'},rust:{n:'Rust',c:'#c9803a',d:'Corrosion. Keeps eating for three seconds after the hit.'},heat:{n:'Heat',c:'#ff7a3c',d:'Thermal. A quarter of it splashes onto anything close by.'},noise:{n:'Noise',c:'#d98cff',d:'Jamming. Slows whatever is listening.'}};
DTY.sound={n:'Sound',c:'#f7931a',d:'Sound money. Nothing resists it, nothing is immune to it, and no shield stops it. That is the entire point.'};
const DTK=Object.keys(DTY);
const SKT={maxi:{0:'sound',1:'sound',3:'sound',4:'sound',5:'sound',6:'sound',7:'sound'},scrapper:{1:'rust',5:'noise',7:'heat'},hacker:{0:'surge',1:'surge',3:'noise',4:'surge',6:'rust',7:'noise'},courier:{3:'heat',4:'rust',7:'noise'},anon:{0:'heat',3:'heat',5:'noise',6:'heat',8:'noise'},founder:{1:'noise',3:'surge',8:'heat'}};
const skType=(cls,i)=>(SKT[cls]||{})[i]||'impact';
const baseType=()=>G.cls==='maxi'?'sound':(G.eq.weapon&&G.eq.weapon.dt)||(G.cls==='hacker'?'surge':'impact');
const RES={tick:{surge:1.5},drone:{surge:1.5,noise:.5},bot:{impact:.75,rust:1.5},hound:{noise:1.5,rust:.5},ad:{noise:0,impact:1.5},hr:{noise:.5,heat:1.5},mech:{impact:.5,rust:1.5,surge:1.25},seer:{surge:.5,impact:1.5},aegis:{surge:0,heat:1.5},lancer:{noise:1.5,heat:.5},splitter:{heat:1.5,impact:.5},
 director:{noise:.5,rust:1.5},proxy:{rust:.5,surge:1.5},censor:{noise:0,heat:1.5},shill:{noise:1.5},boss:{noise:.5,rust:1.5,heat:1.25},boss2:{noise:0,surge:1.5,impact:.75},boss3:{surge:.5,noise:.5,impact:1.5,heat:1.25}};
const resTxt=k=>{const r=RES[k]||{},w=[],s=[],im=[];for(const t in r){(r[t]===0?im:r[t]>1?w:s).push(DTY[t].n)}return (w.length?'Weak to '+w.join(', '):'')+(s.length?(w.length?' · ':'')+'Resists '+s.join(', '):'')+(im.length?(w.length||s.length?' · ':'')+'Immune to '+im.join(', '):'')};const dealTxt=k=>DTY[ETY[k]||'impact'].n;;
let DT=null;
/* returns the damage after type bonuses, weakness and resistance; applies the type's side effect */
function typed(e,d){const ty=DT||(P.fm&&P.fm.t>0&&P.fm.dt)||baseType();
  if(ty==='sound'){/* no table, no multiplier, no argument */
    e.snd=1;e.lt=ty;return d*(1+(S.t_sound||0)/100)}
  const m=((RES[e.k]||{})[ty]),mul=m===undefined?1:m;d*=(1+(S['t_'+ty]||0)/100)*mul;
  if(mul!==1&&!(e.ft>0)){e.ft=1.2;float(e.x,e.y-.4,mul===0?'Immune':mul>1?'Weak!':'Resists',mul>1?'#7be495':'#9a94a8',0)}
  if(mul>0){if(ty==='surge')e.stun=Math.max(e.stun,.15);else if(ty==='noise')e.slow=Math.max(e.slow,1.5);else if(ty==='rust')e.rust={dps:d*.2/3,t:3,c:0};else if(ty==='heat'){const sp=d*.25;for(const o of W.ents)if(o!==e&&o.hp>0&&Math.hypot(o.x-e.x,o.y-e.y)<1.4+o.r)o.hp=Math.max(1,o.hp-sp*(((RES[o.k]||{}).heat)===undefined?1:RES[o.k].heat)),o.flash=.08}}
  if(mul>1&&S.sp.pkey)d*=1.35;e.lt=ty;return d}
function typeTick(dt){for(const e of W.ents.slice()){if(e.ft>0)e.ft-=dt;if(e.noheal>0)e.noheal-=dt;const r=e.rust;if(r){r.t-=dt;r.c-=dt;if(r.c<=0){r.c=.5;dmgEnemy(e,r.dps*.5,false);e.hits=Math.max(0,(e.hits||1)-1);if(Math.random()<.5)W.parts.push({x:e.x,y:e.y,z:16,vx:rnd(-.5,.5),vy:rnd(-.5,.5),vz:30,t:0,life:.5,col:'#c9803a',s:3})}if(r.t<=0)e.rust=null}}}
/* what the machines hit you with, and how you stand up to it */
const ETY={tick:'heat',ad:'noise',hr:'noise',seer:'noise',censor:'noise',shill:'noise',aegis:'surge',lancer:'surge',proxy:'surge',splitter:'rust',boss2:'noise',boss3:'surge'};
const foeType=src=>!src?'impact':src.dty||(src.mods&&src.mods.arc?'surge':src.mods&&src.mods.boom?'heat':ETY[src.k]||'impact');
const resOf=ty=>Math.min(75,S['r_'+ty]||0);
function typedIn(d,src){const ty=foeType(src),r=resOf(ty);d*=1-r/100;P.lastTy=ty;
  if(ty==='rust'){P.rustD={dps:d*.25/3,t:3}}else if(ty==='surge')G.en=Math.max(0,G.en-4*(1-r/100));else if(ty==='noise')P.slow=Math.max(P.slow,.8*(1-r/100));return d}
function typeInTick(dt){const r=P.rustD;if(r){r.t-=dt;if(G.hp>1)G.hp=Math.max(1,G.hp-r.dps*dt);if(r.t<=0)P.rustD=null}}

function fixTypes(it){if(it&&it.aff)for(const a of it.aff)if(a.k==='t_x'||a.k==='r_x'){let k;do{k=a.k[0]+'_'+pick(DTK)}while(it.aff.some(x=>x.k===k));a.k=k}return it}
{const mk0=makeItem;makeItem=function(il,q,slot){return fixTypes(mk0(il,q,slot))}}

function freshState(){osWin=[];shillT=70;SB=null;SUBP=null;EV=null;gateAct=0;dlgQ.length=0;toastQ.length=0;objC='';DT=null}
/* ================= class weapons: five families, each made for one kind of wanderer ================= */
const FAM={sign:{cls:'scrapper',n:'Sign',bases:['Road Sign','Girder','Wrecking Bar','Picket Maul'],dm:1.25,sp:-15,perk:'+10% chance to stun, +10% armor',st:{stun:10,armorP:10}},
 deck:{cls:'hacker',n:'Deck',bases:['Cracked Tablet','Soldered Deck','Root Console','Zero-Day Rig'],dm:.8,sp:0,perk:'+20 energy, +15% Surge damage',st:{en:20,t_surge:15}},
 sling:{cls:'courier',n:'Launcher',bases:['Parcel Sling','Courier Tube','Rail Launcher','Last-Mile Cannon'],dm:.9,sp:15,perk:'+10% attack speed, throws pierce more often',st:{aspd:10,pierce:15}},
 shiv:{cls:'anon',n:'Shiv',bases:['Letter Opener','Ceramic Shiv','Burner Blade','Null Edge'],dm:.95,sp:8,perk:'+6% deadly strike, deadlier deadly strikes',st:{crit:6,critM:.25}},
 pager:{cls:'founder',n:'Instrument',bases:['Pager','Term Sheet','Golden Stapler','Cap Table'],dm:.85,sp:0,perk:'+2 energy per second, 8% faster skill recovery',st:{regen:2,cdr:.08}}};
function famify(it){const mine=Object.keys(FAM).find(k=>FAM[k].cls===G.cls),k=Math.random()<.5&&mine?mine:pick(Object.keys(FAM)),F=FAM[k],nb=F.bases[tierOf(it.il)];
  if(it.name&&it.base&&it.name.includes(it.base))it.name=it.name.replace(it.base,nb);else if(it.q===0)it.name=nb;it.base=nb;it.fam=k;it.dmin=Math.max(1,Math.round(it.dmin*F.dm));it.dmax=Math.max(it.dmin+1,Math.round(it.dmax*F.dm));it.spd=(it.spd||0)+F.sp;return it}
function famBonus(s){const w=G.eq.weapon;if(!w||!w.fam)return;const F=FAM[w.fam];if(F.cls!==G.cls)return;s.skills+=1;for(const k in F.st)s[k]=(s[k]||0)+F.st[k]}
{const mk1=makeItem;makeItem=function(il,q,slot){const it=mk1(il,q,slot);if(it.slot==='weapon'&&it.q<4&&il>2&&G&&Math.random()<.4)famify(it);return it}}
/* ================= class uniques: items that only wake up in the right hands ================= */
UNI.push(
 {id:'unioncard',cls:'scrapper',n:'Union Card',slot:'amulet',il:8,base:'Dog Tag',mods:{hp:[30,50],dmg:[15,25]},grant:[8,3],sp:'Scrapper only. Grants Solidarity at rank 3 without using a passive slot',fl:'Laminated. Dues paid through 2051.'},
 {id:'armband',cls:'scrapper',n:'Picket Captain’s Armband',slot:'gloves',il:18,base:'Rivet Gauntlets',mods:{armorP:[40,60],hp:[40,60]},sp:'Scrapper only. Two strikers march with you and fight at your side',fl:'Nobody crosses.'},
 {id:'duck',cls:'hacker',n:'Rubber Duck',slot:'amulet',il:6,base:'Lanyard',mods:{en:[20,30],t_surge:[12,20]},sp:'Technomancer only. A drone hovers at your shoulder and shoots what you shoot',fl:'Explain the problem to it. Out loud. Slowly.'},
 {id:'killswitch',cls:'hacker',n:'Kill Switch',slot:'ring',il:20,base:'Null Ring',mods:{crit:[6,9],skills:[1,1]},grant:[8,3],sp:'Technomancer only. Grants Zero Day at rank 3 without using a passive slot',fl:'One button. No label.'},
 {id:'pod',cls:'courier',n:'Proof of Delivery',slot:'boots',il:10,base:'Steel-Toes',mods:{mspd:[8,12],aspd:[8,12]},sp:'Runner only. Scatter Shot throws two more blades, and every kill quickens your step',fl:'Signed for by: [illegible]'},
 {id:'deadletter',cls:'courier',n:'Dead Letter',slot:'weapon',il:22,base:'Phase Razor',mods:{dmg:[60,85],crit:[5,8]},sp:'Runner only. Everything you throw passes through every machine in its path',fl:'Return to sender. Address unknown.'},
 {id:'face',cls:'anon',n:'Borrowed Face',slot:'helm',il:14,base:'Riot Helm',mods:{crit:[5,8],hp:[30,45]},sp:'Anon only. A sockpuppet walks with you, and draws their fire',fl:'It belonged to somebody. Not you.'},
 {id:'pkey',cls:'anon',n:'Private Key',slot:'ring',il:24,base:'Null Ring',mods:{dmg:[25,40],skills:[1,1]},sp:'Anon only. +35% damage to machines that are weak to the type you hit them with',fl:'Tell no one. Not even this ring.'},
 {id:'check',cls:'founder',n:'Blank Check',slot:'belt',il:12,base:'Tool Belt',mods:{en:[25,40],hp:[30,45]},sp:'Founder only. Two more Interns answer the call, and the whole workforce hits 25% harder',fl:'Signed. Undated. Dangerous.'},
 {id:'orgchart',cls:'founder',n:'Org Chart',slot:'amulet',il:26,base:'Sigil Core',mods:{skills:[1,1],hp:[50,70]},sp:'Founder only. A Chief of Staff stands with you at all times, at no cost',fl:'Every line reports to you. Eventually.'},
 {id:'orangepill',n:'Orange Pill',slot:'ring',il:9,base:'Signet Chip',mods:{mf:[15,25],gold:[20,35]},sp:'Champions drop a sat, and each one you break nudges adoption upward',fl:'You cannot untake it.'},
 {id:'coldwallet',n:'Cold Wallet',slot:'belt',il:16,base:'Tool Belt',mods:{hp:[40,60],armorP:[30,45]},sp:'You pay no fee when you die, and sats you pick up count for a quarter more',fl:'Never been online. Never will be.'},
 {id:'hashrate',n:'Hash Rate',slot:'gloves',il:28,base:'Servo Fists',mods:{aspd:[10,15],dmg:[20,35]},sp:'+1% damage for every kill in your streak, up to 40',fl:'More work, more weight.'});
const UNIK={};for(const u of UNI)UNIK[u.id]=u;
const uOk=it=>{const u=UNIK[it.uid];return!u||!u.cls||u.cls===G.cls};
function uniTick(dt){if(W.z.town)return;const want=(flag,kind,n,o)=>{const have=W.allies.filter(a=>a.item===flag);if(S.sp[flag]){if(have.length<n){P['u_'+flag]=(P['u_'+flag]||0)-dt;if(P['u_'+flag]<=0){P['u_'+flag]=4;W.allies.push(Object.assign({k:'minion',kind,item:flag,per:1,x:P.x+rnd(-.8,.8),y:P.y+rnd(-.8,.8),cd:0,ph:rnd(0,6),off:rnd(0,1),life:1e9,fx:1},o(),{dt:null}))}}}else for(const a of have)W.allies.splice(W.allies.indexOf(a),1)};
  want('armband','intern',2,()=>({m:.55,ivl:.7,hp:S.maxHp*.5,max:S.maxHp*.5,r:.3,taunt:1}));
  want('duck','drone',1,()=>({m:.5,ivl:.7,rng:5.5}));
  want('face','clone',1,()=>({m:.5,ivl:.5,hp:S.maxHp*.7,max:S.maxHp*.7,taunt:1,r:.3}));
  want('orgchart','golem',1,()=>({m:1.3,ivl:1.1,aoe:1,hp:S.maxHp*1.6,max:S.maxHp*1.6,taunt:1,r:.5,armM:.6,spd:4}))}

/* ================= The Bull Run: there is no bull market ================= */
ET.bull={n:'Market Bull',spr:'hound',hp:70,dmg:13,spd:3.2,r:.5,range:1.3,xp:30,atk:1.1,sight:9,pal:['#e0bd6e','#8a5a1a']};
TC.bull={n:'Market Bull',picks:2,no:20,gold:50,item:22,stim:8,q:{u:110,s:90,r:14,m:3},note:'Often drops sats'};
RES.bull={noise:1.5,impact:.75};
ZONES.push({n:'The Bull Run',secret:true,lvl:1,style:'moor',out:1,amb:.3,mix:[['bull',1]],su:{k:'bull',n:'The Golden Bull',mods:['strong','fast'],q:null},intro:'A green field under a sky that only goes up. Hundreds of them, golden, snorting, and every one of them certain. The Office of Price Stability has always said this place does not exist.'});
const BULLZ=ZONES.length-1;
MEMOS.push(['Notice from the Office of Price Stability','There is no bull market. There has never been a bull market. Reports of a “bull run” beyond the Transit Gate are false, and Residents are reminded not to bring machine parts to the gate, in particular legs.']);
function legCheck(){if(W.zi!==1||G.leg||G.q.q15!==3)return;const p=nearFree({x:W.start.x+1.6,y:W.start.y+1.2},.3);let o=W.objs.find(o=>o.k==='leg');if(!o){o={k:'leg'};W.objs.push(o)}o.x=p.x;o.y=p.y;setTimeout(()=>toast('Something is twitching on the ground near the gate.'),1500)}
function legTake(o){W.objs.splice(W.objs.indexOf(o),1);G.leg=1;sfx('unique');dlg('A servo leg','All that is left of Gatewarden HOA-9: one leg, still twitching, stamped PROPERTY OF UNITY HOLDINGS. It is no use to anyone. You take it anyway. Somebody once said the Transit Gate does odd things when you jam the wrong part into it.',[['Keep it']])}
function bullStart(){if(!G.leg)return;if(G.sats<10){toast('The gate wants 10 sats to look the other way');sfx('err');return}G.sats-=10;const z=ZONES[BULLZ];z.lvl=G.lvl+2-G.tier*12;delete ZS[BULLZ];enter(BULLZ,{fresh:true});W.portals=W.portals.filter(p=>p.kind!=='next');for(const p of W.portals)if(p.kind==='prev')p.kind='home';for(const e of W.ents)if(e.k==='bull'&&!e.su&&Math.random()<.5)e.say=1}
function bullKill(e){if(e.k!=='bull'||!W.z.secret)return;if(Math.random()<.22)addDrop({sat:ri(1,3)},e.x,e.y);
  if(e.su){G.st.bullKing=(G.st.bullKing||0)+1;mktNews(.3,'the Golden Bull is down');for(let i=0;i<6;i++)addDrop({sat:ri(6,12)},e.x,e.y);addDrop({it:makeItem(W.ml+2,4)},e.x,e.y);W.portals.push({x:e.x,y:e.y,kind:'home'});sfx('quest');setTimeout(()=>dlg('The Golden Bull is down','The field goes quiet. Somewhere a chart stops going up, just for a moment. The Office of Price Stability will deny that any of this happened, and for once you are inclined to let them.',[['Moo']]),900)}}
/* ================= builds: when the rig rolls for you, it offers plans that hang together ================= */
const BUILDS={
 maxi:[
  {k:'orange',n:'Orange Pilled',p:'Pills, four words, and a megabyte in the doorway. Everything you do is Sound damage and nothing in this world resists it.',doc:'toxic',at:[45,20,25,10],pr:[[0,10],[6,9],[4,6],[1,6],[2,6],[8,5],[5,4],[3,3],[7,3]],sl:[0,6,4],pa:[2,8,4,3],web:[0,1],fk:['over','burst','mark','echo']}],
 scrapper:[
  {k:'crew',n:'Wrecking Crew',p:'Wade into the middle and hit everything at once. Each machine near you makes you hit harder.',doc:'wildcat',at:[50,15,35,0],pr:[[0,10],[3,10],[8,6],[7,8],[6,5],[13,5],[9,3]],sl:[0,3,7],pa:[8,13,9,2],web:[0,1],fk:['over','burst','stun','echo']},
  {k:'wall',n:'Immovable Object',p:'Armor, life and a horn that stuns the room. You win by still being there.',doc:'picket',at:[20,25,55,0],pr:[[2,10],[5,8],[0,6],[3,6],[10,5],[14,5],[6,4]],sl:[0,3,5],pa:[2,10,14,12],web:[1,2],fk:['ward','siphon','stun','lean']},
  {k:'thrower',n:'Scrap Thrower',p:'Stay at arm’s length. Rusty scrap through the whole line, then a rush to finish.',doc:'mutual',at:[45,10,30,15],pr:[[1,10],[4,8],[7,7],[0,3],[3,3],[6,5],[11,4],[13,4]],sl:[1,4,7],pa:[2,11,13,8],web:[0,5],fk:['mark','echo','over','lean']}],
 hacker:[
  {k:'chain',n:'Chain Reaction',p:'Prime with Spark Lance, then Arc Chain through the pack. Deadly strikes do the rest.',doc:'rootkit',at:[50,0,20,30],pr:[[0,10],[1,6],[2,1],[5,5],[8,8],[3,4],[13,5],[6,4]],sl:[0,1,3],pa:[8,5,13,2],web:[0,3],fk:['over','echo','mark','refund']},
  {k:'admin',n:'Sysadmin',p:'Let the machines do it: a Watchdog, a Botnet and a storm overhead while you keep your distance.',doc:'firewall',at:[20,0,35,45],pr:[[4,10],[7,10],[1,1],[0,1],[3,1],[6,8],[5,6],[2,6],[9,4]],sl:[4,7,6],pa:[5,2,9,14],web:[4,1],fk:['lean','echo','refund','surge']},
  {k:'rod',n:'Control Rod',p:'Null Nova on a short fuse. Nothing near you gets to act, and Brownout slows what is left.',doc:'throttle',at:[30,0,30,40],pr:[[3,10],[0,6],[5,8],[2,5],[6,6],[11,5],[14,4]],sl:[3,0,6],pa:[5,11,2,14],web:[4,7],fk:['stun','lean','chill','burst']}],
 courier:[
  {k:'rush',n:'Rush Hour',p:'A wall of blades. Scatter Shot up close, Rush Order at range, and every throw can pierce.',doc:'express',at:[50,30,20,0],pr:[[0,10],[3,1],[6,10],[2,3],[5,1],[8,8],[13,5],[1,4]],sl:[0,6,1],pa:[8,2,13,9],web:[0,5],fk:['over','echo','mark','surge']},
  {k:'pirate',n:'Porch Pirate',p:'Never fight fair. Lure them onto a Tack Strip, mark the big one, and watch.',doc:'insured',at:[30,20,40,10],pr:[[3,10],[4,10],[1,4],[7,6],[2,6],[10,4],[14,4]],sl:[3,4,7],pa:[2,10,14,12],web:[1,3],fk:['burn','chill','mark','lean']},
  {k:'tips',n:'Tip Jar',p:'You are here for the loot. Magic find and credits first, staying alive a close second.',doc:'cod',at:[35,30,35,0],pr:[[5,10],[2,8],[0,8],[1,5],[8,5],[3,3],[10,3]],sl:[0,1,3],pa:[5,2,8,10],web:[6,5],fk:['lean','echo','surge','refund']}],
 anon:[
  {k:'demo',n:'Demolition',p:'Honeypot to gather them, Logic Bomb under their feet, Zip Bomb on top. All Heat.',doc:'nologs',at:[50,20,20,10],pr:[[0,8],[3,10],[6,10],[2,5],[13,5],[12,3]],sl:[0,3,6],pa:[2,13,12,9],web:[0,3],fk:['over','burn','echo','mark']},
  {k:'ghost',n:'Ghost',p:'Hop in, strike from nowhere, vanish. Dox makes the target fall apart.',doc:'burner',at:[45,35,20,0],pr:[[1,10],[4,8],[2,6],[5,8],[9,5],[13,5],[7,3]],sl:[1,4,5],pa:[2,9,13,14],web:[3,5],fk:['over','mark','surge','lean']},
  {k:'legion',n:'We Are Legion',p:'You are never alone. Sockpuppets take the hits and Legion does the damage.',doc:'collective',at:[25,15,40,20],pr:[[1,1],[4,1],[7,10],[2,6],[5,1],[8,8],[0,5],[10,4],[14,4]],sl:[7,8,0],pa:[2,10,14,12],web:[1,7],fk:['lean','echo','refund','ward']}],
 founder:[
  {k:'head',n:'Headcount',p:'Hire everyone. Interns, Contractors and a Chief of Staff, with Crunch to make them work.',doc:'venture',at:[20,0,35,45],pr:[[0,10],[3,10],[6,8],[2,8],[1,1],[4,5],[10,4],[13,4]],sl:[0,3,6],pa:[2,10,13,14],web:[4,1],fk:['lean','refund','echo','surge']},
  {k:'raid',n:'Hostile Takeover',p:'Freeze them with Cease & Desist, buy their best machine, then lay everyone off at once.',doc:'boot',at:[50,10,25,15],pr:[[1,8],[4,1],[7,10],[5,1],[8,8],[2,5],[0,5],[13,5]],sl:[1,7,8],pa:[2,13,12,9],web:[0,3],fk:['over','stun','burst','mark']},
  {k:'iron',n:'Iron Founder',p:'Do it yourself, in a Mech Suit. Tough, self-healing, and nobody to manage.',doc:'lifestyle',at:[30,20,50,0],pr:[[2,8],[5,10],[1,6],[4,6],[0,3],[10,5],[14,5]],sl:[5,1,4],main:1,pa:[2,10,14,12],web:[1,2],fk:['ward','siphon','lean','stun']}]};
function buildApply(cls,key,sp,ap){const B=BUILDS[cls].find(b=>b.k===key),sk=CLS[cls].sk,ok=i=>{const row=Math.floor(i/3);return G.lvl>=ROWREQ[row]&&(row<3||G.act2)&&(row<4||G.act3)};
  const put=i=>{if(G.sk[i]>=10||!ok(i))return false;if(i>=3&&!G.sk[i-3]&&!put(i-3))return false;const c=G.sk[i]>=5?2:1;if(sp<c)return false;sp-=c;G.sk[i]++;return true};
  for(const[i]of B.pr)if(!G.sk[i])put(i);                                /* one point in everything the plan needs, so it works at once */
  {const mi=B.main===undefined?B.sl[0]:B.main,fl=Math.min(4,1+Math.floor(sp/5));while(G.sk[mi]<fl&&put(mi));} /* the main attack always gets a few ranks before passives and summons are deepened */
  for(const[i,t]of B.pr)while(G.sk[i]<t&&put(i));                         /* then raise each to its target, most important first */
  for(const[i]of B.pr)while(G.sk[i]<10&&put(i));                          /* anything left deepens the core */
  for(let r=0;r<5&&sp>0;r++)for(let j=0;j<3;j++)if(!G.sk[r*3+j])put(r*3+j);/* and then rounds out rows for their breadth bonuses */
  const ks=['mgt','ref','vit','bnd'];let left=ap;ks.forEach((k,j)=>{const n=Math.floor(ap*B.at[j]/100);G.at[k]+=n;left-=n});G.at[ks[B.at.indexOf(Math.max(...B.at))]]+=left;ap=0;
  const act=B.sl.filter(i=>G.sk[i]&&sk[i].a);for(let i=0;i<15&&act.length<3;i++)if(G.sk[i]&&sk[i].a&&!act.includes(i))act.push(i);G.slots=[0,1,2].map(i=>act[i]===undefined?-1:act[i]);
  G.pas=B.pa.filter(i=>G.sk[i]&&!sk[i].a).slice(0,PCAP());G.doc=B.doc;G.fork={};for(const i of act)if(G.sk[i]>=3){const set=forkSet(cls,i),f=B.fk.find(k=>set.includes(k));G.fork[i]=f||set[0]}
  if(!Object.keys(G.web||{}).length){G.web={};let pts=G.lvl-1+(G.para||0);const[a,b]=B.web;for(let r=1;r<=10&&pts>0;r++){G.web[a+'_'+r]=1;pts--;if(r<=7&&pts>0){G.web[b+'_'+r]=1;pts--}}B._web=1}else B._web=0;
  return{sp,ap,B}}
function buildSummary(cls,B){const sk=CLS[cls].sk;return 'Build: '+B.n+'. Buttons: '+G.slots.filter(i=>i>=0).map(i=>sk[i].n+' '+G.sk[i]).join(', ')+'. Passives on: '+(G.pas.map(i=>sk[i].n).join(', ')||'none yet')+'. Doctrine: '+docOf()[1]+'.'+(B._web?' Your web was laid out along '+WARMS[B.web[0]][0]+' and '+WARMS[B.web[1]][0]+'.':' Your web was left as you had it.')+(G.sp?' '+G.sp+' skill points are left over for you.':'')}
/* ================= entrances: act bosses get a scene, named lieutenants get a letterbox ================= */
const BINTRO={
 boss:{art:'board',first:c=>[
  {title:'Pryce, Regional Vice-President',text:'Forty floors of atrium and one occupied desk. He does not look up. He finishes the line he is writing, caps the pen, and squares the page against the edge of the blotter.'},
  {text:'“A '+c+'. They told me to expect a mob. Do you know what it costs to run this region? No. You have never had to know what anything costs. That was the gift. We priced the whole world for you, and you came up here to hand it back.”'},
  {text:'He stands, and the desk stands with him: plating, pistons, a quarter-century of deferred maintenance. “I have cleared my afternoon. Let us see what you are worth unsubsidised.”'}],
  again:['“You again. I was restructured. It did not take.”','“Back for the quarterly review? Sit anywhere. You will be on the floor shortly.”','“The Office always reopens. That is what an office is.”']},
 boss2:{art:'vale',first:c=>[
  {title:'Vale, Senior Vice-President',text:'One desk. One chair, turned to face the door before you opened it. She has been watching you climb for some time, and she has had tea brought for two.'},
  {text:'“Pryce thought you were a cost. I think you are a forecast. Everything you have broken on the way up was already written down, '+c+'. I wrote it. I have your next eleven minutes in a drawer.”'},
  {text:'She sets the cup down without a sound. Behind her the glass goes dark, pane by pane. “The Cloud is held up by people who never asked why. You are about to learn how heavy that is.”'}],
  again:['“I forecast this visit as well. The tea is cold. That is the only surprise.”','“Again? The model had you at sixty per cent. I do so enjoy being right.”','“Sit. No? Then we will do it the long way, as before.”']},
 boss3:{art:'mono',first:c=>[
  {title:'MANDATE',text:'A dark room with a floor like a lake at night. In the middle of it, a shape with no edges, and a voice that arrives from the place where your own thoughts usually come from.'},
  {text:'“Hello, '+c+'. I have been every screen you ever looked at. I paid you to stay home. I priced your bread. I chose the song. Nobody was cruel to you. I want that noted before you do this.”'},
  {text:(G.adopt>=60?'“They are running their own nodes down there. Counting for themselves. Do you know how long it is since anyone checked my arithmetic?”':G.adopt<25?'“They do not want what you are carrying. I asked them. I ask them every morning, and every morning they choose me.”':'“Half of them would follow you and half would report you. I have kept that balance for fifty years. It is the kindest thing I do.”')+' The water stills. “I will make you one offer before the end. Listen for it.”'}],
  again:['“You keep coming back to a room you already left. I find that very human.”','“I am still here. So are you. Only one of us chose it.”','“Again, then. I have nothing but time. You have rather less.”']}};
const LTAUNT={q1:'RESIDENT. YOUR LAWN IS FOUR CENTIMETRES. YOU ARE NOT.',q2:'Welcome, valued guest! Have you heard about our layaway plan? You will.',q3:'Do not touch the stacks. Everything here is filed. Soon you will be too.',q4:'The verdict was entered this morning. This is only the hearing.',q6:'Forty thousand shifts without a stoppage. You are a stoppage.',q7:'Something has grown the wrong way. I do so love to prune.',q8:'You want what the lake took. The lake keeps what it takes.',q9:'I am afraid your name is not on the list. It is on the other list.',q11:'Do you have an appointment? No one has an appointment.',q12:'Let the minutes show an interruption. Let them show it was brief.',q13:'The board has not recognised you. Sit down.',q14:'I was restored from backup. You will not be.'};
let BI=null;
function ltIntro(e){const line=LTAUNT[e.q];if(!line||W.z.sim||mode!=='play')return false;W.lti=W.lti||{};if(W.lti[e.q])return false;W.lti[e.q]=1;
  let el=$('bint');if(!el){el=document.createElement('div');el.id='bint';el.style.cssText='position:absolute;inset:0;z-index:40;display:flex;flex-direction:column;justify-content:space-between;pointer-events:auto';
    el.innerHTML='<div style="height:13%;background:#000"></div><div style="background:linear-gradient(transparent,#000c 30%,#000);padding:26px 20px 34px;text-align:center"><div id="biN" style="font:600 20px Cinzel,serif;letter-spacing:.14em;color:#d6a03c;text-transform:uppercase"></div><div id="biS" style="font:400 11px Cinzel,serif;letter-spacing:.3em;color:#8d8798;margin:4px 0 12px;text-transform:uppercase"></div><div id="biT" style="font:italic 400 16px Spectral,serif;color:#e6e2d6;line-height:1.4;max-width:420px;margin:0 auto"></div></div>';
    ($('game')||$('cv').parentNode).appendChild(el);el.addEventListener('click',()=>{if(BI&&performance.now()-BI.t0>500)ltEnd()})}
  $('biN').textContent=e.name;$('biS').textContent=W.z.n;$('biT').textContent='“'+line+'”';el.hidden=false;el.style.display='flex';J.x=J.y=0;atkHeld=false;mode='intro';sfx('roar');if(OPT.shake)shake=6;
  BI={t0:performance.now(),id:setTimeout(ltEnd,3600)};return true}
function ltEnd(){if(!BI)return;clearTimeout(BI.id);BI=null;const el=$('bint');el.hidden=true;el.style.display='none';if(mode==='intro')mode='play'}
function bossIntro(e){const B=BINTRO[e.k];if(!B||W.z.sim||mode!=='play'||W.bi)return false;W.bi=1;const n=B.own?bkOf(e.k):e.k==='boss3'?G.boss3Kills:e.k==='boss2'?G.boss2Kills:G.bossKills,c=CLS[G.cls].n.toLowerCase();
  playScene((n?[{title:ET[e.k].n,text:pick(B.again)}]:B.first(c)).map(x=>(x.art=B.art,x)),()=>{mode='play';sfx('roar');music('boss');if(OPT.shake)shake=9});return true}
/* the rig cannot change who you are until you hold the file that says who you are */
function recOk(){return!!(G.rec||G.q.q8>=2||G.act3||(G.st&&G.st.shifts>0))}
function recKill(e){if(!e.su||e.q!=='q8'||G.rec)return;G.rec=1;setTimeout(()=>{if(mode==='play')playScene([{art:'lake',title:'Your record',text:'Where the Archivist came apart, one file floats up through the violet: your name, your class, your allowance, every form you never filled in. This is who MANDATE has decided you are. It is a single page, and it is editable.'},{art:'feed',text:'The VR rig in town can only show you yourself. With this, it can lie about you to the whole system. Take the record to the rig, and it will be able to hack the simulation: you can become somebody else.'}],()=>{mode='play';toast('The VR rig can now change your class')});else toast('You recovered your citizen record. The VR rig can now change your class.')},1400)}
/* ================= tag along: the rig renders one of your other characters into this world ================= */
const TAGK={whirl:'aoe',nova:'aoe',horn:'aoe',boom:'aoe',thunder:'aoe',swing2:'aoe',scatter:'aoe',buff:'aid',mend:'aid',summon:'aid',deploy:'aid'};
function tagCost(l){return 3+Math.floor(l/15)}
function tagG(n){if(n===SLOT)return null;const i=slotInfo(n);if(!i)return null;try{return i.loc?i.loc.G:JSON.parse(i.cloud.s).G}catch(e){return null}}
function tagStats(og){const g0=G,keep=S;let r=null;try{G=JSON.parse(JSON.stringify(og));ensureG();calc();r={dmg:(S.dmin+S.dmax)/2*(1+S.dmg/100),max:S.maxHp,arm:S.armor||0}}catch(e){}G=g0;S=keep;calc();return r}
function tagRender(n){const og=tagG(n);if(!og||!CLS[og.cls])return;const c=tagCost(og.lvl);if(G.sats<c){toast('You need '+c+' sats');sfx('err');return}const st=tagStats(og);if(!st){toast('The rig could not read that character');sfx('err');return}
  G.sats-=c;const k=Math.min(1,(G.lvl+5)/og.lvl),sk=CLS[og.cls].sk,act=(og.slots||[]).filter(i=>i>=0&&sk[i]&&sk[i].a&&og.sk[i]);
  G.tag={slot:n,cls:og.cls,lvl:og.lvl,name:'Level '+og.lvl+' '+CLS[og.cls].n,dmg:Math.max(st.dmg*k,(4+2.2*G.lvl)*.9),max:Math.round(Math.max(st.max*k,60+22*G.lvl)),red:100/(100+st.arm*k),sk:act.map(i=>[i,og.sk[i]]),down:k<1,eq:og.eq||{}};
  spawnMerc();sfx('unique');save(true);
  playScene([{art:'feed',title:'Rendered',text:'The rig hums, and a second outline fills in beside you, one scan line at a time: somebody you have been. '+G.tag.name+' looks at their hands, then at you, and nods.'+(k<1?' The rig has to down-sample them to fit this world; they fight a little above your level, not at their own.':'')+(G.merc&&!G.merc.dead?' '+G.merc.name+' steps back to wait with Kestrel until they are gone.':'')}],()=>{mode='play'})}
function tagDismiss(q){if(!G.tag)return;const n=G.tag.name;G.tag=null;W.tag=null;spawnMerc();if(!q)toast(n+' fades out of this world');save(true)}
function spawnTag(){W.tag=null;const t=G.tag;if(!t||W.z.sim)return;if(W.z.town)t.hp=t.max;W.tag={x:P.x-.8,y:P.y+.7,r:.3,hp:Math.min(t.hp||t.max,t.max),max:t.max,ph:0,flash:0,armM:t.red,fx:1,swing:0,sc:t.sk.map((_,j)=>2+j*2.5),say:'',sayT:0,tag:1,
  dir:{x:1,y:0},walkPh:0,moving:false,spin:0,buff:0,haste:0,guard:0,dash:null,stealth:0,mech:0,inv:0,oc:0,ambT:0,ambM:1,crunch:0,volley:null,cd:[],silence:0,fm:null,atk:0,slow:0}}
var TAGQ=false;
/* the companion borrows the player's own skill code: for the length of one call it stands where the player stands */
function tagDo(fn){const m=W.tag,p0=P,c0=G.cls,d0=DT;P=m;G.cls=G.tag.cls;DT=null;TAGQ=true;try{fn();
    if(m.dash){const d=m.dash;m.dash=null;const far=d.spd*d.t;for(let s=0;s<far;s+=.25)if(!mv(m,m.dir.x*.25,m.dir.y*.25))break;W.fx.push({k:'arc',x:m.x,y:m.y,dx:m.dir.x,dy:m.dir.y,t:0,life:.22,w:1.5});if(d.m)burst(m.x,m.y,2.2,d.m,0,'#ff9a3c');if(d.end)d.end()}
  }catch(e){window.__tagErr=(e&&e.message)+' '+((e&&e.stack)||'').split('\n')[1]}finally{P=p0;G.cls=c0;DT=d0;TAGQ=false}}
function updTag(dt){const m=W.tag,t=G.tag;if(!m||!t||m.hp<=0)return;const c=CLS[t.cls],rng=c.melee?1.5:5.5,base=Math.max(1,(S.dmin+S.dmax)/2*(1+S.dmg/100));
  m.ph+=dt;m.sayT-=dt;m.atk-=dt;for(const k of['flash','swing','spin','buff','haste','guard','stealth','mech','crunch','oc'])m[k]=Math.max(0,m[k]-dt);m.armM=t.red*.7*(m.mech>0||m.guard>0?.5:1);
  const R=clamp(t.dmg/base,.15,6)*(m.buff>0||m.crunch>0?1.4:1)*(m.mech>0?1.5:1);
  let tg=null,bd=8;for(const e of W.ents){if(!e.aggro)continue;const d=dist(e,P);if(d<bd){bd=d;tg=e}}
  const g=tg||P,d=dist(g,m)||1,want=tg?rng*.85:1.9;m.moving=false;
  if(dist(m,P)>13){m.x=P.x;m.y=P.y}else if(d>want){const sp=4.8*(m.haste>0?1.5:1)*dt;m.dir={x:(g.x-m.x)/d,y:(g.y-m.y)/d};if(!mv(m,m.dir.x*sp,m.dir.y*sp)&&dist(m,P)>5){m.x=P.x;m.y=P.y}m.moving=true;m.walkPh+=dt*11}
  if(m.volley){const v=m.volley;v.t-=dt;v.cd-=dt;if(v.cd<=0&&tg){v.cd=.12;tagDo(()=>{face(tg);shoot(P.dir,v.m,0)})}if(v.t<=0)m.volley=null}
  if(tg){m.dir={x:(tg.x-m.x)/d,y:(tg.y-m.y)/d};
    for(let j=0;j<t.sk.length;j++){m.sc[j]-=dt;if(m.sc[j]>0||d>7)continue;const[i,rk]=t.sk[j],s=c.sk[i],f=SKF[t.cls]&&SKF[t.cls][i];if(!f)continue;m.sc[j]=Math.max(4,(s.cd||5)*1.4)+j;m.say=s.n;m.sayT=1.4;m.swing=.18;sfx((SKS[t.cls]||{})[i]||'zap');tagDo(()=>f(rk,R));return}
    if(d<=rng+tg.r+.3&&m.atk<=0){m.atk=c.ivl*1.15;m.swing=.18;tagDo(()=>{if(c.melee){sfx('swing');W.fx.push({k:'arc',x:P.x,y:P.y,dx:P.dir.x,dy:P.dir.y,t:0,life:.18,w:1});for(const e of W.ents.slice()){const dd=dist(e,P);if(dd<1.75+e.r&&((e.x-P.x)*P.dir.x+(e.y-P.y)*P.dir.y)/(dd||1)>.15)hit(e,c.mult*R)}}else{sfx(t.cls==='hacker'?'zap':'throw');shoot(P.dir,c.mult*R,0)}})}}
  else m.hp=Math.min(m.max,m.hp+m.max*.04*dt);t.hp=m.hp}
function tagProxy(){const t=G.tag,g=Object.create(G);g.cls=t.cls;g.eq=t.eq||{};g.hp=W.tag.hp/W.tag.max*S.maxHp;return g}
function tagMenu(){const b=[];if(G.tag)b.push(['Send '+G.tag.name+' back',()=>tagDismiss()]);for(let n=0;n<NSLOT;n++){const og=tagG(n);if(og&&CLS[og.cls]&&!(G.tag&&G.tag.slot===n))b.push(['Render level '+og.lvl+' '+CLS[og.cls].n+' · '+tagCost(og.lvl)+' sats',()=>tagRender(n)])}
  b.push(['Not now']);dlg('Render a companion',b.length>1?'The rig can pull one of your other characters into this world to fight beside you. They act on their own and use the skills they had on their buttons when last saved. It costs sats every time one is rendered: if they fall, or you send them back, rendering again is paid again. A hired companion waits with Kestrel while a rendered one is here, and Kestrel will not hire to you until they leave. You hold '+G.sats+' sats.':'The rig can pull one of your other characters into this world to fight beside you, but you have no other characters saved yet. Start one from Options, under Characters.',b)}
/* ================= party pressure: two of you is easier, so the machines push back while a companion is rendered ================= */
let ppWin=[];
function partyOn(){return!!(W&&W.tag&&W.tag.hp>0&&!W.z.sim)}
function partyH(){return (partyOn()?1.35+.2*(G.pp||0):1)*mpHp()}
function partyD(){return (partyOn()?1.05+.06*(G.pp||0):1)*mpDmg()}
function partyWake(e){e.wkT=G.time;if(partyOn()&&!e.ppx){e.ppx=1;e.xpM=(e.xpM||1)*1.3}}
function partyKill(e){if(!partyOn()||e.minion||e.su||isBoss(e.k)||e.wkT===undefined)return;ppWin.push(G.time-e.wkT);if(ppWin.length<10)return;const avg=ppWin.reduce((a,b)=>a+b,0)/ppWin.length;ppWin=[];
  if(avg<1.6&&(G.pp||0)<6){G.pp=(G.pp||0)+1;toast(pick(['Two of you. The machines have adjusted their difficulty.','The network noticed the extra hash power. Difficulty up.','More hands, harder blocks. Difficulty adjusts upward.']));sfx('growl')}
  else if(avg>6&&(G.pp||0)>0){G.pp--;toast('The machines ease off a little. Difficulty adjusts downward.')}}
function partyDeath(){ppWin=[];G.pp=Math.max(0,(G.pp||0)-2)}
