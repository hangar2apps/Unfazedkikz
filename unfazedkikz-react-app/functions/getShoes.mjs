import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  console.log("in getShoes cloud function");
  // Only allow POST requests
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const siteID = process.env.NETLIFY_SITE_ID;
    const token = process.env.NETLIFY_ACCESS_TOKEN;
  
    if (!siteID || !token) {
      return new Response(
          JSON.stringify({message: "Missing Netlify Blobs configuration"}), { status: 500 , headers: { 'Content-Type': 'application/json' } }
      )
    }

    const shoes = getStore({ name: 'shoes', siteID: siteID, token: token });

    
    const { blobs } = await shoes.list();
    console.log('blobs', blobs);

    if(blobs.length === 0) {
      return new Response(JSON.stringify({
        shoeBrands: [],
        shoes: ''
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    // Format shoes data for frontend
    const formattedShoes = shoes.map(shoe => ({
      ID: shoe.id,
      ShoeModel: shoe.model,
      ShoeLine: shoe.lines.name,
      ShoeBrand: shoe.lines.brands.name,
      URL: shoe.image_url
    }));


    return new Response(JSON.stringify({
      shoeBrands: Array.from(shoeBrands),
      shoes: shoesArray, // this will be an object with shoeBrand as key 
      totalProcessed: shoesArray.length,
      totalAvailable: blobs.length
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