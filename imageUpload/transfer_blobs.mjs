import { getStore } from "@netlify/blobs";

async function transferBlobs(sourceProjectId, destProjectId, sourceToken, destToken) {
 
  try {
    // List blobs in the source project
    const shoes = getStore({ name: 'shoes', siteID: sourceProjectId, token: sourceToken });
    const { blobs } = await shoes.list();
    console.log('blobs', blobs);

    // for (const blob of blobs) {
    //   // Download blob from source project
    //   const content = await sourceClient.getSiteBlob({
    //     site_id: sourceProjectId,
    //     blob_id: blob.id,
    //   })

    //   console.log('content', content);

    //   // Upload blob to destination project
    //   await destClient.createSiteBlob({
    //     site_id: destProjectId,
    //     body: content,
    //     path: blob.path,
    //   })

    //   console.log(`Transferred blob: ${blob.path}`)
    // }

    // console.log('All blobs transferred successfully')
  } catch (error) {
    console.error('Error transferring blobs:', error)
  }
}

// Usage
const sourceProjectId = '6ff9b08f-2416-4b83-a304-e709b7d6f3c0'
const destProjectId = 'a48bacdb-6bf7-405c-8edc-82c8a4cfa0e2'
const sourceToken = 'nfp_jBcdrsKGF9K1odimXpiggNyeibMZxSgaa4fe'


transferBlobs(sourceProjectId, destProjectId, sourceToken, sourceToken)