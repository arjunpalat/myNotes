const notesRouter = require("express").Router();
const Note = require("../models/note");
const User = require("../models/user");

notesRouter.get("/", async (request, response) => {
  const notes = await Note.find({}).populate("user", { username: 1, name: 1 });

  response.json(notes);
});

notesRouter.post("/", async (request, response) => {
  const body = request.body;
  const userInDB = await User.findById(request.user);
  if (!request.user || !userInDB) {
    return response.status(401).json({ error: "Unauthorized user" });
  }

  const note = new Note({
    content: body.content,
    title: body.title,
    user: userInDB._id,
    modified: new Date(),
  });

  const savedNote = await note.save();
  userInDB.notes = userInDB.notes.concat(savedNote._id);
  await userInDB.save();

  response.status(201).json(savedNote);
});

notesRouter.delete("/:id", async (request, response, next) => {
  const noteInDB = await Note.findById(request.params.id);
  const userInDB = await User.findById(request.user);
  if (
    !request.user ||
    !userInDB ||
    !noteInDB ||
    noteInDB.user.toString() !== userInDB._id.toString()
  ) {
    return response.status(401).json({ error: "Unauthorized user" });
  }

  await Note.findByIdAndDelete(request.params.id);
  userInDB.notes = userInDB.notes.filter(
    (note) => note._id.toString() !== request.params.id
  );
  await userInDB.save();

  return response.status(204).end();
});

notesRouter.put("/:id", async (request, response, next) => {
  const body = request.body;
  const noteInDB = await Note.findById(request.params.id);
  const userInDB = await User.findById(request.user);
  if (
    !request.user ||
    !userInDB ||
    !noteInDB ||
    noteInDB.user.toString() !== userInDB._id.toString()
  ) {
    return response.status(401).json({ error: "Unauthorized user" });
  }

  const note = {
    content: body.content,
    title: body.title,
    modified: new Date(),
    user: userInDB._id,
  };

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

module.exports = notesRouter;
