const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  createTemplateService,
  getSingleTemplateService,
  getAllTemplatesService,
} = require("../services/templateService");

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

module.exports = {
  createTemplate,
  getAllTemplates,
  getSingleTemplate,
};
