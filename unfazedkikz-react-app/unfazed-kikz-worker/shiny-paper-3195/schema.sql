-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL
);

-- Create lines table (references brands)
CREATE TABLE IF NOT EXISTS lines (
    id TEXT PRIMARY KEY,
    brand_id TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (brand_id) REFERENCES brands(id)
);

-- Create shoes table (references lines)
CREATE TABLE IF NOT EXISTS shoes (
    id TEXT PRIMARY KEY,
    line_id TEXT NOT NULL,
    model TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (line_id) REFERENCES lines(id)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_lines_brand_id ON lines(brand_id);
CREATE INDEX IF NOT EXISTS idx_shoes_line_id ON shoes(line_id);
CREATE INDEX IF NOT EXISTS idx_brands_name ON brands(name);
CREATE INDEX IF NOT EXISTS idx_lines_name ON lines(name);
