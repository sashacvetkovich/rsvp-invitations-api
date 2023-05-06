const mongoose = require("mongoose");
const { GuestSchema } = require("./Guest");

const EventSchema = mongoose.Schema({
  eventName: {
    type: String,
    required: [true, "Please provide event name"],
  },
  venueName: {
    type: String,
    required: [true, "Please provide venue name"],
    maxlength: [30, "Venue name can not be more than 30 characters"],
  },
  venueAddress: {
    type: String,
    required: [true, "Please provide venue address"],
    maxlength: [30, "Venue address can not be more than 30 characters"],
  },
  eventDescription: {
    type: String,
    required: [true, "Please provide event description"],
    maxlength: [100, "Description can not be more than 100 characters"],
  },
  eventDate: {
    type: Date,
    required: [true, "Please provide event date"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  invitation: {
    type: mongoose.Schema.ObjectId,
    ref: "Invitation",
    required: true,
  },
  customData: {
    type: [
      {
        id: String,
        itemName: String,
        itemType: {
          type: String,
          enum: ["text", "image"],
        },
        value: String,
      },
    ],
    required: [true, "Please custom data"],
  },
  guestList: [GuestSchema],
});

module.exports = mongoose.model("Event", EventSchema);
