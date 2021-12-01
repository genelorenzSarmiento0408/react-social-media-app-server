const postsResolvers = require("./posts");
const usersResolvers = require("./users");
const commentsResolvers = require("./comments");
const messagesResolvers = require("./messages");
const uploadResolvers = require("./upload");
const blockResolvers = require("./blocks");
const { GraphQLUpload } = require("graphql-upload");

module.exports = {
  Upload: GraphQLUpload,
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
    ...blockResolvers.Mutation,
  },
};
