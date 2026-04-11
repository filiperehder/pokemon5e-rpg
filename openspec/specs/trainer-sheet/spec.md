## MODIFIED Requirements

### Requirement: Item Data Model Schema
A estrutura de dados de uma ficha de treinador SHALL suportar uma lista de objetos representativos de itens, contendo nome e quantidade.

#### Scenario: New item list format
- **WHEN** uma ficha de treinador é salva ou carregada
- **THEN** a propriedade `items` SHALL ser um array de objetos `{ name: string, qty: number }` em vez de uma lista de strings.

### Requirement: Data Persistence of Inventory
O sistema SHALL persistir a lista de itens e suas quantidades no localStorage como parte do objeto da ficha.

#### Scenario: Persistent inventory
- **WHEN** o usuário recarrega a página após adicionar 5 Pokéballs
- **THEN** o sistema SHALL carregar as 5 Pokéballs corretamente.

## ADDED Requirements

### Requirement: Personal Pokédex Data Schema
O esquema da ficha de treinador SHALL incluir um campo para armazenar o progresso da Pokédex pessoal.

#### Scenario: Registering Pokémon in sheet data
- **WHEN** um Pokémon é registrado
- **THEN** a ficha SHALL conter um campo `pokedex` que é um array de números (IDs/Números dos Pokémon registrados).
