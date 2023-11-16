const {
  createEventDb,
  createEventCustomDataDb,
  getSingleEventDb,
  getCurrentUserEventsDb,
  enableCustomGuestsDb,
  checkEventPathDb,
} = require("../db/eventDb");
const { ErrorHandler } = require("../helpers/error");
const { v4: uuid } = require("uuid");

const createEventService = async ({ customDataArray, eventData }) => {
  try {
    const event = await createEventDb(eventData);
    const customDataWihId = await customDataArray.map((item) => [
      ...item,
      event.event_id,
    ]);
    const eventCustomData = await createEventCustomDataDb(customDataWihId);

    return { event, eventCustomData };
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
    const customShareId = uuid();
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
};
