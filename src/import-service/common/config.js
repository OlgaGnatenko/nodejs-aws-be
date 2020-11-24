module.exports = {
  bucket: "rs-nodejs-import",
  catalogFolder: "uploaded",
  region: "eu-west-1",
  responseHeaders: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  },
  parsedFolder: "parsed",
  requiredCSVFields: ["title", "price", "count"]
};
