const express = require("express");
const router = express.Router();

const {
  registerController,
  login,
  logout,
  getUserData,
} = require("../controllers/authController");

router.post("/register", registerController);
// router.post("/login", login);
// router.get("/logout", logout);
// router.post("/getuser", getUserData);

module.exports = router;
