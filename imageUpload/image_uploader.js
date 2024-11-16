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

async function uploadImages(folderPath, websiteUrl) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

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

      // Set the file input value
      const inputElement = await page.$('input[type="file"]');
      await inputElement.uploadFile(filePath);
      // Fill in the shoe details
      await page.type('#shoeBrand', brand);
      await page.type('#shoeLine', line);
      await page.type('#shoeModel', model);

      // Click the upload button
      await page.click('button[type="submit"]');

      // Wait for upload to complete (adjust the selector based on your UI)
      await page.waitForSelector('.upload-success', { timeout: 60000 });

      console.log(`Uploaded: ${file}`);

      // Add a small delay between uploads
      await page.waitForTimeout(2000);

      // Refresh the page to prepare for the next upload
    //   await page.reload();
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