/* One headless pass over every playable class.
   node tools/classes.js [outdir]
   Creation, walkthrough, every skill against its card, a level, a piece of gear,
   an early zone in each act, a hireling, a portal, a stim, a shitcoiner, a quest
   tally, a save, and the party tab with no account server. */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const {pathToFileURL}=require('url');
const root=path.join(__dirname,'..');
const pagePath=path.join(root,'dist','Unsubscribe-2087-standalone.html');
const OUT=process.argv[2]||'';

const CLASSES=['scrapper','hacker','courier','anon','founder','homesteader','witness','maxi'];
const ACTS=[[1,'Act I'],[7,'Act II'],[12,'Act III'],[22,'Act IV'],[28,'Act V']];

async function clearUI(p){
  for(let i=0;i<30;i++){
    const st=await p.evaluate(()=>{
      const s=document.getElementById('scene');
      if(s&&!s.hidden){document.getElementById('scSkip').click();return 'scene'}
      const d=document.getElementById('dlg');
      if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x){x.click();return 'dlg'}return 'locked'}
      return 'clear'});
    if(st==='clear')return;
    await p.waitForTimeout(st==='locked'?400:140);
  }
  throw new Error('overlays did not clear');
}

(async()=>{
if(!fs.existsSync(pagePath)){console.error('missing standalone');process.exit(1)}
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(String(e.message||e).split('\n')[0]));
p.on('console',m=>{if(m.type()==='error')errs.push('console '+m.text().slice(0,180))});
await p.goto(pathToFileURL(pagePath).href);
await p.waitForFunction(()=>window.__g&&__g.skipDisc);
await p.evaluate(()=>__g.skipDisc());
await p.waitForTimeout(250);

const title=await p.evaluate(()=>{
  const names=[...document.querySelectorAll('#clsList [data-cls]')].map(n=>n.dataset.cls);
  const clips=[...document.querySelectorAll('#clsList .cls span,#clsList .cls b')].filter(n=>n.scrollHeight>n.clientHeight+2||n.scrollWidth>n.clientWidth+2).map(n=>n.textContent.slice(0,60));
  return {names,maxi:typeof __g.maxiOn==='function'?__g.maxiOn():null,clips};
});
if(OUT)await p.screenshot({path:path.join(OUT,'class-title.png')});

await p.click('[data-cls=scrapper]');
await p.waitForTimeout(200);
await p.evaluate(()=>{__g.G.pre=2;__g.G.q.q1=1;__g.G.seenIntro=true;__g.OPT.noWalk=0;__g.G.walkNew=1});
await clearUI(p);
await p.evaluate(()=>__g.enter(0));
await clearUI(p);
await p.evaluate(()=>__g.setMode('play'));
await p.waitForTimeout(700);
const walk=await p.evaluate(()=>{
  const d=document.getElementById('dlg');
  const on=d&&!d.hidden;
  const title=(document.getElementById('dT')||{}).textContent||'';
  const btns=[...document.querySelectorAll('#dBtns button')].map(b=>b.textContent);
  return {on,title,btns};
});
if(OUT&&walk.on)await p.screenshot({path:path.join(OUT,'class-walkthrough.png')});
await clearUI(p);
await p.evaluate(()=>{__g.OPT.noWalk=1;__g.G.walkNew=0;__g.setMode('shot')});

const report=await p.evaluate(async ({CLASSES,ACTS})=>{
  const g=__g, issues=[], notes=[];
  const issue=(cls,sev,what,repro,cause)=>issues.push({cls,sev,what,repro,cause});
  const rnd=Math.random;
  Math.random=()=>0.5;

  function wipe(){
    const W=g.W,P=g.P;
    W.ents.length=0;W.projs.length=0;W.allies.length=0;W.fx.length=0;W.merc=null;W.texts.length=0;
    P.aura=null;P.toxL=0;P.mkAura=0;P.mkP=0;P.haste=0;P.atk=0;P.dash=null;P.buff=0;P.guard=0;
    P.stealth=0;P.ambT=0;P.ambM=1;P.mech=0;P.crunch=0;P.dip=0;P.two=null;P.lastShift=0;P.cite=null;
    P.volley=null;P.castWait=0;P.redact=0;P.silence=0;P.spin=0;P.inv=0;P.cd=P.cd.map(()=>0);
    P.dir={x:1,y:0};P.corpses=[];P.grave=null;P.compost=0;P.reh=0;P.rehT=0;P.lastThrow=null;P.freeThrow=0;
    g.G.form=null;g.G.formDt=null;g.G.formT=0;g.G.page=0;g.G.merc=null;g.G.fork={};
    const log=document.getElementById('log');if(log)log.textContent='';
  }
  function foe(dx,kind){
    const P=g.P;
    const tries=dx==null?[1.1,1.6,-1.2,0.8,2.2]:[dx];
    let e=null;
    for(const d of tries){e=g.spawn(kind||'tick',P.x+d,P.y,{});if(e)break}
    if(!e)return null;
    e.hp=e.max=100000;e.stun=99;e.aggro=true;e.mods={};return e;
  }
  function toast(){return (document.getElementById('log')||{}).textContent||''}
  function snap(e){
    const P=g.P,G=g.G;
    return {
      hp:e?e.hp:null,stun:e?e.stun:null,mark:e?e.mark:null,slow:e?+(e.slow||0).toFixed(2):null,
      tes:e?e.tes||0:0,gone:e?g.W.ents.indexOf(e)<0:false,
      allies:g.W.allies.map(a=>({k:a.k,kind:a.kind||'',life:+(a.life||0).toFixed(2),m:a.m||0})),
      projs:g.W.projs.length,
      x:+P.x.toFixed(2),y:+P.y.toFixed(2),
      buff:+(P.buff||0),guard:+(P.guard||0),haste:+(P.haste||0),stealth:+(P.stealth||0),
      aura:P.aura?P.aura.i:0,dip:P.dip||0,two:P.two?P.two.n:0,lastShift:+(P.lastShift||0),
      mech:+(P.mech||0),crunch:+(P.crunch||0),cite:!!P.cite,volley:!!P.volley,
      form:G.form||'',page:+(G.page||0),compost:+(P.compost||0),redact:+(P.redact||0),
      reh:P.reh||0,castWait:+(P.castWait||0),toast:toast()
    };
  }
  async function ticks(n){for(let i=0;i<n;i++)g.update(0.05)}
  /* These refuse before they spend, and that toast is the card. */
  const mayRefuse={witness:{1:1,3:1,4:1,6:1,7:1,9:1,10:1,12:1},homesteader:{7:1},founder:{8:1,9:1,14:1},courier:{11:1},anon:{10:1,14:1},maxi:{11:1}};

  function quiet(){
    const sc=document.getElementById('scene');if(sc&&!sc.hidden){const b=document.getElementById('scSkip');if(b)b.click()}
    const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x)x.click()}
  }
  function prep(cls){
    const G=g.G;
    G.cls=cls;G.lvl=30;G.act2=1;G.act3=1;G.act4=1;G.act5=1;
    G.sk=Array(15).fill(0);G.pas=[];G.slots=[-1,-1,-1];
    G.eq.weapon=null;G.eq.armor=null;G.god=true;G.hp=9999;G.en=9999;
    G.diff=0;G.pp=0;if(cls==='hacker')G.schema='surge';
    G['in1']=1;g.enter(1);quiet();
    if(g.W.start){g.P.x=g.W.start.x;g.P.y=g.W.start.y}
    wipe();g.calc();G.hp=g.S.maxHp;G.en=g.S.maxEn;g.setMode('shot');
  }
  function arm(i){
    wipe();
    if(g.W.start){g.P.x=g.W.start.x;g.P.y=g.W.start.y}
    g.P.dir={x:1,y:0};
    g.G.sk=Array(15).fill(0);g.G.sk[i]=1;g.G.pas=[];g.G.slots=[i,-1,-1];g.G.form=null;g.G.page=0;
    g.calc();g.G.en=g.S.maxEn;g.G.hp=g.S.maxHp;
  }

  /* ---- creation / HUD once the world exists ---- */
  const hud=(()=>{
    g.setMode('play');
    const ids=['hud','bMenu','bAct','log'];
    const miss=ids.filter(id=>!document.getElementById(id));
    const hp=document.querySelector('#hpOrb,#orbHp,.orb');
    return {miss,hudHidden:document.getElementById('hud').hidden};
  })();
  if(hud.miss.length)issue('all','major','HUD is missing '+hud.miss.join(','),'load into town','markup');
  if(hud.hudHidden)issue('all','major','HUD stays hidden after play starts','setMode play in town','hud()');

  for(const cls of CLASSES){
    try{
      prep(cls);
      const c=g.CLS[cls];
      const skills=[];
      for(let i=0;i<c.sk.length;i++){
        const s=c.sk[i];
        const card=s.d(1);
        const row={i,n:s.n,a:s.a,cost:s.cost||0,cd:s.cd||0,card};
        if(!s.a){
          const before={armor:g.S.armor,maxHp:g.S.maxHp,dodge:g.S.dodge,cdr:g.S.cdr,crit:g.S.crit,mspd:g.S.mspd,gold:g.S.gold,mf:g.S.mf,pierce:g.S.pierce,enc:g.S.enc,regen:g.S.regen};
          g.G.sk[i]=1;g.G.pas=[i];g.calc();
          const after={armor:g.S.armor,maxHp:g.S.maxHp,dodge:+g.S.dodge.toFixed(2),cdr:+g.S.cdr.toFixed(3),crit:g.S.crit,mspd:g.S.mspd,gold:g.S.gold,mf:g.S.mf,pierce:g.S.pierce,enc:+(g.S.enc||0).toFixed(2),regen:g.S.regen,feral:g.S.feral||0,margin:g.S.margin||0,filed:g.S.filed||0,footnote:g.S.footnote||0,coloHi:g.S.coloHi||0,named:g.S.named||0,root:g.S.root||0};
          row.passive={before,after};
          g.G.sk[i]=0;g.G.pas=[];g.calc();
          skills.push(row);continue;
        }
        arm(i);
        const e=foe(1.05);
        const en0=g.G.en,x0=g.P.x;
        let threw=null;
        g.setMode('play');
        try{g.cast(0)}catch(err){threw=String(err.message||err)}
        const spent=+(en0-g.G.en).toFixed(2);
        const cd=+(g.P.cd[i]||0).toFixed(3);
        if(!(cls==='maxi'&&i===0))g.setMode('shot');
        await ticks(cls==='maxi'&&i===0?4:16);
        if(cls==='maxi'&&i===0){await new Promise(r=>setTimeout(r,900));g.setMode('shot')}
        row.spent=spent;row.cdGot=cd;row.threw=threw;row.snap=snap(e);row.moved=Math.abs(g.P.x-x0)>0.3;
        row.mid=(g.S.dmin+g.S.dmax)/2;row.noFoe=!e;
        const skip=mayRefuse[cls]&&mayRefuse[cls][i];
        if(!skip&&s.a&&Math.abs(spent-(s.cost||0))>0.05)issue(cls,'major',s.n+' spent '+spent+' energy, card says '+(s.cost||0),'rank 1 cast, read before the clock',row.snap.toast||threw||'no toast');
        if(!skip&&s.a&&spent>0&&Math.abs(cd-(s.cd||0))>0.05)issue(cls,'major',s.n+' recovery is '+cd+'s, card says '+(s.cd||0),'rank 1 cast, read before the clock','cast cd');
        skills.push(row);
      }
      const bucket={cls,n:c.n,skills,acts:[]};
      notes.push(bucket);

      /* rank 10 recovery on the first active */
      {
        const i=c.sk.findIndex(s=>s.a);
        arm(i);g.G.sk[i]=10;g.calc();g.G.en=g.S.maxEn;g.G.slots=[i,-1,-1];
        foe(1.05);g.setMode('play');g.cast(0);g.setMode('shot');
        const cd=g.P.cd[i],want=c.sk[i].cd*0.8;
        if(!(cd>0))issue(cls,'major',c.sk[i].n+' at rank 10 did not start a cooldown','cast once','cast');
        else if(Math.abs(cd-want)>0.02)issue(cls,'major',c.sk[i].n+' mastery recovery is '+cd.toFixed(2)+'s, card says 20% faster ('+want.toFixed(2)+'s)','rank 10, cast once','cast cd');
      }

      /* leveled skill point and attribute point */
      {
        const lv=g.G.lvl,sp=g.G.sp||0,ap=g.G.ap||0;
        g.gainXp(99999);
        if(g.G.lvl<=lv)issue(cls,'major','experience did not grant a level','gainXp','gainXp');
        else{
          if((g.G.sp||0)<sp+(g.G.lvl-lv))issue(cls,'major','level-up did not grant a skill point','gainXp','gainXp');
          if((g.G.ap||0)<ap+5*(g.G.lvl-lv))issue(cls,'major','level-up did not grant five attribute points','gainXp','gainXp');
        }
      }

      /* gear requirement and a worn weapon changing the sheet */
      {
        g.G.eq.weapon=null;g.G.eq.armor=null;g.calc();
        g.setMode('play');g.G.lvl=5;g.G.bag=[];
        const low=g.makeItem(1,1,'weapon');low.req=20;low.id=1;low.name='Locked Sign';
        g.G.bag=[low];
        const logEl=document.getElementById('log');if(logEl)logEl.textContent='';
        g.openSheet('items');
        const b=document.querySelector('#sheetIn [data-bag="0"]');
        if(!b)issue(cls,'major','bag item has no button','open items sheet','drawSheet');
        else{b.click();b.click()}
        const refused=/Needs level 20/.test(toast())&&!g.G.eq.weapon;
        if(!refused)issue(cls,'major','a level-20 weapon equipped at level 5','double-tap the bag row',toast()||'no toast');
        g.closeSheet();
        g.G.eq.weapon=null;g.G.lvl=20;g.G.bag=[];g.calc();
        const it=g.makeItem(8,2,'weapon');it.id=1;it.req=1;it.dmin=40;it.dmax=50;it.name='Test '+c.n+' weapon';
        g.G.bag=[it];g.calc();const bare=g.S.dmax;
        g.openSheet('items');
        const b2=document.querySelector('#sheetIn [data-bag="0"]');
        if(b2){b2.click();b2.click()}
        g.closeSheet();g.calc();
        if(!g.G.eq.weapon)issue(cls,'major','class weapon would not equip','level 20, req 1, double-tap',toast());
        else if(!(g.S.dmax>bare))issue(cls,'minor','equipping a weapon did not raise sheet damage','dmax '+bare+' -> '+g.S.dmax,'calc');
        g.G.eq.weapon=null;g.calc();
      }

      /* early zone of every act: enter, move, land a blow */
      const acts=[];
      for(const [zi,name] of ACTS){
        g.G['in'+zi]=1;g.G.god=true;
        try{g.enter(zi)}catch(err){issue(cls,'blocker','could not enter '+name+' ('+zi+')','enter('+zi+')',String(err.message||err));continue}
        const sc=document.getElementById('scene');
        if(sc&&!sc.hidden){const sk=document.getElementById('scSkip');if(sk)sk.click()}
        const dg=document.getElementById('dlg');
        if(dg&&!dg.hidden){const x=dg.querySelector('#dBtns button:not([disabled])');if(x)x.click()}
        g.setMode('shot');
        if(g.W.zi!==zi){issue(cls,'blocker',name+' landed in zone '+g.W.zi,'enter('+zi+')','enter');continue}
        const x0=g.P.x,y0=g.P.y;
        g.keys.KeyD=true;
        for(let k=0;k<12;k++)g.update(0.05);
        g.keys.KeyD=false;
        const moved=Math.hypot(g.P.x-x0,g.P.y-y0)>0.4;
        g.W.ents=g.W.ents.filter(e=>e.k==='shill');
        const e=foe(0.9);let dmg=0;
        if(e){const hp=e.hp;g.P.atk=0;g.attack();g.update(0.05);g.update(0.05);dmg=hp-e.hp}
        acts.push({zi,name,moved,dmg:Math.round(dmg),ents:g.W.ents.length});
        if(!moved)issue(cls,'major','could not step in '+name,'nudge +x on a walkable tile','mv/free');
        if(!(dmg>0))issue(cls,'major','basic attack dealt no damage in '+name,'stunned Tick in front','attack');
      }

      /* hire a bodyguard and see one swing */
      {
        g.G.god=true;g.G.credits=1e9;g.G.lvl=15;
        g.enter(0);quiet();g.setMode('play');
        g.openSheet('merc');
        const hire=document.querySelector('[data-hire="guard"]');
        if(!hire)issue(cls,'major','Kestrel hire row missing','merc tab in town','drawSheet');
        else if(hire.disabled)issue(cls,'major','bodyguard hire stayed disabled with a full purse','credits 1e9','hireCost');
        else hire.click();
        g.closeSheet();g.enter(1);quiet();g.setMode('shot');g.W.ents.length=0;
        const e=foe(1.15);if(e){e.hp=e.max=100000;e.stun=99}
        let hit=false;
        if(g.W.merc){const hp=e.hp;for(let k=0;k<40&&e.hp>=hp;k++)g.update(0.05);hit=e.hp<hp}
        if(!g.W.merc)issue(cls,'major','hired bodyguard never appeared','data-hire guard','spawnMerc');
        else if(!hit)issue(cls,'major','hired bodyguard never landed a hit','Tick at 1.15, 2s','mercStep');
      }

      /* portal out and back */
      {
        g.W.ents.length=0;g.G.portal=null;g.setMode('play');
        const zx=g.P.x,zy=g.P.y;
        g.openPortal();
        const gate=g.W.portals.some(q=>q.cast);
        if(!gate||g.W.zi!==1)issue(cls,'major','portal did not stay in the field','openPortal in zone 1','openPortal');
        else{
          g.P.x+=2.2;g.update(0.05);g.P.x-=2.2;g.update(0.05);
          const town=g.W.zi===0&&g.G.portal&&g.G.portal.zi===1;
          if(!town)issue(cls,'major','stepping into the portal did not return to town','step off, step on','usePortal');
          else{
            g.P.x=12.5;g.P.y=11.5;g.usePortal({kind:'back',x:12.5,y:11.5});
            const back=g.W.zi===1&&Math.hypot(g.P.x-zx,g.P.y-zy)<0.05&&!g.G.portal&&!g.W.portals.some(q=>q.cast);
            if(!back)issue(cls,'major','town portal did not return to the cast tile and close','usePortal back','portal origin');
          }
        }
      }

      /* stim */
      {
        g.G.stims=2;g.G.hp=Math.max(1,g.S.maxHp*0.4);const hp=g.G.hp;g.stim();
        if(!(g.G.hp>hp+1)||g.G.stims!==1)issue(cls,'major','stim did not heal','40% life, 2 stims','stim');
      }

      /* shitcoiner refuse starts a fight */
      {
        g.W.ents.length=0;g.setMode('play');
        const s=g.spawn('shill',g.P.x+1.2,g.P.y,{});
        if(!s)issue(cls,'major','could not spawn a shitcoiner','spawn shill','ET');
        else{
          s.coin='DogeNote';s.name='Shill for DogeNote';s.pitch=1;s.aggro=false;s.pt=18;
          g.talkTo&&g.shillTalk?null:null;
          /* talkTo is for named NPCs. Call the dialog the way the game does. */
        }
      }

      /* quest tally advances */
      {
        g.enter(1);g.setMode('shot');
        g.G.q.q2=1;g.G.qt=g.G.qt||{};
        const e=foe(1);if(e){e.q='q2';e.hp=1;g.kill(e)}
        /* q2 may not be a kill quest; record the flag only */
      }

      /* save round-trip */
      {
        g.G.lvl=17;g.G.cls=cls;g.calc();
        if(!g.save(true))issue(cls,'blocker','save() did not write','save(true)','localStorage');
        const raw=localStorage.getItem('unsub2087v3');
        const blob=raw?JSON.parse(raw):null;
        const keep=blob&&blob.G?blob.G.lvl:0;
        g.G.lvl=1;g.G.cls='scrapper';
        const ok=blob&&g.applySave(blob);
        if(!ok||g.G.lvl!==keep||g.G.cls!==cls)issue(cls,'blocker','save did not restore this class','applySave of saveObj','applySave');
        g.G.seenIntro=true;g.G.q.q1=1;g.G.pre=2;
      }

      bucket.acts=acts;
    }catch(err){
      issue(cls,'blocker','run threw: '+(err&&err.message||err),'class loop',String(err&&err.stack||err).slice(0,400));
    }
  }

  /* shitcoiner, quest, party, hostility — once, on the scrapper already loaded */
  try{
    g.G.cls='scrapper';g.G.lvl=12;g.calc();
    g.enter(1);g.setMode('play');g.W.ents.length=0;
    const s=g.spawn('shill',g.P.x+1.1,g.P.y,{});
    s.coin='DogeNote';s.name='Shill for DogeNote';s.pitch=1;s.aggro=false;s.pt=30;s.hp=500;s.max=500;
    /* shillTalk is not exported. Drive the dialog by the button the player sees. */
    const talk=document.getElementById('log');
    /* Use the interaction the update loop uses when you stand on them: call via a synthetic nearest. */
  }catch(e){issue('all','major','shitcoiner setup threw','spawn shill',String(e.message||e))}

  Math.random=rnd;
  return {issues,notes,hud};
}, {CLASSES, ACTS});

/* shitcoiner through the real dialog, and a quest kill, and party/hostility */
const extra=await p.evaluate(()=>{
  const g=__g, out={};
  g.G.cls='scrapper';g.G.lvl=6;g.G.god=true;g.calc();
  g.enter(1);g.setMode('play');
  g.W.ents.length=0;
  const s=g.spawn('shill',g.P.x+0.6,g.P.y,{});
  s.coin='DogeNote';s.name='Shill for DogeNote';s.pitch=1;s.aggro=false;s.pt=30;s.hp=800;s.max=800;s.mods={};
  /* The talk button is raised by the interaction scan. Stand on the shill and read #obj. */
  g.update(0.05);
  out.obj=(document.getElementById('obj').textContent||'').slice(0,80);
  out.objHidden=document.getElementById('obj').hidden;
  return out;
});

/* Drive shillTalk by clicking the on-screen prompt if it appeared; otherwise invoke via a second evaluate that uses the dialog the game builds when obj is used. */
const shill=await p.evaluate(()=>{
  const g=__g;
  const s=g.W.ents.find(e=>e.k==='shill');
  if(!s)return {err:'no shill'};
  /* Reproduce the refuse button the dialog offers. shillTalk is in closure; the prompt calls talk which calls it.
     Fallback: set the same state the refuse button's callback sets, but only after confirming the dialog text. */
  const btn=document.getElementById('obj');
  if(btn&&!btn.hidden)btn.click();
  const d=document.getElementById('dlg');
  const title=(document.getElementById('dT')||{}).textContent||'';
  const body=(document.getElementById('dP')||{}).textContent||'';
  const btns=[...document.querySelectorAll('#dBtns button')].map(b=>({t:b.textContent,dis:b.disabled}));
  return {open:d&&!d.hidden,title,body:body.slice(0,240),btns,aggro:s.aggro};
});

let shillAfter=shill;
if(shill.open){
  await p.waitForTimeout(2500);
  shillAfter=await p.evaluate(()=>{
    const buttons=[...document.querySelectorAll('#dBtns button')];
    const no=buttons.find(b=>/bitcoin/i.test(b.textContent)&&!b.disabled);
    if(no)no.click();
    const s=__g.W.ents.find(e=>e.k==='shill');
    return {clicked:!!no,aggro:s?s.aggro:null,toast:(document.getElementById('log')||{}).textContent||''};
  });
}

const rest=await p.evaluate(()=>{
  const g=__g, out={};
  /* quest: Defrag is q3. A generic tally — find a quest whose step is "kill n of kind". */
  g.G.cls='courier';g.G.lvl=8;g.G.god=true;g.G.q.q1=1;
  g.enter(1);g.setMode('shot');g.W.ents.length=0;
  /* Force a tally if one is active. Otherwise kill a quest-tagged drone and see G.q move when the quest is the kill. */
  const before=JSON.stringify(g.G.q);
  const e=g.spawn('drone',g.P.x+0.8,g.P.y,{});
  e.q='q1';e.hp=1;e.stun=99;g.G.q.q1=1;
  g.kill(e);
  out.qBefore=before;out.q1=g.G.q.q1;

  /* party tab absent without a server; hostility message does not throw */
  g.openSheet('char');
  out.partyTab=!!document.querySelector('[data-tab="party"]');
  g.closeSheet();
  out.mpOn=window.__mp?window.__mp.on:null;
  try{
    if(window.__mp){window.__mp.MP.me={uid:'solo'};window.__mp.send('noop',{})}
    out.mp='send-ok';
  }catch(err){out.mp=String(err.message||err)}

  /* learn lock: Act I level 1 cannot spend onto row 4 */
  g.G.cls='scrapper';g.G.lvl=1;g.G.act2=0;g.G.act3=0;g.G.sp=10;g.G.sk=[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0];g.G.pas=[];
  g.enter(0);g.setMode('play');
  g.openSheet('skills');
  const node=document.querySelector('[data-node="9"]');
  if(node)node.click();
  const learn=document.querySelector('[data-learn="9"]');
  out.learnDisabled=learn?learn.disabled:null;
  if(learn&&!learn.disabled)learn.click();
  out.sk9=g.G.sk[9];
  g.closeSheet();

  /* attribute spend */
  g.G.ap=5;g.G.at={mgt:0,ref:0,vit:0,bnd:0};g.calc();
  const hp0=g.S.maxHp;
  g.openSheet('char');
  const vit=document.querySelector('[data-at="vit"],[data-attr="vit"]');
  out.vitBtn=!!vit;
  if(vit)vit.click();
  out.ap=g.G.ap;out.vit=g.G.at.vit;out.hp=g.S.maxHp;out.hp0=hp0;
  g.closeSheet();

  /* skill sheet overflow at phone width */
  const clips=[];
  for(const cls of ['scrapper','hacker','courier','anon','founder','homesteader','witness','maxi']){
    g.G.cls=cls;g.G.lvl=51;g.G.act2=1;g.G.act3=1;g.G.sp=0;g.G.sk=Array(15).fill(1);
    g.openSheet('skills');
    const nodes=[...document.querySelectorAll('#sheet .node b,#sheet .node u,#sheet .card .ln,#sheet .card .nm')];
    for(const n of nodes){
      if(n.scrollHeight>n.clientHeight+3||n.scrollWidth>n.clientWidth+3)
        clips.push(cls+': '+n.textContent.replace(/\s+/g,' ').slice(0,70));
    }
    g.closeSheet();
  }
  out.clips=clips.slice(0,24);
  return out;
});

/* screenshots of the skill sheet and the acqui-hire card */
await p.evaluate(()=>{
  __g.G.cls='founder';__g.G.lvl=30;__g.G.act2=1;__g.G.act3=1;__g.G.sk=Array(15).fill(1);__g.G.sp=0;
  __g.openSheet('skills');
  const n=document.querySelector('[data-node="7"]');if(n)n.click();
});
await p.waitForTimeout(150);
if(OUT)await p.screenshot({path:path.join(OUT,'class-acqui-card.png')});
await p.evaluate(()=>{__g.closeSheet();__g.G.cls='maxi';__g.ACC.maxi=1;__g.G.lvl=51;__g.G.act2=1;__g.G.act3=1;__g.G.sk=Array(15).fill(1);__g.openSheet('skills')});
await p.waitForTimeout(150);
if(OUT)await p.screenshot({path:path.join(OUT,'class-maxi-skills.png')});
await p.evaluate(()=>__g.closeSheet());

/* a fight frame */
await p.evaluate(()=>{
  __g.G.cls='scrapper';__g.G.lvl=8;__g.G.god=false;__g.G.sk=[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0];__g.calc();
  __g.enter(1);__g.setMode('shot');
  const sc=document.getElementById('scene');if(sc&&!sc.hidden)document.getElementById('scSkip').click();
  __g.W.ents.length=0;
  const e=__g.spawn('tick',__g.P.x+1.3,__g.P.y,{});e.aggro=true;e.stun=0;
  __g.P.dir={x:1,y:0};__g.attack();__g.update(0.05);__g.render();
});
if(OUT)await p.screenshot({path:path.join(OUT,'class-fight.png')});

await b.close();

const lines=[];
lines.push('TITLE '+JSON.stringify(title));
lines.push('WALK '+JSON.stringify(walk));
lines.push('SHILL '+JSON.stringify(shill));
lines.push('SHILL2 '+JSON.stringify(shillAfter));
lines.push('EXTRA '+JSON.stringify(extra));
lines.push('REST '+JSON.stringify(rest));
lines.push('ISSUES '+report.issues.length);
for(const it of report.issues)lines.push('ISSUE '+JSON.stringify(it));
for(const cls of report.notes){
  lines.push('CLASS '+cls.cls+' '+cls.n);
  for(const s of cls.skills){
    if(!s.a){lines.push('  P '+s.i+' '+s.n+' '+JSON.stringify(s.passive.after));continue}
    const sn=s.snap||{};
    const dmg=sn.hp!=null?Math.round(100000-sn.hp):0;
    lines.push('  A '+s.i+' '+s.n+' cost '+s.cost+'/'+s.spent+' cd '+s.cd+'/'+s.cdGot+' dmg '+dmg+' allies '+(sn.allies||[]).map(a=>a.k+':'+a.kind).join(',')+' moved '+(s.moved?1:0)+' buff '+(sn.buff||0)+' guard '+(sn.guard||0)+' haste '+(sn.haste||0)+' stealth '+(sn.stealth||0)+' aura '+(sn.aura||0)+' form '+(sn.form||'')+' toast '+JSON.stringify((sn.toast||'').slice(0,80))+(s.threw?' THROW '+s.threw:''));
  }
  lines.push('  ACTS '+cls.acts.map(a=>a.name+':'+(a.moved?'move':'stuck')+'/'+a.dmg).join(' '));
}
if(errs.length)lines.push('ERRS '+[...new Set(errs)].slice(0,12).join(' | '));
const text=lines.join('\n');
console.log(text);
if(OUT)fs.writeFileSync(path.join(OUT,'class-run.txt'),text);
process.exit(report.issues.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
