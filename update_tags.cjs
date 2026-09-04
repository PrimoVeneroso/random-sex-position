const fs = require('fs');

const dataFile = 'data/data.json';
const tagsFile = 'tag_aggiornati.json';

const d = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const tags = JSON.parse(fs.readFileSync(tagsFile, 'utf8'));

d.data.forEach(item => {
  const idStr = item.id.toString();
  if (tags[idStr]) {
    const updates = tags[idStr];
    for (const key in updates) {
        item[key] = updates[key];
    }
  }
});

fs.writeFileSync(dataFile, JSON.stringify(d, null, 4));
console.log("Updated tags successfully!");
