/* The id the page was built with. A stale tab compares it to the one sent on connect.
   BUILD_ID wins when a deploy sets it. Otherwise dist/BUILD, written by build.sh.
   Otherwise a short hash of the fragment, so a server without that file still has one. */
'use strict';
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const BUILD_FILE = path.join(__dirname, '..', '..', 'dist', 'BUILD');
const HTML_FILE = path.join(__dirname, '..', '..', 'dist', 'unsubscribe.html');

let cached = { key: '', id: 'dev' };

function fromFile() {
  try {
    const st = fs.statSync(BUILD_FILE);
    const key = 'b:' + st.mtimeMs + ':' + st.size;
    if (cached.key === key) return cached.id;
    const id = fs.readFileSync(BUILD_FILE, 'utf8').trim().slice(0, 40);
    if (id) { cached = { key, id }; return id; }
  } catch (e) {}
  try {
    const st = fs.statSync(HTML_FILE);
    const key = 'h:' + st.mtimeMs + ':' + st.size;
    if (cached.key === key) return cached.id;
    const hash = crypto.createHash('sha256').update(fs.readFileSync(HTML_FILE)).digest('hex').slice(0, 12);
    cached = { key, id: hash };
    return hash;
  } catch (e) {}
  return 'dev';
}

function buildId() {
  const env = process.env.BUILD_ID;
  if (env && String(env).trim()) return String(env).trim().slice(0, 40);
  return fromFile();
}

module.exports = { buildId };
