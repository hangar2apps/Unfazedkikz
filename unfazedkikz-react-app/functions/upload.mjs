import { createClient } from "@supabase/supabase-js";
import { Octokit } from "@octokit/rest";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async (req) => {
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

    // Initialize Octokit for GitHub
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });

    // GitHub repository details
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const path = `shoes/${shoeBrand}/${shoeLine}/${shoeModel}.jpg`;
    const targetBranch = 'main';

    try {
      // Get the current commit SHA for the target branch
      const { data: refData } = await octokit.git.getRef({
        owner,
        repo,
        ref: `heads/${targetBranch}`,
      });
      const parentSha = refData.object.sha;

      // Upload to GitHub
      const response = await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message: `Upload shoe image: shoes/${shoeBrand}/${shoeLine}/${shoeModel}`,
        content: base64Image,
        encoding: "base64",
        branch: targetBranch,
        sha: parentSha
      });

      if (response.status !== 201) {
        return new Response(JSON.stringify({ error: "Failed to upload image!" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }

      // Get the image URL from GitHub
      const imageUrl = response.data.content.download_url;

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
          image_url: imageUrl
        }])
        .select("id")
        .single();

      if (shoeError) throw shoeError;

      return new Response(JSON.stringify({
        message: "Image uploaded successfully",
        url: imageUrl,
        shoeId: shoe.id
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });

    } catch (error) {
      console.error("GitHub API Error:", error);
      return new Response(JSON.stringify({ error: "Failed to upload image to GitHub" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    console.error("Function Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
