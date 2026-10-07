/* Click-check for the Transit Gate More tab.
   node tools/post-clear.js
   Loads dist/unsubscribe.html under setContent. */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const fail=m=>{console.error(m);process.exitCode=1;throw new Error(m)};
(async()=>{
const root=path.join(__dirname,'..');
const built=fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8');
if(!built.includes('On the Transit Gate, More respawns the districts and raises their tier.'))fail('end dialog does not name More');
if(!built.includes('The tier is on More.'))fail('Act I dialog does not name More');
if(built.includes('gateAct===4)h+=`<button class="ghost" data-dev="reset">'))fail('respawn still tied to Act IV');
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.stack||String(e)));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+built+'</body></html>');
await p.waitForTimeout(400);
await p.evaluate(()=>__g.skipDisc());
await p.waitForTimeout(150);
await p.evaluate(()=>{__g.newGame('scrapper');__g.G.walkNew=0});
const sk=async()=>{await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}})};
for(let i=0;i<16;i++){await sk();await p.waitForTimeout(80)}
await p.evaluate(()=>{const G=__g.G;G.walkNew=0;G.god=true;__g.enter(0)});
for(let i=0;i<6;i++){await sk();await p.waitForTimeout(60)}
const boot=await p.evaluate(()=>({mode:__g.mode,zi:__g.W&&__g.W.zi}));
if(boot.mode!=='play'||boot.zi!==0)fail('not in Stillwater '+JSON.stringify(boot));
await p.evaluate(()=>__g.openSheet('travel',{gFresh:1}));
await p.waitForTimeout(120);
await p.click('[data-gact="6"]');
await p.waitForTimeout(80);
let html=await p.evaluate(()=>document.getElementById('sheetIn').innerHTML);
if(!html.includes('Respawn all machines'))fail('fresh More has no respawn');
if(!html.includes('The VR rig in Stillwater'))fail('fresh More has no rig line');
if(html.includes('Subpoena')||html.includes('Tier')||html.includes('servo leg'))fail('fresh More shows locked replay tools');
await p.evaluate(()=>{const G=__g.G;for(let i=1;i<=25;i++)G.q['q'+i]=3;G.maxTier=2;G.tier=0;G.leg=1;G.sats=20;G.act4=G.act5=true});
await p.click('[data-gact="6"]');
await p.waitForTimeout(80);
html=await p.evaluate(()=>document.getElementById('sheetIn').innerHTML);
for(const s of ['Respawn all machines','Subpoena · Level','Jam the servo leg','Tier 0','The VR rig in Stillwater'])if(!html.includes(s))fail('cleared More missing '+s);
await p.click('[data-tier="1"]');
await p.waitForTimeout(80);
html=await p.evaluate(()=>document.getElementById('sheetIn').innerHTML);
if(!html.includes('Tier 1'))fail('tier did not step '+html.slice(html.indexOf('Tier'),html.indexOf('Tier')+80));
const tier=await p.evaluate(()=>__g.G.tier);
if(tier!==1)fail('G.tier '+tier);
await p.click('[data-gact="4"]');
await p.waitForTimeout(80);
html=await p.evaluate(()=>document.getElementById('sheetIn').innerHTML);
if(!html.includes('The Gentle Years'))fail('Act IV list missing');
if(html.includes('Respawn all machines')||html.includes('data-tier')||html.includes('data-sub')||html.includes('data-bull'))fail('Act IV still holds replay controls');
if(!html.includes('are on More'))fail('Act IV does not point at More');
if(errs.length)fail(errs[0]);
console.log('post-clear ok');
await b.close()})().catch(e=>{console.error(e);process.exit(1)});
