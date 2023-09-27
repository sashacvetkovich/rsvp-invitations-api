const jwt = require("jsonwebtoken");

const isAccessTokenValid = ({ token }) =>
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

const signAccessToken = async (data) => {
  try {
    return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "60s",
    });
  } catch (error) {
    console.log(error);
    throw new ErrorHandler(500, "An error occurred");
  }
};

const signRefreshToken = async (data) => {
  try {
    return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "30d",
    });
  } catch (error) {
    console.log(error);
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

module.exports = {
  signAccessToken,
  signRefreshToken,
  isAccessTokenValid,
  isRefreshTokenValid,
};
