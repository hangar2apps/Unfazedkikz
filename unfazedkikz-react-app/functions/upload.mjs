import { Octokit } from "@octokit/rest";
import { getStore } from "@netlify/blobs";
import { v4 as uuidv4 } from 'uuid';


export default async (req, context) => {
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
    const targetBranch = 'v1';
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

      //create blob
      const siteID = process.env.NETLIFY_SITE_ID;
      const token = process.env.NETLIFY_ACCESS_TOKEN;
    
      if (!siteID || !token) {
        return new Response(
            JSON.stringify({message: "Missing Netlify Blobs configuration"}), { status: 500 , headers: { 'Content-Type': 'application/json' } }
        )
      }

      let createdDate = new Date();
      let formattedDate = createdDate.toISOString();
  
      const randomId = uuidv4();

      const store = getStore({ name: 'shoes', siteID: siteID, token: token });
      const key = `${shoeBrand}/${shoeLine}/${shoeModel}`;

      await store.set(key, JSON.stringify({
        ID: randomId,
        shoeBrand: shoeBrand,
        shoeLine: shoeLine,
        shoeModel: shoeModel,
        url: response.data.content.download_url,
        createdAt: formattedDate 
      }));

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