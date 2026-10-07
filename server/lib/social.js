/* Friends and the offline mailbox.
   Neither lives under data/docs: that directory is the emailed backup, and a
   friend's letters do not belong in it. Neither hangs off the live player: that
   map dies on restart, and a friend has to survive one. Two tables, one row per
   account uid. Presence is not in here. A mutual friend learns where someone is
   only later, over the socket. */
'use strict';
const { Table } = require('./store');
const A = require('./auth');
const live = require('./live');

const friends = new Table('friends');
const boxes = new Table('mail');

const FRIEND_CAP = 25;                 /* friend + pending. blocks do not count */
const MAIL_CAP = 40;
const MAIL_MAX = 240;
const MAIL_TTL = 30 * 864e5;
const MISS = 'Nobody by that name.';

function miss() { return { ok: false, status: 404, error: MISS }; }
function fail(status, error) { return { ok: false, status, error }; }

/* findByName returns the whole account, hash included. Callers past this line
   see the name and the id and nothing else. */
function lookup(name) {
  if (typeof name !== 'string' || !name.trim()) return null;
  const u = A.findByName(name);
  if (!u || !u.id) return null;
  return { id: u.id, name: u.name };
}

function load(uid) {
  const r = friends.get(uid);
  if (!r || !r.to || typeof r.to !== 'object') return null;
  return r;
}
function edge(uid, other) {
  const r = load(uid);
  return r && r.to[other] || null;
}
function toward(r) {
  if (!r) return 0;
  let n = 0;
  for (const k in r.to) {
    const s = r.to[k] && r.to[k].state;
    if (s === 'friend' || s === 'pending') n++;
  }
  return n;
}
function writeEdge(uid, other, e) {
  const r = load(uid) || { to: {} };
  r.to[other] = { name: e.name, at: e.at, state: e.state };
  friends.set(uid, { to: r.to });
}
function delEdge(uid, other) {
  const r = load(uid);
  if (!r || !r.to[other]) return;
  delete r.to[other];
  if (!Object.keys(r.to).length) friends.del(uid);
  else friends.set(uid, { to: r.to });
}

function list(uid) {
  const r = load(uid);
  const to = {};
  if (r) for (const id in r.to) {
    const e = r.to[id];
    if (!e) continue;
    to[id] = { name: e.name, at: e.at, state: e.state };
  }
  return { ok: true, body: { to } };
}

/* pending: I asked. in: they asked me. friend: both accepted. blocked: I
   ignore them, and they are not told. A block on their row makes an ask look
   exactly like a name that is not registered. */
function ask(from, name) {
  const who = lookup(name);
  if (!who) return miss();
  if (who.id === from.id) return fail(400, 'That is you.');
  const mine = edge(from.id, who.id);
  const theirs = edge(who.id, from.id);
  if (theirs && theirs.state === 'blocked') return miss();
  if (mine && mine.state === 'blocked') return fail(400, 'You blocked them.');
  if (mine && mine.state === 'friend') return fail(400, 'Already a friend.');
  if (mine && mine.state === 'pending') return fail(400, 'You already asked.');
  if (mine && mine.state === 'in') return fail(400, 'They already asked you. Answer that.');
  if (toward(load(from.id)) >= FRIEND_CAP) return fail(400, 'The list holds 25.');
  const at = Date.now();
  writeEdge(from.id, who.id, { name: who.name, at, state: 'pending' });
  writeEdge(who.id, from.id, { name: from.name, at, state: 'in' });
  return { ok: true };
}

function answer(from, name, accept) {
  const who = lookup(name);
  if (!who) return miss();
  const theirs = edge(who.id, from.id);
  if (theirs && theirs.state === 'blocked') return miss();
  const mine = edge(from.id, who.id);
  if (!mine || mine.state !== 'in') return fail(400, 'Nothing to answer.');
  if (!accept) {
    delEdge(from.id, who.id);
    if (!theirs || theirs.state !== 'blocked') delEdge(who.id, from.id);
    return { ok: true };
  }
  if (toward(load(from.id)) >= FRIEND_CAP) return fail(400, 'The list holds 25.');
  writeEdge(from.id, who.id, { name: who.name, at: mine.at || Date.now(), state: 'friend' });
  writeEdge(who.id, from.id, { name: from.name, at: Date.now(), state: 'friend' });
  return { ok: true };
}

function remove(from, name) {
  const who = lookup(name);
  if (!who) return miss();
  const mine = edge(from.id, who.id);
  if (!mine) return miss();
  const theirs = edge(who.id, from.id);
  delEdge(from.id, who.id);
  /* A block is not a friendship, so clearing it does not touch their row.
     Removing a request or a friend does. */
  if (mine.state !== 'blocked' && theirs && theirs.state !== 'blocked') delEdge(who.id, from.id);
  return { ok: true };
}

function block(from, name) {
  const who = lookup(name);
  if (!who) return miss();
  if (who.id === from.id) return fail(400, 'That is you.');
  const theirs = edge(who.id, from.id);
  if (theirs && theirs.state === 'blocked') return miss();
  writeEdge(from.id, who.id, { name: who.name, at: Date.now(), state: 'blocked' });
  return { ok: true };
}

/* By uid, not by name. The name can be registered again, and that person is
   not the one who was deleted. */
function purge(uid) {
  if (!uid) return;
  friends.del(uid);
  const all = friends.all();
  let dirty = false;
  for (const k in all) {
    const r = all[k];
    if (!r || !r.to || !Object.prototype.hasOwnProperty.call(r.to, uid)) continue;
    delete r.to[uid];
    dirty = true;
    if (!Object.keys(r.to).length) delete all[k];
  }
  if (dirty) friends.flush();
  boxes.del(uid);
}

function freshBox(uid) {
  const r = boxes.get(uid);
  const box = r && Array.isArray(r.box) ? r.box : [];
  const cut = Date.now() - MAIL_TTL;
  return box.filter(m => m && typeof m.at === 'number' && m.at >= cut);
}
function saveBox(uid, box) {
  if (!box.length) boxes.del(uid);
  else boxes.set(uid, { box });
}
function sweep(uid) {
  const r = boxes.get(uid);
  const raw = r && Array.isArray(r.box) ? r.box : [];
  const box = freshBox(uid);
  if (raw.length !== box.length) saveBox(uid, box);
  return box;
}
function pubMail(m) {
  return { id: m.id, from: m.from, fromName: m.fromName, text: m.text, at: m.at, read: !!m.read };
}
function onLogin(uid) { if (uid) sweep(uid); }

function listMail(uid) {
  return { ok: true, body: { box: sweep(uid).map(pubMail) } };
}

/* Online delivery is milestone 5 and goes over the socket. A letter is only
   written when they are not connected. Not-a-friend, missing, and blocked all
   answer with the same sentence, so sending is not a directory. */
function send(from, name, text) {
  if (typeof text !== 'string') return fail(400, 'Write something.');
  const body = text.trim();
  if (!body) return fail(400, 'Write something.');
  if (body.length > MAIL_MAX) return fail(400, 'A letter stops at 240 characters.');
  const who = lookup(name);
  if (!who) return miss();
  if (who.id === from.id) return fail(400, 'That is you.');
  const mine = edge(from.id, who.id);
  const theirs = edge(who.id, from.id);
  const blocked = (mine && mine.state === 'blocked') || (theirs && theirs.state === 'blocked');
  const mutual = mine && mine.state === 'friend' && theirs && theirs.state === 'friend';
  if (blocked || !mutual) return miss();
  if (live.live && live.live.get(who.id)) return fail(400, 'They are on. Say it when the line is open.');
  const box = freshBox(who.id);
  const msg = { id: 'm' + A.rand(9), from: from.id, fromName: from.name, text: body, at: Date.now(), read: false };
  box.push(msg);
  while (box.length > MAIL_CAP) box.shift();
  saveBox(who.id, box);
  return { ok: true, body: { id: msg.id } };
}

function read(uid, id) {
  if (typeof id !== 'string' || !id) return fail(400, 'No such letter.');
  const box = sweep(uid);
  const m = box.find(x => x && x.id === id);
  if (!m) return fail(404, 'No such letter.');
  m.read = true;
  saveBox(uid, box);
  return { ok: true };
}

function del(uid, id) {
  if (typeof id !== 'string' || !id) return fail(400, 'No such letter.');
  const box = sweep(uid);
  const next = box.filter(x => x && x.id !== id);
  if (next.length === box.length) return fail(404, 'No such letter.');
  saveBox(uid, next);
  return { ok: true };
}

module.exports = {
  friends, boxes, list, ask, answer, remove, block, purge, onLogin,
  listMail, send, read, del, MISS, FRIEND_CAP, MAIL_CAP, MAIL_MAX
};
