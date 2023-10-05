const isEmptyObject = (object) => {
  return Object.values(object).some((element) => !element || element === "");
};

const isString = (obj) => {
  return Object.prototype.toString.call(obj) === "[object String]";
};

const isBoolean = (val) => "boolean" === typeof val;

const isObject = (value) => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const isNumber = (value) => {
  return typeof value === "number";
};

const isValidEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

module.exports = {
  isEmptyObject,
  isString,
  isBoolean,
  isObject,
  isNumber,
  isValidEmail
};
