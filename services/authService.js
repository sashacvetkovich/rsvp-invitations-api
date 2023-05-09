const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ErrorHandler } = require("../helpers/error");
const validateUser = require("../helpers/validateUser");
const {
  getUserByEmailDb,
  createUserDb,
  getUserByUsernameDb,
} = require("../db/auth.db");

async function signToken(data) {
  try {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "1d" });
  } catch (error) {
    console.log(error);
    throw new ErrorHandler(500, "An error occurred");
  }
}

async function signRefreshToken(data) {
  try {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "20d" });
  } catch (error) {
    logger.error(error);
    throw new ErrorHandler(500, error.message);
  }
}

const registerService = async (user) => {
  try {
    const { password, email, fullname, username } = user;
    if (!email || !password || !fullname || !username) {
      throw new ErrorHandler(401, "all fields required");
    }

    if (validateUser(email, password)) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const userByEmail = await getUserByEmailDb(email);
      const userByUsername = await getUserByUsernameDb(username);

      if (userByEmail) {
        throw new ErrorHandler(401, "email taken already");
      }

      if (userByUsername) {
        throw new ErrorHandler(401, "username taken already");
      }

      const newUser = await createUserDb({
        ...user,
        password: hashedPassword,
      });

      //   const { id: cart_id } = await createCartDb(newUser.user_id);
      const token = await signToken({
        id: newUser.user_id,
        roles: newUser.roles,
      });
      const refreshToken = await signRefreshToken({
        id: newUser.user_id,
        roles: newUser.roles,
      });

      return {
        token,
        refreshToken,
        user: {
          user_id: newUser.user_id,
          fullname: newUser.fullname,
          username: newUser.username,
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

    const {
      password: dbPassword,
      user_id,
      roles,
      cart_id,
      fullname,
      username,
    } = user;
    const isCorrectPassword = await bcrypt.compare(password, dbPassword);

    if (!isCorrectPassword) {
      throw new ErrorHandler(403, "Email or password incorrect.");
    }

    const token = await signToken({ id: user_id, roles });
    const refreshToken = await signRefreshToken({
      id: user_id,
      roles,
    });
    return {
      token,
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

module.exports = { registerService, loginService };
