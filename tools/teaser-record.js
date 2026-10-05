/* Records the raw clips for the trailer.
     node tools/teaser-record.js [outdir] [onlyShot]
   Writes <outdir>/NN_name.webm plus NN_name.png for the typographic cards.
   tools/teaser-cut.sh then assembles them. Recording and cutting are separate so the
   edit can be re-cut in seconds without replaying the game. */
'use strict';
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT = process.argv[2] || '/tmp/teaser';
const ONLY = process.argv[3];
const W = 540, H = 960;                       /* portrait: this gets watched on a phone */

const html = '<!doctype html><html><head><meta charset=utf-8>' +
  '<meta name=viewport content="width=device-width,initial-scale=1"></head>' +
  '<body style="margin:0;background:#0b0910">' +
  fs.readFileSync(path.join(__dirname, '..', 'dist', 'unsubscribe.html'), 'utf8') +
  '</body></html>';

/* Plays the game well enough to look like someone playing it: walks at whatever is
   nearest, swings in range, and rotates through the three skills. */
const BOT = `window.__bot=setInterval(()=>{const g=__g;if(!g.W||!g.P)return;const G=g.G;
 if(g.mode==='dlg'){const x=document.querySelector('#dBtns button:not([disabled])');x&&x.click();return}
 if(g.mode!=='play')return;G.hp=g.S.maxHp;G.en=g.S.maxEn;
 let t=null,bd=1e9;for(const e of g.W.ents){if(e.mp)continue;const d=Math.hypot(e.x-g.P.x,e.y-g.P.y);if(d<bd){bd=d;t=e}}
 const k=(c,on)=>dispatchEvent(new KeyboardEvent(on?'keydown':'keyup',{code:c}));
 for(const c of['KeyW','KeyA','KeyS','KeyD'])k(c,false);
 if(t){const want=window.__rng||2;if(bd>want){const dx=t.x-g.P.x,dy=t.y-g.P.y;const sx=dx-dy,sy=dx+dy;
   if(sx>.3)k('KeyD',true);if(sx<-.3)k('KeyA',true);if(sy>.3)k('KeyS',true);if(sy<-.3)k('KeyW',true)}
  if(bd<7){k('Space',true);window.__c=(window.__c||0)+1;
   if(window.__c%9===0)k('Digit1',true);if(window.__c%14===5)k('Digit2',true);if(window.__c%17===9)k('Digit3',true)}}},90)`;

/* Clears scenes and dialogs so a shot starts on the world rather than on a menu. */
const sk = async (p, n = 10) => {
  for (let i = 0; i < n; i++) {
    await p.evaluate(() => {
      const s = document.getElementById('scene');
      if (s && !s.hidden) document.getElementById('scSkip').click();
      const d = document.getElementById('dlg');
      if (d && !d.hidden) { const x = d.querySelector('#dBtns button:not([disabled])'); x && x.click(); }
    });
    await p.waitForTimeout(110);
  }
};

const gear = (cls, lvl, build, flags) => `(()=>{const g=__g,G=g.G;G.pre=2;G.god=true;
 document.getElementById('buffs').style.display='none';G.seenIntro=true;G.preSeen=1;G.sdxTold=1;
 G.lvl=${lvl};G.sp=${lvl}+8;G.ap=${lvl}*5;G.sats=999;${flags || ''};
 for(let i=0;i<40;i++)G['in'+i]=1;
 for(const s of ['weapon','armor','helm','boots','gloves','belt','ring','amulet'])G.eq[s]=g.makeItem(${lvl},3,s);
 g.shapeShift('${cls}','${build}');})()`;

/* The heads-up display is right for playing and busy for a trailer; most shots hide
   the parts that are chrome and keep the parts that read as a game. */
const CLEAN = `(()=>{for(const id of['tbs','bbs','obj','xpw','wal'])
  {const e=document.getElementById(id);if(e)e.style.display='none'}})()`;

/* Toasts fire constantly while a kitted-out character walks around earning feats, and
   they read as debug output in a trailer. */
const HUSH = `(()=>{const l=document.getElementById('log');if(l)l.style.display='none'})()`;

/* A boss shot keeps the orbs and the boss bar, which read as a game, and loses the quest
   tracker, which otherwise prints over the boss's name. */
const HIDE_OBJ = `(()=>{for(const id of['obj','tbs','bbs'])
 {const e=document.getElementById(id);if(e)e.style.display='none'}})()`;

/* A district is big and the player lands at its entrance, so the first shot of one is an
   empty room. Stand where the machines actually are. */
const CLOSE_IN = `(()=>{const g=__g;let best=null,bn=-1;
 for(const e of g.W.ents){if(e.mp)continue;let n=0;
  for(const o of g.W.ents)if(Math.hypot(o.x-e.x,o.y-e.y)<5)n++;
  if(n>bn){bn=n;best=e}}
 if(best){g.P.x=best.x+2.4;g.P.y=best.y+2.4}
 for(let i=0;i<90;i++)if(g.mode==='play')g.update(1/60);   /* lift the fog before the cut */
})()`;

/* For a boss, the objective is the shot. */
const AT_GOAL = `(()=>{const g=__g;try{const q=g.goalPt();if(q){g.P.x=q.x-2.5;g.P.y=q.y-2.5}}catch(e){}
 for(let i=0;i<90;i++)if(g.mode==='play')g.update(1/60);})()`;

/* recordVideo captures from the moment the page opens, so every clip begins with menus,
   cinematics being skipped and the character being kitted out. The useful part starts when
   setup finishes — that offset goes in the manifest and the cut trims to it. */
const manifest = [];

async function clip(name, cls, dur, setup, opts) {
  if (ONLY && ONLY !== name) return;
  opts = opts || {};
  const dir = path.join(OUT, name);
  fs.mkdirSync(dir, { recursive: true });
  const b = await chromium.launch();
  const ctx = await b.newContext({
    viewport: { width: W, height: H },
    recordVideo: { dir, size: { width: W, height: H } },
    deviceScaleFactor: 1
  });
  const t0 = Date.now();
  const p = await ctx.newPage();
  p.on('pageerror', e => console.log('  ! ' + name + ': ' + e.message));
  await p.setContent(html);
  await p.waitForTimeout(800);
  await p.evaluate(() => __g.skipDisc());          /* the card holds the screen otherwise */
  await p.waitForTimeout(300);
  if (cls) { await p.click('[data-cls=' + cls + ']'); await p.waitForTimeout(700); }
  try { await setup(p); } catch (e) { console.log('  ! ' + name + ' setup: ' + e.message); }
  if (!opts.keepHud) await p.evaluate(CLEAN).catch(() => {});
  /* Let the shot get going before the cut starts — for a fight, that means blows already
     landing rather than a character walking into an empty room. */
  await p.waitForTimeout(opts.settle || 500);
  const start = (Date.now() - t0) / 1000;
  await p.waitForTimeout(dur * 1000);
  await ctx.close();
  await b.close();
  const f = fs.readdirSync(dir).find(x => x.endsWith('.webm'));
  fs.renameSync(path.join(dir, f), path.join(OUT, name + '.webm'));
  fs.rmSync(dir, { recursive: true, force: true });
  writeManifest(name, { kind: 'clip', start: +start.toFixed(2), dur });
  console.log('  ' + name + '.webm  (' + dur + 's from ' + start.toFixed(1) + 's)');
}

/* The manifest is merged on disk rather than held in memory, so recording one shot at a
   time (the usual way to iterate) does not throw away the others. */
function writeManifest(name, rec) {
  const f = path.join(OUT, 'manifest.json');
  let m = {};
  try { m = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) {}
  m[name] = rec;
  fs.writeFileSync(f, JSON.stringify(m, null, 1));
}

/* A card is the game's own typography on black, screenshotted. Same fonts, same gold. */
async function card(name, lines) {
  if (ONLY && ONLY !== name) return;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await p.setContent(html);
  await p.waitForTimeout(900);
  await p.evaluate(l => {
    document.body.innerHTML = '<div style="position:fixed;inset:0;background:#000;display:flex;' +
      'align-items:center;justify-content:center;padding:40px;text-align:center">' +
      '<div>' + l.map(x =>
        '<div style="font:' + (x.big ? '900 44px' : '700 19px') + ' Cinzel,Georgia,serif;' +
        'letter-spacing:' + (x.big ? '.02em' : '.14em') + ';text-transform:uppercase;' +
        'color:' + (x.col || '#b4ab97') + ';line-height:1.35;margin:0 0 ' + (x.gap || 16) + 'px;' +
        (x.big ? 'text-shadow:0 2px 0 #3a2a10,0 0 30px rgba(200,90,40,.5);' : '') + '">' +
        x.t + '</div>').join('') +
      '</div></div>';
  }, lines);
  await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(OUT, name + '.png') });
  await b.close();
  writeManifest(name, { kind: 'card', dur: (lines.hold || 2.6) });
  console.log('  ' + name + '.png');
}

/* Holds on one of the game's own painted cinematic slides. */
const scene = (key, idx) => `(()=>{const g=__g;const S=g.scenes()['${key}'];
  g.playScene(S.slice(${idx}));document.getElementById('scSkip').style.display='none';
  document.getElementById('scNext').style.display='none';})()`;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  console.log('recording into ' + OUT);

  /* ---- the open: the world before you, in the game's own painted slides ---- */
  await clip('01_dawn', 'hacker', 4.2, async p => {
    await p.evaluate(() => { __g.G.seenIntro = false; });
    await p.waitForTimeout(400);
    await p.evaluate(scene('INTRO', 0));
    await p.waitForTimeout(200);
  }, { keepHud: true });

  await card('02_title', [
    { t: 'Unity Holdings', col: '#6f6a86', gap: 26 },
    { t: 'Unsubscribe', big: true, col: '#c8a55a', gap: 6 },
    { t: '2 0 8 7', big: true, col: '#b3261e', gap: 30 },
    { t: 'formerly Earth', col: '#6f6a86', gap: 0 }
  ]);

  /* ---- action: a district, a crowd, lightning ---- */
  await clip('03_act1', 'hacker', 5.4, async p => {
    await sk(p, 8);
    await p.evaluate(gear('hacker', 20, 'chain'));
    await sk(p, 6);
    await p.evaluate(() => { __g.G.unlocked = 40; __g.enter(3); });
    await sk(p, 8);
    await p.evaluate(() => { try { __g.repop(); } catch (e) {} });
    await p.evaluate(HUSH); await p.evaluate(CLOSE_IN);
    await sk(p, 8);                       /* landing next to a lieutenant announces it */
    await p.evaluate(BOT);
  }, { settle: 1600 });

  /* ---- dialogue: somebody talks to you ---- */
  /* A real character, saying a real line of his. */
  await clip('04_talk', 'scrapper', 5.0, async p => {
    await sk(p, 8);
    await p.evaluate(gear('scrapper', 14, 'crew'));
    await sk(p, 8);
    await p.evaluate(() => { __g.enter(0); });
    await p.waitForTimeout(700);
    await sk(p, 6);
    await p.evaluate(HUSH);
    await p.evaluate(() => { try { __g.talkFloat(); } catch (e) {} });
    await p.waitForTimeout(400);
  }, { keepHud: true });

  /* ---- the market: the thing no other loot game has ---- */
  await clip('05_market', 'courier', 4.8, async p => {
    await sk(p, 8);
    await p.evaluate(gear('courier', 30, 'rush'));
    await sk(p, 6);
    await p.evaluate(() => {
      const g = __g; g.G.sats = 4100; g.G.adopt = 38; g.G.cpi = 2.6;
      g.mktInit(); for (let i = 0; i < 90; i++) g.mktTick(1.7);
      g.openSheet('sats', {});
    });
    await p.waitForTimeout(600);
  }, { keepHud: true });

  /* ---- adventure: the deep districts, lit ---- */
  await clip('06_deep', 'founder', 5.0, async p => {
    await sk(p, 8);
    await p.evaluate(gear('founder', 70, 'head', 'G.act2=G.act3=G.act4=G.act5=true;for(let i=1;i<=22;i++)G.q["q"+i]=3'));
    await sk(p, 6);
    await p.evaluate(() => { __g.G.unlocked = 40; __g.enter(29); });
    await sk(p, 8);
    await p.evaluate(() => { try { __g.repop(); } catch (e) {} });
    await p.evaluate(HUSH); await p.evaluate(CLOSE_IN);
    await sk(p, 8);
    await p.evaluate(BOT);
  }, { settle: 1600 });

  /* ---- the boss the book is about ---- */
  await clip('07_boss', 'scrapper', 5.2, async p => {
    await sk(p, 8);
    await p.evaluate(gear('scrapper', 80, 'crew', 'G.act2=G.act3=G.act4=G.act5=true;for(let i=1;i<=24;i++)G.q["q"+i]=3'));
    await sk(p, 6);
    await p.evaluate(() => { __g.G.unlocked = 40; __g.enter(26); });
    await sk(p, 10);
    await p.evaluate(HUSH); await p.evaluate(AT_GOAL);
    await sk(p, 14);                      /* the boss announces herself; let her finish */
    await p.evaluate(HIDE_OBJ);
    await p.evaluate('window.__rng=3;' + BOT);
  }, { keepHud: true, settle: 1800 });

  await card('08_line', [
    { t: 'Three machines.', col: '#b4ab97', gap: 18 },
    { t: 'One watched.', col: '#6f6a86', gap: 10 },
    { t: 'One helped, then left.', col: '#6f6a86', gap: 10 },
    { t: 'One wants to win.', col: '#c8a55a', gap: 0 }
  ]);

  /* ---- the last fight ---- */
  await clip('09_final', 'hacker', 4.8, async p => {
    await sk(p, 8);
    await p.evaluate(gear('hacker', 88, 'chain', 'G.act2=G.act3=G.act4=G.act5=true;for(let i=1;i<=25;i++)G.q["q"+i]=3'));
    await sk(p, 6);
    await p.evaluate(() => { __g.G.unlocked = 40; __g.enter(32); });
    await sk(p, 10);
    await p.evaluate(HUSH); await p.evaluate(AT_GOAL);
    await sk(p, 14);
    await p.evaluate(HIDE_OBJ);
    await p.evaluate('window.__rng=4;' + BOT);
  }, { keepHud: true, settle: 1800 });

  await card('10_end', [
    { t: 'You took your visor off.', col: '#b4ab97', gap: 34 },
    { t: 'Unsubscribe 2087', big: true, col: '#c8a55a', gap: 26 },
    { t: 'Free. In your browser.', col: '#b4ab97', gap: 12 },
    { t: 'unsubscribe2087.netlify.app', col: '#f7931a', gap: 0 }
  ]);

  console.log('done');
})();
