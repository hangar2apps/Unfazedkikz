#!/usr/bin/env node

/**
 * Migration script to move shoes from old Netlify Blobs storage to Supabase
 * Run with: node migrate.js
 *
 * This script:
 * 1. Reads all shoes from the old 'shoes' blob store
 * 2. Creates brands and lines in Supabase
 * 3. Downloads images from GitHub
 * 4. Uploads images to the new 'shoe-images' blob store
 * 5. Inserts shoe metadata into Supabase
 */

const { createClient } = require("@supabase/supabase-js");
const { getStore } = require("@netlify/blobs");
const https = require("https");
const dotenv = require("dotenv");

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

// Load environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const siteID = process.env.NETLIFY_SITE_ID;
const netlifyToken = process.env.NETLIFY_ACCESS_TOKEN;

// Validate environment variables
if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

if (!siteID || !netlifyToken) {
  console.error("❌ Missing NETLIFY_SITE_ID or NETLIFY_ACCESS_TOKEN");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const oldStore = getStore({ name: "shoes", siteID, token: netlifyToken });
const newStore = getStore({ name: "shoe-images", siteID, token: netlifyToken });

// Helper to download image from URL
async function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => resolve(Buffer.concat(chunks)));
    }).on("error", reject);
  });
}

// Main migration function
async function migrate() {
  console.log("🚀 Starting migration...\n");

  try {
    // Step 1: Get all shoes from old blob store
    console.log("📦 Reading from old blob store...");
    const { blobs } = await oldStore.list();
    console.log(`✅ Found ${blobs.length} shoes\n`);

    if (blobs.length === 0) {
      console.log("ℹ️  No shoes to migrate. Exiting.");
      process.exit(0);
    }

    // Step 2: Process each shoe
    let successCount = 0;
    let errorCount = 0;
    const brands = new Map(); // Cache brand IDs
    const lines = new Map(); // Cache line IDs

    for (let i = 0; i < blobs.length; i++) {
      const blob = blobs[i];
      console.log(`[${i + 1}/${blobs.length}] Processing: ${blob.key}`);

      try {
        // Get shoe metadata from old blob
        const shoeJson = await oldStore.get(blob.key);
        const shoe = JSON.parse(shoeJson);

        const { shoeBrand, shoeLine, shoeModel, url: imageUrl, createdAt } = shoe;

        // Get or create brand
        let brandId = brands.get(shoeBrand);
        if (!brandId) {
          const { data: existingBrand } = await supabase
            .from("brands")
            .select("id")
            .eq("name", shoeBrand)
            .single();

          if (existingBrand) {
            brandId = existingBrand.id;
          } else {
            const { data: newBrand, error: brandError } = await supabase
              .from("brands")
              .insert([{ name: shoeBrand }])
              .select("id")
              .single();

            if (brandError) throw brandError;
            brandId = newBrand.id;
          }

          brands.set(shoeBrand, brandId);
          console.log(`  ├─ Brand: ${shoeBrand} (${brandId})`);
        }

        // Get or create line
        const lineKey = `${brandId}-${shoeLine}`;
        let lineId = lines.get(lineKey);
        if (!lineId) {
          const { data: existingLine } = await supabase
            .from("lines")
            .select("id")
            .eq("brand_id", brandId)
            .eq("name", shoeLine)
            .single();

          if (existingLine) {
            lineId = existingLine.id;
          } else {
            const { data: newLine, error: lineError } = await supabase
              .from("lines")
              .insert([{ brand_id: brandId, name: shoeLine }])
              .select("id")
              .single();

            if (lineError) throw lineError;
            lineId = newLine.id;
          }

          lines.set(lineKey, lineId);
          console.log(`  ├─ Line: ${shoeLine} (${lineId})`);
        }

        // Download and upload image
        console.log(`  ├─ Downloading image...`);
        const imageBuffer = await downloadImage(imageUrl);

        const blobKey = `${shoeBrand}/${shoeLine}/${shoeModel}`;
        console.log(`  ├─ Uploading to blob store...`);
        await newStore.set(blobKey, imageBuffer, {
          metadata: { contentType: "image/jpeg" }
        });

        const blobUrl = `https://${siteID}.netlify.app/.netlify/blobs/read/${blobKey}`;

        // Insert shoe into Supabase
        console.log(`  ├─ Inserting into Supabase...`);
        const { error: shoeError } = await supabase
          .from("shoes")
          .insert([{
            line_id: lineId,
            model: shoeModel,
            image_url: blobUrl,
            created_at: createdAt
          }]);

        if (shoeError) throw shoeError;

        console.log(`  ✅ Success\n`);
        successCount++;

      } catch (error) {
        console.error(`  ❌ Error: ${error.message}\n`);
        errorCount++;
      }
    }

    // Summary
    console.log("\n📊 Migration Summary:");
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`📦 Total: ${blobs.length}`);

    if (errorCount === 0) {
      console.log("\n🎉 Migration complete!");
    } else {
      console.log(`\n⚠️  Migration completed with ${errorCount} error(s).`);
    }

  } catch (error) {
    console.error("\n❌ Fatal error:", error);
    process.exit(1);
  }
}

// Run migration
migrate();
