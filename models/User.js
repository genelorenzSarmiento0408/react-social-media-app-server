const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
  bio: String,
  role: String,
});

module.exports = model("User", userSchema);
