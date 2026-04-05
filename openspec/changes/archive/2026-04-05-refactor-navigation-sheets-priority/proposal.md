## Why

A interface atual apresenta muitas seções dispersas, o que dificulta a navegação rápida e a usabilidade em dispositivos móveis. Como a ficha de personagem é a ferramenta mais utilizada durante as sessões de RPG, ela deve ser o centro da experiência, com as outras ferramentas organizadas de forma lógica e secundária para reduzir a carga cognitiva e melhorar o fluxo de jogo.

## What Changes

- **Ficha como Feature Principal**: A aplicação iniciará diretamente na visão de fichas de personagem.
- **Novo Sistema de Navegação**:
    - Agrupamento de "Pokédex", "Movimentos" e "Regras" em um único menu intitulado "Geral" (ou similar).
    - Agrupamento de "Encontros" e "Mapa" em um menu intitulado "Mestre".
- **Refatoração da Ficha (Mobile-First)**: Implementação de um sistema de abas dentro da ficha para separar dados básicos, atributos, time Pokémon e equipamentos, facilitando a visualização em telas pequenas.
- **Menu Global Simplificado**: Redução dos itens de navegação principais para focar em "Fichas", "Geral" e "Mestre".

## Capabilities

### New Capabilities
- `navigation-refactor`: Define a nova estrutura de menus e o agrupamento das funcionalidades existentes.
- `character-sheet-tabs`: Define a organização interna da ficha de personagem através de abas interativas.

### Modified Capabilities
- `trainer-sheet`: Atualizar os requisitos de visualização e layout da ficha para suportar o sistema de abas.

## Impact

- **index.html**: Alteração profunda na estrutura de navegação principal (navbar/sidebar).
- **public/js/core/navigation.js**: Atualização da lógica de roteamento interno e controle de visualizações.
- **public/js/components/Sheets.js**: Refatoração completa do layout de renderização para incluir o sistema de abas.
- **public/styles.css**: Adição de estilos para os novos menus agrupados e componentes de abas.
