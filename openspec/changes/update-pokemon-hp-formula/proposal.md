## Why

Atualmente, o cálculo de Pontos de Vida (HP) dos Pokémon na ficha do personagem não segue a fórmula oficial da adaptação Pokémon 5e, ou exige entrada manual, o que pode levar a erros e dificulta a automação durante o nivelamento dos Pokémon. Automatizar esse cálculo garante precisão e melhora a experiência do treinador ao gerenciar seus Pokémon.

## What Changes

- **Alteração da Interface**: Renomear a opção de editar vida para "Vida Máxima" (ou similar) na ficha do Pokémon do personagem.
- **Automação do HP**: Implementar o cálculo automático do HP máximo baseado no nível, dado de vida (hit dice) e modificador de Constituição (CON).
- **Fórmula de Cálculo**: Utilizar a fórmula `HP = nível × (média do hit dice + CON mod + 0.5)` para determinar a vida máxima.
- **Sincronização**: Garantir que o HP máximo seja recalculado sempre que o nível do Pokémon ou seu valor de Constituição forem alterados.

## Capabilities

### New Capabilities
- `pokemon-hp-automation`: Define a regra de negócio e a automação para o cálculo de pontos de vida baseados na fórmula da adaptação 5e.

### Modified Capabilities
- `pokemon-stats`: Atualizar os requisitos de cálculo de estatísticas para incluir a derivação automática do HP a partir do Hit Dice e modificador de CON.

## Impact

- **public/js/core/pokemon-stats.js**: Provável local da lógica de cálculo de atributos onde a nova fórmula de HP será inserida.
- **public/js/components/Sheets.js**: Atualização da UI para refletir a mudança de "Editar Vida" para "Vida Máxima" e exibir o valor calculado.
- **Persistência de Dados**: Pode impactar como o HP é salvo ou carregado, priorizando o valor calculado sobre um valor estático inserido manualmente.
