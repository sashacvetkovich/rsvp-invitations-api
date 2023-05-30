const CustomError = require("../errors");
const { isString, isObject, isBoolean } = require("../helpers/common");

const createEventValidator = (data) => {
  const { customData, eventInfo } = data;

  if (!Array.isArray(customData) || !isObject(eventInfo) || !customData.length > 1) {
    throw new CustomError.BadRequestError("Please provide valid event data1");
  }

  if (
    !isString(eventInfo.event_date) ||
    !isString(eventInfo.event_description) ||
    !isString(eventInfo.event_name) ||
    !isString(eventInfo.venue_address) ||
    !isString(eventInfo.venue_name) ||
    !Number.isInteger(eventInfo.template_id) ||
    !isBoolean(eventInfo.is_group_invite)
  ) {
    throw new CustomError.BadRequestError("Please provide valid event data2");
  }
  console.log(customData)
  customData.forEach((element) => {
    if (
      !isString(element.item_name) ||
      !isBoolean(element.is_editable) ||
      !isString(element.public_name) ||
      !isString(element.item_value) ||
      !isString(element.item_type)
    ) {
      throw new CustomError.BadRequestError("Please provide valid event data3");
    }
  });
};

module.exports = { createEventValidator };
