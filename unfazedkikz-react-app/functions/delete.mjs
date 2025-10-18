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

    let {shoeToDelete} = await req.json();
    console.log('delete request', shoeToDelete);

    if (!shoeToDelete) {
      return new Response(JSON.stringify({ error: "Missing shoe to delete" }), {
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
    const imagePath = `shoes/${shoeToDelete}.jpg`;

    try {
      // Get the file's current details
      const { data: fileDetails } = await octokit.repos.getContent({
        owner,
        repo,
        path: imagePath,
        ref: targetBranch
      });

      // Delete the file
      const deleteResponse = await octokit.repos.deleteFile({
        owner,
        repo,
        path: imagePath,
        message: `Remove shoe image: ${shoeToDelete}`,
        sha: fileDetails.sha,
        branch: targetBranch
      });

      //delete shoe from blob
      const siteID = process.env.NETLIFY_SITE_ID;
      const token = process.env.NETLIFY_ACCESS_TOKEN;
    
      if (!siteID || !token) {
        return new Response(
            JSON.stringify({message: "Missing Netlify Blobs configuration"}), { status: 500 , headers: { 'Content-Type': 'application/json' } }
        )
      }

      const shoesStore = getStore({ name: 'shoes', siteID: siteID, token: token });
      await shoesStore.delete(shoeToDelete);

      return new Response(JSON.stringify({
        message: "Shoe removed successfully",
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
  } catch (error) {
    // Handle case where file might not exist
    if (error.status === 404) {
      return new Response(JSON.stringify({ error: "Shoe image not found" }), {
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
  } catch (error) {
    console.error("Function Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};