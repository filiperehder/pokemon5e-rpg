## 1. Atualização do Esquema de Dados

- [x] 1.1 Atualizar `newSheet` e `newSheetAndAddPokemon` em `public/js/components/Sheets.js` para inicializar `pokedex: []`.
- [x] 1.2 Garantir que `loadSheets` inicialize `pokedex: []` para fichas legadas que não possuem o campo.

## 2. Refatoração da Interface da Ficha

- [x] 2.1 Adicionar a aba "Pokédex" ao componente de abas no `renderSheetEditor` em `public/js/components/Sheets.js`.
- [x] 2.2 Implementar a função `renderPokedexTab` que desenha o grid de descobertas e a interface de registro.
- [x] 2.3 Criar a função auxiliar `trainerPokedexCardHTML` para renderizar cards normais ou silhuetas baseadas no registro.
- [x] 2.4 Adicionar o filtro "Apenas Registrados" na interface da Pokédex pessoal.

## 3. Lógica de Registro e Estilos

- [x] 3.1 Implementar a função `registerPokemonInSheet` que valida e adiciona um Pokémon à lista da ficha.
- [x] 3.2 Adicionar estilos `.pokedex-card-unknown` e silhuetas em `public/styles.css`.
- [x] 3.3 Adicionar campo de busca com `datalist` (reutilizando a lista global de Pokémon) para facilitar o registro manual na aba.

## 4. Verificação

- [x] 4.1 Testar o registro de um novo Pokémon e verificar se o card muda de "Desconhecido" para visível.
- [x] 4.2 Validar se o progresso da Pokédex é salvo corretamente e persiste após o recarregamento.
- [x] 4.3 Confirmar que a Pokédex de um treinador não afeta a de outro treinador na mesma sessão.
- [x] 4.4 Validar o funcionamento do filtro "Apenas Registrados" (ocultar silhuetas).
