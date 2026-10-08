#!/usr/bin/env node
'use strict';
/* Put an edited game-text document back into the source.
   Matches each ID to text/catalog.json, replaces the recorded slice when the
   text changed, and refuses drift, placeholder edits, and hard length limits.

   node tools/text/import.js text/GAME-TEXT.md
   node tools/text/import.js text/GAME-TEXT.docx --dry-run
   node tools/text/import.js notes/from-docs.txt
*/
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const E = require('./engine');

const ROOT = path.join(__dirname, '..', '..');
const CATALOG = path.join(ROOT, 'text', 'catalog.json');
const PANDOC_MD = 'markdown-smart-tex_math_dollars-tex_math_single_backslash';

function usage() {
  process.stderr.write('usage: node tools/text/import.js <file.md|file.docx|file.txt> [--dry-run]\n');
  process.exit(2);
}

function loadText(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === '.docx') {
    return execFileSync('pandoc', ['-f', 'docx', '-t', PANDOC_MD, '--wrap=none', file], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  }
  return fs.readFileSync(file, 'utf8');
}

/* TEXT ... END. Indented code (four spaces) is unindented. A fence is unwrapped.
   Blank separator lines around the block are not part of the text. */
function readBlock(lines) {
  if (lines.length && lines[0] === '') lines = lines.slice(1);
  if (lines.length && lines[lines.length - 1] === '') lines = lines.slice(0, -1);
  if (lines.length && /^```/.test(lines[0])) {
    lines = lines.slice(1);
    if (lines.length && /^```/.test(lines[lines.length - 1])) lines = lines.slice(0, -1);
    return lines.join('\n');
  }
  const content = lines.filter(l => l !== '');
  if (content.length && content.every(l => l.startsWith('    '))) {
    lines = lines.map(l => l.startsWith('    ') ? l.slice(4) : l);
  }
  return lines.join('\n');
}

function parseEntries(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const m = /^ID:\s*(\S+)\s*$/.exec(lines[i]);
    if (!m) { i++; continue; }
    const id = m[1];
    let textAt = -1;
    for (let j = i + 1; j < lines.length; j++) {
      if (/^ID:\s*\S+/.test(lines[j])) break;
      if (lines[j] === 'TEXT') { textAt = j; break; }
    }
    if (textAt < 0) {
      out.push({ id, error: 'no TEXT block' });
      i++;
      continue;
    }
    const body = [];
    let k = textAt + 1;
    let closed = false;
    for (; k < lines.length; k++) {
      if (lines[k] === 'END') { closed = true; break; }
      if (/^ID:\s*\S+/.test(lines[k])) break;
      body.push(lines[k]);
    }
    if (!closed) out.push({ id, error: 'TEXT block was not closed with END' });
    else out.push({ id, text: readBlock(body) });
    i = closed ? k + 1 : k;
  }
  return out;
}

function main() {
  const args = process.argv.slice(2);
  const dry = args.includes('--dry-run');
  const file = args.find(a => !a.startsWith('-'));
  if (!file) usage();
  const abs = path.resolve(file);
  if (!fs.existsSync(abs)) {
    process.stderr.write('no such file: ' + file + '\n');
    process.exit(2);
  }
  if (!fs.existsSync(CATALOG)) {
    process.stderr.write('missing text/catalog.json — run node tools/text/export.js first\n');
    process.exit(2);
  }
  const catalog = JSON.parse(fs.readFileSync(CATALOG, 'utf8'));
  const byId = new Map(catalog.entries.map(e => [e.id, e]));
  const parsed = parseEntries(loadText(abs));
  const seen = new Set();
  const skipped = [];
  const edits = [];
  let unchanged = 0;

  for (const p of parsed) {
    if (seen.has(p.id)) { skipped.push({ id: p.id, why: 'duplicate ID in the document' }); continue; }
    seen.add(p.id);
    if (p.error) { skipped.push({ id: p.id, why: p.error }); continue; }
    const cat = byId.get(p.id);
    if (!cat) { skipped.push({ id: p.id, why: 'unknown ID' }); continue; }
    if (p.text === cat.text || p.text.trim() === cat.text.trim()) { unchanged++; continue; }
    const driftPh = E.placeholderDrift(cat.text, p.text);
    if (driftPh) { skipped.push({ id: p.id, why: driftPh }); continue; }
    if (cat.singleLine && /[\r\n]/.test(p.text)) { skipped.push({ id: p.id, why: 'this line has to stay on one line' }); continue; }
    if (cat.hardMax != null && Array.from(p.text).length > cat.hardMax) {
      skipped.push({ id: p.id, why: 'longer than the ' + cat.hardMax + '-character limit (' + Array.from(p.text).length + ')' });
      continue;
    }
    const enc = E.encode(cat, p.text);
    if (enc.error) { skipped.push({ id: p.id, why: enc.error }); continue; }
    edits.push({ cat, slice: enc.slice, text: p.text });
  }

  const srcs = {};
  const read = rel => {
    if (!srcs[rel]) srcs[rel] = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    return srcs[rel];
  };
  const ok = [];
  for (const ed of edits) {
    const src = read(ed.cat.file);
    if (src.slice(ed.cat.start, ed.cat.end) !== ed.cat.raw) {
      skipped.push({ id: ed.cat.id, why: 'the source has changed since the document was exported (' + ed.cat.file + ' line ' + ed.cat.line + ')' });
      continue;
    }
    ok.push(ed);
  }

  ok.sort((a, b) => a.cat.file === b.cat.file ? a.cat.start - b.cat.start : a.cat.file.localeCompare(b.cat.file));
  const drop = new Set();
  for (let i = 1; i < ok.length; i++) {
    const p = ok[i - 1], c = ok[i];
    if (p.cat.file === c.cat.file && c.cat.start < p.cat.end) {
      drop.add(p.cat.id); drop.add(c.cat.id);
    }
  }
  const apply = [];
  for (const ed of ok) {
    if (drop.has(ed.cat.id)) skipped.push({ id: ed.cat.id, why: 'two edits cover the same source text' });
    else apply.push(ed);
  }

  const byFile = {};
  for (const ed of apply) (byFile[ed.cat.file] || (byFile[ed.cat.file] = [])).push(ed);
  if (!dry) {
    for (const rel of Object.keys(byFile)) {
      let src = read(rel);
      const list = byFile[rel].slice().sort((a, b) => b.cat.start - a.cat.start);
      for (const ed of list) src = src.slice(0, ed.cat.start) + ed.slice + src.slice(ed.cat.end);
      fs.writeFileSync(path.join(ROOT, rel), src);
    }
    if (apply.length) {
      delete require.cache[require.resolve('./export.js')];
      require('./export.js').main();
    }
  }

  const absent = catalog.entries.length - seen.size;
  process.stdout.write((dry ? 'dry run — nothing written\n' : ''));
  process.stdout.write('changed: ' + apply.length + '\n');
  process.stdout.write('unchanged: ' + unchanged + '\n');
  process.stdout.write('skipped: ' + skipped.length + '\n');
  if (absent) process.stdout.write('not in the document: ' + absent + '\n');
  for (const s of skipped) process.stdout.write('  skip ' + s.id + ' — ' + s.why + '\n');
  if (apply.length && apply.length <= 40) {
    for (const ed of apply) process.stdout.write('  edit ' + ed.cat.id + ' — ' + ed.cat.file + ':' + ed.cat.line + '\n');
  }
  if (skipped.length) process.exit(1);
}

if (require.main === module) main();
module.exports = { main, parseEntries, readBlock };
