/**
 * Cloudflare Worker API for Unfazed Kikz
 * Replaces Supabase database queries with D1
 */

interface Env {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route: GET /shoes - Get all shoes with brand/line info
      if (path === '/shoes' && request.method === 'GET') {
        return await getAllShoes(env.DB, corsHeaders);
      }

      // Route: GET /shoes/by-line?lineId=xxx - Get shoes by line
      if (path === '/shoes/by-line' && request.method === 'GET') {
        const lineId = url.searchParams.get('lineId');
        if (!lineId) {
          return jsonResponse({ error: 'Line ID required' }, 400, corsHeaders);
        }
        return await getShoesByLine(env.DB, lineId, corsHeaders);
      }

      // Route: POST /shoes - Create a new shoe
      if (path === '/shoes' && request.method === 'POST') {
        const body = await request.json() as any;
        return await createShoe(env.DB, body, corsHeaders);
      }

      // Route: DELETE /shoes - Delete a shoe
      if (path === '/shoes' && request.method === 'DELETE') {
        const body = await request.json() as any;
        return await deleteShoe(env.DB, body, corsHeaders);
      }

      // Route: GET /brands - Get all brands
      if (path === '/brands' && request.method === 'GET') {
        return await getBrands(env.DB, corsHeaders);
      }

      // Route: GET /lines?brandId=xxx - Get lines by brand
      if (path === '/lines' && request.method === 'GET') {
        const brandId = url.searchParams.get('brandId');
        return await getLines(env.DB, brandId, corsHeaders);
      }

      return jsonResponse({ error: 'Not Found' }, 404, corsHeaders);
    } catch (error) {
      console.error('Worker Error:', error);
      return jsonResponse(
        { error: 'Internal server error' },
        500,
        corsHeaders
      );
    }
  },
};

/**
 * Get all shoes with brand and line information
 * Matches the format of your getShoes.mjs function
 */
async function getAllShoes(db: D1Database, headers: Record<string, string>) {
  const query = `
    SELECT 
      s.id,
      s.model,
      s.image_url,
      l.id as line_id,
      l.name as line_name,
      b.id as brand_id,
      b.name as brand_name
    FROM shoes s
    JOIN lines l ON s.line_id = l.id
    JOIN brands b ON l.brand_id = b.id
    ORDER BY s.created_at DESC
  `;

  const result = await db.prepare(query).all();

  if (!result.results || result.results.length === 0) {
    return jsonResponse({
      shoeBrands: [],
      shoes: [],
      totalProcessed: 0,
      totalAvailable: 0
    }, 200, headers);
  }

  // Extract unique brands
  const shoeBrands = new Set<string>();
  const shoes = result.results.map((row: any) => {
    shoeBrands.add(row.brand_name);
    return {
      ID: row.id,
      ShoeBrand: row.brand_name,
      ShoeLine: row.line_name,
      ShoeModel: row.model,
      URL: row.image_url
    };
  });

  return jsonResponse({
    shoeBrands: Array.from(shoeBrands),
    shoes: shoes,
    totalProcessed: shoes.length,
    totalAvailable: shoes.length
  }, 200, headers);
}

/**
 * Get shoes by line ID
 * Matches the format of your getShoesByLine.mjs function
 */
async function getShoesByLine(
  db: D1Database,
  lineId: string,
  headers: Record<string, string>
) {
  const query = `
    SELECT id, model, image_url, line_id
    FROM shoes
    WHERE line_id = ?
    ORDER BY created_at DESC
  `;

  const result = await db.prepare(query).bind(lineId).all();

  return jsonResponse({
    shoes: result.results || []
  }, 200, headers);
}

/**
 * Create a new shoe
 * Used by your upload function after GitHub upload
 */
async function createShoe(
  db: D1Database,
  body: {
    shoeBrand: string;
    shoeLine: string;
    shoeModel: string;
    imageUrl: string;
  },
  headers: Record<string, string>
) {
  const { shoeBrand, shoeLine, shoeModel, imageUrl } = body;

  if (!shoeBrand || !shoeLine || !shoeModel || !imageUrl) {
    return jsonResponse({ error: 'Missing required fields' }, 400, headers);
  }

  try {
    // Get or create brand
    let brand = await db
      .prepare('SELECT id FROM brands WHERE name = ?')
      .bind(shoeBrand)
      .first();

    if (!brand) {
      const brandId = crypto.randomUUID();
      await db
        .prepare('INSERT INTO brands (id, name, created_at) VALUES (?, ?, ?)')
        .bind(brandId, shoeBrand, new Date().toISOString())
        .run();
      brand = { id: brandId };
    }

    // Get or create line
    let line = await db
      .prepare('SELECT id FROM lines WHERE brand_id = ? AND name = ?')
      .bind(brand.id, shoeLine)
      .first();

    if (!line) {
      const lineId = crypto.randomUUID();
      await db
        .prepare(
          'INSERT INTO lines (id, brand_id, name, created_at) VALUES (?, ?, ?, ?)'
        )
        .bind(lineId, brand.id, shoeLine, new Date().toISOString())
        .run();
      line = { id: lineId };
    }

    // Insert shoe
    const shoeId = crypto.randomUUID();
    await db
      .prepare(
        'INSERT INTO shoes (id, line_id, model, image_url, created_at) VALUES (?, ?, ?, ?, ?)'
      )
      .bind(shoeId, line.id, shoeModel, imageUrl, new Date().toISOString())
      .run();

    return jsonResponse({
      message: 'Shoe created successfully',
      id: shoeId
    }, 200, headers);
  } catch (error) {
    console.error('Create shoe error:', error);
    return jsonResponse({ error: 'Failed to create shoe' }, 500, headers);
  }
}

/**
 * Delete a shoe
 * Used by your delete function after GitHub deletion
 */
async function deleteShoe(
  db: D1Database,
  body: { shoeToDelete: string },
  headers: Record<string, string>
) {
  const { shoeToDelete } = body;

  if (!shoeToDelete) {
    return jsonResponse({ error: 'Missing shoe to delete' }, 400, headers);
  }

  // shoeToDelete format: "BrandName/LineName/ModelName"
  const [brandName, lineName, modelName] = shoeToDelete.split('/');

  // Find the shoe
  const query = `
    SELECT 
      s.id,
      l.name as line_name,
      b.name as brand_name
    FROM shoes s
    JOIN lines l ON s.line_id = l.id
    JOIN brands b ON l.brand_id = b.id
    WHERE s.model = ? AND l.name = ? AND b.name = ?
  `;

  const shoe = await db
    .prepare(query)
    .bind(modelName, lineName, brandName)
    .first();

  if (!shoe) {
    return jsonResponse({ error: 'Shoe not found' }, 404, headers);
  }

  // Delete the shoe
  await db.prepare('DELETE FROM shoes WHERE id = ?').bind(shoe.id).run();

  return jsonResponse({
    message: 'Shoe removed successfully'
  }, 200, headers);
}

/**
 * Get all brands
 */
async function getBrands(db: D1Database, headers: Record<string, string>) {
  const result = await db
    .prepare('SELECT id, name FROM brands ORDER BY name')
    .all();

  return jsonResponse({
    brands: result.results || []
  }, 200, headers);
}

/**
 * Get lines (optionally filtered by brand)
 */
async function getLines(
  db: D1Database,
  brandId: string | null,
  headers: Record<string, string>
) {
  let query = 'SELECT id, brand_id, name FROM lines';
  
  if (brandId) {
    query += ' WHERE brand_id = ?';
  }
  
  query += ' ORDER BY name';

  let stmt = db.prepare(query);
  
  if (brandId) {
    stmt = stmt.bind(brandId);
  }

  const result = await stmt.all();

  return jsonResponse({
    lines: result.results || []
  }, 200, headers);
}

/**
 * Helper to create JSON responses
 */
function jsonResponse(
  data: any,
  status: number,
  additionalHeaders: Record<string, string> = {}
) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...additionalHeaders,
    },
  });
}
