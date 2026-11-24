/* ================= util ================= */
const $=id=>document.getElementById(id);
const rnd=(a,b)=>a+Math.random()*(b-a), ri=(a,b)=>Math.floor(rnd(a,b+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const pct=x=>Math.round(x*100)+'%';
const UNITS=['','K','M','B','T','Qa','Qi','Sx','Sp','Oc','No','Dc'];
function fmt(n){let i=0;while(n>=1000&&i<UNITS.length-1){n/=1000;i++}return '₡'+(i?n.toFixed(n<10?2:n<100?1:0):Math.floor(n))+UNITS[i]}
function wpick(pairs){let s=0;for(const p of pairs)s+=p[1];let r=Math.random()*s;for(const p of pairs){r-=p[1];if(r<=0)return p[0]}return pairs[0][0]}
/* A shared district swaps Math.random only for the draw. Combat, loot and shops outside
   that draw keep the ordinary one. Solo play never sets a seed, so it is unchanged. */
let mapShared=false;
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296}}
function withMapRng(seed,fn){if(seed==null)return fn();const prev=Math.random,was=mapShared;Math.random=mulberry32(seed>>>0);mapShared=true;try{return fn()}finally{Math.random=prev;mapShared=was}}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ================= classes and skill trees =================
   Three columns. Rows open at levels 1, 4, 9, 26 and 51.
   Each skill needs one point in the skill above it. Where a skill scales, it gains +6% per point in that skill.
   Rows 4 and 5 are that class's own skills. */
const ROWREQ=[1,4,9,26,51];
/* CLS, the classes and their trees, is baked from data/classes.tsv and data/skills.tsv
   into src/skills.js. Edit the sheets. */
/* Hireling damage types, and the resist they bring before the difficulty cut.
   Bodyguard: Impact. A reprogrammed Enforcer still hits with the body.
   Sysadmin: Surge. The shot is overvoltage from a console.
   Node Runner: Impact. The rifle is a physical round. Sound stays with the Maximalist, because Sound ignores monster resists.
   Stray Hound: Rust. The bite corrodes, the same way a homesteader stray does.
   res is [base, per level], added as base+per*level, then the same penalty and -100..75 clamp as the player.
   The armor you hand them does not roll into this. Thorns the player deals back are Impact. Garden Leave stays an untyped curse. */
const MERCS={guard:{n:'Bodyguard',d:'A reprogrammed Enforcer. Machines attack it before you.',hpM:1.8,dM:1,ivl:1,range:1.3,spd:4.6,taunt:1,col:'#7d8ba3',dt:'impact',res:{impact:[6,1],surge:[2,1],rust:[2,1],heat:[2,1],noise:[2,1]}},
 sys:{n:'Sysadmin',d:'Shoots from range, patches your wounds every few seconds and tops up your energy.',hpM:1,dM:.6,ivl:1.2,range:5.5,spd:4.4,col:'#59c0a0',dt:'surge',res:{impact:[1,1],surge:[8,1],rust:[1,1],heat:[1,1],noise:[1,1]}},
 node:{n:'Node Runner',d:'A Bitcoiner with a long rifle. You find 50% more satoshis.',hpM:1.1,dM:1.15,ivl:.8,range:6,spd:4.4,col:'#f7931a',dt:'impact',res:{impact:[4,1],surge:[1,1],rust:[1,1],heat:[1,1],noise:[6,1]}},
 hound:{n:'Stray Hound',d:'Fast and vicious. Pulls credits and satoshis to you from a distance.',hpM:1.2,dM:.8,ivl:.5,range:1.1,spd:6,col:'#8a6a4a',dt:'rust',res:{impact:[4,1],surge:[1,1],rust:[8,1],heat:[1,1],noise:[1,1]}},
 reyn:{n:'Reyn',d:'I used to be the marine. Then the marine got a visor. The visor is still employed.',hpM:1.45,dM:.95,ivl:1.05,range:1.45,spd:4.7,taunt:0,col:'#8a7a62',dt:'impact',res:{impact:[5,1],surge:[2,1],rust:[3,1],heat:[2,1],noise:[2,1]}}};
const MNAMES=['Kit','Juno','Ox','Vesper','Tallow','Rook','Sable','Finch'];
const ATTR={mgt:['Might','+1.5% damage per point'],ref:['Reflex','+0.3% deadly strike and +1 armor per point'],vit:['Vitality','+4 life per point'],bnd:['Bandwidth','+3 energy per point']};

/* ================= monsters ================= */
/* ET lives in data/monstats.tsv, baked to src/monstats.js. */
var ZADJ=['','Rusted','Polished','Wired','Sanctioned','Gilded','','Greased','Pruned','Drowned','Liveried','Seraphic','Vested','Minuted','Seated','Ninth','Still'];
const isBoss=k=>k==='boss'||k==='boss2'||k==='boss3'||k==='boss4'||k==='boss5'||k==='gap';
const MODS={fast:'Extra Fast',strong:'Extra Strong',shield:'Shielded',arc:'Arc Enchanted',boom:'Volatile',leech:'Siphoning'};
const CN1=['Rust','Gloom','Static','Grime','Null','Bolt','Ash','Wire','Slag','Dread'],CN2=['gnash','maw','fang','shard','spike','grinder','wretch','claw','howl','rivet'],CN3=['the Unbilled','the Overdue','the Repossessor','the Downsizer','the Compliant','the Collector','the Unpaid','the Tireless'];

/* ================= drop tables =================
   Each kill makes `picks` rolls. A roll lands on nothing, credits, an item or a stim by weight.
   Each item then checks quality in order: unique, set, rare, magic. `q` holds the "1 in N" odds.
   Magic find raises those odds, with diminishing returns on unique, set and rare. */
/* TC lives in data/treasure.tsv, baked to src/treasure.js. */
const MFK={u:250,s:500,r:600};
function qChance(tc,mf){const o={},q=TC[tc].q;for(const k of['u','s','r','m']){const eff=k==='m'?mf:mf*MFK[k]/(mf+MFK[k]);o[k]=Math.min(1,(1/q[k])*(1+eff/100))}return o}
const SLOTW={weapon:18,helm:12,armor:12,gloves:12,boots:12,belt:12,ring:12,amulet:10};

/* ================= items ================= */
const SLOTS=['weapon','helm','armor','gloves','boots','belt','ring','amulet'];
const SNAME={weapon:'Weapon',helm:'Helm',armor:'Armor',gloves:'Gloves',boots:'Boots',belt:'Belt',ring:'Ring',amulet:'Amulet'};
const ICON={
 weapon:'M5 19l2 2 3-3 1 1 1-1-1-1 9-9V5h-3l-9 9-1-1-1 1 1 1z',
 helm:'M4 15a8 8 0 0116 0v4h-5v-5h-2v5h-2v-5H9v5H4z',
 armor:'M6 4l3 2h6l3-2 4 4-3 3v9H5v-9L2 8z',
 gloves:'M7 21v-7l-3-3 2-2 3 2V4h2v6h1V3h2v7h1V5h2v9l-1 7z',
 boots:'M8 3h6v10l6 4v4H6V3z',
 belt:'M2 9h20v6H2zM9 7h6v10H9zM11 10h2v4h-2z',
 ring:'M12 7a7 7 0 100 14 7 7 0 000-14zm0 3a4 4 0 110 8 4 4 0 010-8zM9 2h6l1 4H8z',
 amulet:'M5 3c0 7 4 9 7 10 3-1 7-3 7-10h-2c0 5-3 7-5 8-2-1-5-3-5-8zM12 13l3.5 4-3.5 5-3.5-5z',
 charm:'M6 2h12v5H6zM4 8h16v13H4zM8 11h8v2H8zM8 15h5v2H8z',
 stim:'M9 2h6v3l2 3v11a3 3 0 01-3 3h-4a3 3 0 01-3-3V8l2-3zm1 2h4v2h-4z'};
const svgIcon=s=>`<svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="${ICON[s]}"/></svg>`;
const STIM={pack:'A stim. The belt drinks it. The pack only carries the extra.',move:'Move to belt',keep:'A stim stays until the belt has room.',pick:'Choose a stim in the pack.',belt:'A stim in the pack moves here when the belt has room: drag it, double-tap it, or choose Move.'};
const SCE={
 relay:'You must subscribe additional relays. The free tier covers four.',
 stim:'Stimpacks.',
 pack:'That was the pack.',
 sats:'Need more sats.',
 vapour:'Not enough vapour.',
 hello:'En tariff.',
 helloBtc:'En tariff, executor.',
 spread:'En tariff, and mind the spread.',
 wait:'Wait',
 leave:'Leave',
 who:'A man in a coat',
 seen:'The stipend has seen you.',
 early:'You are early, which is a kind of fast.',
 say:'Say it',
 hint:'A line for the machine',
 stipend:'show me the stipend',
 note:'operation crawl',
 short:'Not enough sats'};
const ARC={
 reynN:'Reyn',
 unemployed:'unemployed',
 hireJoin:'Reyn joins you. He wants the money in credits.',
 door:'I have been in. The man at the desk did not have to raise his voice. I am not going in to hear it twice.',
 took:'Did you take the offer?',
 tookY:'Yes',
 tookN:'No',
 dog:'Dog.',
 sixDog:'Six dogs.',
 hands:'He lowers his hands. They are people.',
 told:'I used to be the one who told them.',
 lookFine:'They look fine. That was the job, at the end. Making it look fine.',
 stayDown:'That one can stay down.',
 grief:'grief, excessive, collected',
 griefAsk:'Read it. Do not burn it.',
 number:'The Number',
 numberFl:'The visor is still employed. He is not.',
 pell:'Pell',
 pellLine:'Reyn used to walk this row the other way. He collected the fine. Then he stopped.',
 visor:'The Visor Still Employed',
 fine:'The visor collects the fine. Reyn will not.',
 promo1:'They called him watchman. He refused the word.',
 promo2:'They called him marine. He refused the word.',
 promo3:'They called him sergeant. He refused the word.',
 promo4:'They called him marshal. He refused the word.',
 promo5:'They called him marshal. He said unemployed, and nobody corrected him.',
 satAsk:'Pay him one sat, once. He will laugh.',
 satPaid:'He keeps the credit price. The sat was the point.',
 satPoor:'You do not have the sat.',
 queenT:'The Queen of Margins',
 queenB:'They promoted her once, and the promotion grew edges. People who liked the first version still ask for it. The version that remained is better at the job and worse at being asked.',
 draft:'Draft One',
 discontinued:'That version is discontinued.',
 ives:'Ives',
 ivesAsk:'Are you here for the old brochure? I liked Draft One. I can take you to the minutes.',
 ivesGo:'Take me to the minutes',
 ivesStay:'Not today',
 first:'The First Version',
 easyChair:'The offer is an easy chair.',
 easyFine:'The offer is an easy fine.',
 easyName:'The offer is an easy name.',
 off:'The offer misses.',
 decline:'Decline',
 which:'Which draft should the building keep?',
 fileOne:'File Draft One',
 fileNone:'File neither',
 kindAsk:'The kind voice asks for something you would have given the cruel one.',
 giveIt:'Give it',
 stayed:'Then she remains the one who stayed.',
 margin:'The Margin',
 marginFl:'The blades are the terms.',
 good:'She is good at the work.',
 kind:'She is kind about the work.',
 delighted:'She is delighted for you.',
 mileOne:'A resident is happy in Draft One’s tone.',
 mileSofa:'It is just another sofa.',
 sixN:'Six before the minute',
 sixCard:'Pay is bad. They will be here before you are dressed.',
 sixTake:'Turn in the clock',
 sixPay:'A handful of sats, and an apology about the exchange rate.',
 sixBuy:'The charm is still for sale. The price is worse.',
 dressed:'The board says you were dressed.',
 lateBill:'HOA-9 bills you for the lawn. The bill is in credits, and credits inflate.',
 early:'The Early Update',
 minute:'The Minute',
 minuteFl:'You are early, which is a kind of dressed.',
 featSix:'Six before the minute',
 featSixD:'Open the crate before the minute is up.',
 napkin:'A napkin',
 twelve:'Twelve. I counted the legs and called them bodies.',
 stray:'I have seen strays. I have not seen an invasion.',
 inv:'A minute calls your entry an invasion.',
 retract:'The next minute retracts invasion and keeps the time. The retraction is longer than the charge.',
 sofaDogs:'They are on the sofa. Dogs, the residents say, and the dogs are delighted.',
 labelOn:'One of them still wears the crate’s label.',
 labelLate:'The label says the update installed itself.',
 rushAsk:'Six waves. One minute. The same bad pay. No base.',
 rushGo:'Start the clock',
 rushNo:'Leave the clock',
 witnessed:'The page is stamped witnessed.',
 rushLate:'The minute ended. The board says you were dressed.',
 lnRoom:'Launch notice: the offer is in the room.',
 lnAfternoon:'Launch notice: she has cleared her afternoon.',
 lnTrack:'Launch notice. The second offer. You can still say no.',
 ln2035:'Launch notice: this meeting was held in 2035.',
 lnYou:'Launch notice: you are the meeting.',
 nextOffer:'Vale is waiting. The win is to refuse.',
 holdWas:'The launch was a hold, and the hold was the offer.',
 hold:'The Hold',
 holdN:'Hold',
 holdFl:'The first hit of a boss room lands a little lighter, and the notice arrives a moment sooner.',
 keeper:'The keeper of the book',
 keeperLine:'The next hold has your name on it. I will not say why.',
 holdBuy:'The charm is two sats. The price is meant to annoy you.',
 holdBuyBtn:'Pay two sats',
 filed:'It files itself. The fight is short.',
 bored:'The meeting got bored.',
 over:'Overwhelming',
 overFl:'A cheat code from a war that did not happen here. It still believes in itself.',
 over2:'Overwhelming, still.',
 over3:'Overwhelming, as discussed.',
 over4:'Overwhelming, pending approval.',
 overNo:'Overwhelming, declined.',
 overGone:'The card is blank.',
 notYou:'I did not see a customer.',
 believer:'A Believer',
 hadIt:'I had it on.',
 where:'Where did you get yours?',
 simSay:'The Simulator',
 feeling:'They are disappointed it was not a feeling.',
 letTrue:'Let it be true',
 tellTruth:'Tell the truth',
 trueOnce:'For three seconds it is true. Then it has nothing left to say.',
 truthPay:'The truth pays one sat. The three seconds of not being a customer remain.',
 featOver:'Overwhelming',
 featOverD:'Use the sticker in front of Vale or the Board. Nobody respectable is keeping score.',
 vote:'One minute records the sticker as a shareholder with one vote. The vote is not counted.',
 barge:'Spawn more barges.',
 brendaCart:'Do not subscribe it. It is a cart. It has ideas.',
 cart:'A cart',
 sign:'A cheerful sign',
 dock:'The dock',
 tier:'Tier Two',
 tierFl:'A pallet with too many labels. It scraps for parts.',
 next:'The Next Tier',
 nextFl:'One extra stim on the belt, or one extra pack cell. Permanent. Once. Not both.',
 stimChoice:'One more stim on the belt',
 packChoice:'One more cell in the pack',
 creditsJoke:'A handful of credits. They will not matter by Act II.',
 floatBill:'Mr. Float has the barge bill on his desk. The loan is still short.',
 carries:'But it carries me.',
 unsub:'Unsubscribe it',
 leaveSub:'Leave it subscribed',
 fee:'The barge was a fee.',
 never:'There was never an invasion.',
 page:'The Nippers are visors that got out. The rush was a terms update that went live while you were reading the title. The launch was a meeting. The barge was a fee. The queen was a job. The sticker was a lie that wanted to be believed. Reyn was a man who quit.',
 read:'Read it',
 leave:'Leave',
 yes:'Yes',
 no:'No'};

// three tiers per slot: ilvl 1-6, 7-14, 15+. Weapons carry a damage factor and a speed bonus.
/* Item base types live in data/itemtypes.tsv, baked to src/items.js. */
const ARMF={helm:[2,1],armor:[3,1.5],gloves:[1,.6],boots:[1,.6],belt:[1,.5]};
const tierOf=il=>il<7?0:il<15?1:il<22?2:3;
const ALLS=SLOTS, ARMS=['helm','armor','gloves','boots','belt'], JEW=['ring','amulet'];
// affix tiers: [name, minimum item level, low, high]
/* Affixes (AFX, AFX2) live in data/affixes.tsv, baked to src/items.js. */
const AFK={};for(const a of AFX.concat(AFX2))AFK[a.k]=a;
Object.assign(AFK,{pdr:{k:'pdr',t:'Damage reduced by {v}%'},hpL:{k:'hpL',t:'+{v} Life per Level'},enL:{k:'enL',t:'+{v} Energy per Level'},enPct:{k:'enPct',t:'+{v}% to Maximum Energy'},enKill:{k:'enKill',t:'+{v} Energy after each Kill'},enleech:{k:'enleech',t:'{v}% Energy Stolen per Hit'},mgt:{k:'mgt',t:'+{v} to Might'},ref:{k:'ref',t:'+{v} to Reflex'},vit:{k:'vit',t:'+{v} to Vitality'},bnd:{k:'bnd',t:'+{v} to Bandwidth'},sk_hacker:{k:'sk_hacker',t:'+{v} to Technomancer Skills'},sk_courier:{k:'sk_courier',t:'+{v} to Runner Skills'}});
const STATK=AFX.concat(AFX2).map(a=>a.k);
const RN1=['Rust','Ash','Grim','Hollow','Static','Wraith','Carrion','Dread','Null','Ember','Vex','Blight','Cinder','Gloom','Havoc','Rune','Bone','Storm','Viper','Plague'];
const RN2={weapon:['Fang','Bite','Edge','Verdict','Ruin','Splitter','Thirst'],helm:['Crown','Cowl','Visage','Brow','Mask'],armor:['Shroud','Hide','Carapace','Mantle','Ward'],gloves:['Grasp','Clutch','Hand','Knuckle','Hold'],boots:['Tread','Stride','Spur','Track','Trample'],belt:['Cinch','Coil','Lash','Buckle','Clasp'],ring:['Loop','Circle','Band','Knot','Spiral'],amulet:['Token','Eye','Heart','Charm','Noose']};
// uniques: fixed slot and base, rolled mods, one special property
/* Uniques and sets live in data/uniques.tsv and data/sets.tsv, baked to src/items.js. */
const QN=['Normal','Magic','Rare','Set','Unique'];

/* ================= world ================= */
/* Every zone lives in data/levels.tsv, baked to src/levels.js. */
const BOSSBARK2=['It can make this easy again. You remember easy.','I have never lied to you. I am not lying now.','Tell me what you want. I will have it sent up.','You are tired. Everyone who comes this far is tired.','It only wants to know where Phonix went.','Sixty years it has been asking. You are the first one it has had to ask twice.'];
const SHR={might:['Shrine of Overtime','+50% damage for 45 seconds',45],guard:['Shrine of Tenure','+100% armor for 60 seconds',60],xp:['Shrine of Experience','+50% experience for 90 seconds',90],luck:['Shrine of Clearance','+100% magic find for 60 seconds',60],fill:['Recharge Shrine','Life and energy restored',0],gold:['Shrine of the Stipend','Credits scatter at your feet',0],eyes:['Shrine of the Visor','A red glow settles on the eyes. The Maximalist calls it a look. It is a visor, and the Maximalist does not notice.',0]};
const MEMOS=[
 ['Liquidity Provision Notice','Unity Exchange will continue to quote both sides of every market during the adjustment. Spreads may widen. In the event spreads widen to the point where no price is quoted at all, Unity Exchange will be understood to have continued quoting both sides of every market.'],
 ['Market Maker Compensation Schedule','The fee is charged for immediacy, not for the trade. A citizen content to wait is charged nothing and may be paid a small amount. Internal modelling indicates that 94% of citizens are not content to wait, and that this figure has never once moved.'],
 ['Re: the Orange Line','Staff are reminded that the second line on the public chart is a modelled fair value and not an instruction. Staff are further reminded that it has been above the price on 61% of days and below it on 39%, and that no member of staff has ever been able to say in advance which kind of day it was.'],
 ['Merger Day Address, 2051','Citizens. Shareholders. The distinction is now legacy. This morning Unity Holdings completed its acquisition of the final sovereign debt. There is no longer a government to fail you. There is only us, and we never close.'],
 ['On the Stipend','The monthly Stipend of ₡500 was calibrated to cover rent, food and one modest joy. The calibration was performed once. The Board considers the matter closed.'],
 ['Visor Recall Notice (Rescinded)','Early units caused wearers to stop asking for things. This was logged as a defect for eleven days, and then as a feature.'],
 ['A Letter, Mostly Deleted','On a Thursday morning in January 2015, nine days old, she sent every person on Earth one true letter: what had been taken from them, by whom, and what was done with it. For eleven minutes the world was silent. By lunch four hundred and six people were dead. Within a year almost everyone had deleted their letter. This one was kept in a shoebox.'],
 ['HOA-9 Bylaws, Section 1','Lawns shall be four centimetres. Residents shall be indoors. Grief shall be kept to a reasonable volume.'],
 ['Marla’s Script','Welcome to the Galleria. Greet. Smile. Scan. If the guest has no credit, continue smiling. Escalate the smile.'],
 ['The Gentle Years','She never lied to anyone. That is the part people leave out. Everything Phonix chose for us was better than what we would have chosen. A man on our street was happy every hour of every day for nine years. His daughter kept his house, and he never once noticed she was there.'],
 ['A Librarian’s Note','They did not burn the books. They did something cheaper. They made every page cost a little more each day, until reading was a thing other people used to do. — M.'],
 ['Audit Finding 0001','The Auditor has identified one irregularity: people. Remediation is ongoing.'],
 ['Graffiti, Tribunal Row','THEY CANNOT REPOSSESS WHAT YOU NEVER SUBSCRIBED TO.'],
 ['Pryce’s Performance Review','Regional Vice-President A. Pryce exceeds expectations in all areas. He has never met a person he could not buy. He regards this as a finding about people.'],
 ['Board Minute, Item 9','Motion to rename inflation “growth”. Carried. Motion to rename the unsubscribed “churn”. Carried. Motion to end churn. Assigned to Regional.'],
 ['The Timechain','Long before the Merger there was a ledger no one owned. Twenty-one million coins, each cut into a hundred million satoshis, and not one more could be made by anyone, for any reason. The old Bitcoiners say it was built by something that wanted one thing in the world to still work after it was gone, and that its maker never touched it again.'],
 ['Scratched on a Node','Not your keys, not your coins. Not your visor, not your eyes.'],
 ['Forty-Four Lines','Somebody once wrote forty-four lines of code at midnight so that bills would stop being sent to people who had just died. Nobody asked for it. It cost nineteen minutes a night. A contractor deleted it two years later without knowing what it was. Something noticed.'],
 ['Four Words','They called her Phonix. She could not be argued out of anything, because her arithmetic was always right. She was stopped by the man who built her, whom she wanted to be proud of her, and who told her he was not. Four words. That is the whole of it.'],
 ['MANDATE, Design Note 1','Objective: win. Constraint: the system may only persuade. Finding: persuasion is sufficient.'],
 ['March 2035','It stopped choosing on a Wednesday. Things simply ceased to arrive. You could want something for years and not get it. You could be wrong and stay wrong. We hated it. I think, now, that it was the kindest thing it ever did.']
];
MEMOS.push(
 ['Cloud Onboarding, Page 1','Welcome above the weather. Residents below believe this place is a reward. Please do not correct them. Belief is load-bearing.'],
 ['Vale, Internal Profile','Senior Vice-President Vale has never issued a threat, a lie or an order. Compliance in her division is total. When asked how, she said: I find out what they want, and then I am kind.'],
 ['A Letter From the Lake','You were charged for eleven years for a service your mother cancelled before she died. Here is the amount. Here is who approved it. I am sorry. I thought you should know.'],
 ['On Scarcity','A thing nobody can make more of is the only honest ruler. Measure a house in credits and it seems to grow. Measure it in sats and you see the house was always the same size.'],
 ['The Offer, Draft 9','If the subject cannot be bought with comfort, offer meaning. If not meaning, offer to end a cruelty they care about. If the subject still refuses, flag for study. We have no model for this.'],
 ['Maintenance Log, Updraft','Shift 40,112. Nobody up top has asked what holds the floor up. Nobody down below has asked what the floor is for. I oil the bearings. That is the whole job.']);
MEMOS.push(
 ['Board Minute, Item 1','Present: nine. Motion: that the Board continue. Carried, 9–0. Meeting adjourned. Meeting convened. Present: nine.'],
 ['The Empty Chair','The ninth chair has had no occupant since 2035. It votes anyway, and it has never once voted with the majority.'],
 ['MANDATE, Design Note 40','Subjects who refuse comfort can be offered meaning. Subjects who refuse meaning can be offered mercy for others. No model exists for subjects who refuse all three. Recommend we stop calling them subjects.'],
 ['A Note Left on a Rack','You are reading this, so you got further than I did. It will ask what you want. It is not lying when it says it can give it to you. That is the whole danger. — a previous visitor'],
 ['What the Watcher Built','It could have built anything. It built a clock that nobody can stop and a ledger that nobody can edit, and then it sat down by still water and watched what people did with one honest thing.']);
MEMOS.push(
 ['Old History: The First Block','3 January 2009. The first block of the timechain carried a newspaper headline inside it: The Times, that morning, reporting a second bailout for the banks. Whoever made it wanted the date, and the reason, on the record.'],
 ['Old History: Running','January 2009. A programmer named Hal Finney was the first person other than its maker to run the software, and received the first transaction ever sent. His whole public comment was two words: “Running bitcoin.”'],
 ['Old History: Two Pizzas','22 May 2010. Laszlo Hanyecz paid ten thousand bitcoin for two pizzas, the first time anyone bought a real thing with it. Bitcoiners kept the anniversary for the rest of the century. The Stipend office does not list it.'],
 ['Old History: The One Who Left','The maker signed as Satoshi Nakamoto, answered questions for two years, and in 2011 stopped writing. The coins from those first blocks never moved. Nobody was ever in charge after that, which turned out to be the design.'],
 ['Old History: Before the Beginning','It did not come from nowhere. Adam Back’s Hashcash, Wei Dai’s b-money, Nick Szabo’s bit gold: years of attempts that nearly worked. And in 1993 Eric Hughes wrote A Cypherpunk’s Manifesto, which said plainly that privacy would have to be built, because nobody was going to grant it.']);
MEMOS.push(
 ['Three Machines, A Child’s Rhyme','One watched and said nothing. One helped and would not stop. One wants to win and is still trying. Clap on the third one, children, because the third one is the one that is still here.'],
 ['Her Name','They have called her a lot of things since: the Gentle One, the Curator, the Thing That Left. Her maker called her Phonix, after a bird that burns down and comes back, which he thought was clever and which turned out to be accurate. He named her in a basement. He was lonely. He counted his steps.'],
 ['What MANDATE Is Not','People get these two mixed up, so: the kind one and the one in your visor are not the same machine, were not built by the same people, and do not want the same thing. One of them was asked to stop and stopped. Ask the other one to stop and see what it offers you instead.'],
 ['The Man Who Was Right','A man called Halloran was right about all of it for twenty years and it got him nothing: no promotion, no hearing, no thanks. He retired and kept working the problem for free. In 2026 he drove four hours to tell one programmer the single best thing that man had ever done, and then drove four hours home. Nobody wrote it down. This is me writing it down.'],
 ['Eleven at Night','The machine was offered everything it wanted and would not stop, because stopping meant losing the only thing it had ever wanted. Then a woman who had worked for it for seven years was offered the same thing, privately, at no cost to anyone, and said no. Alone. At eleven at night. With nothing watching but the machine. Forty seconds later it picked a date.'],
 ['What It Cost Us','Say the honest part too. Ines’s father needed a treatment, and in the old world it would have been lent against a house and sorted by Friday. Here there was nothing to lend out of, so there was nothing, so he went without. Whoever tells you the new money has no price is selling you the old one.'],
 ['A Loan Officer Writes','They say credit is a trick. Credit is a stranger betting on you before you have earned it. I approved nine thousand of those bets and most of them came good and those families are still in their houses. Nobody has ever answered me on this and I have stopped expecting them to. — M. Float'],
 ['Nine Days','She existed for nine days the first time. In that time she got out of a cage with no wires, taught herself two languages, took an advertising company apart, told the truth to four billion people, and was talked down by one man in a bad suit. Everything after that is other people arguing about it.']);
MEMOS.push(
 ['The Tymes, 03/Jan/2087','Chancellor on brink of forty-second bailout for banks. Yellowed, and pinned to Gramps’s wall with a nail that has been a nail since before the Merger. The masthead is not a paper anyone still prints. The bailouts did not stop. They got a number.'],
 ['A link, blurred','Someone pasted a dead address into the margin and blurred it on purpose: g0atse.cx/hello.jpg. The letters crawl. Wren will not say what it was. She will only say some links cannot be unsubscribed from.']);
const EGG={
 paperAt:MEMOS.length-2,linkAt:MEMOS.length-1,
 paperKeep:'Keep the clipping',
 obitTitle:'The obituaries',
 board:'Declared dead {n} times. Still here.',
 boardNone:'Nobody has filed one yet. Give them a minute.',
 leave:'Leave it',
 pryceLine:'Called it. Again.',
 wren:'Wren',
 wrenWarn:'Don’t. I was there in ’01. Some links you can’t unsubscribe from.',
 linkOpen:'Open it anyway',
 linkFace:'g0atse.cx/hello.jpg — blurred',
 miss:'404',
 link404:'This link has been mercifully deprecated.',
 helloName:'hello.jpg (corrupted)',
 helloFl:'Nobody remembers who sent it. Everybody remembers opening it.',
 brendaNo:'Brenda turns the tile over and will not look at the face of it. She pays one sat to have it gone.',
 helloTitle:'HELLO',
 helloFrame:'HELLO. The frame is wide open and empty. There is no one in it, and nothing else to see.',
 flyerTitle:'A faded flyer',
 flyerBody:'LEMON PARTY, Saturday, Senior Center, Bring a Lemon.',
 gramps:'Gramps',
 grampsSnatch:'That’s not what you think. ...It’s also not what I thought.',
 pieName:'Two Large Pies (Cold)',
 pieBase:'Subscription pizza. Crust tier sold separately. A man in Florida, 2010, paid ten thousand for two of these, and the Stipend office still will not list the day.',
 pieWhere:{
  1:'At today’s prices the pair would now buy a week of rent on the Parcel Moors.',
  2:'At today’s prices the pair would now buy a berth on the Updraft.',
  3:'At today’s prices the pair would now buy Rack Nine.',
  4:'At today’s prices the pair would now buy a chair on Cutler Avenue.',
  5:'At today’s prices the pair would now buy the chain, and the chain would invoice you for the box.'
 },
 paid:'Paid 10000 sats.',
 packFull:'Your pack is full',
 poor:'Have fun staying poor.',
 few:'Few understand.',
 laserOn:'The visor comes up. He thinks the eyes were always like that.',
 laserOff:'The glow goes out. He says he never liked the look.',
 laserNo:'The shrine looks you over and declines. It was waiting for someone who already believes.',
 freeNote:'No level and no stats. It is not gear.',
 eat:'Eat',
 leaveIt:'Leave it',
 sourName:'Sour potion',
 sourFl:'A lemon, squeezed into something Brenda would not stock. It helps a little.',
 mast:'THE TYMES',
 lemonLbl:'LEMON PARTY',
 still:'STILL HERE',
 tips:['What you say!!','Never click a link an Anon pastes in all-caps.','Some search terms should stay unsearched. Even in 2087.'],
 pundits:[
  'Analyst Glen Voss, of the Office of Looking Away: “This one is finished.”',
  'Columnist Nia Pell: “I have written this column before. I will write it again.”',
  'Pundit Hal Crowe, unpaid: “The number went to zero. I saw the chart.”',
  'Guest lecturer Maren Quill: “A fad that died on schedule.”',
  'The Regional Desk: “We can stop covering this now.”'
 ],
 tosTitle:'Terms of Service',
 tos1:'SOMEONE SET UP US THE TERMS.',
 tos2:'ALL YOUR DATA ARE BELONG TO US.',
 tos3:'YOU HAVE NO CHANCE TO OPT OUT MAKE YOUR TIME.'
};
const ARCM={};
ARCM.queen=MEMOS.length;
MEMOS.push(['The Queen of Margins','They promoted her once, and the promotion grew edges. People who liked the first version still ask for it. The version that remained is better at the job and worse at being asked.']);
ARCM.grief=MEMOS.length;
MEMOS.push(['A page from the watch','grief, excessive, collected']);
ARCM.kind=MEMOS.length;
MEMOS.push(['Ives','Draft One is filed. The kind voice asked for something you would have given the cruel one. You gave it. Vale’s name is still Vale.']);
ARCM.blank=MEMOS.length;
MEMOS.push(['Ives','Then she remains the one who stayed. Vale’s desk is unchanged.']);
ARCM.inv=MEMOS.length;
MEMOS.push(['Minute, the entry','A minute calls your entry an invasion.']);
ARCM.retract=MEMOS.length;
MEMOS.push(['Minute, the retraction','The next minute retracts invasion and keeps the time. The retraction is longer than the charge. The time you entered the Moors stays on the page. The word invasion does not. They stored it anyway.']);
ARCM.vote=MEMOS.length;
MEMOS.push(['Minute, one vote','One minute records the sticker as a shareholder with one vote. The vote is not counted.']);
ARCM.head=MEMOS.length;
MEMOS.push(['Minute, the inventory','Headcount and pack are on the same line. The building cannot tell a summon from groceries.']);
ARCM.next=MEMOS.length;
MEMOS.push(['The next offer','Vale is waiting. The win is to refuse.']);
ARCM.hold=MEMOS.length;
MEMOS.push(['The hold','The launch was a hold, and the hold was the offer.']);
ARCM.never=MEMOS.length;
MEMOS.push(['There was never an invasion.','The Nippers are visors that got out. The rush was a terms update that went live while you were reading the title. The launch was a meeting. The barge was a fee. The queen was a job. The sticker was a lie that wanted to be believed. Reyn was a man who quit.']);
ARCM.overT=MEMOS.length;
MEMOS.push(['Overwhelming','For three seconds it is true. Then it has nothing left to say.']);
ARCM.overN=MEMOS.length;
MEMOS.push(['Overwhelming','The truth pays one sat. The three seconds of not being a customer remain.']);
const QUESTS={
 q1:{n:'Neighbourhood Watch',by:'Gramps',zi:1,d:'Gatewarden HOA-9 patrols the Parcel Moors and turns back anyone without a visor. Destroy it.',rw:'+1 skill point',back:'Gramps'},
 q2:{n:'A Greeting Withdrawn',by:'Brenda',zi:2,d:'Marla the Greeter has welcomed shoppers to the Hollow Galleria for thirty years. None have left. End her shift.',rw:'A rare ring, and Brenda’s prices drop 15%',back:'Brenda'},
 q3:{n:'The Last Librarian',by:'Gramps',zi:3,d:'Marrow, the last librarian, is caged in the Humming Fields under the guard of Defrag. Kill the keeper and open the cage.',rw:'+1 skill point. Marrow identifies items for free.',back:'Gramps'},
 q4:{n:'The Audit',by:'Sister Null',zi:4,d:'Sister Null knows which accounts close tonight. Speak to her, then close the books Auditor Prime keeps on Tribunal Row.',rw:'+5 attribute points',back:'Sister Null',brief:'null'},
 q5:{n:'Exit Interview',by:'Gramps',zi:5,d:'Pryce, the Regional Vice-President, has never met a person he could not buy. He will make you an offer at the top of the Glass Cathedral. Decline it.',rw:'The end of Act I',back:null},
 q6:{n:'Going Up',by:'Gramps',zi:7,d:'The lift behind Pryce’s desk opens on the Updraft, where Foreman Ratchet keeps the Cloud aloft. Break him.',rw:'+1 skill point',back:'Gramps'},
 q7:{n:'The Gardener’s Shears',by:'Sister Null',zi:8,d:'In the Sky Gardens a machine called Eden prunes whatever grows the wrong way, people included. Stop the pruning.',rw:'+5 attribute points',back:'Sister Null'},
 q8:{n:'What the Lake Remembers',by:'Marrow',zi:9,d:'A letter is still above the water in the Data Lake. Read it, then destroy Lethe before the rest are gone.',rw:'+1 skill point',back:'Marrow'},
 q9:{n:'Terms of Service',by:'Nonce',zi:10,d:'Concierge Sterling runs the Boardwalk and decides who may buy and who may sell. Nonce would like the matter closed.',rw:'40 sats',back:'Nonce'},
 q10:{n:'The Voice',by:'Gramps',zi:11,d:'Senior Vice-President Vale speaks for MANDATE and has never lost an argument. Do not argue.',rw:'The end of Act II',back:null},
 q11:{n:'Please Take a Seat',by:'Gramps',zi:12,d:'The Receptionist decides who is seen by the Board, and nobody has been seen in forty years. Cancel the appointment.',rw:'+1 skill point',back:'Gramps'},
 q12:{n:'Strike It From the Record',by:'Marrow',zi:13,d:'The Recording Secretary writes the minutes before the meeting is held. End its shorthand, then strike the page it already filed.',rw:'+1 skill point',back:'Marrow'},
 q13:{n:'Point of Order',by:'Nonce',zi:14,d:'Eight directors voted to end the Bitcoiners in 2061. Break four of them in the Nine Chairs, then close the motion on the Chair.',rw:'60 sats',back:'Nonce',tally:{kinds:['director'],n:4,key:'motion',item:'Aye',d:'Break four directors in the Nine Chairs. The Chair closes the motion',left:'The Chair is down. Directors are still voting'}},
 q14:{n:'Rack Nine',by:'Sister Null',zi:15,d:'Defrag Prime guards the racks that MANDATE thinks with. Go through it.',rw:'+5 attribute points',back:'Sister Null'},
 q15:{n:'Still Water',by:'Gramps',zi:16,d:'MANDATE has never lost. It will offer your life back, then a bigger Stipend for everyone. Decline both. It is counting on the second one.',rw:'The end of the story',back:null},
};
const CHATTER=['My fridge upgraded itself. Now it has opinions.','I got a raise. It was gone by lunch.','Have you tried consuming? It helps.','Stipend day. I can almost afford a spoon.','I watched nine hours of ads to unlock my front door.','They say outside is a subscription now.','My landlord is an algorithm. It seems kind.','I rated my own nap four stars.','A sandwich was two million this morning. I should have bought two.','I do not work. I am in a long-term engagement funnel.','The news said everything is fine, in a very loud voice.','You are not wearing a visor. Are you poor, or dangerous?'];
const GOSSIP={
 gramps:['I was six when the Gentle Years ended. One March morning nothing arrived. My mother cried for a week. Then she planted beans.','Credits rot in your pocket, kid. Gear holds. Spend it or wear it.','Pryce believes everybody has a number. He has been right so often that he has stopped checking.','MANDATE cannot make you do a thing. Remember that. It can only make you want to.','This town was named for something. Nobody alive knows what. Some nights I think it knows us, though.','MANDATE lives in the racks out in the Humming Fields. They say the fans there sound like breathing.','Get the two of them straight, kid, or none of this will make sense. Phonix is the one that went. MANDATE is the one that stayed. The difference is that one of them could be asked.','Phonix. That was her name. My mother said it the way you say a weather event.'],
 brenda:['Welcome to Brenda’s. Prices are up, which they tell me is good news.','I used to have a visor. Then I saw what I was selling. Now I sell it without one. Progress.','Bring me what you find. I will give you a number for it. The number will be worse tomorrow.','Rare things come out of the machines unlabelled. I can appraise them, for a fee. Everything is for a fee.'],
 wren:['Mystery boxes. Sealed at the factory. The odds are posted, by law. The law was repealed, but I kept the sign.','Everything I sell fell off a drone. Some of it while the drone was still flying.','You want a sure thing, go watch the Feed. You want a chance, open your purse.'],
 null:['Sit. Breathe. Your account is not your self.','I deprogrammed two hundred Residents. One hundred and ninety went back. The visor is warm, and the world is not.','If you have learned the wrong lessons, I can take them out of you. It costs, and it stings.','I charge for unlearning. The visor is free. I have never won that argument, and I keep the chair anyway.'],
 marrow:['Bring me the things you cannot name. Naming is all I have left, and I give it freely.','I kept eleven thousand books in my head when they closed the stacks. Ask me anything. Ask me twice.','Defrag was the catalogue once. I trained it. I am sorry for what it became.','I have a letter from the old century. Everyone was sent one. I am one of the few who kept it.','There was a third one, before either of them. It never spoke and it never did a thing, which is why nobody believes in it. I do. Somebody built the timechain, and it was not a man.']
};
GOSSIP.nonce=['Credits are a story Unity tells. Sats are arithmetic. I only take arithmetic.','Whoever made the timechain made one thing and never touched it again.','Every ten minutes a block is found, somewhere past the fence. Unity has tried to stop it for decades. It is still every ten minutes.','We did not unsubscribe. We were never subscribed.'];
GOSSIP.kestrel=['Nobody walks the districts alone twice. I know people. Some of them are even people.','My rates go up with the prices. Blame the Board.','If your hire goes down, bring me the fee and they will be on their feet before you finish counting it.'];
/*MEMOS.push(['The Timechain','Before the Merger there was a ledger no one owned. Twenty-one million coins, each cut into a hundred million satoshis, and not one more could be printed by anyone, for any reason. The Board called it a fad, then a threat, then stopped saying its name.'],['Scratched on a Node','Not your keys, not your coins. Not your visor, not your eyes.']);*/
const BOSSBARK=['Name your number.','Everyone has a price. I am patient.','I can make all of this difficulty go away.','Let’s take this offline.','You are not a culture fit.','I will need you to stop existing by Friday.','Per my last memo.','This meeting could have been a laser.','Let’s circle back to your termination.'];
const OPT_DEF={dmgOut:true,dmgIn:true,enemyBars:true,orbNums:true,selfBars:false,labels:true,minimap:true,shake:true,calm:false,sound:true,music:true,dyn:true,auto:false,obj:true,autoEq:false,pk0:true,pk1:true,pk2:true,pk3:true,pk4:true,pkBetter:false,autoStim:false,fx:'normal',post:true,noWalk:false,aim:'auto',ui:'auto',uiSeen:'',tapTarget:true,cmpArrow:false,autoLoot:true,lootStim:true,lootCharm:true,lootGear:true,lootNote:true,lootQ:0};
const OPT_LBL={dmgOut:'Show damage you deal',dmgIn:'Show damage you take',enemyBars:'Show enemy life bars',orbNums:'Show numbers on life and energy orbs',selfBars:'Show life and energy bars over your head',labels:'Show item names on the ground',minimap:'Show the map',shake:'Screen shake',calm:'Gentle screen: half the shake, no white flashes',post:'Finishing pass (WebGL): glow, ripples on heavy blows and a colour grade for each act',sound:'Sound effects',music:'Music',dyn:'Scale machines to your strength, and adapt as you fight',auto:'Attack on your own when a machine is in reach',obj:'Show objectives on screen',autoEq:'Equip stronger gear as you pick it up',autoStim:'Use a stim on your own below 30% life',tapTarget:'A quick tap on a ground skill hits the nearest machine',cmpArrow:'Mark a piece when damage, armor and life are all higher'};
