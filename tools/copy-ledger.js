#!/usr/bin/env node
/* Read-only copy ledger.
   Walks src/p*.js (not dist/, not src/p0.html) and writes notes/copy-ledger.md.
   One row per player-facing string. Does not edit src/.

   node tools/copy-ledger.js
*/
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'notes', 'copy-ledger.md');

const SURFACES = ['tooltip', 'toast', 'dialog', 'gossip', 'quest', 'scene', 'sheet', 'item', 'multiplayer'];

/* NPC keys used as object properties. The ledger stores the name a player would say. */
const WHO = {
  gramps: 'Gramps', brenda: 'Brenda', wren: 'Wren', null: 'Sister Null', marrow: 'Marrow',
  nonce: 'Nonce', kestrel: 'Kestrel', ines: 'Ines', tam: 'Tam', float: 'Mr. Float',
  res: 'A Resident', laz: 'Laz', finn: 'Finn', vane: 'Ms. Vane', zabo: 'Zabo',
  usher: 'The Usher', hale: 'Nurse Hale', bosk: 'Mr. Bosk'
};
const who = k => (k != null && WHO[k]) || (k == null ? '' : String(k));

/* Bindings that hold player-facing copy. Anything else is walked only for scene slides. */
const BIND = {
  CLS: { surface: 'tooltip', shape: 'cls' },
  UNI: { surface: 'item', shape: 'copy' },
  BASE: { surface: 'item', shape: 'copy' },
  AFX: { surface: 'item', shape: 'affix' },
  SETS: { surface: 'item', shape: 'copy' },
  MODS: { surface: 'item', shape: 'lines' },
  CN1: { surface: 'item', shape: 'loose' },
  CN2: { surface: 'item', shape: 'loose' },
  CN3: { surface: 'item', shape: 'loose' },
  ZADJ: { surface: 'item', shape: 'loose' },
  RN1: { surface: 'item', shape: 'loose' },
  RN2: { surface: 'item', shape: 'loose' },
  SNAME: { surface: 'sheet', shape: 'lines' },
  QN: { surface: 'item', shape: 'loose' },
  SHR: { surface: 'toast', shape: 'loose', speaker: 'shrine' },
  MEMOS: { surface: 'sheet', shape: 'memos' },
  QUESTS: { surface: 'quest', shape: 'copy' },
  SQ: { surface: 'quest', shape: 'copy' },
  CHATTER: { surface: 'gossip', shape: 'loose', speaker: 'street' },
  GOSSIP: { surface: 'gossip', shape: 'gossip' },
  BOSSBARK: { surface: 'dialog', shape: 'loose', speaker: 'boss' },
  BOSSBARK2: { surface: 'dialog', shape: 'loose', speaker: 'boss' },
  OPT_LBL: { surface: 'sheet', shape: 'lines' },
  ZONES: { surface: 'sheet', shape: 'copy' },
  TC: { surface: 'sheet', shape: 'copy' },
  ET: { surface: 'sheet', shape: 'copy' },
  MERCS: { surface: 'sheet', shape: 'copy' },
  MNAMES: { surface: 'sheet', shape: 'loose', speaker: 'companion' },
  ATTR: { surface: 'sheet', shape: 'pairs' },
  CONV: { surface: 'dialog', shape: 'voices' },
  GREET: { surface: 'dialog', shape: 'voices' },
  REACT: { surface: 'dialog', shape: 'voices' },
  TOX: { surface: 'dialog', shape: 'loose', speaker: 'you' },
  COINS: { surface: 'dialog', shape: 'loose', speaker: 'shitcoiner' },
  SHILLQ: { surface: 'dialog', shape: 'loose', speaker: 'shitcoiner' },
  PERS: { surface: 'sheet', shape: 'copy' },
  DOCS: { surface: 'tooltip', shape: 'docs' },
  FORKS: { surface: 'tooltip', shape: 'copy' },
  ACH: { surface: 'sheet', shape: 'ach' },
  DIFFS: { surface: 'sheet', shape: 'copy' },
  DIFFUP: { surface: 'toast', shape: 'loose' },
  DIFFDN: { surface: 'toast', shape: 'loose' },
  DIFFSET: { surface: 'toast', shape: 'loose' },
  PHRASES: { surface: 'item', shape: 'copy' },
  REP: { surface: 'sheet', shape: 'copy' },
  EVS: { surface: 'sheet', shape: 'copy' },
  LOCALS: { surface: 'gossip', shape: 'locals' },
  BINTRO: { surface: 'scene', shape: 'copy' },
  LTAUNT: { surface: 'dialog', shape: 'lines', speaker: 'boss' },
  STORYDEX: { surface: 'sheet', shape: 'copy' },
  CAMPS: { surface: 'quest', shape: 'copy' },
  TABS: { surface: 'sheet', shape: 'lines' },
  ROWB: { surface: 'tooltip', shape: 'rowb' },
  DTY: { surface: 'sheet', shape: 'copy' },
  FAM: { surface: 'item', shape: 'copy' },
  BUILDS: { surface: 'sheet', shape: 'copy' },
  QRW: { surface: 'quest', shape: 'qrw' },
  DOCT: { surface: 'tooltip', shape: 'lines' },
  WEBT: { surface: 'tooltip', shape: 'lines' },
  WARMS: { surface: 'tooltip', shape: 'warms' },
  DROWS: { surface: 'sheet', shape: 'drows' },
  PRE_ST: { surface: 'quest', shape: 'copy' }
};

const COPY_KEYS = new Set([
  'n', 'd', 'tag', 'ab', 'fl', 'sp', 'base', 'b2', 'b3', 'rw', 'offer', 'label', 'how', 'perk',
  'note', 'p', 'act', 'ranks', 'perks', 'say', 'bases', 'l', 't', 'again'
]);
const KEY_SURF = {
  text: 'scene', title: 'scene', intro: 'dialog', fl: 'item', sp: 'item', base: 'item',
  b2: 'item', b3: 'item', offer: 'quest', rw: 'quest', say: 'dialog', label: 'quest', again: 'scene'
};

const rows = [];
const seen = new Set();

function surfOf(file, surface) {
  if (file === 'p13.js' && (surface === 'toast' || surface === 'dialog' || surface === 'sheet')) return 'multiplayer';
  return surface;
}

function keep(text, loose) {
  if (text == null) return false;
  const t = String(text).replace(/[ \t]+\n/g, '\n').trim();
  if (!t || !/[A-Za-z]/.test(t)) return false;
  if (/^#[0-9a-fA-F]{3,8}$/.test(t)) return false;
  if (/^rgba?\(/i.test(t)) return false;
  if (/^https?:/i.test(t)) return false;
  if (/^M[0-9].*z$/.test(t) && t.length > 20) return false;
  if (loose) return t.length >= 2;
  if (/^[a-z][a-z0-9_./:-]*$/.test(t)) return false;
  if (t.length < 2) return false;
  return true;
}

function addRow(file, line, col, surface, speaker, text, loose) {
  surface = surfOf(file, surface);
  if (!SURFACES.includes(surface)) return;
  text = String(text).replace(/\r/g, '');
  /* Static letters decide. A row that is only {expression} is not copy. */
  if (!keep(staticBits(text), !!loose)) return;
  speaker = speaker == null ? '' : String(speaker).replace(/\s+/g, ' ').trim();
  if (speaker.length > 80) speaker = '';
  const key = [file, line, col, surface, text].join('\u0001');
  if (seen.has(key)) return;
  seen.add(key);
  rows.push({ file, line, col, surface, speaker, tag: 'unread', text });
}

/* ---------- lexer ---------- */
const PUNCT = ['===', '!==', '>>>', '**=', '>>=', '<<=', '=>', '<=', '>=', '==', '!=', '&&', '||', '?.', '++', '--', '+=', '-=', '*=', '/=', '%=', '**', '<<', '>>', '...'];

function lex(src) {
  const toks = [];
  let i = 0, line = 1, col = 1;
  const push = (type, value, from, to, l, c, extra) => {
    toks.push(Object.assign({ type, value, from, to, line: l, col: c }, extra));
  };
  while (i < src.length) {
    const ch = src[i];
    if (ch === ' ' || ch === '\t' || ch === '\r') { i++; col++; continue; }
    if (ch === '\n') { i++; line++; col = 1; continue; }
    if (ch === '/' && src[i + 1] === '/') {
      while (i < src.length && src[i] !== '\n') i++;
      continue;
    }
    if (ch === '/' && src[i + 1] === '*') {
      i += 2; col += 2;
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) {
        if (src[i] === '\n') { line++; col = 1; } else col++;
        i++;
      }
      i += 2; col += 2;
      continue;
    }
    if (ch === "'" || ch === '"') {
      const from = i, l = line, c = col;
      const r = readQuote(src, i, line, col);
      push('str', r.value, from, r.i, l, c);
      i = r.i; line = r.line; col = r.col;
      continue;
    }
    if (ch === '`') {
      const from = i, l = line, c = col;
      const r = readTemplate(src, i, line, col);
      const text = r.parts.map(p => p.e != null ? '{' + collapse(p.e) + '}' : p.t).join('');
      const holes = r.parts.filter(p => p.e != null).map(p => ({ src: p.e, line: p.line, col: p.col }));
      push('tmpl', text, from, r.i, l, c, { holes, parts: r.parts });
      i = r.i; line = r.line; col = r.col;
      continue;
    }
    if (/[A-Za-z_$]/.test(ch)) {
      const from = i, l = line, c = col;
      i++; col++;
      while (i < src.length && /[A-Za-z0-9_$]/.test(src[i])) { i++; col++; }
      push('ident', src.slice(from, i), from, i, l, c);
      continue;
    }
    if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(src[i + 1] || ''))) {
      const from = i, l = line, c = col;
      const r = readNumber(src, i, line, col);
      push('num', r.value, from, r.i, l, c);
      i = r.i; line = r.line; col = r.col;
      continue;
    }
    if (ch === '/' && regexAllowed(toks[toks.length - 1])) {
      const from = i, l = line, c = col;
      const r = readRegex(src, i, line, col);
      push('regex', r.value, from, r.i, l, c);
      i = r.i; line = r.line; col = r.col;
      continue;
    }
    const rest = src.slice(i, i + 4);
    let punct = null;
    for (const p of PUNCT) if (rest.startsWith(p)) { punct = p; break; }
    if (punct) {
      push('punct', punct, i, i + punct.length, line, col);
      i += punct.length; col += punct.length;
      continue;
    }
    push('punct', ch, i, i + 1, line, col);
    i++; col++;
  }
  return toks;
}

function collapse(s) {
  return String(s).replace(/\s+/g, ' ').trim();
}

function readNumber(src, i, line, col) {
  const from = i;
  const eat = () => { i++; col++; };
  if (src[i] === '.') eat();
  while (i < src.length && /[0-9]/.test(src[i])) eat();
  if (src[i] === '.' && /[0-9]/.test(src[i + 1] || '')) {
    eat();
    while (i < src.length && /[0-9]/.test(src[i])) eat();
  }
  if (src[i] === 'e' || src[i] === 'E') {
    const sign = src[i + 1] === '+' || src[i + 1] === '-';
    const dig = sign ? src[i + 2] : src[i + 1];
    if (/[0-9]/.test(dig || '')) {
      eat();
      if (sign) eat();
      while (i < src.length && /[0-9]/.test(src[i])) eat();
    }
  }
  return { value: src.slice(from, i), i, line, col };
}

/* A slash is a regex when it cannot be division. Division follows a value. */
function regexAllowed(prev) {
  if (!prev) return true;
  if (prev.type === 'ident') return /^(return|typeof|case|throw|void|delete|await|else|do|in|of|new|yield)$/.test(prev.value);
  if (prev.type === 'num' || prev.type === 'str' || prev.type === 'tmpl' || prev.type === 'regex') return false;
  if (prev.type === 'punct' && (prev.value === ')' || prev.value === ']' || prev.value === '++' || prev.value === '--')) return false;
  return true;
}

function regexHere(src, i) {
  let j = i - 1;
  while (j >= 0 && (src[j] === ' ' || src[j] === '\t' || src[j] === '\n' || src[j] === '\r')) j--;
  if (j < 0) return true;
  const c = src[j];
  if (c === '+' || c === '-') return src[j - 1] !== c;
  if (c === ')' || c === ']' || c === '"' || c === "'" || c === '`') return false;
  if (/[0-9]/.test(c)) return false;
  if (/[A-Za-z0-9_$]/.test(c)) {
    let k = j;
    while (k >= 0 && /[A-Za-z0-9_$]/.test(src[k])) k--;
    const w = src.slice(k + 1, j + 1);
    return /^(return|typeof|case|throw|void|delete|await|else|do|in|of|new|yield)$/.test(w);
  }
  return true;
}

function readRegex(src, i, line, col) {
  const from = i;
  i++; col++;
  let cls = false;
  while (i < src.length) {
    const c = src[i];
    if (c === '\\') {
      i += 2; col += 2;
      if (src[i - 1] === '\n') { line++; col = 1; }
      continue;
    }
    if (c === '\n') break;
    if (c === '[' && !cls) {
      cls = true; i++; col++;
      if (src[i] === '^') { i++; col++; }
      if (src[i] === ']') { i++; col++; }
      continue;
    }
    if (c === ']' && cls) { cls = false; i++; col++; continue; }
    if (c === '/' && !cls) { i++; col++; break; }
    i++; col++;
  }
  while (i < src.length && /[a-z]/i.test(src[i])) { i++; col++; }
  return { value: src.slice(from, i), i, line, col };
}

function readQuote(src, i, line, col) {
  const q = src[i];
  let value = '';
  i++; col++;
  while (i < src.length && src[i] !== q) {
    if (src[i] === '\\') {
      const n = src[i + 1];
      if (n === 'n') value += '\n';
      else if (n === 't') value += '\t';
      else if (n === 'r') value += '\r';
      else if (n === 'u' && /^[0-9a-fA-F]{4}/.test(src.slice(i + 2, i + 6))) {
        value += String.fromCharCode(parseInt(src.slice(i + 2, i + 6), 16));
        i += 6; col += 6;
        continue;
      } else value += n == null ? '' : n;
      if (n === '\n') { line++; col = 1; i += 2; continue; }
      i += 2; col += 2;
      continue;
    }
    if (src[i] === '\n') { value += '\n'; line++; col = 1; i++; continue; }
    value += src[i]; i++; col++;
  }
  i++; col++;
  return { value, i, line, col };
}

function readTemplate(src, i, line, col) {
  const parts = [];
  let buf = '';
  i++; col++;
  while (i < src.length) {
    if (src[i] === '\\') {
      const n = src[i + 1];
      if (n === 'n') buf += '\n';
      else if (n === 't') buf += '\t';
      else if (n === 'r') buf += '\r';
      else if (n === '`' || n === '\\' || n === '$') buf += n;
      else buf += n == null ? '' : n;
      if (n === '\n') { line++; col = 1; i += 2; continue; }
      i += 2; col += 2;
      continue;
    }
    if (src[i] === '`') {
      parts.push({ t: buf });
      i++; col++;
      return { parts, i, line, col };
    }
    if (src[i] === '$' && src[i + 1] === '{') {
      parts.push({ t: buf });
      buf = '';
      i += 2; col += 2;
      const el = line, ec = col;
      let depth = 1;
      const start = i;
      while (i < src.length && depth > 0) {
        const c = src[i];
        if (c === '\n') { line++; col = 1; i++; continue; }
        if (c === '/' && src[i + 1] !== '/' && src[i + 1] !== '*' && regexHere(src, i)) {
          const r = readRegex(src, i, line, col);
          i = r.i; line = r.line; col = r.col;
          continue;
        }
        if (c === '/' && src[i + 1] === '/') {
          while (i < src.length && src[i] !== '\n') i++;
          continue;
        }
        if (c === '/' && src[i + 1] === '*') {
          i += 2;
          while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) {
            if (src[i] === '\n') line++;
            i++;
          }
          i += 2; col += 2;
          continue;
        }
        if (c === "'" || c === '"') {
          const r = readQuote(src, i, line, col);
          i = r.i; line = r.line; col = r.col;
          continue;
        }
        if (c === '`') {
          const r = readTemplate(src, i, line, col);
          i = r.i; line = r.line; col = r.col;
          continue;
        }
        if (c === '{') depth++;
        else if (c === '}') {
          depth--;
          i++; col++;
          if (depth === 0) break;
          continue;
        }
        i++; col++;
      }
      parts.push({ e: src.slice(start, i - 1), line: el, col: ec });
      continue;
    }
    if (src[i] === '\n') { buf += '\n'; line++; col = 1; i++; continue; }
    buf += src[i]; i++; col++;
  }
  parts.push({ t: buf });
  return { parts, i, line, col };
}

/* ---------- expression parser (string-aware, stops at a limit) ---------- */
function matchClose(toks, i, open, close, limit) {
  const lim = limit == null ? toks.length : limit;
  let d = 0;
  for (let j = i; j < lim; j++) {
    const t = toks[j];
    if (!t || t.type !== 'punct') continue;
    if (t.value === open) d++;
    else if (t.value === close) {
      d--;
      if (d === 0) return j;
    }
  }
  return Math.max(i, lim - 1);
}

function sliceToks(src, toks, a, b) {
  if (b <= a || !toks[a]) return '';
  const end = toks[b - 1] ? toks[b - 1].to : toks[a].from;
  return src.slice(toks[a].from, end);
}

function strNode(text, line, col, end, holes) {
  return { kind: 'str', text, line, col, end, holes: holes || [] };
}

function skipNode(toks, src, a, b) {
  const t = toks[a] || { line: 1, col: 1 };
  const raw = sliceToks(src, toks, a, b);
  return { kind: 'skip', end: b, line: t.line, col: t.col, src: raw, _i: a };
}

function readPrimary(toks, src, i, limit) {
  if (i >= limit || !toks[i]) return skipNode(toks, src, i, i);
  const t = toks[i];
  if (t.type === 'str') { const n = strNode(t.value, t.line, t.col, i + 1, []); n._i = i; return n; }
  if (t.type === 'tmpl') { const n = strNode(t.value, t.line, t.col, i + 1, t.holes || []); n._i = i; return n; }
  if (t.value === '[') return readArray(toks, src, i, limit);
  if (t.value === '{') return readObject(toks, src, i, limit);
  if (t.value === '(') return readGroup(toks, src, i, limit);
  if (t.value === '...') {
    const inner = readPrimary(toks, src, i + 1, limit);
    return skipNode(toks, src, i, inner.end);
  }
  if (t.type === 'ident' && toks[i + 1] && toks[i + 1].value === '=>' && i + 1 < limit) {
    return readArrow(toks, src, i + 2, limit, t.line, t.col);
  }
  if (t.type === 'ident' || t.type === 'num') return spanAtom(toks, src, i, limit);
  if (t.value === 'function') return spanFunction(toks, src, i, limit);
  if (t.value === '!' || t.value === '~' || t.value === '-' || t.value === '+' || t.value === 'typeof' || t.value === 'void' || t.value === 'await' || t.value === 'new' || t.value === 'delete') {
    const inner = readPrimary(toks, src, i + 1, limit);
    return skipNode(toks, src, i, Math.max(inner.end, i + 1));
  }
  return skipNode(toks, src, i, i + 1);
}

function spanAtom(toks, src, i, limit) {
  let j = i + 1;
  while (j < limit && toks[j]) {
    const v = toks[j].value;
    if (v === '.' || v === '?.') {
      j++;
      if (j < limit && toks[j] && (toks[j].type === 'ident' || toks[j].type === 'num')) j++;
      continue;
    }
    if (v === '[') { j = matchClose(toks, j, '[', ']', limit) + 1; continue; }
    if (v === '(') { j = matchClose(toks, j, '(', ')', limit) + 1; continue; }
    if (v === '++' || v === '--') { j++; continue; }
    break;
  }
  return skipNode(toks, src, i, j);
}

function spanFunction(toks, src, i, limit) {
  let j = i + 1;
  if (toks[j] && toks[j].type === 'ident') j++;
  if (toks[j] && toks[j].value === '(') j = matchClose(toks, j, '(', ')', limit) + 1;
  if (toks[j] && toks[j].value === '{') j = matchClose(toks, j, '{', '}', limit) + 1;
  return { kind: 'fn', body: null, end: Math.min(j, limit), line: toks[i].line, col: toks[i].col };
}

function readArrow(toks, src, i, limit, line, col) {
  if (toks[i] && toks[i].value === '{' && i < limit) {
    const end = matchClose(toks, i, '{', '}', limit) + 1;
    return { kind: 'fn', body: null, end, line, col };
  }
  const body = readTernary(toks, src, i, limit);
  return { kind: 'fn', body, end: body.end, line, col };
}

function readGroup(toks, src, i, limit) {
  const close = matchClose(toks, i, '(', ')', limit);
  if (toks[close + 1] && toks[close + 1].value === '=>') {
    return readArrow(toks, src, close + 2, limit, toks[i].line, toks[i].col);
  }
  if (close === i + 1) return skipNode(toks, src, i, close + 1);
  const inner = readTernary(toks, src, i + 1, close);
  inner.end = close + 1;
  return inner;
}

function readArray(toks, src, i, limit) {
  const start = toks[i];
  let j = i + 1;
  const items = [];
  while (j < limit && toks[j] && toks[j].value !== ']') {
    if (toks[j].value === ',') { j++; continue; }
    const n = readTernary(toks, src, j, limit);
    if (n.end <= j) n.end = j + 1;
    items.push(n);
    j = n.end;
    if (toks[j] && toks[j].value === ',') j++;
  }
  const end = toks[j] && toks[j].value === ']' ? j + 1 : j;
  return { kind: 'arr', items, end, line: start.line, col: start.col };
}

function readObject(toks, src, i, limit) {
  const start = toks[i];
  let j = i + 1;
  const props = [];
  while (j < limit && toks[j] && toks[j].value !== '}') {
    if (toks[j].value === ',') { j++; continue; }
    if (toks[j].value === '...') {
      const n = readTernary(toks, src, j + 1, limit);
      j = Math.max(n.end, j + 2);
      continue;
    }
    if (toks[j].value === '[') {
      const c = matchClose(toks, j, '[', ']', limit);
      j = c + 1;
      if (toks[j] && toks[j].value === ':') {
        j++;
        const v = readTernary(toks, src, j, limit);
        j = Math.max(v.end, j + 1);
      }
      continue;
    }
    if (toks[j].type === 'ident' || toks[j].type === 'str' || toks[j].type === 'num') {
      const key = toks[j].type === 'str' ? toks[j].value : String(toks[j].value);
      const kl = toks[j].line, kc = toks[j].col;
      j++;
      if (toks[j] && toks[j].value === '(') {
        const c = matchClose(toks, j, '(', ')', limit);
        j = c + 1;
        if (toks[j] && toks[j].value === '{') j = matchClose(toks, j, '{', '}', limit) + 1;
        continue;
      }
      if (toks[j] && toks[j].value === ':') {
        j++;
        const v = readTernary(toks, src, j, limit);
        if (v.end <= j) v.end = j + 1;
        props.push({ key, value: v, line: kl, col: kc });
        j = v.end;
        continue;
      }
      props.push({ key, value: skipNode(toks, src, j - 1, j), line: kl, col: kc });
      continue;
    }
    j++;
  }
  const end = toks[j] && toks[j].value === '}' ? j + 1 : j;
  return { kind: 'obj', props, end, line: start.line, col: start.col };
}

const MUL = new Set(['*', '/', '%', '**']);
const CMP = new Set(['==', '===', '!=', '!==', '<', '>', '<=', '>=', 'in', 'instanceof']);

/* * binds tighter than +, so `3*l` stays inside one hole of a concatenation. */
function readBinary(toks, src, i, limit, ops, next) {
  let node = next(toks, src, i, limit);
  if (node._i == null) node._i = i;
  while (node.end < limit && toks[node.end] && toks[node.end].type === 'punct' && ops.has(toks[node.end].value)) {
    const r = next(toks, src, node.end + 1, limit);
    if (r._i == null) r._i = node.end + 1;
    const end = Math.max(r.end, node.end + 2);
    node = foldInfix(toks, src, node, r, end);
  }
  return node;
}

function readMul(toks, src, i, limit) {
  return readBinary(toks, src, i, limit, MUL, readPrimary);
}

function readPlus(toks, src, i, limit) {
  let node = readMul(toks, src, i, limit);
  if (node._i == null) node._i = i;
  while (node.end < limit && toks[node.end] && toks[node.end].type === 'punct' && toks[node.end].value === '+') {
    const r = readMul(toks, src, node.end + 1, limit);
    if (r.end <= node.end + 1 && toks[node.end + 1]) r.end = Math.min(limit, node.end + 2);
    node = joinPlus(node, r);
  }
  return node;
}

function readCmp(toks, src, i, limit) {
  return readBinary(toks, src, i, limit, CMP, readPlus);
}

function readAnd(toks, src, i, limit) {
  return readBinary(toks, src, i, limit, new Set(['&&']), readCmp);
}

function readOr(toks, src, i, limit) {
  return readBinary(toks, src, i, limit, new Set(['||', '??']), readAnd);
}

/* Keep any string on either side. Two strings become separate rows. A product of numbers stays a hole. */
function foldInfix(toks, src, left, right, end) {
  const strings = [];
  const take = n => {
    if (!n) return;
    if (n.kind === 'str') strings.push(n);
    else if (n.kind === 'alts') strings.push(...n.items);
  };
  take(left); take(right);
  if (strings.length === 1) {
    const s = strings[0];
    const n = strNode(s.text, s.line, s.col, end, s.holes || []);
    n._i = left._i;
    return n;
  }
  if (strings.length > 1) return { kind: 'alts', items: strings, end, line: strings[0].line, col: strings[0].col, _i: left._i };
  const start = left._i != null ? left._i : left.end;
  return skipNode(toks, src, start, end);
}

function joinPlus(a, b) {
  const at = a.kind === 'str' ? a : null;
  const bt = b.kind === 'str' ? b : null;
  if (at && bt) {
    return strNode(at.text + bt.text, at.line, at.col, b.end, (at.holes || []).concat(bt.holes || []));
  }
  const left = at ? at.text : '{' + collapse(a.src || a.text || '…') + '}';
  const right = bt ? bt.text : '{' + collapse(b.src || b.text || '…') + '}';
  const holes = [];
  if (at) holes.push(...(at.holes || []));
  else holes.push({ src: a.src || '', line: a.line, col: a.col });
  if (bt) holes.push(...(bt.holes || []));
  else holes.push({ src: b.src || '', line: b.line, col: b.col });
  const n = strNode(left + right, (at || a).line, (at || a).col, b.end, holes);
  n._i = a._i;
  return n;
}

function readTernary(toks, src, i, limit) {
  const node = readOr(toks, src, i, limit);
  if (node.end < limit && toks[node.end] && toks[node.end].value === '?') {
    const q = node.end;
    /* `?.` is its own token, so a bare `?` is the ternary. */
    const a = readTernary(toks, src, q + 1, limit);
    let colon = a.end;
    if (toks[colon] && toks[colon].value === ':') {
      const b = readTernary(toks, src, colon + 1, limit);
      return joinTernary(node, a, b);
    }
    return node;
  }
  return node;
}

function joinTernary(cond, a, b) {
  const stringish = n => n && (n.kind === 'str' || n.kind === 'alts');
  if (stringish(a) && stringish(b)) {
    const items = [];
    const push = n => { if (n.kind === 'alts') items.push(...n.items); else items.push(n); };
    push(a); push(b);
    return { kind: 'alts', items, end: b.end, line: a.line, col: a.col };
  }
  const show = n => n.kind === 'str' ? n.text : '{' + collapse(n.src || n.text || '…') + '}';
  const holes = [];
  const absorb = n => {
    if (n.kind === 'str') holes.push(...(n.holes || []));
    else holes.push({ src: n.src || '', line: n.line, col: n.col });
  };
  absorb(cond); absorb(a); absorb(b);
  const text = '{' + collapse(cond.src || cond.text || '…') + ' ? ' + show(a) + ' : ' + show(b) + '}';
  return strNode(text, cond.line, cond.col, b.end, holes);
}

function bracketStack(toks, i, stop) {
  const stack = [];
  const start = i;
  while (i < toks.length) {
    const t = toks[i];
    const v = t.value;
    if (t.type === 'punct' && (v === '(' || v === '[' || v === '{')) stack.push(v);
    else if (t.type === 'punct' && (v === ')' || v === ']' || v === '}')) {
      const open = v === ')' ? '(' : v === ']' ? '[' : '{';
      if (!stack.length) break;
      if (stack[stack.length - 1] === open) stack.pop();
      else break;
    } else if (t.type === 'punct' && (v === ',' || v === ';') && !stack.length && stop) break;
    i++;
  }
  return [start, i];
}

function valueSpan(toks, i) {
  return bracketStack(toks, i, true);
}

function parseSpan(toks, src, a, b) {
  if (a >= b) return skipNode(toks, src, a, b);
  return readTernary(toks, src, a, b);
}

/* ---------- emit parsed strings ---------- */
let CUR = 'p0.js';

function staticBits(text) {
  let out = '', d = 0;
  for (const ch of String(text)) {
    if (ch === '{') { d++; continue; }
    if (ch === '}' && d) { d--; continue; }
    if (!d) out += ch;
  }
  return out;
}

const HTML_TAG = /<\/?(?:h[1-6]|p|button|div|span|table|tr|td|th|ul|ol|li|em|strong|b|i|small|br|label|textarea|a|input|svg|path|circle|u)\b[^>]*>/i;

/* Turn a markup string into the words a player reads, plus placeholder and title text. */
function splitHtml(text) {
  if (!HTML_TAG.test(text)) return null;
  const pieces = [];
  const attr = /(?:placeholder|title|alt|aria-label)\s*=\s*"([^"]*)"/gi;
  let m;
  while ((m = attr.exec(text))) pieces.push(m[1]);
  for (const chunk of text.replace(new RegExp(HTML_TAG.source, 'gi'), '\n').split('\n')) {
    const t = chunk.replace(/\s+/g, ' ').trim();
    if (t) pieces.push(t);
  }
  return pieces;
}

function emitText(text, line, col, surface, speaker, loose, depth) {
  if (!depth) {
    const parts = splitHtml(text);
    /* An empty list means the string was markup with no words. Do not keep the tags. */
    if (parts) {
      parts.forEach((p, i) => emitText(p, line, col + i, surface, speaker, loose, 1));
      return;
    }
  }
  addRow(CUR, line, col, surface, speaker || '', text, loose);
}

function emitParsed(node, surface, speaker, loose) {
  if (!node) return;
  if (node.kind === 'alts') { node.items.forEach(n => emitParsed(n, surface, speaker, loose)); return; }
  if (node.kind === 'fn') { emitParsed(node.body, surface, speaker, loose); return; }
  if (node.kind === 'arr') { node.items.forEach(n => emitParsed(n, surface, speaker, loose)); return; }
  if (node.kind !== 'str') return;
  emitText(node.text, node.line, node.col, surface, speaker, loose, 0);
  for (const h of node.holes || []) {
    if (!h || !h.src) continue;
    harvestSnippet(h.src, h.line || node.line, h.col || node.col, surface, speaker, loose);
  }
}

function harvestSnippet(snippet, line, col, surface, speaker, loose) {
  let toks;
  try { toks = lex(snippet); } catch (e) { return; }
  for (const t of toks) {
    if (t.type !== 'str' && t.type !== 'tmpl') continue;
    const ln = line + (t.line - 1);
    const c = t.line === 1 ? col + t.col : t.col;
    if (t.type === 'tmpl' && t.parts) {
      const chunks = htmlTexts(t.parts);
      if (chunks.length) {
        chunks.forEach((ch, i) => {
          emitText(ch.text, ln, c + i, surface, speaker, loose, 0);
          for (const h of ch.holes || []) harvestSnippet(h.e || h.src, ln, c, surface, speaker, loose);
        });
        continue;
      }
    }
    emitText(t.value, ln, c, surface, speaker, loose, 0);
    if (t.holes) for (const h of t.holes) harvestSnippet(h.src, ln, c, surface, speaker, loose);
  }
}

function prop(obj, key) {
  if (!obj || obj.kind !== 'obj') return null;
  return obj.props.find(p => p.key === key) || null;
}
function propStr(obj, key) {
  const p = prop(obj, key);
  if (p && p.value && p.value.kind === 'str' && !p.value.holes.length && !/\{/.test(p.value.text)) return p.value.text;
  return '';
}

function walk(node, ctx) {
  if (!node) return;
  if (node.kind === 'alts') { node.items.forEach(n => walk(n, ctx)); return; }
  if (node.kind === 'fn') { walk(node.body, ctx); return; }
  if (node.kind === 'skip' || node.kind === 'eof') return;
  if (node.kind === 'str') {
    if (ctx.emit) emitParsed(node, ctx.surface, ctx.speaker, ctx.loose);
    return;
  }
  if (node.kind === 'arr') { walkArr(node, ctx); return; }
  if (node.kind === 'obj') { walkObj(node, ctx); return; }
}

function walkArr(node, ctx) {
  const shape = ctx.shape;
  if (shape === 'memos') {
    if (node.items.length >= 2 && node.items[0].kind === 'str' && node.items[1].kind === 'str') {
      emitParsed(node.items[0], 'sheet', '', false);
      emitParsed(node.items[1], 'sheet', node.items[0].text, false);
      return;
    }
    node.items.forEach(n => walkArr(n, ctx));
    return;
  }
  if (shape === 'qrw') {
    if (node.items.length >= 3 && node.items[2] && (node.items[2].kind === 'str' || node.items[2].kind === 'alts')) {
      const sp = node.items[4] && node.items[4].kind === 'str' ? node.items[4].text : who(node.items[1] && node.items[1].kind === 'str' ? node.items[1].text : '');
      emitParsed(node.items[2], 'quest', sp, false);
      return;
    }
    node.items.forEach(n => walk(n, ctx));
    return;
  }
  if (shape === 'ach') {
    if (node.items.length >= 3 && node.items[1] && node.items[1].kind === 'str') {
      emitParsed(node.items[1], ctx.surface, '', false);
      emitParsed(node.items[2], ctx.surface, '', false);
      return;
    }
    node.items.forEach(n => walk(n, ctx));
    return;
  }
  if (shape === 'docs') {
    if (node.items.length >= 3 && node.items[1] && node.items[1].kind === 'str') {
      emitParsed(node.items[1], 'tooltip', ctx.speaker, false);
      emitParsed(node.items[2], 'tooltip', ctx.speaker, false);
      return;
    }
    node.items.forEach(n => walk(n, ctx));
    return;
  }
  if (shape === 'rowb') {
    if (node.items[0] && node.items[0].kind === 'str') {
      emitParsed(node.items[0], 'tooltip', '', false);
      if (node.items[1]) emitParsed(node.items[1], 'tooltip', '', false);
      return;
    }
    node.items.forEach(n => walk(n, ctx));
    return;
  }
  if (shape === 'warms') {
    if (node.items[0] && node.items[0].kind === 'str' && node.items.length >= 5) {
      emitParsed(node.items[0], 'tooltip', '', true);
      emitParsed(node.items[4], 'tooltip', '', true);
      return;
    }
    node.items.forEach(n => walk(n, ctx));
    return;
  }
  if (shape === 'drows') {
    if (node.items[0] && node.items[0].kind === 'str') emitParsed(node.items[0], 'sheet', '', false);
    return;
  }
  if (shape === 'pairs') {
    node.items.forEach(n => { if (n.kind === 'str') emitParsed(n, ctx.surface, ctx.speaker, false); });
    return;
  }
  if (shape === 'loose' || shape === 'lines') {
    node.items.forEach(n => walk(n, Object.assign({}, ctx, { emit: true })));
    return;
  }
  node.items.forEach(n => walk(n, ctx));
}

function walkObj(node, ctx) {
  const shape = ctx.shape || 'scenes';
  if (shape === 'cls') {
    const isClass = prop(node, 'sk') || prop(node, 'tag');
    if (!isClass) {
      node.props.forEach(p => walk(p.value, ctx));
      return;
    }
    const name = propStr(node, 'n');
    emitParsed(prop(node, 'n') && prop(node, 'n').value, 'tooltip', name, false);
    emitParsed(prop(node, 'tag') && prop(node, 'tag').value, 'tooltip', name, false);
    const sk = prop(node, 'sk');
    if (sk) walk(sk.value, { shape: 'copy', surface: 'tooltip', speaker: name, loose: false, emit: false });
    return;
  }
  if (shape === 'gossip' || shape === 'voices') {
    node.props.forEach(p => {
      walk(p.value, { shape: 'lines', surface: ctx.surface, speaker: who(p.key), loose: false, emit: true });
    });
    return;
  }
  if (shape === 'locals') {
    node.props.forEach(p => {
      const person = p.value;
      const name = propStr(person, 'n') || who(p.key);
      if (person && person.kind === 'obj') {
        emitParsed(prop(person, 'n') && prop(person, 'n').value, 'sheet', name, false);
        const say = prop(person, 'say');
        if (say) walk(say.value, { shape: 'lines', surface: 'gossip', speaker: name, loose: false, emit: true });
      }
    });
    return;
  }
  if (shape === 'lines' || shape === 'loose') {
    node.props.forEach(p => walk(p.value, Object.assign({}, ctx, { emit: true, speaker: ctx.speaker || who(p.key) })));
    return;
  }
  if (shape === 'affix') {
    node.props.forEach(p => {
      if (p.key === 't') emitParsed(p.value, 'item', '', false);
      else if (p.key === 'tiers' && p.value.kind === 'arr') {
        p.value.items.forEach(tier => {
          if (tier.kind === 'arr' && tier.items[0] && tier.items[0].kind === 'str') emitParsed(tier.items[0], 'item', '', true);
        });
      } else walk(p.value, ctx);
    });
    return;
  }
  if (shape === 'pairs') {
    node.props.forEach(p => walk(p.value, ctx));
    return;
  }
  if (shape === 'docs') {
    node.props.forEach(p => walk(p.value, Object.assign({}, ctx, { speaker: who(p.key) })));
    return;
  }

  /* copy, scenes, and the default: named fields, plus scene slides anywhere. */
  const by = propStr(node, 'by') || propStr(node, 'who');
  const title = propStr(node, 'title');
  const name = propStr(node, 'n');
  const speaker = by || ctx.speaker || '';
  const known = shape === 'copy';
  for (const p of node.props) {
    if (p.key === 'text' || p.key === 'title') {
      const sp = p.key === 'text' ? (title || speaker) : '';
      emitParsed(p.value, 'scene', sp, false);
      continue;
    }
    if (p.key === 'intro') {
      emitParsed(p.value, 'dialog', name || speaker, false);
      continue;
    }
    if (known && COPY_KEYS.has(p.key)) {
      const surface = KEY_SURF[p.key] || ctx.surface;
      const sp = (p.key === 'fl' || p.key === 'sp') ? (name || speaker) : (p.key === 'say' ? (name || speaker) : speaker);
      if (p.key === 'tiers') continue;
      walk(p.value, { shape: 'lines', surface, speaker: sp, loose: false, emit: true });
      continue;
    }
    if (known && p.key === 'tiers' && p.value.kind === 'arr') {
      p.value.items.forEach(tier => {
        if (tier.kind === 'arr' && tier.items[0]) emitParsed(tier.items[0], 'item', '', true);
      });
      continue;
    }
    if (p.value && (p.value.kind === 'obj' || p.value.kind === 'arr' || p.value.kind === 'fn' || p.value.kind === 'alts')) {
      walk(p.value, Object.assign({}, ctx, { speaker }));
    }
  }
}

function harvestBinding(name, node) {
  if (!node) return;
  const spec = BIND[name];
  if (!spec) {
    walk(node, { shape: 'scenes', surface: 'scene', speaker: '', loose: false, emit: false });
    return;
  }
  walk(node, {
    shape: spec.shape,
    surface: spec.surface,
    speaker: spec.speaker || '',
    loose: spec.shape === 'loose',
    emit: spec.shape === 'loose' || spec.shape === 'lines'
  });
}

/* ---------- HTML text nodes inside templates ---------- */
function htmlTexts(parts) {
  let html = '';
  const holes = [];
  let tagged = false;
  for (const p of parts) {
    if (p.e != null) {
      holes.push(p);
      html += '\u0000' + (holes.length - 1) + '\u0000';
    } else {
      if (/<(?:h[1-6]|p|button|div|span|table|tr|td|th|ul|li|em|strong|b|i|small|br|label|textarea|a)\b/i.test(p.t || '')) tagged = true;
      html += p.t || '';
    }
  }
  if (!tagged) return [];
  const out = [];
  const attr = /(?:placeholder|title|alt|aria-label)\s*=\s*"([^"]*)"/gi;
  let am;
  while ((am = attr.exec(html))) {
    const raw = am[1].replace(/\u0000(\d+)\u0000/g, (_, n) => '{' + collapse(holes[+n].e) + '}');
    const used = [];
    am[1].replace(/\u0000(\d+)\u0000/g, (_, n) => { used.push(holes[+n]); return ''; });
    if (raw.trim()) out.push({ text: raw.trim(), holes: used });
  }
  const chunks = html.split(/<[^>]*>/);
  for (const ch of chunks) {
    const raw = ch.replace(/\u0000(\d+)\u0000/g, (_, n) => '{' + collapse(holes[+n].e) + '}');
    const trimmed = raw.replace(/\s+/g, ' ').trim();
    if (!trimmed) continue;
    const used = [];
    ch.replace(/\u0000(\d+)\u0000/g, (_, n) => { used.push(holes[+n]); return ''; });
    out.push({ text: trimmed, holes: used });
  }
  return out;
}

function takeHtml(toks, surface) {
  for (const t of toks) {
    if (t.type !== 'tmpl' || !t.parts) continue;
    for (const chunk of htmlTexts(t.parts)) {
      const fake = strNode(chunk.text, t.line, t.col, 0, chunk.holes.map(h => ({ src: h.e, line: h.line, col: h.col })));
      /* Give each chunk a stable column based on its text, since many share the template's column. */
      fake.col = t.col + rows.length % 1;
      fake.col = t.col;
      emitParsed(fake, surface, '', false);
    }
  }
}

/* ---------- calls ---------- */
function splitArgs(toks, i) {
  /* i points at the first token inside the paren, or at the closing paren.
     Only punctuation brackets count. A string whose text is ")" is not a closer. */
  const args = [];
  let start = i, j = i;
  const stack = [];
  while (j < toks.length) {
    const t = toks[j];
    const v = t.value;
    if (t.type === 'punct' && (v === '(' || v === '[' || v === '{')) stack.push(v);
    else if (t.type === 'punct' && (v === ')' || v === ']' || v === '}')) {
      const open = v === ')' ? '(' : v === ']' ? '[' : '{';
      if (!stack.length) {
        if (v === ')') { if (j > start) args.push([start, j]); return args; }
        break;
      }
      if (stack[stack.length - 1] === open) stack.pop();
      else break;
    } else if (t.type === 'punct' && v === ',' && !stack.length) {
      if (j > start) args.push([start, j]);
      start = j + 1;
    }
    j++;
  }
  return args;
}

function argNode(toks, src, span) {
  if (!span) return null;
  return parseSpan(toks, src, span[0], span[1]);
}

function plainSpeaker(node) {
  if (node && node.kind === 'str' && node.text && !node.holes.length && !/[{|]/.test(node.text) && node.text.length <= 80) return node.text;
  return '';
}

function takeCalls(toks, src) {
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    if (t.type !== 'ident' || !toks[i + 1] || toks[i + 1].value !== '(') continue;
    if (toks[i - 1] && toks[i - 1].value === 'function') continue;
    const name = t.value;
    if (name !== 'toast' && name !== 'float' && name !== 'dlg' && name !== 'chk' && name !== 'playScene' && name !== 'fillText' && name !== 'addAdopt' && name !== 'mktNews') continue;
    const args = splitArgs(toks, i + 2);
    if (name === 'toast') {
      emitParsed(argNode(toks, src, args[0]), 'toast', '', false);
    } else if (name === 'float') {
      emitParsed(argNode(toks, src, args[2]), 'toast', '', false);
    } else if (name === 'chk') {
      emitParsed(argNode(toks, src, args[2]), 'sheet', '', false);
    } else if (name === 'fillText') {
      const n = argNode(toks, src, args[0]);
      if (n && n.kind === 'str' && !n.holes.length) emitParsed(n, 'scene', '', false);
    } else if (name === 'addAdopt') {
      emitParsed(argNode(toks, src, args[1]), 'toast', '', false);
    } else if (name === 'mktNews') {
      emitParsed(argNode(toks, src, args[1]), 'sheet', '', false);
    } else if (name === 'dlg') {
      const title = argNode(toks, src, args[0]);
      const body = argNode(toks, src, args[1]);
      const btns = argNode(toks, src, args[2]);
      const sp = plainSpeaker(title);
      emitParsed(title, 'dialog', '', false);
      emitParsed(body, 'dialog', sp, false);
      emitButtons(btns, sp);
    } else if (name === 'playScene') {
      walk(argNode(toks, src, args[0]), { shape: 'scenes', surface: 'scene', speaker: '', emit: false });
    }
  }
}

function emitButtons(node, speaker) {
  if (!node) return;
  if (node.kind === 'alts') { node.items.forEach(n => emitButtons(n, speaker)); return; }
  if (node.kind === 'fn') return;
  if (node.kind === 'str') { emitParsed(node, 'dialog', speaker, false); return; }
  if (node.kind !== 'arr') return;
  const first = node.items[0];
  const second = node.items[1];
  if (first && (first.kind === 'str' || first.kind === 'alts') && (!second || second.kind === 'fn' || second.kind === 'skip' || second.kind === 'str')) {
    /* A button pair, or a one-label button. A list of buttons has arrays as items. */
    if (first.kind !== 'arr') {
      emitParsed(first, 'dialog', speaker, false);
      return;
    }
  }
  node.items.forEach(n => emitButtons(n, speaker));
}

/* ---------- bindings ---------- */
function takeBindings(toks, src) {
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    if ((t.value === 'const' || t.value === 'let' || t.value === 'var') && toks[i + 1] && toks[i + 1].type === 'ident') {
      let j = i + 1;
      while (j < toks.length) {
        if (toks[j].type !== 'ident') break;
        const name = toks[j].value;
        j++;
        if (toks[j] && toks[j].value === '=') {
          const span = valueSpan(toks, j + 1);
          harvestBinding(name, parseSpan(toks, src, span[0], span[1]));
          j = span[1];
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
        for (let a = 1; a < args.length; a++) harvestBinding(first.value, parseSpan(toks, src, args[a][0], args[a][1]));
      }
      continue;
    }
    if (t.type === 'ident' && (!toks[i - 1] || (toks[i - 1].value !== '.' && toks[i - 1].value !== 'function' && toks[i - 1].value !== 'const' && toks[i - 1].value !== 'let' && toks[i - 1].value !== 'var'))) {
      const path = [t.value];
      let j = i;
      while (toks[j + 1] && (toks[j + 1].value === '.' || toks[j + 1].value === '?.') && toks[j + 2] && toks[j + 2].type === 'ident') {
        path.push(toks[j + 2].value);
        j += 2;
      }
      if (toks[j + 1] && toks[j + 1].value === '=' && path.length >= 1) {
        const span = valueSpan(toks, j + 2);
        const root = path[0];
        const last = path[path.length - 1];
        if (path.length === 1) harvestBinding(root, parseSpan(toks, src, span[0], span[1]));
        else if (last === 'textContent') {
          emitParsed(parseSpan(toks, src, span[0], span[1]), 'sheet', '', false);
        } else if (last === 'innerHTML') {
          const n = parseSpan(toks, src, span[0], span[1]);
          emitParsed(n, 'sheet', '', false);
        } else if (BIND[root] && COPY_KEYS.has(last)) {
          const spec = BIND[root];
          const surface = KEY_SURF[last] || spec.surface;
          emitParsed(parseSpan(toks, src, span[0], span[1]), surface, spec.speaker || '', spec.shape === 'loose');
        } else if (BIND[root] && path.length === 2) {
          /* GOSSIP.nonce = [...], ET.bull = {...} */
          harvestBinding(root, { kind: 'obj', props: [{ key: path[1], value: parseSpan(toks, src, span[0], span[1]), line: t.line, col: t.col }] });
        } else {
          walk(parseSpan(toks, src, span[0], span[1]), { shape: 'scenes', surface: 'scene', speaker: '', emit: false });
        }
        i = span[1];
        continue;
      }
      if (toks[j + 1] && toks[j + 1].value === '.' && toks[j + 2] && toks[j + 2].value === 'push' && toks[j + 3] && toks[j + 3].value === '(') {
        const root = path[0];
        const args = splitArgs(toks, j + 4);
        if (BIND[root] || root === 'ZONES' || root === 'MEMOS' || root === 'UNI' || root === 'QRW') {
          args.forEach(sp => harvestBinding(root, parseSpan(toks, src, sp[0], sp[1])));
        }
        continue;
      }
    }
  }
}

/* ---------- files ---------- */
function srcFiles() {
  return fs.readdirSync(SRC)
    .filter(f => /^p\d+\.js$/.test(f))
    .sort((a, b) => (+a.slice(1) - +b.slice(1)) || a.localeCompare(b));
}

function cell(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\n/g, '\\n');
}

function writeLedger() {
  rows.sort((a, b) => (+a.file.slice(1) - +b.file.slice(1)) || a.line - b.line || a.col - b.col || a.surface.localeCompare(b.surface) || a.text.localeCompare(b.text));
  const counts = {};
  for (const s of SURFACES) counts[s] = 0;
  for (const r of rows) counts[r.surface]++;
  const tally = SURFACES.map(s => s + ' ' + counts[s]).join(', ');
  const lines = [];
  lines.push('# Copy ledger');
  lines.push('');
  lines.push('Generated by `node tools/copy-ledger.js`. The script reads `src/p*.js` and does not edit `src/`. `dist/` is not a source. `src/p0.html` is the page shell and is not part of this corpus.');
  lines.push('');
  lines.push('Every row is tagged `unread`. The tag is a column for a later pass. It is not a change to the game. No string in `src/` was rewritten for this ledger.');
  lines.push('');
  lines.push('A dynamic string is one row, with each interpolation written as `{expression}`. The expression is source text, not a value. A newline inside a cell is the two characters `\\n`.');
  lines.push('');
  lines.push('Surfaces: tooltip, toast, dialog, gossip, quest, scene, sheet, item, multiplayer. Combat float text is filed under toast. Strings in `src/p13.js` are filed under multiplayer. Shrine names are toast, because that is where the game shows them.');
  lines.push('');
  lines.push(rows.length + ' rows. ' + tally + '.');
  lines.push('');
  lines.push('| file | line | surface | speaker | tag | text |');
  lines.push('|---|---:|---|---|---|---|');
  for (const r of rows) {
    lines.push('| ' + [r.file, r.line, r.surface, cell(r.speaker), r.tag, cell(r.text)].join(' | ') + ' |');
  }
  lines.push('');
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, lines.join('\n'));
  return rows.length;
}

function main() {
  for (const file of srcFiles()) {
    CUR = file;
    const src = fs.readFileSync(path.join(SRC, file), 'utf8');
    const toks = lex(src);
    takeCalls(toks, src);
    takeBindings(toks, src);
    takeHtml(toks, file === 'p13.js' ? 'multiplayer' : 'sheet');
  }
  const n = writeLedger();
  process.stdout.write(n + ' rows → ' + path.relative(ROOT, OUT) + '\n');
}

if (require.main === module) main();
