import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  console.log('delete request', req.json());
  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {

      //delete shoe from blob
      const siteID = process.env.NETLIFY_SITE_ID;
      const token = process.env.NETLIFY_ACCESS_TOKEN;
    
      if (!siteID || !token) {
        return new Response(
            JSON.stringify({message: "Missing Netlify Blobs configuration"}), { status: 500 , headers: { 'Content-Type': 'application/json' } }
        )
      }

      const shoesStore = getStore({ name: 'shoes', siteID: siteID, token: token });
      // await shoesStore.delete("Asics /Gel Quantum Kinetic /Pepper Light Indigo ");




      
      return new Response(JSON.stringify({
        message: "Shoe blob deleted",
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