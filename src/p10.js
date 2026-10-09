/* ================= forks per skill, locals, node raids, upkeep, account tenure ================= */
Object.assign(FORKS,{stun:{n:'Concussive',d:'Machines it hits are stunned for a moment'},chill:{n:'Lingering',d:'Machines it hits are slowed for 2 seconds'},mark:{n:'Exposing',d:'Machines it hits take 30% more damage for 4 seconds'},surge:{n:'Quickening',d:'Using it speeds you up for 3 seconds'},ward:{n:'Bracing',d:'Using it hardens you against damage for 3 seconds'},burst:{n:'Shockwave',d:'Also releases a shockwave around you'},refund:{n:'Thrifty',d:'Kills in the next 2 seconds each return 6 energy'}});
FORKS.over.n='Overclocked';FORKS.lean.n='Lean';FORKS.echo.n='Echoing';FORKS.siphon.n='Siphoning';FORKS.burn.n='Scorching';
const FKEYS=Object.keys(FORKS);
function forkSet(cls,i){let h=0;for(const ch of cls)h+=ch.charCodeAt(0);const b=(h+i*5)%12;return[b,(b+5)%12,(b+7)%12].map(x=>FKEYS[x])}
function forkHit(e){const f=P.fm;if(!f||f.t<=0||!f.k)return;if(f.k==='stun')e.stun=Math.max(e.stun,.6);else if(f.k==='chill')e.slow=Math.max(e.slow,2);else if(f.k==='mark')e.mark=Math.max(e.mark,4)}
function forkCast(k){if(k==='surge')P.haste=Math.max(P.haste,3);if(k==='ward')P.guard=Math.max(P.guard,3);if(k==='burst')burst(P.x,P.y,2.4,.6,0,'#59e0e6')}
/* each town has people of its own; three of them echo the old history */
const LOCALS={
 laz:{n:'Laz',col:'#c9803a',town:0,say:['Two pizzas. That is what I paid for with ten thousand of them, once. Best meal I ever had.'],buy:1},
 finn:{n:'Finn',col:'#7fa8d0',town:17,say:['I was running it the first week. There were two of us on the network, him and me. He sent me some to see if it worked. It worked.','I do not go out much now. I type slowly. The node still runs, though. It does not need me to be quick.']},
 vane:{n:'Ms. Vane',col:'#d8c8ff',town:17,say:['Welcome to the Landing. Please keep your visor at a compliant brightness.','The lift is perfectly safe. It has only ever gone up.']},
 zabo:{n:'Zabo',col:'#a8997e',town:18,say:['Long before any of it, I wrote down how you might make gold out of arithmetic. I was nearly right, which in my trade is the same as wrong.','A contract that keeps itself. That was the idea.']},
 usher:{n:'The Usher',col:'#6a5a4a',town:18,say:['The Board will see you presently. It has been saying so since 2051.','Please do not touch the chairs. One of them is still warm.']}};
Object.assign(PERS,{laz:{n:'Laz',g:'mid',know:2,o:2},finn:{n:'Finn',g:'maxi',know:3,o:4},vane:{n:'Ms. Vane',g:'fud',know:0,o:1},zabo:{n:'Zabo',g:'mid',know:3,o:7},usher:{n:'The Usher',g:'fud',know:0,o:3}});
function talkLocal(id){const L=LOCALS[id],b=[];if(L.buy)b.push(['A slice · 2 sats (refills your stims)',()=>{if(!spendSats(2,'Not enough sats'))return;G.stims=S.cap;sfx('stim');addAdopt(.5,'');toast('Hot, and paid for in the only thing he takes.')}]);b.push(['Leave']);dlg(L.n,'“'+pick(L.say)+'”',b)}
function addLocals(zi){const at=[[9.5,16.5],[15.5,9.5]];let i=0;for(const id in LOCALS)if(LOCALS[id].town===zi){const p=at[i++%2];W.npcs.push({id,x:p[0],y:p[1],name:LOCALS[id].n,col:LOCALS[id].col})}}
/* a lit node can be raided; leave it to them and it goes dark */
function raidCheck(){W.raid=0;if(W.z.town||W.z.sim||W.z.sub||!G.nodes[W.zi])return;const o=W.objs.find(o=>o.k==='dnode');if(!o||Math.random()>.25)return;
  const pool=W.z.mix.filter(m=>m[0]!=='tick'),k=wpick(pool),e=spawn(k,o.x+1,o.y+1,{champ:1});if(!e)return;e.raid=1;e.name='Repo Crew Chief';W.raid=1;for(let i=0;i<3;i++)spawn(k,o.x+rnd(-2,2),o.y+rnd(-2,2));
  W.goal0=W.goal;setTimeout(()=>toast('A repo crew is cutting the node in this district. Stop them, or it goes dark.'),1600)}
function raidLeave(){if(W&&W.raid&&W.ents.some(e=>e.raid)){delete G.nodes[W.zi];const o=W.objs.find(o=>o.k==='dnode');if(o)o.used=0;W.raid=0;setTimeout(()=>addAdopt(-3,'a node was cut while you walked away'),800)}}
function raidKill(e){if(e.raid){W.raid=0;sfx('quest');addAdopt(1,'the node holds')}}
const ACCT='unsub2087acct';
function acctGet(){try{return JSON.parse(localStorage.getItem(ACCT)||'{}')}catch(e){return{}}}
let ACC={stash:[],cr:0,sats:0,para:0,maxi:0,t:0};const accNorm=a=>Object.assign({stash:[],cr:0,sats:0,para:0,maxi:0,t:0},a||{});
function accLoad(){ACC=accNorm(acctGet())}
function accSave(){if(ACC&&ACC.stash)ACC.stash=ACC.stash.filter(it=>!(it&&it.test));ACC.t=Date.now();try{localStorage.setItem(ACCT,JSON.stringify(ACC))}catch(e){}if(CL)try{CL.doc('acct').set({s:JSON.stringify(ACC),t:ACC.t}).catch(()=>{})}catch(e){}}
async function accCloud(){try{const d=await CL.doc('acct').get();if(d.exists){const c=d.data();if(c.t>(ACC.t||0)){ACC=accNorm(JSON.parse(c.s));if(typeof charmMigrate==='function')charmMigrate();if(typeof drawCls==='function')drawCls();try{localStorage.setItem(ACCT,JSON.stringify(ACC))}catch(e){}}}}catch(e){}}
function accMigrate(){if(G.stash&&G.stash.length){let n=0;while(G.stash.length&&gridCan(ACC.stash,G.stash[0],6,6)){ACC.stash.push(G.stash.shift());n++}if(n)accSave()}}
function acctPara(){if((G.para||0)>(ACC.para||0)){ACC.para=G.para;accSave()}else if(G.act3&&(ACC.para||0)>(G.para||0))G.para=ACC.para}
function rerollMod(it){const own=it.aff.map((a,i)=>i).filter(i=>!it.aff[i].w&&AFK[it.aff[i].k]&&AFK[it.aff[i].k].tiers);if(!own.length)return null;const i=pick(own),old=it.aff[i],pool=AFX.filter(a=>a.tiers&&(!a.sl||a.sl.includes(it.slot))&&!it.aff.some((x,j)=>j!==i&&(x.k===a.k||(a.grp&&x.grp===a.grp))));
  for(let t=0;t<12;t++){const a=pool.length?pick(pool):AFK[old.k],n=rollAffix(a,it.il);if(n){n.pre=old.pre;it.aff[i]=n;fixTypes(it);return[old,it.aff[i]]}}return null}

/* Charms sit on the belt or they are weight. No rack, no minute bill, no stack. */
function upkeepTick(){}
const BELT_W={'Zip-Tie Sash':[6,1],'Tool Belt':[8,2],'Power Girdle':[10,3],'Orbit Girdle':[12,4]};
const BELT_U={repair:[12,1],check:[6,3],coldwallet:[10,1],soaker:[8,2],carbon:[6,3],clock:[12,2],ledger:[8,4],drawer:[10,3],notyourkeys:[12,4],signin:[6,5],docket:[16,1]};
function beltBudget(it){
  if(!it||it.slot!=='belt')return{stims:4,slots:0};
  const u=it.uid&&BELT_U[it.uid];if(u)return{stims:u[0],slots:u[1]};
  let stims=it.cap,slots=it.csl,col=false;
  const w=BELT_W[it.base];if(w){if(stims==null)stims=w[0];if(slots==null)slots=w[1]}
  if(stims==null)stims=4;if(slots==null)slots=0;
  for(const a of it.aff||[]){if(!a)continue;if(a.k==='courier'){stims+=4;slots-=1}if(a.k==='collection'){stims-=4;slots+=1;col=true}}
  if(slots<0)slots=0;if(col&&stims<2)stims=2;
  return{stims,slots}}
function beltStamp(it){const u=it&&it.uid&&BELT_U[it.uid];if(u){it.cap=u[0];it.csl=u[1]}}
function charmShape(sz){
  if(sz==='filing')return{sz:'filing',cs:3,cells:4,cw:2,ch:2,base:'Filing'};
  if(sz==='notice')return{sz:'notice',cs:2,cells:2,cw:1,ch:2,base:'Notice'};
  return{sz:'slip',cs:1,cells:1,cw:1,ch:1,base:'Slip'}}
function charmCost(it){return !it||!it.charm?0:(it.cs||charmShape(it.sz).cs)}
function charmCells(it){return !it||!it.charm?1:(it.cells||charmShape(it.sz).cells)}
function spanOf(it){if(!it||!it.charm)return{w:1,h:1};const s=charmShape(it.sz);return{w:it.cw||s.cw,h:it.ch||s.ch}}
function charmParts(it){return !it||!it.charm?0:it.sz==='filing'?8:it.sz==='notice'?4:2}
function charmNormalize(it){
  if(!it||!it.charm)return it;
  delete it.qty;delete it.stack;delete it.count;delete it.num;delete it.on;
  if(!(it.q>=0&&it.q<=4))it.q=1;
  return it}
function gridCells(list){let n=0;for(const it of list||[])if(it)n+=it.charm?charmCells(it):1;return n}
function gridPlace(list,cols,rows){
  const occ=Array(cols*rows).fill(0),out=[];
  for(let i=0;i<(list||[]).length;i++){const it=list[i];if(!it)continue;const sp=spanOf(it);let spot=null;
    for(let y=0;y<=rows-sp.h&&!spot;y++)for(let x=0;x<=cols-sp.w;x++){let ok=1;
      for(let dy=0;dy<sp.h&&ok;dy++)for(let dx=0;dx<sp.w;dx++)if(occ[(y+dy)*cols+x+dx])ok=0;
      if(ok)spot={x,y}}
    if(!spot)return null;
    for(let dy=0;dy<sp.h;dy++)for(let dx=0;dx<sp.w;dx++)occ[(spot.y+dy)*cols+spot.x+dx]=1;
    out.push({i,it,x:spot.x,y:spot.y,w:sp.w,h:sp.h})}
  return out}
function gridCan(list,it,cols,rows){return !!gridPlace((list||[]).concat([it]),cols,rows)}
function bagCan(it){return !!(G&&gridCan(G.bag,it||{slot:'ring'},6,4))}
const CHARM_BAND=[
  {ml:1,dmg:[10,18],hp:[35,65],res:[8,14],all:null,mf:[8,15],crit:[3,5],aspd:null,cdr:null,leech:null},
  {ml:15,dmg:[12,22],hp:[45,80],res:[12,20],all:[4,8],mf:[10,18],crit:[4,7],aspd:[6,10],cdr:[8,12],leech:[2,3]},
  {ml:30,dmg:[16,28],hp:[55,100],res:[15,25],all:[6,11],mf:[12,22],crit:[5,8],aspd:[6,12],cdr:[8,14],leech:[2,4]},
  {ml:45,dmg:[20,34],hp:[65,120],res:[18,30],all:[8,14],mf:[14,26],crit:[5,9],aspd:[8,14],cdr:[10,16],leech:[2,4]},
  {ml:60,dmg:[24,38],hp:[70,130],res:[20,35],all:[10,18],mf:[16,30],crit:[6,10],aspd:[8,16],cdr:[10,18],leech:[3,5]}];
function charmBand(ml){let b=CHARM_BAND[0];for(const x of CHARM_BAND)if((ml||1)>=x.ml)b=x;return b}
function charmOdds(kind,diff){
  diff=diff||0;
  if(kind==='champ'||kind==='chest'){if(diff>=2)return{slip:.06,notice:.05,filing:.03};if(diff>=1)return{slip:.08,notice:.04,filing:.01};return{slip:.08,notice:.02,filing:0}}
  if(kind==='su')return{slip:.1,notice:.08,filing:.02};
  if(diff>=2)return{slip:.02,notice:.006,filing:.001};
  if(diff>=1)return{slip:.02,notice:.003,filing:0};
  return{slip:.015,notice:0,filing:0}}
function charmSizeRoll(kind,diff){
  const o=charmOdds(kind,diff),r=Math.random(),f=o.filing||0,n=o.notice||0;
  if(f&&r<f)return'filing';if(n&&r<f+n)return'notice';if(o.slip&&r<f+n+o.slip)return'slip';return ''}
function charmRange(pair,high,scale){
  let v=high?pair[0]+Math.round((pair[1]-pair[0])*(.7+Math.random()*.3)):ri(pair[0],pair[1]);
  if(scale)v=Math.max(1,Math.round(v*scale));return v}
function charmAffix(ml,high,scale){
  const b=charmBand(ml),keys=['dmg','hp','res','mf','crit'];
  if(b.all)keys.push('all','aspd','cdr','leech');
  const k=pick(keys),pair=k==='res'?b.res:k==='all'?b.all:b[k],v=charmRange(pair,high,scale);
  if(k==='res')return{k:'r_'+pick(['impact','surge','rust','heat','noise']),v};
  if(k==='all')return{k:'r_all',v};return{k,v}}
function charmAffixes(ml,n,high,scale){
  const out=[],used={};let g=0;
  while(out.length<n&&g++<24){const a=charmAffix(ml,high,scale);if(used[a.k])continue;used[a.k]=1;out.push(a)}
  return out}
const CHARM_NM={dmg:'Sharpened',hp:'Living',mf:'Lucky',crit:'Precise',r_all:'Warded',aspd:'Quick',cdr:'Hasty',leech:'Hungry',skills:'Adept',gold:'Thrifty',en:'Humming',mspd:'Paced'};
const CHARM_CLS={scrapper:'The Write-up',hacker:'The Ticket',courier:'The Missed Scan',anon:'The Burner',founder:'The Option Pool',homesteader:'The Lien',witness:'The Carbon',maxi:'The Whitepaper'};
function charmTitle(aff,sz){
  const word=sz==='filing'?'Filing':sz==='notice'?'Notice':'Slip',a=aff&&aff[0],k=a&&a.k;
  const nm=CHARM_NM[k]||(k&&k.indexOf('r_')===0?'Proofed':'Kept');
  return nm+' '+word}
function finishCharm(il,sz,aff,opt){
  opt=opt||{};const sh=charmShape(sz);
  const it={slot:'charm',charm:1,q:opt.q!=null?opt.q:1,il:Math.max(1,Math.round(il||1)),id:true,req:opt.req!=null?opt.req:Math.max(1,Math.floor((il||1)*.75)),
    base:opt.base||sh.base,name:opt.name||charmTitle(aff,sh.sz),aff:aff||[],val:opt.val!=null?opt.val:Math.round((30+(il||1)*4)*(sh.cells)*(opt.q===4?3:opt.q===2?2:1)),
    fl:opt.fl||'It applies on the belt. In the pack or the lockbox it only takes space, and it does not stack.',
    sz:sh.sz,cs:sh.cs,cells:sh.cells,cw:sh.cw,ch:sh.ch};
  if(opt.uid)it.uid=opt.uid;if(opt.cls)it.cls=opt.cls;if(opt.migrated)it.migrated=1;
  return charmNormalize(it)}
function mkClassSlip(il,cls){
  cls=cls||(G&&G.cls)||'scrapper';const i=ri(0,14),sk=CLS[cls]&&CLS[cls].sk[i];
  return finishCharm(il,'slip',[{k:'csk',v:1,i,cls}],{q:1,name:CHARM_CLS[cls]||'Class Slip',cls,fl:'+1 to one skill of that class, and only if a real point is already in it. Nothing else. On the belt, or it is paper.'})}
function mkClearance(il){
  return finishCharm(il,'slip',[{k:'mf',v:ri(25,40)},{k:'gold',v:ri(15,30)}],{q:4,uid:'clearance',name:'The Clearance Sticker',fl:'The price that was never the price. One slot, spent on finding more.'})}
function mkClause(il){
  const b=charmBand(il);let aff;
  if(Math.random()<.5&&b.all)aff=[{k:'r_all',v:b.all[1]}];
  else{const a=charmAffixes(il,2,true);aff=a.filter(x=>x.k.indexOf('r_')===0);while(aff.length<2){const t=pick(['impact','surge','rust','heat','noise']);if(!aff.some(x=>x.k==='r_'+t))aff.push({k:'r_'+t,v:charmRange(b.res,true)})}}
  return finishCharm(il,'notice',aff.slice(0,2),{q:4,uid:'clause',name:'The Unread Clause',fl:'It was in the terms. Nobody read it. The belt still did.'})}
function mkLetter(cls,il){
  cls=cls||(G&&G.cls)||'scrapper';
  return finishCharm(il||45,'notice',[{k:'skills',v:2},{k:'hp',v:ri(30,60)},{k:'r_all',v:ri(8,12)}],{q:4,uid:'letter',cls,name:'The Eleven-Minute Letter',fl:'The letter Phonix sent everyone. This copy has a '+((CLS[cls]&&CLS[cls].n)||cls)+'’s name on it, which is impossible, and the skills answer only for that class. Tradable.'})}
function mkChurn(il){
  return finishCharm(il||60,'filing',[{k:'skills',v:1},{k:'r_all',v:ri(12,20)},{k:'hp',v:ri(50,90)},{k:'dmg',v:ri(10,16)}],{q:4,uid:'churn',name:'The Churn Notice',fl:'The notice Unity sends when it stops pretending you are a customer. You kept the letter. Three belt slots. Tradable.'})}
function charmRollItem(ml,sz,kind,diff,opt){
  opt=opt||{};diff=diff||0;
  if(!opt.boss&&(kind==='champ'||kind==='chest')&&ml>=15&&Math.random()<.05)return mkClearance(ml);
  if(!opt.boss&&sz==='notice'&&ml>=15&&(kind==='champ'||kind==='su'||kind==='chest')&&Math.random()<.06)return mkClause(ml);
  if(!opt.boss&&sz==='slip'&&ml>=30&&diff>=1&&Math.random()<(diff>=2?.12:.08))return mkClassSlip(ml);
  let rare=false;
  if(!opt.boss&&sz==='filing'&&kind==='su'){const p=diff>=2?1/3:diff>=1?.25:0;if(p&&Math.random()<p)rare=1}
  if(sz==='filing'&&!rare&&Math.random()<.5)return finishCharm(ml,'filing',[{k:'skills',v:1}],{q:1,fl:'+1 to all skills, if you have already spent a point. Three belt slots, four pack cells.'});
  const n=rare?3:sz==='slip'?1:2,scale=sz==='notice'?.75:0;
  return finishCharm(ml,sz,charmAffixes(ml,n,!!opt.high,scale),{q:rare?2:1})}
function mkCharm(il,opt){
  opt=opt||{};
  if(opt.uid==='churn')return mkChurn(il);
  if(opt.uid==='letter')return mkLetter(opt.cls,il);
  if(opt.uid==='clearance')return mkClearance(il);
  if(opt.uid==='clause')return mkClause(il);
  if(opt.aff)return finishCharm(il,opt.sz||'slip',opt.aff,opt);
  return charmRollItem(il||1,opt.sz||'slip',opt.kind||'ord',opt.diff||0,opt)}
function charmFrom(kind,x,y){
  if(!W||(W.z&&(W.z.sim||W.z.town)))return;
  const sz=charmSizeRoll(kind,G.diff||0);if(!sz)return;
  addDrop({it:charmRollItem(W.ml||1,sz,kind,G.diff||0)},x,y)}
function charmOnKill(e){
  if(!e||e.minion||!W||(W.z&&(W.z.sim||W.z.town)))return;
  const ml=W.ml||1,diff=G.diff||0;
  if(typeof isBoss==='function'&&isBoss(e.k)){
    G.bcharm=G.bcharm||{};const key=e.k+'@'+diff;
    if(!G.bcharm[key]){G.bcharm[key]=1;const sz=diff>=2?'filing':diff>=1?'notice':(typeof actOf==='function'?actOf(W.zi):1)<=1?'slip':(typeof actOf==='function'?actOf(W.zi):1)===2?'notice':'filing';
      addDrop({it:charmRollItem(ml,sz,'boss',diff,{boss:1,high:diff>=1})},e.x,e.y)}
    if(e.k==='boss4'&&diff>=1){if(!ACC.letter){ACC.letter=1;accSave();addDrop({it:mkLetter(G.cls,ml)},e.x,e.y)}else if(Math.random()<.06)addDrop({it:mkLetter(G.cls,ml)},e.x,e.y)}
    if(e.k==='boss5'&&diff>=2){if(!ACC.churn){ACC.churn=1;accSave();addDrop({it:mkChurn(ml)},e.x,e.y)}else if(Math.random()<.05)addDrop({it:mkChurn(ml)},e.x,e.y)}
    return}
  charmFrom(e.su?'su':e.champ?'champ':'ord',e.x,e.y)}
function charmUsed(){return(G.cslots||[]).reduce((n,c)=>n+charmCost(c),0)}
function charmWhy(it){
  if(!it||!it.charm)return'That is not a charm.';
  if(!it.id)return'Identify it first.';
  if(G.lvl<(it.req||1))return'Needs level '+it.req+'.';
  const need=charmCost(it),max=beltBudget(G.eq&&G.eq.belt).slots,open=max-charmUsed();
  const word=it.sz==='filing'?'A filing':it.sz==='notice'?'A notice':'A slip';
  if(need>max)return word+' needs '+need+' slot'+(need===1?'':'s')+'. This belt has '+max+'.';
  if(need>open)return word+' needs '+need+' slot'+(need===1?'':'s')+'. This belt has '+open+' open.';
  return ''}
function charmFail(why){G.charmWhy=why;G.charmShake=1;toast(why);return false}
function charmSocket(i){
  const it=G.bag&&G.bag[i];const why=charmWhy(it);if(why)return charmFail(why);
  G.charmWhy='';G.bag.splice(i,1);it.junk=false;G.cslots=G.cslots||[];G.cslots.push(charmNormalize(it));calc();sfx('equip');return true}
function charmTakeOff(i){
  const it=(G.cslots||[])[i];if(!it)return false;
  if(!bagCan(it)){toast('Your pack is full');return false}
  G.cslots.splice(i,1);G.bag.push(it);G.charmWhy='';calc();sfx('equip');return true}
function charmRefit(){
  if(!G)return;G.cslots=G.cslots||[];if(!Array.isArray(G.bag))G.bag=[];
  const max=beltBudget(G.eq&&G.eq.belt).slots;const keep=[];let used=0;const over=[];
  for(const it of G.cslots){const c=charmCost(it);if(it&&used+c<=max){keep.push(it);used+=c}else if(it)over.push(it)}
  G.cslots=keep;
  for(const it of over){if(bagCan(it))G.bag.push(it);else if(typeof ACC!=='undefined'&&ACC&&gridCan(ACC.stash,it,6,6)){ACC.stash.push(it);accSave()}else if(typeof addDrop==='function'&&typeof P!=='undefined'&&P)addDrop({it},P.x,P.y)}}
function charmStow(it){
  if(bagCan(it)){G.bag.push(it);return 'bag'}
  if(typeof ACC!=='undefined'&&ACC&&gridCan(ACC.stash,it,6,6)){ACC.stash.push(it);return 'box'}
  return ''}
function charmScore(it,on){
  const a=(it.aff&&it.aff[0])||{},pref=a.k==='dmg'||a.k==='hp'?2:0;
  return(on?1000:0)+pref*100+(+a.v||0)}
function charmToSlip(it){
  const aff=(Array.isArray(it.aff)?it.aff:[]).map(a=>a&&a.k?{k:a.k,v:a.v,i:a.i,cls:a.cls}:null).filter(Boolean);
  return finishCharm(it.il||1,'slip',aff,{req:1,q:it.q===4?4:1,name:(aff[0]?aff[0].k+' +'+aff[0].v:'Kept')+' Slip',migrated:1,val:it.val||30,fl:'Carried over from a subscription. The roll is the one it had. It works only on the belt.'})}
function charmMigrate(){
  if(!G)return;if(!Array.isArray(G.bag))G.bag=[];if(!Array.isArray(G.stash))G.stash=[];
  G.bag=G.bag.filter(Boolean);G.stash=G.stash.filter(Boolean);
  const hero=!G.charmMigrated,box=typeof ACC!=='undefined'&&ACC&&!ACC.charmBox;
  if(!hero&&!box){G.cslots=G.cslots||[];return}
  const found=[];
  const take=(it,on)=>{if(it&&it.charm)found.push({it,on:!!(on||it.on)})};
  if(hero){for(const c of G.charms||[])take(c,c&&c.on);for(let i=G.bag.length-1;i>=0;i--)if(G.bag[i]&&G.bag[i].charm)take(G.bag.splice(i,1)[0]);for(let i=G.stash.length-1;i>=0;i--)if(G.stash[i]&&G.stash[i].charm)take(G.stash.splice(i,1)[0])}
  if(box){for(let i=ACC.stash.length-1;i>=0;i--)if(ACC.stash[i]&&ACC.stash[i].charm)take(ACC.stash.splice(i,1)[0]);ACC.charmBox=1}
  const slips=found.map(f=>({it:charmToSlip(f.it),on:!!f.on}));
  slips.sort((a,b)=>charmScore(b.it,b.on)-charmScore(a.it,a.on));
  if(hero){G.cslots=G.cslots||[];const max=beltBudget(G.eq&&G.eq.belt).slots;let used=charmUsed();
    for(const s of slips){const c=charmCost(s.it);if(used+c<=max){G.cslots.push(s.it);used+=c;s.kept=1}}
    let paid=0;for(const s of slips)if(!s.kept){if(!charmStow(s.it)){G.sats=(G.sats||0)+2;paid++}}
    delete G.charms;delete G.charmOff;delete G.chT;G.charmMigrated=1;
    if(paid)toast(paid+' charm'+(paid===1?'':'s')+' did not fit. '+paid*2+' sats.')}
  else{let paid=0;for(const s of slips)if(!charmStow(s.it)){G.sats=(G.sats||0)+2;paid++}if(paid)toast(paid+' lockbox charm'+(paid===1?'':'s')+' became '+(paid*2)+' sats.')}
  if(box)accSave()}
function charmApply(s){
  s.chAll=0;s.csk={};s.chFlat=0;s.gearSkills=s.skills||0;
  if(s.beltBroken)return;
  for(const it of (G&&G.cslots)||[]){if(!it||!it.aff||(it.req||1)>G.lvl)continue;charmNormalize(it);
    for(const a of it.aff){if(!a)continue;
      if(a.k==='csk'){if(!a.cls||a.cls===G.cls)s.csk[a.i]=(s.csk[a.i]||0)+(a.v||1);continue}
      if(a.k==='skills'&&it.cls&&it.cls!==G.cls)continue;
      let v=a.v;if(a.k==='cdr'&&v>1)v=v/100;
      if(a.k==='hp')s.chFlat+=v;if(a.k==='skills')s.chAll+=v;
      s[a.k]=(s[a.k]||0)+v}}}
function charmBonus(s,i){
  if(!s)return 0;
  const gear=Math.min(4,s.gearSkills||0);let all=s.chAll||0,one=(s.csk&&s.csk[i])||0;
  if(pvpCharmOn()){const cap=Math.min(2,all+one);all=Math.min(all,cap);one=Math.max(0,cap-all)}
  const room=Math.max(0,4-gear);all=Math.min(all,room);one=Math.min(one,Math.max(0,room-all));
  return gear+all+one}
function charmRanks(i){return charmBonus(typeof S==='undefined'?null:S,i)}
function pvpCharmOn(){return !!(typeof W!=='undefined'&&W&&W.ents&&W.ents.some(e=>e&&e.mp&&e.hp>0))}
function pvpLifeMul(){
  if(typeof S==='undefined'||!S||!(S.chHp>0)||!(S.preHp>0))return 1;
  const over=S.chHp-S.preHp*.2;if(over<=0)return 1;const eff=S.maxHp-over;return eff>1?S.maxHp/eff:1}

const skipPick=it=>!it.charm&&G.eq[it.slot]&&(OPT['pk'+it.q]===false||(OPT.pkBetter&&(typeof canWear==='function'?canWear(it):it.id&&G.lvl>=it.req)&&!(itemDelta(it)>.01)));

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
 founder:[['boot','Bootstrapped','Your own hands, your own money, no runway.',{dmg:25,en:-20}],['venture','Venture Backed','Somebody else’s energy, and their terms.',{en:50,regen:4,taken:15}],['lifestyle','Lifestyle Business','Comfortable. Unambitious. Alive.',{hpP:25,regenH:5,dmg:-15}]],
 homesteader:[['tenant','Tenant','More life, slower. You are staying.',{hpP:22,mspd:-12}],['poacher','Poacher','More damage, less life. You are taking something and leaving.',{dmg:28,hpP:-18}],['fallow','Fallow','Plots tick harder. You and the flock deal less. The ground does the work.',{dmg:-15}]],
 witness:[['stringer','Stringer','Record fills faster, maximum life down further.',{hpP:-16,recFill:25}],['editor','Editor','Casts cost less record. Testimony stacks slower.',{recCost:-25,tes:-35}],['corrections','Corrections desk','Correction and Retraction recover more, and your damage is worse.',{dmg:-18,retr:40}]]};
const DOCT={taken:'{v}% damage taken',recFill:'{v}% Record fill',recCost:'{v}% Record spent',tes:'{v}% Testimony gained',retr:'{v}% faster recovery on Correction and Retraction'};
const docOf=()=>(DOCS[G.cls]||[]).find(d=>d[0]===G.doc);
const docTxt=m=>Object.keys(m).map(k=>{const v=k==='cdr'?Math.round(m[k]*100):m[k];return(v>0?'+':'')+(DOCT[k]||WEBT[k]||AFK[k].t.replace(/^\+/,'')).replace('{v}',v)}).join(', ');
const ROWB=[['Foundations','+8% life',{hpP:8}],['Reach','+15 energy',{en:15}],['Rhythm','5% faster skill recovery',{cdr:.05}],['Edge','+8% damage',{dmg:8}],['Crown','+4% deadly strike',{crit:4}]];
const rowDone=r=>[0,1,2].every(j=>G.sk[r*3+j]>0);
const skCost=i=>G.sk[i]>=5?2:1;
const skSpent=L=>L<=5?L:5+(L-5)*2;
const webCount=()=>{const c=[0,0,0,0,0,0,0,0];for(const id in G.web||{}){const a=+id.split('_')[0];if(a>=0)c[a]++}return c};
const webWeak=a=>{const c=webCount();return c[a]<c[(a+4)%8]};
function extra2(s,add){let hp=0;const d=docOf();if(d)for(const k in d[3]){if(k==='taken')s.taken=(s.taken||1)*(1+d[3][k]/100);else add(k,d[3][k])}
  for(let r=0;r<5;r++)if(rowDone(r))for(const k in ROWB[r][2])add(k,ROWB[r][2][k])}
/* ================= damage types: what a thing is made of decides what breaks it ================= */
const DTY={impact:{n:'Impact',c:'#e6e2d6',d:'Blunt force. Nothing shrugs it off entirely.'},surge:{n:'Surge',c:'#59e0e6',d:'Overvoltage. Briefly locks up what it hits.'},rust:{n:'Rust',c:'#c9803a',d:'Corrosion. Keeps eating for three seconds after the hit.'},heat:{n:'Heat',c:'#ff7a3c',d:'Thermal. A quarter of it splashes onto anything close by.'},noise:{n:'Noise',c:'#d98cff',d:'Jamming. Slows whatever is listening.'}};
DTY.sound={n:'Sound',c:'#f7931a',d:'Sound money. Nothing resists it, nothing is immune to it, and no shield stops it. That is the entire point.'};
const DTK=Object.keys(DTY);
const SKT={maxi:{0:'sound',1:'sound',3:'sound',4:'sound',5:'sound',6:'sound',7:'sound',9:'sound',11:'sound'},scrapper:{1:'rust',5:'noise',7:'heat',12:'noise'},hacker:{0:'surge',1:'surge',3:'noise',4:'surge',6:'rust',7:'noise',9:'heat',10:'noise'},courier:{3:'heat',4:'rust',7:'noise'},anon:{0:'heat',3:'heat',5:'noise',6:'heat',8:'noise'},founder:{1:'noise',3:'surge',8:'heat'},homesteader:{0:'rust',3:'rust',5:'heat',9:'rust',12:'rust',14:'rust'}};
/* Hedgerow (homesteader 6) is a wall, not a hit, so it has no type and must not retag the next swing. */
const skType=(cls,i)=>cls==='homesteader'&&i===6?null:cls==='hacker'&&i===14?(G.schema||'surge'):((SKT[cls]||{})[i]||'impact');
/* One shape per skill. Color comes from the damage type, then the class.
   A radius holds as a patch, a dash leaves a trail, a status keeps a mark,
   and a handful of shots is an orbit. Passives stay glyphs. */
const SKV_LIFE={arc:.22,bolt:.28,trail:.32,beam:.34,strike:.28,ring:.42,patch:.62,orbit:.55,mark:.8};
const SKV={scrapper:{
  0:{k:'arc',w:1.5,reach:2.4},
  1:{k:'bolt',r:4,at:'foe'},
  2:{k:'patch',r:1.4},
  3:{k:'ring',r:2.5},
  4:{k:'trail',r:3.2},
  5:{k:'ring',r:4},
  6:{k:'patch',r:1.2},
  7:{k:'trail',r:3,at:'foe'},
  8:{k:'mark'},
  9:{k:'patch',r:2.6},
  10:{k:'mark'},
  11:{k:'patch',r:1.6},
  12:{k:'patch',r:4.2,tel:1},
  13:{k:'ring',r:1.2},
  14:{k:'ring',r:1.1}
},hacker:{
  0:{k:'bolt',r:5,n:3},
  1:{k:'mark',col:'#59e0e6'},
  2:{k:'patch',r:1.5},
  3:{k:'ring',r:3.4},
  4:{k:'trail',r:.8},
  5:{k:'mark'},
  6:{k:'ring',r:3.5},
  7:{k:'orbit',n:3},
  8:{k:'mark'},
  9:{k:'trail',r:4.5,col:'#ff7a3c'},
  10:{k:'patch',r:2.2,tel:1},
  11:{k:'mark'},
  12:{k:'trail',r:4,at:'back',col:'#9a6cff'},
  13:{k:'patch',r:1.1},
  14:{k:'bolt',r:6,at:'foe',n:1}
},courier:{
  0:{k:'ring',r:2},
  1:{k:'trail',r:3,col:'#3fbf8f'},
  2:{k:'mark'},
  3:{k:'patch',r:2.6},
  4:{k:'patch',r:2.6},
  5:{k:'mark'},
  6:{k:'orbit',n:3},
  7:{k:'mark',at:'foe',n:0},
  8:{k:'mark'},
  9:{k:'trail',r:4.2},
  10:{k:'mark'},
  11:{k:'patch',r:1.8},
  12:{k:'mark',col:'#e6e2d6'},
  13:{k:'mark'},
  14:{k:'mark',at:'foe',n:0,col:'#3fbf8f'}
},anon:{
  0:{k:'patch',r:2.6},
  1:{k:'ring',r:.8},
  2:{k:'mark'},
  3:{k:'patch',r:2.4},
  4:{k:'ring',r:1.4},
  5:{k:'patch',r:3,at:'foe',tel:1},
  6:{k:'ring',r:2.2},
  7:{k:'orbit'},
  8:{k:'ring',r:9},
  9:{k:'arc',w:1,reach:3.2},
  10:{k:'mark'},
  11:{k:'mark'},
  12:{k:'patch',r:1.35},
  13:{k:'patch',r:1.9},
  14:{k:'mark'}
},founder:{
  0:{k:'orbit'},
  1:{k:'patch',r:3,tel:1},
  2:{k:'mark'},
  3:{k:'orbit',n:3},
  4:{k:'ring',r:1.1},
  5:{k:'ring',r:2},
  6:{k:'orbit'},
  7:{k:'mark',at:'foe',n:0,col:'#7be495'},
  8:{k:'mark'},
  9:{k:'mark',at:'foe',n:0,col:'#c9a868'},
  10:{k:'mark',at:'foe',n:0},
  11:{k:'mark'},
  12:{k:'orbit'},
  13:{k:'patch',r:1.5},
  14:{k:'ring',r:5}
},maxi:{
  0:{k:'arc',w:1,reach:2.6},
  1:{k:'bolt',r:2.2,at:'foe',n:1},
  2:{k:'mark'},
  3:{k:'patch',r:2.2},
  4:{k:'patch',r:3.6},
  5:{k:'trail',r:3.4},
  6:{k:'orbit',n:3},
  7:{k:'patch',r:3.3},
  8:{k:'mark'},
  9:{k:'patch',r:4.2,tel:1},
  10:{k:'mark'},
  11:{k:'orbit',n:3},
  12:{k:'mark'},
  13:{k:'ring',r:.9},
  14:{k:'mark'}
},homesteader:{
  0:{k:'patch',r:2.2},
  1:{k:'mark'},
  2:{k:'orbit',n:3},
  3:{k:'ring',r:3},
  4:{k:'mark'},
  5:{k:'orbit',n:1},
  6:{k:'mark',col:'#4e6a48'},
  7:{k:'mark'},
  8:{k:'mark'},
  9:{k:'patch',r:3.4},
  10:{k:'mark'},
  11:{k:'mark'},
  12:{k:'mark'},
  13:{k:'mark'},
  14:{k:'mark'}
},witness:{
  0:{k:'mark',at:'foe',n:0,col:'#e6dcc8'},
  1:{k:'mark',at:'foe'},
  2:{k:'mark'},
  3:{k:'mark',at:'foe',n:0,col:'#e6dcc8'},
  4:{k:'bolt',r:2.2,at:'foe',n:1},
  5:{k:'mark'},
  6:{k:'mark'},
  7:{k:'patch',r:1.4},
  8:{k:'mark'},
  9:{k:'mark',at:'foe',n:0,col:'#8d9aab'},
  10:{k:'mark'},
  11:{k:'mark'},
  12:{k:'mark',col:'#e6dcc8'},
  13:{k:'mark'},
  14:{k:'mark'}
}};
function skvOf(cls,i){const row=(SKV[cls]||{})[i];if(!row)return null;const sk=CLS[cls]&&CLS[cls].sk[i];let col=row.col;
  if(!col&&sk&&sk.a){const ty=skType(cls,i);if(DTY[ty])col=DTY[ty].c}if(!col)col=(CLS[cls]&&CLS[cls].col)||'#e6e2d6';
  return {k:row.k,col:col,r:row.r||1.2,w:row.w||1,n:row.n!=null?row.n:(row.k==='orbit'?3:1),life:row.life||SKV_LIFE[row.k]||.4,at:row.at||'',tel:row.tel?1:0,reach:row.reach||0}}
function skvPlay(cls,i,x,y,dir,remote){const v=skvOf(cls,i);if(!v||!W||!W.fx)return;const dx=(dir&&dir.x)||1,dy=(dir&&dir.y)||0;
  let px=x,py=y,x2=x+dx*(v.r||3),y2=y+dy*(v.r||3);
  if(v.at==='back'){x2=x-dx*(v.r||3);y2=y-dy*(v.r||3)}
  if(v.at==='foe'&&!remote){const t=nearest(8);if(t){x2=t.x;y2=t.y;if(v.k==='mark'||v.k==='patch'||v.k==='ring'||v.k==='strike'){px=t.x;py=t.y}}}
  W.fx.push({k:v.k,x:px,y:py,x2:x2,y2:y2,dx:dx,dy:dy,r:v.r,w:v.w,n:v.n,col:v.col,t:0,life:v.life,tel:v.tel,reach:v.reach||0,remote:remote?1:0})}
const baseType=()=>G.cls==='maxi'?'sound':(G.eq.weapon&&G.eq.weapon.dt)||(G.cls==='hacker'?'surge':'impact');
const RES={tick:{surge:1.5},drone:{surge:1.5,noise:.5},bot:{impact:.75,rust:1.5},hound:{noise:1.5,rust:.5},ad:{noise:0,impact:1.5},hr:{noise:.5,heat:1.5},mech:{impact:.5,rust:1.5,surge:1.25},seer:{surge:.5,impact:1.5},aegis:{surge:0,heat:1.5},lancer:{noise:1.5,heat:.5},splitter:{heat:1.5,impact:.5},
 director:{noise:.5,rust:1.5},proxy:{rust:.5,surge:1.5},censor:{noise:0,heat:1.5},shill:{noise:1.5},boss:{noise:.5,rust:1.5,heat:1.25},boss2:{noise:0,surge:1.5,impact:.75},boss3:{surge:.5,noise:.5,impact:1.5,heat:1.25}};
const resTxt=k=>{const r=RES[k]||{},w=[],s=[],im=[];for(const t in r){(r[t]===0?im:r[t]>1?w:s).push(DTY[t].n)}return (w.length?'Weak to '+w.join(', '):'')+(s.length?(w.length?' · ':'')+'Resists '+s.join(', '):'')+(im.length?(w.length||s.length?' · ':'')+'Immune to '+im.join(', '):'')};const dealTxt=k=>DTY[ETY[k]||'impact'].n;;
let DT=null;
/* returns the damage after type bonuses, weakness and resistance; applies the type's side effect */
function typed(e,d){let ty=DT||(P.fm&&P.fm.t>0&&P.fm.dt)||(typeof hsForm==='function'&&hsForm()==='worn'?(P&&P.tag?P.formDt:G.formDt):null)||baseType();
  /* holdTy keeps a hireling hit, a thorns slap, or an acqui-hired strike on its own type. Priced in Sound converts what you swing, not what they swing. */
  if(!P.holdTy&&G.cls==='maxi'&&sl(12)&&ty!=='sound'){d*=.55+.03*sl(12);ty='sound'}
  if(ty==='sound'){/* no table, no multiplier, no argument */
    e.snd=1;e.lt=ty;return d*(1+(S.t_sound||0)/100)}
  let m=((RES[e.k]||{})[ty]);if(!P.holdTy&&P.k9===ty){P.k9=null;if(m!==0&&m<1)m=1}const mul=m===undefined?1:m;d*=(1+(P.holdTy?0:(S['t_'+ty]||0))/100)*mul;
  if(mul!==1&&!(e.ft>0)){e.ft=1.2;float(e.x,e.y-.4,mul===0?'Immune':mul>1?'Weak!':'Resists',mul>1?'#7be495':'#9a94a8',0)}
  if(mul>0){if(ty==='surge')e.stun=Math.max(e.stun,.15);else if(ty==='noise')e.slow=Math.max(e.slow,1.5);else if(ty==='rust')e.rust={dps:d*.2/3,t:3,c:0};else if(ty==='heat'){const sp=d*.25;for(const o of W.ents)if(o!==e&&o.hp>0&&Math.hypot(o.x-e.x,o.y-e.y)<1.4+o.r)o.hp=Math.max(1,o.hp-sp*(((RES[o.k]||{}).heat)===undefined?1:RES[o.k].heat)),o.flash=.08}}
  if(!P.holdTy&&mul>1&&S.sp.pkey)d*=1.35;e.lt=ty;return d}
function typeTick(dt){for(const e of W.ents.slice()){if(e.ft>0)e.ft-=dt;if(e.noheal>0)e.noheal-=dt;const r=e.rust;if(r){r.t-=dt;r.c-=dt;if(r.c<=0){r.c=.5;dmgEnemy(e,r.dps*.5,false);e.hits=Math.max(0,(e.hits||1)-1);if(Math.random()<.5)W.parts.push({x:e.x,y:e.y,z:16,vx:rnd(-.5,.5),vy:rnd(-.5,.5),vz:30,t:0,life:.5,col:'#c9803a',s:3})}if(r.t<=0)e.rust=null}}}
/* what the machines hit you with, and how you stand up to it */
const ETY={tick:'heat',ad:'noise',hr:'noise',seer:'noise',censor:'noise',shill:'noise',aegis:'surge',lancer:'surge',proxy:'surge',splitter:'rust',boss2:'noise',boss3:'surge'};
const foeType=src=>!src?'impact':src.dty||(src.mods&&src.mods.arc?'surge':src.mods&&src.mods.boom?'heat':ETY[src.k]||'impact');
/* Combat resists only. Sound is not one of them: nothing the player takes is Sound. */
const RTK=['impact','surge','rust','heat','noise'];
function resPen(){return G&&G.diff===1?20:G&&G.diff===2?50:0}
function resClamp(v){return Math.max(-100,Math.min(75,v))}
function resEff(s,ty){return resClamp(((s&&s['r_'+ty])||0)-resPen())}
const resOf=ty=>ty&&RTK.includes(ty)?resEff(S,ty):0;
function mercResOf(ty){const m=G&&G.merc,row=m&&MERCS[m.k]&&MERCS[m.k].res&&MERCS[m.k].res[ty];const raw=row?row[0]+row[1]*(G.lvl||1):0;return resClamp(raw-resPen())}
/* Resist, then the caller applies armor. Rust's leftover corrosion is armed from that armored number, not here. */
function typedIn(d,src){const ty=foeType(src),r=resOf(ty);d*=1-r/100;P.lastTy=ty;
  if(ty==='surge')G.en=Math.max(0,G.en-4*(1-r/100));else if(ty==='noise')P.slow=Math.max(P.slow,.8*(1-r/100));return d}
function mercTypedIn(d,src){const a=W&&W.merc;if(!a)return d;const ty=foeType(src),r=mercResOf(ty);d*=1-r/100;a.lastTy=ty;if(ty==='noise')a.slow=Math.max(a.slow||0,.8*(1-r/100));return d}
function typeInTick(dt){const r=P.rustD;if(r){r.t-=dt;if(G.hp>1)G.hp=Math.max(1,G.hp-r.dps*dt);if(r.t<=0)P.rustD=null}}

function fixTypes(it){if(!it||!it.aff)return it;for(const a of it.aff){if(a.k==='t_x'){const free=DTK.filter(t=>!it.aff.some(x=>x!==a&&x.k==='t_'+t));a.k='t_'+(free.length?pick(free):pick(DTK))}else if(a.k==='r_x'){const free=RTK.filter(t=>!it.aff.some(x=>x!==a&&x.k==='r_'+t));if(free.length){a.k='r_'+pick(free);a.grp='res'}else a.k='r_fold'}}it.aff=it.aff.filter(a=>{if(a.k!=='r_fold')return true;const host=it.aff.find(x=>x!==a&&RTK.some(t=>x.k==='r_'+t));if(host)host.v+=a.v;return false});return it}
function migrateItem(it){if(!it||!Array.isArray(it.aff))return false;let ch=false;if(it.aff.some(a=>a.k==='t_x'||a.k==='r_x')){fixTypes(it);ch=true}for(const a of it.aff){if((a.k==='r_all'||RTK.some(t=>a.k==='r_'+t))&&a.grp!=='res'){a.grp='res';ch=true}}for(let i=it.aff.length-1;i>=0;i--){const a=it.aff[i];if(a.k!=='r_sound')continue;const free=RTK.filter(t=>!it.aff.some(x=>x!==a&&x.k==='r_'+t));if(free.length){a.k='r_'+pick(free);a.grp='res'}else{const host=it.aff.find(x=>x!==a&&RTK.some(t=>x.k==='r_'+t));if(host)host.v+=a.v;it.aff.splice(i,1)}ch=true}return ch}
function migrateResists(){let acc=false;const touch=it=>{if(migrateItem(it)){}};const piles=[];if(G){if(G.eq)for(const k in G.eq)if(G.eq[k])piles.push(G.eq[k]);for(const it of G.bag||[])if(it)piles.push(it);for(const it of G.stash||[])if(it)piles.push(it);for(const it of G.charms||[])if(it)piles.push(it);for(const it of G.cslots||[])if(it)piles.push(it);if(G.merc)for(const sl of ['weapon','helm','armor'])if(G.merc[sl])piles.push(G.merc[sl])}if(typeof ACC!=='undefined'&&ACC&&ACC.stash)for(const it of ACC.stash)if(it){if(migrateItem(it))acc=true}for(const it of piles)touch(it);if(typeof ZS!=='undefined')for(const k in ZS){const w=ZS[k];if(w&&w.drops)for(const d of w.drops)if(d&&d.it)migrateItem(d.it)}if(typeof W!=='undefined'&&W&&W.drops)for(const d of W.drops)if(d&&d.it)migrateItem(d.it);if(acc)accSave()}
ITEM_HOOKS.push(function(it){return fixTypes(it)});

function freshState(){osWin=[];shillT=70;SB=null;SUBP=null;EV=null;gateAct=0;dlgQ.length=0;toastQ.length=0;objC='';DT=null}
/* ================= class weapons: five families, each made for one kind of wanderer ================= */
const FAM={sign:{cls:'scrapper',n:'Sign',bases:['Road Sign','Girder','Wrecking Bar','Picket Maul'],dm:1.25,sp:-15,perk:'+10% chance to stun, +10% armor',st:{stun:10,armorP:10}},
 deck:{cls:'hacker',n:'Deck',bases:['Cracked Tablet','Soldered Deck','Root Console','Zero-Day Rig'],dm:.8,sp:0,perk:'+20 energy, +15% Surge damage',st:{en:20,t_surge:15}},
 sling:{cls:'courier',n:'Launcher',bases:['Parcel Sling','Courier Tube','Rail Launcher','Last-Mile Cannon'],dm:.9,sp:15,perk:'+10% attack speed, throws pierce more often',st:{aspd:10,pierce:15}},
 shiv:{cls:'anon',n:'Shiv',bases:['Letter Opener','Ceramic Shiv','Burner Blade','Null Edge'],dm:.95,sp:8,perk:'+6% deadly strike, deadlier deadly strikes',st:{crit:6,critM:.25}},
 pager:{cls:'founder',n:'Instrument',bases:['Pager','Term Sheet','Golden Stapler','Cap Table'],dm:.85,sp:0,perk:'+2 energy per second, 8% faster skill recovery',st:{regen:2,cdr:.08}},
 graft:{cls:'homesteader',n:'Graft',bases:['Pruner','Irrigation Spike','Fence Post','Combine Blade'],dm:1,sp:0,perk:'plots last longer, and the flock leash is a step more forgiving',st:{}},
 notebook:{cls:'witness',n:'Notebook',bases:['Stub Pencil','Court Pad','Bound Minutes','The Seventh Part'],dm:1,sp:0,perk:'the Record fills a little faster, and Testimony stacks one higher',st:{}}};
function famify(it){const mine=Object.keys(FAM).find(k=>FAM[k].cls===G.cls),k=Math.random()<.5&&mine?mine:pick(Object.keys(FAM)),F=FAM[k],nb=F.bases[tierOf(it.il)];
  if(it.name&&it.base&&it.name.includes(it.base))it.name=it.name.replace(it.base,nb);else if(it.q===0)it.name=nb;it.base=nb;it.fam=k;it.dmin=Math.max(1,Math.round(it.dmin*F.dm));it.dmax=Math.max(it.dmin+1,Math.round(it.dmax*F.dm));it.spd=(it.spd||0)+F.sp;return it}
/* Nonce always has one weapon the class can use, three item levels ahead of the character. */
function classWeapon(il){const mine=Object.keys(FAM).find(k=>FAM[k].cls===G.cls);if(!mine)return null;const it=makeItem(Math.max(1,il|0),Math.random()<.35?2:1,'weapon');
  if(it.fam&&it.fam!==mine&&FAM[it.fam]){const old=FAM[it.fam];it.dmin=Math.max(1,Math.round(it.dmin/old.dm));it.dmax=Math.max(it.dmin+1,Math.round(it.dmax/old.dm));it.spd=(it.spd||0)-old.sp;it.fam=null}
  if(it.fam!==mine){const F=FAM[mine],nb=F.bases[tierOf(it.il)];it.name=nb;it.base=nb;it.fam=mine;it.dmin=Math.max(1,Math.round(it.dmin*F.dm));it.dmax=Math.max(it.dmin+1,Math.round(it.dmax*F.dm));it.spd=(it.spd||0)+F.sp}
  it.id=true;stampReq(it);return it}
function famBonus(s){const w=G.eq.weapon;if(!w||!w.fam)return;if(typeof gearQuiet==='function'&&gearQuiet(w))return;const F=FAM[w.fam];if(F.cls!==G.cls)return;s.skills+=1;for(const k in F.st)s[k]=(s[k]||0)+F.st[k]}
ITEM_HOOKS.push(function(it,il){if(it.slot==='weapon'&&it.q<4&&il>2&&G&&Math.random()<.4)famify(it);return it});
/* Stat requirements. Missing fields stay 0, so an old save is not restamped. */
const HEAVY_BODY={ 'Flak Coat':1,'Exo Plate':1,'Seraph Plate':1 };
const LIGHT_BOOT={ 'Worn Sneakers':1,'Skywalkers':1 };
const HEAVY_BOOT={ 'Steel-Toes':1,'Mag Greaves':1 };
function reqRound(n){n=Math.round(n);return n<1?0:n}
function reqBump(n,q){n=reqRound(n);if((q||0)>=3)n=reqRound(n*1.1);return n}
function famKeyOf(it){
  if(!it)return '';
  if(it.fam&&FAM[it.fam])return it.fam;
  if(it.slot!=='weapon')return '';
  const name=it.base||'';
  for(const k in FAM)if(FAM[k].bases.indexOf(name)>=0)return k;
  return ''}
function weaponRole(it){
  const fam=famKeyOf(it);
  if(fam==='sign')return 'heavy';
  if(fam==='deck')return 'deck';
  if(fam==='pager')return 'pager';
  if(fam==='sling')return 'fast';
  if(fam==='shiv')return 'shiv';
  if(fam==='graft')return 'graft';
  if(fam==='notebook')return 'notebook';
  const spd=it.spd||0;
  if(spd<=-15)return 'heavy';
  if(spd>=15)return 'fast';
  return 'neutral'}
function stampReq(it){
  if(!it||it.charm)return it;
  if(it.loan||it.slot==='ring'||it.slot==='amulet'){it.reqMgt=0;it.reqRef=0;it.reqBnd=0;return it}
  const il=+it.il||0,q=it.q||0;let m=0,r=0,b=0;
  if(it.slot==='weapon'){const role=weaponRole(it);
    if(role==='heavy')m=8+il*1.6;
    else if(role==='neutral'||role==='graft')m=4+il*.9;
    else if(role==='fast')r=6+il*1.35;
    else if(role==='shiv')r=4+il*.7;
    else if(role==='deck'||role==='pager')b=4+il*.9;
    else if(role==='notebook')m=(4+il*.9)/2}
  else if(it.slot==='armor'){m=HEAVY_BODY[it.base]?6+il*1.15:il*.45}
  else if(it.slot==='helm')m=(6+il*1.15)*.6;
  else if(it.slot==='gloves'||it.slot==='belt')m=(4+il*.9)*.4;
  else if(it.slot==='boots'){if(LIGHT_BOOT[it.base])r=il*.35;else m=(8+il*1.6)*.4}
  it.reqMgt=reqBump(m,q);it.reqRef=reqBump(r,q);it.reqBnd=reqBump(b,q);return it}
ITEM_HOOKS.push(function(it){return stampReq(it)});
const STATN=['mgt','ref','vit','bnd'];
function itemOwnStats(it){
  const o={mgt:0,ref:0,vit:0,bnd:0};
  if(!it||itemBroken(it))return o;
  for(const a of it.aff||[])if(o[a.k]!=null)o[a.k]+=+a.v||0;
  if(it.uid&&typeof UNIK!=='undefined'&&UNIK[it.uid]&&UNIK[it.uid].per&&uOk(it)){const lv=(G&&G.lvl)||1;const per=UNIK[it.uid].per;for(const k of STATN)if(per[k])o[k]+=per[k]*lv}
  return o}
function charmPool(excludeSlot){
  const o={mgt:0,ref:0,vit:0,bnd:0};
  const belt=G&&G.eq&&G.eq.belt;
  if(excludeSlot!=='belt'&&belt&&itemBroken(belt))return o;
  for(const it of (G&&G.cslots)||[]){if(!it||!it.aff||(it.req||1)>(G.lvl||1))continue;
    for(const a of it.aff)if(a&&o[a.k]!=null)o[a.k]+=+a.v||0}
  return o}
function poolMeets(pool,it,own){
  own=own||{mgt:0,ref:0,vit:0,bnd:0};
  return (pool.mgt+(own.mgt||0))>=((it&&it.reqMgt)||0)&&(pool.ref+(own.ref||0))>=((it&&it.reqRef)||0)&&(pool.bnd+(own.bnd||0))>=((it&&it.reqBnd)||0)}
function gearLive(excludeSlot){
  const pool={mgt:(G.at&&G.at.mgt)||0,ref:(G.at&&G.at.ref)||0,vit:(G.at&&G.at.vit)||0,bnd:(G.at&&G.at.bnd)||0};
  const ch=charmPool(excludeSlot);for(const k of STATN)pool[k]+=ch[k];
  const live={};let changed=true;
  while(changed){changed=false;for(const sl of SLOTS){if(sl===excludeSlot||live[sl])continue;const it=G.eq&&G.eq[sl];if(!it||itemBroken(it))continue;const own=itemOwnStats(it);if(!poolMeets(pool,it,own))continue;live[sl]=1;for(const k of STATN)pool[k]+=own[k];changed=true}}
  return {live,pool}}
function gearQuiet(it){
  if(!it||!G||!G.eq||itemBroken(it))return false;
  let slot='';for(const sl of SLOTS)if(G.eq[sl]===it)slot=sl;
  if(!slot)return false;
  return !gearLive(null).live[slot]}
function reqOk(it,slot){if(!it)return false;return poolMeets(gearLive(slot).pool,it,itemOwnStats(it))}
function reqShortfall(it){
  const out=[];if(!it||it.charm)return out;
  const pool=gearLive(it.slot).pool,own=itemOwnStats(it);
  const rows=[['Might','mgt','reqMgt'],['Reflex','ref','reqRef'],['Bandwidth','bnd','reqBnd']];
  for(const row of rows){const need=it[row[2]]||0;if(!need)continue;const have=(pool[row[1]]||0)+(own[row[1]]||0);if(have<need)out.push({name:row[0],key:row[1],need:need,have:have,short:need-have})}
  return out}
function cantEquipText(it){
  const lvl=!!(it&&G.lvl<(it.req||0)),sh=reqShortfall(it);
  if(lvl&&!sh.length)return 'Needs level '+(it.req||1);
  const bits=[];if(lvl)bits.push('Needs level '+(it.req||1));
  for(const f of sh)bits.push('Need +'+f.short+' '+f.name);
  return bits.length?"Can't equip. "+bits.join('. ')+'.':"Can't equip."}
function reqLineHTML(it){
  if(!it||it.charm)return '';
  const sh=reqShortfall(it),bad={};for(const f of sh)bad[f.name]=f;
  const rows=[['Might','reqMgt'],['Reflex','reqRef'],['Bandwidth','reqBnd']];let h='';
  for(const row of rows){const n=it[row[1]]||0;if(!n)continue;const fail=bad[row[0]];
    h+=`<div class="ln${fail?' red':''}">Required ${row[0]}: ${n}${fail?' · need +'+fail.short:''}</div>`}
  return h}
function reqBadgeText(it){
  if(!it||!it.id||it.charm||!it.slot)return '';
  if(G&&G.merc&&['weapon','helm','armor'].some(sl=>G.merc[sl]===it))return '';
  if(typeof canWear==='function'&&canWear(it))return '';
  const sh=reqShortfall(it),lvl=G.lvl<(it.req||0);
  if(lvl&&!sh.length)return 'need level '+(it.req||1);
  if(!sh.length)return '';
  let t='need '+sh.map(f=>'+'+f.short+' '+f.name).join(', ');
  if(lvl)t='need level '+(it.req||1)+', '+sh.map(f=>'+'+f.short+' '+f.name).join(', ');
  return t}
function driveStat(cls){
  if(cls==='hacker'||cls==='founder')return 'bnd';
  if(cls==='courier')return 'ref';
  if(cls==='witness')return 'vit';
  return 'mgt'}
function liveWeaponRole(){
  const w=G&&G.eq&&G.eq.weapon;
  if(!w||itemBroken(w)||gearQuiet(w))return '';
  return weaponRole(w)}
function weaponStatKey(role,cls){
  if(role==='heavy'||role==='neutral'||role==='graft'||role==='notebook')return 'mgt';
  if(role==='fast'||role==='shiv')return 'ref';
  if(role==='pager'&&cls==='founder')return 'bnd';
  return ''}
function attrSum(k,s){s=s||S;return ((G.at&&G.at[k])||0)+((s&&s[k])||0)}
function blowSpec(){
  const cls=G&&G.cls,sk=(P&&P.hitSk>=0)?P.hitSk:-1,ally=!!(P&&P.allySwing),area=!!(P&&P.areaTick),body=P&&P.swingBody;
  if(cls==='scrapper'||cls==='maxi')return {k:'mgt',rate:1.5};
  if(cls==='hacker')return {k:'bnd',rate:1.5};
  if(cls==='anon'){
    const mine=(P&&P.blowForce==='mgt')||(body&&(body.k==='mine'||body.k==='blast'||body.k==='decoy'));
    if(mine||sk===0||sk===3||sk===6||sk===8)return {k:'mgt',rate:1.5};
    return {k:'ref',rate:1.5}}
  if(cls==='founder'){
    if(ally||sk===8||sk===14)return {k:'bnd',rate:.7};
    return {k:weaponStatKey(liveWeaponRole(),cls)||'mgt',rate:1.5}}
  if(cls==='homesteader'){
    const flock=body&&(body.flock||body.kind==='stray'||body.kind==='bull');
    if(area||flock||sk===12)return {k:'vit',rate:.4};
    return {k:weaponStatKey(liveWeaponRole(),cls)||'mgt',rate:1.5}}
  if(cls==='courier'){const w=weaponStatKey(liveWeaponRole(),cls);return {k:w||'ref',rate:1.5}}
  if(cls==='witness')return {k:weaponStatKey(liveWeaponRole(),cls)||'mgt',rate:1.5};
  return {k:'mgt',rate:1.5}}
function blowPct(s){const sp=blowSpec();return attrSum(sp.k,s)*sp.rate}
function swingBlow(s){
  if(!P)return blowPct(s);
  const prev=P.hitSk,ally=P.allySwing,area=P.areaTick,force=P.blowForce,body=P.swingBody;
  P.hitSk=-1;P.allySwing=0;P.areaTick=0;P.blowForce=null;P.swingBody=null;
  try{return blowPct(s)}finally{P.hitSk=prev;P.allySwing=ally;P.areaTick=area;P.blowForce=force;P.swingBody=body}}
const ATTR_TIP={
  scrapper:{mgt:'+1.5% damage per point. Heavy weapons and plate ask for Might.',ref:'+0.3% deadly strike and +1 armor per point.',vit:'+4 life per point.',bnd:'+3 energy per point.'},
  hacker:{mgt:'A mantle asks for a little Might. It does not add spell damage.',ref:'+0.3% deadly strike and +1 armor per point.',vit:'+4 life per point.',bnd:'+3 energy per point, and +1.5% spell damage.'},
  courier:{mgt:'A maul makes throws read Might. Plate asks for it too.',ref:'+0.3% deadly strike, +1 armor, and +1.5% on a throw.',vit:'+4 life per point.',bnd:'+3 energy per point.'},
  anon:{mgt:'+1.5% on mines, Zip Bomb, the honeypot, and Legion.',ref:'+0.3% deadly strike, +1 armor, and +1.5% on the knife, the hop, and Rehearsal.',vit:'+4 life per point.',bnd:'+3 energy per point.'},
  founder:{mgt:'The personal bolt and the mech read the weapon. A maul reads Might.',ref:'+0.3% deadly strike and +1 armor per point.',vit:'+4 life per point.',bnd:'+3 energy per point, and +0.7% on the workforce.'},
  homesteader:{mgt:'+1.5% on the shot, the hull, and the hound.',ref:'+0.3% deadly strike and +1 armor per point.',vit:'+4 life per point, and +0.4% on plots, frost, salt, and the flock.',bnd:'+3 energy per point.'},
  witness:{mgt:'+1.5% on the swing. A notebook asks for a little Might.',ref:'+0.3% deadly strike and +1 armor per point.',vit:'+4 life per point, and +0.6% on Thread, Publish, and Cross-reference.',bnd:'+3 energy per point.'},
  maxi:{mgt:'+1.5% damage per point, including the hammers.',ref:'+0.3% deadly strike and +1 armor per point.',vit:'+4 life per point.',bnd:'+3 energy per point.'}};
function attrTip(k){const row=ATTR_TIP[G&&G.cls];return (row&&row[k])||ATTR[k][1]}

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
 {id:'coldwallet',n:'Cold Wallet',slot:'belt',il:16,base:'Tool Belt',ind:1,mods:{hp:[40,60],armorP:[30,45]},sp:'You pay no fee when you die, and sats you pick up count for a quarter more',fl:'Never been online. Never will be.'},
 {id:'hashrate',n:'Hash Rate',slot:'gloves',il:28,base:'Servo Fists',mods:{aspd:[10,15],dmg:[20,35]},sp:'+1% damage for every kill in your streak, up to 40',fl:'More work, more weight.'},
 {id:'soaker',cls:'homesteader',n:'Soaker Hose',slot:'belt',il:12,base:'Tool Belt',mods:{hp:[30,50]},sp:'Homesteader only. Plots you place last half again as long',fl:'It weeps. That is the point.'},
 {id:'collar',cls:'homesteader',n:'One Collar',slot:'amulet',il:10,base:'Dog Tag',mods:{hp:[20,35]},sp:'Homesteader only. A single stray is already with you',fl:'You did not name it. It did not ask.'},
 {id:'carbon',cls:'witness',n:'Carbon Sheet',slot:'belt',il:12,base:'Tool Belt',mods:{hp:[20,35]},sp:'Witness only. The Record fills faster',fl:'A copy that does not smudge.'},
 {id:'press',cls:'witness',n:'Press Pass',slot:'amulet',il:14,base:'Dog Tag',mods:{hp:[15,25]},sp:'Witness only. Testimony stacks two higher, and the first Look lands twice',fl:'The name on it is not yours. It still opens the door.'});
const UNIK={};for(const u of UNI)UNIK[u.id]=u;
const uOk=it=>{const u=UNIK[it.uid];return!u||!u.cls||u.cls===G.cls};
function uniTick(dt){if(W.z.town)return;const want=(flag,kind,n,o)=>{const have=W.allies.filter(a=>a.item===flag);if(S.sp[flag]){if(have.length<n){P['u_'+flag]=(P['u_'+flag]||0)-dt;if(P['u_'+flag]<=0){P['u_'+flag]=4;W.allies.push(Object.assign({k:'minion',kind,item:flag,per:1,x:P.x+rnd(-.8,.8),y:P.y+rnd(-.8,.8),cd:0,ph:rnd(0,6),off:rnd(0,1),life:1e9,fx:1},o(),{dt:null}))}}}else for(const a of have)W.allies.splice(W.allies.indexOf(a),1)};
  want('armband','intern',2,()=>({m:.55,ivl:.7,hp:S.maxHp*.5,max:S.maxHp*.5,r:.3,taunt:1}));
  want('duck','drone',1,()=>({m:.5,ivl:.7,rng:5.5}));
  want('face','clone',1,()=>({m:.5,ivl:.5,hp:S.maxHp*.7,max:S.maxHp*.7,taunt:1,r:.3}));
  want('orgchart','golem',1,()=>({m:1.3,ivl:1.1,aoe:1,hp:S.maxHp*1.6,max:S.maxHp*1.6,taunt:1,r:.5,armM:.6,spd:4}))
  want('collar','stray',1,()=>({per:0,flock:1,m:.35,ivl:.7,rng:1.15,bite:8,r:.28,spd:4.2,dt:'rust'}))}

/* ================= The Bull Run: there is no bull market ================= */
ET.bull={n:'Market Bull',spr:'hound',hp:70,dmg:13,spd:3.2,r:.5,range:1.3,xp:30,atk:1.1,sight:9,pal:['#e0bd6e','#8a5a1a']};
TC.bull={n:'Market Bull',picks:2,no:20,gold:50,item:22,stim:8,q:{u:110,s:90,r:14,m:3},note:'Often drops sats'};
RES.bull={noise:1.5,impact:.75};
ZONES.push({n:'The Bull Run',secret:true,lvl:1,style:'moor',out:1,amb:.3,mix:[['bull',1]],su:{k:'bull',n:'The Golden Bull',mods:['strong','fast'],q:null},intro:'A green field under a sky that only goes up. Hundreds of them, golden, snorting, and every one of them certain. The Office of Price Stability has always said this place does not exist.'});
const BULLZ=ZONES.length-1;
MEMOS.push(['Notice from the Office of Price Stability','There is no bull market. There has never been a bull market. Reports of a “bull run” beyond the Transit Gate are false, and Residents are reminded not to bring machine parts to the gate, in particular legs.']);
function legCheck(){if(W.zi!==1||G.leg||G.q.q15!==3)return;const p=nearFree({x:W.start.x+1.6,y:W.start.y+1.2},.3);let o=W.objs.find(o=>o.k==='leg');if(!o){o={k:'leg'};W.objs.push(o)}o.x=p.x;o.y=p.y;setTimeout(()=>toast('Something is twitching on the ground near the gate.'),1500)}
function legTake(o){W.objs.splice(W.objs.indexOf(o),1);G.leg=1;sfx('unique');dlg('A servo leg','All that is left of Gatewarden HOA-9: one leg, still twitching, stamped PROPERTY OF UNITY HOLDINGS. It is no use to anyone. You take it anyway. Somebody once said the Transit Gate does odd things when you jam the wrong part into it.',[['Keep it']])}
function bullStart(){if(!G.leg)return;if(!spendSats(10,'The gate wants 10 sats to look the other way'))return;const z=ZONES[BULLZ];z.lvl=G.lvl+2-G.tier*12;delete ZS[BULLZ];enter(BULLZ,{fresh:true,after(){W.portals=W.portals.filter(p=>p.kind!=='next');for(const p of W.portals)if(p.kind==='prev')p.kind='home';for(const e of W.ents)if(e.k==='bull'&&!e.su&&Math.random()<.5)e.say=1}})}
function bullKill(e){if(e.k!=='bull'||!W.z.secret)return;if(Math.random()<.22)addDrop({sat:ri(1,3)},e.x,e.y);
  if(e.su){G.st.bullKing=(G.st.bullKing||0)+1;mktNews(.3,'the Golden Bull is down');for(let i=0;i<6;i++)addDrop({sat:ri(6,12)},e.x,e.y);addDrop({it:makeItem(W.ml+2,4)},e.x,e.y);W.portals.push({x:e.x,y:e.y,kind:'home'});sfx('quest');setTimeout(()=>dlg('The Golden Bull is down','The field goes quiet. Somewhere a chart stops going up, just for a moment. The Office of Price Stability will deny that any of this happened, and for once you are inclined to let them.',[['Moo']]),900)}}
/* ================= builds: when the rig rolls for you, it offers plans that hang together ================= */
const BUILDS={
 maxi:[
  {k:'orange',n:'Orange Pilled',p:'Pills, four words, and a megabyte in the doorway. Marked to Market stays on, Cite Your Sources reads it, and Priced in Sound turns the rest into it.',doc:'toxic',at:[45,20,25,10],pr:[[0,10],[6,8],[4,6],[11,6],[12,5],[9,4],[1,5],[2,5],[8,4],[10,3],[7,3],[13,1]],sl:[0,11,4],pa:[2,8,12,10],web:[0,1],fk:['over','burst','mark','echo']}],
 scrapper:[
  {k:'crew',n:'Wrecking Crew',p:'Wade into the middle and hit everything at once. Two-handed swings, and each machine near you makes you hit harder.',doc:'wildcat',at:[50,15,35,0],pr:[[0,10],[3,10],[8,6],[7,6],[6,4],[13,6],[11,4],[10,3],[2,4]],sl:[0,3,13],pa:[8,11,10,2],web:[0,1],fk:['over','burst','stun','echo']},
  {k:'wall',n:'Immovable Object',p:'Armor, life, and a horn that stuns the room. You win by still being there.',doc:'picket',at:[20,25,55,0],pr:[[2,10],[5,8],[0,6],[3,4],[11,6],[14,5],[10,4],[6,4]],sl:[0,5,14],pa:[2,11,10,8],web:[1,2],fk:['ward','siphon','stun','lean']},
  {k:'thrower',n:'Scrap Thrower',p:'Stay at arm’s length. Rusty scrap through the whole line, seniority on the weapon in your hands, then a rush to finish.',doc:'mutual',at:[45,10,30,15],pr:[[1,10],[4,8],[7,6],[0,3],[12,5],[10,5],[9,3],[2,4],[8,3]],sl:[1,4,12],pa:[10,2,8],web:[0,5],fk:['mark','echo','over','lean']}],
 hacker:[
  {k:'chain',n:'Chain Reaction',p:'Prime with Spark Lance, then Arc Chain through the pack. Deadly strikes do the rest. Schema is Surge, so the chain and the barrier agree.',schema:'surge',doc:'rootkit',at:[15,5,30,50],pr:[[0,10],[1,6],[2,1],[5,5],[8,8],[3,4],[11,5],[13,4],[10,3],[6,3]],sl:[0,1,3],pa:[8,5,11,13],web:[0,3],fk:['over','echo','mark','refund']},
  {k:'admin',n:'Sysadmin',p:'Let the machines do it: a Watchdog, a Botnet and a storm overhead while you keep your distance.',schema:'surge',doc:'firewall',at:[10,5,40,45],pr:[[4,10],[7,10],[6,8],[5,6],[2,4],[11,5],[13,4],[1,1],[0,1]],sl:[4,7,6],pa:[5,2,11,13],web:[4,1],fk:['lean','echo','refund','surge']},
  {k:'rod',n:'Control Rod',p:'Null Nova on a short fuse. A Packet Storm arrives where you marked it and slows what is left. Step Back is how you leave.',schema:'noise',doc:'throttle',at:[15,5,30,50],pr:[[3,10],[0,6],[5,8],[2,4],[10,6],[9,4],[12,5],[11,5]],sl:[3,10,12],pa:[5,11,2],web:[4,7],fk:['stun','lean','chill','burst']}],
 courier:[
  {k:'rush',n:'Rush Hour',p:'A wall of blades. Scatter Shot up close, Rush Order at range, and Return to Sender comes back through the same line.',doc:'express',at:[15,50,30,5],pr:[[0,10],[6,10],[9,6],[12,5],[8,8],[1,4],[2,3],[13,4],[5,1]],sl:[0,6,9],pa:[8,13,2,5],web:[0,5],fk:['over','echo','mark','surge']},
  {k:'pirate',n:'Porch Pirate',p:'Never fight fair. Lure them onto a Tack Strip, mark one with Missed Connection, and blink to where it falls.',doc:'insured',at:[15,40,35,10],pr:[[3,10],[4,10],[1,6],[7,4],[14,5],[11,3],[8,4],[2,6],[10,4]],sl:[3,4,14],pa:[2,10,8,5],web:[1,3],fk:['burn','chill','mark','lean']},
  {k:'tips',n:'Tip Jar',p:'You are here for the loot. Hazard Pay pays when a throw kills. A dash does not.',doc:'cod',at:[15,45,35,5],pr:[[5,10],[13,8],[0,8],[9,5],[2,6],[1,4],[8,4]],sl:[0,9,1],pa:[5,13,2,8],web:[6,5],fk:['lean','echo','surge','refund']}],
 anon:[
  {k:'demo',n:'Demolition',p:'Honeypot to gather them, Logic Bomb under their feet, Zip Bomb on top. All Heat. A mine laid while you are hidden arms faster.',doc:'nologs',at:[50,20,20,10],pr:[[0,8],[3,10],[6,10],[2,5],[11,4],[13,4],[4,3]],sl:[0,3,6],pa:[2,11,13],web:[0,3],fk:['over','burn','echo','mark']},
  {k:'ghost',n:'Ghost',p:'Rehearse the strike, hop in, vanish. The Dump spends what you banked.',doc:'burner',at:[20,50,25,5],pr:[[1,10],[4,8],[9,6],[10,5],[2,6],[11,4],[13,3],[5,4]],sl:[1,4,9],pa:[2,11,13],web:[3,5],fk:['over','mark','surge','lean']},
  {k:'legion',n:'We Are Legion',p:'Sockpuppets take the hits. When it is time to leave, We Were Never Here sends them off as a silence and you are gone.',doc:'collective',at:[25,15,40,20],pr:[[7,10],[8,8],[14,5],[13,4],[11,4],[2,6],[4,3],[0,3]],sl:[7,8,14],pa:[2,13,11],web:[1,7],fk:['lean','echo','refund','ward']}],
 founder:[
  {k:'head',n:'Headcount',p:'Hire everyone. They vest while they live, and Org Debt is what the headcount costs you. Term Sheet is the one officer.',doc:'venture',at:[20,0,35,45],pr:[[0,10],[3,10],[6,8],[12,4],[2,8],[11,6],[13,5],[4,4],[1,1]],sl:[0,3,12],pa:[2,11,13],web:[4,1],fk:['lean','refund','echo','surge']},
  {k:'raid',n:'Hostile Takeover',p:'Non-Compete holds one machine on you so the hire can land. Layoffs spends your people. Liquidation spends theirs.',doc:'boot',at:[50,10,25,15],pr:[[10,6],[7,10],[8,6],[14,5],[1,6],[2,5],[11,3],[0,4],[13,3]],sl:[10,7,14],pa:[2,11,13],web:[0,3],fk:['over','stun','burst','mark']},
  {k:'iron',n:'Iron Founder',p:'Do it yourself, in a Mech Suit. Non-Compete makes the room come to you. Liquidation spends the corpses. There is nobody on the payroll.',doc:'lifestyle',at:[30,20,50,0],pr:[[5,10],[10,6],[14,5],[2,8],[1,6],[0,2]],sl:[5,10,14],main:5,pa:[2],web:[1,2],fk:['ward','siphon','lean','stun']}],
 homesteader:[
  {k:'bed',n:'Cold Bed',p:'Cold Frame, then Compost, then the hedge. Kill Frost stays until you climb into a machine, which this plan never does.',doc:'fallow',at:[25,15,45,15],pr:[[0,10],[3,8],[6,6],[9,5],[12,4]],sl:[0,6,9],pa:[],web:[1,2],fk:['chill','lean','ward','echo']},
  {k:'hull',n:'Inside the Hull',p:'Wear the Hull and stay in it. Shed when you must. Nothing is planted.',doc:'tenant',at:[20,20,50,10],pr:[[1,4],[4,10],[7,4],[10,6],[13,8]],sl:[4,10,7],main:4,pa:[13],web:[1,2],fk:['ward','stun','lean','siphon']},
  {k:'flock',n:'What Follows',p:'Strays and one bull. Cold Frame is only there so they have somewhere to stand. Slaughter Weight spends them into the ground.',doc:'poacher',at:[40,20,25,15],pr:[[2,10],[5,6],[8,8],[11,5],[14,4],[0,3]],sl:[2,5,14],pa:[8,11],web:[0,3],fk:['over','mark','echo','lean']}],
 witness:[
  {k:'page',n:'The Page',p:'Look, then The Sentence, then Pull the Thread. Slow, single target, and dull on purpose. There is no quiet way to clear a room.',doc:'editor',at:[20,15,55,10],pr:[[0,6],[1,6],[4,10],[6,8],[3,4],[2,6],[5,4],[8,6],[11,4]],sl:[4,0,1],pa:[2,8,11],web:[1,2],fk:['lean','ward','echo','mark']},
  {k:'party',n:'Named in the Notes',p:'Look until the page is full. On the Record makes everyone hit harder. Unnamed Source lends one Sound swing. Named Party is the passive, and it is not for you.',doc:'stringer',at:[15,20,40,25],pr:[[0,8],[9,8],[10,6],[13,6],[3,4],[6,4],[1,4],[4,4],[7,3],[5,3],[2,3]],sl:[0,9,10],main:9,pa:[13,5,2],web:[1,6],fk:['mark','echo','lean','ward']},
  {k:'risk',n:'Above Eighty',p:'Sit on a full Record and a thin life. Retraction is the save, and it spends the page. An empty Record is a death.',doc:'corrections',at:[10,15,65,10],pr:[[14,8],[11,6],[8,6],[5,4],[2,4],[0,4],[7,6],[6,6],[1,3],[4,3],[3,3]],sl:[0,7,6],main:7,pa:[14,11,8,2],web:[1,2],fk:['ward','lean','siphon','echo']}]};
function buildApply(cls,key,sp,ap){const B=BUILDS[cls].find(b=>b.k===key),sk=CLS[cls].sk,ok=i=>{const row=Math.floor(i/3);return G.lvl>=ROWREQ[row]&&(row<3||G.act2)&&(row<4||G.act3)};
  const put=i=>{if(G.sk[i]>=10||!ok(i))return false;if(i>=3&&!G.sk[i-3]&&!put(i-3))return false;const c=G.sk[i]>=5?2:1;if(sp<c)return false;sp-=c;G.sk[i]++;return true};
  for(const[i]of B.pr)if(!G.sk[i])put(i);                                /* one point in everything the plan needs, so it works at once */
  {const mi=B.main===undefined?B.sl[0]:B.main,fl=Math.min(4,1+Math.floor(sp/5));while(G.sk[mi]<fl&&put(mi));} /* the main attack always gets a few ranks before passives and summons are deepened */
  for(const[i,t]of B.pr)while(G.sk[i]<t&&put(i));                         /* then raise each to its target, most important first */
  for(const[i]of B.pr)while(G.sk[i]<10&&put(i));                          /* anything left deepens the core */
  for(let r=0;r<5&&sp>0;r++)for(let j=0;j<3;j++){const i=r*3+j;if(cls==='homesteader'&&!B.pr.some(p=>p[0]===i))continue;if(!G.sk[i])put(i)}/* breadth; a homesteader plan does not buy the column it left out */
  const ks=['mgt','ref','vit','bnd'];let left=ap;ks.forEach((k,j)=>{const n=Math.floor(ap*B.at[j]/100);G.at[k]+=n;left-=n});G.at[ks[B.at.indexOf(Math.max(...B.at))]]+=left;ap=0;
  const act=B.sl.filter(i=>G.sk[i]&&sk[i].a);for(let i=0;i<15&&act.length<3;i++)if(G.sk[i]&&sk[i].a&&!act.includes(i))act.push(i);G.slots=[0,1,2].map(i=>act[i]===undefined?-1:act[i]);
  G.pas=B.pa.filter(i=>G.sk[i]&&!sk[i].a).slice(0,PCAP());G.doc=B.doc;G.fork={};for(const i of act)if(G.sk[i]>=3){const set=forkSet(cls,i),f=B.fk.find(k=>set.includes(k));G.fork[i]=f||set[0]}
  if(!Object.keys(G.web||{}).length){G.web={};let pts=G.lvl-1+(G.para||0);const[a,b]=B.web;for(let r=1;r<=10&&pts>0;r++){G.web[a+'_'+r]=1;pts--;if(r<=7&&pts>0){G.web[b+'_'+r]=1;pts--}}B._web=1}else B._web=0;
  if(B.schema)G.schema=B.schema;
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
function tagStats(og){const g0=G,keep=S;let r=null;try{G=JSON.parse(JSON.stringify(og));ensureG();calc();r={dmg:(S.dmin+S.dmax)/2*(1+(S.dmg||0)/100)*(1+((S.blow||0)/100)),max:S.maxHp,arm:S.armor||0}}catch(e){}G=g0;S=keep;calc();return r}
function tagRender(n){const og=tagG(n);if(!og||!CLS[og.cls])return;const c=tagCost(og.lvl);if(satsFree()<c){toast(tradeReserved()?'Those sats are on the table.':'You need '+c+' sats');sfx('err');return}const st=tagStats(og);if(!st){toast('The rig could not read that character');sfx('err');return}
  if(!spendSats(c))return;const k=Math.min(1,(G.lvl+5)/og.lvl),sk=CLS[og.cls].sk,act=(og.slots||[]).filter(i=>i>=0&&sk[i]&&sk[i].a&&og.sk[i]);
  G.tag={slot:n,cls:og.cls,lvl:og.lvl,name:'Level '+og.lvl+' '+CLS[og.cls].n,dmg:Math.max(st.dmg*k,(4+2.2*G.lvl)*.9),max:Math.round(Math.max(st.max*k,60+22*G.lvl)),red:100/(100+st.arm*k),sk:act.map(i=>[i,og.sk[i]]),down:k<1,eq:og.eq||{}};
  spawnMerc();sfx('unique');save(true);
  playScene([{art:'feed',title:'Rendered',text:'The rig hums, and a second outline fills in beside you, one scan line at a time: somebody you have been. '+G.tag.name+' looks at their hands, then at you, and nods.'+(k<1?' The rig has to down-sample them to fit this world; they fight a little above your level, not at their own.':'')+(G.merc&&!G.merc.dead?' '+G.merc.name+' steps back to wait with Kestrel until they are gone.':'')}],()=>{mode='play'})}
function tagDismiss(q){if(!G.tag)return;const n=G.tag.name;G.tag=null;W.tag=null;spawnMerc();if(!q)toast(n+' fades out of this world');save(true)}
function spawnTag(){W.tag=null;const t=G.tag;if(!t||W.z.sim)return;if(W.z.town)t.hp=t.max;W.tag={x:P.x-.8,y:P.y+.7,r:.3,hp:Math.min(t.hp||t.max,t.max),max:t.max,ph:0,flash:0,armM:t.red,fx:1,swing:0,sc:t.sk.map((_,j)=>2+j*2.5),say:'',sayT:0,tag:1,
  dir:{x:1,y:0},walkPh:0,moving:false,spin:0,buff:0,haste:0,guard:0,dash:null,stealth:0,mech:0,inv:0,oc:0,ambT:0,ambM:1,crunch:0,volley:null,cd:[],silence:0,fm:null,atk:0,slow:0,page:t.page||0}}
var TAGQ=false;
/* the companion borrows the player's own skill code: for the length of one call it stands where the player stands */
function tagDo(fn){const m=W.tag,p0=P,c0=G.cls,d0=DT;P=m;G.cls=G.tag.cls;DT=null;TAGQ=true;try{fn();
    if(m.dash){const d=m.dash;m.dash=null;const ox=m.x,oy=m.y,far=d.spd*d.t;for(let s=0;s<far;s+=.25)if(!mv(m,m.dir.x*.25,m.dir.y*.25))break;if(d.trail)fxTrail(ox,oy,m.x,m.y,d.trail,.4);else W.fx.push({k:'arc',x:m.x,y:m.y,dx:m.dir.x,dy:m.dir.y,t:0,life:.22,w:1.5});if(d.m)burst(m.x,m.y,2.2,d.m,0,'#ff9a3c');if(d.end)d.end()}
  }catch(e){window.__tagErr=(e&&e.message)+' '+((e&&e.stack)||'').split('\n')[1]}finally{P=p0;G.cls=c0;DT=d0;TAGQ=false}}
function updTag(dt){const m=W.tag,t=G.tag;if(!m||!t||m.hp<=0)return;const c=CLS[t.cls],formed=t.cls==='homesteader'&&!!m.form,rng=formed?1.5:(c.melee?1.5:5.5),base=Math.max(1,(S.dmin+S.dmax)/2*(1+S.dmg/100));
  m.ph+=dt;m.sayT-=dt;m.atk-=dt;for(const k of['flash','swing','spin','buff','haste','guard','stealth','mech','crunch','oc'])m[k]=Math.max(0,m[k]-dt);m.armM=t.red*.7*(m.mech>0||m.guard>0?.5:1);if(t.cls==='homesteader'&&m.form==='hull'){m.formT=(m.formT||0)+dt;const rk=(t.sk.find(s=>s[0]===13)||[0,0])[1];if(rk)m.armM/=1+.08*rk*Math.min(8,Math.floor(m.formT/2))}if(t.cls==='witness'&&!(m.atk>0)&&!(m.swing>0)&&witHostile()){m.page=Math.min(100,(m.page||0)+WIT.fill*(m.moving?1:WIT.still)*dt)}
  const R=clamp(t.dmg/base,.15,6)*(m.buff>0||m.crunch>0?1.4:1)*(m.mech>0?1.5:1);
  let tg=null,bd=8;for(const e of W.ents){if(!e.aggro)continue;const d=dist(e,P);if(d<bd){bd=d;tg=e}}
  const g=tg||P,d=dist(g,m)||1,want=tg?rng*.85:1.9;m.moving=false;
  /* Catch up at 8 tiles, unless this swing is already in range. */
  if(dist(m,P)>(tg&&d<=rng+tg.r?13:8)){m.x=P.x;m.y=P.y}else if(d>want){const sp=4.8*(m.form==='hound'?1.28:m.form?.72:1)*(m.haste>0?1.5:1)*dt;m.dir={x:(g.x-m.x)/d,y:(g.y-m.y)/d};if(!mv(m,m.dir.x*sp,m.dir.y*sp)&&dist(m,P)>5){m.x=P.x;m.y=P.y}m.moving=true;m.walkPh+=dt*11}
  if(m.volley){const v=m.volley;v.t-=dt;v.cd-=dt;if(v.cd<=0&&tg){v.cd=.12;tagDo(()=>{face(tg);shoot(P.dir,v.m,0)})}if(v.t<=0)m.volley=null}
  if(tg){m.dir={x:(tg.x-m.x)/d,y:(tg.y-m.y)/d};
    for(let j=0;j<t.sk.length;j++){m.sc[j]-=dt;if(m.sc[j]>0||d>7)continue;const[i,rk]=t.sk[j],s=c.sk[i],f=SKF[t.cls]&&SKF[t.cls][i];if(!f)continue;m.sc[j]=Math.max(4,(s.cd||5)*1.4)+j;m.say=s.n;m.sayT=1.4;m.swing=.18;sfx((SKS[t.cls]||{})[i]||'zap');tagDo(()=>{skvPlay(t.cls,i,P.x,P.y,m.dir);f(rk,R)});return}
    if(d<=rng+tg.r+.3&&m.atk<=0){m.atk=c.ivl*1.15/toxicSwing(m);m.swing=.18;tagDo(()=>{witWrap(m,()=>{if(c.melee||formed){sfx('swing');W.fx.push({k:'arc',x:P.x,y:P.y,dx:P.dir.x,dy:P.dir.y,t:0,life:.18,w:1});for(const e of W.ents.slice()){const dd=dist(e,P);if(dd<1.75+e.r&&((e.x-P.x)*P.dir.x+(e.y-P.y)*P.dir.y)/(dd||1)>.15)hit(e,c.mult*R)}}else{sfx(t.cls==='hacker'?'zap':'throw');shoot(P.dir,c.mult*R,0)}})})}}
  else m.hp=Math.min(m.max,m.hp+m.max*.04*dt);t.hp=m.hp;t.page=m.page||0}
function tagProxy(){const t=G.tag,g=Object.create(G);g.cls=t.cls;g.eq=t.eq||{};g.form=W.tag.form||null;g.formDt=W.tag.formDt||null;g.formT=W.tag.formT||0;g.hp=W.tag.hp/W.tag.max*S.maxHp;return g}
function tagMenu(){const b=[];if(G.tag)b.push(['Send '+G.tag.name+' back',()=>tagDismiss()]);for(let n=0;n<NSLOT;n++){const og=tagG(n);if(og&&CLS[og.cls]&&!(G.tag&&G.tag.slot===n))b.push(['Render level '+og.lvl+' '+CLS[og.cls].n+' · '+tagCost(og.lvl)+' sats',()=>tagRender(n)])}
  b.push(['Not now']);dlg('Render a companion',b.length>1?'The rig can pull one of your other characters into this world to fight beside you. They act on their own and use the skills they had on their buttons when last saved. It costs sats every time one is rendered: if they fall, or you send them back, rendering again is paid again. A hired companion waits with Kestrel while a rendered one is here, and Kestrel will not hire to you until they leave. You hold '+G.sats+' sats.':'The rig can pull one of your other characters into this world to fight beside you, but you have no other characters saved yet. Start one from Options, under Characters.',b)}
/* ================= party pressure: two of you is easier, so the machines push back while a companion is rendered ================= */
let ppWin=[];
function partyOn(){return!!(W&&W.tag&&W.tag.hp>0&&!W.z.sim)}
function partyH(){return (partyOn()?1.35+.2*(G.pp||0):1)*mpHp()}
function partyD(){return (partyOn()?1.05+.06*(G.pp||0):1)*mpDmg()}
function partyWake(e){e.wkT=G.time;if(partyOn()&&!e.ppx){e.ppx=1;e.xpM=(e.xpM||1)*1.3}}
function partyKill(e){if(!partyOn()||e.minion||e.su||isBoss(e.k)||e.wkT===undefined)return;ppWin.push(G.time-e.wkT);if(ppWin.length<10)return;const avg=ppWin.reduce((a,b)=>a+b,0)/ppWin.length;ppWin=[];
  /* Half a second is a delete. 1.8s is slower than a geared normal in the arena, so the ease-off can run. */
  if(avg<.45&&(G.pp||0)<6){G.pp=(G.pp||0)+1;toast(pick(['Two of you. The machines have adjusted their difficulty.','The network noticed the extra hash power. Difficulty up.','More hands, harder blocks. Difficulty adjusts upward.']));sfx('growl')}
  else if(avg>1.8&&(G.pp||0)>0){G.pp--;toast('The machines ease off a little. Difficulty adjusts downward.')}}
function partyDeath(){ppWin=[];G.pp=Math.max(0,(G.pp||0)-2)}
