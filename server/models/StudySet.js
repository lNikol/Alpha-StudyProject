const { Schema, model } = require("mongoose");

const StudySet = new Schema({
  name: { type: String, unique: true, required: true },
  files: [{ type: Object, default: [], ref: "File" }],
  //   subsets: [{ ref: "Subset" }],
});

module.exports = model("StudySet", StudySet);
