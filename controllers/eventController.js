const Event = require("../models/Event");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");
const { isEmptyObject } = require("../helpers/common");
const {
  createEventService,
  getSingleEventService,
} = require("../services/eventService.js");

const createEvent = async (req, res) => {
  const { customData, eventInfo } = req.body;

  if (!customData || !eventInfo) {
    throw new CustomError.BadRequestError("No event info provided");
  }

  if (isEmptyObject(eventInfo) || customData.length < 1) {
    throw new CustomError.BadRequestError("No event info provided");
  }

  const customDataArray = customData.map((item) => {
    if (isEmptyObject(item)) {
      throw new CustomError.BadRequestError("No custom data provided");
    }

    return [
      item.itemName,
      item.itemStyles,
      item.isEditable,
      item.publicName,
      item.itemValue,
      item.itemType,
    ];
  });

  const eventData = { ...eventInfo, userId: req.user.userId };
  const event = await createEventService({ eventData, customDataArray });

  res.status(StatusCodes.CREATED).json({ success: true, event: event });
};

const getSingleEvent = async (req, res) => {
  const { id: eventId } = req.params;
  const event = await getSingleEventService(eventId);

  if (!event) {
    throw new CustomError.NotFoundError(`No event with id : ${eventId}`);
  }

  checkPermissions(req.user, event.user_id);
  res.status(StatusCodes.OK).json({ event });
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
