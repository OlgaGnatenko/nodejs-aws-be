select products.id, title, description, price, image, "count" from products 
left join stocks
on stocks.product_id = products.id;