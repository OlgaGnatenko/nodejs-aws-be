const recipientsConfig = require("../config/recipients.config");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const axios = require("axios").default;

const extractAxiosOptions = (req) => {
  const { path, method, body, originalUrl } = req;
  const urlParts = path.split("/");
  const recipient = urlParts[1];
  const recipientUrl = recipientsConfig[recipient.toLowerCase()];
  if (!recipientUrl) {
    return {
      error: {
        status: StatusCodes.BAD_GATEWAY,
        error: "Cannot process request",
      },
    };
  }
  urlParts.splice(0, 2);
  const remainingPath = urlParts.join("/");
  const queryIndex = originalUrl.indexOf("?");
  const queryString =
    queryIndex >= 0 ? `?${originalUrl.slice(queryIndex + 1)}` : "";
  const axiosUrl = `${recipientUrl}/${remainingPath}${queryString}`;
  const axiosConfig = {
    method,
    url: axiosUrl,
  };
  const hasBody = Object.keys(body || {}).length > 0;
  if (hasBody) axiosConfig.data = body;
  return {
    axiosConfig,
  };
};

const applyBff = async (req) => {
  const extractedAxiosOptions = extractAxiosOptions(req);
  if (extractedAxiosOptions.error) {
    return extractedAxiosOptions.error;
  }
  let axiosResult = null;
  try {
    axiosResult = await axios(extractedAxiosOptions.axiosConfig);
  } catch (error) {
    const { isAxiosError } = error;
    if (isAxiosError && error.response) {
      axiosResult = error.response;
    } else {
      // handle regular non-axios error
      return {
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        data: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
      };
    }
  } finally {
    if (axiosResult) {
      const { status, data, headers } = axiosResult;
      return {
        status,
        data: data.error || data.message || data,
        headers,
      };
    }
  }
};

module.exports = {
  applyBff,
};
