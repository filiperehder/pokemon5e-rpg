const fs = require('fs');
const path = require('path');

const glossary = [
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
    [/against your MOVE DC/gi, "contra a sua CD de MOVE"],
    [/against your Move DC/gi, "contra a sua CD de Move"],
    [/Constitution/gi, "Constituição"],
    [/Dexterity/gi, "Destreza"],
    [/Strength/gi, "Força"],
    [/Intelligence/gi, "Inteligência"],
    [/Wisdom/gi, "Sabedoria"],
    [/Charisma/gi, "Charisma"], // Fixed typo in previous script
    [/within range/gi, "dentro do alcance"],
    [/feet/gi, "pés"],
    [/action/gi, "ação"],
    [/bonus action/gi, "ação bônus"],
    [/reaction/gi, "reação"],
    [/Concentration/gi, "Concentração"],
    [/duration/gi, "duração"],
    [/at level (\d+)/gi, "no nível $1"],
    [/increases to/gi, "aumenta para"],
    [/The base damage of this attack/gi, "O dano base deste ataque"],
    [/Half the damage done is restored by the user/gi, "Metade do dano causado é restaurada pelo usuário"]
];

function translate(text) {
    if (!text) return "";
    let res = text;
    for (const [regex, replacement] of glossary) {
        res = res.replace(regex, replacement);
    }
    return res;
}

for (let i = 0; i <= 6; i++) {
    const filePath = `public/data/moves_chunk_${i}.json`;
    if (!fs.existsSync(filePath)) continue;
    
    const moves = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const updated = moves.map(move => {
        // Ensure structure is { en, pt }
        const descEn = typeof move.description === 'string' ? move.description : move.description.en;
        const hlEn = typeof move.higherLevels === 'string' ? move.higherLevels : move.higherLevels.en;
        
        return {
            ...move,
            description: {
                en: descEn,
                pt: translate(descEn)
            },
            higherLevels: {
                en: hlEn,
                pt: translate(hlEn)
            }
        };
    });
    
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf8');
    console.log(`Updated structure for ${filePath}`);
}
