#!/usr/bin/env node
/**
 * NexChat Server — pure Node.js built-ins only
 * Implements HTTP + WebSocket (RFC 6455) from scratch
 * Users stored in info.txt, messages in messages.json
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT      = process.env.PORT || 3000;
const DATA_DIR  = path.join(__dirname, 'data');
const INFO_FILE = path.join(DATA_DIR, 'info.txt');
const MSG_FILE  = path.join(DATA_DIR, 'messages.json');
const SESS_FILE = path.join(DATA_DIR, 'sessions.json');

// ── ensure data dir ──────────────────────────────────────────────────────────
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(INFO_FILE)) fs.writeFileSync(INFO_FILE, '');
if (!fs.existsSync(MSG_FILE))  fs.writeFileSync(MSG_FILE, '[]');
if (!fs.existsSync(SESS_FILE)) fs.writeFileSync(SESS_FILE, '{}');

// ── simple hash (no bcrypt) ──────────────────────────────────────────────────
function hashPassword(pw) {
  return crypto.createHash('sha256').update('cacachat_salt_' + pw).digest('hex');
}

// ── user storage (info.txt) ──────────────────────────────────────────────────
// Format: one line per user: email|hashedPassword|displayName|colorIndex|createdAt
function readUsers() {
  const raw = fs.readFileSync(INFO_FILE, 'utf8').trim();
  if (!raw) return [];
  return raw.split('\n').filter(Boolean).map(line => {
    const [email, hash, name, color, created] = line.split('|');
    return { email, hash, name, color: parseInt(color) || 0, created };
  });
}

function writeUsers(users) {
  const lines = users.map(u => [u.email, u.hash, u.name, u.color, u.created].join('|'));
  fs.writeFileSync(INFO_FILE, lines.join('\n') + (lines.length ? '\n' : ''));
}

function findUser(email) {
  return readUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

function createUser(email, password, name) {
  const users = readUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { error: 'Email already registered' };
  }
  if (name.length < 2 || name.length > 32) return { error: 'Name must be 2–32 chars' };
  const user = {
    email: email.toLowerCase(),
    hash: hashPassword(password),
    name: name.trim(),
    color: users.length % 8,
    created: new Date().toISOString()
  };
  users.push(user);
  writeUsers(users);
  return { user };
}

// ── session storage ──────────────────────────────────────────────────────────
function readSessions() {
  try { return JSON.parse(fs.readFileSync(SESS_FILE, 'utf8')); } catch { return {}; }
}
function writeSessions(s) { fs.writeFileSync(SESS_FILE, JSON.stringify(s, null, 2)); }

function createSession(email, name, color, isGuest) {
  const sessions = readSessions();
  const token = crypto.randomBytes(32).toString('hex');
  sessions[token] = { email, name, color, isGuest: !!isGuest, created: Date.now() };
  writeSessions(sessions);
  return token;
}

function getSession(token) {
  if (!token) return null;
  const sessions = readSessions();
  const s = sessions[token];
  if (!s) return null;
  // Expire guests after 24h
  if (s.isGuest && Date.now() - s.created > 86400000) {
    delete sessions[token];
    writeSessions(sessions);
    return null;
  }
  return s;
}

function deleteSession(token) {
  const sessions = readSessions();
  delete sessions[token];
  writeSessions(sessions);
}

// ── message storage ──────────────────────────────────────────────────────────
function readMessages() {
  try { return JSON.parse(fs.readFileSync(MSG_FILE, 'utf8')); } catch { return []; }
}
function writeMessages(msgs) {
  fs.writeFileSync(MSG_FILE, JSON.stringify(msgs.slice(-2000)));
}
function saveMessage(msg) {
  const msgs = readMessages();
  msgs.push(msg);
  writeMessages(msgs);
  return msg;
}

// ── connected WebSocket clients ──────────────────────────────────────────────
// Map of token -> { ws, session, lastSeen }
const clients = new Map();

function broadcast(data, excludeToken) {
  const json = JSON.stringify(data);
  for (const [token, client] of clients.entries()) {
    if (token !== excludeToken && client.ws.readyState === 1) {
      wsSend(client.ws, json);
    }
  }
}

function broadcastAll(data) {
  const json = JSON.stringify(data);
  for (const client of clients.values()) {
    if (client.ws.readyState === 1) wsSend(client.ws, json);
  }
}

function getOnlineUsers() {
  const seen = new Set();
  const list = [];
  for (const client of clients.values()) {
    const key = client.session.email || client.session.name;
    if (!seen.has(key)) {
      seen.add(key);
      list.push({
        name: client.session.name,
        color: client.session.color,
        email: client.session.email,
        isGuest: client.session.isGuest
      });
    }
  }
  return list;
}

// ── HTTP server ──────────────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') { res.writeHead(200); return res.end(); }

  // Parse token from Authorization or cookie
  function getToken() {
    const auth = req.headers['authorization'] || '';
    if (auth.startsWith('Bearer ')) return auth.slice(7);
    // Cookie fallback
    const cookie = req.headers.cookie || '';
    const match = cookie.match(/cacachat_token=([^;]+)/);
    return match ? match[1] : null;
  }

  // JSON response helper
  function json(statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  }

  // Body parser
  function body(cb) {
    let data = '';
    req.on('data', d => data += d);
    req.on('end', () => {
      try { cb(JSON.parse(data)); } catch { cb({}); }
    });
  }

  // ── Serve frontend ──
  if (pathname === '/' || pathname === '/index.html') {
    const htmlPath = path.join(__dirname, 'index.html');
    if (fs.existsSync(htmlPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(fs.readFileSync(htmlPath));
    }
    res.writeHead(404); return res.end('index.html not found in /public/');
  }

  // ── Auth: Register ──
  if (pathname === '/api/register' && req.method === 'POST') {
    return body(({ email, password, name }) => {
      if (!email || !password || !name) return json(400, { error: 'All fields required' });
      if (password.length < 6) return json(400, { error: 'Password must be at least 6 characters' });
      const result = createUser(email, password, name);
      if (result.error) return json(409, { error: result.error });
      const token = createSession(result.user.email, result.user.name, result.user.color, false);
      json(200, { token, user: { name: result.user.name, email: result.user.email, color: result.user.color, isGuest: false } });
    });
  }

  // ── Auth: Login ──
  if (pathname === '/api/login' && req.method === 'POST') {
    return body(({ email, password }) => {
      if (!email || !password) return json(400, { error: 'Email and password required' });
      const user = findUser(email);
      if (!user) return json(401, { error: 'No account with that email' });
      if (user.hash !== hashPassword(password)) return json(401, { error: 'Wrong password' });
      const token = createSession(user.email, user.name, user.color, false);
      json(200, { token, user: { name: user.name, email: user.email, color: user.color, isGuest: false } });
    });
  }

  // ── Auth: Guest ──
  if (pathname === '/api/guest' && req.method === 'POST') {
    return body(({ name }) => {
      if (!name || name.trim().length < 2) return json(400, { error: 'Guest name must be at least 2 characters' });
      const cleanName = name.trim().slice(0, 24);
      const color = Math.floor(Math.random() * 8);
      const token = createSession(`guest_${Date.now()}`, cleanName + ' (Guest)', color, true);
      json(200, { token, user: { name: cleanName + ' (Guest)', color, isGuest: true } });
    });
  }

  // ── Auth: Logout ──
  if (pathname === '/api/logout' && req.method === 'POST') {
    const token = getToken();
    if (token) deleteSession(token);
    json(200, { ok: true });
  }

  // ── Auth: Me ──
  if (pathname === '/api/me' && req.method === 'GET') {
    const token = getToken();
    const session = getSession(token);
    if (!session) return json(401, { error: 'Not authenticated' });
    json(200, { user: { name: session.name, email: session.email, color: session.color, isGuest: session.isGuest } });
  }

  // ── Messages: History ──
  if (pathname === '/api/messages' && req.method === 'GET') {
    const token = getToken();
    if (!getSession(token)) return json(401, { error: 'Not authenticated' });
    const room = url.searchParams.get('room') || 'general';
    const msgs = readMessages().filter(m => m.room === room).slice(-100);
    json(200, { messages: msgs });
  }

  // ── Online users ──
  if (pathname === '/api/online' && req.method === 'GET') {
    const token = getToken();
    if (!getSession(token)) return json(401, { error: 'Not authenticated' });
    json(200, { users: getOnlineUsers() });
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

// ── WebSocket upgrade (RFC 6455) ─────────────────────────────────────────────
server.on('upgrade', (req, socket, head) => {
  // Parse token from URL query
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const token = url.searchParams.get('token');
  const session = getSession(token);

  if (!session) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  // WebSocket handshake
  const key = req.headers['sec-websocket-key'];
  const acceptKey = crypto
    .createHash('sha1')
    .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
    .digest('base64');

  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
    'Upgrade: websocket\r\n' +
    'Connection: Upgrade\r\n' +
    `Sec-WebSocket-Accept: ${acceptKey}\r\n\r\n`
  );

  const ws = { socket, readyState: 1 };

  // Remove previous socket for same token (reconnect)
  if (clients.has(token)) {
    try { clients.get(token).ws.socket.destroy(); } catch {}
    clients.delete(token);
  }

  clients.set(token, { ws, session, token });

  // Send welcome
  wsSend(ws, JSON.stringify({
    type: 'welcome',
    user: { name: session.name, color: session.color, email: session.email, isGuest: session.isGuest },
    onlineUsers: getOnlineUsers()
  }));

  // Broadcast join
  broadcast({
    type: 'user_join',
    user: { name: session.name, color: session.color }
  }, token);

  // Update online list for everyone
  broadcastAll({ type: 'online_update', users: getOnlineUsers() });

  // ── Frame parser ──
  let buffer = Buffer.alloc(0);

  socket.on('data', (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);
    while (buffer.length >= 2) {
      const firstByte  = buffer[0];
      const secondByte = buffer[1];
      const opcode     = firstByte & 0x0f;
      const masked     = (secondByte & 0x80) !== 0;
      let payloadLen   = secondByte & 0x7f;
      let offset = 2;

      if (payloadLen === 126) {
        if (buffer.length < 4) break;
        payloadLen = buffer.readUInt16BE(2);
        offset = 4;
      } else if (payloadLen === 127) {
        if (buffer.length < 10) break;
        payloadLen = Number(buffer.readBigUInt64BE(2));
        offset = 10;
      }

      const maskLen = masked ? 4 : 0;
      if (buffer.length < offset + maskLen + payloadLen) break;

      const maskKey = masked ? buffer.slice(offset, offset + 4) : null;
      offset += maskLen;
      const payload = buffer.slice(offset, offset + payloadLen);
      buffer = buffer.slice(offset + payloadLen);

      // Unmask
      if (masked && maskKey) {
        for (let i = 0; i < payload.length; i++) {
          payload[i] ^= maskKey[i % 4];
        }
      }

      // Opcode 8 = close
      if (opcode === 8) {
        handleClose(token, session);
        socket.destroy();
        return;
      }

      // Opcode 9 = ping → pong
      if (opcode === 9) {
        wsFrame(ws, payload, 0x8a);
        continue;
      }

      // Opcode 1 = text
      if (opcode === 1) {
        try {
          const data = JSON.parse(payload.toString('utf8'));
          handleMessage(token, session, data);
        } catch {}
      }
    }
  });

  socket.on('close', () => handleClose(token, session));
  socket.on('error', () => handleClose(token, session));
});

function handleClose(token, session) {
  if (!clients.has(token)) return;
  clients.delete(token);
  broadcast({ type: 'user_leave', user: { name: session.name } });
  broadcastAll({ type: 'online_update', users: getOnlineUsers() });
}

function handleMessage(token, session, data) {
  const { type } = data;

  if (type === 'chat') {
    const text = (data.text || '').trim().slice(0, 2000);
    if (!text) return;
    const room = (data.room || 'general').trim().slice(0, 64);
    const msg = saveMessage({
      id: crypto.randomBytes(8).toString('hex'),
      room,
      sender: session.name,
      senderColor: session.color,
      text,
      ts: Date.now()
    });
    // Broadcast to ALL (including sender) so the sender's UI updates from server
    broadcastAll({ type: 'chat', message: msg });
  }

  if (type === 'typing') {
    const room = (data.room || 'general').trim().slice(0, 64);
    broadcast({ type: 'typing', user: session.name, room }, token);
  }

  if (type === 'stop_typing') {
    const room = (data.room || 'general').trim().slice(0, 64);
    broadcast({ type: 'stop_typing', user: session.name, room }, token);
  }

  if (type === 'ping') {
    wsSend(clients.get(token)?.ws, JSON.stringify({ type: 'pong' }));
  }
}

// ── WebSocket write helpers ──────────────────────────────────────────────────
function wsFrame(ws, payload, firstByte = 0x81) {
  if (!ws || ws.readyState !== 1) return;
  const len = payload.length;
  let header;
  if (len < 126) {
    header = Buffer.from([firstByte, len]);
  } else if (len < 65536) {
    header = Buffer.allocUnsafe(4);
    header[0] = firstByte; header[1] = 126;
    header.writeUInt16BE(len, 2);
  } else {
    header = Buffer.allocUnsafe(10);
    header[0] = firstByte; header[1] = 127;
    header.writeBigUInt64BE(BigInt(len), 2);
  }
  try {
    ws.socket.write(Buffer.concat([header, payload]));
  } catch {}
}

function wsSend(ws, json) {
  wsFrame(ws, Buffer.from(json, 'utf8'));
}

// ── Start ────────────────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`\n🚀 CacaChat running at http://localhost:${PORT}`);
  console.log(`📁 User data stored in: ${INFO_FILE}`);
  console.log(`💬 Messages stored in: ${MSG_FILE}`);
  console.log('\nOpen http://localhost:' + PORT + ' in multiple browser tabs or devices on your network');
  console.log('For network access: http://<your-ip>:' + PORT + '\n');
});