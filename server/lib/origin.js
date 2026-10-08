/* Browsers send Origin on a WebSocket upgrade. A page on another site must not be able
   to open /live with a victim's cookie. Node test clients omit Origin; that is allowed
   until WS_REQUIRE_ORIGIN=1, which the deploy kit sets on a real box. */
'use strict';

function originOK(req) {
  const origin = String((req.headers && req.headers.origin) || '');
  const pub = String(process.env.PUBLIC_ORIGIN || '').replace(/\/$/, '');
  const requireO = process.env.WS_REQUIRE_ORIGIN === '1';
  if (!origin) return !requireO;
  if (pub && origin.replace(/\/$/, '') === pub) return true;
  const local = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(origin);
  if (local && process.env.WS_ALLOW_LOCAL !== '0') return true;
  if (lanOrigin(origin)) return true;
  const extra = String(process.env.WS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  return extra.indexOf(origin) !== -1;
}

/* A second computer opens http://192.168.x.x:port. That origin is not the public
   site and it is not localhost. In LAN mode it is still this game. */
function lanOrigin(origin) {
  const lan = require('./lan');
  if (!lan.on()) return false;
  let u;
  try { u = new URL(origin); } catch (e) { return false; }
  const httpsOK = process.env.LAN_TLS === '1' && u.protocol === 'https:';
  if (u.protocol !== 'http:' && !httpsOK) return false;
  const port = u.port || (u.protocol === 'https:' ? '443' : '80');
  if (port !== String(process.env.PORT || 8087)) return false;
  return lan.privateIP(u.hostname);
}

module.exports = { originOK };
