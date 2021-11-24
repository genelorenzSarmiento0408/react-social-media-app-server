const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  content: String,
  createdAt: String,
  createdAtReadable: String,
  from: String,
  to: String,
});

module.exports = model("Message", userSchema);
