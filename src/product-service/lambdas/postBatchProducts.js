const dbHelper = require("../helpers/db.helper");
const { addProductToDB } = require("./postProduct");
const { validateBody } = require("../helpers/validate.helper");

const postBatchProducts = async (products) => {
  let dbConnection = null;
  try {
    dbConnection = await dbHelper.connectToDB();

    const validProducts = products.filter(
      (product) => validateBody(product).product
    );

    const submittedProducts = await Promise.allSettled(
      validProducts.map(async (product) => {
        try {
          const result = await addProductToDB(dbConnection, product);
          return result;
        } catch (err) {
          console.log(`Error posting product, ${product}`);
        }
      })
    );
    return submittedProducts;
  } catch (err) {
    console.log(`Error managing product batch: ${products}`);
  } finally {
    if (dbConnection) dbConnection.end();
  }
};

module.exports = {
  postBatchProducts,
};
