import { state } from '../core/state.js';
import { getTypeColor, showToast } from '../core/utils.js';
import { MOVES_PER_PAGE } from '../core/constants.js';

export function renderMoves() {
  const filtered = filterMovesList();
  const tableBody = document.getElementById('moves-tbody');
  const countEl = document.getElementById('move-count');
  if (countEl) countEl.textContent = `${filtered.length} Movimentos`;

  const start = (state.movePage - 1) * MOVES_PER_PAGE;
  const end = start + MOVES_PER_PAGE;
  const pageItems = filtered.slice(start, end);

  if (!pageItems.length) {
    tableBody.innerHTML = '<tr><td colspan="6" class="no-results">Nenhum movimento encontrado.</td></tr>';
    return;
  }

  tableBody.innerHTML = pageItems.map(m => `
    <tr data-name="${m.name}">
      <td><div class="move-name">${m.name}</div></td>
      <td><span class="type-badge" style="--badge-color:${getTypeColor(m.type.pt || m.type.en)}">${m.type.pt || m.type.en}</span></td>
      <td class="move-pp">${m.pp || '—'}</td>
      <td>${m.moveTime.pt || m.moveTime.en || '—'}</td>
      <td>${m.range || '—'}</td>
      <td>${m.movePower.pt || m.movePower.en || '—'}</td>
    </tr>`).join('');

  // Add click handlers
  tableBody.querySelectorAll('tr').forEach(row => {
    row.addEventListener('click', () => {
      const move = state.moveMap[row.dataset.name.toLowerCase()];
      if (move) openMovePanel(move);
    });
  });

  renderMovesPagination(filtered.length);
}

export function filterMovesList() {
  let list = state.allMoves;
  const f = state.moveFilters;
  if (f.search) {
    const s = f.search.toLowerCase();
    list = list.filter(m => m.name.toLowerCase().includes(s) || (m.description?.pt || '').toLowerCase().includes(s));
  }
  if (f.type) {
    list = list.filter(m => m.type.pt === f.type || m.type.en === f.type);
  }
  return list;
}

export function renderMovesPagination(total) {
  const container = document.getElementById('moves-pagination');
  if (!container) return;
  const totalPages = Math.ceil(total / MOVES_PER_PAGE);
  
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = `<button class="page-btn" ${state.movePage === 1 ? 'disabled' : ''} id="btn-prev-page">Anterior</button>`;
  
  const startPage = Math.max(1, state.movePage - 2);
  const endPage = Math.min(totalPages, startPage + 4);
  
  for (let i = startPage; i <= endPage; i++) {
    html += `<button class="page-btn ${i === state.movePage ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }
  
  html += `<button class="page-btn" ${state.movePage === totalPages ? 'disabled' : ''} id="btn-next-page">Próxima</button>`;
  container.innerHTML = html;

  // Add handlers
  container.querySelectorAll('[data-page]').forEach(btn => {
    btn.onclick = () => {
      state.movePage = parseInt(btn.dataset.page);
      renderMoves();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  });
  const prev = document.getElementById('btn-prev-page');
  if (prev) prev.onclick = () => {
    if (state.movePage > 1) {
      state.movePage--;
      renderMoves();
    }
  };
  const next = document.getElementById('btn-next-page');
  if (next) next.onclick = () => {
    if (state.movePage < totalPages) {
      state.movePage++;
      renderMoves();
    }
  };
}

export function setupMoveFilters() {
  const search = document.getElementById('search-moves');
  const type = document.getElementById('filter-move-type');

  if (search) search.addEventListener('input', () => {
    state.moveFilters.search = search.value;
    state.movePage = 1;
    renderMoves();
  });
  if (type) type.addEventListener('change', () => {
    state.moveFilters.type = type.value;
    state.movePage = 1;
    renderMoves();
  });
}

export function openMovePanel(move) {
  state.selectedMove = move;
  const panel = document.getElementById('move-panel');
  const body = document.getElementById('move-panel-body');
  const backdrop = document.getElementById('panel-backdrop');
  
  document.getElementById('move-panel-title').textContent = move.name;
  
  const typeColor = getTypeColor(move.type.pt || move.type.en || '');
  const badge = `<span class="type-badge" style="--badge-color:${typeColor}">${move.type.pt || move.type.en || '—'}</span>`;

  body.innerHTML = `
    <div class="move-detail-grid">
      <div class="move-detail-item">
        <div class="move-detail-label">Tipo</div>
        <div class="move-detail-value">${badge}</div>
      </div>
      <div class="move-detail-item">
        <div class="move-detail-label">PP</div>
        <div class="move-detail-value">${move.pp || '—'}</div>
      </div>
      <div class="move-detail-item">
        <div class="move-detail-label">Tempo de Execução</div>
        <div class="move-detail-value">${move.moveTime.pt || move.moveTime.en || '—'}</div>
      </div>
      <div class="move-detail-item">
        <div class="move-detail-label">Alcance</div>
        <div class="move-detail-value">${move.range || '—'}</div>
      </div>
      <div class="move-detail-item">
        <div class="move-detail-label">Duração</div>
        <div class="move-detail-value">${move.duration?.pt || move.duration?.en || '—'}</div>
      </div>
      <div class="move-detail-item">
        <div class="move-detail-label">Poder</div>
        <div class="move-detail-value">${move.movePower.pt || move.movePower.en || '—'}</div>
      </div>
    </div>
    
    <div class="move-detail-section" style="margin-top:20px">
      <div class="move-detail-label">Descrição</div>
      <div class="move-detail-desc" style="font-size:0.9rem; color:var(--text-secondary); line-height:1.6">${move.description.pt || move.description.en || move.description}</div>
    </div>

    ${move.higherLevels ? `
    <div class="move-detail-section" style="margin-top:20px">
      <div class="move-detail-label">Em Níveis Superiores</div>
      <div class="move-detail-desc" style="font-size:0.9rem; color:var(--text-secondary); line-height:1.6">${move.higherLevels.pt || move.higherLevels.en || move.higherLevels}</div>
    </div>` : ''}
  `;

  panel.classList.add('open');
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

export function closeMovePanel() {
  document.getElementById('move-panel').classList.remove('open');
  document.getElementById('panel-backdrop').classList.remove('open');
  document.body.style.overflow = '';
}
