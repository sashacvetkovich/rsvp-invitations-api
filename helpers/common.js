const isEmptyObject = (object) => {
  return Object.values(object).some((element) => !element || element === "");
};

module.exports = {
  isEmptyObject,
};
