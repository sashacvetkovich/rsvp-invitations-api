const { addGuestDb, getEventGuestListDb } = require("../db/guestDb");
const { ErrorHandler } = require("../helpers/error");

const addGuestService = async (guestData) => {
  try {
    const guest = await addGuestDb(guestData);

    return guest;
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

const getEventGuestListService = async (eventId) => {
  try {
    const guestList = await getEventGuestListDb(eventId);

    return guestList;
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

module.exports = {
  addGuestService,
  getEventGuestListService
};
