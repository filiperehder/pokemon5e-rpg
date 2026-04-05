## ADDED Requirements

### Requirement: Item Rules Search
O sistema SHALL oferecer sugestões de nomes de itens baseadas no banco de dados `rules.json` enquanto o usuário digita no campo de busca de itens.

#### Scenario: Searching for an existing item
- **WHEN** o usuário digita "Poke" no campo de busca de itens
- **THEN** o sistema SHALL exibir uma lista de sugestões contendo "Pokéball", "Great Ball", etc.

### Requirement: Flexible Item Creation
O sistema SHALL permitir que o usuário crie itens que não constam no banco de dados de regras.

#### Scenario: Adding a custom item
- **WHEN** o usuário digita "Poção Customizada" (que não existe no banco) e clica em "Adicionar"
- **THEN** o item SHALL ser incluído no inventário normalmente.
