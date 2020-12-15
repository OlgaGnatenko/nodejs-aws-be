const express = require("express");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
require("dotenv").config();
const bodyParser = require("body-parser");
const { errorHandler } = require("./middleware/error-handler.middleware");
const bffRouter = require("./bff/bff.router");

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(`/${process.env.BFF_API_URL}/`, bffRouter);

app.get("*", function (_req, res) {
  res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
});

app.use(errorHandler);

process.on("uncaughtException", (err) => {
  console.log({
    message: err.message || "Uncaught exception",
    status: err.status || StatusCodes.INTERNAL_SERVER_ERROR,
    type: "Uncaught exception",
  });
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.log({
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    type: "Unhandled rejection",
    message: JSON.stringify(reason) || "Unhandled rejection",
  });
});

module.exports = app;
