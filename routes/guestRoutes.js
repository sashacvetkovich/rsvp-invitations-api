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
router.route("/add/").post(authenticateUser, addGuest);
router.route("/event/:eventId").get(authenticateUser, getEventGuestList);
router.route("/customguest").post(addCustomGuest);

router
  .route("/")
  .patch(authenticateUser, updateGuestData)
  .get(getSingleGuest)
  .delete(authenticateUser, deleteGuest)

module.exports = router;
