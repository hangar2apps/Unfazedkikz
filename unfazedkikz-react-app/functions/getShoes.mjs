import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const handler = async (req) => {
  console.log("in getShoes cloud function");
  // Only allow GET requests
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    console.log("Attempting to query shoes from Supabase...");
    // Query all shoes with joins to lines and brands
    const { data: shoes, error: shoesError } = await supabase
      .from("shoes")
      .select(`
        id,
        model,
        image_url,
        lines(
          id,
          name,
          brands(
            id,
            name
          )
        )
      `);

    console.log("Query result:", { shoesError, shoesCount: shoes?.length });
    if (shoesError) {
      console.error("Supabase query error:", shoesError);
      throw shoesError;
    }

    if (!shoes || shoes.length === 0) {
      return new Response(JSON.stringify({
        shoeBrands: [],
        shoes: []
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Extract unique brands and format shoes
    const shoeBrands = new Set();
    const shoesArray = shoes.map(shoe => {
      const brandName = shoe.lines?.brands?.name || "Unknown";
      const lineName = shoe.lines?.name || "Unknown";

      shoeBrands.add(brandName);

      return {
        ID: shoe.id,
        ShoeBrand: brandName,
        ShoeLine: lineName,
        ShoeModel: shoe.model,
        URL: shoe.image_url
      };
    });

    console.log(`Final ShoeBrands count: ${shoeBrands.size}`);
    console.log(`Total Shoes processed: ${shoesArray.length}`);

    return new Response(JSON.stringify({
      shoeBrands: Array.from(shoeBrands),
      shoes: shoesArray,
      totalProcessed: shoesArray.length,
      totalAvailable: shoesArray.length
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