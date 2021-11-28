const { model, Schema } = require("mongoose");

const uploadSchema = new Schema({
  url: String,
});

module.exports = model("Upload", uploadSchema);
