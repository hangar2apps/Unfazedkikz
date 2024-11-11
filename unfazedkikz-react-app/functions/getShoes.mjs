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
    const { blobObjects } = await shoes.list();
    console.log('blobObjects', blobObjects);

    if(blobObjects.length === 0) {
      return new Response(JSON.stringify({
        blobObjects: [],
        shoes: ''
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    //process blobObjects
    let shoeBrands = [];
    let shoesArray = [];
    blobObjects.forEach(async blobObj => {
      const shoeBrand = blobObj.key.split('/')[0];
      const shoeLine = blobObj.key.split('/')[1];
      const shoeModel = blobObj.key.split('/')[2];
      if(!shoeBrands.includes(shoeBrand)) {
        shoeBrands.push(shoeBrand);
      }

      const blob = await shoes.get(blobObj.key);
      console.log('blob', blob);

      // shoesArray.push({

      
    });


    console.log('shoeBrands', shoeBrands);

    return new Response(JSON.stringify({
      blobs: blobs,
      shoes: '' // this will be an object with shoeBrand as key 
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