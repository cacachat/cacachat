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
  const identifier = document.getElementById('l-identifier').value.trim();
  const password = document.getElementById('l-pass').value;
  if (!identifier || !password) return showAuthError('Please enter your email/username and password.');
  // Detect email vs username: email contains @ followed by a domain with a dot
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
  const cleanIdentifier = identifier.startsWith('@') ? identifier.slice(1) : identifier;
  const body = isEmail
    ? { email: cleanIdentifier, password }
    : { name: cleanIdentifier, password };
  const res = await apiPost('/api/login', body);
  if (res.error) return showAuthError(res.error);
  token = res.token; me = res.user;
  localStorage.setItem('cacachat_token', token);
  enterApp();
}

async function doRegister() {
  clearAuthError();
  const displayName = document.getElementById('r-displayname').value.trim();
  const name  = document.getElementById('r-name').value.trim();
  const email = document.getElementById('r-email').value.trim();
  const pass  = document.getElementById('r-pass').value.trim();
  if (!displayName) return showAuthError('Display name is required.');
  if (!name) return showAuthError('Username is required.');
  if (!email) return showAuthError('Email is required.');
  if (!pass) return showAuthError('Password is required.');
  if (name.length < 3) return showAuthError('Username must be at least 3 characters.');
  if (pass.length < 6) return showAuthError('Password must be at least 6 characters.');
  const res = await apiPost('/api/register', { name, displayName, email, password: pass });
  if (res.error) return showAuthError(res.error);
  token = res.token; me = res.user;
  // Persist displayName locally if server doesn't return it
  if (!me.displayName) me.displayName = displayName;
  localStorage.setItem('cacachat_token', token);
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
  if (ws) { ws.close(); ws = null; }
  renderedMsgIds.clear();
  dmUnread = {};
  closePanel('prof-panel');
  document.getElementById('app').classList.remove('show');
  document.getElementById('auth-screen').style.display = 'flex';
  document.getElementById('l-identifier').value = '';
  document.getElementById('l-pass').value = '';
}

async function tryAutoLogin() {
  if (!token) return;
  const res = await apiFetch('/api/me');
  if (res.error) { localStorage.removeItem('cacachat_token'); token = ''; return; }
  me = res.user;
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
  const data = { friends, pendingIn, pendingOut, blocked };
  try { localStorage.setItem('cc_social_' + me.name, JSON.stringify(data)); } catch {}
}

function loadSocialData() {
  if (!me) return;
  const saved = localStorage.getItem('cc_social_' + me.name);
  if (saved) {
    try {
      const d = JSON.parse(saved);
      friends    = d.friends    || [];
      pendingIn  = d.pendingIn  || [];
      pendingOut = d.pendingOut || [];
      blocked    = d.blocked    || [];
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

// ─── ENTER APP ───
function enterApp() {
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('app').classList.add('show');
  loadSettings();
  loadTheme();
  loadAvatarPrefs();
  loadDMConvos();
  loadSocialData();
  loadServers();
  setupProfile();
  buildEmojiPicker();
  buildThemeGrid();
  buildAvatarPicker();
  applyMsgStyle(userSettings.msgStyle);
  buildServerRail();
  connectWS();
  // Show dashboard (home) by default
  goHome();
}

function loadAvatarPrefs() {
  selectedAvatar = localStorage.getItem('cc_avatar') || AVATARS[0];
  selectedColor  = localStorage.getItem('cc_avcolor') || AVATAR_COLORS[0];
  selectedPfpDataUrl = localStorage.getItem('cc_pfp') || null;
}

function loadSettings() {
  const saved = localStorage.getItem('cc_settings');
  if (saved) {
    try { Object.assign(userSettings, JSON.parse(saved)); } catch {}
  }
}

function saveSettings() {
  userSettings.notifDesktop = document.getElementById('notif-desktop')?.checked ?? true;
  userSettings.notifSound   = document.getElementById('notif-sound')?.checked ?? true;
  userSettings.notifPreview = document.getElementById('notif-preview')?.checked ?? true;
  userSettings.notifTyping  = document.getElementById('notif-typing')?.checked ?? true;
  userSettings.privRead     = document.getElementById('priv-read')?.checked ?? true;
  userSettings.privDm       = document.getElementById('priv-dm')?.checked ?? true;
  localStorage.setItem('cc_settings', JSON.stringify(userSettings));
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
let _cropImg = null, _cropScale = 1, _cropX = 0, _cropY = 0, _cropDragging = false, _cropDragStart = null;

function handlePfpUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    showToast('#f04455', 'Oops', 'Image must be under 5MB'); return;
  }
  const reader = new FileReader();
  reader.onload = e => openCropModal(e.target.result);
  reader.readAsDataURL(file);
  // Reset input so same file can be re-selected
  event.target.value = '';
}

function openCropModal(src) {
  // Build modal if not present
  let modal = document.getElementById('pfp-crop-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'pfp-crop-modal';
    modal.className = 'panel';
    modal.innerHTML = `
      <div class="pc" style="width:360px;user-select:none">
        <div class="pc-title"><span>Crop Photo</span><button class="pc-close" onclick="closeCropModal()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
        <div id="crop-viewport" style="width:260px;height:260px;border-radius:50%;overflow:hidden;border:2px solid var(--acc);margin:0 auto 16px;position:relative;background:var(--bg0);cursor:grab;">
          <canvas id="crop-canvas" style="position:absolute;top:0;left:0;touch-action:none;"></canvas>
        </div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;flex-shrink:0;color:var(--t2)"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="range" id="crop-zoom" min="1" max="4" step="0.01" value="1" style="flex:1;accent-color:var(--acc)" oninput="updateCropZoom(this.value)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;flex-shrink:0;color:var(--t2)"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
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
    _cropScale = 1; _cropX = 0; _cropY = 0;
    document.getElementById('crop-zoom').value = 1;
    drawCrop();
  };
  img.src = src;
}

function closeCropModal() {
  document.getElementById('pfp-crop-modal')?.classList.remove('open');
}

function setupCropDrag() {
  const canvas = document.getElementById('crop-canvas');
  canvas.addEventListener('mousedown', e => { _cropDragging = true; _cropDragStart = { x: e.clientX - _cropX, y: e.clientY - _cropY }; canvas.style.cursor = 'grabbing'; });
  window.addEventListener('mousemove', e => { if (!_cropDragging) return; _cropX = e.clientX - _cropDragStart.x; _cropY = e.clientY - _cropDragStart.y; clampCrop(); drawCrop(); });
  window.addEventListener('mouseup', () => { _cropDragging = false; if(document.getElementById('crop-canvas')) document.getElementById('crop-canvas').style.cursor = 'grab'; });
  // Touch
  canvas.addEventListener('touchstart', e => { const t = e.touches[0]; _cropDragging = true; _cropDragStart = { x: t.clientX - _cropX, y: t.clientY - _cropY }; e.preventDefault(); }, { passive:false });
  window.addEventListener('touchmove', e => { if (!_cropDragging) return; const t = e.touches[0]; _cropX = t.clientX - _cropDragStart.x; _cropY = t.clientY - _cropDragStart.y; clampCrop(); drawCrop(); e.preventDefault(); }, { passive:false });
  window.addEventListener('touchend', () => { _cropDragging = false; });
}

function updateCropZoom(val) {
  _cropScale = parseFloat(val);
  clampCrop();
  drawCrop();
}

function clampCrop() {
  if (!_cropImg) return;
  const SIZE = 260;
  const scaledW = _cropImg.width * _cropScale;
  const scaledH = _cropImg.height * _cropScale;
  const minX = SIZE - scaledW;
  const minY = SIZE - scaledH;
  _cropX = Math.min(0, Math.max(minX, _cropX));
  _cropY = Math.min(0, Math.max(minY, _cropY));
}

function drawCrop() {
  if (!_cropImg) return;
  const SIZE = 260;
  const canvas = document.getElementById('crop-canvas');
  if (!canvas) return;
  canvas.width = SIZE; canvas.height = SIZE;
  canvas.style.width = SIZE + 'px'; canvas.style.height = SIZE + 'px';
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, SIZE, SIZE);
  ctx.drawImage(_cropImg, _cropX, _cropY, _cropImg.width * _cropScale, _cropImg.height * _cropScale);
}

function applyCrop() {
  const SIZE = 260;
  const out = document.createElement('canvas');
  out.width = SIZE; out.height = SIZE;
  const ctx = out.getContext('2d');
  ctx.drawImage(_cropImg, _cropX, _cropY, _cropImg.width * _cropScale, _cropImg.height * _cropScale);
  selectedPfpDataUrl = out.toDataURL('image/jpeg', 0.9);
  const prAv = document.getElementById('pr-av');
  renderAvatar(prAv, { pfp: selectedPfpDataUrl, name: me.displayName || me.name, color: selectedColor, size: 'xl' });
  closeCropModal();
}

// ─── AVATAR / PROFILE PANEL ───
function buildAvatarPicker() {
  const grid = document.getElementById('av-pick-grid');
  if (!grid) return;
  grid.innerHTML = '';
  AVATARS.forEach(av => {
    const d = document.createElement('div');
    d.className = 'av-opt' + (av === selectedAvatar ? ' selected' : '');
    d.textContent = av;
    d.onclick = () => {
      selectedAvatar = av;
      selectedPfpDataUrl = null;
      document.querySelectorAll('.av-opt').forEach(x => x.classList.remove('selected'));
      d.classList.add('selected');
      const prAv = document.getElementById('pr-av');
      renderAvatar(prAv, { emoji: av, color: selectedColor, name: me.displayName || me.name, size: 'xl' });
    };
    grid.appendChild(d);
  });

  const cGrid = document.getElementById('color-pick-grid');
  if (!cGrid) return;
  cGrid.innerHTML = '';
  AVATAR_COLORS.forEach(c => {
    const d = document.createElement('div');
    d.className = 'color-opt' + (c === selectedColor ? ' selected' : '');
    d.style.background = c;
    d.onclick = () => {
      selectedColor = c;
      document.querySelectorAll('.color-opt').forEach(x => x.classList.remove('selected'));
      d.classList.add('selected');
      const prAv = document.getElementById('pr-av');
      if (prAv) prAv.style.background = c;
    };
    cGrid.appendChild(d);
  });
}

function saveProfile() {
  localStorage.setItem('cc_avatar', selectedAvatar);
  localStorage.setItem('cc_avcolor', selectedColor);
  if (selectedPfpDataUrl) {
    try { localStorage.setItem('cc_pfp', selectedPfpDataUrl); } catch {}
  } else {
    localStorage.removeItem('cc_pfp');
  }
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

function setMyStatus(status, el) {
  document.querySelectorAll('.status-opt').forEach(x => x.classList.remove('active'));
  el.classList.add('active');
  const dotEl = document.getElementById('my-status-dot');
  const dot2  = document.getElementById('my-status-dot2');
  const label = document.getElementById('my-status-label');
  const map = { online: ['.s-on', 'var(--green)', 'Online'], dnd: ['.s-dnd', 'var(--red)', 'Do Not Disturb'], away: ['.s-away', 'var(--yellow)', 'Away'], offline: ['.s-off', 'var(--t2)', 'Offline'] };
  const [cls, clr, txt] = map[status] || map.online;
  if (dotEl) { dotEl.className = 'av-dot'; dotEl.classList.add(cls.slice(1)); dotEl.style.position = 'absolute'; dotEl.style.bottom = '0'; dotEl.style.right = '0'; dotEl.style.width = '9px'; dotEl.style.height = '9px'; dotEl.style.borderRadius = '50%'; dotEl.style.border = '2px solid var(--bg1)'; }
  if (dot2) dot2.style.background = clr;
  if (label) label.textContent = txt;
  localStorage.setItem('cc_status', status);
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
    // Friend request events from server (optional, if backend supports)
    case 'friend_request':
      if (data.from && !pendingIn.find(p => p.from === data.from)) {
        pendingIn.push({ from: data.from, displayName: data.displayName || data.from });
        saveSocialData();
        updatePendingBadge();
        if (currentDashTab === 'pending') renderPendingTab();
        showToast(AVATAR_COLORS[0], data.from, 'sent you a friend request!');
      }
      break;
    case 'friend_accepted':
      if (data.user) {
        pendingOut = pendingOut.filter(p => p.to !== data.user.name);
        if (!friends.find(f => f.name === data.user.name)) {
          friends.push(data.user);
        }
        saveSocialData();
        if (currentDashTab === 'friends') renderFriendsTab();
        showToast(AVATAR_COLORS[0], data.user.name, 'accepted your friend request!');
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

  // Show sidebar channels view
  document.getElementById('sb-invite-btn').style.display = 'none';
  document.getElementById('sb-brand-label').querySelector('.sb-brand-name').textContent = 'CacaChat';
  document.getElementById('sb-brand-label').querySelector('.sb-brand-tag').textContent = 'Private · Real-time';

  // Show channels view in sidebar
  showChannels();

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
    const online = onlineUsers.find(u => u.name === f.name);
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
      const avEl = document.createElement('div');
      avEl.className = 'av';
      renderAvatar(avEl, { emoji: '👤', color: AVATAR_COLORS[3], name: req.displayName || req.from });
      row.appendChild(avEl);
      row.innerHTML += `
        <div class="friend-row-info">
          <div class="friend-row-name">${esc(req.displayName || req.from)}</div>
          <div class="friend-row-status">Wants to be your friend</div>
        </div>
        <div class="friend-row-actions">
          <button class="frow-btn accept" onclick="acceptFriend('${esc(req.from)}')">Accept</button>
          <button class="frow-btn deny" onclick="denyFriend('${esc(req.from)}')">Deny</button>
        </div>`;
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
      renderAvatar(avEl, { emoji: '👤', color: AVATAR_COLORS[5], name: req.to });
      row.appendChild(avEl);
      row.innerHTML += `
        <div class="friend-row-info">
          <div class="friend-row-name">${esc(req.to)}</div>
          <div class="friend-row-status">Request sent — waiting…</div>
        </div>
        <div class="friend-row-actions">
          <button class="frow-btn deny" onclick="cancelFriendRequest('${esc(req.to)}')">Cancel</button>
        </div>`;
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
async function sendFriendRequest() {
  const errEl = document.getElementById('friend-req-error');
  errEl.classList.remove('show');
  const input = document.getElementById('friend-username-input');
  const username = input.value.trim().replace(/^@/, '');
  if (!username) { errEl.textContent = 'Enter a username.'; errEl.classList.add('show'); return; }
  if (username === me.name) { errEl.textContent = "You can't add yourself."; errEl.classList.add('show'); return; }
  if (friends.find(f => f.name === username)) { errEl.textContent = 'Already friends.'; errEl.classList.add('show'); return; }
  if (pendingOut.find(p => p.to === username)) { errEl.textContent = 'Request already sent.'; errEl.classList.add('show'); return; }

  // Try to send via API; fall back to local simulation if API doesn't support it
  let sent = false;
  try {
    const res = await apiPost('/api/friends/request', { to: username });
    if (!res.error) sent = true;
  } catch {}

  // If API not supported (404/error), still track locally for demo purposes
  if (!sent) {
    // Check if the target user exists in our online users list (simulation)
    const exists = onlineUsers.find(u => u.name === username);
    if (!exists) {
      // Still add to pendingOut — request may deliver when they come online
    }
    sent = true; // proceed optimistically
  }

  if (sent) {
    if (!pendingOut.find(p => p.to === username)) {
      pendingOut.push({ to: username });
    }
    saveSocialData();
    input.value = '';
    closePanel('add-friend-panel');
    showToast(selectedColor, 'Friend Request', `Request sent to @${username}`);
    // Switch to pending tab so user can see it
    switchDashTab('pending');
  }
}

function acceptFriend(fromName) {
  const req = pendingIn.find(p => p.from === fromName);
  if (!req) return;
  pendingIn = pendingIn.filter(p => p.from !== fromName);
  if (!friends.find(f => f.name === fromName)) {
    const online = onlineUsers.find(u => u.name === fromName);
    friends.push({
      name: fromName,
      displayName: req.displayName || fromName,
      color: online ? AVATAR_COLORS[online.color % AVATAR_COLORS.length] : AVATAR_COLORS[0],
      avatar: online?.avatar || null
    });
  }
  saveSocialData();
  updatePendingBadge();
  // Try to notify via API
  apiPost('/api/friends/accept', { from: fromName }).catch(() => {});
  renderPendingTab();
  showToast(selectedColor, fromName, 'You are now friends!');
}

function denyFriend(fromName) {
  pendingIn = pendingIn.filter(p => p.from !== fromName);
  saveSocialData();
  updatePendingBadge();
  apiPost('/api/friends/deny', { from: fromName }).catch(() => {});
  renderPendingTab();
}

function cancelFriendRequest(toName) {
  pendingOut = pendingOut.filter(p => p.to !== toName);
  saveSocialData();
  apiPost('/api/friends/cancel', { to: toName }).catch(() => {});
  renderPendingTab();
}

function removeFriend(name) {
  friends = friends.filter(f => f.name !== name);
  saveSocialData();
  apiPost('/api/friends/remove', { name }).catch(() => {});
  renderFriendsTab();
}

function blockUser(name) {
  friends = friends.filter(f => f.name !== name);
  if (!blocked.find(b => b.name === name)) blocked.push({ name });
  saveSocialData();
  apiPost('/api/friends/block', { name }).catch(() => {});
  renderFriendsTab();
  closePanel('user-profile-panel');
  showToast('#f04455', name, 'User blocked.');
}

function unblockUser(name) {
  blocked = blocked.filter(b => b.name !== name);
  saveSocialData();
  apiPost('/api/friends/unblock', { name }).catch(() => {});
  renderBlockedTab();
}

function startDMWithFriend(name) {
  const f = friends.find(fr => fr.name === name);
  const userObj = onlineUsers.find(u => u.name === name) || { name, color: 0, avatar: f?.avatar };
  showDMs();
  openDM(userObj);
}

// ─── SIDEBAR VIEWS ───
function showChannels() {
  sidebarView = 'channels';
  document.getElementById('view-channels').style.display = '';
  document.getElementById('view-dms').style.display = 'none';
  document.getElementById('view-server-channels').style.display = 'none';
  document.getElementById('snt-channels').classList.add('active');
  document.getElementById('snt-dms').classList.remove('active');
}

function showDMs() {
  sidebarView = 'dms';
  document.getElementById('view-channels').style.display = 'none';
  document.getElementById('view-dms').style.display = '';
  document.getElementById('view-server-channels').style.display = 'none';
  document.getElementById('snt-dms').classList.add('active');
  document.getElementById('snt-channels').classList.remove('active');
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
  document.getElementById('dashboard').style.display = 'none';
  const cp = document.getElementById('chat-panel');
  cp.style.display = 'flex';
  renderedMsgIds.clear();
  typingUsers = {};

  dmUnread[user.name] = 0;
  updateDMBadge();

  const chAv = document.getElementById('ch-av');
  const userPfp = localStorage.getItem('cc_pfp_' + user.name) || null;
  renderAvatar(chAv, {
    pfp: userPfp,
    emoji: user.avatar || null,
    color: AVATAR_COLORS[(user.color || 0) % AVATAR_COLORS.length],
    name: user.name
  });
  document.getElementById('ch-av-status').style.display = '';
  document.getElementById('ch-name').textContent = user.name;
  document.getElementById('ch-status').textContent = 'Direct Message';
  document.getElementById('ch-online-dot').style.display = onlineUsers.find(u => u.name === user.name) ? '' : 'none';

  const msgs = document.getElementById('msgs');
  msgs.innerHTML = '<div class="day-div"><span>Messages</span></div>';
  if (dmConvos[user.name]) {
    dmConvos[user.name].forEach(m => appendMsg(m, false));
  }
  msgs.scrollTop = msgs.scrollHeight;

  document.querySelectorAll('.ci').forEach(el => el.classList.remove('active'));
  document.querySelector(`[data-dm="${CSS.escape(user.name)}"]`)?.classList.add('active');

  // Switch sidebar to DMs so user sees the conversation
  showDMs();
}

function onDMMsg(msg) {
  const partner = msg.sender === me.name ? msg.to : msg.sender;
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
  const partners = Object.keys(dmConvos);
  if (partners.length === 0) {
    list.innerHTML = '<div class="sb-empty">No DMs yet — add a friend and start chatting!</div>';
    return;
  }
  list.innerHTML = '';
  partners.forEach(name => {
    const msgs = dmConvos[name];
    const last = msgs[msgs.length - 1];
    const u = onlineUsers.find(x => x.name === name) || { color: 0, name };
    const unread = dmUnread[name] || 0;
    const el = document.createElement('div');
    el.className = 'ci' + (currentDM === name ? ' active' : '');
    el.dataset.dm = name;
    const col = AVATAR_COLORS[(u.color || 0) % AVATAR_COLORS.length];
    const avDiv = document.createElement('div');
    avDiv.className = 'av';
    avDiv.style.position = 'relative';
    renderAvatar(avDiv, { emoji: u.avatar || null, color: col, name });
    const isOnline = !!onlineUsers.find(x => x.name === name);
    const dot = document.createElement('div');
    dot.className = 'av-dot ' + (isOnline ? 's-on' : 's-off');
    avDiv.appendChild(dot);

    const isDmTyping = dmTypingUsers[name] && (Date.now() - dmTypingUsers[name] < 4000);
    const previewText = isDmTyping ? '<em style="color:var(--acc2)">typing…</em>' : (last ? esc(last.text.slice(0, 32)) : '');

    el.appendChild(avDiv);
    el.innerHTML += `
      <div class="ci-info">
        <div class="ci-name">${esc(name)}</div>
        <div class="ci-prev">${previewText}</div>
      </div>
      <div class="ci-meta">
        ${unread ? `<div class="unread">${unread}</div>` : ''}
      </div>`;
    el.onclick = () => openDM(u);
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
    const partnerPfp = localStorage.getItem('cc_pfp_' + msg.sender) || null;
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
    const u = onlineUsers.find(u => u.name === mem) || {};
    const el = document.createElement('div');
    el.className = 'oi';
    const avEl = document.createElement('div');
    avEl.className = 'av sm';
    renderAvatar(avEl, { emoji: u.avatar || null, color: AVATAR_COLORS[(u.color || 0) % AVATAR_COLORS.length], name: mem });
    el.appendChild(avEl);
    el.innerHTML += `<span class="oi-name">${esc(mem)}${mem === me.name ? '' : ''}</span>`;
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

// ─── USER PROFILE VIEWER ───
function onClickChatHeader() {
  if (!currentDM) return;
  const u = onlineUsers.find(x => x.name === currentDM) || { name: currentDM, color: 0 };
  showUserProfile(u);
}

function showUserProfile(u) {
  const isOnline = !!onlineUsers.find(x => x.name === u.name);
  const col = AVATAR_COLORS[(u.color || 0) % AVATAR_COLORS.length];
  const avEl = document.getElementById('uv-av');
  renderAvatar(avEl, { emoji: u.avatar || null, color: col, name: u.name });
  document.getElementById('uv-name').textContent = u.name;
  document.getElementById('uv-handle').textContent = '@' + u.name;
  document.getElementById('uv-status-badge').textContent = isOnline ? '🟢 Online' : 'Offline';

  const actions = document.getElementById('uv-actions');
  const isFriend = !!friends.find(f => f.name === u.name);
  const isPendingOut = !!pendingOut.find(p => p.to === u.name);
  const isBlocked = !!blocked.find(b => b.name === u.name);

  actions.innerHTML = '';
  if (u.name !== me.name) {
    const msgBtn = document.createElement('button');
    msgBtn.className = 'uv-btn primary';
    msgBtn.textContent = 'Message';
    msgBtn.onclick = () => { closePanel('user-profile-panel'); openDM(u); };
    actions.appendChild(msgBtn);

    if (!isFriend && !isBlocked) {
      const addBtn = document.createElement('button');
      addBtn.className = 'uv-btn secondary';
      addBtn.textContent = isPendingOut ? 'Pending…' : 'Add Friend';
      if (!isPendingOut) addBtn.onclick = () => {
        if (!pendingOut.find(p => p.to === u.name)) pendingOut.push({ to: u.name });
        saveSocialData();
        closePanel('user-profile-panel');
        showToast(selectedColor, u.name, 'Friend request sent!');
      };
      actions.appendChild(addBtn);
    }

    if (isFriend) {
      const removeBtn = document.createElement('button');
      removeBtn.className = 'uv-btn danger';
      removeBtn.textContent = 'Remove Friend';
      removeBtn.onclick = () => { removeFriend(u.name); closePanel('user-profile-panel'); };
      actions.appendChild(removeBtn);
    }

    if (!isBlocked) {
      const blockBtn = document.createElement('button');
      blockBtn.className = 'uv-btn danger';
      blockBtn.textContent = 'Block';
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
    buildAvatarPicker();
    buildThemeGrid();
    populateSettingsToggles();
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
  btn.querySelector('.eye-off').style.display = isText ? '' : 'none';
  btn.querySelector('.eye-on').style.display = isText ? 'none' : '';
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

// Save before tab closes
window.addEventListener('beforeunload', () => {
  if (me) {
    saveDMConvos();
    saveSocialData();
    saveServers();
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