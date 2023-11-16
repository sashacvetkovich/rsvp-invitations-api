const { StatusCodes } = require("http-status-codes");
const { logger } = require("../utils/logger");

const errorHandlerMiddleware = (err, req, res, next) => {
  if (
    err.statusCode !== StatusCodes.OK &&
    err.statusCode !== StatusCodes.UNAUTHORIZED
  ) {
    logger.error(err);
  }

  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  };

  return res
    .status(customError.statusCode)
    .json({ status: false, error: customError.msg });
};

module.exports = errorHandlerMiddleware;
