const path = require("path");
const fs = require("fs");
const Upload = require("../../models/Upload");
const checkAuth = require("../../util/check-auth");
const User = require("../../models/User");
const Post = require("../../models/Post");

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

        if (user) {
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
              url: `http://lorenzsocmedserverapi.herokuapp.com/static/images/${randomName}`,
              reason: "ChangeProfile",
            });
            await upload.save();
          }
          userObj.ProfileUrl = `http://lorenzsocmedserverapi.herokuapp.com/static/images/${randomName}`;
          const res = await userObj.save();

          const post = await Post.updateMany(
            { username: username },
            {
              profileUrl: `http://lorenzsocmedserverapi.herokuapp.com/static/images/${randomName}`,
            }
          );
          return {
            id: res.id,
            username,
            userObj,
            post,
            ...res._doc,
            ProfileUrl: `http://lorenzsocmedserverapi.herokuapp.com/static/images/${randomName}`,
          };
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
