import { state } from './state.js';

export function getPageFromHash() {
  const h = window.location.hash.replace('#', '');
  return ['pokedex', 'regras', 'fichas', 'movimentos', 'encontros', 'mapa'].includes(h) ? h : null;
}

export function setupNavigation(navigateTo) {
  // Navigation items
  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', () => {
      navigateTo(el.dataset.page);
      closeMobileMenu();
    });
  });

  // Navigation Groups (Desktop Sidebar)
  document.querySelectorAll('.nav-group-header').forEach(el => {
    el.addEventListener('click', () => {
      const group = el.parentElement;
      group.classList.toggle('expanded');
    });
  });

  // Mobile Navigation Groups
  document.querySelectorAll('[data-group]').forEach(el => {
    el.addEventListener('click', () => {
      const groupId = el.dataset.group;
      const overlay = document.getElementById(`mobile-menu-${groupId}`);
      if (overlay) overlay.classList.add('open');
    });
  });

  // Global mobile menu close
  window.closeMobileMenu = () => {
    document.querySelectorAll('.mobile-menu-overlay').forEach(el => el.classList.remove('open'));
  };

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

  // Handle sidebar grouping: if a child page is active, ensure the parent group is expanded
  const activeNavItem = document.querySelector(`.sidebar .nav-item[data-page="${page}"]`);
  if (activeNavItem) {
    const parentGroup = activeNavItem.closest('.nav-group');
    if (parentGroup) parentGroup.classList.add('expanded');
  }

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
