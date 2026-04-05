## Context

Pokémon attributes are a core part of gameplay, defining their strength, defense, speed, etc. Natures are a mechanism that modify these attributes, typically increasing one stat and decreasing another according to the ruleset. Currently, there is a bug where these nature modifiers are not correctly applying to the base attributes.

## Goals / Non-Goals

**Goals:**
- Identify where character/Pokémon stats are calculated and stored.
- Implement the correct value multiplier or additive logic based on Pokémon Natures.
- Ensure the UI correctly reflects the nature-adjusted stats.

**Non-Goals:**
- Redesigning the entire stat system.
- Adding new Natures not already present in the existing list.

## Decisions

- **Stat Calculation Logic Update**: We will update the exact utility, service method, or component responsible for applying a Pokémon's final stats. It should take the base stat and correctly apply the Nature buffs and debuffs.
- We will lookup the nature effect based on an established ruleset/table in the project's data or constants.

## Risks / Trade-offs

- **Risk**: Incorrect stat calculation formula could break game balance.
  - **Mitigation**: We will ensure we are strictly following the defined ruleset for how Natures affect stats and test with edge cases (e.g., neutral natures).
