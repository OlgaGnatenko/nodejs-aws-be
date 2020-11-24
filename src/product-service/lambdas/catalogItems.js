const { postBatchProducts } = require("./postBatchProducts");

const catalogBatchProcess = async (event) => {
  try {
    const products = event.Records.map(({ body }) => JSON.parse(body));
    console.log("Products to be added:", products);
    const data = await postBatchProducts(products);
    console.log(`Successfully added products: ${data}`);
    return {
      status: true,
      data,
    };
  } catch (err) {
    console.log(err);
    return {
      status: false,
      message: err,
    };
  }
};

module.exports = {
  catalogBatchProcess,
};
