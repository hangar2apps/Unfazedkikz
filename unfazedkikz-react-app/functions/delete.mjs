import { createClient } from "@supabase/supabase-js";
import { getStore } from "@netlify/blobs";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { shoeToDelete } = await req.json();

    if (!shoeToDelete) {
      return new Response(JSON.stringify({ error: "Missing shoe to delete" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // shoeToDelete format: "BrandName/LineName/ModelName"
    const [brandName, lineName, modelName] = shoeToDelete.split("/");

    // Find the shoe in Supabase
    const { data: shoe, error: shoeError } = await supabase
      .from("shoes")
      .select(`
        id,
        lines(id, brand_id, brands(id, name), name)
      `)
      .eq("model", modelName)
      .single();

    if (shoeError || !shoe) {
      return new Response(JSON.stringify({ error: "Shoe not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Verify brand and line match
    if (
      shoe.lines.brands.name !== brandName ||
      shoe.lines.name !== lineName
    ) {
      return new Response(JSON.stringify({ error: "Shoe details don't match" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Delete from Netlify Blobs
    const siteID = process.env.NETLIFY_SITE_ID;
    const token = process.env.NETLIFY_ACCESS_TOKEN;

    if (!siteID || !token) {
      return new Response(
        JSON.stringify({ message: "Missing Netlify Blobs configuration" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const store = getStore({ name: "shoe-images", siteID, token });
    const blobKey = `${brandName}/${lineName}/${modelName}`;

    try {
      await store.delete(blobKey);
    } catch (blobError) {
      console.warn(`Could not delete blob ${blobKey}:`, blobError);
      // Continue even if blob deletion fails
    }

    // Delete from Supabase
    const { error: deleteError } = await supabase
      .from("shoes")
      .delete()
      .eq("id", shoe.id);

    if (deleteError) {
      throw deleteError;
    }

    return new Response(JSON.stringify({
      message: "Shoe removed successfully"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Function Error:", error);
    return new Response(JSON.stringify({ error: "Failed to delete shoe" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
