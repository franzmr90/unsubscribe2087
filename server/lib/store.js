/* A tiny JSON-file store.
   This game has a handful of players, each holding a few hundred kilobytes of save.
   A database would be a dependency, a build step and a backup story; a directory of
   JSON files is none of those, and `cp -r data data.bak` is the whole backup plan.
   Writes go to a temp file and are renamed over the target, so a crash mid-write
   leaves the previous version intact rather than a truncated one. */
'use strict';
const fs = require('fs');
const path = require('path');

const DATA = process.env.DATA_DIR || path.join(__dirname, '..', 'data');

/* The home-network launchers keep saves in a folder outside the unzipped kit, so a new
   copy of the kit finds the accounts the old one made. DATA_FROM names the folder an
   older kit used; on the first boot with an empty data folder, it is copied across once.
   The old folder is left where it was, as a backup. */
function adopt(to, from) {
  if (!from) return false;
  try {
    if (path.resolve(from) === path.resolve(to)) return false;
    if (fs.existsSync(path.join(to, 'users.json'))) return false;
    if (!fs.existsSync(path.join(from, 'users.json'))) return false;
    fs.mkdirSync(to, { recursive: true });
    fs.cpSync(from, to, { recursive: true });
    console.log('Moved the saves from ' + from + ' to ' + to + '. The old folder is untouched.');
    return true;
  } catch (e) {
    console.error('Could not copy the old saves from ' + from + ': ' + e.message);
    return false;
  }
}
const ADOPTED = adopt(DATA, process.env.DATA_FROM);

function ensure(dir) { fs.mkdirSync(dir, { recursive: true }); }

function readJSON(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (e) { return fallback; }
}

function writeJSON(file, value) {
  ensure(path.dirname(file));
  const tmp = file + '.' + process.pid + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(value));
  fs.renameSync(tmp, file);
}

/* A table is one JSON object held in memory and flushed on change. Small enough that
   rewriting the whole file per change is cheaper than anything cleverer would be. */
class Table {
  constructor(name) {
    this.file = path.join(DATA, name + '.json');
    this.rows = readJSON(this.file, {});
  }
  get(k) { return this.rows[k]; }
  all() { return this.rows; }
  set(k, v) { this.rows[k] = v; this.flush(); return v; }
  del(k) { delete this.rows[k]; this.flush(); }
  find(fn) { for (const k in this.rows) if (fn(this.rows[k], k)) return this.rows[k]; return null; }
  flush() { writeJSON(this.file, this.rows); }
  /* Drop entries whose `exp` has passed. Called opportunistically, not on a timer. */
  sweep(now) {
    let n = 0;
    for (const k in this.rows) if (this.rows[k] && this.rows[k].exp && this.rows[k].exp < now) { delete this.rows[k]; n++; }
    if (n) this.flush();
    return n;
  }
}

/* The document store the game talks to: one file per document, namespaced by user.
   Document ids come from the client, so they are filtered to a safe character set
   rather than trusted — a document called `../../users` must not be reachable. */
const docSafe = s => /^[A-Za-z0-9_.:-]{1,80}$/.test(s) && s !== '.' && s !== '..';

function docPath(uid, id) { return path.join(DATA, 'docs', uid, id + '.json'); }

const docs = {
  get(uid, id) {
    if (!docSafe(id)) return null;
    return readJSON(docPath(uid, id), null);
  },
  set(uid, id, data) {
    if (!docSafe(id)) return false;
    writeJSON(docPath(uid, id), data);
    return true;
  },
  del(uid, id) {
    if (!docSafe(id)) return false;
    try { fs.unlinkSync(docPath(uid, id)); } catch (e) {}
    return true;
  },
  list(uid) {
    try { return fs.readdirSync(path.join(DATA, 'docs', uid)).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5)); }
    catch (e) { return []; }
  },
  /* Everything one account holds, for the emailed backup. */
  dump(uid) {
    const out = {};
    for (const id of docs.list(uid)) out[id] = docs.get(uid, id);
    return out;
  },
  bytes(uid) {
    let n = 0;
    for (const id of docs.list(uid)) { try { n += fs.statSync(docPath(uid, id)).size; } catch (e) {} }
    return n;
  }
};

ensure(DATA);
module.exports = { Table, docs, DATA, ADOPTED, adopt, readJSON, writeJSON, ensure };
