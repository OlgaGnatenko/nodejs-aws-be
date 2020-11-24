module.exports.logRequest = async (event, context) => {
  const {
    body,
    queryStringParameters,
    pathParameters,
    httpMethod,
    path,
  } = event;
  console.log(`Request ${httpMethod} to ${path}:`);
  console.log(
    `Request details: ${JSON.stringify({
      queryStringParameters,
      pathParameters,
      body: JSON.parse(body),
    })}`
  );
};
