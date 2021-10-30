const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
  bio: String,
  role: String,
  post: {
    type: Schema.Types.ObjectId,
    ref: "posts",
  },
});

module.exports = model("User", userSchema);
