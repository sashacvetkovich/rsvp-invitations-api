const Invitation = require("../models/Invitation");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { createInvitationService } = require("../services/invitationService");

const createInvitation = async (req, res) => {
  req.body.user = req.user.userId;

  if (!req.body.templateData || !req.body.templateData.length) {
    throw new CustomError.BadRequestError(`Please provide template data`);
  }

  // res.status(StatusCodes.CREATED).json({ test: "ok" });

  const invitaion = await createInvitationService(req.body)
  // const invitation = await Invitation.create(req.body);
  // res.status(StatusCodes.CREATED).json({ invitation });
};

// const createInvitation = async (req, res) => {
//   req.body.user = req.user.userId;

//   if (!req.body.templateData || !req.body.templateData.length) {
//     throw new CustomError.BadRequestError(`Please provide template data`);
//   }

//   const invitation = await Invitation.create(req.body);
//   res.status(StatusCodes.CREATED).json({ invitation });
// };

const getAllInvitations = async (req, res) => {
  const invitations = await Invitation.find({});

  res.status(StatusCodes.OK).json({ invitations, count: invitations.length });
};

const getSingleInvitation = async (req, res) => {
  const { id: invitationId } = req.params;

  const invitation = await Invitation.findOne({ _id: invitationId });

  if (!invitation) {
    throw new CustomError.NotFoundError(
      `No invitation with id : ${invitationId}`
    );
  }

  res.status(StatusCodes.OK).json({ invitation });
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
  createInvitation,
  getAllInvitations,
  getSingleInvitation,
  updateInvitation,
  deleteInvitation,
};
