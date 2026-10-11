/* One contact sheet per class: every active skill cast and held open.
   node tools/skill-shots.js [outDir] [classes...]
   Composites inside the page from the game canvas, so one PNG per class
   instead of eighty-six loose files nobody can look at. */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const outDir=path.resolve(process.argv[2]||path.join(root,'.skill-shots'));
const only=process.argv.slice(3);

async function clearUI(p){for(let i=0;i<30;i++){const st=await p.evaluate(()=>{
 const s=document.getElementById('scene');if(s&&!s.hidden){document.getElementById('scSkip').click();return 'x'}
 const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x){x.click();return 'x'}return 'l'}
 return 'c'});if(st==='c')return;await p.waitForTimeout(st==='l'?350:150)}}

(async()=>{
fs.mkdirSync(outDir,{recursive:true});
const list=JSON.parse(fs.readFileSync(path.join(root,'notes/SKILL-LIST.json'),'utf8'));
const classes=[...new Set(list.out.map(r=>r.cls))].filter(c=>!only.length||only.includes(c));
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:430,height:860},deviceScaleFactor:2});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+
  fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8')+'</body></html>');
await p.waitForTimeout(500);
await p.evaluate(()=>__g.skipDisc());await p.waitForTimeout(200);
await p.click('[data-cls=scrapper]');await p.evaluate(()=>{__g.G.pre=2});await clearUI(p);
await p.evaluate(()=>{const G=__g.G;G.lvl=90;G.act2=G.act3=G.act4=G.act5=true;G.sats=99;G.god=true;
  for(let i=1;i<=25;i++)G.q['q'+i]=3;G.in1=1;__g.ACC.maxi=1;__g.calc()});
await p.evaluate(()=>__g.enter(1));await clearUI(p);
await p.evaluate(()=>__g.setMode('play'));
await p.waitForTimeout(1900);await clearUI(p);

for(const cls of classes){
  const skills=list.out.filter(r=>r.cls===cls&&r.active);
  const made=await p.evaluate(async([cls,skills])=>{
    const G=__g.G,P=__g.P,W=__g.W;
    const CELL=236,COLS=4,PAD=20,LBL=22;
    const rows=Math.ceil(skills.length/COLS);
    const sheet=document.createElement('canvas');
    sheet.width=PAD*2+COLS*CELL; sheet.height=PAD*2+rows*(CELL+LBL)+28;
    const g=sheet.getContext('2d');
    g.fillStyle='#0b0908';g.fillRect(0,0,sheet.width,sheet.height);
    g.fillStyle='#c8a55a';g.font='700 16px Cinzel,Georgia,serif';g.textAlign='left';
    g.fillText(cls.toUpperCase()+' — '+skills.length+' active skills',PAD,26);
    const cv=document.getElementById('cv');
    const sleep=ms=>new Promise(r=>setTimeout(r,ms));
    const baseP={};for(const k in P)if(typeof P[k]==='number')baseP[k]=P[k];
    const objs0=(W.objs||[]).length, allies0=(W.allies||[]).length, projs0=(W.projs||[]).length;
    const reset=()=>{for(const k in baseP)P[k]=baseP[k];
      for(const k in P)if(typeof P[k]==='number'&&!(k in baseP))P[k]=0;
      if(W.objs)W.objs.length=Math.min(W.objs.length,objs0);
      if(W.allies)W.allies.length=Math.min(W.allies.length,allies0);
      if(W.projs)W.projs.length=Math.min(W.projs.length,projs0);
      G.form=null;W.fx.length=0};

    for(let n=0;n<skills.length;n++){
      const sk=skills[n];
      // a clean stage each time: same spot, same company
      G.cls=cls;__g.calc();reset();
      P.x=W.N/2;P.y=W.N/2;P.dir={x:1,y:0};P.dash=null;P.cd=P.cd||{};
      for(const k in P.cd)P.cd[k]=0;
      P.castWait=0;P.silence=0;G.en=99999;G.hp=__g.S.maxHp;
      W.fx.length=0;
      // targets so skills that need one have one: move the zone's own
      // monsters in rather than guessing a kind that spawn() will accept
      const live=(W.ents||[]).filter(e=>e&&e.hp>0);
      for(let q=0;q<Math.min(3,live.length);q++){
        live[q].x=P.x+2.6+q*1.6;live[q].y=P.y-1.4+q*1.4;
        live[q].hp=live[q].max||live[q].hp;live[q].aggro=1;
        live[q].name='';live[q].champ=0}
      for(let q=3;q<live.length;q++){live[q].x=P.x+900;live[q].y=P.y+900}
      G.sk[sk.i]=5;G.slots[0]=sk.i;
      /* The Witness pays for nearly everything out of the Record, and starts
         empty, so most of its casts bailed with "the page is blank" and the
         sheet showed nothing. Fill the page and put Testimony on the staged
         machines so the skills actually fire. */
      if(cls==='witness'){
        try{__g.recSet(100)}catch(e){}
        for(let q=0;q<Math.min(3,live.length);q++){
          live[q].tes=4;live[q].watch=3;live[q].acc=1}
      }
      await sleep(120);
      // only what THIS cast makes: the player carries ambient marks (a shrine
      // buff, a status) that would otherwise be credited to every skill
      const had=new Set(W.fx), hadP=new Set(W.projs||[]);
      try{__g.cast(0)}catch(e){}
      // let a projectile get clear of the caster before freezing it, or it
      // sits inside the figure and reads as nothing at all
      await sleep(110);
      const snap=W.fx.filter(f=>!had.has(f)).map(f=>({f,life:f.life}));
      const myP=(W.projs||[]).filter(x=>!hadP.has(x));
      for(const q of myP){q.vx=0;q.vy=0}
      const hold=setInterval(()=>{
        for(const s of snap)s.f.t=Math.min(s.life*0.45,s.life-0.01);
        for(const q of myP){q.vx=0;q.vy=0;q.life=Math.max(q.life,.6)}},16);
      await sleep(240);
      const cx=(n%COLS)*CELL+PAD, cy=PAD+18+((n/COLS)|0)*(CELL+LBL);
      // the middle of the view, where the player stands
      const sx=(cv.width-cv.width*0.46)/2, sy=(cv.height-cv.height*0.34)/2;
      g.drawImage(cv,sx,sy,cv.width*0.46,cv.height*0.34,cx,cy,CELL,CELL*0.76);
      clearInterval(hold);
      g.strokeStyle='rgba(200,165,90,.28)';g.strokeRect(cx+.5,cy+.5,CELL-1,CELL*0.76-1);
      g.fillStyle='#d8cfb4';g.font='600 11px Cinzel,Georgia,serif';
      const kinds=[[...new Set(snap.map(s=>s.f.k))].join(','),myP.length?('proj x'+myP.length):'']
        .filter(Boolean).join(' + ')||'(nothing drawn)';
      g.fillText(sk.i+' '+sk.name.slice(0,22),cx+2,cy+CELL*0.76+13);
      g.fillStyle='#8a8070';g.font='500 10px Cinzel,Georgia,serif';
      g.fillText(kinds,cx+2,cy+CELL*0.76+25);
      reset();
    }
    return sheet.toDataURL('image/png');
  },[cls,skills]);
  const f=path.join(outDir,cls+'.png');
  fs.writeFileSync(f,Buffer.from(made.split(',')[1],'base64'));
  console.log('  '+cls+'  '+skills.length+' skills -> '+path.relative(root,f));
}
if(errs.length)console.log('page errors: '+errs.slice(0,3).join(' | '));
console.log('done');
await b.close();})();
