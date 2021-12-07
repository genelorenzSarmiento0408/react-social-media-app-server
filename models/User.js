const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
  Bio: String,
  isBlocked: Boolean,
  haveBlocks: Boolean,
  blocks: [
    {
      blocked: String,
      blockedby: String,
      blockedAt: String,
    },
  ],
  role: {
    type: String,
    enum: ["student", "user", "teacher", "admin"],
  },
  ProfileUrl: String,
});

module.exports = model("User", userSchema);
