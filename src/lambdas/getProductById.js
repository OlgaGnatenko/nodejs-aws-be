"use strict";
const dbHelper = require("../helpers/db.helper");
const { responseHeaders } = require("../common/config");
const { StatusCodes } = require("http-status-codes");
const validate = require("uuid-validate");

const UUID_VERSION = 4;

const getProductByIdQuery = (id) => `
  select products.id, products.title, products.description, products.price, products.image, stocks."count" from products 
  left join stocks
  on stocks.product_id = products.id
  where products.id = '${id}'
`;

const getProductById = async (event) => {
  let dbConnection = null;

  try {
    let id = null;
    if (event.pathParameters) {
      id = event.pathParameters.id;
    }
    if (!id)
      return {
        headers: responseHeaders,
        statusCode: StatusCodes.FORBIDDEN,
        body: "Id is missing in the query parameters",
      };
    if (!validate(id, UUID_VERSION)) {
      return {
        headers: responseHeaders,
        statusCode: StatusCodes.FORBIDDEN,
        body: `Id ${id} is not a valid UUID`,
      };
    }
    dbConnection = await dbHelper.connectToDB();
    const productQueryResult = await dbConnection.query(
      getProductByIdQuery(id)
    );
    const product = productQueryResult && productQueryResult.rows[0];
    if (!product)
      return {
        headers: responseHeaders,
        statusCode: StatusCodes.NOT_FOUND,
        body: `Product with ${id} is not found`,
      };
    return {
      statusCode: StatusCodes.OK,
      headers: responseHeaders,
      body: JSON.stringify(product),
    };
  } catch (err) {
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

module.exports = {
  getProductById,
  getProductByIdQuery,
};
