const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
  Bio: String,
  role: {
    type: String,
    enum: ["student", "user", "teacher", "admin"],
  },
});

module.exports = model("User", userSchema);
