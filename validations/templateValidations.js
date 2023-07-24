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

const createTemplateValidator = (data) => {
  const {
    templateName,
    category,
    previewImage,
    previewImageSmall,
    colors,
    templateElementsData,
  } = data;

  if (
    !templateName ||
    !category ||
    !previewImage ||
    !previewImageSmall ||
    !colors ||
    // TO DO - improve templateElementsData validation
    !templateElementsData.length
  ) {
    throw new CustomError.BadRequestError(`Please provide template data`);
  }
};

module.exports = { createTemplateCategoryValidator, createTemplateValidator };
