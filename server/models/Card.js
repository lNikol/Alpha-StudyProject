const { Schema, model, ObjectId } = require("mongoose");

const Card = new Schema({
  name: { type: String, unique: true, required: true },
  descriptions: {
    type: [String],
    unique: false,
    required: true,
    validate: {
      validator: (v) => {
        return v.length <= 30;
      },
      message: (props) => `${props.path} exceeds the limit of 29`,
    },
  },
  tags: {
    type: [String],
    unique: false,
    required: false,
    validate: {
      validator: (v) => {
        return v.length <= 30;
      },
      message: (props) => `${props.path} exceeds the limit of 29`,
    },
  },
  date: { type: Number, unique: false, required: true },
  user: { type: ObjectId, required: true, ref: "User" },
  favorite: { type: Boolean, required: true, default: false },
  knowledge: { type: String, required: false, default: "unrated" }, // bad, ok, good
});

module.exports = model("Card", Card);
