const Event = require("../models/Event");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");
const { createEventService } = require("../services/eventService.js");

const createEvent = async (req, res) => {
  const { customData, eventData } = req.body;

  if (!customData || !eventData) {
    throw new CustomError.BadRequestError("No event info provided");
  }

  const {
    eventDate,
    eventDescription,
    eventName,
    venueAddress,
    venueName,
    templateId,
  } = eventData;

  if (
    !eventDate ||
    !eventDescription ||
    !eventName ||
    !venueAddress ||
    !venueName ||
    !templateId
  ) {
    throw new CustomError.BadRequestError("No event info provided");
  }

  if (customData.length < 1) {
    throw new CustomError.BadRequestError("No custom data provided");
  }

  const customDataArray = customData.map((item) => {
    const {
      itemName,
      itemStyles,
      isEditable,
      itemValue,
      publicName,
      itemType,
    } = item;

    if (
      !itemName ||
      !itemStyles ||
      !isEditable ||
      !itemValue ||
      !publicName ||
      !itemType
    ) {
      throw new CustomError.BadRequestError("No custom data provided");
    }

    return [itemName, itemStyles, isEditable, publicName, itemValue, itemType];
  });

  const event = await createEventService({ eventData, customDataArray });

  res.status(StatusCodes.CREATED).json({ success: true, event: event });
};

const getAllEvents = async (req, res) => {
  const events = await Event.find({})
    .populate({
      path: "user",
      select: "name",
    })
    .populate({
      path: "invitation",
      select: "name mainStyles backgroundImage",
    });
  res.status(StatusCodes.OK).json({ events, count: events.length });
};

const getSingleEvent = async (req, res) => {
  const { id: eventId } = req.params;
  const event = await Event.findOne({ _id: eventId })
    .select(
      "invitation user eventName eventImage eventTitle eventDescription guestList"
    )
    .populate({
      path: "user",
      select: "name",
    })
    .populate({
      path: "invitation",
      select: "name mainStyles backgroundImage",
    });
  if (!event) {
    throw new CustomError.NotFoundError(`No event with id : ${eventId}`);
  }
  checkPermissions(req.user, event.user._id);
  res.status(StatusCodes.OK).json({ event });
};

const getCurrentUserEvents = async (req, res) => {
  const events = await Event.find({ user: req.user.userId })
    .select("invitation user eventName eventImage eventTitle eventDescription")
    .populate({
      path: "user",
      select: "name",
    })
    .populate({
      path: "invitation",
      select: "name mainStyles backgroundImage",
    });
  res.status(StatusCodes.OK).json({ events, count: events.length });
};

module.exports = {
  createEvent,
  getAllEvents,
  getSingleEvent,
  getCurrentUserEvents,
};
