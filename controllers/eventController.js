const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");
const { isEmptyObject } = require("../helpers/common");

const {
  createEventService,
  getSingleEventService,
  getCurrentUserEventsService,
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
  res.status(StatusCodes.OK).json({ success: true, event });
};

const getCurrentUserEvents = async (req, res) => {
  const events = await getCurrentUserEventsService(req.user.userId);

  res
    .status(StatusCodes.OK)
    .json({ status: true, count: events.length, events });
};

module.exports = {
  createEvent,
  getSingleEvent,
  getCurrentUserEvents,
};
