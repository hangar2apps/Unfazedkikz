import { Octokit } from "@octokit/rest";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);


const handler = async (req, context) => {
  // Only allow POST requests
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

    // Initialize Octokit
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });

    // GitHub repository details
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const path = `shoes/${shoeBrand}/${shoeLine}/${shoeModel}.jpg`;
    const targetBranch = 'main';
    // Remove the data URL prefix to get just the base64-encoded image data
    const base64Image = imageData.replace(/^data:image\/\w+;base64,/, "");

    try {

      // Get the current commit SHA for the target branch
      const { data: refData } = await octokit.git.getRef({
        owner,
        repo,
        ref: `heads/${targetBranch}`,
      });
      const parentSha = refData.object.sha;
      // Try to create the file
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

      if(response.status !== 201) {
        return new Response(JSON.stringify({ error: "Failed to upload image!" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }

      // Store metadata in Supabase
      const imageUrl = response.data.content.download_url;

      // Get or create brand
      let { data: brand, error: _brandError } = await supabase
        .from("brands")
        .select("id")
        .eq("name", shoeBrand)
        .single();

      if (!brand) {
        const { data: newBrand, error: createBrandError } = await supabase
          .from("brands")
          .insert([{ name: shoeBrand }])
          .select()
          .single();

        if (createBrandError) throw createBrandError;
        brand = newBrand;
      }

      // Get or create line
      let { data: line, error: _lineError } = await supabase
        .from("lines")
        .select("id")
        .eq("brand_id", brand.id)
        .eq("name", shoeLine)
        .single();

      if (!line) {
        const { data: newLine, error: createLineError } = await supabase
          .from("lines")
          .insert([{ brand_id: brand.id, name: shoeLine }])
          .select()
          .single();

        if (createLineError) throw createLineError;
        line = newLine;
      }

      // Insert shoe record
      const { error: shoeError } = await supabase
        .from("shoes")
        .insert([{
          line_id: line.id,
          model: shoeModel,
          image_url: imageUrl
        }])
        .select()
        .single();

      if (shoeError) throw shoeError;

      return new Response(JSON.stringify({
        message: "Image uploaded successfully",
        url: response.data.content.download_url,
        branch: targetBranch
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

export default handler;