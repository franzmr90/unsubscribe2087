/* Menu tabs keep a tall sheet to about one screen and remember the last tab.
   node tools/menu-tabs.js */
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
      const port=document.getElementById('uiPortX');
      if(port&&!port.closest('#uiPort').hidden){port.click();return 'port'}
      return 'clear'});
    if(st==='clear')return;
    await p.waitForTimeout(st==='locked'?350:80);
  }
  throw new Error('overlays did not clear');
}

(async()=>{
  const html=fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8');
  const fail=[];
  const check=(n,ok,d)=>{if(!ok)fail.push(n+(d?': '+JSON.stringify(d):''));};
  const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
  const shots=[];
  async function boot(w,h,touch){
    const p=await b.newPage({viewport:{width:w,height:h},hasTouch:touch});
    const errs=[];p.on('pageerror',e=>errs.push(e.message));
    await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
    await p.waitForTimeout(200);
    await p.evaluate(()=>__g.skipDisc());
    await p.click('[data-cls=scrapper]');
    await p.waitForTimeout(100);
    await p.evaluate(()=>{__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1});
    await clearUI(p);
    await p.evaluate(()=>__g.enter(0));
    await clearUI(p);
    await p.evaluate(touch=>{
      const g=__g,G=g.G;
      G.lvl=80;G.act2=G.act3=G.act4=G.act5=1;G.ap=4;G.sp=3;G.sats=400;G.credits=80000;G.kills=400;
      G.xp=10;G.cpi=4.2;G.adopt=42;
      for(const k in g.QUESTS)G.q[k]=2;
      for(const k in g.SQ)G.sq[k]={s:1,c:1,done:0};
      G.memos=[];for(let i=0;i<24;i++)G.memos.push(i);
      G.merc={k:'guard',name:'Rook',hp:80,ab1:'guard',ab2:'medic',dead:0,weapon:null,armor:null,helm:null};
      g.mktInit();
      G.mkt.cb={n:30,cr:4000,st:8};
      G.mkt.ord=[{s:'buy',n:10,px:100,esc:1200}];
      G.mkt.pos={n:20,lent:2000,liq:40};
      G.mkt.news=[{n:1,w:'A district lit a node.'}];
      g.bounties();
      g.OPT.ui=touch?'touch':'mouse';g.uiApply(true);
      const port=document.getElementById('uiPortX');if(port)port.click();
      g.setMode('play');
    }, touch);
    return {p,errs};
  }
  async function measure(p, tab){
    return p.evaluate(tab=>{
      __g.closeSheet();__g.setMode('play');__g.openSheet(tab,{});
      const body=document.querySelector('#sheet .sheetBody');
      const tabs=[...document.querySelectorAll('.menuTabs button')].map(b=>({t:b.textContent,on:b.classList.contains('big'),h:Math.round(b.getBoundingClientRect().height)}));
      const panes=[...document.querySelectorAll('.menuPane')].map(el=>{
        const on=!el.classList.contains('off');
        return {id:el.dataset.mpane,on,h:on?el.scrollHeight:0};
      });
      const over=body.scrollHeight-body.clientHeight;
      const hidden=document.querySelector('.menuPane.off');
      const hidText=hidden?hidden.innerText.length:0;
      const text=hidden?hidden.textContent.length:0;
      return {over,client:body.clientHeight,scroll:body.scrollHeight,tabs,panes,hidText,text,err:document.getElementById('sheet').hidden};
    }, tab);
  }

  const phone=await boot(390,844,true);
  const names=['char','quests','story','codex','opts','party','merc','sats','shift'];
  const phoneOut={};
  for(const t of names)phoneOut[t]=await measure(phone.p,t);
  check('phone sheets open without a page error', !phone.errs.length, phone.errs[0]);
  for(const t of names){
    const m=phoneOut[t];
    check(t+' has tabs', m.tabs.length>=2, m.tabs);
    check(t+' phone tab is a thumb target', m.tabs.every(b=>b.h>=44), m.tabs);
    check(t+' shows one pane', m.panes.filter(p=>p.on).length===1, m.panes.map(p=>p.id+':'+(p.on?1:0)));
  }
  const codex=phoneOut.codex;
  check('codex keeps the satoshi line in the page', await phone.p.evaluate(()=>{__g.setMode('play');__g.openSheet('codex',{});return /Vale \(42\)/.test(document.getElementById('sheetIn').textContent)}));
  check('a closed codex pane still has its words for tests', codex.text>20, codex);

  console.log('PHONE early');
  for(const t of names){const m=phoneOut[t];console.log(t,'over',m.over,'of',m.client,'tabs',(m.tabs||[]).map(x=>x.t).join('|'));}
  const sweep=await phone.p.evaluate(()=>{
    const out=[];
    const want=['codex','opts','story','quests','char','sats'];
    for(const key of want){
      __g.setMode('play');__g.openSheet(key,{});
      const ids=[...document.querySelectorAll('#sheet [data-mside]')].map(b=>b.dataset.mside).filter(s=>s.indexOf(key+':')===0);
      for(const id of ids){
        const b=[...document.querySelectorAll('#sheet [data-mside]')].find(x=>x.dataset.mside===id);
        b.click();
        const body=document.querySelector('#sheet .sheetBody');
        out.push(id+' over '+(body.scrollHeight-body.clientHeight)+' wide '+(body.scrollWidth-body.clientWidth));
      }
    }
    return out;
  });
  console.log('SWEEP');
  sweep.forEach(s=>console.log(s));
  await phone.p.evaluate(()=>{
    __g.setMode('play');__g.openSheet('codex',{});
    const b=[...document.querySelectorAll('[data-mside]')].find(x=>x.dataset.mside==='codex:drops');
    if(!b)throw new Error('no drops tab '+[...document.querySelectorAll('[data-mside]')].map(x=>x.dataset.mside).join(','));
    b.click();
  });
  await phone.p.evaluate(()=>{__g.closeSheet();__g.setMode('play');__g.openSheet('codex',{})});
  const remembered=await phone.p.evaluate(()=>{
    const on=document.querySelector('.menuPane:not(.off)');
    return on&&on.dataset.mpane;
  });
  check('the codex remembers Drops', remembered==='codex:drops', remembered);

  const saveHit=await phone.p.evaluate(()=>{
    __g.setMode('play');__g.openSheet('opts',{});
    const b=document.querySelector('.menuFoot [data-save]');
    const w=document.querySelector('[data-walk]');
    const r=b.getBoundingClientRect(), rw=w.getBoundingClientRect();
    const top=document.elementFromPoint(r.x+r.width/2, r.y+Math.min(r.height/2,20));
    return {save:!!(top&&(top===b||b.contains(top))), walk:rw.top>=0&&rw.bottom<=innerHeight, saveIn:r.bottom<=innerHeight+1&&r.top>=0};
  });
  check('Save now and Walkthrough stay on screen', saveHit.save&&saveHit.walk&&saveHit.saveIn, saveHit);

  const qnext=await phone.p.evaluate(()=>{
    __g.setMode('play');__g.openSheet('quests',{});
    const p=[...document.querySelectorAll('#sheet p')].find(n=>/Next in the story/.test(n.textContent));
    if(!p)return {miss:true};
    const r=p.getBoundingClientRect();
    return {in:r.top>=0&&r.bottom<=innerHeight, text:p.textContent.slice(0,40)};
  });
  check('the next story line stays above the quest tabs', qnext.in, qnext);

  check('the exchange opens on the counter', phoneOut.sats.tabs[0]&&phoneOut.sats.tabs[0].on&&phoneOut.sats.tabs[0].t==='Counter', phoneOut.sats.tabs);
  const buy=await phone.p.evaluate(()=>{
    __g.setMode('play');__g.openSheet('sats',{});
    const tab=[...document.querySelectorAll('[data-mside]')].find(x=>x.dataset.mside==='sats:counter');
    if(tab)tab.click();
    const b=document.querySelector('[data-mkt="b"]');
    const pane=document.querySelector('.menuPane:not(.off)');
    const lend=pane?pane.textContent:'';
    const r=b.getBoundingClientRect();
    return {buy:b&&r.height>10, loan:/Mr\. Float/.test(lend), side:pane&&pane.dataset.mpane};
  });
  check('the counter still shows buy and the loan', buy.side==='sats:counter'&&buy.buy&&buy.loan, buy);

  for(const t of ['codex','story','quests','opts','sats','char']){
    await phone.p.evaluate(tab=>{__g.setMode('play');__g.openSheet(tab,{});}, t);
    const file='/opt/cursor/artifacts/menu-phone-'+t+'.png';
    await phone.p.screenshot({path:file});
    shots.push(file);
  }
  await phone.p.evaluate(()=>{__g.setMode('play');__g.openSheet('story',{});const b=[...document.querySelectorAll('[data-mside]')].find(x=>x.dataset.mside==='story:g2');if(b)b.click()});
  await phone.p.screenshot({path:'/opt/cursor/artifacts/menu-phone-story-money.png'});
  await phone.p.evaluate(()=>{__g.setMode('play');__g.openSheet('codex',{});const b=[...document.querySelectorAll('[data-mside]')].find(x=>x.dataset.mside==='codex:memos');if(b)b.click()});
  await phone.p.screenshot({path:'/opt/cursor/artifacts/menu-phone-codex-memos.png'});
  await phone.p.evaluate(()=>{__g.setMode('play');__g.openSheet('char',{});const b=[...document.querySelectorAll('[data-mside]')].find(x=>x.dataset.mside==='char:people');if(b)b.click()});
  await phone.p.screenshot({path:'/opt/cursor/artifacts/menu-phone-people.png'});

  const desk=await boot(1280,800,false);
  const deskOut={};
  for(const t of names)deskOut[t]=await measure(desk.p,t);
  check('desk sheets open without a page error', !desk.errs.length, desk.errs[0]);
  for(const t of ['codex','story','quests','sats','char','opts']){
    check('desk '+t+' has the same tabs', deskOut[t].tabs.map(x=>x.t).join(',')===phoneOut[t].tabs.map(x=>x.t).join(','), deskOut[t].tabs);
  }

  const dlg=await desk.p.evaluate(()=>{
    __g.closeSheet();__g.setMode('play');
    const names=['gramps','brenda','nonce','kestrel','float'];
    const out={};
    for(const id of names){
      try{__g.talkTo(id)}catch(e){out[id]={err:String(e)};continue}
      const card=document.querySelector('#dlg .card');
      const dlg=document.getElementById('dlg');
      out[id]=card?{over:card.scrollHeight-card.clientHeight,dlg:dlg.scrollHeight-dlg.clientHeight,h:card.scrollHeight}:{missing:true};
      const d=document.getElementById('dlg');if(d)d.hidden=true;
      __g.setMode('play');
    }
    return out;
  });

  console.log('PHONE');
  for(const t of names){
    const m=phoneOut[t];
    console.log(t, 'over', m.over, 'of', m.client, 'tabs', m.tabs.map(x=>x.t).join('|'), 'pane', m.panes.filter(p=>p.on).map(p=>p.h).join(','));
  }
  console.log('DESK');
  for(const t of names){
    const m=deskOut[t];
    console.log(t, 'over', m.over, 'of', m.client);
  }
  console.log('DLG', JSON.stringify(dlg));
  await phone.p.close();await desk.p.close();await b.close();
  if(fail.length){console.log('FAIL');fail.forEach(f=>console.log(' - '+f));process.exit(1)}
  console.log('menu-tabs ok');
})().catch(e=>{console.error(e);process.exit(1)});
