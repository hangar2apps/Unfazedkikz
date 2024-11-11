import { getStore } from "@netlify/blobs";


export default async (req, context) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const { passedStore, shoeToDelete } = await req.json();

      //delete shoe from blob
      const siteID = process.env.NETLIFY_SITE_ID;
      const token = process.env.NETLIFY_ACCESS_TOKEN;
    
      if (!siteID || !token) {
        return new Response(
            JSON.stringify({message: "Missing Netlify Blobs configuration"}), { status: 500 , headers: { 'Content-Type': 'application/json' } }
        )
      }

      const store = getStore({ name: passedStore, siteID: siteID, token: token });
      const key = `${shoeToDelete}`;

      await store.delete(key);

      return new Response(JSON.stringify({
        message: "Shoe bloob deleted",
      }), {
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