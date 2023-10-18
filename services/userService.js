const { getUserDb } = require("../db/userDb");
const { ErrorHandler } = require("../helpers/error");
const { StatusCodes } = require("http-status-codes");

const getUserService = async (id) => {
  try {
    const user = await getUserDb(id);
    if (!user) {
      throw new ErrorHandler(StatusCodes.OK, "User not found");
    }
    return user;
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

module.exports = {
  getUserService,
};
