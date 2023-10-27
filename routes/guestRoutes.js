const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middleware/authentication");

const {
  addGuest,
  addCustomGuest,
  updateGuestData,
  getEventGuestList,
  getSingleGuest,
  updateGuestAnswer,
  deleteGuest
} = require("../controllers/guestController");

router.route("/updateAnswer").post(updateGuestAnswer);
router.route("/add/:eventId").post(authenticateUser, addGuest);
router.route("/event/:eventId").get(authenticateUser, getEventGuestList);
router.route("/customguest").post(addCustomGuest);

router
  .route("/:id")
  .patch(authenticateUser, updateGuestData)
  .get(getSingleGuest)
  .delete(deleteGuest)

module.exports = router;
