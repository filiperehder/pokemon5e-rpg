## Context

O sistema atual possui uma aba de Mestre (Wizard) que oferece ferramentas de auxílio ao DM. A geração de encontros e NPCs é feita manualmente. Existe uma infraestrutura sólida de dados de Pokémon e regras de cálculo de atributos, mas falta uma ferramenta que automatize a criação de treinadores inimigos seguindo as regras de balanceamento do sistema.

## Goals / Non-Goals

**Goals:**
- Prover uma interface simples na aba do Mestre para gerar times de Pokémon para NPCs.
- Implementar a lógica de distribuição de níveis e restrição de CR conforme as regras fornecidas.
- Reutilizar os componentes de visualização de blocos de estatísticas de Pokémon existentes.

**Non-Goals:**
- Criação de fichas completas de treinador (Trainer Sheets) com inventário e perícias.
- Persistência permanente de NPCs gerados (serão temporários para combate).
- Edição manual dos atributos do Pokémon gerado além da sua escolha inicial.

## Decisions

- **Localização da Lógica**: Criar um novo módulo `public/js/core/npc-generator.js` para centralizar as fórmulas de geração e seleção de Pokémon.
- **Integração de UI**: Adicionar uma nova seção no componente `Wizard.js` denominada "NPC Combat Generator".
- **Algoritmo de Distribuição de Nível**:
  - `total_levels` por nível de NPC:
    - 1: 1
    - 2: 3
    - 3: 5
    - 4: 7
    - 5: 10
    - 6: 18
    - 7: 24
    - 8: 27
    - 9: 30
    - 10: 33
    - 11: 46
    - 12: 50
    - 13: 55
    - 14: 60
    - 15: 65
    - 16: 78
    - 17: 83
    - 18: 87
    - 19: 92
    - 20: 100
  - `num_pokemon` por nível de NPC:
    - 1-4: 3
    - 5-9: 4
    - 10-14: 5
    - 15-20: 6
  - A lógica distribuirá os `total_levels` entre os `num_pokemon`, garantindo que cada um tenha no mínimo nível 1.
- **Seleção de Pokémon**: A seleção será aleatória dentro do dataset `pokemon.json`, filtrando por `CR <= maxCR` (conforme tabela de Trainer Progression do sistema).

## Risks / Trade-offs

- **[Risco]** Muitos Pokémon no time para níveis altos de NPC.
  - **Mitigação**: O sistema segue estritamente a regra `num_pokemon = npc_level`. Para níveis muito altos (ex: 15+), a interface deve ser limpa para não sobrecarregar visualmente.
- **[Risco]** Pokémon com CR muito baixo para NPCs de nível alto.
  - **Mitigação**: O filtro de CR deve ser inteligente, priorizando Pokémon cujo CR seja próximo ao nível do NPC, mas permitindo variações para preencher o time.
- **[Trade-off]** Simplicidade vs Customização.
  - **Decisão**: Focar em um gerador "one-click" para velocidade de jogo, em detrimento de ajustes finos manuais.
