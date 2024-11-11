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

      //delete shoe from blob
      const siteID = process.env.NETLIFY_SITE_ID;
      const token = process.env.NETLIFY_ACCESS_TOKEN;
    
      if (!siteID || !token) {
        return new Response(
            JSON.stringify({message: "Missing Netlify Blobs configuration"}), { status: 500 , headers: { 'Content-Type': 'application/json' } }
        )
      }

      await store.delete('Gel_Kahana-TR_V4_Silver_Red');
      await store.delete('Gel_Kahana-TR_V4_Silver_White');
      await store.delete('Gel_Kahana-TR_V4_Silver_White');

      const newBalanceStore = getStore({ name: 'New_Balance', siteID: siteID, token: token });
      await newBalanceStore.delete('9060-Artic_Grey');
      await newBalanceStore.delete('9060-Beach_Glass');
      await newBalanceStore.delete('9060-Beef_and_Broccoli');
      await newBalanceStore.delete('9060-Beige_Cherry');

      
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