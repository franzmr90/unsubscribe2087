/* The text export tags every line mouse, touch, or both.
   node tools/text-mode.js */
const {modeOf, modeNote} = require('./text/export');
const fs = require('fs');
const path = require('path');
const fail = [];
const cases = [
  ['On a desk, left click walks.', null, 'mouse'],
  ['F1 through F8, while that list is open.', null, 'mouse'],
  ['On a phone, the stick walks, and Attack swings.', null, 'touch'],
  ['Tap the stim to drink. Drag it, then let go.', null, 'touch'],
  ['On a desk, left click walks. On a phone, the stick walks.', null, 'both'],
  ['Bread costs a million credits.', null, 'both'],
  ['Anything at all.', 'touch', 'touch'],
  ['Anything at all.', 'mouse', 'mouse']
];
for (const [text, explicit, want] of cases) {
  const got = modeOf(text, explicit);
  if (got !== want) fail.push(JSON.stringify(text) + ' explicit ' + explicit + ' => ' + got + ' wanted ' + want);
}
if (!/mouse/.test(modeNote('mouse')) || !/touch/.test(modeNote('touch')) || !/both/.test(modeNote('both'))) fail.push('mode note');
const exp = fs.readFileSync(path.join(__dirname, 'text/export.js'), 'utf8');
if (!exp.includes("lines.push('MODE: '")) fail.push('markdown MODE line missing');
if (!exp.includes('mode: mode')) fail.push('catalog mode field missing');
if (!exp.includes(".body.mouse") || !exp.includes(".body.touch")) fail.push('walkthrough is not split by mode');
const src = fs.readFileSync(path.join(__dirname, '../src/p4.js'), 'utf8');
if (!src.includes('mouse:') || !src.includes('touch:')) fail.push('source is missing a mouse/touch pair');
if (fail.length) { console.error(fail.join('\n')); process.exit(1); }
console.log('text mode ok', cases.length);
