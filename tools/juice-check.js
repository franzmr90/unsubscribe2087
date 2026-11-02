/* Impact tiers (juice): trauma shake, hit-stop, white flash, squash, and the floor
   cache surviving a shake. Usage: node tools/juice-check.js
   Fails on the code before juice(): there was no juice(), shake was pixels, and a
   shaking frame dropped the floor cache (fkey ''). */
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined,args:['--no-sandbox','--disable-dev-shm-usage']});
const p=await b.newPage({viewport:{width:900,height:600}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+fs.readFileSync(path.join(__dirname,'..','dist/unsubscribe.html'),'utf8')+'</body></html>');
await p.waitForTimeout(600);await p.evaluate(()=>__g.skipDisc());await p.waitForTimeout(260);
await p.click('[data-cls=scrapper]');await p.waitForTimeout(800);
const sk=async(n=12)=>{for(let i=0;i<n;i++){await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();const x=document.querySelector('#dBtns button:not([disabled])');if(x)x.click()});await p.waitForTimeout(150)}};
await sk();
await p.evaluate(()=>{const G=__g.G;G.god=true;G.unlocked=34;__g.enter(1)});for(let i=0;i<20&&await p.evaluate(()=>__g.mode)!=='play';i++)await sk(2);
let fail=0;const ok=(c,m)=>{console.log((c?'ok  ':'FAIL ')+m);if(!c)fail++};
const r=await p.evaluate(()=>{const g=__g,o={};
  g.OPT.shake=true;g.OPT.calm=false;g.shake=0;
  if(typeof g.juice!=='function')return {nojuice:1};
  o.mode=g.mode;g.juice('l');o.trL=g.shake;o.hsL=g.hitStop;o.flL=g.flashT;
  g.juice('l');o.trCap=g.shake;
  for(let i=0;i<60;i++)g.update(1/60);o.trAfter=g.shake;
  g.shake=0;g.juice('s');o.trS=g.shake;g.shake=0;
  g.OPT.calm=true;g.juice('l');o.trCalm=g.shake;o.flCalm=g.flashT>0&&g.flashT!==o.flL;g.OPT.calm=false;g.shake=0;
  g.OPT.shake=false;g.juice('l');o.trOff=g.shake;g.OPT.shake=true;
  g.shake=.8;g.render();const k1=g.fck;g.render();const k2=g.fck;o.fck=k1&&k1===k2;g.shake=0;
  const e=g.spawn('bot',g.P.x+1,g.P.y,{});e.hp=1e6;e.max=1e6;g.hit(e,1);o.sq=e.sq>0;
  for(let i=0;i<30;i++)g.update(1/60);o.sqRest=!(e.sq>0);
  return o});
if(r.nojuice){ok(false,'juice() exists');}else{
ok(Math.abs(r.trL-.8)<.01,'a large event adds .8 trauma ('+r.trL+')');
ok(r.hsL>=.1&&r.hsL<=.15,'a large event holds hit-stop for .1-.15 s ('+r.hsL+', mode '+r.mode+')');
ok(r.flL>0,'a large event flashes the screen');
ok(r.trCap<=1,'trauma stops at 1 ('+r.trCap+')');
ok(r.trAfter===0,'trauma decays to rest within a second ('+r.trAfter+')');
ok(r.trS>0&&r.trS<.2,'a small event barely moves the camera ('+r.trS+')');
ok(Math.abs(r.trCalm-.4)<.01,'gentle screen halves the shake ('+r.trCalm+')');
ok(!r.flCalm,'gentle screen draws no flash');
ok(r.trOff===0,'shake off means no shake');
ok(r.fck,'a shaking frame keeps the floor cache');
ok(r.sq,'a hit squashes the machine');
ok(r.sqRest,'the squash returns to rest');}
await p.waitForTimeout(400);
const hs=await p.evaluate(()=>__g.hitStop);ok(!(hs>0),'hit-stop releases in real time ('+hs+')');
ok(!errs.length,'no page errors '+errs.join(' | '));
await b.close();console.log(fail?fail+' failed':'all ok');process.exit(fail?1:0)})();
