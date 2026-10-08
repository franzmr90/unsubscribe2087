/* Friends and the offline mailbox. `node server/test/social.js`
   Throwaway data directory. No browser. The page is not involved. */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'u2087-social-'));
process.env.DATA_DIR = tmp;
process.env.PORT = '0';
delete process.env.SMTP_HOST;

const { server, live } = require('../server');
const auth = require('../lib/auth');
const social = require('../lib/social');
const { Table, docs } = require('../lib/store');

let pass = 0, fail = 0;
const results = [];
function ok(name, cond, detail) {
  if (cond) { pass++; results.push('  ok   ' + name); }
  else { fail++; results.push('  FAIL ' + name + (detail ? '  <' + detail + '>' : '')); }
}

let base = '', cookie = '', csrf = '';
async function call(p, body, opt) {
  opt = opt || {};
  const headers = { 'Content-Type': 'application/json' };
  if (cookie && !opt.noCookie) headers.Cookie = cookie;
  if (csrf && !opt.noCsrf) headers['X-CSRF'] = opt.csrf !== undefined ? opt.csrf : csrf;
  const r = await fetch(base + p, {
    method: 'POST', headers, body: JSON.stringify(body || {})
  });
  const set = r.headers.getSetCookie ? r.headers.getSetCookie() : [];
  for (const c of set) if (/^u2087=/.test(c)) cookie = c.split(';')[0];
  let j = null; try { j = await r.json(); } catch (e) {}
  return { status: r.status, body: j || {} };
}
function as(a) { cookie = a.cookie; csrf = a.csrf; }
function account(name, email) {
  const u = auth.createUser(name, 'social-test-pass', email || '');
  if (!u || !u.pass || !u.pass.hash) throw new Error('createUser failed for ' + name);
  const tok = auth.newSession(u.id);
  const sess = auth.readSession(tok);
  return { user: u, cookie: 'u2087=' + encodeURIComponent(tok), csrf: sess.csrf };
}
function leak(v) {
  if (!v || typeof v !== 'object') return null;
  for (const k of Object.keys(v)) {
    if (k === 'pass' || k === 'hash' || k === 'email' || k === 'emailLc' || k === 'document' || k === 'docs' || k === 'data') return k;
    const hit = leak(v[k]);
    if (hit) return hit;
  }
  return null;
}
const same = (a, b) => a.status === b.status && JSON.stringify(a.body) === JSON.stringify(b.body);

(async () => {
  await new Promise(r => server.listen(0, r));
  base = 'http://127.0.0.1:' + server.address().port;

  const ada = account('Ada', 'ada@example.com');
  const bo = account('Bo', 'bo@example.com');
  const cy = account('Cy', 'cy@example.com');
  const dee = account('Dee', 'dee@example.com');
  docs.set(ada.user.id, 'hero1', { s: '{"lvl":4,"secret":"paper-trail"}' });

  ok('fixture is a real account', !!(ada.user.pass && ada.user.pass.hash && ada.user.email));

  /* ---- ask, accept, list ---- */
  cookie = ''; csrf = '';
  let r = await call('/api/friend/list', {});
  ok('list needs a session', r.status === 401);

  as(ada);
  r = await call('/api/friend/ask', { name: 'Bo' }, { noCsrf: true });
  ok('ask needs the csrf token', r.status === 403, JSON.stringify(r.body));

  r = await call('/api/friend/ask', { name: 'Bo' });
  ok('ask is accepted', r.status === 200, JSON.stringify(r.body));
  ok('ask response has no password field', !leak(r.body) && !JSON.stringify(r.body).includes(ada.user.pass.hash), JSON.stringify(r.body));

  r = await call('/api/friend/list', {});
  ok('asker sees pending', r.body.to && r.body.to[bo.user.id] && r.body.to[bo.user.id].state === 'pending', JSON.stringify(r.body));
  ok('pending row is name, at, state', r.body.to && Object.keys(r.body.to[bo.user.id]).sort().join(',') === 'at,name,state');

  as(bo);
  r = await call('/api/friend/list', {});
  ok('the asked sees in', r.body.to && r.body.to[ada.user.id] && r.body.to[ada.user.id].state === 'in', JSON.stringify(r.body));
  r = await call('/api/friend/answer', { name: 'Ada', accept: true });
  ok('accept', r.status === 200, JSON.stringify(r.body));

  r = await call('/api/friend/list', {});
  const boList = r.body;
  ok('acceptor sees friend', boList.to && boList.to[ada.user.id] && boList.to[ada.user.id].state === 'friend', JSON.stringify(boList));
  as(ada);
  r = await call('/api/friend/list', {});
  const adaList = r.body;
  ok('asker sees friend', adaList.to && adaList.to[bo.user.id] && adaList.to[bo.user.id].state === 'friend' && adaList.to[bo.user.id].name === 'Bo', JSON.stringify(adaList));
  ok('friend response has no password, hash, email, or document', !leak(adaList) && !leak(boList) && !JSON.stringify(adaList).includes(ada.user.pass.hash) && !JSON.stringify(adaList).includes('paper-trail') && !JSON.stringify(adaList).includes('hero1'), JSON.stringify(adaList));

  as(cy);
  r = await call('/api/friend/list', {});
  ok('a third account sees nothing', r.body.to && Object.keys(r.body.to).length === 0, JSON.stringify(r.body));

  const disk = new Table('friends');
  ok('a new table reads the row back', disk.get(ada.user.id) && disk.get(ada.user.id).to[bo.user.id].state === 'friend' && disk.get(bo.user.id).to[ada.user.id].state === 'friend');
  ok('friends are not a document', !fs.existsSync(path.join(tmp, 'docs', ada.user.id, 'friends.json')) && !JSON.stringify(docs.dump(ada.user.id)).includes('"pending"'));

  /* ---- decline, then remove, on a side pair ---- */
  as(cy);
  r = await call('/api/friend/ask', { name: 'Dee' });
  ok('side ask', r.status === 200, JSON.stringify(r.body));
  as(dee);
  r = await call('/api/friend/answer', { name: 'Cy', accept: false });
  ok('decline', r.status === 200, JSON.stringify(r.body));
  r = await call('/api/friend/list', {});
  ok('decline clears the asked', !r.body.to[cy.user.id], JSON.stringify(r.body));
  as(cy);
  r = await call('/api/friend/list', {});
  ok('decline clears the asker', !r.body.to[dee.user.id], JSON.stringify(r.body));
  r = await call('/api/friend/ask', { name: 'Dee' });
  as(dee);
  r = await call('/api/friend/answer', { name: 'Cy', accept: true });
  ok('second ask accepted', r.status === 200, JSON.stringify(r.body));
  as(cy);
  r = await call('/api/friend/remove', { name: 'Dee' });
  ok('remove', r.status === 200, JSON.stringify(r.body));
  r = await call('/api/friend/list', {});
  ok('remove clears the remover', !r.body.to[dee.user.id]);
  as(dee);
  r = await call('/api/friend/list', {});
  ok('remove clears the other side', !r.body.to[cy.user.id], JSON.stringify(r.body));

  /* ---- missing name and blocked are the same sentence ---- */
  as(bo);
  r = await call('/api/friend/block', { name: 'Dee' });
  ok('block', r.status === 200, JSON.stringify(r.body));
  as(dee);
  const blocked = await call('/api/friend/ask', { name: 'Bo' });
  const missing = await call('/api/friend/ask', { name: 'NoSuchWanderer' });
  ok('missing name and blocked are the same response', same(blocked, missing), JSON.stringify(blocked.body) + ' vs ' + JSON.stringify(missing.body));
  ok('that sentence is not a success', blocked.status === 404 && blocked.body.error === social.MISS);

  as(dee);
  const mailBlocked = await call('/api/mail/send', { name: 'Bo', text: 'are you there' });
  const mailMissing = await call('/api/mail/send', { name: 'NoSuchWanderer', text: 'are you there' });
  ok('mail to a blocked name matches a missing name', same(mailBlocked, mailMissing), JSON.stringify(mailBlocked.body) + ' vs ' + JSON.stringify(mailMissing.body));

  /* ---- letters ---- */
  as(ada);
  auth.rateClear('ml:' + ada.user.id);
  r = await call('/api/mail/send', { name: 'Bo', text: 'x'.repeat(241) });
  ok('a letter past 240 is refused', r.status === 400, JSON.stringify(r.body));
  as(bo);
  r = await call('/api/mail/list', {});
  ok('the refused letter was not stored', r.body.box && r.body.box.length === 0, JSON.stringify(r.body));

  as(ada);
  auth.rateClear('ml:' + ada.user.id);
  live.live.set(bo.user.id, { uid: bo.user.id, conn: {} });
  r = await call('/api/mail/send', { name: 'Bo', text: 'while you are here' });
  live.live.delete(bo.user.id);
  ok('mail to someone online is not boxed', r.status === 400, JSON.stringify(r.body));
  as(bo);
  r = await call('/api/mail/list', {});
  ok('online send wrote nothing', r.body.box && r.body.box.length === 0, JSON.stringify(r.body));

  as(bo);
  r = await call('/api/friend/quiet', { on: true });
  ok('not taking messages', r.status === 200 && r.body.closed === true, JSON.stringify(r.body));
  r = await call('/api/friend/list', {});
  ok('the flag sits on the friends row', r.body.closed === true && r.body.to[ada.user.id] && r.body.to[ada.user.id].state === 'friend' && Object.keys(r.body.to[ada.user.id]).sort().join(',') === 'at,name,state');
  ok('the flag survives a new table', new Table('friends').get(bo.user.id) && new Table('friends').get(bo.user.id).closed === true);
  as(ada);
  auth.rateClear('ml:' + ada.user.id);
  live.live.set(bo.user.id, { uid: bo.user.id, name: 'Bo', conn: {} });
  const quietOn = await call('/api/mail/send', { name: 'Bo', text: 'are you taking these' });
  live.live.delete(bo.user.id);
  const quietOff = await call('/api/mail/send', { name: 'Bo', text: 'are you taking these' });
  ok('not taking messages hides whether they are on', quietOn.status === 400 && quietOff.status === 400 && quietOn.body.error === social.QUIET && quietOn.body.error === quietOff.body.error, JSON.stringify(quietOn.body) + ' / ' + JSON.stringify(quietOff.body));
  as(bo);
  r = await call('/api/mail/list', {});
  ok('a refused quiet letter was not stored', !(r.body.box || []).some(m => m.text === 'are you taking these'), JSON.stringify(r.body.box));
  r = await call('/api/friend/quiet', { on: false });
  ok('taking messages again', r.status === 200 && r.body.closed === false, JSON.stringify(r.body));

  as(ada);
  auth.rateClear('ml:' + ada.user.id);
  const ids = [];
  let limited = false;
  for (let i = 0; i < 41; i++) {
    if (i > 0 && i % 10 === 0) {
      const stop = await call('/api/mail/send', { name: 'Bo', text: 'over the limit ' + i });
      if (i === 10) limited = stop.status === 429;
      auth.rateClear('ml:' + ada.user.id);
    }
    const sent = await call('/api/mail/send', { name: 'Bo', text: 'note ' + i });
    ids.push(sent.body && sent.body.id);
    if (sent.status !== 200) ok('send ' + i, false, JSON.stringify(sent.body));
  }
  ok('the 11th letter in the window is refused', limited);
  as(bo);
  r = await call('/api/mail/list', {});
  const box = r.body.box || [];
  ok('the 41st letter drops the oldest', box.length === 40 && !box.some(m => m.id === ids[0]) && box.some(m => m.id === ids[40]), 'len ' + box.length + ' first ' + ids[0]);
  ok('a letter is id, from, fromName, text, at, read', box.length && Object.keys(box[0]).sort().join(',') === 'at,from,fromName,id,read,text');
  const keep = ids[40];
  r = await call('/api/mail/read', { id: keep });
  ok('mark read', r.status === 200, JSON.stringify(r.body));
  r = await call('/api/mail/list', {});
  ok('read sticks', (r.body.box.find(m => m.id === keep) || {}).read === true);
  const mailed = new Table('mail');
  const row = mailed.get(bo.user.id);
  ok('a new table reads the mailbox back', !!(row && row.box.find(m => m.id === keep && m.read === true)));
  r = await call('/api/mail/del', { id: keep });
  ok('delete a letter', r.status === 200, JSON.stringify(r.body));
  r = await call('/api/mail/list', {});
  ok('deleted letter is gone', !(r.body.box || []).some(m => m.id === keep) && r.body.box.length === 39);

  /* ---- thirty days ---- */
  social.boxes.set(cy.user.id, { box: [
    { id: 'old', from: ada.user.id, fromName: 'Ada', text: 'stale', at: Date.now() - 31 * 864e5, read: false },
    { id: 'new', from: ada.user.id, fromName: 'Ada', text: 'fresh', at: Date.now() - 864e5, read: false }
  ] });
  social.onLogin(cy.user.id);
  as(cy);
  r = await call('/api/mail/list', {});
  ok('login drops mail older than 30 days', r.body.box && r.body.box.length === 1 && r.body.box[0].id === 'new', JSON.stringify(r.body.box));

  /* ---- delete, then the same name again ---- */
  as(bo);
  auth.rateClear('ml:' + bo.user.id);
  r = await call('/api/mail/send', { name: 'Ada', text: 'for your box' });
  ok('a letter reached Ada', r.status === 200, JSON.stringify(r.body));
  as(ada);
  r = await call('/api/delete', { pass: 'social-test-pass' });
  ok('delete account', r.status === 200, JSON.stringify(r.body));
  as(bo);
  r = await call('/api/friend/list', {});
  ok('the other list loses the deleted uid', !(r.body.to && r.body.to[ada.user.id]), JSON.stringify(r.body.to));
  const ada2 = account('Ada', 'ada-again@example.com');
  ok('the name can be registered again', ada2.user.id !== ada.user.id);
  as(ada2);
  r = await call('/api/friend/list', {});
  ok('the new Ada has no friends', r.body.to && Object.keys(r.body.to).length === 0, JSON.stringify(r.body));
  r = await call('/api/mail/list', {});
  ok('the new Ada has no mail', r.body.box && r.body.box.length === 0, JSON.stringify(r.body));
  as(bo);
  r = await call('/api/friend/list', {});
  ok('the old friend is not inherited', !(r.body.to && (r.body.to[ada.user.id] || r.body.to[ada2.user.id])), JSON.stringify(r.body.to));

  /* ---- cap, and blocks do not count ---- */
  const quinn = account('Quinn');
  const pals = [];
  for (let i = 0; i < 27; i++) pals.push(account('P' + String(i).padStart(2, '0')));
  as(quinn);
  let capped = null;
  for (let i = 0; i < 25; i++) {
    auth.rateClear('fr:' + quinn.user.id);
    const sent = await call('/api/friend/ask', { name: pals[i].user.name });
    if (sent.status !== 200) capped = sent;
  }
  ok('twenty-five asks fit', !capped, capped && JSON.stringify(capped.body));
  auth.rateClear('fr:' + quinn.user.id);
  r = await call('/api/friend/block', { name: pals[25].user.name });
  ok('a block still fits on a full list', r.status === 200, JSON.stringify(r.body));
  r = await call('/api/friend/list', {});
  let toward = 0;
  for (const id in r.body.to) {
    const s = r.body.to[id].state;
    if (s === 'friend' || s === 'pending') toward++;
  }
  ok('blocks do not count toward 25', toward === 25 && r.body.to[pals[25].user.id].state === 'blocked', 'toward ' + toward);
  auth.rateClear('fr:' + quinn.user.id);
  r = await call('/api/friend/ask', { name: pals[26].user.name });
  ok('the 26th friend is refused', r.status === 400 && r.body.error === 'The list holds 25.', JSON.stringify(r.body));
  r = await call('/api/friend/list', {});
  ok('the refused ask wrote nothing', !(r.body.to && r.body.to[pals[26].user.id]));

  /* ---- ten requests per ten minutes ---- */
  const rita = account('Rita');
  as(rita);
  let eleventh = null;
  for (let i = 0; i < 11; i++) {
    const sent = await call('/api/friend/ask', { name: 'Nobody' + i });
    if (i === 10) eleventh = sent;
    else if (sent.status !== 404) ok('probe ' + i, false, JSON.stringify(sent.body));
  }
  ok('the 11th request in the window is refused', eleventh && eleventh.status === 429, JSON.stringify(eleventh && eleventh.body));

  console.log(results.join('\n'));
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  server.close();
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
