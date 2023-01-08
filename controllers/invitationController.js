const Invitation = require("../models/Invitation");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createInvitation = async (req, res) => {
  req.body.user = req.user.userId;
  const invitation = await Invitation.create(req.body);
  res.status(StatusCodes.CREATED).json({ invitation });
};

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
