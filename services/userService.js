const { ErrorHandler } = require("../helpers/error");
const { getUserDb } = require("../db/userDb");

const getUserService = async (id) => {
  try {
    const user = await getUserDb(id);
    if (!user) {
      throw new ErrorHandler(404, "User not found");
    }
    return user;
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

module.exports = {
  getUserService,
};
