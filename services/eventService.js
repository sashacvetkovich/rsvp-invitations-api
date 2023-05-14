const {
  createEventDb,
  createEventCustomDataDb,
} = require("../services/eventService.js");

const createEventService = ({ customData, eventData }) => {
    const {} = eventData;
    const {} = customData;
    try {

      } catch (error) {
        throw new ErrorHandler(error.statusCode, error.message);
      }
};

module.exports = {
  createEventService,
};
