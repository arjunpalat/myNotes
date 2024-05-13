const config = require("./utils/config");
const path = require("path");
const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const apiRouter = require("./controllers/api");
const cron = require("node-cron");
import("node-fetch");

mongoose.set("strictQuery", false);

logger.info("Connecting to MongoDB");

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((error) => {
    logger.error("Error connecting to MongoDB:", error.message);
  });

  const { PING_URLS, MINUTES } = require("./utils/config");

  cron.schedule(`*/${MINUTES} * * * *`, async () => {
    try {
      for (const url of PING_URLS) {
        const response = await fetch(url);
        if (response.ok) {
          console.log(`Pinged at ${new Date()}`);
        }
      }
    } catch (error) {
      console.error(error);
    }
  });

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api", apiRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
