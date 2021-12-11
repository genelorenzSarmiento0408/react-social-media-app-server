const { model, Schema } = require("mongoose");

const uploadSchema = new Schema({
  userUploaded: String,
  createdAt: String,
  url: String,
  reason: { type: String, enum: ["post", "ChangeProfile", "Message"] },
});

module.exports = model("Upload", uploadSchema);
