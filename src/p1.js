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
const CLS={
 scrapper:{n:'Scrapper',tag:'A laid-off line worker with a road sign and a grudge. Tough, close range.',good:'standing in the middle of a fight. The most life in the game, armour skills, and swings that hit everything around you and can stun.',weak:'anything that keeps its distance. Short reach and slow swings mean you chase ranged machines.',bld:'Wrecking Crew wades in and hits harder for each machine nearby. Immovable Object stacks armour and stuns the room with War Horn. Scrap Thrower throws scrap through the whole line, then rushes in to finish.',hp:FORMULAS.cls.scrapper.hp,hpL:FORMULAS.cls.scrapper.hpL,melee:true,mult:1.25,ivl:.6,spd:4.1,col:'#d9822b',
  sk:[
   {n:'Stop Sign',ab:'STOP\nSIGN',a:1,cost:5,cd:.8,d:L=>`A wide swing. The machine in front takes ${pct(1.3+.15*L)}. Everyone else in the swing takes 22% of that, with a ${15+2*L}% chance to stun.`},
   {n:'Hurl',ab:'HURL',a:1,cost:6,cd:.6,d:L=>`Throw scrap that passes through enemies for ${pct(1.2+.2*L)} damage.`},
   {n:'Iron Hide',ab:'',a:0,d:L=>`Passive. +${8*L}% armor and +${4*L}% life.`},
   {n:'Turnstile',ab:'TURN-\nSTILE',a:1,cost:12,cd:1.5,d:L=>`Spin. The nearest machine takes ${pct(1.5+.22*L)}. Everyone else in the spin takes 22% of that.`},
   {n:'Picket Rush',ab:'PICKET\nRUSH',a:1,cost:12,cd:4,d:L=>`Rush forward, untouchable, hitting each enemy in the path for ${pct(1.2+.3*L)}.`},
   {n:'War Horn',ab:'WAR\nHORN',a:1,cost:16,cd:10,d:L=>`Stun enemies around you for ${(1+.2*L).toFixed(1)}s and gain +60% armor for 8s.`},
   {n:'Overtime',ab:'OVER-\nTIME',a:1,cost:25,cd:18,d:L=>`For ${6+L}s: +40% attack speed and ${6+L}% life stolen per hit.`},
   {n:'Earthbreaker',ab:'EARTH-\nBREAKER',a:1,cost:20,cd:7,d:L=>`Leap to the nearest enemy and slam for ${pct(2.2+.35*L)}. Anyone else in the slam takes 22% of that.`},
   {n:'Solidarity',ab:'',a:0,d:L=>`Passive. +${3*L}% damage for each enemy near you, up to five.`},
   {n:'Lunch Pail',ab:'LUNCH\nPAIL',a:1,cost:16,cd:14,d:L=>`Set it down. You and anyone fighting beside it recover ${(2+.4*L).toFixed(1)}% of their life each second from the pail, until its stores (${Math.round(28+6*L)}% of your life) run out.`},
   {n:'Seniority',ab:'',a:0,d:L=>`Passive. The damage type on the weapon in your hand gains +${6*L}%.`},
   {n:'Hold the Line',ab:'',a:0,d:L=>`Passive. Each second you have not dashed adds ${4*L} armour and 5% damage reduction, up to six seconds. A dash spends it.`},
   {n:'Call the Strike',ab:'CALL THE\nSTRIKE',a:1,cost:18,cd:11,d:L=>`A horn. Ordinary machines are pushed back. Elites and bosses are pulled in. Everyone caught takes ${pct(.55+.08*L)} noise.`},
   {n:'Two-Handed',ab:'TWO-\nHANDED',a:1,cost:14,cd:9,d:L=>`Your next three swings are slow, cannot be interrupted, and hit a wider arc.`},
   {n:'Last Shift',ab:'LAST\nSHIFT',a:1,cost:24,cd:22,d:L=>`For ${(4+.3*L).toFixed(1)}s your swings leech ${8+L}% and you do not flinch. If you fall while it is up, you fall.`}]},
 hacker:{n:'Technomancer',tag:'An IT contractor who read the machines’ source and learned to curse in it. Fragile, ranged, clears crowds.',good:'clearing crowds from a distance. Lightning that chains through a pack, stuns, and a turret and drones that fight for you.',weak:'being caught. The least life in the game, hungry for energy, and you commit to one element (Schema).',bld:'Chain Reaction primes Arc Chain with Spark Lance and lets deadly strikes finish the pack. Sysadmin lets a turret, a Botnet and a storm do the fighting while you stay back. Control Rod stuns with Null Nova, slows with Packet Storm, and uses Step Back to get out.',hp:FORMULAS.cls.hacker.hp,hpL:FORMULAS.cls.hacker.hpL,melee:false,mult:1.1,ivl:.62,spd:4.1,col:'#9a6cff',
  sk:[
   {n:'Arc Chain',ab:'ARC\nCHAIN',a:1,cost:11,cd:1.2,d:L=>`Lightning that leaps through ${3+Math.floor(L/2)} enemies for ${pct(1.2+.18*L)} each. For ${FORMULAS.brace.ward.sec}s after you cast it, ${Math.round(FORMULAS.brace.ward.pct*100)}% of each hit is paid from energy, and only as much as you have.`},
   {n:'Spark Lance',ab:'SPARK\nLANCE',a:1,cost:5,cd:.5,d:L=>`A bolt that pierces every enemy in a line for ${pct(1.4+.2*L)}. Primes your next Arc Chain within 3 seconds for +30%.`},
   {n:'Cipher Ward',ab:'',a:0,d:L=>`Passive. ${Math.min(FORMULAS.brace.cipher.cap*100,FORMULAS.brace.cipher.per*100*L)}% of damage taken drains energy instead of life.`},
   {n:'Null Nova',ab:'NULL\nNOVA',a:1,cost:18,cd:7,d:L=>`A blast around you: ${pct(.9+.2*L)} damage and ${(1.5+.2*L).toFixed(1)}s stun.`},
   {n:'Watchdog',ab:'WATCH-\nDOG',a:1,cost:25,cd:16,d:L=>`Deploy a turret for ${10+2*L}s that fires for ${pct(.5+.08*L)} per shot.`},
   {n:'Overclock',ab:'',a:0,d:L=>`Passive. +${L} energy per second and ${3*L}% faster skill recovery.`},
   {n:'Black Storm',ab:'BLACK\nSTORM',a:1,cost:30,cd:12,d:L=>`Call a storm on a spot for 4s. Shards fall there, and each strike deals ${pct(.7+.12*L)}.`},
   {n:'Botnet',ab:'BOTNET',a:1,cost:30,cd:20,d:L=>`Hijack three drones for ${15+L}s. Each bite deals ${pct(.4+.07*L)}.`},
   {n:'Zero Day',ab:'',a:0,d:L=>`Passive. +${3*L}% deadly strike chance, and deadly strikes deal ${pct(2+.1*L)}.`},
   {n:'Ground Fault',ab:'GROUND\nFAULT',a:1,cost:14,cd:6,d:L=>`A line of heat on the floor for ${(3.2+.15*L).toFixed(1)}s, ${pct(.4+.06*L)} every half second. Casting it locks your hands for a moment.`},
   {n:'Packet Storm',ab:'PACKET\nSTORM',a:1,cost:16,cd:8,d:L=>`Mark a spot. A noise storm arrives there after a short delay and strikes for ${pct(.5+.08*L)}. Walking away does not move it.`},
   {n:'Schema',ab:'',a:0,d:L=>`Passive. You work in one element${G&&G.schema?': '+DTY[G.schema].n:''}. Damage of that type gains +${8*L}%. The other two do not. Sister Null can make you choose again. Dying cannot.`},
   {n:'Step Back',ab:'STEP\nBACK',a:1,cost:8,cd:4,d:L=>`About four paces back along your facing.`},
   {n:'Patched',ab:'',a:0,d:L=>`Passive. ${Math.round((10+2*L))}% of the Surge damage you deal becomes a barrier, up to ${Math.round(20+2*L)}% of your life. Nothing, if your Schema is Heat or Noise.`},
   {n:'Kill Dash Nine',ab:'KILL -9',a:1,cost:26,cd:16,d:L=>`One machine, for ${pct(2.8+.4*L)} of your Schema element. It ignores that element's resistance, once. A resistance of zero is still a wall. Casting it locks your hands.`}]},
 courier:{n:'Runner',tag:'A courier who stopped delivering and kept running. Fast feet, faster hands.',good:'moving and finding loot. The fastest class and the fastest attacks, dashes that nothing can touch, and the best credit and item finding.',weak:'big single hits. Each blade hits light, and you avoid damage by not being there, not by armour.',bld:'Rush Hour throws a wall of blades, close and far, with a boomerang through the same line. Porch Pirate lures machines onto spike strips and blinks to where a marked one falls. Tip Jar plays for credits and gear, with kills by throw paying extra.',hp:FORMULAS.cls.courier.hp,hpL:FORMULAS.cls.courier.hpL,melee:false,mult:.82,ivl:.4,spd:4.8,col:'#3fbf8f',
  sk:[
   {n:'Scatter Shot',ab:'SCATTER',a:1,cost:9,cd:1.2,d:L=>`Throw a fan of ${3+Math.floor(L/2)} blades for ${pct(.9+.1*L)} each. Anything within arm’s reach is also cut for ${pct(.5+.06*L)}.`},
   {n:'Fleet Step',ab:'FLEET\nSTEP',a:1,cost:9,cd:3.5,d:L=>`Dash, untouchable, then run 50% faster for ${(2+.3*L).toFixed(1)}s.`},
   {n:'Evasion',ab:'',a:0,d:L=>`Passive. +${2*L}% run speed and ${Math.min(35,2.5*L)}% chance to avoid any hit.`},
   {n:'Lure',ab:'LURE',a:1,cost:20,cd:12,d:L=>`Drop a decoy parcel. Machines attack it, then it bursts for ${pct(2.5+.4*L)}.`},
   {n:'Tack Strip',ab:'TACK\nSTRIP',a:1,cost:14,cd:8,d:L=>`Scatter spikes for 6s that slow enemies and deal ${pct(.25+.05*L)} twice a second.`},
   {n:'Scavenger',ab:'',a:0,d:L=>`Passive. +${10*L}% credits and +${5*L}% magic find.`},
   {n:'Rush Order',ab:'RUSH\nORDER',a:1,cost:22,cd:8,d:L=>`A 1.5s stream of blades at the nearest enemy, ${pct(.5+.07*L)} each.`},
   {n:'Signed For',ab:'SIGNED\nFOR',a:1,cost:16,cd:6,d:L=>`Strike the nearest enemy for ${pct(3+.5*L)}. It takes +30% damage for 8s.`},
   {n:'Deadeye',ab:'',a:0,d:L=>`Passive. ${8*L}% chance for throws to pierce and +${2*L}% deadly strike.`},
   {n:'Return to Sender',ab:'RETURN\nSENDER',a:1,cost:12,cd:5,d:L=>`A throw that goes out and comes back, ${pct(1.1+.16*L)} on each pass.`},
   {n:'Route Knowledge',ab:'',a:0,d:L=>`Passive. After a dash, you avoid ${6+2*L}% more hits for ${(2+.2*L).toFixed(1)}s. Standing still does nothing.`},
   {n:'Second Drop',ab:'SECOND\nDROP',a:1,cost:16,cd:10,d:L=>`One decoy copies your last throw, then stays on a 4.5-pace leash for 6s. Leave it behind and it pops.`},
   {n:'Manifest',ab:'MANIFEST',a:1,cost:14,cd:6,d:L=>`A piercing throw for ${pct(1+.14*L)} that splits into two after the first machine it hits.`},
   {n:'Hazard Pay',ab:'',a:0,d:L=>{const pay=Math.floor((3+L)*(G&&G.cpi||1));return `Passive. A throw that kills pays ${pay} extra credits and finds gear as if you had +${6*L}% magic find. A dash does not pay.`}},
   {n:'Missed Connection',ab:'MISSED\nCONN',a:1,cost:18,cd:12,d:L=>`Mark a machine. If it dies within ${(4+.25*L).toFixed(1)}s, to you or to anyone with you, you appear where it fell and your next throw costs nothing.`}]}
};
Object.assign(CLS,{
 anon:{n:'Anon',tag:'No name, no face, no account. Traps, vanishing acts and a knife from behind.',good:'one huge strike, and setting the fight up before it starts. Vanish and hit for nearly triple, a hop behind a machine that always lands a deadly strike, and mines and lures that pull machines where you want them.',weak:'a long, open fight. Low life, and most of your damage needs setup time you may not get.',bld:'Demolition gathers machines with a Honeypot and blows them up with mines and Zip Bomb. Ghost banks charges with Rehearsal, hops in, vanishes, then spends the charges with The Dump. We Are Legion lets sockpuppets take the hits, then sets them all off and disappears.',hp:FORMULAS.cls.anon.hp,hpL:FORMULAS.cls.anon.hpL,melee:true,mult:1,ivl:.42,spd:4.7,col:'#3f3f4c',
  sk:[
   {n:'Honeypot',ab:'HONEY-\nPOT',a:1,cost:14,cd:9,d:L=>`Plant a lure. Machines swarm it for 3s, then it bursts for ${pct(2.2+.35*L)} and stuns.`},
   {n:'Proxy Hop',ab:'PROXY\nHOP',a:1,cost:10,cd:3.5,d:L=>`Appear behind the nearest machine and stab for ${pct(1.6+.25*L)}, always a deadly strike.`},
   {n:'OpSec',ab:'',a:0,d:L=>`Passive. ${Math.min(35,2.5*L)}% chance to avoid any hit and +${2*L}% deadly strike.`},
   {n:'Logic Bomb',ab:'LOGIC\nBOMB',a:1,cost:12,cd:2.5,d:L=>`Lay a mine that blows for ${pct(3+.5*L)} when a machine steps near. Up to four.`},
   {n:'Incognito',ab:'INCOG-\nNITO',a:1,cost:16,cd:12,d:L=>`Vanish for ${(3+.3*L).toFixed(1)}s. Machines forget you. Your next blow deals ${pct(2.5+.3*L)}.`},
   {n:'Dox',ab:'DOX',a:1,cost:12,cd:6,d:L=>`Expose a machine and everything near it: +30% damage taken for ${8+L}s, and ${pct(1+.2*L)} now.`},
   {n:'Zip Bomb',ab:'ZIP\nBOMB',a:1,cost:22,cd:8,d:L=>`One blast of ${pct(1.4+.2*L)} that unpacks into five more of ${pct(1.2+.2*L)}.`},
   {n:'Sockpuppet',ab:'SOCK-\nPUPPET',a:1,cost:24,cd:18,d:L=>`${L>=5?'Two copies':'A copy'} of you fight${L>=5?'':'s'} for ${10+L}s, dealing ${pct(.5+.08*L)} and drawing fire.`},
   {n:'Legion',ab:'LEGION',a:1,cost:35,cd:20,d:L=>`A dozen unseen blades strike across the screen for ${pct(1.2+.2*L)} each.`},
   {n:'Rehearsal',ab:'RE-\nHEARSE',a:1,cost:10,cd:1.4,d:L=>`A strike for ${pct(.7+.1*L)}. Another within 3s adds a charge, up to three.`},
   {n:'The Dump',ab:'THE\nDUMP',a:1,cost:8,cd:4,d:L=>`Spend every charge. One is a rust bleed. Two is a silence. Three is a screen of blades for ${pct(.9+.12*L)}. A plain attack spends one charge and bleeds. Charges do not survive a zone change.`},
   {n:'No Attribution',ab:'',a:0,d:L=>`Passive. While Incognito is up, laying a mine does not break it, and the mine arms faster. Nothing, while you can be seen.`},
   {n:'Dead Drop',ab:'DEAD\nDROP',a:1,cost:12,cd:3,d:L=>`Place a mark. Activate again to appear there. One mark. It does not explode.`},
   {n:'Cutout',ab:'',a:0,d:L=>`Passive. The first hit that would destroy a mine or a sockpuppet is ignored. It does not apply to you.`},
   {n:'We Were Never Here',ab:'NEVER\nHERE',a:1,cost:20,cd:16,d:L=>`Every mine and sockpuppet goes off as a silence, and you drop into Incognito. If you have none, nothing happens.`}]},
 founder:{n:'Founder',tag:'{He} left the Board with a grudge and a headcount. Summons a workforce and lets it do the dying.',good:'letting other people fight. Interns, a drone and a hulking enforcer fight for you, each intern alive cuts the damage you take, and you can turn a machine to your side.',weak:'being alone. Your own attacks are the weakest of any class, workers die and have to be hired again, and a bigger staff means you personally hit softer (Org Debt).',bld:'Headcount hires everyone and lets them grow stronger the longer they live. Hostile Takeover converts machines, then explodes your staff and the corpses. Iron Founder has no staff at all and fights in a Mech Suit.',hp:FORMULAS.cls.founder.hp,hpL:FORMULAS.cls.founder.hpL,melee:false,mult:.7,ivl:.6,spd:4,col:'#26262e',
  sk:[
   {n:'Interns',ab:'INTERN',a:1,cost:8,cd:.5,d:L=>`Summon an intern that fights for ${pct(.35+.05*L)}. You keep up to ${Math.min(7,2+Math.floor(L/2))}. They follow you everywhere, step in front of a blow, and each one alive cuts the damage you take by 5%, up to 20%.`},
   {n:'Cease & Desist',ab:'CEASE &\nDESIST',a:1,cost:14,cd:7,d:L=>`Bind every machine in an area for ${(2+.3*L).toFixed(1)}s and deal ${pct(.8+.15*L)}.`},
   {n:'Equity',ab:'',a:0,d:L=>`Passive. Your workforce deals +${8*L}% damage and you gain +${3*L}% life.`},
   {n:'Contractors',ab:'CONTR-\nACTOR',a:1,cost:14,cd:1,d:L=>`Summon a drone that shoots for ${pct(.45+.07*L)}. You keep up to ${1+Math.floor(L/3)}.`},
   {n:'Crunch',ab:'CRUNCH',a:1,cost:20,cd:16,d:L=>`For ${8+L}s your workforce attacks 60% faster and hits 30% harder.`},
   {n:'Mech Suit',ab:'MECH\nSUIT',a:1,cost:25,cd:22,d:L=>`For ${10+L}s: double armor, and your attacks become slams of ${pct(1.6+.25*L)}. Heals you 30% of your life.`},
   {n:'Chief of Staff',ab:'CHIEF',a:1,cost:30,cd:10,d:L=>`Summon one hulking enforcer that machines attack first. It hits for ${pct(1.2+.2*L)} in an arc.`},
   {n:'Acqui-hire',ab:'ACQUI-\nHIRE',a:1,cost:28,cd:18,d:L=>`Turn the nearest machine to your side for ${12+2*L}s.${L>=5?' Champions too.':' Champions resist until rank 5.'}`},
   {n:'Layoffs',ab:'LAY-\nOFFS',a:1,cost:10,cd:12,d:L=>`Every summoned worker explodes for ${pct(2+.4*L)}. Each one heals you 5%.`},
   {n:'Garden Leave',ab:'GARDEN\nLEAVE',a:1,cost:16,cd:10,d:L=>`Requires a worker or a converted machine killed in the last 4s. Curse whatever killed them: ${pct(.4+.06*L)} a second for ${(4+.3*L).toFixed(1)}s, and they cannot be healed. With no body, nothing happens.`},
   {n:'Non-Compete',ab:'NON-\nCOMPETE',a:1,cost:14,cd:8,d:L=>`One machine can attack only you for ${(5+.3*L).toFixed(1)}s. Your workforce will not hit it.`},
   {n:'Vesting',ab:'',a:0,d:L=>`Passive. A worker gains a stack every 3s it stays alive. Each stack is +${4+L}% damage. Summoning over them, or laying them off, takes every stack.`},
   {n:'Term Sheet',ab:'TERM\nSHEET',a:1,cost:28,cd:14,d:L=>`One officer. You may feed it a weapon from your pack. The weapon is consumed, and the officer strikes with that damage type for ${pct(.9+.12*L)}. Empty-handed, it is weaker and it is Impact.`},
   {n:'Org Debt',ab:'',a:0,d:L=>`Passive. Each worker on the field cuts the damage you deal by ${4+L}% and raises theirs by ${8+L}%. It stacks. Swing it yourself with a full headcount and you are playing this class wrong.`},
   {n:'Liquidation',ab:'LIQUID-\nATION',a:1,cost:18,cd:9,d:L=>`Enemy corpses within 5 paces explode for ${pct(1.1+.15*L)}. Your staff does not. Layoffs is the button that spends them.`}]},
 homesteader:{n:'Homesteader',tag:'Lives on the verge the Office says does not exist. Tends a plot, wears a dead machine, or keeps a flock that does not love them.',good:'owning a patch of ground. Rust plots slow and wear machines down, you can climb inside a tough machine shell, and you keep a flock of drones and a bull. The second-most life in the game.',weak:'doing everything at once. Wearing a form ends your plots and switches off your flock, damage builds slowly, and drones that stray too far will bite you.',bld:'Cold Bed plants rust plots, feeds them with Compost and walls machines in with Hedgerow. Inside the Hull wears a machine shell whose armour grows the longer you stay in it. What Follows sends strays and a bull, then turns them into plots.',hp:FORMULAS.cls.homesteader.hp,hpL:FORMULAS.cls.homesteader.hpL,melee:false,mult:1,ivl:.55,spd:4.3,col:'#6a8f62',
  sk:[
   {n:'Cold Frame',ab:'COLD\nFRAME',a:1,cost:12,cd:6,d:L=>`A rust patch with a 2.2-pace radius for 6 seconds. It slows, and deals ${pct(.22+.04*L)} every half second. It ends if you enter a chassis. While you have a plot down you take 12% less, and 4% less for each further plot, up to 28%.`},
   {n:'Wear the Hound',ab:'HOUND',a:1,cost:8,cd:1,d:()=>`Become the hound: faster, melee, less armour. Plot and flock skills grey out. A ranged weapon keeps its damage and loses its reach. Click Hound again to step out, or Shed. Your hands are busy for 0.7s either way.`},
   {n:'Strays',ab:'STRAYS',a:1,cost:10,cd:1,d:L=>`A feral drone, up to ${Math.min(4,2+Math.floor(L/3))}, biting for ${pct(.32+.05*L)}. Past 4.5 paces they stop obeying and will hit you if you are closest.`},
   {n:'Compost',ab:'COMPOST',a:1,cost:8,cd:2,d:L=>`A corpse within 3 paces sinks. Your next plot skill deals ${Math.round((1.35+.05*L)*100)}% damage. With no body, nothing happens.`},
   {n:'Wear the Hull',ab:'HULL',a:1,cost:12,cd:1,d:()=>`Climb into the hull: slower, more armour, no dash. Hound skills grey out. The same reach collapse. Drops the hound if you were wearing it. Click Hull again to step out, or Shed.`},
   {n:'The Bull',ab:'BULL',a:1,cost:18,cd:8,d:L=>`One bull. It chooses its own target and hits for ${pct(.9+.12*L)}. You cannot ride it.`},
   {n:'Hedgerow',ab:'HEDGE',a:1,cost:14,cd:8,d:()=>`A line that blocks movement for 4 seconds. Machines and you.`},
   {n:'Shed',ab:'SHED',a:1,cost:4,cd:1.2,d:()=>`Leave the form. Your hands are busy for 0.7s. Plot and flock work again.`},
   {n:'Go Feral',ab:'',a:0,d:L=>`Passive. Drones past the leash deal +${Math.round((.4+.05*L)*100)}% damage and will not come back when you do.`},
   {n:'Kill Frost',ab:'KILL\nFROST',a:1,cost:22,cd:14,d:L=>`Rust weather, 3.4 paces, for 8 seconds, ${pct(.35+.06*L)} every half second. It ends the moment you enter a chassis.`},
   {n:'Wear What You Killed',ab:'WEAR\nKILL',a:1,cost:16,cd:8,d:()=>`Consume a machine that is not elite and wear it until you shed. You deal its damage type. Your flock despawns. Your weapons lose their range.`},
   {n:'Rootbound',ab:'',a:0,d:()=>`Passive. Drones standing in your plots do not leash. Step out and the rule returns.`},
   {n:'Salt the Earth',ab:'SALT',a:1,cost:18,cd:12,d:L=>`Every plot you have placed bursts for ${pct(.8+.12*L)} rust and is gone.`},
   {n:'Too Big for the Door',ab:'',a:0,d:L=>`Passive. The hull cannot dash. Armour in the hull rises the longer you have worn it: +${3*L} every 2 seconds, up to 8 times.`},
   {n:'Slaughter Weight',ab:'SLAUGH-\nTER',a:1,cost:20,cd:12,d:L=>`Each drone and the bull become a rust plot where they stand, ${pct(.28+.05*L)} every half second. The flock is spent. You cannot do this from a chassis.`}]},
 witness:{n:'Witness',tag:'Kept notes when Unity told everyone to stop looking. Stillwater watches and does nothing. The Witness writes it down. The record is paper.',good:'one marked machine at a time. Watch a machine to build Testimony, then spend your Record on a single very large hit. Strong built-in damage reduction, and skills that make the whole party hit harder.',weak:'crowds, and an empty Record. The slowest attacks in the game, no good way to clear a room, and the hardest class to learn.',bld:'The Page watches, delays the next blow, and pulls the thread for one big hit. Named in the Notes plays support, marking machines so allies hit harder. Above Eighty keeps the Record full for defence, with one save from death.',hp:FORMULAS.cls.witness.hp,hpL:FORMULAS.cls.witness.hpL,melee:true,mult:.92,ivl:.68,spd:4.2,col:'#8d9aab',
  sk:[
   {n:'Look',ab:'LOOK',a:1,cost:4,cd:.5,d:()=>`Mark one machine with Testimony. The stack grows while you can see them and you are not casting. No Record cost. A swing against a marked machine hits 7% harder for each point of Testimony, up to six.`},
   {n:'The Sentence',ab:'THE\nSENTENCE',a:1,cost:8,cd:2,d:L=>`Spend Record, up to 25. Delay that machine's next attack by ${(0.4+.08*L).toFixed(2)}s at a full page. Less Record, a shorter delay. For 2.4s afterward you take 48% less, and an empty page does not punish you while that holds.`},
   {n:'Margin',ab:'',a:0,d:L=>`Passive. Below half life the Record fills ${20*L}% faster.`},
   {n:'Cross-reference',ab:'CROSS-\nREF',a:1,cost:14,cd:6,d:L=>`Spend 20 Record. Copy that machine's last attack onto another machine you have Testimony on, at ${Math.round((.75+.05*L)*100)}% of the blow.`},
   {n:'Pull the Thread',ab:'PULL THE\nTHREAD',a:1,cost:12,cd:4,d:L=>`Spend most of the Record. One Impact hit, ${(4.6+.5*L).toFixed(1)} for each point of Testimony, a little more when the page you spend is full, and your weapon is not consulted. No Testimony, no blow, and an empty page is not spent. 42% more for each level after the first, so the page keeps up with the machines.`},
   {n:'Filed',ab:'',a:0,d:L=>`Passive. Testimony does not decay for ${(2+.4*L).toFixed(1)}s after the machine leaves the screen.`},
   {n:'Correction',ab:'CORRECT',a:1,cost:10,cd:8,d:()=>`Once per district. Spend the whole Record to restore the life you lost on the last hit, not a share of your maximum. An empty Record corrects nothing.`},
   {n:'Redaction',ab:'REDACT',a:1,cost:12,cd:8,d:()=>`Spend 30 Record. For 2s machines can see you and cannot land a blow. They still path toward you. This is not stealth.`},
   {n:'The Footnote',ab:'',a:0,d:L=>`Passive. The Record fills ${8*L}% faster. Maximum life is ${4*L}% lower.`},
   {n:'On the Record',ab:'ON THE\nRECORD',a:1,cost:16,cd:10,d:L=>`Spend 25 Record. A machine with high Testimony takes ${12*L}% more damage from everyone for 8s, including people with no points in this class.`},
   {n:'Unnamed Source',ab:'UNNAMED\nSOURCE',a:1,cost:14,cd:12,d:()=>`Spend 20 Record. Grant one ally, or your hireling, a single swing that deals Sound. Then it is gone. You never deal Sound.`},
   {n:'Colophon',ab:'',a:0,d:L=>`Passive. ${14+3*L}% damage reduction. Record above 80: you take ${Math.min(45,4*L)}% less on top of that. Record below 20: you take ${3*L}% more. The meter is the defence.`},
   {n:'Publish',ab:'PUBLISH',a:1,cost:18,cd:14,d:L=>`Consume all Testimony on screen. Each second you watched is ${pct(1.6+.25*L)} Impact. The Record drops to 0. 1% more for each level you have.`},
   {n:'Named Party',ab:'',a:0,d:L=>`Passive. Allies deal +${5*L}% damage to machines you have Testimony on. You do not.`},
   {n:'Retraction',ab:'',a:0,d:()=>`Passive. If you would die with Record above 80, you drop to 1 life, the Record hits 0, and this cannot happen again for a long time. If you would die with an empty Record, you die.`}]},
 /* Unlocked by finishing the story. Deals Sound damage, which nothing resists, because
    that is the joke and also the build. */
 maxi:{n:'The Maximalist',tag:'A paladin, essentially. {He} has not had a new thought since 2017 and has never needed one. {His} auras are always on, and everything {he} does is Sound damage, which nothing in this world resists.',good:'never being resisted. Everything {he} does is Sound damage, which nothing resists. Always-on auras help everyone fighting beside {him}, and {he} gets stronger with more machines on screen.',weak:'distance. {He} has to be close, and only one aura can be on at a time.',bld:'Orange Pilled keeps Marked to Market on, fires Cite Your Sources through it, and turns all other damage into Sound.',hp:FORMULAS.cls.maxi.hp,hpL:FORMULAS.cls.maxi.hpL,melee:true,mult:1.2,ivl:.5,spd:4.2,col:'#f7931a',locked:'story',
  sk:[
   {n:'Tick Tock Next Block',ab:'TICK\nTOCK',a:1,cost:9,cd:2.4,d:L=>`Nine quick strikes of ${pct(.5+.08*L)}. The tenth is a block and lands for ${pct(4+.8*L)}. While the strikes are landing, and for 2.2s after the block, you take 22% less.`},
   {n:'Have Fun Staying Poor',ab:'HAVE FUN\nSTAYING\nPOOR',a:1,cost:12,cd:4,d:L=>`Close range, ${pct(1.4+.25*L)}. It cannot miss, and it stuns for ${(1.2+.15*L).toFixed(1)}s.`},
   {n:'Few Understand This',ab:'',a:0,d:L=>`Passive. +${3*L}% damage for every machine still standing on screen, up to eight. Each one within six paces also cuts the damage you take by 6%, up to five.`},
   {n:'Toxic Maximalism',ab:'TOXIC\nMAXI',a:1,aura:1,cost:0,cd:1.5,d:L=>`Aura. Stays on until you put on another. You attack ${15+3*L}% faster and hit ${pct(.2+.05*L)} harder, and so does anybody fighting beside you. You run 50% faster.`},
   {n:'Marked to Market',ab:'MARKED\nMKT',a:1,aura:1,cost:0,cd:1.5,d:L=>{const bonus=Math.max(30,20+4*L);return `Aura. Everything within ${(3.5+.15*L).toFixed(1)} paces of you takes +${bonus}% damage from every source.`}},
   {n:'Orange Pill',ab:'ORANGE\nPILL',a:1,cost:11,cd:5,d:L=>{const sec=Math.round((6+.3*L)*10)/10;return `Charge through the line, untouchable, for ${pct(1.6+.3*L)} to everything you pass. Whatever survives takes +30% damage for ${sec}s.`}},
   {n:'Blessed Hashrate',ab:'BLESSED\nHASHRATE',a:1,cost:16,cd:1.1,d:L=>`Hammers spiral out from you, ${pct(1.1+.22*L)} each, and they do not stop at the first thing they meet.`},
   {n:'Proof of Work',ab:'PROOF\nOF WORK',a:1,aura:1,cost:0,cd:1.5,d:L=>`Aura. Everything near you takes ${pct(.3+.07*L)} twice a second, for as long as you are near it.`},
   {n:'Twenty-One Million',ab:'',a:0,d:L=>`Passive. +${3*L}% damage, +${8*L}% armour, and +${8+2*L}% damage reduction. The difficulty cannot dilute what you hit for.`},
   {n:'The Halving',ab:'THE\nHALVING',a:1,cost:16,cd:8,d:L=>`Sound. Each machine within 4.2 paces loses ${(8+1.2*L).toFixed(1)}% of its current life. It will not be pushed below 35% of its maximum.`},
   {n:'Running a Node',ab:'',a:0,d:L=>`Passive. While an aura is on, allies and your hireling gain +${6+2*L}% damage. You gain half of that. With the aura off, nothing.`},
   {n:'Cite Your Sources',ab:'CITE YOUR\nSOURCES',a:1,cost:14,cd:6,d:L=>`A volley of Sound, and only while an aura is on. Toxic Maximalism makes it fast and light. Marked to Market makes it slow and heavy. Proof of Work makes it tick. No aura, no volley.`},
   {n:'Priced in Sound',ab:'',a:0,d:L=>`Passive. Damage you deal that is not Sound becomes Sound, and you keep ${55+3*L}% of it.`},
   {n:'The Dip',ab:'THE DIP',a:1,cost:12,cd:22,d:L=>`You ignore the next hit. You choose when. It does not fire itself when you fall.`},
   {n:'Not Your Keys',ab:'',a:0,d:L=>`Passive. If a hireling or a rendered companion is alive, the hit that would kill you kills them instead, once a minute. Alone, it does nothing.`}]}
});
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
