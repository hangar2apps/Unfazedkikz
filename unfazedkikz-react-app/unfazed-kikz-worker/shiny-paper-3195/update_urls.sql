UPDATE shoes 
SET image_url = 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/main/shoes/' || 
                SUBSTR(image_url, 76) || '.jpg'
WHERE image_url LIKE 'https://a48bacdb%';
