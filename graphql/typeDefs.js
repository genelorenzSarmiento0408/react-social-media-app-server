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
    token: String!
    username: String!
    createdAt: String!
    Bio: String
    role: String!
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
    AboutUser: String
  }
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
    getUsers(
      username: String!
      password: String!
      Bio: String!
      role: String!
    ): User!
  }
  type Mutation {
    editBio(username: String!, newBio: String!): User!
    createComment(postId: String!, body: String!): Post!
    createPost(body: String!, title: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    deletePost(postId: ID!): String!
    deleteUser(username: String!, password: String!): User!
    editBody(postId: ID!, newBody: String!): Post!
    editpassword(
      username: String!
      password: String!
      newPassword: String!
    ): User!
    editTitle(postId: ID!, newTitle: String!): Post!
    likePost(postId: ID!): Post!
    login(username: String!, password: String!): User!
    register(registerInput: RegisterInput): User!
  }
`;
