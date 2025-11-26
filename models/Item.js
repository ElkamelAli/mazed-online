// models/Item.js
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  user: String,
  name: String,
  price: Number,
  picture: String,
  winner: String,
  created_at: {type: Date},
  ends_at: {type: Date}
});

module.exports = mongoose.model('Item', ItemSchema);
