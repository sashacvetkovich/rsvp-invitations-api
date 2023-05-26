const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  createTemplateService,
  getSingleTemplateService,
  getAllTemplatesService,
  getAllTemplateCategoriesService,
  createTemplateCategoryService,
} = require("../services/templateService");

const {
  createTemplateCategoryValidator,
} = require("../validations/templateValidations");

const createTemplate = async (req, res) => {
  req.body.user = req.user.userId;

  if (Object.keys(req.body).length === 0) {
    throw new CustomError.BadRequestError(`Please provide template data`);
  }

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

  const templateCategory = await createTemplateCategoryService(req.body);

  res.status(StatusCodes.OK).json({ status: true, templateCategory });
};

module.exports = {
  createTemplate,
  getAllTemplates,
  getSingleTemplate,
  getAllTemplateCategories,
  createTemplateCategory,
};
