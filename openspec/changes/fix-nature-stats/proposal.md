## Why

Pokemon natures provide specific modifiers to their stats (attributes). Currently, there is a bug where these attribute adjustments are not being applied correctly according to the pokemon's nature. This change will ensure that a pokemon's calculated stats accurately reflect its assigned nature.

## What Changes

- Update the stat calculation logic to apply the correct buffs and debuffs based on the Pokémon's nature.
- Ensure that the UI reflects these adjusted attributes correctly when displaying a Pokémon's stats.

## Capabilities

### New Capabilities

### Modified Capabilities
- `pokemon-stats`: Modify the requirement for stat calculations to include nature-based multipliers and modifiers.

## Impact

- Pokémon attribute generation and scaling logic.
- UI components that display Pokémon stats.
