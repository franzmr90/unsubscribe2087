/* Admin CLI. Invite, ban and unban write the data directory; the running server
   reloads those files. Reset, kick, broadcast and the online list talk to the
   running process (ADMIN_TOKEN). If that process is down, reset falls back to
   deleting the documents on disk — an online player is not told until the server
   is up to send the wipe.

   node server/admin.js invite mint [--uses 1] [--note text]
   node server/admin.js invite list
   node server/admin.js invite revoke CODE
   node server/admin.js online
   node server/admin.js kick NAME
   node server/admin.js ban NAME [--reason text]
   node server/admin.js unban NAME
   node server/admin.js reset NAME [--slot 0|1|2|all]
   node server/admin.js broadcast TEXT
*/
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

function loadEnvFile() {
  if (process.env.DATA_DIR && process.env.ADMIN_TOKEN) return;
  const file = process.env.ENV_FILE || '/etc/unsubscribe2087.env';
  let txt = '';
  try { txt = fs.readFileSync(file, 'utf8'); } catch (e) { return; }
  for (const line of txt.split('\n')) {
    const s = line.trim();
    if (!s || s[0] === '#') continue;
    const i = s.indexOf('=');
    if (i < 1) continue;
    const k = s.slice(0, i).trim();
    let v = s.slice(i + 1).trim();
    if ((v[0] === '"' && v[v.length - 1] === '"') || (v[0] === "'" && v[v.length - 1] === "'")) v = v.slice(1, -1);
    if (process.env[k] == null || process.env[k] === '') process.env[k] = v;
  }
}
loadEnvFile();

const argv = process.argv.slice(2);
function flag(name, fallback) {
  const i = argv.indexOf('--' + name);
  if (i < 0) return fallback;
  return argv[i + 1];
}
function rest(from) {
  const out = [];
  for (let i = from; i < argv.length; i++) {
    if (argv[i].startsWith('--')) { i++; continue; }
    out.push(argv[i]);
  }
  return out.join(' ').trim();
}

function die(msg) { console.error(msg); process.exit(1); }

function call(methodPath, body) {
  const token = process.env.ADMIN_TOKEN || '';
  if (token.length < 16) die('ADMIN_TOKEN is not set (need 16+ characters). Online, kick and broadcast talk to the running server.');
  const base = process.env.ADMIN_URL || process.env.PUBLIC_ORIGIN || 'http://127.0.0.1:' + (process.env.PORT || 8087);
  const url = new URL('/api/admin/' + methodPath, base);
  const lib = url.protocol === 'https:' ? https : http;
  const data = JSON.stringify(body || {});
  return new Promise((resolve, reject) => {
    const req = lib.request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data), Authorization: 'Bearer ' + token }
    }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        let j = {};
        try { j = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); } catch (e) {}
        if (res.statusCode >= 400) reject(new Error(j.error || ('server said ' + res.statusCode)));
        else resolve(j);
      });
    });
    req.on('error', reject);
    req.end(data);
  });
}

async function main() {
  const cmd = argv[0];
  const sub = argv[1];
  if (cmd === 'invite' && sub === 'mint') {
    const invites = require('./lib/invites');
    const uses = flag('uses', '1');
    const row = invites.mint({ uses: uses === '0' ? 0 : +uses, note: flag('note', '') });
    if (!row) die('Could not mint that code.');
    console.log(row.code + (row.maxUses ? '  uses=' + row.maxUses : '  uses=unlimited') + (row.note ? '  ' + row.note : ''));
    return;
  }
  if (cmd === 'invite' && sub === 'list') {
    const invites = require('./lib/invites');
    const rows = invites.list();
    if (!rows.length) { console.log('(no codes)'); return; }
    for (const r of rows) {
      const lim = r.maxUses ? (r.uses + '/' + r.maxUses) : (r.uses + '/unlimited');
      console.log((r.revoked ? 'revoked ' : '       ') + r.code + '  ' + lim + (r.note ? '  ' + r.note : ''));
    }
    return;
  }
  if (cmd === 'invite' && sub === 'revoke') {
    const invites = require('./lib/invites');
    const code = argv[2];
    if (!code) die('invite revoke CODE');
    const row = invites.revoke(code);
    if (!row) die('No code by that name.');
    console.log('revoked ' + row.code);
    return;
  }
  if (cmd === 'online') {
    const j = await call('online', {});
    const rows = j.players || [];
    if (!rows.length) { console.log('(nobody connected)'); return; }
    for (const p of rows) console.log(p.name + '\t' + (p.game || 'lobby') + (p.away ? '\taway' : '') + '\tlvl ' + p.lvl);
    console.log(rows.length + ' connected');
    return;
  }
  if (cmd === 'kick') {
    const name = rest(1);
    if (!name) die('kick NAME');
    const j = await call('kick', { name });
    console.log('kicked ' + (j.name || name));
    return;
  }
  if (cmd === 'broadcast') {
    const text = rest(1);
    if (!text) die('broadcast TEXT');
    const j = await call('broadcast', { text });
    console.log('told ' + j.n + ' people');
    return;
  }
  if (cmd === 'ban') {
    const name = argv[1];
    if (!name || name.startsWith('--')) die('ban NAME [--reason text]');
    const admin = require('./lib/admin');
    const row = admin.banUser(name, flag('reason', ''));
    if (!row) die('No account by that name.');
    console.log('banned ' + row.name + (row.reason ? ' — ' + row.reason : ''));
    try { await call('kick', { name: row.name }); } catch (e) { /* server may be down; the ban is on disk */ }
    return;
  }
  if (cmd === 'unban') {
    const name = argv[1];
    if (!name) die('unban NAME');
    const admin = require('./lib/admin');
    const row = admin.unbanUser(name);
    if (!row) die('That account is not banned.');
    console.log('unbanned ' + row.name);
    return;
  }
  if (cmd === 'reset') {
    const name = argv[1];
    if (!name || name.startsWith('--')) die('reset NAME [--slot 0|1|2|all]');
    const slot = flag('slot', 'all');
    const token = process.env.ADMIN_TOKEN || '';
    if (token.length >= 16) {
      try {
        const j = await call('reset', { name, slot });
        const n = (j.deleted || []).length;
        console.log('reset ' + (j.name || name) + ' slot ' + (j.slot || slot) + ' (' + n + ' documents)');
        return;
      } catch (e) {
        const down = e.code === 'ECONNREFUSED' || e.code === 'ENOTFOUND' || e.code === 'ECONNRESET';
        if (!down) die(e.message || String(e));
        console.error('The server is not answering (' + e.code + '). Deleting the documents on disk. An online player will not be told until the server is up.');
      }
    } else {
      console.error('ADMIN_TOKEN is not set. Deleting the documents on disk. An online player will not be told.');
    }
    const admin = require('./lib/admin');
    const row = admin.resetChar(name, slot);
    if (!row) die('No account by that name.');
    if (row.error) die(row.error);
    console.log('reset ' + row.name + ' slot ' + row.slot + ' (' + row.deleted.length + ' documents)');
    return;
  }
  die('Commands: invite mint|list|revoke, online, kick, ban, unban, reset, broadcast');
}

main().catch(e => die(e.message || String(e)));
