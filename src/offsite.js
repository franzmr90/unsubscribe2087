/* All-Hands. The cabinet in the back of the Simulator.
   A share price, a delisting, four fighters, one order book.
   Nothing here calls hit, hurt, or pdmg, and nothing here pays. */
const AH_IDS=['scrapper','hacker','courier','anon'];
const AH_WHO={
  scrapper:{n:'Scrapper',col:'#d9822b',ink:'#2a160c',weight:118,run:1,air:1,final:'Call the Strike'},
  hacker:{n:'Technomancer',col:'#9a6cff',ink:'#1a1030',weight:78,run:1.05,air:2,final:'Black Storm'},
  courier:{n:'Runner',col:'#3fbf8f',ink:'#06281c',weight:72,run:1.3,air:2,final:'Missed Connection'},
  anon:{n:'Anon',col:'#8d8d9c',ink:'#14141c',weight:86,run:1.15,air:2,final:'We Were Never Here'}
};
/* Prints are the cabinet's flat numbers, not weapon percents.
   dir n/s/u/d. self is a velocity applied to the caster. proj flies.
   zone stays on the floor. reach is the close hit, in stage pixels. */
const AH_SPEC={
  scrapper:{
    n:{print:6,kBase:40,kGrowth:.55,ang:.6,reach:70,cd:1.1,t:.35},
    s:{print:7,kBase:55,kGrowth:.7,ang:.15,proj:1,spd:520,cd:.7,t:.3},
    u:{print:4,kBase:36,kGrowth:.5,ang:1.2,reach:48,selfVy:-820,selfVx:80,cd:1.6,t:.45,late:{print:11,kBase:80,kGrowth:1,ang:-.4,reach:56}},
    d:{print:0,zone:1,cd:2.2,t:.25,shed:3,life:3.2}
  },
  hacker:{
    n:{print:6,kBase:34,kGrowth:.5,ang:.5,reach:210,cd:.85,t:.28},
    s:{print:8,kBase:60,kGrowth:.75,ang:.08,proj:1,spd:680,cd:.55,t:.22},
    u:{print:9,kBase:70,kGrowth:.8,ang:1.15,reach:40,selfVy:-860,selfVx:40,cd:1.5,t:.35},
    d:{print:3,zone:1,cd:1.4,t:.3,life:2,tick:.5}
  },
  courier:{
    n:{print:10,kBase:64,kGrowth:.85,ang:.2,reach:46,cd:1,t:.28,mark:1},
    s:{print:5,kBase:40,kGrowth:.55,ang:.1,proj:1,spd:480,ret:1,cd:.7,t:.25},
    u:{print:8,kBase:50,kGrowth:.6,ang:1.05,reach:36,selfVy:-900,selfVx:160,cd:1.3,t:.4},
    d:{print:2,zone:1,cd:1.6,t:.22,life:3,slow:1}
  },
  anon:{
    n:{print:12,kBase:78,kGrowth:.9,ang:.35,mine:1,cd:1.3,t:.2},
    s:{print:5,kBase:36,kGrowth:.5,ang:.12,proj:1,spd:360,burst:1,cd:.9,t:.25},
    u:{print:0,mark:1,cd:1.4,t:.15},
    d:{print:10,kBase:60,kGrowth:.7,ang:.8,lure:1,cd:1.8,t:.3,reach:80}
  }
};
const AH_JAB={print:4,kBase:28,kGrowth:.42,ang:.22,reach:44,t:.26,hit:.1,cd:.32};
let AH=null;
let ahKeys={};

function ahBody(kit,x,human,slot){
  const w=AH_WHO[kit];
  return {kit,slot,human:human?1:0,face:x<480?1:-1,x,y:180,vx:0,vy:0,w:28,
    stocks:3,price:0,weight:w.weight,air:w.air,jumps:w.air,ground:0,
    spawn:{x:x,y:150},alive:1,inv:1.2,hitstun:0,stun:0,meter:0,
    cd:{jab:0,n:0,s:0,u:0,d:0,dodge:0},move:null,dodgeT:-1,guard:0,
    take:null,mark:0,nipped:0,flash:0,ko:0};
}
function ahFloor(){
  const cols=AH.cols||[];
  return [{x:40,y:OFFSITE.floorY,w:960}].concat(cols);
}
function ahEnsure(){
  G.offsite=G.offsite||{played:0,wins:{},page:0,attended:0,nipperSeen:0};
  return G.offsite;
}
function offsiteMemo(){
  const o=G&&G.offsite;
  if(!o||!o.page)return '';
  return '<div class="memo"><b>Minutes of the offsite</b><p>The cabinet in the back of the rig still thinks a meeting can be won. The minutes blame whoever left the book. Nothing in there was real, so nothing was paid. Something lower than the floor crossed once. Gramps would not have looked up. He would have said: dog.</p></div>';
}
function offsiteName(){return G&&G.offsite&&G.offsite.attended?'Attended':'';}

function offsiteOpen(){
  if(!G)return;
  ahEnsure();
  ahCss();
  const mine=AH_IDS.indexOf(G.cls)>=0?G.cls:'scrapper';
  const other=AH_IDS[(AH_IDS.indexOf(mine)+1)%AH_IDS.length];
  AH={phase:'pick',p1:mine,p2:other,bot:1,t:0,bodies:[],projs:[],zones:[],sparks:[],
    cols:[],nip:null,nipDone:0,line:'',lineT:0,prev:'play',sats:G.sats|0,xp:G.xp||0,cr:G.credits||0};
  mode='offsite';
  const hud=$('hud');if(hud)hud.hidden=true;
  ahShow();
  ahLine('The cabinet in the back. Nothing in here is real.');
}
function offsiteClose(){
  if(AH&&G){const o=ahEnsure();if((o.played|0)===0)o.played=0}
  AH=null;mode='play';
  const hud=$('hud'),el=$('offHud');
  if(el)el.hidden=true;
  if(hud&&W&&P)hud.hidden=false;
  J.x=J.y=0;
}
function offsiteBegin(opt){
  opt=opt||{};
  if(!AH)offsiteOpen();
  const p1=AH_IDS.indexOf(opt.p1)>=0?opt.p1:AH.p1;
  const p2=AH_IDS.indexOf(opt.p2)>=0?opt.p2:AH.p2;
  const bot=opt.bot!=null?opt.bot?1:0:AH.bot?1:0;
  AH.p1=p1;AH.p2=p2;AH.bot=bot;
  AH.bodies=[ahBody(p1,280,1,0),ahBody(p2,700,bot?0:1,1)];
  AH.bodies[1].face=-1;
  AH.projs=[];AH.zones=[];AH.sparks=[];
  AH.cols=[0,1,2,3].map(i=>({x:150+i*190,y:292,w:120,gone:0,ph:i*1.3}));
  AH.nip=null;AH.nipDone=0;AH.t=0;AH.phase='fight';AH.winner=null;AH.hold=1.15;
  ahEnsure().played=(ahEnsure().played|0)+1;
  ahShow();
}
function offsiteState(){
  if(!AH)return null;
  return {phase:AH.phase,p1:AH.p1,p2:AH.p2,bot:AH.bot,
    bodies:(AH.bodies||[]).map(b=>({kit:b.kit,stocks:b.stocks,price:Math.round(b.price),x:Math.round(b.x),y:Math.round(b.y),alive:b.alive,human:b.human})),
    page:G&&G.offsite&&G.offsite.page||0,attended:G&&G.offsite&&G.offsite.attended||0,
    sats:G?G.sats|0:0};
}

function ahLine(s){if(!AH)return;AH.line=s;AH.lineT=2.4}
function ahSpark(x,y,col,n){
  if(!AH)return;
  for(let i=0;i<n;i++){
    if(AH.sparks.length>40)AH.sparks.shift();
    const a=Math.random()*6.28,sp=40+Math.random()*160;
    AH.sparks.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-40,t:0,life:.35+Math.random()*.2,col:col||'#ffe7b0'});
  }
}
function ahHit(att,def,spec,ang){
  if(!def||!def.alive||def.inv>0)return;
  if(def.dodgeT>=0&&def.dodgeT<.12){
    att.hitstun=.28;att.vx=-att.face*180;att.vy=-80;
    ahLine('Parked.');ahSpark(def.x,def.y-20,'#ffe7b0',4);return;
  }
  let print=spec.print||0,kBase=spec.kBase==null?30:spec.kBase,kGrowth=spec.kGrowth==null?.45:spec.kGrowth;
  if(def.guard){print=Math.max(1,print*.25);kBase*=.35;def.price+=0}
  if(att.mark&&def===att.markWho)print+=2;
  const k=offsiteKnock({price:def.price,print,kBase,kGrowth,weight:def.weight,angle:ang!=null?ang:(spec.ang||.2),facing:att.face||1,di:ahDi(def)});
  def.price=k.price;def.vx=k.vx;def.vy=k.vy;def.hitstun=k.hitstun;def.ground=0;def.flash=.15;
  if(att.mark){/* Signed For sticks on them */}
  att.meter=Math.min(100,(att.meter||0)+print*1.35);
  ahSpark(def.x,def.y-24,AH_WHO[att.kit].col,5);
}
function ahDi(b){
  const inp=b._inp;if(!inp)return 0;
  return Math.max(-18,Math.min(18,(-inp.y)*18));
}
function ahMove(b,kind){
  const kit=b.take&&b.take.t>0?b.take.kit:b.kit;
  if(kind==='jab'||kind==='air'||kind==='dash')return Object.assign({kind},AH_JAB,kind==='dash'?{print:7,reach:52,kBase:40}:{print:kind==='air'?5:AH_JAB.print});
  return Object.assign({kind},AH_SPEC[kit][kind]||AH_SPEC[kit].n);
}
function ahStart(b,kind){
  const m=ahMove(b,kind);
  if((b.cd[kind]||0)>0)return;
  b.move={k:kind,t:0,len:m.t||.28,hit:m.hit==null?.1:m.hit,done:0,m,late:0};
  b.cd[kind]=m.cd||.4;
  if(m.selfVy){b.vy=m.selfVy;b.ground=0;b.vx=(b.face||1)*(m.selfVx||0)}
  if(m.proj)AH.projs.push({x:b.x+b.face*20,y:b.y-28,vx:b.face*(m.spd||480),vy:0,life:m.ret?0.9:0.55,r:12,m,own:b,back:0});
  if(m.mine)AH.zones.push({x:b.x+b.face*36,y:OFFSITE.floorY,r:16,life:6,m,own:b,k:'mine',arm:.35});
  if(m.zone)AH.zones.push({x:b.x,y:OFFSITE.floorY,r:46,life:m.life||2.4,m,own:b,k:'zone',tick:0});
  if(m.lure)AH.zones.push({x:b.x+b.face*50,y:OFFSITE.floorY,r:40,life:2.2,m,own:b,k:'lure'});
  if(m.mark&&kind==='u'){b.drop={x:b.x,y:b.y-10,life:4}}
  if(kind==='n'&&m.mark){/* Signed For: the next hit prints extra, stored on the foe later */}
}
function ahFinal(b,foe){
  if(b.meter<100||!foe||!foe.alive)return;
  b.meter=0;
  const who=AH_WHO[b.kit];
  b.take={kit:foe.kit,t:4,w:b.weight};
  b.weight=AH_WHO[foe.kit].weight;
  foe.stun=1.15;
  ahHit(b,foe,{print:8,kBase:70,kGrowth:.8,ang:.9},.9);
  ahLine(who.final+'.');
  if(b.kit==='scrapper'){foe.vx=(b.x-foe.x)*1.4;foe.vy-=120}
  if(b.kit==='hacker')AH.zones.push({x:foe.x,y:foe.y,r:50,life:2,m:{print:6,kBase:40,kGrowth:.5,ang:1.1},own:b,k:'storm',tick:0});
  if(b.kit==='courier')foe.miss=4;
  if(b.kit==='anon')b.inv=Math.max(b.inv,1.5);
  ahSpark(b.x,b.y-30,'#ffe7b0',10);
}
function ahConnect(b){
  const mv=b.move;if(!mv||mv.done)return;
  if(mv.t<mv.hit)return;
  const m=mv.m,foe=AH.bodies.find(o=>o!==b&&o.alive);
  if(!foe){mv.done=1;return}
  const reach=m.reach||44;
  const dx=foe.x-b.x,dy=(foe.y-28)-(b.y-28);
  const front=m.kind==='n'&&b.kit==='hacker'?1:dx*b.face> -8;
  if(front&&Math.abs(dx)<reach&&Math.abs(dy)<40){
    let ang=m.ang;
    if(mv.k==='u'&&m.late&&mv.t>mv.len*.55){ang=m.late.ang;Object.assign(m,m.late)}
    if(mv.k==='n'&&AH_SPEC[b.take&&b.take.t>0?b.take.kit:b.kit].n.mark){b.mark=1;b.markWho=foe;foe.flash=.2}
    ahHit(b,foe,m,ang);
    mv.done=1;
  }
}
function ahZones(dt){
  for(const z of AH.zones){
    z.life-=dt;if(z.arm>0)z.arm-=dt;
    z.tick=(z.tick||0)-dt;
    for(const b of AH.bodies){
      if(!b.alive||b===z.own&&z.k!=='zone')continue;
      if(Math.abs(b.x-z.x)>z.r||Math.abs(b.y-z.y)>36)continue;
      if(z.k==='mine'&&z.arm<=0){ahHit(z.own,b,z.m,.6);z.life=0;ahSpark(z.x,z.y-10,'#e6e2d6',8)}
      if(z.k==='lure'&&b!==z.own){b.vx+=(z.x-b.x)*2;if(z.life<1.4&&!z.blew){z.blew=1;ahHit(z.own,b,z.m,.7)}}
      if((z.k==='zone'||z.k==='storm')&&z.tick<=0&&b!==z.own){ahHit(z.own,b,z.m,.4);z.tick=z.m.tick||.45}
      if(z.k==='zone'&&z.m.shed&&Math.abs(b.x-z.x)<z.r)b.price=Math.max(0,b.price-z.m.shed*dt);
    }
  }
  AH.zones=AH.zones.filter(z=>z.life>0);
}
function ahProjs(dt){
  for(const p of AH.projs){
    p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;
    if(p.m.ret&&!p.back&&p.life<.45){p.vx*=-1;p.back=1;p.life+=.4}
    for(const b of AH.bodies){
      if(b===p.own||!b.alive||b.inv>0)continue;
      if(Math.hypot(b.x-p.x,(b.y-24)-p.y)<b.w+p.r){
        ahHit(p.own,b,p.m,p.m.ang||.15);
        if(p.m.burst&&!p.burst){p.burst=1;p.life=.3;p.vx=0;for(let i=0;i<3;i++)AH.projs.push({x:p.x,y:p.y,vx:(i-1)*180,vy:-80-i*20,life:.35,r:8,m:{print:4,kBase:24,kGrowth:.4,ang:.2},own:p.own})}
        else p.life=0;
      }
    }
  }
  AH.projs=AH.projs.filter(p=>p.life>0&&p.x>-120&&p.x<1080);
}
function ahNipper(dt){
  if(AH.nipDone)return;
  if(!AH.nip){if(AH.t<8)return;AH.nip={x:-30,y:OFFSITE.floorY-2,vx:340,t:0,hit:0}}
  const n=AH.nip;n.t+=dt;n.x+=n.vx*dt;
  for(const b of AH.bodies){
    if(!b.alive)continue;
    if(!n.hit&&b.move&&!b.move.done&&Math.abs(b.x-n.x)<28&&Math.abs(b.y-n.y)<30){
      n.hit=1;n.vy=-80;ahLine('A one-sat fine. The rig voided it.');
    }
    if(!b.nipped&&Math.abs(b.x-n.x)<22&&b.price>=80){b.nipped=1;b.price=Math.max(0,b.price-1);ahLine('The Nipper took the last point.');}
  }
  if(n.x>1000){AH.nipDone=1;AH.nip=null;const o=ahEnsure();o.nipperSeen=(o.nipperSeen|0)+1}
}
function ahCols(dt){
  AH.colT=(AH.colT||2.8)-dt;
  if(AH.colT<=0){AH.colT=3.4;const c=AH.cols[AH.colI++%AH.cols.length];if(c){c.gone=1.5;ahLine('A bid was pulled.')}}
  for(const c of AH.cols)if(c.gone>0)c.gone=Math.max(0,c.gone-dt);
}
function ahInput(b){
  if(!b.human)return ahBot(b);
  const p=b.slot===0;
  const L=k=>keys[k]?1:0;
  let x=0,y=0;
  if(p){if(L('KeyA'))x-=1;if(L('KeyD'))x+=1;if(L('KeyW'))y-=1;if(L('KeyS'))y+=1}
  else{if(L('ArrowLeft'))x-=1;if(L('ArrowRight'))x+=1;if(L('ArrowUp'))y-=1;if(L('ArrowDown'))y+=1}
  if(p&&typeof uiTouch==='function'&&uiTouch()){x=x||J.x;y=y||J.y}
  const jump=p?(L('Space')||ahKeys.jump):(L('ShiftRight')||0);
  const atk=p?(L('KeyJ')||ahKeys.atk):(L('KeyL')||0);
  const spec=p?(L('KeyK')||ahKeys.spec):(L('Semicolon')||0);
  const dodge=p?(L('ShiftLeft')||ahKeys.dodge):(L('ControlRight')||0);
  return {x:Math.max(-1,Math.min(1,x)),y:Math.max(-1,Math.min(1,y)),jump,atk,spec,dodge};
}
function ahBot(b){
  const foe=AH.bodies.find(o=>o!==b&&o.alive)||b;
  const dx=foe.x-b.x;
  const x=Math.abs(dx)<36?0:Math.sign(dx);
  let jump=0,atk=0,spec=0;
  if(Math.abs(dx)<52&&Math.abs(b.y-foe.y)<48)atk=1;
  else if(Math.abs(dx)>80&&Math.abs(dx)<200&&b.cd.s<=0)spec=1;
  if(b.ground&&foe.y<b.y-70)jump=1;
  const under=AH.cols.find(c=>c.gone&&b.x>c.x&&b.x<c.x+c.w&&b.y>c.y-8);
  if(under&&b.ground)jump=1;
  return {x,y:0,jump,atk,spec,dodge:0};
}
function ahEdge(now,prev){return now&&!prev}
function ahControl(b,dt){
  const inp=ahInput(b);b._inp=inp;
  const prev=b._prev||{};
  b._prev={jump:inp.jump,atk:inp.atk,spec:inp.spec,dodge:inp.dodge};
  for(const k in b.cd)b.cd[k]=Math.max(0,b.cd[k]-dt);
  if(b.take){b.take.t-=dt;if(b.take.t<=0){b.weight=b.take.w;b.take=null}}
  if(b.miss>0)b.miss-=dt;
  if(b.drop){b.drop.life-=dt;if(b.drop.life<=0)b.drop=null}
  if(b.stun>0||b.hitstun>0){b.dodgeT=-1;return}
  if(ahEdge(inp.dodge,prev.dodge)&&b.cd.dodge<=0){b.dodgeT=0;b.cd.dodge=1.1;b.guard=0}
  if(b.dodgeT>=0){b.dodgeT+=dt;if(inp.dodge&&b.dodgeT>.12)b.guard=1;else b.guard=0;if(!inp.dodge&&b.dodgeT>.12)b.dodgeT=-1;if(b.dodgeT>0.7){b.dodgeT=-1;b.guard=0}}
  else b.guard=0;
  if(b.guard){b.price+=4*dt;b.vx*=.5;return}
  if(ahEdge(inp.jump,prev.jump)&&b.jumps>0){b.vy=-700;b.jumps--;b.ground=0;b.hop=1}
  if(b.hop&&!inp.jump&&b.vy<0){b.vy*=.45;b.hop=0}
  if(b.ground)b.hop=0;
  if(b.hitstun<=0){
    const sp=250*AH_WHO[b.kit].run;
    if(Math.abs(inp.x)>.2){b.vx=inp.x*sp;b.face=inp.x<0?-1:1}
    else if(b.ground)b.vx*=.6;
  }
  if(b.drop&&ahEdge(inp.spec,prev.spec)&&Math.hypot(b.x-b.drop.x,b.y-b.drop.y)<520){
    b.x=b.drop.x;b.y=b.drop.y;b.vx=0;b.vy=-40;b.drop=null;return;
  }
  const dir=Math.abs(inp.y)>.55?(inp.y<0?'u':'d'):Math.abs(inp.x)>.4?'s':'n';
  if(ahEdge(inp.spec,prev.spec)){
    if(dir==='n'&&b.meter>=100)ahFinal(b,AH.bodies.find(o=>o!==b&&o.alive));
    else ahStart(b,dir);
  }
  if(ahEdge(inp.atk,prev.atk)&&b.cd.jab<=0){
    const kind=!b.ground?'air':Math.abs(b.vx)>160?'dash':'jab';
    ahStart(b,kind);
    if(kind==='dash')b.vx=b.face*380;
  }
}
function ahWin(b){
  AH.phase='done';AH.winner=b;
  const loser=AH.bodies.find(o=>o!==b)||b;
  const o=ahEnsure();
  if(b.human){o.page=1;o.attended=1;o.wins[b.kit]=(o.wins[b.kit]||0)+1;if(typeof save==='function')save(true)}
  AH.blame=AH_WHO[loser.kit].n;
  ahShow();
}
function offsiteTick(dt){
  if(!AH)return;
  dt=Math.max(0,Math.min(.033,dt||0));
  if(AH.lineT>0)AH.lineT-=dt;
  if(AH.phase==='pick'){ahPickKeys();return}
  if(AH.phase!=='fight')return;
  AH.t+=dt;
  if(AH.hold>0){AH.hold-=dt;for(const b of AH.bodies)offsiteStep(b,dt,ahFloor());return}
  ahCols(dt);
  for(const b of AH.bodies)if(b.alive){
    ahControl(b,dt);
    if(b.move){b.move.t+=dt;ahConnect(b);if(b.move.t>b.move.len)b.move=null}
    if(b.flash>0)b.flash-=dt;
    const before=b.stocks;
    offsiteStep(b,dt,ahFloor());
    if(b.ground)b.jumps=b.air;
    if(b.stocks<before){b.ko=.45;ahSpark(b.spawn.x,OFFSITE.floorY-20,'#ff5a4d',14);if(b.miss>0){const a=AH.bodies.find(o=>o!==b);if(a)ahLine('Missed connection.')}}
    if(b.stocks<=0){const other=AH.bodies.find(o=>o!==b&&o.stocks>0);if(other)ahWin(other)}
  }
  ahZones(dt);ahProjs(dt);ahNipper(dt);
  for(const s of AH.sparks){s.t+=dt;s.x+=s.vx*dt;s.y+=s.vy*dt;s.vy+=400*dt}
  AH.sparks=AH.sparks.filter(s=>s.t<s.life);
  if(keys.Escape&&!AH.esc)offsiteClose();
  AH.esc=keys.Escape?1:0;
}
function ahPickKeys(){
  const tap=(code,fn)=>{if(keys[code]&&!AH.pk[code])fn();};
  AH.pk=AH.pk||{};
  const cyc=(cur,d)=>{const i=AH_IDS.indexOf(cur);return AH_IDS[(i+d+AH_IDS.length)%AH_IDS.length]};
  tap('KeyA',()=>{AH.p1=cyc(AH.p1,-1)});
  tap('KeyD',()=>{AH.p1=cyc(AH.p1,1)});
  tap('ArrowLeft',()=>{if(AH.bot)AH.bot=0;else{const i=AH_IDS.indexOf(AH.p2);if(i<=0)AH.bot=1;else AH.p2=AH_IDS[i-1]}});
  tap('ArrowRight',()=>{if(AH.bot){AH.bot=0}else AH.p2=cyc(AH.p2,1)});
  tap('Enter',()=>offsiteBegin({}));
  tap('Space',()=>offsiteBegin({}));
  if(keys.Escape&&!AH.esc)offsiteClose();
  AH.esc=keys.Escape?1:0;
  for(const k of['KeyA','KeyD','ArrowLeft','ArrowRight','Enter','Space'])AH.pk[k]=keys[k]?1:0;
}

function ahView(){
  const touch=typeof uiTouch==='function'&&uiTouch();
  const pad=touch?170/ZM:36/ZM;
  const s=Math.min(VW/960,(VH-pad)/540);
  return {s,ox:(VW-960*s)/2,oy:Math.max(8,(VH-pad-540*s)/2)};
}
function offsiteDraw(){
  if(!AH||!ctx)return;
  ctx.setTransform(DPR*ZM,0,0,DPR*ZM,0,0);
  ctx.fillStyle='#07060d';ctx.fillRect(0,0,VW,VH);
  if(AH.phase==='pick'||AH.phase==='done'){ahDrawCard();return}
  const v=ahView();
  ctx.save();ctx.translate(v.ox,v.oy);ctx.scale(v.s,v.s);
  ahDrawBook();
  for(const z of AH.zones)ahDrawZone(z);
  for(const p of AH.projs){ctx.fillStyle='#e6e2d6';ctx.fillRect(p.x-4,p.y-4,8,8)}
  if(AH.nip)ahDrawNip(AH.nip);
  for(const b of AH.bodies)if(b.alive||b.ko>0)ahDrawFighter(b);
  for(const s of AH.sparks){ctx.globalAlpha=Math.max(0,1-s.t/s.life);ctx.fillStyle=s.col;ctx.fillRect(s.x,s.y,3,3);ctx.globalAlpha=1}
  ctx.restore();
  ahDrawPrices(v);
  if(AH.hold>0){ctx.fillStyle='#e0bd6e';ctx.font='700 22px Cinzel,serif';ctx.textAlign='center';ctx.fillText('MANDATORY FUN',VW/2,v.oy+28)}
  if(AH.lineT>0){ctx.fillStyle='#e6e2d6';ctx.font='14px Source Sans 3,sans-serif';ctx.textAlign='center';ctx.fillText(AH.line,VW/2,VH-18)}
}
function ahDrawBook(){
  const t=AH.t||0;
  ctx.fillStyle='#100c18';ctx.fillRect(0,0,960,540);
  for(let i=0;i<8;i++){ctx.globalAlpha=.18;ctx.fillStyle=i%2?'#1c1430':'#241838';ctx.fillRect(0,40+i*28+Math.sin(t*.4+i)*6,960,10);ctx.globalAlpha=1}
  ctx.fillStyle='#1a120c';ctx.fillRect(0,OFFSITE.floorY,960,540-OFFSITE.floorY);
  ctx.fillStyle='#3a2a18';ctx.fillRect(40,OFFSITE.floorY,960,8);
  for(const c of AH.cols){
    const h=c.gone?Math.max(8,70*(1-c.gone))*0+8:78;
    const y=c.gone?OFFSITE.floorY-8:c.y;
    ctx.fillStyle=c.gone?'#3a2030':'#2a6b4a';
    ctx.fillRect(c.x,y,c.w,c.gone?8:OFFSITE.floorY-c.y);
    ctx.fillStyle=c.gone?'#ff5a4d':'#7dcea0';
    ctx.fillRect(c.x,y,c.w,6);
  }
  ctx.fillStyle='rgba(255,90,77,.35)';
  ctx.fillRect(0,0,36,540);ctx.fillRect(924,0,36,540);
  ctx.fillStyle='#8a8478';ctx.font='12px Source Sans 3,sans-serif';ctx.textAlign='left';
  ctx.fillText('THE BOOK',16,22);
}
function ahDrawFighter(b){
  const w=AH_WHO[b.kit],x=b.x,y=b.y;
  ctx.save();ctx.translate(x,y);ctx.scale(b.face||1,1);
  if(b.flash>0){ctx.fillStyle='#fff';ctx.globalAlpha=.8}
  else ctx.fillStyle=w.col;
  ctx.fillRect(-12,-40,24,36);
  ctx.fillStyle=w.ink;ctx.fillRect(-8,-36,16,10);
  if(b.kit==='scrapper'){ctx.fillStyle='#c9a184';ctx.fillRect(6,-34,16,12)}
  if(b.kit==='hacker'){ctx.strokeStyle='#59e0e6';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(8,-28);ctx.lineTo(22,-18);ctx.stroke()}
  if(b.kit==='courier'){ctx.fillStyle='#e6e2d6';ctx.fillRect(8,-26,14,3)}
  if(b.kit==='anon'){ctx.fillStyle='#14141c';ctx.fillRect(-10,-42,20,8)}
  if(b.guard){ctx.strokeStyle='#e0bd6e';ctx.strokeRect(-16,-44,32,42)}
  if(b.take&&b.take.t>0){ctx.strokeStyle='#ff5a4d';ctx.strokeRect(-18,-48,36,48)}
  ctx.restore();
  if(b.ko>0){b.ko-=1/60;ctx.strokeStyle='#ff5a4d';ctx.globalAlpha=Math.max(0,b.ko*2);ctx.beginPath();ctx.arc(x,y-20,20+ (1-b.ko)*30,0,6.28);ctx.stroke();ctx.globalAlpha=1}
}
function ahDrawZone(z){
  ctx.globalAlpha=.35;ctx.fillStyle=z.k==='mine'?'#e6e2d6':z.k==='storm'?'#9a6cff':'#d9822b';
  ctx.beginPath();ctx.ellipse(z.x,z.y,z.r,10,0,0,6.28);ctx.fill();ctx.globalAlpha=1;
}
function ahDrawNip(n){
  ctx.save();ctx.translate(n.x,n.y);
  ctx.strokeStyle='#c8a55a';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,-1,14,.2,2.9);ctx.stroke();
  ctx.fillStyle='rgba(89,224,230,.85)';ctx.fillRect(-8,-3,16,3);
  ctx.strokeStyle='#8a8478';ctx.lineWidth=1.2;
  for(let i=0;i<8;i++){const lx=-11+i*3.1,lift=Math.sin(n.t*18+i)*3;ctx.beginPath();ctx.moveTo(lx,2);ctx.lineTo(lx+(i-3.5)*.5,10+lift);ctx.stroke()}
  ctx.restore();
}
function ahDrawPrices(v){
  ctx.textAlign='center';ctx.font='700 28px Cinzel,serif';
  AH.bodies.forEach((b,i)=>{
    const p=ahView();
    const x=p.ox+b.x*p.s,y=p.oy+(b.y-58)*p.s;
    ctx.fillStyle=b.price>=100?'#ff5a4d':'#e0bd6e';
    ctx.fillText(String(Math.round(b.price)),x,y);
    ctx.font='11px Source Sans 3,sans-serif';ctx.fillStyle='#8a8478';
    ctx.fillText(AH_WHO[b.kit].n+' · '+b.stocks,x,y+14);
    ctx.font='700 28px Cinzel,serif';
    const mx=i?VW-70:70;
    ctx.fillStyle='#1a120c';ctx.fillRect(mx-30,16,60,8);
    ctx.fillStyle=b.meter>=100?'#ff5a4d':'#e0bd6e';ctx.fillRect(mx-30,16,60*Math.min(1,b.meter/100),8);
  });
}
function ahDrawCard(){
  ctx.fillStyle='#e6e2d6';ctx.textAlign='center';
  if(AH.phase==='done'){
    const w=AH.winner?AH_WHO[AH.winner.kit].n:'Nobody';
    ctx.font='700 28px Cinzel,serif';ctx.fillStyle='#e0bd6e';ctx.fillText(w+' keeps the room',VW/2,VH*.36);
    ctx.font='16px Source Sans 3,sans-serif';ctx.fillStyle='#e6e2d6';
    ctx.fillText('The minutes blame '+AH.blame+'.',VW/2,VH*.36+36);
    if(AH.winner&&AH.winner.human)ctx.fillText('Filed in the Codex. The nameplate says Attended.',VW/2,VH*.36+64);
    else ctx.fillText('A bot does not get a nameplate.',VW/2,VH*.36+64);
    return;
  }
  ctx.font='700 26px Cinzel,serif';ctx.fillStyle='#e0bd6e';ctx.fillText('MANDATORY FUN',VW/2,VH*.22);
  ctx.font='15px Source Sans 3,sans-serif';ctx.fillStyle='#e6e2d6';
  ctx.fillText('All-Hands. The percent is a share price. Past 100, you are overvalued.',VW/2,VH*.22+32);
  ctx.fillText(AH_WHO[AH.p1].n+'  ·  '+(AH.bot?'a bot wearing '+AH_WHO[AH.p2].n:AH_WHO[AH.p2].n),VW/2,VH*.22+64);
  ctx.fillStyle='#8a8478';ctx.font='13px Source Sans 3,sans-serif';
  ctx.fillText('P1: A D, J attack, K special, Space jump, Shift dodge. Special with a direction.',VW/2,VH*.62);
  ctx.fillText('P2: arrows, L attack, ; special, right Shift jump. The stick never jumps.',VW/2,VH*.62+20);
}
function ahShow(){
  ahCss();
  let el=$('offHud');
  if(!el){
    el=document.createElement('div');el.id='offHud';
    el.innerHTML='<div class="offPick"></div><div class="offPad" hidden><div id="offStick"><i></i></div><button type="button" data-ah="jump">JUMP</button><button type="button" data-ah="atk">ATTACK</button><button type="button" data-ah="spec">SPECIAL</button><button type="button" data-ah="dodge">DODGE</button></div>';
    const app=$('app')||document.body;app.appendChild(el);
    el.addEventListener('pointerdown',ahPtr);
    const st=$('offStick');
    st.addEventListener('pointerdown',ahStickDown);
    st.addEventListener('pointermove',ahStickMove);
    st.addEventListener('pointerup',ahStickUp);
    st.addEventListener('pointercancel',ahStickUp);
  }
  el.hidden=false;
  const pick=el.querySelector('.offPick'),pad=el.querySelector('.offPad');
  const touch=typeof uiTouch==='function'&&uiTouch();
  if(!AH||AH.phase==='fight'){
    pick.hidden=true;pick.innerHTML='';
    pad.hidden=touch?false:true;
  }else{
    pad.hidden=true;
    pick.hidden=false;
    const bits=[];
    if(AH.phase==='pick'){
      for(const id of AH_IDS)bits.push('<button type="button" data-p1="'+id+'" class="'+(AH.p1===id?'on':'')+'">'+AH_WHO[id].n+'</button>');
      bits.push('<button type="button" data-bot="1" class="'+(AH.bot?'on':'')+'">Bot</button>');
      for(const id of AH_IDS)bits.push('<button type="button" data-p2="'+id+'" class="'+(!AH.bot&&AH.p2===id?'on':'')+'">'+AH_WHO[id].n+'</button>');
      bits.push('<button type="button" data-go="1" class="go">Start</button><button type="button" data-leave="1">Leave</button>');
    }else bits.push('<button type="button" data-leave="1" class="go">Back to the rig</button>');
    pick.innerHTML=bits.join('');
  }
}
function ahPtr(e){
  const b=e.target.closest&&e.target.closest('button');if(!b||!AH)return;
  e.preventDefault();
  const d=b.dataset;
  if(d.p1)AH.p1=d.p1;
  if(d.p2){AH.bot=0;AH.p2=d.p2}
  if(d.bot)AH.bot=AH.bot?0:1;
  if(d.go)offsiteBegin({});
  if(d.leave)offsiteClose();
  if(d.ah){ahKeys[d.ah]=1;b.setPointerCapture&&b.setPointerCapture(e.pointerId);b.addEventListener('pointerup',()=>{ahKeys[d.ah]=0},{once:true});b.addEventListener('pointercancel',()=>{ahKeys[d.ah]=0},{once:true})}
  ahShow();
}
let ahSid=null,ahSo=null;
function ahStickDown(e){ahSid=e.pointerId;ahSo={x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId);e.preventDefault()}
function ahStickMove(e){if(e.pointerId!==ahSid||!ahSo)return;let dx=e.clientX-ahSo.x,dy=e.clientY-ahSo.y;const l=Math.hypot(dx,dy),m=46;if(l>m){dx*=m/l;dy*=m/l}J.x=dx/m;J.y=dy/m;const i=e.currentTarget.querySelector('i');if(i)i.style.transform='translate('+(dx)+'px,'+(dy)+'px)'}
function ahStickUp(e){if(e.pointerId!==ahSid)return;ahSid=null;J.x=J.y=0;const i=e.currentTarget.querySelector('i');if(i)i.style.transform=''}
function ahCss(){
  if(document.getElementById('offCss'))return;
  const s=document.createElement('style');s.id='offCss';
  s.textContent='#offHud{position:absolute;inset:0;z-index:7;pointer-events:none}#offHud button{pointer-events:auto;font:700 12px Cinzel,serif;color:#e6e2d6;background:#141018;border:1px solid #e0bd6e;border-radius:8px;padding:10px 12px;min-height:44px}#offHud button.on{background:#e0bd6e;color:#141018}#offHud .offPick{position:absolute;left:0;right:0;bottom:10px;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;padding:8px}#offHud .offPad{position:absolute;right:8px;bottom:10px;display:grid;grid-template-columns:74px 74px;gap:8px}#offHud .offPad button{width:74px;height:74px;border-radius:37px;padding:0}#offStick{position:absolute;left:16px;bottom:18px;width:112px;height:112px;border-radius:56px;border:2px solid rgba(224,189,110,.55);pointer-events:auto;touch-action:none}#offStick i{position:absolute;left:40px;top:40px;width:28px;height:28px;border-radius:14px;background:#e0bd6e}';
  document.head.appendChild(s);
}

/* A scripted smash, used by the ring-out test. Same step the match uses. */
function offsiteScript(){
  offsiteBegin({p1:'courier',p2:'scrapper',bot:0});
  AH.hold=0;AH.t=9;
  const floor=[{x:40,y:OFFSITE.floorY,w:960}];
  const out={};
  for(const b of AH.bodies){
    b.x=700;b.y=400;b.ground=0;b.price=80;b.stocks=3;b.inv=0;
    const k=offsiteKnock({price:80,print:14,kBase:110,kGrowth:1.3,weight:b.weight,angle:.35,facing:1});
    b.price=k.price;b.vx=k.vx;b.vy=k.vy;b.hitstun=k.hitstun;
    let saw=0;
    for(let i=0;i<120&&!saw;i++){const r=offsiteStep(b,1/60,floor);if(r.out)saw=1}
    out[b.kit]={stocks:b.stocks,out:saw,x:Math.round(b.x)};
  }
  return out;
}
function offsiteForce(slot){
  if(!AH||AH.phase!=='fight')offsiteBegin({});
  const win=AH.bodies[slot?1:0],lose=AH.bodies[slot?0:1];
  lose.stocks=0;lose.alive=0;ahWin(win);
  return offsiteState();
}

if(typeof window!=='undefined'){const put=()=>{if(!window.__g)return;Object.assign(window.__g,{offsiteKnock,offsiteOut,offsiteStep,OFFSITE,offsiteOpen,offsiteClose,offsiteBegin,offsiteState,offsiteScript,offsiteForce,offsiteMemo,offsiteName})};put();addEventListener('load',put);}
