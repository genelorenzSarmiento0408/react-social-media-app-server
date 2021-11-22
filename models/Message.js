const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: String,
  content: String,
  createdAt: String,
});

module.exports = model("Message", userSchema);
