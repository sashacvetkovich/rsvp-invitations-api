const mongoose = require("mongoose");

const EventSchema = mongoose.Schema({
  eventName: {
    type: String,
    required: [true, "Please provide event name"],
  },
  eventImage: {
    type: String,
    required: [true, "Please provide event image"],
  },
  eventTitle: {
    type: String,
    required: [true, "Please provide event title"],
    maxlength: [30, "Event title can not be more than 30 characters"],
  },
  eventDescription: {
    type: String,
    required: [true, "Please provide event description"],
    maxlength: [100, "Description can not be more than 100 characters"],
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
});

module.exports = mongoose.model("Event", EventSchema);
