const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  verifyAdmin,
} = require("../middleware/authentication");

const {
  createTemplate,
  getAllInvitations,
  getSingleInvitation,
  updateInvitation,
  deleteInvitation,
} = require("../controllers/templateController");

router
  .route("/")
  .post([authenticateUser, verifyAdmin], createTemplate)
  .get(getAllInvitations);

router
  .route("/:id")
  .get(getSingleInvitation)
  .patch([authenticateUser, verifyAdmin], updateInvitation)
  .delete([authenticateUser, verifyAdmin], deleteInvitation);

module.exports = router;
