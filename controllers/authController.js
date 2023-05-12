const { registerService, loginService } = require("../services/authService");

const registerController = async (req, res) => {
  const { token, refreshToken, user } = await registerService(req.body);

  // if (process.env.NODE_ENV !== "test") {
  //   await mail.signupMail(user.email, user.fullname.split(" ")[0]);
  // }

  res.header("auth-token", token);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "development" ? true : "none",
    secure: process.env.NODE_ENV === "development" ? false : true,
  });
  res.status(201).json({
    token,
    user,
  });
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  const { token, refreshToken, user } = await loginService(
    email,
    password
  );

  res.header("auth-token", token);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "development" ? true : "none",
    secure: process.env.NODE_ENV === "development" ? false : true,
  });
  res.status(200).json({
    token,
    user,
  });
};

module.exports = {
  registerController,
  loginController,
};

// const User = require("../models/User");
// const { StatusCodes } = require("http-status-codes");
// const CustomError = require("../errors");
// const {
//   createTokenUser,
//   createJWT,
//   attachCookiesToResponse,
//   isTokenValid,
// } = require("../utils");

// const register = async (req, res) => {
//   // const { email, name, password } = req.body;

//   // const emailAlreadyExists = await User.findOne({ email });
//   // if (emailAlreadyExists) {
//   //   throw new CustomError.BadRequestError("Email already exists");
//   // }

//   // // first registered user is an admin
//   // const isFirstAccount = (await User.countDocuments({})) === 0;
//   // const role = isFirstAccount ? "admin" : "user";

//   // const user = await User.create({ name, email, password, role });
//   // const tokenUser = createTokenUser(user);
//   // const jwt = createJWT({ payload: tokenUser });
//   // attachCookiesToResponse({ res, user: tokenUser });

//   // res.status(StatusCodes.CREATED).json({ user: tokenUser, token: jwt });
// };

// const login = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     throw new CustomError.BadRequestError("Please provide email and password");
//   }
//   const user = await User.findOne({ email });

//   if (!user) {
//     throw new CustomError.UnauthenticatedError("Invalid Credentials");
//   }
//   const isPasswordCorrect = await user.comparePassword(password);
//   if (!isPasswordCorrect) {
//     throw new CustomError.UnauthenticatedError("Invalid Credentials");
//   }
//   const tokenUser = createTokenUser(user);
//   const jwt = createJWT({ payload: tokenUser });

//   attachCookiesToResponse({ res, user: tokenUser });

//   res.status(StatusCodes.OK).json({ user: tokenUser, token: jwt });
// };

// const getUserData = async (req, res) => {
//   const { token } = req.body;

//   if (!token) {
//     throw new CustomError.UnauthenticatedError("Please provide valid token");
//   }

//   try {
//     const { name, userId, role } = isTokenValid({ token });
//     res.status(StatusCodes.OK).json({ user: { name, userId, role } });
//   } catch (error) {
//     throw new CustomError.UnauthenticatedError("Please provide valid token");
//   }
// };

// const logout = async (req, res) => {
//   res.cookie("token", "logout", {
//     httpOnly: true,
//     expires: new Date(Date.now() + 1000),
//   });
//   res.status(StatusCodes.OK).json({ msg: "user logged out!" });
// };

// module.exports = {
//   register,
//   login,
//   logout,
//   getUserData,
// };
