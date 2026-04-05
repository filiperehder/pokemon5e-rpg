## ADDED Requirements

### Requirement: Interactive Tab System for Sheets
O editor de ficha de personagem SHALL possuir um sistema de abas para organizar as informações do treinador e dos Pokémon.
As abas SHALL incluir:
- **Resumo**: Informações básicas, atributos, perícias e equipamentos do treinador.
- **Time**: Lista de Pokémon nos Pokéslots.
- **Diário/Notas**: Espaço para notas da campanha (se houver).

#### Scenario: Switching between sheet tabs
- **WHEN** o usuário clica na aba "Time" dentro de uma ficha aberta
- **THEN** o sistema SHALL ocultar as informações do treinador e exibir o grid de slots de Pokémon.

### Requirement: Tab Content Separation
O sistema SHALL carregar as seções de forma que apenas o conteúdo da aba ativa seja visível.

#### Scenario: Content visibility based on active tab
- **WHEN** a aba "Resumo" é ativada
- **THEN** o sistema SHALL exibir o layout de atributos e equipamentos e ocultar o time de Pokémon.

### Requirement: Responsive Layout Optimization
As abas SHALL ser exibidas de forma clara em dispositivos móveis, preferencialmente utilizando uma barra horizontal de fácil acesso.

#### Scenario: Viewing tabs on mobile
- **WHEN** a largura da tela é inferior a 600px
- **THEN** as abas SHALL ocupar a largura total do container e permitir troca rápida com um único toque.
