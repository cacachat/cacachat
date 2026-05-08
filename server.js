#!/usr/bin/env node
/**
 * NexChat Server — pure Node.js built-ins + Upstash Redis (via REST)
 * No npm packages needed for Redis — uses built-in fetch
 */

const http   = require('http');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;

// ── Upstash Redis REST ────────────────────────────────────────────────────────
const REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!REDIS_URL || !REDIS_TOKEN) {
  console.error('❌  Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN env vars');
  process.exit(1);
}

async function redis(...args) {
  const res = await fetch(`${REDIS_URL}/${args.map(encodeURIComponent).join('/')}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` }
  });
  const data = await res.json();
  if (data.error) throw new Error('Redis error: ' + data.error);
  return data.result;
}

// Helpers
const r = {
  get:    (key)        => redis('GET', key),
  set:    (key, val)   => redis('SET', key, val),
  setex:  (key, s, v)  => redis('SETEX', key, s, v),
  del:    (key)        => redis('DEL', key),
  exists: (key)        => redis('EXISTS', key),
  lpush:  (key, val)   => redis('LPUSH', key, val),
  lrange: (key, s, e)  => redis('LRANGE', key, s, e),
  ltrim:  (key, s, e)  => redis('LTRIM', key, s, e),
  hset:   (key, f, v)  => redis('HSET', key, f, v),
  hget:   (key, f)     => redis('HGET', key, f),
  hdel:   (key, f)     => redis('HDEL', key, f),
  hgetall:(key)        => redis('HGETALL', key),
};

// ── Password hashing ──────────────────────────────────────────────────────────
function hashPassword(pw) {
  return crypto.createHash('sha256').update('cacachat_salt_' + pw).digest('hex');
}

// ── User storage (Redis hash: users:<email>) ──────────────────────────────────
async function findUser(email) {
  const raw = await r.get('user:' + email.toLowerCase());
  return raw ? JSON.parse(raw) : null;
}

async function createUser(email, password, name) {
  const key = 'user:' + email.toLowerCase();
  if (await r.exists(key)) return { error: 'Email already registered' };
  if (name.length < 2 || name.length > 32) return { error: 'Name must be 2–32 chars' };
  const countRaw = await r.get('user_count');
  const count = countRaw ? parseInt(countRaw) : 0;
  const user = {
    email: email.toLowerCase(),
    hash: hashPassword(password),
    name: name.trim(),
    color: count % 8,
    created: new Date().toISOString()
  };
  await r.set(key, JSON.stringify(user));
  await r.set('user_count', count + 1);
  return { user };
}

// ── Session storage (Redis key: sess:<token>, TTL 30 days) ────────────────────
async function createSession(email, name, color, isGuest) {
  const token = crypto.randomBytes(32).toString('hex');
  const session = { email, name, color, isGuest: !!isGuest, created: Date.now() };
  const ttl = isGuest ? 86400 : 2592000; // 1 day guest, 30 days regular
  await r.setex('sess:' + token, ttl, JSON.stringify(session));
  return token;
}

async function getSession(token) {
  if (!token) return null;
  const raw = await r.get('sess:' + token);
  return raw ? JSON.parse(raw) : null;
}

async function deleteSession(token) {
  await r.del('sess:' + token);
}

// ── Message storage (Redis list: msgs:<room>, newest first) ───────────────────
async function getMessages(room, count = 100) {
  const items = await r.lrange('msgs:' + room, 0, count - 1);
  return items.map(i => JSON.parse(i)).reverse();
}

async function saveMessage(msg) {
  await r.lpush('msgs:' + msg.room, JSON.stringify(msg));
  await r.ltrim('msgs:' + msg.room, 0, 1999); // keep last 2000
  return msg;
}

// ── Connected WebSocket clients ───────────────────────────────────────────────
const clients = new Map(); // token -> { ws, session }

function broadcast(data, excludeToken) {
  const json = JSON.stringify(data);
  for (const [tok, client] of clients.entries()) {
    if (tok !== excludeToken && client.ws.readyState === 1) wsSend(client.ws, json);
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
      list.push({ name: client.session.name, color: client.session.color, email: client.session.email, isGuest: client.session.isGuest });
    }
  }
  return list;
}

// ── HTTP server ───────────────────────────────────────────────────────────────
const fs   = require('fs');
const path = require('path');

const server = http.createServer(async (req, res) => {
  const url      = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') { res.writeHead(200); return res.end(); }

  function getToken() {
    const auth = req.headers['authorization'] || '';
    if (auth.startsWith('Bearer ')) return auth.slice(7);
    const cookie = req.headers.cookie || '';
    const match = cookie.match(/cacachat_token=([^;]+)/);
    return match ? match[1] : null;
  }

  function json(code, data) {
    res.writeHead(code, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  }

  function body(cb) {
    let data = '';
    req.on('data', d => data += d);
    req.on('end', () => { try { cb(JSON.parse(data)); } catch { cb({}); } });
  }

  try {
    // ── Serve frontend ──
    if (pathname === '/' || pathname === '/index.html') {
      const htmlPath = path.join(__dirname, 'index.html');
      if (fs.existsSync(htmlPath)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(fs.readFileSync(htmlPath));
      }
      res.writeHead(404); return res.end('index.html not found');
    }

    // ── Register ──
    if (pathname === '/api/register' && req.method === 'POST') {
      return body(async ({ email, password, name }) => {
        if (!email || !password || !name) return json(400, { error: 'All fields required' });
        if (password.length < 6) return json(400, { error: 'Password must be at least 6 characters' });
        const result = await createUser(email, password, name);
        if (result.error) return json(409, { error: result.error });
        const token = await createSession(result.user.email, result.user.name, result.user.color, false);
        json(200, { token, user: { name: result.user.name, email: result.user.email, color: result.user.color, isGuest: false } });
      });
    }

    // ── Login ──
    if (pathname === '/api/login' && req.method === 'POST') {
      return body(async ({ email, password }) => {
        if (!email || !password) return json(400, { error: 'Email and password required' });
        const user = await findUser(email);
        if (!user) return json(401, { error: 'No account with that email' });
        if (user.hash !== hashPassword(password)) return json(401, { error: 'Wrong password' });
        const token = await createSession(user.email, user.name, user.color, false);
        json(200, { token, user: { name: user.name, email: user.email, color: user.color, isGuest: false } });
      });
    }

    // ── Guest ──
    if (pathname === '/api/guest' && req.method === 'POST') {
      return body(async ({ name }) => {
        if (!name || name.trim().length < 2) return json(400, { error: 'Guest name must be at least 2 characters' });
        const cleanName = name.trim().slice(0, 24);
        const color = Math.floor(Math.random() * 8);
        const token = await createSession(`guest_${Date.now()}`, cleanName + ' (Guest)', color, true);
        json(200, { token, user: { name: cleanName + ' (Guest)', color, isGuest: true } });
      });
    }

    // ── Logout ──
    if (pathname === '/api/logout' && req.method === 'POST') {
      const token = getToken();
      if (token) await deleteSession(token);
      return json(200, { ok: true });
    }

    // ── Me ──
    if (pathname === '/api/me' && req.method === 'GET') {
      const token = getToken();
      const session = await getSession(token);
      if (!session) return json(401, { error: 'Not authenticated' });
      return json(200, { user: { name: session.name, email: session.email, color: session.color, isGuest: session.isGuest } });
    }

    // ── Messages ──
    if (pathname === '/api/messages' && req.method === 'GET') {
      const token = getToken();
      if (!await getSession(token)) return json(401, { error: 'Not authenticated' });
      const room = url.searchParams.get('room') || 'general';
      const msgs = await getMessages(room, 100);
      return json(200, { messages: msgs });
    }

    // ── Online users ──
    if (pathname === '/api/online' && req.method === 'GET') {
      const token = getToken();
      if (!await getSession(token)) return json(401, { error: 'Not authenticated' });
      return json(200, { users: getOnlineUsers() });
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));

  } catch (err) {
    console.error('Server error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
});

// ── WebSocket upgrade ─────────────────────────────────────────────────────────
server.on('upgrade', async (req, socket, head) => {
  const url   = new URL(req.url, `http://localhost:${PORT}`);
  const token = url.searchParams.get('token');

  let session;
  try { session = await getSession(token); } catch { session = null; }

  if (!session) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  const key = crypto
    .createHash('sha1')
    .update(req.headers['sec-websocket-key'] + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
    .digest('base64');

  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
    'Upgrade: websocket\r\n' +
    'Connection: Upgrade\r\n' +
    `Sec-WebSocket-Accept: ${key}\r\n\r\n`
  );

  const ws = { socket, readyState: 1 };

  if (clients.has(token)) {
    try { clients.get(token).ws.socket.destroy(); } catch {}
    clients.delete(token);
  }

  clients.set(token, { ws, session, token });

  wsSend(ws, JSON.stringify({
    type: 'welcome',
    user: { name: session.name, color: session.color, email: session.email, isGuest: session.isGuest },
    onlineUsers: getOnlineUsers()
  }));

  broadcast({ type: 'user_join', user: { name: session.name, color: session.color } }, token);
  broadcastAll({ type: 'online_update', users: getOnlineUsers() });

  let buffer = Buffer.alloc(0);

  socket.on('data', chunk => {
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
        payloadLen = buffer.readUInt16BE(2); offset = 4;
      } else if (payloadLen === 127) {
        if (buffer.length < 10) break;
        payloadLen = Number(buffer.readBigUInt64BE(2)); offset = 10;
      }

      const maskLen = masked ? 4 : 0;
      if (buffer.length < offset + maskLen + payloadLen) break;

      const maskKey = masked ? buffer.slice(offset, offset + 4) : null;
      offset += maskLen;
      const payload = buffer.slice(offset, offset + payloadLen);
      buffer = buffer.slice(offset + payloadLen);

      if (masked && maskKey) {
        for (let i = 0; i < payload.length; i++) payload[i] ^= maskKey[i % 4];
      }

      if (opcode === 8) { handleClose(token, session); socket.destroy(); return; }
      if (opcode === 9) { wsFrame(ws, payload, 0x8a); continue; }
      if (opcode === 1) {
        try { handleMessage(token, session, JSON.parse(payload.toString('utf8'))); } catch {}
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

async function handleMessage(token, session, data) {
  const { type } = data;

  if (type === 'chat') {
    const text = (data.text || '').trim().slice(0, 2000);
    if (!text) return;
    const room = (data.room || 'general').trim().slice(0, 64);
    const msg = await saveMessage({
      id: crypto.randomBytes(8).toString('hex'),
      room,
      sender: session.name,
      senderColor: session.color,
      text,
      ts: Date.now()
    });
    broadcastAll({ type: 'chat', message: msg });
  }

  if (type === 'typing') {
    broadcast({ type: 'typing', user: session.name, room: (data.room || 'general').trim().slice(0, 64) }, token);
  }

  if (type === 'stop_typing') {
    broadcast({ type: 'stop_typing', user: session.name, room: (data.room || 'general').trim().slice(0, 64) }, token);
  }

  if (type === 'dm') {
    const text = (data.text || '').trim().slice(0, 2000);
    const to   = (data.to || '').trim();
    const msgId = data.id || crypto.randomBytes(8).toString('hex');
    if (!text || !to) return;
    const msg = { id: msgId, sender: session.name, to, text, ts: Date.now(), isDM: true };
    // Send to recipient(s)
    for (const [tok, client] of clients.entries()) {
      if (client.session.name === to || tok === token) {
        wsSend(client.ws, JSON.stringify({ type: 'dm', message: msg }));
      }
    }
  }

  if (type === 'ping') {
    const c = clients.get(token);
    if (c) wsSend(c.ws, JSON.stringify({ type: 'pong' }));
  }
}

// ── WebSocket frame helpers ───────────────────────────────────────────────────
function wsFrame(ws, payload, firstByte = 0x81) {
  if (!ws || ws.readyState !== 1) return;
  const len = payload.length;
  let header;
  if (len < 126)        header = Buffer.from([firstByte, len]);
  else if (len < 65536) { header = Buffer.allocUnsafe(4); header[0] = firstByte; header[1] = 126; header.writeUInt16BE(len, 2); }
  else                  { header = Buffer.allocUnsafe(10); header[0] = firstByte; header[1] = 127; header.writeBigUInt64BE(BigInt(len), 2); }
  try { ws.socket.write(Buffer.concat([header, payload])); } catch {}
}

function wsSend(ws, json) {
  wsFrame(ws, Buffer.from(json, 'utf8'));
}

// ── Start ─────────────────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`\n🚀 CacaChat running at http://localhost:${PORT}`);
  console.log(`⚡ Using Upstash Redis: ${REDIS_URL}`);
});
