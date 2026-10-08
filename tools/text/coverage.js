#!/usr/bin/env node
'use strict';
/* Flag string literals on UI-rendering paths that GAME-TEXT.md does not cover.
   This is a fresh scan. It does not trust the exporter's own covered-set.

   node tools/text/coverage.js
*/
const fs = require('fs');
const path = require('path');
const E = require('./engine');

const ROOT = path.join(__dirname, '..', '..');
const CATALOG = path.join(ROOT, 'text', 'catalog.json');
const CALLS = Object.assign(Object.create(null), {
  toast: [0], sys: [0], fail: [1], float: [2], fillText: [0], bubble: [2], dlg: [0, 1, 2]
});

function splitArgs(toks, i) {
  const args = [];
  let start = i, j = i, stack = [];
  while (j < toks.length) {
    const v = toks[j].value;
    const punct = toks[j].type === 'punct';
    if (punct && (v === '(' || v === '[' || v === '{')) stack.push(v);
    else if (punct && (v === ')' || v === ']' || v === '}')) {
      const open = v === ')' ? '(' : v === ']' ? '[' : '{';
      if (!stack.length) {
        if (v === ')' && j > start) args.push([start, j]);
        break;
      }
      if (stack[stack.length - 1] === open) stack.pop();
      else break;
    } else if (punct && v === ',' && !stack.length) {
      if (j > start) args.push([start, j]);
      start = j + 1;
    }
    j++;
  }
  return args;
}

function loadCatalog() {
  const cat = JSON.parse(fs.readFileSync(CATALOG, 'utf8'));
  const by = {};
  for (const e of cat.entries) (by[e.file] || (by[e.file] = [])).push(e);
  for (const f of Object.keys(by)) by[f].sort((a, b) => a.start - b.start);
  return by;
}

function covered(list, from, to) {
  if (!list) return false;
  let lo = 0, hi = list.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (list[mid].end <= from) lo = mid + 1;
    else hi = mid - 1;
  }
  for (let i = lo; i < list.length && list[i].start < to; i++) {
    if (from >= list[i].start && to <= list[i].end) return true;
  }
  return false;
}

function consider(hits, rel, src, list, tok, where) {
  if (tok.type !== 'str' && tok.type !== 'tmpl') return;
  const fake = {
    kind: 'str',
    from: tok.from, to: tok.to, line: tok.line,
    style: tok.quote === '`' ? 'template' : tok.quote === '"' ? 'double' : 'single',
    parts: tok.parts
  };
  const html = (tok.parts || []).some(p => p.t && /<[a-zA-Z]/.test(p.t));
  if (html) {
    const bits = E.htmlPieces(src, tok.parts);
    if (bits.length) {
      for (const b of bits) {
        const view = E.present(b);
        if (!view || !E.isPlayerFacing(view.text) || E.isJunk(view.text)) continue;
        if (covered(list, view.from, view.to)) continue;
        hits.push({ file: rel, line: tok.line, where, text: view.text });
      }
      return;
    }
  }
  if (covered(list, tok.from, tok.to)) return;
  const view = E.present(fake);
  if (!view || !E.isPlayerFacing(view.text) || E.isJunk(view.text)) return;
  hits.push({ file: rel, line: tok.line, where, text: view.text });
}

function scanJs(rel, by, hits) {
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  E.setSource(src);
  const toks = E.lex(src);
  const list = by[rel] || [];
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    if (t.type === 'ident' && CALLS[t.value] && toks[i + 1] && toks[i + 1].value === '(') {
      if (toks[i - 1] && toks[i - 1].value === 'function') continue;
      const args = splitArgs(toks, i + 2);
      for (const ai of CALLS[t.value]) {
        const sp = args[ai];
        if (!sp) continue;
        for (let k = sp[0]; k < sp[1]; k++) consider(hits, rel, src, list, toks[k], t.value);
      }
    }
    if (t.type === 'ident' && (t.value === 'textContent' || t.value === 'innerHTML' || t.value === 'placeholder') && toks[i + 1] && toks[i + 1].value === '=') {
      const end = (() => {
        let j = i + 2, stack = [];
        while (j < toks.length) {
          const v = toks[j].value;
          if (toks[j].type === 'punct' && (v === '(' || v === '[' || v === '{')) stack.push(v);
          else if (toks[j].type === 'punct' && (v === ')' || v === ']' || v === '}')) {
            if (!stack.length) break;
            stack.pop();
          } else if (toks[j].type === 'punct' && (v === ';' || v === ',') && !stack.length) break;
          j++;
        }
        return j;
      })();
      for (let k = i + 2; k < end; k++) consider(hits, rel, src, list, toks[k], t.value);
    }
  }
}

function scanHtml(by, hits) {
  const rel = 'src/p0.html';
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const masked = src.replace(/<style\b[\s\S]*?<\/style>/gi, m => m.replace(/[^\n]/g, ' ')).replace(/<script\b[\s\S]*?<\/script>/gi, m => m.replace(/[^\n]/g, ' '));
  const pieces = E.htmlPieces(masked, [{ t: masked, from: 0, to: masked.length }]);
  const list = by[rel] || [];
  for (const p of pieces) {
    const view = E.present(p);
    if (!view || !E.isPlayerFacing(view.text) || E.isJunk(view.text)) continue;
    if (covered(list, view.from, view.to)) continue;
    hits.push({ file: rel, line: src.slice(0, view.from).split('\n').length, where: 'html', text: view.text });
  }
}

function main() {
  if (!fs.existsSync(CATALOG)) {
    process.stderr.write('missing text/catalog.json — run node tools/text/export.js first\n');
    process.exit(2);
  }
  const by = loadCatalog();
  const hits = [];
  const js = [
    'src/formulas.js', 'src/p1.js', 'src/p2.js', 'src/p5.js', 'src/p6.js', 'src/p7.js', 'src/p8.js', 'src/p9.js',
    'src/p10.js', 'src/p11.js', 'src/p3.js', 'src/p4.js', 'src/p12.js', 'src/p13.js', 'server/server.js'
  ];
  for (const n of fs.readdirSync(path.join(ROOT, 'server/lib'))) {
    if (n.endsWith('.js') && !['guard.js', 'admin.js', 'plaus.js'].includes(n)) js.push('server/lib/' + n);
  }
  for (const f of js) scanJs(f, by, hits);
  scanHtml(by, hits);
  const seen = new Set();
  const uniq = [];
  for (const h of hits) {
    const k = h.file + ':' + h.line + ':' + h.text;
    if (seen.has(k)) continue;
    seen.add(k);
    uniq.push(h);
  }
  process.stdout.write('uncovered candidates: ' + uniq.length + '\n');
  for (const h of uniq.slice(0, 40)) {
    process.stdout.write('  ' + h.file + ':' + h.line + ' (' + h.where + ') ' + JSON.stringify(h.text).slice(0, 140) + '\n');
  }
  if (uniq.length > 40) process.stdout.write('  … ' + (uniq.length - 40) + ' more\n');
}

if (require.main === module) main();
module.exports = { main };
