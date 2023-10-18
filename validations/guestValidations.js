const { StatusCodes } = require("http-status-codes");
const {
  isBoolean,
  isString,
  isNumber,
  isValidEmail,
} = require("../helpers/common");
const { ErrorHandler } = require("../helpers/error");

const updateGuestAnswerValidator = (answerData) => {
  if (!answerData) {
    throw new ErrorHandler(StatusCodes.OK, "Please provide valid answer info");
  }

  if (
    !isString(answerData.guestComment) ||
    !isNumber(answerData.guestNumber) ||
    !isBoolean(answerData.isComing)
  ) {
    throw new ErrorHandler(StatusCodes.OK, "Please provide valid answer info");
  }
};

const addCustomGuestValidator = (guestData) => {
  const {
    guestName,
    guestNumber,
    guestComment,
    guestEmail,
    eventId,
    customShareId,
  } = guestData;

  if (
    !isString(guestName) ||
    !isNumber(guestNumber) ||
    !eventId ||
    !customShareId
  ) {
    throw new ErrorHandler(StatusCodes.OK, "Please provide valid guest info");
  }

  if (guestComment && !isString(guestComment)) {
    throw new ErrorHandler(StatusCodes.OK, "Please provide valid guest info");
  }

  if (guestEmail && !isValidEmail(guestEmail)) {
    throw new ErrorHandler(StatusCodes.OK, "Please provide valid guest info");
  }
};

module.exports = { updateGuestAnswerValidator, addCustomGuestValidator };
