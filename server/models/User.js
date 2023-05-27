const { Schema, model } = require("mongoose");

const User = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
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
  studySets: { type: [Object], default: [], required: true, ref: "StudySet" },
  roles: [{ type: String, ref: "Role" }],
  diskSpace: { type: Number, default: 1024 ** 2 * 100 }, // ~ 104 mb
  usedSpace: { type: Number, default: 0 },
});

module.exports = model("User", User);
