const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");

const { getUserController } = require("../controllers/userController");

router.route("/getuser").get(authenticateUser, getUserController);

module.exports = router;
