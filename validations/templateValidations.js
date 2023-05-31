const CustomError = require("../errors");

const createTemplateCategoryValidator = (data) => {
  const {
    categoryName,
    categoryTitle,
    categoryShortDescription,
    categoryLongDescription,
    categoryImage,
  } = data;

  if (
    !categoryName ||
    !categoryTitle ||
    !categoryShortDescription ||
    !categoryLongDescription ||
    !categoryImage
  ) {
    throw new CustomError.BadRequestError(
      `Please provide template category data`
    );
  }
};

module.exports = { createTemplateCategoryValidator };
