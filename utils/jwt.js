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


const attachCookiesToResponse = ({ res, accessToken, refreshToken }) => {
  const oneDay = 1000 * 60 * 60 * 24;
  const longerExp = 1000 * 60 * 60 * 24 * 365;

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    signed: true,
    expires: new Date(Date.now() + oneDay),
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    signed: true,
    expires: new Date(Date.now() + longerExp),
  });
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  isAccessTokenValid,
  isRefreshTokenValid,
  attachCookiesToResponse
};
