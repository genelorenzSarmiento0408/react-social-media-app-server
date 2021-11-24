const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators");
const Post = require("../../models/Post");
const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      Bio: user.Bio,
    },
    SECRET_KEY,
    { expiresIn: "2d" },
  );
}

module.exports = {
  Mutation: {
    /// ----------------------------------> deleteUser <-------------------------------------------- ///
    async deleteUser(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);
      const user = await User.findOne({ username });

      try {
        if (!valid) {
          throw new UserInputError("Errors", { errors });
        }
        if (!user) {
          errors.general = "User not found";
          throw new UserInputError("User not found", { errors });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          errors.general = "Wrong username or password";
          throw new UserInputError("Wrong username or  password", { errors });
        }

        const post = await Post.findOne({ username });
        if (post) {
          console.log("find posts, deleting \n");
          await new Promise((resolve) => setTimeout(resolve, 5000));
          await post.delete({ username: username });
          console.log("deleted");
        }
        await user.delete();
        return "User Deleted";
      } catch (err) {
        throw new Error(err);
      }
    },
    /// ----------------------------------> editBio <----------------------------------------------- ///
    async editBio(_, { username, newBio }) {
      const user = await User.findOne({ username });

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      user.Bio = newBio;

      const res = await user.save();

      return {
        ...res._doc,
        id: res._id,
      };
    },
    /// ----------------------------------> editEmail <----------------------------------------------- ///
    async editEmail(_, { username, newEmail }) {
      const { errors } = "";
      const user = await User.findOne({ username });

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      user.email = newEmail;

      const res = await user.save();

      return {
        ...res._doc,
        id: res._id,
      };
    },
    /// ----------------------------------> editPassword <-------------------------------------------- ///
    async editpassword(_, { password, newPassword, username }) {
      const { errors, valid } = validateLoginInput(username, password);
      const user = await User.findOne({ username });

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong username or password";
        throw new UserInputError("Wrong username or  password", { errors });
      }

      newPassword = await bcrypt.hash(newPassword, 12);
      user.password = newPassword;

      const res = await user.save();
      const token = generateToken(user);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },

    /// ----------------------------------> LOGIN <-------------------------------------------- ///
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);
      //if the user is valid in validators
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ username });
      // if user is not found
      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      //if the user's input password has match the database password
      if (!match) {
        errors.general = "Wrong username or password";
        throw new UserInputError("Wrong username or  password", { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    // -----------------------------> Register <------------------------------ ///
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } },
    ) {
      // Validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword,
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      // TODO: Make sure user doesnt already exist
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }
      const foundemail = await User.findOne({ email });
      if (foundemail) {
        throw new UserInputError("This email is already in use", {
          errors: {
            email: "This email is already in use",
          },
        });
      }
      // hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
  Query: {
    async getUsers() {
      try {
        const users = await User.find().sort({ createdAt: -1 });
        return users;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getUser(_, { username }) {
      try {
        const user = await User.findOne({ username });
        if (user) {
          return user;
        } else throw new Error("User not found");
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
