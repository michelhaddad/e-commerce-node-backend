const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productImageSchema = new Schema({
  img: {
    data: Buffer,
    contentType: String
  },
  dateAdded: {
    type: Date,
    default: Date.now
  },
})

const ProductImages = mongoose.model('ProductImage', productImageSchema);

module.exports = ProductImages;
