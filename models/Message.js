const { model, Schema } = require("mongoose");

const messageSchema = new Schema({
  content: String,
  createdAt: String,
  from: String,
  to: String,
});

module.exports = model("Message", messageSchema);
