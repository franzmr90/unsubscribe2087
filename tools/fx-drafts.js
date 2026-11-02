/* Records the same short fight once per variant, so effects can be judged on video.
     node tools/fx-drafts.js <outdir> <variants.json>
   variants.json: [{"id":"A","label":"...","html":"dist/unsubscribe.html","set":"js run in the page"}]
   Each clip: a Scrapper among eight machines, a champion and, at four seconds, three
   ticks that explode on arrival. Writes <outdir>/<id>.webm, trimmed to the fight, and
   all.mp4 with every clip in a row. Needs ffmpeg for the trim and the join. */
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const {execFileSync}=require('child_process');
const OUT=process.argv[2],VARS=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));
const W=960,H=720,DUR=9,CW=720,CH=540;  /* 720 tall puts the camera at full zoom; the clip is the middle 720x540 */
const BOT=`window.__bot=setInterval(()=>{const g=__g;if(!g.W||!g.P||g.mode!=='play')return;let t=null,bd=1e9;for(const e of g.W.ents){const d=Math.hypot(e.x-g.P.x,e.y-g.P.y);if(d<bd){bd=d;t=e}}
 const k=(c,on)=>dispatchEvent(new KeyboardEvent(on?'keydown':'keyup',{code:c}));for(const c of['KeyW','KeyA','KeyS','KeyD','Space'])k(c,false);
 if(t){if(bd>1.6){const dx=t.x-g.P.x,dy=t.y-g.P.y,sx=dx-dy,sy=dx+dy;if(sx>.3)k('KeyD',true);if(sx<-.3)k('KeyA',true);if(sy>.3)k('KeyS',true);if(sy<-.3)k('KeyW',true)}else k('Space',true)}},80)`;
(async()=>{fs.mkdirSync(OUT,{recursive:true});const made=[];
for(const v of VARS){
  const dir=path.join(OUT,'raw-'+v.id);fs.rmSync(dir,{recursive:true,force:true});
  const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined,args:['--no-sandbox','--disable-dev-shm-usage']});
  const ctx=await b.newContext({viewport:{width:W,height:H},recordVideo:{dir,size:{width:W,height:H}},deviceScaleFactor:1});
  const t0=Date.now();const p=await ctx.newPage();p.on('pageerror',e=>console.log('  ! '+v.id+': '+e.message));
  await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0;background:#050409">'+fs.readFileSync(path.resolve(v.html),'utf8')+'</body></html>');
  await p.waitForTimeout(800);await p.evaluate(()=>__g.skipDisc());await p.waitForTimeout(300);
  await p.click('[data-cls=scrapper]');await p.waitForTimeout(700);
  const sk=async n=>{for(let i=0;i<n;i++){await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();const x=document.querySelector('#dBtns button:not([disabled])');if(x)x.click()});await p.waitForTimeout(150)}};
  await sk(12);
  await p.evaluate(()=>{const g=__g,G=g.G;G.god=true;G.lvl=12;for(const s of ['weapon','armor','helm','boots','gloves','belt','ring','amulet'])G.eq[s]=g.makeItem(12,3,s);G.unlocked=34;G.seenIntro=true;G.preSeen=1;g.OPT.sound=false;g.OPT.music=false;g.enter(2)});
  for(let i=0;i<20&&await p.evaluate(()=>__g.mode)!=='play';i++)await sk(2);
  await p.evaluate(v=>{const g=__g;if(v.set)(new Function('g',v.set))(g);
    for(const e of g.W.ents.slice())g.W.ents.splice(g.W.ents.indexOf(e),1);
    for(const id of['tbs','bbs','obj','xpw','wal','buffs'])(document.getElementById(id)||{}).hidden=true;
    const L=document.createElement('div');L.textContent=v.id+'  ·  '+v.label;L.style.cssText='position:fixed;left:'+((960-720)/2+12)+'px;top:'+((720-540)/2+10)+'px;z-index:99;font:700 20px system-ui;color:#fff;text-shadow:0 2px 4px #000;pointer-events:none';document.body.appendChild(L);
    const P=g.P;for(let i=0;i<8;i++){const a=i*.785,e=g.spawn('bot',P.x+Math.cos(a)*3,P.y+Math.sin(a)*3,{});if(e){e.hp=e.max=e.max*.12;e.aggro=true}}
    const c=g.spawn('hound',P.x+4,P.y+1,{champ:1});if(c)c.aggro=true;
    setTimeout(()=>{for(let i=0;i<3;i++){const e=g.spawn('tick',P.x+Math.cos(i*2.1)*2.2,P.y+Math.sin(i*2.1)*2.2,{});if(e)e.aggro=true}},4000)},v);
  const start=(Date.now()-t0)/1000;await p.evaluate(BOT);await p.waitForTimeout(DUR*1000);
  console.log('  '+v.id+': '+await p.evaluate(()=>__g.G.kills)+' kills');
  const vid=p.video();await ctx.close();await b.close();const raw=await vid.path();
  const out=path.join(OUT,v.id+'.mp4');
  execFileSync('ffmpeg',['-y','-loglevel','error','-ss',start.toFixed(2),'-i',raw,'-t',String(DUR),'-vf','crop='+CW+':'+CH+':'+(W-CW)/2+':'+(H-CH)/2,'-c:v','libx264','-pix_fmt','yuv420p','-r','30',out]);
  fs.rmSync(dir,{recursive:true,force:true});made.push(out);console.log('wrote',out)}
const list=path.join(OUT,'list.txt');fs.writeFileSync(list,made.map(f=>"file '"+path.resolve(f)+"'").join('\n'));
execFileSync('ffmpeg',['-y','-loglevel','error','-f','concat','-safe','0','-i',list,'-c','copy',path.join(OUT,'all.mp4')]);fs.rmSync(list);
console.log('wrote',path.join(OUT,'all.mp4'))})();
