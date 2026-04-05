## MODIFIED Requirements

### Requirement: Interactive Tab System for Sheets
O editor de ficha de personagem SHALL possuir um sistema de abas para organizar as informações do treinador e dos Pokémon.
As abas SHALL incluir:
- **Resumo**: Informações básicas, atributos e perícias do treinador.
- **Itens**: Inventário de equipamentos e itens com controle de quantidade.
- **Time**: Lista de Pokémon nos Pokéslots.
- **Notas**: Espaço para notas da campanha.

#### Scenario: Switching between sheet tabs
- **WHEN** o usuário clica na aba "Itens" dentro de uma ficha aberta
- **THEN** o sistema SHALL ocultar as outras informações e exibir a interface de gerenciamento de inventário.
