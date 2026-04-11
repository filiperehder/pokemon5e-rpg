## Why

Atualmente, a Pokédex é uma ferramenta global e estática que mostra todos os Pokémon disponíveis. No entanto, no contexto de um RPG, cada treinador deve ter seu próprio registro de descobertas. Adicionar uma Pokédex individual dentro da ficha do personagem incentiva a exploração e o preenchimento gradual da "coleção" de cada jogador, refletindo sua jornada pessoal no mundo Pokémon.

## What Changes

- **Nova Aba na Ficha**: Inclusão da aba "Pokédex" no sistema de abas da ficha de personagem.
- **Registro Individual**: Cada ficha passará a armazenar uma lista de IDs de Pokémon que foram "registrados" (vistos ou capturados) por aquele treinador.
- **Visualização de Descobertas**: Na aba Pokédex da ficha, os Pokémon registrados aparecem normalmente, enquanto os não registrados aparecem como "Desconhecido" (apenas o número da entrada ou silhueta).
- **Filtro de Descobertas**: Adição de um filtro para exibir apenas os Pokémon que o treinador já registrou, facilitando a visualização da coleção atual.
- **Interface de Registro**: Mecanismo dentro da aba para buscar e adicionar novos registros à Pokédex pessoal.

## Capabilities

### New Capabilities
- `trainer-pokedex`: Define os requisitos para o armazenamento e exibição do progresso individual de descobertas Pokémon de cada treinador.

### Modified Capabilities
- `character-sheet-tabs`: Adicionar a aba "Pokédex" à navegação interna da ficha.
- `trainer-sheet`: Atualizar o esquema de dados da ficha para incluir o array de Pokémon registrados (`pokedex`).

## Impact

- **public/js/components/Sheets.js**: Implementação da renderização da aba e lógica de registro.
- **public/js/core/state.js**: Atualização do objeto de ficha para suportar o novo campo `pokedex`.
- **public/styles.css**: Estilos para os estados "Desconhecido" na Pokédex pessoal.
