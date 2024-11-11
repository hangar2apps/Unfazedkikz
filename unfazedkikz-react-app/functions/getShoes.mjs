import { listStores } from "@netlify/blobs";

export default async (req, context) => {
  // Only allow POST requests
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {

      //get shoes from blob
      const siteID = process.env.IMAGE_SITE_ID;
      const token = process.env.NETLIFY_ACCESS_TOKEN;
    
      if (!siteID || !token) {
        return new Response(
            JSON.stringify({message: "Missing Netlify Blobs configuration"}), { status: 500 , headers: { 'Content-Type': 'application/json' } }
        )
      }

    //   const store = getStore({
    //     name: '',
    //     siteID: siteID,
    //     token: token
    //   });
 
    const { stores } = await listStores({
      siteID: siteID,
      token: token
    });
    console.log('stores', stores);


   
  } catch (error) {
    console.error("Function Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};