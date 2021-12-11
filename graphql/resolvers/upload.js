const path = require("path");
const fs = require("fs");
const Upload = require("../../models/Upload");
const checkAuth = require("../../util/check-auth");
const User = require("../../models/User");
const Post = require("../../models/Post");
const Message = require("../../models/Message");

function generateRandomString(length) {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-+_";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
module.exports = {
  Query: {
    async getUploads(_) {
      try {
        const upload = await Upload.find();
        return upload;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async changeProfile(_, { file }, context) {
      try {
        const { createReadStream, filename } = await file;
        const user = checkAuth(context);
        if (!user) throw new AuthenticationError("Unauthenticated");

        const username = await user.username;
        const userObj = await User.findOne({ username });

        const { ext } = path.parse(filename);

        const randomName = generateRandomString(20) + ext;

        const stream = createReadStream();
        const pathName = path.join(`./public/images/${randomName}`);

        await new Promise((resolve, reject) => {
          const writeStream = fs.createWriteStream(pathName);
          stream.pipe(writeStream).on("finish", resolve).on("error", reject);
        });
        const findUpload = await Upload.findOne({
          username: username,
          reason: "ChangeProfile",
        });
        if (findUpload) {
          let oldURL = findUpload.url;
          userObj.ProfileUrl = `http://lorenzsocmedserverapi.herokuapp.com/static/images/${randomName}`;
          await userObj.save();

          fs.unlink(`./public/${oldURL.slice(28)}`, () => {
            console.log("The deletion was succesful");
          });

          findUpload.url = `http://lorenzsocmedserverapi.herokuapp.com/static/images/${randomName}`;
          findUpload.save();
        } else {
          const upload = await new Upload({
            userUploaded: username,
            createdAt: new Date().toISOString(),
            url: `https://lorenzsocmedserverapi.herokuapp.com/static/images/${randomName}`,
            reason: "ChangeProfile",
          });
          await upload.save();
        }
        userObj.ProfileUrl = `https://lorenzsocmedserverapi.herokuapp.com/static/images/${randomName}`;
        const res = await userObj.save();

        const post = await Post.updateMany(
          { username: username },
          {
            profileUrl: `https://lorenzsocmedserverapi.herokuapp.com/static/images/${randomName}`,
          }
        );
        return {
          id: res.id,
          username,
          userObj,
          post,
          ...res._doc,
          ProfileUrl: `https://lorenzsocmedserverapi.herokuapp.com/static/images/${randomName}`,
        };
      } catch (err) {
        throw new Error(err);
      }
    },
    async sendMessageUpload(_, { file, to }, context) {
      const user = checkAuth(context);
      if (!user) throw new AuthenticationError("Unauthenticated");
      try {
        const { createReadStream, filename } = await file;
        const { ext } = path.parse(filename);
        const randomName = generateRandomString(20) + ext;
        const url = `http://localhost:5000/static/images/${randomName}`;
        const stream = createReadStream();
        const pathName = path.join(`./public/images/${randomName}`);

        await new Promise((resolve, reject) => {
          const writeStream = fs.createWriteStream(pathName);
          stream.pipe(writeStream).on("finish", resolve).on("error", reject);
        });
        const upload = await new Upload({
          userUploaded: user.username,
          createdAt: new Date().toISOString(),
          url,
          reason: "Message",
        });
        await upload.save();
        const message = await Message.create({
          content: url,
          createdAt: new Date().toISOString(),
          to,
          from: user.username,
        });

        return message;
      } catch (error) {
        throw error;
      }
    },
  },
};
