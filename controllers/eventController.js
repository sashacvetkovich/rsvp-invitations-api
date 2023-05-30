const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");
const { createEventValidator } = require("../validations/eventValidations");

const {
  createEventService,
  getSingleEventService,
  getCurrentUserEventsService,
} = require("../services/eventService.js");

const createEvent = async (req, res) => {
  createEventValidator(req.body);
  
  const { customData, eventInfo } = req.body;

  const customDataArray = customData.map((item) => {
    return [
      item.item_name,
      item.item_styles,
      item.is_editable,
      item.public_name,
      item.item_value,
      item.item_type,
    ];
  });

  const eventData = { ...eventInfo, user_id: req.user.userId };
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
