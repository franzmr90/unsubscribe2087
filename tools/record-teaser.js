const {chromium}=require('playwright');const fs=require('fs');const OUT=process.argv[2];const only=process.argv[3];
const html='<!doctype html><html><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#050409">'+fs.readFileSync('/home/claude/unsubscribe.html','utf8')+'</body></html>';
const BOT=`window.__bot=setInterval(()=>{const g=__g;if(!g.W||!g.P)return;const G=g.G;if(g.mode==='dlg'){const x=document.querySelector('#dBtns button:not([disabled])');x&&x.click();return}if(g.mode!=='play')return;G.hp=g.S.maxHp;G.en=g.S.maxEn;
 let t=null,bd=1e9;for(const e of g.W.ents){const d=Math.hypot(e.x-g.P.x,e.y-g.P.y);if(d<bd){bd=d;t=e}}
 const k=(c,on)=>dispatchEvent(new KeyboardEvent(on?'keydown':'keyup',{code:c}));
 for(const c of['KeyW','KeyA','KeyS','KeyD'])k(c,false);
 if(t){const want=window.__rng||2;if(bd>want){const dx=t.x-g.P.x,dy=t.y-g.P.y;const sx=dx-dy,sy=dx+dy;if(sx>.3)k('KeyD',true);if(sx<-.3)k('KeyA',true);if(sy>.3)k('KeyS',true);if(sy<-.3)k('KeyW',true)}
  if(bd<7){k('Space',true);window.__c=(window.__c||0)+1;if(window.__c%9===0)k('Digit1',true);if(window.__c%14===5)k('Digit2',true);if(window.__c%17===9)k('Digit3',true)}}},90)`;
const sk=async(p,n=10,last)=>{for(let i=0;i<n;i++){await p.evaluate(()=>{if(!document.getElementById('scene').hidden)document.getElementById('scSkip').click();const d=document.getElementById('dlg');if(!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}});await p.waitForTimeout(110)}};
const gear=(cls,lvl,build,flags)=>`(()=>{const g=__g,G=g.G;G.pre=2;G.god=true;document.getElementById('buffs').style.display='none';G.seenIntro=true;G.preSeen=1;G.lvl=${lvl};G.sp=${lvl}+8;G.ap=${lvl}*5;G.sats=999;${flags||''};for(let i=0;i<40;i++)G['in'+i]=1;for(const s of ['weapon','armor','helm','boots','gloves','belt','ring','amulet']){G.eq[s]=g.makeItem(${lvl},3,s)}g.shapeShift('${cls}','${build}');})()`;
async function shot(name,cls,dur,setup){if(only&&only!==name)return;const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
 const ctx=await b.newContext({viewport:{width:540,height:960},recordVideo:{dir:OUT+'/'+name,size:{width:540,height:960}}});const t0=Date.now();const p=await ctx.newPage();
 await p.setContent(html);await p.waitForTimeout(900);
 if(cls){await p.click('[data-cls='+cls+']');await p.waitForTimeout(700)}
 const mark=await setup(p);const ts=(Date.now()-t0)/1000;await p.waitForTimeout(dur*1000+300);
 await ctx.close();await b.close();const f=fs.readdirSync(OUT+'/'+name).find(x=>x.endsWith('.webm'));fs.renameSync(OUT+'/'+name+'/'+f,OUT+'/'+name+'.webm');fs.appendFileSync(OUT+'/cuts.txt',name+' '+ts.toFixed(2)+' '+dur+'\n');console.log(name,ts.toFixed(2))}
(async()=>{
 await shot('a_pre','hacker',4.6,async p=>{await p.waitForTimeout(100)});
 await shot('b_act1','hacker',5,async p=>{await sk(p,8);await p.evaluate(gear('hacker',16,'chain'));await sk(p,6);await p.evaluate(()=>{__g.G.unlocked=40;__g.enter(2)});await sk(p,4);await p.evaluate(BOT);await p.waitForTimeout(2500)});
 await shot('c_boss','scrapper',3.8,async p=>{await sk(p,8);await p.evaluate(gear('scrapper',18,'crew'));await sk(p,6);await p.evaluate(()=>{__g.G.unlocked=40;__g.enter(5)});await sk(p,4);await p.evaluate(()=>{const g=__g,t=g.W.boss;g.P.x=t.x+6;g.P.y=t.y+2});await p.waitForTimeout(600);await p.evaluate(()=>{const g=__g,t=g.W.boss;g.P.x=t.x+3;g.P.y=t.y+1})});
 await shot('d_fight','scrapper',5,async p=>{await sk(p,8);await p.evaluate(gear('scrapper',18,'crew'));await sk(p,6);await p.evaluate(()=>{__g.G.unlocked=40;__g.enter(5)});await sk(p,4);await p.evaluate(()=>{const g=__g,t=g.W.boss;g.P.x=t.x+3;g.P.y=t.y+1});await p.waitForTimeout(700);await sk(p,8);await p.evaluate(BOT);await p.waitForTimeout(600)});
 await shot('e_chain','founder',4.5,async p=>{await sk(p,8);await p.evaluate(gear('founder',82,'head','G.act2=G.act3=G.act4=G.act5=true;for(let i=1;i<=20;i++)G.q["q"+i]=3'));await sk(p,6);await p.evaluate(()=>{__g.G.unlocked=40;__g.enter(28)});await sk(p,4);await p.evaluate('window.__rng=4;'+BOT);await p.waitForTimeout(3500)});
 await shot('f_clock','hacker',4.2,async p=>{await sk(p,8);await p.evaluate(gear('hacker',76,'chain','G.act2=G.act3=true;for(let i=1;i<=14;i++)G.q["q"+i]=3'));await sk(p,6);await p.evaluate(()=>{__g.G.unlocked=40;__g.enter(16)});await sk(p,4);await p.evaluate(()=>{const g=__g;g.W.bi=1;g.kill(g.W.boss)});await p.waitForTimeout(2200);for(let i=0;i<4;i++){await p.evaluate(()=>{document.getElementById('dlg').hidden=true;document.getElementById('scNext').click()});await p.waitForTimeout(200)}});
 await shot('g_title',null,3.6,async p=>{await p.waitForTimeout(200)});
})();
