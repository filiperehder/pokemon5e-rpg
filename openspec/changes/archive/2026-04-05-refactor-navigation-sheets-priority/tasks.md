## 1. Refatoração da Navegação Global

- [x] 1.1 Atualizar `index.html` para agrupar links de navegação em submenus (Geral e Mestre).
- [x] 1.2 Adicionar classes CSS para dropdowns no `public/styles.css`.
- [x] 1.3 Modificar `public/js/core/navigation.js` para suportar a lógica de exibição dos submenus.
- [x] 1.4 Definir 'fichas' como a visualização inicial no `state.js` ou `main.js`.

## 2. Implementação do Sistema de Abas na Ficha

- [x] 2.1 Adicionar `activeSheetTab` ao estado da aplicação em `public/js/core/state.js`.
- [x] 2.2 Criar o componente de abas UI (HTML/CSS) no topo do editor de ficha em `public/js/components/Sheets.js`.
- [x] 2.3 Refatorar `renderSheetEditor` para renderizar condicionalmente o conteúdo (Resumo vs Time vs Notas).
- [x] 2.4 Implementar a aba de "Notas" na ficha.
- [x] 2.5 Estilizar as abas para serem responsivas no `public/styles.css`.

## 3. Verificação e Polimento

- [x] 3.1 Verificar se todos os links originais (Pokedex, Moves, Encounters, etc.) continuam funcionando dentro dos novos menus.
- [x] 3.2 Validar a troca de abas na ficha sem perda de dados não salvos.
- [x] 3.3 Testar a usabilidade dos menus e abas em simulador de dispositivos móveis.
