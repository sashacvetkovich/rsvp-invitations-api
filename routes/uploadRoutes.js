const express = require("express");
const router = express.Router();

const { uploadImage } = require("../controllers/uploadController");

router.route("/").post(uploadImage);

module.exports = router;
