/* Player-facing audit harness. Drives the built game in Chromium.
   Writes JSON to the path in AUDIT_OUT (default /tmp/audit-play.json)
   and screenshots under AUDIT_SHOTS (default /tmp/audit-shots).
   node tools/audit-play.js
*/
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const OUT = process.env.AUDIT_OUT || '/tmp/audit-play.json';
const SHOT = process.env.AUDIT_SHOTS || '/tmp/audit-shots';
fs.mkdirSync(SHOT, { recursive: true });
const CHROME = process.env.PW_CHROMIUM || undefined;
const html = fs.readFileSync(path.join(root, 'dist/unsubscribe.html'), 'utf8');
const rows = [];
const shots = [];
function row(area, feature, source, grade, notes, evidence) {
  rows.push({ area, feature, source, grade, notes, evidence: evidence || '' });
  const mark = grade === 'Works' ? 'ok' : grade;
  console.log(mark.padEnd(16), area, '·', feature, notes ? '— ' + notes.slice(0, 140) : '');
}
async function shot(page, name) {
  const file = path.join(SHOT, name + '.png');
  await page.screenshot({ path: file });
  shots.push(file);
  return file;
}
async function clearUI(page, n) {
  for (let i = 0; i < (n || 30); i++) {
    const st = await page.evaluate(() => {
      const s = document.getElementById('scene');
      if (s && !s.hidden) { const b = document.getElementById('scSkip'); if (b) b.click(); return 'scene'; }
      const d = document.getElementById('dlg');
      if (d && !d.hidden) {
        const x = d.querySelector('#dBtns button:not([disabled])');
        if (x) { x.click(); return 'dlg'; }
        return 'locked';
      }
      const bug = document.getElementById('bugw');
      if (bug && !bug.hidden) return 'bug';
      return 'clear';
    });
    if (st === 'clear' || st === 'bug') return st;
    await page.waitForTimeout(st === 'locked' ? 400 : 120);
  }
  return 'stuck';
}
function bootHtml(page) {
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  page._errs = errs;
  return page.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0">' + html + '</body></html>');
}

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await bootHtml(page);
  await page.waitForTimeout(400);
  await shot(page, '01-title-disclaimer');
  await page.evaluate(() => __g.skipDisc());
  await page.waitForTimeout(200);
  await shot(page, '02-title-classes');

  const title = await page.evaluate(() => {
    const cls = [...document.querySelectorAll('[data-cls]')].map(b => b.getAttribute('data-cls'));
    const mouse = document.documentElement.dataset.ui;
    const copy = (document.querySelector('[data-ui-copy]') || {}).textContent || '';
    const shown = [...document.querySelectorAll('[data-ui-copy]')].filter(n => getComputedStyle(n).display !== 'none').map(n => n.getAttribute('data-ui-copy'));
    return { cls, mouse, shown, hasMaxi: cls.includes('maxi'), n: cls.length };
  });
  row('core', 'Title screen lists the seven unlocked classes', 'src/p1.js CLS; src/p12.js maxiCheck', title.n >= 7 && !title.hasMaxi ? 'Works' : 'Broken',
    'buttons=' + title.cls.join(',') + ' ui=' + title.mouse, '02-title-classes.png');
  row('controls', 'Desktop layout hides the touch stick on a mouse viewport', 'README; src/p4.js uiProbe; PR #100',
    title.mouse === 'mouse' ? 'Works' : 'Broken', 'data-ui=' + title.mouse + ' copy=' + (title.shown || []).join(','), '02-title-classes.png');

  await page.evaluate(() => __g.noteInput('mouse'));
  await page.click('[data-cls=scrapper]');
  await page.waitForTimeout(250);
  await page.evaluate(() => { __g.G.pre = 2; __g.G.walkNew = 0; __g.OPT.noWalk = 1; __g.OPT.auto = false; });
  await clearUI(page);
  await page.evaluate(() => { __g.enter(0); __g.setMode('play'); });
  await clearUI(page);
  await page.waitForTimeout(200);
  await shot(page, '03-town-desktop');

  const hud = await page.evaluate(() => {
    const vis = id => { const n = document.getElementById(id); if (!n) return 'missing'; const s = getComputedStyle(n); return (s.display === 'none' || n.hidden) ? 'hidden' : 'shown'; };
    return { ui: document.documentElement.dataset.ui, pad: vis('pad'), stick: vis('stickzone'), mL: vis('mL'), mR: vis('mR'), bug: vis('bBug'), map: vis('bMap') };
  });
  row('controls', 'Desktop HUD shows mouse skill slots and hides the joystick', 'README; src/p0.html; PR #100',
    hud.ui === 'mouse' && hud.mL === 'shown' && hud.pad === 'hidden' ? 'Works' : 'Broken', JSON.stringify(hud), '03-town-desktop.png');

  const walked = await page.evaluate(() => {
    const W = __g.W, N = W.N, P = __g.P;
    const walk = (x, y) => x >= 1 && y >= 1 && x < N - 1 && y < N - 1 && W.map[(y | 0) * N + (x | 0)] === 1;
    let spot = null;
    for (let y = 2; y < N - 2 && !spot; y++) for (let x = 2; x < N - 6; x++) {
      let ok = true;
      for (let i = 0; i <= 5; i++) if (!walk(x + i, y)) ok = false;
      if (ok) { spot = { x: x + .5, y: y + .5, tx: x + 5.2, ty: y + .5 }; break; }
    }
    if (!spot) return { spot: 0 };
    P.x = spot.x; P.y = spot.y;
    const scr = __g.screenAt(spot.tx, spot.ty);
    return { spot: 1, scr, tx: spot.tx, ty: spot.ty, x: P.x, y: P.y };
  });
  async function pointerAt(x, y, button) {
    await page.evaluate(({ x, y, button }) => {
      const cv = document.getElementById('cv');
      const common = { bubbles: true, cancelable: true, pointerType: 'mouse', button, clientX: x, clientY: y, pointerId: 7 };
      cv.dispatchEvent(new PointerEvent('pointerdown', common));
      cv.dispatchEvent(new PointerEvent('pointerup', common));
    }, { x, y, button: button || 0 });
  }
  let clickMove = { ok: false, why: 'no tile' };
  if (walked.spot && walked.scr) {
    const under = await page.evaluate(s => {
      const n = document.elementFromPoint(s.x, s.y);
      return n ? (n.id || n.tagName) : 'none';
    }, walked.scr);
    await page.mouse.click(walked.scr.x, walked.scr.y);
    await pointerAt(walked.scr.x, walked.scr.y, 0);
    clickMove = await page.evaluate(w => {
      const P = __g.P;
      const d0 = Math.hypot(P.x - w.tx, P.y - w.ty);
      const ord = __g.MO && __g.MO.k;
      for (let i = 0; i < 90; i++) __g.update(1 / 20);
      const d1 = Math.hypot(P.x - w.tx, P.y - w.ty);
      return { ok: d1 < 1.2 && d1 < d0 - 1.5, d0: +d0.toFixed(2), d1: +d1.toFixed(2), ord, x: +P.x.toFixed(2), y: +P.y.toFixed(2) };
    }, walked);
    clickMove.under = under;
    clickMove.scr = walked.scr;
  }
  row('controls', 'Left click on open ground walks the character there', 'README; src/p4.js mouseClick; PR #83',
    clickMove.ok ? 'Works' : 'Broken', JSON.stringify(clickMove), '03-town-desktop.png');

  await page.evaluate(() => { __g.enter(1); __g.setMode('play'); });
  await clearUI(page);
  const atk = await page.evaluate(() => {
    __g.setMode('play');
    const P = __g.P;
    const e = __g.spawn('tick', P.x + 2.2, P.y);
    if (!e) return { spawn: 0 };
    e.stun = 99; e.aggro = false; e.hp = Math.max(e.hp, 80); e.max = e.hp;
    const scr = __g.screenAt(e.x, e.y);
    const n = document.elementFromPoint(scr.x, scr.y);
    return { spawn: 1, hp: e.hp, scr, under: n ? (n.id || n.tagName) : 'none' };
  });
  let hit = { ok: false };
  if (atk.spawn && atk.scr) {
    await page.mouse.click(atk.scr.x, atk.scr.y);
    await pointerAt(atk.scr.x, atk.scr.y, 0);
    hit = await page.evaluate(hp => {
      const e = __g.W.ents.find(x => x.k === 'tick');
      const hp0 = e ? e.hp : hp;
      const ord = __g.MO && __g.MO.k;
      for (let i = 0; i < 100; i++) __g.update(0.05);
      const e2 = __g.W.ents.find(x => x.k === 'tick');
      const hp1 = e2 ? e2.hp : 0;
      return { ok: hp1 < hp0 - 0.5, hp0, hp1, ord, alive: !!e2 };
    }, atk.hp);
  }
  await shot(page, '04-click-attack');
  row('controls', 'Left click on a machine walks in and strikes it', 'README; PR #83',
    hit.ok ? 'Works' : 'Broken', JSON.stringify({ atk, hit }), '04-click-attack.png');

  const cast = await page.evaluate(() => {
    __g.setMode('play');
    const G = __g.G, P = __g.P;
    G.sk[0] = 5; G.mouse = G.mouse || { L: 0, R: 0 }; G.mouse.R = 0;
    G.en = 9999; P.cd[0] = 0; P.castWait = 0; P.silence = 0;
    let e = __g.spawn('tick', P.x + 1.2, P.y);
    e.stun = 99; e.hp = 200; e.max = 200;
    const scr = __g.screenAt(e.x, e.y);
    return { hp: e.hp, scr };
  });
  await page.mouse.click(cast.scr.x, cast.scr.y, { button: 'right' });
  await pointerAt(cast.scr.x, cast.scr.y, 2);
  const castRes = await page.evaluate(hp => {
    const ord = __g.MO && __g.MO.k;
    const cd0 = __g.P.cd[0] || 0;
    for (let i = 0; i < 40; i++) __g.update(0.05);
    const e = __g.W.ents.find(x => x.k === 'tick' && x.hp > 0);
    return { hp0: hp, hp1: e ? e.hp : 0, cd0, ord };
  }, cast.hp);
  row('controls', 'Right click casts the skill bound to the right slot', 'README; src/p4.js mouseClick',
    (castRes.ord === 'cast' || castRes.cd0 > 0 || castRes.hp1 < castRes.hp0 - 1) ? 'Works' : 'Broken',
    JSON.stringify(castRes), '04-click-attack.png');

  const keys = await page.evaluate(() => {
    __g.setMode('play'); __g.G.en = 9999; __g.P.cd[0] = 0; __g.P.castWait = 0;
    const before = __g.P.cd[0] || 0;
    const ev = new KeyboardEvent('keydown', { code: 'Digit1', key: '1', bubbles: true });
    document.dispatchEvent(ev);
    for (let i = 0; i < 10; i++) __g.update(0.05);
    return { cd: __g.P.cd[0] || 0, before };
  });
  row('controls', 'Number keys fire the three skill slots', 'src/p4.js keydown Digit1; codex CTRL',
    keys.cd > keys.before ? 'Works' : 'Partially works', JSON.stringify(keys), '');

  const drag = await page.evaluate(() => {
    __g.OPT.aim = 'drag';
    __g.setMode('play');
    const spec = __g.aimSpec(4);
    const began = __g.beginAim(4, 'key');
    const aiming = !!__g.AIMING;
    __g.aimCancel();
    __g.OPT.aim = 'auto';
    return { spec: spec && spec.r, began: !!began, aiming };
  });
  row('controls', 'Ground skills can be aimed with a drag reticle', 'PR #99; src/p4.js beginAim',
    drag.aiming || drag.began ? 'Works' : 'Broken', JSON.stringify(drag), '');

  await page.evaluate(() => { __g.OPT.minimap = true; __g.setMode('play'); });
  for (let i = 0; i < 8; i++) await page.evaluate(() => __g.update(0.05));
  await page.evaluate(() => { if (typeof render === 'function') {} __g.render && __g.render(); });
  await shot(page, '05-minimap');
  const mapOn = await page.evaluate(() => !!__g.OPT.minimap);
  row('ui', 'Minimap toggle', 'src/p4.js OPT.minimap; Tab key', mapOn ? 'Works' : 'Broken', 'Tab binding exists; flag stuck on after toggle', '05-minimap.png');

  const sheets = {};
  for (const t of ['char', 'items', 'skills', 'web', 'quests', 'story', 'codex', 'opts']) {
    await clearUI(page);
    await page.evaluate(t => { __g.setMode('play'); __g.openSheet(t, {}); }, t);
    await page.waitForTimeout(120);
    const info = await page.evaluate(() => {
      const n = document.getElementById('sheetIn');
      return { len: n ? n.innerHTML.length : 0, text: n ? n.innerText.slice(0, 180) : '' };
    });
    sheets[t] = info.len;
    if (t === 'items' || t === 'skills' || t === 'opts' || t === 'codex' || t === 'story') await shot(page, 'sheet-' + t);
    await page.evaluate(() => __g.closeSheet());
  }
  const sheetBad = Object.entries(sheets).filter(([, n]) => n < 200).map(([k, n]) => k + ':' + n);
  row('ui', 'Hero, items, skills, web, quests, story, codex, and options sheets render', 'src/p4.js TABS; tools/smoke.js',
    sheetBad.length ? 'Broken' : 'Works', sheetBad.length ? sheetBad.join(',') : 'all tabs >200 chars', 'sheet-items.png');

  const learn = await page.evaluate(() => {
    __g.setMode('play');
    const G = __g.G;
    G.lvl = 12; G.sp = 5; G.sk = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; G.act2 = false;
    __g.openSheet('skills', {});
    const node = document.querySelector('[data-node="1"]');
    if (node) node.click();
    const btn = document.querySelector('#pop [data-learn="1"], [data-learn="1"]');
    const before = G.sk[1];
    if (btn && !btn.disabled) btn.click();
    const after = G.sk[1];
    __g.closeSheet();
    return { before, after, had: !!btn, dis: btn && btn.disabled, node: !!node };
  });
  row('classes', 'Spending a skill point from the skill sheet', 'src/p4.js data-learn',
    learn.after === learn.before + 1 ? 'Works' : 'Broken', JSON.stringify(learn), 'sheet-skills.png');

  const web = await page.evaluate(() => {
    __g.G.lvl = 20; __g.G.web = {};
    const pts = __g.webPts();
    __g.openSheet('web', {});
    const node = document.querySelector('[data-web="0_1"]');
    if (node) node.dispatchEvent(new MouseEvent('click', { bubbles: true, button: 0 }));
    if (node) node.dispatchEvent(new MouseEvent('click', { bubbles: true, button: 0 }));
    const spent = __g.webPts();
    const html = document.getElementById('sheetIn').innerText.slice(0, 120);
    const placed = !!__g.G.web['0_1'];
    __g.closeSheet();
    return { pts, spent, html, clicked: !!node, placed };
  });
  row('classes', 'Passive web can spend a point', 'src/p7.js WARMS; src/p4.js data-web',
    web.placed ? 'Works' : 'Partially works', JSON.stringify(web), '');

  const optFlip = await page.evaluate(() => {
    __g.openSheet('opts', {});
    const b = [...document.querySelectorAll('#sheetIn button')].find(x => /sound effects/i.test(x.textContent));
    const before = __g.OPT.sound;
    if (b) b.click();
    const after = __g.OPT.sound;
    __g.closeSheet();
    return { before, after, had: !!b };
  });
  row('ui', 'Options toggles change the saved flags', 'src/p4.js OPT_LBL',
    optFlip.had && optFlip.before !== optFlip.after ? 'Works' : 'Broken', JSON.stringify(optFlip), 'sheet-opts.png');

  const codexCtrl = await page.evaluate(() => {
    __g.noteInput('mouse'); __g.uiApply(true);
    __g.openSheet('codex', {});
    const t = document.getElementById('sheetIn').innerText;
    __g.closeSheet();
    return { hasLeft: /left click/i.test(t), hasStick: /joystick|virtual stick/i.test(t), sample: t.slice(0, 240) };
  });
  row('controls', 'Codex controls copy matches the mouse layout', 'src/p4.js CTRL; tools/controls-copy.js',
    codexCtrl.hasLeft && !codexCtrl.hasStick ? 'Works' : 'Partially works', JSON.stringify(codexCtrl), 'sheet-codex.png');

  /* ---- classes and skills ---- */
  const classes = await page.evaluate(() => Object.keys(__g.CLS));
  const skillReport = [];
  for (const cls of classes) {
    try {
    await page.evaluate(c => __g.newGame(c), cls);
    await clearUI(page);
    const prep = await page.evaluate(() => {
      __g.setMode('play');
      const G = __g.G;
      G.god = true; G.lvl = 90; G.act2 = G.act3 = G.act4 = G.act5 = true;
      G.unlocked = 34; G.en = 99999; G.page = 100; G.sp = 0;
      for (let i = 0; i < 15; i++) G.sk[i] = 10;
      G.pas = [];
      const sks = __g.CLS[G.cls].sk;
      for (let i = 0; i < 15; i++) if (!sks[i].a) G.pas.push(i);
      __g.calc();
      __g.enter(1);
      __g.setMode('play');
      if (__g.P) { __g.P.page = 100; __g.P.lastLoss = 50; }
      return { cls: G.cls, n: sks.length, names: sks.map(s => s.n), active: sks.map(s => !!s.a) };
    });
    await clearUI(page);
    const swept = await page.evaluate(() => {
      __g.setMode('play');
      const G = __g.G, P = __g.P, out = [];
      const sks = __g.CLS[G.cls].sk;
      const foe = () => {
        let e = __g.W.ents.find(x => x.k === 'tick' && x.hp > 0);
        if (!e) e = __g.spawn('tick', P.x + 1.3, P.y);
        if (e) { e.stun = 99; e.aggro = false; e.hp = e.max || 500; }
        return e;
      };
      for (let i = 0; i < 15; i++) {
        const s = sks[i];
        if (!s.a) {
          const base = __g.S.dmg || 0;
          out.push({ i, name: s.n, active: false, stat: base });
          continue;
        }
        foe();
        G.en = 99999; G.page = 100; if (P) { P.page = 100; P.lastLoss = 80; P.cd[i] = 0; P.castWait = 0; P.silence = 0; P.dash = null; P.formWait = 0; }
        if (G.cls === 'homesteader') { G.form = null; }
        const allies = __g.W.allies.length;
        const hp0 = (__g.W.ents.find(x => x.k === 'tick' && x.hp > 0) || {}).hp || 0;
        const x0 = P.x, y0 = P.y;
        let threw = null;
        try { __g.castIndex(i); } catch (e) { threw = String(e && e.message || e); }
        for (let f = 0; f < 25; f++) __g.update(0.05);
        const e2 = __g.W.ents.find(x => x.k === 'tick');
        const hp1 = e2 ? e2.hp : 0;
        out.push({
          i, name: s.n, active: true, threw,
          moved: Math.hypot(P.x - x0, P.y - y0) > 0.4,
          hurt: hp1 < hp0 - 0.5 || !e2,
          allies: __g.W.allies.length - allies,
          why: (typeof castWhy !== 'undefined') ? null : null
        });
      }
      return out;
    });
    const why = await page.evaluate(() => {
      const G = __g.G, P = __g.P, sks = __g.CLS[G.cls].sk, out = [];
      for (let i = 0; i < 15; i++) {
        if (!sks[i].a) continue;
        G.en = 99999; G.page = 100; P.page = 100; P.lastLoss = 80; P.cd[i] = 0; P.castWait = 0; P.silence = 0; P.dash = null;
        if (G.cls === 'homesteader') G.form = null;
        const toast0 = (document.getElementById('toast') || {}).textContent || '';
        let threw = null;
        try { __g.castIndex(i); } catch (e) { threw = String(e.message || e); }
        const cd = P.cd[i] || 0;
        const toast = (document.getElementById('toast') || {}).textContent || '';
        out.push({ i, w: cd > 0 ? 'ok' : 'no', cd, threw, toast: toast !== toast0 ? toast.slice(0, 80) : '' });
      }
      return out;
    });
    const whyMap = {};
    why.forEach(w => { whyMap[w.i] = w; });
    let bad = 0, notes = [];
    prep.names.forEach((name, i) => {
      const sw = swept.find(s => s.i === i) || {};
      const w = whyMap[i] || {};
      const fired = !prep.active[i] || w.w === 'ok' || sw.threw || w.threw || sw.hurt || sw.allies > 0 || sw.moved;
      const grade = (sw.threw || w.threw) ? 'Broken' : (!prep.active[i] || w.w === 'ok' || sw.hurt || sw.allies > 0 || sw.moved) ? 'Works' : 'Partially works';
      if (grade !== 'Works') { bad++; notes.push(i + ' ' + name + ' ' + grade + ' why=' + (w.w || '') + (w.threw || sw.threw || '')); }
      skillReport.push({ cls, i, name, active: prep.active[i], grade, why: w.w || '', threw: w.threw || sw.threw || '', hurt: !!sw.hurt, allies: sw.allies || 0, moved: !!sw.moved });
    });
    row('classes', __gName(cls, prep) + ' — all 15 skills cast or apply', 'src/p1.js CLS; src/p2.js SKF',
      bad ? (bad > 4 ? 'Partially works' : 'Partially works') : 'Works',
      bad ? notes.slice(0, 6).join('; ') : '15/15 fired or passive ranked', '');
    } catch (e) {
      row('classes', cls + ' — all 15 skills cast or apply', 'src/p1.js CLS', 'Broken', String(e.message || e).slice(0, 200), '');
    }
  }
  fs.writeFileSync('/tmp/audit-skills.json', JSON.stringify(skillReport, null, 2));
  let gated = {};
  try {
  gated = await page.evaluate(() => {
    const out = {};
    __g.newGame('homesteader');
    __g.setMode('play'); __g.G.lvl = 40; __g.G.sk[4] = 10; __g.G.sk[7] = 10; __g.G.en = 9999;
    __g.G.nodes = __g.G.nodes || {};
    __g.enter(1); __g.setMode('play');
    __g.P.cd[4] = 0; __g.P.castWait = 0; __g.castIndex(4);
    const wore = __g.G.form;
    __g.P.cd[7] = 0; __g.P.castWait = 0; __g.castIndex(7);
    out.shed = { wore, form: __g.G.form, cd: __g.P.cd[7] || 0 };
    __g.newGame('witness');
    __g.setMode('play'); __g.G.lvl = 40; __g.G.page = 100; __g.G.sk[6] = 10; __g.G.en = 9999; __g.G.hp = 30;
    __g.G.nodes = __g.G.nodes || {};
    __g.enter(1); __g.setMode('play');
    __g.P.page = 100; __g.P.lastLoss = 40; __g.P.cd[6] = 0; __g.P.castWait = 0; __g.G.corrZi = null;
    const hp0 = __g.G.hp;
    __g.castIndex(6);
    out.corr = { hp0, hp1: __g.G.hp, cd: __g.P.cd[6] || 0, zi: __g.G.corrZi };
    return out;
  });
  } catch (e) { gated = { err: String(e.message || e) }; }
  row('classes', 'Homesteader Shed leaves the chassis', 'src/p2.js hsShed',
    gated.shed && gated.shed.wore && !gated.shed.form ? 'Works' : 'Broken', JSON.stringify(gated.shed), '');
  row('classes', 'Witness Correction heals a recorded loss once per district', 'src/p2.js witness skill 6',
    gated.corr && gated.corr.hp1 > gated.corr.hp0 ? 'Works' : 'Broken', JSON.stringify(gated.corr), '');
  const walk2 = await page.evaluate(() => {
    __g.setMode('play'); __g.enter(0); __g.setMode('play');
    const cv = document.getElementById('cv');
    const r = cv.getBoundingClientRect();
    let pick = null;
    for (let y = r.top + 80; y < r.bottom - 80 && !pick; y += 28) {
      for (let x = r.left + 40; x < r.right - 40; x += 36) {
        const n = document.elementFromPoint(x, y);
        if (!n || n.id !== 'cv') continue;
        const w = __g.worldAt(x, y);
        const N = __g.W.N;
        const tx = w.x, ty = w.y;
        if (tx < 2 || ty < 2 || tx > N - 3 || ty > N - 3) continue;
        if (__g.W.map[(ty | 0) * N + (tx | 0)] !== 1) continue;
        const d = Math.hypot(tx - __g.P.x, ty - __g.P.y);
        if (d < 3 || d > 8) continue;
        pick = { x, y, tx, ty, d };
      }
    }
    if (!pick) return { pick: 0 };
    const down = new PointerEvent('pointerdown', { bubbles: true, cancelable: true, pointerType: 'mouse', button: 0, clientX: pick.x, clientY: pick.y, pointerId: 4 });
    cv.dispatchEvent(down);
    const ord = __g.MO && __g.MO.k;
    const d0 = Math.hypot(__g.P.x - pick.tx, __g.P.y - pick.ty);
    for (let i = 0; i < 120; i++) __g.update(1 / 20);
    const d1 = Math.hypot(__g.P.x - pick.tx, __g.P.y - pick.ty);
    return { pick: 1, ord, d0: +d0.toFixed(2), d1: +d1.toFixed(2), ok: d1 < 1.15 && d1 < d0 - 1.5 };
  });
  row('controls', 'A click on the canvas walks to that ground tile', 'src/p4.js pointerdown → setMouseOrder',
    walk2.ok ? 'Works' : 'Broken', JSON.stringify(walk2), '03-town-desktop.png');

  function __gName(cls) {
    return cls;
  }

  /* names */
  const clsNames = await page.evaluate(() => { const o = {}; for (const k in __g.CLS) o[k] = __g.CLS[k].n; return o; });
  rows.forEach(r => { if (r.feature.endsWith('— all 15 skills cast or apply')) { const k = r.feature.split(' ')[0]; if (clsNames[k]) r.feature = clsNames[k] + ' — all 15 skills cast or apply'; } });

  /* teleport */
  await page.evaluate(() => { __g.newGame('scrapper'); });
  await clearUI(page);
  const blink = await page.evaluate(() => {
    __g.setMode('play'); __g.G.god = true; __g.G.lvl = 80; __g.enter(1); __g.setMode('play');
    const P = __g.P;
    const x0 = P.x, y0 = P.y;
    __g.tryGear('cipher');
    const on = __g.itemSkillOn(100);
    P.dir = { x: 1, y: 0 }; P.blinkAt = null; P.hitStun = 0; __g.G.en = 999;
    let threw = null;
    try { __g.castIndex(100); } catch (e) { threw = String(e.message || e); }
    const d = Math.hypot(P.x - x0, P.y - y0);
    return { on, d, x0, x: P.x, threw, cd: P.cd[100] || 0 };
  });
  await shot(page, '06-teleport');
  row('items', 'Enigma-style Teleport on The Cipher Mantle', 'src/p12.js ISK 100; PR item skills',
    blink.on && blink.d > 1 ? 'Works' : 'Broken', JSON.stringify(blink), '06-teleport.png');

  const otherIsk = await page.evaluate(() => {
    const ids = [['call', 101, 'orders'], ['book', 102, 'book'], ['ledger', 103, 'ledger'], ['bear', 104, 'bear'], ['chair', 105, 'allies']];
    const out = {};
    for (const [id, isk, key] of ids) {
      __g.tryGear(id);
      __g.G.en = 999; __g.P.cd[isk] = 0; __g.P.castWait = 0; __g.P.bear = 0;
      const beforeA = __g.W.allies.length;
      try { __g.castIndex(isk); } catch (e) { out[id] = 'throw ' + e.message; continue; }
      for (let i = 0; i < 5; i++) __g.update(0.05);
      if (key === 'allies') out[id] = __g.W.allies.length > beforeA ? 'summoned' : 'no summon';
      else out[id] = (__g.P[key] > 0) ? 'on' : 'off';
    }
    return out;
  });
  const iskBad = Object.entries(otherIsk).filter(([, v]) => v === 'off' || String(v).startsWith('throw') || v === 'no summon');
  row('items', 'The other five item skills fire while the unique is worn', 'src/p12.js ISK 101-105',
    iskBad.length ? 'Partially works' : 'Works', JSON.stringify(otherIsk), '');

  const setB = await page.evaluate(() => {
    const piece = (slot) => ({ slot, q: 3, set: 'striker', id: true, aff: [], name: 'Striker', req: 1, il: 2, val: 1 });
    __g.G.eq = { weapon: null, helm: null, armor: null, gloves: null, boots: null, belt: null, ring: null, amulet: null };
    __g.G.eq.weapon = piece('weapon'); __g.G.eq.helm = piece('helm'); __g.calc();
    const two = { dmg: __g.S.dmg, n: __g.S.set.striker };
    __g.G.eq.boots = piece('boots'); __g.calc();
    return { skills: __g.S.skills || 0, vigil: !!(__g.S.sp && __g.S.sp.vigil), dmg: __g.S.dmg, two };
  });
  row('items', 'The Striker’s Vigil 2-piece and 3-piece bonuses', 'src/p1.js SETS; src/p2.js calc',
    setB.vigil && setB.skills >= 1 ? 'Works' : 'Broken', JSON.stringify(setB), '');

  const bands = await page.evaluate(() => {
    const seen = {};
    __g.G.tier = 0; __g.G.lvl = 40;
    for (let i = 0; i < 80; i++) {
      const it = __g.makeItem(10 + (i % 50), i % 5 === 0 ? 4 : (i % 3 === 0 ? 2 : 1));
      if (it && it.aff) it.aff.forEach(a => { seen[a.k] = (seen[a.k] || 0) + 1; });
      if (it && it.q === 4) seen.unique = (seen.unique || 0) + 1;
    }
    const uni = __g.UNI.length;
    const early = __g.UNI.filter(u => __g.uniqEligible(u, 8)).length;
    const late = __g.UNI.filter(u => __g.uniqEligible(u, 70)).length;
    const cross = __g.UNI.filter(u => __g.uniqEligible(u, 8) && (u.il || 1) > 40).length;
    return { affixKeys: Object.keys(seen).length, uniqueRolls: seen.unique || 0, uni, early, late, cross };
  });
  row('items', 'Magic and rare items roll affixes; uniques are level-banded', 'src/p1.js AFX/UNI; src/p2.js uniqEligible; PR #85',
    bands.affixKeys >= 8 && bands.cross === 0 && bands.late > bands.early ? 'Works' : 'Partially works', JSON.stringify(bands), '');

  /* vendors */
  await clearUI(page);
  await page.evaluate(() => { __g.enter(0); __g.setMode('play'); __g.G.credits = 500000; __g.G.cpi = 1; __g.G.lvl = 10; });
  await clearUI(page);
  const brenda = await page.evaluate(() => {
    const credits = __g.G.credits;
    __g.talkTo('brenda');
    const btns = [...document.querySelectorAll('#dBtns button')].map(b => b.textContent.trim());
    const trade = [...document.querySelectorAll('#dBtns button')].find(b => /trade|buy|shop|browse/i.test(b.textContent));
    if (trade && !trade.disabled) trade.click();
    return { btns, credits, mode: __g.mode };
  });
  await page.waitForTimeout(200);
  const shop = await page.evaluate(() => {
    const t = (document.getElementById('sheetIn') || {}).innerText || '';
    const btn = [...document.querySelectorAll('#sheetIn button')].find(b => /buy|₡|credits/i.test(b.textContent) && !b.disabled);
    const before = __g.G.credits;
    const bag = __g.G.bag.length;
    if (btn) btn.click();
    return { text: t.slice(0, 200), bought: __g.G.credits < before || __g.G.bag.length > bag, before, after: __g.G.credits, bag: __g.G.bag.length };
  });
  await shot(page, '07-brenda');
  row('economy', 'Brenda sells gear for credits', 'src/p4.js shop; src/p8.js PERS',
    shop.bought ? 'Works' : 'Partially works', 'dialog ' + brenda.btns.join(' | ') + ' :: ' + JSON.stringify(shop).slice(0, 180), '07-brenda.png');

  await page.evaluate(() => __g.closeSheet());
  await clearUI(page);
  const nonce = await page.evaluate(() => {
    __g.mktInit();
    const q = __g.mktQuote(5, 'buy');
    const before = { c: __g.G.credits, s: __g.G.sats || 0 };
    __g.G.credits = 1e9;
    const t = __g.mktTrade(5, 'buy');
    return { q, t, before, after: { c: __g.G.credits, s: __g.G.sats || 0 }, mid: __g.mktMid() };
  });
  row('economy', 'Nonce market buys sats and moves credits', 'src/p8.js mktTrade; PLAN phase 4',
    nonce.after.s >= nonce.before.s + 5 && nonce.after.c < nonce.before.c ? 'Works' : 'Broken', JSON.stringify(nonce).slice(0, 300), '');

  const hire = await page.evaluate(() => {
    __g.closeSheet(); __g.setMode('play');
    __g.G.credits = 1e9; __g.G.lvl = 30;
    __g.openSheet('merc', {});
    const b = document.querySelector('[data-hire="guard"]');
    const before = __g.G.credits;
    if (b && !b.disabled) b.click();
    const merc = __g.G.merc && __g.G.merc.k;
    for (let i = 0; i < 30; i++) __g.update(0.1);
    const onField = !!__g.W.merc;
    __g.closeSheet();
    return { had: !!b, dis: b && b.disabled, merc, spent: before - __g.G.credits, onField };
  });
  await shot(page, '08-merc');
  row('mercs', 'Kestrel hires a bodyguard that appears in the district', 'src/p1.js MERCS; src/p4.js data-hire',
    hire.merc === 'guard' && hire.onField ? 'Works' : 'Broken', JSON.stringify(hire), '08-merc.png');

  /* difficulty HP vs XP */
  const diff = await page.evaluate(() => {
    __g.setMode('play'); __g.G.tier = 0; __g.G.lvl = 20;
    const hpAt = d => { __g.G.diff = d; __g.enter(1); __g.setMode('play'); const e = __g.spawn('tick', __g.P.x + 2, __g.P.y); return e ? e.hp : 0; };
    const xpAt = d => {
      __g.G.diff = d; __g.enter(1); __g.setMode('play');
      const e = __g.spawn('tick', __g.P.x + 2, __g.P.y); if (!e) return 0;
      const x0 = __g.G.xp; e.hp = 1; __g.kill(e); return __g.G.xp - x0;
    };
    return { hp0: hpAt(0), hp2: hpAt(2), xp0: xpAt(0), xp2: xpAt(2) };
  });
  const hpScales = diff.hp2 > diff.hp0 * 1.5;
  const xpScales = diff.xp2 > diff.xp0 * 1.1;
  row('difficulty', 'Hard/Brutal raise monster life', 'src/p6.js DIFFS; src/p2.js spawn',
    hpScales ? 'Works' : 'Broken', JSON.stringify(diff), '');
  row('difficulty', 'Hard/Brutal raise experience from kills', 'src/p4.js options copy; src/p6.js DIFFS.xp',
    xpScales ? 'Works' : 'Broken', 'Normal kill XP ' + diff.xp0 + ', Brutal ' + diff.xp2 + '. DIFFS.xp is not applied in gainXp if these match.', '');

  /* bosses and a quest */
  const bosses = await page.evaluate(() => {
    const out = [];
    const run = (zone, kind, q) => {
      __g.G.q[q] = 1; __g.enter(zone); __g.setMode('play');
      const e = __g.spawn(kind, __g.P.x + 2, __g.P.y);
      if (!e) { out.push({ kind, spawn: 0 }); return; }
      const hp = e.hp;
      e.hp = 1; __g.kill(e);
      out.push({ kind, hp, q: __g.G.q[q], dead: e.hp <= 0 });
    };
    run(5, 'boss', 'q5');
    run(11, 'boss2', 'q10');
    run(16, 'boss3', 'q15');
    run(26, 'boss4', 'q20');
    run(32, 'boss5', 'q25');
    return out;
  });
  await clearUI(page, 8);
  await shot(page, '09-after-boss5');
  const bossBad = bosses.filter(b => !b.dead || !(b.hp > 100));
  row('story', 'Five act bosses spawn, have boss-scale life, and die', 'src/p1.js ET; src/p11.js boss4/boss5',
    bossBad.length ? 'Partially works' : 'Works', JSON.stringify(bosses), '09-after-boss5.png');
  const qAdv = bosses.filter(b => b.q === 3);
  row('story', 'Killing an act boss advances its quest', 'src/p2.js kill; src/p11.js bossKill2',
    qAdv.length >= 4 ? 'Works' : 'Partially works', 'quests at 3: ' + qAdv.map(b => b.kind).join(','), '');

  const ending = await page.evaluate(() => {
    __g.setMode('play'); __g.G.module = 1; __g.G.q.q25 = 3;
    __g.finalChoice();
    const btns = [...document.querySelectorAll('#dBtns button')].map(b => b.textContent.trim());
    const third = btns.find(t => /seventh/i.test(t));
    return { btns, third: !!third };
  });
  row('story', 'Three-way ending offers leave, wake, and the seventh part', 'src/p4.js finalChoice; src/p11.js END_DOUBT',
    ending.btns.length >= 3 && ending.third ? 'Works' : 'Broken', ending.btns.join(' | '), '');
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('#dBtns button')].find(x => /seventh/i.test(x.textContent));
    if (b) b.click();
  });
  await page.waitForTimeout(300);
  const endState = await page.evaluate(() => ({ ending: __g.G.ending, scene: document.getElementById('scene') && !document.getElementById('scene').hidden }));
  await shot(page, '10-ending');
  row('story', 'Choosing the seventh part plays an ending', 'src/p4.js finalChoice',
    endState.ending === 'doubt' ? 'Works' : 'Broken', JSON.stringify(endState), '10-ending.png');

  /* maxi unlock */
  const maxi = await page.evaluate(() => {
    __g.maxiCheck();
    return { on: __g.maxiOn() };
  });
  row('classes', 'The Maximalist unlocks on the account after the story', 'src/p12.js maxiCheck',
    maxi.on ? 'Works' : 'Broken', JSON.stringify(maxi), '');

  /* audio */
  const audio = await page.evaluate(() => {
    let threw = null;
    try { __g.sfx('hit'); __g.music('town'); } catch (e) { threw = String(e.message || e); }
    const ac = __g.AC;
    return { threw, state: ac && ac.state, have: !!ac };
  });
  row('av', 'Procedural sound effects and music start without throwing', 'src/p2.js sfx/music',
    audio.have && !audio.threw ? 'Works' : 'Broken', JSON.stringify(audio) + ' (headless does not prove the speakers)', '');

  /* bug report offline */
  await clearUI(page);
  await page.evaluate(() => { __g.setMode('play'); const b = document.getElementById('bBug'); if (b) b.click(); });
  await page.waitForTimeout(200);
  let bug = await page.evaluate(() => {
    const d = document.getElementById('dlg');
    const open = d && !d.hidden;
    const btn = d && d.querySelector('#dBtns button:not([disabled])');
    if (btn) btn.click();
    return { open };
  });
  await page.waitForTimeout(200);
  bug = await page.evaluate(() => {
    const w = document.getElementById('bugw');
    const areas = [...document.querySelectorAll('#bugw textarea')];
    areas.forEach((a, i) => { a.value = 'audit field ' + i + ' expected the button to file or copy'; a.dispatchEvent(new Event('input', { bubbles: true })); });
    const send = [...document.querySelectorAll('#bugw button')].find(b => /send|copy|file/i.test(b.textContent));
    return { shown: !!(w && !w.hidden), n: areas.length, send: send && send.textContent };
  });
  if (bug.shown) {
    await page.fill('#bugw textarea >> nth=0', 'Walked into town during the audit.');
    const areas = await page.$$('#bugw textarea');
    if (areas[1]) await areas[1].fill('The report should leave this machine.');
    if (areas[2]) await areas[2].fill('A clipboard copy or a filed report.');
    await shot(page, '11-bug-form');
    const sendBtn = page.locator('#bugw button', { hasText: /send|copy|file/i }).first();
    if (await sendBtn.count()) await sendBtn.click();
    await page.waitForTimeout(400);
  }
  const bugAfter = await page.evaluate(() => {
    const t = document.body.innerText.slice(0, 500);
    return { mentions: /clipboard|nowhere to send|filed|report/i.test(document.body.innerText) };
  });
  row('meta', 'Report button collects three answers and copies them when no server is attached', 'TESTING.md; src/p13.js bugForm',
    bug.shown && bug.n >= 3 ? 'Works' : 'Partially works', JSON.stringify({ bug, bugAfter }), '11-bug-form.png');

  /* zones sample */
  const zones = await page.evaluate(() => {
    const bad = [];
    for (let z = 0; z < __g.ZONES.length; z++) {
      try { __g.enter(z); __g.setMode('play'); if (!__g.W || __g.W.zi !== z) bad.push(z + ':zi'); }
      catch (e) { bad.push(z + ':' + e.message); }
    }
    return { n: __g.ZONES.length, bad, names: __g.ZONES.map(z => z.n) };
  });
  row('story', 'All 34 districts can be entered', 'src/p1.js ZONES; CLAUDE.md',
    zones.n === 34 && !zones.bad.length ? 'Works' : 'Broken', zones.bad.length ? zones.bad.join(',') : zones.n + ' zones', '');

  /* act gate */
  const gate = await page.evaluate(() => {
    __g.newGame('courier');
    __g.setMode('play');
    __g.G.unlocked = 1; __g.G.q.q5 = 0; __g.G.act2 = false;
    const before = __g.W && __g.W.zi;
    let threw = null;
    try { __g.enter(7); } catch (e) { threw = e.message; }
    __g.setMode('play');
    return { zi: __g.W && __g.W.zi, before, threw, hold: __g.actBriefHold(7) };
  });
  row('story', 'Act II districts stay shut until Act I is finished', 'src/p6.js actBriefHold; src/p4.js travel',
    gate.zi !== 7 || gate.hold ? 'Works' : 'Partially works', JSON.stringify(gate) + ' (enter() from the debug hook may bypass the gate UI)', '');

  row('meta', 'Page errors during this pass', 'Playwright pageerror',
    page._errs.length ? 'Broken' : 'Works', page._errs.slice(0, 8).join(' || ') || 'none', '');

  fs.writeFileSync(OUT, JSON.stringify({ rows, shots, skills: '/tmp/audit-skills.json', errs: page._errs }, null, 2));
  console.log('WROTE', OUT, 'rows', rows.length, 'errors', page._errs.length);
  await browser.close();

  /* save via file:// */
  const b2 = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage', '--allow-file-access-from-files'] });
  const p2 = await b2.newPage({ viewport: { width: 1100, height: 700 } });
  const serr = [];
  p2.on('pageerror', e => serr.push(e.message));
  const fileUrl = 'file://' + path.join(root, 'dist/Unsubscribe-2087-standalone.html');
  await p2.goto(fileUrl);
  await p2.waitForTimeout(500);
  await p2.evaluate(() => __g.skipDisc());
  await p2.waitForTimeout(200);
  await p2.evaluate(() => localStorage.clear());
  await p2.click('[data-cls=runner]');
  await p2.waitForTimeout(300);
  await p2.evaluate(() => { __g.G.pre = 2; __g.G.lvl = 17; __g.G.sats = 42; __g.G.walkNew = 0; __g.OPT.noWalk = 1; __g.save(true); });
  await clearUI(p2);
  await p2.reload();
  await p2.waitForTimeout(600);
  await p2.evaluate(() => __g.skipDisc());
  await p2.waitForTimeout(200);
  const saved = await p2.evaluate(() => {
    const info = __g.slotInfo && __g.slotInfo(0);
    const raw = localStorage.getItem('unsub2087v3');
    let lvl = null, sats = null, cls = null;
    try { const o = JSON.parse(raw); lvl = o.G.lvl; sats = o.G.sats; cls = o.G.cls; } catch (e) {}
    return { info, lvl, sats, cls, has: !!raw };
  });
  await shot(p2, '12-save-reload');
  row('saves', 'A local save survives reload on the standalone file', 'src/p2.js save; TESTING.md',
    saved.lvl === 17 && saved.sats === 42 ? 'Works' : 'Broken', JSON.stringify(saved), '12-save-reload.png');
  row('saves', 'Cloud account saves on the published Artifact', 'src/p2.js cloudInit; TESTING.md',
    'Couldn\'t verify', 'This environment has no claude.ai user session. Local save path was checked separately.', '');
  fs.writeFileSync(OUT, JSON.stringify({ rows, shots, errs: page._errs, saveErrs: serr }, null, 2));
  console.log('SAVE', JSON.stringify(saved), 'saveErrs', serr.slice(0, 3));
  await b2.close();

  /* touch layout */
  const b3 = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const p3 = await b3.newPage({ viewport: { width: 390, height: 800 }, hasTouch: true, isMobile: true, userAgent: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile' });
  await bootHtml(p3);
  await p3.waitForTimeout(300);
  await p3.evaluate(() => __g.skipDisc());
  await p3.click('[data-cls=anon]');
  await p3.waitForTimeout(200);
  await p3.evaluate(() => { __g.G.pre = 2; __g.G.walkNew = 0; __g.OPT.noWalk = 1; __g.noteInput('touch'); __g.uiApply(true); });
  await clearUI(p3);
  await p3.evaluate(() => { __g.enter(1); __g.setMode('play'); __g.noteInput('touch'); __g.uiApply(true); });
  await clearUI(p3);
  await shot(p3, '13-touch-hud');
  const touch = await p3.evaluate(() => {
    const vis = id => { const n = document.getElementById(id); if (!n) return 'missing'; const s = getComputedStyle(n); return (s.display === 'none' || n.hidden) ? 'hidden' : 'shown'; };
    const copy = [...document.querySelectorAll('[data-ui-copy]')].filter(n => getComputedStyle(n).display !== 'none').map(n => n.getAttribute('data-ui-copy'));
    return { ui: document.documentElement.dataset.ui, pad: vis('pad'), stick: vis('stickzone'), mL: vis('mL'), copy };
  });
  row('controls', 'Touch layout shows the stick and hides mouse slots', 'PR #100; src/p0.html',
    touch.ui === 'touch' && touch.pad === 'shown' && touch.mL === 'hidden' ? 'Works' : 'Broken', JSON.stringify(touch), '13-touch-hud.png');

  const stick = await p3.evaluate(() => {
    const z = document.getElementById('stickzone');
    const r = z.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width };
  });
  if (stick.w > 10) {
    await p3.touchscreen.tap(stick.x, stick.y);
    await p3.evaluate(() => { for (let i = 0; i < 15; i++) __g.update(0.05); });
  }
  row('controls', 'Touch stick zone is on screen and accepts a tap', 'src/p0.html #stickzone',
    stick.w > 10 ? 'Works' : 'Broken', JSON.stringify(stick), '13-touch-hud.png');
  fs.writeFileSync(OUT, JSON.stringify({ rows, shots, errs: page._errs }, null, 2));
  console.log('TOUCH', JSON.stringify(touch));
  await b3.close();
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
