/* ================= conversations: what you say about money shapes how people treat you ================= */
REP.norm={n:'The Residents',ranks:['Neighbour','Regular','Trusted','One of Us'],perks:['Brenda charges 10% less','The Stipend pays 25% more','Brenda charges 20% less','A gift from the block committee'],how:'Earned by agreeing with Residents about money, or by getting them to think.'};
const PERS={gramps:{n:'Gramps',g:'mid',know:2,o:0},nonce:{n:'Nonce',g:'maxi',know:3,o:1},null:{n:'Sister Null',g:'maxi',know:3,o:5},marrow:{n:'Marrow',g:'mid',know:3,o:3},tam:{n:'Tam',g:'normie',know:1,o:6},float:{n:'Mr. Float',g:'fud',know:1,o:2},ines:{n:'Ines',g:'normie',know:0,o:4},wren:{n:'Wren',g:'mid',know:1,o:7},kestrel:{n:'Kestrel',g:'mid',know:1,o:4},brenda:{n:'Brenda',g:'fud',know:0,o:6},res:{n:'A Resident',g:'normie',know:0,o:0}};
const CONV=[
 {maxi:"Bread was four credits when I woke up. What is it now, do you think?",fud:"Prices go up. That is what prices do. It means the economy is healthy.",normie:"My Stipend landed and it was gone by lunch. Is that just me?",mid:"My mother kept savings. Actual savings. Can you picture it now?",
  fiat:"Prices rise because the economy is growing. Unity manages it.",btc:"Prices rise because they keep making more credits. Your work did not get cheaper. The money did.",ask:"Why do prices only ever go one way?",
  teach:"When new money is made faster than new goods, each unit buys less. Whoever gets the new money first spends it before prices move. Everyone after that just sees the price.",dunno:"Greed, I think. Or the weather. The feed said it was the weather."},
 {maxi:"Twenty-one million. Nobody can vote for twenty-two. Do you know how rare it is for a rule to mean it?",fud:"A money you cannot make more of? What happens in an emergency? You would just let people suffer?",normie:"Somebody told me there are only so many of those bitcoin. What happens when they run out?",mid:"A fixed supply. I go back and forth on whether that is wisdom or stubbornness.",
  fiat:"Money has to be flexible. Somebody responsible needs to be able to make more.",btc:"A fixed supply means nobody can quietly dilute what you saved.",ask:"What actually stops someone from making more?",
  teach:"Every node checks every block against the same rules. A block that pays out too much is simply rejected by everyone running the software. There is no office to lobby. And each coin divides into a hundred million sats, so they do not run out; they are just counted smaller.",dunno:"I heard there is a man in the Cloud with a button. There is always a button."},
 {maxi:"Where are your sats right now? If the answer is somebody else’s name, they are not your sats.",fud:"Twelve words on a scrap of paper? And if you lose it, that is that? Unity resets my password in a minute.",normie:"I like that Unity keeps my balance for me. I would only lose it.",mid:"Holding your own keys is freedom, and it is also a chore. Both are true.",
  fiat:"It is safer to let Unity hold it. That is what they are for.",btc:"If someone else holds the keys, you hold a promise. I would rather hold the thing.",ask:"What are the twelve words actually for?",
  teach:"The words stand for one secret number. Whoever knows it can move the coins, and nobody else can. Nobody can reset it for you, which is the cost. Nobody can take it from you, which is the point.",dunno:"It is like a password, but worse. I think."},
 {maxi:"They say the miners waste power. Ask them what the Humming Fields are burning it on.",fud:"It boils the oceans. I saw a graph. It uses more power than, well, a lot.",normie:"Does it not use a great deal of electricity? That is what I heard.",mid:"It does use energy. So does everything worth securing. The question is whether it is worth it.",
  fiat:"It is a waste of energy for imaginary coins.",btc:"The energy is what makes the ledger expensive to rewrite. That is what it buys.",ask:"Why does it need energy at all?",
  teach:"Miners spend real energy to add a block. To rewrite history you would have to spend it all over again, faster than everyone else put together. The cost is the security.",dunno:"The computers get hot. I do not know why they have to."},
 {maxi:"Measured in sats, bread has done nothing but get cheaper. They call that volatile.",fud:"It goes up and down like a lift. You cannot run a life on that.",normie:"My cousin bought some, and it dropped, and she cried.",mid:"Short run, it swings. Long run, look what credits did. I know which chart frightens me.",
  fiat:"At least credits are stable from one day to the next.",btc:"Credits are stable the way a slow leak is stable.",ask:"If it swings so much, why does anyone save in it?",
  teach:"Over days the price moves a lot, because the market is still small. Over years it is measured against a currency made without limit. People who save in it are choosing the long window, and they have to stomach the short one.",dunno:"Gamblers, mostly. That is what the feed says."},
 {maxi:"They can read every purchase you ever made through that visor. And they call us suspicious.",fud:"Only criminals need money the government cannot see.",normie:"If you have nothing to hide, why would you want it?",mid:"Privacy is not secrecy. I close the door when I wash. I am not hiding a crime.",
  fiat:"If you have nothing to hide, you have nothing to fear.",btc:"Paying without asking permission is not a crime. It is the default they took away.",ask:"Can they really see everything I buy?",
  teach:"With credits, yes. Every payment passes through Unity’s ledger with your name on it. Bitcoin’s ledger is public as well, but it lists addresses, not names. Privacy there takes care. It is not automatic.",dunno:"Probably? I never thought about it. I do not like thinking about it."},
 {maxi:"Five hundred credits a minute and nobody can afford a chair. Easy money, easy lives, nothing built.",fud:"The Stipend is the greatest achievement of civilisation. Nobody has to save any more.",normie:"I spend it the second it lands. No point keeping it, is there?",mid:"When money melts, you spend it. When you spend everything, you plan nothing. I watched a whole town stop planning.",
  fiat:"Saving is hoarding. Spending keeps everyone going.",btc:"If your money holds its value you can afford to wait, and people who can wait build things.",ask:"Why does nobody here save anything?",
  teach:"If money loses value while you hold it, the sensible move is to spend it at once. Do that for a generation and nobody builds anything slow. Money that keeps its value makes patience affordable.",dunno:"Save what? For what?"},
 {maxi:"Ask them what backs a credit. Go on. I love watching them work it out.",fud:"It is backed by nothing! Credits are backed by Unity.",normie:"But what is it? You cannot hold it.",mid:"Nothing has value by itself. Things have value because people need what they do.",
  fiat:"It is not backed by anything real.",btc:"It is backed by rules nobody can change and work nobody can fake.",ask:"What gives any money its value?",
  teach:"People value money for what it does: hard to make more of, easy to check, easy to move, and it lasts. Credits do well on moving and badly on the first. That is most of the argument.",dunno:"Unity says so. That is what makes it money."}];
const GREET={maxi:["A fellow pleb. Good.","Oh. The Stipend enthusiast.",""],fud:["Here comes the coin person.","Good to see somebody sensible.",""],normie:["You are the one with the internet money, are you not?","You seem normal. I like that.",""],mid:["You think about these things. I can tell.","You sound like the feed sometimes, you know.",""]};
const REACT={
 maxi:{btc:["Exactly. Stay humble, stack sats.","You have done the reading. It shows.","Good. Now go and run a node about it."],fiat:["Did the visor write that for you? Have fun staying poor.","Spoken like a man with a balance somebody else can edit.","I have heard that sentence before. It was in an advertisement."],ask:null},
 fud:{btc:["That is exactly what a cultist would say.","Mm. And how is that going for your friends in the tents?","You people always have an answer. That is how I know it is a scam."],fiat:["Finally, somebody who understands how the world works.","Quite right. I shall tell the others you are sound.","Well said. You would do well in lending."],ask:null},
 normie:{btc:["Huh. I never thought of it like that. I am not saying you are right.","That is... a bit frightening, honestly. But I see it.","Do not say that too loudly. But tell me again later."],fiat:["That is what I always say!","Right? Thank you. People make it so complicated.","Exactly. Why worry about it."],ask:null},
 mid:{btc:["Yes. That is nearer the truth than most people get.","I think so too, on my better days.","Mind who you say it to. But yes."],fiat:["Hm. I used to say that. Then I counted what I had left.","If you say so. I would look at the price of bread first.","That is the comfortable answer. It is not always the right one."],ask:null}};
function leanWord(){const L=G.lean||0;return L>50?'A bitcoiner, plainly':L>15?'Leaning orange':L<-50?'Fiat-minded, plainly':L<-15?'Leaning fiat':'Hard to place'}
function repAdj(f,n){if(n>0)addRep(f,n);else G.rep[f]=Math.max(0,G.rep[f]+n)}
function convo(id){const p=PERS[id]||PERS.res,g=id==='res'?pick(G.adopt>=60?['mid','normie','normie']:G.adopt<25?['fud','fud','normie']:['fud','normie','normie']):p.g,k=G.cv[id]=(G.cv[id]||0)+1,t=CONV[(k+p.o)%CONV.length],L=G.lean||0,hi=GREET[g][L>25?0:L<-25?1:2];
  const ops=[['“'+t.btc+'”','btc'],['“'+t.fiat+'”','fiat']].sort(()=>Math.random()-.5).concat([['“'+t.ask+'”','ask'],['“'+TOX[(k+p.o)%CONV.length]+'”','tox']]).map(o=>[o[0],()=>react(id,g,p,t,o[1])]);ops.push(['Say nothing']);
  dlg(p.n,(hi?'“'+hi+'” ':'')+'“'+t[g]+'”',ops)}
function react(id,g,p,t,r){W.cvd=W.cvd||{};const fresh=!W.cvd[id];W.cvd[id]=1;let txt,ch=[];const rp=(f,n,lab)=>{if(!fresh)return;repAdj(f,n);ch.push(lab+' '+(n>0?'+':'')+n)};
  if(r==='tox'){G.lean=clamp((G.lean||0)+12,-100,100);if(g==='maxi'){txt=pick(['Ha! Based. Unity heard that, you know.','Far too spicy for the square. I like you.','Say it louder. No, do not. They are listening.']);rp('btc',2,'Bitcoiners');if(fresh)scsAdj(-15,'overheard')}else{txt=pick(['I beg your pardon?','There is no need for that. I am reporting this conversation.','My visor just flagged you. I hope it was worth it.','We were only talking. You people are exhausting.']);rp('norm',-3,'Residents');if(fresh){scsAdj(-40,'reported');addAdopt(-1,'you made it look ugly');sway(id,p,-2)}}}
  else if(r==='ask'){const knows=p.know>=2&&g!=='fud';txt=knows?t.teach:t.dunno;if(knows)rp('btc',1,'Bitcoiners');else rp('norm',1,'Residents')}
  else{txt=pick(REACT[g][r]);if(fresh&&g!=='maxi'){scsAdj(r==='fiat'?10:-5);sway(id,p,r==='btc'?1:-1);if(r==='btc')campHit('smear');else if(g==='normie')addAdopt(-.5)}G.lean=clamp((G.lean||0)+(r==='btc'?8:-8),-100,100);
    if(g==='maxi'){if(r==='btc')rp('btc',3,'Bitcoiners');else{rp('btc',-3,'Bitcoiners');rp('norm',1,'Residents')}}
    if(g==='fud'){if(r==='fiat')rp('norm',3,'Residents');else{rp('norm',-2,'Residents');rp('btc',2,'Bitcoiners')}}
    if(g==='normie'){if(r==='fiat')rp('norm',3,'Residents');else{rp('norm',1,'Residents');rp('btc',2,'Bitcoiners');if(fresh)addAdopt(.5,'someone is thinking it over')}}
    if(g==='mid'){if(r==='btc')rp('btc',2,'Bitcoiners');else rp('norm',2,'Residents')}}
  sfx('talk');dlg(p.n,'“'+txt+'”'+(ch.length?' ('+ch.join(' · ')+')':fresh?'':' (You have already talked today; opinions settle between visits.)'),[['Continue']])}
/* ================= social credit: Unity scores what you say ================= */
const TOX=["Enjoy your melting paper. Have fun staying poor.","Anyone who cannot count to twenty-one million deserves the Stipend.","Not your keys, not your coins, not my problem. Cry to Unity.","I would burn this whole district for one more block.","Zoom out, pleb. Or do not. Stay poor quietly.","Only a bootlicker asks permission to spend his own money.","The Stipend is a leash, and you are wagging your tail.","Your credits are backed by a slogan. You are backed by nothing."];
const scs=()=>G.scs===undefined?700:G.scs;
const scsWord=()=>{const s=scs();return s>=850?'Model Resident':s>=650?'In good standing':s>=500?'Under review':s>=350?'Restricted':'Unpersoned'};
function scsAdj(n,why){const a=scs(),b=G.scs=clamp(a+n,0,1000);if(n)toast('Social credit '+(n>0?'+':'')+n+' → '+b+(why?' · '+why:''));
  if(a>=500&&b<500)setTimeout(()=>dlg('Notice of review','Your social credit has fallen below 500. Brenda may no longer serve you, the Stipend is halved, and lenders will price you accordingly. The people Unity does not score have noticed too, and they look after their own.',[['Understood']]),700);
  if(a<500&&b>=500)setTimeout(()=>toast('Your standing is restored. Brenda will serve you again.'),700)}
const loanFee=()=>scs()<500?1.35:1.1,loanRate=()=>scs()<500?1.002:1.001;
const cause=()=>scs()<500;   /* bitcoiners help the unscored */
/* ================= shitcoiners: wandering salesmen for coins that will not exist next week ================= */
ET.shill={n:'Shitcoiner',spr:'hr',hp:70,dmg:9,spd:2.5,r:.36,range:1.3,xp:30,atk:1.1,sight:0,pal:['#3fe06a','#e04ad0']};
TC.shill={n:'Shitcoiner',picks:2,no:30,gold:50,item:14,stim:6,q:{u:200,s:160,r:30,m:4},note:'Portfolio liquidates into sats'};
const COINS=['RugPull Inu','SafeMoonwalk','UnityCoin','Stablish','ElonDogeMars','PonziDAO','Fartchain','YieldBunny','MoonRocket Classic','TrustMeBro'];
const SHILLQ=["It is like bitcoin, but faster, and the founders hold most of it, which is how you know they believe in it.","Bitcoin is old tech. This one has a roadmap. And a mascot.","You are still early. I only need ten sats and you will thank me by Thursday.","It is decentralised. There are three of us and we all agree.","The supply is unlimited, so there is plenty for everyone."];
let shillT=70;
function shillTick(dt){if(W.z.town||W.z.sim||W.z.sub)return;const s=W.ents.find(e=>e.pitch);
  if(!s){if((W.boss&&W.boss.aggro)||W.hold||W.pow||EV)return;shillT-=dt;if(shillT<=0){if(shillRare()){shillT=rnd(40,80);return}shillT=rnd(110,190);const tough=shillTough(),p=freeSpotNear(8),e=spawn('shill',p.x,p.y,tough?{champ:1}:{});if(e){e.coin=pick(COINS);e.name='Shill for '+e.coin;e.pitch=1;e.pt=18;e.mods=tough?{fast:1}:{};sfx('talk');toast('Someone is jogging toward you, waving a pamphlet.')}}return}
  if(s.aggro){s.pitch=0;return}
  const d=dist(s,P);s.pt-=dt;if(d>1.8)mv(s,(P.x-s.x)/d*2.8*dt,(P.y-s.y)/d*2.8*dt);s.ph+=dt;
  if(d<=2.2&&s.pitch===1){s.pitch=2;shillTalk(s)}else if(s.pt<=0)shillLeave(s,'He gives up and jogs off, still waving the pamphlet.')}
function shillLeave(s,line){if(!s||s.left)return;s.left=1;s.pitch=0;s.aggro=false;const i=W.ents.indexOf(s);if(i>=0)W.ents.splice(i,1);toast(line)}
function shillTough(){return (G.lvl||1)>=8}
function shillRare(){return (G.lvl||1)<6&&Math.random()<.65}
function shillTurn(s,line){s.pitch=0;s.aggro=true;sfx('growl');toast(line);const n=shillTough()?2:0;for(let i=0;i<n;i++){const m=spawn('bot',s.x+rnd(-1.2,1.2),s.y+rnd(-1.2,1.2),{minion:1});if(m){m.name='Bagholder';m.aggro=true}}}
function shillTalk(s){const c=s.coin,price=Math.min(10,G.sats);
  dlg(s.name,'“Friend! Have you heard about '+c+'? '+pick(SHILLQ)+' Ten sats gets you ten thousand '+c+'. What do you say?”',[
   ['“No. There is bitcoin, and there is everything else.”',()=>{G.lean=clamp((G.lean||0)+6,-100,100);if(G.rep)addRep('btc',1);shillTurn(s,'“Maxi! Dinosaur! Get him!”')}],
   ['Trade '+price+' sats for 10,000 '+c,()=>{if(price<1){shillLeave(s,'“No sats? Then I am wasting the pitch.” He leaves.');return}G.sats-=price;addAdopt(-3,'sats sold for '+c);G.bagsHeld=(G.bagsHeld||0)+1;G.lean=clamp((G.lean||0)-15,-100,100);repAdj('btc',-3);W.ents.splice(W.ents.indexOf(s),1);sfx('coin');toast('You hold 10,000 '+c+'. He is already gone.');
     setTimeout(()=>{if(G)dlg(c,'The '+c+' chart goes straight down and then stops being a chart. The website is gone. Your ten thousand '+c+' are worth nothing, and the '+price+' sats you paid are in somebody else’s wallet. Nonce will hear about this.',[['Lesson learned']])},25000)}],
   ['“What does it actually do?”',()=>dlg(s.name,'“Do? It goes up. That is what it does. Community. Utility. Ecosystem.” He is sweating.',[['“No.”',()=>shillTurn(s,'“You just hate innovation!”')],['Walk away',()=>shillLeave(s,'He lets you walk. The pamphlet stays in his hand.')]])]],3)}
function shillDie(e){campHit('coin');const coins=ri(6,14),n=ri(4,9)+Math.floor(W.ml/8);G.sats+=n;G.st.shills=(G.st.shills||0)+1;sfx('quest');float(e.x,e.y,'+'+n+' sats','#f7931a');addRep('btc',2);
  toast('Portfolio liquidated: '+coins+' coins nobody wanted, consolidated into '+n+' sats and withdrawn to your wallet.')}

/* ================= the market =================
   A sat is priced in credits. Two forces decide what it is worth and both are already
   in the game: credits are created without limit (the numerator rots), and adoption is
   demand against a supply nobody can add to. Everything else - the wobble, the spread,
   the fee, the slippage - is what a market actually costs you, and it is the part games
   usually lie about. */
const MKT_BASE=80;          /* credits per sat on the day you walked into Stillwater */
const MKT_N=72;             /* points kept for the chart */
const MKT_SAMPLE=1.7;       /* seconds of play between samples */
const MKT_TAKER=.004;       /* what Nonce charges for filling you right now */
const MKT_MAKER=.002;       /* what he pays you for posting a price and waiting */
const mktFair=()=>MKT_BASE*Math.pow(G.cpi,1.05)*(1+(G.adopt||0)/50);
/* a deeper market is a calmer one: both of these improve as the world adopts */
const mktVol=()=>Math.max(.0012,.0042-.00003*(G.adopt||0));
const mktDepth=()=>40+(G.adopt||0)*3.2+repRank('btc')*35+(G.nodeUp?25:0);
/* his pay for being willing to trade when nobody else will. It is not a trick, it is a wage. */
const mktSpread=()=>clamp(.015-.003*repRank('btc')-.00006*(G.adopt||0),.002,.02);
const mktMid=()=>(G.mkt&&G.mkt.p)||mktFair();
const mktBid=()=>mktMid()*(1-mktSpread()/2), mktAsk=()=>mktMid()*(1+mktSpread()/2);
function mktInit(){const m=G.mkt=G.mkt||{};if(!(m.p>0))m.p=mktFair();
  m.h=m.h||[];m.hq=m.hq||[];m.hf=m.hf||[];m.sent=m.sent||0;m.sT=m.sT||0;m.news=m.news||[];m.ord=m.ord||[];
  m.cb=m.cb||{n:0,cr:0,st:0};m.hi=m.hi||m.p;m.lo=m.lo||m.p;
  if(!(m.r>0))m.r=m.p/mktFair()||1;
  /* backfill a little history so the first chart has a shape instead of a flat line */
  if(!m.h.length){const q=stimPrice();let r=m.r,f=mktFair();
    /* credits were worth more a minute ago, so walk the fair value back down the same
       curve update() walks it up, and the seed meets the live ticks at one slope */
    const back=Math.pow(Math.pow(1.0025,MKT_SAMPLE*(1.45-(G.adopt||0)/100)),-1.05);
    for(let i=12;i>0;i--){r=clamp(r*(1+g3()*.01),.78,1.3);f*=back;m.h.unshift(+(f*r).toPrecision(6));m.hq.unshift(q);m.hf.unshift(+f.toPrecision(6))}}
  while(m.hf.length<m.h.length)m.hf.unshift(m.hf[0]||m.p);
  return m}
/* news moves sentiment, and sentiment moves the price around its value. The ticker under
   the chart names the last few, so a move can be read instead of guessed at. */
function mktNews(n,why){const m=G.mkt;if(!m)return;m.sent=clamp(m.sent+n,-1,1);
  if(why){m.news.unshift({w:why,n:n>0?1:-1,t:G.time||0});m.news.length=Math.min(m.news.length,5)}}
const g3=()=>(Math.random()+Math.random()+Math.random()-1.5)*1.16;
function mktTick(dt){const m=G.mkt;if(!m||!(m.p>0))return;if(!(m.r>0))m.r=1;
  /* sentiment decays toward what the town thinks of you, so how you talk is a slow force */
  const anchor=clamp((G.lean||0)/420,-.22,.22);m.sent+=(anchor-m.sent)*(1-Math.exp(-dt/95));
  const tgt=1+m.sent*.55;m.r+=(tgt-m.r)*(1-Math.exp(-dt/42));
  m.r*=1+g3()*mktVol()*Math.sqrt(dt);m.r=clamp(m.r,.34,2.6);
  if(G.sats>=25){if(!(m.pk>0)||m.p>m.pk){if(m.dd&&m.p>=m.pk)G.st.hodl=(G.st.hodl||0)+1;m.pk=m.p;m.dd=0}
    else if(m.p<m.pk*.8)m.dd=1}else{m.pk=m.p;m.dd=0}
  const f=mktFair();m.p=f*m.r;
  m.hi=Math.max(m.hi||0,m.p);m.lo=Math.min(m.lo||m.p,m.p);
  m.sT-=dt;if(m.sT<=0){m.sT=MKT_SAMPLE;m.h.push(+m.p.toPrecision(6));m.hq.push(+stimPrice().toPrecision(6));m.hf.push(+mktFair().toPrecision(6));
    while(m.h.length>MKT_N){m.h.shift();m.hq.shift();m.hf.shift()}}
  mktFills()}
/* ---------- quotes: the four things a trade costs ---------- */
/* size against depth. Nobody pays the headline price for a large order, in any market. */
function mktQuote(n,side){const mid=mktMid(),sp=mktSpread(),k=Math.min(.55,n/mktDepth()),buy=side==='buy';
  const px=mid*(1+(buy?sp/2:-sp/2))*(1+(buy?k*.09:-k*.09)),gross=px*n,fee=gross*MKT_TAKER;
  /* The quote prints whole credits, so the purse pays that floor. Size still walks the book. */
  return{mid,sp,k,px,gross,fee,total:Math.floor(buy?gross+fee:gross-fee)}}
function mktImpact(n,side){const m=G.mkt,k=Math.min(.55,n/mktDepth());m.r=clamp(m.r*(1+(side==='buy'?k*.16:-k*.16)),.34,2.6);m.p=mktFair()*m.r;return k}
function mktBasisAdd(n,cr){const c=G.mkt.cb;c.n+=n;c.cr+=cr;c.st+=cr/Math.max(1,stimPrice())}
function mktBasisTake(n){const c=G.mkt.cb;if(c.n<=0)return;const f=Math.min(1,n/c.n);c.cr-=c.cr*f;c.st-=c.st*f;c.n=Math.max(0,c.n-n)}
/* ---------- taking his quote ---------- */
function mktTrade(n,side){const m=mktInit();n=Math.floor(n);if(n<1)return null;
  if(side==='sell'&&G.sats<n)return null;
  const q=mktQuote(n,side);
  if(side==='buy'){if(G.credits<q.total)return null;G.credits-=q.total;G.sats+=n;mktBasisAdd(n,q.total);addRep('btc',Math.ceil(n/6));addAdopt(Math.min(2,n*.02),'');if(m.r<.97)G.st.dip=(G.st.dip||0)+1}
  else{G.sats-=n;G.credits+=q.total;mktBasisTake(n);addAdopt(-Math.min(3,n*.08),n>=10?'sats sold for credits':'')}
  mktImpact(n,side);mktNews(side==='buy'?.05:-.05,null);sfx('coin');
  if(q.k>.12)toast('Your order walked the book: you paid '+Math.round(q.k*9)+'% away from the quote. Size moves price.');
  return q}
/* ---------- posting a price instead: you do his job, he pays you for it ---------- */
function mktPost(n,px,side){const m=mktInit();n=Math.floor(n);if(n<1||!(px>0))return false;
  if(m.ord.length>=4){toast('Nonce will hold four orders at a time');sfx('err');return false}
  /* The held line prints whole credits, so a bid escrows that floor. The limit stays the price you named. */
  const held=side==='buy'?Math.floor(n*px):n;
  if(side==='sell'){if(G.sats<n)return false;G.sats-=n}
  else{if(held<1||G.credits<held)return false;G.credits-=held}
  m.ord.push({s:side,n,px,esc:held});sfx('ui');
  toast(side==='sell'?'Posted: '+n+' sats for sale at '+fmt(px)+' each':'Posted: a bid for '+n+' sats at '+fmt(px)+' each');return true}
function mktCancel(i){const m=G.mkt,o=m.ord[i];if(!o)return;if(o.s==='buy')G.credits+=o.esc;else G.sats+=o.esc;
  m.ord.splice(i,1);sfx('ui');toast('Order withdrawn')}
function mktFills(){const m=G.mkt,mid=m.p;
  for(let i=m.ord.length-1;i>=0;i--){const o=m.ord[i];
    if(o.s==='buy'?mid>o.px:mid<o.px)continue;
    m.ord.splice(i,1);const gross=o.n*o.px,reb=gross*MKT_MAKER;
    if(o.s==='buy'){G.sats+=o.n;mktBasisAdd(o.n,o.esc-reb);G.credits+=reb;addRep('btc',Math.ceil(o.n/6))}
    else{G.credits+=gross+reb;mktBasisTake(o.n)}
    G.st.maker=(G.st.maker||0)+1;mktImpact(o.n*.5,o.s);sfx('coin');
    toast('Your order filled: '+o.n+' sats at '+fmt(o.px)+'. Maker rebate '+fmt(reb)+' — you were the one waiting.')}}
/* ---------- Mr. Float lends against them, and is delighted either way ---------- */
const MKT_LTV=.5, MKT_LIQ=.72;
function mktBorrow(n){const m=mktInit();if(m.pos)return false;n=Math.floor(n);if(n<1||G.sats<n)return false;
  /* The sheet prints whole credits, so the purse gains that floor. */
  const px=mktBid(),lent=Math.floor(n*px*MKT_LTV);G.sats-=n;G.credits+=lent;
  m.pos={n,px,lent,liq:px*MKT_LIQ};mktNews(-.06,'collateral posted with Mr. Float');sfx('coin');
  dlg('Mr. Float','“'+n+' sats, held by me, and '+fmt(lent)+' in your hand today. If one sat falls under '+fmt(m.pos.liq)+' I keep the collateral and you keep the credits. People always take that deal. They are always surprised.”',[['Understood']]);return true}
function mktRepay(){const m=G.mkt,p=m&&m.pos;if(!p)return false;/* The owe line prints whole credits, so the purse pays that floor. */const owed=Math.floor(p.lent*1.08);if(G.credits<owed)return false;
  G.credits-=owed;G.sats+=p.n;m.pos=null;sfx('coin');toast('Collateral released: '+p.n+' sats back, '+fmt(owed)+' paid');return true}
function mktLiqCheck(){const m=G.mkt,p=m&&m.pos;if(!p)return;if(mktMid()>p.liq)return;m.pos=null;
  G.st.liq=(G.st.liq||0)+1;mktNews(-.1,'a position was liquidated');sfx('err');
  dlg('Mr. Float','“Called in. The '+p.n+' sats are mine; the '+fmt(p.lent)+' was always yours to keep, and by now it buys rather less than it did. I did say. I am sorry, I truly am, and I would do it again this afternoon.”',[['Say nothing']])}
