import { state } from '../core/state.js';
import { getTypeColor, typeBadgeHTML, spriteURL, showToast, formatMod, padNum } from '../core/utils.js';
import { TRAINER_PATHS, SPEC_DESCRIPTIONS, POKESLOTS_BY_LEVEL, TRAINER_SKILLS, TM_MAP, PATH_DESCRIPTIONS, SPEC_ATTR_BONUS, TRAINER_PROGRESSION } from '../core/constants.js';
import { calculateStats, calculateAC, calculateHP } from '../core/pokemon-stats.js';
import { getItemSuggestions } from '../core/data-service.js';
import { openPokemonDetail } from './Pokedex.js';

window.openPokemonDetailFromPokedex = (num) => {
  const p = state.allPokemon.find(pk => pk.number === num);
  if (p) openPokemonDetail(p);
};

export function loadSheets() {
  try {
    state.sheets = JSON.parse(localStorage.getItem('pokemon5e_sheets') || '[]');
    
    // Migration: equipment (strings) -> items (objects)
    let migrated = false;
    state.sheets.forEach(sheet => {
      if (!sheet.items && sheet.equipment) {
        sheet.items = sheet.equipment.map(str => {
          // Simple parser for "5 Pokéballs" or "Potion"
          const match = str.match(/^(\d+)\s+(.+)$/);
          if (match) {
            return { name: match[2], qty: parseInt(match[1]) };
          }
          return { name: str, qty: 1 };
        });
        delete sheet.equipment;
        migrated = true;
      }
      if (!sheet.items) sheet.items = [];
      if (!sheet.pokedex) {
        sheet.pokedex = [];
        migrated = true;
      }
    });
    if (migrated) saveSheets();

  } catch { state.sheets = []; }
}

export function saveSheets() {
  localStorage.setItem('pokemon5e_sheets', JSON.stringify(state.sheets));
}

export function renderSheets(renderWizard) {
  const listView = document.getElementById('sheets-list-view');
  const editorView = document.getElementById('sheet-editor-view');

  if (state.editingSheet !== null) {
    listView.style.display = 'none';
    editorView.classList.add('active');
    renderSheetEditor(renderWizard);
  } else {
    listView.style.display = 'block';
    editorView.classList.remove('active');
    renderSheetList();
  }
}

export function renderSheetList() {
  const grid = document.getElementById('sheets-grid');
  if (!grid) return;

  if (!state.sheets.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-state-icon">📋</div>
        <div class="empty-state-title">Nenhuma ficha encontrada</div>
        <div class="empty-state-text">Crie sua primeira ficha de treinador Pokémon</div>
      </div>`;
    return;
  }

  grid.innerHTML = state.sheets.map((sheet, i) => {
    const pokeballs = Array.from({ length: 6 }, (_, j) => {
      const pokemon = sheet.pokemon?.[j];
      if (pokemon) {
        return `<div class="sheet-mini-sprite">
          <img src="${spriteURL(pokemon.number)}" alt="${pokemon.name}" loading="lazy">
        </div>`;
      }
      return `<div class="sheet-empty-slot">○</div>`;
    }).join('');

    const path = sheet.path || 'Treinador';
    return `
      <div class="sheet-card" data-idx="${i}">
        <div class="sheet-card-actions">
          <button class="btn btn-sm btn-outline btn-icon btn-delete-sheet" data-idx="${i}" title="Excluir">✕</button>
        </div>
        <div class="sheet-card-name">${sheet.name || 'Sem nome'}</div>
        <div class="sheet-card-meta">Nível ${sheet.level || 1} · ${path}</div>
        <div class="sheet-card-pokemon">${pokeballs}</div>
      </div>`;
  }).join('');

  // Add click handlers
  grid.querySelectorAll('.sheet-card').forEach(card => {
    card.onclick = () => openSheetEditor(parseInt(card.dataset.idx));
  });
  grid.querySelectorAll('.btn-delete-sheet').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      deleteSheet(parseInt(btn.dataset.idx));
    };
  });
}

export function openSheetEditor(idx) {
  state.editingSheet = idx;
  // This will be handled by re-rendering from main.js
  window.dispatchEvent(new CustomEvent('render-sheets'));
}

export function newSheet() {
  const sheet = {
    id: Date.now(),
    name: 'Novo Treinador',
    level: 1,
    path: 'Treinador',
    specialization: '',
    attributes: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    skills: [],
    specSkills: [],
    specAttrBonus: null,
    items: [
      { name: 'Pokéballs', qty: 5 },
      { name: 'Potion', qty: 1 },
      { name: 'Pokédex', qty: 1 }
    ],
    money: 1000,
    pokemon: [],
    pokedex: [],
    currentStep: 1
  };
  state.sheets.push(sheet);
  saveSheets();
  state.editingSheet = state.sheets.length - 1;
  window.dispatchEvent(new CustomEvent('render-sheets'));
}

export function deleteSheet(idx) {
  if (!confirm('Excluir esta ficha?')) return;
  state.sheets.splice(idx, 1);
  saveSheets();
  showToast('Ficha excluída');
  renderSheetList();
}

export function closeSheetEditor() {
  state.editingSheet = null;
  window.dispatchEvent(new CustomEvent('render-sheets'));
}

export function renderSheetEditor(renderWizard) {
  const view = document.getElementById('sheet-editor-view');
  const sheet = state.sheets[state.editingSheet];
  if (!sheet) { closeSheetEditor(); return; }

  // Check if wizard is active
  if (sheet.currentStep && sheet.currentStep <= 6) {
    if (renderWizard) renderWizard(sheet, view);
    return;
  }

  const activeTab = state.activeSheetTab || 'resumo';

  const progression = TRAINER_PROGRESSION[sheet.level] || TRAINER_PROGRESSION[1];
  const pokeslots = progression.slots;
  const profBonus = progression.prof;
  const maxCR = progression.maxCR;

  const conMod = Math.floor((sheet.attributes.con - 10) / 2);
  const maxHP = 6 + conMod + (sheet.level - 1) * (4 + conMod);

  // --- Content Generators ---

  const renderResumo = () => {
    const pathOptions = TRAINER_PATHS.map(p =>
      `<option value="${p}" ${sheet.path === p ? 'selected' : ''}>${p}</option>`).join('');
    const isLevel1 = sheet.level < 2;
    const pathContent = isLevel1 
      ? `<div class="form-input" style="background:var(--bg-card); border-color:transparent; padding-left:0; color:var(--text-muted)">Pokémon Trainer <span style="font-size:0.7rem; display:block">(Caminho disponível no nível 2)</span></div>`
      : `<select id="ed-path" class="form-select">${pathOptions}</select>`;

    const specInfo = SPEC_DESCRIPTIONS[sheet.specialization];
    const specHTML = sheet.specialization ? `
      <div class="editor-section">
        <div class="editor-section-title">Especialização</div>
        <div style="padding:10px; background:rgba(242,201,76,0.05); border:1px solid var(--gold-dim); border-radius:var(--r-md)">
          <div style="font-weight:700; color:var(--gold); margin-bottom:5px">${sheet.specialization}</div>
          <div style="font-size:0.75rem; line-height:1.4; color:var(--text-secondary)">
            ${specInfo ? `<strong>Bônus:</strong> ${specInfo.bonus || 'Nenhum'}<br><br><strong>Efeito:</strong> ${specInfo.effect}` : 'Descrição não encontrada.'}
          </div>
        </div>
      </div>` : '';

    // Calculate Cumulative Features
    const cumulativeClassFeatures = [];
    for (let l = 1; l <= sheet.level; l++) {
      const levelFeatures = TRAINER_PROGRESSION[l]?.features || [];
      cumulativeClassFeatures.push(...levelFeatures);
    }
    const uniqueClassFeatures = [...new Set(cumulativeClassFeatures)];

    const pathFeatures = PATH_DESCRIPTIONS[sheet.path]?.features || [];
    const activePathFeatures = pathFeatures.filter(f => f.level <= sheet.level);
    const pathBaseInfo = PATH_DESCRIPTIONS[sheet.path];

    const featuresHTML = `
      <div class="editor-section">
        <div class="editor-section-title">Habilidades do Treinador</div>
        <div style="display:flex; flex-direction:column; gap:15px">
          <div>
            <div style="font-size:0.7rem; color:var(--gold); text-transform:uppercase; letter-spacing:1px; margin-bottom:8px">Geral / Evolução</div>
            <div style="display:flex; flex-wrap:wrap; gap:6px">
              ${uniqueClassFeatures.map(f => `<span class="badge" style="background:rgba(242,201,76,0.1); color:var(--gold); border:1px solid var(--gold-dim); font-size:0.7rem">${f}</span>`).join('')}
            </div>
          </div>
          
          ${sheet.level >= 2 && pathBaseInfo ? `
          <div>
            <div style="font-size:0.7rem; color:var(--gold); text-transform:uppercase; letter-spacing:1px; margin-bottom:10px">Caminho: ${sheet.path}</div>
            <div style="display:flex; flex-direction:column; gap:10px">
              <div style="padding:10px; background:rgba(212,175,55,0.08); border-radius:var(--r-sm); border-left:3px solid var(--gold)">
                <div style="font-weight:700; font-size:0.85rem; color:var(--gold); margin-bottom:4px">Bônus Inicial <span style="color:var(--text-muted); font-weight:400; font-size:0.75rem">· Nível 2</span></div>
                <div style="font-size:0.75rem; color:var(--text-primary); margin-bottom:4px; font-style:italic">${pathBaseInfo.summary}</div>
                <div style="font-size:0.75rem; color:var(--text-secondary); line-height:1.4"><strong>Efeito:</strong> ${pathBaseInfo.bonus}</div>
              </div>
              ${activePathFeatures.map(f => `
                <div style="padding:10px; background:rgba(255,255,255,0.03); border-radius:var(--r-sm); border-left:3px solid var(--gold)">
                  <div style="font-weight:700; font-size:0.85rem; color:var(--text-primary); margin-bottom:4px">${f.name} <span style="color:var(--text-muted); font-weight:400; font-size:0.75rem">· Nível ${f.level}</span></div>
                  <div style="font-size:0.75rem; color:var(--text-secondary); line-height:1.4">${f.description}</div>
                </div>
              `).join('')}
            </div>
          </div>` : ''}
        </div>
      </div>`;

    return `
      <div class="sheet-editor-layout">
        <div style="display:flex; flex-direction:column; gap:var(--gap-lg)">
          <div class="editor-section">
            <div class="editor-section-title" style="display:flex; justify-content:space-between; align-items:center">
              Status Base
              <button class="btn btn-sm btn-outline" id="btn-open-attr-edit" style="padding:2px 8px; font-size:0.65rem">Editar</button>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:15px">
              <div class="attr-box" style="padding:10px">
                <div class="attr-name" style="margin:0; font-size:0.6rem">HP Máximo</div>
                <div style="font-size:1.2rem; font-weight:700; color:var(--gold)">${maxHP}</div>
              </div>
              <div class="attr-box" style="padding:10px">
                <div class="attr-name" style="margin:0; font-size:0.6rem">Proficiência</div>
                <div style="font-size:1.2rem; font-weight:700; color:var(--gold)">+${profBonus}</div>
              </div>
              <div class="attr-box" style="padding:10px">
                <div class="attr-name" style="margin:0; font-size:0.6rem">Max CR</div>
                <div style="font-size:1.2rem; font-weight:700; color:var(--gold)">${maxCR}</div>
              </div>
              <div class="attr-box" style="padding:10px">
                <div class="attr-name" style="margin:0; font-size:0.6rem">Slots Time</div>
                <div style="font-size:1.2rem; font-weight:700; color:var(--gold)">${pokeslots}</div>
              </div>
            </div>
            <div class="attr-grid" style="grid-template-columns: repeat(3, 1fr); gap:8px">
              ${Object.entries(sheet.attributes).map(([k, base]) => {
                let bonus = 0;
                const specBonus = SPEC_ATTR_BONUS[sheet.specialization];
                if (typeof specBonus === 'string' && specBonus === k) bonus = 1;
                else if (Array.isArray(specBonus) && sheet.specAttrBonus === k) bonus = 1;
                const total = base + bonus;
                const mod = Math.floor((total - 10) / 2);
                return `
                  <div class="attr-box" style="padding:8px">
                    <div class="attr-name" style="font-size:0.55rem; margin-bottom:2px">${k.toUpperCase()}</div>
                    <div style="font-size:0.9rem; font-weight:700">
                      ${base}${bonus > 0 ? `<span style="color:var(--gold); font-size:0.7rem; vertical-align:top; margin-left:2px">+${bonus}</span>` : ''}
                    </div>
                    <div class="attr-mod" style="font-size:0.7rem">${mod >= 0 ? '+' : ''}${mod}</div>
                  </div>`;
              }).join('')}
            </div>
          </div>

          <div class="editor-section">
            <div class="editor-section-title">Perícias</div>
            <div style="display:flex; flex-direction:column; gap:4px">
              ${TRAINER_SKILLS.map(s => {
                const isProf = (sheet.skills || []).includes(s.id) || (sheet.specSkills && sheet.specSkills.includes(s.id));
                if (!isProf) return '';
                const attr = getSkillAttr(s.id);
                const attrScore = sheet.attributes[attr] || 10;
                return `<div style="font-size:0.85rem; display:flex; justify-content:space-between">
                    <span>${s.pt}</span>
                    <span style="color:var(--gold)">+${profBonus + Math.floor((attrScore - 10) / 2)}</span>
                  </div>`;
              }).join('')}
            </div>
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:var(--gap-lg)">
          <div class="editor-section">
            <div class="editor-section-title">Configurações</div>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Nome</label>
                <input type="text" id="ed-name" class="form-input" value="${sheet.name}">
              </div>
              <div class="form-group">
                <label class="form-label">Nível</label>
                <div class="level-control-main">
                  <button class="level-btn-main" id="btn-trainer-lvl-minus">-</button>
                  <span class="level-display-main">Nível ${sheet.level}</span>
                  <button class="level-btn-main" id="btn-trainer-lvl-plus">+</button>
                </div>
              </div>
              <div class="form-group" style="grid-column: 1 / -1">
                <label class="form-label">Caminho</label>
                ${pathContent}
              </div>
            </div>
          </div>
          ${specHTML}
          ${featuresHTML}
        </div>
      </div>`;
  };

  const renderItens = () => {
    const suggestions = getItemSuggestions();
    const items = sheet.items || [];

    return `
      <div class="editor-section">
        <div class="editor-section-title">Gerenciar Inventário</div>
        
        <div style="display:flex; gap:10px; margin-bottom:20px">
          <input type="text" id="item-search-input" class="form-input" placeholder="Buscar ou digitar novo item..." list="item-suggestions" style="flex:1">
          <datalist id="item-suggestions">
            ${suggestions.map(s => `<option value="${s}">`).join('')}
          </datalist>
          <button class="btn btn-primary" id="btn-add-item">Adicionar</button>
        </div>

        <div class="inventory-list">
          ${items.length === 0 ? '<div style="text-align:center; padding:20px; color:var(--text-muted)">Nenhum item no inventário</div>' : ''}
          ${items.map((item, idx) => `
            <div class="inventory-row" style="display:flex; align-items:center; gap:15px; padding:12px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--r-md); margin-bottom:8px">
              <div style="flex:1; font-weight:600">${item.name}</div>
              <div class="level-control-mini" style="margin:0">
                <button class="level-btn btn-item-qty" data-idx="${idx}" data-delta="-1">-</button>
                <span style="min-width:30px; text-align:center; font-family:var(--font-heading); font-weight:700">${item.qty}</span>
                <button class="level-btn btn-item-qty" data-idx="${idx}" data-delta="1">+</button>
              </div>
              <button class="btn btn-sm btn-outline btn-icon btn-remove-item" data-idx="${idx}" style="color:var(--danger); border-color:rgba(255,71,87,0.3)">✕</button>
            </div>
          `).join('')}
        </div>

        <div style="margin-top:20px; padding:15px; background:rgba(212,175,55,0.05); border-radius:var(--r-md); border:1px dashed var(--gold-dim)">
          <div style="font-size:0.75rem; color:var(--gold); text-transform:uppercase; letter-spacing:1px; margin-bottom:10px">Dinheiro Disponível</div>
          <div style="display:flex; align-items:center; gap:10px">
            <span style="font-size:1.2rem; font-weight:700; color:var(--gold)">₽</span>
            <input type="number" id="ed-money" class="form-input" value="${sheet.money}" style="max-width:120px; font-weight:700">
          </div>
        </div>
      </div>`;
  };

  const renderPokedexTab = () => {
    const pokedex = sheet.pokedex || [];
    const pokemonList = state.allPokemon;
    const onlyRegistered = state.pokedexOnlyRegistered;

    // Filter list if requested
    const displayList = onlyRegistered 
      ? pokemonList.filter(p => pokedex.includes(p.number))
      : pokemonList;

    return `
      <div class="editor-section">
        <div class="editor-section-title">Minha Pokédex (${pokedex.length}/${pokemonList.length})</div>
        
        <div style="display:flex; flex-wrap:wrap; gap:15px; margin-bottom:20px; align-items:center">
          <div style="flex:1; min-width:200px; display:flex; gap:10px">
            <input type="text" id="pokedex-reg-input" class="form-input" placeholder="Número ou nome do Pokémon visto..." list="all-pokemon-list" style="flex:1">
            <datalist id="all-pokemon-list">
              ${pokemonList.map(p => `<option value="${p.name}">`).join('')}
            </datalist>
            <button class="btn btn-primary" id="btn-reg-pokedex">Registrar</button>
          </div>
          
          <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:0.85rem; color:var(--text-secondary)">
            <input type="checkbox" id="chk-pokedex-filter" ${onlyRegistered ? 'checked' : ''}>
            Mostrar apenas registrados
          </label>
        </div>

        <div class="pokemon-slots-grid" style="grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));">
          ${displayList.length === 0 && onlyRegistered 
            ? '<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-muted)">Nenhum Pokémon registrado ainda.</div>' 
            : displayList.map(p => trainerPokedexCardHTML(p, pokedex.includes(p.number))).join('')}
        </div>
      </div>`;
  };

  const trainerPokedexCardHTML = (p, isRegistered) => {
    if (isRegistered) {
      const typeColor = getTypeColor(p.types[0]?.pt || '');
      return `
        <div class="pokemon-card" style="border-color:${typeColor}33; cursor:pointer" onclick="openPokemonDetailFromPokedex(${p.number})">
          <div class="pokemon-card-num">#${padNum(p.number)}</div>
          <div class="pokemon-card-sprite">
            <img src="${spriteURL(p.number)}" alt="${p.name}" loading="lazy">
          </div>
          <div class="pokemon-card-name">${p.name}</div>
          <div class="pokemon-card-types">
            ${p.types.map(t => typeBadgeHTML(t)).join('')}
          </div>
        </div>`;
    } else {
      return `
        <div class="pokemon-card pokedex-card-unknown">
          <div class="pokemon-card-num">#${padNum(p.number)}</div>
          <div class="pokemon-card-sprite">
            <img src="${spriteURL(p.number)}" alt="???" loading="lazy" style="filter: brightness(0) opacity(0.3)">
          </div>
          <div class="pokemon-card-name">Desconhecido</div>
          <div class="pokemon-card-types" style="visibility:hidden">
            <span class="type-badge">???</span>
          </div>
        </div>`;
    }
  };

  const renderTime = () => {
    const pokemonSlotsHTML = Array.from({ length: pokeslots }, (_, i) => {
      const p = sheet.pokemon?.[i];
      return p ? filledSlotHTML(p, i, sheet) : emptySlotHTML(i);
    }).join('');

    return `
      <div class="editor-section">
        <div class="editor-section-title">Time Pokémon (${sheet.pokemon.length}/${pokeslots})</div>
        <div class="pokemon-slots" id="pokemon-slots-container">
          ${pokemonSlotsHTML}
        </div>
      </div>`;
  };

  const renderNotas = () => {
    return `
      <div class="editor-section">
        <div class="editor-section-title">Notas da Campanha</div>
        <textarea id="ed-notes" class="form-input" placeholder="Anote aqui suas aventuras, missões e lembretes..." 
                  style="width:100%; min-height:400px; line-height:1.6; font-size:0.9rem">${sheet.notes || ''}</textarea>
      </div>`;
  };

  // --- Main Template ---

  view.innerHTML = `
    <div class="sheet-editor-header">
      <button class="sheet-back-btn" id="btn-close-editor">← Voltar</button>
      <div style="flex:1">
        <h2 class="page-title" style="margin:0">${sheet.name}</h2>
        <div class="page-subtitle">Nível ${sheet.level} · ${sheet.path} ${sheet.specialization ? `· ${sheet.specialization}` : ''}</div>
      </div>
      <button class="btn btn-primary" id="btn-save-sheet">Salvar Ficha</button>
    </div>

    <div class="sheet-tabs">
      <div class="sheet-tab ${activeTab === 'resumo' ? 'active' : ''}" data-tab="resumo">Resumo</div>
      <div class="sheet-tab ${activeTab === 'itens' ? 'active' : ''}" data-tab="itens">Itens</div>
      <div class="sheet-tab ${activeTab === 'pokedex' ? 'active' : ''}" data-tab="pokedex">Pokédex</div>
      <div class="sheet-tab ${activeTab === 'time' ? 'active' : ''}" data-tab="time">Time</div>
      <div class="sheet-tab ${activeTab === 'notas' ? 'active' : ''}" data-tab="notas">Notas</div>
    </div>

    <div class="sheet-tab-container">
      ${activeTab === 'resumo' ? renderResumo() : ''}
      ${activeTab === 'itens' ? renderItens() : ''}
      ${activeTab === 'pokedex' ? renderPokedexTab() : ''}
      ${activeTab === 'time' ? renderTime() : ''}
      ${activeTab === 'notas' ? renderNotas() : ''}
    </div>`;

  // --- Event Listeners ---

  document.getElementById('btn-close-editor').onclick = closeSheetEditor;
  document.getElementById('btn-save-sheet').onclick = saveSheetEditor;

  // Tab switching
  view.querySelectorAll('.sheet-tab').forEach(tab => {
    tab.onclick = () => {
      state.activeSheetTab = tab.dataset.tab;
      renderSheetEditor(renderWizard);
    };
  });

  if (activeTab === 'resumo') {
    document.getElementById('btn-open-attr-edit').onclick = openEditAttributesModal;
    
    const nameInput = document.getElementById('ed-name');
    if (nameInput) {
      nameInput.oninput = (e) => {
        sheet.name = e.target.value;
        const title = document.querySelector('#sheet-editor-view .page-title');
        if (title) title.textContent = sheet.name;
      };
    }

    const pathSelect = document.getElementById('ed-path');
    if (pathSelect) {
      pathSelect.onchange = (e) => {
        sheet.path = e.target.value;
        renderSheetEditor(renderWizard);
      };
    }
  }

  if (activeTab === 'itens') {
    const addBtn = document.getElementById('btn-add-item');
    const input = document.getElementById('item-search-input');
    const moneyInput = document.getElementById('ed-money');

    if (addBtn && input) {
      addBtn.onclick = () => {
        const name = input.value.trim();
        if (!name) return;
        const existing = sheet.items.find(i => i.name.toLowerCase() === name.toLowerCase());
        if (existing) {
          existing.qty++;
        } else {
          sheet.items.push({ name, qty: 1 });
        }
        saveSheets();
        renderSheetEditor(renderWizard);
      };
    }

    if (moneyInput) {
      moneyInput.oninput = (e) => {
        sheet.money = parseInt(e.target.value) || 0;
        saveSheets();
      };
    }

    view.querySelectorAll('.btn-item-qty').forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.idx);
        const delta = parseInt(btn.dataset.delta);
        sheet.items[idx].qty = Math.max(1, sheet.items[idx].qty + delta);
        saveSheets();
        renderSheetEditor(renderWizard);
      };
    });

    view.querySelectorAll('.btn-remove-item').forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.idx);
        if (confirm(`Remover "${sheet.items[idx].name}" do inventário?`)) {
          sheet.items.splice(idx, 1);
          saveSheets();
          renderSheetEditor(renderWizard);
        }
      };
    });
  }

  if (activeTab === 'pokedex') {
    const regBtn = document.getElementById('btn-reg-pokedex');
    const input = document.getElementById('pokedex-reg-input');

    if (regBtn && input) {
      regBtn.onclick = () => {
        const val = input.value.trim();
        if (!val) return;

        let p = null;
        if (!isNaN(val)) {
          p = state.allPokemon.find(pk => pk.number === parseInt(val));
        } else {
          p = state.allPokemon.find(pk => pk.name.toLowerCase() === val.toLowerCase());
        }

        if (p) {
          if (!sheet.pokedex.includes(p.number)) {
            sheet.pokedex.push(p.number);
            sheet.pokedex.sort((a, b) => a - b);
            saveSheets();
            renderSheetEditor(renderWizard);
            showToast(`${p.name} registrado na Pokédex!`);
          } else {
            showToast(`${p.name} já está registrado.`);
          }
        } else {
          showToast('Pokémon não encontrado.');
        }
      };
    }

    const filterChk = document.getElementById('chk-pokedex-filter');
    if (filterChk) {
      filterChk.onchange = (e) => {
        state.pokedexOnlyRegistered = e.target.checked;
        renderSheetEditor(renderWizard);
      };
    }
  }

  if (activeTab === 'notas') {
    const notesInput = document.getElementById('ed-notes');
    if (notesInput) {
      notesInput.oninput = (e) => {
        sheet.notes = e.target.value;
      };
    }
  }
}

export function openEditAttributesModal() {
  const sheet = state.sheets[state.editingSheet];
  if (!sheet) return;

  const modal = document.getElementById('edit-attributes-modal');
  const list = document.getElementById('attr-edit-list');
  const labels = { str: 'Força', dex: 'Destreza', con: 'Constituição', int: 'Inteligência', wis: 'Sabedoria', cha: 'Carisma' };

  list.innerHTML = Object.entries(sheet.attributes).map(([k, v]) => `
    <div class="attr-edit-row">
      <label class="form-label" style="margin:0">${labels[k]}</label>
      <div class="attr-edit-controls">
        <button class="btn btn-sm btn-outline btn-attr-mod" data-attr="${k}" data-delta="-1" style="width:32px; height:32px; padding:0">-</button>
        <input type="number" id="attr-input-${k}" class="form-input" value="${v}" style="width:60px; text-align:center; margin:0">
        <button class="btn btn-sm btn-outline btn-attr-mod" data-attr="${k}" data-delta="1" style="width:32px; height:32px; padding:0">+</button>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('.btn-attr-mod').forEach(btn => {
    btn.onclick = () => {
      const input = document.getElementById(`attr-input-${btn.dataset.attr}`);
      const val = parseInt(input.value) || 0;
      input.value = Math.max(1, val + parseInt(btn.dataset.delta));
    };
  });

  document.getElementById('btn-close-attr-modal').onclick = closeEditAttributesModal;
  document.getElementById('btn-cancel-attr').onclick = closeEditAttributesModal;
  document.getElementById('btn-save-attr').onclick = saveTrainerAttributes;

  modal.classList.add('open');
}

export function closeEditAttributesModal() {
  document.getElementById('edit-attributes-modal').classList.remove('open');
}

export function saveTrainerAttributes() {
  const sheet = state.sheets[state.editingSheet];
  if (!sheet) return;

  const attrs = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
  attrs.forEach(a => {
    const input = document.getElementById(`attr-input-${a}`);
    if (input) sheet.attributes[a] = parseInt(input.value) || 10;
  });

  saveSheets();
  closeEditAttributesModal();
  showToast('Atributos atualizados!');
  window.dispatchEvent(new CustomEvent('render-sheets'));
}

export function getSkillAttr(skillId) {
  const mapping = {
    animal_handling: 'wis', insight: 'wis', intimidation: 'cha', investigation: 'int',
    medicine: 'wis', nature: 'int', perception: 'wis', persuasion: 'cha',
    sleight_of_hand: 'dex', stealth: 'dex', survival: 'wis',
    arcana: 'int', history: 'int', religion: 'int', performance: 'cha',
    deception: 'cha', acrobatics: 'dex', athletics: 'str'
  };
  return mapping[skillId] || 'int';
}

export function filledSlotHTML(pokemonSlot, slotIdx, sheet) {
  const p = state.allPokemon.find(pk => pk.number === pokemonSlot.number);
  if (!p) return emptySlotHTML(slotIdx);

  const currentLevel = pokemonSlot.level || p.level;

  // Calculate current stats based on level, nature, ASI
  const { modifiers } = calculateStats(p.stats, currentLevel, pokemonSlot.nature || 'Hardy', pokemonSlot.asi || {}, pokemonSlot.evolutionBonus || {});
  const ac = calculateAC(p.armorClass, currentLevel, modifiers.DES);
  const hp = pokemonSlot.hpMax || calculateHP(p.hitPoints, currentLevel, modifiers.CON, pokemonSlot.hpIncreases || []);

  const available = getAvailableMoves(p, currentLevel);
  const selected = pokemonSlot.selectedMoves || [];
  const typeColor = getTypeColor(p.types[0]?.pt || '');

  const movesHTML = available.known.map(m => {
    const isSelected = selected.includes(m);
    const isDisabled = !isSelected && selected.length >= 4;
    return `<label class="move-checkbox-label ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled-move' : ''}"
               title="${isDisabled ? 'Máximo 4 movimentos' : ''}">
      <input type="checkbox" ${isSelected ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}
             data-move="${m}" data-slot="${slotIdx}" class="slot-move-checkbox">
      ${m}
    </label>`;
  }).join('');

  return `
    <div class="pokemon-slot pokemon-slot-clickable" style="border-color:${typeColor}33"
         data-slot="${slotIdx}" title="Ver ficha do Pokémon">
      <button class="slot-remove-btn" data-slot="${slotIdx}">✕</button>
      <div class="slot-header">
        <img class="slot-sprite" src="${spriteURL(p.number)}" alt="${p.name}" loading="lazy">
        <div class="slot-info">
          <div class="slot-pokemon-name">${p.name}</div>
          <div class="slot-pokemon-types">${p.types.map(t => typeBadgeHTML(t)).join('')}</div>
        </div>
      </div>
      <div class="slot-stats-row">
        <div class="slot-stat-mini"><strong>HP</strong> ${hp}</div>
        <div class="slot-stat-mini"><strong>AC</strong> ${ac}</div>
        <div class="slot-stat-mini"><strong>NAT</strong> ${pokemonSlot.nature || 'Hardy'}</div>
      </div>
      <div class="slot-level-row">
        <span class="slot-level-label">Nível:</span>
        <div class="level-control-mini">
          <button class="level-btn btn-lvl-minus" data-slot="${slotIdx}">-</button>
          <span class="level-display">${currentLevel}</span>
          <button class="level-btn btn-lvl-plus" data-slot="${slotIdx}">+</button>
        </div>
        <span style="font-size:0.72rem;color:var(--text-muted)">/ ${p.cr !== '1/2' ? `CR ${p.cr}` : 'CR ½'}</span>
      </div>
      <div class="slot-moves-title">Movimentos conhecidos (${selected.length}/4)</div>
      <div class="slot-moves-available" id="slot-moves-${slotIdx}">${movesHTML}</div>
    </div>`;
}

export function emptySlotHTML(slotIdx) {
  return `
    <div class="pokemon-slot-empty" data-slot="${slotIdx}">
      <span style="font-size:1.5rem">+</span>
      <span>Adicionar Pokémon</span>
    </div>`;
}

export function getAvailableMoves(pokemon, currentLevel) {
  const known = [...(pokemon.moves.starting || [])];
  (pokemon.moves.byLevel || []).forEach(lg => {
    if (lg.level <= currentLevel) known.push(...lg.moves);
  });
  const tmMoves = (pokemon.moves.tm || []).map(n => TM_MAP[n]).filter(Boolean);
  return { known: [...new Set(known)], tm: tmMoves };
}

export function updateSheetLevel(newLevel) {
  const sheet = state.sheets[state.editingSheet];
  if (!sheet) return;
  sheet.level = parseInt(newLevel) || 1;
  saveSheets();
  window.dispatchEvent(new CustomEvent('render-sheets'));
}

export function updateSlotLevel(slotIdx, newLevel) {
  const sheet = state.sheets[state.editingSheet];
  if (!sheet?.pokemon?.[slotIdx]) return;
  sheet.pokemon[slotIdx].level = parseInt(newLevel) || 1;
  saveSheets();
  
  // Re-render the specific slot to show updated level and recalculated stats (HP/AC)
  const container = document.getElementById('pokemon-slots-container');
  if (container) {
    const slots = container.querySelectorAll('.pokemon-slot, .pokemon-slot-empty');
    if (slots[slotIdx]) {
      const p = sheet.pokemon[slotIdx];
      // We use filledSlotHTML to get the fresh HTML for this slot
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = filledSlotHTML(p, slotIdx, sheet);
      slots[slotIdx].replaceWith(tempDiv.firstElementChild);
    }
  }
}

export function toggleSlotMove(slotIdx, moveName, checked) {
  const sheet = state.sheets[state.editingSheet];
  if (!sheet?.pokemon?.[slotIdx]) return;
  const slot = sheet.pokemon[slotIdx];
  if (!slot.selectedMoves) slot.selectedMoves = [];

  if (checked && slot.selectedMoves.length >= 4) {
    showToast('Máximo 4 movimentos por Pokémon', 'error');
    window.dispatchEvent(new CustomEvent('render-sheets'));
    return;
  }
  if (checked) slot.selectedMoves.push(moveName);
  else slot.selectedMoves = slot.selectedMoves.filter(m => m !== moveName);

  saveSheets();

  const p = state.allPokemon.find(pk => pk.number === slot.number);
  const container = document.getElementById(`slot-moves-${slotIdx}`);
  if (container) {
    container.querySelectorAll('.move-checkbox-label').forEach(label => {
      const input = label.querySelector('input');
      const name = label.textContent.trim();
      const sel = slot.selectedMoves.includes(name);
      const dis = !sel && slot.selectedMoves.length >= 4;
      label.classList.toggle('selected', sel);
      input.checked = sel;
      input.disabled = dis;
    });
  }

  const title = document.querySelector(`.pokemon-slot[data-slot="${slotIdx}"] .slot-moves-title`);
  if (title) title.textContent = `Movimentos conhecidos (${slot.selectedMoves.length}/4)`;
}

export function removePokemonFromSlot(slotIdx) {
  const sheet = state.sheets[state.editingSheet];
  if (!sheet) return;
  sheet.pokemon.splice(slotIdx, 1);
  saveSheets();
  window.dispatchEvent(new CustomEvent('render-sheets'));
}

export function openPokedexForSheet(slotIdx) {
  state.pickingForSlot = slotIdx;
  window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'pokedex' }));
  showToast('Escolha um Pokémon para adicionar à ficha');
}

export function saveSheetEditor() {
  const sheet = state.sheets[state.editingSheet];
  if (!sheet) return;
  const newName = document.getElementById('ed-name')?.value || 'Treinador';
  const newPath = document.getElementById('ed-path')?.value || sheet.path;

  sheet.name = newName;
  sheet.path = newPath;

  saveSheets();
  showToast('Ficha salva com sucesso!');
  window.dispatchEvent(new CustomEvent('render-sheets'));
}

export function openAddToSheet(pokemon) {
  state.addToSheetTargetPokemon = pokemon;
  const modal = document.getElementById('add-to-sheet-modal');
  const list = document.getElementById('sheet-options-list');

  if (!state.sheets.length) {
    list.innerHTML = `
      <div class="empty-state" style="padding:24px">
        <div class="empty-state-text">Nenhuma ficha disponível.</div>
      </div>`;
  } else {
    list.innerHTML = state.sheets.map((s, i) => {
      const slots = POKESLOTS_BY_LEVEL[s.level || 1] || 3;
      const used = s.pokemon?.length || 0;
      const full = used >= slots;
      return `
        <div class="sheet-option ${full ? 'opacity-50' : ''}" 
             style="${full ? 'opacity:0.5;cursor:not-allowed' : ''}"
             data-idx="${i}" data-full="${full}">
          <div>
            <div class="sheet-option-name">${s.name || 'Sem nome'}</div>
            <div class="sheet-option-meta">Nível ${s.level || 1} · ${used}/${slots} Pokémon${full ? ' · Cheio' : ''}</div>
          </div>
          ${!full ? '<span style="color:var(--gold)">→</span>' : '<span style="color:var(--text-muted)">Cheio</span>'}
        </div>`;
    }).join('');
    
    list.querySelectorAll('.sheet-option').forEach(opt => {
      opt.onclick = () => {
        if (opt.dataset.full === 'false') addPokemonToSheet(parseInt(opt.dataset.idx));
      };
    });
  }

  modal.classList.add('open');
}

export function closeAddToSheetModal() {
  document.getElementById('add-to-sheet-modal').classList.remove('open');
  state.addToSheetTargetPokemon = null;
}

export function addPokemonToSheet(sheetIdx) {
  const p = state.addToSheetTargetPokemon;
  if (!p) return;
  const sheet = state.sheets[sheetIdx];
  if (!sheet) return;

  if (!sheet.pokemon) sheet.pokemon = [];
  const slots = POKESLOTS_BY_LEVEL[sheet.level || 1] || 3;
  if (sheet.pokemon.length >= slots) {
    showToast('Time está cheio!', 'error');
    return;
  }

  sheet.pokemon.push({
    number: p.number,
    name: p.name,
    level: p.level || 1,
    nature: 'Hardy',
    hpMax: p.hitPoints,
    hpIncreases: [],
    asi: {},
    evolutionBonus: {},
    selectedMoves: p.moves.starting ? p.moves.starting.slice(0, 4) : []
  });
  saveSheets();
  closeAddToSheetModal();
  window.dispatchEvent(new CustomEvent('close-pokemon-detail'));
  showToast(`${p.name} adicionado à ficha "${sheet.name || 'Sem nome'}"!`);
}

export function newSheetAndAddPokemon() {
  const p = state.addToSheetTargetPokemon;
  if (!p) return;
  const sheet = {
    id: Date.now(),
    name: 'Novo Treinador',
    level: 1,
    path: 'Treinador',
    specialization: '',
    attributes: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    skills: [],
    specSkills: [],
    specAttrBonus: null,
    items: [
      { name: 'Pokéballs', qty: 5 },
      { name: 'Potion', qty: 1 },
      { name: 'Pokédex', qty: 1 }
    ],
    money: 1000,
    pokemon: [{
      number: p.number,
      name: p.name,
      level: p.level,
      selectedMoves: p.moves.starting ? p.moves.starting.slice(0, 4) : []
    }],
    pokedex: [],
    currentStep: 1
  };
  state.sheets.push(sheet);
  saveSheets();
  closeAddToSheetModal();
  window.dispatchEvent(new CustomEvent('close-pokemon-detail'));
  state.editingSheet = state.sheets.length - 1;
  window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'fichas' }));
  showToast(`Ficha criada com ${p.name}!`);
}

export function applySpecBonuses(sheet) {
  const specName = sheet.specialization;
  const bonus = SPEC_ATTR_BONUS[specName];
  sheet.specSkills = [];
  if (typeof bonus === 'string') {
    sheet.attributes[bonus] += 1;
  } else if (sheet.specAttrBonus) {
    sheet.attributes[sheet.specAttrBonus] += 1;
  }

  if (specName === 'Bird Keeper') sheet.specSkills = ['perception'];
  if (specName === 'Bug Maniac') sheet.specSkills = ['nature'];
  if (specName === 'Picnicker') sheet.specSkills = ['survival'];
  if (specName === 'Gardener') sheet.specSkills = ['nature'];
  if (specName === 'Mystic') sheet.specSkills = ['arcana'];
  if (specName === 'Detective') sheet.specSkills = ['investigation'];
  if (specName === 'Ruin Maniac') sheet.specSkills = ['history'];
  if (specName === 'Punk') sheet.specSkills = ['intimidation'];
  if (specName === 'Fairy Tale Expert') sheet.specSkills = ['religion'];
  if (specName === 'Ninja') sheet.specSkills = ['stealth'];
  if (specName === 'Actor') sheet.specSkills = ['performance', 'deception'];
  if (specName === 'Burglar') sheet.specSkills = ['stealth', 'sleight_of_hand'];
  if (specName === 'Bodybuilder') sheet.specSkills = ['acrobatics', 'athletics'];
  if (specName === 'Poké Maniac') sheet.specSkills = ['history', 'insight'];
  if (specName === 'Camper') sheet.specSkills = ['nature', 'survival'];
  if (specName === 'Medium') sheet.specSkills = ['medicine', 'religion'];
  if (specName === 'Hex Maniac') sheet.specSkills = ['arcana', 'intimidation'];
  if (specName === 'Beauty') sheet.specSkills = ['persuasion', 'animal_handling'];
}
