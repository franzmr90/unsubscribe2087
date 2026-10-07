/* Party sheet vs stand down, and a player hit staying at a quarter.
   node tools/pvp-clarity.js */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');

async function clearUI(p){
  for(let i=0;i<24;i++){
    const st=await p.evaluate(()=>{
      const s=document.getElementById('scene');
      if(s&&!s.hidden){document.getElementById('scSkip').click();return 'scene'}
      const d=document.getElementById('dlg');
      if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');if(x){x.click();return 'dlg'}return 'locked'}
      return 'clear'});
    if(st==='clear')return;
    await p.waitForTimeout(st==='locked'?350:160);
  }
  throw new Error('overlays did not clear');
}

(async()=>{
const html=fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8');
const fail=[];
const check=(n,ok,d)=>{if(!ok)fail.push(n+(d?': '+d:''));};
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+html+'</body></html>');
await p.waitForTimeout(400);
await p.evaluate(()=>__g.skipDisc());
await p.waitForTimeout(200);
await p.click('[data-cls=scrapper]');
await p.waitForTimeout(250);
await p.evaluate(()=>{__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1});
await clearUI(p);
await p.evaluate(()=>__g.enter(1));
await clearUI(p);
await p.evaluate(()=>__g.setMode('play'));

const sheet=await p.evaluate(()=>{
  const MP=__g.MP;
  MP.on=true;
  MP.conn={readyState:1,send(){}};
  MP.me={uid:'a',name:'Ines'};
  MP.game={name:'Yard',diffName:'Hell',n:2,max:8,diff:'hell'};
  MP.scale={hp:5,dmg:2.4,xp:2.8,players:2};
  MP.roster=[
    {uid:'a',name:'Ines',lvl:9,cls:'scrapper',zi:1},
    {uid:'b',name:'Vale',lvl:9,cls:'hacker',zi:1,hostile:['a']}
  ];
  MP.hostile={b:1};
  MP.party={id:'p1',leader:'a',members:[
    {uid:'a',name:'Ines',lvl:9,cls:'scrapper',zi:1},
    {uid:'b',name:'Vale',lvl:9,cls:'hacker',zi:1}
  ]};
  MP.diffs={normal:{n:'Normal',hp:1,dmg:1,xp:1},nightmare:{n:'Nightmare',hp:2.5,dmg:1.6,xp:1.8},hell:{n:'Hell',hp:5,dmg:2.4,xp:2.8}};
  __g.openSheet('party',{});
  return document.getElementById('sheetIn').innerText;
});
check('sheet names stand down', /Standing down in town stops only your own swings/.test(sheet));
check('sheet no longer says the flag cannot be taken back', !/cannot be taken back/.test(sheet));
check('stand down is on the roster', /stand down/i.test(sheet));
check('party pool copy', /a third again/i.test(sheet));

await p.evaluate(()=>{__g.MP.hostile={};__g.drawSheet()});
await p.click('[data-mph="b"]');
await p.waitForTimeout(200);
const dlg=await p.evaluate(()=>document.getElementById('dlg').innerText);
check('declare dialog keeps the quarter and the one-sided stand down', /standing down later only stops your own swings/.test(dlg)&&/25%/.test(dlg), dlg);

const hits=await p.evaluate(()=>{
  const g=__g;
  g.W.tag={hp:8,max:8};
  g.G.pp=0;
  g.P.inv=0;g.P.dip=0;g.P.route=0;g.P.redact=0;
  g.G.god=0;
  g.S.dodge=0;
  g.setMode('play');
  const once=pvp=>{
    g.G.hp=g.S.maxHp;
    g.P.inv=0;
    g.hurt(8,0,pvp?{name:'Vale',pvp:1}:{name:'Tick'});
    return g.S.maxHp-g.G.hp;
  };
  const pv=once(1), mon=once(0);
  g.W.tag=null;
  g.MP.scale=null;
  const bare=once(0);
  return {pv,mon,bare,ratio:mon/pv};
});
check('a machine pays the hell companion tax and a player does not', hits.pv>0&&Math.abs(hits.pv-hits.bare)<0.05&&Math.abs(hits.mon/hits.pv-2.52)<0.05, JSON.stringify(hits));
check('no page errors', !errs.length, errs.join('; '));

await b.close();
console.log('player '+hits.pv.toFixed(2)+', machine '+hits.mon.toFixed(2)+', bare '+hits.bare.toFixed(2)+', ratio '+hits.ratio.toFixed(3));
console.log(fail.length?'FAIL\n'+fail.join('\n'):'pvp-clarity ok');
process.exit(fail.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
