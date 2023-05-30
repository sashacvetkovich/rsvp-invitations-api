const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  verifyAdmin,
} = require("../middleware/authentication");

const {
  createEvent,
  getSingleEvent,
  getCurrentUserEvents,
} = require("../controllers/eventController");

router.route("/").post(authenticateUser, createEvent);

router.route("/showAllMyEvents").get(authenticateUser, getCurrentUserEvents);

router.route("/:id").get(authenticateUser, getSingleEvent);

module.exports = router;
