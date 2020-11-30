"use strict";
const dbHelper = require("../helpers/db.helper");
const { responseHeaders } = require("../common/config");
const { StatusCodes } = require("http-status-codes");
const { getProductByIdQuery } = require("./getProductById");
const { validateBody } = require("../helpers/validate.helper");

const postProductQuery = ({ title, description = "", image = "", price }) => `
  INSERT INTO products (title, description, image, price) VALUES
  ('${title}', '${description}', '${image}', ${price}) RETURNING id 
`;

const postStockQuery = ({ product_id, count = 0 }) => `
    INSERT INTO stocks (product_id, "count") VALUES
    ('${product_id}', ${count}) RETURNING id  
`;

const addProductToDB = async (dbConnection, product) => {
  try {
    await dbConnection.query("BEGIN");
    const { rows: addedProductRow } = await dbConnection.query(
      postProductQuery(product)
    );
    if (!addedProductRow)
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: "Cannot POST product: Server error",
      };

    const { id } = addedProductRow[0];

    await dbConnection.query(
      postStockQuery({ product_id: id, count: product.count })
    );
    await dbConnection.query("COMMIT");

    const { rows: productWithStockRow } = await dbConnection.query(
      getProductByIdQuery(id)
    );
    const productWithStock = productWithStockRow[0];

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(productWithStock),
    };
  } catch (err) {
    if (dbConnection) await dbConnection.query("ROLLBACK");
    console.log(err);
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: `Server error: ${JSON.stringify(err.message)}`,
    };
  }
};

const postProduct = async (event) => {
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

    dbConnection = await dbHelper.connectToDB();
    const addProductResponse = await addProductToDB(dbConnection, product);

    return {
      ...addProductResponse,
      headers: responseHeaders,
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
};

module.exports = {
  addProductToDB,
  postProduct,
};
