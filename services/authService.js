const bcrypt = require("bcrypt");
const { ErrorHandler } = require("../helpers/error");
const validateUser = require("../helpers/validateUser");
const {
  signAccessToken,
  signRefreshToken,
  isRefreshTokenValid,
} = require("../utils");
const {
  getUserByEmailDb,
  createUserDb,
  updateRefreshTokenDb,
  getUserByRefreshTokenDb,
} = require("../db/authDb");

const registerService = async (user) => {
  try {
    const { password, email, fullname } = user;
    if (!email || !password || !fullname) {
      throw new ErrorHandler(401, "all fields required");
    }

    if (validateUser(email, password)) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const userByEmail = await getUserByEmailDb(email);

      if (userByEmail) {
        throw new ErrorHandler(401, "email taken already");
      }

      const newUser = await createUserDb({
        ...user,
        password: hashedPassword,
      });

      return {
        user: {
          user_id: newUser.user_id,
          fullname: newUser.fullname,
          email: newUser.email,
        },
      };
    } else {
      throw new ErrorHandler(401, "Input validation error");
    }
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

const loginService = async (email, password) => {
  try {
    if (!validateUser(email, password)) {
      throw new ErrorHandler(403, "Invalid login");
    }

    const user = await getUserByEmailDb(email);
    if (!user) {
      throw new ErrorHandler(403, "Email or password incorrect.");
    }

    if (user.google_id && !user.password) {
      throw new ErrorHandler(403, "Login in with Google");
    }

    const { password: dbPassword, user_id, roles, fullname, username } = user;
    const isCorrectPassword = await bcrypt.compare(password, dbPassword);

    if (!isCorrectPassword) {
      throw new ErrorHandler(403, "Email or password incorrect.");
    }

    const accessToken = await signAccessToken({ id: user_id, roles });

    let refreshToken = user.refresh_token;

    if (!refreshToken) {
      refreshToken = await signRefreshToken({
        id: user_id,
        roles,
      });

      await updateRefreshTokenDb({ refreshToken, email });
    }

    return {
      accessToken,
      refreshToken,
      user: {
        user_id,
        fullname,
        username,
      },
    };
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

const refreshTokenService = async (refreshToken) => {
  try {
    const foundUser = await getUserByRefreshTokenDb(refreshToken);
    if (!foundUser) return res.sendStatus(403); //Forbidden

    const isTokenValid = isRefreshTokenValid(refreshToken, foundUser);
    if (isTokenValid) {
      const accessToken = await signAccessToken({
        id: foundUser.user_id,
        roles: foundUser.roles,
      });

      return accessToken;
    }

    return null;
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

module.exports = { registerService, loginService, refreshTokenService };
