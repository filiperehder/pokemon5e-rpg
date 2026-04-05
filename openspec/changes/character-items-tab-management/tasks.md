## 1. Preparação de Dados e Migração

- [x] 1.1 Atualizar `newSheet` em `public/js/components/Sheets.js` para inicializar a propriedade `items` como um array vazio.
- [x] 1.2 Implementar lógica de migração em `loadSheets` para converter o array `equipment` (strings) para `items` (objetos) caso `items` não exista.
- [x] 1.3 Adicionar função `getItemSuggestions` em `public/js/core/data-service.js` para extrair nomes de itens de `rules.json`.

## 2. Refatoração da Interface (UI)

- [x] 2.1 Adicionar a aba "Itens" ao componente de abas no `renderSheetEditor` em `public/js/components/Sheets.js`.
- [x] 2.2 Criar a função `renderItemsTab` para desenhar a interface de inventário.
- [x] 2.3 Implementar o campo de busca com `datalist` para sugestão de itens.
- [x] 2.4 Remover o campo `equipment` da aba "Resumo" para evitar duplicidade.

## 3. Lógica de Gerenciamento de Inventário

- [x] 3.1 Implementar função `addItemToInventory` com validação de duplicatas (incrementar qty se já existir).
- [x] 3.2 Implementar funções `updateItemQty` (+/-) e `removeItemFromInventory`.
- [x] 3.3 Garantir que `saveSheets()` seja chamado após cada mutação no inventário.

## 4. Verificação

- [x] 4.1 Validar se itens antigos são migrados corretamente ao abrir uma ficha existente.
- [x] 4.2 Testar a busca por itens das regras (ex: "Pokéball").
- [x] 4.3 Confirmar que itens customizados podem ser adicionados livremente.
