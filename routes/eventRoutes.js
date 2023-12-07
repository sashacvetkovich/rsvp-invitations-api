const express = require("express");
const router = express.Router();

const {
  authenticateUser
} = require("../middleware/authentication");

const {
  createEvent,
  getSingleEvent,
  getCurrentUserEvents,
  enableCustomGuests,
  checkEventPath,
  getCustomGuestEvent
} = require("../controllers/eventController");

router.route("/").post(authenticateUser, createEvent);
router.route("/checkpath").post(authenticateUser, checkEventPath);
router.route("/enablecustomguests").post(authenticateUser, enableCustomGuests);
router.route("/myevents").get(authenticateUser, getCurrentUserEvents);
router.route("/customevent/:eventPath/:customShareId").get(getCustomGuestEvent);
router.route("/:id").get(authenticateUser, getSingleEvent);

module.exports = router;
