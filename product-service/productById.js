"use strict";
const products = require("./products");

module.exports.getProductById = async (event) => {
  try {
    let id = null; 
    if (event.pathParameters) {
      id =  event.pathParameters.id;
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
    const product = await products.find((item) => item.id === id);
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
  
  } catch(err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: `Server error: ${JSON.stringify(err.message)}`,     
    }
  }

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
