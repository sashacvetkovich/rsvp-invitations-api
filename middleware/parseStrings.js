const types = require("pg").types;

// parsing numbers from DB to Numer type
const parseStrings = async (req, res, next) => {
  types.setTypeParser(1700, function (val) {
    return parseFloat(val);
  });

  next();
};

module.exports = {
  parseStrings,
};
