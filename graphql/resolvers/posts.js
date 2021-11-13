const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");
const { validatePostInput } = require("../../util/validators");

const { AuthenticationError } = require("apollo-server");

module.exports = {
  Mutation: {
    /// ------------------------------> createPost <------------------------ ///
    async createPost(_, { body, title }, context) {
      const { errors, valid } = validatePostInput;
      const user = checkAuth(context);
      if (body.trim() === "") {
        throw new Error("Post body must not be empty");
      }
      if (title.trim() === "") {
        throw new Error("Post title must not be empty");
      }
      console.log(user);
      const newPost = new Post({
        body,
        title,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
        edited: false,
      });

      const post = await newPost.save();

      return post;
    },
    /// ------------------------------> deletePost <------------------------ ///
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return "Post deleted successfully";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    /// ------------------------------> editTtile <------------------------ ///
    async editTitle(_, { postId, newTitle }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          editedAt = new Date().toISOString();
          post.editedAt = editedAt;
          post.edited = true;
          post.title = newTitle;
          const res = await post.save();
          return {
            ...res._doc,
            id: res._id,
          };
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    /// -----------------------------> editBody <-------------------- ///
    async editBody(_, { postId, newBody }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          editedAt = new Date().toISOString();
          post.editedAt = editedAt;
          post.body = newBody;
          post.edited = true;
          const res = await post.save();
          return {
            ...res._doc,
            id: res._id,
          };
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
