## ADDED Requirements

### Requirement: Entrada de Nível de NPC
O sistema SHALL fornecer uma interface na aba do Mestre (Master Tab) para selecionar ou inserir o Nível do NPC (1 a 20).

#### Scenario: Seleção de nível válida
- **WHEN** o Mestre seleciona o nível 3 para o NPC
- **THEN** o sistema SHALL habilitar a geração de um time para um NPC de nível 3.

### Requirement: Geração Automática de Time de Pokémon
O sistema SHALL gerar automaticamente uma lista de Pokémon para o NPC baseada no seu nível. A quantidade de Pokémon SHALL seguir a regra:
- Nível 1 ao 4: 3 Pokémon
- Nível 5 ao 9: 4 Pokémon
- Nível 10 ao 14: 5 Pokémon
- Nível 15 ao 20: 6 Pokémon

#### Scenario: Geração de time para nível 3
- **WHEN** o Mestre solicita a geração de um NPC de nível 3
- **THEN** o sistema SHALL gerar uma lista com exatamente 3 Pokémon.

### Requirement: Cálculo de Somatório de Níveis de Pokémon
O somatório total de níveis de todos os Pokémon no time do NPC SHALL seguir a tabela de progressão do sistema:
- Nível 1: 1 (assumido)
- Nível 2: 3
- Nível 3: 5
- Nível 4: 7
- Nível 5: 10
- Nível 6: 18
- Nível 7: 24
- Nível 8: 27
- Nível 9: 30
- Nível 10: 33
- Nível 11: 46
- Nível 12: 50
- Nível 13: 55
- Nível 14: 60
- Nível 15: 65
- Nível 16: 78
- Nível 17: 83
- Nível 18: 87
- Nível 19: 92
- Nível 20: 100

#### Scenario: Distribuição de níveis para NPC nível 3
- **WHEN** um NPC de nível 3 é gerado
- **THEN** o sistema SHALL distribuir 5 níveis entre os 3 Pokémon (ex: níveis 2, 2 e 1).

### Requirement: Limite de CR por Nível de NPC
O Challenge Rating (CR) de cada Pokémon individual no time do NPC SHALL respeitar a tabela de "Max CR" para o nível do treinador (ex: Nível 3 é Max CR 3).

#### Scenario: Validação de CR para NPC nível 3
- **WHEN** um Pokémon é selecionado para o time de um NPC nível 3
- **THEN** o sistema SHALL garantir que o CR desse Pokémon seja menor ou igual a 3.

### Requirement: Seleção de Dificuldade
O sistema SHALL permitir a seleção de uma dificuldade para a geração do NPC (Fácil, Médio, Difícil).

#### Scenario: Seleção de dificuldade Difícil
- **WHEN** o Mestre seleciona o nível 5 e a dificuldade "Difícil"
- **THEN** o sistema SHALL priorizar Pokémon com CR entre 2.5 e 5 (metade ao Max CR permitido).

### Requirement: Filtro de CR por Dificuldade
O Challenge Rating (CR) dos Pokémon gerados SHALL ser filtrado de acordo com a dificuldade escolhida:
- **Fácil**: Pokémon com CR <= 1/3 do Max CR permitido.
- **Médio**: Pokémon com CR entre 1/3 e 2/3 do Max CR permitido.
- **Difícil**: Pokémon com CR entre 1/2 e o Max CR permitido.

#### Scenario: Validação de CR Fácil para nível 10
- **WHEN** um NPC de nível 10 (Max CR 9) é gerado na dificuldade "Fácil"
- **THEN** o sistema SHALL selecionar Pokémon com CR <= 3.
