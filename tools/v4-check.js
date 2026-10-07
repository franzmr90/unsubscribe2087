/* V4 wire, on one page. node tools/v4-check.js
   The move packet grows only when sk, au or sw changes. A fake zone snapshot
   plays one remote shape when sk changes, draws the aura while au is set, and
   adds nothing when effects are thin. Two sockets are server/test/wire.js.
   The live suite is the two-browser pass. */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');

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
  G.lvl=20;G.god=true;G.in1=1;G.act2=true;
  for(let i=1;i<=25;i++)G.q['q'+i]=3;
  __g.ACC.maxi=1;__g.calc();
});
await p.evaluate(()=>__g.enter(1));
await clearUI(p);
await p.evaluate(()=>__g.setMode('play'));

const report=await p.evaluate(()=>{
  const fail=[],G=__g.G,P=__g.P,W=__g.W;
  const check=(n,ok,extra)=>{if(!ok)fail.push(n+(extra!==undefined?': '+extra:''))};
  const keys=o=>Object.keys(o).filter(k=>k==='sk'||k==='au'||k==='sw');
  const quiet=()=>{let pkt; for(let i=0;i<4;i++)pkt=__g.mpMovePkt(); return pkt;};
  P.aura=null;
  let pkt=quiet();
  const standing=JSON.stringify(pkt);
  check('a standing beat omits sk, au and sw', keys(pkt).length===0, keys(pkt).join(','));
  check('a standing beat stays small', standing.length<400, String(standing.length));
  check('a standing beat has no list', !/\[[\d.\-, ]{8,}\]/.test(standing) && !Object.values(pkt).some(v=>Array.isArray(v)));

  __g.mpNoteCast(0);
  pkt=__g.mpMovePkt();
  check('a cast puts the skill index on that beat', pkt.sk===0, JSON.stringify(pkt.sk));
  pkt=__g.mpMovePkt();
  check('the next beat clears the skill', pkt.sk===null, JSON.stringify(pkt.sk));
  pkt=__g.mpMovePkt();
  check('a quiet beat drops the skill again', !('sk' in pkt));
  __g.mpNoteCast(0);
  pkt=__g.mpMovePkt();
  check('the same skill can be sent again', pkt.sk===0, JSON.stringify(pkt.sk));
  __g.mpMovePkt();

  P.aura={i:4,L:3,t:0};
  pkt=__g.mpMovePkt();
  check('turning an aura on sends its index', pkt.au===4 && !('sk' in pkt), JSON.stringify(pkt));
  pkt=__g.mpMovePkt();
  check('the aura is not repeated every beat', !('au' in pkt));
  P.aura=null;
  pkt=__g.mpMovePkt();
  check('turning the aura off sends null', pkt.au===null, JSON.stringify(pkt.au));
  __g.mpMovePkt();

  __g.mpNoteSwing();
  pkt=__g.mpMovePkt();
  check('a swing sends sw', pkt.sw===1, JSON.stringify(pkt.sw));
  pkt=__g.mpMovePkt();
  check('the next beat clears the swing', pkt.sw===0, JSON.stringify(pkt.sw));
  pkt=__g.mpMovePkt();
  check('a quiet beat drops the swing', !('sw' in pkt));

  G.cls='hacker'; __g.calc(); P.atk=0; P.dash=null;
  const beforeSw=keys(__g.mpMovePkt());
  __g.attack();
  pkt=__g.mpMovePkt();
  check('a ranged attack is not a swing', pkt.sw!==1 && !('sw' in pkt), JSON.stringify(pkt));
  check('the ranged beat did not grow a list', !Object.values(pkt).some(v=>Array.isArray(v)));
  if(beforeSw.length) fail.push('setup beat was not quiet');

  G.cls='scrapper'; __g.calc();
  G.sk[0]=1; G.slots[0]=0; G.en=99999; P.cd[0]=0; P.castWait=0; P.silence=0; P.dash=null; P.atk=0;
  W.fx.length=0;
  __g.cast(0);
  pkt=__g.mpMovePkt();
  check('cast() notes the skill that was actually used', pkt.sk===0, JSON.stringify(pkt.sk));
  __g.mpMovePkt();

  const body=extra=>Object.assign({uid:'vale',name:'Vale',lvl:4,cls:'scrapper',x:P.x+2.2,y:P.y+0.4,hp:10,hpm:10,dir:0.2,sk:null,au:null,sw:0}, extra||{});
  W.fx.length=0; W.parts.length=0;
  const hp=G.hp;
  __g.mpZone({players:[body()]});
  check('the first snapshot does not play a stale cast', W.fx.filter(f=>f.remote).length===0);
  const v=__g.skvOf('scrapper',0);
  __g.mpZone({players:[body({sk:0})]});
  const remote=W.fx.filter(f=>f.remote);
  check('sk changing plays one shape', remote.length===1 && remote[0].k===v.k && remote[0].col===v.col, remote.map(f=>f.k+':'+f.col).join(','));
  check('that shape is at their body, not a local target', !!remote[0] && Math.abs(remote[0].x-(P.x+2.2))<0.05);
  check('a cosmetic cast adds no particles', W.parts.length===0, String(W.parts.length));
  check('a cosmetic cast does not touch your health', G.hp===hp);
  const n=W.fx.length;
  __g.mpZone({players:[body({sk:0})]});
  check('the same sk does not play again', W.fx.length===n);
  __g.mpZone({players:[body({sk:null})]});
  __g.mpZone({players:[body({sk:0})]});
  check('a skill sent again after a clear plays once more', W.fx.filter(f=>f.remote&&f.k===v.k).length===2);

  const swings=W.fx.length;
  __g.mpZone({players:[body({sw:1})]});
  check('a swing plays one remote arc', W.fx.length===swings+1 && W.fx[W.fx.length-1].remote===1 && W.fx[W.fx.length-1].k==='arc');
  __g.mpZone({players:[body({sw:1})]});
  check('a swing that is still 1 does not play again', W.fx.length===swings+1);

  __g.OPT.fx='thin';
  const thinN=W.fx.length;
  const casts=__g.MP.lastCast?__g.MP.lastCast.n:0;
  __g.mpZone({players:[body({sk:1})]});
  check('thin adds no remote cast', W.fx.length===thinN && (!__g.MP.lastCast || __g.MP.lastCast.n===casts));
  __g.OPT.fx='normal';

  __g.mpZone({players:[body({au:4})]});
  __g.stateMarks();
  const disc=W.fx.find(f=>f.sid==='oth0');
  check('au draws the aura patch', !!disc && disc.k==='patch' && disc.remote===1 && Math.abs(disc.r-(3.5+.15))<0.001, disc&&disc.r);
  __g.OPT.fx='thin';
  check('thin skips their aura', __g.fxShow(disc)===false);
  P.aura={i:4,L:1,t:0};
  __g.stateMarks();
  const own=W.fx.find(f=>f.sid==='aura');
  check('thin still draws your own aura', !!own && __g.fxShow(own)===true);
  check('thin still draws your own mark', __g.fxShow({k:'mark'})===true);
  __g.OPT.fx='normal';
  P.aura=null;
  __g.stateMarks();

  __g.fxBind();
  for(let i=0;i<60;i++)W.fx.push({k:'ring',x:P.x,y:P.y,r:.4,t:0,life:9,col:'#fff'});
  check('a remote cast stays inside the fx cap', W.fx.length<=48, String(W.fx.length));
  return fail;
});
fail.push(...report);
if(errs.length)fail.push('pageerror: '+errs.slice(0,6).join(' | '));
console.log(fail.length?'FAIL\n'+fail.join('\n'):'v4 ok');
await b.close();
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
