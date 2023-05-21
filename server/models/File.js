const { Schema, model, ObjectId } = require("mongoose");

const File = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: Number, default: 0 },
  path: { type: String, default: "" },
  user: { type: ObjectId, ref: "User" },
  parent: { type: ObjectId, ref: "StudySet" },
});
module.exports = model("File", File);
