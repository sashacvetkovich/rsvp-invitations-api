const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ErrorHandler } = require("../helpers/error");
const validateUser = require("../helpers/validateUser");
const { getUserByEmailDb, createUserDb, getUserByUsernameDb } = require("../db/auth.db");

async function signToken(data) {
  try {
    return jwt.sign(data, process.env.SECRET, { expiresIn: "60s" });
  } catch (error) {
    console.log(error);
    throw new ErrorHandler(500, "An error occurred");
  }
}

async function signRefreshToken(data) {
  try {
    return jwt.sign(data, process.env.REFRESH_SECRET, { expiresIn: "1h" });
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

module.exports = { registerService };
