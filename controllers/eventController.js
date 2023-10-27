const { StatusCodes } = require("http-status-codes");
const { checkPermissions } = require("../utils");
const { createEventValidator } = require("../validations/eventValidations");
const { ErrorHandler } = require("../helpers/error");

const {
  createEventService,
  getSingleEventService,
  getCurrentUserEventsService,
  enableCustomGuestsService,
} = require("../services/eventService.js");

const createEvent = async (req, res) => {
  createEventValidator(req.body);

  const { customData, eventInfo } = req.body;

  const customDataArray = customData.map((item) => {
    return [
      item.itemName,
      item.itemStyles,
      item.isEditable,
      item.itemValue,
      item.itemType,
    ];
  });

  const eventData = { ...eventInfo, userId: req.user.userId };
  const event = await createEventService({ eventData, customDataArray });

  res.status(StatusCodes.CREATED).json({ status: true, event: event });
};

const getSingleEvent = async (req, res) => {
  const { id: eventId } = req.params;
  const event = await getSingleEventService(eventId);

  if (!event) {
    throw new ErrorHandler(StatusCodes.OK, `No event with id : ${eventId}`);
  }

  checkPermissions(req.user, event.user_id);
  res.status(StatusCodes.OK).json({ status: true, event });
};

const getCurrentUserEvents = async (req, res) => {
  const events = await getCurrentUserEventsService(req.user.userId);

  res
    .status(StatusCodes.OK)
    .json({ status: true, count: events.length, events });
};

const enableCustomGuests = async (req, res) => {
  const { eventId } = req.body;

  if (!eventId) {
    throw new ErrorHandler(StatusCodes.OK, "Please provide valid evend Id");
  }
  const event = await getSingleEventService(eventId);

  if (!event) {
    throw new ErrorHandler(StatusCodes.OK`, No event with id : ${eventId}`);
  }

  checkPermissions(req.user, event.user_id);
  if (!event.custom_share_id) {
    const eventDb = await enableCustomGuestsService(eventId);
    return res
      .status(StatusCodes.OK)
      .json({ status: true, id: eventDb.custom_share_id });
  }
  res.status(StatusCodes.OK).json({ status: true, id: event.custom_share_id });
};

module.exports = {
  createEvent,
  getSingleEvent,
  getCurrentUserEvents,
  enableCustomGuests,
};
