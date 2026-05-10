/* ════════════════════════════════════════
   CACACHAT — app.js
   All client-side logic (fully fixed)
════════════════════════════════════════ */

// ─── CONFIG ───
const API = 'https://cacachat-production.up.railway.app';

const AVATARS = [
  '😀','😎','🤩','🥳','😈','👻','🤖','👾','🦊','🐼',
  '🦋','🔥','💎','⚡','🌙','🍕','🎮','🎵','💀','🌈',
  '🦄','🐸','🍄','💩','🐉','👑','🫠','🥸','🤡','🎃',
  '🐨','🦁','🐯','🦊','🐺','🦝','🐙','🦑','🦖','🌊'
];

const AVATAR_COLORS = [
  '#c8854a','#d45a6e','#5cb86a','#4a90e2','#9b59b6','#e67e22',
  '#1abc9c','#e74c3c','#3498db','#f39c12','#2ecc71','#e91e63',
  '#00bcd4','#ff5722','#607d8b','#795548'
];

const THEMES = [
  { id:'default',  name:'Midnight Blue', desc:'Deep navy tones',       dot:'linear-gradient(135deg,#3b7fd4,#5b9cf6)' },
  { id:'midnight', name:'Midnight',       desc:'Deep purple night',   dot:'linear-gradient(135deg,#7c6fff,#a897ff)' },
  { id:'choco',    name:'Milk Choco',     desc:'Rich & warm brown',   dot:'linear-gradient(135deg,#d4893e,#e8a85a)' },
  { id:'matcha',   name:'Matcha',         desc:'Calm forest green',   dot:'linear-gradient(135deg,#5cb86a,#80d490)' },
  { id:'rose',     name:'Rose Gold',      desc:'Warm pink tones',     dot:'linear-gradient(135deg,#d45a6e,#e87a8e)' },
  { id:'cream',    name:'Cream',          desc:'Clean & bright',      dot:'linear-gradient(135deg,#b06030,#d08050)' },
  { id:'sewer',    name:'Sewer Mode',     desc:'Ultra dark & moody',  dot:'linear-gradient(135deg,#a07830,#c09848)' },
];

// Full emoji dataset organized by category
const EMOJI_CATS = [
  { icon: '😀', name: 'Smileys', emojis: ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘','😗','😚','😙','🥲','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🤧','🥵','🥶','🥴','😵','🤯','🤠','🥳','🥸','😎','🤓','🧐','😕','😟','🙁','☹️','😮','😯','😲','😳','🥺','😦','😧','😨','😰','😥','😢','😭','😱','😖','😣','😞','😓','😩','😫','🥱','😤','😡','😠','🤬','😈','👿','💀','☠️','💩','🤡','👻','🤖'] },
  { icon: '👋', name: 'People', emojis: ['👋','🤚','🖐️','✋','🖖','👌','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏','✍️','💅','🤳','💪','🦾','🦵','🦶','👂','🦻','👃','👀','👁️','👅','👄','💋','👤','👥','🫂'] },
  { icon: '🐶', name: 'Animals', emojis: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🙈','🙉','🙊','🐔','🐧','🐦','🐤','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🐛','🦋','🐌','🐞','🐜','🦟','🦗','🕷️','🦂','🐢','🐍','🦎','🦖','🦕','🐙','🦑','🐠','🐟','🐬','🐳','🐋','🦈','🐊','🐅','🐆','🦓','🦍','🐘','🦒','🦘','🐃','🐄','🐎','🦌','🐕','🐈','🐓','🦃','🦚','🦜','🦢','🕊️','🐇','🦝','🦦','🐁','🐀','🐿️','🦔'] },
  { icon: '🍕', name: 'Food', emojis: ['🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑','🥦','🥬','🥒','🌶️','🥕','🧄','🧅','🥔','🍠','🥐','🥯','🍞','🥖','🥨','🧀','🥚','🍳','🥞','🧇','🥓','🥩','🍗','🍖','🌭','🍔','🍟','🍕','🥪','🥙','🧆','🌮','🌯','🥗','🥘','🍝','🍜','🍲','🍛','🍣','🍱','🥟','🍤','🍙','🍚','🍘','🍥','🥮','🧁','🍰','🎂','🍮','🍭','🍬','🍫','🍿','🍩','🍪','🍯','🧃','🥤','🧋','☕','🍵','🍶','🍺','🍻','🥂','🍷','🥃','🍸','🍹','🍾'] },
  { icon: '⚽', name: 'Sports', emojis: ['⚽','🏀','🏈','⚾','🥎','🎾','🏐','🏉','🎱','🏓','🏸','🏒','🥍','🏏','🥅','⛳','🥊','🥋','🎽','🛹','⛸️','🥌','🎿','🏋️','🤸','🏄','🏊','🚴','🏆','🥇','🥈','🥉','🏅','🎖️','🎗️','🎫','🎟️','🎪','🎭','🎨','🎬','🎤','🎧','🎼','🎵','🎶','🎷','🎸','🎹','🎺','🎻','🥁'] },
  { icon: '🚗', name: 'Travel', emojis: ['🚗','🚕','🚙','🚌','🏎️','🚓','🚑','🚒','🚐','🛻','🚚','🚛','🚜','🏍️','🛵','🚲','🛴','⛽','🚧','⚓','⛵','🚤','🛥️','🛳️','🚢','✈️','🛩️','💺','🚁','🚀','🛸','🪐','🌍','🌎','🌏','🌐','🗺️','🧭','🏔️','⛰️','🌋','🏕️','🏖️','🏜️','🏝️','🏟️','🏛️','🏗️','🏘️','🏠','🏡','🏢','🏥','🏦','🏨','🏪','🏫','🏬','🏭','🏯','🏰','💒','🗼','🗽'] },
  { icon: '💡', name: 'Objects', emojis: ['⌚','📱','📲','💻','⌨️','🖥️','🖨️','🖱️','💾','💿','📀','🧮','📷','📸','📹','🎥','📞','☎️','📺','📻','🧭','⏱️','⏲️','⏰','⌛','⏳','📡','🔋','🔌','💡','🔦','🕯️','🛏️','🛋️','🚪','🚽','🚿','🛁','🧴','🧷','🧹','🧺','🧻','🧼','🧯','🛒','🧸','🪆','🖼️','🧵','🧶','👓','🕶️','🥽','🌂','💎','🔮','🧿','🧸'] },
  { icon: '❤️', name: 'Symbols', emojis: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❤️‍🔥','💕','💞','💓','💗','💖','💘','💝','💟','☮️','✝️','☪️','🕉️','☸️','✡️','🔯','🕎','☯️','☦️','⛎','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','🆔','⚛️','🉑','☢️','☣️','❌','⭕','🛑','⛔','📛','🚫','💯','💢','⚠️','✅','❎','🔱','⚜️','♻️','✔️','☑️','🔺','🔻','💠','🔘','🔲'] },
  { icon: '🌟', name: 'Nature', emojis: ['🌸','💐','🌹','🥀','🌺','🌻','🌼','🌷','🌱','🪴','🌲','🌳','🌴','🌵','🎋','🎍','🍀','🍁','🍂','🍃','🍄','🌾','💧','🌊','🌬️','🌀','🌈','⚡','❄️','☃️','⛄','☀️','🌤️','⛅','☁️','🌦️','🌧️','⛈️','🌩️','🌨️','🌪️','🌫️','💨','🌑','🌒','🌓','🌔','🌕','🌙','🌚','🌛','🌜','🌝','🌞','🪐','⭐','🌟','💫','✨','🎇','🎆','🌌','🌁'] },
];

const ALL_EMOJIS = EMOJI_CATS.flatMap(c => c.emojis);

// ─── STATE ───
let token = localStorage.getItem('cacachat_token') || '';
let me = null;
let ws = null, wsReady = false;
let currentRoom = null, currentDM = null;
let typingTimer = null, typingUsers = {}, lastTypingSent = 0;
let dmTypingUsers = {};
let onlineUsers = [];
let renderedMsgIds = new Set();
let reconnectTimer = null, reconnectDelay = 1000;
let dmConvos = {};
let dmUnread = {};
let selectedAvatar = '😀';
let selectedColor = '#c8854a';
let selectedPfpDataUrl = null;
let selectedBannerData = null; // can be a CSS gradient string or a data URL
let myBio = '';
let sidebarView = 'channels';
let currentEpCat = 0;
let userSettings = {
  notifDesktop: true, notifSound: true, notifPreview: true, notifTyping: true,
  privRead: true, privDm: true,
  msgStyle: 'bubbles'
};

// Friends / social state — persisted in localStorage
let friends = [];        // [{name, displayName, color, avatar, pfp}]
let pendingIn = [];      // incoming requests [{from, displayName, color, avatar}]
let pendingOut = [];     // outgoing requests [{to}]
let blocked = [];        // [{name}]

// Servers — persisted in localStorage
let myServers = [];      // [{id, name, code, ownerId, channels:[], members:[]}]
let currentServerId = null;
let currentServerRoom = null;

// Dashboard tab state
let currentDashTab = 'friends';

// ─── AUTH ───
function switchTab(tab) {
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-register').classList.toggle('active', tab === 'register');
  document.getElementById('form-login').style.display   = tab === 'login' ? '' : 'none';
  document.getElementById('form-register').style.display = tab === 'register' ? '' : 'none';
  clearAuthError();
}
function showAuthError(msg) {
  const el = document.getElementById('auth-error');
  el.textContent = msg; el.classList.add('show');
}
function clearAuthError() {
  document.getElementById('auth-error').classList.remove('show');
}

async function doLogin() {
  clearAuthError();
  const email = document.getElementById('l-identifier').value.trim();
  const password = document.getElementById('l-pass').value;
  if (!email || !password) return showAuthError('Please enter your email and password.');
  const res = await apiPost('/api/login', { email, password });
  if (res.error) return showAuthError(res.error);
  token = res.token; me = res.user;
  if (me && me.name) me.name = me.name.toLowerCase();
  localStorage.setItem('cacachat_token', token);
  document.getElementById('auth-screen').style.display = 'none';
  enterApp();
}

async function doRegister() {
  clearAuthError();
  const displayName = document.getElementById('r-displayname').value.trim();
  const rawName = document.getElementById('r-name').value.trim();
  const name = rawName.toLowerCase().replace(/[^a-z0-9_]/g, '');
  const email = document.getElementById('r-email').value.trim();
  const pass  = document.getElementById('r-pass').value;
  if (!displayName) return showAuthError('Display name is required.');
  if (!name) return showAuthError('Username is required.');
  if (!email) return showAuthError('Email is required.');
  if (!pass) return showAuthError('Password is required.');
  if (name.length < 3) return showAuthError('Username must be at least 3 characters.');
  if (pass.length < 6) return showAuthError('Password must be at least 6 characters.');
  // Send all field variants the server might expect
  const body = { name, username: name, displayName, display_name: displayName, email, password: pass };
  const res = await apiPost('/api/register', body);
  if (res.error) return showAuthError(res.error);
  token = res.token; me = res.user;
  if (me && me.name) me.name = me.name.toLowerCase();
  if (!me.displayName) me.displayName = displayName;
  localStorage.setItem('cacachat_token', token);
  document.getElementById('auth-screen').style.display = 'none';
  enterApp();
}

async function doLogout() {
  await apiPost('/api/logout', {});
  // Save DM convos and social data before clearing session
  saveDMConvos();
  saveSocialData();
  saveServers();
  // Clear session-only data
  localStorage.removeItem('cacachat_token');
  token = ''; me = null;
  // Reset in-memory prefs so they don't leak into the next account
  selectedPfpDataUrl = null;
  selectedBannerData = null;
  myBio = '';
  selectedAvatar = AVATARS[0];
  selectedColor = AVATAR_COLORS[0];
  friends = []; pendingIn = []; pendingOut = []; blocked = [];
  dmConvos = {}; dmUnread = {}; myServers = [];
  if (ws) { ws.close(); ws = null; }
  renderedMsgIds.clear();
  closePanel('prof-panel');
  document.getElementById('app').classList.remove('show');
  document.getElementById('auth-screen').style.display = 'flex';
  document.getElementById('l-identifier').value = '';
  document.getElementById('l-pass').value = '';
}

async function tryAutoLogin() {
  if (!token) {
    document.getElementById('auth-screen').style.display = 'flex';
    return;
  }
  const res = await apiFetch('/api/me');
  if (res.error) {
    localStorage.removeItem('cacachat_token');
    token = '';
    document.getElementById('auth-screen').style.display = 'flex';
    return;
  }
  me = res.user;
  if (me && me.name) me.name = me.name.toLowerCase();
  enterApp();
}

// ─── PERSISTENCE — DMs ───
function saveDMConvos() {
  if (!me) return;
  try {
    localStorage.setItem('cc_dms_' + me.name, JSON.stringify(dmConvos));
  } catch (e) {
    // Storage might be full; trim old messages
    const trimmed = {};
    for (const [k, v] of Object.entries(dmConvos)) {
      trimmed[k] = v.slice(-100); // keep last 100 msgs per convo
    }
    try { localStorage.setItem('cc_dms_' + me.name, JSON.stringify(trimmed)); } catch {}
  }
}

function loadDMConvos() {
  if (!me) return;
  const saved = localStorage.getItem('cc_dms_' + me.name);
  if (saved) {
    try { dmConvos = JSON.parse(saved); } catch { dmConvos = {}; }
  }
}

// ─── PERSISTENCE — Social ───
function saveSocialData() {
  if (!me) return;
  // Always save under lowercase key
  const key = 'cc_social_' + me.name; // me.name is always lowercase
  const data = { friends, pendingIn, pendingOut, blocked };
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

function loadSocialData() {
  if (!me) return;
  const key = 'cc_social_' + me.name; // me.name is always lowercase now
  let raw = localStorage.getItem(key);

  // Migration: if no data under the lowercase key, scan all localStorage keys
  // for a case-insensitive match (handles accounts created before the lowercase fix)
  if (!raw) {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.toLowerCase() === key.toLowerCase() && k !== key) {
        raw = localStorage.getItem(k);
        // Migrate to correct lowercase key and remove old one
        if (raw) { try { localStorage.setItem(key, raw); localStorage.removeItem(k); } catch {} }
        break;
      }
    }
  }

  if (raw) {
    try {
      const d = JSON.parse(raw);
      // Normalize all stored usernames to lowercase on load to fix stale mixed-case entries
      friends    = (d.friends    || []).map(f => ({ ...f, name: (f.name || '').toLowerCase() }));
      pendingIn  = (d.pendingIn  || []).map(p => ({ ...p, from: (p.from || '').toLowerCase() }));
      pendingOut = (d.pendingOut || []).map(p => ({ ...p, to:   (p.to   || '').toLowerCase() }));
      blocked    = (d.blocked    || []).map(b => ({ ...b, name: (b.name || '').toLowerCase() }));
    } catch {}
  }
}

// ─── PERSISTENCE — Servers ───
function saveServers() {
  if (!me) return;
  try { localStorage.setItem('cc_servers_' + me.name, JSON.stringify(myServers)); } catch {}
}

function loadServers() {
  if (!me) return;
  const saved = localStorage.getItem('cc_servers_' + me.name);
  if (saved) {
    try { myServers = JSON.parse(saved); } catch { myServers = []; }
  }
}

// ─── PERSISTENCE — Hidden DMs ───
// hiddenDMs stores names of friends whose DM row has been dismissed from the sidebar.
// The chat history is always preserved — hiding only removes the sidebar entry.
let hiddenDMs = new Set();

function saveHiddenDMs() {
  if (!me) return;
  try { localStorage.setItem('cc_hiddendms_' + me.name, JSON.stringify([...hiddenDMs])); } catch {}
}

function loadHiddenDMs() {
  if (!me) return;
  try {
    const saved = localStorage.getItem('cc_hiddendms_' + me.name);
    hiddenDMs = new Set(saved ? JSON.parse(saved) : []);
  } catch { hiddenDMs = new Set(); }
}

function hideDM(name) {
  hiddenDMs.add((name || '').toLowerCase());
  saveHiddenDMs();
  // If we're currently in this DM, go back to dashboard
  if (currentDM === name) {
    currentDM = null;
    document.getElementById('dashboard').style.display = 'flex';
    document.getElementById('chat-panel').style.display = 'none';
  }
  renderDMList();
}

// Opening a DM un-hides it
function unhideDM(name) {
  hiddenDMs.delete((name || '').toLowerCase());
  saveHiddenDMs();
}

// ─── ENTER APP ───
async function enterApp() {
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('app').classList.add('show');
  loadSettings();
  loadTheme();
  loadAvatarPrefs();
  loadDMConvos();
  loadSocialData();
  loadHiddenDMs();
  loadServers();
  setupProfile();
  buildEmojiPicker();
  buildThemeGrid();
  applyMsgStyle(userSettings.msgStyle);
  buildServerRail();
  connectWS();
  goHome();
  // Fetch server-side friends & pending after UI is up — merges with local cache
  await syncFriendsFromServer();
}

// ─── SYNC FROM SERVER (replaces localStorage-only drain) ───
// Fetches the authoritative friend list and pending requests from the server,
// then merges into local state so both devices always stay in sync.
async function syncFriendsFromServer() {
  if (!me || !token) return;

  try {
    const res = await apiFetch('/api/social');
    if (res.error) return;

    // Sync confirmed friends
    if (Array.isArray(res.friends)) {
      res.friends.forEach(f => {
        // Server publicUserCard returns: { username, name (display name), avatarUrl, color }
        const uname = (f.username || '').toLowerCase();
        if (!uname) return; // skip users without a username
        const displayName = f.name || uname; // f.name is the human display name
        const existing = friends.find(x => x.name === uname);
        const pfpUrl = f.avatarUrl || f.pfp || null;
        if (!existing) {
          friends.push({
            name: uname,
            displayName,
            color: f.color || 0,
            avatar: null,
            pfp: pfpUrl,
            banner: null,
            bio: ''
          });
        } else {
          // Always update display name and pfp from server truth
          if (displayName !== uname) existing.displayName = displayName;
          if (pfpUrl) existing.pfp = pfpUrl;
        }
        // Cache pfp
        if (pfpUrl) { try { localStorage.setItem('cc_pfp_' + uname, pfpUrl); } catch {} }
      });
    }

    // Sync incoming requests
    if (Array.isArray(res.pendingIn)) {
      res.pendingIn.forEach(req => {
        // req has: { username, name (display name), avatarUrl, color, ts }
        const from = (req.username || '').toLowerCase();
        if (!from || from === me.name) return;
        if (pendingIn.find(p => p.from === from)) return;
        if (friends.find(f => f.name === from)) return;
        if (blocked.find(b => b.name === from)) return;
        const pfpUrl = req.avatarUrl || req.pfp || null;
        pendingIn.push({
          from,
          displayName: req.name || from,
          avatar: null,
          color: req.color || 0,
          pfp: pfpUrl,
          banner: null,
          bio: ''
        });
        if (pfpUrl) { try { localStorage.setItem('cc_pfp_' + from, pfpUrl); } catch {} }
      });
    }

    // Sync outgoing requests
    if (Array.isArray(res.pendingOut)) {
      res.pendingOut.forEach(req => {
        const to = (req.username || req.to || req.name || '').toLowerCase();
        if (!to) return;
        if (!pendingOut.find(p => p.to === to)) {
          pendingOut.push({ to, sentAt: req.ts || 0 });
        }
      });
    }

    saveSocialData();
    updatePendingBadge();
    renderDMList();
    if (currentDashTab === 'friends') renderFriendsTab();
    else if (currentDashTab === 'pending') renderPendingTab();
  } catch {}
}

function loadAvatarPrefs() {
  const acct = me ? me.name : '';
  selectedAvatar = localStorage.getItem('cc_avatar_' + acct) || localStorage.getItem('cc_avatar') || AVATARS[0];
  selectedColor  = localStorage.getItem('cc_avcolor_' + acct) || localStorage.getItem('cc_avcolor') || AVATAR_COLORS[0];
  // Prefer server-persisted pfp (me.avatarUrl), fallback to localStorage cache
  selectedPfpDataUrl = me?.avatarUrl || localStorage.getItem('cc_pfp_' + acct) || null;
  // Sync localStorage with server truth so future loads are fast
  if (me?.avatarUrl && me.avatarUrl !== localStorage.getItem('cc_pfp_' + acct)) {
    try { localStorage.setItem('cc_pfp_' + acct, me.avatarUrl); } catch {}
  }
  selectedBannerData = localStorage.getItem('cc_banner_' + acct) || null;
  myBio = localStorage.getItem('cc_bio_' + acct) || '';
  // Restore nickname
  const savedNick = localStorage.getItem('cc_nickname_' + acct);
  if (savedNick) me.displayName = savedNick;
  // Store base name for nickname resets
  if (me && !me._baseName) me._baseName = me.displayName || me.name;
}

function loadSettings() {
  const saved = localStorage.getItem('cc_settings');
  if (saved) {
    try { Object.assign(userSettings, JSON.parse(saved)); } catch {}
  }
}

function saveSettings() {
  const prev = { ...userSettings };
  userSettings.notifDesktop = document.getElementById('notif-desktop')?.checked ?? true;
  userSettings.notifSound   = document.getElementById('notif-sound')?.checked ?? true;
  userSettings.notifPreview = document.getElementById('notif-preview')?.checked ?? true;
  userSettings.notifTyping  = document.getElementById('notif-typing')?.checked ?? true;
  userSettings.privRead     = document.getElementById('priv-read')?.checked ?? true;
  userSettings.privDm       = document.getElementById('priv-dm')?.checked ?? true;
  localStorage.setItem('cc_settings', JSON.stringify(userSettings));

  // Real effects for notification settings
  if (userSettings.notifDesktop && !prev.notifDesktop) {
    // Request desktop notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }
  // Typing indicator visibility is handled in renderTyping()
  renderTyping();
}

function populateSettingsToggles() {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.checked = val; };
  set('notif-desktop', userSettings.notifDesktop);
  set('notif-sound', userSettings.notifSound);
  set('notif-preview', userSettings.notifPreview);
  set('notif-typing', userSettings.notifTyping);
  set('priv-read', userSettings.privRead);
  set('priv-dm', userSettings.privDm);
}

function setupProfile() {
  const navAv = document.getElementById('my-av');
  const prAv  = document.getElementById('pr-av');
  const displayName = me.displayName || me.name;
  renderAvatar(navAv, { pfp: selectedPfpDataUrl, emoji: selectedAvatar, color: selectedColor, name: displayName });
  renderAvatar(prAv,  { pfp: selectedPfpDataUrl, emoji: selectedAvatar, color: selectedColor, name: displayName, size: 'xl' });
  document.getElementById('my-name').textContent = displayName;
  document.getElementById('pr-name').textContent = displayName;
  document.getElementById('pr-handle').textContent = '@' + me.name;
  // Apply banner to profile panel banner
  applyBannerToElement(document.getElementById('pr-banner'));
  // Restore saved status — per-account key; default to 'online'
  const savedStatus = (me ? localStorage.getItem('cc_status_' + me.name) : null) || 'online';
  const statusOptEl = document.querySelector(`[data-status="${savedStatus}"]`);
  if (statusOptEl) setMyStatus(savedStatus, statusOptEl);
  else {
    // Default: apply online visuals without status-opt element
    const dotEl = document.getElementById('my-status-dot');
    if (dotEl) { dotEl.className = 'av-dot s-on'; dotEl.style.boxShadow = '0 0 6px #2dd4a0'; }
  }
}

// Generic avatar renderer
function renderAvatar(el, { pfp, emoji, color, name, size }) {
  if (!el) return;
  el.style.background = color || '#888';
  el.innerHTML = '';
  if (pfp) {
    const img = document.createElement('img');
    img.src = pfp; img.alt = name;
    el.appendChild(img);
  } else if (emoji && emoji.length <= 2) {
    el.textContent = emoji;
    el.style.fontSize = size === 'xl' ? '30px' : (size === 'lg' ? '22px' : '14px');
  } else {
    el.textContent = initials(name || '?');
  }
}

// ─── PFP UPLOAD with crop/zoom ───
// We track position in "canvas pixel space" (where image is drawn),
// using offsets (offsetX, offsetY) as the top-left corner of the image on the 260×260 canvas.
let _cropImg = null, _cropScale = 1, _cropOffX = 0, _cropOffY = 0;
let _cropDragging = false, _cropDragStart = null;
const CROP_SIZE = 260;

function handlePfpUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    showToast('#f04455', 'Oops', 'Image must be under 5MB'); return;
  }
  const reader = new FileReader();
  reader.onload = e => openCropModal(e.target.result);
  reader.readAsDataURL(file);
  event.target.value = '';
}

function openCropModal(src) {
  let modal = document.getElementById('pfp-crop-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'pfp-crop-modal';
    modal.className = 'panel';
    modal.innerHTML = `
      <div class="pc" style="width:360px;user-select:none">
        <div class="pc-title"><span>Crop Photo</span><button class="pc-close" onclick="closeCropModal()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
        <div id="crop-viewport" style="width:${CROP_SIZE}px;height:${CROP_SIZE}px;border-radius:50%;overflow:hidden;border:2px solid var(--acc);margin:0 auto 16px;position:relative;background:var(--bg0);cursor:grab;">
          <canvas id="crop-canvas" style="position:absolute;top:0;left:0;touch-action:none;width:${CROP_SIZE}px;height:${CROP_SIZE}px;"></canvas>
        </div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
          <span style="font-size:11px;color:var(--t2);white-space:nowrap">Original</span>
          <input type="range" id="crop-zoom" min="0" max="1" step="0.001" value="0" style="flex:1;accent-color:var(--acc)" oninput="updateCropZoom(this.value)">
          <span style="font-size:11px;color:var(--t2);white-space:nowrap">Zoom in</span>
        </div>
        <p style="font-size:11px;color:var(--t2);text-align:center;margin-bottom:14px">Drag to reposition · Slide to zoom</p>
        <div style="display:flex;gap:8px">
          <button class="logout-btn" onclick="closeCropModal()" style="flex:1">Cancel</button>
          <button class="save-btn" onclick="applyCrop()" style="flex:1">Use This Photo</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    setupCropDrag();
  }
  modal.classList.add('open');
  const img = new Image();
  img.onload = () => {
    _cropImg = img;
    // Start at fill scale (slider = 0, leftmost = zoom out / fit)
    const fillScale = Math.max(CROP_SIZE / img.width, CROP_SIZE / img.height);
    _cropScale = fillScale;
    document.getElementById('crop-zoom').value = 0;
    centerCrop();
    drawCrop();
  };
  img.src = src;
}

function centerCrop() {
  if (!_cropImg) return;
  // At current scale, compute centered position
  const scaledW = _cropImg.width * _cropScale;
  const scaledH = _cropImg.height * _cropScale;
  _cropOffX = (CROP_SIZE - scaledW) / 2;
  _cropOffY = (CROP_SIZE - scaledH) / 2;
}

function closeCropModal() {
  document.getElementById('pfp-crop-modal')?.classList.remove('open');
}

function setupCropDrag() {
  const canvas = document.getElementById('crop-canvas');
  canvas.addEventListener('mousedown', e => {
    _cropDragging = true;
    _cropDragStart = { x: e.clientX - _cropOffX, y: e.clientY - _cropOffY };
    canvas.style.cursor = 'grabbing';
  });
  window.addEventListener('mousemove', e => {
    if (!_cropDragging) return;
    _cropOffX = e.clientX - _cropDragStart.x;
    _cropOffY = e.clientY - _cropDragStart.y;
    clampCrop();
    drawCrop();
  });
  window.addEventListener('mouseup', () => {
    _cropDragging = false;
    const c = document.getElementById('crop-canvas');
    if (c) c.style.cursor = 'grab';
  });
  canvas.addEventListener('touchstart', e => {
    const t = e.touches[0];
    _cropDragging = true;
    _cropDragStart = { x: t.clientX - _cropOffX, y: t.clientY - _cropOffY };
    e.preventDefault();
  }, { passive: false });
  window.addEventListener('touchmove', e => {
    if (!_cropDragging) return;
    const t = e.touches[0];
    _cropOffX = t.clientX - _cropDragStart.x;
    _cropOffY = t.clientY - _cropDragStart.y;
    clampCrop();
    drawCrop();
    e.preventDefault();
  }, { passive: false });
  window.addEventListener('touchend', () => { _cropDragging = false; });
}

function updateCropZoom(val) {
  if (!_cropImg) return;
  const t = parseFloat(val); // 0..1, 0=left=zoom out, 1=right=zoom in
  // fillScale = scale at which image exactly fills the viewport (minimum useful scale)
  const fillScale = Math.max(CROP_SIZE / _cropImg.width, CROP_SIZE / _cropImg.height);
  // At t=0: image fits (fillScale) — leftmost = zoomed out / original fit
  // At t=1: 4× fillScale — rightmost = zoomed in tight
  const newScale = fillScale * (1 + t * 3);
  // Keep center point stable while zooming
  const cx = CROP_SIZE / 2;
  const cy = CROP_SIZE / 2;
  const imgX = (cx - _cropOffX) / _cropScale;
  const imgY = (cy - _cropOffY) / _cropScale;
  _cropScale = newScale;
  _cropOffX = cx - imgX * _cropScale;
  _cropOffY = cy - imgY * _cropScale;
  clampCrop();
  drawCrop();
}

function clampCrop() {
  if (!_cropImg) return;
  const scaledW = _cropImg.width * _cropScale;
  const scaledH = _cropImg.height * _cropScale;
  // If image is smaller than viewport in a dimension, center it; otherwise clamp edges
  if (scaledW >= CROP_SIZE) {
    _cropOffX = Math.min(0, Math.max(CROP_SIZE - scaledW, _cropOffX));
  } else {
    _cropOffX = (CROP_SIZE - scaledW) / 2;
  }
  if (scaledH >= CROP_SIZE) {
    _cropOffY = Math.min(0, Math.max(CROP_SIZE - scaledH, _cropOffY));
  } else {
    _cropOffY = (CROP_SIZE - scaledH) / 2;
  }
}

function drawCrop() {
  if (!_cropImg) return;
  const canvas = document.getElementById('crop-canvas');
  if (!canvas) return;
  canvas.width = CROP_SIZE;
  canvas.height = CROP_SIZE;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, CROP_SIZE, CROP_SIZE);
  ctx.drawImage(_cropImg, _cropOffX, _cropOffY, _cropImg.width * _cropScale, _cropImg.height * _cropScale);
}

function applyCrop() {
  const out = document.createElement('canvas');
  out.width = CROP_SIZE; out.height = CROP_SIZE;
  const ctx = out.getContext('2d');
  ctx.drawImage(_cropImg, _cropOffX, _cropOffY, _cropImg.width * _cropScale, _cropImg.height * _cropScale);
  selectedPfpDataUrl = out.toDataURL('image/jpeg', 0.9);
  const prAv = document.getElementById('pr-av');
  renderAvatar(prAv, { pfp: selectedPfpDataUrl, name: me.displayName || me.name, color: selectedColor, size: 'xl' });
  closeCropModal();
}

// ─── BIO / BANNER ───
function updateBioCount(el) {
  const count = document.getElementById('bio-char-count');
  if (count) count.textContent = el.value.length;
}

function handleBannerUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('#f04455', 'Oops', 'Banner must be under 5MB'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    selectedBannerData = e.target.result;
    updateBannerPreview();
  };
  reader.readAsDataURL(file);
  event.target.value = '';
}

function toggleBannerColors() {
  const sw = document.getElementById('banner-color-swatches');
  if (!sw) return;
  const nowHidden = sw.style.display === 'none';
  sw.style.display = nowHidden ? 'flex' : 'none';
  // If hiding swatches, also hide the custom gradient panel
  if (!nowHidden) {
    const cg = document.getElementById('banner-custom-gradient');
    if (cg) cg.style.display = 'none';
  }
}

function setBannerColor(gradient) {
  selectedBannerData = gradient;
  updateBannerPreview();
  const sw = document.getElementById('banner-color-swatches');
  if (sw) sw.style.display = 'none';
  const cg = document.getElementById('banner-custom-gradient');
  if (cg) cg.style.display = 'none';
}

function toggleCustomGradient() {
  const cg = document.getElementById('banner-custom-gradient');
  if (!cg) return;
  const nowHidden = cg.style.display === 'none';
  cg.style.display = nowHidden ? '' : 'none';
  if (nowHidden) liveCustomGradient(); // sync preview on open
}

// Called on every color input change — updates live previews without applying
function liveCustomGradient() {
  const c1 = document.getElementById('grad-color1')?.value || '#c8854a';
  const c2 = document.getElementById('grad-color2')?.value || '#3b7fd4';
  const grad = `linear-gradient(to right, ${c1}, ${c2})`;

  // Update the visible swatch displays
  const s1 = document.getElementById('grad-swatch1');
  const s2 = document.getElementById('grad-swatch2');
  if (s1) s1.style.background = c1;
  if (s2) s2.style.background = c2;

  // Update both the live preview bar and the middle gradient vis strip
  const preview = document.getElementById('bcg-preview');
  const vis = document.getElementById('bcg-gradient-vis');
  if (preview) preview.style.background = grad;
  if (vis) vis.style.background = grad;
}

// Called when user clicks "Apply to Banner"
function applyCustomGradient() {
  const c1 = document.getElementById('grad-color1')?.value || '#c8854a';
  const c2 = document.getElementById('grad-color2')?.value || '#3b7fd4';
  selectedBannerData = `linear-gradient(to right, ${c1}, ${c2})`;
  updateBannerPreview();
  // Close the custom gradient panel and swatches after applying
  const cg = document.getElementById('banner-custom-gradient');
  if (cg) cg.style.display = 'none';
  const sw = document.getElementById('banner-color-swatches');
  if (sw) sw.style.display = 'none';
  showToast(selectedColor, 'Banner', 'Custom gradient applied!');
}

// Legacy stub — no longer used but kept so old calls don't crash
function setGradDir() {}

function clearBanner() {
  selectedBannerData = null;
  updateBannerPreview();
}

function updateBannerPreview() {
  const box = document.getElementById('banner-preview-box');
  const clearBtn = document.getElementById('banner-clear-btn');
  if (!box) return;
  applyBannerToElement(box);
  if (clearBtn) clearBtn.style.display = selectedBannerData ? '' : 'none';
  // Also update the pr-banner in the panel
  applyBannerToElement(document.getElementById('pr-banner'));
}

function applyBannerToElement(el) {
  if (!el) return;
  if (!selectedBannerData) {
    el.style.background = '';
    el.style.backgroundImage = '';
    el.style.backgroundSize = '';
    el.style.backgroundPosition = '';
    return;
  }
  if (selectedBannerData.startsWith('data:')) {
    el.style.background = '';
    el.style.backgroundImage = `url(${selectedBannerData})`;
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = 'center';
  } else {
    el.style.backgroundImage = '';
    el.style.background = selectedBannerData;
  }
}

function isUserOnline(username) {
  if (!username) return false;
  const lower = username.toLowerCase();
  return onlineUsers.some(u =>
    (u.username && u.username.toLowerCase() === lower) ||
    (u.name && u.name.toLowerCase() === lower)
  );
}

function getOnlineUser(username) {
  if (!username) return null;
  const lower = username.toLowerCase();
  return onlineUsers.find(u =>
    (u.username && u.username.toLowerCase() === lower) ||
    (u.name && u.name.toLowerCase() === lower)
  ) || null;
}

function getPartnerPfp(username) {
  // Check online users first (live data)
  const online = getOnlineUser(username);
  if (online?.avatarUrl) {
    try { localStorage.setItem('cc_pfp_' + username, online.avatarUrl); } catch {}
    return online.avatarUrl;
  }
  // Check friends array
  const friend = friends.find(f => f.name === username);
  if (friend?.pfp) return friend.pfp;
  // Fallback to localStorage cache
  return localStorage.getItem('cc_pfp_' + username) || null;
}

function saveProfile() {
  const acct = me ? me.name : '';
  // Save nickname
  const nicknameInput = document.getElementById('nickname-input');
  if (nicknameInput) {
    const nick = nicknameInput.value.trim();
    if (nick) {
      me.displayName = nick;
      localStorage.setItem('cc_nickname_' + acct, nick);
    } else {
      me.displayName = me._baseName || me.name;
      localStorage.removeItem('cc_nickname_' + acct);
    }
  }
  localStorage.setItem('cc_avatar_' + acct, selectedAvatar);
  localStorage.setItem('cc_avcolor_' + acct, selectedColor);
  if (selectedPfpDataUrl) {
    try { localStorage.setItem('cc_pfp_' + acct, selectedPfpDataUrl); } catch {}
    // Persist pfp to server so it survives logout/login
    apiPost('/api/profile', { avatarUrl: selectedPfpDataUrl }).catch(() => {});
  } else {
    localStorage.removeItem('cc_pfp_' + acct);
    apiPost('/api/profile', { avatarUrl: null }).catch(() => {});
  }
  // Save banner per account
  if (selectedBannerData) {
    try {
      localStorage.setItem('cc_banner_' + acct, selectedBannerData);
    } catch {}
  } else {
    localStorage.removeItem('cc_banner_' + acct);
  }
  // Save bio per account
  const bioInput = document.getElementById('bio-input');
  if (bioInput) {
    myBio = bioInput.value.trim();
    localStorage.setItem('cc_bio_' + acct, myBio);
  }
  // Apply banner to profile panel
  applyBannerToElement(document.getElementById('pr-banner'));
  saveSettings();
  setupProfile();
  document.querySelectorAll('.my-av-el').forEach(el => {
    renderAvatar(el, { pfp: selectedPfpDataUrl, emoji: selectedAvatar, color: selectedColor, name: me.displayName || me.name });
  });
  closePanel('prof-panel');
  showToast(selectedColor, me.displayName || me.name, 'Profile saved ✓');
}

// ─── SETTINGS TABS ───
function switchSettingsTab(tab) {
  document.querySelectorAll('.stab').forEach(b => b.classList.remove('active'));
  document.querySelector(`[data-tab="${tab}"]`)?.classList.add('active');
  ['avatar','status','theme','notif','privacy'].forEach(t => {
    const el = document.getElementById('stab-' + t);
    if (el) el.style.display = t === tab ? '' : 'none';
  });
  if (tab === 'notif' || tab === 'privacy') populateSettingsToggles();
}

function populateProfileTab() {
  // Load nickname
  const nicknameInput = document.getElementById('nickname-input');
  if (nicknameInput) {
    const savedNick = localStorage.getItem('cc_nickname_' + (me ? me.name : ''));
    nicknameInput.value = savedNick || '';
  }
  // Load bio
  const bioInput = document.getElementById('bio-input');
  if (bioInput) {
    bioInput.value = myBio || '';
    updateBioCount(bioInput);
  }
  // Load banner preview
  updateBannerPreview();
}

function setMyStatus(status, el) {
  document.querySelectorAll('.status-opt').forEach(x => x.classList.remove('active'));
  el.classList.add('active');
  const dotEl = document.getElementById('my-status-dot');
  const dot2  = document.getElementById('my-status-dot2');
  const label = document.getElementById('my-status-label');
  const map = {
    online:  { cls: 's-on',   color: 'var(--green)',  txt: 'Online' },
    dnd:     { cls: 's-dnd',  color: 'var(--red)',    txt: 'Do Not Disturb' },
    away:    { cls: 's-away', color: 'var(--yellow)', txt: 'Away' },
    offline: { cls: 's-off',  color: 'var(--t2)',     txt: 'Offline' }
  };
  const cfg = map[status] || map.online;
  if (dotEl) {
    dotEl.className = 'av-dot ' + cfg.cls;
    dotEl.style.cssText = 'position:absolute;bottom:0;right:0;width:9px;height:9px;border-radius:50%;border:2px solid var(--bg1);';
    // Add glow
    const glowMap = { 's-on': '0 0 6px #2dd4a0', 's-dnd': '0 0 6px #f04455', 's-away': '0 0 6px #f5c842', 's-off': 'none' };
    dotEl.style.boxShadow = glowMap[cfg.cls] || 'none';
  }
  if (dot2) { dot2.style.background = cfg.color; dot2.style.boxShadow = cfg.cls !== 's-off' ? `0 0 5px ${cfg.color}` : 'none'; }
  if (label) label.textContent = cfg.txt;
  // Update status label color
  const statusEl = document.querySelector('.sb-me-status');
  if (statusEl) statusEl.style.color = cfg.color;
  if (me) localStorage.setItem('cc_status_' + me.name, status);
}

// ─── THEME ───
function loadTheme() {
  const saved = localStorage.getItem('cc_theme') || 'default';
  applyTheme(saved);
}

function applyTheme(id) {
  if (id === 'default') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', id);
  }
  localStorage.setItem('cc_theme', id);
  document.querySelectorAll('.theme-opt').forEach(el => {
    el.classList.toggle('active', el.dataset.theme === id);
  });
}

function buildThemeGrid() {
  const grid = document.getElementById('theme-grid');
  if (!grid) return;
  grid.innerHTML = '';
  const current = localStorage.getItem('cc_theme') || 'default';
  THEMES.forEach(t => {
    const d = document.createElement('div');
    d.className = 'theme-opt' + (t.id === current ? ' active' : '');
    d.dataset.theme = t.id;
    d.innerHTML = `<div class="theme-dot" style="background:${t.dot}"></div>
      <div><div class="theme-name">${t.name}</div><div class="theme-desc">${t.desc}</div></div>`;
    d.onclick = () => applyTheme(t.id);
    grid.appendChild(d);
  });
}

// ─── MESSAGE STYLE ───
function setMsgStyle(style) {
  userSettings.msgStyle = style;
  document.querySelectorAll('.msg-style-opt').forEach(el => {
    el.classList.toggle('active', el.dataset.style === style);
  });
  applyMsgStyle(style);
  saveSettings();
}

function applyMsgStyle(style) {
  document.body.classList.toggle('style-compact', style === 'compact');
  document.body.classList.toggle('style-bubbles', style === 'bubbles');
}

// ─── WEBSOCKET ───
let connBarTimer = null;
function connectWS() {
  if (ws) { try { ws.close(); } catch {} }
  ws = new WebSocket(`wss://cacachat-production.up.railway.app/?token=${token}`);
  ws.onopen = () => {
    wsReady = true; reconnectDelay = 1000;
    clearTimeout(connBarTimer);
    document.getElementById('conn-bar').classList.remove('show');
  };
  ws.onmessage = e => { try { handleWS(JSON.parse(e.data)); } catch {} };
  ws.onclose = ws.onerror = () => {
    wsReady = false;
    // Only show the bar after 2.5s — avoids flicker on fast reconnects
    clearTimeout(connBarTimer);
    connBarTimer = setTimeout(() => {
      if (!wsReady) document.getElementById('conn-bar').classList.add('show');
    }, 2500);
    clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(() => {
      reconnectDelay = Math.min(reconnectDelay * 1.5, 10000);
      connectWS();
    }, reconnectDelay);
  };
}

function handleWS(data) {
  switch (data.type) {
    case 'welcome':
      onlineUsers = data.onlineUsers || [];
      renderDMList();
      break;
    case 'chat':
      onChatMsg(data.message);
      break;
    case 'dm':
      onDMMsg(data.message);
      saveDMConvos(); // persist on every new DM
      break;
    case 'online_update':
      onlineUsers = data.users || [];
      // Cache profile pictures from live online users
      onlineUsers.forEach(u => {
        if (u.avatarUrl && u.username) {
          try { localStorage.setItem('cc_pfp_' + (u.username || u.name), u.avatarUrl); } catch {}
        }
      });
      renderDMList();
      break;
    case 'user_join':
      showSysMsg(`${data.user.name} joined`);
      break;
    case 'user_leave':
      showSysMsg(`${data.user.name} left`);
      delete typingUsers[data.user.name];
      delete dmTypingUsers[data.user.name];
      renderTyping();
      break;
    case 'typing':
      if (!userSettings.notifTyping) break;
      if (data.room && data.room === currentRoom && data.user !== me.name) {
        typingUsers[data.user] = Date.now(); renderTyping();
      }
      if (data.dm && data.user !== me.name) {
        dmTypingUsers[data.user] = Date.now();
        if (currentDM === data.user) renderTyping();
      }
      break;
    case 'stop_typing':
      delete typingUsers[data.user];
      delete dmTypingUsers[data.user];
      renderTyping();
      break;
    // Friend request — recipient gets this when someone sends them a request
    case 'friend_request':
      // Ignore if: this message is FROM us, or is addressed TO someone else (server broadcast echo)
      if (!data.from) break;
      const _frFrom = (data.from || '').toLowerCase();
      if (_frFrom === me.name) break;
      if (data.to && (data.to || '').toLowerCase() !== me.name) break;
      if (pendingIn.find(p => p.from === _frFrom)) break;
      if (friends.find(f => f.name === _frFrom)) break;
      if (blocked.find(b => b.name === _frFrom)) break;
      {
        const reqColor = typeof data.color === 'number' ? data.color : AVATAR_COLORS.indexOf(data.color) >= 0 ? AVATAR_COLORS.indexOf(data.color) : 0;
        pendingIn.push({
          from: _frFrom,
          displayName: data.displayName || _frFrom,
          avatar: data.avatar || null,
          color: reqColor,
          pfp: data.pfp || null,
          banner: data.banner || null,
          bio: data.bio || ''
        });
        // Cache their profile for the profile viewer
        try {
          if (data.pfp) localStorage.setItem('cc_pfp_' + data.from, data.pfp);
          if (data.banner) localStorage.setItem('cc_banner_' + data.from, data.banner);
          if (data.bio) localStorage.setItem('cc_bio_' + data.from, data.bio);
        } catch {}
        saveSocialData();
        updatePendingBadge();
        renderPendingTab();
        if (currentDashTab !== 'pending') switchDashTab('pending');
        showToast(data.color ? AVATAR_COLORS[reqColor % AVATAR_COLORS.length] : AVATAR_COLORS[0], data.displayName || data.from, 'sent you a friend request!');
      }
      break;
    case 'friend_accepted':
      // Ignore if not addressed to us or if it's our own message echoed back
      if (!data.user) break;
      const _faName = (data.user.name || '').toLowerCase();
      if (_faName === me.name) break;
      if (data.to && (data.to || '').toLowerCase() !== me.name) break;
      {
        const acceptor = { ...data.user, name: _faName };
        // Move from pendingOut → friends
        pendingOut = pendingOut.filter(p => p.to !== acceptor.name);
        if (!friends.find(f => f.name === acceptor.name)) {
          friends.push({
            name: acceptor.name,
            displayName: acceptor.displayName || acceptor.name,
            color: acceptor.color || 0,
            avatar: acceptor.avatar || null,
            pfp: acceptor.pfp || null,
            banner: acceptor.banner || null,
            bio: acceptor.bio || ''
          });
        }
        // Cache their full profile locally
        try {
          if (acceptor.pfp) localStorage.setItem('cc_pfp_' + acceptor.name, acceptor.pfp);
          if (acceptor.banner) localStorage.setItem('cc_banner_' + acceptor.name, acceptor.banner);
          if (acceptor.bio) localStorage.setItem('cc_bio_' + acceptor.name, acceptor.bio);
        } catch {}
        // Un-hide if they were previously hidden
        hiddenDMs.delete(acceptor.name);
        saveHiddenDMs();
        saveSocialData();
        switchDashTab('friends');
        renderDMList();
        const col = AVATAR_COLORS[(acceptor.color || 0) % AVATAR_COLORS.length];
        showToast(col, acceptor.displayName || acceptor.name, 'accepted your friend request! 🎉');
      }
      break;
  }
}

function wsSend(data) { if (ws && wsReady) ws.send(JSON.stringify(data)); }

// ─── HOME / DASHBOARD ───
function goHome() {
  currentRoom = null; currentDM = null;
  currentServerId = null; currentServerRoom = null;

  // Update server rail active state
  document.getElementById('srv-home')?.classList.add('active');
  document.querySelectorAll('.srv-server-icon').forEach(el => el.classList.remove('active'));

  // Show sidebar brand
  document.getElementById('sb-invite-btn').style.display = 'none';
  document.getElementById('sb-brand-label').querySelector('.sb-brand-name').textContent = 'CacaChat';
  document.getElementById('sb-brand-label').querySelector('.sb-brand-tag').textContent = 'Private · Real-time';

  // Show DMs view in sidebar (no channels tab)
  showDMs();

  // Show dashboard, hide chat
  document.getElementById('dashboard').style.display = 'flex';
  document.getElementById('chat-panel').style.display = 'none';

  switchDashTab(currentDashTab || 'friends');
}

// ─── DASHBOARD TABS ───
function switchDashTab(tab) {
  currentDashTab = tab;
  // Update tab buttons
  document.querySelectorAll('.dash-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.dtab === tab);
  });
  // Show/hide content panes
  document.getElementById('dash-friends').style.display = tab === 'friends' ? '' : 'none';
  document.getElementById('dash-pending').style.display = tab === 'pending' ? '' : 'none';
  document.getElementById('dash-blocked').style.display = tab === 'blocked' ? '' : 'none';

  if (tab === 'friends') renderFriendsTab();
  else if (tab === 'pending') renderPendingTab();
  else if (tab === 'blocked') renderBlockedTab();
}

function renderFriendsTab() {
  const grid = document.getElementById('friends-grid');
  if (!grid) return;
  if (friends.length === 0) {
    grid.innerHTML = '<div class="sb-empty" style="padding:40px 0;text-align:center">No friends yet — add someone!</div>';
    return;
  }
  grid.innerHTML = '';
  friends.forEach(f => {
    const online = getOnlineUser(f.name);
    const col = f.color || AVATAR_COLORS[0];
    const row = document.createElement('div');
    row.className = 'friend-row';

    const avEl = document.createElement('div');
    avEl.className = 'av';
    avEl.style.position = 'relative';
    renderAvatar(avEl, { pfp: f.pfp || null, emoji: f.avatar || null, color: col, name: f.displayName || f.name });
    const dot = document.createElement('div');
    dot.className = 'av-dot ' + (online ? 's-on' : 's-off');
    avEl.appendChild(dot);

    row.appendChild(avEl);
    row.innerHTML += `
      <div class="friend-row-info">
        <div class="friend-row-name">${esc(f.displayName || f.name)}</div>
        <div class="friend-row-status">${online ? '🟢 Online' : 'Offline'}</div>
      </div>
      <div class="friend-row-actions">
        <button class="frow-btn msg" onclick="startDMWithFriend('${esc(f.name)}')">Message</button>
        <button class="frow-btn remove" onclick="removeFriend('${esc(f.name)}')">Remove</button>
      </div>`;
    grid.appendChild(row);
  });
}

function renderPendingTab() {
  const list = document.getElementById('pending-list');
  if (!list) return;
  list.innerHTML = '';

  if (pendingIn.length === 0 && pendingOut.length === 0) {
    list.innerHTML = '<div class="sb-empty" style="padding:40px 0;text-align:center">No pending requests.</div>';
    return;
  }

  if (pendingIn.length > 0) {
    const lbl = document.createElement('div');
    lbl.className = 'pending-section-label';
    lbl.textContent = `Incoming — ${pendingIn.length}`;
    list.appendChild(lbl);
    pendingIn.forEach(req => {
      const row = document.createElement('div');
      row.className = 'friend-row';
      row.style.cursor = 'pointer';

      // Avatar — use stored pfp if available, then avatar emoji
      const avEl = document.createElement('div');
      avEl.className = 'av';
      const reqPfp = req.pfp || localStorage.getItem('cc_pfp_' + req.from) || null;
      const reqColor = AVATAR_COLORS[(req.color || 0) % AVATAR_COLORS.length];
      renderAvatar(avEl, { pfp: reqPfp, emoji: req.avatar || null, color: reqColor, name: req.displayName || req.from });

      // Clicking avatar OR row info opens profile popup
      const openProfile = () => showPendingProfile(req);
      avEl.onclick = e => { e.stopPropagation(); openProfile(); };

      row.appendChild(avEl);

      const info = document.createElement('div');
      info.className = 'friend-row-info';
      info.style.cursor = 'pointer';
      info.innerHTML = `
        <div class="friend-row-name">${esc(req.displayName || req.from)}</div>
        <div class="friend-row-status" style="color:var(--acc2)">Wants to be your friend · tap to view profile</div>`;
      info.onclick = openProfile;
      row.appendChild(info);

      const actions = document.createElement('div');
      actions.className = 'friend-row-actions';
      actions.innerHTML = `
        <button class="frow-btn accept" onclick="event.stopPropagation();acceptFriend('${esc(req.from)}')">Accept</button>
        <button class="frow-btn deny" onclick="event.stopPropagation();denyFriend('${esc(req.from)}')">Deny</button>`;
      row.appendChild(actions);

      list.appendChild(row);
    });
  }

  if (pendingOut.length > 0) {
    const lbl = document.createElement('div');
    lbl.className = 'pending-section-label';
    lbl.textContent = `Outgoing — ${pendingOut.length}`;
    list.appendChild(lbl);
    pendingOut.forEach(req => {
      const row = document.createElement('div');
      row.className = 'friend-row';

      const avEl = document.createElement('div');
      avEl.className = 'av';
      // Try to show their pfp if we happen to have it cached
      const outPfp = localStorage.getItem('cc_pfp_' + req.to) || null;
      renderAvatar(avEl, { pfp: outPfp, emoji: null, color: AVATAR_COLORS[5], name: req.to });
      row.appendChild(avEl);

      const info = document.createElement('div');
      info.className = 'friend-row-info';
      info.innerHTML = `
        <div class="friend-row-name">${esc(req.to)}</div>
        <div class="friend-row-status">Request sent — waiting…</div>`;
      row.appendChild(info);

      const actions = document.createElement('div');
      actions.className = 'friend-row-actions';
      actions.innerHTML = `<button class="frow-btn deny" onclick="cancelFriendRequest('${esc(req.to)}')">Cancel</button>`;
      row.appendChild(actions);

      list.appendChild(row);
    });
  }
}

function renderBlockedTab() {
  const list = document.getElementById('blocked-list');
  if (!list) return;
  if (blocked.length === 0) {
    list.innerHTML = '<div class="sb-empty" style="padding:40px 0;text-align:center">No blocked users.</div>';
    return;
  }
  list.innerHTML = '';
  blocked.forEach(u => {
    const row = document.createElement('div');
    row.className = 'friend-row';
    const avEl = document.createElement('div');
    avEl.className = 'av';
    renderAvatar(avEl, { emoji: '🚫', color: '#555', name: u.name });
    row.appendChild(avEl);
    row.innerHTML += `
      <div class="friend-row-info">
        <div class="friend-row-name">${esc(u.name)}</div>
        <div class="friend-row-status">Blocked</div>
      </div>
      <div class="friend-row-actions">
        <button class="frow-btn unblock" onclick="unblockUser('${esc(u.name)}')">Unblock</button>
      </div>`;
    list.appendChild(row);
  });
}

function updatePendingBadge() {
  const badge = document.getElementById('pending-badge');
  if (!badge) return;
  if (pendingIn.length > 0) {
    badge.textContent = pendingIn.length;
    badge.style.display = '';
  } else {
    badge.style.display = 'none';
  }
}

// ─── FRIEND ACTIONS ───

// Shared helper: builds the sender's profile payload for friend requests
function buildFriendPayload() {
  return {
    from: me.name,
    displayName: me.displayName || me.name,
    avatar: selectedAvatar,
    color: AVATAR_COLORS.indexOf(selectedColor),
    pfp: selectedPfpDataUrl || null,
    banner: selectedBannerData || null,
    bio: myBio || '',
    sentAt: Date.now()
  };
}

// Shared helper: finalize and deliver a validated friend request
function deliverFriendRequest(username, requestPayload) {
  // Same-browser offline-queue delivery
  const queueKey = 'cc_friendreq_inbox_' + username;
  try {
    let q = [];
    try { q = JSON.parse(localStorage.getItem(queueKey) || '[]'); } catch {}
    if (!q.find(r => r.from === me.name)) { q.push(requestPayload); localStorage.setItem(queueKey, JSON.stringify(q)); }
  } catch {}

  // Live WS relay — instant delivery if recipient is online right now
  wsSend({ type: 'friend_request', to: username, ...requestPayload });

  // Track as outgoing
  if (!pendingOut.find(p => p.to === username)) pendingOut.push({ to: username, sentAt: Date.now() });
  saveSocialData();
  updatePendingBadge();
}

// Called from the "Add Friend" modal
async function sendFriendRequest() {
  const errEl = document.getElementById('friend-req-error');
  errEl.classList.remove('show');
  const input = document.getElementById('friend-username-input');
  const sendBtn = document.querySelector('#add-friend-panel .auth-btn');
  const username = input.value.trim().replace(/^@/, '').toLowerCase();

  if (!username) { errEl.textContent = 'Enter a username.'; errEl.classList.add('show'); return; }
  if (username === me.name) { errEl.textContent = "You can't add yourself."; errEl.classList.add('show'); return; }
  if (friends.find(f => f.name === username)) { errEl.textContent = 'You are already friends with @' + username + '.'; errEl.classList.add('show'); return; }
  if (pendingOut.find(p => p.to === username)) { errEl.textContent = 'You already sent a request to @' + username + '.'; errEl.classList.add('show'); return; }
  if (blocked.find(b => b.name === username)) { errEl.textContent = 'You have blocked @' + username + '. Unblock them first.'; errEl.classList.add('show'); return; }
  if (pendingIn.find(p => p.from === username)) { errEl.textContent = '@' + username + ' already sent you a request — accept it in Pending!'; errEl.classList.add('show'); return; }

  if (sendBtn) { sendBtn.disabled = true; sendBtn.querySelector('span').textContent = 'Sending…'; }

  const requestPayload = buildFriendPayload();

  // Server stores and delivers the request — this works even if recipient is offline
  let apiRes = null;
  try {
    apiRes = await apiPost('/api/friends/request', { to: username, ...requestPayload });
  } catch {}

  if (sendBtn) { sendBtn.disabled = false; sendBtn.querySelector('span').textContent = 'Send Request'; }

  if (!apiRes || apiRes.error) {
    const msg = (apiRes?.error || '').toLowerCase();
    if (msg.includes('not found') || msg.includes('no user') || msg.includes('exist') || msg.includes('invalid')) {
      errEl.textContent = '@' + username + ' doesn\'t exist. Double-check the username.';
    } else if (msg.includes('already') || msg.includes('duplicate')) {
      errEl.textContent = 'Request already sent to @' + username + '.';
    } else if (!apiRes) {
      errEl.textContent = 'Could not reach the server. Check your connection and try again.';
    } else {
      errEl.textContent = apiRes.error;
    }
    errEl.classList.add('show');
    return;
  }

  // Also relay live via WS if they happen to be online right now (instant toast for them)
  wsSend({ type: 'friend_request', to: username, ...requestPayload });

  // Track outgoing locally
  if (!pendingOut.find(p => p.to === username)) pendingOut.push({ to: username, sentAt: Date.now() });
  saveSocialData();
  updatePendingBadge();

  input.value = '';
  closePanel('add-friend-panel');
  showToast(selectedColor, 'Friend Request', 'Request sent to @' + username + ' ✓');
  switchDashTab('pending');
}

// Called from the user profile viewer — username already known/trusted
async function sendFriendRequestTo(username) {
  if (!username || username === me.name) return;
  if (friends.find(f => f.name === username)) { showToast(selectedColor, 'Already friends', 'You are already friends with @' + username); return; }
  if (pendingOut.find(p => p.to === username)) { showToast(selectedColor, 'Already sent', 'Request already pending for @' + username); return; }

  const requestPayload = buildFriendPayload();

  // API call for server-side delivery
  let apiRes = null;
  try { apiRes = await apiPost('/api/friends/request', { to: username, ...requestPayload }); } catch {}

  if (apiRes && apiRes.error) {
    showToast('#f04455', 'Error', apiRes.error);
    return;
  }

  deliverFriendRequest(username, requestPayload);
  showToast(selectedColor, 'Friend Request', 'Request sent to @' + username + ' ✓');
}

function acceptFriend(fromName) {
  fromName = (fromName || '').toLowerCase();
  const req = pendingIn.find(p => p.from === fromName);
  if (!req) return;
  pendingIn = pendingIn.filter(p => p.from !== fromName);

  if (!friends.find(f => f.name === fromName)) {
    const online = getOnlineUser(fromName);
    friends.push({
      name: fromName,
      displayName: req.displayName || fromName,
      color: req.color !== undefined ? req.color : (online ? (online.color || 0) : 0),
      avatar: req.avatar || online?.avatar || null,
      pfp: req.pfp || null,
      banner: req.banner || null,
      bio: req.bio || ''
    });
  }

  // Cache their profile
  try {
    if (req.pfp) localStorage.setItem('cc_pfp_' + fromName, req.pfp);
    if (req.banner) localStorage.setItem('cc_banner_' + fromName, req.banner);
    if (req.bio) localStorage.setItem('cc_bio_' + fromName, req.bio);
  } catch {}

  const myProfile = {
    name: me.name,
    displayName: me.displayName || me.name,
    color: AVATAR_COLORS.indexOf(selectedColor),
    avatar: selectedAvatar,
    pfp: selectedPfpDataUrl || null,
    banner: selectedBannerData || null,
    bio: myBio || '',
    ts: Date.now()
  };

  // Server stores the acceptance and notifies the other user — works even if they're offline
  apiPost('/api/friends/accept', { from: fromName, ...myProfile }).catch(() => {});

  // Also relay live via WS if sender is online right now
  wsSend({ type: 'friend_accepted', to: fromName, user: myProfile });

  saveSocialData();
  updatePendingBadge();
  renderPendingTab();
  renderDMList();
  if (currentDashTab === 'friends') renderFriendsTab();
  showToast(selectedColor, req.displayName || fromName, 'You are now friends! 🎉');
}

function denyFriend(fromName) {
  fromName = (fromName || '').toLowerCase();
  pendingIn = pendingIn.filter(p => p.from !== fromName);
  saveSocialData();
  updatePendingBadge();
  // Also clear from the offline queue
  try {
    const queueKey = 'cc_friendreq_inbox_' + me.name;
    let q = [];
    try { q = JSON.parse(localStorage.getItem(queueKey) || '[]'); } catch {}
    q = q.filter(r => r.from !== fromName);
    if (q.length) localStorage.setItem(queueKey, JSON.stringify(q));
    else localStorage.removeItem(queueKey);
  } catch {}
  apiPost('/api/friends/deny', { from: fromName }).catch(() => {});
  renderPendingTab();
}

async function cancelFriendRequest(toName) {
  toName = (toName || '').toLowerCase();

  try {
    await apiPost('/api/friends/cancel', { to: toName });

    // remove locally ONLY after server success
    pendingOut = pendingOut.filter(p => p.to !== toName);
    saveSocialData();

    // remove offline queue
    try {
      const queueKey = 'cc_friendreq_inbox_' + toName;

      let q = [];

      try {
        q = JSON.parse(localStorage.getItem(queueKey) || '[]');
      } catch {}

      q = q.filter(r => r.from !== me.name);

      if (q.length)
        localStorage.setItem(queueKey, JSON.stringify(q));
      else
        localStorage.removeItem(queueKey);

    } catch {}

    renderPendingTab();

  } catch (err) {
    console.error('Cancel request failed:', err);
  }
}
function removeFriend(name) {
  name = (name || '').toLowerCase();
  friends = friends.filter(f => f.name !== name);
  // Hide from DM sidebar — history is preserved if they become friends again
  hiddenDMs.add(name);
  saveHiddenDMs();
  saveSocialData();
  apiPost('/api/friends/remove', { name }).catch(() => {});
  if (currentDM === name) {
    currentDM = null;
    document.getElementById('dashboard').style.display = 'flex';
    document.getElementById('chat-panel').style.display = 'none';
  }
  renderFriendsTab();
  renderDMList();
}

function blockUser(name) {
  name = (name || '').toLowerCase();
  friends = friends.filter(f => f.name !== name);
  if (!blocked.find(b => b.name === name)) blocked.push({ name });
  saveSocialData();
  apiPost('/api/friends/block', { name }).catch(() => {});
  renderFriendsTab();
  closePanel('user-profile-panel');
  showToast('#f04455', name, 'User blocked.');
}

function unblockUser(name) {
  name = (name || '').toLowerCase();
  blocked = blocked.filter(b => b.name !== name);
  saveSocialData();
  apiPost('/api/friends/unblock', { name }).catch(() => {});
  renderBlockedTab();
}

function startDMWithFriend(name) {
  const f = friends.find(fr => fr.name === name);
  const onlineUser = getOnlineUser(name);
  const userObj = {
    name,
    color: f?.color || onlineUser?.color || 0,
    avatar: f?.avatar || onlineUser?.avatar || null
  };
  showDMs();
  openDM(userObj);
}

// ─── SIDEBAR VIEWS ───
function showChannels() {
  sidebarView = 'channels';
  document.getElementById('view-channels').style.display = '';
  document.getElementById('view-dms').style.display = 'none';
  document.getElementById('view-server-channels').style.display = 'none';
  // No snt-channels tab anymore, just deactivate dms
  document.getElementById('snt-dms')?.classList.remove('active');
}

function showDMs() {
  sidebarView = 'dms';
  document.getElementById('view-channels').style.display = 'none';
  document.getElementById('view-dms').style.display = '';
  document.getElementById('view-server-channels').style.display = 'none';
  document.getElementById('snt-dms')?.classList.add('active');
  renderDMList();
}

// ─── ROOMS ───
function switchRoom(room) {
  currentRoom = room; currentDM = null;
  document.getElementById('dashboard').style.display = 'none';
  const cp = document.getElementById('chat-panel');
  cp.style.display = 'flex';
  renderedMsgIds.clear();
  typingUsers = {};

  ['general','random','memes'].forEach(r => {
    document.getElementById('room-' + r)?.classList.toggle('active', r === room);
  });
  document.querySelectorAll('.ci').forEach(el => el.classList.remove('active'));

  const chAv = document.getElementById('ch-av');
  chAv.style.background = 'var(--bg5)';
  chAv.innerHTML = '<span style="font-size:14px;font-weight:800;opacity:0.7">#</span>';
  document.getElementById('ch-av-status').style.display = 'none';
  document.getElementById('ch-name').textContent = '#' + room;
  document.getElementById('ch-status').textContent = 'Public Channel';
  document.getElementById('ch-online-dot').style.display = 'none';

  loadHistory(room);
}

// ─── DMs ───
function openDM(user) {
  currentDM = user.name; currentRoom = null;
  // Un-hide when explicitly opened
  unhideDM(user.name);

  document.getElementById('dashboard').style.display = 'none';
  const cp = document.getElementById('chat-panel');
  cp.style.display = 'flex';
  renderedMsgIds.clear();
  typingUsers = {};

  dmUnread[user.name] = 0;
  updateDMBadge();

  const chAv = document.getElementById('ch-av');
  const friend = friends.find(f => f.name === user.name);
  const userPfp = friend?.pfp || getPartnerPfp(user.name);
  const displayName = friend?.displayName || user.name;
  const col = friend?.color
    ? (typeof friend.color === 'string' ? friend.color : AVATAR_COLORS[friend.color % AVATAR_COLORS.length])
    : AVATAR_COLORS[(user.color || 0) % AVATAR_COLORS.length];

  renderAvatar(chAv, {
    pfp: userPfp,
    emoji: friend?.avatar || user.avatar || null,
    color: col,
    name: displayName
  });
  document.getElementById('ch-av-status').style.display = '';
  document.getElementById('ch-name').textContent = displayName;

  // Blocked users always appear offline; messaging disabled
  const isBlocked = !!blocked.find(b => b.name === user.name);
  if (isBlocked) {
    document.getElementById('ch-status').textContent = 'Blocked';
    document.getElementById('ch-online-dot').style.display = 'none';
    const msgInput = document.getElementById('msg-input');
    if (msgInput) { msgInput.disabled = true; msgInput.placeholder = 'You have blocked this user.'; }
    document.querySelector('.send-btn')?.setAttribute('disabled', 'true');
  } else {
    document.getElementById('ch-status').textContent = 'Direct Message';
    document.getElementById('ch-online-dot').style.display = isUserOnline(user.name) ? '' : 'none';
    const msgInput = document.getElementById('msg-input');
    if (msgInput) { msgInput.disabled = false; msgInput.placeholder = 'Send a message…'; }
    document.querySelector('.send-btn')?.removeAttribute('disabled');
  }

  const msgs = document.getElementById('msgs');
  msgs.innerHTML = '<div class="day-div"><span>Messages</span></div>';
  if (dmConvos[user.name]) {
    dmConvos[user.name].forEach(m => appendMsg(m, false));
  }
  msgs.scrollTop = msgs.scrollHeight;

  document.querySelectorAll('.ci').forEach(el => el.classList.remove('active'));
  document.querySelector(`[data-dm="${CSS.escape(user.name)}"]`)?.classList.add('active');

  showDMs();
}

function onDMMsg(msg) {
  const partner = msg.sender === me.name ? (msg.toUsername || msg.to) : msg.sender;
  // Ignore messages from/to blocked users
  if (blocked.find(b => b.name === partner)) return;
  if (!dmConvos[partner]) dmConvos[partner] = [];
  if (dmConvos[partner].find(m => m.id === msg.id)) return;
  dmConvos[partner].push(msg);
  delete dmTypingUsers[partner];

  if (currentDM === partner) {
    appendMsg(msg, true);
    const area = document.getElementById('msgs');
    area.scrollTop = area.scrollHeight;
    renderTyping();
  } else {
    dmUnread[partner] = (dmUnread[partner] || 0) + 1;
    updateDMBadge();
    renderDMList();
    if (msg.sender !== me.name && userSettings.notifSound) playNotifSound();
    if (msg.sender !== me.name) {
      const u = onlineUsers.find(x => x.name === msg.sender) || { color: 0 };
      const preview = userSettings.notifPreview ? msg.text : 'New message';
      showToast(AVATAR_COLORS[u.color % AVATAR_COLORS.length], msg.sender, preview);
    }
  }
  renderDMList();
}

function sendDM(toName, text) {
  // Prevent messaging blocked users
  if (blocked.find(b => b.name === toName)) return;
  const id = Math.random().toString(36).slice(2);
  const msg = { id, sender: me.name, to: toName, text, ts: Date.now(), isDM: true };
  wsSend({ type: 'dm', to: toName, text, id });
  if (!dmConvos[toName]) dmConvos[toName] = [];
  dmConvos[toName].push(msg);
  appendMsg(msg, true);
  saveDMConvos();
}

function updateDMBadge() {
  let total = Object.values(dmUnread).reduce((a,b) => a+b, 0);
  document.getElementById('dm-badge').classList.toggle('show', total > 0);
}

function renderDMList() {
  const list = document.getElementById('dm-list');
  if (!list) return;

  // Build the full set of people to show:
  // - All friends (whether or not messages exist), unless hidden
  // - Anyone we have DM history with but aren't friends with yet (e.g. before friend system)
  // ...excluding anyone in hiddenDMs
  const shown = new Set();
  const entries = []; // { name, friend, lastMsg, unread }

  // Add all friends first (they always appear unless hidden)
  friends.forEach(f => {
    if (hiddenDMs.has(f.name)) return;
    shown.add(f.name);
    const msgs = dmConvos[f.name] || [];
    entries.push({ name: f.name, friend: f, lastMsg: msgs[msgs.length - 1] || null, unread: dmUnread[f.name] || 0 });
  });

  // Also show anyone we have DM history with but who isn't in friends (legacy / non-friend DMs)
  Object.keys(dmConvos).forEach(name => {
    if (shown.has(name) || hiddenDMs.has(name)) return;
    const msgs = dmConvos[name] || [];
    entries.push({ name, friend: null, lastMsg: msgs[msgs.length - 1] || null, unread: dmUnread[name] || 0 });
  });

  if (entries.length === 0) {
    list.innerHTML = '<div class="sb-empty">No DMs yet — add a friend and start chatting!</div>';
    return;
  }

  // Sort: unread first, then by last message time desc, then friends with no messages last
  entries.sort((a, b) => {
    if (b.unread !== a.unread) return b.unread - a.unread;
    const ta = a.lastMsg?.ts || 0;
    const tb = b.lastMsg?.ts || 0;
    return tb - ta;
  });

  list.innerHTML = '';
  entries.forEach(({ name, friend, lastMsg, unread }) => {
    const u = onlineUsers.find(x => x.name === name) || { color: friend?.color || 0, name, avatar: friend?.avatar || null };
    const el = document.createElement('div');
    el.className = 'ci' + (currentDM === name ? ' active' : '');
    el.dataset.dm = name;
    el.style.position = 'relative';

    const col = friend?.color
      ? (typeof friend.color === 'string' ? friend.color : AVATAR_COLORS[friend.color % AVATAR_COLORS.length])
      : AVATAR_COLORS[(u.color || 0) % AVATAR_COLORS.length];

    const pfp = friend?.pfp || getPartnerPfp(name);

    const avDiv = document.createElement('div');
    avDiv.className = 'av';
    avDiv.style.position = 'relative';
    avDiv.style.flexShrink = '0';
    renderAvatar(avDiv, { pfp, emoji: friend?.avatar || u.avatar || null, color: col, name });

    const isOnline = isUserOnline(name);
    const dot = document.createElement('div');
    dot.className = 'av-dot ' + (isOnline ? 's-on' : 's-off');
    avDiv.appendChild(dot);
    avDiv.onclick = e => { e.stopPropagation(); showUserProfile(u); };

    const isDmTyping = dmTypingUsers[name] && (Date.now() - dmTypingUsers[name] < 4000);
    const previewText = isDmTyping
      ? '<em style="color:var(--acc2)">typing…</em>'
      : (lastMsg ? esc(lastMsg.text.slice(0, 32)) : '<em style="color:var(--t2);font-size:10px">No messages yet</em>');

    const displayName = friend?.displayName || name;

    el.appendChild(avDiv);

    const infoEl = document.createElement('div');
    infoEl.className = 'ci-info';
    infoEl.innerHTML = `<div class="ci-name">${esc(displayName)}</div><div class="ci-prev">${previewText}</div>`;
    el.appendChild(infoEl);

    const metaEl = document.createElement('div');
    metaEl.className = 'ci-meta';
    metaEl.style.display = 'flex';
    metaEl.style.flexDirection = 'column';
    metaEl.style.alignItems = 'flex-end';
    metaEl.style.gap = '4px';
    if (unread) {
      const badge = document.createElement('div');
      badge.className = 'unread';
      badge.textContent = unread;
      metaEl.appendChild(badge);
    }
    // Close / hide button — always visible on hover via CSS
    const closeBtn = document.createElement('button');
    closeBtn.className = 'dm-close-btn';
    closeBtn.title = 'Hide conversation';
    closeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    closeBtn.onclick = e => { e.stopPropagation(); hideDM(name); };
    metaEl.appendChild(closeBtn);
    el.appendChild(metaEl);

    el.onclick = () => {
      unhideDM(name);
      openDM({ name, color: u.color || friend?.color || 0, avatar: friend?.avatar || u.avatar || null });
    };

    list.appendChild(el);
  });
}

// ─── MESSAGES ───
async function loadHistory(room) {
  const msgs = document.getElementById('msgs');
  msgs.innerHTML = '<div class="day-div"><span>Today</span></div>';
  const res = await apiFetch(`/api/messages?room=${encodeURIComponent(room)}`);
  if (res.messages) res.messages.forEach(m => appendMsg(m, false));
  msgs.scrollTop = msgs.scrollHeight;
}

function sendMsg() {
  const input = document.getElementById('msg-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = ''; autoResize(input);

  if (currentDM) {
    if (!wsReady) return;
    sendDM(currentDM, text);
  } else if (currentServerRoom) {
    if (!wsReady) return;
    wsSend({ type: 'chat', room: `srv_${currentServerId}_${currentServerRoom}`, text });
  } else if (currentRoom) {
    if (!wsReady) return;
    wsSend({ type: 'chat', room: currentRoom, text });
  }
  stopTyping();
}

function onChatMsg(msg) {
  if (renderedMsgIds.has(msg.id)) return;
  renderedMsgIds.add(msg.id);
  const visible = document.getElementById('chat-panel').style.display !== 'none' &&
    (msg.room === currentRoom || msg.room === `srv_${currentServerId}_${currentServerRoom}`);
  if (visible) {
    appendMsg(msg, true);
    const area = document.getElementById('msgs');
    const nearBottom = area.scrollHeight - area.scrollTop - area.clientHeight < 100;
    if (nearBottom) area.scrollTop = area.scrollHeight;
  }
  if (msg.sender !== me.name && !visible) {
    const u = onlineUsers.find(x => x.name === msg.sender) || { color: 0 };
    if (userSettings.notifSound) playNotifSound();
    showToast(AVATAR_COLORS[u.color % AVATAR_COLORS.length], msg.sender, msg.text);
  }
}

function appendMsg(msg, animate) {
  const area = document.getElementById('msgs');
  const isMine = msg.sender === me.name;
  const u = onlineUsers.find(x => x.name === msg.sender);
  const col = isMine
    ? selectedColor
    : AVATAR_COLORS[(u?.color || msg.senderColor || 0) % AVATAR_COLORS.length];

  const div = document.createElement('div');
  div.className = 'mg ' + (isMine ? 'mine' : 'theirs');
  if (!animate) div.style.animation = 'none';

  const avDiv = document.createElement('div');
  avDiv.className = 'av sm' + (isMine ? ' my-av-el' : '');
  if (isMine) {
    renderAvatar(avDiv, { pfp: selectedPfpDataUrl, emoji: selectedAvatar, color: selectedColor, name: me.displayName || me.name });
  } else {
    const partnerPfp = getPartnerPfp(msg.sender);
    renderAvatar(avDiv, { pfp: partnerPfp, emoji: u?.avatar || null, color: col, name: msg.sender });
  }

  const msgWrap = document.createElement('div');
  if (!isMine) {
    const snEl = document.createElement('div');
    snEl.className = 'sender-name';
    snEl.textContent = msg.sender;
    msgWrap.appendChild(snEl);
  }

  const bubble = document.createElement('div');
  bubble.className = 'mb';
  bubble.textContent = msg.text;

  const meta = document.createElement('div');
  meta.className = 'mm';
  meta.textContent = formatTime(msg.ts);

  msgWrap.appendChild(bubble);
  msgWrap.appendChild(meta);

  const row = document.createElement('div');
  row.className = 'mr';
  row.appendChild(avDiv);
  row.appendChild(msgWrap);
  div.appendChild(row);
  area.appendChild(div);
}

// ─── CONTACTS ───
function filterContacts(q) {
  document.querySelectorAll('.ci, .channel-item').forEach(el => {
    const txt = el.querySelector('.ci-name, .channel-name')?.textContent || el.textContent;
    el.style.display = txt.toLowerCase().includes(q.toLowerCase()) ? '' : 'none';
  });
}

// ─── TYPING ───
function onTyping() {
  const now = Date.now();
  if (now - lastTypingSent > 1500) {
    lastTypingSent = now;
    if (currentRoom) wsSend({ type: 'typing', room: currentRoom });
    if (currentDM) wsSend({ type: 'typing', dm: currentDM });
  }
  clearTimeout(typingTimer);
  typingTimer = setTimeout(stopTyping, 2500);
  renderTyping();
}

function stopTyping() {
  clearTimeout(typingTimer);
  if (currentRoom) wsSend({ type: 'stop_typing', room: currentRoom });
  if (currentDM) wsSend({ type: 'stop_typing', dm: currentDM });
}

function renderTyping() {
  const tw = document.getElementById('typing-wrap');
  if (!userSettings.notifTyping) { tw.style.display = 'none'; return; }

  let active = [];
  if (currentRoom) {
    active = Object.keys(typingUsers).filter(u => Date.now() - typingUsers[u] < 4000);
  } else if (currentDM) {
    if (dmTypingUsers[currentDM] && Date.now() - dmTypingUsers[currentDM] < 4000) {
      active = [currentDM];
    }
  }

  if (!active.length) { tw.style.display = 'none'; return; }

  const u = onlineUsers.find(x => x.name === active[0]) || { color: 0 };
  const avEl = document.getElementById('typing-av');
  renderAvatar(avEl, { emoji: u.avatar || null, color: AVATAR_COLORS[u.color % AVATAR_COLORS.length], name: active[0] });
  document.getElementById('typing-label').textContent =
    active.join(', ') + (active.length === 1 ? ' is typing…' : ' are typing…');
  tw.style.display = '';
}

// ─── SYSTEM MSG ───
function showSysMsg(text) {
  const area = document.getElementById('msgs');
  if (!area) return;
  const el = document.createElement('div');
  el.className = 'sys-msg';
  el.textContent = text;
  area.appendChild(el);
  area.scrollTop = area.scrollHeight;
}

// ─── SERVERS ───
function buildServerRail() {
  const list = document.getElementById('srv-list');
  list.innerHTML = '';
  const divider = document.getElementById('srv-divider2');
  divider.style.display = myServers.length > 0 ? '' : 'none';

  myServers.forEach(srv => {
    const btn = document.createElement('div');
    btn.className = 'srv-server-icon' + (currentServerId === srv.id ? ' active' : '');
    btn.textContent = srv.name.slice(0, 2).toUpperCase();
    btn.title = srv.name;
    btn.onclick = () => selectServer(srv.id);
    list.appendChild(btn);
  });
}

function selectServer(id) {
  const srv = myServers.find(s => s.id === id);
  if (!srv) return;

  currentServerId = id;
  currentRoom = null;
  currentDM = null;

  // Update server rail active states
  document.getElementById('srv-home')?.classList.remove('active');
  document.querySelectorAll('.srv-server-icon').forEach(el => {
    el.classList.toggle('active', el.title === srv.name);
  });

  // Update sidebar brand to show server name
  document.getElementById('sb-brand-label').querySelector('.sb-brand-name').textContent = srv.name;
  document.getElementById('sb-brand-label').querySelector('.sb-brand-tag').textContent = 'Server · ' + (srv.members?.length || 1) + ' members';
  document.getElementById('sb-invite-btn').style.display = '';

  // Show server channels view
  document.getElementById('view-channels').style.display = 'none';
  document.getElementById('view-dms').style.display = 'none';
  document.getElementById('view-server-channels').style.display = '';
  document.getElementById('sv-channels-label').textContent = srv.name + ' — Channels';

  // Render server channels
  const chList = document.getElementById('sv-channels-list');
  chList.innerHTML = '';
  (srv.channels || ['general']).forEach(ch => {
    const el = document.createElement('div');
    el.className = 'channel-item';
    el.innerHTML = `<span class="channel-hash">#</span><span class="channel-name">${esc(ch)}</span>`;
    el.onclick = () => switchServerRoom(id, ch, el);
    chList.appendChild(el);
  });

  // Render members
  const memList = document.getElementById('sv-members-list');
  memList.innerHTML = '';
  (srv.members || [me.name]).forEach(mem => {
    const u = getOnlineUser(mem) || { name: mem, color: 0 };
    const acctPfp = localStorage.getItem('cc_pfp_' + mem) || null;
    const col = AVATAR_COLORS[(u.color || 0) % AVATAR_COLORS.length];
    const el = document.createElement('div');
    el.className = 'oi';
    el.style.cursor = 'pointer';

    const avWrap = document.createElement('div');
    avWrap.className = 'oi-av-wrap';

    const avEl = document.createElement('div');
    avEl.className = 'av sm';
    renderAvatar(avEl, { pfp: acctPfp, emoji: u.avatar || null, color: col, name: mem });

    const isOnline = isUserOnline(mem);
    const dot = document.createElement('div');
    dot.className = 'oi-dot';
    dot.style.background = isOnline ? 'var(--green)' : 'var(--t2)';

    avWrap.appendChild(avEl);
    avWrap.appendChild(dot);
    el.appendChild(avWrap);

    const nameEl = document.createElement('span');
    nameEl.className = 'oi-name';
    nameEl.textContent = mem + (mem === me.name ? ' (you)' : '');
    el.appendChild(nameEl);

    if (mem !== me.name) {
      el.onclick = () => showUserProfile(u);
    }
    memList.appendChild(el);
  });

  // Show dashboard still, or auto-join first channel
  if (srv.channels && srv.channels.length > 0) {
    switchServerRoom(id, srv.channels[0], chList.querySelector('.channel-item'));
  } else {
    document.getElementById('dashboard').style.display = 'flex';
    document.getElementById('chat-panel').style.display = 'none';
  }
}

function switchServerRoom(serverId, room, clickedEl) {
  currentServerRoom = room;
  currentRoom = null;
  currentDM = null;

  document.querySelectorAll('#sv-channels-list .channel-item').forEach(el => el.classList.remove('active'));
  if (clickedEl) clickedEl.classList.add('active');

  document.getElementById('dashboard').style.display = 'none';
  const cp = document.getElementById('chat-panel');
  cp.style.display = 'flex';
  renderedMsgIds.clear();
  typingUsers = {};

  const chAv = document.getElementById('ch-av');
  chAv.style.background = 'var(--bg5)';
  chAv.innerHTML = '<span style="font-size:14px;font-weight:800;opacity:0.7">#</span>';
  document.getElementById('ch-av-status').style.display = 'none';
  document.getElementById('ch-name').textContent = '#' + room;
  document.getElementById('ch-status').textContent = myServers.find(s => s.id === serverId)?.name || 'Server';
  document.getElementById('ch-online-dot').style.display = 'none';

  const msgs = document.getElementById('msgs');
  msgs.innerHTML = '<div class="day-div"><span>Today</span></div>';
  msgs.scrollTop = msgs.scrollHeight;

  loadHistory(`srv_${serverId}_${room}`);
}

async function createServer() {
  const errEl = document.getElementById('sv-create-error');
  errEl.classList.remove('show');
  const name = document.getElementById('sv-name-input').value.trim();
  if (!name) { errEl.textContent = 'Server name is required.'; errEl.classList.add('show'); return; }

  let srv;
  // Try API
  try {
    const res = await apiPost('/api/servers/create', { name });
    if (res.server) {
      srv = res.server;
    }
  } catch {}

  // Fall back to local creation
  if (!srv) {
    const id = 'srv_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
    const code = Math.random().toString(36).slice(2, 10).toUpperCase();
    srv = { id, name, code, ownerId: me.name, channels: ['general', 'random'], members: [me.name] };
  }

  myServers.push(srv);
  saveServers();
  document.getElementById('sv-name-input').value = '';
  closePanel('create-server-panel');
  buildServerRail();
  selectServer(srv.id);
  showToast(selectedColor, name, 'Server created! 🎉');
}

async function joinServerByCode() {
  const errEl = document.getElementById('sv-join-error');
  errEl.classList.remove('show');
  const code = document.getElementById('sv-invite-input').value.trim().toUpperCase();
  if (!code) { errEl.textContent = 'Enter an invite code.'; errEl.classList.add('show'); return; }

  let srv;
  try {
    const res = await apiPost('/api/servers/join', { code });
    if (res.server) srv = res.server;
    else if (res.error) { errEl.textContent = res.error; errEl.classList.add('show'); return; }
  } catch {}

  if (!srv) {
    // Look locally (in case someone shared a code from a server in same browser)
    srv = myServers.find(s => s.code === code);
    if (!srv) {
      errEl.textContent = 'Invalid invite code or server not found.';
      errEl.classList.add('show');
      return;
    }
  }

  if (!myServers.find(s => s.id === srv.id)) {
    if (!srv.members) srv.members = [];
    if (!srv.members.includes(me.name)) srv.members.push(me.name);
    myServers.push(srv);
    saveServers();
  }

  document.getElementById('sv-invite-input').value = '';
  closePanel('join-server-panel');
  buildServerRail();
  selectServer(srv.id);
  showToast(selectedColor, srv.name, 'Joined server!');
}

// Server invite panel
let inviteDuration = 0;
function openServerInvite() {
  const srv = myServers.find(s => s.id === currentServerId);
  if (!srv) return;
  const link = window.location.origin + '?join=' + srv.code;
  document.getElementById('invite-link-text').textContent = link;
  openPanel('server-invite-panel');
}

function setInviteDur(mins, el) {
  inviteDuration = mins;
  document.querySelectorAll('.sdur-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

function copyInviteLink() {
  const text = document.getElementById('invite-link-text').textContent;
  navigator.clipboard.writeText(text).then(() => showToast(selectedColor, 'Copied!', 'Invite link copied to clipboard.'));
}

function regenerateInvite() {
  const srv = myServers.find(s => s.id === currentServerId);
  if (!srv) return;
  srv.code = Math.random().toString(36).slice(2, 10).toUpperCase();
  saveServers();
  const link = window.location.origin + '?join=' + srv.code;
  document.getElementById('invite-link-text').textContent = link;
  showToast(selectedColor, 'New link', 'Invite link regenerated.');
}

// ─── PENDING REQUEST PROFILE VIEWER ───
// Shows a full profile popup for an incoming friend request
function showPendingProfile(req) {
  const col = AVATAR_COLORS[(req.color || 0) % AVATAR_COLORS.length];
  const reqPfp = req.pfp || localStorage.getItem('cc_pfp_' + req.from) || null;
  const reqBanner = req.banner || localStorage.getItem('cc_banner_' + req.from) || null;
  const reqBio = req.bio || localStorage.getItem('cc_bio_' + req.from) || '';

  // Reuse the user-profile-panel but populate with pending-specific data
  const avEl = document.getElementById('uv-av');
  renderAvatar(avEl, { pfp: reqPfp, emoji: req.avatar || null, color: col, name: req.displayName || req.from });

  document.getElementById('uv-name').textContent = req.displayName || req.from;
  document.getElementById('uv-handle').textContent = '@' + req.from;
  // Status: always show as "Pending" since they haven't accepted yet
  const statusBadge = document.getElementById('uv-status-badge');
  statusBadge.innerHTML = '⏳ Pending Request';
  statusBadge.style.color = 'var(--yellow)';
  const onlineRing = document.getElementById('uv-online-ring');
  if (onlineRing) onlineRing.className = 'uv-online-ring away';

  // Banner
  const uvBanner = document.getElementById('uv-banner');
  if (uvBanner) {
    if (reqBanner) {
      if (reqBanner.startsWith('data:')) {
        uvBanner.style.background = '';
        uvBanner.style.backgroundImage = `url(${reqBanner})`;
        uvBanner.style.backgroundSize = 'cover';
        uvBanner.style.backgroundPosition = 'center';
      } else {
        uvBanner.style.backgroundImage = '';
        uvBanner.style.background = reqBanner;
      }
    } else {
      uvBanner.style.backgroundImage = '';
      uvBanner.style.background = 'linear-gradient(135deg, var(--bg4), var(--bg5))';
    }
  }

  // Bio
  const uvBio = document.getElementById('uv-bio');
  if (uvBio) {
    if (reqBio) {
      uvBio.textContent = reqBio;
      uvBio.style.display = '';
    } else {
      uvBio.style.display = 'none';
    }
  }

  // Actions: Accept / Deny
  const actions = document.getElementById('uv-actions');
  actions.innerHTML = '';

  const acceptBtn = document.createElement('button');
  acceptBtn.className = 'uv-btn primary';
  acceptBtn.textContent = '✓ Accept Request';
  acceptBtn.onclick = () => {
    acceptFriend(req.from);
    closePanel('user-profile-panel');
  };
  actions.appendChild(acceptBtn);

  const denyBtn = document.createElement('button');
  denyBtn.className = 'uv-btn danger';
  denyBtn.textContent = '✕ Deny';
  denyBtn.onclick = () => {
    denyFriend(req.from);
    closePanel('user-profile-panel');
  };
  actions.appendChild(denyBtn);

  openPanel('user-profile-panel');
}

// ─── USER PROFILE VIEWER ───
function onClickChatHeader() {
  if (!currentDM) return;
  const u = onlineUsers.find(x => x.name === currentDM) || { name: currentDM, color: 0 };
  showUserProfile(u);
}

function showUserProfile(u) {
  const isOnline = isUserOnline(u.name);
  const friendData = friends.find(f => f.name === u.name) || {};
  const col = AVATAR_COLORS[(u.color || friendData.color || 0) % AVATAR_COLORS.length];
  const avEl = document.getElementById('uv-av');
  const partnerPfp = friendData.pfp || getPartnerPfp(u.name);
  const displayName = u.displayName || friendData.displayName || u.name;
  renderAvatar(avEl, { pfp: partnerPfp, emoji: u.avatar || friendData.avatar || null, color: col, name: displayName });
  document.getElementById('uv-name').textContent = displayName;
  document.getElementById('uv-handle').textContent = '@' + u.name;

  // Show nickname if different from username
  const uvNickname = document.getElementById('uv-nickname');
  if (uvNickname) {
    const nick = localStorage.getItem('cc_nickname_' + u.name) || '';
    if (nick && nick !== u.name) {
      uvNickname.textContent = '✦ ' + nick;
      uvNickname.style.display = '';
    } else {
      uvNickname.style.display = 'none';
    }
  }

  // Member since (if available)
  const uvJoined = document.getElementById('uv-joined');
  if (uvJoined) uvJoined.style.display = 'none';

  // Status badge + online ring
  const statusBadge = document.getElementById('uv-status-badge');
  const onlineRing = document.getElementById('uv-online-ring');
  if (isOnline) {
    statusBadge.innerHTML = '<span class="uv-status-dot online"></span> Online';
    statusBadge.style.color = 'var(--green)';
    if (onlineRing) { onlineRing.className = 'uv-online-ring online'; }
  } else {
    statusBadge.innerHTML = '<span class="uv-status-dot offline"></span> Offline';
    statusBadge.style.color = 'var(--t2)';
    if (onlineRing) { onlineRing.className = 'uv-online-ring'; }
  }

  // Bio — prefer friends array, then localStorage
  const uvBio = document.getElementById('uv-bio');
  const partnerBio = friendData.bio || localStorage.getItem('cc_bio_' + u.name) || '';
  if (uvBio) {
    if (partnerBio) { uvBio.textContent = partnerBio; uvBio.style.display = ''; }
    else uvBio.style.display = 'none';
  }

  // Banner — prefer friends array, then localStorage
  const uvBanner = document.getElementById('uv-banner');
  const partnerBanner = friendData.banner || localStorage.getItem('cc_banner_' + u.name) || null;
  if (uvBanner) {
    if (partnerBanner) {
      if (partnerBanner.startsWith('data:')) {
        uvBanner.style.backgroundImage = `url(${partnerBanner})`;
        uvBanner.style.backgroundSize = 'cover';
        uvBanner.style.backgroundPosition = 'center';
        uvBanner.style.background = '';
      } else {
        uvBanner.style.backgroundImage = '';
        uvBanner.style.background = partnerBanner;
      }
    } else {
      uvBanner.style.background = 'linear-gradient(135deg, var(--bg4), var(--bg5))';
      uvBanner.style.backgroundImage = '';
    }
  }

  const actions = document.getElementById('uv-actions');
  const isFriend = !!friends.find(f => f.name === u.name);
  const isPendingOut = !!pendingOut.find(p => p.to === u.name);
  const isBlocked = !!blocked.find(b => b.name === u.name);

  actions.innerHTML = '';
  if (u.name !== me.name) {
    if (!isBlocked) {
      const msgBtn = document.createElement('button');
      msgBtn.className = 'uv-btn primary';
      msgBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;margin-right:5px"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>Message';
      msgBtn.onclick = () => { closePanel('user-profile-panel'); openDM(u); };
      actions.appendChild(msgBtn);
    }

    if (!isFriend && !isBlocked) {
      const addBtn = document.createElement('button');
      addBtn.className = 'uv-btn secondary';
      addBtn.textContent = isPendingOut ? '⏳ Pending…' : '+ Add Friend';
      if (!isPendingOut) addBtn.onclick = () => {
        sendFriendRequestTo(u.name);
        addBtn.textContent = '⏳ Pending…';
        addBtn.onclick = null;
      };
      actions.appendChild(addBtn);
    }

    if (isFriend) {
      const removeBtn = document.createElement('button');
      removeBtn.className = 'uv-btn secondary';
      removeBtn.textContent = 'Remove Friend';
      removeBtn.onclick = () => { removeFriend(u.name); closePanel('user-profile-panel'); };
      actions.appendChild(removeBtn);
    }

    if (!isBlocked) {
      const blockBtn = document.createElement('button');
      blockBtn.className = 'uv-btn danger';
      blockBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;margin-right:5px"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>Block';
      blockBtn.onclick = () => blockUser(u.name);
      actions.appendChild(blockBtn);
    } else {
      const unblockBtn = document.createElement('button');
      unblockBtn.className = 'uv-btn secondary';
      unblockBtn.textContent = 'Unblock';
      unblockBtn.onclick = () => { unblockUser(u.name); closePanel('user-profile-panel'); };
      actions.appendChild(unblockBtn);
    }
  }

  openPanel('user-profile-panel');
}

// ─── EMOJI PICKER ───
function buildEmojiPicker() {
  const catBar = document.getElementById('ep-cats');
  catBar.innerHTML = '';
  EMOJI_CATS.forEach((cat, i) => {
    const btn = document.createElement('div');
    btn.className = 'ep-cat' + (i === 0 ? ' active' : '');
    btn.textContent = cat.icon;
    btn.title = cat.name;
    btn.onclick = () => switchEpCat(i, btn);
    catBar.appendChild(btn);
  });
  renderEpGrid(EMOJI_CATS[0].emojis);
}

function switchEpCat(idx, btn) {
  currentEpCat = idx;
  document.querySelectorAll('.ep-cat').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('ep-search').value = '';
  renderEpGrid(EMOJI_CATS[idx].emojis);
}

function renderEpGrid(emojis) {
  const grid = document.getElementById('ep-grid');
  grid.innerHTML = '';
  emojis.forEach(em => {
    const div = document.createElement('div');
    div.className = 'ep-em';
    div.textContent = em;
    div.onclick = () => { insertEmoji(em); toggleEP(); };
    grid.appendChild(div);
  });
}

function searchEmoji(q) {
  if (!q.trim()) {
    renderEpGrid(EMOJI_CATS[currentEpCat].emojis); return;
  }
  renderEpGrid(ALL_EMOJIS.slice(0, 200));
}

function toggleEP() {
  document.getElementById('emoji-picker').classList.toggle('open');
}

function insertEmoji(em) {
  const i = document.getElementById('msg-input');
  const s = i.selectionStart, e = i.selectionEnd;
  i.value = i.value.slice(0, s) + em + i.value.slice(e);
  i.selectionStart = i.selectionEnd = s + em.length;
  i.focus(); autoResize(i);
}

document.addEventListener('click', e => {
  const picker = document.getElementById('emoji-picker');
  if (!picker?.contains(e.target) && !e.target.closest('.emoji-btn-main')) {
    picker?.classList.remove('open');
  }
});

// ─── TOAST ───
function showToast(color, name, text) {
  const c = document.getElementById('toasts');
  const t = document.createElement('div');
  t.className = 'toast';

  const avEl = document.createElement('div');
  avEl.className = 'av sm';
  renderAvatar(avEl, { color, name });

  const info = document.createElement('div');
  info.className = 'toast-info';
  info.innerHTML = `<div class="toast-name">${esc(name)}</div><div class="toast-msg">${esc(text)}</div>`;

  t.appendChild(avEl);
  t.appendChild(info);
  t.onclick = () => t.remove();
  c.appendChild(t);
  setTimeout(() => {
    t.style.transition = 'opacity .3s';
    t.style.opacity = '0';
    setTimeout(() => t.remove(), 300);
  }, 4200);
}

// ─── SOUND ───
function playNotifSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine'; osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.start(); osc.stop(ctx.currentTime + 0.2);
  } catch {}
}

// ─── PANELS ───
function openPanel(id) {
  document.getElementById(id).classList.add('open');
  if (id === 'prof-panel') {
    buildThemeGrid();
    populateSettingsToggles();
    populateProfileTab();
    switchSettingsTab('avatar');
  }
}
function closePanel(id) { document.getElementById(id).classList.remove('open'); }
function closePanelIf(e, id) { if (e.target.id === id) closePanel(id); }
function mobileBack() {
  document.getElementById('sidebar').classList.remove('mob-open');
  document.getElementById('dashboard').style.display = 'flex';
  document.getElementById('chat-panel').style.display = 'none';
}

function mobileSidebarOpen() {
  document.getElementById('sidebar').classList.add('mob-open');
}

// Toggle password visibility
function togglePwVis(inputId, btn) {
  const input = document.getElementById(inputId);
  const isText = input.type === 'text';
  input.type = isText ? 'password' : 'text';
  // Use class toggle instead of inline style to avoid CSP blocks on hosted environments
  const eyeOff = btn.querySelector('.eye-off');
  const eyeOn  = btn.querySelector('.eye-on');
  if (eyeOff) eyeOff.classList.toggle('eye-hidden', !isText);
  if (eyeOn)  eyeOn.classList.toggle('eye-hidden',  isText);
}

// ─── UTILS ───
function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); }
}
function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 130) + 'px';
}
function initials(name) {
  return (name || '?').split(' ').map(w => w[0] || '').join('').toUpperCase().slice(0, 2);
}
function esc(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function apiFetch(url) {
  try {
    const r = await fetch(API + url, { headers: { Authorization: 'Bearer ' + token } });
    return await r.json();
  } catch { return { error: 'Network error' }; }
}
async function apiPost(url, body) {
  try {
    const r = await fetch(API + url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify(body)
    });
    return await r.json();
  } catch { return { error: 'Network error' }; }
}

// ─── KEYBOARD SHORTCUTS ───
window.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('form-login')?.style.display !== 'none') {
    if (document.activeElement.id === 'l-pass') doLogin();
    if (document.activeElement.id === 'l-identifier') document.getElementById('l-pass')?.focus();
  }
  if (e.key === 'Enter' && document.getElementById('form-register')?.style.display !== 'none') {
    if (document.activeElement.id === 'r-pass') doRegister();
  }
  if (e.key === 'Escape') {
    ['prof-panel','user-profile-panel','add-friend-panel','create-server-panel','join-server-panel','server-invite-panel'].forEach(closePanel);
    document.getElementById('emoji-picker')?.classList.remove('open');
  }
});

// ─── AUTO-SAVE ───
// Save DMs and social data periodically
setInterval(() => {
  if (me) {
    saveDMConvos();
    saveSocialData();
  }
}, 30000);

// Save before tab closes — and signal offline to other users
window.addEventListener('beforeunload', () => {
  if (me) {
    saveDMConvos();
    saveSocialData();
    saveServers();
    // Tell the server we're going offline so others see us as offline immediately
    // sendBeacon is used so it fires even as the page unloads
    if (token) {
      try {
        navigator.sendBeacon(
          'https://cacachat-production.up.railway.app/api/offline',
          new Blob([JSON.stringify({ token })], { type: 'application/json' })
        );
      } catch {}
    }
  }
});

// ─── STALE TYPING CLEANUP ───
setInterval(() => {
  const cutoff = Date.now() - 4000;
  let changed = false;
  for (const [u, ts] of Object.entries(typingUsers)) {
    if (ts < cutoff) { delete typingUsers[u]; changed = true; }
  }
  for (const [u, ts] of Object.entries(dmTypingUsers)) {
    if (ts < cutoff) { delete dmTypingUsers[u]; changed = true; }
  }
  if (changed) { renderTyping(); renderDMList(); }
}, 2000);

// ─── BOOT ───
tryAutoLogin();
