const fs = require('fs');

const filename = process.argv[2];
if (!filename) {
  console.log('Usage: node split-sql.js <filename>');
  process.exit(1);
}

const content = fs.readFileSync(filename, 'utf8');

// Remove "public" schema
const cleaned = content.replace(/"public"\./g, '');

// Extract VALUES content
const valuesMatch = cleaned.match(/VALUES\s+(.+);?\s*$/s);
if (!valuesMatch) {
  console.log('Could not find VALUES');
  process.exit(1);
}

// Split on "), (" pattern
let valuesStr = valuesMatch[1].trim().replace(/;$/, '');
const records = valuesStr.split(/\),\s*\(/);

// Clean up: first record starts with '(', last ends with ')'
records[0] = records[0].replace(/^\(/, '');
records[records.length - 1] = records[records.length - 1].replace(/\)$/, '');

// Now all records are just the content without outer parentheses
// Add them back properly
const cleanRecords = records.map(r => `(${r})`);

console.log(`Found ${cleanRecords.length} records`);

// Split into batches
const batchSize = 50;
const baseName = filename.replace('.sql', '').replace('_rows', '');

for (let i = 0; i < cleanRecords.length; i += batchSize) {
  const batch = cleanRecords.slice(i, i + batchSize);
  const batchNum = Math.floor(i / batchSize) + 1;
  const outputFile = `${baseName}_batch_${batchNum}.sql`;
  
  const sql = `INSERT INTO shoes (id, line_id, model, image_url, created_at) VALUES\n${batch.join(',\n')};\n`;
  
  fs.writeFileSync(outputFile, sql);
  console.log(`Created ${outputFile} with ${batch.length} records`);
}
