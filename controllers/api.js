const loginRouter = require("./login");
const notesRouter = require("./notes");
const usersRouter = require("./users");
const registerRouter = require("./register");
const middleware = require("../utils/middleware");

const apiRouter = require("express").Router();

apiRouter.use(middleware.tokenExtractor);

apiRouter.use("/login", loginRouter);
apiRouter.use("/notes", middleware.userExtractor, notesRouter);
apiRouter.use("/users", middleware.userExtractor, usersRouter);
apiRouter.use("/register", registerRouter);

apiRouter.use(middleware.unknownEndpoint);

module.exports = apiRouter;