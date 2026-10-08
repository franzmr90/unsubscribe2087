#!/usr/bin/env node
'use strict';
/* Prove the document round-trips.
   1. A no-op import leaves the standalone build byte-identical.
   2. Edits with quotes, an apostrophe, an emoji, and a kept placeholder
      import, the game still builds, and the smoke test passes.
   3. A removed placeholder, a blown length limit, and a drifted source
      are refused.
   Sources and text/ are restored before this process exits.
*/
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..', '..');
const STAND = path.join(ROOT, 'dist', 'Unsubscribe-2087-standalone.html');
const MD = path.join(ROOT, 'text', 'GAME-TEXT.md');
const DOCX = path.join(ROOT, 'text', 'GAME-TEXT.docx');
const CAT = path.join(ROOT, 'text', 'catalog.json');

function run(cmd, args, opts) {
  return execFileSync(cmd, args, Object.assign({ cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }, opts || {}));
}
function sha(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}
function walk(dir, acc) {
  for (const n of fs.readdirSync(dir)) {
    const p = path.join(dir, n);
    if (fs.statSync(p).isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}
function snap(files) {
  const o = {};
  for (const f of files) if (fs.existsSync(f)) o[f] = fs.readFileSync(f);
  return o;
}
function restore(saved) {
  for (const f of Object.keys(saved)) fs.writeFileSync(f, saved[f]);
}
function fail(msg) {
  process.stderr.write(msg + '\n');
  process.exit(1);
}
function must(out, re, label) {
  if (!re.test(out)) fail(label + '\n' + out);
}

function replaceBlock(md, id, next) {
  const lines = md.split('\n');
  let at = -1;
  for (let i = 0; i < lines.length; i++) if (lines[i] === 'ID: ' + id) { at = i; break; }
  if (at < 0) fail('missing ' + id);
  let textAt = -1, endAt = -1;
  for (let j = at; j < lines.length; j++) {
    if (j > at && lines[j].startsWith('ID: ')) break;
    if (lines[j] === 'TEXT') textAt = j;
    if (textAt > 0 && lines[j] === 'END') { endAt = j; break; }
  }
  if (textAt < 0 || endAt < 0) fail('no block for ' + id);
  const body = next.split('\n').map(l => '    ' + l);
  const repl = [''].concat(body).concat(['']);
  lines.splice(textAt + 1, endAt - textAt - 1, ...repl);
  return lines.join('\n');
}

function main() {
  const srcFiles = walk(path.join(ROOT, 'src'), [])
    .concat(walk(path.join(ROOT, 'server'), []))
    .concat(walk(path.join(ROOT, 'lan'), []))
    .concat([MD, DOCX, CAT]);
  const saved = snap(srcFiles);

  try {
    run('sh', ['build.sh'], { stdio: 'inherit' });
    const before = sha(STAND);
    process.stdout.write('pre-import sha256 ' + before + '\n');

    const noop = run('node', ['tools/text/import.js', 'text/GAME-TEXT.md']);
    process.stdout.write(noop);
    must(noop, /changed: 0/, 'no-op import changed something');
    must(noop, /skipped: 0/, 'no-op import skipped something');
    run('sh', ['build.sh'], { stdio: 'inherit' });
    const after = sha(STAND);
    process.stdout.write('post-import sha256 ' + after + '\n');
    if (before !== after) fail('standalone hash changed on a no-op import');

    const docx = run('node', ['tools/text/import.js', 'text/GAME-TEXT.docx', '--dry-run']);
    process.stdout.write(docx);
    must(docx, /changed: 0/, 'docx dry-run would change the game');
    must(docx, /skipped: 0/, 'docx dry-run skipped entries');

    const cat = JSON.parse(fs.readFileSync(CAT, 'utf8'));
    const plain = cat.entries.find(e =>
      (e.style === 'single' || e.style === 'double') && !e.placeholders.length && e.hardMax == null && !e.singleLine &&
      e.text.length > 40 && e.section === 'act1' && !/[{}]/.test(e.text));
    const skill = cat.entries.find(e => e.id === 'class.scrapper.skill.01.desc')
      || cat.entries.find(e => e.placeholders.some(p => p.name === 'percent') && e.placeholders.some(p => p.name === 'rank'));
    const limited = cat.entries.find(e => e.hardMax != null && e.hardMax < 80 && e.placeholders.length === 0);
    if (!plain || !skill || !limited) fail('could not find sample entries for the round trip');
    process.stdout.write('edit ' + plain.id + '\nedit ' + skill.id + '\nlimit ' + limited.id + '\n');

    const md = fs.readFileSync(MD, 'utf8');
    const removed = skill.text.replace(/\{percent\}/, '');
    let bad = replaceBlock(md, skill.id, removed);
    const tmp = path.join(ROOT, '.tmp', 'game-text-bad.md');
    fs.mkdirSync(path.dirname(tmp), { recursive: true });
    fs.writeFileSync(tmp, bad);
    let refused = '';
    try { refused = run('node', ['tools/text/import.js', tmp, '--dry-run']); }
    catch (e) { refused = (e.stdout || '') + (e.stderr || ''); }
    must(refused, /placeholder removed/, 'missing placeholder was not refused');

    const huge = 'X'.repeat((limited.hardMax || 10) + 8);
    bad = replaceBlock(md, limited.id, huge);
    fs.writeFileSync(tmp, bad);
    try { refused = run('node', ['tools/text/import.js', tmp, '--dry-run']); }
    catch (e) { refused = (e.stdout || '') + (e.stderr || ''); }
    must(refused, /longer than the/, 'over-long text was not refused');

    const srcPath = path.join(ROOT, plain.file);
    const src = fs.readFileSync(srcPath, 'utf8');
    if (src.slice(plain.start, plain.end) !== plain.raw) fail('sample slice does not match');
    const drifted = src.slice(0, plain.start) + plain.raw.replace(/./, m => m === 'Z' ? 'Y' : 'Z') + src.slice(plain.end);
    fs.writeFileSync(srcPath, drifted);
    bad = replaceBlock(md, plain.id, plain.text + ' (edited)');
    fs.writeFileSync(tmp, bad);
    try { refused = run('node', ['tools/text/import.js', tmp, '--dry-run']); }
    catch (e) { refused = (e.stdout || '') + (e.stderr || ''); }
    fs.writeFileSync(srcPath, src);
    must(refused, /source has changed/, 'drift was not refused');

    const quoted = 'Don\'t say "never" — the moors remember. 🔥';
    const skilled = skill.text.replace('A wide swing.', 'A wide, honest swing.');
    if (skilled === skill.text) fail('skill text had no anchor to edit');
    if (!/\{percent\}/.test(skilled) || !/\{rank\}/.test(skilled)) fail('edit dropped a placeholder');
    let next = replaceBlock(md, plain.id, quoted);
    next = replaceBlock(next, skill.id, skilled);
    const edited = path.join(ROOT, '.tmp', 'game-text-edit.md');
    fs.writeFileSync(edited, next);
    const applied = run('node', ['tools/text/import.js', edited]);
    process.stdout.write(applied);
    must(applied, /changed: 2/, 'expected two edits');
    const now = fs.readFileSync(srcPath, 'utf8');
    if (!now.includes('🔥') || !/Don\\?'t say \\?"never\\?"/.test(now)) fail('quotes, apostrophe, or emoji did not land in ' + plain.file);
    const skillSrc = fs.readFileSync(path.join(ROOT, skill.file), 'utf8');
    if (!skillSrc.includes('A wide, honest swing.')) fail('skill edit did not land');
    if (!skillSrc.includes(skill.placeholders.find(p => p.name === 'percent').expr)) fail('placeholder expression was dropped');

    run('sh', ['build.sh'], { stdio: 'inherit' });
    run('node', ['tools/smoke.js'], { stdio: 'inherit' });
    process.stdout.write('round trip ok\n');
  } finally {
    restore(saved);
  }
}

main();
