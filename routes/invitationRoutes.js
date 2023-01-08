const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  authorizePermissions,
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
  .post([authenticateUser, authorizePermissions("admin")], createInvitation)
  .get(getAllInvitations);

router
  .route("/:id")
  .get(getSingleInvitation)
  .patch([authenticateUser, authorizePermissions("admin")], updateInvitation)
  .delete([authenticateUser, authorizePermissions("admin")], deleteInvitation);

module.exports = router;
