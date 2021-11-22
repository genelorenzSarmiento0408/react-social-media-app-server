const { gql } = require("apollo-server");

module.exports = gql`
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
  type User {
    id: ID!
    email: String!
    token: String
    username: String!
    createdAt: String!
    Bio: String
    role: String
  }
  type Message {
    id: ID!
    username: String!
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
    messages: [Message!]
    getPosts: [Post]!
    getPost(postId: ID!): Post
    getUsers: [User]!
    getUser(username: String!): User
  }
  type Mutation {
    createComment(postId: String!, body: String!): Post!
    createPost(body: String!, title: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    deletePost(postId: ID!): String!
    deleteUser(username: String!, password: String!): User!
    editBio(username: String!, newBio: String!): User!
    editBody(postId: ID!, newBody: String!): Post!
    editEmail(username: String!, email: String!): User!
    editpassword(
      username: String!
      password: String!
      newPassword: String!
    ): User!
    editTitle(postId: ID!, newTitle: String!): Post!
    likePost(postId: ID!): Post!
    login(username: String!, password: String!): User!
    postMessage(username: String!, content: String!): ID!
    register(registerInput: RegisterInput): User!
  }
`;
