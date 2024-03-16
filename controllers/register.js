const bcrypt = require("bcrypt");
const registerRouter = require("express").Router();
const User = require("../models/user");

registerRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (!name || !username || !password) {
    return response
      .status(400)
      .json({ error: "Name, username or password missing" });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response
      .status(400)
      .json({ error: "Username already exists, choose another one" });
  }
  if (password.length < 8) {
    return response
      .status(400)
      .json({ error: "Password must be at least 8 characters long" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username: username.toLowerCase(),
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

module.exports = registerRouter;
