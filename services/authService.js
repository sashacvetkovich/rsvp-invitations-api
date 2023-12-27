const bcrypt = require("bcrypt");
const { ErrorHandler } = require("../helpers/error");
const { StatusCodes } = require("http-status-codes");
const validateUser = require("../helpers/validateUser");
const crypto = require("crypto");
const {
  signAccessToken,
  signRefreshToken,
  isRefreshTokenValid,
  sendResetPasswordEmail,
  sendVerificationEmail,
} = require("../utils");
const {
  getUserByEmailDb,
  createUserDb,
  createGoogleUserDb,
  updateGoogleUserDb,
  updateRefreshTokenDb,
  getUserByRefreshTokenDb,
  deleteRefreshTokenDb,
  forgotPasswordDb,
  resetPasswordDb,
  verifyEmailDb,
} = require("../db/authDb");
const {
  getGoogleOAuthTokens,
  getGoogleUser,
} = require("../helpers/googleAuth");

const registerService = async (user) => {
  try {
    const { password, email, fullname } = user;
    if (!email || !password || !fullname) {
      throw new ErrorHandler(StatusCodes.OK, "all fields required");
    }

    if (validateUser(email, password)) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const userByEmail = await getUserByEmailDb(email);

      if (userByEmail) {
        throw new ErrorHandler(StatusCodes.OK, "email taken already");
      }
      const verificationToken = crypto.randomBytes(40).toString("hex");

      const newUser = await createUserDb({
        ...user,
        password: hashedPassword,
        verificationToken,
      });

      sendVerificationEmail({
        name: newUser.fullname,
        token: newUser.verification_token,
        userEmail: newUser.email,
      });
    } else {
      throw new ErrorHandler(StatusCodes.OK, "Input validation error");
    }
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

const loginService = async (email, password) => {
  try {
    if (!validateUser(email, password)) {
      throw new ErrorHandler(StatusCodes.OK, "Email or password incorrect.");
    }

    const user = await getUserByEmailDb(email);
    if (!user) {
      throw new ErrorHandler(StatusCodes.OK, "Email or password incorrect.");
    }

    if (user.google_id && !user.password) {
      throw new ErrorHandler(StatusCodes.OK, "Login in with Google");
    }

    const { password: dbPassword, user_id, roles } = user;
    const isCorrectPassword = await bcrypt.compare(password, dbPassword);

    if (!isCorrectPassword) {
      throw new ErrorHandler(StatusCodes.OK, "Email or password incorrect.");
    }

    if (!user.is_verified) {
      throw new ErrorHandler(
        StatusCodes.OK,
        "Please confirm your email to get started."
      );
    }

    const accessToken = await signAccessToken({ id: user_id, roles });

    let refreshToken = user.refresh_token;

    if (!refreshToken || !isRefreshTokenValid(refreshToken)) {
      refreshToken = await signRefreshToken({
        id: user_id,
        roles,
      });

      await updateRefreshTokenDb({ refreshToken, email });
    }

    return {
      accessToken,
      refreshToken,
      user,
    };
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

const refreshTokenService = async (refreshToken) => {
  try {
    const foundUser = await getUserByRefreshTokenDb(refreshToken);
    if (!foundUser) return null //Forbidden

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
      throw new ErrorHandler(StatusCodes.OK, "Google account is not verified.");
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

const logoutService = async (refreshToken) => {
  try {
    const foundUser = await getUserByRefreshTokenDb(refreshToken);

    if (foundUser) await deleteRefreshTokenDb(refreshToken);

    return foundUser;
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

const forgotPasswordService = async (email) => {
  try {
    const user = await getUserByEmailDb(email);

    if (user) {
      const passwordToken = crypto.randomBytes(70).toString("hex");

      await sendResetPasswordEmail({
        userEmail: user.email,
        token: passwordToken,
      });

      const tenMinutes = 1000 * 60 * 10;
      const passwordTokenExpirationDate = new Date(
        Date.now() + tenMinutes
      ).getTime();

      await forgotPasswordDb({
        passwordToken: passwordToken,
        passwordTokenExpirationDate,
        userId: user.user_id,
      });
    }
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

const resetPasswordService = async ({ token, email, password }) => {
  try {
    const user = await getUserByEmailDb(email);

    if (user) {
      const currentDate = new Date().getTime();
      if (
        user.password_token === token &&
        user.password_token_expiration > currentDate
      ) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        await resetPasswordDb({ email, password: hashedPassword });
      }

      if (
        user.password_token === token &&
        user.password_token_expiration < currentDate
      ) {
        throw new ErrorHandler(
          StatusCodes.OK,
          "The Link You Followed Has Expired"
        );
      }
    }
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

const verifyEmailService = async ({ token, email }) => {
  try {
    const user = await getUserByEmailDb(email);

    if (!user || user?.verification_token !== token) {
      throw new ErrorHandler(StatusCodes.OK, "Verification failed");
    }

    await verifyEmailDb({ email, token });
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

module.exports = {
  registerService,
  loginService,
  refreshTokenService,
  googleAuthService,
  logoutService,
  forgotPasswordService,
  resetPasswordService,
  verifyEmailService,
};
