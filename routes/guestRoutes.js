const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middleware/authentication");

const {
  addGuest,
  updateGuestName,
  getEventGuest,
} = require("../controllers/guestController");

router.route("/add/:eventId").post(authenticateUser, addGuest);
router.route("/event/:eventId").get(authenticateUser, getEventGuest);
router.route("/:id").patch(authenticateUser, updateGuestName);

module.exports = router;
