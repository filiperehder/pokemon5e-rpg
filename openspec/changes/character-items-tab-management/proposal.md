## Why

Atualmente, o gerenciamento de itens na ficha do personagem é limitado a uma lista simples de texto, o que dificulta o controle de inventário, quantidades e a consulta de regras para itens específicos durante o jogo. Como um RPG de mesa, a gestão de recursos é fundamental, e uma interface dedicada com busca e automação de quantidades melhora significativamente a experiência do jogador.

## What Changes

- **Nova Aba de Itens**: Criação de uma aba dedicada "Itens" na ficha do personagem (separada de "Resumo", "Time" e "Notas").
- **Sistema de Gerenciamento**: Possibilidade de adicionar novos itens, remover existentes e editar a quantidade de cada item.
- **Integração com Regras**: Sistema de busca que sugere itens baseados no banco de dados oficial (`rules.json`), preenchendo automaticamente nomes e descrições quando aplicável.
- **Flexibilidade Total**: Permite a entrada manual de itens customizados (Homebrew) que não estão no banco de dados.
- **Visualização Melhorada**: Lista de inventário organizada com indicadores de quantidade e botões de ação rápida (+/-, lixeira).

## Capabilities

### New Capabilities
- `item-management`: Define a lógica de manipulação de inventário (adição, remoção, alteração de quantidade).
- `item-rules-integration`: Define o mecanismo de busca e sugestão de itens a partir do banco de dados de regras.

### Modified Capabilities
- `character-sheet-tabs`: Adicionar a aba "Itens" ao sistema de navegação interna da ficha.
- `trainer-sheet`: Atualizar a estrutura de dados da ficha para suportar uma lista de objetos de item em vez de apenas strings.

## Impact

- **public/js/components/Sheets.js**: Refatoração da renderização do inventário e adição da nova aba.
- **public/js/core/state.js**: Atualização do esquema de dados da ficha para suportar o novo formato de itens.
- **public/js/core/data-service.js**: Adição de utilitários para buscar itens nas regras.
- **Persistência**: Migração automática de listas de strings antigas para o novo formato de objetos de item.
