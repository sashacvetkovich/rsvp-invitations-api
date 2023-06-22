const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");

const { uploadImageController } = require("../controllers/uploadController");

router.route("/").post(authenticateUser, uploadImageController);

module.exports = router;
