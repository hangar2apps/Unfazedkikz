import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

const handler = async (req) => {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    // Get all brands
    const { data: brands, error: brandsError } = await supabase
      .from("brands")
      .select("id, name")
      .order("name");

    if (brandsError) {
      throw brandsError;
    }

    // Get all shoes with their brand and line info
    const { data: shoes, error: shoesError } = await supabase
      .from("shoes")
      .select(`
        id,
        model,
        image_url,
        lines(id, name, brand_id, brands(id, name))
      `)
      .order("created_at", { ascending: false });

    if (shoesError) {
      throw shoesError;
    }

    // Format shoes data for frontend
    const formattedShoes = shoes.map(shoe => ({
      ID: shoe.id,
      ShoeModel: shoe.model,
      ShoeLine: shoe.lines.name,
      ShoeBrand: shoe.lines.brands.name,
      URL: shoe.image_url
    }));

    return new Response(JSON.stringify({
      shoeBrands: brands.map(b => b.name),
      shoes: formattedShoes,
      totalShoes: formattedShoes.length
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Function Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export default handler;
