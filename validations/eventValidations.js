const CustomError = require("../errors");
const { isString, isObject, isBoolean } = require("../helpers/common");

const createEventValidator = (data) => {
  const { customData, eventInfo } = data;

  if (!Array.isArray(customData) || !isObject(eventInfo) || !customData.length > 1) {
    throw new CustomError.BadRequestError("Please provide valid event data1");
  }

  if (
    !isString(eventInfo.eventDate) ||
    !isString(eventInfo.eventDescription) ||
    !isString(eventInfo.eventName) ||
    !isString(eventInfo.venueAddress) ||
    !isString(eventInfo.venueName) ||
    !Number.isInteger(eventInfo.templateId) ||
    !isBoolean(eventInfo.isGroupInvite)
  ) {
    throw new CustomError.BadRequestError("Please provide valid event data2");
  }

  customData.forEach((element) => {
    if (
      !isString(element.itemName) ||
      !isBoolean(element.isEditable) ||
      !isString(element.publicName) ||
      !isString(element.itemValue) ||
      !isString(element.itemType)
    ) {
      throw new CustomError.BadRequestError("Please provide valid event data3");
    }
  });
};

module.exports = { createEventValidator };
