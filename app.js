/* ════════════════════════════════════════
   CACACHAT — app.js
   All client-side logic
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
  { id:'default',  name:'Warm Dark',     desc:'Earthy & cozy',       dot:'linear-gradient(135deg,#c8854a,#e0a060)' },
  { id:'midnight', name:'Midnight',       desc:'Deep purple night',   dot:'linear-gradient(135deg,#7c6fff,#a897ff)' },
  { id:'choco',    name:'Milk Choco',     desc:'Rich & warm brown',   dot:'linear-gradient(135deg,#d4893e,#e8a85a)' },
  { id:'matcha',   name:'Matcha',         desc:'Calm forest green',   dot:'linear-gradient(135deg,#5cb86a,#80d490)' },
  { id:'rose',     name:'Rose Gold',      desc:'Warm pink tones',     dot:'linear-gradient(135deg,#d45a6e,#e87a8e)' },
  { id:'cream',    name:'Cream',          desc:'Clean & bright',      dot:'linear-gradient(135deg,#b06030,#d08050)' },
  { id:'sewer',    name:'Sewer Mode',     desc:'Ultra dark & moody',  dot:'linear-gradient(135deg,#a07830,#c09848)' },
];

// Full emoji dataset organized by category
const EMOJI_CATS = [
  { icon: '😀', name: 'Smileys', emojis: ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘','😗','😚','😙','🥲','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶','😶‍🌫️','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🤧','🥵','🥶','🥴','😵','😵‍💫','🤯','🤠','🥳','🥸','😎','🤓','🧐','😕','😟','🙁','☹️','😮','😯','😲','😳','🥺','😦','😧','😨','😰','😥','😢','😭','😱','😖','😣','😞','😓','😩','😫','🥱','😤','😡','😠','🤬','😈','👿','💀','☠️','💩','🤡','👹','👺','👻','👽','👾','🤖'] },
  { icon: '👋', name: 'People', emojis: ['👋','🤚','🖐️','✋','🖖','🫱','🫲','🫳','🫴','👌','🤌','🤏','✌️','🤞','🫰','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','🫵','👍','👎','✊','👊','🤛','🤜','👏','🙌','🫶','👐','🤲','🤝','🙏','✍️','💅','🤳','💪','🦾','🦵','🦶','👂','🦻','👃','🫀','🫁','🧠','🦷','🦴','👀','👁️','👅','👄','🫦','💋','👣','👤','👥','🫂'] },
  { icon: '🐶', name: 'Animals', emojis: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🙈','🙉','🙊','🐔','🐧','🐦','🐤','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🪱','🐛','🦋','🐌','🐞','🐜','🪲','🦟','🦗','🪳','🕷️','🦂','🐢','🐍','🦎','🦖','🦕','🐙','🦑','🦐','🦞','🦀','🐡','🐠','🐟','🐬','🐳','🐋','🦈','🦭','🐊','🐅','🐆','🦓','🦍','🦧','🦣','🐘','🦛','🦏','🐪','🐫','🦒','🦘','🦬','🐃','🐂','🐄','🐎','🐖','🐏','🐑','🦙','🐐','🦌','🐕','🐩','🦮','🐕‍🦺','🐈','🐈‍⬛','🐓','🦃','🦤','🦚','🦜','🦢','🦩','🕊️','🐇','🦝','🦨','🦡','🦫','🦦','🦥','🐁','🐀','🐿️','🦔'] },
  { icon: '🍕', name: 'Food', emojis: ['🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑','🥦','🥬','🥒','🌶️','🫑','🥕','🧄','🧅','🥔','🍠','🫚','🥐','🥯','🍞','🥖','🥨','🧀','🥚','🍳','🧈','🥞','🧇','🥓','🥩','🍗','🍖','🦴','🌭','🍔','🍟','🍕','🫓','🥪','🥙','🧆','🌮','🌯','🫔','🥗','🥘','🫕','🥫','🍝','🍜','🍲','🍛','🍣','🍱','🥟','🦪','🍤','🍙','🍚','🍘','🍥','🥮','🍢','🧁','🍰','🎂','🍮','🍭','🍬','🍫','🍿','🍩','🍪','🌰','🥜','🍯','🧃','🥤','🧋','☕','🍵','🫖','🍶','🍺','🍻','🥂','🍷','🥃','🍸','🍹','🧉','🍾'] },
  { icon: '⚽', name: 'Sports', emojis: ['⚽','🏀','🏈','⚾','🥎','🎾','🏐','🏉','🥏','🎱','🪀','🏓','🏸','🏒','🥍','🏏','🪃','🥅','⛳','🪁','🏹','🎣','🤿','🥊','🥋','🎽','🛹','🛼','🛷','⛸️','🥌','🎿','⛷️','🏂','🪂','🏋️','🤸','🤺','🏇','⛹️','🤾','🏌️','🧘','🏄','🏊','🚴','🚵','🏆','🥇','🥈','🥉','🏅','🎖️','🎗️','🏵️','🎫','🎟️','🎪','🎭','🎨','🎬','🎤','🎧','🎼','🎵','🎶','🎙️','🎚️','🎛️','📻','🎷','🪗','🎸','🎹','🎺','🎻','🪘','🥁','🪖'] },
  { icon: '🚗', name: 'Travel', emojis: ['🚗','🚕','🚙','🚌','🚎','🏎️','🚓','🚑','🚒','🚐','🛻','🚚','🚛','🚜','🏍️','🛵','🦽','🦼','🛺','🚲','🛴','🛹','🛼','🚏','🛣️','🛤️','⛽','🚧','⚓','🛟','⛵','🚤','🛥️','🛳️','⛴️','🚢','✈️','🛩️','🛫','🛬','🪂','💺','🚁','🚟','🚠','🚡','🛰️','🚀','🛸','🪐','🌍','🌎','🌏','🌐','🗺️','🧭','🏔️','⛰️','🌋','🏕️','🏖️','🏜️','🏝️','🏟️','🏛️','🏗️','🏘️','🏚️','🏠','🏡','🏢','🏣','🏤','🏥','🏦','🏨','🏩','🏪','🏫','🏬','🏭','🏯','🏰','💒','🗼','🗽'] },
  { icon: '💡', name: 'Objects', emojis: ['⌚','📱','📲','💻','⌨️','🖥️','🖨️','🖱️','💾','💿','📀','🧮','📷','📸','📹','🎥','📽️','🎞️','📞','☎️','📟','📠','📺','📻','🧭','⏱️','⏲️','⏰','⌛','⏳','📡','🔋','🪫','🔌','💡','🔦','🕯️','🧱','🪞','🪟','🛏️','🛋️','🚪','🪑','🚽','🪠','🚿','🛁','🧴','🧷','🧹','🧺','🧻','🪣','🧼','🫧','🪥','🧽','🧯','🛒','🚪','🪤','🧸','🪆','🖼️','🧵','🪡','🧶','🪢','👓','🕶️','🥽','🌂','☂️','🧵','💎','🔮','🪬','🧿','🪩','🧸'] },
  { icon: '❤️', name: 'Symbols', emojis: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❤️‍🔥','❤️‍🩹','💕','💞','💓','💗','💖','💘','💝','💟','☮️','✝️','☪️','🕉️','☸️','✡️','🔯','🕎','☯️','☦️','🛐','⛎','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','🆔','⚛️','🉑','☢️','☣️','📴','📳','🈶','🈚','🈸','🈺','🈷️','✴️','🆚','💮','🉐','㊙️','㊗️','🈴','🈵','🈹','🈲','🅰️','🅱️','🆎','🆑','🅾️','🆘','❌','⭕','🛑','⛔','📛','🚫','💯','💢','♨️','🚷','🚯','🚳','🚱','🔞','📵','🔕','🔇','🔈','🔉','🔊','📢','📣','🔔','🔕','🎵','🎶','⚠️','🚸','⛔','🚫','✅','❎','🔱','⚜️','♻️','✔️','☑️','🔲','🔳','▪️','▫️','◾','◽','◼️','◻️','🟥','🟧','🟨','🟩','🟦','🟪','⬛','⬜','🔶','🔷','🔸','🔹','🔺','🔻','💠','🔘','🔲'] },
  { icon: '🌟', name: 'Nature', emojis: ['🌸','💐','🌹','🥀','🌺','🌻','🌼','🌷','🌱','🪴','🌲','🌳','🌴','🌵','🎋','🎍','🍀','🍁','🍂','🍃','🪶','🍄','🌾','💧','🌊','🌬️','🌀','🌈','⚡','❄️','☃️','⛄','🌡️','☀️','🌤️','⛅','🌥️','☁️','🌦️','🌧️','⛈️','🌩️','🌨️','🌪️','🌫️','🌊','💨','🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘','🌙','🌚','🌛','🌜','🌝','🌞','🪐','⭐','🌟','💫','✨','🎇','🎆','🌌','🌁'] },
];

// Flatten all emojis for search
const ALL_EMOJIS = EMOJI_CATS.flatMap(c => c.emojis);

// ─── STATE ───
let token = localStorage.getItem('cacachat_token') || '';
let me = null;
let ws = null, wsReady = false;
let currentRoom = null, currentDM = null;
let typingTimer = null, typingUsers = {}, lastTypingSent = 0;
let dmTypingUsers = {}; // { partnerName: timestamp }
let onlineUsers = [];
let renderedMsgIds = new Set();
let reconnectTimer = null, reconnectDelay = 1000;
let dmConvos = {};
let dmUnread = {};
let selectedAvatar = '😀';
let selectedColor = '#c8854a';
let selectedPfpDataUrl = null; // base64 uploaded photo
let sidebarView = 'channels';
let currentEpCat = 0;
let userSettings = {
  notifDesktop: true, notifSound: true, notifPreview: true, notifTyping: true,
  privOnline: true, privRead: true, privDm: true,
  msgStyle: 'bubbles'
};

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
  const email = document.getElementById('l-email').value.trim();
  const password = document.getElementById('l-pass').value;
  if (!email || !password) return showAuthError('Please enter email and password.');
  const res = await apiPost('/api/login', { email, password });
  if (res.error) return showAuthError(res.error);
  token = res.token; me = res.user;
  localStorage.setItem('cacachat_token', token);
  enterApp();
}

async function doRegister() {
  clearAuthError();
  const name  = document.getElementById('r-name').value.trim();
  const email = document.getElementById('r-email').value.trim();
  const pass  = document.getElementById('r-pass').value;
  if (!name || !email || !pass) return showAuthError('All fields are required.');
  const res = await apiPost('/api/register', { name, email, password: pass });
  if (res.error) return showAuthError(res.error);
  token = res.token; me = res.user;
  localStorage.setItem('cacachat_token', token);
  enterApp();
}

function showGuestModal() {
  document.getElementById('guest-modal').classList.add('show');
  setTimeout(() => document.getElementById('g-name').focus(), 100);
}
function hideGuestModal() {
  document.getElementById('guest-modal').classList.remove('show');
}

async function doGuest() {
  const name = document.getElementById('g-name').value.trim();
  const errEl = document.getElementById('guest-error');
  errEl.classList.remove('show');
  if (name.length < 2) {
    errEl.textContent = 'Name must be at least 2 characters.';
    errEl.classList.add('show'); return;
  }
  const res = await apiPost('/api/guest', { name });
  if (res.error) { errEl.textContent = res.error; errEl.classList.add('show'); return; }
  token = res.token; me = res.user;
  localStorage.setItem('cacachat_token', token);
  hideGuestModal(); enterApp();
}

async function doLogout() {
  await apiPost('/api/logout', {});
  localStorage.removeItem('cacachat_token');
  localStorage.removeItem('cc_avatar');
  localStorage.removeItem('cc_avcolor');
  localStorage.removeItem('cc_pfp');
  token = ''; me = null;
  if (ws) { ws.close(); ws = null; }
  renderedMsgIds.clear(); dmConvos = {}; dmUnread = {};
  closePanel('prof-panel');
  document.getElementById('app').classList.remove('show');
  document.getElementById('auth-screen').style.display = 'flex';
  document.getElementById('l-email').value = '';
  document.getElementById('l-pass').value = '';
}

async function tryAutoLogin() {
  if (!token) return;
  const res = await apiFetch('/api/me');
  if (res.error) { localStorage.removeItem('cacachat_token'); token = ''; return; }
  me = res.user;
  enterApp();
}

// ─── ENTER APP ───
function enterApp() {
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('app').classList.add('show');
  loadSettings();
  loadTheme();
  loadAvatarPrefs();
  setupProfile();
  buildEmojiPicker();
  buildThemeGrid();
  buildAvatarPicker();
  applyMsgStyle(userSettings.msgStyle);
  connectWS();
  setTimeout(() => switchRoom('general'), 300);
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
  userSettings.privOnline   = document.getElementById('priv-online')?.checked ?? true;
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
  set('priv-online', userSettings.privOnline);
  set('priv-read', userSettings.privRead);
  set('priv-dm', userSettings.privDm);
}

function setupProfile() {
  const navAv = document.getElementById('my-av');
  const prAv  = document.getElementById('pr-av');
  renderAvatar(navAv, { pfp: selectedPfpDataUrl, emoji: selectedAvatar, color: selectedColor, name: me.name });
  renderAvatar(prAv,  { pfp: selectedPfpDataUrl, emoji: selectedAvatar, color: selectedColor, name: me.name, size: 'xl' });
  document.getElementById('my-name').textContent = me.name;
  document.getElementById('pr-name').textContent = me.name;
  document.getElementById('pr-handle').textContent = me.email || 'Guest';
  document.getElementById('pr-guest-badge').style.display = me.isGuest ? '' : 'none';
}

// Generic avatar renderer — handles pfp image OR emoji OR initials
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

// ─── PFP UPLOAD ───
function handlePfpUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    showToast('#f04455', 'Oops', 'Image must be under 2MB'); return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    selectedPfpDataUrl = e.target.result;
    const prAv = document.getElementById('pr-av');
    renderAvatar(prAv, { pfp: selectedPfpDataUrl, name: me.name, color: selectedColor, size: 'xl' });
  };
  reader.readAsDataURL(file);
}

// ─── AVATAR / PROFILE PANEL ───
function buildAvatarPicker() {
  const grid = document.getElementById('av-pick-grid');
  grid.innerHTML = '';
  AVATARS.forEach(av => {
    const d = document.createElement('div');
    d.className = 'av-opt' + (av === selectedAvatar ? ' selected' : '');
    d.textContent = av;
    d.onclick = () => {
      selectedAvatar = av;
      selectedPfpDataUrl = null; // clear pfp when emoji selected
      document.querySelectorAll('.av-opt').forEach(x => x.classList.remove('selected'));
      d.classList.add('selected');
      const prAv = document.getElementById('pr-av');
      renderAvatar(prAv, { emoji: av, color: selectedColor, name: me.name, size: 'xl' });
    };
    grid.appendChild(d);
  });

  const cGrid = document.getElementById('color-pick-grid');
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
      prAv.style.background = c;
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
  // Update my avatars in visible messages
  document.querySelectorAll('.my-av-el').forEach(el => {
    renderAvatar(el, { pfp: selectedPfpDataUrl, emoji: selectedAvatar, color: selectedColor, name: me.name });
  });
  closePanel('prof-panel');
  showToast(selectedColor, me.name, 'Profile saved ✓');
}

// ─── SETTINGS TABS ───
function switchSettingsTab(tab) {
  document.querySelectorAll('.stab').forEach(b => b.classList.remove('active'));
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
  ['avatar','theme','notif','privacy'].forEach(t => {
    const el = document.getElementById('stab-' + t);
    if (el) el.style.display = t === tab ? '' : 'none';
  });
  if (tab === 'notif' || tab === 'privacy') populateSettingsToggles();
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
function connectWS() {
  if (ws) { try { ws.close(); } catch {} }
  ws = new WebSocket(`wss://cacachat-production.up.railway.app/?token=${token}`);
  ws.onopen = () => {
    wsReady = true; reconnectDelay = 1000;
    document.getElementById('conn-bar').classList.remove('show');
  };
  ws.onmessage = e => { try { handleWS(JSON.parse(e.data)); } catch {} };
  ws.onclose = ws.onerror = () => {
    wsReady = false;
    document.getElementById('conn-bar').classList.add('show');
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
      renderOnline(); renderContacts(); renderDMList();
      break;
    case 'chat':
      onChatMsg(data.message);
      break;
    case 'dm':
      onDMMsg(data.message);
      break;
    case 'online_update':
      onlineUsers = data.users || [];
      renderOnline(); renderContacts(); renderDMList();
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
      // DM typing
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
  }
}

function wsSend(data) { if (ws && wsReady) ws.send(JSON.stringify(data)); }

// ─── SIDEBAR VIEWS ───
function showChannels() {
  sidebarView = 'channels';
  document.getElementById('view-channels').style.display = '';
  document.getElementById('view-dms').style.display = 'none';
  document.getElementById('snt-channels').classList.add('active');
  document.getElementById('snt-dms').classList.remove('active');
}

function showDMs() {
  sidebarView = 'dms';
  document.getElementById('view-channels').style.display = 'none';
  document.getElementById('view-dms').style.display = '';
  document.getElementById('snt-dms').classList.add('active');
  document.getElementById('snt-channels').classList.remove('active');
  renderDMList();
}

// ─── ROOMS ───
function switchRoom(room) {
  currentRoom = room; currentDM = null;
  document.getElementById('welcome').style.display = 'none';
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

  loadHistory(room);
}

// ─── DMs ───
function openDM(user) {
  currentDM = user.name; currentRoom = null;
  document.getElementById('welcome').style.display = 'none';
  const cp = document.getElementById('chat-panel');
  cp.style.display = 'flex';
  renderedMsgIds.clear();
  typingUsers = {};

  dmUnread[user.name] = 0;
  updateDMBadge();

  // Header avatar
  const chAv = document.getElementById('ch-av');
  const userPfp = localStorage.getItem('cc_pfp_' + user.name) || null;
  renderAvatar(chAv, {
    pfp: userPfp,
    emoji: user.avatar || null,
    color: AVATAR_COLORS[user.color % AVATAR_COLORS.length],
    name: user.name
  });
  document.getElementById('ch-av-status').style.display = '';
  document.getElementById('ch-name').textContent = user.name;
  document.getElementById('ch-status').textContent = 'Direct Message';

  const msgs = document.getElementById('msgs');
  msgs.innerHTML = '<div class="day-div"><span>Today</span></div>';
  if (dmConvos[user.name]) {
    dmConvos[user.name].forEach(m => appendMsg(m, false));
  }
  msgs.scrollTop = msgs.scrollHeight;

  document.querySelectorAll('.ci').forEach(el => el.classList.remove('active'));
  document.querySelector(`[data-dm="${CSS.escape(user.name)}"]`)?.classList.add('active');
}

function onDMMsg(msg) {
  const partner = msg.sender === me.name ? msg.to : msg.sender;
  if (!dmConvos[partner]) dmConvos[partner] = [];
  if (dmConvos[partner].find(m => m.id === msg.id)) return;
  dmConvos[partner].push(msg);

  // clear typing
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
}

function updateDMBadge() {
  let total = Object.values(dmUnread).reduce((a,b) => a+b, 0);
  document.getElementById('dm-badge').classList.toggle('show', total > 0);
}

function renderDMList() {
  const list = document.getElementById('dm-list');
  const partners = Object.keys(dmConvos);
  if (partners.length === 0) {
    list.innerHTML = '<div class="sb-empty">No DMs yet — click someone online to message them.</div>';
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
    const col = AVATAR_COLORS[u.color % AVATAR_COLORS.length];
    const avDiv = document.createElement('div');
    avDiv.className = 'av';
    avDiv.style.position = 'relative';
    renderAvatar(avDiv, { emoji: u.avatar || null, color: col, name });
    const dot = document.createElement('div');
    dot.className = 'av-dot s-on';
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
    el.querySelector('.ci-info').prepend(); // no-op keep structure
    el.onclick = () => { showDMs(); openDM(u); };
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
  if (!text || !wsReady) return;
  input.value = ''; autoResize(input);
  if (currentDM) {
    sendDM(currentDM, text);
  } else {
    wsSend({ type: 'chat', room: currentRoom, text });
  }
  stopTyping();
}

function onChatMsg(msg) {
  if (renderedMsgIds.has(msg.id)) return;
  renderedMsgIds.add(msg.id);
  const visible = document.getElementById('chat-panel').style.display !== 'none' && msg.room === currentRoom;
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
    renderAvatar(avDiv, { pfp: selectedPfpDataUrl, emoji: selectedAvatar, color: selectedColor, name: me.name });
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
  bubble.textContent = msg.text; // safe text

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

// ─── ONLINE / CONTACTS ───
function renderOnline() {
  const list = document.getElementById('online-list');
  list.innerHTML = '';
  onlineUsers.forEach(u => {
    const col = AVATAR_COLORS[u.color % AVATAR_COLORS.length];
    const isMe = u.name === me.name;
    const el = document.createElement('div');
    el.className = 'oi';

    const avWrap = document.createElement('div');
    avWrap.className = 'oi-av-wrap';
    const avEl = document.createElement('div');
    avEl.className = 'av sm';
    if (isMe) {
      renderAvatar(avEl, { pfp: selectedPfpDataUrl, emoji: selectedAvatar, color: selectedColor, name: me.name });
    } else {
      renderAvatar(avEl, { emoji: u.avatar || null, color: col, name: u.name });
    }
    avWrap.appendChild(avEl);
    if (!isMe) {
      const dot = document.createElement('div');
      dot.className = 'oi-dot';
      avWrap.appendChild(dot);
    }

    el.appendChild(avWrap);
    el.innerHTML += `<div class="oi-name">${esc(u.name)}</div>${isMe ? '<div class="oi-you">you</div>' : ''}`;
    if (!isMe) {
      el.onclick = () => { showDMs(); openDM(u); };
    }
    list.appendChild(el);
  });
}

function renderContacts() {
  const list = document.getElementById('contacts-list');
  list.innerHTML = '';
  if (onlineUsers.length === 0) {
    list.innerHTML = '<div class="sb-loading">No one else online</div>'; return;
  }
  onlineUsers.forEach(u => {
    const col = AVATAR_COLORS[u.color % AVATAR_COLORS.length];
    const isMe = u.name === me.name;
    const el = document.createElement('div');
    el.className = 'ci';

    const avEl = document.createElement('div');
    avEl.className = 'av';
    avEl.style.position = 'relative';
    if (isMe) {
      renderAvatar(avEl, { pfp: selectedPfpDataUrl, emoji: selectedAvatar, color: selectedColor, name: me.name });
    } else {
      renderAvatar(avEl, { emoji: u.avatar || null, color: col, name: u.name });
    }
    const dot = document.createElement('div');
    dot.className = 'av-dot s-on';
    avEl.appendChild(dot);

    el.appendChild(avEl);
    el.innerHTML += `
      <div class="ci-info">
        <div class="ci-name">${esc(u.name)}${isMe ? ' <span style="font-size:10px;color:var(--t2)">(you)</span>' : ''}</div>
        <div class="ci-prev">${u.isGuest ? 'Guest' : 'Member'}</div>
      </div>`;
    if (!isMe) el.onclick = () => { showDMs(); openDM(u); };
    list.appendChild(el);
  });
}

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
  // Simple search by rendering all that "contain" q visually — since emoji are not searchable by name without DB
  // We filter from all emojis — show first 80 matches
  const results = ALL_EMOJIS.slice(0, 200);
  renderEpGrid(results);
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
function mobileBack() { document.getElementById('sidebar').classList.remove('mob-open'); }

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
    if (document.activeElement.id === 'l-email') document.getElementById('l-pass')?.focus();
  }
  if (e.key === 'Enter' && document.getElementById('form-register')?.style.display !== 'none') {
    if (document.activeElement.id === 'r-pass') doRegister();
  }
  if (e.key === 'Escape') {
    closePanel('prof-panel');
    document.getElementById('emoji-picker')?.classList.remove('open');
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