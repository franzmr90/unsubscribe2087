/* A WebSocket server in the standard library.
   RFC 6455 is a handshake and a frame header; the parts a game needs are the text frame,
   close, and ping/pong. Implementing them is cheaper than taking on a dependency, and the
   client side is the browser's own WebSocket, which is fully conformant regardless. */
'use strict';
const crypto = require('crypto');
const { EventEmitter } = require('events');

const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
const MAX_FRAME = 512 * 1024;

class Conn extends EventEmitter {
  constructor(socket) {
    super();
    this.socket = socket;
    this.open = true;
    this.buf = Buffer.alloc(0);
    this.alive = true;
    socket.on('data', d => this._data(d));
    socket.on('close', () => this._shut());
    socket.on('error', () => this._shut());
    socket.setNoDelay(true);
  }

  _shut() {
    if (!this.open) return;
    this.open = false;
    this.emit('close');
  }

  _data(d) {
    this.buf = Buffer.concat([this.buf, d]);
    for (;;) {
      const f = this._frame();
      if (!f) return;
      if (f.op === 8) { this.close(); return; }
      if (f.op === 9) { this._send(10, f.payload); continue; }   /* ping -> pong */
      if (f.op === 10) { this.alive = true; continue; }
      if (f.op === 1) {
        let msg = null;
        try { msg = JSON.parse(f.payload.toString('utf8')); } catch (e) { continue; }
        this.emit('message', msg);
      }
    }
  }

  _frame() {
    const b = this.buf;
    if (b.length < 2) return null;
    const fin = (b[0] & 0x80) !== 0, op = b[0] & 0x0f, masked = (b[1] & 0x80) !== 0;
    let len = b[1] & 0x7f, off = 2;
    if (len === 126) { if (b.length < 4) return null; len = b.readUInt16BE(2); off = 4; }
    else if (len === 127) {
      if (b.length < 10) return null;
      const big = b.readBigUInt64BE(2);
      if (big > BigInt(MAX_FRAME)) { this.close(); return null; }
      len = Number(big); off = 10;
    }
    if (len > MAX_FRAME) { this.close(); return null; }
    /* Every frame from a browser is masked; an unmasked one is a protocol violation. */
    if (!masked) { this.close(); return null; }
    if (b.length < off + 4 + len) return null;
    const key = b.slice(off, off + 4);
    const payload = Buffer.allocUnsafe(len);
    for (let i = 0; i < len; i++) payload[i] = b[off + 4 + i] ^ key[i & 3];
    this.buf = b.slice(off + 4 + len);
    /* Continuation frames are not used by this protocol; every message is one frame. */
    if (!fin) { this.close(); return null; }
    return { op, payload };
  }

  _send(op, payload) {
    if (!this.open) return;
    const len = payload.length;
    let head;
    if (len < 126) { head = Buffer.allocUnsafe(2); head[1] = len; }
    else if (len < 65536) { head = Buffer.allocUnsafe(4); head[1] = 126; head.writeUInt16BE(len, 2); }
    else { head = Buffer.allocUnsafe(10); head[1] = 127; head.writeBigUInt64BE(BigInt(len), 2); }
    head[0] = 0x80 | op;
    try { this.socket.write(Buffer.concat([head, payload])); } catch (e) { this._shut(); }
  }

  send(obj) { this._send(1, Buffer.from(JSON.stringify(obj), 'utf8')); }
  ping() { this.alive = false; this._send(9, Buffer.alloc(0)); }
  close() { if (this.open) { try { this._send(8, Buffer.alloc(0)); this.socket.end(); } catch (e) {} } this._shut(); }
}

/* Attach to an existing http server. `verify(req)` returns the context to hand the
   connection, or null to refuse — that is where the session cookie is checked. */
function attach(server, pathname, verify, onConn) {
  server.on('upgrade', (req, socket, head) => {
    const url = new URL(req.url, 'http://x');
    if (url.pathname !== pathname) { socket.destroy(); return; }
    const key = req.headers['sec-websocket-key'];
    if (!key || (req.headers.upgrade || '').toLowerCase() !== 'websocket') { socket.destroy(); return; }
    let ctx = null;
    try { ctx = verify(req); } catch (e) { ctx = null; }
    if (!ctx) {
      socket.write('HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n');
      socket.destroy();
      return;
    }
    const accept = crypto.createHash('sha1').update(key + GUID).digest('base64');
    socket.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ' + accept + '\r\n\r\n');
    const conn = new Conn(socket);
    if (head && head.length) conn._data(head);
    onConn(conn, ctx);
  });
}

module.exports = { attach, Conn };
