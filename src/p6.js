/* ================= seed words: sockets, single-word bonuses, and phrases ================= */
const WORDS={anchor:['armorP',20],border:['hp',25],candle:['en',15],desert:['dmg',12],echo:['aspd',8],forge:['shock',6],garden:['regenH',2],hollow:['leech',2],island:['mf',12],kernel:['crit',3],ladder:['mspd',6],mirror:['thorns',10]};
const WK=Object.keys(WORDS);
const PHRASES=[
 {id:'genesis',n:'Genesis',slot:'weapon',w:['kernel','forge','desert'],mods:{dmg:90,crit:10,shock:15},fl:'The first block. Everything after refers back to it.'},
 {id:'halving',n:'The Halving',slot:'weapon',w:['echo','hollow','echo'],mods:{aspd:30,leech:6,dmg:40},fl:'Half as much, twice as dear.'},
 {id:'cold',n:'Cold Storage',slot:'armor',w:['anchor','border','mirror'],mods:{hp:120,armorP:100,thorns:30},fl:'Kept offline, where nothing can reach it.'},
 {id:'timelock',n:'Timelock',slot:'armor',w:['garden','candle','border'],mods:{hp:80,regenH:8,en:50,regen:3},fl:'Not yet. Not yet. Now.'},
 {id:'fullnode',n:'Full Node',slot:'helm',w:['island','kernel'],mods:{mf:40,crit:8,skills:1},fl:'Trust nobody. Verify everything.'},
 {id:'longest',n:'Longest Chain',slot:'helm',w:['ladder','anchor'],mods:{armorP:80,mspd:12,hp:50},fl:'The one with the most work behind it wins.'}];
function ensureG(){bookFix();G.words=G.words||{};G.st=G.st||{};const s=G.st;s.wf=s.wf||{};for(const k of['streak','gobs','shifts','phr','sold'])s[k]=s[k]||0;G.rep=G.rep||{btc:0,anon:0};G.ach=G.ach||{};G.adopt=G.adopt||0;G.nodes=G.nodes||{};G.rep.norm=G.rep.norm||0;G.cv=G.cv||{};G.lean=G.lean||0;G.web=G.web||{};G.fork=G.fork||{};if(!G.rb1){G.rb1=1;if(G.st.sold>0&&!G.boss3Kills){const n=G.st.sold;G.st.sold=0;G.adopt=Math.min(100,G.adopt+15*n);G.credits-=Math.min(G.credits*.98,6000*G.cpi*G.lvl*n);delete ZS[16];G.rbNote=1}}acctPara();chFix();accMigrate();G.camps=G.camps||{};G.won=G.won||{};if(!G.adInit){G.adInit=1;G.adopt=Math.min(100,G.adopt+20)}}
function gotWord(w){G.words[w]=(G.words[w]||0)+1;G.st.wf[w]=1}
function socketWord(it,w){if(!it.soc||(it.words||[]).length>=it.soc||!G.words[w])return;G.words[w]--;it.words=it.words||[];it.words.push(w);const m=WORDS[w];it.aff.push({k:m[0],v:m[1],w});sfx('equip');
  if(it.words.length===it.soc){const r=PHRASES.find(p=>p.slot===it.slot&&p.w.join()===it.words.join());
    if(r){it.name=r.n;it.pw=r.id;it.q=4;it.fl=r.fl;for(const k in r.mods)it.aff.push({k,v:r.mods[k]});it.val*=6;G.st.phr++;sfx('unique');toast('The words agree. This is now '+r.n+'.');addAdopt(2,'a phrase restored')}}
  calc()}

function freeSpotNear(r){for(let i=0;i<40;i++){const a=rnd(0,6.283),d=r*(1-i/60),x=P.x+Math.cos(a)*d,y=P.y+Math.sin(a)*d;if(free(x,y,.5))return{x,y}}return{x:P.x,y:P.y}}
/* ================= reputation ================= */
const REP={btc:{n:'The Bitcoiners',ranks:['Pleb','Stacker','Node Runner','Cypherpunk'],perks:['Nonce charges 10% less','You find 25% more satoshis','Nonce exchanges with no spread','A gift from the cache'],how:'Earned by trading with Nonce, lighting nodes and finishing his work.'},
 anon:{n:'The Anons',ranks:['Lurker','Contributor','Raider','Legion'],perks:['Bounties pay 25% more','A fourth bounty is posted','Each bounty also pays a seed word','A gift, sender unknown'],how:'Earned by filling bounties and helping strangers.'}};
const REPT=[10,30,60,100];
const repRank=f=>REPT.filter(t=>G.rep[f]>=t).length;
function addRep(f,n){const a=repRank(f);G.rep[f]+=n;const b=repRank(f);if(b>a){sfx('level');toast(REP[f].n+': you are now '+REP[f].ranks[b-1]+'. '+REP[f].perks[b-1]+'.');if(b===4)giveItem(makeItem(G.lvl+3,4));if(f==='btc')addAdopt(2,'word spreads')}}

/* ================= adoption: the long goal ================= */
function addAdopt(n,why){if(n>0&&G.adopt>=100)return;const b4=Math.floor(G.adopt);G.adopt=clamp(G.adopt+n,0,100);if(Math.floor(G.adopt)!==b4||why)toast('Bitcoin adoption '+(n<0?'falls to ':'')+Math.floor(G.adopt)+'%'+(why?' · '+why:''));
  if(G.adopt>=50&&!G.ad50){G.ad50=1;setTimeout(()=>toast('Half the world now saves in sats. The Stipend terminal pays one, too.'),1800)}
  if(G.adopt>=100&&!G.resSeen)setTimeout(()=>{if(mode==='play'){G.resSeen=1;playScene(RESERVE,()=>{mode='play';dlg('The reserve','Bitcoin is the world’s reserve currency. Unity can still create credits, but nothing that matters is priced in them any more, so prices have stopped rising. You did not break the money printer. You made it irrelevant.',[['Continue']])})}},2500)}
function ensureNode(){if(W.z.town||W.z.sim||W.z.sub||W.objs.some(o=>o.k==='dnode'))return;const p=freeSpot(12);W.objs.push({k:'dnode',x:p.x,y:p.y})}
function lightNode(o){if(cause()){G.sats+=5;toast('Sister Null’s people cover the cost. For the cause.')}if(G.sats<5){toast('Lighting a node costs 5 sats');sfx('err');return}G.sats-=5;o.used=1;G.nodes[W.zi]=1;sfx('shrine');parts(o.x,o.y,24,['#f7931a','#fff'],2.5,1.6);addRep('btc',5);addAdopt(5,'a node comes online in '+W.z.n)}

/* ================= world events ================= */
const EVS={stipend:{n:'Stipend Day',d:'Residents wander the district and credit drops are tripled.',t:45},audit:{n:'Surprise Audit',d:'A hunting party has your scent. Its leader carries a lockbox.',t:70},outage:{n:'Outage',d:'The lights fail and the machines stall. +50% experience while it lasts.',t:40},block:{n:'Block Found',d:'For a short while, any machine may drop a satoshi.',t:35}};
let EV=null,evCd=150;
function evEnd(q){if(!EV)return;if(W&&W.npcs)W.npcs=W.npcs.filter(n=>!n.ev);EV=null;if(!q)toast('The district settles')}
function evStart(k){EV={k,t:EVS[k].t};evCd=rnd(200,320);sfx('quest');toast(EVS[k].n+': '+EVS[k].d);
  if(k==='stipend')for(let i=0;i<8;i++){const a=rnd(0,6.283),x=P.x+Math.cos(a)*rnd(2,6),y=P.y+Math.sin(a)*rnd(2,6);if(walk(x,y))W.npcs.push({id:'res',ev:1,x,y,hx:P.x,hy:P.y,col:pick(['#7fa8d0','#d0a488','#a8c890','#c890bc','#d8c070']),tx:x,ty:y,wait:0,say:'',st:0,cool:rnd(1,6),ph:rnd(0,6)})}
  if(k==='audit'){const pool=W.z.mix.filter(m=>m[0]!=='tick'),kd=wpick(pool),sp=freeSpotNear(7);let e=spawn(kd,sp.x,sp.y,{champ:1});if(e){e.aggro=true;e.audit=1;for(let i=0;i<4;i++){const m=spawn(kd,e.x+rnd(-1.5,1.5),e.y+rnd(-1.5,1.5));if(m)m.aggro=true}}else EV=null}
  if(k==='outage')for(const e of W.ents)if(dist(e,P)<14)e.stun=Math.max(e.stun,3)}
function evTick(dt){if(W.z.town||W.z.sim)return;if(EV){EV.t-=dt;if(EV.t<=0)evEnd();return}if(W.boss||W.hold)return;evCd-=dt;if(evCd<=0)evStart(pick(Object.keys(EVS)))}

/* ================= feats ================= */
const ACH=[['first','First Blood','Destroy a machine',()=>G.kills>=1],['k100','Scrapyard','Destroy 100 machines',()=>G.kills>=100],['k1000','Recycler','Destroy 1,000 machines',()=>G.kills>=1000],
 ['l10','Getting Somewhere','Reach level 10',()=>G.lvl>=10],['l25','Regional Champion','Reach level 25',()=>G.lvl>=25],['l50','Head in the Cloud','Reach level 50',()=>G.lvl>=50],['l75','Chair of the Board','Reach level 75',()=>G.lvl>=75],
 ['uni','Gold Text','Wear a unique item',()=>Object.values(G.eq).some(i=>i&&i.q===4&&!i.pw)],['set','Vigil','Wear all three pieces of the Striker’s Vigil',()=>S.set&&S.set.striker>=3],
 ['merc','Not Alone','Hire a companion',()=>!!G.merc],['shift','Somebody Else','Shape shift at the VR rig',()=>G.st.shifts>0],
 ['w10','Warm-up','Clear wave 10 in the Simulator',()=>(G.simBest||0)>=10],['w25','No Last Wave','Clear wave 25 in the Simulator',()=>(G.simBest||0)>=25],['rush','Middle Management','Finish the boss rush',()=>!!G.rushDone],
 ['gob','Payout','Catch a Dividend Drone',()=>G.st.gobs>0],['st20','On a Roll','Reach a 20-kill streak',()=>G.st.streak>=20],
 ['memo','Librarian','Collect every memo',()=>G.memos.length>=MEMOS.length],['seed','Twelve Words','Find all twelve seed words',()=>Object.keys(G.st.wf).length>=12],['phr','Not Your Keys','Complete a seed phrase',()=>G.st.phr>0],
 ['hodl','Stacker','Hold 100 sats at once',()=>G.sats>=100],['shill','Portfolio Manager','Liquidate five shitcoiners',()=>(G.st.shills||0)>=5],['unseen','Nobody Saw','Give something away three times',()=>(G.unseen||0)>=3],
 ['a1','Exit Interview','Finish Act I',()=>G.q.q5===3],['a2','The Voice','Finish Act II',()=>G.q.q10===3],['a3','Still Water','Finish Act III',()=>G.q.q15===3],
 ['res','Reserve','Make bitcoin the world’s reserve currency',()=>G.adopt>=100],['sold','Everyone Has a Price','Accept MANDATE’s offer',()=>G.st.sold>0]];
let achT=3;
function achTick(dt){achT-=dt;if(achT>0)return;achT=2;for(const a of ACH)if(!G.ach[a[0]]&&a[3]()){G.ach[a[0]]=1;G.sats+=1;sfx('quest');toast('Feat: '+a[1]+' · +1 sat');return}}

/* ================= boss rush ================= */
function rushList(){const l=[];for(const zi of[1,2,3,4,7,8,9,10,12,13,14,15,22,23,24,25,28,29,30,31])if(G.unlocked>zi||G.q[ZONES[zi].su.q]>=2)l.push({k:ZONES[zi].su.k,n:ZONES[zi].su.n,mods:ZONES[zi].su.mods});
  if(G.q.q5===3)l.push({boss:'boss'});if(G.q.q10===3)l.push({boss:'boss2'});if(G.q.q15===3)l.push({boss:'boss3'});if(G.q.q20===3)l.push({boss:'boss4'});if(G.q.q25===3)l.push({boss:'boss5'});return l}
function rushTick(dt){const s=W.sim;if(W.ents.some(e=>!e.minion))return;s.t-=dt;if(s.t>0)return;for(const o of W.ents.slice())W.ents.splice(W.ents.indexOf(o),1);W.projs=[];
  if(s.i>=0){G.sats+=2;float(P.x,P.y,'+2 sats','#f7931a');sfx('coin')}s.i++;
  if(s.i>=s.list.length){s.t=1e9;G.rushDone=true;G.sats+=10;sfx('level');dlg('Boss rush complete','Every lieutenant and executive you have beaten, back to back. Ten sats on top of the purse.',[['Unplug',()=>enter(HT())]]);return}
  s.t=3;const it=s.list[s.i];W.ml=G.lvl;W.dyn=dynFor(W.ml);heal(S.maxHp*.5);G.en=S.maxEn;$('zone').textContent='Boss rush · '+(s.i+1)+' of '+s.list.length;
  const e=it.boss?spawn(it.boss,15.5,9.5):spawn(it.k,15.5,9.5,{su:{n:it.n,mods:it.mods}});if(e)wake(e)}

/* ================= escort ================= */
function escStart(k,name){W.esc={x:P.x+.8,y:P.y+.6,r:.28,hp:S.maxHp*1.5,max:S.maxHp*1.5,q:k,name,t:6,ph:0,fx:1,flash:0,armM:.7}}
function escTick(dt){const m=W.esc;if(!m)return;m.ph+=dt;m.flash=Math.max(0,m.flash-dt);const d=dist(m,P)||1;m.mov=false;if(d>14){m.x=P.x;m.y=P.y}else if(d>1.6){mv(m,(P.x-m.x)/d*3.8*dt,(P.y-m.y)/d*3.8*dt);m.mov=true;m.fx=(P.x-m.x)-(P.y-m.y)>0?1:-1}
  m.t-=dt;if(m.t<=0){m.t=9;const kd=wpick(W.z.mix);for(let i=0;i<3;i++){const a=rnd(0,6.283),e=spawn(kd,P.x+Math.cos(a)*rnd(5,7),P.y+Math.sin(a)*rnd(5,7));if(e)e.aggro=true}}}
function sqRes(n){for(const k in SQ){const st=sqStep(k);if(st&&st.t==='res'&&!n.got){n.got=1;n.say=pick(['Is this… about me?','I had one of these. I deleted it.','Why would you give me this?','My mother’s name is on it.']);n.st=5;n.cool=20;sfx('page');const s=G.sq[k];s.c++;if(s.c>=st.n)sqAdvance(k);else toast(SQ[k].n+': '+s.c+'/'+st.n);return}}}
const resStep=()=>{for(const k in SQ){const st=sqStep(k);if(st&&st.t==='res')return st}return null};
Object.assign(SQ,{
 passage:{n:'Safe Passage',by:'null',who:'Sister Null',req:()=>G.q.q7===3,rw:'+5 attribute points, and a gardener in Stillwater',
  offer:'“One of the gardeners up there took his visor off. His name is Tam. Eden is gone, but the Gardens still prune. He cannot get to the service lift alone. Walk with him. If he falls, go back for him.”',
  steps:[
   {t:'obj',zi:8,look:'person',label:'Speak to Tam',d:'Find Tam the gardener in the Sky Gardens',say:'A man kneeling in a flowerbed with his visor in the dirt beside him. “I grew something they did not ask for. A tomato. One. They are coming to correct it. Will you walk me out?”',esc:'Tam'},
   {t:'esc',zi:8,look:'lift',label:'Send Tam down the lift',d:'Walk Tam to the service lift in the Sky Gardens and keep him alive',say:'He steps into the lift holding the tomato in both hands like something that might go off. “I am going to plant the seeds,” he says. “I do not know what will come up. That is the part I like.”'},
   {t:'talk',npc:'null',d:'Return to Sister Null',say:'“He is already digging up the square. Nobody told him he could. I think that is the first thing he has done without being told in his life.”',rw(){G.ap+=5;G.tam=true;addRep('anon',10);toast('You gain 5 attribute points')}}]},
 letter:{n:'Return to Sender',by:'marrow',who:'Marrow',req:()=>G.q.q8===3,rw:'+1 skill point',
  offer:'“The Lake is safe, but letters in a lake are still unread. The Persuaders and Subsidiaries up there carry copies; they study them, to learn what moves us. Take three back. Then do the only thing a letter is for. Put them in the hands of three people in this square.”',
  steps:[
   {t:'kill',zi:9,kinds:['seer','splitter'],n:3,chance:{seer:.6,splitter:.4},item:'Letter',d:'Recover 3 letters from Persuaders and Subsidiaries in the Data Lake'},
   {t:'res',n:3,label:'Hand them a letter',d:'Hand the letters to three Residents in Stillwater'},
   {t:'talk',npc:'marrow',d:'Return to Marrow',scene:[{art:'dawn',text:'Three visors come up, slowly, the way you lift a bandage. Three people stand in the square of Stillwater reading the same kind of page, not looking at each other yet.'}],say:'“They will be angry. Then sad. Then, if we are lucky, curious. That last one is the dangerous one, and it is why they made the visor.”',rw(){G.sp++;addRep('anon',10);toast('You gain 1 skill point')}}]}
});
GOSSIP.tam=['Tomatoes. Beans next. Nobody has corrected me yet.','You cannot make a plant grow faster by paying it. I find that restful.','Take one. They are not perfect. That is how you know they are real.'];

/* ================= a town for each act, and open-air districts ================= */
ZONES.push({n:'The Landing',town:true,act:2,style:'landing',amb:.3},{n:'The Antechamber',town:true,act:3,style:'wait',amb:.5});
ZONES[0].act=1;for(const i of[1,3,8,10,16]){ZONES[i].out=1;ZONES[i].amb*=.8}
const FIRST={0:33,1:1,2:7,3:12,4:22,5:28};
const actOf=zi=>{const z=ZONES[zi];return z.act||(z.sim||z.sub||z.secret||z.pre?0:zi>=28?5:zi>=22?4:zi>=12?3:zi>=7?2:1)};
const townOf=zi=>{const a=actOf(zi);return a===5?27:a===4?21:a===3?18:a===2?17:a===1?0:(G.town||0)};
const HT=()=>G.town||0;
function nearFree(p,d){for(let i=0;i<24;i++){const a=i*.8,r=d||1.3,x=p.x+Math.cos(a)*r,y=p.y+Math.sin(a)*r;if(free(x,y,.35))return{x,y}}return{x:p.x,y:p.y}}
/* machines drift back into a district you have been away from */
function repop(){const z=W.z,N=W.N,base=z.boss?24:46,have=W.ents.filter(e=>!isBoss(e.k)&&!e.su).length,need=base-have,away=G.time-W.leftT;let back=0;
  if(away>600&&z.su&&!W.ents.some(e=>e.su)){const p=W.suAt||W.goal;if(spawn(z.su.k,p.x+.5,p.y+.5,{su:z.su}))back++}
  if(away>900&&z.boss&&!W.boss&&W.goal){if(spawn(z.bossK||'boss',W.goal.x,W.goal.y)){back++;W.portals=W.portals.filter(p=>p.kind!=='home')}}
  if(need<6)return back;
  W.ml=zoneLevel(z);W.dyn=dynFor(W.ml);let n=0;
  for(let t=0;t<600&&n<need;t++){const x=ri(2,N-3)+.5,y=ri(2,N-3)+.5;if(W.map[(y|0)*N+(x|0)]!==1||Math.hypot(x-P.x,y-P.y)<13||Math.hypot(x-W.start.x,y-W.start.y)<8||(z.boss&&W.goal&&Math.hypot(x-W.goal.x,y-W.goal.y)<10))continue;
    const k=wpick(z.mix),c=k==='tick'?6:ri(3,5),ch=Math.random()<.12;for(let j=0;j<c;j++){const e=spawn(k,x+rnd(-1.5,1.5),y+rnd(-1.5,1.5),ch&&!j?{champ:1}:null);if(e)n++}}
  return n}

/* ================= tracked quest ================= */
function trackList(){const l=[];for(const k in SQ)if(G.sq[k]&&!G.sq[k].done)l.push('s:'+k);return l}
function storyStep(){const sg=storyGate();if(sg)return sg;
  if(G.q.q5===3&&!G.act2)return{n:'Act I complete',d:'Take the Transit Gate to The Landing to begin Act II'};
  if(G.q.q10===3&&!G.q.q11)return{n:'Act II complete',d:'Speak to Gramps in '+ZONES[HT()].n+' to begin Act III'};
  if(G.q.q10===3&&!G.act3)return{n:'Act II complete',d:'Take the Transit Gate to The Antechamber to begin Act III'};
  for(const k in QUESTS){const st=G.q[k]||0;if(st===3)continue;const q=QUESTS[k],z=ZONES[q.zi],who=z.su&&z.su.q===k?z.su.n:ET[z.bossK||'boss'].n;
    if(st===2)return{n:q.n,d:'Return to '+(q.back||'Gramps')+' in '+ZONES[HT()].n};
    if(k==='q1'&&!st)return{n:q.n,d:'Speak to Gramps in Stillwater Commons'};
    return{n:q.n,d:W.zi===q.zi?'Destroy '+who+'. Follow the arrow.':W.z.town&&W.zi===townOf(q.zi)&&q.zi===FIRST[actOf(q.zi)]?'Walk out of the town gate to '+z.n+' and destroy '+who:'Go to '+z.n+' and destroy '+who}}
  return{n:'The story is complete'+(G.fate==='fail'?' · bitcoin failed':G.fate==='stale'?' · stalemate':''),d:G.adopt<100?'Bitcoin adoption stands at '+Math.floor(G.adopt)+'%. Light nodes and pay in sats to reach 100%.':'Bitcoin is the reserve currency. The world is yours to wander.'}}
function sideStep(){const l=trackList();if(!l.length)return null;if(!l.includes(G.track))G.track=l[0];const k=G.track.slice(2),q=SQ[k],s=G.sq[k],st=q.steps[s.s];
  return{n:q.n,d:st.d+(st.n?' ('+(s.c||0)+'/'+st.n+')':'')+(st.zi!==undefined&&st.zi!==W.zi&&!st.d.toLowerCase().includes(ZONES[st.zi].n.replace(/^The /,'').toLowerCase())?' · '+ZONES[st.zi].n:'')}}
function objective(){return sideStep()}
let objC='';function objHud(){const on=OPT.obj&&(mode==='play'||mode==='dlg'),a=on?storyStep():null,b=on?sideStep():null,cp=on&&G.camp?G.camp:null,t=a?a.n+a.d+(b?b.n+b.d:'')+(cp?cp.k+cp.c:''):'';if(t+OPT.objMin===objC)return;objC=t+OPT.objMin;const el=$('obj');el.hidden=!a;
  if(a&&OPT.objMin)el.innerHTML='<b>▸ '+esc(a.n)+(b||cp?' +':'')+'</b>';else if(a)el.innerHTML='<b>Story · '+esc(a.n)+'</b>'+esc(a.d)+(b?'<b class="sd">Errand · '+esc(b.n)+'</b>'+esc(b.d):'')+(cp?'<b class="sd" style="color:#ff5d4d">Unity · '+CAMPS[cp.k].n+' '+cp.c+'/'+CAMPS[cp.k].need+'</b>'+esc(CAMPS[cp.k].d):'')}
const DIFFS=[{n:'Normal',hp:1.25,dmg:1.3,xp:1},{n:'Hard',hp:1.8,dmg:1.75,xp:1.2},{n:'Brutal',hp:2.6,dmg:2.4,xp:1.45}];
const DF=()=>DIFFS[G.diff||0];
