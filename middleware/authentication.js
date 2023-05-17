const CustomError = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }

  try {
    const { id, roles } = isTokenValid({ token });
    req.user = { userId: id, roles };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }
};

const verifyAdmin = (req, res, next) => {
  if (!req.user.roles.includes("admin")) {
    throw new CustomError.UnauthorizedError(
      "Unauthorized to access this route"
    );
  }
  next();
};

module.exports = {
  authenticateUser,
  verifyAdmin,
};
