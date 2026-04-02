#!/usr/bin/env node
// Parser for HB-Gen1PokemonStatBlocks.txt → pokemon.json

const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, '..', 'HB-Gen1PokemonStatBlocks.txt');
const OUTPUT = path.join(__dirname, '..', 'public', 'data', 'pokemon.json');

const TYPES_PT = {
  'Fire': 'Fogo', 'Water': 'Água', 'Grass': 'Planta', 'Electric': 'Elétrico',
  'Ice': 'Gelo', 'Fighting': 'Lutador', 'Poison': 'Veneno', 'Ground': 'Terra',
  'Flying': 'Voador', 'Psychic': 'Psíquico', 'Bug': 'Inseto', 'Rock': 'Pedra',
  'Ghost': 'Fantasma', 'Dragon': 'Dragão', 'Dark': 'Sombrio', 'Steel': 'Aço',
  'Fairy': 'Fada', 'Normal': 'Normal'
};

const SIZE_PT = {
  'Tiny': 'Minúsculo', 'Small': 'Pequeno', 'Medium': 'Médio',
  'Large': 'Grande', 'Huge': 'Enorme', 'Gargantuan': 'Colossal'
};

const STAT_MAP = { STR: 'FOR', DEX: 'DES', CON: 'CON', INT: 'INT', WIS: 'SAB', CHA: 'CAR' };

function translateTypes(arr) {
  return arr.map(t => ({ en: t, pt: TYPES_PT[t] || t }));
}

function parseStatValue(cell) {
  // "10 (+0)" → 10
  const m = cell.match(/(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

function parseModifier(cell) {
  // "10 (+0)" → 0, "7 (-2)" → -2
  const m = cell.match(/\(([+-]\d+)\)/);
  return m ? parseInt(m[1]) : 0;
}

function parseMoveLevel(key) {
  // "Level 2" → 2, "Starting Moves" → 0, "TM Moves" → "tm"
  if (key.toLowerCase().includes('starting')) return 0;
  if (key.toLowerCase().includes('tm')) return 'tm';
  const m = key.match(/(\d+)/);
  return m ? parseInt(m[1]) : null;
}

function parseTMList(str) {
  return str.split(',').map(s => s.trim()).filter(Boolean).map(s => parseInt(s)).filter(n => !isNaN(n));
}

function parseMoveList(str) {
  return str.split(',').map(s => s.trim()).filter(Boolean);
}

function parseSpeedStr(speedStr) {
  // "25 ft", "25 ft (25 ft swimming)", "30 ft (30 ft flying)"
  const result = {};
  const baseMatch = speedStr.match(/^(\d+)\s*ft/);
  if (baseMatch) result.walk = parseInt(baseMatch[1]);
  const flyMatch = speedStr.match(/(\d+)\s*ft\s*fly(?:ing)?/i);
  if (flyMatch) result.fly = parseInt(flyMatch[1]);
  const swimMatch = speedStr.match(/(\d+)\s*ft\s*swim(?:ming)?/i);
  if (swimMatch) result.swim = parseInt(swimMatch[1]);
  return result;
}

function parsePokemon(rawBlock, lines) {
  // lines is array of strings (the raw lines of this block)
  const pokemon = {
    number: 0,
    name: '',
    size: { en: '', pt: '' },
    types: [],
    level: 0,
    cr: '',
    armorClass: 0,
    hitPoints: 0,
    hitDice: '',
    speed: {},
    stats: { FOR: 0, DES: 0, CON: 0, INT: 0, SAB: 0, CAR: 0 },
    modifiers: { FOR: 0, DES: 0, CON: 0, INT: 0, SAB: 0, CAR: 0 },
    savingThrows: [],
    resistances: [],
    vulnerabilities: [],
    immunities: [],
    skills: [],
    abilities: [],
    moves: {
      starting: [],
      byLevel: [],
      tm: []
    }
  };

  // Line 1: name
  const nameLine = lines.find(l => l.match(/^>\s*##\s+/));
  if (nameLine) pokemon.name = nameLine.replace(/^>\s*##\s+/, '').trim();

  // Line 2: number | size type1 [type2] Type | Level X | CR X/Y
  const infoLine = lines.find(l => l.match(/^>#\d+/));
  if (infoLine) {
    const parts = infoLine.replace(/^>/, '').split('|').map(s => s.trim());
    // parts[0] = "#1"
    pokemon.number = parseInt(parts[0].replace('#', ''));
    // parts[1] = "Small Grass Poison Type" or "Small Fire Type"
    if (parts[1]) {
      const sizeTypeMatch = parts[1].match(/^(Tiny|Small|Medium|Large|Huge|Gargantuan)\s+(.+?)\s+Type$/i);
      if (sizeTypeMatch) {
        const sizeStr = sizeTypeMatch[1];
        pokemon.size = { en: sizeStr, pt: SIZE_PT[sizeStr] || sizeStr };
        const typeWords = sizeTypeMatch[2].trim().split(/\s+/);
        pokemon.types = translateTypes(typeWords);
      }
    }
    // parts[2] = "Level 7"
    if (parts[2]) {
      const lvlMatch = parts[2].match(/Level\s+(\d+)/i);
      if (lvlMatch) pokemon.level = parseInt(lvlMatch[1]);
    }
    // parts[3] = "CR 1/2" or "CR 6"
    if (parts[3]) {
      const crMatch = parts[3].match(/CR\s+(\S+)/i);
      if (crMatch) pokemon.cr = crMatch[1];
    }
  }

  // Armor Class
  const acLine = lines.find(l => l.match(/\*\*Armor Class\*\*/i));
  if (acLine) {
    const m = acLine.match(/\*\*Armor Class\*\*\s+(\d+)/i);
    if (m) pokemon.armorClass = parseInt(m[1]);
  }

  // Hit Points
  const hpLine = lines.find(l => l.match(/\*\*Hit Points\*\*/i));
  if (hpLine) {
    const m = hpLine.match(/\*\*Hit Points\*\*\s+(\d+)\s+\((d\d+)\)/i);
    if (m) {
      pokemon.hitPoints = parseInt(m[1]);
      pokemon.hitDice = m[2];
    }
  }

  // Speed
  const speedLine = lines.find(l => l.match(/\*\*Speed\*\*/i));
  if (speedLine) {
    const m = speedLine.match(/\*\*Speed\*\*\s+(.+)/i);
    if (m) pokemon.speed = parseSpeedStr(m[1]);
  }

  // Stats table – find the stats row (has numbers with modifiers)
  let statsRowIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/>\|STR\|DEX\|CON\|INT\|WIS\|CHA\|/i)) {
      // The values are 2 lines below (skip the :---: row)
      statsRowIdx = i + 2;
      break;
    }
  }
  if (statsRowIdx >= 0 && statsRowIdx < lines.length) {
    const statsLine = lines[statsRowIdx];
    const cells = statsLine.replace(/^>\|/, '').replace(/\|$/, '').split('|');
    const statKeys = ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'];
    cells.forEach((cell, idx) => {
      if (statKeys[idx]) {
        pokemon.stats[statKeys[idx]] = parseStatValue(cell);
        pokemon.modifiers[statKeys[idx]] = parseModifier(cell);
      }
    });
  }

  // Saving Throws
  const stLine = lines.find(l => l.match(/\*\*Saving Throws\*\*/i));
  if (stLine) {
    const m = stLine.match(/\*\*Saving Throws\*\*\s+(.+)/i);
    if (m) {
      pokemon.savingThrows = m[1].split(',').map(s => {
        const en = s.trim();
        return { en, pt: translateStatName(en) };
      });
    }
  }

  // Resistances
  const resLine = lines.find(l => l.match(/\*\*Resistances\*\*/i));
  if (resLine) {
    const m = resLine.match(/\*\*Resistances\*\*\s+(.+)/i);
    if (m) pokemon.resistances = translateTypes(m[1].split(',').map(s => s.trim()));
  }

  // Vulnerabilities
  const vulnLine = lines.find(l => l.match(/\*\*Vulnerabilities\*\*/i));
  if (vulnLine) {
    const m = vulnLine.match(/\*\*Vulnerabilities\*\*\s+(.+)/i);
    if (m) pokemon.vulnerabilities = translateTypes(m[1].split(',').map(s => s.trim()));
  }

  // Immunities
  const immLine = lines.find(l => l.match(/\*\*Immunities\*\*/i));
  if (immLine) {
    const m = immLine.match(/\*\*Immunities\*\*\s+(.+)/i);
    if (m) pokemon.immunities = translateTypes(m[1].split(',').map(s => s.trim()));
  }

  // Skills
  const skillLine = lines.find(l => l.match(/\*\*Skills\*\*/i));
  if (skillLine) {
    const m = skillLine.match(/\*\*Skills\*\*\s+(.+)/i);
    if (m) pokemon.skills = m[1].split(',').map(s => s.trim()).filter(Boolean);
  }

  // Abilities (***Name. *** Description) - but NOT Moves section
  let inMovesSection = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.match(/###\s+Moves/i)) { inMovesSection = true; continue; }
    if (!inMovesSection && line.match(/^\s*>\s*\*\*\*/)) {
      const abilityMatch = line.match(/\*\*\*([^.]+)\.\s*\*\*\*\s*(.*)/);
      if (abilityMatch) {
        pokemon.abilities.push({
          name: abilityMatch[1].trim(),
          description: abilityMatch[2].trim()
        });
      }
    }
  }

  // Moves section
  inMovesSection = false;
  let tmBuffer = '';
  let collectingTM = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.match(/###\s+Moves/i)) { inMovesSection = true; continue; }
    if (!inMovesSection) continue;

    if (collectingTM) {
      // Check if this is a continuation line (numbers without '>')
      const bare = line.replace(/^>\s*/, '').trim();
      if (bare.match(/^[\d,\s]+$/) && !bare.match(/^\*\*\*/)) {
        tmBuffer += ',' + bare;
        continue;
      } else {
        // Done collecting TM
        pokemon.moves.tm = parseTMList(tmBuffer);
        collectingTM = false;
      }
    }

    const moveMatch = line.match(/\*\*\*([^:]+):\*\*\*\s*(.*)/);
    if (moveMatch) {
      const key = moveMatch[1].trim();
      const value = moveMatch[2].trim();
      const level = parseMoveLevel(key);
      if (level === 'tm') {
        tmBuffer = value;
        collectingTM = true;
      } else if (level === 0) {
        pokemon.moves.starting = parseMoveList(value);
      } else if (level !== null) {
        pokemon.moves.byLevel.push({ level, moves: parseMoveList(value) });
      }
    }
  }

  if (collectingTM) {
    pokemon.moves.tm = parseTMList(tmBuffer);
  }

  return pokemon;
}

function translateStatName(stat) {
  const map = {
    'Strength': 'Força', 'Dexterity': 'Destreza', 'Constitution': 'Constituição',
    'Intelligence': 'Inteligência', 'Wisdom': 'Sabedoria', 'Charisma': 'Carisma'
  };
  return map[stat] || stat;
}

function main() {
  const raw = fs.readFileSync(INPUT, 'utf-8');
  const allLines = raw.split('\n');

  // Find all Pokemon block start indices (lines starting with `> ## `)
  const blockStarts = [];
  for (let i = 0; i < allLines.length; i++) {
    if (allLines[i].match(/^>\s*##\s+\S/)) {
      blockStarts.push(i);
    }
  }

  const pokemons = [];
  for (let b = 0; b < blockStarts.length; b++) {
    const start = blockStarts[b];
    const end = b + 1 < blockStarts.length ? blockStarts[b + 1] : allLines.length;
    const blockLines = allLines.slice(start, end);
    try {
      const p = parsePokemon(blockLines.join('\n'), blockLines);
      if (p.name) pokemons.push(p);
    } catch (e) {
      console.error(`Error parsing block starting at line ${start}: ${e.message}`);
    }
  }

  // Sort by number
  pokemons.sort((a, b) => a.number - b.number);

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(pokemons, null, 2), 'utf-8');
  console.log(`Parsed ${pokemons.length} Pokémon → ${OUTPUT}`);
}

main();
