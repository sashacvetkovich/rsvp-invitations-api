const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ErrorHandler } = require("../helpers/error");
const validateUser = require("../helpers/validateUser");
const {
  getUserByEmailDb,
  createUserDb,
  updateRefreshTokenDb,
  getUserByRefreshTokenDb
} = require("../db/authDb");

const signAccessToken = async (data) => {
  try {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "60s" });
  } catch (error) {
    console.log(error);
    throw new ErrorHandler(500, "An error occurred");
  }
};

const signRefreshToken = async (data) => {
  try {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    throw new ErrorHandler(500, error.message);
  }
};

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
    const refreshToken = await signRefreshToken({
      id: user_id,
      roles,
    });

    await updateRefreshTokenDb({ refreshToken, email });

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
  const foundUser = await getUserByRefreshTokenDb(refreshToken);
  if (!foundUser) return res.sendStatus(403); //Forbidden
  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.user_id !== decoded.id) return res.sendStatus(403);
    console.log('tu smo')
    
    // const roles = Object.values(foundUser.roles);
    // const accessToken = jwt.sign(
    //   {
    //     UserInfo: {
    //       username: decoded.username,
    //       roles: roles,
    //     },
    //   },
    //   process.env.ACCESS_TOKEN_SECRET,
    //   { expiresIn: "10s" }
    // );
    // res.json({ roles, accessToken });
  });
};

module.exports = { registerService, loginService, refreshTokenService};
