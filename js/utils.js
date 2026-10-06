// Kleine hulpfuncties, gedeeld door de hele app.

function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function uid(prefix) {
  return (prefix || 'id') + '_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function escapeHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatEuro(n) {
  const v = Number(n);
  if (!isFinite(v) || v <= 0) return null;
  return '€' + v.toLocaleString('nl-NL', { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 });
}

// Deterministische, plezierige gradient per artiest/album zodat elke hoes-placeholder
// een eigen "kleur" heeft zonder dat we echte albumhoezen namaken.
const GRADIENT_PALETTE = [
  ['#1d3a2c', '#3f6b52'], ['#3b3560', '#6d5fae'], ['#5a3a1c', '#b8783a'],
  ['#2a3b55', '#4f78a8'], ['#6b2b3f', '#b85a7a'], ['#243b2e', '#5a8a68'],
  ['#8a3b2b', '#d9742f'], ['#3a2a1a', '#8a5a2c'], ['#1c3a4a', '#3a7a8a'],
  ['#4a1c3a', '#9a3a6a'], ['#2a2a5a', '#5a5aae'], ['#3a4a1c', '#7a9a3a']
];

function gradientFor(seedStr) {
  let hash = 0;
  const s = String(seedStr || '');
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  const pair = GRADIENT_PALETTE[hash % GRADIENT_PALETTE.length];
  return `linear-gradient(160deg, ${pair[0]}, ${pair[1]})`;
}

function debounce(fn, ms) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), ms);
  };
}

function showToast(msg, ms) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.hidden = false;
  el.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => { el.hidden = true; }, 200);
  }, ms || 2200);
}

// Geeft HTML voor een hoes-thumbnail: een echte foto als die er is, anders een
// gestileerde placeholder met gradient + titel (geen nagemaakte echte albumhoezen).
function coverHtml(record, opts) {
  opts = opts || {};
  const full = opts.size === 'full';
  const size = full ? null : (opts.size || 54);
  const dim = full ? 'width:100%;height:100%;' : `width:${size}px;height:${size}px;`;
  const radius = opts.radius != null ? opts.radius : 10;
  if (record.cover) {
    return `<div class="cover-photo" style="${dim}border-radius:${radius}px;background-image:url('${record.cover}')"></div>`;
  }
  const grad = gradientFor((record.artist || '') + (record.title || ''));
  const label = escapeHtml((record.title || record.artist || '').toUpperCase());
  const fontSize = full ? 15 : Math.max(6, Math.round(size * 0.13));
  return `<div class="cover-placeholder" style="${dim}border-radius:${radius}px;background:${grad}">
    <div class="cover-sheen"></div>
    <div class="cover-label" style="font-size:${fontSize}px">${label}</div>
  </div>`;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
