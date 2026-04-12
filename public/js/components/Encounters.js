import { state } from '../core/state.js';
import { getTypeColor, typeBadgeHTML, spriteURL, padNum } from '../core/utils.js';
import { calculateStats, calculateAC, NATURES } from '../core/pokemon-stats.js';
import { getAvailableMoves } from './Pokedex.js';
import { generateNpcTeam, calculateNpcTeamStats } from '../core/npc-generator.js';

let activeEncounterTab = 'single';
let npcLevel = 1;

export function renderEncounters() {
  // Single Pokémon tab
  const area = document.getElementById('encounter-result-area');
  if (state.encounter.generatedResult) {
    area.innerHTML = buildEncounterResultHTML(state.encounter.generatedResult);
  } else {
    area.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🎲</div>
        <div class="empty-state-title">Aguardando geração</div>
        <div class="empty-state-text">Selecione um Pokémon e nível para gerar um NPC</div>
      </div>`;
  }

  // NPC Trainer tab
  const npcArea = document.getElementById('npc-result-area');
  if (state.encounter.generatedNpcTeam) {
    npcArea.innerHTML = buildNpcTeamHTML(state.encounter.generatedNpcTeam);
  } else {
    npcArea.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚔️</div>
        <div class="empty-state-title">Aguardando geração</div>
        <div class="empty-state-text">Selecione o nível do NPC para gerar seu time de combate</div>
      </div>`;
  }

  updateNpcInfo();
  setupEncounterEvents();
}

export function setupEncounterEvents() {
  const search = document.getElementById('encounter-poke-search');
  const results = document.getElementById('encounter-poke-results');
  const btnMinus = document.getElementById('btn-encounter-lvl-minus');
  const btnPlus = document.getElementById('btn-encounter-lvl-plus');
  const btnGenerate = document.getElementById('btn-generate-encounter');
  const lvlDisplay = document.getElementById('encounter-lvl-display');

  // Tab switching
  document.querySelectorAll('[data-encounter-tab]').forEach(tab => {
    tab.onclick = () => {
      activeEncounterTab = tab.dataset.encounterTab;
      document.querySelectorAll('[data-encounter-tab]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      document.getElementById('encounter-tab-single').classList.toggle('hidden', activeEncounterTab !== 'single');
      document.getElementById('encounter-tab-trainer').classList.toggle('hidden', activeEncounterTab !== 'trainer');
    };
  });

  if (search && btnGenerate) {
    // Search logic
    search.oninput = (e) => {
      const val = e.target.value.toLowerCase();
      if (val.length < 2) {
        results.classList.add('hidden');
        return;
      }
      const filtered = state.allPokemon.filter(p => p.name.toLowerCase().includes(val)).slice(0, 10);
      if (filtered.length) {
        results.innerHTML = filtered.map(p => `
          <div class="select-result-item" data-num="${p.number}">
            <img src="${spriteURL(p.number)}" width="24" height="24">
            <span>${p.name}</span>
            <span style="margin-left:auto; font-size:0.7rem; color:var(--text-muted)">CR ${p.cr}</span>
          </div>`).join('');
        results.classList.remove('hidden');
      } else {
        results.classList.add('hidden');
      }
    };

    results.onclick = (e) => {
      const item = e.target.closest('.select-result-item');
      if (!item) return;
      const num = parseInt(item.dataset.num);
      const p = state.allPokemon.find(pk => pk.number === num);
      if (p) {
        state.encounter.selectedPokemon = p;
        search.value = p.name;
        results.classList.add('hidden');
      }
    };

    // Level controls (Single)
    btnMinus.onclick = () => {
      state.encounter.level = Math.max(1, state.encounter.level - 1);
      lvlDisplay.textContent = `Nível ${state.encounter.level}`;
    };
    btnPlus.onclick = () => {
      state.encounter.level = Math.min(20, state.encounter.level + 1);
      lvlDisplay.textContent = `Nível ${state.encounter.level}`;
    };

    // Generate NPC (Single)
    btnGenerate.onclick = () => {
      if (!state.encounter.selectedPokemon) {
        alert('Selecione um Pokémon primeiro');
        return;
      }
      generateNPC();
    };
  }

  // NPC Trainer controls
  const btnNpcMinus = document.getElementById('btn-npc-lvl-minus');
  const btnNpcPlus = document.getElementById('btn-npc-lvl-plus');
  const btnGenerateNpc = document.getElementById('btn-generate-npc');
  const npcLvlDisplay = document.getElementById('npc-lvl-display');

  if (btnNpcMinus && btnNpcPlus && btnGenerateNpc) {
    btnNpcMinus.onclick = () => {
      npcLevel = Math.max(1, npcLevel - 1);
      npcLvlDisplay.textContent = `Nível ${npcLevel}`;
      updateNpcInfo();
    };
    btnNpcPlus.onclick = () => {
      npcLevel = Math.min(20, npcLevel + 1);
      npcLvlDisplay.textContent = `Nível ${npcLevel}`;
      updateNpcInfo();
    };
    btnGenerateNpc.onclick = () => {
      const difficulty = document.getElementById('npc-difficulty')?.value || 'medium';
      state.encounter.generatedNpcTeam = generateNpcTeam(npcLevel, difficulty);
      renderEncounters();
    };
  }

  // View NPC Poke detail
  document.querySelectorAll('.btn-view-npc-poke').forEach(btn => {
    btn.onclick = () => {
      const instanceId = btn.dataset.instanceId;
      const poke = state.encounter.generatedNpcTeam.find(p => p.instanceId === instanceId);
      if (poke) {
        showNpcPokeDetail(poke);
      }
    };
  });
}

function showNpcPokeDetail(p) {
  const detailArea = document.getElementById('npc-poke-detail-area');
  if (!detailArea) return;

  // Prepare data for buildEncounterResultHTML format
  // We need nature, stats, modifiers, hp, ac, moves, xp
  
  // 1. Calculate Stats
  // Note: For NPC trainer pokemon, we don't have ASI by default in the generator yet.
  // But calculateStats expects them. Let's just pass empty for now or generate some.
  const { stats, modifiers } = calculateStats(p.stats, p.level, p.nature || 'Hardy', {});
  const ac = calculateAC(p.armorClass, p.level, modifiers.DES);
  
  // HP average
  const hitDieValue = parseInt(p.hitDice.replace('d', '')) || 6;
  const avgIncrease = Math.floor(hitDieValue / 2) + 1;
  let hp = p.hitPoints + (p.level - 1) * (avgIncrease + modifiers.CON);
  hp = Math.max(1, hp);

  // XP
  let xp = 0;
  if (state.xpTable && state.xpTable[p.level]) {
    const crStr = String(p.cr);
    xp = state.xpTable[p.level][crStr] || 0;
  }

  const res = {
    pokemon: p,
    level: p.level,
    nature: p.nature || 'Hardy',
    hp,
    ac,
    xp,
    stats,
    modifiers,
    moves: p.selectedMoves || []
  };

  detailArea.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; padding-top:15px; border-top:1px solid var(--border)">
      <div style="font-weight:700; color:var(--text-primary)">Detalhes: ${p.name}</div>
      <button class="btn btn-sm btn-outline" onclick="document.getElementById('npc-poke-detail-area').innerHTML=''">Fechar Detalhes</button>
    </div>
    ${buildEncounterResultHTML(res)}
  `;
  
  detailArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateNpcInfo() {
  const infoCount = document.getElementById('npc-info-count');
  const infoLevels = document.getElementById('npc-info-levels');
  const infoCr = document.getElementById('npc-info-cr');
  if (infoCount && infoLevels && infoCr) {
    const stats = calculateNpcTeamStats(npcLevel);
    infoCount.textContent = stats.numPokemon;
    infoLevels.textContent = stats.totalLevels;
    infoCr.textContent = stats.maxCR;
  }
}

function generateNPC() {
  const p = state.encounter.selectedPokemon;
  const level = state.encounter.level;
  
  // 1. Pick a random nature
  const natureKeys = Object.keys(NATURES);
  const nature = natureKeys[Math.floor(Math.random() * natureKeys.length)];

  // 2. Randomly assign ASI (1 point per level-up level)
  const asi = {};
  const ASI_LVLS = [4, 8, 12, 16, 19];
  const attrs = ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'];
  
  ASI_LVLS.forEach(l => {
    if (level >= l) {
      const randAttr = attrs[Math.floor(Math.random() * attrs.length)];
      asi[l] = { [randAttr]: 1 };
    }
  });

  // 3. Calculate Stats
  const { stats, modifiers } = calculateStats(p.stats, level, nature, asi);
  const ac = calculateAC(p.armorClass, level, modifiers.DES);
  
  // For HP NPC, let's use average: hitDie/2 + 1 + CON per level
  const hitDieValue = parseInt(p.hitDice.replace('d', '')) || 6;
  const avgIncrease = Math.floor(hitDieValue / 2) + 1;
  let hp = p.hitPoints + (level - 1) * (avgIncrease + modifiers.CON);
  hp = Math.max(1, hp);

  // 4. Randomize Moves
  const available = getAvailableMoves(p, level);
  const allPossible = available.known;
  const randomizedMoves = [];
  const pool = [...allPossible];
  
  // Pick up to 4 moves randomly
  for (let i = 0; i < 4 && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    randomizedMoves.push(pool.splice(idx, 1)[0]);
  }

  // 5. Calculate XP based on level and CR
  let xp = 0;
  if (state.xpTable && state.xpTable[level]) {
    const crStr = String(p.cr);
    xp = state.xpTable[level][crStr] || 0;
  }

  state.encounter.generatedResult = {
    pokemon: p,
    level,
    nature,
    hp,
    ac,
    xp,
    stats,
    modifiers,
    moves: randomizedMoves
  };

  renderEncounters();
}

function buildNpcTeamHTML(team) {
  if (!team || team.length === 0) return '';

  const teamListHTML = team.map(p => {
    const typeColor = getTypeColor(p.types[0]?.pt || '');
    return `
      <div class="npc-team-item" style="border-left: 4px solid ${typeColor}" data-instance-id="${p.instanceId}">
        <img src="${spriteURL(p.number)}" width="48" height="48">
        <div class="npc-team-info">
          <div class="npc-team-name">${p.name}</div>
          <div class="npc-team-meta">Nível ${p.level} · CR ${p.cr}</div>
        </div>
        <button class="btn btn-sm btn-outline btn-view-npc-poke" data-instance-id="${p.instanceId}">Ver Ficha</button>
      </div>`;
  }).join('');

  return `
    <div class="npc-team-results">
      <div style="margin-bottom:15px; font-weight:700; color:var(--gold)">Time Gerado (${team.length} Pokémon)</div>
      <div class="npc-team-list">
        ${teamListHTML}
      </div>
      <div id="npc-poke-detail-area" style="margin-top:20px"></div>
    </div>`;
}

function buildEncounterResultHTML(res) {
  const p = res.pokemon;
  const typeColor = getTypeColor(p.types[0]?.pt || '');
  
  const statsHTML = ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'].map(s => `
    <div class="stat-item mini">
      <div class="stat-label">${s}</div>
      <div class="stat-value">${res.stats[s]}</div>
      <div class="stat-modifier">${res.modifiers[s] >= 0 ? '+' : ''}${res.modifiers[s]}</div>
    </div>`).join('');

  const profBonus = Math.floor((res.level - 1) / 4) + 2;
  
  const stHTML = (p.savingThrows || []).map(s => {
    const attrMap = { 'Strength': 'FOR', 'Dexterity': 'DES', 'Constitution': 'CON', 'Intelligence': 'INT', 'Wisdom': 'SAB', 'Charisma': 'CAR' };
    const attr = attrMap[s.en] || 'INT';
    const bonus = res.modifiers[attr] + profBonus;
    return `${s.pt || s.en} ${bonus >= 0 ? '+' : ''}${bonus}`;
  }).join(', ') || '—';

  const resistHTML = (p.resistances || []).map(t =>
    `<span class="tag resist" style="border-color:${getTypeColor(t.pt || t.en)}40;color:${getTypeColor(t.pt || t.en)}">${t.pt || t.en}</span>`).join('');
  const vulnHTML = (p.vulnerabilities || []).map(t =>
    `<span class="tag vuln" style="border-color:${getTypeColor(t.pt || t.en)}40;color:${getTypeColor(t.pt || t.en)}">${t.pt || t.en}</span>`).join('');
  const immuneHTML = (p.immunities || []).map(t =>
    `<span class="tag immune" style="color:${getTypeColor(t.pt || t.en)}">${t.pt || t.en}</span>`).join('');

  const movesHTML = res.moves.map(mName => {
    const move = state.moveMap[mName.toLowerCase()];
    if (!move) return `<div class="active-move-card">${mName}</div>`;
    const mColor = getTypeColor(move.type.pt || move.type.en || '');
    const desc = move.description?.pt || move.description?.en || move.description || '';
    
    return `
      <div class="active-move-card" style="padding:10px; height:100%; display:flex; flex-direction:column; gap:6px; border-color:${mColor}33">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-weight:700; color:var(--gold); font-size:0.85rem">${mName}</span>
          <span class="type-badge" style="--badge-color:${mColor}; font-size:0.6rem">${move.type.pt || move.type.en}</span>
        </div>
        <div style="font-size:0.65rem; color:var(--text-muted); font-family:var(--font-heading); display:flex; gap:8px">
          <span>PP ${move.pp}</span>
          <span>${move.range}</span>
          <span>${move.movePower.pt || move.movePower.en}</span>
        </div>
        ${desc ? `<div style="font-size:0.75rem; color:var(--text-secondary); line-height:1.3; margin-top:4px">${desc}</div>` : ''}
      </div>`;
  }).join('');

  return `
    <div class="npc-card" style="border-color:${typeColor}44; max-width:700px">
      <div class="npc-header">
        <img class="npc-sprite" src="${spriteURL(p.number)}">
        <div class="npc-info">
          <div class="npc-name">${p.name} <span class="npc-lvl">Nv.${res.level}</span></div>
          <div class="npc-meta">
            ${p.types.map(t => typeBadgeHTML(t)).join('')}
            <span>· Natureza ${res.nature}</span>
          </div>
        </div>
      </div>

      <div class="npc-combat-row">
        <div class="npc-combat-box">
          <div class="label">HP</div>
          <div class="val">${res.hp}</div>
        </div>
        <div class="npc-combat-box">
          <div class="label">AC</div>
          <div class="val">${res.ac}</div>
        </div>
        <div class="npc-combat-box">
          <div class="label">XP</div>
          <div class="val">${res.xp.toLocaleString()}</div>
          <div style="font-size:0.55rem; color:var(--text-muted); margin-top:2px">CR ${p.cr}</div>
        </div>
      </div>

      <div class="npc-stats-grid">
        ${statsHTML}
      </div>

      <div class="npc-detail-section" style="margin-bottom:20px; font-size:0.85rem; background:rgba(0,0,0,0.1); padding:15px; border-radius:var(--r-md); border:1px solid var(--border)">
        <div style="margin-bottom:10px; display:flex; gap:8px;">
          <strong style="color:var(--gold); min-width:140px">Testes de Resistência:</strong> 
          <span style="color:var(--text-primary)">${stHTML}</span>
        </div>
        <div style="margin-bottom:15px; display:flex; gap:8px;">
          <strong style="color:var(--gold); min-width:140px">Perícias:</strong> 
          <span style="color:var(--text-primary)">${(p.skills || []).join(', ') || '—'}</span>
        </div>
        
        <div style="margin-bottom:15px; display:flex; gap:8px;">
          <strong style="color:var(--gold); min-width:140px">Habilidades:</strong> 
          <div style="display:flex; flex-direction:column; gap:8px; color:var(--text-primary)">
            ${(p.abilities || []).map(a => `<div><strong>${a.name}:</strong> ${a.description}</div>`).join('') || '—'}
          </div>
        </div>
        
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px">
          ${resistHTML ? `<div><div style="font-size:0.6rem; text-transform:uppercase; color:var(--text-muted); margin-bottom:6px; font-weight:700; letter-spacing:0.05em">Resistências</div><div class="tags-row">${resistHTML}</div></div>` : ''}
          ${vulnHTML ? `<div><div style="font-size:0.6rem; text-transform:uppercase; color:var(--text-muted); margin-bottom:6px; font-weight:700; letter-spacing:0.05em">Vulnerabilidades</div><div class="tags-row">${vulnHTML}</div></div>` : ''}
          ${immuneHTML ? `<div style="grid-column: 1 / -1"><div style="font-size:0.6rem; text-transform:uppercase; color:var(--text-muted); margin-bottom:6px; font-weight:700; letter-spacing:0.05em">Imunidades</div><div class="tags-row">${immuneHTML}</div></div>` : ''}
        </div>
      </div>

      <div class="npc-moves-title">Movimentos Aleatórios</div>
      <div class="npc-moves-list">
        ${movesHTML}
      </div>
    </div>`;
}
