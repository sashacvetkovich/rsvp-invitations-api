const { registerService, loginService } = require("../services/authService");

const registerController = async (req, res) => {
  const { token, refreshToken, user } = await registerService(req.body);

  // if (process.env.NODE_ENV !== "test") {
  //   await mail.signupMail(user.email, user.fullname.split(" ")[0]);
  // }

  res.header("auth-token", token);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "development" ? true : "none",
    secure: process.env.NODE_ENV === "development" ? false : true,
  });
  res.status(201).json({
    token,
    user,
  });
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  const { token, refreshToken, user } = await loginService(
    email,
    password
  );

  res.header("auth-token", token);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "development" ? true : "none",
    secure: process.env.NODE_ENV === "development" ? false : true,
  });
  res.status(200).json({
    token,
    user,
  });
};

module.exports = {
  registerController,
  loginController,
};
