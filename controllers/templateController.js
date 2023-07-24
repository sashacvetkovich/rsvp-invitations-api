const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  createTemplateService,
  getSingleTemplateService,
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
  const { id: templateId } = req.params;

  const template = await getSingleTemplateService(templateId);

  if (!template) {
    throw new CustomError.NotFoundError(
      `No invitation with id : ${templateId}`
    );
  }

  res.status(StatusCodes.OK).json({ template });
};

const getAllTemplateCategories = async (req, res) => {
  const templateCategories = await getAllTemplateCategoriesService();

  if (!templateCategories) {
    throw new CustomError.NotFoundError("Not found template categories");
  }

  res.status(StatusCodes.OK).json({ status: true, templateCategories });
};

const createTemplateCategory = async (req, res) => {
  createTemplateCategoryValidator(req.body);

  const isCategoryExists = await getSingleTemplateCategoryService(
    req.body.categoryName
  );

  if (isCategoryExists) {
    throw new CustomError.NotFoundError(
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
    throw new CustomError.NotFoundError(
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
