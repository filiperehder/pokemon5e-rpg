import { state } from '../core/state.js';
import { getTypeColor, typeBadgeHTML, padNum, spriteURL, statBarWidth, getStatColor, formatMod, showToast } from '../core/utils.js';
import { TM_MAP } from '../core/constants.js';
import { calculateStats, calculateAC, calculateHP, NATURES, ASI_LEVELS } from '../core/pokemon-stats.js';

export function renderPokedex() {
  const filtered = filterPokemonList();
  const grid = document.getElementById('pokemon-grid');
  const countEl = document.getElementById('poke-count');
  if (countEl) countEl.textContent = `${filtered.length} Pokémon`;

  if (!filtered.length) {
    grid.innerHTML = '<div class="no-results">Nenhum Pokémon encontrado.</div>';
    return;
  }

  grid.innerHTML = filtered.map(p => pokemonCardHTML(p)).join('');

  // Add click handlers
  grid.querySelectorAll('.pokemon-card').forEach((card, i) => {
    card.addEventListener('click', () => openPokemonDetail(filtered[i]));
  });
}

export function filterPokemonList() {
  let list = state.allPokemon;
  const f = state.pokedexFilters;
  if (f.search) {
    const s = f.search.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(s));
  }
  if (f.type) {
    list = list.filter(p => p.types.some(t => t.pt === f.type || t.en === f.type));
  }
  if (f.cr) {
    list = list.filter(p => String(p.cr) === f.cr);
  }
  if (f.size) {
    list = list.filter(p => p.size.pt === f.size || p.size.en === f.size);
  }
  return list;
}

export function pokemonCardHTML(p) {
  const primaryType = p.types[0];
  const typeColor = getTypeColor(primaryType?.pt || '');
  const typeBadges = p.types.map(t => typeBadgeHTML(t)).join('');
  const speedStr = Object.entries(p.speed || {})
    .map(([k, v]) => `${v}ft${k !== 'walk' ? ` (${k === 'fly' ? '✦' : '~'})` : ''}`)
    .join(' / ');

  return `
    <div class="pokemon-card" style="--type-color:${typeColor}">
      <div class="pokemon-card-img">
        <span class="pokemon-number">#${padNum(p.number)}</span>
        <img src="${spriteURL(p.number)}" alt="${p.name}" loading="lazy"
             onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 96 96%22><text y=%2272%22 font-size=%2272%22>🔮</text></svg>'">
      </div>
      <div class="pokemon-card-info">
        <div class="pokemon-card-name">${p.name}</div>
        <div class="pokemon-card-types">${typeBadges}</div>
        <div class="pokemon-card-meta">
          <span>Nv.${p.level}</span>
          <span>CR ${p.cr}</span>
          <span>${speedStr}</span>
        </div>
      </div>
    </div>`;
}

export function setupPokedexFilters() {
  const search = document.getElementById('search-pokemon');
  const type = document.getElementById('filter-type');
  const cr = document.getElementById('filter-cr');
  const size = document.getElementById('filter-size');

  if (search) search.addEventListener('input', () => {
    state.pokedexFilters.search = search.value;
    renderPokedex();
  });
  if (type) type.addEventListener('change', () => {
    state.pokedexFilters.type = type.value;
    renderPokedex();
  });
  if (cr) cr.addEventListener('change', () => {
    state.pokedexFilters.cr = cr.value;
    renderPokedex();
  });
  if (size) size.addEventListener('change', () => {
    state.pokedexFilters.size = size.value;
    renderPokedex();
  });
}

export function openPokemonDetail(pokemon, options = {}) {
  state.selectedPokemon = pokemon;
  const modal = document.getElementById('pokemon-modal');
  const content = document.getElementById('pokemon-detail-content');
  const typeColor = getTypeColor(pokemon.types[0]?.pt || '');

  content.innerHTML = buildPokemonDetailHTML(pokemon, typeColor, options);

  setupDetailEvents(content, pokemon, options);

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function setupDetailEvents(content, pokemon, options) {
  const { sheetMode = false, slotIdx } = options;

  // Move chips → show inline (ONLY for non-selectable chips)
  content.querySelectorAll('.move-chip:not(.selectable)').forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      const move = state.moveMap[chip.dataset.move?.toLowerCase()];
      if (move) showMoveInModal(move);
    });
  });

  // Active move cards (the card area, except the remove button)
  content.querySelectorAll('.active-move-card[data-move]').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-move-action')) return;
      const move = state.moveMap[card.dataset.move?.toLowerCase()];
      if (move) showMoveInModal(move);
    });
  });

  // Add to sheet button (normal mode)
  const addBtn = content.querySelector('#btn-add-to-sheet');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('open-add-to-sheet', { detail: pokemon }));
    });
  }

  // Sheet Mode specific events
  if (sheetMode && slotIdx !== undefined) {
    const sheet = state.sheets[state.editingSheet];
    const slot = sheet.pokemon[slotIdx];

    // Move changes (add/remove)
    // 1. Remove buttons
    content.querySelectorAll('.btn-move-action.remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const moveName = btn.dataset.move;
        if (slot.selectedMoves) {
          slot.selectedMoves = slot.selectedMoves.filter(m => m !== moveName);
          saveAndRefreshDetail(pokemon, options);
        }
      });
    });

    // 2. Add chips
    content.querySelectorAll('.move-chip.selectable.add').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        const moveName = chip.dataset.move;
        if (!slot.selectedMoves) slot.selectedMoves = [];
        if (slot.selectedMoves.length >= 4) {
          showToast('Máximo 4 movimentos ativos', 'error');
          return;
        }
        if (!slot.selectedMoves.includes(moveName)) {
          slot.selectedMoves.push(moveName);
          saveAndRefreshDetail(pokemon, options);
        }
      });
    });

    // Level changes
    const btnLvlMinus = content.querySelector('#btn-detail-lvl-minus');
    const btnLvlPlus = content.querySelector('#btn-detail-lvl-plus');
    if (btnLvlMinus) {
      btnLvlMinus.addEventListener('click', (e) => {
        e.stopPropagation();
        const newLvl = Math.max(1, slot.level - 1);
        if (newLvl !== slot.level) {
          slot.level = newLvl;
          saveAndRefreshDetail(pokemon, options);
        }
      });
    }
    if (btnLvlPlus) {
      btnLvlPlus.addEventListener('click', (e) => {
        e.stopPropagation();
        const newLvl = Math.min(20, slot.level + 1);
        if (newLvl !== slot.level) {
          slot.level = newLvl;
          saveAndRefreshDetail(pokemon, options);
        }
      });
    }

    // Nature change
    const natureSelect = content.querySelector('#nature-select');
    if (natureSelect) {
      natureSelect.addEventListener('change', (e) => {
        slot.nature = e.target.value;
        saveAndRefreshDetail(pokemon, options);
      });
    }

    // ASI changes
    content.querySelectorAll('.asi-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const level = e.target.dataset.level;
        const attr = e.target.value;
        if (!slot.asi) slot.asi = {};
        // Reset this level and set only the chosen one to 1
        slot.asi[level] = {};
        if (attr) slot.asi[level][attr] = 1;
        saveAndRefreshDetail(pokemon, options);
      });
    });

    // HP manual update
    const hpInput = content.querySelector('#hp-max-input');
    if (hpInput) {
      hpInput.addEventListener('change', (e) => {
        slot.hpMax = parseInt(e.target.value) || 0;
        saveAndRefreshDetail(pokemon, options);
      });
    }
  }

  // Close button in footer
  const closeBtn = content.querySelector('#btn-close-detail-footer');
  if (closeBtn) closeBtn.onclick = closePokemonDetail;
  const headerCloseBtn = content.querySelector('#btn-close-detail');
  if (headerCloseBtn) headerCloseBtn.onclick = closePokemonDetail;
}

function saveAndRefreshDetail(pokemon, options) {
  localStorage.setItem('pokemon5e_sheets', JSON.stringify(state.sheets));
  const content = document.getElementById('pokemon-detail-content');
  const typeColor = getTypeColor(pokemon.types[0]?.pt || '');
  content.innerHTML = buildPokemonDetailHTML(pokemon, typeColor, options);
  setupDetailEvents(content, pokemon, options);
  window.dispatchEvent(new CustomEvent('render-sheets'));
}

export function showMoveInModal(move) {
  const card = document.getElementById('modal-inline-move');
  if (!card) return;

  const typeColor = getTypeColor(move.type.pt || move.type.en || '');
  const badge = `<span class="type-badge" style="--badge-color:${typeColor}">${move.type.pt || move.type.en || '—'}</span>`;

  card.innerHTML = `
    <div class="inline-move-card">
      <div class="inline-move-header">
        <span class="inline-move-name">${move.name}</span>
        ${badge}
        <button class="inline-move-close" id="btn-close-inline-move">✕</button>
      </div>
      <div class="inline-move-fields">
        <span><strong>PP</strong> ${move.pp || '—'}</span>
        <span><strong>Ação</strong> ${move.moveTime.pt || move.moveTime.en || '—'}</span>
        <span><strong>Alcance</strong> ${move.range || '—'}</span>
        <span><strong>Poder</strong> ${move.movePower.pt || move.movePower.en || '—'}</span>
      </div>
      ${(move.description?.pt || move.description?.en || move.description) ? `<div class="inline-move-desc">${move.description.pt || move.description.en || move.description}</div>` : ''}
      ${(move.higherLevels?.pt || move.higherLevels?.en || move.higherLevels) ? `<div class="inline-move-higher"><strong>Níveis maiores:</strong> ${move.higherLevels.pt || move.higherLevels.en || move.higherLevels}</div>` : ''}
    </div>`;

  document.getElementById('btn-close-inline-move').onclick = () => { card.innerHTML = ''; };
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

export function closePokemonDetail() {
  document.getElementById('pokemon-modal').classList.remove('open');
  document.body.style.overflow = '';
}

export function buildPokemonDetailHTML(p, typeColor, options = {}) {
  const { sheetMode = false, selectedMoves = [], slotIdx } = options;
  const sheet = sheetMode ? state.sheets[state.editingSheet] : null;
  const slot = (sheet && slotIdx !== undefined) ? sheet.pokemon[slotIdx] : null;
  
  const currentLevel = slot ? slot.level : (options.currentLevel || p.level);
  const nature = slot ? (slot.nature || 'Hardy') : 'Hardy';
  const asi = slot ? (slot.asi || {}) : {};
  const evolutionBonus = slot ? (slot.evolutionBonus || {}) : {};
  const hpIncreases = slot ? (slot.hpIncreases || []) : [];

  const { stats, modifiers } = calculateStats(p.stats, currentLevel, nature, asi, evolutionBonus);
  const ac = calculateAC(p.armorClass, currentLevel, modifiers.DES);
  const hp = slot?.hpMax || calculateHP(p.hitPoints, currentLevel, modifiers.CON, hpIncreases);
  
  // Use latest moves from slot if available, otherwise fallback to options
  const activeMoves = slot ? (slot.selectedMoves || []) : (options.selectedMoves || []);

  const typeBadges = p.types.map(t => typeBadgeHTML(t)).join('');
  const speedStr = Object.entries(p.speed || {}).map(([k, v]) => {
    const label = { walk: 'Andar', fly: 'Voar', swim: 'Nadar' };
    return `${v}ft ${label[k] || k}`;
  }).join(' / ');

  const statsHTML = ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'].map(s => `
    <div class="stat-item">
      <div class="stat-label">${s}</div>
      <div class="stat-value">${stats[s] ?? '—'}</div>
      <div class="stat-modifier">${modifiers[s] >= 0 ? '+' : ''}${modifiers[s] ?? 0}</div>
      <div class="stat-bar-wrap">
        <div class="stat-bar-fill" style="width:${statBarWidth(stats[s] ?? 0)}%;background:${getStatColor(s)}"></div>
      </div>
    </div>`).join('');

  const natureOptions = Object.keys(NATURES).map(n => 
    `<option value="${n}" ${nature === n ? 'selected' : ''}>${n}</option>`).join('');

  const asiSectionsHTML = ASI_LEVELS.filter(lvl => currentLevel >= lvl).map(lvl => {
    const levelAsi = asi[lvl] || {};
    // Find which attribute has a point (if any)
    const selectedAttr = Object.keys(levelAsi).find(attr => levelAsi[attr] > 0) || '';
    
    return `
      <div class="asi-row">
        <div class="asi-lvl">Aumento de Atributo — Nível ${lvl}</div>
        <select class="asi-select form-select" data-level="${lvl}">
          <option value="">— Selecione (+1 ponto) —</option>
          ${['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'].map(attr => 
            `<option value="${attr}" ${selectedAttr === attr ? 'selected' : ''}>${attr}</option>`
          ).join('')}
        </select>
      </div>`;
  }).join('');

  const resistHTML = (p.resistances || []).map(t =>
    `<span class="tag resist" style="border-color:${getTypeColor(t.pt || t.en)}40;color:${getTypeColor(t.pt || t.en)}">${t.pt || t.en}</span>`).join('');
  const vulnHTML = (p.vulnerabilities || []).map(t =>
    `<span class="tag vuln" style="border-color:${getTypeColor(t.pt || t.en)}40;color:${getTypeColor(t.pt || t.en)}">${t.pt || t.en}</span>`).join('');
  const immuneHTML = (p.immunities || []).map(t =>
    `<span class="tag immune" style="color:${getTypeColor(t.pt || t.en)}">${t.pt || t.en}</span>`).join('');

  const abilitiesHTML = (p.abilities || []).map(a => `
    <div class="ability-item">
      <div class="ability-name">${a.name}</div>
      <div class="ability-desc">${a.description}</div>
    </div>`).join('');

  const stStr = (p.savingThrows || []).map(s => s.pt || s.en).join(', ') || '—';
  const skillsStr = (p.skills || []).join(', ') || '—';

  return `
    <div class="detail-header" style="--type-color:${typeColor}">
      <img class="detail-sprite" src="${spriteURL(p.number)}" alt="${p.name}"
           onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 120 120%22><text y=%2290%22 font-size=%2290%22>🔮</text></svg>'">
      <div class="detail-header-info">
        <div class="detail-number">#${padNum(p.number)} — ${p.size.pt || p.size.en}</div>
        <div class="detail-name">${p.name}</div>
        <div class="detail-types">${typeBadges}</div>
        <div class="detail-meta">
          <div class="detail-meta-item">
            <strong>Nível</strong> 
            ${sheetMode ? `
              <div class="level-control-mini" style="display:inline-flex; vertical-align:middle; margin-left:5px">
                <button class="level-btn btn-lvl-minus" id="btn-detail-lvl-minus">-</button>
                <span class="level-display" style="min-width:20px; text-align:center">${currentLevel}</span>
                <button class="level-btn btn-lvl-plus" id="btn-detail-lvl-plus">+</button>
              </div>
            ` : currentLevel}
          </div>
          <div class="detail-meta-item"><strong>CR</strong> ${p.cr}</div>
          <div class="detail-meta-item"><strong>Velocidade</strong> ${speedStr}</div>
        </div>
        ${sheetMode ? `<div style="margin-top:8px"><span class="sheet-mode-badge">📋 Ficha do Jogador</span></div>` : ''}
      </div>
      <button class="btn-close" id="btn-close-detail">✕</button>
    </div>

    <div class="detail-body">
      <div class="detail-section">
        <div class="combat-stats">
          <div class="combat-stat">
            <div class="combat-stat-val">${ac}</div>
            <div class="combat-stat-label">Classe de Armadura</div>
          </div>
          <div class="combat-stat">
            ${sheetMode ? 
              `<input type="number" id="hp-max-input" class="hp-inline-input" value="${hp}" title="Clique para editar PV Máximo">` : 
              `<div class="combat-stat-val">${hp}</div>`
            }
            <div class="combat-stat-label">Pontos de Vida (${p.hitDice})</div>
          </div>
          <div class="combat-stat">
            <div class="combat-stat-val">${p.cr}</div>
            <div class="combat-stat-label">CR Base</div>
          </div>
        </div>
      </div>

      ${sheetMode ? `
      <div class="detail-section sheet-controls">
        <div class="detail-section-title">Gerenciar Nivelamento</div>
        <div class="form-group">
          <label class="form-label">Natureza Pokémon</label>
          <select id="nature-select" class="form-select">${natureOptions}</select>
          <div class="nature-effect-hint">
            ${nature !== 'Hardy' && nature !== 'Nimble' ? 
              `<span class="plus">+2 ${NATURES[nature].plus}</span>, <span class="minus">-2 ${NATURES[nature].minus}</span>` : 
              'Sem efeito nos atributos.'}
          </div>
        </div>
        ${asiSectionsHTML ? `
        <div style="margin-top:16px">
          <label class="form-label">Aumentos de Atributo (ASI)</label>
          <div class="asi-list">${asiSectionsHTML}</div>
        </div>` : ''}
      </div>` : ''}

      <div class="detail-section">
        <div class="detail-section-title">Atributos</div>
        <div class="stat-block">
          <div class="stat-block-grid">${statsHTML}</div>
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-section-title">Informações de Combate</div>
        <div style="display:grid;gap:8px;font-size:0.85rem;">
          <div><span style="color:var(--text-muted)">Testes de Resistência:</span> <span style="color:var(--text-primary)">${stStr}</span></div>
          <div><span style="color:var(--text-muted)">Perícias:</span> <span style="color:var(--text-primary)">${skillsStr}</span></div>
          ${resistHTML ? `<div><span style="color:var(--text-muted)">Resistências:</span><div class="tags-row" style="margin-top:4px">${resistHTML}</div></div>` : ''}
          ${vulnHTML ? `<div><span style="color:var(--text-muted)">Vulnerabilidades:</span><div class="tags-row" style="margin-top:4px">${vulnHTML}</div></div>` : ''}
          ${immuneHTML ? `<div><span style="color:var(--text-muted)">Imunidades:</span><div class="tags-row" style="margin-top:4px">${immuneHTML}</div></div>` : ''}
        </div>
      </div>

      ${abilitiesHTML ? `
      <div class="detail-section">
        <div class="detail-section-title">Habilidades</div>
        <div class="ability-list">${abilitiesHTML}</div>
      </div>` : ''}

      <div class="detail-section">
        <div class="detail-section-title">Movimentos</div>
        <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:12px;">Clique em um movimento para ver seus detalhes.</p>
        ${sheetMode ? buildSheetMovesHTML(p, activeMoves, currentLevel, slotIdx) : buildMovesHTML(p)}
        <div id="modal-inline-move"></div>
      </div>

      <div class="detail-actions">
        ${sheetMode
    ? `<button class="btn btn-outline" id="btn-close-detail-footer">Fechar</button>`
    : `<button class="btn btn-primary" id="btn-add-to-sheet">+ Adicionar à Ficha</button>
             <button class="btn btn-outline" id="btn-close-detail-footer">Fechar</button>`
}
      </div>
    </div>`;
}

export function buildMovesHTML(p) {
  let html = '';
  if (p.moves.starting?.length) {
    html += `
      <div class="moves-level-group">
        <div class="moves-level-header">Movimentos Iniciais</div>
        <div class="moves-list">${p.moves.starting.map(m => moveChipHTML(m)).join('')}</div>
      </div>`;
  }
  (p.moves.byLevel || []).forEach(lg => {
    if (!lg.moves?.length) return;
    html += `
      <div class="moves-level-group">
        <div class="moves-level-header">Nível ${lg.level}</div>
        <div class="moves-list">${lg.moves.map(m => moveChipHTML(m)).join('')}</div>
      </div>`;
  });
  if (p.moves.tm?.length) {
    const tmNames = p.moves.tm.map(n => TM_MAP[n] ? `MN${String(n).padStart(2, '0')} - ${TM_MAP[n]}` : `MN${n}`).join(', ');
    html += `
      <div class="moves-level-group">
        <div class="moves-level-header">Movimentos de Máquina (MN)</div>
        <div class="tm-list">${tmNames}</div>
      </div>`;
  }
  return html;
}

export function moveChipHTML(moveName, options = {}) {
  const { action = null, slotIdx } = options;
  const move = state.moveMap[moveName.toLowerCase()];
  const typeColor = move ? getTypeColor(move.type.pt || move.type.en || '') : '#777';
  
  if (action === 'add') {
    return `
      <span class="move-chip selectable add" data-move="${moveName}" data-slot="${slotIdx}" title="Adicionar movimento">
        <span class="action-icon">+</span>${moveName}
      </span>`;
  }
  
  return `<span class="move-chip" data-move="${moveName}" style="border-color:${typeColor}22" title="${move ? (move.type.pt || move.type.en) : ''}">${moveName}</span>`;
}

export function buildSheetMovesHTML(p, selectedMoves, currentLevel, slotIdx) {
  let html = '';
  if (selectedMoves.length > 0) {
    html += `
      <div class="moves-level-group">
        <div class="moves-level-header" style="background:rgba(242,201,76,0.08);color:var(--gold)">
          ⚔️ Movimentos Ativos — ${selectedMoves.length}/4
        </div>
        <div style="padding:var(--gap-md);display:flex;flex-direction:column;gap:10px">`;

    selectedMoves.forEach(moveName => {
      const move = state.moveMap[moveName.toLowerCase()];
      if (!move) {
        html += `
          <div class="active-move-card" data-move="${moveName}">
            <button class="btn-move-action remove" data-move="${moveName}" data-slot="${slotIdx}" title="Remover">✕</button>
            <strong style="color:var(--text-primary)">${moveName}</strong>
          </div>`;
        return;
      }
      const typeColor = getTypeColor(move.type.pt || move.type.en || '');
      const badge = `<span class="type-badge" style="--badge-color:${typeColor}">${move.type.pt || move.type.en || '—'}</span>`;
      html += `
        <div class="active-move-card" data-move="${moveName}" title="Clique para ver detalhes">
          <button class="btn-move-action remove" data-move="${moveName}" data-slot="${slotIdx}" title="Remover movimento">✕</button>
          <div class="active-move-header">
            <span class="active-move-name">${moveName}</span>
            <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
              ${badge}
              <span style="color:var(--gold);font-weight:700;font-size:0.8rem;font-family:var(--font-heading)">PP ${move.pp || '—'}</span>
            </div>
          </div>
          <div class="active-move-meta">
            <span>${move.moveTime.pt || move.moveTime.en || '—'}</span>
            <span>·</span>
            <span>${move.range || '—'}</span>
            <span>·</span>
            <span>${move.movePower.pt || move.movePower.en || '—'}</span>
          </div>
          ${(move.description?.pt || move.description?.en || move.description) ? `<div class="active-move-desc">${move.description.pt || move.description.en || move.description}</div>` : ''}
        </div>`;
    });
    html += `</div></div>`;
  } else {
    html += `<div class="no-results" style="padding:16px 0">Nenhum movimento selecionado nesta ficha.</div>`;
  }

  const available = getAvailableMoves(p, currentLevel);
  const otherMoves = available.known.filter(m => !selectedMoves.includes(m));
  if (otherMoves.length > 0) {
    html += `
      <div class="moves-level-group" style="margin-top:8px">
        <div class="moves-level-header">Outros Movimentos Disponíveis</div>
        <div class="moves-list">
          ${otherMoves.map(m => moveChipHTML(m, { action: 'add', slotIdx })).join('')}
        </div>
      </div>`;
  }
  return html;
}

export function getAvailableMoves(pokemon, currentLevel) {
  const known = [...(pokemon.moves.starting || [])];
  (pokemon.moves.byLevel || []).forEach(lg => {
    if (lg.level <= currentLevel) known.push(...lg.moves);
  });
  const tmMoves = (pokemon.moves.tm || []).map(n => TM_MAP[n]).filter(Boolean);
  return { known: [...new Set(known)], tm: tmMoves };
}
