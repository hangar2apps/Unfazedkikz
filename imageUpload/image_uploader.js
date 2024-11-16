const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const path = require("path");

function extractShoeInfo(filePath) {
  const parts = filePath.split(path.sep);
  const brand = parts[parts.length - 3]; // Assumes brand is two levels up from the file
  const line = parts[parts.length - 2]; // Assumes line is the immediate parent directory

  // Extract model from the file name
  const fileName = path.basename(filePath, path.extname(filePath));
  const model = fileName.replace(/\.(jpg|jpeg|png|gif)$/i, "").trim();

  return { brand, line, model };
}

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

async function clearForm(page) {
    await page.evaluate(() => {
      document.getElementById('shoeBrand').value = '';
      document.getElementById('shoeLine').value = '';
      document.getElementById('shoeModel').value = '';
      const fileInput = document.getElementById('image');
      if (fileInput) fileInput.value = '';
    });
    console.log('cleared form');
  }

async function uploadImages(folderPath, websiteUrl) {
    console.log('Beginning upload*****');
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

//   page.on("dialog", async (dialog) => {
//     console.log("Dialog message:", dialog.message());
//     await dialog.accept();
//   });

  try {
    await page.goto(websiteUrl);

    const files = await fs.readdir(folderPath, { withFileTypes: true });
    console.log('files', files);
    const imageFiles = files
      .filter(
        (file) =>
          file.isFile() &&
          [".png", ".jpg", ".jpeg", ".gif"].includes(
            path.extname(file.name).toLowerCase()
          )
      )
      .map((file) => file.name);

    for (const file of imageFiles) {
      const filePath = path.join(folderPath, file);
      const { brand, line, model } = extractShoeInfo(filePath);

      console.log(`Processing: ${file}`);
      console.log(`Brand: ${brand}, Line: ${line}, Model: ${model}`);

      try {

        // Clear the form before starting a new upload
        await clearForm(page);
        await delay(3000);

        // Wait for file input and other fields to be present
        await page.waitForSelector("#image", { visible: true, timeout: 3000 });
        await page.waitForSelector("#shoeBrand", {
          visible: true,
          timeout: 3000,
        });
        await page.waitForSelector("#shoeLine", {
          visible: true,
          timeout: 3000,
        });
        await page.waitForSelector("#shoeModel", {
          visible: true,
          timeout: 3000,
        });

         // Fill in the shoe details
        await page.type('#shoeBrand', brand);
        await page.type('#shoeLine', line);
        await page.type('#shoeModel', model);

        // Set the file input value
        const inputElement = await page.$('input[type="file"]');
        await inputElement.uploadFile(filePath);

        // Click the upload button
        await page.click('button[type="submit"]');

        console.log(`Uploaded: ${file}`);

        await delay(3000);
      } catch (uploadError) {
        console.error(`Error uploading ${file}:`, uploadError);
        await delay(3000);
      }
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await browser.close();
  }
}

// Usage
const folderPath = "/Users/bryanrigsby/Desktop/New Balance/9060";
const websiteUrl = "https://leafy-stardust-d259d9.netlify.app/upload";

uploadImages(folderPath, websiteUrl);
