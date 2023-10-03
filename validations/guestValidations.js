const CustomError = require("../errors");
const {
  isBoolean,
  isString,
  isNumber,
} = require("../helpers/common");

const updateGuestAnswerValidator = (answerData) => {
  if (!answerData) {
    throw new CustomError.BadRequestError("Please provide valid answer info");
  }

  if (
    !isString(answerData.guestComment) ||
    !isNumber(answerData.guestNumber) ||
    !isBoolean(answerData.isComming)
  ) {
    throw new CustomError.BadRequestError("Please provide valid answer info");
  }
};

module.exports = { updateGuestAnswerValidator };
