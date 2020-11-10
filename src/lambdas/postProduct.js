"use strict";
const dbHelper = require("../helpers/db.helper");
const { responseHeaders } = require("../common/config");
const { StatusCodes } = require("http-status-codes");
const { processString } = require("../helpers/string.helper");
const { getProductByIdQuery } = require("./getProductById");

const postProductQuery = ({ title, description = "", image = "", price }) => `
  INSERT INTO products (title, description, image, price) VALUES
  ('${title}', '${description}', '${image}', ${price}) RETURNING id 
`;

const postStockQuery = ({ product_id, count = 0 }) => `
    INSERT INTO stocks (product_id, "count") VALUES
    ('${product_id}', ${count}) RETURNING id  
`;

const validateBody = (body) => {
  let { title, description, price, image, count } = body;
  if (!(title && price)) {
    return {
      error: "Cannot POST product: title and price are required",
    };
  }

  title = title ? processString(title) : "";
  description = description ? processString(description) : "";
  image = image ? processString(image) : "";

  count = count ? Number(count) : 0;
  price = price ? Number(price) : 0;

  if (isNaN(price) || isNaN(count)) {
    return {
      error: "Cannot POST product: price and count should be numeric",
    };
  }

  return {
    product: {
      title,
      description,
      price,
      image,
      count,
    },
  };
};

module.exports.postProduct = async (event) => {
  let dbConnection = null;

  try {
    const body = event.body && JSON.parse(event.body);
    if (!body) {
      return {
        headers: responseHeaders,
        statusCode: StatusCodes.BAD_REQUEST,
        body: "Cannot POST product: Product details are not provided",
      };
    }

    const { product, error } = validateBody(body);
    if (error) {
      return {
        headers: responseHeaders,
        statusCode: StatusCodes.BAD_REQUEST,
        body: error,
      };
    }

    const dbConnection = await dbHelper.connectToDB();
    await dbConnection.query("BEGIN");
    const { rows: addedProductRow } = await dbConnection.query(
      postProductQuery(product)
    );
    if (!addedProductRow)
      return {
        headers: responseHeaders,
        statusCode: StatusCodes.NOT_FOUND,
        body: "Cannot POST product: Server error",
      };

    const { id } = addedProductRow[0];

    await dbConnection.query(
      postStockQuery({ product_id: id, count: product.count })
    );

    const { rows: productWithStockRow } = await dbConnection.query(
      getProductByIdQuery(id)
    );
    if (!productWithStockRow)
      return {
        headers: responseHeaders,
        statusCode: StatusCodes.NOT_FOUND,
        body: "Cannot POST stock: Server error",
      };
    const productWithStock = productWithStockRow[0];
    await dbConnection.query("COMMIT");

    return {
      statusCode: StatusCodes.OK,
      headers: responseHeaders,
      body: JSON.stringify(productWithStock),
    };
  } catch (err) {
    if (dbConnection) await dbConnection.query("ROLLBACK");
    console.log(err);
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      headers: responseHeaders,
      body: `Server error: ${JSON.stringify(err.message)}`,
    };
  } finally {
    if (dbConnection) dbConnection.end();
  }

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
