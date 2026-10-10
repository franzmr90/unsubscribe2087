/* The house setup: a laptop running the server with nobody playing on it, and two
   phones that make their own accounts, meet in the lobby and end up in one game.
   This is the arrangement the home-network package exists for, so it is worth a
   check of its own rather than inferring it from the parts.

   Start the server first (the launcher, or node server/server.js), then:
     node tools/two-phones.js http://localhost:8087/
*/
/* The exact setup: a laptop running the server and nobody playing on it, and two
   phones that join each other's game. */
const {chromium}=require('playwright');
const base=process.argv[2];
const fail=[];
const ok=(n,c,d)=>{console.log((c?'  ok   ':'  FAIL ')+n+(d&&!c?'  '+d:''));if(!c)fail.push(n)};
const phone={viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:3};
(async()=>{
const b=await chromium.launch({executablePath:process.env.PW_CHROMIUM||undefined});
/* two separate contexts = two separate devices, separate cookies and storage */
const A=await b.newContext(phone), B=await b.newContext(phone);
const pa=await A.newPage(), pb=await B.newPage();
const ea=[],eb=[]; pa.on('pageerror',e=>ea.push(e.message)); pb.on('pageerror',e=>eb.push(e.message));
for(const p of [pa,pb]){ await p.goto(base,{waitUntil:'load'}); }
await pa.waitForTimeout(1500);

const served=await pa.evaluate(()=>({
  title:document.title, canvas:!!document.getElementById('cv'),
  server:!!window.__u2087server, shim:typeof window.claude!=='undefined'}));
ok('the phone is served the game by the laptop', served.canvas&&served.title.includes('Unsubscribe'), JSON.stringify(served));
ok('the page knows it is talking to an account server', served.server===true, JSON.stringify(served));

const reg=async(p,name)=>p.evaluate(async(n)=>{
  const r=await fetch('/api/register',{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({name:n,pass:'house-'+n})});
  const j=await r.json(); return {status:r.status,name:j.user&&j.user.name};},name);
const ra=await reg(pa,'Micah'), rb=await reg(pb,'Wife');
ok('phone one makes an account with no invite code', ra.status===200&&ra.name==='Micah', JSON.stringify(ra));
ok('phone two makes its own account', rb.status===200&&rb.name==='Wife', JSON.stringify(rb));

/* reload so each page picks up its session, then start a hero on each */
for(const p of [pa,pb]) { await p.reload({waitUntil:'load'}); }
await pa.waitForTimeout(1200);
const start=async(p,cls)=>p.evaluate((c)=>{
  __g.skipDisc(); __g.OPT.noWalk=1;
  const t=document.getElementById('title'); if(t)t.hidden=true;
  __g.newGame(c); __g.G.pre=0; __g.G.walkNew=0;
  for(let i=0;i<10;i++){const s=document.getElementById('scene');if(s&&!s.hidden)document.getElementById('scSkip').click();
    const d=document.getElementById('dlg');if(d&&!d.hidden){const x=d.querySelector('#dBtns button:not([disabled])');x&&x.click()}}
  __g.enter(0); const s=document.getElementById('scene'); if(s)s.hidden=true; __g.setMode('play');
  return {cls:__g.G.cls, zone:__g.W.zi};},cls);
ok('phone one starts a hero', (await start(pa,'scrapper')).cls==='scrapper');
ok('phone two starts a hero', (await start(pb,'hacker')).cls==='hacker');

/* phone one opens a game, phone two finds it in the lobby and joins */
const hello=(p)=>p.evaluate(async()=>{
  for(let i=0;i<40 && !(window.__mp&&__mp.on);i++) await new Promise(r=>setTimeout(r,250));
  if(!window.__mp) return {no:'no __mp'};
  __mp.send('hello',{lvl:__g.G.lvl,cls:__g.G.cls,zi:__g.W.zi,hp:__g.G.hp,hpm:__g.S.maxHp});
  await new Promise(r=>setTimeout(r,600));
  return {on:__mp.on, me:__mp.me&&__mp.me.name};});
const ha=await hello(pa), hb=await hello(pb);
ok('phone one reaches the laptop over the socket', !!ha.on, JSON.stringify(ha));
ok('phone two reaches the laptop over the socket', !!hb.on, JSON.stringify(hb));

const made=await pa.evaluate(async()=>{
  __mp.send('game.create',{name:'The House',diff:'normal'});
  await new Promise(r=>setTimeout(r,900));
  return {inGame:__mp.inGame, id:__mp.MP.game&&__mp.MP.game.id, name:__mp.MP.game&&__mp.MP.game.name};});
ok('phone one opens a game on the laptop', !!made.inGame, JSON.stringify(made));

const joined=await pb.evaluate(async()=>{
  __mp.send('game.list',{});
  await new Promise(r=>setTimeout(r,900));
  const lobby=(__mp.MP.lobby||[]).map(g=>({id:g.id,name:g.name,players:g.n}));
  if(lobby[0]) __mp.send('game.join',{id:lobby[0].id});
  await new Promise(r=>setTimeout(r,1400));
  return {lobby, inGame:__mp.inGame, name:__mp.MP.game&&__mp.MP.game.name};});
ok('phone two sees the game in the lobby', joined.lobby.length>0, JSON.stringify(joined.lobby));
ok('phone two joins it', !!joined.inGame, JSON.stringify(joined));

await pa.waitForTimeout(1200);
const sees=async(p)=>p.evaluate(()=>({roster:(__mp.roster||[]).map(r=>r.name), others:(__mp.MP.others||[]).map(o=>o.name)}));
const sa=await sees(pa), sb=await sees(pb);
console.log('   phone one roster:', JSON.stringify(sa.roster), ' phone two roster:', JSON.stringify(sb.roster));
ok('both phones are in the same game', sa.roster.length>=2 && sb.roster.length>=2, JSON.stringify({sa,sb}));

const chat=await pb.evaluate(async()=>{ __mp.send('chat',{text:'behind you'}); await new Promise(r=>setTimeout(r,700)); return true;});
const heard=await pa.evaluate(()=>((__mp.MP.chat||[]).map(c=>c.text||c)).join(' | '));
ok('chat from one phone reaches the other', /behind you/.test(heard), heard);

ok('no page errors on phone one', ea.length===0, ea.join(' | '));
ok('no page errors on phone two', eb.length===0, eb.join(' | '));
await b.close();
console.log(fail.length? '\nFAIL '+fail.length : '\ntwo-phones ok');
process.exit(fail.length?1:0);
})();
