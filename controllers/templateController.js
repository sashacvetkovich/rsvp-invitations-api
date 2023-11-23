const { StatusCodes } = require("http-status-codes");
const { ErrorHandler } = require("../helpers/error");
const {
  createTemplateService,
  getSingleTemplateService,
  getTemplateRecommendationService,
  getAllTemplatesService,
  getAllTemplateCategoriesService,
  createTemplateCategoryService,
  getSingleTemplateCategoryService,
} = require("../services/templateService");

const {
  createTemplateCategoryValidator,
  createTemplateValidator,
} = require("../validations/templateValidations");

const createTemplate = async (req, res) => {
  createTemplateValidator(req.body);
  req.body.user = req.user.userId;

  const template = await createTemplateService(req.body);
  res.status(StatusCodes.CREATED).json({ template });
};

const getAllTemplates = async (req, res) => {
  const templates = await getAllTemplatesService();

  res.status(StatusCodes.OK).json({ templates, count: templates.length });
};

const getSingleTemplate = async (req, res) => {
  const { id: path } = req.params;
  const { recommendation } = req.body;

  const template = await getSingleTemplateService(path, recommendation);

  if (!template) {
    throw new ErrorHandler(
      StatusCodes.OK,
      `${path} is not found.`
    );
  }

  if (recommendation) {
    const recommendation = await getTemplateRecommendationService(
      template.category
    );

    return res
      .status(StatusCodes.OK)
      .json({ status: true, template, recommendation });
  }

  res.status(StatusCodes.OK).json({ status: true, template });
};

const getAllTemplateCategories = async (req, res) => {
  const templateCategories = await getAllTemplateCategoriesService();

  if (!templateCategories) {
    throw new ErrorHandler(StatusCodes.OK, "Not found template categories");
  }

  res.status(StatusCodes.OK).json({ status: true, templateCategories });
};

const createTemplateCategory = async (req, res) => {
  createTemplateCategoryValidator(req.body);

  const isCategoryExists = await getSingleTemplateCategoryService(
    req.body.categoryName
  );

  if (isCategoryExists) {
    throw new ErrorHandler(
      StatusCodes.OK,
      `Template ${req.body.categoryName} already exists`
    );
  }

  const templateCategory = await createTemplateCategoryService(req.body);

  res.status(StatusCodes.OK).json({ status: true, templateCategory });
};

const getSingleTemplateCategory = async (req, res) => {
  const { name: categoryName } = req.params;

  const templateCategories = await getSingleTemplateCategoryService(
    categoryName
  );

  if (!templateCategories) {
    throw new ErrorHandler(
      StatusCodes.OK,
      `Not found template category ${categoryName}`
    );
  }

  res.status(StatusCodes.OK).json({ status: true, templateCategories });
};

module.exports = {
  createTemplate,
  getAllTemplates,
  getSingleTemplate,
  getAllTemplateCategories,
  createTemplateCategory,
  getSingleTemplateCategory,
};
