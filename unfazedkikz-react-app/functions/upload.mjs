import { createClient } from "@supabase/supabase-js";
import { getStore } from "@netlify/blobs";
import sharp from "sharp";

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
    const { shoeBrand, shoeLine, shoeModel, imageData } = await req.json();

    // Validate input
    if (!shoeBrand || !shoeLine || !shoeModel || !imageData) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Convert base64 to buffer
    const base64Image = imageData.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Image, "base64");

    // For now, skip Sharp optimization and upload raw image
    // TODO: Re-enable Sharp optimization once issues are resolved
    const finalBuffer = imageBuffer;

    // Upload to Netlify Blobs
    const siteID = process.env.NETLIFY_SITE_ID;
    const token = process.env.NETLIFY_ACCESS_TOKEN;

    if (!siteID || !token) {
      return new Response(
        JSON.stringify({ message: "Missing Netlify Blobs configuration" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const store = getStore({ name: "shoe-images", siteID, token });
    const blobKey = `${shoeBrand}/${shoeLine}/${shoeModel}`;

    // Upload image to blob storage
    await store.set(blobKey, finalBuffer);

    // Get the blob URL
    const blobUrl = `https://${siteID}.netlify.app/.netlify/blobs/read/${blobKey}`;

    // Get or create brand in Supabase
    const { data: brandData, error: brandError } = await supabase
      .from("brands")
      .select("id")
      .eq("name", shoeBrand)
      .single();

    let brandId;
    if (brandError && brandError.code !== "PGRST116") {
      throw brandError;
    }

    if (!brandData) {
      // Create new brand
      const { data: newBrand, error: createBrandError } = await supabase
        .from("brands")
        .insert([{ name: shoeBrand }])
        .select("id")
        .single();

      if (createBrandError) throw createBrandError;
      brandId = newBrand.id;
    } else {
      brandId = brandData.id;
    }

    // Get or create line in Supabase
    const { data: lineData, error: lineError } = await supabase
      .from("lines")
      .select("id")
      .eq("brand_id", brandId)
      .eq("name", shoeLine)
      .single();

    let lineId;
    if (lineError && lineError.code !== "PGRST116") {
      throw lineError;
    }

    if (!lineData) {
      // Create new line
      const { data: newLine, error: createLineError } = await supabase
        .from("lines")
        .insert([{ brand_id: brandId, name: shoeLine }])
        .select("id")
        .single();

      if (createLineError) throw createLineError;
      lineId = newLine.id;
    } else {
      lineId = lineData.id;
    }

    // Insert shoe into Supabase
    const { data: shoe, error: shoeError } = await supabase
      .from("shoes")
      .insert([{
        line_id: lineId,
        model: shoeModel,
        image_url: blobUrl
      }])
      .select("id")
      .single();

    if (shoeError) throw shoeError;

    return new Response(JSON.stringify({
      message: "Image uploaded successfully",
      url: blobUrl,
      shoeId: shoe.id
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Function Error:", error);
    return new Response(JSON.stringify({ error: "Failed to upload shoe" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
