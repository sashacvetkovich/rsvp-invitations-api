const {
  addGuestDb,
  addCustomGuestDb,
  getEventGuestListDb,
  getSingleGuestDb,
  updateGuestAnswerDb,
} = require("../db/guestDb");

const { getBasicEventInfoDb } = require("../db/eventDb");
const { ErrorHandler } = require("../helpers/error");
const { v4: uuid } = require("uuid");

const addGuestService = async (guestData) => {
  try {
    const guestDataWithId = { ...guestData, guestId: uuid() };
    const guest = await addGuestDb(guestDataWithId);

    return guest;
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

const addCustomGuestService = async (guestData) => {
  try {
    const guestDataWithId = { ...guestData, guestId: uuid() };
    const guest = await addCustomGuestDb(guestDataWithId);

    return guest;
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

const getEventGuestListService = async (eventId) => {
  try {
    const guestList = await getEventGuestListDb(eventId);
    const eventInfo = await getBasicEventInfoDb(eventId);

    return { guestList, eventInfo };
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

const getSingleGuestService = async (guestId) => {
  try {
    const guest = await getSingleGuestDb(guestId);

    return guest;
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

const updateGuestAnswerService = async (answerData) => {
  try {
    const user = await updateGuestAnswerDb(answerData);

    return user;
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

module.exports = {
  addGuestService,
  addCustomGuestService,
  getEventGuestListService,
  getSingleGuestService,
  updateGuestAnswerService,
};
