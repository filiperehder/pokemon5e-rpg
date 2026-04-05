## ADDED Requirements

### Requirement: Grouped Menu Navigation
O sistema SHALL agrupar as seções secundárias em menus categóricos para simplificar a barra de navegação principal.
- O menu "Geral" SHALL conter: Pokédex, Movimentos e Regras.
- O menu "Mestre" SHALL conter: Encontros e Mapa.

#### Scenario: Accessing a grouped section
- **WHEN** o usuário clica no menu "Geral" e seleciona "Pokédex"
- **THEN** o sistema SHALL carregar e exibir a visualização da Pokédex e fechar o menu suspenso (se aplicável).

### Requirement: Character Sheet Priority
O sistema SHALL definir a seção de "Fichas" como a visualização padrão ao carregar a aplicação.

#### Scenario: Initial application load
- **WHEN** a aplicação é carregada pela primeira vez ou recarregada
- **THEN** a visualização ativa SHALL ser a lista de Fichas de Treinador.

### Requirement: Navigation State Persistence
O sistema SHALL manter a seção ativa mesmo após interações dentro da seção (como abrir uma ficha específica).

#### Scenario: Navigation between main sections
- **WHEN** o usuário navega de "Fichas" para "Geral > Regras"
- **THEN** o sistema SHALL atualizar o estado global para refletir que "Regras" é a visualização ativa.
