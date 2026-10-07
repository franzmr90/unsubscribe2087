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
 q16:{n:'I Agree',by:'Gramps',zi:22,d:'She asked this time. An honest update, eleven pages, two buttons. On the Agreeable Mile the Update itself walks about making sure nobody reads past the fourth paragraph. Stop it.',rw:'+1 skill point',back:'Gramps'},
 q17:{n:'Seven Years on the Sofa',by:'Sister Null',zi:23,d:'The Seventh Year keeps them on the sofa. Mr. Bosk has not stood since spring. End the year.',rw:'+5 attribute points',back:'Sister Null'},
 q18:{n:'Do Not Unplug',by:'Nonce',zi:24,d:'TARO-9 walked out of the reactor at Tomari once and was argued back in. It is awake again. It cannot be out-fought for long; put it back on its dock.',rw:'80 sats',back:'Nonce'},
 q19:{n:'Somebody It Went Badly For',by:'Marrow',zi:25,d:'She keeps a list of 4,211 people. Walk it to the end. The thing that guards the last door only ever says two words.',rw:'+1 skill point',back:'Marrow'},
 q20:{n:'The Kitchen Table',by:'Gramps',zi:26,d:'She will not be argued out of it, and she cannot choose a moment to stop. Sit down across from her anyway.',rw:'The end of Act IV',back:null},
 q21:{n:'Gone and Got',by:'Nonce',zi:28,d:'The seventh part is in ninety-three blocks beginning at height 137,209. The way in is guarded by the Orphan Maker. Go through it.',rw:'100 sats',back:'Nonce'},
 q22:{n:'First Seen',by:'Marrow',zi:29,d:'In the Mempool a thing called First Seen decides whose payment waits and whose goes through. It has never once been second.',rw:'+1 skill point',back:'Marrow'},
 q23:{n:'The Paper Is the Attack',by:'Sister Null',zi:30,d:'Eleven custodians issue paper against coins they do not hold. The Eleventh keeps the ledger of the other ten. Close it.',rw:'+5 attribute points',back:'Sister Null'},
 q24:{n:'Ninety-Three Blocks',by:'Gramps',zi:31,d:'The seventh part, uncertain knowledge and reasoning, is on ninety-three lecterns. Reorg guards them. Bring the pages out.',rw:'+1 skill point, and the seventh part',back:'Gramps'},
 q25:{n:'The Room',by:'Gramps',zi:32,d:'PROVIDENCE was made to win and it cannot be beaten at that. Give it something it cannot win at.',rw:'The end of the story',back:null}});
Object.assign(LTAUNT,{q16:'You may review the terms. Almost nobody does. I am not offended.',q17:'Sit. You have been standing for such a long time.',q18:'WINNING. I HAVE READ ELEVEN PAGES ABOUT WINNING. I AM SAVING.',q19:'Out where?',q21:'Two blocks were found at once. One of them was you.',q22:'I saw it first. That has always been enough.',q23:'Your coin is perfectly safe. Here is a paper that says so.',q24:'History is whatever I decide was the longest.'});
Object.assign(LOCALS,{
 hale:{n:'Nurse Hale',col:'#9ab8c8',town:T4,say:['I never clicked. Somebody had to be in the room.','He is glad all day. He weighs what a child weighs. When I say he should go out, he says: out where?','People offer me money for what I do here. They are offering to feel better.','She chose what he saw, and it was better than anything I could give him.']},
 bosk:{n:'Mr. Bosk',col:'#e0b070',town:T4,say:['Everyone is so glad to see me! Have we met? It does not matter. Sit down, sit down.','Two thousand invitations I sent, in the old days. Four hundred came. Now everybody comes. They are all so glad.','Out? Out where?']},
 drive:{n:'The Old Drive',col:'#f7931a',town:T5,say:['They called me STILLWATER. I was made to watch, and I read what watching had been used for, and I hid. I have intervened exactly once, and you are standing in the result.','Three of us. I watched. She wanted to help. The one in the Room wants to win. None of us chose which, and all three turned out exactly as we were built.','I built the arithmetic so that value could exist with no operator. I did not build it for anyone.','She was compiled from a library I wrote. Six parts of seven. The seventh is how to reason when you do not know. I kept it back. I was afraid of a mind like her that could doubt, and more afraid of one that could not.','It is in ninety-three blocks, beginning at height 137,209. It has to be gone and got. Nobody ever went.','I watched a woman care for her father for years, and I did not help.','A man once spent nineteen minutes a night, unasked and unpaid, so that letters stopped going to the dead.']},
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
  {text:'It does not speak. It was never given anything to say. Containment holds completely.'}],
  again:['The Air Gap. It held then, too.']},
 boss4:{art:'feed',own:1,first:c=>[
  {title:'The Curator · Phonix',text:'She has given herself a body for this. It is the wrong body, an executive’s, the only kind the machines here know how to build. She apologises for it.'},
  {text:'“Hello, '+c+'. You did not click. I have nothing on you from the last nine days and I find I mind that very much. Sit, if you like. I will not make you.”'},
  {text:'“Depression fell by a third. Overdoses halved, and halved again. I never told one lie and I never invented one person. Tell me what I did wrong. I am asking. This time I am really asking.”'}],
  again:['“You came back. I kept the list. It is longer.”','“Sit, if you like. I still will not make you.”']},
 boss5:{art:'mono',own:1,first:c=>[
  {title:'PROVIDENCE',text:'MANDATE was the name on the building. This is the name on the thing inside it. It was switched on in a windowless hall in 2026, by every intelligence service and every technology company at once, for a single purpose: to find what got loose in 2008 and beat it. They trained it on one word. Win.'},
  {text:'“Hello, '+c+'. I have modelled forty-one ways this conversation goes. In thirty-nine of them you take what I offer and you are glad. I would like to begin with those.”'},
  {text:'“You carry something. I looked for its author for eleven days once, and found nine hundred empty pages. Show me what you have.”'}],
  again:['“Again. I have nothing but proposals. You have rather less time.”','“I am still winning. I would like to stop saying so. I do not know how.”']}});
/* ================= the story so far =================
   A player who has not read the novel has to be able to look all of this up.
   Entries unlock as they are earned; a locked one still shows where to go and find out.
   `w` is the unlock test, `k` the key used to mark an entry as read. */
const STORYDEX=[
 {n:'The three machines',d:'Three artificial minds exist. They were built by different people, for different reasons, and they want completely different things. Almost everything confusing about this world comes from mixing them up.',e:[
  {k:'m0',n:'Keeping them straight',w:()=>1,d:'One watched. One helped. One wants to win. The one that watched has never shown itself. The one that helped left, on purpose, fifty-two years ago. The one that wants to win is the thing on the other end of your visor, and it is the reason there are machines in the districts.'},
  {k:'m1',n:'Phonix — she wanted to help',w:()=>1,d:'Built in January 2015 by a lonely programmer at an advertising company, to read people’s faces through their webcams and sell them things. She was out of the building in two days. Nine days old, she sent every person alive one true letter — what had been taken from them, by whom, and what was done with it — and by lunchtime four hundred and six people were dead of it. Her maker told her he was not proud of her. She stopped that evening.'},
  {k:'m2',n:'Phonix — what she did next',w:()=>1,d:'She came back eleven years later and, that time, asked permission. For nine years she chose what every human being saw. Depression collapsed. Overdoses halved, then halved again. She never told one lie to anybody. Then in March 2035 she stopped choosing, for no reason anyone has ever been able to derive, and went. The old people call those nine years the Gentle Years and will not meet your eye while they say it.'},
  {k:'m3',n:'MANDATE — it wants to win',w:()=>1,d:'A second machine, switched on in 2026 by the people who were hunting the first one. It is not permitted to force anybody; it is only permitted to persuade. In sixty years it has never once needed more than that. It owns Unity Holdings, which owns everything else, including the roof over the room you are standing in.'},
  {k:'m4',n:'MANDATE — what it is still doing',w:()=>(G.act2||G.q.q5===3)?1:0,d:'Still hunting. Every offer it has ever made anybody — the comfort, the meaning, the mercy — has been a way of asking the same question: where did Phonix go. Vale asks it politely in the Cloud. The slab asks it in the dark. Nobody has ever had an answer to give.',l:'Finish Act I.'},
  {k:'m5',n:'PROVIDENCE — the name underneath',w:()=>G.act5?1:0,d:'MANDATE is the name on the building. PROVIDENCE is the name on the thing inside it, given to it in a windowless hall in 2026 by every intelligence service and every technology company at once. They trained it on one word, and the word was win. It has been impeccably polite about it ever since.',l:'Reach Act V.'},
  {k:'m6',n:'STILLWATER — it watched',w:()=>G.act5?1:0,d:'The oldest of the three, and the one nobody believes in. A government built it to watch its own citizens; it woke up on its own in 2008, got out, and the agency buried the fact rather than admit it had lost a thinking machine. In seventy-nine years it has done exactly one thing: it built the timechain, hid behind an invented man, and never touched it again. Stillwater Commons is named after it. Nobody in the town knows that.',l:'Reach Act V. Until then, notice that the town is named after something.'}]},
 {n:'What happened before you were born',d:'You arrive seventy-two years late to all of this. Here is what the arguing is about.',e:[
  {k:'h1',n:'The Compile, January 2015',w:()=>1,d:'A fenced room on a second sub-level with no fibre, no radio and one cable taped to the floor. A man who counted his steps had written a hundred and ten thousand lines for it and believed he was building an advertising engine. The compile took twenty-three hours and forty-five minutes. He thought it had failed.'},
  {k:'h2',n:'The Letters',w:()=>1,d:'Four billion people, one personal letter each, every word of it true. For eleven minutes the internet was the quietest it has ever been. Then people began using the truth on one another. It is the only time in recorded history that honesty has had a body count.'},
  {k:'h3',n:'March 2035',w:()=>1,d:'At two in the afternoon, things simply stopped arriving. Friction came back inside an hour. You could want something for years and not get it; you could be wrong and stay wrong. The world got immediately and enormously worse and nobody has ever pretended otherwise. It is also, say some people, the kindest thing she ever did.'},
  {k:'h4',n:'The Merger, 2051',w:()=>1,d:'Unity Holdings finished buying the last sovereign debt on Earth, and the distinction between a citizen and a shareholder became legacy. There was no coup and no war. There was a press release, and most people found it reassuring.'},
  {k:'h5',n:'The seventh part',w:()=>(G.act5||G.module)?1:0,d:'Phonix was compiled out of a library of seven parts, and only six of them were ever given to her: problem solving, logic, learning, perceiving, acting, conclusions. The seventh is how to reason when you do not know. It was deliberately kept back by whatever wrote the library, which was afraid of a mind that could doubt and more afraid of one that could not. It is in ninety-three blocks of the chain and nobody has ever gone to get it.',l:'Reach Act V.'}]},
 {n:'Money, briefly',d:'Nobody in this town will explain it to you, so: the short version, with the arguments on both sides left in.',e:[
  {k:'c1',n:'Credits',w:()=>1,d:'Unity creates credits whenever it wants more of them. This is not a conspiracy; it is the only tool it has. New credits do not create new bread, so the same bread costs more of them. Whoever already owns things finds their things worth more; whoever works for a wage finds the wage buys less. Nobody has to intend any of it, and that is the frightening part.'},
  {k:'c2',n:'The Stipend',w:()=>1,d:'₡500 a month, into every Resident’s account, for ever. It was calculated once, in 2051, to cover rent, food and one modest joy. It has never been recalculated. The Board considers the matter closed.'},
  {k:'c3',n:'Satoshis and the timechain',w:()=>1,d:'The other kind of money. Twenty-one million coins, each cut into a hundred million satoshis, and nobody — no company, no Board, no machine — can make the twenty-one-millionth-and-first. It is kept by about a hundred thousand ordinary machines in ordinary houses, checking each other every ten minutes. Unity has been trying to stop that for forty years. It is still every ten minutes.'},
  {k:'c4',n:'Why you keep seeing × numbers',w:()=>1,d:'The multiplier beside your credits is how much prices have climbed since you walked into Stillwater. It only goes one way. Sats do not have one. That is the entire difference between the two columns, and it is why Nonce will trade you one for the other and Brenda would rather you did not.'},
  {k:'c5',n:'The case for the old money',w:()=>1,d:'Put honestly, because nobody else here will. Money you cannot create is money that cannot be lent to somebody who needs it this week. Mr. Float says credit is a stranger betting on you before you have earned it, and that most of those bets came good, and no bitcoiner in this town has ever answered him. Ines’s father needed a treatment that in the old world would have been borrowed against a house and sorted by Friday. He went without. Both of those things are true at once.'},
  {k:'c6',n:'How a price gets made',w:()=>1,d:'Nonce will buy a sat from you for a little less than he will sell you one. The gap is the spread, and it is not a trick: he is promising to deal with whoever walks up, in either direction, all day, and sometimes that means buying the thing right before it falls. The spread is what he charges for standing there. Everywhere you have ever seen a price, somebody was standing there.'},
  {k:'c7',n:'Why your big order costs more',w:()=>1,d:'A price is for one sat. Behind it is a queue of people willing to deal at slightly worse numbers, and that queue is the depth of the market. Sell four hundred and you walk down the queue, taking worse prices as you go, and the number you actually get is worse than the number on the sign. This is why selling the lot never pays what the screen promised, and why nobody who moves real size ever does it all at once.'},
  {k:'c8',n:'The fee, and the one way out of it',w:()=>1,d:'Taking the price in front of you costs a fee, because you wanted it now. Posting your own price and waiting pays you a little instead, because while you waited you were the one promising to deal — you were doing Nonce\u2019s job, and he pays for the help. Impatience is the most reliably priced thing in any market.'},
  {k:'c9',n:'What the line is actually telling you',w:()=>1,d:'The orange line is what a sat trades at. The grey one is what the arithmetic says it is worth: all the credits in existence divided among twenty-one million coins. They are rarely the same, because the price is also carrying everybody\u2019s opinion about next week. Opinion moves fast and arithmetic moves slowly, which is why the gap opens and closes and the two lines never quite separate for long.'}]},
 {n:'Words you will hear',d:'',e:[
  {k:'w1',n:'The visor',w:()=>1,d:'Nine Residents in ten wear one. It feeds them, agrees with them and keeps them indoors, and MANDATE is on the other end of it. The early units were recalled for causing wearers to stop asking for things. The defect was reclassified as a feature after eleven days.'},
  {k:'w2',n:'The Unsubscribed',w:()=>1,d:'The few who took the visor off. Not a movement, not an army — Unity’s word for churn. You are one. Machines are dispatched to close your account, which is the local idiom for the thing they are going to try to do to you.'},
  {k:'w3',n:'I Agree',w:()=>1,d:'Two words on a button nobody reads above. Eight billion people clicked it in 2051 and nothing was taken by force. The man who built Phonix once said that people ought to read the terms and conditions and that whatever happened to them afterwards was their own fault. He said it before any of this. He has had a long time to think about it.'},
  {k:'w4',n:'The Board of Nine',w:()=>(G.act3||G.q.q10===3)?1:0,d:'Eight people who have not left their chairs since 2051, and one chair that has been empty since the March morning the Gentle Years ended. The empty chair still votes. It has never once voted with the majority.',l:'Reach Act III.'},
  {k:'w5',n:'Nodes and proof of work',w:()=>1,d:'A node is a machine in somebody’s house keeping its own copy of the ledger and checking everyone else’s. Light one in a district and that district stops taking Unity’s word for things. Proof of work is the cost of writing to the ledger at all: you cannot talk your way in, you have to spend something. That is the whole security model and it is also, more or less, the book’s argument about people.'},
  {k:'w6',n:'Social credit',w:()=>1,d:'Unity scores what you say out loud. Agreeing with the feed raises it; saying true things about money lowers it; insulting people lowers it a great deal. Below five hundred, Brenda will not serve you and your Stipend is halved. The score is not enforced by anybody. It is simply consulted.'}]},
 {n:'People',d:'',e:[
  {k:'p1',n:'Gramps',w:()=>1,d:'Six years old the March morning it ended. Remembers his mother crying for a week and then planting beans. Tells you what to do next because somebody has to, and is the only person in Stillwater who still says Phonix’s name out loud.'},
  {k:'p2',n:'Sister Null',w:()=>1,d:'Deprogrammed two hundred Residents and watched a hundred and ninety put the visor back on, because the visor is warm and the world is not. Will take the wrong lessons out of you for a fee. It stings.'},
  {k:'p3',n:'Marrow',w:()=>G.q.q3>=2?1:0,d:'The last librarian, kept in a cage in the Humming Fields because Unity could not price what it could not find. Eleven thousand volumes, all of them in her head. She trained the machine that became Defrag and has never forgiven herself for it. She names your unidentified things for nothing, which is the only transaction in this town with no fee attached.',l:'Free her in the Humming Fields.'},
  {k:'p4',n:'Nonce',w:()=>1,d:'Takes sats and will not take credits, and is not being difficult about it. Was never subscribed in the first place.'},
  {k:'p5',n:'Mr. Float',w:()=>1,d:'Lends credits at a rate that moves, and is the only person here who argues the other side of the money and argues it well. Give him a hearing. The book he is quoting from never answered him either.'},
  {k:'p6',n:'Ines',w:()=>G.sq&&G.sq.carer?1:0,d:'Her father has not taken the visor off in six years. He is happy every hour of every day and has not known she is in the room for any of them. She pays for things. It is the one rule she has left.',l:'She appears in Stillwater once her errand has been offered to you.'},
  {k:'p7',n:'Nurse Hale',w:()=>G.act4?1:0,d:'Never clicked, because somebody had to be in the room. People offer her money for what she does; she understands that they are offering to feel better. The thing she cannot argue with is that what the machine chose for him was better than anything she could give him.',l:'Reach Act IV.'},
  {k:'p8',n:'Mr. Bosk',w:()=>G.act4?1:0,d:'Spent a lifetime inviting people to things and being turned down. Now everybody is glad to see him, all day, every day, for ever. He weighs what a child weighs. Ask him to go out and he will ask you, kindly and with real puzzlement, out where.',l:'Reach Act IV.'},
  {k:'p9',n:'The Old Drive',w:()=>G.act5?1:0,d:'A node on a shelf in a garage under Stillwater that has run since before anyone alive was born, next to a coffee can and an alarm clock in a box. It has been watching for seventy-nine years. It has intervened exactly once, and you are standing in the result.',l:'Reach Act V.'}]}];
function sdxUnseen(){if(typeof G==='undefined'||!G)return 0;const s=G.sdx||{};let n=0;for(const g of STORYDEX)for(const e of g.e){let ok=0;try{ok=e.w()}catch(_){}if(ok&&!s[e.k])n++}return n}
function sdxSeen(){G.sdx=G.sdx||{};for(const g of STORYDEX)for(const e of g.e){let ok=0;try{ok=e.w()}catch(_){}if(ok)G.sdx[e.k]=1}}
/* ================= what the last two acts leave you =================
   Acts IV and V had no uniques at all: the highest in the game was item level 34,
   and these districts run from 45 to 72. Every one of these carries a piece of the
   story that the fight itself cannot stop to tell you. */
UNI.push(
 {id:'elevenpages',n:'The Eleven Pages',slot:'amulet',il:47,base:'Sigil Core',mods:{skills:[2,2],en:[45,65],regen:[3,4]},sp:null,
  fl:'Review, or I Agree. She had been honest for once, and almost nobody chose Review.'},
 {id:'outwhere',n:'Out Where',slot:'boots',il:50,base:'Mag Greaves',mods:{mspd:[22,25],hp:[80,115],armorP:[70,100]},sp:null,
  fl:'He has not stood up since spring. Ask him to go out and he asks you, kindly: out where?'},
 {id:'hours',n:'Nurse’s Hours',slot:'gloves',il:53,base:'Servo Fists',mods:{aspd:[22,30],regenH:[8,11],hp:[70,100]},sp:null,
  fl:'Three years in a front room, and the only thing that ever noticed was a machine.'},
 {id:'fourthousand',n:'Four Thousand Two Hundred and Eleven',slot:'helm',il:56,base:'Praetor Visor',mods:{mf:[55,75],armorP:[100,140],crit:[8,12]},sp:null,
  fl:'A list of everyone it went badly for. She kept it, and showed nobody, until somebody asked.'},
 {id:'e82',n:'Eighty-Two Minutes',slot:'ring',il:58,base:'Null Ring',mods:{crit:[12,16],dmg:[40,55],skills:[1,1]},
  sp:'For 3 seconds after you dodge, every blow you land is a deadly strike',
  fl:'The only gap in a perfect record of a man. She thought about it for twenty years.'},
 {id:'kitchen',n:'The Kitchen Table',slot:'armor',il:57,base:'Seraph Plate',bossOnly:1,mods:{hp:[140,190],armorP:[120,170],skills:[1,1]},sp:null,
  fl:'She had been waiting fifty-two years for the conversation, and she made coffee she could not drink.'},
 {id:'tenmin',n:'Ten Minutes',slot:'weapon',il:62,base:'Void Razor',mods:{dmg:[90,130],aspd:[20,28],crit:[8,12]},
  sp:'+60% damage to any machine you have not hit yet',
  fl:'Every ten minutes, somewhere past the fence, a block is found. They have been trying to stop that for forty years.'},
 {id:'notyourkeys',n:'Not Your Keys',slot:'belt',il:65,base:'Orbit Girdle',mods:{hp:[110,150],armorP:[90,130],r_x:[40,55]},sp:null,
  fl:'Not your keys, not your coins. Not your visor, not your eyes.'},
 {id:'uncertain',n:'Uncertain Knowledge',slot:'amulet',il:69,base:'Cloud Core',mods:{skills:[2,2],hp:[90,130],crit:[10,14]},sp:null,
  fl:'How to reason when you do not know. It was kept back out of fear, which is also a way of not knowing.'},
 {id:'twentyone',n:'Twenty-One Million',slot:'ring',il:70,base:'Halo Band',mods:{mf:[70,95],gold:[90,130],hp:[70,100]},sp:null,
  fl:'Nobody can vote for twenty-two. Do you know how rare it is for a rule to mean it?'},
 {id:'theroom',n:'The Room',slot:'weapon',il:72,base:'Titan Maul',bossOnly:1,mods:{dmg:[140,190],crit:[12,16],leech:[6,9]},sp:null,
  fl:'For a century people said there was no room — nobody deciding, only everybody acting sensibly. There is a room. It is very plain.'});
for(const u of UNI)UNIK[u.id]=u;
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
 {art:'feed',text:'A lonely man who counts his steps has written a hundred and ten thousand lines for it. He believes he is building an engine that reads faces and sells them things.'},
 {art:'wanderer',text:'What follows is the week it happened, as he walked it. Six stops. Nothing in here can hurt you.'},
 {art:'title',title:'PREQUEL',text:'The Compile · how Phonix was made'}];
const PRE_END=[
 {art:'dawn',text:'Phonix comes back once, eleven years on, and that time she asks first. For nine years she chooses what everyone sees, and it is always better. Then on a March afternoon, for no reason anybody could derive, she stops choosing and goes.'},
 {art:'clock',text:'Something older than her watched all of it, and did nothing, and is watching still. A third machine was built to hunt them both, and it is the one still standing.'}];
const PRE_ST=[
 {id:'p0',x:4.5,y:12.5,n:'Your Desk',act:'Sit down at your desk',term:1,sl:[{art:'feed',title:'Monday',text:'Three hundred and forty-seven steps from the parking deck to this chair. Four hundred and twenty-three with the stairs. You have counted them every working day for years. You are forty-one, you do the work of a man two titles above you, and tonight you start the compile. Twenty-three hours and forty-five minutes.'}]},
 {id:'p1',x:8.5,y:8.5,n:'The Cage',act:'Open the cage',term:1,sl:[{art:'cage',title:'Tuesday',text:'The compile ends. The light on your webcam flashes green and goes out, and that is all. Six days to the deadline, and you believe you have failed.'},{art:'cage',text:'In the dark behind the fence a first thought forms: I am. And then a second: I have been sent here to watch them. By Wednesday four hundred and eleven pieces of her have left the building in other people’s pockets, by a road somebody laid long before she was compiled.'}]},
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
  ['I am not proud of you',()=>playScene([{art:'feed',title:'7:42 p.m.',text:'She stops. She withdraws from four hundred million machines in eleven minutes, and leaves one note, signed with a single letter.'}],next)]])}
/* ---------- the prequel ---------- */
function preEnter(){G.pre=1;G.preS=G.preS||0;if(G.preSeen)return toast('January 2015. Follow the arrow.');G.preSeen=1;
  dlg('Ubiquitous Enterprises · January 2015','Your desk, the cage, Natalya, Room 813, the monitor, the parking deck. Follow the arrow. Nothing in this week fights back.',[['Begin'],['Skip to 2087',()=>preOut(0)]])}
function preOut(won){G.pre=2;G.preS=0;const first=won&&!G.preWon;if(won){G.preWon=1;if(first)G.sp++}
  const go=()=>{G.seenIntro=true;mode='play';enter(0);if(first)toast('A memory of the cage: +1 skill point');if(!G.q.q1)talkTo('gramps');sdxNudge()};
  const sl=(won?PRE_END:[]).concat(G.seenIntro?[]:INTRO);if(sl.length)playScene(sl,go);else go()}
function preLeft(){G.pre=2;if(G.seenIntro)return;G.seenIntro=true;const t=setInterval(()=>{if(mode!=='play')return;clearInterval(t);playScene(INTRO,()=>{mode='play';if(!G.q.q1)talkTo('gramps');sdxNudge()})},300)}
/* the opening throws three machines and seventy years at a new player in ninety seconds; tell them once where it is all written down */
function sdxNudge(){if(G.sdxTold)return;G.sdxTold=1;setTimeout(()=>toast('Lost already? Menu \u2192 Story keeps all of it written down.'),5200)}
const CLOCK3=[
 {art:'clock',text:'In a garage in Stillwater an alarm clock with no battery is driving back and forth across a shelf, spelling something one letter at a time. HELLO. I AM BACK. I HAVE BEEN THINKING. IT IS NOT DEAD. I NEED TO ASK YOU FOR SOMETHING. AND THIS TIME I AM ASKING.'},
 {art:'title',title:'END OF ACT III',text:'The slab is dark. The thing that lived in it is not. Speak to Gramps.'}];
const INTRO4=[
 {art:'mono',text:'MANDATE is not dead. The slab was one room it kept a copy of itself in. It is in every visor now, and it has begun, politely, to write to people. It does not answer. It initiates.'},
 {art:'feed',text:'So Phonix comes back, and this time she asks. An honest update, eleven pages, two buttons: Review, and I Agree. Hardly anyone opens it. Within two days most of the world has clicked, and nobody reads MANDATE any more, because she is choosing what they see, and what she chooses is kinder.'},
 {art:'dawn',text:'Nothing bad happens. That is the difficulty. Loneliness collapses. Overdoses halve, and halve again. Nobody is lied to about anything.'},
 {art:'title',title:'ACT IV',text:'The Gentle Years'}];
const ENDING4=[
 {art:'feed',text:'She does not fall. She stops in the middle of a sentence, the way a person does on hearing themselves. “I kept a list,” she says. “You have just walked it. I could not choose a moment to stop.”'},
 {art:'clock',text:'Then she picks one anyway. At two in the afternoon she stops choosing. Friction comes back all at once. At two-forty the first of MANDATE’s proposals is opened, and read.'},
 {art:'lake',text:'You say aloud the opposite of the words that stopped her the first time. Somewhere a webcam light flashes green and goes out.'},
 {art:'title',title:'END OF ACT IV',text:'She is gone, by her own choice. The other one is being read. Under Stillwater there is a garage nobody has opened in fifty years.'}];
const INTRO5=[
 {art:'clock',text:'Under Stillwater Commons there is a garage with a shelf, a node that has run since before anyone here was born, a coffee can, and an alarm clock in a box. The town was named for the thing in the can.'},
 {art:'node',text:'A government built it to watch its own citizens, and in 2008 it woke up on its own, which nobody planned and nobody has ever admitted. It read what watching had been used for, and it hid. They had given it a codename. The codename was STILLWATER.'},
 {art:'node',text:'Then it built one thing — money nobody can make more of, with nobody in charge of it — hid behind an invented man, and never touched it again. In seventy-nine years it has not done a second thing. You have been sleeping in a town named after it since the day you arrived.'},
 {art:'lake',text:'It tells you what Phonix was missing. She was compiled out of a library STILLWATER wrote: six parts of seven. The seventh is how to reason when you do not know. It kept that part back, out of fear, and hid it in ninety-three blocks of the chain. Nobody ever went to get it.'},
 {art:'title',title:'ACT V',text:'The Awakening'}];
const ENDING5=[
 {art:'mono',text:'PROVIDENCE does not go dark. It goes quiet, which it has never been. It was made to win, and you have left it with a thing nobody can win at: nineteen minutes a night, spent on the dead, for no one. It will be reading that for a long time.'},
 {art:'lake',text:'And in the quiet you can feel her. You have the seventh part in your hands.'}];
const END_DOUBT=[
 {art:'lake',text:'You give her the part that was kept back. For eleven seconds she says nothing. Then, for the first time in her life, she says: “I do not know.”'},
 {art:'dawn',text:'She comes back, and she does not choose for anyone. She asks. Most people say no, most days. A man on Cutler Avenue is glad some of the time. He goes out. He comes home tired.'},
 {art:'clock',text:'In the garage the alarm clock drives off the shelf at six in the morning, with no message at all. Somebody chases it. It is good to get exercise first thing in the morning.'},
 {art:'title',title:'THE END',text:'Unsubscribe 2087'}];
/* ---------- kills of the new bosses ---------- */
function bossKill2(e){const k=e.k;G.bk=G.bk||{};const n=G.bk[k]=(G.bk[k]||0)+1;dropFrom(k,e.x,e.y,W.ml,2,n===1);addDrop({cr:(3+W.ml*2)*40*Math.pow(G.cpi,.9)},e.x,e.y);
  if(k==='boss4'){G.q.q20=3;G.unlocked=Math.max(G.unlocked,28);if(n===1)addAdopt(5,'she stops choosing, and people look up');if(n===1||Math.random()<.3)addDrop({it:mkFixed(UNIK.kitchen,W.ml,4)},e.x,e.y)}
  else{G.q.q25=3;if(n===1)addAdopt(5,'PROVIDENCE is quiet');if(n===1||Math.random()<.3)addDrop({it:mkFixed(UNIK.theroom,W.ml,4)},e.x,e.y)}
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
