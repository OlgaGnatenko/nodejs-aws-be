const AWS = require("aws-sdk");
const { postBatchProducts } = require("./postBatchProducts");

const catalogBatchProcess = async (event) => {
  try {
    const products = event.Records.map(({ body }) => JSON.parse(body));
    console.log("Products to be added:", products);
    const data = await postBatchProducts(products);
    console.log(`Successfully added products: ${data}`);
    const sns = new AWS.SNS({
      region: 'eu-west-1'
    });
    await sns.publish({
      Subject: `${data.length} products were added to database`,
      Message: JSON.stringify(data),
      TopicArn: process.env.SQS_ARN
    }).promise();
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
