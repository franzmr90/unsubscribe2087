/* Optional TURN relay for voice. Empty unless TURN_URLS is set. The urls are handed to
   the browser on connect; the audio still never touches this process. */
'use strict';

function turnCfg() {
  const urls = String(process.env.TURN_URLS || '').split(',').map(s => s.trim()).filter(Boolean);
  if (!urls.length) return null;
  const o = { urls: urls.length === 1 ? urls[0] : urls };
  if (process.env.TURN_USER) o.username = process.env.TURN_USER;
  if (process.env.TURN_PASS) o.credential = process.env.TURN_PASS;
  return o;
}

module.exports = { turnCfg };
