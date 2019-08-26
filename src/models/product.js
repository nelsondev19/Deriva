const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  category: String,
  name: String,
  price: Number,
  //cover: String,
  imageURL: String,
  public_id: String,
  //timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
