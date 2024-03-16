const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
  },
  title: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  modified: {
    type: Date,
  },
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;

    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "numeric",
      second: "numeric",
      minute: "numeric",
    };

    returnedObject.modifiedTime = new Date(
      returnedObject.modified
    ).toLocaleDateString("en-GB", options);
    delete returnedObject.modified;
  },
});

module.exports = mongoose.model("Note", noteSchema);
