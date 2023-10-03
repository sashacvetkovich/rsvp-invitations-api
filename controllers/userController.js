const { getUserService } = require("../services/userService");
const { StatusCodes } = require("http-status-codes");

const getUserController = async (req, res) => {
  const user = await getUserService(req.user.userId);
  res.status(StatusCodes.OK).json({
    status: true,
    user,
  });
};

module.exports = {
  getUserController,
};
