## Context

A aplicação Pokémon 5e Companion possui diversas seções (Fichas, Pokédex, Movimentos, Encontros, Regras, Mapa, etc.) que atualmente ocupam espaço individual na barra de navegação. Em dispositivos móveis, essa estrutura causa poluição visual e dificulta o acesso rápido à Ficha de Treinador, que é o componente central do sistema. Além disso, a própria ficha exibe todas as informações em uma única coluna longa, exigindo muito scroll.

## Goals / Non-Goals

**Goals:**
- Simplificar a navegação global agrupando seções secundárias.
- Definir "Fichas" como a tela inicial obrigatória.
- Implementar um sistema de abas dentro da ficha para melhorar a organização e reduzir o scroll.
- Melhorar a experiência mobile-first através de elementos UI mais compactos.

**Non-Goals:**
- Não serão criadas novas funcionalidades de jogo (ex: novos cálculos de regras).
- Não haverá mudança na estrutura de dados do `localStorage` (compatibilidade total).

## Decisions

1. **Agrupamento de Navegação (Mega Menu / Dropdown)**:
    - **Por que?**: Reduz o número de botões principais de ~7 para 3 ("Fichas", "Geral", "Mestre").
    - **Como**: Utilizar menus suspensos (dropdowns) acionados por clique/hover que contêm os links para as subseções.

2. **Visão Padrão (`navigation.js`)**:
    - Alterar o estado inicial em `state.js` ou a lógica em `main.js` para que a visualização ativa inicial seja sempre 'fichas'.

3. **Sistema de Abas na Ficha (`Sheets.js`)**:
    - **Implementação**: Adicionar um estado local no componente de ficha (ou no `state.js` para persistência temporária) chamado `activeSheetTab`.
    - **Layout**: Uma barra horizontal fixa no topo do editor de ficha. O conteúdo abaixo será renderizado condicionalmente com base na aba ativa.
    - **Abas**:
        - `resumo`: Nome, Nível, Atributos, Perícias, Equipamento.
        - `time`: Grid de Pokémon (Pokéslots).
        - `notas`: Textarea simples para anotações rápidas.

4. **Estilização CSS**:
    - Criar classes `.nav-dropdown` e `.sheet-tabs` no `public/styles.css` utilizando Flexbox e CSS Transitions para feedback visual suave.

## Risks / Trade-offs

- **[Risco] Aumento de Cliques para Subseções** → Para acessar a Pokédex, o usuário agora fará 2 cliques em vez de 1. No entanto, o ganho em organização visual compensa esse trade-off para a maioria dos casos de uso.
- **[Trade-off] Memória de Estado de Aba** → Se o usuário fechar e abrir a ficha, ela deve resetar para a aba "Resumo" ou lembrar a última aba? Decisão: Resetar para "Resumo" para consistência, a menos que o usuário solicite persistência.
