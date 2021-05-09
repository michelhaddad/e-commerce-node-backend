const Orders = require('../models/orders');
const Products = require('../models/products');

exports.indexUserOrders = async (req, res, next) => {
  try {
    const orders = await Orders.find({ userId: req.user._id }).populate({
      path: 'orderItems',
      populate: {
        path: 'item',
        model: 'Product',
      },
    });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(orders);
  } catch (e) {
    next(e);
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress } = req.body;
    let totalPrice = 0;
    for (const item of orderItems) {
      const product = await Products.findOne({ _id: item.item });
      if (!product) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        return res.json({
          message: 'One of the ordered products was not found',
        });
      }
      totalPrice += product.price * item.quantity;
    }
    const orderData = {
      status: 'ordered',
      userId: req.user._id,
      orderItems,
      totalPrice,
      shippingAddress,
    };
    let order = await Orders.create(orderData);
    order = await order
      .populate({
        path: 'orderItems',
        populate: {
          path: 'item',
          model: 'Product',
        },
      })
      .execPopulate();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(order);
  } catch (e) {
    next(e);
  }
};
