#!/usr/bin/env node
/**
 * NexChat Server — pure Node.js built-ins + Upstash Redis (via REST)
 * No npm packages needed for Redis — uses built-in fetch
 */

const http   = require('http');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;

// ── Admin ─────────────────────────────────────────────────────────────────────
const ADMIN_KEY = process.env.ADMIN_KEY;
function checkAdminKey(key) {
  if (!ADMIN_KEY) return false;
  return key === ADMIN_KEY;
}

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

// Helpers (Upstash REST)
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
  sadd:   (key, ...m)  => redis('SADD', key, ...m),
  smembers:(key)       => redis('SMEMBERS', key),
  srem:   (key, ...m)  => redis('SREM', key, ...m),
  sismember:(key, m)   => redis('SISMEMBER', key, m),
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

function validUsername(username) {
  if (!username || typeof username !== 'string') return { error: 'Username required' };
  const v = username.trim().toLowerCase();
  if (v.length < 3 || v.length > 20) return { error: 'Username must be 3–20 characters' };
  if (!/^[a-z0-9_]+$/.test(v)) return { error: 'Username: letters, numbers, underscore only' };
  return { value: v };
}

async function createUser(email, password, name, username) {
  const ucheck = validUsername(username);
  if (ucheck.error) return ucheck;
  const unameKey = 'uname:' + ucheck.value;
  if (await r.exists(unameKey)) return { error: 'That username is already taken' };

  const key = 'user:' + email.toLowerCase();
  if (await r.exists(key)) return { error: 'Email already registered' };
  if (name.length < 2 || name.length > 32) return { error: 'Display name must be 2–32 chars' };

  const countRaw = await r.get('user_count');
  const count = countRaw ? parseInt(countRaw) : 0;
  const user = {
    email: email.toLowerCase(),
    hash: hashPassword(password),
    name: name.trim(),
    username: ucheck.value,
    color: count % 8,
    created: new Date().toISOString(),
    avatarUrl: null,
  };
  await r.set(key, JSON.stringify(user));
  await r.set(unameKey, user.email);
  await r.sadd('username_index', ucheck.value);
  await r.set('user_count', count + 1);
  await r.set(defaultSocKey(ucheck.value), JSON.stringify(emptySoc()));
  return { user };
}

function emptySoc() {
  return { friends: [], in: [], out: [], blocked: [] };
}

function defaultSocKey(uname) {
  return 'soc:' + uname;
}

async function loadSoc(username) {
  const raw = await r.get(defaultSocKey(username));
  if (!raw) return emptySoc();
  try {
    const x = JSON.parse(raw);
    return {
      friends: Array.isArray(x.friends) ? x.friends : [],
      in: Array.isArray(x.in) ? x.in : [],
      out: Array.isArray(x.out) ? x.out : [],
      blocked: Array.isArray(x.blocked) ? x.blocked : [],
    };
  } catch {
    return emptySoc();
  }
}

async function saveSoc(username, soc) {
  await r.set(defaultSocKey(username), JSON.stringify(soc));
}

async function ensureUserSoc(username) {
  const k = defaultSocKey(username);
  if (!(await r.exists(k))) await r.set(k, JSON.stringify(emptySoc()));
}

async function ensureUsernameRegistered(user) {
  if (!user || user.username) return user;
  const baseRaw = user.email.replace(/[@.+-]/g, '_').slice(0, 10) || 'user';
  let v = '';
  for (let i = 0; i < 200; i++) {
    const tryName = baseRaw.slice(0, 12).replace(/[^a-z0-9_]/g, '') || 'user';
    v = ((tryName + (i ? '_' + i : ''))).toLowerCase().slice(0, 18);
    if (v.length < 3) v = 'usr' + crypto.randomBytes(2).toString('hex');
    if (!(await r.exists('uname:' + v))) break;
    v = '';
  }
  if (!v) v = 'u' + crypto.randomBytes(8).toString('hex').slice(0, 14);
  const key = 'user:' + user.email.toLowerCase();
  user.username = v;
  await r.set('uname:' + v, user.email.toLowerCase());
  await r.sadd('username_index', v);
  await ensureUserSoc(v);
  await r.set(key, JSON.stringify(user));
  return user;
}

async function findUserByUsername(unameRaw) {
  const u = typeof unameRaw === 'string' ? unameRaw.trim().toLowerCase() : '';
  if (!u) return null;
  const email = await r.get('uname:' + u);
  if (!email) return null;
  return findUser(email);
}

async function canDmPeers(aU, bU, aGuest, bGuest) {
  if (!aU || !bU || aU === bU) return false;
  if (aGuest || bGuest) return true;
  const sa = await loadSoc(aU);
  const sb = await loadSoc(bU);
  if (sa.blocked.includes(bU) || sb.blocked.includes(aU)) return false;
  return sa.friends.includes(bU) && sb.friends.includes(aU);
}

function dmThreadKey(u1, u2) {
  return 'dm:' + [u1, u2].sort().join(':');
}

async function saveDmHistory(senderU, recipientU, msg) {
  const key = dmThreadKey(senderU, recipientU);
  await r.lpush(key, JSON.stringify(msg));
  await r.ltrim(key, 0, 1999);
}

// ── Session storage (Redis key: sess:<token>, TTL 30 days) ────────────────────
async function createSession(email, name, color, isGuest, avatarUrl = null, username = null) {
  const token = crypto.randomBytes(32).toString('hex');
  let u = username;
  if (!u && isGuest) {
    u = 'gst_' + crypto.randomBytes(10).toString('hex');
  }
  const session = {
    email,
    name,
    username: u || '',
    color,
    isGuest: !!isGuest,
    avatarUrl: avatarUrl || null,
    created: Date.now(),
  };
  const ttl = isGuest ? 86400 : 2592000;
  await r.setex('sess:' + token, ttl, JSON.stringify(session));
  return token;
}

async function getSession(token) {
  if (!token) return null;
  const raw = await r.get('sess:' + token);
  return raw ? JSON.parse(raw) : null;
}

const MAX_AVATAR_LEN = 280000;

function sanitizeAvatarUrl(url) {
  if (url == null) return null;
  const s = String(url).trim();
  if (!s) return null;
  if (s.length > MAX_AVATAR_LEN) return { error: 'Profile image is too large' };
  if (s.startsWith('https://') || s.startsWith('http://')) return s.slice(0, MAX_AVATAR_LEN);
  if (
    s.startsWith('data:image/png;base64,') ||
    s.startsWith('data:image/jpeg;base64,') ||
    s.startsWith('data:image/webp;base64,')
  )
    return s;
  return { error: 'Use http(s):// image link or PNG/JPEG/WebP (cropped upload).' };
}

async function mergeSession(token, patch) {
  const key = 'sess:' + token;
  const prev = await getSession(token);
  if (!prev) return null;
  const ttlRaw = await redis('TTL', key);
  const ttlNum = ttlRaw !== null && ttlRaw !== undefined ? Number(ttlRaw) : NaN;
  const ttlSec = Number.isFinite(ttlNum) && ttlNum > 0 ? ttlNum : prev.isGuest ? 86400 : 2592000;
  Object.assign(prev, patch);
  await r.setex(key, ttlSec, JSON.stringify(prev));
  const fresh = await getSession(token);
  const cli = clients.get(token);
  if (cli && fresh) cli.session = fresh;
  return fresh;
}

async function hydrateSessionFromUser(token) {
  let s = await getSession(token);
  if (!s || s.isGuest || !s.email || String(s.email).startsWith('guest_')) return s;
  const raw = await r.get('user:' + String(s.email).toLowerCase());
  if (!raw) return s;
  let u;
  try {
    u = JSON.parse(raw);
  } catch {
    return s;
  }
  u = await ensureUsernameRegistered(u);
  await mergeSession(token, {
    username: u.username,
    name: u.name,
    avatarUrl: u.avatarUrl ?? s.avatarUrl,
  });
  return await getSession(token);
}

function payloadUser(email, name, color, isGuest, avatarUrl, username) {
  return {
    email: email || '',
    name,
    color,
    isGuest,
    avatarUrl: avatarUrl || null,
    username: username || '',
  };
}

async function resolveRecipientUsername(data) {
  const raw = String(data.toUsername || data.to || '').trim();
  if (!raw) return null;

  const lowerTry = raw.toLowerCase();

  for (const c of clients.values()) {
    if (String(c.session.username || '').toLowerCase() === lowerTry) return c.session.username;
  }
  for (const c of clients.values()) {
    if (c.session.name === raw) return c.session.username;
  }

  const u = await findUserByUsername(lowerTry);
  if (u && u.username) return u.username;
  return null;
}

async function searchUsernames(q, limit = 24) {
  const all = await r.smembers('username_index');
  if (!Array.isArray(all)) return [];
  const p = q.trim().toLowerCase();
  const list = [];
  for (const u of all) {
    if (typeof u !== 'string') continue;
    if (!p || u.includes(p)) list.push(u);
    if (list.length >= limit * 8) break;
  }
  if (!p) return list.slice(0, limit);
  return list.filter(u => u.includes(p)).slice(0, limit);
}

async function publicUserCard(username) {
  const fu = await findUserByUsername(username);
  if (!fu || !fu.username) return null;
  return {
    username: fu.username,
    name: fu.name || fu.username,
    avatarUrl: fu.avatarUrl || null,
    color: fu.color ?? 0,
  };
}

async function buildSocialEnvelope(meU) {
  const soc = await loadSoc(meU);
  await ensureUserSoc(meU);
  const friends = [];
  for (const f of soc.friends) {
    const c = await publicUserCard(f);
    if (c) friends.push(c);
  }
  const pendingIn = [];
  for (const row of soc.in || []) {
    const from = row.from || row;
    const c = await publicUserCard(from);
    if (c) pendingIn.push({ ...c, ts: row.ts || Date.now() });
  }
  const pendingOut = [];
  for (const row of soc.out || []) {
    const to = row.to || row;
    const c = await publicUserCard(to);
    if (c) pendingOut.push({ ...c, ts: row.ts || Date.now() });
  }
  const blocked = [];
  for (const b of soc.blocked) {
    const c = await publicUserCard(b);
    if (c) blocked.push(c);
  }
  return { friends, pendingIn, pendingOut, blocked };
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
    const key = client.session.username || client.session.email || client.session.name;
    if (!seen.has(key)) {
      seen.add(key);
      list.push({
        username: client.session.username || '',
        name: client.session.name,
        color: client.session.color,
        email: client.session.email,
        isGuest: client.session.isGuest,
        avatarUrl: client.session.avatarUrl || null,
      });
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
      return body(async ({ email, password, name, username }) => {
        if (!email || !password || !name || !username) return json(400, { error: 'Username, display name, email, and password are required' });
        if (password.length < 6) return json(400, { error: 'Password must be at least 6 characters' });
        const result = await createUser(email, password, name, username);
        if (result.error) return json(409, { error: result.error });
        const u = result.user;
        const token = await createSession(u.email, u.name, u.color, false, u.avatarUrl ?? null, u.username);
        json(200, {
          token,
          user: payloadUser(u.email, u.name, u.color, false, u.avatarUrl, u.username),
        });
      });
    }

    // ── Login ──
    if (pathname === '/api/login' && req.method === 'POST') {
      return body(async ({ email, password }) => {
        if (!email || !password) return json(400, { error: 'Email and password required' });
        let user = await findUser(email);
        if (!user) return json(401, { error: 'No account with that email' });
        if (user.hash !== hashPassword(password)) return json(401, { error: 'Wrong password' });
        user = await ensureUsernameRegistered(user);
        const avatarUrl = user.avatarUrl ?? null;
        const token = await createSession(user.email, user.name, user.color, false, avatarUrl, user.username);
        json(200, {
          token,
          user: payloadUser(user.email, user.name, user.color, false, avatarUrl, user.username),
        });
      });
    }

    // ── Guest ──
    if (pathname === '/api/guest' && req.method === 'POST') {
      return body(async ({ name }) => {
        if (!name || name.trim().length < 2) return json(400, { error: 'Guest name must be at least 2 characters' });
        const cleanName = name.trim().slice(0, 24);
        const color = Math.floor(Math.random() * 8);
        const token = await createSession(`guest_${Date.now()}`, cleanName + ' (Guest)', color, true, null, null);
        const s = await getSession(token);
        json(200, {
          token,
          user: {
            username: s.username,
            name: cleanName + ' (Guest)',
            email: '',
            color,
            isGuest: true,
            avatarUrl: null,
          },
        });
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
      let session = await getSession(token);
      if (!session) return json(401, { error: 'Not authenticated' });
      await hydrateSessionFromUser(token);
      session = await getSession(token);
      return json(200, {
        user: payloadUser(session.email, session.name, session.color, session.isGuest, session.avatarUrl, session.username),
      });
    }

    if (pathname === '/api/users/search' && req.method === 'GET') {
      const token = getToken();
      const session = await getSession(token);
      if (!session) return json(401, { error: 'Not authenticated' });
      const q = (url.searchParams.get('q') || '').slice(0, 32).toLowerCase();
      const list = await searchUsernames(q, 28);
      const me = session.username ? String(session.username).toLowerCase() : '';
      const out = [];
      for (const un of list) {
        if (!un || String(un).startsWith('gst_')) continue;
        if (me && un === me) continue;
        const card = await publicUserCard(un);
        if (card) out.push(card);
      }
      return json(200, { users: out.slice(0, 28) });
    }

    if (pathname === '/api/social' && req.method === 'GET') {
      const token = getToken();
      const session = await getSession(token);
      if (!session) return json(401, { error: 'Not authenticated' });
      await hydrateSessionFromUser(token);
      const s = await getSession(token);
      if (!s.username) return json(400, { error: 'Missing username on session' });
      const env = await buildSocialEnvelope(s.username);
      return json(200, env);
    }

    if (pathname === '/api/friends/request' && req.method === 'POST') {
      return body(async (body_) => {
        const token = getToken();
        let session = await getSession(token);
        if (!session || session.isGuest) return json(403, { error: 'Guests cannot use friends' });
        await hydrateSessionFromUser(token);
        session = await getSession(token);
        const me = session.username;
        const vu = validUsername(body_.username || body_.to);
        if (vu.error) return json(400, { error: vu.error });
        const them = vu.value;
        if (them === me) return json(400, { error: 'Cannot friend yourself' });
        const tgt = await findUserByUsername(them);
        if (!tgt) return json(404, { error: 'User not found' });
        await ensureUserSoc(me);
        await ensureUserSoc(them);
        let sa = await loadSoc(me);
        let sb = await loadSoc(them);
        if (sa.blocked.includes(them) || sb.blocked.includes(me))
          return json(403, { error: 'Cannot send request' });
        if (sa.friends.includes(them)) {
  return json(409, { error: 'Already friends' });
}

// cleanup broken/stale requests first
sa.out = sa.out.filter(x => x.to !== them);
sb.in = sb.in.filter(x => x.from !== me);

// check again after cleanup
if (sa.out.some(x => x.to === them)) {
  return json(409, { error: 'Request already sent' });
}

if (sb.in.some(x => x.from === me)) {
  return json(409, { error: 'Request already pending' });
}

const ts = Date.now();

sa.out.push({
  to: them,
  ts,
});

sb.in.push({
  from: me,
  ts,
});
        await saveSoc(me, sa);
        await saveSoc(them, sb);
        return json(200, { ok: true });
      });
    }

    if (pathname === '/api/friends/accept' && req.method === 'POST') {
      return body(async (body_) => {
        const token = getToken();
        let session = await getSession(token);
        if (!session || session.isGuest) return json(403, { error: 'Guests cannot use friends' });
        await hydrateSessionFromUser(token);
        session = await getSession(token);
        const me = session.username;
        const vu = validUsername(body_.username || body_.from);
        if (vu.error) return json(400, { error: vu.error });
        const them = vu.value;
        await ensureUserSoc(me);
        await ensureUserSoc(them);
        let sa = await loadSoc(me);
        let sb = await loadSoc(them);
        if (!sa.in.some(x => x.from === them)) return json(400, { error: 'No request from this user' });
        // remove the incoming request from receiver
sa.in = sa.in.filter(x => x.from !== them);

// remove sender outgoing request
sb.out = sb.out.filter(x => x.to !== me);
        if (!sa.friends.includes(them)) sa.friends.push(them);
        if (!sb.friends.includes(me)) sb.friends.push(me);
        await saveSoc(me, sa);
        await saveSoc(them, sb);
        return json(200, { ok: true });
      });
    }

    if (pathname === '/api/friends/decline' && req.method === 'POST') {
      return body(async (body_) => {
        const token = getToken();
        let session = await getSession(token);
        if (!session || session.isGuest) return json(403, { error: 'Guests cannot use friends' });
        await hydrateSessionFromUser(token);
        session = await getSession(token);
        const me = session.username;
        const vu = validUsername(body_.username || body_.from);
        if (vu.error) return json(400, { error: vu.error });
        const them = vu.value;
        let sa = await loadSoc(me);
        let sb = await loadSoc(them);
        // remove the incoming request from receiver
sa.in = sa.in.filter(x => x.from !== them);

// remove sender outgoing request
sb.out = sb.out.filter(x => x.to !== me);
        await saveSoc(me, sa);
        await saveSoc(them, sb);
        return json(200, { ok: true });
      });
    }
if (pathname === '/api/friends/cancel' && req.method === 'POST') {
  return body(async (body_) => {
    const token = getToken();
    let session = await getSession(token);

    if (!session || session.isGuest)
      return json(403, { error: 'Guests cannot use friends' });

    await hydrateSessionFromUser(token);
    session = await getSession(token);

    const me = session.username;

    const vu = validUsername(body_.username || body_.to);
    if (vu.error) return json(400, { error: vu.error });

    const them = vu.value;

    await ensureUserSoc(me);
    await ensureUserSoc(them);

    let sa = await loadSoc(me);
    let sb = await loadSoc(them);

    // remove outgoing request from sender
    sa.out = sa.out.filter(x => x.to !== them);

    // remove incoming request from receiver
    sb.in = sb.in.filter(x => x.from !== me);

    await saveSoc(me, sa);
    await saveSoc(them, sb);

    return json(200, { ok: true });
  });
}
    if (pathname === '/api/friends/remove' && req.method === 'POST') {
      return body(async (body_) => {
        const token = getToken();
        let session = await getSession(token);
        if (!session || session.isGuest) return json(403, { error: 'Guests cannot use friends' });
        await hydrateSessionFromUser(token);
        session = await getSession(token);
        const me = session.username;
        const vu = validUsername(body_.username || body_.with);
        if (vu.error) return json(400, { error: vu.error });
        const them = vu.value;
        let sa = await loadSoc(me);
        let sb = await loadSoc(them);
        sa.friends = sa.friends.filter(x => x !== them);
        sb.friends = sb.friends.filter(x => x !== me);
        await saveSoc(me, sa);
        await saveSoc(them, sb);
        try {
          await r.srem('dmclosed:' + me, them);
        } catch (_) {}
        try {
          await r.srem('dmclosed:' + them, me);
        } catch (_) {}
        return json(200, { ok: true });
      });
    }

    if (pathname === '/api/friends/block' && req.method === 'POST') {
      return body(async (body_) => {
        const token = getToken();
        let session = await getSession(token);
        if (!session || session.isGuest) return json(403, { error: 'Guests cannot use friends' });
        await hydrateSessionFromUser(token);
        session = await getSession(token);
        const me = session.username;
        const vu = validUsername(body_.username);
        if (vu.error) return json(400, { error: vu.error });
        const them = vu.value;
        await ensureUserSoc(me);
        await ensureUserSoc(them);
        let sa = await loadSoc(me);
        let sb = await loadSoc(them);
        sa.friends = sa.friends.filter(x => x !== them);
        sb.friends = sb.friends.filter(x => x !== me);
        // remove the incoming request from receiver
sa.in = sa.in.filter(x => x.from !== them);

// remove sender outgoing request
sb.out = sb.out.filter(x => x.to !== me);
        if (!sa.blocked.includes(them)) sa.blocked.push(them);
        await saveSoc(me, sa);
        await saveSoc(them, sb);
        await r.sadd('dmclosed:' + me, them).catch(() => {});
        await r.sadd('dmclosed:' + them, me).catch(() => {});
        return json(200, { ok: true });
      });
    }

    if (pathname === '/api/friends/unblock' && req.method === 'POST') {
      return body(async (body_) => {
        const token = getToken();
        let session = await getSession(token);
        if (!session || session.isGuest) return json(403, { error: 'Guests cannot use friends' });
        await hydrateSessionFromUser(token);
        session = await getSession(token);
        const me = session.username;
        const vu = validUsername(body_.username);
        if (vu.error) return json(400, { error: vu.error });
        const them = vu.value;
        let sa = await loadSoc(me);
        sa.blocked = sa.blocked.filter(x => x !== them);
        await saveSoc(me, sa);
        return json(200, { ok: true });
      });
    }

    if (pathname === '/api/dm/history' && req.method === 'GET') {
      const token = getToken();
      let session = await getSession(token);
      if (!session) return json(401, { error: 'Not authenticated' });
      await hydrateSessionFromUser(token);
      session = await getSession(token);
      const withU = url.searchParams.get('with');
      const vu = validUsername(withU);
      if (vu.error) return json(400, { error: vu.error });
      const a = session.username;
      const b = vu.value;
      const bGuest = [...clients.values()].some(c => c.session.username === b && c.session.isGuest);
      if (!(await canDmPeers(a, b, !!session.isGuest, bGuest))) return json(403, { error: 'Messaging not allowed' });
      const key = dmThreadKey(a, b);
      const rows = await r.lrange(key, 0, 199);
      const msgs = rows.map(raw => JSON.parse(raw)).reverse();
      return json(200, { messages: msgs });
    }

    if (pathname === '/api/dm/close' && req.method === 'POST') {
      return body(async (body_) => {
        const token = getToken();
        let session = await getSession(token);
        if (!session) return json(401, { error: 'Not authenticated' });
        await hydrateSessionFromUser(token);
        session = await getSession(token);
        const me = session.username;
        const vu = validUsername(body_.with || body_.username);
        if (vu.error) return json(400, { error: vu.error });
        await r.sadd('dmclosed:' + me, vu.value);
        return json(200, { ok: true });
      });
    }

    if (pathname === '/api/dm/open' && req.method === 'POST') {
      return body(async (body_) => {
        const token = getToken();
        let session = await getSession(token);
        if (!session) return json(401, { error: 'Not authenticated' });
        await hydrateSessionFromUser(token);
        session = await getSession(token);
        const me = session.username;
        const vu = validUsername(body_.with || body_.username);
        if (vu.error) return json(400, { error: vu.error });
        await r.srem('dmclosed:' + me, vu.value);
        return json(200, { ok: true });
      });
    }

    if (pathname === '/api/profile' && req.method === 'POST') {
      return body(async (body_) => {
        const token = getToken();
        if (!token) return json(401, { error: 'Not authenticated' });
        let session = await getSession(token);
        if (!session) return json(401, { error: 'Not authenticated' });
        if ('avatarUrl' in body_) {
          const sanitized = sanitizeAvatarUrl(body_.avatarUrl);
          if (sanitized && typeof sanitized === 'object' && sanitized.error)
            return json(400, { error: sanitized.error });
          const merged = await mergeSession(token, { avatarUrl: sanitized });
          if (!merged) return json(500, { error: 'Could not update session' });
          session = merged;
          if (!session.isGuest && session.email && typeof session.email === 'string' && !session.email.startsWith('guest_')) {
            const uKey = 'user:' + session.email.toLowerCase();
            const rawU = await r.get(uKey);
            if (rawU) {
              try {
                const u = JSON.parse(rawU);
                u.avatarUrl = session.avatarUrl;
                await r.set(uKey, JSON.stringify(u));
              } catch (_) {}
            }
          }
          broadcastAll({ type: 'online_update', users: getOnlineUsers() });
        }
        json(200, {
          user: payloadUser(session.email, session.name, session.color, session.isGuest, session.avatarUrl, session.username),
        });
      });
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

    // ── Admin: list all users ──
    // GET /api/admin/users?key=<ADMIN_KEY>
    if (pathname === '/api/admin/users' && req.method === 'GET') {
      const key = url.searchParams.get('key') || '';
      if (!checkAdminKey(key)) return json(403, { error: 'Forbidden' });
      const allUsernames = await r.smembers('username_index');
      const users = [];
      const seenEmails = new Set();
      for (const uname of (allUsernames || [])) {
        if (typeof uname !== 'string') continue;
        const email = await r.get('uname:' + uname);
        if (!email) {
          users.push({ username: uname, name: '(orphan)', email: '', created: null, duplicate: true });
          continue;
        }
        const raw = await r.get('user:' + email);
        if (!raw) {
          users.push({ username: uname, name: '(missing user)', email, created: null, duplicate: true });
          continue;
        }
        let u;
        try { u = JSON.parse(raw); } catch { continue; }
        const isDupe = seenEmails.has(u.email);
        seenEmails.add(u.email);
        users.push({
          username: u.username || uname,
          name: u.name || '',
          email: u.email || email,
          avatarUrl: u.avatarUrl || null,
          created: u.created || null,
          duplicate: isDupe,
        });
      }
      return json(200, { users });
    }

    // ── Admin: delete user ──
    // POST /api/admin/delete  { key, username }
    if (pathname === '/api/admin/delete' && req.method === 'POST') {
      return body(async ({ key, username }) => {
        if (!checkAdminKey(key)) return json(403, { error: 'Forbidden' });
        if (!username) return json(400, { error: 'username required' });
        const uname = username.trim().toLowerCase();
        const email = await r.get('uname:' + uname);
        let note = '';
        if (email) {
          await r.del('user:' + email.toLowerCase());
        } else {
          note = 'No email mapping found; cleaned index only.';
        }
        await r.del('uname:' + uname);
        await r.srem('username_index', uname);
        await r.del('soc:' + uname);
        for (const [tok, client] of clients.entries()) {
          if (client.session.username === uname) {
            try { client.ws.socket.destroy(); } catch {}
            clients.delete(tok);
            await r.del('sess:' + tok);
          }
        }
        return json(200, { ok: true, note });
      });
    }

    // ── Admin: fix index issues ──
    // POST /api/admin/fix  { key }
    if (pathname === '/api/admin/fix' && req.method === 'POST') {
      return body(async ({ key }) => {
        if (!checkAdminKey(key)) return json(403, { error: 'Forbidden' });
        const allUsernames = await r.smembers('username_index');
        const fixed = [];
        const removed = [];
        for (const uname of (allUsernames || [])) {
          if (typeof uname !== 'string') continue;
          const email = await r.get('uname:' + uname);
          if (!email) {
            await r.srem('username_index', uname);
            removed.push(uname);
            continue;
          }
          const raw = await r.get('user:' + email);
          if (!raw) {
            await r.del('uname:' + uname);
            await r.srem('username_index', uname);
            removed.push(uname);
            continue;
          }
          let u;
          try { u = JSON.parse(raw); } catch { removed.push(uname); continue; }
          const socKey = 'soc:' + uname;
          if (!(await r.exists(socKey))) {
            await r.set(socKey, JSON.stringify(emptySoc()));
            fixed.push(uname + ':soc_created');
          }
        }
        return json(200, { ok: true, fixed, removed });
      });
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

  await hydrateSessionFromUser(token);
  session = await getSession(token);
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
    user: payloadUser(session.email, session.name, session.color, session.isGuest, session.avatarUrl, session.username),
    onlineUsers: getOnlineUsers()
  }));

  broadcast({ type: 'user_join', user: { username: session.username || '', name: session.name, color: session.color, avatarUrl: session.avatarUrl || null } }, token);
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
        try {
          Promise.resolve(handleMessage(token, JSON.parse(payload.toString('utf8')))).catch(() => {});
        } catch (_) {}
      }
    }
  });

  socket.on('close', () => handleClose(token, session));
  socket.on('error', () => handleClose(token, session));
});

function handleClose(token, session) {
  if (!clients.has(token)) return;
  clients.delete(token);
  broadcast({ type: 'user_leave', user: { username: session.username || '', name: session.name } });
  broadcastAll({ type: 'online_update', users: getOnlineUsers() });
}

async function handleMessage(token, data) {
  const c = clients.get(token);
  if (!c || !c.session) return;
  const session = c.session;
  const { type } = data;

  if (type === 'dm') {
    const text = (data.text || '').trim().slice(0, 2000);
    const msgId = data.id || crypto.randomBytes(8).toString('hex');
    if (!text) return;
    const toU = await resolveRecipientUsername(data);
    if (!toU || toU === session.username) return;
    const recv = [...clients.values()].find(cli => cli.session.username === toU);
    const rGuest = recv ? !!recv.session.isGuest : false;
    if (!(await canDmPeers(session.username, toU, !!session.isGuest, rGuest))) return;

    let toDisplay =
      recv?.session?.name ||
      (await findUserByUsername(toU))?.name ||
      toU;
    const dmRecord = {
      id: msgId,
      sender: session.name,
      senderUsername: session.username,
      toUsername: toU,
      toDisplay,
      to: toDisplay,
      text,
      ts: Date.now(),
      isDM: true,
    };
    await saveDmHistory(session.username, toU, dmRecord);
    const out = JSON.stringify({ type: 'dm', message: dmRecord });
    for (const client of clients.values()) {
      if (
        client.ws.readyState === 1 &&
        (client.session.username === toU || client.session.username === session.username)
      ) {
        wsSend(client.ws, out);
      }
    }
    return;
  }

  if (type === 'dm_typing') {
    const raw = String(data.toUsername || data.to || '').trim().toLowerCase();
    let toUser = [...clients.values()].find(
      cli => String(cli.session.username || '').toLowerCase() === raw
    )?.session.username;
    if (!toUser) return;
    if (toUser === session.username) return;
    const recv = [...clients.values()].find(cli => cli.session.username === toUser);
    const payload = JSON.stringify({ type: 'dm_typing', fromU: session.username, fromDisplay: session.name });
    if (recv && recv.ws.readyState === 1) wsSend(recv.ws, payload);
    return;
  }

  if (type === 'dm_stop_typing') {
    const raw = String(data.toUsername || data.to || '').trim().toLowerCase();
    const toUser = [...clients.values()].find(
      cli => String(cli.session.username || '').toLowerCase() === raw
    )?.session.username;
    if (!toUser) return;
    const recv = [...clients.values()].find(cli => cli.session.username === toUser);
    const payload = JSON.stringify({ type: 'dm_stop_typing', fromU: session.username });
    if (recv && recv.ws.readyState === 1) wsSend(recv.ws, payload);
    return;
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
