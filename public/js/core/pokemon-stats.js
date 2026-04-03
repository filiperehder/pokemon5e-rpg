export const NATURES = {
  'Reckless': { plus: 'FOR', minus: 'DES' },
  'Rash': { plus: 'FOR', minus: 'CON' },
  'Adamant': { plus: 'FOR', minus: 'INT' },
  'Quirky': { plus: 'INT', minus: 'CAR' },
  'Skittish': { plus: 'DES', minus: 'FOR' },
  'Hasty': { plus: 'DES', minus: 'CON' },
  'Naughty': { plus: 'DES', minus: 'CAR' },
  'Naive': { plus: 'INT', minus: 'SAB' },
  'Relaxed': { plus: 'CON', minus: 'DES' },
  'Modest': { plus: 'INT', minus: 'CON' },
  'Grumpy': { plus: 'CON', minus: 'CAR' },
  'Brave': { plus: 'CON', minus: 'FOR' },
  'Careful': { plus: 'SAB', minus: 'DES' },
  'Curious': { plus: 'SAB', minus: 'INT' },
  'Quiet': { plus: 'SAB', minus: 'CAR' },
  'Gentle': { plus: 'CAR', minus: 'FOR' },
  'Sassy': { plus: 'CAR', minus: 'SAB' },
  'Jolly': { plus: 'CAR', minus: 'INT' },
  'Hardy': { plus: null, minus: null },
  'Nimble': { plus: null, minus: null }
};

export const AC_LEVELS = [5, 7, 11, 15];
export const ASI_LEVELS = [4, 8, 12, 16, 19];

export function calculateStats(baseStats, level, natureName, asi = {}, evolutionBonus = {}) {
  const stats = { ...baseStats };

  // 1. Apply Nature
  const nature = NATURES[natureName];
  if (nature) {
    if (nature.plus) stats[nature.plus] += 2;
    if (nature.minus) stats[nature.minus] -= 2;
  }

  // 2. Apply ASI
  Object.values(asi).forEach(bonus => {
    Object.entries(bonus).forEach(([attr, val]) => {
      if (stats[attr] !== undefined) stats[attr] += val;
    });
  });

  // 3. Apply Evolution Bonuses
  Object.values(evolutionBonus).forEach(bonus => {
    Object.entries(bonus).forEach(([attr, val]) => {
      if (stats[attr] !== undefined) stats[attr] += val;
    });
  });

  // Calculate modifiers
  const modifiers = {};
  Object.entries(stats).forEach(([attr, val]) => {
    modifiers[attr] = Math.floor((val - 10) / 2);
  });

  return { stats, modifiers };
}

export function calculateAC(baseAC, level, dexMod, otherBonuses = 0) {
  let ac = baseAC + dexMod;
  
  // Rule: +1 AC at levels 5, 7, 11, 15
  AC_LEVELS.forEach(lvl => {
    if (level >= lvl) ac += 1;
  });

  return ac + otherBonuses;
}

export function calculateHP(baseHP, level, conMod, hpIncreases = []) {
  // If we have custom increases (rolled or average), use them
  if (hpIncreases.length > 0) {
    let hp = baseHP + (level - 1) * conMod;
    hpIncreases.forEach(inc => hp += inc);
    return hp;
  }
  
  // Default: use 0 as default increase if not specified? 
  // D&D 5e usually uses hit die average if not rolled. 
  // Let's assume user will input the rolled values or we provide a default.
  // Actually, the prompt says "adicionar nova vida", suggesting we should provide a way to add it.
  return baseHP; 
}
