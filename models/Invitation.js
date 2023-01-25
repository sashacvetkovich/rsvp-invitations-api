const mongoose = require("mongoose");

const InvitationSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    require: [true, "Please provide invitation name"],
    maxlength: [100, "Name can not be more than 100 characters"],
  },
  category: {
    type: String,
    required: [true, "Please provide invitaion category"],
    maxlength: [20, "Category name can not be more than 20 characters"],
  },
  mainStyles: {
    type: Object,
    required: [true, "Please provide product styles"],
  },
  backgroundImage: {
    type: String,
    default: "/uploads/example.jpeg",
  },
  exampleData: {
    type: Object,
    required: [true, "Please provide example data"],
  },
  previewImage: {
    type: String,
    required: [true, "Please provide preview image for invitaion"],
  },
});

module.exports = mongoose.model("Invitation", InvitationSchema);
