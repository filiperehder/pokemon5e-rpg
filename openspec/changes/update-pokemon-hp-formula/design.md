## Context

A implementação atual do cálculo de HP para Pokémon na aplicação segue um modelo híbrido próximo ao D&D 5e padrão (valor máximo no nível 1 + média nos níveis subsequentes), permitindo também ajustes manuais através de `hpIncreases` ou sobreposição direta de `hpMax`. O objetivo desta mudança é padronizar o HP dos Pokémon conforme a fórmula linear da adaptação Pokémon 5e, automatizando completamente o valor de "Vida Máxima".

## Goals / Non-Goals

**Goals:**
- Implementar a fórmula `HP = nível × (média do hit dice + CON mod + 0.5)` em `public/js/core/pokemon-stats.js`.
- Atualizar os componentes de UI (`Sheets.js`, `Pokedex.js`, `Encounters.js`) para exibir "Vida Máxima" em vez de permitir edição livre de HP.
- Garantir que o HP seja recalculado reativamente quando o nível ou a Constituição mudarem.

**Non-Goals:**
- Não alterar o cálculo de HP para o Treinador (Trainer), que permanece seguindo as regras de classe de personagem (d6).
- Não implementar sistema de HP temporário ou dano persistente nesta fase (foco em HP Máximo).

## Decisions

1. **Lógica de Cálculo (`calculateHP`)**:
   - A função `calculateHP` será simplificada. Ela deixará de considerar o array `hpIncreases`.
   - A `média do hit dice` será calculada como `(hitDieMax + 1) / 2`.
   - O HP final será `Math.floor(level * (avgHitDie + conMod + 0.5))`.
   - *Nota*: Como `avgHitDie + 0.5` resulta sempre em `(hitDieMax / 2) + 1` para dados pares (d6, d8, d10, d12), a fórmula simplificada é `level * (hitDieMax / 2 + 1 + conMod)`.

2. **Interface do Usuário (UI)**:
   - Em `Sheets.js` e `Pokedex.js`, o campo que permitia editar o HP máximo será alterado para apenas exibição ou terá o rótulo alterado para "Vida Máxima".
   - O termo "Editar Vida" será removido ou substituído por uma visualização clara do cálculo automático.

3. **Remoção de Dados Obsoletos**:
   - Os campos `hpMax` e `hpIncreases` nos objetos de slot de Pokémon serão mantidos para compatibilidade de esquema (evitando quebras de salvamento), mas a lógica de renderização passará a ignorá-los em favor do valor calculado dinamicamente.

## Risks / Trade-offs

- **[Risco] Mudança de valores em fichas existentes** → Pokémon que tiveram rolagens de HP acima ou abaixo da média verão seus valores de HP máximo alterados para o novo padrão.
- **[Trade-off] Perda de flexibilidade** → Usuários que desejavam dar bônus de HP personalizados via edição manual não poderão mais fazê-lo diretamente no campo de HP, devendo usar outros mecanismos (como itens ou ajustes em CON) se desejarem alterar a vida.
