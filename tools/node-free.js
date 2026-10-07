/* The node button names a free light when the purse pays nothing.
   node tools/node-free.js */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');

(async()=>{
const html=fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8');
const fail=[];
const check=(n,ok,d)=>{if(!ok)fail.push(n+(d?': '+d:''));};
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
await p.waitForTimeout(400);
await p.evaluate(()=>{__g.skipDisc();__g.OPT.noWalk=1});
await p.evaluate(()=>{document.getElementById('title').hidden=true;__g.newGame('scrapper');__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1;__g.G.in1=1;__g.G.nodes=__g.G.nodes||{};__g.G.rep=__g.G.rep||{btc:0,anon:0,norm:0};__g.G.adopt=__g.G.adopt||20});
await p.evaluate(()=>__g.enter(1));
await p.waitForTimeout(200);
for(let i=0;i<8;i++){
  await p.evaluate(()=>{const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}});
  await p.waitForTimeout(50);
}
await p.evaluate(()=>{const s=document.getElementById('scene');if(s)s.hidden=true;const d=document.getElementById('dlg');if(d)d.hidden=true;__g.setMode('play')});

const stand=()=>p.evaluate(()=>{
  const n=__g.W.objs.find(o=>o.k==='dnode'&&!o.used);
  if(!n)return '';
  __g.P.x=n.x;__g.P.y=n.y;
  return 'on';
});

await p.evaluate(()=>{__g.G.scs=400;__g.G.sats=0;delete __g.G.nodes[__g.W.zi]});
check('a node is in the district', (await stand())==='on');
await p.waitForTimeout(150);
const free=await p.evaluate(()=>document.getElementById('bAct').textContent);
check('below 500 the button says free', free==='Bring this node online (free)', free);
await p.evaluate(()=>document.getElementById('bAct').click());
await p.waitForTimeout(80);
const lit=await p.evaluate(()=>({sats:__g.G.sats,up:__g.G.nodes[__g.W.zi]}));
check('a free light spends no sats', lit.sats===0&&lit.up===1, JSON.stringify(lit));

await p.evaluate(()=>{
  const n=__g.W.objs.find(o=>o.k==='dnode');
  if(n)n.used=0;
  delete __g.G.nodes[__g.W.zi];
  __g.G.scs=700;__g.G.sats=3;
});
check('still beside the node', (await stand())==='on');
await p.waitForTimeout(150);
const priced=await p.evaluate(()=>document.getElementById('bAct').textContent);
check('at 500 the button says 5 sats', priced==='Bring this node online (5 sats)', priced);
await p.evaluate(()=>document.getElementById('bAct').click());
await p.waitForTimeout(80);
const short=await p.evaluate(()=>({sats:__g.G.sats,up:__g.G.nodes[__g.W.zi]||0}));
check('three sats cannot light it', short.sats===3&&!short.up, JSON.stringify(short));

await p.evaluate(()=>{__g.G.sats=5});
await p.evaluate(()=>document.getElementById('bAct').click());
await p.waitForTimeout(80);
const paid=await p.evaluate(()=>({sats:__g.G.sats,up:__g.G.nodes[__g.W.zi]}));
check('five sats lights it', paid.sats===0&&paid.up===1, JSON.stringify(paid));

await p.evaluate(()=>{
  const n=__g.W.objs.find(o=>o.k==='dnode');
  if(!n)return;
  n.used=0;
  delete __g.G.nodes[__g.W.zi];
  __g.G.scs=400;__g.G.sats=0;
  __g.P.x=n.x;__g.P.y=n.y;
  const s=document.getElementById('scene');if(s)s.hidden=true;
  const d=document.getElementById('dlg');if(d)d.hidden=true;
  __g.setMode('play');
});
await p.waitForTimeout(200);
await p.screenshot({path:'/opt/cursor/artifacts/screenshot_node_free.png'});

check('no page errors', !errs.length, errs.join('; '));
await b.close();
console.log(fail.length?'FAIL\n'+fail.join('\n'):'node-free ok');
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
