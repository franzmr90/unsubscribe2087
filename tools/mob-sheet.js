/* Look at the Act IV and V creatures beside the bodies they borrow.
   node tools/mob-sheet.js [tag]
   Writes .fx-shots/mobs-<tag>-N.png. Each row is a borrowed body on the left and
   the creature that reuses it on the right, staged in a real zone and drawn by
   the real renderer, so what you see is what the player sees. */
const {chromium}=require('playwright');
const path=require('path');
const root=path.join(__dirname,'..');
const URL='file://'+path.join(root,'dist/Unsubscribe-2087-standalone.html');
const TAG=process.argv[2]||'now';
const PAIRS=[['seer','hr'],['lancer','hound'],['splitter','bot'],['director','mech'],
 ['proxy','bot'],['gob','drone'],['shill','hr'],['bull','hound'],
 ['daemon','tick'],['wdog','hound'],['fwall','bot'],['cam','ad'],
 ['wisher','ad'],['companion','bot'],['lull','hr'],['fetch','hound'],
 ['orphan','tick'],['valid','bot'],['claim','drone'],['sniper','hound'],
 ['oracle','ad'],['ctkr','mech'],['custod','mech'],['gap','mech']];
async function clearUI(p){for(let i=0;i<50;i++){const st=await p.evaluate(()=>{
 const s=document.getElementById('scene');if(s&&!s.hidden){const b=document.getElementById('scSkip');if(b)b.click();return 'x'}
 const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x){x.click();return 'x'}return 'l'}
 return 'c'});if(st==='c')return;await p.waitForTimeout(st==='l'?300:120)}}
(async()=>{
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:760,height:760},deviceScaleFactor:2});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(URL);await p.waitForTimeout(700);
await p.evaluate(()=>__g.skipDisc());await p.waitForTimeout(250);
await p.click('[data-cls=scrapper]');await p.evaluate(()=>{__g.G.pre=2});await clearUI(p);await p.waitForTimeout(1600);await clearUI(p);
await p.evaluate(()=>{const G=__g.G;G.lvl=90;G.god=true;G.unlocked=34;__g.calc()});
/* entering an act plays its cinematic; clear it, twice, and settle */
await p.evaluate(()=>__g.enter(22));
await p.waitForTimeout(600);await clearUI(p);await p.waitForTimeout(600);await clearUI(p);
await p.evaluate(()=>__g.setMode('play'));await p.waitForTimeout(300);

const N=4;
for(let b0=0;b0<PAIRS.length;b0+=N){
  const batch=PAIRS.slice(b0,b0+N);
  await p.evaluate(rows=>{
    const W=__g.W,P=__g.P;
    /* a bare stage: no crates, no signs, no loot, nothing with a name on it */
    W.ents.length=0;W.fx.length=0;W.projs.length=0;
    W.drops.length=0;if(W.objs)W.objs.length=0;if(W.npcs)W.npcs.length=0;
    document.getElementById('hud').hidden=true;
    __g.OPT.enemyBars=false;__g.OPT.minimap=false;
    rows.forEach(([k,base],i)=>{
      const dy=(i-(rows.length-1)/2)*2.2;
      for(const [kind,dx] of [[base,-1.25],[k,1.25]]){
        const e=__g.spawn(kind,P.x+dx,P.y+dy);
        if(e){e.aggro=false;e.stun=0;e.spd=0;e.ph=1.1;e.hp=e.max*.8}
      }
    });
  },batch);
  await clearUI(p);
  for(let i=0;i<4;i++){await p.evaluate(()=>__g.render());await p.waitForTimeout(60)}
  const f=root+'/.fx-shots/mobs-'+TAG+'-'+(b0/N+1)+'.png';
  await p.screenshot({path:f,clip:{x:150,y:120,width:470,height:530}});
  console.log('wrote '+f+'  ('+batch.map(r=>r[1]+' vs '+r[0]).join(', ')+')');
}
if(errs.length)console.log('page errors: '+errs.slice(0,3).join(' | '));
await b.close()})();
