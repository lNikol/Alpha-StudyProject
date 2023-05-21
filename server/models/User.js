const { Schema, model } = require("mongoose");

const User = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  cards: [{ type: Array, required: false, ref: "Card" }],
  roles: [{ type: String, ref: "Role" }],
});

module.exports = model("User", User);
