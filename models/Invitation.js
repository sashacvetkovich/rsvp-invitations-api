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
  previewImage: {
    type: String,
    required: [true, "Please provide preview image for invitaion"],
  },
  backgroundImage: {
    type: String,
    required: [true, "Please provide background image for invitaion"],
  },
  templateData: [
    {
      itemName: {
        type: String,
        trim: true,
        required: [true, "Please provide itemName"],
      },
      itemStyles: {
        type: Object,
        required: [true, "Please provide itemName"],
      },
      isEditable: {
        type: Boolean,
        required: [true, "Please provide isEditable"],
      },
      exampleText: {
        type: String,
        required: [true, "Please provide exampleText"],
      },
      publicName: {
        type: String,
        required: [true, "Please provide public name"],
      },
      itemType: {
        type: String,
        enum: ["image", "text", "div", "span"],
      },
    },
  ],
});

module.exports = mongoose.model("Invitation", InvitationSchema);
