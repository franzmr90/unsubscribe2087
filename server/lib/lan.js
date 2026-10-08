/* Home-network play. The launchers set LAN=1. The server then listens on every
   interface, stays on plain http, and only lets new accounts come from a private
   address. A public address that somehow reaches the port cannot register. */
'use strict';
const os = require('os');

function on() {
  return process.env.LAN === '1' || process.env.LAN === 'true';
}

function inviteOn() {
  return on() && (process.env.LAN_INVITE === '1' || process.env.LAN_INVITE === 'true');
}

/* LAN play is http on purpose. A certificate is ignored unless LAN_TLS=1. */
function skipTls() {
  return on() && process.env.LAN_TLS !== '1';
}

function bareIP(addr) {
  let a = String(addr || '').trim().toLowerCase();
  if (a.startsWith('::ffff:')) a = a.slice('::ffff:'.length);
  return a;
}

function privateIP(addr) {
  const a = bareIP(addr);
  if (!a) return false;
  if (a === 'localhost' || a === '::1' || a === '127.0.0.1') return true;
  if (/^127\./.test(a)) return true;
  if (/^10\./.test(a)) return true;
  if (/^192\.168\./.test(a)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(a)) return true;
  if (/^169\.254\./.test(a)) return true;
  if (a.startsWith('fe80:')) return true;
  if (/^f[cd][0-9a-f]{2}:/.test(a)) return true;
  return false;
}

/* Addresses another computer in the house can type. Loopback and link-local
   are left out: they only work on this machine, or they need a zone id. */
function urls(port) {
  const out = [];
  const nics = os.networkInterfaces();
  for (const name of Object.keys(nics)) {
    for (const inf of nics[name] || []) {
      if (!inf || inf.internal) continue;
      const fam = inf.family;
      if (fam !== 'IPv4' && fam !== 4) continue;
      const addr = bareIP(inf.address);
      if (!privateIP(addr) || addr.startsWith('169.254.')) continue;
      const url = 'http://' + addr + ':' + port;
      if (out.indexOf(url) < 0) out.push(url);
    }
  }
  return out;
}

function banner(port, code) {
  const lines = [];
  lines.push('');
  lines.push('Unsubscribe 2087 is running for your home network.');
  lines.push('On this computer:   http://localhost:' + port);
  const list = urls(port);
  if (list.length) {
    lines.push('Other players open one of these in a browser:');
    for (const u of list) lines.push('  ' + u);
  } else {
    lines.push('No home-network address was found. Other players cannot connect until this computer is on Wi-Fi or a cable.');
  }
  if (code) lines.push('Invite code (everyone types this when they make an account): ' + code);
  else lines.push('Accounts: anyone on this home network can make one. Someone outside the house cannot.');
  lines.push('Voice is off on these links. Browsers refuse the microphone on a plain http address that is not localhost. Play, chat, and parties still work.');
  lines.push('Bug reports stay in the saves folder on this computer. They are not sent to GitHub.');
  lines.push('If the computer asks whether to allow Node.js, allow it on private networks only.');
  lines.push('Leave this window open. Closing it stops the game for everyone.');
  lines.push('');
  return lines.join('\n');
}

module.exports = { on, inviteOn, skipTls, privateIP, bareIP, urls, banner };
