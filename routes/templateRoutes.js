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
  getAllTemplateCategories,
  createTemplateCategory
} = require("../controllers/templateController");

router
  .route("/")
  .post([authenticateUser, verifyAdmin], createTemplate)
  .get(getAllTemplates);

router
  .route("/category")
  .post([authenticateUser, verifyAdmin], createTemplateCategory)
  .get(getAllTemplateCategories);

router
  .route("/:id")
  .get(getSingleTemplate)

module.exports = router;
