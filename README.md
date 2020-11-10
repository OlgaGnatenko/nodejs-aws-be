# nodejs-aws-be

Backend for AWS Nodejs RS School.
FE part here: https://github.com/OlgaGnatenko/nodejs-aws-fe/tree/aws-task4

## What was done 
- Task 4.1: 
    - :thumbsup: Use AWS Console to create a database instance in RDS with PostgreSQL and default configuration
    - :thumbsup: Create tables `products` and `stocks`
SQL scripts are provided in `src/sql` folder 

- Task 4.2:
    - :thumbsup: Integrate GET/products lambda to return a list of products from the database (joined stocks and products tables)
    - :thumbsup: Integrate GET/products/{productId} lambda to return a product from the database

Backend endpoints:
[GET https://jh2vjbyda1.execute-api.eu-west-1.amazonaws.com/dev/products](https://jh2vjbyda1.execute-api.eu-west-1.amazonaws.com/dev/products)
[GET https://jh2vjbyda1.execute-api.eu-west-1.amazonaws.com/dev/products/{id}](https://jh2vjbyda1.execute-api.eu-west-1.amazonaws.com/dev/products/{id})

Frontend:
[https://d2joi2c0vsqdd3.cloudfront.net/](https://d2joi2c0vsqdd3.cloudfront.net/)

- Task 4.3: 
    - :thumbsup: Implement POST/products lambda and implement its logic so it will be creating a new item in a products table.

Endpoint:
(POST https://jh2vjbyda1.execute-api.eu-west-1.amazonaws.com/dev/products)[https://jh2vjbyda1.execute-api.eu-west-1.amazonaws.com/dev/products]

## Additional tasks
- :thumbsup: POST/products lambda functions returns error 400 status code if product data is invalid

- :thumbsup: All lambdas return error 500 status code on any error (DB connection, any unhandled error in code)

- :thumbsup: All lambdas do console.log for each incoming requests and their arguments

- :thumbsup: Transaction based creation of product (in case stock creation is failed then related to this stock product is not created and not ready to be used by the end user and vice versa)


