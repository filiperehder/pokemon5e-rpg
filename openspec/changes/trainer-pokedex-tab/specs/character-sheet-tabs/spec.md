## MODIFIED Requirements

### Requirement: Interactive Tab System for Sheets
O editor de ficha de personagem SHALL possuir um sistema de abas para organizar as informações do treinador e dos Pokémon.
As abas SHALL incluir:
- **Resumo**: Informações básicas, atributos e perícias do treinador.
- **Itens**: Inventário de equipamentos e itens com controle de quantidade.
- **Pokédex**: Registro de descobertas Pokémon do treinador.
- **Time**: Lista de Pokémon nos Pokéslots.
- **Notas**: Espaço para notas da campanha.

#### Scenario: Switching between sheet tabs
- **WHEN** o usuário clica na aba "Pokédex" dentro de uma ficha aberta
- **THEN** o sistema SHALL ocultar as outras informações e exibir o progresso individual de descobertas do treinador.
