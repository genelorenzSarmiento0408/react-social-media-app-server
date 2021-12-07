const Post = require("../../models/Post");
const User = require("../../models/User");
const checkAuth = require("../../util/check-auth");
const { validatePostInput } = require("../../util/validators");

const { AuthenticationError, UserInputError } = require("apollo-server");

module.exports = {
  Mutation: {
    /// ------------------------------> createPost <------------------------ ///
    async createPost(_, { title, body }, context) {
      const { errors, valid } = validatePostInput(title, body);
      const user = checkAuth(context);
      const findUser = await User.findOne({ username: user.username });

      if (!valid) throw new UserInputError("Errors", { errors });
      const newPost = new Post({
        body,
        title,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
        edited: false,
        editedAt: null,
        profileUrl: findUser.ProfileUrl,
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
    /// -----------------------------new edit posts implementation ---------- ///
    async editPost(_, { postId, newTitle, newBody }, context) {
      const user = checkAuth(context);
      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          editedAt = new Date().toISOString();
          if (newTitle) {
            post.editedAt = editedAt;
            post.edited = true;
            post.title = newTitle;
          }
          if (newBody) {
            post.editedAt = editedAt;
            post.edited = true;
            post.body = newBody;
          }
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
    async findPosts(_, { from }) {
      try {
        const user = await User.findOne({ username: from });
        if (!user) {
          errors.general = "User not found";
          throw new UserInputError("User not found", { errors });
        }

        const posts = await Post.find({ username: from }).exec();
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
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
