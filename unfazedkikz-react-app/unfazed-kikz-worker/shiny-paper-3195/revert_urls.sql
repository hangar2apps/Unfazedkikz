UPDATE shoes 
SET image_url = 'https://a48bacdb-6bf7-405c-8edc-82c8a4cfa0e2.netlify.app/.netlify/blobs/read/' || 
                REPLACE(REPLACE(image_url, 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/main/shoes/d/', ''), '.jpg', '')
WHERE image_url LIKE 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/main/shoes/d/%';
