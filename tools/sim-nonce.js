/* Walkthrough, Codex, and Nonce against the rig, the rush, and the wallet.
   node tools/sim-nonce.js [outdir] */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const OUT=process.argv[2];
const fail=m=>{console.error(m);process.exitCode=1;throw new Error(m)};
const root=path.join(__dirname,'..');

async function ready(p){
  await p.evaluate(()=>__g.fillSlide());
  await p.waitForFunction(()=>!document.getElementById('scNext').disabled);
}

(async()=>{
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.stack||String(e)));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8')+'</body></html>');
await p.waitForTimeout(400);
await p.evaluate(()=>__g.skipDisc());
await p.waitForTimeout(200);
await p.click('#bWalk');
await p.waitForFunction(()=>!document.getElementById('dlg').hidden);
await p.evaluate(()=>[...document.querySelectorAll('#dBtns button')].find(b=>b.textContent==='Advanced').click());
await p.waitForFunction(()=>!document.getElementById('scene').hidden&&__g.walkState()&&__g.walkState().title==='The rig');
await ready(p);
const rig=await p.evaluate(()=>document.getElementById('scText').textContent);
if(!/lockbox every five waves/.test(rig))fail('rig slide '+rig);
if(OUT)await p.screenshot({path:path.join(OUT,'sim-rig.png')});
await p.click('#scNext');
await p.waitForFunction(()=>__g.walkState()&&__g.walkState().title==='Boss rush');
await ready(p);
const rush=await p.evaluate(()=>document.getElementById('scText').textContent);
if(!/ten more sats/.test(rush)||!/walked out of/.test(rush))fail('rush slide '+rush);
if(OUT)await p.screenshot({path:path.join(OUT,'sim-rush.png')});
await p.click('#scNext');
await p.waitForFunction(()=>__g.walkState()&&__g.walkState().title==="Nonce\u2019s market");
await ready(p);
const mkt=await p.evaluate(()=>document.getElementById('scText').textContent);
if(!/bought in sats/.test(mkt)||!/those prices stay/.test(mkt))fail('market slide '+mkt);
await p.click('#scNext');
await p.waitForFunction(()=>__g.walkState()&&__g.walkState().title==='Twelve words');
await ready(p);
const words=await p.evaluate(()=>document.getElementById('scText').textContent);
if(!/right words, in the right order/.test(words)||!/speak to Nonce/.test(words))fail('words slide '+words);
if(/take them to Nonce/.test(words))fail('words still say take them');
if(OUT)await p.screenshot({path:path.join(OUT,'sim-words.png')});
await p.click('#scSkip');
await p.waitForFunction(()=>document.getElementById('scene').hidden);

await p.evaluate(()=>{document.getElementById('title').hidden=true;__g.OPT.noWalk=1;__g.newGame('scrapper');__g.G.pre=2;__g.G.walkNew=0});
for(let i=0;i<10;i++){
  await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}});
  await p.waitForTimeout(80);
}
await p.evaluate(()=>__g.enter(0));
await p.waitForTimeout(200);
await p.evaluate(()=>{const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}});

const shop=await p.evaluate(()=>__g.satShop.map(o=>o.it.q));
if(!shop.length||shop.some(q=>q<2||q>4))fail('sat shop qualities '+shop.join(','));
await p.evaluate(()=>{__g.G.rep.btc=0;__g.G.lean=0;__g.G.scs=700;__g.openSheet('sats',{only:['sats']})});
await p.waitForTimeout(150);
const base=await p.evaluate(()=>[...document.querySelectorAll('[data-sat]')].map(el=>parseInt(el.querySelector('.pr').textContent,10)));
const raw=await p.evaluate(()=>__g.satShop.map(o=>o.price));
if(base.join()!==raw.join())fail('rank 0 price '+base+' vs '+raw);
await p.evaluate(()=>{__g.G.rep.btc=10;__g.drawSheet()});
await p.waitForTimeout(80);
const off=await p.evaluate(()=>[...document.querySelectorAll('[data-sat]')].map(el=>parseInt(el.querySelector('.pr').textContent,10)));
const want=raw.map(n=>Math.ceil(n*.9));
if(off.join()!==want.join())fail('rank 1 price '+off+' vs '+want);
if(OUT)await p.screenshot({path:path.join(OUT,'sim-nonce.png')});

await p.evaluate(()=>{__g.closeSheet();__g.openSheet('codex',{})});
await p.waitForTimeout(120);
const codex=await p.evaluate(()=>document.getElementById('sheet').innerText);
if(!/speak to Nonce/.test(codex)||!/do not have to still be in your pack/.test(codex))fail('codex seed line missing');
if(/take them to Nonce/.test(codex))fail('codex still says take them');

await p.evaluate(()=>{__g.closeSheet();__g.openSheet('travel',{only:['travel'],gFresh:1})});
await p.waitForTimeout(80);
await p.evaluate(()=>document.querySelector('[data-gact="6"]').click());
await p.waitForTimeout(80);
const more=await p.evaluate(()=>document.getElementById('sheet').innerText);
if(!/districts you have left/.test(more)||/everyone you have already beaten/.test(more))fail('more tab '+more.slice(0,400));

await p.evaluate(()=>{__g.closeSheet();__g.G.unlocked=2;for(const k in __g.G.q)__g.G.q[k]=0;__g.talkTo('vr')});
await p.waitForTimeout(100);
const one=await p.evaluate(()=>[...document.querySelectorAll('#dBtns button')].map(b=>b.textContent).find(t=>/Boss rush/.test(t)));
if(one!=='Boss rush: 1 in a row')fail('left a district '+one);
await p.evaluate(()=>{const b=[...document.querySelectorAll('#dBtns button')];(b.find(x=>x.textContent==='Not now')||b[b.length-1]).click();__g.G.unlocked=1;__g.G.q.q5=3;__g.talkTo('vr')});
await p.waitForTimeout(100);
const boss=await p.evaluate(()=>[...document.querySelectorAll('#dBtns button')].map(b=>b.textContent).find(t=>/Boss rush/.test(t)));
if(boss!=='Boss rush: 1 in a row')fail('executive '+boss);

const rnd=await p.evaluate(()=>{
  const keep=Math.random;
  Math.random=()=>0.5;
  __g.G.god=1;
  __g.enter(6,{wave:1});
  __g.setMode('play');
  const n=[];
  for(let i=0;i<6;i++){
    __g.W.ents.length=0;__g.W.sim.t=0;
    const b=__g.W.drops.length;
    __g.update(0.05);
    n.push(__g.W.drops.length-b);
  }
  const wave5=/lieutenant joins/.test(document.getElementById('log').textContent);
  Math.random=keep;
  return {n,wave5,zone:document.getElementById('zone').textContent};
});
if(rnd.n.slice(0,5).join()!=='0,1,1,1,1'||rnd.n[5]<2)fail('wave drops '+rnd.n.join(','));
if(!rnd.wave5)fail('no lieutenant toast');

const purse=await p.evaluate(()=>{
  __g.W.sim={rush:1,i:-1,t:0,list:[{k:'drone',n:'Test',mods:[]}],wave:0};
  __g.W.ents.length=0;
  const a=__g.G.sats;
  __g.update(0.05);
  __g.W.ents.length=0;__g.W.sim.t=0;
  __g.update(0.05);
  return __g.G.sats-a;
});
if(purse!==12)fail('rush purse '+purse);

const phrase=await p.evaluate(()=>{
  const it=__g.makeItem(12,0,'weapon');
  it.slot='weapon';it.soc=3;it.words=[];it.aff=[];it.pw=null;
  __g.G.words={kernel:2,forge:2,desert:2};
  __g.socketWord(it,'kernel');__g.socketWord(it,'desert');__g.socketWord(it,'forge');
  const wrong=!it.pw;
  const it2=__g.makeItem(12,0,'weapon');
  it2.slot='weapon';it2.soc=3;it2.words=[];it2.aff=[];
  __g.socketWord(it2,'kernel');__g.socketWord(it2,'forge');__g.socketWord(it2,'desert');
  return {wrong,name:it2.name,pw:it2.pw,bonus:it.aff.length};
});
if(!phrase.wrong||phrase.pw!=='genesis'||phrase.bonus<3)fail('phrase '+JSON.stringify(phrase));

const wallet=await p.evaluate(()=>{
  document.getElementById('dlg').hidden=true;
  document.getElementById('scene').hidden=true;
  __g.setMode('play');
  __g.enter(0);
  __g.G.words={};
  __g.G.wallet=false;
  __g.G.st.wf={anchor:1,border:1,candle:1,desert:1,echo:1,forge:1,garden:1,hollow:1,island:1,kernel:1,ladder:1,mirror:1};
  __g.talkTo('nonce');
  return {t:document.getElementById('dT').textContent,b:[...document.querySelectorAll('#dBtns button')].map(x=>x.textContent),held:Object.keys(__g.G.words).length};
});
if(wallet.t!=='Nonce'||wallet.b[0]!=='Restore the wallet'||wallet.held!==0)fail('wallet '+JSON.stringify(wallet));
const shown=await p.evaluate(()=>({t:document.getElementById('dT').textContent,b:[...document.querySelectorAll('#dBtns button')].map(x=>x.textContent)}));
if(shown.t!=='Nonce'||shown.b[0]!=='Restore the wallet')fail('wallet left the screen '+JSON.stringify(shown));
if(OUT)await p.screenshot({path:path.join(OUT,'sim-wallet.png')});

if(errs.length)fail(errs[0]);
console.log('sim-nonce ok');
await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
