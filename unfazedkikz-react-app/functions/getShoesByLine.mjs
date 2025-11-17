const WORKER_URL = 'https://shiny-paper-3195.hangar2apps.workers.dev';

export default async (req) => {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const url = new URL(req.url);
    const lineId = url.searchParams.get("lineId");

    if (!lineId) {
      return new Response(JSON.stringify({ error: "Line ID required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const response = await fetch(`${WORKER_URL}/shoes/by-line?lineId=${lineId}`);
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