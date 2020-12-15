const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const router = require("express").Router();
const { applyBff } = require("./bff.service");

router.all("/*", async (req, res) => {
  try {
    const { status, error, data } = await applyBff(req);
    if (error) {
      return res.status(status).send(JSON.stringify(error));
    }
    res.status(status).send(JSON.stringify(data));
  } catch (err) {
    const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = err.message || ReasonPhrases.INTERNAL_SERVER_ERROR;
    res.status(status).send(message);
  }
});

module.exports = router;
