const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  getUserData,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/getuser", getUserData);

module.exports = router;
