const postsResolvers = require("./posts");
const usersResolvers = require("./users");
const commentsResolvers = require("./comments");
const messagesResolvers = require("./messages");
const uploadResolvers = require("./upload");

module.exports = {
  Upload: {
    ...uploadResolvers.Upload,
  },
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...postsResolvers.Query,
    ...usersResolvers.Query,
    ...messagesResolvers.Query,
    ...uploadResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation,
    ...messagesResolvers.Mutation,
    ...uploadResolvers.Mutation,
  },
};
