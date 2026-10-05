#!/usr/bin/env node
/* Read the reports people filed from inside the game.
   `node tools/bugs.js`           the last 20, newest first
   `node tools/bugs.js 50`        the last 50
   `node tools/bugs.js --full`    with the whole state blob and every recorded error
   `node tools/bugs.js --json`    machine-readable, for piping somewhere else */
'use strict';
const path = require('path');
process.env.DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'server', 'data');
const bugs = require('../server/lib/bugs');

const args = process.argv.slice(2);
const full = args.includes('--full');
const asJson = args.includes('--json');
const n = +(args.find(a => /^\d+$/.test(a)) || 20);

const list = bugs.list(n);

if (asJson) { console.log(JSON.stringify(list, null, 2)); process.exit(0); }

if (!list.length) {
  console.log('No reports yet. They land in ' + bugs.DIR + ' when somebody presses Report.');
  process.exit(0);
}

const line = '─'.repeat(72);
console.log('\n' + list.length + ' report' + (list.length === 1 ? '' : 's') + ', newest first\n');

for (const r of list) {
  const s = r.state || {};
  console.log(line);
  console.log(r.at + '   ' + r.from);
  const where = [
    s.zoneName ? s.zoneName + ' (district ' + s.zone + ')' : null,
    s.lvl ? 'level ' + s.lvl + ' ' + (s.cls || '') : null,
    s.hp !== undefined && s.maxHp ? s.hp + '/' + s.maxHp + ' life' : null,
    s.game ? '"' + s.game + '" · ' + (s.diff || 'normal') + ' · ' + s.players + ' in the game' : null,
    s.voice ? 'microphone open' : null
  ].filter(Boolean).join(' · ');
  if (where) console.log(where);
  console.log('');
  console.log('  doing     ' + r.doing);
  console.log('  happened  ' + r.happened);
  console.log('  expected  ' + r.expected);
  if (r.errors && r.errors.length) {
    console.log('');
    console.log('  ' + r.errors.length + ' error' + (r.errors.length === 1 ? '' : 's') + ' recorded by the page:');
    for (const e of (full ? r.errors : r.errors.slice(0, 3))) console.log('    ' + e);
    if (!full && r.errors.length > 3) console.log('    … ' + (r.errors.length - 3) + ' more (--full)');
  }
  if (full) {
    console.log('');
    console.log('  state     ' + JSON.stringify(s));
    console.log('  browser   ' + (r.agent || '?'));
  }
  console.log('');
}
console.log(line);
console.log('Files: ' + bugs.DIR);
