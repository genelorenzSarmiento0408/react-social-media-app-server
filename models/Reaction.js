const { model, Schema } = require("mongoose");

const reactionSchema = new Schema({
  content: String,
  createdAt: String,
  messageId: String,
  username: String,
});

module.exports = model("Reaction", reactionSchema);
