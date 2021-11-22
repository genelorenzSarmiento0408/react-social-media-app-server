const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  MONGODB: process.env.MONGODB,
  SECRET_KEY: process.env.SECRET_KEY,
};

console.log(process.env.MONGODB || "No MongoDB String found");
console.log(process.env.SECRET_KEY || "No Secret Key found");
