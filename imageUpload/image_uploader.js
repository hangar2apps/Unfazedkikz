const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const path = require("path");

function extractShoeInfo(filePath) {
    const parts = filePath.split(path.sep);
    const brand = parts[parts.length - 3].replace(/New Balance(?:New Balance)?/, 'New Balance');
    let line = parts[parts.length - 2];
    // Specific handling for the "9060" case
    line = line === "90609060" ? "9060" : line;
    const fileName = path.basename(filePath, path.extname(filePath));
    const model = fileName.replace(/\.(jpg|jpeg|png|gif)$/i, "").trim();
  
    return { brand, line, model };
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function clearForm(page) {
    await page.evaluate(() => {
        ['shoeBrand', 'shoeLine', 'shoeModel', 'image'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.value = '';
        });
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
        // await page.waitForSelector("#image", { visible: true, timeout: 3000 });
        // await page.waitForSelector("#shoeBrand", {
        //   visible: true,
        //   timeout: 3000,
        // });
        // await page.waitForSelector("#shoeLine", {
        //   visible: true,
        //   timeout: 3000,
        // });
        // await page.waitForSelector("#shoeModel", {
        //   visible: true,
        //   timeout: 3000,
        // });

         // Fill in the shoe details
        await page.type('#shoeBrand', brand);
        await page.type('#shoeLine', line);
        await page.type('#shoeModel', model);

   

        // Set the file input value
        const inputElement = await page.$('input[type="file"]');
        await inputElement.uploadFile(filePath);



        let response = await page.waitForFunction(() => {
            const submitButton = document.querySelector('button[type="submit"]');
            return submitButton && !submitButton.disabled;
        }, { timeout: 5000 });

        let isButtonEnabled = await response.jsonValue();
        console.log('isButtonEnabled', isButtonEnabled);

        if (isButtonEnabled) {
            await page.evaluate(() => {
                const submitButton = document.querySelector('button[type="submit"]');
                if (submitButton) submitButton.click();
            });
        }
        else {
            console.log('Button is disabled');
            await browser.close();
        }


        console.log(`Uploaded: ${file}`);

        await delay(3000);
      } catch (uploadError) {
        console.error(`Error uploading ${file}:`, uploadError);
        // await browser.close();
      }
    }
  } catch (error) {
    console.error("An error occurred:", error);
    // await browser.close();
  } finally {
    // await browser.close();
  }
}

// Usage
const folderPath = "/Users/bryanrigsby/Desktop/New Balance/9060";
const websiteUrl = "https://leafy-stardust-d259d9.netlify.app/upload";

uploadImages(folderPath, websiteUrl);
