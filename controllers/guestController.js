const { Guest } = require("../models/Guest");
const Event = require("../models/Event");
const { checkPermissions } = require("../utils");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { getSingleEventService } = require("../services/eventService");
const { addGuestService } = require("../services/guestService");

const addGuest = async (req, res) => {
  const { eventId } = req.params;
  const { guestName, guestComment, guestNumber } = req.body;

  if (!guestName || !guestComment || !guestNumber || !eventId) {
    throw new CustomError.NotFoundError(`Please provide guest info`);
  }

  const event = await getSingleEventService(eventId);

  if (!event) {
    throw new CustomError.NotFoundError(`No event with id : ${eventId}`);
  }

  checkPermissions(req.user, event.user_id);

  const guest = await addGuestService({
    eventId,
    guestName,
    guestComment,
    guestNumber,
  });

  res
    .status(StatusCodes.OK)
    .json({ success: true, msg: `Added guest with id ${guest.guest_id}` });
};

const updateGuestName = async (req, res) => {
  const { id: guestId } = req.params;
  const { guestName } = req.body;

  if (!guestName) {
    throw new CustomError.NotFoundError(`Please provide guest name`);
  }

  const guest = await Guest.findOne({ _id: guestId });

  if (!guest) {
    throw new CustomError.NotFoundError(`No guest with id : ${guestId}`);
  }

  checkPermissions(req.user, guest.user._id);

  guest.guestName = guestName;
  await guest.save();
  res.status(StatusCodes.OK).json({ updatedGuest: guest });
};

const getEventGuestList = async (req, res) => {
  const { eventId } = req.params;

  const event = await Event.findOne({ _id: eventId }).select("guestList user");

  if (!event) {
    throw new CustomError.NotFoundError(`No event with id : ${eventId}`);
  }

  checkPermissions(req.user, event.user._id);
  res.status(StatusCodes.OK).json({ guestList: event.guestList });
};

const getSingleGuest = async (req, res) => {
  const { id: guestId } = req.params;

  const guest = await Guest.findOne({ _id: guestId }).populate({
    path: "event",
    populate: {
      path: "invitation",
    },
    select: "eventName eventImage eventTitle eventDescription user invitation",
  });

  if (!guest) {
    throw new CustomError.NotFoundError(`No guest with id : ${guestId}`);
  }

  res.status(StatusCodes.OK).json({ guest });
};

const updateGuestAnswer = async (req, res) => {
  const { answer, guestId } = req.body;

  if (typeof answer !== "boolean" || !guestId) {
    throw new CustomError.NotFoundError(`Please provide answer and guest ID`);
  }

  const guest = await Guest.findOne({ _id: guestId });

  if (!guest) {
    throw new CustomError.NotFoundError(`No guest with id : ${guestId}`);
  }

  guest.isComming = answer;
  await guest.save();

  res.status(StatusCodes.OK).json({ guest });
};

module.exports = {
  addGuest,
  updateGuestName,
  getEventGuestList,
  getSingleGuest,
  updateGuestAnswer,
};
