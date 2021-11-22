const Message = require("../../models/Message");
const messages = [];
module.exports = {
  Query: {
    async messages() {
      await messages;
    },
  },
  Mutation: {
    async PostMessage(parent, { username, content }) {
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
      const Message = await Message.save();
      return newMessage;
    },
    // postMessage: (parent, { username, content }) => {
    //   const id = messages.length;
    //   messages.push({
    //     id,
    //     username,
    //     content,
    //     createdAt: new Date().toISOString(),
    //   });
    //   const newMessage = new Message({
    //     id,
    //     username,
    //     content,
    //     createdAt: new Date().toISOString(),
    //   });
    //   return id;
    // },
  },
};
