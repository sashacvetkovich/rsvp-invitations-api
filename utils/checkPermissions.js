const { StatusCodes } = require("http-status-codes");
const { ErrorHandler } = require("../helpers/error");

const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId) return;

  throw new ErrorHandler(StatusCodes.OK,
    "Not authorized to access this route"
  );
};

module.exports = checkPermissions;
