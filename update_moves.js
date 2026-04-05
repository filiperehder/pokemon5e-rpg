
const fs = require("fs");
const path = "C:/Users/filip/Downloads/pokemon/public/data/moves_chunk_0.json";
const moves = JSON.parse(fs.readFileSync(path, "utf8"));

const glossary = [
  { en: /Make a (melee|ranged) attack roll/gi, pt: "Faça uma jogada de ataque $1" },
  { en: /Make a (melee|ranged) attack/gi, pt: "Faça um ataque $1" },
  { en: /On a hit/gi, pt: "Em um acerto" },
  { en: /On a successful hit/gi, pt: "Em um acerto bem-sucedido" },
  { en: /On a failure/gi, pt: "Em uma falha" },
  { en: /On a success/gi, pt: "Em um sucesso" },
  { en: /against your MOVE DC/gi, pt: "contra a sua CD de MOVE" },
  { en: /Constitution saving throw/gi, pt: "teste de resistência de Constituição" },
  { en: /Dexterity saving throw/gi, pt: "teste de resistência de Destreza" },
  { en: /Strength saving throw/gi, pt: "teste de resistência de Força" },
  { en: /Intelligence saving throw/gi, pt: "teste de resistência de Inteligência" },
  { en: /Wisdom saving throw/gi, pt: "teste de resistência de Sabedoria" },
  { en: /Charisma saving throw/gi, pt: "teste de resistência de Carisma" },
  { en: /saving throw/gi, pt: "teste de resistência" },
  { en: /within range/gi, pt: "dentro do alcance" },
  { en: /(\d+) feet/gi, pt: "$1 pés" },
  { en: /\bfeet\b/gi, pt: "pés" },
  { en: /bonus action/gi, pt: "ação bônus" },
  { en: /reaction/gi, pt: "reação" },
  { en: /\baction\b/gi, pt: "ação" },
  { en: /increases to/gi, pt: "aumenta para" },
  { en: /at level (\d+)/gi, pt: "no nível $1" },
  { en: /The base damage of this attack/gi, pt: "O dano base deste ataque" },
  { en: /Half the damage done is restored by the user/gi, pt: "Metade do dano causado é restaurada pelo usuário" }
];

const termMap = {
  "melee": "corpo a corpo",
  "ranged": "à distância",
  "Constitution": "Constituição",
  "Dexterity": "Destreza",
  "Strength": "Força",
  "Intelligence": "Inteligência",
  "Wisdom": "Sabedoria",
  "Charisma": "Carisma"
};

function applyGlossary(text) {
  if (!text) return text;
  let res = text;
  glossary.forEach(item => {
    res = res.replace(item.en, item.pt);
  });
  // Replace remaining terms
  Object.keys(termMap).forEach(key => {
    const reg = new RegExp("\\b" + key + "\\b", "gi");
    res = res.replace(reg, termMap[key]);
  });
  return res;
}

moves.forEach(m => {
  let enDesc = typeof m.description === "string" ? m.description : (m.description.en || "");
  let ptDesc = typeof m.description === "object" ? (m.description.pt || "") : (m.description || "");
  
  let enHL = typeof m.higherLevels === "string" ? m.higherLevels : (m.higherLevels ? (m.higherLevels.en || "") : "");
  let ptHL = typeof m.higherLevels === "object" ? (m.higherLevels ? (m.higherLevels.pt || "") : "") : (m.higherLevels || "");

  // If pt is same as en, it means it was not translated.
  // We apply glossary to PT to fix existing ones.
  ptDesc = applyGlossary(ptDesc);
  ptHL = applyGlossary(ptHL);

  m.description = { en: enDesc, pt: ptDesc };
  m.higherLevels = { en: enHL, pt: ptHL };
});

fs.writeFileSync(path, JSON.stringify(moves, null, 2), "utf8");
console.log("Updated 100 moves in moves_chunk_0.json");
