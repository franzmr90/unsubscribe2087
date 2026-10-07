/* Wired skill shapes. node tools/vfx-wire-check.js
   The skills that used to throw a ring or a bolt now leave a patch, a trail,
   a mark, or an orbit. Lasting states keep one stay record. Caps still hold,
   and Thin still skips particles. */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const shot=process.env.VFX_SHOT||'/opt/cursor/artifacts/vfx_wire_skills.png';

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
  G.lvl=60;G.act2=true;G.act3=true;G.act4=true;G.act5=true;G.sats=40;G.god=true;
  for(let i=1;i<=25;i++)G.q['q'+i]=3;
  G.in1=1;__g.ACC.maxi=1;__g.calc();
});
await p.evaluate(()=>__g.enter(1));
await clearUI(p);
await p.evaluate(()=>__g.setMode('play'));

const report=await p.evaluate(()=>{
  const fail=[],G=__g.G,P=__g.P,W=__g.W;
  const check=(n,ok,extra)=>{if(!ok)fail.push(n+(extra!==undefined?': '+extra:''))};
  const want={
    scrapper:{12:'patch',4:'trail'},
    hacker:{7:'orbit',12:'trail'},
    courier:{1:'trail',6:'orbit',7:'mark',14:'mark'},
    anon:{1:'trail',5:'patch'},
    founder:{1:'patch',3:'orbit',7:'mark',9:'mark'},
    maxi:{5:'trail',6:'orbit',9:'patch',11:'orbit'},
    witness:{0:'mark',9:'mark',12:'patch'},
    homesteader:{0:'patch',2:'orbit',5:'orbit'}
  };
  for(const cls in want)for(const i in want[cls]){
    const v=__g.skvOf(cls,+i);
    check(cls+' '+i+' is '+want[cls][i], v&&v.k===want[cls][i], v&&v.k);
  }
  check('step back trails behind you', __g.skvOf('hacker',12).at==='back');
  check('call the strike holds its radius', __g.skvOf('scrapper',12).tel===1 && __g.skvOf('scrapper',12).r===4.2);
  check('look does not print a fake stack', __g.skvOf('witness',0).n===0);
  const cast=(cls,i)=>{
    G.cls=cls;__g.calc();G.sk[i]=5;G.slots[0]=i;G.en=99999;
    P.cd[i]=0;P.castWait=0;P.silence=0;P.dash=null;P.dir={x:1,y:0};
    W.fx.length=0;
    __g.cast(0);
    const v=__g.skvOf(cls,i);
    const hit=W.fx.some(f=>f.k===v.k&&f.col===v.col);
    check('cast '+cls+' '+__g.CLS[cls].sk[i].n, hit, W.fx.map(f=>f.k+':'+f.col).join(','));
    check('cast stays inside the shape cap', W.fx.length<=48, W.fx.length);
    return v;
  };
  cast('scrapper',12);
  const disc=W.fx.find(f=>f.k==='patch');
  check('strike patch is a telegraph', !!disc&&disc.tel===1&&disc.r===4.2, disc&&disc.r);
  cast('hacker',7);
  check('botnet orbits three', W.fx.some(f=>f.k==='orbit'&&f.n===3));
  cast('maxi',11);
  check('cite orbits', W.fx.some(f=>f.k==='orbit'));
  cast('founder',3);
  check('contractors orbit', W.fx.some(f=>f.k==='orbit'));
  cast('courier',6);
  check('rush order orbits', W.fx.some(f=>f.k==='orbit'));
  const foe=__g.spawn('tick',P.x+1.4,P.y+0.2);
  check('a machine is in view', !!foe);
  if(foe){
    cast('witness',0);
    check('look marks the machine', W.fx.some(f=>f.k==='mark'&&Math.abs(f.x-foe.x)<0.2));
    foe.tes=4;foe.onRecT=6;foe.mc=3;
    __g.stateMarks();
    const tes=W.fx.find(f=>f.sid&&f.sid.indexOf('tes')===0);
    check('testimony stays up with the stack', !!tes&&tes.k==='mark'&&tes.n===4&&tes.stay, tes&&tes.n);
    check('on the record stays up', W.fx.some(f=>f.sid&&f.sid.indexOf('orec')===0&&f.k==='mark'));
    check('missed connection stays up', W.fx.some(f=>f.sid&&f.sid.indexOf('mc')===0&&f.col==='#3fbf8f'));
    const before=W.fx.filter(f=>f.stay).length;
    __g.stateMarks();
    check('stay marks do not duplicate', W.fx.filter(f=>f.stay).length===before);
  }
  P.two={n:3};P.redact=2;
  G.cls='homesteader';G.form='hound';__g.calc();
  __g.stateMarks();
  check('two-handed shows the charges', W.fx.some(f=>f.sid==='two'&&f.n===3&&f.k==='mark'));
  check('redaction holds a patch', W.fx.some(f=>f.sid==='redact'&&f.k==='patch'));
  check('the hound wears a mark', W.fx.some(f=>f.sid==='form'&&f.k==='mark'&&f.col==='#6a8f62'));
  G.form='hull';__g.stateMarks();
  check('the hull wears a patch', W.fx.some(f=>f.sid==='form'&&f.k==='patch'&&f.col==='#4e6a48'));
  G.form=null;P.two=null;P.redact=0;__g.stateMarks();
  check('a shed chassis drops the mark', !W.fx.some(f=>f.sid==='form'||f.sid==='two'||f.sid==='redact'));
  G.cls='scrapper';__g.calc();__g.fxBind();__g.OPT.fx='normal';
  W.fx.length=0;W.parts.length=0;
  G.sk[4]=5;G.slots[0]=4;G.en=99999;P.cd[4]=0;P.castWait=0;P.dash=null;P.dir={x:1,y:0};
  __g.cast(0);
  for(let i=0;i<8;i++)__g.update(1/20);
  const trails=W.fx.filter(f=>f.k==='trail').length;
  check('picket rush leaves a trail', trails>=1&&trails<=8, trails);
  check('a dash does not blow the shape cap', W.fx.length<=48, W.fx.length);
  check('a dash does not blow the particle cap', W.parts.length<=80, W.parts.length);
  W.parts.length=0;
  __g.OPT.fx='thin';
  P.cd[4]=0;P.dash=null;G.en=99999;
  __g.cast(0);
  for(let i=0;i<8;i++)__g.update(1/20);
  check('thin adds no dash dust', W.parts.length===0, W.parts.length);
  check('thin still keeps your own trail', W.fx.some(f=>f.k==='trail'&&!f.remote));
  __g.OPT.fx='normal';
  __g.fxBind();
  let mark=null;
  for(const e of W.ents)if(e&&e.hp>0){mark=e;break}
  if(!mark)mark=__g.spawn('tick',P.x+0.7,P.y+0.2);
  if(mark){mark.hp=500;mark.tes=4;mark.x=P.x+0.7;mark.y=P.y+0.15}
  __g.stateMarks();
  const tesStay=W.fx.find(f=>f.sid&&f.sid.indexOf('tes')===0);
  for(let i=0;i<60;i++)W.fx.push({k:'ring',x:P.x,y:P.y,r:.4,t:0,life:9,col:'#fff'});
  check('a testimony mark survives a ring flood', W.fx.length<=48 && !!tesStay && W.fx.indexOf(tesStay)>=0, 'len '+W.fx.length+' tes '+(tesStay&&tesStay.sid)+' stays '+W.fx.filter(f=>f.stay).map(f=>f.sid).join(','));
  __g.OPT.fx='thin';
  check('thin still shows a mark', __g.fxShow({k:'mark'})===true);
  check('thin skips another player cast', __g.fxShow({k:'orbit',remote:1})===false);
  __g.OPT.fx='normal';
  G.cls='scrapper';__g.calc();
  __g.render();
  return fail;
});
fail.push(...report);
if(errs.length)fail.push('pageerror: '+errs.slice(0,6).join(' | '));
fs.mkdirSync(path.dirname(shot),{recursive:true});
if(!fail.length&&!errs.length){
  await p.evaluate(()=>{
    const G=__g.G,P=__g.P,W=__g.W;
    G.cls='scrapper';__g.calc();__g.OPT.fx='normal';
    W.fx.length=0;W.parts.length=0;W.texts.length=0;
    const e=W.ents.find(x=>x&&x.hp>0)||__g.spawn('tick',P.x+1.3,P.y+0.15);
    e.tes=4;e.hp=e.max||20;e.x=P.x+1.25;e.y=P.y+0.1;
    __g.stateMarks();
    G.sk[12]=5;G.slots[0]=12;G.en=99999;P.cd[12]=0;P.castWait=0;P.dash=null;P.dir={x:1,y:0};
    __g.cast(0);
    __g.render();
  });
  await p.screenshot({path:shot});
  await p.evaluate(()=>{
    const G=__g.G,P=__g.P,W=__g.W;
    W.fx.length=0;W.parts.length=0;
    G.sk[4]=5;G.slots[0]=4;G.en=99999;P.cd[4]=0;P.castWait=0;P.dash=null;P.dir={x:1,y:0};
    __g.cast(0);
    __g.update(1/30);
    __g.render();
  });
  await p.screenshot({path:shot.replace(/\.png$/,'_trail.png')});
  await p.evaluate(()=>{
    const G=__g.G,P=__g.P,W=__g.W;
    G.cls='hacker';__g.calc();
    W.fx.length=0;W.parts.length=0;W.allies.length=0;
    G.sk[7]=5;G.slots[0]=7;G.en=99999;P.cd[7]=0;P.castWait=0;P.dash=null;
    __g.cast(0);
    W.allies.length=0;
    __g.render();
  });
  await p.screenshot({path:shot.replace(/\.png$/,'_orbit.png')});
}
console.log(fail.length?'FAIL\n'+fail.join('\n'):'vfx wire ok');
console.log('shot',shot);
await b.close();
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
