import { state } from './core/state.js';
import { loadData, populateFilters } from './core/data-service.js';
import { setupNavigation, navigateTo, getPageFromHash } from './core/navigation.js';
import { showToast } from './core/utils.js';
import { renderPokedex, setupPokedexFilters, openPokemonDetail, closePokemonDetail, filterPokemonList } from './components/Pokedex.js';
import { renderMoves, setupMoveFilters, closeMovePanel } from './components/Moves.js';
import { renderRules, setupRulesSearch, toggleRulesNav } from './components/Rules.js';
import { loadSheets, saveSheets, renderSheets, newSheet, closeSheetEditor, openAddToSheet, closeAddToSheetModal, newSheetAndAddPokemon, applySpecBonuses, toggleSlotMove, removePokemonFromSlot, openPokedexForSheet, updateSlotLevel, updateSheetLevel } from './components/Sheets.js';
import { renderWizard, selectStarter } from './components/Wizard.js';
import { renderEncounters } from './components/Encounters.js';
import { renderMap } from './components/Map.js';

// Global access for onclick handlers in HTML (while we refactor them)
window.newSheet = newSheet;
window.closeSheetEditor = closeSheetEditor;
window.closePokemonDetail = closePokemonDetail;
window.closeMovePanel = closeMovePanel;
window.closeAddToSheetModal = closeAddToSheetModal;
window.newSheetAndAddPokemon = newSheetAndAddPokemon;
window.toggleRulesNav = toggleRulesNav;
window.selectStarter = selectStarter;

async function init() {
  try {
    await loadData();
    loadSheets();
    populateFilters();
    
    setupNavigation((page, updateHash) => navigateTo(page, {
      updateHash,
      renderPokedex,
      renderMoves,
      renderRules,
      renderEncounters,
      renderMap,
      renderSheets: () => renderSheets(renderWizard)
    }));

    setupEvents();

    const initialPage = getPageFromHash() || 'fichas';
    navigateTo(initialPage, {
      renderPokedex,
      renderMoves,
      renderRules,
      renderEncounters,
      renderMap,
      renderSheets: () => renderSheets(renderWizard)
    });

    document.getElementById('loading-overlay').classList.add('hidden');
  } catch (err) {
    console.error('Error loading data:', err);
    document.getElementById('loading-overlay').innerHTML = `
      <div style="text-align:center;padding:32px;">
        <div style="font-size:2rem;margin-bottom:16px;">⚠️</div>
        <div style="font-family:var(--font-heading);color:var(--gold);margin-bottom:8px;">Erro ao carregar dados</div>
        <div style="color:var(--text-secondary);font-size:0.875rem;margin-bottom:16px;">
          Abra o aplicativo através de um servidor local.<br>
          Execute: <code style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:4px;">node server.js</code><br>
          Depois acesse: <code style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:4px;">http://localhost:3000</code>
        </div>
        <div style="color:var(--text-muted);font-size:0.75rem;">${err.message}</div>
      </div>
    `;
  }
}

function setupEvents() {
  // Mobile Sidebar Toggle
  document.getElementById('mobile-sidebar-toggle')?.addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('open');
  });

  // Modal Backdrop Clicks
  document.getElementById('pokemon-modal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closePokemonDetail();
  });
  document.getElementById('add-to-sheet-modal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeAddToSheetModal();
  });
  document.getElementById('panel-backdrop')?.addEventListener('click', closeMovePanel);

  // Esc key closes modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePokemonDetail();
      closeMovePanel();
      closeAddToSheetModal();
    }
  });

  // Pokedex click - intercept for pick mode before normal handler
  document.getElementById('pokemon-grid')?.addEventListener('click', (e) => {
    if (state.pickingForSlot === undefined || state.pickingForSlot === null) return;
    const card = e.target.closest('.pokemon-card');
    if (!card) return;
    const filtered = filterPokemonList();
    const idx = Array.from(card.parentNode.children).indexOf(card);
    const p = filtered[idx];
    if (p) {
      e.stopImmediatePropagation();
      handlePick(p);
    }
  }, true);

  setupPokedexFilters();
  setupMoveFilters();
  setupRulesSearch();

  // Custom Events for cross-module communication
  window.addEventListener('open-add-to-sheet', (e) => openAddToSheet(e.detail));
  window.addEventListener('pokedex-pick', (e) => handlePick(e.detail));
  window.addEventListener('render-sheets', () => renderSheets(renderWizard));
  window.addEventListener('save-sheets', () => saveSheets());
  window.addEventListener('navigate-to', (e) => navigateTo(e.detail, {
    renderPokedex, renderMoves, renderRules, renderEncounters, renderMap, renderSheets: () => renderSheets(renderWizard)
  }));
  window.addEventListener('close-pokemon-detail', () => closePokemonDetail());
  window.addEventListener('finalize-wizard', (e) => {
    const sheet = e.detail;
    applySpecBonuses(sheet);
    sheet.currentStep = 8;
    saveSheets();
    renderSheets(renderWizard);
    showToast('Treinador e Pokémon Inicial prontos!');
  });

  // Delegate clicks for dynamic elements in Sheets
  document.addEventListener('click', (e) => {
    // 1. Slot move checkbox
    if (e.target.classList.contains('slot-move-checkbox')) {
      const slotIdx = parseInt(e.target.dataset.slot);
      const moveName = e.target.dataset.move;
      toggleSlotMove(slotIdx, moveName, e.target.checked);
      return;
    }
    // 2. Remove pokemon from slot
    if (e.target.classList.contains('slot-remove-btn')) {
      removePokemonFromSlot(parseInt(e.target.dataset.slot));
      return;
    }
    // 3. Level buttons (Mini control in slot)
    if (e.target.classList.contains('btn-lvl-plus')) {
      const slotIdx = parseInt(e.target.dataset.slot);
      const sheet = state.sheets[state.editingSheet];
      if (sheet?.pokemon?.[slotIdx]) {
        const newLvl = Math.min(20, (sheet.pokemon[slotIdx].level || 1) + 1);
        updateSlotLevel(slotIdx, newLvl);
      }
      return;
    }
    if (e.target.classList.contains('btn-lvl-minus')) {
      const slotIdx = parseInt(e.target.dataset.slot);
      const sheet = state.sheets[state.editingSheet];
      if (sheet?.pokemon?.[slotIdx]) {
        const newLvl = Math.max(1, (sheet.pokemon[slotIdx].level || 1) - 1);
        updateSlotLevel(slotIdx, newLvl);
      }
      return;
    }
    // 4. Trainer Level buttons
    if (e.target.id === 'btn-trainer-lvl-plus') {
      const sheet = state.sheets[state.editingSheet];
      if (sheet) updateSheetLevel(Math.min(20, sheet.level + 1));
      return;
    }
    if (e.target.id === 'btn-trainer-lvl-minus') {
      const sheet = state.sheets[state.editingSheet];
      if (sheet) updateSheetLevel(Math.max(1, sheet.level - 1));
      return;
    }
    // 5. Open pokedex for empty slot
    const emptySlot = e.target.closest('.pokemon-slot-empty');
    if (emptySlot) {
      const slotIdx = parseInt(emptySlot.dataset.slot);
      openPokedexForSheet(slotIdx);
      return;
    }
    // 6. Open detail for filled slot
    const filledSlot = e.target.closest('.pokemon-slot-clickable');
    if (filledSlot && 
        !e.target.closest('.level-control-mini') && 
        !e.target.closest('.slot-remove-btn') && 
        !e.target.closest('.move-checkbox-label')) {
      const slotIdx = parseInt(filledSlot.dataset.slot);
      openPokemonDetailFromSheet(slotIdx);
    }
  });

  document.addEventListener('change', (e) => {
    // Slot level input
    if (e.target.classList.contains('slot-level-input')) {
      updateSlotLevel(parseInt(e.target.dataset.slot), e.target.value);
    }
  });
}

function openPokemonDetailFromSheet(slotIdx) {
  const sheet = state.sheets[state.editingSheet];
  if (!sheet || !sheet.pokemon[slotIdx]) return;
  
  const slot = sheet.pokemon[slotIdx];
  const p = state.allPokemon.find(pk => pk.number === slot.number);
  if (!p) return;

  openPokemonDetail(p, {
    sheetMode: true,
    slotIdx: slotIdx,
    selectedMoves: slot.selectedMoves || [],
    currentLevel: slot.level || p.level
  });
}

function handlePick(pokemon) {
  const slotIdx = state.pickingForSlot;
  if (slotIdx === undefined || slotIdx === null) return;

  const sheet = state.sheets[state.editingSheet];
  if (!sheet) { state.pickingForSlot = null; return; }

  if (!sheet.pokemon) sheet.pokemon = [];
  
  sheet.pokemon[slotIdx] = {
    number: pokemon.number,
    name: pokemon.name,
    level: pokemon.level || 1,
    nature: 'Hardy',
    hpMax: pokemon.hitPoints,
    hpIncreases: [],
    asi: {},
    evolutionBonus: {},
    selectedMoves: pokemon.moves.starting ? pokemon.moves.starting.slice(0, 4) : []
  };
  saveSheets();
  state.pickingForSlot = null;
  showToast(`${pokemon.name} adicionado ao time!`);
  navigateTo('fichas', {
    renderSheets: () => renderSheets(renderWizard)
  });
}

// Start the app
init();
