const { model, Schema } = require("mongoose");

const messageSchema = new Schema({
  content: String,
  createdAt: String,
  from: String,
  to: String,
  reactions: [
    { content: String, createdAt: String, messageId: String, username: String },
  ],
});

module.exports = model("Message", messageSchema);
