const jwt = require("jsonwebtoken");
const { logger } = require("../utils/logger");

const isAccessTokenValid = ({ token }) =>
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

const signAccessToken = async (data) => {
  try {
    return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "60m",
    });
  } catch (error) {
    logger.error(`Sign token error: ${error}`);
    throw new ErrorHandler(500, "An error occurred");
  }
};

const signRefreshToken = async (data) => {
  try {
    return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "30d",
    });
  } catch (error) {
    logger.error(`Sign refresh token error: ${error}`);
    throw new ErrorHandler(500, error.message);
  }
};

const isRefreshTokenValid = (refreshToken, foundUser) => {
  let isValid = false;
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.user_id !== decoded.id) return;

    isValid = true;
  });

  return isValid;
};

const attachCookiesToResponse = ({ res, accessToken, refreshToken }) => {
  // TO DO - check max age value before launching
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000 * 365,
  });
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 15 * 60 * 1000,
  });
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  isAccessTokenValid,
  isRefreshTokenValid,
  attachCookiesToResponse,
};
