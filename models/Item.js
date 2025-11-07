// models/Item.js
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  user: String,
  name: String,
  price: Number,
  imageUrl: String
});

module.exports = mongoose.model('Item', ItemSchema);
