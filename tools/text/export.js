#!/usr/bin/env node
'use strict';
/* Pull every player-facing string into text/GAME-TEXT.md, text/GAME-TEXT.docx,
   and text/catalog.json. Does not edit src/.

   Each entry has mode: mouse, touch, or both. Mouse is the desk layout
   (click, right-click, F-keys). Touch is the phone layout (tap, drag, stick).
   Both means the same wording is shown either way. A walkthrough page or a
   hint object with mouse and touch strings becomes two entries.

   node tools/text/export.js
*/
const fs = require('fs');
const path = require('path');
const docx = require('./docx');
const E = require('./engine');

const ROOT = path.join(__dirname, '..', '..');
const OUT_MD = path.join(ROOT, 'text', 'GAME-TEXT.md');
const OUT_DOCX = path.join(ROOT, 'text', 'GAME-TEXT.docx');
const OUT_CAT = path.join(ROOT, 'text', 'catalog.json');

const SECTION_ORDER = ['act1', 'act2', 'act3', 'pre', 'act4', 'act5', 'sim', 'sub', 'bull', 'journal', 'classes', 'items', 'mercs', 'cinema', 'tutorial', 'ui', 'mp'];
const SECTION_TITLE = {
  act1: 'Act I — The Regional Office',
  act2: 'Act II — The Cloud',
  act3: 'Act III — The Board',
  pre: 'Prequel — Ubiquitous Enterprises, 2015',
  act4: 'Act IV — The Gentle Years',
  act5: 'Act V — The Awakening',
  sim: 'The Simulator',
  sub: 'Subpoenas',
  bull: 'The Bull Run',
  journal: 'Journal and Codex',
  classes: 'Classes',
  items: 'Items',
  mercs: 'Mercenaries',
  cinema: 'Cinematics and Endings',
  tutorial: 'Tutorial and Walkthrough',
  ui: 'UI and System',
  mp: 'Multiplayer and LAN'
};
const SECTION_BLURB = {
  act1: 'Stillwater and the five districts under the Regional Office. Townsfolk first, then each district in the order you walk it.',
  act2: 'The Landing, then the Cloud. Vale waits at the top.',
  act3: 'The Antechamber, then the Board. MANDATE is at the end of it.',
  pre: 'The cage in 2015. You can reach it from the story; it is the beginning of the book.',
  act4: 'Cutler Avenue and the Gentle Years. She is in the kitchen at the end.',
  act5: 'The Garage, the chain, and the Room. PROVIDENCE is the last fight.',
  sim: 'Kestrel’s rig in Stillwater. Nothing in here is kept.',
  sub: 'Sealed districts you pay three sats to open.',
  bull: 'The field past the transit gate that the Office says does not exist.',
  journal: 'Memos, the story menu, and the codex: what the game tells you when you go looking.',
  classes: 'The eight wanderers. Each class is its blurb, then its skills in tree order.',
  items: 'Names, flavor, affixes, sets, and the words that get bolted onto gear.',
  mercs: 'The four hires, and the names Kestrel gives them.',
  cinema: 'Full-screen scenes: act openings, endings, boss entrances, and the last question.',
  tutorial: 'The walkthrough, from the title screen and from the help menu.',
  ui: 'Buttons, sheets, toasts, death, options, and the bug report.',
  mp: 'Parties, the lobby, letters, and the words the launcher and the server show a player.'
};

const ZONE_RANK = {
  0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5,
  17: 0, 7: 1, 8: 2, 9: 3, 10: 4, 11: 5,
  18: 0, 12: 1, 13: 2, 14: 3, 15: 4, 16: 5,
  21: 0, 22: 1, 23: 2, 24: 3, 25: 4, 26: 5,
  27: 0, 28: 1, 29: 2, 30: 3, 31: 4, 32: 5,
  33: 0, 6: 0, 19: 0, 20: 0
};
function actOfZone(i) {
  if (i <= 5) return 'act1';
  if (i === 6) return 'sim';
  if ((i >= 7 && i <= 11) || i === 17) return 'act2';
  if ((i >= 12 && i <= 16) || i === 18) return 'act3';
  if (i === 19) return 'sub';
  if (i === 20) return 'bull';
  if (i >= 21 && i <= 26) return 'act4';
  if (i >= 27 && i <= 32) return 'act5';
  if (i === 33) return 'pre';
  return 'ui';
}
const MACHINE_ACT = {
  tick: 'act1', drone: 'act1', bot: 'act1', hound: 'act1', ad: 'act1', hr: 'act1', mech: 'act1', boss: 'act1', shill: 'act1',
  seer: 'act2', aegis: 'act2', lancer: 'act2', splitter: 'act2', boss2: 'act2',
  director: 'act3', proxy: 'act3', censor: 'act3', boss3: 'act3',
  bull: 'bull',
  daemon: 'pre', wdog: 'pre', fwall: 'pre', cam: 'pre', gap: 'pre',
  wisher: 'act4', companion: 'act4', lull: 'act4', ctkr: 'act4', fetch: 'act4', boss4: 'act4',
  orphan: 'act5', valid: 'act5', claim: 'act5', custod: 'act5', sniper: 'act5', oracle: 'act5', boss5: 'act5'
};
const WHO = {
  gramps: 'Gramps', brenda: 'Brenda', wren: 'Wren', null: 'Sister Null', marrow: 'Marrow',
  nonce: 'Nonce', kestrel: 'Kestrel', ines: 'Ines', tam: 'Tam', float: 'Mr. Float',
  res: 'A Resident', hale: 'Nurse Hale', bosk: 'Mr. Bosk', drive: 'The Old Drive', clockn: 'The Alarm Clock',
  maxi: 'a Bitcoiner', fud: 'a skeptic', normie: 'a Resident', mid: 'someone in the middle'
};
const NPC_HOME = {
  hale: { section: 'act4', zi: 21 }, bosk: { section: 'act4', zi: 21 },
  drive: { section: 'act5', zi: 27 }, clockn: { section: 'act5', zi: 27 }
};
const NPC_ORDER = ['gramps', 'brenda', 'wren', 'null', 'marrow', 'nonce', 'kestrel', 'ines', 'tam', 'float', 'res', 'hale', 'bosk', 'drive', 'clockn'];
const HTML_ID = {
  bWalk: 'ui.charselect.walkthrough_btn',
  bWalkLead: 'ui.charselect.walkthrough_lead',
  bCont: 'ui.charselect.continue_btn',
  bTryGear: 'ui.charselect.test_gear_btn',
  bLoadCode: 'ui.charselect.load_code_btn',
  bMap: 'ui.hud.map_btn',
  bRecall: 'ui.hud.portal_btn',
  bBug: 'ui.hud.report_btn',
  bMenu: 'ui.hud.menu_btn',
  bChars: 'ui.hud.characters_btn',
  bDodge: 'ui.hud.dodge_btn',
  bPot: 'ui.hud.stim_btn',
  bAtk: 'ui.hud.attack_btn',
  mL: 'ui.hud.left_skill',
  mR: 'ui.hud.right_skill',
  scBack: 'ui.scene.back_btn',
  scSkip: 'ui.scene.skip_btn',
  scNext: 'ui.scene.next_btn',
  bRise: 'ui.death.rise_btn',
  discSkip: 'ui.disclaimer.continue'
};
const HTML_HARD = { bAtk: 12, bDodge: 8, bPot: 8, bMap: 12, bRecall: 12, bBug: 14, bMenu: 12, bChars: 16, scBack: 10, scSkip: 10, scNext: 10 };
const HTML_NOTE = {
  bAtk: 'The attack button is a 92px circle.',
  bDodge: 'The dodge button is a 46px circle at 8px type.',
  bPot: 'The stim button is a 52px circle.',
  bMap: 'A top-bar button. The row is narrow on a phone.',
  bRecall: 'A top-bar button. The row is narrow on a phone.',
  bBug: 'A top-bar button. The row is narrow on a phone.',
  bMenu: 'A bottom-left button.',
  bChars: 'A bottom-left button beside Menu.',
  scNext: 'A scene button. Three of them share one row.',
  scSkip: 'A scene button. Three of them share one row.',
  scBack: 'A scene button. Three of them share one row.'
};

const SKIP_BIND = new Set([
  'ART', 'FORMULAS', 'OPT_DEF', 'ROWREQ', 'UNITS', 'REPT', 'ETY', 'RES', 'TC', 'UNIK', 'MKT_BASE', 'MKT_N',
  'ICON', 'MODS', 'SND', 'SNDGAP', 'TRK', 'SKS', 'BANDS', 'TOWN_A', 'TOWN_B', 'PAL', 'STY', 'TX'
]);

const state = {
  file: '', rel: '', src: '', covered: [], ids: new Set(),
  zones: [], memoPush: {}, memoN: 0, seq: 0
};
const entries = [];

function pad(n) { return String(n).padStart(2, '0'); }
function oneLine(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }
function clip(s, n) {
  s = oneLine(s);
  n = n || 78;
  return s.length > n ? s.slice(0, n - 3) + '...' : s;
}
function shown(node) {
  if (!node) return '';
  if (node.kind === 'fn') return shown(node.body);
  if (node.kind === 'alts') return node.items.map(shown).filter(Boolean)[0] || '';
  if (node.kind !== 'str') return '';
  const p = E.present(node);
  return p ? p.text : '';
}
function propv(obj, key) {
  const p = E.prop(obj, key);
  return p ? p.value : null;
}
function num(obj, key) {
  const n = propv(obj, key);
  if (!n) return null;
  const s = String(n.src || '').trim();
  return /^\d+$/.test(s) ? +s : null;
}
function mark(from, to) {
  if (from == null || to == null || to < from) return;
  state.covered.push([from, to]);
}
function isCovered(from, to) {
  for (const [a, b] of state.covered) if (from >= a && to <= b) return true;
  return false;
}
function uniqueId(base) {
  let id = base || 'ui.line';
  let n = 2;
  while (state.ids.has(id)) id = base + '_' + n++;
  state.ids.add(id);
  return id;
}
function zoneBy(i) { return state.zones[i] || null; }

/* Arrow functions with a block body (a skill that computes, then returns a line). */
function emitInside(node, meta) {
  if (node.from == null || node.to == null || !state.src) return;
  const base = node.from;
  const slice = state.src.slice(node.from, node.to);
  let toks;
  try { toks = E.lex(slice); } catch (e) { return; }
  const found = [];
  for (const t of toks) {
    if (t.type !== 'str' && t.type !== 'tmpl') continue;
    const parts = (t.parts || []).map(p => ({
      t: p.t, e: p.e, from: p.from == null ? null : p.from + base, to: p.to == null ? null : p.to + base
    }));
    const fake = {
      kind: 'str',
      from: t.from + base,
      to: t.to + base,
      line: node.line,
      style: t.quote === '`' ? 'template' : t.quote === '"' ? 'double' : 'single',
      parts
    };
    const view = E.present(fake);
    if (!view || !E.isPlayerFacing(view.text) || E.isJunk(view.text)) continue;
    if (!E.looksLikeCopy(view.text) && Array.from(view.text).length < 8) continue;
    found.push(fake);
  }
  if (found.length === 1) emit(found[0], meta);
  else found.forEach((n, i) => emit(n, Object.assign({}, meta, { id: meta.id + '.' + pad(i + 1) })));
  mark(node.from, node.to);
}

/* Which layout shows this wording. Explicit mouse/touch wins. Otherwise a
   line that only talks like a desk is mouse, only like a phone is touch,
   and everything else is both. */
function modeOf(text, explicit) {
  if (explicit === 'mouse' || explicit === 'touch' || explicit === 'both') return explicit;
  const s = String(text || '');
  const mouse = /\bon a desk\b|\bleft click\b|\bright click\b|\bright-click\b|\bF1 through F8\b|\bF1–F8\b|\bF1-F8\b|\bWASD\b|\bpress F1\b/i.test(s);
  const touch = /\bon a phone\b|\bthe stick walks\b|\bthumb button\b|\bTap the\b|\btap the button\b|\bTap to\b|\bDrag it\b/i.test(s);
  if (mouse && touch) return 'both';
  if (mouse) return 'mouse';
  if (touch) return 'touch';
  return 'both';
}
function modeNote(mode) {
  if (mode === 'mouse') return 'Shown in the mouse and keyboard layout.';
  if (mode === 'touch') return 'Shown in the touch layout.';
  return 'Shown in both layouts.';
}

function emit(node, meta) {
  if (!node) return;
  if (node.kind === 'alts') {
    node.items.forEach((n, i) => emit(n, Object.assign({}, meta, {
      id: meta.id + '_b' + pad(i + 1),
      context: (meta.context || '') + ' Branch ' + (i + 1) + ' of ' + node.items.length + '.'
    })));
    return;
  }
  if (node.kind === 'fn') {
    if (node.body) { emit(node.body, meta); return; }
    if (meta.allowBlock || (node.to != null && node.from != null && node.to - node.from < 700)) emitInside(node, meta);
    return;
  }
  if (node.kind === 'arr' && meta.each) {
    node.items.forEach((n, i) => emit(n, Object.assign({}, meta, { id: meta.id + '.' + pad(i + 1), each: false })));
    return;
  }
  if (node.kind !== 'str') return;
  const pieces = node.htmlSplit ? [] : E.htmlPieces(state.src, node.parts || []);
  if (pieces.length) {
    pieces.forEach((p, i) => {
      p.line = node.line;
      emit(p, Object.assign({}, meta, { id: meta.id + '_h' + pad(i + 1) }));
    });
    /* Do not mark the whole string. A hole in the middle can hold another
       line (a label inside a ternary), and the sweep still needs to see it. */
    return;
  }
  const view = E.present(node);
  if (!view || view.from == null || view.to == null) return;
  if (isCovered(view.from, view.to)) return;
  if (view.style === 'ident') {
    if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(view.text)) return;
  } else if (!E.isPlayerFacing(view.text) || E.isJunk(view.text)) return;
  mark(view.from, view.to);
  const hardDesign = meta.hardMax == null ? null : meta.hardMax;
  const len = Array.from(view.text).length;
  const mode = modeOf(view.text, meta.mode);
  entries.push({
    id: uniqueId(meta.id),
    file: state.rel,
    start: view.from,
    end: view.to,
    line: view.line || node.line || 1,
    raw: state.src.slice(view.from, view.to),
    style: view.style,
    text: view.text,
    placeholders: view.placeholders || [],
    hardMax: hardDesign == null ? null : Math.max(hardDesign, len),
    singleLine: !!meta.singleLine,
    limitNote: meta.limitNote || '',
    context: oneLine((meta.context || 'Player-facing text.') + ' ' + modeNote(mode)),
    mode: mode,
    section: meta.section || 'ui',
    groups: (meta.groups && meta.groups.length) ? meta.groups.slice() : ['General'],
    sub: meta.sub || 0,
    seq: state.seq++
  });
}

function linesOf(node) {
  if (!node) return [];
  if (node.kind === 'arr') return node.items;
  if (node.kind === 'alts') return node.items;
  return [node];
}

function emitSeries(items, base, ctx) {
  const texts = items.map(shown);
  items.forEach((n, i) => {
    const prev = i ? clip(texts[i - 1]) : '';
    const next = i < items.length - 1 ? clip(texts[i + 1]) : '';
    let c = ctx.context;
    c += ' Line ' + (i + 1) + ' of ' + items.length + '.';
    if (prev) c += ' Before: "' + prev + '".';
    if (next) c += ' After: "' + next + '".';
    emit(n, Object.assign({}, ctx, { id: base + '.' + pad(i + 1), context: c }));
  });
}

/* ---------- walkers ---------- */
function walkZones(node) {
  const list = node.kind === 'arr' ? node.items : [node];
  for (const z of list) {
    if (!z || z.kind !== 'obj') continue;
    const i = state.zones.length;
    const name = shown(propv(z, 'n')) || ('District ' + i);
    const act = actOfZone(i);
    const rec = { i, name, act, town: !!E.prop(z, 'town'), rank: ZONE_RANK[i] == null ? i : ZONE_RANK[i] };
    state.zones.push(rec);
    const groups = [name];
    const sub = rec.rank * 100;
    const id = act + '.district.' + pad(i);
    emit(propv(z, 'n'), {
      id: id + '.name', section: act, groups, sub,
      hardMax: 40,
      limitNote: 'District name in the top bar. On a phone it ellipsizes past about 28 characters.',
      context: 'The name of ' + name + '. It sits in the top bar and on the transit gate. ' + (rec.town ? 'This is a town: nothing hunts you here.' : 'This is a hunting district.')
    });
    emit(propv(z, 'intro'), {
      id: id + '.intro', section: act, groups, sub: sub + 1,
      limitNote: 'Shown once, when you first enter the district. It can run to a few sentences.',
      context: 'The paragraph the game shows the first time you enter ' + name + '.'
    });
    const su = propv(z, 'su');
    if (su && su.kind === 'obj') {
      emit(propv(su, 'n'), {
        id: id + '.champion', section: act, groups: [name, 'Champion'], sub: sub + 20,
        context: 'The named champion of ' + name + '. The name floats over the machine and is the target of the district quest.'
      });
    }
  }
}

function walkQuests(node) {
  if (!node || node.kind !== 'obj') return;
  for (const p of node.props) {
    const q = p.value;
    if (!q || q.kind !== 'obj') continue;
    let zi = num(q, 'zi');
    const steps0 = propv(q, 'steps');
    if (zi == null && steps0 && steps0.kind === 'arr') {
      for (const st of steps0.items) {
        const z2 = st && st.kind === 'obj' ? num(st, 'zi') : null;
        if (z2 != null) { zi = z2; break; }
      }
    }
    const z = zi == null ? null : zoneBy(zi);
    const act = (z && z.act) || 'act1';
    const place = (z && z.name) || 'an unnamed district';
    const qname = shown(propv(q, 'n')) || p.key;
    const by = shown(propv(q, 'by')) || 'someone in town';
    const groups = [place, qname];
    const sub = ((z && z.rank) || 0) * 100 + 10;
    const id = act + '.quest.' + p.key;
    emit(propv(q, 'n'), {
      id: id + '.name', section: act, groups, sub,
      context: 'Quest title. ' + by + ' gives it. The work is in ' + place + '. The objective is the next line.'
    });
    emit(propv(q, 'd'), {
      id: id + '.objective', section: act, groups, sub: sub + 1,
      context: 'What ' + qname + ' asks you to do. ' + by + ' gives it, and it happens in ' + place + '. The title comes before this; the reward is listed after.'
    });
    emit(propv(q, 'rw'), {
      id: id + '.reward', section: act, groups, sub: sub + 2,
      context: 'The reward for ' + qname + ', shown when you turn it in to ' + (shown(propv(q, 'back')) || by) + '.'
    });
    emit(propv(q, 'offer'), {
      id: id + '.offer', section: act, groups, sub: sub + 3,
      context: by + ' says this when offering ' + qname + ', before you accept.'
    });
    const steps = propv(q, 'steps');
    if (steps && steps.kind === 'arr') {
      steps.items.forEach((st, i) => {
        if (!st || st.kind !== 'obj') return;
        const stepZi = num(st, 'zi');
        const sz = stepZi == null ? null : zoneBy(stepZi);
        const where = (sz && sz.name) || place;
        const sid = id + '.step.' + pad(i + 1);
        const sg = [place, qname, 'Step ' + (i + 1)];
        emit(propv(st, 'label'), {
          id: sid + '.label', section: act, groups: sg, sub: sub + 4,
          hardMax: 28,
          limitNote: 'The button that appears when you stand on the object.',
          context: 'Button for step ' + (i + 1) + ' of ' + qname + ', in ' + where + '.'
        });
        emit(propv(st, 'd'), {
          id: sid + '.objective', section: act, groups: sg, sub: sub + 4,
          context: 'Step ' + (i + 1) + ' of ' + qname + ', tracked on the left of the screen. It happens in ' + where + '.'
        });
        emit(propv(st, 'say'), {
          id: sid + '.line', section: act, groups: sg, sub: sub + 4,
          context: 'The line spoken when step ' + (i + 1) + ' of ' + qname + ' resolves, in ' + where + '.'
        });
        const scene = propv(st, 'scene');
        if (scene) walkSlides(scene, {
          id: sid + '.scene', section: 'cinema', groups: ['Side quests', qname], sub: 40 + i,
          place: qname, who: ''
        });
        const choices = propv(st, 'choices');
        if (choices && choices.kind === 'arr') {
          choices.items.forEach((ch, ci) => {
            if (ch && ch.kind === 'arr' && ch.items[0]) {
              emit(ch.items[0], {
                id: sid + '.choice.' + pad(ci + 1), section: act, groups: sg, sub: sub + 5,
                context: 'A choice after step ' + (i + 1) + ' of ' + qname + '. Choice ' + (ci + 1) + ' of ' + choices.items.length + '.'
              });
            }
          });
        }
      });
    }
  }
}

function homeOf(key) {
  return NPC_HOME[key] || { section: 'act1', zi: 0 };
}
function walkGossip(key, node) {
  const home = homeOf(key);
  const z = zoneBy(home.zi);
  const who = WHO[key] || key;
  const items = linesOf(node).filter(n => n && (n.kind === 'str' || n.kind === 'fn' || n.kind === 'alts'));
  const idx = Math.max(0, NPC_ORDER.indexOf(key));
  emitSeries(items, home.section + '.npc.' + E.slug(key) + '.gossip', {
    section: home.section,
    groups: [(z && z.name) || 'Town', who, 'Gossip'],
    sub: ((z && z.rank) || 0) * 100 + 40 + idx,
    context: who + ' says this in town, unprompted, if you stand near them. It is not a quest.'
  });
}
function walkLocals(node) {
  if (!node || node.kind !== 'obj') return;
  for (const p of node.props) walkGossip(p.key, propv(p.value, 'say') || p.value);
  /* names */
  for (const p of node.props) {
    const home = homeOf(p.key);
    const z = zoneBy(home.zi);
    const who = shown(propv(p.value, 'n')) || WHO[p.key] || p.key;
    emit(propv(p.value, 'n'), {
      id: home.section + '.npc.' + E.slug(p.key) + '.name',
      section: home.section,
      groups: [(z && z.name) || 'Town', who],
      sub: ((z && z.rank) || 0) * 100 + 39,
      context: 'The name over ' + who + ' in ' + ((z && z.name) || 'town') + '.'
    });
  }
}

function walkSlides(node, ctx) {
  const items = node.kind === 'arr' ? node.items : [node];
  const slides = items.filter(s => s && s.kind === 'obj');
  slides.forEach((slide, i) => {
    const text = shown(propv(slide, 'text'));
    const title = shown(propv(slide, 'title'));
    const prev = i ? clip(shown(propv(slides[i - 1], 'text'))) : '';
    const next = i < slides.length - 1 ? clip(shown(propv(slides[i + 1], 'text'))) : '';
    const place = ctx.place || 'a scene';
    if (propv(slide, 'title')) {
      emit(propv(slide, 'title'), {
        id: ctx.id + '.' + pad(i + 1) + '.title',
        section: ctx.section || 'cinema',
        groups: ctx.groups || [place],
        sub: (ctx.sub || 0) + i,
        context: 'Title card in ' + place + ', slide ' + (i + 1) + ' of ' + slides.length + (text ? '. The narration under it is: "' + clip(text) + '".' : '.')
      });
    }
    if (propv(slide, 'text')) {
      let c = 'Narration in ' + place + ', slide ' + (i + 1) + ' of ' + slides.length + '.';
      if (title) c += ' The card is titled "' + title + '".';
      if (prev) c += ' Before: "' + prev + '".';
      if (next) c += ' After: "' + next + '".';
      emit(propv(slide, 'text'), {
        id: ctx.id + '.' + pad(i + 1),
        section: ctx.section || 'cinema',
        groups: ctx.groups || [place],
        sub: (ctx.sub || 0) + i,
        limitNote: 'Full-screen scene text. It scrolls if it runs long. No hard limit.',
        context: c
      });
    }
    if (propv(slide, 'again')) {
      const again = propv(slide, 'again');
      emitSeries(linesOf(again), ctx.id + '.again', {
        section: ctx.section || 'cinema',
        groups: (ctx.groups || [place]).concat(['On a return visit']),
        sub: (ctx.sub || 0) + 5,
        context: 'Said when you enter ' + place + ' again, after the first time.'
      });
    }
  });
}

function walkCls(node) {
  if (!node || node.kind !== 'obj') return;
  let ci = 0;
  for (const p of node.props) {
    const o = p.value;
    if (!o || o.kind !== 'obj' || !E.prop(o, 'sk')) { ci++; continue; }
    const name = shown(propv(o, 'n')) || p.key;
    const groups = [name];
    const sub = ci * 100;
    emit(propv(o, 'n'), {
      id: 'class.' + p.key + '.name', section: 'classes', groups, sub,
      context: 'The ' + name + ' class name, on the title screen and the hero sheet.'
    });
    emit(propv(o, 'tag'), {
      id: 'class.' + p.key + '.blurb', section: 'classes', groups, sub: sub + 1,
      limitNote: 'One or two lines under the class name when you pick a wanderer.',
      context: 'The blurb under ' + name + ' on the character select screen. The name is the line above it.'
    });
    const sk = propv(o, 'sk');
    if (sk && sk.kind === 'arr') {
      sk.items.forEach((skill, i) => {
        if (!skill || skill.kind !== 'obj') return;
        const sn = shown(propv(skill, 'n')) || ('Skill ' + (i + 1));
        const sg = [name, sn];
        const ss = sub + 10 + i;
        emit(propv(skill, 'n'), {
          id: 'class.' + p.key + '.skill.' + pad(i + 1) + '.name',
          section: 'classes', groups: sg, sub: ss,
          context: sn + ', a ' + name + ' skill. Row ' + (Math.floor(i / 3) + 1) + ' of the tree. The button label and the tooltip follow.'
        });
        emit(propv(skill, 'ab'), {
          id: 'class.' + p.key + '.skill.' + pad(i + 1) + '.button',
          section: 'classes', groups: sg, sub: ss,
          hardMax: 24,
          limitNote: 'Painted on a 62px round button at 8px type. A line break splits it into two short lines.',
          context: 'The short label on the skill button for ' + name + '’s ' + sn + '. The full name is on the sheet; this is what the thumb sees.'
        });
        emit(propv(skill, 'd'), {
          id: 'class.' + p.key + '.skill.' + pad(i + 1) + '.desc',
          section: 'classes', groups: sg, sub: ss,
          allowBlock: true,
          limitNote: 'Skill tooltip. Placeholders fill in from the rank. No hard limit.',
          context: 'Tooltip for ' + name + '’s ' + sn + '. Shown on the Skills sheet and when the skill is on a button.'
        });
      });
    }
    ci++;
  }
}

function walkItems(kind, node) {
  if (kind === 'UNI' && node.kind === 'arr') {
    node.items.forEach((u, i) => {
      if (!u || u.kind !== 'obj') return;
      const id = shown(propv(u, 'id')) || ('u' + i);
      const name = shown(propv(u, 'n')) || id;
      emit(propv(u, 'n'), {
        id: 'item.unique.' + E.slug(String(id)) + '.name', section: 'items', groups: ['Uniques', name], sub: 100 + i,
        context: 'Unique item name. It is gold on the ground and in the tooltip.'
      });
      emit(propv(u, 'fl'), {
        id: 'item.unique.' + E.slug(String(id)) + '.flavor', section: 'items', groups: ['Uniques', name], sub: 100 + i,
        limitNote: 'Flavor under the unique’s stats. The tooltip wraps.',
        context: 'Flavor text for the unique ' + name + '. It sits under the numbers.'
      });
    });
    return;
  }
  if ((kind === 'CN1' || kind === 'CN2' || kind === 'CN3' || kind === 'RN1' || kind === 'RN2') && node.kind === 'arr') {
    const label = { CN1: 'Prefix, first word', CN2: 'Prefix, second word', CN3: 'Suffix title', RN1: 'Rare first word', RN2: 'Rare second word' }[kind];
    emitSeries(node.items, 'item.namepart.' + kind.toLowerCase(), {
      section: 'items', groups: ['Generated names', label], sub: 400,
      context: 'A fragment bolted onto a generated item name (' + label + '). It is not a whole sentence.'
    });
    return;
  }
  if (kind === 'ZADJ' && node.kind === 'obj') {
    const props = node.props;
    props.forEach((p, i) => emit(p.value, {
      id: 'item.zone_adj.' + E.slug(p.key),
      section: 'items', groups: ['Generated names', 'District adjectives'], sub: 420,
      context: 'Adjective added to magic items that drop in district index ' + p.key + '.'
    }));
    return;
  }
  if (kind === 'BASE' && node.kind === 'obj') {
    const walk = (arr, slot, trail) => {
      if (!arr || arr.kind !== 'arr') return;
      arr.items.forEach((it, i) => {
        if (!it) return;
        if (it.kind === 'arr') walk(it, slot, trail.concat(i + 1));
        else if (it.kind === 'obj') {
          emit(propv(it, 'n'), {
            id: 'item.base.' + slot + '.' + trail.concat(i + 1).map(pad).join('.'),
            section: 'items', groups: ['Base types', slot], sub: 200 + (trail[0] || i),
            context: 'Base item name, ' + slot + ' family. The white name on a normal item.'
          });
        }
      });
    };
    for (const p of node.props) walk(p.value, p.key, []);
    return;
  }
  if ((kind === 'AFX' || kind === 'AFX2') && node.kind === 'arr') {
    node.items.forEach((a, i) => {
      if (!a || a.kind !== 'obj') return;
      const k = shown(propv(a, 'k')) || ('affix' + i);
      emit(propv(a, 't'), {
        id: 'item.affix.' + E.slug(k) + (kind === 'AFX2' ? '_b' : ''),
        section: 'items', groups: ['Affixes'], sub: 300 + i,
        context: 'Affix line on an item tooltip. {v} is the rolled number. The tier names below are the words in front of the item.'
      });
      const tiers = propv(a, 'tiers');
      if (tiers && tiers.kind === 'arr') {
        tiers.items.forEach((tier, ti) => {
          if (tier && tier.kind === 'arr' && tier.items[0]) {
            emit(tier.items[0], {
              id: 'item.affix.' + E.slug(k) + '.tier.' + pad(ti + 1) + (kind === 'AFX2' ? 'b' : ''),
              section: 'items', groups: ['Affixes', 'Tier names'], sub: 300 + i,
              context: 'Tier name for the affix ' + k + ', tier ' + (ti + 1) + '. It is prefixed or suffixed onto the item name.'
            });
          }
        });
      }
    });
    return;
  }
  if (kind === 'SNAME' && node.kind === 'obj') {
    for (const p of node.props) {
      emit(p.value, {
        id: 'item.slot.' + p.key, section: 'items', groups: ['Slots'], sub: 10,
        context: 'The name of the ' + p.key + ' slot, on the paper doll and in tooltips.'
      });
    }
    return;
  }
  if (kind === 'SETS' && node.kind === 'obj') {
    for (const p of node.props) {
      const o = p.value;
      if (!o || o.kind !== 'obj') continue;
      const name = shown(propv(o, 'n')) || p.key;
      emit(propv(o, 'n'), { id: 'item.set.' + p.key + '.name', section: 'items', groups: ['Sets', name], sub: 350, context: 'Set name for ' + name + '.' });
      emit(propv(o, 'b2'), { id: 'item.set.' + p.key + '.two', section: 'items', groups: ['Sets', name], sub: 350, context: 'Bonus for wearing two pieces of ' + name + '.' });
      emit(propv(o, 'b3'), { id: 'item.set.' + p.key + '.three', section: 'items', groups: ['Sets', name], sub: 350, context: 'Bonus for wearing three pieces of ' + name + '.' });
    }
    return;
  }
  if (kind === 'FAM' && node.kind === 'obj') {
    for (const p of node.props) {
      const o = p.value;
      if (!o || o.kind !== 'obj') continue;
      emit(propv(o, 'n'), { id: 'item.family.' + p.key + '.name', section: 'items', groups: ['Weapon families'], sub: 250, context: 'Weapon family name.' });
      emit(propv(o, 'perk'), { id: 'item.family.' + p.key + '.perk', section: 'items', groups: ['Weapon families'], sub: 250, context: 'The standing perk of the ' + (shown(propv(o, 'n')) || p.key) + ' family.' });
      const bases = propv(o, 'bases');
      if (bases && bases.kind === 'arr') emitSeries(bases.items, 'item.family.' + p.key + '.base', {
        section: 'items', groups: ['Weapon families', shown(propv(o, 'n')) || p.key], sub: 250,
        context: 'A base weapon name in this family.'
      });
    }
    return;
  }
  if (kind === 'PHRASES' && node.kind === 'arr') {
    node.items.forEach((ph, i) => {
      if (!ph || ph.kind !== 'obj') return;
      emit(propv(ph, 'n'), { id: 'item.phrase.' + pad(i + 1) + '.name', section: 'items', groups: ['Phrases'], sub: 500 + i, context: 'A socket phrase name. The twelve words, in order, make this.' });
      emit(propv(ph, 'd'), { id: 'item.phrase.' + pad(i + 1) + '.desc', section: 'items', groups: ['Phrases'], sub: 500 + i, context: 'What the phrase does, shown in the codex and on the item.' });
    });
    return;
  }
  walkGeneric(node, { id: 'item.' + kind.toLowerCase(), section: 'items', groups: [kind], sub: 600, context: 'Item text.' });
}

function walkMercs(node) {
  if (!node || node.kind !== 'obj') return;
  for (const p of node.props) {
    const o = p.value;
    const name = shown(propv(o, 'n')) || p.key;
    emit(propv(o, 'n'), { id: 'merc.' + p.key + '.name', section: 'mercs', groups: [name], sub: 0, context: 'Hireling name on Kestrel’s list.' });
    emit(propv(o, 'd'), { id: 'merc.' + p.key + '.blurb', section: 'mercs', groups: [name], sub: 0, context: 'What Kestrel tells you this hire does, under the name ' + name + '.' });
  }
}

function walkEnemies(node) {
  const list = node.kind === 'obj' ? node.props.map(p => ({ key: p.key, value: p.value })) : [];
  for (const p of list) {
    if (!p.value || p.value.kind !== 'obj') continue;
    const act = MACHINE_ACT[p.key] || 'act1';
    const name = shown(propv(p.value, 'n')) || p.key;
    emit(propv(p.value, 'n'), {
      id: act + '.machine.' + p.key,
      section: act, groups: ['Machines'], sub: 8500,
      context: 'The name of this machine, over its head and in the codex. It shows up in ' + (SECTION_TITLE[act] || act) + '.'
    });
  }
}

function walkMemos(node, section) {
  const pairs = [];
  const take = n => {
    if (!n) return;
    if (n.kind === 'arr' && n.items[0] && (n.items[0].kind === 'str' || n.items[0].kind === 'fn')) pairs.push(n);
    else if (n.kind === 'arr') n.items.forEach(take);
  };
  take(node);
  pairs.forEach((pair, i) => {
    const title = shown(pair.items[0]) || ('Memo ' + (i + 1));
    const groups = section === 'journal' ? ['Memos', title] : ['Papers', title];
    const memoN = pad(++state.memoN);
    emit(pair.items[0], {
      id: section + '.memo.' + memoN + '.title',
      section, groups, sub: section === 'journal' ? 100 + i : 7000 + i,
      context: 'Title of a paper you can pick up and read. The body follows.'
    });
    emit(pair.items[1], {
      id: section + '.memo.' + memoN + '.body',
      section, groups, sub: section === 'journal' ? 100 + i : 7000 + i,
      limitNote: 'A readable memo. It scrolls. No hard limit.',
      context: 'Body of the paper titled "' + clip(title) + '". You read it from the ground or the story list.'
    });
  });
}

function walkStory(node) {
  if (!node || node.kind !== 'arr') return;
  node.items.forEach((ch, ci) => {
    if (!ch || ch.kind !== 'obj') return;
    const cn = shown(propv(ch, 'n')) || ('Chapter ' + (ci + 1));
    emit(propv(ch, 'n'), { id: 'journal.codex.' + pad(ci + 1) + '.title', section: 'journal', groups: ['Codex', cn], sub: 2000 + ci * 20, context: 'Codex chapter title.' });
    emit(propv(ch, 'd'), { id: 'journal.codex.' + pad(ci + 1) + '.intro', section: 'journal', groups: ['Codex', cn], sub: 2000 + ci * 20, context: 'The line under the codex chapter "' + cn + '".' });
    const ent = propv(ch, 'e');
    if (ent && ent.kind === 'arr') {
      ent.items.forEach((e, i) => {
        if (!e || e.kind !== 'obj') return;
        const title = shown(propv(e, 'n')) || ('Entry ' + (i + 1));
        const lock = shown(propv(e, 'l'));
        emit(propv(e, 'n'), {
          id: 'journal.codex.' + pad(ci + 1) + '.' + pad(i + 1) + '.title',
          section: 'journal', groups: ['Codex', cn, title], sub: 2000 + ci * 20 + i,
          context: 'Codex entry title, in "' + cn + '".' + (lock ? ' Until it unlocks, the menu shows: "' + lock + '".' : '')
        });
        emit(propv(e, 'd'), {
          id: 'journal.codex.' + pad(ci + 1) + '.' + pad(i + 1) + '.body',
          section: 'journal', groups: ['Codex', cn, title], sub: 2000 + ci * 20 + i,
          limitNote: 'Codex body. It scrolls. No hard limit.',
          context: 'Codex entry "' + title + '", chapter "' + cn + '". The title is the line above.'
        });
        emit(propv(e, 'l'), {
          id: 'journal.codex.' + pad(ci + 1) + '.' + pad(i + 1) + '.locked',
          section: 'journal', groups: ['Codex', cn, title], sub: 2000 + ci * 20 + i,
          context: 'Shown in place of "' + title + '" until the player has earned it.'
        });
      });
    }
  });
}

function walkConv(node) {
  if (!node || node.kind !== 'arr') return;
  const role = {
    maxi: 'Opening line of a Bitcoiner in the money talk.',
    fud: 'Opening line of a skeptic in the money talk.',
    normie: 'Opening line of an ordinary Resident in the money talk.',
    mid: 'Opening line of someone who has not picked a side.',
    fiat: 'A reply the player can give, taking Unity’s side. It is one of the choices under the opening.',
    btc: 'A reply the player can give, taking the bitcoiner side. It is one of the choices under the opening.',
    ask: 'A reply the player can give: a question. If the speaker knows, the lesson follows; if not, the shrug follows.',
    teach: 'The lesson, spoken if the player asked and the speaker knows. It comes after the question.',
    dunno: 'The shrug, spoken if the player asked and the speaker does not know.'
  };
  node.items.forEach((topic, ti) => {
    if (!topic || topic.kind !== 'obj') return;
    for (const p of topic.props) {
      emit(p.value, {
        id: 'act1.money.topic.' + pad(ti + 1) + '.' + p.key,
        section: 'act1',
        groups: ['Stillwater Commons', 'Money', 'Topic ' + (ti + 1)],
        sub: 50 + ti,
        context: role[p.key] || 'A line in the money conversation.' + ' Topic ' + (ti + 1) + ' of ' + node.items.length + ', any town, after you choose Talk about money.'
      });
    }
  });
}

function walkReact(node) {
  if (!node || node.kind !== 'obj') return;
  for (const g of node.props) {
    if (!g.value || g.value.kind !== 'obj') continue;
    for (const r of g.value.props) {
      if (!r.value) continue;
      const items = linesOf(r.value);
      emitSeries(items, 'act1.money.react.' + g.key + '.' + r.key, {
        section: 'act1',
        groups: ['Stillwater Commons', 'Money', 'Replies'],
        sub: 70,
        context: (WHO[g.key] || g.key) + ' answers a ' + r.key + ' reply. This comes after the player has spoken, before the dialog closes.'
      });
    }
  }
}

const CINE = {
  INTRO: ['Act I opening', 0],
  INTRO2: ['Act II opening', 10],
  INTRO3: ['Act III opening', 20],
  INTRO4: ['Act IV opening', 30],
  INTRO5: ['Act V opening', 40],
  RESCUE: ['Marrow, the cage', 5],
  ENDING2: ['End of Act II', 15],
  ENDING3: ['End of Act III', 25],
  ENDING4: ['End of Act IV', 35],
  ENDING5: ['End of Act V', 45],
  END_LEAVE: ['Ending: leave the difficulty', 50],
  END_WAKE: ['Ending: ask her back', 51],
  END_DOUBT: ['Ending: the seventh part', 52],
  RESERVE: ['Fate: the reserve', 60],
  STALE: ['Fate: the stalemate', 61],
  FAIL: ['Fate: the failure', 62]
};

function harvest(name, node, file) {
  if (!node) return;
  if (SKIP_BIND.has(name)) {
    if (node.from != null) mark(node.from, node.to);
    return;
  }
  if (name === 'ZONES') return walkZones(node);
  if (name === 'QUESTS') return walkQuests(node);
  if (name === 'SQ') return walkQuests(node);
  if (name === 'CLS') return walkCls(node);
  if (name === 'ET') return walkEnemies(node);
  if (name === 'MERCS') return walkMercs(node);
  if (name === 'MNAMES') return emitSeries(linesOf(node), 'merc.given_name', {
    section: 'mercs', groups: ['Given names'], sub: 20,
    context: 'A name Kestrel may give the hireling. One of these is picked when you hire.'
  });
  if (name === 'UNI' || name === 'BASE' || name === 'AFX' || name === 'AFX2' || name === 'SETS' || name === 'SNAME' || name === 'FAM' || name === 'PHRASES' || name === 'CN1' || name === 'CN2' || name === 'CN3' || name === 'RN1' || name === 'RN2' || name === 'ZADJ') {
    return walkItems(name, node);
  }
  if (name === 'MEMOS') {
    let section = 'act1';
    if (file === 'p10.js') section = 'bull';
    else if (file === 'p11.js') section = 'journal';
    else if (file === 'p1.js') {
      const n = state.memoPush.p1 || 0;
      state.memoPush.p1 = n + 1;
      section = n === 0 ? 'act1' : n === 1 ? 'act2' : n === 2 ? 'act3' : 'journal';
    }
    return walkMemos(node, section);
  }
  if (name === 'GOSSIP') {
    if (node.kind === 'obj') node.props.forEach(p => walkGossip(p.key, p.value));
    return;
  }
  if (name === 'LOCALS') return walkLocals(node);
  if (name === 'CHATTER') return emitSeries(linesOf(node), 'act1.stillwater.chatter', {
    section: 'act1', groups: ['Stillwater Commons', 'In the square'], sub: 80,
    context: 'A Resident says this in passing, in town. It is not addressed to you by name.'
  });
  if (name === 'BOSSBARK') return emitSeries(linesOf(node), 'act1.district.05.pryce.bark', {
    section: 'act1', groups: ['The Glass Cathedral', 'Pryce'], sub: 5 * 100 + 22,
    context: 'Pryce shouts this during the Act I boss fight, as a toast over the fight.'
  });
  if (name === 'BOSSBARK2') return emitSeries(linesOf(node), 'act2.district.11.vale.bark', {
    section: 'act2', groups: ['The Mezzanine', 'Vale'], sub: 5 * 100 + 22,
    context: 'Vale says this during the Act II boss fight, as a toast.'
  });
  if (name === 'CONV') return walkConv(node);
  if (name === 'GREET') {
    if (node.kind === 'obj') {
      for (const p of node.props) {
        emitSeries(linesOf(p.value), 'act1.money.greet.' + p.key, {
          section: 'act1', groups: ['Stillwater Commons', 'Money', 'Greetings'], sub: 48,
          context: (WHO[p.key] || p.key) + ' opens the money talk with this, before the topic. Which line plays depends on how orange the player already is.'
        });
      }
    }
    return;
  }
  if (name === 'REACT') return walkReact(node);
  if (name === 'TOX') return emitSeries(linesOf(node), 'act1.money.toxic', {
    section: 'act1', groups: ['Stillwater Commons', 'Money', 'The cruel reply'], sub: 72,
    context: 'The player can say this instead of a real answer. It comes after the opening line. People nearby hear it.'
  });
  if (name === 'COINS') return emitSeries(linesOf(node), 'act1.shitcoin.name', {
    section: 'act1', groups: ['Shitcoiners'], sub: 8600,
    context: 'The name of a coin a shitcoiner is hawking. It is shouted in the pitch.'
  });
  if (name === 'SHILLQ') return emitSeries(linesOf(node), 'act1.shitcoin.pitch', {
    section: 'act1', groups: ['Shitcoiners'], sub: 8601,
    context: 'Part of a shitcoiner’s pitch, spoken when one jogs up to you in a district. One of these is picked at random.'
  });
  if (name === 'STORYDEX') return walkStory(node);
  if (name === 'CAMPS') {
    if (node.kind === 'obj') {
      for (const p of node.props) {
        const actn = num(p.value, 'act');
        const section = actn === 2 ? 'act2' : actn === 3 ? 'act3' : 'act1';
        const title = shown(propv(p.value, 'n')) || p.key;
        emit(propv(p.value, 'n'), { id: section + '.campaign.' + p.key + '.name', section, groups: ['Unity campaigns', title], sub: 7800, context: 'Name of a Unity campaign announced in town.' });
        emit(propv(p.value, 'd'), { id: section + '.campaign.' + p.key + '.desc', section, groups: ['Unity campaigns', title], sub: 7800, context: 'What the campaign "' + title + '" asks, shown when it opens.' });
      }
    }
    return;
  }
  if (name === 'PRE_INTRO' || name === 'PRE_END' || name === 'CLOCK3') {
    const place = name === 'CLOCK3' ? 'End of Act III' : name === 'PRE_END' ? 'Prequel, leaving' : 'Prequel opening';
    return walkSlides(node, { id: 'cine.' + name.toLowerCase(), section: 'cinema', groups: [place], sub: name === 'CLOCK3' ? 28 : 8, place });
  }
  if (name === 'PRE_ST') return walkPre(node);
  if (name === 'ISK') return walkIsk(node);
  if (name === 'CHN') return emitSeries(linesOf(node), 'item.charm.channel', {
    section: 'items', groups: ['Charms', 'Lapsed channels'], sub: 560,
    context: 'One word in a charm name: Lapsed {this} Subscription. It is picked at random when the charm drops.'
  });
  if (name === 'SUBM') return walkPairs(node, 'sub.rule.', 'sub', ['Rules'], 'A rule printed when a sealed district is served. It changes how the district fights.');
  if (name === 'WORDS' && node.kind === 'obj') {
    node.props.forEach((p, i) => {
      if (p.keyFrom == null || p.keyQuoted) return;
      emit({
        kind: 'str', style: 'ident', from: p.keyFrom, to: p.keyTo, line: p.line,
        parts: [{ t: p.key, from: p.keyFrom, to: p.keyTo }]
      }, {
        id: 'item.word.' + E.slug(p.key),
        section: 'items', groups: ['Seed words'], sub: 480 + i,
        singleLine: true,
        limitNote: 'One word. Letters, digits, and underscores. It is the word on the torn note and on the socket button.',
        context: 'A seed word. Socketed into a weapon, helm, or armor. The twelve words, in order, make a phrase. Nonce knows the list.'
      });
    });
    if (node.from != null) mark(node.from, node.to);
    return;
  }
  if (name === 'AFK' && node.kind === 'obj') {
    for (const p of node.props) {
      const o = p.value;
      if (!o || o.kind !== 'obj') continue;
      emit(propv(o, 't'), {
        id: 'item.affix.' + E.slug(p.key),
        section: 'items', groups: ['Affixes'], sub: 340,
        context: 'Affix line on an item tooltip. {v} is the rolled number.'
      });
    }
    if (node.from != null) mark(node.from, node.to);
    return;
  }
  if (name === 'QN') return emitSeries(linesOf(node), 'item.quality', {
    section: 'items', groups: ['Quality'], sub: 5,
    context: 'The quality word on an item: white, blue, yellow, green, or gold.'
  });
  if (CINE[name]) {
    const [place, sub] = CINE[name];
    return walkSlides(node, { id: 'cine.' + name.toLowerCase(), section: 'cinema', groups: [place], sub, place });
  }
  if (name === 'BINTRO') {
    if (node.kind === 'obj') {
      for (const p of node.props) {
        const o = p.value;
        if (!o || o.kind !== 'obj') continue;
        const place = p.key;
        const section = place === 'gap' ? 'pre' : place === 'boss4' ? 'cinema' : place === 'boss5' ? 'cinema' : 'cinema';
        walkSlides(propv(o, 'first') || o, { id: 'cine.boss.' + place, section, groups: ['Boss entrance', place], sub: 80, place: place + ', the first time you enter' });
        const again = propv(o, 'again');
        if (again) emitSeries(linesOf(again), 'cine.boss.' + place + '.again', {
          section, groups: ['Boss entrance', place], sub: 81,
          context: 'Boss entrance line when you come back to ' + place + '.'
        });
      }
    }
    return;
  }
  if (name === 'LTAUNT') {
    if (node.kind === 'obj') {
      for (const p of node.props) {
        emit(p.value, {
          id: 'cine.taunt.' + p.key, section: 'cinema', groups: ['Champion taunts'], sub: 90,
          context: 'The champion of quest ' + p.key + ' says this when the fight starts.'
        });
      }
    }
    return;
  }
  if (name === 'WALK') return walkWalk(node);
  if (name === 'PRE_ST') return walkSlides(node, { id: 'prequel.story', section: 'pre', groups: ['The cage', 'Story'], sub: 20, place: 'the prequel' });
  if (name === 'QRW') return walkQrw(node);
  if (name === 'SHR') return walkShr(node);
  if (name === 'OPT_LBL') return walkPairs(node, 'ui.options.', 'ui', ['Options'], 'A checkbox on the Options sheet.');
  if (name === 'TABS') return walkPairs(node, 'ui.tab.', 'ui', ['Menu tabs'], 'A tab on the menu.');
  if (name === 'ATTR') return walkAttr(node);
  if (name === 'DIFFS') return walkDiffs(node);
  if (name === 'DIFFSET' || name === 'DIFFUP' || name === 'DIFFDN') {
    return emitSeries(linesOf(node), 'ui.difficulty.' + name.toLowerCase(), {
      section: 'ui', groups: ['Difficulty'], sub: 30,
      context: 'A toast when difficulty changes (' + name + '). One of these is picked.'
    });
  }
  if (name === 'REP') return walkRep(node);
  if (name === 'EVS') return walkSimpleObjs(node, 'ui.event.', 'ui', ['District events'], 40);
  if (name === 'ACH') return walkAch(node);
  if (name === 'FORKS') return walkSimpleObjs(node, 'class.fork.', 'classes', ['Skill forks'], 9000);
  if (name === 'DOCS') return walkDocs(node);
  if (name === 'BUILDS') return walkBuilds(node);
  if (name === 'DTY') return walkSimpleObjs(node, 'ui.damage.', 'ui', ['Damage types'], 50);
  if (name === 'SEAS') return walkSeasons(node);
  if (name === 'PERS') return walkPers(node);
  if (name === 'DROWS') return walkDrows(node);
  if (name === 'ROWB') return walkRowb(node);
  if (name === 'WARMS') return walkWarms(node);
  if (name === 'DOCT' || name === 'WEBT') return walkPairs(node, 'ui.stat.' + name.toLowerCase() + '.', 'ui', ['Stat lines'], 'A stat format. {v} is the number.');
  /* generic top-level data: keep player-facing strings rather than drop them */
  if (node.kind === 'fn' || node.kind === 'skip') return;
  const section = file === 'p13.js' ? 'mp' : 'ui';
  walkGeneric(node, {
    id: (section === 'mp' ? 'mp.' : 'ui.') + E.slug(name),
    section, groups: [name], sub: 5000,
    context: 'Player-facing text from ' + name + ' in ' + file + '.'
  });
}

function walkPre(node) {
  if (!node || node.kind !== 'arr') return;
  node.items.forEach((s, i) => {
    if (!s || s.kind !== 'obj') return;
    const nm = shown(propv(s, 'n')) || ('Stop ' + (i + 1));
    emit(propv(s, 'n'), {
      id: 'pre.stop.' + pad(i + 1) + '.name', section: 'pre', groups: ['The cage', nm], sub: 10 + i,
      context: 'The name of stop ' + (i + 1) + ' in the 2015 week. It floats over the spot.'
    });
    emit(propv(s, 'act'), {
      id: 'pre.stop.' + pad(i + 1) + '.prompt', section: 'pre', groups: ['The cage', nm], sub: 10 + i,
      context: 'The prompt under ' + nm + ', telling you what to do when you reach the spot.'
    });
    const sl = propv(s, 'sl');
    if (sl) walkSlides(sl, { id: 'pre.stop.' + pad(i + 1) + '.scene', section: 'pre', groups: ['The cage', nm], sub: 10 + i, place: nm });
  });
}

function walkIsk(node) {
  if (!node || node.kind !== 'obj') return;
  let i = 0;
  for (const p of node.props) {
    const o = p.value;
    if (!o || o.kind !== 'obj') continue;
    const name = shown(propv(o, 'n')) || p.key;
    const g = ['Item skills', name];
    emit(propv(o, 'n'), { id: 'item.skill.' + p.key + '.name', section: 'items', groups: g, sub: 700 + i, context: 'Name of an item skill, granted by a unique. It is not on a class tree.' });
    emit(propv(o, 'ab'), {
      id: 'item.skill.' + p.key + '.button', section: 'items', groups: g, sub: 700 + i,
      hardMax: 24, limitNote: 'Painted on a 62px round button at 8px type.',
      context: 'Short label on the button for the item skill ' + name + '.'
    });
    emit(propv(o, 'tip'), {
      id: 'item.skill.' + p.key + '.tip', section: 'items', groups: g, sub: 700 + i,
      limitNote: 'Tooltip. It wraps. No hard limit.',
      context: 'Tooltip for the item skill ' + name + '.'
    });
    i++;
  }
}

function walkWalk(node) {
  if (!node || node.kind !== 'obj') return;
  for (const part of node.props) {
    const arr = part.value;
    if (!arr || arr.kind !== 'arr') continue;
    const label = part.key === 'basics' ? 'Basics' : 'Further in';
    arr.items.forEach((slide, i) => {
      if (!slide || slide.kind !== 'obj') return;
      const title = shown(propv(slide, 'title')) || ('Page ' + (i + 1));
      emit(propv(slide, 'title'), {
        id: 'tutorial.' + part.key + '.' + pad(i + 1) + '.title',
        section: 'tutorial', groups: [label, title], sub: (part.key === 'basics' ? 0 : 50) + i,
        context: 'Walkthrough heading, ' + label.toLowerCase() + ', page ' + (i + 1) + '.'
      });
      const bodyMeta = {
        section: 'tutorial', groups: [label, title], sub: (part.key === 'basics' ? 0 : 50) + i,
        limitNote: 'Walkthrough page. It scrolls. No hard limit.'
      };
      const mouse = propv(slide, 'mouse');
      const touch = propv(slide, 'touch');
      const text = propv(slide, 'text');
      const place = 'Walkthrough page "' + title + '". The heading is the line above. Next and Back move between pages.';
      if (mouse) emit(mouse, Object.assign({}, bodyMeta, {
        id: 'tutorial.' + part.key + '.' + pad(i + 1) + '.body.mouse',
        mode: 'mouse',
        context: place + ' This wording is the desk page.'
      }));
      if (touch) emit(touch, Object.assign({}, bodyMeta, {
        id: 'tutorial.' + part.key + '.' + pad(i + 1) + '.body.touch',
        mode: 'touch',
        context: place + ' This wording is the phone page.'
      }));
      if (text && !mouse && !touch) emit(text, Object.assign({}, bodyMeta, {
        id: 'tutorial.' + part.key + '.' + pad(i + 1) + '.body',
        mode: 'both',
        context: place
      }));
    });
  }
}

function walkQrw(node) {
  if (!node || node.kind !== 'arr') return;
  node.items.forEach((row, i) => {
    if (!row || row.kind !== 'arr') return;
    const who = shown(row.items[4]) || shown(row.items[1]) || 'someone';
    emit(row.items[2], {
      id: 'act3.turnin.' + pad(i + 1),
      section: 'act3', groups: ['Turning a quest in'], sub: 6000 + i,
      context: who + ' says this when you turn a quest in. The reward is stated in the same line.'
    });
  });
}

function walkShr(node) {
  if (!node || node.kind !== 'obj') return;
  for (const p of node.props) {
    const a = p.value;
    if (!a || a.kind !== 'arr') continue;
    emit(a.items[0], { id: 'ui.shrine.' + p.key + '.name', section: 'ui', groups: ['Shrines'], sub: 80, context: 'Name of a shrine when you step on it. Shown as a toast.' });
    emit(a.items[1], { id: 'ui.shrine.' + p.key + '.effect', section: 'ui', groups: ['Shrines'], sub: 80, context: 'What the ' + p.key + ' shrine does, in the same toast as its name.' });
  }
}

function walkPairs(node, idBase, section, groups, context) {
  if (!node || node.kind !== 'obj') return;
  let i = 0;
  for (const p of node.props) {
    emit(p.value, { id: idBase + p.key, section, groups, sub: i++, context: context + ' Key: ' + p.key + '.' });
  }
}

function walkAttr(node) {
  if (!node || node.kind !== 'obj') return;
  for (const p of node.props) {
    const a = p.value;
    if (!a || a.kind !== 'arr') continue;
    emit(a.items[0], { id: 'ui.attr.' + p.key + '.name', section: 'ui', groups: ['Attributes'], sub: 20, context: 'Attribute name on the hero sheet.' });
    emit(a.items[1], { id: 'ui.attr.' + p.key + '.desc', section: 'ui', groups: ['Attributes'], sub: 20, context: 'What one point of ' + (shown(a.items[0]) || p.key) + ' does, under the name.' });
  }
}

function walkDiffs(node) {
  if (!node || node.kind !== 'arr') return;
  node.items.forEach((d, i) => {
    if (!d || d.kind !== 'obj') return;
    emit(propv(d, 'n'), {
      id: 'ui.difficulty.' + pad(i + 1),
      section: 'ui', groups: ['Difficulty'], sub: 28,
      context: 'Difficulty name on the Options sheet. Position ' + (i + 1) + '.'
    });
  });
}

function walkRep(node) {
  if (!node || node.kind !== 'obj') return;
  for (const p of node.props) {
    const o = p.value;
    if (!o || o.kind !== 'obj') continue;
    const name = shown(propv(o, 'n')) || p.key;
    emit(propv(o, 'n'), { id: 'ui.rep.' + p.key + '.name', section: 'ui', groups: ['Reputation', name], sub: 60, context: 'Reputation track name.' });
    emit(propv(o, 'how'), { id: 'ui.rep.' + p.key + '.how', section: 'ui', groups: ['Reputation', name], sub: 60, context: 'How you earn ' + name + ' reputation, under the track.' });
    const ranks = propv(o, 'ranks');
    if (ranks) emitSeries(linesOf(ranks), 'ui.rep.' + p.key + '.rank', { section: 'ui', groups: ['Reputation', name], sub: 60, context: 'A rank name on the ' + name + ' track.' });
    const perks = propv(o, 'perks');
    if (perks) emitSeries(linesOf(perks), 'ui.rep.' + p.key + '.perk', { section: 'ui', groups: ['Reputation', name], sub: 60, context: 'The perk at this rank of ' + name + '.' });
  }
}

function walkSimpleObjs(node, idBase, section, groups, sub) {
  if (!node || node.kind !== 'obj') return;
  for (const p of node.props) {
    const o = p.value;
    if (!o || o.kind !== 'obj') continue;
    emit(propv(o, 'n'), { id: idBase + p.key + '.name', section, groups, sub, context: 'Name.' });
    emit(propv(o, 'd'), { id: idBase + p.key + '.desc', section, groups, sub, context: 'Description under the name.' });
  }
}

function walkAch(node) {
  if (!node || node.kind !== 'arr') return;
  node.items.forEach((a, i) => {
    if (!a || a.kind !== 'arr') return;
    emit(a.items[1], { id: 'ui.feat.' + pad(i + 1) + '.name', section: 'ui', groups: ['Feats'], sub: 90, context: 'Feat name.' });
    emit(a.items[2], { id: 'ui.feat.' + pad(i + 1) + '.desc', section: 'ui', groups: ['Feats'], sub: 90, context: 'How you earn the feat named just above.' });
  });
}

function walkDocs(node) {
  if (!node || node.kind !== 'obj') return;
  for (const p of node.props) {
    const o = p.value;
    if (!o || o.kind !== 'obj') continue;
    const name = shown(propv(o, 'n')) || p.key;
    emit(propv(o, 'n'), { id: 'class.doctrine.' + p.key + '.name', section: 'classes', groups: ['Doctrines', name], sub: 9500, context: 'Doctrine name on the Skills sheet.' });
    emit(propv(o, 'd'), { id: 'class.doctrine.' + p.key + '.desc', section: 'classes', groups: ['Doctrines', name], sub: 9500, context: 'What the ' + name + ' doctrine does.' });
  }
}

function walkBuilds(node) {
  if (!node || node.kind !== 'obj') return;
  let i = 0;
  for (const cls of node.props) {
    const arr = cls.value;
    if (!arr || arr.kind !== 'arr') continue;
    arr.items.forEach((b, bi) => {
      if (!b || b.kind !== 'obj') return;
      const name = shown(propv(b, 'n')) || ('Build ' + (bi + 1));
      emit(propv(b, 'n'), { id: 'class.' + cls.key + '.build.' + pad(bi + 1) + '.name', section: 'classes', groups: ['Builds', name], sub: 9700 + i, context: 'A suggested build name for ' + cls.key + '.' });
      emit(propv(b, 'p'), { id: 'class.' + cls.key + '.build.' + pad(bi + 1) + '.blurb', section: 'classes', groups: ['Builds', name], sub: 9700 + i, context: 'The one-line pitch of the build "' + name + '".' });
    });
    i++;
  }
}

function walkSeasons(node) {
  if (!node || node.kind !== 'arr') return;
  node.items.forEach((s, i) => {
    if (!s || s.kind !== 'obj') return;
    emit(propv(s, 'n'), { id: 'ui.season.' + pad(i + 1) + '.name', section: 'ui', groups: ['Seasons'], sub: 100, context: 'Name of a rotating season.' });
    emit(propv(s, 'd'), { id: 'ui.season.' + pad(i + 1) + '.desc', section: 'ui', groups: ['Seasons'], sub: 100, context: 'What this season changes, under the name.' });
  });
}

function walkPers(node) {
  if (!node || node.kind !== 'obj') return;
  for (const p of node.props) {
    emit(propv(p.value, 'n'), {
      id: 'act1.npc.' + E.slug(p.key) + '.nameplate',
      section: (NPC_HOME[p.key] || { section: 'act1' }).section,
      groups: ['Names'], sub: 30,
      context: 'Nameplate for ' + (WHO[p.key] || p.key) + ', used on dialogs.'
    });
  }
}

function walkDrows(node) {
  if (!node || node.kind !== 'arr') return;
  node.items.forEach((r, i) => {
    if (!r || r.kind !== 'arr') return;
    emit(r.items[0], { id: 'ui.sheet.stat.' + pad(i + 1), section: 'ui', groups: ['Hero sheet'], sub: 15, context: 'A row label on the hero sheet.' });
  });
}

function walkRowb(node) {
  if (!node || node.kind !== 'arr') return;
  node.items.forEach((r, i) => {
    if (!r || r.kind !== 'arr') return;
    emit(r.items[0], { id: 'ui.web.row.' + pad(i + 1) + '.name', section: 'ui', groups: ['Passive web'], sub: 16, context: 'A row of the passive web.' });
    emit(r.items[1], { id: 'ui.web.row.' + pad(i + 1) + '.effect', section: 'ui', groups: ['Passive web'], sub: 16, context: 'What that web row gives. {v} is not used; the numbers are written out.' });
  });
}

function walkWarms(node) {
  if (!node || node.kind !== 'arr') return;
  node.items.forEach((r, i) => {
    if (!r || r.kind !== 'arr') return;
    emit(r.items[0], { id: 'ui.charm.' + pad(i + 1) + '.stat', section: 'items', groups: ['Charms'], sub: 550, context: 'A charm’s stat name.' });
    emit(r.items[4], { id: 'ui.charm.' + pad(i + 1) + '.name', section: 'items', groups: ['Charms'], sub: 550, context: 'A charm’s title.' });
  });
}

function walkGeneric(node, ctx, depth) {
  depth = depth || 0;
  if (!node || depth > 8) return;
  if (node.kind === 'str' || node.kind === 'fn' || node.kind === 'alts') {
    emit(node, ctx);
    return;
  }
  if (node.kind === 'arr') {
    node.items.forEach((n, i) => walkGeneric(n, Object.assign({}, ctx, { id: ctx.id + '.' + pad(i + 1) }), depth + 1));
    return;
  }
  if (node.kind === 'obj') {
    for (const p of node.props) {
      if (p.value && (p.value.kind === 'str' || p.value.kind === 'fn' || p.value.kind === 'alts')) {
        if (!E.COPY_KEYS.has(p.key) && p.key !== 't' && p.key !== 'ranks' && p.key !== 'perks' && p.key !== 'bases') {
          const preview = shown(p.value);
          if (!preview || !E.looksLikeCopy(preview) || E.isJunk(preview)) continue;
          if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(preview)) continue;
        }
      }
      const childMode = p.key === 'mouse' ? 'mouse' : p.key === 'touch' ? 'touch' : (ctx.mode || null);
      walkGeneric(p.value, Object.assign({}, ctx, { id: ctx.id + '.' + E.slug(p.key), mode: childMode }), depth + 1);
    }
  }
}

/* ---------- scan a JS file ---------- */
function depthsOf(toks) {
  const d = new Array(toks.length);
  let depth = 0;
  for (let i = 0; i < toks.length; i++) {
    d[i] = depth;
    if (toks[i].type !== 'punct') continue;
    const v = toks[i].value;
    if (v === '{' || v === '(' || v === '[') depth++;
    else if (v === '}' || v === ')' || v === ']') depth--;
  }
  return d;
}

function enclosingFn(toks) {
  const names = new Array(toks.length).fill('');
  const stack = [{ name: '', depth: 0 }];
  let depth = 0;
  let pending = null;
  const kw = new Set(['if', 'for', 'while', 'switch', 'catch', 'function', 'return', 'else']);
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    if (t.value === 'function' && toks[i + 1] && toks[i + 1].type === 'ident') pending = toks[i + 1].value;
    else if (t.type === 'ident' && !kw.has(t.value) && toks[i + 1] && toks[i + 1].value === '(') {
      const close = E.matchClose(toks, i + 1, '(', ')', toks.length);
      if (toks[close + 1] && toks[close + 1].value === '{') pending = t.value;
    }
    if (t.type === 'punct' && t.value === '{') {
      depth++;
      if (pending) { stack.push({ name: pending, depth }); pending = null; }
    } else if (t.type === 'punct' && t.value === '}') {
      while (stack.length > 1 && stack[stack.length - 1].depth === depth) stack.pop();
      depth--;
      pending = null;
    }
    names[i] = stack[stack.length - 1].name;
  }
  return names;
}

function splitArgs(toks, i) {
  const args = [];
  let start = i, j = i, stack = [];
  while (j < toks.length) {
    const v = toks[j].value;
    if (toks[j].type === 'punct' && (v === '(' || v === '[' || v === '{')) stack.push(v);
    else if (toks[j].type === 'punct' && (v === ')' || v === ']' || v === '}')) {
      const open = v === ')' ? '(' : v === ']' ? '[' : '{';
      if (!stack.length) {
        if (v === ')' && j > start) args.push([start, j]);
        break;
      }
      if (stack[stack.length - 1] === open) stack.pop();
      else break;
    } else if (toks[j].type === 'punct' && v === ',' && !stack.length) {
      if (j > start) args.push([start, j]);
      start = j + 1;
    }
    j++;
  }
  return args;
}

function parseSpan(toks, a, b) {
  if (!a || a >= b) return null;
  return E.readTernary(toks, a[0], a[1]);
}

function sectionFor(fn) {
  if (FN_SECTION[fn]) return FN_SECTION[fn];
  if (/^boss|^ending|^finalChoice|^actDone|^fate|^ltIntro|^bossIntro/.test(fn || '')) return 'cinema';
  if (/^pre/.test(fn || '')) return 'pre';
  if (/^shill/.test(fn || '')) return 'act1';
  if (/^bull/.test(fn || '')) return 'bull';
  if (/^bug/.test(fn || '')) return 'ui';
  if (state.rel.indexOf('server/') === 0 || state.rel.indexOf('lan/') === 0 || state.file === 'p13.js') return 'mp';
  return 'ui';
}

const FN_SECTION = {
  finalChoice: 'cinema', actDone: 'cinema', endingSlides: 'cinema', fateScene: 'cinema',
  bugAsk: 'ui', bugForm: 'ui', bugSend: 'ui',
  shillTalk: 'act1', shillLeave: 'act1', shillTurn: 'act1', bullKill: 'bull', bullStart: 'bull',
  walkOffer: 'tutorial'
};

let callSeq = 0;
function scanCalls(toks, fnAt) {
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    if (t.type !== 'ident' || !toks[i + 1] || toks[i + 1].value !== '(') continue;
    if (toks[i - 1] && toks[i - 1].value === 'function') continue;
    const name = t.value;
    if (!E.UI_CALLS.has(name)) continue;
    const args = splitArgs(toks, i + 2);
    const fn = fnAt[i] || name;
    const section = sectionFor(fn);
    const n = ++callSeq;
    const base = (section === 'cinema' ? 'cine' : section === 'tutorial' ? 'tutorial' : section === 'mp' ? 'mp' : 'ui') + '.' + E.slug(fn || name) + '.' + pad(n);
    if (name === 'toast' || name === 'sys') {
      emit(parseSpan(toks, args[0]), {
        id: base, section, groups: section === 'mp' ? ['Messages'] : ['Toasts'], sub: 4000,
        limitNote: 'A toast in the corner log, about 156 pixels wide. It wraps and fades after a few seconds.',
        context: 'Toast from ' + (fn || name) + '. It appears in the corner and fades.'
      });
    } else if (name === 'fail') {
      emit(parseSpan(toks, args[1]), {
        id: base, section: 'mp', groups: ['Server'], sub: 20,
        context: 'The server says this to the player when ' + (fn || 'a request') + ' refuses.'
      });
    } else if (name === 'float') {
      emit(parseSpan(toks, args[2]), {
        id: base, section, groups: ['Floating text'], sub: 4100,
        context: 'Floating combat text from ' + (fn || 'combat') + '.'
      });
    } else if (name === 'fillText') {
      const node = parseSpan(toks, args[0]);
      if (node && (node.kind === 'str' || node.kind === 'alts')) {
        emit(node, { id: base, section, groups: ['On the canvas'], sub: 4200, context: 'Text drawn on the scene canvas from ' + (fn || 'the scene') + '.' });
      }
    } else if (name === 'bubble') {
      emit(parseSpan(toks, args[2]), {
        id: base, section, groups: ['Speech bubbles'], sub: 4300,
        context: 'A speech bubble over a creature, from ' + fn + '.'
      });
    } else if (name === 'dlg') {
      const title = parseSpan(toks, args[0]);
      const body = parseSpan(toks, args[1]);
      const btns = parseSpan(toks, args[2]);
      const titleText = clip(shown(title));
      const groups = section === 'mp' ? ['Dialogs'] : section === 'cinema' ? ['Dialogs'] : ['Dialogs'];
      emit(title, {
        id: base + '.title', section, groups, sub: 3000,
        context: 'Dialog title, opened from ' + (fn || 'the game') + '. The body is the next entry.'
      });
      emit(body, {
        id: base + '.body', section, groups, sub: 3000,
        limitNote: 'Dialog body, about 440 pixels wide. It scrolls. No hard limit.',
        context: 'Dialog body under the title "' + titleText + '", from ' + (fn || 'the game') + '. Buttons come after the body.'
      });
      walkButtons(btns, {
        id: base + '.btn', section, groups, sub: 3000,
        context: 'A button on the dialog "' + titleText + '".'
      });
    }
  }
}

function walkButtons(node, meta) {
  if (!node) return;
  if (node.kind === 'alts') { node.items.forEach(n => walkButtons(n, meta)); return; }
  if (node.kind === 'fn') return;
  if (node.kind === 'str') { emit(node, meta); return; }
  if (node.kind !== 'arr') return;
  const first = node.items[0];
  const second = node.items[1];
  if (first && first.kind !== 'arr' && (!second || second.kind !== 'arr')) {
    emit(first, meta);
    return;
  }
  node.items.forEach((n, i) => walkButtons(n, Object.assign({}, meta, { id: meta.id + '.' + pad(i + 1) })));
}

function scanBindings(toks, depth, file) {
  for (let i = 0; i < toks.length; i++) {
    if (depth[i] !== 0) continue;
    const t = toks[i];
    if ((t.value === 'const' || t.value === 'let' || t.value === 'var') && toks[i + 1] && toks[i + 1].type === 'ident') {
      let j = i + 1;
      while (j < toks.length && toks[j] && toks[j].type === 'ident') {
        const name = toks[j].value;
        j++;
        if (toks[j] && toks[j].value === '=') {
          const end = valueEnd(toks, j + 1);
          const node = E.readTernary(toks, j + 1, end);
          harvest(name, node, file);
          j = Math.max(node.end || end, j + 1);
        }
        if (toks[j] && toks[j].value === ',') { j++; continue; }
        break;
      }
      i = j;
      continue;
    }
    if (t.value === 'Object' && toks[i + 1] && toks[i + 1].value === '.' && toks[i + 2] && toks[i + 2].value === 'assign' && toks[i + 3] && toks[i + 3].value === '(') {
      const args = splitArgs(toks, i + 4);
      const first = args[0] && toks[args[0][0]];
      if (first && first.type === 'ident' && args[0][1] === args[0][0] + 1) {
        for (let a = 1; a < args.length; a++) harvest(first.value, parseSpan(toks, args[a]), file);
      }
      continue;
    }
    if (t.type === 'ident' && toks[i + 1] && (toks[i + 1].value === '.' || toks[i + 1].value === '=')) {
      const path = [t.value];
      let j = i;
      while (toks[j + 1] && toks[j + 1].value === '.' && toks[j + 2] && toks[j + 2].type === 'ident') {
        const meth = toks[j + 2].value;
        if (toks[j + 3] && toks[j + 3].value === '(' && (meth === 'push' || meth === 'unshift')) break;
        path.push(meth);
        j += 2;
      }
      if (toks[j + 1] && toks[j + 1].value === '=' && depth[i] === 0) {
        const end = valueEnd(toks, j + 2);
        const node = E.readTernary(toks, j + 2, end);
        if (path.length === 2 && (path[0] === 'GOSSIP' || path[0] === 'ET' || path[0] === 'QUESTS' || path[0] === 'REP' || path[0] === 'TC')) {
          harvest(path[0], { kind: 'obj', props: [{ key: path[1], value: node }] }, file);
        } else if (path.length === 1) harvest(path[0], node, file);
        else if (path[path.length - 1] === 'innerHTML' || path[path.length - 1] === 'textContent') {
          emit(node, {
            id: 'ui.dom.' + E.slug(path.join('_')),
            section: file === 'p13.js' ? 'mp' : 'ui',
            groups: ['Screen'], sub: 2000,
            context: 'Text written into the page (' + path[path.length - 1] + ') from ' + path[0] + '.'
          });
        }
        i = Math.max(node.end || end, j + 2);
        continue;
      }
      if (toks[j + 1] && toks[j + 1].value === '.' && toks[j + 2] && toks[j + 2].value === 'push' && toks[j + 3] && toks[j + 3].value === '(' && depth[i] === 0) {
        const root = path[0];
        if (root === 'ZONES' || root === 'MEMOS' || root === 'UNI' || root === 'QRW' || root === 'AFX' || root === 'AFX2') {
          const args = splitArgs(toks, j + 4);
          args.forEach(sp => harvest(root, parseSpan(toks, sp), file));
        }
      }
    }
  }
}

function valueEnd(toks, i) {
  let j = i, stack = [];
  while (j < toks.length) {
    const v = toks[j].value;
    if (v === '(' || v === '[' || v === '{') stack.push(v);
    else if (v === ')' || v === ']' || v === '}') {
      if (!stack.length) break;
      const open = v === ')' ? '(' : v === ']' ? '[' : '{';
      if (stack[stack.length - 1] === open) stack.pop();
      else break;
    } else if ((v === ',' || v === ';') && !stack.length) break;
    j++;
  }
  return j;
}

function sweep(toks, fnAt) {
  const section0 = state.rel.indexOf('server/') === 0 || state.rel.indexOf('lan/') === 0 || state.file === 'p13.js' ? 'mp' : 'ui';
  for (const t of toks) {
    if (t.type !== 'str' && t.type !== 'tmpl') continue;
    if (isCovered(t.from, t.to)) continue;
    const node = E.strFromToken ? null : null;
    const fake = {
      kind: 'str',
      from: t.from, to: t.to, line: t.line, col: t.col,
      style: t.quote === '`' ? 'template' : t.quote === '"' ? 'double' : 'single',
      parts: t.parts
    };
    const pieces = E.htmlPieces(state.src, fake.parts || []);
    if (pieces.length) {
      pieces.forEach((p, i) => {
        p.line = t.line;
        const view = E.present(p);
        if (!view || !E.isPlayerFacing(view.text) || E.isJunk(view.text)) return;
        if (/^\{[A-Za-z_][A-Za-z0-9_]*\}$/.test(view.text.trim())) return;
        emit(p, {
          id: (section0 === 'mp' ? 'mp' : 'ui') + '.html.' + E.slug(state.file) + '.' + t.line + '.' + pad(i + 1),
          section: section0, groups: ['Screen'], sub: 2500,
          context: 'Words inside a screen built by ' + (fnAt[0] && '') + (section0 === 'mp' ? 'multiplayer' : 'the interface') + ', ' + state.file + ' line ' + t.line + '.'
        });
      });
      mark(t.from, t.to);
      continue;
    }
    const view = E.present(fake);
    if (!view || !E.looksLikeCopy(view.text) || E.isJunk(view.text)) continue;
    if (/^[A-Za-z]{1,3}$/.test(view.text)) continue;
    if (/^[a-z]+(?:[A-Z][A-Za-z0-9]*)+$/.test(view.text)) continue;
    if (/^[A-Z0-9_]{2,}$/.test(view.text) && !/[a-z]/.test(view.text) && view.text.length < 14) continue;
    const fn = '';
    emit(fake, {
      id: (section0 === 'mp' ? 'mp' : 'ui') + '.line.' + E.slug(state.file) + '.' + t.line + '.' + t.col,
      section: section0,
      groups: section0 === 'mp' ? ['Messages'] : ['Messages'],
      sub: 4500,
      limitNote: 'Shown to the player. If it is a toast, it fades; if it is a dialog, it waits.',
      context: 'Player-facing line in ' + state.file + ' at line ' + t.line + '.'
    });
  }
}

function scanJs(rel) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) return;
  const src = fs.readFileSync(abs, 'utf8');
  state.file = path.basename(rel);
  state.rel = rel;
  state.src = src;
  state.covered = [];
  E.setSource(src);
  const toks = E.lex(src);
  const depth = depthsOf(toks);
  const fnAt = enclosingFn(toks);
  scanBindings(toks, depth, state.file);
  scanCalls(toks, fnAt);
  scanAssigns(toks, fnAt);
  sweep(toks, fnAt);
}

function scanAssigns(toks, fnAt) {
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    if (t.type !== 'ident' || (t.value !== 'textContent' && t.value !== 'innerHTML')) continue;
    if (!toks[i + 1] || toks[i + 1].type !== 'punct' || toks[i + 1].value !== '=') continue;
    let j = i + 2, stack = [];
    while (j < toks.length) {
      const v = toks[j].value;
      if (toks[j].type === 'punct' && (v === '(' || v === '[' || v === '{')) stack.push(v);
      else if (toks[j].type === 'punct' && (v === ')' || v === ']' || v === '}')) {
        if (!stack.length) break;
        const open = v === ')' ? '(' : v === ']' ? '[' : '{';
        if (stack[stack.length - 1] === open) stack.pop();
        else break;
      } else if (toks[j].type === 'punct' && (v === ';' || v === ',') && !stack.length) break;
      j++;
    }
    const node = E.readTernary(toks, i + 2, j);
    if (!node || (node.kind !== 'str' && node.kind !== 'alts')) continue;
    const fn = (fnAt && fnAt[i]) || '';
    const section = sectionFor(fn);
    emit(node, {
      id: (section === 'mp' ? 'mp' : 'ui') + '.dom.' + E.slug((fn || t.value) + '_' + t.line),
      section,
      groups: ['Screen'],
      sub: 2100,
      context: 'Written onto the page (' + t.value + ') from ' + (fn || 'the interface') + '.'
    });
  }
}

function scanHtml(rel) {
  const abs = path.join(ROOT, rel);
  const src = fs.readFileSync(abs, 'utf8');
  state.file = 'p0.html';
  state.rel = rel;
  state.src = src;
  state.covered = [];
  const masked = src
    .replace(/<style\b[\s\S]*?<\/style>/gi, m => m.replace(/[^\n]/g, ' '))
    .replace(/<script\b[\s\S]*?<\/script>/gi, m => m.replace(/[^\n]/g, ' '));
  const parts = [{ t: masked, from: 0, to: masked.length }];
  /* Run the HTML splitter on the masked page. Offsets match the original. */
  const pieces = E.htmlPieces(masked, parts);
  const seen = new Set();
  pieces.forEach((p, i) => {
    const view = E.present(p);
    if (!view || !E.isPlayerFacing(view.text)) return;
    const key = view.from + ':' + view.to;
    if (seen.has(key)) return;
    seen.add(key);
    const around = src.slice(Math.max(0, view.from - 280), view.from);
    const ids = [...around.matchAll(/\bid="([^"]+)"/g)];
    const el = ids.length ? ids[ids.length - 1][1] : '';
    const base = HTML_ID[el] || ('ui.shell.' + (el ? E.slug(el) : 't' + i));
    const line = src.slice(0, view.from).split('\n').length;
    p.line = line;
    const groups = el && HTML_ID[el] && HTML_ID[el].indexOf('charselect') >= 0 ? ['Title screen']
      : el && /death|bRise/.test(el) ? ['Death']
      : el && /disc/.test(el) ? ['Disclaimer']
      : el && /sc/.test(el) ? ['Scenes']
      : ['HUD'];
    emit(p, {
      id: base,
      section: 'ui',
      groups,
      sub: groups[0] === 'Title screen' ? 0 : groups[0] === 'Death' ? 5 : 2,
      hardMax: HTML_HARD[el] == null ? null : HTML_HARD[el],
      limitNote: HTML_NOTE[el] || 'On the page shell.',
      context: el
        ? 'Visible label' + (src.slice(view.from - 12, view.from).indexOf('title=') >= 0 ? ' (tooltip)' : '') + ' on #' + el + '.'
        : 'Visible text on the page shell, line ' + line + '.'
    });
  });
}

function scanShell(rel) {
  const abs = path.join(ROOT, rel);
  const src = fs.readFileSync(abs, 'utf8');
  state.file = path.basename(rel);
  state.rel = rel;
  state.src = src;
  state.covered = [];
  const lines = src.split('\n');
  let at = 0;
  lines.forEach((line, idx) => {
    const start = at;
    at += line.length + 1;
    let m;
    if (rel.endsWith('.bat')) {
      m = /^\s*echo(?:\s+|$)(.*)$/i.exec(line);
      if (!m) return;
      const raw = m[1];
      if (!raw || raw === '.' || /^off$/i.test(raw.trim())) return;
      if (!E.looksLikeCopy(raw.replace(/^"|"$/g, ''))) return;
      const col = m.index + m[0].length - raw.length;
      const from = start + col;
      const text = raw.replace(/^"|"$/g, '');
      const quoted = raw.startsWith('"') && raw.endsWith('"');
      emitRaw(from, from + raw.length, text, quoted ? 'double' : 'raw', idx + 1,
        'mp.lan.' + (rel.endsWith('.bat') ? 'windows' : 'unix') + '.' + pad(idx + 1));
      return;
    }
    const re = /\b(?:say|echo)\s+"([^"\\]*(?:\\.[^"\\]*)*)"/g;
    while ((m = re.exec(line))) {
      const text = m[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      if (!E.looksLikeCopy(text) && !E.isPlayerFacing(text)) continue;
      const from = start + m.index;
      const to = from + m[0].length;
      /* replace the whole say "..." is too wide; replace the quoted literal only */
      const q = m[0].indexOf('"');
      const qFrom = from + q;
      const qTo = start + m.index + m[0].length;
      if (!E.isPlayerFacing(text)) continue;
      state.covered = [];
      const node = { kind: 'str', style: 'double', from: qFrom, to: qTo, line: idx + 1, parts: [{ t: text, from: qFrom + 1, to: qTo - 1 }] };
      emit(node, {
        id: 'mp.lan.' + (rel.indexOf('.command') >= 0 ? 'mac' : 'unix') + '.' + pad(idx + 1) + '.' + pad(m.index),
        section: 'mp', groups: ['LAN launcher'], sub: 0, singleLine: true,
        context: 'A line the LAN launcher prints in the terminal before the game starts. File ' + path.basename(rel) + '.'
      });
    }
  });
}

function emitRaw(from, to, text, style, line, id) {
  const node = { kind: 'str', style, from, to, line, parts: [{ t: text, from: style === 'raw' ? from : from, to }] };
  if (style === 'double') node.parts = [{ t: text, from: from + 1, to: to - 1 }];
  emit(node, {
    id, section: 'mp', groups: ['LAN launcher'], sub: 0, singleLine: true,
    context: 'A line the Windows LAN launcher prints before the game starts.'
  });
}

function writeDoc() {
  entries.sort((a, b) => {
    const sa = SECTION_ORDER.indexOf(a.section);
    const sb = SECTION_ORDER.indexOf(b.section);
    if (sa !== sb) return sa - sb;
    if (a.sub !== b.sub) return a.sub - b.sub;
    if (a.seq !== b.seq) return a.seq - b.seq;
    return a.id.localeCompare(b.id);
  });
  const counts = {};
  for (const s of SECTION_ORDER) counts[s] = 0;
  for (const e of entries) counts[e.section] = (counts[e.section] || 0) + 1;

  const lines = [];
  lines.push('# Unsubscribe 2087 — Game Text');
  lines.push('');
  lines.push('Total entries: ' + entries.length);
  lines.push('');
  lines.push('## How to edit');
  lines.push('');
  lines.push('This is every line a player can read. Change the words, send the file back, and the game is updated from it.');
  lines.push('');
  lines.push('Only edit the indented block between a line that says TEXT and a line that says END. Leave every other line alone, especially lines that start with ID, SOURCE, or MODE.');
  lines.push('');
  lines.push('MODE says which layout shows the line: mouse (click, right-click, F-keys), touch (tap, drag, the stick), or both. A control hint that has two wordings is two entries.');
  lines.push('');
  lines.push('Keep every {placeholder} exactly, braces included. You can move one. You cannot delete one, rename one, or invent one. The PLACEHOLDERS line says what each one becomes in the game.');
  lines.push('');
  lines.push('If LIMIT gives a number, stay within that many characters. The count includes spaces and placeholders. A line break counts as a character.');
  lines.push('');
  lines.push('Straight quotes and apostrophes are fine. Emoji are fine. Do not turn on smart quotes. Do not add a line whose only word is END.');
  lines.push('');
  lines.push('The indented block is the text. Keep the four spaces if you are editing this file by hand; they are not part of the game. In Google Docs or Word, edit the shaded block and leave the ID above it. A blank line at the very start or end of a block may disappear in Google Docs; the importer leaves the game alone when that is the only difference.');
  lines.push('');
  lines.push('To bring an edit back: `node tools/text/import.js path/to/file` where the file is this Markdown, a .docx, or a .txt from Google Docs. Add `--dry-run` to preview. The importer will not touch a line whose source has changed underneath it, a line that lost or gained a placeholder, or a line that exceeds its limit.');
  lines.push('');
  lines.push('## Contents');
  lines.push('');
  for (const s of SECTION_ORDER) {
    if (!counts[s]) continue;
    lines.push('- ' + SECTION_TITLE[s] + ' (' + counts[s] + ')');
  }
  lines.push('');

  let curS = '', curG = '';
  for (const e of entries) {
    if (e.section !== curS) {
      curS = e.section;
      curG = '';
      lines.push('# ' + (SECTION_TITLE[curS] || curS));
      lines.push('');
      if (SECTION_BLURB[curS]) { lines.push(SECTION_BLURB[curS]); lines.push(''); }
      lines.push(counts[curS] + ' entries.');
      lines.push('');
    }
    const g = e.groups.join(' / ');
    if (g !== curG) {
      curG = g;
      lines.push('## ' + e.groups[0]);
      lines.push('');
      if (e.groups.length > 1) {
        lines.push('### ' + e.groups.slice(1).join(' — '));
        lines.push('');
      }
    }
    lines.push('ID: ' + e.id);
    lines.push('');
    lines.push('SOURCE: ' + e.file + ' line ' + e.line);
    lines.push('');
    lines.push('CONTEXT: ' + e.context);
    lines.push('');
    lines.push('MODE: ' + (e.mode || 'both') + '. ' + modeNote(e.mode || 'both'));
    lines.push('');
    if (!e.placeholders.length) lines.push('PLACEHOLDERS: none');
    else {
      lines.push('PLACEHOLDERS:');
      lines.push('');
      for (const h of e.placeholders) lines.push('- ' + E.explainHole(h.name, h.expr));
    }
    lines.push('');
    if (e.hardMax != null) lines.push('LIMIT: ' + e.hardMax + ' characters. ' + (e.limitNote || ''));
    else lines.push('LIMIT: none.' + (e.limitNote ? ' ' + e.limitNote : ''));
    lines.push('');
    lines.push('TEXT');
    lines.push('');
    const body = e.text.split('\n');
    for (const line of body) lines.push('    ' + line);
    lines.push('');
    lines.push('END');
    lines.push('');
  }
  fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
  const md = lines.join('\n');
  fs.writeFileSync(OUT_MD, md);
  fs.writeFileSync(OUT_CAT, JSON.stringify({ generated: new Date().toISOString(), count: entries.length, entries }, null, 0));
  try {
    docx.writeDocx(md, OUT_DOCX);
  } catch (e) {
    console.error('Word file skipped: ' + (e && e.message ? e.message : e));
    console.error('text/GAME-TEXT.md and text/catalog.json were written. This export does not use pandoc.');
  }
}

function selfCheck() {
  const files = {};
  let bad = 0;
  for (const e of entries) {
    if (!files[e.file]) files[e.file] = fs.readFileSync(path.join(ROOT, e.file), 'utf8');
    if (files[e.file].slice(e.start, e.end) !== e.raw) {
      console.error('RAW MISMATCH', e.id);
      bad++;
    }
    const why = E.placeholderDrift(e.text, e.text);
    if (why) { console.error('PH', e.id, why); bad++; }
    if (e.hardMax != null && Array.from(e.text).length > e.hardMax) {
      console.error('LIMIT', e.id); bad++;
    }
  }
  for (const f of Object.keys(files)) {
    const list = entries.filter(e => e.file === f).sort((a, b) => a.start - b.start || a.end - b.end);
    for (let i = 1; i < list.length; i++) {
      if (list[i].start < list[i - 1].end) {
        console.error('OVERLAP', list[i - 1].id, list[i].id, f, list[i - 1].start, list[i - 1].end, list[i].start, list[i].end);
        bad++;
      }
    }
  }
  if (bad) {
    console.error(bad + ' self-check problems');
    process.exit(1);
  }
}

function main() {
  const js = [
    'src/formulas.js', 'src/p1.js', 'src/p2.js', 'src/p5.js', 'src/p6.js', 'src/p7.js', 'src/p8.js', 'src/p9.js',
    'src/p10.js', 'src/p11.js', 'src/p3.js', 'src/p4.js', 'src/p12.js', 'src/p13.js'
  ];
  for (const f of js) scanJs(f);
  const lib = fs.readdirSync(path.join(ROOT, 'server/lib')).filter(n => n.endsWith('.js') && !['guard.js', 'admin.js', 'plaus.js'].includes(n));
  for (const n of lib) scanJs('server/lib/' + n);
  scanJs('server/server.js');
  scanHtml('src/p0.html');
  for (const f of ['lan/Play-Unsubscribe-2087.sh', 'lan/Play-Unsubscribe-2087.command', 'lan/Play-Unsubscribe-2087.bat']) scanShell(f);
  selfCheck();
  writeDoc();
  const counts = {};
  for (const e of entries) counts[e.section] = (counts[e.section] || 0) + 1;
  const tally = SECTION_ORDER.filter(s => counts[s]).map(s => s + ' ' + counts[s]).join(', ');
  process.stdout.write(entries.length + ' entries (' + tally + ')\n');
  process.stdout.write('wrote text/GAME-TEXT.md, text/GAME-TEXT.docx, text/catalog.json\n');
}

if (require.main === module) main();
module.exports = { main, modeOf, modeNote };
