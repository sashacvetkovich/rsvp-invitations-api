const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middleware/authentication");

const {
  addGuest,
  updateGuestName,
  getEventGuestList,
  getSingleGuest,
  updateGuestAnswer
} = require("../controllers/guestController");

router.route("/updateAnswer").post(updateGuestAnswer)
router.route("/add/:eventId").post(authenticateUser, addGuest);
router.route("/event/:eventId").get(authenticateUser, getEventGuestList);

router
  .route("/:id")
  .patch(authenticateUser, updateGuestName)
  .get(getSingleGuest);


module.exports = router;