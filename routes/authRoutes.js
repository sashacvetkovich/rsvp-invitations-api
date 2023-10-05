const express = require("express");
const router = express.Router();

const {
  registerController,
  loginController,
  refreshTokenController,
  googleAuthController,
  logoutController
} = require("../controllers/authController");

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/refresh", refreshTokenController);
router.get("/google", googleAuthController);
router.get("/logout", logoutController);

module.exports = router;
