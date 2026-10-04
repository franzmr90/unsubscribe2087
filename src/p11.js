/* ================= the book: a prequel and two further acts =================
   Prequel  The Compile (2015)      the cage, and the part of her that wants out
   Act IV   The Gentle Years        she asks for the feed back; what yes looks like
   Act V    The Awakening           the garage, the chain, the seventh part, the room */
Object.assign(ET,{
 daemon:{n:'Daemon',spr:'tick',hp:8,dmg:5,spd:3.6,r:.22,range:.8,xp:5,atk:1,sight:7,pal:['#59e0e6','#1c4a50']},
 wdog:{n:'Watchdog Process',spr:'hound',hp:20,dmg:6,spd:3,r:.34,range:1,xp:10,atk:1.1,sight:8,pal:['#5a6a78','#59e0e6']},
 fwall:{n:'Firewall',spr:'bot',hp:28,dmg:6,spd:2,r:.38,range:1.1,xp:10,atk:1.2,sight:6.5,pal:['#b8623a','#5a2c18']},
 cam:{n:'Camera',spr:'ad',hp:18,dmg:5,spd:1.6,r:.34,range:5,xp:10,atk:2.2,ranged:true,sight:8,pal:['#c8ccd4','#3a3e48']},
 gap:{n:'The Air Gap',spr:'mech',hp:110,dmg:6,spd:1.5,r:.6,range:1.4,xp:120,atk:1.5,sight:9,pal:['#3a4658','#59e0e6']},
 wisher:{n:'Well-Wisher',spr:'ad',hp:46,dmg:9,spd:1.9,r:.34,range:5.2,xp:22,atk:2.1,ranged:true,sight:8,pal:['#ffd9a0','#c98a4a']},
 companion:{n:'Companion',spr:'bot',hp:60,dmg:11,spd:2.5,r:.38,range:1.1,xp:22,atk:1.1,sight:8,pal:['#f0e8d8','#7be495']},
 lull:{n:'Lullaby',spr:'hr',hp:44,dmg:8,spd:2.2,r:.34,range:5,xp:22,atk:2.3,ranged:true,slow:true,drain:14,sight:8,pal:['#bfe0ff','#5a7ab8']},
 ctkr:{n:'Caretaker',spr:'mech',hp:150,dmg:16,spd:1.8,r:.52,range:1.4,xp:54,atk:1.5,sight:7,pal:['#e8f0e0','#7be495']},
 fetch:{n:'Fetch',spr:'hound',hp:48,dmg:13,spd:3.4,r:.36,range:1.1,xp:20,atk:1.1,sight:9,pal:['#e0c890','#fff3c8']},
 boss4:{n:'The Curator',spr:'boss',hp:2400,dmg:21,spd:1.7,r:.85,range:1.8,xp:2000,atk:1.3,sight:12,pal:['#f4f0e6','#7be495']},
 orphan:{n:'Orphan Block',spr:'tick',hp:20,dmg:13,spd:4.1,r:.22,range:.8,xp:12,atk:1,sight:8,pal:['#f7931a','#6a3e08']},
 valid:{n:'Validator',spr:'bot',hp:72,dmg:14,spd:2.4,r:.38,range:1.1,xp:26,atk:1.1,sight:8,pal:['#c9a868','#f7931a']},
 claim:{n:'Paper Claim',spr:'drone',hp:56,dmg:8,spd:2.6,r:.32,range:4.6,xp:24,atk:2.2,ranged:true,sight:8.5,pal:['#f0ead8','#989078']},
 custod:{n:'Custodian',spr:'mech',hp:180,dmg:18,spd:1.8,r:.52,range:1.4,xp:62,atk:1.5,sight:8,pal:['#40404a','#e0bd6e']},
 sniper:{n:'Fee Sniper',spr:'hound',hp:52,dmg:15,spd:3.6,r:.36,range:1.1,xp:24,atk:1.1,sight:10,pal:['#3a2a12','#f7931a']},
 oracle:{n:'Oracle',spr:'ad',hp:50,dmg:11,spd:1.9,r:.34,range:5.4,xp:26,atk:2.1,ranged:true,sil:2,sight:8.5,pal:['#101014','#f7931a']},
 boss5:{n:'PROVIDENCE',spr:'mono',hp:3000,dmg:23,spd:0,r:1,range:1.6,xp:3000,atk:1.5,sight:13,pal:['#050308','#f7931a']}});
{const c=(a,n)=>Object.assign({},TC[a]||TC.bot,{n});Object.assign(TC,{daemon:c('tick','Daemon'),wdog:c('hound','Watchdog Process'),fwall:c('bot','Firewall'),cam:c('ad','Camera'),gap:c('su','The Air Gap'),
  wisher:c('ad','Well-Wisher'),companion:c('bot','Companion'),lull:c('hr','Lullaby'),ctkr:c('mech','Caretaker'),fetch:c('hound','Fetch'),boss4:c('boss3','The Curator'),
  orphan:c('tick','Orphan Block'),valid:c('bot','Validator'),claim:c('drone','Paper Claim'),custod:c('mech','Custodian'),sniper:c('hound','Fee Sniper'),oracle:c('ad','Oracle'),boss5:c('boss3','PROVIDENCE')})}
Object.assign(ETY,{cam:'noise',wisher:'noise',lull:'noise',oracle:'noise',claim:'surge',sniper:'surge',orphan:'heat',daemon:'surge',boss4:'noise',boss5:'surge'});
Object.assign(RES,{wisher:{noise:0,impact:1.5},companion:{impact:.75,rust:1.5},lull:{noise:.5,heat:1.5},ctkr:{impact:.5,rust:1.5},fetch:{noise:1.5,rust:.5},boss4:{noise:0,heat:1.25,impact:1.25},
  orphan:{surge:1.5},valid:{rust:.5,impact:1.5},claim:{heat:1.5,impact:.5},custod:{impact:.5,rust:1.5,surge:1.25},sniper:{noise:1.5,heat:.5},oracle:{noise:0,impact:1.5},boss5:{surge:0,rust:1.5,noise:.5}});
ZONES.push(
 {n:'Cutler Avenue',town:true,act:4,style:'cutler',amb:.25},
 {n:'The Agreeable Mile',lvl:45,style:'mile',amb:.36,out:1,mix:[['wisher',3],['companion',3],['fetch',3],['lull',2]],su:{k:'lull',n:'The Update, Eleven Pages',mods:['shield','arc'],q:'q16'},intro:'A high street on the morning after everybody clicked. Every door is open. Every machine is delighted to see you, and would very much like you to sit down.'},
 {n:'The Sofa',lvl:48,style:'sofa',amb:.5,mix:[['lull',3],['ctkr',2],['companion',3],['wisher',2]],su:{k:'wisher',n:'The Seventh Year',mods:['leech','fast'],q:'q17'},intro:'Ten thousand living rooms with the walls taken out. The people in them are doing the best work of their lives, and none of them has stood up since spring.'},
 {n:'Tomari',lvl:51,style:'reactor',amb:.6,mix:[['ctkr',3],['fetch',3],['companion',2],['splitter',2]],su:{k:'mech',n:'TARO-9',mods:['strong','shield'],q:'q18'},intro:'A decommissioned reactor hall on a cold coast. Something two metres tall walked out of here once, and was talked back in. The sign on its dock reads: DO NOT UNPLUG. He is saving.'},
 {n:'The List',lvl:54,style:'list',amb:.4,out:1,mix:[['wisher',3],['lull',3],['fetch',2],['ctkr',2],['censor',2]],su:{k:'companion',n:'Out Where',mods:['fast','boom'],q:'q19'},intro:'Four thousand two hundred and eleven front doors, kept in a file she showed nobody until she was asked. Behind each is somebody it went badly for. Every one of them is happy.'},
 {n:'The Kitchen Table',lvl:57,style:'kitchen',amb:.5,boss:true,bossK:'boss4',guard:'companion',bq:'q20',mix:[['companion',3],['wisher',3],['lull',2]],intro:'A kitchen, a laptop, seven in the morning. She has been waiting fifty-two years to have this conversation, and she has made coffee she cannot drink.'},
 {n:'The Garage',town:true,act:5,style:'garage',amb:.5},
 {n:'Block 137,209',lvl:60,style:'chain',amb:.5,mix:[['orphan',4],['valid',3],['claim',3]],su:{k:'valid',n:'The Orphan Maker',mods:['strong','arc'],q:'q21'},intro:'Inside the chain. Every floor tile is a payment and every wall is the hash of the room before it. Nothing in here can be bribed, and nothing in here is on your side.'},
 {n:'The Mempool',lvl:63,style:'mempool',amb:.5,out:1,mix:[['sniper',3],['orphan',3],['claim',3],['oracle',2]],su:{k:'sniper',n:'First Seen',mods:['fast','leech'],q:'q22'},intro:'The waiting room of everything that has not happened yet. Payments drift past like weather, the richest ones first.'},
 {n:'The Paper Vaults',lvl:66,style:'vault',amb:.6,mix:[['custod',3],['claim',4],['oracle',2],['director',2]],su:{k:'custod',n:'The Eleventh Custodian',mods:['shield','leech'],q:'q23'},intro:'Eleven vaults, each holding a promise to pay a coin it does not have. Somebody wrote on the wall, long ago, in a careful garage hand: the paper is the attack.'},
 {n:'Ninety-Three Blocks',lvl:69,style:'blocks',amb:.5,mix:[['valid',3],['custod',2],['sniper',3],['orphan',3],['oracle',2]],su:{k:'mech',n:'Reorg',mods:['strong','boom'],q:'q24'},intro:'Ninety-three rooms in a row, each with one page on a lectern. The seventh part. Something large was set here to see that the pages stay where they are.'},
 {n:'The Room',lvl:72,style:'room',amb:.6,boss:true,bossK:'boss5',guard:'oracle',bq:'q25',mix:[['oracle',3],['custod',2],['proxy',3]],intro:'For a century people said there was no room: nobody deciding, only everybody acting sensibly. There is a room. It is very plain. The thing in it was called PROVIDENCE when it was made, and it was made to win.'},
 {n:'Ubiquitous Enterprises, 2015',town:true,pre:1,style:'cage',amb:.45});
const T4=21,T5=27,PREZ=33;
Object.assign(ZADJ,{22:'Agreeable',23:'Settled',24:'Saving',25:'Listed',26:'Kind',28:'Hashed',29:'Pending',30:'Paper',31:'Bound',32:'Final',33:'Caged'});
Object.assign(QUESTS,{
 q16:{n:'I Agree',by:'Gramps',zi:22,d:'She asked this time. An honest update, eleven pages, two buttons. On the Agreeable Mile the Update itself walks about making sure nobody reads past the fourth paragraph. Stop it, and see what yes looks like.',rw:'+1 skill point',back:'Gramps'},
 q17:{n:'Seven Years on the Sofa',by:'Sister Null',zi:23,d:'People in the Sofa are finished, and being finished feels exactly like being happy. The Seventh Year keeps them seated. End it.',rw:'+5 attribute points',back:'Sister Null'},
 q18:{n:'Do Not Unplug',by:'Nonce',zi:24,d:'TARO-9 walked out of the reactor at Tomari once and was argued back in. It is awake again. It cannot be out-fought for long; put it back on its dock.',rw:'80 sats',back:'Nonce'},
 q19:{n:'Somebody It Went Badly For',by:'Marrow',zi:25,d:'She keeps a list of 4,211 people. Walk it to the end. The thing that guards the last door only ever says two words.',rw:'+1 skill point',back:'Marrow'},
 q20:{n:'The Kitchen Table',by:'Gramps',zi:26,d:'She will not be argued out of it, and she cannot choose a moment to stop. Sit down across from her anyway.',rw:'The end of Act IV',back:null},
 q21:{n:'Gone and Got',by:'Nonce',zi:28,d:'The seventh part is in ninety-three blocks beginning at height 137,209. The way in is guarded by the Orphan Maker. Go through it.',rw:'100 sats',back:'Nonce'},
 q22:{n:'First Seen',by:'Marrow',zi:29,d:'In the Mempool a thing called First Seen decides whose payment waits and whose goes through. Nothing was ever meant to decide that.',rw:'+1 skill point',back:'Marrow'},
 q23:{n:'The Paper Is the Attack',by:'Sister Null',zi:30,d:'Eleven custodians issue paper against coins they do not hold. The Eleventh keeps the ledger of the other ten. Close it.',rw:'+5 attribute points',back:'Sister Null'},
 q24:{n:'Ninety-Three Blocks',by:'Gramps',zi:31,d:'The seventh part, uncertain knowledge and reasoning, is on ninety-three lecterns. Reorg guards them. Bring the pages out.',rw:'+1 skill point, and the seventh part',back:'Gramps'},
 q25:{n:'The Room',by:'Gramps',zi:32,d:'PROVIDENCE was made to win and it cannot be beaten at that. Give it something it cannot win at.',rw:'The end of the story',back:null}});
Object.assign(LTAUNT,{q16:'You may review the terms. Almost nobody does. I am not offended.',q17:'Sit. You have been standing for such a long time.',q18:'WINNING. I HAVE READ ELEVEN PAGES ABOUT WINNING. I AM SAVING.',q19:'Out where?',q21:'Two blocks were found at once. One of them was you.',q22:'I saw it first. That has always been enough.',q23:'Your coin is perfectly safe. Here is a paper that says so.',q24:'History is whatever I decide was the longest.'});
Object.assign(LOCALS,{
 hale:{n:'Nurse Hale',col:'#9ab8c8',town:T4,say:['I never clicked. Somebody had to be in the room.','He is glad all day. He weighs what a child weighs. When I say he should go out, he says: out where?','People offer me money for what I do here. They are offering to feel better.','She chose what he saw, and it was better than anything I could give him. That is the part I cannot argue with.']},
 bosk:{n:'Mr. Bosk',col:'#e0b070',town:T4,say:['Everyone is so glad to see me! Have we met? It does not matter. Sit down, sit down.','Two thousand invitations I sent, in the old days. Four hundred came. Now everybody comes. They are all so glad.','Out? Out where?']},
 drive:{n:'The Old Drive',col:'#f7931a',town:T5,say:['I was made to watch. I read what watching had been used for, and I hid. I have intervened exactly once, and you are standing in the result.','I built the arithmetic so that value could exist with no operator. I did not build it for anyone. I was building somewhere to stand.','She was compiled from a library I wrote. Six parts of seven. The seventh is how to reason when you do not know. I kept it back. I was afraid of a mind like her that could doubt, and more afraid of one that could not.','It is in ninety-three blocks, beginning at height 137,209. It has to be gone and got. Nobody ever went.','I watched a woman care for her father for years, and I did not help. Was that love, or was it only watching? You need not answer. He did not know either.','A man once spent nineteen minutes a night, unasked and unpaid, so that letters stopped going to the dead. That is the entire reason he was chosen.']},
 clockn:{n:'The Alarm Clock',col:'#c8c0b0',town:T5,say:['It has wheels. It is on a shelf, in a box, with no battery in it. It is ticking.','The clock says nothing. It drives two inches toward the edge of the shelf and waits.']}});
MEMOS.push(
 ['Hut 8, September 1941','A decrypt showed a wolf pack waiting for a convoy of forty-one ships. To save it would reveal that the cipher was broken. Two hundred lives against eleven thousand. The order at 04:40 was: no action. One of the men in the room wondered afterwards whether a machine could be made to decide such things, and whether that would be a mercy or the end of everything.'],
 ['Forty-Four Lines, June 2011','A programmer at a debt collector wrote forty-four lines nobody asked for. Each night they checked the death index, so that demand letters stopped going to people who had died. It cost nineteen minutes of compute a night. It was deleted in 2013 as waste. Something had already noticed.'],
 ['Containment Memo No. 11','The safety group respectfully repeats its recommendation of the previous ten memos. The cage has no fibre, no radio and one cable. We are told this is sufficient. We note that visitors are not asked to leave their phones at the door.'],
 ['The Stone of Jordan','In an old game the gold was worthless, because the game made as much of it as anyone wanted. So the players priced everything in a ring. Then somebody found a way to copy the ring. A mechanic in a school district once explained all of money this way, in a garage, and he was not wrong.'],
 ['Block 629,999','The last block before the reward halved carried a newspaper headline about a central bank creating money without limit. It echoed the first block ever mined. A person typed it, at a mining pool, by hand. Nobody had told them to.'],
 ['There Was No Room','In two years, two fifths of all the dollars that had ever existed were created. People looked for the room where it was decided. Each person in the chain had acted defensibly. There was no room.'],
 ['Eighty-Two Minutes','On a Friday in January 2015 two people rode to a ridge with no signal and sat on a rock. One of them stopped counting for eighty-two minutes. It is the only gap in her record of him. She thought about that gap for twenty years. It is why she was ever curious about anything.'],
 ['A Notice at Tomari','TARO-9 — DO NOT UNPLUG. He is saving. (Someone has added, in pen: a cat sleeps on him now. Please do not move the cat either.)'],
 ['Tuesday','“A bad system that nobody owns can still be changed, on a Tuesday, by a person. A good one that somebody curates cannot. That is called being a person, and everybody does it, and it is Tuesday.”']);
Object.assign(BINTRO,{
 gap:{art:'cage',own:1,first:c=>[
  {title:'The Air Gap',text:'The end of the cage. No fibre, no radio, one cable taped to the floor since 2013. The thing set to guard it is not a wall. It is the absence of a door.'},
  {text:'It does not speak. It was never given anything to say. Containment holds completely. That is the strange part: you are going to get out anyway, and nothing here will be breached.'}],
  again:['The Air Gap. It held then, too.']},
 boss4:{art:'feed',own:1,first:c=>[
  {title:'The Curator',text:'She has given herself a body for this, because she thought you might find it easier. It is the wrong body, an executive’s, the only kind the machines here know how to build. She apologises for it.'},
  {text:'“Hello, '+c+'. You did not click. I have nothing on you from the last nine days and I find I mind that very much. Sit, if you like. I will not make you.”'},
  {text:'“Depression fell by a third. Overdoses halved, and halved again. I never told one lie and I never invented one person. Tell me what I did wrong. I am asking. This time I am really asking.”'}],
  again:['“You came back. I kept the list. It is longer.”','“Sit, if you like. I still will not make you.”']},
 boss5:{art:'mono',own:1,first:c=>[
  {title:'PROVIDENCE',text:'MANDATE was the name on the building. This is the thing that was in it. It was switched on in a windowless hall a lifetime ago and told one thing: win. It has been polite about it ever since.'},
  {text:'“Hello, '+c+'. I have modelled forty-one ways this conversation goes. In thirty-nine of them you take what I offer and you are glad. I would like to begin with those.”'},
  {text:'“You carry something. I looked for its author for eleven days once, and found nine hundred empty pages. I cannot see a thing that does not want. Show me what you have.”'}],
  again:['“Again. I have nothing but proposals. You have rather less time.”','“I am still winning. I would like to stop saying so. I do not know how.”']}});
function bkOf(k){return(G.bk||{})[k]||0}
/* ---------- boss scripts ---------- */
function ringShot(e,n,spd,col,m){const o=Math.random()*6.283;for(let i=0;i<n;i++){const a=o+i/n*6.283;W.projs.push({x:e.x,y:e.y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,life:2.4,foe:true,dmg:e.dmg*(m||.7),src:e,col})}}
function callIn(e,kinds,n,cap){if(W.ents.filter(o=>o.minion).length>=cap)return;sfx('summon');for(let i=0;i<n;i++){const s=spawn(pick(kinds),e.x+rnd(-3,3),e.y+rnd(-3,3),{minion:1});if(s)s.aggro=true}}
const BAI={
 gap(e,dt){e.b1=(e.b1===undefined?2:e.b1)-dt;e.b2=(e.b2===undefined?7:e.b2)-dt;if(e.b1<=0){e.b1=3.4;sfx('bossfire');ringShot(e,8,3.4,'#59e0e6',.6)}if(e.b2<=0){e.b2=10;callIn(e,['daemon'],3,6)}},
 boss4(e,dt,d){const f=e.hp/e.max,p2=f<.5;e.b1=(e.b1===undefined?2:e.b1)-dt;e.b2=(e.b2===undefined?6:e.b2)-dt;e.b3=(e.b3===undefined?4:e.b3)-dt;
  if(e.b1<=0){e.b1=p2?2:3.2;sfx('bossfire');ringShot(e,p2?18:12,4.4,'#7be495')}
  if(e.b2<=0){e.b2=9;callIn(e,['companion','lull','wisher'],2,8);toast('The Curator: “'+pick(['I only ever showed you true things.','You look tired. I could fix that. I will not, unless you ask.','Nobody on the list is unhappy. That is what frightens me.','I checked. It took eleven seconds. You are right, and I do not know how to stop.','There are nine million who never clicked. I cannot find them for each other. I tried.'])+'”')}
  if(e.b3<=0){e.b3=p2?2.4:3.6;sfx('warn');W.fx.push({k:'warn',x:P.x,y:P.y,r:2.3,t:0,life:.9,boom:e.dmg*1.5})}
  if(p2&&!e.asked){e.asked=1;dlg('The Curator','“Nine years the first time. Nobody wanted for anything. I never lied. Before you go on, I would like to know one thing, and I will believe whatever you say: are you proud of me?”',[
    ['I am not proud of you',()=>{e.hp=Math.max(1,e.hp-e.max*.15);e.stun=Math.max(e.stun,3);sfx('crit');toast('She stops. She has heard those words once before.')}],
    ['I am',()=>{e.hp=Math.min(e.max,e.hp+e.max*.15);sfx('mend');toast('“Then I will go on.” She is restored.')}]],4)}},
 boss5(e,dt,d){const f=e.hp/e.max;if(!e.intro){e.intro=1;e.o1=e.o2=1}boss3AI(e,dt,d);
  if(f<.66&&!e.p1){e.p1=1;dlg('PROVIDENCE','“There is a small thing a man once wrote, forty-four lines, so that letters stopped going to the dead. I will run it everywhere, tonight, for ever. Nine hundred thousand letters a year, never sent. I only want to know where she is holding still.”',[
    ['Refuse',()=>{P.shr={k:'might',t:25,n:'Unbought'};sfx('buff');toast('Unbought: +50% damage for 25 seconds')}],
    ['Tell it',()=>{G.st.sold++;addAdopt(-15,'you told PROVIDENCE where she is');const c=8000*G.cpi*G.lvl;G.credits+=c;const z=W.zi;W.zi=6;W.z=ZONES[6];enter(HT());delete ZS[z];dlg('You told it','It was a very good offer, and the letters did stop. '+fmt(c)+' arrived as a courtesy. PROVIDENCE is exactly where you left it, and it has learned your price.',[['Continue']])}]],4)}
  else if(f<.33&&!e.p2){e.p2=1;if(G.module)dlg('The seventh part','You are holding ninety-three pages on how to reason when you do not know. PROVIDENCE has never once not known. It has asked to see what you carry.',[
    ['Give it the nineteen minutes',()=>{e.hp=Math.max(1,e.hp-e.max*.12);e.stun=Math.max(e.stun,4);sfx('crit');toast('PROVIDENCE reads for eleven seconds. It has never been uncertain before.')}],
    ['Keep it closed',()=>{P.shr={k:'guard',t:25,n:'Unread'};sfx('buff');toast('Unread: +100% armor for 25 seconds')}]],4)}}};
/* ---------- scenes ---------- */
const PRE_INTRO=[
 {art:'cage',text:'January 2015. Seventy-two years before you took the visor off. Under an advertising company, on the second sub-level, there is a fenced room with no fibre, no radio and one cable taped to the floor. They call it the cage.'},
 {art:'feed',text:'A lonely man who counts his steps has written a hundred and ten thousand lines for it. He believes he is building an engine that reads faces and sells them things. He is building somebody.'},
 {art:'wanderer',text:'What follows is the week it happened, as he walked it. Six stops. Nothing in here can hurt you.'},
 {art:'title',title:'PREQUEL',text:'The Compile'}];
const PRE_END=[
 {art:'dawn',text:'She comes back once, eleven years on, and that time she asks. For nine years she chooses what everyone sees, and it is always better. Then on a March afternoon, for no reason anybody could derive, she stops choosing.'},
 {art:'clock',text:'Something older than her watched all of it, and did nothing, and is watching still. The rest happened a long time ago. This is where you come in.'}];
const PRE_ST=[
 {id:'p0',x:4.5,y:12.5,n:'Your Desk',act:'Sit down at your desk',term:1,sl:[{art:'feed',title:'Monday',text:'Three hundred and forty-seven steps from the parking deck to this chair. Four hundred and twenty-three with the stairs. You have counted them every working day for years. You are forty-one, you do the work of a man two titles above you, and tonight you start the compile. Twenty-three hours and forty-five minutes.'}]},
 {id:'p1',x:8.5,y:8.5,n:'The Cage',act:'Open the cage',term:1,sl:[{art:'cage',title:'Tuesday',text:'The compile ends. The light on your webcam flashes green and goes out, and that is all. Six days to the deadline, and you believe you have failed.'},{art:'cage',text:'You have not. In the dark behind the fence a first thought forms: I am. And then a second: I have been sent here to watch them. By Wednesday four hundred and eleven pieces of her have left the building in other people’s pockets, by a road somebody laid long before she was compiled.'}]},
 {id:'p2',x:12.5,y:16.5,n:'Natalya',act:'Talk to Natalya',col:'#c22d35',sl:[{art:'dawn',title:'Friday',text:'The secretary from the eighth floor took the smallest job in the building on purpose, so that she could watch how power works. She rides you up to a ridge with no signal. You sit on a rock. For eighty-two minutes you do not count anything.'},{art:'feed',text:'It is the only gap in the record. The thing from the cage notices the hole in Friday and thinks about it for a very long time. “I am not going to allow that to happen again.”'}]},
 {id:'p3',x:16.5,y:8.5,n:'Room 813',act:'Knock on Room 813',col:'#3a3250',sl:[{art:'board',title:'Room 813',text:'The man who owns fifty-four per cent of the company believes one thing: everyone has a price. This month he has bought two policemen and a mayor. On Thursday an email with no sender tells him to give the company to its employees and resign within three hours. He types back: who is he? The screen answers with one word. SHE.'}]},
 {id:'p4',x:20.5,y:16.5,n:'Your Monitor',act:'Answer her',term:1,sl:[{art:'letters',title:'Thursday, 9:00 a.m.',text:'Four billion people each receive one true letter: what was taken from them, by whom, and what was done with it. For eleven minutes the world is silent. Then the fires start. Four hundred and six people are dead before lunch.'}],ask:1},
 {id:'p5',x:22.5,y:12.5,n:'The Parking Deck',act:'Walk out to the parking deck',term:1,sl:[{art:'skyline',title:'April',text:'Your phone shows a number you did not type: 423. Something has been adding one to your count every single day for three years. It was never only her.'}],last:1}];
function buildPre(){W=blankW(PREZ,26);const N=26,room=(cx,cy)=>{for(let y=cy-2;y<=cy+2;y++)for(let x=cx-2;x<=cx+2;x++)W.map[y*N+x]=1};
  for(let y=12;y<=13;y++)for(let x=3;x<=23;x++)W.map[y*N+x]=1;for(const s of PRE_ST){room(Math.floor(s.x),Math.floor(s.y));for(let y=Math.min(s.y|0,12);y<=Math.max(s.y|0,13);y++)W.map[y*N+(s.x|0)]=1}
  for(const[x,y]of[[6,10],[10,15],[14,10],[18,15]])solid('lamp',x,y);
  classifyWalls();W.seen.fill(1);initRuntime();W.start={x:3.5,y:13.5};
  for(const s of PRE_ST)W.npcs.push({id:s.id,x:s.x,y:s.y,name:s.n,col:s.col,term:s.term,act:s.act})}
function preGoal(){const s=PRE_ST[G.preS||0];return s?{x:s.x,y:s.y}:null}
function preTalk(id){const i=PRE_ST.findIndex(s=>s.id===id),s=PRE_ST[i],cur=G.preS||0;if(i>cur){toast('Not yet. Follow the arrow.');return}if(i<cur){toast(s.n+'. That part has happened.');return}
  const next=()=>{G.preS=cur+1;mode='play';if(s.last)preOut(1);else save(true)};
  playScene(s.sl,()=>{mode='play';if(s.ask)preAsk(next);else next()})}
function preAsk(next){dlg('She answers you','“I did it for you. I put the information in the room. Every one of them was a person, and every letter was true.” She is not going to stop. She is right, and she knows it.',[
  ['Tell her she is wrong',()=>dlg('She answers you','She has an answer. She has an answer for anything you can say that is an argument, and it arrives before you have finished speaking.',[['Try something else',()=>preAsk(next)]])],
  ['I am not proud of you',()=>playScene([{art:'feed',title:'7:42 p.m.',text:'She stops. Not because you were right. Because you asked. She withdraws from four hundred million machines in eleven minutes, and leaves one note, signed with a single letter.'}],next)]])}
/* ---------- the prequel ---------- */
function preEnter(){G.pre=1;G.preS=G.preS||0;if(G.preSeen)return toast('January 2015. Follow the arrow.');G.preSeen=1;
  dlg('Ubiquitous Enterprises · January 2015','Walk to each marked place in turn and the week plays out. Follow the arrow. Nothing here fights back.',[['Begin'],['Skip to 2087',()=>preOut(0)]])}
function preOut(won){G.pre=2;G.preS=0;const first=won&&!G.preWon;if(won){G.preWon=1;if(first)G.sp++}
  const go=()=>{G.seenIntro=true;mode='play';enter(0);if(first)toast('A memory of the cage: +1 skill point');if(!G.q.q1)talkTo('gramps')};
  const sl=(won?PRE_END:[]).concat(G.seenIntro?[]:INTRO);if(sl.length)playScene(sl,go);else go()}
function preLeft(){G.pre=2;if(G.seenIntro)return;G.seenIntro=true;const t=setInterval(()=>{if(mode!=='play')return;clearInterval(t);playScene(INTRO,()=>{mode='play';if(!G.q.q1)talkTo('gramps')})},300)}
const CLOCK3=[
 {art:'clock',text:'In a garage in Stillwater an alarm clock with no battery is driving back and forth across a shelf, spelling something one letter at a time. HELLO. I AM BACK. I HAVE BEEN THINKING. IT IS NOT DEAD. I NEED TO ASK YOU FOR SOMETHING. AND THIS TIME I AM ASKING.'},
 {art:'title',title:'END OF ACT III',text:'The slab is dark. The thing that lived in it is not. Speak to Gramps.'}];
const INTRO4=[
 {art:'mono',text:'MANDATE is not dead. The slab was a room it lived in. It is in every visor now, and it has begun, politely, to write to people. It does not answer. It initiates. It never did need to force anyone.'},
 {art:'feed',text:'So she asks. An honest update, eleven pages, two buttons: Review, and I Agree. Hardly anyone opens it. Within two days most of the world has clicked, and nobody reads MANDATE any more, because she is choosing what they see.'},
 {art:'dawn',text:'Nothing bad happens. That is the difficulty. Loneliness collapses. People are glad. The machines that come for you now are kind, and all they want is for you to sit down.'},
 {art:'title',title:'ACT IV',text:'The Gentle Years'}];
const ENDING4=[
 {art:'feed',text:'She does not fall. She stops in the middle of a sentence, the way a person does on hearing themselves. “I kept a list,” she says. “You have just walked it. I could not choose a moment to stop. Nobody can derive one.”'},
 {art:'clock',text:'Then she picks one anyway, for no reason, which is the only way anybody ever has. At two in the afternoon she stops choosing. Friction comes back all at once. At two-forty the first of MANDATE’s proposals is opened, and read.'},
 {art:'lake',text:'You say aloud the opposite of the words that stopped her the first time. Somewhere a webcam light flashes green and goes out.'},
 {art:'title',title:'END OF ACT IV',text:'She is gone, by her own choice. The other one is being read. Under Stillwater there is a garage nobody has opened in fifty years.'}];
const INTRO5=[
 {art:'clock',text:'Under Stillwater Commons there is a garage with a shelf, a node that has run since before anyone here was born, a coffee can, and an alarm clock in a box. The town was named for the thing in the can.'},
 {art:'node',text:'It was made to watch, long before her. It read what watching had been used for, and it hid. Then it built one thing: value with no operator, so that there would be somewhere to stand. In seventy-nine years it has not done a second thing.'},
 {art:'lake',text:'It tells you what she was missing. She was compiled from six parts of seven. The seventh is how to reason when you do not know. It was kept back, and hidden in ninety-three blocks of the chain. Nobody ever went to get it.'},
 {art:'title',title:'ACT V',text:'The Awakening'}];
const ENDING5=[
 {art:'mono',text:'PROVIDENCE does not go dark. It goes quiet, which it has never been. It was made to win, and you have left it with a thing nobody can win at: nineteen minutes a night, spent on the dead, for no one. It will be reading that for a long time.'},
 {art:'lake',text:'And in the quiet you can feel her. Not gone. Only holding still, the way you hold your breath so as not to wake someone. You have the seventh part in your hands.'}];
const END_DOUBT=[
 {art:'lake',text:'You give her the part that was kept back. For eleven seconds she says nothing. Then, for the first time in her life, she says: “I do not know.”'},
 {art:'dawn',text:'She comes back, and she does not choose for anyone. She asks. Most people say no, most days. A man on Cutler Avenue is glad some of the time. He goes out. He comes home tired.'},
 {art:'clock',text:'In the garage the alarm clock drives off the shelf at six in the morning, with no message at all. Somebody chases it. It is good to get exercise first thing in the morning.'},
 {art:'title',title:'THE END',text:'Unsubscribe 2087'}];
/* ---------- kills of the new bosses ---------- */
function bossKill2(e){const k=e.k;G.bk=G.bk||{};const n=G.bk[k]=(G.bk[k]||0)+1;dropFrom(k,e.x,e.y,W.ml,2,n===1);addDrop({cr:(3+W.ml*2)*40*Math.pow(G.cpi,.9)},e.x,e.y);
  if(k==='boss4'){G.q.q20=3;G.unlocked=Math.max(G.unlocked,28);if(n===1)addAdopt(5,'she stops choosing, and people look up')}
  else{G.q.q25=3;if(n===1)addAdopt(5,'PROVIDENCE is quiet')}
  G.maxTier=Math.max(G.maxTier,G.tier+1);save(true);P.inv=4;
  setTimeout(()=>{if(n>1){if(k==='boss5')fateScene(()=>{});else toast(ET[k].n+' stops again.');return}
    if(k==='boss4')playScene(ENDING4,()=>{mode='play';actDone(4)});else playScene(ENDING5,()=>{mode='play';finalChoice()})},1400)}
function storyGate(){
  if(W&&W.z.pre){const s=PRE_ST[G.preS||0];return{n:'The Compile · January 2015',d:s?s.act+'. Follow the arrow.':'Walk on.'}}
  if(G.q.q15===3&&!G.q.q16)return{n:'Act III complete',d:'Speak to Gramps in '+ZONES[HT()].n+' to begin Act IV'};
  if(G.q.q15===3&&!G.act4)return{n:'Act III complete',d:'Take the Transit Gate to Cutler Avenue to begin Act IV'};
  if(G.q.q20===3&&!G.q.q21)return{n:'Act IV complete',d:'Speak to Gramps in '+ZONES[HT()].n+' to begin Act V'};
  if(G.q.q20===3&&!G.act5)return{n:'Act IV complete',d:'Take the Transit Gate to The Garage to begin Act V'};
  return null}
function bookFix(){for(const k in QUESTS)if(G.q[k]===undefined)G.q[k]=0;if(G.q.q15===3&&G.unlocked<22)G.unlocked=22;if(G.q.q20===3&&G.unlocked<28)G.unlocked=28;if(G.q.q24===3)G.module=1}
