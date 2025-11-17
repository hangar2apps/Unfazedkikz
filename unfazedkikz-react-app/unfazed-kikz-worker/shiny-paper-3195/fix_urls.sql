UPDATE shoes 
SET image_url = REPLACE(image_url, '/shoes/d/', '/shoes/')
WHERE image_url LIKE '%/shoes/d/%';
