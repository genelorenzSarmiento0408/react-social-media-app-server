const Message = require("../../models/Message");
const messages = [];
module.exports = {
  Query: {
    messages: () => messages,
  },
  Mutation: {
    /// ----------------------------------> postMessage <-------------------------------------------- ///
    async postMessage(parent, { username, content }) {
      const id = messages.length;
      messages.push({
        id,
        username,
        content,
        createdAt: new Date().toISOString(),
      });

      const newMessage = new Message({
        id,
        username,
        content,
        createdAt: new Date().toISOString(),
      });

      const message = await newMessage.save();

      return id;
    },
  },
};
