/* Shoot the skills whose pictures were wrong, with the real hit drawn in red.
   node tools/skill-gfx.js before /tmp/unsubscribe-before.html /tmp/gfx-before
   node tools/skill-gfx.js after  dist/unsubscribe.html        /tmp/gfx-after */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const label=process.argv[2]||'after';
const htmlPath=path.resolve(process.argv[3]||path.join(__dirname,'../dist/unsubscribe.html'));
const outDir=path.resolve(process.argv[4]||path.join('/tmp/gfx-'+label));
fs.mkdirSync(outDir,{recursive:true});

const SHOTS=[
  {id:'manifest',cls:'courier',i:12,t:.42},
  {id:'spark-lance',cls:'hacker',i:1,t:.32},
  {id:'stop-sign',cls:'scrapper',i:0,t:.05},
  {id:'turnstile',cls:'scrapper',i:3,t:.08},
  {id:'war-horn',cls:'scrapper',i:5,t:.08},
  {id:'earthbreaker',cls:'scrapper',i:7,t:.28,foe:4},
  {id:'lunch-pail',cls:'scrapper',i:9,t:.05},
  {id:'null-nova',cls:'hacker',i:3,t:.08},
  {id:'black-storm',cls:'hacker',i:6,t:.05},
  {id:'ground-fault',cls:'hacker',i:9,t:.05},
  {id:'packet-storm',cls:'hacker',i:10,t:.05},
  {id:'cold-frame',cls:'homesteader',i:0,t:.05},
  {id:'kill-frost',cls:'homesteader',i:9,t:.05},
  {id:'hedgerow',cls:'homesteader',i:6,t:.05},
  {id:'proxy-hop',cls:'anon',i:1,t:.05,foe:3.2},
  {id:'zip-bomb',cls:'anon',i:6,t:.08},
  {id:'legion',cls:'anon',i:8,t:.08},
  {id:'the-dump',cls:'anon',i:10,t:.08,reh:3},
  {id:'liquidation',cls:'founder',i:14,t:.08},
  {id:'honeypot',cls:'anon',i:0,t:.05},
  {id:'teleport',cls:'courier',isk:100,gear:'cipher',t:.08},
  {id:'standing-call',cls:'courier',isk:101,gear:'call',t:.08},
  {id:'quiet-ledger',cls:'courier',isk:103,gear:'ledger',t:.08},
  {id:'publish',cls:'witness',i:12,t:.08,page:1}
];

(async()=>{
const html=fs.readFileSync(htmlPath,'utf8');
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:1100,height:720}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
await p.waitForTimeout(250);
await p.evaluate(()=>__g.skipDisc());
await p.waitForTimeout(80);
await p.click('[data-cls=courier]');
await p.waitForTimeout(100);
await p.evaluate(()=>{__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1;__g.OPT.auto=false;__g.G.god=true});
for(let i=0;i<16;i++){
  const st=await p.evaluate(()=>{
    const s=document.getElementById('scene');if(s&&!s.hidden){document.getElementById('scSkip').click();return 's'}
    const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x){x.click();return 'd'}return 'l'}
    return 'c'});
  if(st==='c')break;
  await p.waitForTimeout(st==='l'?300:120);
}
await p.evaluate(()=>{__g.enter(0);__g.setMode('play')});
await p.waitForTimeout(80);

for(const shot of SHOTS){
  const uri=await p.evaluate(s=>{
    const g=__g,G=g.G,dir={x:.92,y:.38};const L=Math.hypot(dir.x,dir.y);dir.x/=L;dir.y/=L;
    G.cls=s.cls;G.lvl=60;G.god=true;G.form=null;G.formDt=null;G.sk=g.CLS[s.cls].sk.map(()=>1);
    if(s.gear&&g.tryGear)g.tryGear(s.gear);
    g.calc();g.setMode('play');G.en=g.S.maxEn;
    const P=g.P;P.x=g.W.start.x;P.y=g.W.start.y;P.dir=dir;P.dash=null;P.silence=0;P.castWait=0;P.hitStun=0;P.atk=0;
    if(P.cd)for(let i=0;i<200;i++)P.cd[i]=0;
    g.W.ents.length=0;g.W.projs.length=0;g.W.fx.length=0;g.W.allies.length=0;
    if(s.foe){const e=g.spawn('bot',P.x+dir.x*s.foe,P.y+dir.y*s.foe);if(e){e.stun=9;e.hp=e.max}}
    if(s.reh)P.reh=s.reh;
    if(s.page){G.page=80;const e=g.spawn('bot',P.x+dir.x*3.2,P.y+dir.y*3.2);if(e){e.stun=9;e.tes=4;e.watch=2;e.hp=e.max}}
    if(s.cls==='founder'){P.corpses=[{x:P.x+dir.x*2.2,y:P.y+dir.y*2.2,t:3}];}
    g.ensureMouse();G.mouse.R=s.isk||s.i;G.en=g.S.maxEn;
    if(s.isk)g.castIndex(s.isk);else g.castIndex(s.i);
    g.update(s.t||.08);
    for(const f of g.W.fx)if(f&&f.k==='ring'&&f.life)f.t=f.life*.9;
    g.render();
    const cv=document.getElementById('cv'),ctx=cv.getContext('2d'),r=cv.getBoundingClientRect();
    const CW=r.width,CH=r.height,DPR=Math.min(2,window.devicePixelRatio||1);
    const ZM=Math.max(.68,Math.min(1.25,Math.min(CW,CH)/560)),VW=CW/ZM,VH=CH/ZM;
    const cx=(P.x-P.y)*32,cy=(P.x+P.y)*16;
    const SX=(x,y)=>(x-y)*32-cx+VW/2,SY=(x,y)=>(x+y)*16-cy+VH*.44;
    ctx.setTransform(DPR*ZM,0,0,DPR*ZM,0,0);ctx.save();ctx.setLineDash([5,4]);ctx.lineWidth=1.7;ctx.strokeStyle='#ff3355';ctx.fillStyle='rgba(255,51,85,.14)';
    const circ=(x,y,rr)=>{ctx.beginPath();ctx.ellipse(SX(x,y),SY(x,y),Math.max(3,rr*45.25),Math.max(2,rr*22.63),0,0,6.283);ctx.fill();ctx.stroke()};
    const ray=(x,y,dx,dy,len)=>{ctx.beginPath();ctx.moveTo(SX(x,y),SY(x,y));ctx.lineTo(SX(x+dx*len,y+dy*len),SY(x+dx*len,y+dy*len));ctx.stroke()};
    const id=s.id;
    if(id==='manifest'){ray(P.x,P.y,dir.x,dir.y,7.7);for(const q of g.W.projs)circ(q.x,q.y,.3)}
    else if(id==='spark-lance'){ray(P.x,P.y,dir.x,dir.y,10.5);for(const q of g.W.projs)circ(q.x,q.y,.3)}
    else if(id==='stop-sign'){ray(P.x,P.y,dir.x,dir.y,2.4);circ(P.x,P.y,2.4)}
    else if(id==='turnstile'||id==='honeypot')circ(P.x,P.y,id==='honeypot'?2.6:2.5)
    else if(id==='war-horn')circ(P.x,P.y,4)
    else if(id==='null-nova')circ(P.x,P.y,3.4)
    else if(id==='legion'||id==='the-dump')circ(P.x,P.y,9)
    else if(id==='liquidation')circ(P.x,P.y,5)
    else if(id==='lunch-pail'){const a=g.W.allies.find(z=>z.k==='pail');circ(a?a.x:P.x,a?a.y:P.y,2.6)}
    else if(id==='cold-frame'){const a=g.W.allies.find(z=>z.k==='plot');circ(a?a.x:P.x+dir.x*1.2,a?a.y:P.y+dir.y*1.2,2.2)}
    else if(id==='kill-frost'){const a=g.W.allies.find(z=>z.k==='plot');circ(a?a.x:P.x,a?a.y:P.y,3.4)}
    else if(id==='ground-fault'){const a=g.W.allies.find(z=>z.k==='fault');if(a)for(const pt of a.pts||[])circ(pt.x,pt.y,a.r||.75);else ray(P.x,P.y,dir.x,dir.y,4.5)}
    else if(id==='packet-storm'){const a=g.W.allies.find(z=>z.k==='pstorm');circ(a?a.x:P.x+dir.x*4,a?a.y:P.y+dir.y*4,2.2)}
    else if(id==='black-storm'){const a=g.W.allies.find(z=>z.k==='storm');circ(a?a.x:P.x+dir.x*4,a?a.y:P.y+dir.y*4,3.5)}
    else if(id==='zip-bomb')circ(P.x+dir.x*4,P.y+dir.y*4,2.2)
    else if(id==='hedgerow'){for(const a of g.W.allies)if(a.k==='hedge')circ(a.x,a.y,a.r||.42)}
    else if(id==='proxy-hop'){ray(g.W.start.x,g.W.start.y,P.x-g.W.start.x,P.y-g.W.start.y,1);circ(P.x,P.y,.4)}
    else if(id==='earthbreaker'){const e=g.W.ents[0];if(e){ray(g.W.start.x,g.W.start.y,e.x-g.W.start.x,e.y-g.W.start.y,1);circ(e.x,e.y,3)}else circ(P.x,P.y,3)}
    else if(id==='teleport'){ray(g.W.start.x,g.W.start.y,P.x-g.W.start.x,P.y-g.W.start.y,1)}
    else if(id==='standing-call'||id==='quiet-ledger')circ(P.x,P.y,6)
    else if(id==='publish'){for(const e of g.W.ents)circ(e.x,e.y,.45)}
    ctx.restore();
    return cv.toDataURL('image/png');
  },shot);
  fs.writeFileSync(path.join(outDir,shot.id+'.png'),Buffer.from(uri.split(',')[1],'base64'));
}
await b.close();
if(errs.length)console.error(label+' page '+errs.slice(0,4).join(' | '));
console.log(label+' shots '+SHOTS.length+' -> '+outDir);
})().catch(e=>{console.error(e);process.exit(1)});
