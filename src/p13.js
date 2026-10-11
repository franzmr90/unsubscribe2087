/* ================= parties, hostility, and the rig =================
   Loaded last, so everything else is already in scope. Inert unless the page is being
   served by the account server: on an Artifact or a file:// copy `mpOn()` is false and
   every hook below returns immediately, which is why none of them are guarded at the
   call sites.

   The rules are Diablo II's. A party is an invitation both sides agree to. Experience in
   the district is one pool, a third again the kill, split by level. Hostility is declared
   in town, it throws you out of the party, and standing down clears only your own flag. Town is safe. */

const MP = {
  on: false, conn: null, me: null, roster: [], party: null, invite: null,
  others: [], hostile: {}, chat: [], sim: null, unread: 0, retry: 0, scope: 'game',
  maxParty: 8, maxGame: 8, pvpScale: .25, simZone: 6, lastMove: 0, note: '',
  game: null, lobby: [], diffs: null, scale: null, view: 'lobby',
  mkName: '', mkDiff: 'normal', mkPass: '',
  voice: false, muted: {}, speaking: {}, peers: {}, stream: null,
  friends: {}, face: {}, joinUid: '', csrf: '',
  whispers: [], whisperTo: '', mail: [], closed: false, portalUntil: 0,
  resume: null, gamePass: '', buildAsked: false, trade: null, tradeLock: null,
  maps: {}, mapAsked: null, wantEnter: null, freshFor: null, freshBase: -1,
  mobHost: '', mobNext: '', mobAt: 0, mobSeqSent: 0, mobSnap: null
};

const mpOn = () => MP.on && !!MP.conn && MP.conn.readyState === 1;
const mpIn = () => mpOn() && !!MP.game;

/* The server names the seed for this game, this district, this tier. Solo play
   never asks, so a character's own districts stay where they were. */
function mpMapLatest(zi, tier) {
  let b = null;
  for (const k in MP.maps) {
    const m = MP.maps[k];
    if (m && m.zi === zi && m.tier === tier && (!b || m.roll > b.roll)) b = m;
  }
  return b;
}
function mpStoreMaps(rows) {
  if (!rows) return;
  for (const m of rows) {
    if (!m || m.seed == null || !m.key) continue;
    MP.maps[m.key] = m;
  }
}
function mpZoneTpl(zi) {
  const z = ZONES[zi];
  if (!z || (!z.sub && !z.secret)) return null;
  const tpl = { n: z.n, lvl: z.lvl, style: z.style, mix: z.mix, out: z.out ? 1 : 0, su: z.su || null };
  if (z.sub && typeof SUBP !== 'undefined' && SUBP) tpl.sub = SUBP;
  return tpl;
}
function mpApplyTpl(zi, tpl) {
  const z = ZONES[zi];
  if (!z || !tpl) return;
  if (tpl.n) z.n = tpl.n;
  if (tpl.lvl != null) z.lvl = tpl.lvl;
  if (tpl.style) z.style = tpl.style;
  if (tpl.mix) z.mix = tpl.mix;
  if (tpl.out) z.out = 1;
  if (tpl.su) z.su = tpl.su;
  if (tpl.sub && z.sub) SUBP = tpl.sub;
}
function mpZoneBag(zi) {
  if (!mpIn() || !G) return null;
  const z = ZONES[zi];
  if (!z || z.sim) return null;
  const tier = z.town ? 0 : (G.tier | 0);
  const have = mpMapLatest(zi, tier);
  if (!have) return null;
  return ZS[have.key] || null;
}
function mpMapContinue() {
  const w = MP.wantEnter;
  if (!w) return;
  const spec = mpMapSpec(w.zi, w.o);
  if (!spec || spec.wait) return;
  MP.wantEnter = null;
  enter(w.zi, w.o);
}
function mpMapSpec(zi, o) {
  if (!mpIn() || !G || !ZONES[zi] || ZONES[zi].sim) return null;
  const tier = ZONES[zi].town ? 0 : (G.tier | 0);
  if (o && o.fresh && MP.freshFor !== o) {
    const have = mpMapLatest(zi, tier);
    MP.freshFor = o;
    MP.freshBase = have ? have.roll : -1;
    MP.wantEnter = { zi, o };
    MP.mapAsked = null;
    mpSend('map', { zi, tier, fresh: 1, tpl: mpZoneTpl(zi) });
    return { wait: true };
  }
  if (o && o.fresh && MP.freshFor === o) {
    const have = mpMapLatest(zi, tier);
    if (!have || have.roll <= MP.freshBase) { MP.wantEnter = { zi, o }; return { wait: true }; }
  }
  const have = mpMapLatest(zi, tier);
  if (!have) {
    MP.wantEnter = { zi, o: o || {} };
    if (!MP.mapAsked || MP.mapAsked.zi !== zi || MP.mapAsked.tier !== tier) {
      MP.mapAsked = { zi, tier };
      mpSend('map', { zi, tier, fresh: 0 });
    }
    return { wait: true };
  }
  return { seed: have.seed, key: have.key, roll: have.roll, tpl: have.tpl || null };
}
/* A game owns its difficulty, and a district owns its tier. Both used to be read off
   whoever was looking: two people in one game, on different difficulties, generated
   different monsters from the same seed and the mob sync -- keyed on tier -- quietly
   matched nothing. Joining binds the character to the game instead.

   This is not beginDifficulty. Nothing of the character's story is reset: quests, acts
   and the gate are theirs and survive. Only the world is dropped, because it was built
   at the old numbers. */
function mpBindGame(g) {
  if (!G || !g) return;
  const d = mpDiffIndex(g.diff);
  const tierWas = G.tier | 0;
  if ((G.diff | 0) === d && !tierWas) return;
  G.diff = d;
  /* More is a solo ladder. In a shared district everyone must stand on the same rung,
     and the server has no notion of one, so the rung is the ground. */
  G.tier = 0;
  if (typeof resetZones === 'function') resetZones();
  /* Re-enter where they stand so the district is rebuilt at the game's numbers. W is
     left alone: in a game enter() waits on the server for the seed and returns without
     building anything, so dropping the world first leaves the renderer with nothing. */
  if (typeof W !== 'undefined' && W && typeof enter === 'function' && mode === 'play') enter(W.zi, { fresh: 1 });
  const bits = [];
  bits.push('This game is ' + ((DIFFS[d] && DIFFS[d].n) || 'Normal') + '.');
  if (tierWas) bits.push('More is off while you are in it.');
  toast(bits.join(' '));
}

function mpWaveSeed(n) {
  const s = MP.sim && MP.sim.seed;
  if (!s) return null;
  let x = (s ^ Math.imul(n | 0, 0x9E3779B1)) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x7FEB352D);
  return ((x ^ (x >>> 15)) >>> 0) || 1;
}

/* Monsters get tougher with the number of people in the game and with the difficulty it
   was made on, the way Diablo II's did. These feed the multipliers the game already had
   for its companion pressure, so nothing else in the combat maths had to change. */
const mpHp = () => (mpIn() && MP.scale ? MP.scale.hp : 1);
const mpDmg = () => (mpIn() && MP.scale ? MP.scale.dmg : 1);
const mpXp = () => (mpIn() && MP.scale ? MP.scale.xp : 1);
/* normal/hard/brutal <-> 0/1/2. The server names the game's difficulty; the page owns
   what the name costs you, so everything is multiplied once. */
const MPDIFFK = ['normal', 'hard', 'brutal'];
function mpDiffIndex(k) {
  const d = MP.diffs && MP.diffs[k];
  if (d && d.i != null) return Math.max(0, Math.min(2, d.i | 0));
  const i = MPDIFFK.indexOf(k);
  return i < 0 ? 0 : i;
}
/* Hostility, from the only place that knows it for certain. MP.hostile remembers the
   declarations this browser watched arrive, but it is empty after a reconnect and for
   anyone who joined after the fact, while the server keeps the flags and ships them on
   every roster. Reading both means the stand-in you can hit and the name painted red
   can never disagree, which is what made a declared hostile unattackable. */
function mpHostileTo(uid) {
  if (!uid) return false;
  if (MP.hostile[uid]) return true;
  const me = MP.me && MP.me.uid;
  if (!me || uid === me) return false;
  for (let i = 0; i < (MP.roster || []).length; i++) {
    const r = MP.roster[i];
    if (!r || !r.hostile || !r.hostile.length) continue;
    if (r.uid === uid && r.hostile.indexOf(me) >= 0) return true;
    if (r.uid === me && r.hostile.indexOf(uid) >= 0) return true;
  }
  return false;
}

function mpSend(t, o) { if (mpOn()) try { MP.conn.send(JSON.stringify(Object.assign({ t }, o))); } catch (e) {} }

function mpConnect() {
  if (MP.conn || typeof WebSocket === 'undefined') return;
  /* Only the account server serves this page, and it says so by setting this marker.
     Testing for window.claude would not do: the Artifact host provides one too, and the
     game would sit there trying to open a socket to a host that has never heard of it. */
  if (!window.__u2087server || !location.protocol.startsWith('http')) return;
  let url;
  try { url = (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/live'; }
  catch (e) { return; }
  let c;
  try { c = new WebSocket(url); } catch (e) { return; }
  MP.conn = c;
  c.onopen = () => {
    MP.on = true; MP.retry = 0;
    mpHello();
    /* The server holds a dropped place for a short while. If that window has closed
       and the game is still up, ask to be let back in. A password we already typed
       rides along; a wrong one comes back as a normal join failure. */
    if (MP.resume && MP.resume.id) mpSend('game.join', { id: MP.resume.id, pass: MP.resume.pass || '' });
    if (!MP.beat) MP.beat = setInterval(mpBeat, 100);
  };
  c.onmessage = ev => { let m; try { m = JSON.parse(ev.data); } catch (e) { return; } mpRecv(m); };
  c.onclose = () => {
    MP.on = false; MP.conn = null; MP.others = [];
    if (MP.beat) { clearInterval(MP.beat); MP.beat = null; }
    if (MP.game && MP.game.id) MP.resume = { id: MP.game.id, pass: MP.gamePass || '' };
    /* Keep trying, with the wait capped, until the tab is closed or the server says
       the world is full. Six tries used to stop for good and never rejoin the game. */
    if (MP.retry >= 12) { mpSay('Could not reconnect.'); return; }
    const waitMs = Math.min(15000, 1000 * Math.pow(2, MP.retry++));
    if (MP.retry === 1) mpSay('Connection lost. Reconnecting…');
    setTimeout(mpConnect, waitMs);
  };
  c.onerror = () => {};
}

let mpAnnounced = '';
function mpHello() {
  if (!G) return;
  mpAnnounced = G.cls || '';
  mpSend('hello', { lvl: G.lvl, cls: G.cls, zi: W ? W.zi : 0, hp: G.hp, hpm: S.maxHp, act: actOf ? actOf(W ? W.zi : 0) : 1, resume: 1 });
}

function mpSay(text) {
  MP.chat.push({ from: '', text, sys: 1, t: Date.now() });
  if (MP.chat.length > 120) MP.chat.shift();
  MP.unread++;
  mpChatDraw();
  toast(text);
}

function mpRecv(m) {
  if (m.t === 'you') {
    MP.me = { uid: m.uid, name: m.name };
    MP.maxParty = m.maxParty; MP.pvpScale = m.pvpScale; MP.simZone = m.simZone;
    if (m.turn && m.turn.urls) {
      RTC_CFG.iceServers = RTC_CFG.iceServers.filter(s => !s.turn);
      RTC_CFG.iceServers.push(Object.assign({ turn: 1 }, m.turn));
    }
    if (m.build && window.__BUILD && m.build !== window.__BUILD && !MP.buildAsked) {
      MP.buildAsked = true;
      dlg('This page is out of date', 'The server is running a newer build. Reload to pick it up. Your character is saved.', [['Reload', () => location.reload()], ['Not now']]);
    }
    mpHello();
    mpFriendsLoad();
  } else if (m.t === 'roster') {
    MP.roster = m.players || [];
    if (m.game) MP.game = m.game;
    if (m.scale) MP.scale = m.scale;
    mpVoiceSync();
    if (mode === 'sheet' && tab === 'party') drawSheet();
  } else if (m.t === 'lobby') {
    MP.lobby = m.games || []; MP.diffs = m.diffs || MP.diffs;
    MP.maxGame = m.max || MP.maxGame;
    if (mode === 'sheet' && tab === 'party') drawSheet();
  } else if (m.t === 'map') {
    mpStoreMaps([m]);
    mpMapContinue();
  } else if (m.t === 'game') {
    const prevId = MP.game && MP.game.id;
    const nextId = m.game && m.game.id;
    if (prevId !== nextId) { MP.maps = {}; MP.mapAsked = null; MP.freshFor = null; MP.freshBase = -1; MP.wantEnter = null; MP.mobHost = ''; MP.mobNext = ''; MP.mobSnap = null; }
    MP.game = m.game; MP.scale = m.scale || null;
    MP.view = m.game ? 'game' : 'lobby';
    if (m.maps) mpStoreMaps(m.maps);
    if (m.game) mpBindGame(m.game);
    if (!m.game) {
      MP.resume = null; MP.gamePass = '';
      MP.maps = {};
      MP.roster = []; MP.others = []; MP.party = null; MP.hostile = {}; MP.sim = null;
      MP.speaking = {}; MP.chat = []; MP.mobHost = ''; MP.mobNext = ''; MP.mobSnap = null;
      mpVoiceStop();
      if (W && W.ents) for (let i = W.ents.length - 1; i >= 0; i--) if (W.ents[i].mp) W.ents.splice(i, 1);
      toast('You have left the game. Your character is saved.');
    }
    else {
      MP.resume = { id: m.game.id, pass: MP.gamePass || '' };
      toast((m.resumed ? 'Back in "' : 'In "') + m.game.name + '" \u00b7 ' + m.game.diffName + ' \u00b7 ' + m.game.n + ' of ' + m.game.max);
      mpMapContinue();
    }
    if (mode === 'sheet' && tab === 'party') drawSheet();
  } else if (m.t === 'joinfail') {
    if (MP.resume && m.id === MP.resume.id) MP.resume = null;
    toast(m.reason); sfx('err');
    if (MP.joinUid && /password/i.test(m.reason || '')) {
      const uid = MP.joinUid;
      MP.joinUid = '';
      dlgPrompt('That game is locked', 'It needs a password.', pw => { MP.joinUid = uid; mpSend('game.join', { uid: uid, pass: pw }); });
    } else MP.joinUid = '';
  } else if (m.t === 'friend') {
    mpFriendPush(m);
  } else if (m.t === 'rtc') {
    mpRtc(m);
  } else if (m.t === 'voice') {
    MP.speaking[m.uid] = m.on;
    if (mode === 'sheet' && tab === 'party') drawSheet();
  } else if (m.t === 'party') {
    MP.party = m.id ? m : null; MP.sim = m.sim || null; MP.invite = null;
  } else if (m.t === 'invited') {
    MP.invite = m;
    if (m.game) mpGameInvite(m);
    else dlg(m.from + ' asks you to party', 'Level ' + m.lvl + ' ' + ((CLS[m.cls] || {}).n || 'stranger') +
      ': accept or stay out. Experience in the district is one pool, a third again the kill, split by level.',
      [['Join them', () => { mpSend('accept', { uid: m.uid }); MP.invite = null; }], ['Not now', () => { mpSend('decline', { uid: m.uid }); MP.invite = null; }]]);
  } else if (m.t === 'whisper' || m.t === 'whispernote') {
    mpWhisperLog(m);
  } else if (m.t === 'zone') {
    mpZone(m);
  } else if (m.t === 'chat') {
    if (MP.muted[m.uid]) return;        /* muting somebody mutes all of them, not just their voice */
    MP.chat.push({ from: m.from, uid: m.uid, text: m.text, scope: m.scope, t: Date.now() });
    if (MP.chat.length > 120) MP.chat.shift();
    MP.unread++;
    mpChatDraw();
    if (mode === 'sheet' && tab === 'party') drawSheet();
  } else if (m.t === 'hostile') {
    const me = MP.me && MP.me.uid;
    if (m.toUid === me) MP.hostile[m.fromUid] = 1;
    if (m.fromUid === me) { MP.hostile[m.toUid] = 1; mpPortalLock(); }
    mpSay(m.from + ' has declared hostility against ' + m.to + '.');
    sfx('err');
    if (mode === 'sheet' && tab === 'party') drawSheet();
  } else if (m.t === 'stand') {
    if (m.fromUid === (MP.me && MP.me.uid)) delete MP.hostile[m.toUid];
    if (mode === 'sheet' && tab === 'party') drawSheet();
  } else if (m.t === 'full') {
    MP.note = m.text;
    MP.retry = 99;                 /* a full world is not a dropped connection; do not hammer it */
    dlg('The world is full', m.text + '\n\nYou can keep playing on your own — your character is saved either way — and the Party tab will say when there is room.', [['Carry on alone']]);
  } else if (m.t === 'wipe') {
    MP.resume = null; MP.retry = 99;
    try {
      const slots = m.slot === 'all' || m.slot == null ? [0, 1, 2] : [+m.slot];
      for (const n of slots) localStorage.removeItem(skey(n));
    } catch (e) {}
    G = null;
    dlg('Character reset', 'The server cleared this character. Reloading.', [['Reload', () => location.reload()]]);
    setTimeout(() => location.reload(), 800);
  } else if (m.t === 'sys') {
    mpSay(m.text);
    if (m.notice) dlg('From the server', m.text, [['OK']]);
    if (m.text && /asked to be your friend/.test(m.text)) mpFriendsLoad();
    if (MP.resume && /that game is over/i.test(m.text || '')) MP.resume = null;
  } else if (m.t === 'xp') {
    /* The server's share. The killer's own share is already final; everyone else's still meets the local multipliers. */
    if (G && mode !== 'title') { gainXp(m.amount, m.self ? 'share' : 1); if (mode === 'play') float(P.x, P.y, '+' + m.amount + ' party', '#9fd0ff', 1); }
  } else if (m.t === 'quest') {
    if (G && G.q[m.k] !== undefined && G.q[m.k] < m.v) { G.q[m.k] = m.v; toast(m.from + ' finished ' + (QUESTS[m.k] ? QUESTS[m.k].n : m.k) + ' with you.'); }
  } else if (m.t === 'pvp') {
    mpTakeHit(m);
  } else if (m.t === 'pail') {
    mpPailMsg(m);
  } else if (m.t === 'lend') {
    if (P) { P.soundSwing = 1; if (typeof float === 'function') float(P.x, P.y, 'Unnamed', '#f7931a', 0); }
  } else if (m.t === 'mcurse') {
    mpMcurse(m);
  } else if (m.t === 'trade') {
    mpTradeMsg(m);
  } else if (m.t === 'kill') {
    mpSay(m.duel ? m.killer + ' took the duel against ' + m.dead + '.' : m.killer + ' has slain ' + m.dead + '.');
  } else if (m.t === 'sim') {
    mpSimMsg(m);
  } else if (m.t === 'mhost') {
    const was = MP.mobHost;
    MP.mobHost = m.uid || '';
    MP.mobNext = m.next || '';
    /* Take over from the positions already streaming in, instead of waiting for a snap. */
    if (m.hand && MP.me && MP.mobHost === MP.me.uid && was !== MP.mobHost && W && W.ents) {
      for (let i = 0; i < W.ents.length; i++) {
        const e = W.ents[i];
        if (!e || !e.mid || e.tx == null) continue;
        e.x = e.tx; e.y = e.ty;
      }
    }
  } else if (m.t === 'mobs') {
    if (!mpApplyMobs(m)) MP.mobSnap = m;
  } else if (m.t === 'mhp') {
    mpMhp(m);
  } else if (m.t === 'mkill') {
    mpMkill(m);
  } else if (m.t === 'mxp') {
    if (G && mode !== 'title' && m.amount > 0) {
      gainXp(m.amount, 1);
      if (mode === 'play' && P) float(P.x, P.y, '+' + m.amount + ' xp', '#9fd0ff', 1);
    }
  } else if (m.t === 'mdmg') {
    if (G && P && mode === 'play') hurt(m.d, m.slow, { name: m.name || 'a machine' });
  }
}

/* ---------- other players in your district ---------- */
/* sk and sw are events. au is the aura that is on. A quiet beat omits whichever has
   not changed, and the next quiet beat clears sk and sw so the same skill can be seen
   again. The server keeps the last value and does not treat any of this as a hit. */
let mpSk = null, mpSkNew = 0, mpSkClear = 0, mpSw = 0, mpSwClear = 0;
const mpSent = { sk: null, au: null, aL: 0, sw: 0, fx: '' };
function mpSkillOk(n) { return (n >= 0 && n <= 14) || (n >= 100 && n <= 105); }
function mpNoteCast(i) { const n = i | 0; if (mpSkillOk(n)) { mpSk = n; mpSkNew = 1; } }
function mpNoteSwing() { mpSw = 1; }
function mpFxSnap() {
  const au = (P.aura && (P.aura.i === 3 || P.aura.i === 4 || P.aura.i === 7)) ? P.aura.i : null;
  const aL = au ? Math.max(1, Math.min(20, (P.aura.L || (typeof sl === 'function' ? sl(au) : 1) || 1) | 0)) : 0;
  const bf = {};
  if (P.orders > 0.05) bf.call = Math.round(P.orders * 10) / 10;
  if (P.book > 0.05) bf.book = Math.round(P.book * 10) / 10;
  if (P.ledger > 0.05) bf.ledger = Math.round(P.ledger * 10) / 10;
  const node = (au && G.cls === 'maxi' && typeof sl === 'function' && sl(10) > 0) ? Math.min(20, sl(10) | 0) : 0;
  const nm = (G.cls === 'witness' && typeof sl === 'function' && sl(13) > 0) ? Math.min(20, sl(13) | 0) : 0;
  const tes = {};
  if (nm && W && W.ents) {
    let n = 0;
    for (const e of W.ents) {
      if (!e || !e.mid || !(e.tes > 0) || n >= 8) continue;
      tes[e.mid | 0] = Math.min(6, e.tes | 0);
      n++;
    }
  }
  return { au, aL, bf, node, nm, tes };
}
function mpMovePkt() {
  if (!P || !W || !G) return null;
  const pkt = {
    x: +P.x.toFixed(2), y: +P.y.toFixed(2), zi: W.zi,
    dir: Math.atan2(P.dir.y, P.dir.x),
    hp: Math.round(G.hp), hpm: Math.round(S.maxHp), inst: W.inst || null,
    lvl: G.lvl | 0, tier: G.tier | 0
  };
  pkt.pail = mpPailSnap();
  const fx = mpFxSnap();
  const fxKey = JSON.stringify(fx);
  if (fxKey !== mpSent.fx) {
    pkt.au = fx.au; pkt.aL = fx.aL; pkt.bf = fx.bf; pkt.node = fx.node; pkt.nm = fx.nm; pkt.tes = fx.tes;
    mpSent.au = fx.au; mpSent.aL = fx.aL; mpSent.fx = fxKey;
  }
  /* A repeat of the same index has to go out as empty first, or the other client
     cannot tell it from the cast it already drew. */
  if (mpSkClear && !mpSkNew) { pkt.sk = null; mpSent.sk = null; mpSkClear = 0; }
  else if (mpSkNew && mpSent.sk !== null && mpSent.sk === mpSk) { pkt.sk = null; mpSent.sk = null; }
  else if (mpSkNew) { pkt.sk = mpSk; mpSent.sk = mpSk; mpSkNew = 0; mpSkClear = 1; mpSk = null; }
  if (mpSwClear && !mpSw) { pkt.sw = 0; mpSent.sw = 0; mpSwClear = 0; }
  else if (mpSw && mpSent.sw === 1) { pkt.sw = 0; mpSent.sw = 0; }
  else if (mpSw) { pkt.sw = 1; mpSent.sw = 1; mpSw = 0; mpSwClear = 1; }
  return pkt;
}
function mpPailSnap() {
  if (!W || !W.allies) return null;
  for (let i = 0; i < W.allies.length; i++) {
    const a = W.allies[i];
    if (!a || a.k !== 'pail' || a.remote || !(a.hp > 0)) continue;
    const L = Math.max(1, Math.min(20, a.L | 0 || 1));
    return { x: +a.x.toFixed(2), y: +a.y.toFixed(2), L: L, hp: Math.round(a.hp), max: Math.round(a.max || a.hp) };
  }
  return null;
}
function mpRemoteCast(o) {
  if (!o || o.sk == null || !o.cls || !W || !W.fx) return;
  if (o.sk >= 100 && o.sk <= 105) {
    const col = o.sk === 101 ? '#e6e2d6' : o.sk === 102 ? '#9a6cff' : o.sk === 103 ? '#7be495' : '#c9a868';
    W.fx.push({ k: 'ring', x: o.x, y: o.y, r: o.sk >= 101 && o.sk <= 103 ? 6 : 1.4, t: 0, life: .35, col: col, remote: 1 });
    MP.lastCast = { k: 'ring', col: col, n: ((MP.lastCast && MP.lastCast.n) || 0) + 1 };
    return;
  }
  const v = skvOf(o.cls, o.sk);
  if (!v || OPT.fx === 'thin') return;
  MP.lastCast = { k: v.k, col: v.col, n: ((MP.lastCast && MP.lastCast.n) || 0) + 1 };
  const d = o.dir || 0;
  skvPlay(o.cls, o.sk, o.x, o.y, { x: Math.cos(d), y: Math.sin(d) }, 1);
}
function mpRemoteSwing(o) {
  if (!o || !W || !W.fx || OPT.fx === 'thin') return;
  const d = o.dir || 0, col = (CLS[o.cls] && CLS[o.cls].col) || '#e6e2d6';
  W.fx.push({ k: 'arc', x: o.x, y: o.y, dx: Math.cos(d), dy: Math.sin(d), t: 0, life: .18, w: 1, col: col, remote: 1 });
}
function mpZone(m) {
  const seen = {};
  for (const r of m.players || []) {
    seen[r.uid] = 1;
    let o = MP.others.find(q => q.uid === r.uid);
    if (!o) { o = { uid: r.uid, x: r.x, y: r.y, px: r.x, py: r.y }; MP.others.push(o); }
    const first = !o.wired, prevSk = o.sk, prevSw = o.sw ? 1 : 0;
    /* Hold the previous position and interpolate toward the new one, so ten updates a
       second do not look like ten updates a second. */
    o.px = o.x; o.py = o.y; o.tx = r.x; o.ty = r.y; o.lerp = 0;
    o.name = r.name; o.lvl = r.lvl; o.cls = r.cls; o.dir = r.dir; o.hp = r.hp; o.hpm = r.hpm;
    if ('sk' in r) o.sk = (typeof r.sk === 'number' && mpSkillOk(r.sk) && (r.sk | 0) === r.sk) ? r.sk : null;
    if ('au' in r) o.au = (r.au === 3 || r.au === 4 || r.au === 7) ? r.au : null;
    if ('aL' in r) o.aL = (o.au && r.aL >= 1 && r.aL <= 20) ? (r.aL | 0) : (o.au ? (o.aL || 1) : 0);
    if ('node' in r) o.node = (o.au && r.node >= 1 && r.node <= 20) ? (r.node | 0) : 0;
    if ('nm' in r) o.nm = (r.nm >= 1 && r.nm <= 20) ? (r.nm | 0) : 0;
    if ('bf' in r) o.bf = (r.bf && typeof r.bf === 'object') ? r.bf : null;
    if ('tes' in r) o.tes = (r.tes && typeof r.tes === 'object') ? r.tes : null;
    if ('pail' in r) o.pail = (r.pail && r.pail.hp > 0) ? { x: +r.pail.x || 0, y: +r.pail.y || 0, L: r.pail.L | 0 || 1, hp: Math.round(+r.pail.hp || 0), max: Math.round(+r.pail.max || +r.pail.hp || 0) } : null;
    if ('sw' in r) o.sw = r.sw === 1 ? 1 : 0;
    o.wired = 1;
    if (!first) {
      if (o.sk != null && o.sk !== prevSk) mpRemoteCast(o);
      if (o.sw === 1 && prevSw !== 1) mpRemoteSwing(o);
    }
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
  const ty = e && (e.lt === 'sound' || e.lt === 'impact' || e.lt === 'surge' || e.lt === 'rust' || e.lt === 'heat' || e.lt === 'noise') ? e.lt : 'impact';
  const cm = (S && +S.critM > 0) ? Math.round(Math.min(8, Math.max(1, +S.critM)) * 100) / 100 : 2;
  mpSend('pvp', { uid: e.mp, dmg: d, kind: crit ? 'crit' : '', dty: ty, critM: crit ? cm : 0 });
}

/* Smoothing runs at frame rate, from update(). */
function mpLend(uid) { if (uid && mpOn()) mpSend('lend', { uid: uid }); }
function mpPailAsk(a, dt) {
  if (!a || !mpOn() || !MP.party) return;
  a.ask = (a.ask || 0) - dt;
  if (a.ask > 0) return;
  a.ask = 0.25;
  const draw = [];
  if (P && dist(P, a) < 2.6 && G && S && G.hp < S.maxHp) draw.push({ k: 'self' });
  if (W && W.merc && W.merc.hp > 0 && W.merc.max > W.merc.hp && dist(W.merc, a) < 2.6) draw.push({ k: 'merc', n: Math.ceil(W.merc.max - W.merc.hp) });
  if (W && W.tag && W.tag.hp > 0 && (W.tag.max || 0) > W.tag.hp && dist(W.tag, a) < 2.6) draw.push({ k: 'tag', n: Math.ceil(W.tag.max - W.tag.hp) });
  if (MP.others) for (let i = 0; i < MP.others.length; i++) {
    const o = MP.others[i];
    if (!o || !mpInParty(o.uid)) continue;
    if (typeof mpHostileTo === 'function' && mpHostileTo(o.uid)) continue;
    if (!(o.hpm > 0) || o.hp >= o.hpm) continue;
    if (Math.hypot(o.x - a.x, o.y - a.y) >= 2.6) continue;
    draw.push({ k: o.uid });
  }
  if (draw.length) mpSend('pail', { draw: draw });
}
function mpPailMsg(m) {
  if (!m || !P || !W) return;
  if (m.grants) {
    let mine = null;
    if (W.allies) for (let i = 0; i < W.allies.length; i++) if (W.allies[i] && W.allies[i].k === 'pail' && !W.allies[i].remote) { mine = W.allies[i]; break; }
    if (mine && m.hp != null) mine.hp = Math.min(mine.hp, +m.hp || 0);
    for (let i = 0; i < m.grants.length; i++) {
      const g = m.grants[i];
      if (!g || !(g.n > 0)) continue;
      if (g.k === 'self') heal(g.n);
      else if (g.k === 'merc' && W.merc && W.merc.hp > 0) W.merc.hp = Math.min(W.merc.max, W.merc.hp + g.n);
      else if (g.k === 'tag' && W.tag && W.tag.hp > 0) W.tag.hp = Math.min(W.tag.max || W.tag.hp, W.tag.hp + g.n);
    }
    if (mine && !(mine.hp > 0)) mine.life = 0;
    return;
  }
  if (m.n > 0) heal(m.n);
}
function mpSyncPails() {
  if (!W || !W.allies || !MP || !MP.others) return;
  const seen = {};
  for (let i = 0; i < MP.others.length; i++) {
    const o = MP.others[i];
    if (!o || !o.pail || !(o.pail.hp > 0) || typeof mpInParty !== 'function' || !mpInParty(o.uid)) continue;
    if (typeof mpHostileTo === 'function' && mpHostileTo(o.uid)) continue;
    seen[o.uid] = 1;
    let a = null;
    for (let j = 0; j < W.allies.length; j++) if (W.allies[j] && W.allies[j].remote && W.allies[j].k === 'pail' && W.allies[j].owner === o.uid) { a = W.allies[j]; break; }
    if (!a) {
      a = { k: 'pail', remote: 1, owner: o.uid, life: 1e9, r: .3, hp: o.pail.hp, max: o.pail.max || o.pail.hp, x: o.pail.x, y: o.pail.y, L: o.pail.L || 1, rate: 0 };
      W.allies.push(a);
    }
    a.x = o.pail.x; a.y = o.pail.y; a.hp = o.pail.hp; a.max = o.pail.max || a.max; a.L = o.pail.L || 1; a.life = 1e9;
  }
  for (let i = W.allies.length - 1; i >= 0; i--) {
    const a = W.allies[i];
    if (a && a.remote && a.k === 'pail' && !seen[a.owner]) W.allies.splice(i, 1);
  }
}
function mpTick(dt) {
  if (!mpOn() || !G) return;
  mpSyncPails();
  for (const o of MP.others) {
    if (o.lerp === undefined) continue;
    o.lerp = Math.min(1, o.lerp + dt * 9);
    o.x = o.px + (o.tx - o.px) * o.lerp;
    o.y = o.py + (o.ty - o.py) * o.lerp;
  }
}

/* Shared machines. The host moves them. The server owns their hit points and pays the
   kill. A guest draws the host's positions and does not run the machine AI. Solo play
   never enters this: there is no game, so mpMobShared is false. */
function mpMobShared() { return mpIn() && !!W && W.z && !W.z.town; }
function mpMobHost() { return mpMobShared() && !!MP.me && MP.mobHost === MP.me.uid; }
function mpMobWatch() { return mpMobShared() && !mpMobHost(); }
function mpMobHit(e, d, opt) {
  if (!mpOn() || !e || !e.mid || !(d > 0) || !W || !G) return;
  mpMobPush(true);
  const mob = opt && opt.mob;
  const area = (opt && opt.area) || (typeof P !== 'undefined' && P && P.areaTick) ? 1 : 0;
  const sk = mob ? -2 : (area ? ((typeof P !== 'undefined' && P && P.hitSk >= 0) ? (P.hitSk | 0) : -3) : ((typeof P !== 'undefined' && P && P.hitSk >= 0) ? (P.hitSk | 0) : -1));
  mpSend('mhit', { zi: W.zi, tier: G.tier | 0, id: e.mid, d: Math.round(d), sk: sk, area: area ? 1 : 0 });
}
function mpMobGone(e) {
  if (!mpMobHost() || !e || !e.mid || !W || !G) return;
  mpSend('mgone', { zi: W.zi, tier: G.tier | 0, id: e.mid });
}
function mpMobSplash(e, d) {
  if (!mpMobHost() || !e || !(d > 0) || !MP.others) return;
  const reach = ((ET[e.k] && ET[e.k].range) || 1) + 1.4;
  for (let i = 0; i < MP.others.length; i++) {
    const o = MP.others[i];
    if (!o || !(o.hp > 0)) continue;
    if (Math.hypot(o.x - e.x, o.y - e.y) <= reach) mpSend('mdmg', { uid: o.uid, d: Math.round(d), name: e.name || 'a machine' });
  }
}
function mpMobPush(soon) {
  if (!mpMobHost() || !W || !G) return;
  const now = Date.now();
  const seq = W.mobSeq || 0;
  if (!soon && MP.mobAt && now - MP.mobAt < 180) return;
  if (soon && MP.mobSeqSent === seq && MP.mobAt && now - MP.mobAt < 180) return;
  if (soon && MP.mobAt && now - MP.mobAt < 40 && MP.mobSeqSent === seq) return;
  MP.mobAt = now;
  MP.mobSeqSent = seq;
  const list = [];
  for (let i = 0; i < W.ents.length; i++) {
    const e = W.ents[i];
    if (!e || !e.mid || e.mp || !(e.hp > 0)) continue;
    list.push({
      id: e.mid, k: e.k, x: +e.x.toFixed(2), y: +e.y.toFixed(2),
      hp: Math.round(e.hp), max: Math.round(e.max || e.hp), ml: W.ml | 0,
      champ: e.champ ? 1 : 0, su: e.su ? 1 : 0, min: e.minion ? 1 : 0, xpm: e.xpM || 1
    });
    if (list.length >= 60) break;
  }
  mpSend('mobs', { zi: W.zi, tier: G.tier | 0, list });
}
function mpStub(row) {
  const t = ET[row.k];
  if (!t || !W) return null;
  const e = {
    k: row.k, x: +row.x || 0, y: +row.y || 0, tx: +row.x || 0, ty: +row.y || 0,
    r: t.r, hp: +row.hp || 1, max: +row.max || 1, mid: row.id | 0,
    dmg: t.dmg, spd: t.spd, cd: 0, wind: 0, stun: 0, slow: 0, mark: 0, flash: 0,
    aggro: true, champ: row.champ ? 1 : 0, su: row.su ? 1 : 0, sz: row.su ? 1.4 : row.champ ? 1.22 : 1,
    ph: 0, mods: {}, ward: 0, healCd: 2, name: t.n, minion: row.min ? 1 : 0, hits: 0, arcCd: 0
  };
  W.ents.push(e);
  if (typeof isBoss === 'function' && isBoss(e.k)) W.boss = e;
  return e;
}
function mpApplyMobs(m) {
  if (!W || !m || W.zi !== (m.zi | 0) || ((G && G.tier) | 0) !== (m.tier | 0)) return false;
  const host = mpMobHost();
  for (let i = 0; i < (m.list || []).length; i++) {
    const row = m.list[i];
    if (!row || !(row.id > 0)) continue;
    let e = null;
    for (let j = 0; j < W.ents.length; j++) if (W.ents[j].mid === row.id) { e = W.ents[j]; break; }
    if (!e) e = mpStub(row);
    if (!e) continue;
    if (!host) {
      e.tx = +row.x; e.ty = +row.y;
      if (m.snap || e.x == null) { e.x = e.tx; e.y = e.ty; }
      e.hp = +row.hp; e.max = +row.max || e.max;
    } else {
      e.hp = +row.hp; e.max = +row.max || e.max;
    }
    if (row.curse) mpPaintCurse(e, row.curse);
    if (row.tes) e.partyTes = Math.max(e.partyTes || 0, row.tes | 0);
  }
  if (m.next) MP.mobNext = m.next;
  if (m.you || host) {
    let n = W.mobSeq || 0;
    for (let i = 0; i < W.ents.length; i++) if (W.ents[i].mid > n) n = W.ents[i].mid;
    W.mobSeq = n;
  }
  MP.mobSnap = null;
  return true;
}
function mpMhp(m) {
  if (!W || !m) return;
  for (let i = 0; i < W.ents.length; i++) if (W.ents[i].mid === m.id) {
    W.ents[i].hp = +m.hp; W.ents[i].max = +m.max || W.ents[i].max; W.ents[i].flash = .12; return;
  }
}
function mpPaintCurse(e, c) {
  if (!e || !c || !c.k) return;
  const sec = Math.max(0, +c.sec || 0);
  if (!(sec > 0)) return;
  if (c.k === 'rec') { e.onRecT = Math.max(e.onRecT || 0, sec); e.onRecM = Math.max(e.onRecM || 1, +c.m || 1); }
  else if (c.k === 'leave') e.noheal = Math.max(e.noheal || 0, sec);
}
function mpMcurse(m) {
  if (!m) return;
  MP.curses = MP.curses || {};
  MP.curses[m.id | 0] = m;
  if (!W || !W.ents) return;
  for (let i = 0; i < W.ents.length; i++) if (W.ents[i].mid === (m.id | 0)) mpPaintCurse(W.ents[i], m);
}
function mpNoteCurse(e, k, mul, sec) {
  if (!e || !e.mid || !mpOn()) return;
  mpSend('curse', { id: e.mid | 0, k: k, m: mul, sec: sec });
}
function mpMkill(m) {
  if (!W || !m) return;
  let e = null;
  for (let i = 0; i < W.ents.length; i++) if (W.ents[i].mid === m.id) { e = W.ents[i]; break; }
  /* The kill can arrive before this client has the body. A party member still rolls. */
  if (!e && m.loot && !m.silent && m.k && typeof ET !== 'undefined' && ET[m.k]) {
    e = { mid: m.id, k: m.k, x: +m.x || 0, y: +m.y || 0, r: .4, sz: 1, hp: 0, max: 1, champ: m.champ ? 1 : 0, su: m.su ? 1 : 0, mods: {}, minion: 0 };
    W.ents.push(e);
  }
  if (!e) return;
  if (m.silent) {
    const i = W.ents.indexOf(e);
    if (i >= 0) W.ents.splice(i, 1);
    if (W.boss === e) W.boss = null;
    return;
  }
  kill(e, { net: 1, noXp: 1, noLoot: !m.loot });
}
function mpMobCatch() {
  if (MP.mobSnap) mpApplyMobs(MP.mobSnap);
}

/* Reporting where you are runs on its own clock, because update() stops while a dialog
   or a sheet is open and somebody reading their inventory has not left the district. */
function mpBeat() {
  mpChatShow();
  if (chatFade > 0 && chatEl) { chatFade -= .1; if (chatFade <= 0 && document.activeElement !== chatIn) chatEl.classList.remove('live'); }
  if (!mpOn() || !G || !W || !P || mode === 'title') return;
  mpSyncEnts();
  mpVoiceLevels();
  /* The socket opens on the title, before a class exists. Say the class once it does,
     so the other client knows which shapes to draw. */
  if ((G.cls || '') !== mpAnnounced) mpHello();
  MP.lastMove = performance.now();
  mpSend('move', mpMovePkt());
  mpMobPush(false);
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
  const nm = (hos ? '⚔ ' : '') + o.name + ' · ' + o.lvl;
  const tw = ctx.measureText(nm).width;
  /* Drawn here rather than through label() because this plate carries its own
     hostile and party colours. It still takes a slot from the same list, or eight
     people in one doorway print their names on top of each other. */
  const nx = X - tw / 2 - 3, nw = tw + 6;
  let ny = y - 32;
  if (typeof txtSlot === 'function') {
    const put = txtSlot(nx, ny, nw, 12, 14, 14);
    if (put === null) { ctx.textAlign = 'left'; return; }
    ny = put; txtClaim(nx, ny, nw, 12);
  }
  ctx.fillStyle = 'rgba(8,6,14,.8)';
  ctx.fillRect(nx, ny, nw, 12);
  ctx.fillStyle = hos ? '#f0918b' : mate ? '#9fe0b4' : '#cfc8dd';
  ctx.fillText(nm, X, ny + 9);
  ctx.textAlign = 'left';
}

const mpInParty = uid => !!(MP.party && MP.party.members && MP.party.members.some(m => m.uid === uid));
/* How many rolls a kill is worth. Party members here count as one. People in the game
   but not this district count as half, and only in pairs. */
function partyDropN() {
  if (!mpIn() || !MP.party || !MP.party.members || !W) return 1;
  const zi = W.zi, inParty = {}, me = MP.me && MP.me.uid;
  for (const m of MP.party.members) inParty[m.uid] = 1;
  let close = 0, away = 0;
  for (const r of MP.roster || []) {
    if (r.uid === me) { close++; continue; }
    if (r.zi === zi && inParty[r.uid]) close++;
    else if (r.zi !== zi) away++;
  }
  if (!close) close = 1;
  return close + Math.floor(away / 2);
}

/* ---------- experience and quests shared with the party ---------- */
function mpPortalLock() {
  if (G) G.portal = null;
  MP.portalUntil = Date.now() + 10000;
}
function mpPortalBlocked() {
  if (MP.portalUntil > Date.now()) {
    toast('The declaration holds you here for a moment.');
    sfx('err');
    return true;
  }
  return false;
}
function mpShareXp(v, ml) {
  if (!mpOn() || !MP.party || !MP.party.members || MP.party.members.length < 2 || !(v > 0)) return false;
  const pkt = { amount: Math.round(v) };
  if (ml) pkt.ml = Math.round(ml);
  mpSend('xp', pkt);
  return true;
}
function mpShareQuest(k, v) {
  if (!mpOn() || !MP.party) return;
  mpSend('quest', { k, v });
}

/* ---------- fighting each other ----------
   Your client says it hit; the server decides whether the two of you are allowed to fight
   and scales the damage; their client applies it. A friend could cheat this, and the only
   honest answer is that this is a server for people who know each other.

   The hit itself is routed from dmgEnemy: a hostile stands in W.ents as a stand-in, so
   every skill in the game finds them, and mpHurt sends it on. */

function mpTakeHit(m) {
  if (!G || mode === 'title') return;
  if (mode === 'sheet') closeSheet();
  const was = G.hp;
  /* Through the game's own damage path, so armour and resistances apply to a person the
     same way they apply to a machine, and death — including the rig's painless kind —
     is the code that already exists rather than a second copy of it. */
  hurt(m.dmg, 0, { name: m.from, pvp: 1, crit: m.kind === 'crit' ? 1 : 0, critM: m.kind === 'crit' ? (+m.critM || 2) : 0, dty: m.dty || 'impact' });
  if (G.hp <= 0 && was > 0) mpSend('died', { uid: m.fromUid });
}

/* ---------- the rig ---------- */
function mpSimMsg(m) {
  if (m.action === 'open') {
    MP.sim = m.sim;
    dlg('The rig is booked', m.sim.mode === 'duel'
      ? m.by + ' has set the Simulator to duelling. Inside, hostility is the point: nothing you lose in there is real, and nothing you win is either. Declare against each other first, or you will both swing at nothing.'
      : m.by + ' has set the Simulator to waves, together. Everyone in the party fights the same wave, and the first to clear it moves everybody on.',
      [['Go to the rig', () => { if (!mpPortalBlocked()) enter(MP.simZone); }], ['Later']]);
  } else if (m.action === 'wave') {
    if (W && W.zi === MP.simZone && W.sim) { W.sim.wave = Math.max(W.sim.wave || 0, m.wave); toast('Wave ' + m.wave + '.'); }
  } else if (m.action === 'close') {
    MP.sim = null;
  }
}
function mpSimWave(w) { if (mpOn() && MP.party && W && W.zi === MP.simZone) mpSend('sim', { action: 'wave', wave: w }); }

/* ---------- friends, on the party sheet ---------- */
function mpApi(path, body, again) {
  if (!window.__u2087server || !location.protocol.startsWith('http')) return Promise.reject(new Error('Not connected.'));
  const send = csrf => fetch(path, {
    method: 'POST', credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', 'X-CSRF': csrf || '' },
    body: JSON.stringify(body || {})
  }).then(r => r.json().catch(() => ({})).then(j => {
    if (r.status === 403 && !again) { MP.csrf = ''; return mpApi(path, body, 1); }
    if (!r.ok) throw new Error(j.error || 'That did not go through.');
    return j;
  }));
  if (MP.csrf) return send(MP.csrf);
  return fetch('/api/me', { credentials: 'same-origin' }).then(r => r.json()).then(j => {
    MP.csrf = (j && j.csrf) || '';
    return send(MP.csrf);
  });
}
let mpFriendGen = 0;
function mpFriendsLoad() {
  if (!window.__u2087server || !location.protocol.startsWith('http')) return;
  const gen = ++mpFriendGen;
  mpApi('/api/friend/list', {}).then(j => { if (gen === mpFriendGen) mpApplyFriends(j); }).catch(() => {});
  mpMailLoad();
}
function mpMailLoad() {
  if (!window.__u2087server || !location.protocol.startsWith('http')) return;
  mpApi('/api/mail/list', {}).then(j => {
    MP.mail = (j && j.box) || [];
    if (mode === 'sheet' && tab === 'party') drawSheet();
  }).catch(() => {});
}
function mpApplyFriends(body) {
  MP.closed = !!(body && body.closed);
  const to = (body && body.to) || {}, next = {};
  for (const uid in to) {
    const e = to[uid];
    if (!e || typeof e !== 'object') continue;
    const row = { name: e.name || '', at: e.at || 0, state: e.state || '' };
    const face = MP.face[uid];
    if (face) { row.online = !!face.online; row.cls = face.cls || ''; row.lvl = +face.lvl || 0; }
    if (row.state === 'friend' && face && face.online && face.gameName) row.gameName = face.gameName;
    next[uid] = row;
  }
  MP.friends = next;
  if (mode === 'sheet' && tab === 'party') drawSheet();
}
function mpFriendPush(m) {
  if (!m || !m.uid) return;
  MP.lastFriend = m;
  MP.face[m.uid] = { name: m.name || '', online: !!m.online, cls: m.cls || '', lvl: +m.lvl || 0, gameName: m.gameName || '' };
  const row = MP.friends[m.uid];
  if (row) {
    row.online = !!m.online; row.cls = m.cls || ''; row.lvl = +m.lvl || 0;
    if (row.state === 'friend' && m.online && m.gameName) row.gameName = m.gameName;
    else delete row.gameName;
  }
  if (mode === 'sheet' && tab === 'party') drawSheet();
  mpFriendsLoad();
}
function mpFriendAct(kind, uid) {
  const row = MP.friends[uid];
  if (!row || !row.name) return;
  let path = '', body = { name: row.name };
  if (kind === 'accept') { path = '/api/friend/answer'; body.accept = true; }
  else if (kind === 'decline') { path = '/api/friend/answer'; body.accept = false; }
  else if (kind === 'remove') path = '/api/friend/remove';
  else if (kind === 'block') path = '/api/friend/block';
  else return;
  mpApi(path, body).then(() => mpFriendsLoad()).catch(e => { toast(e.message || 'That did not go through.'); sfx('err'); });
}
function mpJoinFriend(uid) {
  const row = MP.friends[uid], face = MP.face[uid] || {};
  if (!row || row.state !== 'friend') return;
  const gameName = face.gameName || '';
  const listed = gameName && MP.lobby.find(g => g.name === gameName);
  if (listed) {
    MP.joinUid = '';
    if (listed.locked) dlgPrompt('“' + listed.name + '” is locked', 'It needs a password.', pw => mpSend('game.join', { id: listed.id, pass: pw }));
    else mpSend('game.join', { id: listed.id });
    return;
  }
  MP.joinUid = uid;
  mpSend('game.join', { uid: uid });
}
function mpGameInvite(m) {
  const who = (CLS[m.cls] || {}).n || 'stranger';
  const go = pw => {
    const msg = { uid: m.uid };
    if (pw) msg.pass = pw;
    mpSend('game.join', msg);
    MP.invite = null;
  };
  dlg(m.from + ' asks you into ' + m.game,
    'Level ' + m.lvl + ' ' + who + '. Joining puts you in that game if there is room. It does not put you in their party.',
    [['Join the game', () => {
      if (m.locked) dlgPrompt('“' + m.game + '” is locked', 'It needs a password.', go);
      else go();
    }], ['Not now', () => { MP.invite = null; }]]);
}
function mpWhisperLog(m) {
  MP.whispers.push({
    from: m.from || '', name: m.name || '', text: m.text || '', line: m.line || '',
    out: m.t === 'whispernote' ? 1 : 0, t: Date.now()
  });
  if (MP.whispers.length > 30) MP.whispers.shift();
  if (m.t === 'whisper') toast((m.from || 'Someone') + ' whispers.');
  else if (m.text) toast(m.text);
  if (mode === 'sheet' && tab === 'party') drawSheet();
}
function mpWhisperPane() {
  const row = MP.whisperTo && MP.friends[MP.whisperTo];
  let h = '';
  if (row && row.state === 'friend') {
    h += '<h3>A word to ' + esc(row.name) + '</h3>';
    h += '<div class="row"><input id="mpWhisper" maxlength="240" placeholder="A private line" style="flex:1;background:#0a0912;border:1px solid #3a3350;color:#e8e2d4;border-radius:6px;padding:10px;font:15px Georgia,serif"><button class="ghost" data-mpfs="1">Send</button></div>';
  }
  if (MP.whispers.length) {
    h += '<h3>Whispers</h3><div class="list">';
    for (const w of MP.whispers.slice(-30).reverse()) {
      const who = w.out ? (w.name ? ('To ' + w.name) : '') : (w.from || '');
      const said = w.line ? (w.text + ' — ' + w.line) : w.text;
      h += '<div class="li"><div>' + (who ? '<b>' + esc(who) + '</b>' : '') + '<span>' + esc(said) + '</span></div></div>';
    }
    h += '</div>';
  }
  return h;
}
function mpMailPane() {
  let h = '<h3>Letters</h3>';
  h += '<p style="font-size:13px">A whisper while they are off waits here. The box holds forty, for thirty days. A whisper while they are on is said on this page and then forgotten.</p>';
  if (!MP.mail.length) h += '<p>The box is empty.</p>';
  else {
    h += '<div class="list">';
    for (const m of MP.mail.slice().reverse()) {
      h += '<div class="li"><div><b>' + esc(m.fromName || '') + (m.read ? '' : ' · new') + '</b><span>' + esc(m.text || '') + '</span></div></div>';
      if (!m.read) h += '<div class="row"><button class="ghost" data-mpmr="' + esc(m.id) + '">Mark read</button></div>';
    }
    h += '</div>';
  }
  return h;
}
function mpFriendNote() {
  return '<h3>Friends</h3><p>Not connected. Playing together needs the account server — on a single copy of the page there is nobody else to ask.</p>';
}
function mpFriendLine(r) {
  if (r.state === 'pending') return 'Asked. Waiting on them.';
  if (r.state === 'in') return 'Asked to be your friend.';
  if (r.state === 'blocked') return 'Blocked. They are not told.';
  const cn = (CLS[r.cls] || {}).n || '';
  const who = r.cls ? ('Level ' + (r.lvl || 1) + ' ' + cn) : '';
  if (!r.online) return who ? (who + ' · not on') : 'Not on.';
  if (r.gameName) return (who || 'On') + ' · in ' + r.gameName;
  return (who ? who + ' · ' : '') + 'on, not in a game';
}
function mpFriendBtns(r) {
  const u = esc(r.uid);
  if (r.state === 'pending') return '<button class="ghost" data-mpfr="' + u + '">Take it back</button>';
  if (r.state === 'in') return '<button class="ghost" data-mpfy="' + u + '">Accept</button><button class="ghost" data-mpfn="' + u + '">Decline</button>';
  if (r.state === 'blocked') return '<button class="ghost" data-mpfr="' + u + '">Unblock</button>';
  let h = '';
  if (r.online && r.gameName) h += '<button class="ghost" data-mpfj="' + u + '">Join</button>';
  h += '<button class="ghost" data-mpfw="' + u + '">Whisper</button>';
  h += '<button class="ghost" data-mpfr="' + u + '">Remove</button><button class="ghost" data-mpfb="' + u + '">Block</button>';
  return h;
}
function mpFriendSection(opts) {
  let h = '<h3>Friends</h3>';
  h += '<p style="font-size:13px">A person you accept can see your class, your level, and the name of the game you are standing in, and they can walk into it. You can see the same of them. Friends and asks stop at twenty-five. People you block sit past that.</p>';
  h += '<button class="tog' + (MP.closed ? ' on' : '') + '" data-mpfq="1"><span>Not taking messages</span><i>' + (MP.closed ? 'ON' : 'OFF') + '</i></button>';
  h += '<div class="row"><input id="mpFriend" maxlength="40" placeholder="Their name" style="flex:1;background:#0a0912;border:1px solid #3a3350;color:#e8e2d4;border-radius:6px;padding:10px;font:15px Georgia,serif"><button class="ghost" data-mpfa="1">Ask</button></div>';
  const rows = [];
  for (const uid in MP.friends) rows.push(Object.assign({ uid }, MP.friends[uid]));
  const rank = { in: 0, pending: 1, friend: 2, blocked: 3 };
  rows.sort((a, b) => (rank[a.state] == null ? 9 : rank[a.state]) - (rank[b.state] == null ? 9 : rank[b.state]) || String(a.name).localeCompare(String(b.name)));
  if (!rows.length) h += '<p>Nobody on the list yet.</p>';
  else {
    h += '<div class="list">';
    for (const r of rows) {
      const col = (CLS[r.cls] || {}).col || '#888';
      h += '<div class="li"><i style="background:' + col + '"></i><div><b>' + esc(r.name) + '</b><span>' + esc(mpFriendLine(r)) + '</span></div></div>';
      h += '<div class="row">' + mpFriendBtns(r) + '</div>';
    }
    h += '</div>';
  }
  h += mpWhisperPane();
  if (!opts || opts.mail !== false) h += mpMailPane();
  return h;
}

/* ---------- the panel: a lobby, then the game you are in ---------- */
function menuParty(friends, mail, game) {
  const tabs = [['game', 'Games'], ['friends', 'Friends'], ['mail', 'Letters']];
  let h = menuBar('party', tabs, mpOn() ? 'game' : 'friends');
  h += menuPane('party', 'game', game);
  h += menuPane('party', 'friends', friends);
  h += menuPane('party', 'mail', mail);
  return h;
}
function mpPanel() {
  let head = '';
  if (MP.note && !mpOn()) head = '<p>' + esc(MP.note) + '</p><p>Your character is saved and nothing is lost by waiting. Reload to try again.</p>';
  if (!mpOn()) return head + menuParty(mpFriendNote(), '<h3>Letters</h3><p>Not connected. A whisper that arrives while they are off needs the account server.</p>', '<h3>Open games</h3><p>Not connected. Playing together needs the account server.</p>');
  return head + menuParty(mpFriendSection({ mail: false }), mpMailPane(), MP.game ? mpGamePanel() : mpLobbyPanel());
}

function mpLobbyPanel() {
  let h = '<h3>Open games</h3>';
  h += '<p style="font-size:13px">A game holds ' + MP.maxGame + ' people and is its own world: its own districts, its own monsters, its own difficulty. Inside one you can form a party to share experience, or declare against each other and fight.</p>';
  if (!MP.lobby.length) h += '<p>Nobody has a game open. Start one and others will see it here.</p>';
  else {
    h += '<div class="list">';
    for (const g of MP.lobby) {
      const full = g.n >= g.max;
      h += '<button class="li' + (full ? '' : '') + '" ' + (full ? '' : 'data-mpj="' + g.id + '"') + (full ? ' disabled' : '') + '>' +
        '<i style="background:' + (g.diff === 'brutal' ? '#e2443c' : g.diff === 'hard' ? '#d98c3c' : '#7be495') + '"></i>' +
        '<div><b>' + esc(g.name) + (g.locked ? ' \u00b7 locked' : '') + '</b>' +
        '<span>' + esc(g.diffName) + ' \u00b7 ' + g.n + ' of ' + g.max + (full ? ' \u00b7 full' : '') + '</span></div>' +
        '<span class="pr">' + (full ? '' : 'Join') + '</span></button>';
    }
    h += '</div>';
  }

  h += '<h3>Start one</h3>';
  h += '<div class="row"><input id="mpName" maxlength="40" value="' + esc(MP.mkName) + '" placeholder="A name for your game" style="flex:1;background:#0a0912;border:1px solid #3a3350;color:#e8e2d4;border-radius:6px;padding:10px;font:15px Georgia,serif"></div>';
  h += '<div class="row">';
  for (const k of ['normal', 'hard', 'brutal']) {
    const d = MP.diffs && MP.diffs[k], i = mpDiffIndex(k);
    /* The same gate the title's create panel uses. A game you could not start alone is
       not one you can start by going through the lobby. */
    const open = typeof diffUnlocked !== 'function' || diffUnlocked(i);
    h += '<button class="ghost' + (MP.mkDiff === k ? ' on' : '') + '" data-mpd="' + k + '"' + (open ? '' : ' disabled') + '>' + (d ? esc(d.n) : k) + '</button>';
  }
  h += '</div>';
  const di = mpDiffIndex(MP.mkDiff), D = DIFFS[di];
  if (D) h += '<p style="font-size:13px">' + (di === 0
      ? 'Monsters as the game was written. Start here.'
      : 'Monsters with ' + D.hp + '\u00d7 the health and ' + D.dmg + '\u00d7 the bite, worth ' + D.xp + '\u00d7 the experience.') +
    ' The game keeps this difficulty for as long as it lasts, and everyone who joins plays it. Every extra person in the game adds half again to monster health and to what they are worth, so eight people face monsters four and a half times tougher than one person does \u2014 and are paid for it.</p>';
  h += '<div class="row"><input id="mpPass" maxlength="40" placeholder="Password (optional)" style="flex:1;background:#0a0912;border:1px solid #3a3350;color:#e8e2d4;border-radius:6px;padding:10px;font:15px Georgia,serif"></div>';
  h += '<div class="row"><button class="big" data-mpk="1">Make the game</button></div>';
  return h;
}

/* Party auras and the buffs that already name a radius. Witness Named Party is the
   whole district, which is what that card says. Founder effects stay on the founder. */
function mpApplyParty() {
  if (!P || !G) return;
  let call = 0, book = 0, ledger = 0, named = 0, node = 0;
  const marks = {};
  if (typeof MP !== 'undefined' && MP.others && typeof mpInParty === 'function') {
    for (const o of MP.others) {
      if (!o || !mpInParty(o.uid)) continue;
      if (typeof mpHostileTo === 'function' && mpHostileTo(o.uid)) continue;
      const d = dist(P, o);
      const bf = o.bf || {};
      if (bf.call > 0 && d < FORMULAS.aura.call.r) call = Math.max(call, bf.call);
      if (bf.book > 0 && d < FORMULAS.aura.book.r) book = Math.max(book, bf.book);
      if (bf.ledger > 0 && d < FORMULAS.aura.ledger.r) ledger = Math.max(ledger, bf.ledger);
      if (o.nm > 0) named = Math.max(named, o.nm | 0);
      if (o.tes) for (const id in o.tes) marks[id] = Math.max(marks[id] || 0, o.tes[id] | 0);
      if (o.node > 0 && (o.au === 3 || o.au === 4 || o.au === 7) && d < auraVisR(o.au, o.aL || 1)) node = Math.max(node, o.node | 0);
    }
  }
  const was = P.rCall > 0;
  P.rCall = call; P.rBook = book; P.rLedger = ledger; P.allyNamed = named;
  if (node > 0) P.nodeM = Math.max(P.nodeM || 0, 1 + 0.06 + 0.02 * node);
  if ((was ? 1 : 0) !== (call > 0 ? 1 : 0) && typeof calc === 'function') calc();
  if (W && W.ents) for (const e of W.ents) if (e && e.mid) e.partyTes = marks[e.mid] || 0;
}
function tradeHeld(it) {
  return !!(it && it.tid && MP.tradeLock && MP.tradeLock[it.tid]);
}
function tradeLocked(it) {
  if (!tradeHeld(it)) return false;
  toast('That is on the table.'); sfx('err'); return true;
}
/* Offered sats leave the purse when either side confirms, and come back if the
   trade is cancelled or the offer changes. Spending, selling, stashing, and
   every other debit has to go through spendSats. */
function tradeReserved() {
  const t = (typeof MP !== 'undefined') && MP && MP.trade;
  if (!t || !t.you) return 0;
  if (t.phase === 'check' || t.locked || t.you.ok || (t.them && t.them.ok)) return Math.max(0, t.you.sats | 0);
  return 0;
}
function satsFree() {
  if (typeof G === 'undefined' || !G) return 0;
  return Math.max(0, (G.sats | 0) - tradeReserved());
}
function spendSats(n, why) {
  n = Math.floor(+n || 0);
  if (!(n > 0) || typeof G === 'undefined' || !G) return false;
  if (satsFree() < n) {
    const reserved = tradeReserved();
    if(reserved > 0 && (G.sats | 0) >= n)toast('Those sats are on the table.');else scBroke(why);
    if (typeof sfx === 'function') sfx('err');
    return false;
  }
  G.sats -= n;
  return true;
}
function mpTradeFrozen() {
  const t = MP.trade;
  if (!t) return false;
  return t.phase === 'check' || !!t.locked || !!(t.you && t.you.ok) || !!(t.them && t.them.ok);
}
function mpTradePurse() {
  const tids = [];
  for (const it of (G && G.bag) || []) if (it && it.tid && !it.test) tids.push(it.tid);
  return { sats: G ? (G.sats | 0) : 0, tids: tids };
}
function tradeSeen(id) {
  if (G && G.trades && G.trades[id]) return true;
  try {
    const raw = localStorage.getItem('u2087-trade');
    const cur = raw ? JSON.parse(raw) : {};
    return !!cur[id];
  } catch (e) { return false; }
}
function tradeRemember(id) {
  G.trades = G.trades || {};
  G.trades[id] = 1;
  try {
    const raw = localStorage.getItem('u2087-trade');
    const cur = raw ? JSON.parse(raw) : {};
    cur[id] = 1;
    const keys = Object.keys(cur);
    if (keys.length > 40) delete cur[keys[0]];
    localStorage.setItem('u2087-trade', JSON.stringify(cur));
  } catch (e) {}
}
function mpTradeApply(m) {
  if (!G || !m || !m.id || !m.give || !m.take) return;
  MP.lastDone = m;
  if (tradeSeen(m.id)) { mpSend('trade.ack', { id: m.id }); return; }
  const give = m.give, take = m.take;
  const ids = {};
  for (const id of give.ids || []) if (id) ids[id] = 1;
  const have = {};
  for (const it of G.bag || []) if (it && it.tid) have[it.tid] = 1;
  let short = (G.sats | 0) < (give.sats | 0);
  for (const id in ids) if (!have[id]) short = true;
  if (short) {
    mpSend('trade.cancel', {});
    toast('The trade is off. The goods were not still in hand.');
    MP.trade = null; MP.tradeLock = null; MP.heldFor = null;
    return;
  }
  const bag = [];
  for (const it of G.bag || []) {
    if (it && it.tid && ids[it.tid]) { delete ids[it.tid]; continue; }
    bag.push(it);
  }
  const seen = {};
  for (const it of bag) if (it && it.tid) seen[it.tid] = 1;
  G.sats = (G.sats | 0) - (give.sats | 0) + (take.sats | 0);
  for (const it of take.items || []) {
    if (!it || !it.tid || seen[it.tid]) continue;
    if (it.charm) charmNormalize(it);
    if (!gridCan(bag, it, 6, 4)) { toast('Your pack is full. The rest of the trade did not fit.'); break; }
    bag.push(it); seen[it.tid] = 1;
  }
  G.bag = bag;
  tradeRemember(m.id);
  MP.tradeLock = null;
  MP.heldFor = null;
  if (typeof save === 'function') save(true);
  if (typeof calc === 'function') calc();
  mpSend('trade.ack', { id: m.id });
  toast('The trade is done.');
}
function mpTradeMsg(m) {
  if (!m) return;
  if (m.phase === 'ask') {
    MP.tradeAsk = { uid: m.with, from: m.from || 'Someone' };
    toast((m.from || 'Someone') + ' wants to trade.');
    if (mode === 'sheet') drawSheet();
    return;
  }
  if (m.phase === 'dead') {
    MP.trade = null; MP.tradeLock = null; MP.tradeAsk = null; MP.heldFor = null;
    toast(m.why === 'dropped' ? 'They dropped. The trade is off.' : m.why === 'short' ? 'The trade is off. Somebody no longer holds what they offered.' : 'The trade is off.');
    if (mode === 'sheet') drawSheet();
    return;
  }
  if (m.phase === 'done') { mpTradeApply(m); MP.trade = null; MP.tradeLock = null; MP.heldFor = null; if (mode === 'sheet') drawSheet(); return; }
  MP.trade = m;
  MP.tradeLock = {};
  if (m.you && m.you.items) for (const it of m.you.items) if (it && it.tid) MP.tradeLock[it.tid] = 1;
  if (m.phase === 'check' && MP.heldFor !== m.id) {
    MP.heldFor = m.id;
    mpSend('trade.hold', mpTradePurse());
  }
  if (m.phase !== 'check') MP.heldFor = null;
  if (mode === 'sheet') drawSheet();
}
function mpTradePanel() {
  const t = MP.trade;
  if (!t || (t.phase !== 'open' && t.phase !== 'check')) {
    if (!MP.tradeAsk) return '';
    return '<h3>A trade</h3><p>' + esc(MP.tradeAsk.from) + ' wants to trade, in town.</p><div class="row"><button class="big" data-mpta="' + MP.tradeAsk.uid + '">Accept</button><button class="ghost" data-mptx="1">Not now</button></div>';
  }
  const you = t.you || { sats: 0, items: [] }, them = t.them || { sats: 0, items: [] };
  const frozen = mpTradeFrozen();
  let h = '<h3>Trade</h3><p style="font-size:13px">Both of you confirm. Once either does, the sats and the items on the table stay put until the swap or a cancel. Changing an offer clears both confirms. Nothing moves until both purses still cover the offer.</p>';
  if (t.phase === 'check') h += '<p>Both confirmed. Checking that the sats and the items are still in hand.</p>';
  else if (frozen) h += '<p>The table is locked. Change the offer if you need to unlock it. That clears both confirms.</p>';
  h += '<p>You offer ' + (you.sats | 0) + ' sats' + (you.ok ? ' · confirmed' : '') + '. They offer ' + (them.sats | 0) + ' sats' + (them.ok ? ' · confirmed' : '') + '.</p>';
  h += '<div class="ln off">Theirs</div>';
  if (!(them.items || []).length && !(them.sats > 0)) h += '<p>Nothing yet.</p>';
  else (them.items || []).forEach(function (it, i) {
    h += '<button type="button" class="li" data-tsee="' + i + '"><div><b>' + esc(it.name || it.base || 'An item') + '</b><span>' + esc((typeof SNAME !== 'undefined' && SNAME[it.slot]) || it.slot || '') + '</span></div></button>';
  });
  h += '<p style="font-size:13px">' + (typeof uiSay === 'function' ? uiSay('Hover a piece to set it beside what you wear. Click one of yours to put it on the table.', 'Tap a piece to set it beside what you wear. Put it on the table sends yours across.') : '') + '</p>';
  h += '<div class="row"><input id="mpSats" inputmode="numeric" maxlength="9" value="' + (you.sats | 0) + '"' + (frozen ? ' readonly' : '') + ' style="width:8em;background:#0a0912;border:1px solid #3a3350;color:#e8e2d4;border-radius:6px;padding:10px;font:15px Georgia,serif"></div>';
  h += '<div class="list">';
  const offered = {};
  for (const it of you.items || []) if (it && it.tid) offered[it.tid] = 1;
  for (const it of (G && G.bag) || []) {
    if (!it || it.test) continue;
    if (!it.tid) it.tid = Math.random().toString(36).slice(2, 12) + Math.random().toString(36).slice(2, 6);
    h += '<button class="li' + (offered[it.tid] ? ' on' : '') + '" data-mpti="' + esc(it.tid) + '"><div><b>' + esc(it.name || it.base || 'Item') + '</b><span>' + (offered[it.tid] ? 'On the table' : (it.charm ? 'Charm in your pack' : 'In your pack')) + '</span></div></button>';
  }
  if (G && G.cslots && G.cslots.some(it => it)) {
    h += '</div><p style="font-size:13px">On your belt, not offered. Take a charm off to put it on the table.</p><div class="list">';
    for (const it of G.cslots) if (it) h += '<div class="ln off">' + esc(it.name || it.base || 'Charm') + '</div>';
  }
  h += '</div><div class="row"><button class="ghost" data-mpto="1">' + (frozen ? 'Change the offer' : 'Set the offer') + '</button><button class="big" data-mptc="1"' + (you.ok || t.phase === 'check' ? ' disabled' : '') + '>Confirm</button><button class="ghost" data-mptx="1">Cancel</button></div>';
  return h;
}
function mpTradeSendOffer() {
  if (!G) return;
  const box = document.getElementById('mpSats');
  let sats = box ? Math.max(0, Math.floor(+box.value || 0)) : 0;
  if (sats > (G.sats | 0)) sats = G.sats | 0;
  const items = [];
  const lock = MP.tradePick || {};
  for (const it of G.bag || []) if (it && it.tid && lock[it.tid] && !it.test) items.push(it);
  mpSend('trade.offer', { sats, items });
}

function mpGamePanel() {
  const me = MP.me || {}, g = MP.game, party = MP.party, sc = MP.scale || {};
  let h = mpTradePanel();
  h += '<h3>' + esc(g.name) + '</h3>';
  h += '<div class="tick"><div>Difficulty<b>' + esc(g.diffName) + '</b></div><div>In the game<b>' + g.n + ' of ' + g.max + '</b></div>' +
    '<div>Monster health<b>' + (sc.hp || 1).toFixed(1) + '\u00d7</b></div><div>Experience<b>' + (sc.xp || 1).toFixed(1) + '\u00d7</b></div></div>';
  h += '<div class="row"><button class="ghost" data-mpq="1">Leave the game</button>' +
    '<button class="ghost' + (MP.voice ? ' on' : '') + '" data-mpv="1">' + (MP.voice ? 'Microphone on' : 'Turn on the microphone') + '</button></div>';
  h += '<p style="font-size:13px">With a microphone open, you are heard by whoever can see you \u2014 anybody on their screen, in their district. Walk off the edge of it and they lose you. The sound goes straight between the two machines and never touches the server. Typing, on the other hand, reaches everybody in the game wherever they are.</p>';

  if (party) {
    h += '<h3>Your party \u00b7 ' + party.members.length + ' of ' + MP.maxParty + '</h3>';
    h += '<p style="font-size:13px">Experience in the district is one pool, a third again what the kill was worth, split by level. Somebody standing in town is not helping. Each of you rolls your own drops from a shared kill.</p>';
    h += '<div class="list">';
    for (const m of party.members) {
      const you = m.uid === me.uid;
      h += '<div class="li on"><i style="background:' + ((CLS[m.cls] || {}).col || '#888') + '"></i><div><b>' + esc(m.name) +
        (m.uid === party.leader ? ' \u00b7 leader' : '') + (you ? ' \u00b7 you' : '') + (MP.speaking[m.uid] ? ' \u00b7 mic' : '') + '</b>' +
        '<span>Level ' + m.lvl + ' ' + ((CLS[m.cls] || {}).n || '') + ' \u00b7 ' + mpWhere(m.zi) + '</span></div></div>' +
        (you ? '' : '<div class="row"><button class="ghost' + (MP.muted[m.uid] ? ' on' : '') + '" data-mpm="' + m.uid + '">' + (MP.muted[m.uid] ? 'Unmute' : 'Mute') + '</button>' +
          '<button class="ghost" data-mp' + (mpHostileTo(m.uid) ? 'n' : 'h') + '="' + m.uid + '">' + (mpHostileTo(m.uid) ? 'Stand down' : 'Hostile') + '</button></div>');
    }
    h += '</div><div class="row"><button class="ghost" data-mpl="1">Leave the party</button></div>';
    if (party.leader === me.uid) {
      h += '<h3>The rig</h3><p style="font-size:13px">The Simulator takes a party. Waves together, or a duel \u2014 the rig is the one place a fight between you costs nothing, because nothing in it is real.</p>' +
        '<div class="row"><button class="ghost" data-mps="waves">Waves, together</button><button class="ghost" data-mps="duel">Duel in the rig</button></div>';
      if (MP.sim) h += '<div class="row"><button class="ghost" data-mps="close">Close the rig</button></div>';
    } else if (MP.sim) {
      h += '<h3>The rig is open \u00b7 ' + esc(MP.sim.mode) + '</h3><div class="row"><button class="ghost" data-mpg="1">Go to the rig</button></div>';
    }
  }

  const others = MP.roster.filter(r => r.uid !== me.uid);
  h += '<h3>In this game</h3>';
  if (!others.length) h += '<p>Just you so far. The game stays open; others will see it in the lobby.</p>';
  else {
    h += '<div class="list">';
    for (const r of others) {
      const hos = mpHostileTo(r.uid);
      const mate = mpInParty(r.uid);
      /* Name on its own line, actions under it: three buttons beside a name crushes the
         name to one word a line on a phone. */
      h += '<div class="li"><i style="background:' + ((CLS[r.cls] || {}).col || '#888') + '"></i>' +
        '<div><b' + (hos ? ' style="color:#e2443c"' : '') + '>' + esc(r.name) + (hos ? ' \u00b7 hostile' : mate ? ' \u00b7 with you' : '') +
        (MP.speaking[r.uid] ? ' \u00b7 mic' : '') + '</b>' +
        '<span>Level ' + r.lvl + ' ' + ((CLS[r.cls] || {}).n || '') + ' \u00b7 ' + mpWhere(r.zi) + '</span></div></div>' +
        '<div class="row">' +
        '<button class="ghost' + (MP.muted[r.uid] ? ' on' : '') + '" data-mpm="' + r.uid + '">' + (MP.muted[r.uid] ? 'Unmute' : 'Mute') + '</button>' +
        (mate || hos ? '' : '<button class="ghost" data-mpi="' + r.uid + '">Invite</button>') +
        (hos ? '' : '<button class="ghost" data-mpt="' + r.uid + '">Trade</button>') +
        (MP.hostile[r.uid]
          ? '<button class="ghost" data-mpn="' + r.uid + '">Stand down</button>'
          : '<button class="ghost" data-mph="' + r.uid + '">Hostile</button>') + '</div>';
    }
    h += '</div>';
    h += '<p style="font-size:13px">Muting somebody silences their voice and what they type in this game. A whisper still arrives. Declaring hostility takes them out of your party and lets the two of you fight anywhere that is not a town. Standing down in town stops only your own swings; theirs remain, and the party does not come back while either flag is still up.</p>';
  }

  h += '<h3>What has been said</h3><div class="list">';
  for (const c of MP.chat.slice(-25).reverse()) {
    h += '<div class="li"><div>' + (c.sys ? '<span style="color:#9a93ad">' + esc(c.text) + '</span>'
      : '<b>' + esc(c.from) + (c.scope === 'party' ? ' \u00b7 party' : '') + '</b><span>' + esc(c.text) + '</span>') + '</div></div>';
  }
  h += '</div><p style="font-size:13px">The bar at the bottom of the screen is quicker than this tab.</p>';
  return h;
}

if (typeof devOn === 'function' && devOn()) window.__mp={MP,send:mpSend,get on(){return mpOn()},get inGame(){return mpIn()},get roster(){return MP.roster},get me(){return MP.me},get scale(){return MP.scale},get mobHost(){return MP.mobHost},mpHostileTo,mpSyncEnts,mpHp,mpXp,mpDmg,mute:mpMute,loadFriends:mpFriendsLoad,spendSats,satsFree,tradeLocked,tradeApply:mpTradeApply,takeHit:mpTakeHit,applyMobs:mpApplyMobs};

function mpWhere(zi) {
  if (zi === undefined || zi === null) return 'somewhere';
  if (zi === MP.simZone) return 'the rig';
  const z = ZONES[zi];
  return z ? z.n : 'district ' + zi;
}

function mpClick(d) {
  if (d.mpfa) {
    const n = document.getElementById('mpFriend'), name = n ? n.value.trim() : '';
    if (!name) return true;
    mpApi('/api/friend/ask', { name }).then(() => { if (n) n.value = ''; mpFriendsLoad(); }).catch(e => { toast(e.message || 'That did not go through.'); sfx('err'); });
    return true;
  }
  if (d.mpfj) { mpJoinFriend(d.mpfj); return true; }
  if (d.mpfy) { mpFriendAct('accept', d.mpfy); return true; }
  if (d.mpfn) { mpFriendAct('decline', d.mpfn); return true; }
  if (d.mpfr) { mpFriendAct('remove', d.mpfr); return true; }
  if (d.mpfb) { mpFriendAct('block', d.mpfb); return true; }
  if (d.mpfq) {
    mpApi('/api/friend/quiet', { on: !MP.closed }).then(() => mpFriendsLoad()).catch(e => { toast(e.message || 'That did not go through.'); sfx('err'); });
    return true;
  }
  if (d.mpfw) { MP.whisperTo = d.mpfw; drawSheet(); return true; }
  if (d.mpfs) {
    const n = document.getElementById('mpWhisper'), text = n ? n.value.trim() : '';
    if (text && MP.whisperTo) mpSend('whisper', { uid: MP.whisperTo, text: text });
    if (n) n.value = '';
    return true;
  }
  if (d.mpmr) {
    mpApi('/api/mail/read', { id: d.mpmr }).then(() => mpMailLoad()).catch(e => { toast(e.message || 'That did not go through.'); sfx('err'); });
    return true;
  }
  if (d.mpj) {
    const g = MP.lobby.find(x => x.id === d.mpj);
    if (g && g.locked) {
      dlgPrompt('“' + g.name + '” is locked', 'It needs a password.', pw => { MP.gamePass = pw || ''; mpSend('game.join', { id: d.mpj, pass: pw }); });
    } else { MP.gamePass = ''; mpSend('game.join', { id: d.mpj }); }
    return true;
  }
  if (d.mpd) { MP.mkDiff = d.mpd; drawSheet(); return true; }
  if (d.mpk) {
    const n = document.getElementById('mpName'), pw = document.getElementById('mpPass');
    MP.mkName = n ? n.value.trim() : '';
    MP.gamePass = pw ? pw.value : '';
    mpSend('game.create', { name: MP.mkName, diff: MP.mkDiff, pass: MP.gamePass });
    return true;
  }
  if (d.mpq) {
    dlg('Leave this game?', 'Your character and everything on it are saved. You lose the party, anybody you declared against stops being hostile, and the game carries on without you.',
      [['Leave', () => { MP.resume = null; MP.gamePass = ''; mpSend('game.leave', {}); drawSheet(); }], ['Stay']]);
    return true;
  }
  if (d.mpv) { mpMicToggle(); setTimeout(drawSheet, 300); return true; }
  if (d.mpm) { mpMute(d.mpm); drawSheet(); return true; }
  if (d.mpi) { mpSend('invite', { uid: d.mpi }); return true; }
  if (d.mpt) { mpSend('trade.ask', { uid: d.mpt }); return true; }
  if (d.mpta) { mpSend('trade.accept', { uid: d.mpta }); MP.tradeAsk = null; return true; }
  if (d.mptx) {
    if (MP.trade) mpSend('trade.cancel', {});
    MP.trade = null; MP.tradeAsk = null; MP.tradeLock = null; MP.tradePick = null; drawSheet(); return true;
  }
  if (d.tsee !== undefined) { sel = { theirs: +d.tsee }; drawSheet(); return true; }
  if (d.mptigo) {
    if (mpTradeFrozen()) { toast('The table is locked. Change the offer to unlock it.'); sfx('err'); return true; }
    MP.tradePick = MP.tradePick || {};
    if (MP.tradePick[d.mptigo]) delete MP.tradePick[d.mptigo]; else MP.tradePick[d.mptigo] = 1;
    drawSheet(); return true;
  }
  if (d.mpti) {
    if (mpTradeFrozen()) { toast('The table is locked. Change the offer to unlock it.'); sfx('err'); return true; }
    if (typeof uiTouch === 'function' && uiTouch()) { sel = { tid: d.mpti }; drawSheet(); return true; }
    MP.tradePick = MP.tradePick || {};
    if (MP.tradePick[d.mpti]) delete MP.tradePick[d.mpti]; else MP.tradePick[d.mpti] = 1;
    drawSheet(); return true;
  }
  if (d.mpto) { mpTradeSendOffer(); return true; }
  if (d.mptc) { if (!(MP.trade && MP.trade.you && MP.trade.you.ok)) mpSend('trade.confirm', {}); return true; }
  if (d.mpn) { mpSend('stand', { uid: d.mpn }); return true; }
  if (d.mph) {
    const r = MP.roster.find(x => x.uid === d.mph);
    dlg('Declare against ' + ((r && r.name) || 'them') + '?',
      'Do it in town, and stand there a few seconds first. Both of you need to be level 9, and you can name the same person once a minute. They leave your party. Outside a town you can fight, and standing down later only stops your own swings. Damage between players lands at ' +
      Math.round(MP.pvpScale * 100) + '%.',
      [['Declare', () => { mpSend('hostile', { uid: d.mph }); }], ['Leave it']]);
    return true;
  }
  if (d.mpl) { mpSend('leave', {}); return true; }
  if (d.mpc) { MP.scope = d.mpc; drawSheet(); return true; }
  if (d.mps) {
    if (d.mps === 'close') mpSend('sim', { action: 'close' });
    else mpSend('sim', { action: 'open', mode: d.mps });
    return true;
  }
  if (d.mpg) { if (mpPortalBlocked()) return true; closeSheet(); enter(MP.simZone); return true; }
  return false;
}

/* The game's own dialog takes buttons, not text, so a password needs its own small one. */
function dlgPrompt(title, body, then) {
  let box = document.getElementById('pmw');
  if (!box) { box = document.createElement('div'); box.id = 'pmw'; document.body.appendChild(box); }
  box.innerHTML = '<div class="bugp"><h2>' + esc(title) + '</h2><p>' + esc(body) + '</p>' +
    '<input id="pmIn" type="password" autocomplete="off" style="width:100%;box-sizing:border-box;background:#0a0912;border:1px solid #3a3350;color:#e8e2d4;border-radius:6px;padding:11px;font:15px Georgia,serif">' +
    '<div class="bugr"><button class="big" id="pmOk">Join</button><button class="ghost" id="pmNo">Cancel</button></div></div>';
  box.hidden = false;
  const done = v => { box.hidden = true; if (v !== null) then(v); };
  document.getElementById('pmOk').onclick = () => done(document.getElementById('pmIn').value);
  document.getElementById('pmNo').onclick = () => done(null);
  document.getElementById('pmIn').onkeydown = e => { e.stopPropagation(); if (e.key === 'Enter') done(document.getElementById('pmIn').value); };
  document.getElementById('pmIn').focus();
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
      game: MP.game ? MP.game.name : null, diff: MP.game ? MP.game.diff : null,
      players: MP.game ? MP.game.n : 1, scale: MP.scale || null, voice: MP.voice,
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

/* ================= voice =================
   A mesh: every pair of people in the game holds one connection and sends each other
   audio directly. The server carries only the handshake, so talking costs it nothing —
   and the mesh is why eight is the right number, since each person holds seven
   connections and that is already the comfortable limit.

   Loudness follows distance in the district, and the pan follows which side of you they
   are on, so a voice fades as somebody walks away and arrives from the direction they
   are standing in. Somebody in another district is heard faintly or not at all. */

const RTC_CFG = { iceServers: [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }] };
const VOICE_EDGE = 90;    /* a soft band at the edge of the screen, so voices fade rather than pop */
let AUDIOCTX = null;

function mpAudioCtx() {
  if (!AUDIOCTX) {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    AUDIOCTX = new C();
  }
  if (AUDIOCTX.state === 'suspended') AUDIOCTX.resume().catch(() => {});
  return AUDIOCTX;
}

async function mpVoiceStart() {
  if (MP.voice) return true;
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    toast('This browser will not give the game a microphone.');
    return false;
  }
  if (!window.isSecureContext) {
    toast('Voice needs a secure connection. Open the game over https and try again.');
    return false;
  }
  try {
    MP.stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }, video: false
    });
  } catch (e) {
    toast(e && e.name === 'NotAllowedError' ? 'The microphone was refused. Nothing is being recorded.' : 'No microphone available.');
    return false;
  }
  MP.voice = true;
  mpAudioCtx();
  mpSend('voice', { on: true });
  /* Offer to everybody already here; whoever joins later offers to us. */
  for (const r of MP.roster) if (r.uid !== (MP.me || {}).uid) mpPeer(r.uid, true);
  toast('Microphone open. Others hear you when they are near you.');
  return true;
}

function mpVoiceStop() {
  MP.voice = false;
  if (MP.stream) { for (const t of MP.stream.getTracks()) t.stop(); MP.stream = null; }
  for (const uid in MP.peers) mpPeerDrop(uid, true);
  mpSend('voice', { on: false });
}

/* Keep the mesh matching the roster: connect to anyone new, drop anyone gone. */
function mpVoiceSync() {
  if (!MP.voice) return;
  const here = {};
  for (const r of MP.roster) { here[r.uid] = 1; if (r.uid !== (MP.me || {}).uid && !MP.peers[r.uid]) mpPeer(r.uid, true); }
  for (const uid in MP.peers) if (!here[uid]) mpPeerDrop(uid);
}

function mpPeer(uid, offer) {
  let P0 = MP.peers[uid];
  if (P0) return P0;
  const pc = new RTCPeerConnection(RTC_CFG);
  P0 = MP.peers[uid] = { pc, el: null, gain: null, pan: null, src: null };
  if (MP.stream) for (const t of MP.stream.getTracks()) pc.addTrack(t, MP.stream);
  pc.onicecandidate = e => { if (e.candidate) mpSend('rtc', { uid, kind: 'ice', data: e.candidate }); };
  pc.ontrack = e => mpPeerAudio(uid, e.streams[0]);
  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'failed' || pc.connectionState === 'closed') mpPeerDrop(uid);
  };
  if (offer) {
    /* Only one side offers, or the two offers collide. The lower id does it. */
    if (String((MP.me || {}).uid) > String(uid)) return P0;
    pc.createOffer().then(o => pc.setLocalDescription(o).then(() => mpSend('rtc', { uid, kind: 'offer', data: o })))
      .catch(() => {});
  }
  return P0;
}

/* Each voice goes through a gain and a panner, which the position beat drives. */
function mpPeerAudio(uid, stream) {
  const P0 = MP.peers[uid];
  if (!P0 || !stream) return;
  const ctx = mpAudioCtx();
  /* The element is needed even when routing through Web Audio: some browsers will not
     start a remote stream that is not attached to one. It stays muted. */
  const el = new Audio();
  el.srcObject = stream; el.autoplay = true; el.muted = true;
  el.play().catch(() => {});
  P0.el = el;
  if (!ctx) { el.muted = false; return; }
  try {
    P0.src = ctx.createMediaStreamSource(stream);
    P0.gain = ctx.createGain();
    P0.pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    P0.gain.gain.value = 0;
    P0.src.connect(P0.gain);
    if (P0.pan) { P0.gain.connect(P0.pan); P0.pan.connect(ctx.destination); }
    else P0.gain.connect(ctx.destination);
  } catch (e) { el.muted = false; }
}

function mpPeerDrop(uid, quiet) {
  const P0 = MP.peers[uid];
  if (!P0) return;
  try { P0.pc.close(); } catch (e) {}
  if (P0.el) { try { P0.el.srcObject = null; } catch (e) {} }
  delete MP.peers[uid];
  if (!quiet) mpSend('rtc', { uid, kind: 'bye' });
}

function mpRtc(m) {
  const uid = m.from;
  if (m.kind === 'bye') return mpPeerDrop(uid, true);
  if (!MP.voice) return;              /* nothing to say back without a microphone */
  const P0 = mpPeer(uid, false), pc = P0.pc;
  if (m.kind === 'offer') {
    pc.setRemoteDescription(m.data)
      .then(() => pc.createAnswer())
      .then(a => pc.setLocalDescription(a).then(() => mpSend('rtc', { uid, kind: 'answer', data: a })))
      .catch(() => {});
  } else if (m.kind === 'answer') {
    pc.setRemoteDescription(m.data).catch(() => {});
  } else if (m.kind === 'ice') {
    pc.addIceCandidate(m.data).catch(() => {});
  }
}

/* Driven by the position beat, so it keeps working while a menu is open. */
function mpVoiceLevels() {
  if (!MP.voice || !P) return;
  for (const uid in MP.peers) {
    const P0 = MP.peers[uid];
    if (!P0.gain) continue;
    let v = 0, pan = 0;
    if (!MP.muted[uid]) {
      const o = MP.others.find(q => q.uid === uid);
      /* You hear whoever you can see. Somebody off the edge of your screen, or in another
         district entirely, is not there as far as your ears are concerned. */
      if (o) {
        const X = SX(o.x, o.y), Y = SY(o.x, o.y);
        const ox = Math.max(0, Math.max(-X, X - VW)), oy = Math.max(0, Math.max(-Y, Y - VH));
        const off = Math.hypot(ox, oy);
        v = off <= 0 ? 1 : off >= VOICE_EDGE ? 0 : 1 - off / VOICE_EDGE;
        pan = Math.max(-1, Math.min(1, (X - VW / 2) / (VW / 2)));
      }
    }
    try {
      P0.gain.gain.value = v * v;       /* squared, so it falls off the way loudness does */
      if (P0.pan) P0.pan.pan.value = pan;
    } catch (e) {}
  }
}

function mpMute(uid) {
  MP.muted[uid] = !MP.muted[uid];
  const r = MP.roster.find(x => x.uid === uid);
  toast((MP.muted[uid] ? 'Muted ' : 'Unmuted ') + ((r && r.name) || 'them') + '.');
  mpVoiceLevels();
}

/* ================= the chat bar =================
   On screen rather than buried in a tab, because a chat you have to open a menu to read
   is a chat nobody uses. It is small, it fades when nothing is happening, and it goes
   away entirely when you are not in a game. */

let chatEl = null, chatIn = null, chatLog = null, chatFade = 0;

function mpChatMount() {
  if (chatEl) return;
  chatEl = document.createElement('div');
  chatEl.id = 'chatw';
  /* Collapsed to two small buttons by default: a phone screen in a fight has no room for
     a text field, and the log reads fine without one. */
  chatEl.innerHTML =
    '<div id="chatlog"></div>' +
    '<div id="chatbar">' +
      '<button id="chatSay" title="Say something">SAY</button>' +
      '<input id="chatin" maxlength="400" placeholder="To everyone in the game" autocomplete="off">' +
      '<button id="chatMic" title="Microphone">MIC</button>' +
    '</div>';
  document.body.appendChild(chatEl);
  chatIn = document.getElementById('chatin');
  chatLog = document.getElementById('chatlog');

  chatIn.addEventListener('keydown', e => {
    e.stopPropagation();                      /* the game reads keys; the chat box owns them while focused */
    if (e.key === 'Enter') mpChatSend();
    if (e.key === 'Escape') mpChatClose();
  });
  chatIn.addEventListener('focus', () => chatEl.classList.add('live'));
  chatIn.addEventListener('blur', () => setTimeout(() => { if (!chatIn.value.trim()) mpChatClose(); }, 120));
  document.getElementById('chatSay').onclick = mpChatOpen;
  document.getElementById('chatMic').onclick = mpMicToggle;
}

function mpChatOpen() {
  chatEl.classList.add('open', 'live');
  MP.unread = 0;
  const b = document.getElementById('chatSay');
  if (b) b.classList.remove('pip');
  chatIn.focus();
}
function mpChatClose() {
  chatEl.classList.remove('open');
  chatIn.value = '';
  chatIn.blur();
}

function mpMicToggle() {
  const b = document.getElementById('chatMic');
  if (MP.voice) { mpVoiceStop(); if (b) b.className = ''; toast('Microphone closed.'); return; }
  mpVoiceStart().then(okNow => { if (b) b.className = okNow ? 'on' : ''; });
}

function mpChatSend() {
  const t = (chatIn.value || '').trim();
  if (!t) { mpChatClose(); return; }
  /* One scope, deliberately: everything typed reaches everybody in the game. Two
     channels means half of what gets said goes to the wrong one. */
  mpSend('chat', { text: t, scope: 'game' });
  chatIn.value = '';
}

function mpChatDraw() {
  if (!chatLog) return;
  const recent = MP.chat.slice(-6);
  chatLog.innerHTML = recent.map(c => c.sys
    ? '<div class="cl sys">' + esc(c.text) + '</div>'
    : '<div class="cl"><b>' + esc(c.from) + '</b> ' + esc(c.text) + '</div>'
  ).join('');
  chatFade = 9;
  chatEl.classList.add('live');
  const b = document.getElementById('chatSay');
  if (b && !chatEl.classList.contains('open')) b.classList.add('pip');
}

/* The bar is only there when there is somebody to say it to. */
function mpChatShow() {
  if (!chatEl) mpChatMount();
  /* Only while the world is on screen: a sheet, a dialog or a cinematic owns it instead. */
  const want = mpIn() && (mode === 'play' || mode === 'dying');
  if (!want && chatEl.classList.contains('open')) mpChatClose();
  chatEl.hidden = !want;
  if (!mpIn() && MP.voice) mpVoiceStop();
}
