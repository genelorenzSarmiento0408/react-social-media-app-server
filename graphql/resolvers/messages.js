const Message = require("../../models/Message");
const {
  AuthenticationError,
  UserInputError,
  ForbiddenError,
} = require("apollo-server");
const checkAuth = require("../../util/check-auth");
const User = require("../../models/User");
const Reaction = require("../../models/Reaction");

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
    async reactToMessage(_, { id, content }, context) {
      let user = checkAuth(context);
      const reactions = ["❤️", "😆", "😯", "😢", "😡", "👍", "👎"];
      try {
        if (!reactions.includes(content)) {
          throw new UserInputError("Invalid Reaction");
        }
        const username = user ? user.username : "";
        user = await User.findOne({ username });
        if (!user) throw new AuthenticationError("Unauthenticated");

        const message = await Message.findById(id);
        if (!message) throw new UserInputError("Message not found");

        if (message.from !== user.username && message.to !== user.username) {
          throw new ForbiddenError("Unauthorized");
        }
        let reaction = await Reaction.findOne({
          messageId: message.id,
          reactedBy: user.username,
        });

        if (reaction) {
          message.reactions.shift();

          await message.reactions.unshift({
            messageId: message.id,
            username: user.username,
            content,
            createdAt: new Date().toISOString(),
          });
          await message.save();
          reaction.content = content;
          await reaction.save();
        } else {
          await message.reactions.unshift({
            messageId: message.id,
            content,
            createdAt: new Date().toISOString(),
          });
          await message.save();
          reaction = await Reaction.create({
            messageId: message.id,

            content,
            createdAt: new Date().toISOString(),
            reactedBy: user.username,
          });
        }
        return reaction;
      } catch (error) {
        throw error;
      }
    },
    async deleteMessage(_, { messageId }, context) {
      const user = checkAuth(context);
      if (!user) throw new AuthenticationError("Unauthenticated");
      try {
        const message = await Message.findById(messageId);
        if (!message) throw new UserInputError("Can't find the message");
        if (user.username !== message.from) {
          throw new ForbiddenError("Action not allowed");
        }
        await message.delete();
        return "Message deleted successfully";
      } catch (error) {
        throw error;
      }
    },
  },
};
