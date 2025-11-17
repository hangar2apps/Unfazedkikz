UPDATE shoes 
SET image_url = 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/main/shoes/' || 
                SUBSTR(image_url, LENGTH('https://a48bacdb-6bf7-405c-8edc-82c8a4cfa0e2.netlify.app/.netlify/blobs/read/') + 1) || 
                '.jpg'
WHERE image_url LIKE 'https://a48bacdb%';
