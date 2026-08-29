const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/data.json'));
d.data.forEach(item => {
  delete item.anale;
  delete item.vaginale;
  delete item.orale;
  delete item.gia_fatta;
  item.anal = false;
  item.vaginal = true;
  item.oral = false;
  item.already_done = false;
});
fs.writeFileSync('data/data.json', JSON.stringify(d, null, 4));
