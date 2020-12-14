const validate = require("uuid-validate");
const UUID_VERSION = 4;
const { responseHeaders } = require("../common/config");
const { StatusCodes } = require("http-status-codes");

const extractIdFromPath = (event) => {
  let id = null;
  if (event.pathParameters) {
    id = event.pathParameters.id;
  }
  // no id in request
  if (!id)
    return {
      error: {
        headers: responseHeaders,
        statusCode: StatusCodes.FORBIDDEN,
        body: "Id is missing in the query parameters",
      },
    };
  // incorrect id
  if (!validate(id, UUID_VERSION)) {
    return {
      error: {
        headers: responseHeaders,
        statusCode: StatusCodes.FORBIDDEN,
        body: `Id ${id} is not a valid UUID`,
      },
    };
  }
  return {
    id,
  };
};

module.exports = extractIdFromPath;
