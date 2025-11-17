import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateImageUrls() {
  console.log("Starting image URL migration...");

  try {
    // Get all shoes with their line and brand info
    const { data: shoes, error: fetchError } = await supabase
      .from("shoes")
      .select(`
        id,
        model,
        image_url,
        lines(
          id,
          name,
          brands(
            id,
            name
          )
        )
      `);

    if (fetchError) {
      throw fetchError;
    }

    console.log(`Found ${shoes.length} shoes to update`);

    let updated = 0;
    let skipped = 0;

    for (const shoe of shoes) {
      // Skip if already has GitHub URL
      if (shoe.image_url && shoe.image_url.includes("raw.githubusercontent.com")) {
        console.log(`✓ Already has GitHub URL: ${shoe.model}`);
        skipped++;
        continue;
      }

      // Build GitHub URL
      const brandName = shoe.lines?.brands?.name;
      const lineName = shoe.lines?.name;

      if (!brandName || !lineName) {
        console.warn(`⚠ Missing brand or line for shoe ${shoe.id}: ${shoe.model}`);
        skipped++;
        continue;
      }

      const githubUrl = `https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/main/shoes/${brandName}/${lineName}/${shoe.model}.jpg`;

      // Update the shoe
      const { error: updateError } = await supabase
        .from("shoes")
        .update({ image_url: githubUrl })
        .eq("id", shoe.id);

      if (updateError) {
        console.error(`✗ Error updating ${shoe.model}:`, updateError);
        skipped++;
      } else {
        console.log(`✓ Updated: ${shoe.model} → ${githubUrl}`);
        updated++;
      }
    }

    console.log(`\n=== Migration Complete ===`);
    console.log(`Updated: ${updated}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Total: ${shoes.length}`);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrateImageUrls();
