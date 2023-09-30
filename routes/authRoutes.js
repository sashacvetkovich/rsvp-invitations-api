const express = require("express");
const router = express.Router();

const {
  registerController,
  loginController,
  refreshTokenController,
  googleAuthController
} = require("../controllers/authController");

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/refresh", refreshTokenController);
router.get("/google", googleAuthController);
// router.get("/logout", logout);

module.exports = router;
