import { TYPE_COLORS } from './constants.js';

export function getTypeColor(typeName) {
  return TYPE_COLORS[typeName] || '#777';
}

export function typeBadgeHTML(typeObj) {
  const color = getTypeColor(typeObj.pt || typeObj.en);
  return `<span class="type-badge" style="--badge-color:${color}">${typeObj.pt || typeObj.en}</span>`;
}

export function padNum(n) {
  return String(n).padStart(3, '0');
}

export function spriteURL(number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${number}.png`;
}

export function formatMod(n) {
  return n >= 0 ? `+${n}` : `${n}`;
}

export function statBarWidth(val, max = 20) {
  return Math.min(100, (val / max) * 100);
}

export function getStatColor(stat) {
  const colors = {
    FOR: '#F08030', DES: '#F8D030', CON: '#78C850',
    INT: '#6890F0', SAB: '#A890F0', CAR: '#F85888'
  };
  return colors[stat] || '#aaa';
}

export function renderMarkdownText(text) {
  if (!text) return '';
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
}

export function showToast(msg, type = 'success') {
  const tc = document.getElementById('toast-container');
  if (!tc) return;
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${type === 'success' ? '✓' : '✕'}</span> ${msg}`;
  tc.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

export function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
