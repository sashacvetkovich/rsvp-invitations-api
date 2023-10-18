const { StatusCodes } = require("http-status-codes");
const { isString, isObject, isBoolean } = require("../helpers/common");
const { ErrorHandler } = require("../helpers/error");

const createEventValidator = (data) => {
  const { customData, eventInfo } = data;

  if (
    !Array.isArray(customData) ||
    !isObject(eventInfo) ||
    !customData.length > 1
  ) {
    throw new ErrorHandler(StatusCodes.OK, "Please provide valid event data1");
  }

  if (
    !isString(eventInfo.eventDate) ||
    !isString(eventInfo.eventDescription) ||
    !isString(eventInfo.eventName) ||
    !isString(eventInfo.venueAddress) ||
    !isString(eventInfo.venueName) ||
    !Number.isInteger(eventInfo.templateId)
  ) {
    throw new ErrorHandler(StatusCodes.OK, "Please provide valid event data2");
  }

  customData.forEach((element) => {
    if (
      !isString(element.itemName) ||
      !isBoolean(element.isEditable) ||
      !isString(element.itemValue) ||
      !isString(element.itemType)
    ) {
      throw new ErrorHandler(
        StatusCodes.OK,
        "Please provide valid event data3"
      );
    }
  });
};

module.exports = { createEventValidator };
