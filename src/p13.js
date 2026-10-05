/* ================= parties, hostility, and the rig =================
   Loaded last, so everything else is already in scope. Inert unless the page is being
   served by the account server: on an Artifact or a file:// copy `mpOn()` is false and
   every hook below returns immediately, which is why none of them are guarded at the
   call sites.

   The rules are Diablo II's. A party is an invitation both sides agree to. Experience is
   split among the members who are actually in the district with you, weighted by level,
   with a bonus for the size of the party. Hostility is declared rather than ambient, it
   throws you out of the party, and it does not come back. Town is safe. */

const MP = {
  on: false, conn: null, me: null, roster: [], party: null, invite: null,
  others: [], hostile: {}, chat: [], sim: null, unread: 0, retry: 0, scope: 'all',
  maxParty: 8, pvpScale: .25, simZone: 6, lastMove: 0, note: ''
};

const mpOn = () => MP.on && !!MP.conn && MP.conn.readyState === 1;
const mpHostileTo = uid => !!MP.hostile[uid];

function mpSend(t, o) { if (mpOn()) try { MP.conn.send(JSON.stringify(Object.assign({ t }, o))); } catch (e) {} }

function mpConnect() {
  if (MP.conn || typeof WebSocket === 'undefined') return;
  /* Only the account server serves this page with a shim; anywhere else there is nobody
     to talk to and the game stays exactly as it was. */
  if (!window.claude || !window.claude.use || !location.protocol.startsWith('http')) return;
  let url;
  try { url = (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/live'; }
  catch (e) { return; }
  let c;
  try { c = new WebSocket(url); } catch (e) { return; }
  MP.conn = c;
  c.onopen = () => {
    MP.on = true; MP.retry = 0;
    mpHello();
    if (!MP.beat) MP.beat = setInterval(mpBeat, 100);
  };
  c.onmessage = ev => { let m; try { m = JSON.parse(ev.data); } catch (e) { return; } mpRecv(m); };
  c.onclose = () => {
    MP.on = false; MP.conn = null; MP.others = []; MP.party = null;
    /* Back off rather than hammering a server that is down or a session that expired. */
    if (MP.retry < 6) setTimeout(mpConnect, 2000 * Math.pow(2, MP.retry++));
  };
  c.onerror = () => {};
}

function mpHello() {
  if (!G) return;
  mpSend('hello', { lvl: G.lvl, cls: G.cls, zi: W ? W.zi : 0, hp: G.hp, hpm: S.maxHp, act: actOf ? actOf(W ? W.zi : 0) : 1 });
}

function mpSay(text) {
  MP.chat.push({ from: '', text, sys: 1, t: Date.now() });
  if (MP.chat.length > 120) MP.chat.shift();
  MP.unread++;
  toast(text);
}

function mpRecv(m) {
  if (m.t === 'you') {
    MP.me = { uid: m.uid, name: m.name };
    MP.maxParty = m.maxParty; MP.pvpScale = m.pvpScale; MP.simZone = m.simZone;
    mpHello();
  } else if (m.t === 'roster') {
    MP.roster = m.players || [];
  } else if (m.t === 'party') {
    MP.party = m.id ? m : null; MP.sim = m.sim || null; MP.invite = null;
  } else if (m.t === 'invited') {
    MP.invite = m;
    dlg(m.from + ' asks you to party', 'Level ' + m.lvl + ' ' + ((CLS[m.cls] || {}).n || 'stranger') +
      '. Experience in a party is split among whoever is in the district with you, by level, and there is more of it the more of you there are.',
      [['Join them', () => { mpSend('accept', { uid: m.uid }); MP.invite = null; }], ['Not now', () => { mpSend('decline', { uid: m.uid }); MP.invite = null; }]]);
  } else if (m.t === 'zone') {
    mpZone(m);
  } else if (m.t === 'chat') {
    MP.chat.push({ from: m.from, uid: m.uid, text: m.text, scope: m.scope, t: Date.now() });
    if (MP.chat.length > 120) MP.chat.shift();
    MP.unread++;
    if (mode !== 'sheet' || tab !== 'party') toast((m.scope === 'party' ? '[party] ' : '') + m.from + ': ' + m.text);
  } else if (m.t === 'hostile') {
    if (m.toUid === (MP.me && MP.me.uid)) MP.hostile[m.fromUid] = 1;
    mpSay(m.from + ' has declared hostility against ' + m.to + '.');
    sfx('err');
  } else if (m.t === 'full') {
    MP.note = m.text;
    MP.retry = 99;                 /* a full world is not a dropped connection; do not hammer it */
    dlg('The world is full', m.text + '\n\nYou can keep playing on your own — your character is saved either way — and the Party tab will say when there is room.', [['Carry on alone']]);
  } else if (m.t === 'sys') {
    mpSay(m.text);
  } else if (m.t === 'xp') {
    /* A party member's kill, already weighted and bonused by the server. */
    if (G && mode !== 'title') { gainXp(m.amount, 1); if (mode === 'play') float(P.x, P.y, '+' + m.amount + ' party', '#9fd0ff', 1); }
  } else if (m.t === 'quest') {
    if (G && G.q[m.k] !== undefined && G.q[m.k] < m.v) { G.q[m.k] = m.v; toast(m.from + ' finished ' + (QUESTS[m.k] ? QUESTS[m.k].n : m.k) + ' with you.'); }
  } else if (m.t === 'pvp') {
    mpTakeHit(m);
  } else if (m.t === 'kill') {
    mpSay(m.duel ? m.killer + ' took the duel against ' + m.dead + '.' : m.killer + ' has slain ' + m.dead + '.');
  } else if (m.t === 'sim') {
    mpSimMsg(m);
  }
}

/* ---------- other players in your district ---------- */
function mpZone(m) {
  const seen = {};
  for (const r of m.players) {
    seen[r.uid] = 1;
    let o = MP.others.find(q => q.uid === r.uid);
    if (!o) { o = { uid: r.uid, x: r.x, y: r.y, px: r.x, py: r.y }; MP.others.push(o); }
    /* Hold the previous position and interpolate toward the new one, so ten updates a
       second do not look like ten updates a second. */
    o.px = o.x; o.py = o.y; o.tx = r.x; o.ty = r.y; o.lerp = 0;
    o.name = r.name; o.lvl = r.lvl; o.cls = r.cls; o.dir = r.dir; o.hp = r.hp; o.hpm = r.hpm;
  }
  for (let i = MP.others.length - 1; i >= 0; i--) if (!seen[MP.others[i].uid]) MP.others.splice(i, 1);
}

/* One inert stand-in per hostile in your district, kept in W.ents so that everything the
   game already knows how to aim finds them. */
function mpSyncEnts() {
  if (!W || !W.ents) return;
  const safe = W.z && W.z.town;   /* town is safe, so there is nothing to aim at in one */
  for (let i = W.ents.length - 1; i >= 0; i--) {
    const e = W.ents[i];
    if (e.mp && !MP.others.some(o => o.uid === e.mp && mpHostileTo(o.uid))) W.ents.splice(i, 1);
  }
  for (const o of MP.others) {
    if (safe || !mpHostileTo(o.uid)) continue;
    let e = W.ents.find(q => q.mp === o.uid);
    if (!e) {
      e = { mp: o.uid, k: 'player', x: o.x, y: o.y, r: .55, sz: 1, hp: o.hp, max: o.hpm, flash: 0,
        ph: 0, mark: 0, slow: 0, ward: 0, stun: 0, aggro: 0, mods: {}, dmg: 0, name: o.name, hits: 0 };
      W.ents.push(e);
    }
    e.x = o.x; e.y = o.y; e.hp = o.hp; e.max = o.hpm;
  }
}

function mpHurt(e, d, crit) {
  const o = MP.others.find(q => q.uid === e.mp);
  if (!o) return;
  /* Shown locally straight away so the hit feels like a hit; the number that counts comes
     back from the server, which is also the only thing that decides whether it counted. */
  e.hp = Math.max(0, e.hp - d * MP.pvpScale);
  float(e.x, e.y, Math.round(d * MP.pvpScale) + (crit ? '!' : ''), '#ffb4ae', 0);
  parts(e.x, e.y, crit ? 5 : 2, ['#ffd27a', '#fff', '#ff9a3c'], 2.2);
  mpSend('pvp', { uid: e.mp, dmg: d, kind: crit ? 'crit' : '' });
}

/* Smoothing runs at frame rate, from update(). */
function mpTick(dt) {
  if (!mpOn() || !G) return;
  for (const o of MP.others) {
    if (o.lerp === undefined) continue;
    o.lerp = Math.min(1, o.lerp + dt * 9);
    o.x = o.px + (o.tx - o.px) * o.lerp;
    o.y = o.py + (o.ty - o.py) * o.lerp;
  }
}

/* Reporting where you are runs on its own clock, because update() stops while a dialog
   or a sheet is open and somebody reading their inventory has not left the district. */
function mpBeat() {
  if (!mpOn() || !G || !W || !P || mode === 'title') return;
  mpSyncEnts();
  MP.lastMove = performance.now();
  mpSend('move', {
    x: +P.x.toFixed(2), y: +P.y.toFixed(2), zi: W.zi,
    dir: Math.atan2(P.dir.y, P.dir.x),
    hp: Math.round(G.hp), hpm: Math.round(S.maxHp), inst: W.inst || null
  });
}

/* Drawn simply and labelled clearly: in a fight you need to know at a glance who is a
   friend, who has declared against you, and how close they are to going down. */
function mpDraw(o, X, Y) {
  const c = CLS[o.cls] || { col: '#9aa' }, hos = mpHostileTo(o.uid), mate = mpInParty(o.uid);
  shadow(X, Y, 11);
  ctx.strokeStyle = hos ? '#e2443c' : mate ? '#7be495' : '#6f6a86';
  ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.ellipse(X, Y, 14, 7, 0, 0, 6.283); ctx.stroke();
  const f = Math.cos(o.dir || 0) >= 0 ? 1 : -1, y = Y - 34;
  ctx.fillStyle = '#2a2436';
  ctx.fillRect(X - 4, y + 20, 3.5, 13); ctx.fillRect(X + 1, y + 20, 3.5, 13);
  box(X - 7, y + 7, 14, 15, 4, c.col);
  box(X - 5.5, y - 5, 11, 11, 4, '#d9c3a6');
  ctx.fillStyle = OL; ctx.fillRect(X - 3 + f * 1.5, y - 1, 1.6, 1.6); ctx.fillRect(X + 1 + f * 1.5, y - 1, 1.6, 1.6);
  /* health, then the name, then the mark if they have declared */
  const w = 30, hp = Math.max(0, Math.min(1, (o.hp || 0) / (o.hpm || 1)));
  ctx.fillStyle = 'rgba(8,6,14,.75)'; ctx.fillRect(X - w / 2, y - 18, w, 4);
  ctx.fillStyle = hos ? '#e2443c' : '#7be495'; ctx.fillRect(X - w / 2 + .5, y - 17.5, (w - 1) * hp, 3);
  ctx.font = '600 10px Cinzel,serif'; ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(8,6,14,.8)';
  const nm = (hos ? '⚔ ' : '') + o.name + ' · ' + o.lvl;
  const tw = ctx.measureText(nm).width;
  ctx.fillRect(X - tw / 2 - 3, y - 32, tw + 6, 12);
  ctx.fillStyle = hos ? '#f0918b' : mate ? '#9fe0b4' : '#cfc8dd';
  ctx.fillText(nm, X, y - 23);
  ctx.textAlign = 'left';
}

const mpInParty = uid => !!(MP.party && MP.party.members && MP.party.members.some(m => m.uid === uid));

/* ---------- experience and quests shared with the party ---------- */
function mpShareXp(v) {
  if (!mpOn() || !MP.party || !(v > 0)) return;
  mpSend('xp', { amount: Math.round(v) });
}
function mpShareQuest(k, v) {
  if (!mpOn() || !MP.party) return;
  mpSend('quest', { k, v });
}

/* ---------- fighting each other ----------
   Your client says it hit; the server decides whether the two of you are allowed to fight
   and scales the damage; their client applies it. A friend could cheat this, and the only
   honest answer is that this is a server for people who know each other. */
function mpPvp(dmg, kind, x, y) {
  if (!mpOn() || !(dmg > 0)) return false;
  let best = null, bd = 1.3;
  for (const o of MP.others) {
    if (!mpHostileTo(o.uid)) continue;
    const d = Math.hypot(o.x - x, o.y - y);
    if (d < bd) { bd = d; best = o; }
  }
  if (!best) return false;
  mpSend('pvp', { uid: best.uid, dmg, kind: kind || '' });
  float(best.x, best.y, Math.round(dmg * MP.pvpScale), '#ffb4ae', 1);
  return true;
}

function mpTakeHit(m) {
  if (!G || mode === 'title') return;
  if (mode === 'sheet') closeSheet();
  const was = G.hp;
  /* Through the game's own damage path, so armour and resistances apply to a person the
     same way they apply to a machine, and death — including the rig's painless kind —
     is the code that already exists rather than a second copy of it. */
  hurt(m.dmg, 0, { name: m.from, pvp: 1 });
  if (G.hp <= 0 && was > 0) mpSend('died', { uid: m.fromUid });
}

/* ---------- the rig ---------- */
function mpSimMsg(m) {
  if (m.action === 'open') {
    MP.sim = m.sim;
    dlg('The rig is booked', m.sim.mode === 'duel'
      ? m.by + ' has set the Simulator to duelling. Inside, hostility is the point: nothing you lose in there is real, and nothing you win is either. Declare against each other first, or you will both swing at nothing.'
      : m.by + ' has set the Simulator to waves, together. Everyone in the party fights the same wave, and the first to clear it moves everybody on.',
      [['Go to the rig', () => { enter(MP.simZone); }], ['Later']]);
  } else if (m.action === 'wave') {
    if (W && W.zi === MP.simZone && W.sim) { W.sim.wave = Math.max(W.sim.wave || 0, m.wave); toast('Wave ' + m.wave + '.'); }
  } else if (m.action === 'close') {
    MP.sim = null;
  }
}
function mpSimWave(w) { if (mpOn() && MP.party && W && W.zi === MP.simZone) mpSend('sim', { action: 'wave', wave: w }); }

/* ---------- the panel ---------- */
function mpPanel() {
  if (MP.note && !mpOn()) return '<p>' + esc(MP.note) + '</p><p>Your character is saved and nothing is lost by waiting. Reload to try again.</p>';
  if (!mpOn()) return '<p>Not connected to a game. Parties need the account server — on a single copy of the page there is nobody else to ask.</p>';
  const me = MP.me || {}, party = MP.party;
  let h = '';

  if (party) {
    const lead = party.leader;
    h += '<h3>Your party · ' + party.members.length + ' of ' + MP.maxParty + '</h3>';
    h += '<p style="font-size:13px">Experience is split among the members in the district with you, weighted by level, and there is more of it the more of you there are: ' +
      [1, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3][Math.min(7, party.members.length - 1)].toFixed(2).replace(/0$/, '') +
      '× at this size. Somebody standing in town is not helping.</p>';
    h += '<div class="list">';
    for (const m of party.members) {
      const you = m.uid === me.uid;
      h += '<div class="li on"><i style="background:' + ((CLS[m.cls] || {}).col || '#888') + '"></i><div><b>' + esc(m.name) + (m.uid === lead ? ' · leader' : '') + (you ? ' · you' : '') + '</b>' +
        '<span>Level ' + m.lvl + ' ' + ((CLS[m.cls] || {}).n || '') + ' · ' + mpWhere(m.zi) + '</span></div>' +
        (you ? '' : '<button class="ghost sm" data-mph="' + m.uid + '">Hostile</button>') + '</div>';
    }
    h += '</div>';
    h += '<div class="row"><button class="ghost" data-mpl="1">Leave the party</button></div>';
    if (party.leader === me.uid) {
      h += '<h3>The rig</h3><p style="font-size:13px">The Simulator takes a party. Waves together, or a duel — the rig is the one place a fight between you costs nothing, because nothing in it is real.</p>' +
        '<div class="row"><button class="ghost" data-mps="waves">Waves, together</button><button class="ghost" data-mps="duel">Duel in the rig</button></div>';
      if (MP.sim) h += '<div class="row"><button class="ghost" data-mps="close">Close the rig</button></div>';
    } else if (MP.sim) {
      h += '<h3>The rig is open · ' + MP.sim.mode + '</h3><div class="row"><button class="ghost" data-mpg="1">Go to the rig</button></div>';
    }
  } else {
    h += '<h3>You are alone</h3><p style="font-size:13px">Ask somebody below. A party shares experience by level among whoever is actually in the district, and shares quest progress with whoever is standing there when it happens.</p>';
  }

  const others = MP.roster.filter(r => r.uid !== me.uid);
  h += '<h3>In the world · ' + (MP.roster.length) + '</h3>';
  if (!others.length) h += '<p>Nobody else is on. The town is quieter than usual.</p>';
  else {
    h += '<div class="list">';
    for (const r of others) {
      const hos = mpHostileTo(r.uid) || (r.hostile || []).indexOf(me.uid) >= 0;
      const mate = mpInParty(r.uid);
      h += '<div class="li"><i style="background:' + ((CLS[r.cls] || {}).col || '#888') + '"></i><div><b' + (hos ? ' style="color:#e2443c"' : '') + '>' + esc(r.name) + (hos ? ' · hostile' : mate ? ' · with you' : '') + '</b>' +
        '<span>Level ' + r.lvl + ' ' + ((CLS[r.cls] || {}).n || '') + ' · ' + mpWhere(r.zi) + (r.party ? ' · in a party' : '') + '</span></div>' +
        (mate || hos ? '' : '<button class="ghost sm" data-mpi="' + r.uid + '">Invite</button>') +
        (hos ? '' : '<button class="ghost sm" data-mph="' + r.uid + '">Hostile</button>') + '</div>';
    }
    h += '</div>';
    h += '<p style="font-size:13px">Declaring hostility takes them out of your party and lets the two of you fight anywhere that is not a town. It cannot be taken back while you are both here — which is the only thing that makes it mean anything.</p>';
  }

  h += '<h3>Say something</h3>';
  h += '<div class="row"><button class="ghost' + (MP.scope === 'all' ? ' on' : '') + '" data-mpc="all">Everyone</button><button class="ghost' + (MP.scope === 'party' ? ' on' : '') + '" data-mpc="party">Party only</button></div>';
  h += '<div class="row"><input id="mpIn" maxlength="400" placeholder="' + (MP.scope === 'party' ? 'to your party' : 'to everyone') + '" style="flex:1;background:#0a0912;border:1px solid #3a3350;color:#e8e2d4;border-radius:6px;padding:10px;font:15px Georgia,serif"><button class="ghost" data-mpt="1" style="flex:0 0 72px">Send</button></div>';
  h += '<div class="list">';
  for (const c of MP.chat.slice(-30).reverse()) {
    h += '<div class="li"><div>' + (c.sys ? '<span style="color:#9a93ad">' + esc(c.text) + '</span>'
      : '<b>' + esc(c.from) + (c.scope === 'party' ? ' · party' : '') + '</b><span>' + esc(c.text) + '</span>') + '</div></div>';
  }
  h += '</div>';
  return h;
}

window.__mp={MP,send:mpSend,get on(){return mpOn()},get roster(){return MP.roster},get me(){return MP.me}};

function mpWhere(zi) {
  if (zi === undefined || zi === null) return 'somewhere';
  if (zi === MP.simZone) return 'the rig';
  const z = ZONES[zi];
  return z ? z.n : 'district ' + zi;
}

function mpClick(d) {
  if (d.mpi) { mpSend('invite', { uid: d.mpi }); return true; }
  if (d.mph) {
    const r = MP.roster.find(x => x.uid === d.mph);
    dlg('Declare against ' + ((r && r.name) || 'them') + '?',
      'They leave your party, the two of you can fight anywhere outside a town, and it does not come back while you are both in this world. Damage between players lands at ' +
      Math.round(MP.pvpScale * 100) + '% — people are much harder to put down than machines.',
      [['Declare', () => { MP.hostile[d.mph] = 1; mpSend('hostile', { uid: d.mph }); drawSheet(); }], ['Leave it']]);
    return true;
  }
  if (d.mpl) { mpSend('leave', {}); return true; }
  if (d.mpc) { MP.scope = d.mpc; drawSheet(); return true; }
  if (d.mps) {
    if (d.mps === 'close') mpSend('sim', { action: 'close' });
    else mpSend('sim', { action: 'open', mode: d.mps });
    return true;
  }
  if (d.mpg) { closeSheet(); enter(MP.simZone); return true; }
  if (d.mpt) {
    const i = document.getElementById('mpIn');
    if (i && i.value.trim()) { mpSend('chat', { text: i.value.trim(), scope: MP.scope }); i.value = ''; }
    return true;
  }
  return false;
}

/* ================= reporting a problem =================
   The report button is deliberately slow. Pressing it does not file anything: it opens an
   ask, with the game's own hold on the buttons, and then a form that will not send until
   all three questions are answered. A report that says "it broke" costs more time than it
   saves, so the form will not let you file one. */

const BUGERR = [];
if (typeof window !== 'undefined') {
  window.addEventListener('error', e => {
    BUGERR.push((e.message || 'error') + ' @ ' + (e.filename || '') + ':' + (e.lineno || 0));
    if (BUGERR.length > 20) BUGERR.shift();
  });
  window.addEventListener('unhandledrejection', e => {
    BUGERR.push('unhandled: ' + ((e.reason && e.reason.message) || e.reason || '?'));
    if (BUGERR.length > 20) BUGERR.shift();
  });
}

/* Everything the game knew at the moment, so a report does not depend on remembering. */
function bugState() {
  try {
    return {
      build: (document.title || '') + '',
      zone: W ? W.zi : null,
      zoneName: W && ZONES[W.zi] ? ZONES[W.zi].n : null,
      mode, lvl: G ? G.lvl : null, cls: G ? G.cls : null,
      hp: G ? Math.round(G.hp) : null, maxHp: S ? Math.round(S.maxHp) : null,
      act: G && actOf && W ? actOf(W.zi) : null,
      quests: G ? G.q : null, sats: G ? G.sats : null, credits: G ? Math.round(G.credits) : null,
      adopt: G ? G.adopt : null, cpi: G ? +G.cpi.toFixed(3) : null,
      party: MP.party ? MP.party.members.length : 0, online: mpOn(),
      screen: innerWidth + 'x' + innerHeight, time: G ? Math.round(G.time) : null
    };
  } catch (e) { return { broken: String(e && e.message) }; }
}

function bugAsk() {
  dlg('Before you file this',
    'Reports go to a person, not a queue, and every one of them gets read. So please only file one if something actually went wrong — a crash, something that did not happen when it should have, a number that was plainly incorrect, text that made no sense.\n\n' +
    'Not for things you would simply prefer were different; there is no way to tell those two apart from the other end.\n\n' +
    'You will be asked three questions, and all three need an answer: what you were doing, what happened, and what you expected instead. The third one is the useful one.',
    [['Something went wrong', bugForm], ['Never mind']], 4);
}

let bugBox = null;
function bugForm() {
  if (!bugBox) {
    bugBox = document.createElement('div');
    bugBox.id = 'bugw';
    document.body.appendChild(bugBox);
  }
  const st = bugState();
  bugBox.innerHTML =
    '<div class="bugp"><h2>What happened?</h2>' +
    '<p>Plain words are fine. The more precisely you can say what you expected, the faster it gets fixed.</p>' +
    '<label>What were you doing?</label><textarea id="bg1" rows="2" placeholder="Fighting the thing in the Vaults, about to pick up a drop…"></textarea>' +
    '<label>What happened?</label><textarea id="bg2" rows="3" placeholder="The screen went black and the buttons stopped working."></textarea>' +
    '<label>What should have happened instead?</label><textarea id="bg3" rows="2" placeholder="It should have dropped the item and carried on."></textarea>' +
    '<div class="bugm" id="bgm"></div>' +
    '<p class="bugs">Sent with this: ' + esc('district ' + (st.zone === null ? '?' : st.zone) + (st.zoneName ? ' (' + st.zoneName + ')' : '') + ', level ' + st.lvl + ' ' + ((CLS[st.cls] || {}).n || '?') + ', ' + BUGERR.length + ' recorded error' + (BUGERR.length === 1 ? '' : 's')) + '. No email address, nothing you typed anywhere else.</p>' +
    '<div class="bugr"><button class="big" id="bgSend">Send the report</button><button class="ghost" id="bgNo">Cancel</button></div></div>';
  bugBox.hidden = false;
  document.getElementById('bgNo').onclick = () => { bugBox.hidden = true; };
  document.getElementById('bgSend').onclick = bugSend;
}

function bugSend() {
  const v = id => (document.getElementById(id).value || '').trim();
  const doing = v('bg1'), happened = v('bg2'), expected = v('bg3');
  const m = document.getElementById('bgm');
  if (doing.length < 5 || happened.length < 10 || expected.length < 5) {
    m.className = 'bugm err';
    m.textContent = 'All three, please — and the second one in a full sentence. A report without them cannot be acted on, which is worse than no report at all.';
    return;
  }
  const body = { doing, happened, expected, where: location.href.split('?')[0], state: bugState(), errors: BUGERR.slice() };
  m.className = 'bugm'; m.textContent = 'Sending…';
  const btn = document.getElementById('bgSend');
  btn.disabled = true;

  const offline = () => {
    /* No server to take it: hand the report back as text, so it can still be sent on. */
    m.className = 'bugm';
    const txt = 'Unsubscribe 2087 bug report\n\nDoing: ' + doing + '\nHappened: ' + happened + '\nExpected: ' + expected +
      '\n\nState: ' + JSON.stringify(body.state) + '\nErrors: ' + BUGERR.join(' | ');
    try {
      navigator.clipboard.writeText(txt);
      m.textContent = 'This copy of the game has nowhere to send it, so the whole report is on your clipboard instead. Paste it wherever you got the game.';
    } catch (e) {
      m.textContent = 'This copy has nowhere to send it. Here it is to copy by hand:\n\n' + txt;
    }
    btn.disabled = false;
  };

  if (!location.protocol.startsWith('http')) return offline();
  fetch('/api/bug', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(body) })
    .then(r => r.json().then(j => {
      if (!r.ok) throw new Error(j.error || ('server said ' + r.status));
      m.className = 'bugm good';
      m.textContent = 'Filed. Thank you — that is genuinely useful.';
      setTimeout(() => { bugBox.hidden = true; }, 1800);
    }))
    .catch(offline);
}
