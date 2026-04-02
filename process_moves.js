
const fs = require('fs');
const path = require('path');

const movesPath = 'public/data/moves.json';
const moves = JSON.parse(fs.readFileSync(movesPath, 'utf8'));

// Re-read from English if available to avoid double-translation artifacts
const movesEnglishPath = 'public/data/moves_english.json';
const movesSource = JSON.parse(fs.readFileSync(fs.existsSync(movesEnglishPath) ? movesEnglishPath : movesPath, 'utf8'));

const translations = {
  // ... (keeping previous ones for quality)
  "Absorb": {
    "description": "Você tenta absorver um pouco da saúde de um inimigo. Faça uma jogada de ataque à distância contra uma criatura. Em um acerto, a criatura sofre 1d4 + MOVE de dano de planta. Metade do dano causado é restaurada pelo usuário.",
    "higherLevels": "O dano base deste ataque aumenta para 2d4 no nível 5, 3d4 no nível 11 e 4d4 no nível 17."
  },
  "Accelerock": {
    "description": "Mais rápido que um piscar de olhos, você atinge o oponente com um pedaço de rocha. Você pode se mover até o seu deslocamento e fazer um ataque corpo a corpo. Em um acerto, o Pokémon sofre 1d4 + MOVE de dano de pedra.",
    "higherLevels": "O dano base deste ataque aumenta para 1d6 no nível 5, 1d10 no nível 11 e 2d8 no nível 17."
  },
  "Acid": {
    "description": "Você cria um fluxo de ácido quente e o aponta para seu inimigo. Faça uma jogada de ataque à distância, causando 1d6 + MOVE de dano de veneno em um acerto.",
    "higherLevels": "O dano base deste ataque aumenta para 2d6 no nível 5, 3d6 no nível 11 e 4d6 no nível 17."
  },
  "Acid Armor": {
    "description": "Você é cercado por um escudo de ácido espesso pela duração. Durante este tempo, sua CA aumenta em 2, e qualquer Pokémon que atingir você com um ataque corpo a corpo sofre 1d8 de dano de veneno.",
    "higherLevels": "O dano de veneno aumenta para 2d8 no nível 10."
  },
  "Acid Spray": {
    "description": "Você cospe um spray de ácido em um cone de 15 pés originando-se de você. Cada criatura na área deve fazer um teste de resistência de Constituição contra a sua CD de MOVE. Em uma falha, a criatura sofre 2d4 de dano de veneno e tem desvantagem em seu próximo teste de resistência. Em um sucesso, ela sofre metade do dano e não recebe desvantagem em seu teste de resistência.",
    "higherLevels": "O dano base deste ataque aumenta para 4d4 no nível 5, 6d4 no nível 11 e 8d4 no nível 17."
  },
  "Acrobatics": {
    "description": "Você se move pelo campo de batalha, fazendo uma sucessão rápida de golpes. Quando você usa esta ação, você não sofre ataques de oportunidade até o final do seu turno. Você pode fazer três ataques corpo a corpo contra alvos diferentes enquanto se move. Cada ataque causa 1d6 + MOVE de dano voador.",
    "higherLevels": "O dano base deste ataque aumenta para 1d10 no nível 5, 2d6 no nível 11 e 2d10 no nível 17."
  },
  "Acupressure": {
    "description": "Você usa uma técnica secreta para se acalmar e se purificar. Quando você usa este movimento, você pode encerrar um efeito em si mesmo que esteja causando as condições enfeitiçado, amedrontado, paralisado, envenenado, recuado ou atordoado.",
    "higherLevels": ""
  },
  "Aerial Ace": {
    "description": "Do ar, você corta e atravessa o alvo. Se você puder estar no ar neste turno, faça um ataque corpo a corpo com vantagem causando 1d6 + MOVE de dano voador.",
    "higherLevels": "O dano base deste ataque aumenta para 2d6 no nível 5, 3d6 no nível 11 e 4d6 no nível 17."
  },
  "After You": {
    "description": "Você educadamente deixa seu aliado tomar a iniciativa. Escolha uma criatura voluntária que você possa ver dentro do alcance. Até o feitiço terminar, o deslocamento do alvo é dobrado, ele ganha um bônus de +2 na CA, tem vantagem em testes de resistência de Destreza e ganha uma ação adicional em cada um de seus turnos. Essa ação só pode ser usada para realizar a ação de Disparar, Desengajar, Esconder ou Usar um Objeto. Quando este movimento termina, o alvo não pode se mover ou realizar ações até depois do seu próximo turno.",
    "higherLevels": ""
  },
  "Agility": {
    "description": "Você aprimora suas habilidades e sente uma onda de velocidade percorrer suas veias. Enquanto você tiver o tipo, aumente seu deslocamento de caminhada, voo ou natação em 20 pés pela duração. Você só pode aumentar cada tipo de deslocamento em 20 pés no total com este movimento.",
    "higherLevels": ""
  },
  "Air Cutter": {
    "description": "Você envia uma fatia de ar afiada como navalha em direção ao seu oponente. Faça uma jogada de ataque à distância contra um oponente causando 1d6 + MOVE de dano voador em um acerto. Este movimento causa um acerto crítico em uma rolagem natural de 19 ou 20.",
    "higherLevels": "O dano base deste ataque aumenta para 2d6 no nível 5, 3d6 no nível 11 e 4d6 no nível 17."
  },
  "Air Slash": {
    "description": "Você conjura uma fatia poderosa de ar compactado e a lança contra um Pokémon inimigo. Faça uma jogada de ataque à distância, causando 1d8 + MOVE de dano voador em um acerto bem-sucedido. Se a rolagem natural para este ataque for 18 ou superior, o alvo fica recuado.",
    "higherLevels": "O dano base deste ataque aumenta para 2d8 no nível 5, 3d8 no nível 11 e 4d8 no nível 17."
  },
  "Ally Switch": {
    "description": "Você usa suas habilidades psíquicas para teletransportar a si mesmo e a um aliado. Escolha uma criatura voluntária dentro do alcance. Você e essa criatura trocam de posição. Se você ou seu alvo forem grandes demais para caber no novo lugar, este movimento não faz nada.",
    "higherLevels": ""
  },
  "Amnesia": {
    "description": "Sua mente se eleva a um novo nível de foco. Adicione +5 a qualquer teste de resistência que você fizer pela duração, mas selecione um de seus outros movimentos. Você esquece esse movimento e não pode usá-lo pela duração. Você não pode ter o bônus de amnésia mais de uma vez.",
    "higherLevels": ""
  },
  "Anchor Shot": {
    "description": "Você dispara uma âncora presa a uma corrente direto no seu oponente. Faça uma jogada de ataque à distância no seu oponente, causando 1d10 de dano de aço em um acerto. Se acertar este ataque, você pode escolher puxar imediatamente seu alvo até 10 pés em sua direção.",
    "higherLevels": "O dano base deste ataque aumenta para 2d10 no nível 5, 3d10 no nível 11 e 4d10 no nível 17."
  },
  "Ancient Power": {
    "description": "Você levita uma pilha de terra e esmaga um Pokémon inimigo com ela. Faça uma jogada de ataque à distância, causando 1d8 + MOVE de dano de pedra em um acerto bem-sucedido.",
    "higherLevels": "O dano base deste ataque aumenta para 2d8 no nível 5, 3d8 no nível 11 e 4d8 no nível 17."
  },
  "Aqua Jet": {
    "description": "Você se cerca de um fluxo de água que permite que você acelere pela batalha. Você pode se mover até o seu deslocamento e fazer um ataque corpo a corpo. Em um acerto, o Pokémon sofre 1d4 + MOVE de dano de água.",
    "higherLevels": "O dano base deste ataque aumenta para 1d6 no nível 5, 1d10 no nível 11 e 2d8 no nível 17."
  },
  "Aqua Ring": {
    "description": "Anéis de água curativa cercam você. Enquanto os anéis existirem, você cura 1d4 + MOVE a cada turno no final do seu turno.",
    "higherLevels": "O dano base deste ataque aumenta para 1d6 no nível 5, 1d8 no nível 11 e 1d10 no nível 17."
  },
  "Aqua Tail": {
    "description": "Você envolve sua cauda com uma corrente rodopiante e a bate em nosso inimigo. Faça uma jogada de ataque corpo a corpo contra um oponente, causando 1d10 + MOVE de dano de água em um acerto.",
    "higherLevels": "O dano base deste ataque aumenta para 2d10 no nível 5, 3d10 no nível 11 e 4d10 no nível 17."
  },
  "Arm Thrust": {
    "description": "Você empurra uma mão aberta e desfere golpes implacáveis contra um Pokémon. Faça uma jogada de ataque corpo a corpo, causando 1d6 + MOVE em um acerto. Após atingir com sucesso um alvo, role um d4. Em um resultado de 3 ou 4, você pode atingir imediatamente novamente para um dano normal adicional de 1d6. Continue este processo até falhar em rolar um 3 ou 4 na rolagem do d4.",
    "higherLevels": "O dano base deste ataque aumenta para 1d8 no nível 5, 1d10 no nível 11 e 1d12 no nível 17."
  },
  "Aromatherapy": {
    "description": "Um vento doce e refrescante sopra suavemente. Este Pokémon faz um teste de Medicina. Se o resultado do teste for superior à CD para remover um efeito de status em qualquer criatura a até 60 pés (linha de visão) do conjurador, o efeito é removido. Se não houver CD para remover o efeito de status, a CD efetiva é 15.",
    "higherLevels": ""
  },
  "Aromatic Mist": {
    "description": "Você exala um perfume doce, reforçando a determinação de seu aliado. Pela duração deste movimento, sempre que você ou uma criatura amigável a até 20 pés de você fizer um teste de resistência, a criatura ganha um bônus no teste de resistência igual ao seu modificador de Carisma (com um bônus mínimo de +1).",
    "higherLevels": ""
  },
  "Assist": {
    "description": "Você tenta ser o mais útil possível. Pela duração, você pode usar a ação de ajudar como uma ação bônus.",
    "higherLevels": ""
  },
  "Assurance": {
    "description": "Você dá um tapa nas costas do seu oponente, certificando-se de que ele saiba que você estará lá para ele (quando ele morrer, porque você está matando-o). Faça uma jogada de ataque corpo a corpo contra seu oponente, causando 1d6 + MOVE de dano em um acerto. Se você causou dano diretamente ao seu alvo desde o início do seu turno anterior, você tem vantagem na jogada de ataque.",
    "higherLevels": "O dano base deste ataque aumenta para 2d6 no nível 5, 3d6 no nível 11 e 4d6 no nível 17."
  },
  "Astonish": {
    "description": "Você faz uma careta ou finge um movimento. Se o alvo puder ver você, ele deve ter sucesso em um teste de resistência de Sabedoria ou sofrer 1d4 de dano fantasma e ficar recuado.",
    "higherLevels": "O dano base deste ataque aumenta para 2d4 no nível 5, 3d4 no nível 11 e 4d4 no nível 17."
  },
  "Attack Order": {
    "description": "Você envia seu enxame em um ataque vicioso de mordidas e picadas. Faça uma jogada de ataque à distância, causando 1d10 de dano de inseto em um acerto. Este movimento causa um acerto crítico em uma jogada de ataque de 19 ou 20.",
    "higherLevels": "O dano base deste ataque aumenta para 2d10 no nível 5, 3d10 no nível 11 e 4d10 no nível 17."
  },
  "Attract": {
    "description": "Você é a coisa mais fofa. Uma criatura de gênero diferente do seu dentro do alcance deve ter sucesso em um teste de resistência de Carisma ou ficarará enfeitiçada pela duração, ou até que você ou seus companheiros façam qualquer coisa prejudicial a ela.",
    "higherLevels": ""
  },
  "Aura Sphere": {
    "description": "Você reúne seu espírito em uma bola compacta de energia e a dispara contra um inimigo. Faça uma jogada de ataque à distância com vantagem, causando 1d12 + MOVE de dano lutador em um acerto bem-sucedido.",
    "higherLevels": "O dano base deste ataque aumenta para 2d12 no nível 5, 3d12 no nível 11 e 4d12 no nível 17."
  },
  "Aurora Beam": {
    "description": "Você cria uma linha de 60 pés de comprimento e 5 pés de largura de luz brilhante, mas congelante. Qualquer criatura pega na linha deve fazer um teste de resistência de destreza, sofrendo 2d6 de dano de gelo em uma falha ou metade disso em um sucesso. Se uma criatura falhar no teste de resistência por 10 ou mais, ela fica congelada.",
    "higherLevels": "O dano base deste ataque aumenta para 4d6 no nível 5, 6d6 no nível 11 e 8d6 no nível 17."
  },
  "Aurora Veil": {
    "description": "Você se cerca com um véu dançante de luzes coloridas. Você ganha 5 pontos de vida temporários pela duração. Se uma criatura atingir você com um ataque corpo a corpo enquanto você tiver esses pontos de vida temporários, a criatura sofre 5 de dano de gelo.",
    "higherLevels": "A vida temporária e o dano de gelo deste movimento aumentam para 15 no nível 5, 25 no nível 11 e 35 no nível 17."
  },
  "Autotomize": {
    "description": "Você aguça sua mente e sente uma onda de poder através de você. Enquanto você tiver o tipo, aumente seu deslocamento de caminhada, voo ou natação em 20 pés pela duração. Você causa 1d4 adicional em ataques corpo a corpo pela duração.",
    "higherLevels": "No nível 10, o dano extra em seus ataques corpo a corpo aumenta para 2d4."
  },
  "Avalanche": {
    "description": "Você libera uma torrente de gelo e neve que foi afrouxada por um ato violento. Alveje um espaço dentro do alcance. Desenhe uma linha a partir desse espaço com 5 pés de largura e 20 pés de comprimento. Qualquer criatura pega na linha deve ter sucesso em um teste de resistência de DES contra a sua CD de Move, sofrendo 2d6 de dano de gelo em um teste de resistência falho, ou metade do dano em um sucesso. Se você estiver com menos de metade do HP, essas criaturas têm desvantagem no teste de resistência.",
    "higherLevels": "O dano base deste ataque aumenta para 4d6 no nível 5, 6d6 no nível 11 e 8d6 no nível 17."
  },
  "Baby Doll Eyes": {
    "description": "Enquanto seu oponente ataca você, você faz olhos grandes de cachorrinho. Após uma jogada de ataque contra você ser declarada, mas antes da jogada ser feita, você pode usar sua reação para fazer um inimigo realizar um teste de resistência de Carisma contra a sua CD de MOVE. Em uma falha, essa criatura tem desvantagem no ataque. Se esse ataque atingir, você só sofre metade do dano.",
    "higherLevels": ""
  },
  "Baneful Bunker": {
    "description": "Você arma seus espinhos venenosos e os aponta para seu inimigo. Como uma reação ao ser alvo de um ataque, você pode aumentar sua CA em +5 até o início de seu próximo turno. Você deve decidir usar este movimento antes de saber se o ataque disparador acerta. Se o seu atacante estiver adjacente a você quando você usar este movimento e o ataque dele errar, seu atacante fica envenenado.",
    "higherLevels": ""
  },
  "Barrage": {
    "description": "Faça um ataque à distância em um Pokémon. Se você acertar, role 1d4. Você ataca com uma barragem de golpes à distância igual ao número mostrado. Faça uma jogada de ataque à distância para cada projétil. Os projéteis causam 1d4 de dano normal cada em um acerto.",
    "higherLevels": "O dano base deste ataque aumenta para 1d6 no nível 5, 1d8 no nível 11 e 1d10 no nível 17."
  },
  "Barrier": {
    "description": "Você cria um escudo transparente de energia psíquica. Pela duração, a barreira concede +2 na CA para você e quaisquer aliados dentro de um raio de 5 pés de você.",
    "higherLevels": ""
  },
  "Baton Pass": {
    "description": "Você passa sua energia para outro. Escolha um alvo que você possa tocar. Você pode dar sua ação ao alvo, perdendo sua ação neste turno e concedendo ao alvo uma ação extra para usar no turno dele. Você não pode usar este movimento se já tiver usado sua ação neste turno. Uma vez que você use este movimento, seu turno termina imediatamente.",
    "higherLevels": ""
  },
  "Beak Blast": {
    "description": "Você reúne uma energia feroz dentro do seu bico, preparando-se para liberá-la em uma explosão. Durante a duração, se você for atingido por um oponente que esteja adjacente a você, esse oponente fica queimado. Como a ação do seu próximo turno, se você mantiver sua concentração, você libera sua energia armazenada. Faça uma jogada de ataque à distância contra um oponente dentro do alcance, causando 5d6 + MOVE de dano em um acerto.",
    "higherLevels": "O dano base deste ataque aumenta para 8d6 no nível 5, 11d6 no nível 11 e 14d6 no nível 17."
  },
  "Beat Up": {
    "description": "Você clama pela força de seus aliados para se unirem contra um inimigo. Faça uma jogada de ataque corpo a corpo contra um oponente. Em um acerto bem-sucedido, você causa 1d4 de dano sombrio para cada Pokeslot ao qual seu treinador tem acesso, então adicionando seu modificador de MOVE para dano sombrio adicional. Um Pokémon selvagem causa 1d4 de dano sombrio por aliado ativo adjacente a si mesmo até um máximo de 6d4, então adiciona seu modificador de MOVE.",
    "higherLevels": ""
  },
  "Belch": {
    "description": "Você solta um arroto horrendo de gases digestivos. Faça um ataque à distância contra um oponente causando 1d4 + MOVE de dano de veneno em um acerto. Se você tiver comido uma fruta durante este combate, todos os dados de dano para este movimento tornam-se d12s.",
    "higherLevels": "O dano base deste ataque aumenta para 2d4 no nível 5, 3d4 no nível 11 e 4d4 no nível 17."
  },
  "Belly Drum": {
    "description": "Você começa a bater em seu estômago e se lança em uma dança de batalha. Seu próximo ataque bem-sucedido causa 1d6 de dano normal a si mesmo e 2d6 de dano normal extra ao alvo.",
    "higherLevels": "O dano a você e ao oponente aumenta para 2d6 e 4d6 respectivamente no nível 5, 3d6 e 6d6 no nível 11, e 4d6 e 8d6 no nível 17."
  },
  "Bestow": {
    "description": "Você usa sua afinidade natural pelos outros para ajudar na batalha. Pela duração, seus amigos têm vantagem em jogadas de ataque corpo a corpo contra qualquer criatura a até 5 pés de você que seja hostil a você.",
    "higherLevels": ""
  },
  "Bide": {
    "description": "Você abraça o dano causado a você, esperando sua hora de atacar. Você pode usar sua ação para ativar este movimento e acompanhar todo o dano causado a você antes do seu próximo turno. No seu próximo turno, você pode usar sua ação para atacar um inimigo com um ataque à distância, atingindo-o pelo dobro da quantidade de dano que você sofreu desde o seu último turno em um acerto bem-sucedido.",
    "higherLevels": "No nível 11, você pode escolher manter o Bide por um segundo turno pela chance de adicionar dano adicional ao ataque."
  },
  "Bind": {
    "description": "Você tenta agarrar um alvo para submetê-lo. Faça uma jogada de ataque corpo a corpo. Em um acerto, o alvo sofre 1d6 + MOVE de dano normal e fica agarrado e impedido. No início de cada um dos turnos dele, ele pode tentar escapar com um teste de resistência de Força contra a sua CD de Move. Enquanto um Pokémon estiver agarrado por você, você pode continuar a causar automaticamente 1d6 + MOVE de dano como uma ação bônus e sem usar PP.",
    "higherLevels": "O dano base aumenta para 1d12 no nível 11."
  },
  "Bite": {
    "description": "Você enterra seus dentes em um Pokémon inimigo. Faça uma jogada de ataque corpo a corpo, causando 1d6 + MOVE de dano sombrio em um acerto bem-sucedido.",
    "higherLevels": "O dano base deste ataque aumenta para 2d6 no nível 5, 3d6 no nível 11 e 4d6 no nível 17."
  },
  "Blast Burn": {
    "description": "Você dizima seu oponente com uma explosão poderosa de fogo. Faça uma jogada de ataque à distância causando 8d8 de dano de fogo em um acerto. Até o final do seu próximo turno, sua velocidade de movimento torna-se zero e você não pode usar movimentos de dano.",
    "higherLevels": "O dano aumenta para 12d8 no nível 11."
  },
  "Blaze Kick": {
    "description": "Você incendeia seu pé com fogo e chuta seu alvo. Faça uma jogada de ataque corpo a corpo, causando 1d8 + MOVE de dano de fogo em um acerto bem-sucedido. Este movimento causa um acerto crítico em uma rolagem natural de 19 ou 20. Se você acertar, seu alvo deve fazer um teste de resistência de Constituição CD 10 ou ficar queimado.",
    "higherLevels": "O dano base deste ataque aumenta para 2d8 no nível 5, 3d8 no nível 11 e 4d8 no nível 17."
  },
  "Blizzard": {
    "description": "Nuvens geladas se formam acima e bombardeiam o solo com granizo e neve, centradas em um ponto que você escolher dentro do alcance. Cada Pokémon dentro de um raio de 10 pés deve fazer um teste de resistência de Destreza contra a sua CD de Move, sofrendo 4d6 de dano de gelo em um teste de resistência falho, ou metade disso em um acerto bem-sucedido.",
    "higherLevels": "O dano base deste ataque aumenta para 7d6 no nível 5, 10d6 no nível 11 e 13d6 no nível 17."
  },
  "Block": {
    "description": "Ao forçar seu corpo na frente de seu inimigo, você para o movimento dele. Escolha um oponente dentro do alcance para fazer um teste de resistência de Força. Em uma falha, ele fica impedido (embora nada o esteja segurando fisicamente). O alvo pode repetir o teste de resistência no final do turno dele para encerrar o efeito.",
    "higherLevels": ""
  },
  "Body Slam": {
    "description": "Você se lança em direção a um oponente em uma tentativa de esmagá-lo com seu tamanho físico. Faça um ataque corpo a corpo em um alvo. Em um acerto, o alvo sofre 1d8 + MOVE de dano normal e deve ter sucesso em um teste de resistência de Constituição CD 12 ou ficar paralisado.",
    "higherLevels": "O dano base deste ataque aumenta para 2d8 no nível 5, 3d8 no nível 11 e 4d8 no nível 17."
  }
};

const typeMap = {
    "poison": "veneno",
    "fire": "fogo",
    "water": "água",
    "grass": "planta",
    "electric": "elétrico",
    "psychic": "psíquico",
    "ice": "gelo",
    "dragon": "dragão",
    "dark": "sombrio",
    "fairy": "fada",
    "fighting": "lutador",
    "flying": "voador",
    "ghost": "fantasma",
    "ground": "terra",
    "rock": "pedra",
    "steel": "aço",
    "bug": "inseto",
    "normal": "normal"
};

const commonReplacements = [
    [/Make a ranged attack roll/gi, "Faça uma jogada de ataque à distância"],
    [/Make a ranged attack/gi, "Faça um ataque à distância"],
    [/Make a melee attack roll/gi, "Faça uma jogada de ataque corpo a corpo"],
    [/Make a melee attack/gi, "Faça um ataque corpo a corpo"],
    [/On a hit/gi, "Em um acerto"],
    [/On a successful hit/gi, "Em um acerto bem-sucedido"],
    [/On a failure/gi, "Em uma falha"],
    [/On a success/gi, "Em um sucesso"],
    [/On a failed save/gi, "Em um teste de resistência falho"],
    [/saving throw/gi, "teste de resistência"],
    [/against your MOVE CD/gi, "contra a sua CD de MOVE"],
    [/against your Move DC/gi, "contra a sua CD de Move"],
    [/Constitution/gi, "Constituição"],
    [/Dexterity/gi, "Destreza"],
    [/Strength/gi, "Força"],
    [/Intelligence/gi, "Inteligência"],
    [/Wisdom/gi, "Sabedoria"],
    [/Charisma/gi, "Carisma"],
    [/within range/gi, "dentro do alcance"],
    [/feet/gi, "pés"],
    [/action/gi, "ação"],
    [/bonus action/gi, "ação bônus"],
    [/reaction/gi, "reação"],
    [/Concentration/gi, "Concentração"],
    [/duration/gi, "duração"],
    [/at level (\d+)/gi, "no nível $1"],
    [/at level/gi, "no nível"],
    [/level (\d+)/gi, "nível $1"],
    [/increases to/gi, "aumenta para"],
    [/The base damage of this attack/gi, "O dano base deste ataque"],
    [/Half the damage done is restored by the user/gi, "Metade do dano causado é restaurada pelo usuário"],
    [/the creature takes/gi, "a criatura sofre"],
    [/the target takes/gi, "o alvo sofre"],
    [/the Pokémon takes/gi, "o Pokémon sofre"],
    [/takes (.*?) (poison|fire|water|grass|electric|psychic|ice|dragon|dark|fairy|fighting|flying|ghost|ground|rock|steel|bug|normal) damage/gi, (m, d, t) => `sofre ${d} de dano de ${typeMap[t.toLowerCase()]}`],
    [/dealing (.*?) (poison|fire|water|grass|electric|psychic|ice|dragon|dark|fairy|fighting|flying|ghost|ground|rock|steel|bug|normal) damage/gi, (m, d, t) => `causando ${d} de dano de ${typeMap[t.toLowerCase()]}`],
    [/(\d+d\d+ \+ MOVE) (poison|fire|water|grass|electric|psychic|ice|dragon|dark|fairy|fighting|flying|ghost|ground|rock|steel|bug|normal) damage/gi, (m, d, t) => `${d} de dano de ${typeMap[t.toLowerCase()]}`],
    [/ (poison|fire|water|grass|electric|psychic|ice|dragon|dark|fairy|fighting|flying|ghost|ground|rock|steel|bug|normal) damage/gi, (m, t) => ` de dano de ${typeMap[t.toLowerCase()]}`],
    [/reactions/gi, "reações"],
    [/become poisoned/gi, "fica envenenado"],
    [/become burned/gi, "fica queimado"],
    [/become paralyzed/gi, "fica paralisado"],
    [/become frozen/gi, "fica congelado"],
    [/become confused/gi, "fica confuso"],
    [/become flinched/gi, "fica recuado"],
    [/become prone/gi, "fica caído"]
];

function translate(text) {
    if (!text) return "";
    let translated = text;
    for (const [regex, replacement] of commonReplacements) {
        if (typeof replacement === 'function') {
            translated = translated.replace(regex, replacement);
        } else {
            translated = translated.replace(regex, replacement);
        }
    }
    return translated;
}

movesSource.forEach((sourceMove, index) => {
  const move = moves[index]; // Assuming same order
  const trans = translations[sourceMove.name];
  if (trans) {
    move.description = {
      en: sourceMove.description,
      pt: trans.description
    };
    move.higherLevels = {
      en: sourceMove.higherLevels || "",
      pt: trans.higherLevels || ""
    };
  } else {
    move.description = {
        en: sourceMove.description,
        pt: translate(sourceMove.description)
    };
    move.higherLevels = {
        en: sourceMove.higherLevels || "",
        pt: translate(sourceMove.higherLevels)
    };
  }
});

fs.writeFileSync(movesPath, JSON.stringify(moves, null, 2), 'utf8');
console.log('Processed ' + moves.length + ' moves.');
