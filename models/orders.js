const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const addressSchema = require('./address');

const orderItemSchema = new Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const orderSchema = new Schema({
  orderItems: {
    type: [orderItemSchema],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  shippingAddress: {
    type: addressSchema,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

const Orders = mongoose.model('Order', orderSchema);

module.exports = Orders;
