import { Octokit } from "@octokit/rest";

const WORKER_URL = 'https://shiny-paper-3195.hangar2apps.workers.dev';

const handler = async (req, context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { shoeBrand, shoeLine, shoeModel, imageData } = await req.json();

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

    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const path = `shoes/${shoeBrand}/${shoeLine}/${shoeModel}.jpg`;
    const targetBranch = 'main';
    const base64Image = imageData.replace(/^data:image\/\w+;base64,/, "");

    try {
      const { data: refData } = await octokit.git.getRef({
        owner,
        repo,
        ref: `heads/${targetBranch}`,
      });
      const parentSha = refData.object.sha;

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

      const imageUrl = response.data.content.download_url;

      // Store metadata in D1 via Worker API
      const dbResponse = await fetch(`${WORKER_URL}/shoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shoeBrand,
          shoeLine,
          shoeModel,
          imageUrl
        })
      });

      if (!dbResponse.ok) {
        throw new Error('Failed to save to database');
      }

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