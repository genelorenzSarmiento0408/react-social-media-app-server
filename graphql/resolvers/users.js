const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const checkAuth = require("../../util/check-auth");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators");
const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "24h" },
  );
}

module.exports = {
  Mutation: {
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
    /// ----------------------------------> deleteUser <-------------------------------------------- ///
    async deleteUser(_, { username, password }) {
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
      await user.delete();
      return {
        ...user._doc,
        id: user._id,
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
    async getUsers(_, { username, password }) {
      console.log(username, password);
    },
  },
};
