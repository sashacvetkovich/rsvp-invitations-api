const {
  createEventDb,
  createEventCustomDataDb,
  getSingleEventDb,
  getCurrentUserEventsDb,
  enableCustomGuestsDb,
  checkEventPathDb,
  getSingleEventByPathDb
} = require("../db/eventDb");
const crypto = require("crypto");
const { ErrorHandler } = require("../helpers/error");
const { StatusCodes } = require("http-status-codes");

const createEventService = async ({ customDataArray, eventData }) => {
  try {
    const eventPath = await checkEventPathDb(eventData.eventPath);

    if (eventPath) {
      throw new ErrorHandler(StatusCodes.OK, "Event path is not availble");
    }

    const event = await createEventDb(eventData);
    const customDataWihId = await customDataArray.map((item) => [
      ...item,
      event.event_id,
      eventData.eventPath
    ]);

    await createEventCustomDataDb(customDataWihId);

    return event;
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

const getSingleEventService = async (eventId) => {
  try {
    const event = await getSingleEventDb(eventId);

    return event;
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

const getCustomGuestEventService = async ({ eventPath, customShareId }) => {
  try {
    const event = await getSingleEventByPathDb(eventPath);

    if (event?.custom_share_id !== customShareId) return null;

    return event;
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

const getCurrentUserEventsService = async (userId) => {
  try {
    const events = await getCurrentUserEventsDb(userId);

    return events;
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

const enableCustomGuestsService = async (eventId) => {
  try {
    const customShareId = crypto.randomBytes(70).toString("hex").slice(0,4);
    const event = await enableCustomGuestsDb({ eventId, customShareId });

    return event;
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

const checkEventPathService = async (eventPath) => {
  try {
    const event = await checkEventPathDb(eventPath);

    return event;
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

module.exports = {
  createEventService,
  getSingleEventService,
  getCurrentUserEventsService,
  enableCustomGuestsService,
  checkEventPathService,
  getCustomGuestEventService
};
