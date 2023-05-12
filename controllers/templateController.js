const Invitation = require("../models/Invitation");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  createTemplateService,
  getSingleTemplateService,
  getAllTemplatesService
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
  const templates = await getAllTemplatesService()

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

const updateInvitation = async (req, res) => {
  const { id: invitationId } = req.params;

  const invitation = await Invitation.findOneAndUpdate(
    { _id: invitationId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!invitation) {
    throw new CustomError.NotFoundError(
      `No invitation with id : ${invitationId}`
    );
  }

  res.status(StatusCodes.OK).json({ invitation });
};

const deleteInvitation = async (req, res) => {
  const { id: invitationId } = req.params;

  const invitation = await Invitation.findOne({ _id: invitationId });

  if (!invitation) {
    throw new CustomError.NotFoundError(
      `No invitaion with id : ${invitationId}`
    );
  }

  await invitation.remove();
  res.status(StatusCodes.OK).json({ msg: "Success! Invitation removed." });
};

module.exports = {
  createTemplate,
  getAllTemplates,
  getSingleTemplate,
  updateInvitation,
  deleteInvitation,
};
