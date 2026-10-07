/* ================= state ================= */
let G=null,S={},W=null,P=null,ZS={},mode='title',tNow=0,saveT=0,actTarget=null,shop=[],OPT=Object.assign({},OPT_DEF),shake=0,seenT=0;
const J={x:0,y:0},keys={};let atkHeld=false,hitStop=0;
const SAVEKEY='unsub2087v3';let SLOT=0;const NSLOT=3,skey=n=>SAVEKEY+(n?'_'+n:''),mdoc=n=>'main'+(n||''),zdoc=(n,k)=>(n?'s'+n:'')+'z'+k;

/* ================= sound ================= */
let AC=null,MG=null,SG=null,MUG=null,NB=null;const sndLast={};
function audio(){if(AC)return AC;try{AC=new(window.AudioContext||window.webkitAudioContext)();MG=AC.createGain();MG.gain.value=.9;MG.connect(AC.destination);SG=AC.createGain();SG.connect(MG);MUG=AC.createGain();MUG.gain.value=.55;MUG.connect(MG);
    NB=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}catch(e){AC=null}return AC}
function tone(type,f0,f1,dur,vol,dl,dest){const t=AC.currentTime+(dl||0),o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f0,t);if(f1!==f0)o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vol,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(dest||SG);o.start(t);o.stop(t+dur+.05)}
function nz(dur,vol,f0,f1,dl,q,ft,dest){const t=AC.currentTime+(dl||0),s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=NB;s.loop=true;f.type=ft||'bandpass';f.Q.value=q||1;f.frequency.setValueAtTime(f0,t);f.frequency.exponentialRampToValueAtTime(Math.max(30,f1),t+dur);
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vol,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f);f.connect(g);g.connect(dest||SG);s.start(t,Math.random()*.5);s.stop(t+dur+.05)}
const SND={
 hit(){nz(.07,.13,1900,500);tone('square',170,80,.06,.035)},
 crit(){nz(.1,.16,3000,700);tone('square',320,110,.1,.05);tone('triangle',1400,2100,.08,.03)},
 kill(){nz(.22,.16,900,120);tone('sawtooth',150,40,.2,.05)},
 bigkill(){nz(.5,.22,700,70);tone('sawtooth',120,30,.5,.07);tone('square',70,35,.4,.05,.05)},
 boom(){nz(.45,.24,500,60,0,.7,'lowpass');tone('sine',90,35,.4,.12)},
 hurt(){nz(.12,.14,700,200);tone('sawtooth',130,60,.16,.07)},
 whiff(){nz(.12,.06,2400,900)},
 swing(){nz(.13,.09,500,1800)},
 swing2(){nz(.2,.13,350,2000);tone('sawtooth',90,60,.15,.03)},
 whirl(){for(let i=0;i<3;i++)nz(.14,.1,400,1900,i*.1)},
 throw(){nz(.09,.06,1500,3200);tone('triangle',700,420,.07,.025)},
 zap(){tone('sawtooth',1100,180,.13,.045);nz(.1,.06,4500,1500)},
 zap2(){tone('square',1500,300,.2,.04);tone('sawtooth',750,150,.2,.03)},
 nova(){tone('sine',700,60,.45,.1);nz(.45,.12,3500,200)},
 thunder(){nz(.35,.2,2500,90,0,.6,'lowpass');tone('sawtooth',220,40,.25,.05)},
 dash(){nz(.22,.11,300,2600)},
 horn(){tone('sawtooth',147,147,.7,.07);tone('sawtooth',220,220,.7,.05,.02);tone('sawtooth',110,105,.8,.06)},
 buff(){tone('triangle',330,660,.25,.05);tone('triangle',495,990,.3,.04,.08)},
 deploy(){tone('square',220,440,.08,.04);tone('square',440,880,.08,.04,.09);nz(.06,.05,3000,3000,.18)},
 scatter(){for(let i=0;i<5;i++)tone('triangle',2200+i*320,1800,.04,.025,i*.035)},
 mark(){tone('square',880,880,.06,.04);tone('square',1320,1320,.12,.04,.07)},
 cast(){tone('triangle',420,840,.12,.05)},
 eshoot(){tone('square',520,240,.12,.03);nz(.06,.03,2500,1200)},
 growl(){tone('sawtooth',95,60,.4,.07);tone('sawtooth',101,57,.4,.05);nz(.35,.05,300,150)},
 roar(){tone('sawtooth',70,38,1.6,.13);tone('sawtooth',74,36,1.6,.1);tone('square',140,52,1.3,.05);nz(1.5,.14,500,80,0,.8,'lowpass');tone('sine',55,55,1.8,.12,.1)},
 bossfire(){tone('square',300,900,.18,.05);nz(.2,.07,1200,4000)},
 warn(){tone('square',660,660,.09,.05);tone('square',660,660,.09,.05,.16);tone('square',660,660,.09,.05,.32)},
 summon(){tone('sine',200,800,.4,.05);nz(.4,.05,800,3000)},
 mend(){tone('sine',660,990,.25,.04);tone('sine',990,1320,.25,.03,.1)},
 drop(){tone('sine',700,1050,.1,.04)},
 rare(){tone('triangle',660,660,.14,.07);tone('triangle',990,990,.14,.07,.1);tone('triangle',1320,1320,.3,.07,.2)},
 unique(){[523,659,784,1047,1319,1568].forEach((f,i)=>tone('triangle',f,f,.5,.07,i*.09));tone('sine',2093,2093,.9,.04,.55)},
 coin(){tone('square',1568,1568,.04,.03);tone('square',2093,2093,.1,.03,.045)},
 pick(){tone('triangle',520,780,.08,.045)},
 equip(){nz(.08,.1,1200,400);tone('square',240,160,.08,.04)},
 learn(){tone('triangle',440,880,.2,.06);tone('triangle',660,1320,.3,.05,.1)},
 level(){[392,494,587,784,988,1175].forEach((f,i)=>tone('triangle',f,f,.35,.08,i*.08))},
 quest(){[587,740,880,1175].forEach((f,i)=>tone('triangle',f,f,.5,.07,i*.14));tone('sine',294,294,1,.06)},
 questnew(){tone('triangle',440,440,.18,.06);tone('triangle',587,587,.3,.06,.16)},
 stim(){tone('sine',300,620,.2,.06);nz(.15,.04,2500,5000)},
 ui(){tone('square',520,520,.03,.02)},
 err(){tone('square',160,140,.1,.035)},
 talk(){tone('triangle',330,300,.07,.04);tone('triangle',280,330,.07,.04,.08)},
 page(){nz(.18,.08,3500,1500);tone('triangle',880,1175,.3,.04,.1)},
 crate(){nz(.16,.2,900,200);tone('square',120,60,.1,.05)},
 chest(){nz(.1,.1,500,300);tone('triangle',392,392,.15,.06,.08);tone('triangle',587,587,.15,.06,.2);tone('triangle',784,784,.35,.06,.32)},
 cage(){for(let i=0;i<4;i++)tone('square',900-i*120,300,.1,.04,i*.07);nz(.4,.08,2000,300,.2)},
 shrine(){tone('sine',262,1046,.9,.08);tone('sine',523,2093,.9,.04,.1)},
 portal(){tone('sine',180,720,.5,.07);tone('sine',270,1080,.5,.05,.05);nz(.5,.06,600,4000)},
 heart(){tone('sine',62,40,.14,.2);tone('sine',58,38,.14,.15,.2)},
 blood(){nz(.12,.08,500,200,0,1,'lowpass')},
 death(){tone('sawtooth',220,35,1.8,.12);tone('sawtooth',165,30,1.8,.09,.05);tone('sine',110,27,2.2,.14);nz(1.6,.1,900,60,0,.7,'lowpass');[392,370,349,330,294].forEach((f,i)=>tone('triangle',f/2,f/2,.5,.06,.3+i*.32))}
};
const SNDGAP={hit:.06,crit:.06,coin:.05,thunder:.15,zap:.07,throw:.05,eshoot:.08,kill:.04,boom:.08,err:.4,growl:.5};
function sfx(k){if(!OPT.sound||!audio()||!SND[k])return;if(AC.state==='suspended')AC.resume();const t=AC.currentTime;if(sndLast[k]&&t-sndLast[k]<(SNDGAP[k]||0))return;sndLast[k]=t;try{SND[k]()}catch(e){}}

/* ---------- music: a small step sequencer, one loop per place ---------- */
const mf=m=>440*Math.pow(2,(m-69)/12);
function mt(type,m,t,dur,vol,o){o=o||{};const os=AC.createOscillator(),g=AC.createGain();os.type=type;os.frequency.value=mf(m);if(o.det)os.detune.value=o.det;
  const a=o.atk||.01;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vol,t+a);if(o.hold){g.gain.setValueAtTime(vol,t+dur*.7);g.gain.linearRampToValueAtTime(.0001,t+dur)}else g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  let n=os;if(o.lp){const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=o.lp;os.connect(f);n=f}n.connect(g);g.connect(MUG);os.start(t);os.stop(t+dur+.05)}
function mn(t,dur,vol,f0,f1,ft){const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=NB;s.loop=true;f.type=ft||'bandpass';f.frequency.setValueAtTime(f0,t);f.frequency.exponentialRampToValueAtTime(f1,t+dur);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vol,t+Math.min(.01,dur/3));g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f);f.connect(g);g.connect(MUG);s.start(t,Math.random()*.5);s.stop(t+dur+.05)}
const kick=(t,v)=>{const o=AC.createOscillator(),g=AC.createGain();o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(38,t+.16);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+.22);o.connect(g);g.connect(MUG);o.start(t);o.stop(t+.25)};
const pluck=(m,t,d,v)=>{mt('triangle',m,t,d,v);mt('sine',m+12,t,d*.5,v*.35)};
const mh=i=>{const v=Math.sin(i*91.7+1.3)*43758.5453;return v-Math.floor(v)};
const TOWN_A=[0,7,12,15,14,12,7,3,-2,5,10,14,12,10,5,2],TOWN_B=[-4,3,8,12,10,8,3,0,-5,2,7,11,9,7,2,-1];
const TRK={
 town:{bpm:76,div:2,len:32,play(s,b,t,sd){const R=50,n=(s<16?TOWN_A:TOWN_B)[s%16];pluck(R+12+n,t,sd*2.4,.075);if(s%8===0)mt('sine',R-12+n,t,sd*7.5,.11);if(b%2&&s%8===4)mt('sine',R+24+[15,14,12,10][s>>3],t,sd*4,.03,{atk:.1})}},
 scene:{bpm:50,div:2,len:16,play(s,b,t,sd){const R=43;if(s===0)for(const i of[0,7,12,15])mt('sine',R+i+[0,-2,-4,-5][b%4],t,sd*16,.04,{atk:1.2,hold:1});if(s%8===4)mt('sine',R+24+[3,7,10,2][(b+s)%4],t,sd*7,.03,{atk:.2})}},
 moor:{bpm:50,div:2,len:16,play(s,b,t,sd){const R=45;if(s===0){for(const i of[0,7,12])mt('sine',R+i,t,sd*16,.05,{atk:1.5,hold:1});mn(t,sd*14,.03,300,900)}if(s===8)mt('sine',R-12,t,sd*5,.09);if(mh(b*16+s)>.74)mt('sine',R+24+[0,3,5,7,10,12][Math.floor(mh(b*7+s)*6)],t,sd*6,.04,{atk:.02})}},
 mall:{bpm:96,div:2,len:16,play(s,b,t,sd){const R=48,ch=[[0,4,7,11],[-3,0,4,7],[5,9,12,16],[7,11,14,17]][b%4],dt=Math.sin(b*1.7)*28;if(s===0)for(const i of ch)mt('sine',R+12+i,t,sd*16,.028,{atk:.3,hold:1,det:dt});
   if([0,3,6,8,11,14].includes(s))mt('triangle',R-12+ch[s%3===0?0:2],t,sd*2.5,.08);if(s%2===0&&mh(b*16+s)>.42)mt('sine',R+24+ch[Math.floor(mh(b*5+s*3)*4)],t,sd*2.2,.045,{det:dt});if(s%2)mn(t,.04,.012,7000,6000,'highpass')}},
 farm:{bpm:112,div:4,len:16,play(s,b,t,sd){const R=38+[0,0,-2,3][b%4],n=[0,0,12,0,7,0,12,0,0,0,10,0,7,0,3,0][s];mt('sawtooth',R+n,t,sd*1.1,.05,{lp:500+300*Math.sin(b+s*.4)});if(s%4===0)kick(t,.09);if(s%4===2)mn(t,.03,.012,8000,7000,'highpass');if(mh(b*16+s)>.86)mt('sine',R+36+[0,3,7,10,12][Math.floor(mh(b+s)*5)],t,sd*3,.03)}},
 trib:{bpm:80,div:2,len:16,play(s,b,t,sd){const R=40;if([1,0,0,1,0,0,1,0,1,0,0,0,1,0,1,1][s])kick(t,.14);if(s===12||s===4)mn(t,.14,.05,1800,600);if(s===0){const n=[0,1,0,-2][b%4];mt('sawtooth',R+12+n,t,sd*14,.045,{lp:420,atk:.3,hold:1});mt('sawtooth',R+19+n,t,sd*14,.03,{lp:420,atk:.3,hold:1})}if(b%4===3&&s>=8&&s%2===0)mt('square',R+24+[3,1,0,-2][(s-8)/2],t,sd*1.8,.02,{lp:900})}},
 hq:{bpm:56,div:2,len:16,play(s,b,t,sd){const R=45,r=[0,-4,5,7][b%4],iv=b%4===1||b%4===3?[0,7,12,16,19]:[0,7,12,15,19];if(s===0)for(const i of iv){mt('sine',R+r+i,t,sd*16,.035,{atk:.5,hold:1});mt('triangle',R+r+i+12,t,sd*16,.008,{atk:.5,hold:1})}if(s===0)mt('sine',R+r-12,t,sd*16,.07,{atk:.3,hold:1});if(s===8||s===12)mt('sine',R+24+r+(s===8?iv[3]-12:iv[2]-12)+12,t,sd*5,.035,{atk:.25,det:8})}},
 boss:{bpm:138,div:4,len:16,play(s,b,t,sd){const R=38+[0,0,3,-2][b%4],n=[0,0,0,3,0,0,5,0,0,0,7,0,6,0,3,0][s];mt('sawtooth',R+n,t,sd*.9,.06,{lp:700});if(s%4===0)kick(t,.16);if(s===4||s===12)mn(t,.12,.06,2200,700);if(s%2)mn(t,.03,.014,8000,7000,'highpass');if(s===0&&b%2===0)for(const i of[0,3,7])mt('square',R+24+i,t,sd*6,.022,{lp:1400});if(b%4===3&&s>=12)mt('square',R+36+s-12,t,sd,.025)}}
};
const MU={key:null,step:0,bar:0,next:0};
function music(k){if(MU.key===k)return;MU.key=k;MU.step=0;MU.bar=0;if(AC)MU.next=AC.currentTime+.35}
setInterval(()=>{if(!AC||!OPT.music||!MU.key||AC.state!=='running')return;const T=TRK[MU.key],sd=60/T.bpm/T.div,now=AC.currentTime;if(MU.next<now-.2)MU.next=now+.05;
  while(MU.next<now+.3){try{T.play(MU.step,MU.bar,MU.next,sd)}catch(e){}if(++MU.step>=T.len){MU.step=0;MU.bar++}MU.next+=sd}},90);
addEventListener('pointerdown',()=>{if(audio()&&AC.state==='suspended')AC.resume();if(!MU.key)music(mode==='title'?'scene':'town')},{passive:true});
document.addEventListener('visibilitychange',()=>{if(!AC)return;if(document.hidden)AC.suspend();else AC.resume()});
const SKS={scrapper:{0:'swing2',1:'throw',3:'whirl',4:'dash',5:'horn',6:'buff',7:'dash',9:'deploy',12:'horn',13:'swing2',14:'buff'},hacker:{0:'zap',1:'zap2',3:'nova',4:'deploy',6:'thunder',7:'summon',9:'zap',10:'thunder',12:'dash',14:'zap2'},courier:{0:'throw',1:'dash',3:'deploy',4:'scatter',6:'buff',7:'mark',9:'throw',11:'deploy',12:'throw',14:'mark'}};
const zoneMusic=()=>{if(!W||!W.z)return 'scene';if(W.z.town)return 'town';if(W.boss&&W.boss.aggro)return 'boss';const k=STY[W.z.style].like||W.z.style;return TRK[k]?k:'scene'};

/* ---------- low life: blood on the glass ---------- */
let BLOOD=[],DY=null,SWAP=null,satShop=[];
function unstealth(){if(P.stealth>0){P.ambM=2.5+.3*sl(4);P.ambT=.15;P.stealth=0;P.haste=0}}
/* ---------- mercenaries and anything else the machines may attack instead of you ---------- */
function mercStats(){const m=G.merc,t=MERCS[m.k],l=G.lvl,w=m.weapon?(m.weapon.dmin+m.weapon.dmax)/2*.5:0,arm=(m.armor?m.armor.arm:0)+(m.helm?m.helm.arm||0:0);return{max:Math.round(((60+22*l)*t.hpM+arm*3)*(m.ab1==='guard'?1.4:1)),dmg:((4+2.2*l)*t.dM+w)*(m.ab1==='fury'?1.3:1),red:100/(100+arm*2+l*2)}}
function spawnMerc(){W.merc=null;spawnTag();if(G.tag||!G.merc||G.merc.dead)return;const s=mercStats();if(W.z.town)G.merc.hp=s.max;W.merc={x:P.x+.8,y:P.y+.6,r:.28,hp:Math.min(G.merc.hp||s.max,s.max),max:s.max,cd:0,hc:3,ph:0,flash:0,taunt:MERCS[G.merc.k].taunt||0,armM:s.red,fx:1,swing:0}}
function updMerc(dt){const m=W.merc;if(!m||m.hp<=0)return;const t=MERCS[G.merc.k],s=mercStats();m.max=s.max;m.armM=s.red;m.cd-=dt;m.ph+=dt;m.flash=Math.max(0,m.flash-dt);m.swing=Math.max(0,m.swing-dt);m.haste=Math.max(0,(m.haste||0)-dt);
  let tg=null,bd=7.5;for(const e of W.ents){if(!e.aggro)continue;const d=dist(e,P);if(d<bd){bd=d;tg=e}}
  const g=tg||P,d=dist(g,m)||1,want=tg?t.range*.85:1.8;m.mov=false;
  /* Catch up at 8 tiles. The old 13-tile recall stays only while a swing is already in range. */
  if(dist(m,P)>(tg&&d<=t.range+tg.r?13:8)){m.x=P.x;m.y=P.y}else if(d>want){const sp=t.spd*dt;if(!mv(m,(g.x-m.x)/d*sp,(g.y-m.y)/d*sp)&&dist(m,P)>5){m.x=P.x;m.y=P.y}m.mov=true;m.fx=(g.x-m.x)-(g.y-m.y)>0?1:-1}
  if(tg&&d<=t.range+tg.r&&m.cd<=0){m.cd=t.ivl/toxicSwing(m);m.swing=.15;const md=s.dmg*nodeMul(false)*toxicDmg(m.toxL),snd=m.soundSwing;if(snd||t.range<=2){witMercHit(m,tg,md);sfx(snd?'swing':'hit')}else{W.projs.push({x:m.x,y:m.y,vx:(tg.x-m.x)/d*12,vy:(tg.y-m.y)/d*12,life:.7,raw:md,done:[],pierce:0,col:t.col,kind:'merc',party:1});sfx('throw')}}
  if(G.merc.k==='sys'){m.hc-=dt;if(m.hc<=0){m.hc=4;if(G.hp<S.maxHp*.9){heal(S.maxHp*.07);G.en=Math.min(S.maxEn,G.en+6);W.fx.push({k:'bolt',x:m.x,y:m.y,x2:P.x,y2:P.y,t:0,life:.4,col:'#7be495'});sfx('mend')}}}
  if(!tg)m.hp=Math.min(m.max,m.hp+m.max*.04*dt);G.merc.hp=m.hp}
function tanks(){const c=[];if(W.merc&&W.merc.hp>0)c.push(W.merc);if(W.tag&&W.tag.hp>0)c.push(W.tag);if(W.esc)c.push(W.esc);for(const a of W.allies)if(a.hp>0)c.push(a);return c}
function tank(e){let T=null,bd=1e9;const dp=P.stealth>0?1e9:dist(P,e);for(const a of tanks()){const d=dist(a,e);if((a.taunt?d<6:d<dp)&&d<bd){bd=d;T=a}}return T}
function hurtAlly(a,d,src){d*=(a.armM||1)*partyD();if(a.hp!==undefined&&(a.k==='mine'||(a.k==='minion'&&a.kind==='clone'))&&G.cls==='anon'&&sl(13)&&!boonOn(13)&&!a.cut&&a.hp-d<=0){a.cut=1;float(a.x,a.y,'Cutout','#e6e2d6',0);return}if(src&&a.hp!==undefined&&a.hp-d<=0&&G.cls==='founder'&&(a.per||a.kind==='conv'))P.grave={src,t:4,x:a.x,y:a.y};a.hp-=d;a.flash=.12;if(a.hp>0)return;
  if(a===W.esc){const k=a.q;W.esc=null;toast(a.name+' is down. He crawls back to where you found him.');sfx('bigkill');G.sq[k].s--;placeQuestObjs();return}
  if(a===W.tag){G.pp=Math.max(0,(G.pp||0)-1);toast(G.tag.name+' de-renders. The rig can bring them back, for sats.');sfx('bigkill');parts(a.x,a.y,14,[CLS[G.tag.cls].col,'#fff'],2.5);tagDismiss(1);return}
  if(a===W.merc){G.merc.dead=true;G.merc.hp=0;toast(G.merc.name+' has fallen. Kestrel can bring them back.');sfx('bigkill');parts(a.x,a.y,14,['#b3261e','#888'],2.5)}
  else{const i=W.allies.indexOf(a);if(i>=0)W.allies.splice(i,1);parts(a.x,a.y,10,['#888','#ffb84a'],2.5);sfx('kill')}}
function summon(o,cap){const same=W.allies.filter(a=>a.kind===o.kind);if(same.length>=cap)W.allies.splice(W.allies.indexOf(same[0]),1);W.allies.push(Object.assign({k:'minion',x:P.x+rnd(-.8,.8),y:P.y+rnd(-.8,.8),cd:0,ph:rnd(0,6),off:rnd(0,1),life:1e9,fx:1},o));parts(P.x,P.y,6,['#e0bd6e','#fff'],1.5,1.3)}
Object.assign(SKS,{maxi:{0:'swing2',1:'crit',3:'buff',4:'buff',5:'dash',6:'throw',7:'buff',9:'nova',11:'throw',13:'buff'},anon:{0:'deploy',1:'dash',3:'deploy',4:'whiff',5:'mark',6:'throw',7:'summon',8:'horn',9:'swing',10:'horn',12:'dash',14:'whiff'},founder:{0:'summon',1:'mark',3:'summon',4:'buff',5:'horn',6:'summon',7:'mend',8:'boom',9:'mark',10:'mark',12:'summon',14:'boom'},homesteader:{0:'deploy',1:'horn',2:'summon',3:'deploy',4:'horn',5:'summon',6:'deploy',7:'whiff',9:'thunder',10:'horn',12:'boom',14:'boom'},witness:{0:'mark',1:'mark',3:'throw',4:'swing',6:'mend',7:'whiff',9:'horn',10:'horn',12:'boom'}});
function bloodSplat(n){sfx('blood');for(let i=0;i<n;i++){const edge=Math.random()<.7;let x=Math.random(),y=Math.random();if(edge){if(Math.random()<.5)x=Math.random()<.5?rnd(0,.16):rnd(.84,1);else y=Math.random()<.5?rnd(.08,.22):rnd(.7,.95)}BLOOD.push({x,y,r:rnd(5,17),b:tNow+rnd(0,.25),life:rnd(2.2,3.4),d:rnd(20,70),k:Math.random()})}}
function tickFx(dt){for(const f of W.fx.slice()){if(f.stay)continue;f.t+=dt;if(f.t>=f.life)W.fx.splice(W.fx.indexOf(f),1)}
  for(const t of W.texts.slice()){t.t+=dt;if(t.t>.9)W.texts.splice(W.texts.indexOf(t),1)}
  for(const p of W.parts.slice()){p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;p.vz-=320*dt;if(p.z<0){p.z=0;p.vz*=-.4;p.vx*=.5;p.vy*=.5}if(p.t>=p.life)W.parts.splice(W.parts.indexOf(p),1)}}
function wake(e){if(e.aggro)return;e.aggro=true;partyWake(e);if(e.k==='gob'){sfx('coin');toast('A Dividend Drone. Catch it before it gets away.')}else if(isBoss(e.k)){if(!bossIntro(e)){sfx('roar');music('boss');if(OPT.shake)shake=9}}else if(e.su){if(!ltIntro(e)){sfx('roar');toast(e.name+' has seen you')}}else if(e.champ)sfx('growl')}

/* ================= items ================= */
function baseStats(it,b,tr){const il=it.il,s=it.slot;
  if(s==='weapon'){it.dmin=Math.round((3+1.6*il)*b.d);it.dmax=Math.round((6+2.6*il)*b.d);it.spd=b.s}
  if(ARMF[s])it.arm=Math.round(ARMF[s][0]+ARMF[s][1]*il);
  if(s==='belt')it.cap=6+tr*2}
function rollAffix(a,il){const el=a.tiers.filter(t=>t[1]<=il);if(!el.length)return null;const t=Math.random()<.55?el[el.length-1]:pick(el);return{k:a.k,v:ri(t[2],t[3]),nm:t[0],pre:a.pre?1:0}}
function mkFixed(u,il,q,set){il=Math.max(il,u.il);let b=null,tr=0;BASE[u.slot].forEach((tl,ti)=>tl.forEach(x=>{if(x.n===u.base){b=x;tr=ti}}));
  const it={slot:u.slot,il,q,base:u.base,aff:[],id:false,name:u.n,uid:u.id,fl:u.fl||''};baseStats(it,b,tr);
  const sc=1+(il-u.il)*.04;
  for(const k in u.mods){const m=u.mods[k];let v=ri(m[0],m[1]);if(['dmg','hp','shock','thorns','armor','en','armorP'].includes(k))v=Math.round(v*sc);it.aff.push({k,v})}
  if(u.sp){it.sp=u.id;it.spT=u.sp}if(set)it.set=set;
  it.val=(8+il*5)*(q===4?8:6);it.req=Math.max(1,Math.floor(u.il*.75));return it}
const ITEM_HOOKS=[];
function makeItem(il,q,slot){let it=makeItemCore(il,q,slot);for(const h of ITEM_HOOKS)it=h(it,il,q,slot);return it}
function moorsBlade(){
  let it=null;
  for(let i=0;i<12;i++){it=makeItem(4,1,'weapon');if(it.dmin>=9&&it.dmax>=16)return it}
  it.dmin=Math.max(it.dmin,10);it.dmax=Math.max(it.dmax,18);return it}
function makeItemCore(il,q,slot){
  il=Math.max(1,Math.round(il));
  if(q===4){const c=UNI.filter(u=>u.il<=il+2&&!u.bossOnly&&(!slot||u.slot===slot));if(c.length)return mkFixed(pick(c),il,4);q=2}
  if(q===3){const c=SETS.striker.items.filter(u=>!slot||u.slot===slot);if(c.length)return mkFixed(pick(c),il,3,'striker');q=2}
  slot=slot||wpick(Object.entries(SLOTW));
  const tr=tierOf(il),bl=BASE[slot][tr],b=pick(bl),it={slot,il,q,base:b.n,aff:[],id:q<2};baseStats(it,b,tr);
  const ok=AFX.filter(a=>a.sl.includes(slot)&&a.tiers[0][1]<=il);
  if(q===1){const pre=ok.filter(a=>a.pre&&!a.w),suf=ok.filter(a=>!a.pre),r=Math.random();let p=null,s=null;
    if((r<.5||r>=.75)&&pre.length)p=rollAffix(pick(pre),il);if((r>=.5||!p)&&suf.length)s=rollAffix(pick(suf),il);
    if(p)it.aff.push(p);if(s)it.aff.push(s);it.name=(p?p.nm+' ':'')+b.n+(s?' '+s.nm:'')}
  else if(q===2){const n=ri(3,5),pool=ok.slice();while(it.aff.length<n&&pool.length){const a=wpick(pool.map(x=>[x,x.w||1]));pool.splice(pool.indexOf(a),1);const f=rollAffix(a,il);if(f)it.aff.push(f)}
    it.name=pick(RN1)+' '+pick(RN2[slot])}
  else it.name=b.n;
  if(slot==='weapon'&&q>=1&&q<4&&Math.random()<.3)it.dt=pick(['surge','rust','heat','noise']);
  if(['weapon','helm','armor'].includes(slot)){const mx=slot==='helm'?2:3;if(q===0&&Math.random()<.4){it.soc=ri(1,mx);it.words=[]}else if(q===1&&Math.random()<.15){it.soc=1;it.words=[]}}
  it.val=(8+il*5)*[1,2,4][q];it.req=Math.max(1,Math.floor(il*.75));return it}
const mfNow=()=>S.mf+(P&&P.shr&&P.shr.k==='luck'?100:0)+(P&&P.hazMf||0);
function rollQ(tc,minQ){const c=qChance(tc,mfNow());const q=Math.random()<c.u?4:Math.random()<c.s?3:Math.random()<c.r?2:Math.random()<c.m?1:0;return Math.max(q,minQ||0)}
function addDrop(d,x,y){let dx=x+rnd(-.9,.9),dy=y+rnd(-.9,.9);if(!walk(dx,dy)){dx=x;dy=y}d.x=dx;d.y=dy;d.t=0;W.drops.push(d);
  if(d.it){sfx(d.it.q>=3?'unique':d.it.q===2?'rare':'drop');if(d.it.q>=3)W.fx.push({k:'beam',x:dx,y:dy,t:0,life:1.2,col:d.it.q===4?'#d0aa62':'#3fe06a'})}}
/* Party members in this district count whole. Everyone else in the game counts as half,
   added in pairs. Only the no weight moves, so quality stays on qChance. An honest
   client does this; the server never sees the roll. */
function partyNoWeight(no,rest,n){n=Math.max(1,n|0);if(n===1||!(no>0)||!(rest>0))return no;const stay=no/(no+rest),want=Math.pow(stay,n);if(!(want<1))return no;return rest*want/(1-want)}
function dropWeights(tc,n){const T=TC[tc],rest=T.gold+T.item+T.stim;return{no:partyNoWeight(T.no,rest,n),gold:T.gold,item:T.item,stim:T.stim,q:qChance(tc,0)}}
function dropFrom(tc,x,y,ml,minQ,forceU){const T=TC[tc],rest=T.gold+T.item+T.stim,no=partyNoWeight(T.no,rest,partyDropN());
  for(let i=0;i<T.picks;i++){let r=wpick([['no',no],['gold',T.gold],['item',T.item],['stim',T.stim]]);if((minQ||forceU)&&i===0)r='item';
    if(r==='gold')addDrop({cr:(3+ml*2)*rnd(.6,1.4)*Math.pow(G.cpi,.9)*(T.goldMul||1)*(EV&&EV.k==='stipend'?3:1)*GOLDM()},x,y);
    else if(r==='stim')addDrop({pot:1},x,y);
    else if(r==='item'){let q=rollQ(tc,i===0?minQ:0);if(forceU&&i===0)q=4;addDrop({it:makeItem(ml+ri(0,2),q,T.jewel&&Math.random()<.45?pick(JEW):null)},x,y)}}}

/* ================= character ================= */
const PCAP=()=>G.act5?5:G.act3?4:G.act2?3:2;
const pon=i=>CLS[G.cls].sk[i].a||(G.pas||[]).includes(i);
function fixPas(){const sk=CLS[G.cls].sk,ok=i=>sk[i]&&!sk[i].a&&G.sk[i]>0;if(!G.pas)G.pas=G.sk.map((v,i)=>i).filter(ok).sort((a,b)=>G.sk[b]-G.sk[a]);G.pas=G.pas.filter(ok).slice(0,PCAP())}
const sl=i=>{const b=G.sk[i]&&pon(i)?G.sk[i]+(S.skills||0)+mast(i):0,g=(S.grant||{})[i]||0;return g?Math.max(b,g+(G.sk[i]||0)):b};
const syn=i=>i>=3?1+.06*G.sk[i-3]:1;const mast=i=>G.sk[i]>=10?2:0;
const xpNext=l=>Math.round(60*Math.pow(l,1.75));
/* A price tag prints whole credits, so the purse pays that floor. The market still samples the raw stim price. */
function payTag(n){return Math.floor(n)}
const stimPrice=()=>25*G.cpi*(1+G.lvl*.2)*(G.disc?.85:1);
function calc(){
  const c=CLS[G.cls],s={dmin:2,dmax:4,wspd:0,barm:0,sp:{},set:{},cap:4,cdr:0,dodge:0,pierce:0,critM:2,enc:0,grant:{}};
  for(const k of STATK)s[k]=0;
  for(const slot of SLOTS){const it=G.eq[slot];if(!it)continue;if(it.dmin){s.dmin=it.dmin;s.dmax=it.dmax;s.wspd=it.spd||0}if(it.arm)s.barm+=it.arm;if(it.cap)s.cap=it.cap;
    for(const a of it.aff)s[a.k]+=a.v;if(it.sp&&uOk(it))s.sp[it.sp]=1;if(it.uid&&UNIK[it.uid]&&UNIK[it.uid].grant&&uOk(it))s.grant[UNIK[it.uid].grant[0]]=UNIK[it.uid].grant[1];if(it.set)s.set[it.set]=(s.set[it.set]||0)+1}
  famBonus(s);if(s.set.striker>=2)s.dmg+=20;if(s.set.striker>=3){s.skills+=1;s.sp.vigil=1}
  fixPas();const L=i=>{const b=G.sk[i]&&pon(i)?G.sk[i]+s.skills+mast(i):0,g=s.grant[i]||0;return g?Math.max(b,g+(G.sk[i]||0)):b};let hpM=1,armM=1;
  if(G.cls==='scrapper'){armM+=.08*L(2);hpM+=.04*L(2);if(L(10)&&!boonOn(10)){const w=G.eq.weapon,ty=(w&&w.dt)||'impact';s['t_'+ty]=(s['t_'+ty]||0)+6*L(10)}}
  if(G.cls==='hacker'){s.enc=Math.min(.6,.06*L(2));s.regen+=L(5);s.cdr=.03*L(5);s.crit+=3*L(8);s.critM=2+.1*L(8);if(L(11)&&!boonOn(11)&&G.schema)s['t_'+G.schema]=(s['t_'+G.schema]||0)+8*L(11)}
  if(G.cls==='anon'){s.dodge=Math.min(35,2.5*L(2));s.crit+=2*L(2)}
  if(G.cls==='founder')hpM+=.03*L(2);
  if(G.cls==='courier'){s.mspd+=2*L(2);s.dodge=Math.min(35,2.5*L(2));s.gold+=10*L(5);s.mf+=5*L(5);s.pierce=8*L(8);s.crit+=2*L(8)}
  if(G.cls==='homesteader'){s.shed=HS.shed;if(L(8))s.feral=1.4+.05*L(8);if(L(11))s.root=1;const f=G.form;
    if(f==='hound'){armM*=HS.houndArm;s.mspd+=HS.houndSpd}
    else if(f==='hull'){armM*=HS.hullArm;s.mspd+=HS.hullSpd;if(L(13))s.armor+=Math.min(HS.bigMax,Math.floor((G.formT||0)/HS.bigStep))*HS.bigArm*L(13)}
    else if(f==='worn'){armM*=HS.wornArm;s.mspd+=HS.hullSpd}}
  if(G.cls==='witness'){if(L(2))s.margin=1+.2*L(2);if(L(5))s.filed=2+.4*L(5);if(L(8)){s.footnote=1+.08*L(8);hpM=Math.max(.4,hpM-.04*L(8))}if(L(11)){s.coloHi=1-Math.min(.45,.04*L(11));s.coloLo=1+.06*L(11)}if(L(13))s.named=.05*L(13)}
  /* Twenty-One Million prints +8% armour per rank, the same multiplier Iron Hide uses. */
  if(G.cls==='maxi'&&L(8))armM+=.08*L(8);
  if(s.sp.nda)s.dodge+=15;if(s.sp.cloud9)s.dodge+=10;if(s.sp.fineprint)s.cdr+=.2;if(s.sp.repair)s.cap+=4;
  hpM+=extra(s);
  s.dmg+=G.at.mgt*1.5;s.crit=Math.round((s.crit+5+G.at.ref*.3)*10)/10;
  s.armor=Math.round((s.barm*(1+s.armorP/100)+s.armor+G.at.ref)*armM);
  s.maxHp=Math.round((c.hp+(G.lvl-1)*c.hpL+G.at.vit*4+s.hp)*hpM);
  s.maxEn=Math.round(50+G.lvl*2+G.at.bnd*3+s.en);
  s.aspd+=s.wspd;s.mspd=Math.min(s.mspd,50);
  S=s;G.hp=Math.min(G.hp,S.maxHp);G.en=Math.min(G.en,S.maxEn);G.stims=Math.min(G.stims,S.cap)}
function newGame(cls){
  G={v:2,cls,lvl:1,xp:0,sp:0,ap:0,sk:[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],slots:[0,-1,-1],at:{mgt:0,ref:0,vit:0,bnd:0},hp:9999,en:9999,credits:120,cpi:1,stims:3,bag:[],
    eq:{weapon:null,helm:null,armor:null,gloves:null,boots:null,belt:null,ring:null,amulet:null},unlocked:1,tier:0,maxTier:0,kills:0,deaths:0,ubiT:0,time:0,zone:0,
    sats:0,merc:null,sq:{},stash:[],q:{q1:0,q2:0,q3:0,q4:0,q5:0,q6:0,q7:0,q8:0,q9:0,q10:0},memos:[],marrow:false,disc:false,portal:null,chuteT:0,bossKills:0,seenIntro:false,god:false};
  G.eq.weapon=makeItem(1,0,'weapon');ZS={};freshState();calc();G.hp=S.maxHp;G.en=S.maxEn;
  G.walkNew=1;G.pre=1;playScene(PRE_INTRO,()=>startPlay())}

/* ================= save ================= */
const b64=u=>{let s='';for(let i=0;i<u.length;i+=4096)s+=String.fromCharCode.apply(null,u.subarray(i,i+4096));return btoa(s)};
const unb64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
function encW(w){return{zi:w.zi,N:w.N,ml:w.ml,tier:w.tier,map:b64(w.map),wh:b64(w.wh),seen:b64(w.seen),leftT:w.leftT,sub:w.sub,suAt:w.suAt,ents:w.ents.filter(e=>!e.mp),objs:w.objs,drops:w.drops,decals:w.decals.slice(-40),portals:w.portals,goal:w.goal,start:w.start}}
function decW(o){const w=Object.assign({},o);w.map=unb64(o.map);w.wh=unb64(o.wh);w.seen=unb64(o.seen);return w}
function saveObj(){const zs={};for(const k in ZS)zs[k]=encW(ZS[k]);let cur=null;if(W&&P){if(!W.z.town&&!W.z.sim)zs[W.zi]=encW(W);cur={zi:W.zi,x:P.x,y:P.y};if(W.z.sim&&W.sim)cur.sim=W.sim.rush?{rush:1}:{wave:Math.max(1,W.sim.wave|0)}}return{G,zs,cur,opt:OPT,t:Date.now()}}
function save(force){if(!G)return false;let ok=false;try{localStorage.setItem(skey(SLOT),JSON.stringify(saveObj()));localStorage.setItem(SAVEKEY+'_slot',SLOT);ok=true}catch(e){}
  if(CL&&(force||Date.now()-clAt>10000))cloudSave();return ok||!!CL}
/* account save: the viewer's own private documents in this page's database, one for the hero and one per district */
const CLD={};let CL=null,clBusy=false,clPend=false,clDirty={},clAt=0,clState='looking';
async function cloudSave(){if(!CL||!G)return;if(clBusy){clPend=true;return}clBusy=true;clAt=Date.now();const sn=SLOT;
  try{const o=saveObj(),zk=Object.keys(o.zs);
    for(const k of zk)if(clDirty[k]||(o.cur&&String(o.cur.zi)===k)){await CL.doc(zdoc(sn,k)).set({s:JSON.stringify(o.zs[k])});delete clDirty[k]}
    await CL.doc(mdoc(sn)).set({s:JSON.stringify({G:o.G,cur:o.cur,opt:o.opt,t:o.t}),zk,t:o.t,lv:o.G.lvl,cl:o.G.cls,ac:heroAct(o.G)});clState='ok'}catch(e){clState='err'}
  clBusy=false;if(clPend){clPend=false;cloudSave()}}
async function cloudInit(){try{if(!window.claude||!window.claude.use){clState='off';cloudNote();return}
    const u=await window.claude.use('user'),db=await window.claude.use('db'),id=u&&await u.id();if(!db||!id){clState='off';cloudNote();return}
    CL=db.collection('data/users/'+id);clState='on';for(let n=0;n<NSLOT;n++){try{const m=await CL.doc(mdoc(n)).get();if(m.exists&&!m.data().gone&&m.data().s)CLD[n]=m.data()}catch(e){}}
    await accCloud();if(mode==='title')drawSlots();
    if(G&&mode!=='title')cloudSave()}catch(e){clState='off'}cloudNote()}
async function cloudLoad(d,sn){const o=JSON.parse(d.s);o.zs={};for(const k of d.zk||[]){try{const z=await CL.doc(zdoc(sn||0,k)).get();if(z.exists)o.zs[k]=JSON.parse(z.data().s)}catch(e){}}return o}
function cloudNote(){const n=$('cloudNote');if(n)n.textContent=clState==='looking'?'Looking for your saved game…':CL?'Your progress is saved to your account as you play.':'Account saving is not available in this view. Progress is kept in this browser only.'}
function loadStored(n){try{const s=localStorage.getItem(skey(n===undefined?SLOT:n));return s?JSON.parse(s):null}catch(e){return null}}
function applySave(o){if(!o||!o.G||!CLS[o.G.cls])return false;G=o.G;G.sats=G.sats||0;G.merc=G.merc||null;G.sq=G.sq||{};G.stash=G.stash||[];while(G.sk.length<15)G.sk.push(0);if(G.q.q10===3&&G.unlocked<12)G.unlocked=12;for(const k in QUESTS)if(G.q[k]===undefined)G.q[k]=0;if(G.q.q5===3&&G.unlocked<7)G.unlocked=7;if(G.hp<=0){if(!G.hc)G.hp=9999;o.cur=null}ZS={};for(const k in (o.zs||{}))ZS[k]=decW(o.zs[k]);if(o.opt)OPT=Object.assign({},OPT_DEF,o.opt);G._cur=o.cur||null;boonRefund();return true}
/* A hardcore hero at 0 life is already gone. Loading that save begins again, the same as the death screen. */
function hcBegin(){const c=G&&CLS[G.cls]?G.cls:'scrapper';DY=null;const d=$('death');if(d)d.hidden=true;resetZones();newGame(c);G.hc=true;save(true)}
function startPlay(){ensureG();if(G.hc&&G.hp<=0){hcBegin();return}mpConnect();mode='play';$('title').hidden=true;$('hud').hidden=false;calc();setSkillButtons();
  const c=G._cur;delete G._cur;const cz=c&&ZONES[c.zi];
  if(cz&&(cz.town||cz.sim||ZS[c.zi])){const o={at:c,swap:1};if(cz.sim){o.wave=(c.sim&&c.sim.wave)||1;if(c.sim&&c.sim.rush)o.rush=1}enter(c.zi,o);if(cz.pre)return}else if(G.pre===1){enter(PREZ);return}else enter(HT());
  if(!G.q.q1&&W.z.town&&G.seenIntro!==false){talkTo('gramps')}
  if(G.rbNote){delete G.rbNote;setTimeout(()=>dlg('The deal is undone','Your acceptance of MANDATE’s offer has been struck from the record: its credits are gone, adoption is back where it was, and MANDATE is waiting at full strength in Still Water. This time the fight will pause and count down before you can answer.',[['Good']]),800)}}

/* ================= world ================= */
const walk=(x,y)=>W.map[(y|0)*W.N+(x|0)]===1;
const open=(x,y)=>W.map[(y|0)*W.N+(x|0)]!==0;
const free=(x,y,r)=>walk(x-r,y-r)&&walk(x+r,y-r)&&walk(x-r,y+r)&&walk(x+r,y+r);
function mv(e,dx,dy){let m=false;if(free(e.x+dx,e.y,e.r)&&!hedgeAt(e.x+dx,e.y,e)){e.x+=dx;m=true}if(free(e.x,e.y+dy,e.r)&&!hedgeAt(e.x,e.y+dy,e)){e.y+=dy;m=true}return m}
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function blankW(zi,N){return{zi,z:ZONES[zi],N,ml:0,tier:G.tier,map:new Uint8Array(N*N),wh:new Uint8Array(N*N),seen:new Uint8Array(N*N),ents:[],objs:[],drops:[],decals:[],portals:[],goal:null,start:null,npcs:[]}}
function initRuntime(){W.z=ZONES[W.zi];W.allies=[];W.projs=[];W.fx=[];W.texts=[];W.parts=[];W.npcs=W.npcs||[];W.boss=W.ents.find(e=>isBoss(e.k))||null;fxBind();
  W.mm=document.createElement('canvas');W.mm.width=W.mm.height=W.N;const g=W.mm.getContext('2d');W.mmg=g;
  for(let y=0;y<W.N;y++)for(let x=0;x<W.N;x++)if(W.seen[y*W.N+x])mmDot(x,y);
  buildTextures(W.z.style)}
function mmDot(x,y){const t=W.map[y*W.N+x];W.mmg.fillStyle=t?'rgba(200,165,90,.75)':'rgba(120,110,130,.9)';if(t||W.wh[y*W.N+x])W.mmg.fillRect(x,y,1,1)}
function classifyWalls(){const N=W.N,F=(x,y)=>x>=0&&y>=0&&x<N&&y<N&&W.map[y*N+x]!==0;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){if(W.map[y*N+x]!==0)continue;let adj=false;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)if(F(x+i,y+j))adj=true;if(!adj)continue;
    const front=F(x+1,y)||F(x,y+1)||F(x+1,y+1),behind=F(x-1,y)||F(x,y-1)||F(x-1,y-1)||F(x-2,y)||F(x,y-2)||F(x-2,y-1)||F(x-1,y-2)||F(x-2,y-2);
    W.wh[y*N+x]=W.z.out?1:front&&!behind?2+((x*7+y*3)%2):1}}
function solid(k,x,y,extra){const o=Object.assign({k,x:x+.5,y:y+.5},extra||{});W.objs.push(o);W.map[y*W.N+x]=2;return o}
function buildTown(zi){zi=zi||0;if(ZONES[zi].pre)return buildPre();const act=ZONES[zi].act||1;
  W=blankW(zi,26);const N=26;for(let y=3;y<=22;y++)for(let x=3;x<=22;x++)if(act!==2||Math.hypot(x-12.5,y-12.5)<10.4)W.map[y*N+x]=1;
  const road=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)W.map[y*N+x]=1};
  if(act===1){road(11,23,13,24);W.exit={x:12.5,y:24.3,ix:12.5,iy:21.5};for(const[x,y]of[[5,5],[20,5],[5,20],[20,20],[12,3],[3,12],[22,13]])solid('lamp',x,y)}
  else if(act===2){road(22,11,24,13);W.exit={x:24.3,y:12.5,ix:21,iy:12.5};for(const[x,y]of[[12,3],[3,12],[12,22],[6,6],[19,6],[6,19],[19,19]])solid('lamp',x,y)}
  else{road(11,1,13,2);W.exit={x:12.5,y:1.7,ix:12.5,iy:4.2};for(const[x,y]of[[3,12],[22,13],[12,22],[5,5],[20,5]])solid('lamp',x,y);for(const[x,y]of[[8,10],[16,10],[8,15],[16,15],[4,21],[21,21]])solid('prop',x,y,{v:1})}
  W.portals.push({x:W.exit.x,y:W.exit.y,kind:'exit'});
  solid('holo',12,9);solid('board',4,9,{v:0});solid('board',21,9,{v:1});solid('board',9,21,{v:2});solid('crates',16,20);solid('crates',8,4);
  classifyWalls();W.seen.fill(1);initRuntime();
  W.start={x:12.5,y:13.5};
  addLocals(zi);W.npcs.push({id:'float',x:16.5,y:16.5,name:'Mr. Float',col:'#5a6a8a'});
  if(G.tam)W.npcs.push({id:'tam',x:13.5,y:18.5,name:'Tam',col:'#6a9a5a'});
  if(G.sq.carer)W.npcs.push({id:'ines',x:10.5,y:18.5,name:'Ines',col:'#b08a6a'});
  W.npcs.push({id:'board',x:5.5,y:13.5,name:'Bounty Board'},{id:'stash',x:10.5,y:6.5,name:'Your Lockbox'},{id:'vr',x:20.5,y:14.5,name:'VR Simulator'},{id:'kestrel',x:9.5,y:12.5,name:'Kestrel',col:'#8a5a6a'},{id:'nonce',x:14.5,y:19.5,name:'Nonce',col:'#f7931a'},{id:'brenda',x:7.5,y:8.5,name:'Brenda',col:'#d9659b'},{id:'gramps',x:12.5,y:15.5,name:'Gramps',col:'#a39c86'},{id:'wren',x:18.5,y:18.5,name:'Wren',col:'#6a8f6a'},{id:'null',x:6.5,y:17.5,name:'Sister Null',col:'#d8d2e8'},{id:'gate',x:18.5,y:7.5,name:'Transit Gate'},{id:'ubi',x:15.5,y:4.5,name:'Stipend Terminal'});
  if(G.marrow)W.npcs.push({id:'marrow',x:18.5,y:12.5,name:'Marrow',col:'#8f7cc0'});
  const cols=['#7fa8d0','#d0a488','#a8c890','#c890bc','#d8c070','#90c8c0'];
  for(let i=0;i<(act===1?7:4);i++)W.npcs.push({id:'res',x:rnd(6,19),y:rnd(11,19),col:pick(cols),tx:12,ty:14,wait:rnd(0,3),say:'',st:0,cool:rnd(1,5),ph:rnd(0,6)});
  satShop=[];for(let i=0;i<(G.adopt<25?2:G.adopt>=60?7:5)+(G.nodeUp?1:0);i++){const r=Math.random(),q=r<.15?4:r<.32?3:2,it=makeItem(G.lvl+G.tier*12+ri(2,4),q);it.id=true;satShop.push({it,price:it.q===4?45:it.q===3?30:12})}
  shop=[];for(let i=0;i<8;i++)shop.push(Object.assign(makeItem(G.lvl+G.tier*12+ri(0,2),Math.random()<.12?2:1),{id:true}))}
/* the simulator: an arena outside the campaign. Waves grow in size, level and variety; nothing is saved and nothing is lost. */
function buildSim(wave,rush){W=blankW(6,30);const N=30;for(let y=4;y<=25;y++)for(let x=4;x<=25;x++)W.map[y*N+x]=1;
  for(const[x,y]of[[10,10],[19,10],[10,19],[19,19]])solid('prop',x,y,{v:1});for(const[x,y]of[[5,5],[24,5],[5,24],[24,24],[14,4],[14,25]])solid('lamp',x,y);
  classifyWalls();W.seen.fill(1);initRuntime();W.start={x:15,y:15};W.portals.push({x:6.5,y:7.5,kind:'home'});W.sim=rush?{rush:1,i:-1,t:2,list:rushList(),wave:0}:{wave:wave-1,t:3};W.ml=G.lvl;W.dyn=dynFor(W.ml)}
function simTick(dt){const s=W.sim;if(s.rush)return rushTick(dt);if(W.ents.length)return;s.t-=dt;if(s.t>0)return;
  if(s.wave>=1&&!s.paid){G.simBest=Math.max(G.simBest||0,s.wave)}
  s.wave++;s.t=4;const n=s.wave;mpSimWave(n);if(n>1)simChoice(n);W.ml=Math.max(1,G.lvl-1+Math.floor(n/2));W.dyn=dynFor(W.ml);
  const pool=['drone','tick'];if(n>=2)pool.push('bot');if(n>=3)pool.push('hound');if(n>=4)pool.push('ad');if(n>=5)pool.push('hr');if(n>=6)pool.push('mech');if(G.act2){if(n>=3)pool.push('lancer','splitter');if(n>=5)pool.push('seer','aegis')}
  const at=()=>{const a=rnd(0,6.283),r=rnd(7,9.5);return[clamp(15+Math.cos(a)*r,5,24.5),clamp(15+Math.sin(a)*r,5,24.5)]};
  const add=(k,o)=>{const[x,y]=at(),e=spawn(k,x,y,o);if(e)e.aggro=true;return e};
  for(let i=Math.min(22,4+Math.floor(n*1.5));i--;)add(pick(pool));
  for(let i=Math.floor(n/3);i--;)add(pick(pool.filter(k=>k!=='tick')),{champ:1});
  if(n%5===0)add(pick(['mech','bot','hr']),{su:{n:'Simulated '+pick(CN1)+pick(CN2),mods:Object.keys(MODS).sort(()=>Math.random()-.5).slice(0,2)}});
  toast('Wave '+n+(n%5===0?' · a lieutenant joins':''));sfx('warn');$('zone').textContent='The Simulator · Wave '+n;
  if(n>1){heal(S.maxHp*.3);G.en=S.maxEn;addDrop({cr:(3+W.ml*2)*(2+n)*Math.pow(G.cpi,.9)},P.x,P.y);if((n-1)%5===0)dropFrom('chest',P.x,P.y,W.ml)}}
/* the Humming Fields must always hold Marrow's cage until she is freed, including in districts saved before a fix */
function ensureCage(){if(W.zi!==3||G.marrow||W.objs.some(o=>o.k==='cage'&&!o.used))return;const N=W.N,c=W.suAt||W.goal||W.start,cx=Math.round(c.x),cy=Math.round(c.y);
  for(let r=2;r<12;r++)for(let y=cy-r;y<=cy+r;y++)for(let x=cx-r;x<=cx+r;x++){if(Math.max(Math.abs(x-cx),Math.abs(y-cy))!==r||x<2||y<2||x>N-3||y>N-3)continue;let ok=true;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)if(W.map[(y+j)*N+x+i]!==1)ok=false;if(ok){solid('cage',x,y);return}}}
function goalPt(){if(W&&W.z.pre)return preGoal();if(!W||W.z.town||W.z.sim||W.hold)return null;const lg=W.objs.find(o=>o.k==='leg');if(lg)return lg;const qo=W.objs.find(o=>o.k==='qobj'&&!o.used);if(qo)return qo;const pg=W.objs.find(o=>o.k==='page'&&!o.used);if(pg&&(G.q.q8||0)<2)return pg;const su=W.ents.find(e=>e.su&&e.q&&G.q[e.q]<2);if(su)return su;const mn=W.objs.find(o=>o.k==='minute'&&!o.used);if(mn)return mn;const cg=W.objs.find(o=>o.k==='cage'&&!o.used);if(cg&&!G.marrow)return cg;return W.goal}
const lvlCap=()=>G.act5?100:G.act4?90:G.act3?75:G.act2?50:25;
/* machines scale to the hero: level follows yours, and 60% of any strength beyond what the level expects is matched */
function zoneLevel(z){const b=z.lvl+G.tier*12;return OPT.dyn?Math.max(b,G.lvl):b}
function dynFor(ml){if(!OPT.dyn)return{hp:1,dmg:1};const p=pscore(S),f=r=>clamp(r<1?1:1+(r-1)*.8,1,12);return{hp:f(p.dps*2.4/(30*(1+.42*(ml-1)))),dmg:f(p.ehp/16/(7*(1+.22*(ml-1))))}}
function fillRoom(r,z,zi,i){
  if(i===1&&zi>=1&&zi<=4){const hot=zi>=3,pool=z.mix.filter(m=>m[0]!=='tick'&&!(zi===4&&m[0]==='mech')),n=hot?2:ri(3,4),mul=zi===4?.55:.7;
    for(let k=0;k<n;k++){const e=spawn(wpick(pool),r.x+rnd(-r.w+1,r.w-1)+.5,r.y+rnd(-r.h+1,r.h-1)+.5);if(e){e.gate=1;if(hot)e.dmg*=mul}}
    return}
  const cnt=ri(6,9);for(let k=0;k<cnt;k++){const t=wpick(z.mix),m=t==='tick'?2:1;for(let j=0;j<m;j++)spawn(t,r.x+rnd(-r.w+1,r.w-1)+.5,r.y+rnd(-r.h+1,r.h-1)+.5)}
  if(Math.random()<.5){const pool=z.mix.filter(m=>m[0]!=='tick');const t=wpick(pool);const e=spawn(t,r.x+.5,r.y+.5,{champ:1});if(e)for(let k=0;k<2;k++)spawn(t,e.x+rnd(-1.5,1.5),e.y+rnd(-1.5,1.5))}}
function genZone(zi){
  const z=ZONES[zi],N=72;W=blankW(zi,N);W.ml=zoneLevel(z);W.dyn=dynFor(W.ml);const map=W.map;
  const carve=(x0,y0,x1,y1)=>{for(let y=Math.max(1,y0);y<=Math.min(N-2,y1);y++)for(let x=Math.max(1,x0);x<=Math.min(N-2,x1);x++)map[y*N+x]=1};
  const n=z.boss?7:8,rooms=[{x:10,y:10,w:4,h:4}];
  for(let i=1;i<n;i++){const p=rooms[i-1];let c=null;
    for(let t=0;t<60;t++){const a=rnd(0,6.283),d=rnd(12,16),x=Math.round(p.x+Math.cos(a)*d),y=Math.round(p.y+Math.sin(a)*d);
      if(x<10||y<10||x>N-11||y>N-11)continue;c={x,y};if(rooms.every(r=>Math.hypot(r.x-x,r.y-y)>=11))break}
    if(!c)c={x:clamp(p.x+12,10,N-11),y:clamp(p.y+12,10,N-11)};
    const last=i===n-1&&z.boss;rooms.push({x:c.x,y:c.y,w:last?8:ri(4,6),h:last?8:ri(4,6)})}
  const blob=(cx,cy,r)=>{for(let y=Math.max(1,Math.floor(cy-r-1));y<=Math.min(N-2,Math.ceil(cy+r+1));y++)for(let x=Math.max(1,Math.floor(cx-r-1));x<=Math.min(N-2,Math.ceil(cx+r+1));x++)if(Math.hypot(x-cx,y-cy)<=r+((x*13+y*7)%5)*.22-.4)map[y*N+x]=1};
  if(z.out)rooms.forEach((r,i)=>{blob(r.x,r.y,Math.max(r.w,r.h)+.6);if(i){const p=rooms[i-1],d=Math.hypot(r.x-p.x,r.y-p.y),mx=(p.x+r.x)/2+rnd(-4,4),my=(p.y+r.y)/2+rnd(-4,4);for(let t=0;t<=1;t+=.5/d){const u=1-t,x=u*u*p.x+2*u*t*mx+t*t*r.x,y=u*u*p.y+2*u*t*my+t*t*r.y;blob(clamp(x,4,N-5),clamp(y,4,N-5),1.9)}}});
  else rooms.forEach((r,i)=>{carve(r.x-r.w,r.y-r.h,r.x+r.w,r.y+r.h);if(i){const p=rooms[i-1];carve(Math.min(p.x,r.x)-1,p.y-1,Math.max(p.x,r.x)+1,p.y+1);carve(r.x-1,Math.min(p.y,r.y)-1,r.x+1,Math.max(p.y,r.y)+1)}});
  W.start={x:rooms[0].x+.5,y:rooms[0].y+.5};W.portals.push({x:rooms[0].x-2.5,y:rooms[0].y-2.5,kind:'prev'});
  const corner=r=>{for(let t=0;t<25;t++){const x=r.x+ri(2,r.w)*(Math.random()<.5?-1:1),y=r.y+ri(2,r.h)*(Math.random()<.5?-1:1);let ok=true;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)if(map[(y+j)*N+x+i]!==1)ok=false;if(ok)return[x,y]}return null};
  const put=(r,k,ex)=>{const c=corner(r);return c?solid(k,c[0],c[1],ex):null};
  const L=rooms[n-1];W.goal={x:L.x+.5,y:L.y+.5};
  const left=MEMOS.map((m,i)=>i).filter(i=>!G.memos.includes(i)).sort(()=>Math.random()-.5).slice(0,2);
  const memoRooms=[ri(1,n-2),ri(2,n-1)],strayRoom=ri(1,n-3),gobRoom=Math.random()<.4?ri(2,n-2):-1;
  for(let i=0;i<n;i++){const r=rooms[i];
    put(r,'lamp');if(Math.random()<.6)put(r,'lamp');
    for(let k=ri(1,3);k--;)put(r,'prop',{v:ri(0,2)});
    if(i===0){if(zi===1)addDrop({it:moorsBlade()},r.x+2.2,r.y+.5);continue}
    for(let k=ri(1,3);k--;)put(r,'crate');
    if(Math.random()<.22)put(r,'shrine',{sk:pick(Object.keys(SHR))});
    if(Math.random()<.18)put(r,'chest');
    if(i===strayRoom)W.objs.push({k:'stray',x:r.x+rnd(-1.5,1.5)+.5,y:r.y+rnd(-1.5,1.5)+.5});
    memoRooms.forEach((mr,j)=>{if(mr===i&&left[j]!==undefined)W.objs.push({k:'memo',x:r.x+rnd(-1,1)+.5,y:r.y+rnd(-1,1)+.5,id:left[j]})});
    if(i===n-1&&z.boss){spawn(z.bossK||'boss',L.x+.5,L.y+.5);for(let k=0;k<4;k++)spawn(z.guard||'mech',r.x+rnd(-6,6),r.y+rnd(-6,6));continue}
    fillRoom(r,z,zi,i);
    if(i===gobRoom)spawn('gob',r.x+.5,r.y-1.5);
    if(z.su&&i===n-2){const e=spawn(z.su.k,r.x+.5,r.y+.5,{su:z.su});for(let k=0;k<3;k++)spawn(z.su.k==='mech'?'bot':z.su.k,r.x+rnd(-2,2),r.y+rnd(-2,2));
      W.suAt={x:r.x,y:r.y}}
  }
  if(!z.boss)W.portals.push({x:L.x+.5,y:L.y+.5,kind:'next'});
  ensureCage();classifyWalls();initRuntime()}
function spawn(k,x,y,o){
  o=o||{};if(!free(x,y,.4)){x=Math.floor(x)+.5;y=Math.floor(y)+.5;if(!free(x,y,.4))return null}
  const t=ET[k],ml=W.ml,ch=o.champ||o.su?1:0,su=o.su?1:0;
  const df=W.z.sim?DIFFS[0]:DF(),dy={hp:(W.dyn?W.dyn.hp:1)*df.hp,dmg:(W.dyn?W.dyn.dmg:1)*df.dmg},hp=t.hp*(1+.42*(ml-1))*(su?5:ch?2.8:1)*(isBoss(k)?2.5:1)*dy.hp;
  const e={k,x,y,r:t.r*(ch?1.2:1),hp,max:hp,dmg:t.dmg*(1+.22*(ml-1))*(ch?1.3:1)*(isBoss(k)?1.35:1)*(ml>25?1+.008*(ml-25):1)*dy.dmg,ward:0,spd:t.spd,cd:rnd(0,1),wind:0,stun:0,slow:0,mark:0,flash:0,aggro:false,champ:ch,su,sz:su?1.4:ch?1.22:1,ph:rnd(0,6),mods:{},b1:3,b2:6,b3:0,arcCd:0,healCd:rnd(2,5),name:t.n,minion:o.minion?1:0};
  if(!isBoss(k)&&W.z.lvl)e.name=(ZADJ[W.zi]?ZADJ[W.zi]+' ':'')+t.n;
  if(su){e.name=o.su.n;e.q=o.su.q;for(const m of o.su.mods)e.mods[m]=1}
  else if(ch){e.name=pick(CN1)+pick(CN2)+' '+pick(CN3);const ks=Object.keys(MODS).sort(()=>Math.random()-.5);e.mods[ks[0]]=1;if(G.tier>0||ml>=9)e.mods[ks[1]]=1}
  if(e.mods.fast)e.spd*=1.5;if(e.mods.strong)e.dmg*=1.6;
  if(defragAct1(e)){e.dty='impact';e.dmg*=.85}
  p7Spawn(e);W.ents.push(e);if(isBoss(k))W.boss=e;return e}
function enter(zi,o){setTimeout(mpBeat,0);
  o=o||{};const carry=!o.swap&&W&&W.allies?W.allies.filter(a=>a.per):[];if(!o.swap&&W&&!W.z.town&&!W.z.sim){raidLeave();W.leftT=G.time;ZS[W.zi]=W;clDirty[W.zi]=1}
  const z=ZONES[zi];G.zone=zi;if(!z.sim)G.town=townOf(zi);let old=0;
  if(z.town)buildTown(zi);else if(z.sim)buildSim(o.wave||1,o.rush);else if(ZS[zi]&&ZS[zi].tier===G.tier&&!o.fresh){W=ZS[zi];old=1;ensureCage();initRuntime()}else genZone(zi);
  let at=o.at||W.start;if(o.from==='next'){const p=W.portals.find(p=>p.kind==='next');at=nearFree(p||W.goal||W.start)}else if(o.from==='exit'&&W.exit)at={x:W.exit.ix,y:W.exit.iy};else if(o.at&&!free(at.x,at.y,.3))at=nearFree(at,1.2);
  P={x:at.x,y:at.y,r:.32,dir:{x:1,y:0},atk:0,cd:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],silence:0,oc:0,swing:0,flash:0,inv:.5,slow:0,buff:0,haste:0,guard:0,dash:null,volley:null,moving:false,warn:0,movedT:0,spin:0,walkPh:0,shr:null,band:10,hb:0,stealth:0,ambT:0,ambM:1,mech:0,crunch:0,streak:0,streakT:0};BLOOD=[];for(const a of carry){a.x=P.x+rnd(-1,1);a.y=P.y+rnd(-1,1);W.allies.push(a)}spawnMerc();evEnd(1);if(old&&W.leftT!==undefined&&G.time-W.leftT>150&&repop())setTimeout(()=>toast('You were gone a while. The machines have drifted back.'),900);if(!z.town&&!z.sim){placeQuestObjs();ensureNode();}p7Enter();if(!z.town&&!z.sim){for(const k in SQ){const st=sqStep(k);if(st&&st.t==='esc'&&st.zi===zi)escStart(k,SQ[k].steps[G.sq[k].s-1].esc)}}if(z.town)for(const k in sqSkip)delete sqSkip[k];
  if(z.town){if(G.form){G.form=null;G.formDt=null;G.formT=0;calc()}G.hp=S.maxHp;G.en=S.maxEn}
  else if(!z.sim){const q=z.su?z.su.q:z.bq;if(G.q[q]===0&&!QUESTS[q].brief){G.q[q]=1;toast('New quest: '+QUESTS[q].n);sfx('questnew')}if(q==='q3'&&G.q.q3===1&&!W.ents.some(e=>e.q==='q3'))G.q3open=1;if(q==='q8')ensurePage();if(q==='q12')ensureMinute()
  }
  $('zone').textContent=z.n+(G.tier?' · Tier '+G.tier:'');$('boss').hidden=true;hudC={};
  const act=actOf(zi);if(G.pre===1&&z.town&&!z.pre)preLeft();
  if(z.pre){preEnter()}
  else if(act===5&&!G.act5){G.act5=G.act4=G.act3=G.act2=true;G['in'+zi]=1;setTimeout(()=>playScene(INTRO5,()=>{mode='play';dlg('Act V · The Awakening','Level limit 100, a fifth passive slot, and fast machines that silence skills. The Old Drive is in the garage, in a coffee can. It will talk, if the machines let you hear it.',[['Begin']])}),50)}
  else if(act===4&&!G.act4){G.act4=G.act3=G.act2=true;G['in'+zi]=1;setTimeout(()=>playScene(INTRO4,()=>{mode='play';dlg('Act IV · The Gentle Years','Level limit 90. These machines slow you, drain your energy, and hit harder than the Board. They will not chase you if you sit down. Do not sit down.',[['Begin']])}),50)}
  else if(act===3&&!G.act3){G.act3=true;G.act2=true;G['in'+zi]=1;setTimeout(()=>playScene(INTRO3,()=>{mode='play';dlg('Act III · The Board','Level limit 75, and a fifth skill row opens at level 51. They have been in those chairs longer than you have been alive. The row does not care.',[['Begin']])}),50)}
  else if(act===2&&!G.act2){G.act2=true;G['in'+zi]=1;setTimeout(()=>playScene(INTRO2,()=>{mode='play';dlg('Act II · The Cloud','Level limit 50, and a fourth skill row opens. The fourth row is yours. Vale does not get a vote on it.',[['Begin']])}),50)}
  else if(!z.town&&!G['in'+zi]&&z.intro){G['in'+zi]=1;dlg(z.n,z.intro,[['Go on']])}
  else toast(z.town?z.n:'Entering '+z.n);
  if(G.walkNew&&z.town&&!z.pre){if(OPT.noWalk)G.walkNew=0;else walkArm()}seenT=0;music(zoneMusic());save(true)}
function openPortal(){if(mode!=='play'||W.z.town)return;if(mpPortalBlocked())return;if(W.z.sim){sfx('portal');enter(HT());return}if(nearest(4)){toast('Machines are too close to open a portal');return}
  G.portal={zi:W.zi,x:P.x,y:P.y};sfx('portal');enter(HT());toast('A portal back stands open in the square')}
function resetZones(){ZS={};G.portal=null}

/* ================= combat ================= */
function nearest(range,from){let b=null,bd=range;from=from||P;for(const e of W.ents){const d=dist(e,from);if(d<bd){bd=d;b=e}}return b}
function face(t){const d=dist(t,P)||1;P.dir={x:(t.x-P.x)/d,y:(t.y-P.y)/d}}
function float(x,y,txt,col,kind){if(kind===0&&!OPT.dmgOut)return;if(kind===1&&!OPT.dmgIn)return;W.texts.push({x:x+rnd(-.2,.2),y,txt,col,t:0})}
let lastToast='',lastToastT=0;
const toastQ=[];function toast(s){if(TAGQ)return;if(mode==='scene'){if(toastQ.length<3&&!toastQ.includes(s))toastQ.push(s);return}const l=$('log');for(const c of l.children)if(c.textContent===s)return;if(s===lastToast&&tNow-lastToastT<1.5)return;lastToast=s;lastToastT=tNow;const d=document.createElement('div');d.textContent=s;l.appendChild(d);while(l.children.length>2)l.firstChild.remove();setTimeout(()=>d.remove(),2800)}
function heal(v){G.hp=Math.min(S.maxHp,G.hp+v);if(P)P.band=Math.max(P.band,Math.ceil(G.hp/S.maxHp*10))}
/* One budget for Full and Normal: 48 shapes, 80 particles. Rings go first.
   A warn, and a patch you can still walk out of, stay. Thin adds nothing
   to the particle list. Other players' casts are skipped at draw time. */
function fxProtected(f){return !!f&&(f.k==='warn'||f.stay||(f.k==='patch'&&f.tel))}
function fxTrim(){if(!W||!W.fx||!W.parts)return;
  while(W.fx.length>48){let i=-1;for(let j=0;j<W.fx.length;j++)if(W.fx[j].k==='ring'){i=j;break}
    if(i<0)for(let j=0;j<W.fx.length;j++)if(!fxProtected(W.fx[j])){i=j;break}
    if(i<0)break;W.fx.splice(i,1)}
  while(W.parts.length>80)W.parts.shift()}
function fxBind(){if(!W||!W.fx||!W.parts||W.fx._cap)return;
  const fp=W.fx.push.bind(W.fx);W.fx.push=function(){const n=fp.apply(W.fx,arguments);fxTrim();return n};W.fx._cap=1;
  const pp=W.parts.push.bind(W.parts);W.parts.push=function(){if(OPT.fx==='thin')return W.parts.length;const n=pp.apply(W.parts,arguments);fxTrim();return n};W.parts._cap=1}
function fxPatch(x,y,r,col,life,tel){if(!W)return;W.fx.push({k:'patch',x,y,r:r||1.4,col:col||'#ff7a3c',t:0,life:life||.8,tel:tel?1:0})}
function fxTrail(x,y,x2,y2,col,life){if(!W)return;W.fx.push({k:'trail',x,y,x2,y2,col:col||'#f7931a',t:0,life:life||.4})}
function fxMark(x,y,col,n,life){if(!W)return;W.fx.push({k:'mark',x,y,col:col||'#ffe36b',n:n||0,t:0,life:life||1.4})}
function fxOrbit(x,y,col,life){if(!W)return;W.fx.push({k:'orbit',x,y,col:col||'#59e0e6',n:3,t:0,life:life||.7})}
function fxAim(k,x,y,r){if(!W||!W.fx)return;for(let i=W.fx.length-1;i>=0;i--){const f=W.fx[i];if(f.stay||f.k!==k)continue;f.x=x;f.y=y;if(r)f.r=r;if(k==='patch')f.tel=1;return}}
/* Lasting states. One stay record each, refreshed in place, so they do not toast and do not fill the effect list. Radii match the ticks. Toxic has no radius there, so the patch is 2.2. A party member or the hireling wears the same disc while they stand inside it. Testimony, On the Record, and a missed connection keep a mark, twelve at most. Two-Handed, Redaction, and a chassis keep one on you. Paint only. */
function auraVisR(i,L){L=L||1;if(i===4)return 3.5+.15*L;if(i===7)return 3.2+.1*L;if(i===3)return 2.2;return 0}
function dumpSpent(k){if(P)P.dump={k:k,t:1.4}}
function fxStay(id,rec){let f=null;for(const x of W.fx)if(x.sid===id){f=x;break}
  if(!f){f={sid:id,stay:1,t:0,life:1,k:rec.k};W.fx.push(f)}
  f.k=rec.k;f.x=rec.x;f.y=rec.y;f.r=rec.r||0;f.col=rec.col;f.n=rec.n||0;f.remote=rec.remote?1:0;f.stay=1;f.t=0;f.life=1;f.sid=id}
function stateMarks(){if(!W||!W.fx||!P)return;const live={};
  const keep=(id,rec)=>{live[id]=1;fxStay(id,rec)};
  const ar=P.aura?auraVisR(P.aura.i,P.aura.L||1):0;
  if(ar>0){keep('aura',{k:'patch',x:P.x,y:P.y,r:ar,col:'#f7931a'});
    const near=o=>!!(o&&(o.hp===undefined||o.hp>0)&&dist(o,P)<ar);
    if(near(W.merc))keep('aura-m',{k:'patch',x:W.merc.x,y:W.merc.y,r:ar,col:'#f7931a'});
    if(near(W.tag))keep('aura-t',{k:'patch',x:W.tag.x,y:W.tag.y,r:ar,col:'#f7931a'});
    if(typeof MP!=='undefined'&&MP.others)for(let i=0;i<MP.others.length;i++){const o=MP.others[i];if(o&&typeof mpInParty==='function'&&mpInParty(o.uid)&&near(o))keep('aura-p'+i,{k:'patch',x:o.x,y:o.y,r:ar,col:'#f7931a'})}}
  if(typeof MP!=='undefined'&&MP.others)for(let i=0;i<MP.others.length;i++){const o=MP.others[i];const rr=o&&auraVisR(o.au,o.aL||1);if(rr>0)keep('oth'+i,{k:'patch',x:o.x,y:o.y,r:rr,col:'#f7931a',remote:1})}
  if(P.reh>0&&P.rehT>0)keep('reh',{k:'mark',x:P.x,y:P.y,col:'#e6e2d6',n:P.reh});
  if(P.dip)keep('dip',{k:'mark',x:P.x,y:P.y,col:'#f7931a'});
  if(P.dump&&P.dump.t>0){const k=P.dump.k,col=k==='silence'?'#d98cff':k==='blades'?'#e6e2d6':'#c9803a',n=k==='silence'?2:k==='blades'?3:1;keep('dump',{k:'mark',x:P.x+.45,y:P.y,col:col,n:n})}
  if(W.allies)for(let i=0;i<W.allies.length;i++){const a=W.allies[i];if(a&&a.vest>0)keep('vest'+i,{k:'mark',x:a.x,y:a.y,col:'#e0bd6e',n:a.vest})}
  let noted=0;
  if(W.ents)for(let i=0;i<W.ents.length;i++){const e=W.ents[i];if(!e)continue;if(e.nc>0)keep('nc'+i,{k:'mark',x:e.x,y:e.y,col:'#e0bd6e'});if(e.leave)keep('lv'+i,{k:'patch',x:e.x,y:e.y,r:1.15,col:'#c9a868'});if(!(e.hp>0)||noted>=12)continue;if((e.tes||0)>0){keep('tes'+i,{k:'mark',x:e.x,y:e.y,col:'#e6dcc8',n:e.tes});noted++}if(noted<12&&e.onRecT>0){keep('orec'+i,{k:'mark',x:e.x+.35,y:e.y,col:'#8d9aab'});noted++}if(noted<12&&e.mc>0){keep('mc'+i,{k:'mark',x:e.x,y:e.y,col:'#3fbf8f'});noted++}}
  if(P.two&&P.two.n>0)keep('two',{k:'mark',x:P.x,y:P.y,col:'#d9822b',n:P.two.n});
  if(P.redact>0)keep('redact',{k:'patch',x:P.x,y:P.y,r:1.15,col:'#e6dcc8'});
  if(G.cls==='homesteader'){const fm=hsWearing();if(fm==='hound')keep('form',{k:'mark',x:P.x,y:P.y,col:'#6a8f62'});else if(fm==='hull')keep('form',{k:'patch',x:P.x,y:P.y,r:1.45,col:'#4e6a48'});else if(fm==='worn')keep('form',{k:'mark',x:P.x,y:P.y,col:'#c9803a'})}
  for(let i=W.fx.length-1;i>=0;i--)if(W.fx[i].sid&&!live[W.fx[i].sid])W.fx.splice(i,1)}
function parts(x,y,n,cols,sp,up){if(OPT.fx==='thin')return;for(let i=0;i<n;i++){const a=rnd(0,6.283),v=rnd(.3,1)*sp;W.parts.push({x,y,z:rnd(8,26),vx:Math.cos(a)*v,vy:Math.sin(a)*v,vz:rnd(40,120)*(up||1),t:0,life:rnd(.4,.9),col:pick(cols),s:rnd(2,4.5)})}}
function pdmg(m,e){
  let d=rnd(S.dmin,S.dmax)*(1+S.dmg/100)*m+S.shock*rnd(.8,1.2)*Math.max(.5,m);
  if(P.ambT>0)d*=P.ambM;
  if(G.cls==='scrapper'&&sl(8)){let c=0;for(const o of W.ents)if(dist(o,P)<4&&c<5)c++;d*=1+.04*sl(8)*c}
  /* Few Understand This: the more of them there are, the more correct you are. */
  if(G.cls==='maxi'&&sl(2)){let c=0;for(const o of W.ents)if(o.hp>0&&!o.mp&&c<8)c++;d*=1+.03*sl(2)*c}
  /* Twenty-One Million: a supply the difficulty cannot dilute. */
  if(G.cls==='maxi'&&sl(8)){d*=1+.03*sl(8);d*=Math.pow(partyH(),Math.min(1,.12*sl(8)))}
  /* Toxic Maximalism, the aura, while it is the one that is on. */
  {let tox=(P.aura&&P.aura.i===3)?P.aura.L:0;if(P.toxL>tox)tox=P.toxL;if(tox)d*=toxicDmg(tox)}
  if(P.shr&&P.shr.k==='might')d*=1.5;
  if(S.sp.exit&&e&&(e.champ||isBoss(e.k)))d*=1.5;
  if(S.sp.deadline&&P.movedT>0)d*=1.25;if(S.sp.tenmin&&e&&!e.hits)d*=1.6;if(G.cls==='founder'&&sl(13)&&!boonOn(13))d*=orgMul(!!P.allySwing);if(G.cls==='maxi'&&sl(10)&&P.aura)d*=nodeMul(!P.allySwing);else if(P.nodeM)d*=P.nodeM;if(P.fm&&P.fm.t>0)d*=P.fm.m;if(S.sp.hashrate)d*=1+.01*Math.min(40,P.streak);if(S.sp.quorum)d*=1+.05*Math.min(6,tanks().length+W.allies.filter(a=>a.k==='turret').length);
  let c=P.e82>0||Math.random()*100<S.crit;if(c)d*=S.critM;
  if(S.sp.severance&&Math.random()<.15){d*=3;c=true}
  return[d,c]}
function dmgEnemy(e,d,crit){if(e.hp<=0)return;if(e.mp){mpHurt(e,d,crit);return}e.hits=(e.hits||0)+1;d/=partyH();{let mk=e.mark>0?1.3:1;if(e.mkP>0)mk=Math.max(mk,1+e.mkP);if(mk>1)d*=mk}if(e.onRecT>0&&e.onRecM)d*=e.onRecM;if(P&&P.partyHit&&S.named&&(e.tes||0)>0){const base=d,up=d*(1+S.named),shown=Math.round(base);d=Math.round(up)===shown?shown+.5:up}
  const snd=e.snd;e.snd=0;if(!snd){if(e.mods.shield)d*=.5;if(e.ward>0)d*=.6}e.hp-=d;e.flash=.12;wake(e);if(crit){sfx('crit');hitStop=.04}
  float(e.x,e.y,Math.round(d)+(crit?'!':''),crit?'#ffe36b':'#ffffff',0);parts(e.x,e.y,crit?5:2,['#ffd27a','#fff','#ff9a3c'],2.2);
  if(e.mods.arc&&e.arcCd<=0){const soft=defragAct1(e);e.arcCd=soft?2.1:1.3;const n=soft?4:6,sp=soft?3.2:5,dm=soft?.38:.5;for(let i=0;i<n;i++){const a=i*(6.283/n)+e.ph;const pr={x:e.x,y:e.y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:1.3,foe:true,dmg:e.dmg*dm,col:'#59e0e6'};if(soft)pr.src={dty:'surge',name:e.name};W.projs.push(pr)}}
  if(e.hp<=0)kill(e)}
let procLock=false;
function hit(e,m,nl){if(e.hp<=0)return;let[d,c]=pdmg(m,e);d=typed(e,d);if(G.cls==='hacker'&&G.schema==='surge'&&sl(13)&&!boonOn(13)&&e.lt==='surge')P.barrier=Math.min(S.maxHp*(.2+.02*sl(13)),(P.barrier||0)+d*(.1+.02*sl(13)));sfx('hit');
  const lc=S.leech+(P.buff>0?P.buffL:0)+(P.lastShift>0&&P.swinging?8+sl(14):0);if(lc&&!nl)heal(d*lc/100);
  const st=S.stun+(S.sp.blackout?12:0);if(st&&Math.random()*100<st)e.stun=Math.max(e.stun,1);
  dmgEnemy(e,d,c);forkHit(e);
  if(S.sp.intern&&!procLock&&Math.random()<.2){procLock=true;chain(e,3,.8);procLock=false}}
function chain(from,n,m){const done=new Set();let f={x:from.x,y:from.y};for(let i=0;i<n;i++){let b=null,bd=i||from!==P?4.5:7;for(const e of W.ents)if(!done.has(e)){const d=dist(e,f);if(d<bd){bd=d;b=e}}if(!b)break;done.add(b);W.fx.push({k:'bolt',x:f.x,y:f.y,x2:b.x,y2:b.y,t:0,life:.2});f={x:b.x,y:b.y};hit(b,m)}return done.size}
function boomFx(e){const low=!G.act2;return {k:'warn',x:e.x,y:e.y,r:low?1.35:2.2,t:0,life:low?1.35:.7,boom:e.dmg*(low?.85:1.5)}}
function placeMinute(e){if(W.objs.some(o=>o.k==='minute'&&!o.used))return;W.objs.push({k:'minute',x:e.x,y:e.y})}
function ensureMinute(){if(W.zi!==13||G.q.q12!==1||!G.q12down||W.objs.some(o=>o.k==='minute'&&!o.used))return;const p=W.suAt||W.goal||{x:P.x,y:P.y};W.objs.push({k:'minute',x:p.x,y:p.y})}
function ensurePage(){if(W.zi!==9||(G.q.q8||0)!==1||G.q8page||W.objs.some(o=>o.k==='page'&&!o.used))return;const p=freeSpot(12);W.objs.push({k:'page',x:p.x,y:p.y})}
function tallyKill(e){if(e.minion||e.su||e.q||!W||W.z.sim)return;for(const k in QUESTS){const q=QUESTS[k],t=q.tally;if(!t||G.q[k]!==1||W.zi!==q.zi||!t.kinds.includes(e.k))continue;G.qt=G.qt||{};if((G.qt[t.key]||0)>=t.n)continue;G.qt[t.key]=(G.qt[t.key]||0)+1;float(e.x,e.y,t.item+' '+G.qt[t.key]+'/'+t.n,'#59e0e6');sfx('pick');if(G.qt[t.key]>=t.n&&G.qt[t.key+'Down']){G.q[k]=2;mpShareQuest(k,2);sfx('quest');toast('Quest complete: return to '+q.back)}}}
function kill(e){
  if(e.mp)return;
  if((G.cls==='founder'||G.cls==='homesteader')&&!e.minion){P.corpses=P.corpses||[];P.corpses.push({x:e.x,y:e.y,t:6});if(P.corpses.length>16)P.corpses.shift()}
  const pay=!!(P.fromThrow&&G.cls==='courier'&&sl(13)&&!boonOn(13)&&!(W.z&&W.z.sim));
  if(pay){const c=Math.floor((3+sl(13))*(G.cpi||1));P.hazMf=6*sl(13);if(c){G.credits+=c;float(P.x,P.y,'+'+fmt(c),'#ffe36b')}}else P.hazMf=0;
  if(e.mc>0&&G.cls==='courier'&&sl(14)&&!boonOn(14)){let x=e.x,y=e.y;if(!free(x,y,P.r)){for(let k=1;k<=8&&!free(x,y,P.r);k++){x=e.x+Math.cos(k)*k*.35;y=e.y+Math.sin(k)*k*.35}}if(free(x,y,P.r)){parts(P.x,P.y,8,['#3fbf8f','#fff'],2);P.x=x;P.y=y;parts(P.x,P.y,8,['#3fbf8f','#fff'],2)}P.inv=Math.max(P.inv,.25);P.freeThrow=1;float(P.x,P.y,'Missed connection','#3fbf8f',0)}
  const i=W.ents.indexOf(e);if(i<0)return;W.ents.splice(i,1);G.kills++;sfx(e.champ||isBoss(e.k)?'bigkill':'kill');const t=ET[e.k];
  parts(e.x,e.y,isBoss(e.k)?40:e.champ?18:9,[t.pal[0],t.pal[1],'#2a2630','#ffb84a'],3.2);W.fx.push({k:'ring',x:e.x,y:e.y,r:.9*e.sz,t:0,life:.3,col:'#ffb238'});
  W.decals.push({x:e.x,y:e.y,r:e.r*1.6,a:rnd(0,3)});if(W.decals.length>70)W.decals.shift();if(OPT.shake)shake=Math.max(shake,e.champ?5:2);
  P.streak=(P.streakT>0?P.streak:0)+1;P.streakT=4;
  gainXp(t.xp*(1+.8*(W.ml-1))*(e.su?10:e.champ?4:1)*(W.z.sim?.6:1)*(1+Math.min(.5,.02*P.streak))*(EV&&EV.k==='outage'?1.5:1)*(e.xpM||1)*mpXp(),0,W.ml);
  if(!W.z.sim)sqKill(e);if(e.k==='gob'){addDrop({sat:ri(3,6)},e.x,e.y);toast('The Dividend Drone pays out')}
  const boss=isBoss(e.k),b2=e.k==='boss2';
  if(!e.minion&&!W.z.sim){if(boss){dropFrom(e.k,e.x,e.y,W.ml,2,e.k==='boss3'?!G.boss3Kills:b2?!G.boss2Kills:G.bossKills===0);addDrop({cr:(3+W.ml*2)*40*Math.pow(G.cpi,.9)},e.x,e.y)}
    else if(e.su)dropFrom('su',e.x,e.y,W.ml,2);else if(e.champ)dropFrom('champ',e.x,e.y,W.ml,1);else dropFrom(e.k,e.x,e.y,W.ml)}
  if(!e.minion&&!W.z.sim){const sc=boss?1:e.su?1:e.champ?.35:S.sp.handshake?.13:.03;if(Math.random()<sc)addDrop({sat:boss?(b2?42:21):e.su?ri(8,12):e.champ?ri(3,6):ri(1,2)},e.x,e.y)}
  if(!e.minion&&!W.z.sim){p7Kill(e);recKill(e);partyKill(e);if(Math.random()<(boss||e.su?1:e.champ?.2:.02))addDrop({word:pick(WK)},e.x,e.y);if(EV&&EV.k==='block'&&Math.random()<.25)addDrop({sat:1},e.x,e.y);if(e.audit){dropFrom('chest',e.x,e.y,W.ml);toast('The auditor’s lockbox spills open');evEnd()}}
  P.hazMf=0;
  G.st.streak=Math.max(G.st.streak,P.streak);if(e.k==='gob')G.st.gobs++;
  if(e.k==='splitter'&&!e.minion)for(let i=0;i<2;i++){const c=spawn('tick',e.x+rnd(-.5,.5),e.y+rnd(-.5,.5),{minion:1});if(c)c.aggro=true}
  if(S.sp.vigil)heal(S.maxHp*.03);
  if(e.mods.boom)W.fx.push(boomFx(e));
  if(S.sp.whistle){W.fx.push({k:'ring',x:e.x,y:e.y,r:2.2,t:0,life:.3,col:'#ff5d4d'});for(const o of W.ents.slice())if(dist(o,e)<2.2)dmgEnemy(o,e.max*.3,false)}
  if(!W.z.sim)tallyKill(e);if(e.q&&G.q[e.q]<2){const qq=QUESTS[e.q],tt=qq.tally,got=tt?((G.qt&&G.qt[tt.key])||0):0;if(e.q==='q3'){G.q3open=1;sfx('quest');toast('Defrag falls. Follow the arrow to Marrow\u2019s cage and open it.')}else if(e.q==='q12'){G.q12down=1;placeMinute(e);sfx('quest');toast('The shorthand stops. Strike the minutes it already filed.')}else if(e.q==='q8'&&!G.q8page){G.q8down=1;ensurePage();sfx('quest');toast('Lethe falls. A letter is still above the water.')}else if(tt&&got<tt.n){G.qt=G.qt||{};G.qt[tt.key+'Down']=1;sfx('quest');toast(qq.n+': '+got+'/'+tt.n+'. '+tt.left)}else{G.q[e.q]=2;mpShareQuest(e.q,2);sfx('quest');toast('Quest complete: return to '+qq.back)}}
  if(boss&&W.z.sim){W.boss=null;$('boss').hidden=true;music(zoneMusic());for(const o of W.ents.slice())if(o.minion)W.ents.splice(W.ents.indexOf(o),1)}
  else if(boss){W.boss=null;music(zoneMusic());sfx('quest');$('boss').hidden=true;W.portals.push({x:e.x,y:e.y,kind:'home'});W.goal={x:e.x,y:e.y};if(OPT.shake)shake=12;const b3=e.k==='boss3';
    for(const o of W.ents.slice())if(o.minion)kill(o);W.projs=W.projs.filter(p=>!p.foe);if(e.k==='gap'||e.k==='boss4'||e.k==='boss5'){bossKill2(e);return}
    if(b3){G.boss3Kills=(G.boss3Kills||0)+1;G.q.q15=3;G.unlocked=Math.max(G.unlocked,22);if(G.boss3Kills===1){addDrop({it:mkFixed(UNI.find(u=>u.id==='still'),W.ml,4)},e.x,e.y);addAdopt(5,'MANDATE is silent')}}
    else if(b2){G.boss2Kills=(G.boss2Kills||0)+1;G.q.q10=3;G.unlocked=Math.max(G.unlocked,12);if(G.boss2Kills===1){addAdopt(5,'the Cloud is quiet')}if(G.boss2Kills===1||Math.random()<.25)addDrop({it:mkFixed(UNI.find(u=>u.id==='offer'),W.ml,4)},e.x,e.y)}
    else{G.bossKills++;G.q.q5=3;G.unlocked=Math.max(G.unlocked,7);G.maxTier=Math.max(G.maxTier,G.tier+1);if(G.bossKills===1)addAdopt(5,'the Regional Office falls');
      if(G.bossKills===1||Math.random()<.25)addDrop({it:mkFixed(UNI.find(u=>u.id==='exit'),W.ml,4)},e.x,e.y);if((G.unseen||0)>=3&&!G.got44){G.got44=true;addDrop({it:mkFixed(UNI.find(u=>u.id==='lines'),W.ml,4)},e.x,e.y)}}
    save(true);P.inv=4;
    const rep=(b3?G.boss3Kills:b2?G.boss2Kills:G.bossKills)>1;
    setTimeout(()=>{if(rep){toast(ET[e.k].n+' falls again.');return}if(b3)playScene(ENDING3.concat(CLOCK3),()=>{mode='play';actDone(3)});else playScene(b2?ENDING2:endingSlides(),()=>{mode='play';actDone(b2?2:1)})},1400)}}
function gainXp(v,fromParty,ml){if(fromParty!=='share'){if(P.shr&&P.shr.k==='xp')v*=1.5;v*=(G.hc?1.25:1)*(SEA.k==='over'?1.2:1);if(!fromParty&&mpShareXp(v,ml))return}
  if(G.lvl>=lvlCap()){paraXp(v);return}G.xp+=v;while(G.xp>=xpNext(G.lvl)&&G.lvl<lvlCap()){G.xp-=xpNext(G.lvl);G.lvl++;G.sp++;G.ap+=5;calc();G.hp=S.maxHp;G.en=S.maxEn;sfx('level');toast('Level '+G.lvl+'. One skill point, five attribute points, and a point for the web.');W.fx.push({k:'ring',x:P.x,y:P.y,r:2.8,t:0,life:.7,col:'#ffe36b'});parts(P.x,P.y,24,['#ffe36b','#fff'],2,1.6)}}
/* Hardcore does not re-onboard. Begin again throws this hero away, so a fee here would be a number that never lands. The notice prints whole credits, so the charge is the floor of the rate. */
function deathFee(){if(G.hc)return 0;if(S.sp&&S.sp.coldwallet)return 0;if(G.act2)return Math.floor(G.credits*.15);const early=(G.deaths||0)<10,rate=early?.05:.08,cap=early?15:hireCost()*.08;return Math.floor(Math.min(G.credits*rate,cap))}
/* Act I Defrag (quest q3, before the Cloud). Later acts keep the old numbers. */
function defragAct1(e){return !!(e&&e.q==='q3'&&!G.act2)}
/* A player hit is already quartered by the server. Difficulty and companion pressure are for machines. */
/* A blow that lands while you are already falling does not fine you again or restart the notice. */
function hurt(d,slow,src){const pv=src&&src.pvp;if(mode==='dying'||(P.inv>0&&!pv)||(mode!=='play'&&!pv)||G.god)return;if(P.redact>0){float(P.x,P.y,'Redacted','#e6dcc8',1);return}if(src&&W&&W.ents&&W.ents.indexOf(src)>=0)src.lastAtk=d;if(P.dip){P.dip=0;float(P.x,P.y,'The dip','#f7931a',1);sfx('whiff');return}if(!pv)d*=partyD();if(!pv){let mk=P.mkAura>0?1.3:1;if(P.mkP>0)mk=Math.max(mk,1+P.mkP);if(mk>1)d*=mk}
  if(S.dodge&&Math.random()*100<S.dodge){float(P.x,P.y,'Dodge','#9fe0d0',1);sfx('whiff');return}
  if(P.route>0&&G.cls==='courier'&&sl(10)&&!boonOn(10)&&Math.random()*100<6+2*sl(10)){float(P.x,P.y,'Route','#3fbf8f',1);sfx('whiff');return}
  d=typedIn(d,src);d*=S.taken||1;d*=100/(100+(S.armor+(G.cls==='scrapper'&&sl(11)&&!boonOn(11)?Math.floor(Math.min(6,P.lineT||0))*4*sl(11):0))*(P.mech>0?2:1)*(P.guard>0?1.6:1)*(P.shr&&P.shr.k==='guard'?2:1));
  if(S.enc){const a=Math.min(G.en,d*S.enc);G.en-=a;d-=a}
  if(P.barrier>0&&d>0){const a=Math.min(P.barrier,d);P.barrier-=a;d-=a;if(a>0)float(P.x,P.y,'patched','#59e0e6',1);if(d<=0)return}
  if(G.cls==='witness'&&!(P&&P.tag)){const r=recGet();if(r>80&&S.coloHi)d*=S.coloHi;else if(r<20&&S.coloLo)d*=S.coloLo}
  G.hp-=d;if(d>0)P.lastLoss=d;P.flash=.15;sfx('hurt');float(P.x,P.y,'-'+Math.max(1,Math.round(d)),'#ff5a4d',1);if(slow&&!S.sp.offer&&!(P.lastShift>0)&&!(P.two&&P.two.n>0))P.slow=1.6;if(S.sp.clock&&G.hp>0&&G.hp<S.maxHp*.3&&!(G.clockT>0)){G.clockT=60;for(const o of W.ents)if(dist(o,P)<9){o.slow=4;o.stun=Math.max(o.stun,.6)}sfx('warn');toast('The dead alarm rings. Time drags for the machines.')}if(OPT.shake)shake=Math.max(shake,3);
  if(src&&src.hp>0){if(src.mods&&src.mods.leech&&!(src.noheal>0))src.hp=Math.min(src.max,src.hp+src.max*(defragAct1(src)?.05:.15));if(S.sp.terms)src.stun=Math.max(src.stun,1);if(S.thorns)dmgEnemy(src,S.thorns,false)}
  if(G.hp<=0&&S.sp.still&&!(G.stillT>0)){G.stillT=90;G.hp=S.maxHp;P.inv=2;for(const o of W.ents)o.stun=Math.max(o.stun,2.5);sfx('shrine');toast('Still Water: the room holds its breath.');return}
  if(G.hp<=0&&G.cls==='maxi'&&sl(14)&&!(G.keyT>0)){const sac=(W.merc&&W.merc.hp>0)?W.merc:(W.tag&&W.tag.hp>0)?W.tag:null;if(sac){G.keyT=60;G.hp+=d;hurtAlly(sac,1e9);float(P.x,P.y,'Not your keys','#f7931a',1);toast('Not your keys.');return}}
  if(G.hp<=0&&G.cls==='witness'&&!(P&&P.tag)&&sl(14)&&recGet()>80&&!(G.retractT>0)){G.hp=1;recSet(0);G.retractT=90/(1+(S.retr||0)/100);float(P.x,P.y,'Retraction','#e6dcc8',1);sfx('mend');return}
  if(G.hp<=0){if(S.sp.parachute&&G.chuteT<=0){G.chuteT=120;G.hp=S.maxHp*.5;P.inv=1.5;toast('The Golden Parachute opens.');return}
    if(W.z.sim){const n=W.sim.wave;if(W.sim.rush){G.hp=1;P.inv=9;sfx('death');dlg('Boss rush ended','You fell to number '+(W.sim.i+1)+' of '+W.sim.list.length+'. Nothing in here was real, so nothing was lost.',[['Unplug',()=>{G.hp=S.maxHp;enter(HT())}]]);return}G.simBest=Math.max(G.simBest||0,n-1);G.hp=1;P.inv=9;sfx('death');dlg('Simulation ended','You fell on wave '+n+'. Waves cleared: '+(n-1)+'. Your best: '+G.simBest+'. Nothing in here was real, so nothing was lost.',[['Unplug',()=>{G.hp=S.maxHp;enter(HT())}]]);return}
    /* The portal home is part of the death, so a save during the notice still has it. */adaptDeath();G.form=null;G.formDt=null;G.formT=0;G.hp=0;const fee=deathFee();G.credits-=fee;G.deaths=(G.deaths||0)+1;if(!G.hc&&W.start)G.portal={zi:W.zi,x:W.start.x,y:W.start.y};mode='dying';DY={t:0,fee,by:src&&src.name?src.name:'the machines',zi:W.zi,st:W.start,shown:0};if(G.hc)save(true);sfx('death');music(null);parts(P.x,P.y,30,['#b3261e','#7a0f0c','#e2473a'],3,1.4);bloodSplat(14);shake=10;J.x=J.y=0;atkHeld=false;$('stick').hidden=true;return}
  const band=Math.ceil(G.hp/S.maxHp*10);if(band<P.band&&band<=4){bloodSplat((5-band)*3)}P.band=band}
function attack(){
  if(P.atk>0||P.dash)return;const c=CLS[G.cls];unstealth();if(G.cls==='witness')P.witHold=1;
  if(P.mech>0){P.atk=.7;P.swing=.18;const t=nearest(2.6);if(t)face(t);burst(P.x+P.dir.x,P.y+P.dir.y,2,1.6+.25*sl(5),0,'#e0bd6e');return}
  const mel=c.melee||hsMelee();
  const two=mel&&P.two&&P.two.n>0;
  P.atk=(two?c.ivl*1.75:c.ivl/(1+(S.aspd+(P.buff>0?40:0))/100))/toxicSwing(P);P.swing=.18;sfx(mel?'swing':G.cls==='hacker'?'zap':'throw');
  const t=nearest(two?3.1:(mel?2.4:6.5));if(t)face(t);
  if(mel){mpNoteSwing();const reach=two?2.45:1.75,arc=two?-.35:.15;W.fx.push({k:'arc',x:P.x,y:P.y,dx:P.dir.x,dy:P.dir.y,t:0,life:.18,w:two?2.1:1});
    const dump1=G.cls==='anon'&&P.reh>0&&sl(10)&&!boonOn(10);if(dump1){P.reh--;if(P.reh<=0){P.reh=0;P.rehT=0}DT='rust';dumpSpent('rust')}
    P.swinging=1;for(const e of W.ents.slice()){const d=dist(e,P);if(d<reach+e.r&&((e.x-P.x)*P.dir.x+(e.y-P.y)*P.dir.y)/(d||1)>arc)hit(e,c.mult)}if(dump1)DT=null;P.swinging=0;
    if(two){P.two.n--;if(P.two.n<=0)P.two=null}smash(two?2.3:1.7)}
  else shoot(P.dir,c.mult,S.sp.deadletter||Math.random()*100<S.pierce?99:0)}
function smash(r){for(const o of W.objs)if(o.k==='crate'&&!o.used&&dist(o,P)<r)breakCrate(o)}
function breakCrate(o){o.used=1;W.map[(o.y|0)*W.N+(o.x|0)]=1;sfx('crate');parts(o.x,o.y,10,['#9a7a4a','#6a5030','#c9a868'],2.5);dropFrom('crate',o.x,o.y,W.ml)}
function shoot(d,m,pierce,o){o=o||{};const col=o.col||(G.cls==='hacker'?'#59e0e6':G.cls==='courier'||G.cls==='founder'?'#e6e2d6':'#c9a868'),dt=o.dt||DT||(P.fm&&P.fm.t>0&&P.fm.dt)||null,life=o.life||.7,spd=o.spd||11;
  W.projs.push({x:(o.from||P).x,y:(o.from||P).y,vx:d.x*spd,vy:d.y*spd,life,m,pierce:pierce||0,done:[],col,big:o.big||0,kind:G.cls,nl:o.nl||0,dt,throw:o.throw?1:(G.cls==='courier'&&!o.from?1:0),ret:o.ret?1:0,split:o.split?1:0});
  if(G.cls==='courier'&&!o.from)P.lastThrow={dx:d.x,dy:d.y,m,pierce:pierce||0,dt,col,life,spd,ret:o.ret?1:0,split:o.split?1:0}}
function burst(x,y,r,m,stun,col){W.fx.push({k:'ring',x,y,r,t:0,life:.35,col},{k:'ring',x,y,r:r*.6,t:0,life:.5,col:'#ffffff'});if(m){parts(x,y,10,[col,'#fff'],3,1.2);if(r>=2.4)W.decals.push({x,y,r:r*.3,a:rnd(0,3)})}if(OPT.shake)shake=Math.max(shake,3);if(m)sfx('boom');for(const e of W.ents.slice())if(Math.hypot(e.x-x,e.y-y)<r+e.r){if(stun)e.stun=Math.max(e.stun,stun);if(m)hit(e,m)}
  for(const o of W.objs)if(o.k==='crate'&&!o.used&&Math.hypot(o.x-x,o.y-y)<r)breakCrate(o)}
function dash(spd,t,m,end,trail){if(hsNoDash()){toast('The hull does not dash');sfx('err');return}P.dash={t,spd,m,hit:[],end,trail:trail||'',lx:P.x,ly:P.y,tr:0};P.inv=Math.max(P.inv,t+.12)}
function boonOn(i){const s=CLS[G.cls]&&CLS[G.cls].sk[i];return !!(s&&s.boon)}
/* Once per class, when that class no longer carries boons in indices 9–14.
   A single flag would swallow the refund for classes migrated in a later commit. */
function boonRefund(){
  if(!G||!CLS[G.cls])return;
  const sk=CLS[G.cls].sk;
  for(let i=9;i<15;i++)if(!sk[i]||sk[i].boon)return;
  if(typeof G.boonRefund!=='object'||!G.boonRefund)G.boonRefund={};
  if(G.boonRefund[G.cls])return;
  let n=0;G.sk=G.sk||[];while(G.sk.length<15)G.sk.push(0);
  for(let i=9;i<15;i++){n+=G.sk[i]||0;G.sk[i]=0}
  G.sp=(G.sp||0)+n;
  if(G.slots)for(let s=0;s<G.slots.length;s++)if(G.slots[s]>=9&&G.slots[s]<=14)G.slots[s]=-1;
  if(G.pas)G.pas=G.pas.filter(i=>i<9||i>14);
  G.boonRefund[G.cls]=1;
  if(n>0)toast('The old boons were withdrawn and the points returned.');
}
function shove(e,dist){const d0=Math.hypot(e.x-P.x,e.y-P.y)||.001,ux=(e.x-P.x)/d0,uy=(e.y-P.y)/d0,step=dist<0?-.25:.25,n=Math.max(1,Math.round(Math.abs(dist)/.25));
  for(let i=0;i<n;i++){const nx=e.x+ux*step,ny=e.y+uy*step;if(!free(nx,ny,e.r||.3))break;e.x=nx;e.y=ny}}
function scrTick(dt){
  if(P.dash)P.lineT=0;else P.lineT=Math.min(6,(P.lineT||0)+dt);
  if(P.lastShift>0)P.lastShift=Math.max(0,P.lastShift-dt);
  for(const a of W.allies){if(a.k!=='pail'||a.hp<=0)continue;
    const take=(who,max,cur,add)=>{if(a.hp<=0||!(max>0)||cur>=max||dist(who,a)>=2.6)return;const got=Math.min(a.hp,max*a.rate*dt,max-cur);if(got<=0)return;add(got);a.hp-=got};
    take(P,S.maxHp,G.hp,heal);
    if(W.merc&&W.merc.hp>0)take(W.merc,W.merc.max,W.merc.hp,v=>{W.merc.hp=Math.min(W.merc.max,W.merc.hp+v)});
    if(W.tag&&W.tag.hp>0)take(W.tag,W.tag.max,W.tag.hp,v=>{W.tag.hp=Math.min(W.tag.max,W.tag.hp+v)});
    for(const o of W.allies)if(o!==a&&o.hp>0&&o.max)take(o,o.max,o.hp,v=>{o.hp=Math.min(o.max,o.hp+v)});
    if(a.hp<=0)a.life=0}}
function hackTick(dt){
  for(const a of W.allies.slice()){
    if(a.k==='fault'){a.pulse-=dt;if(a.pulse>0)continue;a.pulse=.5;DT='heat';for(const e of W.ents.slice())if((a.pts||[]).some(pt=>Math.hypot(e.x-pt.x,e.y-pt.y)<a.r+e.r))hit(e,a.m,true);DT=null}
    if(a.k==='pstorm'){if(a.arm>0){a.arm-=dt;continue}a.pulse-=dt;if(a.pulse>0)continue;a.pulse=.5;DT='noise';for(const e of W.ents.slice())if(dist(e,a)<a.r+e.r)hit(e,a.m,true);DT=null;W.fx.push({k:'strike',x:a.x,y:a.y,t:0,life:.15})}}}
function runTick(dt){
  if(P.route>0)P.route=Math.max(0,P.route-dt);
  for(const a of W.allies){if(a.k!=='drop'||!(a.life>0))continue;const d=dist(a,P);if(d>a.leash){a.life=0;toast('The second drop pops');continue}if(d>1.5){a.x+=(P.x-a.x)/d*3.2*dt;a.y+=(P.y-a.y)/d*3.2*dt}}}
function anonDump(n,L,m){if(n>=3){dumpSpent('blades');W.fx.push({k:'ring',x:P.x,y:P.y,r:8,t:0,life:.35,col:'#e6e2d6'});for(const e of W.ents.slice())if(dist(e,P)<9)hit(e,(.9+.12*L)*m)}
  else if(n===2){dumpSpent('silence');for(const e of W.ents.slice())if(dist(e,P)<4.2){e.quiet=Math.max(e.quiet||0,2+.15*L);hit(e,(.4+.06*L)*m);float(e.x,e.y,'Silenced','#e6e2d6',0)}}
  else{const t=nearest(5);if(!t){toast('Nothing in reach');return}dumpSpent('rust');DT='rust';hit(t,(.8+.12*L)*m);DT=null}}
function anonTick(dt){if(P.rehT>0)P.rehT=Math.max(0,P.rehT-dt)}
function founderTick(dt){if(P.grave&&P.grave.t>0){P.grave.t-=dt;if(P.grave.t<=0)P.grave=null}if(P.corpses){for(const c of P.corpses)c.t-=dt;if(P.corpses.length)P.corpses=P.corpses.filter(c=>c.t>0)}
  if(sl(11)&&!boonOn(11))for(const a of W.allies)if(a.per){a.vestT=(a.vestT||0)+dt;if(a.vestT>=3){a.vestT-=3;a.vest=(a.vest||0)+1}}
  for(const e of W.ents.slice()){if(e.nc>0){e.nc-=dt;if(e.nc<0)e.nc=0}if(e.leave){e.leave.t-=dt;e.leave.c=(e.leave.c||0)-dt;if(e.leave.c<=0){e.leave.c=.5;dmgEnemy(e,e.leave.dps*.5,false)}if(e.leave.t<=0)e.leave=null}}}
function orgMul(ally){if(G.cls!=='founder'||!sl(13)||boonOn(13))return 1;const n=W.allies.filter(a=>a.per).length;if(!n)return 1;return ally?1+n*(.08+.01*sl(13)):Math.max(0,1-n*(.04+.01*sl(13)))}
function vestMul(a){if(!a||!a.per||!sl(11)||boonOn(11))return 1;return 1+(.04+.01*sl(11))*(a.vest||0)}
function nodeMul(self){if(G.cls!=='maxi'||!sl(10)||!P.aura)return 1;const b=.06+.02*sl(10);return 1+(self?b/2:b)}
function maxiTick(dt){if(G.keyT>0)G.keyT=Math.max(0,G.keyT-dt);const c=P.cite;if(!c)return;c.cd-=dt;if(c.cd>0)return;c.cd=c.gap;c.n--;const t=nearest(7);if(t)face(t);DT='sound';shoot(P.dir,c.m,0,{dt:'sound',col:'#f7931a'});DT=null;if(c.n<=0)P.cite=null}
function openTarget(range,from){let b=null,bd=range;from=from||P;for(const e of W.ents){if(e.nc>0)continue;const d=dist(e,from);if(d<bd){bd=d;b=e}}return b}
function founderLiq(L,m){const cs=(P.corpses||[]).filter(c=>c.t>0&&Math.hypot(c.x-P.x,c.y-P.y)<5);if(!cs.length){toast('No corpses to liquidate');return}for(const c of cs){c.t=0;burst(c.x,c.y,2.2,(1.1+.15*L)*m,0,'#e0bd6e')}P.corpses=P.corpses.filter(c=>c.t>0)}
function skillTick(dt){if(P.dump&&P.dump.t>0){P.dump.t-=dt;if(P.dump.t<=0)P.dump=null}if(P.castWait>0)P.castWait=Math.max(0,P.castWait-dt);if(G.cls==='scrapper')scrTick(dt);else if(G.cls==='hacker')hackTick(dt);else if(G.cls==='courier')runTick(dt);else if(G.cls==='anon')anonTick(dt);else if(G.cls==='founder')founderTick(dt);else if(G.cls==='maxi')maxiTick(dt);else if(G.cls==='homesteader')hsTick(dt);else if(G.cls==='witness')witTick(dt)}
/* Draft magnitudes for the Homesteader. The plan fixed the body; these are the row-3-sized coefficients. */
const HS={leash:4.5,leashBull:7,graftLeash:1,graftDur:1.4,soakerDur:1.5,shed:.7,houndSpd:28,houndArm:.7,hullSpd:-28,hullArm:1.55,wornArm:1.35,plotR:2.2,plotLife:6,frostR:3.4,frostLife:8,hedgeLife:4,strayCap:4,bigStep:2,bigMax:8,bigArm:3,fallowPlot:1.6};
function hsForm(){return P&&P.tag?(P.form||null):(G.form||null)}
/* The body on screen is G.form. A companion cast (TAGQ) is the only time the form lives on P. */
function hsWearing(){const via=typeof TAGQ!=='undefined'&&TAGQ&&P&&P.tag;return via?(P.form||null):((G&&G.form)||null)}
function hsShed(){const via=typeof TAGQ!=='undefined'&&TAGQ&&P&&P.tag,f=hsWearing();if(!f){toast('You are not wearing a chassis');return false}
  if(via){P.form=null;P.formDt=null;P.formT=0}else{const was=G.form;G.form=null;G.formDt=null;G.formT=0;if(was)calc()}
  if(P&&P.dash)P.dash=null;P.castWait=(S&&S.shed)||HS.shed;return true}
function hsSetForm(f,dt){
  if(P&&P.tag){P.form=f||null;P.formDt=f?(dt||null):null;if(f!=='hull')P.formT=0;return}
  const was=G.form;G.form=f||null;G.formDt=f?(dt||null):null;if(f!=='hull')G.formT=0;if(was!==G.form)calc()}
function hsMelee(){return G.cls==='homesteader'&&!!hsForm()}
function hsNoDash(){return G.cls==='homesteader'&&hsForm()==='hull'}
function hsGraft(){const w=P&&P.tag?(G.tag&&G.tag.eq&&G.tag.eq.weapon):(G.eq&&G.eq.weapon);return !!(w&&w.fam==='graft'&&G.cls==='homesteader')}
function hsLeash(){return HS.leash+(hsGraft()?HS.graftLeash:0)}
function hsDur(sec){return sec*(hsGraft()?HS.graftDur:1)*((S.sp&&S.sp.soaker)?HS.soakerDur:1)}
function hsBlocked(i){
  if(!G||G.cls!=='homesteader')return null;const sk=CLS.homesteader.sk[i];if(!sk||!sk.a)return null;const f=hsWearing();
  if(!f&&i===7)return 'You are not wearing a chassis';
  if(f==='hull'&&i===1)return 'The hull does not become a hound';
  if(f&&(i%3===0||i%3===2))return f==='hound'?'The hound has no hands for that':f==='hull'?'The hull has no hands for that':'You are wearing a machine. Shed it first.';
  return null}
function hsHands(){const f=hsForm();if(!f)return false;toast(f==='hound'?'The hound has no hands for that':f==='hull'?'The hull has no hands for that':'You are wearing a machine. Shed it first.');return true}
function hsDropPlots(){if(!W||!W.allies)return;for(let i=W.allies.length-1;i>=0;i--)if(W.allies[i].plot)W.allies.splice(i,1)}
function hsDropFlock(){if(!W||!W.allies)return;for(let i=W.allies.length-1;i>=0;i--)if(W.allies[i].flock)W.allies.splice(i,1)}
function hsPlacePlot(x,y,o){
  const mul=(P.compost||1)*(G.doc==='fallow'?HS.fallowPlot:1);P.compost=0;
  let px=x,py=y;if(typeof free==='function'&&!free(px,py,.2)){px=P.x;py=P.y}
  W.allies.push({k:'plot',plot:1,x:px,y:py,life:hsDur(o.life),r:o.r,cd:.2,m:(o.m||.2)*mul,dt:'rust'})}
function hsInPlot(a){if(!S.root)return false;for(const p of W.allies)if(p.plot&&p.k==='plot'&&p.life>0&&dist(a,p)<(p.r||2)+.25)return true;return false}
function hsFlockStep(a,dt){
  a.ph=(a.ph||0)+dt;a.flash=Math.max(0,(a.flash||0)-dt);
  const leash=a.kind==='bull'?HS.leashBull:hsLeash(),home=dist(a,P),rooted=hsInPlot(a);
  if(rooted&&!a.feral)a.foe=0;else if(!rooted&&home>leash)a.foe=1;
  if(a.foe&&S.feral)a.feral=1;if(a.feral)a.foe=1;
  const spd=(a.spd||4.2)*dt,fer=(a.feral&&S.feral)?S.feral:1,biteF=G.doc==='fallow'?.85:1;
  if(a.foe){
    let foe=P,bd=home;for(const e of W.ents){if(e.hp<=0||e.mp)continue;const d=dist(e,a);if(d<bd){bd=d;foe=e}}
    const d=dist(foe,a)||1;
    if(d>1.05){hsNudge(a,(foe.x-a.x)/d*spd,(foe.y-a.y)/d*spd);a.mov=true;a.fx=(foe.x-a.x)>0?1:-1}
    const reach=foe===P?1.2:(a.rng||1.2)+(foe.r||.3);
    if(d<reach&&a.cd<=0){a.cd=a.ivl||.65;
      if(foe===P){a.bit=(a.bit||0)+1;hurt((a.bite||8)*fer*biteF,false,null)}
      else hsFlockHit(a,foe,(a.m||.4)*fer)}
    if(!a.feral&&home<1.15&&(a.bit||0)>0)a.foe=0;
    return}
  let t=null;if(a.kind==='bull')t=nearest(8,a);else t=nearest(5.5,P);
  const g=t||P,d=dist(g,a)||1,rg=a.rng||1.15,want=t?rg*.85:1.35;
  if(d>want){hsNudge(a,(g.x-a.x)/d*spd,(g.y-a.y)/d*spd);a.mov=true;a.fx=(g.x-a.x)>0?1:-1}
  if(t&&d<rg+t.r&&a.cd<=0){a.cd=a.ivl||.65;hsFlockHit(a,t,a.m||.4)}}
function hsNudge(a,dx,dy){if((a.foe||a.feral)&&hedgeAt(a.x+dx,a.y+dy,a))return;a.x+=dx;a.y+=dy}
function hsFlockHit(a,foe,mul){const go=()=>{P.allySwing=1;hit(foe,mul,true);P.allySwing=0};DT=a.dt||(a.kind==='bull'?'heat':'rust');if(a.soundSwing)witWrap(a,go);else{P.partyHit=1;go();P.partyHit=0}DT=null}
function hedgeAt(x,y,who){
  if(!W||!W.allies)return false;
  if(who&&who!==P&&(who===W.merc||who===W.tag||who===W.esc))return false;
  for(const a of W.allies){if(a.k!=='hedge'||!(a.life>0))continue;const rr=(a.r||.42)+(who&&who.r?Math.min(who.r,.32):.2);
    if(Math.hypot(a.x-x,a.y-y)>=rr)continue;if(who&&Math.hypot(a.x-who.x,a.y-who.y)<rr)continue;return true}
  return false}
function hsTick(dt){
  if(P.corpses){for(const c of P.corpses)c.t-=dt;P.corpses=P.corpses.filter(c=>c.t>0)}
  if(G.form==='hull'){const prev=Math.floor((G.formT||0)/HS.bigStep);G.formT=(G.formT||0)+dt;if(Math.floor(G.formT/HS.bigStep)!==prev)calc()}}
/* Draft magnitudes for the Witness. The plan fixed the meter and the life total; these coefficients sit near a row-3 hit and are called out as draft. */
const WIT={fill:8,still:1.6,book:1.22,carbon:1.3,cap:6,stack:1.15,decay:1,high:4,onRec:8,thread:.7,sentMax:25,pressStack:2};
const WITMIN={1:1,3:20,4:1,6:1,7:30,9:25,10:20,12:1};
function recBag(){return (P&&P.tag)?P:G}
function recGet(){const b=recBag();return Math.max(0,Math.min(100,+b.page||0))}
function recSet(v){recBag().page=Math.max(0,Math.min(100,v))}
function witBook(){const w=(P&&P.tag)?(G.tag&&G.tag.eq&&G.tag.eq.weapon):(G.eq&&G.eq.weapon);const cls=(P&&P.tag)?G.cls:(G&&G.cls);return !!(w&&w.fam==='notebook'&&cls==='witness')}
function witCap(){let n=WIT.cap;if(witBook())n+=1;if(S&&S.sp&&S.sp.press)n+=WIT.pressStack;return n}
function witNeed(i){const base=WITMIN[i]||0;if(!base)return 0;return Math.max(1,Math.ceil(base*(1+((S&&S.recCost)||0)/100)))}
function witSeen(e){if(!e||e.hp<=0||e.mp)return false;if(typeof SX!=='function')return dist(e,P)<8;const x=SX(e.x,e.y),y=SY(e.x,e.y);return x>-48&&y>-48&&x<VW+48&&y<VH+48}
function witHostile(){if(!W||!W.ents)return false;for(const e of W.ents)if(witSeen(e))return true;return false}
function witBlank(){toast('The page is blank');float(P.x,P.y,'the page is blank','#e6dcc8',0);sfx('err')}
function witBlock(i){if(!G||G.cls!=='witness')return null;const sk=CLS.witness.sk[i];if(!sk||!sk.a||i===0)return null;if(recGet()<witNeed(i))return 'The page is blank';if(i===6&&!(P&&P.tag)&&G.corrZi===W.zi)return 'Already corrected in this district';if(i===6&&!(P.lastLoss>0))return 'Nothing to correct';return null}
function witPay(n){if(recGet()<n)return 0;recSet(recGet()-n);return n}
function witImpact(e,d){if(!e||e.hp<=0||!(d>0))return;const prev=DT;DT='impact';const out=typed(e,d);dmgEnemy(e,out,false);DT=prev}
function witWrap(who,fn){const snd=who&&who.soundSwing;if(snd)who.soundSwing=0;const prev=DT;if(snd)DT='sound';const ph=P.partyHit;P.partyHit=1;try{fn(!!snd)}finally{P.partyHit=ph;DT=prev}}
function witMercHit(m,e,d){witWrap(m,snd=>{const out=snd?typed(e,d):d;dmgEnemy(e,out,false)})}
function witLends(a){return !!(a&&a.k==='minion'&&(a.hp===undefined||a.hp>0))}
function witTick(dt){if(!W)return;const castHold=P.witCast||P.castWait>0,fillHold=castHold||P.witHold||P.atk>0;P.witCast=0;P.witHold=0;
  for(const e of W.ents){if(e.onRecT>0)e.onRecT=Math.max(0,e.onRecT-dt);if(e.hp<=0||e.mp)continue;if(witSeen(e)){e.off=0;if(!castHold){e.watch=(e.watch||0)+dt;const slow=Math.max(.15,1+((S&&S.tes)||0)/100);e.acc=(e.acc||0)+dt*slow/WIT.stack;if(e.acc>=1){e.acc-=1;e.tes=Math.min(witCap(),(e.tes||0)+1)}}}else{e.off=(e.off||0)+dt;const grace=(S&&S.filed)||0;if(e.off>grace&&(e.tes||0)>0){e.dec=(e.dec||0)+dt*WIT.decay;if(e.dec>=1){e.dec-=1;e.tes=Math.max(0,(e.tes||0)-1)}}}}
  if(fillHold||!witHostile())return;let rate=WIT.fill;if(!P.moving)rate*=WIT.still;if(S.margin&&G.hp<S.maxHp*.5)rate*=S.margin;if(S.footnote)rate*=S.footnote;if(S.recFill)rate*=1+S.recFill/100;if(witBook())rate*=WIT.book;if(S.sp&&S.sp.carbon)rate*=WIT.carbon;recSet(recGet()+rate*dt)}
function hsSumFlock(o,cap){
  const same=W.allies.filter(a=>a.flock&&a.kind===o.kind&&!a.item);
  if(same.length>=cap)W.allies.splice(W.allies.indexOf(same[0]),1);
  W.allies.push(Object.assign({k:'minion',flock:1,x:P.x+rnd(-.55,.55),y:P.y+rnd(-.55,.55),cd:.2,ph:rnd(0,6),life:1e9,fx:1,r:.28,spd:4.2,foe:0},o))}
const SKF={
 scrapper:{
  0:(L,m)=>{W.fx.push({k:'arc',x:P.x,y:P.y,dx:P.dir.x,dy:P.dir.y,t:0,life:.22,w:1.5});for(const e of W.ents.slice()){const d=dist(e,P);if(d<2.4+e.r&&((e.x-P.x)*P.dir.x+(e.y-P.y)*P.dir.y)/(d||1)>-.15){hit(e,(1.3+.15*L)*m);if(Math.random()*100<15+2*L)e.stun=Math.max(e.stun,.5)}}smash(2.2)},
  1:(L,m)=>shoot(P.dir,(1.2+.2*L)*m,99,{big:1,col:'#b08a58'}),
  3:(L,m)=>{P.spin=.35;burst(P.x,P.y,2.5,(1.5+.22*L)*m,0,'#ff9a3c')},
  4:(L,m)=>dash(20,.25,(1.2+.3*L)*m,null,skvOf(G.cls,4).col),
  5:(L,m)=>{burst(P.x,P.y,4,0,1+.2*L,'#ffe36b');P.guard=8},
  6:(L,m)=>{P.buff=6+L;P.buffL=6+L},
  7:(L,m)=>{const t=nearest(7),mm=(2.2+.35*L)*m,end=()=>burst(P.x,P.y,3,mm,.6,'#ff5d4d');if(t){face(t);dash(26,Math.max(.06,(dist(t,P)-1)/26),0,end)}else end()},
  9:(L)=>{let x=P.x+P.dir.x*.7,y=P.y+P.dir.y*.7;if(!free(x,y,.2)){x=P.x;y=P.y}const pool=S.maxHp*(.28+.06*L);W.allies.push({k:'pail',x,y,life:1e9,hp:pool,max:pool,rate:.02+.004*L,r:.3})},
  12:(L,m)=>{for(const e of W.ents.slice()){if(dist(e,P)>4.2+e.r)continue;shove(e,(e.champ||e.su||isBoss(e.k))?-1.2:2.2);hit(e,(.55+.08*L)*m)}},
  13:()=>{P.two={n:3};float(P.x,P.y,'Two-handed','#d9822b',0)},
  14:(L)=>{P.lastShift=4+.3*L;float(P.x,P.y,'Last shift','#ffb238',0)}},
 hacker:{
  0:(L,m)=>{if(P.oc>0){m*=1.3;P.oc=0;float(P.x,P.y,'Primed','#59e0e6',0)}if(!chain(P,3+Math.floor(L/2),(1.2+.18*L)*m))W.fx.push({k:'bolt',x:P.x,y:P.y,x2:P.x+P.dir.x*3,y2:P.y+P.dir.y*3,t:0,life:.2})},
  1:(L,m)=>{P.oc=3;shoot(P.dir,(1.4+.2*L)*m,99,{spd:15,big:1})},
  3:(L,m)=>burst(P.x,P.y,3.4,(.9+.2*L)*m,1.5+.2*L,'#59e0e6'),
  4:(L,m)=>W.allies.push({k:'turret',x:P.x+P.dir.x*.8,y:P.y+P.dir.y*.8,life:10+2*L,m:(.5+.08*L)*m,cd:0}),
  6:(L,m)=>{const t=nearest(7);W.allies.push({k:'storm',x:t?t.x:P.x+P.dir.x*4,y:t?t.y:P.y+P.dir.y*4,life:4,m:(.7+.12*L)*m,cd:0})},
  7:(L,m)=>{for(let i=0;i<3;i++)W.allies.push({k:'minion',x:P.x+rnd(-.6,.6),y:P.y+rnd(-.6,.6),r:.2,life:15+L,m:(.4+.07*L)*m,cd:0,ph:rnd(0,6)})},
  9:(L,m)=>{const pts=[];for(let i=1;i<=6;i++){const x=P.x+P.dir.x*(4.5*i/6),y=P.y+P.dir.y*(4.5*i/6);if(walk(x,y))pts.push({x,y})}if(!pts.length){toast('No floor for the fault');return}P.castWait=.45;const mid=pts[pts.length>>1];W.allies.push({k:'fault',x:mid.x,y:mid.y,pts,life:3.2+.15*L,pulse:0,m:(.4+.06*L)*m,r:.75,dt:'heat'})},
  10:(L,m)=>{const t=nearest(8),x=t?t.x:P.x+P.dir.x*4,y=t?t.y:P.y+P.dir.y*4;W.allies.push({k:'pstorm',x,y,life:4.6,arm:1.6,pulse:0,m:(.5+.08*L)*m,r:2.2,dt:'noise'})},
  12:()=>{let bx=P.x,by=P.y,n=0;const ox=P.x,oy=P.y;for(let i=1;i<=8;i++){const x=P.x-P.dir.x*i*.5,y=P.y-P.dir.y*i*.5;if(!free(x,y,P.r))break;bx=x;by=y;n=i}if(!n){toast('Nowhere to step');return}parts(P.x,P.y,8,['#9a6cff','#fff'],2);P.x=bx;P.y=by;P.inv=Math.max(P.inv,.15);parts(P.x,P.y,8,['#9a6cff','#fff'],2);fxTrail(ox,oy,P.x,P.y,skvOf(G.cls,12).col,.45)},
  14:(L,m)=>{const t=nearest(8);if(!t){toast('No machine in reach');return}P.castWait=.75;face(t);const ty=G.schema||'surge';P.k9=ty;if(P.fm)P.fm.dt=ty;W.fx.push({k:'bolt',x:P.x,y:P.y,x2:t.x,y2:t.y,t:0,life:.25,col:DTY[ty].c});hit(t,(2.8+.4*L)*m)}},
 courier:{
  0:(L,m)=>{const n=3+Math.floor(L/2)+(S.sp.pod?2:0),a0=Math.atan2(P.dir.y,P.dir.x);for(let i=0;i<n;i++){const a=a0+(i-(n-1)/2)*.16;shoot({x:Math.cos(a),y:Math.sin(a)},(.9+.1*L)*m,S.sp.deadletter||Math.random()*100<S.pierce?99:0)}for(const e of W.ents.slice())if(dist(e,P)<2+e.r)hit(e,(.5+.06*L)*m)},
  1:(L,m)=>{dash(22,.24,0,null,skvOf(G.cls,1).col);P.haste=2+.3*L},
  3:(L,m)=>W.allies.push({k:'decoy',x:P.x,y:P.y,life:3,m:(2.5+.4*L)*m}),
  4:(L,m)=>W.allies.push({k:'trops',x:P.x,y:P.y,life:6,m:(.25+.05*L)*m,cd:0}),
  6:(L,m)=>{P.volley={t:1.5,cd:0,m:(.5+.07*L)*m}},
  7:(L,m)=>{const t=nearest(7);if(!t){toast('No target in reach');return}face(t);t.mark=8;hit(t,(3+.5*L)*m)},
  9:(L,m)=>shoot(P.dir,(1.1+.16*L)*m,99,{ret:1,life:.5,col:'#3fbf8f'}),
  11:()=>{if(!P.lastThrow){toast('You have not thrown anything');return}for(const a of W.allies)if(a.k==='drop')a.life=0;const x=P.x,y=P.y,t=P.lastThrow;W.allies.push({k:'drop',x,y,life:6,leash:4.5,r:.25});shoot({x:t.dx,y:t.dy},t.m,t.pierce,{from:{x,y},throw:1,dt:t.dt,col:t.col,life:t.life,spd:t.spd,ret:t.ret,split:t.split})},
  12:(L,m)=>shoot(P.dir,(1+.14*L)*m,99,{split:1,col:'#e6e2d6'}),
  14:(L)=>{const t=nearest(8);if(!t){toast('No machine to mark');return}face(t);for(const e of W.ents)e.mc=0;t.mc=4+.25*L;fxAim('mark',t.x,t.y);float(t.x,t.y,'Marked','#3fbf8f',0)}}
};
Object.assign(SKF,{
 maxi:{
  /* Tick Tock Next Block: nine swings and then a block. It arrives when it arrives. */
  0:(L,m)=>{const t=nearest(6);if(t)face(t);
    for(let i=0;i<9;i++)setTimeout(()=>{if(mode!=='play'||G.hp<=0)return;
      const o=nearest(2.6);if(!o)return;hit(o,(.5+.08*L)*m)},i*70);
    setTimeout(()=>{if(mode!=='play'||G.hp<=0)return;const o=nearest(2.8)||P;
      sfx('boom');float(o.x,o.y,'BLOCK','#f7931a',1);burst(o.x,o.y,2.4,(4+.8*L)*m,.4,'#f7931a')},660)},
  /* Have Fun Staying Poor: close range, cannot miss, and it stuns. */
  1:(L,m)=>{const t=nearest(2.6);
    W.fx.push({k:'arc',x:P.x,y:P.y,dx:P.dir.x,dy:P.dir.y,t:0,life:.22,w:1.6});
    if(!t){toast('Nothing close enough to tell');return}
    face(t);hit(t,(1.4+.25*L)*m);t.stun=Math.max(t.stun,1.2+.15*L);sfx('crit')},
  /* Orange Pill, and what survives has seen the chart. */
  5:(L,m)=>{const t=nearest(8),mm=(1.6+.3*L)*m;
    const end=()=>{for(const e of W.ents)if(dist(e,P)<2.2+e.r)e.mark=Math.max(e.mark,6+.3*L)};
    if(t){face(t);dash(24,Math.max(.08,(dist(t,P)-1)/24),mm,end,skvOf(G.cls,5).col)}else dash(24,.22,mm,end,skvOf(G.cls,5).col)},
  /* Blessed Hashrate, spiralling out, stopping for nobody. */
  6:(L,m)=>{const n=5;for(let i=0;i<n;i++){const a=(i/n)*6.283+P.ph*2;
    shoot({x:Math.cos(a),y:Math.sin(a)},(1.1+.22*L)*m,99,{spd:7,life:1.1,col:'#ffe36b',big:1})}},
  /* The three auras set the one that is on; the tick does the rest. */
  3:L=>maxiSet(3,L),
  4:L=>maxiSet(4,L),
  7:L=>maxiSet(7,L),
  9:(L)=>{const r=4.2;let n=0;for(const e of W.ents){if(e.mp||e.hp<=0||dist(e,P)>r+(e.r||0))continue;const floor=e.max*.35;if(e.hp<=floor)continue;const next=Math.max(floor,e.hp-e.hp*(.08+.012*L));float(e.x,e.y,'-'+Math.max(1,Math.round(e.hp-next)),'#f7931a',0);e.hp=next;e.snd=1;e.lt='sound';e.flash=.12;n++}if(!n)toast('Nothing above the floor')},
  11:(L,m)=>{if(!P.aura){toast('No aura is on');return}const i=P.aura.i;if(i===3)P.cite={n:6,cd:0,gap:.14,m:(.35+.04*L)*m};else if(i===4)P.cite={n:3,cd:0,gap:.55,m:(.9+.12*L)*m};else P.cite={n:6,cd:0,gap:.5,m:(.22+.04*L)*m}},
  13:()=>{P.dip=1}},
 anon:{
  0:(L,m)=>W.allies.push({k:'decoy',x:P.x,y:P.y,life:3,m:(2.2+.35*L)*m,stun:.8}),
  1:(L,m)=>{const t=nearest(8),ox=P.x,oy=P.y;parts(P.x,P.y,10,['#3f3f4c','#e6e2d6'],2);if(t){const d=dist(t,P)||1,nx=t.x+(t.x-P.x)/d*.9,ny=t.y+(t.y-P.y)/d*.9;if(free(nx,ny,P.r)){P.x=nx;P.y=ny}else{P.x=t.x-(t.x-P.x)/d*.8;P.y=t.y-(t.y-P.y)/d*.8}face(t);P.inv=Math.max(P.inv,.4);P.ambM=Math.max(1,S.critM);P.ambT=.05;hit(t,(1.6+.25*L)*m);P.swing=.18}
    else for(let i=0;i<8;i++){if(free(P.x+P.dir.x*.5,P.y+P.dir.y*.5,P.r)){P.x+=P.dir.x*.5;P.y+=P.dir.y*.5}}if(ox!==P.x||oy!==P.y)fxTrail(ox,oy,P.x,P.y,skvOf(G.cls,1).col,.4)},
  3:(L,m)=>{const ms=W.allies.filter(a=>a.k==='mine');if(ms.length>=4)W.allies.splice(W.allies.indexOf(ms[0]),1);const fast=P.stealth>0&&sl(11)&&!boonOn(11);W.allies.push({k:'mine',x:P.x,y:P.y,life:12,arm:fast?0.22:0.6,m:(3+.5*L)*m,r:2.4})},
  4:(L,m)=>{P.stealth=3+.3*L;P.haste=P.stealth;parts(P.x,P.y,14,['#3f3f4c','#888'],2)},
  5:(L,m)=>{const t=nearest(8);if(!t){toast('No target in reach');return}face(t);fxAim('patch',t.x,t.y,3);for(const e of W.ents)if(dist(e,t)<3)e.mark=8+L;hit(t,(1+.2*L)*m)},
  6:(L,m)=>{const t=nearest(7),c=t?{x:t.x,y:t.y}:{x:P.x+P.dir.x*4,y:P.y+P.dir.y*4};burst(c.x,c.y,2.2,(1.4+.2*L)*m,0,'#ff9a3c');for(let i=0;i<5;i++)W.allies.push({k:'blast',x:c.x+rnd(-2.6,2.6),y:c.y+rnd(-2.6,2.6),life:.2+i*.15,m:(1.2+.2*L)*m,r:1.7})},
  7:(L,m)=>{for(let i=0;i<(L>=5?2:1);i++)W.allies.push({k:'minion',kind:'clone',x:P.x+rnd(-.8,.8),y:P.y+rnd(-.8,.8),life:10+L,m:(.5+.08*L)*m,cd:0,ivl:.45,ph:rnd(0,6),hp:S.maxHp*.6,max:S.maxHp*.6,taunt:1,r:.3,fx:1})},
  8:(L,m)=>W.allies.push({k:'raid',x:P.x,y:P.y,life:1.6,cd:0,m:(1.2+.2*L)*m}),
  9:(L,m)=>{const t=nearest(3.2);if(t){face(t);hit(t,(.7+.1*L)*m)}W.fx.push({k:'arc',x:P.x,y:P.y,dx:P.dir.x,dy:P.dir.y,t:0,life:.16,w:1});if(P.reh>0&&P.rehT>0)P.reh=Math.min(3,P.reh+1);else P.reh=1;P.rehT=3},
  10:(L,m)=>{const n=P.reh||0;if(!n){toast('You have nothing rehearsed');return}P.reh=0;P.rehT=0;anonDump(n,L,m)},
  12:()=>{const mark=W.allies.find(a=>a.k==='ddrop'&&a.life>0);if(mark){if(free(mark.x,mark.y,P.r)){parts(P.x,P.y,8,['#3f3f4c','#fff'],2);P.x=mark.x;P.y=mark.y;parts(P.x,P.y,8,['#3f3f4c','#fff'],2)}mark.life=0;return}W.allies.push({k:'ddrop',x:P.x,y:P.y,life:1e9,r:.2})},
  14:(L)=>{const ms=W.allies.filter(a=>a.k==='mine'||(a.k==='minion'&&a.kind==='clone'));if(!ms.length){toast('You have nothing to disown');return}for(const a of ms){a.hush=1;for(const e of W.ents)if(dist(e,a)<3.2)e.quiet=Math.max(e.quiet||0,2+.15*L);a.life=0}P.stealth=3+.2*L;P.haste=P.stealth;parts(P.x,P.y,14,['#3f3f4c','#888'],2)}},
 founder:{
  0:(L,m)=>summon({kind:'intern',per:1,m:(.35+.05*L)*m*(S.sp.check?1.25:1),ivl:.7},Math.min(7,2+Math.floor(L/2))+(S.sp.check?2:0)),
  1:(L,m)=>{const t=nearest(7),c=t||{x:P.x+P.dir.x*3,y:P.y+P.dir.y*3};fxAim('patch',c.x,c.y,3);for(const e of W.ents.slice())if(dist(e,c)<3+e.r){e.stun=Math.max(e.stun,2+.3*L);hit(e,(.8+.15*L)*m)}},
  3:(L,m)=>summon({kind:'drone',per:1,m:(.45+.07*L)*m,ivl:.8,rng:5.5},1+Math.floor(L/3)),
  4:(L,m)=>{P.crunch=8+L},
  5:(L,m)=>{P.mech=10+L;heal(S.maxHp*.3);parts(P.x,P.y,16,['#e0bd6e','#fff'],2,1.4)},
  6:(L,m)=>{const hp=S.maxHp*(1.5+.2*L);summon({kind:'golem',per:1,m:(1.2+.2*L)*m,ivl:1.1,aoe:1,hp,max:hp,taunt:1,r:.5,armM:.6,spd:4},1)},
  7:(L,m)=>{let t=null,bd=7;for(const e of W.ents){if(isBoss(e.k)||e.su||(e.champ&&L<5))continue;const d=dist(e,P);if(d<bd){bd=d;t=e}}if(!t){toast('Nothing here will take the offer');return}
    W.ents.splice(W.ents.indexOf(t),1);t.stun=0;t.flash=0;fxAim('mark',t.x,t.y);W.allies.push({k:'minion',kind:'conv',e:t,x:t.x,y:t.y,life:12+2*L,raw:t.dmg*2*(1+.1*L),ivl:.8,rng:ET[t.k].ranged?4.5:1.1,cd:0,ph:0,hp:t.hp,max:t.max,r:t.r,taunt:1,fx:1})},
  8:(L,m)=>{const ws=W.allies.filter(a=>a.per);if(!ws.length){toast('You have no workforce to lay off');return}for(const a of ws){W.allies.splice(W.allies.indexOf(a),1);burst(a.x,a.y,2.4,(2+.4*L)*m,0,'#ff5d4d');heal(S.maxHp*.05)}},
  9:(L,m)=>{const g=P.grave;if(!g||g.t<=0||!g.src||g.src.hp<=0||W.ents.indexOf(g.src)<0){toast('You have nobody to put on leave');return}const e=g.src;e.noheal=4+.3*L;e.leave={dps:(.4+.06*L)*m,t:4+.3*L,c:0};P.grave=null;fxAim('mark',e.x,e.y)},
  10:(L)=>{const t=nearest(7);if(!t){toast('Nobody to bind');return}face(t);for(const e of W.ents)e.nc=0;t.nc=5+.3*L},
  12:(L,m)=>{const bag=G.bag||[],ix=bag.findIndex(it=>it&&it.slot==='weapon');let dt='impact',weak=.55,fed=null;if(ix>=0){fed=bag.splice(ix,1)[0];dt=fed.dt||'impact';weak=1}summon({kind:'officer',per:1,m:(.9+.12*L)*m*weak,ivl:.7,hp:S.maxHp*(1.1+.1*L),max:S.maxHp*(1.1+.1*L),taunt:1,r:.42,holdDt:1,dt},1);toast(fed?'The officer takes '+(fed.name||fed.base||'the weapon'):'The officer is empty-handed')},
  14:(L,m)=>founderLiq(L,m)},
 homesteader:{
  0:(L,m)=>{if(hsHands())return;hsPlacePlot(P.x+P.dir.x*1.2,P.y+P.dir.y*1.2,{life:HS.plotLife,r:HS.plotR,m:(.22+.04*L)*m})},
  1:()=>{if(hsForm()==='hound'){hsShed();return}if(hsForm()==='hull'){toast('The hull does not become a hound');return}hsDropPlots();hsSetForm('hound',null);parts(P.x,P.y,10,['#6a8f62','#3d5438'],2,1.2)},
  2:(L,m)=>{if(hsHands())return;hsSumFlock({kind:'stray',m:(.32+.05*L)*m,ivl:.65,rng:1.15,bite:6+L,dt:'rust'},Math.min(HS.strayCap,2+Math.floor(L/3)))},
  3:(L)=>{if(hsHands())return;const cs=(P.corpses||[]).filter(c=>c.t>0&&Math.hypot(c.x-P.x,c.y-P.y)<3);if(!cs.length){toast('Nothing here to compost');return}
    let b=cs[0],bd=99;for(const c of cs){const d=Math.hypot(c.x-P.x,c.y-P.y);if(d<bd){bd=d;b=c}}b.t=0;P.corpses=P.corpses.filter(c=>c.t>0);P.compost=1.35+.05*L;toast('The next plot takes the body')},
  4:()=>{if(hsForm()==='hull'){hsShed();return}hsDropPlots();hsSetForm('hull',null);parts(P.x,P.y,12,['#4e6a48','#2a2418'],2,1.3)},
  5:(L,m)=>{if(hsHands())return;hsSumFlock({kind:'bull',m:(.9+.12*L)*m,ivl:.9,rng:1.35,bite:10+2*L,r:.46,spd:3.4,dt:'heat'},1)},
  6:()=>{if(hsHands())return;const mul=P.compost||1;P.compost=0;const life=hsDur(HS.hedgeLife)*(mul>1?mul:1);const dx=P.dir.x,dy=P.dir.y,len=Math.hypot(dx,dy)||1,ux=dx/len,uy=dy/len,px=-uy,py=ux;
    for(let i=-2;i<=2;i++)W.allies.push({k:'hedge',plot:1,x:P.x+ux*1.2+px*i*.72,y:P.y+uy*1.2+py*i*.72,life,r:.42})},
  7:()=>{hsShed()},
  9:(L,m)=>{if(hsHands())return;hsPlacePlot(P.x,P.y,{life:HS.frostLife,r:HS.frostR,m:(.35+.06*L)*m})},
  10:()=>{let t=null,bd=3.2;for(const e of W.ents){if(e.mp||e.hp<=0)continue;const d=dist(e,P);if(d<bd){bd=d;t=e}}
    if(!t){toast('No machine in reach');return}if(t.champ||t.su||isBoss(t.k)){toast('That one is too much machine to wear');return}
    const dt=foeType(t);W.ents.splice(W.ents.indexOf(t),1);parts(t.x,t.y,12,['#6a8f62','#5a6078'],2.2,1.3);hsDropPlots();hsDropFlock();hsSetForm('worn',dt);if(P.fm)P.fm.dt=dt},
  12:(L,m)=>{if(hsHands())return;const ps=W.allies.filter(a=>a.plot&&a.life>0);if(!ps.length){toast('You have no plots to salt');return}
    const mul=(P.compost||1)*(G.doc==='fallow'?HS.fallowPlot:1);P.compost=0;DT='rust';
    for(const a of ps)burst(a.x,a.y,Math.max(1.6,a.r||1.6),(.8+.12*L)*m*mul,0,'#c9803a');DT=null;hsDropPlots()},
  14:(L,m)=>{if(hsForm()){toast('You cannot spend the flock from inside a chassis');return}const fs=W.allies.filter(a=>a.flock);if(!fs.length){toast('You have no flock to spend');return}
    for(const a of fs){hsPlacePlot(a.x,a.y,{life:HS.plotLife*.8,r:1.8,m:(.28+.05*L)*m});const i=W.allies.indexOf(a);if(i>=0)W.allies.splice(i,1)}}},
 witness:{
  0:()=>{const t=nearest(8);if(!t){toast('Nothing in view');return}const n=(S.sp&&S.sp.press)?WIT.pressStack:1;t.tes=Math.min(witCap(),(t.tes||0)+n);face(t);float(t.x,t.y,'Look','#e6dcc8',0);fxAim('mark',t.x,t.y)},
  1:(L)=>{if(recGet()<witNeed(1)){witBlank();return}const t=nearest(7);if(!t){toast('Nobody to sentence');return}const cap=Math.max(1,Math.ceil(WIT.sentMax*(1+((S&&S.recCost)||0)/100))),spend=Math.min(recGet(),cap);if(!witPay(spend)){witBlank();return}const delay=(.4+.08*L)*(spend/WIT.sentMax);t.cd=(t.cd||0)+delay;t.wind=(t.wind||0)+delay*.5;face(t);float(t.x,t.y,'Sentenced','#e6dcc8',0)},
  3:(L)=>{if(recGet()<witNeed(3)){witBlank();return}const src=nearest(8);if(!src){toast('Nothing in view');return}if(!(src.lastAtk>0)){toast('They have not swung');return}let dst=null,best=-1,bd=99;for(const e of W.ents){if(e===src||e.hp<=0||e.mp||!(e.tes>0))continue;const d=dist(e,P);if(e.tes>best||(e.tes===best&&d<bd)){best=e.tes;dst=e;bd=d}}if(!dst){toast('Nothing else is on the record');return}if(!witPay(witNeed(3))){witBlank();return}face(dst);witImpact(dst,src.lastAtk*(.75+.05*L))},
  4:(L)=>{if(recGet()<witNeed(4)){witBlank();return}const t=nearest(6);if(!t){toast('Nothing in view');return}const spend=Math.max(1,Math.ceil(recGet()*WIT.thread));if(!witPay(spend)){witBlank();return}const d=(t.tes||0)*(3.5+.45*L)*(1+(G.lvl||1)*.012);face(t);if(!(d>0)){float(t.x,t.y,'the page is blank','#e6dcc8',0);return}witImpact(t,d)},
  6:()=>{if(!(P&&P.tag)&&G.corrZi===W.zi){toast('Already corrected in this district');return}if(recGet()<1){witBlank();return}const loss=P.lastLoss||0;if(!(loss>0)){toast('Nothing to correct');return}recSet(0);let h=loss;if(S.retr)h*=1+S.retr/100;if(P&&P.tag)P.hp=Math.min(P.max||P.hp,(P.hp||0)+h);else{heal(h);G.corrZi=W.zi}float(P.x,P.y,'Corrected','#7be495',0)},
  7:()=>{if(recGet()<witNeed(7)){witBlank();return}if(!witPay(witNeed(7))){witBlank();return}P.redact=2;float(P.x,P.y,'Redacted','#e6dcc8',0)},
  9:(L)=>{if(recGet()<witNeed(9)){witBlank();return}let best=null,bt=-1;for(const e of W.ents){if(e.hp<=0||e.mp)continue;if((e.tes||0)>bt){bt=e.tes||0;best=e}}if(!best||bt<WIT.high){toast('The testimony is too thin');return}if(!witPay(witNeed(9))){witBlank();return}best.onRecT=WIT.onRec;best.onRecM=1+.12*L;float(best.x,best.y,'On the record','#e6dcc8',0);fxAim('mark',best.x,best.y)},
  10:()=>{if(recGet()<witNeed(10)){witBlank();return}const cands=[];if(W.merc&&W.merc.hp>0)cands.push(W.merc);if(W.tag&&W.tag.hp>0&&!(P&&P.tag))cands.push(W.tag);for(const a of W.allies)if(witLends(a))cands.push(a);let who=null,bd=12;for(const a of cands){const d=dist(a,P);if(d<bd){bd=d;who=a}}if(!who){toast('Nobody to attribute');return}if(!witPay(witNeed(10))){witBlank();return}who.soundSwing=1;float(who.x,who.y,'Unnamed','#f7931a',0)},
  12:(L)=>{if(recGet()<1){witBlank();return}const ons=W.ents.filter(e=>e.hp>0&&!e.mp&&witSeen(e)&&(e.tes||0)>0);if(!ons.length){toast('Nothing on the page');return}recSet(0);for(const e of ons){witImpact(e,(e.watch||0)*(1.6+.25*L)*(1+(G.lvl||1)*.01));e.tes=0;e.watch=0;e.acc=0}}}
});
function cast(slot){const i=G.slots[slot];if(mode!=='play'||i<0||i===undefined)return;const s=CLS[G.cls].sk[i],L=sl(i);const worn=G.cls==='homesteader'?hsWearing():null;const leaving=!!worn&&(i===7||(i===1&&worn==='hound')||(i===4&&worn==='hull'));if(!leaving&&P.castWait>0){toast('Still casting');sfx('err');return}if(!L||!s.a||(!leaving&&(P.cd[i]>0||P.dash)))return;if(!leaving&&P.silence>0){toast('Silenced');sfx('err');return}
  if(G.cls==='homesteader'&&!leaving){const why=hsBlocked(i);if(why){toast(why);sfx('err');return}}
  if(G.cls==='witness'){const why=witBlock(i);if(why){toast(why);if(why==='The page is blank')float(P.x,P.y,'the page is blank','#e6dcc8',0);sfx('err');return}}
  const fk=forkOf(i);let cost=s.cost*(S.sp.hoodie?.75:1)*(fk.cost||1);if(P.freeThrow&&G.cls==='courier'&&(i===0||i===6||i===9||i===12)){cost=0;P.freeThrow=0}if(G.en<cost){if(leaving)cost=0;else{toast('Not enough energy');sfx('err');return}}
  const t=nearest(6.5);if(t)face(t);G.en-=cost;P.cd[i]=s.cd*(1-Math.min(.6,S.cdr))*(fk.cd||1)*(G.sk[i]>=10?.8:1);skvPlay(G.cls,i,P.x,P.y,P.dir);mpNoteCast(i);if(!(G.cls==='anon'&&i===3&&P.stealth>0&&sl(11)&&!boonOn(11)))unstealth();sfx(SKS[G.cls][i]||'cast');if(G.cls==='witness'){P.witHold=1;P.witCast=1}P.fm={m:fk.dm||1,t:(G.fork||{})[i]==='refund'?2:1.2,k:(G.fork||{})[i],dt:skType(G.cls,i)};forkCast((G.fork||{})[i]);const na=W.allies.length;SKF[G.cls][i](L,syn(i));for(let k=na;k<W.allies.length;k++)if(!W.allies[k].holdDt)W.allies[k].dt=skType(G.cls,i);for(const a of W.allies)if(a.per&&!a.dt)a.dt=skType(G.cls,i);forkAfter(i,L)}
function stim(){if(mode!=='play')return;if(W.sub&&W.sub.mods.includes('dry')){toast('Stims do not work in these proceedings');sfx('err');return}if(G.stims<1){toast('No stims. Brenda sells them.');return}if(G.hp>=S.maxHp&&!(S.sp.repair&&G.en<S.maxEn))return;G.stims--;heal(S.maxHp*.45);if(S.sp.repair)G.en=S.maxEn;sfx('stim');float(P.x,P.y,'+stim','#7be495');parts(P.x,P.y,10,['#7be495','#fff'],1.5,1.5)}

/* ================= interaction ================= */
function useObj(o){
  if(o.k==='chest'){o.used=1;sfx('chest');if(Math.random()<.3)addDrop({sat:ri(2,5)},o.x,o.y);if(Math.random()<.2)addDrop({word:pick(WK)},o.x,o.y);parts(o.x,o.y,14,['#c9a868','#ffe36b'],2.5);dropFrom('chest',o.x,o.y,W.ml)}
  else if(o.k==='shrine'){o.used=1;sfx('shrine');const s=SHR[o.sk];toast(s[0]+': '+s[1]);parts(o.x,o.y,24,['#59e0e6','#fff'],2,1.6);
    if(o.sk==='fill'){G.hp=S.maxHp;G.en=S.maxEn}else if(o.sk==='gold'){for(let i=0;i<7;i++)addDrop({cr:(3+W.ml*2)*rnd(1,2.5)*Math.pow(G.cpi,.9)},o.x,o.y)}else P.shr={k:o.sk,t:s[2],n:s[0]}}
  else if(o.k==='memo'){W.objs.splice(W.objs.indexOf(o),1);if(!G.memos.includes(o.id))G.memos.push(o.id);sfx('page');const m=MEMOS[o.id];dlg(m[0],m[1],[['Keep it']]);gainXp(20*(1+.8*(W.ml-1)))}
  /* The stranger's line prints whole credits, so the gift is the floor of fifteen percent. */
  else if(o.k==='stray'){W.objs.splice(W.objs.indexOf(o),1);let gave;if(G.stims>0){G.stims--;gave='a stim'}else{const c=Math.floor(G.credits*.15);G.credits-=c;gave=fmt(c)}G.unseen=(G.unseen||0)+1;
    dlg('A stranger',pick(['A Resident with her visor in her hand, shaking. ','An old man who took his visor off this morning and cannot find his street. ','A boy, no visor, hiding from the drones. '])+'You give up '+gave+' and point the way to Stillwater. No name is asked. Nobody saw.',[['Walk on']])}
  else if(o.k==='page'){o.used=1;G.q8page=1;sfx('page');if(G.q8down){G.q.q8=2;mpShareQuest('q8',2);sfx('quest');toast('Quest complete: return to Marrow')}else toast('Lethe is still drowning the rest. Follow the arrow.')}else if(o.k==='minute'){o.used=1;G.q.q12=2;mpShareQuest('q12',2);sfx('page');sfx('quest');toast('Quest complete: return to Marrow')}else if(o.k==='qobj')sqUse(o);
  else if(o.k==='cage'){if(W.ents.some(e=>e.su)){toast('The cage is sealed while Defrag stands');return}o.used=1;G.marrow=true;G.q.q3=2;sfx('cage');sfx('quest');
    playScene(RESCUE,()=>{mode='play';toast('Quest complete: return to Gramps')})}}
function portalLabel(p){const zi=W.zi;return p.kind==='home'?'Return to '+ZONES[HT()].n:p.kind==='exit'?'Walk out to '+ZONES[FIRST[W.z.act||1]].n:p.kind==='town'||p.kind==='prev'?'Walk back to '+ZONES[zi===FIRST[actOf(zi)]?townOf(zi):zi-1].n:p.kind==='next'?'Go on to '+ZONES[zi+1].n:'Portal to '+ZONES[G.portal.zi].n}
function usePortal(p){if(mpPortalBlocked())return;const zi=W.zi;sfx(p.kind==='home'||p.kind==='back'?'portal':'ui');
  if(p.kind==='exit'){const f=FIRST[W.z.act||1];G.unlocked=Math.max(G.unlocked,f);enter(f)}
  else if(p.kind==='town'||p.kind==='prev'){if(zi===FIRST[actOf(zi)])enter(townOf(zi),{from:'exit'});else enter(zi-1,{from:'next'})}
  else if(p.kind==='home')enter(HT());
  else if(p.kind==='next'){G.unlocked=Math.max(G.unlocked,zi+1);enter(zi+1)}
  else if(p.kind==='back'){const t=G.portal;G.portal=null;enter(t.zi,{at:t})}}
function findAct(){for(const o of W.objs)if(o.k==='qobj'&&!o.used&&Math.hypot(o.x-P.x,o.y-P.y)<1.9){const st=sqStep(o.q);if(st)return{label:st.label,fn:()=>sqUse(o)}}
  let best=null,bd=1.8;const chk=(x,y,label,fn)=>{const d=Math.hypot(x-P.x,y-P.y);if(d<bd){bd=d;best={label,fn}}};
  for(const p of W.portals)chk(p.x,p.y,portalLabel(p),()=>usePortal(p));
  for(const d of W.drops)if(d.it&&skipPick(d.it))chk(d.x,d.y,'Pick up '+(d.it.id?d.it.name:d.it.base),()=>{d.force=1});
  if(W.z.town){if(G.portal&&!W.z.pre)chk(12.5,11.5,portalLabel({kind:'back'}),()=>usePortal({kind:'back'}));
    const rs=resStep();if(rs)for(const n of W.npcs)if(n.id==='res'&&!n.got)chk(n.x,n.y,rs.label,()=>sqRes(n));
    if(!rs)for(const n of W.npcs)if(n.id==='res')chk(n.x,n.y,'Talk to a Resident',()=>convo('res'));
    for(const n of W.npcs)if(n.id!=='res')chk(n.x,n.y,n.id==='gate'?'Use the Transit Gate':n.id==='vr'?'Use the VR rig':n.id==='board'?'Read the bounty board':n.id==='stash'?'Open your lockbox':n.id==='ubi'?'Collect the Stipend':n.act||'Talk to '+n.name,()=>talkTo(n.id))}
  for(const o of W.objs){if(o.used)continue;if(o.k==='chest')chk(o.x,o.y,'Open lockbox',()=>useObj(o));else if(o.k==='shrine')chk(o.x,o.y,SHR[o.sk][0],()=>useObj(o));else if(o.k==='memo')chk(o.x,o.y,'Read the memo',()=>useObj(o));else if(o.k==='cage')chk(o.x,o.y,'Open the cage',()=>useObj(o));else if(o.k==='page')chk(o.x,o.y,'Read the letter',()=>useObj(o));else if(o.k==='minute')chk(o.x,o.y,'Strike the minutes',()=>useObj(o));else if(o.k==='stray')chk(o.x,o.y,'Help the stranger',()=>useObj(o));else if(o.k==='qobj'){const st=sqStep(o.q);if(st)chk(o.x,o.y,st.label,()=>sqUse(o))}else if(o.k==='dnode'&&!G.nodes[W.zi])chk(o.x,o.y,'Bring this node online (5 sats)',()=>lightNode(o));else if(o.k==='leg')chk(o.x,o.y,'Pick up the servo leg',()=>legTake(o));else if(o.k==='pow'&&!W.pow)chk(o.x,o.y,'Begin proof of work (hold 60 seconds)',()=>powStart(o))}
  return best}

/* ================= update ================= */
function update(dt){
  mpTick(dt);maxiAura(dt);
  G.time+=dt;const gr=G.adopt>=100?1:Math.pow(SEA.k==='stim'?1.005:1.0025,dt*(1.45-G.adopt/100)*(G.fate==='fail'?1.4:1));G.cpi*=gr;if(S.sp.hedge)G.credits*=gr;G.ubiT=Math.max(0,G.ubiT-dt);G.chuteT=Math.max(0,G.chuteT-dt);
  const c=CLS[G.cls];
  for(const k of['atk','swing','flash','inv','slow','buff','haste','guard','warn','movedT','spin','stealth','ambT','mech','crunch','streakT','silence','oc'])P[k]=Math.max(0,P[k]-dt);
  for(let i=0;i<15;i++)P.cd[i]=Math.max(0,P.cd[i]-dt);
  if(P.shr){P.shr.t-=dt;if(P.shr.t<=0)P.shr=null}
  G.en=Math.min(S.maxEn,G.en+(4+S.regen+G.at.bnd*.05)*dt);heal((S.regenH+(S.sp.pension?S.maxHp*.02:0)+(W.z.town?S.maxHp*.3:0))*dt);
  shake=Math.max(0,shake-dt*20);if(G.clockT>0)G.clockT-=dt;if(G.stillT>0)G.stillT-=dt;if(G.guardT>0)G.guardT-=dt;if(G.retractT>0)G.retractT-=dt;if(P.redact>0)P.redact=Math.max(0,P.redact-dt);
  skillTick(dt);
  let sx=J.x,sy=J.y;
  if(keys.KeyA||keys.ArrowLeft)sx-=1;if(keys.KeyD||keys.ArrowRight)sx+=1;if(keys.KeyW||keys.ArrowUp)sy-=1;if(keys.KeyS||keys.ArrowDown)sy+=1;
  const mag=Math.min(1,Math.hypot(sx,sy));let wx=sx+2*sy,wy=2*sy-sx;const wl=Math.hypot(wx,wy);
  P.moving=false;
  if(P.dash){const d=P.dash;d.t-=dt;mv(P,P.dir.x*d.spd*dt,P.dir.y*d.spd*dt);P.moving=true;
    if(d.m)for(const e of W.ents.slice())if(!d.hit.includes(e)&&dist(e,P)<1.1+e.r){d.hit.push(e);hit(e,d.m)}
    if(Math.random()<.6)W.parts.push({x:P.x,y:P.y,z:14,vx:0,vy:0,vz:0,t:0,life:.25,col:c.col,s:5});
    if(d.trail){d.tr-=dt;if(d.tr<=0){d.tr=.08;if(d.lx!==P.x||d.ly!==P.y)fxTrail(d.lx,d.ly,P.x,P.y,d.trail,.36);d.lx=P.x;d.ly=P.y}}
    if(d.t<=0){P.dash=null;if(G.cls==='courier'&&sl(10)&&!boonOn(10))P.route=2+.2*sl(10);if(d.end)d.end()}}
  else if(mag>.15){wx/=wl;wy/=wl;P.dir={x:wx,y:wy};const sp=c.spd*(1+S.mspd/100)*(P.slow>0?.55:1)*(P.haste>0?1.5:1)*mag*dt;mv(P,wx*sp,wy*sp);P.moving=true;P.movedT=.4;P.walkPh+=dt*11}
  if(P.volley){const v=P.volley;v.t-=dt;v.cd-=dt;if(v.cd<=0){v.cd=.09;sfx('throw');const t=nearest(7);if(t)face(t);const a=Math.atan2(P.dir.y,P.dir.x)+rnd(-.1,.1);shoot({x:Math.cos(a),y:Math.sin(a)},v.m,Math.random()*100<S.pierce?99:0);P.swing=.1}if(v.t<=0)P.volley=null}
  else if(atkHeld||keys.Space||keys.KeyJ||(OPT.auto&&P.atk<=0&&nearest((CLS[G.cls].melee||hsMelee())?1.9:6)))attack();
  // enemies
  for(const e of W.ents.slice()){
    if(e.mp){e.flash=Math.max(0,e.flash-dt);continue}
    e.flash=Math.max(0,e.flash-dt);e.ph+=dt;e.mark=Math.max(0,e.mark-dt);if(e.mc>0)e.mc-=dt;if(e.quiet>0)e.quiet-=dt;e.slow=Math.max(0,e.slow-dt);e.ward=Math.max(0,(e.ward||0)-dt);if(e.k==='aegis')for(const o of W.ents)if(o!==e&&o.k!=='aegis'&&dist(o,e)<4)o.ward=.4;e.arcCd=Math.max(0,e.arcCd-dt);
    if(e.stun>0){e.stun-=dt;continue}
    let T=P;if(!(e.nc>0)){for(const a of W.allies)if(a.k==='decoy'&&dist(a,e)<7)T=a;
    if(T===P){const tk=tank(e);if(tk)T=tk;else if(P.stealth>0)continue}}
    const dx=T.x-e.x,dy=T.y-e.y,d=Math.hypot(dx,dy)||1,t=ET[e.k];
    if(!e.aggro){if(d<t.sight)wake(e);else continue}
    if(d>18)continue;
    e.cd-=dt;const sp=e.spd*(e.slow>0?.5:1)*dt;e.fx=dx-dy>0?1:-1;
    if(t.flee){e.life=(e.life||14)-dt;e.fx=dx>0?-1:1;if(!mv(e,-dx/d*sp,-dy/d*sp))mv(e,dy/d*sp,-dx/d*sp);if(Math.random()<dt*1.5)W.drops.push({x:e.x,y:e.y,t:.2,cr:(3+W.ml*2)*Math.pow(G.cpi,.9)});if(e.life<=0){W.ents.splice(W.ents.indexOf(e),1);parts(e.x,e.y,10,['#e0bd6e','#fff'],3);toast('The Dividend Drone got away with the payout')}continue}
    if(isBoss(e.k))bossAI(e,dt,d);
    if(e.k==='director'){e.sumT=(e.sumT||4)-dt;if(e.sumT<=0&&W.ents.length<45){e.sumT=7;sfx('summon');for(let i=0;i<2;i++){const c=spawn('tick',e.x+rnd(-1,1),e.y+rnd(-1,1),{minion:1});if(c)c.aggro=true}}}
    if(e.k==='proxy'&&T===P&&d>3&&d<9&&e.cd<=0){const a=rnd(0,6.283),x=P.x+Math.cos(a)*1.2,y=P.y+Math.sin(a)*1.2;if(free(x,y,e.r)){parts(e.x,e.y,8,['#d8d8e0','#fff'],2);e.x=x;e.y=y;parts(x,y,8,['#d8d8e0','#fff'],2);e.cd=3.2;e.wind=.45;sfx('dash');continue}}
    if(e.lunge){e.lunge.t-=dt;mv(e,e.lunge.x*12*dt,e.lunge.y*12*dt);if(!e.lunge.hit&&dist(e,P)<.8&&T===P){e.lunge.hit=1;hurt(e.dmg*1.3,false,e)}if(e.lunge.t<=0)e.lunge=null;continue}
    if(e.wind>0){e.wind-=dt;if(e.wind<=0&&d<t.range+e.r+.5){if(T===P)hurt(e.dmg,false,e);else if(T.hp!==undefined)hurtAlly(T,e.dmg,e)}continue}
    if(e.k==='hr'&&!S.sp.lines){e.healCd-=dt;if(e.healCd<=0){e.healCd=4.5;let b=null,br=.95;for(const o of W.ents)if(o!==e&&!(o.noheal>0)&&!isBoss(o.k)&&dist(o,e)<5&&o.hp/o.max<br){br=o.hp/o.max;b=o}if(b){sfx('mend');b.hp=Math.min(b.max,b.hp+b.max*.25);W.fx.push({k:'bolt',x:e.x,y:e.y,x2:b.x,y2:b.y,t:0,life:.4,col:'#7be495'});float(b.x,b.y,'mended','#7be495')}}}
    if(e.k==='tick'){if(d<.9&&(T===P||T.hp!==undefined)){W.ents.splice(W.ents.indexOf(e),1);W.fx.push({k:'ring',x:e.x,y:e.y,r:1.4,t:0,life:.3,col:'#ff9a3c'});parts(e.x,e.y,10,['#ff9a3c','#ffe36b','#333'],3);sfx('boom');if(T===P)hurt(e.dmg*1.5,false,null);else hurtAlly(T,e.dmg*1.5,e);G.kills++;gainXp(t.xp*(1+.8*(W.ml-1))*.5);continue}mv(e,dx/d*sp,dy/d*sp);continue}
    if((e.k==='hound'||e.k==='lancer')&&T===P&&d>2&&d<(e.k==='lancer'?6.5:5)&&e.cd<=0){e.cd=2.4;e.lunge={t:e.k==='lancer'?.52:.38,x:dx/d,y:dy/d,hit:0};sfx('growl');continue}
    if(t.ranged){if(d>t.range)mv(e,dx/d*sp,dy/d*sp);else if(d<t.range*.45)mv(e,-dx/d*sp,-dy/d*sp);
      if(!(e.quiet>0)&&d<=t.range+.8&&e.cd<=0){e.cd=t.atk*(e.mods.fast?.7:1);sfx('eshoot');W.projs.push({x:e.x,y:e.y,vx:dx/d*5.5,vy:dy/d*5.5,life:1.6,foe:true,dmg:e.dmg,slow:t.slow,drain:t.drain,sil:t.sil,src:e,col:t.sil?'#e6e2d6':t.drain?'#b48cff':t.slow?'#7be495':e.k==='aegis'?'#9fd0ff':'#ff5d9a'})}}
    else{if(d>t.range*.75+e.r)mv(e,dx/d*sp,dy/d*sp);if(!(e.quiet>0)&&d<=t.range+e.r&&e.cd<=0){e.cd=t.atk*(e.mods.fast?.7:1);e.wind=e.k==='mech'?(defragAct1(e)?.72:.45):.3}}
  }
  for(let i=0;i<W.ents.length;i++){const a=W.ents[i];if(a.mp||!a.aggro||a.lunge)continue;for(let j=i+1;j<W.ents.length;j++){const b=W.ents[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),m=a.r+b.r;if(d<m&&d>.001){const p=(m-d)/2;mv(a,-dx/d*p,-dy/d*p);mv(b,dx/d*p,dy/d*p)}}}
  // allies
  for(const a of W.allies.slice()){DT=a.dt||null;a.life-=dt;if(a.cd!==undefined)a.cd-=dt;
    if(a.k==='turret'&&a.cd<=0){const t=nearest(6,a);if(t){a.cd=.45;sfx('zap');const d=dist(t,a)||1;shoot({x:(t.x-a.x)/d,y:(t.y-a.y)/d},a.m,0,{from:a,life:.6,col:'#59e0e6'})}}
    if(a.k==='storm'&&a.cd<=0){a.cd=.25;const c2=W.ents.filter(e=>dist(e,a)<3.5);sfx('thunder');if(c2.length){const t=pick(c2);W.fx.push({k:'strike',x:t.x,y:t.y,t:0,life:.2});hit(t,a.m)}else W.fx.push({k:'strike',x:a.x+rnd(-3,3),y:a.y+rnd(-3,3),t:0,life:.2})}
    if(a.k==='trops'&&a.cd<=0){a.cd=.5;for(const e of W.ents.slice())if(dist(e,a)<2.6){e.slow=1;hit(e,a.m)}}
    if(a.k==='plot'&&a.cd<=0){a.cd=.5;DT='rust';for(const e of W.ents.slice())if(dist(e,a)<(a.r||2)+(e.r||0)){e.slow=Math.max(e.slow||0,1);hit(e,a.m,true)}DT=null}
    if(a.k==='minion'&&a.flock)hsFlockStep(a,dt);else if(a.k==='minion'){a.ph+=dt;a.flash=Math.max(0,(a.flash||0)-dt);const cr=P.crunch>0&&a.per,t=(G.cls==='founder'?openTarget(8,a):nearest(8,a))||null,g=t||P,d=dist(g,a)||1,rg=a.rng||1,sp=(a.spd||5)*dt,home=dist(a,P);a.mov=false;
      /* Permanent staff catch up at 8, unless this swing is already in range. Timed minions keep 14. */
      if(a.per?home>(t&&d<=rg+(t.r||0)?13:8):home>14){a.x=P.x;a.y=P.y}else if(d>(t?rg*.8:1.5+(a.off||0))){a.x+=(g.x-a.x)/d*sp;a.y+=(g.y-a.y)/d*sp;a.fx=(g.x-a.x)-(g.y-a.y)>0?1:-1;a.mov=true}
      if(a.e){a.e.x=a.x;a.e.y=a.y;a.e.ph+=dt;a.e.fx=a.fx;a.e.hp=a.hp}
      if(t&&d<rg+t.r&&a.cd<=0){a.cd=(a.ivl||.6)*(cr?.6:1);const m=a.m*(a.per&&G.cls==='founder'?1+.08*sl(2):1)*(cr?1.3:1)*vestMul(a);
        const strike=snd=>{if(a.raw){dmgEnemy(t,snd?typed(t,a.raw*orgMul(true)*vestMul(a)):a.raw*orgMul(true)*vestMul(a),false);return}if(snd||!(rg>2)){P.allySwing=1;hit(t,m,true);P.allySwing=0;if(a.aoe)for(const o of W.ents.slice())if(o!==t&&!(o.nc>0)&&dist(o,t)<1.7){P.allySwing=1;hit(o,m*.6,true);P.allySwing=0}}else{sfx('throw');shoot({x:(t.x-a.x)/d,y:(t.y-a.y)/d},m,0,{from:a,life:.6,col:'#e0bd6e',nl:1})}};
        if(a.soundSwing)witWrap(a,strike);else{const ph=P.partyHit;P.partyHit=1;strike(false);P.partyHit=ph}}}
    if(a.k==='mine'){a.arm-=dt;if(a.arm<=0&&nearest(1.3,a)){if(!a.cut&&G.cls==='anon'&&sl(13)&&!boonOn(13))a.cut=1;else a.life=0}}
    if(a.k==='raid'&&a.cd<=0){a.cd=.13;const c2=W.ents.filter(e=>dist(e,P)<9);if(c2.length){const t=pick(c2);W.fx.push({k:'bolt',x:t.x+rnd(-5,5),y:t.y-rnd(3,6),x2:t.x,y2:t.y,t:0,life:.18,col:'#e6e2d6'});hit(t,a.m)}}
    if(a.life<=0){W.allies.splice(W.allies.indexOf(a),1);if(a.k==='decoy')burst(a.x,a.y,2.6,a.m,a.stun||0,'#ffb238');if((a.k==='mine'||a.k==='blast')&&!a.hush)burst(a.x,a.y,a.r||2.4,a.m,0,'#ff5d4d');if(a.k==='pail'){parts(a.x,a.y,8,['#c9a868','#7be495'],1.6);toast('The lunch pail is empty.')}}}
  DT=null;typeTick(dt);typeInTick(dt);updMerc(dt);updTag(dt);if(W.z.sim)simTick(dt);sqTick(dt);escTick(dt);evTick(dt);achTick(dt);p7Tick(dt);
  // projectiles
  for(const p of W.projs.slice()){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;let gone=p.life<=0||!open(p.x,p.y);
    if(!gone){if(p.foe){if(dist(p,P)<P.r+.25){hurt(p.dmg,p.slow,p.src);if(p.drain&&!S.sp.offer&&P.inv<=0)G.en=Math.max(0,G.en-p.drain);if(p.sil&&!S.sp.offer&&P.inv<=0&&!G.god){P.silence=p.sil;float(P.x,P.y,'Silenced','#e6e2d6',1)}gone=true}else for(const a of tanks())if(dist(p,a)<(a.r||.3)+.25){hurtAlly(a,p.dmg,p.src);gone=true;break}}
      else{for(const e of W.ents)if(!p.done.includes(e)&&dist(p,e)<e.r+.3){if(p.raw){if(p.party)P.partyHit=1;dmgEnemy(e,p.raw,false);P.partyHit=0}else{DT=p.dt||null;if(p.from&&p.from.per)P.allySwing=1;if(p.from&&p.from!==P)P.partyHit=1;if(p.throw)P.fromThrow=1;hit(e,p.m,p.nl);P.fromThrow=0;P.allySwing=0;P.partyHit=0;DT=null;if(p.split){p.split=0;const a=Math.atan2(p.vy,p.vx);for(const da of[-.4,.4])shoot({x:Math.cos(a+da),y:Math.sin(a+da)},p.m*.7,8,{from:p,life:.45,col:p.col,throw:1})}}if(p.pierce>0){p.pierce--;p.done.push(e)}else{gone=true}break}
        if(!walk(p.x,p.y))for(const o of W.objs)if(o.k==='crate'&&!o.used&&dist(o,p)<.6){breakCrate(o);if(!p.pierce)gone=true}
        if(!walk(p.x,p.y)&&open(p.x,p.y)&&!p.pierce&&W.map[(p.y|0)*W.N+(p.x|0)]===2)gone=true}}
    if(gone&&p.ret&&!p.returning){p.returning=1;p.vx=-p.vx;p.vy=-p.vy;p.life=.5;p.done=[];gone=false}
    if(gone){W.projs.splice(W.projs.indexOf(p),1);parts(p.x,p.y,2,[p.col],1.5)}}
  // pickups
  const magn=W.merc&&W.merc.hp>0&&G.merc.k==='hound';
  for(const d of W.drops.slice()){d.t+=dt;if(d.t<.35||dist(d,P)>((d.cr||d.sat||d.word)?(magn?5:2.2):.9))continue;
    if(d.word){gotWord(d.word);float(P.x,P.y,'“'+d.word+'”','#f7931a');toast('A torn note with one word on it: '+d.word);sfx('page');W.drops.splice(W.drops.indexOf(d),1);continue}
    if(d.sat){const n=Math.ceil(d.sat*(W.merc&&W.merc.hp>0&&G.merc.k==='node'?1.5:1)*(repRank('btc')>=2?1.25:1)*(S.sp.coldwallet?1.25:1));G.sats+=n;float(P.x,P.y,'+'+n+' sats','#f7931a');sfx('coin');W.drops.splice(W.drops.indexOf(d),1);continue}
    /* The pickup line prints whole credits, so the purse gains that floor. */
    if(d.cr){const v=Math.floor(d.cr*(1+S.gold/100));G.credits+=v;if(v){float(P.x,P.y,'+'+fmt(v),'#ffe36b');sfx('coin')}}
    else if(d.pot){if(G.stims>=S.cap)continue;G.stims++;float(P.x,P.y,'+stim','#7be495');sfx('pick')}
    else if(d.it.charm){if(!chTake(d.it)){if(P.warn<=0){toast('Your subscriptions are full (12)');P.warn=3}continue}sfx('pick');toast('Subscribed: '+d.it.name+(d.it.on?'':' (paused: six already running)'))}
    else{if(!d.force&&skipPick(d.it))continue;if(G.bag.length>=24){if(P.warn<=0){toast('Your pack is full');P.warn=3}continue}G.bag.push(d.it);sfx('pick');if(d.it.id&&G.lvl>=d.it.req&&!d.it.charm){const dl=itemDelta(d.it),emp=!G.eq[d.it.slot];if(emp||(OPT.autoEq&&dl>.01)){equipFromBag(G.bag.indexOf(d.it));toast('Equipped '+d.it.name);W.drops.splice(W.drops.indexOf(d),1);continue}if(dl>.2&&(!SWAP||dl>SWAP.d))SWAP={it:d.it,d:dl,t:8}}toast('Picked up '+(d.it.id?d.it.name:'an unidentified '+d.it.base))}
    W.drops.splice(W.drops.indexOf(d),1)}
  for(const n of W.npcs){if(n.id!=='res')continue;n.wait-=dt;n.st=Math.max(0,n.st-dt);n.cool-=dt;n.ph+=dt;
    if(n.wait<=0){if(n.ev){n.tx=n.hx+rnd(-6,6);n.ty=n.hy+rnd(-6,6)}else{n.tx=rnd(5,20);n.ty=rnd(10,20)}n.wait=rnd(3,8)}
    const dx=n.tx-n.x,dy=n.ty-n.y,d=Math.hypot(dx,dy);n.mov=d>.2;if(n.mov&&walk(n.x+dx/d*.5,n.y+dy/d*.5)){n.x+=dx/d*1.1*dt;n.y+=dy/d*1.1*dt;n.fx=dx-dy>0?1:-1}else n.mov=false;
    if(n.cool<=0&&dist(n,P)<2.6){n.say=pick(CHATTER);n.st=4;n.cool=rnd(9,16)}}
  for(const f of W.fx.slice()){if(f.stay)continue;f.t+=dt;if(f.t>=f.life){W.fx.splice(W.fx.indexOf(f),1);if(f.boom){sfx('boom');W.fx.push({k:'ring',x:f.x,y:f.y,r:f.r,t:0,life:.3,col:'#ff5d4d'});parts(f.x,f.y,14,['#ff5d4d','#ffe36b'],3);if(Math.hypot(f.x-P.x,f.y-P.y)<f.r+P.r)hurt(f.boom,false,{dty:'heat',name:'an explosion'})}}}
  for(const t of W.texts.slice()){t.t+=dt;if(t.t>.9)W.texts.splice(W.texts.indexOf(t),1)}
  for(const p of W.parts.slice()){p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;p.vz-=320*dt;if(p.z<0){p.z=0;p.vz*=-.4;p.vx*=.5;p.vy*=.5}if(p.t>=p.life)W.parts.splice(W.parts.indexOf(p),1)}
  seenT-=dt;if(seenT<=0&&!W.z.town){seenT=.2;const N=W.N,px=P.x|0,py=P.y|0;for(let y=py-8;y<=py+8;y++)for(let x=px-8;x<=px+8;x++)if(x>=0&&y>=0&&x<N&&y<N&&!W.seen[y*N+x]&&(x-px)*(x-px)+(y-py)*(y-py)<52){W.seen[y*N+x]=1;mmDot(x,y)}}
  if(G.hp<S.maxHp*.25&&!W.z.town){P.hb-=dt;if(P.hb<=0){P.hb=G.hp<S.maxHp*.12?.55:.9;sfx('heart')}}
  actTarget=findAct();
  saveT+=dt;if(saveT>5){saveT=0;save()}
  stateMarks();
}
function boss2AI(e,dt,d){const p2=e.hp<e.max*.5;e.b1-=dt;e.b2-=dt;e.b3-=dt;
  if(!e.intro){e.intro=1;toast('Vale: “There you are. Sit, if you like. Nobody is going to hurt you.”')}
  if(p2&&!e.said){e.said=1;toast('Vale: “It only wants to know where she went.”')}
  if(e.b1<=0){sfx('bossfire');e.b1=p2?1.7:2.6;const a0=Math.atan2(P.y-e.y,P.x-e.x);for(let i=-3;i<=3;i++){const a=a0+i*.16;W.projs.push({x:e.x,y:e.y,vx:Math.cos(a)*7,vy:Math.sin(a)*7,life:1.6,foe:true,dmg:e.dmg*.6,drain:6,src:e,col:'#b48cff'})}
    for(let i=0;i<10;i++){const a=e.ph+i*.628;W.projs.push({x:e.x,y:e.y,vx:Math.cos(a)*3.4,vy:Math.sin(a)*3.4,life:2.8,foe:true,dmg:e.dmg*.5,src:e,col:'#e6e2d6'})}}
  if(e.b2<=0){e.b2=p2?6:8;parts(e.x,e.y,16,['#b48cff','#fff'],2.5);for(let t=0;t<12;t++){const a=rnd(0,6.283),x=P.x+Math.cos(a)*rnd(3,5.5),y=P.y+Math.sin(a)*rnd(3,5.5);if(free(x,y,e.r)){e.x=x;e.y=y;break}}
    sfx('summon');if(W.ents.length<9)for(let i=0;i<2;i++){const s=spawn(p2?'lancer':'seer',e.x+rnd(-2,2),e.y+rnd(-2,2),{minion:1});if(s)s.aggro=true}toast('Vale: “'+pick(BOSSBARK2)+'”')}
  if(d<2.8&&e.b3<=0&&!e.slam){sfx('warn');e.slam=.75;e.b3=4;W.fx.push({k:'warn',x:e.x,y:e.y,r:3.2,t:0,life:.75})}
  if(e.slam){e.slam-=dt;if(e.slam<=0){sfx('boom');e.slam=0;W.fx.push({k:'ring',x:e.x,y:e.y,r:3.2,t:0,life:.3,col:'#b48cff'});if(OPT.shake)shake=8;if(dist(e,P)<3.2+P.r)hurt(e.dmg*1.9,false,e)}}}
function mandateOffer(e,first){dlg('MANDATE',first?'“I can make this easy. Your life restored, and more credits than you will ever count. All you have to do is stop. Nobody is watching. Nobody would know.”':'“Then not comfort. Mercy. I will raise the Stipend tonight, for everyone, to whatever number you say. Put the weapon down and it is done. Is your pride worth more than nine billion people?”',[
  ['Refuse',()=>{P.shr={k:'might',t:25,n:'Unbought'};sfx('buff');toast('Unbought: +50% damage for 25 seconds')}],
  ['Accept',()=>{G.st.sold++;addAdopt(-15,'you took MANDATE’s offer');const c=6000*G.cpi*G.lvl;G.credits+=c;ZS[16]&&delete ZS[16];const z=W.zi;W.zi=6;W.z=ZONES[6];enter(HT());delete ZS[z];dlg('You agreed','It was a very good offer. '+fmt(c)+' is yours, and worth a little less every minute. MANDATE is exactly where you left it, and it has learned your price.',[['Continue']])}]],4)}
function boss3AI(e,dt,d){const f=e.hp/e.max;e.b1=(e.b1||0)-dt;e.b2=(e.b2===undefined?4:e.b2)-dt;e.b3=(e.b3===undefined?3:e.b3)-dt;e.spin=(e.spin||0)+dt*(f<.5?1.5:1);
  if(!e.intro){e.intro=1;toast('MANDATE: “You came a long way to refuse me. Let us see whether you can.”')}
  if(e.b1<=0){e.b1=f<.33?.1:.16;for(const o of(f<.5?[0,3.14159]:[0])){const a=e.spin+o;W.projs.push({x:e.x,y:e.y,vx:Math.cos(a)*5,vy:Math.sin(a)*5,life:2.6,foe:true,dmg:e.dmg*.8,src:e,col:'#ffffff'})}}
  if(e.b2<=0){e.b2=f<.5?6:8;sfx('summon');if(W.ents.filter(o=>o.minion).length<8)for(let i=0;i<2;i++){const s=spawn(pick(['proxy','censor','lancer']),e.x+rnd(-4,4),e.y+rnd(-4,4),{minion:1});if(s)s.aggro=true}}
  if(e.b3<=0){e.b3=f<.5?2.2:3.4;sfx('warn');W.fx.push({k:'warn',x:P.x,y:P.y,r:2.2,t:0,life:.9,boom:e.dmg*1.6})}
  if(f<.66&&!e.o1){e.o1=1;mandateOffer(e,true)}else if(f<.33&&!e.o2){e.o2=1;mandateOffer(e,false)}}
function bossAI(e,dt,d){if(BAI[e.k])return BAI[e.k](e,dt,d);if(e.k==='boss3')return boss3AI(e,dt,d);if(e.k==='boss2')return boss2AI(e,dt,d);
  const p2=e.hp<e.max*.5;e.b1-=dt;e.b2-=dt;e.b3-=dt;
  if(!e.intro){e.intro=1;toast('Pryce: “You must be my three o’clock. Shall we discuss your price?”')}
  if(p2&&!e.said){e.said=1;toast('Pryce: “Let’s circle back to your termination.”')}
  if(e.b1<=0){sfx('bossfire');e.b1=p2?2.2:3.6;const n=p2?16:12,o=Math.random();for(let i=0;i<n;i++){const a=o+i/n*6.283;W.projs.push({x:e.x,y:e.y,vx:Math.cos(a)*4.6,vy:Math.sin(a)*4.6,life:2.4,foe:true,dmg:e.dmg*.7,src:e,col:'#ffe36b'})}}
  if(e.b2<=0){e.b2=9;if(W.ents.length<10){for(let i=0;i<3;i++){const s=spawn(p2?'hound':'drone',e.x+rnd(-2,2),e.y+rnd(-2,2),{minion:1});if(s)s.aggro=true}sfx('summon');toast('Pryce: “'+pick(BOSSBARK)+'”')}}
  if(d<2.8&&e.b3<=0&&!e.slam){sfx('warn');e.slam=.85;e.b3=4.5;W.fx.push({k:'warn',x:e.x,y:e.y,r:3,t:0,life:.85})}
  if(e.slam){e.slam-=dt;if(e.slam<=0){sfx('boom');e.slam=0;W.fx.push({k:'ring',x:e.x,y:e.y,r:3,t:0,life:.3,col:'#ff5d4d'});if(OPT.shake)shake=8;if(dist(e,P)<3+P.r)hurt(e.dmg*1.9,false,e)}}
}
