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

module.exports = {
  isEmptyObject,
  isString,
  isBoolean,
  isObject,
};
