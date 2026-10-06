/* V3 lasting states. node tools/v3-check.js
   Sets each state through __g, asserts the mark or patch, and asserts the
   announcement toast does not fire. A refused cast still toasts. A fake
   MP.others entry with au set must draw that aura's patch. */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const shot=process.env.V3_SHOT||'/opt/cursor/artifacts/v3_aura_marks.png';

async function clearUI(p){
  for(let i=0;i<24;i++){
    const st=await p.evaluate(()=>{
      const s=document.getElementById('scene');
      if(s&&!s.hidden){document.getElementById('scSkip').click();return 'scene'}
      const d=document.getElementById('dlg');
      if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x){x.click();return 'dlg'}return 'locked'}
      return 'clear'});
    if(st==='clear')return;
    await p.waitForTimeout(st==='locked'?350:160);
  }
  throw new Error('overlays did not clear');
}

(async()=>{
const html=fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8');
const fail=[];
if(html.includes("toast('Aura off')")||html.includes("sk[i].n + ' is on'"))fail.push('aura announcement toast is still in the built page');
if(html.includes("float(P.x,P.y,P.reh+'/3'"))fail.push('rehearsal still announces with a float');
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
await p.waitForTimeout(400);
await p.evaluate(()=>__g.skipDisc());
await p.waitForTimeout(200);
await p.click('[data-cls=scrapper]');
await p.waitForTimeout(300);
await p.evaluate(()=>{__g.G.pre=2});
await clearUI(p);
await p.evaluate(()=>{
  const G=__g.G;
  G.lvl=40;G.act2=true;G.act3=true;G.sats=40;G.god=true;
  for(let i=1;i<=25;i++)G.q['q'+i]=3;
  G.in1=1;__g.ACC.maxi=1;__g.calc();
});
await p.evaluate(()=>__g.enter(1));
await clearUI(p);
await p.evaluate(()=>__g.setMode('play'));

const picture=await p.evaluate(()=>{
  const fail=[],G=__g.G,P=__g.P,W=__g.W,MP=__g.MP;
  const check=(n,ok,extra)=>{if(!ok)fail.push(n+(extra!==undefined?': '+extra:''))};
  const sid=id=>W.fx.find(f=>f.sid===id);
  const orange=()=>{
    const c=document.getElementById('cv'),d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;
    let n=0;
    for(let i=0;i<d.length;i+=16)if(d[i]>190&&d[i+1]>80&&d[i+1]<200&&d[i+2]<100&&d[i+3]>30)n++;
    return n;
  };
  G.cls='maxi';__g.calc();
  P.aura=null;P.dip=0;P.reh=0;P.rehT=0;P.dump=null;W.merc=null;W.tag=null;
  MP.others.length=0;MP.party=null;
  W.fx.length=0;
  __g.stateMarks();__g.render();
  const bare=orange();
  for(const [i,r] of [[3,2.2],[4,3.5+.15],[7,3.2+.1]]){
    P.aura={i:i,L:1,t:0};
    __g.stateMarks();
    const f=sid('aura');
    check('aura '+i+' patch',!!f&&f.k==='patch'&&f.col==='#f7931a'&&Math.abs(f.r-r)<0.001&&!f.remote,f&&f.r);
  }
  P.aura={i:4,L:1,t:0};
  G.merc={k:'guard',name:'Bodyguard',hp:40,dead:false};
  W.merc={x:P.x+0.7,y:P.y+0.35,r:.28,hp:40,max:40,cd:0,ph:0,flash:0,fx:1};
  W.tag={x:P.x-0.55,y:P.y-0.25,hp:10,max:10,r:.3};
  MP.party={members:[{uid:'mate'}]};
  MP.others.push({uid:'mate',name:'Mate',lvl:4,hp:10,hpm:10,cls:'courier',x:P.x+1.05,y:P.y+0.15});
  MP.others.push({uid:'solo',name:'Solo',lvl:6,hp:10,hpm:10,cls:'maxi',x:P.x+2.3,y:P.y-0.35,au:7,aL:1});
  P.reh=2;P.rehT=3;P.dip=1;
  P.dump={k:'blades',t:1.4};
  W.allies.push({k:'minion',kind:'intern',per:1,x:P.x-0.95,y:P.y+0.45,vest:4,hp:12,max:12,ph:0,fx:1,mov:false,r:.3,life:1e9,cd:1});
  let nc=null,lv=null;
  for(const [dx,dy] of [[1.35,.15],[-1.2,.55],[1.6,-.4],[-.4,1.3],[2,.8]]){
    if(!nc)nc=__g.spawn('tick',P.x+dx,P.y+dy);
    else if(!lv)lv=__g.spawn('tick',P.x+dx,P.y+dy);
  }
  check('spawned a machine to mark',!!nc&&!!lv);
  if(nc)nc.nc=5;
  if(lv)lv.leave={dps:1,t:3,c:.4};
  __g.stateMarks();
  const nStay=W.fx.filter(f=>f.stay).length;
  __g.stateMarks();
  check('stay records do not duplicate',W.fx.filter(f=>f.stay).length===nStay,W.fx.filter(f=>f.stay).length+' vs '+nStay);
  check('hireling wears the aura',!!sid('aura-m')&&Math.abs(sid('aura-m').x-W.merc.x)<0.01);
  check('companion wears the aura',!!sid('aura-t'));
  check('party member wears the aura',!!sid('aura-p0')&&Math.abs(sid('aura-p0').x-MP.others[0].x)<0.01);
  const oth=sid('oth1');
  check('other player aura patch',!!oth&&oth.remote===1&&oth.k==='patch'&&Math.abs(oth.r-(3.2+.1))<0.001,oth&&oth.r);
  check('rehearsal count',sid('reh')&&sid('reh').k==='mark'&&sid('reh').n===2);
  check('dip armed',sid('dip')&&sid('dip').k==='mark');
  check('dump type',sid('dump')&&sid('dump').n===3&&sid('dump').col==='#e6e2d6');
  const vest=W.fx.find(f=>f.sid&&f.sid.indexOf('vest')===0);
  check('vesting stacks',!!vest&&vest.n===4&&vest.k==='mark');
  check('non-compete mark',W.fx.some(f=>f.sid&&f.sid.indexOf('nc')===0&&f.k==='mark'));
  check('garden leave patch',W.fx.some(f=>f.sid&&f.sid.indexOf('lv')===0&&f.k==='patch'&&f.col==='#c9a868'));
  const far=W.merc.x;
  W.merc.x=P.x+14;W.merc.y=P.y+14;
  __g.stateMarks();
  check('hireling outside the aura has no patch',!sid('aura-m'));
  W.merc.x=far;W.merc.y=P.y+0.35;
  W.tag=null;
  P.rehT=0;
  __g.stateMarks();
  check('expired rehearsal drops the mark',!sid('reh'));
  check('companion patch drops when they are gone',!sid('aura-t'));
  P.rehT=3;
  __g.stateMarks();
  __g.render();
  const painted=orange();
  check('aura disc paints',painted>bare+20,painted+' vs '+bare);
  __g.update(0.4);
  check('aura survives a tick',!!sid('aura')&&sid('aura').stay);
  check('effect list stays capped after a tick',W.fx.length<=48,W.fx.length);
  return fail;
});
fail.push(...picture);
fs.mkdirSync(path.dirname(shot),{recursive:true});
await p.screenshot({path:shot});

const words=await p.evaluate(()=>{
  const fail=[],G=__g.G,P=__g.P,W=__g.W,MP=__g.MP;
  const check=(n,ok,extra)=>{if(!ok)fail.push(n+(extra!==undefined?': '+extra:''))};
  const log=()=>[...document.getElementById('log').children].map(d=>d.textContent).join(' | ');
  const clear=()=>{document.getElementById('log').replaceChildren()};
  __g.OPT.dmgOut=true;
  clear();
  P.aura=null;__g.stateMarks();
  __g.maxiSet(3,1);__g.stateMarks();
  check('turning an aura on does not toast',!/is on/.test(log()),log());
  check('toxic patch is up',W.fx.some(f=>f.sid==='aura'&&Math.abs(f.r-2.2)<0.001));
  __g.maxiSet(3,1);__g.stateMarks();
  check('turning an aura off does not toast',!/Aura off/.test(log()),log());
  check('aura patch is gone',!W.fx.some(f=>f.sid==='aura'));
  clear();
  __g.SKF.maxi[11](1,1);
  check('refused cite still toasts',/No aura is on/.test(log()),log());
  clear();
  const kept=W.ents.splice(0,W.ents.length);
  __g.SKF.maxi[9](1,1);
  check('refused halving still toasts',/Nothing above the floor/.test(log()),log());
  P.reh=0;P.rehT=0;clear();
  __g.SKF.anon[10](1,1);
  check('refused dump still toasts',/You have nothing rehearsed/.test(log()),log());
  clear();
  P.dump=null;
  __g.anonDump(1,1,1);
  check('dump with nobody in reach still toasts',/Nothing in reach/.test(log()),log());
  check('a refused dump leaves no type mark',!(P.dump&&P.dump.t>0));
  clear();
  __g.SKF.founder[10](1);
  check('refused non-compete still toasts',/Nobody to bind/.test(log()),log());
  clear();
  __g.SKF.founder[9](1,1);
  check('refused garden leave still toasts',/You have nobody to put on leave/.test(log()),log());
  W.ents.push(...kept);
  W.texts.length=0;
  __g.SKF.maxi[13]();
  __g.stateMarks();
  check('arming the dip does not float',!W.texts.some(t=>t.txt==='The dip'));
  check('dip mark is on',W.fx.some(f=>f.sid==='dip'));
  W.texts.length=0;
  P.reh=0;P.rehT=0;
  __g.SKF.anon[9](1,1);
  __g.stateMarks();
  check('rehearsal does not float the count',!W.texts.some(t=>/\/3/.test(t.txt)));
  check('rehearsal mark shows the charge',W.fx.some(f=>f.sid==='reh'&&f.n===P.reh&&P.reh>0));
  const foe=__g.spawn('tick',P.x+1.2,P.y+0.2)||W.ents[0];
  if(foe){
    W.texts.length=0;
    P.grave={src:foe,t:4,x:foe.x,y:foe.y};
    foe.hp=foe.max||foe.hp||10;
    __g.SKF.founder[9](1,1);
    __g.stateMarks();
    check('garden leave does not float',!W.texts.some(t=>t.txt==='Garden leave'));
    check('garden leave patch follows the curse',!!foe.leave&&W.fx.some(f=>f.sid&&f.sid.indexOf('lv')===0));
    W.texts.length=0;
    __g.SKF.founder[10](1);
    __g.stateMarks();
    check('non-compete does not float',!W.texts.some(t=>t.txt==='Non-compete'));
    check('non-compete mark follows the bind',W.fx.some(f=>f.sid&&f.sid.indexOf('nc')===0));
  } else fail.push('no machine for the curse');
  G.cls='anon';G.sk[10]=1;__g.calc();
  P.reh=2;P.rehT=3;P.dump=null;
  __g.attack();
  check('a plain attack spends a rust charge',P.dump&&P.dump.k==='rust'&&P.reh===1);
  __g.stateMarks();
  check('rust spend is marked',W.fx.some(f=>f.sid==='dump'&&f.n===1&&f.col==='#c9803a'));
  const t=__g.spawn('tick',P.x+.4,P.y+.2)||foe;
  if(t){t.hp=t.max||30;P.reh=2;__g.anonDump(2,1,1);__g.stateMarks();
    check('silence spend is marked',W.fx.some(f=>f.sid==='dump'&&f.n===2&&f.col==='#d98cff'));
    __g.anonDump(3,1,1);__g.stateMarks();
    check('blades spend is marked',W.fx.some(f=>f.sid==='dump'&&f.n===3&&f.col==='#e6e2d6'));
  }
  P.dump={k:'silence',t:1.4};
  __g.update(2);
  check('spent-charge mark expires',!(P.dump&&P.dump.t>0)&&!W.fx.some(f=>f.sid==='dump'));
  G.cls='maxi';__g.calc();
  P.aura={i:4,L:1,t:0};P.dip=1;P.reh=2;P.rehT=2;
  __g.stateMarks();
  __g.fxBind();
  for(let i=0;i<60;i++)W.fx.push({k:'ring',x:P.x,y:P.y,r:.4,t:0,life:9,col:'#fff'});
  check('stay marks survive a ring flood',W.fx.length<=48&&W.fx.some(f=>f.sid==='aura')&&W.fx.some(f=>f.sid==='dip'),W.fx.length);
  const own=W.fx.find(f=>f.sid==='aura'), remote=W.fx.find(f=>f.remote&&f.stay);
  __g.OPT.fx='thin';
  check('thin still shows your aura',__g.fxShow(own)===true);
  check('thin still shows your mark',__g.fxShow({k:'mark'})===true);
  if(remote)check('thin skips another player aura',__g.fxShow(remote)===false);
  else {
    MP.others.push({uid:'far',x:P.x+5,y:P.y,au:3});
    __g.stateMarks();
    const r=W.fx.find(f=>f.sid&&f.sid.indexOf('oth')===0&&f.remote);
    check('thin skips another player aura',!!r&&__g.fxShow(r)===false);
  }
  __g.OPT.fx='normal';
  return fail;
});
fail.push(...words);
if(errs.length)fail.push('pageerror: '+errs.slice(0,6).join(' | '));
console.log(fail.length?'FAIL\n'+fail.join('\n'):'v3 ok');
console.log('shot',shot);
await b.close();
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
