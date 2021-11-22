const Message = require("../../models/Message");
const messages = [];
module.exports = {
  Query: {
    // async messages() {
    //   try {
    //     await Message.find().sort({ createdAt: -1 });
    //   } catch (err) {
    //     throw new Error(err);
    //   }
    // },
    messages: () => messages,
  },
  Mutation: {
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
