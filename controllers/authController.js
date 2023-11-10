const {
  registerService,
  loginService,
  refreshTokenService,
  googleAuthService,
  logoutService,
  forgotPasswordService,
  resetPasswordService,
  verifyEmailService,
} = require("../services/authService");
const { attachCookiesToResponse } = require("../utils/jwt");
const { ErrorHandler } = require("../helpers/error");
const { StatusCodes } = require("http-status-codes");

const registerController = async (req, res) => {
  await registerService(req.body);

  res.status(201).json({
    status: true,
    message:
      "Your account has been created successfully. Please confirm your email to get started.",
  });
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken, user } = await loginService(
    email,
    password
  );

  attachCookiesToResponse({ res, refreshToken, accessToken });
  res.status(StatusCodes.OK).json({
    status: true,
    user: {
      email: user.email,
      fullname: user.fullname,
      roles: user.roles,
      user_image: user.user_image,
      is_verified: user.is_verified,
    },
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
      error: "Token is not valid",
    });
  }

  attachCookiesToResponse({ res, refreshToken, accessToken });
  res.status(StatusCodes.OK).json({
    accessToken,
  });
};

const googleAuthController = async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(403).send("Google code is not provided");
  }

  const data = await googleAuthService(code);

  attachCookiesToResponse({
    res,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });
  res.redirect(`${process.env.ORIGIN}/redirecting`);
};

const logoutController = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    res.status(StatusCodes.OK).json({ status: true });
  }

  await logoutService(refreshToken);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });

  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.status(StatusCodes.OK).json({ status: true });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ErrorHandler(StatusCodes.OK, "Please provide email address");
  }

  await forgotPasswordService(email);

  res.status(StatusCodes.OK).json({
    status: true,
    message: "Please check your email for reset password link",
  });
};

const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;
  if (!token || !email || !password) {
    throw new ErrorHandler(StatusCodes.OK, "Please provide all values");
  }

  await resetPasswordService({ token, email, password });

  res.status(StatusCodes.OK).json({
    status: true,
    message: "Password changed successfully",
  });
};

const verifyEmail = async (req, res) => {
  const { token, email } = req.body;
  if (!token || !email) {
    throw new ErrorHandler(StatusCodes.OK, "Please provide all values");
  }

  await verifyEmailService({ token, email });

  res.status(StatusCodes.OK).json({
    status: true,
    message: "Email is successfully verified",
  });
};

module.exports = {
  registerController,
  loginController,
  refreshTokenController,
  googleAuthController,
  logoutController,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
