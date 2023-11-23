const { ErrorHandler } = require("../helpers/error");
const {
  createTemplateDb,
  createTemplateDataDb,
  getSingleTemplateDb,
  getAllTemplatesDb,
  getAllTemplateCategoriesDb,
  createTemplateCategoryDb,
  getSingleTemplateCategoryDb,
  getTemplateRecommendationDb,
} = require("../db/templateDb");

const createTemplateService = async (data) => {
  const {
    templateName,
    category,
    previewImage,
    previewImageSmall,
    colors,
    templateElementsData,
  } = data;

  try {
    const template = await createTemplateDb({
      templateName,
      category,
      previewImage,
      previewImageSmall,
      colors,
    });

    const templateDataWithId = templateElementsData.map((item) => {
      return [
        item.itemName,
        item.itemStyles,
        item.isEditable,
        item.exampleText,
        item.itemType,
        template.id,
      ];
    });

    const templateData = await createTemplateDataDb(templateDataWithId);

    return { template, templateData };
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

const getAllTemplatesService = async () => {
  try {
    const allTemplates = await getAllTemplatesDb();

    return allTemplates;
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

const getSingleTemplateService = async (templatePath) => {
  try {
    return await getSingleTemplateDb(templatePath);
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

const getTemplateRecommendationService = async (category) => {
  try {
    return await getTemplateRecommendationDb(category);
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

const getAllTemplateCategoriesService = async () => {
  try {
    return await getAllTemplateCategoriesDb();
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

const createTemplateCategoryService = async (data) => {
  try {
    return await createTemplateCategoryDb(data);
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

const getSingleTemplateCategoryService = async (categoryName) => {
  try {
    return await getSingleTemplateCategoryDb(categoryName);
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

module.exports = {
  createTemplateService,
  getSingleTemplateService,
  getAllTemplatesService,
  getAllTemplateCategoriesService,
  createTemplateCategoryService,
  getSingleTemplateCategoryService,
  getTemplateRecommendationService,
};
