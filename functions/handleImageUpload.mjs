import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const { imageName, description } = JSON.parse(req.body);

  try {
    const store = getStore("shoe-images");

    // Construct the jsDelivr URL for the image
    const jsDelivrUrl = `https://cdn.jsdelivr.net/gh/your-github-username/your-repo-name@main/images/${imageName}`;

    // Store metadata in Netlify Blobs
    await store.set(`SHOE_${Date.now()}`, JSON.stringify({ 
      name: imageName, 
      url: jsDelivrUrl, 
      description 
    }));

    return new Response(JSON.stringify({ 
      message: 'Image metadata stored successfully', 
      url: jsDelivrUrl 
    }),
    { status: 200 , headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to store image metadata' }),
    { status: 500 , headers: { 'Content-Type': 'application/json' } }
    )
  }
};