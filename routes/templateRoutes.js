const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  verifyAdmin,
} = require("../middleware/authentication");

const {
  createTemplate,
  getAllTemplates,
  getSingleTemplate,
} = require("../controllers/templateController");

router
  .route("/")
  .post([authenticateUser, verifyAdmin], createTemplate)
  .get(getAllTemplates);

router
  .route("/:id")
  .get(getSingleTemplate)

module.exports = router;
