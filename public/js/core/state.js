export const state = {
  allPokemon: [],
  allMoves: [],
  allRules: [],
  moveMap: {},
  activePage: 'fichas',
  activeSheetTab: 'resumo',
  selectedPokemon: null,
  selectedMove: null,
  pokedexFilters: { search: '', type: '', cr: '', size: '' },
  moveFilters: { search: '', type: '' },
  movePage: 1,
  rulesState: { chapterId: null, sectionId: null },
  sheets: [],
  editingSheet: null,
  addToSheetTargetPokemon: null,
  pickingForSlot: null,
  encounter: {
    selectedPokemon: null,
    level: 1,
    generatedResult: null
  },

  mapData: null,
  selectedLocation: null,
  xpTable: null
};
