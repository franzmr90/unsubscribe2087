/* Sending mail without a mail library.
   SMTP is a line protocol and the subset needed to hand one message to a relay is small,
   so this speaks it directly over node:tls. If no SMTP host is configured — which is the
   case on a laptop, and in the tests — every message is written to data/outbox instead
   and the link is printed, so password recovery can still be walked through end to end. */
'use strict';
const tls = require('tls');
const net = require('net');
const path = require('path');
const fs = require('fs');
const { DATA, ensure } = require('./store');

const CFG = {
  host: process.env.SMTP_HOST || '',
  port: +(process.env.SMTP_PORT || 587),
  user: process.env.SMTP_USER || '',
  pass: process.env.SMTP_PASS || '',
  from: process.env.MAIL_FROM || 'Unsubscribe 2087 <no-reply@localhost>',
  secure: process.env.SMTP_SECURE === '1'
};

const enabled = () => !!CFG.host;

function outbox(msg) {
  const dir = path.join(DATA, 'outbox');
  ensure(dir);
  const f = path.join(dir, Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.txt');
  fs.writeFileSync(f, 'To: ' + msg.to + '\nSubject: ' + msg.subject + '\n\n' + msg.text + '\n');
  console.log('[mail] no SMTP configured; wrote ' + f);
  console.log('[mail] ' + msg.subject + ' -> ' + msg.to);
  if (msg.link) console.log('[mail] link: ' + msg.link);
  return { ok: true, delivered: false, file: f };
}

/* One command, one reply. SMTP replies can span several lines, the last of which has a
   space after the code rather than a dash. */
function talk(sock, line, expect) {
  return new Promise((resolve, reject) => {
    let buf = '';
    const onData = d => {
      buf += d.toString('utf8');
      const lines = buf.split(/\r?\n/).filter(Boolean);
      const last = lines[lines.length - 1];
      if (!last || !/^\d{3} /.test(last)) return;
      sock.removeListener('data', onData);
      const code = +last.slice(0, 3);
      if (expect && !expect.includes(code)) return reject(new Error('SMTP ' + code + ': ' + last));
      resolve({ code, text: buf });
    };
    sock.on('data', onData);
    if (line !== null) sock.write(line + '\r\n');
  });
}

const b64 = s => Buffer.from(String(s), 'utf8').toString('base64');
/* Dot-stuffing: a line that is a single dot would otherwise end the message body. */
const dotStuff = s => s.replace(/\r?\n/g, '\r\n').replace(/^\./gm, '..');

async function sendSMTP(msg) {
  const sock = await new Promise((resolve, reject) => {
    const s = CFG.secure
      ? tls.connect({ host: CFG.host, port: CFG.port, servername: CFG.host }, () => resolve(s))
      : net.connect({ host: CFG.host, port: CFG.port }, () => resolve(s));
    s.setTimeout(15000, () => s.destroy(new Error('SMTP timeout')));
    s.on('error', reject);
  });
  let sk = sock;
  try {
    await talk(sk, null, [220]);
    await talk(sk, 'EHLO unsubscribe2087', [250]);
    if (!CFG.secure) {
      await talk(sk, 'STARTTLS', [220]);
      sk = await new Promise((resolve, reject) => {
        const t = tls.connect({ socket: sock, servername: CFG.host }, () => resolve(t));
        t.on('error', reject);
      });
      await talk(sk, 'EHLO unsubscribe2087', [250]);
    }
    if (CFG.user) {
      await talk(sk, 'AUTH LOGIN', [334]);
      await talk(sk, b64(CFG.user), [334]);
      await talk(sk, b64(CFG.pass), [235]);
    }
    const fromAddr = (CFG.from.match(/<([^>]+)>/) || [, CFG.from])[1];
    await talk(sk, 'MAIL FROM:<' + fromAddr + '>', [250]);
    await talk(sk, 'RCPT TO:<' + msg.to + '>', [250, 251]);
    await talk(sk, 'DATA', [354]);
    const headers = [
      'From: ' + CFG.from,
      'To: ' + msg.to,
      'Subject: ' + msg.subject,
      'MIME-Version: 1.0',
      'Date: ' + new Date().toUTCString()
    ];
    let body;
    if (msg.attach) {
      const b = '=_u2087_' + Date.now();
      headers.push('Content-Type: multipart/mixed; boundary="' + b + '"');
      body = '--' + b + '\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n' + dotStuff(msg.text) +
        '\r\n--' + b + '\r\nContent-Type: application/json; name="' + msg.attach.name + '"\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        'Content-Disposition: attachment; filename="' + msg.attach.name + '"\r\n\r\n' +
        Buffer.from(msg.attach.body, 'utf8').toString('base64').replace(/(.{76})/g, '$1\r\n') +
        '\r\n--' + b + '--';
    } else {
      headers.push('Content-Type: text/plain; charset=utf-8');
      body = dotStuff(msg.text);
    }
    await talk(sk, headers.join('\r\n') + '\r\n\r\n' + body + '\r\n.', [250]);
    await talk(sk, 'QUIT', [221]).catch(() => {});
    sk.end();
    return { ok: true, delivered: true };
  } catch (e) {
    try { sk.destroy(); } catch (_) {}
    throw e;
  }
}

async function send(msg) {
  if (!enabled()) return outbox(msg);
  try { return await sendSMTP(msg); }
  catch (e) {
    /* A relay that is down must not take password recovery down with it, and must never
       surface as a different answer to the caller than a successful send. */
    console.error('[mail] send failed: ' + e.message);
    return outbox(msg);
  }
}

module.exports = { send, enabled, CFG };
