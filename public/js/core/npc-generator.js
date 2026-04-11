import { state } from './state.js';
import { NATURES } from './pokemon-stats.js';

/**
 * Parses a CR string like "1/2", "1/4", "1", "2" into a number.
 * @param {string} crString 
 * @returns {number}
 */
export function parseCR(crString) {
  if (typeof crString !== 'string') return 0;
  if (crString.includes('/')) {
    const parts = crString.split('/');
    if (parts.length === 2) {
      const num = parseFloat(parts[0]);
      const den = parseFloat(parts[1]);
      if (!isNaN(num) && !isNaN(den) && den !== 0) {
        return num / den;
      }
    }
  }
  return parseFloat(crString) || 0;
}

const NPC_TOTAL_LEVELS = {
  1: 1, 2: 3, 3: 5, 4: 7, 5: 10, 6: 18, 7: 24, 8: 27, 9: 30, 10: 33,
  11: 46, 12: 50, 13: 55, 14: 60, 15: 65, 16: 78, 17: 83, 18: 87, 19: 92, 20: 100
};

/**
 * Calculates the total levels and number of Pokémon for an NPC of a given level.
 * @param {number} npcLevel 
 * @returns {{numPokemon: number, totalLevels: number, maxCR: number}}
 */
export function calculateNpcTeamStats(npcLevel) {
  let numPokemon = 3;
  if (npcLevel >= 15) numPokemon = 6;
  else if (npcLevel >= 10) numPokemon = 5;
  else if (npcLevel >= 5) numPokemon = 4;

  const totalLevels = NPC_TOTAL_LEVELS[npcLevel] || npcLevel;

  // Max CR based on Trainer Progression table
  const maxCRTable = {
    1: 0.5, 2: 1, 3: 3, 4: 5, 5: 5, 6: 6, 7: 6, 8: 8, 9: 8, 10: 9,
    11: 9, 12: 11, 13: 11, 14: 12, 15: 12, 16: 12, 17: 13, 18: 13, 19: 13, 20: 15
  };
  const maxCR = maxCRTable[npcLevel] || npcLevel;

  return { numPokemon, totalLevels, maxCR };
}

/**
 * Distributes totalLevels among numPokemon. Each must have at least 1 level.
 * @param {number} numPokemon 
 * @param {number} totalLevels 
 * @returns {number[]}
 */
export function distributeLevels(numPokemon, totalLevels) {
  if (numPokemon <= 0) return [];
  
  // Each pokemon must have at least 1 level
  let levels = new Array(numPokemon).fill(1);
  let remaining = Math.max(0, totalLevels - numPokemon);

  // Randomly distribute the remaining levels
  while (remaining > 0) {
    const idx = Math.floor(Math.random() * numPokemon);
    levels[idx]++;
    remaining--;
  }
  return levels;
}

/**
 * Generates a team of Pokémon for an NPC.
 * @param {number} npcLevel 
 * @returns {Object[]}
 */
export function generateNpcTeam(npcLevel) {
  const { numPokemon, totalLevels, maxCR } = calculateNpcTeamStats(npcLevel);
  const levels = distributeLevels(numPokemon, totalLevels);
  
  // Filter pokemon by CR <= maxCR
  const pool = state.allPokemon.filter(p => {
    const crValue = parseCR(p.cr);
    return crValue <= maxCR;
  });

  if (pool.length === 0) return [];

  const natureNames = Object.keys(NATURES);

  const team = levels.map(level => {
    // Select a random pokemon from the pool
    const basePokemon = pool[Math.floor(Math.random() * pool.length)];
    const nature = natureNames[Math.floor(Math.random() * natureNames.length)];
    
    // Get available moves by level
    const availableMoves = [];
    if (basePokemon.moves.starting) availableMoves.push(...basePokemon.moves.starting);
    if (basePokemon.moves.byLevel) {
      basePokemon.moves.byLevel.forEach(ml => {
        if (ml.level <= level) availableMoves.push(...ml.moves);
      });
    }
    
    // Select up to 4 random moves from available
    const selectedMoves = [];
    const movePool = [...new Set(availableMoves)];
    const movesToPick = Math.min(4, movePool.length);
    for (let i = 0; i < movesToPick; i++) {
      const moveIdx = Math.floor(Math.random() * movePool.length);
      selectedMoves.push(movePool.splice(moveIdx, 1)[0]);
    }

    // Create an instance of the pokemon with its specific level
    return {
      ...basePokemon,
      level: level,
      nature: nature,
      selectedMoves: selectedMoves,
      instanceId: Math.random().toString(36).substr(2, 9)
    };
  });

  return team;
}
