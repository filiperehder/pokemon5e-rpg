## 1. Atualização da Lógica Core

- [ ] 1.1 Modificar `calculateHP` em `public/js/core/pokemon-stats.js` para implementar a nova fórmula linear.
- [ ] 1.2 Garantir que a lógica de extração do dado de vida (Hit Die) a partir do `baseHP` e `baseCON` esteja correta.

## 2. Atualizações de Interface (UI)

- [ ] 2.1 Atualizar `public/js/components/Sheets.js` para renomear rótulos de HP para "Vida Máxima".
- [ ] 2.2 Atualizar `public/js/components/Pokedex.js` para alterar o campo de entrada de HP para "Vida Máxima" e ajustar seu comportamento (exibição vs edição).
- [ ] 2.3 Revisar e traduzir quaisquer tooltips ou textos relacionados à edição de vida para o novo padrão.

## 3. Verificação e Testes

- [ ] 3.1 Validar o cálculo de HP para um Pokémon de nível 1 (deve bater com a fórmula: `1 * (avg + mod + 0.5)`).
- [ ] 3.2 Validar o cálculo de HP para um Pokémon de nível alto (ex: nível 20).
- [ ] 3.3 Confirmar que a mudança de Natureza ou ASI que afete a Constituição atualiza o HP Máximo instantaneamente.
- [ ] 3.4 Confirmar que o nivelamento do Pokémon atualiza o HP Máximo instantaneamente.
