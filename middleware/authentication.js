const { StatusCodes } = require("http-status-codes");
const { ErrorHandler } = require("../helpers/error");
const { isAccessTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    throw new ErrorHandler(StatusCodes.OK, "Authentication Invalid");
  }

  try {
    const { id, roles } = isAccessTokenValid({ token });
    req.user = { userId: id, roles };
    next();
  } catch (error) {
    throw new ErrorHandler(StatusCodes.NOT_FOUND, "Authentication Invalid");
  }
};

const verifyAdmin = (req, res, next) => {
  if (!req.user.roles.includes("admin")) {
    throw new ErrorHandler(StatusCodes.OK, "Unauthorized to access this route");
  }
  next();
};

module.exports = {
  authenticateUser,
  verifyAdmin,
};
