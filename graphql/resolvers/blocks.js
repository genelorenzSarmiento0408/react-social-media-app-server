const checkAuth = require("../../util/check-auth");
const { UserInputError } = require("apollo-server");
const User = require("../../models/User");

module.exports = {
  Mutation: {
    async blockUser(_, { blocked }, context) {
      const errors = {};
      const user = checkAuth(context);
      const username = user.username;
      try {
        // if you debug, try find({}), it will return an array
        const BlockedUser = await User.findOne({ username: blocked });
        const findblockby = await User.findOne({ username: username });
        if (!BlockedUser) {
          errors.general = "User not found";
          throw new UserInputError("User not found", { errors });
        }
        if (BlockedUser)
          await findblockby.blocks.unshift({
            blocked: blocked,
            blockedby: username,
            blockedAt: new Date().toISOString(),
          });

        BlockedUser.isBlocked = true;
        findblockby.haveBlocks = true;
        if (BlockedUser.blocks.filter((obj) => obj.blockedby === username))
          BlockedUser.blocks.shift();
        await BlockedUser.blocks.unshift({
          blocked: blocked,
          blockedby: username,
          blockedAt: new Date().toISOString(),
        });
        (await findblockby.save()) && BlockedUser.save();
        return BlockedUser;
      } catch (err) {
        console.error(err);
        throw new Error(err);
      }
    },
  },
};
