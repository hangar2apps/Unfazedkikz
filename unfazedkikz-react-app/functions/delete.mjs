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

    // Initialize Octokit
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });

    // GitHub repository details
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const targetBranch = 'main';
    const imagePath = `shoes/${brandName}/${lineName}/${modelName}.jpg`;

    try {
      // Get the file's current details
      const { data: fileDetails } = await octokit.repos.getContent({
        owner,
        repo,
        path: imagePath,
        ref: targetBranch
      });

      // Delete the file
      await octokit.repos.deleteFile({
        owner,
        repo,
        path: imagePath,
        message: `Remove shoe image: ${shoeToDelete}`,
        sha: fileDetails.sha,
        branch: targetBranch
      });
    } catch (githubError) {
      // Log but continue - file might not exist
      console.warn(`Could not delete GitHub file ${imagePath}:`, githubError.message);
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
