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
  enableCustomGuests
} = require("../controllers/eventController");

router.route("/").post(authenticateUser, createEvent);
router.route("/enablecustomguests").post(authenticateUser, enableCustomGuests);
router.route("/myevents").get(authenticateUser, getCurrentUserEvents);
router.route("/:id").get(authenticateUser, getSingleEvent);

module.exports = router;
