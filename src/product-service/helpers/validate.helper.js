const { processString } = require("../helpers/string.helper");

const validateBody = (body) => {
    let { title, description, price, image, count } = body;
    if (!(title && price)) {
      return {
        error: "Cannot POST product: title and price are required",
      };
    }
  
    title = title ? processString(title) : "";
    description = description ? processString(description) : "";
    image = image ? processString(image) : "";
  
    count = count ? Number(count) : 0;
    price = price ? Number(price) : 0;
  
    const isPriceValid = !(isNaN(price)) && (price >= 0);
    const isCountValid = !(isNaN(count)) && (count >= 0);
  
    if (!(isPriceValid && isCountValid)) {
      return {
        error:
          "Cannot POST product: price and count should be numeric and non-negative",
      };
    }
  
    return {
      product: {
        title,
        description,
        price,
        image,
        count,
      },
    };
  };

  module.exports = {
      validateBody
  }