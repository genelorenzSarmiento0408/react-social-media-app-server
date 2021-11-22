const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: String,
  content: String,
  createdAt: String,
  from: String,
  to: String,
});

module.exports = model("Message", userSchema);
