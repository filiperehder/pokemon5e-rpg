/* ================================================================
   POKÉMON 5E COMPANION — app.js
   ================================================================ */

'use strict';

// ── Constants ─────────────────────────────────────────────────────
const TM_MAP = {
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

const TYPE_COLORS = {
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

const TRAINER_PATHS = [
  'Ace Trainer','Hobbyist','Nurse','Poké Breeder','Researcher',
  'Pokémon Collector','Pokémon Ranger','Type Expert','Athlete'
];

const SPECIALIZATIONS = [
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

// ── Path & Specialization Descriptions ────────────────────────────
const PATH_DESCRIPTIONS = {
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
      { level: 15, name: 'Disciplined Creatures', description: 'Quando um dos seus Pokémon cair a 0 PV, você pode escolher que ele fique com 1 PV em vez disso. Pode ser usado uma vez por Pokémon por descanso longo.' }
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

const SPEC_DESCRIPTIONS = {
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

const POKESLOTS_BY_LEVEL = {1:3,2:3,3:3,4:3,5:4,6:4,7:4,8:4,9:4,
  10:5,11:5,12:5,13:5,14:5,15:6,16:6,17:6,18:6,19:6,20:6};

const TRAINER_SKILLS = [
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

const SPEC_ATTR_BONUS = {
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

const PACK_OPTIONS = [
  { id: 'dungeoneer', name: 'Pacote de Masmorras', items: ['Tocha (10)', 'Rações (10 dias)', 'Corda de cânhamo (50 pés)', 'Pé de cabra', 'Martelo', 'Pítons (10)', 'Lanterna furta-fogo', 'Óleo (2 frascos)', 'Pequena caixa de metal', 'Pote de tinta', 'Caneta de pena', 'Folhas de papel (10)', 'Faca pequena', 'Saco de areia'] },
  { id: 'explorer', name: 'Pacote de Explorador', items: ['Mochila', 'Saco de dormir', 'Kit de refeição', 'Caixa de fogo', 'Tocha (10)', 'Rações (10 dias)', 'Cantil', 'Corda de cânhamo (50 pés)'] },
  { id: 'scholar', name: 'Pacote de Estudioso', items: ['Mochila', 'Livro de estudo', 'Pote de tinta', 'Caneta de pena', 'Folhas de papel (10)', 'Pequena faca', 'Saco de areia'] },
  { id: 'burglar', name: 'Pacote de Burguês', items: ['Mochila', 'Saco de 1.000 esferas metálicas', '15 metros de linha de sino', 'Sino', 'Velas (5)', 'Pé de cabra', 'Martelo', 'Pítons (10)', 'Lanterna furta-fogo', 'Óleo (2 frascos)', 'Rações (5 dias)', 'Caixa de fogo', 'Cantil'] }
];

// ── State ──────────────────────────────────────────────────────────
let allPokemon = [];
let allMoves   = [];
let allRules   = [];
let moveMap    = {};   // name → move object

let activePage    = 'pokedex';
let selectedPokemon = null;
let selectedMove    = null;

let pokedexFilters = { search:'', type:'', cr:'', size:'' };
let moveFilters    = { search:'', type:'' };
let movePage       = 1;
const MOVES_PER_PAGE = 60;

let rulesState = { chapterId: null, sectionId: null };

let sheets      = [];
let editingSheet = null;
let addToSheetTargetPokemon = null;

// ── Init ───────────────────────────────────────────────────────────
async function init() {
  try {
    const [pokeRes, movesRes, rulesRes] = await Promise.all([
      fetch('./data/pokemon.json'),
      fetch('./data/moves.json'),
      fetch('./data/rules.json')
    ]);
    allPokemon = await pokeRes.json();
    allMoves   = await movesRes.json();
    allRules   = await rulesRes.json();

    // Build move lookup map
    allMoves.forEach(m => { moveMap[m.name.toLowerCase()] = m; });

    loadSheets();
    populateFilters();
    setupNavigation();
    navigateTo(getPageFromHash() || 'pokedex');

    document.getElementById('loading-overlay').classList.add('hidden');
  } catch (err) {
    console.error('Error loading data:', err);
    document.getElementById('loading-overlay').innerHTML = `
      <div style="text-align:center;padding:32px;">
        <div style="font-size:2rem;margin-bottom:16px;">⚠️</div>
        <div style="font-family:var(--font-heading);color:var(--gold);margin-bottom:8px;">Erro ao carregar dados</div>
        <div style="color:var(--text-secondary);font-size:0.875rem;margin-bottom:16px;">
          Abra o aplicativo através de um servidor local.<br>
          Execute: <code style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:4px;">node server.js</code><br>
          Depois acesse: <code style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:4px;">http://localhost:3000</code>
        </div>
        <div style="color:var(--text-muted);font-size:0.75rem;">${err.message}</div>
      </div>
    `;
  }
}

function getPageFromHash() {
  const h = window.location.hash.replace('#','');
  return ['pokedex','regras','fichas','movimentos'].includes(h) ? h : null;
}

// ── Navigation ────────────────────────────────────────────────────
function setupNavigation() {
  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', () => navigateTo(el.dataset.page));
  });
  window.addEventListener('hashchange', () => {
    const p = getPageFromHash();
    if (p && p !== activePage) navigateTo(p, false);
  });
}

function navigateTo(page, updateHash = true) {
  activePage = page;

  // Update nav active states
  document.querySelectorAll('[data-page]').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });

  // Show/hide pages
  document.querySelectorAll('.page').forEach(el => {
    el.classList.toggle('active', el.id === `page-${page}`);
  });

  if (updateHash) history.replaceState(null, '', `#${page}`);

  // Lazy render
  if (page === 'pokedex')    renderPokedex();
  if (page === 'movimentos') renderMoves();
  if (page === 'regras')     renderRules();
  if (page === 'fichas')     renderSheets();
}

// ── Filters Population ────────────────────────────────────────────
function populateFilters() {
  // Type filter (for both Pokédex and Moves)
  const types = [...new Set(allPokemon.flatMap(p => p.types.map(t => t.pt)))].sort();
  const moveTypes = [...new Set(allMoves.map(m => m.type.pt).filter(Boolean))].sort();

  const pokeTypeEl = document.getElementById('filter-type');
  if (pokeTypeEl) {
    types.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t; opt.textContent = t;
      pokeTypeEl.appendChild(opt);
    });
  }

  const moveTypeEl = document.getElementById('filter-move-type');
  if (moveTypeEl) {
    moveTypes.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t; opt.textContent = t;
      moveTypeEl.appendChild(opt);
    });
  }
}

// ── Utilities ─────────────────────────────────────────────────────
function getTypeColor(typeName) {
  return TYPE_COLORS[typeName] || '#777';
}

function typeBadgeHTML(typeObj) {
  const color = getTypeColor(typeObj.pt || typeObj.en);
  return `<span class="type-badge" style="--badge-color:${color}">${typeObj.pt || typeObj.en}</span>`;
}

function padNum(n) {
  return String(n).padStart(3,'0');
}

function spriteURL(number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${number}.png`;
}

function formatMod(n) {
  return n >= 0 ? `+${n}` : `${n}`;
}

function statBarWidth(val, max = 20) {
  return Math.min(100, (val / max) * 100);
}

function getStatColor(stat) {
  const colors = { FOR:'#F08030', DES:'#F8D030', CON:'#78C850',
                   INT:'#6890F0', SAB:'#A890F0', CAR:'#F85888' };
  return colors[stat] || '#aaa';
}

function renderMarkdownText(text) {
  if (!text) return '';
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
}

function showToast(msg, type = 'success') {
  const tc = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${type === 'success' ? '✓' : '✕'}</span> ${msg}`;
  tc.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

// ── Pokédex Page ──────────────────────────────────────────────────
function renderPokedex() {
  const filtered = filterPokemonList();
  const grid = document.getElementById('pokemon-grid');
  const countEl = document.getElementById('poke-count');
  if (countEl) countEl.textContent = `${filtered.length} Pokémon`;

  if (!filtered.length) {
    grid.innerHTML = '<div class="no-results">Nenhum Pokémon encontrado.</div>';
    return;
  }

  grid.innerHTML = filtered.map(p => pokemonCardHTML(p)).join('');

  // Add click handlers
  grid.querySelectorAll('.pokemon-card').forEach((card, i) => {
    card.addEventListener('click', () => openPokemonDetail(filtered[i]));
  });
}

function filterPokemonList() {
  let list = allPokemon;
  const f = pokedexFilters;
  if (f.search) {
    const s = f.search.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(s));
  }
  if (f.type) {
    list = list.filter(p => p.types.some(t => t.pt === f.type || t.en === f.type));
  }
  if (f.cr) {
    list = list.filter(p => String(p.cr) === f.cr);
  }
  if (f.size) {
    list = list.filter(p => p.size.pt === f.size || p.size.en === f.size);
  }
  return list;
}

function pokemonCardHTML(p) {
  const primaryType = p.types[0];
  const typeColor = getTypeColor(primaryType?.pt || '');
  const typeBadges = p.types.map(t => typeBadgeHTML(t)).join('');
  const speedStr = Object.entries(p.speed || {})
    .map(([k,v]) => `${v}ft${k !== 'walk' ? ` (${k === 'fly' ? '✦' : '~'})` : ''}`)
    .join(' / ');

  return `
    <div class="pokemon-card" style="--type-color:${typeColor}">
      <div class="pokemon-card-img">
        <span class="pokemon-number">#${padNum(p.number)}</span>
        <img src="${spriteURL(p.number)}" alt="${p.name}" loading="lazy"
             onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 96 96%22><text y=%2272%22 font-size=%2272%22>🔮</text></svg>'">
      </div>
      <div class="pokemon-card-info">
        <div class="pokemon-card-name">${p.name}</div>
        <div class="pokemon-card-types">${typeBadges}</div>
        <div class="pokemon-card-meta">
          <span>Nv.${p.level}</span>
          <span>CR ${p.cr}</span>
          <span>${speedStr}</span>
        </div>
      </div>
    </div>`;
}

// Pokédex filter handlers
function setupPokedexFilters() {
  const search = document.getElementById('search-pokemon');
  const type   = document.getElementById('filter-type');
  const cr     = document.getElementById('filter-cr');
  const size   = document.getElementById('filter-size');

  if (search) search.addEventListener('input', () => {
    pokedexFilters.search = search.value;
    renderPokedex();
  });
  if (type) type.addEventListener('change', () => {
    pokedexFilters.type = type.value;
    renderPokedex();
  });
  if (cr) cr.addEventListener('change', () => {
    pokedexFilters.cr = cr.value;
    renderPokedex();
  });
  if (size) size.addEventListener('change', () => {
    pokedexFilters.size = size.value;
    renderPokedex();
  });
}

// ── Pokemon Detail Modal ───────────────────────────────────────────
function openPokemonDetail(pokemon, options = {}) {
  selectedPokemon = pokemon;
  const modal   = document.getElementById('pokemon-modal');
  const content = document.getElementById('pokemon-detail-content');
  const typeColor = getTypeColor(pokemon.types[0]?.pt || '');

  content.innerHTML = buildPokemonDetailHTML(pokemon, typeColor, options);

  // Move chips → show inline (never open the slide panel from inside the modal)
  content.querySelectorAll('.move-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      const move = moveMap[chip.dataset.move?.toLowerCase()];
      if (move) showMoveInModal(move);
    });
  });

  // Active move cards → also clickable for inline detail
  content.querySelectorAll('.active-move-card[data-move]').forEach(card => {
    card.addEventListener('click', () => {
      const move = moveMap[card.dataset.move?.toLowerCase()];
      if (move) showMoveInModal(move);
    });
  });

  // Add to sheet button (only present in normal mode)
  const addBtn = content.querySelector('#btn-add-to-sheet');
  if (addBtn) addBtn.addEventListener('click', () => openAddToSheet(pokemon));

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

// Show move details inline inside the Pokemon modal (avoids z-index/blur problem)
function showMoveInModal(move) {
  const card = document.getElementById('modal-inline-move');
  if (!card) return;

  const typeColor = getTypeColor(move.type.pt || move.type.en || '');
  const badge = `<span class="type-badge" style="--badge-color:${typeColor}">${move.type.pt || move.type.en || '—'}</span>`;

  card.innerHTML = `
    <div class="inline-move-card">
      <div class="inline-move-header">
        <span class="inline-move-name">${move.name}</span>
        ${badge}
        <button class="inline-move-close" onclick="document.getElementById('modal-inline-move').innerHTML=''">✕</button>
      </div>
      <div class="inline-move-fields">
        <span><strong>PP</strong> ${move.pp || '—'}</span>
        <span><strong>Ação</strong> ${move.moveTime.pt || move.moveTime.en || '—'}</span>
        <span><strong>Alcance</strong> ${move.range || '—'}</span>
        <span><strong>Poder</strong> ${move.movePower.pt || move.movePower.en || '—'}</span>
      </div>
      ${(move.description?.pt || move.description?.en || move.description) ? `<div class="inline-move-desc">${move.description.pt || move.description.en || move.description}</div>` : ''}
      ${(move.higherLevels?.pt || move.higherLevels?.en || move.higherLevels) ? `<div class="inline-move-higher"><strong>Níveis maiores:</strong> ${move.higherLevels.pt || move.higherLevels.en || move.higherLevels}</div>` : ''}
    </div>`;

  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Open Pokemon detail in "ficha mode" — shows selected moves prominently
function openPokemonSheetDetail(slotIdx, sheetIdx) {
  const sheet = sheets[sheetIdx];
  if (!sheet?.pokemon?.[slotIdx]) return;
  const slotData = sheet.pokemon[slotIdx];
  const pokemon  = allPokemon.find(pk => pk.number === slotData.number);
  if (!pokemon) return;

  openPokemonDetail(pokemon, {
    sheetMode:     true,
    selectedMoves: slotData.selectedMoves || [],
    currentLevel:  slotData.level || pokemon.level
  });
}

function closePokemonDetail() {
  document.getElementById('pokemon-modal').classList.remove('open');
  document.body.style.overflow = '';
}

function buildPokemonDetailHTML(p, typeColor, options = {}) {
  const { sheetMode = false, selectedMoves = [], currentLevel = p.level } = options;

  const typeBadges = p.types.map(t => typeBadgeHTML(t)).join('');
  const speedStr = Object.entries(p.speed || {}).map(([k,v]) => {
    const label = { walk:'Andar', fly:'Voar', swim:'Nadar' };
    return `${v}ft ${label[k] || k}`;
  }).join(' / ');

  // Stats
  const statsHTML = ['FOR','DES','CON','INT','SAB','CAR'].map(s => `
    <div class="stat-item">
      <div class="stat-label">${s}</div>
      <div class="stat-value">${p.stats[s] ?? '—'}</div>
      <div class="stat-modifier">${formatMod(p.modifiers?.[s] ?? 0)}</div>
      <div class="stat-bar-wrap">
        <div class="stat-bar-fill" style="width:${statBarWidth(p.stats[s] ?? 0)}%;background:${getStatColor(s)}"></div>
      </div>
    </div>`).join('');

  // Resistances / Vulnerabilities / Immunities
  const resistHTML = (p.resistances || []).map(t =>
    `<span class="tag resist" style="border-color:${getTypeColor(t.pt || t.en)}40;color:${getTypeColor(t.pt || t.en)}">${t.pt || t.en}</span>`).join('');
  const vulnHTML = (p.vulnerabilities || []).map(t =>
    `<span class="tag vuln" style="border-color:${getTypeColor(t.pt || t.en)}40;color:${getTypeColor(t.pt || t.en)}">${t.pt || t.en}</span>`).join('');
  const immuneHTML = (p.immunities || []).map(t =>
    `<span class="tag immune" style="color:${getTypeColor(t.pt || t.en)}">${t.pt || t.en}</span>`).join('');

  // Abilities
  const abilitiesHTML = (p.abilities || []).map(a => `
    <div class="ability-item">
      <div class="ability-name">${a.name}</div>
      <div class="ability-desc">${a.description}</div>
    </div>`).join('');

  // Moves
  const movesHTML = buildMovesHTML(p);

  // Saving throws & Skills
  const stStr = (p.savingThrows || []).map(s => s.pt || s.en).join(', ') || '—';
  const skillsStr = (p.skills || []).join(', ') || '—';

  return `
    <div class="detail-header" style="--type-color:${typeColor}">
      <img class="detail-sprite" src="${spriteURL(p.number)}" alt="${p.name}"
           onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 120 120%22><text y=%2290%22 font-size=%2290%22>🔮</text></svg>'">
      <div class="detail-header-info">
        <div class="detail-number">#${padNum(p.number)} — ${p.size.pt || p.size.en}</div>
        <div class="detail-name">${p.name}</div>
        <div class="detail-types">${typeBadges}</div>
        <div class="detail-meta">
          <div class="detail-meta-item"><strong>Nível</strong> ${currentLevel}</div>
          <div class="detail-meta-item"><strong>CR</strong> ${p.cr}</div>
          <div class="detail-meta-item"><strong>Velocidade</strong> ${speedStr}</div>
        </div>
        ${sheetMode ? `<div style="margin-top:8px"><span class="sheet-mode-badge">📋 Ficha do Jogador</span></div>` : ''}
      </div>
      <button class="btn-close" onclick="closePokemonDetail()">✕</button>
    </div>

    <div class="detail-body">
      <!-- Combat Stats -->
      <div class="detail-section">
        <div class="combat-stats">
          <div class="combat-stat">
            <div class="combat-stat-val">${p.armorClass}</div>
            <div class="combat-stat-label">Classe de Armadura</div>
          </div>
          <div class="combat-stat">
            <div class="combat-stat-val">${p.hitPoints}</div>
            <div class="combat-stat-label">Pontos de Vida (${p.hitDice})</div>
          </div>
          <div class="combat-stat">
            <div class="combat-stat-val">${p.cr}</div>
            <div class="combat-stat-label">CR Base</div>
          </div>
        </div>
      </div>

      <!-- Ability Scores -->
      <div class="detail-section">
        <div class="detail-section-title">Atributos</div>
        <div class="stat-block">
          <div class="stat-block-grid">${statsHTML}</div>
        </div>
      </div>

      <!-- Combat Info -->
      <div class="detail-section">
        <div class="detail-section-title">Informações de Combate</div>
        <div style="display:grid;gap:8px;font-size:0.85rem;">
          <div><span style="color:var(--text-muted)">Testes de Resistência:</span> <span style="color:var(--text-primary)">${stStr}</span></div>
          <div><span style="color:var(--text-muted)">Perícias:</span> <span style="color:var(--text-primary)">${skillsStr}</span></div>
          ${resistHTML ? `<div><span style="color:var(--text-muted)">Resistências:</span><div class="tags-row" style="margin-top:4px">${resistHTML}</div></div>` : ''}
          ${vulnHTML ? `<div><span style="color:var(--text-muted)">Vulnerabilidades:</span><div class="tags-row" style="margin-top:4px">${vulnHTML}</div></div>` : ''}
          ${immuneHTML ? `<div><span style="color:var(--text-muted)">Imunidades:</span><div class="tags-row" style="margin-top:4px">${immuneHTML}</div></div>` : ''}
        </div>
      </div>

      <!-- Abilities -->
      ${abilitiesHTML ? `
      <div class="detail-section">
        <div class="detail-section-title">Habilidades</div>
        <div class="ability-list">${abilitiesHTML}</div>
      </div>` : ''}

      <!-- Moves -->
      <div class="detail-section">
        <div class="detail-section-title">Movimentos</div>
        <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:12px;">Clique em um movimento para ver seus detalhes.</p>
        ${sheetMode ? buildSheetMovesHTML(p, selectedMoves, currentLevel) : buildMovesHTML(p)}
        <div id="modal-inline-move"></div>
      </div>

      <!-- Actions -->
      <div class="detail-actions">
        ${sheetMode
          ? `<button class="btn btn-outline" onclick="closePokemonDetail()">Fechar</button>`
          : `<button class="btn btn-primary" id="btn-add-to-sheet">+ Adicionar à Ficha</button>
             <button class="btn btn-outline" onclick="closePokemonDetail()">Fechar</button>`
        }
      </div>
    </div>`;
}

function buildMovesHTML(p) {
  let html = '';

  // Starting Moves
  if (p.moves.starting?.length) {
    html += `
      <div class="moves-level-group">
        <div class="moves-level-header">Movimentos Iniciais</div>
        <div class="moves-list">${p.moves.starting.map(m => moveChipHTML(m)).join('')}</div>
      </div>`;
  }

  // By Level
  (p.moves.byLevel || []).forEach(lg => {
    if (!lg.moves?.length) return;
    html += `
      <div class="moves-level-group">
        <div class="moves-level-header">Nível ${lg.level}</div>
        <div class="moves-list">${lg.moves.map(m => moveChipHTML(m)).join('')}</div>
      </div>`;
  });

  // TM Moves
  if (p.moves.tm?.length) {
    const tmNames = p.moves.tm.map(n => TM_MAP[n] ? `MN${String(n).padStart(2,'0')} - ${TM_MAP[n]}` : `MN${n}`).join(', ');
    html += `
      <div class="moves-level-group">
        <div class="moves-level-header">Movimentos de Máquina (MN)</div>
        <div class="tm-list">${tmNames}</div>
      </div>`;
  }

  return html;
}

function moveChipHTML(moveName) {
  const move = moveMap[moveName.toLowerCase()];
  const typeColor = move ? getTypeColor(move.type.pt || move.type.en || '') : '#777';
  return `<span class="move-chip" data-move="${moveName}" style="border-color:${typeColor}22" title="${move ? (move.type.pt || move.type.en) : ''}">${moveName}</span>`;
}

// Build moves section in sheet/ficha mode — selected moves as full cards
function buildSheetMovesHTML(p, selectedMoves, currentLevel) {
  let html = '';

  // ── Active moves: full detail cards
  if (selectedMoves.length > 0) {
    html += `
      <div class="moves-level-group">
        <div class="moves-level-header" style="background:rgba(242,201,76,0.08);color:var(--gold)">
          ⚔️ Movimentos Ativos — ${selectedMoves.length}/4
        </div>
        <div style="padding:var(--gap-md);display:flex;flex-direction:column;gap:10px">`;

    selectedMoves.forEach(moveName => {
      const move = moveMap[moveName.toLowerCase()];
      if (!move) {
        html += `<div class="active-move-card" data-move="${moveName}"><strong style="color:var(--text-primary)">${moveName}</strong></div>`;
        return;
      }
      const typeColor = getTypeColor(move.type.pt || move.type.en || '');
      const badge = `<span class="type-badge" style="--badge-color:${typeColor}">${move.type.pt || move.type.en || '—'}</span>`;
      html += `
        <div class="active-move-card" data-move="${moveName}" title="Clique para ver detalhes">
          <div class="active-move-header">
            <span class="active-move-name">${moveName}</span>
            <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
              ${badge}
              <span style="color:var(--gold);font-weight:700;font-size:0.8rem;font-family:var(--font-heading)">PP ${move.pp || '—'}</span>
            </div>
          </div>
          <div class="active-move-meta">
            <span>${move.moveTime.pt || move.moveTime.en || '—'}</span>
            <span>·</span>
            <span>${move.range || '—'}</span>
            <span>·</span>
            <span>${move.movePower.pt || move.movePower.en || '—'}</span>
          </div>
          ${(move.description?.pt || move.description?.en || move.description) ? `<div class="active-move-desc">${move.description.pt || move.description.en || move.description}</div>` : ''}
        </div>`;
    });

    html += `</div></div>`;
  } else {
    html += `<div class="no-results" style="padding:16px 0">Nenhum movimento selecionado nesta ficha.</div>`;
  }

  // ── Other available moves (grayed, still clickable for info)
  const available = getAvailableMoves(p, currentLevel);
  const otherMoves = available.known.filter(m => !selectedMoves.includes(m));
  if (otherMoves.length > 0) {
    html += `
      <div class="moves-level-group" style="margin-top:8px;opacity:0.6">
        <div class="moves-level-header">Outros disponíveis até Nível ${currentLevel}</div>
        <div class="moves-list">${otherMoves.map(m => moveChipHTML(m)).join('')}</div>
      </div>`;
  }

  return html;
}

// ── Move Detail Panel ──────────────────────────────────────────────
function openMovePanel(move) {
  selectedMove = move;
  const panel = document.getElementById('move-panel');
  const body  = document.getElementById('move-panel-body');
  const title = document.getElementById('move-panel-title');

  title.textContent = move.name;

  const typeColor = getTypeColor(move.type.pt || move.type.en || '');
  const badge = `<span class="type-badge" style="--badge-color:${typeColor}">${move.type.pt || move.type.en || '—'}</span>`;

  body.innerHTML = `
    <div style="margin-bottom:var(--gap-md)">${badge}</div>
    <div class="move-detail-field">
      <span class="move-field-label">Tipo</span>
      <span class="move-field-value">${move.type.pt || move.type.en || '—'}</span>
    </div>
    <div class="move-detail-field">
      <span class="move-field-label">Poder do Movimento</span>
      <span class="move-field-value">${move.movePower.pt || move.movePower.en || '—'}</span>
    </div>
    <div class="move-detail-field">
      <span class="move-field-label">Tempo de Ação</span>
      <span class="move-field-value">${move.moveTime.pt || move.moveTime.en || '—'}</span>
    </div>
    <div class="move-detail-field">
      <span class="move-field-label">PP</span>
      <span class="move-field-value" style="color:var(--gold);font-weight:700">${move.pp || '—'}</span>
    </div>
    <div class="move-detail-field">
      <span class="move-field-label">Duração</span>
      <span class="move-field-value">${move.duration || '—'}</span>
    </div>
    <div class="move-detail-field">
      <span class="move-field-label">Alcance</span>
      <span class="move-field-value">${move.range || '—'}</span>
    </div>
    ${(move.description?.pt || move.description?.en || move.description) ? `<div class="move-description">${move.description.pt || move.description.en || move.description}</div>` : ''}
    ${(move.higherLevels?.pt || move.higherLevels?.en || move.higherLevels) ? `
      <div class="move-higher-levels">
        <strong>Níveis Maiores</strong>
        ${move.higherLevels.pt || move.higherLevels.en || move.higherLevels}
      </div>` : ''}`;

  panel.classList.add('open');
  document.getElementById('panel-backdrop').classList.add('open');
}

function closeMovePanel() {
  document.getElementById('move-panel').classList.remove('open');
  document.getElementById('panel-backdrop').classList.remove('open');
}

// ── Moves Page ─────────────────────────────────────────────────────
function renderMoves() {
  const filtered = filterMovesList();
  const totalPages = Math.ceil(filtered.length / MOVES_PER_PAGE);
  if (movePage > totalPages) movePage = 1;

  const start = (movePage - 1) * MOVES_PER_PAGE;
  const paginated = filtered.slice(start, start + MOVES_PER_PAGE);

  const countEl = document.getElementById('move-count');
  if (countEl) countEl.textContent = `${filtered.length} movimentos`;

  const tbody = document.getElementById('moves-tbody');
  if (!tbody) return;

  tbody.innerHTML = paginated.map(m => {
    const typeColor = getTypeColor(m.type.pt || m.type.en || '');
    const badge = m.type.pt || m.type.en
      ? `<span class="type-badge" style="--badge-color:${typeColor}">${m.type.pt || m.type.en}</span>` : '—';
    return `
      <tr data-move="${m.name}">
        <td class="move-name">${m.name}</td>
        <td>${badge}</td>
        <td style="color:var(--text-secondary);font-size:0.8rem">${m.movePower.pt || m.movePower.en || '—'}</td>
        <td class="move-pp">${m.pp || '—'}</td>
        <td style="color:var(--text-muted);font-size:0.78rem">${m.moveTime.pt || m.moveTime.en || '—'}</td>
        <td style="color:var(--text-muted);font-size:0.78rem">${m.range || '—'}</td>
      </tr>`;
  }).join('') || '<tr><td colspan="6" class="no-results">Nenhum movimento encontrado.</td></tr>';

  // Click handlers
  tbody.querySelectorAll('tr[data-move]').forEach(row => {
    row.addEventListener('click', () => {
      const move = moveMap[row.dataset.move.toLowerCase()];
      if (move) openMovePanel(move);
    });
  });

  // Pagination
  renderMovesPagination(filtered.length);
}

function filterMovesList() {
  let list = allMoves;
  const f = moveFilters;
  if (f.search) {
    const s = f.search.toLowerCase();
    list = list.filter(m => m.name.toLowerCase().includes(s));
  }
  if (f.type) {
    list = list.filter(m => m.type.pt === f.type || m.type.en === f.type);
  }
  return list;
}

function renderMovesPagination(total) {
  const totalPages = Math.ceil(total / MOVES_PER_PAGE);
  const wrap = document.getElementById('moves-pagination');
  if (!wrap) return;
  if (totalPages <= 1) { wrap.innerHTML = ''; return; }

  let html = `<button class="page-btn" ${movePage===1?'disabled':''} onclick="goMovePage(${movePage-1})">‹</button>`;

  for (let i = 1; i <= totalPages; i++) {
    if (totalPages > 8) {
      if (i > 2 && i < totalPages-1 && Math.abs(i - movePage) > 1) {
        if (i === 3 || i === totalPages-2) html += '<span style="color:var(--text-muted);padding:0 4px">…</span>';
        continue;
      }
    }
    html += `<button class="page-btn ${i===movePage?'active':''}" onclick="goMovePage(${i})">${i}</button>`;
  }

  html += `<button class="page-btn" ${movePage===totalPages?'disabled':''} onclick="goMovePage(${movePage+1})">›</button>`;
  wrap.innerHTML = html;
}

function goMovePage(p) {
  movePage = p;
  renderMoves();
  document.getElementById('page-movimentos')?.scrollTo(0,0);
}

function setupMoveFilters() {
  const search = document.getElementById('search-moves');
  const type   = document.getElementById('filter-move-type');

  if (search) search.addEventListener('input', () => {
    moveFilters.search = search.value;
    movePage = 1;
    renderMoves();
  });
  if (type) type.addEventListener('change', () => {
    moveFilters.type = type.value;
    movePage = 1;
    renderMoves();
  });
}

// ── Rules Page ─────────────────────────────────────────────────────
function toggleRulesNav() {
  const nav = document.getElementById('rules-nav-tree');
  if (nav) nav.classList.toggle('show-mobile');
}

function renderRules() {
  const nav = document.getElementById('rules-nav-tree');
  if (!nav || nav.dataset.rendered) return;
  nav.dataset.rendered = '1';

  nav.innerHTML = allRules.map((chapter, ci) => `
    <div class="rules-chapter">
      <button class="rules-chapter-btn" onclick="toggleChapter(${ci})" id="chapter-btn-${ci}">
        <span>${chapter.title}</span>
        <span class="rules-chapter-arrow">▶</span>
      </button>
      <div class="rules-sections" id="chapter-secs-${ci}">
        ${(chapter.sections||[]).map((sec, si) => `
          <button class="rules-section-btn" onclick="showRulesSection(${ci},${si})"
                  id="sec-btn-${ci}-${si}">${sec.title}</button>`).join('')}
      </div>
    </div>`).join('');

  // Show first chapter by default
  if (allRules.length > 0) showRulesChapter(0);
}

function toggleChapter(ci) {
  const btn  = document.getElementById(`chapter-btn-${ci}`);
  const secs = document.getElementById(`chapter-secs-${ci}`);
  const expanded = btn.classList.toggle('expanded');
  btn.classList.toggle('active', expanded);
  secs.classList.toggle('open', expanded);
  if (expanded) showRulesChapter(ci);
}

function showRulesChapter(ci) {
  const chapter = allRules[ci];
  if (!chapter) return;
  rulesState.chapterId = ci;

  const content = document.getElementById('rules-content-area');
  if (!content) return;

  // Close nav on mobile
  const nav = document.getElementById('rules-nav-tree');
  if (nav) nav.classList.remove('show-mobile');

  // Build chapter content
  let html = `<h2>${chapter.title}</h2>`;
  if (chapter.intro) html += renderMarkdownContent(chapter.intro);

  (chapter.sections || []).forEach(sec => {
    html += `<h3 id="sec-${slugify(sec.title)}">${sec.title}</h3>`;
    if (sec.content) html += renderMarkdownContent(sec.content);
    (sec.subsections || []).forEach(sub => {
      html += `<h4 style="color:var(--text-primary);font-family:var(--font-heading);font-size:0.9rem;margin-top:16px;margin-bottom:8px">${sub.title}</h4>`;
      if (sub.content) html += renderMarkdownContent(sub.content);
    });
  });

  content.innerHTML = html;
}

function showRulesSection(ci, si) {
  const chapter = allRules[ci];
  const section = chapter?.sections?.[si];
  if (!section) return;

  // Expand chapter nav
  const btn  = document.getElementById(`chapter-btn-${ci}`);
  const secs = document.getElementById(`chapter-secs-${ci}`);
  btn.classList.add('expanded','active');
  secs.classList.add('open');

  // Mark active section
  document.querySelectorAll('.rules-section-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`sec-btn-${ci}-${si}`)?.classList.add('active');

  showRulesChapter(ci);

  // Scroll to section
  setTimeout(() => {
    const el = document.getElementById(`sec-${slugify(section.title)}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function renderMarkdownContent(text) {
  if (!text) return '';
  const lines = text.split('\n');
  let html = '';
  let inTable = false;
  let tableRows = [];
  let inList = false;

  function closeList() {
    if (inList) { html += '</ul>'; inList = false; }
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('|') && !trimmed.includes(':---')) {
      closeList();
      if (!inTable) { inTable = true; tableRows = []; }
      tableRows.push(trimmed);
    } else {
      if (inTable) {
        html += renderTable(tableRows);
        inTable = false; tableRows = [];
      }
      if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.slice(2,-2).includes('**')) {
        closeList();
        html += `<h4 style="color:var(--text-gold);margin-top:12px;margin-bottom:6px;font-size:0.9rem;font-family:var(--font-heading)">${trimmed.replace(/\*\*/g,'')}</h4>`;
      } else if (trimmed.match(/^[-•*]\s+/)) {
        if (!inList) { html += '<ul>'; inList = true; }
        html += `<li>${renderMarkdownText(trimmed.replace(/^[-•*]\s+/, ''))}</li>`;
      } else if (trimmed) {
        closeList();
        html += `<p>${renderMarkdownText(trimmed)}</p>`;
      } else {
        closeList();
      }
    }
  }
  if (inTable) html += renderTable(tableRows);
  closeList();
  return html;
}

function renderTable(lines) {
  const rows = lines.filter(l => !l.includes(':---'));
  if (rows.length < 2) return '';
  const headers = rows[0].replace(/^\||\|$/g,'').split('|').map(c => c.trim());
  const dataRows = rows.slice(1);
  let html = '<table><thead><tr>';
  headers.forEach(h => { html += `<th>${h}</th>`; });
  html += '</tr></thead><tbody>';
  dataRows.forEach(row => {
    const cells = row.replace(/^\||\|$/g,'').split('|').map(c => c.trim());
    html += '<tr>';
    cells.forEach(c => { html += `<td>${renderMarkdownText(c)}</td>`; });
    html += '</tr>';
  });
  html += '</tbody></table>';
  return html;
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g,'-');
}

function setupRulesSearch() {
  const search = document.getElementById('search-rules');
  if (!search) return;
  search.addEventListener('input', () => {
    const q = search.value.toLowerCase().trim();
    if (!q) return;

    // Simple: find and show first matching section
    for (let ci = 0; ci < allRules.length; ci++) {
      const ch = allRules[ci];
      if (ch.title.toLowerCase().includes(q) || ch.intro?.toLowerCase().includes(q)) {
        showRulesChapter(ci);
        document.getElementById(`chapter-btn-${ci}`)?.scrollIntoView({ behavior:'smooth', block:'nearest' });
        return;
      }
      for (let si = 0; si < (ch.sections||[]).length; si++) {
        const sec = ch.sections[si];
        if (sec.title.toLowerCase().includes(q) || sec.content?.toLowerCase().includes(q)) {
          showRulesSection(ci, si);
          return;
        }
      }
    }
  });
}

// ── Character Sheets ───────────────────────────────────────────────
function loadSheets() {
  try {
    sheets = JSON.parse(localStorage.getItem('pokemon5e_sheets') || '[]');
  } catch { sheets = []; }
}

function saveSheets() {
  localStorage.setItem('pokemon5e_sheets', JSON.stringify(sheets));
}

function renderSheets() {
  const listView   = document.getElementById('sheets-list-view');
  const editorView = document.getElementById('sheet-editor-view');

  if (editingSheet !== null) {
    listView.style.display = 'none';
    editorView.classList.add('active');
    renderSheetEditor();
  } else {
    listView.style.display = 'block';
    editorView.classList.remove('active');
    renderSheetList();
  }
}

function renderSheetList() {
  const grid = document.getElementById('sheets-grid');
  if (!grid) return;

  if (!sheets.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-state-icon">📋</div>
        <div class="empty-state-title">Nenhuma ficha encontrada</div>
        <div class="empty-state-text">Crie sua primeira ficha de treinador Pokémon</div>
      </div>`;
    return;
  }

  grid.innerHTML = sheets.map((sheet, i) => {
    const pokeballs = Array.from({length: 6}, (_, j) => {
      const pokemon = sheet.pokemon?.[j];
      if (pokemon) {
        return `<div class="sheet-mini-sprite">
          <img src="${spriteURL(pokemon.number)}" alt="${pokemon.name}" loading="lazy">
        </div>`;
      }
      return `<div class="sheet-empty-slot">○</div>`;
    }).join('');

    const path = sheet.path || 'Treinador';
    return `
      <div class="sheet-card" onclick="openSheetEditor(${i})">
        <div class="sheet-card-actions">
          <button class="btn btn-sm btn-outline btn-icon" onclick="event.stopPropagation();deleteSheet(${i})" title="Excluir">✕</button>
        </div>
        <div class="sheet-card-name">${sheet.name || 'Sem nome'}</div>
        <div class="sheet-card-meta">Nível ${sheet.level||1} · ${path}</div>
        <div class="sheet-card-pokemon">${pokeballs}</div>
      </div>`;
  }).join('');
}

function openSheetEditor(idx) {
  editingSheet = idx;
  renderSheets();
}

function newSheet() {
  const sheet = {
    id: Date.now(),
    name: 'Novo Treinador',
    level: 1,
    path: 'Ace Trainer',
    specialization: '',
    attributes: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    skills: [],
    specSkills: [],
    specAttrBonus: null,
    equipment: ['5 Pokéballs', '1 Potion', 'Pokédex'],
    money: 1000,
    pokemon: [],
    currentStep: 1
  };
  sheets.push(sheet);
  saveSheets();
  editingSheet = sheets.length - 1;
  renderSheets();
}

function deleteSheet(idx) {
  if (!confirm('Excluir esta ficha?')) return;
  sheets.splice(idx, 1);
  saveSheets();
  showToast('Ficha excluída');
  renderSheetList();
}

function closeSheetEditor() {
  editingSheet = null;
  renderSheets();
}

function renderSheetEditor() {
  const view   = document.getElementById('sheet-editor-view');
  const sheet  = sheets[editingSheet];
  if (!sheet) { closeSheetEditor(); return; }

  // Check if wizard is active
  if (sheet.currentStep && sheet.currentStep <= 6) {
    renderWizard(sheet, view);
    return;
  }

  const pokeslots = POKESLOTS_BY_LEVEL[sheet.level] || 3;
  const pathOptions = TRAINER_PATHS.map(p =>
    `<option value="${p}" ${sheet.path===p?'selected':''}>${p}</option>`).join('');

  const pokemonSlotsHTML = Array.from({length: pokeslots}, (_, i) => {
    const p = sheet.pokemon?.[i];
    return p ? filledSlotHTML(p, i, sheet) : emptySlotHTML(i);
  }).join('');

  const specOptions = Object.keys(SPEC_DESCRIPTIONS).map(s =>
    `<option value="${s}" ${sheet.specialization===s?'selected':''}>${s}</option>`).join('');

  const profBonus = Math.floor((sheet.level - 1) / 4) + 2;
  const conMod = Math.floor((sheet.attributes.con - 10) / 2);
  const maxHP = 6 + conMod + (sheet.level - 1) * (4 + conMod);

  view.innerHTML = `
    <div class="sheet-editor-header">
      <button class="sheet-back-btn" onclick="closeSheetEditor()">← Voltar</button>
      <div style="flex:1">
        <h2 class="page-title" style="margin:0">${sheet.name}</h2>
        <div class="page-subtitle">Nível ${sheet.level} · ${sheet.path}</div>
      </div>
      <button class="btn btn-primary" onclick="saveSheetEditor()">Salvar Ficha</button>
    </div>

    <div class="sheet-editor-layout">
      
      <!-- Lado Esquerdo: Atributos e Perícias -->
      <div style="display:flex; flex-direction:column; gap:var(--gap-lg)">
        
        <div class="editor-section">
          <div class="editor-section-title">Status do Treinador</div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:15px">
            <div class="attr-box" style="padding:10px">
              <div class="attr-name" style="margin:0; font-size:0.6rem">HP Máximo</div>
              <div style="font-size:1.2rem; font-weight:700; color:var(--gold)">${maxHP}</div>
            </div>
            <div class="attr-box" style="padding:10px">
              <div class="attr-name" style="margin:0; font-size:0.6rem">Proficiência</div>
              <div style="font-size:1.2rem; font-weight:700; color:var(--gold)">+${profBonus}</div>
            </div>
            <div class="attr-box" style="padding:10px; grid-column: 1 / -1">
              <div class="attr-name" style="margin:0; font-size:0.6rem">Teste de Resistência (CAR)</div>
              <div style="font-size:1.1rem; font-weight:700; color:var(--gold)">+${profBonus + Math.floor((sheet.attributes.cha - 10) / 2)}</div>
            </div>
          </div>
          <div class="attr-grid" style="grid-template-columns: repeat(3, 1fr); gap:8px">
            ${Object.entries(sheet.attributes).map(([k,v]) => {
              const mod = Math.floor((v - 10) / 2);
              return `
                <div class="attr-box" style="padding:8px">
                  <div class="attr-name" style="font-size:0.55rem; margin-bottom:2px">${k.toUpperCase()}</div>
                  <div style="font-size:0.9rem; font-weight:700">${v}</div>
                  <div class="attr-mod" style="font-size:0.7rem">${mod >= 0 ? '+' : ''}${mod}</div>
                </div>`;
            }).join('')}
          </div>
        </div>

        <div class="editor-section">
          <div class="editor-section-title">Perícias Proficientes</div>
          <div style="display:flex; flex-direction:column; gap:4px">
            ${TRAINER_SKILLS.map(s => {
              const isProf = (sheet.skills||[]).includes(s.id) || (sheet.specSkills && sheet.specSkills.includes(s.id));
              if (!isProf) return '';
              const attr = getSkillAttr(s.id);
              const attrScore = sheet.attributes[attr] || 10;
              return `<div style="font-size:0.85rem; display:flex; justify-content:space-between">
                <span>${s.pt}</span>
                <span style="color:var(--gold)">+${profBonus + Math.floor((attrScore - 10) / 2)}</span>
              </div>`;
            }).join('')}
          </div>
        </div>

        <div class="editor-section">
          <div class="editor-section-title">Equipamento e Dinheiro</div>
          <div style="font-size:1.1rem; font-weight:700; color:var(--gold); margin-bottom:10px">₽ ${sheet.money}</div>
          <div style="font-size:0.75rem; color:var(--text-secondary); max-height:150px; overflow-y:auto">
            ${(sheet.equipment||[]).join('<br>')}
          </div>
        </div>

      </div>

      <!-- Lado Direito: Time Pokémon -->
      <div style="display:flex; flex-direction:column; gap:var(--gap-lg)">
        <div class="editor-section">
          <div class="editor-section-title">Time Pokémon (${sheet.pokemon.length}/${pokeslots})</div>
          <div class="pokemon-slots-grid" id="pokemon-slots-container">
            ${pokemonSlotsHTML}
          </div>
        </div>

        <div class="editor-section">
          <div class="editor-section-title">Configurações Básicas</div>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Nome</label>
              <input type="text" id="ed-name" class="form-input" value="${sheet.name}">
            </div>
            <div class="form-group">
              <label class="form-label">Nível</label>
              <select id="ed-level" class="form-select" onchange="updateSheetLevel(this.value)">
                ${Array.from({length:20}, (_,i)=>`<option value="${i+1}" ${sheet.level===(i+1)?'selected':''}>Nível ${i+1}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Caminho</label>
              <select id="ed-path" class="form-select">${pathOptions}</select>
            </div>
            <div class="form-group">
              <label class="form-label">Especialização</label>
              <select id="ed-spec" class="form-select">${specOptions}</select>
            </div>
          </div>
        </div>
      </div>

    </div>`;
}

function getSkillAttr(skillId) {
  const mapping = {
    animal_handling: 'wis', insight: 'wis', intimidation: 'cha', investigation: 'int',
    medicine: 'wis', nature: 'int', perception: 'wis', persuasion: 'cha',
    sleight_of_hand: 'dex', stealth: 'dex', survival: 'wis',
    arcana: 'int', history: 'int', religion: 'int', performance: 'cha',
    deception: 'cha', acrobatics: 'dex', athletics: 'str'
  };
  return mapping[skillId] || 'int';
}


function updatePathInfo(value) {
  const el = document.getElementById('ed-path-info');
  if (!el) return;
  const desc = PATH_DESCRIPTIONS[value];
  if (!desc) { el.innerHTML = ''; return; }

  const sheet = sheets[editingSheet];
  const trainerLevel = sheet ? (sheet.level || 1) : 1;

  const featuresHTML = desc.features.map(f => {
    const unlocked = trainerLevel >= f.level;
    return `<div class="path-feature-item ${unlocked ? 'feature-unlocked' : 'feature-locked'}">
      <div class="path-feature-header">
        <span class="path-feature-level-badge ${unlocked ? 'badge-unlocked' : 'badge-locked'}">Nv ${f.level}</span>
        <span class="path-feature-name">${f.name}</span>
        ${unlocked ? '<span class="feature-status-icon">✓</span>' : '<span class="feature-status-icon">🔒</span>'}
      </div>
      <div class="path-feature-desc">${f.description}</div>
    </div>`;
  }).join('');

  el.innerHTML = `
    <div class="option-info-card">
      <div class="option-info-summary">${desc.summary}</div>
      <div class="option-info-bonus"><span class="option-info-label">Bônus inicial:</span> ${desc.bonus}</div>
      <div class="option-info-features-title">Habilidades do Caminho</div>
      <div class="path-features-list">${featuresHTML}</div>
    </div>`;
}

function updateSpecInfo(value) {
  const el = document.getElementById('ed-spec-info');
  if (!el) return;
  if (!value) { el.innerHTML = ''; return; }
  const desc = SPEC_DESCRIPTIONS[value];
  if (!desc) { el.innerHTML = ''; return; }

  const typeColor = desc.type ? getTypeColor(desc.type) : 'var(--gold)';
  const typeBadge = desc.type
    ? `<span class="type-badge" style="--badge-color:${typeColor}">${desc.type}</span>`
    : '';

  const bonusLine = desc.bonus
    ? `<div class="option-info-bonus"><span class="option-info-label">Bônus:</span> ${desc.bonus}</div>`
    : '';

  el.innerHTML = `
    <div class="option-info-card">
      ${typeBadge ? `<div style="margin-bottom:8px">${typeBadge}</div>` : ''}
      ${bonusLine}
      <div class="option-info-bonus"><span class="option-info-label">Efeito:</span> ${desc.effect}</div>
    </div>`;
}

function filledSlotHTML(pokemonSlot, slotIdx, sheet) {
  const p = allPokemon.find(pk => pk.number === pokemonSlot.number);
  if (!p) return emptySlotHTML(slotIdx);

  const currentLevel = pokemonSlot.level || p.level;
  const available = getAvailableMoves(p, currentLevel);
  const selected  = pokemonSlot.selectedMoves || [];
  const typeColor = getTypeColor(p.types[0]?.pt || '');

  const movesHTML = available.known.map(m => {
    const isSelected = selected.includes(m);
    const isDisabled = !isSelected && selected.length >= 4;
    return `<label class="move-checkbox-label ${isSelected?'selected':''} ${isDisabled?'disabled-move':''}"
               title="${isDisabled?'Máximo 4 movimentos':''}">
      <input type="checkbox" ${isSelected?'checked':''} ${isDisabled?'disabled':''}
             onchange="toggleSlotMove(${slotIdx},'${m}',this.checked)">
      ${m}
    </label>`;
  }).join('');

  return `
    <div class="pokemon-slot pokemon-slot-clickable" style="border-color:${typeColor}33"
         onclick="openPokemonSheetDetail(${slotIdx}, ${editingSheet})" title="Ver ficha do Pokémon">
      <button class="slot-remove-btn" onclick="event.stopPropagation();removePokemonFromSlot(${slotIdx})">✕</button>
      <div class="slot-header">
        <img class="slot-sprite" src="${spriteURL(p.number)}" alt="${p.name}" loading="lazy">
        <div class="slot-info">
          <div class="slot-pokemon-name">${p.name}</div>
          <div class="slot-pokemon-types">${p.types.map(t => typeBadgeHTML(t)).join('')}</div>
        </div>
      </div>
      <div class="slot-level-row" onclick="event.stopPropagation()">
        <span class="slot-level-label">Nível:</span>
        <input class="slot-level-input" type="number" min="1" max="20"
               value="${currentLevel}"
               onchange="updateSlotLevel(${slotIdx},this.value)">
        <span style="font-size:0.72rem;color:var(--text-muted)">/ ${p.cr !== '1/2' ? `CR ${p.cr}` : 'CR ½'}</span>
      </div>
      <div class="slot-moves-title">Movimentos conhecidos (${selected.length}/4)</div>
      <div class="slot-moves-available" id="slot-moves-${slotIdx}" onclick="event.stopPropagation()">${movesHTML}</div>
    </div>`;
}

function emptySlotHTML(slotIdx) {
  return `
    <div class="pokemon-slot-empty" onclick="openPokedexForSheet(${slotIdx})">
      <span style="font-size:1.5rem">+</span>
      <span>Adicionar Pokémon</span>
    </div>`;
}

function getAvailableMoves(pokemon, currentLevel) {
  const known = [...(pokemon.moves.starting || [])];
  (pokemon.moves.byLevel || []).forEach(lg => {
    if (lg.level <= currentLevel) known.push(...lg.moves);
  });
  const tmMoves = (pokemon.moves.tm || []).map(n => TM_MAP[n]).filter(Boolean);
  return { known: [...new Set(known)], tm: tmMoves };
}

function updateSheetLevel(newLevel) {
  const sheet = sheets[editingSheet];
  if (!sheet) return;
  sheet.level = parseInt(newLevel) || 1;
  saveSheets();
  renderSheetEditor();
}

function updateSlotLevel(slotIdx, newLevel) {
  const sheet = sheets[editingSheet];
  if (!sheet?.pokemon?.[slotIdx]) return;
  sheet.pokemon[slotIdx].level = parseInt(newLevel) || 1;
  saveSheets();
  // Re-render just the moves for this slot
  const p = allPokemon.find(pk => pk.number === sheet.pokemon[slotIdx].number);
  if (!p) return;
  const available = getAvailableMoves(p, sheet.pokemon[slotIdx].level);
  const selected  = sheet.pokemon[slotIdx].selectedMoves || [];
  const container = document.getElementById(`slot-moves-${slotIdx}`);
  if (!container) return;
  container.innerHTML = available.known.map(m => {
    const isSelected = selected.includes(m);
    const isDisabled = !isSelected && selected.length >= 4;
    return `<label class="move-checkbox-label ${isSelected?'selected':''}" title="${isDisabled?'Máximo 4 movimentos':''}">
      <input type="checkbox" ${isSelected?'checked':''} ${isDisabled?'disabled':''}
             onchange="toggleSlotMove(${slotIdx},'${m}',this.checked)">
      ${m}
    </label>`;
  }).join('');
}

function toggleSlotMove(slotIdx, moveName, checked) {
  const sheet = sheets[editingSheet];
  if (!sheet?.pokemon?.[slotIdx]) return;
  const slot = sheet.pokemon[slotIdx];
  if (!slot.selectedMoves) slot.selectedMoves = [];

  if (checked && slot.selectedMoves.length >= 4) {
    showToast('Máximo 4 movimentos por Pokémon', 'error');
    renderSheetEditor();
    return;
  }
  if (checked) slot.selectedMoves.push(moveName);
  else slot.selectedMoves = slot.selectedMoves.filter(m => m !== moveName);

  saveSheets();

  // Update UI without full re-render
  const p = allPokemon.find(pk => pk.number === slot.number);
  const available = getAvailableMoves(p, slot.level || p?.level || 1);
  const container = document.getElementById(`slot-moves-${slotIdx}`);
  if (container) {
    container.querySelectorAll('.move-checkbox-label').forEach(label => {
      const input = label.querySelector('input');
      const name  = label.textContent.trim();
      const sel   = slot.selectedMoves.includes(name);
      const dis   = !sel && slot.selectedMoves.length >= 4;
      label.classList.toggle('selected', sel);
      input.checked = sel;
      input.disabled = dis;
    });
  }

  // Update count title
  const title = document.querySelector(`#pokemon-slots-container .pokemon-slot:nth-child(${slotIdx+1}) .slot-moves-title`);
  if (title) title.textContent = `Movimentos conhecidos (${slot.selectedMoves.length}/4)`;
}

function removePokemonFromSlot(slotIdx) {
  const sheet = sheets[editingSheet];
  if (!sheet) return;
  sheet.pokemon.splice(slotIdx, 1);
  saveSheets();
  renderSheetEditor();
}

function openPokedexForSheet(slotIdx) {
  // Navigate to pokedex with a "pick" mode
  window._pickingForSlot = slotIdx;
  navigateTo('pokedex');
  showToast('Escolha um Pokémon para adicionar à ficha');
}

function saveSheetEditor() {
  const sheet = sheets[editingSheet];
  if (!sheet) return;
  const newName = document.getElementById('ed-name')?.value || 'Treinador';
  const newLevel = parseInt(document.getElementById('ed-level')?.value) || 1;
  const newPath  = document.getElementById('ed-path')?.value || 'Ace Trainer';
  const newSpec  = document.getElementById('ed-spec')?.value || '';

  // If specialization changed, we might need to recalculate bonuses (though usually wizard handles this)
  if (sheet.specialization !== newSpec) {
    sheet.specialization = newSpec;
    applySpecBonuses(sheet);
  }

  sheet.name = newName;
  sheet.level = newLevel;
  sheet.path = newPath;

  saveSheets();
  showToast('Ficha salva com sucesso!');
  renderSheets();
}

// ── Add Pokemon to Sheet ───────────────────────────────────────────
function openAddToSheet(pokemon) {
  addToSheetTargetPokemon = pokemon;
  const modal = document.getElementById('add-to-sheet-modal');
  const list  = document.getElementById('sheet-options-list');

  if (!sheets.length) {
    list.innerHTML = `
      <div class="empty-state" style="padding:24px">
        <div class="empty-state-text">Nenhuma ficha disponível.</div>
      </div>`;
  } else {
    list.innerHTML = sheets.map((s, i) => {
      const slots  = POKESLOTS_BY_LEVEL[s.level||1] || 3;
      const used   = s.pokemon?.length || 0;
      const full   = used >= slots;
      return `
        <div class="sheet-option ${full?'opacity-50':''}" onclick="${full?'':''}"
             style="${full?'opacity:0.5;cursor:not-allowed':''}"
             ${!full ? `onclick="addPokemonToSheet(${i})"` : ''}>
          <div>
            <div class="sheet-option-name">${s.name||'Sem nome'}</div>
            <div class="sheet-option-meta">Nível ${s.level||1} · ${used}/${slots} Pokémon${full?' · Cheio':''}</div>
          </div>
          ${!full ? '<span style="color:var(--gold)">→</span>' : '<span style="color:var(--text-muted)">Cheio</span>'}
        </div>`;
    }).join('');
  }

  modal.classList.add('open');
}

function closeAddToSheetModal() {
  document.getElementById('add-to-sheet-modal').classList.remove('open');
  addToSheetTargetPokemon = null;
}

function addPokemonToSheet(sheetIdx) {
  const p = addToSheetTargetPokemon;
  if (!p) return;
  const sheet = sheets[sheetIdx];
  if (!sheet) return;

  if (!sheet.pokemon) sheet.pokemon = [];
  const slots = POKESLOTS_BY_LEVEL[sheet.level||1] || 3;
  if (sheet.pokemon.length >= slots) {
    showToast('Time está cheio!', 'error');
    return;
  }

  sheet.pokemon.push({
    number: p.number,
    name: p.name,
    level: p.level,
    selectedMoves: p.moves.starting ? p.moves.starting.slice(0,4) : []
  });
  saveSheets();
  closeAddToSheetModal();
  closePokemonDetail();
  showToast(`${p.name} adicionado à ficha "${sheet.name||'Sem nome'}"!`);
}

function newSheetAndAddPokemon() {
  const p = addToSheetTargetPokemon;
  if (!p) return;
  const sheet = {
    id: Date.now(),
    name: 'Novo Treinador',
    level: 1,
    path: 'Ace Trainer',
    specialization: '',
    pokemon: [{
      number: p.number,
      name: p.name,
      level: p.level,
      selectedMoves: p.moves.starting ? p.moves.starting.slice(0,4) : []
    }]
  };
  sheets.push(sheet);
  saveSheets();
  closeAddToSheetModal();
  closePokemonDetail();
  editingSheet = sheets.length - 1;
  navigateTo('fichas');
  showToast(`Ficha criada com ${p.name}!`);
}

// ── Picking Mode ───────────────────────────────────────────────────
// When user clicks a pokemon card in pokedex while _pickingForSlot is set
function handlePokedexPickMode(pokemon) {
  const slotIdx = window._pickingForSlot;
  if (slotIdx === undefined || slotIdx === null) return false;

  const sheet = sheets[editingSheet];
  if (!sheet) { window._pickingForSlot = null; return false; }

  if (!sheet.pokemon) sheet.pokemon = [];
  const existing = sheet.pokemon.find(pk => pk.number === pokemon.number);
  if (existing) { showToast('Este Pokémon já está na ficha', 'error'); window._pickingForSlot = null; return true; }

  sheet.pokemon[slotIdx] = {
    number: pokemon.number,
    name: pokemon.name,
    level: pokemon.level,
    selectedMoves: pokemon.moves.starting ? pokemon.moves.starting.slice(0,4) : []
  };
  saveSheets();
  window._pickingForSlot = null;
  showToast(`${pokemon.name} adicionado ao time!`);
  navigateTo('fichas');
  return true;
}

// ── Event Setup ────────────────────────────────────────────────────
function setupEvents() {
  // Close pokemon modal on overlay click
  document.getElementById('pokemon-modal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closePokemonDetail();
  });

  // Close add-to-sheet modal on overlay click
  document.getElementById('add-to-sheet-modal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeAddToSheetModal();
  });

  // Panel backdrop
  document.getElementById('panel-backdrop')?.addEventListener('click', closeMovePanel);

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePokemonDetail();
      closeMovePanel();
      closeAddToSheetModal();
    }
  });

  // Pokedex click - intercept for pick mode before normal handler
  document.getElementById('pokemon-grid')?.addEventListener('click', (e) => {
    if (window._pickingForSlot === undefined || window._pickingForSlot === null) return;
    const card = e.target.closest('.pokemon-card');
    if (!card) return;
    e.stopPropagation();
    const idx = Array.from(card.parentElement.children).indexOf(card);
    const filtered = filterPokemonList();
    const p = filtered[idx];
    if (p) handlePokedexPickMode(p);
  }, true); // capture phase so it fires before openPokemonDetail

  setupPokedexFilters();
  setupMoveFilters();
  setupRulesSearch();
}

// ── Bootstrap ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setupEvents();
  init();
});

// ── Wizard Implementation ──────────────────────────────────────────

function renderWizard(sheet, container) {
  const steps = [
    { n: 1, label: 'Caminho' },
    { n: 2, label: 'Atributos' },
    { n: 3, label: 'Perícias' },
    { n: 4, label: 'Especialização' },
    { n: 5, label: 'Equipamento' },
    { n: 6, label: 'Pokémon Inicial' },
    { n: 7, label: 'Revisão' }
  ];

  const progressHTML = steps.map(s => `
    <div class="wizard-step ${sheet.currentStep === s.n ? 'active' : (sheet.currentStep > s.n ? 'completed' : '')}">
      ${sheet.currentStep > s.n ? '✓' : s.n}
    </div>`).join('');

  container.innerHTML = `
    <div class="wizard-container">
      <div class="wizard-header">
        <h2 class="page-title">Criação de Treinador</h2>
        <p class="page-subtitle">Passo ${sheet.currentStep} de 7: ${steps[sheet.currentStep-1].label}</p>
      </div>
      <div class="wizard-progress">${progressHTML}</div>
      <div id="wizard-step-content"></div>
      <div class="wizard-footer">
        <button class="btn btn-outline" onclick="wizardBack()" ${sheet.currentStep === 1 ? 'disabled' : ''}>Voltar</button>
        <button class="btn btn-primary" onclick="wizardNext()">${sheet.currentStep === 7 ? 'Finalizar' : 'Próximo'}</button>
      </div>
    </div>`;

  renderWizardStep(sheet, document.getElementById('wizard-step-content'));
}

function renderWizardStep(sheet, stepContent) {
  switch(sheet.currentStep) {
    case 1: renderStep1(sheet, stepContent); break;
    case 2: renderStep2(sheet, stepContent); break;
    case 3: renderStep3(sheet, stepContent); break;
    case 4: renderStep4(sheet, stepContent); break;
    case 5: renderStep5(sheet, stepContent); break;
    case 6: renderStep7(sheet, stepContent); break; // Starter Pokemon
    case 7: renderStep6(sheet, stepContent); break; // Review
  }
}

function renderStep1(sheet, el) {
  const currentPath = sheet.path || 'Ace Trainer';
  const desc = PATH_DESCRIPTIONS[currentPath];

  el.innerHTML = `
    <div class="editor-section">
      <div class="form-group" style="margin-bottom:20px">
        <label class="form-label">Nome do Treinador</label>
        <input type="text" id="wiz-name" class="form-input" value="${sheet.name}" onchange="updateWizField('name', this.value)" placeholder="Ex: Ash Ketchum">
      </div>
      
      <div class="wizard-layout">
        <div class="spec-selection-list">
          ${TRAINER_PATHS.map(p => `
            <div class="spec-item ${currentPath===p?'active':''}" onclick="updateWizField('path', '${p}'); renderSheets();">
              ${p}
            </div>`).join('')}
        </div>
        <div class="spec-detail">
          <h3 style="color:var(--gold); margin-bottom:10px">${currentPath}</h3>
          <div class="option-info-card">
            <div class="option-info-summary" style="margin-bottom:12px">${desc.summary}</div>
            <div class="option-info-bonus"><span class="option-info-label">Bônus de Classe:</span> ${desc.bonus}</div>
          </div>
          <div style="margin-top:20px">
            <h4 class="form-label" style="margin-bottom:10px">Habilidades de Nível 1</h4>
            <div style="font-size:0.85rem; color:var(--text-secondary); line-height:1.5">
              ${desc.features.filter(f => f.level <= 1).map(f => `<strong>${f.name}:</strong> ${f.description}`).join('<br><br>') || 'Nenhuma habilidade passiva no nível 1.'}
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

function renderStep2(sheet, el) {
  const attrs = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
  const labels = { str:'FOR', dex:'DES', con:'CON', int:'INT', wis:'SAB', cha:'CAR' };

  el.innerHTML = `
    <div class="editor-section">
      <p style="margin-bottom:20px; font-size:0.9rem; color:var(--text-secondary)">
        Defina seus atributos iniciais. O valor base é 10. Você pode ajustá-los livremente.
      </p>
      <div class="attr-grid">
        ${attrs.map(a => {
          const val = sheet.attributes[a];
          const mod = Math.floor((val - 10) / 2);
          return `
            <div class="attr-box">
              <div class="attr-name">${labels[a]}</div>
              <div class="attr-value-wrap">
                <button class="attr-btn" onclick="updateAttr('${a}', -1)">-</button>
                <div class="attr-score">${val}</div>
                <button class="attr-btn" onclick="updateAttr('${a}', 1)">+</button>
              </div>
              <div class="attr-mod">${mod >= 0 ? '+' : ''}${mod}</div>
            </div>`;
        }).join('')}
      </div>
      <div style="margin-top:30px; text-align:center">
         <div class="form-label">Pontos de Vida Estimados</div>
         <div style="font-size:1.5rem; font-weight:700; color:var(--gold)">
            ${6 + Math.floor((sheet.attributes.con - 10) / 2) + (sheet.level - 1) * (4 + Math.floor((sheet.attributes.con - 10) / 2))} PV
         </div>
      </div>
    </div>`;
}

function renderStep3(sheet, el) {
  const trainerSkills = TRAINER_SKILLS.slice(0, 11);

  el.innerHTML = `
    <div class="editor-section">
      <p style="margin-bottom:20px; font-size:0.9rem; color:var(--text-secondary)">
        Escolha 2 perícias iniciais da classe Pokémon Trainer.
      </p>
      <div class="skill-selection-grid">
        ${trainerSkills.map(s => `
          <div class="skill-checkbox-item ${sheet.skills.includes(s.id)?'active':''}" onclick="toggleSkill('${s.id}')">
            <input type="checkbox" ${sheet.skills.includes(s.id)?'checked':''} onclick="event.stopPropagation(); toggleSkill('${s.id}')">
            <span>${s.pt}</span>
          </div>`).join('')}
      </div>
      <div style="margin-top:20px; text-align:right; font-size:0.85rem; color:${sheet.skills.length===2?'var(--gold)':'var(--text-dim)'}">
        Selecionadas: ${sheet.skills.length} / 2
      </div>
    </div>`;
}

function renderStep4(sheet, el) {
  const specs = Object.keys(SPEC_DESCRIPTIONS);
  const currentSpec = sheet.specialization || specs[0];
  const desc = SPEC_DESCRIPTIONS[currentSpec];

  el.innerHTML = `
    <div class="editor-section wizard-layout">
      <div class="spec-selection-list">
        ${specs.map(s => `
          <div class="spec-item ${currentSpec===s?'active':''}" onclick="updateWizField('specialization', '${s}'); renderSheets();">
            ${s}
          </div>`).join('')}
      </div>
      <div class="spec-detail">
        <h3 style="color:var(--gold); margin-bottom:10px">${currentSpec}</h3>
        ${desc.type ? `<div class="type-badge" style="--badge-color:${getTypeColor(desc.type)}; margin-bottom:15px">${desc.type}</div>` : ''}
        <div class="option-info-card">
          ${desc.bonus ? `<div style="margin-bottom:10px"><span class="option-info-label">Bônus:</span> ${desc.bonus}</div>` : ''}
          <div><span class="option-info-label">Efeito:</span> ${desc.effect}</div>
        </div>
        
        ${renderSpecChoice(sheet, currentSpec)}
      </div>
    </div>`;
}

function renderSpecChoice(sheet, spec) {
  const choice = SPEC_ATTR_BONUS[spec];
  if (!Array.isArray(choice)) return '';

  const labels = { str:'Força', dex:'Destreza', con:'Constituição', int:'Inteligência', wis:'Sabedoria', cha:'Carisma' };
  
  return `
    <div style="margin-top:20px">
      <label class="form-label">Escolha o Atributo para o Bônus +1</label>
      <div style="display:flex; gap:10px; margin-top:8px">
        ${choice.map(a => `
          <button class="btn btn-sm ${sheet.specAttrBonus===a?'btn-primary':'btn-outline'}" 
                  onclick="updateWizField('specAttrBonus', '${a}'); renderSheets();">
            ${labels[a]}
          </button>`).join('')}
      </div>
    </div>`;
}

function renderStep5(sheet, el) {
  el.innerHTML = `
    <div class="editor-section">
      <h4 class="editor-section-title">Escolha seu Pacote de Equipamento</h4>
      <div class="pack-grid">
        ${PACK_OPTIONS.map(p => {
          const active = sheet.equipment.includes(p.name);
          return `
            <div class="pack-card ${active?'active':''}" onclick="selectPack('${p.name}')">
              <div class="pack-card-name">${p.name}</div>
              <div class="pack-card-items">${p.items.join(', ')}</div>
            </div>`;
        }).join('')}
      </div>
      
      <div style="margin-top:30px">
        <h4 class="editor-section-title">Outros Equipamentos Iniciais</h4>
        <div style="display:flex; gap:10px; flex-wrap:wrap">
          <span class="type-badge" style="--badge-color:#777">5 Pokéballs</span>
          <span class="type-badge" style="--badge-color:#777">1 Potion</span>
          <span class="type-badge" style="--badge-color:#777">Pokédex</span>
          <span class="type-badge" style="--badge-color:#777">Starter Pokémon</span>
        </div>
      </div>

      <div style="margin-top:30px">
        <h4 class="editor-section-title">Dinheiro Inicial</h4>
        <div style="display:flex; align-items:center; gap:20px">
          <div style="font-size:1.5rem; font-weight:700; color:var(--gold)">₽ ${sheet.money}</div>
          <button class="btn btn-outline btn-sm" onclick="rollMoney()">🎲 Rolar Dinheiro (1000 + 10x4d4)</button>
        </div>
      </div>
    </div>`;
}

function renderStep6(sheet, el) {
  el.innerHTML = `
    <div class="editor-section">
      <div class="summary-grid">
        <div>
          <div class="summary-section">
            <div class="summary-label">Nome</div>
            <div class="summary-value">${sheet.name}</div>
          </div>
          <div class="summary-section">
            <div class="summary-label">Nível e Caminho</div>
            <div class="summary-value">Nível ${sheet.level} — ${sheet.path}</div>
          </div>
          <div class="summary-section">
            <div class="summary-label">Especialização</div>
            <div class="summary-value">${sheet.specialization || 'Nenhuma'}</div>
          </div>
        </div>
        <div>
          <div class="summary-section">
            <div class="summary-label">Atributos</div>
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:5px">
               ${Object.entries(sheet.attributes).map(([k,v]) => `
                 <div style="font-size:0.8rem"><strong>${k.toUpperCase()}:</strong> ${v}</div>
               `).join('')}
            </div>
          </div>
          <div class="summary-section">
            <div class="summary-label">Perícias</div>
            <div style="font-size:0.85rem">${sheet.skills.map(s => TRAINER_SKILLS.find(ts=>ts.id===s).pt).join(', ')}</div>
          </div>
          <div class="summary-section">
            <div class="summary-label">Pokémon Inicial</div>
            <div class="summary-value">${sheet.pokemon[0] ? sheet.pokemon[0].name : 'Nenhum'}</div>
          </div>
          <div class="summary-section">
            <div class="summary-label">Dinheiro</div>
            <div class="summary-value">₽ ${sheet.money}</div>
          </div>
        </div>
      </div>
      <div style="margin-top:20px; padding:15px; background:rgba(242,201,76,0.05); border:1px solid var(--gold-dim); border-radius:var(--r-md); font-size:0.9rem">
        Tudo pronto! Clique em <strong>Finalizar</strong> para criar sua ficha e começar sua jornada.
      </div>
    </div>`;
}

function renderStep7(sheet, el) {
  const starters = allPokemon.filter(p => {
    const cr = p.cr;
    return (cr === '0' || cr === '1/8' || cr === '1/4' || cr === '1/2');
  });

  const currentStarter = sheet.pokemon[0];

  el.innerHTML = `
    <div class="editor-section">
      <p style="margin-bottom:20px; font-size:0.9rem; color:var(--text-secondary)">
        Todo treinador começa com um Pokémon de CR 1/2 ou inferior. Este Pokémon começa com <strong>Bond Level +1</strong>.
      </p>
      
      <div class="toolbar" style="margin-bottom:20px">
        <input type="text" id="starter-search" class="search-input" placeholder="Buscar Pokémon inicial..." oninput="filterStarters(this.value)">
      </div>

      <div id="starter-list" class="pokemon-grid" style="grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); max-height:400px; overflow-y:auto; padding:10px">
        ${renderStarterListHTML(starters, currentStarter)}
      </div>
    </div>`;
}

function renderStarterListHTML(list, current) {
  return list.map(p => `
    <div class="pokemon-card ${current && current.number === p.number ? 'selected' : ''}" 
         onclick="selectStarter('${p.number}')" 
         style="padding:10px; ${current && current.number === p.number ? 'border-color:var(--gold); background:rgba(242,201,76,0.05)' : ''}">
      <img src="${spriteURL(p.number)}" style="width:60px; height:60px; margin:0 auto 8px; display:block">
      <div style="text-align:center; font-size:0.8rem; font-weight:700">${p.name}</div>
      <div style="text-align:center; font-size:0.7rem; color:var(--text-muted)">CR ${p.cr}</div>
    </div>`).join('');
}

function filterStarters(query) {
  const q = query.toLowerCase();
  const starters = allPokemon.filter(p => {
    const cr = p.cr;
    const isStarter = (cr === '0' || cr === '1/8' || cr === '1/4' || cr === '1/2');
    return isStarter && p.name.toLowerCase().includes(q);
  });
  const sheet = sheets[editingSheet];
  document.getElementById('starter-list').innerHTML = renderStarterListHTML(starters, sheet.pokemon[0]);
}

function selectStarter(number) {
  const sheet = sheets[editingSheet];
  const n = parseInt(number);
  const p = allPokemon.find(pk => pk.number === n);
  if (!p) return;

  sheet.pokemon = [{
    number: p.number,
    name: p.name,
    level: p.level || 1,
    bond: 1,
    selectedMoves: p.moves.starting ? p.moves.starting.slice(0,4) : []
  }];
  
  saveSheets();
  renderSheets();
}

// ── Wizard Helpers ────────────────────────────────────────────────

function updateWizField(field, val) {
  const sheet = sheets[editingSheet];
  if (!sheet) return;
  sheet[field] = val;
  saveSheets();
}

function updateAttr(attr, delta) {
  const sheet = sheets[editingSheet];
  if (!sheet) return;
  const newVal = Math.max(1, Math.min(30, sheet.attributes[attr] + delta));
  sheet.attributes[attr] = newVal;
  saveSheets();
  renderSheets();
}

function toggleSkill(skillId) {
  const sheet = sheets[editingSheet];
  if (!sheet) return;
  const idx = sheet.skills.indexOf(skillId);
  if (idx >= 0) {
    sheet.skills.splice(idx, 1);
  } else if (sheet.skills.length < 2) {
    sheet.skills.push(skillId);
  } else {
    showToast('Você só pode escolher 2 perícias!', 'error');
    return;
  }
  saveSheets();
  renderSheets();
}

function selectPack(packName) {
  const sheet = sheets[editingSheet];
  if (!sheet) return;
  const packNames = PACK_OPTIONS.map(p => p.name);
  sheet.equipment = sheet.equipment.filter(e => !packNames.includes(e));
  sheet.equipment.push(packName);
  saveSheets();
  renderSheets();
}

function rollMoney() {
  const sheet = sheets[editingSheet];
  if (!sheet) return;
  const roll = Array.from({length:4}, () => Math.floor(Math.random()*4)+1).reduce((a,b)=>a+b, 0);
  sheet.money = 1000 + 10 * roll;
  saveSheets();
  renderSheets();
}

function wizardNext() {
  const sheet = sheets[editingSheet];
  if (!sheet) return;
  
  if (sheet.currentStep === 3 && sheet.skills.length < 2) {
    showToast('Selecione 2 perícias para continuar!', 'error');
    return;
  }
  if (sheet.currentStep === 4 && !sheet.specialization) {
    showToast('Selecione uma especialização!', 'error');
    return;
  }
  if (sheet.currentStep === 6 && sheet.pokemon.length === 0) {
    showToast('Escolha seu Pokémon inicial!', 'error');
    return;
  }
  
  if (sheet.currentStep < 7) {
    sheet.currentStep++;
  } else {
    finalizeWizard(sheet);
  }
  saveSheets();
  renderSheets();
}

function wizardBack() {
  const sheet = sheets[editingSheet];
  if (!sheet) return;
  if (sheet.currentStep > 1) {
    sheet.currentStep--;
    saveSheets();
    renderSheets();
  }
}

function finalizeWizard(sheet) {
  applySpecBonuses(sheet);
  sheet.currentStep = 8;
  showToast('Treinador e Pokémon Inicial prontos!');
}

function applySpecBonuses(sheet) {
  const specName = sheet.specialization;
  const bonus = SPEC_ATTR_BONUS[specName];
  sheet.specSkills = [];
  if (typeof bonus === 'string') {
    sheet.attributes[bonus] += 1;
  } else if (sheet.specAttrBonus) {
    sheet.attributes[sheet.specAttrBonus] += 1;
  }
  const specSkillsMap = {
    'Bird Keeper': ['perception'],
    'Bug Maniac': ['nature'],
    'Picnicker': ['survival'],
    'Gardener': ['nature'],
    'Mystic': ['arcana'],
    'Detective': ['investigation'],
    'Ruin Maniac': ['history'],
    'Punk': ['intimidation'],
    'Fairy Tale Expert': ['religion'],
    'Ninja': ['stealth'],
    'Actor': ['performance', 'deception'],
    'Burglar': ['stealth', 'sleight_of_hand'],
    'Bodybuilder': ['acrobatics', 'athletics'],
    'Poké Maniac': ['history', 'insight'],
    'Camper': ['nature', 'survival'],
    'Medium': ['medicine', 'religion'],
    'Hex Maniac': ['arcana', 'intimidation'],
    'Beauty': ['persuasion', 'animal_handling']
  };
  if (specSkillsMap[specName]) {
    sheet.specSkills = specSkillsMap[specName];
  }
}
