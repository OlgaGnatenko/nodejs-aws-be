const { getReasonPhrase, StatusCodes } = require("http-status-codes");

class CustomError extends Error {
  constructor(error = {}) {
    super();
    this.status = error.status;
    this.message = error.message || getReasonPhrase(status);
    this.type = error.type || "Unknown server error";
  }
}

function errorHandler(err, _req, res, next) {
  if (err.type) console.error(`Type: ${err.type}`);
  console.error(
    `Error: ${err && err.status ? err.status : ""}\nMessage: ${err.message}\n`
  );

  if (err instanceof CustomError) {
    res.status(err.status).send(err.message);
    return next(err);
  }
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
  return next(err);
}

module.exports = { errorHandler, CustomError };
