const CustomError = require("../errors");

const createTemplateCategoryValidator = (data) => {
  const {
    category_name,
    category_title,
    category_short_description,
    category_long_description,
    category_image,
  } = data;

  if (
    !category_name ||
    !category_title ||
    !category_short_description ||
    !category_long_description ||
    !category_image
  ) {
    throw new CustomError.BadRequestError(
      `Please provide template category data`
    );
  }
};

module.exports = { createTemplateCategoryValidator };
