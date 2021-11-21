const Message = require("../../models/Message");

module.exports = {
  Query: {
    messages: () => messages,
  },
};
