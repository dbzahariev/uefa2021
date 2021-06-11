const mongoose = require("mongoose");

// Schema
const Schema = mongoose.Schema;
const GamestSchema = new Schema({
  name: String,
  bets: Array,
  index: Number,
  finalWinner: String,
  colorTable: String,
});

// Model
const Games = mongoose.model("Games", GamestSchema);

module.exports = Games;
