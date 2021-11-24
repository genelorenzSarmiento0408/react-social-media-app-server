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

        const recipient = await User.findOne({ username: to });

        if (!recipient) throw new UserInputError("User not found");
        else if (recipient.username === user.username) {
          throw new UserInputError("You cant message yourself");
        }
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
