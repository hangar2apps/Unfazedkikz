const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const path = require("path");

function extractShoeInfo(filePath) {
    const parts = filePath.split(path.sep);
    const brand = parts[parts.length - 3];
    let line = parts[parts.length - 2];
    const fileName = path.basename(filePath, path.extname(filePath));
    const model = fileName.replace(/\.(jpg|jpeg|png|gif)$/i, "").trim();
  
    return { brand, line, model };
}

async function resetBrowser(url) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    return {browser, page};
}



async function uploadImages(folderPath, websiteUrl) {
  console.log('Beginning upload*****');
  let browser, page;

  try {
    ({ browser, page } = await resetBrowser(websiteUrl));

    const files = await fs.readdir(folderPath, { withFileTypes: true });
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

        //Wait for file input and other fields to be present
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
        await page.waitForSelector('button[type="submit"]', { visible: true, timeout: 5000 });


         // Fill in the shoe details
        await page.type('#shoeBrand', brand);
        await page.type('#shoeLine', line);
        await page.type('#shoeModel', model);

        // Set the file input value
        const inputElement = await page.$('input[type="file"]');
        await inputElement.uploadFile(filePath);
        
        // Wait for the submit button to be enabled
        await page.waitForFunction(() => {
            const submitButton = document.querySelector('button[type="submit"]');
            return submitButton && !submitButton.disabled;
        }, { timeout: 5000 });
  
        // Click the submit button
        await page.click('button[type="submit"]');

        let isUploadSuccess = await page.waitForSelector('.upload-success', { visible: true, timeout: 300000 });

        console.log('isUploadSuccess', isUploadSuccess);

        new Promise(resolve => setTimeout(resolve, 10000));


        console.log(`Uploaded: ${file}`);

        await browser.close();
        ({ browser, page } = await resetBrowser(websiteUrl));
      } catch (uploadError) {
        console.error(`Error uploading ${file}:`, uploadError);
        await browser.close();
        ({ browser, page } = await resetBrowser(websiteUrl));
      }
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await browser.close();
  }
}

// Usage
const folderPath = "/Users/bryanrigsby/Desktop/New Balance/990";
const websiteUrl = "https://leafy-stardust-d259d9.netlify.app/upload";

uploadImages(folderPath, websiteUrl);
