"use strict";
const dbHelper = require("../helpers/db.helper");
const { responseHeaders } = require("../common/config");
const { StatusCodes } = require("http-status-codes");
const extractIdFromPath = require("../helpers/id.helper");

const deleteStocksQuery = (id) => `
  DELETE FROM stocks
  WHERE product_id='${id}' RETURNING id
`;

const deleteProductQuery = (id) => `
  DELETE FROM products
  WHERE id='${id}' RETURNING id 
`;

const deleteProduct = async (event) => {
  let dbConnection = null;

  try {
    const extractedId = extractIdFromPath(event);
    if (extractedId.error) {
      return error;
    }
    const { id } = extractedId;

    dbConnection = await dbHelper.connectToDB();
    await dbConnection.query("BEGIN");
    const { rows: deletedStockRows } = await dbConnection.query(
      deleteStocksQuery(id)
    );
    const isDeletedStock = deletedStockRows && deletedStockRows.length;
    if (!isDeletedStock) {
      return {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: `Cannot DELETE product ${id}: Server error`,
      };
    }

    const { rows: deletedProductRow } = await dbConnection.query(
      deleteProductQuery(id)
    );
    const isDeletedProduct = deletedProductRow && deletedProductRow.length;
    if (!isDeletedProduct)
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: `Cannot DELETE product ${id}: No such product exists`,
      };

    const { id: deletedId } = deletedProductRow[0];
    await dbConnection.query("COMMIT");
    return {
      statusCode: StatusCodes.OK,
      headers: responseHeaders,
      body: deletedId,
    };
  } catch (err) {
    console.log(err);
    if (dbConnection) await dbConnection.query("ROLLBACK");
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
  deleteProduct,
};
