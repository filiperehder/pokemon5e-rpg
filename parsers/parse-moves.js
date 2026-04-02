#!/usr/bin/env node
// Parser for HB-MoveList.txt → moves.json

const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, '..', 'HB-MoveList.txt');
const OUTPUT = path.join(__dirname, '..', 'public', 'data', 'moves.json');

const TYPES_PT = {
  'Fire': 'Fogo', 'Water': 'Água', 'Grass': 'Planta', 'Electric': 'Elétrico',
  'Ice': 'Gelo', 'Fighting': 'Lutador', 'Poison': 'Veneno', 'Ground': 'Terra',
  'Flying': 'Voador', 'Psychic': 'Psíquico', 'Bug': 'Inseto', 'Rock': 'Pedra',
  'Ghost': 'Fantasma', 'Dragon': 'Dragão', 'Dark': 'Sombrio', 'Steel': 'Aço',
  'Fairy': 'Fada', 'Normal': 'Normal'
};

const MOVE_POWER_PT = {
  'Strength': 'Força', 'Dexterity': 'Destreza', 'Constitution': 'Constituição',
  'Intelligence': 'Inteligência', 'Wisdom': 'Sabedoria', 'Charisma': 'Carisma',
  'None': 'Nenhum'
};

function translateMovePower(mp) {
  if (!mp || mp === 'None') return 'Nenhum';
  return mp.split('/').map(p => MOVE_POWER_PT[p.trim()] || p.trim()).join('/');
}

function translateMoveTime(mt) {
  const map = {
    '1 action': '1 ação',
    '1 bonus action': '1 ação bônus',
    '1 reaction': '1 reação',
  };
  return map[mt.trim()] || mt.trim();
}

function parseMoves(content) {
  const lines = content.split('\n');
  const moves = [];

  // Find all move header indices: lines starting with `#### `
  const moveStarts = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^####\s+\S/)) {
      moveStarts.push(i);
    }
  }

  for (let m = 0; m < moveStarts.length; m++) {
    const start = moveStarts[m];
    const end = m + 1 < moveStarts.length ? moveStarts[m + 1] : lines.length;
    const blockLines = lines.slice(start, end);

    const move = parseMove(blockLines);
    if (move && move.name) moves.push(move);
  }

  return moves;
}

function parseMove(lines) {
  const move = {
    name: '',
    type: { en: '', pt: '' },
    movePower: { en: '', pt: '' },
    moveTime: { en: '', pt: '' },
    pp: 0,
    duration: '',
    range: '',
    description: '',
    higherLevels: ''
  };

  // Name: first line "#### MoveName"
  const nameLine = lines[0];
  if (nameLine) {
    move.name = nameLine.replace(/^####\s+/, '').trim();
  }

  // Parse fields: "- **FieldName:** value"
  // Description and Higher Levels can be multi-line (after the field header, until next field)
  let currentField = null;
  let fieldContent = '';

  function saveField() {
    if (!currentField) return;
    const val = fieldContent.trim();
    switch (currentField) {
      case 'type':
        move.type = { en: val, pt: TYPES_PT[val] || val };
        break;
      case 'movePower':
        move.movePower = { en: val, pt: translateMovePower(val) };
        break;
      case 'moveTime':
        move.moveTime = { en: val, pt: translateMoveTime(val) };
        break;
      case 'pp':
        move.pp = parseInt(val) || 0;
        break;
      case 'duration':
        move.duration = val;
        break;
      case 'range':
        move.range = val;
        break;
      case 'description':
        move.description = val;
        break;
      case 'higherLevels':
        move.higherLevels = val;
        break;
    }
    currentField = null;
    fieldContent = '';
  }

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const stripped = line.trim();

    // Check for a new field header: "- **FieldName:** value" or "- **FieldName**: value"
    const fieldMatch = stripped.match(/^-\s*\*\*([^*]+?):?\*\*:?\s*(.*)/);
    if (fieldMatch) {
      saveField();
      const fieldName = fieldMatch[1].trim().replace(/:$/, '');
      const fieldVal = fieldMatch[2].trim();

      // Map field name to our key
      if (fieldName === 'Type') currentField = 'type';
      else if (fieldName === 'Move Power') currentField = 'movePower';
      else if (fieldName === 'Move Time') currentField = 'moveTime';
      else if (fieldName === 'PP') currentField = 'pp';
      else if (fieldName === 'Duration') currentField = 'duration';
      else if (fieldName === 'Range') currentField = 'range';
      else if (fieldName === 'Description') { currentField = 'description'; fieldContent = fieldVal; continue; }
      else if (fieldName === 'Higher Levels') { currentField = 'higherLevels'; fieldContent = fieldVal; continue; }
      else { currentField = null; continue; }

      fieldContent = fieldVal;
    } else if (currentField && stripped && !stripped.startsWith('```') && !stripped.startsWith('\\page')) {
      // Continuation of current multi-line field
      if (fieldContent) fieldContent += ' ' + stripped;
      else fieldContent = stripped;
    }
  }
  saveField();

  return move;
}

function main() {
  const raw = fs.readFileSync(INPUT, 'utf-8');
  const moves = parseMoves(raw);

  // Sort alphabetically
  moves.sort((a, b) => a.name.localeCompare(b.name));

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(moves, null, 2), 'utf-8');
  console.log(`Parsed ${moves.length} moves → ${OUTPUT}`);
}

main();
