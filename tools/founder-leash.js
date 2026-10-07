/* Founder staff use the 8-tile recall. node tools/founder-leash.js */
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
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
await p.waitForTimeout(400);
await p.evaluate(()=>__g.skipDisc());
await p.waitForTimeout(200);
await p.click('[data-cls=founder]');
await p.waitForTimeout(250);
await p.evaluate(()=>{__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1});
await clearUI(p);
await p.evaluate(()=>__g.enter(1));
await clearUI(p);
await p.evaluate(()=>__g.setMode('play'));
const report=await p.evaluate(()=>{
  const fail=[],g=__g,P=g.P,W=g.W,note=[];
  const check=(n,ok,extra)=>{if(!ok)fail.push(n+(extra!==undefined?': '+extra:''))};
  g.G.cls='founder';g.G.god=true;g.G.walkNew=0;g.OPT.noWalk=1;g.calc();g.setMode('play');
  const home=a=>Math.hypot(a.x-P.x,a.y-P.y);
  function reset(){
    W.ents.length=0;W.projs.length=0;W.allies.length=0;W.merc=null;W.tag=null;g.G.merc=null;g.G.tag=null;
    P.atk=9;P.dash=null;
  }
  function spot(want){
    const N=W.N;let best=null,bd=99;
    for(let y=2;y<N-2;y++)for(let x=2;x<N-2;x++){
      if(W.map[y*N+x]!==1)continue;
      const d=Math.hypot(x+.5-P.x,y+.5-P.y),err=Math.abs(d-want);
      if(err<bd){bd=err;best={x:x+.5,y:y+.5,d}}
    }
    return best;
  }
  function tickAt(x,y){
    for(const [dx,dy] of [[0,0],[.5,0],[-.5,0],[0,.5],[.4,.4]]){
      const e=g.spawn('tick',x+dx,y+dy,{});
      if(e){e.stun=99;e.aggro=true;e.hp=e.max=100000;e.mods={};return e}
    }
    return null;
  }
  const s10=spot(10), s3=spot(3);
  check('a ten-tile floor exists', !!(s10&&s10.d>9&&s10.d<11), JSON.stringify(s10));
  check('a three-tile floor exists', !!(s3&&s3.d>2&&s3.d<4), JSON.stringify(s3));
  if(!s10||!s3)return {fail,note};

  reset();
  g.G.merc={k:'guard',name:'Kit',hp:80,dead:false};
  W.merc={x:s10.x,y:s10.y,r:.28,hp:80,max:80,cd:0,haste:0,ph:0,flash:0,swing:0};
  g.update(0.05);
  check('a hireling at 10 is back in one frame', home(W.merc)<1, home(W.merc).toFixed(2));

  reset();
  const idle={k:'minion',kind:'intern',per:1,x:s10.x,y:s10.y,r:.3,hp:40,max:40,cd:0,ivl:.7,m:.4,life:1e9,ph:0,off:0};
  W.allies.push(idle);
  g.update(0.05);
  note.push('idle intern '+home(idle).toFixed(2));
  check('an idle intern at 10 catches up at 8', home(idle)<1, home(idle).toFixed(2));

  reset();
  const drone={k:'minion',kind:'drone',per:1,x:s10.x,y:s10.y,r:.3,hp:30,max:30,cd:9,ivl:.8,m:.5,rng:5.5,life:1e9,ph:0,off:0};
  W.allies.push(drone);
  g.update(0.05);
  check('a contractor with no target catches up too', home(drone)<1, home(drone).toFixed(2));

  reset();
  const fight={k:'minion',kind:'intern',per:1,x:s10.x,y:s10.y,r:.3,hp:40,max:40,cd:0,ivl:.7,m:.4,rng:1,life:1e9,ph:0,off:0};
  W.allies.push(fight);
  const tick=tickAt(fight.x,fight.y);
  check('a tick spawns on the intern', !!tick);
  if(tick){
    const hp0=tick.hp;
    for(let i=0;i<20;i++)g.update(0.05);
    note.push('fighting intern home '+home(fight).toFixed(2)+' dealt '+(hp0-tick.hp).toFixed(1));
    check('an intern already on a tick ten away keeps the fight', home(fight)>8, home(fight).toFixed(2));
    check('that intern still hits', tick.hp<hp0, String(hp0-tick.hp));
  }

  reset();
  const near={k:'minion',kind:'intern',per:1,x:s3.x,y:s3.y,r:.3,hp:40,max:40,cd:9,ivl:.7,m:.4,life:1e9,ph:0,off:0};
  W.allies.push(near);
  const before=home(near);
  g.update(0.05);
  note.push('ring '+before.toFixed(2)+' -> '+home(near).toFixed(2));
  check('an intern inside 8 walks the ring instead of snapping', home(near)>1.2 && home(near)<before, home(near).toFixed(2));

  reset();
  const bot={k:'minion',x:s10.x,y:s10.y,r:.2,hp:20,max:20,cd:9,life:12,m:.4,ph:0};
  W.allies.push(bot);
  g.update(0.05);
  note.push('botnet '+home(bot).toFixed(2));
  check('a timed minion still waits for 14', home(bot)>9, home(bot).toFixed(2));

  reset();
  const beside={k:'minion',kind:'intern',per:1,x:P.x+0.6,y:P.y,r:.3,hp:40,max:40,cd:0,ivl:.7,m:.4,rng:1,life:1e9,ph:0,off:0};
  W.allies.push(beside);
  const close=tickAt(P.x+0.9,P.y);
  check('a tick spawns beside you', !!close);
  if(close){
    const hp0=close.hp;
    for(let i=0;i<40;i++)g.update(0.05);
    note.push('beside dealt '+(hp0-close.hp).toFixed(1)+' home '+home(beside).toFixed(2));
    check('an intern beside you still deals damage', close.hp<hp0-1, String(hp0-close.hp));
    check('that intern stays with you', home(beside)<3, home(beside).toFixed(2));
  }
  return {fail,note};
});
fail.push(...(report.fail||[]));
if(errs.length)fail.push('pageerror: '+errs.slice(0,6).join(' | '));
(report.note||[]).forEach(s=>console.log('measure  '+s));
console.log(fail.length?'FAIL\n'+fail.join('\n'):'founder-leash ok');
await b.close();
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
