const Message = require("../../models/Message");
const { AuthenticationError, UserInputError } = require("apollo-server");
const checkAuth = require("../../util/check-auth");
const User = require("../../models/User");

module.exports = {
  Query: {},
  Mutation: {
    /// ----------------------------------> sendMessage <-------------------------------------------- ///
    async sendMessage(parent, { to, content }, context) {
      try {
        const user = checkAuth(context);
        if (!user) throw new AuthenticationError("Unauthenticated");

        const recipient = await User.findOne(to);

        if (!recipient) throw new UserInputError("User not found");

        if (content.trim() === "") throw new UserInputError("Message is Empty");

        const message = await Message.create({
          content,
          createdAt: new Date().toISOString(),
          to,
          from: user.username,
        });

        return message;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
