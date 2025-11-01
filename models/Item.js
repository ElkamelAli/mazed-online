// models/Item.js
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  imageUrl: String
});

module.exports = mongoose.model('Item', ItemSchema);
