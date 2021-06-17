const mongoose = require("mongoose");

// Schema
const Schema = mongoose.Schema;
const ChatsSchema = new Schema({
  user: String,
  messages: Array,
});

// Model
const Chats = mongoose.model("Chats", ChatsSchema);

module.exports = Chats;
