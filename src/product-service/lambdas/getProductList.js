"use strict";

const dbHelper = require("../helpers/db.helper");
const { responseHeaders } = require("../common/config");
const { StatusCodes } = require("http-status-codes");

const getProductsQuery = `
  select products.id, products.title, products.description, products.price, products.image, stocks."count" from products 
  left join stocks
  on stocks.product_id = products.id;
`;

module.exports.getProducts = async () => {
  let dbConnection = null;
  try {
    dbConnection = await dbHelper.connectToDB();
    const productsQueryResult = await dbConnection.query(getProductsQuery);
    const products = productsQueryResult && productsQueryResult.rows;
    if (products)
      return {
        statusCode: StatusCodes.OK,
        headers: responseHeaders,
        body: JSON.stringify(products),
      };
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      headers: responseHeaders,
      body: "Error executing products query",
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
