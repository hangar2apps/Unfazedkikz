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

    //process blobs
    const shoeBrands = new Set();

    let shoesArray = [];
    const batchSize = 50; // Process 50 images at a time

    for (let i = 0; i < blobs.length; i += batchSize) {
      const batch = blobs.slice(i, i + batchSize);
      
      // Process images in parallel
      const batchResults = await Promise.allSettled(batch.map(async (blob) => {
        try {
          const [shoeBrand, shoeLine, shoeModel] = blob.key.split('/');
          shoeBrands.add(shoeBrand);

          const shoeObj = await shoes.get(blob.key);
          const parsedShoeObj = JSON.parse(shoeObj);

          return {
            ID: parsedShoeObj.ID,
            ShoeBrand: parsedShoeObj.shoeBrand,
            ShoeLine: parsedShoeObj.shoeLine,
            ShoeModel: parsedShoeObj.shoeModel,
            URL: parsedShoeObj.url
          };
        } catch (error) {
          console.error(`Error processing shoe ${blob.key}:`, error);
          return null;
        }
      }));

      // Collect valid results
      shoesArray = shoesArray.concat(batchResults
        .filter(result => result.status === "fulfilled" && result.value)
        .map(result => result.value));

        console.log(`Processed ${i + batchSize} images...`);

      // Return early if we've processed enough to prevent timeout
      if (shoesArray.length >= 1000) break;
    }


    console.log("ShoeBrands:", Array.from(shoeBrands));
    console.log("Shoes processed:", shoesArray.length);

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