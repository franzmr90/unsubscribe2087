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
  const extra = String(process.env.WS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  return extra.indexOf(origin) !== -1;
}

module.exports = { originOK };
