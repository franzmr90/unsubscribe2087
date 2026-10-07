/* Party-sheet friends, letters, and the mute line, against the social store.
   node tools/friends-mail.js [outdir] */
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const OUT=process.argv[2];
const fail=m=>{console.error(m);process.exitCode=1;throw new Error(m)};
const root=path.join(__dirname,'..');

const social=fs.readFileSync(path.join(root,'server/lib/social.js'),'utf8');
const cap=n=>{const m=social.match(new RegExp('const '+n+' = (\\d+)'));if(!m)fail('missing '+n);return +m[1]};
if(cap('FRIEND_CAP')!==25)fail('friend cap '+cap('FRIEND_CAP'));
if(cap('MAIL_CAP')!==40)fail('mail cap '+cap('MAIL_CAP'));
if(cap('MAIL_MAX')!==240)fail('mail max '+cap('MAIL_MAX'));
if(!/MAIL_TTL = 30 \* 864e5/.test(social))fail('mail ttl');
if(!social.includes("MISS = 'Nobody by that name.'"))fail('miss');
if(!social.includes("QUIET = 'They are not taking messages.'"))fail('quiet');

(async()=>{
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.stack||String(e)));
await p.setContent('<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0">'+fs.readFileSync(path.join(root,'dist/unsubscribe.html'),'utf8')+'</body></html>');
await p.waitForTimeout(400);
await p.evaluate(()=>{__g.skipDisc();__g.OPT.noWalk=1});
await p.evaluate(()=>{document.getElementById('title').hidden=true;__g.newGame('scrapper');__g.G.pre=2;__g.G.walkNew=0;__g.OPT.noWalk=1});
for(let i=0;i<10;i++){
  await p.evaluate(()=>{const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}});
  await p.waitForTimeout(60);
}
await p.evaluate(()=>__g.enter(0));
await p.waitForTimeout(150);
await p.evaluate(()=>{const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()};__g.setMode('play')});

const sheet=await p.evaluate(()=>{
  const MP=__mp.MP;
  MP.on=true;
  MP.conn={readyState:1,send(){}};
  MP.me={uid:'me',name:'Ines'};
  MP.game={name:'Yard',diffName:'Normal',n:2,max:8};
  MP.scale={hp:1.5,xp:1.5};
  MP.roster=[
    {uid:'me',name:'Ines',lvl:9,cls:'scrapper',zi:0},
    {uid:'a',name:'Vale',lvl:9,cls:'hacker',zi:1}
  ];
  MP.friends={
    a:{uid:'a',name:'Vale',state:'friend',online:true,cls:'hacker',lvl:9,gameName:'Yard'},
    b:{uid:'b',name:'Pryce',state:'blocked'},
    c:{uid:'c',name:'Mara',state:'pending'}
  };
  MP.face={a:{online:true,cls:'hacker',lvl:9,gameName:'Yard'}};
  MP.whispers=[{from:'Vale',text:'on the line',out:0}];
  MP.mail=[{id:'m1',fromName:'Vale',text:'for the box',read:false}];
  __g.openSheet('party',{});
  return document.getElementById('sheetIn').innerText;
});
const need=[
  'Friends and asks stop at twenty-five',
  'People you block sit past that',
  'Level 9 Technomancer',
  'in Yard',
  'Blocked. They are not told.',
  'Asked. Waiting on them.',
  'A whisper while they are off waits here',
  'The box holds forty, for thirty days',
  'said on this page and then forgotten',
  'for the box',
  'on the line',
  'Muting somebody silences their voice and what they type in this game',
  'A whisper still arrives'
];
for(const s of need)if(!sheet.includes(s))fail('sheet missing '+s+'\n'+sheet.slice(0,500));
if(/The list holds twenty-five/.test(sheet))fail('old cap line');
if(/silences their voice and their messages both/.test(sheet))fail('old mute line');
const btns=await p.evaluate(()=>[...document.querySelectorAll('#sheetIn button')].map(b=>b.textContent));
for(const s of ['Join','Whisper','Unblock','Take it back','Mark read'])if(!btns.some(t=>t.includes(s)))fail('button '+s+' '+btns.join('|'));

if(OUT){
  fs.mkdirSync(OUT,{recursive:true});
  await p.screenshot({path:path.join(OUT,'friends-mail-sheet.png')});
}
if(errs.length)fail(errs.join('\n'));
console.log('friends-mail ok');
await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
