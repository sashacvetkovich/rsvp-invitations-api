const { Guest } = require("../models/Guest");
const Event = require("../models/Event");
const { checkPermissions } = require("../utils");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const addGuest = async (req, res) => {
  const { eventId } = req.params;
  const { guestName } = req.body;

  if (!guestName) {
    throw new CustomError.NotFoundError(`Please provide guest name`);
  }

  const event = await Event.findOne({ _id: eventId });

  if (!event) {
    throw new CustomError.NotFoundError(`No event with id : ${eventId}`);
  }
  checkPermissions(req.user, event.user._id);

  const newGuest = await Guest.create({
    guestName,
    event: event._id,
    user: req.user.userId,
  });

  event.guestList = [...event.guestList, newGuest];

  await event.save();
  res.status(StatusCodes.OK).json({ updatedEvent: event });
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

const getEventGuest = async (req, res) => {
  const { eventId } = req.params;

  const event = await Event.findOne({ _id: eventId }).select("guestList user");

  if (!event) {
    throw new CustomError.NotFoundError(`No event with id : ${eventId}`);
  }

  checkPermissions(req.user, event.user._id);
  res.status(StatusCodes.OK).json({ guestList: event.guestList });
};

module.exports = {
  addGuest,
  updateGuestName,
  getEventGuest,
};
