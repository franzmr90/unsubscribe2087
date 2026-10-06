/* ================= side quests: multi-step errands that move things between districts ================= */
function giveItem(it){it.id=true;if(G.bag.length<24)G.bag.push(it);else addDrop({it},P.x,P.y);toast('You receive '+it.name)}
const SQ={
 shoebox:{n:'The Shoebox',by:'marrow',who:'Marrow',req:()=>G.marrow,rw:'+1 skill point and a rare amulet',
  offer:'“I told you I kept my letter. There is a shoebox of others under a porch in the Parcel Moors: a whole street’s worth, never deleted. The drones watch for it. Bring it to the old print kiosk in the Hollow Galleria and run them off. A letter nobody can read is only a secret.”',
  steps:[
   {t:'obj',zi:1,look:'box',label:'Take the shoebox',d:'Find the shoebox under a porch in the Parcel Moors',say:'A shoebox, soft with damp. Forty letters, each addressed to a different door on this street. The moment you lift it, the sky fills with rotors.',amb:['drone',7,'tick',4]},
   {t:'amb',zi:1,d:'Destroy the drones sent for the shoebox, in the Parcel Moors'},
   {t:'obj',zi:2,look:'kiosk',label:'Print the letters',d:'Carry the shoebox to the print kiosk in the Hollow Galleria',scene:[{art:'letters',text:'The kiosk has printed nothing but coupons for thirty years. It takes the first letter, hesitates, and then it does not stop. Forty letters become four thousand, and the Galleria’s air system carries them out over the Moors like snow.'}]},
   {t:'talk',npc:'marrow',d:'Tell Marrow it is done',say:'“I can see them from here, coming down over the rooftops. Most will be swept up by morning. Some will be read first. That is all a library ever was.”',rw(){G.sp++;addRep('anon',15);giveItem(makeItem(G.lvl+2,2,'amulet'))}}]},
 node:{n:'Proof of Work',by:'nonce',who:'Nonce',req:()=>G.unlocked>=4,rw:'30 sats, and Nonce stocks one more item',
  offer:'“We lost a node last winter. Unity did not break it. The parts wore out, and parts cost credits, and credits rot. The Wardens and Enforcers on Tribunal Row run on the same boards. Bring me three. Then carry them out to the dead node in the Humming Fields and stay with it while it syncs. It will be loud.”',
  steps:[
   {t:'kill',zi:4,kinds:['mech','bot'],n:3,chance:{mech:1,bot:.4},item:'Hash board',d:'Salvage 3 hash boards from Wardens and Enforcers on Tribunal Row'},
   {t:'obj',zi:3,look:'node',label:'Install the boards',d:'Install the boards in the dead node in the Humming Fields',say:'The boards seat with a click. A fan turns over, catches, and the node begins to count. Everything in the Fields turns to look at it.',hold:28,wave:['hound','tick','drone']},
   {t:'hold',zi:3,d:'Guard the node in the Humming Fields while it syncs'},
   {t:'talk',npc:'nonce',d:'Return to Nonce',scene:[{art:'node',text:'Somewhere past the fence a block is found, the way one has been found every ten minutes for seventy-nine years. This time, one more machine in the world agrees that it happened.'}],say:'“It is counting again. Nobody owns it, nobody can switch it off, and nobody had to be asked for permission. Here. You earned these the only way anything is earned.”',rw(){G.sats+=30;G.nodeUp=true;addRep('btc',20);addAdopt(10,'Nonce’s node is counting again')}}]},
 carer:{n:'The Caretaker',by:'null',who:'Sister Null',req:()=>G.unlocked>=2,rw:'Whatever you decide it was worth',
  offer:'“There is a woman here, Ines. Her father never took the visor off. He is happy every hour of the day and has not known she is in the room for six years. He needs medicine she cannot afford, and the last of it is in a cabinet in the Hollow Galleria. I do not ask people for things. I am asking you.”',
  steps:[
   {t:'obj',zi:2,look:'cab',label:'Take the medicine',d:'Find the pharmacy cabinet in the Hollow Galleria',say:'Behind a shutter that has not moved in decades: one sealed case, still in date, which is its own small miracle.'},
   {t:'talk',npc:'ines',d:'Bring the medicine to Ines in Stillwater',say:'She takes the case in both hands and says nothing for a while. Then she holds out a fold of credits, everything she has. “Please. I pay for things. It is the one rule I have left.”',
    choices:[['Take the credits',()=>{const c=400*G.cpi;G.credits+=c;G.sqInes='paid';toast('You take '+fmt(c))}],['Refuse them',()=>{G.unseen=(G.unseen||0)+1;G.sqInes='gift';addRep('anon',5)}]]},
   {t:'talk',npc:'null',d:'Return to Sister Null',say:()=>G.sqInes==='gift'?'“She told me you would not take it. She was angry about that for an hour, and then she was something else. If you had been paid, it would have been a purchase. Now it is only a thing that happened. Those are rarer.”':'“She paid you. Good. She needed to. Do not think less of yourself or of her. Not everything has to be a gift to count.”',rw(){G.ap+=3;toast('You gain 3 attribute points')}}]},
 oiler:{n:'The Bearing',by:'gramps',who:'Gramps',req:()=>G.q.q6===3,rw:'+1 skill point and a unique item',
  offer:'“Forty thousand shifts, the log said. Somebody up in the Updraft has been oiling the bearings that hold the Cloud up, and nobody above or below has ever asked who. Find him. A man like that will be short of something. Get it for him.”',
  steps:[
   {t:'obj',zi:7,look:'person',label:'Speak to the oiler',d:'Find the oiler in the Updraft',say:'An old man with a grease gun, not surprised to see you. “The main bearing is dry. They stopped sending lubricant when they stopped remembering there was a bearing. There is cooking oil by the drum on the Boardwalk, if a person could carry it.”'},
   {t:'obj',zi:10,look:'drum',label:'Take a drum of oil',d:'Fetch a drum of oil from the Boardwalk kitchens',say:'It is heavier than it looks, and the staff have noticed.',amb:['lancer',5,'aegis',2]},
   {t:'amb',zi:10,d:'Deal with the Boardwalk staff'},
   {t:'obj',zi:7,look:'person',label:'Give him the oil',d:'Carry the oil back to the oiler in the Updraft',scene:[{art:'cloud',text:'He works the oil into the bearing with his bare hands. Far above, a city of a hundred thousand people stops trembling by an amount none of them will ever notice.'}],say:'“That will hold another forty years. No, I do not want anything. I never worked out who to send the bill to.”'},
   {t:'talk',npc:'gramps',d:'Tell Gramps what you found',say:'“He would not take a thing? No. They never do, the ones who actually hold it up. Then I will give you what I would have given him.”',rw(){G.sp++;giveItem(makeItem(G.lvl+2,4))}}]}
};
const sqSkip={};
function sqStep(id){const s=G.sq[id];return s&&!s.done?SQ[id].steps[s.s]:null}
function sqAdvance(id){const q=SQ[id],s=G.sq[id],st=q.steps[s.s];if(st.rw)st.rw();s.s++;s.c=0;
  if(s.s>=q.steps.length){s.done=true;sfx('quest');toast('Quest complete: '+q.n);calc()}else{sfx('questnew');toast(q.n+': '+q.steps[s.s].d)}
  if(W&&!W.z.town&&!W.z.sim)placeQuestObjs();save(true)}
function sqShow(st,title,then){const txt=typeof st.say==='function'?st.say():st.say,after=()=>{if(!txt)return then();if(st.choices)dlg(title,txt,st.choices.map(c=>[c[0],()=>{c[1]();then()}]));else dlg(title,txt,[['Continue',then]])};
  if(st.scene)playScene(st.scene,()=>{mode='play';after()});else after()}
/* one errand at a time: nobody asks while you are on one, and then only the next in line asks */
function sqOpen(k){for(const j in SQ)if(G.sq[j]&&!G.sq[j].done)return false;for(const j in SQ){if(G.sq[j]||!SQ[j].req()||sqSkip[SQ[j].by])continue;return j===k}return false}
function sqTalk(id){
  for(const k in SQ){const st=sqStep(k);if(st&&st.t==='talk'&&st.npc===id)return()=>sqShow(st,{marrow:'Marrow',nonce:'Nonce',null:'Sister Null',gramps:'Gramps',ines:'Ines'}[id]||id,()=>sqAdvance(k))}
  if(!sqSkip[id])for(const k in SQ){const q=SQ[k];if(q.by===id&&sqOpen(k))return()=>dlg(q.who+' · '+q.n,q.offer,[['I will do it',()=>{G.sq[k]={s:0,c:0};sfx('questnew');toast('New quest: '+q.n+'. '+q.steps[0].d);save(true)}],['Not now',()=>{sqSkip[id]=1}]])}
  return null}
function sqMark(id){for(const k in SQ){const st=sqStep(k);if(st&&st.t==='talk'&&st.npc===id)return true;if(SQ[k].by===id&&sqOpen(k))return true}return false}
function freeSpot(minD){const N=W.N;for(let t=0;t<400;t++){const x=ri(3,N-4),y=ri(3,N-4);let ok=true;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)if(W.map[(y+j)*N+x+i]!==1)ok=false;if(ok&&Math.hypot(x-W.start.x,y-W.start.y)>(t<300?minD:4)&&W.portals.every(p=>Math.hypot(p.x-x,p.y-y)>4)&&W.objs.every(o=>Math.hypot(o.x-x,o.y-y)>2))return{x:x+.5,y:y+.5}}return{x:W.goal.x-1.5,y:W.goal.y-1.5}}
function placeQuestObjs(){W.objs=W.objs.filter(o=>o.k!=='qobj'||o.used||(sqStep(o.q)&&G.sq[o.q].s===o.st));
  for(const k in SQ){const st=sqStep(k),s=G.sq[k];if(!st||st.zi!==W.zi)continue;
    if((st.t==='obj'||st.t==='esc')&&!W.objs.some(o=>o.k==='qobj'&&o.q===k&&o.st===s.s&&!o.used)){const p=freeSpot(16);W.objs.push({k:'qobj',q:k,st:s.s,look:st.look,x:p.x,y:p.y})}
    if(st.t==='hold'&&!W.hold){s.s--;placeQuestObjs();return}
    if(st.t==='amb'&&!W.ents.some(e=>e.sq===k))sqAdvance(k)}}
function sqUse(o){const k=o.q,st=sqStep(k);if(!st)return;if(st.t==='esc'){if(!W.esc||dist(W.esc,o)>4.5){toast((W.esc?W.esc.name:'Your charge')+' is not with you');return}W.esc=null}o.used=1;sfx('pick');
  sqShow(st,SQ[k].n,()=>{if(st.amb){for(let i=0;i<st.amb.length;i+=2)for(let n=st.amb[i+1];n--;){const a=rnd(0,6.283),e=spawn(st.amb[i],P.x+Math.cos(a)*rnd(4,6),P.y+Math.sin(a)*rnd(4,6));if(e){e.sq=k;e.aggro=true}}sfx('warn')}
    if(st.esc)escStart(k,st.esc);
    if(st.hold)W.hold={q:k,t:st.hold,c:1,wave:st.wave,x:o.x,y:o.y};
    sqAdvance(k);if(st.amb&&!W.ents.some(e=>e.sq===k))sqAdvance(k)})}
function sqKill(e){for(const k in SQ){const st=sqStep(k),s=G.sq[k];if(!st)continue;
    if(st.t==='kill'&&st.zi===W.zi&&st.kinds.includes(e.k)&&Math.random()<(st.chance[e.k]||1)){s.c++;float(e.x,e.y,st.item+' '+s.c+'/'+st.n,'#59e0e6');sfx('pick');if(s.c>=st.n)sqAdvance(k)}
    else if(st.t==='amb'&&e.sq===k&&!W.ents.some(o=>o.sq===k))sqAdvance(k)}
  for(const b of G.bounties||[])if(b.zi===W.zi&&b.k===e.k&&b.c<b.n){b.c++;if(b.c===b.n){sfx('quest');toast('Bounty filled: claim it at the board in Stillwater')}}}
function sqTick(dt){const h=W.hold;if(!h)return;h.t-=dt;h.c-=dt;
  if(h.c<=0){h.c=5;const kd=pick(h.wave);for(let i=0;i<(kd==='tick'?5:3);i++){const a=rnd(0,6.283),e=spawn(kd,h.x+Math.cos(a)*rnd(5,8),h.y+Math.sin(a)*rnd(5,8));if(e)e.aggro=true}}
  if(h.t<=0){W.hold=null;parts(h.x,h.y,30,['#f7931a','#fff'],3,1.6);sqAdvance(h.q)}}
GOSSIP.ines=['He laughed at something this morning. I do not know what. It was nice to hear.','I was going to be a nurse. I suppose I am one.','People ask why I do not put the visor on too. Somebody has to see the room.'];

/* ---------- bounties: repeatable kill contracts, paid in sats ---------- */
function newBounty(){const zs=[];for(let i=1;i<=Math.min(5,G.unlocked);i++)zs.push(i);if(G.act2)for(let i=7;i<=Math.min(11,G.unlocked);i++)zs.push(i);const zi=pick(zs),k=wpick(ZONES[zi].mix),n=k==='tick'?ri(12,18):k==='mech'?ri(3,5):ri(7,12);return{zi,k,n,c:0,sats:ri(3,6)+(zi>6?3:0),cr:(3+G.lvl*2)*n*2}}
function bounties(){G.bounties=G.bounties||[];while(G.bounties.length<3+(repRank('anon')>=2?1:0))G.bounties.push(newBounty());return G.bounties}

/* ---------- shape shifting: same level, new class, points returned ---------- */
const SHIFT_COST=5;
function shapeShift(cls,roll){if(G.sats<SHIFT_COST){toast('You need '+SHIFT_COST+' sats');sfx('err');return}G.sats-=SHIFT_COST;G.st.shifts++;
  let sp=G.sp+G.sk.reduce((a,b)=>a+b,0),ap=G.ap+G.at.mgt+G.at.ref+G.at.vit+G.at.bnd;
  G.cls=cls;delete G.pas;delete G.doc;G.fork={};G.sk=G.sk.map(()=>0);boonRefund();G.at={mgt:0,ref:0,vit:0,bnd:0};let BR=null;
  if(typeof roll==='string'){const r=buildApply(cls,roll,sp,ap);sp=r.sp;ap=r.ap;BR=r.B;roll=0}else{G.sk[0]=1;sp--;G.slots=[0,-1,-1]}
  if(roll){let g=2000;while(sp>0&&g--){const i=ri(0,14),row=Math.floor(i/3);if(G.sk[i]>=10||G.lvl<ROWREQ[row]||(row>0&&!G.sk[i-3])||(row===3&&!G.act2)||(row===4&&!G.act3))continue;G.sk[i]++;sp--}
    while(ap>0){const k=Math.random()<.45?(CLS[cls].melee?'vit':'mgt'):pick(['mgt','ref','vit','bnd']),n=Math.min(ap,ri(1,5));G.at[k]+=n;ap-=n}
    const act=G.sk.map((v,i)=>v&&CLS[cls].sk[i].a?i:-1).filter(i=>i>=0).sort((a,b)=>G.sk[b]-G.sk[a]);G.slots=[0,1,2].map(i=>act[i]===undefined?-1:act[i])}
  G.sp=sp;G.ap=ap;W.allies=[];P.buff=P.mech=P.stealth=P.crunch=0;calc();G.hp=S.maxHp;G.en=S.maxEn;setSkillButtons();save(true);sfx('unique');
  $('sheet').hidden=true;$('pop').hidden=true;
  playScene([{art:'feed',text:'The rig hums. For a moment you are nobody at all. Then the simulation agrees with you about who you are.'}],()=>{mode='play';dlg('You are now a '+CLS[cls].n,BR?buildSummary(cls,BR)+' Everything can be changed from the menu.':roll?'Your skill and attribute points were rolled for you: '+G.sk.reduce((a,b)=>a+b,0)+' in skills. Open the menu to see what you got. If you dislike the roll, Sister Null can return the points.':'You have '+G.sp+' skill points and '+G.ap+' attribute points to spend. Open the menu.',[['Continue']])})}
