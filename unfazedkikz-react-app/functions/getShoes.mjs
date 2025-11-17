const WORKER_URL = 'https://shiny-paper-3195.hangar2apps.workers.dev';

const handler = async (req) => {
  console.log("in getShoes cloud function");
  
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    console.log("Fetching shoes from Cloudflare Worker...");
    
    const response = await fetch(`${WORKER_URL}/shoes`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Worker API error');
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Function Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export default handler;