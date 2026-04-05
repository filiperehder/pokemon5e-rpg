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

export function calculateHP(baseHP, level, conMod, hpIncreases = [], baseCON = 10) {
  const originalConMod = Math.floor((baseCON - 10) / 2);
  const hitDieMax = baseHP - originalConMod;
  
  // Level 1 HP adjusted for current CON mod
  let hp = hitDieMax + conMod;
  
  // Add increases for higher levels
  if (level > 1) {
    if (hpIncreases.length > 0) {
      // Use provided increases
      hpIncreases.forEach(inc => hp += inc);
      // conMod is usually already included in the increases if rolled, 
      // but if the CON mod changes later (nature/ASI), we need to adjust!
      // This is complex. Let's assume increases are just the DIE rolls.
      hp += (level - 1) * conMod;
    } else {
      // Default: use 5e average (Die/2 + 1)
      const avgIncrease = Math.floor(hitDieMax / 2) + 1;
      hp += (level - 1) * (avgIncrease + conMod);
    }
  }
  
  return Math.max(1, hp);
}
