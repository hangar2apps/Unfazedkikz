import { getStore } from "@netlify/blobs";
import { Octokit } from "@octokit/rest";

export default async (req, context) => {

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {

    let shoeToDelete = await req.json();
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
        message: `Delete shoe image: ${shoeToDelete}`,
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

    console.error("GitHub API Error:", error);
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