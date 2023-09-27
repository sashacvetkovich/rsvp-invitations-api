const {
  registerService,
  loginService,
  refreshTokenService,
} = require("../services/authService");

const registerController = async (req, res) => {
  const { user } = await registerService(req.body);

  // if (process.env.NODE_ENV !== "test") {
  //   await mail.signupMail(user.email, user.fullname.split(" ")[0]);
  // }

  res.status(201).json({
    status: true,
    user,
  });
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken, user } = await loginService(
    email,
    password
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 60 * 1000,
  });

  res.status(200).json({
    accessToken,
    user,
  });
};

const refreshTokenController = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.sendStatus(401);
  const refreshToken = cookies.refreshToken;
  const accessToken = await refreshTokenService(refreshToken);

  if (!accessToken) {
    return res.status(403).json({
      status: false,
      error: "Token is not valid"
    });
  }
  
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 60 * 1000,
  });

  res.status(200).json({
    accessToken,
  });
};

module.exports = {
  registerController,
  loginController,
  refreshTokenController,
};
