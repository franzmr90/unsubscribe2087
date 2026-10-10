'use strict';
/* Shared lexer, expression reader, placeholder names, and JS/HTML escaping
   for the game-text export and import. Offsets are JavaScript string indices
   into the file as read (UTF-16), which is what slice/replace use. */
const fs = require('fs');

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
      const from = i, l = line, c = col, q = ch;
      const r = readQuote(src, i, line, col);
      push('str', r.value, from, r.i, l, c, {
        quote: q,
        parts: [{ t: r.value, from: from + 1, to: r.i - 1 }]
      });
      i = r.i; line = r.line; col = r.col;
      continue;
    }
    if (ch === '`') {
      const from = i, l = line, c = col;
      const r = readTemplate(src, i, line, col);
      push('tmpl', null, from, r.i, l, c, { quote: '`', parts: r.parts });
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
  let bufFrom = i + 1;
  i++; col++;
  const flush = (endAt) => {
    parts.push({ t: buf, from: bufFrom, to: endAt });
    buf = '';
    bufFrom = endAt;
  };
  while (i < src.length) {
    if (src[i] === '\\') {
      const n = src[i + 1];
      if (n === 'n') buf += '\n';
      else if (n === 't') buf += '\t';
      else if (n === 'r') buf += '\r';
      else if (n === '`' || n === '\\' || n === '$') buf += n;
      else if (n === 'u' && /^[0-9a-fA-F]{4}/.test(src.slice(i + 2, i + 6))) {
        buf += String.fromCharCode(parseInt(src.slice(i + 2, i + 6), 16));
        i += 6; col += 6;
        continue;
      } else buf += n == null ? '' : n;
      if (n === '\n') { line++; col = 1; i += 2; continue; }
      i += 2; col += 2;
      continue;
    }
    if (src[i] === '`') {
      flush(i);
      i++; col++;
      return { parts, i, line, col };
    }
    if (src[i] === '$' && src[i + 1] === '{') {
      flush(i);
      const holeFrom = i;
      i += 2; col += 2;
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
      parts.push({ e: src.slice(start, i - 1), from: holeFrom, to: i });
      bufFrom = i;
      continue;
    }
    if (src[i] === '\n') { buf += '\n'; line++; col = 1; i++; continue; }
    buf += src[i]; i++; col++;
  }
  flush(i);
  return { parts, i, line, col };
}

function collapse(s) {
  return String(s).replace(/\s+/g, ' ').trim();
}

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

function strFromToken(t) {
  return {
    kind: 'str',
    from: t.from,
    to: t.to,
    line: t.line,
    col: t.col,
    style: t.quote === '`' ? 'template' : t.quote === '"' ? 'double' : 'single',
    parts: t.parts || [{ t: t.value || '', from: t.from + 1, to: t.to - 1 }]
  };
}

let CUR = '';
function setSource(src) { CUR = src || ''; }

function skipNode(toks, a, b) {
  const t = toks[a] || { line: 1, col: 1, from: 0, to: 0 };
  const endTok = toks[Math.max(a, b - 1)] || t;
  const from = t.from || 0;
  const to = endTok.to || from;
  const raw = CUR ? CUR.slice(from, to).trim() : '';
  return { kind: 'skip', end: b, from, to, line: t.line, col: t.col, src: raw, _i: a };
}

function readPrimary(toks, i, limit) {
  if (i >= limit || !toks[i]) return { kind: 'skip', end: i, from: 0, to: 0, src: '', line: 1, col: 1, _i: i };
  const t = toks[i];
  if (t.type === 'str' || t.type === 'tmpl') {
    const n = strFromToken(t);
    n.end = i + 1;
    n._i = i;
    return n;
  }
  if (t.value === '[') return readArray(toks, i, limit);
  if (t.value === '{') return readObject(toks, i, limit);
  if (t.value === '(') return readGroup(toks, i, limit);
  if (t.value === '...') {
    const inner = readPrimary(toks, i + 1, limit);
    return skipNode(toks, i, inner.end);
  }
  if (t.type === 'ident' && toks[i + 1] && toks[i + 1].value === '=>' && i + 1 < limit) {
    return readArrow(toks, i + 2, limit, t.line, t.col, t.from);
  }
  if (t.type === 'ident' || t.type === 'num') return spanAtom(toks, i, limit);
  if (t.value === 'function') return spanFunction(toks, i, limit);
  if (t.value === '!' || t.value === '~' || t.value === '-' || t.value === '+' || t.value === 'typeof' || t.value === 'void' || t.value === 'await' || t.value === 'new' || t.value === 'delete') {
    const inner = readPrimary(toks, i + 1, limit);
    return skipNode(toks, i, Math.max(inner.end, i + 1));
  }
  return skipNode(toks, i, i + 1);
}

function spanAtom(toks, i, limit) {
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
  return skipNode(toks, i, j);
}

function spanFunction(toks, i, limit) {
  let j = i + 1;
  if (toks[j] && toks[j].type === 'ident') j++;
  if (toks[j] && toks[j].value === '(') j = matchClose(toks, j, '(', ')', limit) + 1;
  if (toks[j] && toks[j].value === '{') j = matchClose(toks, j, '{', '}', limit) + 1;
  return { kind: 'fn', body: null, end: Math.min(j, limit), line: toks[i].line, col: toks[i].col, from: toks[i].from, to: (toks[j - 1] || toks[i]).to };
}

function readArrow(toks, i, limit, line, col, from) {
  if (toks[i] && toks[i].value === '{' && i < limit) {
    const end = matchClose(toks, i, '{', '}', limit) + 1;
    return { kind: 'fn', body: null, end, line, col, from, to: (toks[end - 1] || toks[i]).to };
  }
  const body = readTernary(toks, i, limit);
  return { kind: 'fn', body, end: body.end, line, col, from, to: body.to };
}

function readGroup(toks, i, limit) {
  const close = matchClose(toks, i, '(', ')', limit);
  if (toks[close + 1] && toks[close + 1].value === '=>') {
    return readArrow(toks, close + 2, limit, toks[i].line, toks[i].col, toks[i].from);
  }
  if (close === i + 1) return skipNode(toks, i, close + 1);
  const inner = readTernary(toks, i + 1, close);
  inner.end = close + 1;
  return inner;
}

function readArray(toks, i, limit) {
  const start = toks[i];
  let j = i + 1;
  const items = [];
  while (j < limit && toks[j] && toks[j].value !== ']') {
    if (toks[j].value === ',') { j++; continue; }
    const n = readTernary(toks, j, limit);
    if (n.end <= j) n.end = j + 1;
    items.push(n);
    j = n.end;
    if (toks[j] && toks[j].value === ',') j++;
  }
  const end = toks[j] && toks[j].value === ']' ? j + 1 : j;
  return { kind: 'arr', items, end, line: start.line, col: start.col, from: start.from, to: (toks[end - 1] || start).to };
}

function readObject(toks, i, limit) {
  const start = toks[i];
  let j = i + 1;
  const props = [];
  while (j < limit && toks[j] && toks[j].value !== '}') {
    if (toks[j].value === ',') { j++; continue; }
    if (toks[j].value === '...') {
      const n = readTernary(toks, j + 1, limit);
      j = Math.max(n.end, j + 2);
      continue;
    }
    if (toks[j].value === '[') {
      const c = matchClose(toks, j, '[', ']', limit);
      j = c + 1;
      if (toks[j] && toks[j].value === ':') {
        j++;
        const v = readTernary(toks, j, limit);
        j = Math.max(v.end, j + 1);
      }
      continue;
    }
    if (toks[j].type === 'ident' || toks[j].type === 'str' || toks[j].type === 'num') {
      const key = toks[j].type === 'str' ? toks[j].value : String(toks[j].value);
      const kl = toks[j].line, kc = toks[j].col, keyFrom = toks[j].from, keyTo = toks[j].to;
      const keyQuoted = toks[j].type === 'str';
      j++;
      if (toks[j] && toks[j].value === '(') {
        const c = matchClose(toks, j, '(', ')', limit);
        j = c + 1;
        if (toks[j] && toks[j].value === '{') j = matchClose(toks, j, '{', '}', limit) + 1;
        continue;
      }
      if (toks[j] && toks[j].value === ':') {
        j++;
        const v = readTernary(toks, j, limit);
        if (v.end <= j) v.end = j + 1;
        props.push({ key, value: v, line: kl, col: kc, keyFrom, keyTo, keyQuoted });
        j = v.end;
        continue;
      }
      props.push({ key, value: skipNode(toks, j - 1, j), line: kl, col: kc, keyFrom, keyTo, keyQuoted });
      continue;
    }
    j++;
  }
  const end = toks[j] && toks[j].value === '}' ? j + 1 : j;
  return { kind: 'obj', props, end, line: start.line, col: start.col, from: start.from, to: (toks[end - 1] || start).to };
}

const MUL = new Set(['*', '/', '%', '**']);
const CMP = new Set(['==', '===', '!=', '!==', '<', '>', '<=', '>=', 'in', 'instanceof']);

function readBinary(toks, i, limit, ops, next) {
  let node = next(toks, i, limit);
  if (node._i == null) node._i = i;
  while (node.end < limit && toks[node.end] && toks[node.end].type === 'punct' && ops.has(toks[node.end].value)) {
    const r = next(toks, node.end + 1, limit);
    if (r._i == null) r._i = node.end + 1;
    node = foldKeep(node, r, Math.max(r.end, node.end + 2));
  }
  return node;
}

function readMul(toks, i, limit) { return readBinary(toks, i, limit, MUL, readPrimary); }

function readPlus(toks, i, limit) {
  let node = readMul(toks, i, limit);
  if (node._i == null) node._i = i;
  while (node.end < limit && toks[node.end] && toks[node.end].type === 'punct' && toks[node.end].value === '+') {
    const r = readMul(toks, node.end + 1, limit);
    if (r.end <= node.end + 1 && toks[node.end + 1]) r.end = Math.min(limit, node.end + 2);
    node = joinPlus(node, r);
  }
  return node;
}

function readCmp(toks, i, limit) { return readBinary(toks, i, limit, CMP, readPlus); }
function readAnd(toks, i, limit) { return readBinary(toks, i, limit, new Set(['&&']), readCmp); }
function readOr(toks, i, limit) { return readBinary(toks, i, limit, new Set(['||', '??']), readAnd); }

function asParts(n) {
  if (!n) return [{ t: '' }];
  if (n.parts && n.kind === 'str') return n.parts;
  if (n.kind === 'str') return [{ t: '' }];
  return [{ e: n.src || '…', from: n.from, to: n.to }];
}

function joinPlus(a, b) {
  const parts = asParts(a).concat(asParts(b));
  const n = {
    kind: 'str',
    style: 'concat',
    parts,
    from: a.from,
    to: b.to,
    end: b.end,
    line: a.line,
    col: a.col,
    _i: a._i
  };
  return n;
}

/* * / and comparisons do not glue copy. Keep string pieces as separate alternatives. */
function foldKeep(left, right, end) {
  const items = [];
  const take = n => {
    if (!n) return;
    if (n.kind === 'alts') items.push(...n.items);
    else if (n.kind === 'str' || n.kind === 'fn') items.push(n);
  };
  take(left); take(right);
  if (!items.length) {
    const s = skipNode([], 0, 0);
    s.end = end;
    s.from = left.from;
    s.to = right.to;
    s._i = left._i;
    s.src = collapse((left.src || '') + ' ' + (right.src || ''));
    return s;
  }
  if (items.length === 1) {
    items[0].end = end;
    return items[0];
  }
  return { kind: 'alts', items, end, line: items[0].line, col: items[0].col, from: left.from, to: right.to, _i: left._i };
}

function readTernary(toks, i, limit) {
  const node = readOr(toks, i, limit);
  if (node.end < limit && toks[node.end] && toks[node.end].value === '?') {
    const a = readTernary(toks, node.end + 1, limit);
    if (toks[a.end] && toks[a.end].value === ':') {
      const b = readTernary(toks, a.end + 1, limit);
      const items = [];
      const push = n => { if (!n) return; if (n.kind === 'alts') items.push(...n.items); else items.push(n); };
      push(a); push(b);
      const strings = items.filter(n => n.kind === 'str' || n.kind === 'fn');
      if (strings.length) return { kind: 'alts', items: strings, end: b.end, line: a.line, col: a.col, from: a.from, to: b.to };
    }
  }
  return node;
}

function prop(obj, key) {
  if (!obj || obj.kind !== 'obj') return null;
  return obj.props.find(p => p.key === key) || null;
}

function plain(node) {
  if (!node) return '';
  if (node.kind === 'fn') return plain(node.body);
  if (node.kind !== 'str' || !node.parts) return '';
  if (node.parts.some(p => p.e != null)) return '';
  return node.parts.map(p => p.t || '').join('');
}

/* ---------- placeholders ---------- */
const HOLE_RULES = [
  [/pct\s*\(/, 'percent'],
  [/toFixed/, 'number'],
  [/\.name\b|Name\b/, 'name'],
  [/sats|SATS/, 'sats'],
  [/fmt\s*\(/, 'credits'],
  [/zone/i, 'district'],
  [/diff/i, 'difficulty'],
  [/\blvl\b|\.lvl|level/i, 'level'],
  [/\bcls\b|class/i, 'class'],
  [/\bhp\b|life/i, 'life'],
  [/\bL\b/, 'rank']
];

function holeName(expr, used) {
  const e = String(expr).replace(/\s+/g, '');
  let base = 'value';
  for (const [re, n] of HOLE_RULES) if (re.test(e)) { base = n; break; }
  if (/^pct\(/.test(e)) base = 'percent';
  let name = base, i = 2;
  while (used.has(name)) { name = base + '_' + i; i++; }
  used.add(name);
  return name;
}

function explainHole(name, expr) {
  if (!expr) {
    if (name === 'v') return '{v} is the rolled number on this item. Leave it in the line.';
    return '{' + name + '} is filled in by the game. Leave it exactly as written.';
  }
  const e = collapse(expr);
  if (/^pct\s*\(/.test(e)) return '{' + name + '} is a percent that changes with the skill rank (' + e + ').';
  if (/\bL\b/.test(e) && e.length < 40) return '{' + name + '} is a number that changes with the skill rank (' + e + ').';
  if (/name/i.test(e)) return '{' + name + '} is a name (' + e + ').';
  if (/sats/i.test(e)) return '{' + name + '} is an amount of sats (' + e + ').';
  if (/fmt\s*\(/.test(e)) return '{' + name + '} is a credit amount, already formatted (' + e + ').';
  if (/zone/i.test(e)) return '{' + name + '} is a district name (' + e + ').';
  return '{' + name + '} is filled in when the line is shown (' + e + ').';
}

const PH_RE = /\{([A-Za-z_][A-Za-z0-9_]*)\}/g;

function present(node) {
  if (!node || node.kind !== 'str' || !node.parts) return null;
  const reserved = new Set();
  for (const p of node.parts) {
    if (p.e != null || !p.t) continue;
    PH_RE.lastIndex = 0;
    let m;
    while ((m = PH_RE.exec(p.t))) reserved.add(m[1]);
  }
  const used = new Set(reserved);
  const placeholders = [];
  let text = '';
  for (const p of node.parts) {
    if (p.e != null) {
      const name = holeName(p.e, used);
      placeholders.push({ name, expr: String(p.e).trim(), literal: false });
      text += '{' + name + '}';
    } else {
      text += p.t || '';
    }
  }
  PH_RE.lastIndex = 0;
  const js = new Set(placeholders.map(h => h.name));
  const ordered = [];
  let m;
  const re = /\{([A-Za-z_][A-Za-z0-9_]*)\}/g;
  const queues = {};
  for (const h of placeholders) (queues[h.name] ||= []).push(h);
  while ((m = re.exec(text))) {
    if (js.has(m[1]) && queues[m[1]] && queues[m[1]].length) ordered.push(queues[m[1]].shift());
    else ordered.push({ name: m[1], expr: null, literal: true });
  }
  return { text, placeholders: ordered, style: node.style, from: node.from, to: node.to, line: node.line, col: node.col };
}

function countsOf(text) {
  const c = {};
  const re = /\{([A-Za-z_][A-Za-z0-9_]*)\}/g;
  let m;
  while ((m = re.exec(String(text)))) c[m[1]] = (c[m[1]] || 0) + 1;
  return c;
}

function placeholderDrift(original, next) {
  const a = countsOf(original), b = countsOf(next);
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  const removed = [], added = [];
  for (const k of keys) {
    const d = (b[k] || 0) - (a[k] || 0);
    if (d < 0) removed.push('{' + k + '}');
    if (d > 0) added.push('{' + k + '}');
  }
  if (!removed.length && !added.length) return null;
  const bits = [];
  if (removed.length) bits.push('placeholder removed: ' + removed.join(', '));
  if (added.length) bits.push('placeholder added: ' + added.join(', '));
  return bits.join('; ');
}

function escTpl(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}
function quoteSingle(s) {
  return "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029') + "'";
}
function quoteDouble(s) {
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029') + '"';
}

function fillHoles(text, placeholders, escStatic) {
  const queues = {};
  for (const h of placeholders || []) (queues[h.name] ||= []).push(h);
  let out = '';
  const re = /\{([A-Za-z_][A-Za-z0-9_]*)\}/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    out += escStatic(text.slice(last, m.index));
    const h = (queues[m[1]] || []).shift();
    if (h && h.expr) out += '${' + h.expr + '}';
    else out += escStatic(m[0]);
    last = m.index + m[0].length;
  }
  out += escStatic(text.slice(last));
  return out;
}

function escHtmlText(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escHtmlAttr(s) {
  return escHtmlText(s).replace(/"/g, '&quot;');
}

/* Rewrite one catalog entry's source slice. Returns the new slice, or an error string. */
function encode(entry, text) {
  const why = placeholderDrift(entry.text, text);
  if (why) return { error: why };
  if (entry.singleLine && /[\r\n]/.test(text)) return { error: 'this line has to stay on one line' };
  if (entry.hardMax != null && Array.from(text).length > entry.hardMax) {
    return { error: 'longer than the ' + entry.hardMax + '-character limit (' + Array.from(text).length + ')' };
  }
  const style = entry.style;
  let slice;
  if (style === 'single') slice = quoteSingle(text);
  else if (style === 'double') slice = quoteDouble(text);
  else if (style === 'template' || style === 'concat') slice = '`' + fillHoles(text, entry.placeholders, escTpl) + '`';
  else if (style === 'html-text') slice = escHtmlText(text);
  else if (style === 'html-attr') slice = escHtmlAttr(text);
  else if (style === 'tpl-text') slice = fillHoles(text, entry.placeholders, s => escTpl(escHtmlText(s)));
  else if (style === 'tpl-attr') slice = fillHoles(text, entry.placeholders, s => escTpl(escHtmlAttr(s)));
    else if (style === 'tpl-raw') slice = fillHoles(text, entry.placeholders, escTpl);
    else if (style === 'raw') slice = text;
    else if (style === 'ident') {
      if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(text)) return { error: 'this has to stay one word: letters, digits, and underscores' };
      slice = text;
    }
  else return { error: 'unknown string style ' + style };
  return { slice };
}

/* ---------- what counts as player-facing ---------- */
/* Code, markup, and bare placeholders are not lines a writer should edit. */
function isJunk(text) {
  const s = String(text == null ? '' : text);
  if (s.length > 5000) return true;
  if (/\$\{/.test(s)) return true;
  /* Placeholders are not code. {class} is a name the game fills in. */
  const bare = s.replace(/\{[A-Za-z_][A-Za-z0-9_]*\}/g, ' ').trim();
  if (/=>/.test(bare)) return true;
  if (/\b(function|const|let|var|return|typeof|document|querySelector)\b/.test(bare) && /[;{}()]/.test(bare)) return true;
  if (/<\/?[a-zA-Z][^>\n]{0,80}>/.test(bare)) return true;
  if (/\b(class|style|onclick|onchange|xmlns|viewBox|stroke-width|stroke=|fill=|data-|aria-)\s*=/.test(bare)) return true;
  if (/\b(SELECT|INSERT|UPDATE|DELETE|CREATE TABLE|PRIMARY KEY)\b/.test(bare)) return true;
  if (/px\b/.test(bare) && /serif|sans-serif|monospace|Cinzel|Spectral|font/i.test(bare)) return true;
  if (/Content-Type:|MIME-Version:|Content-Transfer-Encoding:|Content-Disposition:/.test(s)) return true;
  if (/^HTTP\/1\.[01] /.test(s)) return true;
  if (/^\{[A-Za-z_][A-Za-z0-9_]*\}$/.test(s.trim())) return true;
  if (!/[A-Za-z]/.test(bare)) return true;
  return false;
}

function isPlayerFacing(text) {
  if (text == null) return false;
  const s = String(text);
  if (!/[A-Za-z]/.test(s)) return false;
  if (/^#[0-9a-fA-F]{3,8}$/.test(s)) return false;
  if (/^rgba?\(/i.test(s)) return false;
  if (/^https?:\/\//i.test(s)) return false;
  if (/^data:/.test(s)) return false;
  if (/^[a-z][a-z0-9_./:-]*$/.test(s)) return false;
  if (/^[\w.+-]+\/[\w.+-]+$/.test(s)) return false;
  if (/^#[A-Za-z0-9_-]+$/.test(s)) return false;
  if (s.length < 2) return false;
  if (/^[a-z0-9_]+$/.test(s)) return false;
  return true;
}

/* Sweep filter: sentences and labels, not CSS class lists. */
function looksLikeCopy(text) {
  if (!isPlayerFacing(text)) return false;
  const s = String(text).trim();
  if (/[A-Z]/.test(s)) return true;
  if (/[.!?]/.test(s)) return true;
  const words = s.split(/\s+/);
  if (words.length >= 3 && /[a-zA-Z]/.test(s)) return true;
  return false;
}

const COPY_KEYS = new Set([
  'n', 'd', 'tag', 'ab', 'fl', 'sp', 'base', 'b2', 'b3', 'rw', 'offer', 'label', 'how', 'perk',
  'note', 'say', 'intro', 'text', 'title', 'again', 'l', 'p'
]);
const UI_CALLS = new Set(['toast', 'dlg', 'float', 'fillText', 'bubble', 'sys', 'fail', 'uiSay']);

function decodeEntities(s) {
  return String(s).replace(/&mdash;|&ndash;|&amp;|&lt;|&gt;|&quot;|&#39;|&apos;|&nbsp;/g, m => ({
    '&mdash;': '\u2014', '&ndash;': '\u2013', '&amp;': '&', '&lt;': '<', '&gt;': '>',
    '&quot;': '"', '&#39;': "'", '&apos;': "'", '&nbsp;': ' '
  }[m]));
}

/* Text nodes and label attributes inside an HTML-ish string whose source is src[from,to)
   and whose decoded parts are `parts` (static t / hole e). Returns pieces with absolute offsets. */
function htmlPieces(src, parts) {
  if (!parts || !parts.length) return [];
  const decodedHasTag = parts.some(p => p.t && /<[a-zA-Z]/.test(p.t));
  if (!decodedHasTag) return [];
  /* Map decoded (with \u0001 for a hole) back to source only when every static
     part is escape-free, so offsets stay contiguous. */
  let decoded = '';
  const map = [];
  let clean = true;
  for (const p of parts) {
    if (p.e != null) {
      map.push({ hole: p });
      decoded += '\u0001';
    } else {
      const raw = src.slice(p.from, p.to);
      if (raw !== (p.t || '')) clean = false;
      for (let k = 0; k < (p.t || '').length; k++) {
        map.push({ at: p.from + k });
        decoded += p.t[k];
      }
    }
  }
  if (!clean) return [];
  const out = [];
  const take = (decStart, decEnd, kind) => {
    if (decEnd <= decStart) return;
    const slice = decoded.slice(decStart, decEnd);
    const shown = decodeEntities(slice.replace(/\u0001/g, '\u0000'));
    /* rebuild with placeholders later; here keep hole markers */
    const subParts = [];
    let buf = '';
    let bufAt = null;
    const flush = () => {
      if (buf) subParts.push({ t: decodeEntities(buf), from: bufAt, to: bufAt + buf.length });
      buf = ''; bufAt = null;
    };
    for (let k = decStart; k < decEnd; k++) {
      const m = map[k];
      if (m && m.hole) {
        flush();
        subParts.push({ e: m.hole.e, from: m.hole.from, to: m.hole.to });
      } else if (decoded[k] !== '\u0000') {
        if (bufAt == null) bufAt = m.at;
        buf += decoded[k];
      }
    }
    flush();
    const text = subParts.map(p => p.e != null ? '' : p.t).join('');
    if (!/[A-Za-z]/.test(text) && !subParts.some(p => p.e != null && /[A-Za-z]/.test(p.e))) return;
    const from = subParts[0] ? subParts[0].from : null;
    const to = subParts.length ? subParts[subParts.length - 1].to : null;
    if (from == null) return;
    const holes = subParts.some(p => p.e != null);
    out.push({
      kind: 'str',
      htmlSplit: true,
      style: holes ? (kind === 'attr' ? 'tpl-attr' : 'tpl-text') : (kind === 'attr' ? 'html-attr' : 'html-text'),
      parts: subParts,
      from, to,
      line: 0, col: 0
    });
  };
  const attr = /(?:placeholder|title|alt|aria-label)\s*=\s*"([^"]*)"/g;
  let m;
  while ((m = attr.exec(decoded))) take(m.index + m[0].indexOf('"') + 1, m.index + m[0].length - 1, 'attr');
  const tags = /<(?:script|style)\b[\s\S]*?<\/(?:script|style)>|<!--[\s\S]*?-->|<\/?[A-Za-z][^>]*>/g;
  let last = 0;
  let saw = false;
  while ((m = tags.exec(decoded))) {
    saw = true;
    take(last, m.index, 'text');
    last = m.index + m[0].length;
  }
  /* A bare `<` that never closes is not markup. Returning the whole string
     as a piece makes emit call htmlPieces again forever. */
  if (!saw) return out;
  take(last, decoded.length, 'text');
  return out;
}

function slug(s) {
  return String(s || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[''\u2019]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 48) || 'line';
}

function readFile(path) {
  return fs.readFileSync(path, 'utf8');
}

module.exports = {
  lex, setSource, readTernary, readPrimary, prop, plain, present, encode, placeholderDrift, explainHole,
  isPlayerFacing, looksLikeCopy, isJunk, COPY_KEYS, UI_CALLS, htmlPieces, slug, decodeEntities, readFile,
  countsOf, matchClose
};
