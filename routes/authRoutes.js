const express = require("express");
const router = express.Router();

const {
  registerController,
  loginController,
  logout,
  getUserData,
} = require("../controllers/authController");

router.post("/register", registerController);
router.post("/login", loginController);
// router.get("/logout", logout);
// router.post("/getuser", getUserData);

module.exports = router;
