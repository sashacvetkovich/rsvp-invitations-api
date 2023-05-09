const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  verifyAdmin,
} = require("../middleware/authentication");

const {
  createInvitation,
  getAllInvitations,
  getSingleInvitation,
  updateInvitation,
  deleteInvitation,
} = require("../controllers/invitationController");

router
  .route("/")
  .post([authenticateUser, verifyAdmin], createInvitation)
  .get(getAllInvitations);

router
  .route("/:id")
  .get(getSingleInvitation)
  .patch([authenticateUser, verifyAdmin], updateInvitation)
  .delete([authenticateUser, verifyAdmin], deleteInvitation);

module.exports = router;
