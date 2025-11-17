const fs = require('fs');

const content = fs.readFileSync('shoes_batch_2_1.sql', 'utf8');
const cleaned = content.replace(/"public"\./g, '');
const valuesMatch = cleaned.match(/VALUES\s+(.+);?\s*$/s);
if (!valuesMatch) {
    console.log('Could not find VALUES');
    process.exit(1);
}

let valuesStr = valuesMatch[1].trim().replace(/;$/, '');
const records = valuesStr.split(/\),\s*\(/);
records[0] = records[0].replace(/^\(/, '');
records[records.length - 1] = records[records.length - 1].replace(/\)$/, '');
const cleanRecords = records.map(r => `(${r})`);

console.log(`Found ${cleanRecords.length} records`);

// Split into batches of 10
const batchSize = 10;
for (let i = 0; i < cleanRecords.length; i += batchSize) {
  const batch = cleanRecords.slice(i, i + batchSize);
  const batchNum = Math.floor(i / batchSize) + 1;
  const outputFile = `shoes_batch_2_1_tiny_${batchNum}.sql`;
  
  const sql = `INSERT INTO shoes (id, line_id, model, image_url, created_at) VALUES\n${batch.join(',\n')};\n`;
  fs.writeFileSync(outputFile, sql);
  console.log(`Created ${outputFile} with ${batch.length} records`);
}
