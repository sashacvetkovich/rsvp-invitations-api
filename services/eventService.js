const { createEventDb, createEventCustomDataDb } = require("../db/eventDb");
const { ErrorHandler } = require("../helpers/error");

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

module.exports = {
  createEventService,
};
