import { state } from '../core/state.js';
import { getTypeColor, typeBadgeHTML, spriteURL } from '../core/utils.js';
import { openPokemonDetail } from './Pokedex.js';

export function renderMap() {
  const listEl = document.getElementById('map-location-list');
  const detailEl = document.getElementById('map-detail-area');

  if (!state.mapData) return;

  // Render location list
  listEl.innerHTML = state.mapData.mapa.map((loc, idx) => `
    <div class="location-item ${state.selectedLocation?.nome === loc.nome ? 'active' : ''}" data-idx="${idx}">
      <span class="location-icon">${loc.tipo === 'cidade' ? '🏙️' : (loc.tipo === 'rota' ? '🌿' : '🕳️')}</span>
      <div class="location-info">
        <div class="location-name">${loc.nome}</div>
        <div class="location-type">${loc.tipo.toUpperCase()}</div>
      </div>
    </div>
  `).join('');

  // Setup click events for list
  listEl.querySelectorAll('.location-item').forEach(item => {
    item.onclick = () => {
      const idx = item.dataset.idx;
      state.selectedLocation = state.mapData.mapa[idx];
      renderMap();
    };
  });

  // Render detail
  if (state.selectedLocation) {
    detailEl.innerHTML = buildLocationDetailHTML(state.selectedLocation);
    setupLocationDetailEvents(detailEl);
  }
}

function buildLocationDetailHTML(loc) {
  const encountersGrama = loc.tabela_grama || loc.tabela_caverna || [];
  const encountersAgua = loc.encontros_agua || [];

  return `
    <div class="location-detail-card">
      <div class="location-detail-header">
        <div class="location-detail-title">
          <span class="location-icon-large">${loc.tipo === 'cidade' ? '🏙️' : (loc.tipo === 'rota' ? '🌿' : '🕳️')}</span>
          <div>
            <h2>${loc.nome}</h2>
            <div class="location-type-badge">${loc.tipo.toUpperCase()}</div>
          </div>
        </div>
        ${loc.conecta ? `
          <div class="location-connections">
            <strong>Conecta com:</strong> ${loc.conecta.join(', ')}
          </div>
        ` : ''}
      </div>

      ${loc.ginasio ? `
        <div class="gym-block">
          <div class="gym-title">🏆 Ginásio de ${loc.nome}</div>
          <div class="gym-info">
            <div><strong>Líder:</strong> ${loc.ginasio.lider}</div>
            <div><strong>Tipo:</strong> <span class="type-badge" style="--badge-color:${getTypeColor(loc.ginasio.tipo)}">${loc.ginasio.tipo}</span></div>
            ${loc.ginasio.insignia ? `<div><strong>Insígnia:</strong> ${loc.ginasio.insignia}</div>` : ''}
            ${loc.ginasio.status ? `<div><strong>Status:</strong> ${loc.ginasio.status}</div>` : ''}
          </div>
        </div>
      ` : ''}

      ${encountersGrama.length > 0 ? `
        <div class="encounter-section">
          <div class="encounter-section-title">✨ Encontros na ${loc.tipo === 'caverna' ? 'Caverna' : 'Grama'} (1d20)</div>
          <div class="encounter-grid">
            ${encountersGrama.map(e => buildEncounterItemHTML(e)).join('')}
          </div>
        </div>
      ` : ''}

      ${encountersAgua.length > 0 ? `
        <div class="encounter-section">
          <div class="encounter-section-title">💧 Encontros na Água</div>
          <div class="encounter-grid">
            ${encountersAgua.map(e => buildEncounterItemHTML(e)).join('')}
          </div>
        </div>
      ` : ''}

      ${encountersGrama.length === 0 && encountersAgua.length === 0 && !loc.ginasio ? `
        <div class="empty-state" style="min-height: auto; padding: 40px 0;">
          <div class="empty-state-text">Nenhum encontro selvagem registrado nesta área.</div>
        </div>
      ` : ''}
    </div>
  `;
}

function buildEncounterItemHTML(e) {
  const p = state.allPokemon.find(pk => pk.name.toLowerCase() === e.especie.toLowerCase().split(' (')[0]);
  const chance = e.faixa_d20 ? Math.round(((e.faixa_d20[1] - e.faixa_d20[0] + 1) / 20) * 100) : null;

  return `
    <div class="encounter-poke-card" data-name="${e.especie}">
      <img class="encounter-poke-sprite" src="${p ? spriteURL(p.number) : ''}" alt="${e.especie}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 120 120%22><text y=%2290%22 font-size=%2290%22>🔮</text></svg>'">
      <div class="encounter-poke-info">
        <div class="encounter-poke-header">
          <div class="encounter-poke-name">${e.especie}</div>
          ${chance !== null ? `<div class="encounter-rate-tag" title="Chance de aparecer">${chance}%</div>` : ''}
        </div>
        <div class="encounter-poke-meta">
          <span class="meta-label">Nível ${e.niveis}</span>
          ${e.metodo ? `<span class="encounter-method">${e.metodo}</span>` : ''}
          ${e.faixa_d20 ? `<span class="d20-badge">🎲 ${e.faixa_d20[0]}-${e.faixa_d20[1]}</span>` : ''}
        </div>
      </div>
    </div>
  `;
}

function setupLocationDetailEvents(container) {
  container.querySelectorAll('.encounter-poke-card').forEach(card => {
    card.onclick = () => {
      const name = card.dataset.name.split(' (')[0];
      const p = state.allPokemon.find(pk => pk.name.toLowerCase() === name.toLowerCase());
      if (p) openPokemonDetail(p);
    };
  });
}
