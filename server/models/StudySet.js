const { Schema, model } = require("mongoose");

const StudySet = new Schema({
  name: { type: String, unique: true, required: true },
  files: [{ type: Object, default: [], ref: "File" }],
  public: { type: Boolean, default: true, required: true },
  shareLink: { type: String, unique: true, required: true },
  color: { type: String, unique: false, required: true, default: "Gray" },
  topic: { type: String, unique: true, required: true, maxLength: 48 },
  //   subsets: [{ ref: "Subset" }],
});

module.exports = model("StudySet", StudySet);
