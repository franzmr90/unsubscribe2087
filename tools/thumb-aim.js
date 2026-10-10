/* A finger aims from the skill button. Phone and tablet, portrait and landscape.
   The reticle moves out as the thumb leaves the button and back in as it returns.
   node tools/thumb-aim.js */
const {chromium, devices}=require('playwright');
const fs=require('fs');
const path=require('path');
const {execFileSync}=require('child_process');
const root=path.join(__dirname,'..');
const out=process.env.THUMB_OUT||'/opt/cursor/artifacts/thumb-aim';

function sideways(d){
  const v=d.viewport;
  return Object.assign({}, d, {
    viewport:{width:v.height, height:v.width},
    screen:{width:v.height, height:v.width},
    isLandscape:true
  });
}

async function clearUI(p){
  for(let i=0;i<24;i++){
    const st=await p.evaluate(()=>{
      const s=document.getElementById('scene');
      if(s&&!s.hidden){document.getElementById('scSkip').click();return 'scene'}
      const d=document.getElementById('dlg');
      if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x){x.click();return 'dlg'}return 'locked'}
      const ban=document.getElementById('uiPort');
      if(ban&&!ban.hidden){const x=document.getElementById('uiPortX');if(x)x.click()}
      return 'clear'});
    if(st==='clear')return;
    await p.waitForTimeout(st==='locked'?350:160);
  }
  throw new Error('overlays did not clear');
}

async function boot(page){
  const html=fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8');
  const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>',{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(250);
  await page.evaluate(()=>__g.skipDisc());
  await page.waitForTimeout(100);
  await page.evaluate(()=>__g.noteInput('touch'));
  await page.click('[data-cls=hacker]');
  await page.waitForTimeout(150);
  await page.evaluate(()=>{__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1;__g.OPT.auto=false;__g.OPT.aim='auto';__g.G.god=true});
  await clearUI(page);
  await page.evaluate(()=>{__g.enter(1);__g.setMode('play');__g.noteInput('touch')});
  await clearUI(page);
  await page.waitForTimeout(120);
  return errs;
}

async function place(page){
  return page.evaluate(()=>{
    const g=__g,W=g.W,N=W.N,P=g.P;
    let best=null,bn=-1;
    for(let y=4;y<N-4;y++)for(let x=4;x<N-4;x++){
      if(W.map[y*N+x]!==1)continue;
      let n=0;
      for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++)if(W.map[(y+dy)*N+(x+dx)]===1)n++;
      if(n>bn){bn=n;best={x:x+.5,y:y+.5}}
    }
    P.x=best.x;P.y=best.y;P.dir={x:1,y:0};
    W.ents.length=0;W.allies.length=0;
    g.G.cls='hacker';g.G.sk[6]=1;g.G.slots[0]=6;g.G.en=900;P.cd[6]=0;P.castWait=0;
    g.OPT.aim='auto';g.noteInput('touch');g.render();
    const b=document.querySelector('.sk[data-i="0"]').getBoundingClientRect();
    const home={x:b.left+b.width/2,y:b.top+b.height/2};
    const stick=g.aimStickMetrics(home.x,home.y);
    return {best,home,stick,bw:b.width,vw:innerWidth,vh:innerHeight};
  });
}

(async()=>{
const htmlOk=fs.existsSync(path.join(root,'dist/unsubscribe.html'));
if(!htmlOk)throw new Error('build first');
fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const fail=[];
const shots=[];
const profiles=[
  ['phone-sideways', sideways(devices['iPhone 13'])],
  ['phone-portrait', devices['iPhone 13']],
  ['tablet-sideways', sideways(devices['iPad Pro 11'])],
  ['tablet-portrait', devices['iPad Pro 11']],
  ['pixel-sideways', sideways(devices['Pixel 5'])]
];
for(const [name, device] of profiles){
  const ctx=await b.newContext(Object.assign({}, device));
  const page=await ctx.newPage();
  const errs=await boot(page);
  const laid=await place(page);
  if(!(laid.bw>8))fail.push(name+' skill button has no box');
  if(laid.stick.reach>Math.min(laid.home.x,laid.home.y,laid.vw-laid.home.x,laid.vh-laid.home.y)+1)fail.push(name+' stick leaves the screen '+JSON.stringify(laid.stick)+' home '+JSON.stringify(laid.home));
  const span=Math.max(8,laid.stick.reach-laid.stick.dead);
  const steps=[
    ['rest', 0],
    ['out', laid.stick.dead+span*0.92],
    ['in', laid.stick.dead+span*0.28]
  ];
  const seen=[];
  for(const [label, dist] of steps){
    const row=await page.evaluate(({dist})=>{
      const g=__g,b=document.querySelector('.sk[data-i="0"]'),r=b.getBoundingClientRect();
      const home={x:r.left+r.width/2,y:r.top+r.height/2};
      const ev=(n,x,y)=>b.dispatchEvent(new PointerEvent(n,{bubbles:true,cancelable:true,pointerType:'touch',pointerId:4,button:0,clientX:x,clientY:y}));
      if(!g.AIMING)ev('pointerdown',home.x,home.y);
      ev('pointermove',home.x,home.y-dist);
      g.render();
      const a=g.AIMING;
      const hero=g.screenAt(g.P.x,g.P.y);
      const spot=a&&g.screenAt(a.x,a.y);
      const ring=document.getElementById('aimStick');
      return {
        dist:a?Math.hypot(a.x-g.P.x,a.y-g.P.y):null,
        cancel:a&&a.cancel,thumb:a&&a.thumb,
        up:spot&&hero?hero.y-spot.y:0,
        ring:!ring.hidden,
        reach:a&&a.reachPx
      };
    },{dist});
    seen.push(row);
    if(name==='phone-sideways'||label==='out'){
      const file=path.join(out,name+'-'+label+'.png');
      await page.screenshot({path:file});
      shots.push(file);
    }
  }
  const rest=seen[0], far=seen[1], back=seen[2];
  if(!far.thumb||!far.ring)fail.push(name+' did not show the button ring '+JSON.stringify(far));
  if(!(far.dist>back.dist+0.2)||!(back.dist+0.05>=rest.dist*0))fail.push(name+' distances '+JSON.stringify(seen));
  if(!(far.up>back.up+4))fail.push(name+' reticle did not travel up the screen '+JSON.stringify({far:far.up,back:back.up}));
  const released=await page.evaluate(()=>{
    const g=__g,b=document.querySelector('.sk[data-i="0"]'),r=b.getBoundingClientRect();
    const home={x:r.left+r.width/2,y:r.top+r.height/2};
    const en=g.G.en;
    b.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,cancelable:true,pointerType:'touch',pointerId:4,button:0,clientX:home.x,clientY:home.y}));
    return {aim:!!g.AIMING,storm:g.W.allies.some(a=>a.k==='storm'),en:g.G.en,was:en};
  });
  if(released.storm||released.aim||released.en!==released.was)fail.push(name+' return cast '+JSON.stringify(released));
  if(errs.length)fail.push(name+' pageerror '+errs.join(' | '));
  await ctx.close();
}
await b.close();
if(shots.length){
  const py=`
from PIL import Image, ImageDraw
import os
out=${JSON.stringify(out)}
names=[${shots.map(s=>JSON.stringify(path.basename(s))).join(',')}]
ims=[Image.open(os.path.join(out,n)).convert('RGB') for n in names]
w=420
rows=[]
for im,n in zip(ims,names):
    h=max(1,int(im.height*w/im.width))
    thumb=im.resize((w,h), Image.Resampling.LANCZOS)
    canvas=Image.new('RGB',(w,h+28),(12,10,16))
    canvas.paste(thumb,(0,28))
    d=ImageDraw.Draw(canvas)
    d.text((8,6), n.replace('.png','').replace('-',' '), fill=(230,210,150))
    rows.append(canvas)
cols=4
ch=max(r.height for r in rows)
sheet=Image.new('RGB',(w*cols, ch*((len(rows)+cols-1)//cols)), (8,6,12))
for i,r in enumerate(rows):
    sheet.paste(r, ((i%cols)*w, (i//cols)*ch))
sheet.save(os.path.join(out,'contact.png'))
print('contact', sheet.size)
`;
  execFileSync('python3',['-c',py],{stdio:'inherit'});
}
if(fail.length){console.error(fail.join('\n'));process.exit(1)}
console.log('thumb aim ok',profiles.length,'devices');
})().catch(e=>{console.error(e);process.exit(1)});
