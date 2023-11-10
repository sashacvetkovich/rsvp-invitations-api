const express = require("express");
const router = express.Router();

const {
  registerController,
  loginController,
  refreshTokenController,
  googleAuthController,
  logoutController,
  forgotPassword,
  resetPassword,
  verifyEmail
} = require("../controllers/authController");

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/refresh", refreshTokenController);
router.get("/google", googleAuthController);
router.get("/logout", logoutController);
router.post('/reset-password', resetPassword);
router.post('/forgot-password', forgotPassword);
router.post('/verify-email', verifyEmail);

module.exports = router;
