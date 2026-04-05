import { state } from './state.js';

export async function loadData() {
  const [pokeRes, movesRes, rulesRes, mapRes, xpRes] = await Promise.all([
    fetch('./data/pokemon.json'),
    fetch('./data/moves.json'),
    fetch('./data/rules.json'),
    fetch('./data/map.json'),
    fetch('./data/xptable.json')
  ]);
  state.allPokemon = await pokeRes.json();
  state.allMoves = await movesRes.json();
  state.allRules = await rulesRes.json();
  state.mapData = await mapRes.json();
  state.xpTable = await xpRes.json();

  // Build move lookup map
  state.allMoves.forEach(m => {
    state.moveMap[m.name.toLowerCase()] = m;
  });
}

export function populateFilters() {
  // Type filter (for both Pokédex and Moves)
  const types = [...new Set(state.allPokemon.flatMap(p => p.types.map(t => t.pt)))].sort();
  const moveTypes = [...new Set(state.allMoves.map(m => m.type.pt).filter(Boolean))].sort();

  const pokeTypeEl = document.getElementById('filter-type');
  if (pokeTypeEl) {
    types.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t; opt.textContent = t;
      pokeTypeEl.appendChild(opt);
    });
  }

  const moveTypeEl = document.getElementById('filter-move-type');
  if (moveTypeEl) {
    moveTypes.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t; opt.textContent = t;
      moveTypeEl.appendChild(opt);
    });
  }
}

export function getItemSuggestions() {
  const itemsChapter = state.allRules.find(c => c.id === 'items');
  if (!itemsChapter) return [];

  const itemNames = new Set();
  
  // Rules items are usually in markdown-like tables in sections or subsections
  // We'll look for strings that look like | Name | ... or are in the content
  const processText = (text) => {
    if (!text) return;
    // Match common table patterns in this project's rules.json
    // e.g. | Pokéball | ... | ... |
    const lines = text.split('\n');
    lines.forEach(line => {
      if (line.includes('|') && !line.includes('---')) {
        const parts = line.split('|').map(p => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
          // The first column is usually the item name
          // Validate it's not a header like "Item"
          const candidate = parts[0];
          if (candidate && candidate !== 'Item' && candidate !== 'TM' && candidate !== 'Berries') {
            itemNames.add(candidate);
          }
        }
      }
    });
  };

  itemsChapter.sections.forEach(s => {
    processText(s.content);
    if (s.subsections) s.subsections.forEach(ss => processText(s.content || ss.content));
  });

  return Array.from(itemNames).sort();
}
