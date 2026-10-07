/* ================= the money story: adoption is a tug-of-war, and the ending follows it ================= */
const CAMPS={smear:{n:'The Smear',d:'The feed says bitcoiners are hoarders and criminals. Answer it: give three townsfolk a bitcoiner answer without insulting them.',need:3,act:1},
 coin:{n:'UnityCoin',d:'Unity has launched its own coin and sent salesmen out with it. Liquidate two shitcoiners.',need:2,act:2},
 ban:{n:'The Ban',d:'Holding sats has been declared antisocial. Show the network cannot be switched off: complete a proof of work shrine.',need:1,act:3}};
function campStart(k){if(G.camps[k])return;G.camps[k]=1;G.camp={k,c:0,t:45};sfx('roar');mktNews(-.22,'Unity opens “'+CAMPS[k].n+'”');setTimeout(()=>dlg('Unity responds · '+CAMPS[k].n,CAMPS[k].d+' Until you do, adoption drains away.',[['Understood']]),1500)}
function smearOpen(){return (G.q.q2||0)===3&&!G.camps.smear&&!G.camp}
function smearAsk(){return dlg('Nonce','“The feed is calling bitcoiners hoarders and criminals. That is Unity, not this town. Three people will listen if you answer them like a bitcoiner and do not insult them. You do not have to. If you take it up, Unity pushes back, and adoption drains until the story breaks.”',[['I will answer it',()=>campStart('smear')],['Not now']])}
function campHit(k,n){const c=G.camp;if(!c||c.k!==k)return;c.c+=n||1;if(c.c>=CAMPS[k].need){G.camp=null;G.camps[k]=2;sfx('quest');mktNews(.2,'“'+CAMPS[k].n+'” collapses');addAdopt(6,CAMPS[k].n+' has failed');toast('Unity’s campaign collapses.')}else toast(CAMPS[k].n+': '+c.c+'/'+CAMPS[k].need)}
function fateOf(){const a=G.adopt;return a>=60?'reserve':a>=25?'stale':'fail'}
const fateWord=()=>({reserve:'Rising: on course to become the reserve',stale:'Contested: could go either way',fail:'Failing: one bad season from going dark'})[fateOf()];
function storyTick(dt){const c=G.camp;if(c&&!W.z.town&&!W.z.sim){c.t-=dt;if(c.t<=0){c.t=45;if(G.adopt>5){addAdopt(-1,CAMPS[c.k].n);if(G.adopt<15){const ks=Object.keys(G.nodes);if(ks.length){delete G.nodes[pick(ks)];toast('A node has gone dark.')}}}}}
  if(!G.camp){if(G.act2&&G.camps.smear===2&&!G.camps.coin)campStart('coin');else if(G.act3&&G.camps.coin===2&&!G.camps.ban)campStart('ban')}
  if(c&&c.k==='coin'&&shillT>40)shillT=40}
/* people can be won or lost by how you talk to them */
function sway(id,p,n){if(id==='res')return;const v=G.won[id]=(G.won[id]||0)+n,f=G.wonF=G.wonF||{};
  if(v>=3&&f[id]!==1){f[id]=1;mktNews(.09,p.n+' is stacking');setTimeout(()=>{sfx('quest');addAdopt(3,p.n+' now saves in sats')},600)}
  if(v<=-3&&f[id]!==-1){f[id]=-1;mktNews(-.09,p.n+' has given up on it');setTimeout(()=>addAdopt(-3,p.n+' has given up on it'),600)}}
const STALE=[
 {art:'node',text:'Bitcoin does not win, and it does not die. A stubborn few keep their nodes humming in back rooms, and the Stipend goes on landing every minute, worth a little less each time.'}];
const FAIL=[
 {art:'node',text:'The last node anyone knows of goes quiet on a Tuesday. Nonce packs his stall into one bag and does not say where he is going.'},
 {art:'feed',text:'Unity launches a coin of its own the same week. It has a mascot and a cap on its supply. The cap can be changed by a vote of the Board, and before the year is out, it is.'},
 {art:'ticker',text:'Nobody took it from you. It was sold, a few sats at a time, for things that were gone by evening. Somewhere a ledger still exists with nobody running it.'}];
function fateScene(then){const f=G.fate=fateOf();
  if(f==='reserve'){const was=G.adopt>=100;G.adopt=100;if(was||G.resSeen)return then();G.resSeen=1;return playScene(RESERVE,()=>{mode='play';then()})}
  playScene(f==='stale'?STALE:FAIL,()=>{mode='play';dlg(f==='stale'?'A stalemate':'Bitcoin fails',f==='stale'?'Adoption stands at '+Math.floor(G.adopt)+'%. The world did not choose. It can still be pushed past 60%, and the next time MANDATE falls the story will be told again.':'Adoption stands at '+Math.floor(G.adopt)+'%. Nonce’s stall is nearly bare and prices climb faster than ever. The network can be relit, node by node and conversation by conversation, and the next time MANDATE falls the story will be told again.',[['Continue',then]])})}
