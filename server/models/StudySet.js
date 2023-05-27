const { Schema, model } = require("mongoose");

const StudySet = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    maxLength: 16,
  },
  files: { type: [Object], default: [], ref: "File" },
  public: { type: Boolean, default: true, required: true },
  cards: {
    type: [Object],
    default: [],
    ref: "Card",
    validate: {
      validator: (v) => {
        return v.length <= 1000;
      },
      message: (props) => `${props.path} exceeds the limit of 1000`,
    },
  },
  parentFolder: { type: String, default: "" },
  color: { type: String, unique: false, required: true, default: "Gray" },
  topic: { type: String, unique: true, required: true, maxLength: 48 },
  //   subsets: [{ ref: "Subset" }],
});

module.exports = model("StudySet", StudySet);
