const { StatusCodes } = require("http-status-codes");
const { ErrorHandler } = require("../helpers/error");

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
    throw new ErrorHandler(
      StatusCodes.OK,
      `Please provide template category data`
    );
  }
};

const createTemplateValidator = (data) => {
  const {
    templateName,
    category,
    previewImage,
    colors,
    templateElementsData,
  } = data;

  if (
    !templateName ||
    !category ||
    !previewImage ||
    !colors ||
    // TO DO - improve templateElementsData validation
    !templateElementsData.length
  ) {
    throw new ErrorHandler(StatusCodes.OK, `Please provide template data`);
  }
};

module.exports = { createTemplateCategoryValidator, createTemplateValidator };
