const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

function extractShoeInfo(filePath) {
    const parts = filePath.split(path.sep);
    const brand = parts[parts.length - 3]; // Assumes brand is two levels up from the file
    const line = parts[parts.length - 2]; // Assumes line is the immediate parent directory
    
    // Extract model from the file name
    const fileName = path.basename(filePath, path.extname(filePath));
    const model = fileName.replace(/\.(jpg|jpeg|png|gif)$/i, '').trim();
  
    return { brand, line, model };
}

function delay(time) {
    return new Promise(function(resolve) { 
      setTimeout(resolve, time)
    });
}

async function uploadImages(folderPath, websiteUrl) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  page.on('dialog', async dialog => {
    console.log('Dialog message:', dialog.message());
    await dialog.accept();
  });

  try {
    await page.goto(websiteUrl);

    const files = await fs.readdir(folderPath, { withFileTypes: true });
    const imageFiles = files
      .filter(file => file.isFile() && ['.png', '.jpg', '.jpeg', '.gif'].includes(path.extname(file.name).toLowerCase()))
      .map(file => file.name);

    for (const file of imageFiles) {
      const filePath = path.join(folderPath, file);
      const { brand, line, model } = extractShoeInfo(filePath);


    //   Brand: Asics, Line: Gel, Model: Kahana

      console.log(`Processing: ${file}`);
      console.log(`Brand: ${brand}, Line: ${line}, Model: ${model}`);

      // Wait for file input and other fields to be present
      await page.waitForSelector('#image');
      await page.waitForSelector('#shoeBrand');
      await page.waitForSelector('#shoeLine');
      await page.waitForSelector('#shoeModel');

      
      // Fill in the shoe details
      await page.type('#shoeBrand', brand);
      await page.type('#shoeLine', line);
      await page.type('#shoeModel', model);

      // Set the file input value
      const inputElement = await page.$('input[type="file"]');
      await inputElement.uploadFile(filePath);

      // Store the current values to check if they're cleared after submission
      const currentBrand = await page.$eval('#shoeBrand', el => el.value);
      const currentLine = await page.$eval('#shoeLine', el => el.value);
      const currentModel = await page.$eval('#shoeModel', el => el.value);

      // Click the upload button
      await page.click('button[type="submit"]');

    // Check for success indicators
    const successIndicators = await page.evaluate(() => {
        const brandCleared = document.querySelector('#shoeBrand').value === '';
        const lineCleared = document.querySelector('#shoeLine').value === '';
        const modelCleared = document.querySelector('#shoeModel').value === '';
        return {
            fieldsCleared: brandCleared && lineCleared && modelCleared,
        };
    });

    if (successIndicators.fieldsCleared) {
        console.log(`Uploaded successfully: ${file}`);
      } else {
        console.log(`Upload may have failed for: ${file}`);
        // You might want to implement a retry mechanism here
      }

      await delay(2000);

      console.log(`Uploaded: ${file}`);

      await delay(5000);

    }
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await browser.close();
  }
}

// Usage
const folderPath = '/Users/bryanrigsby/Desktop/New Balance/9060';
const websiteUrl = 'https://leafy-stardust-d259d9.netlify.app/upload';

uploadImages(folderPath, websiteUrl);