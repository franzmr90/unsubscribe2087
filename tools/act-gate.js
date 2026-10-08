/* Clear an act and the next one stays shut until Gramps has been heard.
   A save that already walked on is not pulled back: the skipped line is marked heard
   and Gramps talks about the act they are in. The gate reads this character's save only.
   node tools/act-gate.js */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');

async function clearUI(p){
  let calm=0;
  for(let i=0;i<40;i++){
    const st=await p.evaluate(()=>{
      const s=document.getElementById('scene');
      if(s&&!s.hidden){document.getElementById('scSkip').click();return 'scene'}
      const d=document.getElementById('dlg');
      if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x){x.click();return 'dlg'}return 'locked'}
      const sh=document.getElementById('sheet');
      if(sh&&!sh.hidden){__g.closeSheet();return 'sheet'}
      if(__g.mode!=='play')__g.setMode('play');
      return 'clear'});
    if(st==='clear'){if(++calm>=3)return}else calm=0;
    await p.waitForTimeout(st==='locked'?350:120);
  }
  throw new Error('overlays did not clear');
}

(async()=>{
const html=fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8');
const fail=[];
const check=(n,ok,d)=>{if(!ok)fail.push(n+(d?': '+d:''));else console.log('ok',n);};
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
await p.waitForTimeout(400);
await p.evaluate(()=>__g.skipDisc());
await p.waitForTimeout(200);
await p.click('[data-cls=scrapper]');
await p.waitForTimeout(250);
await p.evaluate(()=>{__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1});
await clearUI(p);
await p.evaluate(()=>{__g.enter(0);__g.setMode('play')});
await clearUI(p);

const arm=(patch)=>p.evaluate(patch=>{
  const G=__g.G;
  if(patch.q)for(const k in patch.q)G.q[k]=patch.q[k];
  for(const k of ['act2','act3','act4','act5','unlocked','town'])if(k in patch)G[k]=patch[k];
  document.getElementById('log').textContent='';
},{...patch});

await arm({q:{q1:3,q2:3,q3:3,q4:3,q5:3,q6:0},act2:false,unlocked:7,town:0});
const blocked=await p.evaluate(()=>{
  const g=__g,log=()=>document.getElementById('log').textContent;
  const story=g.storyStep();
  const marked=g.quest('gramps');
  const here=g.W.npcs.some(n=>n.id==='gramps');
  const town=g.enter(17);
  const afterTown={zi:g.W.zi,act2:!!g.G.act2,said:log()};
  document.getElementById('log').textContent='';
  const dist=g.enter(7);
  const afterDist={zi:g.W.zi,said:log()};
  return {story,marked,here,town,afterTown,dist,afterDist};
});
check('Act I log says to speak to Gramps', /Speak to Gramps/.test(blocked.story.d)&&blocked.story.n==='Act I complete', JSON.stringify(blocked.story));
check('Gramps is marked and standing in town', blocked.marked&&blocked.here, JSON.stringify({marked:blocked.marked,here:blocked.here}));
check('The Landing stays shut', blocked.town===false&&blocked.afterTown.zi===0&&blocked.afterTown.act2===false, JSON.stringify(blocked.afterTown));
check('the first Act II district stays shut', blocked.dist===false&&blocked.afterDist.zi===0, JSON.stringify(blocked.afterDist));
check('trying the town says to talk to Gramps', /Talk to Gramps first/.test(blocked.afterTown.said), blocked.afterTown.said);

await p.evaluate(()=>__g.setMode('play'));
await p.evaluate(()=>__g.openSheet('travel',{only:['travel'],gFresh:1}));
await p.click('[data-gact="2"]');
await p.waitForTimeout(1600);
const gateText=await p.evaluate(()=>{
  const landing=document.querySelector('[data-go="17"]');
  const up=document.querySelector('[data-go="7"]');
  document.getElementById('log').textContent='';
  return (landing?landing.textContent:'')+' '+(up?up.textContent:'');
});
await p.click('[data-go="17"]');
const gate=await p.evaluate(()=>({zi:__g.W.zi,said:document.getElementById('log').textContent,sheet:!document.getElementById('sheet').hidden}));
gate.text=gateText;
check('the Transit Gate says to talk to Gramps first', /Talk to Gramps first/.test(gate.text), gate.text);
check('the gate click does not leave Act I', gate.zi===0&&/Talk to Gramps first/.test(gate.said)&&gate.sheet, JSON.stringify(gate));
await p.evaluate(()=>__g.closeSheet());

const heard=await p.evaluate(()=>{
  __g.talkTo('gramps');
  const p=document.getElementById('dP').textContent,q6=__g.G.q.q6;
  return {p,q6};
});
check('Gramps closes Act I and opens the Cloud', heard.q6===1&&/lift behind his desk/.test(heard.p), heard.p.slice(0,180));
await clearUI(p);
const opened=await p.evaluate(()=>{
  const town=__g.enter(17),zi=__g.W.zi,act2=!!__g.G.act2;
  __g.enter(0);
  const back=__g.W.zi;
  __g.enter(7);
  return {town,zi,act2,back,dist:__g.W.zi,actStill:!!__g.G.act2};
});
check('after the talk The Landing opens', opened.town!==false&&opened.zi===17&&opened.act2, JSON.stringify(opened));
check('Act I is still reachable', opened.back===0, String(opened.back));
check('the Updraft opens after the talk', opened.dist===7&&opened.actStill, JSON.stringify(opened));

await clearUI(p);
await p.evaluate(()=>{__g.enter(17);__g.setMode('play')});
await clearUI(p);
await arm({q:{q10:3,q11:0},act3:false,unlocked:11});
const act2=await p.evaluate(()=>{
  const story=__g.storyStep();
  const before=__g.G.unlocked;
  document.getElementById('log').textContent='';
  __g.usePortal({kind:'next'});
  const walked={zi:__g.W.zi,unlocked:__g.G.unlocked,said:document.getElementById('log').textContent};
  const town=__g.enter(18);
  return {story,before,walked,town,zi:__g.W.zi,mark:__g.quest('gramps'),gramps:__g.W.npcs.some(n=>n.id==='gramps')};
});
check('Act II log says to speak to Gramps', /Speak to Gramps/.test(act2.story.d)&&act2.story.n==='Act II complete', JSON.stringify(act2.story));
check('a next-step portal does not open Act III or unlock it', act2.walked.zi!==18&&act2.walked.unlocked===act2.before&&/Talk to Gramps first/.test(act2.walked.said), JSON.stringify(act2.walked));
check('The Antechamber stays shut and Gramps is still there', act2.town===false&&act2.zi!==18&&act2.mark&&act2.gramps, JSON.stringify(act2));
const heard2=await p.evaluate(()=>{__g.talkTo('gramps');return {q11:__g.G.q.q11,p:document.getElementById('dP').textContent}});
check('Gramps closes Act II', heard2.q11===1&&/alarm clock/.test(heard2.p), heard2.p.slice(0,160));
await clearUI(p);
const go3=await p.evaluate(()=>{__g.enter(18);return {zi:__g.W.zi,act3:!!__g.G.act3}});
check('after the talk The Antechamber opens', go3.zi===18&&go3.act3, JSON.stringify(go3));

await clearUI(p);
await p.waitForTimeout(1600);
await arm({q:{q15:3,q16:0},act4:false,unlocked:22});
const act3=await p.evaluate(()=>{
  const story=__g.storyStep();
  document.getElementById('log').textContent='';
  const town=__g.enter(21);
  return {story,town,zi:__g.W.zi,said:document.getElementById('log').textContent,mark:__g.quest('gramps')};
});
check('Act III log says to speak to Gramps', /Speak to Gramps/.test(act3.story.d)&&/Act IV/.test(act3.story.d), JSON.stringify(act3.story));
check('Cutler Avenue stays shut', act3.town===false&&act3.zi===18&&/Talk to Gramps first/.test(act3.said)&&act3.mark, JSON.stringify(act3));
const heard3=await p.evaluate(()=>{__g.talkTo('gramps');return {q16:__g.G.q.q16,p:document.getElementById('dP').textContent}});
check('Gramps closes Act III', heard3.q16===1&&/I AM BACK/.test(heard3.p), heard3.p.slice(0,160));
await clearUI(p);
const go4=await p.evaluate(()=>{__g.enter(21);return {zi:__g.W.zi,act4:!!__g.G.act4}});
check('after the talk Cutler Avenue opens', go4.zi===21&&go4.act4, JSON.stringify(go4));

await clearUI(p);
await p.waitForTimeout(1600);
await arm({q:{q20:3,q21:0},act5:false,unlocked:28});
const act4=await p.evaluate(()=>{
  const story=__g.storyStep();
  document.getElementById('log').textContent='';
  const town=__g.enter(27);
  return {story,town,zi:__g.W.zi,said:document.getElementById('log').textContent,mark:__g.quest('gramps')};
});
check('Act IV log says to speak to Gramps', /Speak to Gramps/.test(act4.story.d)&&/Act V/.test(act4.story.d), JSON.stringify(act4.story));
check('The Garage stays shut', act4.town===false&&act4.zi===21&&/Talk to Gramps first/.test(act4.said)&&act4.mark, JSON.stringify(act4));
const heard4=await p.evaluate(()=>{__g.talkTo('gramps');return {q21:__g.G.q.q21,p:document.getElementById('dP').textContent}});
check('Gramps closes Act IV', heard4.q21===1&&/garage is open/.test(heard4.p), heard4.p.slice(0,160));
await clearUI(p);
const go5=await p.evaluate(()=>{__g.enter(27);return {zi:__g.W.zi,act5:!!__g.G.act5}});
check('after the talk The Garage opens', go5.zi===27&&go5.act5, JSON.stringify(go5));

/* This character has not heard it, so they are held. The same gate on a save that has heard it is open. Party progress does not cross that line. */
const party=await p.evaluate(()=>{
  const mine={act2:false,q6:0};
  __g.G.act2=false;__g.G.q.q5=3;__g.G.q.q6=0;
  const held=!!__g.actBriefHold(17);
  __g.G.q.q6=1;
  const heard=!!__g.actBriefHold(17);
  __g.G.q.q6=mine.q6;__g.G.act2=false;
  return {held,heard};
});
check('the gate is this character: unheard holds, heard does not', party.held&&!party.heard, JSON.stringify(party));

const fresh=await p.evaluate(()=>{
  const G=JSON.parse(JSON.stringify(__g.G));
  G.act2=G.act3=G.act4=G.act5=false;
  G.q={};
  for(let i=1;i<=25;i++)G.q['q'+i]=i<=5?3:0;
  const ok=__g.applySave({G,zs:{}});
  return {ok,q6:__g.G.q.q6,hold:!!__g.actBriefHold(17),act2:!!__g.G.act2};
});
check('an Act I save is not marked heard', fresh.ok&&fresh.q6===0&&fresh.hold&&fresh.act2===false, JSON.stringify(fresh));

const stale=await p.evaluate(()=>{
  const G=JSON.parse(JSON.stringify(__g.G));
  G.act2=G.act3=G.act4=G.act5=true;
  G.town=27;
  G.q={};
  for(let i=1;i<=25;i++)G.q['q'+i]=(i===6||i===11||i===16||i>=21)?0:3;
  const ok=__g.applySave({G,zs:{}});
  const flags={q6:__g.G.q.q6,q11:__g.G.q.q11,q16:__g.G.q.q16,q21:__g.G.q.q21};
  const story=__g.storyStep();
  const hold5=__g.actBriefHold(27),hold1=__g.actBriefHold(0);
  __g.enter(27);
  const zi=__g.W.zi;
  __g.setMode('play');
  __g.talkTo('gramps');
  const line=document.getElementById('dP').textContent;
  return {ok,flags,story,hold5:!!hold5,hold1:!!hold1,zi,line};
});
check('a later save marks the skipped lines heard', stale.ok&&stale.flags.q6===3&&stale.flags.q11===3&&stale.flags.q16===3&&stale.flags.q21===1, JSON.stringify(stale.flags));
check('the log is the current act, not Act I', stale.story.n==='Gone and Got', JSON.stringify(stale.story));
check('they stay in Act V', stale.zi===27&&stale.hold5===false&&stale.hold1===false, JSON.stringify({zi:stale.zi,hold5:stale.hold5}));
check('Gramps has left the old completion lines', !/lift behind his desk|alarm clock went off|I AM BACK|garage is open/.test(stale.line), stale.line.slice(0,180));
await clearUI(p);

const early=await p.evaluate(()=>{
  const G=JSON.parse(JSON.stringify(__g.G));
  G.act2=true;G.act3=G.act4=G.act5=false;G.town=17;
  G.q={};
  for(let i=1;i<=25;i++)G.q['q'+i]=i<=5?3:0;
  __g.applySave({G,zs:{}});
  const story=__g.storyStep();
  __g.enter(17);
  __g.setMode('play');
  __g.talkTo('gramps');
  return {q6:__g.G.q.q6,zi:__g.W.zi,story,line:document.getElementById('dP').textContent};
});
check('Act II with nothing further sets Going Up and stays there', early.q6===1&&early.zi===17&&early.story.n==='Going Up', JSON.stringify({q6:early.q6,zi:early.zi,story:early.story}));
check('Gramps is not still closing Act I', !/lift behind his desk/.test(early.line), early.line.slice(0,180));

if(errs.length)fail.push('page errors: '+errs.slice(0,4).join(' | '));
console.log(fail.length?('FAIL\n'+fail.join('\n')):'act-gate passed');
await b.close();
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
