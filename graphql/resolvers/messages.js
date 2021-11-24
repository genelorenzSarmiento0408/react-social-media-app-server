const Message = require("../../models/Message");
const { AuthenticationError, UserInputError } = require("apollo-server");
const checkAuth = require("../../util/check-auth");
const User = require("../../models/User");

module.exports = {
  Query: {
    async getMessages(parent, { from }, context) {
      try {
        const user = checkAuth(context);
        if (!user) throw new AuthenticationError("Unauthenticated");

        const otherUser = await User.findOne({ username: from });
        if (!otherUser) throw new UserInputError("User not found");

        const usernames = [user.username, otherUser.username];
        const messages = await Message.find({
          from: usernames,
          to: usernames,
        }).sort({ createdAt: -1 });

        return messages;
      } catch (err) {
        throw err;
      }
    },
  },
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
