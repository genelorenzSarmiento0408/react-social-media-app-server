const { gql } = require("apollo-server-express");
const {
  GraphQLUpload,
  graphqlUploadExpress, // A Koa implementation is also exported.
} = require("graphql-upload");

module.exports = gql`
  # The implementation for this scalar is provided by the
  # 'GraphQLUpload' export from the 'graphql-upload' package
  # in the resolver map below.
  scalar Upload

  type File {
    url: String
  }
  type Post {
    id: ID!
    body: String!
    title: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
    edited: Boolean!
    editedAt: String
  }
  type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }
  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }
  type BlockUser {
    id: ID!
    blockedby: String!
    blocked: String!
    blockedAt: String!
  }
  type User {
    id: ID!
    email: String!
    token: String
    username: String!
    createdAt: String!
    latestMessage: Message
    isBlocked: Boolean
    haveBlocks: Boolean
    blocks: [BlockUser]!
    Bio: String
    role: String
  }
  type Message {
    id: ID!
    content: String!
    createdAt: String!
    from: String!
    to: String!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
    AboutUser: String
  }

  type Query {
    findPosts(from: String!): [Post]!
    getPosts: [Post]!
    getPost(postId: ID!): Post!
    getUsers: [User]!
    getUser(username: String!): User
    getMessages(from: String!): [Message]!
  }
  type Mutation {
    blockUser(blocked: String!): User!
    createComment(postId: String!, body: String!): Post!
    createPost(body: String!, title: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    deletePost(postId: ID!): String!
    deleteUser(username: String!, password: String!): String!
    editBio(username: String!, newBio: String!): User!
    editBody(postId: ID!, newBody: String!): Post!
    editEmail(username: String!, newEmail: String!): User!
    editpassword(
      username: String!
      password: String!
      newPassword: String!
    ): User!
    editTitle(postId: ID!, newTitle: String!): Post!
    likePost(postId: ID!): Post!
    login(username: String!, password: String!): User!
    register(registerInput: RegisterInput): User!
    sendMessage(to: String!, content: String!): Message!
    # Multiple uploads are supported. See graphql-upload docs for details.
    uploadFile(file: Upload!): File!
  }
`;
