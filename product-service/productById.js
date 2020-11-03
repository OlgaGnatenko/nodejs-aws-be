"use strict";
const products = require("./products");

module.exports.getProductById = async (event) => {
  let id = null; 
  if (event.queryStringParameters) {
    id =  event.queryStringParameters.id;
  }
  if (!id)
    return {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      statusCode: 404,
      body: "Id is missing in the query parameters",
    };
  const product = products.find((item) => item.id === id);
  if (!product)
    return {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      statusCode: 404,
      body: `Product with ${id} is not found`,
    };
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(product),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
