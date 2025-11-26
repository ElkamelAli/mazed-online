// models/Item.js
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  user: String,
  name: String,
  price: Number,
  picture: String,
  winner: String,
  created_at: Date,
  ends_at: Date
});

module.exports = mongoose.model('Item', ItemSchema);
