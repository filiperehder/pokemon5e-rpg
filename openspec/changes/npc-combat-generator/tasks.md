## 1. Core Logic (NPC Generator)

- [x] 1.1 Criar o módulo `public/js/core/npc-generator.js`.
- [x] 1.2 Implementar função `calculateNpcTeamStats(npcLevel)` que calcula `totalLevels` e `numPokemon`.
- [x] 1.3 Implementar lógica de distribuição de níveis entre os Pokémon do time seguindo a regra `(Nível NPC * 2) - 1`.
- [x] 1.4 Implementar função de seleção aleatória de Pokémon de `public/data/pokemon.json` filtrada por `CR <= npcLevel`.
- [x] 1.5 Integrar com `public/js/core/pokemon-stats.js` para garantir cálculos de atributos corretos para os níveis gerados.

## 2. UI Integration (Master Tab)

- [x] 2.1 Adicionar seção "NPC Combat Generator" no arquivo `public/js/components/Wizard.js`.
- [x] 2.2 Implementar controles de UI: Input/Select de Nível (1-20) e botão "Gerar NPC de Combate".
- [x] 2.3 Implementar renderização da lista de resultados (Pokémon, Nível, CR) na aba do Mestre.
- [x] 2.4 Adicionar estilos CSS básicos para a nova seção se necessário.

## 3. Pokémon Sheet Integration

- [x] 3.1 Implementar ação de clique para abrir o bloco de estatísticas (Stat Block) do Pokémon gerado.
- [x] 3.2 Adaptar `public/js/components/Sheets.js` ou utilizar suas funções para exibir stats sem necessidade de uma ficha persistente.
- [x] 3.3 Validar se a visualização exibe corretamente as Natures e Habilidades baseadas no nível gerado.

## 4. Final Polish & Validation

- [x] 4.1 Realizar testes de geração para níveis 1, 3, 5, 10 e 20 para validar o balanceamento.
- [x] 4.2 Corrigir eventuais bugs de arredondamento na distribuição de níveis.
- [x] 4.3 Garantir que a interface seja limpa e funcional dentro da aba do Mestre.
