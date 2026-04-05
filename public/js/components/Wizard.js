import { state } from '../core/state.js';
import { getTypeColor, showToast, spriteURL } from '../core/utils.js';
import { TRAINER_PATHS, PATH_DESCRIPTIONS, TRAINER_SKILLS, SPEC_DESCRIPTIONS, SPEC_ATTR_BONUS, PACK_OPTIONS } from '../core/constants.js';

export function renderWizard(sheet, container) {
  const steps = [
    { n: 1, label: 'Atributos' },
    { n: 2, label: 'Perícias' },
    { n: 3, label: 'Especialização' },
    { n: 4, label: 'Equipamento' },
    { n: 5, label: 'Pokémon Inicial' },
    { n: 6, label: 'Revisão' }
  ];

  const progressHTML = steps.map(s => `
    <div class="wizard-step ${sheet.currentStep === s.n ? 'active' : (sheet.currentStep > s.n ? 'completed' : '')}">
      ${sheet.currentStep > s.n ? '✓' : s.n}
    </div>`).join('');

  container.innerHTML = `
    <div class="wizard-container">
      <div class="wizard-header">
        <h2 class="page-title">Criação de Treinador</h2>
        <p class="page-subtitle">Passo ${sheet.currentStep} de 6: ${steps[sheet.currentStep - 1].label}</p>
      </div>
      <div class="wizard-progress">${progressHTML}</div>
      <div id="wizard-step-content"></div>
      <div class="wizard-footer">
        <button class="btn btn-outline" id="btn-wiz-back" ${sheet.currentStep === 1 ? 'disabled' : ''}>Voltar</button>
        <button class="btn btn-primary" id="btn-wiz-next">${sheet.currentStep === 6 ? 'Finalizar' : 'Próximo'}</button>
      </div>
    </div>`;

  document.getElementById('btn-wiz-back').onclick = wizardBack;
  document.getElementById('btn-wiz-next').onclick = wizardNext;

  renderWizardStep(sheet, document.getElementById('wizard-step-content'));
}

export function renderWizardStep(sheet, stepContent) {
  switch (sheet.currentStep) {
    case 1: renderStep2(sheet, stepContent); break; // Attributes
    case 2: renderStep3(sheet, stepContent); break; // Skills
    case 3: renderStep4(sheet, stepContent); break; // Specialization
    case 4: renderStep5(sheet, stepContent); break; // Equipment
    case 5: renderStep7(sheet, stepContent); break; // Starter Pokemon
    case 6: renderStep6(sheet, stepContent); break; // Review
  }
}

function renderStep1(sheet, el) {
  // This step is removed as per requirements (Trainer Path chosen at level 2)
  sheet.currentStep = 1;
  renderStep2(sheet, el);
}

function renderStep2(sheet, el) {
  const attrs = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
  const labels = { str: 'FOR', dex: 'DES', con: 'CON', int: 'INT', wis: 'SAB', cha: 'CAR' };

  el.innerHTML = `
    <div class="editor-section">
      <div class="form-group" style="margin-bottom:20px">
        <label class="form-label">Nome do Treinador</label>
        <input type="text" id="wiz-name" class="form-input" value="${sheet.name}" placeholder="Ex: Ash Ketchum">
      </div>
      <p style="margin-bottom:20px; font-size:0.9rem; color:var(--text-secondary)">
        Defina seus atributos iniciais. O valor base é 10. Você pode ajustá-los livremente.
      </p>
      <div class="attr-grid">
        ${attrs.map(a => {
    const val = sheet.attributes[a];
    const mod = Math.floor((val - 10) / 2);
    return `
            <div class="attr-box">
              <div class="attr-name">${labels[a]}</div>
              <div class="attr-value-wrap">
                <button class="attr-btn btn-attr-minus" data-attr="${a}">-</button>
                <div class="attr-score">${val}</div>
                <button class="attr-btn btn-attr-plus" data-attr="${a}">+</button>
              </div>
              <div class="attr-mod">${mod >= 0 ? '+' : ''}${mod}</div>
            </div>`;
  }).join('')}
      </div>
      <div style="margin-top:30px; text-align:center">
         <div class="form-label">Pontos de Vida Estimados</div>
         <div style="font-size:1.5rem; font-weight:700; color:var(--gold)">
            ${6 + Math.floor((sheet.attributes.con - 10) / 2) + (sheet.level - 1) * (4 + Math.floor((sheet.attributes.con - 10) / 2))} PV
         </div>
      </div>
    </div>`;

  const nameInput = document.getElementById('wiz-name');
  nameInput.onchange = () => updateWizField('name', nameInput.value);

  el.querySelectorAll('.btn-attr-minus').forEach(btn => {
    btn.onclick = () => updateAttr(btn.dataset.attr, -1);
  });
  el.querySelectorAll('.btn-attr-plus').forEach(btn => {
    btn.onclick = () => updateAttr(btn.dataset.attr, 1);
  });
}

function renderStep3(sheet, el) {
  const trainerSkills = TRAINER_SKILLS.slice(0, 11);

  el.innerHTML = `
    <div class="editor-section">
      <p style="margin-bottom:20px; font-size:0.9rem; color:var(--text-secondary)">
        Escolha 2 perícias iniciais da classe Pokémon Trainer.
      </p>
      <div class="skill-selection-grid">
        ${trainerSkills.map(s => `
          <div class="skill-checkbox-item ${sheet.skills.includes(s.id) ? 'active' : ''}" data-skill="${s.id}">
            <input type="checkbox" ${sheet.skills.includes(s.id) ? 'checked' : ''}>
            <span>${s.pt}</span>
          </div>`).join('')}
      </div>
      <div style="margin-top:20px; text-align:right; font-size:0.85rem; color:${sheet.skills.length === 2 ? 'var(--gold)' : 'var(--text-dim)'}">
        Selecionadas: ${sheet.skills.length} / 2
      </div>
    </div>`;

  el.querySelectorAll('.skill-checkbox-item').forEach(item => {
    item.onclick = () => toggleSkill(item.dataset.skill);
  });
}

function renderStep4(sheet, el) {
  const specs = Object.keys(SPEC_DESCRIPTIONS);
  const currentSpec = sheet.specialization || specs[0];
  const desc = SPEC_DESCRIPTIONS[currentSpec];

  el.innerHTML = `
    <div class="editor-section wizard-layout">
      <!-- Mobile selection -->
      <div class="mobile-only" style="margin-bottom: 20px">
        <label class="form-label">Escolha sua Especialização</label>
        <select id="wiz-spec-select" class="form-select">
          ${specs.map(s => `<option value="${s}" ${currentSpec === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </div>

      <!-- Desktop selection -->
      <div class="spec-selection-list desktop-only">
        ${specs.map(s => `
          <div class="spec-item ${currentSpec === s ? 'active' : ''}" data-spec="${s}">
            ${s}
          </div>`).join('')}
      </div>

      <div class="spec-detail">
        <h3 style="color:var(--gold); margin-bottom:10px">${currentSpec}</h3>
        ${desc.type ? `<div class="type-badge" style="--badge-color:${getTypeColor(desc.type)}; margin-bottom:15px">${desc.type}</div>` : ''}
        <div class="option-info-card">
          ${desc.bonus ? `<div style="margin-bottom:10px"><span class="option-info-label">Bônus:</span> ${desc.bonus}</div>` : ''}
          <div><span class="option-info-label">Efeito:</span> ${desc.effect}</div>
        </div>
        
        <div id="spec-choice-container"></div>
      </div>
    </div>`;

  const specSelect = document.getElementById('wiz-spec-select');
  if (specSelect) {
    specSelect.onchange = () => {
      updateWizField('specialization', specSelect.value);
      window.dispatchEvent(new CustomEvent('render-sheets'));
    };
  }

  el.querySelectorAll('.spec-item').forEach(item => {
    item.onclick = () => {
      updateWizField('specialization', item.dataset.spec);
      window.dispatchEvent(new CustomEvent('render-sheets'));
    };
  });

  const choiceContainer = document.getElementById('spec-choice-container');
  const choiceHTML = renderSpecChoice(sheet, currentSpec);
  if (choiceHTML) {
    choiceContainer.innerHTML = choiceHTML;
    choiceContainer.querySelectorAll('.btn-spec-attr').forEach(btn => {
      btn.onclick = () => {
        updateWizField('specAttrBonus', btn.dataset.attr);
        window.dispatchEvent(new CustomEvent('render-sheets'));
      };
    });
  }
}

function renderSpecChoice(sheet, spec) {
  const choice = SPEC_ATTR_BONUS[spec];
  if (!Array.isArray(choice)) return '';

  const labels = { str: 'Força', dex: 'Destreza', con: 'Constituição', int: 'Inteligência', wis: 'Sabedoria', cha: 'Carisma' };

  return `
    <div style="margin-top:20px">
      <label class="form-label">Escolha o Atributo para o Bônus +1</label>
      <div style="display:flex; gap:10px; margin-top:8px; flex-wrap:wrap">
        ${choice.map(a => `
          <button class="btn btn-sm btn-spec-attr ${sheet.specAttrBonus === a ? 'btn-primary' : 'btn-outline'}" 
                  data-attr="${a}">
            ${labels[a]}
          </button>`).join('')}
      </div>
    </div>`;
}

function renderStep5(sheet, el) {
  el.innerHTML = `
    <div class="editor-section">
      <h4 class="editor-section-title">Escolha seu Pacote de Equipamento</h4>
      <div class="pack-grid">
        ${PACK_OPTIONS.map(p => {
    const active = sheet.equipment.includes(p.name);
    return `
            <div class="pack-card ${active ? 'active' : ''}" data-pack="${p.name}">
              <div class="pack-card-name">${p.name}</div>
              <div class="pack-card-items">${p.items.join(', ')}</div>
            </div>`;
  }).join('')}
      </div>
      
      <div style="margin-top:30px">
        <h4 class="editor-section-title">Outros Equipamentos Iniciais</h4>
        <div style="display:flex; gap:10px; flex-wrap:wrap">
          <span class="type-badge" style="--badge-color:#777">5 Pokéballs</span>
          <span class="type-badge" style="--badge-color:#777">1 Potion</span>
          <span class="type-badge" style="--badge-color:#777">Pokédex</span>
          <span class="type-badge" style="--badge-color:#777">Starter Pokémon</span>
        </div>
      </div>

      <div style="margin-top:30px">
        <h4 class="editor-section-title">Dinheiro Inicial</h4>
        <div style="display:flex; align-items:center; gap:20px">
          <div style="font-size:1.5rem; font-weight:700; color:var(--gold)">₽ ${sheet.money}</div>
          <button class="btn btn-outline btn-sm" id="btn-roll-money">🎲 Rolar Dinheiro (1000 + 10x4d4)</button>
        </div>
      </div>
    </div>`;

  el.querySelectorAll('.pack-card').forEach(card => {
    card.onclick = () => selectPack(card.dataset.pack);
  });
  document.getElementById('btn-roll-money').onclick = rollMoney;
}

function renderStep6(sheet, el) {
  el.innerHTML = `
    <div class="editor-section">
      <div class="summary-grid">
        <div>
          <div class="summary-section">
            <div class="summary-label">Nome</div>
            <div class="summary-value">${sheet.name}</div>
          </div>
          <div class="summary-section">
            <div class="summary-label">Nível e Classe</div>
            <div class="summary-value">Nível ${sheet.level} — Pokémon Trainer</div>
          </div>
          <div class="summary-section">
            <div class="summary-label">Especialização</div>
            <div class="summary-value">${sheet.specialization || 'Nenhuma'}</div>
          </div>
        </div>
        <div>
          <div class="summary-section">
            <div class="summary-label">Atributos</div>
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:5px">
               ${Object.entries(sheet.attributes).map(([k, v]) => `
                 <div style="font-size:0.8rem"><strong>${k.toUpperCase()}:</strong> ${v}</div>
               `).join('')}
            </div>
          </div>
          <div class="summary-section">
            <div class="summary-label">Perícias</div>
            <div style="font-size:0.85rem">${sheet.skills.map(s => TRAINER_SKILLS.find(ts => ts.id === s).pt).join(', ')}</div>
          </div>
          <div class="summary-section">
            <div class="summary-label">Pokémon Inicial</div>
            <div class="summary-value">${sheet.pokemon[0] ? sheet.pokemon[0].name : 'Nenhum'}</div>
          </div>
          <div class="summary-section">
            <div class="summary-label">Dinheiro</div>
            <div class="summary-value">₽ ${sheet.money}</div>
          </div>
        </div>
      </div>
      <div style="margin-top:20px; padding:15px; background:rgba(242,201,76,0.05); border:1px solid var(--gold-dim); border-radius:var(--r-md); font-size:0.9rem">
        Tudo pronto! Clique em <strong>Finalizar</strong> para criar sua ficha e começar sua jornada. O seu <strong>Trainer Path</strong> será escolhido ao atingir o nível 2.
      </div>
    </div>`;
}

function renderStep7(sheet, el) {
  const starters = state.allPokemon.filter(p => p.cr === '1/2');

  const currentStarter = sheet.pokemon[0];

  el.innerHTML = `
    <div class="editor-section">
      <p style="margin-bottom:20px; font-size:0.9rem; color:var(--text-secondary)">
        Todo treinador começa com um Pokémon de CR 1/2. Este Pokémon começa com <strong>Bond Level +1</strong>.
      </p>
      
      <div class="toolbar" style="margin-bottom:20px">
        <input type="text" id="starter-search" class="search-input" placeholder="Buscar Pokémon inicial...">
      </div>

      <div id="starter-list" class="pokemon-grid" style="grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); max-height:400px; overflow-y:auto; padding:10px">
        ${renderStarterListHTML(starters, currentStarter)}
      </div>
    </div>`;

  const searchInput = document.getElementById('starter-search');
  searchInput.oninput = () => filterStarters(searchInput.value);

  // Initial click handlers for the rendered list
  el.querySelectorAll('.pokemon-card').forEach(card => {
    card.onclick = () => selectStarter(card.dataset.number);
  });
}

function renderStarterListHTML(list, current) {
  return list.map(p => `
    <div class="pokemon-card ${current && current.number === p.number ? 'selected' : ''}" 
         data-number="${p.number}" 
         style="padding:10px; cursor:pointer; ${current && current.number === p.number ? 'border-color:var(--gold); background:rgba(242,201,76,0.05)' : ''}">
      <img src="${spriteURL(p.number)}" style="width:60px; height:60px; margin:0 auto 8px; display:block">
      <div style="text-align:center; font-size:0.8rem; font-weight:700">${p.name}</div>
      <div style="text-align:center; font-size:0.7rem; color:var(--text-muted)">CR ${p.cr}</div>
    </div>`).join('');
}

function filterStarters(query) {
  const q = query.toLowerCase();
  const starters = state.allPokemon.filter(p => {
    const isStarter = (p.cr === '1/2');
    return isStarter && p.name.toLowerCase().includes(q);
  });
  const sheet = state.sheets[state.editingSheet];
  const listEl = document.getElementById('starter-list');
  listEl.innerHTML = renderStarterListHTML(starters, sheet.pokemon[0]);
  listEl.querySelectorAll('.pokemon-card').forEach(card => {
    card.onclick = () => selectStarter(card.dataset.number);
  });
}

export function selectStarter(number) {
  const sheet = state.sheets[state.editingSheet];
  const n = parseInt(number);
  const p = state.allPokemon.find(pk => pk.number === n);
  if (!p) return;

  sheet.pokemon = [{
    number: p.number,
    name: p.name,
    level: p.level || 1,
    nature: 'Hardy',
    hpMax: null,
    hpIncreases: [],
    asi: {},
    evolutionBonus: {},
    bond: 1,
    selectedMoves: p.moves.starting ? p.moves.starting.slice(0, 4) : []
  }];

  window.dispatchEvent(new CustomEvent('save-sheets'));
  window.dispatchEvent(new CustomEvent('render-sheets'));
}

export function updateWizField(field, val) {
  const sheet = state.sheets[state.editingSheet];
  if (!sheet) return;
  sheet[field] = val;
  window.dispatchEvent(new CustomEvent('save-sheets'));
}

export function updateAttr(attr, delta) {
  const sheet = state.sheets[state.editingSheet];
  if (!sheet) return;
  const newVal = Math.max(1, Math.min(30, sheet.attributes[attr] + delta));
  sheet.attributes[attr] = newVal;
  window.dispatchEvent(new CustomEvent('save-sheets'));
  window.dispatchEvent(new CustomEvent('render-sheets'));
}

export function toggleSkill(skillId) {
  const sheet = state.sheets[state.editingSheet];
  if (!sheet) return;
  const idx = sheet.skills.indexOf(skillId);
  if (idx >= 0) {
    sheet.skills.splice(idx, 1);
  } else if (sheet.skills.length < 2) {
    sheet.skills.push(skillId);
  } else {
    showToast('Você só pode escolher 2 perícias!', 'error');
    return;
  }
  window.dispatchEvent(new CustomEvent('save-sheets'));
  window.dispatchEvent(new CustomEvent('render-sheets'));
}

export function selectPack(packName) {
  const sheet = state.sheets[state.editingSheet];
  if (!sheet) return;
  const packNames = PACK_OPTIONS.map(p => p.name);
  sheet.equipment = (sheet.equipment || []).filter(e => !packNames.includes(e));
  sheet.equipment.push(packName);
  window.dispatchEvent(new CustomEvent('save-sheets'));
  window.dispatchEvent(new CustomEvent('render-sheets'));
}

export function rollMoney() {
  const sheet = state.sheets[state.editingSheet];
  if (!sheet) return;
  const roll = Array.from({ length: 4 }, () => Math.floor(Math.random() * 4) + 1).reduce((a, b) => a + b, 0);
  sheet.money = 1000 + 10 * roll;
  window.dispatchEvent(new CustomEvent('save-sheets'));
  window.dispatchEvent(new CustomEvent('render-sheets'));
}

export function wizardNext() {
  const sheet = state.sheets[state.editingSheet];
  if (!sheet) return;

  if (sheet.currentStep === 2 && sheet.skills.length < 2) {
    showToast('Selecione 2 perícias para continuar!', 'error');
    return;
  }
  if (sheet.currentStep === 3 && !sheet.specialization) {
    showToast('Selecione uma especialização!', 'error');
    return;
  }
  if (sheet.currentStep === 5 && sheet.pokemon.length === 0) {
    showToast('Escolha seu Pokémon inicial!', 'error');
    return;
  }

  if (sheet.currentStep < 6) {
    sheet.currentStep++;
  } else {
    finalizeWizard(sheet);
  }
  window.dispatchEvent(new CustomEvent('save-sheets'));
  window.dispatchEvent(new CustomEvent('render-sheets'));
}

export function wizardBack() {
  const sheet = state.sheets[state.editingSheet];
  if (!sheet) return;
  if (sheet.currentStep > 1) {
    sheet.currentStep--;
    window.dispatchEvent(new CustomEvent('save-sheets'));
    window.dispatchEvent(new CustomEvent('render-sheets'));
  }
}

export function finalizeWizard(sheet) {
  window.dispatchEvent(new CustomEvent('finalize-wizard', { detail: sheet }));
}
