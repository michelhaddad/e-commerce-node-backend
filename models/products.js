const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  categories: {
    type: [String],
    default: ['other'],
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  remainingQuantity: {
    type: Number,
    required: true,
  },
});

const Products = mongoose.model('Product', productSchema);

module.exports = Products;
