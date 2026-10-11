/* A contact sheet of every baked shape, held open so it can be looked at.
   node tools/fx-sheet-shot.js   ->  .fx-shots/contact.png */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const out=path.join(root,'.fx-shots');
async function clearUI(p){for(let i=0;i<30;i++){
  const st=await p.evaluate(()=>{const s=document.getElementById('scene');
    if(s&&!s.hidden){document.getElementById('scSkip').click();return 'scene'}
    const d=document.getElementById('dlg');
    if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x){x.click();return 'dlg'}return 'locked'}
    return 'clear'});
  if(st==='clear')return;await p.waitForTimeout(st==='locked'?350:160)}}
(async()=>{
fs.mkdirSync(out,{recursive:true});
const html=fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8');
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:430,height:860},deviceScaleFactor:2});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
await p.waitForTimeout(400);
await p.evaluate(()=>__g.skipDisc());await p.waitForTimeout(200);
await p.click('[data-cls=scrapper]');await p.waitForTimeout(300);
await p.evaluate(()=>{__g.G.pre=2});await clearUI(p);
await p.evaluate(()=>{const G=__g.G;G.lvl=60;G.god=true;G.sats=40;__g.calc()});
await p.evaluate(()=>__g.enter(1));await clearUI(p);
await p.evaluate(()=>__g.setMode('play'));await p.waitForTimeout(400);

// pin one of each shape around the player, refreshed every frame so nothing ages out
await p.evaluate(()=>{
  const P=__g.P,W=__g.W;
  const spec=[['patch','#f7931a',0,-3],['ring','#59e0e6',3,-3],['arc','#ffd9a0',-3,0],
              ['trail','#9a6cff',3,0],['bolt','#59e0e6',-3,3],['orbit','#7be495',0,3],['mark','#ffe36b',3,3]];
  window.__hold=setInterval(()=>{
    W.fx.length=0;
    for(const [k,col,ox,oy] of spec){
      W.fx.push({k,col,x:P.x+ox,y:P.y+oy,x2:P.x+ox+2.2,y2:P.y+oy+1.2,
        t:k==='ring'||k==='arc'?0.35:0.12,life:1.2,r:1.8,w:1.2,n:4,dx:1,dy:0,
        reach:k==='arc'?1.8:0,stay:k==='patch'?1:0});
    }
  },16);
});
await p.waitForTimeout(700);
await p.screenshot({path:path.join(out,'contact.png')});
await p.evaluate(()=>clearInterval(window.__hold));
console.log(errs.length?('page errors: '+errs.slice(0,3).join(' | ')):'clean');
console.log('wrote '+path.join(out,'contact.png'));
await b.close();})();
