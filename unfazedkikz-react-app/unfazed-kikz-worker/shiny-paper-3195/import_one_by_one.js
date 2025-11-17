const fs = require('fs');

const content = fs.readFileSync('shoes_batch_2_1.sql', 'utf8');
const valuesMatch = content.match(/VALUES\s+(.+);?\s*$/s);
if (!valuesMatch) process.exit(1);

let valuesStr = valuesMatch[1].trim().replace(/;$/, '');
const records = valuesStr.split(/\),\s*\(/);
records[0] = records[0].replace(/^\(/, '');
records[records.length - 1] = records[records.length - 1].replace(/\)$/, '');

// Create individual files for each record
records.forEach((record, i) => {
  const sql = `INSERT INTO shoes (id, line_id, model, image_url, created_at) VALUES (${record});\n`;
  fs.writeFileSync(`shoes_single_${i + 1}.sql`, sql);
});

console.log(`Created ${records.length} individual SQL files`);
