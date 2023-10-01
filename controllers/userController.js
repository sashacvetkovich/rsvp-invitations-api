const { getUserService } = require("../services/userService");

const getUserController = async (req, res) => {
  const user = await getUserService(req.user.userId);
  res.status(200).json({
    status: true,
    user,
  });
};

module.exports = {
  getUserController,
};
