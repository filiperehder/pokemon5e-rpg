export const TRAINER_PROGRESSION = {
  1: { prof: 2, slots: 3, maxCR: '1/2', features: ['Starter Pokémon', 'Specialization'] },
  2: { prof: 2, slots: 3, maxCR: '1', features: ['Trainer Path', 'Control Upgrade'] },
  3: { prof: 2, slots: 3, maxCR: '3', features: ['Control Upgrade'] },
  4: { prof: 2, slots: 3, maxCR: '5', features: ['Ability Score Improvement', 'Control Upgrade'] },
  5: { prof: 3, slots: 4, maxCR: '5', features: ['Trainer Path Feature', 'Pokéslot'] },
  6: { prof: 3, slots: 4, maxCR: '6', features: ['Trainer Orders', 'Control Upgrade'] },
  7: { prof: 3, slots: 4, maxCR: '6', features: ['Specialization'] },
  8: { prof: 3, slots: 4, maxCR: '8', features: ['Ability Score Improvement', 'Control Upgrade'] },
  9: { prof: 4, slots: 4, maxCR: '8', features: ['Trainer Path Feature'] },
  10: { prof: 4, slots: 5, maxCR: '9', features: ['Pokéslot', 'Control Upgrade'] },
  11: { prof: 4, slots: 5, maxCR: '9', features: ['Trainer\'s Resolve'] },
  12: { prof: 4, slots: 5, maxCR: '11', features: ['Ability Score Improvement', 'Control Upgrade'] },
  13: { prof: 5, slots: 5, maxCR: '11', features: ['Pokémon Tracker'] },
  14: { prof: 5, slots: 5, maxCR: '12', features: ['Control Upgrade'] },
  15: { prof: 5, slots: 6, maxCR: '12', features: ['Trainer Path Feature', 'Pokéslot'] },
  16: { prof: 5, slots: 6, maxCR: '12', features: ['Ability Score Improvement'] },
  17: { prof: 6, slots: 6, maxCR: '13', features: ['Control Upgrade'] },
  18: { prof: 6, slots: 6, maxCR: '13', features: ['Specialization'] },
  19: { prof: 6, slots: 6, maxCR: '13', features: ['Ability Score Improvement'] },
  20: { prof: 6, slots: 6, maxCR: '15', features: ['Control Upgrade', 'Master Trainer'] }
};

export const TM_MAP = {
  1:'Work Up',2:'Dragon Claw',3:'Psyshock',4:'Calm Mind',5:'Roar',
  6:'Toxic',7:'Hail',8:'Bulk Up',9:'Venoshock',10:'Hidden Power',
  11:'Sunny Day',12:'Taunt',13:'Ice Beam',14:'Blizzard',15:'Hyper Beam',
  16:'Light Screen',17:'Protect',18:'Rain Dance',19:'Roost',20:'Safeguard',
  21:'Frustration',22:'Solar Beam',23:'Smack Down',24:'Thunderbolt',25:'Thunder',
  26:'Earthquake',27:'Return',28:'Leech Life',29:'Psychic',30:'Shadow Ball',
  31:'Brick Break',32:'Double Team',33:'Reflect',34:'Sludge Wave',35:'Flamethrower',
  36:'Sludge Bomb',37:'Sandstorm',38:'Fire Blast',39:'Rock Tomb',40:'Aerial Ace',
  41:'Torment',42:'Facade',43:'Flame Charge',44:'Rest',45:'Attract',46:'Thief',
  47:'Low Sweep',48:'Round',49:'Echoed Voice',50:'Overheat',51:'Steel Wing',
  52:'Focus Blast',53:'Energy Ball',54:'False Swipe',55:'Scald',56:'Fling',
  57:'Charge Beam',58:'Sky Drop',59:'Brutal Swing',60:'Quash',61:'Will-O-Wisp',
  62:'Acrobatics',63:'Embargo',64:'Explosion',65:'Shadow Claw',66:'Payback',
  67:'Smart Strike',68:'Giga Impact',69:'Rock Polish',70:'Aurora Veil',
  71:'Stone Edge',72:'Volt Switch',73:'Thunder Wave',74:'Gyro Ball',75:'Swords Dance',
  76:'Fly',77:'Psych Up',78:'Bulldoze',79:'Frost Breath',80:'Rock Slide',
  81:'X-Scissor',82:'Dragon Tail',83:'Infestation',84:'Poison Jab',85:'Dream Eater',
  86:'Grass Knot',87:'Swagger',88:'Sleep Talk',89:'U-turn',90:'Substitute',
  91:'Flash Cannon',92:'Trick Room',93:'Wild Charge',94:'Surf',95:'Snarl',
  96:'Nature Power',97:'Dark Pulse',98:'Waterfall',99:'Dazzling Gleam',100:'Confide'
};

export const TYPE_COLORS = {
  'Normal':'#A8A878','Fogo':'#F08030','Fire':'#F08030',
  'Água':'#6890F0','Water':'#6890F0','Planta':'#78C850','Grass':'#78C850',
  'Elétrico':'#F8D030','Electric':'#F8D030','Gelo':'#98D8D8','Ice':'#98D8D8',
  'Lutador':'#C03028','Fighting':'#C03028','Veneno':'#A040A0','Poison':'#A040A0',
  'Terra':'#E0C068','Ground':'#E0C068','Voador':'#A890F0','Flying':'#A890F0',
  'Psíquico':'#F85888','Psychic':'#F85888','Inseto':'#A8B820','Bug':'#A8B820',
  'Pedra':'#B8A038','Rock':'#B8A038','Fantasma':'#705898','Ghost':'#705898',
  'Dragão':'#7038F8','Dragon':'#7038F8','Sombrio':'#705848','Dark':'#705848',
  'Aço':'#B8B8D0','Steel':'#B8B8D0','Fada':'#EE99AC','Fairy':'#EE99AC'
};

export const TRAINER_PATHS = [
  'Ace Trainer','Hobbyist','Nurse','Poké Breeder','Researcher',
  'Pokémon Collector','Pokémon Ranger','Type Expert','Athlete'
];

export const SPECIALIZATIONS = [
  // Tipo de Pokémon
  'Bird Keeper','Bug Maniac','Dragon Tamer','Fairy Tale Expert','Gardener',
  'Hiker','Martial Artist','Mystic','Ninja','Psychic','Punk','Pyromaniac',
  'Rocker','Ruin Maniac','Sailor','Traveler',
  // Habilidades do Treinador
  'Actor','Aroma Lady','Beauty','Biker','Bodybuilder','Burglar','Butler',
  'Camper','Cool Trainer','Detective','Doctor','Engineer','Expert',
  'Firebreather','Grunt','Hex Maniac','Idol','Jogger','Kindler','Lone Wolf',
  'Medium','Musician','Picnicker','PokéFan','Poké Maniac','Pokémon Collector',
  'Rich Trainer','Scientist','Swimmer','Teacher','Triathlete','Veteran',
];

export const PATH_DESCRIPTIONS = {
  'Ace Trainer': {
    summary: 'Focado em batalhas competitivas. Seus Pokémon se tornam guerreiros mais eficientes.',
    bonus: 'Todos os seus Pokémon ganham +1 nos rolamentos de ataque e dano.',
    features: [
      { level: 5,  name: 'Battle Master',    description: 'Ganhe dados de batalha (d6) em quantidade igual ao seu modificador de Destreza. Você distribui esses dados aos seus Pokémon no final de cada descanso longo — cada um pode adicioná-los a um rolamento de ataque ou dano.' },
      { level: 9,  name: 'Rapid Switching',  description: 'Pokémon trocados podem tomar uma ação ou se mover no turno em que entram. Os dados de batalha sobem para d8.' },
      { level: 15, name: 'Tactical Mastery', description: 'A velocidade de todos os seus Pokémon aumenta em 10ft. Escolha um atributo: todos os seus Pokémon (atuais e futuros) aumentam esse atributo em 1. Os dados de batalha sobem para d10.' }
    ]
  },
  'Hobbyist': {
    summary: 'Versátil e multitalentoso. Excelente em diversas habilidades ao mesmo tempo.',
    bonus: 'Escolha duas perícias — você dobra o bônus de proficiência nelas. Seus Pokémon também dobram o bônus se forem proficientes nessas perícias.',
    features: [
      { level: 5,  name: 'Versatile',    description: 'Ganhe dados de habilidade (d6) iguais ao seu modificador de Inteligência. Distribua-os para você ou seus Pokémon — podem ser adicionados a qualquer rolamento de perícia ou teste de resistência.' },
      { level: 9,  name: 'Tinkerer',     description: 'Proficiência em ferramentas de artesão. Durante descansos longos você pode tentar fabricar Pokébolas, X-Items ou Itens Segurados. Os dados de habilidade sobem para d8.' },
      { level: 15, name: 'Multitalented',description: 'Ao capturar um novo Pokémon, aumente dois de seus atributos em 1. Isso se aplica retroativamente a todos os Pokémon já capturados. Os dados de habilidade sobem para d10.' }
    ]
  },
  'Nurse': {
    summary: 'Curandeiro nato. Focado em manter os Pokémon saudáveis e em plena forma.',
    bonus: 'Proficiência em Medicina. Sempre que você usar um item ou habilidade para curar um Pokémon, ele recupera PV adicionais iguais ao seu modificador de Sabedoria.',
    features: [
      { level: 5,  name: 'Pokéchef',        description: 'Você frequentemente tem um petisco delicioso em mãos (2d4+2 PV). Você pode dar como ação bônus; outras criaturas podem dar como ação. Usos iguais ao seu modificador de proficiência por descanso longo.' },
      { level: 9,  name: 'Warning Words',   description: 'Quando um dos seus Pokémon sofrer dano, você pode usar sua reação para reduzir o dano em 2d6 + modificador de Sabedoria. Usos iguais ao modificador de Sabedoria por dia.' },
      { level: 15, name: 'Loyal to a Fault',description: 'Seus Pokémon têm vantagem em testes de resistência contra efeitos negativos de estado. A redução do Warning Words sobe para 3d6 + modificador de Sabedoria.' }
    ]
  },
  'Poké Breeder': {
    summary: 'Criador e mentor de Pokémon. Inspira aliados e extrai o melhor de cada criatura.',
    bonus: 'Adicione metade do seu modificador de Carisma (mínimo 1) a qualquer rolamento de perícia que não use seu bônus de proficiência.',
    features: [
      { level: 5,  name: 'Frying Pan as a Drying Pan', description: 'Como ação, cure um efeito de estado afetando qualquer Pokémon. Usos iguais ao modificador de Carisma por dia.' },
      { level: 9,  name: 'Cheerleader',                description: 'Uma vez por descanso curto, como ação bônus, inspire todos os Pokémon aliados em 200ft. Até o seu próximo turno, adicione seu modificador de Carisma aos ataques, dano ou CA de todos eles.' },
      { level: 15, name: 'Rally',                      description: 'Como ação bônus, escolha um Pokémon em 120ft para receber 1d8 + modificador de Carisma (mínimo 1) de pontos de vida temporários.' }
    ]
  },
  'Researcher': {
    summary: 'Cientista e analista. Usa o conhecimento sobre Pokémon para obter vantagens táticas.',
    bonus: 'Adicione seu modificador de Inteligência (mínimo 1) a qualquer rolamento de perícia que seus Pokémon fizerem. Usos iguais ao bônus de proficiência por descanso longo.',
    features: [
      { level: 5,  name: 'Analyst',             description: 'Como ação ou ação bônus, faça um teste de Investigação contestado pela Enganação do Pokémon alvo. Se vencer, descubra as habilidades dele e o nome de um movimento aleatório que ele conhece.' },
      { level: 9,  name: 'Evolutionary Expert', description: 'Seus Pokémon ganham 1 ponto de atributo extra ao evoluir. Isso se aplica retroativamente. Você também pode ignorar a restrição de máximo 3 pontos por atributo ao evoluir.' },
      { level: 15, name: 'Professor',            description: 'Seu Analyst também revela o PV restante e a CA do alvo. Além disso, seus Pokémon ganham +5 em todos os ataques contra esse alvo até o fim do seu próximo turno.' }
    ]
  },
  'Pokémon Collector': {
    summary: 'Colecionador incansável. Especialista em capturar Pokémon de todas as espécies.',
    bonus: 'Proficiência em Trato com Animais (dobrada). Seu bônus de proficiência nessa perícia é multiplicado por 2.',
    features: [
      { level: 5,  name: 'Gotta Catch \'Em All', description: '+5 em todos os rolamentos de captura. Você também ganha proficiência em mais uma perícia à sua escolha.' },
      { level: 9,  name: 'Careful Catching',     description: 'O bônus de captura sobe para +10. Pokémon capturados são curados de todos os estados negativos e restaurados ao máximo de PV. Você pode tentar capturar como se o Pokémon estivesse com 1/3 do PV total.' },
      { level: 15, name: 'Disciplined Creatures', description: 'Quando um dos seus Pokémon cair a 0 PV, você pode escolher que ele fique with 1 PV em vez disso. Pode ser usado uma vez por Pokémon por descanso longo.' }
    ]
  },
  'Pokémon Ranger': {
    summary: 'Guardião da natureza. Usa o vínculo com o selvagem para capturar e comandar.',
    bonus: 'Proficiência em Natureza e Sobrevivência. Você pode usar a ação Ajudar como ação bônus.',
    features: [
      { level: 5,  name: 'Capture Styler', description: 'Se você tiver corrido ao redor de um Pokémon traçando um caminho fechado, ganha +10 na rolagem para capturá-lo.' },
      { level: 9,  name: 'Bestial Fury',  description: 'Como ação, comande um Pokémon a desferir uma série de ataques corpo a corpo usando apenas 1 PP. Número de ataques igual ao seu modificador de Sabedoria. Pode ser usado uma vez por descanso longo.' },
      { level: 15, name: 'Dominate Pokémon', description: 'Uma vez por descanso longo, como ação bônus, force um Pokémon inimigo em 60ft a fazer um TR de Sabedoria (CD 8 + proficiência + Sabedoria). Em falha, ele segue seus comandos por 1 minuto.' }
    ]
  },
  'Type Expert': {
    summary: 'Mestre de um único tipo. Maximiza o potencial de Pokémon do seu tipo especializado.',
    bonus: 'Escolha um tipo como seu tipo especializado. Movimentos desse tipo usados pelos seus Pokémon podem causar dano máximo. Usos iguais ao modificador de Sabedoria por descanso longo.',
    features: [
      { level: 5,  name: 'Be The Very Best',           description: 'Seus Pokémon do tipo especializado ganham um bônus no ataque igual ao seu modificador de Sabedoria ao usar movimentos desse tipo. O PP de movimentos desse tipo é multiplicado por 1,5 (arredondado para baixo).' },
      { level: 9,  name: 'I\'m Gonna Have My Own Gym', description: 'Enquanto um Pokémon do seu tipo especializado estiver ativo, ele pode obter vantagem em um rolamento de perícia. Usos iguais ao modificador de Sabedoria por descanso longo.' },
      { level: 15, name: 'Type Resistance',             description: 'Escolha um tipo ao qual seu tipo especializado é vulnerável — seus Pokémon desse tipo não são mais vulneráveis a ele.' }
    ]
  },
  'Athlete': {
    summary: 'Treinador físico. Ensina seus Pokémon a usar técnicas de movimento avançadas.',
    bonus: 'Seus Pokémon podem usar as ações Esquivar, Desengajar e Disparar como ações bônus. Usos iguais ao modificador de Força por descanso curto.',
    features: [
      { level: 5,  name: 'Strength of Body', description: 'Uma vez por rodada, seus Pokémon podem adicionar seu modificador de Força ao dano de qualquer movimento com alcance Corpo a Corpo.' },
      { level: 9,  name: 'Indomitable',      description: 'Você pode usar sua reação para fazer um dos seus Pokémon rolar novamente um teste de resistência que falhou. Deve usar o novo resultado. Usos iguais ao modificador de Força por descanso longo.' },
      { level: 15, name: 'Mastery of Self',  description: 'Ao capturar um novo Pokémon, você pode aumentar sua Força, Destreza OU Constituição em 2. Isso se aplica retroativamente a todos os Pokémon já capturados.' }
    ]
  }
};

export const SPEC_DESCRIPTIONS = {
  'Bird Keeper':      { type:'Voador',   bonus:'Proficiência em Percepção.',          effect:'+1 em todos os rolamentos de perícia dos seus Pokémon do tipo Voador.' },
  'Bug Maniac':       { type:'Inseto',   bonus:'Proficiência em Natureza.',            effect:'+1 em todos os rolamentos de perícia dos seus Pokémon do tipo Inseto.' },
  'Picnicker':        { type:'Terra',    bonus:'Proficiência em Sobrevivência.',       effect:'+1 em todos os rolamentos de perícia dos seus Pokémon do tipo Terra.' },
  'Dragon Tamer':     { type:'Dragão',   bonus:'+1 em Sabedoria.',                    effect:'+1 em todos os rolamentos de perícia dos seus Pokémon do tipo Dragão.' },
  'Rocker':           { type:'Elétrico', bonus:'+1 em Inteligência.',                 effect:'+1 em todos os rolamentos de perícia dos seus Pokémon do tipo Elétrico.' },
  'Pyromaniac':       { type:'Fogo',     bonus:'+1 em Carisma.',                      effect:'+1 em todos os rolamentos de perícia dos seus Pokémon do tipo Fogo.' },
  'Gardener':         { type:'Planta',   bonus:'Proficiência em Natureza.',            effect:'+1 em todos os rolamentos de perícia dos seus Pokémon do tipo Planta.' },
  'Martial Artist':   { type:'Lutador',  bonus:'+1 em Força, Constituição ou Destreza.', effect:'+1 em todos os rolamentos de perícia dos seus Pokémon do tipo Lutador.' },
  'Hiker':            { type:'Pedra',    bonus:'+1 em Força, Constituição ou Destreza.', effect:'+1 em todos os rolamentos de perícia dos seus Pokémon do tipo Pedra.' },
  'Sailor':           { type:'Água',     bonus:'+1 em Força, Constituição ou Destreza.', effect:'+1 em todos os rolamentos de perícia dos seus Pokémon do tipo Água.' },
  'Mystic':           { type:'Fantasma', bonus:'Proficiência em Arcanismo.',           effect:'+1 em todos os rolamentos de perícia dos seus Pokémon do tipo Fantasma.' },
  'Detective':        { type:null,       bonus:'+1 em Destreza, Inteligência ou Carisma.', effect:'Proficiência em Investigação.' },
  'Psychic':          { type:'Psíquico', bonus:'+1 em Inteligência.',                 effect:'+1 em todos os rolamentos de perícia dos seus Pokémon do tipo Psíquico.' },
  'Swimmer':          { type:'Água',     bonus:'Velocidade de natação igual à de movimento.', effect:'+1 em todos os rolamentos de perícia dos seus Pokémon do tipo Água.' },
  'Ruin Maniac':      { type:'Aço',      bonus:'Proficiência em História.',            effect:'+1 em todos os rolamentos de perícia dos seus Pokémon do tipo Aço.' },
  'Punk':             { type:'Sombrio',  bonus:'Proficiência em Intimidação.',         effect:'+1 em todos os rolamentos de perícia dos seus Pokémon do tipo Sombrio.' },
  'Traveler':         { type:'Gelo',     bonus:'Aprenda dois idiomas à sua escolha.',  effect:'+1 em todos os rolamentos de perícia dos seus Pokémon do tipo Gelo.' },
  'Fairy Tale Expert':{ type:'Fada',     bonus:'Proficiência em Religião.',            effect:'+1 em todos os rolamentos de perícia dos seus Pokémon do tipo Fada.' },
  'Ninja':            { type:'Veneno',   bonus:'Proficiência em Furtividade.',         effect:'+1 em todos os rolamentos de perícia dos seus Pokémon do tipo Veneno.' },
  'Actor':            { type:null,       bonus:null, effect:'Proficiência em Atuação e Enganação.' },
  'Biker':            { type:null,       bonus:null, effect:'Você possui uma bicicleta dobrável. +2 em Acrobacia e +10ft em saltos horizontais ao usá-la. Velocidade 60ft em superfícies lisas, 40ft em terrenos difíceis.' },
  'PokéFan':          { type:null,       bonus:null, effect:'Você pode usar a Pokédex como ação bônus em vez de ação. O alcance da Pokédex sobe para 100ft.' },
  'Scientist':        { type:null,       bonus:'+1 em Inteligência.', effect:'+2 em todos os rolamentos de perícia dos seus Pokémon artificiais ou fóssil.' },
  'Cool Trainer':     { type:'Normal',   bonus:'+1 em Carisma.',      effect:'+1 em todos os rolamentos de perícia dos seus Pokémon do tipo Normal.' },
  'Rich Trainer':     { type:null,       bonus:null, effect:'Escolha uma MN para adicionar ao seu inventário gratuitamente.' },
  'Grunt':            { type:null,       bonus:null, effect:'A primeira vez que qualquer um dos seus Pokémon cair ao Nível de Vínculo -3, ele fica em -2 em vez disso.' },
  'Pokémon Collector':{ type:null,       bonus:null, effect:'Uma vez por descanso longo, como ação, você pode procurar por um Pokémon específico. Você sabe se ele está em um raio de 8km e em qual direção geral.' },
  'Butler':           { type:null,       bonus:null, effect:'+5 em rolamentos de Carisma ao negociar preços de compra ou venda de itens.' },
  'Musician':         { type:null,       bonus:null, effect:'Ao receber um novo Pokémon sem natureza definida, role duas vezes na tabela de natureza e escolha um dos resultados.' },
  'Veteran':          { type:null,       bonus:null, effect:'Após observar ou interagir com uma criatura por 1 minuto, saiba se ela é superior, igual ou inferior a você em 2 características à sua escolha. Usos iguais ao modificador de Inteligência por descanso longo.' },
  'Lone Wolf':        { type:null,       bonus:null, effect:'Você ganha Visão no Escuro: veja em luz fraca como se fosse luz plena e em escuridão como luz fraca, até 60ft. Apenas tons de cinza na escuridão.' },
  'Firebreather':     { type:null,       bonus:null, effect:'Você aprende o truque Luzes Dançantes.' },
  'Aroma Lady':       { type:null,       bonus:null, effect:'Você aprende o truque Druidcraft.' },
  'Kindler':          { type:null,       bonus:null, effect:'Você aprende o truque Luz.' },
  'Idol':             { type:null,       bonus:null, effect:'Você aprende o truque Amigos.' },
  'Teacher':          { type:null,       bonus:null, effect:'Você aprende o truque Orientação.' },
  'Engineer':         { type:null,       bonus:null, effect:'Você ganha proficiência em três conjuntos de ferramentas à sua escolha.' },
  'Jogger':           { type:null,       bonus:null, effect:'Sua velocidade de movimento aumenta em 10ft.' },
  'Doctor':           { type:null,       bonus:null, effect:'Você pode usar Restaurativos Básicos e Bagas como ação bônus, duas vezes por descanso longo.' },
  'Burglar':          { type:null,       bonus:null, effect:'Proficiência em Furtividade e Prestidigitação.' },
  'Bodybuilder':      { type:null,       bonus:null, effect:'Proficiência em Acrobacia e Atletismo.' },
  'Poké Maniac':      { type:null,       bonus:null, effect:'Proficiência em História e Percepção de Motivação.' },
  'Camper':           { type:null,       bonus:null, effect:'Proficiência em Natureza e Sobrevivência.' },
  'Medium':           { type:null,       bonus:null, effect:'Proficiência em Medicina e Religião.' },
  'Hex Maniac':       { type:null,       bonus:null, effect:'Proficiência em Arcanismo e Intimidação.' },
  'Beauty':           { type:null,       bonus:null, effect:'Proficiência em Persuasão e Trato com Animais.' },
  'Expert':           { type:null,       bonus:null, effect:'Você pode recolher seus Pokémon à Pokébola de uma distância de até 120ft. Ao enviar, ainda devem estar dentro de 60ft.' },
  'Triathlete':       { type:null,       bonus:null, effect:'Quando você trocar um Pokémon, esse Pokémon pode imediatamente se mover até o total de sua velocidade de movimento.' },
};

export const POKESLOTS_BY_LEVEL = {1:3,2:3,3:3,4:3,5:4,6:4,7:4,8:4,9:4,
  10:5,11:5,12:5,13:5,14:5,15:6,16:6,17:6,18:6,19:6,20:6};

export const TRAINER_SKILLS = [
  { id: 'animal_handling', en: 'Animal Handling', pt: 'Adestrar Animais' },
  { id: 'insight', en: 'Insight', pt: 'Intuição' },
  { id: 'intimidation', en: 'Intimidação', pt: 'Intimidação' },
  { id: 'investigation', en: 'Investigation', pt: 'Investigação' },
  { id: 'medicine', en: 'Medicine', pt: 'Medicina' },
  { id: 'nature', en: 'Nature', pt: 'Natureza' },
  { id: 'perception', en: 'Perception', pt: 'Percepção' },
  { id: 'persuasion', en: 'Persuasão', pt: 'Persuasão' },
  { id: 'sleight_of_hand', en: 'Sleight of Hand', pt: 'Prestidigitação' },
  { id: 'stealth', en: 'Stealth', pt: 'Furtividade' },
  { id: 'survival', en: 'Survival', pt: 'Sobrevivência' },
  { id: 'arcana', en: 'Arcana', pt: 'Arcanismo' },
  { id: 'history', en: 'History', pt: 'História' },
  { id: 'religion', en: 'Religion', pt: 'Religião' },
  { id: 'performance', en: 'Performance', pt: 'Atuação' },
  { id: 'deception', en: 'Deception', pt: 'Enganação' },
  { id: 'acrobatics', en: 'Acrobatics', pt: 'Acrobacia' },
  { id: 'athletics', en: 'Athletics', pt: 'Atletismo' }
];

export const SPEC_ATTR_BONUS = {
  'Dragon Tamer': 'wis',
  'Rocker': 'int',
  'Pyromaniac': 'cha',
  'Psychic': 'int',
  'Scientist': 'int',
  'Cool Trainer': 'cha',
  'Detective': ['dex', 'int', 'cha'],
  'Martial Artist': ['str', 'con', 'dex'],
  'Hiker': ['str', 'con', 'dex'],
  'Sailor': ['str', 'con', 'dex']
};

export const MOVES_PER_PAGE = 60;

export const PACK_OPTIONS = [
  { id: 'dungeoneer', name: 'Pacote de Masmorras', items: ['Tocha (10)', 'Rações (10 dias)', 'Corda de cânhamo (50 pés)', 'Pé de cabra', 'Martelo', 'Pítons (10)', 'Lanterna furta-fogo', 'Óleo (2 frascos)', 'Pequena caixa de metal', 'Pote de tinta', 'Caneta de pena', 'Folhas de papel (10)', 'Faca pequena', 'Saco de areia'] },
  { id: 'explorer', name: 'Pacote de Explorador', items: ['Mochila', 'Saco de dormir', 'Kit de refeição', 'Caixa de fogo', 'Tocha (10)', 'Rações (10 dias)', 'Cantil', 'Corda de cânhamo (50 pés)'] },
  { id: 'scholar', name: 'Pacote de Estudioso', items: ['Mochila', 'Livro de estudo', 'Pote de tinta', 'Caneta de pena', 'Folhas de papel (10)', 'Pequena faca', 'Saco de areia'] },
  { id: 'burglar', name: 'Pacote de Burguês', items: ['Mochila', 'Saco de 1.000 esferas metálicas', '15 metros de linha de sino', 'Sino', 'Velas (5)', 'Pé de cabra', 'Martelo', 'Pítons (10)', 'Lanterna furta-fogo', 'Óleo (2 frascos)', 'Rações (5 dias)', 'Caixa de fogo', 'Cantil'] }
];
