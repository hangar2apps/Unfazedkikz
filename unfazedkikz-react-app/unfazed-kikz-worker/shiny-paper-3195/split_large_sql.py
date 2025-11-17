import re
import sys

filename = sys.argv[1] if len(sys.argv) > 1 else 'shoes_rows_2.sql'

# Read the file
with open(filename, 'r') as f:
    content = f.read()

# Remove "public" schema if present
content = content.replace('"public".', '')

# Extract the INSERT part and the VALUES part
match = re.search(r'INSERT INTO\s+\S+\s+\([^)]+\)\s+VALUES\s+(.+);?$', content, re.DOTALL)
if not match:
    print("Could not parse SQL file")
    sys.exit(1)

values_part = match.group(1).rstrip(';').strip()

# Split by '), (' pattern to get individual records
# Add back the parentheses
records = [f"({r.strip()})" for r in values_part.split('), (')]

print(f"Found {len(records)} records")

# Split into batches of 50 (smaller batches for safety)
batch_size = 50
base_name = filename.replace('.sql', '').replace('_rows', '').replace('shoes_', 'shoes_batch_')

for i in range(0, len(records), batch_size):
    batch = records[i:i+batch_size]
    batch_num = i//batch_size + 1
    output_file = f'{base_name}_{batch_num}.sql'
    
    with open(output_file, 'w') as f:
        f.write('INSERT INTO shoes (id, line_id, model, image_url, created_at) VALUES\n')
        f.write(',\n'.join(batch))
        f.write(';\n')
    
    print(f"Created {output_file} with {len(batch)} records")

print(f"\nTotal: {len(records)} records in {(len(records)-1)//batch_size + 1} files")
