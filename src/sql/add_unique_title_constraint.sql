CREATE UNIQUE INDEX CONCURRENTLY products_title 
ON products (title);

ALTER TABLE products 
ADD CONSTRAINT unique_products_title
UNIQUE USING INDEX products_title;