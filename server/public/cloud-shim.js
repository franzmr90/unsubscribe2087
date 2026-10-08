/* The bridge between this server and the game, loaded before the game bundle.

   The game already knows how to save to an account: it asks for `window.claude.use('user')`
   and `window.claude.use('db')` and then reads and writes documents. That interface is the
   whole contract, so this file implements it against this server and the game needs no
   change at all — the same build runs here and as an Artifact.

   It also puts the sign-in panel on screen, because the game has no idea accounts exist. */
(function () {
  'use strict';
  var me = null, csrf = '', booted = false, inviteRequired = false;

  /* The game looks for this before it tries to open a socket. Only this server serves the
     page with this file in it, so only here is there anybody to talk to. */
  window.__u2087server = true;

  function api(path, body, method) {
    var opt = { method: method || 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin' };
    if (csrf) opt.headers['X-CSRF'] = csrf;
    if (body !== undefined) opt.body = JSON.stringify(body);
    if (opt.method === 'GET') { delete opt.body; delete opt.headers['Content-Type']; }
    return fetch(path, opt).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok) throw new Error(j.error || ('Server said ' + r.status));
        return j;
      });
    });
  }

  var ready = api('/api/me', undefined, 'GET').then(function (j) {
    me = j.user; csrf = j.csrf || '';
    inviteRequired = !!j.inviteRequired;
    return j;
  }).catch(function () { return {}; });

  /* ---- the interface the game asks for ---- */
  window.claude = {
    use: function (kind) {
      return ready.then(function () {
        if (!me) return null;
        if (kind === 'user') return { id: function () { return Promise.resolve(me.id); } };
        if (kind === 'db') {
          return {
            collection: function () {
              return {
                doc: function (id) {
                  return {
                    get: function () {
                      return api('/api/doc/get', { id: id }).then(function (r) {
                        return { exists: r.exists, data: function () { return r.data; } };
                      });
                    },
                    set: function (data) { return api('/api/doc/set', { id: id, data: data }); },
                    delete: function () { return api('/api/doc/del', { id: id }); }
                  };
                }
              };
            }
          };
        }
        return null;
      });
    }
  };

  /* ---- the panel ---- */
  var CSS = '\
#acc{position:fixed;inset:0;z-index:9000;background:rgba(6,5,12,.92);display:flex;align-items:center;justify-content:center;padding:18px;overflow:auto;font-family:Cinzel,Georgia,serif;color:#e8e2d4}\
#acc.off{display:none}\
#accBox{width:100%;max-width:400px;background:linear-gradient(180deg,#171426,#0f0d18);border:1px solid #3a3350;border-radius:10px;padding:20px;box-shadow:0 18px 50px rgba(0,0,0,.6)}\
#accBox h2{margin:0 0 4px;font-size:21px;color:#d9b45c;letter-spacing:.5px}\
#accBox p.sub{margin:0 0 16px;font-size:13px;color:#9a93ad;font-family:Georgia,serif;line-height:1.5}\
#accBox label{display:block;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:#8d86a3;margin:12px 0 5px}\
#accBox input{width:100%;box-sizing:border-box;background:#0a0912;border:1px solid #3a3350;color:#e8e2d4;border-radius:6px;padding:11px;font-size:15px;font-family:Georgia,serif}\
#accBox input:focus{outline:none;border-color:#d9b45c}\
#accBox button{width:100%;margin-top:14px;padding:12px;border-radius:6px;border:1px solid #6b5a2a;background:linear-gradient(180deg,#e2c877,#b8923d);color:#231a07;font-weight:700;font-size:15px;font-family:Cinzel,serif;letter-spacing:.6px;cursor:pointer}\
#accBox button.ghost{background:transparent;color:#b3abc4;border-color:#3a3350;font-weight:400}\
#accBox button:disabled{opacity:.5;cursor:default}\
#accTabs{display:flex;gap:6px;margin-bottom:6px}\
#accTabs button{flex:1;margin:0;padding:9px 4px;font-size:12px;background:transparent;border-color:#3a3350;color:#9a93ad;font-weight:400}\
#accTabs button.on{background:#241f38;color:#e8e2d4;border-color:#5b5080}\
#accMsg{margin-top:12px;font-size:13px;font-family:Georgia,serif;line-height:1.5;min-height:1px}\
#accMsg.err{color:#e2706a}#accMsg.good{color:#86c48a}\
#accFoot{margin-top:14px;font-size:12px;color:#7d7693;font-family:Georgia,serif;line-height:1.5}\
#accFoot a{color:#b89a5a;cursor:pointer;text-decoration:underline}\
#accTag{position:fixed;top:0;right:0;z-index:8000;padding:6px 10px;font:600 11px Cinzel,serif;letter-spacing:.8px;color:#9a93ad;background:rgba(10,9,18,.8);border-bottom-left-radius:8px;border:1px solid #2a2440;border-top:0;border-right:0;cursor:pointer}\
#accRow{display:flex;gap:8px}#accRow button{flex:1}';

  var box, msgEl, mode = 'in', pending = false;

  function el(id) { return document.getElementById(id); }
  function say(t, cls) { if (msgEl) { msgEl.textContent = t || ''; msgEl.className = cls || ''; } }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }

  function mount() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var d = document.createElement('div'); d.id = 'acc'; d.className = 'off';
    d.innerHTML = '<div id="accBox"></div>';
    document.body.appendChild(d);
    var tag = document.createElement('div'); tag.id = 'accTag'; tag.hidden = true;
    tag.onclick = function () { open(me ? 'acct' : 'in'); };
    document.body.appendChild(tag);
    box = el('accBox');
  }

  function tag() {
    var t = el('accTag');
    if (!t) return;
    t.hidden = false;
    t.textContent = me ? me.name : 'SIGN IN';
  }

  function open(m) { mode = m || mode; el('acc').className = ''; draw(); }
  function close() { el('acc').className = 'off'; tag(); }

  var QS = new URLSearchParams(location.search);
  var linkToken = QS.get('t');
  var linkKind = /\/reset/.test(location.pathname) ? 'reset' : /\/verify/.test(location.pathname) ? 'verify' : null;

  function draw() {
    var h = '';
    if (mode === 'in' || mode === 'up') {
      h += '<div id="accTabs"><button data-m="in" class="' + (mode === 'in' ? 'on' : '') + '">Sign in</button>' +
        '<button data-m="up" class="' + (mode === 'up' ? 'on' : '') + '">New account</button></div>';
    }
    if (mode === 'in') {
      h += '<h2>Welcome back</h2><p class="sub">Your characters follow you to any device you sign in on.</p>' +
        '<label>Name</label><input id="f_name" autocomplete="username" autocapitalize="off">' +
        '<label>Password</label><input id="f_pass" type="password" autocomplete="current-password">' +
        '<button id="go">Sign in</button>' +
        '<div id="accMsg"></div>' +
        '<div id="accFoot"><a data-m="forgot">Forgotten your password?</a> &middot; <a data-m="skip">Play without an account</a></div>';
    } else if (mode === 'up') {
      h += '<h2>Make an account</h2><p class="sub">An email address is optional, and the only way to recover a forgotten password or mail yourself a backup.</p>' +
        '<label>Name</label><input id="f_name" autocomplete="username" autocapitalize="off">' +
        '<label>Password</label><input id="f_pass" type="password" autocomplete="new-password">' +
        '<label>Email (optional)</label><input id="f_email" type="email" autocomplete="email" autocapitalize="off">' +
        (inviteRequired ? '<label>Invite code</label><input id="f_invite" autocomplete="off" autocapitalize="off">' : '') +
        '<button id="go">Create it</button><div id="accMsg"></div>' +
        '<div id="accFoot"><a data-m="skip">Play without an account</a></div>';
    } else if (mode === 'forgot') {
      h += '<h2>Recover your account</h2><p class="sub">Give the address on the account and a one-time link comes back. It expires in half an hour.</p>' +
        '<label>Email</label><input id="f_email" type="email" autocomplete="email" autocapitalize="off">' +
        '<button id="go">Send the link</button><div id="accMsg"></div>' +
        '<div id="accFoot"><a data-m="in">Back to signing in</a></div>';
    } else if (mode === 'reset') {
      h += '<h2>Choose a new password</h2><p class="sub">Setting it signs out every other device, which is the point.</p>' +
        '<label>New password</label><input id="f_pass" type="password" autocomplete="new-password">' +
        '<button id="go">Set it</button><div id="accMsg"></div>';
    } else if (mode === 'acct') {
      h += '<h2>' + esc(me.name) + '</h2><p class="sub">' +
        (me.email ? esc(me.email) + (me.verified ? ' &middot; confirmed' : ' &middot; unconfirmed') : 'No email on this account, so there is no way to recover it and no way to mail yourself a backup.') +
        '</p>' +
        '<label>Email</label><input id="f_email" type="email" value="' + esc(me.email || '') + '" autocapitalize="off">' +
        '<label>Current password</label><input id="f_old" type="password" autocomplete="current-password">' +
        '<label>New password (leave blank to keep it)</label><input id="f_pass" type="password" autocomplete="new-password">' +
        '<button id="go">Save changes</button>' +
        '<button class="ghost" id="bk">Email me a backup</button>' +
        '<button class="ghost" id="rs">Restore from a backup file</button>' +
        '<div id="accRow"><button class="ghost" id="out">Sign out</button><button class="ghost" id="del">Delete account</button></div>' +
        '<div id="accMsg"></div>' +
        '<div id="accFoot"><a data-m="skip">Back to the game</a></div>';
    }
    box.innerHTML = h;
    msgEl = el('accMsg');
    box.onclick = function (e) {
      var m = e.target.getAttribute && e.target.getAttribute('data-m');
      if (m === 'skip') return close();
      if (m) { mode = m; draw(); }
    };
    var go = el('go'); if (go) go.onclick = submit;
    ['f_name', 'f_pass', 'f_email', 'f_old'].forEach(function (id) {
      var i = el(id); if (i) i.onkeydown = function (e) { if (e.key === 'Enter') submit(); };
    });
    if (el('out')) el('out').onclick = function () { api('/api/logout').then(function () { location.href = '/'; }); };
    if (el('bk')) el('bk').onclick = function () {
      say('Sending…'); api('/api/backup').then(function (r) { say('Sent to ' + r.to + '.', 'good'); }).catch(function (e) { say(e.message, 'err'); });
    };
    if (el('rs')) el('rs').onclick = pickBackup;
    if (el('del')) el('del').onclick = function () {
      var p = el('f_old').value;
      if (!p) return say('Type your current password first — deleting an account asks for it.', 'err');
      if (!confirm('Delete this account and every character on it? This cannot be undone.')) return;
      api('/api/delete', { pass: p }).then(function () { location.href = '/'; }).catch(function (e) { say(e.message, 'err'); });
    };
    var first = el('f_name') || el('f_email') || el('f_pass');
    if (first) try { first.focus(); } catch (e) {}
  }

  function pickBackup() {
    var inp = document.createElement('input');
    inp.type = 'file'; inp.accept = '.json,application/json';
    inp.onchange = function () {
      var f = inp.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        var j; try { j = JSON.parse(r.result); } catch (e) { return say('That file is not readable JSON.', 'err'); }
        if (!j.docs) return say('That is not a backup from this game.', 'err');
        if (!confirm('Restore ' + Object.keys(j.docs).length + ' saved documents? Anything on this account with the same name is overwritten.')) return;
        api('/api/restore', { docs: j.docs }).then(function (res) {
          say('Restored ' + res.restored + '. Reloading…', 'good');
          setTimeout(function () { location.href = '/'; }, 900);
        }).catch(function (e) { say(e.message, 'err'); });
      };
      r.readAsText(f);
    };
    inp.click();
  }

  function submit() {
    if (pending) return;
    var go = el('go');
    var name = el('f_name') && el('f_name').value.trim();
    var pass = el('f_pass') && el('f_pass').value;
    var email = el('f_email') && el('f_email').value.trim();
    var old = el('f_old') && el('f_old').value;
    var req;
    if (mode === 'in') req = api('/api/login', { name: name, pass: pass });
    else if (mode === 'up') req = api('/api/register', { name: name, pass: pass, email: email || undefined, invite: (el('f_invite') && el('f_invite').value.trim()) || undefined });
    else if (mode === 'forgot') req = api('/api/forgot', { email: email });
    else if (mode === 'reset') req = api('/api/reset', { token: linkToken, pass: pass });
    else if (mode === 'acct') req = saveAccount(email, old, pass);
    if (!req) return;
    pending = true; if (go) go.disabled = true;
    say('Working…');
    req.then(function (r) {
      pending = false; if (go) go.disabled = false;
      if (mode === 'forgot') return say('If that address has an account, a link is on its way. Check the spam folder before asking again.', 'good');
      if (mode === 'acct') { say('Saved.', 'good'); return refresh(); }
      /* Signing in changes which save the game should load, so start it over cleanly. */
      location.href = '/';
    }).catch(function (e) {
      pending = false; if (go) go.disabled = false;
      say(e.message, 'err');
    });
  }

  function saveAccount(email, old, pass) {
    var chain = Promise.resolve();
    if (email !== (me.email || '')) chain = chain.then(function () { return api('/api/email', { email: email, pass: old }); });
    if (pass) chain = chain.then(function () { return api('/api/password', { old: old, pass: pass }); }).then(function (r) { csrf = r.csrf || csrf; });
    return chain;
  }

  function refresh() {
    return api('/api/me', undefined, 'GET').then(function (j) { me = j.user; csrf = j.csrf || ''; inviteRequired = !!j.inviteRequired; tag(); draw(); });
  }

  function boot() {
    if (booted) return; booted = true;
    mount();
    ready.then(function () {
      tag();
      if (linkKind === 'reset' && linkToken) { mode = 'reset'; return open(); }
      if (linkKind === 'verify' && linkToken) {
        return api('/api/verify', { token: linkToken }).then(function () {
          return refresh().then(function () { mode = 'acct'; open(); say('Address confirmed.', 'good'); });
        }).catch(function (e) { mode = me ? 'acct' : 'in'; open(); say(e.message, 'err'); });
      }
      /* Someone who has played here before and signed out gets the panel; a first-time
         visitor gets the game, and the corner tag if they want an account later. */
      if (!me && localStorage.getItem('u2087_seen')) open('in');
      else if (!me) { try { localStorage.setItem('u2087_seen', '1'); } catch (e) {} }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
