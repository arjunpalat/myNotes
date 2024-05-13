require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const PING_URLS = process.env.PING_URLS.split(" ");
const MINUTES = process.env.MINUTES;

module.exports = {
  MONGODB_URI,
  PORT,
  PING_URLS,
  MINUTES,
};
