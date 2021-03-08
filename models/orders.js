const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const addressSchema = require('./address');

const orderItemSchema = new Schema({
    itemId: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    }
})

const orderSchema = new Schema({
    orderItems: {
        type: [orderItemSchema],
        required: true
    },
    shippingAddress: {
        type: addressSchema,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
})

const Orders = mongoose.model('Order', orderSchema);

module.exports = Orders;
