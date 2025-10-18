import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async (req) => {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const url = new URL(req.url);
    const brandName = url.searchParams.get("brand");

    if (!brandName) {
      return new Response(JSON.stringify({ error: "Brand name required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Get brand and its lines
    const { data: lines, error } = await supabase
      .from("lines")
      .select("id, name, brand_id, brands(name)")
      .eq("brands.name", brandName)
      .order("name");

    if (error) throw error;

    return new Response(JSON.stringify({
      lines: lines || []
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
