## Context

O sistema atual armazena o inventário do treinador como um array de strings (`equipment`), o que dificulta o gerenciamento individual de quantidades e a automação de busca por regras. Atualmente, o equipamento é exibido e editado em um `textarea` simples na aba "Resumo".

## Goals / Non-Goals

**Goals:**
- Criar uma aba "Itens" dedicada para o inventário.
- Transformar a estrutura de `equipment` (strings) para `items` (objetos com `name` e `qty`).
- Implementar UI para adicionar itens com busca preditiva no `rules.json`.
- Permitir alteração de quantidade via botões e remoção de itens.

**Non-Goals:**
- Não implementar sistema de peso ou carga (encumbrance).
- Não automatizar efeitos mecânicos dos itens (ex: usar uma Poção não curará o Pokémon automaticamente nesta fase).

## Decisions

1. **Migração de Dados**:
   - Ao carregar uma ficha, se `items` não existir mas `equipment` existir, o sistema tentará converter as strings para o novo formato (ex: "5 Pokéballs" -> `{ name: "Pokéballs", qty: 5 }`).
   - Se a conversão falhar, usará `qty: 1` por padrão.

2. **Estrutura de UI na Aba de Itens**:
   - **Topo**: Campo de input de texto com uma lista de sugestões (`datalist` ou dropdown customizado) e um botão "Adicionar".
   - **Corpo**: Lista de cards ou linhas de tabela. Cada linha terá:
     - Nome do item.
     - Controle de quantidade (`[ - ] [ 5 ] [ + ]`).
     - Botão de remover (`✕`).

3. **Integração com Rules**:
   - Uma função utilitária em `data-service.js` percorrerá `rules.json` (seção `items`) para extrair todos os nomes de itens únicos e popular as sugestões de busca.

4. **Persistência**:
   - A função `saveSheets` continuará sendo o ponto único de persistência, chamada a cada alteração no inventário.

## Risks / Trade-offs

- **[Risco] Perda de informação na migração** → Como `equipment` é um campo de texto livre, strings complexas podem não ser parseadas perfeitamente para `name/qty`. 
  - *Mitigação*: Manter o campo original `equipment` como backup ou log durante a primeira transição se necessário, ou simplesmente aceitar que o usuário terá que ajustar itens complexos manualmente.
- **[Trade-off] Performance de busca** → Percorrer `rules.json` em cada tecla pressionada pode ser lento.
  - *Mitigação*: Cachear a lista de nomes de itens uma única vez após carregar os dados.
