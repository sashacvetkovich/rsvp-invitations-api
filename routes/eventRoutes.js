const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const {
  createEvent,
  getAllEvents,
  getSingleEvent,
  getCurrentUserEvents,
} = require("../controllers/eventController");

router
  .route("/")
  .post(authenticateUser, createEvent)
  .get(authenticateUser, authorizePermissions("admin"), getAllEvents);

router.route("/showAllMyEvents").get(authenticateUser, getCurrentUserEvents);

router
  .route("/:id")
  .get(authenticateUser, getSingleEvent)

module.exports = router;
