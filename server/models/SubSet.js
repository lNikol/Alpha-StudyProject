const { Schema, model } = require("mongoose");

const Subset = new Schema({
  name: { type: String, required: true, unique: true },
  cards: [{ required: false, ref: "Card" }],
});

module.exports = model("Subset", Subset);
