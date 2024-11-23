import { getStore } from "@netlify/blobs";

//uncomment in Upload.js to delete shoes
//update shoes to delete below (line 27)

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

      const shoesStore = getStore({ name: 'shoes', siteID: siteID, token: token });
      await shoesStore.delete("Asics /Gel Kayano 14/Silver Black Pink ");
      await shoesStore.delete("Asics /Gel Quantum Kinetic/Pepper Light Indigo ");
      await shoesStore.delete("Asics /Metarise 2/Paris");
      await shoesStore.delete("Asics /Nimbus 26 /Grey ");
      await shoesStore.delete("Asics /Nimbus 26/Blue");
      await shoesStore.delete("Asics /Tiger Gel-Kahana /Blue Yellow ");




      
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