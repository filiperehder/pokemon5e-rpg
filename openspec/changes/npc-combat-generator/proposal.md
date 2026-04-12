## Why

Mestres de jogo (DMs) precisam de uma forma rápida e eficiente de gerar NPCs de combate balanceados sem a necessidade de cálculos manuais. Atualmente, a criação de treinadores inimigos exige tempo para garantir que eles respeitem as regras de Nível, CR e distribuição de níveis de Pokémon do sistema "Pokémon em 5.ª Edição".

## What Changes

- Adição de um Gerador de NPCs na aba do Mestre (Master Tab).
- Implementação de lógica de geração automática de treinadores baseada no nível escolhido e na dificuldade (Fácil, Médio, Difícil).
- Filtro de CR por dificuldade:
  - **Fácil**: Prioriza Pokémon com CR mais baixo (até 1/3 do Max CR).
  - **Médio**: Distribuição equilibrada em torno da metade do Max CR.
  - **Difícil**: Prioriza Pokémon com CR entre a metade e o Max CR permitido.
- Distribuição de níveis entre os Pokémon do NPC baseada em uma tabela de progressão específica (ex: Nível 2 tem 3 níveis totais, Nível 20 tem 100).
- Quantidade de Pokémon no time baseada em faixas de nível (1-4: 3, 5-9: 4, 10-14: 5, 15-20: 6).
- Garantia de que o CR Máximo do NPC respeite o limite de CR por nível do sistema.
- Integração com a funcionalidade de Pokémon já existente nas fichas, focando exclusivamente na parte de combate.

## Capabilities

### New Capabilities
- `npc-combat-generator`: Lógica de geração de times de Pokémon para NPCs baseada em níveis e limites de CR conforme as regras do sistema.

### Modified Capabilities
- `trainer-sheet`: Ajustes para permitir a visualização e gerenciamento simplificado de Pokémon gerados para NPCs na aba do Mestre.

## Impact

- **Frontend**: Nova seção na `Master` tab em `public/js/components/Wizard.js` (ou componente equivalente da aba do Mestre).
- **Core Logic**: Nova lógica de cálculo em `public/js/core/pokemon-stats.js` ou utilitário específico para balanceamento de NPCs.
- **Data**: Utilização dos dados existentes de Pokémon e regras em `public/data/`.
