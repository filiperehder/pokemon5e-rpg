const fs = require('fs');
const path = require('path');

const moves = JSON.parse(fs.readFileSync('public/data/moves_english.json', 'utf8'));
const chunkSize = 100;

for (let i = 0; i < moves.length; i += chunkSize) {
    const chunk = moves.slice(i, i + chunkSize);
    fs.writeFileSync(`public/data/moves_chunk_${i / chunkSize}.json`, JSON.stringify(chunk, null, 2), 'utf8');
}
console.log(`Split into ${Math.ceil(moves.length / chunkSize)} chunks.`);
