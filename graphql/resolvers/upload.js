const path = require("path");
const fs = require("fs");
const Upload = require("../../models/Upload");
const { GraphQLUpload } = require("graphql-upload");
function generateRandomString(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
module.exports = {
  Upload: GraphQLUpload,
  Query: {},
  Mutation: {
    uploadFile: async (parent, { file }) => {
      try {
        const { createReadStream, filename } = await file;

        const { ext } = path.parse(filename);

        const randomName = generateRandomString(12) + ext;

        const stream = createReadStream();
        const pathName = path.join(`./public/images/${randomName}`);

        await new Promise((resolve, reject) => {
          const writeStream = fs.createWriteStream(pathName);
          stream.pipe(writeStream).on("finish", resolve).on("error", reject);
        });
        const upload = await new Upload({
          url: `http://localhost:5000/static/images/${randomName}`,
        });
        await upload.save();
        return {
          upload,
        };
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
