/* Bug reports, filed from inside the game.
   One file per report under data/bugs, newest name last, so reading them is `ls` and
   `cat`. Reports carry whatever the game knew at the moment — zone, level, build, recent
   errors — because the single most useless bug report is one that says "it broke". */
'use strict';
const fs = require('fs');
const path = require('path');
const { DATA, ensure } = require('./store');

const DIR = path.join(DATA, 'bugs');
const MAX = 4000;

const clean = (s, n) => String(s === undefined || s === null ? '' : s).slice(0, n || MAX);

function file(rep) {
  ensure(DIR);
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const id = stamp + '-' + Math.random().toString(36).slice(2, 7);
  const rec = {
    id,
    at: new Date().toISOString(),
    from: clean(rep.from, 60) || 'anonymous',
    doing: clean(rep.doing),
    happened: clean(rep.happened),
    expected: clean(rep.expected),
    where: clean(rep.where, 200),
    state: rep.state && typeof rep.state === 'object' ? JSON.parse(clean(JSON.stringify(rep.state), 8000)) : null,
    errors: Array.isArray(rep.errors) ? rep.errors.slice(0, 20).map(e => clean(e, 500)) : [],
    agent: clean(rep.agent, 300)
  };
  fs.writeFileSync(path.join(DIR, id + '.json'), JSON.stringify(rec, null, 2));
  console.log('[bug] ' + id + ' from ' + rec.from + ': ' + rec.happened.slice(0, 90));
  return rec;
}

function list(n) {
  try {
    return fs.readdirSync(DIR).filter(f => f.endsWith('.json')).sort().slice(-(n || 50)).reverse()
      .map(f => JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')));
  } catch (e) { return []; }
}

module.exports = { file, list, DIR };
