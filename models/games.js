const mongoose = require("mongoose");

// Schema
const Schema = mongoose.Schema;
const GamestSchema = new Schema({
  title: String,
  body: String,
  date: {
    type: String,
    default: Date.now(),
  },
});

// Model
const Games = mongoose.model("Games", GamestSchema);

module.exports = Games;
