const mongoose = require("mongoose");

const GuestSchema = mongoose.Schema({
  guestName: { type: String, required: true },
  isComming: {
    type: Boolean,
    default: false,
  },
  event: {
    type: mongoose.Schema.ObjectId,
    ref: "Event",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

const Guest = mongoose.model("Guest", GuestSchema);

module.exports = { GuestSchema, Guest };
