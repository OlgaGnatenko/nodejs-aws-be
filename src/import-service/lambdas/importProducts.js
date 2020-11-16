"use strict";
const AWS = require("aws-sdk");
const config = require("../common/config");
const { StatusCodes } = require("http-status-codes");
const csvParser = require("csv-parser");

const importProductsFile = async (event) => {
  const fileName =
    event.queryStringParameters && event.queryStringParameters.name;
  const { catalogFolder, region, bucket, responseHeaders } = config;

  if (!fileName) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      headers: responseHeaders,
      body: "CSV file is not provided",
    };
  }
  const awsFilePath = `${catalogFolder}/${fileName}`;

  const s3 = new AWS.S3({ region });
  const params = {
    Bucket: bucket,
    Key: awsFilePath,
    Expires: 60,
    ContentType: "text/csv",
  };

  try {
    const url = await s3.getSignedUrl("putObject", params);
    return {
      statusCode: StatusCodes.OK,
      headers: responseHeaders,
      body: url,
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      headers: responseHeaders,
      body: `Server error: ${JSON.stringify(err.message)}`,
    };
  }
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

const importFileParser = (event) => {
  const {
    region,
    bucket,
    responseHeaders,
    parsedFolder,
    catalogFolder,
  } = config;
  const s3 = new AWS.S3({ region });

  const { Records: records } = event;
  if (!(records && records.length)) {
    return {
      statusCode: StatusCodes.NOT_FOUND,
      headers: responseHeaders,
      body: "There are no csv files to process",
    };
  }

  const copyFileInAWS = (key) => {
    return s3.copyObject({
      Bucket: bucket,
      CopySource: `${bucket}/key`,
      Key: key.replace(catalogFolder, parsedFolder),
    }).promise();
  };

  const deleteFileInAWS = (key) => {
    return s3.deleteObject({
      Bucket: bucket,
      Key: key,
    }).promise();
  };

  records.forEach((record) => {
    const { key } = record.s3.object;
    const s3Stream = s3
      .getObject({
        Bucket: bucket,
        Key: key,
      })
      .createReadStream();

    s3Stream
      .pipe(csvParser())
      .on("data", (data) => {
        console.log(data);
      })
      .on("error", (err) => {
        console.error(err);
      })
      .on("end", async () => {
        try {
          await copyFileInAWS(key);
          await deleteFileInAWS(key);
          console.log(
            `Moved file in ${bucket} from ${key} to ${key.replace(
              catalogFolder,
              parsedFolder
            )}`
          );
        } catch (err) {
          console.log(err);
        }
      });
  });
};

module.exports = {
  importProductsFile,
  importFileParser,
};
