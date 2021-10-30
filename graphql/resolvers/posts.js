import Post, { findById, find } from "../../models/Post";
import checkAuth from "../../util/check-auth";

import { AuthenticationError } from "apollo-server";
export const Mutation = {
  /// ------------------------------> createPost <------------------------ ///
  async createPost(_, { body, title }, context) {
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
      const post = await findById(postId);
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
      const post = await findById(postId);
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
      const post = await findById(postId);
      if (user.username === post.username) {
        editedAt = new Date().toISOString();
        post.editedAt = editedAt;
        post.body = newBody;
        post.edited = true;
        await post.save();
      } else {
        throw new AuthenticationError("Action not allowed");
      }
    } catch (err) {
      throw new Error(err);
    }
  },
};
export const Query = {
  async getPosts() {
    try {
      const posts = await find().sort({ createdAt: -1 });
      return posts;
    } catch (err) {
      throw new Error(err);
    }
  },
  async getPost(_, { postId }) {
    try {
      const post = await findById(postId);
      if (post) {
        return post;
      } else {
        throw new Error("Post not found");
      }
    } catch (err) {
      throw new Error(err);
    }
  },
};
