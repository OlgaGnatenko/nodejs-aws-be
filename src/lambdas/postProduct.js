"use strict";
const dbHelper = require("../helpers/db.helper");
const { responseHeaders } = require("../common/config");
const { StatusCodes } = require("http-status-codes");

const postProductQuery = ({ title, description = "", image = "", price }) => `
  INSERT INTO products (title, description, image, price) VALUES
  ('${title}', '${description}', '${image}', ${price})  
`;

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

    const { title, description, price, image } = body;
    if (!(title && price)) {
      return {
        headers: responseHeaders,
        statusCode: StatusCodes.BAD_REQUEST,
        body: "Cannot POST product: Product details are not provided",
      };
    }

    const newProduct = { title, description, price, image };

    dbConnection = await dbHelper.connectToDB();
    const postProductResult = await dbConnection.query(
      postProductQuery(newProduct)
    );
    // const product = productQueryResult && productQueryResult.rows;
    if (!postProductResult)
      return {
        headers: responseHeaders,
        statusCode: StatusCodes.NOT_FOUND,
        body: "Cannot POST product: Server error",
      };
    return {
      statusCode: StatusCodes.OK,
      headers: responseHeaders,
      body: JSON.stringify(postProductResult),
    };
  } catch (err) {
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
