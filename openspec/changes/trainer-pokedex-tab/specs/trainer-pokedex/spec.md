## ADDED Requirements

### Requirement: Trainer Pokédex Progress Tracking
O sistema SHALL permitir que cada treinador mantenha seu próprio registro de progresso de descobertas Pokémon.

#### Scenario: Storing discoveries
- **WHEN** um treinador registra um novo Pokémon
- **THEN** o ID ou número desse Pokémon SHALL ser adicionado a uma lista persistente associada à ficha do treinador.

### Requirement: Discovery-Based Display
A Pokédex do treinador SHALL exibir detalhes apenas para Pokémon registrados, ocultando informações de entradas não descobertas.

#### Scenario: Displaying a registered Pokémon
- **WHEN** o usuário visualiza um Pokémon que já foi registrado na sua Pokédex pessoal
- **THEN** o sistema SHALL exibir o nome, imagem e tipos do Pokémon normalmente.

#### Scenario: Displaying an unregistered Pokémon
- **WHEN** o usuário visualiza uma entrada de Pokédex que ainda não foi registrada
- **THEN** o sistema SHALL exibir o número da entrada e o texto "Desconhecido", ocultando imagem e detalhes específicos.

### Requirement: Registered-Only Filter
O sistema SHALL prover uma opção para filtrar a exibição da Pokédex pessoal, mostrando apenas os Pokémon registrados.

#### Scenario: Activating discovery filter
- **WHEN** o usuário ativa o filtro "Apenas Registrados" na aba Pokédex
- **THEN** o sistema SHALL ocultar todos os placeholders de "Desconhecido" e exibir apenas os cards dos Pokémon já descobertos.

### Requirement: In-Sheet Registration Mechanism
O sistema SHALL prover uma interface dentro da aba "Pokédex" da ficha para que o usuário registre manualmente novas descobertas.

#### Scenario: Registering by number or name
- **WHEN** o usuário insere o número ou nome de um Pokémon no campo de registro da aba Pokédex e confirma
- **THEN** o sistema SHALL validar a entrada e adicionar o Pokémon à lista de registros do treinador se ele existir no banco de dados global.
