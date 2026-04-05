## ADDED Requirements

### Requirement: Inventory Manipulation
O sistema SHALL permitir que o usuário adicione novos itens, remova itens existentes e ajuste as quantidades de cada item na aba de Itens.

#### Scenario: Adding a new item
- **WHEN** o usuário digita o nome de um item e clica em "Adicionar"
- **THEN** o item SHALL ser incluído na lista de inventário com quantidade inicial 1.

#### Scenario: Changing item quantity
- **WHEN** o usuário clica nos botões "+" ou "-" ao lado de um item
- **THEN** a quantidade do item SHALL ser incrementada ou decrementada respectivamente.

#### Scenario: Removing an item
- **WHEN** o usuário clica no botão de remoção (lixeira) de um item
- **THEN** o item SHALL ser removido permanentemente da lista de inventário do personagem.

### Requirement: Item Persistence Sync
O sistema SHALL garantir que todas as alterações no inventário sejam salvas automaticamente no estado global e persistidas localmente.

#### Scenario: Automatic save on change
- **WHEN** qualquer alteração é feita na lista de itens (adição, remoção ou quantidade)
- **THEN** o sistema SHALL disparar o salvamento das fichas no localStorage.
