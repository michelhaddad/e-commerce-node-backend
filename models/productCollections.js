const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
});

const ProductCollection = mongoose.model(
  'ProductCollections',
  collectionSchema,
);

module.exports = ProductCollection;
