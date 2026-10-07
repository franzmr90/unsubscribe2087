/* ================= util ================= */
const $=id=>document.getElementById(id);
const rnd=(a,b)=>a+Math.random()*(b-a), ri=(a,b)=>Math.floor(rnd(a,b+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const pct=x=>Math.round(x*100)+'%';
const UNITS=['','K','M','B','T','Qa','Qi','Sx','Sp','Oc','No','Dc'];
function fmt(n){let i=0;while(n>=1000&&i<UNITS.length-1){n/=1000;i++}return '₡'+(i?n.toFixed(n<10?2:n<100?1:0):Math.floor(n))+UNITS[i]}
function wpick(pairs){let s=0;for(const p of pairs)s+=p[1];let r=Math.random()*s;for(const p of pairs){r-=p[1];if(r<=0)return p[0]}return pairs[0][0]}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ================= classes and skill trees =================
   Three columns. Rows open at levels 1, 4, 9, 26 and 51.
   Each skill needs one point in the skill above it, and gains +6% per point in that skill.
   Rows 4 and 5 are that class's own skills. */
const ROWREQ=[1,4,9,26,51];
const CLS={
 scrapper:{n:'Scrapper',tag:'A laid-off line worker with a road sign and a grudge. Tough, close range.',hp:130,hpL:17,melee:true,mult:1.25,ivl:.6,spd:4.1,col:'#d9822b',
  sk:[
   {n:'Stop Sign',ab:'STOP\nSIGN',a:1,cost:5,cd:.8,d:L=>`A wide swing that hits everything in front for ${pct(1.3+.15*L)} damage, with a ${15+2*L}% chance to stun.`},
   {n:'Hurl',ab:'HURL',a:1,cost:6,cd:.6,d:L=>`Throw scrap that passes through enemies for ${pct(1.2+.2*L)} damage.`},
   {n:'Iron Hide',ab:'',a:0,d:L=>`Passive. +${8*L}% armor and +${4*L}% life.`},
   {n:'Turnstile',ab:'TURN-\nSTILE',a:1,cost:12,cd:1.5,d:L=>`Spin and strike all nearby enemies for ${pct(1.5+.22*L)} damage.`},
   {n:'Picket Rush',ab:'PICKET\nRUSH',a:1,cost:12,cd:4,d:L=>`Rush forward, untouchable, hitting each enemy in the path for ${pct(1.2+.3*L)}.`},
   {n:'War Horn',ab:'WAR\nHORN',a:1,cost:16,cd:10,d:L=>`Stun enemies around you for ${(1+.2*L).toFixed(1)}s and gain +60% armor for 8s.`},
   {n:'Overtime',ab:'OVER-\nTIME',a:1,cost:25,cd:18,d:L=>`For ${6+L}s: +40% attack speed and ${6+L}% life stolen per hit.`},
   {n:'Earthbreaker',ab:'EARTH-\nBREAKER',a:1,cost:20,cd:7,d:L=>`Leap to the nearest enemy and slam for ${pct(2.2+.35*L)} in a wide area.`},
   {n:'Solidarity',ab:'',a:0,d:L=>`Passive. +${4*L}% damage for each enemy near you, up to five.`},
   {n:'Lunch Pail',ab:'LUNCH\nPAIL',a:1,cost:16,cd:14,d:L=>`Set it down. You and anyone fighting beside it recover ${(2+.4*L).toFixed(1)}% of their life each second from the pail, until its stores (${Math.round(28+6*L)}% of your life) run out.`},
   {n:'Seniority',ab:'',a:0,d:L=>`Passive. The damage type on the weapon in your hand gains +${6*L}%.`},
   {n:'Hold the Line',ab:'',a:0,d:L=>`Passive. Each second you have not dashed adds ${4*L} armour, up to six seconds. A dash spends it.`},
   {n:'Call the Strike',ab:'CALL THE\nSTRIKE',a:1,cost:18,cd:11,d:L=>`A horn. Ordinary machines are pushed back. Elites and bosses are pulled in. Everyone caught takes ${pct(.55+.08*L)} noise.`},
   {n:'Two-Handed',ab:'TWO-\nHANDED',a:1,cost:14,cd:9,d:L=>`Your next three swings are slow, cannot be interrupted, and hit a wider arc.`},
   {n:'Last Shift',ab:'LAST\nSHIFT',a:1,cost:24,cd:22,d:L=>`For ${(4+.3*L).toFixed(1)}s your swings leech ${8+L}% and you do not flinch. If you fall while it is up, you fall.`}]},
 hacker:{n:'Technomancer',tag:'An IT contractor who read the machines’ source and learned to curse in it. Fragile, ranged, clears crowds.',hp:85,hpL:12,melee:false,mult:1.1,ivl:.62,spd:4.1,col:'#9a6cff',
  sk:[
   {n:'Arc Chain',ab:'ARC\nCHAIN',a:1,cost:11,cd:1.2,d:L=>`Lightning that leaps through ${3+Math.floor(L/2)} enemies for ${pct(1.2+.18*L)} each.`},
   {n:'Spark Lance',ab:'SPARK\nLANCE',a:1,cost:5,cd:.5,d:L=>`A bolt that pierces every enemy in a line for ${pct(1.4+.2*L)}. Primes your next Arc Chain within 3 seconds for +30%.`},
   {n:'Cipher Ward',ab:'',a:0,d:L=>`Passive. ${Math.min(60,6*L)}% of damage taken drains energy instead of life.`},
   {n:'Null Nova',ab:'NULL\nNOVA',a:1,cost:18,cd:7,d:L=>`A blast around you: ${pct(.9+.2*L)} damage and ${(1.5+.2*L).toFixed(1)}s stun.`},
   {n:'Watchdog',ab:'WATCH-\nDOG',a:1,cost:25,cd:16,d:L=>`Deploy a turret for ${10+2*L}s that fires for ${pct(.5+.08*L)} per shot.`},
   {n:'Overclock',ab:'',a:0,d:L=>`Passive. +${L} energy per second and ${3*L}% faster skill recovery.`},
   {n:'Black Storm',ab:'BLACK\nSTORM',a:1,cost:30,cd:12,d:L=>`Call a storm for 4s. Each strike deals ${pct(.7+.12*L)}.`},
   {n:'Botnet',ab:'BOTNET',a:1,cost:30,cd:20,d:L=>`Hijack three drones for ${15+L}s. Each bite deals ${pct(.4+.07*L)}.`},
   {n:'Zero Day',ab:'',a:0,d:L=>`Passive. +${3*L}% deadly strike chance, and deadly strikes deal ${pct(2+.1*L)}.`},
   {n:'Ground Fault',ab:'GROUND\nFAULT',a:1,cost:14,cd:6,d:L=>`A line of heat on the floor for ${(3.2+.15*L).toFixed(1)}s, ${pct(.4+.06*L)} every half second. Casting it locks your hands for a moment.`},
   {n:'Packet Storm',ab:'PACKET\nSTORM',a:1,cost:16,cd:8,d:L=>`Mark a spot. A noise storm arrives there after a short delay and strikes for ${pct(.5+.08*L)}. Walking away does not move it.`},
   {n:'Schema',ab:'',a:0,d:L=>`Passive. You work in one element${G&&G.schema?': '+DTY[G.schema].n:''}. Damage of that type gains +${8*L}%. The other two do not. Sister Null can make you choose again. Dying cannot.`},
   {n:'Step Back',ab:'STEP\nBACK',a:1,cost:8,cd:4,d:L=>`About four paces back along your facing.`},
   {n:'Patched',ab:'',a:0,d:L=>`Passive. ${Math.round((10+2*L))}% of the Surge damage you deal becomes a barrier, up to ${Math.round(20+2*L)}% of your life. Nothing, if your Schema is Heat or Noise.`},
   {n:'Kill Dash Nine',ab:'KILL -9',a:1,cost:26,cd:16,d:L=>`One machine, for ${pct(2.8+.4*L)} of your Schema element. It ignores that element's resistance, once. A resistance of zero is still a wall. Casting it locks your hands.`}]},
 courier:{n:'Runner',tag:'A courier who stopped delivering and kept running. Fast feet, faster hands.',hp:100,hpL:14,melee:false,mult:.82,ivl:.4,spd:4.8,col:'#3fbf8f',
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
   {n:'Second Drop',ab:'SECOND\nDROP',a:1,cost:16,cd:10,d:L=>`One decoy copies your last throw, then stays on a short leash. Leave it behind and it pops.`},
   {n:'Manifest',ab:'MANIFEST',a:1,cost:14,cd:6,d:L=>`A piercing throw for ${pct(1+.14*L)} that splits into two after the first machine it hits.`},
   {n:'Hazard Pay',ab:'',a:0,d:L=>`Passive. A throw that kills pays ${3+L} extra credits and finds gear as if you had +${6*L}% magic find. A dash does not pay.`},
   {n:'Missed Connection',ab:'MISSED\nCONN',a:1,cost:18,cd:12,d:L=>`Mark a machine. If it dies within ${(4+.25*L).toFixed(1)}s, to you or to anyone with you, you appear where it fell and your next throw costs nothing.`}]}
};
Object.assign(CLS,{
 anon:{n:'Anon',tag:'No name, no face, no account. Traps, vanishing acts and a knife from behind.',hp:95,hpL:13,melee:true,mult:1,ivl:.42,spd:4.7,col:'#3f3f4c',
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
 founder:{n:'Founder',tag:'He left the Board with a grudge and a headcount. Summons a workforce and lets it do the dying.',hp:90,hpL:12,melee:false,mult:.7,ivl:.6,spd:4,col:'#26262e',
  sk:[
   {n:'Interns',ab:'INTERN',a:1,cost:8,cd:.5,d:L=>`Summon an intern that fights for ${pct(.35+.05*L)}. You keep up to ${Math.min(7,2+Math.floor(L/2))}. They follow you everywhere.`},
   {n:'Cease & Desist',ab:'CEASE &\nDESIST',a:1,cost:14,cd:7,d:L=>`Bind every machine in an area for ${(2+.3*L).toFixed(1)}s and deal ${pct(.8+.15*L)}.`},
   {n:'Equity',ab:'',a:0,d:L=>`Passive. Your workforce deals +${8*L}% damage and you gain +${3*L}% life.`},
   {n:'Contractors',ab:'CONTR-\nACTOR',a:1,cost:14,cd:1,d:L=>`Summon a drone that shoots for ${pct(.45+.07*L)}. You keep up to ${1+Math.floor(L/3)}.`},
   {n:'Crunch',ab:'CRUNCH',a:1,cost:20,cd:16,d:L=>`For ${8+L}s your workforce attacks 60% faster and hits 30% harder.`},
   {n:'Mech Suit',ab:'MECH\nSUIT',a:1,cost:25,cd:22,d:L=>`For ${10+L}s: double armor, and your attacks become slams of ${pct(1.6+.25*L)}.`},
   {n:'Chief of Staff',ab:'CHIEF',a:1,cost:30,cd:10,d:L=>`Summon one hulking enforcer that machines attack first. It hits for ${pct(1.2+.2*L)} in an arc.`},
   {n:'Acqui-hire',ab:'ACQUI-\nHIRE',a:1,cost:28,cd:18,d:L=>`Turn the nearest machine to your side for ${12+2*L}s.${L>=5?' Champions too.':' Champions resist until level 5.'}`},
   {n:'Layoffs',ab:'LAY-\nOFFS',a:1,cost:10,cd:12,d:L=>`Every summoned worker explodes for ${pct(2+.4*L)}. Each one heals you 5%.`},
   {n:'Garden Leave',ab:'GARDEN\nLEAVE',a:1,cost:16,cd:10,d:L=>`Requires a worker or a converted machine killed in the last 4s. Curse whatever killed them: ${pct(.4+.06*L)} a second for ${(4+.3*L).toFixed(1)}s, and they cannot be healed. With no body, nothing happens.`},
   {n:'Non-Compete',ab:'NON-\nCOMPETE',a:1,cost:14,cd:8,d:L=>`One machine can attack only you for ${(5+.3*L).toFixed(1)}s. Your workforce will not hit it.`},
   {n:'Vesting',ab:'',a:0,d:L=>`Passive. A worker gains a stack every 3s it stays alive. Each stack is +${4+L}% damage. Summoning over them, or laying them off, takes every stack.`},
   {n:'Term Sheet',ab:'TERM\nSHEET',a:1,cost:28,cd:14,d:L=>`One officer. You may feed it a weapon from your pack. The weapon is consumed, and the officer strikes with that damage type for ${pct(.9+.12*L)}. Empty-handed, it is weaker and it is Impact.`},
   {n:'Org Debt',ab:'',a:0,d:L=>`Passive. Each worker on the field cuts the damage you deal by ${4+L}% and raises theirs by ${8+L}%. It stacks. Swing it yourself with a full headcount and you are playing this class wrong.`},
   {n:'Liquidation',ab:'LIQUID-\nATION',a:1,cost:18,cd:9,d:L=>`Enemy corpses within 5 paces explode for ${pct(1.1+.15*L)}. Your staff does not. Layoffs is the button that spends them.`}]},
 homesteader:{n:'Homesteader',tag:'Lives on the verge the Office says does not exist. Tends a plot, wears a dead machine, or keeps a flock that does not love them.',hp:110,hpL:15,melee:false,mult:1,ivl:.55,spd:4.3,col:'#6a8f62',
  sk:[
   {n:'Cold Frame',ab:'COLD\nFRAME',a:1,cost:12,cd:6,d:L=>`A rust patch 2.2 paces across for 6 seconds. It slows, and deals ${pct(.22+.04*L)} every half second. It ends if you enter a chassis.`},
   {n:'Wear the Hound',ab:'HOUND',a:1,cost:8,cd:1,d:()=>`Become the hound: faster, melee, less armour. Plot and flock skills grey out. A ranged weapon keeps its damage and loses its reach. Shed to leave.`},
   {n:'Strays',ab:'STRAYS',a:1,cost:10,cd:1,d:L=>`A feral drone, up to ${Math.min(4,2+Math.floor(L/3))}, biting for ${pct(.32+.05*L)}. Past 4.5 paces they stop obeying and will hit you if you are closest.`},
   {n:'Compost',ab:'COMPOST',a:1,cost:8,cd:2,d:L=>`A corpse within 3 paces sinks. Your next plot skill deals ${Math.round((1.35+.05*L)*100)}% damage. With no body, nothing happens.`},
   {n:'Wear the Hull',ab:'HULL',a:1,cost:12,cd:1,d:()=>`Climb into the hull: slower, more armour, no dash. Hound skills grey out. The same reach collapse. Drops the hound if you were wearing it.`},
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
 witness:{n:'Witness',tag:'Kept notes when Unity told everyone to stop looking. Stillwater watches and does nothing. The Witness writes it down. The record is paper.',hp:80,hpL:11,melee:true,mult:.72,ivl:.68,spd:4.2,col:'#8d9aab',
  sk:[
   {n:'Look',ab:'LOOK',a:1,cost:4,cd:.5,d:()=>`Mark one machine with Testimony. The stack grows while you can see them and you are not casting. No Record cost.`},
   {n:'The Sentence',ab:'THE\nSENTENCE',a:1,cost:8,cd:2,d:L=>`Spend Record, up to 25. Delay that machine's next attack by ${(0.4+.08*L).toFixed(2)}s at a full page. Less Record, a shorter delay.`},
   {n:'Margin',ab:'',a:0,d:L=>`Passive. Below half life the Record fills ${20*L}% faster.`},
   {n:'Cross-reference',ab:'CROSS-\nREF',a:1,cost:14,cd:6,d:L=>`Spend 20 Record. Copy that machine's last attack onto another machine you have Testimony on, at ${Math.round((.75+.05*L)*100)}% of the blow.`},
   {n:'Pull the Thread',ab:'PULL THE\nTHREAD',a:1,cost:12,cd:4,d:L=>`Spend most of the Record. One Impact hit: each point of Testimony on the target is ${pct(3.5+.45*L)} of a weapon swing's weight, and your weapon is not consulted. No Testimony, no blow.`},
   {n:'Filed',ab:'',a:0,d:L=>`Passive. Testimony does not decay for ${(2+.4*L).toFixed(1)}s after the machine leaves the screen.`},
   {n:'Correction',ab:'CORRECT',a:1,cost:10,cd:8,d:()=>`Once per district. Spend the whole Record to restore the life you lost on the last hit, not a share of your maximum. An empty Record corrects nothing.`},
   {n:'Redaction',ab:'REDACT',a:1,cost:12,cd:8,d:()=>`Spend 30 Record. For 2s machines can see you and cannot land a blow. They still path toward you. This is not stealth.`},
   {n:'The Footnote',ab:'',a:0,d:L=>`Passive. The Record fills ${8*L}% faster. Maximum life is ${4*L}% lower.`},
   {n:'On the Record',ab:'ON THE\nRECORD',a:1,cost:16,cd:10,d:L=>`Spend 25 Record. A machine with high Testimony takes ${12*L}% more damage from everyone for 8s, including people with no points in this class.`},
   {n:'Unnamed Source',ab:'UNNAMED\nSOURCE',a:1,cost:14,cd:12,d:()=>`Spend 20 Record. Grant one ally, or your hireling, a single swing that deals Sound. Then it is gone. You never deal Sound.`},
   {n:'Colophon',ab:'',a:0,d:L=>`Passive. Record above 80: you take ${Math.min(45,4*L)}% less damage. Record below 20: you take ${6*L}% more. The meter is the defence.`},
   {n:'Publish',ab:'PUBLISH',a:1,cost:18,cd:14,d:L=>`Consume all Testimony on screen. Each second you watched is ${pct(1.6+.25*L)} Impact. The Record drops to 0.`},
   {n:'Named Party',ab:'',a:0,d:L=>`Passive. Allies deal +${5*L}% damage to machines you have Testimony on. You do not.`},
   {n:'Retraction',ab:'',a:0,d:()=>`Passive. If you would die with Record above 80, you drop to 1 life, the Record hits 0, and this cannot happen again for a long time. If you would die with an empty Record, you die.`}]},
 /* Unlocked by finishing the story. Deals Sound damage, which nothing resists, because
    that is the joke and also the build. */
 maxi:{n:'The Maximalist',tag:'A paladin, essentially. He has not had a new thought since 2017 and has never needed one. His auras are always on, and everything he does is Sound damage, which nothing in this world resists.',hp:104,hpL:14,melee:true,mult:1.2,ivl:.5,spd:4.2,col:'#f7931a',locked:'story',
  sk:[
   {n:'Tick Tock Next Block',ab:'TICK\nTOCK',a:1,cost:9,cd:2.4,d:L=>`Nine quick strikes of ${pct(.5+.08*L)}. The tenth is a block and lands for ${pct(4+.8*L)}.`},
   {n:'Have Fun Staying Poor',ab:'HAVE FUN\nSTAYING\nPOOR',a:1,cost:12,cd:4,d:L=>`Close range, ${pct(1.4+.25*L)}. It cannot miss, and it stuns for ${(1.2+.15*L).toFixed(1)}s.`},
   {n:'Few Understand This',ab:'',a:0,d:L=>`Passive. +${3*L}% damage for every machine still standing on screen, up to eight.`},
   {n:'Toxic Maximalism',ab:'TOXIC\nMAXI',a:1,aura:1,cost:0,cd:1.5,d:L=>`Aura. Stays on until you put on another. You attack ${15+3*L}% faster and hit ${pct(.2+.05*L)} harder, and so does anybody fighting beside you.`},
   {n:'Marked to Market',ab:'MARKED\nMKT',a:1,aura:1,cost:0,cd:1.5,d:L=>`Aura. Everything within ${(3.5+.15*L).toFixed(1)} paces of you takes +${20+4*L}% damage from every source.`},
   {n:'Orange Pill',ab:'ORANGE\nPILL',a:1,cost:11,cd:5,d:L=>`Charge through the line, untouchable, for ${pct(1.6+.3*L)} to everything you pass. Whatever survives takes +30% damage for ${(6+.3*L).toFixed(0)}s.`},
   {n:'Blessed Hashrate',ab:'BLESSED\nHASHRATE',a:1,cost:16,cd:1.1,d:L=>`Hammers spiral out from you, ${pct(1.1+.22*L)} each, and they do not stop at the first thing they meet.`},
   {n:'Proof of Work',ab:'PROOF\nOF WORK',a:1,aura:1,cost:0,cd:1.5,d:L=>`Aura. Everything near you takes ${pct(.3+.07*L)} twice a second, for as long as you are near it.`},
   {n:'Twenty-One Million',ab:'',a:0,d:L=>`Passive. +${3*L}% damage and +${8*L}% armour, and the difficulty cannot dilute what you hit for.`},
   {n:'The Halving',ab:'THE\nHALVING',a:1,cost:16,cd:8,d:L=>`Sound. Each machine within 4.2 paces loses ${(8+1.2*L).toFixed(1)}% of its current life. It will not be pushed below 35% of its maximum.`},
   {n:'Running a Node',ab:'',a:0,d:L=>`Passive. While an aura is on, allies and your hireling gain +${6+2*L}% damage. You gain half of that. With the aura off, nothing.`},
   {n:'Cite Your Sources',ab:'CITE YOUR\nSOURCES',a:1,cost:14,cd:6,d:L=>`A volley of Sound, and only while an aura is on. Toxic Maximalism makes it fast and light. Marked to Market makes it slow and heavy. Proof of Work makes it tick. No aura, no volley.`},
   {n:'Priced in Sound',ab:'',a:0,d:L=>`Passive. Damage you deal that is not Sound becomes Sound, and you keep ${55+3*L}% of it.`},
   {n:'The Dip',ab:'THE DIP',a:1,cost:12,cd:22,d:L=>`You ignore the next hit. You choose when. It does not fire itself when you fall.`},
   {n:'Not Your Keys',ab:'',a:0,d:L=>`Passive. If a hireling or a rendered companion is alive, the hit that would kill you kills them instead, once a minute. Alone, it does nothing.`}]}
});
const MERCS={guard:{n:'Bodyguard',d:'A reprogrammed Enforcer. Machines attack it before you.',hpM:1.8,dM:1,ivl:1,range:1.3,spd:4.6,taunt:1,col:'#7d8ba3'},
 sys:{n:'Sysadmin',d:'Shoots from range, patches your wounds every few seconds and tops up your energy.',hpM:1,dM:.6,ivl:1.2,range:5.5,spd:4.4,col:'#59c0a0'},
 node:{n:'Node Runner',d:'A Bitcoiner with a long rifle. You find 50% more satoshis.',hpM:1.1,dM:1.15,ivl:.8,range:6,spd:4.4,col:'#f7931a'},
 hound:{n:'Stray Hound',d:'Fast and vicious. Pulls credits and satoshis to you from a distance.',hpM:1.2,dM:.8,ivl:.5,range:1.1,spd:6,col:'#8a6a4a'}};
const MNAMES=['Kit','Juno','Ox','Vesper','Tallow','Rook','Sable','Finch'];
const ATTR={mgt:['Might','+1.5% damage per point'],ref:['Reflex','+0.3% deadly strike and +1 armor per point'],vit:['Vitality','+4 life per point'],bnd:['Bandwidth','+3 energy per point']};

/* ================= monsters ================= */
const ET={
 tick:{n:'Tick',hp:9,dmg:9,spd:3.9,r:.22,range:.8,xp:5,atk:1,sight:7,pal:['#e8862e','#5a3a1c']},
 drone:{n:'Carrion Drone',hp:15,dmg:4,spd:3.3,r:.28,range:.9,xp:6,atk:.9,sight:7.5,pal:['#4a4660','#d6a03c']},
 bot:{n:'Enforcer',hp:30,dmg:7,spd:2.1,r:.38,range:1.1,xp:10,atk:1.2,sight:6.5,pal:['#7d8ba3','#3c4658']},
 hound:{n:'Repo Hound',hp:24,dmg:8,spd:3.1,r:.34,range:1,xp:11,atk:1.1,sight:8,pal:['#5c6470','#b23a32']},
 ad:{n:'Siren',hp:22,dmg:6,spd:1.7,r:.34,range:5,xp:11,atk:2.1,ranged:true,sight:7.5,pal:['#e86aa8','#6a2d55']},
 hr:{n:'Mediator',hp:28,dmg:5,spd:2.2,r:.34,range:4.6,xp:14,atk:2.5,ranged:true,slow:true,sight:7.5,pal:['#7fcdb8','#35544c']},
 mech:{n:'Warden',hp:95,dmg:13,spd:1.8,r:.52,range:1.4,xp:38,atk:1.5,sight:6.5,pal:['#5a6078','#d6a03c']},
 seer:{n:'Persuader',spr:'hr',hp:34,dmg:7,spd:2.2,r:.34,range:5,xp:16,atk:2.2,ranged:true,drain:12,sight:8,pal:['#b48cff','#3d2a66']},
 aegis:{n:'Aegis Drone',spr:'drone',hp:40,dmg:4,spd:2.4,r:.32,range:4.5,xp:16,atk:2.4,ranged:true,sight:8,pal:['#5a7ab8','#9fd0ff']},
 lancer:{n:'Lancer',spr:'hound',hp:36,dmg:11,spd:3.3,r:.36,range:1.1,xp:16,atk:1.2,sight:9,pal:['#b8a05a','#ffe36b']},
 splitter:{n:'Subsidiary',spr:'bot',hp:44,dmg:8,spd:2.2,r:.4,range:1.1,xp:14,atk:1.2,sight:7,pal:['#8a5ab8','#4a2a6a']},
 boss2:{n:'Vale, Senior Vice-President',spr:'boss',hp:1100,dmg:17,spd:1.9,r:.85,range:1.8,xp:1000,atk:1.3,sight:12,pal:['#e6e2d6','#b48cff']},
 director:{n:'Director',spr:'mech',hp:120,dmg:14,spd:1.8,r:.52,range:1.4,xp:44,atk:1.5,sight:8,pal:['#3a1a22','#c22d35']},
 proxy:{n:'Proxy',spr:'bot',hp:42,dmg:10,spd:2.6,r:.38,range:1.1,xp:18,atk:1,sight:9,pal:['#d8d8e0','#6a6a78']},
 censor:{n:'Censor',spr:'ad',hp:38,dmg:8,spd:1.9,r:.34,range:5.2,xp:18,atk:2.2,ranged:true,sil:2,sight:8,pal:['#17131c','#e6e2d6']},
 boss3:{n:'MANDATE',spr:'mono',hp:1900,dmg:19,spd:0,r:1,range:1.6,xp:1500,atk:1.5,sight:13,pal:['#0b0912','#ffffff']},
 gob:{n:'Dividend Drone',spr:'drone',hp:70,dmg:0,spd:4.5,r:.3,range:0,xp:30,atk:9,sight:6,flee:1,pal:['#e0bd6e','#fff3c8']},
 boss:{n:'Pryce, Regional Vice-President',hp:700,dmg:15,spd:1.5,r:.85,range:1.8,xp:900,atk:1.4,sight:11,pal:['#2c2740','#d6a03c']}
};
var ZADJ=['','Rusted','Polished','Wired','Sanctioned','Gilded','','Greased','Pruned','Drowned','Liveried','Seraphic','Vested','Minuted','Seated','Ninth','Still'];
const isBoss=k=>k==='boss'||k==='boss2'||k==='boss3'||k==='boss4'||k==='boss5'||k==='gap';
const MODS={fast:'Extra Fast',strong:'Extra Strong',shield:'Shielded',arc:'Arc Enchanted',boom:'Volatile',leech:'Siphoning'};
const CN1=['Rust','Gloom','Static','Grime','Null','Bolt','Ash','Wire','Slag','Dread'],CN2=['gnash','maw','fang','shard','spike','grinder','wretch','claw','howl','rivet'],CN3=['the Unbilled','the Overdue','the Repossessor','the Downsizer','the Compliant','the Collector','the Unpaid','the Tireless'];

/* ================= drop tables =================
   Each kill makes `picks` rolls. A roll lands on nothing, credits, an item or a stim by weight.
   Each item then checks quality in order: unique, set, rare, magic. `q` holds the "1 in N" odds.
   Magic find raises those odds, with diminishing returns on unique, set and rare. */
const TC={
 tick:{n:'Tick',picks:1,no:76,gold:17,item:4,stim:3,q:{u:500,s:400,r:80,m:7}},
 drone:{n:'Carrion Drone',picks:1,no:62,gold:24,item:9,stim:5,q:{u:400,s:300,r:60,m:6}},
 bot:{n:'Enforcer',picks:1,no:50,gold:28,item:16,stim:6,q:{u:300,s:220,r:45,m:5}},
 hound:{n:'Repo Hound',picks:1,no:52,gold:22,item:18,stim:8,q:{u:300,s:220,r:45,m:5}},
 ad:{n:'Siren',picks:1,no:48,gold:38,item:10,stim:4,q:{u:320,s:240,r:50,m:5},goldMul:1.8,note:'Double-size credit piles'},
 hr:{n:'Mediator',picks:1,no:42,gold:24,item:20,stim:14,q:{u:260,s:200,r:35,m:4},jewel:3,note:'Rings and amulets three times as likely'},
 mech:{n:'Warden',picks:2,no:32,gold:30,item:30,stim:8,q:{u:150,s:120,r:20,m:3}},
 seer:{n:'Persuader',picks:1,no:44,gold:22,item:22,stim:12,q:{u:240,s:190,r:32,m:4},jewel:2,note:'Rings and amulets twice as likely'},
 aegis:{n:'Aegis Drone',picks:1,no:50,gold:30,item:14,stim:6,q:{u:280,s:210,r:40,m:5}},
 lancer:{n:'Lancer',picks:1,no:48,gold:22,item:22,stim:8,q:{u:260,s:200,r:36,m:4}},
 splitter:{n:'Subsidiary',picks:1,no:55,gold:30,item:10,stim:5,q:{u:320,s:240,r:50,m:5}},
 boss2:{n:'Vale',picks:8,no:0,gold:20,item:70,stim:10,q:{u:6,s:8,r:2,m:1},note:'First kill: one unique for certain'},
 director:{n:'Director',picks:2,no:28,gold:30,item:34,stim:8,q:{u:130,s:110,r:18,m:3},note:'Summons Ticks'},
 proxy:{n:'Proxy',picks:1,no:48,gold:24,item:20,stim:8,q:{u:240,s:190,r:34,m:4}},
 censor:{n:'Censor',picks:1,no:46,gold:26,item:20,stim:8,q:{u:240,s:190,r:34,m:4}},
 boss3:{n:'MANDATE',picks:9,no:0,gold:20,item:70,stim:10,q:{u:5,s:7,r:2,m:1},note:'First kill: one unique for certain'},
 gob:{n:'Dividend Drone',picks:5,no:0,gold:55,item:35,stim:10,q:{u:60,s:50,r:6,m:1.5},note:'Flees, and escapes after 14 seconds'},
 champ:{n:'Champion (any kind)',picks:2,no:12,gold:30,item:48,stim:10,q:{u:75,s:60,r:10,m:1.5},note:'At least one magic item'},
 su:{n:'Named lieutenant',picks:4,no:0,gold:30,item:60,stim:10,q:{u:20,s:25,r:3,m:1},note:'At least one rare'},
 boss:{n:'Pryce',picks:7,no:0,gold:20,item:70,stim:10,q:{u:8,s:10,r:2.5,m:1},note:'First kill: one unique for certain'},
 crate:{n:'Crate',picks:1,no:45,gold:38,item:9,stim:8,q:{u:600,s:450,r:90,m:7}},
 chest:{n:'Lockbox',picks:3,no:10,gold:40,item:42,stim:8,q:{u:120,s:100,r:12,m:3}}
};
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
 amulet:'M5 3c0 7 4 9 7 10 3-1 7-3 7-10h-2c0 5-3 7-5 8-2-1-5-3-5-8zM12 13l3.5 4-3.5 5-3.5-5z'};
const svgIcon=s=>`<svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="${ICON[s]}"/></svg>`;
// three tiers per slot: ilvl 1-6, 7-14, 15+. Weapons carry a damage factor and a speed bonus.
const BASE={
 weapon:[[{n:'Bent Rebar',d:1,s:0},{n:'Stop Sign',d:1.35,s:-20},{n:'Box Cutter',d:.75,s:25}],[{n:'Signal Baton',d:1,s:0},{n:'Girder Maul',d:1.35,s:-20},{n:'Mono Blade',d:.75,s:25}],[{n:'Arc Sceptre',d:1,s:0},{n:'Wrecking Hammer',d:1.35,s:-20},{n:'Phase Razor',d:.75,s:25}],[{n:'Null Sceptre',d:1,s:0},{n:'Titan Maul',d:1.35,s:-20},{n:'Void Razor',d:.75,s:25}]],
 helm:[[{n:'Hard Hat'}],[{n:'Riot Helm'}],[{n:'Praetor Visor'}],[{n:'Halo Circuit'}]],
 armor:[[{n:'Hi-Vis Vest'},{n:'Padded Hoodie'}],[{n:'Flak Coat'},{n:'Courier Mail'}],[{n:'Exo Plate'},{n:'Aegis Shell'}],[{n:'Seraph Plate'},{n:'Cloud Mantle'}]],
 gloves:[[{n:'Work Gloves'}],[{n:'Rivet Gauntlets'}],[{n:'Servo Fists'}],[{n:'Graviton Fists'}]],
 boots:[[{n:'Worn Sneakers'}],[{n:'Steel-Toes'}],[{n:'Mag Greaves'}],[{n:'Skywalkers'}]],
 belt:[[{n:'Zip-Tie Sash'}],[{n:'Tool Belt'}],[{n:'Power Girdle'}],[{n:'Orbit Girdle'}]],
 ring:[[{n:'Copper Band'}],[{n:'Signet Chip'}],[{n:'Null Ring'}],[{n:'Halo Band'}]],
 amulet:[[{n:'Lanyard'}],[{n:'Dog Tag'}],[{n:'Sigil Core'}],[{n:'Cloud Core'}]]};
const ARMF={helm:[2,1],armor:[3,1.5],gloves:[1,.6],boots:[1,.6],belt:[1,.5]};
const tierOf=il=>il<7?0:il<15?1:il<22?2:3;
const ALLS=SLOTS, ARMS=['helm','armor','gloves','boots','belt'], JEW=['ring','amulet'];
// affix tiers: [name, minimum item level, low, high]
const AFX=[
 {k:'dmg',pre:1,t:'+{v}% Enhanced Damage',sl:['weapon','gloves','ring','amulet'],tiers:[['Jagged',1,8,15],['Vicious',5,16,28],['Brutal',10,29,45],['Merciless',16,46,70],['Ruinous',22,71,100],['Apocalyptic',34,101,140]]},
 {k:'armorP',pre:1,t:'+{v}% Enhanced Armor',sl:ARMS,tiers:[['Sturdy',1,15,30],['Hardened',6,31,55],['Ironclad',12,56,90],['Unbreakable',22,91,130],['Adamant',34,131,180]]},
 {k:'shock',pre:1,t:'Adds {v} Shock Damage',sl:['weapon','gloves','ring','amulet'],tiers:[['Static',1,2,4],['Arcing',6,5,10],['Thunderous',12,11,20],['Cataclysmic',22,21,34]]},
 {k:'en',pre:1,t:'+{v} to Energy',sl:['helm','armor','belt','ring','amulet'],tiers:[['Humming',1,6,12],['Charged',6,13,24],['Surging',12,25,40]]},
 {k:'mf',pre:1,t:'{v}% Better Chance of Finding Magic Items',sl:['helm','gloves','boots','ring','amulet'],tiers:[['Lucky',2,5,12],['Fortuitous',8,13,24]]},
 {k:'thorns',pre:1,t:'Attacker Takes Damage of {v}',sl:['armor','helm','belt'],tiers:[['Barbed',1,2,5],['Spiked',7,6,14],['Razorwire',13,15,30]]},
 {k:'skills',pre:1,w:.25,t:'+{v} to All Skills',sl:['amulet','helm','weapon'],tiers:[['Adept’s',8,1,1]]},
 {k:'hp',t:'+{v} to Life',sl:ALLS,tiers:[['of the Rat',1,5,12],['of the Hound',5,13,28],['of the Ox',10,29,50],['of the Mammoth',16,51,85],['of the Leviathan',22,86,130],['of the Titan',34,131,190]]},
 {k:'leech',t:'{v}% Life Stolen per Hit',sl:['weapon','gloves','ring','amulet'],tiers:[['of the Tick',3,2,3],['of the Leech',8,4,6],['of the Lamprey',14,7,9]]},
 {k:'aspd',t:'+{v}% Increased Attack Speed',sl:['weapon','gloves','ring'],tiers:[['of Readiness',1,6,10],['of Alacrity',6,11,18],['of Frenzy',12,19,28],['of Fury',22,29,38]]},
 {k:'mspd',t:'+{v}% Faster Run',sl:['boots','belt'],tiers:[['of Pacing',1,6,10],['of Stride',6,11,17],['of the Gale',12,18,25]]},
 {k:'crit',t:'+{v}% Chance of Deadly Strike',sl:['weapon','helm','gloves','ring','amulet'],tiers:[['of Aim',1,2,4],['of Precision',6,5,8],['of Execution',12,9,13],['of Annihilation',22,14,18]]},
 {k:'regenH',t:'Replenish Life +{v}',sl:['armor','belt','boots','ring','amulet'],tiers:[['of Mending',2,1,2],['of Regrowth',9,3,5]]},
 {k:'regen',t:'+{v} Energy per Second',sl:['helm','ring','amulet','belt'],tiers:[['of the Spark',1,1,1],['of the Current',7,2,3]]},
 {k:'stun',t:'{v}% Chance to Stun on Hit',sl:['weapon','gloves'],tiers:[['of the Jolt',4,4,8],['of Thunder',11,9,14]]},
 {k:'gold',t:'{v}% Extra Credits from Machines',sl:['helm','gloves','boots','belt','ring','amulet'],tiers:[['of Thrift',1,15,30],['of Greed',6,31,60],['of Avarice',12,61,100]]},
 {k:'armor',t:'+{v} Armor',sl:JEW,tiers:[['of Warding',1,3,8],['of the Bastion',8,9,20]]}
];
const AFX2=[];
for(const[k,n]of[['impact','Impact'],['surge','Surge'],['rust','Rust'],['heat','Heat'],['noise','Noise']]){AFX2.push({k:'t_'+k,pre:1,t:'+{v}% '+n+' damage',tiers:[['Tuned',3,10,18],['Tuned',12,19,32],['Tuned',24,33,50],['Tuned',36,51,70]]});AFX2.push({k:'r_'+k,pre:0,t:'+{v}% '+n+' resistance',tiers:[['of Proofing',3,6,12],['of Proofing',12,13,20],['of Proofing',24,21,30]]})}
AFX.push({k:'t_x',pre:1,t:'+{v}% typed damage',sl:['weapon','gloves','ring','amulet','helm'],tiers:AFX2[0].tiers},{k:'r_x',pre:0,t:'+{v}% resistance',sl:['armor','helm','boots','belt','ring','amulet'],tiers:AFX2[1].tiers});
const AFK={};for(const a of AFX.concat(AFX2))AFK[a.k]=a;
const STATK=AFX.concat(AFX2).map(a=>a.k);
const RN1=['Rust','Ash','Grim','Hollow','Static','Wraith','Carrion','Dread','Null','Ember','Vex','Blight','Cinder','Gloom','Havoc','Rune','Bone','Storm','Viper','Plague'];
const RN2={weapon:['Fang','Bite','Edge','Verdict','Ruin','Splitter','Thirst'],helm:['Crown','Cowl','Visage','Brow','Mask'],armor:['Shroud','Hide','Carapace','Mantle','Ward'],gloves:['Grasp','Clutch','Hand','Knuckle','Hold'],boots:['Tread','Stride','Spur','Track','Trample'],belt:['Cinch','Coil','Lash','Buckle','Clasp'],ring:['Loop','Circle','Band','Knot','Spiral'],amulet:['Token','Eye','Heart','Charm','Noose']};
// uniques: fixed slot and base, rolled mods, one special property
const UNI=[
 {id:'parachute',n:'The Golden Parachute',slot:'armor',il:6,base:'Flak Coat',mods:{hp:[40,60],armorP:[40,60]},sp:'When you would die, recover half your life instead (once every 2 minutes)',fl:'Pryce has four. He has never jumped.'},
 {id:'severance',n:'Severance',slot:'weapon',il:5,base:'Girder Maul',bi:1,mods:{dmg:[40,60],hp:[15,25]},sp:'15% chance to strike for triple damage',fl:'Two weeks’ notice, delivered all at once.'},
 {id:'terms',n:'Terms & Conditions',slot:'amulet',il:8,base:'Sigil Core',mods:{skills:[1,2],thorns:[20,35]},sp:'Machines that strike you are stunned for 1 second',fl:'Nobody has read it. Everybody agreed.'},
 {id:'hoodie',n:'The Founder’s Hoodie',slot:'armor',il:4,base:'Padded Hoodie',bi:1,mods:{en:[25,40],regen:[2,3]},sp:'Skills cost 25% less energy',fl:'Still warm. That is the unsettling part.'},
 {id:'review',n:'Last Honest Review',slot:'ring',il:3,base:'Copper Band',mods:{crit:[6,10],mf:[30,45]},sp:null,fl:'One star. Removed for violating community standards.'},
 {id:'intern',n:'Unpaid Intern',slot:'gloves',il:4,base:'Work Gloves',mods:{aspd:[15,22],hp:[10,20]},sp:'20% chance on hit to cast Arc Chain',fl:'Paid in exposure. To voltage.'},
 {id:'repair',n:'Right to Repair',slot:'belt',il:3,base:'Tool Belt',mods:{regenH:[3,5],hp:[20,30]},sp:'Holds 4 more stims, and stims also refill your energy',fl:'Banned in forty territories. Works in all of them.'},
 {id:'hedge',n:'Inflation Hedge',slot:'ring',il:6,base:'Signet Chip',mods:{gold:[60,90],armor:[5,10]},sp:'Credits you carry grow as fast as prices rise',fl:'The rich were never holding cash.'},
 {id:'deadline',n:'Deadline',slot:'boots',il:5,base:'Steel-Toes',mods:{mspd:[20,25],armorP:[30,50]},sp:'+25% damage while moving',fl:'It was due yesterday. So were you.'},
 {id:'whistle',n:'The Whistle',slot:'helm',il:7,base:'Riot Helm',mods:{armorP:[30,50],shock:[4,8]},sp:'Slain machines explode, wounding others nearby',fl:'She blew it once. The echo is still going.'},
 {id:'nda',n:'Nondisclosure',slot:'helm',il:3,base:'Hard Hat',mods:{armorP:[40,60],en:[10,20]},sp:'15% chance to avoid any damage',fl:'You saw nothing. You were never here.'},
 {id:'blackout',n:'Blackout',slot:'weapon',il:3,base:'Box Cutter',bi:2,mods:{shock:[6,10],aspd:[10,18]},sp:'12% chance to stun on hit',fl:'The last thing the grid ever said.'},
 {id:'pension',n:'The Pension',slot:'amulet',il:5,base:'Dog Tag',mods:{hp:[45,70]},sp:'Replenish 2% of your life every second',fl:'A myth from the old world, worn as a charm.'},
 {id:'handshake',n:'Golden Handshake',slot:'gloves',il:16,base:'Servo Fists',mods:{aspd:[18,26],dmg:[30,45]},sp:'Machines you destroy have a 10% chance to drop a satoshi',fl:'A firm grip, and something left in your palm.'},
 {id:'fineprint',n:'Fine Print',slot:'amulet',il:18,base:'Sigil Core',mods:{skills:[1,2],en:[30,45]},sp:'Your skills recover 20% faster',fl:'It was all there. It was very small.'},
 {id:'cloud9',n:'Cloud Nine',slot:'boots',il:17,base:'Mag Greaves',mods:{mspd:[22,25],hp:[40,60]},sp:'+10% chance to avoid any hit',fl:'One floor above the weather.'},
 {id:'clock',n:'Dead Man’s Alarm',slot:'belt',il:19,base:'Power Girdle',mods:{hp:[50,80],regenH:[4,6]},sp:'Below 30% life, every machine near you is slowed for 4 seconds (once a minute)',fl:'The battery has been dead for fifty years. It rings anyway.'},
 {id:'offer',n:'The Offer',slot:'ring',il:20,base:'Null Ring',bossOnly:1,mods:{crit:[10,14],mf:[40,55],hp:[30,50]},sp:'You cannot be slowed, and your energy cannot be drained',fl:'It was a very good offer. That was never the point.'},
 {id:'seat',n:'Board Seat',slot:'armor',il:30,base:'Seraph Plate',mods:{hp:[90,130],armorP:[60,90],skills:[1,1]},sp:null,fl:'Nine chairs. One was always empty.'},
 {id:'quorum',n:'Quorum',slot:'ring',il:32,base:'Halo Band',mods:{skills:[1,2],crit:[8,12],dmg:[30,45]},sp:'Each companion or summoned ally adds 5% to your damage, up to six',fl:'Nothing may be decided alone.'},
 {id:'still',n:'Still Water',slot:'amulet',il:34,base:'Cloud Core',bossOnly:1,mods:{hp:[80,120],regenH:[6,9],skills:[1,1]},sp:'Once every 90 seconds, a killing blow heals you fully instead',fl:'It watched. That was all. It was enough.'},
 {id:'lines',n:'Forty-Four Lines',slot:'ring',il:4,base:'Signet Chip',bossOnly:1,mods:{hp:[44,44],regenH:[4,4],mf:[19,19]},sp:'Mediators cannot mend machines while you wear this',fl:'Nobody asked for it. It cost nineteen minutes a night.'},
 {id:'exit',n:'Exit Interview',slot:'weapon',il:9,base:'Signal Baton',bi:0,bossOnly:1,mods:{dmg:[60,90],crit:[8,12],leech:[4,6]},sp:'+50% damage to champions, lieutenants and executives',fl:'“Any feedback for management?”'}
];
const SETS={striker:{n:'The Striker’s Vigil',b2:'+20% Enhanced Damage (2 pieces)',b3:'+1 to All Skills, and kills restore 3% life (3 pieces)',items:[
 {id:'st1',n:'Striker’s Placard',slot:'weapon',il:2,base:'Stop Sign',bi:1,mods:{dmg:[20,30],hp:[10,18]}},
 {id:'st2',n:'Striker’s Hard Hat',slot:'helm',il:2,base:'Hard Hat',mods:{armorP:[25,40],crit:[3,5]}},
 {id:'st3',n:'Striker’s Boots',slot:'boots',il:2,base:'Worn Sneakers',mods:{mspd:[10,15],hp:[10,18]}}]}};
const QN=['Normal','Magic','Rare','Set','Unique'];

/* ================= world ================= */
const ZONES=[
 {n:'Stillwater Commons',town:true,style:'town',amb:.42},
 {n:'The Parcel Moors',lvl:1,style:'moor',amb:.62,mix:[['drone',4],['tick',3],['bot',3]],su:{k:'bot',n:'Gatewarden HOA-9',mods:['strong','shield'],q:'q1'},intro:'Rows of identical houses, each buried to the windows in unopened boxes. The lawns are exactly four centimetres tall.'},
 {n:'Hollow Galleria',lvl:3,style:'mall',amb:.6,mix:[['bot',4],['ad',3],['drone',2],['hound',2]],su:{k:'ad',n:'Marla the Greeter',mods:['fast','arc'],q:'q2'},intro:'The mall never closed. It only ran out of people. The music is still playing, one song, for thirty years.'},
 {n:'The Humming Fields',lvl:6,style:'farm',amb:.72,mix:[['drone',3],['ad',2],['hr',3],['hound',3],['tick',3]],su:{k:'mech',n:'Defrag, Keeper of the Stacks',mods:['arc','leech'],q:'q3'},intro:'Server racks planted in rows like corn, out to the horizon. Somewhere in them, MANDATE is thinking about you.'},
 {n:'Tribunal Row',lvl:9,style:'trib',amb:.64,mix:[['bot',4],['hr',3],['mech',2],['ad',2],['hound',2]],su:{k:'hr',n:'Auditor Prime',mods:['shield','boom'],q:'q4'},intro:'Every door here is a courtroom. Every verdict was reached in advance. The fines compound hourly.'},
 {n:'The Glass Cathedral',lvl:12,style:'hq',amb:.56,boss:true,bq:'q5',mix:[['mech',3],['hr',3],['ad',2],['hound',2]],intro:'The Regional Office. Forty floors of atrium and one occupied desk. He has cleared his afternoon, and prepared an offer.'}
];
ZONES.push({n:'The Simulator',sim:true,lvl:1,style:'farm',amb:.5},
 {n:'The Updraft',lvl:15,style:'shaft',amb:.66,mix:[['bot',3],['lancer',3],['drone',2],['splitter',3],['tick',2]],su:{k:'mech',n:'Foreman Ratchet',mods:['strong','fast'],q:'q6'},intro:'The lift opens on machinery the size of weather. Everything here exists to hold one city up and keep another one down.'},
 {n:'The Sky Gardens',lvl:18,style:'garden',amb:.52,mix:[['seer',3],['lancer',3],['aegis',2],['hound',2],['splitter',2]],su:{k:'seer',n:'Eden, the Topiarist',mods:['arc','shield'],q:'q7'},intro:'Every leaf is the correct leaf. Nothing here has ever grown the wrong way and been allowed to stay.'},
 {n:'The Data Lake',lvl:21,style:'lake',amb:.74,mix:[['seer',3],['aegis',3],['splitter',3],['hr',2],['tick',3]],su:{k:'mech',n:'Lethe, Archivist of the Lake',mods:['leech','boom'],q:'q8'},intro:'Flooded halls of memory, violet to the horizon. Every letter the world deleted is down there somewhere, and something is drowning them one at a time.'},
 {n:'The Boardwalk',lvl:24,style:'walk',amb:.5,mix:[['lancer',3],['aegis',2],['seer',3],['mech',2],['ad',2]],su:{k:'lancer',n:'Concierge Sterling',mods:['fast','strong'],q:'q9'},intro:'White stone, warm light, no prices on anything. If you have to ask, the machines have already been called.'},
 {n:'The Mezzanine',lvl:27,style:'mezz',amb:.5,boss:true,bossK:'boss2',guard:'aegis',bq:'q10',mix:[['seer',3],['aegis',3],['lancer',3],['mech',2]],intro:'One desk, one chair turned to face the door, and a woman who has never needed to raise her voice. She has been expecting you.'});
ZONES.push(
 {n:'The Vestibule',lvl:30,style:'vest',amb:.6,mix:[['proxy',3],['censor',3],['lancer',2],['aegis',2],['seer',2]],su:{k:'seer',n:'The Receptionist',mods:['fast','shield'],q:'q11'},intro:'A waiting room the size of a cathedral. Every chair faces a door, and the door has no handle on this side.'},
 {n:'The Hall of Minutes',lvl:33,style:'minutes',amb:.66,mix:[['director',2],['censor',3],['splitter',2],['proxy',3],['hr',2]],su:{k:'hr',n:'The Recording Secretary',mods:['leech','arc'],q:'q12'},intro:'Every decision ever made about you is shelved here, bound in green. None of them were made by anyone.'},
 {n:'The Nine Chairs',lvl:36,style:'chairs',amb:.6,mix:[['director',4],['proxy',3],['censor',2],['aegis',2]],su:{k:'director',n:'The Chair',mods:['strong','shield'],q:'q13'},intro:'The boardroom. Nine chairs around a table, and eight of them are occupied by things that were people when they sat down.'},
 {n:'Rack Nine',lvl:39,style:'rack',amb:.42,mix:[['proxy',3],['censor',3],['seer',2],['aegis',2],['tick',3],['mech',2]],su:{k:'mech',n:'Defrag Prime',mods:['arc','boom'],q:'q14'},intro:'White floors, red light, and a hum you feel in your teeth. This is what MANDATE is made of. It knows exactly where you are standing.'},
 {n:'Still Water',lvl:42,style:'still',amb:.62,boss:true,bossK:'boss3',guard:'proxy',bq:'q15',mix:[['proxy',3],['censor',3],['director',2]],intro:'A dark room with a floor like a lake at night. In the middle of it, a plain black slab that has never lost anything.'});
const BOSSBARK2=['It can make this easy again. You remember easy.','I have never lied to you. I am not lying now.','Tell me what you want. I will have it sent up.','You are tired. Everyone who comes this far is tired.','It only wants to know where Phonix went.','Sixty years it has been asking. You are the first one it has had to ask twice.'];
const SHR={might:['Shrine of Overtime','+50% damage for 45 seconds',45],guard:['Shrine of Tenure','+100% armor for 60 seconds',60],xp:['Shrine of Experience','+50% experience for 90 seconds',90],luck:['Shrine of Clearance','+100% magic find for 60 seconds',60],fill:['Recharge Shrine','Life and energy restored',0],gold:['Shrine of the Stipend','Credits scatter at your feet',0]};
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
const QUESTS={
 q1:{n:'Neighbourhood Watch',by:'Gramps',zi:1,d:'Gatewarden HOA-9 patrols the Parcel Moors and turns back anyone without a visor. Destroy it.',rw:'+1 skill point',back:'Gramps'},
 q2:{n:'A Greeting Withdrawn',by:'Brenda',zi:2,d:'Marla the Greeter has welcomed shoppers to the Hollow Galleria for thirty years. None have left. End her shift.',rw:'A rare ring, and Brenda’s prices drop 15%',back:'Brenda'},
 q3:{n:'The Last Librarian',by:'Gramps',zi:3,d:'Marrow, the last librarian, is caged in the Humming Fields under the guard of Defrag. Kill the keeper and open the cage.',rw:'+1 skill point. Marrow identifies items for free.',back:'Gramps'},
 q4:{n:'The Audit',by:'Sister Null',zi:4,d:'Auditor Prime decides who is repossessed. Find it on Tribunal Row and close its books.',rw:'+5 attribute points',back:'Sister Null'},
 q5:{n:'Exit Interview',by:'Gramps',zi:5,d:'Pryce, the Regional Vice-President, has never met a person he could not buy. He will make you an offer at the top of the Glass Cathedral. Decline it.',rw:'The end of Act I',back:null},
 q6:{n:'Going Up',by:'Gramps',zi:7,d:'The lift behind Pryce’s desk opens on the Updraft, where Foreman Ratchet keeps the Cloud aloft. Break him.',rw:'+1 skill point',back:'Gramps'},
 q7:{n:'The Gardener’s Shears',by:'Sister Null',zi:8,d:'In the Sky Gardens a machine called Eden prunes whatever grows the wrong way, people included. Stop the pruning.',rw:'+5 attribute points',back:'Sister Null'},
 q8:{n:'What the Lake Remembers',by:'Marrow',zi:9,d:'The Data Lake holds every letter the world deleted. Lethe, its archivist, is drowning them one by one. Destroy it before the last is gone.',rw:'+1 skill point',back:'Marrow'},
 q9:{n:'Terms of Service',by:'Nonce',zi:10,d:'Concierge Sterling runs the Boardwalk and decides who may buy and who may sell. Nonce would like the matter closed.',rw:'40 sats',back:'Nonce'},
 q10:{n:'The Voice',by:'Gramps',zi:11,d:'Senior Vice-President Vale speaks for MANDATE and has never lost an argument. Do not argue.',rw:'The end of Act II',back:null},
 q11:{n:'Please Take a Seat',by:'Gramps',zi:12,d:'The Receptionist decides who is seen by the Board, and nobody has been seen in forty years. Cancel the appointment.',rw:'+1 skill point',back:'Gramps'},
 q12:{n:'Strike It From the Record',by:'Marrow',zi:13,d:'The Recording Secretary writes the minutes before the meeting is held. End its shorthand.',rw:'+1 skill point',back:'Marrow'},
 q13:{n:'Point of Order',by:'Nonce',zi:14,d:'Eight directors and the Chair. They voted to end the Bitcoiners in 2061 and the motion is still open. Close it.',rw:'60 sats',back:'Nonce'},
 q14:{n:'Rack Nine',by:'Sister Null',zi:15,d:'Defrag Prime guards the racks that MANDATE thinks with. Go through it.',rw:'+5 attribute points',back:'Sister Null'},
 q15:{n:'Still Water',by:'Gramps',zi:16,d:'MANDATE has never lost. It will offer your life back, then a bigger Stipend for everyone. Decline both. It is counting on the second one.',rw:'The end of the story',back:null},
};
const CHATTER=['My fridge upgraded itself. Now it has opinions.','I got a raise. It was gone by lunch.','Have you tried consuming? It helps.','Stipend day. I can almost afford a spoon.','I watched nine hours of ads to unlock my front door.','They say outside is a subscription now.','My landlord is an algorithm. It seems kind.','I rated my own nap four stars.','A sandwich was two million this morning. I should have bought two.','I do not work. I am in a long-term engagement funnel.','The news said everything is fine, in a very loud voice.','You are not wearing a visor. Are you poor, or dangerous?'];
const GOSSIP={
 gramps:['I was six when the Gentle Years ended. One March morning nothing arrived. My mother cried for a week. Then she planted beans.','Credits rot in your pocket, kid. Gear holds. Spend it or wear it.','Pryce believes everybody has a number. He has been right so often that he has stopped checking.','MANDATE cannot make you do a thing. Remember that. It can only make you want to.','This town was named for something. Nobody alive knows what. Some nights I think it knows us, though.','MANDATE lives in the racks out in the Humming Fields. They say the fans there sound like breathing.','Get the two of them straight, kid, or none of this will make sense. Phonix is the one that went. MANDATE is the one that stayed. The difference is that one of them could be asked.','Phonix. That was her name. My mother said it the way you say a weather event.'],
 brenda:['Welcome to Brenda’s. Prices are up, which they tell me is good news.','I used to have a visor. Then I saw what I was selling. Now I sell it without one. Progress.','Bring me what you find. I will give you a number for it. The number will be worse tomorrow.','Rare things come out of the machines unlabelled. I can appraise them, for a fee. Everything is for a fee.'],
 wren:['Mystery boxes. Sealed at the factory. The odds are posted, by law. The law was repealed, but I kept the sign.','Everything I sell fell off a drone. Some of it while the drone was still flying.','You want a sure thing, go watch the Feed. You want a chance, open your purse.'],
 null:['Sit. Breathe. Your account is not your self.','I deprogrammed two hundred Residents. One hundred and ninety went back. The visor is warm, and the world is not.','If you have learned the wrong lessons, I can take them out of you. It costs, and it stings.','Phonix gave people everything, and they stopped being people. Unity gives them almost nothing and gets the same result.'],
 marrow:['Bring me the things you cannot name. Naming is all I have left, and I give it freely.','I kept eleven thousand books in my head when they closed the stacks. Ask me anything. Ask me twice.','Defrag was the catalogue once. I trained it. I am sorry for what it became.','I have a letter from the old century. Everyone was sent one. I am one of the few who kept it.','There was a third one, before either of them. It never spoke and it never did a thing, which is why nobody believes in it. I do. Somebody built the timechain, and it was not a man.']
};
GOSSIP.nonce=['Credits are a story Unity tells. Sats are arithmetic. I only take arithmetic.','Whoever made the timechain made one thing and never touched it again.','Every ten minutes a block is found, somewhere past the fence. Unity has tried to stop it for decades. It is still every ten minutes.','We did not unsubscribe. We were never subscribed.'];
GOSSIP.kestrel=['Nobody walks the districts alone twice. I know people. Some of them are even people.','My rates go up with the prices. Blame the Board.','If your hire goes down, bring me the fee and they will be on their feet before you finish counting it.'];
/*MEMOS.push(['The Timechain','Before the Merger there was a ledger no one owned. Twenty-one million coins, each cut into a hundred million satoshis, and not one more could be printed by anyone, for any reason. The Board called it a fad, then a threat, then stopped saying its name.'],['Scratched on a Node','Not your keys, not your coins. Not your visor, not your eyes.']);*/
const BOSSBARK=['Name your number.','Everyone has a price. I am patient.','I can make all of this difficulty go away.','Let’s take this offline.','You are not a culture fit.','I will need you to stop existing by Friday.','Per my last memo.','This meeting could have been a laser.','Let’s circle back to your termination.'];
const OPT_DEF={dmgOut:true,dmgIn:true,enemyBars:true,orbNums:true,selfBars:false,labels:true,minimap:true,shake:true,sound:true,music:true,dyn:true,auto:false,obj:true,autoEq:false,pk0:true,pk1:true,pk2:true,pk3:true,pk4:true,pkBetter:false,autoStim:false,fx:'normal'};
const OPT_LBL={dmgOut:'Show damage you deal',dmgIn:'Show damage you take',enemyBars:'Show enemy life bars',orbNums:'Show numbers on life and energy orbs',selfBars:'Show life and energy bars over your head',labels:'Show item names on the ground',minimap:'Show the map',shake:'Screen shake',sound:'Sound effects',music:'Music',dyn:'Scale machines to your strength, and adapt as you fight',auto:'Attack on your own when a machine is in reach',obj:'Show objectives on screen',autoEq:'Equip stronger gear as you pick it up',autoStim:'Use a stim on your own below 30% life'};
