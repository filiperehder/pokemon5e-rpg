## Context

Atualmente, a Pokédex da aplicação é uma lista global. Para dar uma sensação de progresso individual em um RPG, cada treinador deve ter seu próprio registro. Já temos um sistema de abas na ficha e um componente de Pokédex global que pode servir de base para esta funcionalidade.

## Goals / Non-Goals

**Goals:**
- Implementar uma aba "Pokédex" exclusiva dentro da ficha do treinador.
- Garantir que apenas os Pokémon registrados (vistos/capturados) mostrem seus detalhes.
- Permitir que o usuário registre novos Pokémon diretamente pela aba.
- Persistir esse progresso no objeto da ficha.

**Non-Goals:**
- Não alterar o funcionamento da Pokédex global (que continua sendo uma enciclopédia completa).
- Não implementar sistema de "visto vs capturado" (apenas um estado: "registrado").

## Decisions

1. **Estrutura de Dados**:
   - Cada objeto de ficha em `state.sheets` ganhará um campo `pokedex: number[]` (contendo os números dos Pokémon registrados).
   - Ao carregar uma ficha, se o campo não existir, será inicializado como um array vazio.

2. **Interface da Aba (`renderPokedexTab`)**:
   - **Registro**: Um campo de input com busca (reutilizando a lógica de itens se possível) ou simplesmente um campo numérico/texto para registrar por número/nome.
   - **Filtro**: Adição de um checkbox "Mostrar apenas registrados".
   - **Exibição**: Um grid similar à Pokédex global, mas percorrendo todos os 151+ Pokémon.
     - Se o filtro estiver ativo, apenas os Pokémon em `sheet.pokedex` são iterados.
     - Se `pokedex.includes(p.number)`, renderiza o card normal.
     - Caso contrário (e filtro inativo), renderiza um "Placeholder de Desconhecido" (Número + "? ? ?" + Silhueta).

3. **Estilização**:
   - Criar uma classe `.pokedex-card-unknown` no CSS que aplica um filtro de brilho zero ou escala de cinza e oculta os tipos.

4. **Reuso de Componentes**:
   - Tentar abstrair a lógica de renderização de cards da Pokédex em `Pokedex.js` para que possa ser chamada com um "modo de silhueta" opcional.

## Risks / Trade-offs

- **[Risco] Performance de Renderização** → Renderizar 151+ cards (mesmo que placeholders) dentro da ficha pode ser pesado se não for feito com cuidado.
  - *Mitigação*: Usar a mesma técnica de lazy render/filtros já usada na Pokédex global se necessário, ou focar em exibir apenas os registros atuais primeiro.
- **[Trade-off] Complexidade de Reuso** → Modificar `Pokedex.js` para suportar o modo treinador pode introduzir bugs na Pokédex global.
  - *Decisão*: Criar uma função de renderização de card simplificada em `Sheets.js` especificamente para esta aba para manter o isolamento.
