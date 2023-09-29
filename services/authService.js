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
  createGoogleUserDb,
  updateGoogleUserDb,
  updateRefreshTokenDb,
  getUserByRefreshTokenDb,
} = require("../db/authDb");
const {
  getGoogleOAuthTokens,
  getGoogleUser,
} = require("../helpers/googleAuth");

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

const googleAuthService = async (code) => {
  try {
    const { id_token, access_token } = await getGoogleOAuthTokens({ code });
    const googleUser = await getGoogleUser({ id_token, access_token });
    if (!googleUser.verified_email) {
      throw new ErrorHandler(403, "Google account is not verified.");
    }
    const { email, given_name, family_name, id, picture } = googleUser;

    const userInDb = await getUserByEmailDb(email);

    if (!userInDb) {
      const userData = {
        email,
        isVerified: true,
        fullname: `${given_name} ${family_name}`,
        googleId: id,
        userImage: picture,
      };
      const newUser = await createGoogleUserDb(userData);
      const refreshToken = await signRefreshToken({
        id: newUser.user_id,
        roles: newUser.roles,
      });

      const accessToken = await signAccessToken({
        id: newUser.user_id,
        roles: newUser.roles,
      });

      await updateRefreshTokenDb({ refreshToken, email });

      return { user: newUser, refreshToken, accessToken };
    }

    // User is in DB but manually created
    if (!userInDb.google_id) {
      const user = await updateGoogleUserDb({
        email,
        googleId: id,
        isVerified: true,
        userImage: picture,
      });
      const refreshToken = await signRefreshToken({
        id: user.user_id,
        roles: user.roles,
      });

      const accessToken = await signAccessToken({
        id: user.user_id,
        roles: user.roles,
      });

      await updateRefreshTokenDb({ refreshToken, email });
      return { user, refreshToken, accessToken };
    }

    const refreshToken = await signRefreshToken({
      id: userInDb.user_id,
      roles: userInDb.roles,
    });

    const accessToken = await signAccessToken({
      id: userInDb.user_id,
      roles: userInDb.roles,
    });
    
    await updateRefreshTokenDb({ refreshToken, email });
    return { user: userInDb, refreshToken, accessToken };
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

module.exports = {
  registerService,
  loginService,
  refreshTokenService,
  googleAuthService,
};
