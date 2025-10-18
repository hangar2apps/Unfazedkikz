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
    const lineId = url.searchParams.get("lineId");

    if (!lineId) {
      return new Response(JSON.stringify({ error: "Line ID required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Get shoes for the line
    const { data: shoes, error } = await supabase
      .from("shoes")
      .select("id, model, image_url, line_id")
      .eq("line_id", lineId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // For local development, convert URLs to local blob access
    const isDev = process.env.CONTEXT === 'dev' || !process.env.NODE_ENV?.includes('production');
    const formattedShoes = shoes?.map(shoe => ({
      ...shoe,
      image_url: isDev ? shoe.image_url?.replace(
        /https:\/\/[^.]+\.netlify\.app/,
        ''
      ) : shoe.image_url
    })) || [];

    return new Response(JSON.stringify({
      shoes: formattedShoes
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
