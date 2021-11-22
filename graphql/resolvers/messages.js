const Message = require("../../models/Message");

module.exports = {
  Query: {
    messages: () => messages,
  },
  Mutation: {
    postMessage: (parent, { username, content }) => {
      const id = messages.length;
      messages.push({
        id,
        username,
        content,
        createdAt: new Date().toISOString(),
      });
      return id;
    },
  },
};
