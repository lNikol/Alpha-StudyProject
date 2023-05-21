const { Schema, model } = require("mongoose");

const User = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  cards: [{ type: Object, default: [], ref: "Card" }],
  studySet: { type: Object, default: {}, ref: "StudySet" },
  roles: [{ type: String, ref: "Role" }],
});

module.exports = model("User", User);
