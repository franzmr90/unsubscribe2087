/* Touch vs mouse layout: probe, live switch, override, panels, both wordings.
   node tools/input-layout.js */
const {chromium, devices} = require('playwright');
const fs = require('fs');
const path = require('path');
const {execFileSync} = require('child_process');
const root = path.join(__dirname, '..');
const outDir = process.env.LAYOUT_OUT || '/opt/cursor/artifacts/layout';
fs.mkdirSync(outDir, {recursive: true});

const html = fs.readFileSync(path.join(root, 'dist/unsubscribe.html'), 'utf8');
const fail = [];
function check(name, ok, detail) { if (!ok) fail.push(name + (detail ? ' ' + detail : '')); }

async function boot(page) {
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0">' + html + '</body></html>');
  await page.waitForTimeout(250);
  await page.evaluate(() => __g.skipDisc());
  await page.waitForTimeout(80);
  return errs;
}

async function clearUI(page) {
  for (let i = 0; i < 24; i++) {
    const st = await page.evaluate(() => {
      const s = document.getElementById('scene');
      if (s && !s.hidden) { document.getElementById('scSkip').click(); return 'scene'; }
      const d = document.getElementById('dlg');
      if (d && !d.hidden) { const x = d.querySelector('#dBtns button:not([disabled])'); if (x) { x.click(); return 'dlg'; } return 'locked'; }
      return 'clear';
    });
    if (st === 'clear') return;
    await page.waitForTimeout(st === 'locked' ? 350 : 140);
  }
  throw new Error('overlays did not clear');
}

async function enterTown(page) {
  await page.click('[data-cls=scrapper]');
  await page.waitForTimeout(150);
  await page.evaluate(() => { __g.G.pre = 2; __g.G.walkNew = 0; __g.OPT.noWalk = 1; __g.OPT.auto = false; __g.G.god = true; });
  await clearUI(page);
  await page.evaluate(() => { __g.enter(0); __g.setMode('play'); });
  await clearUI(page);
  await page.waitForTimeout(120);
}

function fire(page, type, pointerType, extra) {
  return page.evaluate(({type, pointerType, extra}) => {
    const e = new PointerEvent(type, Object.assign({bubbles: true, cancelable: true, pointerType, clientX: 40, clientY: 40, movementX: 0, movementY: 0}, extra || {}));
    window.dispatchEvent(e);
    return document.documentElement.dataset.ui;
  }, {type, pointerType, extra});
}

async function shot(page, name) {
  const file = path.join(outDir, name + '.png');
  await page.screenshot({path: file});
  return file;
}

async function panelFits(page, tab) {
  return page.evaluate((tab) => {
    __g.openSheet(tab, {});
    const sheet = document.getElementById('sheet');
    const body = sheet.querySelector('.sheetBody') || sheet;
    const r = sheet.getBoundingClientRect();
    const wide = body.scrollWidth > body.clientWidth + 2;
    const off = r.right > innerWidth + 2 || r.bottom > innerHeight + 2 || r.left < -2 || r.top < -2;
    return {tab, wide, off, sw: body.scrollWidth, cw: body.clientWidth, w: innerWidth, h: innerHeight, right: Math.round(r.right), bottom: Math.round(r.bottom)};
  }, tab);
}

(async () => {
  const browser = await chromium.launch({executablePath: process.env.PW_CHROMIUM || undefined});
  const shots = {touch: [], mouse: [], devices: []};

  /* Desktop starts as mouse, then a touch and a key switch it live. */
  {
    const ctx = await browser.newContext({viewport: {width: 1280, height: 800}, hasTouch: true});
    const page = await ctx.newPage();
    const errs = await boot(page);
    check('desktop boots clean', !errs.length, errs[0]);
    const probe = await page.evaluate(() => ({
      ui: document.documentElement.dataset.ui,
      coarse: matchMedia('(pointer: coarse)').matches,
      hoverNone: matchMedia('(hover: none)').matches,
      pts: navigator.maxTouchPoints || 0,
      touchFn: __g.uiTouch(),
      pad: getComputedStyle(document.getElementById('pad')).display,
      stick: getComputedStyle(document.getElementById('stickzone')).display,
      menu: getComputedStyle(document.getElementById('bbs')).display,
      mL: getComputedStyle(document.getElementById('mL')).display,
      action: getComputedStyle(document.getElementById('cv')).touchAction,
      callout: getComputedStyle(document.getElementById('cv')).webkitTouchCallout
    }));
    check('desktop probe is mouse', probe.ui === 'mouse' && probe.touchFn === false, JSON.stringify(probe));
    check('desktop hides the stick and the buttons', probe.pad === 'none' && probe.stick === 'none' && probe.menu === 'none' && probe.mL !== 'none', JSON.stringify(probe));
    check('canvas refuses zoom and the callout', probe.action === 'none', probe.action);
    shots.mouse.push(['Title', await shot(page, 'mouse-title')]);
    await enterTown(page);
    shots.mouse.push(['Fight', await shot(page, 'mouse-hud')]);
    const codex = await page.evaluate(() => { __g.openSheet('codex', {}); return document.getElementById('sheetIn').innerText; });
    check('desk controls say left click', /left click/i.test(codex));
    check('desk controls say F1 through F8', /F1 through F8/.test(codex));
    check('desk controls hide the phone paragraph', !/On a phone, the stick walks/.test(codex));
    await page.evaluate(() => __g.closeSheet());
    const touched = await fire(page, 'pointerdown', 'touch');
    check('a touch switches the desk to touch', touched === 'touch');
    const afterTouch = await page.evaluate(() => ({
      pad: getComputedStyle(document.getElementById('pad')).display,
      mL: getComputedStyle(document.getElementById('mL')).display,
      seen: __g.OPT.uiSeen
    }));
    check('touch shows the pad and hides the hotbar', afterTouch.pad !== 'none' && afterTouch.mL === 'none', JSON.stringify(afterTouch));
    check('the last touch is remembered', afterTouch.seen === 'touch', afterTouch.seen);
    const moved = await fire(page, 'pointermove', 'mouse', {movementX: 12, movementY: 4});
    check('a real mouse move switches back', moved === 'mouse', moved);
    await page.evaluate(() => { __g.OPT.ui = 'auto'; __g.noteInput('touch'); });
    await page.keyboard.press('F9');
    const afterKey = await page.evaluate(() => document.documentElement.dataset.ui);
    check('a keypress switches to the desk', afterKey === 'mouse', afterKey);
    /* override wins over the last event */
    await page.evaluate(() => { __g.OPT.ui = 'touch'; __g.uiApply(true); });
    await fire(page, 'pointermove', 'mouse', {movementX: 8, movementY: 3});
    const locked = await page.evaluate(() => ({ui: document.documentElement.dataset.ui, touch: __g.uiTouch()}));
    check('Touch override stays on touch', locked.ui === 'touch' && locked.touch === true, JSON.stringify(locked));
    await page.evaluate(() => { __g.OPT.ui = 'mouse'; __g.uiApply(true); });
    await fire(page, 'pointerdown', 'touch');
    const lockedM = await page.evaluate(() => document.documentElement.dataset.ui);
    check('Mouse override stays on the desk', lockedM === 'mouse', lockedM);
    await page.evaluate(() => { __g.OPT.ui = 'auto'; __g.noteInput('mouse'); __g.uiApply(true); });
    const menu = await page.evaluate(() => {
      const t = document.getElementById('bAtk').title;
      const map = document.getElementById('bMap').title;
      return {t, map};
    });
    check('desk button tips name the keys', /left click|Space/i.test(menu.t) && menu.map === 'Tab', JSON.stringify(menu));
    for (const tab of ['items', 'skills', 'opts', 'web', 'shop', 'stash', 'sats']) {
      const fit = await panelFits(page, tab);
      check('desk ' + tab + ' stays on screen', !fit.wide && !fit.off, JSON.stringify(fit));
      shots.mouse.push([tab, await shot(page, 'mouse-' + tab)]);
      await page.evaluate(() => __g.closeSheet());
    }
    const walk = await page.evaluate(() => __g.slideLine(__g.WALK.basics[0]));
    check('desk walkthrough says left click', /left click/i.test(walk), walk.slice(0, 80));
    check('desk walkthrough hides the stick sentence', !/On a phone, the stick walks/.test(walk));
    await page.evaluate(() => { const s = document.getElementById('scene'); if (s) s.hidden = true; });
    const prevented = await page.evaluate(() => {
      const e = new MouseEvent('contextmenu', {bubbles: true, cancelable: true});
      document.getElementById('cv').dispatchEvent(e);
      return e.defaultPrevented;
    });
    check('the canvas eats the long-press menu', prevented === true);
    shots.devices.push(['Desktop', await shot(page, 'device-desktop')]);
    await ctx.close();
  }

  async function phone(name, device, landscape) {
    const desc = devices[device];
    if (!desc) throw new Error('no device ' + device);
    const viewport = landscape ? {width: desc.viewport.height, height: desc.viewport.width} : desc.viewport;
    const ctx = await browser.newContext(Object.assign({}, desc, {viewport}));
    const page = await ctx.newPage();
    const errs = await boot(page);
    check(name + ' boots clean', !errs.length, errs[0]);
    const probe = await page.evaluate(() => ({
      ui: document.documentElement.dataset.ui,
      coarse: matchMedia('(pointer: coarse)').matches,
      hoverNone: matchMedia('(hover: none)').matches,
      pts: navigator.maxTouchPoints || 0,
      small: Math.min(innerWidth, innerHeight) < 820,
      pad: getComputedStyle(document.getElementById('pad')).display,
      mL: getComputedStyle(document.getElementById('mL')).display,
      menu: getComputedStyle(document.getElementById('bbs')).display,
      banner: document.getElementById('uiPort').hidden,
      portrait: innerHeight > innerWidth,
      w: innerWidth, h: innerHeight,
      label: getComputedStyle(document.querySelector('.sk')).content
    }));
    const expectTouch = probe.coarse || (probe.hoverNone && probe.pts > 0) || (probe.pts > 0 && probe.small);
    check(name + ' probe matches the features', probe.ui === (expectTouch ? 'touch' : 'mouse'), JSON.stringify(probe));
    check(name + ' shows touch controls', probe.pad !== 'none' && probe.mL === 'none' && probe.menu !== 'none', JSON.stringify(probe));
    check(name + ' hides the key badges', probe.label === 'none' || probe.label === 'normal', probe.label);
    if (probe.portrait && Math.min(probe.w, probe.h) < 700) check(name + ' recommends landscape', probe.banner === false, JSON.stringify(probe));
    else check(name + ' does not nag in landscape', probe.banner === true, JSON.stringify(probe));
    const blurb = await page.evaluate(() => {
      const nodes = [...document.querySelectorAll('[data-ui-copy]')].map(n => ({k: n.getAttribute('data-ui-copy'), on: getComputedStyle(n).display !== 'none', t: n.textContent.slice(0, 40)}));
      return nodes;
    });
    const shown = blurb.filter(n => n.on).map(n => n.k);
    check(name + ' title copy is touch only', shown.length === 1 && shown[0] === 'touch', JSON.stringify(blurb));
    if (name === 'iPhone') {
      shots.touch.push(['Title', await shot(page, 'touch-title')]);
      await enterTown(page);
      shots.touch.push(['Fight', await shot(page, 'touch-hud')]);
      const tips = await page.evaluate(() => ({atk: document.getElementById('bAtk').title, map: document.getElementById('bMap').title}));
      check('phone tips do not name keys', tips.atk === 'Attack' && tips.map === 'Map', JSON.stringify(tips));
      const codex = await page.evaluate(() => { __g.openSheet('codex', {}); return document.getElementById('sheetIn').innerText; });
      check('phone controls say the stick', /On a phone, the stick walks/.test(codex));
      check('phone controls hide F1 through F8', !/F1 through F8/.test(codex));
      await page.evaluate(() => __g.closeSheet());
      for (const tab of ['items', 'skills', 'opts', 'web', 'shop', 'stash', 'sats']) {
        const fit = await panelFits(page, tab);
        check('phone ' + tab + ' stays on screen', !fit.wide && !fit.off, JSON.stringify(fit));
        shots.touch.push([tab, await shot(page, 'touch-' + tab)]);
        await page.evaluate(() => __g.closeSheet());
      }
      const walk = await page.evaluate(() => __g.slideLine(__g.WALK.basics[0]));
      check('phone walkthrough says the stick', /On a phone, the stick walks/.test(walk), walk.slice(0, 90));
      check('phone walkthrough hides left click', !/left click/i.test(walk));
      await page.evaluate(() => { const s = document.getElementById('scene'); if (s) s.hidden = true; __g.setMode('play'); });
      /* a keyboard on the phone switches to the desk */
      await page.keyboard.press('F9');
      const desk = await page.evaluate(() => ({ui: document.documentElement.dataset.ui, pad: getComputedStyle(document.getElementById('pad')).display}));
      check('a phone keyboard switches to the desk', desk.ui === 'mouse' && desk.pad === 'none', JSON.stringify(desk));
      await fire(page, 'pointerdown', 'touch');
      const back = await page.evaluate(() => document.documentElement.dataset.ui);
      check('a later touch returns the phone layout', back === 'touch', back);
    } else {
      await enterTown(page);
    }
    shots.devices.push([name + (landscape ? ' landscape' : ''), await shot(page, 'device-' + name.toLowerCase().replace(/\s+/g, '-') + (landscape ? '-land' : ''))]);
    await ctx.close();
  }

  await phone('iPhone', 'iPhone 13', false);
  await phone('iPhone wide', 'iPhone 13', true);
  await phone('Pixel', 'Pixel 5', false);
  await phone('iPad', 'iPad Pro 11', true);

  /* iPad that never sees a key stays on touch. iPad plus a key is the keyboard case, already covered on the phone. */
  {
    const desc = devices['iPad Pro 11'];
    const ctx = await browser.newContext(Object.assign({}, desc, {viewport: {width: desc.viewport.height, height: desc.viewport.width}}));
    const page = await ctx.newPage();
    await boot(page);
    const ui = await page.evaluate(() => document.documentElement.dataset.ui);
    check('iPad without a keyboard stays on touch', ui === 'touch', ui);
    shots.devices.push(['iPad no keyboard', await shot(page, 'device-ipad-nokey')]);
    await ctx.close();
  }

  await browser.close();

  const py = `
from PIL import Image, ImageDraw
import os, sys
out, kind = sys.argv[1], sys.argv[2]
rows = []
for line in sys.stdin:
    label, path = line.rstrip('\\n').split('\\t')
    im = Image.open(path).convert('RGB')
    rows.append((label, im))
if not rows:
    raise SystemExit('no shots')
w = 280
gap = 8
cell_h = 168
head = 22
cols = min(4, len(rows))
import math
rs = math.ceil(len(rows)/cols)
sheet = Image.new('RGB', (cols*w + (cols+1)*gap, rs*(cell_h+head) + (rs+1)*gap), (12,10,16))
draw = ImageDraw.Draw(sheet)
for i,(label,im) in enumerate(rows):
    c, r = i%cols, i//cols
    x = gap + c*(w+gap)
    y = gap + r*(cell_h+head+gap)
    draw.text((x, y), label, fill=(200,165,90))
    scale = min(w/im.width, cell_h/im.height)
    nw, nh = max(1,int(im.width*scale)), max(1,int(im.height*scale))
    thumb = im.resize((nw, nh))
    sheet.paste(thumb, (x, y+head))
dest = os.path.join(out, 'contact-'+kind+'.png')
sheet.save(dest)
print(dest)
`;
  function contact(kind, rows) {
    if (!rows.length) return;
    const input = rows.map(([label, file]) => label + '\t' + file).join('\n');
    const dest = execFileSync('python3', ['-c', py, outDir, kind], {input, encoding: 'utf8'}).trim();
    console.log('sheet', dest);
  }
  contact('mouse', shots.mouse);
  contact('touch', shots.touch);
  contact('devices', shots.devices);

  if (fail.length) {
    console.error(fail.join('\n'));
    process.exit(1);
  }
  console.log('input layout ok');
})().catch(e => { console.error(e); process.exit(1); });
