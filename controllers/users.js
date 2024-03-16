const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  const userInDB = await User.findById(request.user.toString()).populate(
    "notes"
  );
  if (!request.user || !userInDB) {
    return response.status(401).json({ error: "Unauthorized user" });
  }
  response.status(200).json(userInDB);
});

usersRouter.get("/:id", async (request, response) => {
  const userInDB = await User.findById(request.params.id).populate("notes");
  if (userInDB._id.toString() !== request.params.id) {
    return response.status(401).json({ error: "Unauthorized user" });
  }

  response.json(userInDB);
});

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

module.exports = usersRouter;
