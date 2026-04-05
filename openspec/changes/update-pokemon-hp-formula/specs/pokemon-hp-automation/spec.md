## ADDED Requirements

### Requirement: Automated Pokémon HP Calculation
The system SHALL automatically calculate the maximum HP of a Pokémon based on its level, hit dice, and Constitution (CON) modifier using a specific formula.

#### Scenario: HP Calculation at Level 1
- **WHEN** a Pokémon is level 1, has a d8 hit die (8 baseHP without CON), and a CON modifier of 2
- **THEN** the Max HP SHALL be 1 * (4.5 + 2 + 0.5) = 7

#### Scenario: HP Calculation at Level 10
- **WHEN** a Pokémon is level 10, has a d10 hit die (10 baseHP without CON), and a CON modifier of 3
- **THEN** the Max HP SHALL be 10 * (5.5 + 3 + 0.5) = 90

#### Scenario: Automatic Update on Level Up
- **WHEN** a Pokémon's level increases
- **THEN** the system SHALL immediately recalculate the Max HP using the new level and current CON modifier.

#### Scenario: Automatic Update on CON Change
- **WHEN** a Pokémon's Constitution attribute changes (due to Nature or ASI)
- **THEN** the system SHALL immediately recalculate the Max HP using the new CON modifier and current level.

### Requirement: Character Sheet UI Update for HP
The character sheet interface SHALL reflect that the HP value is now a calculated "Maximum HP" and is not directly editable in the same way as current HP or manual overrides.

#### Scenario: Rename HP Label
- **WHEN** viewing a Pokémon in the character sheet (Pokedex/Sheets)
- **THEN** the label or title for the HP maximum SHALL be "Vida Máxima".

#### Scenario: Change HP Editing Behavior
- **WHEN** a user interacts with the HP field for a character's Pokémon
- **THEN** the system SHALL treat it as "Vida Máxima" and ensure the value is driven by the automated formula rather than free-form manual entry that overrides rules (unless specifically for temporary bonuses if applicable, but the requirement is to "alterar a opção de editar a vida").
