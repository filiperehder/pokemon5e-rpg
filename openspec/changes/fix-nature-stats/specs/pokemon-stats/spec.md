## ADDED Requirements

### Requirement: Apply Nature Modifiers to Stats
The system SHALL calculate the final Pokémon attributes by correctly applying the nature modifiers to the base attributes.

#### Scenario: Stat increases and decreases
- **WHEN** a Pokémon is assigned a specific Nature
- **THEN** the attribute associated with the buff must increase, and the attribute associated with the debuff must decrease appropriately according to the defined logic.
