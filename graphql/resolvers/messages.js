const Message = require("../../models/Message");
const messages = [];
module.exports = {
  Query: {
    messages: () => messages,
  },
};
