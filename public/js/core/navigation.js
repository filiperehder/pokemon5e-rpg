import { state } from './state.js';

export function getPageFromHash() {
  const h = window.location.hash.replace('#', '');
  return ['pokedex', 'regras', 'fichas', 'movimentos', 'encontros', 'mapa'].includes(h) ? h : null;
}

export function setupNavigation(navigateTo) {
  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', () => navigateTo(el.dataset.page));
  });
  window.addEventListener('hashchange', () => {
    const p = getPageFromHash();
    if (p && p !== state.activePage) navigateTo(p, false);
  });
}

export function navigateTo(page, options = {}) {
  const { 
    updateHash = true, 
    renderPokedex, 
    renderMoves, 
    renderRules, 
    renderSheets,
    renderEncounters,
    renderMap
  } = options;
  
  state.activePage = page;

  // Update nav active states
  document.querySelectorAll('[data-page]').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });

  // Show/hide pages
  document.querySelectorAll('.page').forEach(el => {
    el.classList.toggle('active', el.id === `page-${page}`);
  });

  if (updateHash) history.replaceState(null, '', `#${page}`);

  // Lazy render
  if (page === 'pokedex' && renderPokedex)    renderPokedex();
  if (page === 'movimentos' && renderMoves) renderMoves();
  if (page === 'regras' && renderRules)     renderRules();
  if (page === 'fichas' && renderSheets)     renderSheets();
  if (page === 'encontros' && renderEncounters) renderEncounters();
  if (page === 'mapa' && renderMap) renderMap();
}
