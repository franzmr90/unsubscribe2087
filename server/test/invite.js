/* The registration gate. `node server/test/invite.js` */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'u2087-invite-'));
process.env.DATA_DIR = tmp;
process.env.INVITE_REQUIRED = '1';
delete process.env.INVITE_CODES;
delete process.env.ALLOWLIST;
delete process.env.SMTP_HOST;

const { server } = require('../server');
const invites = require('../lib/invites');
const auth = require('../lib/auth');

function clearReg() {
  for (const ip of ['127.0.0.1', '::ffff:127.0.0.1', '::1']) auth.rateClear('reg:' + ip);
}

let pass = 0, fail = 0; const out = [];
const ok = (n, c, d) => { if (c) { pass++; out.push('  ok   ' + n); } else { fail++; out.push('  FAIL ' + n + (d ? '  <' + d + '>' : '')); } };

(async () => {
  await new Promise(r => server.listen(0, r));
  const base = 'http://127.0.0.1:' + server.address().port;
  async function reg(body) {
    const r = await fetch(base + '/api/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    });
    let j = {}; try { j = await r.json(); } catch (e) {}
    return { status: r.status, body: j };
  }

  let r = await reg({ name: 'NoCode', pass: 'longenough1' });
  ok('registration without a code is refused', r.status === 403, JSON.stringify(r.body));

  const row = invites.mint({ uses: 1, note: 'beta' });
  ok('a code can be minted', !!row && row.code.length >= 8, row && row.code);
  r = await reg({ name: 'WithCode', pass: 'longenough1', invite: row.code });
  ok('the code lets one account in', r.status === 200 && r.body.user.name === 'WithCode', JSON.stringify(r.body));
  r = await reg({ name: 'Second', pass: 'longenough1', invite: row.code });
  ok('a single-use code does not work twice', r.status === 403, JSON.stringify(r.body));
  r = await reg({ name: 'Bogus', pass: 'longenough1', invite: 'not-a-real-code' });
  ok('an unknown code is refused', r.status === 403, JSON.stringify(r.body));

  clearReg();
  process.env.ALLOWLIST = 'listed@example.com';
  r = await reg({ name: 'Listed', pass: 'longenough1', email: 'listed@example.com' });
  ok('an allowlisted email does not need a code', r.status === 200 && r.body.user.name === 'Listed', JSON.stringify(r.body));
  delete process.env.ALLOWLIST;

  clearReg();
  const many = invites.mint({ uses: 0, note: 'staff' });
  r = await reg({ name: 'StaffOne', pass: 'longenough1', invite: many.code });
  const r2 = await reg({ name: 'StaffTwo', pass: 'longenough1', invite: many.code });
  ok('a zero-use code is unlimited', r.status === 200 && r2.status === 200, r.status + ' ' + r2.status);
  invites.revoke(many.code);
  r = await reg({ name: 'StaffThree', pass: 'longenough1', invite: many.code });
  ok('a revoked code is refused', r.status === 403, JSON.stringify(r.body));

  const me = await fetch(base + '/api/me');
  const mj = await me.json();
  ok('the page is told that an invite is required', mj.inviteRequired === true && !!mj.build, JSON.stringify(mj));

  console.log(out.join('\n'));
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  server.close();
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
