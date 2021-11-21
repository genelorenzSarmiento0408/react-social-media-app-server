const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: String,
  message: String,
  createdAt: String,
});

module.exports = model("User", userSchema);
