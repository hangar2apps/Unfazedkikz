import { Octokit } from "@octokit/rest";

const WORKER_URL = 'https://shiny-paper-3195.hangar2apps.workers.dev';

const handler = async (req) => {
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

    const [brandName, lineName, modelName] = shoeToDelete.split("/");

    // Initialize Octokit
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });

    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const targetBranch = 'main';
    const imagePath = `shoes/${brandName}/${lineName}/${modelName}.jpg`;

    try {
      const { data: fileDetails } = await octokit.repos.getContent({
        owner,
        repo,
        path: imagePath,
        ref: targetBranch
      });

      await octokit.repos.deleteFile({
        owner,
        repo,
        path: imagePath,
        message: `Remove shoe image: ${shoeToDelete}`,
        sha: fileDetails.sha,
        branch: targetBranch
      });
    } catch (githubError) {
      console.warn(`Could not delete GitHub file ${imagePath}:`, githubError.message);
    }

    // Delete from D1 via Worker API
    const dbResponse = await fetch(`${WORKER_URL}/shoes`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shoeToDelete })
    });

    if (!dbResponse.ok) {
      throw new Error('Failed to delete from database');
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

export default handler;