const { addGuestDb } = require("../db/guestDb");
const { ErrorHandler } = require("../helpers/error");

const addGuestService = async (guestData) => {
  try {
    const guest = await addGuestDb(guestData);

    return guest;
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

module.exports = {
  addGuestService,
};
